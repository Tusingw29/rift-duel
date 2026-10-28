// Passive observer. Never writes match/player/event state. Shared by browser and Node.
import {observeCombat} from './observer.js';
import {fighters} from '../fighters.js';
import {matchFighter,balanceMoveKey} from '../balance-runtime.js';
export const BANDS=['close','inside reach','tip','whiff band','mid','far'];
export function distanceBand(d,r){return d<1.5?'close':d<r-.35?'inside reach':d<=r?'tip':d<=r+.7?'whiff band':d<7?'mid':'far';}
const blank=()=>({attackPresses:0,actionPresses:0,damage:0,chipTaken:0,blocks:0,perfectGuards:0,captureBreaks:0,capturesStarted:0,capturesLanded:0,captureDamage:0,capturePresses:0,grabAttackAttempts:0,grabAttackEligibleFrames:0,capturesFaced:0,closeCapturesFaced:0,reactionBreakAttempts:0,guessBreakAttempts:0,reactionBreaksLanded:0,guessBreaksLanded:0,breaksLanded:0,wastedBreakTaps:0,captures:0,capturesThroughGuard:0,meleeAttempts:0,whiffs:0,whiffPunishes:0,punishedWhiffs:0,shotsReceived:0,shotsGuarded:0,basicStrikesStarted:0,directionalSpecialsStarted:0,punishAttemptsStarted:0,damageByMove:{},moveUses:{},distanceFrames:Object.fromEntries(BANDS.map(k=>[k,0]))});
export function createTelemetry(m,meta={}){
 const data={schema:1,telemetryVersion:4,...meta,mode:meta.mode||'default',fighters:m.players.map(p=>fighters[p.id].id),players:[blank(),blank()],inputFrames:0,simulationFrames:0,winner:null,completed:false,koCause:null};
 const measuredEvents=[];const dispose=observeCombat(m,e=>measuredEvents.push(e));
 const breakAttempts=[[],[]];
 let before,previousInputs=[{},{}],lastWhiffs=[null,null],capture=null,lastDamage=['unknown','unknown'];
 const seen=new WeakSet(),resolved=new WeakSet(),projectileSource=new WeakMap();
 const label=(i,mv)=>mv?balanceMoveKey(fighters[m.players[i].id],mv)||mv.kind:'unknown';
 function track(i,mv){if(mv&&!seen.has(mv)){seen.add(mv);const p=data.players[i],k=label(i,mv);if(mv.kind==='capture'){p.capturesStarted++;const defender=data.players[1-i];defender.capturesFaced++;if(Math.hypot(m.players[0].x-m.players[1].x,m.players[0].z-m.players[1].z)<3.1)defender.closeCapturesFaced++;}if(mv.kind==='strike')p.basicStrikesStarted++;if(['forward','back','technique','capture'].includes(mv.kind))p.directionalSpecialsStarted++;if(before?.rivalRecovery?.[i])p.punishAttemptsStarted++;data.players[i].moveUses[k]=(data.players[i].moveUses[k]||0)+1;if(['strike','launch'].includes(mv.kind))data.players[i].meleeAttempts++;}}
 return {
  dispose,
  before(inputs,intents=[],grabIntents=[]){
   grabIntents.forEach((intent,i)=>{if(intent?.eligible)data.players[i].grabAttackEligibleFrames++;if(intent?.attempt&&inputs[i].capture&&!previousInputs[i].capture)data.players[i].grabAttackAttempts++;});
   intents.forEach((intent,i)=>{if(intent&&inputs[i][intent.button]&&!previousInputs[i][intent.button]){data.players[i][intent.kind+'BreakAttempts']++;breakAttempts[i].push({kind:intent.kind,tick:m.tick+1,landed:false,window:m.balance?.sys.captureBreak??12});}});
   before={rivalRecovery:m.players.map((p,i)=>{const v=m.players[1-i].move;return !!v&&v.frame>=v.startup+v.active;}),tick:m.tick,hp:m.players.map(p=>p.hp),guard:m.players.map(p=>p.guard),moves:m.players.map(p=>p.move),projectiles:[...m.projectiles],cinematic:m.cinematic};
   data.inputFrames++;
   inputs.forEach((a,i)=>{if(a.capture&&!previousInputs[i].capture)data.players[i].capturePresses++;if(a.attack&&!previousInputs[i].attack)data.players[i].attackPresses++;for(const k of ['attack','guard','capture','launch','pursuit','super'])if(a[k]&&!previousInputs[i][k])data.players[i].actionPresses++;previousInputs[i]={...a};});
   m.players.forEach((p,i)=>track(i,p.move));
  },
  after(){
   if(!before)throw Error('Call before(inputs) before update');
   const advanced=m.tick-before.tick;
   data.simulationFrames+=advanced;
   const d=Math.hypot(m.players[0].x-m.players[1].x,m.players[0].z-m.players[1].z);
   m.players.forEach((p,i)=>{
    data.players[i].distanceFrames[distanceBand(d,matchFighter(m,p).reach)]+=advanced;
    track(i,p.move);
    const mv=before.moves[i];
    if(mv&&!resolved.has(mv)&&['strike','launch'].includes(mv.kind)&&mv.frame>=mv.startup+mv.active){
     resolved.add(mv);if(!mv.connected&&!mv.contactResolved){data.players[i].whiffs++;lastWhiffs[i]={move:mv,punished:false};}
    }
    if(lastWhiffs[i]&&p.move!==lastWhiffs[i].move&&before.moves[i]!==lastWhiffs[i].move)lastWhiffs[i]=null;
   });
   for(const p of m.projectiles)if(!projectileSource.has(p))projectileSource.set(p,{owner:p.owner,key:label(p.owner,m.players[p.owner].move||before.moves[p.owner])});
   for(const e of measuredEvents){
    const a=e.attacker,b=e.defender;
    if(e.type==='captureStart'){data.players[a].capturesLanded++;capture={a,b,guard:e.guard};continue;}
    if(e.type==='captureBreak'){data.players[b].captureBreaks++;data.players[b].breaksLanded++;const attempt=breakAttempts[b].findLast(x=>!x.landed&&m.tick-x.tick>=0&&m.tick-x.tick<x.window);if(attempt){attempt.landed=true;data.players[b][attempt.kind+'BreaksLanded']++;}continue;}
    // Non-melee typed hit kinds are projectile contacts in the existing diagnostic contract.
    const shot=e.kind&&!['hit','capture','burst'].includes(e.kind);
    if(shot&&e.type==='damage')data.players[b].shotsReceived++;
    if(shot&&['block','perfectGuard'].includes(e.type))data.players[b].shotsGuarded++;
    if(e.type==='perfectGuard'){data.players[b].perfectGuards++;continue;}
    if(e.type==='block'){data.players[b].blocks++;data.players[b].chipTaken+=e.damage;}
    if(!['block','damage'].includes(e.type))continue;
    data.players[a].damage+=e.damage;
    let key=e.source?label(a,e.source):e.kind==='capture'?'system-capture-close-':e.kind==='hit'?'unknown':e.kind;
    if(!e.source&&!['capture','burst','hit'].includes(e.kind))key=e.kind+' (source unresolved)';
    if(!e.source&&e.kind!=='capture'){
     const removed=before.projectiles.filter(p=>p.owner===a&&!m.projectiles.includes(p));
     if(removed.length===1){const src=projectileSource.get(removed[0]);key=src?(src.owner===a?src.key:'reflected '+src.key):'projectile (source unresolved)';}
     else if(!removed.length&&e.kind==='hit'&&(before.moves[a]||m.players[a].move))key=label(a,before.moves[a]||m.players[a].move);
    }
    if(e.kind==='capture'){data.players[a].captureDamage+=e.damage;data.players[a].captures++;if(capture?.a===a&&capture?.b===b&&capture.guard)data.players[a].capturesThroughGuard++;capture=null;}
    data.players[a].damageByMove[key]=(data.players[a].damageByMove[key]||0)+e.damage;lastDamage[b]=key;
    if(e.type==='damage'&&lastWhiffs[b]&&!lastWhiffs[b].punished&&before.moves[b]===lastWhiffs[b].move){lastWhiffs[b].punished=true;data.players[a].whiffPunishes++;data.players[b].punishedWhiffs++;}
   }
   measuredEvents.length=0;
   data.winner=m.winner;data.completed=m.phase==='over';data.hp=m.players.map(p=>p.hp);
   data.koCause=data.completed?(m.players.some(p=>p.hp<=0)?lastDamage[m.players.findIndex(p=>p.hp<=0)]:'timeout'):null;
   before=null;
  },
  snapshot(){const out=JSON.parse(JSON.stringify(data));out.seconds=out.inputFrames/60;out.players.forEach((p,i)=>{p.wastedBreakTaps=breakAttempts[i].filter(x=>!x.landed&&(data.completed||m.tick-x.tick>=x.window)).length;p.pendingBreakTaps=breakAttempts[i].filter(x=>!x.landed&&!data.completed&&m.tick-x.tick<x.window).length;p.damagePerPress=p.attackPresses?p.damage/p.attackPresses:null;p.pressesPerMinute=out.seconds?p.attackPresses*60/out.seconds:0;p.dominantMove=Object.entries(p.moveUses).sort((a,b)=>b[1]-a[1]||a[0].localeCompare(b[0]))[0]?.[0]||null;p.dominantMoveShare=p.damage?(p.damageByMove[p.dominantMove]||0)/p.damage:0;});return out;}
 };
}
export const STORE='rift-skill-matches';
export function saveMatch(record,storage){try{const old=JSON.parse(storage.getItem(STORE)||'[]');const rows=Array.isArray(old)?old:[];storage.setItem(STORE,JSON.stringify([...rows,record].slice(-50)));return true;}catch{return false;}}
export function readMatches(storage){try{const x=JSON.parse(storage.getItem(STORE)||'[]');return Array.isArray(x)?x:[];}catch{return [];}}
export function exportMatches(matches){return {schema:1,kind:'rift-skill-report',matches};}
