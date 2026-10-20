import * as T from './vendor/three.module.js';
import {fighters} from './fighters.js';
export function createBurstEffects(scene){
 const group=new T.Group();scene.add(group);
 const energy=new T.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.65,depthWrite:false});
 const make=(geometry,material=energy,parent=group)=>{const mesh=new T.Mesh(geometry,material);parent.add(mesh);return mesh;};
 const beam=make(new T.CylinderGeometry(.32,.8,10,10));
 const orb=make(new T.IcosahedronGeometry(1,2));
 const rings=Array.from({length:4},()=>make(new T.TorusGeometry(1,.035,5,48)));
 const slashes=Array.from({length:3},()=>make(new T.TorusGeometry(1,.07,5,32,Math.PI*1.35)));
 const missiles=Array.from({length:6},()=>make(new T.ConeGeometry(.12,.55,5)));
 const emitter=new T.Group();group.add(emitter);
 const casing=new T.MeshStandardMaterial({color:'#364850',metalness:.7,roughness:.35,flatShading:true});
 make(new T.OctahedronGeometry(.6),casing,emitter);
 const core=make(new T.IcosahedronGeometry(.22,1),energy,emitter);core.position.y=-.45;
 for(let i=0;i<3;i++){const fin=make(new T.BoxGeometry(.35,.12,1.5),casing,emitter);const angle=i*Math.PI*2/3;fin.position.set(Math.sin(angle)*.8,0,Math.cos(angle)*.8);fin.rotation.y=angle;}
 const echoes=[];let source=null;
 function reset(){for(const echo of echoes){scene.remove(echo.g);for(const material of echo.materials)material.dispose();}echoes.length=0;source=null;group.visible=false;}
 function prepareEchoes(model){
  source=model;
  const originals=[];model.g.traverse(node=>originals.push(node));
  for(let j=0;j<3;j++){
   const g=model.g.clone(true),copies=[],materials=new Map();g.traverse(node=>{copies.push(node);if(node.isMesh){node.castShadow=false;node.receiveShadow=false;if(!materials.has(node.material)){const mat=node.material.clone();mat.transparent=true;mat.depthWrite=false;materials.set(node.material,mat);}node.material=materials.get(node.material);}});
   scene.add(g);echoes.push({g,pairs:copies.map((node,i)=>[node,originals[i]]),materials:[...materials.values()]});
  }
 }
 function update(pose,model,reduced=false){
  if(!pose){if(source)reset();group.visible=false;return;}
  group.visible=true;
  const e=pose.effects,color=fighters[model.id].color;energy.color.set(color);
  energy.opacity=reduced?.4:.65;
  for(const mesh of [beam,orb,emitter,...rings,...slashes,...missiles])mesh.visible=false;
  if(e.emitter){emitter.visible=true;emitter.position.set(e.emitter.x,e.emitter.y,e.emitter.z);emitter.rotation.y=e.t*2;}
  if(e.beam>.01){beam.visible=true;beam.position.set(e.center.x,5,e.center.z);beam.scale.set(e.beam,1,e.beam);}
  if(e.orb?.radius>.01){orb.visible=true;orb.position.set(e.orb.position.x,e.orb.position.y,e.orb.position.z);orb.scale.setScalar(e.orb.radius);orb.rotation.set(e.t*4,e.t*6,0);}
  if(e.rings>.01){
   const pool=e.kind==='rei'?slashes:rings;
   pool.forEach((ring,i)=>{
    ring.visible=true;ring.position.set(e.center.x,e.center.y,e.center.z);
    if(e.kind==='sol'||e.kind==='morrow'||e.kind==='aegis'){ring.rotation.set(Math.PI/2,0,0);ring.position.y=.12+i*.14;ring.scale.setScalar(.6+e.rings*(1.4+i*.4));}
    else{ring.rotation.set(e.kind==='rei'?i*.8:Math.PI/2+i*.6,e.t*3+i,e.t*2+i);ring.scale.setScalar((e.kind==='vesper'?2.2-e.t*1.2:1.4)+i*.17);}
   });
  }
  e.rays.forEach((ray,i)=>{const missile=missiles[i];missile.visible=ray.visible;missile.position.set(ray.position.x,ray.position.y,ray.position.z);const direction=new T.Vector3(e.center.x-ray.position.x,e.center.y-ray.position.y,e.center.z-ray.position.z).normalize();missile.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),direction);});
  if(e.echoes.length&&source!==model){if(source)reset();prepareEchoes(model);group.visible=true;}
  echoes.forEach((echo,i)=>{const state=e.echoes[i];echo.g.visible=!!state&&state.opacity>.01;if(!state)return;for(const [copy,original] of echo.pairs.slice(1)){copy.position.copy(original.position);copy.quaternion.copy(original.quaternion);copy.scale.copy(original.scale);}echo.g.position.set(state.x,state.y,state.z);echo.g.rotation.set(0,state.yaw,0);echo.g.scale.setScalar(1);for(const material of echo.materials){material.opacity=state.opacity;material.color?.set(color);}});
 }
 return {update,reset};
}
