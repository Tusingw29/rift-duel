import test from 'node:test';import assert from 'node:assert/strict';
import {createMatch,update,neutral,hit,STEP} from '../dist/combat.js';
import {lineTravel,advanceTravel,travelProgress,CIRCLE_FRAMES,CROSSOVER_FRAMES} from '../dist/combat-travel.js';
const step=(m,a={},b={},count=1)=>{for(let j=0;j<count;j++)update(m,[{...neutral(),...a},{...neutral(),...b}]);};
const close=()=>{const m=createMatch(0,1,'training');m.players[0].x=0;m.players[1].x=2;return m;};
function contact(m){step(m,{attack:true});step(m);while(!m.hitstop)step(m);}
test('jump squat stays grounded for four frames, launches once, and can be interrupted',()=>{
 const m=createMatch(),p=m.players[0];step(m,{z:-1});step(m);step(m,{z:-1,guard:true});
 for(let frame=0;frame<4;frame++){assert.equal(p.jumpSquat.frame,frame);assert.equal(p.air,0);assert.equal(p.guard,false);step(m);}
 assert.equal(p.jumpSquat,null);assert.equal(p.air,.85);step(m);assert.ok(p.air<.85);
 const n=createMatch();step(n,{z:-1});step(n);step(n,{z:-1,guard:true});hit(n,n.players[1],n.players[0],6);step(n,{}, {},5);assert.equal(n.players[0].air,0);assert.equal(n.players[0].jumpSquat,null);
});
test('knockdown has grounded hold then twelve simulation rise frames and guard-ready exit',()=>{
 const m=createMatch(),p=m.players[0];Object.assign(p,{anim:'knockdown',stun:33*STEP,animTime:33*STEP});
 let rises=0,holds=0;
 for(let j=0;j<33;j++){step(m,{},{});if(p.getUp){rises++;assert.equal(p.air,0);assert.ok(p.inv>0);}else if(p.stun>0)holds++;}
 assert.equal(rises,12);assert.equal(holds,20);assert.equal(p.getUp,null);assert.equal(p.stun,0);
 step(m,{guard:true});assert.equal(p.guard,true);
});
test('light contact freezes both players, timers, projectiles and air motion for exactly six raw frames',()=>{
 const m=close();contact(m);assert.equal(m.hitstop,6);
 const snapshot=()=>JSON.stringify({tick:m.tick,time:m.time,players:m.players.map(p=>({x:p.x,z:p.z,air:p.air,airMotion:p.airMotion,stun:p.stun,move:p.move,animTime:p.animTime})),projectiles:m.projectiles});
 const frozen=snapshot();for(let j=0;j<6;j++){step(m);assert.equal(snapshot(),frozen);}
 step(m);assert.equal(m.tick,JSON.parse(frozen).tick+1);
});
test('heavy and finisher contact have ten and twelve frozen frames',()=>{
 for(const [damage,chain,frames] of [[12,1,10],[10,3,12]]){const m=close();m.resolving=true;hit(m,...m.players,damage,'hit',false,{chain});m.resolving=false;assert.equal(m.hitstop,frames);}
});
test('live knockback starts after hitstop, decelerates, and covers half a unit',()=>{
 const m=close();const p=m.players[1],start=p.x;contact(m);assert.equal(p.x,start);
 step(m,{}, {},6);const deltas=[];for(let j=0;j<8;j++){const x=p.x;step(m);deltas.push(p.x-x);}
 assert.ok(deltas[0]>.15);for(let j=1;j<8;j++)assert.ok(deltas[j]<deltas[j-1]);assert.ok(Math.abs(p.x-start-.5)<1e-8);assert.equal(p.knockback,null);
});
test('released chain input during hitstop fires on the first advancing frame, once',()=>{
 const m=close();contact(m);step(m,{attack:true});step(m);assert.equal(m.players[0].move.chain,1);step(m,{}, {},4);step(m);
 assert.equal(m.players[0].move.chain,2);assert.equal(m.players[0].move.frame,0);assert.equal(m.players[0].pendingInput,null);
});
test('six-frame pending input retains direction, rejects stale input and never repeats',()=>{
 for(const wait of [8,9]){const m=createMatch(),p=m.players[0];p.stun=wait*STEP;p.anim='hurt';step(m,{x:1,attack:true});step(m,{}, {},wait);
  assert.equal(p.move?.kind,wait===8?'forward':undefined);if(wait===8){assert.equal(p.pendingInput,null);step(m,{}, {},60);assert.equal(p.move,null);}
 }
});
test('pending guard at wakeup protects on the first actionable frame',()=>{
 const m=createMatch(),p=m.players[0];Object.assign(p,{anim:'knockdown',stun:4*STEP,animTime:4*STEP});step(m,{guard:true});step(m,{}, {},3);assert.equal(p.getUp,null);assert.equal(p.guard,true);
});
test('circle and crossover accept attack/guard only during their last five travel frames',()=>{
 for(const kind of ['circle','crossover'])for(const guard of [false,true]){
  const m=close(),p=m.players[0];step(m,{[kind]:true});const path=()=>p.travel||p.move?.travel;
  while(path().frames-path().frame>5)step(m);
  step(m,guard?{guard:true}:{attack:true});assert.equal(p.travel,null);
  if(guard){assert.equal(p.move,null);assert.equal(p.guard,true);}else{assert.equal(p.move.kind,'strike');assert.equal(p.move.frame,0);}
 }
});
test('burst/brake curve advances seventy percent by 35%, exposes speed and stays bounded',()=>{
 assert.equal(CIRCLE_FRAMES,24);assert.equal(CROSSOVER_FRAMES,18);assert.ok(Math.abs(travelProgress(.35)-.7)<.01);
 const p={x:0,z:0},path=lineTravel(p,1,0,3,24),deltas=[];
 for(let j=0;j<24;j++){advanceTravel(p,path);deltas.push(path.delta);assert.ok(path.delta<.65);assert.ok(Number.isFinite(path.speed));}
 assert.ok(Math.abs(p.x-3)<1e-8);assert.ok(deltas[0]>deltas.at(-1)*10);
});
test('directional attack cancels travel, while the separate capture shortcut stays locked',()=>{
 for(const slot of [0,1]){
  const m=close(),p=m.players[slot],tick=i=>update(m,m.players.map((_,n)=>({...neutral(),...(n===slot?i:{})})));
  tick({circle:true});while(p.travel.frames-p.travel.frame>5)tick({});tick({z:1,attack:true});
  assert.equal(p.travel,null);assert.equal(p.move.kind,'capture');
 }
});
test('pending input during a heavy freeze expires outside the last six frames',()=>{
 const m=close();m.hitstop=12;step(m,{pursuit:true});step(m,{}, {},12);assert.equal(m.players[0].move,null);
 m.hitstop=12;step(m,{}, {},7);step(m,{pursuit:true});step(m,{}, {},5);assert.equal(m.players[0].move.kind,'pursuit');
});
test('a knockout releases impact freeze so the round ceremony can animate',()=>{
 const m=close();m.mode='duel';m.players[1].hp=1;step(m,{attack:true});step(m);for(let j=0;j<8;j++)step(m);
 assert.equal(m.phase,'over');assert.equal(m.hitstop,0);assert.equal(m.frozen,false);
});
