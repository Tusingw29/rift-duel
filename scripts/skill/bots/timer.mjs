import {tap,threat,grabbing,recovering} from './common.mjs';
export const directionalAttacks=[];
export default c=>{
 if(grabbing(c))return {x:-1};
 if(threat(c))return {guard:true};
 if(recovering(c))return c.d<c.self.reach?{attack:tap(c.frame,2)}:{x:1};
 if(c.rival.guard&&c.d<3)return {capture:tap(c.frame,24)};
 return c.d>c.self.reach-.3?{x:1}:{attack:tap(c.frame,12)};
};
