import {retreatPhase,retreatLift} from './retreat-motion.js';
import {Vector3,Quaternion} from './vendor/three.module.js';
// lw/rw: wrist roll about the forearm axis (hand bone local Y). 0 keeps the model's rest wrist.
// lc/rc: collarbone protraction (shoulder driven forward, radians). 0 leaves it to the combat rig's reach rule;
// a 17-bone body has no clavicle and ignores it.
export const CHANNELS=['bodyX','bodyY','bodyZ','hipYaw','lean','twist','side','hx','hy','hz','neckY','neckZ','lax','lay','laz','rax','ray','raz','le','re','llx','llz','rlx','rlz','lk','rk','lw','rw','lc','rc'];
export const STRIDE=1.15;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export function applyPose(r,s){
 // Arms yaw after they swing, so a punch can aim at the target while the chest is turned.
 r.limbs[0].rotation.order='YXZ';r.limbs[2].rotation.order='YXZ';
 r.body.position.x=s.bodyX;r.body.position.y+=s.bodyY;r.body.position.z=s.bodyZ;r.body.rotation.y=s.hipYaw;
 r.spine.rotation.set(s.lean,s.twist,s.side);r.headRest??=r.head.position.clone();r.head.position.copy(r.headRest);r.head.position.y+=s.neckY||0;r.head.position.z+=s.neckZ||0;r.head.rotation.set(s.hx,s.hy,s.hz);
 r.limbs[0].rotation.set(s.lax,s.lay,s.laz);r.limbs[2].rotation.set(s.rax,s.ray,s.raz);r.elbows[0].rotation.x=s.le;r.elbows[1].rotation.x=s.re;
 // Wrist roll is authored per pose; rigs with a richer hand (the graphic combat rig) read the same channel.
 if(!r.morrowHandRest){r.limbs[0].userData.hand.rotation.set(0,s.lw||0,0);r.limbs[2].userData.hand.rotation.set(0,s.rw||0,0);}
 r.limbs[1].rotation.set(s.llx,0,s.llz);r.limbs[3].rotation.set(s.rlx,0,s.rlz);r.knees[0].rotation.x=s.lk;r.knees[1].rotation.x=s.rk;
}
// Keep grounded supporting ankles at their world positions while the torso shifts.
// The two-bone solve is visual only. Release unreachable plants instead of stretching
// a leg or moving the fighter's collision body. Airborne/shared states clear plants.
const ankle=new Vector3(0,-.48,0);
export function plantSupportFeet(r,p,kind){
 const ankleHeight=r.ankleHeight??.14;
 const upper=r.legLength||.48,lower=r.shinLength||upper,reach=upper+lower;ankle.y=-lower;
 if(!p||!(['idle','guard','charge','strike','shot','forward','back','run','stagger'].includes(kind)||kind==='hurt'&&r.footOffsets)){r.footPlants=null;r.gaitPlants=null;r.recoilStep=null;r.talaGait=null;r.gaitLanding=null;return;}
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
   const lift=support?0:Math.sin((u-.5)*Math.PI*2)*.18;
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
 const pivots=r.footPivot?.(p,kind),offsets=r.footOffsets?.(r,p,kind);
 const footRotations=r.feet?.map((_,i)=>facing.clone().multiply(pivots?.[i]||new Quaternion()));
 const targets=r.footPlants.map((plant,i)=>{
  const target=plant.clone();if(offsets?.[i])target.add(offsets[i].clone().multiply(scale).applyQuaternion(facing));
  if(!r.footBall||!footRotations)return target;
  const ball=r.footBall.clone().multiply(scale);
  return target.add(ball.clone().applyQuaternion(facing)).sub(ball.applyQuaternion(footRotations[i]));
 });
 // Let the hips settle rather than pulling an anchored foot up during the bounce.
 let settle=0;
 for(let i=0;i<2;i++){
  const v=r.limbs[i*2+1].parent.worldToLocal(targets[i].clone()).sub(r.limbs[i*2+1].position);
  if(v.y<0&&v.x*v.x+v.z*v.z<(reach-.01)**2)settle=Math.max(settle,-v.y-Math.sqrt((reach-.01)**2-v.x*v.x-v.z*v.z));
 }
 r.body.position.y-=Math.min(.12,settle);r.g.updateMatrixWorld(true);
 for(let i=0;i<2;i++){
  const leg=r.limbs[i*2+1],knee=r.knees[i];
  const v=leg.parent.worldToLocal(targets[i].clone()).sub(leg.position),d=v.length();
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
