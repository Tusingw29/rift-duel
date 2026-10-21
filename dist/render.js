import {airHeight} from './air-motion.js';
import {loadTalaConcept,attachTalaConcept} from './tala-concept.js';
import {disposeSkeletons} from './rig-clone.js';
import {createProjectileVisual,updateProjectileVisual} from './projectile-visuals.js';
import {burstPose} from './cinematics.js';
import {stagedCapturePose} from './captures.js';
import {createBurstEffects} from './burst-effects.js';
import {buildCharacter} from './characters.js';
import {animateCharacter,applyStagedPose} from './animation.js';
import {capturePose} from './choreography.js';
import {arenas,arenaFor,createArena} from './arenas.js';
import {createTrailEffects} from './trails.js';
import {createLighting,createEnvironment,upgradeMaterials} from './shading.js';
import * as T from './vendor/three.module.js';
import {fighters} from './fighters.js';
const v=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
const smooth=t=>{t=Math.max(0,Math.min(1,t));return t*t*(3-2*t);};
export function createView(canvas,options={}){
 let talaModel=options.talaModel||'concept';
 const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;renderer.toneMappingExposure=1.0;
 const scene=new T.Scene();scene.background=new T.Color('#10191c');scene.fog=new T.FogExp2('#10191c',.023);
 const camera=new T.PerspectiveCamera(40,1,.1,130);camera.position.set(14,9,18);
 const {hemisphere,sun,rim}=createLighting(scene);
 // Image-based lighting: a prefiltered studio tinted toward each arena's sky and ground.
 let environment=null;
 function environmentFor(def){environment?.dispose();const sky=new T.Color(def?.sky||'#8fb8d8').lerp(new T.Color('#ffffff'),.45),ground=new T.Color(def?.ground||'#6b5a46').lerp(new T.Color('#ffffff'),.15);environment=createEnvironment(renderer,'#'+sky.getHexString(),'#'+ground.getHexString(),def?.sun||'#fff2d0');scene.environment=environment;}
 environmentFor(null);
 let stage=null,stageId=null;
 function arena(fighterIndex){
  const id=fighters[fighterIndex].id;if(stageId===id)return;stageId=id;
  if(stage){scene.remove(stage.group);stage.dispose();}
  const def=arenas[id];stage=createArena(def);upgradeMaterials(stage.group,'arena');scene.add(stage.group);environmentFor(def);
  scene.background.set(def.sky);scene.fog.color.set(def.sky);scene.fog.density=def.fog;
  hemisphere.color.set(def.hemisphere[0]);hemisphere.groundColor.set(def.hemisphere[1]);sun.color.set(def.sun);rim.color.set(def.rim);
 }
 const finisher=new T.Group();scene.add(finisher);
 const beam=new T.Mesh(new T.CylinderGeometry(.55,.9,12,8),new T.MeshBasicMaterial({color:'#6fe7ff',transparent:true,opacity:.65}));finisher.add(beam);
 const wheels=[];for(let j=0;j<5;j++){const wheel=new T.Mesh(new T.TorusGeometry(1.1+j*.25,.045,5,40),new T.MeshBasicMaterial({color:'#ffffff'}));finisher.add(wheel);wheels.push(wheel);}
 const burstFX=createBurstEffects(scene),trailFX=createTrailEffects(scene);
 const models=[],bolts=[],sparks=[];let selection=0,time=0,lastShot=null,lastCue=null,shakeAmount=0;
 const lookTarget=v(-.8,1.5,0);
 function rig(id){const model=buildCharacter(id);upgradeMaterials(model.g,'cloth');
  model.talaStatus=id===2?'classic':null;
  if(id===2&&['concept','design02'].includes(talaModel)){
   const variant=talaModel;
   model.talaStatus='loading';
   model.conceptPending=true;model.conceptOriginalSurfaces=[];model.g.traverse(n=>{if(n.isMesh&&n!==model.aura)model.conceptOriginalSurfaces.push(n);});
   loadTalaConcept(variant).then(asset=>{if(model.conceptPending){attachTalaConcept(model,asset.scene);upgradeMaterials(model.g,'cloth');model.talaStatus=variant;document.dispatchEvent(new CustomEvent('tala-concept-status',{detail:variant==='design02'?'Design 02 fight preview':'Concept model preview'}));}}).catch(error=>{if(model.conceptPending){model.talaStatus='fallback';console.warn('Tala model fallback:',error);document.dispatchEvent(new CustomEvent('tala-concept-status',{detail:'Concept unavailable — original model loaded'}));}});
  }
  const material=new T.MeshBasicMaterial({color:fighters[id].color,transparent:true,opacity:.22,depthWrite:false,side:T.DoubleSide});
  model.techniqueFX=new T.Mesh(new T.SphereGeometry(1,16,10),material);model.techniqueFX.position.y=1.2;model.techniqueFX.visible=false;model.g.add(model.techniqueFX);
  model.techniqueRing=new T.Mesh(new T.TorusGeometry(1,.035,6,48),material.clone());model.techniqueRing.material.opacity=.8;model.techniqueRing.position.y=1.2;model.techniqueRing.visible=false;model.g.add(model.techniqueRing);
  scene.add(model.g);return model;
 }
 function clear(){burstFX.reset();trailFX.reset();lastShot=null;lastCue=null;for(const r of models){r.conceptPending=false;scene.remove(r.g);disposeSkeletons(r.g);r.g.traverse(o=>{o.geometry?.dispose();if(o.material){o.material.map?.dispose();o.material.dispose();}});}models.length=0;}
 function select(id){selection=id;clear();models.push(rig(id));models[0].g.scale.setScalar(1.6);models[0].g.position.set(3.5,0,0);arena(id);}
 function match(m,arenaIndex){clear();m.players.forEach(p=>models.push(rig(p.id)));arena(Number.isInteger(arenaIndex)?arenaIndex:m.players[1].id);}
 function burst(x,z,color,count=14){for(let j=0;j<count;j++){const mesh=new T.Mesh(new T.OctahedronGeometry(.08),new T.MeshBasicMaterial({color}));mesh.position.set(x,1.5,z);scene.add(mesh);sparks.push({mesh,vel:v((Math.random()-.5)*8,Math.random()*7,(Math.random()-.5)*8),life:.4+Math.random()*.3});}}
 function shake(amount){shakeAmount=Math.min(1.2,shakeAmount+amount);}
 const liftOf=airHeight;
 // Lock-on camera: behind the first player, looking across at the rival, Evil Zone style.
 function lockCamera(m,pos,target,airHeight){
  const [a,b]=m.players;const dx=b.x-a.x,dz=b.z-a.z,d=Math.hypot(dx,dz)||1,fx=dx/d,fz=dz/d,rx=-fz,rz=fx;
  // At close range the camera slides further to the side and up so the rival stays visible past the player's back.
  const widen=1/Math.min(1,camera.aspect/1.25),close=Math.max(0,4.5-d),back=(6.6+d*.22)*widen,height=3.4+d*.1+airHeight*.6+close*.3,side=1.9+close*.45;
  pos.set(a.x-fx*back+rx*side,height,a.z-fz*back+rz*side);
  const ahead=Math.min(d,3.4+d*.4);target.set(a.x+fx*ahead+rx*.4,1.35+airHeight*.7,a.z+fz*ahead+rz*.4);
 }
 function sideCamera(m,pos,target,airHeight){
  const [a,b]=m.players;target.set((a.x+b.x)/2,1.1+airHeight*.8,(a.z+b.z)/2);const distance=Math.hypot(a.x-b.x,a.z-b.z);const dx=(b.x-a.x)/(distance||1),dz=(b.z-a.z)/(distance||1),back=(8+distance*.65)/Math.min(1,camera.aspect/1.25);pos.set(target.x-dz*back-dx*2,3+airHeight*.5+distance*.035,target.z+dx*back-dz*2);
 }
 function render(dt,m,settings,cue=null){
  time+=dt;stage?.update(time);
  const width=innerWidth,height=innerHeight;if(canvas.width!==Math.floor(width*renderer.getPixelRatio())||canvas.height!==Math.floor(height*renderer.getPixelRatio())){renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();}
  const cinema=m?.cinematic;
  const stagedState=cinema&&(cinema.kind==='super'||cinema.profile)?(cinema.kind==='capture'?stagedCapturePose:burstPose)(fighters[m.players[cinema.a].id].id,cinema,m.players[cinema.a],m.players[cinema.b]):null;
  models.forEach((r,n)=>{
   let p=m?.players[n];
   if(p&&cue?.kind==='ko'){
    // Hold the round-ending moment: winner poses, a knocked-out loser stays down.
    if(n===cue.winner)p={...p,move:null,guard:false,anim:'victory',animTime:cue.progress*(cue.duration||1.7)};
    else if(n===cue.loser&&cue.reason==='ko')p={...p,move:null,guard:false,anim:'defeat',animTime:Math.max(p.animTime,cue.progress*2)};
   }
   const anim=p?.anim||'idle';
   if(p){r.g.position.set(p.x,liftOf(p),p.z);r.g.rotation.y=Math.atan2(p.lookX,p.lookZ);r.g.scale.setScalar(fighters[p.id].shape==='heavy'?1.12:1);}
   else{r.g.rotation.y=-.45+Math.sin(time*.2)*.12;r.g.position.y=Math.sin(time*1.4)*.04;}
   if(r.spirit)r.spirit.scale.setScalar(1);
   r.g.rotation.z=anim==='hurt'?.15:0;
   animateCharacter(r,p,time);
   const areaSpec=p?.move?.stockSpecial||p?.move?.special;
   const active=(p?.move?.kind==='technique'||!!areaSpec?.area)&&p.move.frame>=p.move.startup&&p.move.frame<p.move.startup+p.move.active;
   r.techniqueFX.visible=active&&(p.move.effect==='sphere'||!!areaSpec?.area);r.techniqueRing.visible=active;
   r.techniqueFX.position.set(0,1.2,0);r.techniqueRing.position.set(0,1.2,0);
   if(active){const progress=(p.move.frame-p.move.startup)/p.move.active;
    if(areaSpec?.advance){const advance=areaSpec.advance*(1+Math.floor((p.move.frame-p.move.startup)/areaSpec.interval));r.techniqueFX.position.z=advance;r.techniqueRing.position.z=advance;}
    r.techniqueFX.scale.setScalar(areaSpec?.area||p.move.reach);r.techniqueFX.material.opacity=settings.reduced?.12:.22;
    r.techniqueRing.scale.setScalar(areaSpec?.area|| (p.move.effect==='sphere'?p.move.reach:p.move.effect==='spin'?2.4:1.1));
    r.techniqueRing.rotation.set(p.move.effect==='spin'?Math.PI/2:0,0,settings.reduced?0:progress*Math.PI*2);
   }
   // Hurt flash and charge glow share the aura.
   const flash=anim==='hurt'&&(p?.animTime||0)>.3;
   r.aura.scale.setScalar(anim==='charge'?1.3+Math.sin(time*18)*.2:flash?1.5:1);r.aura.material.color.set(anim==='charge'||flash?'#ffffff':fighters[r.id].color);
   if(m?.cinematic){const c=m.cinematic;
    if(c.kind==='capture'&&!stagedState){
     const pose=capturePose(c,m.players[c.a],m.players[c.b]),part=n===c.a?pose.actor:pose.victim;
     r.g.position.set(part.x,part.y,part.z);r.g.rotation.x=part.tilt;r.limbs[0].rotation.x=part.arm;r.limbs[2].rotation.x=part.arm;
    }else if(stagedState){const part=n===c.a?stagedState.actor:stagedState.victim;
     applyStagedPose(r,part);
     if(r.spirit&&n===c.a){r.spirit.scale.setScalar(1.4);r.spirit.userData.material.opacity=.5;}
    }
   }else r.g.rotation.x=0;
  });
  trailFX.update(models,m,dt,settings.reduced);
  while(bolts.length<(m?.projectiles.length||0)){const b=createProjectileVisual();scene.add(b);bolts.push(b);}
  bolts.forEach((b,j)=>{const p=m?.projectiles[j];updateProjectileVisual(b,p,p?fighters[m.players[p.owner].id].color:'#ffffff',time);});
  for(let j=sparks.length-1;j>=0;j--){const s=sparks[j];s.life-=dt;s.mesh.position.addScaledVector(s.vel,dt);s.vel.y-=dt*15;s.mesh.scale.setScalar(Math.max(0,s.life*2));if(s.life<=0){scene.remove(s.mesh);s.mesh.geometry.dispose();s.mesh.material.dispose();sparks.splice(j,1);}}
  burstFX.update(stagedState,stagedState?models[cinema.a]:null,settings.reduced);
  finisher.visible=cinema?.kind==='capture'&&!stagedState;
  if(cinema?.kind==='capture'&&!stagedState){const c=m.cinematic,a=m.players[c.a],b=m.players[c.b],f=fighters[a.id];const victimModel=models[c.b].g;finisher.position.set(victimModel.position.x,victimModel.position.y+1,victimModel.position.z);beam.material.color.set(f.color);beam.visible=c.kind==='super'&&['aegis','sol'].includes(f.id);beam.scale.setScalar(Math.sin(c.t/c.duration*Math.PI));beam.position.y=3;wheels.forEach((wheel,j)=>{wheel.material.color.set(f.color);wheel.rotation.set(f.id==='rei'?j*.7:Math.PI/2,c.t*3+j,j*.4);wheel.position.y=Math.sin(c.t*4+j)*.6;wheel.scale.setScalar(.6+Math.sin(c.t/c.duration*Math.PI));});}
  const target=v(),pos=v();let cut=false;
  if(m){const [a,b]=m.players;const airHeight=Math.max(liftOf(a),liftOf(b));
   (settings.camera==='side'?sideCamera:lockCamera)(m,pos,target,airHeight);
   if(stagedState&&!settings.reduced){
    const shot=stagedState.camera;target.set(shot.target.x,shot.target.y,shot.target.z);
    const aspectScale=1/Math.min(1,camera.aspect/1.25);
    pos.set(target.x+(shot.position.x-target.x)*aspectScale,target.y+(shot.position.y-target.y)*aspectScale,target.z+(shot.position.z-target.z)*aspectScale);
    if(lastShot!==shot.shot){cut=true;lastShot=shot.shot;}
   }else if(m.cinematic&&!settings.reduced){const c=m.cinematic,a=m.players[c.a],b=m.players[c.b];const angle=Math.sin(c.t/c.duration*Math.PI)*.3;
    const capture=capturePose(c,a,b);
    target.set(capture.focus.x,capture.focus.y+1.2,capture.focus.z);
    const zoom=(9+capture.span*.65+(c.context==='far'?2:0))/Math.min(1,camera.aspect/1.25);
    pos.set(target.x+Math.sin(angle)*zoom,target.y+2.4,target.z+Math.cos(angle)*zoom);lastShot=null;
   }else if(cue?.kind==='intro'&&!settings.reduced){
    // Opening sweep: orbit the pair from a low side angle into the fighting camera.
    const blend=smooth(cue.progress),mid=v((a.x+b.x)/2,1.3,(a.z+b.z)/2),dx=b.x-a.x,dz=b.z-a.z,base=Math.atan2(dz,dx),angle=base+Math.PI*.5+blend*Math.PI*.5,radius=(11-blend*2)/Math.min(1,camera.aspect/1.25);
    const orbit=v(mid.x+Math.cos(angle)*radius,2.2+blend*1,mid.z+Math.sin(angle)*radius);
    pos.lerpVectors(orbit,pos,blend);target.lerpVectors(mid,target,blend);
    if(lastCue!=='intro')cut=true;lastShot=null;
   }else if(cue?.kind==='ko'&&!settings.reduced&&cue.loser>=0){
    // Round over: cut to the winner's side and push in on the fallen rival.
    const loser=m.players[cue.loser],winner=m.players[cue.winner],dx=winner.x-loser.x,dz=winner.z-loser.z,d=Math.hypot(dx,dz)||1,fx=dx/d,fz=dz/d,push=smooth(cue.progress);
    const widen=1/Math.min(1,camera.aspect/1.25),back=(5.2-push*1.6)*widen;
    // Camera sits beside the fallen fighter, with the winner standing at the frame's edge.
    target.set(loser.x+fx*.9,.8+push*.2,loser.z+fz*.9);pos.set(loser.x+fx*2.4-fz*back,2.3-push*.9,loser.z+fz*2.4+fx*back);
    if(lastCue!=='ko')cut=true;lastShot=null;
   }else lastShot=null;
  }else{target.set(-.8,1.5,0);pos.set(3.8,5.3,14);if(width<600){target.set(.9,1.8,0);pos.set(3,5.5,16);}}
  lastCue=cue?.kind||null;
  if(cut){camera.position.copy(pos);lookTarget.copy(target);}
  else{const rate=cue?.kind==='ko'?3:m?6:5;camera.position.lerp(pos,1-Math.exp(-dt*rate));lookTarget.lerp(target,1-Math.exp(-dt*rate*1.5));}
  if(shakeAmount>0&&!settings.reduced){const s=shakeAmount*.25;camera.position.x+=(Math.random()-.5)*s;camera.position.y+=(Math.random()-.5)*s;camera.position.z+=(Math.random()-.5)*s;}
  shakeAmount=Math.max(0,shakeAmount-dt*4);
  camera.lookAt(lookTarget);renderer.render(scene,camera);
 }
 select(0);return {select,match,arena,render,burst,shake,setTalaModel(value){talaModel=['classic','design02'].includes(value)?value:'concept';},get talaModels(){return models.filter(r=>r.id===2).map(r=>r.talaStatus);},block(n,perfect){if(models[n])trailFX.block(models[n],perfect);},ghost(n){if(models[n])trailFX.ghost(models[n]);},get arenaName(){return stageId?arenas[stageId].name:'';},quality(q){renderer.setPixelRatio(q==='low'?1:Math.min(devicePixelRatio,2));const shadows=q!=='low';if(renderer.shadowMap.enabled!==shadows){renderer.shadowMap.enabled=shadows;scene.traverse(o=>{if(o.material)o.material.needsUpdate=true;});}}};
}
