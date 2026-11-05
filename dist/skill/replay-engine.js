import {createMatch,update} from '../combat.js';
import {createTelemetry} from './telemetry.js';
import {createFrameAnalysis} from './replay-analysis.js';
import {validateReplay,matchOptions,resultOf,canonical} from './replay-format.js';
// Seeks rebuild from recorded inputs: WeakMap preview configuration must be recreated,
// not restored from a JSON state snapshot. No CPU decisions are rerun.
export function createReplay(file,build,{keepFrames=true}={}){
 validateReplay(file,build);let m,analysis,telemetry,roundIndex=-1,runIndex=0,runFrame=0,roundFrame=0,cursor=0,finished=false;const rounds=[],frames=[];
 function begin(){const r=file.rounds[++roundIndex];m=createMatch(...r.fighters,r.mode,r.difficulty,matchOptions(r.config));if(r.seedWasExplicit)m.seed=r.initialSeed;analysis=createFrameAnalysis(m,{round:roundIndex+1,keepFrames:false});telemetry=createTelemetry(m,{source:'replay',mode:r.config.switches.balance||'default'});runIndex=0;runFrame=0;roundFrame=0;}
 function close(){const r=file.rounds[roundIndex],result=resultOf(m);if(canonical(result)!==canonical(r.result))throw Error(`Replay diverged in round ${roundIndex+1}: expected ${JSON.stringify(r.result)}, got ${JSON.stringify(result)}`);rounds.push({round:roundIndex+1,result,telemetry:telemetry.snapshot(),positioning:analysis.summary()});analysis.dispose();telemetry.dispose();}
 begin();return {
  get match(){return m;},get cursor(){return cursor;},get round(){return roundIndex+1;},get done(){return finished;},get total(){return file.inputTicks;},frames,
  step(){if(finished)return null;if(roundFrame===file.rounds[roundIndex].inputTicks)begin();const run=file.rounds[roundIndex].runs[runIndex],inputs=run.inputs;telemetry.before(inputs);analysis.before(inputs);update(m,inputs);telemetry.after();const frame=analysis.after();frame.raw=run.raw;cursor++;roundFrame++;if(++runFrame===run.frames){runIndex++;runFrame=0;}if(keepFrames)frames.push(frame);
   if(roundFrame===file.rounds[roundIndex].inputTicks){close();if(roundIndex===file.rounds.length-1)finished=true;}return frame;},
  summary(){return {kind:'rift-replay-analysis',schema:1,build:file.build,createdAt:file.createdAt,inputTicks:cursor,verified:finished,rounds};},
  dispose(){analysis?.dispose();telemetry?.dispose();}
 };
}
export function replayAll(file,build,options){const replay=createReplay(file,build,options);while(!replay.done)replay.step();return {summary:replay.summary(),frames:replay.frames};}
