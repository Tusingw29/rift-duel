import * as T from './vendor/three.module.js';
// Keep oblique cloth/face textures legible; retain mipmaps to avoid shimmer.
export function sharpenTextures(root,maxAnisotropy=1,quality='high'){
 const amount=quality==='low'?1:Math.max(1,Math.min(8,maxAnisotropy||1)),seen=new Set();
 root.traverse(node=>{
  for(const material of (Array.isArray(node.material)?node.material:[node.material])){
   if(!material)continue;
   for(const key of ['map','normalMap','roughnessMap','metalnessMap','aoMap']){
    const texture=material[key];if(!texture||seen.has(texture))continue;seen.add(texture);
    if(texture.anisotropy!==amount){texture.anisotropy=amount;texture.needsUpdate=true;}
   }
  }
 });
 return seen.size;
}
// Rendering quality pass toward the early-2000s 3D fighter look: image-based
// environment lighting, a key/fill/rim rig with crisp soft shadows, and physically
// based materials with glossy skin, shiny hair and rough cloth. Pure helpers keep
// material decisions testable without WebGL.
export const PROFILES={
 skin:{roughness:.46,metalness:0,envMapIntensity:.55,clearcoat:.18,clearcoatRoughness:.5},
 face:{roughness:.5,metalness:0,envMapIntensity:.4,clearcoat:.12,clearcoatRoughness:.5},
 hair:{roughness:.38,metalness:.05,envMapIntensity:.9},
 cloth:{roughness:.82,metalness:0,envMapIntensity:.28},
 wrap:{roughness:.9,metalness:0,envMapIntensity:.2},
 leather:{roughness:.6,metalness:.05,envMapIntensity:.45},
 metal:{roughness:.42,metalness:.65,envMapIntensity:1},
 ground:{roughness:.9,metalness:0,envMapIntensity:.12},
 arena:{roughness:.7,metalness:.08,envMapIntensity:.35}
};
const keywords=[['face','face'],['skin','skin'],['hair','hair'],['pony','hair'],['wrap','wrap'],['sole','leather'],['shoe','leather'],['boot','leather'],['glove','leather'],['steel','metal'],['armor','metal'],['brass','metal'],['gold','metal'],['blade','metal'],['shell','metal'],['ground','ground'],['floor','ground'],['stone','ground']];
// Classifies a material by its name or the mesh name it is attached to.
export function profileFor(materialName='',meshName='',fallback='cloth'){
 const text=`${materialName} ${meshName}`.toLowerCase();
 for(const [key,profile] of keywords)if(text.includes(key))return profile;
 return fallback;
}
export function tuneMaterial(material,profileName){
 const p=PROFILES[profileName]||PROFILES.cloth;
 material.roughness=p.roughness;material.metalness=p.metalness;material.envMapIntensity=p.envMapIntensity;
 if(material.isMeshPhysicalMaterial){material.clearcoat=p.clearcoat||0;material.clearcoatRoughness=p.clearcoatRoughness||.5;}
 material.userData.shadingProfile=profileName;material.needsUpdate=true;return material;
}
// Replaces Lambert materials with physically based ones and retunes existing
// standard materials. Basic (glow) materials and anything already upgraded are left alone.
export function upgradeMaterials(root,fallback='cloth'){
 const seen=new Map();let count=0;
 root.traverse(node=>{
  if(!node.isMesh||!node.material||node.material.isMeshBasicMaterial||node.material.isShaderMaterial||node.material.isPointsMaterial||node.material.isLineBasicMaterial)return;
  const original=node.material;
  if(original.userData?.shadingProfile)return;
  let replacement=seen.get(original);
  if(!replacement){
   const profile=profileFor(original.name,node.name,fallback);
   const needsPhysical=['skin','face'].includes(profile);
   if(original.isMeshStandardMaterial&&!needsPhysical)replacement=original;
   else{
    const Material=needsPhysical?T.MeshPhysicalMaterial:T.MeshStandardMaterial;
    replacement=new Material({color:original.color?.clone()||new T.Color('#ffffff'),map:original.map||null,vertexColors:!!original.vertexColors,transparent:!!original.transparent,opacity:original.opacity??1,alphaTest:original.alphaTest||0,side:original.side??T.FrontSide,flatShading:!!original.flatShading,depthWrite:original.depthWrite??true,emissive:original.emissive?.clone?.()||new T.Color(0),emissiveMap:original.emissiveMap||null});
    replacement.name=original.name;
    if(original.isMeshStandardMaterial)original.dispose();
   }
   tuneMaterial(replacement,profile);seen.set(original,replacement);
  }
  node.material=replacement;count++;
 });
 return count;
}
export function createLighting(scene){
 const hemisphere=new T.HemisphereLight('#cfe4ea','#4a3b2f',.95);scene.add(hemisphere);
 const sun=new T.DirectionalLight('#fff1d6',3.9);sun.position.set(-7,14,9);sun.castShadow=true;sun.shadow.mapSize.set(2048,2048);
 sun.shadow.camera.left=-14;sun.shadow.camera.right=14;sun.shadow.camera.top=14;sun.shadow.camera.bottom=-14;sun.shadow.camera.near=1;sun.shadow.camera.far=60;sun.shadow.bias=-.0004;sun.shadow.normalBias=.03;sun.shadow.radius=3;scene.add(sun);
 const rim=new T.DirectionalLight('#9fd8ff',2.2);rim.position.set(6,8,-10);scene.add(rim);
 const fill=new T.DirectionalLight('#ffd9c2',.9);fill.position.set(9,5,8);scene.add(fill);
 return {hemisphere,sun,rim,fill};
}
// A small emissive studio, prefiltered into a PMREM so skin, hair and metal pick up
// reflections and ambient colour. Rebuilt per arena with that stage's sky and ground.
export function createEnvironment(renderer,skyHex='#8fb8d8',groundHex='#6b5a46',keyHex='#fff2d0'){
 if(!renderer?.capabilities)return null;
 const env=new T.Scene();
 const sky=new T.Mesh(new T.SphereGeometry(40,24,16),new T.MeshBasicMaterial({color:skyHex,side:T.BackSide}));env.add(sky);
 const ground=new T.Mesh(new T.CircleGeometry(40,24),new T.MeshBasicMaterial({color:groundHex}));ground.rotation.x=-Math.PI/2;ground.position.y=-6;env.add(ground);
 const panel=(w,h,color,x,y,z,intensity)=>{const m=new T.Mesh(new T.PlaneGeometry(w,h),new T.MeshBasicMaterial({color:new T.Color(color).multiplyScalar(intensity)}));m.position.set(x,y,z);m.lookAt(0,0,0);env.add(m);};
 panel(14,10,keyHex,-14,18,14,6);panel(10,16,'#bfe3ff',16,8,-14,2.2);panel(18,6,'#ffe9d4',12,4,16,1.2);panel(30,8,'#ffffff',0,26,0,1.6);
 const pmrem=new T.PMREMGenerator(renderer);const texture=pmrem.fromScene(env,.04).texture;pmrem.dispose();
 env.traverse(o=>{o.geometry?.dispose();o.material?.dispose?.();});
 return texture;
}
