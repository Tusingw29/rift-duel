import {talaFootOffsets} from './tala-footwork.js';
import {weightShift,weightWindows} from './weight-transfer.js';
import {Quaternion,Vector3} from './vendor/three.module.js';
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
// Heel pivot for every rig that has feet but no fighter-specific pivot: during drive, impact and overshoot the rear
// heel lifts and the foot yaws with the hips while the ball stays on the stone (the toe bone counter-hinges flat in
// the combat rig), and the lead ankle flexes forward over its planted foot so the body visibly pushes off.
const UP=new Vector3(0,1,0),RIGHT=new Vector3(1,0,0);
export function kineticFootPivot(player,kind){
 const rotations=[new Quaternion(),new Quaternion()],move=player?.move;
 if(!move||!['strike','shot','forward','back','technique','launch'].includes(kind)||kind!==move.kind&&!(kind==='strike'&&move.kind!=='strike'))return rotations;
 const contact=move.startup,release=contact+(move.active||1)+4;
 const drive=smooth((move.frame-contact*.35)/Math.max(1,contact*.65))*(1-smooth((move.frame-release)/Math.max(1,move.recovery*.6)));
 if(drive<=0)return rotations;
 const rear=move.chain===2?0:1,sign=rear?-1:1;
 rotations[rear].setFromAxisAngle(UP,sign*.45*drive).multiply(new Quaternion().setFromAxisAngle(RIGHT,.4*drive));
 rotations[1-rear].setFromAxisAngle(RIGHT,-.12*drive).multiply(new Quaternion().setFromAxisAngle(UP,sign*.1*drive));
 return rotations;
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
 // WEIGHT-TRANSFER: the lead foot steps in under the strike and the rear foot is dragged after the hips, then both
 // step home (weight-transfer.js). The previous move's offsets carry into the next one (a combo stays stepped in)
 // and anything that interrupts a strike (a hit, a guard) walks the feet home over 0.12 s instead of snapping them.
 // plantSupportFeet already passes the move with the lower-body lead applied, as a fresh object each frame.
 const w=['strike','shot','forward','back'].includes(kind)&&p?.move?weightShift(p.move,p.move.frame):null,id=p?.move&&`${p.move.started??'-'}|${p.move.kind}|${p.move.chain}`;
 const pose=r.lastPose,lead=pose&&pose.rlx<pose.llx?1:0,rear=1-lead;
 const root=r.g.getWorldPosition(new Vector3());
 let feet=null;
 if(w){
  feet=[null,null];feet[lead]={x:0,y:w.lead.y,z:w.lead.z};feet[rear]={x:0,y:w.rear.y,z:w.rear.z};
  const c=r.weightCarry,m=p.move;
  // A new move: a new identity, or (fixtures without a start tick) the same kind restarting its frame count.
  if(!c||c.move!==id||m.frame<c.frame){
   const from=r.weightLast?.map(o=>({...o,y:0}))||[{x:0,y:0,z:0},{x:0,y:0,z:0}],body={x:0,z:0};
   // A chained strike starts with the simulation's advance: the root jumps up to 0.4 toward the rival in one frame.
   // Move the foot anchors with it but keep the feet and hips where they were; the step-in pays the jump off.
   const jump=r.weightRootPrev&&m.chain>1?root.clone().sub(r.weightRootPrev):null;
   if(jump&&jump.length()>.02&&jump.length()<.6&&r.footPlants){
    for(const at of r.footPlants)at.add(jump);
    const local=jump.clone().applyQuaternion(r.g.getWorldQuaternion(new Quaternion()).invert()).divide(r.g.getWorldScale(new Vector3()));
    for(const o of from){o.x-=local.x;o.z-=local.z;}body.x=local.x;body.z=local.z;
   }
   r.weightCarry={move:id,from,body};
  }
  r.weightCarry.frame=m.frame;const {from,body}=r.weightCarry,win=weightWindows(m),f=m.frame,pay=([a,b])=>1-smooth((f-a)/Math.max(1,b-a));
  for(const [i,range] of [[lead,win.lead],[rear,win.rear]]){
   const k=pay(range),gap=Math.hypot(from[i].x-feet[i].x,from[i].z-feet[i].z);
   // A foot paying off a carried offset lifts as it travels (a step, not a slide).
   if(gap>.03&&k>0&&k<1)feet[i].y=Math.max(feet[i].y,Math.min(.08,gap*.35)*Math.sin(Math.PI*(1-k)));
   feet[i].x+=(from[i].x-feet[i].x)*k;feet[i].z+=(from[i].z-feet[i].z)*k;
  }
  // The hips start behind by the advance and drive through it by contact.
  const kb=pay(win.body);if(kb>0){r.body.position.x-=body.x*kb;r.body.position.z-=body.z*kb;}
  r.weightFade=null;
 }else if(r.weightLast&&r.weightLast.some(o=>o.z||o.y)){
  r.weightFade??={start:time,from:r.weightLast};const k=1-smooth((time-r.weightFade.start)/.12);
  feet=k>0?r.weightFade.from.map(o=>({x:o.x*k,y:o.y*k,z:o.z*k})):null;
  if(!feet){r.weightFade=null;r.weightCarry=null;}
 }else r.weightCarry=null;
 r.weightLast=feet;r.weightRootPrev=root;
 if(feet)for(let i=0;i<2;i++){offsets[i].x+=feet[i].x;offsets[i].y+=feet[i].y;offsets[i].z+=feet[i].z;}
 return offsets;
}
