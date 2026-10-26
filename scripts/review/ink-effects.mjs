import {launch,BASE,OUT,stamp} from './common.mjs';
import {writeFileSync} from 'node:fs';
const browser=await launch(),page=await browser.newPage({viewport:{width:800,height:520}}),id=stamp(),errors=[],shots=[];
page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>{window.__THREE_DEVTOOLS__=new EventTarget();window.__THREE_DEVTOOLS__.addEventListener('observe',e=>{if(e.detail.isScene)(window.reviewScenes??=[]).push(e.detail);});});
const cases=process.env.INK_CASES?.split(',')||['beam','charge','capture'];
try{
 for(const name of cases){
  const scenario=name==='beam'?'idle':name,p1=name==='charge'?2:0,p2=name==='charge'?0:2;
  await page.goto(`${BASE}/sandbox.html?scenario=${scenario}&p1=${p1}&p2=${p2}&zoom=.65&quality=low&effects=${name==='capture'?'reduced':'full'}`,{waitUntil:'domcontentloaded',timeout:180000});
  await page.waitForFunction(()=>window.sandbox&&window.sandbox.models.every(m=>m.status&&m.status!=='loading'),null,{timeout:240000});
  await page.addStyleTag({content:'aside{display:none!important}'});
  const frames=name==='beam'?[17,20]:name==='charge'?[35,70]:[35,60];
  if(name==='beam')await page.evaluate(()=>{const s=window.sandbox;s.state.scenario.m.players[1].x=8;s.state.scenario.recipe={p1:f=>f===0?{x:1,attack:true}:{}};});
  for(const frame of frames){
   const state=await page.evaluate(frame=>{window.sandbox.seek(frame);const s=window.sandbox.state;return {frame:s.frame,cinematic:s.scenario.m.cinematic?.kind||null,projectiles:s.scenario.m.projectiles.map(p=>({kind:p.kind,x:p.x,radius:p.radius})),animations:s.scenario.m.players.map(p=>p.anim)};},frame);
   if(name==='beam'&&!state.projectiles.some(p=>p.kind==='beam'))throw new Error('Actual beam emission missing');
   if(name==='capture'&&state.cinematic!=='capture')throw new Error('Capture not active');
   if(process.env.INK_LOCK_ONLY)continue;
   const file=`${OUT}/ink-${name}-${frame}-${id}.jpg`;await page.screenshot({path:file,type:'jpeg',quality:85,timeout:240000});shots.push({file,...state});console.log(name,frame,file);
  }
  await page.evaluate(()=>{const select=document.querySelector('#camera');select.value='lock';select.dispatchEvent(new Event('change'));});
  const lockFile=`${OUT}/ink-${name}-lock-${id}.jpg`;await page.screenshot({path:lockFile,type:'jpeg',quality:85,timeout:240000});shots.push({file:lockFile,camera:'lock',frame:frames.at(-1)});
  // Exit check: no stale restraint/charge survives an idle reset.
  await page.evaluate(()=>{window.sandbox.state.recipe='idle';window.sandbox.reset();});
  const stale=await page.evaluate(()=>window.reviewScenes?.some(s=>{const g=s.getObjectByName('attack-energy');return g?.children.some(c=>c.visible); }));
  if(stale)throw new Error('Stale attack energy after reset');
 }
 writeFileSync(`${OUT}/ink-report-${id}.json`,JSON.stringify({shots,errors},null,2));if(errors.length)throw new Error(errors.join('\n'));
}finally{await browser.close();}
