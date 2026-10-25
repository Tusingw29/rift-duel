export const defaultOptions={volume:.25,difficulty:'normal',quality:'high',reduced:false,pressureAssist:false,trainingAI:false,trainingBehavior:'idle',showInputs:true,roundSeconds:90,winsNeeded:2,deadzone:.22,music:true,announcer:true,camera:'duel',talaModel:'v3'};
export function normalizeOptions(value={}){
 const v=value&&typeof value==='object'?value:{},out={...defaultOptions};
 for(const [key,allowed] of Object.entries({difficulty:['easy','normal','hard'],quality:['high','low'],roundSeconds:[60,90,120],winsNeeded:[1,2,3],deadzone:[.12,.22,.32],camera:['duel','lock','side'],talaModel:['concept','classic','design02','v3']}))if(allowed.includes(v[key]))out[key]=v[key];
 if(Number.isFinite(v.volume))out.volume=Math.max(0,Math.min(1,v.volume));
 for(const key of ['pressureAssist','reduced','trainingAI','showInputs','music','announcer'])if(typeof v[key]==='boolean')out[key]=v[key];
 if(['idle','guard','combo','cpu'].includes(v.trainingBehavior))out.trainingBehavior=v.trainingBehavior;
 else if(v.trainingAI===true)out.trainingBehavior='cpu';
 return out;
}
export function readPad(pad,deadzone=.22){
 const i={x:0,z:0,attack:false,guard:false,capture:false,launch:false,pursuit:false,super:false};
 if(!pad)return i;
 const b=n=>!!pad.buttons?.[n]?.pressed;
 const axis=n=>{const v=pad.axes?.[n];return Number.isFinite(v)&&Math.abs(v)>deadzone?Math.max(-1,Math.min(1,v)):0;};
 i.x=Number(b(15))-Number(b(14))||axis(0);i.z=Number(b(13))-Number(b(12))||axis(1);
 Object.assign(i,{attack:b(0),guard:b(1),capture:b(2),super:b(3),launch:b(4),pursuit:b(5)});
 return i;
}
