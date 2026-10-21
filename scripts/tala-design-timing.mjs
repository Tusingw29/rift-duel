// Snapshot current combat contracts for the Design 02 production package.
// Planning keys are authored proposals; they do not alter the game.
import {writeFileSync} from 'node:fs';
import {fighters} from '../dist/fighters.js';
import {moveTiming} from '../dist/moves.js';
import {techniqueVariants} from '../dist/techniques.js';
import {baseSpecials,specialVariants} from '../dist/special-variants.js';
import {stockSpecials,stockTiming} from '../dist/stock-specials.js';
import {capturePresentation,BURST_DURATIONS} from '../dist/cinematics.js';
const fighter=fighters.find(f=>f.id==='tala');
const entries=[];
function add(id,kind,spec,extra={}){
 const t={...moveTiming(fighter,kind),...extra};
 if(spec)t.active=spec.active||stockTiming(spec);
 t.total=t.startup+t.active+t.recovery;
 entries.push({id,kind,...t,contactFrames:kind==='pursuit'?[7,16,25]:[t.startup],
  planningFrames:{ready:0,load:Math.round(t.startup*.55),drive:Math.max(1,t.startup-1),contact:t.startup,follow:t.startup+t.active+Math.round(t.recovery*.22),gather:t.startup+t.active+Math.round(t.recovery*.65),end:t.total},
  ...(spec?{effect:spec.type,projectileCount:spec.count}: {})});
}
for(const [id,kind] of [['right-straight','strike'],['left-cross','strike'],['right-hook','strike'],['energy-shot','shot'],['launcher','launch'],['rising-tempest','technique'],['jump-attack','jumpAttack'],['capture-start','capture'],['burst-start','super']])add(id,kind);
add('skybreaker-kick','technique',null,techniqueVariants.tala);
add('aerial-pursuit','pursuit',null,{active:19});
for(const [group,label] of [[baseSpecials,'base'],[specialVariants,'followup'],[stockSpecials,'stock']]){
 for(const [kind,spec] of Object.entries(group.tala))add(spec.name.toLowerCase().replaceAll(' ','-'),kind,spec,{variant:label});
}
const data={schema:1,fps:60,source:'Current repository combat data; original Rift Duel timings, not measured source-game timings.',frameConvention:'Local frame 0 begins each action; total is its end boundary. Planning keys are suggestions, not a baked clip.',entries,captureDurations:Object.fromEntries(['front','back','mid','far'].map(c=>[c,capturePresentation('tala',c)])),burstDuration:BURST_DURATIONS.tala};
writeFileSync(new URL('../art/tala-design-02/timing.json',import.meta.url),JSON.stringify(data,null,2)+'\n');
console.log(`Wrote ${entries.length} action contracts and four capture contexts.`);
