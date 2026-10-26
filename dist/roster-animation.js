import {CHANNELS} from './rig-pose.js';
import {animateGroundedRig,travelTarget,recoilPose,staggerPose,reversalPose,rearLoad,strikeSchedule,sampleSchedule} from './grounded-animation.js';
import {rhythmFootOffsets,rhythmPose} from './footwork.js';
import {movePose,guard as talaGuard,impact as talaImpact} from './tala-animation.js';
// Whole-body grounded animation for Rei, Sol and Vesper on the same contract as Tala,
// Aegis and Morrow: flat channel poses blended toward a per-state target, strikes keyed
// to the combat timeline (contact lands exactly on the startup frame), footwork driven
// by travelled distance, and planted support feet. Root travel belongs to the simulation;
// these poses only add body motion on top of the position it reports.
const pose=o=>Object.fromEntries(CHANNELS.map(k=>[k,o[k]??0]));
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const snapOut=t=>{t=Math.max(0,Math.min(1,t));return 1-(1-t)**3;};
const mix=(a,b,t)=>Object.fromEntries(CHANNELS.map(k=>[k,a[k]+(b[k]-a[k])*t]));
const ARMS=['lax','lay','laz','rax','ray','raz','le','re'];
function grounded(prefix,def){
 const stance=pose(def.stance),p=o=>pose({...stance,...o});
 const cuts=def.cuts.map(([wind,contact,follow])=>[p(rearLoad(stance,p(wind),p(contact))),p(contact),p(follow)]);
 // Keyed strike: wind eases in, a drive key snaps toward contact so the hit lands with
 // momentum, the follow-through overshoots, then a retract settles under control.
 function strikePose(move){
  const [wind,contact,follow]=cuts[Math.min(2,Math.max(0,(move.chain||1)-1))],active=move.active||1,end=move.startup+active+move.recovery;
  const drive=pose({...mix(wind,contact,.72),hipYaw:contact.hipYaw*.95,bodyY:contact.bodyY-.03});
  const retract=pose({...mix(follow,stance,.62),bodyY:stance.bodyY-.05});
  return sampleSchedule(strikeSchedule(move,stance,wind,drive,contact,follow,retract),move.frame);
 }
 // Footwork reuses the authored step clips; the arms stay close to this fighter's ready
 // position instead of the full jogging pump, and the torso keeps its own carriage.
 function stepPose(forward,side,phase){
  const s=movePose(forward,side,phase);
  for(const k of ARMS)s[k]=stance[k]+(s[k]-stance[k])*def.armSwing;
  s.lean=stance.lean+s.lean*.75;s.twist=stance.twist+s.twist*.8;s.bodyY+=stance.bodyY+.15;
  return s;
 }
 const guardPose=p(def.guard),guardHit=p({...def.guard,lean:def.guard.lean-.14,hx:def.guard.hx+.16,neckY:-.075,neckZ:-.065,bodyZ:-.14,le:def.guard.le-.05,re:def.guard.re-.05});
 const impact=p(def.impact),charge=p(def.charge);
 function targetFor(player,time,phase,motion){
  if(player?.move?.kind==='strike'&&!player.air)return {kind:'strike',pose:player.move.reversal?reversalPose(player.move,strikePose):strikePose(player.move)};
  const travel=travelTarget(player,stance,strikePose);if(travel)return travel;
  if(player?.staggerState&&!player.move)return {kind:'stagger',pose:staggerPose(stance,impact,player.staggerState)};
  if(player?.anim==='recover'&&!player.air&&!player.move)return {kind:'idle',pose:p({bodyY:stance.bodyY-.03,lean:stance.lean+.04})};
  if(player?.move||player?.air>0||player?.roll||['knockdown','defeat','victory','launch','roll','jump','recover','pursuit','jumpAttack'].includes(player?.anim))return null;
  if(player?.guard)return {kind:'guard',pose:rhythmPose(mix(guardPose,guardHit,Math.min(1,(player.blockStun||0)/.22)),time,.4)};
  if(player?.anim==='hurt')return {kind:'hurt',pose:recoilPose(impact,stance,player.animTime,player.hitstop)};
  if(player?.anim==='charge')return {kind:'charge',pose:charge};
  if(player?.anim==='run')return {kind:'run',pose:stepPose(motion?motion.forward:player.prev?.x??1,motion?motion.side:player.prev?.z||0,phase)};
  const breath=Math.sin(time*def.breath),shift=Math.sin(time*def.breath*.5);
  // The shared weight rhythm (footwork.js) moves the hips, knees and taps the free foot; only breathing is per fighter.
  return {kind:'idle',pose:rhythmPose(p({hx:stance.hx+breath*.02,lax:stance.lax+breath*.025,rax:stance.rax+breath*.02}),time)};
 }
 // The rear foot catches the recoil (Tala's foot offsets are generic: they read only the hurt timer).
 return {stance,strikePose,stepPose,targetFor,animate:(r,player,time)=>{r.footOffsets??=rhythmFootOffsets;return animateGroundedRig(r,player,time,prefix,targetFor,{stance,impact,id:prefix,strikePose,specials:def.specials});}};
}
// Crossed forearms shield the chest, chin tucked, as in Tala's authored guard; the weapon
// hand rides slightly outward so the blade or staff crosses the body instead of the face.
const crossedGuard={lw:talaGuard.lw,rw:talaGuard.rw,lax:talaGuard.lax,lay:talaGuard.lay,laz:talaGuard.laz,le:talaGuard.le,rax:talaGuard.rax,ray:talaGuard.ray*.9,raz:talaGuard.raz+.1,re:talaGuard.re,twist:-.08,lean:.16,hx:.42,neckY:-.055,neckZ:-.035,llx:-.22,llz:.22,rlx:.22,rlz:-.22,lk:.42,rk:.4,bodyY:-.18};
const recoil={hx:talaImpact.hx,hz:talaImpact.hz,lean:talaImpact.lean,twist:talaImpact.twist,lax:-.35,laz:.65,le:-.5,rax:-.15,raz:-.6,re:-.4,rlx:.6,rlz:-.1,llx:.25,rk:.35,lk:.1,bodyZ:-.22,bodyY:-.12};

