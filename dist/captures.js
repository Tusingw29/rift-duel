import {burstPose} from './cinematics.js';
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const mix=(a,b,t)=>a+(b-a)*t;
const point=(x,y,z)=>({x,y,z});
// Original staged captures. Poses never move the authoritative combat bodies.
export function stagedCapturePose(id,c,a,b){
 if(['orbital','surround'].includes(c.profile))return burstPose(id,c,a,b);
 const t=clamp(c.t/c.duration),dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz)||1,ux=dx/d,uz=dz/d,px=-uz,pz=ux;
 const actor={...point(a.x,0,a.z),arm:-1.4,tilt:0,roll:0,yaw:Math.atan2(dx,dz)};
 const victim={...point(b.x,0,b.z),arm:-.5,tilt:0,roll:0,yaw:Math.atan2(-dx,-dz)};
 const effects={kind:id,t,amount:Math.sin(t*Math.PI),center:point(b.x,1,b.z),echoes:[],rays:[],spirits:[],orb:null,emitter:null,beam:0,rings:0};
 let camera={shot:c.profile+'-wide',target:point((a.x+b.x)/2,2.4,(a.z+b.z)/2),position:point((a.x+b.x)/2+3,6,(a.z+b.z)/2+14+d*.3)};
 if(c.profile==='spirit-flight'){
  actor.arm=-1.1-smooth(t/.2);
  for(let i=0;i<3;i++){
   const progress=clamp((t-.2-i*.07)/.4),side=(i-1)*1.3;
   effects.spirits.push({position:point(mix(a.x+px*side,b.x,progress),1.6+Math.sin(progress*Math.PI)*(1+i*.3),mix(a.z+pz*side,b.z,progress)),visible:t>.2+i*.07&&progress<1});
  }
  const impact=smooth((t-.57)/.08)*(1-smooth((t-.83)/.17));
  victim.y=impact*.8;victim.tilt=-impact*.3;effects.rings=impact;effects.center.y=1.4+victim.y;
  if(t>.52)camera={shot:'spirit-arrival',target:point(b.x,2.4,b.z),position:point(b.x+4,5,b.z+12)};
 }else if(c.profile==='iron-scoop'){
  const approach=smooth(t/.24),lift=smooth((t-.24)/.28)*(1-smooth((t-.65)/.18));
  actor.x=mix(a.x,b.x-ux*1.5,approach);actor.z=mix(a.z,b.z-uz*1.5,approach);
  actor.arm=-.6-lift*1.8;actor.tilt=-lift*.2;
  victim.y=lift*3.1;victim.x=b.x+ux*lift*.4;victim.z=b.z+uz*lift*.4;victim.tilt=-lift*1.1;
  effects.rings=smooth((t-.76)/.04)*(1-smooth((t-.86)/.14));effects.center.y=.1;
  camera={shot:t<.5?'iron-lift':'iron-impact',target:point(b.x-ux*.5,2.6,b.z-uz*.5),position:point(b.x+4,5.8,b.z+12)};
 }else if(c.profile==='ember-fall'){
  const fall=smooth((t-.3)/.4),impact=smooth((t-.67)/.06)*(1-smooth((t-.85)/.15));
  actor.arm=-.5-smooth(t/.2)*1.8;
  effects.orb={position:point(b.x,8-6.8*fall,b.z),radius:(.3+smooth(t/.3))*(1-smooth((t-.72)/.12))};
  effects.rings=impact;effects.center.y=.1;victim.y=impact*1.4;victim.tilt=-impact*.45;
  camera=t<.35?{shot:'ember-summon',target:point(b.x,5,b.z),position:point(b.x+5,8,b.z+16)}:{shot:'ember-impact',target:point(b.x,3.4,b.z),position:point(b.x+4,6,b.z+15)};
 }else if(c.profile==='astral-drop'){
  const lift=smooth((t-.15)/.25),drop=smooth((t-.6)/.18);
  actor.x=b.x-ux*1.5;actor.z=b.z-uz*1.5;actor.y=lift*4.2*(1-smooth((t-.68)/.18));actor.arm=-2.1;
  victim.y=lift*4.4*(1-drop);victim.roll=Math.sin(lift*Math.PI)*.35;
  effects.rings=lift*(1-smooth((t-.82)/.18));effects.center.y=1.3+victim.y;
  camera=t<.56?{shot:'astral-ascent',target:point(b.x,4.6,b.z),position:point(b.x+5,7,b.z+17)}:{shot:'astral-descent',target:point(b.x,2.9,b.z),position:point(b.x+3,7,b.z+14)};
 }
 const home=smooth((t-.82)/.18);
 for(const [part,original] of [[actor,a],[victim,b]]){
  part.x=mix(part.x,original.x,home);part.z=mix(part.z,original.z,home);part.y*=1-home;part.tilt*=1-home;part.roll*=1-home;
 }
 return {actor,victim,effects,camera,t};
}
