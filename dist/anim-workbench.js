import * as T from './vendor/three.module.js';
import {createView} from './render.js';
import {fighters} from './fighters.js';
import {RECIPES,createScenario,stepScenario} from './sandbox-recipes.js';
import {setLocomotionSource,setReactionSource} from './locomotion-clips.js';
import {setAttackTells} from './grounded-animation.js';
import {TWEAKS,KEY_NAMES,keyTimes,moveKey,tweakState} from './anim-tweaks.js';
import {combatTuning,combatClip,clipU} from './imported-combat.js';
import {weightTuning,weightShift} from './weight-transfer.js';
import {LEAD} from './grounded-animation.js';
import {getUpWarp} from './imported-motion.js';
// ANIM-WORKBENCH: see and tune animation on the real rigs instead of editing numbers blind. Every frame comes from the
// real simulation (sandbox recipes plus a few workbench recipes that press the real inputs), animated by the real
// animators and drawn by the game's renderer. View A is the authored reference with no tweaks; view B is the chosen
// source (captured, hybrid = captured + keyed tweaks, or authored + tweaks). Scrubbing replays from the reset, so a
// frame is the same frame in both views and in the game.
const $=s=>document.querySelector(s),V=T.Vector3,params=new URLSearchParams(location.search);
// Workbench recipes: real inputs for each special (commands.js: direction + attack, fired on release).
const seq=steps=>f=>steps[f]||{};
Object.assign(RECIPES,{
 'wb-shot':{distance:6,frames:60,p1:seq({0:{attack:true}})},
 'wb-forward':{distance:3,frames:80,p1:seq({0:{x:1},1:{x:1,attack:true},2:{x:1}})},
 'wb-back':{distance:3,frames:80,p1:seq({0:{x:-1},1:{x:-1,attack:true},2:{x:-1}})},
 'wb-technique':{distance:3,frames:80,p1:seq({0:{z:-1},1:{z:-1,attack:true},2:{z:-1}})},
 // The KO collapse and the victory are staged by the renderer's cue, not the simulation: apply the same override.
 'wb-defeat':{distance:2.5,frames:110,stage:(m,f)=>Object.assign(m.players[0],{anim:'defeat',animTime:f/60,move:null,guard:false})},
 'wb-victory':{distance:2.5,frames:90,stage:(m,f)=>Object.assign(m.players[0],{anim:'victory',animTime:f/60,move:null,guard:false})}
});
const STATES=[
 ['Idle','idle',90],['Run · advance','approach',50],['Run · retreat','retreat',50],['Run · circle left','ab-circle-left-guard',90],['Run · circle right','ab-circle-right-guard',90],
 ['Strike 1','strike1',50],['Strike 1→2 chain','strike2',80],['Strike 1→2→3 chain','strike3',110],['Shot','wb-shot',60],['Forward special','wb-forward',80],['Back special','wb-back',80],
 ['Technique','wb-technique',80],['Launch','launch',90],['Burst','burst',90],['Grapple (capture)','capture',100],['Knockdown → get-up','ab-knockdown-getup-guard',180],['Defeat (KO collapse)','wb-defeat',110],
 ['Hit reaction','recoil',60],['Stagger','stagger',90],['Victory','wb-victory',90]
];
const ankle=(r,i)=>r.knees[i].localToWorld(new V(0,-(r.shinLength||r.legLength||.48),0));
const JOINTS={
 'Hips':{get:r=>r.limbs[1].parent,ch:['bodyX','bodyY','bodyZ','hipYaw','bodyPitch','bodyRoll']},
 'Spine/Chest':{get:r=>r.spine,ch:['lean','twist','side']},
 'Head':{get:r=>r.head,ch:['hx','hy','hz','neckY','neckZ']},
 'Clavicle.L':{get:r=>r.limbs[0],ch:['lc']},'Clavicle.R':{get:r=>r.limbs[2],ch:['rc']},
 'Shoulder.L':{get:r=>r.limbs[0],ch:['lax','lay','laz']},'Shoulder.R':{get:r=>r.limbs[2],ch:['rax','ray','raz']},
 'Elbow.L':{get:r=>r.elbows[0],ch:['le']},'Elbow.R':{get:r=>r.elbows[1],ch:['re']},
 'Wrist.L':{get:r=>r.limbs[0].userData.hand,ch:['lw','lwx','lwz']},'Wrist.R':{get:r=>r.limbs[2].userData.hand,ch:['rw','rwx','rwz']},
 'Hip.L':{get:r=>r.limbs[1],ch:['llx','llz']},'Hip.R':{get:r=>r.limbs[3],ch:['rlx','rlz']},
 'Knee.L':{get:r=>r.knees[0],ch:['lk']},'Knee.R':{get:r=>r.knees[1],ch:['rk']},
 'Ankle.L':{pos:r=>ankle(r,0),ch:[]},'Ankle.R':{pos:r=>ankle(r,1),ch:[]},
 'FootTarget.L':{pos:r=>r.footTargets?.[0]?.clone()||ankle(r,0),ch:[]},'FootTarget.R':{pos:r=>r.footTargets?.[1]?.clone()||ankle(r,1),ch:[]},
 'Blade tip':{pos:r=>r.limbs[2].userData.hand.localToWorld(new V(0,.12,1.48)),ch:[],blade:true}
};
const jointPos=(r,name)=>{const j=JOINTS[name];return j.pos?j.pos(r):j.get(r).getWorldPosition(new V());};
const BONES=[['Hips','Spine/Chest'],['Spine/Chest','Head'],['Spine/Chest','Shoulder.L'],['Spine/Chest','Shoulder.R'],['Shoulder.L','Elbow.L'],['Elbow.L','Wrist.L'],['Shoulder.R','Elbow.R'],['Elbow.R','Wrist.R'],['Hips','Hip.L'],['Hips','Hip.R'],['Hip.L','Knee.L'],['Knee.L','Ankle.L'],['Hip.R','Knee.R'],['Knee.R','Ankle.R']];
const RANGE=ch=>ch.startsWith('body')?.4:1;
// ---- state ----
const state={fighter:Number(params.get('fighter')??2),stateIndex:Math.max(0,STATES.findIndex(s=>s[1]===params.get('state'))),source:params.get('source')||'imported',layout:params.get('layout')||'split',camera:params.get('camera')||'orbit',
 frame:0,frames:60,playing:false,speed:1,joint:null,key:'impact',orbit:{yaw:.45,pitch:.16,dist:7.2},move:null,trails:{A:[],B:[]},s:null,dirty:true};
