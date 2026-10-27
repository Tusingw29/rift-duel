import test from 'node:test';import assert from 'node:assert/strict';
import {readFileSync} from 'node:fs';
import {GLTFLoader} from '../dist/vendor/GLTFLoader.js';
import {Vector3} from '../dist/vendor/three.module.js';
import {buildCharacter} from '../dist/characters.js';
import {attachTalaConcept} from '../dist/tala-concept.js';
import {animateCharacter} from '../dist/animation.js';
import {createScenario,stepScenario,snapshot} from '../dist/sandbox-recipes.js';
import {setLocomotionSource,locomotionSource} from '../dist/locomotion-clips.js';
import {IMPORT_CLIPS,footworkClass,strideStretch,cycleUnits} from '../dist/imported-motion.js';
import {airHeight} from '../dist/air-motion.js';
import {GET_UP_FRAMES} from '../dist/recovery.js';
// TALA-IMPORT-AB: the imported comparison mode for Tala. These check the retarget and timing contracts, not taste.
globalThis.ProgressEvent??=class{constructor(t,d){Object.assign(this,d);}};
const bytes=readFileSync(new URL('../dist/assets/tala-graphic/tala-graphic.glb',import.meta.url));
const asset=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
const tala=()=>{const r=buildCharacter(2,{variant:'graphic'});r.conceptOriginalSurfaces=[];attachTalaConcept(r,asset.scene.clone(true));return r;};
const ankles=r=>r.knees.map(k=>k.localToWorld(new Vector3(0,-(r.shinLength||r.legLength),0)));
// Run a comparison scenario exactly as the renderer does: root from the simulation, 1/60 s per frame, zero in hitstop.
function play(name,source,{onFrame}={}){
 setLocomotionSource(source);const r=tala(),s=createScenario(name,2,1),out=[];let time=0;
 for(let f=0;f<=(s.recipe.frames||90);f++){
  if(f>0)stepScenario(s);const p=s.m.players[0];time+=f===0||s.m.hitstop>0||s.m.frozen?0:1/60;
  r.g.position.set(p.x,airHeight(p),p.z);r.g.rotation.y=Math.atan2(p.lookX,p.lookZ);animateCharacter(r,p,time);r.g.updateMatrixWorld(true);
  const m=[];r.g.traverse(n=>{if(n.isBone)m.push(...n.matrixWorld.elements);});
  // The simulation mutates one player object; keep per-frame copies of what the checks read.
  out.push({f,sim:snapshot(p),anim:p.anim,hitstop:s.m.hitstop>0||!!s.m.frozen,bones:m,ankles:ankles(r),balls:r.feet&&r.footBall?r.feet.map(ft=>ft.localToWorld(r.footBall.clone())):null,r,player:structuredClone({...p,prev:p.prev}),contacts:r.importFoot?.contacts?[...r.importFoot.contacts]:null,hipY:r.limbs[1].parent.getWorldPosition(new Vector3()).y});onFrame?.(r,p,f);
 }
 setLocomotionSource('authored');return out;
}
test('authored is the default animation source everywhere until the comparison is accepted',()=>{
 assert.equal(locomotionSource(),'authored');
 const sandbox=readFileSync(new URL('../dist/sandbox.js',import.meta.url),'utf8');assert.match(sandbox,/params\.get\('anim'\)\|\|params\.get\('gait'\)\|\|'authored'/);
 const opts=readFileSync(new URL('../dist/options.js',import.meta.url),'utf8');assert.doesNotMatch(opts,/imported/);
});
test('imported clips record their CMU source and licence, travel the way their names say, and loop closed',()=>{
 for(const [name,clip] of Object.entries(IMPORT_CLIPS)){
  assert.match(clip.meta.source,/^CMU \d+_\d+ .*free for research and commercial use/,`${name} source and licence recorded`);
  if(clip.meta.mode!=='loop')continue;
  const [x,z]=clip.meta.travel;
  if(name==='advance')assert.ok(z>Math.abs(x),'advance travels forward');if(name==='retreat')assert.ok(-z>Math.abs(x),'retreat travels backward');
  if(name==='left')assert.ok(-x>Math.abs(z),'left travels to the fighter\'s left');if(name==='right')assert.ok(x>Math.abs(z),'right travels to the fighter\'s right');
  const first=clip.keys[0][1],last=clip.keys.at(-1)[1];for(const k of Object.keys(first))assert.ok(Math.abs(first[k]-last[k])<1e-3,`${name} ${k} loops closed`);
  assert.ok(clip.keys.some(k=>k[2].lc)&&clip.keys.some(k=>k[2].rc),`${name} has contacts for both feet`);
 }
 const g=IMPORT_CLIPS.getup;assert.equal(g.meta.mode,'oneshot');assert.ok(g.keys[0][2].hip[1]<.35&&g.keys.at(-1)[2].hip[1]>.85,'get-up rises from lying to standing (hip height in leg lengths)');
 assert.ok(Math.abs(g.keys[0][1].bodyPitch)>1.1,'get-up starts lying (pelvis pitched back)');
});
test('direction classes follow the lock-on frame and the stride stretch matches the import cadence',()=>{
 assert.equal(footworkClass(1,0),'advance');assert.equal(footworkClass(-1,0),'retreat');assert.equal(footworkClass(0,1),'left');assert.equal(footworkClass(0,-1),'right');
 for(const cls of ['advance','retreat','left','right'])assert.ok(Math.abs(strideStretch(cls,1.28)*IMPORT_CLIPS[cls].meta.cycleDistance*1.28-cycleUnits(cls))<1e-9);
});
test('the simulation is identical in both modes: animation never moves the fighter',()=>{
 for(const name of ['ab-advance-guard','ab-knockdown-getup-guard','ab-advance-strike-hitstop']){
  const a=play(name,'authored'),b=play(name,'imported');
  for(let i=0;i<a.length;i++)assert.deepEqual(b[i].sim,a[i].sim,`${name} frame ${i}`);
 }
});
test('imported Tala is a function of simulation state: replays match and hitstop freezes her',()=>{
 const a=play('ab-advance-strike-hitstop','imported'),b=play('ab-advance-strike-hitstop','imported');
 for(let i=0;i<a.length;i++)assert.deepEqual(b[i].bones,a[i].bones,`frame ${i} replays identically`);
 const frozen=a.filter((fr,i)=>i&&fr.hitstop&&a[i-1].hitstop);assert.ok(frozen.length>=6,'scenario contains hitstop');
 for(const fr of frozen){const prev=a[fr.f-1];assert.deepEqual(fr.bones,prev.bones,`hitstop frame ${fr.f} is frozen`);}
});
test('imported footwork holds a contact foot still in the world and keeps both feet on or above the floor',()=>{
 let held=0;
 const frames=play('ab-circle-left-guard','imported');
 for(let i=2;i<frames.length;i++){const a=frames[i-1],b=frames[i];if(a.anim!=='run'||b.anim!=='run')continue;
  const ca=a.contacts,cb=b.contacts;
  // The ball of the foot is the contact (a heel raise pitches the foot about it, which moves the ankle, not the contact).
  for(let k=0;k<2;k++){if(!(ca?.[k]&&cb?.[k]))continue;held++;const P=b.balls||b.ankles,Q=a.balls||a.ankles,d=Math.hypot(P[k].x-Q[k].x,P[k].z-Q[k].z);assert.ok(d<.03,`frame ${b.f} held ${k?'right':'left'} foot ball moved ${d.toFixed(3)}`);}
  for(const an of b.ankles)assert.ok(an.y>.1,'ankle stays above the floor');}
 assert.ok(held>10,`contacts were exercised (${held})`);
});
test('the imported get-up is driven by the simulation\'s getUp frame and lands in Tala\'s stance',()=>{
 const frames=play('ab-knockdown-getup-guard','imported'),up=frames.filter(fr=>fr.player.getUp);
 assert.equal(up.length,GET_UP_FRAMES,'all 28 get-up frames animated');
 // Same getUp frame at a different wall-clock time gives the same pose (no independent clock).
 const r=tala(),p=structuredClone(up[10].player);setLocomotionSource('imported');
 r.g.position.set(p.x,0,p.z);r.g.rotation.y=Math.atan2(p.lookX,p.lookZ);animateCharacter(r,p,3);const one={...r.pose};animateCharacter(r,p,9.5);
 for(const k of Object.keys(one))assert.ok(Math.abs(r.pose[k]-one[k])<1e-9,`${k} independent of wall time`);setLocomotionSource('authored');
 const hip=fr=>fr.hipY;
 assert.ok(hip(up[0])<.8&&hip(up.at(-1))>1.1,`hips rise from the floor to standing (${hip(up[0]).toFixed(2)} → ${hip(up.at(-1)).toFixed(2)})`);
});
test('only Tala\'s locomotion and get-up change: the roster and Tala\'s KO collapse are untouched by the import mode',()=>{
 const pose=(id,p,source)=>{setLocomotionSource(source);const r=buildCharacter(id);for(let i=0;i<8;i++)animateCharacter(r,{x:i*.1,z:0,...p},i/60);const q={...(r[['aegis','rei','tala','morrow','sol','vesper'][id]+'Pose']||r.pose)};setLocomotionSource('authored');return q;};
 assert.deepEqual(pose(1,{anim:'run',prev:{x:1,z:0}},'imported'),pose(1,{anim:'run',prev:{x:1,z:0}},'authored'),'Rei runs the same');
 assert.deepEqual(pose(2,{anim:'defeat',animTime:.6},'imported'),pose(2,{anim:'defeat',animTime:.6},'authored'),'Tala\'s KO collapse is the same');
});
