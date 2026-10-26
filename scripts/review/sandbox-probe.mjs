// Quick health check of the sandbox page: does it initialise, do both models attach, any script errors?
// Usage: RIFT_TOOLS=<dir> SCENARIO=strike3 node scripts/review/sandbox-probe.mjs
import {launch,BASE,stamp} from './common.mjs';
const browser=await launch(),page=await browser.newPage({viewport:{width:900,height:600}});const errors=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
try{
 await page.goto(`${BASE}/sandbox.html?scenario=${process.env.SCENARIO||'strike3'}&quality=low&x=${stamp()}`,{waitUntil:'domcontentloaded',timeout:120000});
 for(let i=0;i<18;i++){await new Promise(r=>setTimeout(r,10000));const s=await page.evaluate(()=>({has:!!window.sandbox,models:window.sandbox?.models,frame:window.sandbox?.state?.frame}));console.log(i*10+'s',JSON.stringify(s),'errors',JSON.stringify(errors.slice(0,2)));if(errors.length||(s.models&&s.models.every(m=>m.status&&m.status!=='loading')))break;}
}finally{await browser.close();}
process.exit(errors.length?1:0);
