// SEAL-VISUALS (Claude): world-space read of CAPTURE-SEAL state. Render-only: reads match.seals,
// sealEscape and escapeDash (docs/CAPTURE_SEAL_HANDOFF.md) and never writes simulation state.
// The drawn edge is the exact simulated seal radius; capture needs the target centre outside
// radius + body allowance, so the edge is "where your feet must clear".
import * as T from './vendor/three.module.js';
import {SEAL} from './capture-seal.js';

const FLOOR=-.05,SEGMENTS=96;
const INK='#11141f',ESCAPE='#43e8ff',SPENT='#9a9db0',HOT='#ff2d3a';
const flat=(geo,y)=>{const m=new T.Mesh(geo,mat('#ffffff'));m.rotation.x=-Math.PI/2;m.position.y=y;return m;};
function mat(color,opacity=1,side=T.DoubleSide){return new T.MeshBasicMaterial({color,transparent:true,opacity,depthWrite:false,fog:false,toneMapped:false,side});}
const ringGeo=(inner,outer)=>new T.RingGeometry(inner,outer,SEGMENTS);

export function sealProgress(s){return Math.min(1,Math.max(0,(SEAL.startRadius-s.radius)/(SEAL.startRadius-SEAL.radius)));}
// What a seal should look like this frame, as plain numbers (tested without WebGL).
export function sealLook(s,tick,reduced=false){
 const p=sealProgress(s),closing=s.status==='closing',age=s.resolved==null?0:Math.max(0,tick-s.resolved),fade=closing?1:Math.max(0,1-age/SEAL.visualFrames);
 const final=closing&&s.framesLeft<=12,pulse=final&&!reduced?.5+.5*Math.sin((12-s.framesLeft)*1.4):0;
 return {progress:p,fade,edge:s.radius,
  // Threat colour only while closing; resolved seals never keep the caster colour.
  threat:closing,caught:s.status==='caught',escaped:s.status==='escaped',
  wallHeight:closing?.35+.75*p:s.status==='caught'?1.4*fade:.15*fade,
  fillOpacity:closing?.07+.2*p+.12*pulse:s.status==='caught'?.35*fade:.05*fade,
  edgeOpacity:closing?.85+.15*pulse:.6*fade,
  white:closing?(final?.35+.5*pulse:0):s.status==='caught'?1:0};
}

function buildSeal(){
 const g=new T.Group();g.name='capture-seal';
 const start=flat(ringGeo(SEAL.startRadius-.03,SEAL.startRadius+.03),FLOOR);start.material=mat(INK,.55);
 const target=flat(ringGeo(SEAL.radius-.025,SEAL.radius+.025),FLOOR+.004);target.material=mat('#ffffff',.5);
 const fill=flat(new T.CircleGeometry(1,SEGMENTS),FLOOR-.004);fill.material=mat('#ffffff',.1);
 const edgeInk=flat(ringGeo(.94,1.06),FLOOR+.006);edgeInk.material=mat(INK,.9);
 const edge=flat(ringGeo(.965,1.035),FLOOR+.008);edge.material=mat('#ffffff',1);
 // Low translucent fence at the live edge: readable from the side and from behind the fighter.
 const wall=new T.Mesh(new T.CylinderGeometry(1,1,1,SEGMENTS,1,true),mat('#ffffff',.22));wall.position.y=FLOOR;
 const lip=new T.Mesh(new T.TorusGeometry(1,.018,4,SEGMENTS),mat('#ffffff',.9));lip.rotation.x=Math.PI/2;
 g.add(start,target,fill,edgeInk,edge,wall,lip);g.userData={start,target,fill,edgeInk,edge,wall,lip};return g;
}
function buildCue(){
 const g=new T.Group();g.name='seal-escape-cue';
 // Remaining-window arc around the escaper's feet plus a chevron toward the caster.
 const arc=flat(ringGeo(.85,1.05),FLOOR+.012);arc.material=mat(ESCAPE,.95);
 const arcInk=flat(ringGeo(.8,1.1),FLOOR+.01);arcInk.material=mat(INK,.8);
 const shape=new T.Shape();shape.moveTo(0,.42);shape.lineTo(.3,0);shape.lineTo(.15,0);shape.lineTo(0,.2);shape.lineTo(-.15,0);shape.lineTo(-.3,0);shape.closePath();
 const chevrons=new T.Group();for(let i=0;i<2;i++){const c=new T.Mesh(new T.ShapeGeometry(shape),mat(ESCAPE,.95));c.rotation.x=-Math.PI/2;c.scale.setScalar(1.8);c.position.set(0,FLOOR+.014,-(1.35+i*.75));chevrons.add(c);}
 g.add(arcInk,arc,chevrons);g.userData={arc,arcInk,chevrons};return g;
}
function buildStreak(){
 const g=new T.Group();g.name='seal-escape-dash';
 for(let i=0;i<4;i++){const s=new T.Mesh(new T.PlaneGeometry(2.2-i*.3,.07),mat(ESCAPE,.7));s.rotation.y=Math.PI/2;s.position.set(0,.35+i*.32,-1.3-i*.1);g.add(s);}
 return g;
}

