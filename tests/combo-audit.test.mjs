import {update} from './fight-frame.mjs';
import test from 'node:test';import assert from 'node:assert/strict';
import {createMatch,neutral} from '../dist/combat.js';import {fighters} from '../dist/fighters.js';
const step=(m,a={},b={},n=1)=>{for(let j=0;j<n;j++)update(m,[{...neutral(),...a},{...neutral(),...b}]);};
const tap=(m,i={})=>{step(m,{...i,attack:true});step(m,i);};
const contact=m=>step(m,{}, {},m.players[0].move.startup-m.players[0].move.frame);
for(let id=0;id<6;id++)test(`${fighters[id].name}: third-hit directions and shortcuts preserve chain, cost and committed aim`,()=>{
 for(const [input,kind] of [[{x:1},'forward'],[{x:-1},'back'],[{z:-1},'technique'],[{z:1},'capture'],[{launch:true},'launch'],[{pursuit:true},'pursuit'],[{super:true},'super']]){
  const m=createMatch(id,id);m.players[0].x=0;m.players[1].x=1.6;
  tap(m);contact(m);tap(m);contact(m);
  if('x'in input||'z'in input)tap(m,input);else step(m,input);
  const p=m.players[0];assert.equal(p.move.kind,kind);assert.equal(p.move.chain,3);assert.equal(p.stocks,kind==='super'?0:1);assert.ok(p.move.aimX>.9);
 }
});
test('clean recovery bonus can begin a normal connected follow-up chain',()=>{
 const m=createMatch(2,0);m.players[0].x=0;m.players[1].x=1.5;m.players[0].counterWindow=.6;
 tap(m);assert.equal(m.players[0].move.counter,true);contact(m);tap(m);assert.equal(m.players[0].move.chain,2);assert.equal(m.players[0].move.counter,undefined);
});
test('close capture can catch a moving rival only if it is still in range at contact',()=>{
 const m=createMatch();m.players[0].x=0;m.players[1].x=1.8;step(m,{capture:true},{z:1});step(m,{}, {z:1},13);assert.equal(m.cinematic?.kind,'capture');
 const n=createMatch();n.players[0].x=0;n.players[1].x=2.9;step(n,{capture:true},{x:-1});step(n,{}, {x:-1},13);assert.equal(n.cinematic,null);assert.equal(n.projectiles[0].kind,'capture');
});
test('confirmed launcher can cancel directly into aerial pursuit; block or miss cannot',()=>{
 for(const defense of ['hit','block','miss']){
  const m=createMatch();m.players[0].x=0;m.players[1].x=1.7;if(defense==='block')step(m,{}, {guard:true},20);
  step(m,{launch:true},{guard:defense==='block'});if(defense==='miss')m.players[1].z=5;
  step(m,{}, {guard:defense==='block'},10);step(m,{pursuit:true});
  assert.equal(!!m.players[0].move?.aerial,defense==='hit');
 }
});
