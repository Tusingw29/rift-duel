import * as T from './vendor/three.module.js';
import {GLTFLoader} from './vendor/GLTFLoader.js';
const $=s=>document.querySelector(s),host=$('#view');
const renderer=new T.WebGLRenderer({antialias:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));host.prepend(renderer.domElement);renderer.outputColorSpace=T.SRGBColorSpace;
const scene=new T.Scene();scene.background=new T.Color('#323b49');
const camera=new T.PerspectiveCamera(38,1,.01,100);let yaw=.35,pitch=.12,distance=5.3;
scene.add(new T.HemisphereLight('#fff3db','#4b586b',1.25));const sun=new T.DirectionalLight('#fff0d3',1.8);sun.position.set(3,5,4);scene.add(sun);
const floor=new T.Mesh(new T.CircleGeometry(2.5,64),new T.MeshLambertMaterial({color:'#444951'}));floor.rotation.x=-Math.PI/2;floor.position.y=-.025;scene.add(floor);
const grid=new T.GridHelper(5,10,'#747674','#555b60');grid.position.y=-.023;scene.add(grid);
let mixer,model,action,clips=[],paused=false,drag=null;
function resize(){renderer.setSize(host.clientWidth,host.clientHeight);camera.aspect=host.clientWidth/host.clientHeight;camera.updateProjectionMatrix();}new ResizeObserver(resize).observe(host);
function choose(){mixer.stopAllAction();action=mixer.clipAction(clips[$('#clip').selectedIndex]);action.reset().play();$('#time').max=action.getClip().duration;$('#time').value=0;}
$('#clip').onchange=choose;$('#play').onclick=()=>{paused=!paused;$('#play').textContent=paused?'Play':'Pause';};$('#reset').onclick=()=>{if(action){action.time=0;mixer.update(0);}};
$('#time').oninput=()=>{if(action){paused=true;$('#play').textContent='Play';action.time=+$('#time').value;mixer.update(0);}};
$('#wire').onchange=()=>model?.traverse(n=>{if(n.isMesh)for(const m of [].concat(n.material))m.wireframe=$('#wire').checked;});
for(const b of document.querySelectorAll('[data-angle]'))b.onclick=()=>{yaw=+b.dataset.angle;pitch=.12;};
renderer.domElement.onpointerdown=e=>{drag=[e.clientX,e.clientY];renderer.domElement.setPointerCapture(e.pointerId);};renderer.domElement.onpointerup=()=>drag=null;
renderer.domElement.onpointermove=e=>{if(drag){yaw-=(e.clientX-drag[0])*.008;pitch=Math.max(-.4,Math.min(.8,pitch+(e.clientY-drag[1])*.006));drag=[e.clientX,e.clientY];}};
renderer.domElement.addEventListener('wheel',e=>{e.preventDefault();distance=Math.max(2.2,Math.min(9,distance+e.deltaY*.004));},{passive:false});
try{const gltf=await new GLTFLoader().loadAsync('./assets/models/tala-study.glb?v=3');model=gltf.scene;scene.add(model);clips=gltf.animations;mixer=new T.AnimationMixer(model);let vertices=0,meshes=0;model.traverse(n=>{if(n.isMesh){meshes++;vertices+=n.geometry.attributes.position.count;n.frustumCulled=false;}});for(const c of clips){const o=document.createElement('option');o.textContent=c.name;$('#clip').append(o);}$('#clip').disabled=false;$('#clip').selectedIndex=clips.findIndex(c=>c.name==='Idle');choose();$('#stats').textContent=`${meshes} meshes · ${vertices.toLocaleString()} exported vertices · ${clips.length} clips`;$('#status').textContent='Blender GLB loaded · drag to inspect';window.talaStudy=()=>{model.updateMatrixWorld(true);model.traverse(n=>{if(n.isSkinnedMesh){n.skeleton.update();n.computeBoundingBox();}});return {clip:action.getClip().name,time:action.time,clips:clips.map(c=>({name:c.name,duration:c.duration})),meshes,vertices,bounds:new T.Box3().setFromObject(model).min.toArray()};};}catch(e){$('#error').textContent=e.message;$('#status').textContent='Model failed to load';console.error(e);}
const clock=new T.Clock();renderer.setAnimationLoop(()=>{const dt=Math.min(.05,clock.getDelta());if(mixer&&!paused){mixer.update(dt*+$('#speed').value);$('#time').value=action.time;}camera.position.set(Math.sin(yaw)*distance,1.35+Math.sin(pitch)*distance,Math.cos(yaw)*distance);camera.lookAt(0,1.35,0);renderer.render(scene,camera);});
