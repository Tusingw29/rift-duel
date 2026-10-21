import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {Matrix4,Vector3,Quaternion} from '../dist/vendor/three.module.js';
const data=JSON.parse(readFileSync(new URL('../art/blender/tala/motion-source.json',import.meta.url)));
const idx=name=>data.bones.findIndex(b=>b.name===name),clip=name=>data.clips.find(c=>c.name===name);
const mat=(f,name)=>new Matrix4().fromArray(f[idx(name)]),pos=(f,name)=>new Vector3().setFromMatrixPosition(mat(f,name));
test('study guard crosses the forearms ahead of the chest, then releases',()=>{
 const c=clip('Guard'),f=c.frames[40],chest=mat(f,'chest').invert();
 const l=pos(f,'hand.L').applyMatrix4(chest),r=pos(f,'hand.R').applyMatrix4(chest);
 assert.ok(l.x>.12&&r.x<-.12);assert.ok(l.z>.25&&r.z>.25);assert.ok(Math.abs(l.z-r.z)>.04);
 assert.ok(pos(c.frames[0],'hand.L').distanceTo(pos(f,'hand.L'))>.15);
});
test('study motion retains leg lengths and foot separation through every sampled clip',()=>{
 for(const c of data.clips)for(const f of c.frames){
  assert.ok(f.flat().every(Number.isFinite));
  for(const side of ['L','R']){
   const thigh=pos(f,'thigh.'+side),knee=pos(f,'shin.'+side),foot=pos(f,'foot.'+side);
   assert.ok(Math.abs(thigh.distanceTo(knee)-.64)<1e-5,c.name);
   assert.ok(Math.abs(knee.distanceTo(foot)-.64)<1e-4,c.name);
  }
  assert.ok(pos(f,'foot.R').x-pos(f,'foot.L').x>.25,c.name);
 }
});
test('combo pivots about the ball of the supporting foot rather than a fixed ankle',()=>{
 const c=clip('Combo'),a=c.frames[0],b=c.frames[5],ball=new Vector3(0,-.109,.22);
 assert.ok(pos(a,'foot.R').distanceTo(pos(b,'foot.R'))>.05);
 assert.ok(ball.clone().applyMatrix4(mat(a,'foot.R')).distanceTo(ball.clone().applyMatrix4(mat(b,'foot.R')))<1e-6);
 const qa=new Quaternion().setFromRotationMatrix(mat(a,'foot.R')),qb=new Quaternion().setFromRotationMatrix(mat(b,'foot.R'));assert.ok(qa.angleTo(qb)>.3);
});
test('locomotion has separate foot lifts; recoil catches and restores the rear foot',()=>{
 for(const name of ['Advance','Retreat','Circle']){
  const c=clip(name);let maxL=0,maxR=0;
  for(const f of c.frames){maxL=Math.max(maxL,pos(f,'foot.L').y);maxR=Math.max(maxR,pos(f,'foot.R').y);}
  assert.ok(maxL>.18&&maxR>.18,name);
  assert.deepEqual(c.frames[0],c.frames.at(-1));
 }
 const c=clip('Recoil');assert.ok(pos(c.frames[20],'foot.R').z<pos(c.frames[0],'foot.R').z-.15);
 assert.ok(pos(c.frames.at(-1),'foot.R').distanceTo(pos(c.frames[0],'foot.R'))<1e-6);
});
