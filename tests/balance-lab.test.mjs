import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {buildRoster,serialize,readCombatLiterals,OUT} from '../scripts/balance/extract.mjs';
import {baseState,copyState,move,open,onBlock,onHit,chainGap,whiff,scores,budget,playstyle,checks,fighterList,exportTuning,importTuning,codexTask,changes,ratio,chip,damage} from '../dist/balance/formulas.js';
import {fighters} from '../dist/fighters.js';
import {moveTiming} from '../dist/moves.js';
// BALANCE-LAB: the committed roster matches the game code, and the lab's formulas give the known values on main.
const committed=readFileSync(OUT,'utf8'),roster=JSON.parse(committed),base=baseState(roster);
const S=base.sys,F=base.fighters;

test('the committed dist/balance/roster.json matches a fresh extract (run npm run balance:extract after changing a timing)',()=>{
 assert.equal(committed,serialize(buildRoster()));
});

test('roster covers every fighter and about 116 moves, with unique keys per fighter and values from the modules',()=>{
 assert.deepEqual(roster.fighters.map(f=>f.id),fighters.map(f=>f.id));
 const count=roster.fighters.reduce((a,f)=>a+f.moves.length,0);assert.equal(count,116);
 for(const f of roster.fighters){
  const keys=f.moves.map(m=>m.key);assert.equal(new Set(keys).size,keys.length,`${f.id} keys unique`);
  const src=fighters.find(x=>x.id===f.id);for(const k of ['name','title','color','style','speed','power','reach','shotSpeed'])assert.equal(f[k],src[k]);
  for(const [i,key] of ['chain-strike-1','chain-strike-2','chain-strike-3'].entries()){const m=f.moves.find(x=>x.key===key),t=moveTiming(src,'strike',i+1);assert.deepEqual([m.startup,m.active,m.recovery],[t.startup,t.active,t.recovery]);}
  for(const m of f.moves){
   assert.ok(['Chain','Special','Variant','System','Stock','Defense'].includes(m.group),m.key);
   assert.ok(['Melee','Rush','Air','Burst','Projectile','Area','Grab','Counter'].includes(m.type),m.key);
   for(const k of ['startup','active','recovery','base'])assert.ok(Number.isFinite(m[k]),`${f.id} ${m.key} ${k}`);
   for(const k of ['move','input','range','effect','beats','losesTo'])assert.equal(typeof m[k],'string',`${f.id} ${m.key} ${k}`);
   assert.ok(m.source?.timing&&m.source?.damage,`${f.id} ${m.key} names its source files`);
  }
 }
});

test('game constants are read from the combat code',()=>{
 const c=roster.constants;
 assert.deepEqual([c.hitStun,c.hitStunSeconds,c.launchStun,c.launchStunSeconds,c.blockStun,c.blockStunSeconds,c.chip],[19,.32,49,.82,7,.12,.12]);
 assert.deepEqual([c.perfectGuard,c.perfectGuardSeconds,c.captureBreak,c.captureBreakSeconds,c.cancel1,c.cancel2,c.reversalWindow],[10,.17,12,.2,14,20,6]);
 // A literal that moves or changes in dist/combat.js changes the extract; one that stops matching fails loudly.
 const source=readFileSync(new URL('../dist/combat.js',import.meta.url),'utf8');
 assert.equal(buildRoster(source.replace('b.stun=launch?.82:.32','b.stun=launch?.82:.4')).constants.hitStun,24);
 assert.throws(()=>readCombatLiterals(source.replace('const perfect=balanceGuard(m,b,\'perfectGuard\',.17)','const perfect=isPerfect(b)')),/perfectGuard/);
});

test('known values on main: Tala and Morrow Strike 1, chain gaps, no reaction-punishable whiff',()=>{
 const t1=move(F.tala,'chain-strike-1'),m1=move(F.morrow,'chain-strike-1');
 assert.deepEqual([t1.startup,t1.active,t1.recovery],[9,3,16]);assert.equal(onHit(S,t1),1);assert.equal(onBlock(S,t1),-11);
 assert.deepEqual([m1.startup,m1.active,m1.recovery],[11,3,20]);assert.equal(onBlock(S,m1),-15);
 for(const f of fighterList(base))assert.equal(chainGap(S,f,1),f.id==='morrow'?12:11,`${f.id} chain gap`);
 for(const A of fighterList(base))for(const D of fighterList(base))if(A!==D)assert.notEqual(whiff(S,A,D).verdict,'Reaction punish',`${A.id} whiff vs ${D.id}`);
 assert.equal(open(t1),18);assert.equal(ratio(F.tala,t1),damage(F.tala,t1)/18*10);assert.equal(chip(S,F.tala,move(F.tala,'system-capture-close-')),0);
});

