import test from 'node:test';import assert from 'node:assert/strict';
import {buildCharacter} from '../dist/characters.js';
import {animateCharacter} from '../dist/animation.js';
import {moveTiming} from '../dist/moves.js';import {fighters} from '../dist/fighters.js';
import {Vector3,Quaternion} from '../dist/vendor/three.module.js';
// Hand frame: fingers extend along the hand bone's -Y, the palm faces its +Z, knuckles face -Z.
function hands(r){r.g.updateMatrixWorld(true);return ['L','R'].map((S,i)=>{const h=r.limbs[i*2].userData.hand,q=h.getWorldQuaternion(new Quaternion());return {S,pos:h.getWorldPosition(new Vector3()),fingers:new Vector3(0,-1,0).applyQuaternion(q),palm:new Vector3(0,0,1).applyQuaternion(q),knuckles:new Vector3(0,0,-1).applyQuaternion(q)};});}
const settle=(r,p)=>{for(let i=0;i<8;i++)animateCharacter(r,p,.5+i*.04);};
test('Tala ready stance: fists at chin height in front of the chest, palms facing each other, elbows in',()=>{
 const r=buildCharacter(2);settle(r,{anim:'idle',x:0,z:0});
 for(const h of hands(r)){
  const medial=new Vector3(h.S==='L'?1:-1,0,0);
  assert.ok(h.pos.y>1.92&&h.pos.y<2.3,`${h.S} fist at jaw height (${h.pos.y.toFixed(2)})`);
  r.g.updateMatrixWorld(true);const chestX=r.spine.getWorldPosition(new Vector3()).x;
  assert.ok(h.pos.z>.45&&Math.abs(h.pos.x-chestX)<.4,`${h.S} fist in front of the chest`); // measured against the chest, which sways with the weight rhythm
  assert.ok(h.palm.dot(medial)>.8,`${h.S} palm faces the other fist (${h.palm.dot(medial).toFixed(2)})`);
  if(h.S==='R')assert.ok(h.fingers.y>.7,'rear fist held upright');else assert.ok(h.pos.z>.6,'lead fist extended ahead of the rear fist');
 }
});
test('Tala guard: forearms crossed with the knuckles toward the rival, not the palms turned up',()=>{
 const r=buildCharacter(2);settle(r,{anim:'idle',x:0,z:0,guard:true,blockStun:0});
 for(const h of hands(r)){assert.ok(h.knuckles.z>.6,`${h.S} knuckles forward (${h.knuckles.z.toFixed(2)})`);assert.ok(h.palm.y<.0,`${h.S} palm not turned up`);}
});
test('Tala straights land palm down with the knuckles rolled over; the hook lands with the palm turned in',()=>{
 for(const chain of [1,2,3]){
  const r=buildCharacter(2),timing=moveTiming(fighters[2],'strike'),m={kind:'strike',...timing,chain,frame:0};
  animateCharacter(r,{anim:'idle',x:0,z:0},0);m.frame=m.startup;animateCharacter(r,{anim:'strike',x:0,z:0,move:m},.1);
  const h=hands(r)[chain===2?0:1];
  if(chain<3)assert.ok(h.palm.y<-.85,`chain ${chain} palm down at contact (${h.palm.y.toFixed(2)})`);
  else assert.ok(h.palm.x<-.7,`hook palm turned in (${h.palm.x.toFixed(2)})`);
 }
});
