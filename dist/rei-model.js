import * as T from './vendor/three.module.js';
import {skinnedSurfaces} from './skinned-surfaces.js';
// Original spirit swordswoman: fitted coat, split tails and swept ivory hair.
function facePaint(){
 const size=128,data=new Uint8Array(size*size*4);
 const pixel=(x,y,c)=>{if(x>=0&&x<size&&y>=0&&y<size)data.set(c,(y*size+x)*4);};
 const oval=(cx,cy,rx,ry,c)=>{for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)pixel(x,y,c);};
 for(const side of [-1,1]){
  const cx=64+side*29;oval(cx,76,20,10,[39,31,49,255]);oval(cx,75,18,7,[240,231,219,255]);oval(cx-side*2,75,7,8,[68,119,143,255]);oval(cx-side*2,75,3,7,[23,33,52,255]);oval(cx-side*2-2,78,2,2,[255,255,240,255]);
  for(let x=-19;x<=19;x++)for(let j=0;j<3;j++)pixel(cx+x,94+Math.round(side*x*.12)+j,[93,77,83,255]);
 }
 oval(64,47,2,6,[155,99,89,160]);oval(64,25,10,1.5,[123,66,76,235]);oval(64,22,7,1,[230,164,154,130]);
 const map=new T.DataTexture(data,size,size);map.colorSpace=T.SRGBColorSpace;map.needsUpdate=true;return map;
}
function coatPaint(){
 const w=128,h=128,data=new Uint8Array(w*h*4);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const front=x<64,dx=Math.abs(x-32);let c=front?[121,62,98]:[98,49,85];
  if(front&&dx<8+y*.035)c=[224,216,199];
  if(front&&Math.abs(dx-(10+y*.05))<2)c=[191,153,134];
  if(front&&y>78&&y<115&&dx>12&&dx<20)c=[167,113,140];
  if(front&&y>40&&y<68&&dx>15&&dx<27)c=y>62?[164,105,130]:[81,43,76];
  if(!front&&Math.abs(x-96)<2)c=[161,105,133];
  if(!front&&y>53&&y<89&&Math.abs(Math.abs(x-96)-(y-53)*.3)<2)c=[192,170,141];
  if(y<5)c=[58,36,60];data.set([...c,255],(y*w+x)*4);
 }
 const map=new T.DataTexture(data,w,h);map.colorSpace=T.SRGBColorSpace;map.magFilter=T.NearestFilter;map.needsUpdate=true;return map;
}
export function buildRei(){
 const g=new T.Group(),bones=[],joint=(parent,x=0,y=0,z=0)=>{const b=new T.Bone();b.position.set(x,y,z);parent.add(b);bones.push(b);return b;};
 const body=joint(g),spine=joint(body,0,1.435),head=joint(spine,0,1.045),limbs=[],elbows=[],knees=[],clothParts=[];
 for(const side of [-1,1]){const arm=joint(spine,side*.37,.585),elbow=joint(arm,0,-.43),hand=joint(elbow,0,-.4),leg=joint(body,side*.18,1.26),knee=joint(leg,0,-.56);arm.userData.hand=hand;limbs.push(arm,leg);elbows.push(elbow);knees.push(knee);}
 for(const side of [-1,1])clothParts.push(joint(body,side*.18,1.4,-.10));
 const locks=[];for(const side of [-1,1]){const lock=joint(head,side*.18,.12,-.07);locks.push(lock);clothParts.push(lock);}
 const colors={skin:'#e0b39a',coat:'#ffffff',tail:'#793e62',trim:'#d4bd98',trousers:'#29313e',boots:'#403344',hair:'#d9d1bb',glove:'#c4bbb0'};
 const materials=Object.fromEntries(Object.entries(colors).map(([key,color])=>[key,new T.MeshLambertMaterial({color,vertexColors:true,...(key==='coat'?{map:coatPaint()}: {})})]));
 const {skeleton,surface:s,one:o,blend:b,batch}=skinnedSurfaces(body,bones,materials);
 s([[0,1.26,0,.23,.145,o(body)],[0,1.42,0,.215,.14,b(body,spine,.4)],[0,1.61,0,.24,.155,o(spine)],[0,1.82,.015,.30,.17,o(spine)],[0,1.98,0,.34,.14,o(spine)],[0,2.08,0,.105,.09,o(spine)]],'coat',16);
 s([[0,1.36,0,.236,.15,o(body)],[0,1.42,0,.23,.15,b(body,spine,.5)]],'trim');
 s([[0,2.06,0,.09,.085,o(spine)],[0,2.25,0,.09,.08,o(head)]],'skin');
 s([[0,2.22,.03,.035,.06,o(head)],[0,2.29,.02,.12,.13,o(head)],[0,2.42,0,.19,.175,o(head)],[0,2.56,-.01,.20,.17,o(head)],[0,2.68,-.02,.15,.13,o(head)],[0,2.72,-.02,.035,.035,o(head)]],'skin',16);
 for(let i=0;i<2;i++){
  const side=i?1:-1,x=side*.37,lx=side*.18,arm=limbs[i*2],elbow=elbows[i],hand=arm.userData.hand,leg=limbs[i*2+1],knee=knees[i];
  s([[side*.29,2.08,0,.07,.075,b(spine,arm,.6)],[x,2.01,0,.11,.11,o(arm)],[x,1.81,0,.09,.09,o(arm)],[x,1.65,0,.085,.08,b(arm,elbow,.2)],[x,1.58,0,.085,.08,b(arm,elbow,.5)],[x,1.49,0,.09,.085,b(arm,elbow,.85)],[x,1.31,0,.075,.075,o(elbow)],[x,1.21,0,.065,.065,o(hand)]],'tail');
  s([[x,1.30,0,.082,.08,o(elbow)],[x,1.25,0,.079,.077,o(elbow)]],'trim');
  s([[x,1.23,0,.065,.065,o(hand)],[x,1.16,.02,.09,.08,o(hand)],[x,1.07,.025,.085,.075,o(hand)],[x,1.04,.02,.03,.035,o(hand)]],'glove');
  s([[lx,1.42,0,.145,.145,b(body,leg,.35)],[lx,1.25,0,.14,.14,o(leg)],[lx,1.02,0,.115,.12,o(leg)],[lx,.77,0,.09,.095,b(leg,knee,.2)],[lx,.70,0,.085,.09,b(leg,knee,.5)],[lx,.62,0,.095,.095,o(knee)],[lx,.42,0,.09,.09,o(knee)],[lx,.20,0,.075,.075,o(knee)]],'trousers');
  s([[lx,.63,0,.1,.10,o(knee)],[lx,.43,0,.11,.105,o(knee)],[lx,.20,0,.09,.095,o(knee)],[lx,.14,.045,.11,.15,o(knee)],[lx,.055,.07,.115,.19,o(knee)],[lx,.025,.07,.115,.19,o(knee)]],'boots');
  s([[lx,.62,0,.104,.103,o(knee)],[lx,.58,0,.105,.103,o(knee)]],'trim');
  const tail=clothParts[i];s([[side*.17,1.38,-.10,.13,.055,o(tail)],[side*.21,1.10,-.13,.14,.05,o(tail)],[side*.27,.76,-.19,.15,.045,o(tail)],[side*.31,.45,-.24,.13,.035,o(tail)]],'tail',8);
  s([[side*.17,1.38,-.045,.015,.012,o(tail)],[side*.21,1.10,-.078,.015,.012,o(tail)],[side*.27,.76,-.143,.015,.012,o(tail)],[side*.31,.45,-.203,.015,.012,o(tail)]],'trim',6);
 }
 s([[0,1.18,0,.22,.14,o(body)],[0,1.3,0,.25,.15,o(body)],[0,1.40,0,.23,.145,o(body)]],'trousers');
 s([[0,2.52,-.045,.20,.17,o(head)],[0,2.66,-.04,.21,.17,o(head)],[0,2.77,-.04,.13,.12,o(head)],[0,2.80,-.04,.025,.025,o(head)]],'hair',12);
 for(let i=0;i<4;i++){const x=-.15+i*.085;s([[x,2.69,.09,.075,.06,o(head)],[x+.04,2.62,.14,.07,.045,o(head)],[x+.08,2.52+i*.027,.16,.006,.008,o(head)]],'hair',6);}
 for(let i=0;i<2;i++){const side=i?1:-1;s([[side*.18,2.62,-.07,.075,.08,o(locks[i])],[side*.21,2.40,-.09,.07,.065,o(locks[i])],[side*.22,2.16,-.10,.055,.04,o(locks[i])],[side*.25,2.02,-.06,.008,.008,o(locks[i])]],'hair',8);}
 // Facial detail is painted onto a curved patch; it adds no box-shaped features.
 const faceGeo=new T.PlaneGeometry(.34,.42,12,12),pos=faceGeo.attributes.position;
 for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i);pos.setZ(i,.105+.078*Math.sqrt(Math.max(0,1-(x/.205)**2))*Math.sqrt(Math.max(0,1-(y/.30)**2)));}faceGeo.computeVertexNormals();
 const face=new T.Mesh(faceGeo,new T.MeshLambertMaterial({map:facePaint(),transparent:true,alphaTest:.2}));face.position.y=-.015;head.add(face);
 const hand=limbs[2].userData.hand,dark=new T.MeshLambertMaterial({color:'#263341'}),gold=new T.MeshLambertMaterial({color:'#c5ab7b'}),steel=new T.MeshLambertMaterial({color:'#c3d5d7'});
 const grip=new T.Mesh(new T.CylinderGeometry(.037,.037,.23,8),dark);grip.position.z=.12;hand.add(grip);
 const guard=new T.Mesh(new T.TorusGeometry(.115,.018,5,12),gold);guard.rotation.x=Math.PI/2;guard.position.set(0,.10,.12);hand.add(guard);
 const blade=new T.Mesh(new T.ConeGeometry(.065,1.5,4),steel);blade.rotation.x=Math.PI/2;blade.scale.z=.28;blade.position.set(0,.12,.99);hand.add(blade);for(const n of [grip,guard,blade])n.userData.weapon=true;
 const ether=new T.MeshLambertMaterial({color:'#91dce0',transparent:true,opacity:.25,depthWrite:false,side:T.DoubleSide});
 const spirit=new T.Group();spirit.position.set(.55,1.55,-.38);body.add(spirit);spirit.userData.material=ether;
 const shroud=new T.Mesh(new T.CylinderGeometry(.22,.035,.75,8),ether);shroud.position.y=.2;spirit.add(shroud);
 const spiritHead=new T.Mesh(new T.SphereGeometry(.15,10,8),ether);spiritHead.scale.y=1.3;spiritHead.position.y=.72;spirit.add(spiritHead);
 for(const side of [-1,1]){const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute([side*.12,.65,0,side*.5,.25,-.08,side*.22,-.05,-.03,side*.12,.65,0,side*.22,-.05,-.03,side*.08,.15,.04],3));geo.computeVertexNormals();spirit.add(new T.Mesh(geo,ether));}
 const shadow=new T.Mesh(new T.CircleGeometry(.6,24),new T.MeshBasicMaterial({color:'#090f16',transparent:true,opacity:.35,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.015;g.add(shadow);
 const aura=new T.Mesh(new T.TorusGeometry(.72,.016,5,40),new T.MeshBasicMaterial({color:'#f2a0ce'}));aura.rotation.x=-Math.PI/2;aura.position.y=.025;g.add(aura);
 batch();return {g,body,spine,head,limbs,elbows,knees,clothParts,spirit,aura,id:1,skeleton,legLength:.56};
}
