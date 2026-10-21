import test from 'node:test';import assert from 'node:assert/strict';
import {buildCharacter} from '../dist/characters.js';import {animateCharacter} from '../dist/animation.js';
import {morrowStrikePose,morrowMovePose} from '../dist/morrow-animation.js';
import {Vector3} from '../dist/vendor/three.module.js';import {moveTiming} from '../dist/moves.js';import {fighters} from '../dist/fighters.js';
const move=(chain,frame)=>({kind:'strike',...moveTiming(fighters[3],'strike'),chain,frame});
test('Morrow has three distinct heavy windups and contacts at the existing damage frame',()=>{
 const wind=[];
 for(const chain of [1,2,3]){const r=buildCharacter(3),m=move(chain,12);animateCharacter(r,{anim:'idle',x:0,z:0},0);animateCharacter(r,{anim:'strike',x:0,z:0,move:m},.1);assert.deepEqual(r.morrowPose,morrowStrikePose(m));r.g.updateMatrixWorld(true);
  const tip=r.limbs[2].userData.hand.localToWorld(new Vector3(0,.12,2.06));assert.ok(tip.z>2&&tip.y>.9&&tip.y<2,'greatsword reaches the opponent torso');wind.push(morrowStrikePose({...m,frame:m.startup*.65}));
 }
 assert.ok(wind[0].ray>1&&wind[1].ray< -1&&wind[2].rax< -2.5);
 assert.ok(wind[0].hipYaw>0&&wind[1].hipYaw<0,'hips load opposite cuts');
});
test('Morrow planted weighted boot soles remain above the floor through grounded poses',()=>{
 const r=buildCharacter(3);r.g.scale.setScalar(1.12);const sample=new Vector3();
 for(const p of [{anim:'idle',x:0,z:0},{anim:'strike',x:0,z:0,move:move(3,12)},{anim:'idle',guard:true,x:0,z:0}]){
  animateCharacter(r,p,1);r.g.updateMatrixWorld(true);r.skeleton.update();let min=Infinity;
  const ids=r.feet.map(b=>r.skeleton.bones.indexOf(b));r.g.traverse(n=>{if(!n.isSkinnedMesh)return;const index=n.geometry.attributes.skinIndex;for(let i=0;i<index.count;i++)if(ids.includes(index.getX(i))){n.getVertexPosition(i,sample).applyMatrix4(n.matrixWorld);min=Math.min(min,sample.y);}});
  assert.ok(min>=-.005&&min<.06,`sole height ${min}`);
  for(let i=0;i<2;i++)assert.ok(r.knees[i].localToWorld(new Vector3(0,-.56,0)).distanceTo(r.footPlants[i])<1e-6);
 }
});
test('Morrow chains preserve the outgoing pose and distance drives the gait',()=>{
 const r=buildCharacter(3),p={anim:'run',x:0,z:0,prev:{x:1,z:0}};animateCharacter(r,p,0);animateCharacter(r,p,1);assert.equal(r.stridePhase||0,0);p.z=.1;r.g.position.z=.1;animateCharacter(r,p,1.1);assert.ok(r.stridePhase>0);
 animateCharacter(r,{anim:'strike',x:0,z:.1,move:move(1,15)},1.2);const before={...r.morrowPose};animateCharacter(r,{anim:'strike',x:0,z:.1,move:move(2,0)},1.21);
 for(const k of Object.keys(before))assert.ok(Math.abs(before[k]-r.morrowPose[k])<1e-12);
 assert.deepEqual(morrowMovePose(1,0,0),morrowMovePose(1,0,Math.PI*2));
});
