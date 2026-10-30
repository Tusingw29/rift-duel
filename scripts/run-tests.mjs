// Runs the test suite (or the files matching the given words) and prints a short summary: totals, then each
// failing test with its error. Exits non-zero on any failure. Use instead of `npm test` on Adam's Mac, where
// `npm test` can exit with a bare status and no output (see skills/run-tests/SKILL.md).
// node scripts/run-tests.mjs                      all tests
// node scripts/run-tests.mjs morrow tell kinetic  files whose name contains any word
// node scripts/run-tests.mjs --imports=grounded-animation,morrow-animation   files that import those modules
import {readdirSync,readFileSync} from 'node:fs';
import {spawn} from 'node:child_process';
import {join} from 'node:path';
const root=join(import.meta.dirname,'..'),dir=join(root,'tests');
const args=process.argv.slice(2),imports=args.find(a=>a.startsWith('--imports='))?.slice(10).split(',')||[],words=args.filter(a=>!a.startsWith('--'));
let files=readdirSync(dir).filter(f=>f.endsWith('.test.mjs'));
if(words.length)files=files.filter(f=>words.some(w=>f.includes(w)));
if(imports.length)files=files.filter(f=>{const src=readFileSync(join(dir,f),'utf8');return imports.some(m=>src.includes(`/${m}.js`));});
if(!files.length){console.error('no test files match');process.exit(2);}
const child=spawn(process.execPath,['--test','--test-concurrency=2','--test-reporter=tap',...files.map(f=>join('tests',f))],{cwd:root});
let out='';child.stdout.on('data',d=>out+=d);child.stderr.on('data',d=>out+=d);
child.on('close',code=>{
 const total=k=>(out.match(new RegExp(`^# ${k} (\\d+)`,'m'))||[])[1]??'?';
 console.log(`${files.length} files · tests ${total('tests')} · pass ${total('pass')} · fail ${total('fail')} · cancelled ${total('cancelled')}`);
 const lines=out.split('\n');
 lines.forEach((l,i)=>{if(/^\s*not ok/.test(l)&&!/# SKIP/.test(l)){console.log(l.trim());const err=lines.slice(i+1,i+25).find(x=>/^\s+error:/.test(x));if(err)console.log('   ',err.trim());}});
 if(code&&total('tests')==='?')console.log(out.slice(-2000)); // crashed before reporting: show the tail
 process.exit(code);
});
