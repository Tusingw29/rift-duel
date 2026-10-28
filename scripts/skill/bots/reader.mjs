import {tap,threat,grabbing,recovering} from './common.mjs';
export const directionalAttacks=[];
export default c=>{
 const {memory,rival,frame,d,self}=c;memory.history??=[];
 const choice=rival.move?.kind||(rival.guard?'guard':'movement');
 if(choice!==memory.last){memory.history.push(choice);if(memory.history.length>20)memory.history.shift();memory.last=choice;}
 const counts={};for(const x of memory.history)counts[x]=(counts[x]||0)+1;
 const common=Object.keys(counts).sort((a,b)=>counts[b]-counts[a])[0];
 if(grabbing(c))return {x:-1};
 if(threat(c))return {guard:true};
 if(recovering(c))return d<self.reach?{attack:tap(frame,2)}:{x:1};
 if(common==='guard'&&d<3)return {capture:tap(frame,22)};
 if(common==='shot'&&d>3&&tap(frame,60))return {pursuit:true};
 return d>self.reach-.3?{x:1}:{attack:tap(frame,14)};
};
