import * as T from './vendor/three.module.js';
import {createInkRing,inkMaterial} from './ink-energy.js';
// Presentation-only: projectile collision positions and character poses are never changed.
export function createBeamEffects(scene){
 const group=new T.Group();group.name='beam-release-effects';scene.add(group);
 const entries=[],up=new T.Vector3(0,1,0),direction=new T.Vector3();let match=null,lastTick=-1;
 function make(){
  const g=new T.Group(),flare=createInkRing('#6fe7ff'),nose=createInkRing('#6fe7ff');
  const connector=new T.Mesh(new T.CylinderGeometry(.055,.12,1,6),inkMaterial('#e9ffff'));
  const shards=Array.from({length:6},()=>new T.Mesh(new T.ConeGeometry(.11,.5,3),inkMaterial('#9af5ff')));
  g.add(flare,nose,connector,...shards);group.add(g);const e={g,flare,nose,connector,shards,projectile:null,position:new T.Vector3(),birth:0,death:null};entries.push(e);return e;
 }
 function reset(){for(const e of entries){e.g.visible=false;e.projectile=null;}lastTick=-1;}
 function update(models,m,reduced=false){
  if(m!==match||m&&m.tick<lastTick){reset();match=m;}if(!m){reset();return;}lastTick=m.tick;
  const active=m.projectiles.filter(p=>p.kind==='beam'&&m.players[p.owner].id===0);
  for(const p of active)if(!entries.some(e=>e.projectile===p)){
   const e=entries.find(e=>!e.projectile)||(entries.length<16?make():null);if(!e)continue;
   e.projectile=p;e.birth=m.tick;e.death=null;
  }
  for(const e of entries){
   const p=e.projectile;if(!p)continue;const alive=active.includes(p);
   e.g.visible=true;e.flare.visible=false;e.connector.visible=false;e.nose.visible=false;e.shards.forEach(s=>s.visible=false);
   if(alive){
    e.position.set(p.x,1.4,p.z);const age=m.tick-e.birth;
    e.nose.visible=true;e.nose.position.copy(e.position);e.nose.scale.setScalar(.38);e.nose.userData.updateInk(m.tick/60,reduced);
    const hand=models[p.owner]?.limbs[0]?.userData.hand;
    if(age<5&&hand){
     hand.getWorldPosition(e.flare.position);e.flare.visible=true;e.flare.scale.setScalar(.30+age*.035);e.flare.userData.updateInk(m.tick/60,reduced);
     direction.copy(e.position).sub(e.flare.position);e.connector.visible=true;e.connector.position.copy(e.flare.position).addScaledVector(direction,.5);
     e.connector.scale.set(1,direction.length(),1);e.connector.quaternion.setFromUnitVectors(up,direction.normalize());
    }
   }else{
    if(e.death===null)e.death=m.tick;const age=m.tick-e.death;
    if(age>=6){e.g.visible=false;e.projectile=null;continue;}
    const drawing=Math.floor(age/2),radius=.18+drawing*.2;
    e.shards.forEach((s,j)=>{const a=j*Math.PI/3;s.visible=!reduced||j%2===0;s.position.copy(e.position).add(new T.Vector3(Math.cos(a)*radius,Math.sin(a)*radius,0));s.rotation.z=a-Math.PI/2;s.scale.setScalar(1-drawing*.25);s.material.opacity=1-age/6;});
   }
  }
 }
 function orient(camera){for(const e of entries){e.flare.quaternion.copy(camera.quaternion);e.nose.quaternion.copy(camera.quaternion);}}
 return {update,orient,reset,group,entries};
}
