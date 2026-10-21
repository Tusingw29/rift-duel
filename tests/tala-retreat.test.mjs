import test from 'node:test';import assert from 'node:assert/strict';
import {createMatch,update,neutral,hit} from '../dist/combat.js';
import {RETREAT_DISTANCE} from '../dist/retreat-motion.js';
const step=(m,i={})=>update(m,[{...neutral(),...i},neutral()]);
const start=()=>{const m=createMatch(2,1);step(m,{x:-1,attack:true});step(m);return m;};
test('Tala disc retreat travels over wind-up and fires once from the final position',()=>{
 const m=start(),a=m.players[0],origin=a.x;let moving=0,largest=0;
 assert.equal(a.move.kind,'back');assert.ok(a.move.retreatTravel);
 while(a.move.frame<a.move.startup){const before=a.x;step(m);const delta=before-a.x;if(delta>0)moving++;largest=Math.max(largest,delta);}
 assert.ok(moving>=8);assert.ok(largest<.21);assert.ok(Math.abs(origin-a.x-RETREAT_DISTANCE)<1e-9);
 assert.equal(m.projectiles.length,1);assert.equal(m.projectiles[0].kind,'wheel');
 const landed=a.x;for(let f=0;f<30;f++)step(m);assert.equal(a.x,landed);
});
test('interrupted retreat stops travelling and wall-clamped retreat stays bounded',()=>{
 const m=start(),a=m.players[0];for(let f=0;f<7;f++)step(m);hit(m,m.players[1],a,5);const after=a.x;
 for(let f=0;f<20;f++)step(m);assert.equal(a.x,after);assert.equal(m.projectiles.length,0);
 const wall=start();wall.players[0].x=-10.8;for(let f=0;f<14;f++)step(wall);assert.equal(wall.players[0].x,-11);
});
