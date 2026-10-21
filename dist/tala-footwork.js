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
