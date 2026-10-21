// Full-body authored animation for Tala, the first fighter on the new system.
// Poses are flat channel objects blended toward a target each frame, so idle,
// footwork, strikes, guard and hit reactions flow from the current pose instead
// of snapping back to neutral. Footwork advances with distance travelled, not time.
import {sampleClip} from './pose-clips.js';
import {Vector3} from './vendor/three.module.js';
export const CHANNELS=['bodyX','bodyY','bodyZ','hipYaw','lean','twist','side','hx','hy','hz','lax','lay','laz','rax','ray','raz','le','re','llx','llz','rlx','rlz','lk','rk'];
const pose=o=>Object.fromEntries(CHANNELS.map(k=>[k,o[k]??0]));
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const snapOut=t=>{t=Math.max(0,Math.min(1,t));return 1-(1-t)**3;};
export const STRIDE=1.15;// metres per step cycle half, tuned to her speed
// Boxer's guard: left foot forward, fists up, chin down.
export const stance=pose({lax:-.8,laz:.12,le:-1.2,rax:-.55,raz:-.14,re:-1.4,twist:-.18,lean:.06,hx:.08,hy:.1,llx:-.18,llz:.1,rlx:.2,rlz:-.12,lk:.28,rk:.22,bodyY:-.15});
export const guard=pose({lax:-1.15,laz:.22,le:-1.95,rax:-1.05,raz:-.22,re:-1.95,twist:-.1,lean:.16,hx:.22,llx:-.22,llz:.22,rlx:.22,rlz:-.22,lk:.42,rk:.4,bodyY:-.1});
export const charge=pose({lax:.25,laz:.45,le:-.6,rax:.25,raz:-.45,re:-.6,lean:-.08,hx:-.18,llx:-.1,llz:.32,rlx:.1,rlz:-.32,lk:.38,rk:.38,bodyY:-.12});
// Impact snap: head whips back, chest arcs, rear foot catches the weight.
export const impact=pose({hx:-.5,hz:.1,lean:-.38,twist:.28,lax:-.35,laz:.65,le:-.5,rax:-.15,raz:-.6,re:-.4,rlx:.6,rlz:-.1,llx:.25,rk:.35,lk:.1,bodyZ:-.22,bodyY:-.12});
// Three-hit combo: right straight, left cross, stepping right hook.
const tracks={
 1:{wind:pose({twist:.38,hipYaw:.14,rax:.3,raz:-.1,re:-1.6,lax:-.85,le:-1.25,lean:-.04,hy:-.1,rlx:.32,rlz:-.12,llx:-.18,llz:.1,lk:.25,rk:.3,bodyY:-.23}),
    strike:pose({twist:-.72,hipYaw:-.26,rax:-1.78,ray:.62,raz:-.12,re:-.03,lax:-.95,laz:.2,le:-1.35,lean:.3,hx:-.06,hy:.36,rlx:.55,rlz:-.08,rk:.1,llx:-.36,llz:.1,lk:.42,bodyZ:.18,bodyY:-.12}),
    follow:pose({twist:-.8,hipYaw:-.28,rax:-1.6,ray:.6,raz:-.15,re:-.25,lax:-.95,laz:.2,le:-1.3,lean:.3,hx:-.04,hy:.4,rlx:.55,rlz:-.08,rk:.1,llx:-.36,llz:.1,lk:.42,bodyZ:.2,bodyY:-.12})},
 2:{wind:pose({twist:-.5,hipYaw:-.16,lax:.25,laz:.1,le:-1.6,rax:-.8,re:-1.3,lean:-.04,hy:.12,llx:-.1,llz:.1,rlx:.25,rlz:-.12,lk:.3,rk:.25,bodyY:-.23}),
    strike:pose({twist:.74,hipYaw:.28,lax:-1.78,lay:-.66,laz:.12,le:-.03,rax:-1,raz:-.2,re:-1.35,lean:.3,hx:-.06,hy:-.38,llx:-.45,llz:.06,lk:.32,rlx:.48,rlz:-.1,rk:.16,bodyZ:.2,bodyY:-.12}),
    follow:pose({twist:.82,hipYaw:.3,lax:-1.6,lay:-.65,laz:.15,le:-.25,rax:-1,raz:-.2,re:-1.3,lean:.3,hy:-.42,llx:-.45,llz:.06,lk:.32,rlx:.48,rlz:-.1,rk:.16,bodyZ:.22,bodyY:-.12})},
 3:{wind:pose({twist:.55,hipYaw:.22,rax:-.45,ray:-.5,raz:-.3,re:-1.85,lax:-.9,le:-1.3,lean:.02,hy:-.2,rlx:.3,rlz:-.14,llx:-.15,llz:.12,lk:.5,rk:.45,bodyY:-.28}),
    strike:pose({twist:-.95,hipYaw:-.36,rax:-1.3,ray:1.15,raz:-.45,re:-.95,lax:-.85,laz:.25,le:-1.3,lean:.26,side:.1,hx:-.1,hy:.5,llx:-.55,llz:.08,lk:.3,rlx:.2,rlz:-.12,rk:.3,bodyZ:.36,bodyY:-.10}),
    follow:pose({twist:-1.05,hipYaw:-.4,rax:-1.15,ray:1.35,raz:-.5,re:-1.05,lax:-.85,laz:.25,le:-1.3,lean:.28,side:.12,hx:-.08,hy:.52,llx:-.55,llz:.08,lk:.3,rlx:.2,rlz:-.12,rk:.3,bodyZ:.4,bodyY:-.10})}
};
const mix=(a,b,t)=>Object.fromEntries(CHANNELS.map(k=>[k,a[k]+(b[k]-a[k])*t]));
// Keyed strike timeline: windup eases in, the hit snaps out, the follow-through
// settles, and the recovery returns to stance under control.
export function strikePose(move){
 const track=tracks[Math.min(3,Math.max(1,move.chain||1))],active=move.active||1,end=move.startup+active+move.recovery;
 const hand=move.chain===2?'l':'r',sign=move.chain===2?1:-1;
 const drive=pose({...mix(track.wind,track.strike,.74),hipYaw:track.strike.hipYaw*.98,bodyX:sign*.065});
 const retract=pose({...mix(track.follow,stance,.6),[hand+'e']:-1.5,[hand+'ax']:-.85,bodyX:-sign*.035,bodyY:-.19});
 const keys=[[0,stance,smooth],[move.startup*.55,track.wind,smooth],[move.startup*.8,drive,snapOut],[move.startup,track.strike,snapOut],[move.startup+active+move.recovery*.22,track.follow,smooth],[move.startup+active+move.recovery*.65,retract,smooth],[end,stance,smooth]];
 const frame=Math.max(0,Math.min(end,move.frame));if(frame>=end)return stance;
 let i=1;while(i<keys.length-1&&frame>keys[i][0])i++;
 const [a,from]=keys[i-1],[b,to,ease]=keys[i];return mix(from,to,ease((frame-a)/(b-a||1)));
}
// Contact, compression, passing and push-off poses. The opposite step is
// authored by mirroring the limbs, with chest/hips counter-rotating together.
const stepKeys=[
 {bodyX:-.045,bodyY:-.19,lean:.25,hipYaw:-.12,twist:.02,side:.035,hx:.03,hy:-.08,lax:-.48,rax:-1.02,le:-1.4,re:-1.02,llx:0,rlx:0,lk:.66,rk:.12},
 {bodyX:-.065,bodyY:-.27,lean:.34,hipYaw:-.02,twist:-.10,side:.065,hx:.09,hy:.02,lax:-.62,rax:-.9,le:-1.48,re:-1.12,llx:-.43,rlx:.42,lk:.54,rk:.28},
 {bodyX:-.025,bodyY:-.20,lean:.31,hipYaw:.15,twist:-.4,side:.025,hx:.035,hy:.19,lax:-1.03,rax:-.38,le:-1.1,re:-1.52,llx:-.65,rlx:.65,lk:.16,rk:.95},
 {bodyX:.025,bodyY:-.16,lean:.23,hipYaw:.18,twist:-.43,side:-.02,hx:-.015,hy:.22,lax:-1.08,rax:-.3,le:-1.02,re:-1.45,llx:-.32,rlx:.32,lk:.08,rk:.8}
].map(k=>pose({...stance,...k}));
const mirrorStep=s=>pose({...s,bodyX:-s.bodyX,hipYaw:-s.hipYaw,twist:-.36-s.twist,side:-s.side,hy:.1-s.hy,
 lax:s.rax,rax:s.lax,le:s.re,re:s.le,llx:s.rlx,rlx:s.llx,lk:s.rk,rk:s.lk});
