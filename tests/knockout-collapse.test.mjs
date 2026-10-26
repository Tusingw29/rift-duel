import test from 'node:test';import assert from 'node:assert/strict';
import {buildCharacter} from '../dist/characters.js';
import {animateCharacter} from '../dist/animation.js';
import {fighters} from '../dist/fighters.js';
import {Vector3} from '../dist/vendor/three.module.js';
// A knockout collapses: the knees give out first, the body folds and sinks, then tips over and lies crumpled with
// limp limbs. It never stands, floats or falls over like a board, and it does not breathe.
const ids=['aegis','rei','tala','morrow','sol','vesper'];
const poseOf=(r,id)=>r[ids[id]+'Pose']||r.pose;
const head=r=>{r.g.updateMatrixWorld(true);return r.head.getWorldPosition(new Vector3()).y;};
for(const [id,f] of fighters.entries()){
 test(`${f.name}: the knockout collapses through the knees, folds, tips over and lies crumpled and still`,()=>{
  const r=buildCharacter(id);for(let i=0;i<10;i++)animateCharacter(r,{anim:'idle',x:0,z:0},i/60);
  const standing=head(r),ys=[],heads=[];
  for(let fr=0;fr<=90;fr++){const t=fr/60;animateCharacter(r,{anim:'defeat',animTime:t,x:0,z:0},1+t);const q=poseOf(r,id);ys.push(q.bodyY);heads.push(head(r));
   r.g.updateMatrixWorld(true);for(const b of [r.body,r.spine,r.head,...r.limbs])assert.ok(b.matrixWorld.elements.every(Number.isFinite));
   if(fr===18){assert.ok(q.lk>1.2&&q.rk>1.2,`${f.name} knees give out (${q.lk.toFixed(2)}, ${q.rk.toFixed(2)})`);assert.ok(Math.abs(q.lax)<.6&&Math.abs(q.rax)<.6&&q.le>-.6,`${f.name} arms hang limp`);assert.ok(q.hx>.3,`${f.name} head drops`);}
   if(fr===18)assert.ok(heads[18]<standing-.5,`${f.name} sinks as the legs buckle (${heads[18].toFixed(2)} vs ${standing.toFixed(2)})`);
  }
  for(let i=1;i<=18;i++)assert.ok(ys[i]<=ys[i-1]+1e-9,`${f.name} the pelvis only sinks while buckling (frame ${i})`);
  const end=poseOf(r,id);
  assert.ok(heads[90]<.75,`${f.name} head on the floor at the end (${heads[90].toFixed(2)})`);
  assert.ok(end.bodyPitch<-1.3,`${f.name} lies down (${end.bodyPitch.toFixed(2)})`);
  assert.ok(Math.abs(end.twist)+Math.abs(end.side)>.4&&Math.abs(end.lk-end.rk)>.8,`${f.name} lies crumpled, not flat like a board`);
  assert.ok(Math.abs(ys[90]-ys[80])<1e-6&&Math.abs(heads[90]-heads[80])<1e-6,`${f.name} lies still (no breathing)`);
 });
}
