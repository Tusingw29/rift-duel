// Original 60 Hz recovery rules. Directions use the fighter's lock-on basis.
export const GET_UP_FRAMES=28,JUMP_SQUAT_FRAMES=6,BOUNCE_FRAMES=18,BOUNCE_AIR_FRAMES=12,DOWN_HOLD_FRAMES=21;
export const KNOCKDOWN_FRAMES=DOWN_HOLD_FRAMES+GET_UP_FRAMES;
export const ROLL_TIME=.3,ROLL_SAFE=.22,GETUP_TIME=GET_UP_FRAMES/60,GETUP_SAFE=.1,GETUP_CANCEL=.1;
export function recoveryInput(p,rival,input){
 const fresh=(key)=>Math.abs(input[key])>.5&&(Math.abs(p.prev[key])<=.5||Math.sign(input[key])!==Math.sign(p.prev[key]));
 if(p.anim!=='knockdown'||p.stun<=0||p.bounce||p.getUp||p.stun>KNOCKDOWN_FRAMES/60)return null;
 if(fresh('z')||fresh('x')){
  const x=fresh('z')?0:Math.sign(input.x),z=fresh('z')?Math.sign(input.z):0;
  const d=Math.hypot(rival.x-p.x,rival.z-p.z)||1,fx=(rival.x-p.x)/d,fz=(rival.z-p.z)/d;
  p.getUp=null;p.knockdown=null;p.roll={direction:z||x,forward:!!x,dx:x*fx-z*fz,dz:x*fz+z*fx,elapsed:0};
  p.stun=ROLL_TIME;p.cool=ROLL_TIME;p.inv=ROLL_SAFE;p.anim='roll';p.animTime=ROLL_TIME;
  p.move=null;p.buffer=null;return 'RECOVERY ROLL';
 }
 if(input.guard&&!p.prev.guard&&p.stun>GETUP_TIME){
  p.getUp={frame:0,frames:GET_UP_FRAMES,safe:false};p.stun=GETUP_TIME;p.cool=GETUP_TIME;p.inv=GETUP_SAFE;p.anim='getUp';p.animTime=GETUP_TIME;
  p.move=null;p.buffer=null;return 'GUARDED GET-UP';
 }
 return null;
}
export function recoveryText(p){
 if(p.roll)return 'ROLL · protected first 0.22s; vulnerable before standing';
 if(p.anim==='knockdown')return p.stun<=GETUP_CANCEL?'GET UP · tap attack to buffer the wake-up':'DOWN · tap a direction to roll or tap guard to rise';
 if(p.anim==='recover')return 'RECOVERING · wait for control';
 return '';
}
