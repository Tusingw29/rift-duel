import {incomingSoon,recovering} from './common.mjs';
export const directionalAttacks=[];
// Decisions use delayed visible observations and our own input history only.
export default c=>{
 const {memory,frame,rival,d,self}=c;
 if(memory.stepAt!==undefined){const age=frame-memory.stepAt;if(age===1)return {};if(age===2)return {x:-1};if(age<23)return {};delete memory.stepAt;}
 const threat=rival.move&&rival.move.phase!=='recovery'&&['strike','capture','launch'].includes(rival.move.kind)&&d<rival.reach+1;
 if(threat&&frame>=(memory.retryAt||0)){memory.stepAt=frame;memory.retryAt=frame+32;return {x:-1};}
 if(incomingSoon(c))return {guard:true};
 if(recovering(c))return d<self.reach?{attack:!c.previous.attack}:{x:1};
 return d>self.reach-.2?{x:1}:{attack:frame%6===0};
};
