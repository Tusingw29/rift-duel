import * as T from './vendor/three.module.js';
// Original courtyard architecture. All buildings stand outside the combat disc;
// static surfaces are merged per material to keep the detailed stage inexpensive.
function paint(kind){
 const size=64,data=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const grain=((x*19+y*13+x*y)%17)/17;let c;
  if(kind==='wood'){const seam=x%16<2;c=seam?[55,30,35]:[101+grain*20,56+grain*13,54+grain*9];}
  else if(kind==='roof'){const seam=x%8<1||y%16<1;c=seam?[29,37,48]:[58+grain*15,71+grain*15,83+grain*17];}
  else {const seam=y%16<2||(x+(Math.floor(y/16)%2)*16)%32<2;c=seam?[69,73,80]:[129+grain*23,132+grain*22,139+grain*20];}
  data.set([...c.map(Math.round),255],(y*size+x)*4);
 }
 const texture=new T.DataTexture(data,size,size);texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.magFilter=T.LinearFilter;texture.minFilter=T.LinearFilter;texture.needsUpdate=true;return texture;
}
export function buildShrineCourtyard(){
 const root=new T.Group();root.name='shrine-courtyard';
 const wood=new T.MeshLambertMaterial({map:paint('wood')}),stone=new T.MeshLambertMaterial({map:paint('stone')}),roof=new T.MeshLambertMaterial({map:paint('roof'),side:T.DoubleSide});
 const plaster=new T.MeshLambertMaterial({color:'#b9af9e'}),dark=new T.MeshLambertMaterial({color:'#292a35'}),leaf=new T.MeshLambertMaterial({color:'#95768a',flatShading:true});
 const carved=new T.MeshLambertMaterial({color:'#9b9ca6'});
 const paper=new T.MeshBasicMaterial({color:'#f5c88c'});
 const add=(geo,mat,x,y,z,parent=root)=>{const mesh=new T.Mesh(geo,mat);mesh.position.set(x,y,z);mesh.castShadow=true;mesh.receiveShadow=true;parent.add(mesh);return mesh;};
 const box=(w,h,d,mat,x,y,z,parent=root)=>add(new T.BoxGeometry(w,h,d),mat,x,y,z,parent);
 function tiledRoof(parent,width,depth,height){
  const pos=[],uv=[],indices=[];
  // A shallow raised ridge and upturned eaves, with actual depth in both views.
  const sections=[[-1,.18],[-.82,0],[-.5,.65],[0,1.75],[.5,.65],[.82,0],[1,.18]];
  for(let j=0;j<sections.length;j++)for(let i=0;i<=8;i++){
   const [z,y]=sections[j],x=(i/8-.5)*width,edge=Math.abs(x)/(width/2);
   pos.push(x,height+y+Math.pow(edge,5)*.25,z*depth/2);uv.push(i/8*4,j/6*3);
   if(j<sections.length-1&&i<8){const a=j*9+i,b=a+9;indices.push(a,b,a+1,a+1,b,b+1);}
  }
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geo.setIndex(indices);geo.computeVertexNormals();add(geo,roof,0,0,0,parent);
  box(width,.18,.22,wood,0,height+1.8,0,parent);
  for(const side of [-1,1])box(width,.16,.2,wood,0,height+.18,side*depth/2,parent);
 }
 function hall(x,z,width,depth,turn=0){
  const hall=new T.Group();hall.position.set(x,0,z);hall.rotation.y=turn;root.add(hall);
  box(width+2,.8,depth+2,stone,0,.3,0,hall);
  box(width,.35,depth,wood,0,.85,0,hall);
  box(width-.5,3.5,depth-.5,plaster,0,2.65,0,hall);
  for(const side of [-1,1])for(let i=0;i<5;i++){const px=(i/4-.5)*(width-.3);box(.24,4.2,.28,wood,px,2.7,side*depth/2,hall);}
  for(const side of [-1,1]){box(width,.22,.3,wood,0,1,side*depth/2,hall);box(width,.28,.3,wood,0,4.1,side*depth/2,hall);}
  for(const side of [-1,1]){
   box(1.35,2.6,.10,dark,side*1.55,2.4,depth/2+.08,hall);
   for(let j=0;j<5;j++)box(.045,2.5,.13,wood,side*1.55+(j-2)*.24,2.4,depth/2+.16,hall);
  }
  box(1.15,2.7,.12,wood,0,2.4,depth/2+.12,hall);
  for(let j=0;j<3;j++)box(width*.5,.22,1.4-j*.35,stone,0,.1+j*.2,depth/2+1-j*.15,hall);
  tiledRoof(hall,width+3,depth+3,4.5);
 }
 // Continuous outer grounds and approach paths connect the combat platform
 // to the architecture; scenery must not appear to float in the sky color.
 const earth=new T.MeshLambertMaterial({color:'#424952'});
 add(new T.CylinderGeometry(48,48,.2,64),earth,0,-.3,0);
 box(8,.12,28,stone,0,-.20,-26);
 box(28,.12,7,stone,-26,-.20,1);box(28,.12,7,stone,26,-.20,1);
 hall(0,-33,15,7);hall(-32,1,11,6,Math.PI/2);hall(32,1,11,6,-Math.PI/2);
 // Low stone balustrades stay below the fight camera and leave entry gaps.
 for(let i=0;i<48;i++){
  const a=i/48*Math.PI*2;if(Math.abs(Math.sin(a))>.97)continue;
  const x=Math.cos(a)*18.5,z=Math.sin(a)*18.5;
  box(.30,1.25,.30,carved,x,.55,z);box(.48,.13,.48,carved,x,1.22,z);
  const rail=box(2.45,.15,.22,carved,x,.9,z);rail.rotation.y=-a+Math.PI/2;
 }
 // Lanterns and planted trees give the horizon depth around the whole ring.
 const lanterns=[];
 for(let i=0;i<10;i++){
  const a=i/10*Math.PI*2,x=Math.cos(a)*21,z=Math.sin(a)*21;
  box(.9,.22,.9,carved,x,.1,z);box(.35,1.6,.35,carved,x,.9,z);
  box(.95,.18,.95,carved,x,1.7,z);const light=box(.62,.65,.62,paper,x,2.1,z);lanterns.push(light);
  for(const dx of [-.36,.36])for(const dz of [-.36,.36])box(.08,.75,.08,dark,x+dx,2.1,z+dz);
  const cap=add(new T.ConeGeometry(.83,.45,4),roof,x,2.65,z);cap.rotation.y=Math.PI/4;
  const tx=Math.cos(a)*28,tz=Math.sin(a)*28;
  const trunk=add(new T.CylinderGeometry(.18,.34,4.4,7),wood,tx,2,tz);trunk.rotation.z=Math.sin(i)*.12;
  for(let j=0;j<5;j++){const angle=j*2.4+i,foliage=add(new T.IcosahedronGeometry(1.9,1),leaf,tx+Math.cos(angle)*1.3,4.4+(j%2)*.6,tz+Math.sin(angle)*1.3);foliage.scale.set(1.3,.65,1);}
 }
 // Broad distant ridge silhouettes prevent an empty horizon between halls.
 for(let layer=0;layer<2;layer++){
  const vertices=[],indices=[],radius=53+layer*13;
  for(let i=0;i<=64;i++){const a=i/64*Math.PI*2,h=7+layer*3+Math.sin(a*5+layer)*3+Math.sin(a*11)*1.2;vertices.push(Math.cos(a)*radius,-3,Math.sin(a)*radius,Math.cos(a)*radius,h,Math.sin(a)*radius);if(i<64){const n=i*2;indices.push(n,n+1,n+2,n+1,n+3,n+2);}}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geo.setIndex(indices);geo.computeVertexNormals();add(geo,new T.MeshBasicMaterial({color:layer?'#313d53':'#253346',side:T.DoubleSide}),0,0,0);
 }
 root.updateMatrixWorld(true);
 const batches=new Map();root.traverse(n=>{if(n.isMesh&&!lanterns.includes(n)){const list=batches.get(n.material)||[];list.push(n);batches.set(n.material,list);}});
 for(const [material,list] of batches){const pos=[],normal=[],uv=[];
  for(const n of list){const geo=n.geometry.index?n.geometry.toNonIndexed():n.geometry.clone();geo.applyMatrix4(n.matrixWorld);pos.push(...geo.attributes.position.array);normal.push(...geo.attributes.normal.array);if(geo.attributes.uv)uv.push(...geo.attributes.uv.array);else for(let i=0;i<geo.attributes.position.count;i++)uv.push(0,0);geo.dispose();}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new T.Float32BufferAttribute(normal,3));geo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));add(geo,material,0,0,0);
  for(const n of list){n.parent.remove(n);n.geometry.dispose();}
 }
 return {group:root,update(t){for(let i=0;i<lanterns.length;i++)lanterns[i].scale.setScalar(1+Math.sin(t*2+i)*.025);}};
}
