import {update} from './fight-frame.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,neutral,hit} from '../dist/combat.js';
import {fighters} from '../dist/fighters.js';
const step=(m,a={},b={},n=1)=>{for(let j=0;j<n;j++)update(m,[{...neutral(),...a},{...neutral(),...b}]);};
const airborne=(id=0)=>{const m=createMatch(id,1);m.players[1].air=.85;m.players[1].launched=true;m.players[1].stun=.82;return m;};
test('aerial pursuit glides before contact and delivers three separated hits for every fighter',()=>{
 for(let id=0;id<6;id++){
  const m=airborne(id);step(m,{pursuit:true});assert.equal(m.players[0].move.aerial,true);
  step(m,{}, {},3);assert.ok(m.players[0].x>-4&&m.players[0].x<2.4);assert.equal(m.players[1].hp,100);
  const impacts=[];
  for(let j=0;j<60;j++){step(m);for(const e of m.events)if(e.type==='hit')impacts.push({tick:m.tick,damage:e.damage});}
  assert.equal(impacts.length,3);
  assert.equal(impacts[1].tick-impacts[0].tick,9);assert.equal(impacts[2].tick-impacts[1].tick,9);
  assert.ok(Math.abs(m.players[1].hp-(100-14*fighters[id].power))<1e-6);
  assert.equal(m.players[0].stocks,1);
 }
});
test('third pursuit hit slams through an airborne rebound before permitting the recovery roll',()=>{
 const m=airborne();step(m,{pursuit:true});step(m,{}, {},25);
 assert.ok(m.players[1].slam);assert.ok(m.players[1].air>0);let impacts=0;for(let i=0;i<20;i++){step(m);impacts+=m.events.filter(e=>e.type==='groundBounce').length;}assert.equal(impacts,1);
 assert.equal(m.players[1].anim,'knockdown');assert.equal(m.players[1].air,0);assert.equal(m.players[1].launched,false);
 step(m,{}, {z:1});assert.equal(m.players[1].anim,'roll');
});
test('fresh airborne guard escapes between hits and holding pursuit cannot reacquire',()=>{
 const m=airborne();step(m,{pursuit:true});step(m,{pursuit:true},{},7);assert.equal(m.players[1].hp,96);
 assert.ok(m.players[1].air>=.35&&m.players[1].air<=.65);
 step(m,{pursuit:true},{guard:true});step(m,{pursuit:true},{},70);
 assert.equal(m.players[1].hp,96);assert.equal(m.players[0].move,null);
});
test('interrupting the attacker removes the remaining pursuit hits',()=>{
 const m=airborne();step(m,{pursuit:true});step(m,{}, {},7);hit(m,m.players[1],m.players[0],5);
 step(m,{}, {},60);assert.equal(m.players[1].hp,96);assert.equal(m.players[0].move,null);
});
test('recovering before contact or leaving the contact area makes pursuit miss',()=>{
 const m=airborne();step(m,{pursuit:true});step(m,{}, {guard:true});step(m,{}, {},60);assert.equal(m.players[1].hp,100);
 const n=airborne();step(n,{pursuit:true});n.players[1].z=4;step(n,{}, {},60);assert.equal(n.players[1].hp,100);
});
test('grounded and out-of-range pursuit remain a single dash instead of an aerial combo',()=>{
 const m=createMatch();step(m,{pursuit:true});assert.equal(m.players[0].move.aerial,undefined);
 const n=airborne();n.players[1].x=6;step(n,{pursuit:true});assert.equal(n.players[0].move.aerial,undefined);
 step(n,{}, {},60);assert.equal(n.players[1].hp,100);
});
