// Out-of-band diagnostics. Not part of match state, replay, input or combat events.
const observers=new WeakMap();
export function observeCombat(match,listener){let listeners=observers.get(match);if(!listeners){listeners=new Set();observers.set(match,listeners);}listeners.add(listener);return ()=>{listeners.delete(listener);if(!listeners.size)observers.delete(match);};}
export function measured(match,type,data){const listeners=observers.get(match);if(listeners)for(const listener of [...listeners]){try{listener({type,...data});}catch{/* Diagnostics cannot interrupt simulation or other observers. */}}}
