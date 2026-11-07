// Mixed baseline: approach/space, shots at distance, strikes near, occasional grab.
export default c=>{if(c.self.air||['knockdown','getUp'].includes(c.self.anim))return {};
 if(c.rival.move?.phase==='startup'&&c.d<c.rival.reach+.5)return {guard:true};
 if(c.frame%150===0)return {capture:true};
 if(c.frame%12===0)return {attack:true};return {x:c.d>c.self.reach-.2?1:c.d<c.self.reach-.8?-1:0};};
