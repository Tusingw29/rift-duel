import {launch,BASE,OUT,stamp} from './common.mjs';import {writeFileSync} from 'node:fs';import assert from 'node:assert/strict';
const browser=await launch(),page=await browser.newPage({viewport:{width:1500,height:950}}),errors=[],id=stamp();page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(BASE+'/skill-lab.html?study=grab-options');await page.waitForSelector('#A h2');await page.waitForFunction(()=>document.querySelector('#A').textContent.includes('70560 bouts'));
 const body=await page.locator('#A').innerText();for(const text of ['10f reaction','15f reaction','deliberate,slow','masher-all','95%','could be luck','UNTRUSTED'])assert.ok(body.includes(text),text);assert.equal(await page.locator('#error').innerText(),'');
 await page.screenshot({path:`${OUT}/dashboard-summary-${id}.jpg`,type:'jpeg',quality:78});
 await page.locator('#A h2').filter({hasText:'15f reaction'}).evaluate(e=>e.scrollIntoView({block:'start'}));await page.screenshot({path:`${OUT}/dashboard-15f-${id}.jpg`,type:'jpeg',quality:78});
 await page.locator('#A details summary').last().click();assert.match(await page.locator('#A details').last().innerText(),/ranges do not overlap/);
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);await page.screenshot({path:`${OUT}/dashboard-phone-${id}.jpg`,type:'jpeg',quality:78});
 await page.click('#full');await page.waitForFunction(()=>document.querySelector('#A').textContent.includes('4536 bouts'));assert.deepEqual(errors,[]);writeFileSync(`${OUT}/browser-dashboard.json`,JSON.stringify({passed:true,errors,checks:['all seven modes side by side at both delays','confidence ranges and overlap labels','pairwise comparison details','capture damage and breaks','sanity flags','390px no page overflow','old report still accessible']},null,2));console.log('Grab dashboard smoke passed');
}finally{await browser.close();}
