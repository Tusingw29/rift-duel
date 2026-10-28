import {launch,BASE,OUT,stamp} from './common.mjs';import {writeFileSync} from 'node:fs';import assert from 'node:assert/strict';
const browser=await launch(),context=await browser.newContext({viewport:{width:1100,height:850}}),page=await context.newPage(),errors=[],report={};const suffix=stamp();
page.setDefaultTimeout(120000);page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const shot=async name=>{const file=`${name}-${suffix}.jpg`;await page.screenshot({path:`${OUT}/${file}`,type:'jpeg',quality:76,timeout:240000});return file;};
try{
 await page.goto(`${BASE}/balance-lab.html?fighter=vesper`,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.balanceLab?.ready);
 await page.click('#preset-rules');let raw=await page.evaluate(()=>balanceLab.exportTuning());assert.equal(raw.sys.missPenalty,7);assert.equal(raw.sys.blockstun,12);assert.equal(raw.sys.splitGuard,true);
 await page.click('[data-tab="balance"]');assert.match(await page.locator('#checks').innerText(),/17 pairings/);report.rules=await shot('game-wide-checks');
 await page.click('#preset-full');raw=await page.evaluate(()=>balanceLab.exportTuning());assert.equal(raw.fighters.rei.stats.reach,2.85);assert.equal(raw.fighters.aegis.stats.shotSpeed,14);assert.equal(raw.fighters.vesper.stats.power,1.03);
 report.full=await shot('roster-control');await page.locator('article.card').filter({hasText:'VESPER'}).scrollIntoViewIfNeeded();report.vesper=await shot('vesper-control');const core=await page.evaluate(()=>balanceLab.exportTuning());
 await page.click('[data-tab="rules"]');await page.locator('[data-sys="missPenalty"]').fill('5');await page.locator('[data-sys="missPenalty"]').dispatchEvent('change');assert.equal(await page.evaluate(()=>balanceLab.state.sys.missPenalty),5);
 await page.click('#preset-undo');assert.equal(await page.evaluate(()=>balanceLab.state.fighters.rei.stats.reach),3.1);
 // Same metrics and saved/imported settings in the generated standalone copy.
 await page.goto(`${BASE}/frame-codex.html?fighter=vesper`,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.balanceLab?.ready);await page.click('#preset-full');assert.deepEqual(await page.evaluate(()=>balanceLab.exportTuning()),core);
 await page.click('[data-tab="balance"]');report.standalone=await shot('standalone-frame-codex');
 await page.setViewportSize({width:390,height:844});assert.ok(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth+1));report.phone=await shot('phone-control');await page.setViewportSize({width:1000,height:720});
 // Direct proposal works even with corrupt saved tuning, without changing it.
 await page.evaluate(()=>{localStorage.setItem('rift-balance-lab','{broken');localStorage.setItem('rift-options',JSON.stringify({quality:'low',music:false,announcer:false,reduced:true}));});
 await page.goto(`${BASE}/?balance=proposed&energy=flow`,{waitUntil:'domcontentloaded'});await page.waitForFunction(()=>window.riftDebug);await page.selectOption('#mode','training');await page.click('#start');await page.waitForFunction(()=>riftDebug().tick>2);
 report.match=await page.evaluate(()=>riftDebug());assert.equal(report.match.balance.sys.missPenalty,7);assert.equal(report.match.balance.fighters.rei.stats.reach,2.85);assert.equal(await page.evaluate(()=>localStorage.getItem('rift-balance-lab')),'{broken');report.game=await shot('proposed-training');
 // Real simulation in the loaded browser, with a defender walking out of jab range.
 report.whiff=await page.evaluate(async()=>{const {createMatch,neutral,update}=await import('./combat.js');const {loadBalancePreview}=await import('./balance-preview.js');const cfg=await loadBalancePreview('?balance=proposed',localStorage);const m=createMatch(2,0,'duel','normal',{balance:cfg.balance});m.players[0].x=0;m.players[1].x=2.23;const step=(a={},b={})=>update(m,[{...neutral(),...a},{...neutral(),...b}]);step({attack:true});step();const mv=m.players[0].move;for(let n=0;n<70&&m.players[0].move;n++)step({},{x:-1});return {kind:mv.kind,penalty:mv.missPenalty,recovery:mv.recovery,total:mv.total};});assert.equal(report.whiff.penalty,7);assert.equal(report.whiff.recovery,23);
 report.errors=errors;assert.deepEqual(errors,[]);console.log(JSON.stringify({passed:true,suffix,whiff:report.whiff}));
}finally{writeFileSync(`${OUT}/browser-report-${suffix}.json`,JSON.stringify({...report,errors},null,2));await browser.close();}
