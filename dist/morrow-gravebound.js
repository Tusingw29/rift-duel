import * as T from './vendor/three.module.js';
// Original Gravebound design. All geometry uses the existing combat rig;
// its increased visual size does not alter damage, startup or hitbox reach.
function paint(base){
 const w=128,h=256,data=new Uint8Array(w*h*4);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const hash=((x*1973+y*9277)^(x*y*31))>>>0,noise=(hash%17-8)*.16;
  const scratch=(x*13+y*7)%257<2&&hash%7<3?8:0;
  for(let k=0;k<3;k++)data[(y*w+x)*4+k]=Math.max(0,Math.min(255,base[k]+noise+scratch));data[(y*w+x)*4+3]=255;
 }
 const map=new T.DataTexture(data,w,h);map.colorSpace=T.SRGBColorSpace;map.needsUpdate=true;return map;
}
const material=(name,color,roughness=.75,metalness=0)=>{const m=new T.MeshStandardMaterial({color,roughness,metalness});m.name=name;return m;};
function mesh(parent,geo,mat,name,pos=[0,0,0]){const m=new T.Mesh(geo,mat);m.name=name;m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function plate(parent,outline,depth,mat,name,pos=[0,0,0],bevel=.012){
 const shape=new T.Shape();outline.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();
 return mesh(parent,new T.ExtrudeGeometry(shape,{depth,bevelEnabled:bevel>0,bevelThickness:bevel,bevelSize:bevel,bevelSegments:1,steps:1}),mat,name,pos);
}
export function buildGravebound(hand){
 const sword=new T.Group();sword.name='Gravebound';sword.userData.weapon=true;hand.add(sword);
 const dark=material('Gravebound forged steel','#ffffff',.74,.35);dark.map=paint([83,86,82]);
 const edge=material('Gravebound worn cutting bevel','#b3b2a1',.49,.55),brass=material('Gravebound dark brass','#756442',.65,.4),leather=material('Gravebound wrapped grip','#302921');
 // Author in XY then rotate to the existing +Z weapon direction.
 const blade=plate(sword,[[-.31,0],[.31,0],[.31,1.91],[.19,2.24],[-.31,1.98]],.078,dark,'Gravebound blade',[0,0,.28],.025);blade.rotation.x=Math.PI/2;
 const cutting=plate(sword,[[.25,.04],[.31,.04],[.31,1.91],[.19,2.24],[.15,2.10],[.25,1.86]],.003,edge,'Gravebound cutting bevel',[0,.004,.28],.001);cutting.rotation.x=Math.PI/2;
 const spine=mesh(sword,new T.BoxGeometry(.035,.12,1.92),brass,'Gravebound spine reinforcement',[-.30,-.035,1.24]);
 const guard=mesh(sword,new T.BoxGeometry(.82,.13,.13),brass,'Gravebound guard',[.035,-.02,.23]);guard.rotation.y=-.04;
 const grip=mesh(sword,new T.CylinderGeometry(.046,.046,.42,10),leather,'Gravebound two-hand grip',[0,-.02,-.045]);grip.rotation.x=Math.PI/2;
 for(let i=0;i<9;i++){const band=mesh(sword,new T.TorusGeometry(.047,.004,3,10),brass,'Gravebound grip wrap',[0,-.02,-.23+i*.043]);}
 mesh(sword,new T.BoxGeometry(.13,.13,.12),brass,'Gravebound counterweight',[0,-.02,-.30]);
 const groove=material('Gravebound forge grooves','#171b19');
 for(let i=0;i<3;i++){const line=mesh(sword,new T.BoxGeometry(.24,.006,.026),groove,'Gravebound diagonal forge groove',[-.05,.006,.48+i*.09]);line.rotation.y=-.48;}
 sword.traverse(n=>{if(n.isMesh)n.userData.weapon=true;});
 sword.userData.totalLength=2.90;sword.userData.bladeLength=2.24;return sword;
}
function mantle(parent,mat){
 const cols=14,rows=12,p=[],uv=[],idx=[];
 for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){
  const u=i/cols,v=j/rows,x=-.50+u*.91;
  const end=1.02+.22*Math.sin(u*13)+.08*Math.sin(u*41);
  p.push(x*(1+.1*v),.49-v*end,-.21-.13*v-.035*Math.sin(u*8*Math.PI)*v);
  uv.push(u,v);
 }
 for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const a=j*(cols+1)+i,b=a+cols+1;idx.push(a,b,a+1,a+1,b,b+1);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();return mesh(parent,g,mat,'Morrow torn ivory mantle');
}
export function dressMorrow(r,roles){
 if(r.graveboundCostume)return;r.graveboundCostume=true;
 const olive=material('Morrow olive armor','#ffffff',.72,.20);olive.map=paint([88,94,67]);
 const edge=material('Morrow worn brass trim','#a3946c',.74,.25),dark=material('Morrow charcoal undersuit','#242b29'),ivory=material('Morrow ivory mantle','#c9c0a4',.96);ivory.side=T.DoubleSide;
 const black=material('Morrow patch and straps','#242624'),red=material('Morrow recessed missile ports','#5f281f',.8);
 // Stock clothing supplies the deforming underlayer, not the outer character identity.
 r.g.traverse(n=>{if(n.isMesh&&n.name.startsWith('concept-')&&/suit|shoes/.test(n.name)){n.material.map=null;n.material.color.set('#252d2a');n.material.roughness=.95;n.material.needsUpdate=true;}});
 const chest=roles.get('chest'),root=roles.get('root'),head=roles.get('head');
 for(const side of [-1,1]){
  const S=side<0?'L':'R',arm=roles.get('upper_arm.'+S),fore=roles.get('forearm.'+S),thigh=roles.get('thigh.'+S),shin=roles.get('shin.'+S),foot=roles.get('foot.'+S);
  const outline=[[-.14,-.12],[.12,-.16],[.16,.08],[.10,.20],[-.13,.19],[-.16,.06]];
  plate(chest,outline,.045,olive,'Morrow breastplate '+S,[side*.15,.28,.19]);
  for(const x of [-.11,.11])mesh(chest,new T.SphereGeometry(.012,8,6),edge,'Morrow armor rivet '+S,[side*.15+x,.38,.25]);
  // Domed shoulder coverage is segmented so elbow and neck motion remain clear.
  const shoulder=mesh(arm,new T.SphereGeometry(side>0?.20:.18,10,6,0,Math.PI*2,0,Math.PI*.65),olive,'Morrow shoulder armor '+S,[side*.045,.025,0]);shoulder.scale.set(1,.65,1.06);
  plate(arm,[[-.16,0],[.16,0],[.18,.12],[.11,.19],[-.13,.19],[-.18,.12]],.04,olive,'Morrow shoulder skirt '+S,[0,-.23,.14]);
  plate(fore,[[-.095,-.33],[.095,-.33],[.14,-.10],[.11,.015],[-.11,.015],[-.14,-.10]],.035,olive,'Morrow forearm guard '+S,[0,0,.115]);
  plate(thigh,[[-.13,-.29],[.12,-.29],[.15,-.08],[-.14,-.045]],.035,olive,'Morrow thigh armor '+S,[0,0,.16]);
  plate(shin,[[-.11,-.11],[.11,-.11],[.15,.01],[.10,.09],[-.10,.09],[-.15,.01]],.045,olive,'Morrow knee armor '+S,[0,0,.115]);
  plate(shin,[[-.09,-.58],[.09,-.58],[.125,-.19],[-.125,-.19]],.045,olive,'Morrow shin armor '+S,[0,0,.115]);
  const toe=mesh(foot,new T.SphereGeometry(.12,12,8,0,Math.PI*2,0,Math.PI/2),olive,'Morrow boot toe cap '+S,[0,-.04,.12]);toe.scale.set(1,.5,1.6);
 }
 for(let i=0;i<3;i++)plate(chest,[[-.22,0],[.22,0],[.25,.10],[-.25,.10]],.035,olive,'Morrow overlapping abdominal plate '+i,[0,-.10+i*.105,.19]);
 mesh(root,new T.BoxGeometry(.66,.12,.44),black,'Morrow load belt',[0,1.68,0]);mesh(root,new T.BoxGeometry(.16,.10,.035),edge,'Morrow belt buckle',[0,1.68,.24]);
 // Shoulder drape plus tail use the existing mantle secondary-motion joint.
 const cloth=r.clothParts[0];cloth.position.set(0,0,0);mantle(cloth,ivory);
 shawl(cloth,ivory);
 const pod=new T.Group();pod.name='Morrow shoulder missile pod';pod.position.set(-.30,.64,-.20);pod.rotation.x=-.10;chest.add(pod);
 plate(pod,[[-.16,-.18],[.16,-.18],[.18,.16],[.12,.20],[-.14,.20]],.27,olive,'Morrow launcher housing',[0,0,-.18]);
 for(const x of [-.08,.08])for(const y of [-.085,.085]){
  const rim=mesh(pod,new T.TorusGeometry(.055,.012,4,12),edge,'Morrow missile rim',[x,y,.105]);
  const port=mesh(pod,new T.CircleGeometry(.047,12),red,'Morrow missile recess',[x,y,.125]);
 }
 addVeteranDetails(r,head);
 const patch=mesh(head,new T.SphereGeometry(.052,12,8),black,'Morrow right eyepatch',[-.065,.075,.183]);patch.scale.set(1,.78,.25);
 const strap=mesh(head,new T.BoxGeometry(.29,.014,.012),black,'Morrow eyepatch strap',[0,.102,.16]);strap.rotation.z=-.20;
 // Replace only Morrow's tagged old weapon surfaces, retaining hand anchors and effects.
 const hand=roles.get('hand.R'),old=[];hand.traverse(n=>{if(n.isMesh&&n.userData.weapon)old.push(n);});old.forEach(n=>{n.removeFromParent();n.geometry.dispose();});
 r.gravebound=buildGravebound(hand);r.gravebound.rotation.z=.45;
}