// Rei: katana low in the right hand, left hand leading; cross cut, reverse cut, overhead cut.
export const rei=grounded('rei',{
 stance:{rax:-.22,ray:-.3,raz:-.1,re:-.3,lax:-.55,laz:.15,le:-.95,twist:.18,lean:.04,hy:-.08,llx:-.16,llz:.08,rlx:.16,rlz:-.1,lk:.26,rk:.22,bodyY:-.14},
 cuts:[
  [{rax:-.35,ray:1.05,raz:.1,re:-.65,twist:.55,hipYaw:.18,lean:-.06,hy:-.2,lax:-.6,le:-1,rlx:.3,llx:-.14,rk:.32,bodyY:-.2},
   {rax:-.8,ray:.35,raz:.15,re:.3,twist:-.45,hipYaw:-.18,lean:.16,hy:.28,lax:-.6,le:-1,rlx:.45,llx:-.35,rk:.2,lk:.4,bodyZ:.16,bodyY:-.14},
   {rax:-.5,ray:-.5,raz:.1,re:.25,twist:-.7,hipYaw:-.26,lean:.18,hy:.36,lax:-.55,le:-.95,rlx:.45,llx:-.35,rk:.2,lk:.4,bodyZ:.2,bodyY:-.14}],
  [{rax:-.4,ray:-1,raz:.1,re:-.7,twist:-.55,hipYaw:-.2,lean:-.04,hy:.2,lax:-.6,le:-1,llx:-.3,rlx:.14,lk:.32,bodyY:-.2},
   {rax:-.8,ray:-.4,raz:.15,re:.35,twist:.4,hipYaw:.16,lean:.16,hy:-.26,lax:-.55,le:-1,llx:-.45,rlx:.35,lk:.2,rk:.4,bodyZ:.16,bodyY:-.14},
   {rax:-.5,ray:.55,raz:.1,re:.2,twist:.7,hipYaw:.24,lean:.18,hy:-.34,lax:-.55,le:-.95,llx:-.45,rlx:.35,lk:.2,rk:.4,bodyZ:.2,bodyY:-.14}],
  [{rax:-2.4,ray:.2,raz:.1,re:-.9,lax:-1,le:-1,twist:.25,hipYaw:.12,lean:-.15,hx:-.1,bodyY:-.25,lk:.45,rk:.45},
   {rax:-.9,ray:0,raz:.15,re:.2,lax:-.6,le:-.8,twist:-.12,hipYaw:-.1,lean:.3,hx:.1,bodyZ:.26,bodyY:-.2,llx:-.5,rlx:.3,lk:.45,rk:.2},
   {rax:-.4,ray:-.05,raz:.15,re:.2,lax:-.4,le:-.6,twist:-.16,hipYaw:-.12,lean:.36,hx:.14,bodyZ:.3,bodyY:-.24,llx:-.5,rlx:.3,lk:.45,rk:.2}]],
 guard:crossedGuard,impact:recoil,charge:{lax:.2,laz:.4,le:-.6,rax:.15,raz:-.35,re:-.5,lean:-.06,hx:-.15,llx:-.1,llz:.3,rlx:.1,rlz:-.3,lk:.36,rk:.36,bodyY:-.12},
 // Specials: a loaded reverse grip, the blade thrown across the body, and the follow; the spin technique turns the whole body.
 specials:{special:[{rax:.2,ray:.8,raz:.3,re:-.9,lax:-.6,le:-1,twist:.4,hipYaw:.2,lean:-.05,hy:-.2,bodyY:-.2,rlx:.3,llx:-.14,rk:.42},
   {rax:-1.0,ray:-.55,raz:.65,re:-.4,lax:-.6,le:-1,twist:-.5,hipYaw:-.35,lean:.18,hy:.3,bodyZ:.16,bodyY:-.14,rlx:.45,llx:-.35,rk:.2,lk:.4},
   {rax:-.8,ray:-.7,raz:.6,re:-.5,lax:-.55,le:-.95,twist:-.55,hipYaw:-.38,lean:.2,hy:.32,bodyZ:.18,bodyY:-.14,rlx:.45,llx:-.35,rk:.2,lk:.4}],
  technique:[{raz:.3,laz:-.3,rax:-.4,lax:-.4,le:-.9,re:-.9,twist:.3,hipYaw:.1,lean:-.05,bodyY:-.25,lk:.45,rk:.45},
   {raz:.9,laz:-.8,rax:-.6,lax:-.6,re:-.2,le:-.2,twist:0,hipYaw:0,lean:.05,bodyY:.1,llx:-.3,rlx:.3,lk:.3,rk:.3},
   {raz:.7,laz:-.6,rax:-.5,lax:-.5,re:-.4,le:-.4,lean:.1,bodyY:-.1,llx:-.3,rlx:.3,lk:.35,rk:.3}]},
 armSwing:.25,breath:2.4});

