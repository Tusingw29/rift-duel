import test from 'node:test';import assert from 'node:assert/strict';
import {buildCharacter} from '../dist/characters.js';
import {animateCharacter} from '../dist/animation.js';
import {createScenario,stepScenario,scenarioAt} from '../dist/sandbox-recipes.js';
import {fighters} from '../dist/fighters.js';
import {Vector3} from '../dist/vendor/three.module.js';
const poseOf=(r,id)=>r[['aegis','rei','tala','morrow','sol','vesper'][id]+'Pose']||r.pose;
const finite=r=>{r.g.updateMatrixWorld(true);for(const b of [r.body,r.spine,r.head,...r.limbs,...r.elbows,...r.knees])assert.ok(b.matrixWorld.elements.every(Number.isFinite));};
for(const [id,f] of fighters.entries()){
 test(`${f.name}: a broken guard reels with buckled knees and sways, then snaps upright on recovery`,()=>{
  const r=buildCharacter(id),s=createScenario('stagger-recover',id,1);
  animateCharacter(r,s.m.players[0],0);
  const sides=[],knees=[];let staggeredFrames=0;
  for(let frame=1;frame<=40;frame++){stepScenario(s);const p=s.m.players[0];animateCharacter(r,p,frame/60);finite(r);const q=poseOf(r,id);if(p.staggerState){staggeredFrames++;sides.push(q.side);knees.push(q.lk);}}
  assert.ok(staggeredFrames>3,`${f.name} staggers in the scenario`);
  assert.ok(Math.max(...knees)>.45,`${f.name} knees buckle (${Math.max(...knees).toFixed(2)})`);
  assert.ok(Math.max(...sides)-Math.min(...sides)>.02,`${f.name} sways`);
  const p=s.m.players[0];assert.ok(!p.staggerState,'recovered by frame 40');
  for(let frame=41;frame<=70;frame++){stepScenario(s);animateCharacter(r,s.m.players[0],frame/60);}
  const settled=poseOf(r,id);assert.ok(Math.abs(settled.side)<.06&&settled.lk<.6,`${f.name} settles upright`); // idle now shifts weight foot to foot
 });
 test(`${f.name}: the third-hit reversal plays a forward return strike out of the guard`,()=>{
  const r=buildCharacter(id),s=createScenario('reversal',id,id===1?2:1);
  let fired=null;
  for(let frame=0;frame<120;frame++){stepScenario(s);const p=s.m.players[0];animateCharacter(r,p,frame/60);finite(r);if(p.move?.reversal&&p.move.frame===p.move.startup){fired={...poseOf(r,id)};}}
  assert.ok(fired,`${f.name} reversal fires`);
  assert.ok(fired.bodyZ>.15,`${f.name} return strike drives forward (${fired.bodyZ.toFixed(2)})`);
 });
}
