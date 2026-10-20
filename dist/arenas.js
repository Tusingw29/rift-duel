import {stonePaint} from './painted-textures.js';
import * as T from './vendor/three.module.js';
import {fighters} from './fighters.js';
// Each fighter has a home arena. Story, duel and versus fights take place in the
// opponent's home; training and the menu use the selected fighter's.
export const arenas={
 aegis:{name:'ORBITAL RELAY',sky:'#0b1522',fog:.021,ground:'#22343f',rings:['#5fa7b8','#2e6a7a','#9be7ff'],strip:'#9be7ff',hemisphere:['#9fd4ff','#1b2733'],sun:'#eaf6ff',rim:'#6fe7ff',deco:'relay',stars:420},
 rei:{name:'MOONLIT SHRINE',sky:'#1a1220',fog:.024,ground:'#2b2330',rings:['#b86d9a','#5a3350','#f2a0ce'],strip:'#f2a0ce',hemisphere:['#ffd1e8','#2a1a2a'],sun:'#ffe6f2',rim:'#f2a0ce',deco:'shrine',stars:200},
 tala:{name:'STORM SUMMIT',sky:'#86b6cb',fog:.012,ground:'#c1c5aa',rings:['#c79a52','#6b5330','#f5b65d'],strip:'#f5b65d',hemisphere:['#e0f1ff','#667554'],sun:'#fff3d6',rim:'#f5b65d',deco:'summit',stars:120},
 morrow:{name:'IRON WASTES',sky:'#1b1a16',fog:.026,ground:'#3a2f26',rings:['#8a7a5a','#4e4535','#a5c69e'],strip:'#a5c69e',hemisphere:['#d8ccb0','#2a2520'],sun:'#ffe9c4',rim:'#a5c69e',deco:'wastes',stars:90},
 sol:{name:'EMBER ARCHIVE',sky:'#1d1210',fog:.027,ground:'#3a2420',rings:['#c7684a','#6b2f27','#ff795e'],strip:'#ff9b7a',hemisphere:['#ffd0b8','#2c1a16'],sun:'#ffd8b0',rim:'#ff795e',deco:'archive',stars:160},
 vesper:{name:'SILENT ORBIT',sky:'#120f1d',fog:.02,ground:'#241d36',rings:['#8d6fd1','#4a3a78','#c4a3ff'],strip:'#c4a3ff',hemisphere:['#d7c8ff','#1b1530'],sun:'#f0e8ff',rim:'#c4a3ff',deco:'orbit',stars:520}
};
export function arenaFor(fighterIndex){return arenas[fighters[fighterIndex].id];}
export function homeArena(mode,selected,opponent){return mode==='training'?selected:opponent;}
const mat=(color,metal=.1)=>new T.MeshStandardMaterial({color,roughness:.65,metalness:metal,flatShading:true});
const glow=color=>new T.MeshBasicMaterial({color});
// Builds the stage as one disposable group plus an animation hook.
export function createArena(def){
 const group=new T.Group(),animated=[];
 const ground=new T.Mesh(new T.CylinderGeometry(17,18,1,64),mat(def.ground,.3));ground.position.y=-.6;ground.receiveShadow=true;group.add(ground);
 const ring=(r,color,y=-.06)=>{const o=new T.Mesh(new T.TorusGeometry(r,.027,5,120),glow(color));o.rotation.x=Math.PI/2;o.position.y=y;group.add(o);return o;};
 if(def.deco!=='summit'){ring(13,def.rings[0]);ring(13.3,def.rings[1]);ring(6,def.rings[1]);ring(16.8,def.rings[2]);}
 const grid=new T.GridHelper(25,20,def.rings[1],def.rings[1]);grid.visible=def.deco!=='summit';grid.position.y=-.08;grid.material.opacity=.55;grid.material.transparent=true;group.add(grid);
 const coords=[];for(let j=0;j<(def.deco==='summit'?0:def.stars);j++){const a=j*2.39996,r=25+(j%19);coords.push(Math.sin(a)*r,4+(j%34),Math.cos(a)*r);}
 const starsGeo=new T.BufferGeometry();starsGeo.setAttribute('position',new T.Float32BufferAttribute(coords,3));group.add(new T.Points(starsGeo,new T.PointsMaterial({color:def.strip,size:.05})));
 const around=(count,radius,build)=>{for(let j=0;j<count;j++){const angle=j*Math.PI*2/count;if(Math.sin(angle)>.15)continue;const g=new T.Group();g.position.set(Math.cos(angle)*radius,0,Math.sin(angle)*radius);g.rotation.y=-angle;build(g,j);group.add(g);}};
 if(def.deco==='relay'){
  around(12,19,(g,j)=>{const pylon=new T.Mesh(new T.BoxGeometry(.9,9+(j%3)*2,.9),mat('#1b2c38'));pylon.position.y=3;pylon.castShadow=true;g.add(pylon);const strip=new T.Mesh(new T.BoxGeometry(.08,6,.05),glow(def.strip));strip.position.set(0,3,.48);g.add(strip);const dish=new T.Mesh(new T.ConeGeometry(.9,.5,10,1,true),mat('#2a4150',.5));dish.position.y=8+(j%3);dish.rotation.x=-.9;g.add(dish);});
  const orbit=new T.Group();orbit.position.set(0,12,-16);group.add(orbit);for(let j=0;j<3;j++){const m=new T.Mesh(new T.TorusGeometry(5+j*.5,.06,4,8),glow(j===1?def.strip:def.rings[0]));m.rotation.z=j*.4;orbit.add(m);}animated.push(t=>{orbit.rotation.z=t*.05;orbit.children[1].rotation.z=-t*.12;});
 }else if(def.deco==='shrine'){
  around(8,19,(g,j)=>{const post=mat('#3b2230');for(const side of [-1,1]){const p=new T.Mesh(new T.BoxGeometry(.5,7,.5),post);p.position.set(side*1.6,3,0);p.castShadow=true;g.add(p);}const bar=new T.Mesh(new T.BoxGeometry(4.6,.45,.6),post);bar.position.y=6.6;bar.rotation.z=.02;g.add(bar);const lantern=new T.Mesh(new T.BoxGeometry(.5,.7,.5),glow(j%2?def.strip:'#ffd9a0'));lantern.position.set(0,5.3,0);g.add(lantern);animated.push(t=>{lantern.scale.setScalar(1+Math.sin(t*3+j)*.08);});});
  const moon=new T.Mesh(new T.CircleGeometry(4.5,40),glow('#ffe8f4'));moon.position.set(-14,16,-30);group.add(moon);
  const petals=[];for(let j=0;j<40;j++){const petal=new T.Mesh(new T.PlaneGeometry(.18,.12),new T.MeshBasicMaterial({color:def.strip,side:T.DoubleSide}));petal.position.set((j%8-4)*3,4+(j%5)*1.4,-6-(j%7)*2);group.add(petal);petals.push(petal);}animated.push(t=>{petals.forEach((p,j)=>{p.position.y=4+((t*.6+j*.37)%7);p.rotation.x=t*2+j;p.rotation.y=t+j;});});
 }else if(def.deco==='summit'){
  ground.material.dispose();ground.material=new T.MeshLambertMaterial({color:'#ffffff',map:stonePaint()});
  // Layered mountain silhouettes around the full horizon, visible while circling.
  for(let layer=0;layer<3;layer++){
   const points=[],indices=[],radius=29+layer*13;
   for(let j=0;j<=64;j++){const a=j/64*Math.PI*2,h=3+layer*2+Math.sin(a*7+layer)*2+Math.sin(a*13)*1.2;
    points.push(Math.cos(a)*radius,-2,Math.sin(a)*radius,Math.cos(a)*radius,h,Math.sin(a)*radius);
    if(j<64){const n=j*2;indices.push(n,n+1,n+2,n+1,n+3,n+2);}}
   const geo=new T.BufferGeometry();geo.setAttribute('position',new T.Float32BufferAttribute(points,3));geo.setIndex(indices);geo.computeVertexNormals();
   const ridge=new T.Mesh(geo,new T.MeshBasicMaterial({color:['#577355','#779481','#94b2ab'][layer],side:T.DoubleSide}));group.add(ridge);
  }
  for(let j=0;j<24;j++){const a=j/24*Math.PI*2;const rock=new T.Mesh(new T.DodecahedronGeometry(.6+(j%3)*.25,0),mat('#a5ac94',0));rock.position.set(Math.cos(a)*17,.1,Math.sin(a)*17);rock.scale.y=.65;group.add(rock);}
  const skyClouds=new T.Group();group.add(skyClouds);
  for(let j=0;j<12;j++){const a=j/12*Math.PI*2;const cloud=new T.Mesh(new T.SphereGeometry(1,12,6),new T.MeshBasicMaterial({color:j%2?'#e8eef0':'#c5dae2'}));cloud.position.set(Math.cos(a)*48,16+(j%3)*2,Math.sin(a)*48);cloud.scale.set(9,1.3,3);skyClouds.add(cloud);}
  animated.push(t=>{skyClouds.rotation.y=t*.004;});
 }else if(def.deco==='wastes'){
  around(12,19,(g,j)=>{const girder=new T.Mesh(new T.BoxGeometry(1.6,5+(j%4)*2.5,1.6),mat('#2f2820',.5));girder.position.y=2;girder.rotation.z=(j%3-1)*.25;girder.castShadow=true;g.add(girder);const strip=new T.Mesh(new T.BoxGeometry(.06,4,.04),glow(def.strip));strip.position.set(0,2,.84);g.add(strip);});
  const gear=new T.Mesh(new T.TorusGeometry(6,.9,6,12),mat('#3a3025',.6));gear.position.set(4,8,-20);group.add(gear);animated.push(t=>{gear.rotation.z=t*.06;});
  const dust=[];for(let j=0;j<120;j++)dust.push((j%24-12)*2,(j%9)*1.3,-4-(j%11)*2);const dustGeo=new T.BufferGeometry();dustGeo.setAttribute('position',new T.Float32BufferAttribute(dust,3));const dustPoints=new T.Points(dustGeo,new T.PointsMaterial({color:'#8a7a5a',size:.07}));group.add(dustPoints);animated.push(t=>{dustPoints.position.x=(t*.8)%4;});
 }else if(def.deco==='archive'){
  around(10,19,(g,j)=>{const shelf=new T.Mesh(new T.BoxGeometry(2.4,9+(j%3)*2,1.2),mat('#3a2a22'));shelf.position.y=3.5;shelf.castShadow=true;g.add(shelf);for(let k=0;k<4;k++){const line=new T.Mesh(new T.BoxGeometry(2,.08,.05),glow(k%2?def.strip:'#ffd27a'));line.position.set(0,1+k*2.1,.62);g.add(line);}});
  const sun=new T.Mesh(new T.SphereGeometry(3.2,20,14),glow('#ffb36a'));sun.position.set(10,14,-28);group.add(sun);const halo=new T.Mesh(new T.TorusGeometry(4.4,.08,4,40),glow('#ff795e'));halo.position.copy(sun.position);group.add(halo);animated.push(t=>{halo.rotation.y=t*.4;halo.rotation.x=Math.sin(t*.3)*.6;});
  const embers=[];for(let j=0;j<60;j++){const e=new T.Mesh(new T.OctahedronGeometry(.07),glow(j%3?'#ff9b5e':'#ffd27a'));e.position.set((j%12-6)*2.2,.3,-3-(j%5)*2);group.add(e);embers.push(e);}animated.push(t=>{embers.forEach((e,j)=>{e.position.y=((t*.9+j*.5)%8);e.position.x=(j%12-6)*2.2+Math.sin(t+j)*.6;});});
 }else{
  around(12,19,(g,j)=>{const shard=new T.Mesh(new T.OctahedronGeometry(1.1+(j%3)*.3),mat('#2d2347',.4));shard.position.y=4+(j%3)*1.5;shard.rotation.y=j;g.add(shard);animated.push(t=>{shard.position.y=4+(j%3)*1.5+Math.sin(t*.8+j)*.5;shard.rotation.y=t*.2+j;});const base=new T.Mesh(new T.ConeGeometry(.6,1.6,4),mat('#2d2347',.4));base.position.y=.4;g.add(base);});
  const halos=[];for(let j=0;j<4;j++){const halo=new T.Mesh(new T.TorusGeometry(8+j*2.2,.05,4,80),glow(j%2?def.strip:def.rings[0]));halo.rotation.x=Math.PI/2.3;halo.position.set(0,9+j*1.5,-14);group.add(halo);halos.push(halo);}animated.push(t=>{halos.forEach((h,j)=>{h.rotation.z=t*(.06+j*.02);});});
 }
 return {group,update(t){for(const fn of animated)fn(t);},dispose(){group.traverse(o=>{o.geometry?.dispose();if(o.material){o.material.map?.dispose();o.material.dispose();}});}};
}
