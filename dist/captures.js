import {burstPose} from './cinematics.js';
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const mix=(a,b,t)=>t===1?b:a+(b-a)*t;
const point=(x,y,z)=>({x,y,z});
// Original staged captures. Poses never move the authoritative combat bodies.
export function stagedCapturePose(id,c,a,b){
 if(['orbital','surround'].includes(c.profile))return burstPose(id,c,a,b);
 const t=clamp(c.t/c.duration),dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz)||1,ux=dx/d,uz=dz/d,px=-uz,pz=ux;
 const actor={...point(a.x,0,a.z),arm:-1.4,tilt:0,roll:0,yaw:Math.atan2(dx,dz)};
 const victim={...point(b.x,0,b.z),arm:-.5,tilt:0,roll:0,yaw:Math.atan2(-dx,-dz)};
 const effects={kind:id,t,amount:Math.sin(t*Math.PI),center:point(b.x,1,b.z),echoes:[],rays:[],spirits:[],orb:null,emitter:null,beam:0,rings:0};
 let camera={shot:c.profile+'-wide',target:point((a.x+b.x)/2,2.4,(a.z+b.z)/2),position:point((a.x+b.x)/2+3,6,(a.z+b.z)/2+14+d*.3)};
 const front=['vault-suplex','shoulder-turn','palm-slam','pommel-turn','pivot-toss','blink-shove'].includes(c.profile);
 if(front){
  const enter=smooth(t/.2),throwing=smooth((t-.28)/.38),impact=smooth((t-.64)/.06)*(1-smooth((t-.8)/.15));
  actor.x=mix(a.x,b.x-ux*1.25,enter);actor.z=mix(a.z,b.z-uz*1.25,enter);
  effects.rings=impact;effects.center=point(b.x,.15,b.z);
  camera={shot:c.profile+(t<.48?'-grip':'-impact'),target:point(b.x-ux*.3,2.2,b.z-uz*.3),position:point(b.x+px*7-ux*2,t<.48?4.3:6,b.z+pz*7-uz*2)};
  if(c.profile==='vault-suplex'){
   const arc=Math.sin(throwing*Math.PI);
   actor.tilt=-arc*.8;actor.arm=-1.2-arc*1.4;
   victim.x=b.x-ux*throwing*2.6;victim.z=b.z-uz*throwing*2.6;victim.y=arc*3.2+.4*throwing;
   victim.tilt=-throwing*Math.PI;effects.center=point(victim.x,.15,victim.z);
  }else if(c.profile==='shoulder-turn'){
   actor.yaw+=throwing*Math.PI;actor.tilt=.4*Math.sin(throwing*Math.PI);actor.arm=-2.1;
   const arc=Math.sin(throwing*Math.PI),sweep=throwing*Math.PI;
   victim.x=actor.x+ux*Math.cos(sweep)*1.2+px*Math.sin(sweep)*1.2;victim.z=actor.z+uz*Math.cos(sweep)*1.2+pz*Math.sin(sweep)*1.2;
   victim.y=arc*2.1+.35*throwing;victim.roll=throwing*Math.PI*.65;
   effects.center=point(victim.x,.15,victim.z);
  }else if(c.profile==='palm-slam'){
   const lift=smooth((t-.2)/.22),slam=smooth((t-.52)/.14);
   actor.arm=-1.3-lift*1.3+slam*1.8;actor.tilt=slam*.35;
   victim.y=lift*2.4*(1-slam)+slam*.35;victim.tilt=slam*1.4;
   victim.x=b.x+ux*slam*.8;victim.z=b.z+uz*slam*.8;
  }else if(c.profile==='pommel-turn'){
   const spin=smooth((t-.2)/.25),strike=smooth((t-.48)/.13);
   victim.yaw+=spin*Math.PI*2;victim.tilt=-strike*.9;victim.y=strike*.25;
   victim.x=b.x+ux*strike*1.2;victim.z=b.z+uz*strike*1.2;
   actor.arm=-.7-strike;actor.tilt=strike*.18;
   effects.rings=strike*(1-smooth((t-.7)/.15));effects.center=point(victim.x,1.5,victim.z);
  }else if(c.profile==='pivot-toss'){
   const pivot=smooth((t-.2)/.25),arc=Math.sin(throwing*Math.PI);
   actor.x+=px*pivot*.8;actor.z+=pz*pivot*.8;actor.yaw-=pivot*Math.PI*.65;actor.arm=-1.5;
   victim.x=b.x+px*throwing*2;victim.z=b.z+pz*throwing*2;victim.y=arc*1.8+.35*throwing;
   victim.roll=-throwing*Math.PI*.65;effects.center=point(victim.x,.15,victim.z);
  }else{
   const orbit=Math.floor(clamp((t-.15)/.38)*3)*Math.PI*2/3,shove=smooth((t-.55)/.12);
   actor.x=b.x+Math.cos(orbit)*px*1.5-Math.sin(orbit)*ux*1.5;
   actor.z=b.z+Math.cos(orbit)*pz*1.5-Math.sin(orbit)*uz*1.5;
   actor.yaw=Math.atan2(b.x-actor.x,b.z-actor.z);actor.arm=-1.5-shove*.3;
   for(let i=0;i<3;i++){const angle=orbit-i*.8;effects.echoes.push({x:b.x+Math.cos(angle)*px*1.5-Math.sin(angle)*ux*1.5,y:0,z:b.z+Math.cos(angle)*pz*1.5-Math.sin(angle)*uz*1.5,yaw:actor.yaw,opacity:t>.15&&t<.55?.18:0});}
   victim.x=b.x-px*shove*1.8;victim.z=b.z-pz*shove*1.8;victim.roll=shove*1.3;victim.y=shove*.3;
   effects.center=point(victim.x,.15,victim.z);
  }
 }else if(['blade-extract','spirit-thrust'].includes(c.profile)){
  const approach=smooth(t/.25),thrust=smooth((t-.25)/.12),release=smooth((t-.55)/.18);
  const blade=c.profile==='blade-extract';
  actor.x=mix(a.x,b.x-ux*(blade?1.55:1.25),approach);
  actor.z=mix(a.z,b.z-uz*(blade?1.55:1.25),approach);
  actor.arm=-.5-thrust*1.1;actor.tilt=thrust*.2;
  actor.rightArm=-.15+release*(blade?.4:0);
  if(blade){actor.yaw+=release*1.1;actor.x+=px*release*.6;actor.z+=pz*release*.6;victim.roll=-release*.6;}
  else{actor.x+=ux*thrust*.4;actor.z+=uz*thrust*.4;actor.arm-=thrust*.25;}
  victim.x=b.x+ux*release*(blade?.6:1.4);victim.z=b.z+uz*release*(blade?.6:1.4);
  victim.tilt=-thrust*.3-release*.5;victim.y=release*.3;
  effects.rings=release*(1-smooth((t-.8)/.15));effects.center=point(victim.x,1.4,victim.z);
  camera={shot:c.profile+(t<.5?'-contact':'-release'),target:point(b.x,1.7,b.z),position:point(b.x+px*(t<.5?6:9)-ux*2,4.4,b.z+pz*(t<.5?6:9)-uz*2)};
 }else if(c.profile==='ember-spear'){
  const cast=smooth((t-.18)/.2),travel=smooth((t-.32)/.2),impact=smooth((t-.5)/.12);
  actor.arm=-.5-cast*1.6;
  const tip=point(mix(a.x,b.x,travel),1.5,mix(a.z,b.z,travel));
  effects.spear={from:point(tip.x-ux*2,1.5,tip.z-uz*2),to:tip,visible:t>.2&&t<.7};
  effects.rings=impact*(1-smooth((t-.8)/.15));effects.center=point(b.x,1.4,b.z);
  victim.y=impact*.6;victim.tilt=-impact*.65;
  camera={shot:t<.48?'spear-cast':'spear-impact',target:point((a.x+b.x)/2,1.8,(a.z+b.z)/2),position:point(b.x+px*10,5,b.z+pz*10)};
 }else if(c.profile==='effigy-break'){
  const conjure=smooth(t/.25),blast=smooth((t-.48)/.2);
  actor.arm=-1.6;actor.tilt=blast*.18;
  effects.effigy={position:point(a.x+ux*1.5+ux*blast*2,1.8+conjure*.3+blast,a.z+uz*1.5+uz*blast*2),scale:conjure*(1-smooth((t-.72)/.1)),roll:blast*Math.PI*2};
  effects.rings=blast*(1-smooth((t-.8)/.15));effects.center=point(b.x,1.3,b.z);
  victim.x=b.x+ux*blast*1.8;victim.z=b.z+uz*blast*1.8;victim.y=blast*1.2;victim.tilt=-blast*1.2;
  camera=t<.48?{shot:'effigy-conjure',target:point(a.x+ux,2,a.z+uz),position:point(a.x+px*7-ux*2,4.2,a.z+pz*7-uz*2)}:{shot:'effigy-break',target:point(b.x,2.4,b.z),position:point(b.x+px*10,5,b.z+pz*10)};
 }else if(c.profile==='spirit-flight'){
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
  part.yaw=mix(part.yaw,part===actor?Math.atan2(dx,dz):Math.atan2(-dx,-dz),home);
 }
 return {actor,victim,effects,camera,t};
}
