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
// Connectivity across UV seams: vertices at the same position count as one.
function connectedComponents(geometry){const pos=geometry.attributes.position,count=pos.count,key=new Map(),canon=new Array(count);for(let i=0;i<count;i++){const k=`${pos.getX(i).toFixed(4)},${pos.getY(i).toFixed(4)},${pos.getZ(i).toFixed(4)}`;if(!key.has(k))key.set(k,i);canon[i]=key.get(k);}const parent=Array.from({length:count},(_,i)=>canon[i]);const root=i=>{while(parent[i]!==i){parent[i]=parent[parent[i]];i=parent[i];}return i;};const index=geometry.index.array;for(let i=0;i<index.length;i+=3){parent[root(index[i+1])]=root(index[i]);parent[root(index[i+2])]=root(index[i]);}return new Set(parent.map((_,i)=>root(i))).size;}
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
 const geometry=body.geometry,count=geometry.attributes.position.count;
 assert.equal(connectedComponents(geometry),1,'no disconnected shoulder or arm shells');
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
  assert.equal(connectedComponents(g),1,'fingers and thumb connect to palm');
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
test('cloth wraps retain color detail and bend with the live guard and movement',()=>{
 const material=json.materials.findIndex(m=>m.name==='Design02_wrap_cloth');assert.ok(material>=0);
 const primitives=json.meshes.flatMap(m=>m.primitives).filter(p=>p.material===material);
 assert.equal(primitives.length,1,'shared cloth submits as one primitive');
 for(const p of primitives)assert.ok(p.attributes.COLOR_0!==undefined);
 const review=createLiveTalaReview(asset.scene),point=new Vector3();
 const wraps=review.rig.g.children.filter(n=>/Design02_wraps/.test(n.name));assert.equal(wraps.length,1);
 const weights=wraps[0].geometry.attributes.skinWeight,joints=wraps[0].geometry.attributes.skinIndex,used=new Set();
 for(let i=0;i<weights.count;i++)for(let c=0;c<4;c++)if(weights.array[i*4+c]>0)used.add(joints.array[i*4+c]);
 assert.equal(used.size,6,'both hands, forearms and shins retain their influences');
 for(const clip of LIVE_TALA_CLIPS){
  review.sample(clip.name,clip.duration*.5);review.rig.g.updateMatrixWorld(true);
  for(const wrap of wraps){wrap.skeleton.update();
   for(let i=0;i<wrap.geometry.attributes.position.count;i+=17){wrap.getVertexPosition(i,point);assert.ok(point.toArray().every(v=>Number.isFinite(v)&&Math.abs(v)<7));}
  }
 }
});

test('Design 02 mirror fighters and afterimages keep independent skeletons',async()=>{
 const {cloneRig}=await import('../dist/rig-clone.js');
 const a=createLiveTalaReview(asset.scene),b=createLiveTalaReview(asset.scene);
 a.sample('Combo',17/60);b.sample('Guard + block',.95);
 const find=r=>r.g.children.find(n=>n.name==='concept-Design02_upper_body');
 const meshA=find(a.rig),meshB=find(b.rig);assert.notEqual(meshA.skeleton,meshB.skeleton);
 assert.notEqual(meshA.material,meshB.material);assert.notEqual(meshA.geometry,meshB.geometry);
 const ghost=cloneRig(a.rig.g),ghostMesh=ghost.children.find(n=>n.name===meshA.name);
 ghost.updateMatrixWorld(true);ghostMesh.skeleton.update();
 const index=100,before=new Vector3(),after=new Vector3();ghostMesh.getVertexPosition(index,before);
 const otherHead=b.rig.head.quaternion.clone();
 a.sample('Recoil',.5);a.rig.g.updateMatrixWorld(true);meshA.skeleton.update();
 ghost.updateMatrixWorld(true);ghostMesh.skeleton.update();ghostMesh.getVertexPosition(index,after);
 assert.ok(before.distanceTo(after)<1e-7,'afterimage keeps the captured pose');
 assert.ok(b.rig.head.quaternion.angleTo(otherHead)<1e-7,'opponent is unaffected');
});
