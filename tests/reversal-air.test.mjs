import test from 'node:test';import assert from 'node:assert/strict';
import {createMatch,update,hit,neutral,STEP} from '../dist/combat.js';
import {update as simFrame} from './fight-frame.mjs';
import {airlockFromSearch,airlockRemaining} from '../dist/air-recovery-lock.js';
import {fighters} from '../dist/fighters.js';import {REVERSAL_DAMAGE} from '../dist/reversal.js';
import {configuration,matchOptions,createRecording} from '../dist/skill/replay-format.js';
import {replayAll} from '../dist/skill/replay-engine.js';
const tick=(m,d={})=>update(m,[neutral(),{...neutral(),...d}],STEP);
function launched(lock){const m=createMatch(2,3,'training','normal',{airlock:lock});m.players[0].x=0;m.players[1].x=2;hit(m,...m.players,8,'hit',true);return m;}
for(const step of ['', 'linear'])for(let id=0;id<6;id++)test(`reversal returns exact powered damage: ${fighters[id].id}, step=${step||'default'}`,()=>{
 const m=createMatch((id+1)%6,id,'training','normal',{step}),[a,b]=m.players;a.x=0;b.x=1.8;b.guard=true;b.guardTime=.05;b.guardTapTick=m.tick;
 const source={kind:'strike',chain:3,startup:18,frame:18,active:5};
 hit(m,a,b,10,'hit',false,source);assert.equal(b.move.reversal,true);
 if(step)assert.equal(b.move.hitWidth,.7);else assert.equal('hitWidth' in b.move,false);
 for(let n=0;n<8;n++)simFrame(m,[neutral(),neutral()],STEP);
 assert.equal(a.hp,100-REVERSAL_DAMAGE*fighters[id].power);
});
for(const n of [12,20]){
 test(`airlock=${n}: every early tap rejected; first tap after N frames recovers`,()=>{
  for(let age=1;age<=n+1;age++){
   const m=launched(n),b=m.players[1];for(let t=1;t<age;t++)tick(m);
   tick(m,{guard:true});assert.equal(b.anim==='recover',age>n,`age ${age}`);
  }
 });
 test(`airlock=${n}: no held-guard or buffered early-tap escape on unlock`,()=>{
  const m=launched(n),b=m.players[1];for(let t=0;t<n+3;t++)tick(m,{guard:true});assert.notEqual(b.anim,'recover');
  tick(m);tick(m,{guard:true});assert.equal(b.anim,'recover');
 });
 test(`airlock=${n}: hitstop freezes clock and early hitstop tap cannot bypass it`,()=>{
  const m=launched(n);m.hitstop=10;const before=airlockRemaining(m,m.players[1]);for(let t=0;t<10;t++)tick(m,{guard:t===0});
  assert.equal(m.tick,0);assert.equal(airlockRemaining(m,m.players[1]),before);tick(m);assert.notEqual(m.players[1].anim,'recover');
 });
 test(`airlock=${n}: pursuit re-hits don't restart lock; a new launch does`,()=>{
  const m=launched(n),b=m.players[1];for(let t=0;t<5;t++)tick(m);
  const remaining=airlockRemaining(m,b);hit(m,...m.players,4,'hit',true);assert.equal(airlockRemaining(m,b),remaining);
  for(let t=0;t<n;t++)tick(m);assert.equal(airlockRemaining(m,b),0);
  b.air=0;b.launched=false;hit(m,...m.players,4,'hit',true);assert.equal(airlockRemaining(m,b),n+1);
 });
 test(`airlock=${n}: ordinary voluntary jumping recovery is unchanged`,()=>{
  const m=createMatch(2,3,'training','normal',{airlock:n});m.players[1].air=.5;tick(m,{guard:true});assert.equal(m.players[1].anim,'recover');
 });
 test(`airlock=${n}: config and recording replay reconstruct the hidden launch clock`,()=>{
  const build={hash:'airlock-test'},config=configuration('?airlock='+n),m=createMatch(2,3,'training','normal',matchOptions(config));
  const recording=createRecording(build);recording.begin(m,config);
  for(let f=0;f<160;f++){const inputs=[{...neutral(),launch:f===1,x:f<55?1:0},{...neutral(),guard:f%9===0}];recording.tick(inputs);update(m,inputs,STEP);}
  recording.end(m);assert.equal(replayAll(recording.snapshot(),build,{keepFrames:false}).summary.verified,true);
 });
}
test('no airlock leaves first-airborne recovery and match shape unchanged; parser is strict',()=>{
 const m=launched(0);tick(m,{guard:true});assert.equal(m.players[1].anim,'recover');assert.equal('airlock' in m,false);
 for(const value of ['', '?airlock=0','?airlock=13','?airlock=999','?airlock=12.0'])assert.equal(airlockFromSearch(value),0);
 assert.equal(airlockFromSearch('?airlock=12'),12);assert.equal(airlockFromSearch('?airlock=20'),20);
 assert.equal('airlock' in configuration('').switches,false);
});

import {bout} from '../scripts/reversal-air/measure.mjs';
for(let id=0;id<6;id++)test(`${fighters[id].id}: confirmed-launch cancel, lockout, and late recovery tradeoffs`,()=>{
 const other=(id+1)%6;
 assert.equal(bout(id,other,0,'immediate',1).hits,0);
 for(const lock of [12,20]){
  const early=bout(id,other,lock,'immediate',1);assert.equal(early.recoverAge,null);assert.equal(early.hits,3);
  const reaction=bout(id,other,lock,'immediate','react15Unlock');assert.ok(reaction.recoverAge>lock);assert.equal(reaction.hits,lock===12?1:2);
  const late=bout(id,other,lock,'delay24',lock+1);assert.equal(late.hits,0);
 }
});
