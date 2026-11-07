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

// Seal-bind finish (render-only staging of a caught seal).
import {sealCatchOf,sealBindPhases} from '../dist/seal-finish.js';
import {stagedCapturePose} from '../dist/captures.js';
function catchSeal(){const m=setup({seal:'on'});tick(m,{capture:true});for(let n=0;n<200&&!m.cinematic;n++)tick(m);return m;}
test('a caught seal is recognised as the source of the capture cinematic for its whole length',()=>{
 const m=catchSeal();assert.ok(m.cinematic,'idle target is caught');assert.equal(m.seals[0].status,'caught');
 let frames=0;while(m.cinematic){assert.equal(sealCatchOf(m)?.id,m.seals[0].id);tick(m);frames++;}
 assert.ok(frames>30);assert.equal(sealCatchOf(m),null);
});
test('an ordinary close capture is not staged as a seal bind',()=>{
 const m=setup({grab:'locked'},1.2);for(let n=0;n<30&&!m.cinematic;n++)tick(m,{capture:n===0});
 if(m.cinematic)assert.equal(sealCatchOf(m),null);
 const s=setup({seal:'on'});tick(s,{capture:true});assert.equal(sealCatchOf(s),null,'no cinematic while closing');
});
test('seal bind lifts and holds the target, then slams it down and stays down',()=>{
 const a={x:-4,z:0},b={x:4,z:0},pose=t=>stagedCapturePose('tala',{profile:'seal-bind',t,duration:1,seal:{x:4.2,z:.1}},a,b);
 assert.ok(pose(.4).victim.y>1.2,'held in the pillar');assert.ok(pose(.4).effects.seal.height>4);
 const end=pose(1);assert.ok(end.victim.tilt>1,'still flat at the end');assert.equal(end.effects.seal.height,0);
 assert.ok(pose(.4).actor.rightArm<-2,'caster hand raised');assert.ok(pose(.75).actor.rightArm>-1,'hand driven down');
 for(const t of [0,.25,.5,.75,1])for(const k of ['x','y','z','tilt','roll','yaw','arm'])assert.ok(Number.isFinite(pose(t).victim[k])&&Number.isFinite(pose(t).actor[k]));
 assert.ok(sealBindPhases(.7).shock>0&&sealBindPhases(.85).shock<1);
});
test('bind visuals show only during a seal catch and the closing ring hides behind them',()=>{
 const m=catchSeal(),v=createSealVisuals(),s=sealCatchOf(m);
 const look=stagedCapturePose('tala',{...m.cinematic,profile:'seal-bind',seal:s},m.players[0],m.players[1]).effects.seal;
 v.update(m,{},()=>'#ff8800',{seal:s,look});const bind=v.group.children.find(c=>c.name==='seal-bind');
 assert.equal(v.group.visible,true);assert.equal(bind.visible,true);assert.equal(sealGroup(v).visible,false);
 v.update(m,{},()=>'#ff8800',null);assert.equal(bind.visible,false);
});
test('drawing the bind does not change the match',()=>{
 const run=draw=>{const m=setup({seal:'on'}),v=createSealVisuals();for(let n=0;n<260;n++){tick(m,{capture:n===0});if(draw){const s=sealCatchOf(m);v.update(m,{},undefined,s?{seal:s,look:stagedCapturePose('tala',{...m.cinematic,profile:'seal-bind',seal:s},m.players[0],m.players[1]).effects.seal}:null);}}return JSON.stringify([m.tick,m.players.map(p=>[p.x,p.z,p.hp,p.anim])]);};
 assert.equal(run(true),run(false));
});
