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
// ---- Falls, ground impact and rising. Timings and shapes measured from CMU 90_18 (pulled over backward:
// 0.5 s from standing to the floor, legs thrown up and arms flung out at impact, head whip, a short bounce,
// then flat) and CMU 77_18 (getting up from the back: roll to the side, knee under, push up).
export const KNOCKDOWN_TIME=.55,RISE_TIME=.45;
// The rig's root sits at the floor under the feet with the hips 2*legLength+ankle above it, so a root pitch swings
// the whole body about the feet. These helpers place the hips where a pose wants them (height, and forward offset
// from the simulation position) for a given pitch.
const hipHeight=r=>2*(r.legLength||.56)+(r.ankleHeight??.14);
// A yaw before the pitch rolls a lying body about its own spine (Euler XYZ applies the yaw first), so `turn` is the roll onto the side.
const root=(r,pitch,hipY,hipZ,turn=0)=>{const P=hipHeight(r);return {bodyPitch:pitch,bodyRoll:0,hipYaw:turn,bodyY:hipY-P*Math.cos(pitch),bodyZ:hipZ-P*Math.sin(pitch)};};
export function knockdownPose(r,stance,impact,elapsed){
 const s=stance;
 const hit={...impact,bodyY:s.bodyY-.02,lean:-.25,hx:-.4,lax:-1.2,rax:-1.1,laz:.45,raz:-.45,le:-.9,re:-.9,lk:.3,rk:.28,bodyPitch:-.08};
 const topple={...s,...root(r,-.55,hipHeight(r)-.3,-.25),twist:0,side:0,lean:-.3,hx:-.35,llx:-.5,rlx:-.3,llz:.12,rlz:-.12,lk:.25,rk:.2,lax:-2.1,rax:-2.0,laz:.5,raz:-.5,le:-.6,re:-.6};
 const slam={...s,...root(r,-1.45,.3,-.5),twist:0,side:0,lean:.3,hx:.7,llx:-.7,rlx:-.55,llz:.18,rlz:-.18,lk:.1,rk:.1,lax:-1.0,rax:-1.0,laz:.95,raz:-.95,le:-1.0,re:-1.0};
 const bounce={...slam,...root(r,-1.47,.34,-.52),lean:.1,hx:-.15,llx:-.4,rlx:-.3,lk:.3,rk:.25,le:-1.2,re:-1.2};
 const settle={...slam,...root(r,-1.5,.24,-.55),lean:0,hx:-.12,side:.05,llx:-.35,rlx:-.3,llz:.16,rlz:-.16,lk:.4,rk:.35,lax:-.3,rax:-.25,laz:1.1,raz:-1.1,le:-1.3,re:-1.3};
 return sampleKeys([[0,hit,snapOut],[.12,topple,smooth],[.27,slam,snapOut],[.36,bounce,smooth],[KNOCKDOWN_TIME,settle,smooth]],Math.max(0,Math.min(KNOCKDOWN_TIME,elapsed)));
}
// The simulation's knockdown timer counts DOWN from KNOCKDOWN_TIME; a defeat timer counts up and the body stays down, breathing.
export const downElapsed=player=>player.anim==='defeat'?(player.animTime||0):KNOCKDOWN_TIME-Math.min(KNOCKDOWN_TIME,player.animTime||0);
export function downPose(r,stance,impact,player,time){
 const p=knockdownPose(r,stance,impact,downElapsed(player));
 if(player.anim==='defeat'&&(player.animTime||0)>KNOCKDOWN_TIME){const b=Math.sin(time*1.6)*.015;p.lean+=b;p.bodyY+=b*.4;}
 return p;
}
export const isDown=player=>!!player&&['knockdown','defeat'].includes(player.anim)&&!player.launched&&!(player.air>0)&&!player.move;
// Getting up (visual only, the simulation is already standing): roll onto the side, knee under the hips,
// push up into a low crouch, then into whatever the fighter is doing.
export function risePose(r,target,u){
 const s=target;
 const down={...s,...root(r,-1.5,.24,-.55),twist:0,lean:0,hx:-.12,side:.05,llx:-.35,rlx:-.3,llz:.16,rlz:-.16,lk:.4,rk:.35,lax:-.3,rax:-.25,laz:1.1,raz:-1.1,le:-1.3,re:-1.3};
 const roll={...down,...root(r,-1.15,.36,-.45,.55),lean:.3,side:.25,hx:.3,llx:-.9,rlx:-.3,lk:1.5,rk:.8,lax:.3,rax:-1.4,laz:.3,raz:-.4,le:-1.6,re:-1.1};
 const kneel={...s,...root(r,-.35,.75,-.25,.15),twist:.1,lean:.6,side:.1,hx:.2,llx:.1,rlx:-1.5,llz:.2,rlz:-.1,lk:2.0,rk:1.4,lax:.2,rax:-.9,laz:.4,raz:-.5,le:-1.0,re:-1.2};
 const crouch={...s,bodyPitch:0,bodyRoll:0,hipYaw:0,bodyY:s.bodyY-.22,bodyZ:-.06,lean:.4,hx:-.05,llx:-.7,rlx:-.45,lk:1.3,rk:1.15,lax:s.lax+.3,rax:s.rax+.3,le:s.le-.2,re:s.re-.2};
 return sampleKeys([[0,down],[.3,roll],[.6,kneel],[.85,crouch],[1,s,snapOut]],Math.max(0,Math.min(1,u)));
}
// ---- Jumps. From CMU 13_11 (standing forward jump) and 75_01 (running jump): legs extend through the push-off
// with the arms swung up, the knees fold to a tuck at the top, then the legs reach down and the arms open for balance.
export function flightPose(stance,player){
 const s=stance,phase=1-Math.min(1,(player.air||0)/.85);
 // Knees stay a little bent at take-off and touchdown: the root is at floor height on those frames, so straight legs would push the feet under it.
 const launch={...s,bodyY:s.bodyY+.05,lean:.1,hx:-.1,llx:-.3,rlx:-.05,lk:.45,rk:.5,lax:-1.0,rax:-.95,laz:.25,raz:-.25,le:-1.3,re:-1.3,twist:s.twist*.5};
 const tuck={...s,bodyY:s.bodyY+.05,lean:.05,hx:.12,llx:-.55,rlx:-.3,lk:1.05,rk:.85,lax:-.75,rax:-.7,laz:.35,raz:-.35,le:-1.1,re:-1.1,twist:s.twist*.5};
 const reach={...s,bodyY:s.bodyY+.06,lean:.15,hx:.2,llx:-.52,rlx:-.42,lk:.9,rk:.85,lax:-.35,rax:-.3,laz:.5,raz:-.5,le:-.9,re:-.9,twist:s.twist*.5};
 return sampleKeys([[0,launch],[.3,tuck],[.72,tuck],[1,reach]],phase);
}
// Landing: the knees take the weight over 0.22 s (13_11 drops the pelvis 0.2 and folds the knees past 1.4 rad).
export const LANDING_TIME=.22;
export function landingAbsorb(pose,t){const a=Math.sin(Math.PI*Math.max(0,Math.min(1,t/LANDING_TIME)));return {...pose,bodyY:pose.bodyY-.2*a,lk:pose.lk+.35*a,rk:pose.rk+.3*a,lean:pose.lean+.18*a,hx:pose.hx+.1*a,lax:pose.lax+.2*a,rax:pose.rax+.2*a};}
// Wind-up load (CMU 02_05, 14_01): before a punch the rear knee bends and the body drops while the hips counter-rotate;
// the fist only leaves the chamber in the last third of the startup.
export function rearLoad(stance,wind,contact){
 const rear=stance.rlx>stance.llx?'r':'l',front=rear==='r'?'l':'r';
 return {...wind,bodyY:wind.bodyY-.05,[rear+'k']:wind[rear+'k']+.25,[front+'k']:wind[front+'k']+.08,hipYaw:wind.hipYaw-contact.hipYaw*.2};
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
export function animateGroundedRig(r,player,time,prefix,targetFor,poses){
 const dt=Math.max(0,Math.min(.1,r[`${prefix}Time`]===undefined?0:time-r[`${prefix}Time`]));r[`${prefix}Time`]=time;
 if(Number.isFinite(player?.x)&&Number.isFinite(player?.z)){
  if(r[`${prefix}Pos`]&&player.anim==='run')r.stridePhase=(r.stridePhase||0)+Math.min(.5,Math.hypot(player.x-r[`${prefix}Pos`][0],player.z-r[`${prefix}Pos`][1]))/STRIDE*Math.PI;
  r[`${prefix}Pos`]=[player.x,player.z];
 }
 const motion=travelMotion(player,r[`${prefix}Last`]);r[`${prefix}Last`]=Number.isFinite(player?.x)?[player.x,player.z]:null;
 let target=targetFor(player,time,player?.stridePhase??r.stridePhase??0,motion);
 if(!target&&poses&&isDown(player))target={kind:'knockdown',pose:downPose(r,poses.stance,poses.impact,player,time)};
 if(!target&&poses&&!player?.move&&!player?.launched&&(player?.air||0)>0&&['jump','recover','idle','run'].includes(player?.anim))target={kind:'flight',pose:flightPose(poses.stance,player)};
 if(!target){r[`${prefix}Pose`]=null;r[`${prefix}Entry`]=null;r[`${prefix}Kind`]=null;r.footPlants=null;r.gaitPlants=null;return false;}
 // Leaving the floor plays the rise; coming back from the air plays the landing. Both are visual overlays on the simulation's state.
 const prevKind=r[`${prefix}Kind`];r[`${prefix}Kind`]=target.kind;
 if(prevKind==='knockdown'&&['idle','run','guard','charge'].includes(target.kind))r[`${prefix}Rise`]={elapsed:0};
 if(prevKind==='flight'&&['idle','run','guard'].includes(target.kind))r[`${prefix}Landing`]=0;
 if(r[`${prefix}Landing`]!==undefined){r[`${prefix}Landing`]+=dt;if(r[`${prefix}Landing`]>=LANDING_TIME||player?.move||target.kind==='flight')delete r[`${prefix}Landing`];else target={...target,pose:landingAbsorb(target.pose,r[`${prefix}Landing`])};}
 const rise=r[`${prefix}Rise`];let plantKind=target.kind;
 if(rise){rise.elapsed+=dt;const u=rise.elapsed/RISE_TIME;if(u>=1||player?.move||target.kind==='knockdown')delete r[`${prefix}Rise`];else{target={...target,pose:risePose(r,target.pose,u)};plantKind='rise';}}
 const move=player?.move,dir=motion||{forward:player?.prev?.x||0,side:player?.prev?.z||0},key=target.kind+(target.kind==='run'?`${Math.sign(dir.forward)},${Math.sign(dir.side)}`:'');
 const old=r[`${prefix}Entry`];
 if(!old||old.key!==key||target.kind==='strike'&&(old.move!==move||move.frame<old.frame))r[`${prefix}Entry`]={key,move,frame:move?.frame,elapsed:0,offset:Object.fromEntries(CHANNELS.map(k=>[k,(r[`${prefix}Pose`]||target.pose)[k]-target.pose[k]]))};
 const entry=r[`${prefix}Entry`];entry.elapsed+=dt;entry.frame=move?.frame;
 const entryFrames=move?.travel?Math.min(3,move.startup):move?.startup;
 const weight=1-smooth(['strike','leap'].includes(target.kind)&&move?move.frame/Math.max(1,entryFrames):entry.elapsed/(target.kind==='run'?.1:.14));
 r[`${prefix}Pose`]=Object.fromEntries(CHANNELS.map(k=>[k,target.pose[k]+entry.offset[k]*weight]));
 r.lastPose=r[`${prefix}Pose`];applyPose(r,r[`${prefix}Pose`]);plantSupportFeet(r,player,plantKind);
 // Cloth follows the authored body turn; sampling a frozen time is deterministic.
 for(const cloth of r.clothParts){cloth.rotation.x=.04+Math.sin(time*2)*.035+(target.kind==='run'?.2:0);cloth.rotation.z=-r[`${prefix}Pose`].twist*.13;}
 return true;
}
