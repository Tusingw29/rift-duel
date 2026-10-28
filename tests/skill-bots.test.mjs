import test from 'node:test';import assert from 'node:assert/strict';
import {createMatch,neutral} from '../dist/combat.js';
import {delayedBot,visible,incoming} from '../scripts/skill/bots/common.mjs';
import {createTelemetry} from '../dist/skill/telemetry.js';import {measured} from '../dist/skill/observer.js';
import {validityRollups,captureShare} from '../dist/skill/report.js';
const names=['timer','reader','spacer','turtle','zoner','punisher'];
test('skilled policies declare every directional attack intentionally across visible scenarios',async()=>{
 for(const name of names){const {default:policy,directionalAttacks}=await import(`../scripts/skill/bots/${name}.mjs`);assert.ok(Array.isArray(directionalAttacks));
 for(const d of [1,2.6,3.2,5,8,10])for(const phase of [null,'startup','active','recovery'])for(const kind of ['strike','capture'])for(const shot of [false,true]){
 const m=createMatch();m.players[0].x=0;m.players[0].z=0;m.players[1].x=d;m.players[1].z=0;
 const o=visible(m);o.players[1].move=phase?{kind,phase}:null;if(shot)o.projectiles=[{owner:1,x:7,z:0}];
 const b=delayedBot(policy,{delay:0});for(let f=0;f<50;f++){const i=b.next(o);if(i.attack&&(i.x||i.z)){assert.equal(i.z,0,name);assert.ok(directionalAttacks.includes(i.x<0?'back':'forward'),name);}}
 }}
});
test('projectile warning reaches nine units and respects observation delay',async()=>{
 const {default:p}=await import('../scripts/skill/bots/punisher.mjs');const m=createMatch(),o=visible(m);o.players[0].x=0;o.players[0].z=0;
 const c={seat:0,self:o.players[0],obs:o};o.projectiles=[{owner:1,x:8,z:0}];assert.equal(incoming(c),true);o.projectiles[0].x=9.1;assert.equal(incoming(c),false);o.projectiles[0]={owner:0,x:1,z:0};assert.equal(incoming(c),false);
 const b=delayedBot(p,{delay:15});o.projectiles=[{owner:1,x:8,z:0}];for(let f=0;f<15;f++)assert.equal(b.next(o).guard,false);assert.equal(b.next(o).guard,true);
});
test('recovery punishers tap every two frames with neutral directions',async()=>{
 for(const name of names.filter(n=>n!=='zoner')){const {default:p}=await import(`../scripts/skill/bots/${name}.mjs`);const o=visible(createMatch());o.players[1].x=o.players[0].x+1;o.players[1].z=o.players[0].z;o.players[1].move={kind:'strike',phase:'recovery'};const b=delayedBot(p,{delay:0});for(let f=0;f<10;f++){const i=b.next(o);assert.equal(i.attack,f%2===0,name);assert.equal(i.x,0,name);assert.equal(i.z,0,name);}}
});
test('validity counts actual move starts and projectile contacts, not repeated frames or melee blocks',()=>{
 const m=createMatch(),t=createTelemetry(m,{bots:['timer','masher']});m.players[1].move={kind:'strike',frame:12,startup:9,active:3};t.before([neutral(),neutral()]);m.players[0].move={kind:'strike',chain:1,frame:0,startup:9,active:3};
 measured(m,'damage',{attacker:1,defender:0,damage:5,kind:'bolt'});measured(m,'block',{attacker:1,defender:0,damage:1,kind:'bolt'});measured(m,'perfectGuard',{attacker:1,defender:0,damage:0,kind:'bolt'});measured(m,'block',{attacker:1,defender:0,damage:1,kind:'hit'});t.after();
 t.before([neutral(),neutral()]);t.after();t.before([neutral(),neutral()]);m.players[0].move={kind:'forward',frame:0,startup:10,active:2};t.after();const r=t.snapshot(),p=r.players[0];assert.equal(p.shotsReceived,1);assert.equal(p.shotsGuarded,2);assert.equal(p.basicStrikesStarted,1);assert.equal(p.directionalSpecialsStarted,1);assert.equal(p.punishAttemptsStarted,2);
 assert.equal(validityRollups([r])[0].shotsGuarded,2);delete r.players[0].shotsGuarded;assert.equal(validityRollups([r])[0].shotsGuarded,null);
});
test('capture share uses actual HP damage and explicitly filtered winning bouts',()=>{
 const row=(winner)=>({completed:true,winner,bots:['masher','punisher'],players:[{damage:20,damageByMove:{'system-capture-close-':12,other:8}},{}]});const r=captureShare([row(0),row(1)],'masher',['punisher'],true);assert.deepEqual(r,{n:1,damage:20,captureDamage:12,share:.6});
});
