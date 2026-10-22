import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync,existsSync} from 'node:fs';
import {GLTFLoader} from '../dist/vendor/GLTFLoader.js';
import {Matrix4,Vector3} from '../dist/vendor/three.module.js';
import {buildCharacter} from '../dist/characters.js';import {attachFighterModel} from '../dist/tala-concept.js';import {animateCharacter} from '../dist/animation.js';
import {fighters} from '../dist/fighters.js';
globalThis.ProgressEvent??=class ProgressEvent{constructor(type,data){this.type=type;Object.assign(this,data);}};
const BONES=['root','chest','head','upper_arm.L','forearm.L','hand.L','thigh.L','shin.L','upper_arm.R','forearm.R','hand.R','thigh.R','shin.R','ponytail','sash','foot.L','foot.R'];
async function load(id){
 const bytes=readFileSync(new URL(`../dist/assets/models/${id}-v3.glb`,import.meta.url)),len=bytes.readUInt32LE(12),json=JSON.parse(bytes.subarray(20,20+len));
 json.buffers[0].uri='data:application/octet-stream;base64,'+bytes.subarray(28+len).toString('base64');delete json.images;delete json.textures;json.materials=json.materials.map(()=>({}));
 return {json,asset:await new GLTFLoader().parseAsync(JSON.stringify(json),'')};
}
const roster=fighters.filter(f=>f.id!=='tala'&&existsSync(new URL(`../dist/assets/models/${f.id}-v3.glb`,import.meta.url)));
test('every roster fighter has a Design 03 model built by the shared pipeline',()=>{
 assert.deepEqual(roster.map(f=>f.id),fighters.filter(f=>f.id!=='tala').map(f=>f.id));
});
for(const f of roster)test(`${f.name}: Design 03 asset binds to the combat rig, keeps the weapon and animates finitely`,async()=>{
 const {json,asset}=await load(f.id);
 assert.deepEqual(json.nodes.slice(0,BONES.length).map(n=>n.name),BONES);
 assert.equal(json.scenes[0].extras.fighter,f.id);assert.ok(json.scenes[0].extras.metrics.legLength>.7);
 const index=fighters.indexOf(f),r=buildCharacter(index);
 const hands=[r.limbs[0].userData.hand,r.limbs[2].userData.hand];
 const weapons=[];r.g.traverse(n=>{if(n.isMesh){for(let p=n;p;p=p.parent)if(hands.includes(p)){weapons.push(n);break;}}});
 assert.equal(attachFighterModel(r,asset.scene),true);assert.equal(attachFighterModel(r,asset.scene),false);
 assert.ok(weapons.filter(n=>n.userData.weapon).every(n=>n.visible)&&weapons.some(n=>n.userData.weapon),'weapons parented to the hands stay visible');
 assert.ok(r.conceptOriginalSurfaces.length>0&&r.conceptOriginalSurfaces.every(n=>!n.visible));
 assert.equal(r.shinLength,json.scenes[0].extras.metrics.shinLength);
 const surfaces=r.g.children.filter(n=>n.name.startsWith('concept-'));assert.ok(surfaces.length>=5,f.id);
 // Bind pose: the moved combat bones reproduce the authored body exactly.
 r.g.updateMatrixWorld(true);
 for(const mesh of surfaces){mesh.skeleton.update();for(let i=0;i<mesh.geometry.attributes.position.count;i+=41){const rest=new Vector3().fromBufferAttribute(mesh.geometry.attributes.position,i);assert.ok(mesh.getVertexPosition(i,new Vector3()).distanceTo(rest)<.001,`${f.id} ${mesh.name} bind pose`);}}
 const point=new Vector3(),inverse=new Matrix4();
 for(const anim of ['idle','run','guard','hurt','jump','defeat'])for(let frame=0;frame<8;frame++){
  animateCharacter(r,{anim,x:0,z:0,prev:{x:1,z:0},guard:anim==='guard',air:anim==='jump'?.7:0,animTime:.3},frame/60);r.g.position.set(12,0,-8);r.g.updateMatrixWorld(true);inverse.copy(r.g.matrixWorld).invert();
  for(const mesh of surfaces){mesh.skeleton.update();for(let i=0;i<mesh.geometry.attributes.position.count;i+=97){mesh.getVertexPosition(i,point);point.applyMatrix4(mesh.matrixWorld).applyMatrix4(inverse);assert.ok([point.x,point.y,point.z].every(Number.isFinite)&&point.y>-1&&point.y<4.5,`${f.id} ${anim} ${mesh.name}`);}}
 }
});
