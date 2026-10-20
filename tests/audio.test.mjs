import test from 'node:test';import assert from 'node:assert/strict';
import {themes,stepNotes,scaleNote,midiToHz,stepSeconds,STEPS,BARS,createAudio} from '../dist/audio.js';
import {fighters} from '../dist/fighters.js';
test('each arena and the menu has a complete sixteen-step theme',()=>{
 for(const id of ['menu',...fighters.map(f=>f.id)]){const t=themes[id];assert.ok(t,id);for(const key of ['bass','lead','kick','hat'])assert.equal(t[key].length,STEPS,id+key);assert.equal(t.shift.length,BARS);assert.ok(t.bpm>=90&&t.bpm<=160);assert.ok(t.scale[0]===0&&t.scale.every(n=>n>=0&&n<12));assert.ok(t.kick.includes(1),id);assert.ok(t.bass.some(n=>n!==null),id);}
});
test('step resolution follows the scale and the four-bar movement',()=>{
 const t=themes.aegis;assert.equal(scaleNote(t,0),t.root);assert.equal(scaleNote(t,t.scale.length),t.root+12);assert.equal(scaleNote(t,-1),t.root-12+t.scale[t.scale.length-1]);
 const first=stepNotes(t,0),third=stepNotes(t,STEPS*2);assert.equal(first.bar,0);assert.equal(third.bar,2);assert.ok(first.pad&&first.pad.length===3);assert.equal(stepNotes(t,1).pad,null);
 assert.equal(third.bass,scaleNote(t,t.bass[0]+t.shift[2]));assert.equal(first.kick,true);assert.equal(stepNotes(t,14).hat,'open');assert.equal(stepNotes(t,2).hat,'closed');
 assert.ok(Math.abs(midiToHz(69)-440)<1e-9);assert.ok(Math.abs(stepSeconds({bpm:120})-.125)<1e-9);
});
test('audio engine stays inert without a Web Audio context',()=>{
 const audio=createAudio();assert.equal(audio.ready,false);assert.equal(audio.resume(),false);audio.sfx('hit');audio.play('aegis');audio.say('Fight');audio.configure({volume:.5,music:false,announcer:false});audio.duck(true);audio.stop();assert.equal(audio.playing,null);
});
