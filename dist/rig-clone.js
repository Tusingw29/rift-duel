import {Skeleton} from './vendor/three.module.js';
// Object3D.clone shares a SkinnedMesh skeleton. Rebind it to the cloned bones
// so a frozen afterimage or offset echo cannot follow the live fighter's bones.
export function cloneRig(root){
 const clone=root.clone(true),originals=[],copies=[],map=new Map(),skeletons=new Map();
 root.traverse(n=>originals.push(n));clone.traverse(n=>copies.push(n));
 originals.forEach((n,i)=>map.set(n,copies[i]));
 originals.forEach((n,i)=>{if(!n.isSkinnedMesh)return;
  let skeleton=skeletons.get(n.skeleton);
  if(!skeleton){skeleton=new Skeleton(n.skeleton.bones.map(b=>map.get(b)),n.skeleton.boneInverses.map(m=>m.clone()));skeletons.set(n.skeleton,skeleton);}
  copies[i].skeleton=skeleton;copies[i].bindMatrix.copy(n.bindMatrix);copies[i].bindMatrixInverse.copy(n.bindMatrixInverse);
 });
 return clone;
}
export function disposeSkeletons(root){const seen=new Set();root.traverse(n=>{if(n.skeleton&&!seen.has(n.skeleton)){seen.add(n.skeleton);n.skeleton.dispose();}});}
