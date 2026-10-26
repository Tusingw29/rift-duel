import * as T from './vendor/three.module.js';
// Closed volumetric meshes derived from the Ink Energy concept board.
// Four prebuilt volume variants, no textures or camera-facing cards.
export const inkMaterial=color=>new T.MeshBasicMaterial({color,transparent:true,opacity:1,depthWrite:true,vertexColors:true,side:T.DoubleSide,toneMapped:false});
export function facetColors(geometry){
 const normals=geometry.attributes.normal,colors=[];
 for(let i=0;i<normals.count;i++){const shade=Math.abs(normals.getZ(i))>.5?1:.62;colors.push(shade,shade,shade);}
 geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));return geometry;
}
const polygon=(points,depth=.28)=>{const shape=new T.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();const geometry=new T.ExtrudeGeometry(shape,{depth,bevelEnabled:false,steps:1,curveSegments:1});geometry.translate(0,0,-depth/2);return facetColors(geometry);};
const frameAt=(time,reduced)=>reduced?0:Math.floor(Math.max(0,time)*12)%4;
function layer(geometry,color,order,fixed=false){const m=new T.Mesh(geometry,inkMaterial(color));m.renderOrder=order;if(fixed)m.userData.fixedColor=color;return m;}
// Axial faceted body and closed raised white channel wedges, not intersecting cards.
const beamProfile=[[-2.7,0],[-2.3,.10],[-2,.07],[-1.85,.22],[-1.4,.12],[-1.28,.30],[-.9,.17],[-.78,.34],[-.4,.21],[-.15,.32],[.35,0]];
function beamVolume(frame,channel=false){
 const positions=[],sides=channel?2:8,width=channel?.35:Math.PI*2;
 const point=(i,j)=>{const [z,r]=beamProfile[i],a=j/sides*width,radius=r*(1+Math.sin(i*1.7+frame)*.08)*(channel?1.025:1);return [Math.cos(a)*radius,Math.sin(a)*radius,z];};
 const tri=(a,b,c)=>positions.push(...a,...b,...c);
 for(let i=0;i<beamProfile.length-1;i++){
  for(let j=0;j<sides;j++){const a=point(i,j),b=point(i,j+1),c=point(i+1,j+1),d=point(i+1,j);tri(a,b,c);tri(a,c,d);}
  if(channel){const a=[0,0,beamProfile[i][0]],b=[0,0,beamProfile[i+1][0]];tri(a,point(i,0),point(i+1,0));tri(a,point(i+1,0),b);tri(a,b,point(i+1,sides));tri(a,point(i+1,sides),point(i,sides));}
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.computeVertexNormals();return facetColors(geometry);
}
export function createInkBeam(){
 const g=new T.Group();g.name='ink-beam';const banks=[false,true].map(channel=>Array.from({length:4},(_,f)=>beamVolume(f,channel)));
 const body=layer(banks[0][0],'#6fe7ff',1);body.name='beam-volume';g.add(body);
 for(let j=0;j<3;j++){const stripe=layer(banks[1][0],'#ffffff',2,true);stripe.rotation.z=j*Math.PI*2/3;stripe.name='beam-white-core';stripe.userData.whiteCore=true;g.add(stripe);}
 const volumes=[...g.children];
 const rim=layer(banks[0][0],'#102534',0,true);rim.scale.set(1.13,1.13,1.015);rim.material.side=T.BackSide;g.add(rim);
 for(let strand=0;strand<2;strand++){
  const points=Array.from({length:49},(_,i)=>{const t=i/48,a=t*Math.PI*5+strand*Math.PI;return new T.Vector3(Math.cos(a)*.23,Math.sin(a)*.23,-2.35+t*2.45);});
  const rib=layer(facetColors(new T.TubeGeometry(new T.CatmullRomCurve3(points),48,.025,4,false)),strand?'#ffffff':'#15364b',3,true);rib.name='beam-helical-rib';g.add(rib);banks.push([rib.geometry]);
 }
 g.userData.updateInk=(time,reduced)=>{const frame=frameAt(time,reduced);g.userData.frame=frame;volumes.forEach((m,i)=>m.geometry=banks[i?1:0][frame]);rim.geometry=banks[0][frame];};g.userData.geometryBanks=banks;return g;
}
function brushRingGeometry(frame,band){
 const vertices=[],count=96;
 const bounds=i=>{const a=i/count*Math.PI*2,spike=(i+frame*3)%12===2?.17:0,wave=Math.sin(i*1.7+frame)*.018;
  const inner=[.83,.87,.90][band]+wave,outer=[1.055,1,.945][band]+wave+spike*(band===2?.45:1);return {a,inner,outer};};
 for(let i=0;i<count;i++){
  if((i+frame)%24>21)continue; // ink breaks, not a perfect UI torus
  const p=bounds(i),q=bounds(i+1),point=(v,r)=>[Math.cos(v.a)*r,Math.sin(v.a)*r,0];
  const a=point(p,p.inner),b=point(p,p.outer),c=point(q,q.outer),d=point(q,q.inner),depth=[.12,.15,.18][band];
  const top=[a,b,c,d].map(v=>[v[0],v[1],depth]),bottom=[a,b,c,d].map(v=>[v[0],v[1],-depth]);
  const tri=(a,b,c)=>vertices.push(...a,...b,...c);
  tri(top[0],top[1],top[2]);tri(top[0],top[2],top[3]);
  tri(bottom[2],bottom[1],bottom[0]);tri(bottom[3],bottom[2],bottom[0]);
  for(let j=0;j<4;j++){const k=(j+1)%4;tri(top[j],bottom[j],bottom[k]);tri(top[j],bottom[k],top[k]);}

 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.computeVertexNormals();geometry.computeBoundingSphere();return facetColors(geometry);
}
export function createInkRing(color='#b98cff'){
 const g=new T.Group();g.name='ink-binding-ring';const banks=Array.from({length:3},(_,band)=>Array.from({length:4},(_,frame)=>brushRingGeometry(frame,band)));
 const meshes=['#261b3c',color,'#fff6ff'].map((c,i)=>{const mesh=layer(banks[i][0],c,i+1,i!==1);g.add(mesh);return mesh;});
 g.userData.updateInk=(time,reduced,opacity=1)=>{const frame=frameAt(time,reduced);g.userData.frame=frame;meshes.forEach((mesh,i)=>{mesh.geometry=banks[i][frame];mesh.material.opacity=opacity;});};
 g.userData.geometryBanks=banks;return g;
}
const flame=[[-.15,0],[-.25,.35],[-.12,.27],[-.3,.87],[-.1,.68],[.05,1.3],[.03,.92],[.28,1.85],[.14,.75],[.27,.91],[.18,.39],[.05,.13],[.11,.25],[.07,0]];
export function createInkFlame(){
 const g=new T.Group();g.name='ink-charge-ribbon';const banks=Array.from({length:4},(_,f)=>polygon(flame.map(([x,y],i)=>[x+Math.sin(i+f*1.8)*.055*y,y])));
 const outline=layer(banks[0],'#8c371b',1,true),body=layer(banks[0],'#ffb52e',2,true),core=layer(banks[0],'#fff6c9',3,true);
 outline.scale.set(1.18,1.02,1);body.scale.z=1.06;core.scale.set(.38,.84,1.12);g.add(outline,body,core);
 g.userData.updateInk=(time,reduced)=>{const f=frameAt(time,reduced);g.userData.frame=f;for(const mesh of g.children)mesh.geometry=banks[f];};g.userData.geometryBanks=[banks];return g;
}

// Six axial spikes give release/contact bursts volume from every viewing direction.
export function createEnergyBurst(color='#6fe7ff'){
 const g=new T.Group();g.name='ink-volume-burst';
 const core=layer(facetColors(new T.OctahedronGeometry(.26)), '#ffffff',3,true);g.add(core);
 const up=new T.Vector3(0,1,0);
 for(const axis of [[1,0,0],[-1,0,0],[0,1,0],[0,-1,0],[0,0,1],[0,0,-1]]){
  const direction=new T.Vector3(...axis),spike=layer(facetColors(new T.ConeGeometry(.17,.65,4)),color,2);
  spike.position.copy(direction).multiplyScalar(.42);spike.quaternion.setFromUnitVectors(up,direction);g.add(spike);
 }
 g.userData.updateInk=(time,reduced,opacity=1)=>{const f=frameAt(time,reduced);g.userData.frame=f;g.children.forEach((mesh,i)=>{mesh.material.opacity=opacity;if(i)mesh.scale.setScalar(1+Math.sin(i+f)*.08);});};
 return g;
}
