// Original Rift Duel tuning inspired by the practice reference, not PS1 frame data.
export const STAGGER_LIMIT=24,STAGGER_DURATION=1.2,STAGGER_DECAY_DELAY=.9,STAGGER_DECAY=12;
export const RECOVERY_TAPS=3,RECOVERY_OPEN=.1,CLEAN_RECOVERY_TIME=.6,STAGGER_RESIST=2;
export const freshStagger=()=>({stagger:0,staggerQuiet:0,staggerState:null,staggerResist:0,counterWindow:0});
export function clearStagger(p){
 const wasActive=!!p.staggerState;
 p.stagger=0;p.staggerQuiet=0;p.staggerState=null;
 if(wasActive)p.staggerResist=STAGGER_RESIST;
}
// Called only after an unblocked, non-invulnerable hit. A hit consumes an existing
// stagger opening instead of refreshing it, even for multi-projectile attacks.
export function staggerHit(p,damage,eligible,ranged=false){
 if(p.staggerState){clearStagger(p);return false;}
 if(!eligible||p.hp<=0){clearStagger(p);return false;}
 if(p.staggerResist>0)return false;
 p.stagger=Math.min(STAGGER_LIMIT,p.stagger+Math.min(12,Math.max(0,damage))*(ranged?.5:1));
 p.staggerQuiet=STAGGER_DECAY_DELAY;
 if(p.stagger<STAGGER_LIMIT)return false;
 p.staggerState={elapsed:0,remaining:STAGGER_DURATION,inputs:0,last:0};
 p.counterWindow=0;p.stun=STAGGER_DURATION;p.anim='hurt';p.animTime=.26;p.guard=false;p.held=0;
 return true;
}
export function advanceStagger(p,input,dt){
 p.staggerResist=Math.max(0,p.staggerResist-dt);p.counterWindow=Math.max(0,p.counterWindow-dt);
 const s=p.staggerState;
 if(!s){
  const decayTime=Math.max(0,dt-p.staggerQuiet);
  p.staggerQuiet=Math.max(0,p.staggerQuiet-dt);
  p.stagger=Math.max(0,p.stagger-STAGGER_DECAY*decayTime);return null;
 }
 s.elapsed+=dt;s.remaining=Math.max(0,s.remaining-dt);
 const dir=Math.abs(input.z)>.5?Math.sign(input.z):0,prev=Math.abs(p.prev.z)>.5?Math.sign(p.prev.z):0;
 if(s.elapsed+1e-9>=RECOVERY_OPEN&&dir&&dir!==prev&&dir!==s.last&&s.remaining>0){s.inputs++;s.last=dir;}
 if(s.inputs>=RECOVERY_TAPS||s.remaining<=1e-9){
  const manual=s.inputs>=RECOVERY_TAPS,clean=manual&&s.elapsed<=CLEAN_RECOVERY_TIME;
  clearStagger(p);p.stun=.12;p.cool=.12;p.inv=Math.max(p.inv,manual?.18:.12);
  p.counterWindow=clean?.65:0;p.anim='recover';p.animTime=.18;
  return {manual,clean};
 }
 // Use each fighter's existing recoil pose as the first animation handoff.
 // The separate state supplies elapsed time for future dedicated choreography.
 p.stun=s.remaining+dt;p.anim='hurt';p.animTime=.26+Math.sin(s.elapsed*5)*.025;
 p.guard=false;p.held=0;return null;
}
export function staggerFeedback(p){
 const s=p.staggerState;
 if(s)return {state:'broken',fill:1,label:`STAGGERED · ${s.inputs}/${RECOVERY_TAPS}`,detail:`Alternate ← → to recover · ${s.remaining.toFixed(1)}s`};
 if(p.counterWindow>0)return {state:'counter',fill:0,label:'COUNTER READY',detail:'Your next close strike is stronger'};
 if(p.staggerResist>0)return {state:'resist',fill:0,label:'STAGGER RESIST',detail:'Temporary protection from another stagger; hits still hurt'};
 const fill=Math.max(0,Math.min(1,(p.stagger||0)/STAGGER_LIMIT));
 return {state:fill>=.75?'warning':'building',fill,label:`STAGGER ${Math.round(fill*100)}%`,detail:'Unblocked hits build stagger; it fades out of pressure'};
}

export function trainingStaggerText(players){
 const [self,rival]=players;
 if(self.staggerState)return `RECOVER: alternate LEFT / RIGHT · ${self.staggerState.inputs}/${RECOVERY_TAPS}`;
 if(rival.staggerState)return `OPENING: use pursuit before the rival recovers · ${rival.staggerState.remaining.toFixed(1)}s`;
 if(self.counterWindow>0)return 'CLEAN RECOVERY: close strike for a counter';
 return `Stagger: P1 ${Math.round(self.stagger/STAGGER_LIMIT*100)}% / P2 ${Math.round(rival.stagger/STAGGER_LIMIT*100)}%`;
}
