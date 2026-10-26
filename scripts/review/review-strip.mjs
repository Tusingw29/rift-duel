// Frame strips (consecutive sample times stitched left to right) from fighter-review.html.
// Usage: RIFT_TOOLS=<dir> FIGHTER=rei ANGLE=1.57 STRIPS="run:0,.07,.14,.21;strike1:0,.05,.08,.13,.25" node scripts/review/review-strip.mjs
import {launch,BASE,OUT,stamp,SHOT,PNG,stitch} from './common.mjs';
import {writeFileSync} from 'node:fs';
const fighter=process.env.FIGHTER||'rei',angle=Number(process.env.ANGLE||'1.57'),id=stamp();
const strips=(process.env.STRIPS||'idle:0,.2,.4').split(';').filter(Boolean).map(s=>{const [pose,times]=s.split(':');return [pose,times.split(',').map(Number)];});
const browser=await launch(),page=await browser.newPage({viewport:{width:360,height:620}});
try{
 await page.goto(`${BASE}/fighter-review.html?fighter=${fighter}&gait=${process.env.GAIT||"authored"}&x=${id}`,{waitUntil:'domcontentloaded',timeout:180000});
 await page.waitForFunction(()=>window.fighterReview?.ready,null,{timeout:240000});
 await page.addStyleTag({content:'header{display:none!important}'});
 await page.evaluate(a=>{window.fighterReview.zoom(5.2);window.fighterReview.view(a);},angle);
 for(const [pose,times] of strips){
  const frames=[];for(const t of times){await page.evaluate(([pose,t])=>window.fighterReview.sample(pose,t),[pose,t]);frames.push(PNG.sync.read(await page.screenshot(SHOT)));}
  const file=`${OUT}/strip-${fighter}-${pose}-${angle===0?'front':'side'}-${id}.png`;writeFileSync(file,PNG.sync.write(stitch(frames)));console.log('strip',file);
 }
}finally{await browser.close();}
