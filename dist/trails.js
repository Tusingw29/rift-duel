import {cloneRig,disposeSkeletons} from './rig-clone.js';
import * as T from './vendor/three.module.js';
import {energyStyle} from './energy-style.js';
import {fighters} from './fighters.js';
// Attack-feel effects: weapon swing trails, dash afterimages and guard flashes.
// Pure helpers decide what to draw; the Three.js objects live in createTrailEffects.
export const TRAIL_SAMPLES=7,GHOST_POOL=4,GHOST_LIFE=.32,GHOST_INTERVAL=.05;
const weaponLength={blade:1.25,katana:1.5,greatsword:1.8};
// Local-space anchors on the striking hand: the trail ribbon spans base to tip.
export function trailAnchors(id,chain=1){
 const f=fighters.find(x=>x.id===id)||fighters[id];
 if(f.weapon in weaponLength){const length=weaponLength[f.weapon];return {hand:'right',base:[0,.15,.3],tip:[0,.15,.24+length],width:f.weapon==='greatsword'?.5:.3};}
 if(f.weapon==='staff')return {hand:'right',base:[0,.6,.06],tip:[0,1.75,.06],width:.35};
 if(f.weapon==='halo')return {hand:'right',base:[0,-.1,.12],tip:[0,.45,.12],width:.6};
 return {hand:chain%2===0?'left':'right',base:[0,.25,0],tip:[0,-.12,.05],width:.28};
}
// Measure the longest tagged blade surface in hand space (including the live costume replacement).
export function bladeAnchors(model,hand){
 hand.updateWorldMatrix(true,true);const inverse=hand.matrixWorld.clone().invert();let best=null;
 hand.traverse(mesh=>{if(!mesh.isMesh||!mesh.userData.weapon)return;
  const vertices=mesh.geometry.attributes.position,box=new T.Box3(),v=new T.Vector3();
  for(let i=0;i<vertices.count;i++)box.expandByPoint(v.fromBufferAttribute(vertices,i).applyMatrix4(mesh.matrixWorld).applyMatrix4(inverse));
  const length=box.max.z-box.min.z;if(length>.7&&(!best||length>best.length))best={box,length,mesh};
 });
 if(!best)return trailAnchors(model.id);
 const {min,max}=best.box,position=best.mesh.geometry.attributes.position;
 const end=z=>{const sum=new T.Vector3(),v=new T.Vector3();let count=0;for(let i=0;i<position.count;i++){v.fromBufferAttribute(position,i).applyMatrix4(best.mesh.matrixWorld).applyMatrix4(inverse);if(Math.abs(v.z-z)<.002){sum.add(v);count++;}}return sum.divideScalar(count||1).toArray();};
 return {hand:'right',base:end(min.z),tip:end(max.z),width:max.x-min.x};
}
// A swing is drawn from late wind-up through the first part of the follow-through.
export function swingWindow(move){
 if(!move||!['strike','technique','launch','forward','back','jumpAttack'].includes(move.kind))return false;
 if(move.kind==='technique'&&['sphere','wheel','fan'].includes(move.effect))return false;
 const active=move.active||1;
 return move.frame>=move.startup*.55&&move.frame<=move.startup+active+Math.min(move.recovery*.3,8);
}
export function dashing(p){
 if(!p)return false;
 if(p.move?.kind==='pursuit')return p.move.aerial?p.move.frame<p.move.startup+p.move.active:p.move.frame<p.move.startup;
 if(p.move?.kind==='technique'&&p.move.speed>0)return p.move.frame>=p.move.startup&&p.move.frame<p.move.startup+p.move.active;
 return p.anim==='roll'||(p.air>0&&!p.launched&&['jump','jumpAttack','recover'].includes(p.anim));
}
// Builds ribbon vertex data from ordered [base,tip] samples; older samples fade out.
export function ribbonData(samples,color){
 const c=new T.Color(color),positions=[],colors=[];
 samples.forEach(([base,tip],i)=>{
  const fade=samples.length>1?i/(samples.length-1):1;
  positions.push(base[0],base[1],base[2],tip[0],tip[1],tip[2]);
  for(let k=0;k<2;k++)colors.push(c.r*fade,c.g*fade,c.b*fade);
 });
 const indices=[];for(let i=0;i<samples.length-1;i++){const n=i*2;indices.push(n,n+1,n+2,n+1,n+3,n+2);}
 return {positions,colors,indices};
}
export function createTrailEffects(scene){
 const entries=new WeakMap(),all=[];const tmp=new T.Vector3(),tmp2=new T.Vector3();
 function entry(model){
  let e=entries.get(model);if(e)return e;
  const geometry=new T.BufferGeometry();geometry.setAttribute('position',new T.Float32BufferAttribute(new Float32Array(TRAIL_SAMPLES*6),3));geometry.setAttribute('color',new T.Float32BufferAttribute(new Float32Array(TRAIL_SAMPLES*6),3));
  const ribbon=new T.Mesh(geometry,new T.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.85,side:T.DoubleSide,depthWrite:false}));ribbon.frustumCulled=false;ribbon.visible=false;scene.add(ribbon);
  const indices=ribbonData(Array.from({length:TRAIL_SAMPLES},()=>[[0,0,0],[0,0,0]]),'#fff').indices;geometry.setIndex(indices);
  const shield=new T.Mesh(new T.CircleGeometry(.95,6),new T.MeshBasicMaterial({color:fighters[model.id].color,transparent:true,opacity:0,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}));shield.visible=false;scene.add(shield);
  const style=energyStyle(model.id),outline=new T.LineSegments(new T.BufferGeometry(),new T.LineBasicMaterial({color:style.ink}));outline.name='blade-ink-edge';outline.geometry.setAttribute('position',new T.Float32BufferAttribute(new Float32Array((TRAIL_SAMPLES-1)*12),3));outline.frustumCulled=false;scene.add(outline);
  const core=new T.Mesh(new T.BufferGeometry(),new T.MeshBasicMaterial({color:style.core,side:T.DoubleSide,transparent:true,opacity:.9,depthWrite:false}));core.geometry.setAttribute('position',new T.Float32BufferAttribute(new Float32Array(TRAIL_SAMPLES*6),3));core.geometry.setIndex(indices);core.frustumCulled=false;scene.add(core);
  const shards=Array.from({length:6},()=>{const s=new T.Mesh(new T.ConeGeometry(.035,.16,3),new T.MeshBasicMaterial({color:model.id===3?'#e26946':style.core}));s.visible=false;scene.add(s);return s;});
  e={model,ribbon,shield,outline,core,shards,lastTick:null,lastMove:null,sampleTicks:[],samples:[],ghosts:[],ghostClock:0,flash:0,flashColor:fighters[model.id].color};entries.set(model,e);all.push(e);return e;
 }
 function makeGhost(model){
  const originals=[];model.g.traverse(n=>originals.push(n));
  const g=cloneRig(model.g),copies=[],materials=new Map();
  g.traverse(n=>{copies.push(n);if(n.isMesh){n.castShadow=false;n.receiveShadow=false;if(!materials.has(n.material)){const m=n.material.clone();m.transparent=true;m.depthWrite=false;m.opacity=0;if(m.color)m.color.set(fighters[model.id].color);materials.set(n.material,m);}n.material=materials.get(n.material);}});
  g.visible=false;scene.add(g);return {g,pairs:copies.map((c,i)=>[c,originals[i]]),materials:[...materials.values()],life:0};
 }
 function spawnGhost(model){
  const e=entry(model);let ghost=e.ghosts.find(x=>x.life<=0);
  if(!ghost){if(e.ghosts.length>=GHOST_POOL)ghost=e.ghosts.reduce((a,b)=>a.life<b.life?a:b);else{ghost=makeGhost(model);e.ghosts.push(ghost);}}
  for(const [copy,original] of ghost.pairs.slice(1)){copy.position.copy(original.position);copy.quaternion.copy(original.quaternion);copy.scale.copy(original.scale);}
  ghost.g.position.copy(model.g.position);ghost.g.rotation.copy(model.g.rotation);ghost.g.scale.copy(model.g.scale);ghost.g.visible=true;ghost.life=GHOST_LIFE;
 }
 function block(model,perfect){const e=entry(model);e.flash=1;e.flashColor=perfect?'#ffffff':fighters[model.id].color;}
 function update(models,m,dt,reduced=false){
  models.forEach((model,n)=>{
   const p=m?.players[n],e=entry(model);
   // Weapon trail.
   const swinging=!!p&&swingWindow(p.move)&&!reduced;
   const tick=m?.tick??0,newFrame=e.lastTick!==tick;
   if(e.lastTick!==null&&tick<e.lastTick){e.samples.length=0;e.sampleTicks.length=0;}
   if(p?.move!==e.lastMove){e.samples.length=0;e.sampleTicks.length=0;e.lastMove=p?.move;}
   if(newFrame){
    while(e.sampleTicks.length&&e.sampleTicks[0]<tick-TRAIL_SAMPLES+1){e.sampleTicks.shift();e.samples.shift();}
    if(swinging){
     const fallback=trailAnchors(fighters[p.id].id,p.move.chain||1),hand=model.limbs[fallback.hand==='left'?0:2].userData.hand;
     const anchors=[0,1,3].includes(p.id)?bladeAnchors(model,hand):fallback;
     hand.updateWorldMatrix(true,false);
     const base=tmp.set(...anchors.base).applyMatrix4(hand.matrixWorld).toArray(),tip=tmp2.set(...anchors.tip).applyMatrix4(hand.matrixWorld).toArray();
     e.samples.push([base,tip]);e.sampleTicks.push(tick);
    }
    e.lastTick=tick;
   }
   e.ribbon.visible=e.samples.length>1&&!reduced;e.outline.visible=e.core.visible=e.ribbon.visible&&[0,3].includes(model.id);e.shards.forEach(s=>s.visible=false);
   if(e.ribbon.visible){
    const style=energyStyle(model.id),data=ribbonData(e.samples,style.color),geometry=e.ribbon.geometry;
    geometry.attributes.position.array.set(data.positions);geometry.attributes.color.array.set(data.colors);
    geometry.setDrawRange(0,data.indices.length);geometry.attributes.position.needsUpdate=true;geometry.attributes.color.needsUpdate=true;
    const coreSamples=e.samples.map(([a,b],i)=>{const at=t=>a.map((x,k)=>x+(b[k]-x)*t);return [at(model.id===3?.62+(i%2)*.15:.76),at(.96)];});
    const c=ribbonData(coreSamples,style.core);e.core.geometry.attributes.position.array.set(c.positions);e.core.geometry.attributes.position.needsUpdate=true;e.core.geometry.setDrawRange(0,c.indices.length);
    const edges=[];for(let j=1;j<e.samples.length;j++)for(let side=0;side<2;side++)edges.push(...e.samples[j-1][side],...e.samples[j][side]);
    e.outline.geometry.attributes.position.array.set(edges);e.outline.geometry.attributes.position.needsUpdate=true;e.outline.geometry.setDrawRange(0,edges.length/3);
    e.shards.forEach((s,j)=>{const pair=e.samples[Math.max(0,e.samples.length-1-j)];s.visible=e.outline.visible;s.position.set(...pair[1]);s.position.y+=j*.025;s.rotation.set(j*.8,tick*.35,j);s.scale.setScalar(1-j*.12);});
   }
   // Afterimages.
   e.ghostClock-=dt;
   if(p&&dashing(p)&&!reduced&&e.ghostClock<=0){spawnGhost(model);e.ghostClock=GHOST_INTERVAL;}
   for(const ghost of e.ghosts){if(ghost.life<=0){ghost.g.visible=false;continue;}ghost.life-=dt;const o=Math.max(0,ghost.life/GHOST_LIFE)*.45;for(const mat of ghost.materials)mat.opacity=o;ghost.g.visible=o>.01;}
   // Guard shield: faint while guarding, flashes on a block or deflect.
   e.flash=Math.max(0,e.flash-dt*5);
   const guarding=!!p?.guard;
   if(p&&(guarding||e.flash>0)){
    const other=m.players[1-n],dx=other.x-p.x,dz=other.z-p.z,d=Math.hypot(dx,dz)||1;
    e.shield.position.set(p.x+dx/d*.75,1.15,p.z+dz/d*.75);e.shield.lookAt(other.x,1.15,other.z);
    e.shield.material.color.set(e.flash>0?e.flashColor:fighters[model.id].color);
    e.shield.material.opacity=reduced?(guarding?.12:0):(guarding?.14:0)+e.flash*.6;e.shield.scale.setScalar(1+e.flash*.35);e.shield.visible=e.shield.material.opacity>.01;
   }else e.shield.visible=false;
  });
 }
 function reset(){for(const e of all){for(const obj of [e.outline,e.core,...e.shards]){scene.remove(obj);obj.geometry.dispose();obj.material.dispose();}scene.remove(e.ribbon);e.ribbon.geometry.dispose();e.ribbon.material.dispose();scene.remove(e.shield);e.shield.geometry.dispose();e.shield.material.dispose();for(const ghost of e.ghosts){scene.remove(ghost.g);disposeSkeletons(ghost.g);for(const mat of ghost.materials)mat.dispose();}}all.length=0;}
 return {update,reset,block,ghost:spawnGhost,entries:all};
}
