import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {capturePresentation} from '../dist/cinematics.js';
import {stagedCapturePose} from '../dist/captures.js';
import {createBurstEffects} from '../dist/burst-effects.js';
import {buildCharacter} from '../dist/characters.js';
const a={x:-2,z:0},b={x:2,z:0};
const sample=(id,t)=>{const spec=capturePresentation(id,'mid');return stagedCapturePose(id,{...spec,t:spec.duration*t},a,b);};
test('new mid captures distinguish sideways blade extraction, thrust, spear and effigy',()=>{
 const blade=sample('aegis',.65),thrust=sample('rei',.65);
 assert.ok(blade.actor.z>.3);assert.equal(thrust.actor.z,0);
 assert.ok(thrust.victim.x>blade.victim.x);
 const spear=sample('sol',.45);assert.equal(spear.effects.spear.visible,true);
 assert.ok(spear.effects.spear.to.x>spear.effects.spear.from.x);
 assert.ok(sample('vesper',.4).effects.effigy.scale>.9);
 assert.ok(sample('vesper',.65).victim.y>.8);
});
test('spear and effigy render finite transforms, then hide on the next unrelated capture',()=>{
 const scene=new T.Scene(),fx=createBurstEffects(scene),group=scene.children[0];
 const spear=group.children.find(n=>n.geometry?.type==='CylinderGeometry'&&n.geometry.parameters.height===1);
 const effigy=group.children.find(n=>n.isGroup&&n.children.length===6);
 assert.ok(spear&&effigy);
 for(const [id,index,target] of [['sol',4,spear],['vesper',5,effigy]]){
  const rig=buildCharacter(index);fx.update(sample(id,.45),rig);assert.equal(target.visible,true);
  scene.updateMatrixWorld(true);group.traverse(n=>assert.ok(n.matrixWorld.elements.every(Number.isFinite)));
  fx.update(sample('rei',.45),buildCharacter(1));assert.equal(spear.visible,false);assert.equal(effigy.visible,false);
 }
 fx.update(null);assert.equal(group.visible,false);
});
