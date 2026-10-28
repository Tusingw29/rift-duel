import {tap,threat,grabbing,recovering} from './common.mjs';
export const directionalAttacks=[];
export default c=>{
 if(grabbing(c))return {x:-1};
 if(threat(c))return {guard:true};
 if(recovering(c)&&c.d<c.self.reach)return {attack:tap(c.frame,2)};
 return {guard:true};
};
