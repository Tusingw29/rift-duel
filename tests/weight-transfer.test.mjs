import test from 'node:test';import assert from 'node:assert/strict';
import {Vector3} from '../dist/vendor/three.module.js';
import {buildCharacter} from '../dist/characters.js';
import {animateCharacter} from '../dist/animation.js';
import {fighters} from '../dist/fighters.js';
import {moveTiming} from '../dist/moves.js';
import {createScenario,stepScenario} from '../dist/sandbox-recipes.js';
import {airHeight} from '../dist/air-motion.js';
import {weightShift,weightProfile,applyWeight,MAX_DRIVE} from '../dist/weight-transfer.js';
// WEIGHT-TRANSFER (Adam, 2026-10-27: "still move like Rock 'Em Sock 'Em Robots"): attacks are driven from the floor.
// These check the mechanics that make that read, not the taste; the verdict is Adam's at normal speed.
const poseOf=(r,id)=>r[['aegis','rei','tala','morrow','sol','vesper'][id]+'Pose']||r.pose;
const ankles=r=>{r.g.updateMatrixWorld(true);const shin=r.shinLength||r.legLength||.56;return r.knees.map(k=>r.g.worldToLocal(k.localToWorld(new Vector3(0,-shin,0))));};

test('a strike loads back and down, then drives forward over a stepped-in lead foot, and returns to zero',()=>{
 const m={kind:'strike',chain:1,...moveTiming(fighters[2],'strike',1)};
 const load=weightShift(m,m.startup*.42),hit=weightShift(m,m.startup),end=m.startup+m.active+m.recovery;
 assert.ok(load.bodyZ<0&&load.bodyY<-.08,'the load sits back and sinks into the rear leg');
 assert.ok(hit.bodyZ>.2&&hit.lean>.1&&hit.bodyY<0,'contact: hips forward and still low, chest over the front foot');
 assert.ok(hit.lead.z>.15&&hit.lead.y<1e-9,'the lead foot has stepped in and is planted at contact');
 assert.ok(Math.abs(hit.rear.z)<1e-9,'the rear ball stays planted through the push (the heel pivots on it)');
 const carry=weightShift(m,m.startup+m.active+m.recovery*.3);assert.ok(carry.bodyZ>hit.bodyZ&&carry.rear.z>.05,'the weight carries past the line and drags the rear foot in');
 assert.equal(weightShift(m,end),null,'gone by the end of recovery');
 for(const kind of ['pursuit','jumpAttack'])assert.equal(weightProfile({kind,startup:9,recovery:9}),null,`${kind}: the simulation owns the travel`);
 assert.equal(weightProfile({kind:'strike',startup:9,recovery:9,travel:{}}),null);
 assert.ok(weightShift({kind:'back',startup:18,active:4,recovery:28},18).bodyZ<0,'a back special shifts the weight away');
});
test('the authored lunge counts toward the drive cap and the arms and head keep their aim through the lean',()=>{
 const m={kind:'strike',chain:3,...moveTiming(fighters[2],'strike',3)};m.frame=m.startup;
 const base={bodyZ:.36,bodyY:0,lean:.2,hx:0,lax:-1,rax:-1};const out=applyWeight(base,m),w=weightShift(m);
 assert.ok(out.bodyZ<=MAX_DRIVE+1e-9&&out.bodyZ>base.bodyZ);
 assert.ok(Math.abs((out.lax-base.lax)+(out.lean-base.lean)*.9)<1e-9&&out.hx<base.hx,'arms and head counter the extra lean');
 assert.equal(out.lean-base.lean,w.lean);
});
for(const [id,f] of fighters.entries())test(`${f.name}: a strike moves the hips and feet together, then everything returns home`,()=>{
 const r=buildCharacter(id),t=moveTiming(f,'strike',1),m={kind:'strike',chain:1,...t,frame:0};
 for(let i=0;i<10;i++)animateCharacter(r,{anim:'idle',x:0,z:0},i/60);
 m.frame=0;animateCharacter(r,{anim:'strike',move:m,x:0,z:0},1);const home=ankles(r),hips0=poseOf(r,id).bodyZ;
 const lead=home[0].z>home[1].z?0:1;let hips=-Infinity,step=-Infinity;
 for(let fr=1;fr<=t.startup;fr++){m.frame=fr;animateCharacter(r,{anim:'strike',move:m,x:0,z:0},1+fr/60);}
 hips=poseOf(r,id).bodyZ-hips0;step=ankles(r)[lead].z-home[lead].z;
 assert.ok(hips>.25,`${f.name} hips drive through contact (${hips.toFixed(3)})`);
 assert.ok(step>.12,`${f.name} lead foot steps in (${step.toFixed(3)})`);
 const end=t.startup+(t.active||1)+t.recovery;for(let fr=t.startup+1;fr<=end+12;fr++){m.frame=Math.min(fr,end);animateCharacter(r,fr<end?{anim:'strike',move:m,x:0,z:0}:{anim:'idle',x:0,z:0},1+fr/60);}
 // Back in idle the feet resume their stepping rhythm; compare against a fresh rig at the same idle time.
 const fresh=buildCharacter(id);for(let i=0;i<=10;i++)animateCharacter(fresh,{anim:'idle',x:0,z:0},1+(end+2+i)/60);
 const a=ankles(r),b=ankles(fresh);for(let i=0;i<2;i++)assert.ok(Math.hypot(a[i].x-b[i].x,a[i].z-b[i].z)<.02,`${f.name} foot ${i} home (${Math.hypot(a[i].x-b[i].x,a[i].z-b[i].z).toFixed(3)})`);
});
// The simulation advances the root up to 0.4 toward the rival in one frame when a combo chains. The animation turns
// that into the step-in: no foot or hip jumps, the feet never cross, and hitstop freezes everything.
for(const id of [0,2,3])test(`${fighters[id].name}: a three-hit combo absorbs the chain advance into the steps`,()=>{
 const r=buildCharacter(id),s=createScenario('strike3',id,1);let time=0,prev=null,advances=0;
 for(let f=0;f<=(s.recipe.frames||90);f++){
  if(f>0)stepScenario(s);const p=s.m.players[0],hs=s.m.hitstop>0&&prev?.hs;time+=f===0||s.m.hitstop>0?0:1/60;
  r.g.position.set(p.x,airHeight(p),p.z);r.g.rotation.y=Math.atan2(p.lookX,p.lookZ);animateCharacter(r,p,time);r.g.updateMatrixWorld(true);
  const shin=r.shinLength||r.legLength,world=r.knees.map(k=>k.localToWorld(new Vector3(0,-shin,0))),local=world.map(w=>r.g.worldToLocal(w.clone())),hips=r.body.getWorldPosition(new Vector3());
  if(prev){
   if(Math.hypot(p.x-prev.root[0],p.z-prev.root[1])>.3)advances++;
   const limit=hs?1e-6:.2; // a swinging foot moves fast on a long step; the chain advance was a 0.4 teleport
   world.forEach((w,i)=>assert.ok(w.distanceTo(prev.world[i])<limit,`frame ${f}: foot ${i} moved ${w.distanceTo(prev.world[i]).toFixed(3)} in one frame`));
   assert.ok(hips.distanceTo(prev.hips)<(hs?1e-6:.13),`frame ${f}: hips moved ${hips.distanceTo(prev.hips).toFixed(3)} in one frame`);
  }
  assert.ok(local[0].x<local[1].x-.2,`frame ${f}: feet stay on their own sides (${local[0].x.toFixed(2)}, ${local[1].x.toFixed(2)})`);
  prev={world,hips,root:[p.x,p.z],hs:s.m.hitstop>0};
 }
 assert.ok(advances>=2,'the scenario exercises the chain advance');
});
