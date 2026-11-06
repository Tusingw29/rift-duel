// Frames from a ranged capture press to (a) the circle appearing, (b) the thrower acting again, (c) contact with a still target.
import {createMatch,update,neutral} from '../../dist/combat.js';import {fighters} from '../../dist/fighters.js';
const base={movement:'v2',arena:'ring',burst:'v2',step:'linear'};const out=[];
for(let att=0;att<6;att++)for(const d of [4,6,8]){const m=createMatch(att,4,'duel','normal',base),a=m.players[0],b=m.players[1];a.x=-d/2;b.x=d/2;
 for(let t=0;t<3;t++)update(m,[neutral(),neutral()]);let spawn=null,free=null,contact=null;
 for(let f=0;f<140;f++){update(m,[{...neutral(),capture:f===0},neutral()]);if(spawn===null&&m.projectiles.some(p=>p.kind==='capture'))spawn=f+1;
  if(free===null&&f>2&&!a.move&&a.cool<=0&&a.stun<=0)free=f+1;if(contact===null&&m.cinematic)contact=f+1;if(free!==null&&contact!==null)break;}
 out.push(`${fighters[att].id.padEnd(7)} d=${d}: circle f${spawn}, thrower free f${free}, contact f${contact} -> thrower free ${contact-free} frames before contact`);}
console.log(out.join('\n'));
