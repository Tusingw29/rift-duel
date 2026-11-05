import {readFileSync,writeFileSync} from 'node:fs';
import {releaseBuild} from './release-build.mjs';
import {execFileSync} from 'node:child_process';
const root=new URL('../dist/',import.meta.url);
const {files,hash:build}=releaseBuild(root);
let commit=null,workingTreeDirty=true;try{commit=execFileSync('git',['rev-parse','HEAD'],{encoding:'utf8'}).trim();workingTreeDirty=!!execFileSync('git',['status','--porcelain'],{encoding:'utf8'}).trim();}catch{}
writeFileSync(new URL('skill/build.json',root),JSON.stringify({hash:build,commit,workingTreeDirty})+'\n');
const imports=Object.fromEntries(files.map(name=>['./'+name,`./${name}?build=${build}`]));
const map=`<script type="importmap">${JSON.stringify({imports})}</script>`;
for(const page of ['index.html','tala-blender.html','morrow-review.html','morrow-attacks.html','fighter-review.html','sandbox.html','vfx-workbench.html','anim-workbench.html','balance-lab.html','skill-lab.html','replay.html']){
 const path=new URL(page,root);
 let html=readFileSync(path,'utf8').replace(/<script type="importmap">.*?<\/script>/s,'');
 html=html.replace(/href="style\.css(?:\?[^\"]*)?"/,`href="style.css?build=${build}"`);
 html=html.replace(/<script type="module" src="(main|tala-blender-review|morrow-review|morrow-attack-review|fighter-review|sandbox|vfx-workbench|anim-workbench|balance-lab|skill-lab|replay)\.js(?:\?[^\"]*)?"><\/script>/,(_,name)=>`${map}<script type="module" src="${name}.js?build=${build}"></script>`);
 writeFileSync(path,html);
}
console.log(`Prepared ${files.length} app modules with build ${build}`);
