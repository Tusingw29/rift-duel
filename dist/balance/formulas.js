// BALANCE-LAB formulas, shared by dist/balance-lab.js and tests/balance-lab.test.mjs. Pure functions over a lab state
// {sys, fighters, order}. They match the hosted Rift Duel Frame Codex exactly, so both tools give the same numbers
// and can trade tuning files. Frame advantage here is an estimate from the shared constants (about ±2 frames); the
// simulation-measured tables are docs/FRAME_ADVANTAGE.md on the SPACING-COMMITMENT branch.
export const SYS_KEYS=['hitstun','launchStun','blockstun','chip','perfectGuard','captureBreak','splitGuard','reaction','band','cancel1','cancel2'];
export const STATS=['speed','power','reach','shotSpeed'];
export const EDITABLE=['startup','active','recovery','base'];
const clone=o=>JSON.parse(JSON.stringify(o));
// Lab state from dist/balance/roster.json.
export function baseState(roster){
 const c=roster.constants;
 const sys={hitstun:c.hitStun,launchStun:c.launchStun,blockstun:c.blockStun,chip:c.chip,perfectGuard:c.perfectGuard,captureBreak:c.captureBreak,splitGuard:false,reaction:c.reaction,band:c.band,cancel1:c.cancel1,cancel2:c.cancel2};
 const fighters={};
 for(const f of roster.fighters)fighters[f.id]={id:f.id,name:f.name,title:f.title,color:f.color,intended:f.style,custom:false,
  stats:{speed:f.speed,power:f.power,reach:f.reach,shotSpeed:f.shotSpeed},
  moves:f.moves.map(m=>({key:m.key,move:m.move,group:m.group,input:m.input,type:m.type,startup:m.startup,active:m.active,recovery:m.recovery,base:m.base,range:m.range,effect:m.effect,beats:m.beats,losesTo:m.losesTo,launch:!!m.launch,source:m.source}))};
 const cs=roster.constantSources||{},sources={hitstun:cs.hitStun,launchStun:cs.launchStun,blockstun:cs.blockStun,chip:cs.chip,perfectGuard:cs.perfectGuard,captureBreak:cs.captureBreak,cancel1:cs.cancel1,cancel2:cs.cancel2,reaction:cs.reaction,band:cs.band,splitGuard:'SPACING-COMMITMENT &guard=split (Codex branch)'};
 return {sys,fighters,order:roster.fighters.map(f=>f.id),sources};
}
export const copyState=s=>clone(s);

// ---- Per move ----
export const MELEE=['Melee','Rush','Air','Burst'];
export const open=m=>m.active-1+m.recovery;
export const total=m=>m.startup+m.active+m.recovery;
export const onBlock=(sys,m)=>MELEE.includes(m.type)?sys.blockstun-open(m):null;
export const onHit=(sys,m)=>['Melee','Rush','Air'].includes(m.type)?(m.launch?sys.launchStun:sys.hitstun)-open(m):null;
export const damage=(f,m)=>m.base*f.stats.power;
export const chip=(sys,f,m)=>['Grab','Counter'].includes(m.type)?0:damage(f,m)*sys.chip;
export const ratio=(f,m)=>open(m)?damage(f,m)/open(m)*10:null;
export const move=(f,key)=>f.moves.find(m=>m.key===key);
// Frames between a blocked chain hit n and hit n+1 landing, after the defender's block stun ends.
export function chainGap(sys,f,n){
 const s=move(f,'chain-strike-'+n),next=move(f,'chain-strike-'+(n+1));if(!s||!next)return null;
 return (sys['cancel'+n]-s.startup)+next.startup-sys.blockstun;
}
// Attacker A whiffs Strike 1 at max reach; can defender D close in and land Strike 1 before A recovers?
export function whiff(sys,A,D){
 const a1=move(A,'chain-strike-1'),d1=move(D,'chain-strike-1');
 const gap=Math.max(0,A.stats.reach-D.stats.reach+.05),travel=Math.ceil(gap/D.stats.speed*60);
 const need=sys.reaction+travel+d1.startup,o=open(a1);
 return {open:o,travel,need,margin:o-need,verdict:o>=need?'Reaction punish':o>=need-sys.reaction?'Guess punish':'Not punishable'};
}

