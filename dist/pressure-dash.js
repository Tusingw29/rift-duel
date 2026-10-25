import {createCommandState} from './commands.js';
export const PRESSURE_DURATION=1.6,PRESSURE_PRESS_GAP=12;
export function canPressureDash(players){
 const [a,b]=players,d=Math.hypot(a.x-b.x,a.z-b.z);
 if(d>3.25)return false;
 return players.every((p,n)=>{const q=players[1-n],move=p.move;return move?.kind==='pursuit'&&!move.aerial&&p.stun<=0&&p.air<=0&&move.frame<=move.startup&&((q.x-p.x)*move.aimX+(q.z-p.z)*move.aimZ)>0;});
}
export function beginPressureDash(m){
 m.pressure={elapsed:0,duration:PRESSURE_DURATION,scores:[0,0],lastPress:[-Infinity,-Infinity],winner:null};
 for(const p of m.players){p.move=null;p.travel=null;p.buffer=null;p.cool=0;p.guard=false;p.held=0;p.anim='guard';p.animTime=PRESSURE_DURATION;p.commands=createCommandState();}
 m.events.push({type:'pressure',text:'PRESSURE DASH — TAP ATTACK'});
}
export function advancePressureDash(m,inputs,dt){
 const c=m.pressure;c.elapsed+=dt;
 for(let n=0;n<2;n++){
  const p=m.players[n],input=inputs[n]||{};
  const pressed=input.attack&&(m.rules.pressureAssist||!p.prev.attack);
  if(pressed&&m.tick-c.lastPress[n]>=PRESSURE_PRESS_GAP){c.scores[n]++;c.lastPress[n]=m.tick;}
  p.prev={...input};p.anim='guard';p.animTime=Math.max(0,c.duration-c.elapsed);
 }
 if(c.elapsed<c.duration&&m.time>0)return null;
 const winner=c.scores[0]===c.scores[1]?-1:c.scores[0]>c.scores[1]?0:1;
 const result={winner,scores:[...c.scores]};m.pressure=null;m.lastPressure=result;
 for(const p of m.players){p.commands=createCommandState();p.held=0;p.buffer=null;p.stun=.25;p.cool=.25;p.anim='recover';p.animTime=.25;}
 return result;
}
export function pressureInput(m){
 const period=m.difficulty==='hard'?12:m.difficulty==='easy'?24:18;
 return {x:0,z:0,attack:m.tick%period===0,guard:false,capture:false,launch:false,pursuit:false,super:false};
}
export function pressureText(m){
 const p=m.pressure;
 return p?`PRESSURE DASH · ${m.rules.pressureAssist?'HOLD':'TAP'} ATTACK · ${p.scores[0]} : ${p.scores[1]} · ${Math.max(0,p.duration-p.elapsed).toFixed(1)}s`:'';
}
