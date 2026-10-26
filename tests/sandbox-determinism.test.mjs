import test from 'node:test';import assert from 'node:assert/strict';
import {RECIPES,createScenario,stepScenario,scenarioAt,snapshot} from '../dist/sandbox-recipes.js';
import {buildCharacter} from '../dist/characters.js';
import {animateCharacter} from '../dist/animation.js';
import {canonicalBone,RIG_BONES} from '../dist/rig-schema.js';
import {fighters} from '../dist/fighters.js';
import {Vector3} from '../dist/vendor/three.module.js';
const SCENARIOS=['strike3','pursuit','crossover','circle-step','recoil','guard-hit','stagger-recover','reversal','burst','launch'];
test('every sandbox scenario replays identically from reset, for every fighter pairing used in the sandbox',()=>{
 for(const name of SCENARIOS)for(const [p1,p2] of [[2,1],[0,3],[4,5]]){
  const a=scenarioAt(name,64,p1,p2).m.players.map(snapshot),b=scenarioAt(name,64,p1,p2).m.players.map(snapshot);
  assert.deepEqual(a,b,`${name} ${p1}v${p2}`);
 }
});
test('scrubbing to a frame equals stepping to it, and frames 0..64 stay finite for every scenario',()=>{
 for(const name of Object.keys(RECIPES)){
  const s=createScenario(name,2,1),steps=[];
  for(let f=0;f<=64;f++){steps.push(s.m.players.map(snapshot));if(f<64)stepScenario(s);}
  for(const f of [0,6,12,18,24,40,64])assert.deepEqual(scenarioAt(name,f,2,1).m.players.map(snapshot),steps[f],`${name} frame ${f}`);
  for(const row of steps)for(const p of row)assert.ok(Number.isFinite(p.x)&&Number.isFinite(p.z)&&Number.isFinite(p.hp),name);
 }
});
test('scenarios reach the states they are named for',()=>{
 assert.equal(scenarioAt('strike3',60,2,1).m.players[0].move?.chain,3);
 assert.ok(scenarioAt('pursuit',3,2,1).m.players[0].move?.travel,'pursuit travels');
 assert.ok(scenarioAt('crossover',6,2,1).m.players[0].move?.crossover,'crossover takes off');
 assert.ok(scenarioAt('circle-step',4,2,1).m.players[0].travel,'circle-step orbits');
 assert.equal(scenarioAt('recoil',12,2,1).m.players[0].anim,'hurt');
 assert.ok([28,29,30,31,32,33,34,35,36].some(f=>scenarioAt('guard-hit',f,2,1).m.players[0].blockStun>0),'guarded hit leaves block stun');
 assert.ok(scenarioAt('stagger',0,2,1).m.players[0].staggerState,'stagger setup breaks the guard');
 assert.ok(scenarioAt('reversal',76,2,1).m.players[0].move?.reversal,'third-hit reversal fires');
 assert.equal(scenarioAt('burst',6,2,1).m.players[0].stocks,2,'burst spends a stock');
});
test('animating the same deterministic frames on two fresh rigs gives identical bone transforms for all six fighters',()=>{
 for(const [id,f] of fighters.entries()){
  const transforms=[];
  for(let run=0;run<2;run++){
   const r=buildCharacter(id),s=createScenario(id===2?'strike3':'pursuit',id,id===2?1:2);const out=[];
   for(let frame=0;frame<=40;frame++){animateCharacter(r,s.m.players[0],frame/60);r.g.updateMatrixWorld(true);if([0,8,16,24,40].includes(frame))out.push([r.body,r.spine,r.head,...r.limbs,...r.elbows,...r.knees].map(b=>b.getWorldPosition(new Vector3()).toArray().map(v=>+v.toFixed(9))));stepScenario(s);}
   transforms.push(out);
  }
  assert.deepEqual(transforms[0],transforms[1],f.name);
 }
});
test('bone aliases normalise onto the canonical rig',()=>{
 for(const b of RIG_BONES)assert.equal(canonicalBone(b),b);
 assert.equal(canonicalBone('upper_armL'),'upper_arm.L');assert.equal(canonicalBone('concept-foot.R'),'foot.R');assert.equal(canonicalBone('v3-ponytail'),'ponytail');
 assert.equal(canonicalBone('Hips'),'root');assert.equal(canonicalBone('UpperArm.R'),'upper_arm.R');assert.equal(canonicalBone('LowerLeg_L'),'shin.L');assert.equal(canonicalBone('mixamorig:LeftForeArm'),'forearm.L');
 assert.equal(canonicalBone('Shoulder.L'),'chest');assert.equal(canonicalBone('Neck'),'head');assert.equal(canonicalBone('prop_sword'),null);
});
