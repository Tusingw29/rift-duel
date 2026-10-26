import {talaFootOffsets} from './tala-footwork.js';
// Shared weight rhythm and footwork for every grounded fighter. A boxing stance is never still: in CMU 14_01 the
// hips drift 0.6 units sideways and 0.7 forward/back over three seconds, the pelvis yaw swings ±0.4 rad and the
// knees pump through half a radian while the fighter waits. The rhythm here is a tamed version of that: the weight
// rolls from foot to foot, the unweighted foot taps out and back, the knees bounce in double time, and the hips
// turn a little with every shift. Strikes drive the rear foot forward under the punch.
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export const RHYTHM=1.15; // seconds per cycle: left tap, settle, right tap, settle
export function idleRhythm(time){
 const u=((time/RHYTHM)%1+1)%1;
 // The left foot taps while the weight sits on the right (u .25 to .45), the right while it sits on the left; cycle starts settled.
 const step=u>=.25&&u<.45?{foot:0,u:(u-.25)/.2}:u>=.75&&u<.95?{foot:1,u:(u-.75)/.2}:null;
 const weight=Math.sin(u*Math.PI*2); // +1: weight on the right foot while the left taps
 const bounce=Math.abs(Math.sin(u*Math.PI*4));
 return {u,step,weight,bounce};
}
// Pose side: hips drift toward the supporting foot and turn with it, the pelvis bounces from the knees, the chest counters.
export function rhythmPose(pose,time,amount=1){
 const {weight,bounce}=idleRhythm(time),w=weight*amount,b=bounce*amount;
 // Amplitudes: the pelvis travels about a quarter of the stance width each way, which reads at the fight camera's distance.
 return {...pose,bodyX:pose.bodyX+w*.13,bodyY:pose.bodyY-.045*amount+b*.075,bodyZ:pose.bodyZ+Math.sin(time*2.1)*.04*amount,
  hipYaw:pose.hipYaw+w*.13,twist:pose.twist-w*.09,side:pose.side-w*.06,hz:pose.hz+w*.04,lean:pose.lean+b*.03*amount,
  lk:pose.lk+(1-weight)*.16*amount+(1-bounce)*.12*amount,rk:pose.rk+(1+weight)*.16*amount+(1-bounce)*.12*amount};
}
// Foot side: offsets applied to the planted ankles (fighter frame, x right, z toward the rival). Keeps Tala's recoil
// catch and landing settle, adds the idle taps and the rear-foot drive under a strike.
export function rhythmFootOffsets(r,p,kind){
 const offsets=talaFootOffsets(r,p,kind),time=r.lastTime||0;
 // Taps only while idle; a tap interrupted by guard, a strike or a hit fades out over 0.12 s so the ankle never jumps.
 if(kind==='idle'){
  const {step}=idleRhythm(time);
  if(step){const a=Math.sin(Math.PI*step.u),o={x:(step.foot?1:-1)*.08*a,y:.1*a,z:.12*a};offsets[step.foot].x+=o.x;offsets[step.foot].y+=o.y;offsets[step.foot].z+=o.z;r.tapState={foot:step.foot,o,time};}
  else r.tapState=null;
 }else if(r.tapState&&['strike','shot','forward','back'].includes(kind))r.tapState=null;
 else if(r.tapState){
  const k=1-smooth((time-r.tapState.time)/.12);
  if(k<=0)r.tapState=null;else{const {foot,o}=r.tapState;offsets[foot].x+=o.x*k;offsets[foot].y+=o.y*k;offsets[foot].z+=o.z*k;}
 }
 // Rigs with an articulated foot pivot on the ball instead (talaFootPivot, Morrow's transition); the slide is for the others.
 if(kind==='strike'&&p?.move&&!p.move.travel&&!r.footPivot){
  const m=p.move,pose=r.lastPose,rear=pose&&pose.rlx>pose.llx?1:0;
  const drive=smooth((m.frame-m.startup*.5)/Math.max(1,m.startup*.5))*(1-smooth((m.frame-m.startup-(m.active||1)-m.recovery*.4)/Math.max(1,m.recovery*.4)));
  offsets[rear].z+=.2*drive;offsets[rear].y+=.04*Math.sin(Math.PI*Math.min(1,drive));offsets[1-rear].z+=.06*drive;
 }
 return offsets;
}
