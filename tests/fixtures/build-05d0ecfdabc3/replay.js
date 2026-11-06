import {createView} from './render.js';
import {createReplay} from './skill/replay-engine.js';
import {readReplays} from './skill/replay-format.js';
import {loadRecordingBuild} from './skill/record-live.js';
import {controlsCamera} from './controls-view.js';
import {fighters} from './fighters.js';
const $=s=>document.querySelector(s),build=await loadRecordingBuild(),view=createView($('#scene'),{quality:'low',talaModel:'graphic'});view.quality('low');
let file=null,replay=null,playing=false,busy=false,activeRound=0,last=0,acc=0,error=null;
function status(text){$('#status').textContent=text;}
function fail(e){playing=false;error=e.message;status('Replay rejected: '+e.message);$('#play').disabled=true;$('#step').disabled=true;$('#seek').disabled=true;}
function settings(){const r=file.rounds[replay.round-1],c=r.config;return {...c.settings,quality:'low',camera:$('#camera').value==='recorded'?controlsCamera(c.switches.controls,c.settings.camera):$('#camera').value};}
function draw(dt=0,noDraw=false){if(!replay)return;if(activeRound!==replay.round){const r=file.rounds[replay.round-1];view.match(replay.match,r.arena??replay.match.players[1].id);activeRound=replay.round;}view.render(dt,replay.match,{...settings(),noDraw});}
function events(){for(const e of replay.match.events){if(e.type==='hit'){view.burst(e.x,e.z,e.color,e.damage>=12?22:14);view.shake(e.damage>=12?.55:.25);}if(e.type==='groundBounce')view.shake(.45);if(e.type==='parry')view.burst(e.x,e.z,'#ffffff');}}
function ui(){if(!replay)return;$('#position').textContent=`Round ${replay.round} · ${replay.cursor} / ${replay.total} input frames`;$('#seek').value=replay.cursor;$('#play').textContent=playing?'PAUSE':replay.done?'REPLAY AGAIN':'PLAY';if(replay.done)status(`${file.rounds.length} round(s) verified: HP, round results, state digest and input/combat ticks match.`);}
function step(noDraw=false){if(!replay||replay.done)return;replay.step();draw(replay.match.frozen?0:1/60,true);events();if(!noDraw)draw(0);if(replay.done)playing=false;}
async function load(value){playing=false;error=null;replay?.dispose();try{file=value;replay=createReplay(file,build,{keepFrames:false});activeRound=0;$('#seek').max=replay.total;for(const id of ['play','step','seek'])$('#'+id).disabled=false;draw();status(`${file.rounds[0].fighters.map(i=>fighters[i].name).join(' vs ')} · ${file.rounds.length} round(s). Ready.`);ui();}catch(e){fail(e);}}
async function openText(text){if(text.length>20000000)throw Error('Replay exceeds 20 MB');await load(JSON.parse(text));}
$('#file').onchange=async e=>{try{const f=e.target.files[0];if(f)await openText(await f.text());}catch(e){fail(e);}};
window.addEventListener('dragover',e=>e.preventDefault());window.addEventListener('drop',async e=>{e.preventDefault();try{if(e.dataTransfer.files[0])await openText(await e.dataTransfer.files[0].text());}catch(e){fail(e);}});
let saved=[];try{saved=readReplays(localStorage).filter(r=>r?.kind==='rift-match-replay'&&Array.isArray(r.rounds?.[0]?.fighters)&&r.rounds[0].fighters.every(n=>Number.isInteger(n)&&n>=0&&n<6));}catch{}saved.forEach((r,i)=>{const o=document.createElement('option');o.value=i;o.textContent=`${r.createdAt} · ${r.rounds[0].fighters.map(n=>fighters[n].name).join(' / ')}`;$('#saved').append(o);});$('#open-saved').onclick=()=>{if($('#saved').value!=='')load(saved[Number($('#saved').value)]);};
async function seek(target){if(busy||!file)return;busy=true;playing=false;$('#play').disabled=$('#step').disabled=$('#seek').disabled=true;try{replay.dispose();replay=createReplay(file,build,{keepFrames:false});activeRound=0;draw(0,true);while(replay.cursor<target){for(let n=0;n<600&&replay.cursor<target;n++)step(true);status(`Seeking ${replay.cursor} / ${target}…`);await new Promise(resolve=>setTimeout(resolve,0));}draw();ui();if(!replay.done)status('Paused.');}catch(e){fail(e);}finally{busy=false;if(!error)$('#play').disabled=$('#step').disabled=$('#seek').disabled=false;}}
$('#seek').onchange=()=>seek(Number($('#seek').value));$('#play').onclick=async()=>{if(replay?.done)await seek(0);playing=!playing;acc=0;ui();};$('#step').onclick=()=>{playing=false;try{step();ui();}catch(e){fail(e);}};$('#camera').onchange=()=>draw();
function frame(ms){const dt=Math.min(.1,(ms-last)/1000)||0;last=ms;if(playing&&!busy){acc+=dt;try{while(acc>=1/60&&!replay.done){step(true);acc-=1/60;}draw(0);ui();}catch(e){fail(e);}}requestAnimationFrame(frame);}requestAnimationFrame(frame);
// Read-only diagnostics; load/seek are exposed for repeatable browser checks.
window.replayDebug=()=>({cursor:replay?.cursor,total:replay?.total,round:replay?.round,done:replay?.done,playing,busy,error,hp:replay?.match.players.map(p=>p.hp),models:view.fighterModels});window.loadReplay=load;window.seekReplay=seek;
const url=new URLSearchParams(location.search).get('file');if(url){try{const r=await fetch(url);if(!r.ok)throw Error(`Replay download failed (${r.status})`);await openText(await r.text());}catch(e){fail(e);}}
