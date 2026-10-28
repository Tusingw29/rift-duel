import test from 'node:test';import assert from 'node:assert/strict';
import {createHash} from 'node:crypto';
import {createMatch,update,neutral,STEP} from '../dist/combat.js';
import {fighters} from '../dist/fighters.js';
import {moveTiming,canChain} from '../dist/moves.js';
import {createScenario,stepScenario,scenarioAt,snapshot} from '../dist/sandbox-recipes.js';
import {SPACING_COMMITMENT,setCombatVariant,combatVariant,variantRules,neutralAttackKind,applyRiskyShot,inBand,spacingMarker} from '../dist/spacing-commitment.js';
// SPACING-COMMITMENT: opt-in &spacing=band|riskyshot and &guard=split. Default game unchanged.
const BAND=SPACING_COMMITMENT.band;
const place=(m,d)=>{m.players[0].x=0;m.players[1].x=d;m.players[0].z=m.players[1].z=0;for(const p of m.players){p.lookX=p===m.players[0]?1:-1;p.lookZ=0;p.face=p===m.players[0]?1:-1;}return m;};
const match=(a,b,d,rules={})=>place(createMatch(a,b,'training','normal',rules),d);
const run=(m,frames,p1=()=>({}),p2=()=>({}))=>{const ev=[];for(let f=0;f<frames;f++){update(m,[{...neutral(),...p1(f,m)},{...neutral(),...p2(f,m)}],STEP);for(const e of m.events)ev.push({f,...e});}return ev;};
const tapAttack=f=>f===0?{attack:true}:{};
// First move P1 starts from a single attack tap at distance d.
const firstMove=(a,d,rules)=>{const m=match(a,(a+1)%6,d,rules);for(let f=0;f<3&&!m.players[0].move;f++)update(m,[{...neutral(),...tapAttack(f)},neutral()],STEP);return {...m.players[0].move};};
// Fingerprint of every sandbox recipe for three pairings plus an attack/capture sweep across distances.
// Generated on main e085558 (before SPACING-COMMITMENT) with the same function: 3ba3ed14…4045.
// The recipes main had; recipes added later are not part of the fingerprint.
const MAIN_RECIPES=["idle","ab-advance-guard","ab-retreat-attack","ab-circle-left-guard","ab-circle-right-guard","ab-knockdown-getup-guard","ab-advance-hit","ab-advance-strike-hitstop","approach","retreat","circle","circle-step","pursuit","crossover","strike1","strike2","strike3","launch","capture","burst","charge","guard","recoil","guard-hit","stagger","stagger-recover","reversal"];
function fingerprint(){
 const h=createHash('sha256'),put=m=>h.update(JSON.stringify([m.players.map(snapshot),m.events.map(e=>e.type),m.projectiles.length,m.hitstop]));
 for(const [p1,p2] of [[2,1],[3,0],[4,5]])for(const name of MAIN_RECIPES){const s=createScenario(name,p1,p2);for(let f=0;f<150;f++){stepScenario(s);put(s.m);}}
 for(let a=0;a<6;a++)for(let d=1.5;d<=5;d+=.25){const m=createMatch(a,(a+1)%6,'training');m.players[0].x=0;m.players[1].x=d;
  for(let f=0;f<60;f++){update(m,[{...neutral(),attack:f===0,capture:f===30},{...neutral(),guard:f>=4&&f<40}],STEP);put(m);}}
 return h.digest('hex');
}

test('default path is identical to main: no new rules keys, the same line-100 switch, the same fingerprint',()=>{
 assert.deepEqual(combatVariant(),{spacing:'default',guard:'default'});
 const m=createMatch(2,1,'training');
 assert.deepEqual(Object.keys(m.rules),['roundSeconds','winsNeeded','pressureAssist']);
 for(const f of fighters)for(let d=0;d<8;d+=.05)assert.equal(neutralAttackKind(m.rules,f,d),d<f.reach?'strike':'shot');
 assert.equal(fingerprint(),'3ba3ed144fd4e902c03ecccd37c4e5d308000e14a2426d4e46df3f7f4bbc4045');
 for(const name of ['strike3','guard-hit','capture','reversal']){const s=scenarioAt(name,120,2,1);for(const p of s.m.players)assert.equal(p.captureTapTick,undefined);}
});

