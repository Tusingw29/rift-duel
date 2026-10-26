import test from 'node:test';import assert from 'node:assert/strict';
import {createMatch,neutral,update} from '../dist/combat.js';
import {fighters} from '../dist/fighters.js';
const step=(m,a={},b={},n=1)=>{for(let j=0;j<n;j++)update(m,[{...neutral(),...a},{...neutral(),...b}]);};
const start=m=>{step(m,{z:-1,attack:true});step(m);assert.equal(m.players[0].move.kind,'technique');};
test('all six third signatures resolve once and have distinct behavior',()=>{
 for(let id=0;id<6;id++){
  const m=createMatch(id,0);m.players[1].x=-2;start(m);
  const move={...m.players[0].move};step(m,{}, {},move.startup-1);assert.equal(m.players[1].hp,100);
  step(m,{}, {},move.active+40);
  assert.ok(Math.abs(m.players[1].hp-(100-move.damage*fighters[id].power))<1e-6, fighters[id].id);
  assert.equal(m.players[0].stocks,1);
 }
});
test('rushing technique advances gradually along locked aim and can miss a sidestep',()=>{
 const m=createMatch(0,1);m.players[1].x=0;start(m);step(m,{}, {},m.players[0].move.startup);
 const x=m.players[0].x;assert.ok(x>-4&&x<-3.7);
 m.players[1].z=4;step(m,{}, {},40);assert.equal(m.players[1].hp,100);assert.ok(m.players[0].x>x);assert.ok(Math.abs(m.players[0].z)<.2);
});
test('rising technique launches, while radial sword slash catches a target behind',()=>{
 const m=createMatch(2,1);m.players[1].x=-2;start(m);step(m,{}, {},m.players[0].move.startup+2);assert.ok(m.players[1].air>0);
 const n=createMatch(1,0);start(n);n.players[1].x=-6;step(n,{}, {},n.players[0].move.startup);assert.ok(n.players[1].hp<100);
});
test('sphere intercepts ordinary shots only during active frames and cannot stop captures',()=>{
 const m=createMatch(4,0);start(m);step(m,{}, {},m.players[0].move.startup);
 const shot=kind=>({x:m.players[0].x+1,z:m.players[0].z,dx:-4,dz:0,life:2,owner:1,damage:7,kind,radius:.4});
 m.projectiles.push(shot('bolt'));step(m);assert.equal(m.projectiles.length,0);assert.equal(m.players[0].hp,100);
 m.projectiles.push({...shot('capture'),x:m.players[0].x+.2});step(m);assert.equal(m.cinematic.kind,'capture');
 const n=createMatch(4,0);start(n);n.projectiles.push({x:-3.8,z:0,dx:-4,dz:0,life:2,owner:1,damage:7,kind:'bolt',radius:.4});step(n);
 assert.equal(n.players[0].hp,93);assert.equal(n.players[0].move,null);
});
test('held guard blocks active techniques and a parry cancels their remaining active frames',()=>{
 const m=createMatch(0,1);m.players[1].x=-2;step(m,{}, {guard:true},20);
 step(m,{z:-1,attack:true},{guard:true});step(m,{}, {guard:true});step(m,{}, {guard:true},60);
 assert.ok(Math.abs(m.players[1].hp-98.56)<1e-6);
 const n=createMatch(1,0);n.players[1].x=-2;start(n);step(n,{}, {},n.players[0].move.startup-1);step(n,{}, {guard:true});
 assert.equal(n.players[1].hp,100);assert.equal(n.players[0].move,null);step(n,{}, {},30);assert.equal(n.players[1].hp,100);
});
