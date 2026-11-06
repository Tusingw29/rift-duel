import {createMatch,update,neutral} from '../../dist/combat.js';import {observeCombat} from '../../dist/skill/observer.js';import {fighters} from '../../dist/fighters.js';import {writeFileSync,mkdirSync} from 'node:fs';
// Single, unguarded capture against a standing target. No follow-up attacks.
const flags=['','inv','close3','close45','inv,close3','inv,close45'],rows=[];
for(const capturewake of flags)for(const rangedcap of ['', 'guard,flat'])for(const gap of [4,7])for(let a=0;a<6;a++)for(let b=0;b<6;b++){
 const m=createMatch(a,b,'duel','normal',{movement:'v2',arena:'ring',capturewake,rangedcap}),[p,q]=m.players;p.x=-gap/2;q.x=gap/2;const events=[];const dispose=observeCombat(m,e=>events.push(e));
 for(let n=0;n<600&&q.hp===100;n++)update(m,[{...neutral(),capture:n===0},neutral()]);dispose();
 const damage=100-q.hp,expected=15*fighters[a].power*(rangedcap?1:gap>=6?1.25:1.1),distance=Math.hypot(q.x-p.x,q.z-p.z);
 if(Math.abs(damage-expected)>1e-8)throw Error('Isolated capture damage mismatch');if(capturewake.includes('close')&&Math.abs(distance-(capturewake.includes('close45')?4.5:3))>1e-8)throw Error('Isolated capture distance mismatch');
 rows.push({capturewake,rangedcap,gap,a,b,landed:events.some(e=>e.type==='captureStart'),damage,expected,distance});
}
const dir='art/review-2026-11-06/capture-loop';mkdirSync(dir,{recursive:true});writeFileSync(dir+'/isolated.json',JSON.stringify({definition:'One ranged capture, standing unguarded target, no repeats',rows}));console.log('Isolated cases',rows.length,'landed',rows.filter(r=>r.landed).length);
