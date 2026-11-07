// OPTIONS-AUDIT (2026-11-06, Claude). Deterministic "what beats what" fixtures on the real simulation.
// An exchange places two fighters, gives each an option that starts at a trigger, steps the match and scores
// the result from combat diagnostics (damage, block, capture, break) plus who can act first afterwards.
// Analysis only: nothing here changes gameplay.
import {createMatch,update,neutral,STEP} from '../../dist/combat.js';
import {observeCombat} from '../../dist/skill/observer.js';

export const ADAM={movement:'v2',arena:'ring',burst:'v2',step:'linear'};
export const dist=(a,b)=>Math.hypot(a.x-b.x,a.z-b.z);
// Is any rival projectile still approaching this fighter along a line that can reach it?
export function threatened(m,me){const n=m.players.indexOf(me);return m.projectiles.some(p=>{if(p.owner===n||p.life<=0)return false;const s=Math.hypot(p.dx,p.dz);if(s<1e-9)return true;const rx=me.x-p.x,rz=me.z-p.z,along=(rx*p.dx+rz*p.dz)/s,lateral=Math.abs(rx*p.dz-rz*p.dx)/s,reach=Math.max(p.radius||.4,p.targetRadius||0)+.6;return along>-reach&&lateral<reach+.4;});}
// Can this fighter start a new action this frame (the same conditions a step needs, plus no capture cinematic)?
export const ready=(m,p)=>!m.cinematic&&!p.move&&!p.step&&!p.travel&&!p.roll&&!p.jumpSquat&&!p.getUp&&!p.bounce&&!p.knockdown&&p.air<=0&&p.stun<=0&&p.blockStun<=0&&p.cool<=0&&p.hp>0;

// Options: (k, m, me, rival) => input, where k counts frames since the option started.
const tap=(k,input)=>k===0?input:{};
export const OPTIONS={
 wait:()=>({}),
 guard:()=>({guard:true}),
 strike:k=>tap(k,{attack:true}),
 grab:k=>tap(k,{capture:true}),
 launcher:k=>tap(k,{launch:true}),
 pursuit:k=>tap(k,{pursuit:true}),
 upSpecial:k=>k===0?{z:-1,attack:true}:{},
 towardSpecial:k=>k===0?{x:1,attack:true}:{},
 awaySpecial:k=>k===0?{x:-1,attack:true}:{},
 // Extra tap during wind-up selects the alternate form (twin spark / crosswind discs cover sidesteps).
 towardAlt:k=>k===0?{x:1,attack:true}:k===4?{attack:true}:{},
 awayAlt:k=>k===0?{x:-1,attack:true}:k===4?{attack:true}:{},
 shot:k=>tap(k,{attack:true}),
 sidestep:k=>k===1||k===3?{z:1}:{},
 backdash:k=>k===1||k===3?{x:-1}:{},
 dashIn:k=>k===1||k===3?{x:1}:{},
 walkIn:()=>({x:1}),
 walkAway:()=>({x:-1}),
 circle:()=>({z:1}),
 charge:k=>k<90?{attack:true}:{},
 // Fresh guard tap: perfect guard against strikes/shots, capture break against grabs (window 12f at contact).
 freshGuard:k=>({guard:k<20}),
 // Dash in, then strike once in reach.
 dashStrike:(k,m,me,rv)=>k===1||k===3?{x:1}:k>14&&dist(me,rv)<2.3&&!me.move?{attack:true}:{},
};

// Triggers decide the frame an option starts.
export const at=frame=>({kind:'at',frame});
// React d frames after the rival's first move/step/projectile appears (a perfect watcher with a fixed delay).
export const react=delay=>({kind:'react',delay});

