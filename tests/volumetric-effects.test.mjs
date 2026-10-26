import test from 'node:test';import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {createInkBeam,createInkRing,createInkFlame,createEnergyBurst} from '../dist/ink-energy.js';
import {createAttackEffects} from '../dist/attack-effects.js';
import {createBeamEffects} from '../dist/beam-effects.js';
import {createMatch} from '../dist/combat.js';
function volume(g){const p=g.attributes.position,index=g.index;let sum=0;const a=new T.Vector3(),b=new T.Vector3(),c=new T.Vector3();for(let i=0;i<(index?.count||p.count);i+=3){a.fromBufferAttribute(p,index?index.getX(i):i);b.fromBufferAttribute(p,index?index.getX(i+1):i+1);c.fromBufferAttribute(p,index?index.getX(i+2):i+2);sum+=a.dot(b.cross(c))/6;}return Math.abs(sum);}
test('all beam, binding and charge frames enclose volume with visible side faces',()=>{
 for(const build of [createInkBeam,createInkRing,createInkFlame])for(const g of build().userData.geometryBanks.flat()){
  assert.ok(volume(g)>.001,'closed mesh has nonzero enclosed volume');g.computeBoundingBox();const size=g.boundingBox.getSize(new T.Vector3());assert.ok(Math.min(size.x,size.y,size.z)>.1,'geometry is not a plane');
  assert.ok(g.attributes.color);assert.ok([...g.attributes.normal.array].every(Number.isFinite));
 }
 const burst=createEnergyBurst();burst.traverse(o=>{if(o.isMesh)assert.ok(volume(o.geometry)>.001);});
});
test('capture and charge volumes keep their world orientation through camera orbits',()=>{
 const fx=createAttackEffects(new T.Scene()),models=[{g:new T.Group()},{g:new T.Group()}],m={tick:20,players:[{id:2,anim:'charge',held:1},{id:0,anim:'idle'}]};models[1].g.position.x=3;
 fx.update(models,m,0);const ribbons=fx.charges[0].ribbons.map(r=>r.quaternion.toArray());
 m.cinematic={kind:'capture',a:0,b:1,t:.4,duration:2};fx.update(models,m,0);const rotation=fx.restraint.quaternion.toArray();
 for(let j=0;j<6;j++){const camera=new T.PerspectiveCamera();camera.position.set(Math.cos(j)*6,3,Math.sin(j)*6);camera.lookAt(0,1.4,0);fx.orient(camera);assert.deepEqual(fx.restraint.quaternion.toArray(),rotation);assert.deepEqual(fx.charges[0].ribbons.map(r=>r.quaternion.toArray()),ribbons);}
});
test('beam breakup scatters through depth and release bursts do not face the camera',()=>{
 const fx=createBeamEffects(new T.Scene()),m=createMatch(),hand=new T.Group(),models=[{limbs:[{userData:{hand}}]}];m.projectiles=[{owner:0,kind:'beam',x:0,z:0}];fx.update(models,m);const e=fx.entries[0];
 const camera=new T.PerspectiveCamera();camera.rotation.set(.4,1.2,.2);fx.orient(camera);assert.deepEqual(e.flare.quaternion.toArray(),[0,0,0,1]);assert.deepEqual(e.nose.quaternion.toArray(),[0,0,0,1]);
 m.projectiles=[];m.tick++;fx.update(models,m);assert.ok(e.shards.some(s=>s.position.z<0));assert.ok(e.shards.some(s=>s.position.z>0));
});
