import {launch,BASE,OUT,stamp} from './common.mjs';import {writeFileSync} from 'node:fs';
const browser=await launch(),page=await browser.newPage({viewport:{width:720,height:480}}),id=stamp(),errors=[],shots=[],checks=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.route('**/kinetic-review',r=>r.fulfill({contentType:'text/html',body:'<html><meta charset="utf-8"><body style="margin:0"><canvas id="stage"></canvas></body></html>'}));await page.goto(`${BASE}/kinetic-review`);
 await page.evaluate(async()=>{
  const {createView}=await import('/render.js'),combat=await import('/combat.js'),T=await import('/vendor/three.module.js');
  const view=createView(document.querySelector('canvas'),{talaModel:'graphic'});view.quality('low');const settings={camera:'side',cameraZoom:.65,reduced:false};
  window.review={view,combat,T,settings,m:null,setup(a,b){this.m=combat.createMatch(a,b,'training');this.m.players[0].x=-1;this.m.players[1].x=1;view.match(this.m);},step(a={},b={}){combat.update(this.m,[{...combat.neutral(),...a},{...combat.neutral(),...b}]);view.render(1/60,this.m,settings);},draw(){view.render(0,this.m,settings);}};
  review.setup(0,3);
 });
 const loaded=()=>page.waitForFunction(()=>review.view.fighterModels.every(p=>['v3','graphic'].includes(p.status)),null,{timeout:240000});await loaded();console.log('Models loaded');
 async function shot(name){const file=`${OUT}/${name}-${id}.jpg`;await page.screenshot({path:file,type:'jpeg',quality:87,timeout:240000});shots.push(file);console.log(file);}
 for(const [slot,name] of [[0,'aegis'],[1,'morrow']]){
  checks.push(await page.evaluate(slot=>{const r=review;for(let i=0;i<70;i++)r.combat.update(r.m,[r.combat.neutral(),r.combat.neutral()]);r.draw();r.m.players[1-slot].inv=100;r.m.players[slot].inv=0;
   r.step(slot===0?{attack:true}:{},slot===1?{attack:true}:{});r.step();let limit=40;while(!(r.m.players[slot].move?.frame>=r.m.players[slot].move?.startup+2)&&limit-->0)r.step();if(limit<0)throw new Error('Sword did not swing');r.draw();return {fighter:r.m.players[slot].id,tick:r.m.tick,frame:r.m.players[slot].move.frame};},slot));
  await shot(name+'-blade-arc-side');await page.evaluate(()=>{review.settings.camera='lock';review.draw();});await shot(name+'-blade-arc-lock');await page.evaluate(()=>review.settings.camera='side');
 }
 await page.evaluate(()=>{const r=review;for(let i=0;i<80;i++)r.combat.update(r.m,[r.combat.neutral(),r.combat.neutral()]);r.draw();r.m.players[0].x=-4;r.m.players[1].x=4;r.step({x:1,attack:true});r.step();let safety=40;while(!r.m.projectiles.some(p=>p.kind==='beam')&&safety-->0)r.step();r.settings.camera='lock';r.draw();});await shot('aegis-beam-hand-lock');
 await page.evaluate(()=>{review.setup(2,1);review.settings.camera='side';});await loaded();
 await page.evaluate(()=>{for(let i=0;i<50;i++)review.combat.update(review.m,[{...review.combat.neutral(),attack:true},review.combat.neutral()]);review.draw();});await shot('tala-bone-chi-side');
 await page.evaluate(()=>{const r=review;r.m.cinematic={kind:'capture',a:0,b:1,t:.75,duration:1.8,profile:'palm-slam',context:'front'};r.draw();});await shot('capture-chest-tether');
 checks.push(await page.evaluate(()=>{const r=review;r.m.cinematic=null;r.m.players[1].inv=0;r.combat.hit(r.m,r.m.players[0],r.m.players[1],8,'hit',true);let safety=90;while(!r.m.players[1].bounce&&safety-->0)r.combat.update(r.m,[r.combat.neutral(),r.combat.neutral()]);if(safety<=0)throw new Error('No bounce');for(let i=0;i<4;i++)r.step();r.draw();return {bounce:r.m.players[1].bounce,height:r.m.players[1].airMotion.height};}));await shot('ground-bounce-shockwave');
 await page.evaluate(()=>{for(let i=0;i<80;i++)review.combat.update(review.m,[review.combat.neutral(),review.combat.neutral()]);review.draw();const g=review.view.scene.getObjectByName('ground-impact-effects');if(g.children.some(n=>n.visible))throw new Error('Stale ground impacts');});
 writeFileSync(`${OUT}/kinetic-report-${id}.json`,JSON.stringify({checks,shots,errors},null,2));if(errors.length)throw new Error(errors.join('\n'));
}finally{await browser.close();}
