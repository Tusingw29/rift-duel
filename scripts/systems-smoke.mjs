import {chromium} from 'playwright';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
const out='artifacts/systems';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:960,height:640}}),errors=[];
page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{
 localStorage.setItem('rift-options',JSON.stringify({quality:'low',reduced:true,music:false,announcer:false,camera:'duel'}));
 const keys=[['KeyA','KeyD','KeyW','KeyS','KeyF','KeyK','KeyU','KeyI','KeyO','KeyL'],['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Numpad1','Numpad2','Numpad3','Numpad4','Numpad5','Numpad6']].map(p=>p.map(k=>[k]));localStorage.setItem('rift-keyboard',JSON.stringify(keys));
 Object.defineProperty(navigator,'getGamepads',{value:()=>window.testPads||[]});
});
await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>window.riftDebug,null,{timeout:60000});
await page.selectOption('#mode','training');await page.click('#start');
await page.waitForFunction(()=>window.riftDebug().flow==='fight');
async function begin(id){
 await page.click('#pause');await page.click('#practice-options');await page.selectOption('#lesson-choice',id);
 await page.click('#start-lesson');await page.waitForFunction(id=>window.riftDebug().lesson?.id===id&&window.riftDebug().lesson.ready===0,id,{timeout:60000});
}
async function hold(code,condition){await page.keyboard.down(code);await page.waitForFunction(condition,null,{timeout:90000});await page.keyboard.up(code);}
await begin('movement');await page.screenshot({path:`${out}/lesson-movement.png`});
await hold('KeyW',()=>window.riftDebug().lesson.stage===1);await hold('KeyD',()=>window.riftDebug().lesson.stage===2);await hold('KeyS',()=>window.riftDebug().lesson.status==='passed');
await page.click('#lesson-next');await page.waitForFunction(()=>window.riftDebug().lesson.id==='chain');
await begin('charge');if(!(await page.locator('#lesson-text').textContent()).includes('Hold F'))throw Error('Remapped prompt missing');
await hold('KeyF',()=>window.riftDebug().lesson.status==='passed');await page.screenshot({path:`${out}/lesson-complete.png`});
await page.evaluate(()=>{window.testPads=[{axes:[0,0],buttons:Array.from({length:16},()=>({pressed:false}))}];});
await page.waitForFunction(()=>document.body.classList.contains('controller-nav'));
await page.click('#lesson-retry');await page.waitForFunction(()=>document.querySelector('#lesson-text').textContent.includes('A / Cross'));
await page.evaluate(()=>window.testPads=[]);await begin('pressure');await page.keyboard.press('KeyO');
await page.waitForFunction(()=>!!window.riftDebug().pressure,null,{timeout:60000});await page.screenshot({path:`${out}/pressure-dash.png`});
await page.click('#pause');const before=await page.evaluate(()=>window.riftDebug().pressure.elapsed);await page.waitForTimeout(300);const after=await page.evaluate(()=>window.riftDebug().pressure.elapsed);if(before!==after)throw Error('Contest advanced while paused');
await page.click('#resume');await page.waitForFunction(()=>window.riftDebug().lesson.status==='retry',null,{timeout:90000});
await page.click('#lesson-exit');await page.waitForFunction(()=>!window.riftDebug().lesson);
// Render the same neutral, close, circling, airborne and recovery setups with each camera.
await page.route('**/camera-review',r=>r.fulfill({contentType:'text/html',body:'<html><body style="margin:0"><canvas id="scene"></canvas></body></html>'}));
await page.goto('http://127.0.0.1:4173/camera-review');
await page.evaluate(async()=>{const {createView}=await import('/render.js'),{createMatch}=await import('/combat.js');window.review={view:createView(document.querySelector('canvas'),{talaModel:'v3'}),m:createMatch(2,1)};review.view.quality('low');review.view.match(review.m,2);});
await page.waitForFunction(()=>window.review.view.fighterModels.every(p=>p.status==='v3'),null,{timeout:90000});
for(const setup of ['neutral','close','circle','air','recovery'])for(const camera of ['lock','side','duel']){
 await page.evaluate(({setup,camera})=>{const {m,view}=review,[a,b]=m.players;Object.assign(a,{x:-4,z:0,air:0,airMotion:null,anim:'idle',animTime:0});Object.assign(b,{x:4,z:0,air:0,airMotion:null,anim:'idle',animTime:0});
 if(setup==='close')b.x=-2.3;if(setup==='circle'){a.x=0;a.z=-2;b.x=0;b.z=2;}if(setup==='air'){a.x=-2;b.x=1;b.air=.6;b.airMotion={height:3};b.anim='launch';b.animTime=.4;}if(setup==='recovery'){b.x=0;b.anim='knockdown';b.animTime=.4;}
 for(let j=0;j<25;j++)view.render(1/30,m,{camera,reduced:true});
 },{setup,camera});await page.screenshot({path:`${out}/${setup}-${camera}.png`});
}
await page.setViewportSize({width:390,height:844});await page.evaluate(()=>{for(let j=0;j<25;j++)review.view.render(1/30,review.m,{camera:'duel',reduced:true});});await page.screenshot({path:`${out}/duel-portrait.png`});
writeFileSync(`${out}/report.json`,JSON.stringify({errors,checks:['real movement lesson','remapped charge success','retry','controller prompt','pressure trigger and pause','failure feedback','exit to free practice','15 camera comparisons','portrait fit']},null,2));await browser.close();if(errors.length)throw Error(errors.join('\n'));
