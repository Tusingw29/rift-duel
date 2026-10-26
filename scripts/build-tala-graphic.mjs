import {combatRigSpec,combatBoneIndex as BI} from '../dist/tala-combat-rig.js';
// Graphic flat-color Tala. Reuses the proven CC0-derived body/weights; authors
// a new geometric face, solid hair clumps, palette and portable live-motion clips.
// No Blender, network downloads, texture decoders or third-party build packages.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
import * as T from '../dist/vendor/three.module.js';
import {GLTFLoader} from '../dist/vendor/GLTFLoader.js';
import {createLiveTalaReview,LIVE_TALA_CLIPS} from '../dist/tala-live-review.js';
const root=new URL('../',import.meta.url),out=new URL('dist/assets/tala-graphic/',root);
mkdirSync(out,{recursive:true});
const source=readFileSync(new URL('dist/assets/models/tala-v3.glb',root));
const jl=source.readUInt32LE(12),src=JSON.parse(source.subarray(20,20+jl)),binary=source.subarray(28+jl);
const types={5126:Float32Array,5125:Uint32Array,5123:Uint16Array,5121:Uint8Array},sizes={SCALAR:1,VEC2:2,VEC3:3,VEC4:4,MAT4:16};
function readAccessor(i){const a=src.accessors[i],v=src.bufferViews[a.bufferView],Type=types[a.componentType];return new Type(binary.buffer,binary.byteOffset+(v.byteOffset||0)+(a.byteOffset||0),a.count*sizes[a.type]).slice();}
const palette={skin:'#e8ad79',ochre:'#d9a139',charcoal:'#292d35',rust:'#994e36',wrap:'#e8ddc3',shoe:'#272d34',hair:'#833b28',hairLight:'#b15b36',ink:'#382522',white:'#fff2dc',iris:'#91572b',lip:'#a75d44',gold:'#c8a46b'};
const materialNames=Object.keys(palette),matIndex=n=>materialNames.indexOf(n);
const materials=materialNames.map(name=>({name:'Graphic_'+name,pbrMetallicRoughness:{baseColorFactor:[...new T.Color(palette[name]).toArray(),1],metallicFactor:0,roughnessFactor:1},doubleSided:false,extras:{graphicFlat:true,paletteRole:name}}));
const parts=[];
function add(name,g,material,bone=2){
 if(!g.attributes.skinIndex){const j=[],w=[];for(let i=0;i<g.attributes.position.count;i++){j.push(bone,0,0,0);w.push(1,0,0,0);}g.setAttribute('skinIndex',new T.Uint16BufferAttribute(j,4));g.setAttribute('skinWeight',new T.Float32BufferAttribute(w,4));}
 if(!g.index)g.setIndex(Array.from({length:g.attributes.position.count},(_,i)=>i));
 g.computeVertexNormals();
 // Weld lighting normals across duplicated source UV vertices without changing skin topology.
 const groups=new Map(),pp=g.attributes.position,nn=g.attributes.normal;for(let i=0;i<pp.count;i++){const key=[pp.getX(i),pp.getY(i),pp.getZ(i)].map(v=>Math.round(v*1e5)).join(',');let group=groups.get(key);if(!group){group={ids:[],normal:new T.Vector3()};groups.set(key,group);}group.ids.push(i);group.normal.add(new T.Vector3().fromBufferAttribute(nn,i));}for(const group of groups.values()){group.normal.normalize();for(const i of group.ids)nn.setXYZ(i,...group.normal.toArray());}
 parts.push({name:'TalaGraphic_'+name,g,material});return g;
}
const kept={body:'skin',suit:'charcoal',shoes:'shoe',shorts:'rust',wrap_arm_L:'wrap',wrap_arm_R:'wrap',wrap_shin_L:'wrap',wrap_shin_R:'wrap',waistband:'charcoal'};
for(const m of src.meshes){const name=m.name.replace('TalaV3_','');if(!kept[name])continue;const p=m.primitives[0],g=new T.BufferGeometry();
 for(const [from,to] of Object.entries({POSITION:'position',NORMAL:'normal',JOINTS_0:'skinIndex',WEIGHTS_0:'skinWeight'})){const a=src.accessors[p.attributes[from]];g.setAttribute(to,new T.BufferAttribute(readAccessor(p.attributes[from]),sizes[a.type]));}
 let ix=Array.from(readAccessor(p.indices));
 // Remove the realistic head, retaining neck and shoulder deformation unchanged.
 if(name==='body'){const pos=g.attributes.position;ix=ix.filter((_,i)=>{const tri=ix.slice(Math.floor(i/3)*3,Math.floor(i/3)*3+3);return tri.every(v=>pos.getY(v)<2.47)&&!tri.every(v=>{const j=g.attributes.skinIndex,w=g.attributes.skinWeight;let hand=0;for(let k=0;k<4;k++)if([5,10].includes(j.array[v*4+k]))hand+=w.array[v*4+k];return hand>.45;});});}
 // A wrap must follow its own forearm, never an adjacent torso surface.
 if(name.startsWith('wrap_arm_')){const expected=name.endsWith('L')?[3,4,5]:[8,9,10],j=g.attributes.skinIndex,w=g.attributes.skinWeight;ix=ix.filter((_,i)=>ix.slice(Math.floor(i/3)*3,Math.floor(i/3)*3+3).every(v=>{let weight=0;for(let k=0;k<4;k++)if(expected.includes(j.array[v*4+k]))weight+=w.array[v*4+k];return weight>.9;}));}
 if(name==='suit'){
  const sleeve=[],top=[],pos=g.attributes.position;
  for(let i=0;i<ix.length;i+=3){const tri=ix.slice(i,i+3);const x=tri.reduce((n,v)=>n+Math.abs(pos.getX(v)),0)/3,z=tri.reduce((n,v)=>n+pos.getZ(v),0)/3;if(x>.205)sleeve.push(...tri);else if(z<0||x<.075)top.push(...tri);}
  const shoulder=g.clone();shoulder.setIndex(sleeve);add('shoulder_skin',shoulder,'skin');continue;
 }
 g.setIndex(ix);add(name,g,kept[name]);
}
// Elliptical lofts with a flatter front surface: connected sculptural head,
// neck overlap, angular jaw, broad temples and a compact rounded cranium.
function loft(name,rows,material,bone=2,segments=24,start=0,span=Math.PI*2){const p=[],ix=[];
 for(const [x,y,z,rx,rz] of rows)for(let i=0;i<=segments;i++){const a=start+i/segments*span;p.push(x+Math.cos(a)*rx,y,z+Math.sin(a)*rz);}
 for(let j=0;j<rows.length-1;j++)for(let i=0;i<segments;i++){const a=j*(segments+1)+i,b=a+segments+1;ix.push(a,b,a+1,b,b+1,a+1);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(ix);return add(name,g,material,bone);
}
loft('suit',[[0,2.04,.025,.23,.18],[0,2.16,.02,.25,.21],[0,2.28,.025,.27,.23],[0,2.39,.015,.205,.16],[0,2.435,.04,.10,.09]],'charcoal',1);
const neck=loft('neck',[[0,2.435,.045,.105,.09],[0,2.47,.045,.082,.077],[0,2.51,.05,.073,.071],[0,2.55,.055,.068,.066],[0,2.59,.06,.065,.067]],'skin');
for(let i=0;i<neck.attributes.position.count;i++){const t=Math.max(0,Math.min(1,(neck.attributes.position.getY(i)-2.48)/.095));neck.attributes.skinIndex.setXYZW(i,1,2,0,0);neck.attributes.skinWeight.setXYZW(i,1-t,t,0,0);}
loft('head',[[0,2.555,.055,.067,.064],[0,2.585,.085,.052,.076],[0,2.62,.072,.088,.111],[0,2.67,.055,.125,.136],[0,2.735,.05,.151,.145],[0,2.8,.035,.15,.145],[0,2.865,.02,.135,.13],[0,2.92,.012,.085,.09],[0,2.94,.01,.002,.002]],'skin');
function ellipsoid(name,pos,scale,material,bone=2){const g=new T.SphereGeometry(1,16,10);g.scale(...scale);g.translate(...pos);return add(name,g,material,bone);}
for(const s of [-1,1])ellipsoid('ear_'+s,[s*.143,2.705,.039],[.024,.043,.025],'skin');
// Small solid nose, deliberately simplified rather than a realistic nasal sculpt.
const nose=new T.BufferGeometry();nose.setAttribute('position',new T.Float32BufferAttribute([-.015,2.716,.187,.015,2.716,.187,0,2.663,.211,-.017,2.657,.182,.017,2.657,.182],3));nose.setIndex([0,2,1,0,3,2,1,2,4,3,4,2]);add('nose',nose,'skin');
// Graphic face geometry has no transparent cards or texture seams.
function patch(name,points,material){if(new T.Vector3(...points[1]).sub(new T.Vector3(...points[0])).cross(new T.Vector3(...points[2]).sub(new T.Vector3(...points[0]))).z<0)points=[...points].reverse();const p=points.flat(),ix=[];for(let i=1;i<points.length-1;i++)ix.push(0,i,i+1);const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(ix);return add(name,g,material);}
function faceZ(x,y,offset=0){return .05+.146*Math.sqrt(Math.max(.05,1-(x/.153)**2))+offset;}
for(const s of [-1,1]){
 const shape=[[-.047,0],[-.035,.01],[-.019,.017],[.002,.019],[.025,.017],[.045,.009],[.032,-.008],[.012,-.014],[-.01,-.014],[-.03,-.009]];
 const eye=(name,scale,material,offset)=>{let pts=shape.map(([x,y])=>{const xx=s*(.068+x*scale*.86);return [xx,2.725+y*scale*.82,faceZ(xx,2.725,offset)];});if(s<0)pts=pts.reverse();patch(name+'_'+s,pts,material);};
 eye('eye_outline',1.08,'ink',.003);eye('eye_white',.97,'white',.005);
 const iris=ellipsoid('iris_'+s,[s*.068,2.726,faceZ(.068,2.726,.009)],[.0155,.016,.004],'iris');
 ellipsoid('pupil_'+s,[s*.068,2.726,faceZ(.068,2.726,.013)],[.006,.013,.002],'ink');
 ellipsoid('eye_glint_'+s,[s*.068-.005,2.734,faceZ(.068,2.726,.016)],[.004,.005,.0015],'white');
 let brow=[[.026,2.765],[.052,2.774],[.109,2.779],[.105,2.771],[.052,2.767]].map(([x,y])=>[s*x,y,faceZ(x,y,.003)]);if(s<0)brow=brow.reverse();patch('brow_'+s,brow,'ink');
}
patch('mouth',[[-.029,2.637,.181],[0,2.638,.189],[.029,2.637,.181],[.012,2.632,.188],[-.015,2.632,.187]],'lip');
// Opaque swept hair forms. No hair-card transparency, strands or surface noise.
loft('hair_cap',[[0,2.76,.018,.153,.151],[0,2.83,.012,.159,.153],[0,2.9,.0,.13,.132],[0,2.95,-.012,.065,.08],[0,2.962,-.012,.002,.002]],'hair');
loft('hair_nape',[[0,2.62,.02,.105,.115],[0,2.69,.02,.145,.147],[0,2.76,.018,.156,.155],[0,2.84,.012,.156,.15]],'hair',2,20,Math.PI,Math.PI);
function lock(name,a,b,c,width,depth,material='hair',bone=2){const curve=new T.QuadraticBezierCurve3(new T.Vector3(...a),new T.Vector3(...b),new T.Vector3(...c)),p=[],ix=[],steps=12,sides=10;
 for(let j=0;j<=steps;j++){const t=j/steps,point=curve.getPoint(t),tangent=curve.getTangent(t),u=new T.Vector3(0,0,1).cross(tangent).normalize(),v=tangent.clone().cross(u).normalize(),taper=Math.pow(1-t,.65)*(.72+.4*Math.sin(t*Math.PI))+.008;
 for(let i=0;i<=sides;i++){const angle=i/sides*Math.PI*2,pt=point.clone().addScaledVector(u,Math.cos(angle)*width*taper).addScaledVector(v,Math.sin(angle)*depth*taper);p.push(...pt.toArray());}}
 for(let j=0;j<steps;j++)for(let i=0;i<sides;i++){const a=j*(sides+1)+i,b=a+sides+1;ix.push(a,a+1,b,a+1,b+1,b);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(ix);add(name,g,material,bone);
 if(bone===13){for(let j=0;j<=steps;j++){const t=Math.min(1,(j/steps)/.4),w=t*t*(3-2*t);for(let i=0;i<=sides;i++){const n=j*(sides+1)+i;g.attributes.skinIndex.setXYZW(n,2,13,0,0);g.attributes.skinWeight.setXYZW(n,1-w,w,0,0);}}}
}
lock('fringe_1',[-.09,2.9,.12],[-.08,2.81,.19],[-.137,2.7,.16],.052,.026);
lock('fringe_2',[-.047,2.93,.13],[.012,2.86,.195],[.072,2.77,.184],.06,.026,'hairLight');
lock('fringe_3',[.025,2.925,.12],[.094,2.86,.17],[.137,2.741,.138],.047,.024);
lock('temple_L',[-.133,2.84,.03],[-.171,2.72,.04],[-.148,2.59,.066],.04,.025);
lock('temple_R',[.133,2.84,.03],[.172,2.73,.04],[.157,2.62,.066],.039,.025);
ellipsoid('hair_tie',[0,2.867,-.14],[.055,.045,.035],'charcoal',2);
lock('ponytail_center',[0,2.87,-.14],[.045,3.03,-.44],[.13,2.15,-.52],.12,.079,'hair',13);
lock('ponytail_outer',[-.025,2.86,-.16],[-.19,2.85,-.47],[-.16,2.24,-.58],.084,.055,'hair',13);
lock('ponytail_light',[.03,2.87,-.17],[.18,2.94,-.44],[.24,2.32,-.57],.075,.052,'hairLight',13);
lock('ponytail_inner',[-.014,2.87,-.155],[-.08,2.87,-.36],[-.04,2.12,-.43],.067,.044,'hair',13);
lock('fringe_accent',[-.105,2.91,.11],[-.02,2.89,.19],[.092,2.79,.17],.028,.017,'hair');
// Closed fists and thumbs weighted to hand pivots, with forearm-to-hand overlap.
function roundedBlock(name,center,size,radius,material,bone){
 const g=new T.BoxGeometry(...size,5,5,5),p=g.attributes.position,half=size.map(v=>v/2-radius);
 for(let i=0;i<p.count;i++){const v=new T.Vector3().fromBufferAttribute(p,i),c=new T.Vector3(...v.toArray().map((v,k)=>Math.max(-half[k],Math.min(half[k],v))));v.sub(c).normalize().multiplyScalar(radius).add(c).add(new T.Vector3(...center));p.setXYZ(i,...v.toArray());}
 return add(name,g,material,bone);
}
for(const [side,bone] of [[-1,5],[1,10]]){
 const x=side*.2744,S=side<0?'L':'R';
 roundedBlock('fist_'+side,[x,1.479,.035],[.103,.085,.066],.018,'wrap',bone);
 for(let f=0;f<5;f++)for(let j=0;j<3;j++){
  const name=`finger${f}.${j}.${S}`,spec=combatRigSpec[BI[name]],length=f===4?[.025,.024,.020][j]:[.04,.028,.022][j];
  ellipsoid('finger_'+side+'_'+f+'_'+j,[spec.at[0],spec.at[1]-length/2,spec.at[2]],[f===4?.018:.013,length*.61,f===4?.018:.014],'skin',BI[name]);
 }
}
// Clean fitted vest panels with a continuous open front and straight hems.
for(const side of [-1,1]){
 const rows=[[2.055,.07,.23,.23],[2.16,.065,.25,.27],[2.28,.065,.26,.288],[2.39,.07,.23,.25],[2.47,.085,.16,.172]],p=[],ix=[];
 for(const [y,inner,outer,z] of rows)for(let i=0;i<=6;i++){const t=i/6,x=inner+(outer-inner)*t;p.push(side*x,y-(y>2.46?.035*t:0),z-.08*t*t);}
 for(let j=0;j<rows.length-1;j++)for(let i=0;i<6;i++){const a=j*7+i,b=a+7;ix.push(...(side>0?[a,a+1,b,a+1,b+1,b]:[a,b,a+1,a+1,b,b+1]));}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(ix);add(side<0?'vest':'vest_R',g,'ochre',1);
}
// Side seams join front and back below the armholes.
for(const side of [-1,1]){const p=[],ix=[],rows=[[2.055,.23,.15,-.155],[2.16,.25,.19,-.195],[2.28,.26,.208,-.205]];for(const [y,x,front,back] of rows)for(let i=0;i<=8;i++){const t=i/8;p.push(side*(x+.014*Math.sin(t*Math.PI)),y,front+(back-front)*t);}for(let j=0;j<2;j++)for(let i=0;i<8;i++){const a=j*9+i,b=a+9;ix.push(a,a+1,b,a+1,b+1,b);}const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(ix);add('vest_side_'+side,g,'ochre',1);}
// The vest continues across the back and over both shoulders.
{
 const p=[],ix=[],rows=[[2.055,.23,-.18],[2.16,.25,-.22],[2.28,.26,-.23],[2.39,.23,-.20],[2.47,.16,-.107]];
 for(const [y,width,z] of rows)for(let i=0;i<=12;i++){const t=i/6-1;p.push(width*t,y-(y>2.46?.035*Math.max(0,(Math.abs(width*t)-.085)/.075):0),z+.025*t*t);}
 for(let j=0;j<4;j++)for(let i=0;i<12;i++){const a=j*13+i,b=a+13;ix.push(a,b,a+1,a+1,b,b+1);}
 const g=new T.BufferGeometry();g.setAttribute('position',new T.Float32BufferAttribute(p,3));g.setIndex(ix);add('vest_back',g,'ochre',1);
 for(const side of [-1,1]){const pp=[],ii=[];for(let j=0;j<=8;j++){const t=j/8;for(let i=0;i<=4;i++){const u=i/4,x=.085+i*.01875,front=.172-.08*u*u,back=-.107+.025*(x/.16)**2;pp.push(side*x,2.47-.035*u+.014*Math.sin(t*Math.PI),front+(back-front)*t);}}for(let j=0;j<8;j++)for(let i=0;i<4;i++){const a=j*5+i,b=a+5;ii.push(a,a+1,b,a+1,b+1,b);}const gg=new T.BufferGeometry();gg.setAttribute('position',new T.Float32BufferAttribute(pp,3));gg.setIndex(ii);add('vest_shoulder_'+side,gg,'ochre',1);}
}
// Small fitted collar flaps, as opposed to a bulky standing collar.
for(const s of [-1,1]){let pts=[[s*.065,2.48,.13],[s*.15,2.44,.185],[s*.095,2.35,.25],[s*.043,2.43,.18]];if(s<0)pts=pts.reverse();const g=patch('lapel_'+s,pts,'ochre');const j=g.attributes.skinIndex;for(let i=0;i<j.count;i++)j.setX(i,1);materials[matIndex('ochre')].doubleSided=true;}
// Redistribute source weights to the actual deformation joints, preserving normalization.
for(const part of parts){const g=part.g,p=g.attributes.position,j=g.attributes.skinIndex,w=g.attributes.skinWeight;
 for(let v=0;v<p.count;v++){
  const weights=new Map(),push=(b,n)=>{if(n>0)weights.set(b,(weights.get(b)||0)+n);},y=p.getY(v),z=p.getZ(v);
  for(let k=0;k<4;k++){const b=j.array[v*4+k],weight=w.array[v*4+k];if(!weight)continue;
   if(b===1){const stations=[[1.61,BI['pelvis.control']],[1.82,BI['spine.lower']],[2.02,BI['spine.upper']],[2.2,1]];let hi=stations.findIndex(s=>s[0]>=y);if(hi<0)hi=3;if(hi===0)push(stations[0][1],weight);else{const a=stations[hi-1],c=stations[hi],t=Math.max(0,Math.min(1,(y-a[0])/(c[0]-a[0])));push(a[1],weight*(1-t));push(c[1],weight*t);}}
   else if(b===0&&y>1.3)push(BI['pelvis.control'],weight);
   else if(part.name.endsWith('_neck')){const t=Math.max(0,Math.min(1,(y-2.53)/.10));push(BI['neck.control'],weight*(1-t));push(2,weight*t);}
   else if([3,8,4,9].includes(b)){const S=b<8?'L':'R',fore=[4,9].includes(b),mid=fore?1.69:2.13,t=Math.max(0,1-Math.abs(y-mid)/(fore?.19:.21))*.65;push(b,weight*(1-t));push(BI[(fore?'fore_twist.':'upper_twist.')+S],weight*t);}
   else if(b===13){const t=Math.max(0,Math.min(1,(2.78-y)/.55)),mid=BI['ponytail.mid'],tip=BI['ponytail.tip'];if(t<.5){push(13,weight*(1-t*2));push(mid,weight*t*2);}else{push(mid,weight*(2-2*t));push(tip,weight*(2*t-1));}}
   else if([15,16].includes(b)&&z>.12){const t=Math.min(.9,(z-.12)/.18);push(b,weight*(1-t));push(BI['toe.'+(b===15?'L':'R')],weight*t);}
   else push(b,weight);
  }
  const sorted=[...weights].sort((a,b)=>b[1]-a[1]).slice(0,4),sum=sorted.reduce((n,v)=>n+v[1],0);for(let k=0;k<4;k++){j.array[v*4+k]=sorted[k]?.[0]||0;w.array[v*4+k]=(sorted[k]?.[1]||0)/sum;}
 }
}
// GLB writer: compact, texture-free, all skin weights and inverse binds retained.
const chunks=[],views=[],accessors=[];let offset=0;
function access(array,type,extra={}){const bytes=Buffer.from(array.buffer,array.byteOffset,array.byteLength),padding=(4-bytes.length%4)%4;views.push({buffer:0,byteOffset:offset,byteLength:bytes.length});chunks.push(bytes,Buffer.alloc(padding));offset+=bytes.length+padding;const componentType=array instanceof Float32Array?5126:array instanceof Uint32Array?5125:array instanceof Uint16Array?5123:5121;accessors.push({bufferView:views.length-1,componentType,type,count:array.length/sizes[type],...extra});return accessors.length-1;}
const nodes=combatRigSpec.map(spec=>{const parent=spec.parent?combatRigSpec[BI[spec.parent]].at:[0,0,0];return {name:spec.name,translation:spec.at.map((v,i)=>v-parent[i]),children:combatRigSpec.map((b,i)=>b.parent===spec.name?i:-1).filter(i=>i>=0)};});
const inverse=combatRigSpec.flatMap(spec=>new T.Matrix4().makeTranslation(...spec.at.map(v=>-v)).toArray());
const skin={joints:combatRigSpec.map((_,i)=>i),skeleton:0,inverseBindMatrices:access(new Float32Array(inverse),'MAT4')};
const meshes=[];
for(const {name,g,material} of parts){g.computeBoundingBox();const attributes={};for(const [key,attribute,type] of [['POSITION','position','VEC3'],['NORMAL','normal','VEC3'],['JOINTS_0','skinIndex','VEC4'],['WEIGHTS_0','skinWeight','VEC4']])attributes[key]=access(g.attributes[attribute].array,type,key==='POSITION'?{min:g.boundingBox.min.toArray(),max:g.boundingBox.max.toArray()}:{});
 meshes.push({name,primitives:[{attributes,indices:access(new Uint32Array(g.index.array),'SCALAR'),material:matIndex(material)}]});nodes.push({name,mesh:meshes.length-1,skin:0});}
const doc={asset:{version:'2.0',generator:'Rift Duel graphic-flat Three.js builder'},scene:0,scenes:[{nodes:[0,...nodes.map((_,i)=>i).filter(i=>i>=combatRigSpec.length)],extras:{...src.scenes[0].extras,artStyle:'graphic-flat',combatRig:1,version:3}}],nodes,meshes,skins:[skin],materials,accessors,bufferViews:views,buffers:[{byteLength:offset}]};
function encode(){doc.buffers[0].byteLength=offset;const jb=Buffer.from(JSON.stringify(doc)),jp=(4-jb.length%4)%4,bin=Buffer.concat(chunks),header=Buffer.alloc(20);header.write('glTF');header.writeUInt32LE(2,4);header.writeUInt32LE(28+jb.length+jp+bin.length,8);header.writeUInt32LE(jb.length+jp,12);header.write('JSON',16);const bh=Buffer.alloc(8);bh.writeUInt32LE(bin.length);bh.write('BIN\0',4);return Buffer.concat([header,jb,Buffer.alloc(jp,32),bh,bin]);}
// Embed portable 30fps skeletal clips sampled from the actual runtime animator.
globalThis.ProgressEvent??=class{constructor(type,data){Object.assign(this,data);}};
const raw=encode(),asset=await new GLTFLoader().parseAsync(raw.buffer.slice(raw.byteOffset,raw.byteOffset+raw.byteLength),'');
const review=createLiveTalaReview(asset.scene,{variant:'graphic'}),bones=review.rig.deformBones;
doc.animations=[];
for(const clip of LIVE_TALA_CLIPS){const tracks=bones.map(()=>({p:[],q:[],s:[]})),times=[];
 for(let f=0;f<=Math.ceil(clip.duration*30);f++){const t=Math.min(clip.duration,f/30);times.push(t);review.sample(clip.name,t);bones.forEach((b,i)=>{tracks[i].p.push(...b.position.toArray());tracks[i].q.push(...b.quaternion.toArray());tracks[i].s.push(...b.scale.toArray());});}
 const input=access(new Float32Array(times),'SCALAR',{min:[0],max:[clip.duration]}),animation={name:clip.name,samplers:[],channels:[],extras:{source:'runtime animator, local skeletal motion; root travel remains gameplay-controlled',fps:30}};
 tracks.forEach((track,i)=>{for(const [key,path,type] of [['p','translation','VEC3'],['q','rotation','VEC4'],['s','scale','VEC3']]){const sampler=animation.samplers.length;animation.samplers.push({input,output:access(new Float32Array(track[key]),type),interpolation:'LINEAR'});animation.channels.push({sampler,target:{node:i,path}});}});doc.animations.push(animation);
}
const final=encode();writeFileSync(new URL('tala-graphic.glb',out),final);
const report={style:'graphic-flat',source:'tala-v3.glb (CC0 MakeHuman-derived body and skin weights)',sourceSHA256:createHash('sha256').update(source).digest('hex'),modelSHA256:createHash('sha256').update(final).digest('hex'),bytes:final.length,meshes:parts.length,triangles:parts.reduce((n,p)=>n+p.g.index.count/3,0),bones:combatRigSpec.length,clips:LIVE_TALA_CLIPS,materials:palette,textures:0,notes:['61-bone combat rig: articulated spine, neck, shoulders, wrists, fingers, toes and hair; reweighted skin.','Round 2: tapered jaw, refined eye proportions, layered ponytail with blended roots, rounded fists with four modeled fingers, sloped vest shoulders.','Body and costume skinning reuse the existing rig; original shorts coverage retained; clean vest panels and closed fists.','Portable clips are local skeletal motion, not game logic, VFX or root travel.','Two-tone shader is in dist/graphic-flat.js; other GLB viewers use matte base materials.']};
writeFileSync(new URL('manifest.json',out),JSON.stringify(report,null,2));writeFileSync(new URL('palette.json',out),JSON.stringify(palette,null,2));console.log(JSON.stringify(report,null,2));
