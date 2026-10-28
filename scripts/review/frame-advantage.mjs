// SPACING-COMMITMENT measurement: runs the real simulation (dist/combat.js update) with scripted inputs and writes
// docs/FRAME_ADVANTAGE.md. Measurement only; it changes no rules.
//   1. Guard overlap: which fresh-guard timings beat a strike and which break a capture started on the same frame.
//   2. Blocked chains: for every attacker and every blocked hit 1, 2, 3 and chain finish, the frames until each side
//      can act, the distance after pushback, and whether each side's fastest move reaches from there; plus what
//      happens when the defender swings as soon as it is free (attacker stops vs attacker continues the chain).
//   3. Whiff punish (&spacing=band): attacker whiffs hit 1 just outside reach; can each defender close and land hit 1
//      before the attacker can act? With a 15-frame human reaction from the first whiffed active frame.
//   4. Sol's shot safety against each fighter's approach, default and &spacing=riskyshot.
// Usage: node scripts/review/frame-advantage.mjs [--out docs/FRAME_ADVANTAGE.md]
import {createMatch,update,neutral,STEP} from '../../dist/combat.js';
import {fighters} from '../../dist/fighters.js';
import {moveTiming,canChain} from '../../dist/moves.js';
import {SPACING_COMMITMENT} from '../../dist/spacing-commitment.js';
import {writeFileSync} from 'node:fs';
export const REACTION=15;
const N=fighters.length,name=i=>fighters[i].name[0]+fighters[i].name.slice(1).toLowerCase();
const dist=m=>Math.hypot(m.players[0].x-m.players[1].x,m.players[0].z-m.players[1].z);
export function setup(att,def,d,rules={}){
 const m=createMatch(att,def,'training','normal',rules);
 m.players[0].x=0;m.players[1].x=d;m.players[0].z=m.players[1].z=0;
 for(const p of m.players){p.lookX=p===m.players[0]?1:-1;p.lookZ=0;p.face=p===m.players[0]?1:-1;}
 return m;
}
const free=p=>!p.move&&p.cool<=0&&p.stun<=0&&!p.travel&&!p.jumpSquat&&p.blockStun<=0&&!p.staggerState&&p.air<=0&&!p.knockback;
const hit1=i=>moveTiming(fighters[i],'strike',1);
// Index of the player an event happened to (block/parry events carry only a position).
const at=(m,e)=>Math.hypot(m.players[0].x-e.x,m.players[0].z-e.z)<Math.hypot(m.players[1].x-e.x,m.players[1].z-e.z)?0:1;

// ---- 1. Guard overlap ----
// tap: the defender's input. 'guard' is held from frame g; 'capture' is a single press on frame g.
export function guardOutcome(att,kind,g,rules={},tap='guard'){
 const m=setup(att,att===0?1:0,2,rules);let out='none';
 for(let f=0;f<70&&out==='none';f++){
  update(m,[{...neutral(),...(f===0?{[kind==='strike'?'attack':'capture']:true}:{})},{...neutral(),...(tap==='guard'?f>=g?{guard:true}:{}:f===g?{capture:true}:{})}],STEP);
  for(const e of m.events){
   if(e.type==='parry')out='perfect';else if(e.type==='block')out='block';else if(e.type==='hit')out='hit';
   else if(e.type==='hint'&&e.text==='CAPTURE BREAK')out='break';else if(e.type==='cinematic')out='captured';
  }
 }
 return out;
}
function splitOverlap(){
 const rules={guard:'split'};
 return fighters.map((f,ai)=>{
  const perfect=[],guardBreaks=[],tech=[],techVsStrike=[];
  for(let g=-5;g<=20;g++){
   if(guardOutcome(ai,'strike',g,rules)==='perfect')perfect.push(g);
   if(guardOutcome(ai,'capture',g,rules)==='break')guardBreaks.push(g);
   if(guardOutcome(ai,'capture',g,rules,'capture')==='break')tech.push(g);
   const o=guardOutcome(ai,'strike',g,rules,'capture');if(o!=='hit')techVsStrike.push(`${g}:${o}`);
  }
  return {fighter:name(ai),perfect:[perfect[0],perfect.at(-1)],guardBreaks:guardBreaks.length,tech:[tech[0],tech.at(-1)],techCount:tech.length,techVsStrike};
 });
}
function guardOverlap(){
 return fighters.map((f,ai)=>{
  const perfect=[],brk=[];
  for(let g=-5;g<=20;g++){if(guardOutcome(ai,'strike',g)==='perfect')perfect.push(g);if(guardOutcome(ai,'capture',g)==='break')brk.push(g);}
  const both=perfect.filter(g=>brk.includes(g));
  return {fighter:name(ai),perfect:[perfect[0],perfect.at(-1)],break:[brk[0],brk.at(-1)],both:both.length?[both[0],both.at(-1)]:null,count:both.length,perfectCount:perfect.length};
 });
}

