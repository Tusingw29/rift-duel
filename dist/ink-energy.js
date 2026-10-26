import * as T from './vendor/three.module.js';
// Original vector silhouettes derived from the Ink Energy concept board.
// Four prebuilt drawings, no textures, no per-frame geometry allocations.
export const inkMaterial=color=>new T.MeshBasicMaterial({color,transparent:true,opacity:1,depthWrite:false,side:T.DoubleSide,toneMapped:false});
const polygon=points=>{const shape=new T.Shape();points.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();return new T.ShapeGeometry(shape);};
const frameAt=(time,reduced)=>reduced?0:Math.floor(Math.max(0,time)*12)%4;
function layer(geometry,color,order,fixed=false){const m=new T.Mesh(geometry,inkMaterial(color));m.renderOrder=order;if(fixed)m.userData.fixedColor=color;return m;}
const lance=[[-1.55,0],[-.8,.10],[-1.15,.24],[-.35,.16],[-.65,.38],[.18,.22],[.02,.43],[.65,.23],[.46,.40],[1.5,0],[.45,-.34],[.62,-.16],[-.12,-.26],[-.02,-.13],[-.95,-.25],[-.55,-.08]];
const lanceCore=[[-1.35,0],[-.28,.06],[-.5,.15],[.44,.09],[.28,.21],[1.45,0],[.27,-.16],[.48,-.06],[-.4,-.08],[-.12,-.02]];
export function createInkBeam(){
 const g=new T.Group();g.name='ink-beam';const banks=[lance,lanceCore,lance].map((points,k)=>Array.from({length:4},(_,f)=>{
  const geometry=polygon(points.map(([x,y],i)=>[x,y*(1+Math.sin(i*2+f*1.7)*.13)*(k===2?1.14:1)]));geometry.rotateY(-Math.PI/2);geometry.translate(0,0,-1.15);return geometry;
 }));
 const panels=[];
 for(let plane=0;plane<3;plane++)for(const [bank,color,order,fixed] of [[2,'#17253b',1,true],[0,'#6fe7ff',2,false],[1,'#ffffff',3,true]]){
  const mesh=layer(banks[bank][0],color,order,fixed);mesh.rotation.z=plane*Math.PI/3;mesh.userData.whiteCore=bank===1;mesh.name=bank===1?'beam-white-core':'beam-ink-edge';g.add(mesh);panels.push({mesh,bank});
 }
 g.userData.updateInk=(time,reduced)=>{const frame=frameAt(time,reduced);g.userData.frame=frame;for(const {mesh,bank} of panels)mesh.geometry=banks[bank][frame];};
 g.userData.geometryBanks=banks;return g;
}
function brushRingGeometry(frame,band){
 const vertices=[],count=96;
 const bounds=i=>{const a=i/count*Math.PI*2,spike=(i+frame*3)%12===2?.17:0,wave=Math.sin(i*1.7+frame)*.018;
  const inner=[.83,.87,.90][band]+wave,outer=[1.055,1,.945][band]+wave+spike*(band===2?.45:1);return {a,inner,outer};};
 for(let i=0;i<count;i++){
  if((i+frame)%24>21)continue; // ink breaks, not a perfect UI torus
  const p=bounds(i),q=bounds(i+1),point=(v,r)=>[Math.cos(v.a)*r,Math.sin(v.a)*r,0];
  const a=point(p,p.inner),b=point(p,p.outer),c=point(q,q.outer),d=point(q,q.inner);vertices.push(...a,...b,...c,...a,...c,...d);
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(vertices,3));geometry.computeVertexNormals();geometry.computeBoundingSphere();return geometry;
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
 outline.scale.set(1.18,1.02,1);core.scale.set(.38,.84,1);g.add(outline,body,core);
 g.userData.updateInk=(time,reduced)=>{const f=frameAt(time,reduced);g.userData.frame=f;for(const mesh of g.children)mesh.geometry=banks[f];};g.userData.geometryBanks=[banks];return g;
}
