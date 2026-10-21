// Study-only choreography; live gameplay and damage timing are unchanged.
import {Vector3,Quaternion,Matrix4} from '../dist/vendor/three.module.js';
const clamp=x=>Math.max(0,Math.min(1,x)),ease=x=>{x=clamp(x);return x*x*(3-2*x);};
const V=(x,y,z)=>new Vector3(x,y,z),down=V(0,-1,0);
const interval=(u,a,b)=>ease((u-a)/(b-a));
const pulse=(u,a,b)=>u<a||u>b?0:Math.sin(Math.PI*(u-a)/(b-a));
export function footMatrix(x,z,yaw=0,pitch=0,lift=0){
 // Pivot about the ball of the shoe, not the ankle or its geometric center.
 const ball=V(0,-.109,.22),q=new Quaternion().setFromAxisAngle(V(0,1,0),yaw).multiply(new Quaternion().setFromAxisAngle(V(1,0,0),pitch));
 const anchor=V(x,.14+lift,z).add(ball),ankle=anchor.sub(ball.clone().applyQuaternion(q));
 return new Matrix4().compose(ankle,q,V(1,1,1));
}
function aimBone(bone,direction){const parent=bone.parent.getWorldQuaternion(new Quaternion());bone.quaternion.copy(parent.invert().multiply(new Quaternion().setFromUnitVectors(down,direction.clone().normalize())));bone.updateWorldMatrix(false,true);}
export function solvePair(upper,lower,target,lengthA,lengthB,pole){
 const start=upper.getWorldPosition(new Vector3()),delta=target.clone().sub(start),d=Math.min(lengthA+lengthB-.0001,Math.max(.001,delta.length())),axis=delta.normalize();
 const along=(lengthA*lengthA-lengthB*lengthB+d*d)/(2*d),height=Math.sqrt(Math.max(0,lengthA*lengthA-along*along));
 const bend=pole.clone().sub(axis.clone().multiplyScalar(pole.dot(axis))).normalize();
 const middle=start.clone().addScaledVector(axis,along).addScaledVector(bend,height);
 aimBone(upper,middle.clone().sub(start));aimBone(lower,target.clone().sub(middle));return middle;
}
export function applyStudyMotion(r,kind,t,duration){
 const u=clamp(t/duration),phase=u*Math.PI*2;
 let feet=[{x:-.25,z:.24,yaw:-.08,pitch:.02,lift:0},{x:.25,z:-.24,yaw:.18,pitch:.10,lift:0}];
 if(['run','back','circle'].includes(kind)){
  const first=kind==='run'?0:1,steps=[0,0],lifts=[0,0];
  steps[first]=interval(u,.06,.42);steps[1-first]=interval(u,.5,.90);
  lifts[first]=.065*pulse(u,.06,.42);lifts[1-first]=.045*pulse(u,.5,.90);
  const travel=.40*ease(u),side=kind==='circle',direction=kind==='back'?-1:1;
  feet.forEach((f,i)=>{const displacement=direction*(.40*steps[i]-travel);if(side)f.x+=displacement;else f.z+=displacement;f.lift=lifts[i];f.pitch=(i===first?.02:.10)+.24*pulse(u,i===first?0:.44,i===first?.16:.60);f.yaw+=side?.12*Math.sin(phase):.05*Math.sin(phase);});
  const shift=Math.sin(phase-.25)-Math.sin(-.25);
  r.body.position.set((first===0?1:-1)*.055*shift,-.20-.035*(1-Math.cos(phase*2)),0);
  r.body.rotation.y=(side?.10:.06)*Math.sin(phase);
  r.spine.rotation.set(kind==='back'?-.035:.11,-.18-.13*Math.sin(phase),-.045*shift);
  r.head.rotation.set(.08,.1+.08*Math.sin(phase),.018*Math.sin(phase));
  // Small guard-hand counter-motion, not a running arm swing.
  r.limbs[0].rotation.x+=.06*Math.sin(phase);r.limbs[2].rotation.x-=.06*Math.sin(phase);
  r.elbows[0].rotation.x-=.06*Math.sin(phase);r.elbows[1].rotation.x+=.06*Math.sin(phase);
 }
 if(kind==='combo'){
  const chain=Math.min(2,Math.floor(t*60/20)),p=t>=duration?1:(t*60%20)/20;
  const drive=p<.25?ease(p/.25):1-ease((p-.42)/.58),active=chain===1?0:1;
  feet[active].pitch+=.38*drive;feet[active].yaw+=(chain===1?.5:-.50)*drive;
  feet[1-active].yaw+=(chain===1?.12:-.12)*drive;
  r.body.position.x+=(chain===1?.075:-.075)*drive;r.body.position.y-=.025*drive;
  if(chain===2){feet[0].z+=.07*drive;r.body.position.z-=.06*drive;}
 }
 if(kind==='hurt'){
  const catchStep=interval(u,.08,.30)*(1-interval(u,.58,.95));
  feet[1].z-=.22*catchStep;feet[1].lift=.055*(pulse(u,.08,.30)+pulse(u,.58,.95));
  feet[0].pitch+=.10*catchStep;r.body.position.z-=.07*catchStep;r.body.position.x+=.055*catchStep;r.body.position.y-=.06*catchStep;
 }
 if(kind==='guard'){
  const cover=interval(t,0,.20)*(1-interval(t,duration-.25,duration));
  r.body.position.y-=.07*cover;r.spine.rotation.x+=.10*cover;r.head.rotation.x+=.14*cover;
  r.g.updateMatrixWorld(true);
  for(let i=0;i<2;i++){
   const side=i?1:-1,upper=r.limbs[i*2],lower=r.elbows[i],hand=upper.userData.hand;
   const start=hand.getWorldPosition(new Vector3());
   // Hands finish on opposite sides of the chest; forearms form an X with depth separation.
   const crossed=r.spine.localToWorld(V(-side*.22,.50,i?.43:.34));
   const target=start.lerp(crossed,cover);solvePair(upper,lower,target,.43,.4,V(side*.4,-1,.1));
  }
 }
 r.g.updateMatrixWorld(true);
 const matrices=feet.map(f=>footMatrix(f.x,f.z,f.yaw,f.pitch,f.lift));
 // Lower the pelvis if a planted target would otherwise overextend a knee.
 let lower=0;for(let i=0;i<2;i++){const hip=r.limbs[i*2+1].getWorldPosition(new Vector3()),target=new Vector3().setFromMatrixPosition(matrices[i]),dx=hip.x-target.x,dz=hip.z-target.z;lower=Math.max(lower,hip.y-target.y-Math.sqrt(Math.max(.1,1.11**2-dx*dx-dz*dz)));}
 r.body.position.y-=Math.max(0,lower);r.g.updateMatrixWorld(true);
 for(let i=0;i<2;i++)solvePair(r.limbs[i*2+1],r.knees[i],new Vector3().setFromMatrixPosition(matrices[i]),r.legLength||.56,r.shinLength||r.legLength||.56,V(i?.12:-.12,0,1));
 r.g.updateMatrixWorld(true);return matrices;
}
