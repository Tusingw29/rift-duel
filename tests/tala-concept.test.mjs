import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {GLTFLoader} from '../dist/vendor/GLTFLoader.js';
import {Matrix4,Vector3} from '../dist/vendor/three.module.js';
import {buildTala} from '../dist/tala-model.js';import {attachTalaConcept} from '../dist/tala-concept.js';import {cloneRig} from '../dist/rig-clone.js';import {animateCharacter} from '../dist/animation.js';
// Load actual exported geometry/skin; skip browser-only bitmap decoding in Node.
globalThis.ProgressEvent??=class ProgressEvent{constructor(type,data){this.type=type;Object.assign(this,data);}};
const bytes=readFileSync(new URL('../dist/assets/models/tala-study.glb',import.meta.url)),len=bytes.readUInt32LE(12),json=JSON.parse(bytes.subarray(20,20+len));
json.buffers[0].uri='data:application/octet-stream;base64,'+bytes.subarray(28+len).toString('base64');delete json.images;delete json.textures;json.materials=json.materials.map(()=>({}));
const asset=await new GLTFLoader().parseAsync(JSON.stringify(json),'');
function rig(){const r=buildTala();r.conceptOriginalSurfaces=[];r.g.traverse(n=>{if(n.isMesh&&n!==r.aura)r.conceptOriginalSurfaces.push(n);});return r;}
test('actual concept asset binds to combat bones, preserves attachments and isolates instances',()=>{
 const a=rig(),b=rig(),hand=a.limbs[0].userData.hand;assert.equal(attachTalaConcept(a,asset.scene),true);attachTalaConcept(b,asset.scene);assert.equal(attachTalaConcept(a,asset.scene),false);
 assert.equal(a.limbs[0].userData.hand,hand);assert.ok(a.aura.visible);assert.ok(a.conceptOriginalSurfaces.every(n=>!n.visible));
 const surfaces=a.g.children.filter(n=>n.name.startsWith('concept-'));assert.equal(surfaces.length,11);
 for(const n of surfaces){assert.ok(n.skeleton.bones.every(Boolean));assert.ok(n.skeleton.bones.includes(hand));assert.ok(!n.skeleton.bones.includes(b.limbs[0].userData.hand));}
 const copy=cloneRig(a.g);assert.ok(copy.children.find(n=>n.name.startsWith('concept-')).skeleton.bones.every(bone=>bone!==hand));
});
test('concept surfaces follow combat pose and root travel without invalid or stretched coordinates',()=>{
 const r=rig();attachTalaConcept(r,asset.scene);const surfaces=r.g.children.filter(n=>n.name.startsWith('concept-'));const point=new Vector3(),inverse=new Matrix4();
 for(const anim of ['idle','run','guard','hurt','jump','defeat']){
  for(let frame=0;frame<12;frame++){animateCharacter(r,{anim,x:0,z:0,prev:{x:1,z:0},guard:anim==='guard',air:anim==='jump'?.7:0,animTime:.3},frame/60);r.g.position.set(12,0,-8);r.g.updateMatrixWorld(true);inverse.copy(r.g.matrixWorld).invert();
   for(const mesh of surfaces){mesh.skeleton.update();for(let i=0;i<mesh.geometry.attributes.position.count;i+=23){mesh.getVertexPosition(i,point);point.applyMatrix4(mesh.matrixWorld).applyMatrix4(inverse);assert.ok([point.x,point.y,point.z].every(v=>Number.isFinite(v)&&Math.abs(v)<5),`${anim}: ${point.toArray()}`);}}
  }
 }
});
