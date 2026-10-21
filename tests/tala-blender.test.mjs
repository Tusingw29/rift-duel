import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const file=readFileSync(new URL('../dist/assets/models/tala-study.glb',import.meta.url));
assert.equal(file.toString('ascii',0,4),'glTF');assert.equal(file.readUInt32LE(4),2);
const len=file.readUInt32LE(12),gltf=JSON.parse(file.toString('utf8',20,20+len));const bin=file.subarray(28+len);
function values(index){const a=gltf.accessors[index],v=gltf.bufferViews[a.bufferView],size={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT4:16}[a.type],bytes={5121:1,5123:2,5125:4,5126:4}[a.componentType],read={5121:'readUInt8',5123:'readUInt16LE',5125:'readUInt32LE',5126:'readFloatLE'}[a.componentType];assert.ok(read);const out=[];for(let i=0;i<a.count;i++)for(let j=0;j<size;j++)out.push(bin[read]((v.byteOffset||0)+(a.byteOffset||0)+i*(v.byteStride||bytes*size)+j*bytes));return out;}
test('Blender review asset contains bounded skinned geometry with normalized weights',()=>{
 assert.ok(file.length<5_000_000);assert.ok(gltf.skins?.length);let vertices=0;
 for(const mesh of gltf.meshes)for(const p of mesh.primitives){const pos=values(p.attributes.POSITION);vertices+=pos.length/3;assert.ok(pos.every(n=>Number.isFinite(n)&&Math.abs(n)<5));const weights=values(p.attributes.WEIGHTS_0);for(let i=0;i<weights.length;i+=4)assert.ok(Math.abs(weights.slice(i,i+4).reduce((a,b)=>a+b,0)-1)<1e-4);}
 assert.ok(vertices>1000&&vertices<25000);assert.ok(gltf.images.every(i=>i.bufferView!==undefined),'texture is packed');
});
test('Blender export preserves seven separately selectable clips and combo contact keys',()=>{
 assert.deepEqual(gltf.animations.map(a=>a.name).sort(),['Advance','Circle','Combo','Guard','Idle','Recoil','Retreat']);
 for(const a of gltf.animations){assert.ok(a.channels.length>=15);for(const s of a.samplers){assert.ok(values(s.output).every(Number.isFinite));const times=values(s.input);assert.ok(times.at(-1)>0);assert.ok(times.every((v,i)=>i===0||v>times[i-1]));}}
 const combo=gltf.animations.find(a=>a.name==='Combo');const times=values(combo.samplers[0].input);for(const contact of [5/60,25/60,45/60])assert.ok(times.some(t=>Math.abs(t-contact)<1e-5));
});
