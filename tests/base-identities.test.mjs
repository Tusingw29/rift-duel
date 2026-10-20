import test from 'node:test';
import assert from 'node:assert/strict';
import {createMatch,neutral,update} from '../dist/combat.js';
import {baseSpecials} from '../dist/special-variants.js';
import {fighters} from '../dist/fighters.js';
import {createProjectileVisual,updateProjectileVisual} from '../dist/projectile-visuals.js';
const step=(m,a={},b={},n=1)=>{for(let i=0;i<n;i++)update(m,[{...neutral(),...a},{...neutral(),...b}]);};
const cases=[[0,1,'beam'],[0,-1,'lightning'],[1,1,'spirit'],[1,-1,'sword'],[5,1,'fire'],[5,-1,'snare']];
function fire(id,x){const m=createMatch(id,2,'local');step(m,{x,attack:true});step(m,{x});for(let j=0;j<50&&!m.projectiles.length;j++)step(m);return m;}
test('six base signatures have distinct researched identities and retain one free emission',()=>{
 for(const [id,x,kind] of cases){const m=fire(id,x);assert.equal(m.projectiles.length,1);assert.equal(m.projectiles[0].kind,kind);assert.equal(m.players[0].stocks,1);
  for(let j=0;j<150&&m.players[1].hp===100;j++)step(m);
  assert.ok(Math.abs(m.players[1].hp-(100-10*fighters[id].power))<1e-6,kind);
  const spec=baseSpecials[fighters[id].id][x===1?'forward':'back'];if(spec.stun||kind==='snare')assert.ok(m.players[1].stun>= (spec.stun||.85)-.02,kind);
 }
});
test('new base signatures remain blockable, reflectable and avoidable',()=>{
 for(const [id,x,kind] of cases){const m=fire(id,x);step(m,{}, {guard:true},160);assert.ok(m.players[1].hp>98,kind);assert.equal(m.players[1].stun,0);
  const n=fire(id,x),p=n.projectiles[0];p.x=n.players[1].x-.5;p.z=0;step(n,{}, {guard:true});assert.equal(p.owner,1,kind);assert.equal(n.players[1].hp,100);
  const o=fire(id,x);o.players[1].z=3;step(o,{}, {},160);assert.equal(o.players[1].hp,100,kind);
 }
});
test('new geometry follows travel direction and pooled reuse hides previous custom shapes',()=>{
 const b=createProjectileVisual(),types=['lightning','spirit','sword','snare','fire','wave','wheel','bolt','beam','crescent'];
 for(const kind of types){for(const [dx,dz] of [[10,0],[-10,0],[0,-10]]){
  updateProjectileVisual(b,{kind,x:0,z:0,dx,dz,radius:.6},'#f2a0ce',1);
  for(const name of ['lightning','spirit','sword','snare','fire','wave','wheel'])assert.equal(b.userData[name].visible,kind===name);
  if(['lightning','spirit','sword','snare','fire','wave'].includes(kind))assert.equal(b.rotation.y,Math.atan2(dx,dz));
  b.updateMatrixWorld(true);b.traverse(o=>{assert.ok(o.matrixWorld.elements.every(Number.isFinite));});
 }}
 updateProjectileVisual(b,null,'#ffffff',2);assert.equal(b.visible,false);
});
