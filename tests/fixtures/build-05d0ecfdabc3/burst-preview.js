// HORIZON-FIX playtest guesses. Aim is fixed at startup, not retargeted at contact.
export const BURST_V2=Object.freeze({reach:4.5,halfArcDegrees:60,chip:.12});
const enabled=new WeakSet();
export const burstFromSearch=search=>new URLSearchParams(search).get('burst')==='v2'?'v2':'';
export function configureBurst(m,value){if(value==='v2')enabled.add(m);return m;}
export const burstV2=m=>enabled.has(m);
export function burstConnects(a,b,move){const x=b.x-a.x,z=b.z-a.z,d=Math.hypot(x,z),aim=Math.hypot(move.aimX,move.aimZ);return b.inv<=0&&d<=BURST_V2.reach&&(d<1e-9||aim>0&&(x*move.aimX+z*move.aimZ)/(d*aim)>=Math.cos(BURST_V2.halfArcDegrees*Math.PI/180)-1e-12);}
