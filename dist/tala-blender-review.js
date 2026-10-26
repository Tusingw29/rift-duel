import {setLocomotionSource,locomotionSource} from './locomotion-clips.js';
import {applyGraphicFlat} from './graphic-flat.js';
import {sharpenTextures} from './shading.js';
import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
import {createLiveTalaReview,LIVE_TALA_CLIPS,TALA_TRANSITION_CLIPS} from './tala-live-review.js';
const $=s=>document.querySelector(s),host=$('#view');
const modelParam=new URLSearchParams(location.search).get('model'),design02=modelParam==='design02',graphic=modelParam==='graphic',v3=modelParam==='v3'||graphic;
if(v3){document.querySelector('header span').textContent='Design 03 · anatomical body preview';const link=document.querySelector('a[download]');link.href='assets/models/tala-v3.glb';document.querySelector('#model-note').textContent='Anatomical body with an open ochre vest and collar, charcoal top, shortened rust shorts, fitted forearm and shin wraps, dark footwear and swept fringe. Existing live combat animation is retained. Face likeness, closed combat hands, finer garment fit and hair detail remain unfinished.';const play=document.querySelector('#play-model a');play.href='./?tala=v3';play.textContent='Try Design 03 in a fight →';}
if(design02){document.querySelector('header span').textContent='Design 02 · face, body and costume study';const link=document.querySelector('a[download]');link.href='assets/models/tala-design02.glb';$('#model-note').textContent='Layered auburn hair, curved ears, refined facial planes, a sloping shoulder bridge and folded collar. The current game poses drive this model. Face likeness, garment fit, lower-body detail and movement still need art review.';const play=$('#play-model a');play.href='./?tala=design02';play.textContent='Try Design 02 in a fight →';const concept=$('#concept-link');concept.href='https://github.com/Tusingw29/rift-duel/blob/main/art/tala-design-02/01-character.png';concept.textContent='Compare with Design 02 concept';const video=document.createElement('a');video.href='tala-motion.html';video.textContent='Watch the normal-speed motion video';const row=document.createElement('p');row.append(video);$('#model-note').after(row);}
if(graphic){document.querySelector('header span').textContent='Graphic flat-color 3D · Tala';document.querySelector('a[download]').href='assets/tala-graphic/tala-graphic.glb';$('#model-note').textContent='Refined anime face, solid auburn hair, fitted ochre vest, rust shorts and ivory wraps. Closed fists and a blended neck connection. 61-bone combat skin, texture-free palette and portable clips sampled from live animation. This is the actual model, not a concept image.';$('#play-model a').href='./?tala=graphic';$('#play-model a').textContent='Play with graphic Tala →';$('#concept-link').href='https://github.com/Tusingw29/rift-duel/blob/main/art/style-options-2026-10-25/15-graphic-flat-color-3d.png';$('#concept-link').textContent='Compare with selected art direction';$('#source option[value="baked"]').textContent='Exported skeletal clips';const pack=document.createElement('p');pack.innerHTML='<a href="assets/tala-graphic/tala-graphic-pack.zip" download>Download complete asset pack</a>';$('#model-note').after(pack);}
const renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,2));host.prepend(renderer.domElement);renderer.outputColorSpace=T.SRGBColorSpace;
const scene=new T.Scene();scene.background=new T.Color('#323b49');
const camera=new T.PerspectiveCamera(38,1,.01,100);let yaw=.35,pitch=.12,distance=5.3,focusY=1.35;
scene.add(new T.HemisphereLight('#fff3db','#4b586b',1.25));const sun=new T.DirectionalLight('#fff0d3',1.8);sun.position.set(3,5,4);scene.add(sun);
const floor=new T.Mesh(new T.CircleGeometry(25,64),new T.MeshLambertMaterial({color:'#444951'}));floor.rotation.x=-Math.PI/2;floor.position.y=-.025;scene.add(floor);
const grid=new T.GridHelper(50,100,'#747674','#555b60');grid.position.y=-.023;scene.add(grid);
let mixer,model,action,clips=[],paused=false,drag=null,live,elapsed=0,rigHelpers=[];
const rigLabel=document.createElement('label');rigLabel.innerHTML='<input id="skeleton" type="checkbox" style="width:auto"> Show skeleton';$('#wire').closest('label').after(rigLabel);$('#skeleton').onchange=()=>rigHelpers.forEach((h,i)=>h.visible=$('#skeleton').checked&&(i===0?!isLive():isLive()));
const isLive=()=>$('#source').value==='live';
const gaitLabel=document.createElement('label');gaitLabel.innerHTML='Locomotion <select id="gait"><option value="authored">Authored fighting steps</option><option value="mocap">Motion capture (experimental)</option></select>';$('#source').after(gaitLabel);
$('#gait').value=setLocomotionSource(new URLSearchParams(location.search).get('gait'));
function updateGaitLink(){const link=$('#play-model a'),url=new URL(link.href);url.searchParams.set('gait',locomotionSource());link.href=url.href;}
updateGaitLink();
$('#gait').onchange=()=>{setLocomotionSource($('#gait').value);updateGaitLink();if(live)poseAt(elapsed);};

