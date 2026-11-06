import {createSignature,createChiCoil,createShockwave,energyStyle,socket} from './energy-style.js';
import {createInkRing,createInkFlame} from './ink-energy.js';
import * as T from './vendor/three.module.js';
import {fighters} from './fighters.js';
// Presentation only: no collision, resource or animation ownership.
const material=(color,opacity=1)=>new T.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,side:T.DoubleSide,toneMapped:false});
const ring=(radius,width,color,opacity=1)=>new T.Mesh(new T.RingGeometry(radius-width,radius,64),material(color,opacity));
export function createAttackEffects(scene){
 const group=new T.Group();group.name='attack-energy';scene.add(group);
 const restraint=createInkRing();restraint.name='capture-restraint';group.add(restraint);
 const charges=Array.from({length:2},()=>{
  const g=new T.Group();g.name='charge-energy';group.add(g);
  const floor=ring(.95,.055,'#ffffff',.8);floor.rotation.x=-Math.PI/2;floor.position.y=.04;g.add(floor);
  const streaks=Array.from({length:10},()=>{const s=new T.Mesh(new T.ConeGeometry(.075,.65,3),material('#ffffff'));g.add(s);return s;});
  const inkFloor=createInkRing('#ffb52e');inkFloor.rotation.x=-Math.PI/2;inkFloor.position.y=.055;g.add(inkFloor);
  const ribbons=Array.from({length:6},()=>{const flame=createInkFlame();g.add(flame);return flame;});
  const coils=Array.from({length:4},()=>{const c=createChiCoil();g.add(c);return c;});
  const signatures=Array.from({length:6},(_,id)=>Array.from({length:4},()=>{const s=createSignature(id);g.add(s);return s;}));
  const shock=createShockwave(2);g.add(shock);
  return {g,floor,streaks,inkFloor,ribbons,coils,signatures,shock};
 });
 const tether=new T.Mesh(new T.CylinderGeometry(.025,.06,1,5),material('#ffffff'));group.add(tether);
 const shards=Array.from({length:10},()=>{const s=createSignature(0);s.scale.setScalar(.13);group.add(s);return s;});
 let previous=null,brokenAt=null,breakPosition=new T.Vector3(),lastTick=-1,lastMatch=null;
 function reset(){previous=null;brokenAt=null;tether.visible=false;shards.forEach(s=>s.visible=false);restraint.visible=false;charges.forEach(c=>c.g.visible=false);}
 function update(models,m,time,reduced=false){
  restraint.visible=false;tether.visible=false;charges.forEach(c=>c.g.visible=false);shards.forEach(s=>s.visible=false);
  if(!m){reset();return;}if(m!==lastMatch||m.tick<lastTick){reset();lastMatch=m;}lastTick=m.tick;
  if(previous&&m.cinematic!==previous){brokenAt=m.tick;breakPosition.copy(restraint.position);previous=null;}
  if(brokenAt!==null){const age=m.tick-brokenAt;shards.forEach((s,j)=>{s.visible=age<12&&(!reduced||j%2===0);const a=j*Math.PI/5;s.position.copy(breakPosition).add(new T.Vector3(Math.cos(a),Math.sin(a),j%2?.4:-.4).multiplyScalar(.2+Math.floor(age/3)*.25));s.userData.updateInk(age/60,reduced,Math.max(0,1-age/12));});}
  charges.forEach(({g,floor,streaks,inkFloor,ribbons,coils,signatures,shock},i)=>{
   const p=m.players[i],model=models[i];if(!model||!(p?.anim==='charge'||p?.id===2&&['technique','forward','back','launch'].includes(p?.move?.kind))||m.cinematic)return;
   g.visible=true;g.position.copy(model.g.position);
   const ink=p.id===2;floor.visible=!ink;inkFloor.visible=ink;ribbons.forEach(r=>r.visible=ink);
   const intensity=Math.min(1,Math.max(0,p.held||0)/1.2),phase=reduced?0:(Number.isFinite(m.tick)?m.tick/60:time);
   inkFloor.scale.setScalar(.78+intensity*.28);inkFloor.userData.updateInk(phase,reduced,.8);
   ribbons.forEach((r,j)=>{
    const step=Math.floor(phase*12)/12,angle=j*Math.PI/3+.3,t=reduced?.4:(step*.85+j/6)%1;
    const radius=.85+(1-t)*.35;r.position.set(Math.cos(angle)*radius,.05+t*.18,Math.sin(angle)*radius);
    r.rotation.y=angle;r.scale.set(.65+intensity*.45,(.45+intensity*.65)*(1-t*.25),1);
    r.visible=ink&&(!reduced||j%2===0);r.userData.updateInk(phase+j*.09,reduced);
   });
   const known=Number.isInteger(p.id);inkFloor.visible=false;floor.visible=!known;
   // Four anatomical sockets, including lifting feet: no orbit around the world origin.
   ['leftHand','rightHand','leftFoot','rightFoot'].forEach((name,j)=>{
    const at=socket(model,name).sub(g.position),coil=coils[j];coil.visible=ink;coil.position.copy(at);
    const joint=j<2?(model.elbows?.[j]||model.limbs?.[j*2]?.userData.hand):model.feet?.[j-2];if(joint)joint.getWorldQuaternion(coil.quaternion);coil.scale.setScalar(j<2?1:1.2);coil.userData.updateInk(phase+j*.08,reduced);
    ribbons[j].position.copy(at);ribbons[j].scale.set(.22,.22,.22);ribbons[j].visible=ink&&j<2;
    signatures.forEach((bank,id)=>{const s=bank[j];s.visible=known&&!ink&&id===p.id;s.position.copy(at);s.scale.setScalar(j<2?.35:.2);s.rotation.y=j*Math.PI/2;s.userData.updateInk(phase,reduced);});
   });
   ribbons[4].visible=ribbons[5].visible=false;
   shock.visible=ink;shock.userData.updateInk((m.tick||0)%12,reduced);
   floor.material.color.set(fighters[p.id]?.color||'#79eaff');floor.scale.setScalar(.8+intensity*.3);
   streaks.forEach((s,j)=>{
    const t=(phase*1.4+j/10)%1,angle=j*2.39996,radius=(1-t)*(.8+intensity*.5)+.12;
    s.position.set(Math.cos(angle)*radius,.15+t*1.85,Math.sin(angle)*radius);
    s.material.color.set(fighters[p.id]?.color||'#79eaff');s.scale.setScalar(reduced?.9:1+intensity*.6);s.rotation.set(0,angle,-Math.cos(angle)*.35);s.visible=!known&&(!reduced||j%2===0);
   });
  });
  const c=m.cinematic;if(c?.kind!=='capture'||!models[c.b])return;previous=c;
  const progress=Math.min(1,c.t/c.duration),fade=1-Math.max(0,(progress-.82)/.18);
  restraint.visible=fade>0;socket(models[c.b],'chest',restraint.position);restraint.children[1].material.color.set(energyStyle(m.players[c.a]?.id).color);
  const from=socket(models[c.a],'leftHand'),to=socket(models[c.b],'pelvis');
  const delta=to.clone().sub(from);tether.visible=true;tether.position.copy(from).addScaledVector(delta,.5);tether.scale.y=delta.length();tether.quaternion.setFromUnitVectors(new T.Vector3(0,1,0),delta.normalize());tether.material.color.set(energyStyle(m.players[c.a]?.id).color);
  shards.forEach(s=>s.children.forEach((mesh,i)=>mesh.material.color.set([energyStyle(m.players[c.a]?.id).ink,energyStyle(m.players[c.a]?.id).color,energyStyle(m.players[c.a]?.id).core][Math.min(i,2)])));
  const a=models[c.a].g.position,b=models[c.b].g.position;
  restraint.rotation.set(0,Math.atan2(a.x-b.x,a.z-b.z),0);
  const close=1+Math.max(0,1-progress/.14)*.4+(reduced?0:Math.sin(Math.floor(c.t*12)*.8)*.025);restraint.scale.set(close*1.58,close*1.68,close);
  restraint.userData.updateInk(c.t,reduced,fade);
 }
 // Compatibility hook: volumes remain world-oriented when the camera moves.
 function orient(){}
 reset();return {update,reset,orient,group,restraint,charges,tether,shards};
}
