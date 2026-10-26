import {canPressureDash,beginPressureDash,advancePressureDash,pressureInput} from './pressure-dash.js';
import {expandCapture,advanceCapture,captureClashes} from './long-capture.js';
import {advanceCharge} from './charge.js';
import {recoveryInput} from './recovery.js';
import {reversalEligible,beginReversal,REVERSAL_DAMAGE} from './reversal.js';
import {freshStagger,clearStagger,staggerHit,advanceStagger} from './stagger.js';
import {lineTravel,orbitTravel,advanceTravel,faceOpponent,CIRCLE_FRAMES,CROSSOVER_FRAMES} from './combat-travel.js';
import {advanceAirMotion} from './air-motion.js';
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
export const JUMP_SQUAT_FRAMES=4,GET_UP_FRAMES=12,COMMAND_BUFFER_FRAMES=6;
// Power gauge, Evil Zone style: holding attack sweeps a charge up the life bar from the bottom
// to the current life line; when the sweep reaches it a crystal (stock) appears. The sweep covers
// only the life that is left, so a full-life fighter takes CHARGE_PER_STOCK seconds and a fighter
// at a quarter life takes a quarter of that. The floor stops near-dead fighters charging instantly.
export const CHARGE_PER_STOCK=1.8,MAX_STOCKS=3,CHARGE_FLOOR_HP=25;
export const chargeRate=hp=>100/Math.max(CHARGE_FLOOR_HP,Math.min(100,hp));
export const neutral=()=>({x:0,z:0,attack:false,guard:false,capture:false,launch:false,pursuit:false,super:false});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
// Held stock variants are intentionally limited to these researched archetypes.
export const hasStockVariant=(id,command)=>!!stockSpecials[fighters[id]?.id]?.[command];
export function createMatch(a=0,b=1,mode='duel',difficulty='normal',options={}) {
 const rules=normalizeOptions(options);
 const fighter=(id,x)=>({...freshStagger(),id,x,z:0,hp:100,stocks:1,charge:0,cool:0,stun:0,blockStun:0,air:0,launched:false,roll:null,travel:null,inv:0,guard:false,guardTime:0,guardTapTick:-Infinity,held:0,prev:neutral(),combo:0,comboTime:0,anim:'idle',animTime:0,face:x<0?1:-1,lookX:x<0?1:-1,lookZ:0,turnDelay:0,commands:createCommandState(),move:null,buffer:null,slam:null,bounce:null,pendingInput:null,jumpSquat:null,getUp:null,knockdown:null,knockback:null});
 return {players:[fighter(a,-4),fighter(b,4)],projectiles:[],events:[],rules:{roundSeconds:rules.roundSeconds,winsNeeded:rules.winsNeeded,pressureAssist:rules.pressureAssist},time:rules.roundSeconds,tick:0,inputTick:0,hitstop:0,phase:'fight',winner:null,mode,difficulty,cinematic:null,aiClock:0,ai:neutral()};
}
function event(m,type,values={}){m.events.push({type,...values});}
function distance(a,b){return Math.hypot(a.x-b.x,a.z-b.z);}
export function hit(m,a,b,damage,kind='hit',launch=false,sourceMove=null){
 if(b.inv>0||b.hp<=0)return false;
 if(kind==='hit'&&!launch&&a.air<=0&&reversalEligible(b,sourceMove,m.tick)){
  beginReversal(a,b,m.tick);
  event(m,'reversal',{player:m.players.indexOf(b),x:b.x,z:b.z,color:fighters[b.id].color});
  return false;
 }
 const perfect=b.guard&&b.guardTime<.17;
 if(b.guard&&kind!=='capture'){
  event(m,perfect?'parry':'block',{x:b.x,z:b.z,color:fighters[b.id].color});
  b.hp=Math.max(1,b.hp-(perfect?0:damage*.12)); b.blockStun=perfect?0:.12;
  if(perfect){a.stun=.4;a.travel=null;a.move=null;a.buffer=null;a.cool=0;b.charge+=.35;}
  return false;
 }
 const staggerEligible=!launch&&b.air<=0&&!['knockdown','roll'].includes(b.anim)&&!['capture','burst'].includes(kind);
 b.slam=null;b.bounce=null;b.jumpSquat=null;b.getUp=null;b.knockdown=null;b.knockback=null;b.pendingInput=null;b.counterWindow=0;b.travel=null;b.move=null;b.buffer=null;b.roll=null;b.launched=launch;b.cool=0;b.blockStun=0;if(m.cinematic?.a===m.players.indexOf(b))m.cinematic=null;
 b.hp=Math.max(0,b.hp-damage); b.stun=launch?.82:.32; b.air=launch?.85:0;
 b.anim=launch?'launch':'hurt';b.animTime=.42;
 const dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz)||1;
 // Live contacts queue recoil after hitstop. Out-of-step hit() remains the synchronous setup API used by lessons/review fixtures.
 if(m.resolving){
  b.knockback={dx:dx/d,dz:dz/d,frame:0,frames:8,distance:.5};
  m.hitstop=Math.max(m.hitstop||0,sourceMove?.chain===3?12:launch||damage>=10||a.id===3&&sourceMove?.kind==='strike'?10:6);
 }else{b.x=clamp(b.x+dx/d*.5,-11,11);b.z=clamp(b.z+dz/d*.5,-6,6);}
 a.combo=a.comboTime>0?a.combo+1:1;a.comboTime=1.35;
 if(staggerHit(b,damage,staggerEligible,kind!=='hit'))event(m,'hint',{text:`${fighters[b.id].name.toUpperCase()} STAGGERED — ALTERNATE LEFT / RIGHT`,player:m.players.indexOf(b)});
 event(m,'hit',{x:b.x,z:b.z,color:fighters[a.id].color,damage,combo:a.combo,attacker:m.players.indexOf(a),defender:m.players.indexOf(b)});
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
 clearStagger(b);
 const multiplier={front:1,back:1.2,mid:1.1,far:1.25}[context];
 m.cinematic={a:m.players.indexOf(a),b:m.players.indexOf(b),t:0,...capturePresentation(fighters[a.id].id,context),damage:15*fighters[a.id].power*multiplier,kind:'capture',context,name:fighters[a.id].capture};
 event(m,'cinematic',{text:`${fighters[a.id].capture} / ${context.toUpperCase()}`});
}
function action(m,a,b,requested,empowered=false){
 if(a.staggerState||a.stun>0||a.jumpSquat||a.guard||a.travel||m.cinematic)return;
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
 const aerialFollow=previous?.kind==='launch'&&previous.connected&&requested==='pursuit'&&b.air>0;
 const chaining=aerialFollow||canChain(previous)&&(requested==='attack'||previous.chain===2&&['capture','launch','forward','back','technique','pursuit','jumpAttack','super'].includes(requested));
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
 if(kind==='strike'&&a.counterWindow>0){a.move.counter=true;a.counterWindow=0;}
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
  const push=b.knockback,remainingPush=push?push.distance*(1-push.frame/push.frames)**3:0;
  a.move.glideX=(b.x+(push?.dx||0)*remainingPush-a.x-a.move.aimX*1.6)/timing.startup;
  a.move.glideZ=(b.z+(push?.dz||0)*remainingPush-a.z-a.move.aimZ*1.6)/timing.startup;
  a.air=.45;
 }
 if(kind==='pursuit'&&!a.move.aerial){
  if(b.staggerState&&d<5.6){a.move.staggerPursuit=true;a.move.startup=12;a.move.total=12+a.move.active+a.move.recovery;}
  a.move.travel=lineTravel(a,a.move.aimX,a.move.aimZ,Math.min(a.move.staggerPursuit?4:2,Math.max(0,d-1.6)),a.move.startup);
 }
 if(kind==='jumpAttack'){
  a.move.startup=CROSSOVER_FRAMES;a.move.total=CROSSOVER_FRAMES+a.move.active+a.move.recovery;
  a.move.crossover=d<3.5;
  a.move.travel=a.move.crossover?orbitTravel(a,b,CROSSOVER_FRAMES):lineTravel(a,a.move.aimX,a.move.aimZ,2.5,CROSSOVER_FRAMES);
  a.air=(CROSSOVER_FRAMES+12)*STEP;a.inv=.12;
 }
 a.buffer=null;a.pendingInput=null;
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
  if(d<2.3&&b.inv<=0){
   move.connected=hit(m,a,b,9*f.power);
   if(move.crossover)b.turnDelay=.5;
  }
  event(m,'hint',{text:move.crossover?'CROSSOVER STRIKE':'LEAP STRIKE'});return;
 }
 if(kind==='super'){

  if(d>9||b.inv>0){event(m,'hint',{text:'Burst missed — close the distance'});return;}
  clearStagger(b);
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
   m.projectiles.push({x:a.x+dx,z:a.z+dz,dx:dx*7,dz:dz*7,life:1.8,owner:m.players.indexOf(a),damage:12*f.power,kind:'capture',context:captureContext(a,b),radius:.65,targetRadius:.65,expandable:true});event(m,'shot',{color:f.color});
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
   if(!last){b.air=clamp(previousAir,.35,.65);a.airMotionCue={height:2.2,duration:.15};b.airMotionCue={height:2.2,duration:.15};}
   if(last){b.slam={frame:0,frames:8};b.air=8*STEP;b.launched=true;b.stun=8*STEP;b.anim='launch';b.animTime=8*STEP;b.airMotionCue={height:0,duration:8*STEP};}
   event(m,'hint',{text:`AERIAL PURSUIT ${move.pursuitHit} / 3`});return;
  }
  if(d<2.2&&facing){
   const punish=move.staggerPursuit&&!!b.staggerState;
   move.connected=hit(m,a,b,(punish?12:7)*f.power);
   if(punish&&move.connected){b.air=0;b.launched=false;b.stun=.55;b.anim='knockdown';b.animTime=.55;event(m,'hint',{text:'STAGGER PUNISH',player:m.players.indexOf(a)});}
  }
  return;
 }
 if(kind==='launch') {if(d<f.reach+.3&&facing)move.connected=hit(m,a,b,8*f.power,'hit',true);return;}
 
 if(kind==='strike'){if(d<f.reach&&facing&&b.inv<=0){move.connected=true;hit(m,a,b,((move.reversal?REVERSAL_DAMAGE:move.chain===3?10:6)+(move.counter?2:0))*f.power,'hit',false,move);}}
 else {move.connected=true;m.projectiles.push({x:a.x+dx*.8,z:a.z+dz*.8,dx:dx*f.shotSpeed,dz:dz*f.shotSpeed,life:2,owner:m.players.indexOf(a),damage:(move.chain===3?9:7)*f.power,kind:'bolt',radius:f.id==='vesper'?.7:.4});event(m,'shot',{color:f.color});}
}
export function aiInput(m,dt){
 if(m.pressure)return pressureInput(m);
 if(m.players[1].staggerState){
  const period=m.difficulty==='easy'?14:m.difficulty==='hard'?8:10;
  m.aiClock=0;m.ai=neutral();
  if(m.tick%period===0)m.ai.z=Math.floor(m.tick/period)%2?1:-1;
  return m.ai;
 }
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
 i.capture=d<3&&r>.8;i.launch=d<3&&r<.18;i.pursuit=b.air>0||!!b.staggerState&&d<5.6;
 i.super=a.stocks>0&&r>.92&&d<8;
 return m.ai=i;
}
export function update(m,inputs,dt=STEP){
 m.events=[];if(m.phase!=='fight')return;
 inputs=inputs.map(i=>({...i}));m.frozen=false;
 m.inputTick=(m.inputTick||0)+1;
 for(let n=0;n<m.players.length;n++){
  const a=m.players[n],i=inputs[n]||neutral(),b=m.players[1-n];
  a.frameCommand=readCommand(a.commands,i,a.prev,1,m.inputTick);
  if(a.pendingInput&&a.pendingInput.expires<m.inputTick)a.pendingInput=null;
  const blocked=m.hitstop>0||a.move||a.travel||a.stun>0||a.cool>0||a.jumpSquat;
  let kind=null,button='attack';
  if(blocked&&i.attack&&!a.prev.attack)kind=a.commands.attack||'attack';
  if(blocked&&!i.attack&&a.prev.attack&&!a.suppressAttackRelease&&(a.held<=.24||hasStockVariant(a.id,a.commands.attack)))kind=a.commands.attack||'attack';
  for(const key of ['pursuit','capture','launch','super','circle','crossover'])if(i[key]&&!a.prev[key]){kind=key;button=key;}
  if(i.guard&&!a.prev.guard){button='guard';kind=a.frameCommand==='jump'?'jump':a.air>0?'guard':i.x>.5&&distance(a,b)<3.5?'circle':'guard';}
  if(kind){a.buffer=null;a.pendingInput={kind,button,x:i.x,z:i.z,expires:m.inputTick+COMMAND_BUFFER_FRAMES,fromPress:!!i.attack,empowered:!i.attack&&a.held>.24&&hasStockVariant(a.id,a.commands.attack)};}
 }
 if(m.hitstop>0){m.frozen=true;m.hitstop--;m.players.forEach((p,n)=>p.prev={...(inputs[n]||neutral())});return;}
 m.resolving=true;
 m.tick++;m.time-=m.mode==='training'?0:dt;
 if(m.pressure){
  const result=advancePressureDash(m,inputs,dt);
  if(result){if(result.winner>=0){const a=m.players[result.winner],b=m.players[1-result.winner];if(hit(m,a,b,10*fighters[a.id].power)){clearStagger(b);b.anim='knockdown';b.animTime=.55;b.stun=.55;b.air=0;}}
   event(m,'hint',{text:result.winner<0?'PRESSURE DASH DRAW':`${fighters[m.players[result.winner].id].name.toUpperCase()} WINS PRESSURE DASH`});}
 }else if(m.cinematic){
  const c=m.cinematic;c.t+=dt;
  if(c.t>=c.duration){const a=m.players[c.a],b=m.players[c.b];const landed=hit(m,a,b,c.damage,c.kind==='capture'?'capture':'burst',c.kind==='capture');if(landed&&c.kind==='super'){b.anim='knockdown';b.animTime=.7;b.stun=.7;b.air=0;}m.cinematic=null;}
 }else{
  m.players.forEach((a,n)=>{
   const i=inputs[n]||neutral(),b=m.players[1-n];
   a.turnDelay=Math.max(0,a.turnDelay-dt);
   if(a.turnDelay===0&&a.stun===0&&!a.move&&!a.travel){const d=distance(a,b)||1;a.lookX=(b.x-a.x)/d;a.lookZ=(b.z-a.z)/d;a.face=b.x>=a.x?1:-1;}
   const recovering=!!a.staggerState,recovery=advanceStagger(a,i,dt);
   if(recovery){a.commands=createCommandState();event(m,'hint',{text:recovery.clean?'CLEAN RECOVERY — COUNTER READY':recovery.manual?'STAGGER RECOVERED':'STAGGER ENDED',player:n});}
   if(recovering)return;
   const command=a.frameCommand;
   let freshGuard=i.guard&&!a.prev.guard;
   const pending=a.pendingInput,path=a.travel||a.move?.crossover&&a.move.travel;
   if(path&&path.frames-path.frame<=5&&pending&&(pending.button==='attack'||pending.kind==='guard')){
    a.travel=null;a.move=null;a.cool=0;a.air=0;a.launched=false;a.anim='idle';a.animTime=0;
   }
   if(pending?.kind==='guard'&&a.stun<=0&&a.cool<=0&&!a.move&&!a.travel&&!a.jumpSquat&&a.air<=0){i.guard=true;freshGuard=true;a.pendingInput=null;}
   if(pending?.kind==='guard'&&a.air>0){freshGuard=true;a.pendingInput=null;}
   if(a.jumpSquat)return;
   if(freshGuard&&a.stun<=0&&a.air<=0&&!a.move&&!a.travel)a.guardTapTick=m.tick;
   const getup=recoveryInput(a,b,i);if(getup){a.commands=createCommandState();event(m,'hint',{text:getup,player:n});}
   if(freshGuard&&a.air>0&&!a.bounce&&!a.slam){a.travel=null;a.move=null;a.buffer=null;a.launched=false;a.air=.16;a.stun=0;a.inv=.25;a.cool=.2;a.anim='recover';a.animTime=.25;event(m,'hint',{text:'AIR RECOVERY',player:n});}
   else if((command==='jump'||a.pendingInput?.kind==='jump')&&a.air<=0&&a.stun<=0&&a.cool<=0&&!a.move){a.jumpSquat={frame:0,frames:JUMP_SQUAT_FRAMES,started:m.tick};a.pendingInput=null;a.air=0;a.anim='jumpSquat';a.animTime=JUMP_SQUAT_FRAMES*STEP;a.guard=false;event(m,'hint',{text:'JUMP',player:n});}
   else if((freshGuard&&i.x>.5&&distance(a,b)<3.5||a.pendingInput?.kind==='circle')&&a.stun<=0&&a.cool<=0&&!a.move){
    a.pendingInput=null;
    a.travel=orbitTravel(a,b,CIRCLE_FRAMES);b.turnDelay=CIRCLE_FRAMES*STEP+.45;a.inv=.15;a.cool=CIRCLE_FRAMES*STEP;a.anim='run';a.animTime=a.cool;a.held=0;
    event(m,'hint',{text:'CIRCLE STEP',player:n});
   }
   a.guard=(i.guard||a.blockStun>0)&&a.stun<=0&&a.air===0&&!a.move&&!a.travel&&!a.jumpSquat;a.guardTime=a.guard?a.guardTime+dt:0;
  });
  m.players.forEach((a,n)=>{
   const b=m.players[1-n],i=inputs[n]||neutral(),f=fighters[a.id];
   if(a.jumpSquat){
    if(a.jumpSquat.started!==m.tick&&++a.jumpSquat.frame>=JUMP_SQUAT_FRAMES){a.jumpSquat=null;a.air=.85;a.inv=.18;a.cool=.25;a.anim='jump';a.animTime=.85;}
    a.prev={...i};return;
   }
   const wasAir=a.air;
   for(const k of ['cool','stun','blockStun','air','inv','comboTime','animTime'])a[k]=a[k]-dt<1e-9?0:a[k]-dt;
   if(a.slam)a.slam.frame++;
   if(a.bounce){
    a.bounce.frame++;
    if(a.bounce.frame>=a.bounce.frames){a.bounce=null;a.air=0;a.launched=false;a.anim='knockdown';a.animTime=.55;a.stun=.55;}
   }else if(a.launched&&wasAir>0&&a.air===0){
    // One twelve-frame rebound after the launch's 51-frame arc; then 21f down + 12f rise.
    a.slam=null;a.bounce={frame:0,frames:12,height:.55};a.air=12*STEP;a.stun=12*STEP;a.anim='launch';a.animTime=12*STEP;a.move=null;a.buffer=null;a.cool=0;
    a.lastGroundBounce={tick:m.tick,x:a.x,z:a.z};event(m,'groundBounce',{player:n,x:a.x,z:a.z,color:fighters[a.id].color});
   }
   if(a.knockback){const k=a.knockback,u=k.frame/k.frames,v=++k.frame/k.frames,d=k.distance*((1-u)**3-(1-v)**3);a.x=clamp(a.x+k.dx*d,-11,11);a.z=clamp(a.z+k.dz*d,-6,6);if(k.frame===k.frames)a.knockback=null;}
   // The last twelve grounded recovery frames are a simulation-owned rise.
   if(a.anim==='knockdown'||a.getUp){
    const remaining=Math.max(0,Math.round(a.stun/STEP));
    a.knockdown={remaining:Math.max(0,remaining-GET_UP_FRAMES)};
    if(remaining<=GET_UP_FRAMES&&remaining>0){a.getUp={frame:GET_UP_FRAMES-remaining,frames:GET_UP_FRAMES,safe:a.getUp?.safe??true};if(a.getUp.safe)a.inv=Math.max(a.inv,STEP);}
    if(remaining===0){a.getUp=null;a.knockdown=null;a.anim='idle';if(i.guard||a.pendingInput?.kind==='guard'){a.guard=true;a.guardTime=dt;a.guardTapTick=m.tick;a.pendingInput=null;}}
   }
   if(a.roll){a.x=clamp(a.x+a.roll.dx*8*dt,-11,11);a.z=clamp(a.z+a.roll.dz*8*dt,-6,6);a.roll.elapsed+=dt;if(a.roll.elapsed>=.3)a.roll=null;}
   if(a.travel){
    const done=advanceTravel(a,a.travel);faceOpponent(a,b);
    if(done){a.travel=null;a.cool=0;b.turnDelay=.45;}
   }
   if(a.animTime===0)a.anim='idle';
   if(expandCapture(m,n,i))event(m,'hint',{text:'CAPTURE CIRCLE EXPANDED',player:n});
   const swallowed=a.suppressAttackRelease;
   if(swallowed)a.held=0;
   const charging=!swallowed&&advanceCharge(a,i,dt,hasStockVariant(a.id,a.commands.attack));
   if(!i.attack)a.suppressAttackRelease=false;
   if(a.stun<=0&&!a.travel&&!a.staggerState){
    const pending=a.pendingInput;
    if(pending&&(!a.move&&a.cool<=0||canChain(a.move)&&!i.attack||a.move?.kind==='launch'&&a.move.connected&&pending.kind==='pursuit')&&!['guard','circle','jump'].includes(pending.kind)){
     a.pendingInput=null;action(m,a,b,pending.kind==='crossover'?'jumpAttack':pending.kind,pending.empowered);
     if(pending.fromPress&&i.attack){a.suppressAttackRelease=true;a.held=0;}
    }
    if(a.buffer&&a.buffer.expires<m.tick)a.buffer=null;
    if(a.buffer&&!a.move&&a.cool<=0){const buffered=a.buffer;a.buffer=null;action(m,a,b,buffered.kind,buffered.empowered);}
    const len=Math.max(1,Math.hypot(i.x,i.z)),speed=f.speed*(a.move?.travel&&a.move.frame<a.move.startup?0:1)*(a.blockStun>0?0:1)*(a.move?.12:1)*(a.guard?.25:1)*(i.attack?.35:1);
    // Lock-on movement: x closes or retreats along the line to the rival, z circles.
    const fx=a.lookX,fz=a.lookZ;a.x=clamp(a.x+(i.x*fx-i.z*fz)/len*speed*dt,-11,11);a.z=clamp(a.z+(i.x*fz+i.z*fx)/len*speed*dt,-6,6);
    if((i.x||i.z)&&a.anim==='idle')a.anim='run';
    if(charging){a.anim='charge';if(a.stocks<MAX_STOCKS){a.charge+=dt*chargeRate(a.hp);if(a.charge>=CHARGE_PER_STOCK){a.charge=0;a.stocks++;event(m,'stock',{player:n});}}}
    if(!swallowed&&!i.attack&&a.prev.attack){if(a.held>0&&(a.held<=.24||hasStockVariant(a.id,a.commands.attack)))action(m,a,b,a.commands.attack||'attack',a.held>.24);a.held=0;}
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
   if(move.travel&&move.frame<=move.startup){advanceTravel(a,move.travel);if(move.crossover)faceOpponent(a,m.players[1-m.players.indexOf(a)]);}
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
  if(canPressureDash(m.players))beginPressureDash(m);
  const clash=contacts.length===2&&contacts.every(c=>['capture','super'].includes(c.move.kind));
  if(clash){for(const {a} of contacts){a.move=null;a.buffer=null;a.cool=0;a.stun=.3;a.anim='hurt';a.animTime=.3;}event(m,'hint',{text:'POWER CLASH'});}
  else if(!m.pressure)for(const {a,b,move} of contacts)executeAction(m,a,b,move);
  const [a,b]=m.players,d=distance(a,b);
  if(d<1.2){const dx=(b.x-a.x)/(d||1)||1,dz=(b.z-a.z)/(d||1);a.x-=dx*(1.2-d)/2;b.x+=dx*(1.2-d)/2;a.z-=dz*(1.2-d)/2;b.z+=dz*(1.2-d)/2;}
  for(const p of m.players){p.x=clamp(p.x,-11,11);p.z=clamp(p.z,-6,6);}
  for(const p of m.projectiles){p.x+=p.dx*dt;p.z+=p.dz*dt;p.life-=dt;advanceCapture(p,dt);}
  if(captureClashes(m.projectiles))event(m,'hint',{text:'CAPTURE CIRCLES CANCELLED'});
  for(const p of m.projectiles){
   if(p.life<=0)continue;
   if(m.cinematic||m.pressure)break;
   const a=m.players[p.owner],b=m.players[1-p.owner];
   const barrier=b.move?.kind==='technique'&&b.move.effect==='sphere'&&b.move.frame>=b.move.startup&&b.move.frame<b.move.startup+b.move.active;
   if(barrier&&p.kind!=='capture'&&Math.hypot(p.x-b.x,p.z-b.z)<b.move.reach){p.life=0;event(m,'block',{x:p.x,z:p.z,color:fighters[b.id].color});continue;}
   if(Math.hypot(p.x-b.x,p.z-b.z)<p.radius+.5&&b.air<.5&&b.inv<=0){
    if(p.kind!=='capture'&&b.guard&&b.guardTime<.17){p.owner=1-p.owner;p.dx*=-1;p.dz*=-1;p.life=1.5;event(m,'parry',{x:b.x,z:b.z,color:fighters[b.id].color});}
    else if(p.kind==='capture'&&b.guard&&b.guardTime<.2){p.life=0;event(m,'hint',{text:'CAPTURE BREAK'});}
    else if(p.kind==='capture'&&!m.cinematic){beginCapture(m,a,b,p.context||captureContext(a,b));p.life=0;}
    else {const landed=hit(m,a,b,p.damage,p.kind);if(landed&&(p.kind==='snare'||p.stun)){b.stun=Math.max(b.stun,p.kind==='snare'?.85:p.stun);b.animTime=Math.max(b.animTime,b.stun);}if(landed&&p.knockdown){clearStagger(b);b.air=0;b.launched=false;b.stun=.55;b.anim='knockdown';b.animTime=.55;}p.life=0;}
   }
  }
  m.projectiles=m.projectiles.filter(p=>p.life>0);
 }
 if(m.events.some(e=>e.type==='parry'||e.type==='reversal'))m.hitstop=Math.max(m.hitstop,5);
 m.resolving=false;
 for(const p of m.players)advanceAirMotion(p,dt);
 if(m.mode==='training'){for(const p of m.players)if(p.hp<15){p.hp=100;if(p.staggerState){p.stun=0;p.anim='idle';p.animTime=0;}Object.assign(p,freshStagger());event(m,'hint',{text:'Training health restored'});}}
 else if(m.players.some(p=>p.hp<=0)||m.time<=0){m.phase='over';m.hitstop=0;m.frozen=false;m.winner=m.players[0].hp===m.players[1].hp?-1:m.players[0].hp>m.players[1].hp?0:1;event(m,'over');}
}
