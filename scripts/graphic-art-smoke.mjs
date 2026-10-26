const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
import {mkdirSync,writeFileSync} from 'node:fs';
const out=process.env.GRAPHIC_REVIEW_OUT||'art/tala-graphic/review';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,...(process.env.PLAYWRIGHT_EXECUTABLE?{executablePath:process.env.PLAYWRIGHT_EXECUTABLE}:{}),args:['--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1400,height:1000}});const errors=[];page.on('pageerror',e=>errors.push(String(e)));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
await page.goto(new URL('tala-blender.html?model=graphic',process.env.SMOKE_URL||'http://127.0.0.1:4173/').href);await page.waitForFunction(()=>window.talaStudy,{timeout:60000});await page.locator('#play').click();await page.locator('#clip').selectOption('Idle');
for(const [name,selector] of [['front','[data-angle="0"]'],['side','[data-angle="1.57"]'],['back','[data-angle="3.14"]'],['face','#face']]){await page.locator(selector).click();await page.waitForTimeout(500);await page.screenshot({path:out+'/'+name+'.png'});}
await page.locator('[data-angle="0"]').click();
for(const [name,time] of [['Guard + block',.6],['Combo',.4],['Advance',.8],['Retreat',.8],['Recoil',.45]]){await page.locator('#clip').selectOption(name);await page.locator('#time').fill(String(time));await page.locator('#time').dispatchEvent('input');await page.waitForTimeout(300);await page.screenshot({path:out+'/'+name.replaceAll(' ','-')+'.png'});}
await page.locator('#skeleton').check();await page.screenshot({path:out+'/skeleton.png'});await page.locator('#source').selectOption('baked');await page.locator('#clip').selectOption('Guard + block');await page.locator('#time').fill('0.6');await page.locator('#time').dispatchEvent('input');await page.screenshot({path:out+'/exported-guard.png'});
writeFileSync(out+'/browser.json',JSON.stringify({errors,model:await page.evaluate(()=>window.talaStudy())},null,2));console.log(JSON.stringify({errors}));await browser.close();if(errors.length)process.exitCode=1;
