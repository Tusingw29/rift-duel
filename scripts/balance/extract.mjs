// BALANCE-LAB data generator: reads every fighter, move and shared rule straight from the game's modules and writes
// dist/balance/roster.json for dist/balance-lab.html. Never copy a number into this file by hand: timings come from the
// move modules, and the values that are literals inside dist/combat.js (not exports) are read from its source text by
// the patterns below, with their line numbers recorded in the output, so a change there shows up in the next extract.
// Usage: node scripts/balance/extract.mjs [--check]   (npm run balance:extract)
//
// Literals read from dist/combat.js (line numbers as of main fcd8deb; the extract records the current ones):
//   45  const perfect=b.guard&&b.guardTime<.17          perfect guard window
//   48  damage*.12 ... b.blockStun=perfect?0:.12        chip share and block stun
//   49  if(perfect){a.stun=.4 ...                       attacker stun after a perfect guard
//   54  b.stun=launch?.82:.32                           launch stun and hit stun
//   77  damage:15*fighters[a.id].power*multiplier       capture damage; line 76 the context multipliers
//   125 Math.min(a.move.staggerPursuit?4:2,Math.max(0,d-1.6))   pursuit dash
//   129 a.move.crossover=d<3.5                          crossover distance
//   182 if(d<2.3&&b.inv<=0){move.connected=hit(m,a,b,9*f.power);if(move.crossover)b.turnDelay=.5;
//   190 if(d>9||b.inv>0)  ·  192 damage:27*f.power      burst range and damage
//   212 const close=d<3.1  ·  214 b.guardTime<.2        capture range and capture break
//   233 if(d<2.2&&facing)  ·  235 (punish?12:7)*f.power pursuit reach and damage
//   240 d<f.reach+.3 ... hit(m,a,b,8*f.power,'hit',true launcher reach and damage
//   242 move.chain===3?10:6                             strike damage
//   243 life:2 ... (move.chain===3?9:7) ... radius:f.id==='vesper'?.7:.4   shot life, damage, radius
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
import {fighters} from '../../dist/fighters.js';
import {moveTiming,chainCancelFrame} from '../../dist/moves.js';
import {techniques,techniqueVariants} from '../../dist/techniques.js';
import {baseSpecials,specialVariants} from '../../dist/special-variants.js';
import {stockSpecials,stockTiming} from '../../dist/stock-specials.js';
import {REVERSAL_WINDOW,REVERSAL_STARTUP,REVERSAL_RECOVERY,REVERSAL_DAMAGE} from '../../dist/reversal.js';
import {KNOCKDOWN_FRAMES} from '../../dist/recovery.js';
import {CROSSOVER_FRAMES} from '../../dist/combat-travel.js';
export const ROOT=fileURLToPath(new URL('../../',import.meta.url));
export const OUT=ROOT+'dist/balance/roster.json';
const STEP=1/60;
// Same slug as the hosted Rift Duel Frame Codex, so exported tuning keys match: "Capture (close)" -> "capture-close-".
export const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-/,'');
// Frames a timer in seconds covers (hit stun .32 s -> 19).
const frames=s=>Math.round(s*60);
// Frames of guard for which the accumulated guardTime stays under a threshold, stepping exactly as the simulation does.
const windowFrames=limit=>{let t=0,n=0;for(;;){t+=STEP;if(!(t<limit))return n;n++;}};

