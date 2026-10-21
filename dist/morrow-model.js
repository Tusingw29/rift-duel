import * as T from './vendor/three.module.js';
import {skinnedSurfaces} from './skinned-surfaces.js';
function armorPaint(){
 const size=64,data=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const front=x<32,dx=Math.abs(x-16);let c=[103,124,103];
  if(front&&dx<2)c=[182,164,112];
  if(front&&y>26&&y<50&&dx>4&&dx<13)c=[71,91,78];
  if(front&&y>45&&y<49&&dx>4&&dx<13)c=[153,166,130];
  if(y<5)c=[48,64,58];
  if((y===12||y===55)&&(x%16===4||x%16===12))c=[203,190,145];
  data.set([...c,255],(y*size+x)*4);
 }
 const map=new T.DataTexture(data,size,size);map.colorSpace=T.SRGBColorSpace;map.magFilter=T.NearestFilter;map.needsUpdate=true;return map;
}
function facePaint(){
 const size=128,data=new Uint8Array(size*size*4);
 const put=(x,y,c)=>{if(x>=0&&x<size&&y>=0&&y<size)data.set(c,(y*size+x)*4);};
 const oval=(cx,cy,rx,ry,c)=>{for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)put(x,y,c);};
 // A narrow weathered eye, heavy brow and an original dark optical patch.
 oval(35,79,20,6,[58,45,38,255]);oval(35,78,17,3,[227,211,175,255]);oval(36,78,5,5,[103,125,99,255]);oval(36,78,2,4,[25,35,31,255]);
 for(let x=15;x<55;x++)for(let j=0;j<5;j++)put(x,92+Math.round((x-35)*-.11)+j,[73,76,64,255]);
 oval(94,80,20,16,[40,49,47,255]);oval(94,80,9,5,[90,120,102,255]);oval(94,80,3,2,[211,179,111,255]);
 for(let x=0;x<size;x++)for(let j=0;j<4;j++)put(x,102-Math.round(x*.14)+j,[51,56,49,230]);
 oval(64,54,4,10,[153,111,79,190]);oval(64,30,16,2,[86,61,46,240]);
 for(let y=38;y<92;y++)put(51+Math.round((y-38)*.08),y,[153,92,73,170]);
 const map=new T.DataTexture(data,size,size);map.colorSpace=T.SRGBColorSpace;map.needsUpdate=true;return map;
}
export function buildMorrow(){
 const g=new T.Group(),bones=[],joint=(parent,x=0,y=0,z=0)=>{const n=new T.Bone();n.position.set(x,y,z);parent.add(n);bones.push(n);return n;};
 const body=joint(g),spine=joint(body,0,1.4),head=joint(spine,0,1.08),limbs=[],elbows=[],knees=[],clothParts=[];
 for(const side of [-1,1]){const arm=joint(spine,side*.52,.62),elbow=joint(arm,0,-.43),hand=joint(elbow,0,-.4),leg=joint(body,side*.25,1.26),knee=joint(leg,0,-.56);arm.userData.hand=hand;limbs.push(arm,leg);elbows.push(elbow);knees.push(knee);}
 const mantle=joint(spine,0,.72,-.22);clothParts.push(mantle);
 const colors={skin:'#bd9875',armor:'#ffffff',plate:'#6c826e',edge:'#b6ab7d',cloth:'#35413b',boot:'#303b37',hair:'#687063'};
 const materials=Object.fromEntries(Object.entries(colors).map(([name,color])=>[name,new T.MeshLambertMaterial({color,vertexColors:true,...(name==='armor'?{map:armorPaint()}: {})})]));
 const {skeleton,surface:s,one:o,blend:b,batch}=skinnedSurfaces(body,bones,materials);
 s([[0,1.24,0,.32,.20,o(body)],[0,1.4,0,.31,.19,b(body,spine,.4)],[0,1.64,0,.39,.23,o(spine)],[0,1.87,0,.46,.25,o(spine)],[0,2.04,0,.43,.19,o(spine)],[0,2.12,0,.16,.13,o(spine)]],'armor',12);
 s([[0,1.27,0,.335,.21,o(body)],[0,1.38,0,.33,.205,b(body,spine,.3)]],'edge');
 s([[0,2.06,0,.145,.13,o(spine)],[0,2.28,0,.13,.12,o(head)]],'skin');
 // Broad jaw and brow, with a tapered beard rather than a separate chin block.
 s([[0,2.20,.025,.11,.10,o(head)],[0,2.29,.015,.19,.16,o(head)],[0,2.43,0,.23,.19,o(head)],[0,2.58,-.015,.225,.18,o(head)],[0,2.69,-.02,.16,.14,o(head)],[0,2.73,-.02,.035,.04,o(head)]],'skin',16);
 s([[0,2.16,.06,.075,.09,o(head)],[0,2.24,.055,.17,.17,o(head)],[0,2.32,.045,.21,.19,o(head)],[0,2.36,.04,.215,.195,o(head)]],'hair',12);
 s([[0,2.58,-.045,.225,.17,o(head)],[0,2.72,-.045,.20,.15,o(head)],[0,2.80,-.07,.11,.10,o(head)]],'hair',10);
 for(let j=0;j<4;j++){const x=(j-1.5)*.09;s([[x,2.7,-.02,.07,.07,o(head)],[x+.04,2.82,-.09,.04,.05,o(head)],[x+.07,2.85,-.15,.005,.008,o(head)]],'hair',5);}
 for(let i=0;i<2;i++){
  const side=i?1:-1,x=side*.52,lx=side*.25,arm=limbs[i*2],elbow=elbows[i],hand=arm.userData.hand,leg=limbs[i*2+1],knee=knees[i];
  s([[side*.41,2.11,0,.09,.12,b(spine,arm,.4)],[x,2.02,0,.17,.17,o(arm)],[x,1.83,0,.145,.15,o(arm)],[x,1.67,0,.115,.12,b(arm,elbow,.2)],[x,1.59,0,.115,.115,b(arm,elbow,.5)],[x,1.50,0,.135,.13,b(arm,elbow,.85)],[x,1.32,0,.11,.105,o(elbow)],[x,1.20,0,.09,.085,o(hand)]],'cloth');
  // Broad overlapping shoulder shells and long forearm guards.
  s([[x,1.91,0,.21,.21,o(arm)],[x,2.04,0,.25,.24,o(arm)],[side*.48,2.18,0,.19,.20,b(spine,arm,.9)]],'plate',8);
  s([[x,1.91,0,.215,.215,o(arm)],[x,1.96,0,.23,.225,o(arm)]],'edge',8);
  s([[x,1.52,.015,.15,.15,o(elbow)],[x,1.41,.025,.16,.15,o(elbow)],[x,1.24,.025,.115,.12,o(hand)]],'plate',8);
  s([[x,1.25,.025,.12,.125,o(hand)],[x,1.20,.025,.12,.12,o(hand)]],'edge',8);
  s([[x,1.22,0,.085,.085,o(hand)],[x,1.14,.025,.12,.10,o(hand)],[x,1.04,.035,.115,.10,o(hand)],[x,1.00,.025,.055,.05,o(hand)]],'boot',8);
  s([[lx,1.4,0,.19,.19,b(body,leg,.3)],[lx,1.21,0,.18,.18,o(leg)],[lx,.98,0,.15,.15,o(leg)],[lx,.77,0,.115,.12,b(leg,knee,.2)],[lx,.70,0,.115,.12,b(leg,knee,.5)],[lx,.60,0,.13,.13,o(knee)],[lx,.39,0,.115,.12,o(knee)],[lx,.18,0,.10,.10,o(knee)]],'cloth');
  s([[lx,.77,.07,.135,.13,o(knee)],[lx,.69,.08,.155,.15,o(knee)],[lx,.60,.06,.13,.12,o(knee)]],'plate',8);
  s([[lx,.58,.02,.135,.135,o(knee)],[lx,.37,.025,.14,.14,o(knee)],[lx,.18,.03,.11,.12,o(knee)]],'plate',8);
  s([[lx,.21,.025,.115,.12,o(knee)],[lx,.14,.07,.14,.19,o(knee)],[lx,.055,.10,.155,.23,o(knee)],[lx,.025,.10,.155,.23,o(knee)]],'boot',8);
 }
 s([[0,1.12,0,.30,.19,o(body)],[0,1.27,0,.35,.21,o(body)],[0,1.35,0,.33,.20,o(body)]],'cloth');
 s([[0,2.10,-.23,.32,.04,o(mantle)],[0,1.87,-.29,.37,.035,o(mantle)],[0,1.53,-.31,.32,.03,o(mantle)],[0,1.30,-.33,.27,.025,o(mantle)]],'cloth',8);
 const faceGeo=new T.PlaneGeometry(.39,.36,12,12),fp=faceGeo.attributes.position;
 for(let i=0;i<fp.count;i++){const x=fp.getX(i),y=fp.getY(i);fp.setZ(i,.12+.079*Math.sqrt(Math.max(0,1-(x/.24)**2))*Math.sqrt(Math.max(0,1-(y/.28)**2)));}faceGeo.computeVertexNormals();
 const face=new T.Mesh(faceGeo,new T.MeshLambertMaterial({map:facePaint(),transparent:true,alphaTest:.2}));face.position.y=.015;head.add(face);
 const black=new T.MeshLambertMaterial({color:'#202b2a'}),steel=new T.MeshLambertMaterial({color:'#aab7a5',flatShading:true}),brass=new T.MeshLambertMaterial({color:'#b4a276'});
 // Recessed launcher mouths are attached to the shoulder bones.
 for(let i=0;i<2;i++)for(let j=0;j<3;j++){const port=new T.Mesh(new T.CylinderGeometry(.033,.033,.025,8),black);port.rotation.x=Math.PI/2;port.position.set((j-1)*.085,.045,.24);limbs[i*2].add(port);}
 const hand=limbs[2].userData.hand,grip=new T.Mesh(new T.CylinderGeometry(.045,.045,.3,8),black);grip.position.z=.12;hand.add(grip);
 const guard=new T.Mesh(new T.BoxGeometry(.45,.07,.14),brass);guard.position.set(0,.1,.14);hand.add(guard);
 // A broad beveled cleaver-like greatsword, with a reinforced center ridge.
 const points=[[-.17,0],[.17,0],[.21,1.35],[.10,1.65],[0,1.82],[-.16,1.53]],pos=[],indices=[];
 for(const depth of [-.035,.035])for(const [x,z] of points)pos.push(x,depth,z);
 pos.push(0,.065,.72,0,-.065,.72);
 for(let i=0;i<6;i++){const j=(i+1)%6;indices.push(12,6+i,6+j,13,j,i,i,j,6+j,i,6+j,6+i);}
 for(let i=0;i<indices.length;i+=3)[indices[i+1],indices[i+2]]=[indices[i+2],indices[i+1]];
 const bladeGeo=new T.BufferGeometry();bladeGeo.setAttribute('position',new T.Float32BufferAttribute(pos,3));bladeGeo.setIndex(indices);bladeGeo.computeVertexNormals();const blade=new T.Mesh(bladeGeo,steel);blade.position.set(0,.12,.24);blade.castShadow=true;hand.add(blade);
 const shadow=new T.Mesh(new T.CircleGeometry(.75,24),new T.MeshBasicMaterial({color:'#090f16',transparent:true,opacity:.35,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.015;g.add(shadow);
 const aura=new T.Mesh(new T.TorusGeometry(.82,.018,5,40),new T.MeshBasicMaterial({color:'#a5c69e'}));aura.rotation.x=-Math.PI/2;aura.position.y=.025;g.add(aura);
 batch();return {g,body,spine,head,limbs,elbows,knees,clothParts,aura,spirit:null,id:3,skeleton,legLength:.56};
}
