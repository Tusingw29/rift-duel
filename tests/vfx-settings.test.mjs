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