const views={A:{canvas:$('#viewA'),label:'A',source:'authored',tweaks:false},B:{canvas:$('#viewB'),label:'B',source:'imported',tweaks:false}};
for(const v of Object.values(views)){v.view=createView(v.canvas,{talaModel:'graphic'});v.view.quality(params.get('quality')||'high');v.extras=new T.Group();v.extras.name='workbench-extras';v.view.scene.add(v.extras);}
// ATTACK-TELLS: ?tell=on turns B into the authored rig with per-move tell loads, A stays the shipped schedule.
const tellB=params.get('tell');
const configureB=()=>{if(tellB){views.B.source='authored';views.B.tweaks=false;views.B.tell=tellB;$('#labelB').textContent='B · TELL '+tellB.toUpperCase();return;}const s=state.source;views.B.source=s==='authored'?'authored':'imported';views.B.tweaks=s!=='imported';$('#labelB').textContent={imported:'B · MOCAP IMPORTED',hybrid:'B · HYBRID (MOCAP + TWEAKS)',authored:'B · AUTHORED + TWEAKS'}[s];};
const ready=v=>new Promise(res=>{let n=0;const t=()=>{const ms=v.view.fighterModels||[];if(ms.length&&ms.every(m=>m.status&&m.status!=='loading')||n++>400)res();else setTimeout(t,25);};t();});
const recipe=()=>STATES[state.stateIndex][1],rival=()=>state.fighter===1?0:1;
function settings(noDraw){
 const m=state.s?.m,p=m?.players[0],target=new V(p?.x||0,1.35,p?.z||0),o=state.orbit;
 const pos=target.clone().add(new V(Math.cos(o.pitch)*Math.sin(o.yaw),Math.sin(o.pitch),Math.cos(o.pitch)*Math.cos(o.yaw)).multiplyScalar(o.dist));
 return {camera:state.camera==='orbit'?'custom':state.camera,cameraPosition:pos,cameraTarget:target,reduced:true,quality:'high',cameraZoom:.7,noDraw};
}
// Render one view with its own animation source and tweak switch (the modules are shared, so set them per call).
function renderView(v,dt,noDraw){setAttackTells(v.tell||'off');setLocomotionSource(v.source);setReactionSource(v.source==='authored'&&!v.tweaks?'authored':'imported');tweakState.enabled=v.tweaks;v.view.render(dt,state.s.m,settings(noDraw));setLocomotionSource('authored');setReactionSource('imported');tweakState.enabled=true;setAttackTells('off');
 const rv=v.view.models?.[1];if(rv)rv.g.visible=$('#rival').checked;}
