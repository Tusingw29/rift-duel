import {chromium} from 'playwright';
import {mkdirSync,writeFileSync} from 'node:fs';
const out='artifacts/combat-travel';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:960,height:640}}),errors=[],samples=[];
page.on('pageerror',e=>errors.push(e.message));
await page.route('**/travel-review',r=>r.fulfill({contentType:'text/html',body:'<html><body style="margin:0"><canvas id="stage"></canvas></body></html>'}));
await page.goto('http://127.0.0.1:4173/travel-review');
await page.evaluate(async()=>{
 const combat=await import('/combat.js'),{createView}=await import('/render.js');
 const view=createView(document.querySelector('canvas'),{talaModel:'v3'});view.quality('low');
 window.review={view,combat,reset(kind){
  this.m=combat.createMatch(2,1,'training');this.m.players[0].x=0;this.m.players[1].x=kind==='pursuit'?3.5:2;
  view.match(this.m);this.kind=kind;this.frame=0;
 },step(){
  let i={};const f=this.frame++,kind=this.kind;
  if(kind==='circle'&&f===0)i={x:1,guard:true};
  if(kind==='pursuit'&&f===0)i={pursuit:true};
  if(kind==='crossover'){if(f===0)i={z:-1};if(f===2)i={z:-1,attack:true};}
  combat.update(this.m,[{...combat.neutral(),...i},combat.neutral()]);
  view.render(1/60,this.m,{camera:'lock',reduced:true});
  return this.m.players.map(p=>({x:p.x,z:p.z,air:p.air,hp:p.hp,anim:p.anim,frame:p.move?.frame,travel:p.travel?.frame}));
 }};
});
for(const kind of ['pursuit','circle','crossover']){
 await page.evaluate(kind=>window.review.reset(kind),kind);
 await page.waitForFunction(()=>window.review.view.fighterModels.every(x=>x.status&&!['loading','fallback'].includes(x.status)),null,{timeout:90000});
 for(let f=0;f<65;f++){
  const players=await page.evaluate(()=>window.review.step());samples.push({kind,f,players});
  if([0,6,12,18,24,40,64].includes(f))await page.screenshot({path:`${out}/${kind}-${f}.png`});
 }
}
writeFileSync(`${out}/report.json`,JSON.stringify({errors,samples},null,2));await browser.close();
if(errors.length)throw Error(errors.join('\n'));