test('URL switch values: only the named modes are accepted, and a match keeps the mode it was created with',()=>{
 try{
  assert.deepEqual(setCombatVariant({spacing:'band',guard:'split'}),{spacing:'band',guard:'split'});
  const m=createMatch(2,1,'training');assert.equal(m.rules.spacing,'band');assert.equal(m.rules.guard,'split');
  setCombatVariant({spacing:'nonsense',guard:'x'});assert.deepEqual(combatVariant(),{spacing:'default',guard:'default'});
  assert.equal(m.rules.spacing,'band','the existing match is unaffected by a later switch');
  assert.deepEqual(variantRules({spacing:'riskyshot'}),{spacing:'riskyshot'});
 }finally{setCombatVariant({});}
});

test('band: inside the band a neutral attack commits to a strike that whiffs and cannot chain; beyond it fires a shot',()=>{
 for(const [a,f] of fighters.entries()){
  for(const d of [f.reach+.05,f.reach+BAND/2,f.reach+BAND-.05]){
   assert.equal(firstMove(a,d,{spacing:'band'}).kind,'strike',`${f.id} at ${d.toFixed(2)} strikes in band`);
   assert.equal(firstMove(a,d,{}).kind,'shot',`${f.id} at ${d.toFixed(2)} shoots by default`);
   const m=match(a,(a+1)%6,d,{spacing:'band'});let chainable=false;
   const ev=run(m,40,(fr,mm)=>{if(mm.players[0].move&&canChain(mm.players[0].move))chainable=true;return tapAttack(fr);});
   assert.ok(!ev.some(e=>['hit','block','parry'].includes(e.type)),`${f.id} whiffs at ${d.toFixed(2)}`);
   assert.ok(!chainable,'a whiff never chains');
  }
  assert.equal(firstMove(a,f.reach+BAND+.05,{spacing:'band'}).kind,'shot',`${f.id} shoots beyond the band`);
  assert.equal(firstMove(a,f.reach-.1,{spacing:'band'}).kind,'strike');
 }
 // Inside reach, band mode still lands exactly as the default does.
 const hitBand=run(match(2,1,2,{spacing:'band'}),30,tapAttack).filter(e=>e.type==='hit').map(e=>e.f),hitDefault=run(match(2,1,2),30,tapAttack).filter(e=>e.type==='hit').map(e=>e.f);
 assert.deepEqual(hitBand,hitDefault);assert.equal(hitBand.length,1);
});

test('riskyshot: only a neutral shot fired inside the band gets the extra startup and recovery',()=>{
 const {startup:S,recovery:R}=SPACING_COMMITMENT.riskyShot;
 for(const [a,f] of fighters.entries()){
  const base=moveTiming(f,'shot');
  const inside=firstMove(a,f.reach+BAND/2,{spacing:'riskyshot'});
  assert.equal(inside.kind,'shot');assert.equal(inside.startup,base.startup+S);assert.equal(inside.recovery,base.recovery+R);assert.equal(inside.total,base.total+S+R);assert.ok(inside.riskyShot);
  const beyond=firstMove(a,f.reach+BAND+.5,{spacing:'riskyshot'});
  assert.equal(beyond.kind,'shot');assert.equal(beyond.startup,base.startup);assert.equal(beyond.recovery,base.recovery);assert.ok(!beyond.riskyShot);
  const close=firstMove(a,f.reach-.1,{spacing:'riskyshot'});assert.equal(close.kind,'strike');assert.equal(close.startup,moveTiming(f,'strike',1).startup);
  // The same shot in the default game keeps its timing.
  assert.equal(firstMove(a,f.reach+BAND/2,{}).startup,base.startup);
 }
 // A chained shot or a shot outside riskyshot mode is never stretched.
 const move={kind:'shot',chain:2,startup:11,active:1,recovery:18,total:30};
 assert.equal(applyRiskyShot({spacing:'riskyshot'},fighters[0],fighters[0].reach+.5,move),false);assert.equal(move.total,30);
 assert.equal(applyRiskyShot({},fighters[0],fighters[0].reach+.5,{...move,chain:1}),false);
 // The bolt leaves on the stretched release frame.
 const m=match(4,1,fighters[4].reach+BAND/2,{spacing:'riskyshot'}),shot=run(m,40,tapAttack).find(e=>e.type==='shot');
 const d=match(4,1,fighters[4].reach+BAND/2),shotD=run(d,40,tapAttack).find(e=>e.type==='shot');
 assert.equal(shot.f-shotD.f,S);
});

