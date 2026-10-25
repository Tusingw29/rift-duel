import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,update,neutral,hit,captureContext} from '../dist/combat.js';
import {CIRCLE_FRAMES,CROSSOVER_FRAMES} from '../dist/combat-travel.js';
const tick=(m,n=0,input={})=>update(m,m.players.map((_,i)=>({...neutral(),...(i===n?input:{})})));
function setup(n=0,side=1,edge=false){
 const m=createMatch(0,1,'training'),a=m.players[n],b=m.players[1-n];
 a.x=edge?9:0;a.z=edge?5.7:0;b.x=a.x+side*2;b.z=a.z;
 return {m,a,b};
}
function start(m,n,kind){
 if(kind==='circle'){tick(m,n,{x:1,guard:true});return;}
 if(kind==='pursuit'){tick(m,n,{pursuit:true});return;}
 tick(m,n,{z:-1});tick(m,n);tick(m,n,{z:-1,attack:true});tick(m,n);
 assert.equal(m.players[n].move.kind,'jumpAttack');
}
for(const kind of ['circle','pursuit','crossover']){
 test(`${kind}: both slots and sides travel continuously, contact once, and stop`,()=>{
  for(const n of [0,1])for(const side of [-1,1]){
   const {m,a,b}=setup(n,side);start(m,n,kind);
   const startX=a.x,startZ=a.z;let travelled=0,hits=0;
   for(let f=0;f<65;f++){
    const x=a.x,z=a.z;tick(m,n);
    const delta=Math.hypot(a.x-x,a.z-z);travelled+=delta;
    assert.ok(delta<.65,`${kind}: discontinuity ${delta} at ${f}`);
    hits+=m.events.filter(e=>e.type==='hit').length;
   }
   assert.ok(travelled>.3);assert.equal(hits,kind==='circle'?0:1);
   assert.equal(a.move,null);assert.equal(a.travel,null);
   if(kind==='circle'||kind==='crossover')assert.ok((a.x-startX)*side>2);
   else assert.ok(Math.hypot(a.x-startX,a.z-startZ)<1);
  }
 });
 test(`${kind}: interrupting travel cancels the remaining path and damage`,()=>{
  const {m,a,b}=setup();start(m,0,kind);tick(m);a.inv=0;hit(m,b,a,5);
  const x=a.x,z=a.z;for(let f=0;f<60;f++)tick(m);
  assert.equal(a.x,x);assert.equal(a.z,z);assert.equal(b.hp,100);
 });
 test(`${kind}: arena edges stay finite and bounded`,()=>{
  for(const n of [0,1]){
   const {m,a,b}=setup(n,1,true);start(m,n,kind);
   for(let f=0;f<65;f++){tick(m,n);for(const p of [a,b]){assert.ok(Math.abs(p.x)<=11);assert.ok(Math.abs(p.z)<=6);}}
  }
 });
}
test('pursuit damage uses contact position and can miss an evading target',()=>{
 const m=createMatch();tick(m,0,{pursuit:true});const a=m.players[0],b=m.players[1];
 for(let i=0;i<40;i++)tick(m);assert.equal(b.hp,100);assert.ok(Math.abs(a.x+2)<1e-8);
 const near=setup();start(near.m,0,'pursuit');near.b.z=4;
 for(let i=0;i<40;i++)tick(near.m);assert.equal(near.b.hp,100);
});
test('circle-step locks action input, avoids the opponent, and leaves a back capture window',()=>{
 const {m,a,b}=setup();start(m,0,'circle');
 for(let i=1;i<CIRCLE_FRAMES;i++){
  tick(m,0,{capture:true,x:1,guard:true});assert.equal(m.cinematic,null);assert.equal(a.move,null);
  assert.ok(Math.hypot(a.x-b.x,a.z-b.z)>=1.5);
 }
 assert.equal(captureContext(a,b),'back');assert.equal(a.travel,null);
 tick(m);tick(m,0,{capture:true});for(let i=0;i<13;i++)tick(m);
 assert.equal(m.cinematic.context,'back');
});
test('crossover takes off before contact, then lands without a second air timer reset',()=>{
 const {m,a,b}=setup();start(m,0,'crossover');const initialAir=a.air;
 for(let i=1;i<CROSSOVER_FRAMES;i++){tick(m);assert.equal(b.hp,100);assert.ok(a.air<initialAir);}
 tick(m);assert.ok(b.hp<100);assert.ok(a.air<initialAir*.5);
 for(let i=0;i<40;i++)tick(m);assert.equal(a.air,0);
});
test('fresh air recovery cancels crossover travel',()=>{
 const {m,a,b}=setup();start(m,0,'crossover');tick(m);tick(m,0,{guard:true});
 const x=a.x,z=a.z;for(let i=0;i<40;i++)tick(m);
 assert.equal(a.x,x);assert.equal(a.z,z);assert.equal(b.hp,100);
});
