import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {createInkBeam,createInkRing,createInkFlame} from '../dist/ink-energy.js';
import {createAttackEffects} from '../dist/attack-effects.js';
import {createProjectileVisual,updateProjectileVisual} from '../dist/projectile-visuals.js';
test('ink drawings reuse finite geometry banks; beam tip stays inside projectile collision radius',()=>{
 for(const build of [createInkBeam,createInkRing,createInkFlame]){
  const g=build(),banks=g.userData.geometryBanks.flat();
  for(const geometry of banks){assert.ok([...geometry.attributes.position.array].every(Number.isFinite));if(g.name==='ink-beam'){geometry.computeBoundingBox();assert.ok(geometry.boundingBox.max.z<=.351);}}
  for(let i=0;i<120;i++){g.userData.updateInk(i/60,false);g.traverse(n=>{if(n.isMesh){assert.ok(banks.includes(n.geometry));assert.ok(n.material.transparent);assert.equal(n.material.depthWrite,true);assert.equal(n.material.depthTest,true);}});}
  g.userData.updateInk(0,false);const first=g.children.map(m=>m.geometry);g.userData.updateInk(.1,false);assert.notDeepEqual(g.children.map(m=>m.geometry),first);
  g.userData.updateInk(0,true);g.userData.updateInk(100,true);assert.deepEqual(g.children.map(m=>m.geometry),first);
 }
});
test('Tala ribbons use simulation ticks and clear on interruption without affecting other charge styles',()=>{
 const models=[{g:new T.Group()},{g:new T.Group()}],m={tick:30,players:[{id:2,anim:'charge',held:1},{id:0,anim:'charge',held:1}]},fx=createAttackEffects(new T.Scene());
 const snap=()=>fx.charges[0].ribbons.map(r=>[...r.position.toArray(),...r.scale.toArray(),r.userData.frame]);
 fx.update(models,m,1);const first=snap();assert.ok(fx.charges[0].ribbons.every(r=>r.visible));assert.ok(fx.charges[0].streaks.every(s=>!s.visible));assert.ok(fx.charges[1].ribbons.every(r=>!r.visible));
 fx.update(models,m,100);assert.deepEqual(snap(),first);m.tick+=10;fx.update(models,m,100);assert.notDeepEqual(snap(),first);
 fx.update(models,m,0,true);const reduced=snap();m.tick+=100;fx.update(models,m,10,true);assert.deepEqual(snap(),reduced);assert.equal(fx.charges[0].ribbons.filter(r=>r.visible).length,3);
 m.players[0].anim='hurt';fx.update(models,m,0);assert.equal(fx.charges[0].g.visible,false);fx.reset();assert.equal(fx.charges[1].g.visible,false);
});
test('ink capture preserves collision scaling and beam pool preserves fixed ink and white layers',()=>{
 const b=createProjectileVisual(),p={kind:'beam',x:1,z:2,dx:0,dz:1,radius:.4};const before=JSON.stringify(p);
 updateProjectileVisual(b,p,'#6fe7ff',.1);assert.equal(JSON.stringify(p),before);assert.equal(b.userData.beam.getObjectByName('beam-white-core').material.color.getHexString(),'ffffff');
 p.kind='capture';p.radius=1.35;updateProjectileVisual(b,p,'#f5b65d',1);assert.equal(b.scale.x,1.35);assert.equal(b.userData.beam.visible,false);
 const g=b.userData.capture;g.traverse(n=>{if(n.isMesh){const a=n.geometry.attributes.position;for(let i=0;i<a.count;i++)assert.ok(Math.hypot(a.getX(i),a.getY(i))*.82<1.04,'decorative rim stays near collision radius');}});
});
