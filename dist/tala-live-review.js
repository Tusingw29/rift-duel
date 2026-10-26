import {locomotionSource} from './locomotion-clips.js';
import {advanceAirMotion} from './air-motion.js';
import {techniqueVariants} from './techniques.js';
import {RETREAT_DISTANCE,retreatProgress} from './retreat-motion.js';
import {buildTala} from './tala-model.js';
import {attachTalaConcept} from './tala-concept.js';
import {animateCharacter} from './animation.js';
import {fighters} from './fighters.js';
import {moveTiming} from './moves.js';
const signatureClips={'Launcher':{kind:'launch'},'Aerial pursuit':{kind:'pursuit',aerial:true},'Rising rush':{kind:'technique'},'Skybreaker kick':{kind:'technique',followup:true},'Storm spark':{kind:'forward'},'Still-water discus':{kind:'back'},'Twin spark':{kind:'forward',followup:true},'Crosswind discs':{kind:'back',followup:true},'Blazing palm':{kind:'forward',empowered:true},'Giant discus':{kind:'back',empowered:true}};
const shotTiming=moveTiming(fighters[2],'shot');
const timings=[1,2,3].map(chain=>moveTiming(fighters[2],'strike',chain));
const comboFrames=timings.reduce((n,t)=>n+t.total,0);
function comboAt(frame){for(let chain=0;chain<3;chain++){if(frame>=0&&frame<timings[chain].total)return {chain,frame};frame-=timings[chain].total;}return null;}
export const LIVE_TALA_CLIPS=[{name:'Idle',duration:2.4},{name:'Jump + land',duration:1.5},{name:'Air recovery',duration:1.3},{name:'Advance',duration:1.8},{name:'Retreat',duration:1.8},{name:'Circle left',duration:1.8},{name:'Circle right',duration:1.8},{name:'Guard + block',duration:2.4},{name:'Combo',duration:(24+comboFrames)/60},{name:'Energy shot',duration:1.3},...Object.keys(signatureClips).map(name=>({name,duration:name==='Aerial pursuit'?1.6:1.4})),{name:'Recoil',duration:1.6},{name:'Knockdown + rise',duration:1.8}];
export const TALA_TRANSITION_CLIPS=['Advance to guard','Advance to combo','Circle to recoil'].map(name=>({name,duration:3}));
// This inspection driver supplies scripted player states to the actual live
// animator. It is not a second implementation of the poses or foot solver.
export function createLiveTalaReview(source,{variant='design02'}={}){
 const rig=buildTala({variant});rig.conceptOriginalSurfaces=[];rig.g.traverse(n=>{if(n.isMesh&&n!==rig.aura)rig.conceptOriginalSurfaces.push(n);});attachTalaConcept(rig,source);rig.aura.visible=false;
 const keys=new Set(Object.keys(rig)),rest=[];rig.g.traverse(n=>{if(n.isBone||n===rig.g)rest.push({node:n,p:n.position.clone(),q:n.quaternion.clone(),s:n.scale.clone()});});
 let selected=null,frame=-1,moves,shot,signature,flight,gait;
 function reset(name){
  flight={air:0};gait=locomotionSource();
  for(const key of Object.keys(rig))if(!keys.has(key))delete rig[key];
  for(const {node,p,q,s} of rest){node.position.copy(p);node.quaternion.copy(q);node.scale.copy(s);}
  const spec=signatureClips[name]||{kind:'forward'};signature={...spec,retreatTravel:spec.kind==='back',chain:1,...moveTiming(fighters[2],spec.kind),frame:0};
  if(spec.aerial){signature.active=19;signature.total=signature.startup+19+signature.recovery;}
  if(spec.kind==='technique'&&spec.followup){Object.assign(signature,techniqueVariants.tala);signature.total=signature.startup+signature.active+signature.recovery;}
  shot={kind:'shot',chain:1,...shotTiming,frame:0};
  moves=[1,2,3].map(chain=>({kind:'strike',chain,...timings[chain-1],frame:0}));selected=name;frame=-1;
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
  if(['Jump + land','Air recovery'].includes(name)&&f>=12){
   p.air=Math.max(0,.85-(f-12)/60);p.anim=p.air>0?'jump':'idle';
   if(name==='Air recovery'&&f>=30){p.air=Math.max(0,.16-(f-30)/60);p.anim=f<45?'recover':'idle';}
  }
  if(name==='Guard + block'){p.guard=t>=.25&&t<1.65;p.blockStun=t>=.85&&t<1.07?1.07-t:0;}
  if(name==='Recoil'&&t>=.25&&t<.67){p.anim='hurt';p.animTime=.67-t;}
  if(name==='Knockdown + rise'&&t>=.2&&t<.75){p.anim='knockdown';p.animTime=.75-t;}
  if(name==='Energy shot'&&f>=12&&f<12+shotTiming.total){p.move=shot;shot.frame=f-12;p.anim='attack';}
  if(signatureClips[name]){
   if(f>=12&&f<12+signature.total){p.move=signature;signature.frame=f-12;p.anim=signature.kind;}
   if(signature.aerial&&f>=12){
    const frame=f-12,start=signature.startup;
    const last=frame>=start+18?start+18:frame>=start+9?start+9:frame>=start?start:0;
    p.air=Math.max(0,(last===start+18?.16:last===0?.45:.4)-(frame-last)/60);p.z=Math.min(frame,start)/start*2;
   }
   if(signature.kind==='technique')p.z=Math.min(signature.active,Math.max(0,f-12-signature.startup+1))*signature.speed/60;
   if(signature.kind==='back')p.z=-RETREAT_DISTANCE*retreatProgress(signature,Math.max(0,f-12));
  }
  if(name==='Combo'){
   const at=comboAt(f-12);
   if(at){p.move=moves[at.chain];p.move.frame=at.frame;p.anim='strike';}
  }
  if(TALA_TRANSITION_CLIPS.some(c=>c.name===name)){
   // Approach for 0.6 s, then interrupt directly: no inserted idle frame.
   const step=Math.max(0,Math.min(36,f-12)),circle=name==='Circle to recoil';
   if(circle){const angle=step*.06/3;p.x=3*Math.sin(angle);p.z=3-3*Math.cos(angle);facing=-angle;p.prev={x:0,z:-1};}
   else {p.z=step*.06;p.prev={x:1,z:0};}
   if(f>=12&&f<48)p.anim='run';
   if(f>=48&&name==='Advance to guard'){p.guard=f<108;p.blockStun=f>=60&&f<72?(72-f)/60:0;}
   if(f>=48&&name==='Advance to combo'){const at=comboAt(f-48);if(at){p.move=moves[at.chain];p.move.frame=at.frame;p.anim='strike';}}
   if(f>=48&&f<73&&circle){p.anim='hurt';p.animTime=(73-f)/60;}
  }
  flight.air=p.air;flight.move=p.move;
  if(signature.aerial&&[12+signature.startup,12+signature.startup+9].includes(f))flight.airMotionCue={height:2.2,duration:.15};rig.g.position.set(p.x,advanceAirMotion(flight,1/60),p.z);p.airMotion=flight.airMotion;rig.g.rotation.set(0,facing,p.anim==='hurt'?.15:0);animateCharacter(rig,p,t);rig.g.updateMatrixWorld(true);
 }
 function sample(name,time){
  const clip=[...LIVE_TALA_CLIPS,...TALA_TRANSITION_CLIPS].find(c=>c.name===name);if(!clip)throw new RangeError(`Unknown live review action: ${name}`);
  const target=Math.round(Math.max(0,Math.min(time,clip.duration))*60);
  if(name!==selected||target<frame||gait!==locomotionSource())reset(name);
  while(frame<target)tick(name,++frame);
  return {clip:name,time:frame/60,root:rig.g.position.toArray()};
 }
 return {rig,sample};
}
