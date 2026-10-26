import {launch,BASE,OUT,stamp} from './common.mjs';
import {writeFileSync} from 'node:fs';
const browser=await launch(),page=await browser.newPage({viewport:{width:800,height:540}}),id=stamp(),errors=[],captures=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.route('**/frame-budget-review',r=>r.fulfill({contentType:'text/html',body:'<html><body style="margin:0"><canvas id="stage"></canvas></body></html>'}));
 await page.goto(`${BASE}/frame-budget-review`);
 await page.evaluate(async()=>{
  const combat=await import('/combat.js'),{createView}=await import('/render.js'),{canChain}=await import('/moves.js');
  const view=createView(document.querySelector('canvas'),{talaModel:'graphic'});view.quality('low');
  window.review={combat,view,canChain,settings:{camera:'side',cameraZoom:.65,reduced:false},m:null,setup(a,b){this.m=combat.createMatch(a,b,'training');this.m.players[0].x=-1;this.m.players[1].x=1;view.match(this.m);},step(a={},b={}){combat.update(this.m,[{...combat.neutral(),...a},{...combat.neutral(),...b}]);view.render(1/60,this.m,this.settings);},until(predicate,b={}){let cap=240;while(!predicate()&&cap-->0)this.step({},b);if(cap<0)throw new Error('Timing checkpoint was not reached');}};
  review.setup(2,1);
 });
 const loaded=()=>page.waitForFunction(()=>review.view.fighterModels.every(p=>['v3','graphic'].includes(p.status)),null,{timeout:240000});await loaded();
 async function capture(name){const state=await page.evaluate(()=>{const p=review.m.players[0];return {tick:review.m.tick,anim:p.anim,air:p.air,height:p.airMotion?.height,bounce:p.bounce,getUp:p.getUp,move:p.move&&{kind:p.move.kind,chain:p.move.chain,frame:p.move.frame,startup:p.move.startup,active:p.move.active,recovery:p.move.recovery,total:p.move.total}};});const file=`${OUT}/${name}-${id}.jpg`;await page.screenshot({path:file,type:'jpeg',quality:87,timeout:240000});captures.push({name,file,...state});console.log(name,state);}
 await page.evaluate(()=>{const r=review;r.combat.hit(r.m,r.m.players[1],r.m.players[0],8,'hit',true);r.until(()=>r.m.players[0].bounce?.frame===6);});await capture('tala-bounce-apex-06');
 for(const f of [12,17]){await page.evaluate(f=>review.until(()=>review.m.players[0].bounce?.frame===f),f);await capture(`tala-ground-settle-${f}`);}
 for(const f of [0,7,14,21,27]){await page.evaluate(f=>review.until(()=>review.m.players[0].getUp?.frame===f),f);await capture(`tala-rise-${String(f).padStart(2,'0')}`);}
 await page.evaluate(()=>{const r=review;r.step({guard:true});if(r.m.players[0].getUp||!r.m.players[0].guard)throw new Error('Guard handoff failed');r.setup(3,1);});await loaded();
 await page.evaluate(()=>{const r=review;for(let i=0;i<20;i++)r.step({}, {guard:true});for(let chain=1;chain<=3;chain++){r.step({attack:true},{guard:true});r.step({}, {guard:true});if(r.m.players[0].move?.chain!==chain)throw new Error('Chain did not commit');if(chain<3)r.until(()=>r.canChain(r.m.players[0].move),{guard:true});}r.until(()=>r.m.players[0].move.frame===12,{guard:true});});await capture('morrow-cleave-windup-12');
 for(const f of [24,44,62]){await page.evaluate(f=>review.until(()=>review.m.players[0].move.frame===f,{guard:true}),f);await capture(`morrow-cleave-${f}`);}
 await page.evaluate(()=>{review.step({}, {guard:true});if(review.m.players[0].move)throw new Error('Heavy did not finish on frame 63');});
 writeFileSync(`${OUT}/frame-budget-report-${id}.json`,JSON.stringify({captures,errors},null,2));if(errors.length)throw new Error(errors.join('\n'));
}finally{await browser.close();}
