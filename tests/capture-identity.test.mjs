import test from 'node:test';import assert from 'node:assert/strict';
import {burstPose,capturePresentation} from '../dist/cinematics.js';
import {createMatch,update,neutral} from '../dist/combat.js';
test('authored capture identities apply only to the intended fighter and range',()=>{
 assert.equal(capturePresentation('aegis','far').profile,'orbital');
 assert.equal(capturePresentation('tala','mid').profile,'surround');
 for(const id of ['aegis','tala','rei','morrow','sol','vesper'])for(const context of ['front','back','mid','far']){
  if(id==='aegis'&&context==='far'||id==='tala'&&context==='mid')continue;
  assert.equal(capturePresentation(id,context).profile,null);
 }
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
 for(const [id,x,profile,damage] of [[0,4,'orbital',18.75],[2,0,'surround',16.83]]){
  const m=createMatch(id,1);m.players[1].x=x;
  const guard={...neutral(),guard:true};for(let i=0;i<20;i++)update(m,[neutral(),guard]);
  update(m,[{...neutral(),capture:true},guard]);
  for(let i=0;i<120&&!m.cinematic;i++)update(m,[neutral(),guard]);
  assert.equal(m.cinematic?.profile,profile);assert.equal(m.players[0].stocks,1);
  let impacts=0;for(let i=0;i<300;i++){update(m,[neutral(),guard]);impacts+=m.events.filter(e=>e.type==='hit').length;}
  assert.equal(impacts,1);assert.ok(Math.abs(m.players[1].hp-(100-damage))<1e-6);
 }
});
