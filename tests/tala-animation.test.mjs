import test from 'node:test';import assert from 'node:assert/strict';
import {strikePose,movePose,idlePose,hurtPose,guardPose,targetFor,blendPose,advanceStride,animateTala,stance,CHANNELS,STRIDE} from '../dist/tala-animation.js';
import {animateCharacter} from '../dist/animation.js';
import {buildCharacter} from '../dist/characters.js';
import {fighters} from '../dist/fighters.js';
import {moveTiming} from '../dist/moves.js';
const strike=(chain,frame)=>({kind:'strike',...moveTiming(fighters[2],'strike'),chain,frame});
test('punches start in the hips and chest, snap to extension at contact, and recover to stance',()=>{
 for(const chain of [1,2,3]){
  const m=strike(chain,0);const wind=strikePose({...m,frame:m.startup*.55}),contact=strikePose({...m,frame:m.startup}),rest=strikePose({...m,frame:m.total});
  assert.deepEqual(rest,stance);
  assert.ok(Math.sign(wind.twist)!==Math.sign(contact.twist)&&Math.abs(contact.twist)>.5,`chain ${chain} chest reverses through contact`);
  assert.ok(Math.sign(wind.hipYaw)!==Math.sign(contact.hipYaw),`chain ${chain} hips turn`);
  const arm=chain===2?'lax':'rax';assert.ok(contact[arm]<-1.25,'striking arm extends');assert.ok(contact.lean>.15,'weight goes forward');
  const half=strikePose({...m,frame:m.startup*.8}),early=strikePose({...m,frame:m.startup*.6});
  assert.ok(Math.abs(contact[arm]-half[arm])<Math.abs(contact[arm]-early[arm])*.6,'strike eases out fast');
 }
 assert.ok(strikePose(strike(3,5)).bodyZ>strikePose(strike(1,5)).bodyZ+.15,'hook steps in');
});
test('footwork phase advances with distance travelled, not time, and feet plant on strikes',()=>{
 const r={},p={anim:'run',x:0,z:0};advanceStride(r,p);p.x=.5;advanceStride(r,p);const moved=r.stridePhase;p.x=.5;advanceStride(r,p);assert.equal(r.stridePhase,moved,'standing still keeps the phase');
 assert.ok(Math.abs(moved-.5/STRIDE*Math.PI)<1e-9);p.anim='idle';advanceStride(r,p);assert.equal(r.stridePhase,moved,'stopping preserves the current step');
 const a=movePose(1,0,0),b=movePose(1,0,Math.PI/2);assert.notDeepEqual(a,b);assert.ok(b.llx<0&&b.rlx>0,'legs scissor mid-stride');
 assert.ok(movePose(-1,0,1).lean<0&&movePose(1,0,1).lean>0,'advance leans in, retreat leans back');
 const strafe=movePose(0,1,0);assert.ok(Math.abs(strafe.llz)>.1&&Math.abs(strafe.llx)<.2,'circling steps sideways');
 const contact=strikePose(strike(1,5));assert.ok(contact.rlx>.4&&contact.lk>.3,'rear foot drives and front knee bends');
});
test('states blend from the current pose and reactions snap on impact',()=>{
 const from=idlePose(0),to=guardPose(0);const step=blendPose(from,to,20,1/60);
 for(const k of CHANNELS){const t=step[k],lo=Math.min(from[k],to[k]),hi=Math.max(from[k],to[k]);assert.ok(t>=lo-1e-9&&t<=hi+1e-9,k);}
 assert.ok(Math.abs(step.lax-to.lax)<Math.abs(from.lax-to.lax),'arms move toward guard');
 assert.ok(Math.abs(step.hx-to.hx)>Math.abs(step.lax-to.lax)*.9*Math.abs(from.hx-to.hx)/Math.abs(from.lax-to.lax),'head trails the body');
 assert.deepEqual(blendPose(from,to,Infinity,1/60),to);assert.deepEqual(blendPose(from,to,20,0),from);
 assert.equal(targetFor({anim:'hurt',animTime:.42},0).rate,Infinity);assert.ok(targetFor({anim:'hurt',animTime:.2},0).rate<Infinity);
 assert.ok(hurtPose(.42).hx<-.4&&Math.abs(hurtPose(0).hx-stance.hx)<1e-9,'head whips back then settles');
 assert.equal(targetFor({anim:'launch',air:.5,launched:true},0),null,'launch falls back to the shared animator');
 assert.equal(targetFor({anim:'idle',move:{kind:'technique',frame:1}},0),null);
});
test('Tala rig animates through the sample system with lagging ponytail and deterministic frozen frames',()=>{
 const r=buildCharacter(2);
 animateCharacter(r,{anim:'idle',x:0,z:0},0);assert.ok(r.pose,'sample system engaged');
 const p={anim:'strike',move:strike(1,3),x:0,z:0,prev:{x:0,z:0}};
 const matrices=()=>{r.g.updateMatrixWorld(true);const out=[];r.g.traverse(n=>out.push([...n.matrixWorld.elements]));return out;};
 animateCharacter(r,p,1);const first=matrices();animateCharacter(r,p,1);assert.deepEqual(matrices(),first);
 for(let t=1;t<1.5;t+=1/60)animateCharacter(r,{...p,move:strike(1,5)},t);assert.ok(r.limbs[2].rotation.x<-1.4,'right arm reaches extension after blending');
 animateCharacter(r,{anim:'launch',air:.6,launched:true,x:0,z:0},2);assert.equal(r.pose,null,'shared animator takes over outside the sample states');
 const other=buildCharacter(0);animateCharacter(other,{anim:'idle',x:0,z:0},0);assert.equal(other.pose,undefined,'other fighters are untouched');
});

