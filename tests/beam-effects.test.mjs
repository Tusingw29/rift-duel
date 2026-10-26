import test from 'node:test';import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {createBeamEffects} from '../dist/beam-effects.js';
import {createMatch} from '../dist/combat.js';
function fixture(){const scene=new T.Scene(),fx=createBeamEffects(scene),hand=new T.Group(),g=new T.Group();g.position.set(3,1,-2);g.rotation.y=.7;g.add(hand);hand.position.set(.2,1.5,.4);const models=[{limbs:[{userData:{hand}}]}],m=createMatch();m.projectiles=[{kind:'beam',owner:0,x:4,z:0}];return {fx,m,models,hand};}
test('beam release follows the actual hand world position without changing projectile collision data',()=>{
 const {fx,m,models,hand}=fixture(),before=JSON.stringify(m);fx.update(models,m);const e=fx.entries[0],expected=hand.getWorldPosition(new T.Vector3());
 assert.ok(e.flare.position.distanceTo(expected)<1e-9);assert.equal(e.connector.visible,true);assert.equal(JSON.stringify(m),before);
 hand.position.x+=.5;m.tick++;fx.update(models,m);assert.ok(e.flare.position.distanceTo(hand.getWorldPosition(new T.Vector3()))<1e-9);
 const camera=new T.PerspectiveCamera();camera.position.set(-6,4,0);camera.lookAt(0,1.4,0);fx.orient(camera);assert.deepEqual(e.nose.quaternion.toArray(),camera.quaternion.toArray());assert.equal(e.nose.visible,true);
});
test('beam disappearance emits three breakup drawings over six ticks, then reuses its pool slot',()=>{
 const {fx,m,models}=fixture();fx.update(models,m);const e=fx.entries[0];m.projectiles=[];m.tick=1;fx.update(models,m);assert.ok(e.shards.every(s=>s.visible));const start=e.shards[0].position.clone();
 m.tick=3;fx.update(models,m);assert.ok(e.shards[0].position.distanceTo(start)>.1);const frozen=e.shards[0].position.clone();fx.update(models,m);assert.deepEqual(e.shards[0].position,frozen);
 m.tick=7;fx.update(models,m);assert.equal(e.g.visible,false);m.projectiles=[{kind:'beam',owner:0,x:5,z:1}];fx.update(models,m);assert.equal(fx.entries.length,1);assert.equal(e.g.visible,true);
 fx.reset();assert.equal(e.g.visible,false);
});
test('other fighters do not get Aegis hand effects and a rewind clears stale breakup',()=>{
 const {fx,m,models}=fixture();m.players[0].id=2;fx.update(models,m);assert.equal(fx.entries.length,0);m.players[0].id=0;m.tick=5;fx.update(models,m);m.projectiles=[];m.tick=0;fx.update(models,m);assert.ok(fx.entries.every(e=>!e.g.visible));
});
