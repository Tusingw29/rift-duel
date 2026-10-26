import {update as wallFrame} from '../dist/combat.js';
// Legacy frame-data tests count advancing simulation frames, excluding hitstop.
// Hold the previous input through the pause; new hitstop/buffer tests use raw update.
export function update(m,inputs,dt){
 let limit=20;
 while(m.hitstop>0&&limit-->0)wallFrame(m,m.players.map(p=>({...p.prev})),dt);
 if(m.hitstop>0)throw new Error('Hitstop exceeded the bounded frame budget');
 wallFrame(m,inputs,dt);
}