test('scores, budget and playstyle use the fixed scales',()=>{
 assert.deepEqual(scores(S,F.tala),{Mobility:85,Reach:17,Damage:50,'Attack speed':63,Safety:45,Zoning:24});
 assert.equal(budget(scores(S,F.tala)),47);assert.equal(playstyle(scores(S,F.tala)),'Rushdown');
 assert.equal(playstyle(scores(S,F.sol)),'Zoner');assert.equal(playstyle(scores(S,F.morrow)),'Footsies');assert.equal(playstyle(scores(S,F.aegis)),'Balanced');
 const titles=checks(base).map(c=>c[2]);
 assert.ok(titles.includes('No Strike 1 whiff can be punished on reaction'));
 assert.ok(titles.some(t=>t.startsWith('After a blocked hit, the defender wins both choices')));
 assert.ok(titles.includes('One guard tap beats both strike and capture (10 shared frames)'));
 assert.ok(titles.includes('Plus on hit with Strike 1: TALA'));
});

test('Morrow Strike 1 recovery 40 flips the whiff check, and the Changes text names the source',()=>{
 const w=copyState(base);move(w.fighters.morrow,'chain-strike-1').recovery=40;
 for(const D of fighterList(w))if(D.id!=='morrow')assert.equal(whiff(w.sys,w.fighters.morrow,D).verdict,'Reaction punish');
 assert.ok(checks(w).some(c=>c[2]==='5 pairings can punish a whiff on reaction'));
 const task=codexTask(base,w);
 assert.match(task,/MORROW:\n- Strike 1 recovery: 20 -> 40 \(dist\/moves\.js moveTiming 'strike' chain 1\)/);
 assert.equal(codexTask(base,base).startsWith('No changes yet'),true);
});

test('export and import round-trip in the shared {sys, fighters} shape, including a new fighter',()=>{
 const w=copyState(base);w.fighters.sol.stats.speed=6;move(w.fighters.sol,'chain-shot-1').base=8;w.sys.splitGuard=true;w.sys.reaction=12;
 const kade={...copyState(w.fighters.tala),id:'kade',name:'KADE',color:'#4fd1b0',custom:true,template:'tala',intended:'Copied from TALA, not set yet'};w.fighters.kade=kade;w.order.push('kade');move(kade,'chain-strike-1').startup=8;
 const file=JSON.parse(JSON.stringify(exportTuning(w)));
 assert.deepEqual(Object.keys(file),['sys','fighters']);
 assert.deepEqual(Object.keys(file.fighters.sol),['id','name','color','intended','custom','stats','moves']);
 assert.deepEqual(Object.keys(file.fighters.sol.moves[0]),['key','startup','active','recovery','base']);
 const {state,notes}=importTuning(base,file);assert.deepEqual(notes,[]);
 assert.deepEqual(exportTuning(state),exportTuning(w));
 assert.equal(changes(base,state).fighters.find(f=>f.id==='sol').lines.length,2);
 assert.match(codexTask(base,state),/New fighter KADE \(id kade/);
 assert.match(codexTask(base,state),/split guard \(splitGuard\): false -> true/);
 // A file from the hosted Frame Codex (no template, unknown keys) still imports.
 const hosted=importTuning(base,{sys:{blockstun:9,unknown:1},fighters:{rei:{stats:{reach:3}},ghost:{name:'X'},morrow:{moves:[{key:'chain-strike-1',recovery:40},{key:'nope',startup:1}]}}});
 assert.equal(hosted.state.sys.blockstun,9);assert.equal(hosted.state.fighters.rei.stats.reach,3);assert.equal(move(hosted.state.fighters.morrow,'chain-strike-1').recovery,40);
 assert.deepEqual(hosted.notes,['skipped unknown fighter ghost','morrow: unknown move nope']);
 assert.throws(()=>importTuning(base,null));
});

test('docs/DESIGN.md points to the balance lab instead of a stale timing table',()=>{
 const design=readFileSync(new URL('../docs/DESIGN.md',import.meta.url),'utf8');
 assert.match(design,/balance-lab\.html/);assert.match(design,/dist\/balance\/roster\.json/);
 assert.doesNotMatch(design,/5\/1\/14/);
});
