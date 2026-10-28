// SPACING-COMMITMENT training aid: a subtle floor marker around one fighter showing their reach (solid) and the
// band edge (dashed) while a spacing switch is on, so the strike/shot switch point is predictable. Visual only.
import * as T from './vendor/three.module.js';
import {fighters} from './fighters.js';
import {spacingMarker} from './spacing-commitment.js';
const material=(color,opacity)=>new T.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,side:T.DoubleSide});
export function createSpacingMarker(scene){
 const g=new T.Group();g.name='spacing-marker';g.visible=false;scene.add(g);
 // Each line is a thin light stroke over a slightly wider dark backing, so it reads on pale stone and dark floors alike.
 const line=(inner,color,opacity,start=0,length=Math.PI*2,segments=96)=>{const o=new T.Group();
  o.add(new T.Mesh(new T.RingGeometry(inner-.012,1.012,segments,1,start,length),material('#14110c',.3)));
  const top=new T.Mesh(new T.RingGeometry(inner,1,segments,1,start,length),material(color,opacity));top.position.z=.002;o.add(top);return o;};
 const reach=line(.982,'#ffffff',.55);
 const edge=new T.Group();for(let k=0;k<32;k++)edge.add(line(.988,'#ffd86a',.65,k*Math.PI/16,Math.PI/32,6));
 for(const o of [reach,edge]){o.rotation.x=-Math.PI/2;g.add(o);}
 g.position.y=.03;
 let fighter=-1;
 return {group:g,update(m,n=0,show=true){
  const p=m?.players?.[n],s=show&&p?spacingMarker(m.rules,fighters[p.id]):null;
  g.visible=!!s;if(!s)return null;
  if(fighter!==p.id){fighter=p.id;reach.scale.setScalar(s.reach);edge.scale.setScalar(s.edge);}
  g.position.x=p.x;g.position.z=p.z;
  return s;
 }};
}
