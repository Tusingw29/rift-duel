import * as T from './vendor/three.module.js';
// Lazy geometry cache. No loader, GLBs or PNGs are requested by the default path.
const assets=new Map(),masks=new Map();let loaderPromise;
export const blenderAssetName=(kind,id)=>kind==='signature'?(id===4?'sol-shell':id===5?'vesper-shell':null):kind==='capture'?'capture-collar':kind==='burst'?'release-burst':null;
export const blenderVfxStatus=()=>({assets:Object.fromEntries([...assets].map(([k,v])=>[k,v.status])),masks:Object.fromEntries([...masks].map(([k,v])=>[k,v.status]))});
function request(name){
 if(assets.has(name)||typeof document==='undefined')return;
 const entry={status:'loading'};assets.set(name,entry);
 loaderPromise??=import('./vendor/GLTFLoader.js').then(({GLTFLoader})=>new GLTFLoader());
 loaderPromise.then(loader=>loader.loadAsync(new URL(`./assets/vfx/blender/${name}.glb`,import.meta.url).href)).then(gltf=>{entry.scene=gltf.scene;entry.status='ready';document.dispatchEvent(new Event('vfx-assets-ready'));}).catch(error=>{entry.status='error';console.warn('VFX asset fallback:',name,error.message);});
}
function requestMask(name){
 if(!masks.has(name)&&typeof document!=='undefined'){
  const e={status:'loading'};masks.set(name,e);new T.TextureLoader().load(new URL(`./assets/vfx/blender/${name}.png`,import.meta.url).href,t=>{t.wrapS=t.wrapT=T.RepeatWrapping;t.colorSpace=T.NoColorSpace;e.texture=t;e.status='ready';document.dispatchEvent(new Event('vfx-assets-ready'));},undefined,()=>{e.status='error';});
 }
 return masks.get(name)?.texture;
}
export function createBlenderVfx(kind,id,color,makeSurface){
 const name=blenderAssetName(kind,id);if(!name)return null;request(name);
 const g=new T.Group();g.name=`blender-${name}`;g.userData.loaded=false;
 g.userData.sync=()=>{
  const entry=assets.get(name);if(!g.userData.loaded&&entry?.status==='ready'){
   entry.scene.updateMatrixWorld(true);
   entry.scene.traverse(source=>{if(!source.isMesh)return;
    const core=source.material.name==='core',material=core?new T.MeshBasicMaterial({color,transparent:true,opacity:.8,depthWrite:false,toneMapped:false}):makeSurface(color,.65);
    material.userData.energyRole=core?'core':'body';if(!core){material.blending=T.NormalBlending;material.uniforms.uWhiten.value=.12;}
    // Own geometry per instance: pool/workbench disposal cannot invalidate cache.
    const mesh=new T.Mesh(source.geometry.clone().applyMatrix4(source.matrixWorld),material);mesh.name=source.name;g.add(mesh);
   });g.userData.loaded=true;g.userData.source=name;
  }
  const noise=requestMask('wisps'),detail=requestMask(kind==='capture'?'cracks':'sparks');
  if(g.userData.loaded)g.traverse(n=>{if(n.material?.uniforms){if(noise)n.material.uniforms.uNoise.value=noise;if(detail)n.material.uniforms.uTrace.value=detail;}});
  return g.userData.loaded;
 };
 return g;
}
