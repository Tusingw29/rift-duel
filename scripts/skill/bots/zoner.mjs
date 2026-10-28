import {tap,threat,grabbing} from './common.mjs';
// Deliberate retreat special while crowded; basic ranged taps are neutral.
export const directionalAttacks=['back'];
export default c=>{
 if(grabbing(c))return {x:-1};
 if(threat(c))return {guard:true};
 if(c.d>4&&c.self.stocks>0&&tap(c.frame,180))return {super:true};
 if(tap(c.frame,20))return c.d<5?{x:-1,attack:true}:{attack:true};
 return {x:c.d<5?-1:c.d>8?1:0};
};
