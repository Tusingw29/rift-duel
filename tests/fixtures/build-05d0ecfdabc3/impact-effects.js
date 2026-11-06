import * as T from './vendor/three.module.js';
import {createShockwave,createSignature} from './energy-style.js';
export function createImpactEffects(scene){
 const group=new T.Group();group.name='ground-impact-effects';scene.add(group);
 const entries=Array.from({length:2},()=>{const g=new T.Group(),shock=createShockwave(2),dust=Array.from({length:8},()=>createSignature(3));g.add(shock,...dust);group.add(g);return {g,shock,dust};});
 function reset(){entries.forEach(e=>e.g.visible=false);}
 function update(m,reduced=false){reset();if(!m)return;entries.forEach((e,i)=>{const mark=m.players[i]?.lastGroundBounce;if(!mark)return;const age=m.tick-mark.tick;if(age<0||age>=15)return;e.g.visible=true;e.g.position.set(mark.x,0,mark.z);e.shock.userData.updateInk(age,reduced);e.dust.forEach((s,j)=>{const a=j*Math.PI/4,t=reduced?.25:Math.floor(age/3)/5;s.position.set(Math.cos(a)*(.3+t),.08+Math.sin(t*Math.PI)*.3,Math.sin(a)*(.3+t));s.scale.setScalar(.18*(1-t*.6));s.userData.updateInk(age/60,reduced,1-age/15);});});}
 reset();return {update,reset,group,entries};
}