// Sol: staff upright in the right hand, left hand raised to cast; sweep, reverse sweep, two-hand thrust.
export const sol=grounded('sol',{
 stance:{rax:-.15,ray:-.1,raz:-.08,re:-.2,lax:-.9,laz:.3,le:-1.1,twist:.1,lean:.02,hy:-.06,llx:-.14,llz:.08,rlx:.14,rlz:-.08,lk:.22,rk:.2,bodyY:-.12},
 cuts:[
  [{rax:.3,ray:.7,raz:-.1,re:-.9,lax:-.8,le:-1,twist:.45,hipYaw:.18,lean:-.05,hy:-.18,rlx:.3,llx:-.12,rk:.32,bodyY:-.2},
   {rax:-1.35,ray:-.4,raz:-.05,re:-.1,lax:-.8,le:-1,twist:-.35,hipYaw:-.15,lean:.16,hy:.26,rlx:.42,llx:-.32,rk:.2,lk:.4,bodyZ:.16,bodyY:-.12},
   {rax:-.8,ray:-.8,raz:-.05,re:-.15,lax:-.7,le:-.9,twist:-.45,hipYaw:-.2,lean:.2,hy:.3,rlx:.42,llx:-.32,rk:.2,lk:.4,bodyZ:.2,bodyY:-.12}],
  [{rax:.3,ray:-.7,raz:-.1,re:-.9,lax:-.8,le:-1,twist:-.45,hipYaw:-.18,lean:-.05,hy:.18,llx:-.3,rlx:.12,lk:.32,bodyY:-.2},
   {rax:-1.35,ray:.4,raz:-.05,re:-.1,lax:-.8,le:-1,twist:.35,hipYaw:.15,lean:.16,hy:-.26,llx:-.42,rlx:.32,lk:.2,rk:.4,bodyZ:.16,bodyY:-.12},
   {rax:-.8,ray:.8,raz:-.05,re:-.15,lax:-.7,le:-.9,twist:.45,hipYaw:.2,lean:.2,hy:-.3,llx:-.42,rlx:.32,lk:.2,rk:.4,bodyZ:.2,bodyY:-.12}],
  [{rax:.5,raz:-.1,re:-1.4,lax:.3,laz:.2,le:-1.3,twist:.4,hipYaw:.14,lean:-.1,hx:-.08,bodyY:-.24,lk:.4,rk:.4},
   {rax:-1.5,ray:.1,raz:-.05,re:-.05,lax:-1.4,laz:.1,le:-.1,twist:-.5,hipYaw:-.16,lean:.25,hx:.08,bodyZ:.3,bodyY:-.16,llx:-.5,rlx:.35,lk:.45,rk:.2},
   {rax:-1.3,ray:.1,raz:-.05,re:-.2,lax:-1.25,laz:.1,le:-.2,twist:-.55,hipYaw:-.18,lean:.3,hx:.1,bodyZ:.34,bodyY:-.2,llx:-.5,rlx:.35,lk:.45,rk:.2}]],
 // Sol blocks behind the staff held upright in front of the chest, the free forearm crossed over it.
 guard:{...crossedGuard,rax:-.7,ray:0,raz:-.6,re:-.6},impact:recoil,charge:{lax:.1,laz:.5,le:-.7,rax:.1,raz:-.3,re:-.4,lean:-.06,hx:-.15,llx:-.1,llz:.3,rlx:.1,rlz:-.3,lk:.34,rk:.34,bodyY:-.12},
 // Specials: the casting hand loads back then thrusts, hips turning the other way (left-handed); the sphere opens both arms.
 specials:{special:[{lax:.2,laz:.3,le:-1.3,rax:-.1,re:-.3,twist:-.3,hipYaw:-.15,lean:-.05,hy:.15,bodyY:-.18,llx:-.14,rlx:.3,lk:.45,rk:.3},
   {lax:-1.5,laz:.1,le:-.1,rax:-.4,re:-.2,twist:.3,hipYaw:.35,lean:.18,hy:-.26,bodyZ:.14,bodyY:-.12,llx:-.4,rlx:.3,lk:.35,rk:.2},
   {lax:-1.3,laz:.15,le:-.2,rax:-.4,re:-.2,twist:.35,hipYaw:.38,lean:.2,hy:-.3,bodyZ:.16,bodyY:-.12,llx:-.4,rlx:.3,lk:.35,rk:.2}],
  technique:[{laz:.3,raz:-.3,lax:-.5,rax:-.3,le:-1.2,re:-1.2,lean:-.08,bodyY:-.22,lk:.45,rk:.45},
   {laz:1.1,raz:-1.1,lax:-.9,rax:-.9,le:-.3,re:-.3,lean:.1,bodyY:-.1,llx:-.2,rlx:.2,lk:.3,rk:.3},
   {laz:.9,raz:-.9,lax:-.8,rax:-.8,le:-.4,re:-.4,lean:.12,bodyY:-.12,llx:-.2,rlx:.2,lk:.32,rk:.3}]},
 armSwing:.22,breath:2.0});