// ---- 2. Blocked chains ----
const FINISHES={hit3:null,launch:{launch:true},capture:{capture:true},forward:{x:1,attack:true},back:{x:-1,attack:true},technique:{z:-1,attack:true}};
const STEPS=[['hit 1',1,null],['hit 2',2,null],['hit 3',3,null],...['launch','capture','forward','back','technique'].map(k=>[k+' (from hit 2)',2,k])];
// Attacker P1 chains to `target` (each tap on the first chainable frame), then optionally a finish.
// After its last press it holds guard (guard engages only once it is free). defenderPolicy(m,f,ctx) gives P2's input.
function chainRun(att,def,target,finish,defenderPolicy,frames=160,rules={}){
 const m=setup(att,def,2,rules),ctx={contact:null,contactKind:null,aFree:null,dFree:null,events:[],lastPress:0,done:false,dAtFree:null};
 let pressedFinish=false;
 for(let f=0;f<frames;f++){
  const a=m.players[0],b=m.players[1];let ia={};
  const chainable=a.move&&canChain(a.move)&&!a.prev.attack&&!a.prev.capture&&!a.prev.launch;
  if(f===0)ia={attack:true};
  else if(!ctx.done&&chainable&&a.move.kind==='strike'&&a.move.chain<target){ia={attack:true};ctx.lastPress=f;}
  else if(!ctx.done&&finish&&!pressedFinish&&chainable&&a.move.kind==='strike'&&a.move.chain===2){ia=FINISHES[finish];pressedFinish=true;ctx.lastPress=f;}
  else if(f>ctx.lastPress+2&&(!finish||pressedFinish)&&!(a.move?.kind==='strike'&&a.move.chain<target))ia={guard:true};
  const ib=defenderPolicy(m,f,ctx)||{};
  update(m,[{...neutral(),...ia},{...neutral(),...ib}],STEP);
  const isTarget=()=>finish?finish==='hit3'?a.move?.chain===3:pressedFinish&&!(a.move?.kind==='strike'&&a.move.chain===2):a.move?.kind==='strike'&&a.move.chain===target;
  for(const e of m.events){
   ctx.events.push({f,...e});
   if(ctx.contact===null&&isTarget()){
    if((e.type==='block'||e.type==='parry')&&at(m,e)===1){ctx.contact=f;ctx.contactKind=e.type;}
    else if(e.type==='hit'&&e.defender===1){ctx.contact=f;ctx.contactKind='hit';}
    else if(e.type==='cinematic'){ctx.contact=f;ctx.contactKind='captured';}
   }
  }
  if(ctx.contact!==null){
   if(ctx.dFree===null&&free(b)&&!m.cinematic){ctx.dFree=f;ctx.dAtFree=dist(m);}
   if(ctx.aFree===null&&free(a)&&!m.cinematic)ctx.aFree=f;
  }
  if(!ctx.done&&ctx.contact!==null)ctx.done=true;
 }
 ctx.m=m;return ctx;
}
const holdGuard=()=>({guard:true});
// The defender holds guard until it is free after the measured contact, then taps attack once.
const swingWhenFree=(m,f,ctx)=>{const b=m.players[1];
 if(ctx.contact===null||!free(b)&&!ctx.swing)return {guard:true};
 if(!ctx.swing){ctx.swing=f;return {attack:true};}
 return {};
};
function blockedChains(){
 const rows=[];
 for(let ai=0;ai<N;ai++){
  const di=ai===0?1:0;
  for(const [label,target,finish] of STEPS){
   const r=chainRun(ai,di,target,finish==='hit3'?null:finish,holdGuard);
   if(r.contact===null){rows.push({attacker:name(ai),step:label,outcome:'no contact'});continue;}
   const aAct=r.aFree===null?null:r.aFree-r.contact,dAct=r.dFree===null?null:r.dFree-r.contact,d=r.dAtFree??dist(r.m);
   // Stop: defender (each fighter) swings when free; does it hit before the attacker can guard?
   const stop={},cont={};
   for(let dj=0;dj<N;dj++){
    const s=chainRun(ai,dj,target,finish==='hit3'?null:finish,swingWhenFree);
    stop[dj]=s.events.some(e=>e.type==='hit'&&e.attacker===1&&e.f>s.contact);
    if(!finish&&target<3){ // continue: the attacker chains on into the next hit while the defender swings when free
     const c=chainRun(ai,dj,target+1,null,(m,f,ctx)=>{const b=m.players[1],a=m.players[0];
      if(!ctx.mid&&a.move?.chain===target&&ctx.events.some(e=>(e.type==='block'||e.type==='parry')&&e.f<f))ctx.mid=f;
      if(!ctx.mid||!free(b)&&!ctx.swing)return {guard:true};if(!ctx.swing){ctx.swing=f;return {attack:true};}return {};});
     const dHit=c.events.find(e=>e.type==='hit'&&e.attacker===1),aHit=c.events.find(e=>e.type==='hit'&&e.attacker===0);
     cont[dj]=!dHit&&!aHit?'neither':dHit&&(!aHit||dHit.f<aHit.f)?'defender':aHit&&dHit&&aHit.f===dHit.f?'trade':'attacker';
    }
   }
   const reachA=d<fighters[ai].reach,reachD=fighters.map((f,j)=>d<f.reach?name(j):null).filter(Boolean);
   rows.push({attacker:name(ai),step:label,outcome:r.contactKind,aAct,dAct,adv:aAct!==null&&dAct!==null?dAct-aAct:null,d:+d.toFixed(2),reachA,reachD,
    stopPunished:Object.entries(stop).filter(([,v])=>v).map(([j])=>name(+j)),cont:Object.keys(cont).length?cont:null});
  }
 }
 return rows;
}

