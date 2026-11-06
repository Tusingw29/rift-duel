// Authored poses sampled with continuous velocity between keys. Endpoints of
// non-looping clips settle; looping clips borrow tangents across the seam.
export function sampleClip(keys,time,channels,loop=false){
 const end=keys.at(-1)[0];
 const t=loop?((time%end)+end)%end:Math.max(0,Math.min(end,time));
 if(!loop&&t>=end)return {...keys.at(-1)[1]};
 let i=0;while(i<keys.length-2&&t>keys[i+1][0])i++;
 const [a,from]=keys[i],[b,to]=keys[i+1],span=b-a,u=(t-a)/span;
 const prev=i?keys[i-1]:loop?[keys.at(-2)[0]-end,keys.at(-2)[1]]:keys[i];
 const next=i+2<keys.length?keys[i+2]:loop?[keys[1][0]+end,keys[1][1]]:keys[i+1];
 return Object.fromEntries(channels.map(k=>{
  // Clips authored before a channel existed read it as 0.
  const m0=(!loop&&i===0)?0:((to[k]||0)-(prev[1][k]||0))/(b-prev[0]);
  const m1=(!loop&&i===keys.length-2)?0:((next[1][k]||0)-(from[k]||0))/(next[0]-a);
  const value=(2*u**3-3*u*u+1)*(from[k]||0)+(u**3-2*u*u+u)*span*m0+(-2*u**3+3*u*u)*(to[k]||0)+(u**3-u*u)*span*m1;
  return [k,value];
 }));
}
