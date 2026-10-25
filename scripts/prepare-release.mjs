import {readFileSync,writeFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
const root=new URL('../dist/',import.meta.url);
const files=[...readdirSync(root).filter(name=>name.endsWith('.js')),...readdirSync(new URL('vendor/',root)).filter(name=>name.endsWith('.js')).map(name=>'vendor/'+name)].sort();
const hash=createHash('sha256');
for(const name of [...files,'style.css'])hash.update(name).update(readFileSync(new URL(name,root)));
const build=hash.digest('hex').slice(0,12);
const imports=Object.fromEntries(files.map(name=>['./'+name,`./${name}?build=${build}`]));
const map=`<script type="importmap">${JSON.stringify({imports})}</script>`;
for(const page of ['index.html','tala-blender.html','morrow-review.html','morrow-attacks.html','fighter-review.html','sandbox.html']){
 const path=new URL(page,root);
 let html=readFileSync(path,'utf8').replace(/<script type="importmap">.*?<\/script>/s,'');
 html=html.replace(/href="style\.css(?:\?[^\"]*)?"/,`href="style.css?build=${build}"`);
 html=html.replace(/<script type="module" src="(main|tala-blender-review|morrow-review|morrow-attack-review|fighter-review|sandbox)\.js(?:\?[^\"]*)?"><\/script>/,(_,name)=>`${map}<script type="module" src="${name}.js?build=${build}"></script>`);
 writeFileSync(path,html);
}
console.log(`Prepared ${files.length} app modules with build ${build}`);
