// Study a motion-capture take dumped by bvh-to-channels.mjs --dump: find events on one signal and
// print the surrounding channels as a table, so key poses can be authored from measurements.
// Usage: node scripts/mocap/study-take.mjs <dump.json> --signal rWrist.z [--valleys] [--peaks 3] [--min 0.5]
//        [--before 40] [--after 48] [--step 4] [--cols hipYaw,shYaw,lean,twist,side,bodyY,lk,rk,llx,rlx,re,raz,rWrist]
//        [--at 120,300] (explicit frame indices instead of detection)
// hipYaw/shYaw are world yaws unwrapped and shown relative to the first printed row (radians).
import {readFileSync} from 'node:fs';
const [file,...rest]=process.argv.slice(2);
const args=Object.fromEntries(rest.map((a,i,all)=>a.startsWith('--')?[a.slice(2),all[i+1]?.startsWith('--')||all[i+1]===undefined?true:all[i+1]]:[]).filter(Boolean));
const dump=JSON.parse(readFileSync(file,'utf8')),F=dump.frames,fps=1/dump.frameTime;
const get=(c,key)=>{const [a,b]=key.split('.');const map={rWrist:'_rWrist',lWrist:'_lWrist',hips:'_hipsWorld',hipYaw:'_hipYawWorld',shYaw:'_shoulderYawWorld',lAnkleY:'_lAnkleY',rAnkleY:'_rAnkleY',lFootZ:'_lFootZ',rFootZ:'_rFootZ'};
 const v=c[map[a]??a];if(v===undefined)return NaN;if(Array.isArray(v))return v[{x:0,y:1,z:2}[b]];return v;};
const signal=F.map(c=>get(c,args.signal||'rWrist.z')*(args.valleys?-1:1));
let events=[];
if(args.at)events=args.at.split(',').map(Number);
else{const min=+(args.min??-Infinity),sep=+(args.sep??60);const cand=[];for(let i=2;i<F.length-2;i++){if(signal[i]>=min&&signal[i]>=signal[i-1]&&signal[i]>=signal[i-2]&&signal[i]>signal[i+1]&&signal[i]>signal[i+2])cand.push(i);}
 cand.sort((a,b)=>signal[b]-signal[a]);for(const i of cand){if(events.every(e=>Math.abs(e-i)>=sep))events.push(i);if(events.length>=+(args.peaks||3))break;}events.sort((a,b)=>a-b);}
const cols=(args.cols||'hipYaw,shYaw,lean,twist,side,bodyY,lk,rk,llx,rlx,le,re,lax,rax,rWrist.z,rWrist.y').split(',');
const unwrap=(v,prev)=>{while(v-prev>Math.PI)v-=2*Math.PI;while(v-prev<-Math.PI)v+=2*Math.PI;return v;};
console.log(`take ${dump.source.split('/').pop()}  ${F.length} frames @${fps.toFixed(0)}fps  signal ${args.signal||'rWrist.z'}${args.valleys?' (valleys)':''}  events ${events.map(e=>e+1).join(',')}`);
for(const e of events){
 const before=+(args.before||40),after=+(args.after||48),step=+(args.step||4);
 console.log(`\n== event at frame ${e+1} (t=${(e/fps).toFixed(2)}s) signal ${(signal[e]*(args.valleys?-1:1)).toFixed(3)}`);
 console.log(['rel','t(s)',...cols].map(s=>s.padStart(7)).join(''));
 const ref={};let prevYaw={};
 for(let i=Math.max(0,e-before);i<=Math.min(F.length-1,e+after);i+=step){
  const c=F[i],row=[];
  for(const k of cols){let v=get(c,k);
   if(k==='hipYaw'||k==='shYaw'){if(prevYaw[k]!==undefined)v=unwrap(v,prevYaw[k]);prevYaw[k]=v;if(ref[k]===undefined)ref[k]=v;v-=ref[k];}
   row.push(Number.isFinite(v)?v.toFixed(2):'-');}
  console.log([String(i-e),((i-e)/fps).toFixed(2),...row].map(s=>s.padStart(7)).join(''));
 }
}
