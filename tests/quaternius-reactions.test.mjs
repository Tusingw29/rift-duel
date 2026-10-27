import test from 'node:test';import assert from 'node:assert/strict';
import {IMPORT_CLIPS,REACTIONS,BLOCK_STUN,hurtClipU,guardHitClipU,importedHurtPose,importedGuardHitPose} from '../dist/imported-motion.js';
import {HURT_TIME} from '../dist/grounded-animation.js';
import {targetFor,hurtPose,guardPose,stance,guard} from '../dist/tala-animation.js';
import {rhythmPose} from '../dist/footwork.js';
import {setLocomotionSource,locomotionSource} from '../dist/locomotion-clips.js';
import {createScenario,stepScenario,scenarioAt} from '../dist/sandbox-recipes.js';
import {buildCharacter} from '../dist/characters.js';
import {animateCharacter} from '../dist/animation.js';
import {Vector3} from '../dist/vendor/three.module.js';
// QUATERNIUS-REACTIONS: Quaternius Hit_Chest / Hit_Head as Tala's hit reactions, imported source only.
const imported=fn=>{setLocomotionSource('imported');try{return fn();}finally{setLocomotionSource('authored');}};
const close=(a,b,eps=1e-9)=>Object.keys(b).every(k=>Math.abs((a[k]??0)-(b[k]??0))<eps);
// Tala (P1) in the two review recipes, frame by frame.
const states=(name,n=60)=>{const s=createScenario(name,2,1),out=[];for(let f=0;f<=n;f++){out.push({f,p:structuredClone(s.m.players[0])});stepScenario(s);}return out;};
test('both clips load with their Quaternius CC0 source, open on the hit and settle to zero deviation',()=>{
 for(const [clip,name,ch,min] of [[IMPORT_CLIPS.hitHead,'Hit_Head','hx',.25],[IMPORT_CLIPS.hitChest,'Hit_Chest','lean',.15]]){
  assert.match(clip.meta.source,new RegExp(`^Quaternius Universal Animation Library Standard, ${name}, CC0`));
  assert.equal(clip.meta.mode,'reaction');assert.equal(clip.meta.firstFrame,0,'the hit frame (BVH frame 0) is kept');
  const first=clip.keys[0][1],end=clip.keys.at(-1)[1];
  assert.ok(first[ch]<end[ch]-min,`${name} opens deflected back (${ch} ${(first[ch]-end[ch]).toFixed(2)})`);
  assert.deepEqual(clip.keys.at(-1)[2].hip,[0,0,0],'hips relative to the settled end');
  assert.ok(clip.keys.every(k=>k[2].lc&&k[2].rc),'feet planted in the source');
 }
 assert.equal(REACTIONS.hurt,IMPORT_CLIPS.hitChest);assert.equal(REACTIONS.guard,IMPORT_CLIPS.hitHead);
});
test('the reactions are driven by the simulation timers: hit pose first, her own stance or guard at the end',()=>{
 assert.equal(hurtClipU(HURT_TIME),0);assert.equal(hurtClipU(0),1);assert.equal(guardHitClipU(BLOCK_STUN),0);assert.equal(guardHitClipU(0),1);
 const hit=importedHurtPose(stance,HURT_TIME);assert.ok(hit.lean<stance.lean-.15&&hit.hx<stance.hx-.3,'chest and head thrown back on the hit');
 assert.ok(close(importedHurtPose(stance,0),stance),'back in stance when the hurt timer ends');
 const g=importedGuardHitPose(guard,BLOCK_STUN);assert.ok(g.hx<guard.hx-.25,'head snaps back behind the guard');
 for(const ch of ['lax','lay','laz','rax','ray','raz','le','re','lw','rw','lk','rk'])assert.equal(g[ch],guard[ch],`arms and legs hold the guard (${ch})`);
 assert.deepEqual(importedGuardHitPose(guard,0),guard,'no block stun: plain guard');
 let prev=-1;for(let a=HURT_TIME;a>=0;a-=1/60){const u=hurtClipU(a);assert.ok(u>=prev);prev=u;}
 const held=[importedHurtPose(stance,.42,3),importedHurtPose(stance,.42,3)];assert.deepEqual(held[0],held[1],'hitstop holds a fixed pose (the timer is frozen)');
 assert.notEqual(importedHurtPose(stance,.42,3).bodyX,importedHurtPose(stance,.42,2).bodyX,'with the roster hitstop shudder');
});
test('the recoil and guard-hit recipes reach the hurt and guarded-hit states the reactions cover',()=>{
 const r=states('recoil'),g=states('guard-hit');
 assert.ok(r.some(s=>s.p.anim==='hurt'),'recoil: Tala is hit');assert.ok(g.some(s=>s.p.guard&&s.p.blockStun>0),'guard-hit: Tala blocks');
 imported(()=>{
  for(const {p} of r)if(p.anim==='hurt'&&!p.guard)assert.deepEqual(targetFor(p,0).pose,targetFor({...p},0).pose);
  const hurt=r.find(s=>s.p.anim==='hurt').p;assert.ok(close(targetFor(hurt,0).pose,importedHurtPose(stance,hurt.animTime,hurt.hitstop)),'imported hurt = Hit_Chest');
  const blk=g.find(s=>s.p.guard&&s.p.blockStun>0).p;assert.ok(close(targetFor(blk,0).pose,rhythmPose(importedGuardHitPose(guard,blk.blockStun),0,.4)),'imported guarded hit = Hit_Head');
 });
});
test('default unchanged: the authored source still plays the authored recoil and guard',()=>{
 assert.equal(locomotionSource(),'authored');
 for(const {p} of states('recoil'))if(p.anim==='hurt'&&!p.guard)assert.deepEqual(targetFor(p,0).pose,hurtPose(p.animTime||0,p.hitstop));
 for(const {p} of states('guard-hit'))if(p.guard)assert.deepEqual(targetFor(p,.5).pose,rhythmPose(guardPose(p.blockStun||0),.5,.4));
});
test('replays: identical bones on fresh rigs, and scrubbing equals stepping, through both recipes',()=>{
 const bones=r=>[r.body,r.spine,r.head,...r.limbs,...r.elbows,...r.knees].map(b=>b.getWorldPosition(new Vector3()).toArray().map(v=>+v.toFixed(9)));
 imported(()=>{for(const name of ['recoil','guard-hit']){
  const runs=[];
  for(let run=0;run<2;run++){const r=buildCharacter(2),s=createScenario(name,2,1),out=[];
   for(let f=0;f<=48;f++){animateCharacter(r,s.m.players[0],f/60);r.g.updateMatrixWorld(true);if(f%6===0)out.push(bones(r));stepScenario(s);}runs.push(out);}
  assert.deepEqual(runs[0],runs[1],`${name}: two fresh rigs agree`);
  const st=states(name,30);for(const f of [4,12,24,30])assert.deepEqual(scenarioAt(name,f,2,1).m.players[0].animTime,st[f].p.animTime,`${name} frame ${f}`);
 }});
});
