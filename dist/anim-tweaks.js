// ANIM-WORKBENCH: an additive keyed layer on top of any animation source (authored, imported, or the two together:
// "hybrid"). Tweaks are channel offsets at named keys of a move, laid out on the move's own frame timing:
//   coil (35% of the startup) · drive (70%) · whip (one frame before contact) · impact (the damage frame)
//   overshoot (45% into the recovery) · recovery (78%) · stance (the end, always zero)
// and interpolated linearly between keys, so a tweak at "impact" peaks on the damage frame and fades out by the
// neighbouring keys. Frame-driven like everything else (hitstop holds it). The shipped data lives in
// anim-tweaks-data.js (exported from dist/anim-workbench.html); the workbench edits TWEAKS live.
import {TWEAK_DATA} from './anim-tweaks-data.js';
export const KEY_NAMES=['coil','drive','whip','impact','overshoot','recovery'];
export const TWEAKS=structuredClone(TWEAK_DATA);
// Which move a tweak set belongs to: "strike1".."strike3", or the move kind.
export const moveKey=move=>move?.kind==='strike'?`strike${Math.max(1,Math.min(3,move.chain||1))}`:move?.kind;
export function keyTimes(move){
 const s=Math.max(1,move.startup),a=move.active||1,R=move.recovery||1;
 return {start:0,coil:s*.35,drive:s*.7,whip:Math.max(s*.7+.5,s-1),impact:s,overshoot:s+a+R*.45,recovery:s+a+R*.78,end:s+a+R};
}
// Weights of each named key at a frame (tent functions between neighbouring keys).
export function keyWeights(move,frame=move.frame){
 const t=keyTimes(move),order=[['start',t.start],...KEY_NAMES.map(k=>[k,t[k]]),['end',t.end]],out={};
 for(let i=1;i<order.length-1;i++){const [name,at]=order[i],prev=order[i-1][1],next=order[i+1][1];
  out[name]=frame<=prev||frame>=next?0:frame<=at?(frame-prev)/Math.max(1e-6,at-prev):(next-frame)/Math.max(1e-6,next-at);}
 return out;
}
// The workbench renders its reference view with tweaks off and its edited view with them on.
export const tweakState={enabled:true};
export function applyTweaks(fighter,move,pose){
 const set=tweakState.enabled&&move&&TWEAKS[fighter]?.[moveKey(move)];if(!set)return pose;
 const w=keyWeights(move),out={...pose};
 for(const [key,channels] of Object.entries(set))if(w[key])for(const [ch,v] of Object.entries(channels))if(ch in out)out[ch]+=v*w[key];
 return out;
}
export const hasTweaks=()=>Object.values(TWEAKS).some(f=>Object.values(f).some(m=>Object.values(m).some(k=>Object.keys(k).length)));
