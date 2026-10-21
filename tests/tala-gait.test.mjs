import test from 'node:test';import assert from 'node:assert/strict';import {Group,Vector3} from '../dist/vendor/three.module.js';import {talaGaitTargets} from '../dist/tala-footwork.js';
test('advance, retreat and both circles lead with the directional foot without crossing',()=>{
 for(const [x,z,lead] of [[1,0,0],[-1,0,1],[0,-1,1],[0,1,0]]){
  const r={g:new Group()},p={prev:{x,z}};const initial=talaGaitTargets(r,p,0,.14);const moving=talaGaitTargets(r,p,.15*Math.PI*2,.14);assert.ok(moving[lead].y>.2);assert.equal(moving[1-lead].y,.14);assert.ok(moving[1-lead].distanceTo(initial[1-lead])<1e-9);
  for(let i=16;i<100;i++){r.g.position.set(-z*i*.017,0,x*i*.017);const feet=talaGaitTargets(r,p,i/100*Math.PI*2,.14);assert.ok(feet[0].x<feet[1].x,'feet stay ordered');for(const foot of feet)assert.ok(foot.y>=.14-1e-9);}
 }
});
test('the first swing starts at the previous contact and touchdown returns to ground',()=>{
 const r={g:new Group(),footPlants:[new Vector3(-.25,.14,.24),new Vector3(.25,.14,-.24)]},p={prev:{x:1,z:0}};
 const start=talaGaitTargets(r,p,0,.14);assert.ok(start[0].distanceTo(r.footPlants[0])<1e-9);
 talaGaitTargets(r,p,.2*Math.PI*2,.14);const landed=talaGaitTargets(r,p,.22*Math.PI*2,.14);assert.equal(landed[0].y,.14);
});
