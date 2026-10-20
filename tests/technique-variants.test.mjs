import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,neutral,update,hit} from '../dist/combat.js';
import {canFollowUp} from '../dist/techniques.js';
const step=(m,a={},b={},n=1)=>{for(let j=0;j<n;j++)update(m,[{...neutral(),...a},{...neutral(),...b}]);};
const start=m=>{step(m,{z:-1,attack:true});step(m);};
const extra=m=>{step(m,{attack:true});step(m);};
test('keeping Up held across both attack taps also selects the alternate technique',()=>{
 const m=createMatch(3,0);step(m,{z:-1,attack:true});step(m,{z:-1});
 step(m,{z:-1,attack:true});step(m,{z:-1});
 assert.equal(m.players[0].move.followup,true);
});

test('each fighter can select its alternate up-special once during wind-up without stock cost',()=>{
 for(let id=0;id<6;id++){
  const m=createMatch(id,0);start(m);assert.ok(canFollowUp(m.players[0].move));extra(m);
  const move=m.players[0].move;assert.equal(move.followup,true);assert.equal(m.players[0].stocks,1);
  assert.equal(canFollowUp(move),false);
  const name=move.name;extra(m);assert.equal(m.players[0].move.name,name);
  assert.equal(move.total,move.startup+move.active+move.recovery);
 }
});
test('Aegis and Rei variants deliver two separated hits, not damage on every active frame',()=>{
 for(const id of [0,1]){
  const m=createMatch(id,0);m.players[1].x=-2;start(m);extra(m);
  const damages=[];
  for(let j=0;j<65;j++){step(m);for(const e of m.events)if(e.type==='hit')damages.push(e.damage);}
  assert.equal(damages.length,2);
  assert.ok(damages.every(d=>Math.abs(d-(id===0?8:6.3))<1e-6));
 }
});
test('Tala kick advances without launching; Morrow stops to fire; Vesper spreads three rings',()=>{
 const kick=createMatch(2,0);kick.players[1].x=-1;start(kick);extra(kick);step(kick,{}, {},30);
 assert.ok(kick.players[0].x>-3.2);assert.ok(kick.players[1].hp<100);assert.equal(kick.players[1].air,0);
 for(const id of [3,5]){
  const m=createMatch(id,0);start(m);extra(m);const x=m.players[0].x;
  step(m,{}, {},m.players[0].move.startup-2);
  assert.equal(m.players[0].x,x);assert.equal(m.projectiles.length,id===3?1:3);
  assert.ok(m.projectiles.every(p=>p.kind===(id===3?'beam':'wheel')));
  if(id===5)assert.equal(new Set(m.projectiles.map(p=>p.dz)).size,3);
 }
});
test('expanded Sol ward intercepts at its larger radius',()=>{
 const m=createMatch(4,0);start(m);extra(m);step(m,{}, {},7);
 assert.equal(m.players[0].move.reach,4.2);
 m.projectiles.push({x:-.2,z:0,dx:-1,dz:0,life:2,owner:1,kind:'bolt',damage:7,radius:.4});
 step(m);assert.equal(m.projectiles.length,0);assert.equal(m.players[0].hp,100);
});
test('late taps do not transform an active technique and interrupts remove both planned hits',()=>{
 const m=createMatch(1,0);start(m);step(m,{}, {},10);extra(m);assert.equal(m.players[0].move.followup,undefined);
 const n=createMatch(1,0);n.players[1].x=-2;start(n);extra(n);hit(n,n.players[1],n.players[0],5);
 step(n,{}, {},60);assert.equal(n.players[1].hp,100);assert.equal(n.players[0].move,null);
});
test('timed guard cancels the second strike and held guard chips both contacts',()=>{
 const m=createMatch(1,0);m.players[1].x=-2;start(m);extra(m);step(m,{}, {},7);step(m,{}, {guard:true});
 assert.equal(m.players[0].move,null);step(m,{}, {},40);assert.equal(m.players[1].hp,100);
 const n=createMatch(1,0);n.players[1].x=-2;step(n,{}, {guard:true},20);
 step(n,{z:-1,attack:true},{guard:true});step(n,{}, {guard:true});step(n,{attack:true},{guard:true});step(n,{}, {guard:true},60);
 assert.ok(Math.abs(n.players[1].hp-(100-6.3*.12*2))<1e-6);
});
