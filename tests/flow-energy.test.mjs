import test from 'node:test';import assert from 'node:assert/strict';
import {createFlowEnergy} from '../dist/flow-energy.js';
import {createInkBeam,createInkRing,createEnergyBurst} from '../dist/ink-energy.js';
import {createSignature} from '../dist/energy-style.js';
import {DEFAULT_VFX,REFINED_VFX,setVfxSettings,resetVfxSettings} from '../dist/vfx-settings.js';
import {readFileSync} from 'node:fs';import {createHash} from 'node:crypto';
test('flow volumes are finite, have depth, and have distinct roster paths',()=>{
 const signatures=[];for(let id=0;id<6;id++){const g=createFlowEnergy('signature',id);let verts=[];g.traverse(n=>{if(!n.geometry)return;const p=n.geometry.attributes.position;assert.ok([...p.array].every(Number.isFinite));n.geometry.computeBoundingBox();assert.ok(n.geometry.boundingBox.max.z>n.geometry.boundingBox.min.z);verts.push(...p.array);});signatures.push(JSON.stringify(verts));}assert.equal(new Set(signatures).size,6);
});
test('flow switch hides legacy meshes, reuses resources and restores legacy visibility',()=>{
 resetVfxSettings();for(const g of [createInkBeam(),createInkRing(),createSignature(3),createEnergyBurst()]){
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
test('Morrow retains a dark backing and saturated cutting surface through palette changes',()=>{
 const g=createFlowEnergy('signature',3,'#ba324d');g.userData.updateFlow(.4,false,.7,'#ba324d');
 const shadow=g.getObjectByName('energy-shadow-blade'),sheet=g.getObjectByName('energy-cutting-sheet');assert.ok(shadow&&sheet);assert.ok(shadow.material.color.r<sheet.material.color.r*.3);assert.equal(sheet.material.uniforms.uWhiten.value,0);assert.equal(sheet.material.uniforms.uOpacity.value,.63);
 g.userData.updateFlow(.4,false,0,'#125588');assert.equal(shadow.material.opacity,0);assert.equal(sheet.material.uniforms.uOpacity.value,0);assert.ok(sheet.material.color.b>sheet.material.color.r);
});
test('roster cinders seek deterministically, remain still in reduced motion, and fade with their parent',()=>{
 for(const id of [1,2,3,4,5]){
  const g=createFlowEnergy('signature',id),snapshot=()=>g.children.map(n=>[...n.position.toArray(),n.material?.opacity]);g.userData.updateFlow(.3);const a=snapshot();g.userData.updateFlow(2);g.userData.updateFlow(.3);assert.deepEqual(snapshot(),a);g.userData.updateFlow(10,true);const b=snapshot();g.userData.updateFlow(11,true);assert.deepEqual(snapshot(),b);g.userData.updateFlow(.3,false,0);g.traverse(n=>{if(n.material&&!n.material.uniforms)assert.equal(n.material.opacity,0);});
 }
});

test('flowing projectiles expose vertical silhouette and restore the legacy orientation when switched off',async()=>{
 const {createProjectileVisual,updateProjectileVisual}=await import('../dist/projectile-visuals.js');
 const b=createProjectileVisual(),p={x:0,z:0,dx:1,dz:0,kind:'bolt',radius:.4};
 for(const id of [1,3,4,5]){setVfxSettings(REFINED_VFX);updateProjectileVisual(b,p,'#ffffff',.4,false,id);const g=b.userData.signatures[id];assert.equal(g.rotation.x,Math.PI/4);assert.equal(g.rotation.y,.35);setVfxSettings(DEFAULT_VFX);updateProjectileVisual(b,p,'#ffffff',.4,false,id);assert.equal(g.rotation.x,Math.PI/2);assert.equal(g.rotation.y,0);assert.equal(b.rotation.y,Math.PI/2);}
 resetVfxSettings();assert.deepEqual(p,{x:0,z:0,dx:1,dz:0,kind:'bolt',radius:.4});
});
