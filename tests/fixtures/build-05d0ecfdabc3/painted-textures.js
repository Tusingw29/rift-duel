import * as T from './vendor/three.module.js';
// Small, deterministic, original paint maps. Broad folds and seams carry detail
// at fighting distance; no photographic assets or large texture downloads.
export function clothPaint(kind){
 const w=64,h=128,data=new Uint8Array(w*h*4);
 for(let y=0;y<h;y++)for(let x=0;x<w;x++){
  const u=x/w,v=y/h;let tone=1;
  if(kind==='top'||kind==='pants'){
   // Broad painted panels: two side seams, a hem, pockets and diagonal folds.
   // No repeated ribbing: that made every surface resemble corrugated tubing.
   const front=Math.sin(u*Math.PI*2),hem=v<.055||v>.95;
   tone=.87+.10*Math.max(0,front);
   if(Math.abs(front)<.10)tone*=.65;
   if(hem)tone*=.66;
   const pocket=kind==='top'?v>.31&&v<.61:v>.57&&v<.84;
   const pocketX=Math.abs(u-.25);
   if(pocket&&pocketX<.115){tone*=.86;if(pocketX>.095||Math.abs(v-(kind==='top'?.60:.83))<.018)tone*=.66;}
   const fold=Math.abs(v-(.22+.38*Math.abs(Math.cos(u*Math.PI*2))));
   if(fold<.022)tone*=.74;else if(fold<.04)tone*=1.06;
  }else if(kind==='hair')tone=.78+.18*Math.max(0,Math.sin(u*Math.PI*2))-(Math.abs(u-.7)<.035?.2:0);
  else if(kind==='wrap')tone=y%24<2?.78:.97;
  else if(kind==='shoe')tone=y<15?.54:(Math.abs(x-32)<5&&y>40?.98:.82);
  else if(kind==='skin')tone=.96;
  else tone=.94;
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
