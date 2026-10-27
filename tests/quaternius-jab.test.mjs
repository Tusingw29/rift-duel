import test from 'node:test';import assert from 'node:assert/strict';
import {IMPORT_CLIPS,jabClip,jabState,importedJabPose,importedJabWeight} from '../dist/imported-motion.js';
import {clipU} from '../dist/imported-combat.js';
import {strikePose,stance} from '../dist/tala-animation.js';
import {setLocomotionSource,locomotionSource} from '../dist/locomotion-clips.js';
import {moveTiming} from '../dist/moves.js';
import {fighters} from '../dist/fighters.js';
import {createScenario,stepScenario,scenarioAt} from '../dist/sandbox-recipes.js';
import {buildCharacter} from '../dist/characters.js';
import {animateCharacter} from '../dist/animation.js';
import {Vector3} from '../dist/vendor/three.module.js';
// QUATERNIUS-JAB: the Quaternius UAL jab on Tala's strike 1, imported source only.
const move=(chain,frame=0)=>({kind:'strike',chain,...moveTiming(fighters[2],'strike',chain),frame});
const imported=fn=>{setLocomotionSource('imported');try{return fn();}finally{setLocomotionSource('authored');}};
const jab=IMPORT_CLIPS.jab;
test('the jab clip loads with its Quaternius CC0 source, a marked contact and the right hand punching',()=>{
 assert.match(jab.meta.source,/^Quaternius Universal Animation Library Standard, Punch_Jab, CC0/);
 assert.equal(jab.meta.mode,'strike');assert.equal(jab.meta.effector,'r');assert.equal(jab.meta.frameTime.toFixed(4),'0.0417');
 const ki=jab.keys.find(k=>Math.abs(k[0]-jab.meta.impact)<1e-6);assert.ok(ki,'a key sits on the contact');
 assert.ok(jab.keys[0][1].re<-1.9&&ki[1].re>-.1,`right elbow from guard to straight (${jab.keys[0][1].re} -> ${ki[1].re})`);
 for(const k of jab.keys)assert.ok(Math.abs(k[1].le-jab.keys[0][1].le)<.05,'the left hand stays in guard (mirrored jab)');
 assert.ok(ki[1].twist<jab.keys[0][1].twist-.4,'the shoulders turn the right side forward');
 assert.ok(jab.keys.every(k=>k[2].lc&&k[2].rc),'both feet stay planted in the source');
 assert.ok(Math.abs(jab.keys.at(-1)[1].re-jab.keys[0][1].re)<.1,'back in guard at the end');
});
test('only Tala\'s grounded strike 1 takes the jab, and only while it is enabled',()=>{
 assert.equal(jabClip('tala',move(1)),jab);assert.equal(jabClip('tala',move(2)),null);assert.equal(jabClip('tala',move(3)),null);
 assert.equal(jabClip('aegis',move(1)),null);assert.equal(jabClip('tala',{...move(1),travel:{}}),null);assert.equal(jabClip('tala',{...move(1),kind:'shot'}),null);
 jabState.enabled=false;try{assert.equal(jabClip('tala',move(1)),null);}finally{jabState.enabled=true;}
});
test('the arm is straight on the simulation\'s strike-1 contact frame and held through the active frames',()=>{
 const m=move(1),end=m.startup+m.active+m.recovery;
 assert.deepEqual([m.startup,m.active,m.recovery],[9,3,16],'strike-1 budget from docs/COMBAT_FRAME_BUDGETS.md, unchanged');
 assert.ok(Math.abs(clipU(m,jab,m.startup)-jab.meta.impact)<1e-12,'clip contact on the startup frame');
 const re=imported(()=>Array.from({length:end+1},(_,f)=>strikePose({...m,frame:f}).re));
 const most=Math.max(...re);
 for(let f=m.startup;f<m.startup+m.active;f++)assert.ok(Math.abs(re[f]-re[m.startup])<1e-9,`contact held through active (frame ${f}: ${re[f].toFixed(3)})`);
 assert.ok(most-re[m.startup]<.05,`contact within 0.05 of the straightest frame (the source opens slightly past contact: ${re[m.startup].toFixed(3)} vs ${most.toFixed(3)})`);
 assert.ok(re[m.startup]>-.15,`straight at contact (${re[m.startup].toFixed(3)})`);
 assert.ok(re[m.startup-3]<re[m.startup]-.5,'still bent three frames before contact');
 assert.ok(re.slice(0,m.startup).every(v=>v<re[m.startup]-1e-6),'no wind-up frame is as straight as contact');
 const p=imported(()=>strikePose({...m,frame:m.startup}));
 assert.ok(p.twist<stance.twist-.4&&p.hipYaw<stance.hipYaw-.1,'shoulders and pelvis turn into the punch');
 assert.ok(Math.abs(p.le-stance.le)<1e-9,'the lead hand holds Tala\'s guard');
 for(const ch of ['llx','llz','rlx','rlz','lk','rk'])assert.equal(p[ch],stance[ch],`legs stay Tala's own (${ch})`);
 assert.deepEqual(imported(()=>strikePose({...m,frame:end})),stance,'back to stance when the move ends');
 const w=importedJabWeight(m,m.startup);assert.ok(w.feet.every(f=>!f.x&&!f.y&&!f.z),'no step: feet planted');assert.ok(w.bodyZ>0,'hips forward at contact');
 assert.equal(importedJabWeight(m,end),null);
});
test('hitstop and replays: the jab is a function of the move frame, and replay equals step on fresh rigs',()=>{
 const m=move(1,10);assert.deepEqual(imported(()=>strikePose(m)),imported(()=>strikePose({...m})));
 assert.deepEqual(importedJabPose(m,stance,stance),importedJabPose({...m},stance,stance));
 const bones=(r)=>[r.body,r.spine,r.head,...r.limbs,...r.elbows,...r.knees].map(b=>b.getWorldPosition(new Vector3()).toArray().map(v=>+v.toFixed(9)));
 imported(()=>{
  const runs=[];
  for(let run=0;run<2;run++){const r=buildCharacter(2),s=createScenario('strike1',2,1),out=[];
   for(let f=0;f<=36;f++){animateCharacter(r,s.m.players[0],f/60);r.g.updateMatrixWorld(true);if([4,11,14,24,36].includes(f))out.push(bones(r));stepScenario(s);}runs.push(out);}
  assert.deepEqual(runs[0],runs[1],'two fresh rigs give identical bones');
  // scrubbing: a scenario rebuilt to frame 11 is the stepped frame 11
  const a=scenarioAt('strike1',11,2,1).m.players[0],s=createScenario('strike1',2,1);for(let f=0;f<11;f++)stepScenario(s);
  assert.deepEqual(a.move&&{...a.move},s.m.players[0].move&&{...s.m.players[0].move});
  assert.equal(a.move?.chain,1);
 });
});
test('Tala\'s feet stay planted through the imported jab',()=>{
 imported(()=>{
  const r=buildCharacter(2),s=createScenario('strike1',2,1),ankles=[];
  for(let f=0;f<=36;f++){animateCharacter(r,s.m.players[0],f/60);r.g.updateMatrixWorld(true);
   const m=s.m.players[0].move;if(m?.kind==='strike'&&m.chain===1)ankles.push(r.footTargets?.map(t=>t.clone())||[]);stepScenario(s);}
  assert.ok(ankles.length>20,'the scenario plays strike 1');
  for(let i=0;i<2;i++){const d=Math.max(...ankles.map(a=>Math.hypot(a[i].x-ankles[0][i].x,a[i].z-ankles[0][i].z)));assert.ok(d<.03,`foot ${i} drift ${d.toFixed(3)}`);}
 });
});
test('the default path is unchanged: authored source, authored strike 1, other hits untouched by the jab',()=>{
 assert.equal(locomotionSource(),'authored');
 for(const f of [0,5,9,12,20,27]){
  const a=strikePose(move(1,f));jabState.enabled=false;const b=strikePose(move(1,f));jabState.enabled=true;
  assert.deepEqual(a,b,`authored strike 1 frame ${f} ignores the jab`);
  for(const c of [2,3]){const x=imported(()=>strikePose(move(c,f)));jabState.enabled=false;const y=imported(()=>strikePose(move(c,f)));jabState.enabled=true;assert.deepEqual(x,y,`imported strike ${c} frame ${f} unchanged`);}
 }
 const r=buildCharacter(2);animateCharacter(r,createScenario('strike1',2,1).m.players[0],0);
 assert.equal(r.combatWeight(move(1,5),5),null,'no imported weight in the authored source');
});
