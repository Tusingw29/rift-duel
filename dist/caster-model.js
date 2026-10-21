import * as T from './vendor/three.module.js';
import {skinnedSurfaces} from './skinned-surfaces.js';
function paint(oracle,face=false){
 const size=128,data=new Uint8Array(size*size*4);
 const put=(x,y,c)=>{if(x>=0&&x<size&&y>=0&&y<size)data.set(c,(y*size+x)*4);};
 if(face){
  const oval=(cx,cy,rx,ry,c)=>{for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)put(x,y,c);};
  for(const side of [-1,1]){const cx=64+side*29;oval(cx,77,20,oracle?9:7,[44,31,46,255]);oval(cx,76,18,oracle?6:5,[243,235,213,255]);oval(cx-side,76,7,7,oracle?[162,121,65,255]:[68,129,113,255]);oval(cx-side,76,3,6,[28,31,39,255]);oval(cx-side-2,79,2,2,[255,255,240,255]);for(let x=-19;x<20;x++)for(let j=0;j<3;j++)put(cx+x,95+Math.round(side*x*.1)+j,oracle?[86,63,110,255]:[100,54,37,255]);}
  oval(64,47,2,6,[156,102,87,160]);oval(64,25,10,1.5,[117,64,73,240]);if(oracle)oval(64,111,3,6,[194,164,104,255]);
 }else for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const front=x<64,dx=Math.abs(x-32);let c=oracle?[75,53,111]:[142,61,46];
  if(front&&dx<9)c=oracle?[201,190,214]:[224,198,146];
  if(front&&dx>=9&&dx<12)c=[190,158,99];
  if(front&&y>73&&dx>13&&dx<25)c=oracle?[119,98,153]:[178,92,60];
  if(!front&&y>35&&y<90&&Math.abs(Math.abs(x-96)-(y-35)*.23)<2)c=[195,167,115];
  if(y<5)c=oracle?[43,34,67]:[81,40,34];put(x,y,[...c,255]);
 }
 const map=new T.DataTexture(data,size,size);map.colorSpace=T.SRGBColorSpace;map.magFilter=T.NearestFilter;map.needsUpdate=true;return map;
}
// Shared anatomy, separately authored costume/hair/weapon silhouettes for the
// two original caster roles. Cloth panels have their own bones instead of a cone.
export function buildCaster(id){
 const oracle=id===5,g=new T.Group(),bones=[],joint=(parent,x=0,y=0,z=0)=>{const n=new T.Bone();n.position.set(x,y,z);parent.add(n);bones.push(n);return n;};
 const width=oracle?.34:.37,body=joint(g),spine=joint(body,0,1.42),head=joint(spine,0,1.06),limbs=[],elbows=[],knees=[],clothParts=[];
 for(const side of [-1,1]){const arm=joint(spine,side*width,.6),elbow=joint(arm,0,-.43),hand=joint(elbow,0,-.4),leg=joint(body,side*.18,1.26),knee=joint(leg,0,-.56);arm.userData.hand=hand;limbs.push(arm,leg);elbows.push(elbow);knees.push(knee);}
 const panels=[];for(const [x,z] of [[-.22,.08],[.22,.08],[0,-.17]]){const bone=joint(body,x,1.38,z);panels.push(bone);clothParts.push(bone);}
 const hairLocks=[];if(oracle)for(const side of [-1,1]){const bone=joint(head,side*.18,.13,-.08);hairLocks.push(bone);clothParts.push(bone);}
 const colors={skin:oracle?'#d9b5ad':'#d4a17e',coat:'#ffffff',cloth:oracle?'#594476':'#a14c38',pale:oracle?'#d3cbdc':'#d6bd8e',trim:'#c3a26c',pants:oracle?'#352e4b':'#43382f',boot:oracle?'#4a3d60':'#674737',hair:oracle?'#aaa0c5':'#a2643e'};
 const materials=Object.fromEntries(Object.entries(colors).map(([name,color])=>[name,new T.MeshLambertMaterial({color,vertexColors:true,...(name==='coat'?{map:paint(oracle)}:{})})]));
 const {skeleton,surface:s,one:o,blend:b,batch}=skinnedSurfaces(body,bones,materials);
 s([[0,1.25,0,.23,.15,o(body)],[0,1.43,0,.21,.14,b(body,spine,.4)],[0,1.65,0,.25,.16,o(spine)],[0,1.83,.01,oracle?.29:.31,.175,o(spine)],[0,1.98,0,width-.03,.14,o(spine)],[0,2.08,0,.10,.09,o(spine)]],'coat',16);
 s([[0,1.32,0,.245,.155,o(body)],[0,1.40,0,.235,.15,b(body,spine,.3)]],'trim');
 s([[0,2.06,0,.09,.085,o(spine)],[0,2.24,0,.09,.085,o(head)]],'skin');
 s([[0,2.22,.02,.04,.055,o(head)],[0,2.29,.015,.125,.13,o(head)],[0,2.42,0,.19,.175,o(head)],[0,2.56,-.01,.20,.17,o(head)],[0,2.68,-.02,.15,.13,o(head)],[0,2.72,-.02,.03,.035,o(head)]],'skin',16);
 for(let i=0;i<2;i++){
  const side=i?1:-1,x=side*width,lx=side*.18,arm=limbs[i*2],elbow=elbows[i],hand=arm.userData.hand,leg=limbs[i*2+1],knee=knees[i];
  s([[side*(width-.07),2.09,0,.07,.08,b(spine,arm,.5)],[x,2.01,0,.12,.12,o(arm)],[x,1.82,0,.10,.105,o(arm)],[x,1.66,0,.085,.09,b(arm,elbow,.2)],[x,1.59,0,.09,.09,b(arm,elbow,.5)],[x,1.5,0,.10,.10,b(arm,elbow,.85)],[x,1.32,0,oracle?.15:.12,.12,o(elbow)],[x,1.23,0,oracle?.18:.14,.13,o(hand)]],'cloth');
  s([[x,1.28,0,oracle?.18:.145,.135,o(hand)],[x,1.22,0,oracle?.18:.14,.135,o(hand)]],'trim');
  s([[x,1.23,0,.06,.06,o(hand)],[x,1.17,.025,.085,.075,o(hand)],[x,1.08,.03,.08,.07,o(hand)],[x,1.05,.025,.03,.03,o(hand)]],'skin');
  s([[lx,1.4,0,.145,.145,b(body,leg,.3)],[lx,1.23,0,.14,.14,o(leg)],[lx,1.02,0,.12,.12,o(leg)],[lx,.78,0,.09,.095,b(leg,knee,.2)],[lx,.70,0,.09,.09,b(leg,knee,.5)],[lx,.61,0,.095,.10,o(knee)],[lx,.35,0,.09,.09,o(knee)],[lx,.18,0,.075,.08,o(knee)]],'pants');
  s([[lx,.47,0,.10,.105,o(knee)],[lx,.23,0,.09,.095,o(knee)],[lx,.15,.04,.105,.14,o(knee)],[lx,.055,.07,.115,.18,o(knee)],[lx,.025,.07,.115,.18,o(knee)]],'boot');
  const panel=panels[i],low=oracle?.20:.47;
  s([[side*.22,1.39,.08,.13,.045,o(panel)],[side*.26,1.08,.10,.15,.04,o(panel)],[side*.32,.68,.13,.18,.035,o(panel)],[side*(oracle?.38:.34),low,.15,.17,.025,o(panel)]],'cloth',8);
  s([[side*.22,1.39,.128,.015,.008,o(panel)],[side*.26,1.08,.145,.015,.008,o(panel)],[side*.32,.68,.17,.015,.008,o(panel)],[side*(oracle?.38:.34),low,.18,.015,.008,o(panel)]],'trim',6);
 }
 s([[0,1.15,0,.22,.14,o(body)],[0,1.3,0,.25,.16,o(body)],[0,1.38,0,.23,.15,o(body)]],'pants');
 s([[0,1.39,-.17,.23,.045,o(panels[2])],[0,1.08,-.21,.29,.04,o(panels[2])],[0,.65,-.26,.34,.035,o(panels[2])],[0,oracle?.19:.40,-.31,.36,.025,o(panels[2])]],'cloth',12);
 // Contrasting shoulder drape for the oracle, high folded collar for the mage.
 if(oracle){
  s([[0,1.88,-.015,.37,.20,o(spine)],[0,2.00,-.015,.40,.19,o(spine)],[0,2.12,-.01,.16,.10,o(spine)]],'pale',12);
 }else{
  s([[0,2.02,-.02,.15,.10,o(spine)],[0,2.16,-.03,.23,.13,o(spine)]],'cloth',10);
  s([[0,2.14,-.03,.235,.135,o(spine)],[0,2.18,-.03,.23,.13,o(spine)]],'trim',10);
 }
 s([[0,2.53,-.045,.20,.17,o(head)],[0,2.66,-.045,.21,.17,o(head)],[0,2.77,-.055,.13,.12,o(head)],[0,2.80,-.06,.025,.025,o(head)]],'hair',12);
 if(oracle){
  for(let i=0;i<2;i++){const side=i?1:-1;s([[side*.17,2.63,-.07,.08,.08,o(hairLocks[i])],[side*.21,2.38,-.08,.075,.065,o(hairLocks[i])],[side*.23,2.10,-.10,.06,.05,o(hairLocks[i])],[side*.27,1.91,-.12,.01,.012,o(hairLocks[i])]],'hair',8);}
  for(const side of [-1,1])s([[side*.08,2.72,.09,.10,.055,o(head)],[side*.13,2.61,.15,.075,.04,o(head)],[side*.18,2.51,.17,.006,.009,o(head)]],'hair',6);
 }else for(let j=0;j<5;j++){const x=(j-2)*.075;s([[x,2.66,.09,.07,.065,o(head)],[x+.035,2.77+(j%2)*.04,.11,.05,.045,o(head)],[x+.08,2.82+(j%2)*.04,.12,.005,.006,o(head)]],'hair',5);}
 const geo=new T.PlaneGeometry(.34,.42,12,12),pos=geo.attributes.position;for(let i=0;i<pos.count;i++){const x=pos.getX(i),y=pos.getY(i);pos.setZ(i,.105+.078*Math.sqrt(Math.max(0,1-(x/.205)**2))*Math.sqrt(Math.max(0,1-(y/.3)**2)));}geo.computeVertexNormals();
 const face=new T.Mesh(geo,new T.MeshLambertMaterial({map:paint(oracle,true),transparent:true,alphaTest:.2}));face.position.y=-.015;head.add(face);
 const gold=new T.MeshLambertMaterial({color:'#c3a26c'}),dark=new T.MeshLambertMaterial({color:'#534139'}),light=new T.MeshBasicMaterial({color:oracle?'#c4a3ff':'#ff9c66'}),hand=limbs[2].userData.hand;
 const ring=(parent,r,x,y,z,material=gold)=>{const mesh=new T.Mesh(new T.TorusGeometry(r,.022,5,32),material);mesh.position.set(x,y,z);parent.add(mesh);return mesh;};
 if(oracle){
  ring(head,.48,0,.16,-.24);const outer=ring(head,.54,0,.16,-.24);outer.rotation.y=.25;
  for(const side of [-1,1]){const orbit=ring(hand,.25,side*.03,.12,.11,side<0?gold:light);orbit.rotation.y=side*.65;}
  const jewel=new T.Mesh(new T.OctahedronGeometry(.065),light);jewel.position.set(0,.23,.16);head.add(jewel);
 }else{
  const shaft=new T.Mesh(new T.CylinderGeometry(.035,.035,2.05,8),dark);shaft.position.set(0,.49,.06);hand.add(shaft);
  for(const y of [-.45,.12,1.38]){const band=new T.Mesh(new T.CylinderGeometry(.05,.05,.08,8),gold);band.position.set(0,y,.06);hand.add(band);}
  ring(hand,.23,0,1.55,.06);const crystal=new T.Mesh(new T.OctahedronGeometry(.17),light);crystal.scale.y=1.5;crystal.position.set(0,1.55,.06);hand.add(crystal);
 }
 const shadow=new T.Mesh(new T.CircleGeometry(.62,24),new T.MeshBasicMaterial({color:'#090f16',transparent:true,opacity:.35,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.015;g.add(shadow);
 const aura=new T.Mesh(new T.TorusGeometry(.72,.016,5,40),light);aura.rotation.x=-Math.PI/2;aura.position.y=.025;g.add(aura);
 batch();return {g,body,spine,head,limbs,elbows,knees,clothParts,aura,spirit:null,id,skeleton,legLength:.56};
}
