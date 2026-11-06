// RANGED-CAPTURE switches: rangedcap=guard / flat, cpu=v2 and the capture/burst/fire telemetry labels.
import test from 'node:test';import assert from 'node:assert/strict';
import {createMatch,update,aiInput,neutral} from '../dist/combat.js';
import {fighters} from '../dist/fighters.js';
import {createTelemetry} from '../dist/skill/telemetry.js';
import {switchConfig} from '../dist/skill/replay-format.js';
import {normalizeRangedCapture} from '../dist/ranged-capture.js';
const TALA=2,SOL=4,STEP=1/60;
const circle=(m,from,context='far')=>{const a=m.players[from],b=m.players[1-from],d=Math.hypot(b.x-a.x,b.z-a.z);m.projectiles.push({x:b.x-(b.x-a.x)/d*2.2,z:b.z-(b.z-a.z)/d*2.2,dx:(b.x-a.x)/d*7,dz:(b.z-a.z)/d*7,life:1.8,owner:from,damage:12*fighters[a.id].power,kind:'capture',context,radius:.65,targetRadius:.65,expandable:true});};
function guardedTarget(options,hold=30){const m=createMatch(TALA,SOL,'duel','normal',options);for(let t=0;t<hold;t++)update(m,[neutral(),{...neutral(),guard:true}]);return m;}
function runUntil(m,inputs,frames,stop){for(let t=0;t<frames;t++){update(m,inputs);if(stop(m))return true;}return false;}
test('switch parsing: unknown values ignored, order normalised, keys absent by default',()=>{
 assert.equal(normalizeRangedCapture('flat,guard,bogus'),'flat,guard');assert.equal(normalizeRangedCapture(''),'');
 const base=switchConfig('?move=v2&burst=v2');assert.equal('rangedcap' in base,false);assert.equal('cpu' in base,false);
 assert.deepEqual({rangedcap:switchConfig('?rangedcap=guard').rangedcap,cpu:switchConfig('?cpu=v2').cpu},{rangedcap:'guard',cpu:'v2'});});
for(const [name,options,stopped] of [['default',{},false],['rangedcap=flat',{rangedcap:'flat'},false],['rangedcap=guard',{rangedcap:'guard'},true],['rangedcap=guard,flat',{rangedcap:'guard,flat'},true]])
 test(`held guard vs ranged capture circle: ${name} ${stopped?'stops':'is captured'}`,()=>{
  const m=guardedTarget(options);circle(m,0);const events=[];
  runUntil(m,[neutral(),{...neutral(),guard:true}],40,x=>{events.push(...x.events);return !!x.cinematic||!x.projectiles.length;});
  assert.equal(!!m.cinematic,!stopped);if(stopped){assert.ok(events.some(e=>e.type==='block'));assert.equal(m.players[1].hp,100);}});
for(const options of [{},{rangedcap:'guard'},{rangedcap:'flat'},{rangedcap:'guard,flat'},{cpu:'v2'}])
 test(`close capture beats held guard: ${JSON.stringify(options)}`,()=>{
  const m=guardedTarget(options);m.players[0].x=-1;m.players[1].x=1;
  for(let t=0;t<5;t++)update(m,[neutral(),{...neutral(),guard:true}]);
  update(m,[{...neutral(),capture:true},{...neutral(),guard:true}]);
  assert.ok(runUntil(m,[neutral(),{...neutral(),guard:true}],60,x=>x.cinematic?.kind==='capture'));assert.ok(['front','back'].includes(m.cinematic.context));});
for(const context of ['mid','far'])for(const [options,mult] of [[{},{mid:1.1,far:1.25}[context]],[{rangedcap:'flat'},1]])
 test(`ranged capture damage ${context} ${JSON.stringify(options)} = 15*power*${mult}`,()=>{
  const m=createMatch(TALA,SOL,'duel','normal',options);circle(m,0,context);
  assert.ok(runUntil(m,[neutral(),neutral()],40,x=>!!x.cinematic));assert.ok(Math.abs(m.cinematic.damage-15*fighters[TALA].power*mult)<1e-9);});
test('telemetry names ranged capture damage by range and counts guarded circles',()=>{
 for(const [context,key] of [['mid','system-capture-mid'],['far','system-capture-far']]){
  const m=createMatch(TALA,SOL,'duel','normal',{});const tel=createTelemetry(m);circle(m,0,context);
  for(let t=0;t<400&&m.players[1].hp===100;t++){const inputs=[neutral(),neutral()];tel.before(inputs);update(m,inputs);tel.after();}
  const p=tel.snapshot().players[0];assert.ok(p.damageByMove[key]>0,JSON.stringify(p.damageByMove));assert.equal(p.damageByMove['system-capture-close-'],undefined);tel.dispose();}
 const m=guardedTarget({rangedcap:'guard'});const tel=createTelemetry(m);circle(m,0);
 for(let t=0;t<40;t++){const inputs=[neutral(),{...neutral(),guard:true}];tel.before(inputs);update(m,inputs);tel.after();}
 assert.equal(tel.snapshot().players[1].rangedCapturesGuarded,1);tel.dispose();});
test('cpu=v2 avoids more capture circles than the baseline CPU (same seeds)',()=>{
 const landed=options=>{let n=0;for(let seed=1;seed<=40;seed++){const m=createMatch(TALA,SOL,'arcade','normal',options);m.seed=seed*7919;m.players[1].x=2;m.players[0].x=-4;
  for(let t=0;t<20;t++)update(m,[neutral(),aiInput(m,STEP)]);circle(m,0,'mid');
for(let t=0;t<50&&!m.cinematic;t++)update(m,[neutral(),aiInput(m,STEP)]);if(m.cinematic?.kind==='capture'&&m.cinematic.a===0)n++;}return n;};
 const base=landed({}),v2=landed({cpu:'v2'});console.log(`circles landed: baseline ${base}/40, cpu=v2 ${v2}/40`);assert.ok(v2<base,`baseline ${base}/40, v2 ${v2}/40`);});
