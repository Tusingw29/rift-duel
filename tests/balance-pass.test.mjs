import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {createMatch,neutral,update,hit,STEP} from '../dist/combat.js';
import {baseState,exportTuning,importTuning,copyState,whiff,fighterList,move,onBlock,onHit,missRecovery,scores,budget,controlScore,checks} from '../dist/balance/formulas.js';
import {proposedBalance} from '../dist/balance/presets.js';import {validateBalance} from '../dist/balance-runtime.js';import {loadBalancePreview} from '../dist/balance-preview.js';
import {fighters} from '../dist/fighters.js';
const roster=JSON.parse(readFileSync(new URL('../dist/balance/roster.json',import.meta.url))),base=baseState(roster);
const config=(s=proposedBalance(base))=>validateBalance(exportTuning(s),base);
const step=(m,a={},b={})=>update(m,[{...neutral(),...a},{...neutral(),...b}],STEP);
function strike(id,kind,tuned=true){
 const m=createMatch(id,(id+1)%6,'duel','normal',tuned?{balance:config(proposedBalance(base,'rules'))}:{}),[a,b]=m.players;
 a.x=0;b.x=kind==='miss'?fighters[id].reach-.02:1.6;
 if(kind==='block'){b.guard=true;b.guardTime=1;}
 const defense=kind==='block'?{guard:true}:{};
 step(m,{attack:true},defense);step(m,{},defense);assert.equal(a.move.kind,'strike');const move=a.move;
 for(let n=0;n<160&&a.move;n++)step(m,{},kind==='miss'?{x:-1}:defense);
 return {m,move};
}
test('miss penalty extends only a missed strike and exactly once for all six fighters',()=>{
 for(let id=0;id<6;id++)for(const kind of ['miss','hit','block']){
  const normal=strike(id,kind,false),tuned=strike(id,kind,true);
  assert.equal(tuned.move.recovery-normal.move.recovery,kind==='miss'?7:0,`${id} ${kind}`);
  assert.equal(tuned.move.total-normal.move.total,kind==='miss'?7:0);
  assert.equal(tuned.move.missPenalty||0,kind==='miss'?7:0);
  assert.equal(!!tuned.move.connected,kind!=='miss');
 }
});
test('last-active-frame contact avoids the penalty; interruption does not leave recovery behind',()=>{
 const m=createMatch(2,0,'duel','normal',{balance:config()}),[a,b]=m.players;a.x=0;b.x=1.7;step(m,{attack:true});step(m);const mv=a.move;
 b.inv=2;while(mv.frame<mv.startup+mv.active-2)step(m);b.inv=0;step(m);assert.ok(mv.connected);
 while(a.move)step(m);assert.equal(mv.missPenalty,undefined);
 const whiff=createMatch(2,0,'duel','normal',{balance:config()}),[c,d]=whiff.players;c.x=0;d.x=1.7;step(whiff,{attack:true});step(whiff);hit(whiff,d,c,6);for(let i=0;i<40;i++)step(whiff);assert.equal(c.move,null);assert.equal(c.cool,0);
});
test('lab adds the penalty only to whiff estimates, preserving hit/block advantage',()=>{
 for(const extra of [0,5,6,7]){
  const s=copyState(base);s.sys.missPenalty=extra;let n=0;
  for(const a of fighterList(s))for(const d of fighterList(s))if(a!==d&&whiff(s.sys,a,d).verdict==='Reaction punish')n++;
  assert.equal(n,{0:0,5:6,6:12,7:17}[extra]);
  const jab=move(s.fighters.tala,'chain-strike-1');assert.equal(onBlock(s.sys,jab),-11);assert.equal(onHit(s.sys,jab),1);assert.equal(missRecovery(s.sys,jab),16+extra);
 }
});
test('rules and full proposal are explicit and do not buff Vesper or mutate the baseline',()=>{
 const rules=proposedBalance(base,'rules'),full=proposedBalance(base);
 assert.equal(rules.sys.blockstun,12);assert.equal(rules.sys.missPenalty,7);assert.equal(rules.sys.splitGuard,true);
 assert.deepEqual(rules.fighters,base.fighters);assert.deepEqual(full.fighters.vesper,base.fighters.vesper);
 assert.deepEqual([full.fighters.rei.stats.reach,full.fighters.rei.stats.speed],[2.85,5.6]);assert.equal(full.fighters.aegis.stats.reach,2.5);assert.equal(full.fighters.aegis.stats.shotSpeed,14);
 for(let n=1;n<=3;n++)assert.equal(move(full.fighters.aegis,`chain-shot-${n}`).recovery,14);
 assert.equal(base.sys.blockstun,7);assert.equal(base.fighters.rei.stats.reach,3.1);
 assert.equal(scores(full.sys,full.fighters.aegis).Zoning,57);assert.equal(budget(scores(full.sys,full.fighters.rei)),49);
 assert.ok(!checks(rules).some(x=>x[0]==='bad'&&x[1]==='Blocked chain'));
});
test('12-frame held block and split capture tech are executed by the simulation',()=>{
 const m=createMatch(2,0,'duel','normal',{balance:config()}),[a,b]=m.players;b.guard=true;b.guardTime=1;hit(m,a,b,6);assert.equal(b.blockStun,12/60);
 function grab(defense){const n=createMatch(2,0,'duel','normal',{balance:config()}),[x,y]=n.players;x.x=0;y.x=1.7;step(n,{capture:true});for(let f=0;f<12;f++)step(n);step(n,{},defense);return n;}
 assert.ok(grab({guard:true}).cinematic,'guard alone loses to grab');
 const teched=grab({capture:true});assert.equal(teched.cinematic,null);assert.ok(teched.events.some(e=>e.text==='CAPTURE BREAK'));
 assert.ok(grab({guard:true,capture:true}).cinematic,'holding both is not a universal defense');
});
test('Control is source-derived, bounded, excludes stock inflation and does not inflate core budget',()=>{
 const v=base.fighters.vesper,c=controlScore(v);assert.equal(c.traps,25);assert.equal(c.hold,30);assert.equal(c.persistence,25);assert.ok(c.total>55);
 const noControl=copyState(v);for(const m of noControl.moves)delete m.control;assert.equal(controlScore(noControl).total,0);
 assert.equal(budget(scores(base.sys,v)),budget(scores(base.sys,noControl)));
 const stock=copyState(v);stock.moves.push({group:'Stock',control:{holdSeconds:100,radius:100,ring:true,trap:true,lifetime:100,speed:1}});assert.deepEqual(controlScore(stock),c);
 for(const f of fighterList(base)){const score=controlScore(f);assert.ok(score.total>=0&&score.total<=100);}
});
test('exports preserve miss penalty; older exports without it keep zero',()=>{
 const raw=exportTuning(proposedBalance(base));assert.equal(importTuning(base,raw).state.sys.missPenalty,7);delete raw.sys.missPenalty;assert.equal(importTuning(base,raw).state.sys.missPenalty,0);
 raw.sys.missPenalty=31;assert.throws(()=>validateBalance(raw,base),/missPenalty/);
});
test('direct proposal links do not overwrite or read saved tuning and compose with flow',async()=>{
 const noStorage={getItem(){throw Error('storage must not be read')}};
 const p=await loadBalancePreview('?balance=proposed&energy=flow',noStorage,async()=>({ok:true,json:async()=>roster}));
 assert.equal(p.balance.sys.missPenalty,7);assert.equal(p.balance.sys.blockstun,12);assert.equal(p.balance.fighters.rei.stats.reach,2.85);
 const rules=await loadBalancePreview('?balance=rules',noStorage,async()=>({ok:true,json:async()=>roster}));assert.deepEqual(rules.balance.fighters,{});
});

test('standalone Frame Codex embeds the same current data, presets and formulas',async()=>{
 const {buildStandalone}=await import('../scripts/balance/build-standalone.mjs');
 const html=readFileSync(new URL('../dist/frame-codex.html',import.meta.url),'utf8');assert.equal(html,buildStandalone());
 assert.ok(!html.includes('src="balance-lab.js'));assert.ok(!html.includes("fetch('./balance/roster.json'"));assert.match(html,/function controlScore/);assert.match(html,/missPenalty:7/);
});
