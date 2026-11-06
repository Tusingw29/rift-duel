export const CAPTURE_BASE_RADIUS=.65,CAPTURE_MAX_RADIUS=1.35,CAPTURE_GROWTH=.35;
export function expandCapture(m,owner,input){
 const a=m.players[owner];
 if(!input.attack||a.prev.attack||a.stun>0||a.air>0||a.guard)return false;
 const orb=m.projectiles.find(p=>p.kind==='capture'&&p.owner===owner&&p.life>0&&p.expandable);
 if(!orb)return false;
 orb.targetRadius=Math.min(CAPTURE_MAX_RADIUS,(orb.targetRadius||orb.radius)+CAPTURE_GROWTH);
 orb.expansions=(orb.expansions||0)+1;a.held=0;a.suppressAttackRelease=true;
 return true;
}
export function advanceCapture(p,dt){
 if(p.kind==='capture')p.radius=Math.min(p.targetRadius||p.radius,p.radius+3.5*dt);
}
export function captureClashes(projectiles){
 for(let i=0;i<projectiles.length;i++)for(let j=i+1;j<projectiles.length;j++){
  const a=projectiles[i],b=projectiles[j];
  if(a.life>0&&b.life>0&&a.kind==='capture'&&b.kind==='capture'&&a.owner!==b.owner&&Math.hypot(a.x-b.x,a.z-b.z)<a.radius+b.radius){a.life=0;b.life=0;return true;}
 }
 return false;
}
