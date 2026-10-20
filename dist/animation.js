import {fighters} from './fighters.js';
import {Box3} from './vendor/three.module.js';
const rollBounds=new Box3();
const smooth=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v);};
// Animation phases read the same frame clock that resolves combat contact.
export function animateCharacter(r,p,time){
 const f=fighters[r.id],state=p?.anim||'idle',run=state==='run';
 const breathing=Math.sin(time*2.4+r.id)*.014;
 r.body.position.set(0,breathing,0);r.body.rotation.set(0,0,0);r.spine.rotation.set(0,0,0);r.head.rotation.set(0,0,0);
 r.limbs.forEach((part,j)=>part.rotation.set(0,0,j===0?.08:j===2?-.08:0));
 r.elbows.forEach(elbow=>elbow.rotation.set(-.22,0,0));r.knees.forEach(knee=>knee.rotation.set(.05,0,0));
 const [leftArm,leftLeg,rightArm,rightLeg]=r.limbs;
 // Readable silhouettes even before a move is used.
 if(f.id==='tala'){leftArm.rotation.x=-.75;rightArm.rotation.x=-.45;r.elbows[0].rotation.x=-1.15;r.elbows[1].rotation.x=-1.3;r.spine.rotation.y=-.16;}
 if(f.id==='rei'){rightArm.rotation.x=-.18;rightArm.rotation.y=-.22;leftArm.rotation.z=.15;r.spine.rotation.y=.12;}
 if(f.id==='morrow'){rightArm.rotation.x=-.25;leftArm.rotation.x=-.2;leftLeg.rotation.z=.08;rightLeg.rotation.z=-.08;}
 if(f.id==='sol'){leftArm.rotation.x=-.3;leftArm.rotation.z=.22;r.elbows[0].rotation.x=-.7;}
 if(f.id==='vesper'){leftArm.rotation.z=.4;rightArm.rotation.z=-.4;r.elbows[0].rotation.x=-.6;r.elbows[1].rotation.x=-.6;r.head.rotation.z=.07;}
 if(run){
  const stride=Math.sin(time*12),bend=Math.cos(time*12);
  leftArm.rotation.x=stride*.55;rightArm.rotation.x=-stride*.55;
  leftLeg.rotation.x=-stride*.65;rightLeg.rotation.x=stride*.65;
  r.knees[0].rotation.x=Math.max(0,bend)*.8;r.knees[1].rotation.x=Math.max(0,-bend)*.8;
  r.body.position.y=Math.abs(stride)*.035;r.spine.rotation.x=.09;
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
 if(p?.move&&p.move.frame<p.move.startup){
  const wind=smooth(p.move.frame/p.move.startup);
  if(f.id==='morrow'){rightArm.rotation.x=-.3-wind*1.9;leftArm.rotation.x=-wind*1.3;r.spine.rotation.y=wind*.3;}
  else if(f.id==='rei'){rightArm.rotation.x=-wind*.65;rightArm.rotation.y=wind*.8;r.spine.rotation.y=wind*.4;r.elbows[1].rotation.x=-wind*.5;}
  else if(f.id==='tala'){rightArm.rotation.x=.35*wind;r.elbows[1].rotation.x=-1.3;leftArm.rotation.x=-.6;r.spine.rotation.y=.3*wind;}
  else{leftArm.rotation.x=-.4*wind;rightArm.rotation.x=-.4*wind;r.elbows[0].rotation.x=-1.3*wind;r.elbows[1].rotation.x=-1.3*wind;}
  r.body.position.y-=.05*wind;
 }
 if(state==='charge'){leftArm.rotation.z=.65;rightArm.rotation.z=-.65;r.elbows[0].rotation.x=-1.2;r.elbows[1].rotation.x=-1.2;r.head.rotation.x=-.12;}
 if(p?.guard){leftArm.rotation.x=-.85;rightArm.rotation.x=-.85;leftArm.rotation.z=.16;rightArm.rotation.z=-.16;r.elbows[0].rotation.x=-1.3;r.elbows[1].rotation.x=-1.3;r.spine.rotation.x=.09;}
 if((p?.air||0)>0){leftLeg.rotation.x=-.55;rightLeg.rotation.x=.3;r.knees[0].rotation.x=.9;r.knees[1].rotation.x=.5;}
 if(state==='hurt'){r.spine.rotation.x=-.22;r.head.rotation.x=-.15;leftArm.rotation.z=.5;rightArm.rotation.z=-.5;}
 if(state==='knockdown'){const down=smooth((p.animTime||0)/.35);r.body.rotation.z=Math.PI/2*down;r.body.position.y=.35*down;}
 if(state==='roll'&&p.roll){const progress=Math.min(1,p.roll.elapsed/.3);const angle=progress*Math.PI*2*p.roll.direction*(p.face||1);r.body.rotation.z=angle;r.body.position.x=Math.sin(angle)*1.4;r.body.position.y=.3+1.4*(1-Math.cos(angle));leftLeg.rotation.x=-.8;rightLeg.rotation.x=-.8;r.knees[0].rotation.x=1.4;r.knees[1].rotation.x=1.4;leftArm.rotation.x=-1.3;rightArm.rotation.x=-1.3;}
 if(r.spirit){r.spirit.position.y=1.55+Math.sin(time*1.6)*.09;r.spirit.rotation.y=Math.sin(time)*.12;r.spirit.userData.material.opacity=state==='idle'?.22:.42;}
 for(let i=0;i<r.clothParts.length;i++){const part=r.clothParts[i];part.rotation.x=Math.sin(time*3+i)*.08+(run?.25:0);part.rotation.z=Math.sin(time*2.3+i)*.07;}
 if(state==='roll'){
  r.body.updateWorldMatrix(true,true);rollBounds.setFromObject(r.body);
  if(rollBounds.min.y<.03)r.body.position.y+=(.03-rollBounds.min.y)/r.g.scale.y;
 }
}
