import * as T from './vendor/three.module.js';

// Original armored sentinel. Armor is authored as beveled contour plates,
// not boxes scaled onto a generic mannequin. Joint locations retain the combat
// rig contract so weapon trails, captures and shared poses keep their anchors.
export function buildAegis(){
 const g=new T.Group(),body=new T.Group();g.add(body);
 const shell=new T.MeshLambertMaterial({vertexColors:true,flatShading:true});
 const undersuit=new T.MeshLambertMaterial({color:'#182934'});
 const glow=new T.MeshBasicMaterial({color:'#77e7ef'});
 const capeMat=new T.MeshLambertMaterial({color:'#cbd9dc',side:T.DoubleSide});
 const joint=(parent,x=0,y=0,z=0)=>{const n=new T.Group();n.position.set(x,y,z);parent.add(n);return n;};
 const mesh=(geo,mat,parent,x=0,y=0,z=0)=>{const m=new T.Mesh(geo,mat);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;};
 const tube=(parent,top,bottom,height,x,y,z=0)=>mesh(new T.CylinderGeometry(top,bottom,height,8),undersuit,parent,x,y,z);
 function plate(parent,outline,depth,color,x=0,y=0,z=0,bevel=.13){
  const area=outline.reduce((sum,p,i)=>{const q=outline[(i+1)%outline.length];return sum+p[0]*q[1]-q[0]*p[1];},0);
  if(area<0)outline=[...outline].reverse();
  const center=outline.reduce((a,p)=>[a[0]+p[0]/outline.length,a[1]+p[1]/outline.length],[0,0]);
  const front=outline.map(p=>[p[0]+(center[0]-p[0])*bevel,p[1]+(center[1]-p[1])*bevel,depth/2]);
  const edge=outline.map(p=>[p[0],p[1],depth*.15]),back=outline.map(p=>[p[0],p[1],-depth/2]);
  const pos=[],colors=[],base=new T.Color(color);
  const tri=(a,b,c,tone)=>{for(const v of [a,b,c]){pos.push(...v);colors.push(base.r*tone,base.g*tone,base.b*tone);}};
  for(let i=0;i<outline.length;i++){const j=(i+1)%outline.length;
   tri([center[0],center[1],depth/2],front[i],front[j],1);
   tri(front[i],edge[i],edge[j],.72);tri(front[i],edge[j],front[j],.72);
   tri(edge[i],back[i],back[j],.5);tri(edge[i],back[j],edge[j],.5);
   tri([center[0],center[1],-depth/2],back[j],back[i],.6);
  }
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('color',new T.Float32BufferAttribute(colors,3));geo.computeVertexNormals();return mesh(geo,shell,parent,x,y,z);
 }
 const spine=joint(body,0,1.25),head=joint(spine,0,1.23),limbs=[],elbows=[],knees=[],clothParts=[];
 tube(body,.24,.27,.28,0,1.13);
 tube(spine,.29,.22,.69,0,.35);
 tube(spine,.1,.12,.2,0,.91);
 // Segmented torso: pale shell, inset cobalt breastplate, central amber core.
 plate(spine,[[-.25,.06],[.25,.06],[.37,.49],[.34,.74],[.18,.85],[-.18,.85],[-.34,.74],[-.37,.49]],.35,'#b7d5da',0,0,.015);
 plate(spine,[[-.30,.68],[-.12,.43],[0,.36],[.12,.43],[.30,.68],[.17,.76],[-.17,.76]],.07,'#256f91',0,0,.22);
 plate(spine,[[-.07,.59],[0,.49],[.07,.59],[0,.69]],.065,'#e8be6a',0,0,.275);
 for(let i=0;i<3;i++)plate(spine,[[-.20,.06+i*.095],[.20,.06+i*.095],[.23,.125+i*.095],[-.23,.125+i*.095]],.05,i%2?'#274b62':'#46798b',0,0,.20);
 plate(body,[[-.29,1.16],[-.20,1.01],[0,.96],[.20,1.01],[.29,1.16],[.22,1.27],[-.22,1.27]],.27,'#22526b');
 plate(body,[[-.07,1.18],[0,1.10],[.07,1.18],[0,1.25]],.05,'#d8b56c',0,0,.17);
 // Helmet has a pointed chin, brow ridge, recessed visor and swept side fins.
 plate(head,[[-.11,-.26],[.11,-.26],[.23,-.10],[.225,.16],[.12,.29],[-.12,.29],[-.225,.16],[-.23,-.10]],.36,'#a8cbd3',0,0,-.01);
 plate(head,[[-.19,.095],[-.10,-.015],[0,-.045],[.10,-.015],[.19,.095],[.13,.14],[-.13,.14]],.025,'#102c3e',0,0,.195,.03);
 for(const side of [-1,1]){
  plate(head,[[side*.025,.015],[side*.16,.065],[side*.15,.095],[side*.035,.065]].map(p=>p),.012,'#69e4e8',0,0,.217,.01).material=glow;
  const fin=plate(head,[[-.045,-.03],[.04,-.055],[.075,.34],[-.025,.20]],.055,'#d6e7df',side*.205,.18,-.025);fin.rotation.z=-side*.38;
  plate(head,[[-.04,-.20],[.04,-.20],[.075,-.09],[0,-.055],[-.075,-.09]],.05,'#286b86',side*.115,-.025,.19);
 }
 plate(head,[[-.045,-.19],[0,-.245],[.045,-.19],[.035,-.065],[-.035,-.065]],.06,'#e0dfcd',0,0,.20);
 for(const side of [-1,1]){
  const arm=joint(spine,side*.43,.77),elbow=joint(arm,0,-.43),hand=joint(elbow,0,-.4),leg=joint(body,side*.20,1.1),knee=joint(leg,0,-.48);
  arm.userData.hand=hand;limbs.push(arm,leg);elbows.push(elbow);knees.push(knee);
  tube(arm,.11,.09,.38,0,-.22);tube(elbow,.095,.07,.33,0,-.18);
  tube(leg,.145,.10,.46,0,-.23);tube(knee,.095,.075,.40,0,-.22);
  // Shoulder shell follows the upper arm rather than staying on the torso.
  const shoulder=plate(arm,[[-.19,-.14],[.12,-.18],[.24,.015],[.15,.16],[-.11,.18],[-.21,.055]],.26,'#367d96',0,0,0);shoulder.rotation.z=-side*.14;
  plate(arm,[[-.15,.055],[.12,.04],[.17,.10],[-.08,.135]],.035,'#dfddd0',0,0,.18);
  plate(arm,[[-.085,-.36],[.085,-.36],[.115,-.17],[-.115,-.17]],.19,'#aecbd1',0,0,.015);
  plate(elbow,[[-.085,-.35],[.085,-.35],[.145,-.10],[.10,.035],[-.10,.035],[-.145,-.10]],.24,'#bbcfd0',0,0,.02);
  plate(elbow,[[-.04,-.29],[.04,-.29],[.07,-.03],[-.07,-.03]],.04,'#2a718c',0,0,.16);
  plate(hand,[[-.085,-.10],[.085,-.10],[.105,.025],[.065,.095],[-.075,.095],[-.105,.025]],.16,'#294b60',0,0,.025);
  plate(hand,[[-.07,-.035],[.07,-.035],[.075,.03],[-.075,.03]],.025,'#bfced0',0,0,.12);
  plate(leg,[[-.10,-.40],[.10,-.40],[.145,-.06],[.10,.04],[-.10,.04],[-.145,-.06]],.22,'#37758d',0,0,.035);
  plate(knee,[[-.11,-.09],[0,-.16],[.11,-.09],[.12,.065],[0,.13],[-.12,.065]],.20,'#d0dcd4',0,0,.07);
  plate(knee,[[-.095,-.43],[.095,-.43],[.13,-.15],[.075,-.08],[-.075,-.08],[-.13,-.15]],.23,'#9dbfc7',0,0,.025);
  plate(knee,[[-.03,-.40],[.03,-.40],[.055,-.18],[-.055,-.18]],.03,'#296b85',0,0,.16);
  // Broad wedge toe; the dark sole stays separate from the shin armor.
  plate(knee,[[-.12,-.53],[.12,-.53],[.13,-.44],[.075,-.37],[-.075,-.37],[-.13,-.44]],.38,'#244b60',0,0,.105);
 }
 // Split cape with sculpted folds; both tails share the existing cloth anchor.
 plate(head,[[-.13,-.16],[.13,-.16],[.16,.13],[.08,.20],[-.08,.20],[-.16,.13]],.025,'#326f87',0,0,-.20).rotation.y=Math.PI;
 const cape=joint(spine,0,.82,-.29);clothParts.push(cape);
 for(const side of [-1,1]){
  const positions=[],indices=[],rows=[[0,.15,0],[-.45,.22,-.14],[-1,.29,-.23],[-1.58,.31,-.4]];
  for(const [y,w,z] of rows)for(let j=0;j<5;j++)positions.push(side*(.025+w*j/4),y,z+(j%2?.035:-.035));
  for(let row=0;row<3;row++)for(let j=0;j<4;j++){const a=row*5+j;indices.push(a,a+5,a+1,a+1,a+5,a+6);}
  const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(positions,3));geo.setIndex(indices);geo.computeVertexNormals();mesh(geo,capeMat,cape);
 }
 const hand=limbs[2].userData.hand;
 tube(hand,.045,.045,.25,0,0,.12);
 plate(hand,[[-.19,.075],[.19,.075],[.15,.14],[-.15,.14]],.10,'#d9b86e',0,0,.13);
 const blade=plate(hand,[[-.065,0],[.065,0],[.045,.97],[0,1.24],[-.045,.97]],.035,'#b9edf0');blade.rotation.x=Math.PI/2;blade.position.set(0,.12,.24);
 const shadow=mesh(new T.CircleGeometry(.62,24),new T.MeshBasicMaterial({color:'#090f16',transparent:true,opacity:.35,depthWrite:false}),g,0,.015);shadow.rotation.x=-Math.PI/2;shadow.castShadow=false;
 const aura=mesh(new T.TorusGeometry(.72,.016,5,40),glow,g,0,.025);aura.rotation.x=-Math.PI/2;aura.castShadow=false;
 // Merge fixed surfaces per joint/material while retaining beveled face colors.
 const batch=root=>{
  for(const child of [...root.children])if(child.isGroup)batch(child);
  const groups=new Map();for(const child of root.children)if(child.isMesh){const list=groups.get(child.material)||[];list.push(child);groups.set(child.material,list);}
  for(const [mat,list] of groups){if(list.length<2)continue;const pos=[],normal=[],color=[];
   for(const original of list){original.updateMatrix();const geo=original.geometry.index?original.geometry.toNonIndexed():original.geometry.clone();geo.applyMatrix4(original.matrix);pos.push(...geo.attributes.position.array);normal.push(...geo.attributes.normal.array);if(geo.attributes.color)color.push(...geo.attributes.color.array);else for(let i=0;i<geo.attributes.position.count;i++)color.push(1,1,1);geo.dispose();}
   const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(pos,3));geo.setAttribute('normal',new T.Float32BufferAttribute(normal,3));geo.setAttribute('color',new T.Float32BufferAttribute(color,3));mesh(geo,mat,root);
   for(const original of list){root.remove(original);original.geometry.dispose();}
  }
 };batch(body);
 // Adult hero proportions: retain world-space hand/head heights while moving
 // the hip up and lengthening both leg segments. Gameplay reach is unchanged.
 const reshape=(root,scale)=>{for(const n of root.children)if(n.isMesh){n.updateMatrix();n.geometry.applyMatrix4(n.matrix);n.position.set(0,0,0);n.rotation.set(0,0,0);n.scale.set(1,1,1);const p=n.geometry.attributes.position;for(let i=0;i<p.count;i++)p.setY(i,p.getY(i)*scale);p.needsUpdate=true;n.geometry.computeVertexNormals();}};
 reshape(body,7/6);reshape(spine,.78);spine.position.y=1.435;head.position.y=1.045;head.scale.set(.86,.90,.8);
 for(let i=0;i<2;i++){limbs[i*2].position.y=.585;const leg=limbs[i*2+1],knee=knees[i];leg.position.y=1.26;knee.position.y=-.56;reshape(leg,7/6);reshape(knee,7/6);}
 cape.position.y=.635;
 return {g,body,spine,head,limbs,elbows,knees,clothParts,aura,spirit:null,id:0};
}
