import * as T from './vendor/three.module.js';
import {buildCharacter} from './characters.js';
import {loadFighterModel,attachFighterModel} from './tala-concept.js';
import {animateCharacter} from './animation.js';
import {moveTiming} from './moves.js';
import {fighters} from './fighters.js';
// Roster concept review: the actual Design 03 model with its runtime costume and the game's
// animation, for any fighter (?fighter=aegis|rei|morrow|sol|vesper). Tala has her own page.
const fighterId=new URLSearchParams(location.search).get('fighter')||'aegis',index=fighters.findIndex(f=>f.id===fighterId);
const scene=new T.Scene();scene.background=new T.Color('#333c45');
const camera=new T.PerspectiveCamera(35,innerWidth/innerHeight,.1,60),renderer=new T.WebGLRenderer({antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.setSize(innerWidth,innerHeight);renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.05;renderer.shadowMap.enabled=true;document.body.append(renderer.domElement);
scene.add(new T.HemisphereLight('#e4edf6','#5b5550',2));for(const [x,y,z,p] of [[3,6,5,3],[-4,4,-2,2]]){const l=new T.DirectionalLight('#fff2df',p);l.position.set(x,y,z);l.castShadow=true;scene.add(l);}
const floor=new T.Mesh(new T.CircleGeometry(6,64),new T.MeshStandardMaterial({color:'#343a3d',roughness:1}));floor.rotation.x=-Math.PI/2;floor.position.y=-.02;floor.receiveShadow=true;scene.add(floor);
let r,angle=.2,distance=9.0,time=0,paused=false,last=performance.now();const select=document.querySelector('#pose');
function cameraUpdate(){camera.position.set(Math.sin(angle)*distance,3.5,Math.cos(angle)*distance);camera.lookAt(0,1.4,.5);if(r)renderer.render(scene,camera);}
const strikeMove={};
function sample(pose,t,render=true){if(!r)return;const state={anim:pose,x:0,z:0,prev:{x:1,z:0},guard:pose==='guard',air:0,animTime:t,stridePhase:t*6};if(pose.startsWith('strike')){const timing=moveTiming(fighters[index],'strike');state.anim='attack';Object.assign(strikeMove,{...timing,kind:'strike',chain:Number(pose.at(-1)),frame:Math.floor(t*60)%timing.total});state.move=strikeMove;}animateCharacter(r,state,t);r.g.position.set(0,0,0);r.g.rotation.y=0;scene.updateMatrixWorld(true);if(render)renderer.render(scene,camera);return {fighter:fighterId,pose,t,costume:r.conceptCostume||(r.graveboundCostume?'morrow':null),meshes:r.g.getObjectsByProperty('isMesh',true).length};}
window.fighterReview={sample:(pose,t)=>{paused=true;time=t;select.value=pose;r.footPlants=null;r.gaitPlants=null;for(let f=0;f<Math.floor(t*60);f++)sample(pose,f/60,false);return sample(pose,t);},view:a=>{angle=a;cameraUpdate();renderer.render(scene,camera);},zoom:d=>{distance=d;cameraUpdate();},ready:false};
document.querySelectorAll('[data-angle]').forEach(b=>b.onclick=()=>{angle=Number(b.dataset.angle);cameraUpdate();});document.querySelector('#pause').onclick=()=>{paused=!paused;document.querySelector('#pause').textContent=paused?'Play':'Pause';};select.onchange=()=>{time=0;};let drag=false;renderer.domElement.onpointerdown=e=>{drag=true;renderer.domElement.setPointerCapture(e.pointerId);};renderer.domElement.onpointerup=()=>drag=false;renderer.domElement.onpointermove=e=>{if(drag){angle-=e.movementX*.01;cameraUpdate();}};renderer.domElement.onwheel=e=>{distance=T.MathUtils.clamp(distance+e.deltaY*.005,4,14);cameraUpdate();};onresize=()=>{camera.aspect=innerWidth/innerHeight;camera.updateProjectionMatrix();renderer.setSize(innerWidth,innerHeight);};cameraUpdate();
document.querySelector('h1').textContent=(fighters[index]?.name||fighterId.toUpperCase())+' / CONCEPT REVIEW';
document.querySelectorAll('[data-fighter]').forEach(a=>{a.href='./fighter-review.html?fighter='+a.dataset.fighter;if(a.dataset.fighter===fighterId)a.style.fontWeight='700';});
try{if(index<0||fighterId==='tala')throw Error('Pick a fighter: aegis, rei, morrow, sol or vesper');r=buildCharacter(index);const source=await loadFighterModel(fighterId);if(!attachFighterModel(r,source.scene))throw Error(fighterId+' model did not attach');scene.add(r.g);window.fighterReview.ready=true;document.querySelector('#status').textContent='Design 03 body with the concept costume · '+r.g.getObjectsByProperty('isMesh',true).length+' meshes';}catch(e){document.querySelector('#status').textContent=e.message;throw e;}
function tick(now){const dt=Math.min(.05,(now-last)/1000);last=now;if(!paused){time+=dt;sample(select.value,time);}requestAnimationFrame(tick);}requestAnimationFrame(tick);
