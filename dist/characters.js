import {buildRei} from './rei-model.js';
import {buildAegis} from './aegis-model.js';
import * as T from './vendor/three.module.js';
import {buildTala} from './tala-model.js';
import {fighters} from './fighters.js';

// Combine static pieces on each joint by material; joints stay independently
// animated. This reduces draw calls without flattening the skeleton.
function batchJointMeshes(root,keep){
 for(const child of [...root.children])if(child.isGroup)batchJointMeshes(child,keep);
 const batches=new Map();
 for(const child of root.children)if(child.isMesh&&!keep.has(child)){
  const list=batches.get(child.material)||[];list.push(child);batches.set(child.material,list);
 }
 for(const [material,list] of batches){
  if(list.length<2)continue;
  const positions=[],normals=[];
  for(const original of list){
   original.updateMatrix();const geometry=original.geometry.index?original.geometry.toNonIndexed():original.geometry.clone();
   geometry.applyMatrix4(original.matrix);positions.push(...geometry.attributes.position.array);normals.push(...geometry.attributes.normal.array);geometry.dispose();
  }
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('normal',new T.Float32BufferAttribute(normals,3));
  const combined=new T.Mesh(geometry,material);combined.castShadow=true;root.add(combined);
  for(const original of list){root.remove(original);original.geometry.dispose();}
 }
}

