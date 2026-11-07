import {launch,BASE,OUT} from './common.mjs';import {writeFileSync,readFileSync} from 'node:fs';import {gzipSync} from 'node:zlib';import assert from 'node:assert/strict';import {replayAll} from '../../dist/skill/replay-engine.js';
const browser=await launch(),report={cases:[],errors:[]};
try{for(const lock of [0,12,20]){
 const p=await browser.newPage({acceptDownloads:true,viewport:{width:900,height:680}});p.setDefaultTimeout(120000);p.on('pageerror',e=>report.errors.push(e.message));
 // Input/replay smoke: renderer stub avoids software-GPU timing changing the input fixture.
 await p.route('**/render.js*',r=>r.fulfill({contentType:'text/javascript',body:`export function createView(){return new Proxy({arenaName:'Air recovery input fixture',camera:{matrixWorld:{elements:[1,0,0,0,0,1,0,0,0,0,1,0,0,0,0,1]}},talaModels:[],fighterModels:[]},{get(o,k){return k in o?o[k]:()=>{};}});}`}));
 await p.addInitScript(()=>{localStorage.setItem('rift-options',JSON.stringify({volume:0,music:false,announcer:false,reduced:true,quality:'low'}));let cb,t=0;window.requestAnimationFrame=f=>{cb=f;};window.stepFrames=n=>{for(let k=0;k<n;k++){const f=cb;cb=null;f?.(t+=1000/60);}};});
 const url=BASE+'/index.html?move=v2&arena=ring&burst=v2&step=linear&controls=side&record=1'+(lock?'&airlock='+lock:'');await p.goto(url);await p.waitForFunction(()=>window.riftDebug,null,{polling:100});
 await p.locator('#roster button').nth(2).click();await p.selectOption('#mode','local');await p.selectOption('#opponent','3');await p.click('#start');await p.evaluate(()=>stepFrames(250));
 const debug=()=>p.evaluate(()=>riftDebug());const frames=n=>p.evaluate(n=>stepFrames(n),n);let d=await debug();assert.equal(d.airlock,lock);
 await p.keyboard.down('KeyD');for(let n=0;n<100;n++){await frames(1);d=await debug();if(Math.hypot(d.players[0].x-d.players[1].x,d.players[0].z-d.players[1].z)<2)break;}await p.keyboard.up('KeyD');await frames(2);
 await p.keyboard.down('KeyI');await frames(1);await p.keyboard.up('KeyI');for(let n=0;n<100;n++){await frames(1);d=await debug();if(d.players[1].air>0)break;}assert.ok(d.players[1].air>0);const launch=d.tick;
 // Wait until contact freeze finishes; recovery is tested on an advancing airborne frame.
 for(let n=0;n<30;n++){await frames(1);d=await debug();if(d.tick>launch)break;}
 await p.keyboard.down('Digit2');await frames(1);d=await debug();assert.equal(d.players[1].anim==='recover',lock===0);const early=d.players[1].anim;
 if(lock){for(let n=0;n<40;n++){await frames(1);d=await debug();if(d.players[1].airlockRemaining===0)break;}assert.notEqual(d.players[1].anim,'recover');await p.keyboard.up('Digit2');await frames(1);await p.keyboard.down('Digit2');await frames(1);d=await debug();assert.equal(d.players[1].anim,'recover');}
 await p.keyboard.up('Digit2');await frames(8);await p.click('#pause');await p.click('#save-partial-replay');const waiting=p.waitForEvent('download');await p.click('#download-replay');const download=await waiting,path=OUT+'/download.json';await download.saveAs(path);const file=JSON.parse(readFileSync(path)),build=await p.evaluate(async()=>await(await fetch('./skill/build.json')).json());assert.ok(replayAll(file,build,{keepFrames:false}).summary.verified);writeFileSync(OUT+'/airlock-'+lock+'-replay.json.gz',gzipSync(JSON.stringify(file)));report.cases.push({url,lock,early,afterUnlock:d.players[1].anim,replayVerified:true,ticks:file.inputTicks});await p.close();
 }assert.deepEqual(report.errors,[]);report.passed=true;
}finally{writeFileSync(OUT+'/browser.json',JSON.stringify(report,null,2));await browser.close();}
