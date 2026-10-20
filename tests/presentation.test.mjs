import test from 'node:test';import assert from 'node:assert/strict';
import {createFlow,advanceFlow,beginKO,simulationRuns,cameraCue,timeScale,INTRO_STAGES,KO_SECONDS,REDUCED_KO_SECONDS} from '../dist/presentation.js';
const run=(flow,seconds)=>{const cues=[];for(let t=0;t<seconds;t+=1/60)cues.push(...advanceFlow(flow,1/60));return cues;};
test('round intro announces versus, round and fight before the simulation runs',()=>{
 const flow=createFlow({round:2,names:['AEGIS','REI']});assert.equal(simulationRuns(flow),false);assert.equal(timeScale(flow),0);
 const cues=run(flow,3);
 assert.deepEqual(cues.filter(c=>c.type==='callout').map(c=>c.kind),['versus','round','fight']);
 assert.equal(cues.find(c=>c.kind==='round').text,'ROUND 2');assert.equal(cues.find(c=>c.kind==='versus').text,'AEGIS  VS  REI');
 assert.equal(cues.filter(c=>c.type==='fight').length,1);assert.equal(flow.state,'fight');assert.equal(simulationRuns(flow),true);assert.equal(cameraCue(flow),null);
 const total=INTRO_STAGES.reduce((s,[,v])=>s+v,0),probe=createFlow();run(probe,total/2);assert.ok(cameraCue(probe).progress>.45&&cameraCue(probe).progress<.55);
});
test('training skips the ceremony and reduced motion shortens it',()=>{
 const training=createFlow({training:true});assert.equal(training.state,'fight');assert.deepEqual(advanceFlow(training,1),[]);
 const reduced=createFlow({reduced:true}),full=createFlow();run(reduced,1.6);run(full,1.6);assert.equal(reduced.state,'fight');assert.equal(full.state,'intro');
});
test('knockout holds the result before reporting done and distinguishes time and draw',()=>{
 const flow=createFlow({training:true});
 const cue=beginKO(flow,{winner:1,loser:0,reason:'ko'});assert.equal(cue.text,'K.O.');assert.equal(cue.kind,'ko');assert.equal(simulationRuns(flow),false);assert.equal(timeScale(flow),.3);
 assert.deepEqual({kind:cameraCue(flow).kind,winner:cameraCue(flow).winner,loser:cameraCue(flow).loser,duration:cameraCue(flow).duration},{kind:'ko',winner:1,loser:0,duration:KO_SECONDS});
 const cues=run(flow,KO_SECONDS-.05);assert.equal(cues.length,0);const done=run(flow,.2);assert.equal(done.length,1);assert.equal(done[0].type,'done');assert.deepEqual(done[0].result,{winner:1,loser:0,reason:'ko'});assert.equal(cameraCue(flow).progress,1);
 assert.equal(beginKO(createFlow({training:true}),{winner:0,loser:1,reason:'time'}).text,'TIME');assert.equal(beginKO(createFlow({training:true}),{winner:-1,loser:-1,reason:'draw'}).text,'DRAW');
 const quick=createFlow({training:true,reduced:true});beginKO(quick,{winner:0,loser:1});assert.equal(quick.duration,REDUCED_KO_SECONDS);
});
