import {launch,BASE,OUT,stamp} from './common.mjs';import {writeFileSync} from 'node:fs';import assert from 'node:assert/strict';
const browser=await launch(),context=await browser.newContext({viewport:{width:1200,height:900}}),page=await context.newPage(),id=stamp(),errors=[],shots=[],requests=[];
function watch(p){p.on('pageerror',e=>errors.push(e.message));p.on('console',m=>{if(m.type()==='error')errors.push(m.text());});p.on('request',r=>{if(r.url().includes('/assets/vfx/blender/'))requests.push(r.url());});}watch(page);
async function shot(p,name){const file=`${OUT}/blender-${name}-${id}.jpg`;await p.screenshot({path:file,type:'jpeg',quality:85,timeout:240000});shots.push(file);}
try{
 await page.goto(`${BASE}/vfx-workbench.html`);await page.waitForFunction(()=>!!window.vfxWorkbench);await page.evaluate(()=>vfxWorkbench.seek(30));assert.equal(requests.length,0,'default workbench must not fetch Blender assets');
 await page.click('#refined');await page.check('#compareFlow');
 for(const [asset,fighter,key] of [['signature','4','sol-shell'],['signature','5','vesper-shell'],['capture','5','capture-collar'],['burst','0','release-burst']]){
  await page.selectOption('#asset',asset);await page.selectOption('#fighter',fighter);
  await page.waitForFunction(async key=>{vfxWorkbench.seek(30);const {blenderVfxStatus}=await import('./blender-vfx.js');return blenderVfxStatus().assets[key]==='ready'&&vfxWorkbench.views[1].asset.getObjectByName(`blender-${key}`)?.userData.loaded;},key);
  for(const camera of ['three','side','back']){await page.selectOption('#camera',camera);await page.evaluate(()=>vfxWorkbench.seek(30));await shot(page,`${key}-workbench-${camera}`);}
 }
 await page.waitForFunction(async()=>Object.values((await import('./blender-vfx.js')).blenderVfxStatus().masks).filter(v=>v==='ready').length===3);
 // Actual combat through input, with the same camera and simulation sample old/new.
 const fight=await context.newPage();watch(fight);await fight.setViewportSize({width:800,height:600});await fight.route('**/blender-fight-review*',r=>r.fulfill({contentType:'text/html',body:'<html><body style="margin:0"><canvas></canvas></body></html>'}));await fight.goto(`${BASE}/blender-fight-review?energy=flow`);
 await fight.evaluate(async()=>{const {createView}=await import('./render.js'),combat=await import('./combat.js'),vfx=await import('./vfx-settings.js');const view=createView(document.querySelector('canvas'),{talaModel:'graphic'});view.quality('low');window.review={view,combat,vfx,m:null,draw(camera='lock',reduced=false){view.render(0,this.m,{camera,cameraZoom:.65,reduced});},step(input={}){combat.update(this.m,[{...combat.neutral(),...input},combat.neutral()]);view.render(1/60,this.m,{camera:'lock',cameraZoom:.65,reduced:false});}};});
 for(const [fighter,kind,key] of [[4,'signature','sol-shell'],[5,'signature','vesper-shell'],[5,'capture','capture-collar'],[0,'beam','release-burst']]){
  await fight.evaluate(fighter=>{const r=review;r.m=r.combat.createMatch(fighter,1,'training');r.view.match(r.m);r.vfx.setVfxSettings(r.vfx.REFINED_VFX);},fighter);
  await fight.waitForFunction(()=>review.view.fighterModels.every(m=>['graphic','v3'].includes(m.status)),null,{timeout:240000});
  await fight.evaluate(kind=>{const r=review;for(let i=0;i<70;i++)r.step();r.m.players[0].x=-4;r.m.players[1].x=4;r.step(kind==='capture'?{capture:true}:kind==='beam'?{x:1,attack:true}:{attack:true});r.step();let limit=90;while(!r.m.projectiles.length&&limit-->0)r.step();if(!r.m.projectiles.length)throw new Error('No combat projectile for '+kind);for(let i=0;i<(kind==='beam'?4:12);i++)r.step();},kind);
  await fight.waitForFunction(key=>{review.draw();return review.view.scene.getObjectByName(`blender-${key}`)?.userData.loaded;},key,{timeout:240000});
  for(const camera of ['side','lock'])for(const mode of ['old','new']){
   await fight.evaluate(({camera,mode})=>{review.vfx.setVfxSettings({...review.vfx.REFINED_VFX,blenderAssets:mode==='new'?1:0});review.draw(camera);},{camera,mode});await shot(fight,`${key}-combat-${camera}-${mode}`);
  }
  // Loaded shaders obey frozen/reduced time, not wall-clock passage.
  const frozen=await fight.evaluate(()=>{review.draw('lock',true);const values=[];review.view.scene.traverse(n=>{if(n.material?.uniforms?.uTime)values.push(n.material.uniforms.uTime.value);});return values;});assert.ok(frozen.length>0&&frozen.every(t=>t===0),'reduced motion must freeze loaded surfaces');
 }
 await fight.close();assert.deepEqual(errors,[]);writeFileSync(`${OUT}/blender-report-${id}.json`,JSON.stringify({shots,errors,assetRequests:requests,checks:['no default asset requests','four GLBs loaded through production factories','three masks loaded','old/new workbench side and attack-axis','real combat old/new side and P1 lock cameras','loaded shaders freeze in reduced motion']},null,2));
}finally{await browser.close();}
