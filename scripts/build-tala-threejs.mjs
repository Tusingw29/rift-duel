// Tala Design 03 built with Three.js and Node only, no Blender.
// Reads the CC0 MakeHuman data (base mesh, shape targets, game-engine skeleton and weights,
// clothing fit files, textures), shapes the body to Tala's standard, poses it into the game's
// rest pose with closed fists, folds the weights into the game's 17-bone rig, dresses it, and
// writes dist/assets/models/tala-v3.glb plus the rig constants the JavaScript skeleton uses.
// Usage: node scripts/build-tala-threejs.mjs --sources <dir from scripts/fetch-tala-v3-sources.sh> --tools <dir with node_modules containing pngjs and jpeg-js> [--fighter tala|aegis|rei|morrow|sol|vesper]
// Every fighter shares this pipeline; scripts/fighter-specs.mjs holds the per-fighter shape, assets and colours.
import {readFileSync,writeFileSync,existsSync,mkdirSync} from 'node:fs';
import {gunzipSync} from 'node:zlib';
import {createRequire} from 'node:module';
import {join,dirname} from 'node:path';
import {fileURLToPath} from 'node:url';
import {Vector3,Quaternion,Matrix4} from '../dist/vendor/three.module.js';
import {specFor} from './fighter-specs.mjs';
const ROOT=join(dirname(fileURLToPath(import.meta.url)),'..');
const args=Object.fromEntries(process.argv.slice(2).map((a,i,all)=>a.startsWith('--')?[a.slice(2),all[i+1]]:[]).filter(Boolean));
const SOURCES=args.sources||process.env.TALA_SOURCES,TOOLS=args.tools||process.env.TALA_TOOLS||SOURCES;
if(!SOURCES)throw new Error('--sources <dir> is required');
const spec=specFor(args.fighter||'tala'),FIGHTER=spec.id;
const DATA=join(SOURCES,'addon/mpfb/data'),ASSETS=join(SOURCES,'assets'),OUT=join(ROOT,'art/blender',FIGHTER+'-v3');mkdirSync(OUT,{recursive:true});
const require=createRequire(join(TOOLS,'package.json'));const {PNG}=require('pngjs');const jpeg=require('jpeg-js');
const GAME_HEIGHT=2.9;
const OUR_BONES=['root','chest','head','upper_arm.L','forearm.L','hand.L','thigh.L','shin.L','upper_arm.R','forearm.R','hand.R','thigh.R','shin.R','ponytail','sash','foot.L','foot.R'];
const PARENT={root:null,chest:'root',head:'chest',ponytail:'head',sash:'root','upper_arm.L':'chest','forearm.L':'upper_arm.L','hand.L':'forearm.L','upper_arm.R':'chest','forearm.R':'upper_arm.R','hand.R':'forearm.R','thigh.L':'root','shin.L':'thigh.L','foot.L':'shin.L','thigh.R':'root','shin.R':'thigh.R','foot.R':'shin.R'};
// MakeHuman left (+X) is the game's R side (x > 0); only the names differ.
const SIDE={l:'R',r:'L'};
const CONSOLIDATE={root:['Root','pelvis','spine_01'],chest:['spine_02','spine_03','clavicle_l','clavicle_r'],head:['neck_01','head'],
 upper_arm:['upperarm'],forearm:['lowerarm'],hand:['hand','thumb_01','thumb_02','thumb_03','index_01','index_02','index_03','middle_01','middle_02','middle_03','ring_01','ring_02','ring_03','pinky_01','pinky_02','pinky_03'],thigh:['thigh'],shin:['calf'],foot:['foot','ball']};
