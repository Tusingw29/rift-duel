// ARENA-INPUT playtest guess, in world units. Fighter origins cannot leave this disc.
export const ARENA_RADIUS=10;
const rings=new WeakSet(),players=new WeakSet(),slideSide=new WeakMap();
export const arenaFromSearch=(search,movement='')=>{const value=new URLSearchParams(search).get('arena');return value==='rect'?'rect':value==='ring'||movement==='v2'?'ring':'';};
export function configureArena(m,options={}){if(options.arena==='ring'||options.movement==='v2'&&options.arena!=='rect'){rings.add(m);for(const p of m.players)players.add(p);}return m;}
export const ringArena=m=>rings.has(m);
export const ringPlayer=p=>players.has(p);
export function boundaryGap(p){return ringPlayer(p)?ARENA_RADIUS-Math.hypot(p.x,p.z):Math.min(11-Math.abs(p.x),6-Math.abs(p.z));}
export function constrainPosition(p){if(ringPlayer(p)){const r=Math.hypot(p.x,p.z);if(r>ARENA_RADIUS){p.x*=ARENA_RADIUS/r;p.z*=ARENA_RADIUS/r;}}else{p.x=Math.max(-11,Math.min(11,p.x));p.z=Math.max(-6,Math.min(6,p.z));}}
export function boundsOverflow(p,x,z){return ringPlayer(p)?Math.max(0,Math.hypot(x,z)-ARENA_RADIUS):Math.abs(x-Math.max(-11,Math.min(11,x)))+Math.abs(z-Math.max(-6,Math.min(6,z)));}
// Swept disc contact followed by a tangent arc, not independent X/Z clipping.
// Only voluntary motion redirects an exactly head-on outward input to a tangent.
// Forced knockback has no such assist. Side choice persists to avoid edge jitter.
export function moveWithinBounds(p,dx,dz,edgeAssist=false){
 const before={x:p.x,z:p.z};
 if(!ringPlayer(p)){p.x=Math.max(-11,Math.min(11,p.x+dx));p.z=Math.max(-6,Math.min(6,p.z+dz));}
 else{
  constrainPosition(p);const x=p.x,z=p.z,targetX=x+dx,targetZ=z+dz;
  if(Math.hypot(targetX,targetZ)<=ARENA_RADIUS){p.x=targetX;p.z=targetZ;}
  else{const a=dx*dx+dz*dz;if(a>1e-18){const b=x*dx+z*dz,c=x*x+z*z-ARENA_RADIUS**2,t=Math.max(0,Math.min(1,(-b+Math.sqrt(Math.max(0,b*b-a*c)))/a));const hx=x+dx*t,hz=z+dz*t,nx=hx/ARENA_RADIUS,nz=hz/ARENA_RADIUS;let along=(-nz*dx+nx*dz)*(1-t);
   if(Math.abs(along)>1e-8)slideSide.set(p,Math.sign(along));
   else if(edgeAssist)along=(slideSide.get(p)||1)*Math.sqrt(a)*(1-t);
   const angle=along/ARENA_RADIUS,co=Math.cos(angle),si=Math.sin(angle);p.x=hx*co-hz*si;p.z=hx*si+hz*co;constrainPosition(p);
  }}
 }
 return {x:p.x-before.x,z:p.z-before.z};
}
