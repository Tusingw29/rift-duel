import * as T from './vendor/three.module.js';
import {fighters} from './fighters.js';
// Presentation only: no collision, resource or animation ownership.
const material=(color,opacity=1)=>new T.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,side:T.DoubleSide,toneMapped:false});
const ring=(radius,width,color,opacity=1)=>new T.Mesh(new T.RingGeometry(radius-width,radius,64),material(color,opacity));
export function createAttackEffects(scene){
 const group=new T.Group();group.name='attack-energy';scene.add(group);
 const restraint=new T.Group();restraint.name='capture-restraint';group.add(restraint);
 const rim=ring(1.55,.065,'#ffffff'),outline=ring(1.66,.04,'#79eaff');restraint.add(rim,outline);
 const brackets=[];
 for(let i=0;i<4;i++){const arc=new T.Mesh(new T.RingGeometry(1.73,1.78,16,1,0,.32),material('#79eaff'));arc.rotation.z=i*Math.PI/2;brackets.push(arc);restraint.add(arc);}
 const charges=Array.from({length:2},()=>{
  const g=new T.Group();g.name='charge-energy';group.add(g);
  const floor=ring(.95,.055,'#ffffff',.8);floor.rotation.x=-Math.PI/2;floor.position.y=.04;g.add(floor);
  const streaks=Array.from({length:10},()=>{const s=new T.Mesh(new T.ConeGeometry(.075,.65,3),material('#ffffff'));g.add(s);return s;});
  return {g,floor,streaks};
 });
 function reset(){restraint.visible=false;charges.forEach(c=>c.g.visible=false);}
 function update(models,m,time,reduced=false){
  reset();if(!m)return;
  charges.forEach(({g,floor,streaks},i)=>{
   const p=m.players[i],model=models[i];if(!model||p?.anim!=='charge'||m.cinematic)return;
   g.visible=true;g.position.copy(model.g.position);
   const intensity=Math.min(1,Math.max(0,p.held||0)/1.2),phase=reduced?0:time;
   floor.material.color.set(fighters[p.id]?.color||'#79eaff');floor.scale.setScalar(.8+intensity*.3);
   streaks.forEach((s,j)=>{
    const t=(phase*1.4+j/10)%1,angle=j*2.39996,radius=(1-t)*(.8+intensity*.5)+.12;
    s.position.set(Math.cos(angle)*radius,.15+t*1.85,Math.sin(angle)*radius);
    s.material.color.set(fighters[p.id]?.color||'#79eaff');s.scale.setScalar(reduced?.9:1+intensity*.6);s.rotation.set(0,angle,-Math.cos(angle)*.35);s.visible=!reduced||j%2===0;
   });
  });
  const c=m.cinematic;if(c?.kind!=='capture'||!models[c.b])return;
  const progress=Math.min(1,c.t/c.duration),fade=1-Math.max(0,(progress-.82)/.18);
  restraint.visible=fade>0;restraint.position.copy(models[c.b].g.position);restraint.position.y+=1.45;
  const a=models[c.a].g.position,b=models[c.b].g.position;
  restraint.rotation.set(0,Math.atan2(a.x-b.x,a.z-b.z),0);
  const close=1+Math.max(0,1-progress/.14)*.4;restraint.scale.set(close,close*1.08,close);
  const color=new T.Color(fighters[m.players[c.a].id]?.color||'#79eaff');outline.material.color.copy(color);
  for(const mesh of [rim,outline,...brackets]){mesh.material.transparent=true;mesh.material.opacity=fade;}
  brackets.forEach((arc,i)=>{arc.material.color.copy(color);arc.rotation.z=i*Math.PI/2+(reduced?0:progress*.7);});
 }
 reset();return {update,reset,group,restraint,charges};
}
