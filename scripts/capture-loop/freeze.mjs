// Keep only the transitive source modules required to verify build 6f15287e3290.
// Sources come from git, never the in-progress preview; no render assets/vendor copy.
import {execFileSync} from 'node:child_process';import {mkdirSync,writeFileSync,readFileSync,readdirSync} from 'node:fs';import {dirname,posix} from 'node:path';import {createHash} from 'node:crypto';import {gzipSync} from 'node:zlib';
const commit='0d6f9c8',root='tests/fixtures/build-6f15287e3290',seen=new Set(),manifest={sourceCommit:commit,build:'6f15287e3290',files:{}};
function copy(name){if(seen.has(name))return;seen.add(name);const bytes=execFileSync('git',['show',`${commit}:dist/${name}`]),text=bytes.toString();mkdirSync(dirname(root+'/'+name),{recursive:true});writeFileSync(root+'/'+name,bytes);manifest.files[name]=createHash('sha256').update(bytes).digest('hex');for(const m of text.matchAll(/(?:from\s*|import\s*)['"](\.[^'"]+\.js)['"]/g))copy(posix.normalize(posix.join(posix.dirname(name),m[1])));}
copy('skill/replay-engine.js');const build=execFileSync('git',['show',`${commit}:dist/skill/build.json`]);writeFileSync(root+'/skill/build.json',build);writeFileSync(root+'/source-manifest.json',JSON.stringify(manifest,null,2)+'\n');
// Raw controller streams are repetitive. Gzip fixtures preserve original bytes and
// their integrity fields without committing many MB of duplicated checkpoints.
const downloads='/Users/adamwilliams/Downloads',names=readdirSync(downloads).filter(n=>/^rift-2026-11-06T(?:19-|22-12-18-161Z)/.test(n)&&n.endsWith('.json'));mkdirSync('tests/fixtures/capture-loop-replays',{recursive:true});const files=[];
for(const name of names){const raw=readFileSync(downloads+'/'+name),f=JSON.parse(raw);if(f.build.hash!=='6f15287e3290')continue;writeFileSync('tests/fixtures/capture-loop-replays/'+name+'.gz',gzipSync(raw));files.push({file:name+'.gz',sha256:createHash('sha256').update(raw).digest('hex'),rounds:f.rounds.length});}
writeFileSync('tests/fixtures/capture-loop-replays/manifest.json',JSON.stringify({build:'6f15287e3290',files},null,2)+'\n');console.log(`${seen.size} original source modules, ${files.length} lossless replay fixtures`);
