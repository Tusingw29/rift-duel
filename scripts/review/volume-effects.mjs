import {launch,BASE,OUT,stamp} from './common.mjs';
import {writeFileSync} from 'node:fs';
const browser=await launch(),page=await browser.newPage({viewport:{width:800,height:520}}),id=stamp(),errors=[],shots=[];
page.on('pageerror',e=>errors.push(e.message));
try{
 await page.route('**/volume-review',r=>r.fulfill({contentType:'text/html',body:'<html><meta charset="utf-8"><body style="margin:0;background:#202631"><canvas></canvas><div style="position:absolute;top:12px;left:18px;color:white;font:16px system-ui">RIFT DUEL · ACTUAL 3D EFFECT MESHES<br><small>Capture ring / Beam · Charge / Release burst</small></div></body></html>'}));
 await page.goto(`${BASE}/volume-review`);
 await page.evaluate(async()=>{
  const T=await import('/vendor/three.module.js'),fx=await import('/ink-energy.js'),scene=new T.Scene();scene.background=new T.Color('#202631');
  const renderer=new T.WebGLRenderer({canvas:document.querySelector('canvas'),antialias:true});renderer.setSize(800,520);renderer.setPixelRatio(1);renderer.outputColorSpace=T.SRGBColorSpace;
  const camera=new T.PerspectiveCamera(40,800/520,.1,100);
  const ring=fx.createInkRing(),beam=fx.createInkBeam(),flame=fx.createInkFlame(),burst=fx.createEnergyBurst();ring.position.set(-2,1.5,0);beam.position.set(2.5,1.5,0);beam.rotation.y=Math.PI/2;flame.position.set(-2,-1.5,0);burst.position.set(1.5,-.5,0);
  for(const g of [ring,beam,flame,burst]){g.userData.updateInk(.1,false);scene.add(g);}
  const grid=new T.GridHelper(12,12,0x566474,0x35404c);grid.position.y=-1.65;scene.add(grid);
  window.volumeReview={render(angle){camera.position.set(...angle);camera.lookAt(0,.5,0);renderer.render(scene,camera);}};
 });
 for(const [name,angle] of [['front',[0,1.5,11]],['oblique',[7,3,9]],['side',[-9,2,4]]]){
  await page.evaluate(angle=>window.volumeReview.render(angle),angle);
  const file=`${OUT}/volumes-${name}-${id}.jpg`;await page.screenshot({path:file,type:'jpeg',quality:90,timeout:240000});shots.push(file);console.log(file);
 }
 writeFileSync(`${OUT}/volume-report-${id}.json`,JSON.stringify({shots,errors},null,2));if(errors.length)throw new Error(errors.join('\n'));
}finally{await browser.close();}
