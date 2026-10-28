// Policy memory and delayed public observations only. Guess probability is a playtest policy choice.
export const GUESS_BREAK_RATE=1/60;
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
 if(s.release){s.release=false;return {guard:false,capture:false};}
 if(s.holdGuard>0){s.holdGuard--;return {guard:true};}
 if(s.guessPending){if(c.previous?.[button])return {guard:false,capture:false};return press('guess');}
 if(c.d<3.1&&!c.rival.move&&c.random()<GUESS_BREAK_RATE){
  if(c.previous?.[button]){s.guessPending=true;return {guard:false,capture:false};}
  return press('guess');
 }
 return null;
}
