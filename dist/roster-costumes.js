import * as T from './vendor/three.module.js';
// Concept costumes (direction A of art/roster-2026-10-21) built onto the Design 03 anatomical
// bodies at attach time. Every piece is parented to an existing combat bone, so animation,
// hand anchors, hitboxes and timing are untouched; the stock MakeHuman outfit becomes the
// deforming under-layer and the identity comes from these pieces. Morrow is dressed in
// dist/morrow-gravebound.js with the same approach.
const material=(name,color,roughness=.75,metalness=0,extra={})=>{const m=new T.MeshStandardMaterial({color,roughness,metalness,...extra});m.name=name;return m;};
function mesh(parent,geo,mat,name,pos=[0,0,0]){const m=new T.Mesh(geo,mat);m.name=name;m.position.set(...pos);m.castShadow=true;m.receiveShadow=true;parent.add(m);return m;}
function plate(parent,outline,depth,mat,name,pos=[0,0,0],bevel=.006){
 const shape=new T.Shape();outline.forEach(([x,y],i)=>i?shape.lineTo(x,y):shape.moveTo(x,y));shape.closePath();
 return mesh(parent,new T.ExtrudeGeometry(shape,{depth,bevelEnabled:bevel>0,bevelThickness:bevel,bevelSize:bevel,bevelSegments:1,steps:1}),mat,name,pos);
}
// A hanging cloth panel: a grid from a top edge, widening and swaying as it falls. `shape(u,v)` returns [x,y,z].
function panel(parent,mat,name,shape,cols=10,rows=12){
 const p=[],uv=[],idx=[];
 for(let j=0;j<=rows;j++)for(let i=0;i<=cols;i++){const [x,y,z]=shape(i/cols,j/rows);p.push(x,y,z);uv.push(i/cols,j/rows);}
 for(let j=0;j<rows;j++)for(let i=0;i<cols;i++){const a=j*(cols+1)+i,b=a+cols+1;idx.push(a,b,a+1,a+1,b,b+1);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
 const m=mesh(parent,g,mat,name);m.material.side=T.DoubleSide;return m;
}
// A ring of cloth around a bone (collar, sash, coat body): profile rows of [radius-x, y, radius-z].
function tube(parent,mat,name,rows,segments=20,open=null){
 const p=[],uv=[],idx=[];const span=open?open[1]-open[0]:Math.PI*2,start=open?open[0]:0;
 rows.forEach(([rx,y,rz,ox=0,oz=0],j)=>{for(let i=0;i<=segments;i++){const a=start+span*i/segments;p.push(ox+Math.sin(a)*rx,y,oz+Math.cos(a)*rz);uv.push(i/segments,j/(rows.length-1));}});
 for(let j=0;j<rows.length-1;j++)for(let i=0;i<segments;i++){const a=j*(segments+1)+i,b=a+segments+1;idx.push(a,a+1,b,a+1,b+1,b);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setAttribute('uv',new T.Float32BufferAttribute(uv,2));g.setIndex(idx);g.computeVertexNormals();
 const m=mesh(parent,g,mat,name);m.material.side=T.DoubleSide;return m;
}
function recolorUnderlayer(r,test,color,roughness=.9){
 r.g.traverse(n=>{if(n.isMesh&&n.name.startsWith('concept-')&&test(n.name)){n.material.map=null;n.material.color.set(color);n.material.roughness=roughness;n.material.needsUpdate=true;}});
}
const sideBones=(roles,S)=>({arm:roles.get('upper_arm.'+S),fore:roles.get('forearm.'+S),hand:roles.get('hand.'+S),thigh:roles.get('thigh.'+S),shin:roles.get('shin.'+S),foot:roles.get('foot.'+S)});

// ---- Aegis: Relay Knight. Ivory segmented armour over the navy suit, angular helmet with a cyan visor, short blue cape, energy blade.
export function dressAegis(r,roles){
 if(r.conceptCostume)return;r.conceptCostume='aegis';
 const ivory=material('Aegis ivory armour','#ddd6c6',.55,.25),navy=material('Aegis navy joints','#1b2644',.7,.1),cyan=material('Aegis emitter cyan','#58e2ff',.3,0,{emissive:'#2bc7ee',emissiveIntensity:1.2}),blue=material('Aegis cape blue','#2f55a8',.95);blue.side=T.DoubleSide;
 const chest=roles.get('chest'),root=roles.get('root'),head=roles.get('head');
 for(const side of [-1,1]){
  const S=side<0?'L':'R',{arm,fore,thigh,shin,foot}=sideBones(roles,S);
  plate(chest,[[-.13,-.1],[.13,-.14],[.16,.1],[.09,.22],[-.12,.21],[-.16,.06]],.04,ivory,'Aegis breastplate '+S,[side*.145,.27,.17]);
  const shoulder=mesh(arm,new T.SphereGeometry(.17,10,6,0,Math.PI*2,0,Math.PI*.6),ivory,'Aegis pauldron '+S,[side*.04,.03,0]);shoulder.scale.set(1,.7,1.05);
  plate(arm,[[-.13,0],[.13,0],[.15,.12],[.09,.18],[-.11,.18],[-.15,.12]],.035,ivory,'Aegis upper arm plate '+S,[0,-.22,.11]);
  plate(fore,[[-.085,-.32],[.085,-.32],[.12,-.1],[.1,.01],[-.1,.01],[-.12,-.1]],.035,ivory,'Aegis forearm guard '+S,[0,0,.1]);
  if(side>0){const emitter=mesh(fore,new T.BoxGeometry(.03,.26,.02),cyan,'Aegis forearm emitter',[0,-.17,.145]);emitter.userData.glow=true;}
  plate(thigh,[[-.12,-.3],[.12,-.3],[.14,-.06],[-.13,-.03]],.035,ivory,'Aegis thigh plate '+S,[0,0,.15]);
  plate(shin,[[-.1,-.1],[.1,-.1],[.13,.02],[.09,.09],[-.09,.09],[-.13,.02]],.04,ivory,'Aegis knee guard '+S,[0,0,.11]);
  plate(shin,[[-.085,-.56],[.085,-.56],[.11,-.18],[-.11,-.18]],.04,ivory,'Aegis greave '+S,[0,0,.11]);
  const toe=mesh(foot,new T.SphereGeometry(.11,12,8,0,Math.PI*2,0,Math.PI/2),ivory,'Aegis boot cap '+S,[0,-.04,.12]);toe.scale.set(1,.5,1.6);
 }
 for(let i=0;i<3;i++)plate(chest,[[-.19,0],[.19,0],[.21,.08],[-.21,.08]],.03,ivory,'Aegis abdominal segment '+i,[0,-.09+i*.09,.17]);
 mesh(chest,new T.BoxGeometry(.05,.16,.03),cyan,'Aegis chest signal',[0,.25,.235]);
 mesh(root,new T.BoxGeometry(.6,.09,.4),navy,'Aegis belt',[0,1.66,0]);
 // Helmet: an angular shell around the skull with a cyan visor and two crest fins; the face stays covered as in the concept.
 // Skull shell hugging the head, a full faceplate from chin to brow with a cyan visor slit, and two crest fins.
 // Head joint sits at the skull base: eyes are about .06 above it, the crown .24, the chin .08 below.
 const helmet=mesh(head,new T.SphereGeometry(.16,16,12,0,Math.PI*2,0,Math.PI*.72),ivory,'Aegis helmet',[0,.09,-.02]);helmet.scale.set(1.04,1.2,1.1);
 const faceplate=plate(head,[[-.1,-.1],[.1,-.1],[.125,.0],[.12,.1],[.08,.15],[-.08,.15],[-.12,.1],[-.125,.0]],.03,ivory,'Aegis faceplate',[0,.01,.17],.008);faceplate.rotation.x=.1;
 for(const side of [-1,1]){const cheek=plate(head,[[0,-.08],[.05,-.1],[.05,.1],[0,.12]],.1,ivory,'Aegis cheek guard',[side*.135-(side>0?0:.05),.0,.06]);cheek.rotation.y=side*.2;}
 const visor=plate(head,[[-.1,-.02],[.1,-.02],[.09,.02],[-.09,.02]],.014,cyan,'Aegis visor',[0,.065,.215]);visor.userData.glow=true;
 for(const side of [-1,1]){const fin=plate(head,[[0,0],[.045,0],[.025,.2],[-.01,.09]],.014,ivory,'Aegis crest fin',[side*.08,.24,-.06]);fin.rotation.x=-.6;fin.rotation.z=side*.3;}
 // Short asymmetric cape from the existing cape joint, falling over the left shoulder blade.
 const cape=r.clothParts[0];if(cape){cape.position.set(0,.6,-.14);panel(cape,blue,'Aegis short cape',(u,v)=>[-.3+u*.62-v*.12,-v*(.95+.1*Math.sin(u*9)),-.08-v*.22-.03*Math.sin(u*7*Math.PI)*v]);}
 // The blade becomes an energy edge: keep the old grip and guard, light up the blade.
 r.g.traverse(n=>{if(n.isMesh&&n.userData.weapon&&n.geometry.attributes.position.count>40){n.material=cyan;n.userData.glow=true;}});
 recolorUnderlayer(r,name=>/suit|shoes|hair/.test(name),'#1b2644');
}

// ---- Rei: Shrine Exile. Ivory high-collar blouse, plum sash with trailing ties, wine split panels over dark trousers, boots.
export function dressRei(r,roles){
 if(r.conceptCostume)return;r.conceptCostume='rei';
 const plum=material('Rei plum sash','#b36b94',.9),wine=material('Rei wine panels','#7a2238',.92),ivory=material('Rei ivory collar','#efe6d4',.85),boot=material('Rei boots','#1c1518',.6,.1);
 const chest=roles.get('chest'),root=roles.get('root');
 // High collar and blouse cuffs.
 tube(chest,ivory,'Rei high collar',[[.11,.5,.1],[.115,.6,.105],[.11,.66,.1]],18);
 for(const S of ['L','R']){const {fore,shin,foot}=sideBones(roles,S);tube(fore,ivory,'Rei blouse cuff '+S,[[.075,-.3,.075],[.08,-.2,.08]],12);
  tube(shin,boot,'Rei boot '+S,[[.105,-.62,.11],[.1,-.3,.105],[.11,-.08,.115]],14);const toe=mesh(foot,new T.SphereGeometry(.1,12,8,0,Math.PI*2,0,Math.PI/2),boot,'Rei boot toe '+S,[0,-.05,.11]);toe.scale.set(.95,.5,1.6);}
 // Sash wrapped at the waist, knotted on the left hip with two trailing ties.
 tube(root,plum,'Rei waist sash',[[.3,1.48,.21],[.31,1.57,.22],[.3,1.65,.21]],22);
 mesh(root,new T.SphereGeometry(.055,10,8),plum,'Rei sash knot',[-.26,1.56,.1]);
 for(const [dx,len] of [[0,.62],[.05,.5]])panel(root,plum,'Rei sash tie',(u,v)=>[-.28+dx+(u-.5)*.07-v*.06,1.54-v*len,.09-v*.1+.02*Math.sin(v*9)],3,10);
 // Wine split panels hang from the existing coat-tail joints on each hip and sway with them.
 r.clothParts.slice(0,2).forEach((tail,i)=>{const side=i?1:-1;tail.position.set(side*.16,1.62,-.06);
  panel(tail,wine,'Rei wine panel '+(i?'R':'L'),(u,v)=>[side*(.02+u*.26)*(1+.5*v),-v*1.05,-.1+(u-.5)*.22*(1+.6*v)-.03*Math.sin(u*6*Math.PI)*v]);});
 panel(root,wine,'Rei back panel',(u,v)=>[(u-.5)*.36*(1+.4*v),1.62-v*1.0,-.2-v*.08-.025*Math.sin(u*5*Math.PI)*v],8,10);
 recolorUnderlayer(r,name=>/shoes/.test(name),'#1c1518',.6);
}

// ---- Sol: Ember Cartographer. Long split rust coat with a high ivory collar and gold cuffs, atlas satchel, boots; staff kept.
export function dressSol(r,roles){
 if(r.conceptCostume)return;r.conceptCostume='sol';
 const rust=material('Sol rust coat','#8d2b20',.88),ivory=material('Sol ivory collar','#efe4cf',.85),gold=material('Sol gold trim','#c9a24a',.5,.5),leather=material('Sol satchel leather','#4a3220',.8),boot=material('Sol boots','#3a2418',.65);
 const chest=roles.get('chest'),root=roles.get('root');
 // Coat body: fitted over the chest, open down the front, with sleeves on each arm bone.
 tube(chest,rust,'Sol coat body',[[.27,-.22,.21],[.3,.05,.24],[.32,.3,.25],[.28,.5,.2]],22,[Math.PI*.1,Math.PI*1.9]);
 tube(chest,ivory,'Sol high collar',[[.12,.5,.11],[.135,.64,.12],[.13,.7,.115]],18,[Math.PI*.2,Math.PI*1.8]);
 for(const S of ['L','R']){const {arm,fore,shin,foot}=sideBones(roles,S);
  tube(arm,rust,'Sol coat sleeve upper '+S,[[.11,-.5,.11],[.12,-.2,.12],[.13,.02,.13]],12);
  tube(fore,rust,'Sol coat sleeve lower '+S,[[.085,-.34,.085],[.095,-.1,.095],[.1,.03,.1]],12);
  tube(fore,gold,'Sol gold cuff '+S,[[.09,-.38,.09],[.092,-.3,.092]],12);
  tube(shin,boot,'Sol boot '+S,[[.105,-.6,.11],[.1,-.28,.105],[.11,-.1,.115]],14);const toe=mesh(foot,new T.SphereGeometry(.1,12,8,0,Math.PI*2,0,Math.PI/2),boot,'Sol boot toe '+S,[0,-.05,.11]);toe.scale.set(.95,.5,1.6);}
 // Long split skirts on the three existing panel joints: left front, right front, back.
 r.clothParts.slice(0,3).forEach((bone,i)=>{const side=i===0?-1:i===1?1:0,back=i===2;bone.position.set(side*.2,1.62,back?-.17:.08);
  panel(bone,rust,'Sol coat skirt '+i,(u,v)=>back?[(u-.5)*.42*(1+.5*v),-v*1.25,-.03-v*.1-.03*Math.sin(u*5*Math.PI)*v]:[side*(.0+u*.24)*(1+.6*v),-v*1.2,.08-(u-.5)*side*.2*(1+.5*v)-.08*v-.03*Math.sin(u*6*Math.PI)*v]);
  panel(bone,gold,'Sol hem trim '+i,(u,v)=>back?[(u-.5)*.42*1.5,-1.25+v*.05,-.03-.1-.03*Math.sin(u*5*Math.PI)+.004]:[side*(u*.24)*1.6,-1.2+v*.05,.08-(u-.5)*side*.2*1.5-.08-.03*Math.sin(u*6*Math.PI)+.004],10,1);});
 // Cross-body strap and atlas satchel on the right hip.
 const strap=mesh(chest,new T.BoxGeometry(.06,.9,.02),leather,'Sol satchel strap',[.0,.12,.22]);strap.rotation.z=.55;
 const strapBack=mesh(chest,new T.BoxGeometry(.06,.9,.02),leather,'Sol satchel strap back',[.0,.12,-.2]);strapBack.rotation.z=-.55;
 const satchel=mesh(root,new T.BoxGeometry(.26,.22,.12),leather,'Sol atlas satchel',[.3,1.45,.05]);satchel.rotation.y=.3;mesh(satchel,new T.BoxGeometry(.27,.1,.13),leather,'Sol satchel flap',[0,.07,.005]);mesh(satchel,new T.BoxGeometry(.05,.05,.02),gold,'Sol satchel clasp',[0,0,.07]);
 sweptLocks(roles.get('head'),material('Sol red locks','#a8381a',.85),[[0,.2,.08,.03,.28,-.04,.0,.26,-.2],[-.08,.19,.07,-.13,.26,-.05,-.17,.22,-.18],[.08,.19,.07,.13,.26,-.05,.17,.22,-.18],[-.13,.14,.02,-.2,.2,-.06,-.23,.14,-.14],[.13,.14,.02,.2,.2,-.06,.23,.14,-.14],[-.04,.21,.12,-.09,.29,.1,-.16,.3,.0],[.05,.21,.12,.11,.29,.1,.18,.3,.0],[0,.18,.14,.03,.24,.2,.1,.2,.24],[-.06,.18,.13,-.11,.22,.19,-.15,.16,.22]]);
 recolorUnderlayer(r,name=>/shoes/.test(name),'#3a2418',.65);
}
// Tapered hair locks along a bezier from the scalp outward, for spiky or swept silhouettes.
function sweptLocks(head,mat,locks,width=.035){
 for(const [ax,ay,az,bx,by,bz,cx,cy,cz] of locks){
  const curve=new T.QuadraticBezierCurve3(new T.Vector3(ax,ay,az),new T.Vector3(bx,by,bz),new T.Vector3(cx,cy,cz)),points=[],indices=[];
  for(let j=0;j<=6;j++){const t=j/6,c=curve.getPoint(t),tangent=curve.getTangent(t),u=new T.Vector3(1,0,0).cross(tangent).normalize(),v=tangent.clone().cross(u).normalize(),w=width*Math.pow(1-t,.7)+.0005;
   for(let k=0;k<6;k++){const a=k/6*Math.PI*2,p=c.clone().addScaledVector(u,Math.cos(a)*w*.5).addScaledVector(v,Math.sin(a)*w);points.push(p.x,p.y,p.z);}}
  for(let j=0;j<6;j++)for(let k=0;k<6;k++){const a=j*6+k,b=j*6+(k+1)%6;indices.push(a,b,a+6,b,b+6,a+6);}
  const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(points,3));g.setIndex(indices);g.computeVertexNormals();mesh(head,g,mat,'swept lock');
 }
}

// ---- Vesper: Astral Mourner. Floor-length split violet gown, ivory shoulder drape, gold trim, wrist rings and a broken halo.
export function dressVesper(r,roles){
 if(r.conceptCostume)return;r.conceptCostume='vesper';
 const violet=material('Vesper violet gown','#2d1b3f',.9),deep=material('Vesper deep plum','#3b1f48',.9),ivory=material('Vesper ivory drape','#e9e2d2',.95),gold=material('Vesper gold trim','#c9a24a',.45,.6,{emissive:'#4a3810',emissiveIntensity:.4});
 const chest=roles.get('chest'),root=roles.get('root'),head=roles.get('head');
 // Gown bodice and high collar over the fitted under-layer.
 tube(chest,violet,'Vesper bodice',[[.23,-.2,.16],[.25,.05,.18],[.27,.3,.19],[.22,.5,.15]],22);
 tube(chest,deep,'Vesper collar',[[.11,.5,.1],[.12,.62,.105]],18);
 // Floor-length split panels from the three panel joints, falling to the ankles.
 r.clothParts.slice(0,3).forEach((bone,i)=>{const side=i===0?-1:i===1?1:0,back=i===2;bone.position.set(side*.2,1.6,back?-.16:.08);
  panel(bone,violet,'Vesper gown panel '+i,(u,v)=>back?[(u-.5)*.5*(1+.6*v),-v*1.5,-.03-v*.12-.03*Math.sin(u*5*Math.PI)*v]:[side*(u*.26)*(1+.8*v),-v*1.48,.08-(u-.5)*side*.22*(1+.6*v)-.1*v-.03*Math.sin(u*6*Math.PI)*v]);
  panel(bone,gold,'Vesper hem trim '+i,(u,v)=>back?[(u-.5)*.5*1.6,-1.5+v*.04,-.03-.12-.03*Math.sin(u*5*Math.PI)+.004]:[side*(u*.26)*1.8,-1.48+v*.04,.08-(u-.5)*side*.22*1.6-.1-.03*Math.sin(u*6*Math.PI)+.004],10,1);});
 // Ivory drape over the shoulders, knotted at the chest and trailing down the back.
 // Ivory drape: a soft wrap over the shoulders that slides off the left shoulder, knotted at the chest, with a tail down the back.
 // A shawl laid over both shoulders from the back, gathered at the chest with a knot, slipping lower on the left.
 panel(chest,ivory,'Vesper shoulder drape',(u,v)=>{const x=(u-.5)*.64,tilt=(u-.5)*.08;return [x*(1-.15*Math.sin(v*Math.PI)),.3+.32*Math.sin(v*Math.PI)-tilt+.02*Math.sin(u*7*Math.PI)*Math.abs(v-.5),-.24+v*.5-.06*Math.sin(v*Math.PI)*Math.cos(u*Math.PI)];},12,10);
 mesh(chest,new T.SphereGeometry(.05,10,8),ivory,'Vesper drape knot',[.06,.4,.22]);
 panel(chest,ivory,'Vesper drape tail',(u,v)=>[-.12+(u-.5)*.22*(1+.5*v),.42-v*1.0,-.22-v*.06-.03*Math.sin(u*5*Math.PI)*v],8,10);
 // Gold wrist rings and the broken halo floating behind the head.
 for(const S of ['L','R']){const {fore}=sideBones(roles,S);const ring=mesh(fore,new T.TorusGeometry(.11,.012,6,24),gold,'Vesper wrist ring '+S,[0,-.3,0]);ring.rotation.x=Math.PI/2;}
 for(const [start,len] of [[.2,1.9],[2.5,1.4],[4.3,1.2]]){const arc=mesh(head,new T.TorusGeometry(.33,.016,6,32,len),gold,'Vesper broken halo',[0,.3,-.12]);arc.rotation.z=start;}
 mesh(head,new T.OctahedronGeometry(.035),gold,'Vesper halo star',[0,.66,-.12]);
 recolorUnderlayer(r,name=>/shoes/.test(name),'#1a1220',.5);
}
export const costumes={aegis:dressAegis,rei:dressRei,sol:dressSol,vesper:dressVesper};
