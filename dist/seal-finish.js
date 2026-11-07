// SEAL-VISUALS (Claude): the seal-specific capture finish ("seal bind"). Render-only and pure (no WebGL):
// a caught seal snaps shut into a pillar around the target, lifts and holds them while the caster
// raises a hand, then the pillar collapses and drives them into the floor. The simulation still runs
// the ordinary capture cinematic (duration, damage, launch); this only replaces how it is staged.
import {SEAL} from './capture-seal.js';
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const mix=(a,b,t)=>a+(b-a)*t;

// The capture cinematic that a seal catch started, if the current one is. A catch resolves the seal and
// begins the cinematic on the same tick, and m.tick keeps counting while c.t does, so the two clocks agree.
export function sealCatchOf(m){
 const c=m?.cinematic;if(!c||c.kind!=='capture'||!m.seals)return null;
 return m.seals.find(s=>s.status==='caught'&&s.owner===c.a&&s.target===c.b&&s.resolved!=null&&Math.abs(m.tick-s.resolved-c.t*60)<=3)||null;
}

// Phase timeline over the normalised cinematic time t (0..1), shared by the pose and the effects.
export function sealBindPhases(t){
 const snap=smooth(t/.16),lift=smooth((t-.14)/.3),clench=smooth((t-.44)/.12),slam=smooth((t-.58)/.08),shock=clamp((t-.64)/.26);
 return {t,snap,lift,clench,slam,shock,
  height:4.6*snap*(1-slam),
  radius:mix(SEAL.radius,.8,snap)-.15*clench,
  opacity:snap*(1-slam*.85)};
}

// Writes the staged pose in place (same shape as the other staged captures) and returns the camera.
export function sealBindPose(t,a,b,actor,victim,effects,seal){
 const dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz)||1,ux=dx/d,uz=dz/d,px=-uz,pz=ux;
 const ph=sealBindPhases(t),cx=seal?seal.x:b.x,cz=seal?seal.z:b.z;
 // Caster: left hand holds the seal on the target; right hand rises overhead and drives down on the slam.
 actor.arm=-1.45*ph.snap;actor.rightArm=-.3-2.6*ph.lift+2.3*ph.slam;actor.tilt=-.08*ph.lift+.3*ph.slam;
 // Target: pinned, lifted into the pillar with a held-breath shudder, then slammed flat.
 const held=ph.lift*(1-ph.slam);
 victim.x=b.x;victim.z=b.z;
 victim.y=1.7*held+.18*ph.slam+.35*Math.sin(Math.PI*ph.shock)*ph.slam;
 victim.tilt=-.22*held+1.4*ph.slam;victim.arm=0;
 victim.roll=Math.sin(t*60)*.05*held*(1-ph.clench*.5);
 effects.rings=0;
 effects.seal={...ph,x:mix(cx,b.x,ph.snap),z:mix(cz,b.z,ph.snap),floor:point(b.x,b.z),victimY:victim.y};
 return ph.slam<.5
  // Over the caster's shoulder: raised hand, tether and the full pillar in one frame.
  ?{shot:'seal-bind',target:{x:b.x-ux*.8,y:2.2+victim.y*.4,z:b.z-uz*.8},position:{x:a.x-ux*3.2+px*3.4,y:3.4,z:a.z-uz*3.2+pz*3.4}}
  :{shot:'seal-slam',target:{x:b.x,y:1.1,z:b.z},position:{x:b.x+px*10-ux*3,y:5.5,z:b.z+pz*10-uz*3}};
}
const point=(x,z)=>({x,z});