// ---- Scores (0..100 on fixed scales, so new fighters compare fairly) ----
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export const norm=(v,lo,hi)=>Math.round(clamp((v-lo)/(hi-lo),0,1)*100);
export function scores(sys,f){
 const s1=move(f,'chain-strike-1'),s2=move(f,'chain-strike-2'),s3=move(f,'chain-strike-3'),sh=move(f,'chain-shot-1');
 return {
  Mobility:norm(f.stats.speed,3,7),
  Reach:norm(f.stats.reach,2,3.5),
  Damage:norm((s1.base+s2.base+s3.base)*f.stats.power,15,30),
  'Attack speed':norm(14-s1.startup,0,8),
  Safety:norm(onBlock(sys,s1),-20,0),
  Zoning:Math.round(norm(f.stats.shotSpeed,6,16)*.5+norm(30-(sh.startup+sh.recovery),0,15)*.5)
 };
}
export const budget=sc=>Math.round(Object.values(sc).reduce((a,b)=>a+b,0)/6);
export function playstyle(sc){
 const c={Rushdown:(sc.Mobility+sc['Attack speed'])/2,Footsies:(sc.Reach+sc.Damage)/2,Zoner:sc.Zoning,Turtle:sc.Safety};
 const top=Object.entries(c).sort((a,b)=>b[1]-a[1]);
 if(top[0][1]<55)return 'Balanced';
 return top[0][1]-top[1][1]<6?`Hybrid ${top[0][0]} / ${top[1][0]}`:top[0][0];
}
export const fighterList=state=>state.order.map(id=>state.fighters[id]).filter(Boolean);
export function rosterAverage(state){
 const all=fighterList(state).map(f=>scores(state.sys,f)),keys=Object.keys(all[0]);
 return Object.fromEntries(keys.map(k=>[k,Math.round(all.reduce((a,s)=>a+s[k],0)/all.length)]));
}

