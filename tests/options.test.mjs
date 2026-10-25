import test from 'node:test';import assert from 'node:assert/strict';
import {normalizeOptions,readPad} from '../dist/options.js';
import {createMatch,update,neutral} from '../dist/combat.js';
test('saved options accept supported values and recover from corrupt storage',()=>{
 assert.deepEqual(normalizeOptions(null),normalizeOptions());
 const options=normalizeOptions({roundSeconds:60,winsNeeded:3,deadzone:.32,volume:9,difficulty:'impossible',trainingAI:'false'});
 assert.equal(options.roundSeconds,60);assert.equal(options.winsNeeded,3);assert.equal(options.deadzone,.32);assert.equal(options.volume,1);assert.equal(options.difficulty,'normal');assert.equal(options.trainingAI,false);
 const invalid=normalizeOptions({roundSeconds:-1,winsNeeded:0,deadzone:NaN});assert.equal(invalid.roundSeconds,90);assert.equal(invalid.winsNeeded,2);assert.equal(invalid.deadzone,.22);
});
test('custom rounds time out at the configured limit while training remains untimed',()=>{
 const m=createMatch(0,1,'duel','normal',{roundSeconds:60,winsNeeded:1});assert.deepEqual(m.rules,{roundSeconds:60,winsNeeded:1,pressureAssist:false});
 for(let i=0;i<3599;i++)update(m,[neutral(),neutral()]);assert.equal(m.phase,'fight');
 for(let i=0;i<2;i++)update(m,[neutral(),neutral()]);assert.equal(m.phase,'over');assert.equal(m.winner,-1);
 const n=createMatch(0,1,'training','normal',{roundSeconds:60});for(let i=0;i<4000;i++)update(n,[neutral(),neutral()]);assert.equal(n.time,60);assert.equal(n.phase,'fight');
});
test('controller dead zone suppresses drift and D-pad overrides a drifting stick',()=>{
 const pad={axes:[.25,-.2],buttons:Array.from({length:16},()=>({pressed:false}))};
 assert.equal(readPad(pad,.32).x,0);assert.equal(readPad(pad,.12).x,.25);assert.equal(readPad(pad,.22).z,0);
 pad.buttons[14].pressed=true;assert.equal(readPad(pad,.12).x,-1);
 pad.axes=[Infinity,NaN];pad.buttons[14].pressed=false;assert.equal(readPad(pad).x,0);assert.equal(readPad(pad).z,0);
});
test('standard controller actions remain available and incomplete devices are safe',()=>{
 assert.deepEqual(readPad(null),neutral());assert.deepEqual(readPad({}),neutral());
 for(const [button,action] of [[0,'attack'],[1,'guard'],[2,'capture'],[3,'super'],[4,'launch'],[5,'pursuit']]){
  const pad={buttons:Array.from({length:16},(_,i)=>({pressed:i===button}))};
  assert.equal(readPad(pad)[action],true);assert.equal(Object.values(readPad(pad)).filter(v=>v===true).length,1);
 }
});
test('Design 03 is the default appearance and earlier models stay explicit choices',()=>{
 assert.equal(normalizeOptions().talaModel,'v3');
 assert.equal(normalizeOptions({talaModel:'design02'}).talaModel,'design02');assert.equal(normalizeOptions({talaModel:'concept'}).talaModel,'concept');
 assert.equal(normalizeOptions({talaModel:'unknown'}).talaModel,'v3');
});
