import {Quaternion,Vector3} from './vendor/three.module.js';
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const up=new Vector3(0,1,0),right=new Vector3(1,0,0);
// Combat-frame driven: frozen hitstop frames retain the exact heel/ankle pose.
export function talaFootPivot(player,kind){
 const rotations=[new Quaternion(),new Quaternion()],move=player?.move;
 if(kind!=='strike'||move?.kind!=='strike')return rotations;
 const contact=move.startup,release=contact+(move.active||1);
 const drive=smooth(move.frame/Math.max(1,contact))*(1-smooth((move.frame-release)/Math.max(1,move.recovery)));
 const left=move.chain===2,driver=left?0:1,sign=left?1:-1;
 rotations[driver].setFromAxisAngle(up,sign*.5*drive).multiply(new Quaternion().setFromAxisAngle(right,.38*drive));
 rotations[1-driver].setFromAxisAngle(up,sign*.12*drive);
 return rotations;
}
// A short rear-foot catch supports recoil while the front foot stays planted.
// Remaining stun time drives entry/return; long stuns hold the caught stance.
export function talaFootOffsets(r,player,kind){
 const offsets=[new Vector3(),new Vector3()];
 if(kind==='run')r.gaitLanding=null;
 if(r.gaitLanding){const remaining=1-smooth(((r.lastTime||0)-r.gaitLanding.start)/.08);offsets.forEach((v,i)=>{v.y=r.gaitLanding.heights[i]*remaining;});if(!remaining)r.gaitLanding=null;}
 if(kind!=='hurt'){r.recoilStep=null;return offsets;}
 const remaining=Math.max(0,player.animTime||0),old=r.recoilStep;
 if(!old||remaining>old.remaining+1e-5)r.recoilStep={start:remaining,remaining,from:old?.offset?.clone()||new Vector3()};
 const state=r.recoilStep;state.remaining=remaining;
 const elapsed=state.start-remaining,out=Math.min(.12,state.start*.35),back=Math.min(.14,state.start*.4);
 const depart=smooth(elapsed/Math.max(.001,out)),returning=1-smooth(remaining/Math.max(.001,back));
 const liftOut=elapsed<out?Math.sin(Math.PI*elapsed/Math.max(.001,out)):0;
 const liftBack=remaining<back?Math.sin(Math.PI*remaining/Math.max(.001,back)):0;
 state.offset=new Vector3(0,state.from.y*(1-depart)+.055*Math.max(0,liftOut+liftBack),(state.from.z+(-.20-state.from.z)*depart)*(1-returning));offsets[1].add(state.offset);return offsets;
}
// Directional step-and-follow gait. Swing starts at the last contact, rather
// than teleporting to the beginning of a precomputed walking arc.
export function talaGaitTargets(r,p,phase,ankleHeight){
 const forward=p.prev?.x??1,side=-(p.prev?.z||0),length=Math.hypot(forward,side)||1;
 const lead=Math.abs(side)>Math.abs(forward)?(side>0?1:0):(forward<0?1:0);
 const key=`${Math.sign(forward)},${Math.sign(side)}`;
 if(!r.talaGait||r.talaGait.key!==key){
  const anchors=[0,1].map(i=>r.footPlants?.[i]?.clone()||r.g.localToWorld(new Vector3(i? .25:-.25,ankleHeight,i?-.24:.24)));
  r.talaGait={key,start:phase,feet:anchors.map(at=>({at,swing:false,from:at.clone()}))};
 }
 const gait=r.talaGait,raw=(phase-gait.start)/(Math.PI*2),q=raw<.5?raw*2:raw+.5;
 const targets=gait.feet.map((foot,i)=>{
  const u=((q+(i===lead?0:.5))%1+1)%1,swing=u<.42;
  if(swing){
   if(!foot.swing)foot.from.copy(foot.at);
   const x=(i? .25:-.25)+side/length*.40;
   const endpoint=r.g.localToWorld(new Vector3(x,ankleHeight,forward/length*.35));
   foot.landing=endpoint.clone();foot.at.copy(foot.from).lerp(endpoint,smooth(u/.42));foot.at.y+=Math.sin(Math.PI*u/.42)*.10*r.g.scale.y;
  }
  foot.landed=!swing&&foot.swing;
  if(foot.landed)foot.at.copy(foot.landing);
  foot.swing=swing;return foot.at.clone();
 });
 const lateral=new Vector3(1,0,0).transformDirection(r.g.matrixWorld),gap=targets[1].clone().sub(targets[0]).dot(lateral),minimum=.20*r.g.scale.x;
 if(gap<minimum){const mover=gait.feet.findIndex(foot=>foot.swing||foot.landed);if(mover>=0){targets[mover].addScaledVector(lateral,(mover?1:-1)*(minimum-gap));gait.feet[mover].at.copy(targets[mover]);}}
 r.gaitPlants=targets.map((target,i)=>gait.feet[i].swing?null:target.clone());return targets;
}
