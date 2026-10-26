import {MeshToonMaterial,Color} from './vendor/three.module.js';
// Stable two-tone form shading independent of each arena's PBR lighting.
// The normal still follows skin deformation and the character's world rotation.
export function applyGraphicFlat(root){
 const cache=new Map();let count=0;
 root.traverse(node=>{
  if(!node.isMesh||!node.material?.name?.startsWith('Graphic_'))return;
  // Material.clone copies userData but not onBeforeCompile. A runtime-only flag
  // prevents a cloned preview skin from silently losing the two-tone shader.
  const old=node.material;if(old.graphicFlatReady)return;
  let material=cache.get(old);
  if(!material){
   material=new MeshToonMaterial({color:old.color.clone(),side:old.side});
   material.name=old.name;material.toneMapped=false;material.graphicFlatReady=true;
   material.userData={...old.userData,graphicFlatApplied:true,shadingProfile:'graphic-flat'};
   material.onBeforeCompile=shader=>{
    shader.uniforms.graphicShade={value:new Color(.68,.64,.66)};
    shader.fragmentShader='uniform vec3 graphicShade;\n'+shader.fragmentShader;
    shader.fragmentShader=shader.fragmentShader.replace('#include <opaque_fragment>',`
     vec3 graphicKey = normalize(mat3(viewMatrix) * vec3(-0.6, 1.0, 0.8));
     float graphicBand = step(0.12, dot(normal, graphicKey));
     outgoingLight = diffuseColor.rgb * mix(graphicShade, vec3(1.0), graphicBand);
     #include <opaque_fragment>
    `);
   };
   material.customProgramCacheKey=()=> 'rift-graphic-flat-v1';cache.set(old,material);
  }
  node.material=material;count++;
 });return count;
}
