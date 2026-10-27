import test from 'node:test';import assert from 'node:assert/strict';
import {COMBAT_CLIPS,combatClip,clipU,combatPose,combatWeight,combatTuning} from '../dist/imported-combat.js';
import {strikePose,stance} from '../dist/tala-animation.js';
import {setLocomotionSource} from '../dist/locomotion-clips.js';
import {moveTiming} from '../dist/moves.js';
import {fighters} from '../dist/fighters.js';
import {getUpClipU,IMPORT_CYCLE} from '../dist/imported-motion.js';
import {run} from '../scripts/review/import-metrics.mjs';
// MOCAP-COMBAT: captured punches warped onto the simulation's frames, and the IMPORT-POLISH of the captured footwork.
const move=(chain,frame=0)=>({kind:'strike',chain,...moveTiming(fighters[2],'strike',chain),frame});
test('captured strikes record their CMU source and licence and mark an impact inside the clip',()=>{
 for(const [c,clip] of Object.entries(COMBAT_CLIPS.tala.strike)){
  assert.match(clip.meta.source,/^CMU \d+_\d+ .*free for research and commercial use/,`strike ${c}`);
  assert.equal(clip.meta.mode,'strike');assert.ok(clip.meta.impact>.2&&clip.meta.impact<.8);
  assert.ok(clip.keys.some(k=>Math.abs(k[0]-clip.meta.impact)<1e-3),'a key sits exactly on the impact');
 }
 assert.equal(combatClip('tala',{...move(1),travel:{}}),null,'travelling strikes keep the simulation path');
 assert.equal(combatClip('aegis',move(1)),null,'only fighters with captured strikes');
});
test('the time warp puts the impact on the damage frame, holds it through the active frames and ends with the move',()=>{
 for(const chain of [1,2,3]){
  const m=move(chain),clip=combatClip('tala',m),end=m.startup+m.active+m.recovery,ui=clip.meta.impact+combatTuning.impactShift;
  let prev=-1;for(let f=0;f<=end;f++){const u=clipU(m,clip,f);assert.ok(u>=prev-1e-12,`monotonic at ${f}`);prev=u;}
  assert.equal(clipU(m,clip,0),0);assert.ok(Math.abs(clipU(m,clip,m.startup)-ui)<1e-12,'impact on the startup frame');
  for(let f=m.startup;f<m.startup+m.active;f++)assert.ok(Math.abs(clipU(m,clip,f)-ui)<1e-12,'held through active');
  assert.equal(clipU(m,clip,end),1);
 }
});
test('a captured punch reaches the authored contact on the damage frame and drives the hips at the rival',()=>{
 setLocomotionSource('imported');
 try{
  for(const chain of [1,2,3]){
   const m=move(chain,0),contact=move(chain,0);contact.frame=contact.startup;
   const p=strikePose(contact),hand=chain===2?'l':'r';
   setLocomotionSource('authored');const authored=strikePose(contact);setLocomotionSource('imported');
   assert.ok(Math.abs(p[hand+'ax']-authored[hand+'ax'])<.25,`strike ${chain}: punching arm near the authored aim (${p[hand+'ax'].toFixed(2)} vs ${authored[hand+'ax'].toFixed(2)})`);
   assert.ok(Math.abs(p[hand+'e']-authored[hand+'e'])<.3,`strike ${chain}: elbow at the authored contact shape (${p[hand+'e'].toFixed(2)} vs ${authored[hand+'e'].toFixed(2)}; the hook stays bent)`);
   const clip=combatClip('tala',m),w=combatWeight(contact,clip,contact.startup);
   assert.ok(w.bodyZ>.12,`strike ${chain}: hips driven toward the rival (${w.bodyZ.toFixed(2)})`);
   const end=m.startup+m.active+m.recovery,late=combatWeight(m,clip,end-1);
   for(const v of [late.bodyX,late.bodyZ,...late.feet.flatMap(f=>[f.x,f.z])])assert.ok(Math.abs(v)<.03,`strike ${chain}: home by the end (${v.toFixed(3)})`);
   const frozen=[strikePose({...contact,frame:m.startup+1}),strikePose({...contact,frame:m.startup+1})];assert.deepEqual(frozen[0],frozen[1],'a function of the move frame (hitstop holds it)');
  }
 }finally{setLocomotionSource('authored');}
 assert.deepEqual(strikePose(move(1,5)),strikePose(move(1,5)),'authored stays authored');
});
test('the get-up time warp is monotonic, spans the clip and compresses the slow stretches',()=>{
 let prev=-1;for(let i=0;i<=28;i++){const u=getUpClipU(i/28);assert.ok(u>=prev);prev=u;}
 assert.equal(getUpClipU(0),0);assert.equal(getUpClipU(1),1);
 assert.ok([.25,.5,.75].some(t=>Math.abs(getUpClipU(t)-t)>.03),'not a flat time scale');
});
test('captured footwork steps quicker than the authored stride and returns to the stance when it stops',()=>{
 for(const c of Object.values(IMPORT_CYCLE))assert.ok(c<.975);
 for(const name of ['ab-advance-guard','ab-circle-right-guard','ab-retreat-attack']){
  const fr=run(name,'imported'),last=fr.at(-1),w=Math.hypot(last.ankles[0].x-last.ankles[1].x,last.ankles[0].z-last.ankles[1].z);
  assert.ok(w<.85,`${name}: stance width after stopping ${w.toFixed(2)} (Tala's stance is about 0.7)`);
 }
 setLocomotionSource('authored');
});
