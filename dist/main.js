import {grabFromSearch,grabControlsHTML} from './grab-options.js';
const grabPreview=grabFromSearch(location.search);
import {liveStats,statsHTML,bindStats} from './skill/live.js';
let telemetry=null;
import {loadBalancePreview,showBalancePreview} from './balance-preview.js';
const balancePreview=await loadBalancePreview(location.search,{getItem:key=>localStorage.getItem(key)});showBalancePreview(balancePreview);
if(Object.keys(grabPreview).length){const note=document.createElement('div');note.id='grab-preview-status';note.textContent='GRAB PREVIEW · '+Object.keys(grabPreview).join(' + ');Object.assign(note.style,{position:'fixed',bottom:'8px',left:'8px',zIndex:101,background:'#19212e',color:'#ffe295',padding:'6px 12px',font:'bold 13px system-ui'});document.body.append(note);}
import {setLocomotionSource,setReactionSource} from './locomotion-clips.js';
setLocomotionSource(new URLSearchParams(location.search).get('gait'));setReactionSource(new URLSearchParams(location.search).get('react'));
import {lessons,lessonMatch,lessonOpponent,updateLesson,lessonText} from './lessons.js';
import {pressureText} from './pressure-dash.js';
import {recoveryText} from './recovery.js';
import {chargeText} from './charge.js';
import {reversalPrompt} from './reversal.js';
import {trainingStaggerText} from './stagger.js';
import {defaultBindings,normalizeBindings,rebind,bindingLabels,keyName,touchBinding} from './key-bindings.js';
import {createKeyboardInput} from './keyboard-input.js';
import {stockSpecials} from './stock-specials.js';
import {recordInput,comboPracticeInput} from './training.js';
import {normalizeOptions,readPad} from './options.js';
import {canSpecialFollowUp,specialVariants,baseSpecials} from './special-variants.js';
import {canFollowUp} from './techniques.js';
import {movePhase,canChain} from './moves.js';
import {fighters} from './fighters.js';
import {createMatch,update,aiInput,neutral,STEP} from './combat.js';
import {createView} from './render.js';
import {createAudio} from './audio.js';
import {createFlow,advanceFlow,beginKO,simulationRuns,cameraCue} from './presentation.js';
import {homeArena} from './arenas.js';
import {updateStaggerHud,gaugeState,gaugeLabel,gemStates,shardPlan,damageShards,createTrail,updateTrail,healthClass,barShatterEvent} from './hud.js';
const $=s=>document.querySelector(s),keys=createKeyboardInput();let selected=2,match=null,paused=false,round=0,wins=[0,0],stage=0,mode='arcade',last=0,acc=0,calloutTime=0,view,controllerMenuTime=0,previousPad=[],padAwaitRelease=false,inputHistory=[],flow=null,hitstop=0,arenaIndex=0;
const audio=createAudio();
let bindings=defaultBindings(),bindingCapture=null;try{bindings=normalizeBindings(JSON.parse(localStorage.getItem('rift-keyboard')||'null'));}catch{}
keys.configure(bindings);
let settings=normalizeOptions();try{settings=normalizeOptions(JSON.parse(localStorage.getItem('rift-options')||'{}'));}catch{}
if(new URLSearchParams(location.search).get('stats')==='1')settings.showMatchStats=true;
if(new URLSearchParams(location.search).has('sandbox'))location.replace('./sandbox.html'+location.search);
const talaOverride=new URLSearchParams(location.search).get('tala');if(['classic','concept'].includes(talaOverride))settings.talaModel=talaOverride;
let activeTalaModel=['design02','v3','graphic'].includes(talaOverride)?talaOverride:settings.talaModel;
function save(){audio.configure(settings);try{localStorage.setItem('rift-options',JSON.stringify(settings));}catch{}}
audio.configure(settings);
try{view=createView($('#scene'),{...settings,talaModel:activeTalaModel});view.quality(settings.quality);}catch(e){$('#error').hidden=false;$('#error').textContent='Rift Duel needs WebGL 2. Enable hardware acceleration or try a current Chrome, Firefox, Edge, or Safari browser. '+e.message;throw e;}
const sound=(kind='ui',arg)=>audio.sfx(kind,arg);
function enableSound(){const wasReady=audio.ready;audio.resume();$('#sound').textContent=settings.volume?'SOUND ON':'SOUND OFF';if(!wasReady&&!match)audio.play('menu');}
$('#sound').onclick=()=>{if(!audio.ready){enableSound();}else{settings.volume=settings.volume?0:.25;save();$('#sound').textContent=settings.volume?'SOUND ON':'SOUND OFF';if(settings.volume&&!audio.playing)audio.play(match?fighters[arenaIndex].id:'menu');}sound('ui');};
const sigils=['⌁','✧','ϟ','⟁','☼','◎'];
$('#roster').innerHTML=fighters.map((f,i)=>`<button class="card" data-id="${i}" style="--c:${f.color}" aria-pressed="${i===0}"><span class="sigil">${sigils[i]}</span><b>${f.name}</b><small>${f.style.split(' / ')[0].toUpperCase()}</small></button>`).join('');
$('#opponent').innerHTML=fighters.map((f,i)=>`<option value="${i}">${f.name}</option>`).join('');$('#opponent').value='1';
function select(i){selected=(i+fighters.length)%fighters.length;const f=fighters[selected];document.documentElement.style.setProperty('--accent',f.color);$('#hero-name').textContent=f.name;$('#hero-title').textContent=f.title.toUpperCase();$('#hero-number').textContent=`0${selected+1} / 06`;$('#fighter-style').textContent=f.style;$('#fighter-bio').textContent=f.bio;$('#stats').innerHTML=[['SPEED',f.speed/7],['POWER',f.power/1.3],['REACH',f.reach/3.5]].map(([k,v])=>`<div>${k}<i><span style="width:${v*100}%"></span></i></div>`).join('');document.querySelectorAll('.card').forEach((c,i)=>c.setAttribute('aria-pressed',i===selected));view.select(selected);sound('select',selected);}
$('#roster').onclick=e=>{const b=e.target.closest('button');if(b)select(Number(b.dataset.id));};select(selected);
function modeChange(){$('#opponent-label').hidden=$('#mode').value==='arcade';}$('#mode').onchange=modeChange;modeChange();
function showDialog(html){bindingCapture=null;$('#modal-body').innerHTML=html;if(!$('#modal').open)$('#modal').showModal();keys.clear();}
function closeDialog(){bindingCapture=null;if(match?.phase==='over'){home();return;}$('#modal').close();paused=false;keys.clear();audio.duck(false);}
$('#close-modal').onclick=closeDialog;$('#modal').addEventListener('cancel',e=>{e.preventDefault();closeDialog();});
function refreshKeyHints(){
 const names=bindings[0].map(keys=>keyName(keys[0]));
 document.querySelector('.fight-footer span').innerHTML=`<kbd>${names[2]}</kbd> Close <kbd>${names[3]}</kbd> Retreat <kbd>${names[0]}</kbd><kbd>${names[1]}</kbd> Circle `+[4,5,6,7,8,9].map(a=>`<kbd>${names[a]}</kbd> ${bindingLabels[a]}`).join(' ');
 document.querySelector('.menu-footer > span').textContent=`${[2,0,3,1].map(a=>names[a]).join(' / ')} + ${names[4]} / ${names[5]} · OR CONNECT A CONTROLLER`;
}
function keyboardOptions(focus){
 showDialog(`<div class="eyebrow result">KEYBOARD CONTROLS</div><h2>CHOOSE YOUR KEYS.</h2><p>Select a control, then press its new key. Escape cancels. Each key can control only one action across both players. Letters, numbers, arrows, Space and numeric keypad keys are supported.</p><div id="binding-status" role="status" aria-live="polite">Changes apply immediately and save in this browser.</div>${bindings.map((player,p)=>`<h3>PLAYER ${p+1}</h3><table class="controls">${player.map((codes,a)=>`<tr><td>${bindingLabels[a]}</td><td><button id="bind-${p}-${a}" data-player="${p}" data-action="${a}" aria-label="Player ${p+1}, ${bindingLabels[a]}: ${codes.map(keyName).join(' or ')}">${codes.map(keyName).join(' / ')}</button></td></tr>`).join('')}</table>`).join('')}<p>Reassigning a control replaces all of its listed keys. Touch buttons and controllers keep their usual actions. Escape always pauses.</p><button id="restore-keys">RESTORE DEFAULT KEYS</button>`);
 for(const button of document.querySelectorAll('[data-player][data-action]'))button.onclick=()=>{
  if(bindingCapture)keyboardOptions();
  bindingCapture={player:Number(button.dataset.player),action:Number(button.dataset.action)};
  const current=$(`#bind-${bindingCapture.player}-${bindingCapture.action}`);current.textContent='PRESS A KEY…';current.focus();
  $('#binding-status').textContent=`Choose a key for Player ${bindingCapture.player+1}: ${bindingLabels[bindingCapture.action]}. Escape cancels.`;
 };
 $('#restore-keys').onclick=()=>{bindings=defaultBindings();const saved=saveKeys();keyboardOptions('restore-keys');$('#binding-status').textContent=saved?'Default keys restored.':'Default keys applied for this session. Browser storage is unavailable.';};
 if(focus)$('#'+focus)?.focus();
}
function saveKeys(){keys.configure(bindings);refreshKeyHints();try{localStorage.setItem('rift-keyboard',JSON.stringify(bindings));return true;}catch{return false;}}
function captureKey(e){
 if(!bindingCapture)return false;e.preventDefault();e.stopPropagation();
 const {player,action}=bindingCapture,id=`bind-${player}-${action}`;
 if(e.code==='Escape'){keyboardOptions(id);return true;}
 if(e.repeat)return true;
 if(e.ctrlKey||e.altKey||e.metaKey||e.shiftKey){$('#binding-status').textContent='Press one key without Shift, Control, Alt or Command.';return true;}
 try{bindings=rebind(bindings,player,action,e.code);const saved=saveKeys();keyboardOptions(id);$('#binding-status').textContent=saved?'Key saved.':'Key applied for this session. Browser storage is unavailable.';}
 catch(error){$('#binding-status').textContent=error.message;}
 return true;
}
refreshKeyHints();
const grabHelp=html=>{
 let text=grabControlsHTML(html,grabPreview);
 if(Object.keys(grabPreview).length&&balancePreview.balance?.sys.splitGuard&&!grabPreview.fresh)text=text.replaceAll('Capture / break with timed guard','Capture / break with fresh capture').replaceAll('A fresh timed guard breaks the capture','A fresh dedicated capture press breaks the capture').replaceAll('Captures bypass held guard; a fresh guard breaks them.','Captures bypass guard; tap the dedicated capture button freshly to break them.');
 return text;
};
const helpHTML=()=>grabHelp(`<div class="eyebrow result">FIELD MANUAL / ${fighters[selected].name}</div><h2>TWO BUTTONS. MANY POSSIBILITIES.</h2><p><b>Your Player 1 keys:</b> ${bindings[0].map((codes,a)=>`${bindingLabels[a]}: ${codes.map(keyName).join(" / ")}`).join(" · ")}</p><p>The command examples below use the default keyboard layout. Change keys in Options → Keyboard controls.</p><p>The default Duel camera frames both fighters from a broad three-quarter view. Options also offers the previous lock-on and side cameras. W closes in, S retreats, A and D circle around the rival. Tap attack for a strike up close or an energy shot at range. Hold it without a direction to charge up to three power stocks. Low health speeds up charging.</p><table class="controls"><tr><td>Close in / retreat</td><td>W / S</td><td>Stick up / down</td></tr><tr><td>Circle left / right</td><td>A / D</td><td>Stick left / right</td></tr><tr><td>Attack / hold to charge</td><td>J</td><td>A / Cross</td></tr><tr><td>Guard / timed deflect</td><td>K</td><td>B / Circle</td></tr><tr><td>Signature / retreat special</td><td>W / S + tap J</td><td>Up / down + A / Cross</td></tr><tr><td>Capture / break with timed guard</td><td>U or D + tap J</td><td>X / Square or right + A</td></tr><tr><td>Third signature move</td><td>A + tap J</td><td>Left + A / Cross</td></tr><tr><td>Launch into the air</td><td>I or double-tap D + J</td><td>Left bumper</td></tr><tr><td>Pursue / dash</td><td>O</td><td>Right bumper</td></tr><tr><td>Power burst (1 stock)</td><td>L</td><td>Y / Triangle</td></tr><tr><td>Pause</td><td>Escape</td><td>Start / Options</td></tr></table>${baseSpecials[fighters[selected].id]?`<h3>BASE SPECIALS</h3><p>${Object.values(baseSpecials[fighters[selected].id]).map(s=>`<b>${s.name}.</b> ${s.description}`).join('<br>')}</p>`:''}<h3>SPECIAL FOLLOW-UPS</h3><p>Press A + tap J, then quickly tap J again during wind-up. You may keep A held. Controller: Left + attack, then tap attack again. Aegis and Rei gain a second strike; Tala uses a flying kick; Morrow fires a direct beam; Sol expands her barrier; Vesper throws a ring spread. No stock is required. The second tap must finish before contact; training displays FOLLOW-UP NOW while the window is open.</p><p>Forward and back specials also have alternate forms: use toward/away + tap attack, then tap attack again before contact. You may keep the direction held. These free variants change shot spread, timing, range or knockdown behavior; they cannot replace a stock special after its cost is paid.</p><table class="controls"><tr><td>${specialVariants[fighters[selected].id].forward.name}</td><td>${specialVariants[fighters[selected].id].forward.description}</td></tr><tr><td>${specialVariants[fighters[selected].id].back.name}</td><td>${specialVariants[fighters[selected].id].back.description}</td></tr></table><h3>STOCK SPECIALS</h3><p>${Object.values(stockSpecials[fighters[selected].id]).map(s=>`<b>${s.name}.</b> ${s.description}`).join('<br>')}</p><p>Hold longer than 0.24 seconds, then release attack. Each listed special costs one stock at wind-up and can be interrupted. With no stock, the move fails. Release all directions and hold attack to recharge. Direction is chosen when attack is pressed; tap instead for the free base special.</p><h3>READ THE WIND-UP</h3><p>Attacks now have wind-up, contact, and recovery. Fast strikes can interrupt slow ones. Step out of range before contact to make a melee attack miss. Commit to your attack: you cannot guard until recovery ends. Tap attack again just after contact to chain up to three strikes or shots. After the second, you can finish with a launcher, capture, or special. A missed melee strike cannot chain. Tap near the end of recovery to queue a separate attack. Training shows your current phase and remaining frames. Pause → Practice Controls selects a standing, guarding, or active opponent and toggles recent input history.</p><h3>THIRD-HIT DEFENSIVE REVERSAL</h3><p>Block the first two close strikes, release guard briefly, then tap guard (default K / controller B or Circle) just before the third basic strike lands. A successful six-frame timing window deflects the hit and starts a short return strike. Holding guard only blocks normally. The return strike costs no stock, cannot chain into a combo, and can be interrupted by another hit or miss an escaping target. This does not reverse projectiles, captures, launchers, special finishers, or another reversal. It cannot escape hitstun: guard must already be available. Outside this timing window, ordinary block/perfect-guard rules apply.</p><h3>STAGGER AND RECOVERY</h3><p>Repeated unblocked grounded hits fill the stagger meter. It fades when pressure stops. When staggered, alternate circle left and right (default A / D, controller Left / Right) three times after the opening flinch. Holding a direction does not count. Recover quickly for a brief stronger close strike. Recovery briefly prevents another stagger, but ordinary hits still hurt. Against a staggered rival, pursuit (default O / right bumper) travels farther and knocks down for extra damage if it arrives before recovery. Taking any further hit ends the stagger opening; it cannot be refreshed forever.</p><h3>CHARGE TRANSITIONS</h3><p>Neutral charge starts after a 0.24-second hold. Holding guard never charges. Release guard while holding neutral attack for a shorter 0.08-second preparation. Attack recovery adds a 0.12-second charge delay. Partial stock progress is retained; listed held directional stock specials keep their own release command.</p><h3>LONG CAPTURE</h3><p>At range, press capture, then tap attack while the circle travels to enlarge it. Each fresh tap grows the radius by 0.35, up to 1.35 arena units. Holding does not repeat. A fresh timed guard breaks the capture; opposing capture circles cancel. Confirmed captures keep their character-specific cinematic.</p><h3>PRESSURE DASH</h3><p>When two grounded pursuit attacks meet, tap attack repeatedly during the 1.6-second contest. Release between presses; at most one point every 0.20 seconds. The winner knocks down the rival; a tie deals no damage. Options → Pressure Dash assist allows held attack for both players at the same maximum rate. Applies next round. Pause stops the contest.</p><h3>GUIDED TRAINING</h3><p>Training → Pause → Practice Controls → Guided lessons. Choose a lesson and follow the current keyboard or controller prompt. Retry resets the setup; Next lesson unlocks after success; Free practice leaves the lesson. Start/Options pauses so controller users can restart an active lesson.</p><h3>DIRECTIONAL COMMANDS</h3><p>Tap a direction twice within 0.30 seconds, then tap attack: W (close) = pursuit; S (retreat) = burst; D = launcher; A = jumping crossover. Double-tap A + guard to jump after a four-frame crouch. Press guard freshly in the air to recover. If you land knocked down, tap a direction to roll relative to the rival. A/D circle, W rolls toward, S rolls away (controller directions match). Tap guard for a quick rise, or tap attack during the final six recovery frames to queue an attack as you finish rising. Holding a direction does not trigger a roll. You cannot attack during the roll, and its invulnerability ends before you stand. W + guard near a rival circles behind them; capture quickly before they turn. The same sequences work with the D-pad or stick. Directions never flip when fighters swap sides.</p><h3>${fighters[selected].moves[0]} / ${fighters[selected].moves[1]}</h3><p>Tap attack while closing in (W) for your signature move, or while retreating (S) for a retreating special. A + tap attack uses ${fighters[selected].moves[2]}, your third signature move.</p><h3>${fighters[selected].special}</h3><p>Land a launcher at close range, then immediately press pursuit to cancel its recovery into the aerial follow-up. A blocked or missed launcher cannot cancel. Aerial pursuit glides into three strikes and ends in a knockdown. Fresh airborne guard can escape between strikes; holding pursuit does not restart it. Captures bypass held guard; a fresh guard breaks them. Time guard just before a normal projectile hits to reflect it. Burst can be guarded and misses beyond 9 arena units.</p><p><b>Local versus:</b> P1 uses WASD / J K U I O L. P2 uses arrow keys / Numpad 1–6 (or 1–6 along the top row); Up closes in on P1 and Left/Right circle from P2's own point of view. Two controllers take P1 and P2; with one controller, it controls P2. Controller menus: Up/Down moves focus, Left/Right changes a value or fighter, A/Cross confirms, B/Circle closes a dialog. Start/Options pauses and resumes.</p><p>Original characters and procedural art. Inspired by the PS1 era; not affiliated with Evil Zone or its creators.</p>`);
$('#help').onclick=()=>{if(match)paused=true;showDialog(helpHTML());};
const trainingOptionsHTML=()=>`<label>Practice opponent<select id="trainingBehavior"><option value="idle">Stand still</option><option value="guard">Hold guard</option><option value="combo">Repeat three-hit combo</option><option value="cpu">Fight back</option></select></label><label><input id="showInputs" type="checkbox" ${settings.showInputs?'checked':''}> Show recent inputs in training</label>`;
function bindTrainingOptions(){
 $('#trainingBehavior').value=settings.trainingBehavior;$('#trainingBehavior').onchange=e=>{settings.trainingBehavior=e.target.value;settings.trainingAI=e.target.value==='cpu';save();};
 $('#showInputs').onchange=e=>{settings.showInputs=e.target.checked;save();};
}
function practiceOptions(){showDialog(`<div class="eyebrow result">PRACTICE CONTROLS</div><h2>TEST YOUR TIMING.</h2>${trainingOptionsHTML()}<h3>GUIDED LESSONS</h3><label>Choose a lesson<select id="lesson-choice">${lessons.map(l=>`<option value="${l.id}">${l.title}</option>`).join('')}</select></label><button id="start-lesson">START LESSON</button><p>Input history shows directions and actions, newest first. The dot marks a release; f counts simulation frames at 60 per second. Hold guard lets you test chip damage, pressure, and captures. Repeat three-hit combo approaches and repeats a basic chain, then pauses; use it to practice the third-hit reversal.</p>`);bindTrainingOptions();$('#start-lesson').onclick=()=>startLesson($('#lesson-choice').value);}
const lessonPanel=document.createElement('div');lessonPanel.id='lesson-panel';lessonPanel.hidden=true;
lessonPanel.innerHTML='<p id="lesson-text" role="status"></p><div><button id="lesson-retry">RETRY</button><button id="lesson-next">NEXT LESSON</button><button id="lesson-exit">FREE PRACTICE</button></div>';
$('#hud').append(lessonPanel);
function startLesson(id){
 match=lessonMatch(id,selected,{...settings,balance:balancePreview.balance,grab:grabPreview});mode='training';telemetry=liveStats(match,settings.showMatchStats,balancePreview.balance?(new URLSearchParams(location.search).get('balance')||'local'):'default');paused=false;keys.clear();inputHistory=[];hitstop=0;acc=0;
 flow=createFlow({training:true,reduced:settings.reduced,round,names:[fighters[selected].name,fighters[0].name]});match.lesson.ready=2.5;view.match(match,arenaIndex);$('#modal').close();audio.duck(false);$('#callout').textContent='';
 trails=[createTrail(),createTrail()];lastHp=[100,100];lastStocks=match.players.map(p=>p.stocks);
 $('#round-label').textContent='GUIDED PRACTICE';$('#p1-name').textContent=fighters[match.players[0].id].name;$('#p2-name').textContent=fighters[match.players[1].id].name;pips();
}
$('#lesson-retry').onclick=()=>{if(match?.lesson)startLesson(match.lesson.id);};
$('#lesson-next').onclick=()=>{if(match?.lesson?.status==='passed')startLesson(lessons[(lessons.findIndex(l=>l.id===match.lesson.id)+1)%lessons.length].id);};
$('#lesson-exit').onclick=()=>{if(match?.lesson){beginRound();}};
$('#settings').onclick=()=>{
 showDialog(`<div class="eyebrow result">SYSTEM CONFIGURATION</div><h2>MAKE IT YOURS.</h2><label>CPU difficulty<select id="difficulty"><option value="easy">Easy</option><option value="normal">Normal</option><option value="hard">Hard</option></select></label><label>Round length<select id="roundSeconds"><option value="60">60 seconds</option><option value="90">90 seconds</option><option value="120">120 seconds</option></select></label><label>Rounds to win<select id="winsNeeded"><option value="1">First to 1</option><option value="2">First to 2</option><option value="3">First to 3</option></select></label><label>Stick dead zone<select id="deadzone"><option value="0.12">Small · sensitive</option><option value="0.22">Standard</option><option value="0.32">Large · reduce drift</option></select></label><label>Render quality<select id="quality"><option value="high">High · smooth edges</option><option value="low">Low · fewer pixels, no dynamic shadows</option></select></label><label>Tala appearance<select id="talaModel"><option value="graphic">Graphic flat-colour · the chosen art style (default)</option><option value="v3">Design 03 · textured anatomical bodies</option><option value="design02">Design 02 · scripted study</option><option value="concept">Storm Circuit · earlier art study</option><option value="classic">Earliest procedural model</option></select></label><p><a href="./tala-blender.html${activeTalaModel==='design02'?'?model=design02':''}">Inspect Tala’s movements</a>. Appearance changes apply on character select or the next fight.</p><label>Camera<select id="camera"><option value="duel">Duel · broad three-quarter view</option><option value="lock">Lock-on · behind your fighter</option><option value="side">Side · low duel view</option></select></label><label><input id="pressureAssist" type="checkbox" ${settings.pressureAssist?'checked':''}> Pressure Dash assist · hold attack instead of repeated taps (both players; next round)</label><label>Sound volume<input id="volume" type="range" min="0" max="1" step=".05" value="${settings.volume}"></label><label><input id="music" type="checkbox" ${settings.music?'checked':''}> Music</label><label><input id="announcer" type="checkbox" ${settings.announcer?'checked':''}> Announcer voice (uses your browser's speech voice)</label><label><input id="reduced" type="checkbox" ${settings.reduced?'checked':''}> Reduce motion · disable cinematic camera</label><label><input id="showMatchStats" type="checkbox" ${settings.showMatchStats?'checked':''}> Show match stats (next round; training stats in Pause)</label>${trainingOptionsHTML()}<button id="keyboard-options">KEYBOARD CONTROLS</button><p>Settings save in this browser. Match rules apply when you start a new fight. Controller: Up/Down chooses a control, Left/Right changes its value, A confirms, B goes back.</p>`);
 $('#keyboard-options').onclick=()=>keyboardOptions();
 $('#talaModel').value=activeTalaModel;$('#talaModel').onchange=e=>{activeTalaModel=settings.talaModel=e.target.value;view.setTalaModel(settings.talaModel);if(!match)view.select(selected);save();};
 for(const key of ['roundSeconds','winsNeeded','deadzone']){$('#'+key).value=settings[key];$('#'+key).onchange=e=>{settings[key]=Number(e.target.value);save();};}
 for(const key of ['difficulty','quality','camera']){$('#'+key).value=settings[key];$('#'+key).onchange=e=>{settings[key]=e.target.value;view.quality(settings.quality);save();};}
 $('#volume').oninput=e=>{settings.volume=Number(e.target.value);enableSound();save();sound('select',0);};bindTrainingOptions();for(const key of ['reduced','music','announcer','pressureAssist','showMatchStats'])$('#'+key).onchange=e=>{settings[key]=e.target.checked;save();if(key==='music'&&settings.music&&!audio.playing)audio.play(match?fighters[arenaIndex].id:'menu');};
};
function announce(text,t=1.5,kind='note'){const c=$('#callout');c.textContent=text;c.dataset.kind=kind;c.classList.remove('pop');void c.offsetWidth;c.classList.add('pop');calloutTime=t;}
let trails=[createTrail(),createTrail()],lastStocks=[1,1],lastHp=[100,100];
function flash(el,cls){el.classList.remove(cls);void el.offsetWidth;el.classList.add(cls);}
// Glass-shatter burst: shards fly out from an element's box and fade.
// The lost part of a life gauge breaks away on every hit.
function crackBar(n,oldHp,newHp){if(settings.reduced)return;const bar=$('#health'+n),box=bar.getBoundingClientRect(),hud=$('#hud').getBoundingClientRect(),color=n===1?'#d9f975':'#c9a6f6';const top=box.top-hud.top+(1-oldHp/100)*box.height,bottom=box.top-hud.top+(1-newHp/100)*box.height;
 const crack=document.createElement('i');crack.className='crack';crack.style.cssText=`left:${box.left-hud.left}px;top:${top}px;width:${box.width}px;height:${Math.max(3,bottom-top)}px`;$('#hud').append(crack);setTimeout(()=>crack.remove(),400);
 for(const s of damageShards(oldHp-newHp,n===1?'left':'right',Date.now()%1000)){const shard=document.createElement('i');shard.className='shard';shard.style.cssText=`left:${box.left-hud.left+box.width/2}px;top:${top+(bottom-top)*s.t}px;--dx:${s.dx}px;--dy:${s.dy}px;--rot:${s.rot}deg;--size:${s.size}px;animation-delay:${s.delay}s;background:${color}`;$('#hud').append(shard);setTimeout(()=>shard.remove(),900);}}
