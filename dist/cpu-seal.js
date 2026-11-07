import {sealConfig,sealCommit} from './capture-seal.js';
import {grabOptions} from './grab-options.js';
import {arenaRadius,ringArena} from './arena-bounds.js';
export const CPU_SEAL=Object.freeze({dashChance:Object.freeze({easy:.25,normal:.65,hard:.9})});
const plans=new WeakMap();
const free=p=>p.hp>0&&!p.move&&!p.escapeDash&&!p.travel&&!p.roll&&!p.jumpSquat&&!p.getUp&&!p.knockdown&&!p.bounce&&!p.step&&p.air<=0&&p.stun<=0&&p.blockStun<=0&&p.cool<=0;
const blank=()=>({x:0,z:0,attack:false,guard:false,capture:false,launch:false,pursuit:false,super:false});
const plan=(key,fn)=>{if(!plans.has(key))plans.set(key,fn());return plans.get(key);};
export function cpuSealOverlay(m,a,b,random,reaction,diff,reach){const opt=grabOptions(m);if(!sealConfig(m).on&&!opt.locked&&!opt.reach&&!opt.slow16)return null;
 if(a.escapeDash)return blank();
 if(a.sealPunishUntil>=m.tick&&free(a))return {...blank(),attack:!a.prev.attack};
 if(a.sealEscape&&a.sealEscape.expires>m.tick&&free(a)){const p=plan(a.sealEscape,()=>({use:random()<CPU_SEAL.dashChance[diff]}));if(p.use)return {...blank(),x:1,attack:true};}
 const s=m.seals?.find(s=>s.status==='closing'&&s.target===m.players.indexOf(a));
 if(s){const p=plan(s,()=>{const dx=s.x-b.x,dz=s.z-b.z,n=Math.hypot(dx,dz)||1;let x=-dz/n,z=dx/n;if(ringArena(m)&&Math.hypot(s.x+x*4,s.z+z*4)>arenaRadius(m)){x=-x;z=-z;}return {seen:m.tick,x,z};});
  if(m.tick-p.seen<reaction||!free(a))return blank();
  // A fixed lateral vector out of the cast line. Recomputing a tangent to the
  // defender's radius from the seal would orbit the seal instead of escaping it.
  const dx=b.x-a.x,dz=b.z-a.z,n=Math.hypot(dx,dz)||1;return {...blank(),x:p.x*dx/n+p.z*dz/n,z:-p.x*dz/n+p.z*dx/n};}
 const mv=b.move,d=Math.hypot(b.x-a.x,b.z-a.z);
 if(mv?.kind==='capture'&&!mv.sealId&&(mv.captureClose??d<3.1)&&mv.frame<mv.startup){const p=plan(mv,()=>({seen:m.tick,tapped:false}));if(m.tick-p.seen<reaction)return blank();if(!p.tapped&&free(a)){p.tapped=true;p.button=m.balance?.sys.splitGuard&&!opt.fresh?'capture':'guard';return {...blank(),[p.button]:true};}return {...blank(),guard:p.tapped&&p.button==='guard'};}
 if(mv&&mv.frame>=mv.startup+mv.active&&!mv.connected&&free(a)){if(d<reach)return {...blank(),attack:!a.prev.attack};if(mv.kind==='capture')return {...blank(),x:1};}
 return null;
}
