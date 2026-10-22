import {chromium} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const out='artifacts/browser-smoke';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:1300,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
await page.goto('http://127.0.0.1:4173/morrow-review.html');await page.waitForFunction(()=>window.morrowReview?.ready,{},{timeout:90000});
for(const [label,pose,t,angle] of [['front','idle',.4,0],['back','idle',.4,Math.PI],['guard','guard',.4,.3],['cut1','strike1',.25,.4],['cut3','strike3',.25,.4]]){
 await page.evaluate(({pose,t,angle})=>{window.morrowReview.sample(pose,t);window.morrowReview.view(angle);},{pose,t,angle});await page.screenshot({path:`${out}/morrow-${label}.png`});
}
writeFileSync(`${out}/morrow-report.json`,JSON.stringify({errors},null,2));await browser.close();if(errors.length)throw Error(errors.join('\n'));
