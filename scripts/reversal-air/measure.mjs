import {pathToFileURL} from 'node:url';
// Full launch/pursuit timeline, complementary to OPTIONS-AUDIT's first-hit verdict.
import {createMatch,update,neutral,STEP} from '../../dist/combat.js';
import {fighters} from '../../dist/fighters.js';import {airlockRemaining} from '../../dist/air-recovery-lock.js';
import {observeCombat} from '../../dist/skill/observer.js';import {mkdirSync,writeFileSync,readFileSync} from 'node:fs';
export function bout(attacker,defender,airlock,policy,tapAt){
 const m=createMatch(attacker,defender,'training','normal',{movement:'v2',arena:'ring',burst:'v2',step:'linear',airlock});const [a,b]=m.players;a.x=0;b.x=2;
 const rows=[];let launchTick=null,freeTick=null,pursuitTick=null,recoverTick=null,tapped=false,sent=false;
 const off=observeCombat(m,e=>{if(e.type==='damage')rows.push({tick:m.tick,defender:e.defender,damage:e.damage});});
 for(let f=0;f<400;f++){
  const next=m.tick+1,age=launchTick===null?null:next-launchTick;
  let attack={launch:f===0},defend={};
  if(launchTick!==null&&!m.hitstop){
   if(freeTick===null&&(a.move?.kind==='launch'&&a.move.connected||!a.move&&a.cool<=0))freeTick=next;
   const delay=policy==='delay12'?12:policy==='delay24'?24:0;
   if(policy!=='wait'&&!sent&&freeTick!==null&&next>=freeTick+delay){attack={pursuit:true};sent=true;}
   const target=tapAt==='react15'||tapAt==='react15Unlock'?(pursuitTick===null?Infinity:pursuitTick+15):launchTick+tapAt;
   const allowedTarget=tapAt==='react15Unlock'?Math.max(target,launchTick+airlock+1):target;
   if(!tapped&&next>=allowedTarget){defend={guard:true};tapped=true;}
  }
  update(m,[{...neutral(),...attack},{...neutral(),...defend}],STEP);
  if(launchTick===null&&b.launched)launchTick=m.tick;
  if(pursuitTick===null&&a.move?.kind==='pursuit')pursuitTick=m.tick;
  if(recoverTick===null&&m.events.some(e=>e.type==='hint'&&e.text==='AIR RECOVERY'&&e.player===1))recoverTick=m.tick;
 }
 off();const after=rows.filter(r=>r.tick>launchTick&&r.defender===1);
 return {attacker:fighters[attacker].id,defender:fighters[defender].id,airlock,policy,tapAt,launchTick,freeAge:freeTick-launchTick,pursuitAge:pursuitTick===null?null:pursuitTick-launchTick,recoverAge:recoverTick===null?null:recoverTick-launchTick,hits:after.length,damage:+after.reduce((s,r)=>s+r.damage,0).toFixed(3),firstHitAge:after[0]?after[0].tick-launchTick:null};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(process.argv[1]).href){
const out=process.argv[2]||'art/review-2026-11-06/reversal-air';mkdirSync(out,{recursive:true});
const rows=[];for(const lock of [0,12,20])for(let a=0;a<6;a++)for(let b=0;b<6;b++)if(a!==b)for(const policy of ['immediate','delay12','delay24','wait'])for(const tap of [...new Set([1,lock+1,25,35,40,45,50,'react15','react15Unlock',999])])rows.push(bout(a,b,lock,policy,tap));
writeFileSync(out+'/timelines.json',JSON.stringify({build:JSON.parse(readFileSync('dist/skill/build.json')).hash,rows},null,1));
let md='# Full-sequence air recovery\n\n30 ordered pairs. Counts are recoveries / clean escapes (zero pursuit hits) / interrupted pursuits (one or two hits) / full three-hit pursuits. One post-launch hit can be a grounded pursuit after recovery, rather than an aerial beat. No punish-probe score; these are complete 400-update timelines. 15f is measured from the first visible pursuit frame using advancing simulation frames; hitstop pauses both clocks.\n\n| Airlock | Attacker | Defender timing | Recovery | Clean | Partial | Full |\n|---|---|---|---:|---:|---:|---:|\n';
for(const lock of [0,12,20])for(const policy of ['immediate','delay12','delay24','wait'])for(const tap of [...new Set([1,lock+1,35,45,'react15','react15Unlock',999])]){const r=rows.filter(x=>x.airlock===lock&&x.policy===policy&&x.tapAt===tap);md+=`| ${lock} | ${policy} | ${tap===999?'never':tap==='react15'?'pursuit +15f':tap==='react15Unlock'?'15f reaction, wait for unlock':'launch +'+tap+'f'} | ${r.filter(x=>x.recoverAge!==null).length}/30 | ${r.filter(x=>x.hits===0).length}/30 | ${r.filter(x=>x.hits>0&&x.hits<3).length}/30 | ${r.filter(x=>x.hits===3).length}/30 |\n`;}
md+='\n## Immediate pursuit, by attacking fighter\n\n| Airlock | Attacker | First pursuit frame after launch | First hit after launch | 15f reaction, tap at unlock if needed | Clean escape | Recovery age / hits taken | Partial / full |\n|---|---|---|---|---:|---:|---|---|\n';for(const lock of [0,12,20])for(const fighter of fighters){const r=rows.filter(x=>x.airlock===lock&&x.policy==='immediate'&&x.tapAt==='react15Unlock'&&x.attacker===fighter.id),uniq=k=>[...new Set(r.map(x=>x[k]))].join(', ');md+=`| ${lock} | ${fighter.id} | ${uniq('pursuitAge')} | ${uniq('firstHitAge')} | ${r.filter(x=>x.recoverAge!==null).length}/5 | ${r.filter(x=>x.hits===0).length}/5 | ${uniq('recoverAge')} / ${uniq('hits')} | ${r.filter(x=>x.hits>0&&x.hits<3).length}/5 / ${r.filter(x=>x.hits===3).length}/5 |\n`;}
writeFileSync(out+'/timelines.md',md);console.log('measured',rows.length,'full timelines');

}
