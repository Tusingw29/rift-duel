import test from 'node:test';import assert from 'node:assert/strict';
import {createMatch,update,neutral,hit} from '../dist/combat.js';
const step=(m,a={},b={},n=1)=>{for(let i=0;i<n;i++)update(m,[{...neutral(),...a},{...neutral(),...b}]);};
const grounded=()=>{const m=createMatch();hit(m,m.players[1],m.players[0],8,'hit',true);step(m,{}, {},52);assert.equal(m.players[0].anim,'knockdown');return m;};
test('unrecovered launch lands in knockdown, then returns to standing',()=>{
 const m=grounded();assert.equal(m.players[0].air,0);assert.ok(m.players[0].stun>0);
 step(m,{}, {},40);assert.equal(m.players[0].stun,0);assert.equal(m.players[0].anim,'idle');
});
test('air recovery avoids the landing knockdown',()=>{
 const m=createMatch();hit(m,m.players[1],m.players[0],8,'hit',true);step(m,{guard:true});step(m,{}, {},60);
 assert.equal(m.players[0].launched,false);assert.equal(m.players[0].stun,0);assert.equal(m.players[0].anim,'idle');
});
test('fresh depth input rolls both ways, travels over time, and locks attacks',()=>{
 for(const direction of [-1,1]){
  const m=grounded(),p=m.players[0];step(m,{z:direction});assert.ok(p.roll);assert.ok(Math.abs(p.z)<.2);
  step(m,{super:true},{},10);assert.equal(m.cinematic,null);assert.equal(p.stocks,1);assert.equal(p.move,null);
  step(m,{}, {},12);assert.equal(p.roll,null);assert.equal(p.stun,0);assert.ok(Math.abs(p.z-direction*2.4)<1e-6);
 }
});
test('held direction does not automatically roll, and arena bounds hold',()=>{
 const m=createMatch();hit(m,m.players[1],m.players[0],8,'hit',true);step(m,{z:1},{},55);assert.equal(m.players[0].roll,null);
 step(m);step(m,{z:1});assert.ok(m.players[0].roll);
 const n=grounded();n.players[0].z=5.8;step(n,{z:1});step(n,{}, {},25);assert.equal(n.players[0].z,6);
});
test('roll avoids hits and capture projectiles during its brief invulnerability',()=>{
 const m=grounded(),p=m.players[0];step(m,{z:1});const hp=p.hp;
 assert.equal(hit(m,m.players[1],p,20),false);
 m.projectiles.push({x:p.x,z:p.z,dx:0,dz:0,owner:1,damage:15,kind:'capture',radius:1,life:1});
 step(m);assert.equal(m.cinematic,null);assert.equal(p.hp,hp);
 m.projectiles=[];step(m,{}, {},13);assert.equal(p.inv,0);assert.equal(hit(m,m.players[1],p,5),true);assert.equal(p.roll,null);
});