function shatter(el,color,count=10,spread=70){if(settings.reduced)return;const box=el.getBoundingClientRect(),hud=$('#hud').getBoundingClientRect();for(const s of shardPlan(count,Date.now()%1000,spread)){const shard=document.createElement('i');shard.className='shard';shard.style.cssText=`left:${box.left-hud.left+box.width/2}px;top:${box.top-hud.top+box.height/2}px;--dx:${s.dx}px;--dy:${s.dy}px;--rot:${s.rot}deg;--size:${s.size}px;animation-delay:${s.delay}s;background:${color}`;$('#hud').append(shard);setTimeout(()=>shard.remove(),900);}}
function updateHud(dt){
 match.players.forEach((p,i)=>{
  const n=i+1,trail=updateTrail(trails[i],p.hp,dt);
  updateStaggerHud($('#stagger-status'+n),p);
  if(p.hp<lastHp[i]-.5)crackBar(n,lastHp[i],p.hp);lastHp[i]=p.hp;
  $('#hp'+n).style.height=p.hp+'%';$('#trail'+n).style.height=trail.trail+'%';$('#health'+n).dataset.state=healthClass(p.hp);
  const g=gaugeState(p),gauge=$('#gauge'+n);$('#charge'+n).style.height=g.sweep+'%';$('#health'+n).classList.toggle('charging',g.charging);
  const gems=gauge.querySelectorAll('.gem');gemStates(g).forEach((gem,k)=>{gems[k].style.setProperty('--fill',gem.fill);gems[k].classList.toggle('lit',gem.lit);gems[k].classList.toggle('filling',gem.filling);});
  gauge.classList.toggle('charging',g.charging);gauge.classList.toggle('full',g.full);$('#gauge-label'+n).textContent=gaugeLabel(g);
  if(p.stocks>lastStocks[i]){flash(gems[p.stocks-1],'gain');shatter($('#health'+n),'#fff2b0',10,90);}else if(p.stocks<lastStocks[i]){const gem=gems[lastStocks[i]-1];flash(gem,'spend');shatter(gem,i?'#c9a6f6':'#d9f975',12,60);}lastStocks[i]=p.stocks;
  const event=barShatterEvent(trail,p.hp),bar=$('#health'+n);
  if(event==='shatter'){bar.classList.add('shattered');shatter(bar,i?'#c9a6f6':'#d9f975',26,160);}else if(event==='reform')bar.classList.remove('shattered');
 });
}
function pips(){match?.players.forEach((p,i)=>{$('#pips'+(i+1)).textContent='●'.repeat(wins[i])+'○'.repeat(Math.max(0,match.rules.winsNeeded-wins[i]));});}
function beginRound(){
 inputHistory=[];
 const opponent=mode==='arcade'?(selected+stage+1)%6:Number($('#opponent').value);
 match=createMatch(selected,opponent,mode,settings.difficulty,{...settings,balance:balancePreview.balance,grab:grabPreview});telemetry=liveStats(match,settings.showMatchStats,balancePreview.balance?(new URLSearchParams(location.search).get('balance')||'local'):'default');round++;paused=false;keys.clear();hitstop=0;trails=[createTrail(),createTrail()];lastStocks=[1,1];lastHp=[100,100];
 arenaIndex=homeArena(mode,selected,opponent);view.match(match,arenaIndex);$('#menu').hidden=true;$('#hud').hidden=false;document.body.classList.add('playing');$('#modal').close();
 $('#p1-name').textContent=fighters[selected].name;$('#p2-name').textContent=fighters[opponent].name;$('#p2-label').textContent=mode==='local'?'PLAYER 02':mode==='training'?'TRAINING':'CPU';$('#round-label').textContent=mode==='arcade'?`BOUT ${stage+1} / 6`:mode==='training'?'FREE PRACTICE':`ROUND ${round}`;$('#arena-name').textContent=view.arenaName;pips();
 flow=createFlow({training:mode==='training',reduced:settings.reduced,round,names:[fighters[selected].name,fighters[opponent].name]});
 if(mode==='training')announce('TRAINING / HOLD J TO CHARGE',1.5);
 audio.duck(false);audio.play(fighters[arenaIndex].id);acc=0;
}
function start(){mode=$('#mode').value;round=0;stage=0;wins=[0,0];enableSound();beginRound();}
$('#start').onclick=start;
function home(){match=null;flow=null;paused=false;keys.clear();$('#modal').close();$('#menu').hidden=false;$('#hud').hidden=true;document.body.classList.remove('playing');$('#callout').textContent='';view.select(selected);audio.duck(false);audio.play('menu');}
function pause(){if(!match||match.phase!=='fight')return;if(paused){closeDialog();return;}paused=true;audio.duck(true);showDialog('<div class="eyebrow result">TAKE A BREATH</div><h2>FRACTURE PAUSED.</h2><p>Your fight will wait.</p><div class="modal-actions"><button id="resume" class="primary">RESUME ↗</button><button id="restart">RESTART ROUND</button><button id="exit">CHARACTER SELECT</button></div>');if(mode==='training'){const button=document.createElement('button');button.id='practice-options';button.textContent='PRACTICE CONTROLS';button.onclick=practiceOptions;$('#modal-body .modal-actions').append(button);}if(telemetry){const b=document.createElement('button');b.textContent='MATCH STATS';b.id='open-match-stats';b.onclick=()=>{const record=telemetry.snapshot();showDialog(statsHTML(record)+'<button id="stats-back">BACK TO FIGHT</button>');bindStats(record);$('#stats-back').onclick=closeDialog;};$('#modal-body .modal-actions').append(b);}$('#resume').onclick=closeDialog;$('#restart').onclick=()=>match.lesson?startLesson(match.lesson.id):beginRound();$('#exit').onclick=home;}
$('#pause').onclick=pause;
function roundOver(){
 const stats=telemetry?.snapshot();
 const winner=match.winner;if(winner>=0)wins[winner]++;pips();
 const done=wins.some(w=>w>=match.rules.winsNeeded),arcadeClear=mode==='arcade'&&done&&winner===0&&stage===5;
 let title=winner<0?'DRAW.':`${fighters[match.players[winner].id].name} WINS.`;
 let note=winner<0?'A perfect stalemate. Run it back.':`${wins[0]} — ${wins[1]} · First to ${match.rules.winsNeeded} rounds.`;
 if(arcadeClear){title='THE RIFT IS SEALED.';note=fighters[selected].ending;}
 else if(done&&mode==='arcade'&&winner===0)note='Another world waits on the other side. Advance to your next opponent.';
 else if(done)note=winner===0?'Match won. The fracture remembers your name.':'Match lost. Every rival is a lesson.';
 sound(winner===0||mode==='local'?'win':'lose');audio.duck(true);
 showDialog(`<div class="eyebrow result">${arcadeClear?'ARCADE COMPLETE':done?'MATCH RESULT':'ROUND RESULT'}</div><h2>${title}</h2><p>${note}</p>${stats?statsHTML(stats):''}<div class="modal-actions"><button id="next" class="primary">${arcadeClear?'PLAY AGAIN':done?(mode==='arcade'&&winner===0?'NEXT OPPONENT':'REMATCH'):'NEXT ROUND'} ↗</button><button id="exit">CHARACTER SELECT</button></div>`);
 if(stats)bindStats(stats,{persist:true});
 $('#next').onclick=()=>{if(arcadeClear){start();return;}if(done){if(mode==='arcade'&&winner===0)stage++;wins=[0,0];round=0;}beginRound();};$('#exit').onclick=home;
}
const blocked=['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab'];
window.addEventListener('keydown',e=>{if(captureKey(e))return;if(e.metaKey||e.ctrlKey||e.altKey)return;if(e.code==='Escape'&&!$('#modal').open){pause();e.preventDefault();return;}if($('#modal').open)return;if(match&&(blocked.includes(e.code)||keys.has(e.code)))e.preventDefault();keys.add(e.code);});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{keys.clear();if(match&&!paused&&match.phase==='fight')pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();if(match&&!paused)pause();}});
for(const b of document.querySelectorAll('[data-key]')){b.onpointerdown=e=>{e.preventDefault();b._heldCode=touchBinding(b.dataset.key,bindings);keys.add(b._heldCode);b.setPointerCapture(e.pointerId);};b.onpointerup=b.onpointercancel=()=>{keys.delete(b._heldCode);b._heldCode=null;};}