export function createSealVisuals(){
 const group=new T.Group();group.name='seal-visuals';
 const seals=new Map(),cues=[],streaks=[];
 function cueFor(n){return cues[n]||(cues[n]=group.add(buildCue())&&group.children.at(-1));}
 function streakFor(n){return streaks[n]||(streaks[n]=group.add(buildStreak())&&group.children.at(-1));}
 function update(m,settings={},colorOf=()=>'#ffd25a'){
  const reduced=!!settings.reduced,live=new Set();
  group.visible=!!m?.seals&&!m.cinematic;
  for(const s of m?.seals||[]){
   live.add(s.id);let v=seals.get(s.id);if(!v){v=buildSeal();seals.set(s.id,v);group.add(v);}
   const look=sealLook(s,m.tick,reduced),u=v.userData,base=new T.Color(look.threat?colorOf(s.owner):look.escaped?SPENT:look.caught?colorOf(s.owner):SPENT),col=base.clone().lerp(new T.Color(HOT),look.white);
   v.position.set(s.x,0,s.z);v.visible=look.fade>0;
   u.start.visible=u.target.visible=look.threat;
   u.fill.scale.setScalar(look.edge);u.fill.material.color.copy(base);u.fill.material.opacity=look.fillOpacity;
   for(const k of ['edgeInk','edge'])u[k].scale.setScalar(look.edge);
   u.edge.material.color.copy(col);u.edge.material.opacity=look.edgeOpacity;u.edgeInk.material.opacity=.9*look.fade;
   u.wall.scale.set(look.edge,look.wallHeight,look.edge);u.wall.position.y=FLOOR+look.wallHeight/2;u.wall.material.color.copy(col);u.wall.material.opacity=(look.threat?.16+.14*look.progress:.2)*look.fade;
   u.lip.scale.setScalar(look.edge);u.lip.position.y=FLOOR+look.wallHeight;u.lip.material.color.copy(col);u.lip.material.opacity=look.edgeOpacity;
  }
  for(const [id,v] of seals)if(!live.has(id)){group.remove(v);v.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});seals.delete(id);}
  (m?.players||[]).forEach((p,n)=>{
   const r=p.sealEscape,cue=cueFor(n),open=!!r&&m.tick<r.expires&&!p.escapeDash;cue.visible=open;
   if(open){const c=m.players[r.caster],left=Math.max(0,r.expires-m.tick)/SEAL.dashWindow,u=cue.userData;
    cue.position.set(p.x,0,p.z);cue.rotation.y=Math.atan2(-(c.x-p.x),-(c.z-p.z));
    u.arc.geometry.dispose();u.arc.geometry=new T.RingGeometry(.85,1.05,48,1,Math.PI/2,Math.max(.02,left)*Math.PI*2);
    u.chevrons.children.forEach((ch,i)=>{ch.material.opacity=reduced?.95:.55+.4*Math.max(0,Math.sin(m.tick*.35-i*1.2));});}
   const d=p.escapeDash,streak=streakFor(n);streak.visible=!!d;
   if(d){streak.position.set(p.x,0,p.z);streak.rotation.y=Math.atan2(d.aimX,d.aimZ);streak.children.forEach((s,i)=>s.material.opacity=reduced?.5:.35+.35*((m.tick+i)%3===0));}
  });
 }
 function reset(){for(const v of seals.values()){group.remove(v);v.traverse(o=>{o.geometry?.dispose();o.material?.dispose();});}seals.clear();}
 return {group,update,reset};
}
