import {morrowFootTransition} from './morrow-attack-motion.js';
import {Vector3} from './vendor/three.module.js';
import {CHANNELS} from './rig-pose.js';
import {sampleClip} from './pose-clips.js';
import {clipMovePose} from './locomotion-clips.js';
import {animateGroundedRig,travelTarget,recoilPose,staggerPose,reversalPose,strikeSchedule,sampleSchedule} from './grounded-animation.js';
import {rhythmFootOffsets,rhythmPose} from './footwork.js';
const pose=o=>Object.fromEntries(CHANNELS.map(k=>[k,o[k]??0]));
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const mix=(a,b,t)=>Object.fromEntries(CHANNELS.map(k=>[k,a[k]+(b[k]-a[k])*t]));
// Greatsword stance: low and wide, both hands toward the hilt, blade angled along the forearm (rwx hinges the wrist).
export const morrowStance=pose({bodyY:-.24,lean:.1,twist:.18,hy:-.12,lax:-.55,laz:.15,le:-.9,rax:-.35,ray:-.1,raz:-.12,re:-.3,rwx:.65,llx:-.24,llz:.12,rlx:.26,rlz:-.14,lk:.4,rk:.38});
const p=o=>pose({...morrowStance,...o});
// Cross-cut, reverse sweep, overhead cleave. Contact poses retain the established
// reach; the new load/drive/overshoot keys carry weight through the same hit frame.
export const MORROW_ATTACK_NAMES=['Iron Crosscut','Returning Sweep','Gravefall'];
const cuts=[
 [p({rwx:.15,rwz:.35,bodyY:-.28,bodyX:.06,bodyZ:-.09,lean:-.10,hipYaw:.32,twist:.66,rax:-.45,ray:1.18,re:-.8,lax:-.8,le:-1,hy:-.40,llx:-.12,rlx:.32,lk:.26,rk:.48}),
  p({rwx:1.5,rwz:-.4,bodyZ:.18,bodyX:-.04,bodyY:-.22,lean:.23,hipYaw:-.2,twist:-.45,rax:-1.4,ray:.15,re:-.05,lax:-.7,le:-1.1,hy:.3}),
  p({rwx:1.2,rwz:-.3,bodyZ:.23,bodyX:-.08,bodyY:-.28,lean:.27,hipYaw:-.39,twist:-.88,rax:-1.1,ray:-.88,re:-.15,lax:-.7,le:-.8,hy:.48,lk:.48,rk:.20})],
 [p({rwx:.15,rwz:-.35,bodyY:-.29,bodyX:-.06,bodyZ:-.04,lean:-.07,hipYaw:-.35,twist:-.70,rax:-.56,ray:-1.18,re:-.8,lax:-.9,le:-1.1,hy:.38,lk:.48,rk:.22}),
  p({rwx:1.5,rwz:.4,bodyZ:.19,bodyX:.04,bodyY:-.22,lean:.22,hipYaw:.2,twist:.45,rax:-1.4,ray:-.5,re:-.05,lax:-.65,le:-1,hy:-.25}),
  p({rwx:1.2,rwz:.3,bodyZ:.25,bodyX:.08,bodyY:-.27,lean:.25,hipYaw:.39,twist:.83,rax:-1.1,ray:.9,re:-.15,lax:-.75,le:-.9,hy:-.44,lk:.20,rk:.48})],
 [p({rwx:.1,rwz:.3,bodyY:-.24,bodyZ:-.09,lean:-.14,hipYaw:.14,twist:.20,rax:-2.78,ray:.15,re:-.42,lax:-2,le:-.7,hx:-.10,hy:-.08,lk:.42,rk:.35}),
  p({rwx:1.55,rwz:-.35,bodyZ:.24,bodyY:-.28,lean:.28,hipYaw:-.10,twist:-.13,rax:-1.5,ray:0,re:-.1,lax:-.7,le:-1,hx:.12}),
  p({rwx:1.3,rwz:-.25,bodyZ:.29,bodyY:-.36,lean:.37,hipYaw:-.14,twist:-.18,rax:-1.2,ray:-.05,re:-.15,lax:-.5,le:-.6,hx:.08,lk:.53,rk:.32})]
];
export function morrowStrikePose(move){
 const [wind,contact,follow]=cuts[Math.min(2,Math.max(0,(move.chain||1)-1))];
 const active=move.active||1,end=move.startup+active+move.recovery,frame=Math.max(0,Math.min(end,move.frame));
 if(frame>=end)return {...morrowStance};
 // Legs and hips begin driving while the sword is still loaded. Acceleration
 // comes late, then the heavy blade takes time to decelerate and return.
 // The hips lead into the whip while the blade is still loaded; the shared schedule holds the wind-up, whips in two frames and locks the cut at contact.
 const drive=mix(wind,contact,.5);drive.hipYaw=contact.hipYaw*.9;
 const brace=mix(follow,morrowStance,.68);
 return sampleSchedule(strikeSchedule(move,morrowStance,wind,drive,contact,follow,brace,move.chain===3),frame); // Gravefall's overhead load is its own tell under ?tell=on
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
 // Guard: the greatsword held across the body with both hands, blade angled up along the forearm.
 if(player?.guard){const recoil=Math.min(1,(player.blockStun||0)/.22);return {kind:'guard',pose:rhythmPose(p({lax:-1,le:-1.6,rax:-.7,ray:.25,raz:-.3,re:-.7,rwx:.9,rwz:.15,bodyY:-.28,lean:.12-.18*recoil,bodyZ:-.10*recoil,hx:-.1*recoil,lk:.45,rk:.42}),time,.3)};}
 if(player?.anim==='hurt')return {kind:'hurt',pose:recoilPose(p({bodyY:-.25,bodyZ:-.12,lean:-.24,twist:-.2,hx:-.3,laz:.4,raz:-.3}),morrowStance,player.animTime,player.hitstop)};
 if(player?.anim==='charge')return {kind:'charge',pose:p({bodyY:-.26,lean:-.08,laz:.4,raz:-.3,le:-1,re:-.65})};
 if(player?.anim==='run')return {kind:'run',pose:morrowMovePose(motion?motion.forward:player.prev?.x??1,motion?motion.side:player.prev?.z||0,phase)};
 return {kind:'idle',pose:rhythmPose(p({bodyY:-.19+Math.sin(time*1.8)*.006,twist:.14+Math.sin(time*1.3)*.014}),time,.7)};
}
// Specials: the greatsword loads over the shoulder and comes through two-handed; the charge technique drives low behind it.
export const morrowSpecials={special:[{rax:-.3,re:-1.2,lax:-.2,le:-.9,twist:.3,hipYaw:.2,lean:-.08,bodyY:-.28,rlx:.3,llx:-.14,rk:.5,lk:.3},
  {rax:-1.3,re:-.2,lax:-.8,le:-.6,twist:-.3,hipYaw:-.35,lean:.18,bodyZ:.2,bodyY:-.2,llx:-.35,rlx:.4,lk:.4,rk:.15},
  {rax:-1.1,re:-.3,lax:-.7,le:-.6,twist:-.35,hipYaw:-.38,lean:.2,bodyZ:.22,bodyY:-.2,llx:-.35,rlx:.4,lk:.4,rk:.15}],
 technique:[{rax:-.5,lax:-.5,re:-1.4,le:-1.4,twist:.2,hipYaw:.1,lean:-.2,bodyY:-.3,lk:.5,rk:.5},
  {rax:-1.3,lax:-1.3,re:-.3,le:-.3,twist:0,hipYaw:0,lean:.4,bodyZ:.3,bodyY:-.22,llx:-.5,rlx:.4,lk:.5,rk:.1},
  {rax:-1.2,lax:-1.2,re:-.4,le:-.4,lean:.38,bodyZ:.3,bodyY:-.24,llx:-.5,rlx:.4,lk:.5,rk:.1}],
 // ATTACK-TELLS (?tell=on): silhouettes that read from the default camera before the swing.
 // Last Horizon: the greatsword raised high, blade pointing at the sky, chest open and leaning back, the rear knee sinking.
 // Launcher: the blade dropped low behind the hip in a deep crouch, then torn upward.
 tells:{super:{load:{rax:-2.55,ray:.1,raz:-.1,re:-.9,lax:-2.35,laz:.15,le:-.95,rwx:.75,lean:-.28,hx:-.18,bodyY:-.42,bodyZ:-.14,twist:.08,hipYaw:.08,llx:-.38,rlx:.5,lk:.55,rk:1.0},
   peak:{rwx:1.55,rwz:-.35,bodyZ:.26,bodyY:-.34,lean:.36,hipYaw:-.1,twist:-.13,rax:-1.4,ray:0,re:-.1,lax:-.7,le:-1,hx:.14,llx:-.5,rlx:.45,lk:.6,rk:.25},
   follow:{rwx:1.3,rwz:-.25,bodyZ:.3,bodyY:-.4,lean:.4,hipYaw:-.14,twist:-.18,rax:-1.15,re:-.15,lax:-.5,le:-.6,hx:.08,llx:-.5,rlx:.45,lk:.62,rk:.32}},
  launch:{load:{rax:.55,ray:.2,re:-.35,lax:.15,le:-.9,rwx:-.35,twist:.6,hipYaw:.32,lean:.38,hx:.05,bodyY:-.58,bodyZ:-.05,llx:-.65,rlx:.25,lk:1.15,rk:1.0},
   peak:{rax:-2.6,ray:.1,re:-.15,lax:-2.2,le:-.45,rwx:1.1,twist:-.25,hipYaw:-.15,lean:-.18,hx:-.2,bodyY:-.08,bodyZ:.12,llx:-.3,rlx:.3,lk:.12,rk:.2},
   follow:{rax:-2.4,re:-.25,lax:-2,le:-.5,rwx:1,twist:-.3,hipYaw:-.18,lean:-.12,hx:-.15,bodyY:-.12,bodyZ:.1,llx:-.3,rlx:.3,lk:.2,rk:.25}}}};
export function animateMorrow(r,player,time){
 r.footPivot??=(p,kind)=>morrowFootTransition(r,p,kind);r.footOffsets??=rhythmFootOffsets;r.footBall??=new Vector3();r.footBall.set(0,-(r.ankleHeight??.14),.26);
 return animateGroundedRig(r,player,time,'morrow',targetFor,{stance:morrowStance,impact:p({bodyY:-.25,bodyZ:-.12,lean:-.24,twist:-.2,hx:-.3,laz:.4,raz:-.3}),id:'morrow',strikePose:morrowStrikePose,specials:morrowSpecials});
}