function padInput(pad){return readPad(pad,settings.deadzone);}
function controllerMenu(pad,newly){
 if(!pad||match&&!paused&&!$('#modal').open&&(!match.lesson||match.lesson.status==='active'))return;
 const dialog=$('#modal').open;
 if(dialog&&newly(1)){padAwaitRelease=true;closeDialog();return;}
 const controls=[...document.querySelectorAll(dialog?'#modal button,#modal select,#modal input':match?.lesson?'#lesson-panel button':'#menu button,#menu select,#help,#sound')].filter(el=>el.getClientRects().length&&!el.disabled);
 if(!controls.length)return;
 let active=document.activeElement,index=controls.indexOf(active);
 if(index<0){active=dialog||match?.lesson?controls[0]:document.querySelector(`[data-id="${selected}"]`);index=controls.indexOf(active);}
 const input=padInput(pad);
 if(controllerMenuTime<=0){
  if(Math.abs(input.z)>.5){active=controls[(index+Math.sign(input.z)+controls.length)%controls.length];active.focus();if(active.dataset.id!==undefined)select(Number(active.dataset.id));controllerMenuTime=.2;}
  else if(Math.abs(input.x)>.5){
   const direction=Math.sign(input.x);
   if(active.tagName==='SELECT'){active.selectedIndex=(active.selectedIndex+direction+active.options.length)%active.options.length;active.dispatchEvent(new Event('change',{bubbles:true}));}
   else if(active.type==='range'){active.value=Number(active.value)+direction*Number(active.step||1);active.dispatchEvent(new Event('input',{bubbles:true}));}
   else if(active.dataset.id!==undefined){select(selected+direction);document.querySelector(`[data-id="${selected}"]`).focus();}
   else controls[(index+direction+controls.length)%controls.length].focus();
   controllerMenuTime=.2;
  }
 }
 if(newly(0)){
  padAwaitRelease=true;
  const focused=controls.includes(document.activeElement)?document.activeElement:active;
  if(!dialog&&focused.dataset.id!==undefined){select(Number(focused.dataset.id));start();}
  else if(focused.type==='checkbox'){focused.checked=!focused.checked;focused.dispatchEvent(new Event('change',{bubbles:true}));}
  else if(focused.tagName==='BUTTON')focused.click();
 }
}
function merge(a,b){return {...a,x:b.x||a.x,z:b.z||a.z,...Object.fromEntries(['attack','guard','capture','launch','pursuit','super'].map(k=>[k,a[k]||b[k]]))};}
function events(){for(const e of match.events){
 if(e.type==='hit'){const heavy=e.damage>=12;view.burst(e.x,e.z,e.color,heavy?22:14);view.shake(heavy?.55:.25);sound(heavy?'heavy':'hit');if(e.combo>1)$('#combo').textContent=`${e.combo} HIT CHAIN`;}
 if(e.type==='pressure'){announce(e.text,1.6);sound('parry');view.burst((match.players[0].x+match.players[1].x)/2,(match.players[0].z+match.players[1].z)/2,'#ffffff',20);}
 if(e.type==='reversal'){view.burst(e.x,e.z,'#ffffff',18);view.block(e.player,true);announce('THIRD-HIT REVERSAL',1);sound('parry');}
 if(e.type==='groundBounce'){view.shake(.45);sound('heavy');}
 if(e.type==='shot')sound('shot');if(e.type==='parry'){view.burst(e.x,e.z,'#ffffff');announce('PERFECT DEFLECT',.7);sound('parry');view.block(nearest(e),true);}if(e.type==='block'){sound('block');view.shake(.08);view.block(nearest(e),false);}if(e.type==='stock'){announce('POWER STOCK +1',.7);sound('stock');}
 if(e.type==='cinematic'){announce(e.text,1.5,'cinematic');sound(match.cinematic?.kind==='capture'?'capture':'cinematic');view.shake(.4);}if(e.type==='hint'){announce(e.text,1);if(['JUMP','CIRCLE STEP','RECOVERY ROLL','AIR RECOVERY'].includes(e.text)){sound('dash');if(e.text==='CIRCLE STEP'&&e.player!==undefined)view.ghost(e.player);}}
 if(e.type==='over'){const winner=match.winner,reason=winner<0?'draw':match.time<=0?'time':'ko';const cue=beginKO(flow,{winner,loser:winner>=0?1-winner:-1,reason});announce(cue.text,flow.duration+.3,cue.kind);sound(reason==='ko'?'ko':'time');audio.say(cue.say);if(reason==='ko'){view.shake(1);hitstop=0;}audio.duck(true);}
}}
const nearest=e=>match.players.reduce((best,p,i)=>Math.hypot(p.x-e.x,p.z-e.z)<Math.hypot(match.players[best].x-e.x,match.players[best].z-e.z)?i:best,0);
const voicePitch=[196,330,294,147,262,247];let swingSeen=[null,null];
// Swings and dashes are read from move phases so the simulation stays unchanged.
function moveSounds(){match.players.forEach((p,i)=>{const move=p.move;if(!move){swingSeen[i]=null;return;}
 if(move.frame===move.startup&&swingSeen[i]!==move){swingSeen[i]=move;if(['strike','technique','launch','jumpAttack','forward','back'].includes(move.kind)&&move.kind!=='technique'|| (move.kind==='technique'&&!['sphere','wheel'].includes(move.effect))){sound('swing',fighters[p.id].shape==='heavy'||move.kind==='launch');sound('effort',voicePitch[p.id]);}}
 if(move.kind==='pursuit'&&move.frame===1&&swingSeen[i]!==move){swingSeen[i]=move;sound('dash');}});}
