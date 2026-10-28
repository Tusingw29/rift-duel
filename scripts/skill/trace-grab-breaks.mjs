// Diagnostic seed-1 subset, separate from archived tournament: explain late projectile capture breaks.
import {readFileSync} from 'node:fs';
import {baseState,exportTuning} from '../../dist/balance/formulas.js';
import {proposedBalance} from '../../dist/balance/presets.js';
import {validateBalance} from '../../dist/balance-runtime.js';
const base=baseState(JSON.parse(readFileSync('dist/balance/roster.json'))),balance=validateBalance(exportTuning(proposedBalance(base)),base);
import {createMatch,update} from '../../dist/combat.js';
import {visible,delayedBot} from './bots/common.mjs';
import {policies} from './run.mjs';
import {observeCombat} from '../../dist/skill/observer.js';
let found=0;
for(let a=0;a<6&&found<8;a++)for(let b=0;b<6&&found<8;b++){
const m=createMatch(a,b,'duel','normal',{balance,winsNeeded:1}),agents=['punisher','masher'].map((p,seat)=>delayedBot(policies[p],{delay:15,seat,seed:1+seat*1000003}));let last=null,before,n=0;
observeCombat(m,e=>{if(e.type==='captureBreak'&&e.defender===0&&last?.kind==='reaction'){found++;console.log(JSON.stringify({fighters:[a,b],frame:n,attempt:last,before,tick:m.tick}));}});
for(;m.phase==='fight'&&n<18000;n++){const o=visible(m),inputs=agents.map(x=>x.next(o));if(agents[0].breakIntent)last={...agents[0].breakIntent,n,tick:m.tick};before={captureProjectiles:m.projectiles.filter(p=>p.kind==='capture').length,d:Math.hypot(m.players[0].x-m.players[1].x,m.players[0].z-m.players[1].z),rival:m.players[1].move&&{kind:m.players[1].move.kind,frame:m.players[1].move.frame,startup:m.players[1].move.startup},hitstop:m.hitstop};update(m,inputs);}
}
