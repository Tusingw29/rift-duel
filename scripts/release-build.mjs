import {readFileSync,readdirSync} from 'node:fs';
import {createHash} from 'node:crypto';
export function releaseBuild(root=new URL('../dist/',import.meta.url)){
 const files=[...readdirSync(new URL('skill/',root)).filter(n=>n.endsWith('.js')).map(n=>'skill/'+n),...readdirSync(root).filter(n=>n.endsWith('.js')),...readdirSync(new URL('vendor/',root)).filter(n=>n.endsWith('.js')).map(n=>'vendor/'+n)].sort(),hash=createHash('sha256');
 for(const name of [...files,'style.css'])hash.update(name).update(readFileSync(new URL(name,root)));
 return {files,hash:hash.digest('hex').slice(0,12)};
}
