import {CHANNELS} from './rig-pose.js';
import {animateGroundedRig,travelTarget,recoilPose,staggerPose,reversalPose} from './grounded-animation.js';
import {sampleClip} from './pose-clips.js';
import {clipMovePose} from './locomotion-clips.js';
const pose=o=>Object.fromEntries(CHANNELS.map(k=>[k,o[k]??0]));
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const mix=(a,b,t)=>Object.fromEntries(CHANNELS.map(k=>[k,a[k]+(b[k]-a[k])*t]));
export const aegisStance=pose({lax:-.4,laz:.18,le:-.8,rax:-.2,ray:-.12,raz:-.12,re:-.15,twist:.12,hy:-.1,llx:-.16,rlx:.18,lk:.22,rk:.2,bodyY:-.12});
const p=o=>pose({...aegisStance,...o});
const cuts=[
 [p({rax:-.3,ray:1.05,re:-.65,twist:.55,hipYaw:.18,lean:-.06,bodyY:-.20}),p({rax:-.75,ray:.35,re:.35,twist:-.4,hipYaw:-.16,lean:.14,lax:-.65,le:-1,bodyZ:.14}),p({rax:-.45,ray:-.5,re:.25,twist:-.65,hipYaw:-.22,lean:.16,bodyZ:.16})],
 [p({rax:-.35,ray:-1,re:-.7,twist:-.55,hipYaw:-.2,lean:-.04,bodyY:-.20}),p({rax:-.75,ray:-.4,re:.35,twist:.4,hipYaw:.16,lean:.16,lax:-.6,le:-1,bodyZ:.16}),p({rax:-.45,ray:.55,re:.2,twist:.7,hipYaw:.23,lean:.18,bodyZ:.18})],
 [p({rax:-2.6,ray:.15,re:-.6,lax:-1.1,le:-1.1,twist:.2,hipYaw:.14,lean:-.18,bodyY:-.23}),p({rax:-.85,ray:0,re:.55,lax:-.6,le:-.8,twist:-.12,hipYaw:-.08,lean:.25,bodyZ:.24,bodyY:-.19}),p({rax:-.3,ray:-.08,re:.25,lax:-.35,le:-.6,lean:.35,twist:-.16,bodyZ:.28,bodyY:-.22})]
];
export function aegisStrikePose(move){
 const [wind,contact,follow]=cuts[Math.min(2,Math.max(0,(move.chain||1)-1))];
 const end=move.startup+(move.active||1)+move.recovery;
 const frame=Math.max(0,Math.min(end,move.frame));if(frame>=end)return {...aegisStance};
 const keys=[[0,aegisStance],[move.startup*.62,wind],[move.startup,contact],[move.startup+(move.active||1)+move.recovery*.24,follow],[end,aegisStance]];
 let i=1;while(i<keys.length-1&&frame>keys[i][0])i++;const [a,from]=keys[i-1],[b,to]=keys[i];return mix(from,to,smooth((frame-a)/(b-a||1)));
}
const steps=[
 p({bodyX:-.04,bodyY:-.16,lean:.12,twist:.22,hipYaw:-.10,lax:-.65,le:-.8,rax:-.16,re:-.3,llx:0,rlx:0,lk:.5,rk:.1}),
 p({bodyX:-.05,bodyY:-.22,lean:.16,twist:.12,hipYaw:0,lax:-.5,le:-.8,rax:-.28,re:-.3,llx:-.3,rlx:.35,lk:.4,rk:.3}),
 p({bodyX:0,bodyY:-.14,lean:.15,twist:-.10,hipYaw:.12,lax:-.25,le:-.65,rax:-.4,re:-.35,llx:-.55,rlx:.5,lk:.12,rk:.7}),
 p({bodyX:.035,bodyY:-.12,lean:.12,twist:-.14,hipYaw:.14,lax:-.18,le:-.6,rax:-.45,re:-.35,llx:-.25,rlx:.25,lk:.08,rk:.6})
];
const mirror=s=>p({...s,bodyX:-s.bodyX,hipYaw:-s.hipYaw,twist:.12-s.twist,llx:s.rlx,rlx:s.llx,lk:s.rk,rk:s.lk,lax:-.85-s.lax,rax:-.6-s.rax});
const cycle=[...steps,...steps.map(mirror)].map((s,i)=>[i/8,s]);cycle.push([1,steps[0]]);
export function aegisMovePose(forward,side,phase){
 const captured=clipMovePose(forward,side,phase,aegisStance.bodyY);if(captured)return p({...captured,lax:aegisStance.lax+(captured.lax-aegisStance.lax)*.5,rax:aegisStance.rax+(captured.rax-aegisStance.rax)*.5,le:aegisStance.le+(captured.le-aegisStance.le)*.4,re:aegisStance.re+(captured.re-aegisStance.re)*.4,twist:aegisStance.twist+captured.twist});
 const s=sampleClip(cycle,phase/(Math.PI*2),CHANNELS,true);
 if(Math.abs(side)>Math.abs(forward))return p({...s,lean:.08,side:side*.08,twist:.12+s.twist*.35,lax:-.55,rax:-.3,llx:-.12,rlx:.12,llz:side*(.12+s.llx*.3),rlz:side*(.12+s.rlx*.3)});
 if(forward<0)return p({...s,lean:-.08,llx:-s.llx*.6,rlx:-s.rlx*.6,lax:-.6,rax:-.3,twist:.12+s.twist*.5});
 return s;
}
function targetFor(player,time,phase,motion){
 if(player?.move?.kind==='strike'&&!player.air)return {kind:'strike',pose:player.move.reversal?reversalPose(player.move,aegisStrikePose):aegisStrikePose(player.move)};
 const travel=travelTarget(player,aegisStance,aegisStrikePose);if(travel)return travel;
 if(player?.staggerState&&!player.move)return {kind:'stagger',pose:staggerPose(aegisStance,p({lean:-.3,twist:-.22,hx:-.35,laz:.4,raz:-.3,bodyZ:-.14,bodyY:-.18}),player.staggerState)};
 if(player?.anim==='recover'&&!player.air&&!player.move)return {kind:'idle',pose:p({bodyY:-.15,lean:.04})};
 if(player?.move||player?.air>0||player?.roll||['knockdown','defeat','victory','launch','roll','jump','recover','pursuit','jumpAttack'].includes(player?.anim))return null;
 if(player?.guard){const recoil=Math.min(1,(player.blockStun||0)/.22);return {kind:'guard',pose:p({lax:-1.1,le:-1.6,laz:.2,rax:-.5,re:-.55,twist:.2,lean:.12-.24*recoil,bodyZ:-.12*recoil,hx:-.15*recoil,bodyY:-.19})};}
 if(player?.anim==='hurt')return {kind:'hurt',pose:recoilPose(p({lean:-.3,twist:-.22,hx:-.35,laz:.4,raz:-.3,bodyZ:-.14,bodyY:-.18}),aegisStance,player.animTime)};
 if(player?.anim==='charge')return {kind:'charge',pose:p({laz:.4,raz:-.35,le:-1,re:-.5,lean:-.08,bodyY:-.2})};
 if(player?.anim==='run')return {kind:'run',pose:aegisMovePose(motion?motion.forward:player.prev?.x??1,motion?motion.side:player.prev?.z||0,phase)};
 return {kind:'idle',pose:p({bodyY:-.12+Math.sin(time*2.1)*.008,twist:.12+Math.sin(time*1.5)*.018})};
}
export function animateAegis(r,player,time){return animateGroundedRig(r,player,time,'aegis',targetFor);}
