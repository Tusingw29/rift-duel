import test from 'node:test';import assert from 'node:assert/strict';
import {Vector3} from '../dist/vendor/three.module.js';import {buildTala} from '../dist/tala-model.js';import {animateCharacter} from '../dist/animation.js';import {strikePose} from '../dist/tala-animation.js';
function sample(r,p,start,count){for(let i=0;i<count;i++)animateCharacter(r,p,start+i/60);r.g.updateMatrixWorld(true);}
function hands(r){return [0,2].map(i=>r.spine.worldToLocal(r.limbs[i].userData.hand.getWorldPosition(new Vector3())));}
test('live Tala guard crosses hands over the chest during hold and block recoil',()=>{
 for(const blockStun of [0,.22]){const r=buildTala();r.g.position.set(5,0,-4);r.g.rotation.y=1.2;sample(r,{anim:'idle',x:5,z:-4},0,15);sample(r,{anim:'idle',guard:true,blockStun,x:5,z:-4},.25,20);const [left,right]=hands(r);assert.ok(left.x>.17&&right.x<-.17);assert.ok(left.y>.42&&right.y>.42);assert.ok(left.z>.25&&right.z>left.z+.04);}
});
test('cross guard releases continuously and cannot soften the next strike contact',()=>{
 const r=buildTala();sample(r,{anim:'idle',guard:true,x:0,z:0},0,20);const before=r.limbs[0].quaternion.clone();animateCharacter(r,{anim:'idle',x:0,z:0},20/60);assert.ok(before.angleTo(r.limbs[0].quaternion)<.15);
 sample(r,{anim:'idle',x:0,z:0},21/60,20);assert.ok(before.angleTo(r.limbs[0].quaternion)>.4);
 sample(r,{anim:'idle',guard:true,x:0,z:0},1,20);const move={kind:'strike',chain:1,startup:5,active:1,recovery:14,frame:0};
 for(let i=0;i<=5;i++){move.frame=i;animateCharacter(r,{anim:'strike',move,x:0,z:0},1.4+i/60);}
 const contact=strikePose(move);for(const k of ['rax','ray','raz','re'])assert.ok(Math.abs(r.pose[k]-contact[k])<1e-9);
});
test('guard retracts the neck, tucks the chin further on impact and releases without a neck snap',()=>{
 const r=buildTala(),rest=r.head.position.clone();sample(r,{anim:'idle',x:0,z:0},0,15);sample(r,{anim:'idle',guard:true,x:0,z:0},.25,20);
 const guardY=r.head.position.y,guardPitch=r.head.rotation.x;assert.ok(guardY<rest.y-.04);assert.ok(r.head.position.z<rest.z-.02);assert.ok(guardPitch>.38);
 sample(r,{anim:'idle',guard:true,blockStun:.22,x:0,z:0},.6,20);assert.ok(r.head.position.y<guardY-.01);assert.ok(r.head.rotation.x>guardPitch+.1);
 const before=r.head.position.clone();animateCharacter(r,{anim:'jump',air:.5,x:0,z:0},.94);assert.ok(r.head.position.distanceTo(before)<.025,'fallback starts at the braced neck position');sample(r,{anim:'jump',air:.5,x:0,z:0},.96,20);assert.ok(r.head.position.distanceTo(rest)<1e-6,'airborne fallback restores neck');
});