function shawl(parent,mat){
 const p=[],uv=[],indices=[],cols=48,rows=8;
 for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){
  const a=i/cols*Math.PI*2,t=j/rows,front=Math.max(0,Math.cos(a));
  const radius=.15+.34*t,x=Math.sin(a)*radius,z=Math.cos(a)*(.13+.14*t);
  const folds=Math.sin(a*9+t*7)*.018*Math.sin(t*Math.PI);
  const y=.70-.27*t-front*.16*t+folds+.035*Math.sin(a*2)*t;
  p.push(x,y,z);uv.push(i/cols,t);
 }
 for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const a=j*(cols+1)+i,b=a+cols+1;indices.push(a,a+1,b,a+1,b+1,b);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(indices);g.computeVertexNormals();mesh(parent,g,mat,'Morrow wrapped shoulder mantle');
}
function addVeteranDetails(r,head){
 // Fit the beard directly to the anatomical face, retaining its jaw shape.
 const body=r.g.children.find(n=>n.name.endsWith('_body')&&n.name.startsWith('concept-'));
 if(body){
  r.g.updateMatrixWorld(true);const inverse=head.matrixWorld.clone().invert(),pos=body.geometry.attributes.position,norm=body.geometry.attributes.normal,index=body.geometry.index,p=[],v=new T.Vector3(),n=new T.Vector3();
  for(let i=0;i<(index?.count??pos.count);i+=3){
   const ids=[0,1,2].map(k=>index?index.getX(i+k):i+k),c=new T.Vector3();ids.forEach(id=>c.add(new T.Vector3().fromBufferAttribute(pos,id)));c.multiplyScalar(1/3);
   if(c.y<2.58||c.y>2.71||c.z<.105||Math.abs(c.x)>.135||c.y>2.665&&Math.abs(c.x)<.065)continue;
   for(const id of ids){v.fromBufferAttribute(pos,id);n.fromBufferAttribute(norm,id);v.addScaledVector(n,.0035).applyMatrix4(inverse);p.push(v.x,v.y,v.z);}
  }
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.computeVertexNormals();const beard=material('Morrow salt and pepper beard','#74746e',.95);beard.side=T.DoubleSide;mesh(head,g,beard,'Morrow fitted beard');
 }
 r.g.traverse(n=>{if(n.isMesh&&n.name.startsWith('concept-')&&n.name.endsWith('_hair')){
  // Preserve the existing alpha hair texture while lifting its baked dark tint.
  if(typeof document!=='undefined'&&n.material.map?.image){const img=n.material.map.image,canvas=document.createElement('canvas');canvas.width=img.width;canvas.height=img.height;const ctx=canvas.getContext('2d');ctx.drawImage(img,0,0);const pixels=ctx.getImageData(0,0,canvas.width,canvas.height);for(let i=0;i<pixels.data.length;i+=4){const l=.3*pixels.data[i]+.59*pixels.data[i+1]+.11*pixels.data[i+2],v=Math.min(225,80+l*1.65);pixels.data[i]=v;pixels.data[i+1]=v;pixels.data[i+2]=v*.94;}ctx.putImageData(pixels,0,0);const texture=new T.CanvasTexture(canvas);texture.colorSpace=T.SRGBColorSpace;texture.flipY=n.material.map.flipY;n.material.map=texture;n.material.color.set('#ffffff');n.material.needsUpdate=true;}
 }});
}
