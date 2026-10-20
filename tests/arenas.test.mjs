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
