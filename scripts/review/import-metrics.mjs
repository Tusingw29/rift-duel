// TALA-IMPORT-AB metrics: run each comparison scenario through the real simulation with the attached graphic Tala,
// animated exactly as the renderer does (root placed from the simulation, 1/60 s per frame, zero during hitstop), once
// per animation source, and measure what can be measured. Numbers support the visual review; they do not replace it.
// Usage: node scripts/review/import-metrics.mjs [--json out.json]
import {readFileSync,writeFileSync,statSync,readdirSync} from 'node:fs';
import {GLTFLoader} from '../../dist/vendor/GLTFLoader.js';
import {Vector3} from '../../dist/vendor/three.module.js';
import {buildCharacter} from '../../dist/characters.js';
import {attachTalaConcept} from '../../dist/tala-concept.js';
import {animateCharacter} from '../../dist/animation.js';
import {createScenario,stepScenario} from '../../dist/sandbox-recipes.js';
import {setLocomotionSource} from '../../dist/locomotion-clips.js';
import {airHeight} from '../../dist/air-motion.js';
globalThis.ProgressEvent??=class{constructor(t,d){Object.assign(this,d);}};
const root=new URL('../../',import.meta.url);
const bytes=readFileSync(new URL('dist/assets/tala-graphic/tala-graphic.glb',root));
const asset=await new GLTFLoader().parseAsync(bytes.buffer.slice(bytes.byteOffset,bytes.byteOffset+bytes.byteLength),'');
export const SCENARIOS=['ab-advance-guard','ab-retreat-attack','ab-circle-left-guard','ab-circle-right-guard','ab-knockdown-getup-guard','ab-advance-hit','ab-advance-strike-hitstop'];
export function run(name,source){
 setLocomotionSource(source);
 const r=buildCharacter(2,{variant:'graphic'});r.conceptOriginalSurfaces=[];r.g.traverse(n=>{if(n.isMesh&&n!==r.aura)r.conceptOriginalSurfaces.push(n);});attachTalaConcept(r,asset.scene.clone(true));
 const s=createScenario(name,2,1),frames=[];let time=0;
 const shin=()=>r.shinLength||r.legLength;
 for(let f=0;f<=(s.recipe.frames||90);f++){
  if(f>0)stepScenario(s);const p=s.m.players[0];
  const dt=f===0?0:s.m.hitstop>0||s.m.frozen?0:1/60;time+=dt;
  r.g.position.set(p.x,airHeight(p),p.z);r.g.rotation.y=Math.atan2(p.lookX,p.lookZ);
  animateCharacter(r,p,time);r.g.updateMatrixWorld(true);
  const ankles=r.knees.map(k=>k.localToWorld(new Vector3(0,-shin(),0)));
  // Visible joints only: r.body is the root pivot under the feet, not a body part, and swings below the floor when the root pitches.
  const joints=[r.head,r.spine,r.limbs[1].parent,...r.limbs,...r.elbows,...r.knees,r.limbs[0].userData.hand,r.limbs[2].userData.hand].map(j=>j.getWorldPosition(new Vector3()));
  const hands=[r.limbs[0].userData.hand,r.limbs[2].userData.hand].map(h=>h.getWorldPosition(new Vector3())),head=r.head.getWorldPosition(new Vector3());
  const hipsW=r.limbs[1].parent.getWorldPosition(new Vector3());
  const fwd=new Vector3(0,0,1).applyQuaternion(r.g.quaternion),right=new Vector3(1,0,0).applyQuaternion(r.g.quaternion);
  const local=v=>{const d=v.clone().sub(r.g.position);return {x:d.dot(right),y:d.y,z:d.dot(fwd)};};
  frames.push({f,anim:p.anim,hitstop:s.m.hitstop>0||!!s.m.frozen,getUp:p.getUp?.frame,ankles:ankles.map(a=>a.clone()),joints,
   pose:{...(r.pose||{})},hips:local(hipsW),hands:hands.map(local),head:local(head),plants:r.gaitPlants?.map(x=>!!x)||null,ground:r.g.position.y+(r.ankleHeight??.14)*r.g.scale.y,
   kneeFwd:r.knees.map((k,i)=>{const kn=local(k.getWorldPosition(new Vector3())),hip=local(r.limbs[i*2+1].getWorldPosition(new Vector3())),an=local(ankles[i]);return kn.z-(hip.z+an.z)/2;})});
 }
 return frames;
}
const range=v=>v.length?Math.max(...v)-Math.min(...v):0;
const round=(v,n=3)=>+v.toFixed(n);
export function measure(frames){
 const run=frames.filter(fr=>fr.anim==='run'&&!fr.hitstop);
 // Support-foot slide: a foot within 2 cm of its ground height is supporting; its horizontal travel from one frame to
 // the next is skating (a genuine slide in the source would show here too, which is why the README reports it per clip).
 let slide=0,slideMax=0,support=0;
 for(let i=1;i<frames.length;i++){const a=frames[i-1],b=frames[i];if(b.anim!=='run'||a.anim!=='run'||b.hitstop)continue;
  for(let k=0;k<2;k++){if(b.ankles[k].y-b.ground>.02||a.ankles[k].y-a.ground>.02)continue;const d=Math.hypot(b.ankles[k].x-a.ankles[k].x,b.ankles[k].z-a.ankles[k].z);slide+=d;slideMax=Math.max(slideMax,d);support++;}}
 // Continuity: the largest single-frame jump of any joint, outside hits (a hit snaps deliberately).
 let jump=0,jumpAt=null;for(let i=1;i<frames.length;i++){const a=frames[i-1],b=frames[i];if(['hurt','launch'].includes(b.anim)||b.hitstop)continue;for(let j=0;j<b.joints.length;j++){const d=b.joints[j].distanceTo(a.joints[j]);if(d>jump){jump=d;jumpAt=`${b.f} (${a.anim}→${b.anim})`;}}}
 // Hitstop freeze: the pose during consecutive hitstop frames must not change.
 let hitstopMove=0;for(let i=1;i<frames.length;i++)if(frames[i].hitstop&&frames[i-1].hitstop)for(let j=0;j<frames[i].joints.length;j++)hitstopMove=Math.max(hitstopMove,frames[i].joints[j].distanceTo(frames[i-1].joints[j]));
 const getUp=frames.filter(fr=>fr.getUp!==undefined);
 const NAMES=['head','chest','hips','L upper arm','L thigh','R upper arm','R thigh','L elbow','R elbow','L knee','R knee','L hand','R hand','L ankle','R ankle'];
 let lowest=null,lowestJoint=null;for(const fr of getUp){[...fr.joints,...fr.ankles].forEach((j,k)=>{if(lowest===null||j.y<lowest){lowest=j.y;lowestJoint=`${NAMES[k]} @ getUp frame ${fr.getUp}`;}});}
 const hipsUp=getUp.map(fr=>fr.hips.y);let dips=0;for(let i=1;i<hipsUp.length;i++)if(hipsUp[i]<hipsUp[i-1]-.02)dips++;
 return {
  runFrames:run.length,
  supportFrames:support,slideTotal:round(slide),slidePerSupportFrame:round(support?slide/support:0,4),slideMaxFrame:round(slideMax,4),
  pelvisSway:run.length?round(range(run.map(fr=>fr.hips.x))):0,pelvisBob:run.length?round(range(run.map(fr=>fr.hips.y))):0,
  hipYawRange:run.length?round(range(run.map(fr=>fr.pose.hipYaw||0))):0,chestTwistRange:run.length?round(range(run.map(fr=>fr.pose.twist||0))):0,
  kneesBackward:run.reduce((n,fr)=>n+fr.kneeFwd.filter(z=>z<-.02).length,0),
  handsBelowChin:run.length?round(run.filter(fr=>fr.hands.some(h=>h.y<fr.head.y-.45)).length/run.length,2):0,
  handsYRange:run.length?round(Math.max(...run.map(fr=>range(fr.hands.map(h=>h.y)))),3):0,
  maxJointJump:round(jump),maxJointJumpAt:jumpAt,hitstopFrames:frames.filter(f=>f.hitstop).length,hitstopMotion:round(hitstopMove,6),
  getUpFrames:getUp.length,getUpLowestPoint:lowest===null?null:round(lowest),getUpLowestJoint:lowestJoint,getUpHipDips:getUp.length?dips:null,getUpHipEnd:getUp.length?round(hipsUp.at(-1)):null
 };
}
if(import.meta.url===`file://${process.argv[1]}`){
 const out={clipBytes:Object.fromEntries(readdirSync(new URL('dist/clips/import/',root)).map(f=>[f,statSync(new URL('dist/clips/import/'+f,root)).size])),scenarios:{}};
 for(const name of SCENARIOS){out.scenarios[name]={};for(const src of ['authored','imported']){const t0=performance.now(),fr=run(name,src),ms=performance.now()-t0;out.scenarios[name][src]={...measure(fr),msPerFrame:round(ms/fr.length,2)};}}
 setLocomotionSource('authored');
 const i=process.argv.indexOf('--json');if(i>0)writeFileSync(process.argv[i+1],JSON.stringify(out,null,1));
 for(const [name,v] of Object.entries(out.scenarios)){console.log('\n'+name);for(const k of Object.keys(v.authored))console.log('  '+k.padEnd(22),String(v.authored[k]).padEnd(22),String(v.imported[k]));}
 console.log('\nclip bytes',JSON.stringify(out.clipBytes));
}
