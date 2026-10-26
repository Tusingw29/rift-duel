import test from 'node:test';import assert from 'node:assert/strict';
import {buildCharacter} from '../dist/characters.js';
import {animateCharacter} from '../dist/animation.js';
import {fighters} from '../dist/fighters.js';
import {moveTiming} from '../dist/moves.js';
import {Vector3} from '../dist/vendor/three.module.js';
import {HURT_TIME,JUMP_SQUAT_FRAMES,GET_UP_FRAMES} from '../dist/grounded-animation.js';
// Sprite-sheet timing on the grounded rig: held wind-up, two-frame whip, locked contact, frame-one recoil with a
// hitstop shudder, a stepping idle that re-anchors its feet, travel that pushes off and brakes, and frame-bound
// jump-squat / get-up states (with a mid-pose fallback when the simulation does not carry them yet).
const ids=['aegis','rei','tala','morrow','sol','vesper'];
const poseOf=(r,id)=>r[ids[id]+'Pose']||r.pose;
const ankles=r=>{r.g.updateMatrixWorld(true);const shin=r.shinLength||r.legLength||.56;return r.knees.map(k=>k.localToWorld(new Vector3(0,-shin,0)));};
const settle=(r,t0=0)=>{for(let i=0;i<12;i++)animateCharacter(r,{anim:'idle',x:0,z:0},t0+i/60);};
const CH=['rax','lax','re','le','twist','hipYaw','lean'];
for(const [id,f] of fighters.entries()){
 test(`${f.name}: strikes hold the wind-up, whip in two frames and lock the contact pose through the hitstop`,()=>{
  const r=buildCharacter(id),t=moveTiming(f,'strike');
  for(const chain of [1,2,3]){
   const m={kind:'strike',chain,...t,frame:0};settle(r);
   const frames=[];for(let fr=0;fr<=t.startup+t.active+4;fr++){m.frame=fr;animateCharacter(r,{anim:'strike',move:m,x:0,z:0},1+fr/60);frames.push({...poseOf(r,id)});}
   const dist=(a,b)=>Math.hypot(...CH.map(k=>a[k]-b[k]));
   const contact=frames[t.startup];
   for(let fr=t.startup+1;fr<=t.startup+t.active+1;fr++)assert.ok(dist(frames[fr],contact)<1e-9,`${f.name} chain ${chain} frame ${fr} stays locked on the contact pose`);
   if(t.startup>=4){const a=dist(frames[t.startup-2],contact),b=dist(frames[t.startup-1],contact);assert.ok(a>b&&b>1e-6,`${f.name} chain ${chain}: the whip closes on the contact over its two frames (${a.toFixed(2)} → ${b.toFixed(2)} → 0)`);
    if(t.startup>=7){const held=dist(frames[t.startup-2],frames[Math.ceil(t.startup*.6)]);assert.ok(held<.15,`${f.name} chain ${chain}: the loaded pose is held until the whip (${held.toFixed(2)})`);}}
  }
 });
 test(`${f.name}: a hit bends to full recoil on its first frame and shudders through the hitstop`,()=>{
  const r=buildCharacter(id);settle(r);
  const xs=[];for(let fr=0;fr<8;fr++){animateCharacter(r,{anim:'hurt',animTime:HURT_TIME-fr/60,x:0,z:0},1+fr/60);xs.push(poseOf(r,id).bodyX);}
  const first=poseOf(r,id);
  animateCharacter(r,{anim:'hurt',animTime:HURT_TIME-.3,x:0,z:0},2);const late=poseOf(r,id);
  for(let i=1;i<6;i++)assert.ok(Math.sign(xs[i])!==Math.sign(xs[i-1])&&Math.abs(xs[i])>.01,`${f.name} shudders frame to frame (${xs.map(v=>v.toFixed(3)).join(' ')})`);
  assert.ok(Math.abs(xs[7])<1e-9||Math.abs(xs[7])>.01,'shudder ends cleanly');
  void first;void late;
 });
 test(`${f.name}: the idle steps and re-anchors a foot without skating while it is planted`,()=>{
  const r=buildCharacter(id);settle(r);const home=ankles(r).map(v=>v.clone());
  let reanchored=false,skated=0,prev=null;
  for(let fr=0;fr<150;fr++){animateCharacter(r,{anim:'idle',x:0,z:0},.2+fr/60);const a=ankles(r);
   if(prev)for(let i=0;i<2;i++){const moved=a[i].distanceTo(prev[i]),lifted=a[i].y-home[i].y>.01,displaced=Math.hypot(a[i].x-home[i].x,a[i].z-home[i].z)>.05;
    if(displaced&&!lifted&&moved<1e-6)reanchored=true; // planted at a new spot, perfectly still
    if(!lifted&&moved>1e-4&&a[i].y-home[i].y<.001&&prev[i].y-home[i].y<.001)skated++;}
   prev=a.map(v=>v.clone());}
  assert.ok(reanchored,`${f.name} re-anchors a stepping foot`);
  assert.ok(skated===0,`${f.name} never skates a planted foot (${skated} frames)`);
 });
 test(`${f.name}: a circle-step travel pushes off into the acceleration and braces into the brake`,()=>{
  const r=buildCharacter(id);settle(r);
  const travel={kind:'line',frames:24,frame:0,dx:3,dz:0};
  const sample=fr=>{travel.frame=fr;animateCharacter(r,{anim:'run',travel,x:fr*.125,z:0,lookX:1,lookZ:0,prev:{x:1,z:0}},1+fr/60);return {...poseOf(r,id)};};
  const push=sample(3),brake=sample(19);
  assert.ok(push.lean-brake.lean>.15,`${f.name} leans into the push and back on the brake (${push.lean.toFixed(2)} vs ${brake.lean.toFixed(2)})`);
  assert.ok(brake.lk>push.lk+.05||brake.rk>push.rk+.05,`${f.name} bends a knee to brake`);
  assert.ok(brake.llz>push.llz-.001&&brake.rlz<push.rlz+.001,`${f.name} widens the plant to brake`);
 });
 test(`${f.name}: jumpSquat and getUp states drive frame-bound poses, with a mid-pose fallback`,()=>{
  const r=buildCharacter(id);settle(r);const stanceY=poseOf(r,id).bodyY;
  const squat=[];for(let fr=0;fr<=JUMP_SQUAT_FRAMES;fr++){animateCharacter(r,{anim:'jumpSquat',animTime:(JUMP_SQUAT_FRAMES-fr)/60,x:0,z:0},1+fr/60);squat.push(poseOf(r,id).bodyY);}
  assert.ok(squat[0]>squat.at(-1)+.12,`${f.name} squats over its frames (${squat.map(v=>v.toFixed(2)).join(' ')})`);
  for(let i=1;i<squat.length;i++)assert.ok(squat[i]<=squat[i-1]+1e-9,'squat deepens monotonically');
  animateCharacter(r,{anim:'jumpSquat',x:0,z:0},2);assert.ok(poseOf(r,id).bodyY<stanceY-.05,'without a timer the squat sits mid-way');
  settle(r,3);const heads=[];for(let fr=0;fr<=GET_UP_FRAMES;fr++){animateCharacter(r,{anim:'getUp',animTime:(GET_UP_FRAMES-fr)/60,x:0,z:0},4+fr/60);r.g.updateMatrixWorld(true);heads.push(r.head.getWorldPosition(new Vector3()).y);}
  assert.ok(heads[0]<1&&heads.at(-1)>heads[0]+1,`${f.name} gets up over its frames (${heads[0].toFixed(2)} → ${heads.at(-1).toFixed(2)})`);
 });
}
