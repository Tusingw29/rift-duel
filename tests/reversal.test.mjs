import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,update,neutral,hit} from '../dist/combat.js';
import {fighters} from '../dist/fighters.js';
import {canChain} from '../dist/moves.js';
import {reversalEligible,reversalPrompt,REVERSAL_WINDOW,REVERSAL_STARTUP,REVERSAL_DAMAGE} from '../dist/reversal.js';
const tick=(s,attack={},defend={guard:true})=>update(s.m,s.m.players.map((_,n)=>({...neutral(),...(n===s.n?attack:defend)})));
function third(id=0,n=0,side=1){
 const m=createMatch(id,id,'training'),a=m.players[n],b=m.players[1-n],s={m,a,b,n};a.x=0;b.x=1.7*side;
 for(let i=0;i<12;i++)tick(s);
 for(let chain=1;chain<=3;chain++){
  tick(s,{attack:true});tick(s);
  assert.equal(a.move.chain,chain);
  if(chain<3)while(a.move.frame<a.move.startup)tick(s);
 }
 return s;
}
function reverse(s){while(s.a.move.frame<s.a.move.startup-2)tick(s);tick(s,{},{});tick(s,{}, {guard:true});assert.equal(s.b.move?.reversal,true);}
for(let id=0;id<6;id++)test(`${fighters[id].name}: full guarded chain reverses only its third hit and returns one strike`,()=>{
 const s=third(id),hp=s.b.hp,stocks=s.b.stocks;reverse(s);
 assert.equal(s.b.hp,hp);assert.equal(s.a.move,null);assert.equal(s.b.stocks,stocks);assert.equal(s.b.charge,0);
 assert.ok(s.m.events.some(e=>e.type==='reversal'&&e.player===1));assert.equal(s.m.events.some(e=>e.type==='parry'),false);
 for(let i=1;i<REVERSAL_STARTUP;i++){tick(s);assert.equal(s.a.hp,100);}
 tick(s);assert.equal(s.a.hp,100-REVERSAL_DAMAGE*fighters[id].power);assert.equal(canChain(s.b.move),false);
 const after=s.a.hp;for(let i=0;i<30;i++)tick(s);assert.equal(s.a.hp,after);assert.equal(s.b.move,null);
});
test('reversal is symmetric for both player slots and swapped world sides',()=>{
 for(const n of [0,1])for(const side of [-1,1]){const s=third(2,n,side);reverse(s);for(let i=0;i<6;i++)tick(s);assert.ok(s.a.hp<100);assert.ok(s.b.lookX*side<0);}
});
test('held guard blocks the finisher without starting a reversal',()=>{
 const s=third();const hp=s.b.hp;while(s.a.move.frame<s.a.move.startup)tick(s);
 assert.equal(s.b.move,null);assert.ok(s.b.hp<hp);assert.ok(s.m.events.some(e=>e.type==='block'));
});
test('late guard cannot undo damage or escape the third-hit hitstun',()=>{
 const s=third();while(s.a.move.frame<s.a.move.startup)tick(s,{},{});const hp=s.b.hp;
 assert.ok(hp<98);tick(s,{}, {guard:true});assert.equal(s.b.hp,hp);assert.equal(s.b.move,null);assert.equal(s.b.guard,false);
});
test('six-frame window has explicit boundaries and rejects non-contact or non-basic attacks',()=>{
 const b={guard:true,stun:0,air:0,guardTapTick:100},move={kind:'strike',chain:3,frame:8,startup:8,active:1};
 assert.equal(reversalEligible(b,move,99),false);assert.equal(reversalEligible(b,move,100),true);
 assert.equal(reversalEligible(b,move,100+REVERSAL_WINDOW-1),true);assert.equal(reversalEligible(b,move,100+REVERSAL_WINDOW),false);
 for(const patch of [{chain:1},{chain:2},{kind:'shot'},{kind:'launch'},{kind:'capture'},{kind:'forward'},{reversal:true},{frame:7},{frame:9}])assert.equal(reversalEligible(b,{...move,...patch},100),false);
 for(const patch of [{stun:.1},{air:.1},{guard:false},{staggerState:{}}])assert.equal(reversalEligible({...b,...patch},move,100),false);
});
test('early timing outside reversal window retains ordinary perfect-guard behavior',()=>{
 const s=third();s.b.guardTapTick=s.m.tick-6;s.b.guardTime=.1;
 const source={...s.a.move,frame:s.a.move.startup};hit(s.m,s.a,s.b,10,'hit',false,source);
 assert.equal(s.b.move,null);assert.equal(s.a.stun,.4);assert.ok(s.m.events.some(e=>e.type==='parry'));
});
test('first and second strikes, airborne attackers, and specials do not trigger a return strike',()=>{
 for(const type of ['first','second','air','special','projectile']){
  const s=third();s.b.guardTapTick=s.m.tick;s.b.guardTime=.01;
  const source={...s.a.move,frame:s.a.move.startup};
  if(type==='first')source.chain=1;if(type==='second')source.chain=2;if(type==='air')s.a.air=.4;if(type==='special')source.kind='launch';
  hit(s.m,s.a,s.b,10,type==='projectile'?'bolt':'hit',false,source);
  assert.equal(s.b.move,null);assert.equal(s.m.events.some(e=>e.type==='reversal'),false);assert.equal(s.b.hp,98.56);
 }
});
test('an in-flight projectile stays a reflection even during a third-strike opportunity',()=>{
 const s=third();s.b.guardTime=.01;s.b.prev.guard=false;
 s.m.projectiles.push({owner:s.n,x:s.b.x,z:s.b.z,dx:0,dz:0,life:1,radius:.8,damage:7,kind:'bolt'});
 tick(s);assert.equal(s.m.projectiles[0].owner,1-s.n);assert.equal(s.b.move,null);assert.ok(s.m.events.some(e=>e.type==='parry'));
});
test('fresh re-tap works while blockstun is still holding the guard pose',()=>{
 const s=third(2);while(s.a.move.frame<s.a.move.startup-2)tick(s);
 s.b.blockStun=.12;const time=s.b.guardTime;tick(s,{},{});assert.equal(s.b.guard,true);assert.ok(s.b.guardTime>time);
 tick(s);assert.equal(s.b.move.reversal,true);
});
test('return strike has continuous travel, can whiff and cannot chain',()=>{
 const s=third();reverse(s);s.a.z=5;let prev={x:s.b.x,z:s.b.z};
 for(let i=0;i<25;i++){tick(s);assert.ok(Math.hypot(s.b.x-prev.x,s.b.z-prev.z)<.4);prev={x:s.b.x,z:s.b.z};assert.equal(canChain(s.b.move),false);}
 assert.equal(s.a.hp,100);assert.equal(s.b.move,null);
});
test('a projectile can interrupt the return before its damage frame',()=>{
 const s=third();reverse(s);const hp=s.a.hp;
 s.m.projectiles.push({owner:s.n,x:s.b.x,z:s.b.z,dx:0,dz:0,life:1,radius:1,damage:5,kind:'bolt'});
 tick(s);assert.equal(s.b.move,null);for(let i=0;i<30;i++)tick(s);assert.equal(s.a.hp,hp);
});
test('return strike cannot cause another third-hit reversal',()=>{
 const s=third();reverse(s);s.a.stun=0;s.a.guard=true;s.a.guardTime=.01;s.a.guardTapTick=s.m.tick;
 const move={...s.b.move,frame:s.b.move.startup,chain:3};
 hit(s.m,s.b,s.a,8,'hit',false,move);assert.equal(s.a.move,null);assert.equal(s.b.move,null);assert.equal(s.b.stun,.4);
});
test('training prompts distinguish the attack window and automatic return',()=>{
 const s=third();assert.match(reversalPrompt([s.b,s.a]),/THIRD HIT INCOMING/);assert.match(reversalPrompt([s.a,s.b]),/vulnerable/);
 reverse(s);assert.match(reversalPrompt([s.b,s.a]),/DEFENSIVE REVERSAL/);
});
