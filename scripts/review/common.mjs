// Shared helpers for the headless review captures. Tools live outside the repo (the repo has no
// node_modules): RIFT_TOOLS points at a directory whose node_modules holds playwright, pngjs and
// jpeg-js (see skills/visual-review-capture/SKILL.md). PLAYWRIGHT_EXECUTABLE can point at an
// installed headless shell when the cached browser does not match the playwright version.
import {createRequire} from 'node:module';
import {join} from 'node:path';
import {mkdirSync} from 'node:fs';
export const TOOLS=process.env.RIFT_TOOLS||process.env.TALA_TOOLS;
if(!TOOLS)throw new Error('Set RIFT_TOOLS to a directory whose node_modules contains playwright, pngjs and jpeg-js');
export const require=createRequire(join(TOOLS,'package.json'));
export const {PNG}=require('pngjs');
export const jpeg=require('jpeg-js');
export const BASE=process.env.RIFT_BASE||'http://localhost:4173/dist';
export const OUT=process.env.SHOTS||join(process.cwd(),'artifacts','review');mkdirSync(OUT,{recursive:true});
export async function launch(){
 const {chromium}=await import(join(TOOLS,'node_modules/playwright/index.mjs'));
 const options={headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']};
 if(process.env.PLAYWRIGHT_EXECUTABLE)options.executablePath=process.env.PLAYWRIGHT_EXECUTABLE;
 return chromium.launch(options);
}
export const stamp=()=>Date.now();
// Stitch equally sized PNG frames side by side with a one pixel white seam.
export function stitch(frames){
 const w=frames[0].width,h=frames[0].height,sheet=new PNG({width:w*frames.length,height:h});
 frames.forEach((f,i)=>{for(let y=0;y<h;y++)f.data.copy(sheet.data,(y*sheet.width+i*w)*4,y*w*4,(y+1)*w*4);});
 for(let i=1;i<frames.length;i++)for(let y=0;y<h;y++){const o=(y*sheet.width+i*w)*4;sheet.data[o]=sheet.data[o+1]=sheet.data[o+2]=255;}
 return sheet;
}
export const toJpeg=(png,quality=72)=>jpeg.encode({data:png.data,width:png.width,height:png.height},quality).data;
export const SHOT={timeout:240000};
