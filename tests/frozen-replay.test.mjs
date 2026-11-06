// Adam's 2026-11-06 replays verify against the build they were recorded on (frozen copy, hash 05d0ecfdabc3).
// validateReplay requires an exact build hash, so later builds must not be used to verify them.
import test from 'node:test';import assert from 'node:assert/strict';import {readFileSync} from 'node:fs';
const root=new URL('./fixtures/build-05d0ecfdabc3/',import.meta.url);
const {replayAll}=await import(new URL('skill/replay-engine.js',root));
const build=JSON.parse(readFileSync(new URL('skill/build.json',root),'utf8'));
for(const name of ['rift-2026-11-06T18-23-54-299Z-tala-vs-sol-p1-wins-2.json','rift-2026-11-06T18-26-33-520Z-tala-vs-vesper-p1-wins.json'])
 test(`frozen build verifies ${name}`,()=>{const file=JSON.parse(readFileSync(new URL('./fixtures/replays/'+name,import.meta.url),'utf8'));
  assert.equal(file.build.hash,build.hash);const {summary}=replayAll(file,build,{keepFrames:false});assert.equal(summary.verified,true);
  file.rounds.forEach((r,i)=>assert.deepEqual(summary.rounds[i].result.hp,r.result.hp));});