// ---- Live checks: [severity, area, title, detail] ----
export function checks(state){
 const F=fighterList(state),S=state.sys,out=[];
 let reactCount=0,best=null;
 for(const A of F)for(const D of F){if(A===D)continue;const w=whiff(S,A,D);if(w.verdict==='Reaction punish')reactCount++;if(!best||w.margin>best.m)best={m:w.margin,a:A.name,d:D.name};}
 if(!reactCount)out.push(['bad','Missed strike','No Strike 1 whiff can be punished on reaction',`Closest pairing: ${best.d} punishing ${best.a}, still ${-best.m} frames short. Raise Strike 1 recovery, lower punisher startup, or lower the reaction time on the Game rules tab to test.`]);
 else out.push(['good','Missed strike',`${reactCount} pairings can punish a whiff on reaction`,'Missing a jab now carries a real cost in those matchups. Check the Matchups tab.']);
 const minStart=Math.min(...F.map(f=>move(f,'chain-strike-1').startup));
 const lose=F.filter(f=>-onBlock(S,move(f,'chain-strike-1'))>minStart&&chainGap(S,f,1)>minStart);
 if(lose.length)out.push(['bad','Blocked chain',`After a blocked hit, the defender wins both choices for ${lose.map(f=>f.name).join(', ')}`,`Stopping leaves them minus on block, and continuing gives a gap the fastest jab (${minStart} frames) beats. Add pushback, shorten the chain cancel frame, or speed up hit 2 so continuing is a real gamble.`]);
 else out.push(['good','Blocked chain','Continuing a blocked chain is a gamble for every fighter','At least one option after a block is not a guaranteed loss.']);
 if(!S.splitGuard&&S.perfectGuard>0&&S.captureBreak>0)out.push(['warn','Guard',`One guard tap beats both strike and capture (${Math.min(S.perfectGuard,S.captureBreak)} shared frames)`,'Turn on split guard on the Game rules tab so perfect guard covers strikes only and the defender has to guess.']);
 else out.push(['good','Guard','The defender has to guess between strike and capture','Split guard is on, so one tap no longer covers both.']);
 const budgets=F.map(f=>budget(scores(S,f))),mean=budgets.reduce((a,b)=>a+b,0)/budgets.length;
 F.forEach((f,i)=>{const b=budgets[i],sc=scores(S,f);
  if(b>mean+8)out.push(['warn','Budget',`${f.name} is over budget (${b} vs roster ${Math.round(mean)})`,'Strong across the board compared to the rest. Trim a strength or add a clear weakness.']);
  if(b<mean-8)out.push(['warn','Budget',`${f.name} is under budget (${b} vs roster ${Math.round(mean)})`,'Weaker overall. Give them a stronger signature tool or speed up a key move.']);
  if(Object.values(sc).every(v=>v>=40))out.push(['warn','Weakness',`${f.name} has no clear weakness`,'Every score is 40 or higher. Pros will pick them for everything.']);
  if(Math.max(...Object.values(sc))<55)out.push(['warn','Identity',`${f.name} has no clear strength`,'No score reaches 55. Give them one thing they do best.']);
 });
 const confirms=F.filter(f=>onHit(S,move(f,'chain-strike-1'))>0);
 out.push([confirms.length?'good':'warn','Hit confirm',confirms.length?`Plus on hit with Strike 1: ${confirms.map(f=>f.name).join(', ')}`:'No Strike 1 is plus on hit','A plus jab gives the next turn without needing the chain. Usually a rushdown trait.']);
 return out;
}

// ---- Exchange format, shared with the hosted Frame Codex ----
// {sys:{...}, fighters:{id:{id,name,color,intended,custom,stats:{speed,power,reach,shotSpeed},moves:[{key,startup,active,recovery,base}]}}}
export function exportTuning(state){
 const fighters={};
 for(const f of fighterList(state))fighters[f.id]={id:f.id,name:f.name,color:f.color,intended:f.intended,custom:!!f.custom,...(f.custom&&f.template?{template:f.template}:{}),stats:{...f.stats},moves:f.moves.map(m=>({key:m.key,startup:m.startup,active:m.active,recovery:m.recovery,base:m.base}))};
 return {sys:{...state.sys},fighters};
}
const finite=v=>typeof v==='number'&&Number.isFinite(v);
// Applies an exported tuning file on top of the code baseline. Unknown keys are ignored; a custom fighter is created
// from the fighter it lists as a template (or the first fighter) and then takes the file's values.
export function importTuning(base,data){
 if(!data||typeof data!=='object')throw new Error('Not a balance tuning file');
 const state=copyState(base),notes=[];
 for(const k of SYS_KEYS)if(data.sys&&k in data.sys)state.sys[k]=k==='splitGuard'?!!data.sys[k]:finite(data.sys[k])?data.sys[k]:state.sys[k];
 for(const [id,src] of Object.entries(data.fighters||{})){
  let f=state.fighters[id];
  if(!f){
   if(!src.custom){notes.push(`skipped unknown fighter ${id}`);continue;}
   const tpl=state.fighters[src.template]||state.fighters[state.order[0]];
   f=state.fighters[id]={...copyState(tpl),id,title:'New fighter',custom:true,template:tpl.id};state.order.push(id);
  }
  if(typeof src.name==='string'&&f.custom)f.name=src.name;
  if(typeof src.color==='string')f.color=src.color;
  if(typeof src.intended==='string')f.intended=src.intended;
  for(const k of STATS)if(finite(src.stats?.[k]))f.stats[k]=src.stats[k];
  for(const m of src.moves||[]){const t=move(f,m.key);if(!t){notes.push(`${id}: unknown move ${m.key}`);continue;}for(const k of EDITABLE)if(finite(m[k]))t[k]=m[k];}
 }
 return {state,notes};
}

