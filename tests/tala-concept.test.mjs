import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {GLTFLoader} from '../dist/vendor/GLTFLoader.js';
import {Matrix4,Vector3} from '../dist/vendor/three.module.js';
import {buildTala} from '../dist/tala-model.js';import {attachTalaConcept} from '../dist/tala-concept.js';import {cloneRig} from '../dist/rig-clone.js';import {animateCharacter} from '../dist/animation.js';
// Load actual exported geometry/skin; skip browser-only bitmap decoding in Node.
globalThis.ProgressEvent??=class ProgressEvent{constructor(type,data){this.type=type;Object.assign(this,data);}};
const bytes=readFileSync(new URL('../dist/assets/models/tala-study.glb',import.meta.url)),len=bytes.readUInt32LE(12),json=JSON.parse(bytes.subarray(20,20+len));
json.buffers[0].uri='data:application/octet-stream;base64,'+bytes.subarray(28+len).toString('base64');delete json.images;delete json.textures;json.materials=json.materials.map(()=>({}));
const asset=await new GLTFLoader().parseAsync(JSON.stringify(json),'');
function rig(){const r=buildTala();r.conceptOriginalSurfaces=[];r.g.traverse(n=>{if(n.isMesh&&n!==r.aura)r.conceptOriginalSurfaces.push(n);});return r;}
test('actual concept asset binds to combat bones, preserves attachments and isolates instances',()=>{
 const a=rig(),b=rig(),hand=a.limbs[0].userData.hand;assert.equal(attachTalaConcept(a,asset.scene),true);attachTalaConcept(b,asset.scene);assert.equal(attachTalaConcept(a,asset.scene),false);
 assert.equal(a.limbs[0].userData.hand,hand);assert.ok(a.aura.visible);assert.ok(a.conceptOriginalSurfaces.every(n=>!n.visible));
 const surfaces=a.g.children.filter(n=>n.name.startsWith('concept-'));assert.equal(surfaces.length,11);
 for(const n of surfaces){assert.ok(n.skeleton.bones.every(Boolean));assert.ok(n.skeleton.bones.includes(hand));assert.ok(!n.skeleton.bones.includes(b.limbs[0].userData.hand));}
 const copy=cloneRig(a.g);assert.ok(copy.children.find(n=>n.name.startsWith('concept-')).skeleton.bones.every(bone=>bone!==hand));
});
test('concept surfaces follow combat pose and root travel without invalid or stretched coordinates',()=>{
 const r=rig();attachTalaConcept(r,asset.scene);const surfaces=r.g.children.filter(n=>n.name.startsWith('concept-'));const point=new Vector3(),inverse=new Matrix4();
 for(const anim of ['idle','run','guard','hurt','jump','defeat']){
  for(let frame=0;frame<12;frame++){animateCharacter(r,{anim,x:0,z:0,prev:{x:1,z:0},guard:anim==='guard',air:anim==='jump'?.7:0,animTime:.3},frame/60);r.g.position.set(12,0,-8);r.g.updateMatrixWorld(true);inverse.copy(r.g.matrixWorld).invert();
   for(const mesh of surfaces){mesh.skeleton.update();for(let i=0;i<mesh.geometry.attributes.position.count;i+=23){mesh.getVertexPosition(i,point);point.applyMatrix4(mesh.matrixWorld).applyMatrix4(inverse);assert.ok([point.x,point.y,point.z].every(v=>Number.isFinite(v)&&Math.abs(v)<5),`${anim}: ${point.toArray()}`);}}
  }
 }
});
test('live concept shoes stay level at guard and pivot at the ball during each punch',()=>{
 for(const chain of [1,2,3]){
  const r=rig();attachTalaConcept(r,asset.scene);r.g.position.set(4,0,-3);r.g.rotation.y=.7;r.g.scale.setScalar(chain===2?1.6:1);
  for(let f=0;f<20;f++)animateCharacter(r,{anim:'idle',guard:true,x:4,z:-3},f/60);
  r.g.updateMatrixWorld(true);for(const foot of r.feet){const up=new Vector3(0,1,0).applyQuaternion(foot.getWorldQuaternion(new (foot.quaternion.constructor)()));assert.ok(up.y>.999);}
  const move={kind:'strike',chain,startup:5,active:1,recovery:14,frame:0},player={anim:'strike',move,x:4,z:-3};
  animateCharacter(r,player,.4);r.g.updateMatrixWorld(true);const driver=chain===2?0:1,ball=r.feet[driver].localToWorld(r.footBall.clone()),heel=r.feet[driver].localToWorld(new Vector3(0,-.109,-.08));
  for(let frame=1;frame<=5;frame++){move.frame=frame;animateCharacter(r,player,.4+frame/60);}
  r.g.updateMatrixWorld(true);assert.ok(r.feet[driver].localToWorld(r.footBall.clone()).distanceTo(ball)<.002,'support ball stays planted');
  assert.ok(r.feet[driver].localToWorld(new Vector3(0,-.109,-.08)).y>heel.y+.08,'driving heel lifts');
  for(const mesh of r.g.children.filter(n=>n.name.startsWith('concept-Shoe'))){mesh.skeleton.update();const point=new Vector3();for(let v=0;v<mesh.geometry.attributes.position.count;v++){mesh.getVertexPosition(v,point).applyMatrix4(mesh.matrixWorld);assert.ok(point.y>-.005,'shoe stays above floor at contact');}}
  const q=r.feet[driver].quaternion.clone();animateCharacter(r,player,.4+5/60);assert.ok(q.angleTo(r.feet[driver].quaternion)<1e-5,'hitstop freezes pivot');
  move.frame=20;animateCharacter(r,player,.8);r.g.updateMatrixWorld(true);const up=new Vector3(0,1,0).applyQuaternion(r.feet[driver].getWorldQuaternion(q));assert.ok(up.y>.999,'recovery levels sole');
 }
});
test('live concept recoil catches weight on the rear foot then restores stance',()=>{
 const r=rig();attachTalaConcept(r,asset.scene);for(let i=0;i<15;i++)animateCharacter(r,{anim:'idle',x:0,z:0},i/60);
 r.g.updateMatrixWorld(true);const front=r.feet[0].getWorldPosition(new Vector3()),rear=r.feet[1].getWorldPosition(new Vector3());let peakLift=0,caught;r.g.rotation.z=.15;
 for(let f=0;f<=26;f++){const remaining=Math.max(0,.42-f/60);animateCharacter(r,{anim:'hurt',animTime:remaining,x:0,z:0},.3+f/60);r.g.updateMatrixWorld(true);const a=r.feet[0].getWorldPosition(new Vector3()),b=r.feet[1].getWorldPosition(new Vector3());assert.ok(a.distanceTo(front)<.003,'front support does not skate');peakLift=Math.max(peakLift,b.y-rear.y);if(f===10)caught=b.clone();}
 assert.ok(caught.z<rear.z-.17,'rear foot catches behind the stance');assert.ok(peakLift>.04,'catch foot lifts instead of sliding');assert.ok(r.feet[1].getWorldPosition(new Vector3()).distanceTo(rear)<.003,'rear foot recovers');
 const p={anim:'hurt',animTime:.3,x:0,z:0};animateCharacter(r,p,1);r.g.updateMatrixWorld(true);const frozen=r.feet[1].getWorldPosition(new Vector3());animateCharacter(r,p,1);r.g.updateMatrixWorld(true);assert.ok(r.feet[1].getWorldPosition(new Vector3()).distanceTo(frozen)<1e-6);
});
test('live directional gait stays finite and settles a lifted foot after stopping',()=>{
 for(const step of [.03,.06,.11])for(const [forward,side] of [[1,0],[-1,0],[0,1],[0,-1]]){
  const r=rig();attachTalaConcept(r,asset.scene);
  for(let f=0;f<45;f++){const x=-side*f*step,z=forward*f*step;r.g.position.set(x,0,z);animateCharacter(r,{anim:'run',prev:{x:forward,z:side},x,z},f/60);r.g.updateMatrixWorld(true);const a=r.feet[0].getWorldPosition(new Vector3()),b=r.feet[1].getWorldPosition(new Vector3());assert.ok(a.x<b.x,'feet do not cross in live solve');assert.ok([a,b].every(v=>Number.isFinite(v.y)&&v.y>.13&&v.y<.5),`${forward},${side} frame ${f}: ${a.toArray()} / ${b.toArray()}`);}
  const x=r.g.position.x,z=r.g.position.z;for(let f=45;f<65;f++)animateCharacter(r,{anim:'idle',x,z},f/60);r.g.updateMatrixWorld(true);for(const foot of r.feet)assert.ok(Math.abs(foot.getWorldPosition(new Vector3()).y-.14)<.003,'swing foot settles onto floor');
 }
});
test('an interrupted step preserves ankle position when guard, strike or hurt begins',()=>{
 for(const action of ['guard','strike','hurt']){
  const r=rig();attachTalaConcept(r,asset.scene);
  for(let f=0;f<=4;f++){r.g.position.z=f*.04;animateCharacter(r,{anim:'run',prev:{x:1,z:0},x:0,z:r.g.position.z},f/60);}
  r.g.updateMatrixWorld(true);const before=r.feet.map(foot=>foot.getWorldPosition(new Vector3()));
  const p={anim:action==='guard'?'idle':action,guard:action==='guard',animTime:.42,x:0,z:r.g.position.z};if(action==='strike')p.move={kind:'strike',chain:1,startup:5,active:1,recovery:14,frame:0};
  animateCharacter(r,p,5/60);r.g.updateMatrixWorld(true);r.feet.forEach((foot,i)=>assert.ok(foot.getWorldPosition(new Vector3()).distanceTo(before[i])<.025,`${action} entry keeps foot ${i} continuous`));
 }
});

