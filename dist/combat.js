import {RETREAT_DISTANCE,retreatProgress} from './retreat-motion.js';
import {BURST_DURATIONS,capturePresentation} from './cinematics.js';
import {moveTiming,INPUT_BUFFER_FRAMES,canChain} from './moves.js';
import {canFollowUp,applyTechniqueVariant} from './techniques.js';
import {canSpecialFollowUp,applySpecialVariant,specialShots,baseSpecials} from './special-variants.js';
import {stockSpecials,stockTiming} from './stock-specials.js';
import {createCommandState,readCommand} from './commands.js';
import {fighters} from './fighters.js';
import {normalizeOptions} from './options.js';
export const STEP=1/60;
// Power gauge: holding attack fills one stock per CHARGE_PER_STOCK units; low health charges faster.
export const CHARGE_PER_STOCK=1.8,MAX_STOCKS=3;
export const chargeRate=hp=>1+(100-hp)/65;
export const neutral=()=>({x:0,z:0,attack:false,guard:false,capture:false,launch:false,pursuit:false,super:false});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// Held stock variants are intentionally limited to these researched archetypes.
export const hasStockVariant=(id,command)=>!!stockSpecials[fighters[id]?.id]?.[command];
export function createMatch(a=0,b=1,mode='duel',difficulty='normal',options={}) {
 const rules=normalizeOptions(options);
 const fighter=(id,x)=>({id,x,z:0,hp:100,stocks:1,charge:0,cool:0,stun:0,blockStun:0,air:0,launched:false,roll:null,inv:0,guard:false,guardTime:0,held:0,prev:neutral(),combo:0,comboTime:0,anim:'idle',animTime:0,face:x<0?1:-1,lookX:x<0?1:-1,lookZ:0,turnDelay:0,commands:createCommandState(),move:null,buffer:null});
 return {players:[fighter(a,-4),fighter(b,4)],projectiles:[],events:[],rules:{roundSeconds:rules.roundSeconds,winsNeeded:rules.winsNeeded},time:rules.roundSeconds,tick:0,phase:'fight',winner:null,mode,difficulty,cinematic:null,aiClock:0,ai:neutral()};
}
function event(m,type,values={}){m.events.push({type,...values});}
function distance(a,b){return Math.hypot(a.x-b.x,a.z-b.z);}
export function hit(m,a,b,damage,kind='hit',launch=false){
 if(b.inv>0||b.hp<=0)return false;
 const perfect=b.guard&&b.guardTime<.17;
 if(b.guard&&kind!=='capture'){
  event(m,perfect?'parry':'block',{x:b.x,z:b.z,color:fighters[b.id].color});
  b.hp=Math.max(1,b.hp-(perfect?0:damage*.12)); b.blockStun=perfect?0:.12;
  if(perfect){a.stun=.4;a.move=null;a.buffer=null;a.cool=0;b.charge+=.35;}
  return false;
 }
 b.move=null;b.buffer=null;b.roll=null;b.launched=launch;b.cool=0;b.blockStun=0;if(m.cinematic?.a===m.players.indexOf(b))m.cinematic=null;
 b.hp=Math.max(0,b.hp-damage); b.stun=launch?.82:.32; b.air=launch?.85:0;
 b.anim=launch?'launch':'hurt';b.animTime=.42;
 const dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz)||1;
 b.x=clamp(b.x+dx/d*.5,-11,11);b.z=clamp(b.z+dz/d*.5,-6,6);
 a.combo=a.comboTime>0?a.combo+1:1;a.comboTime=1.35;
 event(m,'hit',{x:b.x,z:b.z,color:fighters[a.id].color,damage,combo:a.combo});
 return true;
}
export function captureContext(a,b){
 const d=distance(a,b);
 if(d>=6)return 'far';
 if(d>=3.1)return 'mid';
 const dot=(a.x-b.x)*b.lookX+(a.z-b.z)*b.lookZ;
 return dot<-.25?'back':'front';
}
function beginCapture(m,a,b,context){
 const multiplier={front:1,back:1.2,mid:1.1,far:1.25}[context];
 m.cinematic={a:m.players.indexOf(a),b:m.players.indexOf(b),t:0,...capturePresentation(fighters[a.id].id,context),damage:15*fighters[a.id].power*multiplier,kind:'capture',context,name:fighters[a.id].capture};
 event(m,'cinematic',{text:`${fighters[a.id].capture} / ${context.toUpperCase()}`});
}
function action(m,a,b,requested,empowered=false){
 if(a.stun>0||a.guard||m.cinematic)return;
 const previous=a.move;
 if(!empowered&&canSpecialFollowUp(previous)&&(requested==='attack'||requested===previous.kind)){
  applySpecialVariant(previous,fighters[a.id].id);
  a.cool=(previous.total-previous.frame)*STEP;a.animTime=a.cool;a.held=0;
  event(m,'hint',{text:previous.name.toUpperCase()});return;
 }
 if(['attack','technique'].includes(requested)&&!empowered&&canFollowUp(previous)){
  applyTechniqueVariant(previous,fighters[a.id].id);
  a.cool=(previous.total-previous.frame)*STEP;a.animTime=a.cool;a.held=0;
  event(m,'hint',{text:previous.name.toUpperCase()});return;
 }
 const chaining=canChain(previous)&&(requested==='attack'||previous.chain===2&&['capture','launch','forward','back','technique','pursuit','jumpAttack','super'].includes(requested));
 if((a.move||a.cool>0)&&!chaining){
  const remaining=a.move?a.move.total-a.move.frame:Math.ceil(a.cool/STEP);
  if(remaining<=INPUT_BUFFER_FRAMES)a.buffer={kind:requested,empowered,expires:m.tick+INPUT_BUFFER_FRAMES+1};
  return;
 }
 const f=fighters[a.id],d=distance(a,b),kind=requested==='attack'?(chaining?previous.kind:d<f.reach?'strike':'shot'):requested;
 empowered=empowered&&hasStockVariant(a.id,kind);
 if((kind==='super'||empowered)&&a.stocks<1){event(m,'hint',{text:'Hold attack without a direction to charge a power stock'});return;}
 if(kind==='super'||empowered)a.stocks--;
 const timing=moveTiming(f,kind);
 a.move={kind,...timing,empowered,chain:chaining?previous.chain+1:1,connected:false,frame:0,started:m.tick,aimX:(b.x-a.x)/(d||1),aimZ:(b.z-a.z)/(d||1)};
 if(f.id==='tala'&&kind==='back'&&!a.air)a.move.retreatTravel=true;
 if(!empowered&&baseSpecials[f.id]?.[kind]){
  const special=baseSpecials[f.id][kind];a.move.special=special;
  a.move.active=1+((special.pulses||1)-1)*(special.interval||1);a.move.total=timing.startup+a.move.active+timing.recovery;
 }
 if(empowered){
  a.move.stockSpecial=stockSpecials[f.id][kind];
  a.move.active=stockTiming(a.move.stockSpecial);a.move.total=timing.startup+a.move.active+timing.recovery;
 }
 if(kind==='pursuit'&&b.air>0&&d<9){
  a.move.aerial=true;a.move.active=19;a.move.total=timing.startup+19+timing.recovery;
  a.move.glideX=(b.x-a.x-a.move.aimX*1.6)/timing.startup;
  a.move.glideZ=(b.z-a.z-a.move.aimZ*1.6)/timing.startup;
  a.air=.45;
 }
 a.buffer=null;
 if(chaining&&previous.kind==='strike'&&d<f.reach+.5){
  const advance=Math.min(.4,Math.max(0,d-1.2));
  a.x=clamp(a.x+a.move.aimX*advance,-11,11);a.z=clamp(a.z+a.move.aimZ*advance,-6,6);
 }
 if(chaining)event(m,'hint',{text:`CHAIN ${a.move.chain} / 3`});
 a.cool=a.move.total*STEP;a.anim=kind==='shot'?'attack':kind;a.animTime=a.cool;
 a.held=0;
}
function executeAction(m,a,b,move){
 const kind=move.kind,f=fighters[a.id],d=distance(a,b),dx=move.aimX,dz=move.aimZ;
 const facing=d<.01||((b.x-a.x)*dx+(b.z-a.z)*dz)/d>.55;
 if(move.stockSpecial){
  const s=move.stockSpecial,offset=move.frame-move.startup;
  if(offset===0){
   event(m,'hint',{text:s.name.toUpperCase()+' · 1 STOCK'});
   if(kind==='back'&&!move.retreatTravel){a.x=clamp(a.x-dx*1.2,-11,11);a.z=clamp(a.z-dz*1.2,-6,6);}
  }
  if(offset%(s.interval||1)!==0)return;
  if(s.area){
   const reach=s.advance*(1+offset/s.interval),x=a.x+dx*reach,z=a.z+dz*reach;
   if(Math.hypot(b.x-x,b.z-z)<s.area)hit(m,a,b,s.damage*f.power);
   event(m,'shot',{color:f.color});
  }else{m.projectiles.push(...specialShots(s,a,move,m.players.indexOf(a),f.power));event(m,'shot',{color:f.color});}
  return;
 }
 if(kind==='technique'){
  if(move.frame===move.startup)event(m,'hint',{text:move.name||f.moves[2]});
  if(move.secondHit&&move.frame===move.startup+move.secondHit)move.connected=false;
  if(['wheel','fan','lance'].includes(move.effect)){
   if(move.frame!==move.startup)return;
   const count=move.effect==='fan'?3:1,speed=move.effect==='lance'?18:9;
   for(let j=0;j<count;j++){
    const angle=Math.atan2(dz,dx)+(j-(count-1)/2)*.3;
    m.projectiles.push({x:a.x+dx,z:a.z+dz,dx:Math.cos(angle)*speed,dz:Math.sin(angle)*speed,life:2.6,owner:m.players.indexOf(a),damage:move.damage*f.power,kind:move.effect==='lance'?'beam':'wheel',radius:move.effect==='lance'?.5:.9});
   }
   event(m,'shot',{color:f.color});return;
  }
  if(!move.connected){
   a.x=clamp(a.x+dx*move.speed*STEP,-11,11);a.z=clamp(a.z+dz*move.speed*STEP,-6,6);
   const radial=['spin','sphere'].includes(move.effect);
   if(distance(a,b)<move.reach&&(radial||facing)&&b.inv<=0){
    move.connected=true;hit(m,a,b,move.damage*f.power,'hit',!!move.launch);
   }
  }
  return;
 }
 if(kind==='jumpAttack'){
  a.air=.85;a.inv=.12;
  if(d<3.5){a.x=clamp(b.x+dx*1.6,-11,11);a.z=clamp(b.z+dz*1.6,-6,6);b.turnDelay=.5;hit(m,a,b,9*f.power);}
  else{a.x=clamp(a.x+dx*2.5,-11,11);a.z=clamp(a.z+dz*2.5,-6,6);}
  event(m,'hint',{text:d<3.5?'CROSSOVER STRIKE':'LEAP STRIKE'});return;
 }
 if(kind==='super'){

  if(d>9||b.inv>0){event(m,'hint',{text:'Burst missed — close the distance'});return;}
  m.cinematic={a:m.players.indexOf(a),b:m.players.indexOf(b),t:0,duration:BURST_DURATIONS[f.id],damage:27*f.power,kind:'super',name:f.special};
  event(m,'cinematic',{text:f.special});return;
 }
 if(kind==='forward'||kind==='back'){
  if(move.special){
   const s=move.special,offset=move.frame-move.startup;
   if(offset===0){
    event(m,'hint',{text:s.name});
    if(kind==='back'&&!move.retreatTravel){a.x=clamp(a.x-dx*1.2,-11,11);a.z=clamp(a.z-dz*1.2,-6,6);}
    if(s.area){if(d<s.area)hit(m,a,b,s.damage*f.power);return;}
   }
   if(s.area)return;
   if(offset%(s.interval||1)===0){m.projectiles.push(...specialShots(s,a,move,m.players.indexOf(a),f.power));event(m,'shot',{color:f.color});}
   return;
  }
  return;
 }
 if(kind==='capture'){
  if(b.inv>0)return;
  
  const close=d<3.1;
  if(close){
   if(b.guard&&b.guardTime<.2){a.move=null;a.buffer=null;a.cool=0;a.stun=.6;event(m,'hint',{text:'CAPTURE BREAK'});return;}
   beginCapture(m,a,b,captureContext(a,b));
  }else{
   m.projectiles.push({x:a.x+dx,z:a.z+dz,dx:dx*7,dz:dz*7,life:1.8,owner:m.players.indexOf(a),damage:12*f.power,kind:'capture',context:captureContext(a,b),radius:.65});event(m,'shot',{color:f.color});
  }return;
 }
 if(kind==='pursuit'){
  if(move.aerial){
   if(move.aborted||b.inv>0||b.air<=0||d>3){move.aborted=true;return;}
   const beat=move.frame-move.startup;
   if(beat!==0&&beat!==9&&beat!==18)return;
   const last=beat===18,previousAir=b.air;
   const landed=hit(m,a,b,(last?6:4)*f.power,'hit',!last);
   if(!landed){move.aborted=true;return;}
   move.pursuitHit=beat/9+1;a.air=last?.16:.4;
   if(!last)b.air=clamp(previousAir,.35,.65);
   if(last){b.air=0;b.launched=false;b.stun=.55;b.anim='knockdown';b.animTime=.55;}
   event(m,'hint',{text:`AERIAL PURSUIT ${move.pursuitHit} / 3`});return;
  }
  a.x=clamp(a.x+dx*2,-11,11);a.z=clamp(a.z+dz*2,-6,6);if(d<4)hit(m,a,b,7*f.power);
  return;
 }
 if(kind==='launch') {if(d<f.reach+.3&&facing)hit(m,a,b,8*f.power,'hit',true);return;}
 
 if(kind==='strike'){if(d<f.reach&&facing&&b.inv<=0){move.connected=true;hit(m,a,b,(move.chain===3?10:6)*f.power);}}
 else {move.connected=true;m.projectiles.push({x:a.x+dx*.8,z:a.z+dz*.8,dx:dx*f.shotSpeed,dz:dz*f.shotSpeed,life:2,owner:m.players.indexOf(a),damage:(move.chain===3?9:7)*f.power,kind:'bolt',radius:f.id==='vesper'?.7:.4});event(m,'shot',{color:f.color});}
}
export function aiInput(m,dt){
 m.aiClock-=dt;
 if(m.aiClock>0)return m.ai;
 const a=m.players[1],b=m.players[0],d=distance(a,b),f=fighters[a.id];
 const skill=m.difficulty==='hard'?1:m.difficulty==='easy'?.4:.7;
 const random=()=>{m.seed=((m.seed||1234567)*1664525+1013904223)>>>0;return m.seed/4294967296;};
 m.aiClock=.14+random()*.23/skill;
 const i=neutral(),r=random(),preferred=f.id==='tala'?1.8:f.id==='sol'||f.id==='vesper'?6:3;
 i.x=d>preferred?1:d<preferred-1?-1:0;
 i.z=r<.25?1:r>.8?-1:0;
 const incoming=m.projectiles.some(p=>p.owner===0&&Math.hypot(p.x-a.x,p.z-a.z)<4);
 i.guard=(incoming||b.anim==='strike')&&r<skill;
 i.attack=!i.guard&&r<.8;
 i.capture=d<3&&r>.8;i.launch=d<3&&r<.18;i.pursuit=b.air>0;
 i.super=a.stocks>0&&r>.92&&d<8;
 return m.ai=i;
}
export function update(m,inputs,dt=STEP){
 m.events=[];if(m.phase!=='fight')return;
 m.tick++;m.time-=m.mode==='training'?0:dt;
 if(m.cinematic){
  const c=m.cinematic;c.t+=dt;
  if(c.t>=c.duration){const a=m.players[c.a],b=m.players[c.b];const landed=hit(m,a,b,c.damage,c.kind==='capture'?'capture':'hit',c.kind==='capture');if(landed&&c.kind==='super'){b.anim='knockdown';b.animTime=.7;b.stun=.7;b.air=0;}m.cinematic=null;}
 }else{
  m.players.forEach((a,n)=>{
   const i=inputs[n]||neutral(),b=m.players[1-n];
   a.turnDelay=Math.max(0,a.turnDelay-dt);
   if(a.turnDelay===0&&a.stun===0&&!a.move){const d=distance(a,b)||1;a.lookX=(b.x-a.x)/d;a.lookZ=(b.z-a.z)/d;a.face=b.x>=a.x?1:-1;}
   const command=readCommand(a.commands,i,a.prev,1,m.tick);
   const freshGuard=i.guard&&!a.prev.guard;
   const freshDepth=Math.abs(i.z)>.5&&(Math.abs(a.prev.z)<=.5||Math.sign(i.z)!==Math.sign(a.prev.z));
   if(a.anim==='knockdown'&&a.stun>0&&a.stun<=.55&&freshDepth){
    a.roll={direction:Math.sign(i.z),elapsed:0};a.stun=.3;a.cool=.3;a.inv=.22;a.anim='roll';a.animTime=.3;
    event(m,'hint',{text:'RECOVERY ROLL',player:n});
   }
   if(freshGuard&&a.air>0){a.move=null;a.buffer=null;a.launched=false;a.air=.16;a.stun=0;a.inv=.25;a.cool=.2;a.anim='recover';a.animTime=.25;event(m,'hint',{text:'AIR RECOVERY',player:n});}
   else if(command==='jump'&&a.stun<=0&&a.cool<=0){a.air=.85;a.inv=.18;a.cool=.25;a.anim='jump';a.animTime=.85;event(m,'hint',{text:'JUMP',player:n});}
   else if(freshGuard&&i.x>.5&&distance(a,b)<3.5&&a.stun<=0&&a.cool<=0){
    const d=distance(a,b)||1,dx=(b.x-a.x)/d,dz=(b.z-a.z)/d;
    a.x=clamp(b.x+dx*1.6,-11,11);a.z=clamp(b.z+dz*1.6,-6,6);a.inv=.15;a.cool=.12;b.turnDelay=.45;
    event(m,'hint',{text:'CIRCLE STEP',player:n});
   }
   a.guard=(i.guard||a.blockStun>0)&&a.stun<=0&&a.air===0&&!a.move;a.guardTime=a.guard?a.guardTime+dt:0;
  });
  m.players.forEach((a,n)=>{
   const b=m.players[1-n],i=inputs[n]||neutral(),f=fighters[a.id];
   const wasAir=a.air;
   for(const k of ['cool','stun','blockStun','air','inv','comboTime','animTime'])a[k]=Math.max(0,a[k]-dt);
   if(a.launched&&wasAir>0&&a.air===0){a.launched=false;a.anim='knockdown';a.animTime=.55;a.stun=.55;a.move=null;a.buffer=null;a.cool=0;}
   if(a.roll){a.z=clamp(a.z+a.roll.direction*8*dt,-6,6);a.roll.elapsed+=dt;if(a.roll.elapsed>=.3)a.roll=null;}
   if(a.animTime===0)a.anim='idle';
   if(a.stun<=0){
    if(a.buffer&&a.buffer.expires<m.tick)a.buffer=null;
    if(a.buffer&&!a.move&&a.cool<=0){const buffered=a.buffer;a.buffer=null;action(m,a,b,buffered.kind,buffered.empowered);}
    const len=Math.max(1,Math.hypot(i.x,i.z)),speed=f.speed*(a.blockStun>0?0:1)*(a.move?.12:1)*(a.guard?.25:1)*(i.attack?.35:1);
    // Lock-on movement: x closes or retreats along the line to the rival, z circles.
    const fx=a.lookX,fz=a.lookZ;a.x=clamp(a.x+(i.x*fx-i.z*fz)/len*speed*dt,-11,11);a.z=clamp(a.z+(i.x*fz+i.z*fx)/len*speed*dt,-6,6);
    if((i.x||i.z)&&a.anim==='idle')a.anim='run';
    if(i.attack&&!a.guard){a.held+=dt;if(a.held>.24&&!a.move){a.anim='charge';if(!hasStockVariant(a.id,a.commands.attack)){if(a.stocks<MAX_STOCKS){a.charge+=dt*chargeRate(a.hp);if(a.charge>=CHARGE_PER_STOCK){a.charge=0;a.stocks++;event(m,'stock',{player:n});}}}}}
    if(!i.attack&&a.prev.attack){if(a.held>0&&(a.held<=.24||hasStockVariant(a.id,a.commands.attack)))action(m,a,b,a.commands.attack||'attack',a.held>.24);a.held=0;}
    if(!i.attack)a.held=0;
    for(const kind of ['capture','launch','pursuit','super'])if(i[kind]&&!a.prev[kind])action(m,a,b,kind);
   }else{a.held=0;}
   a.prev={...i};
  });
  // Advance both timelines before resolving contact, so equally timed strikes
  // can trade rather than always favoring player one.
  const contacts=[];
  for(const a of m.players){
   const move=a.move;if(!move||move.started===m.tick)continue;
   move.frame++;a.cool=Math.max(0,(move.total-move.frame)*STEP);a.animTime=a.cool;
   if(move.retreatTravel&&move.frame<=move.startup){
    const distance=RETREAT_DISTANCE*(retreatProgress(move)-retreatProgress(move,move.frame-1));
    a.x=clamp(a.x-move.aimX*distance,-11,11);a.z=clamp(a.z-move.aimZ*distance,-6,6);
   }
   if(move.aerial&&move.frame<=move.startup){
    a.x=clamp(a.x+move.glideX,-11,11);a.z=clamp(a.z+move.glideZ,-6,6);
   }
   if(move.frame>=move.startup&&move.frame<move.startup+move.active)contacts.push({a,b:m.players[1-m.players.indexOf(a)],move});
   if(move.frame>=move.total){a.move=null;a.cool=0;a.anim='idle';}
  }
  const clash=contacts.length===2&&contacts.every(c=>['capture','super'].includes(c.move.kind));
  if(clash){for(const {a} of contacts){a.move=null;a.buffer=null;a.cool=0;a.stun=.3;a.anim='hurt';a.animTime=.3;}event(m,'hint',{text:'POWER CLASH'});}
  else for(const {a,b,move} of contacts)executeAction(m,a,b,move);
  const [a,b]=m.players,d=distance(a,b);
  if(d<1.2){const dx=(b.x-a.x)/(d||1)||1,dz=(b.z-a.z)/(d||1);a.x-=dx*(1.2-d)/2;b.x+=dx*(1.2-d)/2;a.z-=dz*(1.2-d)/2;b.z+=dz*(1.2-d)/2;}
  for(const p of m.projectiles){
   p.x+=p.dx*dt;p.z+=p.dz*dt;p.life-=dt;
   const a=m.players[p.owner],b=m.players[1-p.owner];
   const barrier=b.move?.kind==='technique'&&b.move.effect==='sphere'&&b.move.frame>=b.move.startup&&b.move.frame<b.move.startup+b.move.active;
   if(barrier&&p.kind!=='capture'&&Math.hypot(p.x-b.x,p.z-b.z)<b.move.reach){p.life=0;event(m,'block',{x:p.x,z:p.z,color:fighters[b.id].color});continue;}
   if(Math.hypot(p.x-b.x,p.z-b.z)<p.radius+.5&&b.air<.5&&b.inv<=0){
    if(p.kind!=='capture'&&b.guard&&b.guardTime<.17){p.owner=1-p.owner;p.dx*=-1;p.dz*=-1;p.life=1.5;event(m,'parry',{x:b.x,z:b.z,color:fighters[b.id].color});}
    else if(p.kind==='capture'&&b.guard&&b.guardTime<.2){p.life=0;event(m,'hint',{text:'CAPTURE BREAK'});}
    else if(p.kind==='capture'&&!m.cinematic){beginCapture(m,a,b,p.context||captureContext(a,b));p.life=0;}
    else {const landed=hit(m,a,b,p.damage,p.kind);if(landed&&(p.kind==='snare'||p.stun)){b.stun=Math.max(b.stun,p.kind==='snare'?.85:p.stun);b.animTime=Math.max(b.animTime,b.stun);}if(landed&&p.knockdown){b.air=0;b.launched=false;b.stun=.55;b.anim='knockdown';b.animTime=.55;}p.life=0;}
   }
  }
  m.projectiles=m.projectiles.filter(p=>p.life>0);
 }
 if(m.mode==='training'){for(const p of m.players)if(p.hp<15){p.hp=100;event(m,'hint',{text:'Training health restored'});}}
 else if(m.players.some(p=>p.hp<=0)||m.time<=0){m.phase='over';m.winner=m.players[0].hp===m.players[1].hp?-1:m.players[0].hp>m.players[1].hp?0:1;event(m,'over');}
}
