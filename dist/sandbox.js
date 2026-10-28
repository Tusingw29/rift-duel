import * as T from './vendor/three.module.js';
import {createView} from './render.js';
import {fighters} from './fighters.js';
import {RECIPES,createScenario,stepScenario,snapshot} from './sandbox-recipes.js';
import {setLocomotionSource,locomotionSource,setReactionSource} from './locomotion-clips.js';
import {setCombatVariant} from './spacing-commitment.js';
import {createSpacingMarker} from './spacing-marker.js';
// Local animation and combat sandbox: pick both fighters, pick a scripted scenario, scrub any
// simulation frame or play at 60 Hz or quarter speed, and inspect the exact simulation state.
// Scrubbing replays from the reset, so every frame is deterministic and identical to the game.
const $=s=>document.querySelector(s);
const params=new URLSearchParams(location.search);
// Animation source for the TALA-IMPORT-AB comparison: ?anim=imported (or the older ?gait=) selects it; authored is the default.
setLocomotionSource(params.get('anim')||params.get('gait')||'authored');setReactionSource(params.get('react'));
// SPACING-COMMITMENT rule switches: &spacing=band|riskyshot, &guard=split (default: the current game).
setCombatVariant({spacing:params.get('spacing'),guard:params.get('guard')});
const canvas=$('#stage');const view=createView(canvas,{talaModel:'graphic'});view.quality(params.get('quality')||'high');
const state={p1:Number(params.get('p1')??2),p2:Number(params.get('p2')??1),recipe:params.get('scenario')||'strike3',frame:0,playing:false,speed:1,scenario:null,helpers:[],hurt:[],hit:[],showSkeleton:false,showHurt:false,showHit:false};
// Graphic bodies attach asynchronously; replays wait for them so every frame animates the real rig.
const modelsReady=async()=>{for(let i=0;i<400&&(view.fighterModels||[]).some(r=>r.talaStatus==='loading');i++)await new Promise(r=>setTimeout(r,25));};
const settings={camera:'side',reduced:params.get('effects')!=='full',quality:'high',cameraZoom:Number(params.get('zoom')||.7)};
for(const [id,sel] of [['#p1','p1'],['#p2','p2']]){const el=$(id);fighters.forEach((f,i)=>{const o=document.createElement('option');o.value=i;o.textContent=f.name;el.append(o);});el.value=state[sel];el.onchange=()=>{state[sel]=Number(el.value);reset();};}
// A/B switch: rebuild the rigs and replay to the same frame so both modes are compared on identical simulation frames.
{const el=$('#anim');el.value=locomotionSource();el.onchange=async()=>{const frame=state.frame;setLocomotionSource(el.value);await reset();await seek(frame);};}
{const el=$('#scenario');for(const name of Object.keys(RECIPES)){const o=document.createElement('option');o.value=name;o.textContent=name;el.append(o);}el.value=state.recipe;el.onchange=()=>{state.recipe=el.value;reset();};}
function reset(){
 state.scenario=createScenario(state.recipe,state.p1,state.p2);state.frame=0;$('#frame').max=state.scenario.recipe.frames||64;
 view.match(state.scenario.m);clearHelpers();settings.camera=$('#camera').value;
 state.ready=modelsReady().then(()=>{view.render(0,state.scenario.m,settings);updateReadout();});
 return state.ready;
}
function clearHelpers(){for(const h of [...state.helpers,...state.hurt,...state.hit]){h.parent?.remove(h);h.geometry?.dispose();h.material?.dispose();}state.helpers=[];state.hurt=[];state.hit=[];}
// Every simulated frame is animated on the simulation clock (1/60 s, zero during hitstop, which the renderer applies),
// so scrubbed frames, played frames and the game agree; only the last frame of a replay is drawn.
async function seek(frame){
 const target=Math.max(0,Math.min(Number($('#frame').max),frame));
 if(target<state.frame){await reset();}
 await state.ready;
 while(state.frame<target){stepScenario(state.scenario);state.frame++;view.render(1/60,state.scenario.m,{...settings,noDraw:state.frame<target});}
 view.render(0,state.scenario.m,settings);updateReadout();
}
function updateReadout(){
 $('#frame').value=state.frame;$('#frame-label').textContent=`frame ${state.frame} · ${(state.frame/60).toFixed(3)} s`;
 const m=state.scenario.m,rows=m.players.map((p,i)=>{const s=snapshot(p);return `<b>P${i+1} ${fighters[p.id].name}</b> x ${s.x.toFixed(2)} z ${s.z.toFixed(2)} hp ${s.hp.toFixed(1)}<br>anim ${s.anim} (${s.animTime.toFixed(2)}) stun ${s.stun.toFixed(2)} air ${s.air.toFixed(2)}${s.guard?' guard':''}<br>move ${s.move?`${s.move.kind}${s.move.chain?' #'+s.move.chain:''} frame ${s.move.frame}/${s.move.startup}`:'—'}<br>travel ${s.travel?`${s.travel.kind} ${s.travel.frame}/${s.travel.frames}`:'—'} · stagger ${s.stagger}${s.staggered?' STAGGERED':''}`;});
 $('#readout').innerHTML=rows.join('<hr>')+`<small>${m.events.map(e=>e.type+(e.text?' '+e.text:'')).slice(-4).join(' · ')||''}</small>`;
 drawOverlays();
}
function drawOverlays(){
 const scene=view.scene,models=view.models;
 if(state.showSkeleton&&!state.helpers.length)for(const r of models){const h=new T.SkeletonHelper(r.g);h.material.depthTest=false;scene.add(h);state.helpers.push(h);}
 if(!state.showSkeleton&&state.helpers.length){for(const h of state.helpers){scene.remove(h);h.dispose?.();}state.helpers=[];}
 for(const h of state.hurt)scene.remove(h);state.hurt=[];for(const h of state.hit)scene.remove(h);state.hit=[];
 const m=state.scenario.m;
 m.players.forEach((p,i)=>{
  if(state.showHurt){const cap=new T.Mesh(new T.CapsuleGeometry(.5,1.9,4,12),new T.MeshBasicMaterial({color:i?'#c4a3ff':'#6fe7ff',wireframe:true,transparent:true,opacity:.6}));cap.position.set(p.x,1.45,p.z);scene.add(cap);state.hurt.push(cap);}
  if(state.showHit&&p.move&&['strike','pursuit','jumpAttack','launch'].includes(p.move.kind)){
   const reach=fighters[p.id].reach,active=p.move.frame>=p.move.startup&&p.move.frame<p.move.startup+(p.move.active||1);
   const arc=new T.Mesh(new T.RingGeometry(reach*.55,reach,24,1,Math.atan2(p.lookZ,p.lookX)-.6,1.2),new T.MeshBasicMaterial({color:active?'#ff5a4d':'#ffd86a',side:T.DoubleSide,transparent:true,opacity:active?.7:.3}));
   arc.rotation.x=-Math.PI/2;arc.position.set(p.x,.05,p.z);scene.add(arc);state.hit.push(arc);
  }
 });
 state.spacingMarker??=createSpacingMarker(scene);state.spacingMarker.update(m,0);
 view.render(0,m,settings);
}
$('#frame').oninput=e=>{state.playing=false;$('#play').textContent='Play';seek(Number(e.target.value));};
$('#play').onclick=()=>{state.playing=!state.playing;$('#play').textContent=state.playing?'Pause':'Play';};
$('#speed').onchange=e=>{state.speed=Number(e.target.value);};
$('#camera').onchange=e=>{settings.camera=e.target.value;view.render(0,state.scenario.m,settings);};$('#zoom').onchange=e=>{settings.cameraZoom=Number(e.target.value);view.render(0,state.scenario.m,settings);};
$('#reset').onclick=()=>reset();$('#step').onclick=()=>{state.playing=false;$('#play').textContent='Play';seek(state.frame+1);};
$('#back').onclick=()=>{state.playing=false;$('#play').textContent='Play';seek(state.frame-1);};
for(const [id,key] of [['#skeleton','showSkeleton'],['#hurtbox','showHurt'],['#hitbox','showHit']])$(id).onchange=e=>{state[key]=e.target.checked;drawOverlays();};
window.addEventListener('keydown',e=>{if(e.target.tagName==='SELECT'||e.target.tagName==='INPUT')return;if(e.code==='Space'){e.preventDefault();$('#play').click();}if(e.code==='ArrowRight')$('#step').click();if(e.code==='ArrowLeft')$('#back').click();if(e.code==='KeyR')reset();});
let tick=0;function loop(){if(state.playing){tick++;if(tick%Math.round(1/state.speed)===0){if(state.frame>=Number($('#frame').max))reset();else seek(state.frame+1);}}requestAnimationFrame(loop);}
window.sandbox={state,seek,reset,snapshot:()=>state.scenario.m.players.map(snapshot),get models(){return view.fighterModels;}};
reset();requestAnimationFrame(loop);