const steps=[...stepKeys,...stepKeys.map(mirrorStep)];
const motionClip=transform=>{const k=steps.map((s,i)=>[i/8,pose(transform(s,i))]);return [...k,[1,k[0][1]]];};
const advanceClip=motionClip(s=>s);
const retreatClip=motionClip(s=>({...s,bodyX:s.bodyX*.7,bodyY:s.bodyY+.035,lean:-.10-(s.lean-.23)*.5,
 llx:-s.llx*.65,rlx:-s.rlx*.65,lax:-.88+(s.lax+.75)*.35,rax:-.65+(s.rax+.65)*.35,twist:-.18+(s.twist+.18)*.65}));
const circleClip=motionClip((s,i)=>({...s,bodyX:s.bodyX*.8,bodyY:s.bodyY+.02,lean:.13,side:.07+s.side,
 hipYaw:s.hipYaw*.5,twist:-.18+(s.twist+.18)*.5,llx:-.1,rlx:.1,llz:.2+s.llx*.4,rlz:.2+s.rlx*.4,
 lax:-.9+(s.lax+.75)*.18,rax:-.65+(s.rax+.65)*.18,le:-1.25,re:-1.35}));
export function movePose(forward,side,phase){
 const strafe=Math.abs(side)>Math.abs(forward);
 const s=sampleClip(strafe?circleClip:forward<0?retreatClip:advanceClip,phase/(Math.PI*2),CHANNELS,true);
 if(strafe&&side<0){s.bodyX=-s.bodyX;s.side=-s.side;s.llz=-s.llz;s.rlz=-s.rlz;}
 return s;
}
export function idlePose(t){
 const bounce=Math.abs(Math.sin(t*5.2)),shift=Math.sin(t*2.6);
 return pose({...stance,bodyY:-.15+bounce*.035,side:shift*.05,hz:shift*.03,hx:.08+Math.sin(t*5.2)*.02,llz:.1+shift*.03,rlz:-.12+shift*.03,lk:.28+(1-bounce)*.12,rk:.22+(1-bounce)*.1,lax:-.8+Math.sin(t*5.2+1)*.04,rax:-.55+Math.sin(t*5.2+2)*.04});
}
export function hurtPose(animTime){const u=smooth(1-Math.min(1,animTime/.42));return mix(impact,stance,u);}
export function guardPose(blockStun){const recoil=Math.min(1,blockStun/.22);return mix(guard,pose({...guard,lean:-.1,hx:.05,bodyZ:-.14,le:-1.6,re:-1.6,rlx:.4}),recoil);}
// Which states the sample handles; everything else falls back to the shared animator.
export function targetFor(p,t,stridePhase=p?.stridePhase||0){
 if(!p)return {pose:idlePose(t),rate:8,kind:'idle'};
 const move=p.move;
 if(move?.kind==='strike')return {pose:strikePose(move),rate:34,kind:'strike'};
 if(move||p.air>0||p.roll||['knockdown','defeat','victory','launch','roll','jump','recover','pursuit','jumpAttack'].includes(p.anim))return null;
 if(p.guard)return {pose:guardPose(p.blockStun||0),rate:20,kind:'guard'};
 if(p.anim==='hurt')return {pose:hurtPose(p.animTime||0),rate:p.animTime>.38?Infinity:16,kind:'hurt'};
 if(p.anim==='charge')return {pose:charge,rate:14,kind:'charge'};
 if(p.anim==='run')return {pose:movePose(p.prev?.x??1,p.prev?.z||0,stridePhase),rate:13,kind:'run'};
 return {pose:idlePose(t),rate:8,kind:'idle'};
}
export function advanceStride(r,p){
 if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.z))return r.stridePhase||0;
 if(r.lastPos&&p.anim==='run'){const d=Math.hypot(p.x-r.lastPos[0],p.z-r.lastPos[1]);r.stridePhase=(r.stridePhase||0)+Math.min(d,.5)/STRIDE*Math.PI;}
 // Keep the step phase when stopping so a brief pause does not restart the gait.
 r.lastPos=[p.x,p.z];return r.stridePhase||0;
}
export function blendPose(current,target,rate,dt){
 if(!current||rate===Infinity)return {...target};
 const a=1-Math.exp(-rate*dt),head=1-Math.exp(-rate*.55*dt);
 return Object.fromEntries(CHANNELS.map(k=>[k,current[k]+(target[k]-current[k])*(k[0]==='h'&&k.length===2?head:a)]));
}
export function applyPose(r,s){
 // Arms yaw after they swing, so a punch can aim at the target while the chest is turned.
 r.limbs[0].rotation.order='YXZ';r.limbs[2].rotation.order='YXZ';
 r.body.position.x=s.bodyX;r.body.position.y+=s.bodyY;r.body.position.z=s.bodyZ;r.body.rotation.y=s.hipYaw;
 r.spine.rotation.set(s.lean,s.twist,s.side);r.head.rotation.set(s.hx,s.hy,s.hz);
 r.limbs[0].rotation.set(s.lax,s.lay,s.laz);r.limbs[2].rotation.set(s.rax,s.ray,s.raz);r.elbows[0].rotation.x=s.le;r.elbows[1].rotation.x=s.re;
 r.limbs[1].rotation.set(s.llx,0,s.llz);r.limbs[3].rotation.set(s.rlx,0,s.rlz);r.knees[0].rotation.x=s.lk;r.knees[1].rotation.x=s.rk;
}
// Returns true when the sample system handled this frame.
export function animateTala(r,p,time){
 const dt=Math.max(0,Math.min(.1,r.lastTime===undefined?0:time-r.lastTime));r.lastTime=time;
 if(p)advanceStride(r,p);
 const target=targetFor(p,time,p?.stridePhase??r.stridePhase??0);
 if(!target){r.pose=null;r.strikeBlend=null;r.footPlants=null;r.flowBlend=null;r.gaitPlants=null;return false;}
 // Blend the entry offset out by contact, then follow the combat timeline exactly.
 // Smoothing every strike frame delays the fist beyond the frame that deals damage.
 if(target.kind==='strike'){
  r.flowBlend=null;
  const m=p.move,previous=r.strikeBlend;
  if(!previous||previous.move!==m||m.frame<previous.frame){
   const from=r.pose||target.pose;
   r.strikeBlend={move:m,frame:m.frame,offset:Object.fromEntries(CHANNELS.map(k=>[k,from[k]-target.pose[k]]))};
  }
  const entry=1-smooth(m.frame/Math.max(1,m.startup));
  r.pose=Object.fromEntries(CHANNELS.map(k=>[k,target.pose[k]+r.strikeBlend.offset[k]*entry]));
  r.strikeBlend.frame=m.frame;
 }else{
  r.strikeBlend=null;
  // Blend only the change of action: repeated low-pass smoothing shrinks the
  // run cycle and makes the body trail behind the feet at fighting speed.
  const direction=target.kind==='run'?`${Math.sign(p.prev?.x||0)},${Math.sign(p.prev?.z||0)}`:'';
  const key=target.kind+direction;
  if(!r.flowBlend||r.flowBlend.key!==key){
   r.flowBlend={key,elapsed:0,offset:Object.fromEntries(CHANNELS.map(k=>[k,(r.pose||target.pose)[k]-target.pose[k]]))};
  }
  r.flowBlend.elapsed+=dt;
  const duration=target.kind==='run'?.1:target.kind==='idle'?.16:.08;
  const remaining=target.rate===Infinity?0:1-smooth(r.flowBlend.elapsed/duration);
  r.pose=Object.fromEntries(CHANNELS.map(k=>[k,target.pose[k]+r.flowBlend.offset[k]*remaining]));
 }
 // Ponytail and head trail the chest turn slightly.
 if(dt>0){const twistVelocity=(r.pose.twist-(r.prevTwist??r.pose.twist))/dt;r.prevTwist=r.pose.twist;const retention=Math.exp(-13.4*dt);r.twistLag=(r.twistLag||0)*retention+twistVelocity*.1*(1-retention);}else r.twistLag=r.twistLag||0;
 applyPose(r,r.pose);
 if(target.kind==='charge')r.body.position.y+=Math.sin(time*30)*.008;
 plantSupportFeet(r,p,target.kind);
 r.head.rotation.y-=r.twistLag*.6;
 for(let i=0;i<r.clothParts.length;i++){const part=r.clothParts[i];part.rotation.x=Math.sin(time*3+i)*.08+(target.kind==='run'?.2:0);part.rotation.z=Math.sin(time*2.3+i)*.07-r.twistLag*(i===0?1.5:.6);}
 return true;
}