const MACRO=spec.macro,TARGETS=spec.targets;
// ---- MakeHuman readers ---------------------------------------------------------------
function parseObj(path){
 const positions=[],uvs=[],faces=[];let group='default';
 for(const raw of readFileSync(path,'utf8').split('\n')){
  const line=raw.trim();if(!line||line[0]==='#')continue;const w=line.split(/\s+/);
  if(w[0]==='v')positions.push([+w[1],+w[2],+w[3]]);
  else if(w[0]==='vt')uvs.push([+w[1],+w[2]]);
  else if(w[0]==='g')group=w[1];
  else if(w[0]==='f'){const v=[],vt=[];for(const t of w.slice(1)){const p=t.split('/');v.push(+p[0]-1);vt.push(p[1]?+p[1]-1:-1);}faces.push({v,vt,group});}
 }
 return {positions,uvs,faces};
}
function readTarget(name){
 const path=join(DATA,'targets',name+'.target.gz');if(!existsSync(path)){console.warn('missing target',name);return [];}
 const out=[];for(const raw of gunzipSync(readFileSync(path)).toString('utf8').split('\n')){const l=raw.trim();if(!l||l[0]==='#'||l[0]==='"')continue;const p=l.split(/\s+/);out.push([+p[0],+p[1],+p[2],+p[3]]);}
 return out;
}
// Port of MPFB's macro-target interpolation: each slider blends neighbouring named targets.
function macroStack(info){
 const cfg=JSON.parse(readFileSync(join(DATA,'targets/macrodetails/macro.json'),'utf8')).macrotargets;
 const comp={};
 for(const name of ['gender','age','muscle','weight','proportions','height','cupsize','firmness']){
  const v=info[name],parts=[];
  for(const p of cfg[name].parts){if(v>p.lowest&&v<p.highest){const pct=(v-p.lowest)/(p.highest-p.lowest);if(p.low)parts.push([p.low,+(1-pct).toFixed(4)]);if(p.high)parts.push([p.high,+pct.toFixed(4)]);}}
  comp[name]=parts;
 }
 const targets=[],cut=.01;
 for(const race of Object.keys(info.race))if(info.race[race]>1e-4)for(const a of comp.age)for(const g of comp.gender)if(g[0]!=='universal'){const w=info.race[race]*g[1]*a[1];if(w>cut)targets.push([`macrodetails/${race}-${g[0]}-${a[0]}`,w]);}
 for(const g of comp.gender)for(const a of comp.age)for(const m of comp.muscle)for(const wt of comp.weight){
  const w=g[1]*a[1]*m[1]*wt[1];if(w>cut)targets.push([`macrodetails/universal-${g[0]}-${a[0]}-${m[0]}-${wt[0]}`,w]);
  for(const h of comp.height){const hw=w*h[1];if(hw>cut)targets.push([`macrodetails/height/${g[0]}-${a[0]}-${m[0]}-${wt[0]}-${h[0]}`,hw]);}
  for(const p of comp.proportions){const pw=w*p[1];if(pw>cut)targets.push([`macrodetails/proportions/${g[0]}-${a[0]}-${m[0]}-${wt[0]}-${p[0]}`,pw]);}
  if(g[0]==='female')for(const c of comp.cupsize)for(const f of comp.firmness){const bw=a[1]*m[1]*wt[1]*c[1]*f[1];const name=`breast/${g[0]}-${a[0]}-${m[0]}-${wt[0]}-${c[0]}-${f[0]}`;if(bw>cut&&!name.includes('averagecup-averagefirmness'))targets.push([name,bw]);}
 }
 return targets;
}
// ---- Body -----------------------------------------------------------------------------------
const base=parseObj(join(DATA,'3dobjs/base.obj'));
const shaped=base.positions.map(p=>p.slice());
for(const [name,w] of [...macroStack(MACRO),...TARGETS])for(const [i,dx,dy,dz] of readTarget(name)){if(i<shaped.length){shaped[i][0]+=dx*w;shaped[i][1]+=dy*w;shaped[i][2]+=dz*w;}}
const groupVerts={};for(const f of base.faces){(groupVerts[f.group]??=new Set());for(const i of f.v)groupVerts[f.group].add(i);}
const bodyVerts=groupVerts.body;
const cubes={};for(const g of Object.keys(groupVerts))if(g.startsWith('joint-')){const idx=[...groupVerts[g]],m=[0,0,0];for(const i of idx)for(let k=0;k<3;k++)m[k]+=shaped[i][k]/idx.length;cubes[g]=m;}
// ---- MakeHuman game-engine skeleton and weights --------------------------------------------
const rigJson=JSON.parse(readFileSync(join(DATA,'rigs/standard/rig.game_engine.json'),'utf8'));const rigBones=rigJson.bones||rigJson;
function strategyPos(info){
 if(info.strategy==='CUBE')return cubes[info.cube_name]?.slice();
 if(info.strategy==='MEAN'){const m=[0,0,0];for(const i of info.vertex_indices)for(let k=0;k<3;k++)m[k]+=shaped[i][k]/info.vertex_indices.length;return m;}
 if(info.strategy==='VERTEX')return shaped[info.vertex_index].slice();
 return null;
}
const mh={};for(const [name,spec] of Object.entries(rigBones)){const head=strategyPos(spec.head),tail=strategyPos(spec.tail);mh[name]={name,parent:spec.parent||null,head:new Vector3(...(head||[0,0,0])),tail:new Vector3(...(tail||head||[0,0,0]))};}
const order=[];{const seen=new Set();const visit=n=>{if(seen.has(n))return;const p=mh[n].parent;if(p&&mh[p])visit(p);seen.add(n);order.push(n);};for(const n of Object.keys(mh))visit(n);}
const rawWeights=JSON.parse(readFileSync(join(DATA,'rigs/standard/weights.game_engine.json'),'utf8')).weights;
const bodyWeights=Array.from({length:shaped.length},()=>({}));
for(const [bone,list] of Object.entries(rawWeights))for(const [i,w] of list)if(i<shaped.length&&w>1e-6)bodyWeights[i][bone]=(bodyWeights[i][bone]||0)+w;
// ---- Rest pose: limb chains straight down, fingers curled into fists -----------------------
const W={},H={};
for(const n of order){const b=mh[n],p=b.parent&&mh[b.parent]?mh[b.parent]:null;W[n]=new Quaternion();H[n]=p?b.head.clone().sub(p.head).applyQuaternion(W[p.name]).add(H[p.name]):b.head.clone();}
const DOWN=new Vector3(0,-1,0);
function rotate(name,q){// apply an extra world rotation q to this bone and everything below it
 const stack=[name];while(stack.length){const n=stack.pop();W[n].premultiply(q);for(const c of order)if(mh[c].parent===n){const b=mh[c];H[c]=b.head.clone().sub(mh[n].head).applyQuaternion(W[n]).add(H[n]);stack.push(c);}}
}
function straighten(name){const b=mh[name],dir=b.tail.clone().sub(b.head).applyQuaternion(W[name]).normalize();rotate(name,new Quaternion().setFromUnitVectors(dir,DOWN));}
for(const s of ['l','r'])for(const n of ['thigh_'+s,'calf_'+s,'upperarm_'+s,'lowerarm_'+s])straighten(n);
function curl(side){
 const knuckle=H['pinky_01_'+side].clone().sub(H['index_01_'+side]).normalize(),palm=H['hand_'+side].clone();
 const tipOf=f=>H[`${f}_03_${side}`].clone().add(mh[`${f}_03_${side}`].tail.clone().sub(mh[`${f}_03_${side}`].head).applyQuaternion(W[`${f}_03_${side}`]));
 const before=tipOf('index').distanceTo(palm);
 const trial=(sign)=>{const q=new Quaternion().setFromAxisAngle(knuckle,sign*Math.PI/180*20);const saveW=Object.fromEntries(Object.keys(W).map(k=>[k,W[k].clone()])),saveH=Object.fromEntries(Object.keys(H).map(k=>[k,H[k].clone()]));rotate('index_01_'+side,q);const d=tipOf('index').distanceTo(palm);Object.assign(W,saveW);Object.assign(H,saveH);return d;};
 const sign=trial(1)<trial(-1)?1:-1;
 for(const f of ['index','middle','ring','pinky'])for(const [seg,deg] of [['01',62],['02',78],['03',55]])rotate(`${f}_${seg}_${side}`,new Quaternion().setFromAxisAngle(knuckle,sign*deg*Math.PI/180));
 const thumbAxis=knuckle.clone().cross(DOWN).normalize();
 for(const [seg,deg] of [['01',22],['02',40],['03',30]])rotate(`thumb_${seg}_${side}`,new Quaternion().setFromAxisAngle(thumbAxis,sign*deg*Math.PI/180));
 console.log(`fist ${side}: index tip ${before.toFixed(2)} -> ${tipOf('index').distanceTo(palm).toFixed(2)} from the palm`);
}
curl('l');curl('r');
function skin(pos,weights){const out=new Vector3();let total=0;for(const [bone,w] of Object.entries(weights)){if(!mh[bone])continue;out.add(new Vector3(...pos).sub(mh[bone].head).applyQuaternion(W[bone]).add(H[bone]).multiplyScalar(w));total+=w;}return total>0?out.multiplyScalar(1/total).toArray():pos.slice();}
// ---- Parts ------------------------------------------------------------------------------------
const parts=[];
function readMhclo(path,vertexCount){
 // Vertex fit lines may be interleaved with other keys (e.g. "material" after "verts"), so numeric
 // lines after the "verts" header are collected until the mesh's vertex count is reached.
 const verts=[],del=new Set();let section='',obj=null,xs=null,ys=null,zs=null,prev=0;
 for(const raw of readFileSync(path,'utf8').split('\n')){const l=raw.trim();if(!l||l[0]==='#')continue;const w=l.split(/\s+/);
  if(/^\d/.test(w[0])&&section==='v'&&verts.length<vertexCount){if(w.length<9)verts.push({v:[+w[0],+w[0],+w[0]],w:[1,0,0],d:[0,0,0]});else verts.push({v:[+w[0],+w[1],+w[2]],w:[+w[3],+w[4],+w[5]],d:[+w[6],+w[7],+w[8]]});continue;}
  if(/^[\d-]/.test(w[0])&&section==='d'){let seq=false;for(const t of w){if(t==='-')seq=true;else{const n=+t;if(seq){for(let k=prev;k<=n;k++)del.add(k);seq=false;}else del.add(n);prev=n;}}continue;}
  if(w[0]==='obj_file')obj=join(dirname(path),w[1]);else if(w[0]==='verts')section='v';else if(w[0]==='delete_verts')section='d';
  else if(w[0]==='x_scale')xs=[+w[1],+w[2],+w[3]];else if(w[0]==='y_scale')ys=[+w[1],+w[2],+w[3]];else if(w[0]==='z_scale')zs=[+w[1],+w[2],+w[3]];
 }
 return {verts,del,obj,xs,ys,zs};
}
function addAsset(name,rel,opts={}){
 const cloPath=join(ASSETS,rel),objPath=join(dirname(cloPath),readFileSync(cloPath,'utf8').match(/^obj_file\s+(\S+)/m)[1]),mesh=parseObj(objPath),clo=readMhclo(cloPath,mesh.positions.length);
 if(clo.verts.length!==mesh.positions.length)throw new Error(`${name}: fitted ${clo.verts.length} of ${mesh.positions.length} vertices`);
 const size=k=>{const s=clo[k];return s?Math.abs(shaped[s[0]][k==='xs'?0:k==='ys'?1:2]-shaped[s[1]][k==='xs'?0:k==='ys'?1:2])/s[2]:1;};
 const sx=size('xs'),sy=size('ys'),sz=size('zs');
 const positions=mesh.positions.map((p,i)=>{const m=clo.verts[i];if(!m)return p.slice();const out=[0,0,0];for(let k=0;k<3;k++)out[k]=m.w[0]*shaped[m.v[0]][k]+m.w[1]*shaped[m.v[1]][k]+m.w[2]*shaped[m.v[2]][k];return [out[0]+m.d[0]*sx,out[1]+m.d[1]*sy,out[2]+m.d[2]*sz];});
 const weights=mesh.positions.map((p,i)=>{const m=clo.verts[i],acc={};if(!m)return {head:1};for(let k=0;k<3;k++)for(const [b,w] of Object.entries(bodyWeights[m.v[k]]))acc[b]=(acc[b]||0)+w*m.w[k];return acc;});
 parts.push({name,positions:positions.map((p,i)=>skin(p,weights[i])),uvs:mesh.uvs,faces:mesh.faces,rawWeights:weights,del:clo.del,...opts});
 return parts.at(-1);
}
// Body first (so garment deletions can apply), posed.
const body={name:'body',positions:shaped.map((p,i)=>skin(p,bodyWeights[i])),uvs:base.uvs,faces:base.faces.filter(f=>f.group==='body'),rawWeights:bodyWeights,material:'skin'};
parts.push(body);
addAsset('eyes','eyes/low-poly/low-poly.mhclo',{material:'eyes',headOnly:true});
addAsset('eyebrows',spec.eyebrows+'.mhclo',{material:'eyebrows',headOnly:true});
addAsset('eyelashes',spec.eyelashes+'.mhclo',{material:'eyelashes',headOnly:true});
addAsset('hair',spec.hair.asset+'.mhclo',{material:'hair',hair:true});
const suit=addAsset('suit',spec.outfit.asset+'.mhclo',{material:spec.tailor==='tala'?'top':'outfit'});
const shoes=addAsset('shoes',spec.shoes.asset+'.mhclo',{material:'shoes'});
// Shoes hide the feet under them. Tala's suit mask is ignored because her leggings become shorts; other outfits hide the body under them.
body.faces=body.faces.filter(f=>!f.v.some(i=>shoes.del.has(i)));
if(spec.tailor!=='tala')body.faces=body.faces.filter(f=>!f.v.some(i=>suit.del.has(i)));
// ---- Scale to game units ---------------------------------------------------------------------
const bodyY=body.positions.filter((_,i)=>bodyVerts.has(i)).map(p=>p[1]);const floor=Math.min(...bodyY),crown=Math.max(...bodyY),scale=GAME_HEIGHT/(crown-floor);
const toGame=p=>[p[0]*scale,(p[1]-floor)*scale,p[2]*scale];
for(const part of parts)part.positions=part.positions.map(toGame);
const posedHead=n=>toGame(H[n].toArray());
const joints={root:[0,0,0],chest:posedHead('spine_02'),head:posedHead('head')};
for(const s of ['l','r']){const S=SIDE[s];joints['upper_arm.'+S]=posedHead('upperarm_'+s);joints['forearm.'+S]=posedHead('lowerarm_'+s);joints['hand.'+S]=posedHead('hand_'+s);joints['thigh.'+S]=posedHead('thigh_'+s);joints['shin.'+S]=posedHead('calf_'+s);joints['foot.'+S]=posedHead('foot_'+s);}
joints.ponytail=[0,GAME_HEIGHT-.08,joints.head[2]-.19];joints.sash=[-.19,joints['thigh.L'][1]-.03,.16];
for(const k of Object.keys(joints))joints[k]=joints[k].map(v=>+v.toFixed(4));
if(spec.tailor==='tala'){
// Shorts: drop the leggings below mid-thigh and split the suit into top and shorts materials.
const hipY=joints['thigh.L'][1],kneeY=joints['shin.L'][1],cutY=hipY-(hipY-kneeY)*.42,waistY=hipY+.16;
suit.faces=suit.faces.filter(f=>!f.v.every(i=>suit.positions[i][1]<cutY));
// Straight hem: vertices of kept faces that fall below the cut plane are lifted onto it.
for(const f of suit.faces)for(const i of f.v)if(suit.positions[i][1]<cutY)suit.positions[i][1]=cutY;
const shorts={...suit,name:'shorts',material:'shorts',faces:suit.faces.filter(f=>f.v.every(i=>suit.positions[i][1]<waistY))};
suit.faces=suit.faces.filter(f=>!f.v.every(i=>suit.positions[i][1]<waistY));parts.push(shorts);
// Body under the suit above the hem is hidden; dropping it stops skin poking through tight cloth.
body.faces=body.faces.filter(f=>!f.v.some(i=>suit.del.has(i)&&body.positions[i][1]>cutY+.04));
// ---- Tailoring: wraps, vest, collar, under-top and fringe (generated geometry) ------------------
const faceNormal=(part,f)=>{const a=new Vector3(...part.positions[f.v[0]]),b=new Vector3(...part.positions[f.v[1]]),c=new Vector3(...part.positions[f.v[2]]);return b.sub(a).cross(c.sub(a)).normalize();};
function vertexNormals(part){const n=part.positions.map(()=>new Vector3());for(const f of part.faces){const fn=faceNormal(part,f);for(const i of f.v)n[i].add(fn);}return n.map(v=>v.normalize());}
// Copy a subset of a part's faces, pushed out along the surface, carrying the source weights.
function shell(source,name,keep,offset,material,uvFor){
 const normals=vertexNormals(source),map=new Map(),positions=[],uvs=[],rawWeights=[],faces=[];
 const vertex=i=>{if(map.has(i))return map.get(i);const n=positions.length;map.set(i,n);const p=source.positions[i],d=normals[i];positions.push([p[0]+d.x*offset,p[1]+d.y*offset,p[2]+d.z*offset]);rawWeights.push(source.rawWeights[i]);uvs.push(uvFor?uvFor(p):[0,0]);return n;};
 for(const f of source.faces)if(keep(f))faces.push({v:f.v.map(vertex),vt:f.v.map(vertex),group:name});
 const part={name,positions,uvs,faces,rawWeights,material};parts.push(part);return part;
}
const limbUv=(y0,y1,repeat)=>p=>[Math.atan2(p[2],p[0])/(2*Math.PI)+.5,((p[1]-y0)/(y1-y0))*repeat];
const inRange=(f,part,test)=>f.v.every(i=>test(part.positions[i]));
for(const S of ['L','R']){
 const sx=S==='L'?-1:1,hand=joints['hand.'+S],elbow=joints['forearm.'+S],knee=joints['shin.'+S],ankle=joints['foot.'+S];
 const armLo=hand[1]+.02,armHi=elbow[1]-.06,shinLo=ankle[1]+.07,shinHi=knee[1]-.05;
 shell(body,'wrap_arm_'+S,f=>inRange(f,body,p=>Math.sign(p[0])===sx&&Math.abs(p[0])>.12&&p[1]>armLo&&p[1]<armHi),.011,'wraps',limbUv(armLo,armHi,7));
 shell(body,'wrap_shin_'+S,f=>inRange(f,body,p=>Math.sign(p[0])===sx&&p[1]>shinLo&&p[1]<shinHi),.011,'wraps',limbUv(shinLo,shinHi,9));
}
// Vest: the sleeveless outer layer of the top, open down the front, over a charcoal under-top.
const shoulderY=joints['upper_arm.L'][1];
suit.material='undertop';
const hemY=joints.chest[1]-.06;
const vest=shell(suit,'vest',f=>inRange(f,suit,p=>!(Math.abs(p[0])<.07&&p[2]>0)&&!(Math.abs(p[0])>.215&&p[1]>shoulderY-.16)&&p[1]>hemY),.02,'vest',p=>[p[0]*2+.5,p[1]*2]);
// Straight hem: lift the vest vertices below the hem plane onto it.
for(const p of vest.positions)if(p[1]<hemY)p[1]=hemY;
shell(shorts,'waistband',f=>inRange(f,shorts,p=>p[1]>hipY+.09),.012,'waistband',p=>[p[0]*2+.5,p[1]*2]);
// Standing collar: an open ring around the neck base.
{const headJ=joints.head,y0=joints.chest[1]+.58,y1=y0+.11,positions=[],uvs=[],faces=[],rawWeights=[],n=14;
 for(let row=0;row<2;row++)for(let i=0;i<=n;i++){const a=(.18+ .64*i/n)*2*Math.PI;const r=row?.135:.15;positions.push([Math.cos(a)*r*1.05,row?y1:y0,Math.sin(a)*r*.9+.02]);uvs.push([i/n,row]);rawWeights.push({chest:1});}
 for(let i=0;i<n;i++){const a=i,b=i+1,c=n+1+i+1,d=n+1+i;faces.push({v:[a,b,c,d],vt:[a,b,c,d],group:'collar'});}
 parts.push({name:'collar',positions,uvs,faces,rawWeights,material:'vest',twoSided:true});
}
// Fringe: swept tapered hair cards across the forehead, weighted to the head.
{const positions=[],uvs=[],faces=[],rawWeights=[];const head=joints.head,top=GAME_HEIGHT;
 // Cards start at the hairline and sweep to the right, ending above the brow line.
 const cards=[[-.13,.0,-.02],[-.09,.01,-.01],[-.05,.02,.01],[-.01,.025,.02],[.03,.025,.03],[.07,.02,.03],[.11,.01,.02]];
 cards.forEach(([x0,lift,sweep],c)=>{const base=positions.length;const w=.028,len=.11+c*.006,z0=.19-Math.abs(x0)*.6;
  const pts=[[x0-w,top-.085+lift,z0],[x0+w,top-.085+lift,z0+.004],[x0+sweep+w*.6,top-.085+lift-len*.55,z0+.03],[x0+sweep-w*.6,top-.085+lift-len*.55,z0+.03],[x0+sweep*1.5+.01,top-.085+lift-len,z0+.045],[x0+sweep*1.5+.02,top-.085+lift-len-.015,z0+.047]];
  const strand=[[.03,.46],[.09,.46],[.085,.25],[.035,.25],[.055,.05],[.065,.05]];// a tapered strand card from the hair atlas
  pts.forEach((p,k)=>{positions.push(p);uvs.push(strand[k]);rawWeights.push({head:1});});
  faces.push({v:[base,base+1,base+2,base+3],vt:[base,base+1,base+2,base+3],group:'fringe'},{v:[base+3,base+2,base+4,base+5],vt:[base+3,base+2,base+4,base+5],group:'fringe'});});
 // Temple locks: side-facing cards just ahead of each ear, hanging to the cheekbone and hugging the skull.
 for(const sx of [-1,1]){const base=positions.length,x=sx*.148,y0=top-.1;
  const pts=[[x,y0,.07],[x,y0,.115],[x+sx*.008,y0-.1,.075],[x+sx*.008,y0-.1,.11],[x-sx*.004,y0-.2,.085],[x-sx*.004,y0-.2,.1]];
  const strand=[[.03,.46],[.09,.46],[.035,.25],[.085,.25],[.055,.05],[.065,.05]];
  pts.forEach((p,k)=>{positions.push(p);uvs.push(strand[k]);rawWeights.push({head:1});});
  faces.push({v:[base,base+1,base+3,base+2],vt:[base,base+1,base+3,base+2],group:'fringe'},{v:[base+2,base+3,base+5,base+4],vt:[base+2,base+3,base+5,base+4],group:'fringe'});}
 parts.push({name:'fringe',positions,uvs,faces,rawWeights,material:'hair',headOnly:true,twoSided:true});
}
}// end of Tala's tailoring
// ---- Weights into the game's 17 bones ---------------------------------------------------------
const mapping={};for(const [our,src] of Object.entries(CONSOLIDATE)){if(['root','chest','head'].includes(our))for(const s of src)mapping[s]=our;else for(const s of src)for(const mhs of ['l','r'])mapping[`${s}_${mhs}`]=`${our}.${SIDE[mhs]}`;}
function consolidate(part){
 const pony=joints.ponytail[1];
 part.weights=part.positions.map((p,i)=>{
  if(part.headOnly)return {head:1};
  if(part.hair){const back=-p[2],tail=Math.max(0,Math.min(1,(pony-p[1])/.9))*(back>.1?1:0);return tail>0?{ponytail:tail,head:1-tail}:{head:1};}
  // Clothing fit weights can extrapolate outside their reference triangle; only positive influence counts.
  const acc={};for(const [b,w] of Object.entries(part.rawWeights[i])){const t=mapping[b];if(t&&w>0)acc[t]=(acc[t]||0)+w;}
  const top=Object.entries(acc).sort((a,b)=>b[1]-a[1]).slice(0,4);const total=top.reduce((s,[,w])=>s+w,0)||1;
  return top.length?Object.fromEntries(top.map(([b,w])=>[b,w/total])):{root:1};
 });
}
for(const part of parts)consolidate(part);
// ---- Images ---------------------------------------------------------------------------------------
function decode(path){return PNG.sync.read(readFileSync(path));}
function resize(img,size){if(img.width<=size)return img;const f=img.width/size,out=new PNG({width:size,height:size});for(let y=0;y<size;y++)for(let x=0;x<size;x++){const acc=[0,0,0,0];let n=0;for(let yy=Math.floor(y*f);yy<Math.floor((y+1)*f);yy++)for(let xx=Math.floor(x*f);xx<Math.floor((x+1)*f);xx++){const i=(yy*img.width+xx)*4;for(let k=0;k<4;k++)acc[k]+=img.data[i+k];n++;}const o=(y*size+x)*4;for(let k=0;k<4;k++)out.data[o+k]=acc[k]/n;}return out;}
function tint(img,rgb){for(let i=0;i<img.data.length;i+=4){const r=img.data[i],g=img.data[i+1],b=img.data[i+2];let l=(.2126*r+.7152*g+.0722*b)*1.9;
 // Neutral light pixels are the atlas background bleeding at seams (and the white piping): fold them into the fabric luminance.
 if(r>140&&Math.abs(r-g)<12&&Math.abs(g-b)<12)l=70*1.9;img.data[i]=Math.min(255,l*rgb[0]);img.data[i+1]=Math.min(255,l*rgb[1]);img.data[i+2]=Math.min(255,l*rgb[2]);}return img;}
