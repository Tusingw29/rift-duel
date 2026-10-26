import {CHANNELS} from './rig-pose.js';
import {Vector3,Euler,Quaternion} from './vendor/three.module.js';
import * as advance from './clips/import/advance.js';
import * as retreat from './clips/import/retreat.js';
import * as left from './clips/import/left.js';
import * as right from './clips/import/right.js';
import * as getup from './clips/import/getup.js';
// TALA-IMPORT-AB: retargeted motion capture for Tala's combat footwork and get-up, for a controlled comparison with
// the authored animation. Everything is sampled from simulation state — stride phase from distance travelled, the
// get-up from the simulation's getUp frame — so hitstop freezes it and replays are deterministic. The simulation owns
// world position and air height; the clips supply only local motion: pelvis sway around the travel line, spine, arm and
// head motion as deviations around Tala's own stance (her approved fists and guard stay hers), and the feet as paths
// relative to the travel line, which keeps a planted source foot planted in the world without any latching.
// Lengths in the clips are in source leg lengths (thigh+shin) and are rescaled to the rig's own legs here.
export const IMPORT_CLIPS={advance,retreat,left,right,getup};
const FOOTWORK={advance,retreat,left,right};
const CANON={advance:[0,1],retreat:[0,-1],left:[-1,0],right:[1,0]};
// Channels taken as deviations from the clip's cycle mean, added to Tala's stance.
const DEVIATE=['lean','twist','side','hx','hy','hz','neckY','neckZ','lax','lay','laz','rax','ray','raz','le','re','lc','rc'];
const ABSOLUTE_LEGS=['llx','llz','rlx','rlz','lk','rk'];
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const lerp=(a,b,t)=>a+(b-a)*t;
// Catmull-Rom between keys; loops wrap, one-shots clamp. Keys are [u, pose, data].
function catmull(p0,p1,p2,p3,t){const t2=t*t,t3=t2*t;return .5*((2*p1)+(-p0+p2)*t+(2*p0-5*p1+4*p2-p3)*t2+(-p0+3*p1-3*p2+p3)*t3);}
function sample(clip,u,loop){
 const keys=clip.keys,n=keys.length-1;
 u=loop?((u%1)+1)%1:Math.max(0,Math.min(1,u));
 const x=u*n,i=Math.min(n-1,Math.floor(x)),t=x-i;
 const at=k=>loop?keys[((k%n)+n)%n]:keys[Math.max(0,Math.min(n,k))];
 const k0=at(i-1),k1=at(i),k2=at(i+1),k3=at(i+2);
 const pose={};for(const ch of CHANNELS)pose[ch]=catmull(k0[1][ch]??0,k1[1][ch]??0,k2[1][ch]??0,k3[1][ch]??0,t);
 const data={};for(const key of Object.keys(k1[2]))if(Array.isArray(k1[2][key]))data[key]=k1[2][key].map((_,j)=>catmull(k0[2][key][j],k1[2][key][j],k2[2][key][j],k3[2][key][j],t));else data[key]=t<.5?k1[2][key]:k2[2][key];
 return {pose,data};
}
// Per-clip preparation: channel means over the cycle and the rotation that aligns the clip's own travel with the
// canonical combat direction (a captured "advance" drifts a few degrees; the simulation travels straight).
const prepared={};
for(const [name,clip] of Object.entries(FOOTWORK)){
 const keys=clip.keys.slice(0,-1),mean={};for(const ch of CHANNELS)mean[ch]=keys.reduce((s,k)=>s+(k[1][ch]??0),0)/keys.length;
 const [tx,tz]=clip.meta.travel,[cx,cz]=CANON[name],angle=Math.atan2(cx,cz)-Math.atan2(tx,tz);
 prepared[name]={clip,mean,cos:Math.cos(angle),sin:Math.sin(angle),distance:clip.meta.cycleDistance};
}
const rot=(p,[x,z])=>[x*p.cos+z*p.sin,-x*p.sin+z*p.cos]; // rotate a (x right, z forward) vector by the alignment angle
export function footworkClass(forward,side){
 // side > 0 is the fighter's left in the simulation's lock-on frame (see travelMotion); the clips use +x = right.
 if(Math.abs(side)>Math.abs(forward))return side>0?'left':'right';
 return forward<0?'retreat':'advance';
}
const legScale=r=>(r.legLength||.56)+(r.shinLength||r.legLength||.56);
// Authored cadence: one stride cycle per 1.5 units forward and 0.975 units strafing (tala-animation advanceStride with
// strideLength .75), so both modes take the same number of steps over the same distance.
export const cycleUnits=cls=>cls==='left'||cls==='right'?.975:1.5;
// The stride stretch: authored cycle length / the clip's own cycle length at this rig's scale.
export const strideStretch=(cls,scale)=>cycleUnits(cls)/(prepared[cls].distance*scale);
export function importedMovePose(forward,side,phase,stance){
 const cls=footworkClass(forward,side),p=prepared[cls],{pose,data}=sample(p.clip,phase/(Math.PI*2),true);
 const out={...stance};
 for(const ch of DEVIATE)out[ch]=(stance[ch]??0)+pose[ch]-p.mean[ch];
 for(const ch of ABSOLUTE_LEGS)out[ch]=pose[ch];
 out.hipYaw=(stance.hipYaw??0)+pose.hipYaw-p.mean.hipYaw;
 // Pelvis sway around the travel line (lateral, bob, surge), rescaled to the current rig's legs.
 const [sx,sz]=rot(p,[data.sway[0],data.sway[2]]),s=currentScale;
 out.bodyX=(stance.bodyX||0)+sx*s;out.bodyY=(stance.bodyY||0)+data.sway[1]*s;out.bodyZ=(stance.bodyZ||0)+sz*s;
 return out;
}
// The animator registers the rig it is about to pose, so leg-length rescaling uses that rig's proportions.
let currentScale=1.28;
export function setImportRig(r){currentScale=legScale(r);}
// World ankle targets for plantSupportFeet. The foot's offset from the travel line is rotated into the canonical
// direction, its along-travel component stretched by the stride stretch, and placed from the simulation root in the
// fighter's lock-on frame. Because the stretch also amplifies any source pivot or drag (a boxer's planted foot is never
// perfectly still), feet are contact-locked like a production retarget: while the clip says a foot is down its world
// position is held (height still follows the clip, so heel raises survive), and through the swing the gap between the
// held spot and the clip path fades to zero by the next contact.
const local=new Vector3();
// Each foot's mean offset from the travel line over the cycle: the boxer's stance, which must not be stretched.
const footMean={};
for(const [name,p] of Object.entries(prepared)){const keys=p.clip.keys.slice(0,-1),[cx,cz]=CANON[name];
 footMean[name]=['l','r'].map(f=>keys.reduce((m,k)=>{const [x,z]=rot(p,[k[2][f][0],k[2][f][2]]);return m+(x*cx+z*cz)/keys.length;},0));}
