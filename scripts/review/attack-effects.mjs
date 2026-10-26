// Real sandbox rendering; synthetic beam fixture isolates its travel silhouette.
import {launch,BASE,OUT,stamp} from './common.mjs';
import {writeFileSync} from 'node:fs';
const browser=await launch(),page=await browser.newPage({viewport:{width:800,height:520}}),errors=[],files=[],id=stamp();
page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{window.__THREE_DEVTOOLS__=new EventTarget();window.__THREE_DEVTOOLS__.addEventListener('observe',e=>{if(e.detail.isScene)(window.reviewScenes??=[]).push(e.detail);});});
try{
 for(const [scenario,frame] of (process.env.FX_CHARGE_ONLY?[['charge',70]]:[['capture',35],['charge',70],['idle',0]])){
  await page.goto(`${BASE}/sandbox.html?scenario=${scenario}&p1=2&p2=1&zoom=.65&quality=low`,{waitUntil:'domcontentloaded',timeout:180000});
  await page.waitForFunction(()=>window.sandbox&&window.sandbox.models.every(m=>m.status&&m.status!=='loading'),null,{timeout:240000});
  await page.addStyleTag({content:'aside{display:none!important}'});
  await page.evaluate(({scenario,frame})=>{const s=window.sandbox;if(scenario==='idle'){s.state.scenario.m.projectiles=[{owner:0,kind:'beam',x:(s.state.scenario.m.players[0].x+s.state.scenario.m.players[1].x)/2,z:0,dx:1,dz:0,radius:.3,life:1}];}s.seek(frame);},{scenario,frame});
  const file=`${OUT}/attack-${scenario}-${id}.jpg`;await page.screenshot({path:file,type:'jpeg',quality:82,timeout:240000});files.push(file);
  console.log('energy',await page.evaluate(()=>{const g=window.reviewScenes?.map(s=>s.getObjectByName('charge-energy')).find(Boolean);return g?{visible:g.visible,children:g.children.map(n=>({visible:n.visible,position:n.position.toArray(),scale:n.scale.toArray()}))}:null;}));
  console.log(scenario,await page.evaluate(()=>({cinematic:window.sandbox.state.scenario.m.cinematic?.kind,animations:window.sandbox.snapshot().map(p=>p.anim)})));
 }
 writeFileSync(`${OUT}/attack-report-${id}.json`,JSON.stringify({files,errors},null,2));if(errors.length)throw new Error(errors.join('\n'));console.log(files);
}finally{await browser.close();}
