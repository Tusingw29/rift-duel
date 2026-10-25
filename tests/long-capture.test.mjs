import test from 'node:test';import assert from 'node:assert/strict';
import {createMatch,update,neutral,hit} from '../dist/combat.js';
import {createProjectileVisual,updateProjectileVisual} from '../dist/projectile-visuals.js';
const step=(m,a={},b={},n=1)=>{for(let j=0;j<n;j++)update(m,[{...neutral(),...a},{...neutral(),...b}]);};
function thrown(){const m=createMatch();step(m,{capture:true});step(m,{}, {},13);assert.equal(m.projectiles[0].kind,'capture');return m;}
test('extra fresh taps grow the travelling circle smoothly to a fixed cap; hold does not repeat',()=>{
 const m=thrown(),p=m.projectiles[0];m.players[1].z=5;step(m,{attack:true});assert.ok(p.radius>.65&&p.radius<1);step(m,{attack:true},{},10);assert.ok(Math.abs(p.radius-1)<1e-9);assert.equal(p.expansions,1);
 for(let j=0;j<4;j++){step(m);step(m,{attack:true});}step(m,{}, {},10);assert.equal(p.radius,1.35);assert.equal(m.players[0].move.kind,'capture');assert.equal(m.players[0].charge,0);
});
test('held input before formation cannot enlarge; interrupted owner cannot enlarge during stun',()=>{
 const m=createMatch();step(m,{capture:true,attack:true});step(m,{attack:true},{},14);assert.equal(m.projectiles[0].radius,.65);
 const n=thrown();hit(n,n.players[1],n.players[0],5);step(n,{attack:true});assert.equal(n.projectiles[0].radius,.65);
});
test('growth changes collision, timed guard escapes and misses expire',()=>{
 const m=thrown(),p=m.projectiles[0];p.dx=0;p.dz=0;m.players[1].x=p.x;m.players[1].z=1.6;
 step(m,{}, {},12);assert.equal(m.cinematic,null);step(m,{attack:true});step(m);step(m,{attack:true});step(m,{}, {},8);assert.equal(m.cinematic?.kind,'capture');
 const n=thrown(),q=n.projectiles[0];q.x=n.players[1].x;q.z=0;step(n,{}, {guard:true});assert.equal(n.cinematic,null);assert.equal(n.projectiles.length,0);
 const o=thrown();o.players[1].z=6;step(o,{}, {},120);assert.equal(o.projectiles.length,0);assert.equal(o.cinematic,null);
});
test('opposing capture circles cancel symmetrically before resolving a victim',()=>{
 const m=createMatch();m.projectiles=[0,1].map(owner=>({owner,kind:'capture',x:0,z:0,dx:0,dz:0,radius:.65,life:1}));step(m);assert.equal(m.projectiles.length,0);assert.equal(m.cinematic,null);assert.ok(m.events.some(e=>e.text==='CAPTURE CIRCLES CANCELLED'));
});
test('rendered capture ring radius follows collision radius',()=>{
 const v=createProjectileVisual();for(const radius of [.65,1,1.35]){updateProjectileVisual(v,{kind:'capture',radius,x:0,z:0,dx:7,dz:0},'#fff',0);assert.equal(v.scale.x,radius);assert.equal(v.userData.capture.visible,true);assert.equal(v.material.visible,false);}
});
