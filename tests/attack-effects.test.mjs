import test from 'node:test';
import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {createAttackEffects} from '../dist/attack-effects.js';
import {createProjectileVisual,updateProjectileVisual} from '../dist/projectile-visuals.js';
const model=x=>{const g=new T.Group();g.position.x=x;return {g,aura:{material:{color:new T.Color('#ee9944')}}};};
test('capture restraint follows the victim with an open centre and clears on exit',()=>{
 const fx=createAttackEffects(new T.Scene()),models=[model(-2),model(2)],m={players:[{},{}],cinematic:{kind:'capture',a:0,b:1,t:.4,duration:2}};
 fx.update(models,m,1);assert.equal(fx.restraint.visible,true);assert.equal(fx.restraint.position.x,2);
 for(const mesh of fx.restraint.children){const positions=mesh.geometry.attributes.position;for(let i=0;i<positions.count;i++)assert.ok(Math.hypot(positions.getX(i),positions.getY(i))>.8,'binding geometry has an open centre');}
 models[1].g.position.y=2;fx.update(models,m,1);assert.equal(fx.restraint.position.y,3.45);
 m.cinematic=null;fx.update(models,m,1);assert.equal(fx.restraint.visible,false);
});
test('charging is state-bound, deterministic and restrained mode removes motion',()=>{
 const fx=createAttackEffects(new T.Scene()),models=[model(0),model(2)],m={players:[{anim:'charge',held:1},{anim:'idle'}]};
 fx.update(models,m,1,true);assert.ok(fx.charges[0].streaks.every(s=>s.material.transparent&&!s.material.depthWrite),'energy draws after opaque arena surfaces');const positions=fx.charges[0].streaks.map(s=>s.position.toArray());
 fx.update(models,m,5,true);assert.deepEqual(fx.charges[0].streaks.map(s=>s.position.toArray()),positions);assert.equal(fx.charges[1].g.visible,false);
 m.players[0].anim='hurt';fx.update(models,m,6);assert.equal(fx.charges[0].g.visible,false);
});
test('beam points along travel with white core; pooled projectile resets to capture ring',()=>{
 const b=createProjectileVisual();updateProjectileVisual(b,{kind:'beam',x:0,z:0,dx:1,dz:0,radius:.3},'#ff3300',0);
 assert.equal(b.material.visible,false);assert.equal(b.userData.beam.visible,true);assert.equal(b.rotation.y,Math.PI/2);
 assert.equal(b.userData.beam.getObjectByName('beam-white-core').material.color.getHexString(),'ffffff');
 updateProjectileVisual(b,{kind:'capture',x:0,z:0,dx:0,dz:1,radius:1.35},'#00ffff',0);
 assert.equal(b.userData.beam.visible,false);assert.equal(b.userData.capture.visible,true);assert.equal(b.scale.x,1.35);
 updateProjectileVisual(b,null);assert.equal(b.visible,false);
});

test('capture sequences suppress the solid orb while super attacks retain it',async()=>{
 const {createBurstEffects}=await import('../dist/burst-effects.js');const scene=new T.Scene(),fx=createBurstEffects(scene);
 const pose={effects:{kind:'tala',t:.4,center:{x:0,y:1,z:0},orb:{position:{x:0,y:2,z:0},radius:1},rays:[],echoes:[]}};
 fx.update(pose,{id:2},false,true);const orb=scene.children[0].children.find(n=>n.geometry?.type==='IcosahedronGeometry');assert.equal(orb.visible,false);
 fx.update(pose,{id:2},false,false);assert.equal(orb.visible,false);assert.equal(scene.getObjectByName('signature-burst-2').visible,true);
 fx.update(null,null);assert.equal(scene.children[0].visible,false);
});
