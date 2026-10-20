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
 const models=[],bolts=[],sparks=[];let selection=0,time=0;
 function rig(id){
  const f=fighters[id],g=new T.Group();const cloth=mat(f.dark),armor=mat(f.color,.35),black=mat('#18212a'),skin=mat('#cfa98c'),glow=new T.MeshBasicMaterial({color:f.color});
  const mesh=(geo,material,x,y,z,parent=g)=>{const m=new T.Mesh(geo,material);m.position.set(x,y,z);m.castShadow=true;parent.add(m);return m;};
  const box=(w,h,d,m,x,y,z,parent)=>mesh(new T.BoxGeometry(w,h,d),m,x,y,z,parent);
  const wide=f.shape==='heavy'?1.3:f.shape==='mage'?.8:1;
  const torso=box(.75*wide,.85,.4,cloth,0,1.65,0);torso.rotation.z=.03;
  mesh(new T.CylinderGeometry(.28*wide,.4*wide,.42,6),cloth,0,1.05,0);
  box(.75*wide,.09,.45,armor,0,1.23,0);box(.18,.24,.04,glow,0,1.68,.23);
  const head=new T.Group();head.position.y=2.35;g.add(head);
  mesh(new T.IcosahedronGeometry(.29,1),f.shape==='armor'?armor:skin,0,0,0,head);
  if(f.shape==='armor'||f.shape==='heavy'){box(.49,.1,.13,black,0,.02,.24,head);box(.38,.035,.02,glow,0,.015,.32,head);mesh(new T.ConeGeometry(.1,.38,4),armor,.23,.29,0,head);}
  else{const hair=mesh(new T.SphereGeometry(.3,7,5,0,Math.PI*2,0,Math.PI*.6),mat(f.id==='rei'?'#e7e4de':f.id==='tala'?'#232630':'#3c3551'),0,.08,-.025,head);hair.rotation.x=-.2;box(.33,.04,.02,black,0,0,.265,head);}
  const limbs=[];
  for(const side of [-1,1]){
   const arm=new T.Group();arm.position.set(side*.48*wide,1.98,0);g.add(arm);limbs.push(arm);
   mesh(new T.IcosahedronGeometry(f.shape==='heavy'?.3:.22,0),armor,0,-.03,0,arm);
   box(.19,.43,.21,cloth,0,-.28,0,arm);box(.24,.35,.26,armor,0,-.6,.04,arm);mesh(new T.IcosahedronGeometry(.15,0),f.shape==='martial'?skin:black,0,-.82,.08,arm);
   const leg=new T.Group();leg.position.set(side*.22,.97,0);g.add(leg);limbs.push(leg);box(.24,.48,.26,cloth,0,-.25,0,leg);box(.27,.4,.28,armor,0,-.64,.01,leg);box(.28,.16,.44,black,0,-.89,.09,leg);
  }
  if(['coat','mage','oracle'].includes(f.shape)){const coat=mesh(new T.CylinderGeometry(.35,.65,.9,6,1,true),cloth,0,.9,-.06);coat.material.side=T.DoubleSide;box(.17,.9,.07,armor,-.26,.9,.33);box(.17,.9,.07,armor,.26,.9,.33);}
  if(f.shape==='martial'){box(.25,.9,.08,armor,.32,.85,-.1);box(.23,.12,.5,armor,0,2.42,0);}
  if(f.weapon==='blade'||f.weapon==='katana'||f.weapon==='greatsword'){
   const hand=limbs[2];const length=f.weapon==='greatsword'?1.9:1.45;const blade=box(f.weapon==='greatsword'?.24:.1,length,.065,armor,0,-.82,.25+length/2,hand);blade.rotation.x=Math.PI/2;box(.5,.08,.12,black,0,-.82,.25,hand);
  }
  if(f.weapon==='staff'){box(.07,2.4,.07,armor,0,-.4,.18,limbs[2]);mesh(new T.IcosahedronGeometry(.27,0),glow,0,.8,.18,limbs[2]);}
  if(f.weapon==='halo'){const halo=new T.Mesh(new T.TorusGeometry(.65,.035,5,24),glow);halo.position.set(0,2.8,-.16);g.add(halo);}
  if(f.shape==='armor'){const cape=mesh(new T.ConeGeometry(.6,1.5,3,1,true),mat('#657f86'),0,1.35,-.32);cape.rotation.x=.23;}
  const shadow=new T.Mesh(new T.CircleGeometry(.65,24),new T.MeshBasicMaterial({color:'#090f16',transparent:true,opacity:.4,depthWrite:false}));shadow.rotation.x=-Math.PI/2;shadow.position.y=.015;g.add(shadow);
  const aura=new T.Mesh(new T.TorusGeometry(.85,.025,5,40),glow);aura.rotation.x=Math.PI/2;aura.position.y=.08;g.add(aura);
  scene.add(g);return {g,limbs,head,aura,id};
 }
 function clear(){for(const r of models){scene.remove(r.g);r.g.traverse(o=>{o.geometry?.dispose();if(o.material)o.material.dispose();});}models.length=0;}
 function select(id){selection=id;clear();models.push(rig(id));models[0].g.scale.setScalar(1.6);models[0].g.position.set(3.5,0,0);}
 function match(m){clear();m.players.forEach(p=>models.push(rig(p.id)));}
 function burst(x,z,color){for(let j=0;j<14;j++){const mesh=new T.Mesh(new T.OctahedronGeometry(.08),new T.MeshBasicMaterial({color}));mesh.position.set(x,1.5,z);scene.add(mesh);sparks.push({mesh,vel:v((Math.random()-.5)*8,Math.random()*7,(Math.random()-.5)*8),life:.4+Math.random()*.3});}}
 function render(dt,m,settings){
  time+=dt;portal.rotation.z=time*.04;portal.children[1].rotation.z=-time*.1;
  const width=innerWidth,height=innerHeight;if(canvas.width!==Math.floor(width*renderer.getPixelRatio())||canvas.height!==Math.floor(height*renderer.getPixelRatio())){renderer.setSize(width,height,false);camera.aspect=width/height;camera.updateProjectionMatrix();}
  models.forEach((r,n)=>{
   const p=m?.players[n],anim=p?.anim||'idle',run=anim==='run',attack=['strike','attack','launch','pursuit','jumpAttack'].includes(anim);
   if(p){r.g.position.set(p.x,Math.sin(Math.min(1,p.air/.85)*Math.PI)*2.5,p.z);r.g.rotation.y=Math.atan2(p.lookX,p.lookZ);r.g.scale.setScalar(fighters[p.id].shape==='heavy'?1.12:1);}
   else{r.g.rotation.y=-.45+Math.sin(time*.2)*.12;r.g.position.y=Math.sin(time*1.4)*.04;}
   r.limbs.forEach((limb,j)=>{limb.rotation.set(run?Math.sin(time*13+(j<2?0:Math.PI))*.55:Math.sin(time*2+j)*.06,0,j%2===0?(j===0?.12:-.12):0);});
   if(attack){r.limbs[2].rotation.x=-1.4+Math.sin((p.animTime||0)*12)*.6;r.limbs[0].rotation.x=-.7;r.g.rotation.y+=Math.sin((p.animTime||0)*10)*.35;}
   if(anim==='jump'||anim==='jumpAttack'||anim==='recover'){r.limbs[1].rotation.x=-.7;r.limbs[3].rotation.x=.6;}
   if(p?.guard){r.limbs[0].rotation.x=-1.4;r.limbs[2].rotation.x=-1.4;}
   if(anim==='charge'){r.limbs[0].rotation.z=.7;r.limbs[2].rotation.z=-.7;}
   if(anim==='hurt')r.g.rotation.z=.15;else r.g.rotation.z=0;
   r.aura.scale.setScalar(anim==='charge'?1.3+Math.sin(time*18)*.2:1);r.aura.material.color.set(anim==='charge'?'#ffffff':fighters[r.id].color);
   if(m?.cinematic){const c=m.cinematic;
    if(c.kind==='capture'){
     const pose=capturePose(c,m.players[c.a],m.players[c.b]),part=n===c.a?pose.actor:pose.victim;
     r.g.position.set(part.x,part.y,part.z);r.g.rotation.x=part.tilt;r.limbs[0].rotation.x=part.arm;r.limbs[2].rotation.x=part.arm;
    }else if(n===c.a){r.limbs[2].rotation.x=-1.8;r.limbs[0].rotation.x=-1.2;r.g.position.y=Math.sin(c.t/c.duration*Math.PI)*1.2;}
    else{r.g.position.y=Math.sin(c.t/c.duration*Math.PI)*2;r.g.rotation.z=.45;}
   }else r.g.rotation.x=0;
  });
  while(bolts.length<(m?.projectiles.length||0)){const b=new T.Mesh(new T.IcosahedronGeometry(.3,1),new T.MeshBasicMaterial({color:'#ffffff'}));scene.add(b);bolts.push(b);}
  bolts.forEach((b,j)=>{const p=m?.projectiles[j];b.visible=!!p;if(p){b.position.set(p.x,1.4,p.z);b.material.color.set(fighters[m.players[p.owner].id].color);b.scale.set(p.kind==='crescent'?2.5:p.kind==='beam'?.5:1,p.kind==='beam'?.5:1,p.kind==='beam'?2.5:1);if(p.kind==='capture'||p.kind==='snare')b.scale.setScalar(1.7);b.rotation.y=time*8;b.rotation.z=time*5;}});
  for(let j=sparks.length-1;j>=0;j--){const s=sparks[j];s.life-=dt;s.mesh.position.addScaledVector(s.vel,dt);s.vel.y-=dt*15;s.mesh.scale.setScalar(Math.max(0,s.life*2));if(s.life<=0){scene.remove(s.mesh);s.mesh.geometry.dispose();s.mesh.material.dispose();sparks.splice(j,1);}}
  finisher.visible=!!m?.cinematic;
  if(m?.cinematic){const c=m.cinematic,a=m.players[c.a],b=m.players[c.b],f=fighters[a.id];const victimModel=models[c.b].g;finisher.position.set(victimModel.position.x,victimModel.position.y+1,victimModel.position.z);beam.material.color.set(f.color);beam.visible=c.kind==='super'&&['aegis','sol'].includes(f.id);beam.scale.setScalar(Math.sin(c.t/c.duration*Math.PI));beam.position.y=3;wheels.forEach((wheel,j)=>{wheel.material.color.set(f.color);wheel.rotation.set(f.id==='rei'?j*.7:Math.PI/2,c.t*3+j,j*.4);wheel.position.y=Math.sin(c.t*4+j)*.6;wheel.scale.setScalar(.6+Math.sin(c.t/c.duration*Math.PI));});}
  const target=v(),pos=v();
  if(m){const [a,b]=m.players;target.set((a.x+b.x)/2,1.1,(a.z+b.z)/2);const distance=Math.hypot(a.x-b.x,a.z-b.z);pos.set(target.x+1.2,7+distance*.15,target.z+(13+distance*.7)/Math.min(1,camera.aspect/1.25));
   if(m.cinematic&&!settings.reduced){const c=m.cinematic,a=m.players[c.a],b=m.players[c.b];const angle=Math.sin(c.t/c.duration*Math.PI)*.3;
    const capture=c.kind==='capture'?capturePose(c,a,b):null;
    target.set(capture?.focus.x??(a.x+b.x)/2,capture?.focus.y??2,capture?.focus.z??(a.z+b.z)/2);
    const span=capture?.span??Math.hypot(a.x-b.x,a.z-b.z),zoom=(9+span*.65+(c.context==='far'?2:0))/Math.min(1,camera.aspect/1.25);
    pos.set(target.x+Math.sin(angle)*zoom,target.y+2.4,target.z+Math.cos(angle)*zoom);}
  }else{target.set(-.8,1.5,0);pos.set(3.8,5.3,14);if(width<600){target.set(.9,1.8,0);pos.set(3,5.5,16);}}
  camera.position.lerp(pos,1-Math.exp(-dt*5));camera.lookAt(target);renderer.render(scene,camera);
 }
 select(0);return {select,match,render,burst,quality(q){renderer.setPixelRatio(q==='low'?1:Math.min(devicePixelRatio,1.7));}};
}
