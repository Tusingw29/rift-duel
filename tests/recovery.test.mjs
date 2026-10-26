import test from 'node:test';import assert from 'node:assert/strict';
import {createMatch,update,neutral,hit} from '../dist/combat.js';
const step=(m,a={},b={},n=1)=>{for(let i=0;i<n;i++)update(m,[{...neutral(),...a},{...neutral(),...b}]);};
const grounded=()=>{const m=createMatch();hit(m,m.players[1],m.players[0],8,'hit',true);step(m,{}, {},70);assert.equal(m.players[0].anim,'knockdown');return m;};
test('unrecovered launch lands in knockdown, then returns to standing',()=>{
 const m=grounded();assert.equal(m.players[0].air,0);assert.ok(m.players[0].stun>0);
 step(m,{}, {},50);assert.equal(m.players[0].stun,0);assert.equal(m.players[0].anim,'idle');
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
 const m=createMatch();hit(m,m.players[1],m.players[0],8,'hit',true);step(m,{z:1},{},73);assert.equal(m.players[0].roll,null);
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
test('roll direction follows the opponent for either slot, swapped sides and depth alignment',()=>{
 for(const slot of [0,1])for(const [dx,dz] of [[1,0],[-1,0],[0,1],[0,-1]])for(const key of ['x','z']){
  const m=createMatch(),p=m.players[slot],r=m.players[1-slot];Object.assign(p,{x:0,z:0,anim:'knockdown',stun:.5});r.x=dx*4;r.z=dz*4;
  const inputs=[neutral(),neutral()];inputs[slot][key]=1;update(m,inputs);
  const expected=key==='x'?[dx,dz]:[-dz,dx];assert.ok(p.x*expected[0]+p.z*expected[1]>0);assert.ok(p.roll);
 }
});
test('fresh guard rises with a brief safe start and vulnerable finish; held guard does not repeat',()=>{
 const m=grounded(),p=m.players[0];step(m,{guard:true});assert.equal(p.anim,'getUp');assert.ok(p.inv>0);assert.equal(p.guard,false);
 step(m,{guard:true},{},7);assert.equal(p.inv,0);assert.ok(p.stun>0);
 step(m,{guard:true},{},21);assert.equal(p.stun,0);step(m,{guard:true});assert.equal(p.guard,true);
 const n=grounded();n.players[0].prev.guard=true;step(n,{guard:true});assert.equal(n.players[0].anim,'knockdown');
});
test('late wake-up attack waits for the full rise and buffers only the final six frames',()=>{
 const m=grounded(),p=m.players[0];step(m,{attack:true});step(m);assert.equal(p.move,null);
 while(p.stun>6/60+1e-9)step(m);
 step(m,{attack:true});step(m);assert.equal(p.move,null);assert.ok(p.stun>0);
 while(p.stun>0)step(m);
 assert.ok(p.move);assert.equal(p.getUp,null);
 const n=grounded();step(n,{attack:true},{},40);assert.equal(n.players[0].move,null);
});