// Vesper: rings held open at both sides, upright carriage; double sweep, one-hand push, rising double lift.
export const vesper=grounded('vesper',{
 stance:{lax:-.3,laz:.45,le:-.6,rax:-.3,raz:-.45,re:-.6,twist:.0,lean:-.02,hy:0,hz:.05,llx:-.1,llz:.1,rlx:.1,rlz:-.1,lk:.18,rk:.16,bodyY:-.1},
 cuts:[
  [{lax:-.5,laz:.7,le:-1,rax:-.5,raz:-.7,re:-1,lean:-.12,hx:-.06,bodyY:-.18,lk:.3,rk:.3},
   {lax:-1.5,laz:.2,le:-.08,rax:-1.5,raz:-.2,re:-.08,lean:.15,hx:.08,bodyZ:.18,bodyY:-.1,llx:-.35,rlx:.3,lk:.32,rk:.2},
   {lax:-1.25,laz:.4,le:-.2,rax:-1.25,raz:-.4,re:-.2,lean:.2,hx:.1,bodyZ:.22,bodyY:-.12,llx:-.35,rlx:.3,lk:.32,rk:.2}],
  [{rax:.2,raz:-.6,re:-1.2,lax:-.4,laz:.5,le:-.7,twist:.4,hipYaw:.15,lean:-.05,hy:-.16,bodyY:-.16,rlx:.26,rk:.3},
   {rax:-1.6,raz:-.1,re:-.05,lax:-.4,laz:.5,le:-.7,twist:-.45,hipYaw:-.18,lean:.14,hy:.24,bodyZ:.18,bodyY:-.1,rlx:.42,llx:-.32,rk:.2,lk:.38},
   {rax:-1.4,raz:-.15,re:-.2,lax:-.4,laz:.5,le:-.7,twist:-.55,hipYaw:-.22,lean:.18,hy:.3,bodyZ:.2,bodyY:-.12,rlx:.42,llx:-.32,rk:.2,lk:.38}],
  [{lax:.3,rax:.3,laz:.5,raz:-.5,le:-1.3,re:-1.3,lean:-.15,hx:-.1,bodyY:-.26,lk:.5,rk:.5},
   {lax:-2.2,rax:-2.2,laz:.3,raz:-.3,le:-.2,re:-.2,lean:.1,hx:.12,bodyY:-.04,bodyZ:.2,llx:-.3,rlx:.3,lk:.2,rk:.2},
   {lax:-1.9,rax:-1.9,laz:.35,raz:-.35,le:-.25,re:-.25,lean:.2,hx:.14,bodyZ:.24,bodyY:-.12,llx:-.3,rlx:.3,lk:.28,rk:.28}]],
 guard:{...crossedGuard,raz:crossedGuard.raz-.1},impact:recoil,charge:{lax:.0,laz:.75,le:-.9,rax:.0,raz:-.75,re:-.9,lean:-.08,hx:-.18,llx:-.08,llz:.28,rlx:.08,rlz:-.28,lk:.32,rk:.32,bodyY:-.12},
 // Specials: both rings drawn back then pushed out together; the wheel technique lifts them overhead.
 specials:{special:[{lax:.3,rax:.3,laz:.6,raz:-.6,le:-1.2,re:-1.2,lean:-.1,hx:-.05,bodyY:-.2,lk:.4,rk:.4},
   {lax:-1.3,rax:-1.3,laz:.5,raz:-.5,le:-.2,re:-.2,lean:.15,hx:.08,bodyZ:.16,bodyY:-.1,llx:-.3,rlx:.3,lk:.3,rk:.2},
   {lax:-1.15,rax:-1.15,laz:.5,raz:-.5,le:-.3,re:-.3,lean:.18,hx:.1,bodyZ:.18,bodyY:-.12,llx:-.3,rlx:.3,lk:.3,rk:.2}],
  technique:[{lax:.2,rax:.1,laz:.5,raz:-.5,le:-1.3,re:-1.0,lean:-.1,hx:-.08,bodyY:-.22,lk:.45,rk:.45},
   {lax:-1.8,rax:-.7,laz:.3,raz:-.6,le:-.2,re:-.5,lean:.2,hx:.1,bodyZ:.18,bodyY:-.1,llx:-.3,rlx:.3,lk:.3,rk:.2},
   {lax:-1.6,rax:-.7,laz:.35,raz:-.6,le:-.3,re:-.5,lean:.2,hx:.1,bodyZ:.2,bodyY:-.12,llx:-.3,rlx:.3,lk:.3,rk:.2}]},
 armSwing:.3,breath:1.7});

export const animateRei=rei.animate,animateSol=sol.animate,animateVesper=vesper.animate;
