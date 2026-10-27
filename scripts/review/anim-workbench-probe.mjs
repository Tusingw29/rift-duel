// ANIM-WORKBENCH browser probe: load dist/anim-workbench.html, drive it through window.animWorkbench, record page
// errors and the overlays' numbers, and save screenshots of each check.
// Usage: RIFT_TOOLS=<dir> RIFT_BASE=http://localhost:4193/dist [SHOTS=<dir>] node scripts/review/anim-workbench-probe.mjs
import {launch,BASE,OUT,stamp,SHOT,PNG,toJpeg} from './common.mjs';
import {writeFileSync} from 'node:fs';
const id=stamp(),browser=await launch(),page=await browser.newPage({viewport:{width:1500,height:900}}),errors=[],results={};
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
const shot=async name=>{const file=`${OUT}/workbench-${name}.jpg`;writeFileSync(file,toJpeg(PNG.sync.read(await page.screenshot({...SHOT})),72));console.log('shot',file);};
try{
 await page.goto(`${BASE}/anim-workbench.html?x=${id}`,{waitUntil:'domcontentloaded',timeout:180000});
 await page.waitForFunction(()=>window.animWorkbench?.ready,null,{timeout:240000});
 await page.evaluate(()=>window.animWorkbench.ready);
 const run=async(name,opts,check)=>{const t0=Date.now();await page.evaluate(o=>window.animWorkbench.set(o),opts);results[name]={ms:Date.now()-t0,...await page.evaluate(check||(()=>({last:window.animWorkbench.last,frames:window.animWorkbench.state.frames,move:window.animWorkbench.state.move&&{kind:window.animWorkbench.state.move.kind,chain:window.animWorkbench.state.move.chain,startup:window.animWorkbench.state.move.startup},trail:window.animWorkbench.trails.B.length})))};await shot(name);};
 await run('tala-strike1-imported-impact',{fighter:2,state:'strike1',source:'imported',layout:'split',camera:'orbit',frame:9});
 await run('tala-strike3-hybrid-overlay',{fighter:2,state:'strike3',source:'hybrid',layout:'overlay',frame:70});
 // A tweak at impact must move B and leave A alone.
 results.tweak=await page.evaluate(async()=>{const w=window.animWorkbench;await w.set({fighter:2,state:'strike1',source:'hybrid',layout:'split',frame:11}); // the move starts on scenario frame 2: frame 11 = move frame 9, the damage frame
  const before={A:w.views.A.view.models[0].spine.rotation.x,B:w.views.B.view.models[0].spine.rotation.x};await w.setTweak('impact','lean',.3);await w.seek(11);
  const after={A:w.views.A.view.models[0].spine.rotation.x,B:w.views.B.view.models[0].spine.rotation.x};const data=w.exportData();await w.setTweak('impact','lean',0);return {before,after,exported:data.tweaks};});
 await run('aegis-strike3-blade-trail',{fighter:0,state:'strike3',source:'authored',layout:'split',camera:'side',frame:60});
 await run('tala-getup',{fighter:2,state:'ab-knockdown-getup-guard',source:'imported',layout:'split',camera:'orbit',frame:120});
 await run('morrow-forward-special',{fighter:3,state:'wb-forward',source:'authored',frame:30});
 await run('tala-defeat',{fighter:2,state:'wb-defeat',source:'authored',frame:60});
 await run('tala-advance-run',{fighter:2,state:'approach',source:'imported',frame:30});
}finally{await browser.close();}
writeFileSync(`${OUT}/workbench-probe.json`,JSON.stringify({errors,results},null,1));
console.log(JSON.stringify({errors:errors.slice(0,8),results},null,1));
// CI gate: no page errors, every state ran, and a tweak moves view B at the damage frame while view A stays put.
const t=results.tweak,failures=[];
if(errors.length)failures.push(`page errors: ${errors.slice(0,3).join(' | ')}`);
if(!t||Math.abs(t.after.A-t.before.A)>1e-4||Math.abs(t.after.B-t.before.B)<.05)failures.push(`tweak check ${JSON.stringify(t)}`);
for(const [name,r] of Object.entries(results))if(r.trail!==undefined&&!(r.trail>0))failures.push(`${name}: no trail`);
if(failures.length){console.error('ANIM-WORKBENCH PROBE FAILED',failures);process.exitCode=1;}else console.log('ANIM-WORKBENCH PROBE PASSED');
