const clamp=x=>Math.max(0,Math.min(1,x));
const smooth=x=>{x=clamp(x);return x*x*(3-2*x);};
const mix=(a,b,t)=>a+(b-a)*t;
const point=(x,y,z)=>({x,y,z});
export const finishProfiles={
 aegis:{back:'bridge-suplex'},
 rei:{back:'moon-reap'},
 tala:{back:'cradle-slam',far:'meteor-rush'},
 morrow:{back:'iron-driver',far:'siege-orb'},
 sol:{back:'scissor-flip'},
 vesper:{far:'astral-cuts'}
};
// Original motion direction for the remaining rear and distant captures.
export function captureFinish(profile,t,a,b,actor,victim,effects){
 const dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz)||1,ux=dx/d,uz=dz/d,px=-uz,pz=ux;
 const back=['bridge-suplex','moon-reap','cradle-slam','iron-driver','scissor-flip'].includes(profile);
 if(back){
  const enter=smooth(t/.2),lift=smooth((t-.2)/.25),finish=smooth((t-.5)/.22),arc=Math.sin(finish*Math.PI);
  actor.x=mix(a.x,b.x-ux*.95,enter);actor.z=mix(a.z,b.z-uz*.95,enter);
  victim.yaw=actor.yaw;actor.arm=-1.4;
  if(profile==='bridge-suplex'){
   actor.tilt=-finish*1.3;actor.y=arc*.8;actor.arm=-1.4-lift;
   victim.x=b.x-ux*finish*2.8;victim.z=b.z-uz*finish*2.8;
   victim.y=lift*1.5+arc*1.8;victim.tilt=-finish*Math.PI;
  }else if(profile==='moon-reap'){
   actor.leftLeg=-lift*.8;actor.tilt=finish*.3;
   victim.x=b.x+px*finish*1.6;victim.z=b.z+pz*finish*1.6;
   victim.roll=-finish*1.5;victim.y=arc*.6;actor.arm=-.7-lift*.5;
  }else if(profile==='cradle-slam'){
   actor.arm=-2.6*lift;actor.y=lift*.6*(1-finish);actor.tilt=finish*.4;
   victim.y=lift*3.4*(1-finish)+finish*.3;victim.roll=lift*1.5;
   victim.x=b.x+ux*finish*.8;victim.z=b.z+uz*finish*.8;victim.tilt=finish*.5;
  }else if(profile==='iron-driver'){
   actor.arm=-2*lift;actor.y=lift*1.3*(1-finish);
   victim.x=actor.x+ux*.8;victim.z=actor.z+uz*.8;
   victim.y=lift*(4.4-2.7*finish);victim.tilt=lift*Math.PI;actor.tilt=finish*.2;
  }else{
   actor.y=lift*2.7*(1-finish)+arc;actor.roll=finish*Math.PI*2;
   actor.leftLeg=-1.2*lift;actor.arm=-.8;actor.x+=ux*finish*2;
   actor.z+=uz*finish*2;victim.y=arc*1.7;victim.tilt=finish*Math.PI*.8;
   victim.x=b.x+ux*finish*1.4;victim.z=b.z+uz*finish*1.4;
  }
  effects.rings=smooth((t-.68)/.04)*(1-smooth((t-.84)/.12));effects.center=point(victim.x,.15,victim.z);
  return {shot:profile+(t<.5?'-lift':'-finish'),target:point(b.x-ux*.6,2.5,b.z-uz*.6),position:point(b.x+px*9-ux*2,6,b.z+pz*9-uz*2)};
 }
 if(profile==='meteor-rush'){
  const rush=smooth(t/.25),strikes=clamp((t-.25)/.38),end=smooth((t-.65)/.12);
  actor.x=mix(a.x,b.x-ux*1.25,rush);actor.z=mix(a.z,b.z-uz*1.25,rush);
  const beat=Math.sin(strikes*Math.PI*10);
  actor.arm=-1.2+beat*.6;actor.rightArm=-1.2-beat*.6;actor.tilt=.2;
  victim.tilt=-Math.abs(beat)*.25-end*.7;victim.y=end*1.7;
  effects.rings=strikes>0&&strikes<1?Math.abs(beat)*.6:end*(1-smooth((t-.82)/.15));
  effects.center=point(b.x,1.5+victim.y,b.z);
  return {shot:t<.3?'meteor-approach':'meteor-barrage',target:point(b.x-ux,2.3,b.z-uz),position:point(b.x+px*(t<.3?13:8),5,b.z+pz*(t<.3?13:8))};
 }
 if(profile==='siege-orb'){
  const gather=smooth(t/.3),flight=smooth((t-.35)/.32),impact=smooth((t-.66)/.08);
  actor.arm=-gather*2.8;
  effects.orb={position:point(mix(a.x,b.x,flight),4+Math.sin(flight*Math.PI)*2-flight*2.5,mix(a.z,b.z,flight)),radius:gather*1.5*(1-smooth((t-.7)/.12))};
  effects.rings=impact*(1-smooth((t-.85)/.15));effects.center=point(b.x,.2,b.z);
  victim.y=impact*1.8;victim.tilt=-impact*.9;
  return {shot:t<.35?'siege-gather':'siege-impact',target:point((a.x+b.x)/2,3.2,(a.z+b.z)/2),position:point((a.x+b.x)/2+px*16,7,(a.z+b.z)/2+pz*16)};
 }
 if(profile==='astral-cuts'){
  const cuts=clamp((t-.2)/.5),slice=Math.sin(cuts*Math.PI*3);
  actor.arm=-1.8;victim.y=cuts*.8;victim.tilt=-Math.abs(slice)*.3;
  effects.kind='blade';effects.rings=cuts>0&&cuts<1?.3+Math.abs(slice)*.7:0;
  effects.center=point(b.x,1.6,b.z);
  for(let i=0;i<3;i++){const angle=i*Math.PI*2/3;effects.echoes.push({x:b.x+Math.cos(angle)*1.8,y:.3,z:b.z+Math.sin(angle)*1.8,yaw:angle+Math.PI,opacity:t>.2&&t<.72?.2:0});}
  return {shot:t<.45?'astral-bind':'astral-cut',target:point(b.x,2.2,b.z),position:point(b.x+px*10,5.5,b.z+pz*10)};
 }
 return null;
}