const visibleViews=()=>state.layout==='overlay'?['A']:state.layout==='single'?['B']:['A','B'];
function step(dt=1/60){stepScenario(state.s);state.s.recipe.stage?.(state.s.m,state.s.frame);for(const k of ['A','B'])renderView(views[k],dt,true);}
const phaseColor=(p)=>{const m=p.move;if(!m)return 0x9aa6b5;const t=keyTimes(m);return m.frame<t.whip?0x4aa3ff:m.frame<m.startup?0xffd34a:m.frame<m.startup+(m.active||1)?0xff4a4a:0x9aa6b5;};
// A full pass over the scenario: trails for both views and the move timing, then the caller replays to its frame.
async function reset(){
 configureB();state.s=createScenario(recipe(),state.fighter,rival());state.s.recipe.stage?.(state.s.m,0);state.frames=state.s.recipe.frames||STATES[state.stateIndex][2]||60;
 for(const v of Object.values(views))v.view.match(state.s.m);await Promise.all(Object.values(views).map(ready));
 const trails={A:[],B:[]};let move=null;
 for(const k of ['A','B'])renderView(views[k],0,true);
 let moveStart=0;
 for(let f=0;f<state.frames;f++){step();const p=state.s.m.players[0];if(p.move&&(!move||p.move!==move.ref||p.move.frame>=move.frame)){if(!move||p.move!==move.ref)moveStart=f+1-p.move.frame;move={ref:p.move,...p.move};}
  for(const k of ['A','B']){const r=views[k].view.models[0];r.g.updateMatrixWorld(true);trails[k].push({at:jointPos(r,trailJoint()),color:phaseColor(p)});}}
 state.trails=trails;state.move=move?{...move,ref:undefined}:null;state.moveStart=moveStart;
 state.s=createScenario(recipe(),state.fighter,rival());state.s.recipe.stage?.(state.s.m,0);for(const v of Object.values(views))v.view.match(state.s.m);await Promise.all(Object.values(views).map(ready));
 state.frame=0;for(const k of ['A','B'])renderView(views[k],0,true);state.dirty=false;
 $('#timeline').max=state.frames;markers();buildChannels();drawWarp();
}
async function seek(target){
 target=Math.max(0,Math.min(state.frames,Math.round(target)));
 if(state.dirty||target<state.frame)await reset();
 while(state.frame<target){step();state.frame++;}
 draw();
}
function trailJoint(){
 if(state.joint)return state.joint;const m=state.move,id=fighters[state.fighter].id,r=recipe();
 if(['aegis','morrow'].includes(id)&&m)return 'Blade tip';
 if(m?.kind==='strike')return id==='tala'&&(m.chain===2)?'Wrist.L':'Wrist.R';
 if(/approach|retreat|circle/.test(r))return 'Ankle.L';if(/knockdown|defeat|stagger/.test(r))return 'Hips';return 'Wrist.R';
}
// ---- overlays ----
const mat=(c,o=1)=>new T.MeshBasicMaterial({color:c,transparent:o<1,opacity:o,depthTest:false});
function clearExtras(v){for(const c of [...v.extras.children]){v.extras.remove(c);c.geometry?.dispose();c.material?.dispose();}}
function line(points,colors,v,width=1){const g=new T.BufferGeometry().setFromPoints(points);if(colors){const a=[];for(const c of colors){const col=new T.Color(c);a.push(col.r,col.g,col.b);}g.setAttribute('color',new T.Float32BufferAttribute(a,3));}
 const l=new T.Line(g,new T.LineBasicMaterial({vertexColors:!!colors,color:colors?0xffffff:0xffffff,depthTest:false,transparent:true,opacity:width}));l.renderOrder=1000;v.extras.add(l);return l;}
