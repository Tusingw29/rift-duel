// Original stock-special tuning. Every listed hold costs one stock on release.
export const stockSpecials={
 aegis:{
  forward:{name:'Sentinel volley',description:'Toward + hold attack: four aligned beam shots.',type:'beam',count:4,trail:.7,speed:16,damage:4,radius:.35},
  back:{name:'Thunder core',description:'Away + hold attack: a large stunning energy sphere.',type:'snare',count:1,speed:9,damage:20,radius:1.3}
 },
 rei:{
  forward:{name:'Phantom flock',description:'Toward + hold attack: five spreading spirit waves.',type:'crescent',count:5,spread:.11,speed:13,damage:5,radius:.65}
 },
 tala:{
  forward:{name:'Blazing palm',description:'Toward + hold attack: a large close-pressure energy shot.',type:'bolt',count:1,speed:11,damage:20,radius:1.3},
  back:{name:'Giant discus',description:'Away + hold attack: a slow, oversized energy disc.',type:'wheel',count:1,speed:9,damage:19,radius:1.4}
 },
 morrow:{
  forward:{name:'Siege line',description:'Toward + hold attack: three eruptions advance along the ground.',area:1.7,advance:2,pulses:3,interval:8,damage:7}
 },
 sol:{
  back:{name:'Ember fan',description:'Away + hold attack: retreat and release five fire shots.',type:'fire',count:5,spread:.19,speed:14,damage:6,radius:.65}
 },
 vesper:{
  technique:{name:'Astral stream',description:'Up + hold attack: four rings fire in sequence.',type:'wheel',count:1,pulses:4,interval:6,speed:13,damage:5,radius:.8}
 }
};
export function stockTiming(spec){return 1+((spec.pulses||1)-1)*(spec.interval||1);}
