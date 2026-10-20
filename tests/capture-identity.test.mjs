import test from 'node:test';import assert from 'node:assert/strict';
import {burstPose,capturePresentation} from '../dist/cinematics.js';
import {stagedCapturePose} from '../dist/captures.js';
import {createMatch,update,neutral} from '../dist/combat.js';
test('all 24 fighter/context combinations have distinct authored profiles',()=>{
 const profiles=new Set();
 for(const id of ['aegis','tala','rei','morrow','sol','vesper'])for(const context of ['front','back','mid','far']){
  const spec=capturePresentation(id,context);assert.ok(spec.profile);profiles.add(spec.profile);
 }
 assert.equal(profiles.size,24);assert.equal(capturePresentation('unknown','front').profile,null);
});
test('orbital and surrounding captures remain distinct from stock bursts and bypass held-guard posing',()=>{
 const a={x:-4,z:0},b={x:4,z:0,guard:true};
 const orbital=burstPose('aegis',{kind:'capture',duration:2.8,t:1.7},a,b);
 const surround=burstPose('tala',{kind:'capture',duration:2.6,t:1.3},a,b);
 assert.ok(orbital.effects.emitter&&orbital.effects.beam>0);assert.ok(orbital.victim.y>0);
 assert.equal(surround.effects.echoes.length,3);
 assert.equal(burstPose('aegis',{kind:'super',duration:2.8,t:1.7},a,b).effects.emitter,null);
 assert.equal(burstPose('tala',{kind:'super',duration:2.6,t:1.3},a,b).effects.echoes.length,0);
 for(const id of ['aegis','tala'])for(let frame=0;frame<=120;frame++){
  const pose=burstPose(id,{kind:'capture',duration:1,t:frame/120},a,b);
  for(const part of [pose.actor,pose.victim,pose.camera.target,pose.camera.position])assert.ok(Object.values(part).every(Number.isFinite));
  if(frame===120){assert.equal(pose.actor.x,a.x);assert.equal(pose.victim.y,0);}
 }
});
test('authored captures bypass held guard, cost no stock, and resolve damage once',()=>{
 for(const [id,x,profile,damage] of [[0,4,'orbital',18.75],[2,0,'surround',16.83],[1,4,'spirit-flight',16.875],[3,0,'iron-scoop',20.46],[4,4,'ember-fall',16.125],[5,-2,'astral-drop',18.54],[0,0,'blade-extract',16.5],[1,0,'spirit-thrust',14.85],[4,0,'ember-spear',14.19],[5,0,'effigy-break',16.995]]){
  const m=createMatch(id,1);m.players[1].x=x;if(profile==='astral-drop'){m.players[1].lookX=1;m.players[1].turnDelay=99;}
  const guard={...neutral(),guard:true};for(let i=0;i<20;i++)update(m,[neutral(),guard]);
  update(m,[{...neutral(),capture:true},guard]);
  for(let i=0;i<120&&!m.cinematic;i++)update(m,[neutral(),guard]);
  assert.equal(m.cinematic?.profile,profile);assert.equal(m.players[0].stocks,1);
  let impacts=0;for(let i=0;i<300;i++){update(m,[neutral(),guard]);impacts+=m.events.filter(e=>e.type==='hit').length;}
  assert.equal(impacts,1);assert.ok(Math.abs(m.players[1].hp-(100-damage))<1e-6);
 }
});
test('all authored capture tracks stay finite, change shots, and return to combat positions',()=>{
 for(const [id,context] of ['aegis','rei','tala','morrow','sol','vesper'].flatMap(id=>['front','back','mid','far'].map(context=>[id,context]))){
  for(const [a,b] of [[{x:-4,z:0},{x:4,z:0,guard:true}],[{x:5,z:4},{x:-6,z:-3}],[{x:0,z:0},{x:0,z:0}]]){
   const spec=capturePresentation(id,context),shots=new Set(),before=JSON.stringify([a,b]);
   for(let i=0;i<=120;i++){
    const pose=stagedCapturePose(id,{...spec,kind:'capture',t:spec.duration*i/120},a,b);
    shots.add(pose.camera.shot);
    for(const part of [pose.actor,pose.victim,pose.camera.target,pose.camera.position])assert.ok(Object.values(part).every(Number.isFinite),id);
    if(i===120){assert.equal(pose.actor.x,a.x);assert.equal(pose.actor.z,a.z);assert.equal(pose.actor.y,0);assert.equal(pose.victim.y,0);}
   }
   assert.ok(shots.size>=2,id);assert.equal(JSON.stringify([a,b]),before);
  }
 }
});
test('new captures have distinct spirit, weapon-lift, firefall, and aerial-drop behavior',()=>{
 const a={x:-4,z:0},b={x:4,z:0};
 const sample=(id,context,t=.5)=>{const spec=capturePresentation(id,context);return stagedCapturePose(id,{...spec,kind:'capture',t:t*spec.duration},a,b);};
 assert.equal(sample('rei','far',.4).effects.spirits.filter(s=>s.visible).length,3);
 assert.ok(sample('morrow','mid').victim.y>2);assert.equal(sample('morrow','mid').effects.rays.length,0);
 assert.equal(sample('sol','far').effects.orb.position.x,b.x);assert.ok(sample('sol','far').effects.orb.position.y>1);
 assert.ok(sample('vesper','back').actor.y>3);assert.ok(sample('vesper','back').victim.y>3);
});
