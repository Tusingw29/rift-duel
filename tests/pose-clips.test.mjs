import test from 'node:test';
import assert from 'node:assert/strict';
import {sampleClip} from '../dist/pose-clips.js';
import {movePose,strikePose,CHANNELS} from '../dist/tala-animation.js';
import {moveTiming} from '../dist/moves.js';
import {fighters} from '../dist/fighters.js';
test('looping motion has matching position and velocity through the cycle seam',()=>{
 const h=.00001;
 for(const [f,s] of [[1,0],[-1,0],[0,1],[0,-1]]){
  const a=movePose(f,s,-h),b=movePose(f,s,0),c=movePose(f,s,h);
  for(const k of CHANNELS){assert.ok(Math.abs((b[k]-a[k])/h-(c[k]-b[k])/h)<.001,k);}
  assert.deepEqual(movePose(f,s,0),movePose(f,s,Math.PI*2));
 }
});
test('clip keys are reached exactly and non-looping clips settle at their endpoints',()=>{
 const keys=[[0,{x:0}],[.3,{x:2}],[1,{x:-1}]];
 for(const [t,p] of keys)assert.deepEqual(sampleClip(keys,t,['x']),p);
 assert.deepEqual(sampleClip(keys,-10,['x']),{x:0});assert.deepEqual(sampleClip(keys,10,['x']),{x:-1});
});
test('run shifts the pelvis and counter-rotates the chest while punches lead with hips',()=>{
 const a=movePose(1,0,0),b=movePose(1,0,Math.PI);
 assert.ok(a.bodyX*b.bodyX<0,'weight transfers between feet');
 assert.ok(a.hipYaw*b.hipYaw<0,'hips alternate');
 for(const chain of [1,2,3]){
  const m={...moveTiming(fighters[2],'strike',chain),chain};
  const drive=strikePose({...m,frame:m.startup-1}),hit=strikePose({...m,frame:m.startup}); // the whip starts one frame before contact
  assert.ok(Math.abs(drive.hipYaw)>.95*Math.abs(hit.hipYaw),'hips already committed before contact');
  const wrist=chain===2?'lw':'rw';assert.ok(Math.abs(drive[wrist]-hit[wrist])>.05,'wrist still finishing its whip'); // shoulders lead by two frames, wrists fire on the beat
 }
});
