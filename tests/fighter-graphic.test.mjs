import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,existsSync} from 'node:fs';
import {GLTFLoader} from '../dist/vendor/GLTFLoader.js';
import {Vector3} from '../dist/vendor/three.module.js';
import {buildCharacter} from '../dist/characters.js';import {attachFighterModel} from '../dist/tala-concept.js';import {animateCharacter} from '../dist/animation.js';
import {fighters} from '../dist/fighters.js';
globalThis.ProgressEvent??=class ProgressEvent{constructor(type,data){this.type=type;Object.assign(this,data);}};
// The graphic roster bodies are derived from the textured builds by scripts/build-fighter-graphic.mjs:
// same geometry, joints and metrics, flat palette materials, alpha cards only where a silhouette is needed.
const roster=fighters.filter(f=>f.id!=='tala');
async function load(id){
 const bytes=readFileSync(new URL(`../dist/assets/models/${id}-graphic.glb`,import.meta.url)),len=bytes.readUInt32LE(12),json=JSON.parse(bytes.subarray(20,20+len));
 const stripped=structuredClone(json);stripped.buffers[0].uri='data:application/octet-stream;base64,'+bytes.subarray(28+len).toString('base64');delete stripped.images;delete stripped.textures;
 for(const m of stripped.materials)delete m.pbrMetallicRoughness.baseColorTexture;
 return {json,asset:await new GLTFLoader().parseAsync(JSON.stringify(stripped),''),bytes:bytes.length};
}
test('every roster fighter has a graphic flat-colour body',()=>{
 for(const f of roster)assert.ok(existsSync(new URL(`../dist/assets/models/${f.id}-graphic.glb`,import.meta.url)),f.id);
});
for(const f of roster)test(`${f.name}: graphic body keeps the textured build's joints, drops the surface textures and attaches with the two-tone shader`,async()=>{
 const {json,asset,bytes}=await load(f.id);
 const textured=JSON.parse(readFileSync(new URL(`../dist/assets/models/${f.id}-v3.glb`,import.meta.url)).subarray(20,20+readFileSync(new URL(`../dist/assets/models/${f.id}-v3.glb`,import.meta.url)).readUInt32LE(12)));
 assert.deepEqual(json.nodes.map(n=>n.name),textured.nodes.map(n=>n.name),'same node order as the textured build');
 assert.deepEqual(json.scenes[0].extras.joints,textured.scenes[0].extras.joints);assert.deepEqual(json.scenes[0].extras.rigSpec,textured.scenes[0].extras.rigSpec);
 assert.equal(json.scenes[0].extras.artStyle,'graphic-flat');assert.equal(json.skins[0].joints.length,61);
 for(const m of json.materials){assert.ok(m.name.startsWith('Graphic_'),m.name);assert.ok(m.extras.graphicFlat);}
 const withTexture=json.materials.filter(m=>m.pbrMetallicRoughness.baseColorTexture).map(m=>m.extras.paletteRole).sort();
 assert.deepEqual(withTexture,['eyebrows','eyelashes','eyes','hair'],'only silhouette cards and the eyes keep an image');
 for(const role of ['skin','outfit','shoes']){const m=json.materials.find(m=>m.extras.paletteRole===role);assert.ok(m,role);assert.ok(m.pbrMetallicRoughness.baseColorFactor.slice(0,3).some(v=>v>0.005),role+' has a colour');}
 assert.ok(bytes<2.2e6,`compact (${bytes} bytes)`);
 const index=fighters.indexOf(f),r=buildCharacter(index);
 assert.equal(attachFighterModel(r,asset.scene),true);
 assert.equal(r.g.userData.artStyle,'graphic-flat');assert.equal(r.deformBones?.length,61);
 let toon=0,plain=[];r.g.traverse(n=>{if(n.isMesh&&n.visible&&n!==r.aura&&n!==r.techniqueFX&&n!==r.techniqueRing){if(n.material.isMeshToonMaterial)toon++;else plain.push(n.name);}});
 assert.ok(toon>0,'two-tone shader applied');assert.deepEqual(plain,[],'every visible surface, costume piece and weapon is two-tone');
 r.g.updateMatrixWorld(true);const surfaces=[];r.g.traverse(n=>{if(n.isSkinnedMesh&&n.name.startsWith('concept-'))surfaces.push(n);});
 for(const mesh of surfaces){mesh.skeleton.update();const p=mesh.geometry.attributes.position;for(let i=0;i<p.count;i+=53)assert.ok(mesh.getVertexPosition(i,new Vector3()).distanceTo(new Vector3().fromBufferAttribute(p,i))<.001,mesh.name+' bind pose');}
 for(let i=0;i<30;i++){animateCharacter(r,{anim:i<10?'idle':i<20?'run':'strike',x:0,z:0,guard:i%7===0,move:i>=20?{kind:'strike',chain:1,startup:5,active:1,recovery:14,total:20,frame:i-20}:null},i/60);}
 r.g.updateMatrixWorld(true);for(const mesh of surfaces){mesh.skeleton.update();for(let i=0;i<mesh.geometry.attributes.position.count;i+=97){const v=mesh.getVertexPosition(i,new Vector3());assert.ok(v.toArray().every(x=>Number.isFinite(x)&&Math.abs(x)<9),mesh.name);}}
});
