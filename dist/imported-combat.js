// MOCAP-COMBAT: real captured strikes on the grounded rig, retargeted onto the simulation's frame timing.
// A clip (scripts/mocap/bvh-to-channels.mjs --mode strike) is one punch from wind-up to settle with its impact marked.
// Piecewise time warp onto the move: [clip start .. impact] -> [0 .. startup] (wind-up curve adjustable),
// impact held through the active frames (and the hitstop, which stops the move frame), [impact .. end] ->
// [startup+active .. total]. The fist therefore lands on the exact damage frame from dist/combat.js.
// Retarget: the arms, spine and head keep the athlete's motion but are rescaled per channel so the capture's impact
// lands on the fighter's authored contact pose (aimed at the rival and covered by tests); the hips and both ankles
// come straight from the capture, scaled to the rig's legs, and step back home through the recovery. The simulation
// still owns the root; the chain advance is absorbed by the shared foot hook (footwork.js) exactly as for authored.
import * as talaStrike1 from './clips/combat/tala-strike1.js';
import * as talaStrike2 from './clips/combat/tala-strike2.js';
import * as talaStrike3 from './clips/combat/tala-strike3.js';
import {CHANNELS} from './rig-pose.js';
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export const COMBAT_CLIPS={tala:{strike:{1:talaStrike1,2:talaStrike2,3:talaStrike3}}};
// Tuning, shared with the animation workbench (dist/anim-workbench.html), which edits it live and exports it.
//  windup: exponent on the wind-up warp (1 linear; above 1 holds the load longer and whips later)
//  impactShift: moves the clip's impact mark by this fraction of the clip (positive = later in the capture)
//  bodyLead: frames the hips and feet read ahead of the arms before contact (the kinetic chain's pelvis lead)
//  reach: scale on the captured hip and ankle travel (1 = the athlete's own, in the rig's leg lengths)
//  lean: additive chest lean through the strike (radians, peaks at impact)
//  returnStart: fraction of the recovery after which the feet and hips step home
export const combatTuning={windup:1.15,impactShift:0,bodyLead:2,reach:1,lean:0,returnStart:.45};
export const LEG=1.12; // rig leg length (thigh + shin) the clip lengths are scaled to; Tala's graphic rig is 0.56 + 0.56
export function combatClip(fighter,move){
 if(!move||move.kind!=='strike'||move.travel||move.aerial)return null;
 return COMBAT_CLIPS[fighter]?.strike?.[Math.max(1,Math.min(3,move.chain||1))]||null;
}
const impactU=clip=>Math.max(.05,Math.min(.95,clip.meta.impact+combatTuning.impactShift));
// The warp. Returns the clip position u (0..1) for a simulation move frame.
export function clipU(move,clip,frame=move.frame){
 const s=Math.max(1,move.startup),a=move.active||1,R=Math.max(1,move.recovery),ui=impactU(clip);
 if(frame<=s)return ui*Math.pow(Math.max(0,frame)/s,combatTuning.windup);
 if(frame<s+a)return ui;
 return ui+(1-ui)*Math.min(1,(frame-s-a)/R);
}
function sample(keys,u){
 if(u<=keys[0][0])return keys[0];if(u>=keys.at(-1)[0])return keys.at(-1);
 let i=1;while(i<keys.length-1&&u>keys[i][0])i++;
 const [a,pa,xa]=keys[i-1],[b,pb,xb]=keys[i],t=(u-a)/((b-a)||1e-6),lerp=(x,y)=>x+(y-x)*t,arr=(p,q)=>p.map((v,k)=>lerp(v,q[k]));
 const p={};for(const k of CHANNELS)p[k]=lerp(pa[k]??0,pb[k]??0);
 return [u,p,{hip:arr(xa.hip,xb.hip),l:arr(xa.l,xb.l),r:arr(xa.r,xb.r),lc:t<.5?xa.lc:xb.lc,rc:t<.5?xa.rc:xb.rc}];
}
const UPPER=['lean','twist','side','hx','hy','hz','lax','lay','laz','rax','ray','raz','le','re','lc','rc','hipYaw'];
// Arms and torso: the capture's motion mapped so its start is the stance and its impact is the authored contact.
// Where the capture barely moves a channel (or moves it the opposite way) the athlete's motion is added as is.
export function combatPose(move,clip,stance,contact,frame=move.frame){
 const u=clipU(move,clip,frame),k0=clip.keys[0][1],ki=sample(clip.keys,impactU(clip))[1],ku=sample(clip.keys,u)[1];
 const out={...stance};
 for(const k of UPPER){
  const span=ki[k]-k0[k],target=(contact[k]??stance[k])-stance[k],d=ku[k]-k0[k];
  out[k]=Math.abs(span)>.15&&Math.sign(span)===Math.sign(target)&&Math.abs(target)>.05?stance[k]+d*Math.max(.25,Math.min(2.5,target/span)):stance[k]+d;
 }
 // Wrists and fists keep the authored values (the capture has no hand bones worth retargeting).
 for(const k of ['lw','rw','lwx','lwz','rwx','rwz'])out[k]=frame<move.startup?stance[k]+((contact[k]??stance[k])-stance[k])*Math.pow(u/impactU(clip),2):contact[k]??stance[k];
 const peak=Math.sin(Math.PI*Math.min(1,u/(2*impactU(clip))));out.lean+=combatTuning.lean*peak;out.hx-=combatTuning.lean*peak*.6;
 return out;
}
// Hips and feet, in the shape the shared foot hook and pose use (weight-transfer.js): offsets from the stance in the
// fighter's frame (x right, z toward the rival). Read with the lower-body lead before contact.
export function combatWeight(move,clip,frame){
 const s=move.startup,f=frame??(move.frame<s?Math.min(s,move.frame+Math.min(combatTuning.bodyLead,move.frame)):move.frame);
 const end=s+(move.active||1)+move.recovery;if(f>=end)return null;
 const k0=clip.keys[0][2],cur=sample(clip.keys,clipU(move,clip,f))[2],last=clip.keys.at(-1)[2],sc=LEG*combatTuning.reach;
 const rel=(p,q)=>[(p[0]-q[0])*sc,Math.max(0,p[1]-q[1])*sc,(p[2]-q[2])*sc];
 let hip=rel(cur.hip,k0.hip),L=rel(cur.l,k0.l),Rr=rel(cur.r,k0.r);hip[1]=(cur.hip[1]-k0.hip[1])*sc;
 // Step home through the late recovery: hips and feet return to the stance; a foot travelling home lifts.
 const r0=s+(move.active||1)+move.recovery*combatTuning.returnStart,back=f>r0?smooth((f-r0)/Math.max(1,end-r0)):0;
 const lift=Math.sin(Math.PI*back);
 const home=(v,endV)=>{const d=Math.hypot(endV[0],endV[2]);return [v[0]*(1-back),Math.max(v[1]*(1-back),d>.03?Math.min(.08,d*.3)*lift:0),v[2]*(1-back)];};
 const eL=rel(last.l,k0.l),eR=rel(last.r,k0.r);
 if(back>0){hip=[hip[0]*(1-back),hip[1]*(1-back),hip[2]*(1-back)];L=home(L,eL);Rr=home(Rr,eR);}
 return {bodyX:hip[0],bodyY:hip[1],bodyZ:hip[2],lean:0,lead:{x:L[0],y:L[1],z:L[2]},rear:{x:Rr[0],y:Rr[1],z:Rr[2]},feet:[{x:L[0],y:L[1],z:L[2]},{x:Rr[0],y:Rr[1],z:Rr[2]}]};
}
export const combatMeta=()=>Object.fromEntries(Object.entries(COMBAT_CLIPS).map(([id,set])=>[id,Object.fromEntries(Object.entries(set.strike).map(([c,m])=>[c,m.meta]))]));
