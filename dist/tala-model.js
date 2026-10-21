import {talaVestPaint} from './tala-costume.js';
import {clothPaint} from './painted-textures.js';
import * as T from './vendor/three.module.js';
import {talaV3Joints,talaV3Metrics} from './tala-v3-joints.js';

// Original lightweight anime fighter, using the same animation attachment points.
// Continuous ring surfaces carry blended bone weights across elbows and knees.
export function buildTala({variant='design02'}={}){
 const v3=variant==='v3',J=v3?talaV3Joints:null;
 const g=new T.Group(),bones=[];
 const joint=(parent,x=0,y=0,z=0)=>{const b=new T.Bone();b.position.set(x,y,z);parent.add(b);bones.push(b);return b;};
 // Proportion standard (early-2000s 3D fighter look): about 7.5 heads tall, legs half
 // the height, narrow waist and hips, broad shoulders, long arms, small head.
 // Authored ring coordinates stay in the original space and are remapped here.
 const Y=[[0,0],[.22,.14],[.70,.78],[1.26,1.42],[1.435,1.60],[2.02,2.32],[2.21,2.50],[2.74,2.90],[3.0,3.14]];
 const mapY=y=>{for(let i=1;i<Y.length;i++)if(y<=Y[i][0]){const [a,b]=Y[i-1],[c,d]=Y[i];return b+(y-a)*(d-b)/(c-a);}return y+Y.at(-1)[1]-Y.at(-1)[0];};
 // v3: joints come from the MakeHuman-based body (straightened rest pose) so the GLB bind pose matches.
 const at=(name,fallback)=>J?J[name]:fallback;
 const sp=at('chest',[0,1.60,0]),hd=at('head',[0,2.704,0]);
 const body=joint(g),spine=joint(body,sp[0],sp[1],sp[2]),head=joint(spine,hd[0]-sp[0],hd[1]-sp[1],hd[2]-sp[2]);
 const limbs=[],elbows=[],knees=[],clothParts=[];
 for(const side of [-1,1]){
  const S=side<0?'L':'R',ua=at('upper_arm.'+S,[side*.456,2.32,0]),fa=at('forearm.'+S,[side*.456,1.79,0]),ha=at('hand.'+S,[side*.456,1.34,0]),th=at('thigh.'+S,[side*.176,1.42,0]),sh=at('shin.'+S,[side*.176,.78,0]);
  const arm=joint(spine,ua[0]-sp[0],ua[1]-sp[1],ua[2]-sp[2]),elbow=joint(arm,fa[0]-ua[0],fa[1]-ua[1],fa[2]-ua[2]),hand=joint(elbow,ha[0]-fa[0],ha[1]-fa[1],ha[2]-fa[2]);
  const leg=joint(body,th[0],th[1],th[2]),knee=joint(leg,sh[0]-th[0],sh[1]-th[1],sh[2]-th[2]);
  limbs.push(arm,leg);elbows.push(elbow);knees.push(knee);arm.userData.hand=hand;
 }
 const po=at('ponytail',[0,2.832,-.19]),sa=at('sash',[-.19,1.39,.16]);
 const pony=joint(head,po[0]-hd[0],po[1]-hd[1],po[2]-hd[2]);clothParts.push(pony);
 const sash=joint(body,sa[0],sa[1],sa[2]);clothParts.push(sash);
 g.updateMatrixWorld(true);const skeleton=new T.Skeleton(bones);
 const mats={skin:'#c58b65',top:'#37566b',trim:'#e6b45e',pants:'#39444f',wrap:'#e1d8bd',shoe:'#963e35',hair:'#71342c'};
 const materials=Object.fromEntries(Object.entries(mats).map(([k,color])=>[k,new T.MeshLambertMaterial({color:k==='top'?'#ffffff':color,map:k==='top'?talaVestPaint():clothPaint(k),vertexColors:true})]));
 const index=b=>bones.indexOf(b),one=b=>[[index(b),1]],blend=(a,b,w)=>[[index(a),1-w],[index(b),w]];
 // Ring: x, y, z, lateral radius, depth radius, weights, optional painted shade.
 function surface(rings,mat,sides=12){
  // Remap authored rings into the proportion standard: longer legs and arms,
  // slimmer waist and hips, broader shoulders. Head and hair keep their shape.
  const groupOf=bind=>{const b=bones[bind[0][0]];if([...limbs.filter((_,i)=>i%2===0),...elbows,...limbs.filter((_,i)=>i%2===0).map(a=>a.userData.hand)].includes(b))return 'arm';if([...limbs.filter((_,i)=>i%2===1),...knees].includes(b))return 'leg';if(b===head||b===pony)return 'head';if(b===body||b===sash)return 'hips';return 'spine';};
  rings=rings.map(r=>{const c=[...r],y=r[1],group=groupOf(r[5]);
   const center=group==='arm'?1.06:group==='leg'||group==='hips'?.88:1,girth=group==='arm'?.92:group==='leg'?.93:group==='hips'?.86:group==='spine'?(y<1.95?.88:1.04):1;
   c[0]=r[0]*center;c[1]=mapY(y);c[3]=r[3]*girth;c[4]=r[4]*girth;return c;});
  if(rings.at(-1)[1]<rings[0][1])rings=[...rings].reverse();
  const cap=r=>[r[0],r[1],r[2],0,0,r[5],r[6]??1];
  rings=[cap(rings[0]),...rings,cap(rings.at(-1))];
  const positions=[],weights=[],indices=[],skinIndices=[],colors=[],uvs=[];
  for(const [x,y,z,rx,rz,bind,shade=1] of rings){
   for(let i=0;i<=sides;i++){
    const a=i/sides*Math.PI*2;positions.push(x+Math.cos(a)*rx,y,z+Math.sin(a)*rz);uvs.push(i/sides,(y-rings[0][1])/Math.max(.001,rings.at(-1)[1]-rings[0][1]));
    const ids=[0,0,0,0],ws=[0,0,0,0];bind.forEach(([id,w],n)=>{ids[n]=id;ws[n]=w;});skinIndices.push(...ids);weights.push(...ws);
    const tone=shade*(.91+.09*Math.sin(a));colors.push(tone,tone,tone);
   }
  }
  for(let j=0;j<rings.length-1;j++)for(let i=0;i<sides;i++){const a=j*(sides+1)+i,b=a+sides+1;indices.push(a,b,a+1,b,b+1,a+1);}
  const geometry=new T.BufferGeometry();geometry.setAttribute('uv',new T.Float32BufferAttribute(uvs,2));geometry.setAttribute('position',new T.Float32BufferAttribute(positions,3));geometry.setAttribute('skinIndex',new T.Uint16BufferAttribute(skinIndices,4));geometry.setAttribute('skinWeight',new T.Float32BufferAttribute(weights,4));geometry.setAttribute('color',new T.Float32BufferAttribute(colors,3));geometry.setIndex(indices);geometry.computeVertexNormals();
  const mesh=new T.SkinnedMesh(geometry,materials[mat]);body.add(mesh);mesh.bind(skeleton);mesh.castShadow=true;mesh.frustumCulled=false;return mesh;
 }
 // Sculpted waist/ribcage instead of a single trapezoid. A fitted sleeveless tunic.
 // Cropped athletic vest, exposed waist and fitted shorts break up the old tube silhouette.
 surface([[0,1.24,0,.225,.145,one(body)],[0,1.38,0,.215,.14,blend(body,spine,.55)],[0,1.55,0,.25,.16,one(spine)],[0,1.68,0,.29,.17,one(spine)]],'skin',16);
 surface([[0,1.54,0,.26,.17,one(spine)],[0,1.7,.012,.31,.19,one(spine)],[0,1.86,.01,.345,.185,one(spine)],[0,1.98,0,.39,.15,one(spine)],[0,2.065,0,.115,.095,one(spine)]],'top',12);
 surface([[0,1.17,0,.26,.16,one(body)],[0,1.22,0,.27,.17,one(body)],[0,1.29,0,.257,.162,blend(body,spine,.2)]],'trim',16);
 surface([[0,2.025,0,.105,.10,one(spine)],[0,2.17,0,.105,.095,blend(spine,head,.3)],[0,2.27,0,.11,.10,one(head)]],'skin');
 // Jaw, cheek and forehead rings preserve an anime silhouette without cube faces.
 surface([[0,2.21,.025,.04,.07,one(head)],[0,2.28,.022,.135,.14,one(head)],[0,2.41,0,.205,.192,one(head)],[0,2.55,-.01,.215,.19,one(head)],[0,2.68,-.02,.17,.15,one(head)],[0,2.74,-.02,.04,.04,one(head)]],'skin',20);
 for(let n=0;n<2;n++){
  const side=n?1:-1,arm=limbs[n*2],elbow=elbows[n],hand=arm.userData.hand,leg=limbs[n*2+1],knee=knees[n],x=side*.43,lx=side*.2;
  surface([[side*.32,2.10,0,.055,.06,blend(spine,arm,.5)],[side*.38,2.04,0,.095,.10,blend(spine,arm,.85)],[x,1.98,0,.10,.105,one(arm)],[x,1.83,0,.09,.095,one(arm)],[x,1.67,0,.085,.09,blend(arm,elbow,.18)],[x,1.59,0,.085,.085,blend(arm,elbow,.5)],[x,1.52,0,.09,.095,blend(arm,elbow,.85)],[x,1.4,0,.095,.09,one(elbow)],[x,1.25,0,.073,.075,blend(elbow,hand,.1)],[x,1.18,0,.068,.07,one(hand)]],'skin');
  surface([[x,1.49,0,.105,.105,one(elbow)],[x,1.45,0,.112,.108,one(elbow),.88],[x,1.41,0,.11,.105,one(elbow)],[x,1.37,0,.103,.10,one(elbow),.88],[x,1.33,0,.094,.092,one(elbow)],[x,1.27,0,.083,.083,one(elbow),.9],[x,1.22,0,.079,.08,one(hand)]],'wrap');
  surface([[x,1.23,0,.065,.065,one(hand)],[x,1.17,.018,.095,.085,one(hand)],[x,1.08,.027,.095,.083,one(hand)],[x,1.04,.025,.035,.04,one(hand)]],'skin');
  surface([[lx,1.19,0,.145,.15,blend(body,leg,.45)],[lx,1.04,0,.15,.15,one(leg)],[lx,.85,0,.13,.13,one(leg)],[lx,.67,0,.095,.105,blend(leg,knee,.3)],[lx,.59,0,.095,.10,blend(leg,knee,.65)],[lx,.48,0,.105,.10,one(knee)],[lx,.31,0,.085,.085,one(knee)],[lx,.17,0,.075,.075,one(knee)]],'skin');
  surface([[lx,1.22,0,.163,.165,blend(body,leg,.4)],[lx,1.08,0,.167,.165,one(leg)],[lx,.96,0,.15,.15,one(leg)]],'pants');
  surface([[lx,.98,0,.155,.153,one(leg)],[lx,.945,0,.15,.15,one(leg)]],'trim');
  surface([[lx,.57,0,.105,.11,one(knee)],[lx,.46,0,.116,.112,one(knee)],[lx,.32,0,.1,.1,one(knee)],[lx,.18,0,.09,.09,one(knee)]],'wrap');
  surface([[lx,.205,.015,.09,.105,one(knee)],[lx,.16,.045,.11,.145,one(knee)],[lx,.09,.08,.125,.2,one(knee)],[lx,.045,.08,.125,.2,one(knee)]],'shoe');
  surface([[lx,.05,.08,.128,.203,one(knee)],[lx,.025,.08,.125,.2,one(knee)]],'wrap');
 }
 surface([[0,1.06,0,.25,.155,one(body)],[0,1.14,0,.29,.17,one(body)],[0,1.22,0,.275,.16,one(body)]],'pants',16);
 // Shaped hair cap and separate curved locks, all attached to head/ponytail bones.
 surface([[0,2.5,-.04,.215,.185,one(head)],[0,2.64,-.04,.225,.19,one(head)],[0,2.77,-.06,.16,.14,one(head)],[0,2.81,-.065,.025,.03,one(head)]],'hair',16);
 for(const [x,h,tip] of [[-.13,.14,-.28],[0,.22,.035],[.13,.12,.29]])surface([[x,2.64,-.04,.11,.09,one(head)],[x,2.77,-.055,.09,.065,one(head)],[tip,2.8+h,-.075,.003,.005,one(head)]],'hair',5);
 for(let i=-2;i<=2;i++)surface([[i*.075,2.7,.13,.055,.045,one(head)],[i*.075+.02,2.6,.17,.06,.04,one(head)],[i*.075+.045,2.60+Math.abs(i)*.015,.19,.008,.01,one(head)]],'hair',8);
 for(const side of [-1,1])surface([[side*.2,2.65,-.04,.065,.075,one(head)],[side*.22,2.44,-.07,.06,.07,one(head)],[side*.215,2.26,-.09,.008,.015,one(head)]],'hair',8);
 surface([[0,2.67,-.2,.11,.10,one(pony)],[0,2.52,-.32,.125,.11,one(pony)],[.03,2.28,-.37,.10,.085,one(pony)],[.07,2.04,-.32,.06,.05,one(pony)],[.10,1.93,-.27,.005,.008,one(pony)]],'hair');
 surface([[-.22,1.24,.17,.07,.025,one(sash)],[-.24,1.01,.22,.065,.022,one(sash)],[-.32,.76,.20,.06,.02,one(sash)],[-.36,.62,.16,.04,.015,one(sash)]],'trim',6);
 // Painted facial features conform to the jaw and cheek rings.
 const size=128,data=new Uint8Array(size*size*4);
 const pixel=(x,y,c)=>{if(x<0||y<0||x>=size||y>=size)return;const at=(y*size+x)*4;data.set(c,at);};
 const oval=(cx,cy,rx,ry,c)=>{for(let y=0;y<size;y++)for(let x=0;x<size;x++)if(((x-cx)/rx)**2+((y-cy)/ry)**2<=1)pixel(x,y,c);};
 for(const cx of [34,94]){oval(cx,76,22,11,[40,27,27,255]);oval(cx,74,20,8,[250,239,214,255]);oval(cx,74,8,9,[118,70,34,255]);oval(cx,74,4,8,[26,27,32,255]);oval(cx-3,78,3,3,[255,255,243,255]);for(let x=-20;x<=20;x++)for(let y=0;y<4;y++)pixel(cx+x,96+Math.round((cx<64?-x:x)*.13)+y,[38,32,31,255]);}
 oval(64,46,3,7,[135,78,57,110]);oval(64,23,12,2,[103,49,42,230]);oval(64,19,8,2,[217,136,108,150]);
 const texture=new T.DataTexture(data,size,size);texture.colorSpace=T.SRGBColorSpace;texture.needsUpdate=true;
 const faceRows=[[-.265,.04,.095],[-.195,.135,.162],[-.065,.205,.192],[.075,.215,.18],[.205,.17,.13]];
 const pos=[],uv=[],ix=[];
 for(let j=0;j<faceRows.length;j++){const [y,width,depth]=faceRows[j];for(let i=0;i<=12;i++){const u=i/12,x=(u*2-1)*width;pos.push(x,y,depth*Math.sqrt(Math.max(0,1-(x/width)**2))+.008);uv.push(.5+x/.43,(y+.265)/.52);if(j<faceRows.length-1&&i<12){const a=j*13+i,b=a+13;ix.push(a,a+1,b,a+1,b+1,b);}}}
 const faceGeo=new T.BufferGeometry();faceGeo.setAttribute('position',new T.Float32BufferAttribute(pos,3));faceGeo.setAttribute('uv',new T.Float32BufferAttribute(uv,2));faceGeo.setIndex(ix);faceGeo.computeVertexNormals();
 const face=new T.Mesh(faceGeo,new T.MeshLambertMaterial({map:texture,transparent:true,alphaTest:.35,side:T.FrontSide}));head.add(face);
 if(typeof document!=='undefined'){
  let alive=true;face.material.addEventListener('dispose',()=>{alive=false;});
  new T.TextureLoader().load(new URL('./assets/tala-face.png',import.meta.url).href,paint=>{if(!alive){paint.dispose();return;}paint.colorSpace=T.SRGBColorSpace;paint.magFilter=T.LinearFilter;face.material.map.dispose();face.material.map=paint;face.material.needsUpdate=true;});
 }
 // Lapels, seams and back crest are painted in the vest UVs rather than
 // attached as raised tubes. Small gloves break up the hand/wrap silhouette.
 for(let n=0;n<2;n++){
  const x=(n?1:-1)*.43,hand=limbs[n*2].userData.hand;
  surface([[x,1.2,.015,.075,.075,one(hand)],[x,1.16,.025,.10,.088,one(hand)],[x,1.09,.03,.10,.086,one(hand)],[x,1.07,.03,.075,.07,one(hand)]],'shoe',8);
  surface([[x+(n?-1:1)*.074,1.17,.07,.04,.04,one(hand)],[x+(n?-1:1)*.082,1.105,.075,.035,.035,one(hand)]],'skin',8);
 }
 const shadow=new T.Mesh(new T.CircleGeometry(.62,24),new T.MeshBasicMaterial({color:'#090f16',transparent:true,opacity:.35,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.015;g.add(shadow);
 const aura=new T.Mesh(new T.TorusGeometry(.72,.016,5,40),new T.MeshBasicMaterial({color:'#f5b65d'}));aura.rotation.x=-Math.PI/2;aura.position.y=.025;g.add(aura);
 // Batch weighted surfaces by material, retaining every bone weight and UV.
 // This keeps the fuller costume under the old character draw-call budget.
 for(const material of Object.values(materials)){
  const pieces=body.children.filter(n=>n.isSkinnedMesh&&n.material===material);if(pieces.length<2)continue;
  const merged=new T.BufferGeometry(),attributes={};for(const name of Object.keys(pieces[0].geometry.attributes))attributes[name]=[];
  const indices=[];let offset=0;
  for(const piece of pieces){for(const [name,attribute] of Object.entries(piece.geometry.attributes))attributes[name].push(...attribute.array);for(const i of piece.geometry.index.array)indices.push(i+offset);offset+=piece.geometry.attributes.position.count;}
  for(const [name,array] of Object.entries(attributes)){const old=pieces[0].geometry.attributes[name];merged.setAttribute(name,name==='skinIndex'?new T.Uint16BufferAttribute(array,old.itemSize):new T.Float32BufferAttribute(array,old.itemSize));}
  merged.setIndex(indices);const mesh=new T.SkinnedMesh(merged,material);body.add(mesh);mesh.bind(skeleton);mesh.castShadow=true;mesh.frustumCulled=false;
  for(const piece of pieces){body.remove(piece);piece.geometry.dispose();}
 }
 head.scale.setScalar(v3?1:.8);
 return {g,body,spine,head,limbs,elbows,knees,clothParts,aura,spirit:null,id:2,skeleton,legLength:v3?talaV3Metrics.legLength:.64,shinLength:v3?talaV3Metrics.shinLength:.64,ankleHeight:v3?talaV3Metrics.ankleHeight:.14,variant};
}