// Original low-poly character meshes. All geometry is generated locally.
export function buildCharacter(id){
 if(id===2)return buildTala();
 if(id===1)return buildRei();
 if(id===0)return buildAegis();
 const f=fighters[id],g=new T.Group(),body=new T.Group();g.add(body);
 const materials={};
 const material=(name,color,metalness=0)=>materials[name]??(materials[name]=new T.MeshStandardMaterial({color,roughness:.7,metalness,flatShading:true}));
 const cloth=material('cloth',f.dark),accent=material('accent',f.color,.3),black=material('black','#161e2b'),white=material('white','#e9e7dc'),skin=material('skin',f.id==='tala'?'#b98160':'#dfb998'),gold=material('gold','#d6b877',.55);
 const glow=new T.MeshBasicMaterial({color:f.color});
 const mesh=(geo,mat,parent,x=0,y=0,z=0)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;};
 const box=(w,h,d,mat,parent,x=0,y=0,z=0)=>mesh(new T.BoxGeometry(w,h,d),mat,parent,x,y,z);
 const sphere=(x,y,z,mat,parent,px=0,py=0,pz=0)=>{const m=mesh(new T.SphereGeometry(1,8,6),mat,parent,px,py,pz);m.scale.set(x,y,z);return m;};
 const taper=(top,bottom,height,depth,mat,parent,x=0,y=0,z=0)=>{const m=mesh(new T.CylinderGeometry(top,bottom,height,6),mat,parent,x,y,z);m.scale.z=depth;m.rotation.y=Math.PI/6;return m;};
 const joint=(parent,x,y,z=0)=>{const j=new T.Group();j.position.set(x,y,z);parent.add(j);return j;};
 const ribbon=(parent,points,width,mat)=>{const vertices=[];for(const [x,y,z] of points)vertices.push(x-width/2,y,z,x+width/2,y,z);const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));const indices=[];for(let i=0;i<points.length-1;i++){const n=i*2;indices.push(n,n+1,n+2,n+1,n+3,n+2);}geo.setIndex(indices);geo.computeVertexNormals();const m=mesh(geo,mat,parent);m.material.side=T.DoubleSide;return m;};
 const heavy=f.shape==='heavy',slim=['coat','oracle'].includes(f.shape),width=heavy?1.28:slim?.84:f.shape==='mage'?.88:1;
 const hips=joint(body,0,1.08);taper(.32*width,.29*width,.28,.72,cloth,hips);
 const spine=joint(body,0,1.25);taper(.47*width,.29*width,.82,.58,f.shape==='martial'?skin:cloth,spine,0,.4);
 taper(.33*width,.28*width,.11,.78,accent,body,0,1.24);
 box(.14,.13,.05,gold,body,0,1.24,.25);
 taper(.105,.12,.22,1,f.shape==='armor'?black:skin,spine,0,.91);
 const head=joint(spine,0,1.23);
 sphere(.235,.29,.22,skin,head,0,0,0);sphere(.18,.15,.17,skin,head,0,-.14,.025);
 for(const side of [-1,1]){sphere(.045,.075,.055,skin,head,side*.235,-.015);box(.10,.044,.018,white,head,side*.09,.005,.207);box(.035,.044,.023,black,head,side*.08,.005,.221);const brow=box(.12,.025,.025,black,head,side*.09,.062,.21);brow.rotation.z=side*.13;}
 mesh(new T.ConeGeometry(.039,.10,3),skin,head,0,-.05,.238).rotation.x=Math.PI/2;
 box(.08,.013,.018,black,head,0,-.145,.189);
 const limbs=[],elbows=[],knees=[],clothParts=[];
 for(const side of [-1,1]){
  const arm=joint(spine,side*.43*width,.77);limbs.push(arm);
  sphere(.16*width,.18,.17,heavy||f.shape==='armor'?accent:f.shape==='martial'?skin:cloth,arm);
  taper(.115,.095,.37,1,f.shape==='martial'?skin:cloth,arm,0,-.23);
  const elbow=joint(arm,0,-.43);elbows.push(elbow);sphere(.105,.105,.105,black,elbow);
  taper(heavy?.18:.12,.09,.33,.95,accent,elbow,0,-.18);
  const hand=joint(elbow,0,-.40);sphere(.105,.13,.10,f.shape==='martial'?skin:black,hand);
  const leg=joint(body,side*.20*width,1.1);limbs.push(leg);
  taper(.16*width,.105,.46,.95,cloth,leg,0,-.23);
  const knee=joint(leg,0,-.48);knees.push(knee);sphere(.125,.12,.135,accent,knee,0,0,.025);
  taper(.12,.09,.43,1,heavy||f.shape==='armor'?accent:cloth,knee,0,-.23);
  const boot=box(.21,.17,.36,black,knee,0,-.48,.075);boot.rotation.x=-.04;
  arm.userData.hand=hand;
 }
 const rightHand=limbs[2].userData.hand;
 const hairColor=f.id==='rei'?'#ece6d6':f.id==='tala'?'#202b37':f.id==='sol'?'#d8aa73':heavy?'#66726e':'#8c83b5';
 const hair=material('hair',hairColor);
 if(f.shape==='armor'){
  sphere(.265,.31,.25,accent,head,0,.02,-.02);sphere(.24,.16,.23,accent,head,0,-.16,.025);
  const visor=box(.43,.105,.075,black,head,0,.015,.227);visor.rotation.z=-.04;
  for(const side of [-1,1]){const eye=box(.16,.035,.025,glow,head,side*.11,.015,.273);eye.rotation.z=side*.18;const fin=mesh(new T.ConeGeometry(.085,.43,3),white,head,side*.20,.34,-.04);fin.rotation.z=-side*.4;}
  taper(.42,.29,.5,.65,accent,spine,0,.52,.045);
  box(.09,.36,.05,white,spine,0,.52,.29);
  for(const side of [-1,1]){const plate=mesh(new T.OctahedronGeometry(.28),accent,spine,side*.48,.80);plate.scale.set(1.2,.65,1);}
  const cape=joint(spine,0,.86,-.18);ribbon(cape,[[0,0,0],[0,-.45,-.17],[0,-1,-.25],[0,-1.6,-.48]],.74,white);clothParts.push(cape);
 }else{
  const cap=mesh(new T.SphereGeometry(.255,8,5,0,Math.PI*2,0,Math.PI*.64),hair,head,0,.08,-.025);cap.rotation.x=-.12;
  for(let j=0;j<5;j++){const fringe=mesh(new T.ConeGeometry(.075,.23+(j%2)*.06,3),hair,head,(j-2)*.085,.10,.19);fringe.rotation.z=Math.PI+(j-2)*.14;}
  if(f.id==='rei'||f.id==='vesper')for(const side of [-1,1]){const lock=mesh(new T.ConeGeometry(.10,f.id==='rei'?.6:.82,4),hair,head,side*.22,-.18,-.035);lock.rotation.z=Math.PI+side*.12;}
 }
 if(f.shape==='coat'){
  // Asymmetric short jacket, long split tails, and spirit crest.
  for(const side of [-1,1]){const lapel=box(.13,.5,.055,white,spine,side*.13,.55,.25);lapel.rotation.z=side*.22;const tail=joint(body,side*.22,1.2,-.13);ribbon(tail,[[0,0,0],[side*.04,-.5,-.05],[side*.12,-.95,-.16]],.33,cloth);clothParts.push(tail);}
  box(.19,.12,.06,accent,spine,0,.7,.27);const sash=joint(body,-.23,1.24,.15);ribbon(sash,[[0,0,0],[-.12,-.35,.03],[-.04,-.7,0]],.10,accent);clothParts.push(sash);
 }
 if(f.shape==='martial'){
  const top=box(.64,.24,.34,cloth,spine,0,.6,.16);top.rotation.z=-.08;
  box(.45,.075,.45,accent,head,0,.10,-.015);
  const pony=joint(head,0,.18,-.21);taper(.11,.035,.53,.7,hair,pony,0,-.22,-.06);clothParts.push(pony);
  for(const side of [-1,1]){const belt=joint(body,side*.12,1.23,.23);ribbon(belt,[[0,0,0],[side*.08,-.35,.08],[side*.14,-.65,.02]],.11,accent);clothParts.push(belt);}
  for(const elbow of elbows)for(let j=0;j<3;j++)taper(.125,.125,.035,1,white,elbow,0,-.08-j*.08);
 }
 if(heavy){
  taper(.56,.42,.58,.72,accent,spine,0,.54,.02);
  for(const side of [-1,1]){const pauldron=box(.42,.3,.5,accent,spine,side*.55,.79);pauldron.rotation.z=-side*.2;box(.11,.33,.06,gold,spine,side*.22,.55,.36);}
  box(.48,.14,.12,black,head,0,-.17,.15);sphere(.25,.15,.21,material('beard','#5c6864'),head,0,-.20,.02);
  box(.13,.3,.07,black,head,.1,.01,.22);
 }
 if(f.shape==='mage'||f.shape==='oracle'){
  const skirt=mesh(new T.CylinderGeometry(.30,.58,1.04,8,1,true),cloth,body,0,.68,-.02);skirt.material.side=T.DoubleSide;
  for(const side of [-1,1]){const stole=joint(spine,side*.23,.87,.17);ribbon(stole,[[0,0,0],[side*.03,-.65,.11],[side*.11,-1.65,.12]],.15,f.shape==='mage'?gold:accent);clothParts.push(stole);}
  if(f.shape==='mage'){
   const collar=taper(.41,.22,.28,.7,accent,spine,0,.91,-.02);collar.rotation.x=-.12;
   box(.065,2.15,.065,gold,rightHand,0,.5,.06);const crystal=mesh(new T.OctahedronGeometry(.22),glow,rightHand,0,1.67,.06);crystal.scale.y=1.4;
   mesh(new T.TorusGeometry(.27,.035,5,16),gold,rightHand,0,1.66,.06);
  }else{
   const halo=mesh(new T.TorusGeometry(.53,.025,5,32),gold,head,0,.17,-.27);halo.rotation.z=.3;
   for(const side of [-1,1]){const crescent=mesh(new T.TorusGeometry(.28,.028,4,16,Math.PI),accent,rightHand,side*.02,.12,.12);crescent.rotation.y=side*Math.PI/2;}
   taper(.43,.22,.18,.7,white,spine,0,.85,0);
  }
 }
 if(['blade','katana','greatsword'].includes(f.weapon)){
  const length=f.weapon==='greatsword'?1.8:f.weapon==='katana'?1.5:1.25,w=f.weapon==='greatsword'?.24:.095;
  box(.08,.28,.08,black,rightHand,0,0,.12);
  box(.40,.07,.12,gold,rightHand,0,.10,.13);
  // Forward-facing blade keeps its point above the ground in ready stance.
  const blade=mesh(new T.ConeGeometry(w,length,4),f.weapon==='katana'?white:accent,rightHand,0,.12,.24+length/2);blade.rotation.x=Math.PI/2;blade.scale.z=.25;
  box(.025,.035,length*.9,glow,rightHand,0,.15,.24+length/2);
 }
 let spirit=null;
 if(f.id==='rei'){
  spirit=joint(body,.55,1.55,-.38);
  const ether=new T.MeshStandardMaterial({color:'#8ce8ed',transparent:true,opacity:.25,depthWrite:false,roughness:1,flatShading:true});
  taper(.28,.09,.65,.6,ether,spirit,0,.20);sphere(.17,.22,.16,ether,spirit,0,.72);
  for(const side of [-1,1]){const wing=mesh(new T.ConeGeometry(.13,.9,3),ether,spirit,side*.27,.35,-.09);wing.rotation.z=side*.65;}
  spirit.userData.material=ether;
 }
 const shadow=mesh(new T.CircleGeometry(.62,24),new T.MeshBasicMaterial({color:'#090f16',transparent:true,opacity:.35,depthWrite:false}),g,0,.015);shadow.rotation.x=-Math.PI/2;shadow.castShadow=false;
 const aura=mesh(new T.TorusGeometry(.72,.016,5,40),new T.MeshBasicMaterial({color:f.color}),g,0,.025);aura.rotation.x=Math.PI/2;aura.castShadow=false;
 batchJointMeshes(g,new Set([aura,shadow]));
 return {g,body,spine,head,limbs,elbows,knees,clothParts,aura,spirit,id};
}
