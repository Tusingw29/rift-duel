import {tap,incomingSoon,grabbing,recovering} from './common.mjs';
export const directionalAttacks=[];
export default c=>{
 if(incomingSoon(c))return {guard:true};
 if(grabbing(c)||c.rival.move&&!recovering(c))return {x:-1};
 if(recovering(c))return c.d<c.self.reach?{attack:tap(c.frame,2)}:{x:1};
 const target=c.rival.reach+.3;return {x:c.d<target-.1?-1:c.d>target+.1?1:0};
};
