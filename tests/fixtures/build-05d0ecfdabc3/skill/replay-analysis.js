// Passive, data-only observer shared by Node and the browser. No combat-state writes.
import {observeCombat} from './observer.js';
import {BANDS,distanceBand} from './telemetry.js';
import {fighters} from '../fighters.js';
import {matchFighter,balanceMoveKey} from '../balance-runtime.js';
import {boundaryGap,ringArena,arenaRadius} from '../arena-bounds.js';
import {lineProjection,linearHits} from '../linear-hits.js';
import {burstV2,BURST_V2} from '../burst-preview.js';
import {specialShots} from '../special-variants.js';
import {clone} from './replay-format.js';
import {EDGE_BAND,PIN_EPS,REPLAY_EDGE_BAND} from './spatial-rules.js';
const counts=()=>Object.fromEntries(BANDS.map(b=>[b,0]));
const inc=(o,k,n=1)=>o[k]=(o[k]||0)+n;
const frames=t=>Math.max(0,Math.floor(t*60+1e-7));
const distance=(a,b)=>Math.hypot(b.x-a.x,b.z-a.z);
const wrapped=x=>Math.atan2(Math.sin(x),Math.cos(x));
function moveData(m,p,mv=p.move){return mv?{key:balanceMoveKey(fighters[p.id],mv)||mv.kind,name:mv.name||mv.trackingName||(mv.kind==='strike'?`Strike ${mv.chain}`:mv.kind),kind:mv.kind,chain:mv.chain,phase:mv.frame<mv.startup?'startup':mv.frame<mv.startup+mv.active?'active':'recovery',frame:mv.frame,total:mv.total,startup:mv.startup,active:mv.active,recovery:mv.recovery,tracking:!!mv.tracking}:null;}
function projectileLane(p,b,linearWidth=null){
 const speed=Math.hypot(p.dx,p.dz),projection=lineProjection(p,b,{aimX:p.dx,aimZ:p.dz}),reach=speed*p.life,width=Math.min(p.radius+.5,linearWidth??Infinity);
 return {...projection,origin:{x:p.x,z:p.z},velocity:{x:p.dx,z:p.dz},reach,halfWidth:width,insideReach:projection.forward>=0&&projection.forward<=reach,insideWidth:Math.abs(projection.lateral)<=width};
}
export function attackLane(m,a,b,mv=a.move){
 if(!mv||mv.frame>=mv.startup+mv.active)return null;
 const f=matchFighter(m,a),spec=mv.stockSpecial||mv.special,projection=lineProjection(a,b,mv),radial=['spin','sphere'].includes(mv.effect)||!!spec?.area;
 let shots=null;
 if(spec&&!spec.area)shots=specialShots(spec,a,mv,m.players.indexOf(a),f.power);
 else if(mv.kind==='shot')shots=[{x:a.x+mv.aimX*.8,z:a.z+mv.aimZ*.8,dx:mv.aimX*f.shotSpeed,dz:mv.aimZ*f.shotSpeed,life:2,radius:f.id==='vesper'?.7:.4}];
 else if(mv.kind==='technique'&&['wheel','fan','lance'].includes(mv.effect)){const count=mv.effect==='fan'?3:1,speed=mv.effect==='lance'?18:9;shots=Array.from({length:count},(_,j)=>{const angle=Math.atan2(mv.aimZ,mv.aimX)+(j-(count-1)/2)*.3;return {x:a.x+mv.aimX,z:a.z+mv.aimZ,dx:Math.cos(angle)*speed,dz:Math.sin(angle)*speed,life:2.6,radius:mv.effect==='lance'?.5:.9};});}
 else if(mv.kind==='capture'&&distance(a,b)>=3.1)shots=[{x:a.x+mv.aimX,z:a.z+mv.aimZ,dx:mv.aimX*7,dz:mv.aimZ*7,life:1.8,radius:.65}];
 if(shots){const paths=shots.map(p=>projectileLane(p,b,linearHits(m)&&mv.kind==='forward'?mv.hitWidth:null));return {...projection,model:'projectile',reach:Math.max(...paths.map(p=>p.reach)),halfWidth:null,insideReach:paths.some(p=>p.insideReach),insideWidth:paths.some(p=>p.insideWidth),inside:null,paths,tracking:false,note:'Projected spawn paths, not a collision prediction; targets may move. Live projectiles logged separately.'};}
 const reach=mv.kind==='capture'?3.1:mv.kind==='super'?(burstV2(m)?BURST_V2.reach:9):spec?.area??mv.reach??(mv.kind==='launch'?f.reach+.3:mv.kind==='pursuit'?2.2:mv.kind==='jumpAttack'?2.3:f.reach),width=mv.hitWidth??null,model=mv.kind==='super'?(burstV2(m)?'burst-arc':'radial'):linearHits(m)&&!mv.tracking?'line':radial||mv.kind==='capture'?'radial':'cone',d=distance(a,b),facing=d<.01||projection.forward/d>.55;
 const insideReach=model==='line'?projection.forward>=0&&projection.forward<=reach:d<reach,insideWidth=width===null?null:Math.abs(projection.lateral)<=width,inside=model==='line'?insideReach&&insideWidth:model==='burst-arc'?d<=reach&&projection.forward/(d||1)>=.5:model==='radial'?insideReach:insideReach&&facing;
 return {...projection,reach,halfWidth:width,insideReach,insideWidth,inside,model,tracking:!!mv.tracking,invulnerable:b.inv>0};
}
function loco(p,input,velocity){if(p.air>0)return 'airborne';if(p.getUp)return 'getUp';if(p.jumpSquat)return 'jumpSquat';if(p.knockdown||p.bounce||p.anim==='knockdown')return 'knockdown';if(p.stun>0||p.blockStun>0||p.staggerState)return 'stunned';if(p.step)return p.step.kind;if(p.travel)return 'circle';if(p.guard)return 'guard';if(Math.hypot(velocity.x,velocity.z)<1e-8)return 'idle';if(input.x>.1)return 'walk toward';if(input.x<-.1)return 'walk away';if(Math.abs(input.z)>.1)return 'circle';return 'displaced';}
export function createFrameAnalysis(m,{round=1,keepFrames=true}={}){
 const events=[],log=[],exchanges=[],seen=new WeakSet(),resolved=new WeakSet(),stepSeen=new WeakSet(),pending=[new Map(),new Map()],angle=m.players.map((p,i)=>Math.atan2(p.z-m.players[1-i].z,p.x-m.players[1-i].x)),running=[0,0];
 const players=m.players.map(()=>({simulationFrames:0,distanceFrames:counts(),damageDealtByBand:counts(),damageTakenByBand:counts(),walkedToward:0,walkedAway:0,edgeFrames:0,tournamentEdgeFrames:0,pinnedHits:0,edgeHits:0,edgeEscapes:0,edgeTrapped:0,totalCirclingRadians:0,habits:{},hitPositions:[],sidesteps:{started:0,steppedOutOfLane:0,stillHit:0,intoTracking:0,unthreatened:0},edgePushes:0}));
 const advantageWindows=[],pushes=[null,null];let before=null,tick=0,edge=m.players.map(p=>({inside:boundaryGap(p)<=REPLAY_EDGE_BAND,hit:false})),exchange=m.players.map(p=>({x:p.x,z:p.z})),stepStates=[null,null],inputs;
 const state=p=>({x:p.x,z:p.z,hp:p.hp,guard:p.guard,anim:p.anim,stun:p.stun,blockStun:p.blockStun,getUp:!!p.getUp,knockdown:!!p.knockdown,down:!!p.knockdown||!!p.bounce||p.anim==='knockdown',roll:p.roll,move:p.move,moveFrame:p.move?.frame,step:p.step,gap:boundaryGap(p)});
 function start(i,mv){if(!mv||seen.has(mv))return;seen.add(mv);const p=m.players[i],b=m.players[1-i];events.push({type:'moveStart',player:i,move:moveData(m,p,mv),distance:distance(p,b),facing:{x:p.lookX,z:p.lookZ},lane:attackLane(m,p,b,mv)});}
 const dispose=observeCombat(m,e=>{
  if(e.attacker!==undefined&&e.source)start(e.attacker,e.source);
  const out={...e};delete out.source;delete out.move;
  if(e.move)out.move=moveData(m,m.players[e.attacker],e.move);
  if(e.attacker!==undefined&&e.defender!==undefined){const a=m.players[e.attacker],b=m.players[e.defender],d=distance(a,b);out.distance=d;out.positions=[a,b].map(p=>({x:p.x,z:p.z}));out.bands=[distanceBand(d,matchFighter(m,a).reach),distanceBand(d,matchFighter(m,b).reach)];out.boundaryGap=boundaryGap(b);out.source=e.source?moveData(m,a,e.source):null;
   if(['damage','block'].includes(e.type)&&e.source&&!e.source.launch&&!b.launched){const remaining=Math.max(0,e.source.total-e.source.frame-1),stun=frames(e.type==='block'?b.blockStun:b.stun);out.frameAdvantage={nominal:stun-remaining,defenderStun:stun,attackerRemaining:remaining,definition:'stun - remaining active/recovery (excludes shared hitstop; assumes no chain/cancel)',observed:null};}
  }
  if(out.frameAdvantage)advantageWindows.push({attacker:out.attacker,defender:out.defender,contactInputFrame:tick+1,contactTick:m.tick,nominal:out.frameAdvantage.nominal,ready:[null,null],interrupted:false});
  if(e.type==='damage')pushes[e.defender]={attacker:e.attacker,gap:out.boundaryGap};
  events.push(out);
 });
 function queue(i,situation){pending[i].set(situation,tick);}
 function action(i,name){for(const [situation,at] of pending[i])if(at<tick){const table=players[i].habits[situation]??={};inc(table,name);pending[i].delete(situation);}}
 return {dispose,log,players,
  before(value){inputs=value;before={tick:m.tick,players:m.players.map(state)};events.length=0;m.players.forEach((p,i)=>start(i,p.move));},
  after(){
   if(!before)throw Error('Frame observer requires before(inputs)');tick++;const advanced=m.tick-before.tick,d=distance(...m.players),reaches=m.players.map(p=>matchFighter(m,p).reach);
   m.players.forEach((p,i)=>{start(i,p.move);const old=before.players[i],mv=old.move||p.move;if(mv&&!resolved.has(mv)&&['strike','launch'].includes(mv.kind)&&mv.frame>=mv.startup+mv.active){resolved.add(mv);if(!mv.connected&&!mv.contactResolved){events.push({type:'whiff',player:i,move:moveData(m,p,mv)});queue(i,'whiff');queue(1-i,'rivalWhiff');}}
    if(p.step&&!stepSeen.has(p.step)){stepSeen.add(p.step);events.push({type:'stepStart',player:i,kind:p.step.kind});if(p.step.kind==='sidestep'){players[i].sidesteps.started++;const rival=m.players[1-i],lane=attackLane(m,rival,p);stepStates[i]={move:rival.move,threatened:!!lane?.inside,out:false,hit:false,tracking:false};}}
    const ss=stepStates[i];if(ss){if(!ss.move&&m.players[1-i].move)ss.move=m.players[1-i].move;const lane=ss.move?attackLane(m,m.players[1-i],p,ss.move):null;if(lane?.inside)ss.threatened=true;if(lane?.model==='line'&&ss.threatened&&!lane.inside)ss.out=true;}
    if(old.getUp&&!p.getUp)queue(i,'getUp');if(!old.down&&(p.knockdown||p.bounce||p.anim==='knockdown'))queue(i,'knockdown');if(p.roll&&!old.roll)events.push({type:'rollStart',player:i});
   });
   for(const e of events){if(['block','perfectGuard'].includes(e.type)&&e.defender!==undefined)queue(e.defender,'block');if(e.type==='damage')queue(e.defender,'beingHit');
    if(['damage','block'].includes(e.type)){
     const a=e.attacker,b=e.defender,pa=players[a],pb=players[b];pa.damageDealtByBand[e.bands[0]]+=e.damage;pb.damageTakenByBand[e.bands[1]]+=e.damage;
     if(e.type==='damage'){if(e.boundaryGap<=REPLAY_EDGE_BAND){pb.edgeHits++;edge[b].hit=true;}if(e.boundaryGap<=PIN_EPS)pb.pinnedHits++;if(stepStates[b]){stepStates[b].hit=true;if(e.source?.tracking||e.move?.tracking||before.players[a].move?.tracking)stepStates[b].tracking=true;}}
     const positions=m.players.map(p=>({x:p.x,z:p.z})),closed=positions.map((p,i)=>{const old=exchange[i],rival=exchange[1-i],n=distance(old,rival)||1;return ((p.x-old.x)*(rival.x-old.x)+(p.z-old.z)*(rival.z-old.z))/n;});e.exchange={closedByPlayer:closed,closer:closed[0]===closed[1]?null:closed[0]>closed[1]?0:1};exchanges.push({inputFrame:tick,tick:m.tick,attacker:a,defender:b,type:e.type,damage:e.damage,...e.exchange,positions:e.positions});exchange=positions;
     const point={inputFrame:tick,tick:m.tick,attacker:a,defender:b,damage:e.damage,type:e.type,attackerPosition:e.positions[0],defenderPosition:e.positions[1],distance:e.distance,bands:e.bands};pa.hitPositions.push({...point,role:'dealt'});pb.hitPositions.push({...point,role:'taken'});
    }
   }
   for(const w of advantageWindows){for(const i of [w.attacker,w.defender]){const p=m.players[i];if(w.ready[i]===null&&!p.move&&p.cool<=0&&p.stun<=0&&p.blockStun<=0&&!p.step&&!p.travel&&!p.getUp&&!p.jumpSquat&&!m.cinematic&&!m.pressure&&p.air<=0&&m.hitstop===0)w.ready[i]=m.tick;}if(w.ready.every(x=>x!==null)){events.push({type:'frameAdvantageResolved',attacker:w.attacker,defender:w.defender,contactInputFrame:w.contactInputFrame,nominal:w.nominal,observed:w.ready[w.defender]-w.ready[w.attacker],readyTicks:w.ready,definition:'first grounded ready state; later attacks, chains and interruptions may change this observational value'});}}
   for(let n=advantageWindows.length-1;n>=0;n--)if(advantageWindows[n].ready.every(x=>x!==null))advantageWindows.splice(n,1);
   const frame={round,projectiles:m.projectiles.map(p=>({owner:p.owner,kind:p.kind,x:p.x,z:p.z,life:p.life,radius:p.radius,lane:projectileLane(p,m.players[1-p.owner],p.linearPath?.width)})),inputFrame:tick,tick:m.tick,advanced,frozen:!!m.frozen,hitstop:m.hitstop,cinematic:m.cinematic?{kind:m.cinematic.kind,t:m.cinematic.t,duration:m.cinematic.duration}:null,inputs:clone(inputs),events:clone(events),players:m.players.map((p,i)=>{
    const old=before.players[i],b=m.players[1-i],velocity={x:(p.x-old.x)*60,z:(p.z-old.z)*60},gap=boundaryGap(p),theta=Math.atan2(p.z-b.z,p.x-b.x);running[i]+=wrapped(theta-angle[i]);angle[i]=theta;
    if(pushes[i]){const push=pushes[i];if(gap<push.gap&&gap<=REPLAY_EDGE_BAND)players[push.attacker].edgePushes+=push.gap-gap;if(!p.knockback)pushes[i]=null;else push.gap=gap;}
    const stats=players[i],dx=p.x-old.x,dz=p.z-old.z,n=distance(old,b)||1,toward=(dx*(b.x-old.x)+dz*(b.z-old.z))/n,locomotion=loco(p,inputs[i],velocity),band=distanceBand(d,reaches[i]);
    stats.simulationFrames+=advanced;stats.distanceFrames[band]+=advanced;if(locomotion==='walk toward')stats.walkedToward+=Math.max(0,toward);if(locomotion==='walk away')stats.walkedAway+=Math.max(0,-toward);if(gap<=REPLAY_EDGE_BAND)stats.edgeFrames+=advanced;if(gap<=EDGE_BAND)stats.tournamentEdgeFrames+=advanced;
    if(['circle','sidestep'].includes(locomotion))stats.totalCirclingRadians+=Math.abs((dx*(b.z-old.z)-dz*(b.x-old.x))/(n*n));
    if(!edge[i].inside&&gap<=REPLAY_EDGE_BAND){edge[i]={inside:true,hit:false};queue(i,'reachingEdge');}else if(edge[i].inside&&gap>REPLAY_EDGE_BAND){if(edge[i].hit)stats.edgeTrapped++;else stats.edgeEscapes++;edge[i]={inside:false,hit:false};}
    if(stepStates[i]&&!p.step){const ss=stepStates[i];if(!ss.threatened)stats.sidesteps.unthreatened++;if(ss.out&&!ss.hit)stats.sidesteps.steppedOutOfLane++;if(ss.hit)stats.sidesteps.stillHit++;if(ss.tracking)stats.sidesteps.intoTracking++;stepStates[i]=null;}
    if((p.knockdown||p.bounce||p.anim==='knockdown')&&gap<=REPLAY_EDGE_BAND)edge[i].hit=true;
    const started=events.find(e=>e.type==='moveStart'&&e.player===i),step=events.find(e=>e.type==='stepStart'&&e.player===i);if(started)action(i,started.move.kind);else if(step)action(i,step.kind);else if(events.some(e=>e.type==='rollStart'&&e.player===i))action(i,'roll');else if(p.guard&&!old.guard){events.push({type:'guardStart',player:i});action(i,'guard');}else if(['walk toward','walk away','circle'].includes(locomotion))action(i,locomotion);
    return {x:p.x,z:p.z,lookX:p.lookX,lookZ:p.lookZ,velocity,distance:d,band,rivalBand:distanceBand(d,reaches[1-i]),insideMyReach:d<=reaches[i],insideHisReach:d<=reaches[1-i],betweenReaches:d>Math.min(...reaches)&&d<=Math.max(...reaches),myReach:reaches[i],rivalReach:reaches[1-i],centreDistance:Math.hypot(p.x,p.z),boundaryGap:gap,angleFromRoundStart:running[i],move:moveData(m,p),lane:attackLane(m,p,b),hitstun:Math.max(0,Math.ceil(p.stun*60-1e-7)),blockstun:Math.max(0,Math.ceil(p.blockStun*60-1e-7)),stunSeconds:p.stun,blockstunSeconds:p.blockStun,posture:clone({step:p.step??null,jumpSquat:p.jumpSquat,getUp:p.getUp,knockdown:p.knockdown,bounce:p.bounce}),locomotion,hp:p.hp};
   })};frame.events=clone(events);if(keepFrames)log.push(frame);before=null;return frame;
  },
  summary(){return {round,shape:ringArena(m)?'ring':'rect',radius:ringArena(m)?arenaRadius(m):null,inputFrames:tick,exchanges:clone(exchanges),definitions:{bands:BANDS,edge:1,tournamentEdge:.5,pin:.05,velocity:'world units/second over input frames; zero in hitstop',angles:'unwrapped relative angle from round start in radians',edgePush:'net world units pushed closer to boundary in edge zone by hit knockback',advantage:'nominal lab convention, not an empirical actionable-frame/cancel guarantee'},players:players.map((p,i)=>({...clone(p),netWalkToward:p.walkedToward-p.walkedAway,distanceShare:Object.fromEntries(BANDS.map(b=>[b,p.simulationFrames?p.distanceFrames[b]/p.simulationFrames:0])),edgeTrapped:p.edgeTrapped+(edge[i].inside&&edge[i].hit?1:0)}))};}
 };
}
