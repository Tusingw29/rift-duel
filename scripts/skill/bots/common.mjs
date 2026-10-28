import {grabOptions} from '../../../dist/grab-options.js';
import {neutral} from '../../../dist/combat.js';
import {matchFighter} from '../../../dist/balance-runtime.js';
export function rng(seed){let x=seed>>>0;return ()=>((x=(Math.imul(x,1664525)+1013904223)>>>0)/4294967296);}
// Explicit whitelist: no pending inputs, buffers, queued commands, RNG or future state.
export function visible(m){return {rules:{captureBreak:m.balance?.sys.splitGuard&&!grabOptions(m).fresh?'capture':'guard'},players:m.players.map(p=>({x:p.x,z:p.z,hp:p.hp,stocks:p.stocks,guard:p.guard,air:p.air>0,anim:p.anim,reach:matchFighter(m,p).reach,move:p.move?{kind:p.move.kind,phase:p.move.frame<p.move.startup?'startup':p.move.frame<p.move.startup+p.move.active?'active':'recovery'}:null})),projectiles:m.projectiles.map(p=>({x:p.x,z:p.z,owner:p.owner,dx:p.dx,dz:p.dz}))};}
export function delayedBot(policy,{seed=1,delay=15,seat=0}={}){
 if(!Number.isInteger(delay)||delay<0)throw Error('Reaction delay must be nonnegative whole frames');
 const queue=[],random=rng(seed),attackRandom=rng((seed^0x6a09e667)>>>0),memory={};let frame=0,previous=neutral(),intent=null,grabIntent=null;
 return {get breakIntent(){return intent;},get grabIntent(){return grabIntent;},next(observation){queue.push(observation);const now=frame++;intent=null;grabIntent=null;if(queue.length<=delay)return neutral();const obs=queue.shift(),self=obs.players[seat],rival=obs.players[1-seat];
 const measure={};const decision=policy({self,rival,obs,seat,frame:now,random,attackRandom,measure,memory,previous:{...previous},d:Math.hypot(self.x-rival.x,self.z-rival.z)});
 const {breakIntent,grabAttackIntent,...input}=decision;grabIntent={eligible:!!measure.grabEligible,attempt:!!grabAttackIntent};intent=['reaction','guess'].includes(breakIntent)?{kind:breakIntent,button:input.capture?'capture':'guard'}:null;
 previous={...neutral(),...input};return {...previous};}};
}
export const tap=(frame,period=16)=>frame%period===0;
// Nine-unit detection acts on the delayed visible snapshot, never the current match.
export const incoming=c=>c.obs.projectiles.some(p=>p.owner!==c.seat&&Math.hypot(p.x-c.self.x,p.z-c.self.z)<9);
export const closeThreat=c=>!!c.rival.move&&c.rival.move.phase!=='recovery'&&c.d<c.rival.reach+1;
export const threat=c=>incoming(c)||closeThreat(c);
export const grabbing=c=>c.rival.move?.kind==='capture'&&c.rival.move.phase!=='recovery';
export const recovering=c=>c.rival.move?.phase==='recovery';

// Constant-velocity estimate from the delayed visible projectile trajectory, not hidden future state.
export const incomingSoon=c=>c.obs.projectiles.some(p=>{if(p.owner===c.seat)return false;const x=c.self.x-p.x,z=c.self.z-p.z,v2=p.dx*p.dx+p.dz*p.dz;if(!Number.isFinite(v2)||v2<.001)return Math.hypot(x,z)<1;const t=(x*p.dx+z*p.dz)/v2;return t>=0&&t<.65&&Math.hypot(x-p.dx*t,z-p.dz*t)<1.2;});
