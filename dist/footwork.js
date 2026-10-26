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
 // Stepping idle: while the weight sits on one foot the other lifts, moves to a new spot and re-plants there. Between
 // steps the displacement is constant, so a planted foot never skates. The lead foot steps forward and home, the rear
 // foot steps out-and-back and home, so the stance never drifts from the simulation position. Guard steps at 45%.
 const stepping=kind==='idle'||kind==='guard',amount=kind==='idle'?1:.45;
 r.stepFeet??=[{disp:{x:0,z:0},next:null,parity:0,last:null},{disp:{x:0,z:0},next:null,parity:0,last:null}];
 if(stepping){
  const {step}=idleRhythm(time),pose=r.lastPose,lead=pose&&pose.rlx<pose.llx?1:0;
  r.stepLeft=null;
  for(const [i,f] of r.stepFeet.entries()){
   if(step&&step.foot===i){
    if(!f.next){f.parity^=1;const out=f.parity;f.next=i===lead?{x:out?(i?.04:-.04):0,z:out?.11:0}:{x:out?(i?.08:-.08):0,z:out?-.07:0};}
    const u=smooth(step.u),lift=Math.sin(Math.PI*step.u);
    const o={x:(f.disp.x+(f.next.x-f.disp.x)*u)*amount,y:.1*lift*amount,z:(f.disp.z+(f.next.z-f.disp.z)*u)*amount};
    offsets[i].x+=o.x;offsets[i].y+=o.y;offsets[i].z+=o.z;f.last=o;
   }else{
    if(f.next){f.disp=f.next;f.next=null;}
    const o={x:f.disp.x*amount,y:0,z:f.disp.z*amount};offsets[i].x+=o.x;offsets[i].z+=o.z;f.last=o;
   }
  }
 }else if(r.stepFeet.some(f=>f.last&&(f.last.x||f.last.y||f.last.z))){
  // Leaving the stepping states: a strike snaps the feet home (contact geometry must be exact); anything else fades over 0.12 s.
  if(['strike','shot','forward','back'].includes(kind))for(const f of r.stepFeet){f.disp={x:0,z:0};f.next=null;f.last=null;}
  else{
   r.stepLeft??=time;const k=1-smooth((time-r.stepLeft)/.12);
   if(k<=0)for(const f of r.stepFeet){f.disp={x:0,z:0};f.next=null;f.last=null;}
   else for(const [i,f] of r.stepFeet.entries())if(f.last){offsets[i].x+=f.last.x*k;offsets[i].y+=f.last.y*k;offsets[i].z+=f.last.z*k;}
  }
 }
 // Rigs with an articulated foot pivot on the ball instead (talaFootPivot, Morrow's transition); the slide is for the others.
 if(kind==='strike'&&p?.move&&!p.move.travel&&!r.footPivot){
  const m=p.move,pose=r.lastPose,rear=pose&&pose.rlx>pose.llx?1:0;
  const drive=smooth((m.frame-m.startup*.5)/Math.max(1,m.startup*.5))*(1-smooth((m.frame-m.startup-(m.active||1)-m.recovery*.4)/Math.max(1,m.recovery*.4)));
  offsets[rear].z+=.2*drive;offsets[rear].y+=.04*Math.sin(Math.PI*Math.min(1,drive));offsets[1-rear].z+=.06*drive;
 }
 return offsets;
}
