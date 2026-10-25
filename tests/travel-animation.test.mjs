import test from 'node:test';import assert from 'node:assert/strict';
import {buildCharacter} from '../dist/characters.js';
import {animateCharacter} from '../dist/animation.js';
import {moveTiming} from '../dist/moves.js';import {fighters} from '../dist/fighters.js';
import {travelMotion} from '../dist/grounded-animation.js';
const poseOf=(r,id)=>r[['aegis','rei','tala','morrow','sol','vesper'][id]+'Pose']||r.pose;
const finite=r=>{r.g.updateMatrixWorld(true);for(const b of [r.body,r.spine,r.head,...r.limbs,...r.elbows,...r.knees])assert.ok(b.matrixWorld.elements.every(Number.isFinite));};
for(const [id,f] of fighters.entries()){
 test(`${f.name}: ground pursuit loads low, drives forward and lands its strike on the contact frame`,()=>{
  const r=buildCharacter(id),timing=moveTiming(f,'pursuit'),mk=frame=>({kind:'pursuit',...timing,active:timing.active||1,aerial:false,aimX:1,aimZ:0,frame,travel:{kind:'line',frames:timing.startup,frame,dx:1,dz:0}});
  animateCharacter(r,{anim:'idle',x:0,z:0,lookX:1,lookZ:0},0);
  const leans=[],heights=[];
  for(let frame=0;frame<=timing.startup+4;frame++){animateCharacter(r,{anim:'pursuit',x:frame*.1,z:0,lookX:1,lookZ:0,move:mk(frame)},.1+frame/60);finite(r);const s=poseOf(r,id);leans.push(s.lean);heights.push(s.bodyY);}
  const mid=Math.floor(timing.startup*.6);
  assert.ok(leans[mid]>leans[0]+.1,`${f.name} leans into the drive (${leans[0].toFixed(2)} → ${leans[mid].toFixed(2)})`);
  assert.ok(heights[Math.floor(timing.startup*.35)]<heights[0]-.05,`${f.name} loads low before driving`);
  assert.ok(leans[timing.startup]>.05,'contact keeps the body committed forward');
 });
 test(`${f.name}: crossover leap crouches, tucks in flight and keeps every joint finite through landing`,()=>{
  const r=buildCharacter(id),timing=moveTiming(f,'strike'),startup=18,mk=frame=>({kind:'jumpAttack',...timing,startup,active:timing.active||1,crossover:true,frame,travel:{kind:'orbit',frames:startup,frame,side:1}});
  animateCharacter(r,{anim:'idle',x:0,z:0,lookX:1,lookZ:0},0);
  let tuck=null,crouch=null;
  for(let frame=0;frame<=startup+timing.recovery;frame++){animateCharacter(r,{anim:'jumpAttack',x:0,z:0,air:.3,lookX:1,lookZ:0,move:mk(frame)},.1+frame/60);finite(r);const s=poseOf(r,id);if(frame===4)crouch=s;if(frame===9)tuck=s;}
  assert.ok(crouch.bodyY<-.2,`${f.name} crouches at takeoff (${crouch.bodyY.toFixed(2)})`);
  assert.ok(tuck.lk>1&&tuck.rk>.9,`${f.name} tucks the legs in flight`);
 });
}
test('travel motion reads actual displacement in the lock-on frame',()=>{
 const p={travel:{kind:'orbit'},x:1,z:0,lookX:0,lookZ:1};
 assert.deepEqual(travelMotion(p,[1,0]),null);
 const forward=travelMotion({...p,z:.1},[1,0]);assert.ok(forward.forward>.99&&Math.abs(forward.side)<1e-9);
 const lateral=travelMotion({...p,x:.9},[1,0]);assert.ok(Math.abs(lateral.forward)<1e-9&&Math.abs(Math.abs(lateral.side)-1)<1e-9);
 assert.equal(travelMotion({...p,travel:null,x:.9},[1,0]),null);
});
test('circle-step travel drives a strafing step on the grounded rigs instead of the held input',()=>{
 for(const id of [0,1,2]){
  const r=buildCharacter(id);let x=0,z=0;
  for(let frame=0;frame<16;frame++){z+=.08;animateCharacter(r,{anim:'run',x,z,lookX:1,lookZ:0,prev:{x:1,z:0},travel:{kind:'orbit',frames:24,frame}},frame/60);finite(r);}
  const s=poseOf(r,id);assert.ok(Math.abs(s.side)>1e-6||Math.abs(s.llz)>1e-6,`${fighters[id].name} strafes during the orbit`);
 }
});
