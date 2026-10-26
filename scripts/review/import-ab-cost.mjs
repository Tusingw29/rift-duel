// TALA-IMPORT-AB animation cost: time animateCharacter alone for the attached graphic Tala over long runs of each
// comparison scenario, authored versus imported. Rendering cost is the same in both modes (same meshes and materials).
import {readFileSync} from 'node:fs';
import {GLTFLoader} from '../../dist/vendor/GLTFLoader.js';
import {buildCharacter} from '../../dist/characters.js';
import {attachTalaConcept} from '../../dist/tala-concept.js';
import {animateCharacter} from '../../dist/animation.js';
import {createScenario,stepScenario} from '../../dist/sandbox-recipes.js';
import {setLocomotionSource} from '../../dist/locomotion-clips.js';
import {airHeight} from '../../dist/air-motion.js';
globalThis.ProgressEvent??=class{constructor(t,d){Object.assign(this,d);}};
const bytes=readFileSync(new URL('../../dist/assets/tala-graphic/tala-graphic.glb',import.meta.url));
const asset=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
const out={};
for(const mode of ['authored','imported','authored','imported']){ // twice each, report the second (warm) pass
 setLocomotionSource(mode);const r=buildCharacter(2,{variant:'graphic'});r.conceptOriginalSurfaces=[];attachTalaConcept(r,asset.scene.clone(true));
 const times=[];let time=0;
 for(const name of ['ab-advance-guard','ab-retreat-attack','ab-circle-left-guard','ab-circle-right-guard','ab-knockdown-getup-guard'])for(let rep=0;rep<6;rep++){
  const s=createScenario(name,2,1);
  for(let f=0;f<=(s.recipe.frames||90);f++){if(f)stepScenario(s);const p=s.m.players[0];time+=s.m.hitstop>0?0:1/60;r.g.position.set(p.x,airHeight(p),p.z);r.g.rotation.y=Math.atan2(p.lookX,p.lookZ);
   const t=performance.now();animateCharacter(r,p,time);times.push(performance.now()-t);}
 }
 times.sort((a,b)=>a-b);out[mode]={frames:times.length,meanMs:+(times.reduce((a,b)=>a+b,0)/times.length).toFixed(3),p95Ms:+times[Math.floor(times.length*.95)].toFixed(3),maxMs:+times.at(-1).toFixed(3)};
}
setLocomotionSource('authored');console.log(JSON.stringify(out));
