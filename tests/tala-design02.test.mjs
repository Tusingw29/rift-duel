import test from 'node:test';
import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GLTFLoader} from '../dist/vendor/GLTFLoader.js';
import {Vector3} from '../dist/vendor/three.module.js';
import {createLiveTalaReview,LIVE_TALA_CLIPS} from '../dist/tala-live-review.js';
globalThis.ProgressEvent??=class{constructor(type,data){this.type=type;Object.assign(this,data);}};
const bytes=readFileSync(new URL('../dist/assets/models/tala-design02.glb',import.meta.url));
const len=bytes.readUInt32LE(12),json=JSON.parse(bytes.subarray(20,20+len));
test('Design 02 packs the new face source and retains the combat skeleton',()=>{
 assert.ok(bytes.length<5_000_000);
 assert.ok(json.materials.some(m=>m.name==='Design02_face'&&m.pbrMetallicRoughness.baseColorTexture));
 assert.ok(!json.materials.some(m=>m.name==='Painted_face'));
 assert.ok(json.images.length>0&&json.images.every(i=>i.bufferView!==undefined));
 assert.equal(json.skins[0].joints.length,17);
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
