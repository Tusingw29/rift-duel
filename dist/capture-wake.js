import {arenaRadius,ringArena,constrainPosition} from './arena-bounds.js';
import {measured} from './skill/observer.js';
// CAPTURE-LOOP playtest guesses. Protection applies to flying capture circles only.
export const CAPTURE_WAKE=Object.freeze({graceFrames:20,endDistances:Object.freeze({close3:3,close45:4.5})});
const configs=new WeakMap(),states=new WeakMap();
export function normalizeCaptureWake(value=''){
 const names=[...new Set(String(value||'').split(',').map(s=>s.trim()==='close'?'close3':s.trim()).filter(s=>['inv','close3','close45'].includes(s)))].sort();
 if(names.includes('close3')&&names.includes('close45'))throw Error('Choose one capture-wake end distance: close3 or close45');
 return names.join(',');
}
export const captureWakeFromSearch=search=>normalizeCaptureWake(new URLSearchParams(search).get('capturewake')||'');
export function configureCaptureWake(m,value){const names=normalizeCaptureWake(value).split(',');if(names.some(Boolean)){configs.set(m,{inv:names.includes('inv'),distance:names.includes('close3')?3:names.includes('close45')?4.5:0});for(const p of m.players)states.set(p,{down:false,until:-Infinity});}return m;}
export const captureWakeConfig=m=>configs.get(m)||null;
export const captureDown=p=>!!(p.knockdown||p.getUp||p.bounce||p.roll||p.launched||p.anim==='knockdown'||p.anim==='getUp'||p.anim==='roll');
// Called on each advancing tick before and after player state updates, so the exact
// stand-up frame is protected. Hitstop does not consume simulation-frame grace.
export function updateCaptureWake(m){if(!configs.get(m)?.inv)return;for(const p of m.players){const s=states.get(p),down=captureDown(p);if(s.down&&!down&&p.hp>0)s.until=m.tick+CAPTURE_WAKE.graceFrames;s.down=down;}}
export function circleWakeProtected(m,p){return !!configs.get(m)?.inv&&(captureDown(p)||m.tick<(states.get(p)?.until??-Infinity));}
export function rejectWakeCircle(m,p,shot){if(shot.kind!=='capture'||!circleWakeProtected(m,p))return false;shot.life=0;measured(m,'captureWakeAvoid',{attacker:shot.owner,defender:m.players.indexOf(p),down:captureDown(p),graceRemaining:Math.max(0,(states.get(p)?.until||0)-m.tick)});return true;}
// Preserve the pair's direction and midpoint when feasible. If necessary translate
// the pair toward the origin; both endpoints stay in bounds and the gap stays exact.
export function finishRangedCapture(m,a,b,context){const gap=configs.get(m)?.distance;if(!gap||!['mid','far'].includes(context)||b.hp<=0)return false;
 const before=[a,b].map(p=>({x:p.x,z:p.z})),dx=b.x-a.x,dz=b.z-a.z,n=Math.hypot(dx,dz),ux=n>1e-9?dx/n:1,uz=n>1e-9?dz/n:0,h=gap/2;let x=(a.x+b.x)/2,z=(a.z+b.z)/2;
 if(ringArena(m)){const radius=arenaRadius(m),c2=x*x+z*z;if(c2>1e-16){const dot=Math.abs(x*ux+z*uz),t=Math.min(1,Math.max(0,(-h*dot+Math.sqrt(h*h*dot*dot+c2*(radius*radius-h*h)))/c2));x*=t;z*=t;}}
 else{x=Math.max(-11+Math.abs(ux*h),Math.min(11-Math.abs(ux*h),x));z=Math.max(-6+Math.abs(uz*h),Math.min(6-Math.abs(uz*h),z));}
 a.x=x-ux*h;a.z=z-uz*h;b.x=x+ux*h;b.z=z+uz*h;constrainPosition(a);constrainPosition(b);
 // hit() queued a visual recoil displacement; retaining it would widen the chosen
 // end distance by another half unit. Damage/stun/air/guard/facing remain untouched.
 b.knockback=null;
 measured(m,'captureReposition',{attacker:m.players.indexOf(a),defender:m.players.indexOf(b),context,distance:Math.hypot(b.x-a.x,b.z-a.z),before,after:[a,b].map(p=>({x:p.x,z:p.z}))});return true;
}