function centreOfMass(r){
 // Dempster segment masses: head .081, trunk .497, upper arms .028, forearms+hands .022, thighs .1, shanks+feet .061.
 const P=n=>jointPos(r,n),mid=(a,b)=>P(a).add(P(b)).multiplyScalar(.5),parts=[[P('Head'),.081],[mid('Hips','Spine/Chest'),.497],
  [mid('Shoulder.L','Elbow.L'),.028],[mid('Shoulder.R','Elbow.R'),.028],[mid('Elbow.L','Wrist.L'),.022],[mid('Elbow.R','Wrist.R'),.022],
  [mid('Hip.L','Knee.L'),.1],[mid('Hip.R','Knee.R'),.1],[mid('Knee.L','Ankle.L'),.061],[mid('Knee.R','Ankle.R'),.061]];
 const c=new V();let w=0;for(const [p,m] of parts){c.addScaledVector(p,m);w+=m;}return c.multiplyScalar(1/w);
}
function support(r,com){
 const a=ankle(r,0),b=ankle(r,1),g=r.g.getWorldPosition(new V()).y,ab=new T.Vector2(b.x-a.x,b.z-a.z),ap=new T.Vector2(com.x-a.x,com.z-a.z),t=Math.max(0,Math.min(1,ap.dot(ab)/Math.max(1e-6,ab.lengthSq())));
 const d=Math.hypot(com.x-(a.x+ab.x*t),com.z-(a.z+ab.y*t));return {a:new V(a.x,g+.01,a.z),b:new V(b.x,g+.01,b.z),ground:g,distance:d,inside:d<.15};
}
function draw(){
 const info={};
 for(const k of ['A','B']){
  const v=views[k];renderView(v,0,!visibleViews().includes(k));if(v.extras.parent!==v.view.scene)v.view.scene.add(v.extras);clearExtras(v); // match() rebuilds the scene
  const r=v.view.models[0];r.g.updateMatrixWorld(true);
  if($('#trails').checked&&state.trails[k].length>1){line(state.trails[k].map(t=>t.at),state.trails[k].map(t=>t.color),v,.95);
   // WebGL lines are one pixel wide: beads along the path keep the arc readable at fight-camera distance.
   const bead=new T.SphereGeometry(.022,8,6);state.trails[k].forEach((t,i)=>{const b=new T.Mesh(i?bead:bead.clone(),mat(t.color,.9));b.position.copy(t.at);b.renderOrder=1000;v.extras.add(b);});}
  const com=centreOfMass(r),sup=support(r,com);info[k]={com,sup,r};
  if($('#com').checked){const col=sup.inside?0x5dff8a:0xffa23a;line([com,new V(com.x,sup.ground+.01,com.z)],null,v,.9).material.color.set(col);line([sup.a,sup.b],null,v,.8).material.color.set(0x8cc8ff);
   const dot=new T.Mesh(new T.SphereGeometry(.045,12,8),mat(col));dot.position.copy(com);dot.renderOrder=1001;v.extras.add(dot);
   const ring=new T.Mesh(new T.RingGeometry(.05,.08,24),mat(col,.9));ring.rotation.x=-Math.PI/2;ring.position.set(com.x,sup.ground+.012,com.z);ring.renderOrder=1001;v.extras.add(ring);}
  if($('#joints').checked)for(const name of Object.keys(JOINTS)){if(JOINTS[name].blade&&!['aegis','morrow'].includes(fighters[state.fighter].id))continue;
   const s=new T.Mesh(new T.SphereGeometry(name===state.joint?.06:.035,12,8),mat(name===state.joint?0xffd34a:0xffffff,name===state.joint?1:.75));s.position.copy(jointPos(r,name));s.userData.joint=name;s.renderOrder=1002;v.extras.add(s);}
  v.joints=r;
 }
 // Overlay: B's skeleton drawn over A (same simulation position, so the bodies line up).
 if(state.layout==='overlay'){const rb=views.B.view.models[0];const pts=[];for(const [a,b] of BONES)pts.push(jointPos(rb,a),jointPos(rb,b));const g=new T.BufferGeometry().setFromPoints(pts),l=new T.LineSegments(g,new T.LineBasicMaterial({color:0xff5fd2,depthTest:false}));l.renderOrder=1003;views.A.extras.add(l);}
 for(const k of visibleViews())renderView(views[k],0,false);
 readouts(info);$('#timeline').value=state.frame;$('#frameLabel').textContent=`frame ${state.frame} / ${state.frames} · ${(state.frame/60).toFixed(3)} s`;drawWarp();
 window.animWorkbench.last=Object.fromEntries(Object.entries(info).map(([k,i])=>[k,{com:i.com.toArray(),comInside:i.sup.inside,comDistance:+i.sup.distance.toFixed(3)}]));
}
function readouts(info){
 const p=state.s.m.players[0],m=p.move;
 for(const k of ['A','B']){const i=info[k];if(!i)continue;const hip=jointPos(i.r,'Hips');
  $('#read'+k).textContent=`${p.anim}${m?` · ${m.kind}${m.chain?' '+m.chain:''} f${m.frame}/${m.startup}`:''}${state.s.m.hitstop>0?' · HITSTOP':''}\nhips ${hip.y.toFixed(2)} high · CoM ${i.sup.inside?'over support':'outside support'} (${i.sup.distance.toFixed(2)})`;}
}
// ---- timeline markers and warp plot ----
function markers(){
 const el=$('#markers');el.replaceChildren();const m=state.move;if(!m)return;const t=keyTimes(m);
 // Move key times are relative to the move's first frame; find it from the trail pass.
 for(const name of ['coil','drive','whip','impact','overshoot','recovery']){const s=document.createElement('span');s.textContent=name;s.style.left=`${100*((state.moveStart||0)+t[name])/state.frames}%`;el.append(s);}
}
function drawWarp(){
 const c=$('#warp'),g=c.getContext('2d'),W=c.width,H=c.height,m=state.move;g.clearRect(0,0,W,H);g.fillStyle='#0b0f17';g.fillRect(0,0,W,H);
 if(!m){$('#warpNote').textContent='No move in this state: the curve shows the selected move\'s timing.';return;}
 const total=m.startup+(m.active||1)+m.recovery,X=f=>8+(W-16)*f/total,Y=v=>H-14-(H-28)*v;
 const clip=fighters[state.fighter].id==='tala'&&views.B.source==='imported'&&combatClip('tala',m);
 g.strokeStyle='#2b3647';g.lineWidth=1;for(const f of [m.startup,m.startup+(m.active||1)]){g.beginPath();g.moveTo(X(f),6);g.lineTo(X(f),H-6);g.stroke();}
 const plot=(fn,col)=>{g.strokeStyle=col;g.lineWidth=3;g.beginPath();for(let f=0;f<=total;f+=.25){const y=Y(fn(f));f?g.lineTo(X(f),y):g.moveTo(X(f),y);}g.stroke();};
 if(clip){plot(f=>clipU(m,clip,f),'#ffd34a');$('#warpNote').textContent=`Captured clip position over the move (impact ${clip.meta.impact.toFixed(2)} lands on frame ${m.startup}): ${clip.meta.source.split(' via')[0]}.`;}
 else{const w=f=>weightShift({...m,frame:f},f);plot(f=>.5+(w(f)?.bodyZ||0)*1.2,'#5dff8a');plot(f=>.5+(w(f)?.lead.z||0)*1.2,'#8cc8ff');plot(f=>.5+(w(f)?.bodyY||0)*2,'#ff9a4a');$('#warpNote').textContent='Weight transfer over the move: hips forward (green), lead foot step (blue), hips height (orange). Vertical lines: contact and end of active.';}
 const cur=state.s?.m.players[0].move;if(cur){g.fillStyle='#ffffff';g.fillRect(X(cur.frame)-1,4,2,H-8);}
}
// ---- joint and tuning panels ----
const fid=()=>fighters[state.fighter].id;
function buildChannels(){
 const box=$('#channels');box.replaceChildren();const j=JOINTS[state.joint||'Hips'],mk=state.move&&moveKey(state.move);
 if(!state.move){box.innerHTML='<p class="muted">This state has no move; tweaks are keyed to a move\'s frames.</p>';return;}
 if(!j.ch.length){box.innerHTML='<p class="muted">Feet are planted by the leg solver; move the hips (or the weight-transfer scale) to move them.</p>';return;}
 for(const ch of j.ch){const row=document.createElement('div');row.className='row';const v=TWEAKS[fid()]?.[mk]?.[state.key]?.[ch]||0,R=RANGE(ch);
  row.innerHTML=`<label>${ch}</label><input type="range" min="${-R}" max="${R}" step=".01" value="${v}"><output>${v.toFixed(2)}</output>`;
  const input=row.querySelector('input'),out=row.querySelector('output');input.oninput=()=>{out.textContent=(+input.value).toFixed(2);};input.onchange=()=>setTweak(state.key,ch,+input.value);box.append(row);}
}
function setTweak(key,ch,value,{replay=true}={}){
 const mk=moveKey(state.move);if(!mk)return;const f=(TWEAKS[fid()]??={}),m=(f[mk]??={}),k=(m[key]??={});
 if(Math.abs(value)<1e-6)delete k[ch];else k[ch]=+value.toFixed(3);if(!Object.keys(k).length)delete m[key];if(!Object.keys(m).length)delete f[mk];if(!Object.keys(f).length)delete TWEAKS[fid()];
 exportText();if(replay){state.dirty=true;return seek(state.frame);}
}
const TUNING=[['Wind-up curve',combatTuning,'windup',.5,2.5,.05],['Impact shift',combatTuning,'impactShift',-.2,.2,.01],['Hip lead (f)',combatTuning,'bodyLead',0,5,.5],['Mocap reach',combatTuning,'reach',.5,1.5,.05],['Mocap lean',combatTuning,'lean',-.3,.3,.01],['Return start',combatTuning,'returnStart',.1,.9,.05],
 ['Weight scale',weightTuning,'scale',0,2,.05],['Pelvis lead',LEAD,'lower',0,8,.5],['Spine lead',LEAD,'spine',0,6,.5],['Shoulder lead',LEAD,'arms',0,4,.5],['Clavicle lead',LEAD,'clav',0,4,.5],['Elbow lead',LEAD,'elbows',0,3,.5],['Get-up warp',getUpWarp,'activity',0,1,.05]];
