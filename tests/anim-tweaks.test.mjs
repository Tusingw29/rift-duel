import test from 'node:test';import assert from 'node:assert/strict';
import {TWEAKS,keyWeights,keyTimes,applyTweaks,tweakState,moveKey} from '../dist/anim-tweaks.js';
import {TWEAK_DATA} from '../dist/anim-tweaks-data.js';
import {buildCharacter} from '../dist/characters.js';
import {animateCharacter} from '../dist/animation.js';
import {moveTiming} from '../dist/moves.js';
import {fighters} from '../dist/fighters.js';
// ANIM-WORKBENCH keyed additive layer.
const move=(id,chain,frame)=>({kind:'strike',chain,...moveTiming(fighters[id],'strike',chain),frame});
test('no tweaks ship by default, so every source plays unchanged',()=>{assert.deepEqual(TWEAK_DATA,{});assert.deepEqual(TWEAKS,{});});
test('key weights peak on their key, fade to zero at the neighbours, and the impact key peaks on the damage frame',()=>{
 const m=move(2,1,0),t=keyTimes(m);assert.equal(t.impact,m.startup);
 for(const k of ['coil','drive','whip','impact','overshoot','recovery'])assert.ok(Math.abs(keyWeights(m,t[k])[k]-1)<1e-9,k);
 assert.equal(keyWeights(m,t.whip).impact,0);assert.equal(keyWeights(m,t.overshoot).impact,0);
 for(let f=0;f<=t.end;f+=.5){const w=keyWeights(m,f),sum=Object.values(w).reduce((a,b)=>a+b,0);assert.ok(sum<=1+1e-9);}
});
test('a tweak changes the live rig at its key on every animator and is gone when cleared or switched off',()=>{
 for(const id of [2,0,3,1]){
  const f=fighters[id].id,m=move(id,1,0),pose=r=>r[f+'Pose']||r.pose,run=()=>{const r=buildCharacter(id);for(let fr=0;fr<=m.startup;fr++){m.frame=fr;animateCharacter(r,{anim:'strike',move:m,x:0,z:0},fr/60);}return pose(r).lean;};
  const base=run();TWEAKS[f]={[moveKey(m)]:{impact:{lean:.3}}};const tweaked=run();tweakState.enabled=false;const off=run();tweakState.enabled=true;delete TWEAKS[f];
  assert.ok(Math.abs(tweaked-base-.3)<1e-6,`${f}: lean +0.3 at impact (${(tweaked-base).toFixed(3)})`);assert.ok(Math.abs(off-base)<1e-9,`${f}: switched off`);assert.ok(Math.abs(run()-base)<1e-9,`${f}: cleared`);
 }
 assert.deepEqual(applyTweaks('tala',null,{lean:1}),{lean:1});
});
