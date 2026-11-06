import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';import {gzipSync} from 'node:zlib';import {createHash} from 'node:crypto';
import {createMatch,update,aiInput,neutral} from '../../dist/combat.js';import {captureDown} from '../../dist/capture-wake.js';import {observeCombat} from '../../dist/skill/observer.js';import {createTelemetry} from '../../dist/skill/telemetry.js';import {visible,delayedBot,tap} from '../skill/bots/common.mjs';import camper from '../skill/bots/circle-camper.mjs';import {releaseBuild} from '../release-build.mjs';
export const FLAGS=['','inv','close3','close45','inv,close3','inv,close45'];
export const MODES=FLAGS.flatMap(wake=>[{name:(wake||'base')+'-old',capturewake:wake,cpu:'',rangedcap:''},{name:(wake||'base')+'-v2',capturewake:wake,cpu:'v2',rangedcap:''},{name:(wake||'base')+'-all',capturewake:wake,cpu:'v2',rangedcap:'guard,flat'}]);
const policySpaced=c=>{const decision=camper(c);if(decision.capture&&(!tap(c.frame,240)||['launch','knockdown','getUp','roll'].includes(c.rival.anim)))return {x:c.d<5?-1:c.d>8?1:0};return decision;};
const initialBuild=releaseBuild().hash,start=performance.now(),limit=process.argv.includes('--quick')?1:5,modeName=process.argv.find(s=>s.startsWith('--mode='))?.split('=')[1],policies=process.argv.includes('--spam-only')?['repeat']:['repeat','spaced'];const rows=[];
// Before-tick conservative action availability: excludes movement, guard and attack
// commitments, ground/air recovery, hitstop and cinematics. Does not drive a bot.
export const actionable=(m,p)=>m.phase==='fight'&&!m.hitstop&&!m.cinematic&&!m.pressure&&p.hp>0&&!p.move&&p.cool<=0&&p.stun<=0&&p.blockStun<=0&&p.air<=0&&!p.step&&!p.travel&&!p.roll&&!p.jumpSquat&&!p.getUp&&!p.bounce&&!p.knockdown&&!p.staggerState;
for(const mode of MODES.filter(m=>!modeName||m.name===modeName)){
 for(const policy of policies)for(let f=0;f<6;f++)for(let g=0;g<6;g++)for(let seed=1;seed<=limit;seed++){
  const m=createMatch(f,g,'arcade','normal',{roundSeconds:60,winsNeeded:1,movement:'v2',arena:'ring',burst:'v2',step:'linear',...mode});m.seed=seed*104729;
  const bot=delayedBot(policy==='repeat'?camper:policySpaced,{seed,delay:15,seat:0}),telemetry=createTelemetry(m,{source:'capture-loop-study'}),counts={thrown:[0,0],thrownAtDown:[0,0],thrownAtFloor:[0,0],landed:[0,0],wakeAvoid:[0,0],repositions:[],readyFrames:[0,0],cinematicFrames:0};
  const dispose=observeCombat(m,e=>{if(e.type==='captureCircleThrown'){counts.thrown[e.attacker]++;if(e.down)counts.thrownAtDown[e.attacker]++;if(e.floor)counts.thrownAtFloor[e.attacker]++;}if(e.type==='captureStart'&&['mid','far'].includes(e.context))counts.landed[e.attacker]++;if(e.type==='captureWakeAvoid')counts.wakeAvoid[e.defender]++;if(e.type==='captureReposition')counts.repositions.push(e.distance);});
  let inputs=0;for(;m.phase==='fight'&&inputs<18000;inputs++){
   m.players.forEach((p,i)=>{if(actionable(m,p))counts.readyFrames[i]++;});if(m.cinematic)counts.cinematicFrames++;
   const value=[bot.next(visible(m)),aiInput(m,1/60)];telemetry.before(value);update(m,value);telemetry.after();

  }
  const t=telemetry.snapshot();dispose();telemetry.dispose();rows.push({mode:mode.name,policy,camper:f,cpu:g,seed,completed:t.completed,winner:t.winner,hp:t.hp,inputFrames:inputs,simulationFrames:m.tick,...counts,players:t.players.map(p=>({damage:p.damage,captureDamage:p.captureDamage,capturesStarted:p.capturesStarted,capturesLanded:p.capturesLanded,captureBreaks:p.captureBreaks,blocks:p.blocks,rangedGuarded:p.rangedCapturesGuarded,moveUses:p.moveUses,damageByMove:p.damageByMove}))});
 }
 console.log(mode.name,rows.filter(r=>r.mode===mode.name).length,'bouts',((performance.now()-start)/1000).toFixed(1)+'s');
}
const dir='art/review-2026-11-06/capture-loop';mkdirSync(dir,{recursive:true});const build=releaseBuild(),source={};if(build.hash!==initialBuild)throw Error('Source build changed during study');for(const p of ['dist/combat.js','dist/capture-wake.js','dist/cpu-v2.js','scripts/skill/bots/circle-camper.mjs','scripts/skill/bots/common.mjs','scripts/capture-loop/study.mjs'])source[p]=createHash('sha256').update(readFileSync(p)).digest('hex');
const report={schema:1,build:build.hash,source,config:{modes:MODES,delay:15,seeds:limit,roundSeconds:60,policies,realCpuSeat:1,orderedPairs:36},seconds:(performance.now()-start)/1000,rows};const suffix=modeName?'-'+modeName:limit===1?'-quick':'';writeFileSync(dir+'/study'+suffix+'.json.gz',gzipSync(JSON.stringify(report)));console.log('Total',rows.length,'censored',rows.filter(r=>!r.completed).length);
