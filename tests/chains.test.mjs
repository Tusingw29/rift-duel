import {update} from './fight-frame.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,neutral} from '../dist/combat.js';
import {canChain} from '../dist/moves.js';
const step=(m,a={},b={},n=1)=>{for(let i=0;i<n;i++)update(m,[{...neutral(),...a},{...neutral(),...b}]);};
const tap=m=>{step(m,{attack:true});step(m);};
const contact=m=>{const p=m.players[0];step(m,{}, {},p.move.startup-p.move.frame);};
const close=()=>{const m=createMatch();m.players[1].x=-2;return m;};
test('three close taps chain through recovery, then require full recovery',()=>{
 const m=close();
 for(let chain=1;chain<=3;chain++){tap(m);assert.equal(m.players[0].move.chain,chain);contact(m);assert.equal(canChain(m.players[0].move),chain<3);}
 assert.equal(m.players[1].hp,78);
 const last=m.players[0].move;tap(m);assert.equal(m.players[0].move,last);
 step(m,{}, {},30);tap(m);assert.equal(m.players[0].move.chain,1);
});
test('a whiff cannot cancel into a chain and late taps start separate attacks',()=>{
 const m=close();tap(m);m.players[1].z=4;contact(m);assert.equal(canChain(m.players[0].move),false);
 const first=m.players[0].move;tap(m);assert.equal(m.players[0].move,first);
 step(m,{}, {},30);m.players[1].z=0;tap(m);contact(m);step(m,{}, {},11);assert.equal(canChain(m.players[0].move),false);
});
test('second strike can cancel into a launcher or capture as chain three',()=>{
 for(const finish of ['launch','capture']){
  const m=close();tap(m);contact(m);tap(m);contact(m);
  step(m,{[finish]:true});assert.equal(m.players[0].move.kind,finish);assert.equal(m.players[0].move.chain,3);
  contact(m);
  if(finish==='launch')assert.ok(m.players[1].air>0);
  else assert.equal(m.cinematic.kind,'capture');
 }
});
test('projectiles chain at release rather than waiting for distant impact',()=>{
 const m=createMatch();m.players[1].x=10;
 for(let chain=1;chain<=3;chain++){tap(m);assert.equal(m.players[0].move.kind,'shot');assert.equal(m.players[0].move.chain,chain);contact(m);}
 assert.equal(m.projectiles.length,3);assert.deepEqual(m.projectiles.map(p=>p.damage),[7,7,9]);
 assert.equal(m.players[1].hp,100);
});
test('held guard blocks chains and a timed parry interrupts the attacker',()=>{
 const m=close();step(m,{}, {guard:true},20);
 const tick=(a={},n=1)=>step(m,a,{guard:true},n);
 for(let chain=1;chain<=3;chain++){tick({attack:true});tick();tick({},m.players[0].move.startup);}
 assert.ok(Math.abs(m.players[1].hp-97.36)<1e-6);
 const p=close();tap(p);step(p,{}, {},7);step(p,{}, {guard:true});
 assert.equal(p.players[0].move,null);assert.equal(p.players[1].hp,100);
});
test('holding attack after contact does not automatically chain',()=>{
 const m=close();tap(m);contact(m);step(m,{attack:true},{},60);
 assert.equal(m.players[1].hp,94);assert.equal(m.players[0].move,null);assert.ok(m.players[0].charge>0);
});
