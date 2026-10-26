// Actual graphic Tala model snapshots, using the shared persistent review tools.
import {launch,BASE,OUT,stamp,SHOT} from './common.mjs';
import {writeFileSync} from 'node:fs';
import {moveTiming} from '../../dist/moves.js';
import {fighters} from '../../dist/fighters.js';
const id=stamp(),tag=process.env.REVIEW_TAG||'polish',browser=await launch();
const page=await browser.newPage({viewport:{width:1120,height:880}}),errors=[],shots=[];
page.on('pageerror',e=>errors.push(e.message));page.on('console',m=>{if(m.type()==='error')errors.push(m.text());});
try{
 await page.goto(`${BASE}/tala-blender.html?model=graphic&review=${id}`,{timeout:180000});
 await page.waitForFunction(()=>window.talaStudy,null,{timeout:180000});await page.locator('#play').click();
 const timing=moveTiming(fighters[2],'strike');
 const cases=process.env.HANDS_ONLY?[['hands','Idle',0,'#hands'],['hands-guard','Guard + block',.6,'#hands'],['hands-contact','Combo',(12+timing.startup)/60,'#hands']]:process.env.FACE_ONLY?[['face','Idle',0,'#face']]:[
 ['front','Idle',0,'[data-angle="0"]'],['face','Idle',0,'#face'],['back','Idle',0,'[data-angle="3.14"]'],
 ['hands','Idle',0,'#hands'],['advance','Advance',.8,'[data-angle="1.57"]'],['retreat','Retreat',.8,'[data-angle="1.57"]'],['circle','Circle left',.8,'[data-angle="0"]'],['guard','Guard + block',.6,'[data-angle="0"]'],['guard-side','Guard + block',.6,'[data-angle="1.57"]'],
 ...[0,1,2].map(i=>['contact-'+(i+1),'Combo',(12+i*timing.total+timing.startup)/60,'[data-angle="1.57"]'])];
 for(const [name,clip,t,camera] of cases){await page.locator('#clip').selectOption(clip);await page.locator(camera).click();await page.locator('#time').evaluate((el,value)=>{el.value=value;el.dispatchEvent(new Event('input',{bubbles:true}));},t.toFixed(3));await page.evaluate(()=>new Promise(r=>requestAnimationFrame(()=>requestAnimationFrame(r))));const file=`${OUT}/tala-${tag}-${name}-${id}.jpg`;await page.screenshot({path:file,type:'jpeg',quality:86,...SHOT});shots.push({name,clip,time:t,file});console.log('shot',file);}
}catch(error){errors.push(String(error));throw error;}finally{writeFileSync(`${OUT}/tala-${tag}-${id}.json`,JSON.stringify({id,tag,errors,shots},null,2));await browser.close();}
if(errors.length)throw Error(errors.join('\n'));
