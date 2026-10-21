import test from 'node:test';import assert from 'node:assert/strict';
import * as T from '../dist/vendor/three.module.js';
import {profileFor,upgradeMaterials,PROFILES,createEnvironment,tuneMaterial} from '../dist/shading.js';
import {buildCharacter} from '../dist/characters.js';
import {fighters} from '../dist/fighters.js';
test('materials are classified by name into skin, hair, cloth, leather, metal and ground profiles',()=>{
 assert.equal(profileFor('skin'),'skin');assert.equal(profileFor('Design02_face'),'face');assert.equal(profileFor('hair'),'hair');assert.equal(profileFor('Design02_rust_cloth'),'cloth');
 assert.equal(profileFor('sole'),'leather');assert.equal(profileFor('','Steel plate'),'metal');assert.equal(profileFor('','ground'),'ground');assert.equal(profileFor('top','',''),'' );assert.equal(profileFor('mystery','','arena'),'arena');
});
test('upgrading converts Lambert surfaces to physically based materials, keeps maps and glow, and is idempotent',()=>{
 const g=new T.Group(),map=new T.DataTexture(new Uint8Array(4),1,1);
 const lambert=new T.MeshLambertMaterial({color:'#ff0000',map,vertexColors:true,transparent:true,alphaTest:.3,side:T.DoubleSide});lambert.name='skin';
 const a=new T.Mesh(new T.BoxGeometry(),lambert),b=new T.Mesh(new T.BoxGeometry(),lambert),glow=new T.Mesh(new T.BoxGeometry(),new T.MeshBasicMaterial({color:'#00ff00'}));
 const standard=new T.MeshStandardMaterial({color:'#0000ff'});standard.name='hair';const c=new T.Mesh(new T.BoxGeometry(),standard);
 g.add(a,b,glow,c);
 assert.equal(upgradeMaterials(g),3);
 assert.ok(a.material.isMeshPhysicalMaterial);assert.equal(a.material,b.material,'shared material stays shared');assert.equal(a.material.map,map);assert.equal(a.material.vertexColors,true);assert.equal(a.material.alphaTest,.3);assert.equal(a.material.side,T.DoubleSide);assert.equal(a.material.color.getHexString(),'ff0000');
 assert.equal(a.material.roughness,PROFILES.skin.roughness);assert.ok(a.material.clearcoat>0);
 assert.ok(glow.material.isMeshBasicMaterial,'glow untouched');assert.equal(c.material,standard,'standard material retuned in place');assert.equal(c.material.roughness,PROFILES.hair.roughness);
 assert.equal(upgradeMaterials(g),0,'second pass changes nothing');
});
test('every fighter rig upgrades without losing a surface and the environment needs a renderer',()=>{
 for(let id=0;id<fighters.length;id++){const r=buildCharacter(id);let before=0;r.g.traverse(n=>{if(n.isMesh)before++;});upgradeMaterials(r.g,'cloth');let after=0,untuned=0;r.g.traverse(n=>{if(n.isMesh){after++;if(!n.material.isMeshBasicMaterial&&!n.material.userData.shadingProfile)untuned++;}});assert.equal(after,before);assert.equal(untuned,0,fighters[id].id);}
 assert.equal(createEnvironment(null),null);
 const m=tuneMaterial(new T.MeshStandardMaterial(),'metal');assert.equal(m.metalness,PROFILES.metal.metalness);
});

test('texture clarity respects device limits, low quality and existing mip filters',async()=>{
 const {sharpenTextures}=await import('../dist/shading.js');
 const root=new T.Group(),map=new T.Texture(),normal=new T.Texture();
 const minFilter=map.minFilter,magFilter=map.magFilter;
 const material=new T.MeshStandardMaterial({map,normalMap:normal});
 root.add(new T.Mesh(new T.BoxGeometry(),[material,material]));
 assert.equal(sharpenTextures(root,4),2);
 assert.equal(map.anisotropy,4);assert.equal(normal.anisotropy,4);
 assert.equal(map.minFilter,minFilter);assert.equal(map.magFilter,magFilter);
 sharpenTextures(root,16);assert.equal(map.anisotropy,8);
 sharpenTextures(root,16,'low');assert.equal(map.anisotropy,1);
});
