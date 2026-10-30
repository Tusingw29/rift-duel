// Which moves can a defender answer on reaction at a given delay? Reads dist/balance/roster.json, never hand-copied numbers.
// node reactable.mjs --root=<worktree> --delays=10,15 [--fighter=tala] [--kind=capture] [--startup=system-capture-close-:18] [--all]
import {readFileSync} from 'node:fs';import {resolve} from 'node:path';
const args=process.argv.slice(2),get=(k,f)=>args.find(a=>a.startsWith('--'+k+'='))?.slice(k.length+3)??f;
const root=resolve(get('root',process.cwd())),roster=JSON.parse(readFileSync(resolve(root,'dist/balance/roster.json'),'utf8')),C=roster.constants;
const delays=get('delays','10,15').split(',').map(Number),only=get('fighter',''),kind=get('kind',''),all=args.includes('--all');
const overrides=Object.fromEntries(get('startup','').split(',').filter(Boolean).map(s=>{const [k,v]=s.split(':');return [k,Number(v)];}));
// Window = frames before contact in which the answer must be input. Answer needs at least one input frame after the move becomes visible.
const answers=[
 ['guard (hold)',Infinity,'blocks strikes/shots; loses to capture'],
 ['perfect guard tap',C.perfectGuard,'guardTime under perfectGuard frames at contact'],
 ['capture break',C.captureBreak,'default: timed guard; split guard: fresh capture tap, not guarding'],
];
console.log(`root ${root}\nconstants: perfectGuard ${C.perfectGuard}f, captureBreak ${C.captureBreak}f, blockStun ${C.blockStun}f, hitStun ${C.hitStun}f\n`);
console.log('A move is seen `delay` frames after it starts. Slack = startup - delay - 1 (frames left to input an answer). Negative = must be guessed.\n');
for(const f of roster.fighters){if(only&&f.id!==only)continue;
 const strike1=f.moves.find(m=>m.key==='chain-strike-1');
 const rows=f.moves.filter(m=>(!kind||m.type.toLowerCase().includes(kind)||m.key.includes(kind))&&(all||['Chain','System','Special'].includes(m.group)));
 console.log(`== ${f.id} (fastest Strike 1 startup ${strike1?.startup}f)`);
 console.log('move'.padEnd(30)+'type'.padEnd(11)+'S/A/R'.padEnd(11)+delays.map(d=>`slack@${d}`.padEnd(10)).join('')+delays.map(d=>`whiff@${d}`.padEnd(14)).join(''));
 for(const m of rows){const s=overrides[m.key]??m.startup,open=m.active-1+m.recovery;
  const slack=delays.map(d=>s-d-1),whiff=delays.map(d=>{const need=d+(strike1?.startup??10);return open>=need?`react +${open-need}`:open>=need-d?`guess +${open-need+d}`:`safe ${open-need+d}`;});
  console.log((m.key+(overrides[m.key]!=null?'*':'')).padEnd(30)+m.type.padEnd(11)+`${s}/${m.active}/${m.recovery}`.padEnd(11)+slack.map(v=>String(v).padEnd(10)).join('')+whiff.map(v=>v.padEnd(14)).join(''));}
 console.log('');}
console.log('Answers and their windows (an answer works on reaction only if slack >= 0, and for windowed answers the tap still lands inside the window):');
for(const [n,w,note] of answers)console.log(`  ${n}: window ${w===Infinity?'any':w+'f'} - ${note}`);
console.log('whiff@d: punish a whiff with your Strike 1 seen d frames late; "react" = on reaction, "guess" = only if pre-committed, "safe" = no punish. Ignores spacing/pushback (+-2f).');