test('live fighter movement feeds the rig stride without a synthetic player phase',()=>{
 const r=buildCharacter(2),p={anim:'run',x:0,z:0,prev:{x:1,z:0}};
 animateCharacter(r,p,0);const first=r.pose.llx;
 for(let i=1;i<=12;i++){p.x=i*.04;animateCharacter(r,p,i/60);}
 assert.equal(p.stridePhase,undefined);assert.ok(Math.abs(r.pose.llx-first)>.2,'live legs actually step');
 const phase=r.stridePhase;animateCharacter(r,{...p,anim:'idle'},13/60);assert.equal(r.stridePhase,phase);
 assert.ok(movePose(-1,0,1).llx>0&&movePose(1,0,1).llx<0,'retreat reverses the step');
});
test('a live strike reaches its authored contact pose on the damage frame',()=>{
 for(const chain of [1,2,3]){
  const r=buildCharacter(2),p={anim:'idle',x:0,z:0};animateCharacter(r,p,0);
  p.anim='strike';p.move=strike(chain,0);
  for(let frame=0;frame<=p.move.startup;frame++){p.move.frame=frame;animateCharacter(r,p,(frame+1)/60);}
  assert.deepEqual(r.pose,strikePose(p.move),'no smoothing delay at contact');
 }
});
test('grounded ankle plants survive torso weight shifts and release for airborne motion',()=>{
 const r=buildCharacter(2),p={anim:'idle',x:0,z:0};animateCharacter(r,p,0);
 const plants=r.footPlants.map(v=>v.clone());
 for(let i=1;i<20;i++)animateCharacter(r,p,i/60);
 r.g.updateMatrixWorld(true);
 for(let i=0;i<2;i++){
  const foot=r.knees[i].localToWorld(plants[i].clone().set(0,-.48,0));
  assert.ok(foot.distanceTo(plants[i])<1e-6,'support ankle stays in world space');
 }
 animateCharacter(r,{...p,anim:'launch',air:.5},1);assert.equal(r.footPlants,null);
});
