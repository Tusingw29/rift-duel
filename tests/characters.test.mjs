import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {buildCharacter} from '../dist/characters.js';
import {moveTiming} from '../dist/moves.js';
import {fighters} from '../dist/fighters.js';
import {animateCharacter} from '../dist/animation.js';

test('all roster rigs remain finite and within camera-scale bounds through combat poses',()=>{
 for(let id=0;id<6;id++){
  const rig=buildCharacter(id);
  for(const anim of ['idle','run','strike','forward','back','charge','hurt','jumpAttack','technique'])for(let frame=0;frame<(anim==='technique'?65:24);frame++){
   animateCharacter(rig,{anim,animTime:.42*(1-frame/24),move:['strike','forward','back','jumpAttack','technique'].includes(anim)?{kind:anim,...moveTiming(fighters[id],anim),frame}:null,combo:frame%3,air:anim==='jumpAttack'?.5:0,guard:false},frame/60);
   rig.g.updateMatrixWorld(true);
   const bounds=new T.Box3().setFromObject(rig.g),size=bounds.getSize(new T.Vector3());
   assert.ok([size.x,size.y,size.z].every(v=>Number.isFinite(v)&&v>0&&v<6),`${id} ${anim}: rig exceeds camera envelope`);
   rig.g.traverse(node=>assert.ok(node.matrixWorld.elements.every(Number.isFinite)));
  }
 }
});
test('rigs have articulated elbows, knees and attached handheld weapons',()=>{
 for(let id=0;id<6;id++){
  const rig=buildCharacter(id);assert.equal(rig.elbows.length,2);assert.equal(rig.knees.length,2);
  for(const elbow of rig.elbows)assert.ok(rig.limbs.includes(elbow.parent));
  for(const knee of rig.knees)assert.ok(rig.limbs.includes(knee.parent));
  if([0,1,3,4,5].includes(id))assert.ok(rig.limbs[2].userData.hand.children.length>1);
 }
});
test('recovery rolls keep all six bodies above the arena floor',()=>{
 for(let id=0;id<6;id++)for(const direction of [-1,1]){
  const r=buildCharacter(id);r.g.scale.setScalar(id===3?1.12:1);
  for(let frame=0;frame<18;frame++){
   animateCharacter(r,{anim:'roll',roll:{elapsed:frame/60,direction},face:1},frame/60);
   r.g.updateMatrixWorld(true);
   assert.ok(new T.Box3().setFromObject(r.body).min.y>=.029);
  }
 }
});

test('Aegis armor keeps face colors and a bounded draw budget after joint batching',()=>{
 const rig=buildCharacter(0);let meshes=0,vertices=0,colored=0;
 rig.g.traverse(n=>{if(!n.isMesh)return;meshes++;vertices+=n.geometry.attributes.position.count;if(n.material.vertexColors){const c=n.geometry.attributes.color;assert.equal(c.count,n.geometry.attributes.position.count);assert.ok([...c.array].every(v=>Number.isFinite(v)&&v>=0&&v<=1));colored++;}});
 assert.ok(colored>10,'armor colors survive every articulated plate batch');
 assert.ok(meshes<=32,'armor does not add one draw per plate');assert.ok(vertices<8000);
});
