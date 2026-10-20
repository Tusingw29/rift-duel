import test from 'node:test';import assert from 'node:assert/strict';
import {createMatch,update,neutral,hit} from '../dist/combat.js';
const step=(m,a={},b={},n=1)=>{for(let i=0;i<n;i++)update(m,[{...neutral(),...a},{...neutral(),...b}]);};
const close=(a=0,b=1)=>{const m=createMatch(a,b);m.players[1].x=-2;return m;};
const tap=(m,a=true,b=false)=>{step(m,{attack:a},{attack:b});step(m);};
test('strike has eight startup frames, one contact, and recovery before another attack',()=>{
 const m=close();tap(m);assert.equal(m.players[1].hp,100);step(m,{}, {},7);assert.equal(m.players[1].hp,100);
 step(m);assert.equal(m.players[1].hp,94);assert.equal(m.players[0].move.frame,8);
 tap(m);step(m,{}, {},10);assert.equal(m.players[1].hp,94);assert.ok(m.players[0].move);
});
test('leaving range during startup makes a melee strike whiff instead of changing to a shot',()=>{
 const m=close();m.players[1].x=-1.5;tap(m);step(m,{}, {x:1},8);assert.equal(m.players[1].hp,100);assert.equal(m.projectiles.length,0);
});
test('faster melee interrupts the slower fighter before contact',()=>{
 const m=close(2,3);tap(m,true,true);step(m,{}, {},12);assert.equal(m.players[0].hp,100);assert.ok(m.players[1].hp<100);assert.equal(m.players[1].move,null);
});
test('equal startup attacks trade for both player slots',()=>{
 const m=close(0,0);tap(m,true,true);step(m,{}, {},8);assert.equal(m.players[0].hp,94);assert.equal(m.players[1].hp,94);
});
test('a buffered attack starts once recovery finishes, not during it',()=>{
 const m=close();tap(m);step(m,{}, {},20);tap(m);assert.ok(m.players[0].buffer);assert.equal(m.players[1].hp,94);
 step(m,{}, {},5);assert.equal(m.players[0].move?.frame,0);assert.equal(m.players[0].buffer,null);
 step(m,{}, {},8);assert.equal(m.players[1].hp,88);
});
test('attack commitment prevents guarding during startup',()=>{
 const m=close();tap(m);step(m,{guard:true});assert.equal(m.players[0].guard,false);assert.equal(m.players[0].move.kind,'strike');
});
test('interrupting burst wind-up spends the stock but prevents its cinematic',()=>{
 const m=close(0,2);step(m,{super:true},{attack:true});step(m);step(m,{}, {},8);assert.equal(m.players[0].stocks,0);assert.equal(m.players[0].move,null);assert.equal(m.cinematic,null);
});
test('simultaneous bursts clash without a player-one priority cinematic',()=>{
 const m=close();step(m,{super:true},{super:true});step(m,{}, {},22);assert.equal(m.cinematic,null);assert.equal(m.players[0].hp,100);assert.equal(m.players[1].hp,100);assert.ok(m.players.every(p=>p.stocks===0&&p.stun>0));
});

test('held guard remains protective through block stun and repeated impacts',()=>{
 const m=close();step(m,{}, {guard:true},20);hit(m,m.players[0],m.players[1],10);step(m,{}, {guard:true},3);hit(m,m.players[0],m.players[1],10);
 assert.ok(Math.abs(m.players[1].hp-97.6)<.00001);assert.equal(m.players[1].stun,0);assert.ok(m.players[1].blockStun>0);
});
