import test from 'node:test';import assert from 'node:assert/strict';
import {createMatch,update,neutral} from '../dist/combat.js';
import {SEAL} from '../dist/capture-seal.js';
import {createSealVisuals,sealLook} from '../dist/seal-visual.js';
const tick=(m,a={},b={})=>update(m,[{...neutral(),...a},{...neutral(),...b}]);
function setup(options={},gap=8){const m=createMatch(2,3,'training','normal',{movement:'v2',arena:'ring',step:'linear',...options});m.players[0].x=-gap/2;m.players[1].x=gap/2;return m;}
const sealGroup=v=>v.group.children.find(c=>c.name==='capture-seal');

test('no seal visuals without seal=on',()=>{const m=setup({grab:'locked'}),v=createSealVisuals();tick(m,{capture:true});v.update(m);assert.equal(v.group.visible,false);assert.equal(sealGroup(v),undefined);});

test('drawn edge is the simulated radius at the fixed cast centre every warning frame',()=>{
 const m=setup({seal:'on'}),v=createSealVisuals();tick(m,{capture:true});const s=m.seals[0];
 for(let n=0;n<SEAL.warningFrames-1;n++){v.update(m);const g=sealGroup(v),u=g.userData;
  assert.equal(g.position.x,s.x);assert.equal(g.position.z,s.z);assert.equal(u.edge.scale.x,s.radius);assert.equal(u.wall.scale.x,s.radius);assert.equal(u.fill.scale.x,s.radius);
  tick(m,{},{});}
 assert.equal(sealGroup(v).position.x,4,'centre stays where it was cast');
});

test('the target walking out does not move the ring; escaped seals stop looking dangerous and fade',()=>{
 const m=setup({seal:'on,dash'}),v=createSealVisuals();tick(m,{capture:true});const s=m.seals[0];
 for(let n=0;n<40&&s.status==='closing';n++){tick(m,{},{x:1,z:1});v.update(m);}
 assert.equal(s.status,'escaped');const g=sealGroup(v);assert.equal(g.position.x,4);
 const look=sealLook(s,m.tick);assert.equal(look.threat,false);assert.equal(g.userData.start.visible,false);
 assert.ok(sealLook(s,s.resolved+SEAL.visualFrames).fade===0);
 assert.ok(look.wallHeight<sealLook({...s,status:'closing',resolved:null},m.tick).wallHeight);
});

test('escape cue shows only during the dash window and points at the caster',()=>{
 const m=setup({seal:'on,dash'}),v=createSealVisuals();tick(m,{capture:true});
 while(!m.players[1].sealEscape)tick(m,{},{x:1,z:1});v.update(m);
 const cue=v.group.children.find(c=>c.name==='seal-escape-cue'&&c.visible);assert.ok(cue);
 const p=m.players[1],c=m.players[0],fwd={x:-Math.sin(cue.rotation.y),z:-Math.cos(cue.rotation.y)},to={x:c.x-p.x,z:c.z-p.z},d=Math.hypot(to.x,to.z);
 assert.ok(fwd.x*to.x/d+fwd.z*to.z/d>.999);
 for(let n=0;n<SEAL.dashWindow+1;n++)tick(m);v.update(m);
 assert.equal(v.group.children.filter(c=>c.name==='seal-escape-cue'&&c.visible).length,0);
});

test('final warning pulse is off with reduced motion',()=>{const s={status:'closing',radius:1.6,framesLeft:5,resolved:null};const a=sealLook(s,0,true),b=sealLook({...s,framesLeft:4},0,true);assert.equal(a.fillOpacity,b.fillOpacity);assert.equal(a.edgeOpacity,b.edgeOpacity);});

test('renderer is read-only: updating visuals does not change the simulation',()=>{
 const run=draw=>{const m=setup({seal:'on,dash'}),v=createSealVisuals();for(let n=0;n<120;n++){tick(m,{capture:n===0},{x:1,z:n<40?1:0});if(draw)v.update(m);}return JSON.stringify(m.players.map(p=>[p.x,p.z,p.hp]));};
 assert.equal(run(true),run(false));
});
