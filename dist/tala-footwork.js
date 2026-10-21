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
 if(kind!=='hurt'){r.recoilStep=null;return offsets;}
 const remaining=Math.max(0,player.animTime||0),old=r.recoilStep;
 if(!old||remaining>old.remaining+1e-5)r.recoilStep={start:remaining,remaining,from:old?.offset?.clone()||new Vector3()};
 const state=r.recoilStep;state.remaining=remaining;
 const elapsed=state.start-remaining,out=Math.min(.12,state.start*.35),back=Math.min(.14,state.start*.4);
 const depart=smooth(elapsed/Math.max(.001,out)),returning=1-smooth(remaining/Math.max(.001,back));
 const liftOut=elapsed<out?Math.sin(Math.PI*elapsed/Math.max(.001,out)):0;
 const liftBack=remaining<back?Math.sin(Math.PI*remaining/Math.max(.001,back)):0;
 offsets[1].set(0,state.from.y*(1-depart)+.055*Math.max(0,liftOut+liftBack),(state.from.z+(-.20-state.from.z)*depart)*(1-returning));state.offset=offsets[1].clone();return offsets;
}
