import {createRecording,configuration,saveReplay,replayFilename} from './replay-format.js';
export const recordFromSearch=search=>new URLSearchParams(search).get('record')==='1';
export function downloadReplay(file){const url=URL.createObjectURL(new Blob([JSON.stringify(file)],{type:'application/json'})),a=document.createElement('a');a.href=url;a.download=replayFilename(file);a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
export async function loadRecordingBuild(){const r=await fetch('./skill/build.json',{cache:'no-store'});if(!r.ok)throw Error('Recording build identity unavailable; run npm run prepare:release.');return r.json();}
export function createLiveRecorder(build,{search,storage,bindings}={}){
 let recorder=null,current=null,latest=null,message='';
 function store(completed){latest=recorder.snapshot(completed);const result=saveReplay(latest,storage);message=result.saved?'Replay saved in this browser.':result.reason;return latest;}
 return {
  get active(){return !!current;},get latest(){return latest;},get ticks(){return recorder?.file.inputTicks||0;},get message(){return message;},
  begin(m,{settings,balance,stage,arena,round,wins}={}){if(current)this.end(false);if(!recorder||latest?.completed||recorder.file.rounds[0]?.fighters.some((id,i)=>id!==m.players[i].id))recorder=createRecording(build,{bindings});current=m;recorder.begin(m,configuration(search,settings,balance),{stage,arena,round,winsBefore:[...wins]});},
  tick(inputs,raw){if(!current)return;try{recorder.tick(inputs,raw);}catch(e){this.end(false);message=e.message+' Recording stopped; download the partial replay.';}},
  save(){if(!current)return latest;recorder.checkpoint(current);return store(false);},
  end(completed=false){if(!current)return latest;recorder.end(current);current=null;if(!recorder.file.rounds.length)return null;return store(completed);},
  reset(){this.end(false);recorder=null;latest=null;},
  bind(container){if(!latest)return;const button=document.createElement('button');button.id='download-replay';button.textContent='DOWNLOAD REPLAY';button.onclick=()=>downloadReplay(latest);container.append(button);const note=document.createElement('p');note.id='replay-save-status';note.textContent=message;container.after(note);}
 };
}
export function physicalSnapshot(keys,seat,pad,mapper){return {keys:keys.rawCodes(seat),mappedFrom:{...mapper.raw},pad:pad?{index:pad.index,axes:[...pad.axes],buttons:pad.buttons.map(b=>({pressed:b.pressed,value:b.value}))}:null};}
