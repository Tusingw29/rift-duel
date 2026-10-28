import {tap,threat,grabbing,recovering} from './common.mjs';
export const directionalAttacks=[];
export default c=>{
 if(grabbing(c))return {x:-1};
 if(threat(c))return {guard:true};
 if(recovering(c))return c.d<c.self.reach?{attack:tap(c.frame,2)}:{x:1};
 return {x:c.d<c.rival.reach+.2?-1:c.d>c.rival.reach+.65?1:0};
};
