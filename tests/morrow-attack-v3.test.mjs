import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
import {GLTFLoader} from '../dist/vendor/GLTFLoader.js';import {Vector3} from '../dist/vendor/three.module.js';
import {buildCharacter} from '../dist/characters.js';import {attachFighterModel} from '../dist/tala-concept.js';import {animateCharacter} from '../dist/animation.js';import {moveTiming} from '../dist/moves.js';import {fighters} from '../dist/fighters.js';
globalThis.ProgressEvent??=class {constructor(type,data){this.type=type;Object.assign(this,data);}};
test('anatomical Morrow retains a closed grip through all three cuts at rotated world placement',async()=>{
 const bytes=readFileSync(new URL('../dist/assets/models/morrow-v3.glb',import.meta.url)),len=bytes.readUInt32LE(12),json=JSON.parse(bytes.subarray(20,20+len));
 json.buffers[0].uri='data:application/octet-stream;base64,'+bytes.subarray(28+len).toString('base64');delete json.images;delete json.textures;json.materials=json.materials.map(()=>({}));
 const asset=await new GLTFLoader().parseAsync(JSON.stringify(json),'');
 for(const chain of [1,2,3]){
  const r=buildCharacter(3);attachFighterModel(r,asset.scene);r.g.position.set(3,0,4);r.g.rotation.y=1.2;r.g.scale.setScalar(1.12);
  const m={kind:'strike',chain,...moveTiming(fighters[3],'strike')};
  for(let frame=0;frame<=m.total;frame++){
   m.frame=frame;animateCharacter(r,{anim:'strike',x:3,z:4,move:m},frame/60);r.g.updateMatrixWorld(true);
   if(r.morrowGrip?.weight===1)assert.ok(r.morrowGrip.error<1e-5,`cut ${chain}, frame ${frame}: grip error ${r.morrowGrip.error}`);
   for(const foot of r.feet){const ball=foot.localToWorld(r.footBall.clone());assert.ok(Math.abs(ball.y)<.001,'pivot contact remains on the floor');}
   r.g.traverse(n=>{if(n.isBone)assert.ok(n.getWorldPosition(new Vector3()).toArray().every(Number.isFinite));});
  }
 }
});
