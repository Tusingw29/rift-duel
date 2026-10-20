import {fighters} from './fighters.js';
const smooth=v=>{v=Math.max(0,Math.min(1,v));return v*v*(3-2*v);};
// Contact-to-recovery posing: combat has already registered the strike when
// this clip starts. These curves do not invent an unregistered wind-up delay.
export function animateCharacter(r,p,time){
 const f=fighters[r.id],state=p?.anim||'idle',run=state==='run';
 const breathing=Math.sin(time*2.4+r.id)*.014;
 r.body.position.y=breathing;r.spine.rotation.set(0,0,0);r.head.rotation.set(0,0,0);
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
 if(['strike','attack','forward','back','launch','pursuit','jumpAttack'].includes(state)){
  const strength=smooth((p?.animTime||0)/.32);
  if(f.id==='tala'){const arm=(p?.combo||0)%2; r.limbs[arm?2:0].rotation.x=-1.6*strength;r.elbows[arm].rotation.x=-.08;r.spine.rotation.y=(arm?-.35:.35)*strength;}
  else if(f.id==='rei'){rightArm.rotation.x=-1.0*strength;rightArm.rotation.z=.65*strength;rightArm.rotation.y=-.55*strength;r.spine.rotation.y=-.5*strength;r.elbows[1].rotation.x=-.4;}
  else if(f.id==='morrow'){rightArm.rotation.x=-1.3*strength;leftArm.rotation.x=-.8*strength;r.spine.rotation.x=.18*strength;r.spine.rotation.y=-.3*strength;}
  else if(f.id==='sol'){leftArm.rotation.x=-1.5*strength;rightArm.rotation.x=-.4*strength;r.elbows[0].rotation.x=-.1;}
  else if(f.id==='vesper'){leftArm.rotation.x=-1.3*strength;rightArm.rotation.x=-1.3*strength;leftArm.rotation.z=.5*strength;rightArm.rotation.z=-.5*strength;}
  else{rightArm.rotation.x=-1.45*strength;leftArm.rotation.x=-.6*strength;r.spine.rotation.y=-.18*strength;r.elbows[1].rotation.x=-.12;}
 }
 if(state==='charge'){leftArm.rotation.z=.65;rightArm.rotation.z=-.65;r.elbows[0].rotation.x=-1.2;r.elbows[1].rotation.x=-1.2;r.head.rotation.x=-.12;}
 if(p?.guard){leftArm.rotation.x=-.85;rightArm.rotation.x=-.85;leftArm.rotation.z=.16;rightArm.rotation.z=-.16;r.elbows[0].rotation.x=-1.3;r.elbows[1].rotation.x=-1.3;r.spine.rotation.x=.09;}
 if((p?.air||0)>0){leftLeg.rotation.x=-.55;rightLeg.rotation.x=.3;r.knees[0].rotation.x=.9;r.knees[1].rotation.x=.5;}
 if(state==='hurt'){r.spine.rotation.x=-.22;r.head.rotation.x=-.15;leftArm.rotation.z=.5;rightArm.rotation.z=-.5;}
 if(r.spirit){r.spirit.position.y=1.55+Math.sin(time*1.6)*.09;r.spirit.rotation.y=Math.sin(time)*.12;r.spirit.userData.material.opacity=state==='idle'?.22:.42;}
 for(let i=0;i<r.clothParts.length;i++){const part=r.clothParts[i];part.rotation.x=Math.sin(time*3+i)*.08+(run?.25:0);part.rotation.z=Math.sin(time*2.3+i)*.07;}
}
