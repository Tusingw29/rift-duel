import {CHANNELS} from './rig-pose.js';
import {sampleClip} from './pose-clips.js';
import * as run from './clips/run.js';
import * as walk from './clips/walk.js';
// Motion-capture locomotion, converted from CMU takes by scripts/mocap/bvh-to-channels.mjs into
// the same pose channels the authored step clips use. The source is switchable at runtime so the
// review pages can compare authored and captured gait on the same rig; the simulation still owns
// root travel and plantSupportFeet still plants the support feet, so the clip supplies torso,
// arms, head, pelvis bob and the swinging leg.
export const SOURCES=['authored','mocap'];
let source='authored';
export function setLocomotionSource(name){source=SOURCES.includes(name)?name:'authored';return source;}
export function locomotionSource(){return source;}
const mean=(keys,ch)=>keys.slice(0,-1).reduce((s,k)=>s+k[1][ch],0)/(keys.length-1);
const RUN_BOB=mean(run.keys,'bodyY'),WALK_BOB=mean(walk.keys,'bodyY');
// phase: stride phase in radians (2π per stride), as the animators already track it from travelled distance.
export function clipMovePose(forward,side,phase,restBodyY=-.15){
 if(source!=='mocap')return null;
 const strafe=Math.abs(side)>Math.abs(forward),backward=!strafe&&forward<0;
 const clip=strafe?walk:run,bob=strafe?WALK_BOB:RUN_BOB;
 // Retreat plays the run cycle backwards; circling uses the walk with a lateral lean.
 const u=((backward?-phase:phase)/(Math.PI*2)%1+1)%1;
 const s=sampleClip(clip.keys,u,CHANNELS,true);
 s.bodyY=restBodyY+(s.bodyY-bob);
 if(backward){s.lean=-s.lean*.6;}
 if(strafe){s.side=(side<0?-1:1)*.08+s.side;s.lean=.1;s.twist*=.5;if(side<0){s.bodyX=-s.bodyX;s.llz=-s.llz;s.rlz=-s.rlz;}}
 // Keep the captured runner looking toward the opponent when adapted to combat.
 // A reversed run changes the torso lean but must not leave its chin pitched skyward.
 s.hx=Math.max(s.hx,.06-s.lean);
 return s;
}
export const clipMeta={run:run.meta,walk:walk.meta};
