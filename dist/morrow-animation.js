import {CHANNELS} from './rig-pose.js';
import {sampleClip} from './pose-clips.js';
import {animateGroundedRig} from './grounded-animation.js';
const pose=o=>Object.fromEntries(CHANNELS.map(k=>[k,o[k]??0]));
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const mix=(a,b,t)=>Object.fromEntries(CHANNELS.map(k=>[k,a[k]+(b[k]-a[k])*t]));
export const morrowStance=pose({bodyY:-.19,lean:.06,twist:.14,hy:-.1,lax:-.4,laz:.2,le:-.75,rax:-.3,ray:-.12,raz:-.1,re:-.15,llx:-.18,rlx:.18,lk:.3,rk:.3});
const p=o=>pose({...morrowStance,...o});
const cuts=[
 [p({bodyY:-.25,bodyX:-.05,lean:-.09,hipYaw:.3,twist:.65,rax:-.3,ray:1.1,re:-.7,lax:-.6,le:-1,hy:-.3}),p({bodyZ:.18,bodyY:-.22,lean:.23,hipYaw:-.2,twist:-.6,rax:-.7,ray:.4,re:.3,lax:-.7,le:-1.1,hy:.3}),p({bodyZ:.22,bodyY:-.25,lean:.28,hipYaw:-.3,twist:-.85,rax:-.4,ray:-.6,re:.15,lax:-.5,le:-.9,hy:.4})],
 [p({bodyY:-.27,bodyX:.05,lean:-.04,hipYaw:-.3,twist:-.65,rax:-.45,ray:-1.05,re:-.75,lax:-.7,le:-1.1,hy:.3}),p({bodyZ:.19,bodyY:-.22,lean:.22,hipYaw:.2,twist:.45,rax:-.7,ray:-.5,re:.3,lax:-.65,le:-1,hy:-.25}),p({bodyZ:.24,bodyY:-.25,lean:.30,hipYaw:.3,twist:.75,rax:-.4,ray:.6,re:.15,lax:-.45,le:-.8,hy:-.4})],
 [p({bodyY:-.28,lean:-.18,hipYaw:.15,twist:.22,rax:-2.7,ray:.12,re:-.5,lax:-1.45,le:-1.1,hx:-.12}),p({bodyZ:.24,bodyY:-.28,lean:.28,hipYaw:-.10,twist:-.13,rax:-.9,ray:0,re:.65,lax:-.7,le:-1,hx:.12}),p({bodyZ:.27,bodyY:-.31,lean:.42,hipYaw:-.14,twist:-.18,rax:-.28,ray:-.05,re:.2,lax:-.5,le:-.6,hx:.16})]
];
export function morrowStrikePose(move){
 const [wind,contact,follow]=cuts[Math.min(2,Math.max(0,(move.chain||1)-1))];
 const end=move.startup+(move.active||1)+move.recovery,frame=Math.max(0,Math.min(end,move.frame));
 if(frame>=end)return {...morrowStance};
 // Hold the weapon's carried momentum before drawing it back to the brace.
 const brace=mix(follow,morrowStance,.62);
 const keys=[[0,morrowStance],[move.startup*.65,wind],[move.startup,contact],[move.startup+1+move.recovery*.4,follow],[move.startup+1+move.recovery*.75,brace],[end,morrowStance]];
 let i=1;while(i<keys.length-1&&frame>keys[i][0])i++;const [a,from]=keys[i-1],[b,to]=keys[i];return mix(from,to,smooth((frame-a)/(b-a||1)));
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
 const s=sampleClip(cycle,phase/(Math.PI*2),CHANNELS,true);
 if(Math.abs(side)>Math.abs(forward))return p({...s,lean:.08,side:side*.1,twist:.14+s.twist*.3,lax:-.55,rax:-.3,llx:-.12,rlx:.12,llz:side*(.12+s.llx*.3),rlz:side*(.12+s.rlx*.3)});
 if(forward<0)return p({...s,lean:-.08,llx:-s.llx*.6,rlx:-s.rlx*.6,lax:-.6,rax:-.3,twist:.14+s.twist*.4});
 return s;
}
function targetFor(player,time,phase){
 if(player?.move?.kind==='strike'&&!player.air)return {kind:'strike',pose:morrowStrikePose(player.move)};
 if(player?.move||player?.air>0||player?.roll||['knockdown','defeat','victory','launch','roll','jump','recover','pursuit','jumpAttack'].includes(player?.anim))return null;
 if(player?.guard){const recoil=Math.min(1,(player.blockStun||0)/.22);return {kind:'guard',pose:p({lax:-1,le:-1.6,rax:-.65,re:-.5,bodyY:-.25,lean:.12-.18*recoil,bodyZ:-.10*recoil,hx:-.1*recoil})};}
 if(player?.anim==='hurt')return {kind:'hurt',pose:mix(p({bodyY:-.25,bodyZ:-.12,lean:-.24,twist:-.2,hx:-.3,laz:.4,raz:-.3}),morrowStance,smooth((player.animTime||0)/.4))};
 if(player?.anim==='charge')return {kind:'charge',pose:p({bodyY:-.26,lean:-.08,laz:.4,raz:-.3,le:-1,re:-.65})};
 if(player?.anim==='run')return {kind:'run',pose:morrowMovePose(player.prev?.x??1,player.prev?.z||0,phase)};
 return {kind:'idle',pose:p({bodyY:-.19+Math.sin(time*1.8)*.006,twist:.14+Math.sin(time*1.3)*.014})};
}
export function animateMorrow(r,player,time){return animateGroundedRig(r,player,time,'morrow',targetFor);}
