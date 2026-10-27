import * as T from './vendor/three.module.js';
import {createInkBeam,createInkRing,createInkFlame,createEnergyBurst} from './ink-energy.js';
import {createSignature,createChiCoil,createShockwave,energyStyles,energyStyle} from './energy-style.js';
import {DEFAULT_VFX,CRISP_VFX,REFINED_VFX,VFX_LIMITS,STORAGE_KEY,validateVfx,setVfxSettings} from './vfx-settings.js';
const $=id=>document.getElementById(id),copy=x=>JSON.parse(JSON.stringify(x));
let draft=copy(DEFAULT_VFX),frame=30,playing=true,last=0,accumulator=0,yaw=.8,pitch=.3,distance=6,drag=null;
const status=(message,error=false)=>{$('status').textContent=message;$('status').classList.toggle('error',error);};
try{const saved=localStorage.getItem(STORAGE_KEY);if(saved)draft=validateVfx(JSON.parse(saved));}catch(e){status(e.message,true);}
if(new URLSearchParams(location.search).get('look')==='flow')draft=copy(REFINED_VFX);
const views=['baseline','draft'].map(id=>{
 const canvas=$(id),renderer=new T.WebGLRenderer({canvas,antialias:true,preserveDrawingBuffer:true});renderer.setPixelRatio(Math.min(devicePixelRatio,1.5));renderer.outputColorSpace=T.SRGBColorSpace;
 const scene=new T.Scene();scene.background=new T.Color('#1b2330');const camera=new T.PerspectiveCamera(40,1,.1,60);
 const grid=new T.GridHelper(12,12,0x4b6178,0x2e3b4c);scene.add(grid);const group=new T.Group();group.position.y=1.5;scene.add(group);
 return {renderer,scene,camera,group,asset:null,shards:[],kind:null,id:-1};
});
function dispose(group){const geometries=new Set(),materials=new Set();group.traverse(o=>{if(o.geometry)geometries.add(o.geometry);if(o.material)materials.add(o.material);o.userData.geometryBanks?.flat().forEach(g=>geometries.add(g));});geometries.forEach(g=>g.dispose());materials.forEach(m=>m.dispose());group.clear();}
function build(v,config){
 const kind=$('asset').value,id=+$('fighter').value;setVfxSettings(config);
 const paletteKey=kind==='impact'?JSON.stringify(config.palettes[id]||null):'';
 if(v.kind===kind&&v.id===id&&v.paletteKey===paletteKey)return;v.paletteKey=paletteKey;
 dispose(v.group);v.kind=kind;v.id=id;
 v.asset=kind==='burst'?createEnergyBurst(energyStyles[id].color):kind==='beam'?createInkBeam():kind==='capture'?createInkRing(energyStyles[id].color):kind==='charge'?new T.Group():kind==='impact'?createShockwave(id):createSignature(id);
 if(kind==='charge'){const coil=createChiCoil(),flame=createInkFlame();coil.scale.setScalar(2);flame.position.set(.25,-.7,0);v.asset.add(coil,flame);v.asset.userData.updateInk=(t)=>v.asset.children.forEach(o=>o.userData.updateInk(t,false));}
 v.group.add(v.asset);v.shards=Array.from({length:8},(_,i)=>{const s=createSignature(id);s.userData.index=i;v.group.add(s);return s;});
}
// Absolute frame evaluation: scrubbing and reverse seeks do not depend on RAF history.
function render(){
 const kind=$('asset').value;
 document.querySelector('.view h2').textContent=$('compareFlow').checked?'PREVIOUS FLOW':'LIVE DEFAULT';
 for(const key of Object.keys(VFX_LIMITS))if($(key))$(key).disabled=!!draft.flowEnergy&&!['flowEnergy','blenderAssets','beamWidth'].includes(key);
 views.forEach((v,i)=>{
  const config=i?draft:($('compareFlow').checked?{...REFINED_VFX,blenderAssets:0}:DEFAULT_VFX);build(v,config);setVfxSettings(config);
  const a=v.asset,t=frame/60,release=frame>=18,breakup=frame>=48,clear=frame>=66;
  a.visible=!breakup;a.position.set(0,0,0);a.rotation.set(0,0,0);a.scale.setScalar(1);
  const gather=.12+.88*Math.min(1,frame/18);
  if(kind==='beam'){a.children[0].material.color.set(energyStyle(0).color);a.rotation.y=Math.PI/2;a.position.x=release?1.3:-.5;a.scale.setScalar(release?1:gather*.45);}
  if(kind==='capture'){a.children[1].material.color.set(energyStyle(v.id).color);a.rotation.x=.25;a.scale.setScalar(release?1:gather);}
  if(kind==='signature'){a.rotation.z=-Math.PI/2;a.scale.setScalar(release?1:gather);}
  if(kind==='charge')a.scale.setScalar(gather);
  if(kind==='impact'){a.position.y=-1.46;a.visible=frame>=18&&frame<30;a.userData.updateInk(Math.max(0,frame-18));}
  else a.userData.updateInk?.(t,false,1);
  v.shards.forEach((s,j)=>{
   s.visible=breakup&&!clear;if(!s.visible)return;
   const age=Math.floor((frame-48)/3),angle=j*Math.PI/4,r=.35+age*.2;
   s.position.set(Math.cos(angle)*r,Math.sin(angle)*r,Math.sin(j*2)*r*.6);
   if(kind==='beam')s.position.x+=1.3;
   s.rotation.set(j*.4,age*.2,j);s.scale.setScalar(.24*(1-age/6));s.userData.updateInk(t,false,1);
  });
  const colors=[];if($('silhouette').checked)v.group.traverse(o=>{if(o.material){colors.push([o.material,o.material.color.clone(),o.material.blending]);if(o.material.uniforms?.uSilhouette){o.material.uniforms.uSilhouette.value=1;o.material.blending=T.NormalBlending;}o.material.color.set('#10141e');}});
  const canvas=v.renderer.domElement,w=canvas.clientWidth,h=canvas.clientHeight;if(canvas.width!==Math.round(w*v.renderer.getPixelRatio())||canvas.height!==Math.round(h*v.renderer.getPixelRatio()))v.renderer.setSize(w,h,false);
  v.camera.aspect=w/h;v.camera.updateProjectionMatrix();v.camera.position.set(Math.sin(yaw)*Math.cos(pitch)*distance,1.2+Math.sin(pitch)*distance,Math.cos(yaw)*Math.cos(pitch)*distance);v.camera.lookAt(0,1.2,0);v.renderer.render(v.scene,v.camera);colors.forEach(([m,c,b])=>{m.color.copy(c);m.blending=b;if(m.uniforms?.uSilhouette)m.uniforms.uSilhouette.value=0;});
 });
 setVfxSettings(draft);$('timeline').value=frame;$('frame').textContent=`Frame ${frame} / 89 · ${frame<18?'gather':frame<48?'release':frame<66?'breakup':'clear'}`;
}
const labels={blenderAssets:'Blender pieces',flowEnergy:'Flowing 3D finish',cadence:'Drawing cadence',beamWidth:'Beam width',inkWidth:'Beam ink',coreWidth:'Beam white channels',ribWidth:'Beam ribs',signatureDepth:'Signature depth',signatureCore:'Signature core',signatureInk:'Signature ink'};
for(const [key,[min,max]] of Object.entries(VFX_LIMITS)){
 const label=document.createElement('label');label.textContent=labels[key];const input=document.createElement('input');input.type='range';input.id=key;input.min=min;input.max=max;input.step=['cadence','flowEnergy','blenderAssets'].includes(key)?1:.01;const output=document.createElement('output');output.htmlFor=key;label.append(input,output);$('sliders').append(label);
 input.oninput=()=>{draft=validateVfx({...draft,[key]:+input.value});output.value=input.value;if(key==='flowEnergy')shapeUI();render();};
}
[...$('fighter').options].forEach((o,i)=>o.value=i);
function shapeUI(){
 $('shape').style.pointerEvents=draft.flowEnergy?'none':'auto';$('shape').style.opacity=draft.flowEnergy?'.45':'1';
 const id=+$('fighter').value,points=draft.shapes[id]||energyStyles[id].points,svg=$('shape');svg.replaceChildren();
 const node=(tag,attrs)=>{const n=document.createElementNS('http://www.w3.org/2000/svg',tag);for(const [k,v]of Object.entries(attrs))n.setAttribute(k,v);svg.append(n);return n;};
 node('path',{d:'M150 0V300M0 150H300',stroke:'#354457'});
 node('polygon',{points:points.map(([x,y])=>`${150+x*90},${150-y*90}`).join(' '),fill:(draft.palettes[id]||energyStyles[id]).color||energyStyles[id].color,stroke:'#050a12','stroke-width':4});
 points.forEach(([x,y],index)=>{const c=node('circle',{cx:150+x*90,cy:150-y*90,r:6,'data-index':index});c.onpointerdown=e=>{e.preventDefault();drag={id,index,points:copy(points),pointer:e.pointerId};svg.setPointerCapture(e.pointerId);};});
 $('palette').replaceChildren();for(const role of ['color','ink','core']){const l=document.createElement('label');l.textContent=role;const input=document.createElement('input');input.type='color';input.disabled=!!draft.flowEnergy&&role!=='color';input.value=draft.palettes[id]?.[role]||energyStyles[id][role];input.oninput=()=>{draft=validateVfx({...draft,palettes:{...draft.palettes,[id]:{...draft.palettes[id],[role]:input.value}}});shapeUI();render();};l.append(input);$('palette').append(l);}
}
$('shape').onpointermove=e=>{if(!drag)return;const p=new DOMPoint(e.clientX,e.clientY).matrixTransform($('shape').getScreenCTM().inverse()),points=copy(drag.points);points[drag.index]=[Math.max(-1.5,Math.min(1.5,(p.x-150)/90)),Math.max(-1.5,Math.min(1.5,(150-p.y)/90))];try{draft=validateVfx({...draft,shapes:{...draft.shapes,[drag.id]:points}});shapeUI();render();status('Silhouette changed. Save to preview it in the fight.');}catch(error){status(error.message,true);}};
$('shape').onpointerup=$('shape').onpointercancel=()=>drag=null;
function sync(){for(const key of Object.keys(VFX_LIMITS)){$(key).value=draft[key];$(key).nextElementSibling.value=draft[key];}shapeUI();render();}
$('compareFlow').onchange=render;
$('fighter').onchange=()=>{shapeUI();render();};$('asset').onchange=render;$('silhouette').onchange=render;
$('camera').onchange=()=>{yaw={three:.8,side:0,back:Math.PI/2}[$('camera').value];pitch=$('camera').value==='three'?.3:.06;render();};
views.forEach(v=>{const c=v.renderer.domElement;let orbit=null;c.onpointerdown=e=>{orbit={x:e.clientX,y:e.clientY};c.setPointerCapture(e.pointerId);};c.onpointermove=e=>{if(!orbit)return;yaw-=(e.clientX-orbit.x)*.008;pitch=Math.max(-.4,Math.min(1.2,pitch+(e.clientY-orbit.y)*.008));orbit={x:e.clientX,y:e.clientY};render();};c.onpointerup=c.onpointercancel=()=>orbit=null;c.addEventListener('wheel',e=>{e.preventDefault();distance=Math.max(3,Math.min(12,distance+e.deltaY*.005));render();},{passive:false});});
function pause(){playing=false;$('play').textContent='Play';accumulator=0;}
function seek(f){pause();frame=Math.max(0,Math.min(89,Math.round(f)));render();}
$('play').onclick=()=>{playing=!playing;last=0;$('play').textContent=playing?'Pause':'Play';};$('previous').onclick=()=>seek(frame-1);$('next').onclick=()=>seek(frame+1);$('timeline').oninput=e=>seek(+e.target.value);
$('refined').onclick=()=>{draft=copy(REFINED_VFX);sync();status('Flowing 3D candidate loaded: curved volumes, textured motion and fine filaments.');};
$('crisp').onclick=()=>{draft=copy(CRISP_VFX);sync();status('Crisp-stroke candidate loaded. Compare release and rear views before saving.');};$('reset').onclick=()=>{draft=copy(DEFAULT_VFX);sync();status('Draft reset to production defaults. Save to replace the stored preview.');};
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(draft));status('Saved locally. New fight/sandbox tabs will read this draft; reload existing preview tabs.');return true;}catch(e){status(`Cannot save: ${e.message}`,true);return false;}}
$('save').onclick=save;for(const id of ['fight','sandbox'])$(id).onclick=e=>{if(!save())e.preventDefault();};
function download(blob,name){const url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=name;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);}
$('export').onclick=()=>download(new Blob([JSON.stringify(draft,null,2)],{type:'application/json'}),'rift-vfx-preset.json');$('import').onclick=()=>$('file').click();$('file').onchange=async()=>{try{const file=$('file').files[0];if(!file)return;if(file.size>32768)throw new Error('Preset is too large (32 KB maximum).');draft=validateVfx(JSON.parse(await file.text()));sync();status('Imported draft. Save to preview in gameplay.');}catch(e){status(e.message,true);}finally{$('file').value='';}};
$('capture').onclick=()=>{render();const canvas=document.createElement('canvas'),[a,b]=views.map(v=>v.renderer.domElement);canvas.width=a.width+b.width;canvas.height=Math.max(a.height,b.height)+44;const ctx=canvas.getContext('2d');ctx.fillStyle='#10141e';ctx.fillRect(0,0,canvas.width,canvas.height);ctx.drawImage(a,0,44);ctx.drawImage(b,a.width,44);ctx.fillStyle='white';ctx.font='18px sans-serif';ctx.fillText(`LIVE DEFAULT · ${$('asset').value} · frame ${frame}`,16,28);ctx.fillText('EDITABLE DRAFT',a.width+16,28);canvas.toBlob(blob=>download(blob,`rift-vfx-${$('asset').value}-f${frame}.png`));};
let samples=[];function tick(now){if(last){const elapsed=(now-last)/1000;samples.push(elapsed);if(samples.length>60)samples.shift();if(playing&&!document.hidden){accumulator+=Math.min(.25,elapsed)*+$('speed').value;const steps=Math.floor(accumulator*60);accumulator-=steps/60;if(steps){frame=(frame+steps)%90;render();}}}last=now;$('metrics').textContent=samples.length?`${Math.round(samples.length/samples.reduce((a,b)=>a+b,0))} UI fps`:'';requestAnimationFrame(tick);}
window.vfxWorkbench={seek,setDraft(value){draft=validateVfx(value);sync();},getDraft:()=>copy(draft),getState:()=>({frame,playing,asset:$('asset').value,fighter:+$('fighter').value}),views};
document.addEventListener('vfx-assets-ready',()=>{render();});
window.addEventListener('resize',render);document.addEventListener('visibilitychange',()=>{last=0;accumulator=0;});
sync();requestAnimationFrame(tick);
