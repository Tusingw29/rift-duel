import test from 'node:test';import assert from 'node:assert/strict';
import {recordInput,inputLabel} from '../dist/training.js';
import {normalizeOptions} from '../dist/options.js';
import {neutral} from '../dist/combat.js';
test('training input history preserves releases and held durations for double taps',()=>{
 const history=[];
 for(let i=0;i<4;i++)recordInput(history,{...neutral(),x:1});
 recordInput(history,neutral());recordInput(history,{...neutral(),x:1,attack:true});recordInput(history,neutral());
 assert.deepEqual(history,[{label:'·',frames:1},{label:'↑ + ATK',frames:1},{label:'·',frames:1},{label:'↑',frames:4}]);
 assert.equal(inputLabel({...neutral(),x:-1,z:-1,guard:true}),'↓← + GRD');assert.equal(inputLabel({...neutral(),z:1}),'→');
});
test('training history remains bounded over a long session and does not mutate input',()=>{
 const history=[],input={...neutral(),capture:true},copy={...input};
 for(let i=0;i<10000;i++)recordInput(history,i%2?input:neutral());
 assert.equal(history.length,6);assert.deepEqual(input,copy);
});
test('training options migrate legacy active CPU preferences without overriding new choices',()=>{
 assert.equal(normalizeOptions({trainingAI:true}).trainingBehavior,'cpu');
 assert.equal(normalizeOptions({trainingAI:true,trainingBehavior:'guard'}).trainingBehavior,'guard');
 assert.equal(normalizeOptions({trainingBehavior:'invalid'}).trainingBehavior,'idle');
 assert.equal(normalizeOptions({showInputs:false}).showInputs,false);
});
