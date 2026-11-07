import {sealFromSearch,capDamageFromSearch} from '../capture-seal.js';
import {captureWakeFromSearch} from '../capture-wake.js';
import {movementFromSearch} from '../movement-v2.js';
import {arenaFromSearch,ringFromSearch} from '../arena-bounds.js';
import {stepFromSearch} from '../linear-hits.js';
import {burstFromSearch} from '../burst-preview.js';
import {rangedCaptureFromSearch} from '../ranged-capture.js';
import {cpuFromSearch} from '../cpu-v2.js';
import {morrowFromSearch} from '../morrow-preview.js';
import {grabFromSearch} from '../grab-options.js';
import {controlsFromSearch} from '../controls-view.js';
import {normalizeOptions} from '../options.js';
export const REPLAY_SCHEMA=1,MAX_TICKS=216000,REPLAY_STORE='rift-match-replays',STORE_CHAR_BUDGET=1800000;
export const clone=value=>JSON.parse(JSON.stringify(value));
export function canonical(value){if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';if(value&&typeof value==='object')return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';return JSON.stringify(value);}
// Integrity check for accidental edits, not a cryptographic signature or anti-cheat.
export function digest(value){let n=2166136261;for(const c of canonical(value)){n^=c.charCodeAt(0);n=Math.imul(n,16777619);}return (n>>>0).toString(16).padStart(8,'0');}
export function switchConfig(search){const movement=movementFromSearch(search);return {movement,arena:arenaFromSearch(search,movement),ring:ringFromSearch(search),burst:burstFromSearch(search),step:stepFromSearch(search),morrow:morrowFromSearch(search),grab:{...grabFromSearch(search)},controls:controlsFromSearch(search),balance:new URLSearchParams(search).get('balance')||'',...optional(search)};}
// RANGED-CAPTURE switches are added only when set, so replays recorded before them keep identical switch objects.
function optional(search){const rangedcap=rangedCaptureFromSearch(search),cpu=cpuFromSearch(search),capturewake=captureWakeFromSearch(search),seal=sealFromSearch(search),capdmg=capDamageFromSearch(search);return {...(rangedcap?{rangedcap}:{}),...(cpu?{cpu}:{}),...(capturewake?{capturewake}:{}),...(seal?{seal}:{}),...(capdmg?{capdmg}:{})};}
export function configuration(search,settings={},balance=null){const switches=switchConfig(search);return {search,urlSwitches:[...new URLSearchParams(search)],switches,settings:normalizeOptions(settings),balance:balance?clone(balance):null};}
export function matchOptions(config){return {...config.settings,...config.switches,balance:config.balance};}
export function resultOf(m){return {hp:m.players.map(p=>p.hp),winner:m.winner,phase:m.phase,ticks:m.tick,inputTicks:m.inputTick,time:m.time,state:digest({players:m.players,projectiles:m.projectiles,rules:m.rules,time:m.time,tick:m.tick,inputTick:m.inputTick,hitstop:m.hitstop,phase:m.phase,winner:m.winner,cinematic:m.cinematic,pressure:m.pressure??null,...(m.seals?{seals:m.seals,sealSerial:m.sealSerial}:{})})};}
export function validateReplay(file,build){
 if(file?.kind!=='rift-match-replay'||file.schema!==REPLAY_SCHEMA)throw Error('Unsupported replay schema');
 if(!build?.hash||file.build?.hash!==build.hash)throw Error(`Replay build mismatch: file ${file.build?.hash}, installed ${build?.hash}. Open this replay with its original build.`);
 if(!Array.isArray(file.rounds)||!file.rounds.length||file.rounds.length>100)throw Error('Invalid replay rounds');
 let ticks=0;
 for(const r of file.rounds){
  const c=r.config;if(!c||canonical(c.switches)!==canonical(switchConfig(c.search))||canonical(c.urlSwitches)!==canonical([...new URLSearchParams(c.search)]))throw Error('Replay switch mismatch');
  if(r.configDigest!==digest(c))throw Error('Replay settings/switch integrity mismatch');
  if(!Array.isArray(r.fighters)||r.fighters.length!==2||r.fighters.some(x=>!Number.isInteger(x)||x<0||x>5))throw Error('Invalid fighters');
  if(!['duel','arcade','local','training'].includes(r.mode)||!['easy','normal','hard'].includes(r.difficulty))throw Error('Invalid match mode/difficulty');
  if(!Number.isInteger(r.initialSeed)||r.initialSeed<0||r.initialSeed>4294967295)throw Error('Invalid seed');
  if(!Array.isArray(r.runs)||!Number.isInteger(r.inputTicks)||r.inputTicks<1)throw Error('Invalid input stream');
  let count=0;for(const run of r.runs){if(!Number.isInteger(run.frames)||run.frames<1||!Array.isArray(run.inputs)||run.inputs.length!==2)throw Error('Invalid input run');count+=run.frames;for(const i of run.inputs){if(!i||Object.entries(i).some(([k,v])=>['x','z'].includes(k)?!Number.isFinite(v)||Math.abs(v)>1:!['attack','guard','capture','launch','pursuit','super','circle','crossover'].includes(k)||typeof v!=='boolean'))throw Error('Invalid replay input');}if(!Array.isArray(run.raw)||run.raw.length!==2)throw Error('Missing physical input snapshots');}
  if(count!==r.inputTicks)throw Error('Replay tick count mismatch');ticks+=count;if(ticks>MAX_TICKS)throw Error('Replay exceeds tick safety limit');
  if(!r.result||r.result.inputTicks!==count)throw Error('Replay result tick mismatch');
 }
 if(ticks!==file.inputTicks)throw Error('Replay total tick mismatch');
 if(file.integrity!==digest({rounds:file.rounds,inputTicks:file.inputTicks,completed:file.completed}))throw Error('Replay data integrity mismatch');
 return file;
}
export function createRecording(build,meta={}){
 const file={kind:'rift-match-replay',schema:REPLAY_SCHEMA,build:clone(build),createdAt:new Date().toISOString(),...clone(meta),rounds:[],inputTicks:0,completed:false};let current,last;
 return {file,
  begin(m,config,meta={}){current={fighters:m.players.map(p=>p.id),mode:m.mode,difficulty:m.difficulty,initialSeed:m.seed??1234567,seedWasExplicit:m.seed!==undefined,config:clone(config),configDigest:digest(config),...clone(meta),runs:[],inputTicks:0};file.rounds.push(current);last=null;},
  tick(inputs,raw=[{},{}]){if(!current)throw Error('Start a recording round first');if(file.inputTicks>=MAX_TICKS)throw Error('Recording exceeded one-hour safety limit');const value={inputs:clone(inputs),raw:clone(raw)},key=canonical(value);if(last?.key===key)last.run.frames++;else{const run={frames:1,...value};current.runs.push(run);last={key,run};}current.inputTicks++;file.inputTicks++;},
  checkpoint(m){if(current){current.result=resultOf(m);current.completed=m.phase==='over';}},
  end(m){if(!current)return;if(!current.inputTicks){file.rounds.pop();current=null;last=null;return;}current.result=resultOf(m);current.completed=m.phase==='over';current=null;last=null;},
  snapshot(completed=false){file.completed=completed;file.integrity=digest({rounds:file.rounds,inputTicks:file.inputTicks,completed:file.completed});return clone(file);}
 };
}
export function readReplays(storage){try{const rows=JSON.parse(storage.getItem(REPLAY_STORE)||'[]');return Array.isArray(rows)?rows:[];}catch{return [];}}
export function saveReplay(file,storage){try{const rows=[...readReplays(storage).filter(r=>r.createdAt!==file.createdAt),file].slice(-20);while(rows.length>1&&JSON.stringify(rows).length>STORE_CHAR_BUDGET)rows.shift();const text=JSON.stringify(rows);if(text.length>STORE_CHAR_BUDGET)return {saved:false,reason:'Replay is too large for browser storage. Download it instead.'};storage.setItem(REPLAY_STORE,text);return {saved:true,count:rows.length,characters:text.length};}catch{return {saved:false,reason:'Browser storage is unavailable or full. Download the replay instead.'};}}
export function replayFilename(file){const r=file.rounds[0],names=r.fighters.map(i=>['aegis','rei','tala','morrow','sol','vesper'][i]).join('-vs-'),last=file.rounds.at(-1)?.result;return `rift-${file.createdAt.replace(/[:.]/g,'-')}-${names}-${last?.phase==='over'?(last.winner<0?'draw':'p'+(last.winner+1)+'-wins'):'partial'}.json`;}
