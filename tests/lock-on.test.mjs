import test from 'node:test';import assert from 'node:assert/strict';
import {createMatch,update,neutral,aiInput,STEP} from '../dist/combat.js';
const step=(m,a={},b={},n=1)=>{for(let i=0;i<n;i++)update(m,[{...neutral(),...a},{...neutral(),...b}]);};
test('forward input closes distance from either side and never flips',()=>{
 const m=createMatch();step(m,{x:1},{x:1},30);assert.ok(m.players[0].x>-4);assert.ok(m.players[1].x<4);
 const n=createMatch();n.players[0].x=4;n.players[1].x=-4;step(n,{},{},1);step(n,{x:1},{},30);assert.ok(n.players[0].x<4,'player one on the right still closes with forward');
 const o=createMatch();step(o,{x:-1},{},30);assert.ok(o.players[0].x<-4,'retreat moves away');
});
test('sideways input circles the rival instead of sliding along a fixed axis',()=>{
 const m=createMatch();m.players[0].x=-3;m.players[1].x=3;step(m);const start=Math.hypot(m.players[0].x-m.players[1].x,m.players[0].z);
 step(m,{z:1},{},45);const p=m.players[0];assert.ok(p.z>1.5,'moved around');
 const after=Math.hypot(p.x-m.players[1].x,p.z-m.players[1].z);assert.ok(Math.abs(after-start)<1.2,'distance roughly preserved while circling');
 assert.ok(p.x>-3,'circling bends toward the rival rather than sliding straight');
});
test('relative commands keep meaning after fighters swap sides',()=>{
 const m=createMatch();m.players[0].x=4;m.players[1].x=-2;step(m);
 step(m,{x:1});step(m,{},{},3);step(m,{x:1});step(m,{x:1,attack:true});step(m);assert.ok(m.players[0].move,'double-tap forward then attack registers');assert.equal(m.players[0].move.kind,'pursuit');
});
test('CPU input is relative and all matchups still terminate',()=>{
 for(let id=0;id<6;id++){const m=createMatch(0,id);for(let j=0;j<5500&&m.phase==='fight';j++){const ai=aiInput(m,STEP);assert.ok(Math.abs(ai.x)<=1&&Math.abs(ai.z)<=1);update(m,[neutral(),ai]);}assert.equal(m.phase,'over');}
});
