import {wilson} from '../../dist/skill/report.js';
// Resample whole seed blocks: all fighter pairs and mirrored seats share each seed stream.
export function rateInterval(blocks){
 const rows=Object.values(blocks),total=rows.reduce((s,x)=>s+x.eligible,0),attempts=rows.reduce((s,x)=>s+x.attempts,0);
 if(!total)return [0,1];const samples=[];let seed=44117;
 for(let n=0;n<2000;n++){let a=0,e=0;for(let j=0;j<rows.length;j++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const b=rows[Math.floor(seed/4294967296*rows.length)];a+=b.attempts;e+=b.eligible;}samples.push(e?a/e:0);}
 samples.sort((a,b)=>a-b);const w=wilson(attempts,total);return [Math.min(w[0],samples[49]),Math.max(w[1],samples[1949])];
}
