// Original, render-only burst direction. Game state and damage remain in combat.js.
export const BURST_DURATIONS={aegis:2.8,rei:2.5,tala:2.6,morrow:2.9,sol:2.8,vesper:2.7};
const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const mix=(a,b,t)=>a+(b-a)*t;
const point=(x,y,z)=>({x,y,z});
export function burstPose(id,c,a,b){
 const t=clamp(c.t/c.duration),dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz)||1,ux=dx/d,uz=dz/d,px=-uz,pz=ux;
 const arc=Math.sin(Math.PI*t),rise=smooth((t-.2)/.25)*(1-smooth((t-.8)/.2));
 const actor={...point(a.x,0,a.z),arm:-1.4,tilt:0,roll:0,yaw:Math.atan2(dx,dz)};
 const victim={...point(b.x,0,b.z),arm:-.5,tilt:0,roll:0,yaw:Math.atan2(-dx,-dz)};
 const effects={kind:id,t,amount:arc,center:point(b.x,1,b.z),echoes:[],rays:[],orb:null,emitter:null,beam:0,rings:0};
 const wideTarget=point((a.x+b.x)/2,2.2,(a.z+b.z)/2);
 let camera={shot:'establish',target:wideTarget,position:point(wideTarget.x+px*2,6,wideTarget.z+14+d*.4)};
 const close=(who,y=2)=>({shot:'portrait',target:point(who.x,y,who.z),position:point(who.x+px*4.8-ux*2,y+1,who.z+pz*4.8-uz*2+4)});
 const returnHome=smooth((t-.82)/.18);
 if(id==='aegis'){
  actor.arm=-.8-smooth(t/.22)*1.8;
  victim.y=rise*1.6;victim.tilt=-rise*.25;
  effects.emitter=point(b.x,8,b.z);
  effects.beam=smooth((t-.48)/.08)*(1-smooth((t-.84)/.16));effects.rings=effects.beam;
  if(t<.25)camera=close(actor);
  else if(t<.48)camera={shot:'orbital',target:point(b.x,6.5,b.z),position:point(b.x+4,12,b.z+6)};
  else camera={shot:'verdict',target:point(b.x,3,b.z),position:point(b.x+px*4,7,b.z+15)};
 }else if(id==='rei'){
  const attack=smooth((t-.2)/.12)*(1-returnHome),angle=(t-.2)*Math.PI*5;
  actor.x=mix(a.x,b.x+Math.cos(angle)*2.2,attack);actor.z=mix(a.z,b.z+Math.sin(angle)*2.2,attack);
  actor.y=rise*.9;actor.yaw=Math.atan2(b.x-actor.x,b.z-actor.z);actor.arm=-1.45;actor.roll=Math.sin(angle)*.15;
  victim.y=rise*2.3;victim.tilt=rise*.25;
  for(let j=0;j<3;j++){const angle=j*Math.PI*2/3+.3;effects.echoes.push({...point(b.x+Math.cos(angle)*2.5,rise*.9,b.z+Math.sin(angle)*2.5),yaw:Math.atan2(-Math.cos(angle),-Math.sin(angle)),opacity:attack*(.15+.15*(1+Math.sin(t*30+j*2))/2)});}
  effects.rings=attack;effects.center.y=1.4+victim.y;
  camera=t<.2?close(actor):{shot:'crossing',target:point(b.x,2.7,b.z),position:point(b.x+5,5.5,b.z+12)};
 }else if(id==='tala'){
  const approach=smooth((t-.12)/.16)*(1-returnHome);
  actor.x=mix(a.x,b.x-ux*1.6,approach);actor.z=mix(a.z,b.z-uz*1.6,approach);
  actor.arm=-1.3-Math.sin(t*45)*.35;actor.tilt=.15*Math.sin(t*30);actor.y=rise*.2;
  victim.y=t<.68?Math.abs(Math.sin(t*40))*rise*.3:Math.sin(clamp((t-.68)/.32)*Math.PI)*3.1;
  const alpha=smooth((t-.2)/.1)*(1-smooth((t-.65)/.08));
  for(let j=0;j<3;j++){const angle=j*Math.PI*2/3+.4;effects.echoes.push({...point(b.x+Math.cos(angle)*1.7,0,b.z+Math.sin(angle)*1.7),yaw:Math.atan2(-Math.cos(angle),-Math.sin(angle)),opacity:alpha*.3});}
  effects.rings=Math.abs(Math.sin(t*40))*alpha;effects.center.y=1.3+victim.y;
  camera=t<.68?{shot:'surround',target:point(b.x,1.8,b.z),position:point(b.x+5,4.4,b.z+10)}:{shot:'rising-palm',target:point(b.x,3,b.z),position:point(b.x+3,3.8,b.z+12)};
 }else if(id==='morrow'){
  actor.arm=t<.28?-2.1:-.8;actor.tilt=.16*arc;
  victim.y=Math.abs(Math.sin(t*38))*rise*.7;victim.tilt=-rise*.4;
  for(let j=0;j<6;j++){
   const flight=clamp((t-.24-j*.025)/.40),side=(j-2.5)*.38;
   effects.rays.push({position:point(mix(a.x+px*side,b.x,flight),1.7+Math.sin(flight*Math.PI)*(3+j*.25),mix(a.z+pz*side,b.z,flight)),progress:flight,visible:t>.24+j*.025&&flight<1});
  }
  effects.rings=smooth((t-.62)/.08)*(1-returnHome);
  camera=t<.25?close(actor):{shot:'salvo',target:point((a.x+b.x)/2,3,(a.z+b.z)/2),position:point((a.x+b.x)/2+4,8,(a.z+b.z)/2+14+d*.2)};
 }else if(id==='sol'){
  const flight=smooth((t-.48)/.3);actor.arm=-.5-arc*1.2;
  effects.orb={position:point(mix(a.x,b.x,flight),mix(5.8,1.2,flight),mix(a.z,b.z,flight)),radius:(.3+smooth(t/.45)*1.2)*(1-smooth((t-.83)/.17))};
  effects.rings=smooth((t-.76)/.07)*(1-returnHome);effects.center.y=.2;
  victim.y=Math.sin(clamp((t-.76)/.24)*Math.PI)*2;victim.tilt=-rise*.2;
  camera=t<.3?{shot:'sun-forge',target:point(a.x,3.2,a.z),position:point(a.x+4,5.5,a.z+13)}:{shot:'sunfall',target:point((a.x+b.x)/2,3,(a.z+b.z)/2),position:point((a.x+b.x)/2+3,7,(a.z+b.z)/2+15+d*.3)};
 }else if(id==='vesper'){
  const side=t<.34?-1:t<.62?1:0,teleport=smooth(t/.12)*(1-returnHome);
  actor.x=mix(a.x,b.x+px*side*2.7-ux*1.5,teleport);actor.z=mix(a.z,b.z+pz*side*2.7-uz*1.5,teleport);
  actor.arm=-1.1;actor.y=arc*.5;actor.yaw=Math.atan2(b.x-actor.x,b.z-actor.z);
  victim.y=rise*2.8;victim.roll=Math.sin(t*7)*rise*.25;effects.rings=rise;effects.center.y=1.1+victim.y;
  camera={shot:t<.34?'apparition':t<.62?'displacement':'collapse',target:point(b.x,3.6,b.z),position:point(b.x+(t<.34?-4:4),5.5,b.z+14)};
 }
 if(b.guard){victim.y=0;victim.tilt=0;victim.roll=0;victim.arm=-1.3;effects.center.y=1.3;}
 // Blend positions home for a clean return to simulation state.
 if(t>.82){for(const [part,original] of [[actor,a],[victim,b]]){part.x=mix(part.x,original.x,returnHome);part.z=mix(part.z,original.z,returnHome);part.y*=1-returnHome;part.tilt*=1-returnHome;part.roll*=1-returnHome;}}
 return {actor,victim,effects,camera,t};
}