// ---- Literals in dist/combat.js ----
const PATTERNS={
 perfectGuard:/const perfect=balanceGuard\(m,b,'perfectGuard',([\d.]+)\)/,
 chip:/perfect\?0:damage\*balanceRule\(m,'chip',([\d.]+)\)/,
 blockStun:/b\.blockStun=perfect\?0:\(m\.balance\?\.sys\.blockstun===undefined\?([\d.]+)/,
 parryStun:/if\(perfect\)\{a\.stun=([\d.]+)/,
 stun:/b\.stun=launch\?([\d.]+):([\d.]+)/,
 captureMultiplier:/\{front:1,back:([\d.]+),mid:([\d.]+),far:([\d.]+)\}\[context\]/,
 captureDamage:/damage:(\d+)\*matchFighter\(m,a\)\.power\*multiplier/,
 pursuitDash:/staggerPursuit\?(\d+):(\d+),Math\.max\(0,d-([\d.]+)\)\)/,
 crossover:/a\.move\.crossover=d<([\d.]+)/,
 jump:/if\(d<([\d.]+)&&b\.inv<=0\)\{\s*(?:if\(m\.balance\)move\.contactResolved=true;\s*)?move\.connected=hit\(m,a,b,(\d+)\*f\.power\);\s*if\(move\.crossover\)b\.turnDelay=([\d.]+)/,
 burstRange:/if\(d>(\d+)\|\|b\.inv>0\)\{event\(m,'hint',\{text:'Burst missed/,
 burstDamage:/damage:(\d+)\*f\.power,kind:'super'/,
 captureClose:/const close=d<([\d.]+)/,
 captureBreak:/BALANCE_CAPTURE_BREAK_DEFAULT=([\d.]+)/,
 pursuit:/if\(d<([\d.]+)&&facing\)\{\s*const punish/,
 pursuitDamage:/\(punish\?(\d+):(\d+)\)\*f\.power/,
 launcher:/kind==='launch'\)\s*\{if\(d<f\.reach\+([\d.]+)&&facing&&b\.inv<=0\)\{move\.contactResolved=true;move\.connected=hit\(m,a,b,(\d+)\*f\.power/,
 strikeDamage:/move\.chain===3\?(\d+):(\d+)\)\+\(move\.counter/,
 shot:/life:(\d+),owner:m\.players\.indexOf\(a\),damage:\(move\.chain===3\?(\d+):(\d+)\)\*f\.power,kind:'bolt',radius:f\.id==='vesper'\?([\d.]+):([\d.]+)/
};
export function readCombatLiterals(source=readFileSync(ROOT+'dist/combat.js','utf8')){
 const out={},lines={};
 for(const [name,re] of Object.entries(PATTERNS)){
  const m=re.exec(source);
  if(!m)throw new Error(`balance extract: dist/combat.js no longer matches the "${name}" pattern; read the new code and update scripts/balance/extract.mjs`);
  out[name]=m.slice(1).map(Number);lines[name]=source.slice(0,m.index).split('\n').length;
 }
 return {values:out,lines};
}

// ---- Descriptive text (prose, not tuning numbers; matches the hosted Frame Codex wording) ----
const STRIKE_TEXT=n=>({effect:n<3?'Stagger build':'Longer hitstop',beats:'Slow startups, approaches',losesTo:n<3?'Timed guard, quicker strike':'Third-hit reversal, timed guard, sidestep'});
const SHOT_TEXT={beats:'Charging, slow approach',losesTo:'Sidestep, timed-guard reflect, rush during recovery'};
const DIRECTION={forward:'Toward',back:'Away',technique:'Up'};
const round1=v=>Math.round(v*10)/10;
const projectileTypes=['wheel','fan','lance'];

// Effect text for a projectile or area special, built from its data.
function specialEffect(s,kind,{variant=false}={}){
 const parts=[],hits=(s.count||1)*(s.pulses||1);
 if(s.stun)parts.push(`Stun ${s.stun}s`);
 if(s.low)parts.push('Low');
 if(s.knockdown)parts.push('Knockdown');
 if(hits>1)parts.push(variant?`${hits} hits (all must land)`:`${hits} hits`);
 if(variant&&s.spread)parts.push('Spread');
 if(variant&&s.offset)parts.push('Covers sidesteps');
 if(!variant&&kind==='back')parts.push('Retreats 1.2');
 if(!parts.length)parts.push(variant?'Single hit':'Clean shot');
 return parts.join(', ');
}
function projectileRange(s){
 if(s.area)return s.advance?{range:`Advances to ${round1(s.advance*(s.pulses||1)+s.area)}`,rangeMax:round1(s.advance*(s.pulses||1)+s.area)}:{range:`${s.area} radius`,rangeMax:s.area};
 const max=s.speed*(s.life||2.6);return {range:`${Math.round(max)} (speed ${s.speed})`,rangeMax:+max.toFixed(2)};
}
const timing=t=>({startup:t.startup,active:t.active||1,recovery:t.recovery});

// source: where each value lives, for the lab's Codex task text (file, plus the export or the combat.js line).
export function fighterMoves(f,L,lines){
 const id=f.id,moves=[],push=(group,move,input,type,t,base,extra,source)=>moves.push({key:`${group.toLowerCase()}-${slug(move)}`,group,move,input,type,...timing(t),base,...extra,source});
 const C=name=>`dist/combat.js line ${lines[name]}`,M=kind=>`dist/moves.js moveTiming '${kind}'`;
 const [strike3,strike]=L.strikeDamage,[shotLife,shot3,shot]=L.shot;
 // Chain: three strikes and the three shots a neutral attack becomes out of reach.
 ['Attack (close)','Attack (chain hit 2)','Attack (chain hit 3)'].forEach((input,i)=>push('Chain',`Strike ${i+1}`,input,'Melee',moveTiming(f,'strike',i+1),i===2?strike3:strike,{range:`${f.reach} (own reach)`,rangeMax:f.reach,...STRIKE_TEXT(i+1)},{timing:`dist/moves.js moveTiming 'strike' chain ${i+1}`,damage:C('strikeDamage')}));
 const radius=id==='vesper'?L.shot[3]:L.shot[4];
 ['Attack (out of reach)','Attack (shot chain 2)','Attack (shot chain 3)'].forEach((input,i)=>push('Chain',`Shot ${i+1}`,input,'Projectile',moveTiming(f,'shot',i+1),i===2?shot3:shot,{range:`${Math.round(f.shotSpeed*shotLife)} (speed ${f.shotSpeed})`,rangeMax:f.shotSpeed*shotLife,effect:radius>.5?`Wide shot (radius ${radius})`:`Radius ${radius}`,...SHOT_TEXT},{timing:M('shot'),damage:C('shot')}));
 // Specials and their wind-up variants (forward, back), then the technique (up) and its variant.
 for(const kind of ['forward','back']){
  const t=moveTiming(f,kind),s=baseSpecials[id][kind],v=specialVariants[id][kind];
  // dist/combat.js line 110: a pulsed special keeps the channel open for every pulse.
  const sActive=Math.max(t.active,1+((s.pulses||1)-1)*(s.interval||1));
  push('Special',s.name,`${DIRECTION[kind]} + Attack`,s.area?'Area':'Projectile',{...t,active:sActive},s.damage*(s.count||1)*(s.pulses||1),{...projectileRange(s),effect:specialEffect(s,kind),beats:kind==='back'?'Rushdown, pursuit':'Approach, charge',losesTo:'Sidestep, reflect, punish in recovery',note:s.description},{timing:M(kind),active:`dist/special-variants.js baseSpecials.${id}.${kind} (pulses, interval)`,damage:`dist/special-variants.js baseSpecials.${id}.${kind}`});
  // dist/special-variants.js applySpecialVariant: active = variant.active || 1 + (pulses - 1) * interval.
  push('Variant',v.name,`${DIRECTION[kind]} + Attack, tap again in wind-up`,v.area?'Area':'Projectile',{...t,active:v.active||1+((v.pulses||1)-1)*(v.interval||1)},v.damage*(v.count||1)*(v.pulses||1),{...projectileRange(v),effect:specialEffect(v,kind,{variant:true}),beats:v.spread||v.offset?'Sidesteps':'Approach',losesTo:'Punish in recovery',note:v.description},{timing:M(kind),active:`dist/special-variants.js specialVariants.${id}.${kind}`,damage:`dist/special-variants.js specialVariants.${id}.${kind}`});
 }
 const tech=techniques[id],tv={...tech,...techniqueVariants[id]};
 for(const [group,m,name,input] of [['Special',tech,f.moves[2],'Up + Attack'],['Variant',tv,techniqueVariants[id].name,'Up + Attack, tap again in wind-up']]){
  // dist/combat.js line 165: wheel, fan and lance techniques fire projectiles (fan fires three) instead of travelling.
  const projectile=projectileTypes.includes(m.effect),count=m.effect==='fan'?3:1,speed=m.effect==='lance'?18:9;
  const travel=m.speed*m.active/60;
  // The technique lists its travel even when it is zero (the hosted Frame Codex format); a variant lists it only when it moves.
  const range=projectile?{range:`${Math.round(speed*2.6)} (speed ${speed})`,rangeMax:+(speed*2.6).toFixed(2)}:{range:group==='Special'||travel>0?`${m.reach} reach, travels ${travel.toFixed(1)}`:`${m.reach} reach`,rangeMax:+(m.reach+travel).toFixed(2)};
  const effect=group==='Variant'?(m.secondHit?'Two hits':techniqueVariants[id].effect||'Single hit'):(m.launch?'Launches, ':'')+m.effect;
  push(group,name,input,projectile?'Projectile':'Rush',m,m.damage*(m.secondHit?2:1)*count,{...range,effect,beats:'Mid-range waiting',losesTo:'Guard, sidestep',launch:!!m.launch},group==='Special'?{timing:`dist/techniques.js techniques.${id}`,damage:`dist/techniques.js techniques.${id}`}:{timing:`dist/techniques.js techniques.${id} + techniqueVariants.${id}`,damage:`dist/techniques.js techniqueVariants.${id}`});
 }
 // System moves.
 const [cBack,cMid]=L.captureMultiplier,pct=v=>Math.round((v-1)*100);
 push('System','Capture (close)','Down + Attack','Grab',moveTiming(f,'capture'),L.captureDamage[0],{range:`< ${L.captureClose[0]} (projectile beyond)`,rangeMax:L.captureClose[0],effect:`Beats held guard. Back +${pct(cBack)}%, mid +${pct(cMid)}%`,beats:'Held guard',losesTo:`Fresh guard (${windowFrames(L.captureBreak[0])}f window), any strike`},{timing:M('capture'),damage:C('captureDamage')});
 push('System','Launcher','Double-tap Down + Attack','Melee',moveTiming(f,'launch'),L.launcher[1],{range:(f.reach+L.launcher[0]).toFixed(2),rangeMax:+(f.reach+L.launcher[0]).toFixed(2),effect:'Launches into pursuit',beats:'Grounded rival',losesTo:'Guard',launch:true},{timing:M('launch'),damage:C('launcher')});
 const [punish,pursuit]=L.pursuitDamage,dash=L.pursuitDash[1];
 push('System','Pursuit','Double-tap Toward + Attack','Rush',moveTiming(f,'pursuit'),pursuit,{range:`${L.pursuit[0]} after a dash up to ${dash}`,rangeMax:L.pursuit[0]+dash,effect:`Stagger punish does ${punish} + knockdown`,beats:'Staggered or launched rival',losesTo:'Guard, sidestep'},{timing:M('pursuit'),damage:C('pursuitDamage')});
 push('System','Jumping crossover','Double-tap Up + Attack','Air',{...moveTiming(f,'jumpAttack'),startup:CROSSOVER_FRAMES},L.jump[1],{range:`${L.jump[0]}, crosses over inside ${L.crossover[0]}`,rangeMax:L.jump[0],effect:`Turns rival around ${L.jump[2]}s`,beats:'Guard facing wrong way',losesTo:'Anti-air timing'},{timing:`dist/combat-travel.js CROSSOVER_FRAMES (startup), ${M('jumpAttack')} (recovery)`,damage:C('jump')});
 push('System',f.special,'Double-tap Away + Attack (1 stock)','Burst',moveTiming(f,'super'),L.burstDamage[0],{range:String(L.burstRange[0]),rangeMax:L.burstRange[0],effect:'Cinematic, costs a stock',beats:'Recovery, slow moves',losesTo:'Guard, long range'},{timing:M('super'),damage:C('burstDamage')});
 // Stock specials (hold attack with a direction; one stock each). dist/combat.js line 114 sets their active frames.
 for(const [kind,s] of Object.entries(stockSpecials[id]||{})){
  const t=moveTiming(f,kind),hits=(s.count||1)*(s.pulses||1);
  push('Stock',s.name,`${DIRECTION[kind]} + hold attack (1 stock)`,s.area?'Area':'Projectile',{...t,active:Math.max(t.active,stockTiming(s))},s.damage*hits,{...projectileRange(s),effect:hits>1?`${hits} hits`:s.radius>=1.2?'Huge hitbox':'Single hit',beats:'Defensive play',losesTo:'Punish in recovery',note:s.description.replace(/^[^:]*:\s*/,'')},{timing:M(kind),active:`dist/stock-specials.js stockSpecials.${id}.${kind} (pulses, interval)`,damage:`dist/stock-specials.js stockSpecials.${id}.${kind}`});
 }
 push('Defense','Third-hit reversal','Guard in the window before chain hit 3','Counter',{startup:REVERSAL_STARTUP,active:1,recovery:REVERSAL_RECOVERY},REVERSAL_DAMAGE,{range:'Point blank',rangeMax:f.reach,effect:'Answers a predictable third hit',beats:'Autopilot chains',losesTo:'Stopping after hit 2'},{timing:'dist/reversal.js REVERSAL_STARTUP / REVERSAL_RECOVERY',damage:'dist/reversal.js REVERSAL_DAMAGE'});
 for(const m of moves)if(!m.launch)delete m.launch;
 return moves;
}

export function buildRoster(source){
 const {values:L,lines}=readCombatLiterals(source);
 const [launch,hit]=L.stun;
 const constants={
  hitStun:frames(hit),hitStunSeconds:hit,launchStun:frames(launch),launchStunSeconds:launch,
  blockStun:frames(L.blockStun[0]),blockStunSeconds:L.blockStun[0],chip:L.chip[0],parryStun:frames(L.parryStun[0]),
  perfectGuard:windowFrames(L.perfectGuard[0]),perfectGuardSeconds:L.perfectGuard[0],
  captureBreak:windowFrames(L.captureBreak[0]),captureBreakSeconds:L.captureBreak[0],
  cancel1:chainCancelFrame({kind:'strike',chain:1}),cancel2:chainCancelFrame({kind:'strike',chain:2}),
  reversalWindow:REVERSAL_WINDOW,knockdownFrames:KNOCKDOWN_FRAMES,
  // Not code values: the balance lab's assumptions, shared with the hosted Frame Codex.
  reaction:15,band:1.15
 };
 const C=name=>`dist/combat.js line ${lines[name]}`;
 const constantSources={hitStun:C('stun'),launchStun:C('stun'),blockStun:C('blockStun'),chip:C('chip'),parryStun:C('parryStun'),perfectGuard:C('perfectGuard'),captureBreak:C('captureBreak'),
  cancel1:'dist/moves.js chainCancelFrame',cancel2:'dist/moves.js chainCancelFrame',reversalWindow:'dist/reversal.js REVERSAL_WINDOW',knockdownFrames:'dist/recovery.js KNOCKDOWN_FRAMES',
  reaction:'balance lab assumption (not in the game)',band:'balance lab assumption; needs the line 100 change (SPACING-COMMITMENT &spacing=band)'};
 return {
  about:'Generated by scripts/balance/extract.mjs from the game modules. Do not edit by hand; run npm run balance:extract.',
  sources:{'dist/combat.js':lines},
  constants,constantSources,
  fighters:fighters.map(f=>({id:f.id,name:f.name,title:f.title,color:f.color,style:f.style,speed:f.speed,power:f.power,reach:f.reach,shotSpeed:f.shotSpeed,moves:fighterMoves(f,L,lines)}))
 };
}
export const serialize=r=>JSON.stringify(r,null,1)+'\n';
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
 const text=serialize(buildRoster());
 if(process.argv.includes('--check')){
  let current='';try{current=readFileSync(OUT,'utf8');}catch{}
  if(current!==text){console.error('dist/balance/roster.json is out of date: run npm run balance:extract');process.exit(1);}
  console.log('dist/balance/roster.json is current');
 }else{mkdirSync(ROOT+'dist/balance',{recursive:true});writeFileSync(OUT,text);const n=JSON.parse(text).fighters.reduce((a,f)=>a+f.moves.length,0);console.log(`wrote dist/balance/roster.json: ${JSON.parse(text).fighters.length} fighters, ${n} moves`);}
}
