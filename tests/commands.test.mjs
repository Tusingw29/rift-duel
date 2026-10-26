import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,update,neutral,captureContext} from '../dist/combat.js';
const step=(m,a={},b={},n=1)=>{for(let j=0;j<n;j++)update(m,[{...neutral(),...a},{...neutral(),...b}]);};
const contact=(m,a={},b={})=>step(m,a,b,Math.max(...m.players.map(p=>p.move?Math.max(0,p.move.startup-p.move.frame):0)));
const double=(m,d,button='attack')=>{step(m,d);step(m);step(m,{...d,[button]:true});step(m);contact(m);};
test('forward-forward attack pursues; back-back attack consumes stock',()=>{
 const m=createMatch();double(m,{x:1});assert.equal(m.players[0].anim,'pursuit');assert.equal(m.projectiles.length,0);
 const n=createMatch();double(n,{x:-1});assert.equal(n.cinematic.kind,'super');assert.equal(n.players[0].stocks,0);
});
test('retreat command stays relative for the right-side player',()=>{
 const m=createMatch();m.players[0].x=4;m.players[1].x=-4;double(m,{x:-1});assert.equal(m.cinematic.kind,'super');
});
test('down-down attack launches and up-up attack crosses over',()=>{
 const m=createMatch();m.players[1].x=-2;double(m,{z:1});assert.ok(m.players[1].air>0);assert.equal(m.cinematic,null);
 const n=createMatch();n.players[1].x=-2;double(n,{z:-1});assert.equal(n.players[0].anim,'jumpAttack');assert.ok(n.players[0].x>n.players[1].x);assert.ok(n.players[1].turnDelay>0);
});
test('up-up guard jumps and fresh airborne guard recovers',()=>{
 const m=createMatch();double(m,{z:-1},'guard');assert.equal(m.players[0].air,0);assert.ok(m.players[0].jumpSquat);step(m,{}, {},3);assert.ok(m.players[0].air>0);assert.equal(m.players[0].guard,false);
 step(m);m.players[0].stun=.7;step(m,{guard:true});assert.equal(m.players[0].stun,0);assert.ok(m.players[0].air<.2);assert.ok(m.players[0].inv>0);
});
test('holding a direction never counts as double tap',()=>{
 const m=createMatch();step(m,{x:-1},{},10);step(m,{x:-1,attack:true});step(m,{x:-1});contact(m);assert.equal(m.cinematic,null);assert.equal(m.players[0].stocks,1);assert.equal(m.projectiles[0].kind,'lightning');
});
test('expired double tap falls back to basic attack',()=>{
 const m=createMatch();step(m,{x:-1});step(m);step(m,{x:-1});step(m,{}, {},20);step(m,{attack:true});step(m);contact(m);assert.equal(m.cinematic,null);assert.equal(m.projectiles[0].kind,'bolt');
});
test('attack snapshots direction before both keys are released',()=>{
 const m=createMatch();step(m,{z:1,attack:true});step(m);contact(m);assert.equal(m.projectiles[0].kind,'capture');
});
test('forward guard enables a back capture before the rival turns',()=>{
 const m=createMatch();m.players[1].x=-2;step(m,{x:1,guard:true});step(m,{}, {},24);
 assert.equal(captureContext(m.players[0],m.players[1]),'back');step(m,{capture:true});contact(m);assert.equal(m.cinematic.context,'back');assert.equal(m.cinematic.damage,18);
});
test('front, middle and far captures retain their context at launch',()=>{
 for(const [x,context] of [[-2,'front'],[0,'mid'],[4,'far']]){
  const m=createMatch();m.players[1].x=x;step(m,{capture:true});contact(m);
  if(context==='front')assert.equal(m.cinematic.context,context);
  else{assert.equal(m.projectiles[0].context,context);for(let i=0;i<100&&!m.cinematic;i++)step(m);assert.equal(m.cinematic.context,context);}
 }
});
test('simultaneous fresh guard breaks capture for either player slot',()=>{
 for(const attacker of [0,1]){const m=createMatch();m.players[1].x=-2;step(m,attacker===0?{capture:true}:{},attacker===1?{capture:true}:{});step(m,{}, {},12);step(m,attacker===1?{guard:true}:{},attacker===0?{guard:true}:{});assert.equal(m.cinematic,null);assert.ok(m.players[attacker].stun>0);}
});
test('capture choreography stays finite and distinguishes all four contexts',async()=>{
 const {capturePose}=await import('../dist/choreography.js');
 const a={x:-4,z:1},b={x:4,z:-1},poses=[];
 for(const context of ['front','back','mid','far']){
  for(let i=0;i<=60;i++){const pose=capturePose({t:i/60,duration:1,context},a,b);for(const part of [pose.actor,pose.victim,pose.focus])for(const key of ['x','y','z'])assert.ok(Number.isFinite(part[key]));}
  poses.push(capturePose({t:.5,duration:1,context},a,b));
 }
 assert.equal(new Set(poses.map(p=>JSON.stringify(p))).size,4);
 assert.ok(poses[2].actor.x>a.x);assert.ok(poses[3].victim.y>poses[0].victim.y);
});
