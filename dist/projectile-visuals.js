import * as T from './vendor/three.module.js';
const custom=['wave','lightning','spirit','sword','snare','capture','beam'];
export function createProjectileVisual(){
 const b=new T.Mesh(new T.IcosahedronGeometry(.3,1),new T.MeshBasicMaterial({color:'#ffffff'}));
 const material=()=>b.material.clone();
 const wheel=new T.Mesh(new T.TorusGeometry(.8,.09,6,24),material());
 const wave=new T.Mesh(new T.TorusGeometry(.85,.16,5,20,Math.PI),material());
 const path=new T.CurvePath(),points=[[-.08,0,-.9],[.1,.12,-.45],[-.12,-.1,-.15],[.12,.12,.3],[0,0,.9]].map(p=>new T.Vector3(...p));
 for(let i=1;i<points.length;i++)path.add(new T.LineCurve3(points[i-1],points[i]));
 const lightning=new T.Mesh(new T.TubeGeometry(path,16,.065,4,false),material());
 const sword=new T.Group(),blade=new T.Mesh(new T.BoxGeometry(.12,.06,1.3),material()),guard=new T.Mesh(new T.BoxGeometry(.55,.09,.09),material()),tip=new T.Mesh(new T.ConeGeometry(.09,.3,4),material());
 guard.position.z=-.5;tip.rotation.x=Math.PI/2;tip.position.z=.8;sword.add(blade,guard,tip);
 const spirit=new T.Group(),body=new T.Mesh(new T.OctahedronGeometry(.25),material());body.scale.set(1,1,2);spirit.add(body);
 for(const side of [-1,1]){const wing=new T.Mesh(new T.ConeGeometry(.25,.85,3),material());wing.position.x=side*.45;wing.rotation.z=-side*Math.PI/2;wing.rotation.y=Math.PI/2;spirit.add(wing);}
 const snare=new T.Mesh(new T.TorusGeometry(.65,.08,6,24),material());
 const fire=new T.Mesh(new T.ConeGeometry(.26,.9,5),material());fire.rotation.x=-Math.PI/2;fire.position.z=-.45;
 const beam=new T.Group();
 const sleeve=new T.Mesh(new T.CylinderGeometry(.16,.23,2.4,12),new T.MeshBasicMaterial({color:'#ffffff',transparent:true,opacity:.55,depthWrite:false,toneMapped:false}));sleeve.rotation.x=Math.PI/2;beam.add(sleeve);
 const core=new T.Mesh(new T.CylinderGeometry(.065,.09,2.5,10),new T.MeshBasicMaterial({color:'#ffffff',toneMapped:false}));core.rotation.x=Math.PI/2;core.userData.whiteCore=true;beam.add(core);
 const capture=new T.Mesh(new T.TorusGeometry(1,.055,6,40),material());
 for(const [kind,mesh] of Object.entries({wheel,wave,lightning,sword,spirit,snare,fire,capture,beam})){b.add(mesh);b.userData[kind]=mesh;mesh.visible=false;}
 return b;
}
export function updateProjectileVisual(b,p,color,time){
 b.visible=!!p;if(!p)return;
 b.position.set(p.x,p.low?.35:1.4,p.z);b.rotation.set(0,0,0);
 b.material.color.set(color);b.material.visible=!custom.includes(p.kind);
 b.scale.set(p.kind==='crescent'?2.5:1,1,1);
 if(p.kind==='capture')b.scale.setScalar(p.radius);
 if(p.radius>1&&p.kind!=='capture')b.scale.multiplyScalar(p.kind==='wheel'?p.radius/.8:p.radius/.4);
 for(const kind of ['wheel',...custom,'fire']){const mesh=b.userData[kind];mesh.visible=p.kind===kind;mesh.traverse(o=>{if(o.material)o.material.color.set(o.userData.whiteCore?'#ffffff':color);});}
 if(p.kind==='wave'){b.position.y=.16;b.rotation.y=Math.atan2(p.dx,p.dz);}
 else if(p.kind==='wheel'){b.position.y=Math.max(.9,p.radius*1.15);b.rotation.set(0,Math.atan2(p.dx,p.dz)+Math.PI/2,time*7);}
 else if(custom.includes(p.kind)||p.kind==='fire'){b.rotation.y=Math.atan2(p.dx,p.dz);if(p.kind==='snare')b.rotation.z=time*3;}
 else{b.rotation.y=time*8;b.rotation.z=time*5;}
}
