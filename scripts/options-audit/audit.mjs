import {airlockRemaining} from '../../dist/air-recovery-lock.js';
// OPTIONS-AUDIT: run every situation's attacker option x defender option for all 30 ordered fighter pairs,
// committed (both start together: a guess) and with the defender reacting 15 frames after the attacker's
// first visible action. Writes JSON and a Markdown summary. Analysis only.
// node scripts/options-audit/audit.mjs [outDir] [--opts=key=value,...]
import {writeFileSync,mkdirSync,readFileSync} from 'node:fs';
import {exchange,verdict,at,react,ADAM,OPTIONS,dist,confirmedLaunch} from './lib.mjs';
import {update,neutral,STEP} from '../../dist/combat.js';
import {canChain} from '../../dist/moves.js';

const out=process.argv[2]&&!process.argv[2].startsWith('--')?process.argv[2]:'art/review-2026-11-06/options-audit';
const extra=Object.fromEntries((process.argv.find(a=>a.startsWith('--opts='))?.slice(7).split(',').filter(Boolean)||[]).map(kv=>kv.split('=')));
const OPTS={...ADAM,...extra};
const roster=JSON.parse(readFileSync(new URL('../../dist/balance/roster.json',import.meta.url)));
const fighters=(roster.fighters||roster).map(f=>f.id),speed=Object.fromEntries((roster.fighters||roster).map(f=>[f.id,f.speed]));
const startup=(id,key)=>(roster.fighters||roster).find(f=>f.id===id).moves.find(x=>x.key===key)?.startup;
const pairs=[];for(let a=0;a<6;a++)for(let b=0;b<6;b++)if(a!==b)pairs.push([a,b]);

// Extra options that need live state.
Object.assign(OPTIONS,{
 // Chain on a guarding rival: each tap waits for the previous hit's contact (as the reversal recipe does).
 chain3:(k,m,me)=>k===0||me.move&&me.move.chain<3&&canChain(me.move)&&!me.prev.attack?{attack:true}:{},
 chain2grab:(k,m,me)=>k===0||me.move?.chain===1&&canChain(me.move)&&!me.prev.attack?{attack:true}:me.move?.chain===2&&canChain(me.move)&&!me.prev.capture?{capture:true}:{},
 chain2stop:(k,m,me)=>k===0||me.move?.chain===1&&canChain(me.move)&&!me.prev.attack?{attack:true}:{guard:k>30},
 chain2late:(k,m,me)=>{if(k===0||me.move?.chain===1&&canChain(me.move)&&!me.prev.attack)return {attack:true};me.lateAt??=null;if(me.move?.chain===2&&me.move.frame>=me.move.startup)me.lateAt??=k;return me.lateAt!==null&&k===me.lateAt+14?{attack:true}:{};},
 // Defender holds guard and re-taps two frames before a third chain hit lands (perfect information: an upper bound).
 reversal:(k,m,me,rv)=>({guard:!(rv.move?.chain===3&&rv.move.frame===rv.move.startup-2)}),
 guardThenStrike:(k,m,me)=>{me.bs??=0;if(me.blockStun>0&&!me.wasB)me.bs++;me.wasB=me.blockStun>0;return me.bs>=2&&me.blockStun<=0?{attack:!me.prev.attack}:{guard:true};},
 guardThenBackdash:(k,m,me)=>{me.bs??=0;if(me.blockStun>0&&!me.wasB)me.bs++;me.wasB=me.blockStun>0;return me.bs>=2&&me.blockStun<=0?(me.bd=(me.bd??-1)+1,me.bd===1||me.bd===3?{x:-1}:{}):{guard:true};},
 // Capture break tapped when an incoming circle is about 6 frames out (reacting to its arrival, not its throw).
 breakTap:(k,m,me)=>{const p=m.projectiles.find(q=>q.kind==='capture'&&q.owner!==m.players.indexOf(me));if(!p)return {};const s=Math.hypot(p.dx,p.dz)||1,d=Math.max(0,Math.hypot(me.x-p.x,me.z-p.z)-(p.radius||.65)-.5);return {guard:d/s*60<=6};},
 airRecover:()=>({guard:true}),
 airRecoverReact:()=>({guard:true}),
 airRecoverUnlock:()=>({guard:true}),airRecoverLate:()=>({guard:true}),
 rollAway:k=>k===0?{x:-1}:{},rollToward:k=>k===0?{x:1}:{},rollSide:k=>k===0?{z:1}:{},
 guardGetup:k=>({guard:true}),getupAttack:k=>k===0?{attack:true}:{},
 waitPunish:(k,m,me,rv)=>rv.move||rv.roll||rv.getUp||rv.knockdown||rv.stun>0?{guard:true}:{attack:!me.prev.attack&&dist(me,rv)<2.6},
 meaty:k=>k===0?{attack:true}:{},meatyGrab:k=>k===0?{capture:true}:{},
 // Delayed options start once the rival has stood up, so a guard tap made during the get-up is no longer fresh at contact.
 delayGrab:k=>k===0?{capture:true}:{},delayStrike:k=>k===0?{attack:true}:{},
 // Third-hit defenders: hold guard, then strike the moment blockstun ends and the attacker is not attacking.
 guardPunish:(k,m,me,rv)=>{const free=me.blockStun<=0&&!me.move;const open=!rv.move||rv.move.frame>rv.move.startup+(rv.move.active||1);return free&&open&&k>8&&dist(me,rv)<3.3?{attack:!me.prev.attack}:{guard:true};},
 mashAfterBlock:(k,m,me)=>{me.bs??=0;if(me.blockStun>0&&!me.wasB)me.bs++;me.wasB=me.blockStun>0;return me.bs>=1&&me.blockStun<=0?{attack:!me.prev.attack}:{guard:true};},
 backdashAfter2:(k,m,me)=>{me.bs??=0;if(me.blockStun>0&&!me.wasB)me.bs++;me.wasB=me.blockStun>0;if(me.bs>=2&&me.blockStun<=0){me.bd=(me.bd??-1)+1;return me.bd===1||me.bd===3?{x:-1}:{};}return {guard:true};},
 pursuitAir:k=>k===0?{pursuit:true}:{},
 chargeLong:k=>({attack:k<150}),
});
const when=test=>({kind:'when',test});

