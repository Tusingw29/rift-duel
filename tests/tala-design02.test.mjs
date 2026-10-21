import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GLTFLoader} from '../dist/vendor/GLTFLoader.js';
import {Vector3} from '../dist/vendor/three.module.js';
import {createLiveTalaReview,LIVE_TALA_CLIPS} from '../dist/tala-live-review.js';
globalThis.ProgressEvent??=class{constructor(type,data){this.type=type;Object.assign(this,data);}};
const bytes=readFileSync(new URL('../dist/assets/models/tala-design02.glb',import.meta.url));
const len=bytes.readUInt32LE(12),json=JSON.parse(bytes.subarray(20,20+len));
test('Design 02 packs the baked face atlas and retains the combat skeleton',()=>{
 assert.ok(bytes.length<5_000_000);
 assert.ok(json.materials.some(m=>m.name==='Design02_face'&&m.pbrMetallicRoughness.baseColorTexture));
 assert.ok(!json.materials.some(m=>m.name==='Painted_face'));
 assert.ok(json.images.length>0&&json.images.every(i=>i.bufferView!==undefined));
 assert.equal(json.skins[0].joints.length,17);
});
test('baked face material points to an exported UV set without a custom shader extension',()=>{
 const materialIndex=json.materials.findIndex(m=>m.name==='Design02_face');
 const material=json.materials[materialIndex],map=material.pbrMetallicRoughness.baseColorTexture;
 const image=json.images[json.textures[map.index].source];
 assert.equal(image.name,'face-baked');
 const primitives=json.meshes.flatMap(m=>m.primitives).filter(p=>p.material===materialIndex);
 assert.ok(primitives.length>0);
 for(const p of primitives)assert.ok(p.attributes['TEXCOORD_'+(map.texCoord||0)]!==undefined);
 assert.equal(material.extensions,undefined);
});
// Geometry and live-animation checks do not pretend to validate browser texture decoding.
json.buffers[0].uri='data:application/octet-stream;base64,'+bytes.subarray(28+len).toString('base64');
const geometryJson=structuredClone(json);delete geometryJson.images;delete geometryJson.textures;geometryJson.materials=geometryJson.materials.map(()=>({}));
const asset=await new GLTFLoader().parseAsync(JSON.stringify(geometryJson),'');
test('new connected head and neck bind and remain finite through actual review actions',()=>{
 const review=createLiveTalaReview(asset.scene);
 const head=review.rig.g.children.find(n=>n.name.includes('Design02_connected_head_neck'));
 assert.ok(head?.isSkinnedMesh);
 const point=new Vector3(),samples=[];
 for(const clip of LIVE_TALA_CLIPS){
  for(const fraction of [0,.25,.5,.75,1]){
   review.sample(clip.name,clip.duration*fraction);review.rig.g.updateMatrixWorld(true);head.skeleton.update();
   for(let i=0;i<head.geometry.attributes.position.count;i+=37){
    head.getVertexPosition(i,point);assert.ok(point.toArray().every(v=>Number.isFinite(v)&&Math.abs(v)<7),clip.name);
   }
   if(clip.name==='Guard + block'&&fraction===.5)samples.push(review.rig.head.rotation.x);
  }
 }
 assert.ok(samples[0]>.3,'live guard still tucks the head');
});
test('upper body is one connected surface with normalized combat weights',()=>{
 let body;asset.scene.traverse(n=>{if(n.isSkinnedMesh&&n.name==='Design02_upper_body')body=n;});
 assert.ok(body,'connected torso/arms are exported separately for inspection');
 const geometry=body.geometry,count=geometry.attributes.position.count,index=geometry.index.array;
 const parent=Array.from({length:count},(_,i)=>i);
 const root=i=>{while(parent[i]!==i){parent[i]=parent[parent[i]];i=parent[i];}return i;};
 for(let i=0;i<index.length;i+=3){parent[root(index[i+1])]=root(index[i]);parent[root(index[i+2])]=root(index[i]);}
 assert.equal(new Set(parent.map((_,i)=>root(i))).size,1,'no disconnected shoulder or arm shells');
 const weights=geometry.attributes.skinWeight;
 for(let i=0;i<count;i++)assert.ok(Math.abs(weights.getX(i)+weights.getY(i)+weights.getZ(i)+weights.getW(i)-1)<1e-4);
});
test('connected shoulders remain bounded under guard and all combo contact poses',()=>{
 const review=createLiveTalaReview(asset.scene),point=new Vector3();
 const body=review.rig.g.children.find(n=>n.name==='concept-Design02_upper_body');assert.ok(body);
 for(const [clip,time] of [['Guard + block',.95],['Combo',17/60],['Combo',37/60],['Combo',57/60]]){
  review.sample(clip,time);review.rig.g.updateMatrixWorld(true);body.skeleton.update();
  assert.ok(Math.abs(review.rig.clothParts[0].rotation.z)<=.45,'fuller study ponytail keeps restrained swing');
  const positions=[];
  for(let i=0;i<body.geometry.attributes.position.count;i++){
   body.getVertexPosition(i,point);assert.ok(point.toArray().every(v=>Number.isFinite(v)&&Math.abs(v)<4));positions.push(point.clone());
  }
  const index=body.geometry.index.array;
  for(let i=0;i<index.length;i+=3)for(const [a,b] of [[index[i],index[i+1]],[index[i+1],index[i+2]],[index[i+2],index[i]]]){
   assert.ok(positions[a].distanceTo(positions[b])<.3,`${clip}: stretched shoulder triangle`);
  }
 }
});
test('tailored garments export standard cloth colors and normalized skinning',()=>{
 for(const name of ['Design02_ochre_cloth','Design02_rust_cloth']){
  const material=json.materials.findIndex(m=>m.name===name);assert.ok(material>=0,name);
  const primitives=json.meshes.flatMap(m=>m.primitives).filter(p=>p.material===material);
  assert.ok(primitives.length>0);
  for(const p of primitives)assert.ok(p.attributes.COLOR_0!==undefined,'cloth shading travels in standard vertex colors');
 }
 const review=createLiveTalaReview(asset.scene),point=new Vector3();
 const garments=review.rig.g.children.filter(n=>n.isSkinnedMesh&&/Design02_(vest|shorts)/.test(n.name));
 assert.equal(garments.length,2);
 for(const garment of garments){
  const weights=garment.geometry.attributes.skinWeight;
  for(let i=0;i<weights.count;i++)assert.ok(Math.abs(weights.getX(i)+weights.getY(i)+weights.getZ(i)+weights.getW(i)-1)<1e-4);
  for(const clip of LIVE_TALA_CLIPS){
   review.sample(clip.name,clip.duration*.5);review.rig.g.updateMatrixWorld(true);garment.skeleton.update();
   for(let i=0;i<weights.count;i+=11){garment.getVertexPosition(i,point);assert.ok(point.toArray().every(v=>Number.isFinite(v)&&Math.abs(v)<7));}
  }
 }
});
test('both sculpted fists are connected and follow their own hand bone',()=>{
 const review=createLiveTalaReview(asset.scene),point=new Vector3();
 for(const suffix of ['L','R']){
  const hand=review.rig.g.children.find(n=>n.name==='concept-Design02_fist'+suffix||n.name==='concept-Design02_fist.'+suffix);
  assert.ok(hand,`separate ${suffix} fist`);
  const g=hand.geometry,weights=g.attributes.skinWeight,joints=g.attributes.skinIndex;
  const parent=Array.from({length:g.attributes.position.count},(_,i)=>i);
  const root=i=>{while(parent[i]!==i){parent[i]=parent[parent[i]];i=parent[i];}return i;};
  const index=g.index.array;
  for(let i=0;i<index.length;i+=3){parent[root(index[i+1])]=root(index[i]);parent[root(index[i+2])]=root(index[i]);}
  assert.equal(new Set(parent.map((_,i)=>root(i))).size,1,'fingers and thumb connect to palm');
  for(let i=0;i<weights.count;i++){
   assert.ok(Math.abs(weights.getX(i)-1)<1e-5);
   assert.equal(hand.skeleton.bones[joints.getX(i)],review.rig.limbs[suffix==='L'?0:2].userData.hand);
  }
  for(const [clip,time] of [['Guard + block',.95],['Combo',17/60],['Combo',37/60],['Combo',57/60]]){
   review.sample(clip,time);review.rig.g.updateMatrixWorld(true);hand.skeleton.update();
   for(let i=0;i<weights.count;i+=13){hand.getVertexPosition(i,point);assert.ok(point.toArray().every(v=>Number.isFinite(v)&&Math.abs(v)<4));}
  }
 }
});
