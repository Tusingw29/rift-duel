import {chromium} from 'playwright';
import {mkdirSync,readFileSync,writeFileSync} from 'node:fs';
const out='artifacts/reversal';mkdirSync(out,{recursive:true});
const browser=await chromium.launch({headless:true,args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader']});
const page=await browser.newPage({viewport:{width:960,height:640}}),errors=[],samples=[];
page.on('pageerror',e=>errors.push(e.message));
await page.addInitScript(()=>localStorage.setItem('rift-options',JSON.stringify({quality:'low',reduced:true,music:false,announcer:false,trainingBehavior:'idle'})));
await page.goto('http://127.0.0.1:4173/');await page.waitForFunction(()=>typeof window.riftDebug==='function',null,{timeout:60000});
await page.selectOption('#mode','training');await page.click('#start');await page.waitForFunction(()=>window.riftDebug().flow==='fight',null,{timeout:60000});
await page.click('#pause');await page.click('#practice-options');
await page.selectOption('#trainingBehavior','combo');
if(await page.evaluate(()=>JSON.parse(localStorage.getItem('rift-options')).trainingBehavior)!=='combo')throw Error('Practice choice did not save');
await page.screenshot({path:`${out}/practice-menu.png`});
await page.click('#close-modal');await page.keyboard.down('KeyK');
await page.waitForFunction(()=>window.riftDebug().players[1].chain===3,null,{timeout:120000});
await page.keyboard.up('KeyK');
const hud=readFileSync('dist/index.html','utf8').match(/<section id="hud".*?<\/section>/s)[0].replace(' hidden','');
await page.route('**/reversal-review',r=>r.fulfill({contentType:'text/html; charset=utf-8',body:`<html><head><meta charset="utf-8"><link rel="stylesheet" href="/style.css"></head><body><canvas id="stage"></canvas>${hud}</body></html>`}));
await page.goto('http://127.0.0.1:4173/reversal-review');
await page.evaluate(async()=>{
 const combat=await import('/combat.js'),{createView}=await import('/render.js'),{updateStaggerHud}=await import('/hud.js'),{reversalPrompt}=await import('/reversal.js');
 const view=createView(document.querySelector('canvas'),{talaModel:'graphic'});view.quality('low');
 const m=combat.createMatch(2,1,'training');m.players[0].x=0;m.players[1].x=1.7;view.match(m);
 document.querySelector('#p1-name').textContent='TALA';document.querySelector('#p2-name').textContent='REI';
 document.querySelector('#timer').textContent='∞';document.querySelector('#round-label').textContent='REVERSAL REVIEW';document.querySelector('#training-readout').hidden=false;
 window.study={m,view,combat,events:[],show(){
  view.render(1/60,m,{camera:'lock',reduced:true});m.players.forEach((p,i)=>{updateStaggerHud(document.querySelector('#stagger-status'+(i+1)),p);document.querySelector('#hp'+(i+1)).style.height=p.hp+'%';});
  document.querySelector('#training-readout').textContent=reversalPrompt([m.players[1],m.players[0]])||'RETURN STRIKE RECOVERY';
 },tick(attack={},defend={guard:true},render=true){
  combat.update(m,[{...combat.neutral(),...attack},{...combat.neutral(),...defend}]);this.events.push(...m.events);
  for(const e of m.events)if(e.type==='reversal'){view.block(e.player,true);document.querySelector('#callout').textContent='THIRD-HIT REVERSAL';}
  if(render)this.show();
 },snapshot(){return {events:this.events,players:m.players.map(p=>({hp:p.hp,anim:p.anim,frame:p.move?.frame,reversal:!!p.move?.reversal,stocks:p.stocks}))};}};
 const s=window.study;
 for(let i=0;i<12;i++)s.tick({}, {guard:true},false);
 for(let chain=1;chain<=3;chain++){
  s.tick({attack:true},{guard:true},false);s.tick({}, {guard:true},false);
  if(chain<3)while(m.players[0].move.frame<m.players[0].move.startup)s.tick({}, {guard:true},false);
 }
});
await page.waitForFunction(()=>window.study.view.fighterModels.every(x=>x.status==='v3'),null,{timeout:90000});
await page.evaluate(()=>{const s=window.study;for(let i=0;i<12;i++)s.show();while(s.m.players[0].move.frame<s.m.players[0].move.startup-2)s.tick();});
await page.screenshot({path:`${out}/third-hit-windup.png`});
await page.evaluate(()=>{window.study.tick({},{});window.study.tick();});
const deflect=await page.evaluate(()=>window.study.snapshot());samples.push(deflect);
if(!deflect.players[1].reversal||deflect.players[0].hp!==100)throw Error('Deflect did not start a delayed return');
await page.screenshot({path:`${out}/deflect.png`});
await page.evaluate(()=>{for(let i=0;i<6;i++)window.study.tick();});
const contact=await page.evaluate(()=>window.study.snapshot());samples.push(contact);
if(contact.players[0].hp>=100||contact.events.filter(e=>e.type==='reversal').length!==1)throw Error('Return strike failed');
await page.screenshot({path:`${out}/return-contact.png`});
await page.evaluate(()=>{for(let i=0;i<22;i++)window.study.tick();});
const settled=await page.evaluate(()=>window.study.snapshot());samples.push(settled);
if(settled.players[1].reversal||settled.players[0].hp!==contact.players[0].hp)throw Error('Return repeated or did not recover');
await page.screenshot({path:`${out}/recovered.png`});
writeFileSync(`${out}/report.json`,JSON.stringify({errors,samples},null,2));await browser.close();if(errors.length)throw Error(errors.join('\n'));
