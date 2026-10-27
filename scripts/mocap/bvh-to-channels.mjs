// Convert a BVH motion-capture clip into Rift Duel pose channels (dist/rig-pose.js CHANNELS).
// The output is a looping key list for sampleClip, so a real run or walk cycle becomes authored
// keys the animators can blend like any other pose. Root travel is dropped (the simulation owns
// it); support feet are still planted by plantSupportFeet, so legs here mainly shape swing and bob.
// Usage: node scripts/mocap/bvh-to-channels.mjs --in <file.bvh> --out dist/clips/<name>.js --name run
//        [--keys 16] [--cycle auto|start:end] [--mirror] [--source "CMU 09_01 via cgspeed BVH (free for research and commercial use)"]
//        --dump <json>: write every frame's channels plus raw world measurements (for studying a take, no clip needed)
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {Vector3,Matrix4,Quaternion,Euler} from '../../dist/vendor/three.module.js';
const args=Object.fromEntries(process.argv.slice(2).map((a,i,all)=>a.startsWith('--')?[a.slice(2),all[i+1]?.startsWith('--')||all[i+1]===undefined?true:all[i+1]]:[]).filter(Boolean));
if(!args.in||!(args.out||args.dump))throw new Error('--in <bvh> and --out <js> (or --dump <json>) are required');
const CHANNELS=['bodyX','bodyY','bodyZ','hipYaw','lean','twist','side','hx','hy','hz','neckY','neckZ','lax','lay','laz','rax','ray','raz','le','re','llx','llz','rlx','rlz','lk','rk','lw','rw','lc','rc','bodyPitch','bodyRoll','lwx','lwz','rwx','rwz'];
// ---- BVH parse --------------------------------------------------------------------------------
function parseBvh(text){
 const tokens=text.split(/\s+/).filter(Boolean);let i=0;const joints=[];let root=null;
 const readJoint=(parent,isEnd=false)=>{
  const name=isEnd?parent.name+'_end':tokens[i++];const j={name,parent,offset:[0,0,0],channels:[],children:[],end:isEnd};joints.push(j);
  if(tokens[i++]!=='{')throw new Error('expected { at '+name);
  while(tokens[i]!=='}'){
   const t=tokens[i++];
   if(t==='OFFSET')j.offset=[+tokens[i++],+tokens[i++],+tokens[i++]];
   else if(t==='CHANNELS'){const n=+tokens[i++];for(let k=0;k<n;k++)j.channels.push(tokens[i++]);}
   else if(t==='JOINT')j.children.push(readJoint(j));
   else if(t==='End'){i++;j.children.push(readJoint(j,true));}
   else throw new Error('unexpected '+t);
  }
  i++;return j;
 };
 if(tokens[i++]!=='HIERARCHY')throw new Error('not a BVH');
 if(tokens[i++]!=='ROOT')throw new Error('no ROOT');
 root=readJoint(null);
 if(tokens[i++]!=='MOTION')throw new Error('no MOTION');
 i++;const frames=+tokens[i++];i+=2;const frameTime=+tokens[i++];
 const per=joints.reduce((n,j)=>n+j.channels.length,0),data=[];
 for(let f=0;f<frames;f++){const row=new Float64Array(per);for(let k=0;k<per;k++)row[k]=+tokens[i++];data.push(row);}
 return {root,joints,frames,frameTime,data};
}
// ---- forward kinematics ------------------------------------------------------------------------
function worldPositions(bvh,frame){
 const row=bvh.data[frame],out={};let cursor=0;
 const walk=(j,parentMatrix)=>{
  const local=new Matrix4().makeTranslation(...j.offset),rot=new Matrix4(),pos=new Vector3();
  for(const c of j.channels){const v=row[cursor++];
   if(c==='Xposition')pos.x=v;else if(c==='Yposition')pos.y=v;else if(c==='Zposition')pos.z=v;
   else{const axis=c[0].toLowerCase(),e=new Euler(axis==='x'?v*Math.PI/180:0,axis==='y'?v*Math.PI/180:0,axis==='z'?v*Math.PI/180:0);rot.multiply(new Matrix4().makeRotationFromEuler(e));}}
  if(j.channels.some(c=>c.endsWith('position')))local.setPosition(pos.add(new Vector3(...j.offset)));
  const m=parentMatrix.clone().multiply(local).multiply(rot);
  out[j.name]={position:new Vector3().setFromMatrixPosition(m),matrix:m};
  for(const c of j.children)walk(c,m);
 };
 walk(bvh.root,new Matrix4());return out;
}
// ---- joint names (cgspeed / MotionBuilder convention, with a few fallbacks) --------------------
const NAMES={hips:['Hips'],chest:['Spine1','Spine'],neck:['Neck1','Neck'],head:['Head'],
 lShoulder:['LeftArm'],lElbow:['LeftForeArm'],lWrist:['LeftHand'],rShoulder:['RightArm'],rElbow:['RightForeArm'],rWrist:['RightHand'],
 lHip:['LeftUpLeg'],lKnee:['LeftLeg'],lAnkle:['LeftFoot'],rHip:['RightUpLeg'],rKnee:['RightLeg'],rAnkle:['RightFoot'],
 lToe:['LeftToeBase','LeftFoot_end'],rToe:['RightToeBase','RightFoot_end']};
