import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync,statSync} from 'node:fs';import {createHash} from 'node:crypto';
import {GLTFLoader} from '../dist/vendor/GLTFLoader.js';import * as T from '../dist/vendor/three.module.js';
import {createSignature} from '../dist/energy-style.js';import {createInkRing,createEnergyBurst} from '../dist/ink-energy.js';
import {blenderVfxStatus} from '../dist/blender-vfx.js';import {DEFAULT_VFX,REFINED_VFX,setVfxSettings,resetVfxSettings} from '../dist/vfx-settings.js';
const root=new URL('../dist/assets/vfx/blender/',import.meta.url),manifest=JSON.parse(readFileSync(new URL('manifest.json',root)));
test('Blender assets parse in the production loader, have volume, UVs and bounded draw/triangle counts',async()=>{
 for(const name of ['sol-shell','vesper-shell','capture-collar','release-burst']){
  const bytes=readFileSync(new URL(name+'.glb',root));assert.ok(bytes.length<200*1024);const gltf=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
  let triangles=0,meshes=0;gltf.scene.traverse(n=>{if(!n.isMesh)return;meshes++;const g=n.geometry;assert.ok(g.attributes.uv&&g.attributes.normal);assert.ok([...g.attributes.position.array].every(Number.isFinite));triangles+=(g.index?.count||g.attributes.position.count)/3;});assert.ok(meshes<=3&&meshes>0);assert.ok(triangles<3000);const size=new T.Box3().setFromObject(gltf.scene).getSize(new T.Vector3());assert.ok(size.x>.2&&size.y>.2&&size.z>.15,`${name} must read in depth`);assert.equal(gltf.animations.length,0);
 }
});
test('Blender files remain under disk budgets with hashes, original source and license recorded',()=>{
 assert.equal(manifest.generator,'Blender 3.6.23');assert.equal(manifest.license,'CC0-1.0');assert.match(manifest.source,/scripts\/vfx-blender/);
 for(const f of manifest.files){const b=readFileSync(new URL(f.name,root));assert.equal(b.length,f.bytes);assert.ok(b.length<(f.name.endsWith('.glb')?200:256)*1024);assert.equal(createHash('sha256').update(b).digest('hex'),f.sha256);if(f.name.endsWith('.png')){assert.equal(b.readUInt32BE(16),128);assert.equal(b.readUInt32BE(20),128);}}
 assert.match(readFileSync(new URL('LICENSE.txt',root),'utf8'),/CC0/);
});
test('default factories never request Blender assets and restore their legacy surfaces after preview',()=>{
 resetVfxSettings();const before=JSON.stringify(blenderVfxStatus());
 for(const g of [createSignature(4),createSignature(5),createInkRing(),createEnergyBurst()]){
  const originals=[...g.children];g.userData.updateInk(.2);assert.equal(g.children.length,originals.length);assert.equal(JSON.stringify(blenderVfxStatus()),before);
  setVfxSettings(REFINED_VFX);g.userData.updateInk(.2);const flow=g.children.at(-1);g.userData.updateInk(5,true);const snapshot=()=>{const a=[];flow.traverse(n=>{if(n.material)a.push([n.position.toArray(),n.material.opacity,n.material.uniforms?.uTime.value]);});return a;};const a=snapshot();g.userData.updateInk(9,true);assert.deepEqual(snapshot(),a);
  setVfxSettings(DEFAULT_VFX);g.userData.updateInk(.2);assert.equal(flow.visible,false);assert.ok(originals.every(n=>n.visible));
 }resetVfxSettings();
});
