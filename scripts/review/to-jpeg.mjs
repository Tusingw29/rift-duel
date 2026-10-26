// Convert capture PNGs to compact JPEGs for the review folder (strips run 1–2 MB as PNG, ~150 KB as JPEG).
// Usage: RIFT_TOOLS=<dir> node scripts/review/to-jpeg.mjs <out-dir> <file.png> [more.png...]
import {PNG,toJpeg} from './common.mjs';
import {readFileSync,writeFileSync} from 'node:fs';
import {basename,join} from 'node:path';
const [out,...files]=process.argv.slice(2);
for(const f of files){const img=PNG.sync.read(readFileSync(f));const name=basename(f).replace(/-\d{10,}\.png$/,'.jpg').replace(/\.png$/,'.jpg');writeFileSync(join(out,name),toJpeg(img));console.log(name);}
