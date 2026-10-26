import {morrowFootTransition} from './morrow-attack-motion.js';
import {Vector3} from './vendor/three.module.js';
import {CHANNELS} from './rig-pose.js';
import {sampleClip} from './pose-clips.js';
import {clipMovePose} from './locomotion-clips.js';
import {animateGroundedRig,travelTarget,recoilPose,staggerPose,reversalPose} from './grounded-animation.js';
const pose=o=>Object.fromEntries(CHANNELS.map(k=>[k,o[k]??0]));
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const mix=(a,b,t)=>Object.fromEntries(CHANNELS.map(k=>[k,a[k]+(b[k]-a[k])*t]));
export const morrowStance=pose({bodyY:-.19,lean:.06,twist:.14,hy:-.1,lax:-.4,laz:.2,le:-.75,rax:-.3,ray:-.12,raz:-.1,re:-.15,llx:-.18,rlx:.18,lk:.3,rk:.3});
const p=o=>pose({...morrowStance,...o});
// Cross-cut, reverse sweep, overhead cleave. Contact poses retain the established
// reach; the new load/drive/overshoot keys carry weight through the same hit frame.
export const MORROW_ATTACK_NAMES=['Iron Crosscut','Returning Sweep','Gravefall'];
const cuts=[
 [p({bodyY:-.28,bodyX:.06,bodyZ:-.09,lean:-.10,hipYaw:.32,twist:.66,rax:-.45,ray:1.18,re:-.8,lax:-.8,le:-1,hy:-.40,llx:-.12,rlx:.32,lk:.26,rk:.48}),
  p({bodyZ:.18,bodyX:-.04,bodyY:-.22,lean:.23,hipYaw:-.2,twist:-.6,rax:-.7,ray:.4,re:.3,lax:-.7,le:-1.1,hy:.3}),
  p({bodyZ:.23,bodyX:-.08,bodyY:-.28,lean:.27,hipYaw:-.39,twist:-.88,rax:-.5,ray:-.88,re:-.12,lax:-.7,le:-.8,hy:.48,lk:.48,rk:.20})],
 [p({bodyY:-.29,bodyX:-.06,bodyZ:-.04,lean:-.07,hipYaw:-.35,twist:-.70,rax:-.56,ray:-1.18,re:-.8,lax:-.9,le:-1.1,hy:.38,lk:.48,rk:.22}),
  p({bodyZ:.19,bodyX:.04,bodyY:-.22,lean:.22,hipYaw:.2,twist:.45,rax:-.7,ray:-.5,re:.3,lax:-.65,le:-1,hy:-.25}),
  p({bodyZ:.25,bodyX:.08,bodyY:-.27,lean:.25,hipYaw:.39,twist:.83,rax:-.55,ray:.9,re:-.12,lax:-.75,le:-.9,hy:-.44,lk:.20,rk:.48})],
 [p({bodyY:-.24,bodyZ:-.09,lean:-.14,hipYaw:.14,twist:.20,rax:-2.78,ray:.15,re:-.42,lax:-2,le:-.7,hx:-.10,hy:-.08,lk:.42,rk:.35}),
  p({bodyZ:.24,bodyY:-.28,lean:.28,hipYaw:-.10,twist:-.13,rax:-.9,ray:0,re:.65,lax:-.7,le:-1,hx:.12}),
  p({bodyZ:.29,bodyY:-.36,lean:.37,hipYaw:-.14,twist:-.18,rax:-.15,ray:-.05,re:-.05,lax:-.5,le:-.6,hx:.08,lk:.53,rk:.32})]
];
export function morrowStrikePose(move){
 const [wind,contact,follow]=cuts[Math.min(2,Math.max(0,(move.chain||1)-1))];
 const active=move.active||1,end=move.startup+active+move.recovery,frame=Math.max(0,Math.min(end,move.frame));
 if(frame>=end)return {...morrowStance};
 // Legs and hips begin driving while the sword is still loaded. Acceleration
 // comes late, then the heavy blade takes time to decelerate and return.
 const drive=mix(wind,contact,.12);drive.hipYaw=wind.hipYaw*.45;drive.bodyZ=wind.bodyZ*.4;
 const brace=mix(follow,morrowStance,.68);
 const keys=[[0,morrowStance],[move.startup*.45,wind],[move.startup*.68,drive],[move.startup,contact],[move.startup+active+move.recovery*.24,follow],[move.startup+active+move.recovery*.72,brace],[end,morrowStance]];
 let i=1;while(i<keys.length-1&&frame>keys[i][0])i++;
 const [a,from]=keys[i-1],[b,to]=keys[i],u=(frame-a)/(b-a||1);
 return mix(from,to,i===3?u*u:smooth(u));
}
const steps=[
 p({bodyX:-.05,bodyY:-.21,lean:.15,twist:.25,hipYaw:-.12,llx:0,rlx:0,lk:.55,rk:.15,lax:-.6,rax:-.25}),
 p({bodyX:-.06,bodyY:-.28,lean:.19,twist:.15,hipYaw:-.02,llx:-.3,rlx:.3,lk:.4,rk:.4,lax:-.5,rax:-.28}),
 p({bodyX:0,bodyY:-.22,lean:.16,twist:-.05,hipYaw:.12,llx:-.5,rlx:.5,lk:.16,rk:.7,lax:-.3,rax:-.4}),
 p({bodyX:.04,bodyY:-.20,lean:.12,twist:-.1,hipYaw:.14,llx:-.2,rlx:.2,lk:.1,rk:.55,lax:-.25,rax:-.4})
];
const mirror=s=>p({...s,bodyX:-s.bodyX,hipYaw:-s.hipYaw,twist:.14-s.twist,llx:s.rlx,rlx:s.llx,lk:s.rk,rk:s.lk,lax:-.85-s.lax,rax:-.65-s.rax});
const cycle=[...steps,...steps.map(mirror)].map((s,i)=>[i/8,s]);cycle.push([1,steps[0]]);
export function morrowMovePose(forward,side,phase){
 const captured=clipMovePose(forward,side,phase,morrowStance.bodyY);if(captured)return p({...captured,lax:morrowStance.lax+(captured.lax-morrowStance.lax)*.5,rax:morrowStance.rax+(captured.rax-morrowStance.rax)*.5,le:morrowStance.le+(captured.le-morrowStance.le)*.4,re:morrowStance.re+(captured.re-morrowStance.re)*.4,twist:morrowStance.twist+captured.twist,lean:captured.lean*.7});
 const s=sampleClip(cycle,phase/(Math.PI*2),CHANNELS,true);
 if(Math.abs(side)>Math.abs(forward))return p({...s,lean:.08,side:side*.1,twist:.14+s.twist*.3,lax:-.55,rax:-.3,llx:-.12,rlx:.12,llz:side*(.12+s.llx*.3),rlz:side*(.12+s.rlx*.3)});
 if(forward<0)return p({...s,lean:-.08,llx:-s.llx*.6,rlx:-s.rlx*.6,lax:-.6,rax:-.3,twist:.14+s.twist*.4});
 return s;
}
function targetFor(player,time,phase,motion){
 if(player?.move?.kind==='strike'&&!player.air)return {kind:'strike',pose:player.move.reversal?reversalPose(player.move,morrowStrikePose):morrowStrikePose(player.move)};
 const travel=travelTarget(player,morrowStance,morrowStrikePose);if(travel)return travel;
 if(player?.staggerState&&!player.move)return {kind:'stagger',pose:staggerPose(morrowStance,p({bodyY:-.25,bodyZ:-.12,lean:-.24,twist:-.2,hx:-.3,laz:.4,raz:-.3}),player.staggerState)};
 if(player?.anim==='recover'&&!player.air&&!player.move)return {kind:'idle',pose:p({bodyY:-.22,lean:.04})};
 if(player?.move||player?.air>0||player?.roll||['knockdown','defeat','victory','launch','roll','jump','recover','pursuit','jumpAttack'].includes(player?.anim))return null;
 if(player?.guard){const recoil=Math.min(1,(player.blockStun||0)/.22);return {kind:'guard',pose:p({lax:-1,le:-1.6,rax:-.65,re:-.5,bodyY:-.25,lean:.12-.18*recoil,bodyZ:-.10*recoil,hx:-.1*recoil})};}
 if(player?.anim==='hurt')return {kind:'hurt',pose:recoilPose(p({bodyY:-.25,bodyZ:-.12,lean:-.24,twist:-.2,hx:-.3,laz:.4,raz:-.3}),morrowStance,player.animTime)};
 if(player?.anim==='charge')return {kind:'charge',pose:p({bodyY:-.26,lean:-.08,laz:.4,raz:-.3,le:-1,re:-.65})};
 if(player?.anim==='run')return {kind:'run',pose:morrowMovePose(motion?motion.forward:player.prev?.x??1,motion?motion.side:player.prev?.z||0,phase)};
 return {kind:'idle',pose:p({bodyY:-.19+Math.sin(time*1.8)*.006,twist:.14+Math.sin(time*1.3)*.014})};
}
export function animateMorrow(r,player,time){
 r.footPivot??=(p,kind)=>morrowFootTransition(r,p,kind);r.footBall??=new Vector3();r.footBall.set(0,-(r.ankleHeight??.14),.26);
 return animateGroundedRig(r,player,time,'morrow',targetFor);
}
