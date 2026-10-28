import {neutral} from '../../../dist/combat.js';
import {matchFighter} from '../../../dist/balance-runtime.js';
export function rng(seed){let x=seed>>>0;return ()=>((x=(Math.imul(x,1664525)+1013904223)>>>0)/4294967296);}
// Explicit whitelist: no pending inputs, buffers, queued commands, RNG or future state.
export function visible(m){return {players:m.players.map(p=>({x:p.x,z:p.z,hp:p.hp,stocks:p.stocks,guard:p.guard,air:p.air,anim:p.anim,reach:matchFighter(m,p).reach,move:p.move?{kind:p.move.kind,phase:p.move.frame<p.move.startup?'startup':p.move.frame<p.move.startup+p.move.active?'active':'recovery'}:null})),projectiles:m.projectiles.map(p=>({x:p.x,z:p.z,owner:p.owner}))};}
export function delayedBot(policy,{seed=1,delay=15,seat=0}={}){
 if(!Number.isInteger(delay)||delay<0)throw Error('Reaction delay must be nonnegative whole frames');
 const queue=[],random=rng(seed),memory={};let frame=0;
 return {next(observation){queue.push(observation);const now=frame++;if(queue.length<=delay)return neutral();const obs=queue.shift(),self=obs.players[seat],rival=obs.players[1-seat];return {...neutral(),...policy({self,rival,obs,seat,frame:now,random,memory,d:Math.hypot(self.x-rival.x,self.z-rival.z)})};}};
}
export const tap=(frame,period=16)=>frame%period===0;
export const threat=c=>c.rival.move?.phase!=='recovery'&&!!c.rival.move&&c.d<c.rival.reach+1||c.obs.projectiles.some(p=>p.owner!==c.seat&&Math.hypot(p.x-c.self.x,p.z-c.self.z)<3);