function handleCue(cue){
 if(cue.type==='callout'){announce(cue.text,cue.kind==='fight'?.8:1.3,cue.kind);sound(cue.kind);audio.say(cue.kind==='versus'?`${flow.names[0]} versus ${flow.names[1]}`:cue.say);}
 if(cue.type==='fight'){keys.clear();acc=0;}
 if(cue.type==='done')roundOver();
}
// Movement is lock-on relative: W/up closes, S/down retreats, A/D circle left and right.
function relative(raw){return {...raw,x:-raw.z,z:raw.x};}
function frame(ms){const dt=Math.min((ms-last)/1000,.1)||STEP;last=ms;const pads=Array.from(navigator.getGamepads?.()||[]).filter(Boolean);$('#pad-status').textContent=pads.length?`${pads.length} CONTROLLER${pads.length>1?'S':''} CONNECTED`:'KEYBOARD READY';controllerMenuTime-=dt;
 const pad=pads[0],pButtons=pad?pad.buttons.map(b=>b.pressed):[];const newly=n=>pButtons[n]&&!previousPad[n];document.body.classList.toggle('controller-nav',!!pad);
 if(!pads.some(p=>p.buttons.some(b=>b.pressed)))padAwaitRelease=false;
 if(newly(9)&&match&&!$('#modal').open){padAwaitRelease=true;pause();}else if(newly(9)&&paused){padAwaitRelease=true;closeDialog();}
 controllerMenu(pad,newly);
 previousPad=pButtons;
 if(match&&flow&&!paused&&!simulationRuns(flow)){for(const cue of advanceFlow(flow,dt))handleCue(cue);if(flow.state==='intro')keys.clear();}
 if(match&&!paused&&match.phase==='fight'&&flow&&simulationRuns(flow)){
  const p0=mode==='local'&&pads.length===1?null:pads[0],p1=mode==='local'?(pads.length===1?pads[0]:pads[1]):null;
  if(match.lesson?.ready>0){match.lesson.ready=Math.max(0,match.lesson.ready-dt);acc=0;}
  else if(match.lesson&&match.lesson.status!=='active')acc=0;
  else acc+=dt;
  while(acc>=STEP&&match.phase==='fight'&&!paused){const a=relative(merge(keys.read(0),padAwaitRelease?neutral():padInput(p0)));const b=match.lesson?lessonOpponent(match,a):mode==='local'?relative(merge(keys.read(1),padAwaitRelease?neutral():padInput(p1))):mode==='training'&&settings.trainingBehavior==='combo'?comboPracticeInput(match):mode==='training'&&settings.trainingBehavior!=='cpu'?{...neutral(),guard:settings.trainingBehavior==='guard'}:aiInput(match,STEP);if(mode==='training')recordInput(inputHistory,a);telemetry?.before([a,b]);update(match,[a,b]);telemetry?.after();updateLesson(match);events();moveSounds();acc-=STEP;if(match.lesson&&match.lesson.status!=='active'){acc=0;break;}}
  const move=match.players[0].move,phase=movePhase(move);
  $('#training-readout').hidden=mode!=='training'||!!match.lesson;
  $('#input-history').hidden=mode!=='training'||!settings.showInputs||!!match.lesson;$('#input-history').textContent=inputHistory.map(item=>`${item.label} [${item.frames}f]`).join('  |  ');
  $('#training-readout').textContent=match.cinematic?`${match.cinematic.kind==='capture'?'CAPTURE / '+match.cinematic.context.toUpperCase():'BURST'} · ${Math.max(0,match.cinematic.duration-match.cinematic.t).toFixed(1)}s`:move?`${phase==='startup'?'WIND-UP':phase==='contact'?(move.active>1?'ACTIVE':'CONTACT'):'RECOVERY'} · ${move.followup?'ALT ':move.empowered?'STOCK ':''}${move.kind.toUpperCase()}${move.aerial?' AIR '+(move.pursuitHit||0)+'/3':''}${['strike','shot'].includes(move.kind)||move.chain>1?' '+move.chain+'/3':''}${canChain(move)?' · CHAIN NOW':(canFollowUp(move)||canSpecialFollowUp(move))?' · FOLLOW-UP NOW':''} · ${phase==='startup'?move.startup-move.frame:move.total-move.frame}f`:'READY · Tap attack or hold to charge';
  $('#training-readout').textContent+=' · '+trainingStaggerText(match.players);
  const reversalTip=reversalPrompt(match.players);if(reversalTip)$('#training-readout').textContent+=' · '+reversalTip;
  for(const tip of [recoveryText(match.players[0]),chargeText(match.players[0])])if(tip)$('#training-readout').textContent+=' · '+tip;
  $('#training-readout').dataset.phase=phase;
  }
 lessonPanel.hidden=!match?.lesson;if(match?.lesson){$('#lesson-text').textContent=(match.lesson.ready>0?'GET READY · ':'')+lessonText(match,bindings,!!pads.length);$('#lesson-next').disabled=match.lesson.status!=='passed';}
 if(match?.pressure){$('#callout').textContent=pressureText(match);$('#callout').dataset.kind='pressure';calloutTime=.1;}
 if(match){$('#timer').textContent=mode==='training'?'∞':Math.max(0,Math.ceil(match.time));updateHud(paused?0:dt);if(match.players.every(p=>p.comboTime===0))$('#combo').textContent='';}
 if(calloutTime>0){calloutTime-=dt;if(calloutTime<=0)$('#callout').textContent='';}hitstop=(match?.hitstop||0)*STEP;view.render(paused||hitstop>0?0:dt,match,settings,flow?cameraCue(flow):null);updateModelBadge();requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
// Read-only diagnostics for browser verification and bug reports.
window.riftDebug=()=>({grab:grabPreview,balance:match?.balance||null,tick:match?.tick,phase:match?.phase||'menu',mode,paused,selected,stage,wins:[...wins],flow:flow?.state,arena:view.arenaName,camera:settings.camera,lesson:match?.lesson,pressure:match?.pressure,talaModels:view.talaModels,fighterModels:view.fighterModels,music:audio.playing,hitstop,rules:match?.rules,time:match?.time,players:match?.players.map(p=>({id:p.id,x:p.x,z:p.z,hp:p.hp,stocks:p.stocks,stagger:p.stagger,staggerState:p.staggerState,staggerResist:p.staggerResist,counterWindow:p.counterWindow,air:p.air,visualHeight:p.airMotion?.height,anim:p.anim,move:p.move?.kind,pursuitHit:p.move?.pursuitHit,reversal:!!p.move?.reversal,empowered:!!p.move?.empowered,followup:!!p.move?.followup,moveFrame:p.move?.frame,startup:p.move?.startup,active:p.move?.active,recovery:p.move?.recovery,chain:p.move?.chain,canChain:canChain(p.move),movePhase:movePhase(p.move)})),projectiles:match?.projectiles.length,cinematic:match?.cinematic?.kind,cinematicTime:match?.cinematic?.t,cinematicDuration:match?.cinematic?.duration,captureProfile:match?.cinematic?.profile,captureContext:match?.cinematic?.context});

const modelBadge=document.createElement('a');modelBadge.href='./tala-blender.html';modelBadge.style.cssText='position:fixed;bottom:10px;left:10px;z-index:90;background:#171b22;color:#edbb68;padding:6px 10px;font:12px system-ui';modelBadge.hidden=true;document.body.append(modelBadge);
function updateModelBadge(){
 const models=view.talaModels;modelBadge.hidden=!models.length;modelBadge.href=models.includes('graphic')?'./tala-blender.html?model=graphic':models.includes('v3')?'./tala-blender.html?model=v3':models.includes('design02')?'./tala-blender.html?model=design02':'./tala-blender.html';
 modelBadge.textContent=models.includes('loading')?'Loading Tala art study…':models.includes('fallback')?'Tala art unavailable · earlier model loaded':models.includes('graphic')?'Tala · graphic flat-color · inspect':models.includes('v3')?'Tala · Design 03 anatomical body · inspect':models.includes('design02')?'Tala · Design 02 preview · inspect':models.includes('concept')?'Tala · Storm Circuit art study · inspect':'Tala · earlier model · inspect';
}
