// Retimes the portable review clips without rebuilding any model geometry, skin,
// materials, bind poses or rig nodes. Runtime pose authorship stays unchanged.
import {readFileSync,writeFileSync} from 'node:fs';
import {createHash} from 'node:crypto';
import assert from 'node:assert/strict';
import {GLTFLoader} from '../dist/vendor/GLTFLoader.js';
import {createLiveTalaReview,LIVE_TALA_CLIPS} from '../dist/tala-live-review.js';
const folder=new URL('../dist/assets/tala-graphic/',import.meta.url),path=new URL('tala-graphic.glb',folder);
const bytes=readFileSync(path),length=bytes.readUInt32LE(12),doc=JSON.parse(bytes.subarray(20,20+length)),binary=bytes.subarray(28+length);
const firstAccessor=Math.min(...doc.animations.flatMap(a=>a.samplers.flatMap(s=>[s.input,s.output])));
const firstView=Math.min(...doc.accessors.slice(firstAccessor).map(a=>a.bufferView));
const offsetStart=doc.bufferViews[firstView].byteOffset;
// Require a contiguous animation-only suffix before replacing it.
for(const mesh of doc.meshes)for(const p of mesh.primitives)for(const i of [p.indices,...Object.values(p.attributes)])assert.ok(i<firstAccessor);
for(const skin of doc.skins)assert.ok(skin.inverseBindMatrices<firstAccessor);
const identity=()=>JSON.stringify({nodes:doc.nodes,meshes:doc.meshes,skins:doc.skins,materials:doc.materials,scenes:doc.scenes});
const originalIdentity=identity(),modelBytes=binary.subarray(0,offsetStart),hash=b=>createHash('sha256').update(b).digest('hex');
globalThis.ProgressEvent??=class{constructor(type,data){Object.assign(this,data);}};
const asset=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
const review=createLiveTalaReview(asset.scene,{variant:'graphic'}),bones=review.rig.deformBones;
doc.accessors=doc.accessors.slice(0,firstAccessor);doc.bufferViews=doc.bufferViews.slice(0,firstView);doc.animations=[];
let offset=offsetStart;const chunks=[modelBytes];
function access(values,type,extra={}){const b=Buffer.from(new Float32Array(values).buffer),pad=(4-b.length%4)%4,view=doc.bufferViews.length;chunks.push(b,Buffer.alloc(pad));doc.bufferViews.push({buffer:0,byteOffset:offset,byteLength:b.length});offset+=b.length+pad;doc.accessors.push({bufferView:view,componentType:5126,type,count:values.length/({SCALAR:1,VEC3:3,VEC4:4}[type]),...extra});return doc.accessors.length-1;}
for(const clip of LIVE_TALA_CLIPS){
 const tracks=bones.map(()=>({p:[],q:[],s:[]})),times=[];
 for(let f=0;f<=Math.ceil(clip.duration*30);f++){const t=Math.min(clip.duration,f/30);times.push(t);review.sample(clip.name,t);bones.forEach((b,i)=>{tracks[i].p.push(...b.position.toArray());tracks[i].q.push(...b.quaternion.toArray());tracks[i].s.push(...b.scale.toArray());});}
 const input=access(times,'SCALAR',{min:[0],max:[clip.duration]}),animation={name:clip.name,samplers:[],channels:[],extras:{source:'runtime animator, local skeletal motion; root travel remains gameplay-controlled',fps:30}};
 tracks.forEach((track,i)=>{for(const [key,path,type] of [['p','translation','VEC3'],['q','rotation','VEC4'],['s','scale','VEC3']]){const sampler=animation.samplers.length;animation.samplers.push({input,output:access(track[key],type),interpolation:'LINEAR'});animation.channels.push({sampler,target:{node:i,path}});}});doc.animations.push(animation);
}
assert.equal(identity(),originalIdentity);
const bin=Buffer.concat(chunks);assert.ok(bin.subarray(0,offsetStart).equals(modelBytes));doc.buffers[0].byteLength=bin.length;
const json=Buffer.from(JSON.stringify(doc)),pad=(4-json.length%4)%4,header=Buffer.alloc(20),bh=Buffer.alloc(8);header.write('glTF');header.writeUInt32LE(2,4);header.writeUInt32LE(28+json.length+pad+bin.length,8);header.writeUInt32LE(json.length+pad,12);header.write('JSON',16);bh.writeUInt32LE(bin.length);bh.write('BIN\0',4);
const result=Buffer.concat([header,json,Buffer.alloc(pad,32),bh,bin]);writeFileSync(path,result);
const manifestPath=new URL('manifest.json',folder),manifest=JSON.parse(readFileSync(manifestPath));Object.assign(manifest,{modelSHA256:hash(result),bytes:result.length,clips:LIVE_TALA_CLIPS,clipRefresh:{modelDataSHA256:hash(modelBytes),modelDefinitionSHA256:hash(originalIdentity),preservedModelBytes:offsetStart,geometryRigAndMaterialsUnchanged:true}});writeFileSync(manifestPath,JSON.stringify(manifest,null,2));console.log(JSON.stringify(manifest.clipRefresh));