// ---- 3/4. Whiff and shot punishes ----
// The attacker presses attack at frame 0 from distance d, then holds guard from frame 3 (it engages once free,
// fresh, so the first 10 frames are a perfect guard). The defender guards until frame `start`, then walks in and
// taps attack once it is inside its own reach. Returns whether the defender's hit lands.
// extraRecovery adds frames to the attacker's move inside this measurement only (to size a proposal); rules are untouched.
export function punishRun(att,def,d,start,rules,extraRecovery=0){
 const m=setup(att,def,d,rules);let pressed=false,landed=false,stim=null,attKind=null,aFree=null,stretched=false;
 for(let f=0;f<120&&!landed;f++){
  const a=m.players[0],b=m.players[1];
  const ia=f===0?{attack:true}:f>=3?{guard:true}:{};
  let ib={guard:true};
  if(f>=start){
   const dd=dist(m);
   if(!pressed&&!b.move&&free(b)&&dd<fighters[def].reach-.05){ib={attack:true};pressed=true;}
   else ib=pressed?{}:{x:1};
  }
  update(m,[{...neutral(),...ia},{...neutral(),...ib}],STEP);
  if(a.move&&!stretched){stretched=true;a.move.recovery+=extraRecovery;a.move.total+=extraRecovery;}
  if(a.move&&!attKind)attKind=a.move.kind;
  // The stimulus a human reacts to: the attacker's first active (whiffed or released) frame.
  if(stim===null&&a.move&&a.move.frame===a.move.startup)stim=f;
  if(aFree===null&&f>1&&!a.move&&a.cool<=0)aFree=f;
  for(const e of m.events)if(e.type==='hit'&&e.attacker===1)landed=f;
  if(m.events.some(e=>e.type==='hit'&&e.attacker===0))return {landed:false,gotHit:true,stim,attKind,aFree};
 }
 return {landed,stim,attKind,aFree};
}
export function punishWindow(att,def,d,rules,extra=0){
 const base=punishRun(att,def,d,999,rules,extra),stim=base.stim;let latest=null,earliest=null;
 for(let s=0;s<=stim+45;s++){const r=punishRun(att,def,d,s,rules,extra);if(r.landed!==false&&r.landed!==null){latest=s;earliest??=s;}}
 const rel=latest===null?null:latest-stim;
 const verdict=latest===null?'not punishable':rel>=REACTION?'on reaction':'only on a guess';
 return {kind:base.attKind,stim,aFree:base.aFree,latest:rel,earliest:earliest===null?null:earliest-stim,verdict};
}
function whiffTable(){
 const rows=[];
 for(let ai=0;ai<N;ai++)for(let di=0;di<N;di++){
  const d=fighters[ai].reach+.05;
  rows.push({attacker:name(ai),defender:name(di),d:+d.toFixed(2),...punishWindow(ai,di,d,{spacing:'band'}),need:neededRecovery(ai,di,d,{spacing:'band'})});
 }
 return rows;
}
// Smallest extra recovery (frames) that makes the attacker's move punishable on reaction by this defender.
export function neededRecovery(att,def,d,rules,max=40){
 const ok=x=>punishWindow(att,def,d,rules,x).verdict==='on reaction';
 if(ok(0))return 0;if(!ok(max))return null;
 let lo=0,hi=max;while(hi-lo>1){const mid=(lo+hi)>>1;if(ok(mid))hi=mid;else lo=mid;}
 return hi;
}
// Tala vs Morrow, spelled out: frames from Morrow's whiff to Tala's contact when she starts on reaction.
function talaVsMorrow(){
 const t=fighters.findIndex(f=>f.id==='tala'),mo=fighters.findIndex(f=>f.id==='morrow'),d=fighters[mo].reach+.05;
 const base=punishRun(mo,t,d,999,{spacing:'band'}),stim=base.stim;
 const m=setup(mo,t,d,{spacing:'band'});let contactAt=null,pressAt=null;
 for(let f=0;f<120&&contactAt===null;f++){const b=m.players[1];let ib={guard:true};
  if(f>=stim+REACTION){if(pressAt===null&&dist(m)<fighters[t].reach-.05){ib={attack:true};pressAt=f;}else ib=pressAt===null?{x:1}:{};}
  update(m,[{...neutral(),...(f===0?{attack:true}:{})},{...neutral(),...ib}],STEP);
  if(b.move&&b.move.frame===b.move.startup)contactAt=f;}
 return {gap:+(d-fighters[t].reach).toFixed(2),walk:pressAt-(stim+REACTION),contact:contactAt-stim,morrowFree:base.aFree-stim};
}
function solShot(){
 const sol=fighters.findIndex(f=>f.id==='sol'),rows=[],band=fighters[sol].reach+SPACING_COMMITMENT.band/2;
 for(const [label,d,rules] of [[`in band (${band.toFixed(2)}), default`,band,{}],[`in band (${band.toFixed(2)}), riskyshot`,band,{spacing:'riskyshot'}],['4.0, default',4,{}],['6.0, default',6,{}]])
  for(let di=0;di<N;di++)rows.push({at:label,defender:name(di),...punishWindow(sol,di,d,rules)});
 return rows;
}
// Riskyshot for everyone at the middle of their band, so the switch can be judged per fighter.
function riskyTable(){
 const rows=[];
 for(let ai=0;ai<N;ai++){const d=fighters[ai].reach+SPACING_COMMITMENT.band/2;
  for(const rules of [{},{spacing:'riskyshot'}]){const res=fighters.map((f,di)=>punishWindow(ai,di,d,rules));
   rows.push({attacker:name(ai),mode:rules.spacing||'default',d:+d.toFixed(2),res,need:rules.spacing?fighters.map((f,di)=>neededRecovery(ai,di,d,rules)):null});}}
 return rows;
}

