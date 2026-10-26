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
export function recoilPose(impact,stance,animTime,hitstop){
 const elapsed=Math.max(0,HURT_TIME-Math.min(HURT_TIME,animTime||0));
 const deeper=mix(impact,stance,-.18);
 // Frame one is the full impact bend (no blend-in); hitstop carries a high-frequency shudder for the first 0.1 s.
 const p=sampleKeys([[0,impact,snapOut],[.07,deeper,snapOut],[.16,impact,smooth],[HURT_TIME,stance,smooth]],elapsed);
 if(hitstop>0)p.bodyX+=.025*(hitstop%2?1:-1);else if(hitstop===undefined&&elapsed<.1)p.bodyX+=.025*(Math.floor(elapsed*60+1e-6)%2?1:-1); // no counter (review fixtures): shudder on the hurt clock instead
 return p;
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
export function knockdownPose(r,stance,impact,elapsed,fromAir=false){
 const s=stance;
 const hit={...impact,bodyY:s.bodyY+.03,lean:-.25,hx:-.4,lax:-1.2,rax:-1.1,laz:.45,raz:-.45,le:-.9,re:-.9,llx:s.llx-.1,rlx:s.rlx+.1,lk:.3,rk:.28,bodyPitch:-.08};
 const topple={...s,...root(r,-.55,hipHeight(r)-.22,-.25),twist:0,side:0,lean:-.3,hx:-.35,llx:-.5,rlx:-.3,llz:.12,rlz:-.12,lk:.25,rk:.2,lax:-2.1,rax:-2.0,laz:.5,raz:-.5,le:-.6,re:-.6};
 const slam={...s,...root(r,-1.45,.3,-.5),twist:0,side:0,lean:.3,hx:.7,llx:-.7,rlx:-.55,llz:.18,rlz:-.18,lk:.1,rk:.1,lax:-1.0,rax:-1.0,laz:.95,raz:-.95,le:-1.0,re:-1.0};
 const bounce={...slam,...root(r,-1.47,.34,-.52),lean:.1,hx:-.15,llx:-.4,rlx:-.3,lk:.3,rk:.25,le:-1.2,re:-1.2};
 const settle={...slam,...root(r,-1.5,.24,-.55),lean:0,hx:-.12,side:.05,llx:-.35,rlx:-.3,llz:.16,rlz:-.16,lk:.4,rk:.35,lax:-.3,rax:-.25,laz:1.1,raz:-1.1,le:-1.3,re:-1.3};
 // Down by 0.35 s: the simulation spends the last GET_UP_FRAMES of its 0.55 s knockdown getting up (player.getUp), which getUpPose handles.
 // Stage 3 ground impact and whiplash: the upper back and pelvis hit first (slam), then the head, arms and heels whip
 // down two to three frames later; stage 4 a secondary bounce lifts hips and chest 15–20 cm with the limbs splaying.
 const whiplash={...slam,hx:-.5,lax:-.2,rax:-.15,laz:1.2,raz:-1.2,le:-.6,re:-.6,llx:-.15,rlx:-.1,lk:.2,rk:.15,lean:.05};
 const rebound={...settle,...root(r,-1.48,.42,-.55),lean:.2,hx:.2,llx:-.55,rlx:-.4,lk:.5,rk:.45,llz:.3,rlz:-.3,lax:-.6,rax:-.5,laz:1.3,raz:-1.3,le:-.9,re:-.9};
 if(fromAir)return sampleKeys([[0,slam,snapOut],[.05,whiplash,smooth],[.1,rebound,smooth],[.18,settle,smooth],[KNOCKDOWN_TIME,settle,smooth]],Math.max(0,Math.min(KNOCKDOWN_TIME,elapsed)));
 return sampleKeys([[0,hit,snapOut],[.1,topple,smooth],[.2,slam,snapOut],[.25,whiplash,smooth],[.3,rebound,smooth],[.36,settle,smooth],[KNOCKDOWN_TIME,settle,smooth]],Math.max(0,Math.min(KNOCKDOWN_TIME,elapsed)));
}
// The simulation's knockdown timer counts DOWN from KNOCKDOWN_TIME; a defeat timer counts up and the body stays down, breathing.
export const downElapsed=player=>player.anim==='defeat'?(player.animTime||0):KNOCKDOWN_TIME-Math.min(KNOCKDOWN_TIME,player.animTime||0);
export function downPose(r,stance,impact,player,time,fromAir=false){
 const p=knockdownPose(r,stance,impact,downElapsed(player),fromAir);
 if(player.anim==='defeat'&&(player.animTime||0)>KNOCKDOWN_TIME){const b=Math.sin(time*1.6)*.015;p.lean+=b;p.bodyY+=b*.4;}
 return p;
}
export const isDown=player=>!!player&&['knockdown','defeat'].includes(player.anim)&&!player.launched&&!(player.air>0)&&!player.move;
// Getting up (visual only, the simulation is already standing): roll onto the side, knee under the hips,
// push up into a low crouch, then into whatever the fighter is doing.
export function risePose(r,target,u){
 const s=target;
 const down={...s,...root(r,-1.5,.24,-.55),twist:0,lean:0,hx:-.12,side:.05,llx:-.35,rlx:-.3,llz:.16,rlz:-.16,lk:.4,rk:.35,lax:-.3,rax:-.25,laz:1.1,raz:-1.1,le:-1.3,re:-1.3};
 // Stage 5: roll onto the side and plant a hand (elbow straight, arm down to the stone). Stage 6: knee under the hips,
 // the planted hand and foot bear the weight, the torso rises over the planted foot, and the body comes up into guard.
 const roll={...down,...root(r,-1.15,.36,-.45,.55),lean:.3,side:.25,hx:.3,llx:-.9,rlx:-.3,lk:1.5,rk:.8,lax:.3,rax:-1.4,laz:.3,raz:-.4,le:-1.6,re:-1.1};
 const handPlant={...s,...root(r,-.7,.55,-.35,.35),twist:.15,lean:.55,side:.2,hx:.25,llx:-.2,rlx:-1.3,llz:.25,rlz:-.1,lk:1.9,rk:1.5,lax:.9,laz:.6,le:-.05,rax:-.6,raz:-.5,re:-1.2};
 const kneel={...s,...root(r,-.3,.75,-.25,.15),twist:.1,lean:.6,side:.1,hx:.2,llx:.1,rlx:-1.5,llz:.2,rlz:-.1,lk:2.0,rk:1.4,lax:.6,laz:.4,le:-.2,rax:-.9,raz:-.5,re:-1.2};
 const push={...s,bodyPitch:0,bodyRoll:0,hipYaw:0,bodyY:s.bodyY-.3,bodyZ:-.1,lean:.5,hx:-.05,llx:-.9,rlx:-.3,lk:1.5,rk:1.2,llz:.15,rlz:-.1,lax:s.lax+.4,rax:s.rax+.3,le:s.le-.3,re:s.re-.2};
 return sampleKeys([[0,down],[.25,roll],[.45,handPlant],[.65,kneel],[.85,push],[1,s,snapOut]],Math.max(0,Math.min(1,u)));
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
// ---- Strike schedule shared by every fighter: the wind-up is held until two frames before contact, a two-frame
// whip reaches the contact pose exactly on the startup frame, the extension is locked for the hitstop (up to four
// frames after the active window), then the follow-through stays open and the retract settles. Sprite-sheet timing:
// held extremes, one or two frames of motion between them.
// Kinetic chain. Every strike and special is built from a load, a peak and a follow into seven full-body keys:
//  1 coil      back foot loads, hips and chest twist away, arms and wrists cocked (the load)
//  2 drive     lead foot plants and the hips and chest whip toward the rival while the arms still trail at the load
//  3 whip      clavicles, shoulders and elbows unhinge across the arc (arms half way, wrists still cocked)
//  4 impact    full extension on the startup frame, held through the hitstop
//  5 overshoot the weapon's weight pulls chest and shoulders past the line; knees absorb
//  6 recovery  hips settle first, the arms haul the weight back
//  7 stance
// and sampled with a per-segment lead so the feet and pelvis arrive two frames before the arms, the spine one.
const SEG={lower:['bodyX','bodyY','bodyZ','hipYaw','llx','llz','rlx','rlz','lk','rk'],spine:['lean','twist','side'],clav:['lc','rc'],arms:['lax','lay','laz','rax','ray','raz','le','re'],wrists:['lw','rw','lwx','lwz','rwx','rwz'],head:['hx','hy','hz','neckY','neckZ']};
const LEAD={lower:2,spine:1,clav:.5,arms:0,wrists:0,head:0};
const pick=(from,to,segs)=>{const o={...from};for(const s of segs)for(const k of SEG[s])o[k]=to[k];return o;};
export function kineticKeys(move,stance,load,peak,follow){
 const active=move.active||1,end=move.startup+active+move.recovery,s=move.startup;
 const coilAt=Math.max(.5,s*.35),driveAt=Math.max(coilAt+.5,Math.min(s*.7,s-1.5)),whipAt=Math.max(driveAt+.5,s-1);
 const hold=s+active+Math.min(4,Math.max(1,move.recovery*.3));
 const drive=pick(load,mix(load,peak,.85),['lower','spine']);
 const whip={...pick(mix(load,peak,.55),peak,['lower','spine','clav'])};for(const k of SEG.wrists)whip[k]=load[k]+(peak[k]-load[k])*.3;
 const overshoot={...follow,twist:follow.twist*1.1,lean:follow.lean+.05,lk:follow.lk+.12,rk:follow.rk+.12,bodyY:follow.bodyY-.03};
 const recovery=pick(mix(follow,stance,.6),mix(follow,stance,.75),['lower']);
 const keys=[[0,stance,smooth],[coilAt,load,smooth],[driveAt,drive,smooth]];
 if(s-2>driveAt+.25)keys.push([s-2,drive,smooth]); // long startups: hips and chest driven, arms still trailing at the load
 keys.push([whipAt,whip,snapOut],[s,peak,snapOut],[hold,peak,smooth],[s+active+move.recovery*.45,overshoot,smooth],[s+active+move.recovery*.78,recovery,smooth],[end,stance,smooth]);
 return keys;
}
// Same signature as before so every animator keeps calling it; drive and retract are now derived from the chain.
export function strikeSchedule(move,stance,wind,drive,contact,follow,retract){return kineticKeys(move,stance,wind,contact,follow);}
function sampleAt(keys,frame){
 const end=keys.at(-1)[0];frame=Math.max(0,Math.min(end,frame));if(frame>=end)return keys.at(-1)[1];
 let i=1;while(i<keys.length-1&&frame>keys[i][0])i++;const [a,from]=keys[i-1],[b,to,ease]=keys[i];return mix(from,to,(ease||smooth)((frame-a)/(b-a||1)));
}
export function sampleSchedule(keys,frame){
 const base=sampleAt(keys,frame),out={...base};
 for(const [seg,lead] of Object.entries(LEAD)){if(!lead)continue;const ahead=sampleAt(keys,frame+lead);for(const k of SEG[seg])out[k]=ahead[k];}
 // The head counters the chest turn to keep the eyes on the rival.
 out.hy=base.hy-(out.twist-keys[0][1].twist)*.25;
 return out;
}
// ---- Travel burst and brake. combat-travel paths ease in and out; the body pushes off into the acceleration and
// counter-leans with bent knees and a wide plant on the brake, so a travelling fighter is never a statue on a dolly.
export function travelOverlay(pose,player,motion){
 const path=player?.travel||player?.move?.travel;if(!path||!path.frames||player?.move?.aerial)return pose;
 const u=Math.min(1,(path.frame||0)/path.frames),accel=1-2*u;
 // The brake shows through the last third of the path and is gone by the final frame, where a pursuit's authored contact pose must be exact.
 const w=u<.85?1:1-smooth((u-.85)/.15),push=Math.max(0,accel)*w,brake=Math.max(0,-accel)*w,a=accel*w;
 const dir=motion||{forward:1,side:0},out={...pose};
 out.lean+=.22*a*dir.forward;out.hx-=.08*a*dir.forward;out.side-=.18*a*dir.side;out.hipYaw+=.1*a*dir.side;
 out.bodyY-=.07*push+.1*brake;out.lk+=.25*brake;out.rk+=.25*brake;out.llz+=.1*brake;out.rlz-=.1*brake;
 return out;
}
// ---- Frame-bound jump squat and get-up (the simulation's jumpSquat and getUp states). Progress reads a frame
// counter if the state carries one, else the countdown timer; without either the pose sits mid-way.
export const JUMP_SQUAT_FRAMES=4,GET_UP_FRAMES=12;
const stateProgress=(player,frames,key)=>{const st=key&&player[key];if(st&&Number.isFinite(st.frame))return Math.max(0,Math.min(1,st.frame/(st.frames||frames)));const total=frames/60;if(Number.isFinite(player.stateFrame))return Math.max(0,Math.min(1,player.stateFrame/frames));if(Number.isFinite(player.animTime)&&player.animTime>=0&&player.animTime<=total+1e-6&&player.animTime!==undefined&&('animTime' in player))return 1-player.animTime/total;return .5;};
export function squatPose(stance,player){const s=stance,u=stateProgress(player,JUMP_SQUAT_FRAMES,'jumpSquat');const crouch={...s,bodyY:s.bodyY-.22,lean:.3,hx:-.1,llx:-.45,rlx:-.2,lk:1.0,rk:.9,lax:s.lax+.5,rax:s.rax+.5,le:s.le-.3,re:s.re-.3};return mix(s,crouch,smooth(u));}
export function getUpPose(r,stance,player){return risePose(r,stance,stateProgress(player,GET_UP_FRAMES,'getUp'));}
// ---- Specials on the grounded rig. One loaded/peak/follow triple per fighter covers shot, launch, forward and back
// (the old shared animator used one pose per fighter for all of them too), with per-kind body modifiers; techniques
// have their own triple plus effect overrides. Same schedule as strikes: held load, two-frame whip, locked peak.
const kindModifiers={
 shot:{wind:{bodyY:-.06,lean:-.05},peak:{lean:.22,bodyZ:.14},follow:{lean:.2,bodyZ:.1}},
 launch:{wind:{bodyY:-.12,lean:.1,lk:.5,rk:.5},peak:{lean:-.12,bodyY:.08,bodyZ:.12,lk:.08,rk:.08,hx:-.2},follow:{lean:-.08,bodyY:.04,bodyZ:.1,hx:-.15}},
 forward:{wind:{bodyY:-.1,bodyZ:-.06,lean:.1},peak:{bodyZ:.32,lean:.35,hx:.1,llx:-.55,rlx:.4,lk:.45,rk:.15},follow:{bodyZ:.3,lean:.3,llx:-.55,rlx:.4,lk:.45,rk:.15}},
 back:{wind:{bodyZ:.05,lean:.05},peak:{bodyZ:-.25,lean:-.15,hx:-.1,llx:-.2,rlx:.5,lk:.3,rk:.45},follow:{bodyZ:-.2,lean:-.1,rlx:.5,rk:.45}}
};
const effectOverrides={
 kick:{rlx:-1.55,rk:0,llx:.3,lk:.45,bodyY:.1,lean:-.3,rax:.5,raz:-.3,hx:-.1},
 lance:{lax:-1.6,rax:-1.6,le:-.2,re:-.2,laz:.1,raz:-.1,lean:.25,bodyZ:.2},
 fan:{laz:.8,raz:-.8,lax:-1.0,rax:-1.0,le:-.3,re:-.3},
 rise:{lax:-2.4,rax:-2.4,le:-.2,re:-.2,lean:-.2,bodyY:.05,hx:-.25},
 sphere:{lax:-1.2,rax:-1.2,laz:.3,raz:-.3,le:-.9,re:-.9,lean:.1},
 wheel:{lax:-2.0,rax:-2.0,laz:.5,raz:-.5,le:-.5,re:-.5,lean:.1,bodyY:.04},
 drive:{rax:-1.8,re:-.1,lax:-.6,lean:.5,bodyZ:.3,llx:-.5,rlx:.45,lk:.45,rk:.1},
 charge:{rax:-1.3,lax:-1.3,re:-.3,le:-.3,lean:.4,bodyZ:.3,llx:-.5,rlx:.4,lk:.5,rk:.1}
};
const spinning=effect=>['spin','fan','wheel'].includes(effect);
export function specialPose(move,stance,specials){
 const triple=(move.kind==='technique'?specials.technique:specials.special)||specials.special;
 let wind={...stance,...triple[0]},peak={...stance,...triple[1]},follow={...stance,...triple[2]||triple[1]};
 const mod=kindModifiers[move.kind];if(mod){wind={...wind,...mod.wind};peak={...peak,...mod.peak};follow={...follow,...mod.follow};}
 const fx=move.kind==='technique'&&effectOverrides[move.effect];if(fx){peak={...peak,...fx};follow={...follow,...fx};}
 const drive=mix(wind,peak,.6),retract=mix(follow,stance,.6);
 const out=sampleSchedule(strikeSchedule(move,stance,wind,drive,peak,follow,retract),move.frame);
 // Spinning techniques turn the whole body through their active window (one turn, two on the follow-up).
 if(move.kind==='technique'&&spinning(move.effect)&&move.frame>=move.startup){const active=move.active||1,u=Math.min(1,(move.frame-move.startup)/active);out.hipYaw+=u*Math.PI*2*(move.followup?2:1);}
 return out;
}
// Being launched: a backward tumble about the hips (the simulation lifts the root), limbs thrown, ending as the fall begins.
export function launchedPose(r,stance,player){
 // Stage 1 lift-off: pelvis snaps up, spine arches back, limbs trail toward the floor. Stage 2 apex fold: the torso
 // curls as gravity takes over and the limbs trail upward. Stage 3: back-first toward the floor, a full turn and a
 // quarter in all so the slam that follows starts on the back.
 const t=1-Math.min(1,(player.air||0)/.85),P=hipHeight(r),pitch=-smooth(t)*Math.PI*2.5;
 const lift={...stance,lean:-.5,hx:-.45,lax:.4,rax:.3,laz:.35,raz:-.35,le:-.4,re:-.4,llx:.35,rlx:.2,lk:.3,rk:.25,twist:0,side:0,hipYaw:0};
 const fold={...stance,lean:.45,hx:.3,lax:-1.9,rax:-1.7,laz:.6,raz:-.6,le:-.9,re:-.9,llx:-1.2,rlx:-.8,lk:1.1,rk:.8,llz:.15,rlz:-.15,twist:.1,side:0,hipYaw:0};
 const back={...stance,lean:-.15,hx:-.25,lax:-1.4,rax:-1.2,laz:.9,raz:-.9,le:-1.0,re:-1.0,llx:-.7,rlx:-.45,lk:.5,rk:.4,llz:.18,rlz:-.18,twist:0,side:0,hipYaw:0};
 const body=sampleKeys([[0,lift,smooth],[.35,fold,smooth],[.7,fold,smooth],[1,back,smooth]],t);
 return {...body,...root(r,pitch,P,0)};
}
// Evasive roll: tucked, one full turn about the hips over 0.3 s; forward rolls pitch, side rolls bank.
export function rollPose(r,stance,player){
 const roll=player.roll||{},progress=Math.min(1,(roll.elapsed||0)/.3),angle=progress*Math.PI*2*(roll.direction||1),hipY=.72+.35*Math.sin(progress*Math.PI),P=hipHeight(r);
 const tuck={...stance,lean:.5,hx:.4,llx:-.9,rlx:-.9,lk:1.5,rk:1.5,lax:-1.2,rax:-1.2,laz:.2,raz:-.2,le:-1.6,re:-1.6,twist:0,side:0};
 if(roll.forward)return {...tuck,...root(r,angle,hipY,0)};
 return {...tuck,bodyPitch:0,bodyRoll:-angle,hipYaw:0,bodyX:-P*Math.sin(-angle),bodyY:hipY-P*Math.cos(angle),bodyZ:0};
}
// Round-winning pose, per fighter, settling over 0.45 s with a breath.
const victoryShapes={aegis:{rax:-2.9,raz:-.15,lax:-.35,twist:.18},rei:{rax:-1.1,ray:-.9,raz:.4,laz:.3,twist:.45,lean:.08},tala:{rax:-3,re:-.1,lax:-.5,le:-1.6,twist:-.3,llx:-.3,lk:.5},morrow:{rax:-2.2,raz:-.5,re:-.9,lax:.2,lean:-.08},sol:{lax:-2.7,le:-.2,raz:-.9,twist:.2},vesper:{lax:-1.4,rax:-1.4,laz:1.1,raz:-1.1,le:-.3,re:-.3,bodyY:.25}};
export function victoryPose(stance,id,animTime,time){
 const settle=smooth((animTime||0)/.45),bob=Math.sin(time*2.2)*.02,shape=victoryShapes[id]||{};
 const target={...stance,...shape,bodyY:stance.bodyY+(shape.bodyY||0)+.06,hx:stance.hx-.18};
 const out=mix(stance,target,settle);out.bodyY+=bob;return out;
}
// Aerial pursuit: tucked flight with three alternating arm beats and a kick on the third (the old shared beats, on the grounded body).
export function aerialPursuitPose(stance,m,player){
 const base=flightPose(stance,{air:.5}),out={...base};
 if(m.frame<m.startup)return out;
 const beat=Math.floor((m.frame-m.startup)/9),pulse=1-smooth(((m.frame-m.startup)%9)/9);
 if(beat%2){out.rax=-1.7*pulse+base.rax*(1-pulse);out.re=-.05*pulse+base.re*(1-pulse);}else{out.lax=-1.7*pulse+base.lax*(1-pulse);out.le=-.05*pulse+base.le*(1-pulse);}
 out.twist+=(beat%2?-.35:.35)*pulse;out.lean+=.1*pulse;
 if(beat===2){out.rlx=-1.4*pulse+base.rlx*(1-pulse);out.rk=base.rk*(1-pulse);}
 return out;
}
// A strike taken while airborne: the strike's arms and torso over the flight legs.
export function aerialStrikePose(stance,player,strikePose){
 const flight=flightPose(stance,player),s=strikePose({...player.move,chain:Math.min(3,player.move.chain||1)});
 const out={...flight};for(const k of ['lax','lay','laz','rax','ray','raz','le','re','lw','rw','twist','hipYaw','lean','hx','hy','lc','rc'])out[k]=s[k];return out;
}
// Captures and supers: the actor braces and reaches, the victim flails (the staging adds root motion and the lifting arm).
export function grapplePose(stance,t,role){
 const u=Math.max(0,Math.min(1,t||0)),w=Math.sin(u*40)*.08,s=stance;
 if(role==='actor'){
  // reach → grab with the hips dropped → drive up through legs and spine → throw with the chest whipping past → counter-step recovery
  const reach={...s,lean:.3,hx:-.05,bodyY:s.bodyY-.06,lax:-1.3,rax:-1.3,laz:.25,raz:-.25,le:-.6,re:-.6,llx:-.45,rlx:.35,lk:.5,rk:.3,twist:0,hipYaw:0,side:0};
  const grab={...s,lean:.45,hx:.1,bodyY:s.bodyY-.32,bodyZ:.08,lax:-1.1,rax:-1.1,laz:.3,raz:-.3,le:-.9,re:-.9,llx:-.6,rlx:.3,lk:1.3,rk:1.1,llz:.2,rlz:-.2,twist:0,hipYaw:0,side:0};
  const lift={...s,lean:-.15,hx:-.25,bodyY:s.bodyY+.04,bodyZ:.05,lax:-2.6,rax:-2.6,laz:.35,raz:-.35,le:-.3,re:-.3,llx:-.3,rlx:.2,lk:.12,rk:.12,twist:0,hipYaw:0,side:0};
  const throwP={...s,lean:.5,hx:.2,bodyY:s.bodyY-.12,bodyZ:.25,lax:-.6,rax:-.5,laz:.4,raz:-.4,le:-.4,re:-.4,llx:-.7,rlx:.45,lk:.7,rk:.25,twist:-.35,hipYaw:-.3,side:.05};
  const recover={...s,lean:.15,bodyY:s.bodyY-.05,bodyZ:-.12,llx:-.25,rlx:.5,lk:.4,rk:.55,twist:-.1,hipYaw:-.1};
  return sampleKeys([[0,reach,smooth],[.2,grab,smooth],[.32,grab,smooth],[.5,lift,smooth],[.6,lift,smooth],[.72,throwP,snapOut],[.86,recover,smooth],[1,s,smooth]],u);
 }
 // victim: braced at the grab → lifted and dangling (asymmetric knees, pointed toes, arched spine, head back, arms reaching) → thrown flail
 const brace={...s,lean:-.1,hx:-.2,lax:-1.0,rax:-.9,laz:.5,raz:-.5,le:-1.0,re:-1.0,llx:-.3,rlx:.1,lk:.4,rk:.3,twist:0,hipYaw:0,side:0};
 const dangle={...s,lean:-.55,hx:-.6,side:.12,lax:-1.9+w,rax:-1.5-w,laz:.7,raz:-.9,le:-.5,re:-.9,llx:.25,rlx:-.2,lk:.3,rk:1.1,llz:.2,rlz:-.3,twist:.15,hipYaw:0,bodyY:s.bodyY};
 const flail={...s,lean:.3,hx:.4,side:-.1,lax:-2.2-w,rax:-1.2+w,laz:1.1,raz:-1.0,le:-.6,re:-.7,llx:-1.0,rlx:-.5,lk:1.2,rk:.6,llz:.3,rlz:-.3,twist:-.2,hipYaw:0};
 return sampleKeys([[0,brace,smooth],[.25,brace,smooth],[.45,dangle,smooth],[.65,dangle,smooth],[.78,flail,snapOut],[1,flail,smooth]],u);
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
 const dt=Math.max(0,Math.min(.1,r[`${prefix}Time`]===undefined?0:time-r[`${prefix}Time`]));r[`${prefix}Time`]=time;r.lastTime=time;
 if(Number.isFinite(player?.x)&&Number.isFinite(player?.z)){
  if(r[`${prefix}Pos`]&&(player.anim==='run'||player.travel||player.move?.travel))r.stridePhase=(r.stridePhase||0)+Math.min(.5,Math.hypot(player.x-r[`${prefix}Pos`][0],player.z-r[`${prefix}Pos`][1]))/STRIDE*Math.PI;
  r[`${prefix}Pos`]=[player.x,player.z];
 }
 const motion=travelMotion(player,r[`${prefix}Last`]);r[`${prefix}Last`]=Number.isFinite(player?.x)?[player.x,player.z]:null;
 let target=null;
 if(poses&&player?.anim==='jumpSquat'&&!player.move)target={kind:'squat',pose:squatPose(poses.stance,player)};
 else if(poses&&player?.anim==='getUp'&&!player.move)target={kind:'rise',pose:getUpPose(r,poses.stance,player)};
 else if(poses&&player?.anim==='grapple')target={kind:'grapple',pose:grapplePose(poses.stance,player.animTime||0,'actor')};
 else if(poses&&player?.anim==='grappled')target={kind:'grapple',pose:grapplePose(poses.stance,player.animTime||0,'victim')};
 else if(poses&&player?.anim==='victory')target={kind:'victory',pose:victoryPose(poses.stance,poses.id,player.animTime,time)};
 else target=targetFor(player,time,player?.stridePhase??r.stridePhase??0,motion);
 if(!target&&poses&&player?.launched&&(player.air||0)>0&&!player.move)target={kind:'launched',pose:launchedPose(r,poses.stance,player)};
 if(!target&&poses&&player?.anim==='roll'&&player.roll)target={kind:'roll',pose:rollPose(r,poses.stance,player)};
 if(!target&&poses&&player?.move?.kind==='pursuit'&&player.move.aerial)target={kind:'aerial',pose:aerialPursuitPose(poses.stance,player.move,player)};
 if(!target&&poses?.strikePose&&player?.move&&(player.air||0)>0&&!player.launched)target={kind:'aerial',pose:aerialStrikePose(poses.stance,player,poses.strikePose)};
 if(!target&&poses?.specials&&player?.move&&['shot','technique','launch','forward','back'].includes(player.move.kind)&&!(player.air>0))target={kind:'strike',pose:specialPose(player.move,poses.stance,poses.specials)};
 if(!target&&poses&&isDown(player)){if(r[`${prefix}Kind`]==='launched')r[`${prefix}FromAir`]=true;target=player.getUp?{kind:'rise',pose:getUpPose(r,poses.stance,player)}:{kind:'knockdown',pose:downPose(r,poses.stance,poses.impact,player,time,!!r[`${prefix}FromAir`])};}else r[`${prefix}FromAir`]=false;
 if(!target&&poses&&!player?.move&&!player?.launched&&(player?.air||0)>0&&['jump','recover','idle','run'].includes(player?.anim))target={kind:'flight',pose:flightPose(poses.stance,player)};
 if(!target){r[`${prefix}Pose`]=null;r[`${prefix}Entry`]=null;r[`${prefix}Kind`]=null;r.footPlants=null;r.gaitPlants=null;return false;}
 // Leaving the floor plays the rise; coming back from the air plays the landing. Both are visual overlays on the simulation's state.
 const prevKind=r[`${prefix}Kind`];r[`${prefix}Kind`]=target.kind;
 if(prevKind==='knockdown'&&['idle','run','guard','charge'].includes(target.kind))r[`${prefix}Rise`]={elapsed:0};
 if(prevKind==='flight'&&['idle','run','guard'].includes(target.kind))r[`${prefix}Landing`]=0;
 if(r[`${prefix}Landing`]!==undefined){r[`${prefix}Landing`]+=dt;if(r[`${prefix}Landing`]>=LANDING_TIME||player?.move||target.kind==='flight')delete r[`${prefix}Landing`];else target={...target,pose:landingAbsorb(target.pose,r[`${prefix}Landing`])};}
 if(player?.travel||player?.move?.travel)target={...target,pose:travelOverlay(target.pose,player,motion)};
 const travelling=player?.move?.travel&&player.move.frame<player.move.startup&&!player.move.aerial&&target.kind==='strike';
 const rise=r[`${prefix}Rise`];let plantKind=travelling?'run':target.kind;
 if(rise){rise.elapsed+=dt;const u=rise.elapsed/RISE_TIME;if(u>=1||player?.move||target.kind==='knockdown')delete r[`${prefix}Rise`];else{target={...target,pose:risePose(r,target.pose,u)};plantKind='rise';}}
 const move=player?.move,dir=motion||{forward:player?.prev?.x||0,side:player?.prev?.z||0},key=target.kind+(target.kind==='run'?`${Math.sign(dir.forward)},${Math.sign(dir.side)}`:'');
 const old=r[`${prefix}Entry`];
 if(!old||old.key!==key||target.kind==='strike'&&(old.move!==move||move.frame<old.frame))r[`${prefix}Entry`]={key,move,frame:move?.frame,elapsed:0,offset:Object.fromEntries(CHANNELS.map(k=>[k,(r[`${prefix}Pose`]||target.pose)[k]-target.pose[k]]))};
 const entry=r[`${prefix}Entry`];entry.elapsed+=dt;entry.frame=move?.frame;
 const entryFrames=move?.travel?Math.min(3,move.startup):move?.startup;
 // Hits, jump squats and get-ups snap on their first frame: no entry blend.
 const weight=['hurt','squat','rise','knockdown','launched','grapple','roll'].includes(target.kind)||prevKind==='launched'?0:1-smooth(['strike','leap'].includes(target.kind)&&move?move.frame/Math.max(1,entryFrames):entry.elapsed/(target.kind==='run'?.1:.14));
 r[`${prefix}Pose`]=Object.fromEntries(CHANNELS.map(k=>[k,target.pose[k]+entry.offset[k]*weight]));
 r.lastPose=r[`${prefix}Pose`];applyPose(r,r[`${prefix}Pose`]);plantSupportFeet(r,player,plantKind);
 // Cloth follows the authored body turn; sampling a frozen time is deterministic.
 for(const cloth of r.clothParts){cloth.rotation.x=.04+Math.sin(time*2)*.035+(target.kind==='run'?.2:0);cloth.rotation.z=-r[`${prefix}Pose`].twist*.13;}
 return true;
}
