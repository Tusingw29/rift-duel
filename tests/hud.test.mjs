import test from 'node:test';import assert from 'node:assert/strict';
import {barShatterEvent,gaugeState,gaugeLabel,createTrail,updateTrail,healthClass,TRAIL_DELAY,TRAIL_RATE} from '../dist/hud.js';
import {createMatch,update,neutral,CHARGE_PER_STOCK,MAX_STOCKS,chargeRate} from '../dist/combat.js';
test('power gauge shows filled stocks, the partial charge of the next segment, and charging state',()=>{
 const idle={stocks:1,charge:.9,anim:'idle',hp:100};const g=gaugeState(idle);
 assert.deepEqual(g.segments,[1,.5,0]);assert.equal(g.charging,false);assert.equal(gaugeLabel(g),'1 STOCK');
 const charging=gaugeState({...idle,anim:'charge',hp:35});assert.equal(charging.charging,true);assert.equal(gaugeLabel(charging),`CHARGING ×${chargeRate(35).toFixed(1)}`);assert.ok(charging.rate>1.9);
 const full=gaugeState({stocks:3,charge:1.7,anim:'charge',hp:100});assert.deepEqual(full.segments,[1,1,1]);assert.equal(full.charging,false);assert.equal(gaugeLabel(full),'MAX POWER');
 assert.equal(gaugeLabel(gaugeState({stocks:0,charge:0,anim:'idle',hp:100})),'NO STOCK');assert.deepEqual(gaugeState({stocks:9,charge:-1,anim:'idle',hp:100}).segments,[1,1,1]);
});
test('holding attack fills the gauge faster at low health and stops at three stocks',()=>{
 const m=createMatch();const hold=()=>update(m,[{...neutral(),attack:true},neutral()]);
 let frames=0;while(m.players[0].stocks<2&&frames<400){hold();frames++;}assert.ok(frames>60&&frames<140,'about two seconds at full health: '+frames);
 const n=createMatch();n.players[0].hp=20;let fast=0;while(n.players[0].stocks<2&&fast<400){update(n,[{...neutral(),attack:true},neutral()]);fast++;}assert.ok(fast<frames*.6,'low health charges faster: '+fast);
 for(let i=0;i<1200;i++)hold();assert.equal(m.players[0].stocks,MAX_STOCKS);assert.equal(m.players[0].charge,0,'no overflow past the last stock');
 assert.equal(CHARGE_PER_STOCK,1.8);
});
test('life bar trail holds after damage, then drains to the live value, and resets on healing',()=>{
 const t=createTrail(100);updateTrail(t,70,1/60);assert.equal(t.trail,100);assert.equal(t.delay>0,true);
 let elapsed=0;while(t.delay>0){updateTrail(t,70,1/60);elapsed+=1/60;}assert.ok(Math.abs(elapsed-TRAIL_DELAY)<.05);assert.equal(t.trail,100);
 updateTrail(t,70,.01);assert.ok(Math.abs(t.trail-(100-TRAIL_RATE*.01))<1e-9);
 for(let i=0;i<120;i++)updateTrail(t,70,1/60);assert.equal(t.trail,70);
 updateTrail(t,60,1/60);updateTrail(t,100,1/60);assert.equal(t.trail,100,'healing snaps the trail up');
});
test('life bar states warn at low and critical health',()=>{
 assert.equal(healthClass(100),'');assert.equal(healthClass(29),'low');assert.equal(healthClass(11),'critical');assert.equal(healthClass(0),'empty');
});
import {gemStates,shardPlan} from '../dist/hud.js';
test('stocks appear as gems: lit when full, the next gem fills while charging',()=>{
 const gems=gemStates(gaugeState({stocks:1,charge:.9,anim:'charge',hp:100}));
 assert.deepEqual(gems.map(g=>g.lit),[true,false,false]);assert.deepEqual(gems.map(g=>g.filling),[false,true,false]);assert.equal(gems[1].fill,.5);
 assert.deepEqual(gemStates(gaugeState({stocks:3,charge:0,anim:'charge',hp:100})).map(g=>g.filling),[false,false,false]);
});
test('shatter shards spread in every direction, deterministically for a seed',()=>{
 const a=shardPlan(12,7,80),b=shardPlan(12,7,80);assert.deepEqual(a,b);assert.equal(a.length,12);
 assert.ok(a.some(s=>s.dx>20)&&a.some(s=>s.dx<-20)&&a.some(s=>s.dy<-20),'shards fly left, right and up');
 for(const s of a){assert.ok(Math.hypot(s.dx,s.dy)<=80*1.2*1.4);assert.ok(s.size>=6&&s.size<=16);assert.ok(s.delay>=0&&s.delay<.08);}
 assert.notDeepEqual(shardPlan(12,8,80),a);
});
import {damageShards} from '../dist/hud.js';
test('each hit breaks off shards along the lost chunk, scaling with damage and flying inward',()=>{
 const small=damageShards(3,'left',1),big=damageShards(14,'left',1);assert.equal(small.length,4);assert.equal(big.length,17);assert.equal(damageShards(90,'left').length,18);
 assert.ok(big.every(s=>s.dx>0),'left gauge shards fly right');assert.ok(damageShards(14,'right',1).every(s=>s.dx<0),'right gauge shards fly left');
 assert.ok(big.every(s=>s.t>0&&s.t<1));assert.ok(big[0].t<big[big.length-1].t);
});

test('the life bar shatters once at zero and reforms when the next round refills it',()=>{
 const t=createTrail();
 assert.equal(barShatterEvent(t,40),null);assert.equal(barShatterEvent(t,0),'shatter');assert.equal(barShatterEvent(t,0),null);
 assert.equal(barShatterEvent(t,100),'reform');assert.equal(barShatterEvent(t,100),null);assert.equal(barShatterEvent(t,0),'shatter');
});
