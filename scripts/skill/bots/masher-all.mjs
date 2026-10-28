// Random simultaneous buttons at 15Hz, released between taps; no opponent reads.
// Burst is the combat input named super. Held guard can suppress other actions, as for a human.
export default ({frame,random,memory})=>{
 if(frame%4===0||!memory.all){memory.all={x:Math.floor(random()*3)-1,z:Math.floor(random()*3)-1};for(const k of ['attack','guard','capture','launch','pursuit','super'])memory.all[k]=random()<.35;}
 return {...memory.all,...(frame%4>=2?{attack:false,guard:false,capture:false,launch:false,pursuit:false,super:false}:{})};
};
