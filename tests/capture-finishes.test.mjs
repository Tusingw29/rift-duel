import test from 'node:test';
import assert from 'node:assert/strict';
import {finishProfiles} from '../dist/capture-finishes.js';
import {capturePresentation} from '../dist/cinematics.js';
import {stagedCapturePose} from '../dist/captures.js';
import {createMatch,update,neutral} from '../dist/combat.js';
import {fighters} from '../dist/fighters.js';
import {buildCharacter} from '../dist/characters.js';
import {animateCharacter,applyStagedPose} from '../dist/animation.js';
import {Box3} from '../dist/vendor/three.module.js';
test('all remaining rear and far captures acquire the right profile and apply damage once',()=>{
 for(let id=0;id<6;id++)for(const [context,profile] of Object.entries(finishProfiles[fighters[id].id])){
  const m=createMatch(id,1),b=m.players[1];b.x=context==='back'?-2:4;
  if(context==='back'){b.lookX=1;b.turnDelay=99;}
  const guard={...neutral(),guard:true};for(let j=0;j<20;j++)update(m,[neutral(),guard]);
  update(m,[{...neutral(),capture:true},guard]);
  for(let j=0;j<120&&!m.cinematic;j++)update(m,[neutral(),guard]);
  assert.equal(m.cinematic?.profile,profile);
  let count=0;for(let j=0;j<300;j++){update(m,[neutral(),guard]);count+=m.events.filter(e=>e.type==='hit').length;}
  assert.equal(count,1);assert.equal(m.players[0].stocks,1);
  const damage=15*fighters[id].power*(context==='back'?1.2:1.25);assert.ok(Math.abs(b.hp-(100-damage))<1e-6);
 }
});
test('new throws keep actor and victim rigs finite and above the floor',()=>{
 for(let id=0;id<6;id++)for(const context of Object.keys(finishProfiles[fighters[id].id])){
  const spec=capturePresentation(fighters[id].id,context),rigs=[buildCharacter(id),buildCharacter(1)];
  for(let frame=0;frame<=60;frame++){
   const pose=stagedCapturePose(fighters[id].id,{...spec,t:spec.duration*frame/60},{x:2,z:1},{x:-2,z:-1});
   for(const [rig,part] of [[rigs[0],pose.actor],[rigs[1],pose.victim]]){
    animateCharacter(rig,{anim:'idle'},frame/60);applyStagedPose(rig,part);rig.g.updateMatrixWorld(true);
    const bounds=new Box3().setFromObject(rig.body);assert.ok(bounds.min.y>=.029);assert.ok(bounds.max.y<10);
   }
  }
 }
});
test('far finishes distinguish a rushing attacker, travelling orb and surrounding cuts',()=>{
 const sample=(id,t)=>{const spec=capturePresentation(id,'far');return stagedCapturePose(id,{...spec,t:spec.duration*t},{x:-4,z:0},{x:4,z:0});};
 assert.ok(sample('tala',.4).actor.x>2);assert.equal(sample('tala',.4).effects.orb,null);
 const early=sample('morrow',.4),late=sample('morrow',.6);
 assert.ok(late.effects.orb.position.x>early.effects.orb.position.x);assert.equal(late.actor.x,-4);
 assert.equal(sample('vesper',.5).effects.echoes.length,3);assert.equal(sample('vesper',.5).effects.kind,'blade');
});
