import {moveTiming} from '../dist/moves.js';
import {fighters} from '../dist/fighters.js';
import {combatBoneIndex as BI,combatRigSpec} from '../dist/tala-combat-rig.js';
import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GLTFLoader} from '../dist/vendor/GLTFLoader.js';
import {Vector3,AnimationMixer} from '../dist/vendor/three.module.js';
import {createLiveTalaReview,LIVE_TALA_CLIPS} from '../dist/tala-live-review.js';
import {applyGraphicFlat} from '../dist/graphic-flat.js';
import {upgradeMaterials} from '../dist/shading.js';
globalThis.ProgressEvent??=class{constructor(t,data){Object.assign(this,data);}};
const bytes=readFileSync(new URL('../dist/assets/tala-graphic/tala-graphic.glb',import.meta.url));
const doc=JSON.parse(bytes.subarray(20,20+bytes.readUInt32LE(12)));
const asset=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
test('graphic Tala is a standalone texture-free skinned model with all live review clips',()=>{
 assert.equal(doc.images,undefined);assert.equal(doc.textures,undefined);
 assert.equal(doc.skins[0].joints.length,61);
 assert.deepEqual(asset.animations.map(c=>c.name),LIVE_TALA_CLIPS.map(c=>c.name));
 for(const name of ['head','eye_white_1','ponytail_center','vest','shorts','wrap_arm_L'])assert.ok(doc.meshes.some(m=>m.name==='TalaGraphic_'+name),name);
 for(const m of doc.materials)assert.ok(!m.pbrMetallicRoughness.baseColorTexture);
});
test('graphic skin keeps bind pose, normalized weights and finite deformations through every action',()=>{
 const {rig:r,sample}=createLiveTalaReview(asset.scene,{variant:'graphic'});r.g.updateMatrixWorld(true);
 const meshes=[];r.g.traverse(n=>{if(n.isSkinnedMesh&&n.name.startsWith('concept-'))meshes.push(n);});
 for(const mesh of meshes){mesh.skeleton.update();const w=mesh.geometry.attributes.skinWeight;
  for(let i=0;i<w.count;i++)assert.ok(Math.abs(w.getX(i)+w.getY(i)+w.getZ(i)+w.getW(i)-1)<1e-4);
  for(let i=0;i<w.count;i+=29)assert.ok(mesh.getVertexPosition(i,new Vector3()).distanceTo(new Vector3().fromBufferAttribute(mesh.geometry.attributes.position,i))<.001,mesh.name+' bind pose');
 }
 for(const clip of LIVE_TALA_CLIPS)for(const t of [0,.25,.5,.75,1]){sample(clip.name,t*clip.duration);for(const mesh of meshes){mesh.skeleton.update();for(let i=0;i<mesh.geometry.attributes.position.count;i+=37){const v=mesh.getVertexPosition(i,new Vector3());assert.ok(v.toArray().every(x=>Number.isFinite(x)&&Math.abs(x)<9),clip.name+' '+mesh.name);}}}
});
test('exported clips match runtime local bone transforms at sampled times',()=>{
 const live=createLiveTalaReview(asset.scene,{variant:'graphic'}),mixer=new AnimationMixer(asset.scene);
 let sourceBones;asset.scene.traverse(n=>{if(n.isSkinnedMesh)sourceBones=n.skeleton.bones;});
 const liveBones=live.rig.deformBones;
 for(const name of ['Guard + block','Combo','Retreat','Circle right','Recoil']){
  mixer.stopAllAction();const action=mixer.clipAction(asset.animations.find(c=>c.name===name));action.play();
  for(const time of [.3,.6,.9]){action.time=time;mixer.update(0);live.sample(name,time);sourceBones.forEach((b,i)=>{assert.ok(b.position.distanceTo(liveBones[i].position)<.001,name+' position '+i);assert.ok(b.quaternion.angleTo(liveBones[i].quaternion)<.001,name+' rotation '+i);});}
 }
});
test('flat materials survive global PBR upgrades and apply once per visible model',()=>{
 const scene=asset.scene;applyGraphicFlat(scene);assert.equal(applyGraphicFlat(scene),0);upgradeMaterials(scene);
 scene.traverse(n=>{if(n.isMesh){assert.ok(n.material.isMeshToonMaterial);assert.equal(n.material.userData.shadingProfile,'graphic-flat');assert.equal(n.material.toneMapped,false);}});
});
test('cloned materials regain the shader and neck/fist weights follow their intended joints',()=>{
 const {rig}=createLiveTalaReview(asset.scene,{variant:'graphic'});
 rig.g.traverse(n=>{if(!n.isSkinnedMesh||!n.name.startsWith('concept-'))return;
  assert.ok(n.material.graphicFlatReady,n.name+' cloned shader');
  const j=n.geometry.attributes.skinIndex,w=n.geometry.attributes.skinWeight;
  if(n.name.endsWith('_neck'))assert.ok(Array.from(j.array).includes(BI['neck.control']),'neck control has skin weights');
  if(n.name.includes('_fist_'))for(let i=0;i<j.count;i++){assert.ok([5,10].includes(j.getX(i)));assert.equal(w.getX(i),1);}
  if(n.name.includes('_wrap_arm_')){const S=n.name.endsWith('L')?'L':'R',allowed=[BI['upper_arm.'+S],BI['forearm.'+S],BI['hand.'+S],BI['upper_twist.'+S],BI['fore_twist.'+S]];for(const i of n.geometry.index.array){let sum=0;for(let k=0;k<4;k++)if(allowed.includes(j.array[i*4+k]))sum+=w.array[i*4+k];assert.ok(sum>.9);}}
 });
});
test('ponytail roots stay attached while tips swing, and articulated fingers retain their intended joints',async()=>{
 const fresh=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
 const tails=[],fingers=[];fresh.scene.traverse(n=>{if(n.isSkinnedMesh){if(n.name.includes('ponytail_'))tails.push(n);if(n.name.includes('finger_'))fingers.push(n);}});
 assert.equal(fingers.length,30);assert.ok(tails.length>=4);
 fresh.scene.updateMatrixWorld(true);
 const snapshots=tails.map(mesh=>{mesh.skeleton.update();const w=mesh.geometry.attributes.skinWeight,j=mesh.geometry.attributes.skinIndex;let root=-1,tip=-1;for(let i=0;i<w.count;i++){if(j.getX(i)===2&&w.getX(i)>.999)root=i;let tailWeight=0;for(let k=0;k<4;k++)if([13,BI['ponytail.mid'],BI['ponytail.tip']].includes(j.array[i*4+k]))tailWeight+=w.array[i*4+k];if(tailWeight>.999)tip=i;}assert.ok(root>=0&&tip>=0,mesh.name);return {mesh,root,tip,a:mesh.getVertexPosition(root,new Vector3()),b:mesh.getVertexPosition(tip,new Vector3())};});
 tails[0].skeleton.bones[13].rotation.x+=.5;fresh.scene.updateMatrixWorld(true);
 for(const {mesh,root,tip,a,b} of snapshots){mesh.skeleton.update();assert.ok(mesh.getVertexPosition(root,new Vector3()).distanceTo(a)<1e-5,mesh.name+' attached root');assert.ok(mesh.getVertexPosition(tip,new Vector3()).distanceTo(b)>.01,mesh.name+' moving tip');}
 for(const mesh of fingers){const j=mesh.geometry.attributes.skinIndex,w=mesh.geometry.attributes.skinWeight;for(let i=0;i<j.count;i++){assert.ok(combatRigSpec[j.getX(i)].name.startsWith('finger'));assert.equal(w.getX(i),1);}}
});
test('expanded rig drives neck, spine, wrists, fingers and toes without changing the combat bone contract',()=>{
 const {rig:r,sample}=createLiveTalaReview(asset.scene,{variant:'graphic'});const b=r.combatRig;
 assert.equal(r.deformBones.length,61);assert.equal(r.skeleton.bones.length,15);
 assert.equal(r.head.parent,b.get('neck.control'));assert.equal(r.spine.parent,b.get('spine.upper'));
 assert.equal(r.limbs[0].parent,b.get('clavicle.L'));assert.equal(r.limbs[1].parent,b.get('pelvis.control'));
 sample('Idle',0);const curl=b.get('finger0.0.L').rotation.x,roll=b.get('hand.L').rotation.y;
 assert.ok(curl<-.9);assert.ok(Math.abs(roll)>.5);assert.equal(b.get('hand.L').rotation.x,0,'wrist is not bent sideways to fake a fist');
 sample('Energy shot',(12+moveTiming(fighters[2],'shot').startup)/60);assert.ok(Math.abs(b.get('finger0.0.L').rotation.x)<Math.abs(curl)*.2,'palm opens through finger joints');
 sample('Guard + block',.6);assert.ok(Math.abs(b.get('neck.control').rotation.x)>.01,'neck participates in brace');
 sample('Combo',17/60);assert.ok(Math.abs(b.get('spine.lower').rotation.y)>.01,'punch twist is shared with lower spine');assert.ok(Math.abs(b.get('toe.R').rotation.x)>.01,'rear toe counter-rolls during punch');
 for(const S of ['L','R']){assert.ok(b.get('finger4.0.'+S).rotation.z*(S==='L'?-1:1)>0,'thumb folds across the fist');}
});
