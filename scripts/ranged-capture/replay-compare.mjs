// Adam's replays: verified summary from the frozen build 05d0ecfdabc3, and the same input stream re-analysed with the
// current build (hash relabelled only so validateReplay accepts it; outcomes must still match). Prints every changed field.
import {readFileSync,writeFileSync,mkdirSync} from 'node:fs';
const frozenRoot=new URL('../../tests/fixtures/build-05d0ecfdabc3/',import.meta.url),curRoot=new URL('../../dist/',import.meta.url);
const old=await import(new URL('skill/replay-engine.js',frozenRoot)),cur=await import(new URL('skill/replay-engine.js',curRoot));
const oldBuild=JSON.parse(readFileSync(new URL('skill/build.json',frozenRoot))),curBuild=JSON.parse(readFileSync(new URL('skill/build.json',curRoot)));
const diff=(a,b,path='',out=[])=>{if(JSON.stringify(a)===JSON.stringify(b))return out;if(a&&b&&typeof a==='object'&&typeof b==='object'){for(const k of new Set([...Object.keys(a),...Object.keys(b)]))diff(a[k],b[k],path+'.'+k,out);}else out.push({path,old:a,new:b});return out;};
const report=[];
for(const name of ['rift-2026-11-06T18-23-54-299Z-tala-vs-sol-p1-wins-2.json','rift-2026-11-06T18-26-33-520Z-tala-vs-vesper-p1-wins.json']){
 const file=JSON.parse(readFileSync(new URL('../../tests/fixtures/replays/'+name,import.meta.url)));
 const a=old.replayAll(file,oldBuild,{keepFrames:false}).summary,b=cur.replayAll({...file,build:{...file.build,hash:curBuild.hash}},curBuild,{keepFrames:false}).summary;
 const changes=a.rounds.flatMap((r,i)=>diff(r,b.rounds[i],`round${i+1}`));
 report.push({name,frozenVerified:a.verified,currentVerified:b.verified,changes});
 console.log(`\n${name}: frozen verified ${a.verified}, current build verified ${b.verified}, ${changes.length} changed fields`);
 for(const c of changes)console.log(' ',c.path,JSON.stringify(c.old)??'(absent)','->',JSON.stringify(c.new)??'(absent)');}
mkdirSync('art/review-2026-11-06/ranged-capture',{recursive:true});writeFileSync('art/review-2026-11-06/ranged-capture/replay-compare.json',JSON.stringify(report,null,1));
