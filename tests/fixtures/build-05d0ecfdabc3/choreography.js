const clamp=v=>Math.max(0,Math.min(1,v));
const smooth=v=>{v=clamp(v);return v*v*(3-2*v);};
const mix=(a,b,t)=>a+(b-a)*t;
// Original capture blocking: positions are render-only; combat resolves once.
export function capturePose(c,a,b){
 const t=clamp(c.t/c.duration),arc=Math.sin(t*Math.PI),approach=smooth(t/.3)*(1-smooth((t-.78)/.22));
 const dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz)||1,ux=dx/d,uz=dz/d;
 const actor={x:a.x,y:0,z:a.z,tilt:0,arm:-1.4};
 const victim={x:b.x,y:0,z:b.z,tilt:0,arm:-.5};
 switch(c.context){
  case 'back':
   actor.tilt=-arc*.7;actor.arm=-2.5*arc;
   victim.x=mix(b.x,a.x-ux*.9,arc);victim.z=mix(b.z,a.z-uz*.9,arc);
   victim.y=arc*2.6;victim.tilt=-Math.PI*2*smooth(t);break;
  case 'mid':
   actor.x=mix(a.x,b.x-ux*1.3,approach);actor.z=mix(a.z,b.z-uz*1.3,approach);
   actor.arm=-1.8;victim.y=arc*.8;victim.tilt=-arc*.9;break;
  case 'far':
   actor.arm=-.5-arc*2;victim.y=arc*3.4;victim.tilt=Math.sin(t*Math.PI*2)*.4;break;
  default:
   actor.arm=-arc*2;actor.tilt=arc*.3;victim.y=arc*1.8;
   victim.x=b.x+ux*arc*.6;victim.z=b.z+uz*arc*.6;victim.tilt=arc*2.3;
 }
 return {actor,victim,focus:{x:(actor.x+victim.x)/2,y:1.3+victim.y*.35,z:(actor.z+victim.z)/2},span:Math.hypot(actor.x-victim.x,actor.z-victim.z)};
}
