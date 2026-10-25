import test from 'node:test';import assert from 'node:assert/strict';
import {buildCharacter} from '../dist/characters.js';
import {animateCharacter} from '../dist/animation.js';
import {rei,sol,vesper} from '../dist/roster-animation.js';
import {moveTiming} from '../dist/moves.js';import {fighters} from '../dist/fighters.js';
import {Vector3} from '../dist/vendor/three.module.js';
const roster=[[1,'rei',rei],[4,'sol',sol],[5,'vesper',vesper]];
const move=(id,chain,frame)=>({kind:'strike',...moveTiming(fighters[id],'strike'),chain,frame});
for(const [id,name,anim] of roster){
 test(`${name}: strike contact lands on the authored pose and the three cuts differ`,()=>{
  const contacts=[];
  for(const chain of [1,2,3]){
   const r=buildCharacter(id),m=move(id,chain,0);m.frame=m.startup;
   animateCharacter(r,{anim:'idle',x:0,z:0},0);animateCharacter(r,{anim:'strike',x:0,z:0,move:m},.1);
   const authored=anim.strikePose(m);for(const key of Object.keys(r[`${name}Pose`]))assert.ok(Math.abs(r[`${name}Pose`][key]-authored[key])<1e-9,'entry blend must be gone on contact');
   assert.ok(authored.bodyZ>.1,'contact drives the hips forward');
   r.g.updateMatrixWorld(true);const hand=r.limbs[2].userData.hand.getWorldPosition(new Vector3());assert.ok(Number.isFinite(hand.x));
   contacts.push(authored);
  }
  assert.notDeepEqual(contacts[0],contacts[1]);assert.notDeepEqual(contacts[1],contacts[2]);
 });
 test(`${name}: guard crosses the forearms in front of the chest with the chin tucked`,()=>{
  const r=buildCharacter(id);animateCharacter(r,{anim:'idle',x:0,z:0,guard:true,blockStun:0},0);animateCharacter(r,{anim:'idle',x:0,z:0,guard:true,blockStun:0},.5);
  r.g.updateMatrixWorld(true);
  const hands=[0,2].map(i=>r.limbs[i].userData.hand.getWorldPosition(new Vector3()));
  for(const h of hands){assert.ok(h.z>.1,'hands in front of the body');assert.ok(Math.abs(h.x)<.45,'hands pulled toward the centre line');assert.ok(h.y>1.3&&h.y<2.4,`hands at chest height (${h.y.toFixed(2)})`);}
  assert.ok(r.head.rotation.x>.2,'chin tucked');
 });
 test(`${name}: planted ankles stay fixed in idle and footwork follows travelled distance`,()=>{
  const r=buildCharacter(id),p={anim:'idle',x:0,z:0};animateCharacter(r,p,0);const plants=r.footPlants.map(v=>v.clone());
  for(let frame=1;frame<30;frame++)animateCharacter(r,p,frame/60);
  r.g.updateMatrixWorld(true);
  for(let i=0;i<2;i++){const foot=r.knees[i].localToWorld(new Vector3(0,-(r.shinLength||r.legLength),0));assert.ok(foot.distanceTo(plants[i])<1e-6,`${name} ankle ${i} slid ${foot.distanceTo(plants[i])}`);}
  const run={anim:'run',x:0,z:0,prev:{x:1,z:0}};animateCharacter(r,run,1);const phase=r.stridePhase||0;animateCharacter(r,run,1.5);assert.equal(r.stridePhase||0,phase,'no travel, no stride');run.z=.12;r.g.position.z=.12;animateCharacter(r,run,1.6);assert.ok(r.stridePhase>phase,'travel advances the stride');
 });
 test(`${name}: every shared state keeps the rig finite and the body upright`,()=>{
  const r=buildCharacter(id);
  for(const anim of ['idle','run','charge','hurt','guard','jump','knockdown','defeat','victory'])for(let frame=0;frame<12;frame++){
   animateCharacter(r,{anim,x:0,z:0,prev:{x:1,z:0},guard:anim==='guard',air:anim==='jump'?.6:0,animTime:frame/60,blockStun:0},frame/60);
   r.g.updateMatrixWorld(true);for(const bone of [r.body,r.spine,r.head,...r.limbs,...r.elbows,...r.knees])assert.ok(bone.matrixWorld.elements.every(Number.isFinite),`${name} ${anim}`);
  }
 });
}

import {HURT_TIME} from '../dist/grounded-animation.js';
for(const [id,name] of [[0,'aegis'],[1,'rei'],[3,'morrow'],[4,'sol'],[5,'vesper']])test(`${name}: a fresh hit snaps the body back and the reaction settles to stance as the hurt timer runs out`,()=>{
 const r=buildCharacter(id),poseOf=()=>r[name+'Pose'];
 animateCharacter(r,{anim:'idle',x:0,z:0},0);const stance={...poseOf()};
 const sample=t=>{for(let i=0;i<6;i++)animateCharacter(r,{anim:'hurt',x:0,z:0,animTime:t},1+i*.03);return {...poseOf()};};
 const fresh=sample(HURT_TIME-.08),late=sample(.02);
 assert.ok(fresh.lean<stance.lean-.15,`${name} fresh hit leans back (${fresh.lean.toFixed(2)} vs ${stance.lean.toFixed(2)})`);
 assert.ok(fresh.bodyZ<-.08,`${name} fresh hit is pushed back`);
 assert.ok(Math.abs(late.lean-stance.lean)<.05&&Math.abs(late.bodyZ)<.03,`${name} settles to stance (${late.lean.toFixed(2)})`);
});
