// Full-body authored animation for Tala, the first fighter on the new system.
// Poses are flat channel objects blended toward a target each frame, so idle,
// footwork, strikes, guard and hit reactions flow from the current pose instead
// of snapping back to neutral. Footwork advances with distance travelled, not time.
export const CHANNELS=['bodyY','bodyZ','hipYaw','lean','twist','side','hx','hy','hz','lax','lay','laz','rax','ray','raz','le','re','llx','llz','rlx','rlz','lk','rk'];
const pose=o=>Object.fromEntries(CHANNELS.map(k=>[k,o[k]??0]));
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
const snapOut=t=>{t=Math.max(0,Math.min(1,t));return 1-(1-t)**3;};
export const STRIDE=.78;// metres per step cycle half, tuned to her speed
// Boxer's guard: left foot forward, fists up, chin down.
export const stance=pose({lax:-.8,laz:.12,le:-1.2,rax:-.55,raz:-.14,re:-1.4,twist:-.18,lean:.06,hx:.08,hy:.1,llx:-.18,llz:.1,rlx:.2,rlz:-.12,lk:.28,rk:.22,bodyY:-.03});
export const guard=pose({lax:-1.15,laz:.22,le:-1.95,rax:-1.05,raz:-.22,re:-1.95,twist:-.1,lean:.16,hx:.22,llx:-.22,llz:.22,rlx:.22,rlz:-.22,lk:.42,rk:.4,bodyY:-.1});
export const charge=pose({lax:.25,laz:.45,le:-.6,rax:.25,raz:-.45,re:-.6,lean:-.08,hx:-.18,llx:-.1,llz:.32,rlx:.1,rlz:-.32,lk:.38,rk:.38,bodyY:-.12});
// Impact snap: head whips back, chest arcs, rear foot catches the weight.
export const impact=pose({hx:-.5,hz:.1,lean:-.38,twist:.28,lax:-.35,laz:.65,le:-.5,rax:-.15,raz:-.6,re:-.4,rlx:.6,rlz:-.1,llx:.25,rk:.35,lk:.1,bodyZ:-.22,bodyY:-.05});
// Three-hit combo: right straight, left cross, stepping right hook.
const tracks={
 1:{wind:pose({twist:.38,hipYaw:.14,rax:.3,raz:-.1,re:-1.6,lax:-.85,le:-1.25,lean:-.04,hy:-.1,rlx:.32,rlz:-.12,llx:-.18,llz:.1,lk:.25,rk:.3,bodyY:-.06}),
    strike:pose({twist:-.72,hipYaw:-.26,rax:-1.78,ray:.62,raz:-.12,re:-.03,lax:-.95,laz:.2,le:-1.35,lean:.3,hx:-.06,hy:.36,rlx:.55,rlz:-.08,rk:.1,llx:-.36,llz:.1,lk:.42,bodyZ:.18,bodyY:-.05}),
    follow:pose({twist:-.8,hipYaw:-.28,rax:-1.6,ray:.6,raz:-.15,re:-.25,lax:-.95,laz:.2,le:-1.3,lean:.3,hx:-.04,hy:.4,rlx:.55,rlz:-.08,rk:.1,llx:-.36,llz:.1,lk:.42,bodyZ:.2,bodyY:-.05})},
 2:{wind:pose({twist:-.5,hipYaw:-.16,lax:.25,laz:.1,le:-1.6,rax:-.8,re:-1.3,lean:-.04,hy:.12,llx:-.1,llz:.1,rlx:.25,rlz:-.12,lk:.3,rk:.25,bodyY:-.06}),
    strike:pose({twist:.74,hipYaw:.28,lax:-1.78,lay:-.66,laz:.12,le:-.03,rax:-1,raz:-.2,re:-1.35,lean:.3,hx:-.06,hy:-.38,llx:-.45,llz:.06,lk:.32,rlx:.48,rlz:-.1,rk:.16,bodyZ:.2,bodyY:-.05}),
    follow:pose({twist:.82,hipYaw:.3,lax:-1.6,lay:-.65,laz:.15,le:-.25,rax:-1,raz:-.2,re:-1.3,lean:.3,hy:-.42,llx:-.45,llz:.06,lk:.32,rlx:.48,rlz:-.1,rk:.16,bodyZ:.22,bodyY:-.05})},
 3:{wind:pose({twist:.55,hipYaw:.22,rax:-.45,ray:-.5,raz:-.3,re:-1.85,lax:-.9,le:-1.3,lean:.02,hy:-.2,rlx:.3,rlz:-.14,llx:-.15,llz:.12,lk:.5,rk:.45,bodyY:-.12}),
    strike:pose({twist:-.95,hipYaw:-.36,rax:-1.3,ray:1.15,raz:-.45,re:-.95,lax:-.85,laz:.25,le:-1.3,lean:.26,side:.1,hx:-.1,hy:.5,llx:-.55,llz:.08,lk:.3,rlx:.2,rlz:-.12,rk:.3,bodyZ:.36,bodyY:-.02}),
    follow:pose({twist:-1.05,hipYaw:-.4,rax:-1.15,ray:1.35,raz:-.5,re:-1.05,lax:-.85,laz:.25,le:-1.3,lean:.28,side:.12,hx:-.08,hy:.52,llx:-.55,llz:.08,lk:.3,rlx:.2,rlz:-.12,rk:.3,bodyZ:.4,bodyY:-.02})}
};
const mix=(a,b,t)=>Object.fromEntries(CHANNELS.map(k=>[k,a[k]+(b[k]-a[k])*t]));
// Keyed strike timeline: windup eases in, the hit snaps out, the follow-through
// settles, and the recovery returns to stance under control.
export function strikePose(move){
 const track=tracks[Math.min(3,Math.max(1,move.chain||1))],active=move.active||1,end=move.startup+active+move.recovery;
 const keys=[[0,stance,smooth],[move.startup*.55,track.wind,smooth],[move.startup,track.strike,snapOut],[move.startup+active+move.recovery*.22,track.follow,smooth],[end,stance,smooth]];
 const frame=Math.max(0,Math.min(end,move.frame));if(frame>=end)return stance;
 let i=1;while(i<keys.length-1&&frame>keys[i][0])i++;
 const [a,from]=keys[i-1],[b,to,ease]=keys[i];return mix(from,to,ease((frame-a)/(b-a||1)));
}
// Footwork: phase is distance based so feet plant instead of sliding.
export function movePose(forward,side,phase){
 const strafe=Math.abs(side)>Math.abs(forward),s=Math.sin(phase),c=Math.cos(phase);
 if(strafe){
  const dir=Math.sign(side)||1;
  return pose({...stance,llz:dir*(.18+s*.32),rlz:dir*(.18-s*.32),llx:-.1,rlx:.1,lk:.3+Math.max(0,c)*.5,rk:.3+Math.max(0,-c)*.5,bodyY:-.06+Math.abs(s)*.05,side:dir*.1,lean:.1,lax:-.85,rax:-.6,le:-1.25,re:-1.35});
 }
 const retreat=forward<0,amp=retreat?.38:.62,lift=retreat?.03:.07;
 return pose({...stance,llx:-s*amp,rlx:s*amp,lk:Math.max(0,c)*.95,rk:Math.max(0,-c)*.95,bodyY:-.04+Math.abs(s)*lift,lean:retreat?-.06:.16,hipYaw:s*.08,twist:-.18-s*.12,lax:-.85+s*.1,rax:-.6-s*.1,le:-1.2,re:-1.35,hy:.1});
}
export function idlePose(t){
 const bounce=Math.abs(Math.sin(t*5.2)),shift=Math.sin(t*2.6);
 return pose({...stance,bodyY:-.03+bounce*.045,side:shift*.05,hz:shift*.03,hx:.08+Math.sin(t*5.2)*.02,llz:.1+shift*.03,rlz:-.12+shift*.03,lk:.28+(1-bounce)*.12,rk:.22+(1-bounce)*.1,lax:-.8+Math.sin(t*5.2+1)*.04,rax:-.55+Math.sin(t*5.2+2)*.04});
}
export function hurtPose(animTime){const u=smooth(1-Math.min(1,animTime/.42));return mix(impact,stance,u);}
export function guardPose(blockStun){const recoil=Math.min(1,blockStun/.22);return mix(guard,pose({...guard,lean:-.1,hx:.05,bodyZ:-.14,le:-1.6,re:-1.6,rlx:.4}),recoil);}
// Which states the sample handles; everything else falls back to the shared animator.
export function targetFor(p,t){
 if(!p)return {pose:idlePose(t),rate:8,kind:'idle'};
 const move=p.move;
 if(move?.kind==='strike')return {pose:strikePose(move),rate:34,kind:'strike'};
 if(move||p.air>0||p.roll||['knockdown','defeat','victory','launch','roll','jump','recover','pursuit','jumpAttack'].includes(p.anim))return null;
 if(p.guard)return {pose:guardPose(p.blockStun||0),rate:20,kind:'guard'};
 if(p.anim==='hurt')return {pose:hurtPose(p.animTime||0),rate:p.animTime>.38?Infinity:16,kind:'hurt'};
 if(p.anim==='charge')return {pose:charge,rate:14,kind:'charge'};
 if(p.anim==='run')return {pose:movePose(p.prev?.x??1,p.prev?.z||0,p.stridePhase||0),rate:13,kind:'run'};
 return {pose:idlePose(t),rate:8,kind:'idle'};
}
export function advanceStride(r,p){
 if(!p)return 0;
 if(r.lastPos&&p.anim==='run'){const d=Math.hypot(p.x-r.lastPos[0],p.z-r.lastPos[1]);r.stridePhase=(r.stridePhase||0)+Math.min(d,.5)/STRIDE*Math.PI;}
 else if(p.anim!=='run')r.stridePhase=0;
 r.lastPos=[p.x,p.z];return r.stridePhase||0;
}
export function blendPose(current,target,rate,dt){
 if(!current||rate===Infinity)return {...target};
 const a=1-Math.exp(-rate*dt),head=1-Math.exp(-rate*.55*dt);
 return Object.fromEntries(CHANNELS.map(k=>[k,current[k]+(target[k]-current[k])*(k[0]==='h'&&k.length===2?head:a)]));
}
export function applyPose(r,s){
 // Arms yaw after they swing, so a punch can aim at the target while the chest is turned.
 r.limbs[0].rotation.order='YXZ';r.limbs[2].rotation.order='YXZ';
 r.body.position.y+=s.bodyY;r.body.position.z=s.bodyZ;r.body.rotation.y=s.hipYaw;
 r.spine.rotation.set(s.lean,s.twist,s.side);r.head.rotation.set(s.hx,s.hy,s.hz);
 r.limbs[0].rotation.set(s.lax,s.lay,s.laz);r.limbs[2].rotation.set(s.rax,s.ray,s.raz);r.elbows[0].rotation.x=s.le;r.elbows[1].rotation.x=s.re;
 r.limbs[1].rotation.set(s.llx,0,s.llz);r.limbs[3].rotation.set(s.rlx,0,s.rlz);r.knees[0].rotation.x=s.lk;r.knees[1].rotation.x=s.rk;
}
// Returns true when the sample system handled this frame.
export function animateTala(r,p,time){
 const dt=Math.max(0,Math.min(.1,r.lastTime===undefined?0:time-r.lastTime));r.lastTime=time;
 if(p)advanceStride(r,p);
 const target=targetFor(p,time);
 if(!target){r.pose=null;return false;}
 r.pose=r.pose?blendPose(r.pose,target.pose,target.rate,dt):{...target.pose};
 // Ponytail and head trail the chest turn slightly.
 if(dt>0){const twistVelocity=(r.pose.twist-(r.prevTwist??r.pose.twist))/dt;r.prevTwist=r.pose.twist;r.twistLag=(r.twistLag||0)*.8+twistVelocity*.02;}else r.twistLag=r.twistLag||0;
 applyPose(r,r.pose);
 if(target.kind==='charge')r.body.position.y+=Math.sin(time*30)*.008;
 r.head.rotation.y-=r.twistLag*.6;
 for(let i=0;i<r.clothParts.length;i++){const part=r.clothParts[i];part.rotation.x=Math.sin(time*3+i)*.08+(target.kind==='run'?.2:0);part.rotation.z=Math.sin(time*2.3+i)*.07-r.twistLag*(i===0?1.5:.6);}
 return true;
}
