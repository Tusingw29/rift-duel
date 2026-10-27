// WEIGHT-TRANSFER: ground-up power for grounded attacks. Adam (2026-10-27): the fighters swung their arms from a body
// bolted to the floor ("Rock 'Em Sock 'Em Robots"); Tekken and Soul Calibur fighters sit light in footsies, then burst
// into the whole body: the weight sinks into the rear leg, the lead foot steps in, the hips drive through the strike
// past the front foot, the rear foot is dragged after them, and the body carries on past the line before it steps
// back into stance.
//
// One curve per move, read from the simulation's move frame only (frozen in hitstop, deterministic in replays). It
// returns offsets in the fighter's frame (x right, z toward the rival): the pelvis (bodyZ, bodyY, lean) for the pose
// and the two ankles for the planted feet. The simulation's root never moves for this; the feet step in and back.
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const snapOut=t=>{t=Math.max(0,Math.min(1,t));return 1-(1-t)**3;};
// Strength per move: combos build (jab, cross, the stepping finisher), signature drives commit hardest, a launcher
// loads deep and drives up, shots plant and push, a back special shifts the weight away from the rival.
export function weightProfile(move){
 if(!move||move.travel||move.aerial||move.retreatTravel)return null;
 const chain=Math.max(1,Math.min(3,move.chain||1));
 switch(move.kind){
  // The lead-hand punch (Tala's second hit) pivots on the lead foot: the weight rolls onto it without a step.
  case 'strike':return {k:[.8,1,1.25][chain-1],dir:1,up:0,step:chain===2?0:1};
  case 'forward':return {k:1.1,dir:1,up:0};
  case 'shot':return {k:.6,dir:1,up:0,trail:0}; // a planted push: the rear ball never leaves the floor
  case 'launch':return {k:.9,dir:1,up:1};
  case 'back':return {k:.7,dir:-1,up:0};
  default:return null;
 }
}
// Key times (frames) and values, scaled by the profile. Values: pelvis forward, pelvis drop, chest lean, stepping
// foot forward and lift, trailing foot forward and lift.
//   0 stance · load (weight back and down into the rear leg) · plant (lead foot lands just before contact)
//   · impact (hips over the front foot, rear leg long) · hold (through the active frames and the hitstop)
//   · carry (weight rolls past the line, rear foot dragged in) · regather (rear foot back home)
//   · reset (lead foot steps home) · stance
// Global scale on every curve, tuned live in the animation workbench (1 = as authored here).
export const weightTuning={scale:1};
function keys(move,p){
 const s=Math.max(2,move.startup),a=move.active||1,R=Math.max(4,move.recovery);
 const t=[0,s*.42,s-1,s,s+a+1,s+a+R*.3,s+a+R*.55,s+a+R*.85,s+a+R];
 const k=p.k*weightTuning.scale,up=p.up;
 return {t,
  z:[0,-.11,.22,.34,.34,.4,.24,.06,0].map(v=>v*k*(up?.55:1)),
  y:(up?[0,-.17,-.1,.05,.05,0,-.04,-.01,0]:[0,-.14,-.11,-.08,-.08,-.11,-.06,-.02,0]).map(v=>v*k),
  lean:(up?[0,.1,.06,-.08,-.08,-.02,.02,0,0]:[0,-.05,.12,.17,.17,.21,.09,.02,0]).map(v=>v*k),
  step:[0,0,.28,.28,.28,.28,.28,0,0].map(v=>v*k*(p.step??1)),
  // The rear ball stays planted through the startup (the heel pivots on it) and is dragged in after contact.
  trail:[0,0,0,0,.1,.18,0,0,0].map(v=>v*k*(p.trail??1))};
}
// Piecewise: the last frame into contact snaps out (the hit); the drive before it accelerates and lands (a lunge, not
// a pop: the hips never cover more than about a tenth of a unit in a frame); everything else eases.
function sample(t,v,f){
 if(f<=t[0])return v[0];if(f>=t.at(-1))return v.at(-1);
 let i=1;while(i<t.length-1&&f>t[i])i++;
 const u=(f-t[i-1])/((t[i]-t[i-1])||1e-6);
 return v[i-1]+(v[i]-v[i-1])*(i===3?snapOut(u):smooth(u));
}
const bump=(f,a,b)=>f>a&&f<b?Math.sin(Math.PI*(f-a)/(b-a)):0;
// Lower-body lead: the hips and feet read up to two frames ahead before contact (never past it), the same lead the
// foot pivot uses, so the pelvis arrives before the fist.
// Frames where each foot pays off a carried offset (the stepping foot from load to plant, the other just behind it) and
// where the pelvis drives (load to contact): a carried offset (a combo's previous step, or the simulation's chain
// advance) is only paid off while that part is actually moving, so a planted foot never slides to catch up.
export function weightWindows(move){
 const p=weightProfile(move);if(!p)return null;const t=keys(move,p).t;
 // A carried offset is paid off by a shuffle: the stepping foot first, the other right behind it, both before
 // contact (a chained hit advances the whole stance, not one foot).
 // The hips hold back through the load (the wind-up) and drive through the advance with the step.
 const step=[t[1],t[2]],follow=[t[1]+(t[2]-t[1])*.2,t[2]],body=[t[1]*.4,t[3]];
 return p.dir>0?{lead:step,rear:follow,body}:{lead:follow,rear:step,body};
}
export const ledFrame=move=>move.frame<move.startup?Math.min(move.startup,move.frame+Math.min(2,move.frame)):move.frame;
export function weightShift(move,frame=ledFrame(move)){
 const p=weightProfile(move);if(!p)return null;
 const K=keys(move,p),t=K.t;if(frame>=t.at(-1))return null;
 const f=Math.max(0,frame),dir=p.dir;
 // The stepping foot lifts on its way in (load to plant) and on its way home (regather to reset); the trailing foot
 // slides in on the ball (the heel pivot lifts it) and lifts a little stepping home.
 const stepLift=.07*p.k*(p.step??1)*(bump(f,t[1],t[2])+bump(f,t[6],t[7])),trailLift=.04*p.k*bump(f,t[5],t[6]);
 return {
  bodyZ:dir*sample(t,K.z,f),bodyY:sample(t,K.y,f),lean:dir*sample(t,K.lean,f),
  // Forward moves step the lead foot in and drag the rear; a backward shift steps the rear foot out first.
  lead:{z:dir>0?sample(t,K.step,f):-sample(t,K.trail,f),y:dir>0?stepLift:trailLift},
  rear:{z:dir>0?sample(t,K.trail,f):-sample(t,K.step,f),y:dir>0?trailLift:stepLift}
 };
}
// Pose side, for any grounded animator: hips forward and down, chest over the front foot. The head and both arms
// counter the extra lean, so the eyes and the weapon stay on the target while the body drives in behind them.
// The authored pose's own forward drive counts toward a cap, so a strike that already lunges (a stepping hook) is not
// pushed past where the rear leg can keep its ball on the floor; the extra commitment then shows in the lean.
export const MAX_DRIVE=.5;
export function applyWeight(pose,move){
 const w=move&&weightShift(move);if(!w)return pose;
 const z=w.bodyZ>0?Math.max(0,Math.min(w.bodyZ,MAX_DRIVE-pose.bodyZ)):w.bodyZ;
 return {...pose,bodyZ:pose.bodyZ+z,bodyY:pose.bodyY+w.bodyY,lean:pose.lean+w.lean,hx:pose.hx-w.lean*.6,lax:pose.lax-w.lean*.9,rax:pose.rax-w.lean*.9};
}
