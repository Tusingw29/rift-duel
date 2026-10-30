// Template bot: the SKILL-LAB punisher plus a split-guard grab break (fresh capture tap, guard released).
// Self-contained so it can live outside the repo. Context c = {self, rival, obs, seat, frame, random, memory, d}, all delayed.
const incoming=c=>c.obs.projectiles.some(p=>p.owner!==c.seat&&Math.hypot(p.x-c.self.x,p.z-c.self.z)<9);
const closeThreat=c=>!!c.rival.move&&c.rival.move.phase!=='recovery'&&c.d<c.rival.reach+1;
const grabbing=c=>c.rival.move?.kind==='capture'&&c.rival.move.phase!=='recovery';
export default c=>{
 if(grabbing(c)&&c.d<3.4)return {capture:c.frame%2===0};
 if(incoming(c)||closeThreat(c))return {guard:true};
 if(c.rival.move?.phase==='recovery')return c.d<c.self.reach?{attack:c.frame%2===0}:{x:1};
 return c.d>c.self.reach-.2?{x:1}:{attack:c.frame%6===0};
};
