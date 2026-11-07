// REVERSAL-AIR playtest guesses: launch recovery lockouts, in simulation frames.
export const AIRLOCK_GUESSES=Object.freeze([12,20]);
const locks=new WeakMap();
export function airlockFromSearch(search){const value=new URLSearchParams(search).get('airlock');return value==='12'||value==='20'?Number(value):0;}
export function configureAirlock(m,value){const frames=Number(value);if(AIRLOCK_GUESSES.includes(frames))for(const p of m.players)locks.set(p,{frames,until:-Infinity});return m;}
export function recordAirLaunch(m,p){const lock=locks.get(p);if(lock&&!(p.launched&&p.air>0))lock.until=m.tick+lock.frames;}
// Pursuit's intermediate hits extend the same launch, not a new lockout. Hitstop does not advance m.tick.
export function airlockRemaining(m,p){const lock=locks.get(p);return lock&&p.air>0?Math.max(0,lock.until-m.tick+1):0;}
export const airRecoveryAvailable=(m,p)=>airlockRemaining(m,p)===0;
