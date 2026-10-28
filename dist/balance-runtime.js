// Match-owned tuning only. No browser state or mutation of the shared roster.
import {fighters} from './fighters.js';
import {baseSpecials,specialVariants} from './special-variants.js';
import {techniqueVariants} from './techniques.js';
import {stockSpecials} from './stock-specials.js';
const slug=s=>String(s).toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-/,'');
export function balanceMoveKey(f,move){
 const k=move.kind;
 if(move.reversal)return 'defense-third-hit-reversal';
 if(move.empowered)return 'stock-'+slug(stockSpecials[f.id]?.[k]?.name);
 if(['strike','shot'].includes(k))return `chain-${k}-${move.chain||1}`;
 if(['forward','back'].includes(k))return (move.followup?'variant-':'special-')+slug((move.followup?specialVariants:baseSpecials)[f.id][k].name);
 if(k==='technique')return (move.followup?'variant-':'special-')+slug(move.followup?techniqueVariants[f.id].name:f.moves[2]);
 return {capture:'system-capture-close-',launch:'system-launcher',pursuit:'system-pursuit',jumpAttack:'system-jumping-crossover',super:'system-'+slug(f.special)}[k];
}
const ranges={missPenalty:[0,30],startup:[1,180],active:[1,180],recovery:[0,240],base:[0,200],speed:[.1,15],power:[.1,3],reach:[.5,8],shotSpeed:[1,40],hitstun:[0,180],launchStun:[1,240],blockstun:[0,180],chip:[0,1],perfectGuard:[0,60],captureBreak:[0,60],cancel1:[0,240],cancel2:[0,240],reaction:[0,120],band:[0,100]};
const fractional=new Set(['base','speed','power','reach','shotSpeed','chip','band']);
function number(k,v){const [lo,hi]=ranges[k];if(typeof v!=='number'||!Number.isFinite(v)||v<lo||v>hi||!fractional.has(k)&&!Number.isInteger(v))throw Error(`${k} must be ${lo}–${hi}${fractional.has(k)?'':' whole frames'}`);}
export function validateBalance(raw,base){
 if(!raw||typeof raw!=='object'||!raw.fighters||!raw.sys)throw Error('Expected a balance-lab export with fighters and sys.');
 const result={version:1,sys:{},fighters:{}};
 for(const [k,v] of Object.entries(raw.sys)){
  if(!(k in base.sys))throw Error(`Unknown rule: ${k}`);
  if(k==='splitGuard'){if(typeof v!=='boolean')throw Error('splitGuard must be true or false');}else number(k,v);
  if(!['reaction','band'].includes(k)&&v!==base.sys[k])result.sys[k]=v;
 }
 for(const [id,f] of Object.entries(raw.fighters)){
  const b=base.fighters[id];if(!b||f.custom)throw Error(`Custom/unknown fighter ${id} cannot be played yet. Remove it from this tuning export.`);
  if(!f.stats||!Array.isArray(f.moves))throw Error(`Missing stats or moves for ${id}`);
  const out={stats:{},moves:{}};
  for(const [k,v] of Object.entries(f.stats)){if(!(k in b.stats))throw Error(`Unknown stat: ${k}`);number(k,v);if(v!==b.stats[k])out.stats[k]=v;}
  const seen=new Set();
  for(const m of f.moves){
   const bm=b.moves.find(x=>x.key===m.key);if(!bm||seen.has(m.key))throw Error(`Unknown/duplicate move: ${id}/${m.key}`);seen.add(m.key);
   const diff={};for(const k of ['startup','active','recovery','base']){number(k,m[k]);if(m[k]!==bm[k])diff[k]=m[k];}
   if(diff.base!==undefined){diff.damageScale=diff.base/bm.base;delete diff.base;}
   if(Object.keys(diff).length)out.moves[m.key]=diff;
  }
  if(Object.keys(out.stats).length||Object.keys(out.moves).length)result.fighters[id]=out;
 }
 return result;
}
export const matchFighter=(m,a)=>m.balance?.fighters[fighters[a.id].id]?.stats?{...fighters[a.id],...m.balance.fighters[fighters[a.id].id].stats}:fighters[a.id];
export function applyBalanceMove(m,a,move){
 if(!m.balance||!move)return;
 const key=balanceMoveKey(fighters[a.id],move),patch=m.balance.fighters[fighters[a.id].id]?.moves[key];
 // Remove any base-move override before a wind-up variant replaces it.
 if(move.balanceOriginal){Object.assign(move,move.balanceOriginal);delete move.balanceOriginal;}
 if(patch){
  move.balanceOriginal={startup:move.startup,active:move.active,recovery:move.recovery};
  for(const k of ['startup','active','recovery'])if(patch[k]!==undefined)move[k]=patch[k];
  move.total=move.startup+move.active+move.recovery;
  if(move.travel)move.travel.frames=move.startup;
 }
 if(move.kind==='strike'&&!move.reversal){const v=m.balance.sys['cancel'+move.chain];if(v!==undefined)move.cancelFrame=v;}
}
export function balanceDamageScale(m,a,move){return m.balance?.fighters[fighters[a.id].id]?.moves[balanceMoveKey(fighters[a.id],move)]?.damageScale??1;}
export const balanceRule=(m,key,fallback)=>m.balance?.sys[key]??fallback;
export function balanceGuard(m,b,key,fallback){const n=m.balance?.sys[key];return b.guard&&(n===undefined?b.guardTime<fallback:Math.round(b.guardTime*60)<=n&&n>0);}
export function balanceCaptureBreak(m,b,fallback=.2){
 if(!m.balance?.sys.splitGuard)return balanceGuard(m,b,'captureBreak',fallback);
 const age=m.tick-(b.captureTapTick??-Infinity);return age>=0&&age<balanceRule(m,'captureBreak',12)&&b.stun<=0&&!b.guard&&(!b.move||b.move.kind==='capture'&&b.move.started>=b.captureTapTick);
}
