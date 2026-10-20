import * as T from './vendor/three.module.js';

// Original lightweight anime fighter, using the same animation attachment points.
// Continuous ring surfaces carry blended bone weights across elbows and knees.
export function buildTala(){
 const g=new T.Group(),bones=[];
 const joint=(parent,x=0,y=0,z=0)=>{const b=new T.Bone();b.position.set(x,y,z);parent.add(b);bones.push(b);return b;};
 const body=joint(g),spine=joint(body,0,1.25),head=joint(spine,0,1.23);
 const limbs=[],elbows=[],knees=[],clothParts=[];
 for(const side of [-1,1]){
  const arm=joint(spine,side*.43,.77),elbow=joint(arm,0,-.43),hand=joint(elbow,0,-.4);
  const leg=joint(body,side*.2,1.1),knee=joint(leg,0,-.48);
  limbs.push(arm,leg);elbows.push(elbow);knees.push(knee);arm.userData.hand=hand;
 }
 const pony=joint(head,0,.17,-.19);clothParts.push(pony);
 const sash=joint(body,-.22,1.23,.16);clothParts.push(sash);
 g.updateMatrixWorld(true);const skeleton=new T.Skeleton(bones);
 const mats={skin:'#b97b59',top:'#243d49',trim:'#e6b45e',pants:'#39444f',wrap:'#e1d8bd',shoe:'#944e39',hair:'#172b39'};
 const materials=Object.fromEntries(Object.entries(mats).map(([k,color])=>[k,new T.MeshStandardMaterial({color,roughness:.88,metalness:0,vertexColors:true})]));
 const index=b=>bones.indexOf(b),one=b=>[[index(b),1]],blend=(a,b,w)=>[[index(a),1-w],[index(b),w]];
 // Ring: x, y, z, lateral radius, depth radius, weights, optional painted shade.
 function surface(rings,mat,sides=12){
  if(rings.at(-1)[1]<rings[0][1])rings=[...rings].reverse();
  const cap=r=>[r[0],r[1],r[2],0,0,r[5],r[6]??1];
  rings=[cap(rings[0]),...rings,cap(rings.at(-1))];
  const positions=[],weights=[],indices=[],skinIndices=[],colors=[];
  for(const [x,y,z,rx,rz,bind,shade=1] of rings){
   for(let i=0;i<=sides;i++){
    const a=i/sides*Math.PI*2;positions.push(x+Math.cos(a)*rx,y,z+Math.sin(a)*rz);
    const ids=[0,0,0,0],ws=[0,0,0,0];bind.forEach(([id,w],n)=>{ids[n]=id;ws[n]=w;});skinIndices.push(...ids);weights.push(...ws);
    const tone=shade*(.91+.09*Math.sin(a));colors.push(tone,tone,tone);
   }
  }
  for(let j=0;j<rings.length-1;j++)for(let i=0;i<sides;i++){const a=j*(sides+1)+i,b=a+sides+1;indices.push(a,b,a+1,b,b+1,a+1);}
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('skinIndex',new T.Uint16BufferAttribute(skinIndices,4));geometry.setAttribute('skinWeight',new T.Float32BufferAttribute(weights,4));geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.setIndex(indices);geometry.computeVertexNormals();
  const mesh=new T.SkinnedMesh(geometry,materials[mat]);body.add(mesh);mesh.bind(skeleton);mesh.castShadow=true;mesh.frustumCulled=false;return mesh;
 }
 // Sculpted waist/ribcage instead of a single trapezoid. A fitted sleeveless tunic.
 surface([[0,1.17,0,.25,.155,one(body)],[0,1.3,0,.245,.15,blend(body,spine,.3)],[0,1.44,0,.255,.155,blend(body,spine,.75)],[0,1.61,.012,.31,.18,one(spine)],[0,1.8,.012,.37,.195,one(spine)],[0,1.94,0,.375,.17,one(spine)],[0,2.035,0,.27,.13,one(spine)],[0,2.07,0,.11,.09,one(spine)]],'top',16);
 surface([[0,1.17,0,.26,.16,one(body)],[0,1.22,0,.27,.17,one(body)],[0,1.29,0,.257,.162,blend(body,spine,.2)]],'trim',16);
 surface([[0,2.025,0,.105,.10,one(spine)],[0,2.17,0,.105,.095,blend(spine,head,.3)],[0,2.27,0,.11,.10,one(head)]],'skin');
 // Jaw, cheek and forehead rings preserve an anime silhouette without cube faces.
 surface([[0,2.21,.025,.04,.07,one(head)],[0,2.28,.022,.135,.14,one(head)],[0,2.41,0,.205,.192,one(head)],[0,2.55,-.01,.215,.19,one(head)],[0,2.68,-.02,.17,.15,one(head)],[0,2.74,-.02,.04,.04,one(head)]],'skin',20);
 for(let n=0;n<2;n++){
  const side=n?1:-1,arm=limbs[n*2],elbow=elbows[n],hand=arm.userData.hand,leg=limbs[n*2+1],knee=knees[n],x=side*.43,lx=side*.2;
  surface([[x,2.14,0,.025,.03,blend(spine,arm,.5)],[x,2.07,0,.125,.13,blend(spine,arm,.85)],[x,1.98,0,.14,.14,one(arm)],[x,1.83,0,.105,.11,one(arm)],[x,1.67,0,.085,.09,blend(arm,elbow,.18)],[x,1.59,0,.085,.085,blend(arm,elbow,.5)],[x,1.52,0,.09,.095,blend(arm,elbow,.85)],[x,1.4,0,.11,.10,one(elbow)],[x,1.25,0,.073,.075,blend(elbow,hand,.1)],[x,1.18,0,.068,.07,one(hand)]],'skin');
  surface([[x,1.49,0,.105,.105,one(elbow)],[x,1.45,0,.112,.108,one(elbow),.88],[x,1.41,0,.11,.105,one(elbow)],[x,1.37,0,.103,.10,one(elbow),.88],[x,1.33,0,.094,.092,one(elbow)],[x,1.27,0,.083,.083,one(elbow),.9],[x,1.22,0,.079,.08,one(hand)]],'wrap');
  surface([[x,1.23,0,.065,.065,one(hand)],[x,1.17,.018,.095,.085,one(hand)],[x,1.08,.027,.095,.083,one(hand)],[x,1.04,.025,.035,.04,one(hand)]],'skin');
  surface([[lx,1.22,0,.17,.17,blend(body,leg,.45)],[lx,1.09,0,.19,.18,one(leg)],[lx,.94,0,.18,.17,one(leg)],[lx,.78,0,.145,.135,blend(leg,knee,.05)],[lx,.65,0,.115,.12,blend(leg,knee,.4)],[lx,.57,0,.112,.12,blend(leg,knee,.75)],[lx,.46,0,.13,.125,one(knee)],[lx,.3,0,.108,.105,one(knee)],[lx,.17,0,.077,.08,one(knee)]],'pants');
  surface([[lx,.39,0,.12,.115,one(knee)],[lx,.34,0,.115,.11,one(knee),.85],[lx,.29,0,.105,.105,one(knee)],[lx,.24,0,.10,.10,one(knee),.87],[lx,.18,0,.095,.095,one(knee)]],'wrap');
  surface([[lx,.205,.015,.09,.105,one(knee)],[lx,.16,.045,.11,.145,one(knee)],[lx,.09,.08,.125,.2,one(knee)],[lx,.045,.08,.125,.2,one(knee)]],'shoe');
  surface([[lx,.05,.08,.128,.203,one(knee)],[lx,.025,.08,.125,.2,one(knee)]],'wrap');
 }
 // Shaped hair cap and separate curved locks, all attached to head/ponytail bones.
 surface([[0,2.5,-.04,.215,.185,one(head)],[0,2.64,-.04,.225,.19,one(head)],[0,2.77,-.06,.16,.14,one(head)],[0,2.81,-.065,.025,.03,one(head)]],'hair',16);
 for(let i=-2;i<=2;i++)surface([[i*.075,2.7,.13,.055,.045,one(head)],[i*.075+.02,2.6,.17,.06,.04,one(head)],[i*.075+.045,2.46+Math.abs(i)*.04,.19,.008,.01,one(head)]],'hair',8);
 for(const side of [-1,1])surface([[side*.2,2.65,-.04,.065,.075,one(head)],[side*.22,2.44,-.07,.06,.07,one(head)],[side*.215,2.26,-.09,.008,.015,one(head)]],'hair',8);
 surface([[0,2.67,-.2,.11,.10,one(pony)],[0,2.52,-.32,.125,.11,one(pony)],[.03,2.28,-.37,.10,.085,one(pony)],[.07,2.04,-.32,.06,.05,one(pony)],[.10,1.93,-.27,.005,.008,one(pony)]],'hair');
 surface([[-.22,1.24,.17,.07,.025,one(sash)],[-.24,1.01,.22,.065,.022,one(sash)],[-.32,.76,.20,.06,.02,one(sash)],[-.36,.62,.16,.04,.015,one(sash)]],'trim',6);
 // Painted facial features: one small transparent texture, no external downloads.
 const size=128,data=new Uint8Array(size*size*4);
 const pixel=(x,y,c)=>{if(x<0||y<0||x>=size||y>=size)return;const at=(y*size+x)*4;data.set(c,at);};
 const oval=(cx,cy,rx,ry,c)=>{for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)pixel(x,y,c);};
 for(const cx of [34,94]){oval(cx,76,22,11,[40,27,27,255]);oval(cx,74,20,8,[250,239,214,255]);oval(cx,74,8,9,[118,70,34,255]);oval(cx,74,4,8,[26,27,32,255]);oval(cx-3,78,3,3,[255,255,243,255]);for(let x=-20;x<=20;x++)for(let y=0;y<4;y++)pixel(cx+x,96+Math.round((cx<64?-x:x)*.13)+y,[38,32,31,255]);}
 oval(64,46,3,7,[135,78,57,110]);oval(64,23,12,2,[103,49,42,230]);oval(64,19,8,2,[217,136,108,150]);
 const texture=new T.DataTexture(data,size,size);texture.colorSpace=T.SRGBColorSpace;texture.needsUpdate=true;
 const face=new T.Mesh(new T.PlaneGeometry(.37,.25),new T.MeshBasicMaterial({map:texture,transparent:true,depthWrite:false,side:T.FrontSide}));face.position.set(0,-.025,.195);head.add(face);
 // Cloth front/back panels and seams, painted into vertex colors on fitted surfaces.
 surface([[0,1.33,.161,.055,.006,blend(body,spine,.5)],[0,1.55,.185,.08,.007,one(spine)],[0,1.8,.21,.095,.007,one(spine)],[0,1.97,.16,.06,.007,one(spine)]],'trim',8);
 surface([[0,1.35,-.155,.035,.006,blend(body,spine,.5)],[0,1.64,-.184,.045,.006,one(spine)],[0,1.94,-.17,.045,.006,one(spine)]],'trim',8);
 const shadow=new T.Mesh(new T.CircleGeometry(.62,24),new T.MeshBasicMaterial({color:'#090f16',transparent:true,opacity:.35,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.015;g.add(shadow);
 const aura=new T.Mesh(new T.TorusGeometry(.72,.016,5,40),new T.MeshBasicMaterial({color:'#f5b65d'}));aura.rotation.x=-Math.PI/2;aura.position.y=.025;g.add(aura);
 return {g,body,spine,head,limbs,elbows,knees,clothParts,aura,spirit:null,id:2,skeleton};
}
