import {Vector3,Quaternion} from './vendor/three.module.js';
export const CHANNELS=['bodyX','bodyY','bodyZ','hipYaw','lean','twist','side','hx','hy','hz','lax','lay','laz','rax','ray','raz','le','re','llx','llz','rlx','rlz','lk','rk'];
export const STRIDE=1.15;
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export function applyPose(r,s){
 // Arms yaw after they swing, so a punch can aim at the target while the chest is turned.
 r.limbs[0].rotation.order='YXZ';r.limbs[2].rotation.order='YXZ';
 r.body.position.x=s.bodyX;r.body.position.y+=s.bodyY;r.body.position.z=s.bodyZ;r.body.rotation.y=s.hipYaw;
 r.spine.rotation.set(s.lean,s.twist,s.side);r.head.rotation.set(s.hx,s.hy,s.hz);
 r.limbs[0].rotation.set(s.lax,s.lay,s.laz);r.limbs[2].rotation.set(s.rax,s.ray,s.raz);r.elbows[0].rotation.x=s.le;r.elbows[1].rotation.x=s.re;
 r.limbs[1].rotation.set(s.llx,0,s.llz);r.limbs[3].rotation.set(s.rlx,0,s.rlz);r.knees[0].rotation.x=s.lk;r.knees[1].rotation.x=s.rk;
}
// Keep grounded supporting ankles at their world positions while the torso shifts.
// The two-bone solve is visual only. Release unreachable plants instead of stretching
// a leg or moving the fighter's collision body. Airborne/shared states clear plants.
const ankle=new Vector3(0,-.48,0);
export function plantSupportFeet(r,p,kind){
 const ankleHeight=r.ankleHeight??.14;
 const reach=(r.legLength||.48)*2;ankle.y=-(r.legLength||.48);
 if(!p||!['idle','guard','charge','strike','run'].includes(kind)){r.footPlants=null;r.gaitPlants=null;return;}
 r.g.updateMatrixWorld(true);
 const position=new Vector3();r.g.getWorldPosition(position);
 if(r.plantRoot&&position.distanceTo(r.plantRoot)>.5){r.footPlants=null;r.gaitPlants=null;}
 r.plantRoot=position;
 const groundAnkle=k=>{const v=k.localToWorld(ankle.clone());v.y=position.y+ankleHeight*r.g.scale.y;return v;};
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
   const target=r.g.localToWorld(new Vector3(footX,ankleHeight+lift,forward/length*travel));
   if(r.gaitPlants[i]){const x=r.g.worldToLocal(r.gaitPlants[i].clone()).x;if(i===0?x>-.08:x<.08)r.gaitPlants[i]=null;}
   if(!support)r.gaitPlants[i]=null;
   else if(!r.gaitPlants[i])r.gaitPlants[i]=target.clone();
   return support?r.gaitPlants[i].clone():target;
  });
 }else{
  if(r.gaitPlants){r.footPlants=null;r.gaitPlants=null;}
  if(!r.footPlants)r.footPlants=[0,1].map(i=>r.g.localToWorld(new Vector3(i===0?-.25:.25,ankleHeight,i===0?.24:-.24)));
 }
 // Articulated feet can pivot around the planted ball, moving the ankle and
 // solving the leg above it without sliding the contact point across the floor.
 const facing=r.g.getWorldQuaternion(new Quaternion()),scale=r.g.getWorldScale(new Vector3());
 const pivots=r.footPivot?.(p,kind);
 const footRotations=r.feet?.map((_,i)=>facing.clone().multiply(pivots?.[i]||new Quaternion()));
 const targets=r.footPlants.map((plant,i)=>{
  if(!r.footBall||!footRotations)return plant;
  const ball=r.footBall.clone().multiply(scale);
  return plant.clone().add(ball.clone().applyQuaternion(facing)).sub(ball.applyQuaternion(footRotations[i]));
 });
 // Let the hips settle rather than pulling an anchored foot up during the bounce.
 let settle=0;
 for(let i=0;i<2;i++){
  const v=r.body.worldToLocal(targets[i].clone()).sub(r.limbs[i*2+1].position);
  if(v.y<0&&v.x*v.x+v.z*v.z<(reach-.01)**2)settle=Math.max(settle,-v.y-Math.sqrt((reach-.01)**2-v.x*v.x-v.z*v.z));
 }
 r.body.position.y-=Math.min(.12,settle);r.g.updateMatrixWorld(true);
 for(let i=0;i<2;i++){
  const leg=r.limbs[i*2+1],knee=r.knees[i];
  const v=r.body.worldToLocal(targets[i].clone()).sub(leg.position),d=v.length();
  if(d>reach-.005||d<.2){r.footPlants[i]=groundAnkle(knee);if(r.gaitPlants)r.gaitPlants[i]=null;continue;}
  const bend=2*Math.acos(Math.min(1,d/reach));
  leg.rotation.order='ZXY';
  leg.rotation.set(Math.atan2(-v.z,Math.hypot(v.x,v.y))-bend/2,0,Math.atan2(v.x,-v.y));
  knee.rotation.x=bend;
 }
 // Keep articulated boot soles level while the two leg bones bend above them.
 // Only rigs with independent feet participate; shared aerial poses reset them.
 if(r.feet){r.g.updateMatrixWorld(true);for(const [i,foot] of r.feet.entries()){const parent=foot.parent.getWorldQuaternion(new Quaternion());foot.quaternion.copy(parent.invert().multiply(footRotations[i]));}}

}
