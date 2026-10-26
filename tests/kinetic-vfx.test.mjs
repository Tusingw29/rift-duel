import test from 'node:test';import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {createMatch,update,hit,neutral,STEP} from '../dist/combat.js';
import {buildCharacter} from '../dist/characters.js';
import {createTrailEffects,bladeAnchors,TRAIL_SAMPLES,curvedRibbonSamples} from '../dist/trails.js';
import {createSignature,energyStyles,socket} from '../dist/energy-style.js';
import {createAttackEffects} from '../dist/attack-effects.js';
import {createImpactEffects} from '../dist/impact-effects.js';
import {createProjectileVisual,updateProjectileVisual} from '../dist/projectile-visuals.js';
import {createInkBeam} from '../dist/ink-energy.js';
const step=m=>update(m,[neutral(),neutral()]);
test('launch produces one floor event, twelve airborne rebound frames, then grounded rise',()=>{
 const m=createMatch(),p=m.players[1];hit(m,m.players[0],p,8,'hit',true);let events=0,bounceFrames=0,riseFrames=0,peak=0;
 for(let i=0;i<100;i++){step(m);events+=m.events.filter(e=>e.type==='groundBounce').length;if(p.bounce){bounceFrames++;assert.ok(p.air>0);assert.equal(p.getUp,null);peak=Math.max(peak,p.airMotion.height);}if(p.getUp){riseFrames++;assert.equal(p.air,0);}}
 assert.equal(events,1);assert.equal(bounceFrames,12);assert.equal(riseFrames,12);assert.ok(peak>.5&&peak<=.55);assert.equal(p.anim,'idle');assert.equal(p.bounce,null);
});
test('bounce pauses in hitstop; a fresh hit clears it; air recovery avoids the floor event',()=>{
 const m=createMatch(),p=m.players[1];hit(m,m.players[0],p,8,'hit',true);while(!p.bounce)step(m);const before=JSON.stringify(p.bounce),height=p.airMotion.height;m.hitstop=3;for(let i=0;i<3;i++)step(m);assert.equal(JSON.stringify(p.bounce),before);assert.equal(p.airMotion.height,height);assert.ok(hit(m,m.players[0],p,4));assert.equal(p.bounce,null);
 const n=createMatch();hit(n,n.players[0],n.players[1],8,'hit',true);update(n,[neutral(),{...neutral(),guard:true}]);for(let i=0;i<80;i++){step(n);assert.ok(!n.events.some(e=>e.type==='groundBounce'));}
});
test('sword trail uses seven distinct simulation samples and follows the actual tagged blade',()=>{
 const scene=new T.Scene(),fx=createTrailEffects(scene),model=buildCharacter(0),m=createMatch();const hand=model.limbs[2].userData.hand;
 const anchors=bladeAnchors(model,hand);assert.ok(Math.abs(anchors.tip[2]-1.48)<.01);
 m.players[0].move={kind:'strike',chain:1,startup:8,active:3,recovery:30,frame:8};
 for(let i=0;i<12;i++){m.tick=i;hand.rotation.y=i*.09;fx.update([model],m,STEP);}const e=fx.entries[0];assert.equal(e.samples.length,TRAIL_SAMPLES);
 const snapshot=JSON.stringify(e.samples);for(let i=0;i<10;i++)fx.update([model],m,STEP);assert.equal(JSON.stringify(e.samples),snapshot,'extra renders cannot stretch the trail lifetime');
 const expected=hand.localToWorld(new T.Vector3(...anchors.tip));assert.ok(new T.Vector3(...e.samples.at(-1)[1]).distanceTo(expected)<1e-8);assert.ok(e.outline.visible&&e.core.visible);assert.ok(e.shards.some(s=>s.visible));m.tick+=20;fx.update([model],m,STEP);assert.equal(e.samples.length,1,"a slow render cannot preserve samples older than seven simulation ticks");fx.reset();assert.equal(scene.children.length,0);
});
test('all six signatures have distinct solid silhouettes, ink/core colors and projectile identity',()=>{
 assert.equal(new Set(energyStyles.map(s=>JSON.stringify(s.points))).size,6);
 const b=createProjectileVisual();for(let id=0;id<6;id++){const g=createSignature(id);g.children[0].geometry.computeBoundingBox();assert.ok(g.children[0].geometry.boundingBox.max.z>0);assert.equal(g.children[0].material.color.getHexString(),energyStyles[id].ink.slice(1));const p={kind:'shot',x:0,z:0,dx:1,dz:0,radius:.4};const before=JSON.stringify(p);updateProjectileVisual(b,p,'#ffffff',1,false,id);assert.equal(b.userData.signatures.filter(s=>s.visible).length,1);assert.ok(b.userData.signatures[id].visible);assert.equal(b.rotation.y,Math.PI/2);assert.equal(JSON.stringify(p),before);}
});
test('charge coils track animated hands and feet; capture follows chest and breaks into finite-lived shards',()=>{
 const models=[buildCharacter(2),buildCharacter(1)],m=createMatch(2,1),fx=createAttackEffects(new T.Scene());m.players[0].anim='charge';m.players[0].held=1;
 models[0].limbs[0].rotation.x=.6;models[0].g.position.set(3,1,2);fx.update(models,m,0);
 const coil=fx.charges[0].coils[0],world=coil.getWorldPosition(new T.Vector3());assert.ok(world.distanceTo(socket(models[0],'leftHand'))<1e-8);assert.equal(fx.charges[0].inkFloor.visible,false);assert.ok(fx.charges[0].shock.visible);
 m.cinematic={kind:'capture',a:0,b:1,t:.3,duration:2};models[1].g.position.y=2;fx.update(models,m,0);assert.ok(fx.restraint.position.distanceTo(socket(models[1],'chest'))<1e-8);assert.ok(fx.tether.visible);m.cinematic=null;m.tick++;fx.update(models,m,0);assert.ok(fx.shards.every(s=>s.visible));m.tick+=12;fx.update(models,m,0);assert.ok(fx.shards.every(s=>!s.visible));fx.reset();assert.ok(!fx.tether.visible);
});
test('helical beam ribs have real depth and floor shockwave is driven by the impact tick',()=>{
 const beam=createInkBeam(),ribs=beam.children.filter(n=>n.name==='beam-helical-rib');assert.equal(ribs.length,2);for(const r of ribs){r.geometry.computeBoundingBox();const b=r.geometry.boundingBox;assert.ok(b.max.x-b.min.x>.4&&b.max.y-b.min.y>.4&&b.max.z-b.min.z>2);}
 const m=createMatch(),fx=createImpactEffects(new T.Scene());m.players[1].lastGroundBounce={tick:0,x:2,z:3};fx.update(m);assert.ok(fx.entries[1].g.visible);const first=fx.entries[1].shock.scale.x;m.tick=6;fx.update(m);assert.ok(fx.entries[1].shock.scale.x>first);m.tick=15;fx.update(m);assert.ok(!fx.entries[1].g.visible);
});

