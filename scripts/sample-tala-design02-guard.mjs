// Capture the real runtime block-brace pose for reproducible Blender review.
import {readFileSync,writeFileSync} from 'node:fs';
import {GLTFLoader} from '../dist/vendor/GLTFLoader.js';
import {createLiveTalaReview} from '../dist/tala-live-review.js';
globalThis.ProgressEvent??=class{constructor(type,data){this.type=type;Object.assign(this,data);}};
const bytes=readFileSync(new URL('../dist/assets/models/tala-design02.glb',import.meta.url)),length=bytes.readUInt32LE(12),gltf=JSON.parse(bytes.subarray(20,20+length));
gltf.buffers[0].uri='data:application/octet-stream;base64,'+bytes.subarray(28+length).toString('base64');delete gltf.images;delete gltf.textures;gltf.materials=gltf.materials.map(()=>({}));
const asset=await new GLTFLoader().parseAsync(JSON.stringify(gltf),'');
const review=createLiveTalaReview(asset.scene);review.sample('Guard + block',.95);review.rig.g.updateMatrixWorld(true);
const names=JSON.parse(readFileSync(new URL('../art/blender/tala/motion-source.json',import.meta.url))).bones.map(b=>b.name);
const bones=[...review.rig.skeleton.bones,...review.rig.feet];
if(bones.length!==names.length)throw Error('Review skeleton does not match export skeleton');
writeFileSync(new URL('../art/blender/tala-design02/guard-pose.json',import.meta.url),JSON.stringify({source:'Current live review: Guard + block at 0.95 seconds',bones:bones.map((bone,i)=>({name:names[i],matrix:bone.matrixWorld.toArray()}))},null,2)+'\n');
console.log('Saved runtime block-brace pose for Blender review.');
