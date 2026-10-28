// Supplemental UI integration: real main/combat code; renderer stubbed to finish a round
// cheaply on the 2015 Mac. The separate skill-lab.mjs smoke uses the real WebGL renderer.
import {launch,BASE,OUT,stamp} from './common.mjs';import {writeFileSync} from 'node:fs';import assert from 'node:assert/strict';
const browser=await launch(),page=await browser.newPage({viewport:{width:1000,height:900}}),errors=[],suffix=stamp(),report={renderer:'stub; UI/combat integration only'};
page.on('pageerror',e=>errors.push(e.message));page.setDefaultTimeout(60000);
await page.route('**/render.js*',route=>route.fulfill({contentType:'text/javascript',body:`export function createView(){return new Proxy({arenaName:'UI integration fixture',talaModels:[],fighterModels:[]},{get(o,k){return k in o?o[k]:()=>{};}});}`}));
await page.addInitScript(()=>{let t=0;window.requestAnimationFrame=cb=>setTimeout(()=>cb(t+=100),4);localStorage.setItem('rift-options',JSON.stringify({volume:0,music:false,announcer:false,reduced:true,roundSeconds:60,winsNeeded:1}));});
try{
 await page.goto(`${BASE}/index.html?stats=1&balance=rules`,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.riftDebug);await page.selectOption('#mode','duel');await page.click('#start');await page.waitForSelector('#match-stats');
 const saved=await page.evaluate(()=>JSON.parse(localStorage.getItem('rift-skill-matches')));assert.equal(saved.length,1);assert.equal(saved[0].completed,true);assert.equal(saved[0].mode,'rules');assert.ok(saved[0].players[1].damage>0);assert.ok(saved[0].seconds>0);
 report.result=await page.evaluate(()=>riftDebug());report.saved=saved[0];report.capture=`completed-round-ui-${suffix}.jpg`;await page.screenshot({path:`${OUT}/${report.capture}`,type:'jpeg',quality:80});
 const d=page.waitForEvent('download');await page.click('#export-match-stats');await (await d).saveAs(`${OUT}/completed-round-export-${suffix}.json`);
 await page.goto(`${BASE}/skill-lab.html?saved`);await page.waitForSelector('#A .panel');assert.match(await page.locator('#A').innerText(),/1 completed/);assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,suffix,completed:saved[0].completed,damage:saved[0].players.map(p=>p.damage)}));
}finally{writeFileSync(`${OUT}/completed-round-ui-${suffix}.json`,JSON.stringify({...report,errors},null,2));await browser.close();}
