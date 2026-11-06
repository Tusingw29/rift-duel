// CPU-V2 playtest guesses (2026-11-06). Opt-in only: ?cpu=v2. Changes CPU decisions, never frame data or damage.
// Runs every frame on top of the existing CPU decision (which still runs on its own clock):
//  - incoming capture circle: one plan per circle, chosen by weight: step off its line, a fresh timed guard
//    (capture break needs guard younger than 0.2 s at contact), or a counter-circle when far enough;
//  - rival grounded strikes/specials near reach: hold guard for that move with a per-difficulty chance;
//  - rival close capture: a timed fresh guard tap with a per-difficulty chance (held guard does not stop it);
//  - rival move in recovery after a whiff, inside reach: punish with attack with a per-difficulty chance.
export const CPU_V2=Object.freeze({
 circlePlan:Object.freeze({easy:{dodge:.25,break:.1,counter:.05},normal:{dodge:.4,break:.25,counter:.15},hard:{dodge:.45,break:.35,counter:.15}}),
 block:Object.freeze({easy:.2,normal:.4,hard:.65}),
 closeBreak:Object.freeze({easy:.05,normal:.2,hard:.35}),
 punish:Object.freeze({easy:.2,normal:.45,hard:.7}),
 breakLeadFrames:6,           // tap guard this many frames before predicted circle contact (window is 12 frames)
 closeBreakLeadFrames:4,      // tap guard this many frames before a close capture's contact frame
 threatFrames:45,             // react to circles predicted to arrive within this many frames
 laneMargin:.35,              // extra lateral room counted as "in the circle's line"
 counterMinDistance:3.1,      // capture circles only exist beyond close-capture range
 blockReachMargin:1.2,
 blockKinds:Object.freeze(['strike','forward','back','technique','launch','pursuit','jumpAttack','shot']),
 punishReachMargin:.4
});
const enabled=new WeakSet(),plans=new WeakMap();
export const cpuFromSearch=search=>new URLSearchParams(search).get('cpu')==='v2'?'v2':'';
export function configureCpu(m,value){if(value==='v2')enabled.add(m);return m;}
export const cpuV2=m=>enabled.has(m);
function circleThreat(m,a,owner){let best=null;
 for(const p of m.projectiles){if(p.kind!=='capture'||p.owner!==owner||p.life<=0)continue;
  const s=Math.hypot(p.dx,p.dz);if(s<1e-9)continue;const rx=a.x-p.x,rz=a.z-p.z,along=(rx*p.dx+rz*p.dz)/s,lateral=Math.abs(rx*p.dz-rz*p.dx)/s,reach=(p.radius||.65)+.5;
  if(along<-reach||lateral>reach+CPU_V2.laneMargin)continue;const frames=Math.max(0,along-reach)/s*60;
  if(frames<=CPU_V2.threatFrames&&(!best||frames<best.frames))best={p,frames};}
 return best;}
const free=a=>!a.move&&a.cool<=0&&a.stun<=0&&a.air<=0&&!a.travel&&!a.roll&&!a.getUp&&!a.step;
const pick=(weights,r)=>{let acc=0;for(const [k,w] of Object.entries(weights)){acc+=w;if(r<acc)return k;}return 'none';};
const plan=(key,make)=>{if(!plans.has(key))plans.set(key,make());return plans.get(key);};
// a = CPU fighter (players[1]), b = rival, base = existing CPU decision, random = the CPU's seeded RNG.
export function cpuV2Overlay(m,a,b,base,random,reach=2.4){
 const diff=['easy','hard'].includes(m.difficulty)?m.difficulty:'normal',i={...base},d=Math.hypot(a.x-b.x,a.z-b.z),owner=m.players.indexOf(b);
 const threat=circleThreat(m,a,owner);
 if(threat){const pl=plan(threat.p,()=>({kind:pick(CPU_V2.circlePlan[diff],random()),side:random()<.5?-1:1}));
  i.attack=false;i.launch=false;i.super=false;i.capture=false;i.guard=false;
  if(pl.kind==='dodge'){i.x=0;i.z=pl.side;}
  else if(pl.kind==='break'){i.x=0;i.z=0;i.guard=threat.frames<=CPU_V2.breakLeadFrames;}
  else if(pl.kind==='counter'){i.x=0;i.z=0;if(!pl.thrown&&free(a)&&d>=CPU_V2.counterMinDistance){i.capture=!a.prev.capture;if(i.capture)pl.thrown=true;}}
  else i.guard=base.guard;
  return i;}
 const mv=b.move;
 if(mv&&mv.kind==='capture'&&d<CPU_V2.counterMinDistance){const pl=plan(mv,()=>({tap:random()<CPU_V2.closeBreak[diff]}));
  if(pl.tap){const left=mv.startup-mv.frame;i.attack=false;i.capture=false;i.guard=left<=CPU_V2.closeBreakLeadFrames&&left>=-1;}
  return i;}
 if(mv&&CPU_V2.blockKinds.includes(mv.kind)&&b.air<=0&&mv.frame<mv.startup+(mv.active||1)&&d<(mv.reach||2.5)+CPU_V2.blockReachMargin){
  const pl=plan(mv,()=>({block:random()<CPU_V2.block[diff]}));
  if(pl.block&&(free(a)||a.guard)){i.guard=true;i.attack=false;i.capture=false;i.launch=false;i.super=false;return i;}}
 if(mv&&mv.frame>=mv.startup+(mv.active||1)&&!mv.connected&&free(a)&&d<reach+CPU_V2.punishReachMargin){
  const pl=plan(mv,()=>({punish:random()<CPU_V2.punish[diff]}));
  if(pl.punish){i.guard=false;i.attack=!a.prev.attack;i.x=0;i.z=0;return i;}}
 return i;}
