import {horizonObserver} from './horizon-observer.mjs';
import {arenaObserver} from './arena-observer.mjs';
import stepper from './bots/stepper.mjs';
import masherAll from './bots/masher-all.mjs';
import {createMatch,update} from '../../dist/combat.js';
import {createTelemetry} from '../../dist/skill/telemetry.js';
import {visible,delayedBot} from './bots/common.mjs';
import random from './bots/random.mjs';import masher from './bots/masher.mjs';import spacer from './bots/spacer.mjs';import timer from './bots/timer.mjs';import reader from './bots/reader.mjs';import turtle from './bots/turtle.mjs';import zoner from './bots/zoner.mjs';
import punisher from './bots/punisher.mjs';
export const policies={stepper,random,masher,spacer,timer,reader,turtle,zoner,punisher,'masher-all':masherAll};
export function runMatch({bots=['random','masher'],fighters=[0,1],seed=1,delay=15,mode='default',balance=null,grab='',movement='',arena='',ring=10,burst='',morrow='',measureArena=false,measureHorizon=false,roundSeconds=60}={}){
 const m=createMatch(...fighters,'duel','normal',{roundSeconds,winsNeeded:1,grab,movement,arena,ring,burst,morrow,...(balance?{balance}:{})});
 const horizon=measureHorizon?horizonObserver(m):null;
 const boundary=measureArena?arenaObserver(m):null;
 const agents=bots.map((name,seat)=>delayedBot(policies[name],{seed:seed+seat*1000003,delay,seat}));
 const t=createTelemetry(m,{bots,seed,delay,mode,source:'tournament'});
 // Safety bound exceeds a full round with sustained hitstop; censored runs remain explicitly unfinished.
 for(let n=0;m.phase==='fight'&&n<roundSeconds*60*5;n++){const obs=visible(m),inputs=agents.map(a=>a.next(obs));t.before(inputs,agents.map(a=>a.breakIntent),agents.map(a=>a.grabIntent));update(m,inputs);t.after();boundary?.after();horizon?.after();}
 const result=t.snapshot();if(horizon){result.burst=horizon.snapshot();horizon.dispose();}if(boundary){result.arena=boundary.snapshot();boundary.dispose();}t.dispose();return result;
}
