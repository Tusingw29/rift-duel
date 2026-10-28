// Out-of-band diagnostics. Not part of match state, replay, input or combat events.
const observers=new WeakMap();
export function observeCombat(match,listener){observers.set(match,listener);return ()=>observers.delete(match);}
export function measured(match,type,data){const listener=observers.get(match);if(listener){try{listener({type,...data});}catch{/* Diagnostics cannot interrupt simulation. */}}}
