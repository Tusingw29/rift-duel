// Visual trajectories follow simulation time. Air timers remain authoritative
// for combat eligibility; resetting one starts a curve at the current height.
const smooth=u=>u*u*(3-2*u);
export function airHeight(player){return player.airMotion?.height??Math.sin(Math.min(1,(player.air||0)/.85)*Math.PI)*2.5;}
export function advanceAirMotion(player,dt){
 if(!(dt>0))return airHeight(player);
 if(player.bounce){
  const b=player.bounce,u=b.frame/b.frames,height=b.height*Math.sin(Math.PI*u);
  player.airMotion={height,velocity:b.height*Math.PI*Math.cos(Math.PI*u)/(b.frames/60),previousAir:player.air,segment:null};return height;
 }
 const air=Math.max(0,player.air||0);
 const s=player.airMotion??={height:0,velocity:0,previousAir:0,segment:null};
 const expected=Math.max(0,s.previousAir-dt);
 const cue=player.airMotionCue;delete player.airMotionCue;
 const changed=!!cue||Math.abs(air-expected)>1e-5;
 if(cue||changed&&air!==s.previousAir||air>0&&!s.segment){
  const pursuit=air>0&&player.move?.aerial&&s.height<.05;
  const duration=cue?cue.duration:pursuit?Math.max(dt,player.move.startup/60):air>0?air:.12;
  s.segment={from:s.height,velocity:Math.max(-12,Math.min(12,s.velocity)),duration,elapsed:0,target:cue?cue.height:pursuit?2.4:0,arc:!cue&&!pursuit&&s.height<.05&&air>0?2.5:0};
 }
 // A paused cinematic leaves the timer untouched. Its staged pose owns height.
 const frozen=!cue&&air>0&&air===s.previousAir;
 const seg=s.segment;
 if(seg&&!frozen){
  if(!changed)seg.elapsed=Math.min(seg.duration,seg.elapsed+dt);
  const u=seg.elapsed/seg.duration,one=1-u;
  s.height=Math.max(0,seg.target+(seg.from-seg.target)*(1-smooth(u))+seg.velocity*seg.duration*u*one*one+seg.arc*Math.sin(Math.PI*u)**2);
  s.velocity=(-(seg.from-seg.target)*6*u*one+seg.velocity*seg.duration*(1-4*u+3*u*u)+seg.arc*Math.PI*Math.sin(2*Math.PI*u))/seg.duration;
  if(u>=1){s.height=seg.target;s.velocity=0;s.segment=null;}
 }
 s.previousAir=air;return s.height;
}