const activeClips=()=>isLive()?[...LIVE_TALA_CLIPS,...TALA_TRANSITION_CLIPS]:clips;
const activeModel=()=>isLive()?live.rig.g:model;
function resize(){renderer.setSize(host.clientWidth,host.clientHeight);camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(host);
function poseAt(time){elapsed=time;if(isLive())live.sample($('#clip').value,time);else{action.time=time;mixer.update(0);}}
function choose(){
 elapsed=0;$('#time').value=0;const name=$('#clip').value,clip=activeClips().find(c=>c.name===name);$('#time').max=clip.duration;
 if(!isLive()){mixer.stopAllAction();action=mixer.clipAction(clip);action.reset().play();}
 poseAt(0);
}
function chooseSource(){
 $('#gait').disabled=!isLive();model.visible=!isLive();live.rig.g.visible=isLive();rigHelpers.forEach((h,i)=>h.visible=$('#skeleton').checked&&(i===0?!isLive():isLive()));$('#clip').replaceChildren();
 for(const clip of activeClips()){const option=document.createElement('option');option.value=clip.name;option.textContent=clip.name;$('#clip').append(option);}
 $('#clip').value=isLive()?'Guard + block':'Idle';choose();$('#status').textContent=isLive()?'Current live animation · scripted demonstration':graphic?'Exported local skeletal clips · 30 fps':'Saved Blender study clips · earlier motion';
}
$('#source').onchange=chooseSource;$('#clip').onchange=choose;$('#play').onclick=()=>{paused=!paused;$('#play').textContent=paused?'Play':'Pause';};$('#reset').onclick=()=>poseAt(0);
$('#time').oninput=()=>{if(live){paused=true;$('#play').textContent='Play';poseAt(+$('#time').value);}};
$('#wire').onchange=()=>[model,live?.rig.g].filter(Boolean).forEach(root=>root.traverse(n=>{if(n.isMesh)for(const m of [].concat(n.material))m.wireframe=$('#wire').checked;}));
for(const b of document.querySelectorAll('[data-angle]'))b.onclick=()=>{yaw=+b.dataset.angle;pitch=.12;focusY=1.35;distance=5.3;};
renderer.domElement.onpointerdown=e=>{drag=[e.clientX,e.clientY];renderer.domElement.setPointerCapture(e.pointerId);};renderer.domElement.onpointerup=()=>drag=null;
renderer.domElement.onpointermove=e=>{if(drag){yaw-=(e.clientX-drag[0])*.008;pitch=Math.max(-.4,Math.min(.8,pitch+(e.clientY-drag[1])*.006));drag=[e.clientX,e.clientY];}};
renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();distance=Math.max(.7,Math.min(9,distance+e.deltaY*.004));},{passive:false});
try{
 const gltf=await new GLTFLoader().loadAsync(graphic?'./assets/tala-graphic/tala-graphic.glb?v=3':v3?'./assets/models/tala-v3.glb?v=8':design02?'./assets/models/tala-design02.glb?v=13':'./assets/models/tala-study.glb?v=4');model=gltf.scene;if(graphic)applyGraphicFlat(model);sharpenTextures(model,renderer.capabilities.getMaxAnisotropy(),'high',renderer.getContext().getContextAttributes().antialias);scene.add(model);clips=gltf.animations;mixer=new T.AnimationMixer(model);
 live=createLiveTalaReview(model,{variant:graphic?'graphic':v3?'v3':'design02'});window.talaLive=live;scene.add(live.rig.g);rigHelpers=[model,live.rig.g].map(root=>{const h=new T.SkeletonHelper(root);h.material.depthTest=false;h.material.transparent=true;h.material.opacity=.8;h.renderOrder=20;h.visible=false;scene.add(h);return h;});let vertices=0,meshes=0;
 model.traverse(n=>{if(n.isMesh){meshes++;vertices+=n.geometry.attributes.position.count;n.frustumCulled=false;}});
 $('#source').disabled=false;$('#clip').disabled=false;chooseSource();$('#stats').textContent=`${meshes} meshes · ${vertices.toLocaleString()} exported vertices`;
 window.talaStudy=()=>{const root=activeModel(),bounds=new T.Box3();root.updateMatrixWorld(true);root.traverseVisible(n=>{if(n.isMesh){if(n.isSkinnedMesh){n.skeleton.update();n.computeBoundingBox();bounds.union(n.boundingBox.clone().applyMatrix4(n.matrixWorld));}else{n.geometry.computeBoundingBox();bounds.union(n.geometry.boundingBox.clone().applyMatrix4(n.matrixWorld));}}});return {gait:locomotionSource(),source:$('#source').value,clip:$('#clip').value,time:elapsed,clips:activeClips().map(c=>({name:c.name,duration:c.duration})),meshes,vertices,bounds:bounds.min.toArray(),root:root.position.toArray(),head:live.rig.head.rotation.toArray().slice(0,3)};};
}catch(e){$('#error').textContent=e.message;$('#status').textContent='Model failed to load';console.error(e);}
$('#face').onclick=()=>{yaw=0;pitch=0;focusY=2.45;distance=1.35;};
$('#hands').onclick=()=>{yaw=-.35;pitch=.05;focusY=1.85;distance=2.5;};
const clock=new T.Clock();renderer.setAnimationLoop(()=>{
 const dt=Math.min(.05,clock.getDelta());
 if(live&&!paused){const end=+$('#time').max;let next=elapsed+dt*+$('#speed').value;if(next>end)next%=end;poseAt(next);$('#time').value=elapsed;}
 const root=live&&isLive()?live.rig.g.position:new T.Vector3(),angle=yaw+(live&&isLive()?live.rig.g.rotation.y:0);
 camera.position.set(root.x+Math.sin(angle)*distance,root.y+focusY+Math.sin(pitch)*distance,root.z+Math.cos(angle)*distance);camera.lookAt(root.x,root.y+focusY,root.z);renderer.render(scene,camera);
});
