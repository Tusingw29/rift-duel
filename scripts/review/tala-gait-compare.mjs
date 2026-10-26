// Capture both sources at identical times on the actual graphic model.
import {launch,BASE,OUT,stamp,PNG,stitch,toJpeg,SHOT} from './common.mjs';
import {writeFileSync} from 'node:fs';
const id=stamp(),browser=await launch(),page=await browser.newPage({viewport:{width:1000,height:720}}),errors=[],report={id,errors,shots:[]};
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(`${BASE}/tala-blender.html?model=graphic&gait=authored&review=${id}`,{timeout:180000});
 await page.waitForFunction(()=>window.talaStudy,null,{timeout:180000});await page.locator('#play').click();await page.locator('[data-angle="1.57"]').click();
 for(const gait of (process.env.GAITS||'authored,mocap').split(',')){
  await page.locator('#gait').selectOption(gait);
  if(new URL(await page.locator('#play-model a').getAttribute('href')).searchParams.get('gait')!==gait)throw Error('Play link lost gait');
  for(const clip of (process.env.CHECK_ONLY?[]:['Advance','Retreat','Circle left','Advance to guard','Advance to combo','Circle to recoil'])){
   await page.locator('#clip').selectOption(clip);
   const times=clip.includes(' to ')?[47/60,49/60,53/60]:[.45,.7,.95],frames=[];
   for(const time of times){await page.locator('#time').evaluate((el,t)=>{el.value=t;el.dispatchEvent(new Event('input',{bubbles:true}));},time.toFixed(3));await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));frames.push(PNG.sync.read(await page.locator('canvas').screenshot(SHOT)));}
   const file=`tala-${gait}-${clip.replaceAll(' ','-')}-${id}.jpg`;writeFileSync(`${OUT}/${file}`,toJpeg(stitch(frames),82));report.shots.push({gait,clip,times,file});console.log(file);
  }
 }
 // Switching while paused must resample immediately; baked mode must disable gait.
 await page.locator('#source').selectOption('baked');if(!await page.locator('#gait').isDisabled())throw Error('Baked gait selector must be disabled');
 await page.locator('#source').selectOption('live');if(await page.locator('#gait').isDisabled())throw Error('Live gait selector must be enabled');
}catch(e){errors.push(String(e));throw e;}finally{writeFileSync(`${OUT}/report-${id}.json`,JSON.stringify(report,null,2));await browser.close();}
if(errors.length)throw Error(errors.join('\n'));
