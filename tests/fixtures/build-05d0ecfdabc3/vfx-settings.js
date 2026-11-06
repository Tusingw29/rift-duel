// Visual-only parameters shared by production meshes and the authoring workbench.
export const STORAGE_KEY='rift-vfx-draft-v1';
export const DEFAULT_VFX=Object.freeze({version:1,flowEnergy:0,cadence:12,beamWidth:1,inkWidth:1.13,coreWidth:1,ribWidth:1,signatureDepth:.09,signatureCore:.45,signatureInk:1.15,shapes:{},palettes:{}});
const limits={flowEnergy:[0,1],cadence:[6,30],beamWidth:[.3,1.8],inkWidth:[1.02,1.3],coreWidth:[.3,1.5],ribWidth:[0,1.5],signatureDepth:[.04,.4],signatureCore:[.15,.8],signatureInk:[1.02,1.3]};
export const VFX_LIMITS=Object.freeze(limits);
const clone=x=>JSON.parse(JSON.stringify(x));
function validPolygon(points){
 if(!Array.isArray(points)||points.length<3||points.length>24)return false;
 if(!points.every(p=>Array.isArray(p)&&p.length===2&&p.every(v=>Number.isFinite(v)&&Math.abs(v)<=1.5)))return false;
 const cross=(a,b,c)=>(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
 let area=0;
 for(let i=0;i<points.length;i++){
  const a=points[i],b=points[(i+1)%points.length];area+=a[0]*b[1]-b[0]*a[1];
  if(Math.hypot(a[0]-b[0],a[1]-b[1])<.005)return false;
  for(let j=i+2;j<points.length;j++){
   if(i===0&&j===points.length-1)continue;
   const c=points[j],d=points[(j+1)%points.length];
   if(cross(a,b,c)*cross(a,b,d)<=0&&cross(c,d,a)*cross(c,d,b)<=0 && Math.max(Math.min(a[0],b[0]),Math.min(c[0],d[0]))<=Math.min(Math.max(a[0],b[0]),Math.max(c[0],d[0])) && Math.max(Math.min(a[1],b[1]),Math.min(c[1],d[1]))<=Math.min(Math.max(a[1],b[1]),Math.max(c[1],d[1])))return false;
  }
 }
 return Math.abs(area)>.015;
}
export function validateVfx(input){
 if(!input||input.version!==1)throw new Error('Expected a version 1 VFX preset.');
 const out=clone(DEFAULT_VFX);
 for(const [key,[min,max]] of Object.entries(limits))if(key in input){if(key==='flowEnergy'&&![0,1].includes(input[key]))throw new Error('flowEnergy must be 0 or 1.');if(!Number.isFinite(input[key])||input[key]<min||input[key]>max)throw new Error(`Invalid ${key}: use ${min}–${max}.`);out[key]=input[key];}
 for(const [key,points] of Object.entries(input.shapes||{})){if(!/^[0-5]$/.test(key)||!validPolygon(points))throw new Error('Silhouette must be a simple, non-crossing polygon inside the grid.');out.shapes[key]=clone(points);}
 for(const [key,palette] of Object.entries(input.palettes||{})){if(!/^[0-5]$/.test(key))throw new Error('Unknown fighter palette.');out.palettes[key]={};for(const role of ['color','ink','core'])if(role in palette){if(!/^#[0-9a-f]{6}$/i.test(palette[role]))throw new Error('Use six-digit hex colors.');out.palettes[key][role]=palette[role];}}
 return out;
}
let current=clone(DEFAULT_VFX);
export const vfxSettings=()=>current;
export const setVfxSettings=input=>(current=validateVfx(input));
export const resetVfxSettings=()=>setVfxSettings(DEFAULT_VFX);
export const CRISP_VFX=Object.freeze({...DEFAULT_VFX,cadence:20,beamWidth:.7,coreWidth:.72,ribWidth:.55,signatureCore:.3,signatureInk:1.09});
// Only explicit previews read a saved draft. Normal gameplay is unaffected.
if(typeof window!=='undefined'&&new URLSearchParams(window.location.search).get('vfxPreview')==='1'){
 try{const saved=localStorage.getItem(STORAGE_KEY);if(saved)setVfxSettings(JSON.parse(saved));}catch(error){console.warn('VFX preview ignored:',error.message);}
}

export const REFINED_VFX=Object.freeze({...DEFAULT_VFX,flowEnergy:1,beamWidth:1,cadence:20});

if(typeof window!=='undefined'&&new URLSearchParams(window.location.search).get('energy')==='flow')setVfxSettings(REFINED_VFX);
