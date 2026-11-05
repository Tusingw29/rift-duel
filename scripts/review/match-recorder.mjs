import {launch,BASE,OUT} from './common.mjs';
import {writeFileSync,readFileSync} from 'node:fs';
import assert from 'node:assert/strict';
import {replayAll} from '../../dist/skill/replay-engine.js';
const browser=await launch(),errors=[],report={games:[],replay:[]},stamp=Date.now();let passed=false;
try{
 console.log('Record/input equality');const p=await browser.newPage({viewport:{width:850,height:650},acceptDownloads:true});p.setDefaultTimeout(120000);p.on('pageerror',e=>{errors.push(e.message);console.error('PAGE ERROR',e.message);});
 await p.route('**/render.js*',r=>r.fulfill({contentType:'text/javascript',body:`export function createView(){return new Proxy({arenaName:'Recorder input fixture',camera:{matrixWorld:{elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}},talaModels:[],fighterModels:[]},{get(o,k){return k in o?o[k]:()=>{};}});}`}));
 await p.addInitScript(()=>{localStorage.setItem('rift-options',JSON.stringify({volume:0,music:false,announcer:false,quality:'low',reduced:true,roundSeconds:60,winsNeeded:1}));let pending,t=0;window.requestAnimationFrame=cb=>{pending=cb;return 1;};window.stepFrames=n=>{for(let i=0;i<n;i++){const fn=pending;pending=null;fn?.(t+=1000/60);}};});
 const query='?move=v2&arena=ring&burst=v2&step=linear&controls=side';let file;
 for(const record of [false,true]){
  await p.goto(BASE+'/index.html'+query+(record?'&record=1':''));await p.waitForFunction(()=>window.riftDebug);await p.selectOption('#mode','duel');await p.selectOption('#opponent','3');await p.click('#start');await p.evaluate(()=>stepFrames(200));
  for(let n=0;n<100;n++){await p.keyboard.down(n%3===0?'KeyJ':'KeyD');await p.evaluate(()=>stepFrames(2));await p.keyboard.up(n%3===0?'KeyJ':'KeyD');await p.evaluate(()=>stepFrames(80));if((await p.evaluate(()=>riftDebug())).phase==='over')break;}
  await p.evaluate(()=>stepFrames(250));const d=await p.evaluate(()=>riftDebug());assert.equal(d.phase,'over');assert.equal(await p.locator('#download-replay').count(),record?1:0);report.games.push({record,phase:d.phase,tick:d.tick,hp:d.players.map(p=>p.hp),positions:d.players.map(({x,z})=>({x,z})),recordedTicks:d.recordedTicks});
  if(record){const download= p.waitForEvent('download');await p.click('#download-replay');const dl=await download,path=OUT+'/browser-match.json';await dl.saveAs(path);file=JSON.parse(readFileSync(path));assert.ok(file.rounds[0].runs.some(r=>r.raw[0].keys.includes('KeyD')));assert.ok(file.rounds[0].runs.some(r=>r.raw[1].source==='cpu'));assert.equal(file.rounds[0].result.ticks,d.tick);const build=await p.evaluate(async()=>await (await fetch('./skill/build.json')).json());const result=replayAll(file,build,{keepFrames:false});assert.equal(result.summary.verified,true);assert.equal(await p.evaluate(()=>JSON.parse(localStorage.getItem('rift-match-replays')).length),1);report.download={filename:dl.suggestedFilename(),inputTicks:file.inputTicks,verifiedInNode:true};}
 }
 const a=report.games[0],b=report.games[1];assert.deepEqual({tick:a.tick,hp:a.hp,positions:a.positions},{tick:b.tick,hp:b.hp,positions:b.positions});await p.close();
 // Real renderer: import, step, seek, replay end, reload from local storage, wrong build.
 console.log('Real renderer replay');const v=await browser.newPage({viewport:{width:850,height:700}});v.setDefaultTimeout(180000);v.on('pageerror',e=>{errors.push(e.message);console.error('PAGE ERROR',e.message);});await v.goto(BASE+'/replay.html');await v.waitForFunction(()=>window.loadReplay);
 await v.setInputFiles('#file',{name:'browser-match.json',mimeType:'application/json',buffer:Buffer.from(JSON.stringify(file))});await v.waitForFunction(()=>window.replayDebug?.().total>0);await v.waitForFunction(()=>replayDebug().models.every(x=>['graphic','v3'].includes(x.status)));
 await v.click('#step');assert.equal((await v.evaluate(()=>replayDebug())).cursor,1);await v.evaluate(()=>seekReplay(200));assert.equal((await v.evaluate(()=>replayDebug())).cursor,200);await v.screenshot({path:OUT+`/replay-desktop-${stamp}.jpg`,type:'jpeg',quality:75,fullPage:true});
 await v.evaluate(()=>seekReplay(5));assert.equal((await v.evaluate(()=>replayDebug())).cursor,5);await v.click('#play');await v.waitForFunction(()=>replayDebug().cursor>5);await v.click('#play');const paused=(await v.evaluate(()=>replayDebug())).cursor;await v.waitForTimeout(80);assert.equal((await v.evaluate(()=>replayDebug())).cursor,paused);
 await v.evaluate(()=>seekReplay(replayDebug().total));let d=await v.evaluate(()=>replayDebug());assert.equal(d.done,true);assert.deepEqual(d.hp,file.rounds.at(-1).result.hp);assert.match(await v.locator('#status').textContent(),/verified/);report.replay.push(d);
 await v.setViewportSize({width:390,height:800});await v.screenshot({path:OUT+`/replay-phone-${stamp}.jpg`,type:'jpeg',quality:75,fullPage:true});assert.equal(await v.evaluate(()=>document.documentElement.scrollWidth>innerWidth),false);
 console.log('Saved replay reload');await v.evaluate(f=>{localStorage.setItem('rift-match-replays',JSON.stringify([f]));},file);await v.reload();await v.waitForFunction(()=>window.loadReplay,{},{timeout:30000});console.log('Reload initialized');await v.selectOption('#saved','0');await v.click('#open-saved');console.log('Saved opened',await v.locator('#status').textContent());await v.waitForFunction(()=>window.replayDebug?.().total>0);
 console.log('Mismatch and reload recovery');const bad=structuredClone(file);bad.build.hash='wrong-build';await v.evaluate(f=>loadReplay(f),bad);assert.match(await v.locator('#status').textContent(),/build mismatch/);report.mismatchRejected=true;
 await v.evaluate(f=>loadReplay(f),file);await v.evaluate(()=>seekReplay(80));assert.equal((await v.evaluate(()=>replayDebug())).error,null);
 // A URL-loaded file uses the same validation path.
 console.log('URL load');await v.goto(BASE+'/replay.html?file=../art/review-2026-11-05/match-recorder/sample-replay.json',{waitUntil:'domcontentloaded'});await v.waitForFunction(()=>window.replayDebug?.().total>0,{},{timeout:30000});report.urlLoaded=true;
 assert.deepEqual(errors,[]);passed=true;
}finally{writeFileSync(OUT+'/browser.json',JSON.stringify({...report,errors,passed},null,2));await browser.close();}