export function exchange({p1=2,p2=3,distance=2,opts=ADAM,setup,attacker,defender,frames=180,punishFrames=120,sideOffset=0,noPhase2=false}){
 const m=createMatch(p1,p2,'training','normal',{...opts});
 const [a,b]=m.players;a.x=0;a.z=0;b.x=distance;b.z=sideOffset;
 for(const p of m.players){p.lookX=p===a?1:-1;p.lookZ=0;p.face=p===a?1:-1;}
 setup?.(m);
 const log=[];const off=observeCombat(m,e=>log.push({tick:m.tick,...e}));
 const role=[{option:attacker.option,trigger:attacker.trigger||at(0),start:null},{option:defender.option,trigger:defender.trigger||at(0),start:null}];
 const RESOLVE=['damage','captureStart','block','perfectGuard','captureBreak'];
 let firstThreat=null,resolved=null,phase2=null,punisher=null,tried=false;const t0=m.tick;
 for(let f=0;f<frames+punishFrames;f++){
  if(firstThreat===null&&(a.move||a.step||m.projectiles.some(p=>p.owner===0)))firstThreat=m.tick;
  if(resolved===null){const e=log.find(x=>RESOLVE.includes(x.type));if(e)resolved=e;}
  // Phase 2 starts once phase 1 resolved without a hit (block/break/perfect guard) or nothing happened for `frames`.
  // A whiff is known once both options have started, something was attempted, and every attack is past its active frames.
  const spent=p=>!p.move||p.move.frame>=p.move.startup+(p.move.active||1);
  if(role[0].start!==null&&role[1].start!==null&&(a.move||b.move||a.step||b.step))tried=true;
  const whiffKnown=!resolved&&tried&&spent(a)&&spent(b)&&!m.cinematic&&!threatened(m,a)&&!threatened(m,b);
  if(!noPhase2&&phase2===null&&((resolved&&!['damage','captureStart'].includes(resolved.type)&&m.tick>resolved.tick+1&&!threatened(m,a)&&!threatened(m,b))||whiffKnown||(!resolved&&f>=frames))&&!m.cinematic)phase2=m.tick;
  if(phase2===null&&(noPhase2?log.some(e=>['damage','captureStart'].includes(e.type)):resolved&&['damage','captureStart'].includes(resolved.type)))break;
  if(noPhase2&&f>=frames)break;
  const inputs=[0,1].map(n=>{const me=m.players[n],rv=m.players[1-n];
   if(phase2!==null){ // punish probe: first side able to act attacks; the other guards whenever it can.
    if(punisher===null&&ready(m,me)&&!ready(m,rv))punisher=n;
    if(punisher===n){const d=dist(me,rv);return {...neutral(),...(me.move||me.prev.attack||me.prev.pursuit?{}:d>4.2?{x:1}:d>2.2?{pursuit:true}:{attack:true})};}
    return {...neutral(),guard:true};}
   const r=role[n];
   if(r.start===null){const t=r.trigger;if(t.kind==='at'&&f>=t.frame)r.start=m.tick;else if(t.kind==='react'&&firstThreat!==null&&m.tick>=firstThreat+t.delay)r.start=m.tick;else if(t.kind==='when'&&t.test(m,me,rv))r.start=m.tick;}
   return {...neutral(),...(r.start===null?{}:OPTIONS[r.option](m.tick-r.start,m,me,rv)||{})};});
  update(m,inputs,STEP);
  if(m.phase!=='fight')break;
  if(phase2!==null&&log.some(e=>e.tick>=phase2&&['damage','captureStart'].includes(e.type)))break;
 }
 off();
 const dmg=[0,0];for(const e of log)if(e.type==='damage')dmg[e.defender]+=e.damage;
 const hit=log.find(e=>['damage','captureStart'].includes(e.type));
 let result;
 if(noPhase2){result=hit?`${hit.defender===1?'A':'D'} hits${hit.type==='captureStart'?' (grab)':''}`:'no hit, safe';}
 else  if(!resolved)result=phase2!==null&&hit?`whiff, ${hit.defender===1?'A':'D'} punishes`:'whiff, safe';
 else if(['damage','captureStart'].includes(resolved.type))result=`${resolved.defender===1?'A':'D'} hits${resolved.type==='captureStart'?' (grab)':''}`;
 else{const who=resolved.defender===1?'D':'A',what={block:'blocks',perfectGuard:'perfect',captureBreak:'breaks'}[resolved.type];
  result=`${who} ${what}, `+(hit&&hit.tick>=(phase2??Infinity)?`${hit.defender===1?'A':'D'} punishes`:'safe');}
 return {result,dmg:dmg.map(x=>+x.toFixed(1)),first:resolved?.type||null,frame:(resolved?.tick??null)!==null?resolved.tick-t0:null,events:log.filter(e=>e.type!=='meleeCheck').map(e=>`${e.tick-t0}:${e.type}${e.kind?'/'+e.kind:''}${e.defender!==undefined?'>'+e.defender:''}`),gap:+dist(a,b).toFixed(2)};
}
function classify(log,dmg,first){
 if(!first)return 'whiff';
 if(first.type==='captureBreak')return first.defender===1?'D breaks':'A breaks';
 if(first.type==='perfectGuard')return first.defender===1?'D perfect':'A perfect';
 if(first.type==='block')return first.defender===1?'D blocks':'A blocks';
 const who=first.defender===1?'A':'D';return `${who} hits${first.type==='captureStart'?' (grab)':''}`;
}
// A = attacker's option gained (hit, grab, or punished the answer); D = defender gained (hit first or punished);
// = = neither could punish (safe). Avoiding damage without a punish is "=", not a defender win.
export function verdict(r){
 const s=r.result;
 if(/^A hits/.test(s)||/A punishes$/.test(s))return 'A';
 if(/^D hits/.test(s)||/D punishes$/.test(s))return 'D';
 return '=';
}
