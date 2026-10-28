// Independent offensive lottery; public delayed observations and own command memory only.
export const GRAB_ATTACK_RATE=1/60;
export const GUESS_BREAK_RATE=1/60;
export function grabAttack(c){
 const s=c.memory.grabAttack??={release:false};
 if(s.release){s.release=false;return {guard:false,capture:false};}
 if(c.d>=3.1||c.rival.move||c.previous?.capture)return null;
 if(c.measure)c.measure.grabEligible=true;
 if((c.attackRandom||c.random)()>=GRAB_ATTACK_RATE)return null;
 s.release=true;
 return {guard:false,capture:true,grabAttackIntent:true,...(c.obs.rules?.captureBreak==='capture'?{breakIntent:'guess'}:{})};
}
export function grabDefence(c){
 const s=c.memory.breakDefence??={reacted:false,guessPending:false,holdGuard:0,release:false};
 const button=c.obs.rules?.captureBreak==='capture'?'capture':'guard';
 const seen=c.rival.move?.kind==='capture'&&c.rival.move.phase!=='recovery';
 const press=kind=>{s.guessPending=false;s.holdGuard=button==='guard'?11:0;s.release=button==='capture';return {guard:button==='guard',capture:button==='capture',breakIntent:kind};};
 if(!seen)s.reacted=false;
 if(seen&&!s.reacted){
  if(c.previous?.[button])return {guard:false,capture:false};
  s.reacted=true;return press('reaction');
 }
 if(seen)return {guard:button==='guard',capture:false};
 // The same offensive decision takes precedence over idle guard guesses/holds on both rule sets.
 const attack=grabAttack(c);if(attack){s.guessPending=false;s.holdGuard=0;s.release=false;return attack;}
 if(s.release){s.release=false;return {guard:false,capture:false};}
 if(s.holdGuard>0){s.holdGuard--;return {guard:true};}
 // Default keeps its timed-guard guesses. Split guesses are the offensive tap above, never a second tap.
 if(button!=='guard')return null;
 if(s.guessPending){if(c.previous?.guard)return {guard:false,capture:false};return press('guess');}
 if(c.d<3.1&&!c.rival.move&&c.random()<GUESS_BREAK_RATE){
  if(c.previous?.guard){s.guessPending=true;return {guard:false,capture:false};}
  return press('guess');
 }
 return null;
}
