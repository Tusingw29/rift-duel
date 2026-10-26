import test from 'node:test';import assert from 'node:assert/strict';
import {createFlowEnergy} from '../dist/flow-energy.js';
import {createInkBeam,createInkRing} from '../dist/ink-energy.js';
import {createSignature} from '../dist/energy-style.js';
import {DEFAULT_VFX,REFINED_VFX,setVfxSettings,resetVfxSettings} from '../dist/vfx-settings.js';
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
test('flow volumes are finite, have depth, and have distinct roster paths',()=>{
 const signatures=[];for(let id=0;id<6;id++){const g=createFlowEnergy('signature',id);let verts=[];g.traverse(n=>{if(!n.geometry)return;const p=n.geometry.attributes.position;assert.ok([...p.array].every(Number.isFinite));n.geometry.computeBoundingBox();assert.ok(n.geometry.boundingBox.max.z>n.geometry.boundingBox.min.z);verts.push(...p.array);});signatures.push(JSON.stringify(verts));}assert.equal(new Set(signatures).size,6);
});
test('flow switch hides legacy meshes, reuses resources and restores legacy visibility',()=>{
 resetVfxSettings();for(const g of [createInkBeam(),createInkRing(),createSignature(3)]){
  const legacy=[...g.children];setVfxSettings(REFINED_VFX);g.userData.updateInk(.4,false,.6);const flow=g.children.at(-1);assert.match(flow.name,/^flow-/);assert.ok(legacy.every(n=>!n.visible));let uniforms=[];flow.traverse(n=>{if(n.material?.uniforms)uniforms.push(n.material.uniforms.uTime.value);});assert.ok(uniforms.every(t=>t===.4));
  const count=g.children.length;g.userData.updateInk(.4,false,.6);assert.equal(g.children.length,count);g.userData.updateInk(10,true,.6);flow.traverse(n=>{if(n.material?.uniforms)assert.equal(n.material.uniforms.uTime.value,0);});setVfxSettings(DEFAULT_VFX);g.userData.updateInk(.4);assert.equal(flow.visible,false);assert.ok(legacy[0].visible);
 }resetVfxSettings();
});
test('imported masks match their recorded CC0 provenance hashes',()=>{
 const root=new URL('../dist/assets/vfx/kenney/',import.meta.url),manifest=JSON.parse(readFileSync(new URL('manifest.json',root)));assert.equal(manifest.license,'CC0-1.0');for(const file of manifest.files)assert.equal(createHash('sha256').update(readFileSync(new URL(file.name,root))).digest('hex'),file.sha256);assert.match(readFileSync(new URL('LICENSE.txt',root),'utf8'),/Creative Commons Zero/);
});
test('capture filaments and their shells rotate together and reverse seeking restores pose',()=>{
 const g=createFlowEnergy('capture');g.userData.updateFlow(.7);const before=g.children.map(n=>n.quaternion.toArray());for(let i=0;i<6;i+=2)assert.deepEqual(before[i],before[i+1]);g.userData.updateFlow(2);g.userData.updateFlow(.7);assert.deepEqual(g.children.map(n=>n.quaternion.toArray()),before);
});
