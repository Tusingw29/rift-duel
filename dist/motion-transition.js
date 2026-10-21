import {Quaternion} from './vendor/three.module.js';
import {plantSupportFeet} from './rig-pose.js';
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const joints=r=>[r.spine,r.head,...r.limbs,...r.elbows,...r.knees,...(r.feet||[]),...r.clothParts];
// Capture the actual displayed pose, including any cinematic overrides applied
// after the previous animation sample. Never blend fighter/world positions.
export function captureMotion(r){return {body:r.body.position.clone(),joints:joints(r).map(j=>({node:j,q:j.quaternion.clone()}))};}
export function finishMotion(r,p,time,previous){
 const family=r.animationFamily,old=r.motionBridge;
 const dt=Math.max(0,Math.min(.1,old?.time===undefined?0:time-old.time));
 if(!old){r.motionBridge={family,time,entry:null};return;}
 if(old.family!==family){
  old.entry={elapsed:0,body:previous.body.clone().sub(r.body.position),joints:previous.joints.map(({node,q})=>({node,offset:q.multiply(node.quaternion.clone().invert())}))};
 }
 old.family=family;old.time=time;
 const entry=old.entry;if(!entry)return;
 entry.elapsed+=dt;
 const duration=p?.anim==='hurt'?.04:.10;
 let remaining=1-smooth(entry.elapsed/duration);
 // Authored strikes and shared specials must hit their exact contact pose.
 if(p?.move)remaining*=1-smooth(p.move.frame/Math.max(1,p.move.startup));
 // Recovery rolls and tumbling retain their authored root path and floor solve.
 if(p?.roll||p?.launched||['knockdown','defeat'].includes(p?.anim))remaining=0;
 if(remaining<=0){old.entry=null;return;}
 r.body.position.addScaledVector(entry.body,remaining);
 for(const {node,offset} of entry.joints){const correction=new Quaternion().slerp(offset,remaining);node.quaternion.premultiply(correction);}
 // The blend changes hip and knee orientation. Re-solve grounded support feet
 // after it so the transition cannot drag a planted ankle across the floor.
 if(family==='grounded'){
  const kind=p?.move?.kind==='strike'?'strike':p?.guard?'guard':p?.anim==='run'?'run':p?.anim==='charge'?'charge':p?.anim==='hurt'?'hurt':'idle';
  plantSupportFeet(r,p,kind);
 }
}