// ---- Report ----
const yes=v=>v?'yes':'no',fmt=v=>v===null||v===undefined?'—':v;
export function report(){
 const so=splitOverlap(),go=guardOverlap(),bc=blockedChains(),wt=whiffTable(),ss=solShot(),rt=riskyTable(),tm=talaVsMorrow();
 const L=[];
 L.push('# Frame advantage, guard overlap and whiff punishes','',
  `Generated by \`node scripts/review/frame-advantage.mjs\` from the real simulation (\`dist/combat.js\` \`update\`, 60 Hz, scripted inputs). Measurement only: SPACING-COMMITMENT changes no default rule. Frames are update steps, so hitstop counts as real frames. Band width ${SPACING_COMMITMENT.band}, riskyshot +${SPACING_COMMITMENT.riskyShot.startup} startup / +${SPACING_COMMITMENT.riskyShot.recovery} recovery: playtest guesses, not tuned values.`,'',
  'Input model: attacks fire on the release frame (press, then release one frame later), as in the game. Human reaction is taken as '+REACTION+' frames.','');
 L.push('## 1. Guard overlap (default rules)','',
  'Perfect guard counts while `guardTime < .17` (guard frames 1–10). The capture break counts while `guardTime < .2` (guard frames 1–12: the 12th accumulated step is 0.19999…, under the threshold). Below, a guard tap on frame *g* relative to the attacker\'s press on frame 0, against a hit 1 strike or a capture started on the same frame.','',
  '| Attacker | Perfect guard taps | Capture-break taps | One tap beats both | Share of perfect taps that also break |','| --- | --- | --- | --- | --- |');
 for(const r of go)L.push(`| ${r.fighter} | ${r.perfect.join('–')} | ${r.break.join('–')} | ${r.both?r.both.join('–'):'none'} | ${r.count} / ${r.perfectCount} |`);
 L.push('','A held guard (older than 12 frames) blocks strikes and loses to a capture. A tap inside the overlap beats both with no read.','');
 L.push('### With `&guard=split`','','A fresh guard keeps its perfect-guard window against strikes and projectiles but no longer breaks a capture. A capture is broken by a single press of the capture button, while not guarding, within '+SPACING_COMMITMENT.captureTechFrames+' frames before it lands. That press starts the defender\'s own capture (13 startup), so a strike beats it.','',
  '| Attacker | Perfect guard taps | Guard taps that break a capture | Capture-tap timings that break a capture | Capture tap against a strike |','| --- | --- | --- | --- | --- |');
 for(const r of so)L.push(`| ${r.fighter} | ${r.perfect.join('–')} | ${r.guardBreaks||'none'} | ${r.tech.join('–')} (${r.techCount}) | ${r.techVsStrike.length?r.techVsStrike.join(', '):'always hit'} |`);
 L.push('');
 L.push('## 2. Blocked chains','',
  'The attacker starts at distance 2.0 and taps each hit on its first chainable frame against a held guard (a plain block, not a perfect guard). Finishes come out of hit 2 at its cancel frame. *Attacker acts* / *defender acts*: frames after the blocked contact until each side is free (the attacker\'s chain cancel is earlier; see the continue column). *Advantage* is defender acts minus attacker acts: negative means the defender is free first. Blocks have no pushback today, so the distance is the chain advance only.','',
  '*Stop*: the attacker stops and holds guard (a fresh guard once free); the defender swings as soon as it is free. Listed: defenders whose swing lands. *Continue*: the attacker chains on; the defender swings when free. Each defender gets A (attacker\'s next hit lands first), D (defender interrupts), T (trade) or – (neither lands).','',
  '| Attacker | Blocked | Result | Attacker acts | Defender acts | Advantage | Distance | Attacker hit 1 reaches | Defender hit 1 reaches | Stop: punished by | Continue (Aeg Rei Tal Mor Sol Ves) |','| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |');
 const flags=[];
 for(const r of bc){
  if(r.outcome==='no contact'){L.push(`| ${r.attacker} | ${r.step} | no contact | | | | | | | | |`);continue;}
  const cont=r.cont?Object.values(r.cont).map(v=>({attacker:'A',defender:'D',trade:'T',neither:'–'}[v])).join(' '):'';
  L.push(`| ${r.attacker} | ${r.step} | ${r.outcome} | ${fmt(r.aAct)} | ${fmt(r.dAct)} | ${fmt(r.adv)} | ${r.d} | ${yes(r.reachA)} | ${r.reachD.join(', ')||'none'} | ${r.stopPunished.join(', ')||'nobody'} | ${cont} |`);
  if(r.outcome==='block'||r.outcome==='parry'){
   if(r.cont&&Object.values(r.cont).every(v=>v==='attacker'))flags.push(`${r.attacker} ${r.step}: **continuing always wins** (no defender interrupts the next hit).`);
   if(r.cont&&Object.values(r.cont).every(v=>v==='defender'))flags.push(`${r.attacker} ${r.step}: continuing always loses (every defender interrupts).`);
   if(!r.stopPunished.length)flags.push(`${r.attacker} ${r.step}: **stopping always wins** (safe on block against every defender).`);
   if(r.stopPunished.length===N)flags.push(`${r.attacker} ${r.step}: stopping always loses (every defender punishes).`);
  }
  if(r.outcome==='captured')flags.push(`${r.attacker} ${r.step}: the capture finish beats a held guard outright (guard cannot answer it; only a fresh tap breaks it).`);
 }
 L.push('','### Flags','',...flags.map(f=>'- '+f),'');
 L.push('## 3. Whiff punish (`&spacing=band`)','',
  `The attacker presses hit 1 from its reach + 0.05 (inside the band, so it whiffs), then holds guard. The defender guards, then from a chosen frame walks in and taps hit 1 once inside its own reach. *Window* is the latest start frame, counted from the attacker's first whiffed active frame, that still lands: **on reaction** if at least ${REACTION}, **only on a guess** if the defender has to start earlier than a human can react, **not punishable** if no start lands. The attacker's fresh guard as it recovers is a perfect guard, so a late punish is deflected.`,'',
  '| Attacker \\ Defender | '+fighters.map((f,i)=>name(i)).join(' | ')+' |','| --- |'+' --- |'.repeat(N));
 for(let ai=0;ai<N;ai++){const cells=wt.filter(r=>r.attacker===name(ai)).map(r=>r.verdict==='on reaction'?`reaction (${r.latest})`:r.verdict==='only on a guess'?`guess (${r.latest})`:'no');L.push(`| ${name(ai)} (reach ${fighters[ai].reach}) | ${cells.join(' | ')} |`);}
 L.push('','Numbers are the latest working start frame relative to the first whiffed active frame (negative: the defender must already be moving before the swing is out).','');
 L.push('### Extra whiff recovery needed for a punish on reaction','','Smallest number of frames added to the whiffing attacker\'s recovery (inside this measurement only) that makes each pairing punishable on reaction. — means more than 40.','',
  '| Attacker \\ Defender | '+fighters.map((f,i)=>name(i)).join(' | ')+' | Worst case |','| --- |'+' --- |'.repeat(N+1));
 for(let ai=0;ai<N;ai++){const need=wt.filter(r=>r.attacker===name(ai)).map(r=>r.need);L.push(`| ${name(ai)} | ${need.map(fmt).join(' | ')} | ${need.includes(null)?'—':Math.max(...need)} |`);}
 L.push('',`Tala against Morrow's whiff: the gap from Morrow's reach + 0.05 to Tala's reach is ${tm.gap}. Starting on reaction (${REACTION} frames after the whiff is out) she walks ${tm.walk} frames and lands ${tm.contact} frames after the whiff began; Morrow can act ${tm.morrowFree} frames after it began, and his fresh guard then deflects her.`,'');
 L.push('## 4. Sol\'s shot (7 startup, 11 recovery) against each approach','',
  `Sol fires a neutral shot; the defender guards it (a plain block) and then walks in for hit 1. Window counted from the shot's release frame, ${REACTION}-frame reaction as above.`,'',
  '| Shot from | '+fighters.map((f,i)=>name(i)).join(' | ')+' |','| --- |'+' --- |'.repeat(N));
 for(const at of [...new Set(ss.map(r=>r.at))]){const cells=ss.filter(r=>r.at===at).map(r=>r.verdict==='on reaction'?`reaction (${r.latest})`:r.verdict==='only on a guess'?`guess (${r.latest})`:'no');L.push(`| ${at} | ${cells.join(' | ')} |`);}
 L.push('','## 5. Neutral shot from the middle of the band, default vs `&spacing=riskyshot`','',
  '| Shooter | Mode | Distance | '+fighters.map((f,i)=>name(i)).join(' | ')+' |','| --- | --- | --- |'+' --- |'.repeat(N));
 for(const r of rt)L.push(`| ${r.attacker} | ${r.mode} | ${r.d} | ${r.res.map(x=>x.verdict==='on reaction'?`reaction (${x.latest})`:x.verdict==='only on a guess'?`guess (${x.latest})`:'no').join(' | ')} |`);
 L.push('','Extra riskyshot recovery (on top of the current +'+SPACING_COMMITMENT.riskyShot.recovery+') needed for a punish on reaction, per defender. — means more than 40.','','| Shooter | '+fighters.map((f,i)=>name(i)).join(' | ')+' |','| --- |'+' --- |'.repeat(N));
 for(const r of rt.filter(r=>r.need))L.push(`| ${r.attacker} | ${r.need.map(fmt).join(' | ')} |`);
 L.push('');
 return {md:L.join('\n'),so,go,bc,wt,ss,rt,tm,flags};
}
if(import.meta.url===`file://${process.argv[1]}`){
 const out=process.argv.includes('--out')?process.argv[process.argv.indexOf('--out')+1]:'docs/FRAME_ADVANTAGE.md';
 const r=report();writeFileSync(out,r.md);console.log(r.md);
}
