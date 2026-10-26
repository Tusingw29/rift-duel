import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,update,neutral,hit,STEP,GET_UP_FRAMES,JUMP_SQUAT_FRAMES} from '../dist/combat.js';
import {moveTiming,canChain,chainCancelFrame} from '../dist/moves.js';
import {fighters} from '../dist/fighters.js';
const step=(m,a={},b={})=>update(m,[{...neutral(),...a},{...neutral(),...b}]);
const advance=(m,predicate,limit=240)=>{while(!predicate()&&limit-->0)step(m);assert.ok(limit>=0,'state reached within its budget');};
test('all six melee chains have the requested startup, active and recovery budgets',()=>{
 for(const f of fighters)for(const [chain,start,active,recovery,total] of [[1,[9,11],3,[16,20],[28,34]],[2,[13,16],4,[22,26],[39,46]],[3,[18,24],5,[26,34],[48,64]]]){
  const t=moveTiming(f,'strike',chain);assert.ok(t.startup>=start[0]&&t.startup<=start[1]);assert.equal(t.active,active);assert.ok(t.recovery>=recovery[0]&&t.recovery<=recovery[1]);assert.ok(t.total>=total[0]&&t.total<=total[1]);
 }
 for(const f of fighters)for(const kind of ['launch','forward','back','super']){const t=moveTiming(f,kind);assert.ok(t.startup>=18&&t.startup<=24);assert.ok(t.active>=4&&t.active<=6);assert.ok(t.recovery>=26&&t.recovery<=34);assert.ok(t.total>=48&&t.total<=64);}
});
test('connected melee chains open exactly at 14/20, while whiffs and finishers remain committed',()=>{
 for(const f of fighters)for(const chain of [1,2]){
  const t={kind:'strike',chain,...moveTiming(f,'strike',chain),connected:true};const at=chain===1?14:20;
  assert.equal(chainCancelFrame(t),at);assert.equal(canChain({...t,frame:at-1}),false);assert.equal(canChain({...t,frame:at}),true);assert.equal(canChain({...t,frame:at,connected:false}),false);assert.equal(canChain({...t,frame:at,chain:3}),false);
 }
});
test('expanded melee and launcher windows hit once, including held blocks',()=>{
 for(const kind of ['strike','launch'])for(const guard of [false,true]){
  const m=createMatch(0,1);m.players[0].x=0;m.players[1].x=1.6;
  for(let i=0;i<20;i++)step(m,{}, {guard});
  step(m,kind==='strike'?{attack:true}:{launch:true},{guard});step(m,{}, {guard});
  const p=m.players[0],total=p.move.total;let contacts=0;
  for(let i=0;i<total+15;i++){step(m,{}, {guard});contacts+=m.events.filter(e=>['hit','block'].includes(e.type)).length;}
  assert.equal(contacts,1,`${kind} guard=${guard}`);
 }
});
test('a melee whiff can connect on a later active frame but never repeats that contact',()=>{
 const m=createMatch();m.players[1].x=-2;step(m,{attack:true});step(m);const a=m.players[0],b=m.players[1];b.z=4;
 advance(m,()=>a.move.frame===a.move.startup);assert.equal(b.hp,100);b.z=0;step(m);assert.equal(b.hp,94);
 advance(m,()=>!a.move);assert.equal(b.hp,94);
});
test('bounce has six upward, six downward and six grounded settle frames; rise owns 28 frames',()=>{
 assert.equal(GET_UP_FRAMES,28);assert.equal(JUMP_SQUAT_FRAMES,6);
 const m=createMatch(),p=m.players[1];hit(m,m.players[0],p,8,'hit',true);advance(m,()=>!!p.bounce);
 const heights=[];let floorEvents=1;
 for(let f=0;f<18;f++){assert.equal(p.bounce.frame,f);heights.push(p.airMotion.height);assert.equal(p.air>0,f<12);assert.equal(p.bounce.phase,f<6?'rebound':f<12?'drop':'settle');if(f>=12){assert.equal(p.anim,'knockdown');assert.equal(p.launched,false);}assert.equal(p.getUp,null);step(m);floorEvents+=m.events.filter(e=>e.type==='groundBounce').length;}
 assert.equal(floorEvents,1);assert.equal(p.bounce,null);assert.ok(Math.abs(heights[6]-.55)<1e-9);
 for(let f=1;f<=6;f++)assert.ok(heights[f]>heights[f-1]);for(let f=7;f<=12;f++)assert.ok(heights[f]<heights[f-1]);assert.deepEqual(heights.slice(12),Array(6).fill(0));
 advance(m,()=>!!p.getUp);
 for(let f=0;f<28;f++){assert.equal(p.getUp.frame,f);assert.equal(p.getUp.frames,28);assert.equal(p.anim,'getUp');assert.equal(p.air,0);assert.ok(p.inv>0);step(m);}
 assert.equal(p.getUp,null);assert.equal(p.stun,0);assert.equal(p.anim,'idle');
});
test('non-KO rise freezes in hitstop and can hand off buffered guard without a vulnerable idle frame',()=>{
 const m=createMatch(),p=m.players[1];hit(m,m.players[0],p,8,'hit',true);advance(m,()=>p.getUp?.frame===22);
 const before=JSON.stringify(p.getUp);m.hitstop=3;for(let i=0;i<3;i++)step(m);assert.equal(JSON.stringify(p.getUp),before);
 step(m,{}, {guard:true});for(let i=0;i<5;i++)step(m);assert.equal(p.getUp,null);assert.equal(p.guard,true);
});
test('lethal grounded and airborne hits end the simulation immediately without waiting for recovery',()=>{
 for(const launch of [false,true]){
  const m=createMatch(),p=m.players[1];p.hp=1;p.x=-2;step(m,launch?{launch:true}:{attack:true});step(m);advance(m,()=>m.phase==='over');
  assert.equal(m.phase,'over');assert.equal(m.hitstop,0);assert.equal(p.bounce,null);assert.equal(p.getUp,null);
  const snapshot=JSON.stringify(m.players);for(let i=0;i<120;i++)step(m);assert.equal(JSON.stringify(m.players),snapshot,'KO presentation owns its separate cue clock');
 }
});
test('single-shot specials retain exactly one release across their expanded active window',()=>{
 for(let id=0;id<6;id++){
  const m=createMatch(id,1);m.players[1].x=10;step(m,{x:1,attack:true});step(m);const total=m.players[0].move.total;let releases=0;
  for(let i=0;i<total;i++){step(m);releases+=m.events.filter(e=>e.type==='shot').length;}
  assert.equal(releases,1,fighters[id].name);
 }
});
