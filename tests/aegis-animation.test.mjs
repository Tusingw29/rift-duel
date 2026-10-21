import test from 'node:test';import assert from 'node:assert/strict';
import {buildCharacter} from '../dist/characters.js';
import {animateCharacter} from '../dist/animation.js';
import {aegisStrikePose,aegisMovePose} from '../dist/aegis-animation.js';
import {moveTiming} from '../dist/moves.js';import {fighters} from '../dist/fighters.js';
import {Vector3,Box3} from '../dist/vendor/three.module.js';
const move=(chain,frame)=>({kind:'strike',...moveTiming(fighters[0],'strike'),chain,frame});
test('Aegis blade reaches torso height on every damage frame with distinct cut paths',()=>{
 const paths=[];
 for(const chain of [1,2,3]){
  const r=buildCharacter(0),m=move(chain,0);m.frame=m.startup;
  animateCharacter(r,{anim:'idle',x:0,z:0},0);animateCharacter(r,{anim:'strike',x:0,z:0,move:m},.1);
  for(const key of Object.keys(r.aegisPose))assert.equal(r.aegisPose[key],aegisStrikePose(m)[key],'entry blend must be gone on contact');
  r.g.updateMatrixWorld(true);const tip=r.limbs[2].userData.hand.localToWorld(new Vector3(0,.12,1.48));
  assert.ok(tip.z>1.6&&tip.y>1&&tip.y<2,'blade crosses the rival torso, not above its head');
  paths.push(aegisStrikePose({...m,frame:m.startup*.62}));
 }
 assert.ok(paths[0].ray>0&&paths[1].ray<0);assert.ok(paths[2].rax<-2,'third cut winds up overhead');
});
test('Aegis planted ankles stay fixed and boot soles meet the floor',()=>{
 const r=buildCharacter(0),p={anim:'idle',x:0,z:0};animateCharacter(r,p,0);const plants=r.footPlants.map(v=>v.clone());
 for(let frame=1;frame<30;frame++)animateCharacter(r,p,frame/60);
 r.g.updateMatrixWorld(true);
 for(let i=0;i<2;i++){const foot=r.knees[i].localToWorld(new Vector3(0,-r.legLength,0));assert.ok(foot.distanceTo(plants[i])<1e-6);const bottom=new Box3().setFromObject(r.knees[i]).min.y;assert.ok(bottom>-.03&&bottom<.04,`boot bottom ${bottom}`);}
});
test('Aegis gait follows travel distance and blends into a chained cut without resetting',()=>{
 const r=buildCharacter(0),p={anim:'run',x:0,z:0,prev:{x:1,z:0}};animateCharacter(r,p,0);const phase=r.stridePhase||0;
 animateCharacter(r,p,1);assert.equal(r.stridePhase||0,phase);p.z=.1;r.g.position.z=.1;animateCharacter(r,p,1.1);assert.ok(r.stridePhase>phase);
 const m=move(1,10);animateCharacter(r,{anim:'strike',x:0,z:.1,move:m},1.2);const before={...r.aegisPose};animateCharacter(r,{anim:'strike',x:0,z:.1,move:move(2,0)},1.21);
 for(const key of Object.keys(before))assert.ok(Math.abs(before[key]-r.aegisPose[key])<1e-12);
 const a=aegisMovePose(1,0,0),b=aegisMovePose(1,0,Math.PI*2);assert.deepEqual(a,b);
});
test('Aegis freezes deterministically and releases feet for airborne shared actions',()=>{
 const r=buildCharacter(0),p={anim:'strike',x:0,z:0,move:move(1,8)};
 const matrices=()=>{r.g.updateMatrixWorld(true);const list=[];r.g.traverse(n=>list.push([...n.matrixWorld.elements]));return list;};
 animateCharacter(r,p,1);const first=matrices();animateCharacter(r,p,1);assert.deepEqual(matrices(),first);
 animateCharacter(r,{anim:'launch',air:.4,x:0,z:0},1.1);assert.equal(r.footPlants,null);assert.equal(r.aegisPose,null);
});
