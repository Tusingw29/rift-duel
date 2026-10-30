// A/B strip from the animation workbench: view A on top, view B below, one column per move frame.
// FIGHTER=3 STATES=burst,launch FRAMES=2,9,15 TELL=on node scripts/review/workbench-ab.mjs
// FRAMES are frames of the move itself (move.frame), not workbench timeline frames: the script seeks
// the timeline until the fighter's move reaches each one. EXTRA is appended to the URL (e.g. "source=authored").
// Opens the page once per state and seeks, so a strip costs one page load, not one per frame.
import {writeFileSync} from 'node:fs';
import {join} from 'node:path';
import {PNG,BASE,OUT,launch,stamp,stitch,toJpeg,SHOT} from './common.mjs';
const fighter=process.env.FIGHTER||'3',states=(process.env.STATES||'strike3').split(','),frames=(process.env.FRAMES||'2,9,15').split(',').map(Number);
const extra=[process.env.TELL&&`tell=${process.env.TELL}`,process.env.EXTRA].filter(Boolean).join('&'),width=Number(process.env.WIDTH||1100);
const browser=await launch(),page=await browser.newPage({viewport:{width,height:Math.round(width*.5)}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
// Clip a page screenshot to the view: element screenshots wait for a "stable" canvas, which a slow software renderer never reports.
const shot=async sel=>{const clip=await page.locator(sel).boundingBox();return PNG.sync.read(await page.screenshot({...SHOT,clip,animations:'disabled'}));};
const stack=(top,bottom)=>{const w=Math.min(top.width,bottom.width),out=new PNG({width:w,height:top.height+bottom.height+1});out.data.fill(255);
 for(const [img,y0] of [[top,0],[bottom,top.height+1]])for(let y=0;y<img.height;y++)img.data.copy(out.data,((y0+y)*w)*4,y*img.width*4,y*img.width*4+w*4);return out;};
for(const st of states){
 await page.goto(`${BASE}/anim-workbench.html?fighter=${fighter}&state=${st}&quality=low${extra?'&'+extra:''}`,{waitUntil:'domcontentloaded',timeout:SHOT.timeout});
 await page.waitForFunction(()=>window.animWorkbench?.ready,null,SHOT);await page.evaluate(()=>window.animWorkbench.ready);
 const A=[],B=[];
 for(const target of frames){
  const info=await page.evaluate(async t=>{const wb=window.animWorkbench;
   // Each seek renders both views, so jump: read how far the move is at a guess, then correct by the offset.
   const at=async f=>{await wb.seek(f);const p=wb.state.s.m.players[0];return p.move?{f,move:p.move.frame,kind:p.move.kind,startup:p.move.startup}:null;};
   let f=t,info=await at(f);
   for(let tries=0;tries<12&&(!info||info.move!==t);tries++){f=Math.max(0,info?f+(t-info.move):f+6);if(f>=wb.state.frames)return null;info=await at(f);}
   return info&&info.move===t?info:null;},target);
  if(!info){console.log(st,target,'move never reached this frame');continue;}
  A.push(await shot('#viewA'));B.push(await shot('#viewB'));
  console.log(st,`move frame ${info.move}/${info.startup}`,info.kind,`timeline ${info.f}`);
 }
 if(!A.length)continue;
 const file=join(OUT,`workbench-ab-${fighter}-${st}-${stamp()}.jpg`);
 writeFileSync(file,toJpeg(stack(stitch(A),stitch(B))));console.log('wrote',file);
}
console.log('errors',errors.slice(0,3));await browser.close();
