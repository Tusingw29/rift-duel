import {retreatLift} from './retreat-motion.js';
// Full-body authored animation for Tala, the first fighter on the new system.
// Poses are flat channel objects blended toward a target each frame, so idle,
// footwork, strikes, guard and hit reactions flow from the current pose instead
// of snapping back to neutral. Footwork advances with distance travelled, not time.
import {sampleClip} from './pose-clips.js';
import {CHANNELS,STRIDE,applyPose,plantSupportFeet} from './rig-pose.js';
import {travelTarget,travelMotion,staggerPose,reversalPose,isDown,downPose,risePose,flightPose,landingAbsorb,RISE_TIME,LANDING_TIME,strikeSchedule,sampleSchedule,travelOverlay,squatPose,getUpPose,recoilPose,grapplePose,launchedPose,rollPose,victoryPose,aerialStrikePose} from './grounded-animation.js';
import {clipMovePose} from './locomotion-clips.js';
import {rhythmFootOffsets,rhythmPose} from './footwork.js';
export {CHANNELS,STRIDE,applyPose,plantSupportFeet} from './rig-pose.js';

const pose=o=>Object.fromEntries(CHANNELS.map(k=>[k,o[k]??0]));
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const snapOut=t=>{t=Math.max(0,Math.min(1,t));return 1-(1-t)**3;};
// Boxer's guard: left foot forward, fists up, chin down.
// Boxer's ready stance: fists at chin height in front of the chest, elbows in, palms facing each other,
// knuckles toward the rival (wrist rolls found by measuring the hand frame, see tests/tala-fists.test.mjs).
// Lead (left) fist a little extended at jaw height, rear fist upright by the chin, elbows down and in.
export const stance=pose({lc:.08,rc:.06,lax:-.8,lay:.2,laz:.3,le:-1.3,lw:1.9,rax:-.6,ray:-.2,raz:-.1,re:-2.1,rw:-2.1,twist:-.18,lean:.06,hx:.08,hy:.1,llx:-.18,llz:.1,rlx:.2,rlz:-.12,lk:.28,rk:.22,bodyY:-.15});
// Crossed forearms shield the upper torso. The arms use their full authored
// yaw/roll channels so entry and release share the normal pose transition.
// Hand targets in chest space: (+.22,.50,.34), (-.22,.50,.43).
export const guard=pose({lc:.14,rc:.14,lax:-.946199,lay:1.495107,laz:-.452465,le:-.948834,lw:1.85,rax:-1.054423,ray:-1.564860,raz:.610214,re:-.669577,rw:-1.9,twist:-.1,lean:.16,hx:.42,neckY:-.055,neckZ:-.035,llx:-.22,llz:.22,rlx:.22,rlz:-.22,lk:.42,rk:.4,bodyY:-.18});
export const charge=pose({lc:-.06,rc:-.06,lax:.25,laz:.45,le:-.6,rax:.25,raz:-.45,re:-.6,lean:-.08,hx:-.18,llx:-.1,llz:.32,rlx:.1,rlz:-.32,lk:.38,rk:.38,bodyY:-.12});
// Impact snap: head whips back, chest arcs, rear foot catches the weight.
export const impact=pose({lc:-.12,rc:-.12,hx:-.5,hz:.1,lean:-.38,twist:.28,lax:-.35,laz:.65,le:-.5,lw:1.2,rax:-.15,raz:-.6,re:-.4,rw:-1.2,rlx:.6,rlz:-.1,llx:.25,rk:.35,lk:.1,bodyZ:-.22,bodyY:-.12});
// Three-hit combo: right straight, left cross, stepping right hook.
const tracks={
 1:{wind:pose({rc:-.08,lc:.08,twist:.45,hipYaw:.3,rax:.3,raz:-.1,re:-1.6,rw:-2.1,lax:-.85,le:-1.25,lw:1.9,lean:-.04,hy:-.1,rlx:.32,rlz:-.12,llx:-.18,llz:.1,lk:.25,rk:.55,bodyY:-.28}),
    strike:pose({rc:.32,lc:.04,twist:-.52,hipYaw:-.55,rax:-1.78,ray:.62,raz:-.12,re:-.03,rw:-3.1,lax:-.95,laz:.2,le:-1.35,lw:1.9,lean:.3,hx:-.06,hy:.36,rlx:.55,rlz:-.08,rk:.1,llx:-.36,llz:.1,lk:.42,bodyZ:.18,bodyY:-.17}),
    follow:pose({rc:.30,lc:.04,twist:-.57,hipYaw:-.52,rax:-1.6,ray:.6,raz:-.15,re:-.25,rw:-3.1,lax:-.95,laz:.2,le:-1.3,lw:1.9,lean:.3,hx:-.04,hy:.4,rlx:.55,rlz:-.08,rk:.1,llx:-.36,llz:.1,lk:.42,bodyZ:.2,bodyY:-.17})},
 2:{wind:pose({lc:-.08,rc:.08,twist:-.5,hipYaw:-.32,lax:.25,laz:.1,le:-1.6,lw:1.9,rax:-.8,re:-1.3,rw:-2.1,lean:-.04,hy:.12,llx:-.1,llz:.1,rlx:.25,rlz:-.12,lk:.55,rk:.3,bodyY:-.28}),
    strike:pose({lc:.32,rc:.04,twist:.52,hipYaw:.55,lax:-1.78,lay:-.66,laz:.12,le:-.03,lw:-3.1,rax:-1,raz:-.2,re:-1.35,rw:-2.1,lean:.3,hx:-.06,hy:-.38,llx:-.45,llz:.06,lk:.32,rlx:.48,rlz:-.1,rk:.16,bodyZ:.2,bodyY:-.17}),
    follow:pose({lc:.30,rc:.04,twist:.58,hipYaw:.52,lax:-1.6,lay:-.65,laz:.15,le:-.25,lw:-3.1,rax:-1,raz:-.2,re:-1.3,rw:-2.1,lean:.3,hy:-.42,llx:-.45,llz:.06,lk:.32,rlx:.48,rlz:-.1,rk:.16,bodyZ:.22,bodyY:-.12})},
 3:{wind:pose({rc:-.10,lc:.08,twist:.6,hipYaw:.35,rax:-.45,ray:-.5,raz:-.3,re:-1.85,rw:-2.1,lax:-.9,le:-1.3,lw:1.9,lean:.02,hy:-.2,rlx:.3,rlz:-.14,llx:-.15,llz:.12,lk:.5,rk:.65,bodyY:-.3}),
    strike:pose({rc:.22,lc:.06,twist:-.75,hipYaw:-.55,rax:-1.3,ray:1.15,raz:-.45,re:-.95,rw:-2,lax:-.85,laz:.25,le:-1.3,lw:1.9,lean:.26,side:.1,hx:-.1,hy:.5,llx:-.55,llz:.08,lk:.3,rlx:.2,rlz:-.12,rk:.3,bodyZ:.36,bodyY:-.10}),
    follow:pose({rc:.24,lc:.06,twist:-.85,hipYaw:-.58,rax:-1.15,ray:1.35,raz:-.5,re:-1.05,rw:-2,lax:-.85,laz:.25,le:-1.3,lw:1.9,lean:.28,side:.12,hx:-.08,hy:.52,llx:-.55,llz:.08,lk:.3,rlx:.2,rlz:-.12,rk:.3,bodyZ:.4,bodyY:-.10})}
};
const mix=(a,b,t)=>Object.fromEntries(CHANNELS.map(k=>[k,a[k]+(b[k]-a[k])*t]));
// Keyed strike timeline: windup eases in, the hit snaps out, the follow-through
// settles, and the recovery returns to stance under control.
export function strikePose(move){
 const track=tracks[Math.min(3,Math.max(1,move.chain||1))],active=move.active||1,end=move.startup+active+move.recovery;
 const hand=move.chain===2?'l':'r',sign=move.chain===2?1:-1;
 const drive=pose({...mix(track.wind,track.strike,.74),hipYaw:track.strike.hipYaw*.98,bodyX:sign*.065});
 const retract=pose({...mix(track.follow,stance,.6),[hand+'e']:-1.5,[hand+'ax']:-.85,bodyX:-sign*.035,bodyY:-.19});
 // Shared schedule: held wind-up, two-frame whip, locked contact through the hitstop, open follow-through, retract.
 if(move.frame>=end)return stance;
 return sampleSchedule(strikeSchedule(move,stance,track.wind,drive,track.strike,track.follow,retract),move.frame);
}
// Basic ranged fire: gather at the rear hip, drive the palm from the floor,
// carry the shoulder past release, then recover behind the lead hand.
// These are original keys; the projectile still fires on the combat startup frame.
export function shotPose(move){
 const wind=pose({...stance,twist:.32,hipYaw:.16,rax:.18,ray:-.12,re:-1.65,
  bodyY:-.24,bodyZ:-.08,lean:-.03,hx:.14,hy:-.16,lk:.32,rk:.48});
 const release=pose({...stance,twist:-.48,hipYaw:-.22,rax:-1.64,ray:.42,raz:-.12,re:-.1,
  lax:-.9,le:-1.4,bodyY:-.14,bodyZ:.14,lean:.18,hx:.04,hy:.24,neckY:-.015,lk:.4,rk:.16});
 const follow=pose({...release,twist:-.56,hipYaw:-.25,rax:-1.55,re:-.22,bodyZ:.18,hy:.28});
 const gather=pose({...stance,rax:-.85,re:-1.5,bodyY:-.19,twist:-.28,hipYaw:-.06});
 const end=move.startup+(move.active||1)+move.recovery;
 const keys=[[0,stance,smooth],[move.startup*.55,wind,smooth],[move.startup,release,snapOut],
  [move.startup+(move.active||1)+move.recovery*.2,follow,smooth],
  [move.startup+(move.active||1)+move.recovery*.65,gather,smooth],[end,stance,smooth]];
 const frame=Math.max(0,Math.min(end,move.frame));if(frame>=end)return stance;
 let i=1;while(i<keys.length-1&&frame>keys[i][0])i++;
 const [a,from]=keys[i-1],[b,to,ease]=keys[i];return mix(from,to,ease((frame-a)/(b-a||1)));
}
// Signature variants retain their combat identities: wider paired releases
// for follow-ups and deeper compression for the larger stock projectiles.
export function specialPose(move){
 const disc=move.kind==='back';
 const wind=pose({...stance,bodyY:-.25,hipYaw:disc?-.22:.18,twist:disc?-.48:.35,
  lax:disc?-.9:.2,lay:disc?.6:0,le:-1.55,rax:.15,re:-1.6,lean:-.08,hy:disc?.24:-.18});
 const release=pose({...stance,bodyY:-.17,bodyZ:disc?-.1:.18,hipYaw:disc?.23:-.12,
  twist:disc?.5:-.12,lean:disc?-.12:.22,hy:disc?-.28:.12,hx:.08,
  lax:disc?-1.4:-1.65,lay:disc?-.7:.12,laz:disc?.18:.08,le:disc?-.2:-.12,
  rax:disc?-.8:-1.65,ray:disc?0:-.12,raz:-.08,re:disc?-1.35:-.12,
  lk:disc?.2:.46,rk:disc?.5:.2});
 if(move.empowered){
  Object.assign(wind,{bodyY:-.32,lean:-.14,neckY:-.025,hx:.18,laz:.32,raz:-.32});
  Object.assign(release,disc?{rax:-1.35,ray:-.18,re:-.45,lax:-1.52,lay:-.55,bodyY:-.22,twist:.35}:
   {bodyY:-.23,bodyZ:.24,lean:.3,lax:-1.75,rax:-1.75,lay:.23,ray:-.23});
 }else if(move.followup){
  Object.assign(wind,{lax:-.25,rax:-.25,le:-1.6,re:-1.6,twist:disc?-.25:.15});
  Object.assign(release,disc?{twist:0,hipYaw:0,hy:0,lax:-1.45,rax:-1.45,lay:-.38,ray:.38,laz:.15,raz:-.15,le:-.18,re:-.18}:
   {twist:0,hipYaw:-.05,hy:0,lay:.25,ray:-.25,bodyZ:.16});
 }
 const follow=pose({...release,twist:release.twist+(disc?.17:-.08),
  lay:disc?release.lay-.2:release.lay,le:disc?-.4:-.25,re:disc?release.re:-.25,bodyY:-.21});
 const end=move.startup+(move.active||1)+move.recovery;
 const keys=[[0,stance,smooth],[move.startup*.55,wind,smooth],[move.startup,release,snapOut],
  [move.startup+(move.active||1)+move.recovery*.25,follow,smooth],[end,stance,smooth]];
 const frame=Math.max(0,Math.min(end,move.frame));if(frame>=end)return stance;
 let i=1;while(i<keys.length-1&&frame>keys[i][0])i++;
 const [a,from]=keys[i-1],[b,to,ease]=keys[i];return mix(from,to,ease((frame-a)/(b-a||1)));
}
// Rush technique keys follow the existing moving hit window. The flying
// portion releases ankle plants; recovery re-establishes support on landing.
export function techniquePose(move){
 const kick=move.effect==='kick',end=move.startup+move.active+move.recovery;
 const wind=pose({...stance,bodyY:-.31,lean:.18,twist:.38,hipYaw:.16,rax:.3,re:-1.6,lk:.6,rk:.55,hx:.16});
 const contact=pose({...stance,bodyY:kick?.28:.18,lean:kick?-.2:.16,twist:kick?-.35:-.5,hipYaw:-.15,
  rax:kick?-.55:-2.55,ray:kick?0:.35,re:kick?-1.2:-.18,lax:-1,le:-1.4,hy:.25,hx:.06,
  rlx:kick?-1.45:.2,rk:kick?.12:.55,llx:kick?.35:-.5,lk:kick?.9:.85});
 const carry=pose({...contact,bodyY:kick?.4:.43,rax:kick?-.65:-2.35,re:kick?-1.3:-.35,twist:-.55,hx:.12});
 const tuck=pose({...stance,bodyY:.2,lean:.1,twist:-.25,lax:-1,rax:-1,le:-1.4,re:-1.4,llx:-.35,rlx:-.25,lk:.8,rk:.75,hx:.18});
 const land=pose({...stance,bodyY:-.29,lean:.2,lk:.6,rk:.55,hx:.2,neckY:-.025});
 const keys=[[0,stance,smooth],[move.startup*.55,wind,smooth],[move.startup,contact,snapOut],
  [move.startup+move.active*.45,carry,smooth],[move.startup+move.active,tuck,smooth],
  [move.startup+move.active+move.recovery*.3,land,smooth],[end,stance,smooth]];
 const frame=Math.max(0,Math.min(end,move.frame));if(frame>=end)return stance;
 let i=1;while(i<keys.length-1&&frame>keys[i][0])i++;
 const [a,from]=keys[i-1],[b,to,ease]=keys[i];return mix(from,to,ease((frame-a)/(b-a||1)));
}
export function launcherPose(move){
 if(move.frame>=move.startup+(move.active||1)+move.recovery)return stance;
 const s={...techniquePose({...move,effect:'rise'})};
 // A grounded uppercut: drive up through the legs without a visual leap.
 s.bodyY=Math.min(-.1,s.bodyY*.3-.1);s.llx=-.2;s.rlx=.25;s.lk=.4;s.rk=.2;
 return s;
}
export function pursuitPose(move){
 const air=pose({...stance,bodyY:0,llx:-.45,rlx:.2,lk:.85,rk:.65,lean:.12});
 const right=pose({...strikePose({chain:1,startup:5,active:1,recovery:14,frame:5}),bodyY:0,llx:-.45,rlx:.2,lk:.85,rk:.65});
 const left=pose({...strikePose({chain:2,startup:5,active:1,recovery:14,frame:5}),bodyY:0,llx:-.25,rlx:-.1,lk:.65,rk:.9});
 const kick=pose({...air,rlx:-1.4,rk:.1,llx:.35,lk:.95,lean:-.2,twist:-.35,hipYaw:-.15,rax:-.6,re:-1.35,hy:.25});
 const start=move.startup,end=start+move.active+move.recovery;
 const keys=[[0,air,smooth],[start,right,snapOut],[start+4,air,smooth],[start+9,left,snapOut],
  [start+13,air,smooth],[start+18,kick,snapOut],[start+move.active+5,air,smooth],[end,stance,smooth]];
 const frame=Math.max(0,Math.min(end,move.frame));if(frame>=end)return stance;
 let i=1;while(i<keys.length-1&&frame>keys[i][0])i++;
 const [a,from]=keys[i-1],[b,to,ease]=keys[i];return mix(from,to,ease((frame-a)/(b-a||1)));
}
export function freeFlightPose(player){
 const recovering=player.anim==='recover',phase=1-Math.min(1,(player.air||0)/.85);
 const tuck=pose({...stance,bodyY:.02,lean:.08,twist:-.22,hx:.15,neckY:-.02,
  lax:-1.05,rax:-.9,le:-1.45,re:-1.5,llx:-.5,rlx:.18,lk:1.05,rk:.8});
 const brace=pose({...tuck,lax:-1.15,lay:.4,laz:-.1,rax:-1.05,ray:-.35,raz:.12,
  le:-1.35,re:-1.4,lean:.18,hx:.32,neckY:-.04,bodyY:-.03,llx:-.35,rlx:.1,lk:.85,rk:.7});
 if(recovering)return brace;
 return pose({...flightPose(stance,player),neckY:-.02});
}
// Contact, compression, passing and push-off poses. The opposite step is
// authored by mirroring the limbs, with chest/hips counter-rotating together.
const stepKeys=[
 {bodyX:-.045,bodyY:-.19,lean:.25,hipYaw:-.12,twist:.02,side:.035,hx:.03,hy:-.08,lax:-.48,rax:-1.02,le:-1.4,re:-1.02,llx:0,rlx:0,lk:.66,rk:.12},
 {bodyX:-.065,bodyY:-.27,lean:.34,hipYaw:-.02,twist:-.10,side:.065,hx:.09,hy:.02,lax:-.62,rax:-.9,le:-1.48,re:-1.12,llx:-.43,rlx:.42,lk:.54,rk:.28},
 {bodyX:-.025,bodyY:-.20,lean:.31,hipYaw:.15,twist:-.4,side:.025,hx:.035,hy:.19,lax:-1.03,rax:-.38,le:-1.1,re:-1.52,llx:-.65,rlx:.65,lk:.16,rk:.95},
 {bodyX:.025,bodyY:-.16,lean:.23,hipYaw:.18,twist:-.43,side:-.02,hx:-.015,hy:.22,lax:-1.08,rax:-.3,le:-1.02,re:-1.45,llx:-.32,rlx:.32,lk:.08,rk:.8}
].map(k=>pose({...stance,...k}));
const mirrorStep=s=>pose({...s,bodyX:-s.bodyX,hipYaw:-s.hipYaw,twist:-.36-s.twist,side:-s.side,hy:.1-s.hy,
 lax:s.rax,rax:s.lax,le:s.re,re:s.le,llx:s.rlx,rlx:s.llx,lk:s.rk,rk:s.lk});
