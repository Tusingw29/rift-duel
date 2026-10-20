// Original alternate special patterns, informed by the PAL move descriptions.
export const specialVariants={
 aegis:{
  forward:{name:'Sustained verdict',description:'Three aligned beam pulses. Later pulses stop if you are interrupted.',type:'beam',count:1,pulses:3,interval:5,speed:18,damage:4,radius:.45},
  back:{name:'Split current',description:'Two separated shots cover sidesteps and leave a gap in the middle.',type:'bolt',count:2,offset:1.1,speed:12,damage:6,radius:.45}
 },
 rei:{
  forward:{name:'Spirit wings',description:'Three crescent shots spread across the arena.',type:'crescent',count:3,spread:.22,speed:12,damage:5,radius:.65},
  back:{name:'Sword fan',description:'Five narrow sword waves cover a wider angle.',type:'crescent',count:5,spread:.16,speed:10,damage:4,radius:.55}
 },
 tala:{
  forward:{name:'Twin spark',description:'Two close energy shots pressure nearby opponents.',type:'bolt',count:2,spread:.12,speed:13,damage:7,radius:.55},
  back:{name:'Crosswind discs',description:'Two separated rings cover either sidestep.',type:'wheel',count:2,offset:1.2,speed:11,damage:7,radius:.65}
 },
 morrow:{
  forward:{name:'Iron eruption',description:'A close radial blast protects your space. It does not travel.',area:3.5,damage:13,active:12},
  back:{name:'Ground salvo',description:'Two low missiles cover sidesteps, leaving the center open.',type:'bolt',count:2,offset:1.3,speed:9,damage:8,radius:.5,low:true}
 },
 sol:{
  forward:{name:'Falling ember',description:'One slow fireball knocks the rival down on a clean hit.',type:'bolt',count:1,speed:6,damage:12,radius:.75,knockdown:true},
  back:{name:'Twin dragons',description:'Two separated fire shots cover either side.',type:'bolt',count:2,offset:1.3,speed:10,damage:6,radius:.6}
 },
 vesper:{
  forward:{name:'Fourfold flame',description:'Four spreading shots trade focused damage for coverage.',type:'bolt',count:4,spread:.18,speed:12,damage:4,radius:.55},
  back:{name:'Astral blast',description:'A fast straight blast replaces the trapping ring.',type:'beam',count:1,speed:16,damage:12,radius:.65}
 }
};
export function canSpecialFollowUp(move){
 return !!move&&['forward','back'].includes(move.kind)&&!move.empowered&&!move.followup&&move.frame<move.startup;
}
export function applySpecialVariant(move,id){
 const special=specialVariants[id][move.kind];
 Object.assign(move,{special,followup:true,name:special.name,active:special.active||1+((special.pulses||1)-1)*(special.interval||1)});
 move.total=move.startup+move.active+move.recovery;
}
export function specialShots(s,a,move,owner,power){
 const shots=[],dx=move.aimX,dz=move.aimZ;
 for(let j=0;j<s.count;j++){
  const centered=j-(s.count-1)/2,angle=Math.atan2(dz,dx)+centered*(s.spread||0),offset=centered*2*(s.offset||0);
  const forward=1-j*(s.trail||0);
  shots.push({x:a.x+dx*forward-dz*offset,z:a.z+dz*forward+dx*offset,dx:Math.cos(angle)*s.speed,dz:Math.sin(angle)*s.speed,life:2.6,owner,damage:s.damage*power,kind:s.type,radius:s.radius,low:!!s.low,knockdown:!!s.knockdown});
 }
 return shots;
}
