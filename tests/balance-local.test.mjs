import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import {createMatch,update,neutral,STEP,hit} from '../dist/combat.js';
import {fighters} from '../dist/fighters.js';
import {moveTiming,chainCancelFrame} from '../dist/moves.js';
import {baseState,exportTuning} from '../dist/balance/formulas.js';
import {validateBalance,balanceMoveKey,applyBalanceMove,balanceGuard,balanceCaptureBreak} from '../dist/balance-runtime.js';
import {loadBalancePreview} from '../dist/balance-preview.js';
import {baseSpecials,specialVariants} from '../dist/special-variants.js';
import {techniqueVariants} from '../dist/techniques.js';
import {stockSpecials} from '../dist/stock-specials.js';
import {createScenario,stepScenario} from '../dist/sandbox-recipes.js';
const roster=JSON.parse(readFileSync(new URL('../dist/balance/roster.json',import.meta.url))),base=baseState(roster);
const tuning=()=>exportTuning(base),compile=raw=>validateBalance(raw,base);
const row=(raw,id,key)=>raw.fighters[id].moves.find(m=>m.key===key);
const tick=(m,a={},b={})=>update(m,[{...neutral(),...a},{...neutral(),...b}],STEP);
function trace(api){
 const out=[];
 for(let id=0;id<6;id++){
  const m=api.createMatch(id,(id+1)%6,'training');m.players[0].x=0;m.players[1].x=2;
  for(let frame=0;frame<600;frame++){
   api.update(m,[{...api.neutral(),attack:frame%50===1,x:frame%140<15?1:0,launch:frame%180===100,capture:frame%180===140,super:frame===350}, {...api.neutral(),guard:frame%90<15,attack:frame%80===40,z:frame%90>70?1:0}],STEP);
   out.push(JSON.stringify(m));
  }
 }
 return createHash('sha256').update(out.join('\n')).digest('hex');
}
export {trace};
test('default simulation fingerprint matches main before the preview hooks',()=>{
 const expected=readFileSync(new URL('./fixtures/balance-default.sha256',import.meta.url),'utf8').trim();
 assert.equal(trace({createMatch,update,neutral}),expected);
});
test('unmodified lab export has no numeric overrides; snapshot cannot mutate between matches',()=>{
 const c=compile(tuning());assert.deepEqual(c,{version:1,sys:{},fighters:{}});
 const raw=tuning();row(raw,'morrow','chain-strike-1').recovery=40;const config=compile(raw);
 const m=createMatch(3,1,'training','normal',{balance:config});config.fighters.morrow.moves['chain-strike-1'].recovery=100;
 assert.equal(m.balance.fighters.morrow.moves['chain-strike-1'].recovery,40);assert.equal(moveTiming(fighters[3],'strike').recovery,20);
});
test('validation rejects malformed, unknown, duplicate, fractional frames and custom fighters atomically',()=>{
 for(const change of [r=>r.sys.chip=2,r=>r.sys.hitstun=NaN,r=>r.sys.splitGuard='yes',r=>r.fighters.morrow.stats.speed=-3,r=>row(r,'morrow','chain-strike-1').recovery=4.5,r=>r.fighters.morrow.custom=true,r=>r.fighters.morrow.moves.push(r.fighters.morrow.moves[0]),r=>r.sys.what=3]){const raw=tuning();change(raw);assert.throws(()=>compile(raw));}
});
test('all 116 lab move keys map to a playable row',()=>{
 for(const f of fighters){
  const keys=new Set();
  const add=m=>keys.add(balanceMoveKey(f,m));
  for(const kind of ['strike','shot'])for(let chain=1;chain<=3;chain++)add({kind,chain});
  for(const kind of ['forward','back','technique']){add({kind});add({kind,followup:true});}
  for(const kind of ['capture','launch','pursuit','jumpAttack','super'])add({kind});
  for(const kind of Object.keys(stockSpecials[f.id]||{}))add({kind,empowered:true});
  add({kind:'strike',reversal:true});
  assert.deepEqual([...keys].sort(),base.fighters[f.id].moves.map(m=>m.key).sort());
 }
});
test('Morrow recovery 20 -> 40 applies to a real strike and leaves the other fighter unchanged',()=>{
 const raw=tuning();row(raw,'morrow','chain-strike-1').recovery=40;
 const m=createMatch(3,2,'training','normal',{balance:compile(raw)});m.players[0].x=0;m.players[1].x=2;
 tick(m,{attack:true});tick(m);assert.equal(m.players[0].move.recovery,40);assert.equal(m.players[0].move.total,54);
 assert.equal(moveTiming(fighters[2],'strike').recovery,16);
});
test('tuned damage and power reach real contact without multiplying the shared fighter stats',()=>{
 const raw=tuning();row(raw,'tala','chain-strike-1').base=12;raw.fighters.tala.stats.power=1.5;
 const m=createMatch(2,0,'duel','normal',{balance:compile(raw)});m.players[0].x=0;m.players[1].x=1.6;
 tick(m,{attack:true});for(let n=0;n<12;n++)tick(m);
 assert.equal(m.players[1].hp,82);assert.notEqual(fighters[2].power,1.5);
});
test('movement stats affect only the tuned match',()=>{
 const raw=tuning();raw.fighters.tala.stats.speed=10;
 const a=createMatch(2,0,'training','normal',{balance:compile(raw)}),b=createMatch(2,0,'training');tick(a,{x:1});tick(b,{x:1});
 assert.ok(a.players[0].x>b.players[0].x);
});
test('hit stun, block stun, chip and exact guard frame windows are match owned',()=>{
 const raw=tuning();Object.assign(raw.sys,{hitstun:40,blockstun:20,chip:.5,perfectGuard:3,captureBreak:4});const m=createMatch(2,0,'training','normal',{balance:compile(raw)}),[a,b]=m.players;
 hit(m,a,b,10);assert.equal(b.stun,40/60);b.stun=0;b.guard=true;b.guardTime=10/60;hit(m,a,b,10);assert.equal(b.hp,85);assert.equal(b.blockStun,20/60);
 b.guardTime=3/60;assert.equal(balanceGuard(m,b,'perfectGuard',.17),true);b.guardTime=4/60;assert.equal(balanceGuard(m,b,'perfectGuard',.17),false);
 assert.equal(balanceCaptureBreak(m,b),true);b.guardTime=5/60;assert.equal(balanceCaptureBreak(m,b),false);
});
test('split guard requires a separate recent capture tap',()=>{
 const raw=tuning();raw.sys.splitGuard=true;raw.sys.captureBreak=4;const m=createMatch(2,0,'training','normal',{balance:compile(raw)}),b=m.players[1];m.tick=20;b.guard=true;b.guardTime=1/60;
 assert.equal(balanceCaptureBreak(m,b),false);b.captureTapTick=18;assert.equal(balanceCaptureBreak(m,b),false);b.guard=false;assert.equal(balanceCaptureBreak(m,b),true);m.tick=22;assert.equal(balanceCaptureBreak(m,b),false);
});
test('chain cancel overrides and variant/stock/reversal timings are independent rows',()=>{
 const raw=tuning();raw.sys.cancel1=22;
 for(const f of fighters)for(const r of raw.fighters[f.id].moves)r.recovery+=5;
 const m=createMatch(2,0,'training','normal',{balance:compile(raw)}),a=m.players[0];
 for(const spec of [{kind:'strike',chain:1},{kind:'forward'},{kind:'forward',followup:true},{kind:'technique',followup:true},{kind:'forward',empowered:true},{kind:'strike',reversal:true}]){
  const key=balanceMoveKey(fighters[2],spec),r=base.fighters.tala.moves.find(x=>x.key===key),move={...spec,startup:r.startup,active:r.active,recovery:r.recovery};applyBalanceMove(m,a,move);assert.equal(move.recovery,r.recovery+5);assert.equal(move.total,move.startup+move.active+move.recovery);
  if(spec.kind==='strike'&&!spec.reversal)assert.equal(chainCancelFrame(move),22);
 }
});
test('sandbox replay and sequential stepping use the same tuning snapshot',()=>{
 const raw=tuning();row(raw,'morrow','chain-strike-1').recovery=40;const opts={balance:compile(raw)};
 const a=createScenario('strike3',3,1,opts),b=createScenario('strike3',3,1,opts);
 for(let n=0;n<90;n++)stepScenario(a);for(let n=0;n<30;n++)stepScenario(b);const resumed=structuredClone(b.m);b.m=resumed;for(let n=30;n<90;n++)stepScenario(b);
 assert.deepEqual(a.m,b.m);
});
test('default query does not read storage or fetch; invalid preview reports normal rules',async()=>{
 const fail=()=>{throw Error('must not access')};assert.deepEqual(await loadBalancePreview('?energy=flow',{getItem:fail},fail),{balance:null,message:''});
 const bad=await loadBalancePreview('?balance=local',{getItem:()=>'{oops'},async()=>({ok:true,json:async()=>roster}));assert.equal(bad.balance,null);assert.equal(bad.error,true);
 const missing=await loadBalancePreview('?balance=local',{getItem:()=>null},fail);assert.match(missing.message,/No saved tuning/);
});
test('local preview composes with flow and ignores analysis-only estimates',async()=>{
 const raw=tuning();raw.sys.reaction=40;raw.sys.band=12;row(raw,'morrow','chain-strike-1').recovery=40;
 const p=await loadBalancePreview('?energy=flow&balance=local',{getItem:()=>JSON.stringify(raw)},async()=>({ok:true,json:async()=>roster}));
 assert.equal(p.balance.fighters.morrow.moves['chain-strike-1'].recovery,40);assert.deepEqual(p.balance.sys,{});assert.match(p.message,/TUNED VALUES/);
});