function buildTuning(){const box=$('#tuning');box.replaceChildren();for(const [label,obj,key,min,max,stepv] of TUNING){const row=document.createElement('div');row.className='row';row.innerHTML=`<label>${label}</label><input type="range" min="${min}" max="${max}" step="${stepv}" value="${obj[key]}"><output>${(+obj[key]).toFixed(2)}</output>`;
 const input=row.querySelector('input'),out=row.querySelector('output');input.oninput=()=>{out.textContent=(+input.value).toFixed(2);};input.onchange=()=>{obj[key]=+input.value;exportText();state.dirty=true;seek(state.frame);};box.append(row);}}
function exportData(){return {tweaks:structuredClone(TWEAKS),tuning:{'imported-combat.js combatTuning':{...combatTuning},'weight-transfer.js weightTuning':{...weightTuning},'grounded-animation.js LEAD':{...LEAD},'imported-motion.js getUpWarp':{...getUpWarp}}};}
const moduleText=()=>`// Shipped additive animation tweaks, exported from dist/anim-workbench.html ("Export tuned data").\n// Shape: {fighter: {moveKey: {keyName: {channel: offset}}}}.\nexport const TWEAK_DATA=${JSON.stringify(TWEAKS,null,1)};\n`;
function exportText(){$('#export').value=JSON.stringify(exportData(),null,1);}
// ---- UI wiring ----
fighters.forEach((f,i)=>{const o=document.createElement('option');o.value=i;o.textContent=f.name;$('#fighter').append(o);});$('#fighter').value=state.fighter;
STATES.forEach(([label],i)=>{const o=document.createElement('option');o.value=i;o.textContent=label;$('#state').append(o);});
{const g=document.createElement('optgroup');g.label='All sandbox scenarios';for(const name of Object.keys(RECIPES).filter(n=>!n.startsWith('wb-')&&!STATES.some(s=>s[1]===n))){STATES.push([name,name,RECIPES[name].frames||90]);const o=document.createElement('option');o.value=STATES.length-1;o.textContent=name;g.append(o);}$('#state').append(g);}
$('#state').value=state.stateIndex;
for(const name of Object.keys(JOINTS)){const o=document.createElement('option');o.value=name;o.textContent=name;$('#joint').append(o);}
{const o=document.createElement('option');o.value='';o.textContent='(auto trail joint)';$('#joint').prepend(o);$('#joint').value='';}
for(const k of KEY_NAMES){const o=document.createElement('option');o.value=k;o.textContent=k;$('#key').append(o);}$('#key').value=state.key;
$('#source').value=state.source;$('#layout').value=state.layout;$('#camera').value=state.camera;
const layout=()=>{$('#views').className='views'+(state.layout==='split'?'':' single');document.querySelector('.view.a').style.display=state.layout==='single'?'none':'';document.querySelector('.view.b').style.display=state.layout==='overlay'?'none':'';};
$('#fighter').onchange=e=>{state.fighter=+e.target.value;state.dirty=true;seek(0);};
$('#state').onchange=e=>{state.stateIndex=+e.target.value;state.dirty=true;seek(0);};
$('#source').onchange=e=>{state.source=e.target.value;state.dirty=true;seek(state.frame);};
$('#layout').onchange=e=>{state.layout=e.target.value;layout();draw();};
$('#camera').onchange=e=>{state.camera=e.target.value;draw();};
$('#joint').onchange=e=>{state.joint=e.target.value||null;buildChannels();state.dirty=true;seek(state.frame);};
$('#key').onchange=e=>{state.key=e.target.value;buildChannels();};
for(const id of ['trails','com','joints','rival'])$('#'+id).onchange=()=>draw();
$('#timeline').oninput=e=>seek(+e.target.value);$('#prev').onclick=()=>seek(state.frame-1);$('#next').onclick=()=>seek(state.frame+1);
$('#speed').onchange=e=>{state.speed=+e.target.value;};
$('#play').onclick=()=>{state.playing=!state.playing;$('#play').textContent=state.playing?'Pause':'Play';if(state.playing)tick();};
let last=0;async function tick(t=performance.now()){if(!state.playing)return;if(t-last>=1000/60/state.speed){last=t;await seek(state.frame>=state.frames?0:state.frame+1);}requestAnimationFrame(tick);}
$('#clearKey').onclick=()=>{const mk=moveKey(state.move);if(TWEAKS[fid()]?.[mk])delete TWEAKS[fid()][mk][state.key];buildChannels();exportText();state.dirty=true;seek(state.frame);};
$('#clearMove').onclick=()=>{const mk=moveKey(state.move);if(TWEAKS[fid()])delete TWEAKS[fid()][mk];buildChannels();exportText();state.dirty=true;seek(state.frame);};
$('#copy').onclick=()=>navigator.clipboard?.writeText($('#export').value);
$('#download').onclick=()=>{const a=document.createElement('a');a.href=URL.createObjectURL(new Blob([moduleText()],{type:'text/javascript'}));a.download='anim-tweaks-data.js';a.click();URL.revokeObjectURL(a.href);};
// Orbit by dragging either view, zoom with the wheel; click a joint sphere to select it.
for(const v of Object.values(views)){
 let drag=null;v.canvas.addEventListener('pointerdown',e=>{drag={x:e.clientX,y:e.clientY,moved:false};v.canvas.setPointerCapture(e.pointerId);});
 v.canvas.addEventListener('pointermove',e=>{if(!drag)return;const dx=e.clientX-drag.x,dy=e.clientY-drag.y;if(Math.abs(dx)+Math.abs(dy)>3)drag.moved=true;if(!drag.moved)return;state.orbit.yaw-=dx*.008;state.orbit.pitch=Math.max(-.2,Math.min(1.3,state.orbit.pitch+dy*.006));drag.x=e.clientX;drag.y=e.clientY;if(state.camera!=='orbit'){state.camera='orbit';$('#camera').value='orbit';}draw();});
 v.canvas.addEventListener('pointerup',e=>{if(drag&&!drag.moved)pick(v,e);drag=null;});
 v.canvas.addEventListener('wheel',e=>{e.preventDefault();state.orbit.dist=Math.max(1.5,Math.min(14,state.orbit.dist*(1+Math.sign(e.deltaY)*.1)));if(state.camera!=='orbit'){state.camera='orbit';$('#camera').value='orbit';}draw();},{passive:false});
}
function pick(v,e){const rect=v.canvas.getBoundingClientRect(),ray=new T.Raycaster();ray.setFromCamera(new T.Vector2((e.clientX-rect.left)/rect.width*2-1,-(e.clientY-rect.top)/rect.height*2+1),v.view.camera);
 const hit=ray.intersectObjects(v.extras.children.filter(c=>c.userData.joint),false)[0];if(hit){selectJoint(hit.object.userData.joint);}}
