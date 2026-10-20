import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,neutral,update} from '../dist/combat.js';
import {baseSpecials} from '../dist/special-variants.js';
import {fighters} from '../dist/fighters.js';
const step=(m,a={},b={},n=1)=>{for(let i=0;i<n;i++)update(m,[{...neutral(),...a},{...neutral(),...b}]);};
function fire(x){const m=createMatch(4,1,'local');step(m,{x,attack:true});step(m,{x});for(let i=0;i<50&&!m.projectiles.length;i++)step(m);return m;}
function land(m){for(let i=0;i<150&&m.players[1].hp===100;i++)step(m);}
test('all six fighters have explicit forward and retreating base configurations',()=>{
 for(const f of fighters)for(const kind of ['forward','back'])assert.ok(baseSpecials[f.id][kind].description);
});
test('Sol forward fire is one free shot with stun; retreat fire is one free shot with knockdown',()=>{
 for(const x of [-1,1]){const m=fire(x);assert.equal(m.projectiles.length,1);assert.equal(m.projectiles[0].kind,'fire');assert.equal(m.players[0].stocks,1);if(x<0)assert.ok(m.players[0].x<-5);
  land(m);assert.ok(Math.abs(m.players[1].hp-91.4)<1e-6);
  if(x>0){assert.ok(m.players[1].stun>=.58);assert.equal(m.players[1].anim,'hurt');}else{assert.equal(m.players[1].anim,'knockdown');assert.equal(m.players[1].air,0);}
 }
});
test('guard and sidestep prevent the new base effects; timed guard reflects',()=>{
 for(const x of [-1,1]){const m=fire(x);step(m,{}, {guard:true},150);assert.ok(m.players[1].hp>98);assert.notEqual(m.players[1].anim,'knockdown');assert.equal(m.players[1].stun,0);
  const n=fire(x),p=n.projectiles[0];p.x=n.players[1].x-.5;p.z=0;step(n,{}, {guard:true});assert.equal(p.owner,1);assert.equal(n.players[1].hp,100);
  const o=fire(x);o.players[1].z=2;step(o,{}, {},150);assert.equal(o.players[1].hp,100);
 }
});
test('free alternates and paid spread remain separate from Sol base moves',()=>{
 for(const x of [-1,1]){const m=createMatch(4,1,'local');for(const a of [{x,attack:true},{x},{x,attack:true},{x}])step(m,a);assert.equal(m.players[0].move.followup,true);assert.equal(m.players[0].stocks,1);assert.equal(m.players[0].move.special.type,'fire');}
 const m=createMatch(4,1,'local');step(m,{x:-1,attack:true},{},20);step(m,{x:-1});assert.equal(m.players[0].stocks,0);for(let i=0;i<40&&!m.projectiles.length;i++)step(m);assert.equal(m.projectiles.length,5);assert.ok(m.projectiles.every(p=>p.kind==='fire'));
});
