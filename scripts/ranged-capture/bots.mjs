// Bot study: circle-camper vs stepper, punisher, masher, masher-all. All 36 fighter pairs, delays 10/15f, both seats, 5 seeds.
// Adam's switches (move=v2, arena=ring, burst=v2, step=linear) plus the rangedcap mode given. Bots never use the game CPU.
// node scripts/ranged-capture/bots.mjs <base|guard|flat|guard,flat>
import {writeFileSync,mkdirSync} from 'node:fs';import {runMatch} from '../skill/run.mjs';
const mode=process.argv[2]||'base',rangedcap=mode==='base'?'':mode,rows=[];
for(const opponent of ['stepper','punisher','masher','masher-all'])for(const delay of [10,15])for(let f=0;f<6;f++)for(let g=0;g<6;g++)for(const seat of [0,1])for(let seed=1;seed<=5;seed++){
 const bots=seat?[opponent,'circle-camper']:['circle-camper',opponent],fighters=seat?[g,f]:[f,g];
 const r=runMatch({bots,fighters,seed,delay,movement:'v2',arena:'ring',burst:'v2',step:'linear',rangedcap});
 const c=r.players[seat],o=r.players[1-seat],ranged=k=>Object.entries(k.damageByMove).filter(([x])=>x==='system-capture-mid'||x==='system-capture-far').reduce((s,[,v])=>s+v,0);
 rows.push({opponent,delay,camperFighter:f,opponentFighter:g,seat,seed,completed:r.completed,camperWon:r.winner===seat,draw:r.completed&&r.winner==null,
  camper:{damage:c.damage,rangedDamage:ranged(c),thrown:(c.moveUses['system-capture-mid']||0)+(c.moveUses['system-capture-far']||0),landed:c.capturesLanded,guardedByRival:o.rangedCapturesGuarded,brokenByRival:o.captureBreaks},
  opponentSide:{damage:o.damage,rangedDamage:ranged(o),thrown:(o.moveUses['system-capture-mid']||0)+(o.moveUses['system-capture-far']||0),landed:o.capturesLanded}});}
mkdirSync('art/review-2026-11-06/ranged-capture/raw',{recursive:true});
writeFileSync(`art/review-2026-11-06/ranged-capture/raw/bots-${mode.replace(',','-')}.json`,JSON.stringify(rows));console.log(mode,rows.length,'matches');
