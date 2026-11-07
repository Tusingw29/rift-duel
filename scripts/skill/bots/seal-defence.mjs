// Only the delayed, public warning and reward. No current match or hidden state.
export function sealDefence(c){const {self,rival,obs,memory}=c;if(self.escapeDash)return {};
 if(self.sealEscape?.framesLeft>0)return {x:1,attack:!c.previous.attack};
 const s=obs.seals?.find(s=>s.target===c.seat&&s.status==='closing');if(!s){delete memory.sealSide;return null;}
 if(memory.sealSide?.id!==s.id){const dx=s.x-rival.x,dz=s.z-rival.z,n=Math.hypot(dx,dz)||1;memory.sealSide={id:s.id,x:-dz/n,z:dx/n};}
 const p=memory.sealSide,dx=rival.x-self.x,dz=rival.z-self.z,n=Math.hypot(dx,dz)||1;return {x:p.x*dx/n+p.z*dz/n,z:-p.x*dz/n+p.z*dx/n};}
