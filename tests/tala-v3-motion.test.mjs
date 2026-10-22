import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GLTFLoader} from '../dist/vendor/GLTFLoader.js';
import {Vector3} from '../dist/vendor/three.module.js';
import {createLiveTalaReview,LIVE_TALA_CLIPS} from '../dist/tala-live-review.js';
import {applyPose,plantSupportFeet} from '../dist/rig-pose.js';
import {stance} from '../dist/tala-animation.js';
globalThis.ProgressEvent??=class{constructor(type,data){Object.assign(this,data);}};
const bytes=readFileSync(new URL('../dist/assets/models/tala-v3.glb',import.meta.url));
const length=bytes.readUInt32LE(12),json=JSON.parse(bytes.subarray(20,20+length));
json.buffers[0].uri='data:application/octet-stream;base64,'+bytes.subarray(28+length).toString('base64');
delete json.images;delete json.textures;json.materials=json.materials.map(()=>({}));
const asset=await new GLTFLoader().parseAsync(JSON.stringify(json),'');
test('Design 03 review uses its actual bind skeleton and every live action remains finite',()=>{
 const review=createLiveTalaReview(asset.scene,{variant:'v3'}),r=review.rig;
 assert.equal(r.variant,'v3');assert.notEqual(r.legLength,r.shinLength);
 r.g.updateMatrixWorld(true);
 for(const mesh of r.g.children.filter(n=>n.isSkinnedMesh&&n.name.startsWith('concept-'))){
  mesh.skeleton.update();
  for(let i=0;i<mesh.geometry.attributes.position.count;i+=43){
   const rest=new Vector3().fromBufferAttribute(mesh.geometry.attributes.position,i);
   assert.ok(mesh.getVertexPosition(i,new Vector3()).distanceTo(rest)<.001,'bind pose must preserve new body');
  }
 }
 for(const clip of LIVE_TALA_CLIPS)for(const fraction of [0,.25,.5,.75,1]){
  review.sample(clip.name,clip.duration*fraction);
  for(const bone of r.skeleton.bones)assert.ok(bone.matrixWorld.elements.every(Number.isFinite),clip.name);
  for(const mesh of r.g.children.filter(n=>n.isSkinnedMesh&&n.name.startsWith('concept-'))){
   mesh.skeleton.update();
   for(let i=0;i<mesh.geometry.attributes.position.count;i+=41){
    const point=mesh.getVertexPosition(i,new Vector3());
    assert.ok(point.toArray().every(v=>Number.isFinite(v)&&Math.abs(v)<9),clip.name+' '+mesh.name);
   }
  }
 }
});
test('unequal Design 03 legs reach planted ankles while hips shift',()=>{
 const {rig:r}=createLiveTalaReview(asset.scene,{variant:'v3'});
 // Isolate leg solving from intentional heel pivots and recoil offsets.
 r.footPivot=null;r.footOffsets=null;r.footBall=null;
 for(const x of [-.06,0,.06])for(const z of [-.12,0,.18]){
  r.body.position.set(0,0,0);applyPose(r,{...stance,bodyX:x,bodyZ:z});
  r.footPlants=[new Vector3(-.25,r.ankleHeight,.24),new Vector3(.25,r.ankleHeight,-.24)];
  plantSupportFeet(r,{anim:'idle'},'idle');r.g.updateMatrixWorld(true);
  r.feet.forEach((foot,i)=>assert.ok(foot.getWorldPosition(new Vector3()).distanceTo(r.footPlants[i])<1e-5,'ankle stays on support target'));
 }
});

test('tailored costume and fringe retain normalized weights and embedded cloth textures',()=>{
 const packed=JSON.parse(bytes.subarray(20,20+length));
 // Three.js/Node build: fabric and wrap textures are embedded, and the tailored parts are separate skinned meshes.
 for(const name of ['top','shorts','undertop','wraps','skin','hair'])assert.ok(packed.images.some(i=>i.name===name),'image '+name);
 assert.ok(packed.images.every(i=>i.bufferView!==undefined));
 const names=json.nodes.map(m=>m.name||'').join(' ');
 for(const name of ['TalaV3_vest','TalaV3_wrap_arm_L','TalaV3_wrap_shin_R','TalaV3_collar','TalaV3_fringe','TalaV3_shorts','TalaV3_hair'])assert.ok(names.includes(name),name);
 asset.scene.traverse(mesh=>{
  if(!mesh.isSkinnedMesh)return;
  const w=mesh.geometry.attributes.skinWeight;
  for(let i=0;i<w.count;i++)assert.ok(Math.abs(w.getX(i)+w.getY(i)+w.getZ(i)+w.getW(i)-1)<1e-4,mesh.name+' weights');
 });
});
