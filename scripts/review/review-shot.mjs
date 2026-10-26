// Front/side/back shots of one fighter on fighter-review.html at chosen poses.
// Usage: RIFT_TOOLS=<dir> FIGHTER=rei POSES="idle:.4,guard:.5,strike1:.13" node scripts/review/review-shot.mjs
import {launch,BASE,OUT,stamp,SHOT} from './common.mjs';
import {writeFileSync} from 'node:fs';
const fighter=process.env.FIGHTER||'aegis',id=stamp(),poses=(process.env.POSES||'idle:.4').split(',').map(s=>s.split(':')),angles=(process.env.ANGLES||'front:0,side:1.57,back:3.14').split(',').map(s=>s.split(':'));
const browser=await launch(),page=await browser.newPage({viewport:{width:700,height:800}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(`${BASE}/fighter-review.html?fighter=${fighter}&x=${id}`,{waitUntil:'domcontentloaded',timeout:180000});
 await page.waitForFunction(()=>window.fighterReview?.ready||/did not|Pick/.test(document.querySelector('#status').textContent),null,{timeout:240000});
 await page.evaluate(()=>window.fighterReview.zoom(6.5));
 for(const [pose,t] of poses){const info=await page.evaluate(([pose,t])=>window.fighterReview.sample(pose,Number(t)),[pose,t]);console.log('info',JSON.stringify(info));
  for(const [name,a] of angles){await page.evaluate(a=>window.fighterReview.view(Number(a)),a);const file=`${OUT}/rv-${fighter}-${pose}-${name}-${id}.png`;await page.screenshot({path:file,...SHOT});console.log('shot',file);}}
}finally{writeFileSync(`${OUT}/rv-${fighter}-${id}.json`,JSON.stringify({fighter,poses,errors},null,1));await browser.close();}
if(errors.length)console.warn('page errors',errors);
