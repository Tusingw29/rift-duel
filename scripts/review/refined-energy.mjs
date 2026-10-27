import {launch,BASE,OUT,stamp} from './common.mjs';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const browser=await launch(),context=await browser.newContext({viewport:{width:1440,height:1050}}),page=await context.newPage(),id=stamp(),errors=[],shots=[];page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
try{
 await page.goto(`${BASE}/vfx-workbench.html`);await page.waitForFunction(()=>!!window.vfxWorkbench);
 await page.evaluate(()=>vfxWorkbench.seek(30));await page.click('#refined');
 await page.waitForFunction(async()=>{const m=await import('./flow-energy.js');const s=m.flowMaskStatus();return s.smoke&&s.trace;});
 for(const [asset,fighter,frame,camera] of [['beam','0',24,'side'],['beam','0',30,'side'],['beam','0',36,'side'],['beam','0',30,'back'],['capture','5',30,'three'],['signature','2',30,'side'],['signature','3',30,'three'],['beam','0',54,'three'],['signature','0',30,'three'],['signature','1',30,'three'],['signature','4',30,'three'],['signature','5',30,'three'],['charge','2',30,'three']]){
  await page.selectOption('#asset',asset);await page.selectOption('#fighter',fighter);await page.selectOption('#camera',camera);await page.evaluate(f=>vfxWorkbench.seek(f),frame);
  const file=`${OUT}/refined-${asset}-${fighter}-${frame}-${camera}-${id}.jpg`;await page.screenshot({path:file,type:'jpeg',quality:85,timeout:240000});shots.push(file);
 }
 await page.selectOption('#asset','beam');await page.evaluate(()=>vfxWorkbench.seek(24));const firstFlow=await page.evaluate(()=>vfxWorkbench.views[1].renderer.domElement.toDataURL());await page.evaluate(()=>vfxWorkbench.seek(36));assert.notEqual(await page.evaluate(()=>vfxWorkbench.views[1].renderer.domElement.toDataURL()),firstFlow,'Flow must visibly change between simulation times');
 await page.click('#save');
 // Real combat, same saved draft, with both cameras. No invented hit timing.
 for(const variant of ['default','draft']){
  const fight=await page.context().newPage();fight.on('pageerror',e=>errors.push(e.message));fight.on('console',m=>{if(m.type()==='error')errors.push(m.text());});await fight.setViewportSize({width:800,height:600});
  await fight.route('**/vfx-fight-review*',r=>r.fulfill({contentType:'text/html',body:'<html><body style="margin:0"><canvas></canvas></body></html>'}));
  await fight.goto(`${BASE}/vfx-fight-review${variant==='draft'?'?energy=flow':''}`);
  await fight.evaluate(async()=>{
   window.flowMaskStatus=(await import('./flow-energy.js')).flowMaskStatus;const {createView}=await import('./render.js'),combat=await import('./combat.js');const view=createView(document.querySelector('canvas'),{talaModel:'graphic'});view.quality('low');const m=combat.createMatch(0,3,'training');view.match(m);window.effectFight={view,m,combat};
  });
  await fight.waitForFunction(()=>effectFight.view.fighterModels.every(m=>['graphic','v3'].includes(m.status)),null,{timeout:240000});
  await fight.evaluate(()=>{const {view,m,combat}=effectFight;const settings={camera:'side',cameraZoom:.65,reduced:false};for(let i=0;i<70;i++)combat.update(m,[combat.neutral(),combat.neutral()]);m.players[0].x=-4;m.players[1].x=4;const step=(input={})=>{combat.update(m,[{...combat.neutral(),...input},combat.neutral()]);view.render(1/60,m,settings);};step({x:1,attack:true});step();let safety=50;while(!m.projectiles.some(p=>p.kind==='beam')&&safety-->0)step();if(safety<=0)throw new Error('Beam did not release');for(let i=0;i<4;i++)step();window.fightDraw=camera=>view.render(0,m,{...settings,camera});});
  if(variant==='draft')await fight.waitForFunction(()=>{const s=flowMaskStatus();return s.smoke&&s.trace;});
  for(const camera of ['side','lock']){await fight.evaluate(camera=>fightDraw(camera),camera);const file=`${OUT}/refined-fight-${variant}-${camera}-${id}.jpg`;await fight.screenshot({path:file,type:'jpeg',quality:87,timeout:240000});shots.push(file);}
  if(variant==='draft'){
   await fight.evaluate(()=>{const r=effectFight;r.m=r.combat.createMatch(2,3,'training');r.view.match(r.m);});
   await fight.waitForFunction(()=>effectFight.view.fighterModels.every(m=>['graphic','v3'].includes(m.status)),null,{timeout:240000});
   await fight.evaluate(()=>{const r=effectFight;for(let i=0;i<55;i++){r.combat.update(r.m,[{...r.combat.neutral(),attack:true},r.combat.neutral()]);r.view.render(1/60,r.m,{camera:'side',cameraZoom:.65,reduced:false});}});
   const file=`${OUT}/refined-fight-tala-charge-${id}.jpg`;await fight.screenshot({path:file,type:'jpeg',quality:87,timeout:240000});shots.push(file);
   for(const fighter of [1,3,4,5]){
    await fight.evaluate(fighter=>{const r=effectFight;r.m=r.combat.createMatch(fighter,0,'training');r.view.match(r.m);},fighter);
    await fight.waitForFunction(()=>effectFight.view.fighterModels.every(m=>['graphic','v3'].includes(m.status)),null,{timeout:240000});
    await fight.evaluate(()=>{const {m,combat,view}=effectFight;const step=(attack=false)=>{combat.update(m,[{...combat.neutral(),attack},combat.neutral()]);view.render(1/60,m,{camera:'side',cameraZoom:.65,reduced:false});};for(let i=0;i<70;i++)step();m.players[0].x=-4;m.players[1].x=4;step(true);step();let safety=80;while(!m.projectiles.length&&safety-->0)step();if(!m.projectiles.length)throw new Error('Roster projectile did not release');for(let i=0;i<4;i++)step();});
    for(const camera of ['side','lock']){
     await fight.evaluate(camera=>{const {view,m}=effectFight;view.render(0,m,{camera,cameraZoom:.65,reduced:false});},camera);
     const file=`${OUT}/refined-fight-signature-${fighter}-${camera}-f4-${id}.jpg`;await fight.screenshot({path:file,type:'jpeg',quality:87,timeout:240000});shots.push(file);
    }
    await fight.evaluate(()=>{const {view,m,combat}=effectFight;for(let i=0;i<12;i++){combat.update(m,[combat.neutral(),combat.neutral()]);view.render(1/60,m,{camera:'lock',cameraZoom:.65,reduced:false});}if(!m.projectiles.length)throw new Error('Projectile missing from rear-camera travel sample');view.render(0,m,{camera:'lock',cameraZoom:.65,reduced:false});});
    const file=`${OUT}/refined-fight-signature-${fighter}-lock-f16-${id}.jpg`;await fight.screenshot({path:file,type:'jpeg',quality:87,timeout:240000});shots.push(file);
   }

  }
  await fight.close();
 }
 assert.deepEqual(errors,[]);writeFileSync(`${OUT}/refined-report-${id}.json`,JSON.stringify({shots,errors,checks:['both imported masks loaded','reference-driven effect views','real combat default/draft cameras','roster side and rear cameras at release +4f; rear at +16f']},null,2));
}finally{await browser.close();}
