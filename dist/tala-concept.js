import {installCombatRig} from './tala-combat-rig.js';
import {applyGraphicFlat} from './graphic-flat.js';
import {dressMorrow} from './morrow-gravebound.js';
import {costumes} from './roster-costumes.js';
import {fighters} from './fighters.js';
import {talaFootPivot,talaFootOffsets,talaGaitTargets} from './tala-footwork.js';
import {Bone,Matrix4,Skeleton,SkinnedMesh,Vector3} from './vendor/three.module.js';
const names=['root','chest','head','upper_arm.L','forearm.L','hand.L','thigh.L','shin.L','upper_arm.R','forearm.R','hand.R','thigh.R','shin.R','ponytail','sash'];
import {canonicalBone} from './rig-schema.js';
// Every loaded bone name is normalised onto the canonical 17-bone rig (dist/rig-schema.js).
const canonical=name=>canonicalBone(name)||name;
const assets=new Map();
export const talaAssetUrl=variant=>variant==='graphic'?'./assets/tala-graphic/tala-graphic.glb?v=4':variant==='v3'?'./assets/models/tala-v3.glb?v=7':variant==='design02'?'./assets/models/tala-design02.glb?v=13':'./assets/models/tala-study.glb?v=4';
export function loadTalaConcept(variant='concept'){
 const key=['design02','v3','graphic'].includes(variant)?variant:'concept';
 if(!assets.has(key))assets.set(key,import('./vendor/GLTFLoader.js').then(({GLTFLoader})=>new GLTFLoader().loadAsync(talaAssetUrl(key))).catch(error=>{assets.delete(key);throw error;}));
 return assets.get(key);
}
// Keep the combat skeleton, hand anchors and state machine. Only exchange surfaces.
export function attachTalaConcept(r,source){
 if(r.id!==2||r.conceptModel)return false;
 const mapped=new Map(names.map((name,i)=>[name,r.skeleton.bones[i]]));
 const rigSpec=source.userData?.rigSpec,expanded=source.userData?.combatRig===1||!!rigSpec;
 const surfaces=[];source.traverse(n=>{if(n.isSkinnedMesh)surfaces.push(n);});
 if(!surfaces.length)throw new Error('Concept asset has no skinned surfaces');
 for(const n of surfaces)for(const b of n.skeleton.bones)if(!expanded&&!mapped.has(canonical(b.name))&&!['foot.L','foot.R'].includes(canonical(b.name)))throw new Error(`Unsupported concept joint: ${b.name}`);
 for(const suffix of ['L','R']){const foot=new Bone();foot.name='concept-foot.'+suffix;foot.position.set(0,-(r.shinLength||.56),0);mapped.get('shin.'+suffix).add(foot);mapped.set('foot.'+suffix,foot);}
 if(rigSpec)installCombatRig(r,mapped,rigSpec,{restFist:!!source.userData.restFist});else if(expanded)installCombatRig(r,mapped);
 r.feet=['L','R'].map(s=>mapped.get('foot.'+s));r.footPivot=talaFootPivot;r.footOffsets=talaFootOffsets;r.gaitTargets=talaGaitTargets;r.strideLength=.75;r.footBall=new Vector3(0,-.109,.22);
 const skeletons=new Map(),replacement=[];
 for(const original of surfaces){
  let skeleton=skeletons.get(original.skeleton);
  if(!skeleton){skeleton=new Skeleton(original.skeleton.bones.map(b=>mapped.get(expanded?b.name:canonical(b.name))),original.skeleton.boneInverses.map(m=>m.clone()));skeletons.set(original.skeleton,skeleton);}
  const material=original.material.clone();if(material.map)material.map=material.map.clone();
  const mesh=new SkinnedMesh(original.geometry.clone(),material);mesh.name='concept-'+original.name;mesh.bind(skeleton,new Matrix4());mesh.castShadow=true;mesh.frustumCulled=false;replacement.push(mesh);
 }
 // Hide only original character surfaces; keep the aura, guard and effect objects.
 for(const n of r.conceptOriginalSurfaces||[])n.visible=false;
 for(const mesh of replacement)r.g.add(mesh);
 if(source.userData?.artStyle==='graphic-flat')applyGraphicFlat(r.g);
 if(surfaces.some(n=>n.name.includes('Design02_')))r.ponytailMaxAngle=.45;
 r.conceptModel=true;r.g.userData.conceptModel=true;return true;
}
// ---- Roster models built by scripts/build-tala-threejs.mjs --fighter <id> ----------------------
// Every fighter's GLB carries the same 17-bone skeleton and, in its scene extras, the joint
// positions and leg metrics it was bound with. Attaching moves the fighter's existing combat
// bones onto those joints, so the skin binds exactly, while weapons parented to the hands and
// the aura and effect objects stay as they were.
export const fighterModelUrl=fighterId=>`./assets/models/${fighterId}-v3.glb?v=7`;
const fighterAssets=new Map();
export function loadFighterModel(fighterId){
 if(!fighterAssets.has(fighterId))fighterAssets.set(fighterId,import('./vendor/GLTFLoader.js').then(({GLTFLoader})=>new GLTFLoader().loadAsync(fighterModelUrl(fighterId))).catch(error=>{fighterAssets.delete(fighterId);throw error;}));
 return fighterAssets.get(fighterId);
}
export function attachFighterModel(r,source){
 if(r.conceptModel)return false;
 const metrics=source.userData?.metrics;if(!metrics)throw new Error('Fighter asset has no rig metrics');
 const roles=new Map([['root',r.body],['chest',r.spine],['head',r.head]]);
 ['L','R'].forEach((S,i)=>{const arm=r.limbs[i*2],leg=r.limbs[i*2+1];roles.set('upper_arm.'+S,arm);roles.set('forearm.'+S,r.elbows[i]);roles.set('hand.'+S,arm.userData.hand);roles.set('thigh.'+S,leg);roles.set('shin.'+S,r.knees[i]);});
 const glbBones={};source.traverse(n=>{if(n.isBone)glbBones[canonical(n.name)]=n;});
 for(const [name,bone] of roles){const src=glbBones[name];if(src)bone.position.copy(src.position);}
 for(const [name,parent] of [['ponytail','head'],['sash','root']]){const src=glbBones[name];if(!src)continue;const bone=new Bone();bone.name='v3-'+name;bone.position.copy(src.position);roles.get(parent).add(bone);roles.set(name,bone);}
 ['L','R'].forEach((S,i)=>{let foot=r.feet?.[i];if(!foot){foot=new Bone();foot.name='v3-foot.'+S;r.knees[i].add(foot);}foot.position.set(0,-metrics.shinLength,0);roles.set('foot.'+S,foot);});
 r.legLength=metrics.legLength;r.shinLength=metrics.shinLength;r.ankleHeight=metrics.ankleHeight;r.head.scale.setScalar(1);
 // Textured bodies built with the deformation layer carry their hierarchy in the extras.
 if(source.userData?.rigSpec)installCombatRig(r,roles,source.userData.rigSpec,{restFist:!!source.userData.restFist});
 const hands=new Set([r.limbs[0].userData.hand,r.limbs[2].userData.hand]);
 const underHand=n=>{for(let p=n;p;p=p.parent)if(hands.has(p))return true;return false;};
 const keep=new Set([r.aura,r.techniqueFX,r.techniqueRing,r.spirit].filter(Boolean));
 const kept=n=>{for(let p=n;p;p=p.parent)if(keep.has(p))return true;return false;};
 // Only meshes tagged as weapons survive under the hands; the old gauntlets and gloves go with the body.
 r.conceptOriginalSurfaces=[];r.g.traverse(n=>{if(n.isMesh&&!kept(n)&&!(underHand(n)&&n.userData.weapon)){n.visible=false;r.conceptOriginalSurfaces.push(n);}});
 const surfaces=[];source.traverse(n=>{if(n.isSkinnedMesh)surfaces.push(n);});
 if(!surfaces.length)throw new Error('Fighter asset has no skinned surfaces');
 const skeletons=new Map();
 for(const original of surfaces){
  let skeleton=skeletons.get(original.skeleton);
  if(!skeleton){const bones=original.skeleton.bones.map(b=>{const bone=roles.get(canonical(b.name));if(!bone)throw new Error(`Unsupported fighter joint: ${b.name}`);return bone;});skeleton=new Skeleton(bones,original.skeleton.boneInverses.map(m=>m.clone()));skeletons.set(original.skeleton,skeleton);}
  const material=original.material.clone();if(material.map)material.map=material.map.clone();
  const mesh=new SkinnedMesh(original.geometry.clone(),material);mesh.name='concept-'+original.name;mesh.bind(skeleton,new Matrix4());mesh.castShadow=true;mesh.frustumCulled=false;r.g.add(mesh);
 }
 if(r.id===3)dressMorrow(r,roles);
 else costumes[fighters[r.id]?.id]?.(r,roles);
 r.conceptModel=true;r.g.userData.conceptModel=true;return true;
}
