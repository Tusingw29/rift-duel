import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,neutral,update,hit} from '../dist/combat.js';
import {createProjectileVisual,updateProjectileVisual} from '../dist/projectile-visuals.js';
const step=(m,a={},b={},n=1)=>{for(let i=0;i<n;i++)update(m,[{...neutral(),...a},{...neutral(),...b}]);};
function start(x){const m=createMatch(3,1,'local');step(m,{x,attack:true});step(m,{x});return m;}
function emission(m){for(let i=0;i<40&&!m.projectiles.length;i++)step(m);return m;}
test('Morrow ground wave travels low, stuns, and costs no stock',()=>{
 const m=emission(start(1));assert.equal(m.projectiles.length,1);assert.equal(m.projectiles[0].kind,'wave');assert.equal(m.projectiles[0].low,true);
 for(let i=0;i<100&&m.players[1].hp===100;i++)step(m);
 assert.ok(Math.abs(m.players[1].hp-87.6)<1e-6);assert.ok(m.players[1].stun>=.68);assert.ok(m.players[1].animTime>=m.players[1].stun);assert.equal(m.players[0].stocks,1);
});
test('ground wave can be blocked, reflected, or sidestepped',()=>{
 const m=emission(start(1));step(m,{}, {guard:true},100);assert.ok(m.players[1].hp>98);assert.equal(m.players[1].stun,0);
 const n=emission(start(1)),p=n.projectiles[0];p.x=n.players[1].x-.5;step(n,{}, {guard:true});assert.equal(p.owner,1);assert.equal(n.players[1].hp,100);
 const o=emission(start(1));o.players[1].z=2;step(o,{}, {},100);assert.equal(o.players[1].hp,100);
});
test('retreating barrage emits eight missiles in four pairs and interruption cancels remaining pairs',()=>{
 const m=emission(start(-1));assert.equal(m.projectiles.length,2);const x=m.players[0].x;step(m,{}, {},12);assert.equal(m.projectiles.length,8);assert.equal(m.players[0].x,x);assert.ok(x<-5);assert.ok(m.projectiles.every(p=>p.kind==='bolt'&&!p.low&&p.knockdown));assert.equal(m.players[0].stocks,1);
 const n=emission(start(-1));hit(n,n.players[1],n.players[0],5);step(n,{}, {},12);assert.equal(n.projectiles.length,2);
});
test('base specials still transform into eruption and split ground missiles before contact',()=>{
 for(const x of [-1,1]){const m=start(x);step(m,{x,attack:true});step(m,{x});assert.equal(m.players[0].move.followup,true);assert.equal(m.players[0].move.special.name,x===1?'Iron eruption':'Ground salvo');}
});
test('pooled wave visual resets when reused for missiles, rings and hidden projectiles',()=>{
 const b=createProjectileVisual(),p={x:1,z:2,dx:10,dz:0,radius:.7,kind:'wave',low:true};
 updateProjectileVisual(b,p,'#a5c69e',1);assert.equal(b.userData.wave.visible,true);assert.equal(b.material.visible,false);assert.equal(b.position.y,.16);assert.equal(b.rotation.y,Math.PI/2);
 updateProjectileVisual(b,{...p,kind:'bolt',low:false},'#ff0000',2);assert.equal(b.userData.wave.visible,false);assert.equal(b.material.visible,true);assert.equal(b.position.y,1.4);
 updateProjectileVisual(b,{...p,kind:'wheel',radius:1.4},'#ffffff',3);assert.equal(b.userData.wheel.visible,true);assert.equal(b.userData.wave.visible,false);assert.ok(b.position.y>1.4);b.updateMatrixWorld(true);assert.ok(b.matrixWorld.elements.every(Number.isFinite));
 updateProjectileVisual(b,null,'#ffffff',4);assert.equal(b.visible,false);
});
