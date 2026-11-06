// Read-only diagnostic. No edits to combat data or simulation hooks.
import {writeFileSync} from 'node:fs';
import {createMatch,update,neutral} from '../../dist/combat.js';
import {observeCombat} from '../../dist/skill/observer.js';
import {releaseBuild} from '../release-build.mjs';
import {fighters} from '../../dist/fighters.js';
const options={movement:'v2',arena:'ring',burst:'v2',step:'linear'},rows=[];
for(const gap of [4,8,12]){
 const m=createMatch(2,3,'training','normal',options),[a,b]=m.players;a.x=-gap/2;b.x=gap/2;let spawned=null,ready=null,confirmed=null;
 const dispose=observeCombat(m,e=>{if(e.type==='captureCircleThrown'&&e.attacker===0)spawned=m.tick;if(e.type==='captureStart'&&e.attacker===0)confirmed=m.tick;});
 for(let n=0;n<180&&!confirmed;n++){update(m,[{...neutral(),capture:n===0},neutral()]);if(spawned&&ready===null&&!a.move&&a.cool<=0&&!a.stun)ready=m.tick;}
 dispose();rows.push({gap,spawnTick:spawned,attackerReadyTick:ready,confirmationTick:confirmed,freeFramesBeforeConfirmation:ready===null?null:confirmed-ready});
}
const m=createMatch(2,3,'training','normal',options),[a,b]=m.players;a.x=0;b.x=2.8;const events=[],dispose=observeCombat(m,e=>{if(['captureCircleThrown','captureStart'].includes(e.type))events.push({tick:m.tick,type:e.type,context:e.context,distance:Math.hypot(b.x-a.x,b.z-a.z)});});
for(let n=0;n<70;n++)update(m,[{...neutral(),capture:n===0},{...neutral(),x:-1}]);dispose();
const report={build:releaseBuild().hash,options,definition:'Tala throws one capture at stationary Morrow. Ready = attacker has no move, cooldown or stun. Times are advancing simulation ticks, not recorded input ticks. Escape fixture: Morrow walks away from a 2.8-unit close capture from frame one.',morrowSpeed:fighters[3].speed,talaSpeed:fighters[2].speed,stationary:rows,retreatingCloseGrab:{initialGap:2.8,events},geometryBudget:{warningFrames:54,sealRadius:1.5,defenderRadius:.5,reactionFrames:15,slowWalkFrames:Math.ceil(2/4.1*60),comment:'Design guess only. Full-body escape needs centre distance > sealRadius + defenderRadius; edge, body push and input delay need direct testing.'}};
writeFileSync('art/review-2026-11-06/combat-design-study/capture-risk.json',JSON.stringify(report,null,2)+'\n');console.log(JSON.stringify(report,null,2));