// guard=split. The attacker (P1) presses on frame 0; the defender (P2) acts on frame g.
const outcome=(kind,g,rules,tap)=>{const m=match(2,0,2,rules);let out='none';
 const ev=run(m,70,f=>f===0?{[kind==='strike'?'attack':'capture']:true}:{},f=>tap==='guard'?(f>=g?{guard:true}:{}):tap==='guard+capture'?{guard:f>=g-8,capture:f===g}:f===g?{capture:true}:{});
 for(const e of ev){if(out!=='none')break;if(e.type==='parry')out='perfect';else if(e.type==='block')out='block';else if(e.type==='hit')out='hit';else if(e.type==='hint'&&e.text==='CAPTURE BREAK')out='break';else if(e.type==='cinematic')out='captured';}
 return {out,m};
};
test('guard=split: a fresh guard still perfect-guards strikes but never breaks a capture; a capture tap breaks it and loses to a strike',()=>{
 const split={guard:'split'};
 for(let g=1;g<=10;g++){assert.equal(outcome('strike',g,split,'guard').out,'perfect',`guard tap ${g} still perfect`);assert.equal(outcome('strike',g,{},'guard').out,'perfect');}
 for(let g=0;g<=20;g++){
  assert.notEqual(outcome('capture',g,split,'guard').out,'break',`guard tap ${g} no longer breaks`);
  assert.equal(outcome('strike',g,split,'capture').out,'hit',`capture tap ${g} loses to a strike`);
 }
 // The tech window has the same 12-frame width the guard break has in the default game.
 const tech=[],guardBreak=[];for(let g=0;g<=20;g++){if(outcome('capture',g,split,'capture').out==='break')tech.push(g);if(outcome('capture',g,{},'guard').out==='break')guardBreak.push(g);}
 assert.deepEqual(tech,guardBreak);assert.equal(tech.length,SPACING_COMMITMENT.captureTechFrames);
 // A broken capture stuns the attacker, and the defender's own capture is spent on the break.
 const {m}=outcome('capture',6,split,'capture');assert.equal(m.cinematic,null);
 // Holding guard while tapping capture does not tech: the defender must commit to one read.
 assert.equal(outcome('capture',6,split,'guard+capture').out,'captured');
 // Default rules: one guard tap covers both (the overlap this switch removes).
 assert.equal(outcome('strike',5,{},'guard').out,'perfect');assert.equal(outcome('capture',5,{},'guard').out,'break');
});

test('guard=split: a mid-range capture projectile is broken by a capture tap, not a guard tap',()=>{
 const shot=(rules,tapFn)=>{const m=match(2,0,4.5,rules);return run(m,90,f=>f===0?{capture:true}:{},tapFn);};
 const arrival=shot({},()=>({})).find(e=>e.type==='cinematic')?.f;assert.ok(arrival,'the projectile captures an idle defender');
 const guardRes=shot({guard:'split'},f=>f>=arrival-4?{guard:true}:{});
 assert.ok(guardRes.some(e=>e.type==='cinematic')&&!guardRes.some(e=>e.text==='CAPTURE BREAK'));
 assert.ok(shot({},f=>f>=arrival-4?{guard:true}:{}).some(e=>e.text==='CAPTURE BREAK'),'default: a fresh guard breaks it');
 const techRes=shot({guard:'split'},f=>f===arrival-4?{capture:true}:{});
 assert.ok(techRes.some(e=>e.text==='CAPTURE BREAK')&&!techRes.some(e=>e.type==='cinematic'));
});