function selectJoint(name){state.joint=name;$('#joint').value=name;buildChannels();state.dirty=true;return seek(state.frame);}
// ---- automation hooks (Playwright) ----
window.animWorkbench={state,views,JOINTS,STATES,seek,reset,draw,exportData,moduleText,selectJoint,setTweak,
 set:async(o={})=>{if(o.fighter!==undefined){state.fighter=o.fighter;$('#fighter').value=o.fighter;}if(o.state!==undefined){state.stateIndex=typeof o.state==='number'?o.state:STATES.findIndex(s=>s[1]===o.state||s[0]===o.state);$('#state').value=state.stateIndex;}
  if(o.source){state.source=o.source;$('#source').value=o.source;}if(o.layout){state.layout=o.layout;$('#layout').value=o.layout;layout();}if(o.camera){state.camera=o.camera;$('#camera').value=o.camera;}if(o.orbit)Object.assign(state.orbit,o.orbit);
  if(o.joint!==undefined){state.joint=o.joint;$('#joint').value=o.joint||'';}if(o.key){state.key=o.key;$('#key').value=o.key;}
  if(o.tuning)for(const [obj,vals] of [[combatTuning,o.tuning.combat],[weightTuning,o.tuning.weight],[LEAD,o.tuning.lead],[getUpWarp,o.tuning.getUp]])if(vals)Object.assign(obj,vals);
  state.dirty=true;buildTuning();await seek(o.frame??state.frame);},
 get trails(){return {A:state.trails.A.map(t=>t.at.toArray()),B:state.trails.B.map(t=>t.at.toArray())};},
 ready:null};
layout();buildTuning();exportText();
window.animWorkbench.ready=seek(Number(params.get('frame')||0)).then(()=>true);
