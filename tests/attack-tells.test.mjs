import test from 'node:test';
import assert from 'node:assert/strict';
import {specialPose,setAttackTells} from '../dist/grounded-animation.js';
import {morrowStance,morrowSpecials,morrowStrikePose} from '../dist/morrow-animation.js';
const burst=frame=>({kind:'super',startup:22,active:4,recovery:34,frame});
const launch=frame=>({kind:'launch',startup:24,active:5,recovery:34,frame});
test('tells are off by default and leave Morrow launcher and Gravefall unchanged',()=>{
 setAttackTells(null);const before=specialPose(launch(10),morrowStance,morrowSpecials),cleave=morrowStrikePose({chain:3,startup:24,active:4,recovery:30,frame:10});
 setAttackTells('on');setAttackTells('off');
 assert.deepEqual(specialPose(launch(10),morrowStance,morrowSpecials),before);assert.deepEqual(morrowStrikePose({chain:3,startup:24,active:4,recovery:30,frame:10}),cleave);
});
test('Last Horizon reads by 40% of startup: sword overhead and leaning back',()=>{
 setAttackTells('on');
 // Arms lead the schedule by 2 frames and the spine by 3.5, so the hips and chest start the drive a little before the sword moves.
 for(const f of [9,13,18])assert.ok(specialPose(burst(f),morrowStance,morrowSpecials).rax<-2.2,`frame ${f}`);
 for(const f of [9,13])assert.ok(specialPose(burst(f),morrowStance,morrowSpecials).lean<-.15,`frame ${f}`);
 const contact=specialPose(burst(22),morrowStance,morrowSpecials);assert.ok(contact.rax>-1.6&&contact.lean>.2);
 setAttackTells('off');
});
test('launcher tell drops the blade low behind in a crouch, then tears upward on contact',()=>{
 setAttackTells('on');
 for(const f of [10,14,20])assert.ok(specialPose(launch(f),morrowStance,morrowSpecials).rax>.2,`frame ${f}`);
 for(const f of [10,14])assert.ok(specialPose(launch(f),morrowStance,morrowSpecials).bodyY<-.45,`frame ${f}`);
 assert.ok(specialPose(launch(24),morrowStance,morrowSpecials).rax<-2.3);
 setAttackTells('off');
});
