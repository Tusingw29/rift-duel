import {retreatPhase,retreatLift} from './retreat-motion.js';
import {Vector3,Quaternion,Euler} from './vendor/three.module.js';
// lw/rw: wrist roll about the forearm axis (hand bone local Y). 0 keeps the model's rest wrist.
// lc/rc: collarbone protraction (shoulder driven forward, radians). 0 leaves it to the combat rig's reach rule;
// a 17-bone body has no clavicle and ignores it.
// bodyPitch/bodyRoll: root rotation about X (positive pitches forward) and Z, used by falls and rising; 0 otherwise.
// lwx/rwx: wrist flexion (hand rotation.x, +π/2 brings a palm-axis blade in line with the forearm); lwz/rwz: ulnar/radial deviation.
export const CHANNELS=['lwx','lwz','rwx','rwz','bodyPitch','bodyRoll','bodyX','bodyY','bodyZ','hipYaw','lean','twist','side','hx','hy','hz','neckY','neckZ','lax','lay','laz','rax','ray','raz','le','re','llx','llz','rlx','rlz','lk','rk','lw','rw','lc','rc'];
export const STRIDE=1.15;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export function applyPose(r,s){
 // Arms yaw after they swing, so a punch can aim at the target while the chest is turned.
 r.limbs[0].rotation.order='YXZ';r.limbs[2].rotation.order='YXZ';
 // Coupling: a hip turn shifts the weight toward the leading foot, so the legs answer every torso turn (authored bodyZ keeps the forward drive explicit).
 r.body.position.x=s.bodyX+s.hipYaw*.16;r.body.position.y+=s.bodyY;r.body.position.z=s.bodyZ;r.body.rotation.set(s.bodyPitch||0,s.hipYaw,s.bodyRoll||0);
 r.spine.rotation.set(s.lean,s.twist,s.side);r.headRest??=r.head.position.clone();r.head.position.copy(r.headRest);r.head.position.y+=s.neckY||0;r.head.position.z+=s.neckZ||0;r.head.rotation.set(s.hx,s.hy,s.hz);
 // Elbows and knees are pure flexion hinges: never hyperextended past straight, never bent sideways. Inward and outward arcs
 // come from the shoulder and hip rotations around them.
 r.limbs[0].rotation.set(s.lax,s.lay,s.laz);r.limbs[2].rotation.set(s.rax,s.ray,s.raz);r.elbows[0].rotation.set(Math.min(0,s.le),0,0);r.elbows[1].rotation.set(Math.min(0,s.re),0,0);
 // Wrist roll is authored per pose; rigs with a richer hand (the graphic combat rig) read the same channel.
 if(!r.morrowHandRest){r.limbs[0].userData.hand.rotation.set(s.lwx||0,s.lw||0,s.lwz||0);r.limbs[2].userData.hand.rotation.set(s.rwx||0,s.rw||0,s.rwz||0);}
 else{[r.limbs[0],r.limbs[2]].forEach((arm,i)=>{const h=arm.userData.hand;h.quaternion.copy(r.morrowHandRest[i]).multiply(new Quaternion().setFromEuler(new Euler(i?s.rwx||0:s.lwx||0,i?s.rw||0:s.lw||0,i?s.rwz||0:s.lwz||0))); });}
 r.limbs[1].rotation.set(s.llx,0,s.llz);r.limbs[3].rotation.set(s.rlx,0,s.rlz);r.knees[0].rotation.set(Math.max(0,s.lk),0,0);r.knees[1].rotation.set(Math.max(0,s.rk),0,0);
}
// Keep grounded supporting ankles at their world positions while the torso shifts.
// The two-bone solve is visual only. Release unreachable plants instead of stretching
// a leg or moving the fighter's collision body. Airborne/shared states clear plants.
const ankle=new Vector3(0,-.48,0);
export function plantSupportFeet(r,p,kind){
 const ankleHeight=r.ankleHeight??.14;
 const upper=r.legLength||.48,lower=r.shinLength||upper,reach=upper+lower;ankle.y=-lower;
 // Airborne feet pitch up a little (dorsiflexed, reaching for the floor); a flat foot at the last airborne frame would dip the shoe under it.
 if(['flight','freeFlight'].includes(kind)&&r.feet)for(const foot of r.feet)foot.rotation.x=-.3;
 if(!p||!(['idle','guard','charge','strike','shot','forward','back','run','stagger','squat','victory','collapse'].includes(kind)||kind==='hurt'&&r.footOffsets)){r.footPlants=null;r.gaitPlants=null;r.recoilStep=null;r.talaGait=null;r.gaitLanding=null;return;}
 r.g.updateMatrixWorld(true);
 const position=new Vector3();r.g.getWorldPosition(position);
 if(r.plantRoot&&position.distanceTo(r.plantRoot)>.5){r.footPlants=null;r.gaitPlants=null;r.talaGait=null;}
 r.plantRoot=position;
 const groundAnkle=k=>{const v=k.localToWorld(ankle.clone());v.y=position.y+ankleHeight*r.g.scale.y;return v;};
 if(kind==='run'&&r.gaitTargets){
  r.footPlants=r.gaitTargets(r,p,p.stridePhase??r.stridePhase??0,ankleHeight);
 }else if(kind==='run'){
  const forward=p.prev?.x??1,side=-(p.prev?.z||0),length=Math.hypot(forward,side)||1;
  const phase=p.stridePhase??r.stridePhase??0;
  if(!r.gaitPlants)r.gaitPlants=[null,null];
  r.footPlants=[0,1].map(i=>{
   const u=((phase/(Math.PI*2)+i*.5)%1+1)%1,support=u<.5;
   const travel=support?STRIDE*(.5-2*u):STRIDE*(-.5+smooth((u-.5)*2));
   const lift=support?0:Math.sin((u-.5)*Math.PI*2)*.24;
   const rawX=(i===0?-.25:.25)+side/length*travel;
   const footX=i===0?Math.min(-.1,rawX):Math.max(.1,rawX);
   const target=r.g.localToWorld(new Vector3(footX,ankleHeight+lift,forward/length*travel));
   if(r.gaitPlants[i]){const x=r.g.worldToLocal(r.gaitPlants[i].clone()).x;if(i===0?x>-.08:x<.08)r.gaitPlants[i]=null;}
   if(!support)r.gaitPlants[i]=null;
   else if(!r.gaitPlants[i])r.gaitPlants[i]=target.clone();
   return support?r.gaitPlants[i].clone():target;
  });
 }else{
  if(r.talaGait){
   const ground=position.y+ankleHeight*r.g.scale.y;
   r.gaitLanding={start:r.lastTime||0,heights:r.talaGait.feet.map(foot=>Math.max(0,foot.at.y-ground)/r.g.scale.y)};
   r.footPlants=r.talaGait.feet.map(foot=>{const at=foot.at.clone();at.y=ground;return at;});r.gaitPlants=null;r.talaGait=null;
   // IMPORT-POLISH: the captured footwork can stop mid-stride with the feet far apart. Re-anchor the stance under the
   // fighter and walk the old spots off as two quick lifted steps (farther foot first) instead of holding a straddle.
   if(r.importFoot){
    const home=[0,1].map(i=>new Vector3(i===0?-.25:.25,ankleHeight,i===0?.24:-.24)),from=r.footPlants.map((at,i)=>{const v=r.g.worldToLocal(at.clone()).sub(home[i]);v.y=0;return v;});
    if(from.some(v=>v.length()>.05)){r.gaitHome={start:r.lastTime||0,from,order:from[0].length()>=from[1].length()?[0,1]:[1,0]};r.footPlants=home.map(v=>r.g.localToWorld(v.clone()));}
    r.importFoot=null;
   }
  }
  if(r.gaitPlants){r.footPlants=null;r.gaitPlants=null;}
  if(!r.footPlants)r.footPlants=[0,1].map(i=>r.g.localToWorld(new Vector3(i===0?-.25:.25,ankleHeight,i===0?.24:-.24)));
 }
 // During Tala's retreat hop the feet travel with the actual collision root.
 // Store takeoff anchors once, then plant the landing instead of stretching
 // grounded legs behind a moving pelvis.
 if(kind==='back'&&p.move?.retreatTravel){
  const u=retreatPhase(p.move);
  if(u>0){
   if(r.retreatFeet?.move!==p.move)r.retreatFeet={move:p.move,anchors:r.footPlants.map(at=>{const v=r.g.worldToLocal(at.clone());v.y=ankleHeight;return v;})};
   if(!r.retreatFeet.landed)r.footPlants=r.retreatFeet.anchors.map(at=>r.g.localToWorld(at.clone().add(new Vector3(0,retreatLift(p.move),0))));
   if(u>=1)r.retreatFeet.landed=true;
  }
 }else if(r.retreatFeet){
  const ground=position.y+ankleHeight*r.g.scale.y;
  if(r.footOffsets)r.gaitLanding={start:r.lastTime||0,heights:r.footPlants.map(at=>Math.max(0,at.y-ground)/r.g.scale.y)};
  r.footPlants.forEach(at=>at.y=ground);r.retreatFeet=null;
 }
 // Articulated feet can pivot around the planted ball, moving the ankle and
 // solving the leg above it without sliding the contact point across the floor.
 const facing=r.g.getWorldQuaternion(new Quaternion()),scale=r.g.getWorldScale(new Vector3());
 if(kind==='hurt'&&r.footOffsets){const forward=new Vector3(0,0,1).applyQuaternion(facing);facing.setFromAxisAngle(new Vector3(0,1,0),Math.atan2(forward.x,forward.z));}
 // The kinetic chain samples the lower body two frames ahead; the foot pivot and drive read the same lead so the ball never slips.
 const led=p?.move&&p.move.frame<p.move.startup&&['strike','shot','forward','back'].includes(kind)?{...p,move:{...p.move,frame:Math.min(p.move.startup,p.move.frame+Math.min(2,p.move.frame))}}:p; // lead ramps in over two frames and never passes contact
 const pivots=r.footPivot?.(led,kind),offsets=r.footOffsets?.(r,led,kind);
 // A chained move restarts the pivot curve at flat; blend the heel down from where the last move left it over the new
 // load instead of snapping the foot (and the ankle above it) in one frame. Frame-driven, so hitstop holds it.
 if(pivots){
  const m=p?.move,id=m?`${m.started??'-'}|${m.kind}|${m.chain}`:null;
  if(id&&r.pivotLast&&(r.pivotBlend?.id!==id||m.frame<r.pivotBlend.frame))r.pivotBlend={id,from:r.pivotLast.map(q=>q.clone())};
  if(!id)r.pivotBlend=null;
  if(r.pivotBlend){r.pivotBlend.frame=m.frame;const u=smooth(m.frame/Math.max(1,m.startup*.42));if(u<1)pivots.forEach((q,i)=>q.copy(r.pivotBlend.from[i].clone().slerp(q,u)));}
  r.pivotLast=pivots.map(q=>q.clone());
 }else r.pivotLast=null;
 if(r.gaitHome){
  const e=(r.lastTime||0)-r.gaitHome.start;
  if(kind==='run'||e>.45||!offsets)r.gaitHome=null;
  else r.gaitHome.from.forEach((d,i)=>{const u=smooth((e-r.gaitHome.order.indexOf(i)*.09)/.14);offsets[i].x+=d.x*(1-u);offsets[i].z+=d.z*(1-u);if(u>0&&u<1)offsets[i].y+=.07*Math.sin(Math.PI*u);});
 }
 const footRotations=r.feet?.map((_,i)=>facing.clone().multiply(pivots?.[i]||new Quaternion()));
 r.footAnchors=[];
 const targets=r.footPlants.map((plant,i)=>{
  const target=plant.clone();if(offsets?.[i])target.add(offsets[i].clone().multiply(scale).applyQuaternion(facing));
  r.footAnchors[i]=target.clone(); // plant + authored offset, before any ball pivot
  if(!r.footBall||!footRotations)return target;
  const ball=r.footBall.clone().multiply(scale);
  return target.add(ball.clone().applyQuaternion(facing)).sub(ball.applyQuaternion(footRotations[i]));
 });
 r.footTargets=targets.map(t=>t.clone()); // plant + authored offset (taps, recoil catch, landing settle); the anchors themselves stay in r.footPlants
 // Let the hips settle rather than pulling an anchored foot up during the bounce.
 let settle=0;
 for(let i=0;i<2;i++){
  const v=r.limbs[i*2+1].parent.worldToLocal(targets[i].clone()).sub(r.limbs[i*2+1].position);
  if(v.y<0&&v.x*v.x+v.z*v.z<(reach-.01)**2)settle=Math.max(settle,-v.y-Math.sqrt((reach-.01)**2-v.x*v.x-v.z*v.z));
 }
 r.body.position.y-=Math.min(.12,settle);r.g.updateMatrixWorld(true);
 for(let i=0;i<2;i++){
  const leg=r.limbs[i*2+1],knee=r.knees[i];
  const v=leg.parent.worldToLocal(targets[i].clone()).sub(leg.position);let d=v.length();
  // Out of reach with the hip still above the floor point: the foot is dragged along the floor toward the hips (the
  // rear foot trailing a drive) and its anchor moves with it, instead of dropping under a knee pointing anywhere.
  const along=reach-.012,h=Math.hypot(v.x,v.z);
  if(d>reach-.005&&Math.abs(v.y)<along&&h>1e-6){
   const k=Math.sqrt(along*along-v.y*v.y)/h;v.x*=k;v.z*=k;d=v.length();
   const moved=leg.parent.localToWorld(v.clone().add(leg.position)),shift=moved.clone().sub(targets[i]);shift.y=0;
   r.footPlants[i].add(shift);if(r.talaGait)r.talaGait.feet[i].at.add(shift);targets[i].add(shift);r.footTargets[i].add(shift);r.footAnchors[i].add(shift);
  }
  if(d>reach-.005||d<Math.max(.2,Math.abs(upper-lower)+.005)){r.footPlants[i]=groundAnkle(knee);if(r.talaGait)r.talaGait.feet[i].at.copy(r.footPlants[i]);if(r.gaitPlants)r.gaitPlants[i]=null;continue;}
  // Law of cosines preserves the planted ankle on rigs with unequal segments.
  const clamp=v=>Math.max(-1,Math.min(1,v));
  const bend=Math.PI-Math.acos(clamp((upper*upper+lower*lower-d*d)/(2*upper*lower)));
  const hip=Math.acos(clamp((upper*upper+d*d-lower*lower)/(2*upper*d)));
  leg.rotation.order='ZXY';
  leg.rotation.set(Math.atan2(-v.z,Math.hypot(v.x,v.y))-hip,0,Math.atan2(v.x,-v.y));
  knee.rotation.x=bend;
 }
 // Keep articulated boot soles level while the two leg bones bend above them.
 // Only rigs with independent feet participate; shared aerial poses reset them.
 if(r.feet){r.g.updateMatrixWorld(true);for(const [i,foot] of r.feet.entries()){const parent=foot.parent.getWorldQuaternion(new Quaternion());foot.quaternion.copy(parent.invert().multiply(footRotations[i]));}}

}
// Floor clamp for grounded poses that are not foot-planted (getting up): if any joint would pass below the stone,
// lift the whole body by the deficit. Ankles keep their sole height, knees, elbows and hands a little skin, the head
// its skull. Returns the lift applied (0 when the pose is already clear).
export function clampToFloor(r){
 r.g.updateMatrixWorld(true);
 const ground=r.g.getWorldPosition(new Vector3()).y,scale=r.g.getWorldScale(new Vector3()).y,shin=r.shinLength||r.legLength||.48;
 const points=[...r.knees.map(k=>[k.localToWorld(new Vector3(0,-shin,0)),(r.ankleHeight??.14)*.6]),...r.knees.map(k=>[k.getWorldPosition(new Vector3()),.05]),
  ...r.elbows.map(e=>[e.getWorldPosition(new Vector3()),.04]),...[r.limbs[0],r.limbs[2]].map(a=>[a.userData.hand.getWorldPosition(new Vector3()),.03]),[r.head.getWorldPosition(new Vector3()),.1]];
 let lift=0;for(const [p,pad] of points)lift=Math.max(lift,ground+pad*scale-p.y);
 if(lift>0){r.body.position.y+=lift/scale;r.g.updateMatrixWorld(true);}
 return lift;
}
