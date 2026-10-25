import {Vector3} from './vendor/three.module.js';
// Broadside/three-quarter duel framing. Keep the viewing side through crossovers.
export function duelCamera(players,aspect,state={}){
 const [a,b]=players,d=Math.hypot(b.x-a.x,b.z-a.z)||1;
 let dx=(b.x-a.x)/d,dz=(b.z-a.z)/d;
 if(state.dx!==undefined&&dx*state.dx+dz*state.dz<0){dx=-dx;dz=-dz;}
 if(d<1.4&&state.dx!==undefined){dx=state.dx;dz=state.dz;}
 state.dx=dx;state.dz=dz;
 const lift=Math.max(...players.map(p=>p.airMotion?.height||0)),target=new Vector3((a.x+b.x)/2,1.65+lift*.5,(a.z+b.z)/2);
 const back=(9+d*.55)/Math.min(1,aspect/1.4);
 return {target,position:new Vector3(target.x-dz*back-dx*back*.22,4.4+lift*.7+d*.08,target.z+dx*back-dz*back*.22)};
}
export function fitFighters(camera,players,heightOf=p=>p.airMotion?.height||0){
 camera.updateMatrixWorld(true);
 const tanY=Math.tan(camera.fov*Math.PI/360)*.72,tanX=Math.tan(camera.fov*Math.PI/360)*camera.aspect*.76;
 let pullback=0;
 for(const p of players)for(const x of [-.8,.8])for(const z of [-.8,.8])for(const y of [0,3.5]){
  const q=new Vector3(p.x+x,heightOf(p)+y,p.z+z).applyMatrix4(camera.matrixWorldInverse);
  pullback=Math.max(pullback,Math.abs(q.x)/tanX+q.z,Math.abs(q.y)/tanY+q.z);
 }
 if(pullback>0)camera.translateZ(pullback);
 camera.updateMatrixWorld(true);
 return pullback;
}