function warm(img,rgb){for(let i=0;i<img.data.length;i+=4){img.data[i]=Math.min(255,img.data[i]*rgb[0]);img.data[i+1]=Math.min(255,img.data[i+1]*rgb[1]);img.data[i+2]=Math.min(255,img.data[i+2]*rgb[2]);}return img;}
const toJpeg=(img,q=86)=>jpeg.encode({data:img.data,width:img.width,height:img.height},q).data,toPng=img=>PNG.sync.write(img);
function bands(width,height,count){const img=new PNG({width,height});for(let y=0;y<height;y++){const t=(y/height*count)%1,edge=t<.08||t>.92,shade=edge?168:(t<.5?232:222);for(let x=0;x<width;x++){const i=(y*width+x)*4;const grain=((x*7+y*3)%11)*1.2;img.data[i]=shade-grain;img.data[i+1]=shade-6-grain;img.data[i+2]=shade-28-grain;img.data[i+3]=255;}}return img;}
const suitSrc=resize(decode(join(ASSETS,spec.outfit.asset+'_diffuse.png')),1024);
const clonePng=src=>{const out=new PNG({width:src.width,height:src.height});src.data.copy(out.data);return out;};
const images={
 skin:{mime:'image/jpeg',data:toJpeg(warm(resize(decode(join(ASSETS,spec.skin.file)),2048),spec.skin.warm))},
 eyes:{mime:'image/png',data:toPng(decode(join(ASSETS,spec.eyes)))},
 eyebrows:{mime:'image/png',data:toPng(decode(join(ASSETS,spec.eyebrows+'.png')))},
 eyelashes:{mime:'image/png',data:toPng(decode(join(ASSETS,spec.eyelashes+'.png')))},
 hair:{mime:'image/png',data:toPng(tint(resize(decode(join(ASSETS,spec.hair.asset+'_diffuse.png')),1024),spec.hair.tint))},
 shoes:{mime:'image/jpeg',data:toJpeg(resize(decode(join(ASSETS,spec.shoes.asset+'_diffuse.png')),512))}
};
const materials={
 skin:{image:'skin',roughness:.55},eyes:{image:'eyes',roughness:.25,alpha:true},eyebrows:{image:'eyebrows',roughness:.8,alpha:true,double:true},eyelashes:{image:'eyelashes',roughness:.8,alpha:true,double:true},
 hair:{image:'hair',roughness:.45,alpha:true,double:true},shoes:{image:'shoes',roughness:.6,color:spec.shoes.color}
};
if(spec.tailor==='tala'){
 Object.assign(images,{top:{mime:'image/jpeg',data:toJpeg(tint(clonePng(suitSrc),[.86,.56,.2]))},shorts:{mime:'image/jpeg',data:toJpeg(tint(clonePng(suitSrc),[.66,.2,.12]))},undertop:{mime:'image/jpeg',data:toJpeg(tint(clonePng(suitSrc),[.22,.22,.24]))},wraps:{mime:'image/png',data:toPng(bands(64,512,8))}});
 Object.assign(materials,{hairflat:{color:[.36,.11,.06],roughness:.5,double:true},top:{image:'top',roughness:.85},vest:{color:[.56,.31,.07],roughness:.8,double:true},undertop:{image:'undertop',roughness:.9},shorts:{image:'shorts',roughness:.85},wraps:{image:'wraps',roughness:.95},waistband:{color:[.3,.09,.05],roughness:.85}});
}else{
 images.outfit={mime:'image/jpeg',data:toJpeg(tint(clonePng(suitSrc),spec.outfit.tint))};
 materials.outfit={image:'outfit',roughness:.85};
}
// ---- Geometry buffers (split vertices per unique position/uv pair, smooth normals) ---------
function buildGeometry(part){
 const key=new Map(),pos=[],uv=[],jnt=[],wgt=[],idx=[],src=[];
 const vertex=(vi,ti)=>{const k=vi+'/'+ti;if(key.has(k))return key.get(k);const n=pos.length/3;key.set(k,n);const p=part.positions[vi];pos.push(p[0],p[1],p[2]);const t=ti>=0?part.uvs[ti]:[0,0];uv.push(t[0],1-t[1]);
  const w=part.weights[vi],entries=Object.entries(w).slice(0,4);for(let k=0;k<4;k++){const e=entries[k];jnt.push(e?OUR_BONES.indexOf(e[0]):0);wgt.push(e?e[1]:0);}src.push(vi);return n;};
 for(const f of part.faces){const vs=f.v.map((vi,k)=>vertex(vi,f.vt[k]));for(let k=1;k+1<vs.length;k++)idx.push(vs[0],vs[k],vs[k+1]);}
 const normals=new Float32Array(pos.length);const a=new Vector3(),b=new Vector3(),c=new Vector3(),n=new Vector3();
 for(let i=0;i<idx.length;i+=3){const [i0,i1,i2]=[idx[i],idx[i+1],idx[i+2]];a.fromArray(pos,i0*3);b.fromArray(pos,i1*3);c.fromArray(pos,i2*3);n.copy(b).sub(a).cross(c.clone().sub(a));for(const j of [i0,i1,i2]){normals[j*3]+=n.x;normals[j*3+1]+=n.y;normals[j*3+2]+=n.z;}}
 for(let i=0;i<normals.length;i+=3){const l=Math.hypot(normals[i],normals[i+1],normals[i+2])||1;normals[i]/=l;normals[i+1]/=l;normals[i+2]/=l;}
 return {positions:new Float32Array(pos),normals,uvs:new Float32Array(uv),joints:new Uint8Array(jnt),weights:new Float32Array(wgt),indices:new Uint32Array(idx)};
}
// ---- GLB writer ---------------------------------------------------------------------------------
const metrics={legLength:+(joints['thigh.L'][1]-joints['shin.L'][1]).toFixed(4),shinLength:+(joints['shin.L'][1]-joints['foot.L'][1]).toFixed(4),ankleHeight:joints['foot.L'][1],gameHeight:GAME_HEIGHT,scale};
function writeGlb(path){
 const buffers=[],bufferViews=[],accessors=[];let offset=0;
 const push=(typed,target)=>{const bytes=Buffer.from(typed.buffer,typed.byteOffset,typed.byteLength);const pad=(4-bytes.length%4)%4;buffers.push(bytes,Buffer.alloc(pad));const view={buffer:0,byteOffset:offset,byteLength:bytes.length};if(target)view.target=target;bufferViews.push(view);offset+=bytes.length+pad;return bufferViews.length-1;};
 const accessor=(typed,type,componentType,count,extra={})=>{const bv=push(typed,componentType===5125?34963:34962);accessors.push({bufferView:bv,componentType,count,type,...extra});return accessors.length-1;};
 const nodes=OUR_BONES.map(name=>{const parent=PARENT[name],t=joints[name],pt=parent?joints[parent]:[0,0,0];return {name,translation:[t[0]-pt[0],t[1]-pt[1],t[2]-pt[2]]};});
 OUR_BONES.forEach((name,i)=>{const p=PARENT[name];if(p){const pi=OUR_BONES.indexOf(p);(nodes[pi].children??=[]).push(i);}});
 const ibm=new Float32Array(OUR_BONES.length*16);OUR_BONES.forEach((name,i)=>{new Matrix4().makeTranslation(-joints[name][0],-joints[name][1],-joints[name][2]).toArray(ibm,i*16);});
 const skinIndex=0,skins=[{joints:OUR_BONES.map((_,i)=>i),inverseBindMatrices:accessor(ibm,'MAT4',5126,OUR_BONES.length),skeleton:0,name:spec.label}];
 const imageList=[],textures=[],imageIndex={};for(const [name,img] of Object.entries(images)){const bv=push(new Uint8Array(img.data));imageList.push({name,mimeType:img.mime,bufferView:bv});textures.push({source:imageList.length-1,sampler:0});imageIndex[name]=textures.length-1;}
 const materialList=[],materialIndex={};for(const [name,m] of Object.entries(materials)){const pbr={metallicFactor:0,roughnessFactor:m.roughness,baseColorFactor:[...(m.color||[1,1,1]),1]};if(m.image)pbr.baseColorTexture={index:imageIndex[m.image]};const mat={name,pbrMetallicRoughness:pbr};if(m.alpha){mat.alphaMode='MASK';mat.alphaCutoff=.4;}if(m.double)mat.doubleSided=true;if(m.image&&m.color===undefined)pbr.baseColorFactor=[1,1,1,1];materialList.push(mat);materialIndex[name]=materialList.length-1;}
 const meshes=[];
 for(const part of parts){const g=buildGeometry(part);if(!g.indices.length)continue;
  const bounds=[[Infinity,Infinity,Infinity],[-Infinity,-Infinity,-Infinity]];for(let i=0;i<g.positions.length;i+=3)for(let k=0;k<3;k++){bounds[0][k]=Math.min(bounds[0][k],g.positions[i+k]);bounds[1][k]=Math.max(bounds[1][k],g.positions[i+k]);}
  const attributes={POSITION:accessor(g.positions,'VEC3',5126,g.positions.length/3,{min:bounds[0],max:bounds[1]}),NORMAL:accessor(g.normals,'VEC3',5126,g.normals.length/3),TEXCOORD_0:accessor(g.uvs,'VEC2',5126,g.uvs.length/2),JOINTS_0:accessor(g.joints,'VEC4',5121,g.joints.length/4),WEIGHTS_0:accessor(g.weights,'VEC4',5126,g.weights.length/4)};
  meshes.push({name:spec.prefix+part.name,primitives:[{attributes,indices:accessor(g.indices,'SCALAR',5125,g.indices.length),material:materialIndex[part.material]}]});
  if(part.twoSided)materialList[materialIndex[part.material]].doubleSided=true;
  nodes.push({name:spec.prefix+part.name,mesh:meshes.length-1,skin:skinIndex});
 }
 const scene={nodes:[0,...nodes.map((_,i)=>i).filter(i=>i>=OUR_BONES.length)],extras:{fighter:FIGHTER,joints,metrics}};
 const json={asset:{version:'2.0',generator:'Rift Duel build-tala-threejs.mjs'},scene:0,scenes:[scene],nodes,meshes,skins,materials:materialList,textures,images:imageList,samplers:[{magFilter:9729,minFilter:9987,wrapS:10497,wrapT:10497}],accessors,bufferViews,buffers:[{byteLength:offset}]};
 const jsonBytes=Buffer.from(JSON.stringify(json));const jsonPad=(4-jsonBytes.length%4)%4;const bin=Buffer.concat(buffers);
 const header=Buffer.alloc(12);header.write('glTF',0);header.writeUInt32LE(2,4);header.writeUInt32LE(12+8+jsonBytes.length+jsonPad+8+bin.length,8);
 const jsonChunk=Buffer.alloc(8);jsonChunk.writeUInt32LE(jsonBytes.length+jsonPad,0);jsonChunk.write('JSON',4);
 const binChunk=Buffer.alloc(8);binChunk.writeUInt32LE(bin.length,0);binChunk.write('BIN\0',4);
 writeFileSync(path,Buffer.concat([header,jsonChunk,jsonBytes,Buffer.alloc(jsonPad,0x20),binChunk,bin]));
 return {bytes:12+8+jsonBytes.length+jsonPad+8+bin.length,meshes:meshes.length};
}
const glb=writeGlb(join(ROOT,`dist/assets/models/${FIGHTER}-v3.glb`));
writeFileSync(join(OUT,'joints.json'),JSON.stringify({joints,...metrics,game_height:GAME_HEIGHT,side_map:{l:SIDE.l}},null,1));
if(FIGHTER==='tala')writeFileSync(join(ROOT,'dist/tala-v3-joints.js'),`// Generated by scripts/build-tala-threejs.mjs. Do not edit by hand.\nexport const talaV3Joints=${JSON.stringify(joints)};\nexport const talaV3Metrics=${JSON.stringify(metrics)};\n`);
else writeFileSync(join(ROOT,`dist/${FIGHTER}-v3-joints.js`),`// Generated by scripts/build-tala-threejs.mjs --fighter ${FIGHTER}. Do not edit by hand.\nexport const joints=${JSON.stringify(joints)};\nexport const metrics=${JSON.stringify(metrics)};\n`);
const report={generator:'build-tala-threejs.mjs (Three.js + Node, no Blender)',glb,parts:parts.map(p=>({name:p.name,vertices:p.positions.length,faces:p.faces.length})),joints,metrics,macro:MACRO,targets:TARGETS.length,sources:'MakeHuman base mesh, targets, game-engine rig and weights (MPFB 2.0 alpha 3, CC0); MakeHuman system assets (CC0)'};
writeFileSync(join(OUT,'build-report.json'),JSON.stringify(report,null,1));
console.log('RIFT_BUILD',JSON.stringify({fighter:FIGHTER,bytes:glb.bytes,meshes:glb.meshes,metrics,parts:report.parts.map(p=>`${p.name}:${p.faces}`).join(' ')}));