const steps=[...stepKeys,...stepKeys.map(mirrorStep)];
const motionClip=transform=>{const k=steps.map((s,i)=>[i/8,pose(transform(s,i))]);return [...k,[1,k[0][1]]];};
const advanceClip=motionClip(s=>s);
const retreatClip=motionClip(s=>({...s,bodyX:s.bodyX*.7,bodyY:s.bodyY+.035,lean:-.10-(s.lean-.23)*.5,
 llx:-s.llx*.65,rlx:-s.rlx*.65,lax:-.88+(s.lax+.75)*.35,rax:-.65+(s.rax+.65)*.35,twist:-.18+(s.twist+.18)*.65}));
const circleClip=motionClip((s,i)=>({...s,bodyX:s.bodyX*.8,bodyY:s.bodyY+.02,lean:.13,side:.07+s.side,
 hipYaw:s.hipYaw*.5,twist:-.18+(s.twist+.18)*.5,llx:-.1,rlx:.1,llz:.2+s.llx*.4,rlz:.2+s.rlx*.4,
 lax:-.9+(s.lax+.75)*.18,rax:-.65+(s.rax+.65)*.18,le:-1.25,re:-1.35}));
export function movePose(forward,side,phase){
 const captured=clipMovePose(forward,side,phase,stance.bodyY);if(captured)return captured;
 const strafe=Math.abs(side)>Math.abs(forward);
 const s=sampleClip(strafe?circleClip:forward<0?retreatClip:advanceClip,phase/(Math.PI*2),CHANNELS,true);
 if(strafe&&side<0){s.bodyX=-s.bodyX;s.side=-s.side;s.llz=-s.llz;s.rlz=-s.rlz;}
 return s;
}
export function idlePose(t){
 // Weight rhythm shared with the roster (footwork.js); the head and hands breathe on top.
 return pose(rhythmPose({...stance,hx:.08+Math.sin(t*5.2)*.035,lax:stance.lax+Math.sin(t*5.2+1)*.04,rax:stance.rax+Math.sin(t*5.2+2)*.04},t));
}
export function hurtPose(animTime,hitstop){return pose(recoilPose(impact,stance,animTime,hitstop));} // frame-one snap and hitstop shudder shared with the roster
export function guardPose(blockStun){const recoil=Math.min(1,blockStun/.22);return mix(guard,pose({...guard,lean:.04,hx:.58,neckY:-.075,neckZ:-.065,bodyZ:-.14,le:guard.le-.05,re:guard.re-.05,rlx:.4}),recoil);}
// Which states the sample handles; everything else falls back to the shared animator.
export function targetFor(p,t,stridePhase=p?.stridePhase||0,motion=null){
 if(!p)return {pose:idlePose(t),rate:8,kind:'idle'};
 const move=p.move;
 if(move?.kind==='strike')return {pose:move.reversal?reversalPose(move,strikePose):strikePose(move),rate:34,kind:'strike'};
 const travel=travelTarget(p,stance,strikePose);if(travel)return {pose:travel.pose,rate:34,kind:travel.kind};
 if(p.staggerState&&!move&&!p.air)return {pose:pose(staggerPose(stance,impact,p.staggerState)),rate:18,kind:'stagger'};
 if(move?.kind==='shot'&&!p.air)return {pose:shotPose(move),rate:34,kind:'shot'};
 if(['forward','back'].includes(move?.kind)&&!p.air)return {pose:specialPose(move),rate:34,kind:move.kind};
 if(move?.kind==='technique'&&['rise','kick'].includes(move.effect)&&!p.air)return {pose:techniquePose(move),rate:34,kind:'technique'};
 if(move?.kind==='launch'&&!p.air)return {pose:launcherPose(move),rate:34,kind:'launch'};
 if(move?.kind==='pursuit'&&move.aerial)return {pose:pursuitPose(move),rate:34,kind:'aerial'};
 if(!move&&!p.launched&&['jump','recover','idle','run'].includes(p.anim)&&(p.air>0||(p.airMotion?.height||0)>.01))return {pose:freeFlightPose(p),rate:20,kind:'freeFlight'};
 if(!move&&p.anim==='recover'&&!p.air)return {pose:idlePose(t),rate:12,kind:'idle'};
 if(move||p.air>0||p.roll||['knockdown','defeat','victory','launch','roll','jump','recover','pursuit','jumpAttack'].includes(p.anim))return null;
 if(p.guard)return {pose:pose(rhythmPose(guardPose(p.blockStun||0),t,.4)),rate:20,kind:'guard'};
 if(p.anim==='hurt')return {pose:hurtPose(p.animTime||0,p.hitstop),rate:p.animTime>.38?Infinity:16,kind:'hurt'};
 if(p.anim==='charge')return {pose:charge,rate:14,kind:'charge'};
 if(p.anim==='run')return {pose:movePose(motion?motion.forward:p.prev?.x??1,motion?motion.side:p.prev?.z||0,stridePhase),rate:13,kind:'run'};
 return {pose:idlePose(t),rate:8,kind:'idle'};
}
export function advanceStride(r,p){
 if(!p||!Number.isFinite(p.x)||!Number.isFinite(p.z))return r.stridePhase||0;
 if(r.lastPos&&(p.anim==='run'||p.travel||p.move?.travel)){const d=Math.hypot(p.x-r.lastPos[0],p.z-r.lastPos[1]);r.stridePhase=(r.stridePhase||0)+Math.min(d,.5)/((r.strideLength||STRIDE)*(r.gaitTargets&&Math.abs(p.prev?.z||0)>Math.abs(p.prev?.x||0)?.65:1))*Math.PI;}
 // Keep the step phase when stopping so a brief pause does not restart the gait.
 r.lastPos=[p.x,p.z];return r.stridePhase||0;
}
export function blendPose(current,target,rate,dt){
 if(!current||rate===Infinity)return {...target};
 const a=1-Math.exp(-rate*dt),head=1-Math.exp(-rate*.55*dt);
 return Object.fromEntries(CHANNELS.map(k=>[k,current[k]+(target[k]-current[k])*(k[0]==='h'&&k.length===2?head:a)]));
}
// Returns true when the sample system handled this frame.
export function animateTala(r,p,time){
 const dt=Math.max(0,Math.min(.1,r.lastTime===undefined?0:time-r.lastTime));r.lastTime=time;r.footOffsets??=rhythmFootOffsets;
 const motion=travelMotion(p,r.lastPos);
 if(p)advanceStride(r,p);
 let target=null;
 if(p?.anim==='jumpSquat'&&!p.move)target={kind:'squat',rate:Infinity,pose:pose(squatPose(stance,p))};
 else if(p?.anim==='getUp'&&!p.move)target={kind:'rise',rate:Infinity,pose:pose(getUpPose(r,stance,p))};
 else if(p?.anim==='grapple')target={kind:'grapple',rate:Infinity,pose:pose(grapplePose(stance,p.animTime||0,'actor'))};
 else if(p?.anim==='grappled')target={kind:'grapple',rate:Infinity,pose:pose(grapplePose(stance,p.animTime||0,'victim'))};
 else if(p?.anim==='victory')target={kind:'victory',rate:20,pose:pose(victoryPose(stance,'tala',p.animTime,time))};
 else target=targetFor(p,time,p?.stridePhase??r.stridePhase??0,motion);
 if(!target&&p?.launched&&(p.air||0)>0&&!p.move)target={kind:'launched',rate:Infinity,pose:pose(launchedPose(r,stance,p))};
 if(!target&&p?.anim==='roll'&&p.roll)target={kind:'roll',rate:Infinity,pose:pose(rollPose(r,stance,p))};
 if(!target&&p?.move&&(p.air||0)>0&&!p.launched&&!['pursuit','jumpAttack'].includes(p.move.kind))target={kind:'aerial',rate:Infinity,pose:pose(aerialStrikePose(stance,p,strikePose))};
 if(!target&&isDown(p)){if(r.wasLaunched)r.downFromAir=true;target=p.getUp?{kind:'rise',rate:Infinity,pose:pose(getUpPose(r,stance,p))}:{kind:'knockdown',rate:Infinity,pose:pose(downPose(r,stance,impact,p,time,!!r.downFromAir))};}else r.downFromAir=false;
 r.wasLaunched=target?.kind==='launched';
 if(target&&(p?.travel||p?.move?.travel))target.pose=pose(travelOverlay(target.pose,p,motion));
 if(r.freeFlight&&target?.kind!=='freeFlight'&&target&&!p?.move&&['idle','run','guard'].includes(target.kind))r.landingTime=0;
 r.freeFlight=target?.kind==='freeFlight';
 if(r.landingTime!==undefined){
  r.landingTime+=dt;
  if(r.landingTime>=LANDING_TIME||!target||p?.move)delete r.landingTime;
  else if(['idle','run','guard'].includes(target.kind)){target.pose=landingAbsorb(target.pose,r.landingTime);target.pose.neckY-=.015*Math.sin(Math.PI*r.landingTime/LANDING_TIME);}
 }
 if(r.wasDown&&target&&['idle','run','guard','charge'].includes(target.kind))r.riseTime=0;
 r.wasDown=target?.kind==='knockdown';
 const travelling=p?.move?.travel&&p.move.frame<p.move.startup&&!p.move.aerial&&target?.kind==='strike';
 let plantKind=travelling?'run':target?.kind;
 if(r.riseTime!==undefined&&target){
  r.riseTime+=dt;const u=r.riseTime/RISE_TIME;
  if(u>=1||p?.move||target.kind==='knockdown')delete r.riseTime;
  else{target={...target,pose:pose(risePose(r,target.pose,u))};plantKind='rise';}
 }
 if(target?.kind==='back'&&p.move?.retreatTravel)target.pose.bodyY+=retreatLift(p.move)*.8;
 if(target?.kind==='run'&&r.gaitTargets){
  // Fighting steps keep the hands ready; avoid the large jogging arm pump.
  for(const key of ['lax','rax','le','re','lw','rw'])target.pose[key]=stance[key]+(target.pose[key]-stance[key])*.22;
  target.pose.lean*=.6;target.pose.side*=.7;
 }
 if(r.combatRig&&['idle','run'].includes(target?.kind)){target.pose.lax-=.10;target.pose.rax-=.10;target.pose.le-=.40;target.pose.re-=.40;}
 if(!target){r.pose=null;r.strikeBlend=null;r.footPlants=null;r.flowBlend=null;r.gaitPlants=null;return false;}
 // Blend the entry offset out by contact, then follow the combat timeline exactly.
 // Smoothing every strike frame delays the fist beyond the frame that deals damage.
 if(['strike','shot','forward','back','technique','launch','aerial','leap'].includes(target.kind)){
  r.flowBlend=null;
  const m=p.move,previous=r.strikeBlend,variant=m.empowered?'stock':m.followup?'followup':'base';
  if(!previous||previous.move!==m||m.frame<previous.frame||previous.variant!==variant){
   const from=r.pose||target.pose;
   r.strikeBlend={move:m,frame:m.frame,variant,startFrame:previous?.move===m&&previous.variant!==variant?m.frame:0,offset:Object.fromEntries(CHANNELS.map(k=>[k,from[k]-target.pose[k]]))};
  }
  const start=r.strikeBlend.startFrame,entryEnd=m.travel?Math.min(start+3,m.startup):m.startup,entry=m.frame>=entryEnd?0:1-smooth((m.frame-start)/Math.max(1,entryEnd-start));
  r.pose=Object.fromEntries(CHANNELS.map(k=>[k,target.pose[k]+r.strikeBlend.offset[k]*entry]));
  r.strikeBlend.frame=m.frame;
 }else{
  r.strikeBlend=null;
  // Blend only the change of action: repeated low-pass smoothing shrinks the
  // run cycle and makes the body trail behind the feet at fighting speed.
  const dir=motion||{forward:p?.prev?.x||0,side:p?.prev?.z||0},direction=target.kind==='run'?`${Math.sign(dir.forward)},${Math.sign(dir.side)}`:'';
  const key=target.kind+direction;
  if(!r.flowBlend||r.flowBlend.key!==key){
   r.flowBlend={key,elapsed:0,offset:Object.fromEntries(CHANNELS.map(k=>[k,(r.pose||target.pose)[k]-target.pose[k]]))};
  }
  r.flowBlend.elapsed+=dt;
  const duration=target.kind==='run'?.1:target.kind==='idle'?.16:.08;
  const remaining=target.rate===Infinity?0:1-smooth(r.flowBlend.elapsed/duration);
  r.pose=Object.fromEntries(CHANNELS.map(k=>[k,target.pose[k]+r.flowBlend.offset[k]*remaining]));
 }
 // Ponytail and head trail the chest turn slightly.
 if(dt>0){const twistVelocity=(r.pose.twist-(r.prevTwist??r.pose.twist))/dt;r.prevTwist=r.pose.twist;const retention=Math.exp(-13.4*dt);r.twistLag=(r.twistLag||0)*retention+twistVelocity*.1*(1-retention);}else r.twistLag=r.twistLag||0;
 r.lastPose=r.pose;applyPose(r,r.pose);
 if(target.kind==='charge')r.body.position.y+=Math.sin(time*30)*.008;
 const technique=target.kind==='technique',m=p?.move;
 const flying=technique&&m.frame>=m.startup&&m.frame<m.startup+m.active;
 if(technique&&m.frame>=m.startup+m.active){
  r.g.updateMatrixWorld(true);
  if(r.techniqueLanding?.move!==m){
   const anchors=[0,1].map(i=>r.feet?r.feet[i].getWorldPosition(r.g.position.clone()):r.knees[i].localToWorld(r.g.position.clone().set(0,-(r.legLength||.48),0)));
   r.techniqueLanding={move:m,anchors};
  }
  const u=smooth((m.frame-m.startup-m.active)/Math.max(1,m.recovery*.3)),ground=r.g.position.y+(r.ankleHeight??.14)*r.g.scale.y;
  r.footPlants=r.techniqueLanding.anchors.map(at=>{const v=at.clone();v.y=ground+Math.max(0,at.y-ground)*(1-u);return v;});
 }else r.techniqueLanding=null;
 plantSupportFeet(r,p,technique?(flying?'flight':'strike'):target.kind==='launch'?'strike':target.kind==='aerial'?(p.air>0?'flight':'strike'):target.kind==='freeFlight'&&p.air>.6&&(p.airMotion?.height||0)<.16?'strike':plantKind);
 // Small delayed neck response lets the head settle after the ribcage turns.
 // Guard keeps its deliberate chin tuck even when an impact checks the torso.
 if(dt>0){const velocity=(r.pose.lean-(r.prevLean??r.pose.lean))/dt;r.prevLean=r.pose.lean;const retention=Math.exp(-14*dt);r.neckLag=(r.neckLag||0)*retention+Math.max(-.08,Math.min(.08,velocity*.035))*(1-retention);}
 r.head.rotation.x-=(r.neckLag||0)*(target.kind==='guard'?.2:1);
 r.head.rotation.y-=Math.max(-.16,Math.min(.16,r.twistLag*.6));
 for(let i=0;i<r.clothParts.length;i++){const part=r.clothParts[i];part.rotation.x=Math.sin(time*3+i)*.08+(target.kind==='run'?.2:0);part.rotation.z=Math.sin(time*2.3+i)*.07-r.twistLag*(i===0?1.5:.6);if(i===0&&r.ponytailMaxAngle!==undefined)part.rotation.z=Math.max(-r.ponytailMaxAngle,Math.min(r.ponytailMaxAngle,part.rotation.z));}
 return true;
}
