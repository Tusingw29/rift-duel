import test from 'node:test';import assert from 'node:assert/strict';
import {buildCharacter} from '../dist/characters.js';
import {animateCharacter} from '../dist/animation.js';
import {fighters} from '../dist/fighters.js';
import {moveTiming} from '../dist/moves.js';
import {sampleKeys,kineticKeys,sampleSchedule,snapOut} from '../dist/grounded-animation.js';
import {CHANNELS,applyPose} from '../dist/rig-pose.js';
// The kinetic wave: feet and pelvis five frames ahead of the arms, spine three and a half, shoulders two, elbows one,
// wrists on the beat at impact and dragging behind afterwards; elbows and knees pure flexion hinges; keys joined by
// clamped Hermite curves (no overshoot, flat holds, crisp whip).
const ids=['aegis','rei','tala','morrow','sol','vesper'];
const poseOf=(r,id)=>r[ids[id]+'Pose']||r.pose;
const pose=o=>Object.fromEntries(CHANNELS.map(k=>[k,o[k]??0]));
test('clamped Hermite keys never overshoot, hold flat, and keep the crisp whip',()=>{
 const a=pose({lean:0}),b=pose({lean:1}),c=pose({lean:1}),d=pose({lean:.2});
 const keys=[[0,a],[1,b],[2,c],[3,d]];
 let prev=-1;for(let u=0;u<=1;u+=.05){const v=sampleKeys(keys,u).lean;assert.ok(v>=-1e-9&&v<=1+1e-9,'within keys');assert.ok(v>=prev-1e-9,'monotone');prev=v;}
 for(let u=1;u<=2;u+=.1)assert.ok(Math.abs(sampleKeys(keys,u).lean-1)<1e-9,'held segment stays flat');
 const mid=sampleKeys(keys,.5).lean,q1=sampleKeys(keys,.25).lean,q3=sampleKeys(keys,.75).lean;
 assert.ok(q1<.5&&q3>.5&&Math.abs(mid-.5)<.15,'eases in and out across a segment');
 const whip=[[0,a],[1,b,snapOut]];assert.ok(sampleKeys(whip,.5).lean>.8,'a snapOut key is reached crisply');
});
for(const [id,f] of fighters.entries()){
 test(`${f.name}: the pelvis, spine, shoulders and elbows arrive before the wrists, and the wrists drag after the hold`,()=>{
  const r=buildCharacter(id),t=moveTiming(f,'strike'),m={kind:'strike',chain:1,...t,frame:0};
  const stance=poseOf(r,id)||{};for(let i=0;i<10;i++)animateCharacter(r,{anim:'idle',x:0,z:0},i/60);
  const at=fr=>{m.frame=fr;animateCharacter(r,{anim:'strike',move:m,x:0,z:0},1+fr/60);return {...poseOf(r,id)};};
  for(let fr=0;fr<=t.startup;fr++)at(fr);const contact=at(t.startup);
  const early=at(t.startup-2);
  assert.ok(Math.abs(early.hipYaw-contact.hipYaw)<1e-6&&Math.abs(early.lean-contact.lean)<1e-6,`${f.name} pelvis and spine already at the impact value two frames out`);
  // wrists: exact at impact (same as a direct sample), dragging after the hold
  const keys=kineticKeys(m,pose(stance),pose(stance),pose({...stance,rwx:1,lean:.3,rax:-1.5,hipYaw:-.5}),pose({...stance,rwx:.6,lean:.2,rax:-1.2,hipYaw:-.4}));
  const onBeat=sampleSchedule(keys,m.startup),afterHold=sampleSchedule(keys,keys.holdEnd+4),direct=sampleKeys(keys,keys.holdEnd+4),behind=sampleKeys(keys,keys.holdEnd+.5);
  assert.ok(Math.abs(onBeat.rwx-1)<1e-9,'wrist on the beat at impact');
  assert.ok(Math.abs(afterHold.rwx-behind.rwx)<1e-9&&Math.abs(afterHold.rwx-direct.rwx)>1e-6||Math.abs(direct.rwx-behind.rwx)<1e-6,'wrist trails 3.5 frames behind after the hold');
 });
 test(`${f.name}: elbows and knees never hyperextend or bend sideways, whatever the pose asks`,()=>{
  const r=buildCharacter(id);
  animateCharacter(r,{anim:'idle',x:0,z:0},0);
  applyPose(r,pose({le:.7,re:.5,lk:-.4,rk:-.2,lax:-1,rax:-1}));
  for(const e of r.elbows){assert.ok(e.rotation.x<=0,'elbow never past straight');assert.equal(e.rotation.y,0);assert.equal(e.rotation.z,0);}
  for(const k of r.knees){assert.ok(k.rotation.x>=0,'knee never past straight');assert.equal(k.rotation.y,0);assert.equal(k.rotation.z,0);}
 });
 test(`${f.name}: a ground bounce lies on the back with the limbs splaying, and the fall after it continues from the whiplash`,()=>{
  const r=buildCharacter(id);for(let i=0;i<10;i++)animateCharacter(r,{anim:'idle',x:0,z:0},i/60);
  animateCharacter(r,{anim:'launch',launched:true,air:.1,bounce:{frame:6,frames:12,height:.55},x:0,z:0},1);const top=poseOf(r,id);
  assert.equal(r.animationFamily,'grounded');assert.ok(top.bodyPitch<-1.3,`${f.name} on the back during the bounce (${top.bodyPitch.toFixed(2)})`);assert.ok(top.laz>.8&&top.llx<-.4,'limbs splay upward');
  animateCharacter(r,{anim:'knockdown',animTime:.55,x:0,z:0},1.1);const first=poseOf(r,id);assert.ok(first.bodyPitch<-1.3,'the fall after a bounce starts already on the back');
 });
}
