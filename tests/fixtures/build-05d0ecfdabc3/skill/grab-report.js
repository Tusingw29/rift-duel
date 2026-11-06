import {wilson,SKILLED,captureShare} from './report.js';
export const overlaps=(a,b)=>a[0]<=b[1]&&b[0]<=a[1];
export function groupOutcome(matches,bots,opponent){
 let n=0,wins=0,draws=0;const grouped=new Map();
 for(const m of matches){const i=m.bots.findIndex(b=>bots.includes(b));if(i<0||m.bots[1-i]!==opponent||!m.completed)continue;n++;const win=Number(m.winner===i);wins+=win;draws+=Number(m.winner===-1);const key=m.fighters?JSON.stringify([m.fighters[i],m.fighters[1-i],m.seed]):String(n);const block=grouped.get(key)||{wins:0,n:0};block.wins+=win;block.n++;grouped.set(key,block);}
 const wilsonInterval=wilson(wins,n),blocks=[...grouped.values()],samples=[];let seed=78231;
 // Resample fighter-pair/seed blocks together: mirrored seats and aggregated policies stay paired.
 if(blocks.length)for(let b=0;b<2000;b++){let w=0,total=0;for(let j=0;j<blocks.length;j++){seed=(Math.imul(seed,1664525)+1013904223)>>>0;const x=blocks[Math.floor(seed/4294967296*blocks.length)];w+=x.wins;total+=x.n;}samples.push(w/total);}
 samples.sort((a,b)=>a-b);const clusterInterval=samples.length?[samples[49],samples[1949]]:[0,1];
 return {n,wins,draws,rate:n?wins/n:null,clusters:blocks.length,wilsonInterval,clusterInterval,interval:[Math.min(wilsonInterval[0],clusterInterval[0]),Math.max(wilsonInterval[1],clusterInterval[1])]};
}
export function grabSummary(r){const groups={skilled:SKILLED,punisher:['punisher'],spacer:['spacer']};return {config:r.config,commit:r.commit,bouts:r.matches.length,censored:r.matches.filter(m=>!m.completed).length,outcomes:Object.fromEntries(Object.entries(groups).flatMap(([label,bots])=>['masher','masher-all'].map(opponent=>[`${label}/${opponent}`,groupOutcome(r.matches,bots,opponent)]))),sanity:Object.fromEntries(['spacer','timer','reader','punisher','masher','masher-all'].map(b=>[b,groupOutcome(r.matches,[b],'random')])),captures:Object.fromEntries(['masher','masher-all'].map(bot=>{const rows=r.matches.filter(m=>m.bots.some(b=>[...SKILLED,'punisher'].includes(b)));return [bot,{...captureShare(rows,bot),breaksAgainstMasher:rows.reduce((s,m)=>{const i=m.bots.indexOf(bot);return s+(i<0?0:m.players[1-i].captureBreaks);},0),breaksByMasher:rows.reduce((s,m)=>{const i=m.bots.indexOf(bot);return s+(i<0?0:m.players[i].captureBreaks);},0)}];}))};}
export const winText=r=>`${(r.rate*100).toFixed(1)}% (${r.wins}/${r.n}); 95% ${r.interval.map(v=>(v*100).toFixed(1)).join('–')}%`;
export function compareModes(a,b){return {difference:100*(a.rate-b.rate),label:overlaps(a.interval,b.interval)?'could be luck':'ranges do not overlap'};}
