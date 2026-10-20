import {createCommandState,readCommand} from './commands.js';
import {fighters} from './fighters.js';
export const STEP=1/60;
export const neutral=()=>({x:0,z:0,attack:false,guard:false,capture:false,launch:false,pursuit:false,super:false});
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
export function createMatch(a=0,b=1,mode='duel',difficulty='normal') {
 const fighter=(id,x)=>({id,x,z:0,hp:100,stocks:1,charge:0,cool:0,stun:0,air:0,inv:0,guard:false,guardTime:0,held:0,prev:neutral(),combo:0,comboTime:0,anim:'idle',animTime:0,face:x<0?1:-1,lookX:x<0?1:-1,lookZ:0,turnDelay:0,commands:createCommandState()});
 return {players:[fighter(a,-4),fighter(b,4)],projectiles:[],events:[],time:90,tick:0,phase:'fight',winner:null,mode,difficulty,cinematic:null,aiClock:0,ai:neutral()};
}
function event(m,type,values={}){m.events.push({type,...values});}
function distance(a,b){return Math.hypot(a.x-b.x,a.z-b.z);}
export function hit(m,a,b,damage,kind='hit',launch=false){
 if(b.inv>0||b.hp<=0)return false;
 const perfect=b.guard&&b.guardTime<.17;
 if(b.guard&&kind!=='capture'){
  event(m,perfect?'parry':'block',{x:b.x,z:b.z,color:fighters[b.id].color});
  b.hp=Math.max(1,b.hp-(perfect?0:damage*.12)); b.stun=perfect?0:.12;
  if(perfect){a.stun=.4;b.charge+=.35;}
  return false;
 }
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
 m.cinematic={a:m.players.indexOf(a),b:m.players.indexOf(b),t:0,duration:context==='far'?1.5:context==='mid'?1.2:.95,damage:15*fighters[a.id].power*multiplier,kind:'capture',context,name:fighters[a.id].capture};
 event(m,'cinematic',{text:`${fighters[a.id].capture} / ${context.toUpperCase()}`});
}
function action(m,a,b,kind){
 if(a.cool>0||a.stun>0||a.guard||m.cinematic)return;
 const f=fighters[a.id],d=distance(a,b),dx=(b.x-a.x)/(d||1),dz=(b.z-a.z)/(d||1);
 a.anim=kind;a.animTime=.42;
 if(kind==='jumpAttack'){
  a.air=.85;a.cool=.55;a.inv=.12;
  if(d<3.5){a.x=clamp(b.x+dx*1.6,-11,11);a.z=clamp(b.z+dz*1.6,-6,6);b.turnDelay=.5;hit(m,a,b,9*f.power);}
  else{a.x=clamp(a.x+dx*2.5,-11,11);a.z=clamp(a.z+dz*2.5,-6,6);}
  event(m,'hint',{text:d<3.5?'CROSSOVER STRIKE':'LEAP STRIKE'});return;
 }
 if(kind==='super'){
  if(a.stocks<1){event(m,'hint',{text:'Hold attack to charge a power stock'});return;}
  a.stocks--;a.cool=1.2;
  if(d>9||b.inv>0){event(m,'hint',{text:'Burst missed — close the distance'});return;}
  m.cinematic={a:m.players.indexOf(a),b:m.players.indexOf(b),t:0,duration:1.65,damage:27*f.power,kind:'super',name:f.special};
  event(m,'cinematic',{text:f.special});return;
 }
 if(kind==='forward'||kind==='back'){
  a.cool=f.id==='morrow'?.85:.62;
  event(m,'hint',{text:f.moves[kind==='forward'?0:1]});
  if(kind==='back'){a.x=clamp(a.x-dx*1.2,-11,11);a.z=clamp(a.z-dz*1.2,-6,6);}
  if(f.id==='tala'&&kind==='forward'){
   a.x=clamp(a.x+dx*Math.min(3,Math.max(0,d-1.5)),-11,11);a.z=clamp(a.z+dz*Math.min(3,Math.max(0,d-1.5)),-6,6);
   a.anim='pursuit';if(d<5.5)hit(m,a,b,11*f.power,'hit',true);return;
  }
  const count=f.id==='morrow'?3:f.id==='sol'?2:1;
  for(let j=0;j<count;j++){
   const angle=Math.atan2(dz,dx)+(j-(count-1)/2)*.13;
   const type=f.id==='vesper'?'snare':f.id==='rei'?'crescent':f.id==='aegis'?'beam':'bolt';
   const speed=f.shotSpeed*(type==='beam'?1.6:.85);
   m.projectiles.push({x:a.x+dx,z:a.z+dz,dx:Math.cos(angle)*speed,dz:Math.sin(angle)*speed,life:2.3,owner:m.players.indexOf(a),damage:(count>1?5:10)*f.power,kind:type,radius:type==='crescent'?.9:type==='snare'?.8:.4});
  }event(m,'shot',{color:f.color});return;
 }
 if(kind==='capture'){
  a.cool=1.05;
  const close=d<3.1;
  if(close){
   if(b.guard&&b.guardTime<.2){a.stun=.6;event(m,'hint',{text:'CAPTURE BREAK'});return;}
   beginCapture(m,a,b,captureContext(a,b));
  }else{
   m.projectiles.push({x:a.x+dx,z:a.z+dz,dx:dx*7,dz:dz*7,life:1.8,owner:m.players.indexOf(a),damage:12*f.power,kind:'capture',context:captureContext(a,b),radius:.65});event(m,'shot',{color:f.color});
  }return;
 }
 if(kind==='pursuit'){
  a.cool=.75;
  if(b.air>0&&d<9){a.x=b.x-dx*1.6;a.z=b.z-dz*1.6;hit(m,a,b,14*f.power);event(m,'hint',{text:'AERIAL PURSUIT'});}
  else{a.x=clamp(a.x+dx*2,-11,11);a.z=clamp(a.z+dz*2,-6,6);if(d<4)hit(m,a,b,7*f.power);}
  return;
 }
 if(kind==='launch') {a.cool=.7;if(d<f.reach+.3)hit(m,a,b,8*f.power,'hit',true);return;}
 a.cool=f.id==='sol'?.3:f.id==='morrow'?.55:.4;
 if(d<f.reach){hit(m,a,b,(a.combo%3===2?10:6)*f.power);a.anim='strike';}
 else {m.projectiles.push({x:a.x+dx*.8,z:a.z+dz*.8,dx:dx*f.shotSpeed,dz:dz*f.shotSpeed,life:2,owner:m.players.indexOf(a),damage:7*f.power,kind:'bolt',radius:f.id==='vesper'?.7:.4});event(m,'shot',{color:f.color});}
}
export function aiInput(m,dt){
 m.aiClock-=dt;
 if(m.aiClock>0)return m.ai;
 const a=m.players[1],b=m.players[0],d=distance(a,b),f=fighters[a.id];
 const skill=m.difficulty==='hard'?1:m.difficulty==='easy'?.4:.7;
 const random=()=>{m.seed=((m.seed||1234567)*1664525+1013904223)>>>0;return m.seed/4294967296;};
 m.aiClock=.14+random()*.23/skill;
 const i=neutral(),r=random(),preferred=f.id==='tala'?1.8:f.id==='sol'||f.id==='vesper'?6:3;
 i.x=d>preferred?Math.sign(b.x-a.x):d<preferred-1?-Math.sign(b.x-a.x):0;
 i.z=Math.abs(b.z-a.z)>1?Math.sign(b.z-a.z):(r<.25?1:r>.8?-1:0);
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
  if(c.t>=c.duration){const a=m.players[c.a],b=m.players[c.b];hit(m,a,b,c.damage,c.kind==='capture'?'capture':'hit',true);m.cinematic=null;}
 }else{
  m.players.forEach((a,n)=>{
   const i=inputs[n]||neutral(),b=m.players[1-n];
   a.turnDelay=Math.max(0,a.turnDelay-dt);
   if(a.turnDelay===0&&a.stun===0){const d=distance(a,b)||1;a.lookX=(b.x-a.x)/d;a.lookZ=(b.z-a.z)/d;a.face=b.x>=a.x?1:-1;}
   const command=readCommand(a.commands,i,a.prev,a.face,m.tick);
   const freshGuard=i.guard&&!a.prev.guard;
   if(freshGuard&&a.air>0){a.air=.16;a.stun=0;a.inv=.25;a.cool=.2;a.anim='recover';a.animTime=.25;event(m,'hint',{text:'AIR RECOVERY'});}
   else if(command==='jump'&&a.stun<=0&&a.cool<=0){a.air=.85;a.inv=.18;a.cool=.25;a.anim='jump';a.animTime=.85;event(m,'hint',{text:'JUMP'});}
   else if(freshGuard&&i.x*a.face>.5&&distance(a,b)<3.5&&a.stun<=0&&a.cool<=0){
    const d=distance(a,b)||1,dx=(b.x-a.x)/d,dz=(b.z-a.z)/d;
    a.x=clamp(b.x+dx*1.6,-11,11);a.z=clamp(b.z+dz*1.6,-6,6);a.inv=.15;a.cool=.12;b.turnDelay=.45;
    event(m,'hint',{text:'CIRCLE STEP'});
   }
   a.guard=i.guard&&a.stun<=0&&a.air===0;a.guardTime=a.guard?a.guardTime+dt:0;
  });
  m.players.forEach((a,n)=>{
   const b=m.players[1-n],i=inputs[n]||neutral(),f=fighters[a.id];
   for(const k of ['cool','stun','air','inv','comboTime','animTime'])a[k]=Math.max(0,a[k]-dt);
   if(a.animTime===0)a.anim='idle';
   if(a.stun<=0){
    const len=Math.max(1,Math.hypot(i.x,i.z)),speed=f.speed*(a.guard?.25:1)*(i.attack?.35:1);
    a.x=clamp(a.x+i.x/len*speed*dt,-11,11);a.z=clamp(a.z+i.z/len*speed*dt,-6,6);
    if((i.x||i.z)&&a.anim==='idle')a.anim='run';
    if(i.attack&&!a.guard){a.held+=dt;if(a.held>.24){a.charge+=dt*(1+(100-a.hp)/65);a.anim='charge';if(a.charge>=1.8){a.charge=0;if(a.stocks<3){a.stocks++;event(m,'stock',{player:n});}}}}
    if(!i.attack&&a.prev.attack){if(a.held>0&&a.held<=.24)action(m,a,b,a.commands.attack||'attack');a.held=0;}
    if(!i.attack)a.held=0;
    for(const kind of ['capture','launch','pursuit','super'])if(i[kind]&&!a.prev[kind])action(m,a,b,kind);
   }else{a.held=0;}
   a.prev={...i};
  });
  const [a,b]=m.players,d=distance(a,b);
  if(d<1.2){const dx=(b.x-a.x)/(d||1)||1,dz=(b.z-a.z)/(d||1);a.x-=dx*(1.2-d)/2;b.x+=dx*(1.2-d)/2;a.z-=dz*(1.2-d)/2;b.z+=dz*(1.2-d)/2;}
  for(const p of m.projectiles){
   p.x+=p.dx*dt;p.z+=p.dz*dt;p.life-=dt;
   const a=m.players[p.owner],b=m.players[1-p.owner];
   if(Math.hypot(p.x-b.x,p.z-b.z)<p.radius+.5&&b.air<.5){
    if(p.kind!=='capture'&&b.guard&&b.guardTime<.17){p.owner=1-p.owner;p.dx*=-1;p.dz*=-1;p.life=1.5;event(m,'parry',{x:b.x,z:b.z,color:fighters[b.id].color});}
    else if(p.kind==='capture'&&b.guard&&b.guardTime<.2){p.life=0;event(m,'hint',{text:'CAPTURE BREAK'});}
    else if(p.kind==='capture'&&!m.cinematic){beginCapture(m,a,b,p.context||captureContext(a,b));p.life=0;}
    else {const landed=hit(m,a,b,p.damage,p.kind);if(landed&&p.kind==='snare')b.stun=.85;p.life=0;}
   }
  }
  m.projectiles=m.projectiles.filter(p=>p.life>0);
 }
 if(m.mode==='training'){for(const p of m.players)if(p.hp<15){p.hp=100;event(m,'hint',{text:'Training health restored'});}}
 else if(m.players.some(p=>p.hp<=0)||m.time<=0){m.phase='over';m.winner=m.players[0].hp===m.players[1].hp?-1:m.players[0].hp>m.players[1].hp?0:1;event(m,'over');}
}
