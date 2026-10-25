// Simulation-owned X/Z paths. Durations are Rift Duel tuning, not recovered PS1 frame data.
const clamp=(v,a,b)=>Math.max(a,Math.min(b,v));
const ease=t=>t*t*(3-2*t);
export const CIRCLE_FRAMES=24,CROSSOVER_FRAMES=18;
export function lineTravel(a,dx,dz,distance,frames){
 return {kind:'line',frames,frame:0,dx:dx*distance,dz:dz*distance};
}
function point(path,t){
 const u=ease(t);
 if(path.kind==='line')return {x:path.dx*u,z:path.dz*u};
 const angle=path.angle+path.side*Math.PI*u,r=path.radius+(1.6-path.radius)*u;
 return {x:path.cx+Math.cos(angle)*r,z:path.cz+Math.sin(angle)*r};
}
export function orbitTravel(a,b,frames){
 const path={kind:'orbit',frames,frame:0,cx:b.x,cz:b.z,radius:Math.hypot(a.x-b.x,a.z-b.z),angle:Math.atan2(a.z-b.z,a.x-b.x),side:1};
 // Prefer the half-circle with room inside the arena. Targets are committed at takeoff.
 const penalty=side=>{path.side=side;let cost=0;for(let i=1;i<=frames;i++){const p=point(path,i/frames);cost+=Math.abs(p.x-clamp(p.x,-11,11))+Math.abs(p.z-clamp(p.z,-6,6));}return cost;};
 const positive=penalty(1),negative=penalty(-1);path.side=positive<=negative?1:-1;return path;
}
export function advanceTravel(a,path){
 const before=point(path,path.frame/path.frames);
 path.frame=Math.min(path.frames,path.frame+1);
 const after=point(path,path.frame/path.frames);
 // Apply deltas: collision or an interruption must never snap back to a saved world position.
 a.x=clamp(a.x+after.x-before.x,-11,11);a.z=clamp(a.z+after.z-before.z,-6,6);
 return path.frame===path.frames;
}
export function faceOpponent(a,b){
 const d=Math.hypot(b.x-a.x,b.z-a.z)||1;
 a.lookX=(b.x-a.x)/d;a.lookZ=(b.z-a.z)/d;a.face=b.x>=a.x?1:-1;
}