test('curved ribbon preserves measured cutting samples, tapers history and uses vertex alpha',()=>{
 const samples=Array.from({length:7},(_,i)=>[[0,0,0],[Math.cos(i*.2)*2,0,Math.sin(i*.2)*2]]),curve=curvedRibbonSamples(samples);
 assert.equal(curve.length,25);for(let i=0;i<7;i++)assert.ok(new T.Vector3(...curve[i*4][1]).distanceTo(new T.Vector3(...samples[i][1]))<1e-8);
 assert.deepEqual(curve[0][0],curve[0][1]);assert.ok(Math.hypot(...curve.at(-1)[0])<.31);
 const fx=createTrailEffects(new T.Scene()),model=buildCharacter(0),m=createMatch();m.players[0].move={kind:'strike',frame:8,startup:8,active:3,recovery:20};fx.update([model],m,STEP);m.tick++;model.limbs[2].rotation.z=.4;fx.update([model],m,STEP);
 const attr=fx.entries[0].ribbon.geometry.attributes.color;assert.equal(attr.itemSize,4);assert.equal(attr.getW(0),0);assert.equal(attr.getW(9),1);fx.reset();
});
test('Aegis release beam tail is clipped ahead of the animated hand without moving the collision point',()=>{
 const b=createProjectileVisual(),g=new T.Group(),hand=new T.Group();g.add(hand);const model={g,limbs:[{userData:{hand}}]},p={kind:'beam',x:0,z:.5,dx:0,dz:12,radius:.4};const before=JSON.stringify(p);
 updateProjectileVisual(b,p,'#6fe7ff',0,false,0,model);const beam=b.userData.beam;assert.ok(beam.scale.z<.2);assert.ok(p.z-2.7*beam.scale.z+beam.position.z>=0);assert.equal(JSON.stringify(p),before);
});
