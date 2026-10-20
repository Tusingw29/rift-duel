import test from 'node:test';import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {burstPose,BURST_DURATIONS} from '../dist/cinematics.js';
import {buildCharacter} from '../dist/characters.js';
import {createBurstEffects} from '../dist/burst-effects.js';
import {createMatch,update,neutral} from '../dist/combat.js';
import {fighters} from '../dist/fighters.js';
function allFinite(value){if(typeof value==='number')assert.ok(Number.isFinite(value));else if(value&&typeof value==='object')for(const child of Object.values(value))allFinite(child);}
test('all six burst sequences stay finite and return characters to simulation positions',()=>{
 for(const id of Object.keys(BURST_DURATIONS))for(const [a,b] of [[{x:-4,z:0},{x:4,z:0}],[{x:10,z:5},{x:7,z:-3}],[{x:0,z:0},{x:0,z:0}]]){
  const before=JSON.stringify([a,b]),duration=BURST_DURATIONS[id];
  for(let frame=0;frame<=120;frame++){const pose=burstPose(id,{t:duration*frame/120,duration},a,b);allFinite(pose);assert.ok(Math.abs(pose.actor.x)<15&&Math.abs(pose.victim.x)<15);}
  const final=burstPose(id,{t:duration,duration},a,b);assert.equal(final.actor.x,a.x);assert.equal(final.actor.z,a.z);assert.equal(final.actor.y,0);assert.equal(final.victim.y,0);assert.equal(JSON.stringify([a,b]),before);
 }
});
test('each fighter has its own effect identity and multiple camera shots',()=>{
 const signatures=new Set();
 for(const id of Object.keys(BURST_DURATIONS)){
  const duration=BURST_DURATIONS[id],shots=new Set(),a={x:-4,z:0},b={x:4,z:0};
  for(let i=0;i<=20;i++)shots.add(burstPose(id,{t:duration*i/20,duration},a,b).camera.shot);
  assert.ok(shots.size>=2,id+' has no shot change');
  signatures.add(JSON.stringify(burstPose(id,{t:duration*.55,duration},a,b).effects));
 }
 assert.equal(signatures.size,6);
});
test('echo effects clean up without disposing the source fighter geometry',()=>{
 for(const id of [1,2]){
  const scene=new T.Scene(),rig=buildCharacter(id);scene.add(rig.g);const fx=createBurstEffects(scene);let disposed=0;
  rig.g.traverse(n=>n.geometry?.addEventListener('dispose',()=>disposed++));
  const name=fighters[id].id,duration=BURST_DURATIONS[name];
  const pose=burstPose(name,{t:duration*.5,duration},{x:-3,z:0},{x:3,z:0});
  fx.update(pose,rig);assert.equal(scene.children.length,5);fx.update(null,null);assert.equal(scene.children.length,2);assert.equal(disposed,0);
  fx.update(pose,rig);fx.reset();assert.equal(scene.children.length,2);assert.equal(disposed,0);
 }
});
test('longer bursts resolve damage exactly once for every fighter',()=>{
 for(let id=0;id<6;id++){
  const m=createMatch(id,0);update(m,[{...neutral(),super:true},neutral()]);
  for(let i=0;i<23;i++)update(m,[neutral(),neutral()]);assert.equal(m.cinematic?.duration,BURST_DURATIONS[fighters[id].id]);
  let impacts=0;for(let i=0;i<300;i++){update(m,[neutral(),neutral()]);impacts+=m.events.filter(e=>e.type==='hit').length;}
  assert.equal(impacts,1);assert.ok(Math.abs(m.players[1].hp-(100-27*fighters[id].power))<.0001);
 }
});
test('bursts show the six intended effects rather than only different labels',()=>{
 const sample=id=>burstPose(id,{t:BURST_DURATIONS[id]*.55,duration:BURST_DURATIONS[id]},{x:-4,z:0},{x:4,z:0});
 assert.ok(sample('aegis').effects.emitter&&sample('aegis').effects.beam>0);
 assert.equal(sample('rei').effects.echoes.length,3);assert.equal(sample('tala').effects.echoes.length,3);
 assert.notDeepEqual(sample('rei').effects.echoes,sample('tala').effects.echoes);
 assert.equal(sample('morrow').effects.rays.length,6);assert.ok(sample('sol').effects.orb.radius>0);assert.ok(sample('vesper').effects.rings>0);
});
test('guarded targets stay grounded in burst presentation and receive only chip damage',()=>{
 for(const id of Object.keys(BURST_DURATIONS)){
  const pose=burstPose(id,{t:BURST_DURATIONS[id]*.55,duration:BURST_DURATIONS[id]},{x:-4,z:0},{x:4,z:0,guard:true});assert.equal(pose.victim.y,0);
 }
 const m=createMatch();for(let i=0;i<20;i++)update(m,[neutral(),{...neutral(),guard:true}]);
 update(m,[{...neutral(),super:true},{...neutral(),guard:true}]);for(let i=0;i<230;i++)update(m,[neutral(),{...neutral(),guard:true}]);
 assert.ok(Math.abs(m.players[1].hp-(100-27*.12))<.00001);
});
test('burst completion produces one grounded knockdown instead of a second airborne bounce',()=>{
 const m=createMatch();update(m,[{...neutral(),super:true},neutral()]);for(let i=0;i<25;i++)update(m,[neutral(),neutral()]);
 while(m.cinematic)update(m,[neutral(),neutral()]);assert.equal(m.players[1].anim,'knockdown');assert.equal(m.players[1].air,0);assert.ok(m.players[1].stun>0);
});
