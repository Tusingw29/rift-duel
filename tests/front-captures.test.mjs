import test from 'node:test';
import assert from 'node:assert/strict';
import {Box3} from '../dist/vendor/three.module.js';
import {buildCharacter} from '../dist/characters.js';
import {animateCharacter,applyStagedPose} from '../dist/animation.js';
import {capturePresentation} from '../dist/cinematics.js';
import {stagedCapturePose} from '../dist/captures.js';
import {fighters} from '../dist/fighters.js';
import {createMatch,neutral,update} from '../dist/combat.js';
test('each close front capture has a unique motion profile and resolves once without stock',()=>{
 const profiles=new Set();
 for(let id=0;id<6;id++){
  const m=createMatch(id,1);m.players[1].x=-2;
  update(m,[{...neutral(),capture:true},neutral()]);
  for(let i=0;i<30&&!m.cinematic;i++)update(m,[neutral(),neutral()]);
  assert.equal(m.cinematic.context,'front');profiles.add(m.cinematic.profile);
  assert.equal(m.cinematic.profile,capturePresentation(fighters[id].id,'front').profile);
  let impacts=0;
  for(let i=0;i<240;i++){update(m,[neutral(),neutral()]);impacts+=m.events.filter(e=>e.type==='hit').length;}
  assert.equal(impacts,1);assert.equal(m.players[0].stocks,1);
  assert.ok(Math.abs(m.players[1].hp-(100-15*fighters[id].power))<1e-6);
 }
 assert.equal(profiles.size,6);
});
test('front capture bodies stay above the floor throughout throws in both facing directions',()=>{
 for(let id=0;id<6;id++)for(const side of [-1,1]){
  const actor=buildCharacter(id),victim=buildCharacter((id+1)%6);
  const a={x:-side,z:0},b={x:side,z:.4},spec=capturePresentation(fighters[id].id,'front');
  for(let frame=0;frame<=60;frame++){
   const pose=stagedCapturePose(fighters[id].id,{...spec,t:spec.duration*frame/60},a,b);
   for(const [rig,part] of [[actor,pose.actor],[victim,pose.victim]]){
    animateCharacter(rig,{anim:'idle'},frame/60);applyStagedPose(rig,part);rig.g.updateMatrixWorld(true);
    const bounds=new Box3().setFromObject(rig.body);
    assert.ok(bounds.min.y>=.029,`${id}/${side}/${frame}`);
    assert.ok(bounds.max.y<9);
   }
  }
 }
});
test('close captures have recognizable differences in motion and effects',()=>{
 const sample=(id,t)=>{const spec=capturePresentation(id,'front');return stagedCapturePose(id,{...spec,t:spec.duration*t},{x:-2,z:0},{x:0,z:0});};
 assert.ok(sample('aegis',.5).victim.y>2);
 assert.ok(sample('rei',.5).victim.roll>0);
 assert.ok(sample('tala',.45).victim.y>2);
 assert.ok(sample('morrow',.5).victim.yaw>Math.PI);
 assert.ok(Math.abs(sample('sol',.5).victim.z)>1);
 assert.equal(sample('vesper',.4).effects.echoes.length,3);
});
