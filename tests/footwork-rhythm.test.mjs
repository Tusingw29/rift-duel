import test from 'node:test';import assert from 'node:assert/strict';
import {buildCharacter} from '../dist/characters.js';
import {animateCharacter} from '../dist/animation.js';
import {fighters} from '../dist/fighters.js';
import {moveTiming} from '../dist/moves.js';
import {Vector3} from '../dist/vendor/three.module.js';
import {RHYTHM} from '../dist/footwork.js';
// A fighter waiting is never still (CMU 14_01): the weight rolls between the feet, the free foot taps, the hips
// turn with the shift, and a punch drives the rear foot forward under it.
const poseOf=(r,id)=>r[['aegis','rei','tala','morrow','sol','vesper'][id]+'Pose']||r.pose;
const ankles=r=>{r.g.updateMatrixWorld(true);const shin=r.shinLength||r.legLength||.56;return r.knees.map(k=>k.localToWorld(new Vector3(0,-shin,0)));};
for(const [id,f] of fighters.entries()){
 test(`${f.name}: the idle rolls its weight between the feet, turns the hips with it and taps the free foot`,()=>{
  const r=buildCharacter(id);const xs=[],yaws=[],lifts=[[],[]],ys=[];
  for(let frame=0;frame<=Math.ceil(RHYTHM*60)+2;frame++){animateCharacter(r,{anim:'idle',x:0,z:0},frame/60);const q=poseOf(r,id);xs.push(q.bodyX);yaws.push(q.hipYaw);ys.push(q.bodyY);const a=ankles(r);lifts[0].push(a[0].y);lifts[1].push(a[1].y);}
  const span=v=>Math.max(...v)-Math.min(...v);
  assert.ok(span(xs)>.15,`${f.name} weight shifts sideways (${span(xs).toFixed(3)})`);
  assert.ok(span(yaws)>.15,`${f.name} hips turn with the shift (${span(yaws).toFixed(3)})`);
  assert.ok(span(ys)>.05,`${f.name} pelvis bounces (${span(ys).toFixed(3)})`);
  assert.ok(span(lifts[0])>.06&&span(lifts[1])>.06,`${f.name} both feet tap during a cycle (${span(lifts[0]).toFixed(3)}, ${span(lifts[1]).toFixed(3)})`);
  // Taps alternate: the feet never lift together.
  for(let i=0;i<lifts[0].length;i++)assert.ok(lifts[0][i]-Math.min(...lifts[0])<.02||lifts[1][i]-Math.min(...lifts[1])<.02,`${f.name} one foot stays down at frame ${i}`);
 });
 test(`${f.name}: a strike drives the rear foot forward under the punch and the pelvis follows the hip turn`,()=>{
  const r=buildCharacter(id),t=moveTiming(f,'strike'),m={kind:'strike',chain:1,...t,frame:0};
  for(let i=0;i<10;i++)animateCharacter(r,{anim:'idle',x:0,z:0},i/60);
  m.frame=0;animateCharacter(r,{anim:'strike',move:m,x:0,z:0},1);const before=ankles(r).map(v=>v.z),q0=poseOf(r,id);
  const rear=q0.rlx>q0.llx?1:0;
  let furthest=-Infinity;for(let fr=1;fr<=t.startup+t.active+2;fr++){m.frame=fr;animateCharacter(r,{anim:'strike',move:m,x:0,z:0},1+fr/60);furthest=Math.max(furthest,ankles(r)[rear].z-before[rear]);}
  if(!r.footPivot)assert.ok(furthest>.08,`${f.name} rear foot slides forward (${furthest.toFixed(3)})`); // rigs with a foot pivot turn on the ball instead
  m.frame=t.startup;animateCharacter(r,{anim:'strike',move:m,x:0,z:0},2);r.g.updateMatrixWorld(true);
  const q=poseOf(r,id);assert.ok(Math.abs(r.body.position.x-q.bodyX-q.hipYaw*.16)<1e-6,'pelvis offset follows the hip turn');
 });
}
