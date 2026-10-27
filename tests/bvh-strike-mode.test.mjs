import test from 'node:test';import assert from 'node:assert/strict';
import {execFileSync,spawnSync} from 'node:child_process';
import {mkdtempSync,writeFileSync} from 'node:fs';
import {tmpdir} from 'node:os';import {join} from 'node:path';
import {fileURLToPath,pathToFileURL} from 'node:url';
// The standing one-shot conversion (scripts/mocap/bvh-to-channels.mjs --mode strike) on a synthetic take: a CMU-named
// skeleton standing flat-footed whose right elbow opens from 120 degrees to straight and closes again. No dataset files
// are committed, so the take is generated here.
const SCRIPT=fileURLToPath(new URL('../scripts/mocap/bvh-to-channels.mjs',import.meta.url));
const J=(name,offset,kids=[])=>({name,offset,kids});
const arm=(s,x)=>J(`${s}Arm`,[x,0,0],[J(`${s}ForeArm`,[0,-.28,0],[J(`${s}Hand`,[0,-.25,0])])]);
const leg=(s,x)=>J(`${s}UpLeg`,[x,0,0],[J(`${s}Leg`,[0,-.42,0],[J(`${s}Foot`,[0,-.42,0],[J(`${s}ToeBase`,[0,-.06,.14])])])]);
const SKELETON=J('Hips',[0,.92,0],[J('Spine',[0,.12,0],[J('Spine1',[0,.2,0],[J('Neck',[0,.18,0],[J('Head',[0,.1,0])]),arm('Left',-.18),arm('Right',.18)])]),leg('Left',-.1),leg('Right',.1)]);
const order=[];const walk=j=>{order.push(j.name);j.kids.forEach(walk);};walk(SKELETON);
function hierarchy(j,depth=0){
 const pad=' '.repeat(depth),root=depth===0;
 let s=`${pad}${root?'ROOT':'JOINT'} ${j.name}\n${pad}{\n${pad} OFFSET ${j.offset.join(' ')}\n${pad} CHANNELS ${root?'6 Xposition Yposition Zposition ':'3 '}Zrotation Xrotation Yrotation\n`;
 s+=j.kids.length?j.kids.map(k=>hierarchy(k,depth+1)).join(''):`${pad} End Site\n${pad} {\n${pad}  OFFSET 0 -.05 0\n${pad} }\n`;
 return s+`${pad}}\n`;
}
// Frame 0 is the converter's rest frame. Frames 1..12: guard (elbow bent 120 degrees forward), straight at frame 6.
const IMPACT=5; // 0-based index into the converted frames (BVH frame 6)
function take(){
 const frames=[];
 for(let f=0;f<13;f++){
  const k=f===0?0:Math.max(0,1-Math.abs(f-1-IMPACT)/IMPACT),bend=-120*(1-k);
  const rot={LeftArm:[0,-60,0],LeftForeArm:[0,-110,0],RightArm:[0,-60+(-30*k),0],RightForeArm:[0,bend,0]};
  frames.push([0,.92,0,0,0,0,...order.slice(1).flatMap(n=>rot[n]||[0,0,0])].join(' '));
 }
 return `HIERARCHY\n${hierarchy(SKELETON)}MOTION\nFrames: ${frames.length}\nFrame Time: 0.041667\n${frames.join('\n')}\n`;
}
const dir=mkdtempSync(join(tmpdir(),'bvh-strike-')),bvh=join(dir,'take.bvh');writeFileSync(bvh,take());
const convert=async(name,...extra)=>{const out=join(dir,`${name}.js`);execFileSync(process.execPath,[SCRIPT,'--in',bvh,'--out',out,'--name',name,'--segment','0:11','--impact',String(IMPACT),'--mode','strike','--source','synthetic test take',...extra],{stdio:'pipe'});return import(pathToFileURL(out).href);};
test('--mode strike marks the impact, keys it exactly and keeps the elbow opening on the punching hand',async()=>{
 const {meta,keys}=await convert('plain','--hand','r','--type','straight');
 assert.equal(meta.mode,'strike');assert.equal(meta.effector,'r');assert.equal(meta.type,'straight');assert.equal(meta.impactFrame,IMPACT);
 assert.ok(Math.abs(meta.impact-IMPACT/11)<1e-4,'impact as a fraction of the segment');
 const at=keys.find(k=>Math.abs(k[0]-meta.impact)<1e-6);assert.ok(at,'a key sits on the impact');
 assert.ok(keys[0][1].re<-1.9&&at[1].re>-.1,`right elbow from 120 degrees to straight (${keys[0][1].re} -> ${at[1].re})`);
 for(const k of keys)assert.ok(Math.abs(k[1].le-keys[0][1].le)<1e-3,'the other hand holds');
 assert.ok(keys.every(k=>k[2].hip.every(v=>Math.abs(v)<1e-3)),'a planted take has no hip travel');
 assert.ok(keys.every(k=>k[2].lc&&k[2].rc),'both toes in contact');
 assert.equal(keys[0][0],0);assert.equal(keys.at(-1)[0],1);
});
test('--mirror swaps the punching side, so a right-hand take becomes a left-hand punch',async()=>{
 const {keys,meta}=await convert('mirrored','--hand','l','--mirror');
 const at=keys.find(k=>Math.abs(k[0]-meta.impact)<1e-6);
 assert.ok(keys[0][1].le<-1.9&&at[1].le>-.1,'the left elbow now opens');
 for(const k of keys)assert.ok(Math.abs(k[1].re-keys[0][1].re)<1e-3,'the right hand holds');
});
test('the converter refuses an impact outside the segment and a standing take in floor-work oneshot mode',()=>{
 const run=(...a)=>spawnSync(process.execPath,[SCRIPT,'--in',bvh,'--out',join(dir,'x.js'),...a],{encoding:'utf8'});
 const late=run('--segment','0:11','--impact','11','--mode','strike');assert.notEqual(late.status,0);assert.match(late.stderr,/--impact must fall inside the segment/);
 const one=run('--segment','0:11','--mode','oneshot');assert.notEqual(one.status,0);assert.match(one.stderr,/oneshot is for floor work.*--mode strike/);
});
