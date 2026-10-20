import test from 'node:test';
import assert from 'node:assert/strict';
import {defaultBindings,normalizeBindings,rebind,touchBinding} from '../dist/key-bindings.js';
import {createKeyboardInput} from '../dist/keyboard-input.js';
import {createMatch,update} from '../dist/combat.js';
test('saved bindings survive JSON round trip without sharing mutable arrays',()=>{
 const source=rebind(defaultBindings(),0,4,'Space'),saved=JSON.parse(JSON.stringify(source)),restored=normalizeBindings(saved);
 assert.deepEqual(restored,source);restored[0][4][0]='KeyZ';assert.equal(source[0][4][0],'Space');assert.equal(saved[0][4][0],'Space');
});
test('duplicate, malformed and reserved persisted bindings safely restore defaults',()=>{
 for(const value of [null,{},[],[[['KeyJ']]],defaultBindings().map(p=>p.map(()=>['KeyJ']))])assert.deepEqual(normalizeBindings(value),defaultBindings());
 const invalid=defaultBindings();invalid[0][4]=['Escape'];assert.deepEqual(normalizeBindings(invalid),defaultBindings());
});
test('remapping rejects cross-player aliases and browser shortcut keys without changing existing controls',()=>{
 const original=defaultBindings();
 for(const code of ['Digit1','ArrowUp','KeyK'])assert.throws(()=>rebind(original,0,4,code),/already assigned/);
 for(const code of ['Escape','Tab','MetaLeft','F5','Enter','<script>'])assert.throws(()=>rebind(original,0,4,code),/Choose/);
 assert.deepEqual(original,defaultBindings());
 const freed=rebind(original,1,4,'KeyZ');assert.deepEqual(rebind(freed,0,4,'Digit1')[0][4],['Digit1']);
});
test('remapped short taps execute in combat and old attack key becomes inactive',()=>{
 const input=createKeyboardInput(rebind(defaultBindings(),0,4,'Space')),m=createMatch();
 input.add('KeyJ');input.delete('KeyJ');assert.equal(input.pending(0),0);
 input.add('Space');input.delete('Space');for(let j=0;j<14;j++)update(m,[input.read(0),input.read(1)]);
 assert.equal(m.projectiles.length,1);assert.equal(m.projectiles[0].owner,0);
});
test('reconfiguration flushes held and queued states for both players',()=>{
 const input=createKeyboardInput();input.add('KeyJ');input.add('Digit1');input.read(0);input.read(1);
 input.configure(rebind(defaultBindings(),0,4,'Space'));assert.equal(input.pending(0),0);assert.equal(input.pending(1),0);assert.equal(input.read(0).attack,false);assert.equal(input.read(1).attack,false);assert.equal(input.has('KeyJ'),false);assert.equal(input.has('Space'),true);
});
test('movement and player-two action remaps preserve separate player queues',()=>{
 let bindings=rebind(defaultBindings(),0,0,'KeyQ');bindings=rebind(bindings,1,5,'KeyP');const input=createKeyboardInput(bindings);
 input.add('KeyQ');input.add('KeyP');assert.equal(input.read(0).x,-1);assert.equal(input.read(1).guard,true);input.delete('KeyQ');input.delete('KeyP');assert.equal(input.read(0).x,0);assert.equal(input.read(1).guard,false);
});
test('touch actions resolve to the remapped logical controls and defaults restore both P2 aliases',()=>{
 const bindings=rebind(defaultBindings(),0,4,'Space');assert.equal(touchBinding('KeyJ',bindings),'Space');assert.equal(touchBinding('KeyW',bindings),'KeyW');
 const input=createKeyboardInput(bindings);input.add(touchBinding('KeyJ',bindings));assert.equal(input.read(0).attack,true);
 input.configure(defaultBindings());for(const code of ['Digit1','Numpad1']){input.add(code);assert.equal(input.read(1).attack,true);input.delete(code);assert.equal(input.read(1).attack,false);}
});
