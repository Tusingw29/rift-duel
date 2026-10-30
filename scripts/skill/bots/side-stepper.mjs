import {incomingSoon,recovering} from './common.mjs';
export const directionalAttacks=[];
// Same delayed visible inputs as every other policy; never reads match or hidden tracking flags.
export default c=>{
 const {memory,frame,rival,d,self}=c;
 if(memory.sideAt!==undefined){const age=frame-memory.sideAt;if(age===1)return {};if(age===2)return {z:memory.side};if(age<23)return {};delete memory.sideAt;}
 const threat=rival.move?.phase==='startup'&&['strike','capture','launch','technique','forward'].includes(rival.move.kind)&&d<rival.reach+.5;
 if(threat&&frame>=(memory.retryAt||0)){memory.sideAt=frame;memory.retryAt=frame+32;memory.side=(memory.side||1)*-1;return {z:memory.side};}
 if(incomingSoon(c))return {guard:true};
 if(recovering(c))return d<self.reach?{attack:!c.previous.attack}:{x:1};
 return d>self.reach-.2?{x:1}:{attack:frame%6===0};
};