const pick=(pos,keys)=>{for(const k of keys)if(pos[k])return pos[k].position.clone();throw new Error('missing joint '+keys.join('/'));};
// ---- channel extraction -------------------------------------------------------------------------
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function frameChannels(pos,restHipHeight,scale,mirror,pelvisFrame=false){
 const P=k=>{const v=pick(pos,NAMES[k]);if(mirror)v.x=-v.x;return v;};
 const hips=P('hips'),chest=P('chest'),neck=P('neck'),head=P('head');
 const L={sh:P(mirror?'rShoulder':'lShoulder'),el:P(mirror?'rElbow':'lElbow'),wr:P(mirror?'rWrist':'lWrist'),hip:P(mirror?'rHip':'lHip'),kn:P(mirror?'rKnee':'lKnee'),an:P(mirror?'rAnkle':'lAnkle')};
 const R={sh:P(mirror?'lShoulder':'rShoulder'),el:P(mirror?'lElbow':'rElbow'),wr:P(mirror?'lWrist':'rWrist'),hip:P(mirror?'lHip':'rHip'),kn:P(mirror?'lKnee':'rKnee'),an:P(mirror?'lAnkle':'rAnkle')};
 // Body frame: yaw of the pelvis (hip line) projected to the ground. X right, Y up, Z forward.
 // Body frame. Standing work uses the pelvis yaw projected to the ground (world up). Floor work (--pelvis-frame) uses the
 // pelvis's own orientation: up is the Hips joint's rest up, right the hip line, so a body lying on its back keeps its
 // trunk in the root rotation (bodyPitch/bodyRoll) instead of folding the spine 90 degrees over an upright pelvis.
 let forward,right,up;
 if(pelvisFrame){
  const hm=pos[NAMES.hips.find(k=>pos[k])].matrix;up=new Vector3(0,1,0).transformDirection(hm).normalize();
  right=R.hip.clone().sub(L.hip);right.addScaledVector(up,-right.dot(up)).normalize();forward=up.clone().cross(right).normalize();
 }else{
  const hipLine=R.hip.clone().sub(L.hip);hipLine.y=0;hipLine.normalize();
  forward=new Vector3(0,1,0).cross(hipLine).normalize();right=hipLine;up=new Vector3(0,1,0);
 }
 const toBody=v=>new Vector3(v.dot(right),v.dot(up),v.dot(forward));
 const dir=(a,b)=>toBody(b.clone().sub(a)).normalize();
 // Spine: lean forward (+x), side bend, and twist of the shoulder line against the hip line.
 const spine=dir(hips,chest),shoulders=toBody(R.sh.clone().sub(L.sh)).normalize();
 const lean=Math.atan2(spine.z,spine.y),side=Math.atan2(-spine.x,spine.y),twist=Math.atan2(-shoulders.z,shoulders.x);
 // Chest frame for the arms: up along the spine, right along the shoulder line.
 const cUp=spine.clone(),cRight=shoulders.clone().sub(cUp.clone().multiplyScalar(shoulders.dot(cUp))).normalize(),cFwd=cRight.clone().cross(cUp).normalize();
 const inChest=v=>new Vector3(v.dot(cRight),v.dot(cUp),v.dot(cFwd));
 const armChannels=(S,sideSign)=>{
  const upper=inChest(dir(S.sh,S.el)),lower=inChest(dir(S.el,S.wr));
  const az=Math.asin(clamp(upper.x,-1,1)),ax=Math.atan2(-upper.z,-upper.y);
  const bend=Math.acos(clamp(upper.dot(lower),-1,1));
  return {ax,az,e:-bend};
 };
 const la=armChannels(L,-1),ra=armChannels(R,1);
 const legChannels=S=>{
  const thigh=dir(S.hip,S.kn),shin=dir(S.kn,S.an);
  return {z:Math.asin(clamp(thigh.x,-1,1)),x:Math.atan2(-thigh.z,-thigh.y),k:Math.acos(clamp(thigh.dot(shin),-1,1))};
 };
 const ll=legChannels(L),rl=legChannels(R);
 const headDir=inChest(dir(neck,head));
 const hx=Math.atan2(headDir.z,headDir.y),hz=Math.atan2(-headDir.x,headDir.y);
 const bodyY=(hips.y-restHipHeight)*scale;
 return {lwx:0,lwz:0,rwx:0,rwz:0,bodyPitch:0,bodyRoll:0,bodyX:0,bodyY,bodyZ:0,hipYaw:0,lean,twist,side,hx,hy:0,hz,neckY:0,neckZ:0,lw:0,rw:0,lc:0,rc:0,lax:la.ax,lay:0,laz:la.az,rax:ra.ax,ray:0,raz:ra.az,le:la.e,re:ra.e,llx:ll.x,llz:ll.z,rlx:rl.x,rlz:rl.z,lk:ll.k,rk:rl.k,
  _lFootZ:toBody(L.an.clone().sub(hips)).z,_rFootZ:toBody(R.an.clone().sub(hips)).z,_hipY:hips.y,
  // Raw measurements for take studies (scaled to game units; forward is the pelvis facing):
  _lAnkleY:L.an.y*scale,_rAnkleY:R.an.y*scale,_lWrist:toBody(L.wr.clone().sub(hips)).multiplyScalar(scale).toArray().map(v=>+v.toFixed(3)),_rWrist:toBody(R.wr.clone().sub(hips)).multiplyScalar(scale).toArray().map(v=>+v.toFixed(3)),
  _lToeW:P(mirror?'rToe':'lToe').multiplyScalar(scale).toArray().map(v=>+v.toFixed(4)),_rToeW:P(mirror?'lToe':'rToe').multiplyScalar(scale).toArray().map(v=>+v.toFixed(4)),
  _lAnkleW:L.an.clone().multiplyScalar(scale).toArray().map(v=>+v.toFixed(4)),_rAnkleW:R.an.clone().multiplyScalar(scale).toArray().map(v=>+v.toFixed(4)),
  _lAnkleB:toBody(L.an.clone().sub(hips)).multiplyScalar(scale).toArray().map(v=>+v.toFixed(4)),_rAnkleB:toBody(R.an.clone().sub(hips)).multiplyScalar(scale).toArray().map(v=>+v.toFixed(4)),
  _axes:[right.toArray(),up.toArray(),forward.toArray()],_hipsRaw:hips.toArray(),
  _hipYawWorld:Math.atan2(forward.x,forward.z),_shoulderYawWorld:(()=>{const s=R.sh.clone().sub(L.sh);return Math.atan2(-s.z,s.x);})(),_hipsWorld:hips.clone().multiplyScalar(scale).toArray().map(v=>+v.toFixed(3))};
}
// ---- cycle detection: one full stride = the left ankle passing the pelvis forward twice --------
function findCycle(frames){
 const z=frames.map(f=>f._lFootZ),up=[],down=[];
 for(let i=2;i<z.length;i++){if(z[i-1]<=0&&z[i]>0)up.push(i);if(z[i-1]>=0&&z[i]<0)down.push(i);}
 const pick=list=>{const mid=Math.floor(list.length/2)-1;return [list[Math.max(0,mid)],list[Math.max(0,mid)+1]];};
 if(up.length>=2)return {range:pick(up),half:false};
 if(down.length>=2)return {range:pick(down),half:false};
 // Short take: one half stride (left foot forward to left foot back, or the reverse) mirrored into a full cycle.
 const a=up[0]??down[0],b=[...up,...down].filter(i=>i>a).sort((x,y)=>x-y)[0];
 if(a===undefined||b===undefined)throw new Error('no stride found; pass --cycle start:end');
 return {range:[a,b],half:true};
}
// Mirror a pose left/right for the second half of a mirrored stride.
const SWAP=[['lax','rax'],['lay','ray'],['laz','raz'],['le','re'],['llx','rlx'],['llz','rlz'],['lk','rk']],NEGATE=['bodyX','hipYaw','twist','side','hy','hz','lay','ray','laz','raz','llz','rlz'];
function mirrorPose(p){const m={...p};for(const [a,b] of SWAP){m[a]=p[b];m[b]=p[a];}for(const k of NEGATE)m[k]=-m[k];return m;}
// ---- main ---------------------------------------------------------------------------------------
const bvh=parseBvh(readFileSync(args.in,'utf8'));
const rest=worldPositions(bvh,0);
const restHip=pick(rest,NAMES.hips),restAnkle=pick(rest,NAMES.lAnkle),restKnee=pick(rest,NAMES.lKnee);
const bvhLeg=restHip.distanceTo(restKnee)+restKnee.distanceTo(restAnkle),scale=1.6/bvhLeg;// our thigh+shin at game scale is about 1.6 units
const mirror=!!args.mirror;
const all=[];for(let f=1;f<bvh.frames;f++)all.push(frameChannels(worldPositions(bvh,f),restHip.y,scale,mirror));
if(args.debug){const z=all.map(c=>c._lFootZ),h=all.map(c=>c._hipY);const f=k=>v=>+v.toFixed(2);
 console.log('DEBUG frames',bvh.frames,'joints',bvh.joints.length,'per-frame channels',bvh.data[0].length,'rest hips',restHip.toArray().map(f()),'rest lAnkle',restAnkle.toArray().map(f()),'bvhLeg',bvhLeg.toFixed(2));
 console.log('DEBUG lFootZ min/max',Math.min(...z).toFixed(2),Math.max(...z).toFixed(2),'first',z.slice(0,6).map(f()),'mid',z.slice(150,156).map(f()));
 console.log('DEBUG hipY min/max',Math.min(...h).toFixed(2),Math.max(...h).toFixed(2));
 const p=[60,200].map(fr=>pick(worldPositions(bvh,fr),NAMES.hips).toArray().map(f()));console.log('DEBUG hips f60',p[0],'f200',p[1]);}
