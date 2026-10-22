import {chromium} from 'playwright';import {mkdirSync,writeFileSync} from 'node:fs';
const out='artifacts/morrow-attacks';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1000,height:760}}),errors=[],samples=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:4173/morrow-attacks.html');await page.waitForFunction(()=>window.morrowReview?.ready,null,{timeout:90000});
for(let chain=1;chain<=3;chain++)for(const frame of [6,12,18,29]){
 const state=await page.evaluate(({chain,frame})=>{const state=window.morrowReview.sample('strike'+chain,frame/60);window.morrowReview.view(.55);return state;},{chain,frame});
 samples.push({chain,frame,...state});await page.screenshot({path:`${out}/cut-${chain}-frame-${frame}.png`});
 if(frame<29&&state.grip?.error>.001)throw Error('Grip detached: '+JSON.stringify(state));
}
await page.evaluate(()=>{window.morrowReview.sample('strike3',.2);window.morrowReview.view(Math.PI+.4);});await page.screenshot({path:`${out}/rear-contact.png`});
writeFileSync(`${out}/report.json`,JSON.stringify({errors,samples},null,2));await browser.close();if(errors.length)throw Error(errors.join('\n'));
