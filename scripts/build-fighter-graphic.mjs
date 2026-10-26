// Graphic flat-colour build for the roster bodies (everyone but Tala, whose graphic asset has its own
// sculpted builder in build-tala-graphic.mjs). Takes the textured Design 03 GLB and keeps its geometry,
// 61-bone deformation layer and metrics untouched; only the surfaces change:
//  - skin, outfit and shoes lose their textures and take one flat colour each, the median of the texture;
//  - hair, eyebrows and eyelashes keep their alpha silhouette as a small flat-colour PNG (cards without a
//    silhouette look like cardboard);
//  - the eyes keep a posterised copy of their texture so the iris survives.
// Runtime two-tone shading comes from dist/graphic-flat.js (materials named Graphic_*).
// Usage: node scripts/build-fighter-graphic.mjs --fighter <aegis|rei|morrow|sol|vesper> | --all [--tools <dir with pngjs and jpeg-js>]
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
import {createRequire} from 'node:module';
import {join} from 'node:path';
import {homedir} from 'node:os';
import {createHash} from 'node:crypto';
import * as specsModule from './fighter-specs.mjs';
const SPECS=specsModule.specs||specsModule.default||specsModule;
const args=Object.fromEntries(process.argv.slice(2).map((a,i,all)=>a.startsWith('--')?[a.slice(2),all[i+1]?.startsWith('--')||all[i+1]===undefined?true:all[i+1]]:[]).filter(Boolean));
const TOOLS=args.tools||process.env.RIFT_TOOLS||process.env.TALA_TOOLS||join(homedir(),'rift-tools');
const require=createRequire(join(TOOLS,'package.json'));const {PNG}=require('pngjs');const jpeg=require('jpeg-js');
const root=new URL('../',import.meta.url);
const ROSTER=['aegis','rei','morrow','sol','vesper'];
const ids=args.all?ROSTER:args.fighter?[args.fighter]:[];
if(!ids.length)throw new Error('pass --fighter <id> or --all');
if(ids.includes('tala'))throw new Error('Tala has her own graphic builder (scripts/build-tala-graphic.mjs)');

// Surfaces that keep their silhouette through an alpha mask, and the one that keeps a posterised texture.
const MASKED=new Set(['hair','eyebrows','eyelashes']),POSTERISED=new Set(['eyes']);

function decode(image,bytes){
 if(image.mimeType==='image/png'){const png=PNG.sync.read(bytes);return {width:png.width,height:png.height,data:png.data};}
 const img=jpeg.decode(bytes,{useTArray:true,formatAsRGBA:true});return {width:img.width,height:img.height,data:img.data};
}
// Median of the opaque pixels per channel, then a gentle saturation lift so the flat colour reads as paint
// rather than a muddy average. Returns linear-ish sRGB factors for baseColorFactor.
function flatColour(img,alphaFloor=128,percentile=.5){
 const ch=[[],[],[]],d=img.data,step=Math.max(1,Math.floor(img.width*img.height/20000));
 for(let i=0;i<d.length;i+=4*step){if(d[i+3]<alphaFloor)continue;ch[0].push(d[i]);ch[1].push(d[i+1]);ch[2].push(d[i+2]);}
 if(!ch[0].length)return [.5,.5,.5];
 const med=ch.map(c=>{c.sort((a,b)=>a-b);return c[Math.min(c.length-1,Math.floor(c.length*percentile))]/255;});
 const max=Math.max(...med),min=Math.min(...med),l=(max+min)/2;
 if(max-min<1e-3)return med.map(srgbToLinear);
 const lift=1.12;return med.map(v=>Math.max(0,Math.min(1,l+(v-l)*lift))).map(srgbToLinear);
}
const srgbToLinear=c=>c<=.04045?c/12.92:((c+.055)/1.055)**2.4;
// A flat-colour PNG that keeps the source alpha, downscaled so the GLB stays small.
function maskPng(img,rgb,scale){
 const w=Math.max(1,Math.round(img.width/scale)),h=Math.max(1,Math.round(img.height/scale)),out=new PNG({width:w,height:h});
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){let a=0;for(let dy=0;dy<scale;dy++)for(let dx=0;dx<scale;dx++){const sx=Math.min(img.width-1,x*scale+dx),sy=Math.min(img.height-1,y*scale+dy);a+=img.data[(sy*img.width+sx)*4+3];}
  const o=(y*w+x)*4;out.data[o]=rgb[0];out.data[o+1]=rgb[1];out.data[o+2]=rgb[2];out.data[o+3]=Math.round(a/(scale*scale));}
 return PNG.sync.write(out);
}
// Posterise to a few tones per channel at reduced size; the eye keeps its iris and highlight as graphic shapes.
function posterPng(img,scale,levels=4){
 const w=Math.max(1,Math.round(img.width/scale)),h=Math.max(1,Math.round(img.height/scale)),out=new PNG({width:w,height:h}),q=255/(levels-1);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){const s=((Math.min(img.height-1,y*scale))*img.width+Math.min(img.width-1,x*scale))*4,o=(y*w+x)*4;
  for(let c=0;c<3;c++)out.data[o+c]=Math.round(Math.round(img.data[s+c]/q)*q);out.data[o+3]=img.data[s+3];}
 return PNG.sync.write(out);
}
const srgbHex=lin=>'#'+lin.map(v=>Math.round((v<=.0031308?v*12.92:1.055*v**(1/2.4)-.055)*255).toString(16).padStart(2,'0')).join('');

