import {createMatch,update,neutral} from '../../dist/combat.js';import {writeFileSync} from 'node:fs';
const rows=[];
for(const flag of ['', 'close3','close45','inv,close3','inv,close45']){
 const m=createMatch(2,3,'duel','normal',{movement:'v2',arena:'ring',capturewake:flag}),a=m.players[0],b=m.players[1];let resolve=null,ready=null;
 for(let frame=0;frame<1000;frame++){
  const input={...neutral(),capture:frame===0,x:resolve?-1:0};update(m,[input,neutral()]);
  if(!resolve&&b.hp<100)resolve={tick:m.tick,gap:Math.hypot(b.x-a.x,b.z-a.z)};
  if(resolve&&!m.cinematic&&b.air===0&&b.stun===0&&!b.move&&!b.getUp&&!b.knockdown&&!b.bounce&&!b.roll){ready={tick:m.tick,gap:Math.hypot(b.x-a.x,b.z-a.z)};break;}
 }
 if(!resolve||!ready)throw Error('Spacing fixture failed');rows.push({flag,resolve,defenderReady:ready,framesToReady:ready.tick-resolve.tick});
}
writeFileSync('art/review-2026-11-06/capture-loop/spacing-fixture.json',JSON.stringify({definition:'Tala captures neutral Morrow from 8 units, then holds retreat after cinematic damage. No CPU or follow-up attack.',rows},null,2));console.log(rows);
