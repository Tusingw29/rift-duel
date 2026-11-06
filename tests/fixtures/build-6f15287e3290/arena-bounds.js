// ARENA-INPUT playtest guess, in world units. Fighter origins cannot leave this disc.
export const ARENA_RADIUS=10;
const rings=new WeakMap(),players=new WeakMap(),slideSide=new WeakMap();
export const arenaFromSearch=(search,movement='')=>{const value=new URLSearchParams(search).get('arena');return value==='rect'?'rect':value==='ring'||movement==='v2'?'ring':'';};
export const ringFromSearch=search=>{const n=Number(new URLSearchParams(search).get('ring'));return [11,12].includes(n)?n:10;};
export const arenaRadius=m=>rings.get(m)||players.get(m)||ARENA_RADIUS;
export function configureArena(m,options={}){if(options.arena==='ring'||options.movement==='v2'&&options.arena!=='rect'){const radius=[11,12].includes(Number(options.ring))?Number(options.ring):ARENA_RADIUS;rings.set(m,radius);for(const p of m.players)players.set(p,radius);}return m;}
export const ringArena=m=>rings.has(m);
export const ringPlayer=p=>players.has(p);
export function boundaryGap(p){return ringPlayer(p)?arenaRadius(p)-Math.hypot(p.x,p.z):Math.min(11-Math.abs(p.x),6-Math.abs(p.z));}
export function constrainPosition(p){if(ringPlayer(p)){const r=Math.hypot(p.x,p.z);if(r>arenaRadius(p)){p.x*=arenaRadius(p)/r;p.z*=arenaRadius(p)/r;}}else{p.x=Math.max(-11,Math.min(11,p.x));p.z=Math.max(-6,Math.min(6,p.z));}}
export function boundsOverflow(p,x,z){return ringPlayer(p)?Math.max(0,Math.hypot(x,z)-arenaRadius(p)):Math.abs(x-Math.max(-11,Math.min(11,x)))+Math.abs(z-Math.max(-6,Math.min(6,z)));}
// Swept disc contact followed by a tangent arc, not independent X/Z clipping.
// Only voluntary motion redirects an exactly head-on outward input to a tangent.
// Forced knockback has no such assist. Side choice persists to avoid edge jitter.
export function moveWithinBounds(p,dx,dz,edgeAssist=false){
 const before={x:p.x,z:p.z},radius=arenaRadius(p);
 if(!ringPlayer(p)){p.x=Math.max(-11,Math.min(11,p.x+dx));p.z=Math.max(-6,Math.min(6,p.z+dz));}
 else{
  constrainPosition(p);const x=p.x,z=p.z,targetX=x+dx,targetZ=z+dz;
  if(Math.hypot(targetX,targetZ)<=radius){p.x=targetX;p.z=targetZ;}
  else{const a=dx*dx+dz*dz;if(a>1e-18){const b=x*dx+z*dz,c=x*x+z*z-radius**2,t=Math.max(0,Math.min(1,(-b+Math.sqrt(Math.max(0,b*b-a*c)))/a));const hx=x+dx*t,hz=z+dz*t,nx=hx/radius,nz=hz/radius;let along=(-nz*dx+nx*dz)*(1-t);
   if(Math.abs(along)>1e-8)slideSide.set(p,Math.sign(along));
   else if(edgeAssist)along=(slideSide.get(p)||1)*Math.sqrt(a)*(1-t);
   const angle=along/radius,co=Math.cos(angle),si=Math.sin(angle);p.x=hx*co-hz*si;p.z=hx*si+hz*co;constrainPosition(p);
  }}
 }
 return {x:p.x-before.x,z:p.z-before.z};
}
