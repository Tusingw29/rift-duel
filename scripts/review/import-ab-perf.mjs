// TALA-IMPORT-AB browser cost: replay each comparison scenario in the sandbox in both modes, drawing every frame, and
// report the mean and worst frame cost (ONLY=scenarios, MAXF=frames to cap a slow machine) (headless software GL, so absolute numbers are pessimistic; compare A with B).
import {launch,BASE} from './common.mjs';
const browser=await launch(),page=await browser.newPage({viewport:{width:960,height:540}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const out={};
try{
 for(const scenario of (process.env.ONLY||'ab-advance-guard,ab-circle-right-guard,ab-knockdown-getup-guard').split(',')){
  await page.goto(`${BASE}/sandbox.html?scenario=${scenario}&p1=2&p2=1&maxf=${process.env.MAXF||''}`,{waitUntil:'domcontentloaded',timeout:180000});
  await page.waitForFunction(()=>window.sandbox?.state?.scenario,null,{timeout:240000});
  out[scenario]={};
  for(const mode of ['authored','imported']){
   out[scenario][mode]=await page.evaluate(async m=>{const el=document.querySelector('#anim');el.value=m;await el.onchange();await window.sandbox.reset();
    const max=Math.min(Number(document.querySelector('#frame').max),Number(new URLSearchParams(location.search).get('maxf')||1e9)),times=[];for(let f=1;f<=max;f++){const t=performance.now();await window.sandbox.seek(f);times.push(performance.now()-t);}
    times.sort((a,b)=>a-b);return {frames:max,meanMs:+(times.reduce((a,b)=>a+b,0)/times.length).toFixed(2),p95Ms:+times[Math.floor(times.length*.95)].toFixed(2),maxMs:+times.at(-1).toFixed(2)};},mode);
  }
 }
}finally{await browser.close();}
console.log(JSON.stringify(out,null,1));if(errors.length)console.log('ERRORS',JSON.stringify(errors.slice(0,5)));else console.log('no page errors');
