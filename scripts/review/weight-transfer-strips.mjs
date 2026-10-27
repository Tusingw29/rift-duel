// WEIGHT-TRANSFER capture: the same simulation frames rendered by two builds (BEFORE = main, AFTER = this branch),
// stacked as two rows per camera (side and the behind-player lock-on fight camera). Both sandboxes replay every frame
// from the scenario reset on the simulation clock, so each column is the identical simulation state.
// Usage: RIFT_TOOLS=<dir> BEFORE=http://localhost:4192/dist AFTER=http://localhost:4191/dist [ONLY=tala-combo] node scripts/review/weight-transfer-strips.mjs
import {launch,OUT,stamp,SHOT,PNG,toJpeg} from './common.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
export const PLAN={
 'tala-combo':{scenario:'strike3',p1:2,p2:1,frames:[0,4,7,10,20,26,30,34,46,54,60,64,68,84,92]},
 'aegis-combo':{scenario:'strike3',p1:0,p2:1,frames:[0,5,8,11,22,28,33,38,50,58,64,70,76,90]},
 'morrow-combo':{scenario:'strike3',p1:3,p2:1,frames:[0,5,9,12,26,32,37,42,60,68,76,82,88]}
};
const only=process.env.ONLY?.split(','),id=stamp(),W=340,H=520;
const builds=[['BEFORE (main)',process.env.BEFORE||'http://localhost:4192/dist'],['AFTER (weight transfer)',process.env.AFTER||'http://localhost:4191/dist']];
const browser=await launch(),page=await browser.newPage({viewport:{width:W,height:H}});const errors=[];page.on('pageerror',e=>errors.push(e.message));
const stack=rows=>{const w=Math.max(...rows.map(r=>r.width)),h=rows.reduce((s,r)=>s+r.height,0)+rows.length-1,out=new PNG({width:w,height:h});out.data.fill(255);let y=0;for(const r of rows){PNG.bitblt(r,out,0,0,r.width,r.height,0,y);y+=r.height+1;}return out;};
const row=frames=>{const out=new PNG({width:frames.length*(W+1)-1,height:H});out.data.fill(255);frames.forEach((f,i)=>PNG.bitblt(f,out,0,0,W,H,i*(W+1),0));return out;};
try{
 for(const [name,plan] of Object.entries(PLAN)){
  if(only&&!only.includes(name))continue;
  const rows={side:[],lock:[]};
  for(const [label,base] of builds){
   await page.goto(`${base}/sandbox.html?scenario=${plan.scenario}&p1=${plan.p1}&p2=${plan.p2}&zoom=${process.env.ZOOM||.5}&x=${id}`,{waitUntil:'domcontentloaded',timeout:180000});
   await page.waitForFunction(()=>window.sandbox?.state?.scenario&&window.sandbox.models.every(m=>m.status&&m.status!=='loading'),null,{timeout:240000});
   await page.evaluate(()=>{const a=document.querySelector('aside');if(a)a.style.display='none';const l=document.createElement('div');l.id='wt-label';l.style.cssText='position:fixed;left:8px;top:6px;color:#fff;font:600 14px system-ui;text-shadow:0 1px 3px #000;z-index:9';document.body.append(l);});
   for(const cam of ['side','lock']){
    await page.evaluate(c=>{const el=document.querySelector('#camera');el.value=c;el.dispatchEvent(new Event('change'));},cam);
    const shots=[];
    for(const f of plan.frames){
     await page.evaluate(async([f,label])=>{await window.sandbox.seek(f);const s=window.sandbox.state.scenario.m,p=s.players[0];document.querySelector('#wt-label').textContent=`${label} · f${f} · ${p.move?`hit ${p.move.chain} f${p.move.frame}`:p.anim}${s.hitstop>0?' · HITSTOP':''}`;},[f,label]);
     await new Promise(r=>setTimeout(r,100));
     const file=`${OUT}/wt-${name}-${cam}-${f}-${id}.png`;await page.screenshot({path:file,...SHOT});shots.push(PNG.sync.read(readFileSync(file)));
    }
    rows[cam].push(row(shots));
   }
  }
  for(const cam of ['side','lock']){const out=`${OUT}/${name}-${cam}.jpg`;writeFileSync(out,toJpeg(stack(rows[cam]),70));console.log('strip',out);}
 }
}finally{await browser.close();}
if(errors.length)console.warn('page errors',errors.slice(0,5));
