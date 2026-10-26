import test from 'node:test';import assert from 'node:assert/strict';
import {keys as runKeys,meta as runMeta} from '../dist/clips/run.js';
import {keys as walkKeys} from '../dist/clips/walk.js';
import {setLocomotionSource,locomotionSource,clipMovePose} from '../dist/locomotion-clips.js';
import {CHANNELS} from '../dist/rig-pose.js';
import {buildCharacter} from '../dist/characters.js';
import {animateCharacter} from '../dist/animation.js';
import {Vector3} from '../dist/vendor/three.module.js';
test('converted CMU cycles are complete, finite and loop back to their first key',()=>{
 for(const keys of [runKeys,walkKeys]){
  assert.ok(keys.length>=9);assert.equal(keys[0][0],0);assert.equal(keys.at(-1)[0],1);assert.deepEqual(keys.at(-1)[1],keys[0][1]);
  for(const [t,pose] of keys)for(const ch of CHANNELS)assert.ok(Number.isFinite(pose[ch]),ch);
 }
 assert.match(runMeta.source,/CMU/);assert.ok(runMeta.seconds>.4&&runMeta.seconds<1.2,'a run stride is well under a second');
 const lean=runKeys.map(k=>k[1].lean),knees=runKeys.map(k=>Math.max(k[1].lk,k[1].rk));
 assert.ok(Math.min(...lean)>0,'a runner leans forward through the whole cycle');assert.ok(Math.max(...knees)>1.2,'the trailing knee folds high');
});
test('captured locomotion is opt-in, swaps the run pose on every grounded rig, keeps feet planted and switches back',()=>{
 assert.equal(locomotionSource(),'authored');assert.equal(clipMovePose(1,0,1),null);
 for(const id of [0,1,2,3,4,5]){
  const sample=()=>{const r=buildCharacter(id),p={anim:'run',x:0,z:0,prev:{x:1,z:0}};let x=0;for(let f=0;f<24;f++){x+=.07;animateCharacter(r,{...p,x},f/60);}r.g.updateMatrixWorld(true);
   const plants=r.footPlants?.map(v=>v.clone());const pose={...(r[['aegis','rei','tala','morrow','sol','vesper'][id]+'Pose']||r.pose)};
   for(const b of [r.body,r.spine,r.head,...r.limbs,...r.elbows,...r.knees])assert.ok(b.matrixWorld.elements.every(Number.isFinite));return {pose,plants,r};};
  const authored=sample();setLocomotionSource('mocap');const captured=sample();setLocomotionSource('authored');
  assert.notDeepEqual(authored.pose,captured.pose,`fighter ${id} run pose changes with the capture`);
  assert.ok(captured.plants&&captured.plants.every(v=>v.y>=-.01&&v.y<.6),'support feet still planted near the floor');
  const again=sample();assert.deepEqual(again.pose,authored.pose,'switching back restores the authored gait');
 }
});
test('retreat reverses the captured cycle and circling uses the walk with a lateral lean',()=>{
 setLocomotionSource('mocap');
 const fwd=clipMovePose(1,0,1.3),back=clipMovePose(-1,0,1.3),left=clipMovePose(0,-1,1.3),right=clipMovePose(0,1,1.3);
 assert.ok(fwd.lean>0&&back.lean<0,'retreat leans back');
 for(const p of [fwd,back,left,right])assert.ok(p.hx+p.lean>=.06-1e-9,'combat gaze stays level or tucked');assert.ok(Math.abs(left.side+right.side)<1e-9||left.side<right.side,'circling leans into the turn');
 setLocomotionSource('authored');
});