const airStarts=new WeakMap();
const launchedSetup=m=>{confirmedLaunch(m);airStarts.set(m,m.tick);};
function knockedSetup(m){const [a,b]=m.players;for(let f=0;f<200;f++){update(m,[{...neutral(),launch:f===0},neutral()],STEP);if(b.knockdown)return;}}

const SITUATIONS={
 close:{about:'Point blank, 2.0 units, both neutral',distance:2,
  A:['strike','grab','launcher','upSpecial','towardSpecial','wait'],
  D:['guard','strike','grab','backdash','sidestep','freshGuard','wait']},
 tip:{about:'Edge of reach, 2.8 units: outside most strikes, inside grab range',distance:2.8,
  A:['strike','grab','launcher','upSpecial','pursuit','dashStrike','wait'],
  D:['guard','strike','grab','backdash','sidestep','walkIn','wait']},
 third:{about:'Defender guarding a chain: attacker chooses what follows hit 2',distance:1.8,
  A:['chain3','chain2grab','chain2stop','chain2late'],
  D:['guardPunish','reversal','mashAfterBlock','backdashAfter2'],noReact:true,noPhase2:true,frames:110},
 middle:{about:'Middle range, 5 units',distance:5,
  A:['towardSpecial','towardAlt','awaySpecial','awayAlt','upSpecial','pursuit','dashStrike','grab'],
  D:['guard','sidestep','backdash','walkIn','shot','charge','wait']},
 far:{about:'Far range, 9 units',distance:9,
  A:['shot','towardSpecial','towardAlt','grab','chargeLong','dashStrike'],
  D:['guard','breakTap','sidestep','walkIn','shot','charge','wait']},
 air:{about:'After a landed launcher: the defender is airborne',distance:2,setup:launchedSetup,
  A:['pursuitAir','wait'],
  D:['airRecover','airRecoverUnlock','airRecoverLate','airRecoverReact','wait'],noReact:true},
 wake:{about:'Defender knocked down 2.5 units away; attacker times an option to their wake-up',distance:2,setup:knockedSetup,
  A:['meaty','meatyGrab','delayGrab','delayStrike','waitPunish','backdash'],
  D:['wait','rollAway','rollToward','rollSide','guardGetup','getupAttack'],noReact:true},
};
const stunFrames=p=>Math.round(p.stun/STEP);
function triggers(name,role,option,ids){
 if(name==='wake'){
  if(role==='A'){if(option==='meaty')return when((m,me,rv)=>rv.knockdown||rv.getUp?stunFrames(rv)<=startup(fighters[ids[0]],'chain-strike-1'):false);
   if(option==='meatyGrab')return when((m,me,rv)=>rv.knockdown||rv.getUp?stunFrames(rv)<=13:false);
   if(option==='delayGrab'||option==='delayStrike')return when((m,me,rv)=>rv.seenDown&&!rv.knockdown&&!rv.getUp&&rv.stun<=0||((rv.knockdown||rv.getUp)&&(rv.seenDown=true)&&false));return at(0);}
  if(option==='getupAttack')return when((m,me)=>me.knockdown&&stunFrames(me)<=6||me.getUp&&stunFrames(me)<=6);
  return when((m,me)=>(me.knockdown||me.getUp)&&stunFrames(me)<=30);}
 if(name==='air'){if(role==='D'&&option==='airRecoverUnlock')return when((m,me)=>airlockRemaining(m,me)<=1);if(role==='D'&&option==='airRecoverLate')return when(m=>m.tick-airStarts.get(m)>=24);if(role==='A')return option==='pursuitAir'?when((m,me)=>me.move?.kind==='launch'&&me.move.connected||!me.move&&me.cool<=0):at(0);return option==='airRecoverReact'?when((m,me,rv)=>rv.move?.kind==='pursuit'&&rv.move.frame>=15||rv.move?.kind==='pursuit'&&rv.move.frame>=rv.move.startup-1&&false):at(0);}
 if(name==='third'&&role==='D')return at(0);
 if(role==='D'&&option==='freshGuard')return at(4); // committed guess: tap so the guard is fresh at a 13f grab's contact
 return at(0);
}
const results={opts:OPTS,build:JSON.parse(readFileSync(new URL('../../dist/skill/build.json',import.meta.url))).hash,situations:{}};
for(const [name,s] of Object.entries(SITUATIONS)){
 const modes=s.noReact?['committed']:['committed','react15'];const cells=[];
 for(const mode of modes)for(const A of s.A)for(const D of s.D){
  if(mode==='react15'&&['wait','charge','shot','walkIn'].includes(D))continue;
  const tally={A:0,D:0,'=':0},examples=[];
  for(const [p1,p2] of pairs){
   const dTrig=mode==='react15'?react(15):triggers(name,'D',D,[p1,p2]);
   const r=exchange({p1,p2,distance:s.distance,opts:OPTS,frames:s.frames||(name==='far'?200:150),noPhase2:!!s.noPhase2,
    setup:s.setup,
    attacker:{option:A,trigger:triggers(name,'A',A,[p1,p2])},defender:{option:D,trigger:dTrig}});
   const v=verdict(r);tally[v]++;
   if(fighters[p1]==='tala'&&fighters[p2]==='morrow'||fighters[p1]==='morrow'&&fighters[p2]==='tala')examples.push({pair:`${fighters[p1]}>${fighters[p2]}`,v,...r});
  }
  cells.push({mode,A,D,tally,examples});
 }
 results.situations[name]={about:s.about,distance:s.distance,cells};
 console.log(name,'done',cells.length,'cells');
}
mkdirSync(out,{recursive:true});writeFileSync(`${out}/audit.json`,JSON.stringify(results,null,1));
// Markdown: one table per situation and mode; each cell = who comes out ahead across 30 pairs.
const mark=t=>{const n=t.A+t.D+t['='];const top=Object.entries(t).sort((x,y)=>y[1]-x[1])[0];return top[1]===n?top[0]:`${top[0]} ${top[1]}/${n}`;};
let md=`# Options audit tables\n\nBuild \`${results.build}\`, switches ${Object.entries(OPTS).map(([k,v])=>`${k}=${v}`).join('&')}. Each cell: who comes out ahead over all 30 ordered fighter pairs. **A** = attacker's option wins, **D** = defender's, **=** = even/safe (neither can punish). "A 22/30" means a split, with the majority shown.\n`;
for(const [name,s] of Object.entries(results.situations)){
 for(const mode of [...new Set(s.cells.map(c=>c.mode))]){const cs=s.cells.filter(c=>c.mode===mode),Ds=[...new Set(cs.map(c=>c.D))],As=[...new Set(cs.map(c=>c.A))];
  md+=`\n## ${name} — ${mode==='committed'?'both commit (guess)':'defender reacts at 15f'}\n\n${s.about}.\n\n| Attacker ↓ / Defender → | ${Ds.join(' | ')} |\n|---|${Ds.map(()=>'---').join('|')}|\n`;
  for(const A of As)md+=`| ${A} | ${Ds.map(D=>{const c=cs.find(x=>x.A===A&&x.D===D);return c?mark(c.tally):'';}).join(' | ')} |\n`;}
}
writeFileSync(`${out}/tables.md`,md);console.log('wrote',out);
