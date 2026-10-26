import {launch,BASE,OUT,stamp} from './common.mjs';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const browser=await launch(),context=await browser.newContext({viewport:{width:1440,height:1050}}),page=await context.newPage(),id=stamp(),errors=[],shots=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
try{
 await page.goto(`${BASE}/vfx-workbench.html`);await page.waitForFunction(()=>!!window.vfxWorkbench);
 await page.evaluate(()=>vfxWorkbench.seek(30));await page.click('#refined');
 await page.waitForFunction(async()=>{const m=await import('./flow-energy.js');const s=m.flowMaskStatus();return s.smoke&&s.trace;});
 for(const [asset,fighter,frame,camera] of [['beam','0',30,'side'],['beam','0',30,'back'],['capture','5',30,'three'],['signature','2',30,'side'],['signature','3',30,'three'],['beam','0',54,'three'],['signature','0',30,'three'],['signature','1',30,'three'],['signature','4',30,'three'],['signature','5',30,'three'],['charge','2',30,'three']]){
  await page.selectOption('#asset',asset);await page.selectOption('#fighter',fighter);await page.selectOption('#camera',camera);await page.evaluate(f=>vfxWorkbench.seek(f),frame);
  const file=`${OUT}/refined-${asset}-${fighter}-${frame}-${camera}-${id}.jpg`;await page.screenshot({path:file,type:'jpeg',quality:85,timeout:240000});shots.push(file);
 }
 await page.click('#save');
 // Real combat, same saved draft, with both cameras. No invented hit timing.
 for(const variant of ['default','draft']){
  const fight=await page.context().newPage();fight.on('pageerror',e=>errors.push(e.message));fight.on('console',m=>{if(m.type()==='error')errors.push(m.text());});await fight.setViewportSize({width:800,height:600});
  await fight.route('**/vfx-fight-review*',r=>r.fulfill({contentType:'text/html',body:'<html><body style="margin:0"><canvas></canvas></body></html>'}));
  await fight.goto(`${BASE}/vfx-fight-review${variant==='draft'?'?vfxPreview=1':''}`);
  await fight.evaluate(async()=>{
   const {createView}=await import('./render.js'),combat=await import('./combat.js');const view=createView(document.querySelector('canvas'),{talaModel:'graphic'});view.quality('low');const m=combat.createMatch(0,3,'training');view.match(m);window.effectFight={view,m,combat};
  });
  await fight.waitForFunction(()=>effectFight.view.fighterModels.every(m=>['graphic','v3'].includes(m.status)),null,{timeout:240000});
  await fight.evaluate(()=>{const {view,m,combat}=effectFight;const settings={camera:'side',cameraZoom:.65,reduced:false};for(let i=0;i<70;i++)combat.update(m,[combat.neutral(),combat.neutral()]);m.players[0].x=-4;m.players[1].x=4;const step=(input={})=>{combat.update(m,[{...combat.neutral(),...input},combat.neutral()]);view.render(1/60,m,settings);};step({x:1,attack:true});step();let safety=50;while(!m.projectiles.some(p=>p.kind==='beam')&&safety-->0)step();if(safety<=0)throw new Error('Beam did not release');for(let i=0;i<4;i++)step();window.fightDraw=camera=>view.render(0,m,{...settings,camera});});
  for(const camera of ['side','lock']){await fight.evaluate(camera=>fightDraw(camera),camera);const file=`${OUT}/refined-fight-${variant}-${camera}-${id}.jpg`;await fight.screenshot({path:file,type:'jpeg',quality:87,timeout:240000});shots.push(file);}
  await fight.close();
 }
 assert.deepEqual(errors,[]);writeFileSync(`${OUT}/refined-report-${id}.json`,JSON.stringify({shots,errors,checks:['both imported masks loaded','eleven reference-driven effect views','real combat default/draft cameras']},null,2));
}finally{await browser.close();}
