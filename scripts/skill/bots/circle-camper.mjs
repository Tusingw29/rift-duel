import {tap,grabbing} from './common.mjs';
// RANGED-CAPTURE study bot: holds 5-8 units and throws capture circles; retreats when crowded or grabbed at.
export const directionalAttacks=[];
export default c=>{
 if(grabbing(c)&&c.d<3.5)return {x:-1};
 const free=!c.self.move&&!c.self.air;
 if(free&&c.d>=3.1&&c.d<=9&&tap(c.frame,40))return {capture:true};
 return {x:c.d<5?-1:c.d>8?1:0,z:c.d<5?(tap(c.frame,90)?1:0):0};
};
