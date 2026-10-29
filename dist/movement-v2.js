import {moveWithinBounds} from './arena-bounds.js';
// MOVE-V2 playtest guesses. Distances are world units; durations are 60 Hz simulation frames.
export const MOVE_V2_GUESSES=Object.freeze({doubleTapWindow:12,dash:Object.freeze({frames:12,distance:1.5}),backdash:Object.freeze({frames:14,distance:2.2}),sidestep:Object.freeze({frames:14,distance:1.8}),recovery:6});
const enabled=new WeakSet();
export const movementFromSearch=search=>new URLSearchParams(search).get('move')==='v2'?'v2':'';
export function configureMovement(m,mode){if(mode==='v2'){enabled.add(m);for(const p of m.players)p.step=null;}return m;}
export const movementV2=m=>enabled.has(m);
export function liveAxes(a,b){const dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz);return d>1e-9?{x:dx/d,z:dz/d}:{x:1,z:0};}
export function wallSlide(a,dx,dz){return moveWithinBounds(a,dx,dz,true);}
export function canStartStep(p){return !p.step&&!p.move&&!p.travel&&!p.roll&&!p.jumpSquat&&!p.getUp&&!p.bounce&&!p.staggerState&&p.air<=0&&p.stun<=0&&p.blockStun<=0&&p.cool<=0&&p.hp>0;}
export function startStep(p,direction,tick){if(!canStartStep(p))return false;const kind=direction==='forward'?'dash':direction==='back'?'backdash':'sidestep',config=MOVE_V2_GUESSES[kind];p.step={kind,direction,phase:'travel',frame:0,frames:config.frames,distance:config.distance,recovery:0,started:tick};p.cool=(config.frames+MOVE_V2_GUESSES.recovery)/60;p.anim='run';p.animTime=p.cool;p.guard=false;p.held=0;p.pendingInput=null;p.buffer=null;return true;}
export function cancelStep(p){p.step=null;p.cool=0;p.animTime=0;p.anim='idle';p.guard=false;}
export function stepDelta(p,rival){const s=p.step;if(!s)return {x:0,z:0};if(s.phase==='recovery'){s.recovery++;p.anim='idle';if(s.recovery>=MOVE_V2_GUESSES.recovery){p.step=null;p.cool=0;p.animTime=0;}return {x:0,z:0};}
 const u=s.frame/s.frames,v=++s.frame/s.frames,ds=s.distance*((1-u)**2-(1-v)**2),f=liveAxes(p,rival);let delta;
 if(s.kind==='sidestep'){const rx=p.x-rival.x,rz=p.z-rival.z,r=Math.hypot(rx,rz);if(r<1e-9)delta={x:0,z:0};else{const angle=(s.direction==='down'?-1:1)*2*Math.asin(Math.min(1,ds/(2*r))),c=Math.cos(angle),t=Math.sin(angle);delta={x:rx*c-rz*t-rx,z:rx*t+rz*c-rz};}}
 else{const sign=s.kind==='dash'?1:-1;delta={x:sign*f.x*ds,z:sign*f.z*ds};}
 p.anim='run';if(s.frame===s.frames){s.phase='recovery';s.recovery=0;p.commands.double=null;}return delta;
}
// Snapshot both positions after committed legacy travel, then apply both players' movement together.
export function applyLiveMovement(m,walks){const positions=m.players.map(p=>({x:p.x,z:p.z}));const deltas=m.players.map((p,n)=>{if(p.step)return stepDelta(p,positions[1-n]);const w=walks[n];if(!w)return {x:0,z:0};const f=liveAxes(positions[n],positions[1-n]);return {x:(w.x*f.x-w.z*f.z)*w.scale,z:(w.x*f.z+w.z*f.x)*w.scale};});m.players.forEach((p,n)=>wallSlide(p,deltas[n].x,deltas[n].z));}