// ---- Changes, as a plain-text task for Codex ----
const SYS_SOURCE={hitstun:'hit stun',launchStun:'launch stun',blockstun:'block stun',chip:'chip share',perfectGuard:'perfect guard window',captureBreak:'capture break window',splitGuard:'split guard',reaction:'human reaction (lab assumption, not a game value)',band:'whiff band (needs the line 100 change)',cancel1:'chain cancel, hit 1',cancel2:'chain cancel, hit 2'};
export function changes(base,state){
 const out={sys:[],fighters:[]};
 for(const k of SYS_KEYS)if(state.sys[k]!==base.sys[k])out.sys.push({key:k,label:SYS_SOURCE[k],from:base.sys[k],to:state.sys[k]});
 for(const f of fighterList(state)){
  if(f.custom){out.fighters.push({id:f.id,name:f.name,custom:true,f});continue;}
  const b=base.fighters[f.id],lines=[];
  for(const k of STATS)if(f.stats[k]!==b.stats[k])lines.push({what:k,from:b.stats[k],to:f.stats[k],source:'dist/fighters.js'});
  if(f.intended!==b.intended)lines.push({what:'intended playstyle',from:b.intended,to:f.intended,source:'dist/fighters.js style'});
  if(f.color!==b.color)lines.push({what:'color',from:b.color,to:f.color,source:'dist/fighters.js'});
  for(const m of f.moves){const bm=move(b,m.key);for(const k of EDITABLE)if(bm[k]!==m[k]){
   const src=m.source||{},where=k==='base'?src.damage:k==='active'&&src.active?src.active:src.timing;
   lines.push({move:m.move,key:m.key,what:k==='base'?'base damage':k,from:bm[k],to:m[k],source:where||'see dist/balance/roster.json'});}}
  if(lines.length)out.fighters.push({id:f.id,name:f.name,lines});
 }
 return out;
}
export function codexTask(base,state){
 const c=changes(base,state),L=[];
 if(!c.sys.length&&!c.fighters.length)return 'No changes yet. Edit a value on the Tune or Game rules tab and it will appear here.';
 L.push('Task: BALANCE-PASS. Apply these tuning changes from the Rift Duel balance lab (dist/balance-lab.html). The simulation owns timing. Keep replay deterministic, add tests for each changed value, regenerate dist/balance/roster.json with npm run balance:extract, and run npm test.','');
 if(c.sys.length){L.push('Game rules:');for(const s of c.sys)L.push(`- ${s.label} (${s.key}): ${s.from} -> ${s.to}${base.sources?.[s.key]?` (${base.sources[s.key]})`:''}`);L.push('');}
 for(const f of c.fighters){
  if(f.custom){const x=f.f;L.push(`New fighter ${x.name} (id ${x.id}, color ${x.color}, intended: ${x.intended}):`,`- stats: speed ${x.stats.speed}, power ${x.stats.power}, reach ${x.stats.reach}, shot speed ${x.stats.shotSpeed} (new entry in dist/fighters.js)`);for(const m of x.moves)L.push(`- ${m.move} [${m.key}]: ${m.startup}/${m.active}/${m.recovery}, base damage ${m.base}`);L.push('');continue;}
  L.push(`${f.name}:`);
  for(const l of f.lines)L.push(l.move?`- ${l.move} ${l.what}: ${l.from} -> ${l.to} (${l.source})`:`- ${l.what}: ${l.from} -> ${l.to} (${l.source})`);
  L.push('');
 }
 L.push('Timings shared by several rows (for example every fighter\'s shot, or a special and its variant) change for all of them when edited at the source. Damage is base damage times the fighter\'s power multiplier.');
 return L.join('\n');
}
