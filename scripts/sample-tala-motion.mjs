// Sample the existing proven combat timing into editable Blender animation keys.
import {Matrix4,Vector3} from '../dist/vendor/three.module.js';
import {applyStudyMotion} from './tala-study-motion.mjs';
import {writeFileSync} from 'node:fs';
import {buildTala} from '../dist/tala-model.js';
import {animateCharacter} from '../dist/animation.js';
const r=buildTala(), names=['root','chest','head','upper_arm.L','forearm.L','hand.L','thigh.L','shin.L','upper_arm.R','forearm.R','hand.R','thigh.R','shin.R','ponytail','sash'];
r.g.updateMatrixWorld(true);
const bones=r.skeleton.bones.map((b,i)=>({name:names[i],parent:r.skeleton.bones.indexOf(b.parent),matrix:b.matrixWorld.toArray()}));
for(const [i,suffix] of ['L','R'].entries())bones.push({name:'foot.'+suffix,parent:bones.findIndex(b=>b.name==='shin.'+suffix),matrix:new Matrix4().makeTranslation(i? .2:-.2,.14,0).toArray()});
const clips=[];
for(const [name,duration,kind] of [['Idle',2.4,'idle'],['Advance',.9,'run'],['Retreat',1,'back'],['Circle',1.1,'circle'],['Guard',1.6,'guard'],['Combo',1,'combo'],['Recoil',.9,'hurt']]){
 const rig=buildTala(),frames=[];let move;
 for(let f=0;f<=Math.round(duration*60);f++){
  const t=f/60,p={anim:kind,x:0,z:0,prev:{x:1,z:0},air:0};
  if(['run','back','circle'].includes(kind)){p.anim='idle';p.prev=kind==='back'?{x:-1,z:0}:kind==='circle'?{x:0,z:1}:{x:1,z:0};p.stridePhase=t/.72*Math.PI*2;}
  if(kind==='guard'){p.anim='idle';p.guard=false;}
  if(kind==='hurt'){p.anim='hurt';p.animTime=Math.max(0,.42-t);}
  if(kind==='combo'){const chain=Math.min(3,Math.floor(f/20)+1);if(!move||move.chain!==chain)move={kind:'strike',chain,startup:5,active:1,recovery:14};move.frame=f===60?20:f%20;p.move=move;p.anim='strike';}
  animateCharacter(rig,p,t);
  rig.clothParts[0].rotation.z=Math.max(-.45,Math.min(.45,rig.clothParts[0].rotation.z));
  rig.clothParts[0].rotation.x=Math.max(-.4,Math.min(.4,rig.clothParts[0].rotation.x));
  const feet=applyStudyMotion(rig,kind,t,duration);
  rig.g.updateMatrixWorld(true);
  const matrices=rig.skeleton.bones.map(b=>b.matrixWorld.toArray());
  matrices.push(...feet.map(m=>m.toArray()));
  frames.push(matrices);
 }
 if(['Idle','Advance','Retreat','Circle','Guard'].includes(name))frames[frames.length-1]=frames[0];
 clips.push({name,fps:60,frames,loop:['Idle','Advance','Retreat','Circle','Guard'].includes(name)});
}
writeFileSync(new URL('../art/blender/tala/motion-source.json',import.meta.url),JSON.stringify({bones,clips,source:'Tala study v2: crossed guard, step-and-recover locomotion, ball-of-foot pivots, recoil catch step; original combo contact timing',contacts:[5,25,45]}));
console.log('Sampled',bones.map(b=>b.name).join(', '));