if(args.dump){const r=v=>typeof v==='number'?+v.toFixed(4):v;writeFileSync(args.dump,JSON.stringify({source:args.in,frameTime:bvh.frameTime,scale:+scale.toFixed(4),frames:all.map((c,i)=>Object.fromEntries(Object.entries({f:i+1,...c}).map(([k,v])=>[k,r(v)])))}));console.log('DUMP',args.dump,all.length,'frames at',bvh.frameTime);if(!args.out)process.exit(0);}
// ---- segment export (TALA-IMPORT-AB) --------------------------------------------------------------
// --segment a:b --mode loop|oneshot [--keys N] [--lead l|r] [--pelvis-frame]
// Writes a "segment clip": pose channels plus the data a retarget needs, all lengths in source leg lengths (thigh + shin)
// so the runtime rescales them to the rig's own legs. Footwork (loop): one step cycle cut between two lift-offs of the
// same foot, with travel separated from the pelvis — the cycle's straight-line travel is removed, what is left is the
// pelvis sway (x lateral, y bob, z surge) and the ankle paths relative to that travel line, with per-foot contact flags.
// Heading is where the guard hands point (a bladed boxer's pelvis does not face the opponent). Floor work (oneshot,
// --pelvis-frame): the pelvis orientation goes to bodyPitch/hipYaw/bodyRoll, hips are stored as a height above the
// floor and an offset from where they finish standing, so the runtime can place the root without moving the fighter.
if(args.segment){
 const [a,b]=String(args.segment).split(':').map(Number),mode=args.mode||'loop',N=+(args.keys||24),dt=bvh.frameTime;
 const LEG=1.6; // dump/frameChannels lengths are in units where the source leg is 1.6
 const pelvis=!!args['pelvis-frame'];
 const frames=pelvis?Array.from({length:bvh.frames-1},(_,i)=>frameChannels(worldPositions(bvh,i+1),restHip.y,scale,false,true)):all;
 const ankleY=frames.flatMap(f=>[f._lAnkleW[1],f._rAnkleW[1]]).sort((x,y)=>x-y),floorY=ankleY[Math.floor(ankleY.length*.02)];
 const wrap=v=>{while(v>Math.PI)v-=2*Math.PI;while(v<-Math.PI)v+=2*Math.PI;return v;};
 const r4=v=>+v.toFixed(4);
 let keys=[],meta;
 if(mode==='loop'){
  // heading: pelvis yaw minus the mean hand angle, smoothed half a second
  const raw=frames.map(f=>f._hipYawWorld-Math.atan2((f._lWrist[0]+f._rWrist[0])/2,Math.max(.05,(f._lWrist[2]+f._rWrist[2])/2)));
  const un=[raw[0]];for(let i=1;i<raw.length;i++)un.push(un[i-1]+wrap(raw[i]-raw[i-1]));
  const W=Math.round(.25/dt),heading=un.map((_,i)=>{let s=0,c=0;for(let k=Math.max(0,i-W);k<=Math.min(un.length-1,i+W);k++){s+=un[k];c++;}return s/c;});
  // contacts from the ball of the foot (a boxer's heel rises and the ankle keeps moving while the ball stays planted):
  // toe within 6 cm (game units) of its floor height and slower than 0.5 units/s, blips under 4 frames removed
  const toeY=frames.flatMap(f=>[f._lToeW[1],f._rToeW[1]]).sort((x,y)=>x-y),toeFloor=toeY[Math.floor(toeY.length*.02)];
  // Height only: a sliding rear-foot drag stays down and counts as support (the runtime follows the clip's own foot path, so a slide stays a slide).
  const contact=key=>{key=key==='_lAnkleW'?'_lToeW':'_rToeW';const c=frames.map(f=>f[key][1]<toeFloor+.05);
   for(let i=1;i<c.length-1;i++){if(c[i]===c[i-1])continue;let j=i;while(j<c.length&&c[j]===c[i])j++;if(j-i<4)for(let k=i;k<j;k++)c[k]=c[i-1];}return c;};
  const cl=contact('_lAnkleW'),cr=contact('_rAnkleW');
  // A step-and-drag cycle ends at the starting foot's next lift-off, which may fall just past the travel stretch: look half a second further.
  const lifts=(c)=>{const out=[];for(let i=Math.max(1,a-Math.round(.3/dt));i<=Math.min(c.length-1,b+Math.round(.5/dt));i++)if(c[i-1]&&!c[i])out.push(i);return out;};
  const L=lifts(cl),R=lifts(cr);
  // cycle: between consecutive lift-offs of one foot with exactly one lift-off of the other foot inside
  let cyc=null;
  const overlap=(s0,s1)=>Math.max(0,Math.min(s1,b)-Math.max(s0,a));
  for(const [own,other,foot] of [[L,R,'l'],[R,L,'r']])for(let k=0;k+1<own.length;k++){const s0=own[k],s1=own[k+1],inner=other.filter(i=>i>s0&&i<s1);if(inner.length===1&&(s1-s0)*dt<1.2&&(!cyc||overlap(s0,s1)>overlap(cyc.s0,cyc.s1)))cyc={s0,s1,foot};}
  // Boxers often stop after one shuffle: then the cycle is a single step-and-drag, from the first foot's lift-off until the
  // dragging foot has landed and settled (both feet planted again, the stance restored one step further along).
  if(!cyc){const firstL=L[0]??Infinity,firstR=R[0]??Infinity,foot=firstL<firstR?'l':'r',s0=Math.min(firstL,firstR),other=foot==='l'?R:L,oc=foot==='l'?cr:cl;
   const lift=other.find(i=>i>s0);let land=lift;while(land!==undefined&&land<oc.length-1&&!oc[land])land++;
   if(s0===Infinity||lift===undefined)throw new Error(`no step in ${a}:${b} (left lifts ${L}, right lifts ${R})`);
   cyc={s0,s1:Math.min(frames.length-1,land+Math.round(.05/dt)),foot,single:true};}
  const {s0,s1}=cyc,len=s1-s0,hd=heading.slice(s0,s1+1).reduce((x,y)=>x+y,0)/(len+1),fx=Math.sin(hd),fz=Math.cos(hd);
  const toH=(x,z)=>[x*(-fz)+z*fx,x*fx+z*fz]; // world (x,z) to heading frame (right, forward)
  const h0=frames[s0]._hipsWorld,h1=frames[s1]._hipsWorld,travel=toH(h1[0]-h0[0],h1[2]-h0[2]);
  const meanHipY=frames.slice(s0,s1).reduce((x,f)=>x+f._hipsWorld[1],0)/len;
  const yawMean=frames.slice(s0,s1).reduce((x,f,i)=>x+wrap(f._hipYawWorld-heading[s0+i]),0)/len;
  for(let k=0;k<=N;k++){
   const u=k/N,fi=Math.min(s1,Math.round(s0+u*len)),f=frames[fi],t=(fi-s0)/len;
   const line=[h0[0]+(h1[0]-h0[0])*t,h0[2]+(h1[2]-h0[2])*t];
   const sway=toH(f._hipsWorld[0]-line[0],f._hipsWorld[2]-line[1]);
   const ank=key=>{const v=toH(f[key][0]-line[0],f[key][2]-line[1]);return [r4(v[0]/LEG),r4((f[key][1]-floorY)/LEG),r4(v[1]/LEG)];};
   const out={};for(const ch of CHANNELS)out[ch]=r4(f[ch]??0);
   out.hipYaw=r4(-(wrap(f._hipYawWorld-heading[fi])-yawMean)); // rig hipYaw turns toward its right; source yaw grows toward the left
   keys.push([+u.toFixed(4),out,{sway:[r4(sway[0]/LEG),r4((f._hipsWorld[1]-meanHipY)/LEG),r4(sway[1]/LEG)],l:ank('_lAnkleW'),r:ank('_rAnkleW'),lc:cl[fi],rc:cr[fi]}]);
  }
  // loop closure: spread any end-start mismatch of the channels over the cycle (contacts and ankle paths are periodic already)
  const first=keys[0][1],last=keys[N][1];for(const [u,o] of keys)for(const ch of CHANNELS)o[ch]=r4(o[ch]-(last[ch]-first[ch])*u);
  meta={name:args.name,source:args.source||args.in,mode,frames:[s0,s1],segment:[a,b],frameTime:dt,seconds:r4(len*dt),startFoot:cyc.foot,cycle:cyc.single?'step-and-drag':'two lift-offs of one foot',
   travel:[r4(travel[0]/LEG),r4(travel[1]/LEG)],cycleDistance:r4(Math.hypot(...travel)/LEG),units:'source leg lengths (thigh+shin)',
   duty:{l:r4(cl.slice(s0,s1).filter(Boolean).length/len),r:r4(cr.slice(s0,s1).filter(Boolean).length/len)}};
 }else if(mode==='strike'){
  // MOCAP-COMBAT strike: one real punch, kick or cut from its wind-up (a) to its settle (b), impact at --impact.
  // Heading is where the guard faced at the start (pelvis yaw minus the hand angle, as the footwork uses), held for
  // the whole strike so the hips' drive toward the target stays a drive. Stored per key, in source leg lengths:
  // hip offset from its start position, both ankles relative to the start hips with height above the floor, toe
  // contacts. The runtime warps time onto the move's startup / active / recovery and retargets lengths to the rig.
  const imp=+args.impact;if(!(imp>a&&imp<b))throw new Error('--impact must fall inside the segment');
  const step=Math.max(1,Math.round((1/60)/dt)); // keep 60 Hz keys
  const raw=frames.map(f=>f._hipYawWorld-Math.atan2((f._lWrist[0]+f._rWrist[0])/2,Math.max(.05,(f._lWrist[2]+f._rWrist[2])/2)));
  const W=Math.round(.1/dt);let hd=0,c=0;for(let k=Math.max(0,a-W);k<=a;k++){hd+=raw[k];c++;}hd/=c;
  const fx=Math.sin(hd),fz=Math.cos(hd),toH=(x,z)=>[x*(-fz)+z*fx,x*fx+z*fz];
  const toeY=frames.flatMap(f=>[f._lToeW[1],f._rToeW[1]]).sort((x,y)=>x-y),toeFloor=toeY[Math.floor(toeY.length*.02)];
  const h0=frames[a]._hipsWorld,yaw0=frames[a]._hipYawWorld;
  const list=[];for(let fi=a;fi<b;fi+=step)list.push(fi);list.push(b);if(!list.includes(imp)){list.push(imp);list.sort((x,y)=>x-y);}
  for(const fi of list){
   const f=frames[fi],u=(fi-a)/(b-a),hv=toH(f._hipsWorld[0]-h0[0],f._hipsWorld[2]-h0[2]);
   const ank=key=>{const v=toH(f[key][0]-h0[0],f[key][2]-h0[2]);return [r4(v[0]/LEG),r4((f[key][1]-floorY)/LEG),r4(v[1]/LEG)];};
   const out={};for(const ch of CHANNELS)out[ch]=r4(f[ch]??0);
   out.hipYaw=r4(-wrap(f._hipYawWorld-hd));
   keys.push([+u.toFixed(4),out,{hip:[r4(hv[0]/LEG),r4((f._hipsWorld[1]-h0[1])/LEG),r4(hv[1]/LEG)],l:ank('_lAnkleW'),r:ank('_rAnkleW'),lc:f._lToeW[1]<toeFloor+.05,rc:f._rToeW[1]<toeFloor+.05}]);
  }
  meta={name:args.name,source:args.source||args.in,mode,frames:[a,b],impactFrame:imp,impact:r4((imp-a)/(b-a)),effector:args.hand||'r',type:args.type||'strike',frameTime:dt,
   seconds:r4((b-a)*dt),windup:r4((imp-a)*dt),follow:r4((b-imp)*dt),units:'source leg lengths (thigh+shin)',startYawOffset:r4(-wrap(yaw0-hd))};
 }else{
  // oneshot floor work: reference facing blends from the lying direction (head to feet) to the standing pelvis facing
  const yawAt=i=>Math.atan2(frames[i]._axes[2][0],frames[i]._axes[2][2]);
  const lie=frames[a],headToFeet=(()=>{const h=lie._hipsRaw,an=[(lie._lAnkleW[0]+lie._rAnkleW[0])/2/scale,(lie._lAnkleW[2]+lie._rAnkleW[2])/2/scale];return Math.atan2(an[0]-h[0],an[1]-h[2]);})();
  const yEnd=yawAt(b),dy=wrap(yEnd-headToFeet),hEnd=frames[b]._hipsWorld;
  for(let k=0;k<=N;k++){
   const u=k/N,fi=Math.round(a+u*(b-a)),f=frames[fi],ref=headToFeet+dy*u,fx=Math.sin(ref),fz=Math.cos(ref);
   // pelvis axes in the reference frame (x right, y up, z forward) -> Euler XYZ, the rig's body.rotation order
   const toRef=v=>new Vector3(v[0]*(-fz)+v[2]*fx,v[1],v[0]*fx+v[2]*fz);
   const [rx,uy,fw]=f._axes.map(toRef),m=new Matrix4().makeBasis(rx,uy,fw),e=new Euler().setFromRotationMatrix(m,'XYZ');
   const off=[f._hipsWorld[0]-hEnd[0],f._hipsWorld[2]-hEnd[2]],ox=off[0]*(-fz)+off[1]*fx,oz=off[0]*fx+off[1]*fz;
   const out={};for(const ch of CHANNELS)out[ch]=r4(f[ch]??0);
   out.bodyPitch=r4(e.x);out.hipYaw=r4(-e.y);out.bodyRoll=r4(e.z);
   keys.push([+u.toFixed(4),out,{hip:[r4(ox/LEG),r4((f._hipsWorld[1]-floorY)/LEG),r4(oz/LEG)]}]);
  }
  meta={name:args.name,source:args.source||args.in,mode,frames:[a,b],frameTime:dt,seconds:r4((b-a)*dt),units:'source leg lengths (thigh+shin)',turn:r4(dy)};
 }
 mkdirSync(dirname(args.out),{recursive:true});
 writeFileSync(args.out,`// Generated by scripts/mocap/bvh-to-channels.mjs --segment from ${meta.source}. Do not edit by hand.\n// ${mode==='loop'?'One step cycle':'One-shot'}, ${meta.seconds}s at source speed. Keys: [u 0..1, pose channels, retarget data in source leg lengths].\nexport const meta=${JSON.stringify(meta)};\nexport const keys=${JSON.stringify(keys)};\n`);
 console.log('SEGMENT',JSON.stringify(meta));process.exit(0);
}
const cycle=args.cycle&&args.cycle!=='auto'?{range:args.cycle.split(':').map(Number),half:false}:findCycle(all);
const [start,end]=cycle.range,half=cycle.half;
const n=+(args.keys||16),keys=[];
for(let k=0;k<n;k++){
 const t=k/n;let pose;
 if(half){const u=(t%.5)*2,f=Math.min(all.length-1,Math.round(start+(end-start)*u)),c=all[f];pose=t<.5?c:mirrorPose(c);}
 else{const f=Math.min(all.length-1,Math.round(start+(end-start)*t));pose=all[f];}
 const out={};for(const ch of CHANNELS)out[ch]=+pose[ch].toFixed(4);keys.push([+t.toFixed(4),out]);
}
keys.push([1,keys[0][1]]);
const bob=all.slice(start,end).map(c=>c.bodyY),stride=Math.abs(all[start]._rFootZ-all[Math.floor((start+end)/2)]._rFootZ)*scale;
const meta={name:args.name||'clip',source:args.source||args.in,frames:[start,end],frameTime:bvh.frameTime,seconds:+((end-start)*bvh.frameTime*(half?2:1)).toFixed(3),keys:n,mirror,halfStrideMirrored:half,bodyBob:[+Math.min(...bob).toFixed(3),+Math.max(...bob).toFixed(3)],strideEstimate:+stride.toFixed(3)};
mkdirSync(dirname(args.out),{recursive:true});
writeFileSync(args.out,`// Generated by scripts/mocap/bvh-to-channels.mjs from ${meta.source}. Do not edit by hand.\n// One looping cycle, ${meta.seconds}s at source speed, as Rift Duel pose channels (root travel removed).\nexport const meta=${JSON.stringify(meta)};\nexport const keys=${JSON.stringify(keys)};\n`);
console.log('CLIP',JSON.stringify(meta));
