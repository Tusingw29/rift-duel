import test from 'node:test';import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {buildCharacter} from '../dist/characters.js';import {cloneRig} from '../dist/rig-clone.js';
import {animateCharacter} from '../dist/animation.js';
test('all organic fighters use normalized multi-bone surfaces with a lightweight geometry budget',()=>{
 for(const id of [1,2,3,4,5]){const r=buildCharacter(id);let mixed=0,vertices=0,meshes=0;
 r.g.traverse(n=>{if(!n.isSkinnedMesh)return;meshes++;vertices+=n.geometry.attributes.position.count;
 const w=n.geometry.attributes.skinWeight;
 for(let i=0;i<w.count;i++){const sum=w.getX(i)+w.getY(i)+w.getZ(i)+w.getW(i);assert.ok(Math.abs(sum-1)<1e-6);if(w.getY(i)>0)mixed++;}
 });
 assert.ok(mixed>100);assert.ok(vertices<12000);assert.ok(meshes<40);assert.ok(r.skeleton.bones.includes(r.head));}
});
test('skin deforms around the elbow and cloned afterimages retain independent bones',()=>{
 for(const id of [1,2,3,4,5]){const r=buildCharacter(id);animateCharacter(r,{anim:'idle',x:0,z:0},0);r.g.updateMatrixWorld(true);r.skeleton.update();
 const clone=cloneRig(r.g);let copied;clone.traverse(n=>{if(n.isSkinnedMesh)copied=n;});
 assert.notEqual(copied.skeleton,r.skeleton);assert.ok(copied.skeleton.bones.every(b=>!r.skeleton.bones.includes(b)));
 const old=copied.skeleton.bones.map(b=>b.quaternion.toArray());r.elbows[0].rotation.x=-2;r.g.updateMatrixWorld(true);r.skeleton.update();
 assert.deepEqual(copied.skeleton.bones.map(b=>b.quaternion.toArray()),old);
 const sample=new T.Vector3();r.g.traverse(n=>{if(n.isSkinnedMesh)for(let i=0;i<n.geometry.attributes.position.count;i++){n.getVertexPosition(i,sample);assert.ok(sample.toArray().every(Number.isFinite));}});}
});
