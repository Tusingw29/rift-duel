import {update} from './fight-frame.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,neutral,hit} from '../dist/combat.js';
import {stockSpecials} from '../dist/stock-specials.js';
import {fighters} from '../dist/fighters.js';
const step=(m,a={},b={},frames=1)=>{for(let j=0;j<frames;j++)update(m,[{...neutral(),...a},{...neutral(),...b}]);};
const hold=(m,x,frames=20)=>{step(m,{x,attack:true},{},frames);step(m,{x});};
const command=kind=>kind==='technique'?{z:-1}:{x:kind==='forward'?1:-1};
test('all eight stock specials consume exactly one stock and emit their configured attacks',()=>{
 let count=0;
 for(let id=0;id<6;id++)for(const [kind,spec] of Object.entries(stockSpecials[fighters[id].id])){
  const m=createMatch(id,1),input=command(kind);step(m,{...input,attack:true},{},20);
  assert.equal(m.players[0].stocks,1);assert.equal(m.players[0].charge,0);
  step(m,input);assert.equal(m.players[0].stocks,0);assert.equal(m.players[0].move.stockSpecial,spec);
  const move=m.players[0].move;let emissions=0;
  for(let j=0;j<move.startup+move.active;j++){step(m);emissions+=m.events.filter(e=>e.type==='shot').length;}
  assert.equal(emissions,spec.pulses||1);assert.equal(m.players[0].stocks,0);
  if(!spec.area)assert.equal(m.projectiles.length,spec.count*(spec.pulses||1));
  count++;
 }
 assert.equal(count,8);
});
test('empty stock and interrupted wind-up are consistent across every fighter',()=>{
 for(let id=0;id<6;id++){
  const kind=Object.keys(stockSpecials[fighters[id].id])[0],input=command(kind),m=createMatch(id,1);
  m.players[0].stocks=0;step(m,{...input,attack:true},{},40);step(m,input);
  assert.equal(m.players[0].move,null);assert.equal(m.players[0].stocks,0);assert.equal(m.players[0].charge,0);
  const n=createMatch(id,1);step(n,{...input,attack:true},{},20);step(n,input);
  hit(n,n.players[1],n.players[0],5);step(n,{}, {},90);
  assert.equal(n.players[0].stocks,0);assert.equal(n.projectiles.length,0);assert.equal(n.players[1].hp,100);
 }
});
test('paid ring stream cannot become a free up-special alternate',()=>{
 const m=createMatch(5,1);step(m,{z:-1,attack:true},{},20);step(m,{z:-1});
 step(m,{z:-1,attack:true});step(m,{z:-1});
 assert.equal(m.players[0].move.empowered,true);assert.equal(m.players[0].move.followup,undefined);
});
test('advancing eruption checks each impact location and can be sidestepped',()=>{
 const m=createMatch(3,1);step(m,{x:1,attack:true},{},20);step(m);m.players[0].x=-4;m.players[1].x=0;
 let impacts=0;for(let j=0;j<65;j++){step(m);impacts+=m.events.filter(e=>e.type==='hit').length;}
 assert.equal(impacts,2);
 const n=createMatch(3,1);step(n,{x:1,attack:true},{},20);step(n);n.players[1].z=4;
 step(n,{}, {},65);assert.equal(n.players[1].hp,100);
});

test('held directional variants spend one stock on release and produce different shot patterns',()=>{
 for(const [id,x,count] of [[0,1,4],[4,-1,5]]){
  const m=createMatch(id,1);hold(m,x);
  const a=m.players[0];assert.equal(a.stocks,0);assert.equal(a.move.empowered,true);assert.equal(a.charge,0);
  step(m,{}, {},a.move.startup);
  assert.equal(m.projectiles.length,count);
  assert.equal(new Set(m.projectiles.map(p=>p.dz)).size,id===0?1:5);
  step(m,{}, {},60);assert.equal(a.stocks,0);
 }
});
test('tap remains a free base special and neutral hold still builds stock',()=>{
 const m=createMatch();hold(m,1,1);assert.equal(m.players[0].stocks,1);assert.equal(m.players[0].move.empowered,false);
 const n=createMatch();step(n,{attack:true},{},130);step(n);assert.equal(n.players[0].stocks,2);assert.equal(n.players[0].move,null);
});
test('empty stock refuses the variant without secretly charging or firing',()=>{
 const m=createMatch();m.players[0].stocks=0;hold(m,1,130);
 assert.equal(m.players[0].stocks,0);assert.equal(m.players[0].charge,0);assert.equal(m.players[0].move,null);assert.equal(m.projectiles.length,0);
 assert.match(m.events[0].text,/without a direction/);
});
test('interrupting startup cancels the volley and does not refund its cost',()=>{
 const m=createMatch();hold(m,1);hit(m,m.players[1],m.players[0],5);
 step(m,{}, {},40);assert.equal(m.players[0].stocks,0);assert.equal(m.projectiles.length,0);
});
test('held variant is lock-on relative on either side and works for player two',()=>{
 const m=createMatch(1,0);step(m,{}, {x:1,attack:true},20);step(m);
 assert.equal(m.players[1].move.kind,'forward');assert.equal(m.players[1].move.empowered,true);assert.equal(m.players[1].stocks,0);
});
test('buffering a held variant retains its cost and cannot bypass recovery',()=>{
 const m=createMatch();hold(m,1,1);
 step(m,{x:1,attack:true},{},30);step(m);
 assert.equal(m.players[0].stocks,1);assert.equal(m.players[0].buffer.empowered,true);
 step(m,{}, {},10);assert.equal(m.players[0].stocks,0);assert.equal(m.players[0].move.empowered,true);
});
