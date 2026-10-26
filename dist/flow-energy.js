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
 loadMasks();const m=new T.ShaderMaterial({transparent:true,depthWrite:false,side:T.FrontSide,blending:T.AdditiveBlending,toneMapped:false,uniforms:{uSilhouette:{value:0},uColor:{value:new T.Color(color)},uTime:{value:0},uOpacity:{value:opacity},uNoise:{value:smoke},uTrace:{value:trace}},
 vertexShader:`varying vec2 vUv;varying vec3 vN;varying vec3 vV;void main(){vUv=uv;vec4 p=modelViewMatrix*vec4(position,1.);vN=normalize(normalMatrix*normal);vV=-p.xyz;gl_Position=projectionMatrix*p;}`,
 fragmentShader:`uniform vec3 uColor;uniform float uTime,uOpacity,uSilhouette;uniform sampler2D uNoise,uTrace;varying vec2 vUv;varying vec3 vN,vV;
 void main(){float n=texture2D(uNoise,vec2(fract(vUv.x*2.-uTime*.35),fract(vUv.y+uTime*.11))).a;
 float streak=texture2D(uTrace,vec2(fract(vUv.y*3.+uTime*.2),vUv.x)).a;
 float pulse=.5+.5*sin(vUv.x*38.-uTime*18.+sin(vUv.y*13.)*2.);
 float facing=abs(dot(normalize(vN),normalize(vV)));
 float density=smoothstep(.08,.72,n*.65+pulse*.25+streak*.45);
 float alpha=(.12+.88*density)*smoothstep(.03,.65,facing)*uOpacity;
 if(uSilhouette>.5){if(alpha<.08)discard;gl_FragColor=vec4(vec3(.025),1.);}else gl_FragColor=vec4(mix(uColor,vec3(1.),pow(density,5.)*.35),alpha);
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
 }else if(kind==='charge'||kind==='coil'){
  for(let j=0;j<3;j++)stroke(g,Array.from({length:17},(_,i)=>{const t=i/16,a=t*3.5+j*2.1;return [Math.cos(a)*.15*Math.sin(t*Math.PI),t*1.7,Math.sin(a)*.15];}),color,.014);
 }else{
  if(id===0)stroke(g,[[0,-1,0],[0,-.3,0],[0,.5,0],[0,1,0]],color,.05);
  if(id===1||id===3){stroke(g,arc(.8,-1.3,1.3),color,id===3?.055:.025);stroke(g,arc(.66,-1.1,1.15,-.06),color,.012);}
  if(id===2)stroke(g,[[-.15,-.9,0],[.15,-.35,.06],[-.1,-.05,0],[.2,.35,-.06],[0,.95,0]],color,.028);
  if(id===4)for(let j=0;j<3;j++)stroke(g,[[0,-.8,0],[Math.sin(j*2)*.22,-.2,Math.cos(j*2)*.1],[-.1,.4,0],[.15,.95,0]],color,j===0?.04:.014);
  if(id===5){stroke(g,[[0,-.9,0],[.32,0,.06],[0,.9,0],[-.32,0,-.06],[0,-.9,0]],color,.015);stroke(g,[[0,-.6,0],[0,.65,0]],color,.018);}
 }
 if(kind==='coil')g.scale.y=.24;
 const rotations=g.children.map(n=>n.rotation.clone());
 g.userData.updateFlow=(time,reduced=false,opacity=1,tint=color)=>{
  const t=reduced?0:time;
  g.traverse(n=>{if(!n.material)return;if(n.material.uniforms){n.material.uniforms.uTime.value=t;n.material.uniforms.uOpacity.value=opacity*.7;n.material.color.set(tint);}else{n.material.opacity=opacity*.9;n.material.color.set(tint).lerp(new T.Color('#ffffff'),.2);}});
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
