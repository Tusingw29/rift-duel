import test from 'node:test';import assert from 'node:assert/strict';
import {createMatch,update,neutral,aiInput} from '../dist/combat.js';
import {readPad} from '../dist/options.js';
const step=(m,a={},b={},n=1)=>{for(let j=0;j<n;j++)update(m,[{...neutral(),...a},{...neutral(),...b}]);};
function clash(options={},mode='duel'){const m=createMatch(0,1,mode,'normal',options);m.players[0].x=-2.5;m.players[1].x=2.5;step(m,{pursuit:true},{pursuit:true});for(let j=0;j<8&&!m.pressure;j++)step(m);assert.ok(m.pressure);return m;}
test('opposing grounded glides enter a contest before either deals damage',()=>{const m=clash();assert.deepEqual(m.players.map(p=>p.hp),[100,100]);assert.ok(m.players.every(p=>!p.move&&!p.guard));});
test('fresh attack pulses determine winner, holding counts once, one damage result only',()=>{
 const m=clash();step(m,{attack:true},{attack:true},20);assert.deepEqual(m.pressure.scores,[1,1]);step(m,{}, {attack:true});step(m,{attack:true},{attack:true});step(m,{}, {attack:true},100);assert.equal(m.lastPressure.winner,0);assert.equal(m.players[1].hp,90);step(m,{}, {},100);assert.equal(m.players[1].hp,90);
});
test('ties give no damage; max-rate assist treats both players equally',()=>{
 const m=clash({pressureAssist:true});step(m,{attack:true},{attack:true},110);assert.equal(m.lastPressure.winner,-1);assert.deepEqual(m.players.map(p=>p.hp),[100,100]);assert.ok(m.lastPressure.scores[0]>1);
});
test('button zero from controller scores like keyboard and CPU participates',()=>{
 const m=clash();update(m,[readPad({buttons:[{pressed:true}]}),neutral()]);assert.equal(m.pressure.scores[0],1);
 for(let j=0;j<110;j++)update(m,[neutral(),aiInput(m,1/60)]);assert.equal(m.lastPressure.winner,1);
});
test('round timeout resolves contest, no simulation update means pause freezes it',()=>{
 const m=clash();const elapsed=m.pressure.elapsed;assert.equal(m.pressure.elapsed,elapsed);m.time=.01;step(m);assert.equal(m.phase,'over');assert.equal(m.pressure,null);
});
test('one glide, separated glides, airborne pursuit and capture clash stay separate',()=>{
 const m=createMatch();step(m,{pursuit:true},{pursuit:true},10);assert.equal(m.pressure,undefined);
 const n=createMatch();n.players[1].x=-2;step(n,{capture:true},{capture:true});step(n,{}, {},14);assert.equal(n.pressure,undefined);assert.equal(n.cinematic,null);
});