test('compressed Siege salvo keeps all eight missiles and its edited total base damage',()=>{
 const raw=tuning(),key=balanceMoveKey(fighters[3],{kind:'back'});row(raw,'morrow',key).active=1;row(raw,'morrow',key).base=32;
 const m=createMatch(3,0,'training','normal',{balance:compile(raw)}),a=m.players[0],s=baseSpecials.morrow.back;
 a.move={kind:'back',...moveTiming(fighters[3],'back'),active:13,special:s,chain:1,frame:0,started:0,aimX:1,aimZ:0};applyBalanceMove(m,a,a.move);
 const start=a.move.startup;for(let n=0;n<start;n++)tick(m);
 assert.equal(m.projectiles.length,8);assert.equal(m.projectiles.reduce((n,p)=>n+p.damage,0),32*fighters[3].power);
});
test('Orbit fan uses summed damage across three rings, not three times the edited base',()=>{
 const raw=tuning(),key=balanceMoveKey(fighters[5],{kind:'technique',followup:true});row(raw,'vesper',key).base=42;
 const m=createMatch(5,0,'training','normal',{balance:compile(raw)}),a=m.players[0];
 a.move={kind:'technique',...moveTiming(fighters[5],'technique'),...techniqueVariants.vesper,followup:true,frame:0,started:0,aimX:1,aimZ:0};applyBalanceMove(m,a,a.move);
 for(let n=0;n<a.move.startup;n++)tick(m);
 assert.equal(m.projectiles.length,3);assert.equal(m.projectiles.reduce((n,p)=>n+p.damage,0),42*fighters[5].power);
});
test('compressed stock stream keeps four pulses and all stock damage',()=>{
 const raw=tuning(),key=balanceMoveKey(fighters[5],{kind:'technique',empowered:true});row(raw,'vesper',key).active=1;row(raw,'vesper',key).base=40;
 const m=createMatch(5,0,'training','normal',{balance:compile(raw)}),a=m.players[0];
 a.move={kind:'technique',...moveTiming(fighters[5],'technique'),active:19,stockSpecial:stockSpecials.vesper.technique,empowered:true,frame:0,started:0,aimX:1,aimZ:0};applyBalanceMove(m,a,a.move);
 for(let n=0;n<a.move.startup;n++)tick(m);
 assert.equal(m.projectiles.length,4);assert.equal(m.projectiles.reduce((n,p)=>n+p.damage,0),40*fighters[5].power);
});
test('capture damage override survives the cinematic and uses the grabber power',()=>{
 const raw=tuning();row(raw,'tala','system-capture-close-').base=30;
 const m=createMatch(2,0,'duel','normal',{balance:compile(raw)});m.players[0].x=0;m.players[1].x=1.8;
 tick(m,{capture:true});for(let n=0;n<14&&!m.cinematic;n++)tick(m);
 assert.ok(m.cinematic);assert.equal(m.cinematic.damage,30*fighters[2].power);
});

test('longer single-shot active window does not multiply shots or capture rings',()=>{
 for(const kind of ['shot','capture']){
  const raw=tuning(),key=balanceMoveKey(fighters[2],{kind,chain:1});row(raw,'tala',key).active=6;
  const m=createMatch(2,0,'training','normal',{balance:compile(raw)}),a=m.players[0];
  a.move={kind,...moveTiming(fighters[2],kind),chain:1,frame:0,started:0,aimX:1,aimZ:0};applyBalanceMove(m,a,a.move);
  const frames=a.move.startup+5;for(let n=0;n<frames;n++)tick(m);
  assert.equal(m.projectiles.length,1,kind);
 }
});
