import * as T from './vendor/three.module.js';
export function createProjectileVisual(){
 const b=new T.Mesh(new T.IcosahedronGeometry(.3,1),new T.MeshBasicMaterial({color:'#ffffff'}));
 const wheel=new T.Mesh(new T.TorusGeometry(.8,.09,6,24),b.material.clone());
 const wave=new T.Mesh(new T.TorusGeometry(.85,.16,5,20,Math.PI),b.material.clone());
 b.add(wheel,wave);b.userData.wheel=wheel;b.userData.wave=wave;
 return b;
}
export function updateProjectileVisual(b,p,color,time){
 b.visible=!!p;if(!p)return;
 b.position.set(p.x,p.low?.35:1.4,p.z);b.rotation.set(0,0,0);
 b.material.color.set(color);b.material.visible=p.kind!=='wave';
 b.scale.set(p.kind==='crescent'?2.5:p.kind==='beam'?.5:1,p.kind==='beam'?.5:1,p.kind==='beam'?2.5:1);
 if(p.kind==='capture'||p.kind==='snare')b.scale.setScalar(1.7);
 if(p.radius>1)b.scale.multiplyScalar(p.kind==='wheel'?p.radius/.8:p.radius/.4);
 for(const kind of ['wheel','wave']){b.userData[kind].visible=p.kind===kind;b.userData[kind].material.color.copy(b.material.color);}
 if(p.kind==='wave'){b.position.y=.16;b.rotation.y=Math.atan2(p.dx,p.dz);}
 else if(p.kind==='wheel'){b.position.y=Math.max(.9,p.radius*1.15);b.rotation.set(0,Math.atan2(p.dx,p.dz)+Math.PI/2,time*7);}
 else{b.rotation.y=time*8;b.rotation.z=time*5;}
}
