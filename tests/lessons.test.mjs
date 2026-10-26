import {update} from './fight-frame.mjs';
import test from 'node:test';import assert from 'node:assert/strict';
import {lessons,lessonMatch,lessonOpponent,updateLesson,lessonText} from '../dist/lessons.js';
import {neutral} from '../dist/combat.js';import {defaultBindings} from '../dist/key-bindings.js';
const step=(m,input={},n=1)=>{for(let j=0;j<n;j++){const a={...neutral(),...input};update(m,[a,lessonOpponent(m,a)]);updateLesson(m);}};
const tap=m=>{step(m,{attack:true});step(m);};
test('movement lesson requires approach, circle and retreat in order',()=>{const m=lessonMatch('movement');step(m,{x:-1},10);assert.equal(m.lesson.stage,0);step(m,{x:1},30);assert.equal(m.lesson.stage,1);step(m,{z:1},40);assert.equal(m.lesson.stage,2);step(m,{x:-1},30);assert.equal(m.lesson.status,'passed');});
test('chain, stock and expanded capture lessons pass through real combat',()=>{
 const m=lessonMatch('chain');for(let j=0;j<3;j++){tap(m);step(m,{},m.players[0].move.startup-m.players[0].move.frame);}assert.equal(m.lesson.status,'passed');
 const n=lessonMatch('charge');step(n,{attack:true},140);assert.equal(n.lesson.status,'passed');
 const c=lessonMatch('capture');step(c,{capture:true});step(c,{},15);tap(c);step(c,{},80);assert.equal(c.lesson.status,'passed');assert.equal(c.lesson.grown,true);
});
test('timed defense gives specific late-input feedback and reset clears state',()=>{
 const m=lessonMatch('guard');step(m,{},70);assert.equal(m.lesson.status,'retry');assert.match(m.lesson.feedback,/late/);
 const n=lessonMatch('guard');step(n,{},50);step(n,{guard:true},5);assert.equal(n.lesson.status,'passed');
 const clean=lessonMatch('guard');assert.equal(clean.tick,0);assert.equal(clean.lesson.status,'active');assert.equal(clean.players[0].hp,100);
});
test('launch follow-up, airborne recovery and ground roll have real success conditions',()=>{
 const m=lessonMatch('launch');step(m,{launch:true});step(m,{},10);step(m,{pursuit:true});step(m,{},30);assert.equal(m.lesson.status,'passed');
 const a=lessonMatch('air');step(a,{guard:true});assert.equal(a.lesson.status,'passed');
 const b=lessonMatch('ground');step(b,{z:1});assert.equal(b.lesson.status,'passed');
 const c=lessonMatch('air');step(c,{},60);assert.equal(c.lesson.status,'retry');
});
test('pressure lesson triggers from pursuit and can be won with fresh presses',()=>{
 const m=lessonMatch('pressure');step(m,{pursuit:true});step(m,{},8);assert.ok(m.pressure);
 for(let j=0;j<110;j++)step(m,{attack:j%12===0});assert.equal(m.lesson.status,'passed');
});
test('all lessons show active bindings, support controller prompts, reject unknown ids',()=>{
 for(const l of lessons){const m=lessonMatch(l.id);assert.ok(lessonText(m,defaultBindings()).length>30);assert.ok(lessonText(m,defaultBindings(),true).length>30);}
 const m=lessonMatch('charge'),bindings=defaultBindings();bindings[0][4]=['KeyF'];assert.match(lessonText(m,bindings),/Hold F/);assert.match(lessonText(m,bindings,true),/A \/ Cross/);assert.throws(()=>lessonMatch('nope'));
});
