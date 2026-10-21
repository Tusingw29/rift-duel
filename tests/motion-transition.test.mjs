import test from 'node:test';import assert from 'node:assert/strict';
import {buildCharacter} from '../dist/characters.js';import {animateCharacter} from '../dist/animation.js';
import {Quaternion,Vector3} from '../dist/vendor/three.module.js';
import {moveTiming} from '../dist/moves.js';import {fighters} from '../dist/fighters.js';
const matrices=r=>{r.g.updateMatrixWorld(true);const a=[];r.g.traverse(n=>a.push([...n.matrixWorld.elements]));return a;};
test('authored fighters return from aerial poses without a one-frame arm snap',()=>{
 for(const id of [0,2,3]){
  const r=buildCharacter(id);animateCharacter(r,{anim:'launch',air:.5,x:0,z:0},0);
  const before=r.limbs[2].quaternion.clone();animateCharacter(r,{anim:'idle',x:0,z:0},1/60);
  const blended=before.angleTo(r.limbs[2].quaternion);
  const reference=buildCharacter(id);animateCharacter(reference,{anim:'idle',x:0,z:0},1/60);
  const snapped=before.angleTo(reference.limbs[2].quaternion);assert.ok(blended<snapped*.3);
  for(let n=2;n<=10;n++)animateCharacter(r,{anim:'idle',x:0,z:0},n/60);
  assert.equal(r.motionBridge.entry,null);
 }
});
test('handoff blending cannot move a strike away from its contact pose',()=>{
 for(const id of [0,2,3]){
  const r=buildCharacter(id),ref=buildCharacter(id),m={kind:'strike',...moveTiming(fighters[id],'strike'),chain:1};m.frame=m.startup;
  animateCharacter(r,{anim:'launch',air:.5,x:0,z:0},0);
  const p={anim:'strike',x:0,z:0,move:m};animateCharacter(r,p,1/60);animateCharacter(ref,p,1/60);
  for(const key of ['spine','head'])assert.ok(r[key].quaternion.angleTo(ref[key].quaternion)<1e-7);
  assert.ok(r.limbs[2].quaternion.angleTo(ref.limbs[2].quaternion)<1e-7);assert.equal(r.motionBridge.entry,null);
 }
});
test('handoff freezes and grounded foot anchors survive the return blend',()=>{
 for(const id of [0,2,3]){
  const r=buildCharacter(id);animateCharacter(r,{anim:'launch',air:.5,x:0,z:0},0);const p={anim:'idle',x:0,z:0};animateCharacter(r,p,1/60);
  const first=matrices(r);animateCharacter(r,p,1/60);assert.deepEqual(matrices(r),first);
  for(let i=0;i<2;i++){const ankle=r.knees[i].localToWorld(new Vector3(0,-(r.legLength||.48),0));assert.ok(ankle.distanceTo(r.footPlants[i])<1e-6);}
 }
});
test('Aegis aerial fallback releases the ankle orientation left by grounded IK',()=>{
 const r=buildCharacter(0);animateCharacter(r,{anim:'idle',x:0,z:0},0);assert.ok(r.feet.some(f=>f.quaternion.angleTo(new Quaternion())>.01));
 for(let i=1;i<=10;i++)animateCharacter(r,{anim:'launch',air:.5,x:0,z:0},i/60);
 for(const foot of r.feet)assert.ok(foot.quaternion.angleTo(new Quaternion())<1e-7);
});
