// Head-to-head bot probe on any Rift Duel worktree that has the SKILL-LAB runner.
// node probe.mjs --root=<worktree> --bots=punisher,timer --vs=masher --delays=15 --modes=default,proposed
//   [--grab=deliberate,slow] [--seeds=1] [--bot-file=name=/abs/path.mjs ...] [--fighters=tala,rei] [--json]
import {pathToFileURL} from 'node:url';import {resolve} from 'node:path';import {readFileSync,existsSync} from 'node:fs';
const args=process.argv.slice(2),get=(k,f)=>args.find(a=>a.startsWith('--'+k+'='))?.slice(k.length+3)??f,list=(k,f)=>get(k,f).split(',').map(s=>s.trim()).filter(Boolean);
const root=resolve(get('root',process.cwd())),url=p=>pathToFileURL(resolve(root,p)).href;
if(!existsSync(resolve(root,'scripts/skill/run.mjs')))throw Error(`${root} has no scripts/skill/run.mjs: point --root at a codex/skill-lab worktree`);
const {runMatch,policies}=await import(url('scripts/skill/run.mjs'));
for(const spec of args.filter(a=>a.startsWith('--bot-file='))){const [name,file]=spec.slice(11).split('=');policies[name]=(await import(pathToFileURL(resolve(file)).href)).default;}
const roster=JSON.parse(readFileSync(resolve(root,'dist/balance/roster.json'),'utf8'));
const balances={default:null};
try{const {baseState,exportTuning}=await import(url('dist/balance/formulas.js')),{proposedBalance}=await import(url('dist/balance/presets.js')),{validateBalance}=await import(url('dist/balance-runtime.js'));const base=baseState(roster);balances.rules=validateBalance(exportTuning(proposedBalance(base,'rules')),base);balances.proposed=validateBalance(exportTuning(proposedBalance(base)),base);}catch(e){console.error('No balance presets on this root; only default mode available ('+e.message+')');}
const ids=roster.fighters.map(f=>f.id),pick=list('fighters',ids.join(',')).map(id=>{const i=ids.indexOf(id);if(i<0)throw Error('Unknown fighter '+id);return i;});
const bots=list('bots','punisher'),opps=list('vs','masher'),delays=list('delays','15').map(Number),modes=list('modes','default'),grab=get('grab',''),seeds=Number(get('seeds',1));
for(const b of [...bots,...opps])if(!policies[b])throw Error(`Unknown bot ${b}; known: ${Object.keys(policies).join(', ')}`);
for(const m of modes)if(!(m in balances))throw Error('Unknown mode '+m);
const rows=[],t0=performance.now();
for(const mode of modes)for(const delay of delays)for(const bot of bots)for(const opp of opps){
 const r={mode,delay,grab:grab||'-',bot,opp,w:0,l:0,d:0,byFighter:{},lossDamage:{},me:{blocks:0,perfectGuards:0,captureBreaks:0,whiffs:0,punishedWhiffs:0,meleeAttempts:0},them:{capturesThroughGuard:0,captures:0},seconds:0};
 for(const x of pick)for(const y of pick)for(let seed=1;seed<=seeds;seed++)for(const seat of [0,1]){
  const s=runMatch({bots:seat?[opp,bot]:[bot,opp],fighters:seat?[y,x]:[x,y],seed,delay,mode,balance:balances[mode],grab});
  const me=s.players[seat],them=s.players[1-seat],f=ids[x];r.byFighter[f]??=[0,0];r.seconds+=s.seconds;
  if(s.winner===seat){r.w++;r.byFighter[f][0]++;}else if(s.winner===1-seat){r.l++;r.byFighter[f][1]++;for(const[k,v]of Object.entries(them.damageByMove||{}))r.lossDamage[k]=(r.lossDamage[k]||0)+v;}else r.d++;
  for(const k in r.me)r.me[k]+=me[k]||0;for(const k in r.them)r.them[k]+=them[k]||0;}
 rows.push(r);}
if(args.includes('--json')){console.log(JSON.stringify(rows,null,1));process.exit(0);}
const n=r=>r.w+r.l+r.d,wilson=(w,n,z=1.96)=>{if(!n)return[0,0];const p=w/n,c=z*z/n,m=(p+c/2)/(1+c),h=z*Math.sqrt(p*(1-p)/n+c/(4*n))/(1+c);return[m-h,m+h];},pct=v=>(100*v).toFixed(1)+'%';
for(const r of rows){const [lo,hi]=wilson(r.w,n(r)),tot=Object.values(r.lossDamage).reduce((a,b)=>a+b,0)||1;
 console.log(`\n${r.bot} vs ${r.opp} | mode ${r.mode} | grab ${r.grab} | delay ${r.delay}f: ${r.w}W ${r.l}L ${r.d}D of ${n(r)} (${pct(r.w/n(r))}, 95% ${pct(lo)}-${pct(hi)}), avg round ${(r.seconds/n(r)).toFixed(1)}s`);
 console.log('  by own fighter W/L: '+Object.entries(r.byFighter).map(([f,[w,l]])=>`${f} ${w}/${l}`).join(', '));
 console.log(`  ${r.bot}: blocks ${r.me.blocks}, perfect guards ${r.me.perfectGuards}, capture breaks ${r.me.captureBreaks}, melee whiffs ${r.me.whiffs}/${r.me.meleeAttempts} (punished ${r.me.punishedWhiffs}) | ${r.opp}: captures ${r.them.captures}, through guard ${r.them.capturesThroughGuard}`);
 console.log('  top damage in losses: '+Object.entries(r.lossDamage).sort((a,b)=>b[1]-a[1]).slice(0,6).map(([k,v])=>`${k} ${pct(v/tot)}`).join(', '));}
console.error(`\n${rows.reduce((a,r)=>a+n(r),0)} bouts in ${((performance.now()-t0)/1000).toFixed(1)}s`);