for(const id of ids){
 const src=readFileSync(new URL(`dist/assets/models/${id}-v3.glb`,root));
 const jl=src.readUInt32LE(12),doc=JSON.parse(src.subarray(20,20+jl)),bin=src.subarray(28+jl);
 if(!doc.scenes[0].extras?.rigSpec)throw new Error(`${id}-v3.glb has no deformation layer; rebuild it first`);
 const viewBytes=v=>bin.subarray(v.byteOffset||0,(v.byteOffset||0)+v.byteLength);
 const imageOf=material=>{const t=material.pbrMetallicRoughness?.baseColorTexture;if(t===undefined)return null;const tex=doc.textures[t.index];return {index:tex.source,image:doc.images[tex.source]};};
 const palette={},newImages=[],newTextures=[],materials=[];
 for(const m of doc.materials){
  const role=m.name,ref=imageOf(m);
  const out={name:'Graphic_'+role,pbrMetallicRoughness:{baseColorFactor:[1,1,1,1],metallicFactor:0,roughnessFactor:1},doubleSided:!!m.doubleSided,extras:{graphicFlat:true,paletteRole:role}};
  if(ref){
   const img=decode(ref.image,viewBytes(doc.bufferViews[ref.image.bufferView]));
   if(MASKED.has(role)){
    // Hair strands are dark with gaps, so a texture median is near black; the concept tint from the fighter spec is the colour the hair was meant to read as.
    const tint=role==='hair'&&SPECS[id]?.hair?.tint;
    const rgb=tint?tint.map(v=>Math.round(Math.max(0,Math.min(1,v))*255)):flatColour(img).map(v=>Math.round((v<=.0031308?v*12.92:1.055*v**(1/2.4)-.055)*255));
    palette[role]='#'+rgb.map(v=>v.toString(16).padStart(2,'0')).join('');
    newImages.push({mimeType:'image/png',name:`${id}-graphic-${role}`,bytes:maskPng(img,rgb,role==='hair'?2:1)});
    out.alphaMode='MASK';out.alphaCutoff=m.alphaCutoff??.5;out.doubleSided=true;
    newTextures.push({source:newImages.length-1});out.pbrMetallicRoughness.baseColorTexture={index:newTextures.length-1};
   }else if(POSTERISED.has(role)){
    palette[role]='posterised texture';
    newImages.push({mimeType:'image/png',name:`${id}-graphic-${role}`,bytes:posterPng(img,2)});
    if(m.alphaMode){out.alphaMode=m.alphaMode;if(m.alphaCutoff!==undefined)out.alphaCutoff=m.alphaCutoff;}
    newTextures.push({source:newImages.length-1});out.pbrMetallicRoughness.baseColorTexture={index:newTextures.length-1};
   }else{
    // Shoes carry their concept colour in the spec (their textures are mostly black leather); other surfaces take the texture median.
    const shoe=role==='shoes'&&SPECS[id]?.shoes?.color;
    const lin=shoe?shoe.map(srgbToLinear):flatColour(img);out.pbrMetallicRoughness.baseColorFactor=[...lin,1];palette[role]=srgbHex(lin);
   }
  }else{out.pbrMetallicRoughness.baseColorFactor=m.pbrMetallicRoughness?.baseColorFactor||[1,1,1,1];palette[role]=srgbHex(out.pbrMetallicRoughness.baseColorFactor.slice(0,3));}
  materials.push(out);
 }
 // Repack the binary: every geometry buffer view is copied, the old image views are dropped, the new images appended.
 const imageViews=new Set((doc.images||[]).map(i=>i.bufferView));
 const chunks=[],views=[];let offset=0;const remap=new Map();
 const push=(bytes,extra={})=>{const pad=(4-bytes.length%4)%4;views.push({buffer:0,byteOffset:offset,byteLength:bytes.length,...extra});chunks.push(bytes,Buffer.alloc(pad));offset+=bytes.length+pad;return views.length-1;};
 doc.bufferViews.forEach((v,i)=>{if(imageViews.has(i))return;const extra={};if(v.byteStride)extra.byteStride=v.byteStride;if(v.target)extra.target=v.target;remap.set(i,push(viewBytes(v),extra));});
 for(const a of doc.accessors)if(a.bufferView!==undefined)a.bufferView=remap.get(a.bufferView);
 const images=newImages.map(im=>({mimeType:im.mimeType,name:im.name,bufferView:push(Buffer.from(im.bytes))}));
 const extras={...doc.scenes[0].extras,artStyle:'graphic-flat',palette};
 const out={...doc,materials,images,textures:newTextures,samplers:undefined,bufferViews:views,buffers:[{byteLength:offset}],scenes:[{...doc.scenes[0],extras}],asset:{...doc.asset,generator:'Rift Duel graphic-flat roster builder (Three.js + Node)'}};
 delete out.samplers;if(!images.length){delete out.images;delete out.textures;}
 const jb=Buffer.from(JSON.stringify(out)),jp=(4-jb.length%4)%4,binary=Buffer.concat(chunks),header=Buffer.alloc(20);
 header.write('glTF');header.writeUInt32LE(2,4);header.writeUInt32LE(28+jb.length+jp+binary.length,8);header.writeUInt32LE(jb.length+jp,12);header.write('JSON',16);
 const bh=Buffer.alloc(8);bh.writeUInt32LE(binary.length);bh.write('BIN\0',4);
 const glb=Buffer.concat([header,jb,Buffer.alloc(jp,0x20),bh,binary]);
 writeFileSync(new URL(`dist/assets/models/${id}-graphic.glb`,root),glb);
 const reportDir=new URL(`art/blender/${id}-graphic/`,root);mkdirSync(reportDir,{recursive:true});
 const report={generator:'build-fighter-graphic.mjs',style:'graphic-flat',source:`${id}-v3.glb`,sourceSHA256:createHash('sha256').update(src).digest('hex'),modelSHA256:createHash('sha256').update(glb).digest('hex'),bytes:glb.length,sourceBytes:src.length,images:images.map(i=>i.name),palette};
 writeFileSync(new URL('build-report.json',reportDir),JSON.stringify(report,null,2));
 console.log(id,`${(glb.length/1e6).toFixed(2)} MB (was ${(src.length/1e6).toFixed(2)} MB)`,JSON.stringify(palette));
}
