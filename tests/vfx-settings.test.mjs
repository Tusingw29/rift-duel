import test from 'node:test';
import assert from 'node:assert/strict';
import {DEFAULT_VFX,CRISP_VFX,validateVfx,setVfxSettings,resetVfxSettings,vfxSettings} from '../dist/vfx-settings.js';
import {createInkBeam} from '../dist/ink-energy.js';
import {createSignature,energyStyles} from '../dist/energy-style.js';
test('visual preset rejects unsafe values, crossings and unsupported versions',()=>{
 for(const patch of [{version:2},{cadence:Infinity},{beamWidth:0},{shapes:{0:[[0,0],[1,1],[0,1],[1,0]]}},{palettes:{0:{color:'red'}}},{shapes:{__proto__:null,99:[[0,0],[1,0],[0,1]]}}])assert.throws(()=>validateVfx({...DEFAULT_VFX,...patch}));
 for(let id=0;id<6;id++)assert.doesNotThrow(()=>validateVfx({...DEFAULT_VFX,shapes:{[id]:energyStyles[id].points}}));
});
test('presets copy source data and discard unknown keys',()=>{
 const input={...DEFAULT_VFX,shapes:{0:[[0,0],[1,0],[0,1]]},combatDamage:999};const out=validateVfx(input);input.shapes[0][0][0]=10;assert.equal(out.shapes[0][0][0],0);assert.equal(out.combatDamage,undefined);
});
test('beam draft changes production volume and core angular width without burying channels',()=>{
 resetVfxSettings();const beam=createInkBeam();beam.userData.updateInk(.3,false);const body=beam.children[0],stripe=beam.children[1],base=stripe.geometry.attributes.position.array.slice();
 setVfxSettings(CRISP_VFX);beam.userData.updateInk(.3,false);assert.equal(body.scale.x,.7);assert.equal(stripe.scale.x,.7);assert.notDeepEqual(stripe.geometry.attributes.position.array,base);assert.equal(beam.userData.frame,2);
 resetVfxSettings();beam.userData.updateInk(.3,false);assert.equal(body.scale.x,1);assert.deepEqual(stripe.geometry.attributes.position.array,base);
});
test('signature edits rebuild volume, palette restores and seeking is deterministic',()=>{
 resetVfxSettings();const shape=createSignature(2),original=shape.children[1].material.color.getHex();const geometry=shape.children[0].geometry;let disposed=false;geometry.addEventListener('dispose',()=>disposed=true);
 setVfxSettings({...DEFAULT_VFX,signatureDepth:.2,shapes:{2:[[0,-1],[.5,0],[0,1],[-.5,0]]},palettes:{2:{color:'#123456'}}});shape.userData.updateInk(.5);assert.ok(disposed);assert.equal(shape.children[1].material.color.getHex(),0x123456);shape.children[0].geometry.computeBoundingBox();assert.ok(Math.abs(shape.children[0].geometry.boundingBox.max.z-.1)<1e-6);const positions=shape.children[0].geometry.attributes.position.array.slice();shape.userData.updateInk(1);shape.userData.updateInk(.5);assert.deepEqual(shape.children[0].geometry.attributes.position.array,positions);
 resetVfxSettings();shape.userData.updateInk(.5);assert.equal(shape.children[1].material.color.getHex(),original);assert.equal(vfxSettings().signatureDepth,.09);
});
test('bright signature cores stay inside concave body outlines for all six fighters',()=>{
 const inside=(x,y,points)=>{let hit=false;for(let i=0,j=points.length-1;i<points.length;j=i++){
  const [a,b]=points[j],[c,d]=points[i],cross=(c-a)*(y-b)-(d-b)*(x-a);
  if(Math.abs(cross)<1e-6&&x>=Math.min(a,c)-1e-6&&x<=Math.max(a,c)+1e-6&&y>=Math.min(b,d)-1e-6&&y<=Math.max(b,d)+1e-6)return true;
  if((b>y)!==(d>y)&&x<(c-a)*(y-b)/(d-b)+a)hit=!hit;
 }return hit;};
 for(const width of [.15,.3,.45,.8]){setVfxSettings({...DEFAULT_VFX,signatureCore:width});for(let id=0;id<6;id++){
  const g=createSignature(id),positions=g.children[2].geometry.attributes.position;assert.ok(positions.count>0);
  for(let i=0;i<positions.count;i++)assert.ok(inside(positions.getX(i),positions.getY(i),energyStyles[id].points),`${id} core width ${width} escaped`);
 }}resetVfxSettings();
});
