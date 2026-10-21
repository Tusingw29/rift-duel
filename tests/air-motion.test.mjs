import test from 'node:test';import assert from 'node:assert/strict';
import {advanceAirMotion} from '../dist/air-motion.js';
const dt=1/60;
test('takeoff, pursuit timer resets and forced knockdown preserve height continuity',()=>{
 const p={air:0};advanceAirMotion(p,dt);p.air=.45;assert.equal(advanceAirMotion(p,dt),0);
 for(let n=0;n<8;n++){p.air=Math.max(0,p.air-dt);advanceAirMotion(p,dt);}
 for(const timer of [.4,.4,.16,0]){
  const before=p.airMotion.height;p.air=timer;assert.ok(Math.abs(advanceAirMotion(p,dt)-before)<1e-9);
  for(let n=0;n<5;n++){p.air=Math.max(0,p.air-dt);const old=p.airMotion.height;advanceAirMotion(p,dt);assert.ok(Math.abs(p.airMotion.height-old)<.55);}
 }
 for(let n=0;n<30;n++)advanceAirMotion(p,dt);assert.equal(p.airMotion.height,0);
});
test('air motion freezes with the simulation and normal jumps land on timer expiry',()=>{
 const p={air:.85};advanceAirMotion(p,dt);let peak=0;
 for(let n=0;n<51;n++){p.air=Math.max(0,p.air-dt);advanceAirMotion(p,dt);peak=Math.max(peak,p.airMotion.height);const before=JSON.stringify(p.airMotion);advanceAirMotion(p,0);assert.equal(JSON.stringify(p.airMotion),before);}
 assert.ok(peak>2.49&&peak<=2.5);assert.ok(p.airMotion.height<1e-9);
});
test('pursuit takes off toward opponent height before the first damage beat',()=>{
 const p={air:.45,move:{aerial:true,startup:7}};advanceAirMotion(p,dt);
 for(let f=1;f<7;f++){p.air-=dt;advanceAirMotion(p,dt);}
 assert.ok(p.airMotion.height>2.2&&p.airMotion.height<=2.4);
 const before=p.airMotion.height;p.air=.4;advanceAirMotion(p,dt);assert.equal(p.airMotion.height,before);
});
test('pursuit suspension brings both fighters together without teleporting either',()=>{
 const a={air:.4,airMotion:{height:2.27,velocity:6,previousAir:.3,segment:null}},b={air:.4,airMotion:{height:1.59,velocity:-8,previousAir:.3,segment:null}};
 for(const p of [a,b]){p.airMotionCue={height:2.2,duration:.15};const before=p.airMotion.height;advanceAirMotion(p,dt);assert.equal(p.airMotion.height,before);}
 for(let f=0;f<9;f++)for(const p of [a,b]){p.air-=dt;advanceAirMotion(p,dt);}
 assert.ok(Math.abs(a.airMotion.height-b.airMotion.height)<1e-8);assert.ok(Math.abs(a.airMotion.height-2.2)<1e-8);
});
