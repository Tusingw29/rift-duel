import test from 'node:test';import assert from 'node:assert/strict';
import {buildCharacter} from '../dist/characters.js';import {animateCharacter} from '../dist/animation.js';
import {morrowStrikePose,morrowMovePose} from '../dist/morrow-animation.js';
import {Vector3} from '../dist/vendor/three.module.js';import {moveTiming} from '../dist/moves.js';import {fighters} from '../dist/fighters.js';
const move=(chain,frame)=>({kind:'strike',...moveTiming(fighters[3],'strike'),chain,frame});
test('Morrow has three distinct heavy windups and contacts at the existing damage frame',()=>{
 const wind=[];
 for(const chain of [1,2,3]){const r=buildCharacter(3),m=move(chain,12);animateCharacter(r,{anim:'idle',x:0,z:0},0);animateCharacter(r,{anim:'strike',x:0,z:0,move:m},.1);assert.deepEqual(r.morrowPose,morrowStrikePose(m));r.g.updateMatrixWorld(true);
  const tip=r.limbs[2].userData.hand.localToWorld(new Vector3(0,.12,2.06));assert.ok(tip.z>2&&tip.y>.9&&tip.y<2,'greatsword reaches the opponent torso');wind.push(morrowStrikePose({...m,frame:m.startup*.65}));
 }
 assert.ok(wind[0].ray>1&&wind[1].ray< -1&&wind[2].rax< -2.5);
 assert.ok(wind[0].hipYaw>0&&wind[1].hipYaw<0,'hips load opposite cuts');
});
test('Morrow planted weighted boot soles remain above the floor through grounded poses',()=>{
 const r=buildCharacter(3);r.g.scale.setScalar(1.12);const sample=new Vector3();
 for(const p of [{anim:'idle',x:0,z:0},{anim:'strike',x:0,z:0,move:move(3,12)},{anim:'idle',guard:true,x:0,z:0}]){
  animateCharacter(r,p,1);r.g.updateMatrixWorld(true);r.skeleton.update();let min=Infinity;
  const ids=r.feet.map(b=>r.skeleton.bones.indexOf(b));r.g.traverse(n=>{if(!n.isSkinnedMesh)return;const index=n.geometry.attributes.skinIndex;for(let i=0;i<index.count;i++)if(ids.includes(index.getX(i))){n.getVertexPosition(i,sample).applyMatrix4(n.matrixWorld);min=Math.min(min,sample.y);}});
  assert.ok(min>=-.005&&min<.06,`sole height ${min}`);
  for(let i=0;i<2;i++){const ball=r.feet[i].localToWorld(r.footBall.clone()),anchor=r.footPlants[i].clone().add(r.footBall.clone().multiply(r.g.scale).applyQuaternion(r.g.quaternion));assert.ok(ball.distanceTo(anchor)<1e-6,'ball of the planted foot stays fixed during heel lift');}
 }
});
test('Morrow chains preserve the outgoing pose and distance drives the gait',()=>{
 const r=buildCharacter(3),p={anim:'run',x:0,z:0,prev:{x:1,z:0}};animateCharacter(r,p,0);animateCharacter(r,p,1);assert.equal(r.stridePhase||0,0);p.z=.1;r.g.position.z=.1;animateCharacter(r,p,1.1);assert.ok(r.stridePhase>0);
 animateCharacter(r,{anim:'strike',x:0,z:.1,move:move(1,15)},1.2);const before={...r.morrowPose};animateCharacter(r,{anim:'strike',x:0,z:.1,move:move(2,0)},1.21);
 for(const k of Object.keys(before))assert.ok(Math.abs(before[k]-r.morrowPose[k])<1e-12);
 assert.deepEqual(morrowMovePose(1,0,0),morrowMovePose(1,0,Math.PI*2));
});
test('two-hand grip closes on every cut without stretching bones or drifting in hitstop',()=>{
 for(const chain of [1,2,3]){
  const r=buildCharacter(3),m=move(chain,0),p={anim:'strike',x:0,z:0,move:m};
  const upper=r.elbows.map(e=>e.position.length()),lower=[r.limbs[0],r.limbs[2]].map(a=>a.userData.hand.position.length());
  for(let frame=0;frame<=m.startup+m.active+m.recovery;frame++){
   m.frame=frame;animateCharacter(r,p,frame/60);
   if(r.morrowGrip?.weight===1){assert.ok(r.morrowGrip.error<1e-5,`chain ${chain} frame ${frame}: ${r.morrowGrip.error}`);assert.equal(r.morrowGrip.clamped,false);}
   r.elbows.forEach((e,i)=>assert.equal(e.position.length(),upper[i]));[r.limbs[0],r.limbs[2]].forEach((a,i)=>assert.equal(a.userData.hand.position.length(),lower[i]));
   if(frame===m.startup){const before=r.limbs[0].userData.hand.getWorldPosition(new Vector3());for(let j=0;j<4;j++)animateCharacter(r,p,frame/60);assert.ok(before.distanceTo(r.limbs[0].userData.hand.getWorldPosition(new Vector3()))<1e-9);}
  }
  animateCharacter(r,{anim:'hurt',x:0,z:0,animTime:.1},1);assert.equal(r.morrowGrip,null,'interrupt releases grip');
 }
});
test('buffered second cut retains the two-hand position at its entry frame',()=>{
 const r=buildCharacter(3),m=move(1,0);for(let frame=0;frame<=15;frame++){m.frame=frame;animateCharacter(r,{anim:'strike',x:0,z:0,move:m},frame/60);}
 const before=[r.limbs[0],r.limbs[2]].map(a=>a.userData.hand.getWorldPosition(new Vector3()));
 animateCharacter(r,{anim:'strike',x:0,z:0,move:move(2,0)},16/60);
 [r.limbs[0],r.limbs[2]].forEach((a,i)=>assert.ok(a.userData.hand.getWorldPosition(new Vector3()).distanceTo(before[i])<.015,'grip does not reopen between buffered cuts'));
});
