// Capture the real runtime block-brace pose for reproducible Blender review.
import {createHash} from 'node:crypto';
import {readFileSync,writeFileSync} from 'node:fs';
import {GLTFLoader} from '../dist/vendor/GLTFLoader.js';
import {createLiveTalaReview} from '../dist/tala-live-review.js';
globalThis.ProgressEvent??=class{constructor(type,data){this.type=type;Object.assign(this,data);}};
const bytes=readFileSync(new URL('../dist/assets/models/tala-design02.glb',import.meta.url)),length=bytes.readUInt32LE(12),gltf=JSON.parse(bytes.subarray(20,20+length));
gltf.buffers[0].uri='data:application/octet-stream;base64,'+bytes.subarray(28+length).toString('base64');delete gltf.images;delete gltf.textures;gltf.materials=gltf.materials.map(()=>({}));
const asset=await new GLTFLoader().parseAsync(JSON.stringify(gltf),'');
const review=createLiveTalaReview(asset.scene);
const names=JSON.parse(readFileSync(new URL('../art/blender/tala/motion-source.json',import.meta.url))).bones.map(b=>b.name);
const fps=30,frames=[];
for(const name of ['Guard + block','Combo']){
 const duration=name==='Combo'?1.6:2.4;
 for(let f=0;f<Math.round(duration*fps);f++){
  review.sample(name,f/fps);review.rig.g.updateMatrixWorld(true);
  const bones=[...review.rig.skeleton.bones,...review.rig.feet];
  if(bones.length!==names.length)throw Error('Bone mapping changed');
  frames.push({clip:name,time:f/fps,bones:bones.map((bone,i)=>({name:names[i],matrix:bone.matrixWorld.toArray().map(v=>+v.toFixed(7))}))});
 }
}
writeFileSync(new URL('../art/blender/tala-design02/motion-review.json',import.meta.url),JSON.stringify({assetSha256:createHash('sha256').update(bytes).digest('hex'),source:'Current live review animator, sampled at normal speed; no independent pose animation',fps,frames}));
console.log(`Saved ${frames.length} actual runtime poses at ${fps} fps.`);
