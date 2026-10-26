import {CHANNELS} from './rig-pose.js';
import {animateGroundedRig,travelTarget,recoilPose,staggerPose,reversalPose,rearLoad,strikeSchedule,sampleSchedule} from './grounded-animation.js';
import {rhythmFootOffsets,rhythmPose,kineticFootPivot} from './footwork.js';
import {Vector3} from './vendor/three.module.js';
import {sampleClip} from './pose-clips.js';
import {clipMovePose} from './locomotion-clips.js';
const pose=o=>Object.fromEntries(CHANNELS.map(k=>[k,o[k]??0]));
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const mix=(a,b,t)=>Object.fromEntries(CHANNELS.map(k=>[k,a[k]+(b[k]-a[k])*t]));
// Sword stance: centre of gravity lowered, torso coiled a touch, blade angled along the forearm (rwx hinges the wrist), off hand up as a counter-balance.
export const aegisStance=pose({lax:-.55,laz:.3,le:-1.0,rax:-.25,ray:-.15,raz:-.12,re:-.35,rwx:.7,twist:.18,lean:.08,hy:-.12,llx:-.22,llz:.1,rlx:.26,rlz:-.12,lk:.34,rk:.3,bodyY:-.17});
const p=o=>pose({...aegisStance,...o});
const cuts=[
 // cross cut: coil behind the right shoulder (wrist cocked), slash across to the left with the blade in line, overshoot past the line
 [p({rax:.3,ray:1.35,raz:.35,re:-.9,rwx:.2,rwz:.35,twist:.6,hipYaw:.22,lean:-.08,bodyY:-.24,lax:-.7,laz:.5,le:-1.1,llx:-.14,rlx:.32,lk:.3,rk:.5}),
  p({rax:-1.4,ray:.6,raz:.05,re:-.1,rwx:1.5,rwz:-.4,twist:-.5,hipYaw:-.42,lean:.16,bodyZ:.16,bodyY:-.14,lax:-.3,laz:.6,le:-.9,llx:-.4,rlx:.42,lk:.42,rk:.14}),
  p({rax:-1.45,ray:-.5,raz:.05,re:-.2,rwx:1.2,rwz:-.3,twist:-.7,hipYaw:-.46,lean:.18,bodyZ:.18,bodyY:-.16,lax:-.2,laz:.7,le:-.8,llx:-.4,rlx:.42,lk:.46,rk:.14})],
 // reverse cut: coil across the body, blade in line as it comes back to the right
 [p({rax:.2,ray:-1.3,raz:-.3,re:-.9,rwx:.2,rwz:-.35,twist:-.6,hipYaw:-.24,lean:-.06,bodyY:-.24,lax:-.7,laz:.3,le:-1.1,llx:-.3,rlx:.14,lk:.5,rk:.3}),
  p({rax:-1.4,ray:-.6,raz:.05,re:-.1,rwx:1.5,rwz:.4,twist:.45,hipYaw:.4,lean:.16,bodyZ:.16,bodyY:-.14,lax:-.5,laz:.5,le:-1,llx:-.45,rlx:.35,lk:.2,rk:.44}),
  p({rax:-1.45,ray:.55,raz:.05,re:-.2,rwx:1.2,rwz:.3,twist:.7,hipYaw:.44,lean:.18,bodyZ:.18,bodyY:-.16,lax:-.5,laz:.55,le:-1,llx:-.45,rlx:.35,lk:.22,rk:.46})],
 // overhead cleave: both hands on the hilt behind the head, the blade comes down in line with the arms, knees absorb the overshoot
 [p({rax:-2.6,ray:.15,raz:.1,re:-.6,rwx:.1,rwz:.3,lax:-2.3,laz:.1,le:-.7,twist:.2,hipYaw:.14,lean:-.2,bodyY:-.26,lk:.5,rk:.5}),
  p({rax:-1.6,ray:0,raz:.1,re:-.1,rwx:1.55,rwz:-.35,lax:-1.5,laz:.15,le:-.2,twist:-.12,hipYaw:-.14,lean:.3,bodyZ:.24,bodyY:-.2,llx:-.5,rlx:.3,lk:.45,rk:.18}),
  p({rax:-1.5,ray:-.05,raz:.1,re:-.15,rwx:1.3,rwz:-.25,lax:-1.4,laz:.2,le:-.3,twist:-.16,hipYaw:-.16,lean:.38,bodyZ:.3,bodyY:-.3,llx:-.5,rlx:.3,lk:.6,rk:.2})]
];
export function aegisStrikePose(move){
 const [wind,contact,follow]=cuts[Math.min(2,Math.max(0,(move.chain||1)-1))];
 const end=move.startup+(move.active||1)+move.recovery;
 const frame=Math.max(0,Math.min(end,move.frame));if(frame>=end)return {...aegisStance};
 const loaded=rearLoad(aegisStance,wind,contact),drive=mix(loaded,contact,.74),retract=mix(follow,aegisStance,.6);
 return sampleSchedule(strikeSchedule(move,aegisStance,loaded,drive,contact,follow,retract),frame);
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
 // Guard: blade angled up along the forearm across the body, off hand behind it, weight low.
 if(player?.guard){const recoil=Math.min(1,(player.blockStun||0)/.22);return {kind:'guard',pose:rhythmPose(p({lax:-1.1,le:-1.6,laz:.2,rax:-.6,ray:.3,raz:-.3,re:-.7,rwx:.9,rwz:.2,twist:.2,lean:.12-.24*recoil,bodyZ:-.12*recoil,hx:-.15*recoil,bodyY:-.22,lk:.4,rk:.36}),time,.35)};}
 if(player?.anim==='hurt')return {kind:'hurt',pose:recoilPose(p({lean:-.3,twist:-.22,hx:-.35,laz:.4,raz:-.3,bodyZ:-.14,bodyY:-.18}),aegisStance,player.animTime,player.hitstop)};
 if(player?.anim==='charge')return {kind:'charge',pose:p({laz:.4,raz:-.35,le:-1,re:-.5,lean:-.08,bodyY:-.2})};
 if(player?.anim==='run')return {kind:'run',pose:aegisMovePose(motion?motion.forward:player.prev?.x??1,motion?motion.side:player.prev?.z||0,phase)};
  return {kind:'idle',pose:rhythmPose(p({bodyY:-.14+Math.sin(time*2.1)*.012,twist:.12+Math.sin(time*1.5)*.018}),time,.85)};
}
const aegisImpact=p({lean:-.3,twist:-.22,hx:-.35,laz:.4,raz:-.3,bodyZ:-.14,bodyY:-.18});
// Specials: the blade loads behind the shoulder and thrusts straight; the drive technique lunges behind it.
const aegisSpecials={special:[{rax:.3,ray:.2,raz:-.1,re:-1.2,lax:-.3,le:-.8,twist:.3,hipYaw:.15,lean:-.05,bodyY:-.2,rlx:.3,llx:-.14,rk:.45,lk:.3},
  {rax:-1.45,ray:-.1,raz:-.05,re:-.12,lax:-.6,le:-.8,twist:-.35,hipYaw:-.4,lean:.2,bodyZ:.16,bodyY:-.14,llx:-.35,rlx:.4,lk:.4,rk:.15},
  {rax:-1.2,ray:-.15,raz:-.05,re:-.3,lax:-.55,le:-.8,twist:-.4,hipYaw:-.42,lean:.22,bodyZ:.18,bodyY:-.14,llx:-.35,rlx:.4,lk:.4,rk:.15}],
 technique:[{rax:.4,re:-1.4,lax:-.5,le:-1,twist:.35,hipYaw:.15,lean:-.15,bodyY:-.25,lk:.45,rk:.5},
  {rax:-1.8,re:-.1,lax:-.6,le:-.8,twist:-.3,hipYaw:-.3,lean:.5,bodyZ:.3,bodyY:-.16,llx:-.5,rlx:.45,lk:.45,rk:.1},
  {rax:-1.6,re:-.2,lax:-.6,le:-.8,twist:-.35,hipYaw:-.32,lean:.45,bodyZ:.3,bodyY:-.18,llx:-.5,rlx:.45,lk:.45,rk:.1}]};
export function animateAegis(r,player,time){r.footOffsets??=rhythmFootOffsets;r.footPivot??=kineticFootPivot;r.footBall??=new Vector3(0,-(r.ankleHeight??.14),.26);return animateGroundedRig(r,player,time,'aegis',targetFor,{stance:aegisStance,impact:aegisImpact,id:'aegis',strikePose:aegisStrikePose,specials:aegisSpecials});}