test('existing depth survives every mode: perfect guard stun and charge, reflection, third-hit reversal',()=>{
 for(const rules of [{},{spacing:'band'},{spacing:'riskyshot'},{guard:'split'},{spacing:'band',guard:'split'}]){
  setCombatVariant(rules);
  try{
   let reversal=false;const s=createScenario('reversal',2,1);for(let f=0;f<160;f++){stepScenario(s);if(s.m.events.some(e=>e.type==='reversal'))reversal=true;}
   assert.ok(reversal,`third-hit reversal in ${JSON.stringify(rules)}`);
  }finally{setCombatVariant({});}
  const m=match(2,0,2,rules);run(m,30,tapAttack,f=>f>=3?{guard:true}:{});
  assert.ok(m.players[1].charge>0,'perfect guard charges');
  const sol=fighters.findIndex(f=>f.id==='sol'),r=match(sol,0,6,rules);
  const arrival=run(match(sol,0,6,rules),60,tapAttack).find(e=>e.type==='hit').f;
  const ev=run(r,60,tapAttack,f=>f>=arrival-4?{guard:true}:{});assert.ok(ev.some(e=>e.type==='parry'),'a fresh guard reflects a bolt');
 }
});

test('replay equals step in every mode',()=>{
 for(const rules of [{},{spacing:'band'},{spacing:'riskyshot'},{guard:'split'},{spacing:'band',guard:'split'}]){
  setCombatVariant(rules);
  try{
   for(const name of ['strike3','guard-hit','capture','recoil','approach']){
    const s=createScenario(name,2,3);const frames=[];
    for(let f=0;f<90;f++){stepScenario(s);frames.push(JSON.stringify(s.m.players.map(snapshot)));}
    for(const f of [10,45,89])assert.equal(JSON.stringify(scenarioAt(name,f+1,2,3).m.players.map(snapshot)),frames[f],`${name} ${JSON.stringify(rules)} frame ${f}`);
   }
   // Band whiffs and riskyshots replay the same way.
   const once=()=>{const m=match(3,2,fighters[3].reach+.5,rules);const out=[];run(m,80,f=>f===0||f===40?{attack:true}:f>45?{x:1}:{},f=>f>20?{x:1,guard:f>50}:{});out.push(JSON.stringify(m.players.map(snapshot)));return out.join();};
   assert.equal(once(),once());
  }finally{setCombatVariant({});}
 }
});

test('sandbox recipes band-whiff and risky-shot show the opening in each mode',()=>{
 const play=(name,rules)=>{setCombatVariant(rules);try{const s=createScenario(name,2,3);const ev=[];for(let f=0;f<80;f++){stepScenario(s);for(const e of s.m.events)ev.push({f,...e});}return {s,ev,kind:null};}finally{setCombatVariant({});}};
 const firstKind=(name,rules)=>{setCombatVariant(rules);try{const s=createScenario(name,2,3);for(let f=0;f<10&&!s.m.players[0].move;f++)stepScenario(s);return s.m.players[0].move;}finally{setCombatVariant({});}};
 assert.equal(firstKind('band-whiff',{}).kind,'shot');assert.equal(firstKind('band-whiff',{spacing:'band'}).kind,'strike');
 assert.ok(play('band-whiff',{spacing:'band'}).ev.some(e=>e.type==='hit'&&e.attacker===1),'Morrow punishes Tala\'s band whiff (instant reaction)');
 assert.ok(firstKind('risky-shot',{spacing:'riskyshot'}).riskyShot);assert.ok(!firstKind('risky-shot',{}).riskyShot);
 assert.ok(play('risky-shot',{spacing:'riskyshot'}).ev.some(e=>e.type==='hit'&&e.attacker===1),'Morrow punishes Tala\'s point-blank riskyshot');
});

test('training floor marker: reach and band edge only when a spacing switch is on',()=>{
 assert.equal(spacingMarker(createMatch(2,1,'training').rules,fighters[2]),null);
 const s=spacingMarker({spacing:'band'},fighters[2]);assert.equal(s.reach,fighters[2].reach);assert.equal(s.edge,fighters[2].reach+BAND);
 assert.ok(inBand(fighters[2],fighters[2].reach)&&!inBand(fighters[2],fighters[2].reach+BAND));
});
