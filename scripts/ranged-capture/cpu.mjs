// Real game CPU (aiInput, normal difficulty, always player 2) vs circle-camper and masher (close range) bots at 15f delay.
// All 36 fighter pairs, 5 seeds, Adam's switches. The game CPU only drives player 2, so seats cannot be mirrored;
// every fighter pairing is played with each fighter on each side instead.
// node scripts/ranged-capture/cpu.mjs <base|v2|v2-guard-flat>
import {writeFileSync,mkdirSync} from 'node:fs';
import {createMatch,update,aiInput} from '../../dist/combat.js';import {observeCombat} from '../../dist/skill/observer.js';
import {createTelemetry} from '../../dist/skill/telemetry.js';import {visible,delayedBot} from '../skill/bots/common.mjs';import {policies} from '../skill/run.mjs';
const mode=process.argv[2]||'base',opts={movement:'v2',arena:'ring',burst:'v2',step:'linear',...(mode!=='base'?{cpu:'v2'}:{}),...(mode==='v2-guard-flat'?{rangedcap:'guard,flat'}:{})};const rows=[];
for(const bot of ['circle-camper','masher'])for(let f=0;f<6;f++)for(let g=0;g<6;g++)for(let seed=1;seed<=5;seed++){
 const m=createMatch(f,g,'arcade','normal',{roundSeconds:60,winsNeeded:1,...opts});m.seed=seed*104729;
 const agent=delayedBot(policies[bot],{seed,delay:15,seat:0}),t=createTelemetry(m,{source:'cpu-study'}),c={hits:0,blocks:0,circlesThrown:0};
 const dispose=observeCombat(m,e=>{if(e.defender===1&&e.type==='damage')c.hits++;if(e.defender===1&&e.type==='block')c.blocks++;});
 for(let n=0;m.phase==='fight'&&n<60*60*5;n++){const inputs=[agent.next(visible(m)),aiInput(m,1/60)];t.before(inputs);update(m,inputs);t.after();}
 const r=t.snapshot(),cpu=r.players[1],b=r.players[0];dispose();t.dispose();
 rows.push({bot,botFighter:f,cpuFighter:g,seed,completed:r.completed,cpuWon:r.winner===1,cpuDamage:cpu.damage,botDamage:b.damage,hitsTaken:c.hits,blocks:c.blocks,captureBreaks:cpu.captureBreaks,whiffPunishes:cpu.whiffPunishes,rangedGuarded:cpu.rangedCapturesGuarded,botCapturesLanded:b.capturesLanded,botThrown:(b.moveUses['system-capture-mid']||0)+(b.moveUses['system-capture-far']||0),cpuThrown:(cpu.moveUses['system-capture-mid']||0)+(cpu.moveUses['system-capture-far']||0)});}
mkdirSync('art/review-2026-11-06/ranged-capture/raw',{recursive:true});writeFileSync(`art/review-2026-11-06/ranged-capture/raw/cpu-${mode}.json`,JSON.stringify(rows));console.log(mode,rows.length);
