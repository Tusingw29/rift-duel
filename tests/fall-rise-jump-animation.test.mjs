import test from 'node:test';import assert from 'node:assert/strict';
import {buildCharacter} from '../dist/characters.js';
import {animateCharacter} from '../dist/animation.js';
import {fighters} from '../dist/fighters.js';
import {moveTiming} from '../dist/moves.js';
import {Vector3,Box3} from '../dist/vendor/three.module.js';
// Measured from CMU 90_18 (backward fall), 77_18 (getting up), 13_11 / 75_01 (jumps) and 02_05 / 14_01 (punches):
// a knockdown drops the body to the floor in about half a second with the limbs thrown, the rise is a roll,
// a knee and a push, a landing folds the knees, and a punch counter-rotates the hips before it extends.
const poseOf=(r,id)=>r[['aegis','rei','tala','morrow','sol','vesper'][id]+'Pose']||r.pose;
const world=(r,node)=>{r.g.updateMatrixWorld(true);return node.getWorldPosition(new Vector3());};
// Joint heights, not mesh bounds: the classic test rig's batched meshes do not follow the limbs.
const lowest=r=>{r.g.updateMatrixWorld(true);const shin=r.shinLength||r.legLength||.56;const pts=[r.head,...r.elbows,...r.knees,r.limbs[0].userData.hand,r.limbs[2].userData.hand].map(n=>n.getWorldPosition(new Vector3()).y);pts.push(...r.knees.map(k=>k.localToWorld(new Vector3(0,-shin,0)).y));return Math.min(...pts);};
const finite=r=>{r.g.updateMatrixWorld(true);for(const b of [r.body,r.spine,r.head,...r.limbs,...r.elbows,...r.knees])assert.ok(b.matrixWorld.elements.every(Number.isFinite));};
for(const [id,f] of fighters.entries()){
 test(`${f.name}: a knockdown falls backward onto the floor with the limbs thrown, then rises through a roll and a crouch`,()=>{
  const r=buildCharacter(id);
  for(let i=0;i<12;i++)animateCharacter(r,{anim:'idle',x:0,z:0},i/60);
  const standingHead=world(r,r.head).y;
  let t=0,armsThrown=false,legsUp=false;
  for(let frame=0;frame<=33;frame++){t=frame/60;const p={anim:'knockdown',animTime:Math.max(0,.55-t),x:0,z:0};animateCharacter(r,p,.2+t);finite(r);
   const q=poseOf(r,id);if(t>.08&&t<.2&&q.lax<-1.5)armsThrown=true;if(t>.18&&t<.3&&q.llx<-.5)legsUp=true;
   assert.ok(lowest(r)>-.06,`${f.name} never sinks through the floor (${lowest(r).toFixed(2)} at ${t.toFixed(2)}s)`);}
  const q=poseOf(r,id),head=world(r,r.head).y,pelvis=world(r,r.body).y;
  assert.ok(q.bodyPitch<-1.3,`${f.name} lies on the back (${q.bodyPitch.toFixed(2)})`);
  assert.ok(head<.6&&pelvis<.5,`${f.name} head ${head.toFixed(2)} and pelvis ${pelvis.toFixed(2)} are on the floor`);
  assert.ok(armsThrown,`${f.name} arms flung during the topple`);assert.ok(legsUp,`${f.name} legs kicked up at the impact`);
  // The simulation stands up at once; the body rises over the next 0.45 s.
  const heights=[];for(let frame=1;frame<=36;frame++){animateCharacter(r,{anim:'idle',x:0,z:0},.75+frame/60);finite(r);heights.push(world(r,r.head).y);}
  assert.ok(heights[5]<standingHead-.9,`${f.name} still low 0.1 s into the rise (${heights[5].toFixed(2)})`);
  assert.ok(heights[17]<standingHead-.25,`${f.name} crouched at 0.3 s (${heights[17].toFixed(2)})`);
  assert.ok(heights[35]>standingHead-.08,`${f.name} standing after the rise (${heights[35].toFixed(2)} vs ${standingHead.toFixed(2)})`);
  for(let i=1;i<heights.length;i++)assert.ok(heights[i]>=heights[i-1]-.06,`${f.name} rises without dropping back (${i})`);
 });
 test(`${f.name}: a jump extends the legs at take-off, tucks at the top, reaches for the floor and absorbs the landing`,()=>{
  const r=buildCharacter(id);
  for(let i=0;i<12;i++)animateCharacter(r,{anim:'idle',x:0,z:0},i/60);
  const stanceY=poseOf(r,id).bodyY;
  const knees=[];
  for(let frame=0;frame<=51;frame++){const air=Math.max(0,.85-frame/60);animateCharacter(r,{anim:air>0?'jump':'idle',air,x:0,z:0},.5+frame/60);finite(r);knees.push([air,poseOf(r,id).lk]);}
  const atTakeoff=knees.find(([air])=>air>.8)[1],atTop=knees.find(([air])=>air<.5&&air>.4)[1];
  assert.ok(atTop>atTakeoff+.4,`${f.name} knees fold at the top of the jump (${atTakeoff.toFixed(2)} → ${atTop.toFixed(2)})`);
  const landing=[];for(let frame=1;frame<=20;frame++){animateCharacter(r,{anim:'idle',x:0,z:0},1.4+frame/60);landing.push(poseOf(r,id).bodyY);}
  assert.ok(Math.min(...landing)<stanceY-.12,`${f.name} sinks on landing (${Math.min(...landing).toFixed(2)} vs ${stanceY.toFixed(2)})`);
  assert.ok(Math.abs(landing.at(-1)-stanceY)<.14,`${f.name} recovers from the landing`); // within the idle weight rhythm's bounce
 });
 if(id===2)test('Tala: punches counter-rotate the hips in the wind-up and keep the arm out through the opening',()=>{
  const r=buildCharacter(2),timing=moveTiming(fighters[2],'strike');
  for(const chain of [1,2,3]){
   const m={kind:'strike',chain,...timing,frame:0};const at=frame=>{for(let i=0;i<10;i++)animateCharacter(r,{anim:'idle',x:0,z:0},i/60);for(let f=0;f<=frame;f++){m.frame=f;animateCharacter(r,{anim:'strike',move:m,x:0,z:0},1+f/60);}return {...poseOf(r,2)};};
   for(let i=0;i<10;i++)animateCharacter(r,{anim:'idle',x:0,z:0},i/60);
   const wind=at(Math.floor(timing.startup*.5)),contact=at(timing.startup),open=at(timing.startup+timing.active+Math.round(timing.recovery*.3)),stance=at(timing.total);
   assert.ok(Math.sign(wind.hipYaw)!==Math.sign(contact.hipYaw)&&Math.abs(wind.hipYaw)>.15,`chain ${chain} hips load the other way (${wind.hipYaw.toFixed(2)} → ${contact.hipYaw.toFixed(2)})`);
   assert.ok(Math.abs(contact.hipYaw)>=.45,`chain ${chain} hips carry the punch (${contact.hipYaw.toFixed(2)})`);
   const rear=chain===2?'lk':'rk';assert.ok(wind[rear]>stance[rear]+.2,`chain ${chain} rear knee loads (${wind[rear].toFixed(2)} vs ${stance[rear].toFixed(2)})`);
   const arm=chain===2?'lax':'rax';assert.ok(open[arm]<-1.0,`chain ${chain} arm still out 30% into the recovery (${open[arm].toFixed(2)})`);
  }
 });
}
