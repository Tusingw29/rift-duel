import {cloneRig,disposeSkeletons} from './rig-clone.js';
import * as T from './vendor/three.module.js';
import {fighters} from './fighters.js';
// Attack-feel effects: weapon swing trails, dash afterimages and guard flashes.
// Pure helpers decide what to draw; the Three.js objects live in createTrailEffects.
export const TRAIL_SAMPLES=14,GHOST_POOL=4,GHOST_LIFE=.32,GHOST_INTERVAL=.05;
const weaponLength={blade:1.25,katana:1.5,greatsword:1.8};
// Local-space anchors on the striking hand: the trail ribbon spans base to tip.
export function trailAnchors(id,chain=1){
 const f=fighters.find(x=>x.id===id)||fighters[id];
 if(f.weapon in weaponLength){const length=weaponLength[f.weapon];return {hand:'right',base:[0,.15,.3],tip:[0,.15,.24+length],width:f.weapon==='greatsword'?.5:.3};}
 if(f.weapon==='staff')return {hand:'right',base:[0,.6,.06],tip:[0,1.75,.06],width:.35};
 if(f.weapon==='halo')return {hand:'right',base:[0,-.1,.12],tip:[0,.45,.12],width:.6};
 return {hand:chain%2===0?'left':'right',base:[0,.25,0],tip:[0,-.12,.05],width:.28};
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
  const ribbon=new T.Mesh(geometry,new T.MeshBasicMaterial({vertexColors:true,transparent:true,opacity:.85,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}));ribbon.frustumCulled=false;ribbon.visible=false;scene.add(ribbon);
  const shield=new T.Mesh(new T.CircleGeometry(.95,6),new T.MeshBasicMaterial({color:fighters[model.id].color,transparent:true,opacity:0,side:T.DoubleSide,depthWrite:false,blending:T.AdditiveBlending}));shield.visible=false;scene.add(shield);
  e={model,ribbon,shield,samples:[],ghosts:[],ghostClock:0,flash:0,flashColor:fighters[model.id].color};entries.set(model,e);all.push(e);return e;
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
   if(swinging){
    const anchors=trailAnchors(fighters[p.id].id,p.move.chain||1),hand=model.limbs[anchors.hand==='left'?0:2].userData.hand;
    hand.updateWorldMatrix(true,false);
    const base=tmp.set(...anchors.base).applyMatrix4(hand.matrixWorld).toArray(),tip=tmp2.set(...anchors.tip).applyMatrix4(hand.matrixWorld).toArray();
    e.samples.push([base,tip]);if(e.samples.length>TRAIL_SAMPLES)e.samples.shift();
   }else if(e.samples.length)e.samples.shift();
   if(e.samples.length>1){
    const data=ribbonData(e.samples,fighters[model.id].color),geometry=e.ribbon.geometry;
    geometry.attributes.position.array.set(data.positions);geometry.attributes.color.array.set(data.colors);
    geometry.setIndex(data.indices);geometry.setDrawRange(0,data.indices.length);geometry.attributes.position.needsUpdate=true;geometry.attributes.color.needsUpdate=true;e.ribbon.visible=true;
   }else e.ribbon.visible=false;
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
 function reset(){for(const e of all){scene.remove(e.ribbon);e.ribbon.geometry.dispose();e.ribbon.material.dispose();scene.remove(e.shield);e.shield.geometry.dispose();e.shield.material.dispose();for(const ghost of e.ghosts){scene.remove(ghost.g);disposeSkeletons(ghost.g);for(const mat of ghost.materials)mat.dispose();}}all.length=0;}
 return {update,reset,block,ghost:spawnGhost};
}
