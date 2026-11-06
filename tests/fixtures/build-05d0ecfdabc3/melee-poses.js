// Original authored joint poses. Contact remains on the simulation's startup frame.
const pose=(overrides={})=>({rx:-.25,ry:0,rz:-.08,lx:-.3,ly:0,lz:.08,re:-.3,le:-.5,twist:0,lean:0,hip:0,leftLeg:0,rightLeg:0,...overrides});
const rests={
 aegis:pose({rx:0,lx:0,re:-.22,le:-.22}),
 rei:pose({rx:-.18,ry:-.22,lx:0,lz:.15,re:-.22,le:-.22,twist:.12}),
 tala:pose({rx:-.45,lx:-.75,re:-1.3,le:-1.15,twist:-.16}),
 morrow:pose({rx:-.25,lx:-.2,re:-.22,le:-.22}),
 sol:pose({rx:0,lx:-.3,lz:.22,re:-.22,le:-.7}),
 vesper:pose({rx:0,lx:0,rz:-.4,lz:.4,re:-.6,le:-.6})
};
const tracks={
 aegis:[pose({rx:.2,ry:.9,twist:.35,re:-1}),pose({rx:-1.4,ry:-.65,twist:-.45,re:-.1}),pose({rx:-.85,ry:-1,twist:-.6})],
 rei:[pose({rx:-.6,ry:1.1,rz:.4,twist:.5,re:-.7}),pose({rx:-1.15,ry:-.85,rz:.6,twist:-.65,re:-.1}),pose({rx:-.7,ry:-1.25,twist:-.8})],
 tala:[pose({rx:.25,lx:-.7,re:-1.4,le:-1.3,twist:.35}),pose({rx:-1.55,lx:-.8,re:-.05,le:-1.2,twist:-.4,lean:.13}),pose({rx:-1.25,lx:-.8,re:-.35,le:-1.2,twist:-.5})],
 morrow:[pose({rx:-2.45,lx:-1.5,re:-.8,le:-.9,twist:.3,lean:-.1,hip:-.08}),pose({rx:-.85,lx:-.8,re:-.08,le:-.2,twist:-.3,lean:.3,hip:-.08}),pose({rx:-.35,lx:-.45,twist:-.4,lean:.38,hip:-.05})],
 sol:[pose({rx:.3,ry:.7,lx:-.8,twist:.45,re:-.9}),pose({rx:-1.35,ry:-.4,lx:-.6,twist:-.35,re:-.1}),pose({rx:-.8,ry:-.8,lx:-.5,twist:-.45})],
 vesper:[pose({rx:-.5,lx:-.5,rz:-.7,lz:.7,re:-1,le:-1,lean:-.12}),pose({rx:-1.5,lx:-1.5,rz:-.2,lz:.2,re:-.08,le:-.08,lean:.15}),pose({rx:-1.25,lx:-1.25,rz:-.4,lz:.4,lean:.2})]
};
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export function sampleMeleePose(id,move){
 const chain=move.chain||1,rest=rests[id],[wind,contact,follow]=tracks[id].map(p=>({...p}));
 // The second strike reverses a weapon cut; the martial artist switches fists.
 if(chain===2){for(const p of [wind,contact,follow]){p.twist*=-1;p.ry*=-1;if(id==='tala'){[p.rx,p.lx]=[p.lx,p.rx];[p.re,p.le]=[p.le,p.re];}}}
 if(chain===3){contact.lean+=.12;follow.lean+=.12;contact.hip=-.08;wind.hip=-.1;}
 const end=move.startup+(move.active||1)+move.recovery;
 if(move.frame>=end)return rest;
 const points=[[0,rest],[move.startup*.6,wind],[move.startup,contact],[move.startup+(move.active||1)+move.recovery*.28,follow],[end,rest]];
 const frame=Math.max(0,Math.min(end,move.frame));let i=1;while(i<points.length-1&&frame>points[i][0])i++;
 const [a,from]=points[i-1],[b,to]=points[i],t=smooth((frame-a)/(b-a||1));
 return Object.fromEntries(Object.keys(rest).map(k=>[k,from[k]+(to[k]-from[k])*t]));
}
export function applyMeleePose(r,p){
 const s=sampleMeleePose(['aegis','rei','tala','morrow','sol','vesper'][r.id],p.move);
 r.limbs[2].rotation.set(s.rx,s.ry,s.rz);r.limbs[0].rotation.set(s.lx,s.ly,s.lz);
 r.elbows[1].rotation.x=s.re;r.elbows[0].rotation.x=s.le;r.spine.rotation.set(s.lean,s.twist,0);
 r.body.position.y+=s.hip;r.limbs[1].rotation.x=s.leftLeg;r.limbs[3].rotation.x=s.rightLeg;
}
