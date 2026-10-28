import assert from 'node:assert/strict';import {writeFileSync} from 'node:fs';import {join} from 'node:path';import {launch,BASE,OUT,stamp} from './common.mjs';
const browser=await launch(),page=await browser.newPage({viewport:{width:1500,height:1000}}),errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
try{
 await page.goto(BASE+'/skill-lab.html?study=skill-bots');await page.locator('#study-run').waitFor({timeout:60000});
 assert.match(await page.locator('#A').innerText(),/4536 bouts/);assert.match(await page.locator('#B').innerText(),/6048 bouts/);assert.equal(await page.locator('#error').innerText(),'');
 await page.screenshot({path:join(OUT,`dashboard-desktop-${stamp()}.jpg`),type:'jpeg',quality:78});
 await page.locator('#A h2').first().scrollIntoViewIfNeeded();await page.screenshot({path:join(OUT,`dashboard-comparison-${stamp()}.jpg`),type:'jpeg',quality:78});
 await page.locator('#B h3').filter({hasText:'Bot validity'}).first().scrollIntoViewIfNeeded();await page.screenshot({path:join(OUT,`dashboard-validity-${stamp()}.jpg`),type:'jpeg',quality:78});
 for(const run of ['quick-6','quick-10','quick-15']){await page.selectOption('#study-run',run);await page.waitForFunction(r=>document.querySelector('#bot-study').textContent.includes('corrected '+r),run);assert.match(await page.locator('#A').innerText(),/2268 bouts/);assert.match(await page.locator('#B').innerText(),/3024 bouts/);}
 await page.setViewportSize({width:390,height:844});await page.evaluate(()=>scrollTo(0,0));await page.screenshot({path:join(OUT,`dashboard-phone-${stamp()}.jpg`),type:'jpeg',quality:78});assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
 await page.click('#theme');assert.equal(await page.locator('body').getAttribute('class'),'light');await page.click('#full');await page.waitForFunction(()=>document.querySelector('#A').textContent.includes('4536 bouts'));assert.deepEqual(errors,[]);assert.equal(await page.locator('#error').innerText(),'');
 writeFileSync(join(OUT,'browser-smoke.json'),JSON.stringify({passed:true,checks:['old/full versus corrected/full','all three quick delay selectors','validity counters','390px no page overflow','light theme','original both-seat button'],errors},null,2));console.log('Dashboard browser smoke passed');
}finally{await browser.close();}
