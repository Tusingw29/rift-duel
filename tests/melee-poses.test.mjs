import test from 'node:test';
import assert from 'node:assert/strict';
import {sampleMeleePose} from '../dist/melee-poses.js';
import {animateCharacter} from '../dist/animation.js';
import {buildCharacter} from '../dist/characters.js';
import {fighters} from '../dist/fighters.js';
import {moveTiming} from '../dist/moves.js';
test('authored melee tracks cross contact continuously and return to their initial pose',()=>{
 for(const f of fighters)for(const chain of [1,2,3]){
  const move={...moveTiming(f,'strike',chain),chain,frame:0};const initial=sampleMeleePose(f.id,move);
  const before=sampleMeleePose(f.id,{...move,frame:move.startup-.001}),after=sampleMeleePose(f.id,{...move,frame:move.startup+.001});
  for(const k of Object.keys(initial))assert.ok(Math.abs(before[k]-after[k])<.001,`${f.id} ${k} snaps at contact`);
  assert.deepEqual(sampleMeleePose(f.id,{...move,frame:move.total}),initial);
  assert.notDeepEqual(sampleMeleePose(f.id,{...move,frame:move.startup*.6}),initial);
  const contact=sampleMeleePose(f.id,{...move,frame:move.startup});assert.ok(Math.min(contact.rx,contact.lx)<-.8);
 }
});
test('Tala switches punching arms for the second hit while sword users reverse their arcs',()=>{
 const move={...moveTiming(fighters[2],'strike'),frame:9};const first=sampleMeleePose('tala',{...move,chain:1}),second=sampleMeleePose('tala',{...move,chain:2});assert.equal(first.rx,second.lx);assert.equal(first.re,second.le);
 const a=sampleMeleePose('rei',{...move,chain:1}),b=sampleMeleePose('rei',{...move,chain:2});assert.equal(a.ry,-b.ry);assert.equal(a.twist,-b.twist);
});
test('advance, retreat and circle have distinct poses and guard recoil clears on the next frame',()=>{
 const r=buildCharacter(1),read=()=>[r.spine.rotation.x,r.spine.rotation.z,r.limbs[1].rotation.x,r.limbs[1].rotation.z];
 animateCharacter(r,{anim:'run',prev:{x:1,z:0}},.13);const advance=read();
 animateCharacter(r,{anim:'run',prev:{x:-1,z:0}},.13);const retreat=read();
 animateCharacter(r,{anim:'run',prev:{x:0,z:1}},.13);const circle=read();assert.notDeepEqual(advance,retreat);assert.notDeepEqual(advance,circle);
 // The grounded animator eases into guard over a short entry, so sample past the entry before reading the recoil.
 for(const t of [.14,.2,.26,.32,.38,.44])animateCharacter(r,{anim:'idle',guard:true,blockStun:.2},t);assert.ok(r.body.position.z<0);const recoil=r.spine.rotation.x;
 animateCharacter(r,{anim:'idle',guard:true,blockStun:0},.46);assert.ok(Math.abs(r.body.position.z)<.05); // recoil cleared; only the guard's weight rhythm remainsassert.ok(r.spine.rotation.x>recoil);
});
test('frozen animation clock produces identical articulated transforms',()=>{
 const r=buildCharacter(3),p={anim:'strike',move:{kind:'strike',...moveTiming(fighters[3],'strike'),frame:12,chain:1}};
 const matrices=()=>{r.g.updateMatrixWorld(true);const result=[];r.g.traverse(n=>result.push([...n.matrixWorld.elements]));return result;};
 animateCharacter(r,p,1);const first=matrices();animateCharacter(r,p,1);assert.deepEqual(matrices(),first);
});
