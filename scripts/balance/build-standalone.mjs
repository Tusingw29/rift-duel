// Self-contained Frame Codex replacement, generated from the exact in-repo lab.
// No parallel hand-maintained formulas or baseline numbers.
import {readFileSync,writeFileSync} from 'node:fs';
import {fileURLToPath} from 'node:url';
const root=new URL('../../',import.meta.url),read=p=>readFileSync(new URL(p,root),'utf8');
const moduleBody=s=>s.replace(/^import .*;\n/gm,'').replace(/^export /gm,'');
export function buildStandalone(){
 const roster=read('dist/balance/roster.json');
 const formulas=moduleBody(read('dist/balance/formulas.js'));
 const presets=moduleBody(read('dist/balance/presets.js'));
 const app=moduleBody(read('dist/balance-lab.js')).replace("const roster=await (await fetch('./balance/roster.json',{cache:'no-store'})).json();",'const roster='+roster.trim()+';');
 let html=read('dist/balance-lab.html').replace(/<script type="importmap">[\s\S]*?<\/script>/g,'').replace(/<script type="module" src="[^"]+"><\/script>/g,'');
 html=html.replace('<title>','<title>Standalone · ').replace('RIFT DUEL / BALANCE LAB','RIFT DUEL / FRAME CODEX');
 html=html.replace('<main>','<main><p class="note">Standalone lab: roster and formulas are embedded from the repository. Saved tuning belongs to this browser address. If hosted elsewhere, export your JSON and import it into the playable lab at localhost:4202. Play links below target that local preview; it must be running.</p>');
 html=html.replace(/href="\.\//g,'href="http://localhost:4202/').replace('href="index.html"','href="http://localhost:4202/"').replace('href="sandbox.html"','href="http://localhost:4202/sandbox.html"');
 return html.replace('</body>','<script type="module">\n'+[formulas,presets,app].join('\n').replace(/<\/script/gi,'<\\/script')+'\n</script></body>');
}
if(process.argv[1]&&fileURLToPath(import.meta.url)===process.argv[1]){
const out=new URL('dist/frame-codex.html',root),html=buildStandalone();
if(process.argv.includes('--check')){if(readFileSync(out,'utf8')!==html)throw Error('Standalone lab is stale: npm run balance:standalone');console.log('Standalone lab matches source');}
else {writeFileSync(out,html);console.log(`Wrote dist/frame-codex.html (${Buffer.byteLength(html)} bytes)`);}

}