// Keep grounded supporting ankles at their world positions while the torso shifts.
// The two-bone solve is visual only. Release unreachable plants instead of stretching
// a leg or moving the fighter's collision body. Airborne/shared states clear plants.
const ankle=new Vector3(0,-.48,0);
export function plantSupportFeet(r,p,kind){
 const reach=(r.legLength||.48)*2;ankle.y=-(r.legLength||.48);
 if(!p||!['idle','guard','charge','strike','run'].includes(kind)){r.footPlants=null;r.gaitPlants=null;return;}
 r.g.updateMatrixWorld(true);
 const position=new Vector3();r.g.getWorldPosition(position);
 if(r.plantRoot&&position.distanceTo(r.plantRoot)>.5){r.footPlants=null;r.gaitPlants=null;}
 r.plantRoot=position;
 const groundAnkle=k=>{const v=k.localToWorld(ankle.clone());v.y=position.y+.14*r.g.scale.y;return v;};
 if(kind==='run'){
  const forward=p.prev?.x??1,side=-(p.prev?.z||0),length=Math.hypot(forward,side)||1;
  const phase=p.stridePhase??r.stridePhase??0;
  if(!r.gaitPlants)r.gaitPlants=[null,null];
  r.footPlants=[0,1].map(i=>{
   const u=((phase/(Math.PI*2)+i*.5)%1+1)%1,support=u<.5;
   const travel=support?STRIDE*(.5-2*u):STRIDE*(-.5+smooth((u-.5)*2));
   const lift=support?0:Math.sin((u-.5)*Math.PI*2)*.18;
   const rawX=(i===0?-.25:.25)+side/length*travel;
   const footX=i===0?Math.min(-.1,rawX):Math.max(.1,rawX);
   const target=r.g.localToWorld(new Vector3(footX,.14+lift,forward/length*travel));
   if(r.gaitPlants[i]){const x=r.g.worldToLocal(r.gaitPlants[i].clone()).x;if(i===0?x>-.08:x<.08)r.gaitPlants[i]=null;}
   if(!support)r.gaitPlants[i]=null;
   else if(!r.gaitPlants[i])r.gaitPlants[i]=target.clone();
   return support?r.gaitPlants[i].clone():target;
  });
 }else{
  if(r.gaitPlants){r.footPlants=null;r.gaitPlants=null;}
  if(!r.footPlants)r.footPlants=[0,1].map(i=>r.g.localToWorld(new Vector3(i===0?-.25:.25,.14,i===0?.24:-.24)));
 }
 // Let the hips settle rather than pulling an anchored foot up during the bounce.
 let settle=0;
 for(let i=0;i<2;i++){
  const v=r.body.worldToLocal(r.footPlants[i].clone()).sub(r.limbs[i*2+1].position);
  if(v.y<0&&v.x*v.x+v.z*v.z<(reach-.01)**2)settle=Math.max(settle,-v.y-Math.sqrt((reach-.01)**2-v.x*v.x-v.z*v.z));
 }
 r.body.position.y-=Math.min(.12,settle);r.g.updateMatrixWorld(true);
 for(let i=0;i<2;i++){
  const leg=r.limbs[i*2+1],knee=r.knees[i];
  const v=r.body.worldToLocal(r.footPlants[i].clone()).sub(leg.position),d=v.length();
  if(d>reach-.005||d<.2){r.footPlants[i]=groundAnkle(knee);if(r.gaitPlants)r.gaitPlants[i]=null;continue;}
  const bend=2*Math.acos(Math.min(1,d/reach));
  leg.rotation.order='ZXY';
  leg.rotation.set(Math.atan2(-v.z,Math.hypot(v.x,v.y))-bend/2,0,Math.atan2(v.x,-v.y));
  knee.rotation.x=bend;
 }
}
