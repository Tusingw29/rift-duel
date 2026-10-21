// Provenance for cloud artifacts. An artifact is review material, not a deployment.
import {readFileSync,writeFileSync,mkdirSync,copyFileSync} from 'node:fs';
import {join,dirname} from 'node:path';
import {createHash} from 'node:crypto';
const root=new URL('../',import.meta.url),folder='art/blender/tala-design02/';
const rendered=process.env.RENDERED_REVIEW==='true',motion=process.env.RENDERED_MOTION==='true';
const files=['dist/assets/models/tala-design02.glb',folder+'tala-study.blend',folder+'face-baked.png',folder+'hair-strands.png',folder+'build-report.json',...['guard','straight','cross','hook'].map(p=>folder+p+'-pose.json')];
if(rendered)for(const pose of ['review','guard','costume','straight','cross','hook'])for(const view of ['front','side'])files.push(folder+pose+'-'+view+'.png');
if(motion)files.push('dist/assets/tala-design02-motion.mp4',folder+'motion-review.json',folder+'motion-review-punch.png');
const report={motionReviewRendered:motion,sourceCommit:process.env.GITHUB_SHA||null,run:process.env.GITHUB_RUN_ID?`https://github.com/${process.env.GITHUB_REPOSITORY}/actions/runs/${process.env.GITHUB_RUN_ID}`:null,faceRebaked:process.env.REBAKED_FACE==='true',reviewImagesRendered:rendered,model:JSON.parse(readFileSync(new URL(folder+'build-report.json',root))),files:files.map(path=>{const data=readFileSync(new URL(path,root));return {path,bytes:data.length,sha256:createHash('sha256').update(data).digest('hex')};})};
writeFileSync(new URL(folder+'cloud-build.json',root),JSON.stringify(report,null,2)+'\n');
console.log(JSON.stringify({sourceCommit:report.sourceCommit,files:report.files.length,reviewImagesRendered:rendered}));

// Only fresh outputs enter the package; skipped renders cannot masquerade as new.
if(!process.env.RUNNER_TEMP)throw Error('RUNNER_TEMP is required for artifact staging');
const destination=join(process.env.RUNNER_TEMP,'tala-art-package');
for(const path of [...files,folder+'cloud-build.json']){
 const target=join(destination,path);mkdirSync(dirname(target),{recursive:true});copyFileSync(new URL(path,root),target);
}
