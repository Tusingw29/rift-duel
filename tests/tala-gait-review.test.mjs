import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GLTFLoader} from '../dist/vendor/GLTFLoader.js';
import {createLiveTalaReview,TALA_TRANSITION_CLIPS} from '../dist/tala-live-review.js';
import {setLocomotionSource} from '../dist/locomotion-clips.js';
import {targetFor} from '../dist/tala-animation.js';
import {moveTiming} from '../dist/moves.js';
import {fighters} from '../dist/fighters.js';
globalThis.ProgressEvent??=class{constructor(t,data){Object.assign(this,data);}};
const bytes=readFileSync(new URL('../dist/assets/tala-graphic/tala-graphic.glb',import.meta.url));
const asset=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
const review=()=>createLiveTalaReview(asset.scene,{variant:'graphic'});
test('paused gait switch resamples immediately and switching back restores the exact pose',()=>{
 const live=review();try{setLocomotionSource('authored');live.sample('Advance',.7);const before={...live.rig.pose};setLocomotionSource('mocap');live.sample('Advance',.7);assert.notDeepEqual(live.rig.pose,before);setLocomotionSource('authored');live.sample('Advance',.7);assert.deepEqual(live.rig.pose,before);}finally{setLocomotionSource('authored');}
});
test('both gait sources enter combat directly, retain exact contact and deterministic replay',()=>{
 try{for(const gait of ['authored','mocap']){setLocomotionSource(gait);
  for(const clip of TALA_TRANSITION_CLIPS){const live=review();live.sample(clip.name,47/60);const before={...live.rig.pose},root=live.rig.g.position.clone();live.sample(clip.name,48/60);const start={...live.rig.pose};assert.ok(live.rig.g.position.distanceTo(root)<.061,'root stops without teleporting');
   if(clip.name!=='Circle to recoil')assert.ok(Math.max(...Object.keys(before).map(k=>Math.abs(start[k]-before[k])))<.6,clip.name+' bounded entry');else assert.ok(Object.values(start).every(Number.isFinite),'impact pose is finite');
   live.sample(clip.name,1.4);const settled={...live.rig.pose};live.sample(clip.name,0);live.sample(clip.name,1.4);assert.deepEqual(live.rig.pose,settled,'replay determinism');
  }
  const live=review(),timing=moveTiming(fighters[2],'strike');
  for(let chain=1;chain<=3;chain++){const frame=48+(chain-1)*timing.total+timing.startup;live.sample('Advance to combo',frame/60);const move={kind:'strike',chain,...timing,frame:timing.startup};const expected=targetFor({anim:'strike',move},frame/60,0).pose;for(const key of Object.keys(expected))assert.ok(Math.abs(live.rig.pose[key]-expected[key])<1e-9,`${gait} chain ${chain} ${key}`);}
 }}finally{setLocomotionSource('authored');}
});
