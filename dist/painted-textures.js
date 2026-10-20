import * as T from './vendor/three.module.js';
// Small, deterministic, original paint maps. Broad folds and seams carry detail
// at fighting distance; no photographic assets or large texture downloads.
export function clothPaint(kind){
 const w=64,h=128,data=new Uint8Array(w*h*4);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const u=x/w,v=y/h;let tone=1;
  if(kind==='top'||kind==='pants'){
   const fold=Math.sin(u*Math.PI*12+Math.sin(v*9)*.7);
   tone=.88+Math.max(0,fold)*.09-Math.max(0,-fold)**8*.2;
   const seam=Math.min(x%16,16-x%16);if(seam<1)tone*=.64;else if(seam<2)tone*=1.1;
   if(kind==='top'&&(y<7||y>120))tone*=.65;
   if(kind==='pants'&&y%29<2)tone*=.78;
  }else if(kind==='hair')tone=.65+.30*Math.max(0,Math.sin(u*31+v*2))**3;
  else if(kind==='wrap')tone=(y+Math.floor(x/4))%13<2?.62:.94;
  else if(kind==='shoe')tone=y<15?.54:(Math.abs(x-32)<2&&y>40?1:.82);
  else if(kind==='skin')tone=.91+.08*Math.sin(u*Math.PI*2);
  else tone=.88+(x%16<2?.12:0);
  const c=Math.round(Math.min(1,tone)*255),i=(y*w+x)*4;data.set([c,c,c,255],i);
 }
 const texture=new T.DataTexture(data,w,h);texture.colorSpace=T.SRGBColorSpace;texture.magFilter=T.NearestFilter;texture.minFilter=T.LinearFilter;texture.needsUpdate=true;return texture;
}
export function stonePaint(){
 const size=128,data=new Uint8Array(size*size*4);
 for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  const row=Math.floor(y/32),xx=(x+(row%2)*16)%32,seam=xx<2||y%32<2;
  const grain=((x*17+y*43+(x*y)%71)%23)/23;
  const t=seam?.48:.79+grain*.18,i=(y*size+x)*4;data.set([Math.round(188*t),Math.round(191*t),Math.round(169*t),255],i);
 }
 const texture=new T.DataTexture(data,size,size);texture.colorSpace=T.SRGBColorSpace;texture.wrapS=texture.wrapT=T.RepeatWrapping;texture.repeat.set(6,6);texture.magFilter=T.NearestFilter;texture.needsUpdate=true;return texture;
}
