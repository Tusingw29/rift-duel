import {buildTala} from './tala-model.js';
import {attachTalaConcept} from './tala-concept.js';
import {animateCharacter} from './animation.js';
import {fighters} from './fighters.js';
import {moveTiming} from './moves.js';
const timing=moveTiming(fighters[2],'strike');
export const LIVE_TALA_CLIPS=[{name:'Idle',duration:2.4},{name:'Advance',duration:1.8},{name:'Retreat',duration:1.8},{name:'Circle left',duration:1.8},{name:'Circle right',duration:1.8},{name:'Guard + block',duration:2.4},{name:'Combo',duration:1.6},{name:'Recoil',duration:1.6}];
// This inspection driver supplies scripted player states to the actual live
// animator. It is not a second implementation of the poses or foot solver.
export function createLiveTalaReview(source){
 const rig=buildTala();rig.conceptOriginalSurfaces=[];rig.g.traverse(n=>{if(n.isMesh&&n!==rig.aura)rig.conceptOriginalSurfaces.push(n);});attachTalaConcept(rig,source);rig.aura.visible=false;
 const keys=new Set(Object.keys(rig)),rest=[];rig.g.traverse(n=>{if(n.isBone||n===rig.g)rest.push({node:n,p:n.position.clone(),q:n.quaternion.clone(),s:n.scale.clone()});});
 let selected=null,frame=-1,moves;
 function reset(name){
  for(const key of Object.keys(rig))if(!keys.has(key))delete rig[key];
  for(const {node,p,q,s} of rest){node.position.copy(p);node.quaternion.copy(q);node.scale.copy(s);}
  moves=[1,2,3].map(chain=>({kind:'strike',chain,...timing,frame:0}));selected=name;frame=-1;
 }
 function tick(name,f){
  const t=f/60,p={anim:'idle',x:0,z:0,prev:{x:0,z:0},air:0,guard:false,animTime:0};let facing=0;
  const movement=['Advance','Retreat','Circle left','Circle right'].includes(name);
  if(movement){
   const travel=Math.max(0,Math.min(1.05,t-.25))*3.6,moving=t>=.25&&t<1.3;
   if(name.startsWith('Circle')){const direction=name==='Circle right'?1:-1,angle=direction*travel/3;p.x=3*Math.sin(angle);p.z=3-3*Math.cos(angle);facing=-angle;p.prev={x:0,z:-direction};}
   else{const direction=name==='Advance'?1:-1;p.z=travel*direction;p.prev={x:direction,z:0};}
   p.anim=moving?'run':'idle';
  }
  if(name==='Guard + block'){p.guard=t>=.25&&t<1.65;p.blockStun=t>=.85&&t<1.07?1.07-t:0;}
  if(name==='Recoil'&&t>=.25&&t<.67){p.anim='hurt';p.animTime=.67-t;}
  if(name==='Combo'){
   const attackFrame=f-12,chain=Math.floor(attackFrame/timing.total);
   if(chain>=0&&chain<3){p.move=moves[chain];p.move.frame=attackFrame%timing.total;p.anim='strike';}
  }
  rig.g.position.set(p.x,0,p.z);rig.g.rotation.set(0,facing,p.anim==='hurt'?.15:0);animateCharacter(rig,p,t);rig.g.updateMatrixWorld(true);
 }
 function sample(name,time){
  const clip=LIVE_TALA_CLIPS.find(c=>c.name===name);if(!clip)throw new RangeError(`Unknown live review action: ${name}`);
  const target=Math.round(Math.max(0,Math.min(time,clip.duration))*60);
  if(name!==selected||target<frame)reset(name);
  while(frame<target)tick(name,++frame);
  return {clip:name,time:frame/60,root:rig.g.position.toArray()};
 }
 return {rig,sample};
}
