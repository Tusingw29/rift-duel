import {CHANNELS,STRIDE,applyPose,plantSupportFeet} from './rig-pose.js';
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const snapOut=t=>{t=Math.max(0,Math.min(1,t));return 1-(1-t)**3;};
const mix=(a,b,t)=>Object.fromEntries(CHANNELS.map(k=>[k,a[k]+(b[k]-a[k])*t]));
const sampleKeys=(keys,u)=>{let i=1;while(i<keys.length-1&&u>keys[i][0])i++;const [a,from]=keys[i-1],[b,to,ease]=keys[i];return mix(from,to,(ease||smooth)((u-a)/(b-a||1)));};
// ---- EZ-01 handoff: authored body motion over the simulation's travel paths. The root
// position belongs to combat-travel.js; these poses only add load, drive, flight and landing.
// Ground pursuit: a low loaded push-off that drives into the fighter's first strike on the contact frame.
export function pursuitTravelPose(m,stance,strikePose){
 const s=stance;
 const load={...s,bodyY:s.bodyY-.14,bodyZ:-.06,lean:.3,hx:-.12,twist:s.twist+.15,llx:-.65,rlx:.45,lk:.55,rk:.25,lax:s.lax+.35,rax:s.rax+.3,le:s.le-.2,re:s.re-.2};
 const drive={...load,bodyY:s.bodyY-.08,bodyZ:.08,lean:.38,hipYaw:.1,llx:.3,rlx:-.6,lk:.2,rk:.6,lax:s.lax+.1,rax:s.rax+.15};
 const contact=strikePose({...m,chain:1,frame:m.startup});
 if(m.frame<m.startup)return sampleKeys([[0,s],[.35,load],[.8,drive],[1,contact,snapOut]],m.frame/m.startup);
 return strikePose({...m,chain:1});
}
// Crossover / leap strike: crouch, tucked flight with the arms gathering, extension, then the overhead strike lands.
export function leapPose(m,stance,strikePose){
 const s=stance,side=m.travel?.side||0;
 const crouch={...s,bodyY:s.bodyY-.25,lean:.25,hx:-.05,llx:-.5,rlx:-.3,lk:.8,rk:.8,lax:s.lax+.4,rax:s.rax+.4,le:s.le-.2,re:s.re-.2};
 const tuck={...s,bodyY:s.bodyY+.05,lean:-.05,twist:side*.3,hx:.1,llx:-1,rlx:-.8,lk:1.5,rk:1.3,lax:-.9,rax:-.9,laz:.5,raz:-.5,le:-.8,re:-.8};
 const extend={...s,bodyY:s.bodyY,lean:.3,twist:side*.1,hx:.2,llx:-.4,rlx:.3,lk:.3,rk:.5,lax:-2.2,rax:-2.2,laz:.2,raz:-.2,le:-.3,re:-.3};
 const contact=strikePose({...m,chain:3,frame:m.startup});
 if(m.frame<m.startup)return sampleKeys([[0,s],[.22,crouch],[.5,tuck],[.8,extend],[1,contact,snapOut]],m.frame/m.startup);
 return strikePose({...m,chain:3});
}
// Hit reaction. The simulation's hurt timer counts DOWN from HURT_TIME; the body snaps into the
// impact, overshoots a touch deeper as the weight catches, then settles back to stance.
export const HURT_TIME=.42;
export function recoilPose(impact,stance,animTime){
 const elapsed=Math.max(0,HURT_TIME-Math.min(HURT_TIME,animTime||0));
 const deeper=mix(impact,stance,-.18);
 return sampleKeys([[0,mix(stance,impact,.7),snapOut],[.07,deeper,snapOut],[.16,impact,smooth],[HURT_TIME,stance,smooth]],elapsed);
}
// Stagger (EZ-03): the guard is broken and the fighter reels, knees buckled, head lolling, swaying on
// planted feet. Each recovery tap straightens the body a step; the opening closes with a snap to stance.
export function staggerPose(stance,impact,s){
 const e=s.elapsed||0,taps=Math.min(3,s.inputs||0),upright=taps/3,fade=Math.min(1,(s.remaining||0)/.3);
 const sway=Math.sin(e*7.5)*(.09-.06*upright)*fade,nod=Math.sin(e*5.2+1)*(.12-.08*upright)*fade;
 const base=mix(impact,stance,.45+.45*upright);
 return {...base,bodyY:stance.bodyY-.16+.1*upright,bodyX:sway*.6,side:sway,lean:base.lean-.18+.16*upright,twist:base.twist+Math.sin(e*3.1)*.08*fade,
  hx:.28+nod-.2*upright,hz:sway*1.4,neckY:-.03,lk:.62-.3*upright,rk:.58-.3*upright,llz:.14,rlz:-.14,
  lax:stance.lax+.35-.3*upright,rax:stance.rax+.35-.3*upright,laz:.5-.3*upright,raz:-.5+.3*upright,le:-.35,re:-.35};
}
// Third-hit reversal (EZ-04): the return strike drives forward out of the guard with the hips leading.
export function reversalPose(m,strikePose){
 const s=strikePose({...m,chain:1}),u=Math.min(1,m.frame/Math.max(1,m.startup));
 return {...s,bodyZ:s.bodyZ+.14*u,lean:s.lean+.1*u,hx:s.hx+.06*u,bodyY:s.bodyY-.04*(1-u)};
}
export function travelTarget(player,stance,strikePose){
 const m=player?.move;if(!m||!m.travel)return null;
 if(m.kind==='pursuit'&&!m.aerial)return {kind:'strike',pose:pursuitTravelPose(m,stance,strikePose)};
 if(m.kind==='jumpAttack')return {kind:'leap',pose:leapPose(m,stance,strikePose)};
 return null;
}
// Direction of actual travel in the fighter's lock-on frame (x toward the rival, z circling), from the simulation's displacement.
export function travelMotion(player,previous){
 if(!player?.travel||!previous||!Number.isFinite(player.lookX))return null;
 const dx=player.x-previous[0],dz=player.z-previous[1];if(Math.hypot(dx,dz)<1e-6)return null;
 const forward=dx*player.lookX+dz*player.lookZ,side=-dx*player.lookZ+dz*player.lookX,len=Math.hypot(forward,side)||1;
 return {forward:forward/len,side:side/len};
}
export function animateGroundedRig(r,player,time,prefix,targetFor){
 const dt=Math.max(0,Math.min(.1,r[`${prefix}Time`]===undefined?0:time-r[`${prefix}Time`]));r[`${prefix}Time`]=time;
 if(Number.isFinite(player?.x)&&Number.isFinite(player?.z)){
  if(r[`${prefix}Pos`]&&player.anim==='run')r.stridePhase=(r.stridePhase||0)+Math.min(.5,Math.hypot(player.x-r[`${prefix}Pos`][0],player.z-r[`${prefix}Pos`][1]))/STRIDE*Math.PI;
  r[`${prefix}Pos`]=[player.x,player.z];
 }
 const motion=travelMotion(player,r[`${prefix}Last`]);r[`${prefix}Last`]=Number.isFinite(player?.x)?[player.x,player.z]:null;
 const target=targetFor(player,time,player?.stridePhase??r.stridePhase??0,motion);
 if(!target){r[`${prefix}Pose`]=null;r[`${prefix}Entry`]=null;r.footPlants=null;r.gaitPlants=null;return false;}
 const move=player?.move,dir=motion||{forward:player?.prev?.x||0,side:player?.prev?.z||0},key=target.kind+(target.kind==='run'?`${Math.sign(dir.forward)},${Math.sign(dir.side)}`:'');
 const old=r[`${prefix}Entry`];
 if(!old||old.key!==key||target.kind==='strike'&&(old.move!==move||move.frame<old.frame))r[`${prefix}Entry`]={key,move,frame:move?.frame,elapsed:0,offset:Object.fromEntries(CHANNELS.map(k=>[k,(r[`${prefix}Pose`]||target.pose)[k]-target.pose[k]]))};
 const entry=r[`${prefix}Entry`];entry.elapsed+=dt;entry.frame=move?.frame;
 const entryFrames=move?.travel?Math.min(3,move.startup):move?.startup;
 const weight=1-smooth(['strike','leap'].includes(target.kind)&&move?move.frame/Math.max(1,entryFrames):entry.elapsed/(target.kind==='run'?.1:.14));
 r[`${prefix}Pose`]=Object.fromEntries(CHANNELS.map(k=>[k,target.pose[k]+entry.offset[k]*weight]));
 r.lastPose=r[`${prefix}Pose`];applyPose(r,r[`${prefix}Pose`]);plantSupportFeet(r,player,target.kind);
 // Cloth follows the authored body turn; sampling a frozen time is deterministic.
 for(const cloth of r.clothParts){cloth.rotation.x=.04+Math.sin(time*2)*.035+(target.kind==='run'?.2:0);cloth.rotation.z=-r[`${prefix}Pose`].twist*.13;}
 return true;
}
