import {launch,BASE,OUT,stamp} from './common.mjs';import {writeFileSync} from 'node:fs';import assert from 'node:assert/strict';
const browser=await launch(),errors=[],report={};const page=await browser.newPage({viewport:{width:1000,height:720}});page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(120000);const id=stamp();
try{
 // Exercise real input/commands and URL configuration with rendering stubbed for deterministic frame stepping.
 await page.route('**/render.js*',route=>route.fulfill({contentType:'text/javascript',body:`export function createView(){return new Proxy({arenaName:'UI fixture',talaModels:[],fighterModels:[]},{get(o,k){return k in o?o[k]:()=>{};}});}`}));
 await page.addInitScript(()=>{localStorage.setItem('rift-options',JSON.stringify({volume:0,music:false,announcer:false,quality:'low',reduced:true}));let pending;window.requestAnimationFrame=cb=>{pending=cb;return 1;};let t=0;window.stepFrames=n=>{for(let i=0;i<n;i++){const fn=pending;pending=null;fn?.(t+=1000/60);}};});
 for(const query of ['?balance=proposed&grab=deliberate,slow','?balance=proposed&grab=tell','']){
  await page.goto(BASE+'/index.html'+query);await page.waitForFunction(()=>window.riftDebug,null,{polling:100});await page.click('#help');const manual=await page.locator('#modal').innerText();if(query.includes('proposed'))assert.match(manual,/fresh dedicated capture press/);if(query.includes('deliberate')){assert.match(manual,/U only/);assert.doesNotMatch(manual,/D \+ tap J/);}else assert.match(manual,/U or D \+ tap J/);await page.evaluate(()=>document.querySelector('#modal').close());
  await page.selectOption('#mode','training');await page.click('#start');await page.evaluate(()=>stepFrames(300));await page.keyboard.down('KeyU');await page.evaluate(()=>stepFrames(1));await page.keyboard.up('KeyU');const d=await page.evaluate(()=>riftDebug());assert.equal(d.players[0].move,'capture');assert.equal(d.players[0].startup,query.includes('slow')?18:13);report[query||'default']=d.grab;
 }
 await page.close();
 // Separate real WebGL fixture, using real character assets and renderer at exact startup frames.
 const visual=await browser.newPage({viewport:{width:800,height:600}});visual.on('pageerror',e=>errors.push(e.message));visual.setDefaultTimeout(180000);
 await visual.goto(BASE.replace(/\/dist$/,'')+'/tests/grab-tell-review.html');await visual.waitForFunction(()=>window.reviewGrab);await visual.waitForFunction(()=>grabReviewView.fighterModels.every(r=>r.status!=='loading'&&r.status!=='pending'));
 report.captures=[];for(const camera of ['side','lock'])for(const tell of [false,true]){const state=await visual.evaluate(x=>reviewGrab(x),{camera,tell,frame:0,reduced:true});assert.equal(state.cue,tell);const file=`tell-${camera}-${tell?'on':'off'}-${id}.jpg`;await visual.screenshot({path:OUT+'/'+file,type:'jpeg',quality:82,timeout:240000});report.captures.push(file);}
 const ended=await visual.evaluate(()=>reviewGrab({frame:13}));assert.equal(ended.cue,false);report.visual='real renderer, exact frame-zero reduced-motion captures';assert.deepEqual(errors,[]);report.passed=true;console.log('Grab URLs, manual, dedicated input and real tell renderer passed');
}finally{writeFileSync(OUT+'/browser-game.json',JSON.stringify({...report,errors},null,2));await browser.close();}