// Each foot's ankle height while in contact: the boxer stands on the balls of the feet, so the lowest contact height is
// the floor and anything above it is a heel raise, shown as a foot pitch about the ball rather than a hovering ankle.
const contactBase={};
for(const [name,p] of Object.entries(prepared)){const keys=p.clip.keys;contactBase[name]=['l','r'].map(f=>Math.min(...keys.filter(k=>k[2][f+'c']).map(k=>k[2][f][1]),...keys.map(k=>k[2][f][1])));}
const swingInfo={};
for(const [name,p] of Object.entries(prepared)){const keys=p.clip.keys,n=keys.length-1;
 swingInfo[name]=['lc','rc'].map(c=>keys.map((k,i)=>{if(k[2][c])return 0;let j=i,len=0;while(!keys[(j)%n][2][c]&&len<n){j=(j+1)%n;len++;}return len/n;}));}
function rawTargets(r,cls,u,ankleHeight){
 const pr=prepared[cls],scale=legScale(r),stretch=strideStretch(cls,scale),{data}=sample(pr.clip,u,true),[cx,cz]=CANON[cls],heel=[0,0];
 const targets=['l','r'].map((foot,i)=>{
  // Stretch only the excursion around the foot's own mean stance position: a held source foot still stays still in the
  // world (its offset changes at exactly the stretched travel rate) and the cycle still closes, but the stance keeps its width.
  const a=data[foot],[x,z]=rot(pr,[a[0],a[2]]),along=x*cx+z*cz,px=x-along*cx,pz=z-along*cz,m=footMean[cls][i],g=m+(along-m)*stretch;
  const lift=Math.max(0,a[1]-contactBase[cls][i])*scale;heel[i]=data[foot+'c']?lift:0;
  local.set((px+g*cx)*scale,ankleHeight+(data[foot+'c']?0:lift),(pz+g*cz)*scale);
  return r.g.localToWorld(local.clone());
 });
 return {targets,contacts:[!!data.lc,!!data.rc],stretch,heel};
}
export function importedGaitTargets(r,p,phase,ankleHeight){
 const forward=p.prev?.x??1,side=p.prev?.z||0,cls=footworkClass(forward,side),u=((phase/(Math.PI*2))%1+1)%1;
 r.g.updateMatrixWorld(true);
 const {targets,contacts,stretch,heel}=rawTargets(r,cls,u,ankleHeight);
 let st=r.importLatch;if(!st||st.cls!==cls)st=r.importLatch={cls,feet:[{},{}]};
 const keys=prepared[cls].clip.keys,n=keys.length-1,ki=Math.min(n-1,Math.round(u*n));
 const out=targets.map((t,i)=>{
  const f=st.feet[i];
  if(contacts[i]){
   if(!f.contact||!f.at){f.at=t.clone();}
   f.contact=true;f.offset=null;return new Vector3(f.at.x,t.y,f.at.z);
  }
  if(f.contact&&f.at){f.offset=f.at.clone().sub(t);f.offset.y=0;f.liftU=u;f.span=Math.max(.05,swingInfo[cls][i][ki]||.3);}
  f.contact=false;f.at=null;
  if(!f.offset)return t;
  const progress=(((u-f.liftU)%1)+1)%1,w=1-smooth(progress/f.span);
  return t.clone().addScaledVector(f.offset,w);
 });
 // Shape plantSupportFeet expects when the gait ends (it settles these feet onto the floor), and the planted flags.
 r.talaGait={key:'import:'+cls,feet:out.map(at=>({at:at.clone()}))};
 r.gaitPlants=out.map((t,i)=>contacts[i]?t.clone():null);
 r.importFoot={cls,stretch,contacts,heel};
 return out;
}
// Foot pivot for the import mode: a planted foot's heel raise (from the clip) as a pitch about the ball of the foot,
// so the ball stays on the floor; plantSupportFeet keeps the ball fixed while it turns the foot.
const RIGHT=new Vector3(1,0,0);
export function importedFootPivot(r,player,kind){
 const rotations=[new Quaternion(),new Quaternion()];if(kind!=='run'||!r.importFoot)return rotations;
 const foot=Math.abs(r.footBall?.z||.26);
 r.importFoot.heel.forEach((h,i)=>{if(h>0)rotations[i].setFromAxisAngle(RIGHT,Math.min(.9,Math.atan2(h,foot)));});
 return rotations;
}
// Get-up: the simulation's 28-frame getUp state drives the clip (frame / frames). The source take lasts 3.75 s, so this
// is an ~8x time compression; the first and last 15% blend from the knockdown pose and into Tala's stance.
const P0=new Vector3(),Rq=new Quaternion();
export function importedGetUpPose(r,stance,player,downPose){
 const st=player.getUp,u=st&&Number.isFinite(st.frame)?Math.max(0,Math.min(1,st.frame/(st.frames||28))):Number.isFinite(player.animTime)?1-Math.max(0,Math.min(1,player.animTime/(28/60))):.5;
 const {pose,data}=sample(getup,u,false),out={...stance};
 for(const ch of CHANNELS)if(!['lw','rw','lwx','lwz','rwx','rwz','bodyX','bodyY','bodyZ'].includes(ch))out[ch]=pose[ch];
 // root from the source hips: height above the floor and offset from where they finish standing
 const scale=legScale(r),P=2*(r.legLength||.56)+(r.ankleHeight??.14),hip=data.hip;
 Rq.setFromEuler(new Euler(out.bodyPitch,out.hipYaw,out.bodyRoll,'XYZ'));
 P0.set(0,P,0).applyQuaternion(Rq);
 out.bodyX=hip[0]*scale-P0.x;out.bodyY=hip[1]*scale+(r.ankleHeight??.14)-P0.y;out.bodyZ=hip[2]*scale-P0.z;
 const enter=smooth(u/.15),leave=smooth((u-.85)/.15);
 let res=out;
 if(enter<1&&downPose)res=Object.fromEntries(CHANNELS.map(k=>[k,lerp(downPose[k]??0,res[k]??0,enter)]));
 if(leave>0)res=Object.fromEntries(CHANNELS.map(k=>[k,lerp(res[k]??0,stance[k]??0,leave)]));
 return res;
}
export const importMeta=Object.fromEntries(Object.entries(IMPORT_CLIPS).map(([k,c])=>[k,c.meta]));
