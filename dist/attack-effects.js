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
  return {g,floor,streaks,inkFloor,ribbons};
 });
 function reset(){restraint.visible=false;charges.forEach(c=>c.g.visible=false);}
 function update(models,m,time,reduced=false){
  reset();if(!m)return;
  charges.forEach(({g,floor,streaks,inkFloor,ribbons},i)=>{
   const p=m.players[i],model=models[i];if(!model||p?.anim!=='charge'||m.cinematic)return;
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
   floor.material.color.set(fighters[p.id]?.color||'#79eaff');floor.scale.setScalar(.8+intensity*.3);
   streaks.forEach((s,j)=>{
    const t=(phase*1.4+j/10)%1,angle=j*2.39996,radius=(1-t)*(.8+intensity*.5)+.12;
    s.position.set(Math.cos(angle)*radius,.15+t*1.85,Math.sin(angle)*radius);
    s.material.color.set(fighters[p.id]?.color||'#79eaff');s.scale.setScalar(reduced?.9:1+intensity*.6);s.rotation.set(0,angle,-Math.cos(angle)*.35);s.visible=!ink&&(!reduced||j%2===0);
   });
  });
  const c=m.cinematic;if(c?.kind!=='capture'||!models[c.b])return;
  const progress=Math.min(1,c.t/c.duration),fade=1-Math.max(0,(progress-.82)/.18);
  restraint.visible=fade>0;restraint.position.copy(models[c.b].g.position);restraint.position.y+=1.45;
  const a=models[c.a].g.position,b=models[c.b].g.position;
  restraint.rotation.set(0,Math.atan2(a.x-b.x,a.z-b.z),0);
  const close=1+Math.max(0,1-progress/.14)*.4;restraint.scale.set(close*1.58,close*1.68,close);
  restraint.userData.updateInk(c.t,reduced,fade);
 }
 // Compatibility hook: volumes remain world-oriented when the camera moves.
 function orient(){}
 reset();return {update,reset,orient,group,restraint,charges};
}
