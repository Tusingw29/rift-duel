import {launch,BASE,OUT,stamp} from './common.mjs';
import {writeFileSync} from 'node:fs';
import assert from 'node:assert/strict';
const browser=await launch(),page=await browser.newPage({viewport:{width:1440,height:1050}}),id=stamp(),errors=[],shots=[];page.on('pageerror',e=>errors.push(e.message));
try{
 await page.goto(`${BASE}/vfx-workbench.html`);await page.waitForFunction(()=>!!window.vfxWorkbench);
 await page.evaluate(()=>vfxWorkbench.seek(30));await page.click('#crisp');
 for(const [asset,fighter,frame,camera] of [['beam','0',30,'side'],['beam','0',30,'back'],['capture','5',30,'three'],['signature','2',30,'side'],['signature','3',30,'three'],['beam','0',54,'three']]){
  await page.selectOption('#asset',asset);await page.selectOption('#fighter',fighter);await page.selectOption('#camera',camera);await page.evaluate(f=>vfxWorkbench.seek(f),frame);
  const file=`${OUT}/workbench-${asset}-${fighter}-${frame}-${camera}-${id}.jpg`;await page.screenshot({path:file,type:'jpeg',quality:85,timeout:240000});shots.push(file);
 }
 // Direct manipulation, export/import validation, local preview and deterministic seeking.
 await page.selectOption('#asset','signature');await page.selectOption('#fighter','0');
 const before=await page.evaluate(()=>JSON.stringify(vfxWorkbench.getDraft().shapes));const handle=page.locator('#shape circle').first(),box=await handle.boundingBox();await page.mouse.move(box.x+box.width/2,box.y+box.height/2);await page.mouse.down();await page.mouse.move(box.x+box.width/2-5,box.y+box.height/2+3);await page.mouse.up();assert.notEqual(await page.evaluate(()=>JSON.stringify(vfxWorkbench.getDraft().shapes)),before);
 await page.click('#save');const stored=await page.evaluate(()=>JSON.parse(localStorage.getItem('rift-vfx-draft-v1')));assert.equal(stored.beamWidth,.7);
 const download=page.waitForEvent('download');await page.click('#export');const file=await download;assert.equal(file.suggestedFilename(),'rift-vfx-preset.json');
 await page.setInputFiles('#file',{name:'bad.json',mimeType:'application/json',buffer:Buffer.from('{"version":9}')});await page.waitForFunction(()=>document.getElementById('status').classList.contains('error'));
 await page.setInputFiles('#file',{name:'valid.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(stored))});await page.waitForFunction(()=>document.getElementById('status').textContent==='Imported draft. Save to preview in gameplay.');
 const snapshot=()=>page.evaluate(()=>{vfxWorkbench.seek(30);return vfxWorkbench.views[1].renderer.domElement.toDataURL();});const a=await snapshot();await page.evaluate(()=>vfxWorkbench.seek(60));assert.equal(await snapshot(),a);
 const preview=await page.context().newPage();await preview.goto(`${BASE}/sandbox.html?vfxPreview=1&effects=full`);await preview.waitForFunction(()=>!!window.sandbox);const applied=await preview.evaluate(async()=>{const m=await import('./vfx-settings.js');return m.vfxSettings().beamWidth;});assert.equal(applied,.7);await preview.close();
 // Real combat, same saved draft, with both cameras. No invented hit timing.
 for(const variant of ['default','draft']){
  const fight=await page.context().newPage();fight.on('pageerror',e=>errors.push(e.message));await fight.setViewportSize({width:800,height:600});
  await fight.route('**/vfx-fight-review*',r=>r.fulfill({contentType:'text/html',body:'<html><body style="margin:0"><canvas></canvas></body></html>'}));
  await fight.goto(`${BASE}/vfx-fight-review${variant==='draft'?'?vfxPreview=1':''}`);
  await fight.evaluate(async()=>{
   const {createView}=await import('./render.js'),combat=await import('./combat.js');const view=createView(document.querySelector('canvas'),{talaModel:'graphic'});view.quality('low');const m=combat.createMatch(0,3,'training');view.match(m);window.effectFight={view,m,combat};
  });
  await fight.waitForFunction(()=>effectFight.view.fighterModels.every(m=>['graphic','v3'].includes(m.status)),null,{timeout:240000});
  await fight.evaluate(()=>{const {view,m,combat}=effectFight;const settings={camera:'side',cameraZoom:.65,reduced:false};for(let i=0;i<70;i++)combat.update(m,[combat.neutral(),combat.neutral()]);m.players[0].x=-4;m.players[1].x=4;const step=(input={})=>{combat.update(m,[{...combat.neutral(),...input},combat.neutral()]);view.render(1/60,m,settings);};step({x:1,attack:true});step();let safety=50;while(!m.projectiles.some(p=>p.kind==='beam')&&safety-->0)step();if(safety<=0)throw new Error('Beam did not release');for(let i=0;i<4;i++)step();window.fightDraw=camera=>view.render(0,m,{...settings,camera});});
  for(const camera of ['side','lock']){await fight.evaluate(camera=>fightDraw(camera),camera);const file=`${OUT}/workbench-fight-${variant}-${camera}-${id}.jpg`;await fight.screenshot({path:file,type:'jpeg',quality:87,timeout:240000});shots.push(file);}
  await fight.close();
 }
 assert.deepEqual(errors,[]);writeFileSync(`${OUT}/workbench-report-${id}.json`,JSON.stringify({shots,errors,checks:['real meshes','six captured views','drag silhouette','save/export/import','invalid import rejected','deterministic reverse seek','saved preset loaded by sandbox']},null,2));
}finally{await browser.close();}