import {createLiveTalaReview,LIVE_TALA_CLIPS} from '../dist/tala-live-review.js';
test('review uses live guard tuck and deeper impact brace',()=>{
 const review=createLiveTalaReview(asset.scene),r=review.rig;
 review.sample('Guard + block',.6);const normal=r.head.rotation.x;
 assert.ok(normal>.38);assert.ok(r.head.position.y<r.headRest.y-.05);
 review.sample('Guard + block',.95);assert.ok(r.head.rotation.x>normal+.06);
});
test('live review scrubbing resets animation history deterministically',()=>{
 const review=createLiveTalaReview(asset.scene);
 const snapshot=()=>{const out=[];review.rig.g.traverse(n=>{if(n.isBone)out.push(...n.position.toArray(),...n.quaternion.toArray());});return out;};
 for(const clip of LIVE_TALA_CLIPS){
  review.sample(clip.name,.8);const before=snapshot();review.sample(clip.name,.2);review.sample(clip.name,.8);assert.deepEqual(snapshot(),before,clip.name);
  review.sample(clip.name,clip.duration);assert.ok(snapshot().every(Number.isFinite));
 }
 review.sample('Advance',1.5);assert.ok(review.rig.g.position.z>3);
 review.sample('Retreat',1.5);assert.ok(review.rig.g.position.z< -3);
});
test('concept energy shot pivots rear heel without dragging the support ball',()=>{
 const review=createLiveTalaReview(asset.scene),r=review.rig;
 review.sample('Energy shot',.2);const ball=r.feet[1].localToWorld(r.footBall.clone()),heel=r.feet[1].localToWorld(new Vector3(0,-.109,-.08));
 review.sample('Energy shot',23/60);
 assert.ok(r.feet[1].localToWorld(r.footBall.clone()).distanceTo(ball)<.003);
 assert.ok(r.feet[1].localToWorld(new Vector3(0,-.109,-.08)).y>heel.y+.06);
 for(const mesh of r.g.children.filter(n=>n.name.startsWith('concept-Shoe'))){mesh.skeleton.update();const point=new Vector3();for(let v=0;v<mesh.geometry.attributes.position.count;v++){mesh.getVertexPosition(v,point).applyMatrix4(mesh.matrixWorld);assert.ok(point.y>-.005);}}
});
test('disc hop lifts both exported shoes and lands without further ankle drift',()=>{
 const review=createLiveTalaReview(asset.scene),r=review.rig;let peak=0;
 for(let frame=0;frame<=36;frame++){
  review.sample('Still-water discus',frame/60);
  for(const mesh of r.g.children.filter(n=>n.name.startsWith('concept-Shoe'))){mesh.skeleton.update();const v=new Vector3();for(let i=0;i<mesh.geometry.attributes.position.count;i++){mesh.getVertexPosition(i,v).applyMatrix4(mesh.matrixWorld);assert.ok(v.y>-.005,'shoe clears floor');}}
  peak=Math.max(peak,Math.min(...r.feet.map(f=>f.getWorldPosition(new Vector3()).y)));
 }
 assert.ok(peak>.28,'both feet leave the floor');
 const landing=r.feet.map(f=>f.getWorldPosition(new Vector3()));review.sample('Still-water discus',.75);
 r.feet.forEach((f,i)=>assert.ok(f.getWorldPosition(new Vector3()).distanceTo(landing[i])<.003,'landing stays planted'));
});
test('rush and flying kick keep exported shoes above floor through landing',()=>{
 for(const name of ['Rising rush','Skybreaker kick']){
  const review=createLiveTalaReview(asset.scene),r=review.rig;
  for(let frame=0;frame<=72;frame++){
   review.sample(name,frame/60);
   for(const mesh of r.g.children.filter(n=>n.name.startsWith('concept-Shoe'))){mesh.skeleton.update();const v=new Vector3();for(let i=0;i<mesh.geometry.attributes.position.count;i+=3){mesh.getVertexPosition(i,v).applyMatrix4(mesh.matrixWorld);assert.ok(v.y>-.015,`${name} frame ${frame}: ${v.y}`);}}
  }
 }
});
test('jump and air recovery clear the floor and settle into planted support',()=>{
 for(const name of ['Jump + land','Air recovery']){
  const review=createLiveTalaReview(asset.scene),r=review.rig;
  for(let frame=0;frame<=78;frame++){
   review.sample(name,frame/60);
   for(const mesh of r.g.children.filter(n=>n.name.startsWith('concept-Shoe'))){mesh.skeleton.update();const v=new Vector3();for(let i=0;i<mesh.geometry.attributes.position.count;i+=3){mesh.getVertexPosition(i,v).applyMatrix4(mesh.matrixWorld);assert.ok(v.y>-.015,`${name} ${frame}: ${v.y}`);}}
  }
  assert.ok(r.footPlants);assert.equal(r.g.position.y,0);assert.ok(r.head.rotation.x<.2,'landing releases chin brace');
 }
});
