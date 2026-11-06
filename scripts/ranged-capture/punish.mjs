// Capture punish fixture: can a defender punish each fighter's close capture (whiff, break) and ranged capture circle?
// Deterministic sim, Adam's switches (move=v2, arena=ring, burst=v2, step=linear). The attacker holds guard as soon as it
// can act, so only hits that land before the attacker is actionable (or that guard cannot stop) count as punishes.
// node scripts/ranged-capture/punish.mjs [rangedcap]   -> art/review-2026-11-06/ranged-capture/punish[-mode].json
import {writeFileSync,mkdirSync} from 'node:fs';
import {createMatch,update,neutral} from '../../dist/combat.js';
import {fighters} from '../../dist/fighters.js';
const rangedcap=process.argv[2]||'',STEP=1/60;
const base={movement:'v2',arena:'ring',burst:'v2',step:'linear',...(rangedcap?{rangedcap}:{})};
const actionable=p=>!p.move&&p.cool<=0&&p.stun<=0&&p.air<=0&&!p.travel&&!p.roll&&!p.getUp&&!p.step&&!p.staggerState;
const OPTIONS={
 strike:(m,d,r)=>d>r-.25?{...neutral(),x:1}:{...neutral(),attack:true},
 shot:()=>({...neutral(),attack:true}),
 pursuit:()=>({...neutral(),pursuit:true}),
 launch:(m,d,r)=>d>r-.25?{...neutral(),x:1}:{...neutral(),launch:true},
 capture:()=>({...neutral(),capture:true}),
 burst:()=>({...neutral(),super:true})};
function setup(att,def,scenario){
 const m=createMatch(att,def,'duel','normal',base),a=m.players[0],b=m.players[1];
 const dodge=scenario.startsWith('dodge')?+scenario.slice(5):0,d=scenario==='ranged4'?4:scenario==='ranged'||dodge?6:2;a.x=-d/2;b.x=d/2;a.z=b.z=0;a.face=a.lookX=1;b.face=b.lookX=-1;a.lookZ=b.lookZ=0;
 for(let t=0;t<3;t++)update(m,[neutral(),neutral()]);
 // attacker presses capture; defender reacts per scenario
 let frame=0,decisive=null,captured=false,spawn=null,stepped=false,spawned=false;const atk=()=>({...neutral(),capture:frame===0});
 while(frame<200){const mv=a.move,defIn={...neutral()};
  if(scenario==='whiff'&&mv?.kind==='capture'&&mv.frame===mv.startup-2){b.z=2.6;}           // slip out of line before contact
  if(scenario==='break'&&mv?.kind==='capture'&&mv.frame>=mv.startup-4)defIn.guard=true;     // fresh timed guard
  if(dodge){const p=m.projectiles.find(p=>p.kind==='capture');if(p&&spawn===null)spawn=frame;if(spawn!==null){const k=frame-spawn-dodge;if(k===0||k===3)defIn.z=-1;}
   if(spawn!==null&&b.step)stepped=true;if(stepped&&!b.step){update(m,[atk(),defIn]);decisive=frame+1;break;}}
  if(scenario.startsWith('ranged')){const p=m.projectiles.find(p=>p.kind==='capture');if(p){const dd=Math.hypot(p.x-b.x,p.z-b.z);if(dd<(p.radius||.65)+.5+7*4/60)defIn.guard=true;}}
  update(m,[atk(),defIn]);frame++;if(m.projectiles.some(p=>p.kind==='capture'))spawned=true;
  if(m.cinematic){captured=true;break;}
  const resolved=dodge?false:scenario.startsWith('ranged')?spawned&&!m.projectiles.some(p=>p.kind==='capture'):scenario==='break'?m.events.some(e=>e.type==='hint'&&e.text==='CAPTURE BREAK')||(mv&&!a.move&&a.stun>0):mv&&mv.frame>=mv.startup+1;
  if(resolved&&decisive===null){decisive=frame;break;}}
 return {m,decisive,captured,spawn};}
