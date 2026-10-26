// Frame strip of a deterministic sandbox scenario (both fighters, real simulation), side camera.
// Usage: RIFT_TOOLS=<dir> SCENARIO=stagger-recover FRAMES=1,6,11,16,21 P1=2 P2=1 ZOOM=.55 node scripts/review/sandbox-strip.mjs
import {launch,BASE,OUT,stamp,SHOT,PNG,stitch} from './common.mjs';
import {writeFileSync} from 'node:fs';
const scenario=process.env.SCENARIO||'strike3',frames=(process.env.FRAMES||'0,8,16,24,32,40').split(',').map(Number),p1=process.env.P1||'2',p2=process.env.P2||'1',zoom=process.env.ZOOM||'.7',id=stamp();
const clip={x:120,y:100,width:720,height:500};
const browser=await launch(),page=await browser.newPage({viewport:{width:1100,height:700}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(`${BASE}/sandbox.html?scenario=${scenario}&p1=${p1}&p2=${p2}&zoom=${zoom}&quality=low&x=${id}`,{waitUntil:'domcontentloaded',timeout:180000});
 await page.waitForFunction(()=>window.sandbox&&window.sandbox.models.every(m=>m.status&&m.status!=='loading'),null,{timeout:240000});
 await page.addStyleTag({content:'aside{display:none!important}'});
 const shots=[];for(const f of frames){await page.evaluate(f=>window.sandbox.seek(f),f);shots.push(PNG.sync.read(await page.screenshot({clip,...SHOT})));}
 const file=`${OUT}/sb-${scenario}-${p1}v${p2}-${id}.png`;writeFileSync(file,PNG.sync.write(stitch(shots)));console.log('strip',file,'errors',errors.slice(0,2));
}finally{await browser.close();}
