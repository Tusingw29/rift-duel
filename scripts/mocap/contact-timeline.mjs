// Print a foot-contact timeline for a stretch of a dumped take (ball-of-foot contacts, as the segment exporter uses).
// Usage: node scripts/mocap/contact-timeline.mjs <dump.json> a:b [--step 3]
import {readFileSync} from 'node:fs';
const [file,range,...rest]=process.argv.slice(2),[a,b]=range.split(':').map(Number),step=+(rest[rest.indexOf('--step')+1]||3);
const d=JSON.parse(readFileSync(file,'utf8')),F=d.frames,dt=d.frameTime;
const toeY=F.flatMap(f=>[f._lToeW[1],f._rToeW[1]]).sort((x,y)=>x-y),floor=toeY[Math.floor(toeY.length*.02)];
const on=(i,k)=>F[i][k][1]<floor+.05; // height only: a sliding drag stays down
let line='L ',line2='R ',vel='';
for(let i=a;i<=b;i+=step){line+=on(i,'_lToeW')?'█':'·';line2+=on(i,'_rToeW')?'█':'·';}
console.log(`${a}-${b} (${((b-a)*dt).toFixed(2)}s, one char = ${step} frames)\n${line}\n${line2}`);
