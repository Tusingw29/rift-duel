import {tap} from './common.mjs';
export default c=>{const {d,self,rival,frame}=c,miss=rival.move?.phase==='recovery';return {x:miss&&d>self.reach-.3?1:d<rival.reach+.2?-1:d>rival.reach+.65?1:0,attack:miss&&tap(frame,6),pursuit:miss&&d>self.reach&&d<5&&tap(frame,30),guard:d<rival.reach&&rival.move?.phase==='active'};};
