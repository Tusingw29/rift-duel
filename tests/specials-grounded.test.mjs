import test from 'node:test';import assert from 'node:assert/strict';
import {buildCharacter} from '../dist/characters.js';
import {animateCharacter} from '../dist/animation.js';
import {fighters} from '../dist/fighters.js';
import {moveTiming} from '../dist/moves.js';
import {techniques} from '../dist/techniques.js';
import {Vector3} from '../dist/vendor/three.module.js';
// Nothing a fighter does in a match should fall through to the old shared animator any more: specials, launches,
// rolls, victory poses, aerial pursuit beats and the capture/super grapple all run on the grounded rig.
const ids=['aegis','rei','tala','morrow','sol','vesper'];
const poseOf=(r,id)=>r[ids[id]+'Pose']||r.pose;
const finite=r=>{r.g.updateMatrixWorld(true);for(const b of [r.body,r.spine,r.head,...r.limbs,...r.elbows,...r.knees])assert.ok(b.matrixWorld.elements.every(Number.isFinite));};
const settle=r=>{for(let i=0;i<10;i++)animateCharacter(r,{anim:'idle',x:0,z:0},i/60);};
for(const [id,f] of fighters.entries()){
 test(`${f.name}: every special runs on the grounded rig, lands its peak on the contact frame and differs by kind`,()=>{
  const r=buildCharacter(id);const peaks={};
  for(const kind of ['shot','technique','launch','forward','back']){
   const t=kind==='technique'?{...techniques[f.id]}:moveTiming(f,kind),m={kind,chain:1,...t,effect:techniques[f.id].effect,frame:0};
   settle(r);
   for(let fr=0;fr<=t.startup+(t.active||1)+t.recovery;fr++){m.frame=fr;animateCharacter(r,{anim:kind==='shot'?'attack':kind,move:m,x:0,z:0},1+fr/60);finite(r);
    assert.equal(r.animationFamily,'grounded',`${f.name} ${kind} frame ${fr} on the grounded rig`);
    if(fr===t.startup)peaks[kind]={...poseOf(r,id)};}
   const end=poseOf(r,id);assert.ok(Math.abs(end.bodyZ)<.05,`${f.name} ${kind} returns to the stance`);
  }
  if(f.id!=='tala'){ // Tala's specials are authored individually in her own flow
   assert.ok(peaks.forward.bodyZ>peaks.back.bodyZ+.3,`${f.name} forward lunges where back retreats`);
   assert.ok(peaks.launch.lean<peaks.shot.lean,`${f.name} launch rises where the shot leans in`);
   const arms=p=>Math.hypot(p.lax,p.rax,p.le,p.re);assert.ok(Math.abs(arms(peaks.technique)-arms(peaks.shot))>.1||peaks.technique.lean!==peaks.shot.lean,`${f.name} technique reads differently from the shot`);}
 });
 test(`${f.name}: launches, rolls, victory, aerial pursuit beats and the grapple are grounded and finite`,()=>{
  const r=buildCharacter(id);settle(r);
  const states=[
   {anim:'launch',launched:true,air:.6,x:0,z:0},{anim:'launch',launched:true,air:.2,x:0,z:0},
   {anim:'roll',roll:{elapsed:.1,direction:1,forward:true},x:0,z:0},{anim:'roll',roll:{elapsed:.2,direction:-1,forward:false},x:0,z:0},
   {anim:'victory',animTime:.5,x:0,z:0},
   {anim:'pursuit',move:{kind:'pursuit',aerial:true,chain:1,startup:4,active:27,recovery:10,total:41,frame:14},air:.5,x:0,z:0},
   {anim:'grapple',animTime:.3,x:0,z:0},{anim:'grappled',animTime:.3,x:0,z:0}];
  for(const p of states){animateCharacter(r,p,2);finite(r);assert.equal(r.animationFamily,'grounded',`${f.name} ${p.anim} on the grounded rig`);}
  animateCharacter(r,{anim:'launch',launched:true,air:.2,x:0,z:0},2.1);const tumbled=poseOf(r,id);assert.ok(tumbled.bodyPitch<-1,`${f.name} tumbles when launched (${tumbled.bodyPitch.toFixed(2)})`);
  animateCharacter(r,{anim:'grappled',animTime:.3,x:0,z:0},2.2);const v=poseOf(r,id);assert.ok(v.laz>.8&&v.lk>.8,`${f.name} flails when grabbed`);
  animateCharacter(r,{anim:'victory',animTime:1,x:0,z:0},2.3);const w=poseOf(r,id);assert.ok(Math.hypot(w.lax,w.rax)>1,`${f.name} strikes a victory pose`);
 });
}
