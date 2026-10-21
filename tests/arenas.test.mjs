import test from 'node:test';import assert from 'node:assert/strict';
import {arenas,arenaFor,homeArena,createArena} from '../dist/arenas.js';
import {fighters} from '../dist/fighters.js';
test('every fighter has a distinct home arena with valid colors',()=>{
 const names=new Set(),decos=new Set();
 for(const f of fighters){const a=arenas[f.id];assert.ok(a,f.id);names.add(a.name);decos.add(a.deco);for(const c of [a.sky,a.ground,...a.rings,a.strip,...a.hemisphere,a.sun,a.rim])assert.match(c,/^#[0-9a-f]{6}$/i);assert.ok(a.fog>0&&a.fog<.05);assert.ok(a.stars>0);}
 assert.equal(names.size,fighters.length);assert.equal(decos.size,fighters.length);assert.equal(arenaFor(2).name,arenas.tala.name);
});
test('fights use the opponent home and training uses the selected fighter',()=>{
 assert.equal(homeArena('arcade',0,3),3);assert.equal(homeArena('duel',4,1),1);assert.equal(homeArena('local',2,5),5);assert.equal(homeArena('training',2,5),2);
});
test('arena groups build, animate and dispose for every stage',()=>{
 for(const f of fighters){const stage=createArena(arenas[f.id]);assert.ok(stage.group.children.length>8,f.id);let meshes=0;stage.group.traverse(o=>{if(o.isMesh||o.isPoints)meshes++;});assert.ok(meshes>10,f.id);stage.update(0);stage.update(3.7);stage.dispose();}
});

test('shrine architecture stays outside combat space and batches static detail',async()=>{
 const {buildShrineCourtyard}=await import('../dist/shrine-stage.js');const {Vector3}=await import('../dist/vendor/three.module.js');
 const stage=buildShrineCourtyard();stage.group.updateMatrixWorld(true);let meshes=0,vertices=0;const point=new Vector3();
 stage.group.traverse(n=>{if(!n.isMesh)return;meshes++;const p=n.geometry.attributes.position;vertices+=p.count;for(let i=0;i<p.count;i++){
  point.fromBufferAttribute(p,i).applyMatrix4(n.matrixWorld);assert.ok(point.toArray().every(Number.isFinite));
  if(point.y>.1)assert.ok(Math.hypot(point.x,point.z)>17,'architecture intrudes into the fighting disc');
  if(Math.hypot(point.x,point.z)<17)assert.ok(point.y<-.11,'approach surfaces must sit below the combat floor to avoid flicker');
 }});
 assert.ok(meshes<=24,`static architecture uses ${meshes} draws`);assert.ok(vertices<80000);stage.update(3.2);
 const arena=createArena(arenas.rei);let visibleGrids=0;arena.group.traverse(n=>{if(n.isGridHelper&&n.visible)visibleGrids++;});assert.equal(visibleGrids,0);arena.dispose();
});
