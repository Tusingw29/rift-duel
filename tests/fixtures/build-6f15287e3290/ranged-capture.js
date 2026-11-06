// RANGED-CAPTURE playtest guesses (2026-11-06). Opt-in only: ?rangedcap=guard, ?rangedcap=flat or ?rangedcap=guard,flat.
// guard: a held guard stops a ranged capture circle the way it stops a shot (block stun, push, no chip).
// flat:  ranged captures (contexts mid/far) use the close multiplier instead of 1.1 / 1.25.
export const RANGED_CAPTURE=Object.freeze({guardBlockStun:.12,guardChip:0,guardPush:.35,flatMultiplier:1});
const OPTIONS=['flat','guard'];
const guarded=new WeakSet(),flattened=new WeakSet();
export const rangedCaptureFromSearch=search=>normalizeRangedCapture(new URLSearchParams(search).get('rangedcap'));
export const normalizeRangedCapture=value=>[...new Set(String(value||'').split(',').map(s=>s.trim()).filter(s=>OPTIONS.includes(s)))].sort().join(',');
export function configureRangedCapture(m,value){const v=normalizeRangedCapture(value).split(',');if(v.includes('guard'))guarded.add(m);if(v.includes('flat'))flattened.add(m);return m;}
export const rangedCaptureGuard=m=>guarded.has(m);
export const rangedCaptureFlat=m=>flattened.has(m);
export const rangedContext=context=>context==='mid'||context==='far';
