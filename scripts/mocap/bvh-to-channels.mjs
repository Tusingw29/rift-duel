// Convert a BVH motion-capture clip into Rift Duel pose channels (dist/rig-pose.js CHANNELS).
// The output is a looping key list for sampleClip, so a real run or walk cycle becomes authored
// keys the animators can blend like any other pose. Root travel is dropped (the simulation owns
// it); support feet are still planted by plantSupportFeet, so legs here mainly shape swing and bob.
// Usage: node scripts/mocap/bvh-to-channels.mjs --in <file.bvh> --out dist/clips/<name>.js --name run
//        [--keys 16] [--cycle auto|start:end] [--mirror] [--source "CMU 09_01 via cgspeed BVH (free for research and commercial use)"]
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {dirname} from 'node:path';
import {Vector3,Matrix4,Quaternion,Euler} from '../../dist/vendor/three.module.js';
const args=Object.fromEntries(process.argv.slice(2).map((a,i,all)=>a.startsWith('--')?[a.slice(2),all[i+1]?.startsWith('--')||all[i+1]===undefined?true:all[i+1]]:[]).filter(Boolean));
if(!args.in||!args.out)throw new Error('--in <bvh> and --out <js> are required');
const CHANNELS=['bodyX','bodyY','bodyZ','hipYaw','lean','twist','side','hx','hy','hz','neckY','neckZ','lax','lay','laz','rax','ray','raz','le','re','llx','llz','rlx','rlz','lk','rk','lw','rw','lc','rc'];
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
 lHip:['LeftUpLeg'],lKnee:['LeftLeg'],lAnkle:['LeftFoot'],rHip:['RightUpLeg'],rKnee:['RightLeg'],rAnkle:['RightFoot']};
const pick=(pos,keys)=>{for(const k of keys)if(pos[k])return pos[k].position.clone();throw new Error('missing joint '+keys.join('/'));};
// ---- channel extraction -------------------------------------------------------------------------
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
function frameChannels(pos,restHipHeight,scale,mirror){
 const P=k=>{const v=pick(pos,NAMES[k]);if(mirror)v.x=-v.x;return v;};
 const hips=P('hips'),chest=P('chest'),neck=P('neck'),head=P('head');
 const L={sh:P(mirror?'rShoulder':'lShoulder'),el:P(mirror?'rElbow':'lElbow'),wr:P(mirror?'rWrist':'lWrist'),hip:P(mirror?'rHip':'lHip'),kn:P(mirror?'rKnee':'lKnee'),an:P(mirror?'rAnkle':'lAnkle')};
 const R={sh:P(mirror?'lShoulder':'rShoulder'),el:P(mirror?'lElbow':'rElbow'),wr:P(mirror?'lWrist':'rWrist'),hip:P(mirror?'lHip':'rHip'),kn:P(mirror?'lKnee':'rKnee'),an:P(mirror?'lAnkle':'rAnkle')};
 // Body frame: yaw of the pelvis (hip line) projected to the ground. X right, Y up, Z forward.
 const hipLine=R.hip.clone().sub(L.hip);hipLine.y=0;hipLine.normalize();
 const forward=new Vector3(0,1,0).cross(hipLine).normalize(),right=hipLine,up=new Vector3(0,1,0);
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
 return {bodyX:0,bodyY,bodyZ:0,hipYaw:0,lean,twist,side,hx,hy:0,hz,neckY:0,neckZ:0,lw:0,rw:0,lc:0,rc:0,lax:la.ax,lay:0,laz:la.az,rax:ra.ax,ray:0,raz:ra.az,le:la.e,re:ra.e,llx:ll.x,llz:ll.z,rlx:rl.x,rlz:rl.z,lk:ll.k,rk:rl.k,
  _lFootZ:toBody(L.an.clone().sub(hips)).z,_rFootZ:toBody(R.an.clone().sub(hips)).z,_hipY:hips.y};
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
