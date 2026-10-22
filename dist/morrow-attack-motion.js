import {Vector3,Quaternion} from './vendor/three.module.js';
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const up=new Vector3(0,1,0),right=new Vector3(1,0,0);
export function morrowFootPivot(player,kind){
 const result=[new Quaternion(),new Quaternion()],m=player?.move;
 if(kind!=='strike'||m?.kind!=='strike')return result;
 const drive=smooth(m.frame/Math.max(1,m.startup))*(1-smooth((m.frame-m.startup-(m.active||1))/Math.max(1,m.recovery)));
 const driver=m.chain===2?0:1,sign=driver===0?1:-1;
 result[driver].setFromAxisAngle(up,sign*(m.chain===3?.14:.42)*drive).multiply(new Quaternion().setFromAxisAngle(right,.25*drive));
 result[1-driver].setFromAxisAngle(up,sign*.09*drive);return result;
}
function aim(bone,child,target){
 const origin=bone.getWorldPosition(new Vector3()),from=child.getWorldPosition(new Vector3()).sub(origin).normalize(),to=target.clone().sub(origin).normalize();
 const world=bone.getWorldQuaternion(new Quaternion()).premultiply(new Quaternion().setFromUnitVectors(from,to));
 bone.quaternion.copy(bone.parent.getWorldQuaternion(new Quaternion()).invert().multiply(world));bone.updateWorldMatrix(false,true);
}
// Close the two-hand grip after animation transitions without stretching bones.
// The striking wrist keeps its authored orientation; models may supply a grip anchor.
export function finishMorrowAttack(r,p){
 r.morrowHandRest??=[r.limbs[0],r.limbs[2]].map(arm=>arm.userData.hand.quaternion.clone());
 const previousWeight=r.morrowGrip?.weight||0,m=p?.move;r.morrowGrip=null;
 if(m?.kind!=='strike'||p.air>0||r.animationFamily!=='grounded'){r.morrowGripEntry=null;return;}
 if(!r.morrowGripEntry||r.morrowGripEntry.move!==m||r.morrowGripEntry.chain!==m.chain||m.frame<r.morrowGripEntry.frame)r.morrowGripEntry={move:m,chain:m.chain,frame:m.frame,weight:previousWeight};
 r.morrowGripEntry.frame=m.frame;
 const end=m.startup+(m.active||1)+m.recovery;
 const entry=smooth(m.frame/Math.max(1,m.startup*.42));
 const weight=(r.morrowGripEntry.weight+(1-r.morrowGripEntry.weight)*entry)*(1-smooth((m.frame-(end-m.recovery*.28))/Math.max(1,m.recovery*.28)));
 if(!weight)return;
 r.g.updateMatrixWorld(true);
 const arm=r.limbs[0],elbow=r.elbows[0],hand=arm.userData.hand,weaponHand=r.limbs[2].userData.hand;
 // Bring the striking wrist into the overlap of both arms' reach, retaining
 // its authored world orientation so the blade still follows the authored arc.
 const primaryArm=r.limbs[2],primaryElbow=r.elbows[1],primaryQ=weaponHand.getWorldQuaternion(new Quaternion());
 const leftShoulder=arm.getWorldPosition(new Vector3()),rightShoulder=primaryArm.getWorldPosition(new Vector3()),center=leftShoulder.clone().add(rightShoulder).multiplyScalar(.5);
 const reach=rightShoulder.distanceTo(primaryElbow.getWorldPosition(new Vector3()))+primaryElbow.getWorldPosition(new Vector3()).distanceTo(weaponHand.getWorldPosition(new Vector3()));
 const half=leftShoulder.distanceTo(rightShoulder)*.5,radius=Math.sqrt(Math.max(.04,(reach-.17)**2-half*half));
 const wrist=weaponHand.getWorldPosition(new Vector3()),local=r.spine.worldToLocal(wrist.clone());local.x=.025;
 const central=r.spine.localToWorld(local).sub(center).clampLength(0,radius).add(center);
 solveArm(primaryArm,primaryElbow,weaponHand,wrist.lerp(central,weight),new Vector3(1,-.4,-.1).transformDirection(r.spine.matrixWorld));
 weaponHand.quaternion.copy(primaryElbow.getWorldQuaternion(new Quaternion()).invert().multiply(primaryQ));weaponHand.updateWorldMatrix(false,true);
 const target=r.supportGripAnchor?.getWorldPosition(new Vector3())??weaponHand.localToWorld(new Vector3(0,-.02,-.16));
 const desired=hand.getWorldPosition(new Vector3()).lerp(target,weight);
 const clamped=solveArm(arm,elbow,hand,desired,new Vector3(-1,-.35,-.12).transformDirection(r.spine.matrixWorld));

 r.morrowGrip={weight,error:hand.getWorldPosition(new Vector3()).distanceTo(target),clamped};
}

function solveArm(arm,elbow,hand,desired,pole){
 const shoulder=arm.getWorldPosition(new Vector3()),atElbow=elbow.getWorldPosition(new Vector3()),atHand=hand.getWorldPosition(new Vector3());
 const upper=shoulder.distanceTo(atElbow),lower=atElbow.distanceTo(atHand),axis=desired.clone().sub(shoulder),rawDistance=axis.length();axis.normalize();
 const distance=Math.max(Math.abs(upper-lower)+.001,Math.min(upper+lower-.001,rawDistance)),reachable=shoulder.clone().addScaledVector(axis,distance);
 pole.addScaledVector(axis,-pole.dot(axis));if(pole.lengthSq()<1e-6)pole.set(0,0,1).addScaledVector(axis,-axis.z);pole.normalize();
 const along=(upper*upper-lower*lower+distance*distance)/(2*distance),height=Math.sqrt(Math.max(0,upper*upper-along*along));
 const joint=shoulder.clone().addScaledVector(axis,along).addScaledVector(pole,height);
 aim(arm,elbow,joint);aim(elbow,hand,reachable);return rawDistance>upper+lower-.001;
}
// Carry the planted ankle turn into a buffered cut instead of resetting it.
export function morrowFootTransition(r,player,kind){
 const target=morrowFootPivot(player,kind),m=player?.move;
 if(kind!=='strike'||m?.kind!=='strike'){r.morrowFootEntry=null;r.morrowFootLast=target;return target;}
 const old=r.morrowFootEntry;
 if(!old||old.move!==m||old.chain!==m.chain||m.frame<old.frame)r.morrowFootEntry={move:m,chain:m.chain,frame:m.frame,from:(r.morrowFootLast||target).map(q=>q.clone())};
 const entry=r.morrowFootEntry;entry.frame=m.frame;
 const blend=smooth(m.frame/Math.max(1,m.startup*.65));
 r.morrowFootLast=target.map((q,i)=>entry.from[i].clone().slerp(q,blend));return r.morrowFootLast;
}
