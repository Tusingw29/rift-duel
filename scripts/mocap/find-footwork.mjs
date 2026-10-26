// Find stretches of real combat footwork in motion-capture dumps (bvh-to-channels.mjs --dump).
// A boxer stands bladed, so pelvis facing is not the line to the opponent; the heading here is where the guard hands
// point (pelvis yaw plus the mean hand direction in the body frame, smoothed over half a second). Travel is classified
// against that heading as advance, retreat, or lateral left/right, and sustained stretches are reported with their
// speed, step count and whether the hands stayed up.
// Usage: node scripts/mocap/find-footwork.mjs <dump.json>... [--min .35] [--speed .45] [--top 6]
import {readFileSync} from 'node:fs';
import {basename} from 'node:path';
const argv=process.argv.slice(2),files=argv.filter(a=>a.endsWith('.json'));
const opt=k=>{const i=argv.indexOf('--'+k);return i>=0?+argv[i+1]:undefined;};
const MIN=opt('min')??.35,SPEED=opt('speed')??.45,TOP=opt('top')??6;
const results=[];
for(const file of files){
 const dump=JSON.parse(readFileSync(file,'utf8')),F=dump.frames,dt=dump.frameTime,n=F.length;
 const take=basename(file,'.json');
 // heading from pelvis yaw + hands direction
 const raw=F.map(f=>{const hx=(f._lWrist[0]+f._rWrist[0])/2,hz=(f._lWrist[2]+f._rWrist[2])/2;return f._hipYawWorld-Math.atan2(hx,Math.max(.05,hz));}); // body +x is the subject's right; world yaw grows toward the left
 const unwrap=[raw[0]];for(let i=1;i<n;i++){let v=raw[i];while(v-unwrap[i-1]>Math.PI)v-=2*Math.PI;while(v-unwrap[i-1]<-Math.PI)v+=2*Math.PI;unwrap.push(v);}
 const W=Math.round(.25/dt),heading=unwrap.map((_,i)=>{let s=0,c=0;for(let k=Math.max(0,i-W);k<=Math.min(n-1,i+W);k++){s+=unwrap[k];c++;}return s/c;});
 const V=Math.round(.08/dt),local=[];
 for(let i=0;i<n;i++){const a=F[Math.max(0,i-V)]._hipsWorld,b=F[Math.min(n-1,i+V)]._hipsWorld,span=(Math.min(n-1,i+V)-Math.max(0,i-V))*dt;
  const vx=(b[0]-a[0])/span,vz=(b[2]-a[2])/span,h=heading[i],fx=Math.sin(h),fz=Math.cos(h);
  local.push({fwd:vx*fx+vz*fz,lat:vx*(-fz)+vz*fx});}
 const cls=local.map(v=>{const sp=Math.hypot(v.fwd,v.lat);if(sp<SPEED)return null;if(Math.abs(v.fwd)>=Math.abs(v.lat)*1.4)return v.fwd>0?'advance':'retreat';if(Math.abs(v.lat)>=Math.abs(v.fwd)*1.4)return v.lat>0?'right':'left';return null;});
 // contacts: ankle low and slow
 const contact=foot=>F.map((f,i)=>{const a=f[foot],b=F[Math.min(n-1,i+1)][foot];const sp=Math.hypot(b[0]-a[0],b[2]-a[2])/dt;return a[1]<.32&&sp<.8;});
 const cl=contact('_lAnkleW'),cr=contact('_rAnkleW');
 for(let i=0;i<n;){const c=cls[i];if(!c){i++;continue;}let j=i;while(j+1<n&&cls[j+1]===c)j++;
  const dur=(j-i+1)*dt;if(dur>=MIN){let lifts=0;for(let k=i+1;k<=j;k++){if(cl[k-1]&&!cl[k])lifts++;if(cr[k-1]&&!cr[k])lifts++;}
   const sp=local.slice(i,j+1).reduce((s,v)=>s+Math.hypot(v.fwd,v.lat),0)/(j-i+1);
   const guard=F.slice(i,j+1).reduce((s,f)=>s+((f._lWrist[1]+f._rWrist[1])/2),0)/(j-i+1); // hands height above the pelvis (game units)
   const dist=Math.hypot(F[j]._hipsWorld[0]-F[i]._hipsWorld[0],F[j]._hipsWorld[2]-F[i]._hipsWorld[2]);
   results.push({take,cls:c,start:i,end:j,dur:+dur.toFixed(2),speed:+sp.toFixed(2),dist:+dist.toFixed(2),steps:lifts,guard:+guard.toFixed(2)});}
  i=j+1;}
}
for(const c of ['advance','retreat','left','right']){
 const list=results.filter(r=>r.cls===c).sort((a,b)=>(b.steps>=2)-(a.steps>=2)||b.guard-a.guard||b.dur-a.dur).slice(0,TOP);
 console.log(`\n== ${c} (${results.filter(r=>r.cls===c).length} stretches)`);
 for(const r of list)console.log(`${r.take.padEnd(6)} frames ${String(r.start).padStart(5)}-${String(r.end).padEnd(5)} ${r.dur}s speed ${r.speed} dist ${r.dist} steps ${r.steps} hands ${r.guard}`);
}
