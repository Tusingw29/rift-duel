import {resetCombatRig,finishCombatRig} from './tala-combat-rig.js';
import {finishMorrowAttack} from './morrow-attack-motion.js';
import {animateMorrow} from './morrow-animation.js';
import {captureMotion,finishMotion} from './motion-transition.js';
import {animateAegis} from './aegis-animation.js';
import {applyMeleePose} from './melee-poses.js';
import {animateTala} from './tala-animation.js';
import {animateRei,animateSol,animateVesper} from './roster-animation.js';
import {fighters} from './fighters.js';
import {Box3} from './vendor/three.module.js';
const rollBounds=new Box3();
const stagedBounds=new Box3();
export function applyStagedPose(r,part){
 r.g.position.set(part.x,part.y,part.z);r.g.rotation.set(part.tilt,part.yaw,part.roll);
 r.limbs[0].rotation.x=part.arm;r.limbs[2].rotation.x=part.arm;
 if(Number.isFinite(part.rightArm))r.limbs[2].rotation.x=part.rightArm;
 if(Number.isFinite(part.leftLeg))r.limbs[1].rotation.x=part.leftLeg;
 // Root rotations in throws must not sink a shoulder or head below the floor.
 r.body.updateWorldMatrix(true,true);stagedBounds.setFromObject(r.body);
 if(stagedBounds.min.y<.03)r.g.position.y+=.03-stagedBounds.min.y;
}
const smooth=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v);};
// Animation phases read the same frame clock that resolves combat contact.
export function animateCharacter(r,p,time){
 // Every fighter now has a grounded whole-body animator; the motion bridge smooths handoffs to shared states.

 resetCombatRig(r);
 const previous=captureMotion(r);
 if(r.id===3&&r.morrowHandRest){r.elbows.forEach(e=>e.rotation.set(0,0,0));[r.limbs[0],r.limbs[2]].forEach((arm,i)=>arm.userData.hand.quaternion.copy(r.morrowHandRest[i]));}
 sampleCharacter(r,p,time);finishMotion(r,p,time,previous);
 if(r.id===3)finishMorrowAttack(r,p);
 finishCombatRig(r,p,time);
}
function sampleCharacter(r,p,time){
 r.animationFamily='shared';
 if(r.headRest)r.head.position.copy(r.headRest);
 r.feet?.forEach(foot=>foot.rotation.set(0,0,0));
 r.clothParts.forEach(part=>part.rotation.set(0,0,0));
 const f=fighters[r.id],state=p?.anim||'idle',run=state==='run';
 const breathing=Math.sin(time*2.4+r.id)*.014;
 r.body.position.set(0,breathing,0);r.body.rotation.set(0,0,0);r.spine.rotation.set(0,0,0);r.head.rotation.set(0,0,0);
 r.limbs.forEach((part,j)=>{part.rotation.order='XYZ';part.rotation.set(0,0,j===0?.08:j===2?-.08:0);});
 r.elbows.forEach(elbow=>elbow.rotation.set(-.22,0,0));r.knees.forEach(knee=>knee.rotation.set(.05,0,0));
 const [leftArm,leftLeg,rightArm,rightLeg]=r.limbs;
 // Tala runs on the blended full-body system for her sample states.
 if(f.id==='tala'&&animateTala(r,p,time)){r.animationFamily='grounded';return;}
 if(f.id==='aegis'&&animateAegis(r,p,time)){r.animationFamily='grounded';return;}
 if(f.id==='morrow'&&animateMorrow(r,p,time)){r.animationFamily='grounded';return;}
 if(f.id==='rei'&&animateRei(r,p,time)){r.animationFamily='grounded';return;}
 if(f.id==='sol'&&animateSol(r,p,time)){r.animationFamily='grounded';return;}
 if(f.id==='vesper'&&animateVesper(r,p,time)){r.animationFamily='grounded';return;}
 // Readable silhouettes even before a move is used.
 if(f.id==='tala'){leftArm.rotation.x=-.75;rightArm.rotation.x=-.45;r.elbows[0].rotation.x=-1.15;r.elbows[1].rotation.x=-1.3;r.spine.rotation.y=-.16;}
 if(f.id==='rei'){rightArm.rotation.x=-.18;rightArm.rotation.y=-.22;leftArm.rotation.z=.15;r.spine.rotation.y=.12;}
 if(f.id==='morrow'){rightArm.rotation.x=-.25;leftArm.rotation.x=-.2;leftLeg.rotation.z=.08;rightLeg.rotation.z=-.08;}
 if(f.id==='sol'){leftArm.rotation.x=-.3;leftArm.rotation.z=.22;r.elbows[0].rotation.x=-.7;}
 if(f.id==='vesper'){leftArm.rotation.z=.4;rightArm.rotation.z=-.4;r.elbows[0].rotation.x=-.6;r.elbows[1].rotation.x=-.6;r.head.rotation.z=.07;}
 if(run){
  const forward=p?.prev?.x??1,side=p?.prev?.z||0,strafe=Math.abs(side)>Math.abs(forward);
  const stride=Math.sin(time*(strafe?9:forward<0?10:12)),bend=Math.cos(time*(strafe?9:forward<0?10:12));
  if(strafe){
   leftLeg.rotation.z=side*(.12+stride*.3);rightLeg.rotation.z=side*(.12-stride*.3);
   leftLeg.rotation.x=-.12;rightLeg.rotation.x=.12;r.body.position.y-=.04;
   r.spine.rotation.z=side*.1;leftArm.rotation.x=-.65;rightArm.rotation.x=-.55;
   r.elbows[0].rotation.x=-1;r.elbows[1].rotation.x=-1;
  }else{
   const retreat=forward<0,scale=retreat?.4:.65,direction=retreat?-1:1;
   leftArm.rotation.x=stride*(retreat?.2:.55);rightArm.rotation.x=-stride*(retreat?.2:.55);
   leftLeg.rotation.x=-stride*scale*direction;rightLeg.rotation.x=stride*scale*direction;
   r.body.position.y=Math.abs(stride)*(retreat?.02:.035);r.spine.rotation.x=retreat?-.1:.12;
  }
  r.knees[0].rotation.x=Math.max(0,bend)*.5;r.knees[1].rotation.x=Math.max(0,-bend)*.5;
 }
 if(p?.move||['strike','attack','forward','back','launch','pursuit','jumpAttack'].includes(state)){
  const move=p?.move;
  const strength=move?(move.frame<move.startup?0:1-smooth((move.frame-move.startup-(move.active||1)+1)/move.recovery)):smooth((p?.animTime||0)/.32);
  if(f.id==='tala'){const arm=((move?.chain||1)-1)%2; r.limbs[arm?2:0].rotation.x=-1.6*strength;r.elbows[arm].rotation.x=-.08;r.spine.rotation.y=(arm?-.35:.35)*strength;}
  else if(f.id==='rei'){rightArm.rotation.x=-1.0*strength;rightArm.rotation.z=.65*strength;rightArm.rotation.y=-.55*strength;r.spine.rotation.y=-.5*strength;r.elbows[1].rotation.x=-.4;}
  else if(f.id==='morrow'){rightArm.rotation.x=-1.3*strength;leftArm.rotation.x=-.8*strength;r.spine.rotation.x=.18*strength;r.spine.rotation.y=-.3*strength;}
  else if(f.id==='sol'){leftArm.rotation.x=-1.5*strength;rightArm.rotation.x=-.4*strength;r.elbows[0].rotation.x=-.1;}
  else if(f.id==='vesper'){leftArm.rotation.x=-1.3*strength;rightArm.rotation.x=-1.3*strength;leftArm.rotation.z=.5*strength;rightArm.rotation.z=-.5*strength;}
  else{rightArm.rotation.x=-1.45*strength;leftArm.rotation.x=-.6*strength;r.spine.rotation.y=-.18*strength;r.elbows[1].rotation.x=-.12;}
 }
 if(p?.move?.kind==='technique'&&p.move.frame>=p.move.startup){
  const move=p.move,progress=Math.min(1,(move.frame-move.startup)/move.active);
  const fade=1-smooth((move.frame-move.startup-move.active)/move.recovery);
  if(f.id==='rei'){r.spine.rotation.y=progress*Math.PI*(move.followup?4:2);rightArm.rotation.z=.9*fade;leftArm.rotation.z=-.8*fade;r.body.position.y+=Math.sin(progress*Math.PI)*.5;}
  if(f.id==='aegis'){r.spine.rotation.x=.65*fade;rightArm.rotation.x=-1.8*fade;leftLeg.rotation.x=.5*fade;}
  if(f.id==='tala'){rightArm.rotation.x=-2.7*fade;leftLeg.rotation.x=-.7*fade;r.body.position.y+=Math.sin(progress*Math.PI)*.65;}
  if(f.id==='morrow'){r.spine.rotation.x=.4*fade;rightArm.rotation.x=-1.3*fade;leftArm.rotation.x=-1.3*fade;}
  if(f.id==='sol'){leftArm.rotation.z=1.1*fade;rightArm.rotation.z=-1.1*fade;}
  if(f.id==='vesper'){leftArm.rotation.x=-1.8*fade;rightArm.rotation.x=-.7*fade;r.spine.rotation.x=.2*fade;}
  if(move.effect==='kick'){rightArm.rotation.x=.5*fade;rightLeg.rotation.x=-1.55*fade;r.knees[1].rotation.x=0;leftLeg.rotation.x=.6*fade;r.body.position.y+=.4*fade;r.spine.rotation.x=-.3*fade;}
  if(move.effect==='lance'){r.spine.rotation.x=0;leftArm.rotation.x=-1.6*fade;rightArm.rotation.x=-1.6*fade;}
  if(move.effect==='fan'){r.spine.rotation.y=progress*Math.PI*2;leftArm.rotation.z=.8*fade;rightArm.rotation.z=-.8*fade;}
 }
 if(p?.move?.aerial&&p.move.frame>=p.move.startup&&p.move.frame<p.move.startup+p.move.active){
  const beat=Math.floor((p.move.frame-p.move.startup)/9),pulse=1-smooth(((p.move.frame-p.move.startup)%9)/9);
  r.limbs[beat%2?2:0].rotation.x=-1.7*pulse;
  r.elbows[beat%2].rotation.x=-.05;r.spine.rotation.y=(beat%2?-.35:.35)*pulse;
  if(beat===2){rightLeg.rotation.x=-1.4*pulse;r.knees[1].rotation.x=0;}
 }
 if(p?.move&&p.move.frame<p.move.startup){
  const wind=smooth(p.move.frame/p.move.startup);
  if(f.id==='morrow'){rightArm.rotation.x=-.3-wind*1.9;leftArm.rotation.x=-wind*1.3;r.spine.rotation.y=wind*.3;}
  else if(f.id==='rei'){rightArm.rotation.x=-wind*.65;rightArm.rotation.y=wind*.8;r.spine.rotation.y=wind*.4;r.elbows[1].rotation.x=-wind*.5;}
  else if(f.id==='tala'){rightArm.rotation.x=.35*wind;r.elbows[1].rotation.x=-1.3;leftArm.rotation.x=-.6;r.spine.rotation.y=.3*wind;}
  else{leftArm.rotation.x=-.4*wind;rightArm.rotation.x=-.4*wind;r.elbows[0].rotation.x=-1.3*wind;r.elbows[1].rotation.x=-1.3*wind;}
  r.body.position.y-=.05*wind;
 }
 if(p?.move?.kind==='strike')applyMeleePose(r,p);
 if(p?.move?.kind==='pursuit'&&!p.move.aerial){
  const phase=p.move.frame<p.move.startup?smooth(p.move.frame/p.move.startup):1-smooth((p.move.frame-p.move.startup)/(p.move.recovery||30));
  r.spine.rotation.x=.5*phase;r.body.position.y-=.1*phase;
  leftArm.rotation.x=.7*phase;rightArm.rotation.x=-1.3*phase;
  leftLeg.rotation.x=-.65*phase;rightLeg.rotation.x=.7*phase;r.knees[0].rotation.x=.6*phase;
 }
 if(state==='charge'){leftArm.rotation.z=.65;rightArm.rotation.z=-.65;r.elbows[0].rotation.x=-1.2;r.elbows[1].rotation.x=-1.2;r.head.rotation.x=-.12;}
 if(p?.guard){leftArm.rotation.x=-.85;rightArm.rotation.x=-.85;leftArm.rotation.z=.16;rightArm.rotation.z=-.16;r.elbows[0].rotation.x=-1.3;r.elbows[1].rotation.x=-1.3;r.spine.rotation.x=.09;}
 if(p?.guard&&p.blockStun>0){
  const recoil=Math.min(1,p.blockStun/.22);
  r.spine.rotation.x-=.22*recoil;r.head.rotation.x=-.12*recoil;
  r.body.position.z-=.1*recoil;r.elbows[0].rotation.x-=.25*recoil;r.elbows[1].rotation.x-=.25*recoil;
 }
 if((p?.air||0)>0){leftLeg.rotation.x=-.55;rightLeg.rotation.x=.3;r.knees[0].rotation.x=.9;r.knees[1].rotation.x=.5;}
 if(p?.launched&&(p?.air||0)>0&&!p.move){
  // Launched fighters tumble backward through the air before the knockdown.
  const t=1-Math.min(1,p.air/.85);r.body.rotation.x=-smooth(t)*Math.PI*1.4;r.body.position.y+=.45;
  leftArm.rotation.x=-1.9;rightArm.rotation.x=-1.6;leftArm.rotation.z=.6;rightArm.rotation.z=-.6;r.head.rotation.x=-.3;leftLeg.rotation.x=-.9;rightLeg.rotation.x=-.4;
 }
 if(state==='hurt'){r.spine.rotation.x=-.22;r.head.rotation.x=-.15;leftArm.rotation.z=.5;rightArm.rotation.z=-.5;}
 if(state==='victory'){
  // Round-winning pose, held while the camera pushes in on the fallen rival.
  const settle=smooth((p.animTime||0)/.45),bob=Math.sin(time*2.2)*.02;
  r.body.position.y+=.06*settle+bob;r.head.rotation.x=-.18*settle;
  if(f.id==='aegis'){rightArm.rotation.x=-2.9*settle;rightArm.rotation.z=-.15;leftArm.rotation.x=-.35*settle;r.spine.rotation.y=.18*settle;}
  else if(f.id==='rei'){rightArm.rotation.x=-1.1*settle;rightArm.rotation.y=-.9*settle;rightArm.rotation.z=.4*settle;leftArm.rotation.z=.3;r.spine.rotation.y=.45*settle;r.spine.rotation.x=.08;}
  else if(f.id==='tala'){rightArm.rotation.x=-3*settle;r.elbows[1].rotation.x=-.1;leftArm.rotation.x=-.5;r.elbows[0].rotation.x=-1.6;r.spine.rotation.y=-.3*settle;leftLeg.rotation.x=-.3*settle;r.knees[0].rotation.x=.5*settle;}
  else if(f.id==='morrow'){rightArm.rotation.x=-2.2*settle;rightArm.rotation.z=-.5*settle;r.elbows[1].rotation.x=-.9*settle;leftArm.rotation.x=.2;r.spine.rotation.x=-.08*settle;}
  else if(f.id==='sol'){leftArm.rotation.x=-2.7*settle;r.elbows[0].rotation.x=-.2;rightArm.rotation.z=-.9*settle;r.spine.rotation.y=.2*settle;}
  else{leftArm.rotation.x=-1.4*settle;rightArm.rotation.x=-1.4*settle;leftArm.rotation.z=1.1*settle;rightArm.rotation.z=-1.1*settle;r.elbows[0].rotation.x=-.3;r.elbows[1].rotation.x=-.3;r.body.position.y+=.25*settle;}
 }
 if(state==='defeat'){const down=smooth(Math.min(1,(p.animTime||0)/.35));r.body.rotation.z=Math.PI/2*down;r.body.position.y=.35*down;leftArm.rotation.x=-.6*down;rightArm.rotation.x=.4*down;r.head.rotation.z=.2*down;}
 if(state==='knockdown'){const down=smooth((p.animTime||0)/.35);r.body.rotation.z=Math.PI/2*down;r.body.position.y=.35*down;}
 if(state==='roll'&&p.roll){const progress=Math.min(1,p.roll.elapsed/.3);const angle=progress*Math.PI*2*p.roll.direction;if(p.roll.forward)r.body.rotation.x=angle;else r.body.rotation.z=-angle;r.body.position.y=.3+.35*Math.sin(progress*Math.PI);leftLeg.rotation.x=-.8;rightLeg.rotation.x=-.8;r.knees[0].rotation.x=1.4;r.knees[1].rotation.x=1.4;leftArm.rotation.x=-1.3;rightArm.rotation.x=-1.3;}
 if(r.spirit){r.spirit.position.y=1.55+Math.sin(time*1.6)*.09;r.spirit.rotation.y=Math.sin(time)*.12;r.spirit.userData.material.opacity=state==='idle'?.22:.42;}
 for(let i=0;i<r.clothParts.length;i++){const part=r.clothParts[i];part.rotation.x=Math.sin(time*3+i)*.08+(run?.25:0);part.rotation.z=Math.sin(time*2.3+i)*.07;}
 if(state==='roll'){
  r.body.updateWorldMatrix(true,true);rollBounds.setFromObject(r.body);
  if(rollBounds.min.y<.03)r.body.position.y+=(.03-rollBounds.min.y)/r.g.scale.y;
 }
}
