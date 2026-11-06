import {BackSide,Group,Mesh,TorusGeometry,MeshBasicMaterial,OctahedronGeometry} from './vendor/three.module.js';
import {grabOptions} from './grab-options.js';
const poses=new WeakMap();
export function restoreGrabTell(r){for(const [bone,rotation] of poses.get(r)||[])bone.rotation.copy(rotation);poses.delete(r);if(r.grabTell)r.grabTell.visible=false;}
export function applyGrabTell(r,p,m,reduced=false){
 if(!grabOptions(m).tell||p?.move?.kind!=='capture'||p.move.frame>=p.move.startup||m.cinematic||p.hp<=0)return false;
 const arm=r.limbs?.[2],elbow=r.elbows?.[1],hand=arm?.userData.hand;if(!hand)return false;
 // Readable cocked reach. Temporary rendering overlay, restored before the next authored pose.
 const bones=[arm,elbow,hand].filter(Boolean);poses.set(r,bones.map(b=>[b,b.rotation.clone()]));
 arm.rotation.set(-1.25,-.35,.65);if(elbow)elbow.rotation.x=-.65;hand.rotation.z=-.4;
 if(!r.grabTell){const g=new Group();g.name='grab-startup-tell';const ink=new MeshBasicMaterial({color:0x171225,side:BackSide}),core=new MeshBasicMaterial({color:0xffed95});
 for(let i=0;i<3;i++){const rim=new Mesh(new TorusGeometry(.27,.038,4,16),ink.clone()),line=new Mesh(new TorusGeometry(.27,.021,4,16),core.clone());rim.rotation.set(i===1?Math.PI/2:0,i===2?Math.PI/2:0,0);line.rotation.copy(rim.rotation);g.add(rim,line);}
 g.add(new Mesh(new OctahedronGeometry(.13),new MeshBasicMaterial({color:0xffffff})));hand.add(g);r.grabTell=g;}
 r.grabTell.visible=true;r.grabTell.position.set(0,-.25,.12);
 // One onset flash, no repeated strobing. Reduced motion keeps the same silhouette at constant size.
 r.grabTell.scale.setScalar(reduced?1:1+.45*Math.max(0,1-p.move.frame/5));return true;
}
