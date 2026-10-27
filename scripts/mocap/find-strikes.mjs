// MOCAP-COMBAT: list the strikes in a take dump (bvh-to-channels --dump), so a clip can be cut around one real punch,
// kick or cut. Each event has its effector, a type guess, the wind-up start, the impact (peak extension for punches
// and kicks, peak hand speed for a cut) and the settle frame, plus how far the hips travelled and dropped through it.
// Usage: node scripts/mocap/find-strikes.mjs <dump.json> [--kind punch|kick|cut] [--min .35]
import {readFileSync} from 'node:fs';
const [file,...rest]=process.argv.slice(2);const opt=Object.fromEntries(rest.map((a,i)=>a.startsWith('--')?[a.slice(2),rest[i+1]]:null).filter(Boolean));
const d=JSON.parse(readFileSync(file,'utf8')),F=d.frames,dt=d.frameTime,kind=opt.kind||'punch';
const smooth=(v,w)=>v.map((_,i)=>{let s=0,c=0;for(let k=Math.max(0,i-w);k<=Math.min(v.length-1,i+w);k++){s+=v[k];c++;}return s/c;});
const median=v=>[...v].sort((a,b)=>a-b)[Math.floor(v.length/2)];
const W=Math.round(.02/dt);
// effector signal per frame
const signals={};
if(kind==='punch')for(const h of ['l','r'])signals[h]=smooth(F.map(f=>{const w=f[`_${h}Wrist`];return Math.hypot(w[0],w[2]);}),W);
if(kind==='kick')for(const h of ['l','r'])signals[h]=smooth(F.map(f=>f[`_${h}AnkleW`][1]),W);
if(kind==='cut')for(const h of ['l','r']){const p=F.map(f=>f[`_${h}Wrist`]);signals[h]=smooth(p.map((w,i)=>i?Math.hypot(w[0]-p[i-1][0],w[1]-p[i-1][1],w[2]-p[i-1][2])/dt:0),W*2);}
const min=+(opt.min||(kind==='punch'?.35:kind==='kick'?.45:6));
const events=[];
for(const [h,s] of Object.entries(signals)){
 const base=median(s),gap=Math.round(.25/dt);
 for(let i=gap;i<s.length-gap;i++){
  if(s[i]-base<min)continue;let peak=true;for(let k=i-gap;k<=i+gap;k++)if(s[k]>s[i]){peak=false;break;}if(!peak)continue;
  // wind-up start: the last local minimum within 0.6 s before; settle: the next minimum within 0.8 s after
  let a=i;for(let k=i;k>Math.max(0,i-Math.round(.6/dt));k--){if(s[k]<s[a])a=k;}
  let b=i;for(let k=i;k<Math.min(s.length-1,i+Math.round(.8/dt));k++){if(s[k]<s[b])b=k;}
  const hp=k=>F[k]._hipsWorld,move=Math.hypot(hp(i)[0]-hp(a)[0],hp(i)[2]-hp(a)[2]),drop=Math.min(...F.slice(a,b+1).map(f=>f._hipsWorld[1]))-hp(a)[1];
  // Heading at the wind-up (as the exporter): pelvis yaw minus the guard hands' angle. Signed hip travel toward it,
  // the lead foot, and whether the striking hand or foot is on the lead or rear side.
  const g=F[a],hd=g._hipYawWorld-Math.atan2((g._lWrist[0]+g._rWrist[0])/2,Math.max(.05,(g._lWrist[2]+g._rWrist[2])/2)),fx=Math.sin(hd),fz=Math.cos(hd);
  const fwd=v=>v[0]*fx+v[2]*fz,toward=(hp(i)[0]-hp(a)[0])*fx+(hp(i)[2]-hp(a)[2])*fz,lead=fwd(g._lAnkleW)>fwd(g._rAnkleW)?'l':'r';
  let type=kind;
  if(kind==='punch'){const w0=F[a][`_${h}Wrist`],w1=F[i][`_${h}Wrist`],lat=Math.abs(w1[0]-w0[0]),fwd=Math.abs(w1[2]-w0[2]),up=w1[1]-w0[1];type=up>.35&&up>fwd?'uppercut':lat>fwd*.9?'hook':'straight';}
  if(kind==='kick'){const an=F[i][`_${h}AnkleB`];type=an[2]>.4?'front':Math.abs(an[0])>.5?'side/round':'knee/low';}
  events.push({hand:h,side:h===lead?'lead':'rear',leadFoot:lead,toward:+toward.toFixed(2),type,start:a+1,impact:i+1,end:b+1,windup:+((i-a)*dt).toFixed(3),follow:+((b-i)*dt).toFixed(3),reach:+(s[i]-base).toFixed(2),hipTravel:+move.toFixed(2),hipDrop:+drop.toFixed(2)});
 }
}
events.sort((x,y)=>x.impact-y.impact);
console.log(`${file.split('/').pop()} ${kind}: ${events.length} events (frame time ${dt})`);
for(const e of events)console.log(JSON.stringify(e));
