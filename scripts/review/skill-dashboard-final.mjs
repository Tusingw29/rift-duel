import {launch,BASE,OUT,stamp} from './common.mjs';import {writeFileSync} from 'node:fs';import assert from 'node:assert/strict';
const browser=await launch(),page=await browser.newPage({viewport:{width:1440,height:1000}}),errors=[],suffix=stamp(),report={};page.setDefaultTimeout(60000);page.on('pageerror',e=>errors.push(e.message));
const shot=async name=>{const file=`${name}-${suffix}.jpg`;await page.screenshot({path:`${OUT}/${file}`,type:'jpeg',quality:78});return file;};
try{
 await page.goto(`${BASE}/skill-lab.html?report=full`);await page.waitForSelector('#A .panel');assert.match(await page.locator('#A').innerText(),/4536 bouts/);report.summary=await shot('final-both-seat-summary');
 await page.setInputFiles('#fileB','art/skill-lab/2026-10-28/report.json');await page.waitForSelector('#B .panel');assert.match(await page.locator('#B').innerText(),/2268 bouts/);report.comparison=await shot('final-both-seat-vs-quick');
 await page.locator('#A h3').filter({hasText:'Guard and whiff outcomes'}).first().scrollIntoViewIfNeeded();report.metrics=await shot('final-metrics');
 await page.locator('#A h3').filter({hasText:'Distance time and option variety'}).first().scrollIntoViewIfNeeded();report.distance=await shot('final-distance');
 await page.click('#theme');await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));report.phone=await shot('final-phone-light');assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,suffix}));
}finally{writeFileSync(`${OUT}/final-dashboard-${suffix}.json`,JSON.stringify({...report,errors},null,2));await browser.close();}
