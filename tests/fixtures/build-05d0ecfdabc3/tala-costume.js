import * as T from './vendor/three.module.js';

// Original 128px costume paint. The left half wraps the front of the vest;
// the right half wraps its back. Coordinates are authored top-down so the
// collar, pockets and hem occupy the same places on every pose.
export function talaVestPaint(){
 const size=128,data=new Uint8Array(size*size*4);
 const rgb=hex=>hex.match(/[\da-f]{2}/gi).map(v=>parseInt(v,16));
 const pixel=(x,y,c)=>{if(x>=0&&y>=0&&x<size&&y<size)data.set([...c,255],(y*size+x)*4);};
 const poly=(points,hex)=>{const c=rgb(hex);for(let y=0;y<size;y++)for(let x=0;x<size;x++){
  let inside=false;for(let i=0,j=points.length-1;i<points.length;j=i++){
   const [ax,ay]=points[i],[bx,by]=points[j];if((ay>y)!==(by>y)&&x<(bx-ax)*(y-ay)/(by-ay)+ax)inside=!inside;
  }if(inside)pixel(x,y,c);
 }};
 const line=(points,hex,width=1)=>{const c=rgb(hex);for(let i=1;i<points.length;i++){
  const [x0,y0]=points[i-1],[x1,y1]=points[i],steps=Math.max(Math.abs(x1-x0),Math.abs(y1-y0));
  for(let n=0;n<=steps;n++)for(let dx=0;dx<width;dx++)for(let dy=0;dy<width;dy++)pixel(Math.round(x0+(x1-x0)*n/(steps||1))+dx,Math.round(y0+(y1-y0)*n/(steps||1))+dy,c);
 }};
 for(let y=0;y<size;y++)for(let x=0;x<size;x++)pixel(x,y,rgb('#344858'));
 // Front: a warm inner shirt, with two overlapping blue vest panels.
 poly([[17,0],[47,0],[42,128],[22,128]],'#c3a575');
 poly([[25,0],[39,0],[37,128],[27,128]],'#e1c692');
 poly([[0,0],[19,0],[27,27],[24,121],[0,125]],'#4b6677');
 poly([[45,0],[64,0],[64,125],[40,121],[37,27]],'#3e576b');
 poly([[0,48],[10,58],[16,120],[0,128]],'#253b4a');
 poly([[64,46],[54,59],[48,120],[64,128]],'#263a4c');
 // Collar/lapels use broad painted shapes with a narrow warm edge.
 poly([[15,0],[23,7],[29,25],[22,48],[18,21]],'#7493a1');
 poly([[49,0],[41,7],[35,25],[42,48],[46,21]],'#627d91');
 line([[16,2],[21,21],[26,26],[22,45]],'#c4ac7a',2);
 line([[48,2],[43,21],[38,26],[42,45]],'#bca16e',2);
 line([[23,48],[22,117]],'#adc0bd');line([[40,48],[41,117]],'#162f42',2);
 // Angled patch pockets and restrained crease highlights.
 for(const [left,right] of [[6,19],[45,58]]){
  poly([[left,60],[right,58],[right-1,91],[left+1,94]],'#30495b');
  poly([[left,59],[right,57],[right,66],[left+1,70]],'#6c8794');
  line([[left+1,71],[left+2,91],[right-2,88]],'#8299a0');
  line([[left+3,98],[right-2,104]],'#1d3548',2);
 }
 line([[0,117],[20,115],[23,121]],'#8fa7aa');line([[42,121],[45,115],[63,118]],'#7b929f');
 // Back: broad shoulder yoke and an original broken-lightning crest.
 poly([[64,0],[128,0],[128,29],[108,38],[84,38],[64,29]],'#668593');
 line([[65,29],[84,40],[108,40],[126,29]],'#233d4e',2);
 line([[74,43],[72,104],[81,118]],'#8a9fa6');line([[118,43],[120,104],[111,118]],'#203747',2);
 poly([[99,47],[86,75],[97,75],[90,101],[109,66],[99,66],[108,47]],'#d3b878');
 poly([[101,49],[92,70],[101,70],[98,83],[106,68],[97,68]],'#f0d39a');
 line([[65,119],[85,116],[107,116],[127,119]],'#91a5a8');
 poly([[0,123],[128,123],[128,128],[0,128]],'#203747');
 // DataTexture rows start at the bottom, while the paint above is top-down.
 const flipped=new Uint8Array(data.length);for(let y=0;y<size;y++)flipped.set(data.subarray(y*size*4,(y+1)*size*4),(size-1-y)*size*4);
 const texture=new T.DataTexture(flipped,size,size);texture.colorSpace=T.SRGBColorSpace;texture.magFilter=T.NearestFilter;texture.minFilter=T.LinearFilter;texture.needsUpdate=true;return texture;
}