function attempt(att,def,scenario,option){
 const {m,decisive,captured}=setup(att,def,scenario);if(captured||decisive===null)return {ok:false,reason:captured?'defender captured':'unresolved'};
 const a=m.players[0],b=m.players[1],reach=fighters[def].reach;let attackerFree=null,defenderFree=null,t=0,pressed=false;
 const hp0=a.hp;
 for(;t<150;t++){
  if(attackerFree===null&&actionable(a))attackerFree=t;
  if(defenderFree===null&&actionable(b))defenderFree=t;
  const d=Math.hypot(a.x-b.x,a.z-b.z);let di=neutral();
  if(defenderFree!==null){const want=OPTIONS[option](m,d,reach);const button=['attack','pursuit','launch','capture','super'].find(k=>want[k]);if(button){if(!pressed){di=want;pressed=true;}}else di=want;}
  update(m,[actionable(a)?{...neutral(),guard:true}:neutral(),di]);
  if(m.cinematic?.a===1||a.hp<hp0-2.5)return {ok:true,landedAt:t,attackerFree,defenderFree,damage:+(hp0-a.hp).toFixed(2),how:m.cinematic?.a===1?m.cinematic.kind:'hit'};
  if(pressed&&!b.move&&!b.travel&&actionable(b)&&t-defenderFree>40)break;}
 return {ok:false,attackerFree,defenderFree,reason:pressed?'blocked, whiffed or too slow':'never pressed'};}
const SCENARIOS=['whiff','break','ranged','ranged4','dodge12','dodge18','dodge24'],rows=[];
for(let att=0;att<6;att++)for(let def=0;def<6;def++)for(const scenario of SCENARIOS){
 const res=Object.fromEntries(Object.keys(OPTIONS).map(o=>[o,attempt(att,def,scenario,o)]));
 const any=Object.values(res).find(r=>r.attackerFree!==undefined);
 rows.push({attacker:fighters[att].id,defender:fighters[def].id,scenario,caught:Object.values(res).some(r=>r.reason==='defender captured'),attackerFree:any?.attackerFree??null,defenderFree:any?.defenderFree??null,punishes:Object.entries(res).filter(([,r])=>r.ok).map(([o,r])=>({option:o,damage:r.damage,how:r.how,landedAt:r.landedAt})),results:res});}
const out='art/review-2026-11-06/ranged-capture';mkdirSync(out,{recursive:true});
writeFileSync(`${out}/punish${rangedcap?'-'+rangedcap.replace(',','-'):''}.json`,JSON.stringify({switches:base,rows},null,1));
const sum={};for(const r of rows){const k=r.scenario;sum[k]??={pairs:0,punishable:0,gap:[],best:{}};sum[k].pairs++;if(r.punishes.length)sum[k].punishable++;if(r.attackerFree!=null&&r.defenderFree!=null)sum[k].gap.push(r.attackerFree-r.defenderFree);for(const p of r.punishes){sum[k].best[p.option]=(sum[k].best[p.option]||0)+1;}}
for(const r of rows){if(r.caught)sum[r.scenario].caught=(sum[r.scenario].caught||0)+1;}
for(const [k,v] of Object.entries(sum))console.log(k,'punishable pairs',v.punishable+'/'+v.pairs,'defender caught',v.caught||0,'attacker free minus defender free (frames) min/median/max',Math.min(...v.gap),v.gap.sort((a,b)=>a-b)[v.gap.length>>1],Math.max(...v.gap),'options that punish',JSON.stringify(v.best));
for(const a of fighters.map(f=>f.id))console.log(a.padEnd(7),SCENARIOS.map(s=>{const rs=rows.filter(r=>r.attacker===a&&r.scenario===s);return s+' '+rs.filter(r=>r.punishes.length).length+'/6 gap '+rs.map(r=>r.attackerFree-r.defenderFree).join(',');}).join(' | '));
