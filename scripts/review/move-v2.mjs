import {launch,BASE,OUT} from './common.mjs';import {writeFileSync} from 'node:fs';import assert from 'node:assert/strict';
const browser=await launch(),errors=[],report={cases:[],captures:[]},stamp=Date.now();
const init=()=>{localStorage.setItem('rift-options',JSON.stringify({volume:0,music:false,announcer:false,quality:'low',reduced:true,camera:'lock'}));let pending,t=0;window.requestAnimationFrame=cb=>{pending=cb;return 1;};window.stepFrames=n=>{for(let i=0;i<n;i++){const fn=pending;pending=null;fn?.(t+=1000/60);}};};
try{
 const p=await browser.newPage({viewport:{width:900,height:600}});p.on('pageerror',e=>errors.push(e.message));p.setDefaultTimeout(120000);await p.addInitScript(init);
 await p.route('**/render.js*',r=>r.fulfill({contentType:'text/javascript',body:`export function createView(){return new Proxy({arenaName:'Input fixture',talaModels:[],fighterModels:[]},{get(o,k){return k in o?o[k]:()=>{};}});}`}));
 for(const query of ['', '?move=v2','?move=v2&grab=slow','?move=v2&mode=training'])for(const key of ['KeyW','KeyS','KeyA','KeyD']){
  console.log('Input case',query,key);await p.goto(BASE+'/index.html'+query);await p.waitForFunction(()=>window.riftDebug,null,{polling:100});if(query.includes('mode=training'))assert.equal(await p.locator('#mode').inputValue(),'training');await p.selectOption('#mode','training');await p.click('#start');await p.evaluate(()=>stepFrames(300));
  await p.keyboard.down(key);await p.evaluate(()=>stepFrames(1));await p.keyboard.up(key);await p.evaluate(()=>stepFrames(1));await p.keyboard.down(key);await p.evaluate(()=>stepFrames(1));await p.keyboard.up(key);
  const d=await p.evaluate(()=>riftDebug()),expected=key==='KeyW'?'dash':key==='KeyS'?'backdash':'sidestep';if(query)assert.equal(d.players[0].step?.kind,expected);else assert.ok(!d.players[0].step);report.cases.push({query,key,step:d.players[0].step?.kind||null});
 }
 await p.close();
 if(!process.argv.includes('--input-only')){
 const visual=await browser.newPage({viewport:{width:800,height:600}});visual.on('pageerror',e=>errors.push(e.message));visual.setDefaultTimeout(180000);await visual.addInitScript(init);await visual.goto(BASE+'/index.html?move=v2&mode=training');await visual.waitForFunction(()=>window.riftDebug,null,{polling:100});await visual.click('#start');await visual.evaluate(()=>stepFrames(2));await visual.waitForFunction(()=>riftDebug().fighterModels.every(x=>x.status!=='loading'&&x.status!=='pending'),null,{polling:250});
 for(const key of ['KeyS','KeyD']){await visual.evaluate(()=>stepFrames(30));await visual.keyboard.down(key);await visual.evaluate(()=>stepFrames(1));await visual.keyboard.up(key);await visual.evaluate(()=>stepFrames(1));await visual.keyboard.down(key);await visual.evaluate(()=>stepFrames(4));await visual.keyboard.up(key);const d=await visual.evaluate(()=>riftDebug());assert.ok(d.players[0].step);assert.equal(d.players[0].anim,'run');const file=`${key==='KeyS'?'backdash':'sidestep'}-lock-${stamp}.jpg`;await visual.screenshot({path:OUT+'/'+file,type:'jpeg',quality:82,timeout:240000});report.captures.push({file,step:d.players[0].step,models:d.fighterModels});}
 }
 assert.deepEqual(errors,[]);report.passed=true;
}finally{writeFileSync(OUT+(process.argv.includes('--input-only')?'/browser-input-final.json':'/browser.json'),JSON.stringify({...report,errors},null,2));await browser.close();}
