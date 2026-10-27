import * as T from './vendor/three.module.js';
import {vfxSettings} from './vfx-settings.js';
// Closed curved volumes with flowing translucent surfaces. Imported images are
// masks on these volumes, not camera-facing replacement sprites.
const fallback=new T.DataTexture(new Uint8Array([255,255,255,255]),1,1);fallback.needsUpdate=true;
let smoke=fallback,trace=fallback,loading=false;
const materials=new Set();
export const flowMaskStatus=()=>({smoke:smoke!==fallback,trace:trace!==fallback});
function loadMasks(){
 if(loading||typeof document==='undefined')return;loading=true;
 const loader=new T.TextureLoader();
 for(const name of ['smoke','trace'])loader.load(new URL(`./assets/vfx/kenney/${name}_01.png`,import.meta.url).href,t=>{
  t.wrapS=t.wrapT=T.RepeatWrapping;t.colorSpace=T.NoColorSpace;
  if(name==='smoke')smoke=t;else trace=t;
  for(const m of materials)m.uniforms[name==='smoke'?'uNoise':'uTrace'].value=t;
 });
}
function surface(color,opacity=.65){
 loadMasks();const m=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.FrontSide,blending:T.AdditiveBlending,toneMapped:false,uniforms:{uSilhouette:{value:0},uWhiten:{value:.35},uColor:{value:new T.Color(color)},uTime:{value:0},uOpacity:{value:opacity},uNoise:{value:smoke},uTrace:{value:trace}},
 vertexShader:`varying vec2 vUv;varying vec3 vN;varying vec3 vV;void main(){vUv=uv;vec4 p=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=-p.xyz;gl_Position=projectionMatrix*p;}`,
 fragmentShader:`uniform vec3 uColor;uniform float uTime,uOpacity,uSilhouette,uWhiten;uniform sampler2D uNoise,uTrace;varying vec2 vUv;varying vec3 vN,vV;
 void main(){float n=texture2D(uNoise,vec2(fract(vUv.x*2.-uTime*.35),fract(vUv.y+uTime*.11))).a;
 float streak=texture2D(uTrace,vec2(fract(vUv.y*3.+uTime*.2),vUv.x)).a;
 float pulse=.5+.5*sin(vUv.x*38.-uTime*18.+sin(vUv.y*13.)*2.);
 float facing=abs(dot(normalize(vN),normalize(vV)));
 float density=smoothstep(.08,.72,n*.65+pulse*.25+streak*.45);
 float alpha=(.12+.88*density)*smoothstep(.03,.65,facing)*uOpacity;
 if(uSilhouette>.5){if(alpha<.08)discard;gl_FragColor=vec4(vec3(.025),1.);}else gl_FragColor=vec4(mix(uColor,vec3(1.),pow(density,5.)*uWhiten),alpha);
 #include <tonemapping_fragment>
 #include <colorspace_fragment>
 }`});
 // Existing projectile/capture code can still tint materials through .color.
 m.color=m.uniforms.uColor.value;materials.add(m);m.addEventListener('dispose',()=>materials.delete(m));return m;
}
function tube(points,radius=.04){
 const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),segments=Math.max(32,points.length*8);
 const geometry=new T.TubeGeometry(curve,segments,radius,8,false),pos=geometry.attributes.position;
 // Taper ends to a point, closing the longitudinal surface without flat caps.
 for(let i=0;i<=segments;i++){
  const t=i/segments,center=curve.getPointAt(t),taper=Math.pow(Math.sin(Math.PI*t),.45);
  for(let j=0;j<=8;j++){const k=i*9+j;pos.setXYZ(k,center.x+(pos.getX(k)-center.x)*taper,center.y+(pos.getY(k)-center.y)*taper,center.z+(pos.getZ(k)-center.z)*taper);}
 }
 geometry.computeVertexNormals();return geometry;
}
function stroke(g,points,color,radius=.05){
 const geometry=tube(points,radius),core=new T.Mesh(geometry,new T.MeshBasicMaterial({color:new T.Color(color).lerp(new T.Color('#ffffff'),.2),transparent:true,opacity:.9,depthWrite:false,toneMapped:false}));core.name='energy-filament';g.add(core);
 const shell=new T.Mesh(tube(points,radius*3.5),surface(color,.7));shell.name='energy-flow-shell';g.add(shell);
 return shell;
}
// A closed blade-shaped volume: two wide faces and thin sidewalls. Width
// varies along its path; unlike a round tube it reads as a cutting surface.
function blade(g,points,width,color,{dark=false,ragged=0}={}){
 const curve=new T.CatmullRomCurve3(points.map(p=>new T.Vector3(...p))),positions=[],uv=[],indices=[],segments=64;
 for(let i=0;i<=segments;i++){
  const t=i/segments,c=curve.getPoint(t),d=curve.getTangent(t),side=new T.Vector3(-d.y,d.x,0).normalize();
  const envelope=Math.pow(Math.sin(Math.PI*t),.7),w=width*envelope*(1-ragged*(.5+.5*Math.sin(t*93)));
  for(const [edge,z] of [[-1,-1],[1,-1],[-1,1],[1,1]]){positions.push(c.x+side.x*w*edge,c.y+side.y*w*edge,c.z+z*.018*envelope);uv.push(t,edge<0?0:1);}
  if(i<segments){const a=i*4,b=a+4;for(const [x,y] of [[0,1],[1,3],[3,2],[2,0]])indices.push(a+x,b+x,a+y,a+y,b+x,b+y);}
 }
 const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('uv',new T.Float32BufferAttribute(uv,2));geometry.setIndex(indices);geometry.computeVertexNormals();
 const material=dark?new T.MeshBasicMaterial({color,transparent:true,opacity:.8,depthWrite:false,side:T.DoubleSide,toneMapped:false}):surface(color,.65);
 material.side=T.DoubleSide;material.userData.energyRole=dark?'shadow':'body';
 if(!dark){material.blending=T.NormalBlending;material.uniforms.uWhiten.value=0;}
 const mesh=new T.Mesh(geometry,material);mesh.name=dark?'energy-shadow-blade':'energy-cutting-sheet';g.add(mesh);return mesh;
}
function sparks(g,count,color){
 for(let i=0;i<count;i++){
  const a=i*2.399,mesh=new T.Mesh(new T.OctahedronGeometry(.025),new T.MeshBasicMaterial({color,transparent:true,opacity:.8,depthWrite:false,toneMapped:false}));
  mesh.name='energy-cinder';mesh.position.set(Math.cos(a)*(.35+i*.045),Math.sin(a)*(.35+i*.045),Math.sin(i*1.7)*.18);mesh.scale.set(.5,1.8,.5);mesh.rotation.z=-a;mesh.userData.home=mesh.position.clone();mesh.userData.phase=i/count;g.add(mesh);
 }
}
function arc(radius,start,end,z=0){return Array.from({length:17},(_,i)=>{const a=start+(end-start)*i/16;return [Math.cos(a)*radius,Math.sin(a)*radius,z+Math.sin(a*2)*.045];});}
export function createFlowEnergy(kind,id=0,color='#6fe7ff'){
 const g=new T.Group();g.name=`flow-${kind}`;g.userData.kind=kind;
 if(kind==='beam'){
  stroke(g,[[0,0,-2.7],[0,0,-1.5],[0,0,-.2],[0,0,.35]],color,.055);
  for(let j=0;j<3;j++){const points=Array.from({length:25},(_,i)=>{const t=i/24,a=t*Math.PI*3+j*Math.PI*2/3,r=Math.sin(t*Math.PI)*.15;return [Math.cos(a)*r,Math.sin(a)*r,-2.6+t*2.9];});stroke(g,points,color,.012);}
 }else if(kind==='capture'){
  for(let j=0;j<3;j++)stroke(g,arc(.96+j*.025,j*2.1,j*2.1+4.9,j*.025-.025),color,j===0?.015:.008);
  const meridian=new T.Group();stroke(meridian,arc(.98,.15,Math.PI*1.8),color,.008);meridian.rotation.y=.55;g.add(meridian);
  for(let j=0;j<8;j++){const a=j*Math.PI/4,p=new T.Vector3(Math.cos(a)*1.03,Math.sin(a)*1.03,0),s=new T.Mesh(new T.OctahedronGeometry(.035),new T.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.85,depthWrite:false}));s.position.copy(p);s.scale.set(.6,1.8,.6);s.rotation.z=a-Math.PI/2;g.add(s);}
 }else if(kind==='burst'){
  for(let j=0;j<9;j++){
   const a=j*2.399,z=Math.sin(j*1.7)*.55;
   stroke(g,[[Math.cos(a)*.06,Math.sin(a)*.06,z*.08],[Math.cos(a)*.28,Math.sin(a)*.28,z*.4],[Math.cos(a)*.65,Math.sin(a)*.65,z]],color,j%3===0?.017:.008);
  }
 }else if(kind==='charge'||kind==='coil'){
  for(let j=0;j<3;j++)stroke(g,Array.from({length:17},(_,i)=>{const t=i/16,a=t*3.5+j*2.1;return [Math.cos(a)*.15*Math.sin(t*Math.PI),t*1.7,Math.sin(a)*.15];}),color,.014);
 }else{
  if(id===0){
   blade(g,[[0,-1,0],[0,0,0],[0,1,0]],.085,color);stroke(g,[[0,-1.05,0],[0,1.05,0]],color,.018);
  }
  if(id===1){
   for(let j=0;j<2;j++){
    const points=arc(.8-j*.16,-1.25,1.25,j*.16).map(([x,y,z])=>[x-.5+j*.12,y+j*.23,z]);
    blade(g,points,.065,color);stroke(g,points,color,.009);
   }
   sparks(g,5,color);
  }
  if(id===2){
   const points=[[-.15,-.9,0],[.15,-.35,.06],[-.1,-.05,0],[.2,.35,-.06],[0,.95,0]];
   stroke(g,points,color,.018);stroke(g,[[.1,-.35,.04],[-.3,-.1,.06],[-.22,.15,0]],color,.008);sparks(g,5,color);
  }
  if(id===3){
   const points=arc(.86,-1.45,1.45).map(([x,y,z])=>[x-.4,y,z]);
   blade(g,points,.2,color,{dark:true,ragged:.22});
   blade(g,points.map(([x,y,z])=>[x,y,z+.025]),.115,color,{ragged:.35});
   stroke(g,points.map(([x,y,z])=>[x+.09,y,z+.05]),color,.012);
   sparks(g,9,color);
  }
  if(id===4){
   for(let j=0;j<3;j++){
    const points=[[(j-1)*.13,-.85,j*.065],[(j-1)*.24,-.2,j*.065],[.12-(j-1)*.12,.3,j*.065],[(j-1)*.32,.85-j*.12,j*.065]];
    blade(g,points,.13-j*.025,color,{ragged:.13});stroke(g,points,color,.008);
   }
   sparks(g,8,color);
  }
  if(id===5){
   // Individual straight edges preserve the seal's corners (no spline rounding).
   for(const scale of [1,.64]){
    const vertices=[[0,-.95,0],[.4,0,.08],[0,.95,0],[-.4,0,-.08],[0,-.95,0]].map(p=>p.map(x=>x*scale));
    for(let i=0;i<4;i++)stroke(g,[vertices[i],vertices[i+1]],color,.009);
   }
   stroke(g,[[0,-.45,0],[0,.45,0]],color,.014);sparks(g,4,color);
  }
 }
 if(kind==='coil')g.scale.y=.24;
 const rotations=g.children.map(n=>n.rotation.clone());
 g.userData.updateFlow=(time,reduced=false,opacity=1,tint=color)=>{
  const t=reduced?0:time;
  g.traverse(n=>{if(!n.material)return;const role=n.material.userData.energyRole;
   if(n.material.uniforms){n.material.uniforms.uTime.value=t;n.material.uniforms.uOpacity.value=opacity*(role==='body'?.9:.7);n.material.color.set(tint);}
   else{n.material.opacity=opacity*(role==='shadow'?.85:.9);n.material.color.set(tint);if(role==='shadow')n.material.color.multiplyScalar(.18);else if(id!==3)n.material.color.lerp(new T.Color('#ffffff'),.12);}
   if(n.userData.home){const phase=(t*.6+n.userData.phase)%1;n.position.copy(n.userData.home).multiplyScalar(.8+phase*.45);n.material.opacity*=Math.sin(phase*Math.PI);}
  });
  if(kind==='capture')g.children.forEach((n,i)=>{n.rotation.copy(rotations[i]);if(i<6)n.rotation.z+=t*(Math.floor(i/2)%2?.22:-.17);});
 };
 return g;
}
export function attachFlowEnergy(g,kind,id=0,color='#6fe7ff'){
 const original=g.userData.updateInk,legacy=[...g.children];let flow=null,visibility=null;
 g.userData.updateInk=(time,reduced=false,opacity=1)=>{
  if(visibility)legacy.forEach((n,i)=>n.visible=visibility[i]);
  original(time,reduced,opacity);
  if(!vfxSettings().flowEnergy){if(flow)flow.visible=false;visibility=null;return;}
  if(!flow){flow=createFlowEnergy(kind,id,color);g.add(flow);}
  visibility=legacy.map(n=>n.visible);legacy.forEach(n=>n.visible=false);flow.visible=true;
  const tint=kind==='capture'?legacy[1]?.material.color:kind==='signature'?legacy[1]?.material.color:kind==='beam'?legacy[0]?.material.color:color;
  flow.userData.updateFlow(time,reduced,opacity,tint);
  if(kind==='beam')flow.scale.set(vfxSettings().beamWidth,vfxSettings().beamWidth,1);
 };
 return g;
}
