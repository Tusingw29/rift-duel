import {CHANNELS,STRIDE,applyPose,plantSupportFeet} from './rig-pose.js';
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export function animateGroundedRig(r,player,time,prefix,targetFor){
 const dt=Math.max(0,Math.min(.1,r[`${prefix}Time`]===undefined?0:time-r[`${prefix}Time`]));r[`${prefix}Time`]=time;
 if(Number.isFinite(player?.x)&&Number.isFinite(player?.z)){
  if(r[`${prefix}Pos`]&&player.anim==='run')r.stridePhase=(r.stridePhase||0)+Math.min(.5,Math.hypot(player.x-r[`${prefix}Pos`][0],player.z-r[`${prefix}Pos`][1]))/STRIDE*Math.PI;
  r[`${prefix}Pos`]=[player.x,player.z];
 }
 const target=targetFor(player,time,player?.stridePhase??r.stridePhase??0);
 if(!target){r[`${prefix}Pose`]=null;r[`${prefix}Entry`]=null;r.footPlants=null;r.gaitPlants=null;return false;}
 const move=player?.move,key=target.kind+(target.kind==='run'?`${Math.sign(player.prev?.x||0)},${Math.sign(player.prev?.z||0)}`:'');
 const old=r[`${prefix}Entry`];
 if(!old||old.key!==key||target.kind==='strike'&&(old.move!==move||move.frame<old.frame))r[`${prefix}Entry`]={key,move,frame:move?.frame,elapsed:0,offset:Object.fromEntries(CHANNELS.map(k=>[k,(r[`${prefix}Pose`]||target.pose)[k]-target.pose[k]]))};
 const entry=r[`${prefix}Entry`];entry.elapsed+=dt;entry.frame=move?.frame;
 const weight=1-smooth(target.kind==='strike'?move.frame/Math.max(1,move.startup):entry.elapsed/(target.kind==='run'?.1:.14));
 r[`${prefix}Pose`]=Object.fromEntries(CHANNELS.map(k=>[k,target.pose[k]+entry.offset[k]*weight]));
 applyPose(r,r[`${prefix}Pose`]);plantSupportFeet(r,player,target.kind);
 // Cloth follows the authored body turn; sampling a frozen time is deterministic.
 for(const cloth of r.clothParts){cloth.rotation.x=.04+Math.sin(time*2)*.035+(target.kind==='run'?.2:0);cloth.rotation.z=-r[`${prefix}Pose`].twist*.13;}
 return true;
}
