import {burstPose} from './cinematics.js';
import {stagedCapturePose} from './captures.js';
import {createBurstEffects} from './burst-effects.js';
import {buildCharacter} from './characters.js';
import {animateCharacter,applyStagedPose} from './animation.js';
import {capturePose} from './choreography.js';
import * as T from './vendor/three.module.js';
import {fighters} from './fighters.js';
const v=(x=0,y=0,z=0)=>new T.Vector3(x,y,z);
export function createView(canvas){
 const renderer=new T.WebGLRenderer({canvas,antialias:true,alpha:false});renderer.setPixelRatio(Math.min(devicePixelRatio,1.7));renderer.shadowMap.enabled=true;renderer.shadowMap.type=T.PCFSoftShadowMap;renderer.outputColorSpace=T.SRGBColorSpace;renderer.toneMapping=T.ACESFilmicToneMapping;
 const scene=new T.Scene();scene.background=new T.Color('#10191c');scene.fog=new T.FogExp2('#10191c',.023);
 const camera=new T.PerspectiveCamera(40,1,.1,130);camera.position.set(14,9,18);
 scene.add(new T.HemisphereLight('#bad8de','#252b32',2.5));const sun=new T.DirectionalLight('#fff0cd',3);sun.position.set(-8,16,8);sun.castShadow=true;sun.shadow.mapSize.set(1024,1024);sun.shadow.camera.left=-18;sun.shadow.camera.right=18;sun.shadow.camera.top=15;sun.shadow.camera.bottom=-15;scene.add(sun);
 const rim=new T.DirectionalLight('#8cfaff',3);rim.position.set(5,7,-9);scene.add(rim);
 const mat=(color,metal=.1)=>new T.MeshStandardMaterial({color,roughness:.65,metalness:metal,flatShading:true});
 const ground=new T.Mesh(new T.CylinderGeometry(17,18,1,64),mat('#283c40',.3));ground.position.y=-.6;ground.receiveShadow=true;scene.add(ground);
 const ring=(r,color,y)=>{const o=new T.Mesh(new T.TorusGeometry(r,.027,5,120),new T.MeshBasicMaterial({color}));o.rotation.x=Math.PI/2;o.position.y=y;scene.add(o);return o;};
 ring(13,'#688b7e',-.06);ring(13.3,'#4c7066',-.06);ring(6,'#365b5a',-.06);ring(16.8,'#b7d17e',-.06);
 const grid=new T.GridHelper(25,20,'#466361','#32494a');grid.position.y=-.08;scene.add(grid);
 for(let j=0;j<12;j++){const angle=j*Math.PI/6;if(Math.sin(angle)>.15)continue;const g=new T.Group();g.position.set(Math.cos(angle)*19,0,Math.sin(angle)*19);g.rotation.y=-angle;const pillar=new T.Mesh(new T.BoxGeometry(1.8,7+(j%3)*2,1.8),mat('#1e3035'));pillar.position.y=2;pillar.rotation.z=(j%2?1:-1)*.08;pillar.castShadow=true;g.add(pillar);const strip=new T.Mesh(new T.BoxGeometry(.06,5,.04),new T.MeshBasicMaterial({color:'#98b999'}));strip.position.set(0,2,.94);g.add(strip);scene.add(g);}
 const portal=new T.Group();portal.position.set(0,6,-18);scene.add(portal);
 for(let j=0;j<3;j++){const mesh=new T.Mesh(new T.TorusGeometry(4+j*.4,.055,4,6),new T.MeshBasicMaterial({color:j===1?'#d9f975':'#4d8d91'}));mesh.rotation.z=j*.3;portal.add(mesh);}
 const starsGeo=new T.BufferGeometry();const coords=[];for(let j=0;j<260;j++){const a=j*2.39996,r=25+(j%19);coords.push(Math.sin(a)*r,5+(j%30),Math.cos(a)*r);}starsGeo.setAttribute('position',new T.Float32BufferAttribute(coords,3));scene.add(new T.Points(starsGeo,new T.PointsMaterial({color:'#90a9ad',size:.045})));
 const finisher=new T.Group();scene.add(finisher);
 const beam=new T.Mesh(new T.CylinderGeometry(.55,.9,12,8),new T.MeshBasicMaterial({color:'#6fe7ff',transparent:true,opacity:.65}));finisher.add(beam);
 const wheels=[];for(let j=0;j<5;j++){const wheel=new T.Mesh(new T.TorusGeometry(1.1+j*.25,.045,5,40),new T.MeshBasicMaterial({color:'#ffffff'}));finisher.add(wheel);wheels.push(wheel);}
 const burstFX=createBurstEffects(scene);
 const models=[],bolts=[],sparks=[];let selection=0,time=0,lastShot=null;
 function rig(id){const model=buildCharacter(id);
  const material=new T.MeshBasicMaterial({color:fighters[id].color,transparent:true,opacity:.22,depthWrite:false,side:T.DoubleSide});
  model.techniqueFX=new T.Mesh(new T.SphereGeometry(1,16,10),material);model.techniqueFX.position.y=1.2;model.techniqueFX.visible=false;model.g.add(model.techniqueFX);
  model.techniqueRing=new T.Mesh(new T.TorusGeometry(1,.035,6,48),material.clone());model.techniqueRing.material.opacity=.8;model.techniqueRing.position.y=1.2;model.techniqueRing.visible=false;model.g.add(model.techniqueRing);
  scene.add(model.g);return model;
 }
 function clear(){burstFX.reset();lastShot=null;for(const r of models){scene.remove(r.g);r.g.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose();});}models.length=0;}
 function select(id){selection=id;clear();models.push(rig(id));models[0].g.scale.setScalar(1.6);models[0].g.position.set(3.5,0,0);}
 function match(m){clear();m.players.forEach(p=>models.push(rig(p.id)));}
 function burst(x,z,color){for(let j=0;j<14;j++){const mesh=new T.Mesh(new T.OctahedronGeometry(.08),new T.MeshBasicMaterial({color}));mesh.position.set(x,1.5,z);scene.add(mesh);sparks.push({mesh,vel:v((Math.random()-.5)*8,Math.random()*7,(Math.random()-.5)*8),life:.4+Math.random()*.3});}}
 function render(dt,m,settings){
  time+=dt;portal.rotation.z=time*.04;portal.children[1].rotation.z=-time*.1;
  const width=innerWidth,height=innerHeight;if(canvas.width!==Math.floor(width*renderer.getPixelRatio())||canvas.height!==Math.floor(height*renderer.getPixelRatio())){renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();}
  const cinema=m?.cinematic;
  const stagedState=cinema&&(cinema.kind==='super'||cinema.profile)?(cinema.kind==='capture'?stagedCapturePose:burstPose)(fighters[m.players[cinema.a].id].id,cinema,m.players[cinema.a],m.players[cinema.b]):null;
  models.forEach((r,n)=>{
   const p=m?.players[n],anim=p?.anim||'idle',run=anim==='run',attack=['strike','attack','launch','pursuit','jumpAttack'].includes(anim);
   if(p){r.g.position.set(p.x,Math.sin(Math.min(1,p.air/.85)*Math.PI)*2.5,p.z);r.g.rotation.y=Math.atan2(p.lookX,p.lookZ);r.g.scale.setScalar(fighters[p.id].shape==='heavy'?1.12:1);}
   else{r.g.rotation.y=-.45+Math.sin(time*.2)*.12;r.g.position.y=Math.sin(time*1.4)*.04;}
   if(r.spirit)r.spirit.scale.setScalar(1);
   animateCharacter(r,p,time);
   const active=(p?.move?.kind==='technique'||!!p?.move?.special?.area)&&p.move.frame>=p.move.startup&&p.move.frame<p.move.startup+p.move.active;
   r.techniqueFX.visible=active&&(p.move.effect==='sphere'||!!p.move.special?.area);r.techniqueRing.visible=active;
   if(active){const progress=(p.move.frame-p.move.startup)/p.move.active;
    r.techniqueFX.scale.setScalar(p.move.special?.area||p.move.reach);r.techniqueFX.material.opacity=settings.reduced?.12:.22;
    r.techniqueRing.scale.setScalar(p.move.special?.area|| (p.move.effect==='sphere'?p.move.reach:p.move.effect==='spin'?2.4:1.1));
    r.techniqueRing.rotation.set(p.move.effect==='spin'?Math.PI/2:0,0,settings.reduced?0:progress*Math.PI*2);
   }
   if(anim==='hurt')r.g.rotation.z=.15;else r.g.rotation.z=0;
   r.aura.scale.setScalar(anim==='charge'?1.3+Math.sin(time*18)*.2:1);r.aura.material.color.set(anim==='charge'?'#ffffff':fighters[r.id].color);
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
  while(bolts.length<(m?.projectiles.length||0)){const b=new T.Mesh(new T.IcosahedronGeometry(.3,1),new T.MeshBasicMaterial({color:'#ffffff'}));const wheel=new T.Mesh(new T.TorusGeometry(.8,.09,6,24),b.material.clone());b.add(wheel);b.userData.wheel=wheel;scene.add(b);bolts.push(b);}
  bolts.forEach((b,j)=>{const p=m?.projectiles[j];b.visible=!!p;if(p){b.position.set(p.x,p.low?.35:1.4,p.z);b.material.color.set(fighters[m.players[p.owner].id].color);b.scale.set(p.kind==='crescent'?2.5:p.kind==='beam'?.5:1,p.kind==='beam'?.5:1,p.kind==='beam'?2.5:1);if(p.kind==='capture'||p.kind==='snare')b.scale.setScalar(1.7);b.userData.wheel.visible=p.kind==='wheel';b.userData.wheel.material.color.copy(b.material.color);if(p.kind==='wheel'){b.position.y=.9;b.rotation.set(0,Math.atan2(p.dx,p.dz)+Math.PI/2,time*7);}else{b.rotation.y=time*8;b.rotation.z=time*5;}}});
  for(let j=sparks.length-1;j>=0;j--){const s=sparks[j];s.life-=dt;s.mesh.position.addScaledVector(s.vel,dt);s.vel.y-=dt*15;s.mesh.scale.setScalar(Math.max(0,s.life*2));if(s.life<=0){scene.remove(s.mesh);s.mesh.geometry.dispose();s.mesh.material.dispose();sparks.splice(j,1);}}
  burstFX.update(stagedState,stagedState?models[cinema.a]:null,settings.reduced);
  finisher.visible=cinema?.kind==='capture'&&!stagedState;
  if(cinema?.kind==='capture'&&!stagedState){const c=m.cinematic,a=m.players[c.a],b=m.players[c.b],f=fighters[a.id];const victimModel=models[c.b].g;finisher.position.set(victimModel.position.x,victimModel.position.y+1,victimModel.position.z);beam.material.color.set(f.color);beam.visible=c.kind==='super'&&['aegis','sol'].includes(f.id);beam.scale.setScalar(Math.sin(c.t/c.duration*Math.PI));beam.position.y=3;wheels.forEach((wheel,j)=>{wheel.material.color.set(f.color);wheel.rotation.set(f.id==='rei'?j*.7:Math.PI/2,c.t*3+j,j*.4);wheel.position.y=Math.sin(c.t*4+j)*.6;wheel.scale.setScalar(.6+Math.sin(c.t/c.duration*Math.PI));});}
  const target=v(),pos=v();
  if(m){const [a,b]=m.players;const airHeight=Math.max(...[a,b].map(p=>Math.sin(Math.min(1,p.air/.85)*Math.PI)*2.5));target.set((a.x+b.x)/2,1.1+airHeight*.8,(a.z+b.z)/2);const distance=Math.hypot(a.x-b.x,a.z-b.z);pos.set(target.x+1.2,7+airHeight*.5+distance*.15,target.z+(13+distance*.7)/Math.min(1,camera.aspect/1.25));
   if(stagedState&&!settings.reduced){
    const shot=stagedState.camera;target.set(shot.target.x,shot.target.y,shot.target.z);
    const aspectScale=1/Math.min(1,camera.aspect/1.25);
    pos.set(target.x+(shot.position.x-target.x)*aspectScale,target.y+(shot.position.y-target.y)*aspectScale,target.z+(shot.position.z-target.z)*aspectScale);
    if(lastShot!==shot.shot){camera.position.copy(pos);lastShot=shot.shot;}
   }else if(m.cinematic&&!settings.reduced){const c=m.cinematic,a=m.players[c.a],b=m.players[c.b];const angle=Math.sin(c.t/c.duration*Math.PI)*.3;
    const capture=capturePose(c,a,b);
    target.set(capture.focus.x,capture.focus.y+1.2,capture.focus.z);
    const zoom=(9+capture.span*.65+(c.context==='far'?2:0))/Math.min(1,camera.aspect/1.25);
    pos.set(target.x+Math.sin(angle)*zoom,target.y+2.4,target.z+Math.cos(angle)*zoom);lastShot=null;
   }else lastShot=null;
  }else{target.set(-.8,1.5,0);pos.set(3.8,5.3,14);if(width<600){target.set(.9,1.8,0);pos.set(3,5.5,16);}}
  camera.position.lerp(pos,1-Math.exp(-dt*5));camera.lookAt(target);renderer.render(scene,camera);
 }
 select(0);return {select,match,render,burst,quality(q){renderer.setPixelRatio(q==='low'?1:Math.min(devicePixelRatio,1.7));const shadows=q!=='low';if(renderer.shadowMap.enabled!==shadows){renderer.shadowMap.enabled=shadows;scene.traverse(o=>{if(o.material)o.material.needsUpdate=true;});}}};
}
