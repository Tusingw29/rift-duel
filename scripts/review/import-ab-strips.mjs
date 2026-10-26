// TALA-IMPORT-AB capture: for each comparison scenario, the same simulation frames rendered in the sandbox with Tala's
// authored animation (row A) and the imported capture (row B), from the side camera and the behind-player lock-on
// fight camera. Every frame is replayed from the scenario reset on the simulation clock, so A and B show identical
// simulation states. Usage: RIFT_TOOLS=<dir> RIFT_BASE=http://localhost:4187/dist [ONLY=ab-advance-guard] node scripts/review/import-ab-strips.mjs
import {launch,BASE,OUT,stamp,SHOT,PNG,toJpeg} from './common.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
export const SHOTS_PLAN={
 'ab-advance-guard':[0,6,12,18,24,30,36,40,46,60],
 'ab-retreat-attack':[0,8,16,24,32,38,47,52,62,76],
 'ab-circle-left-guard':[0,8,16,24,32,40,44,50,62],
 'ab-circle-right-guard':[0,8,16,24,32,40,44,50,62],
 'ab-knockdown-getup-guard':[96,104,120,124,128,132,136,140,144,148,152,165],
 'ab-advance-hit':[30,38,43,46,50,56,66,75,85],
 'ab-advance-strike-hitstop':[20,26,29,31,33,36,40,43,50,60]
};
const only=process.env.ONLY?.split(','),id=stamp(),W=360,H=560;
const browser=await launch(),page=await browser.newPage({viewport:{width:W,height:H}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
function stack(rows){const w=Math.max(...rows.map(r=>r.width)),h=rows.reduce((s,r)=>s+r.height,0)+rows.length-1,out=new PNG({width:w,height:h});out.data.fill(255);let y=0;for(const r of rows){PNG.bitblt(r,out,0,0,r.width,r.height,0,y);y+=r.height+1;}return out;}
function row(frames){const w=frames.length*(W+1)-1,out=new PNG({width:w,height:H});out.data.fill(255);frames.forEach((f,i)=>PNG.bitblt(f,out,0,0,W,H,i*(W+1),0));return out;}
try{
 for(const [scenario,frames] of Object.entries(SHOTS_PLAN)){
  if(only&&!only.includes(scenario))continue;
  await page.goto(`${BASE}/sandbox.html?scenario=${scenario}&p1=2&p2=1&zoom=${process.env.ZOOM||.45}&x=${id}`,{waitUntil:'domcontentloaded',timeout:180000});
  await page.waitForFunction(()=>window.sandbox?.state?.scenario,null,{timeout:240000});
  await page.evaluate(()=>{const a=document.querySelector('aside');if(a)a.style.display='none';const l=document.createElement('div');l.id='ab-label';l.style.cssText='position:fixed;left:8px;top:6px;color:#fff;font:600 15px system-ui;text-shadow:0 1px 3px #000;z-index:9';document.body.append(l);});
  const rows={side:[],lock:[]};
  for(const mode of ['authored','imported']){
   await page.evaluate(async m=>{const el=document.querySelector('#anim');el.value=m;await el.onchange();},mode);
   for(const cam of ['side','lock']){
    await page.evaluate(c=>{const el=document.querySelector('#camera');el.value=c;el.dispatchEvent(new Event('change'));},cam);
    const shots=[];
    for(const f of frames){
     await page.evaluate(async([f,label])=>{await window.sandbox.seek(f);const s=window.sandbox.state.scenario.m.players[0];document.querySelector('#ab-label').textContent=`${label} · f${f} · ${s.anim}${s.getUp?' '+s.getUp.frame+'/28':''}${window.sandbox.state.scenario.m.hitstop>0?' · HITSTOP':''}`;},[f,mode==='authored'?'A AUTHORED':'B IMPORTED']);
     await new Promise(r=>setTimeout(r,120));
     const file=`${OUT}/ab-${scenario}-${mode}-${cam}-${f}-${id}.png`;await page.screenshot({path:file,...SHOT});shots.push(PNG.sync.read(readFileSync(file)));
    }
    rows[cam].push(row(shots));
   }
  }
  for(const cam of ['side','lock']){const out=`${OUT}/${scenario}-${cam}.jpg`;writeFileSync(out,toJpeg(stack(rows[cam]),68));console.log('strip',out);}
 }
}finally{await browser.close();}
if(errors.length)console.warn('page errors',errors.slice(0,5));
