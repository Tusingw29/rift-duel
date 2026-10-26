import {launch,BASE,OUT,stamp} from './common.mjs';
import {writeFileSync} from 'node:fs';
const browser=await launch(),page=await browser.newPage({viewport:{width:800,height:520}}),id=stamp(),errors=[],shots=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.route('**/fluidity-review',r=>r.fulfill({contentType:'text/html',body:'<html><body style="margin:0"><canvas id="stage"></canvas></body></html>'}));
 await page.goto(`${BASE}/fluidity-review`);
 await page.evaluate(async()=>{
  const {createView}=await import('/render.js'),combat=await import('/combat.js');
  const view=createView(document.querySelector('canvas'),{talaModel:'graphic'});view.quality('low');
  const m=combat.createMatch(0,2,'training');m.players[0].x=0;m.players[1].x=8;
  view.match(m);const settings={camera:'side',cameraZoom:.65,reduced:false};
  window.review={view,m,combat,settings,step(input={}){combat.update(m,[{...combat.neutral(),...input},combat.neutral()]);view.render(0,m,settings);}};
 });
 await page.waitForFunction(()=>window.review?.view.fighterModels.every(p=>p.status&&p.status!=='loading'),null,{timeout:240000});
 const report=await page.evaluate(()=>{
  const r=window.review;r.step({x:1,attack:true});r.step();let safety=40;while(!r.m.projectiles.some(p=>p.kind==='beam')&&safety-->0)r.step();
  const group=r.view.scene.getObjectByName('beam-release-effects'),entry=group.children.find(g=>g.visible),flare=entry?.children[0],hand=r.view.models[0].limbs[0].userData.hand;
  const handPosition=hand.getWorldPosition(flare.position.clone());
  if(!flare?.visible||flare.position.distanceTo(handPosition)>1e-6)throw new Error('Release is not attached to the animated hand');
  return {tick:r.m.tick,hand:handPosition.toArray(),flare:flare.position.toArray()};
 });
 async function shot(name){const file=`${OUT}/${name}-${id}.jpg`;await page.screenshot({path:file,type:'jpeg',quality:85,timeout:240000});shots.push(file);console.log(file);}
 await shot('beam-hand-side');
 await page.evaluate(()=>{const r=window.review;r.settings.camera='lock';r.view.render(0,r.m,r.settings);});await shot('beam-hand-lock');
 await page.evaluate(()=>{const r=window.review;r.settings.camera='side';let safety=100;while(r.m.projectiles.length&&safety-->0)r.step();if(safety<=0)throw new Error('Beam never dissipated');});
 await shot('beam-breakup-0');
 await page.evaluate(()=>{const r=window.review;while(r.m.hitstop)r.step();r.step();r.step();});await shot('beam-breakup-2');
 await page.evaluate(()=>{const r=window.review;r.step();r.step();});await shot('beam-breakup-4');
 await page.evaluate(()=>{const r=window.review;for(let j=0;j<4;j++)r.step();const group=r.view.scene.getObjectByName('beam-release-effects');if(group.children.some(g=>g.visible))throw new Error('Stale beam effects');});
 writeFileSync(`${OUT}/report-${id}.json`,JSON.stringify({report,shots,errors},null,2));if(errors.length)throw new Error(errors.join('\n'));
}finally{await browser.close();}
