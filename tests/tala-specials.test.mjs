import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,neutral,update} from '../dist/combat.js';
const step=(m,a={},b={},n=1)=>{for(let i=0;i<n;i++)update(m,[{...neutral(),...a},{...neutral(),...b}]);};
function fire(x){const m=createMatch(2,1,'local');step(m,{x,attack:true});step(m,{x});for(let i=0;i<40&&!m.projectiles.length;i++)step(m);return m;}
test('Tala forward special travels from her position without a rushing launch',()=>{
 const m=fire(1),a=m.players[0],b=m.players[1];assert.equal(m.projectiles.length,1);assert.equal(m.projectiles[0].kind,'bolt');assert.ok(a.x<-3.5);assert.equal(b.hp,100);assert.equal(a.stocks,1);
 step(m,{}, {},60);assert.ok(Math.abs(b.hp-89.8)<1e-6);assert.equal(b.air,0);assert.equal(b.launched,false);
});
test('Tala retreating discus has ring geometry and prolonged clean-hit stun',()=>{
 const m=fire(-1);assert.equal(m.projectiles[0].kind,'wheel');assert.ok(m.players[0].x<-5);assert.equal(m.players[0].stocks,1);
 for(let i=0;i<100&&m.players[1].hp===100;i++)step(m);
 assert.ok(Math.abs(m.players[1].hp-89.8)<1e-6);assert.ok(m.players[1].stun>=.63);
});
test('held guard blocks discus stun while fresh guard reflects it',()=>{
 const m=fire(-1);step(m,{}, {guard:true},90);assert.ok(m.players[1].hp>98);assert.equal(m.players[1].stun,0);
 const n=fire(-1),p=n.projectiles[0];p.x=n.players[1].x-.5;p.z=0;
 step(n,{}, {guard:true});assert.equal(p.owner,1);assert.ok(p.dx<0);assert.equal(n.players[1].hp,100);assert.equal(n.players[1].stun,0);
});
test('sidestepping avoids both base projectiles',()=>{
 for(const direction of [-1,1]){const m=fire(direction);m.players[1].z=2;step(m,{}, {},160);assert.equal(m.players[1].hp,100);}
});
