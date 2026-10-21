// Browser smoke test: loads the game in headless Chromium, confirms Tala's Design 02
// preview attaches, exercises lock-on movement, a landed punch and guard, and saves
// screenshots, a console log and a JSON report. Exit code 1 on any failed check.
// Usage: node scripts/browser-smoke.mjs [--url <page>] [--out <dir>] [--tala design02|concept]
import {mkdirSync,writeFileSync} from 'node:fs';
import {join} from 'node:path';
const args=Object.fromEntries(process.argv.slice(2).map((a,i,all)=>a.startsWith('--')?[a.slice(2),all[i+1]]:[]).filter(Boolean));
const url=args.url||'https://tusingw29.github.io/rift-duel/',out=args.out||'artifacts/browser-smoke',tala=args.tala||'design02';
mkdirSync(out,{recursive:true});
const {chromium}=await import(process.env.PLAYWRIGHT_MODULE||'playwright');
const launch={args:['--use-gl=angle','--use-angle=swiftshader','--enable-unsafe-swiftshader','--autoplay-policy=no-user-gesture-required']};
if(process.env.PLAYWRIGHT_EXECUTABLE)launch.executablePath=process.env.PLAYWRIGHT_EXECUTABLE;
const browser=await chromium.launch(launch),page=await browser.newPage({viewport:{width:1100,height:640}});
const console_=[],checks=[],shots=[];
page.on('console',m=>console_.push({type:m.type(),text:m.text()}));page.on('pageerror',e=>console_.push({type:'pageerror',text:e.message}));
const check=(name,ok,detail='')=>{checks.push({name,ok:!!ok,detail});console.log(`${ok?'PASS':'FAIL'} ${name}${detail?' · '+detail:''}`);};
const shot=async name=>{const file=join(out,`${String(shots.length+1).padStart(2,'0')}-${name}.png`);await page.screenshot({path:file});shots.push(file);};
const dbg=()=>page.evaluate(()=>window.riftDebug());
const frames=n=>page.evaluate(n=>new Promise(r=>{let c=0;const f=()=>{if(++c>=n)r();else requestAnimationFrame(f);};requestAnimationFrame(f);}),n);
const untilSim=async(seconds,max=240)=>{const t0=(await dbg()).time;for(let i=0;i<max;i++){await frames(1);if(t0-(await dbg()).time>=seconds)return true;}return false;};
try{
 await page.addInitScript(()=>{localStorage.setItem('rift-options',JSON.stringify({quality:'low',trainingBehavior:'idle',reduced:false,camera:'lock'}));});
 const target=new URL(url);target.searchParams.set('tala',tala);target.searchParams.set('smoke',String(Date.now()));
 await page.goto(target.href,{waitUntil:'load'});
 await page.waitForFunction(()=>typeof window.riftDebug==='function',null,{timeout:60000});
 check('game loads and exposes riftDebug',true,target.href);
 await page.click('[data-id="2"]');await page.selectOption('#mode','training');await page.selectOption('#opponent','1');
 await shot('menu-tala');
 await page.click('#start');
 let status=[];for(let i=0;i<300;i++){await frames(1);status=(await dbg()).talaModels||[];if(status.includes(tala)||status.includes('fallback'))break;}
 check(`Tala ${tala} model attached in the fight`,status.includes(tala),JSON.stringify(status));
 for(let i=0;i<400;i++){await frames(1);if((await dbg()).flow==='fight')break;}
 check('training fight is running',(await dbg()).flow==='fight');
 await shot('fight-start');
 const before=(await dbg()).players[0];
 await page.keyboard.down('KeyW');await untilSim(.5);await page.keyboard.up('KeyW');const afterW=(await dbg()).players[0];
 check('W closes distance',afterW.x>before.x+.3,`x ${before.x.toFixed(2)} → ${afterW.x.toFixed(2)}`);
 await page.keyboard.down('KeyD');await untilSim(.5);await page.keyboard.up('KeyD');const afterD=(await dbg()).players[0];
 check('D circles the rival',Math.abs(afterD.z-afterW.z)>.3,`z ${afterW.z.toFixed(2)} → ${afterD.z.toFixed(2)}`);
 await shot('after-move');
 await page.keyboard.down('KeyW');for(let i=0;i<60;i++){await frames(1);const d=await dbg();if(Math.hypot(d.players[0].x-d.players[1].x,d.players[0].z-d.players[1].z)<2.4)break;}await page.keyboard.up('KeyW');
 await page.evaluate(()=>{window.__fx={shards:0,cracks:0};new MutationObserver(()=>{window.__fx.shards=Math.max(window.__fx.shards,document.querySelectorAll('#hud .shard').length);window.__fx.cracks=Math.max(window.__fx.cracks,document.querySelectorAll('#hud .crack').length);}).observe(document.querySelector('#hud'),{childList:true});});
 await page.keyboard.down('KeyJ');await frames(1);await page.keyboard.up('KeyJ');
 let hit=false;for(let i=0;i<20;i++){await frames(1);if((await dbg()).players[1].hp<100){hit=true;break;}}
 const fx=await page.evaluate(()=>window.__fx);
 check('punch lands on the rival',hit,`rival hp ${(await dbg()).players[1].hp.toFixed(2)}`);
 check('life gauge shatters on the hit',fx.shards>0&&fx.cracks>0,JSON.stringify(fx));
 await shot('after-hit');
 await page.keyboard.down('KeyK');await frames(3);const guarding=(await page.evaluate(()=>document.querySelector('#gauge1')?.className))!==undefined;await shot('guard');await page.keyboard.up('KeyK');
 check('HUD gauge present',guarding);
 const hud=await page.evaluate(()=>({p1:document.querySelector('#p1-name').textContent,p2:document.querySelector('#p2-name').textContent,arena:document.querySelector('#arena-name').textContent,gauge:document.querySelector('#gauge-label1').textContent}));
 check('HUD names and arena populated',hud.p1==='TALA'&&hud.p2==='REI'&&hud.arena.length>0,JSON.stringify(hud));
 const t0=Date.now();const rendered=await page.evaluate(()=>new Promise(r=>{let c=0;const start=performance.now();const f=()=>{c++;if(performance.now()-start>2000)r(c);else requestAnimationFrame(f);};requestAnimationFrame(f);}));
 console.log(`frames in 2 s: ${rendered} (software rendering; not a device frame rate)`,Date.now()-t0);
 const problems=console_.filter(m=>['error','pageerror'].includes(m.type)||m.type==='warning'&&!m.text.includes('GPU stall'));
 check('no console errors or warnings',problems.length===0,problems.map(p=>p.text).join(' | ').slice(0,300));
}catch(error){check('smoke run completed',false,error.message);try{await shot('failure');}catch{}}
finally{
 writeFileSync(join(out,'report.json'),JSON.stringify({url,tala,when:new Date().toISOString(),checks,shots,console:console_},null,2));
 writeFileSync(join(out,'console.log'),console_.map(m=>`${m.type}: ${m.text}`).join('\n'));
 await browser.close();
}
const failed=checks.filter(c=>!c.ok);
console.log(`${checks.length-failed.length}/${checks.length} checks passed; report in ${out}`);
process.exit(failed.length?1:0);
