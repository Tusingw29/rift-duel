import * as T from './vendor/three.module.js';
import {vfxSettings} from './vfx-settings.js';
import {inkMaterial,facetColors} from './ink-energy.js';
// Original silhouette vocabulary. IDs match the roster, independent of costume materials.
export const energyStyles=[
 {name:'sentinel',color:'#6fe7ff',ink:'#102534',core:'#f4ffff',points:[[-.18,-.9],[.12,-.35],[.06,-.95],[.36,.15],[0,.95],[-.32,.1]]},
 {name:'echo',color:'#ed9ad9',ink:'#321b42',core:'#fff0ff',points:[[-.15,-1],[.5,-.6],[.65,0],[.5,.6],[-.15,1],[.22,.4],[.28,0],[.22,-.4]]},
 {name:'storm',color:'#ffb52e',ink:'#5a2917',core:'#fff6c9',points:[[-.35,-.8],[.05,-.35],[-.15,-.05],[.4,.9],[.16,.12],[.35,.2],[.02,-.65]]},
 {name:'gravebound',color:'#ba324d',ink:'#221729',core:'#c6a1de',points:[[-.25,-1],[.12,-.7],[-.08,-.5],[.36,-.25],[.18,0],[.5,.8],[.02,.45],[-.2,.6],[-.12,.1],[-.42,-.25]]},
 {name:'ember',color:'#ff673a',ink:'#542132',core:'#fff2b8',points:[[-.18,-.85],[-.4,-.35],[-.3,.25],[-.12,.05],[.15,1],[.23,.35],[.4,.6],[.35,-.1],[.1,-.55]]},
 {name:'oracle',color:'#b39aff',ink:'#271b46',core:'#f7edff',points:[[0,-.95],[.12,-.35],[.48,0],[.12,.35],[0,.95],[-.12,.35],[-.48,0],[-.12,-.35]]}
];
export const energyStyle=id=>{const base=energyStyles[id]||energyStyles[0],v=vfxSettings();return {...base,...v.palettes[id],points:v.shapes[id]||base.points};};
export function inkVolume(points,depth=.09){const s=new T.Shape();points.forEach(([x,y],i)=>i?s.lineTo(x,y):s.moveTo(x,y));s.closePath();const g=new T.ExtrudeGeometry(s,{depth,steps:1,bevelEnabled:false});g.translate(0,0,-depth/2);return facetColors(g);}
// Clip a scaled core against the original silhouette in local space. Scaling a
// concave polygon alone can make its bright core protrude outside the body.
export function signatureCoreGeometry(points,width,depth){
 const contour=points.map(([x,y])=>new T.Vector2(x,y));
 const triangles=T.ShapeUtils.triangulateShape(contour,[]);
 const center=contour.reduce((sum,p)=>sum.add(p),new T.Vector2()).multiplyScalar(1/contour.length);
 const cross=(a,b,p)=>(b.x-a.x)*(p.y-a.y)-(b.y-a.y)*(p.x-a.x);
 const shapes=[];
 for(const indices of triangles){
  const boundary=indices.map(i=>contour[i]);
  const sign=Math.sign(cross(boundary[0],boundary[1],boundary[2]));
  for(const inner of triangles){
   let polygon=inner.map(i=>new T.Vector2(center.x+(contour[i].x-center.x)*width,center.y+(contour[i].y-center.y)*.8));
   for(let edge=0;edge<3&&polygon.length;edge++){
    const a=boundary[edge],b=boundary[(edge+1)%3],next=[];
    for(let j=0;j<polygon.length;j++){
     const p=polygon[j],q=polygon[(j+1)%polygon.length],cp=cross(a,b,p)*sign,cq=cross(a,b,q)*sign;
     if(cp>=-1e-9)next.push(p);
     if((cp>=0)!==(cq>=0))next.push(p.clone().lerp(q,cp/(cp-cq)));
    }
    polygon=next;
   }
   if(polygon.length<3||Math.abs(T.ShapeUtils.area(polygon))<1e-8)continue;
   const shape=new T.Shape(polygon);shape.closePath();shapes.push(shape);
  }
 }
 const geometry=new T.ExtrudeGeometry(shapes,{depth,steps:1,bevelEnabled:false});geometry.translate(0,0,-depth/2);return facetColors(geometry);
}
export function createSignature(id){
 const style=energyStyle(id),v=vfxSettings(),g=new T.Group();g.name=`${style.name}-signature`;g.userData.style=id;
 let shape=inkVolume(style.points,v.signatureDepth),core=signatureCoreGeometry(style.points,v.signatureCore,v.signatureDepth);
 let shapeKey=JSON.stringify([style.points,v.signatureDepth]),coreKey=JSON.stringify([style.points,v.signatureDepth,v.signatureCore]);
 [style.ink,style.color,style.core].forEach((color,i)=>{const mesh=new T.Mesh(i===2?core:shape,inkMaterial(color));mesh.scale.set(i===0?v.signatureInk:1,i===0?1.06:1,1+i*.35);g.add(mesh);});
 if(id===5||id===1){const echo=g.children[1].clone();echo.material=echo.material.clone();echo.position.set(id===5?.38:-.18,0,-.22);echo.scale.multiplyScalar(.6);g.add(echo);}
 let paletteKey=JSON.stringify(v.palettes[id]||null);
 g.userData.updateInk=(time,reduced=false,opacity=1)=>{
  const v=vfxSettings(),s=energyStyle(id),newPaletteKey=JSON.stringify(v.palettes[id]||null),recolor=newPaletteKey!==paletteKey;paletteKey=newPaletteKey;
  const key=JSON.stringify([s.points,v.signatureDepth]),ckey=JSON.stringify([s.points,v.signatureDepth,v.signatureCore]);
  if(key!==shapeKey){const old=shape;shape=inkVolume(s.points,v.signatureDepth);g.children.forEach((n,i)=>{if(i!==2)n.geometry=shape;});old.dispose();shapeKey=key;}
  if(ckey!==coreKey){core.dispose();core=signatureCoreGeometry(s.points,v.signatureCore,v.signatureDepth);g.children[2].geometry=core;coreKey=ckey;}
  const frame=reduced?0:Math.floor(time*v.cadence)%4;g.userData.frame=frame;
  g.children.forEach((n,i)=>{n.material.opacity=opacity;if(i===0)n.scale.x=v.signatureInk;if(recolor)n.material.color.set([s.ink,s.color,s.core,s.color][i]);n.rotation.z=i===3?(frame-1)*.07:0;});
 };
 return g;
}
export function createChiCoil(){
 const g=new T.Group();g.name='bone-chi-coil';
 const points=Array.from({length:33},(_,i)=>{const t=i/32,a=t*Math.PI*3;return new T.Vector3(Math.cos(a)*.14,t*.4,Math.sin(a)*.14);});
 const curve=new T.CatmullRomCurve3(points);
 for(const [radius,color] of [[.043,'#5a2917'],[.03,'#ffb52e'],[.012,'#fff6c9']]){
  const highlight=radius===.012?new T.CatmullRomCurve3(points.map(p=>new T.Vector3(p.x*1.16,p.y,p.z*1.16))):curve;
  const mesh=new T.Mesh(facetColors(new T.TubeGeometry(highlight,32,radius,4,false)),inkMaterial(color));if(radius===.043)mesh.material.side=T.BackSide;g.add(mesh);
 }
 g.userData.updateInk=(time,reduced)=>{g.children.forEach(n=>n.rotation.y=reduced?0:Math.floor(time*vfxSettings().cadence)*.32);};return g;
}
export function createShockwave(id){
 const g=new T.Group();g.name='cracked-ground-shockwave';const style=energyStyle(id);
 for(let j=0;j<12;j++){
  const a=j*Math.PI/6,shape=inkVolume([[-.07,0],[.04,.22],[-.02,.45],[.09,.63],[.02,.9],[-.08,.5]],.035);
  const crack=new T.Mesh(shape,inkMaterial(j%3===0?style.core:style.color));crack.rotation.set(-Math.PI/2,0,a);crack.position.set(Math.sin(a)*.4,.035,Math.cos(a)*.4);g.add(crack);
 }
 g.userData.updateInk=(age,reduced=false)=>{const frame=reduced?1:Math.min(3,Math.floor(age/3));g.scale.setScalar(.5+frame*.5);g.children.forEach((s,j)=>{s.visible=frame<2||j%3!==frame-2;s.material.opacity=1-frame*.22;});};return g;
}
// Bone positions are read AFTER animation/cinematic transforms, never written.
export function socket(model,kind,out=new T.Vector3()){
 const node=kind==='chest'?model.spine:kind==='pelvis'?model.body:kind==='leftHand'?model.limbs?.[0]?.userData.hand:kind==='rightHand'?model.limbs?.[2]?.userData.hand:kind==='leftFoot'?model.feet?.[0]:model.feet?.[1];
 if(node)return node.getWorldPosition(out);
 model.g.getWorldPosition(out);if(kind==='chest')out.y+=1.45;return out;
}
export function createSignatureField(id){
 const g=new T.Group();g.name='signature-field';for(let i=0;i<4;i++){const s=createSignature(id);s.rotation.y=i*Math.PI/2;s.position.set(Math.sin(i*Math.PI/2)*.35,0,Math.cos(i*Math.PI/2)*.35);g.add(s);}
 g.userData.updateInk=(time,reduced,opacity=1)=>g.children.forEach(s=>s.userData.updateInk(time,reduced,opacity));return g;
}
