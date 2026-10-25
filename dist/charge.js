// Guard-to-charge is a shorter preparation, never charging behind a shield.
export const CHARGE_PREP=.24,GUARD_CHARGE_PREP=.08,POST_ATTACK_CHARGE_DELAY=.12;
export function advanceCharge(p,input,dt,stockVariant=false){
 p.chargeDelay=Math.max(0,(p.chargeDelay||0)-dt);
 if(p.stun>0||p.staggerState||p.air>0||p.roll||p.travel){p.held=0;p.chargeResume=0;return false;}
 if(p.guard){p.held=0;p.chargeResume=.18;return false;}
 if(p.prev.guard&&p.chargeResume>0&&input.attack&&!stockVariant){p.held=Math.max(p.held,CHARGE_PREP-GUARD_CHARGE_PREP);}
 p.chargeResume=Math.max(0,(p.chargeResume||0)-dt);
 if(p.move||p.cool>0){p.chargeDelay=POST_ATTACK_CHARGE_DELAY;if(input.attack)p.held+=dt;return false;}
 if(!input.attack)return false;
 p.held+=dt;
 return p.held>CHARGE_PREP&&p.chargeDelay===0&&!stockVariant;
}
export function chargeText(p){
 if(p.guard)return 'GUARD · release guard while holding attack for faster charge';
 if(p.anim==='charge')return p.stocks>=3?'STOCKS FULL':'CHARGING · lower life fills faster';
 if(p.chargeDelay>0)return 'CHARGE DELAY · recovering from attack';
 if(p.held>0)return 'CHARGE PREPARATION';
 return '';
}
