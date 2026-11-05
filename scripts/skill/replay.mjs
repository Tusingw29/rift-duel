import {readFileSync,writeFileSync} from 'node:fs';
import {resolve,dirname,basename,join} from 'node:path';
import {pathToFileURL} from 'node:url';
import {releaseBuild} from '../release-build.mjs';
import {replayAll} from '../../dist/skill/replay-engine.js';
export function replayFile(path,{out=dirname(resolve(path)),build=JSON.parse(readFileSync(new URL('../../dist/skill/build.json',import.meta.url),'utf8'))}={}){
 if(build.hash!==releaseBuild().hash)throw Error('Installed build identity is stale: run npm run prepare:release before replaying.');
 const text=readFileSync(path,'utf8');if(text.length>20000000)throw Error('Replay file exceeds 20 MB safety limit');
 const file=JSON.parse(text),start=performance.now(),result=replayAll(file,build),stem=basename(path,'.json'),eventsPath=join(out,stem+'.events.json'),summaryPath=join(out,stem+'.summary.json');
 result.summary.analysisSeconds=(performance.now()-start)/1000;
 writeFileSync(eventsPath,JSON.stringify({kind:'rift-replay-frames',schema:1,build:file.build,frames:result.frames}));writeFileSync(summaryPath,JSON.stringify(result.summary,null,2));return {file,result,eventsPath,summaryPath};
}
if(process.argv[1]&&import.meta.url===pathToFileURL(resolve(process.argv[1])).href){try{if(!process.argv[2])throw Error('Usage: node scripts/skill/replay.mjs <replay.json> [output-directory]');const r=replayFile(process.argv[2],{...(process.argv[3]?{out:resolve(process.argv[3])}:{})});console.log(`Verified ${r.result.summary.rounds.length} rounds, ${r.file.inputTicks} input ticks.\nEvents: ${r.eventsPath}\nSummary: ${r.summaryPath}`);}catch(e){console.error('REPLAY REJECTED: '+e.message);process.exitCode=1;}}
