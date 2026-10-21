import {talaFootPivot,talaFootOffsets,talaGaitTargets} from './tala-footwork.js';
import {Bone,Matrix4,Skeleton,SkinnedMesh,Vector3} from './vendor/three.module.js';
const names=['root','chest','head','upper_arm.L','forearm.L','hand.L','thigh.L','shin.L','upper_arm.R','forearm.R','hand.R','thigh.R','shin.R','ponytail','sash'];
const canonical=name=>name.replace(/^(upper_arm|forearm|hand|thigh|shin|foot)([LR])$/,'$1.$2');
const assets=new Map();
export const talaAssetUrl=variant=>variant==='design02'?'./assets/models/tala-design02.glb?v=12':'./assets/models/tala-study.glb?v=4';
export function loadTalaConcept(variant='concept'){
 const key=variant==='design02'?'design02':'concept';
 if(!assets.has(key))assets.set(key,import('./vendor/GLTFLoader.js').then(({GLTFLoader})=>new GLTFLoader().loadAsync(talaAssetUrl(key))).catch(error=>{assets.delete(key);throw error;}));
 return assets.get(key);
}
// Keep the combat skeleton, hand anchors and state machine. Only exchange surfaces.
export function attachTalaConcept(r,source){
 if(r.id!==2||r.conceptModel)return false;
 const mapped=new Map(names.map((name,i)=>[name,r.skeleton.bones[i]]));
 const surfaces=[];source.traverse(n=>{if(n.isSkinnedMesh)surfaces.push(n);});
 if(!surfaces.length)throw new Error('Concept asset has no skinned surfaces');
 for(const n of surfaces)for(const b of n.skeleton.bones)if(!mapped.has(canonical(b.name))&&!['foot.L','foot.R'].includes(canonical(b.name)))throw new Error(`Unsupported concept joint: ${b.name}`);
 for(const suffix of ['L','R']){const foot=new Bone();foot.name='concept-foot.'+suffix;foot.position.set(0,-(r.shinLength||.56),0);mapped.get('shin.'+suffix).add(foot);mapped.set('foot.'+suffix,foot);}
 r.feet=['L','R'].map(s=>mapped.get('foot.'+s));r.footPivot=talaFootPivot;r.footOffsets=talaFootOffsets;r.gaitTargets=talaGaitTargets;r.strideLength=.75;r.footBall=new Vector3(0,-.109,.22);
 const skeletons=new Map(),replacement=[];
 for(const original of surfaces){
  let skeleton=skeletons.get(original.skeleton);
  if(!skeleton){skeleton=new Skeleton(original.skeleton.bones.map(b=>mapped.get(canonical(b.name))),original.skeleton.boneInverses.map(m=>m.clone()));skeletons.set(original.skeleton,skeleton);}
  const material=original.material.clone();if(material.map)material.map=material.map.clone();
  const mesh=new SkinnedMesh(original.geometry.clone(),material);mesh.name='concept-'+original.name;mesh.bind(skeleton,new Matrix4());mesh.castShadow=true;mesh.frustumCulled=false;replacement.push(mesh);
 }
 // Hide only original character surfaces; keep the aura, guard and effect objects.
 for(const n of r.conceptOriginalSurfaces||[])n.visible=false;
 for(const mesh of replacement)r.g.add(mesh);
 if(surfaces.some(n=>n.name.includes('Design02_')))r.ponytailMaxAngle=.45;
 r.conceptModel=true;r.g.userData.conceptModel=true;return true;
}
