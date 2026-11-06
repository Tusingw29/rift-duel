import {lineTravel} from './combat-travel.js';
// Original balance values, not recovered Evil Zone frame data.
export const REVERSAL_WINDOW=6,REVERSAL_STARTUP=6,REVERSAL_RECOVERY=18,REVERSAL_DAMAGE=8;
export function reversalEligible(defender,move,tick){
 const age=tick-(defender.guardTapTick??-Infinity);
 return !!move&&move.kind==='strike'&&move.chain===3&&!move.reversal&&move.frame>=move.startup&&move.frame<move.startup+move.active&&
  defender.guard&&defender.stun<=0&&defender.air<=0&&!defender.staggerState&&
  age>=0&&age<REVERSAL_WINDOW;
}
export function beginReversal(attacker,defender,tick){
 const d=Math.hypot(attacker.x-defender.x,attacker.z-defender.z)||1;
 const aimX=(attacker.x-defender.x)/d,aimZ=(attacker.z-defender.z)/d;
 attacker.move=null;attacker.travel=null;attacker.buffer=null;attacker.cool=0;
 attacker.stun=.18;attacker.anim='hurt';attacker.animTime=.18;attacker.held=0;attacker.counterWindow=0;
 defender.guard=false;defender.guardTime=0;defender.guardTapTick=-Infinity;defender.blockStun=0;
 defender.buffer=null;defender.held=0;defender.counterWindow=0;
 defender.lookX=aimX;defender.lookZ=aimZ;defender.face=aimX>=0?1:-1;
 defender.move={kind:'strike',reversal:true,chain:1,connected:false,frame:0,started:tick,
  startup:REVERSAL_STARTUP,active:1,recovery:REVERSAL_RECOVERY,total:REVERSAL_STARTUP+1+REVERSAL_RECOVERY,aimX,aimZ,
  travel:lineTravel(defender,aimX,aimZ,Math.min(1.2,Math.max(0,d-1.6)),REVERSAL_STARTUP)};
 defender.cool=defender.move.total/60;defender.anim='strike';defender.animTime=defender.cool;
}
export function reversalPrompt(players){
 const [self,rival]=players;
 if(self.move?.reversal)return 'DEFENSIVE REVERSAL · return strike';
 const third=p=>p.move?.kind==='strike'&&p.move.chain===3&&p.move.frame<p.move.startup;
 if(third(rival))return 'THIRD HIT INCOMING · tap guard just before contact';
 if(third(self))return 'THIRD HIT · vulnerable to a timed defensive reversal';
 return '';
}
