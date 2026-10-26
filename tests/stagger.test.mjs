import {update} from './fight-frame.mjs';
import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,neutral,hit,aiInput} from '../dist/combat.js';
import {fighters} from '../dist/fighters.js';
import {STAGGER_LIMIT,STAGGER_RESIST,staggerFeedback,trainingStaggerText} from '../dist/stagger.js';
const step=(m,n=1,input={},count=1)=>{for(let i=0;i<count;i++)update(m,m.players.map((_,p)=>({...neutral(),...(p===n?input:{})})));};
function setup(n=1){const m=createMatch(0,1,'training');const b=m.players[n],a=m.players[1-n];a.x=0;b.x=2;return {m,a,b,n};}
function breakGuard(n=1){const s=setup(n);for(let i=0;i<4;i++)hit(s.m,s.a,s.b,6);assert.ok(s.b.staggerState);return s;}
function recover(s,start=6){step(s.m,s.n,{},start);step(s.m,s.n,{z:-1});step(s.m,s.n,{z:1});step(s.m,s.n,{z:-1});}

test('unblocked grounded damage accumulates; projectiles build at half rate',()=>{
 const {m,a,b}=setup();hit(m,a,b,6);assert.equal(b.stagger,6);hit(m,a,b,6,'bolt');assert.equal(b.stagger,9);
 hit(m,a,b,30);assert.equal(b.stagger,21,'one hit contributes at most twelve');assert.equal(b.staggerState,null);
 hit(m,a,b,3);assert.equal(b.stagger,STAGGER_LIMIT);assert.ok(b.staggerState);assert.equal(b.stun,1.2);
});
test('blocks, perfect guards and invulnerability do not build stagger',()=>{
 for(const guardTime of [.01,1]){const {m,a,b}=setup();b.guard=true;b.guardTime=guardTime;hit(m,a,b,12);assert.equal(b.stagger,0);}
 const {m,a,b}=setup();b.inv=.2;assert.equal(hit(m,a,b,12),false);assert.equal(b.stagger,0);
});
test('buildup decays only after pressure stops and cannot fall below zero',()=>{
 const {m,a,b}=setup();hit(m,a,b,12);step(m,1,{},50);assert.equal(b.stagger,12);
 step(m,1,{},40);assert.ok(b.stagger<6);step(m,1,{},100);assert.equal(b.stagger,0);
});
test('stagger cancels moves and travel and locks guard, movement, charging and attacks',()=>{
 const {m,a,b}=setup();b.move={kind:'strike'};b.travel={kind:'orbit'};b.buffer={kind:'attack'};
 for(let i=0;i<4;i++)hit(m,a,b,6);assert.equal(b.move,null);assert.equal(b.travel,null);assert.equal(b.buffer,null);
 const x=b.x,stocks=b.stocks;step(m,1,{x:1,attack:true,guard:true,super:true,pursuit:true},20);
 assert.equal(b.x,x);assert.equal(b.guard,false);assert.equal(b.stocks,stocks);assert.equal(b.move,null);assert.equal(m.cinematic,null);
 assert.ok(b.staggerState);assert.equal(b.anim,'hurt');assert.ok(b.stun>.8);
});
test('a follow-up hit consumes the stagger instead of renewing it',()=>{
 const {m,a,b}=breakGuard();step(m,1,{},20);hit(m,a,b,6);
 assert.equal(b.staggerState,null);assert.equal(b.stagger,0);assert.equal(b.staggerResist,STAGGER_RESIST);assert.equal(b.stun,.32);
 for(let i=0;i<5;i++)hit(m,a,b,1);assert.equal(b.stagger,0);assert.equal(b.staggerState,null);
});
test('held or repeated same-direction input cannot recover automatically',()=>{
 const s=breakGuard();step(s.m,s.n,{z:1},20);assert.equal(s.b.staggerState.inputs,0,'held before opening never counts');
 step(s.m);step(s.m,s.n,{z:1});assert.equal(s.b.staggerState.inputs,1);
 step(s.m);step(s.m,s.n,{z:1});assert.equal(s.b.staggerState.inputs,1);
});
test('three alternating fresh inputs recover both players regardless of world side',()=>{
 for(const n of [0,1])for(const side of [-1,1]){
  const s=breakGuard(n);s.a.x=side*2;s.b.x=0;recover(s);
  assert.equal(s.b.staggerState,null);assert.ok(s.b.inv>0);assert.ok(s.b.counterWindow>0);assert.equal(s.b.anim,'recover');
  assert.equal(s.b.commands.double,null);assert.equal(s.b.staggerResist,2);
  assert.ok(s.m.events.some(e=>e.text==='CLEAN RECOVERY — COUNTER READY'));
 }
});
test('late manual recovery grants safety but no counter reward',()=>{
 const s=breakGuard();recover(s,40);assert.equal(s.b.staggerState,null);assert.equal(s.b.counterWindow,0);assert.ok(s.b.inv>0);
 assert.ok(s.m.events.some(e=>e.text==='STAGGER RECOVERED'));
});
test('automatic expiry ends the state without requiring input',()=>{
 const s=breakGuard();step(s.m,s.n,{},72);assert.equal(s.b.staggerState,null);assert.equal(s.b.counterWindow,0);assert.ok(s.b.inv>0);
 step(s.m,s.n,{},15);assert.equal(s.b.stun,0);assert.equal(s.b.anim,'idle');
});
test('recovery resists another stagger temporarily but damage still works after invulnerability',()=>{
 const s=breakGuard();recover(s);step(s.m,s.n,{},13);const hp=s.b.hp;
 hit(s.m,s.a,s.b,12);assert.equal(s.b.hp,hp-12);assert.equal(s.b.stagger,0);
 step(s.m,s.n,{},121);hit(s.m,s.a,s.b,6);assert.equal(s.b.stagger,6);
});
test('launches, airborne victims, knockdowns and captures clear rather than build stagger',()=>{
 for(const mode of ['launch','air','knockdown','capture','burst']){
  const {m,a,b}=setup();hit(m,a,b,6);
  if(mode==='air')b.air=.5;if(mode==='knockdown')b.anim='knockdown';
  hit(m,a,b,12,['capture','burst'].includes(mode)?mode:'hit',mode==='launch');
  assert.equal(b.stagger,0);assert.equal(b.staggerState,null);
 }
});
test('knockdown projectiles cannot leave an active grounded stagger',()=>{
 const {m,a,b}=setup();b.stagger=23;
 m.projectiles.push({x:b.x,z:b.z,dx:0,dz:0,owner:0,damage:8,kind:'bolt',radius:1,life:1,knockdown:true});
 step(m);assert.equal(b.anim,'knockdown');assert.equal(b.staggerState,null);
});
test('stagger pursuit extends its approach and lands one stronger knockdown',()=>{
 for(const n of [0,1]){
  const {m,a,b}=breakGuard(n);a.x=0;b.x=4.5;
  step(m,1-n,{pursuit:true});assert.equal(a.move.staggerPursuit,true);assert.equal(a.move.startup,12);
  const hp=b.hp;step(m,1-n,{},11);assert.equal(b.hp,hp);step(m,1-n);
  assert.equal(b.hp,hp-12*fighters[a.id].power);assert.equal(b.anim,'knockdown');assert.equal(b.staggerState,null);assert.equal(a.stocks,1);
  const after=b.hp;step(m,1-n,{},30);assert.equal(b.hp,after);
 }
});
test('recovering before pursuit contact escapes the punish; no retroactive bonus',()=>{
 const s=breakGuard();s.a.x=0;s.b.x=4.5;step(s.m,0,{pursuit:true});recover(s);
 const hp=s.b.hp;step(s.m,0,{},15);assert.equal(s.b.hp,hp);
 const {m,a,b}=setup();step(m,0,{pursuit:true});b.stagger=23;hit(m,a,b,1);const before=b.hp;
 step(m,0,{},7);assert.equal(b.hp,before-7);assert.notEqual(b.anim,'knockdown');
});
test('clean recovery upgrades only the next close strike',()=>{
 const s=breakGuard(0);recover(s);step(s.m,0,{},9);s.b.x=0;s.a.x=2;
 step(s.m,0,{attack:true});step(s.m,0);assert.equal(s.b.move.kind,'strike');assert.equal(s.b.move.counter,true);assert.equal(s.b.counterWindow,0);
 const hp=s.a.hp;step(s.m,0,{},8);assert.equal(s.a.hp,hp-8);
 step(s.m,0,{attack:true});step(s.m,0);assert.equal(s.b.move.counter,undefined);
});
test('round creation and training health refill reset all stagger state',()=>{
 const s=breakGuard();s.b.hp=14;step(s.m);assert.equal(s.b.hp,100);assert.equal(s.b.staggerState,null);assert.equal(s.b.staggerResist,0);assert.equal(s.b.counterWindow,0);
 for(const p of createMatch().players){assert.equal(p.stagger,0);assert.equal(p.staggerState,null);}
});
test('cinematics freeze recovery clocks and round-over stops advancement',()=>{
 const s=breakGuard();s.m.cinematic={a:0,b:1,t:0,duration:5,kind:'capture',damage:10};const before=JSON.stringify(s.b.staggerState);
 step(s.m,1,{z:1},10);assert.equal(JSON.stringify(s.b.staggerState),before);
 s.m.phase='over';step(s.m,1,{z:-1},10);assert.equal(JSON.stringify(s.b.staggerState),before);
});
test('CPU participates in recovery on every difficulty without instant escape',()=>{
 for(const difficulty of ['easy','normal','hard']){
  const s=breakGuard();s.m.difficulty=difficulty;let frames=0;
  while(s.b.staggerState&&frames<80){update(s.m,[neutral(),aiInput(s.m,1/60)]);frames++;}
  assert.ok(frames>=18&&frames<60,`${difficulty}: ${frames}`);assert.ok(s.b.inv>0);
 }
});
test('HUD and training feedback distinguish buildup, opening, recovery and resistance',()=>{
 const {m,a,b}=setup();assert.equal(staggerFeedback(b).label,'STAGGER 0%');hit(m,a,b,12);assert.equal(staggerFeedback(b).fill,.5);
 hit(m,a,b,12);assert.equal(staggerFeedback(b).state,'broken');assert.match(trainingStaggerText(m.players),/OPENING/);
 assert.match(trainingStaggerText([b,a]),/RECOVER/);recover({m,a,b,n:1});assert.equal(staggerFeedback(b).state,'counter');
 step(m,1,{},40);assert.equal(staggerFeedback(b).state,'resist');
});
test('capture consumes the opening when the cinematic begins',()=>{
 const {m,a,b}=breakGuard();a.x=0;b.x=2;step(m,0,{capture:true});step(m,0,{},13);
 assert.equal(m.cinematic.kind,'capture');assert.equal(b.staggerState,null);assert.equal(b.stagger,0);
});
test('a blocked counter consumes its reward without bonus damage through guard',()=>{
 const s=breakGuard(0);recover(s);step(s.m,0,{},9);s.b.x=0;s.a.x=2;
 step(s.m,0,{attack:true});step(s.m,0);const hp=s.a.hp;
 for(let i=0;i<8;i++)update(s.m,[neutral(),{...neutral(),guard:true}]);
 assert.equal(s.a.hp,hp);assert.equal(s.b.counterWindow,0);assert.equal(s.b.move,null);
});
import {createKeyboardInput} from '../dist/keyboard-input.js';
import {readPad} from '../dist/options.js';
const relative=i=>({...i,x:-i.z,z:i.x});
test('default keyboard and controller left/right map to the same stagger escape for both slots',()=>{
 for(const n of [0,1])for(const device of ['keyboard','pad']){
  const s=breakGuard(n);step(s.m,n,{},6);const keys=createKeyboardInput();
  const codes=n===0?['KeyA','KeyD','KeyA']:['ArrowLeft','ArrowRight','ArrowLeft'];
  for(let j=0;j<3;j++){
   let input;
   if(device==='keyboard'){if(j)keys.delete(codes[j-1]);keys.add(codes[j]);while(keys.pending(n)>1)keys.read(n);input=relative(keys.read(n));}
   else input=relative(readPad({axes:[j%2?1:-1,0],buttons:[]}));
   step(s.m,n,input);
  }
  assert.equal(s.b.staggerState,null);assert.ok(s.b.counterWindow>0);
 }
});
test('a new hit removes an unused clean-recovery counter reward',()=>{
 const s=breakGuard();recover(s);step(s.m,s.n,{},13);assert.ok(s.b.counterWindow>0);
 hit(s.m,s.a,s.b,1);assert.equal(s.b.counterWindow,0);
});
