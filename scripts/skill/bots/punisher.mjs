import {incoming,closeThreat,grabbing,recovering} from './common.mjs';
// Adam/Claude's reference, kept as a simple reproducible benchmark at every delay.
export const directionalAttacks=[];
export default c=>{
 if(grabbing(c))return {x:-1};
 if(incoming(c)||closeThreat(c))return {guard:true};
 if(recovering(c))return c.d<c.self.reach?{attack:c.frame%2===0}:{x:1};
 return c.d>c.self.reach-.2?{x:1}:{attack:c.frame%6===0};
};
