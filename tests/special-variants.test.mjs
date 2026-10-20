import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,neutral,update,hit} from '../dist/combat.js';
import {specialVariants,canSpecialFollowUp} from '../dist/special-variants.js';
import {fighters} from '../dist/fighters.js';
const step=(m,a={},b={},n=1)=>{for(let j=0;j<n;j++)update(m,[{...neutral(),...a},{...neutral(),...b}]);};
const variant=(m,x)=>{step(m,{x,attack:true});step(m,{x});step(m,{x,attack:true});step(m,{x});};
test('all twelve directional variants select once and retain free-stock rules',()=>{
 for(let id=0;id<6;id++)for(const x of [-1,1]){
  const m=createMatch(id,1);variant(m,x);const move=m.players[0].move;
  assert.equal(move.followup,true);assert.equal(canSpecialFollowUp(move),false);
  const spec=specialVariants[fighters[id].id][x===1?'forward':'back'];assert.equal(move.name,spec.name);
  assert.equal(m.players[0].stocks,1);assert.equal(move.total,move.startup+move.active+move.recovery);
  step(m,{}, {},move.startup+move.active-3);
  assert.equal(m.projectiles.length,(spec.count||0)*(spec.pulses||1),spec.name);
 }
});
test('aligned beam pulses are spaced five frames apart and interruption stops future pulses',()=>{
 const m=createMatch();variant(m,1);const ticks=[];
 for(let j=0;j<40;j++){step(m);if(m.events.some(e=>e.type==='shot'))ticks.push(m.tick);}
 assert.equal(ticks.length,3);assert.equal(ticks[1]-ticks[0],5);assert.equal(ticks[2]-ticks[1],5);
 const n=createMatch();variant(n,1);for(let j=0;j<90&&!n.projectiles.length;j++)step(n);assert.ok(n.projectiles.length);
 hit(n,n.players[1],n.players[0],5);step(n,{}, {},12);assert.equal(n.projectiles.length,1);
});
test('split ground shots miss a stationary center target but catch a sidestep',()=>{
 const m=createMatch(3,1);variant(m,-1);step(m,{}, {},150);assert.equal(m.players[1].hp,100);
 const n=createMatch(3,1);variant(n,-1);for(let j=0;j<90&&!n.projectiles.length;j++)step(n);assert.ok(n.projectiles.length);
 assert.ok(n.projectiles.every(p=>p.low));n.players[1].z=1.3;
 step(n,{}, {},75);assert.ok(n.players[1].hp<100);
});
test('defensive eruption is radial, hits once and remains blockable',()=>{
 const m=createMatch(3,1);m.players[1].x=-2;variant(m,1);step(m,{}, {},70);
 assert.ok(Math.abs(m.players[1].hp-(100-13*fighters[3].power))<1e-6);
 const n=createMatch(3,1);n.players[1].x=-2;step(n,{}, {guard:true},20);
 for(const a of [{x:1,attack:true},{x:1},{x:1,attack:true},{x:1}])step(n,a,{guard:true});
 step(n,{}, {guard:true},70);assert.ok(Math.abs(n.players[1].hp-(100-13*fighters[3].power*.12))<1e-6);
});
test('slow ember knocks down on hit, while blast variant no longer snares',()=>{
 const m=createMatch(4,1);variant(m,1);for(let j=0;j<150&&m.players[1].hp===100;j++)step(m);
 assert.equal(m.players[1].anim,'knockdown');assert.equal(m.players[1].air,0);
 const n=createMatch(5,1);variant(n,-1);for(let j=0;j<90&&!n.projectiles.length;j++)step(n);assert.ok(n.projectiles.length);
 assert.equal(n.projectiles[0].kind,'beam');assert.equal(n.projectiles[0].knockdown,false);
});
test('stock specials cannot be converted into a free alternate after paying their cost',()=>{
 const m=createMatch();step(m,{x:1,attack:true},{},20);step(m,{x:1});assert.equal(m.players[0].stocks,0);
 step(m,{x:1,attack:true});step(m,{x:1});
 assert.equal(m.players[0].move.empowered,true);assert.equal(m.players[0].move.followup,undefined);
});
