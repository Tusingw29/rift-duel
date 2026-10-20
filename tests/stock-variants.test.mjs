import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,neutral,update,hit} from '../dist/combat.js';
const step=(m,a={},b={},frames=1)=>{for(let j=0;j<frames;j++)update(m,[{...neutral(),...a},{...neutral(),...b}]);};
const hold=(m,x,frames=20)=>{step(m,{x,attack:true},{},frames);step(m,{x});};

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
test('held variant is opponent relative on either side and works for player two',()=>{
 const m=createMatch(1,0);step(m,{}, {x:-1,attack:true},20);step(m);
 assert.equal(m.players[1].move.kind,'forward');assert.equal(m.players[1].move.empowered,true);assert.equal(m.players[1].stocks,0);
});
test('buffering a held variant retains its cost and cannot bypass recovery',()=>{
 const m=createMatch();hold(m,1,1);
 step(m,{x:1,attack:true},{},28);step(m);
 assert.equal(m.players[0].stocks,1);assert.equal(m.players[0].buffer.empowered,true);
 step(m,{}, {},10);assert.equal(m.players[0].stocks,0);assert.equal(m.players[0].move.empowered,true);
});
