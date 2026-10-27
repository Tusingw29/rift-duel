import test from 'node:test';import assert from 'node:assert/strict';
import {run,measure} from '../scripts/review/import-metrics.mjs';
import {setLocomotionSource} from '../dist/locomotion-clips.js';
import {buildCharacter} from '../dist/characters.js';
import {animateCharacter} from '../dist/animation.js';
import {Vector3} from '../dist/vendor/three.module.js';
// The rise used to push Tala's left foot 0.66 (authored) / 0.31 (imported) below the stone at getUp frames 12-16.
test('Tala gets up without any joint passing below the floor, in both animation sources',()=>{
 for(const source of ['authored','imported']){const m=measure(run('ab-knockdown-getup-guard',source));assert.equal(m.getUpFrames,28);assert.ok(m.getUpLowestPoint>=0,`${source}: lowest ${m.getUpLowestPoint} (${m.getUpLowestJoint})`);}
 setLocomotionSource('authored');
});
test('roster get-ups keep their ankles on or above the floor',()=>{
 for(const id of [0,1,3,4,5]){const r=buildCharacter(id);
  for(let f=0;f<28;f++){animateCharacter(r,{anim:'getUp',getUp:{frame:f,frames:28},x:0,z:0},f/60);r.g.updateMatrixWorld(true);
   for(const k of r.knees){const a=k.localToWorld(new Vector3(0,-(r.shinLength||r.legLength),0));assert.ok(a.y>=-1e-6,`fighter ${id} getUp frame ${f}: ankle ${a.y.toFixed(3)}`);}}}
});
