import {recordInput} from './training.js';
import {normalizeOptions,readPad} from './options.js';
import {movePhase,canChain} from './moves.js';
import {fighters} from './fighters.js';
import {createMatch,update,aiInput,neutral,STEP} from './combat.js';
import {createView} from './render.js';
const $=s=>document.querySelector(s),keys=new Set();let selected=0,match=null,paused=false,round=0,wins=[0,0],stage=0,mode='arcade',last=0,acc=0,calloutTime=0,view,audio,controllerMenuTime=0,previousPad=[],padAwaitRelease=false,inputHistory=[];
let settings=normalizeOptions();try{settings=normalizeOptions(JSON.parse(localStorage.getItem('rift-options')||'{}'));}catch{}
function save(){try{localStorage.setItem('rift-options',JSON.stringify(settings));}catch{}}
try{view=createView($('#scene'));view.quality(settings.quality);}catch(e){$('#error').hidden=false;$('#error').textContent='Rift Duel needs WebGL 2. Enable hardware acceleration or try a current Chrome, Firefox, Edge, or Safari browser. '+e.message;throw e;}
function sound(freq=180,duration=.1,type='triangle'){
 if(!audio||settings.volume===0)return;const o=audio.createOscillator(),g=audio.createGain();o.type=type;o.frequency.setValueAtTime(freq,audio.currentTime);o.frequency.exponentialRampToValueAtTime(Math.max(30,freq*.4),audio.currentTime+duration);g.gain.setValueAtTime(settings.volume*.18,audio.currentTime);g.gain.exponentialRampToValueAtTime(.001,audio.currentTime+duration);o.connect(g);g.connect(audio.destination);o.start();o.stop(audio.currentTime+duration);
}
function enableSound(){audio ||= new (window.AudioContext||window.webkitAudioContext)();audio.resume();$('#sound').textContent=settings.volume?'SOUND ON':'SOUND OFF';}
$('#sound').onclick=()=>{if(!audio){enableSound();}else{settings.volume=settings.volume?0:.25;save();$('#sound').textContent=settings.volume?'SOUND ON':'SOUND OFF';}sound(420);};
const sigils=['⌁','✧','ϟ','⟁','☼','◎'];
$('#roster').innerHTML=fighters.map((f,i)=>`<button class="card" data-id="${i}" style="--c:${f.color}" aria-pressed="${i===0}"><span class="sigil">${sigils[i]}</span><b>${f.name}</b><small>${f.style.split(' / ')[0].toUpperCase()}</small></button>`).join('');
$('#opponent').innerHTML=fighters.map((f,i)=>`<option value="${i}">${f.name}</option>`).join('');$('#opponent').value='1';
function select(i){selected=(i+fighters.length)%fighters.length;const f=fighters[selected];document.documentElement.style.setProperty('--accent',f.color);$('#hero-name').textContent=f.name;$('#hero-title').textContent=f.title.toUpperCase();$('#hero-number').textContent=`0${selected+1} / 06`;$('#fighter-style').textContent=f.style;$('#fighter-bio').textContent=f.bio;$('#stats').innerHTML=[['SPEED',f.speed/7],['POWER',f.power/1.3],['REACH',f.reach/3.5]].map(([k,v])=>`<div>${k}<i><span style="width:${v*100}%"></span></i></div>`).join('');document.querySelectorAll('.card').forEach((c,i)=>c.setAttribute('aria-pressed',i===selected));view.select(selected);sound(300+selected*40);}
$('#roster').onclick=e=>{const b=e.target.closest('button');if(b)select(Number(b.dataset.id));};select(0);
function modeChange(){$('#opponent-label').hidden=$('#mode').value==='arcade';}$('#mode').onchange=modeChange;modeChange();
function showDialog(html){$('#modal-body').innerHTML=html;if(!$('#modal').open)$('#modal').showModal();keys.clear();}
function closeDialog(){if(match?.phase==='over'){home();return;}$('#modal').close();paused=false;keys.clear();}
$('#close-modal').onclick=closeDialog;$('#modal').addEventListener('cancel',e=>{e.preventDefault();closeDialog();});
const helpHTML=()=>`<div class="eyebrow result">FIELD MANUAL / ${fighters[selected].name}</div><h2>TWO BUTTONS. MANY POSSIBILITIES.</h2><p>Move in 3D with WASD. Tap attack for a strike up close or an energy shot at range. Hold it to charge up to three power stocks. Low health speeds up charging.</p><table class="controls"><tr><td>Move / sidestep</td><td>WASD</td><td>Left stick / D-pad</td></tr><tr><td>Attack / hold to charge</td><td>J</td><td>A / Cross</td></tr><tr><td>Guard / timed deflect</td><td>K</td><td>B / Circle</td></tr><tr><td>Signature / retreat special</td><td>Toward / away + tap J</td><td>Stick + A / Cross</td></tr><tr><td>Capture / break with timed guard</td><td>U or S + tap J</td><td>X / Square</td></tr><tr><td>Third signature move</td><td>W + tap J</td><td>Up + A / Cross</td></tr><tr><td>Launch into the air</td><td>I or double-tap S + J</td><td>Left bumper</td></tr><tr><td>Pursue / dash</td><td>O</td><td>Right bumper</td></tr><tr><td>Power burst (1 stock)</td><td>L</td><td>Y / Triangle</td></tr><tr><td>Pause</td><td>Escape</td><td>Start / Options</td></tr></table><h3>READ THE WIND-UP</h3><p>Attacks now have wind-up, contact, and recovery. Fast strikes can interrupt slow ones. Step out of range before contact to make a melee attack miss. Commit to your attack: you cannot guard until recovery ends. Tap attack again just after contact to chain up to three strikes or shots. After the second, you can finish with a launcher, capture, or special. A missed melee strike cannot chain. Tap near the end of recovery to queue a separate attack. Training shows your current phase and remaining frames. Pause → Practice Controls selects a standing, guarding, or active opponent and toggles recent input history.</p><h3>DIRECTIONAL COMMANDS</h3><p>Tap a direction twice within 0.30 seconds, then tap attack: toward = pursuit; away = burst; down = launcher; up = jumping crossover. Double-tap up + guard to jump. Press guard freshly in the air to recover. If you land knocked down, tap W or S (controller Up or Down) to roll once the landing settles. Holding a direction does not trigger a roll. You cannot attack during the roll, and its invulnerability ends before you stand. Toward + guard near a rival circles behind them; capture quickly before they turn. The same sequences work with the D-pad or stick.</p><h3>${fighters[selected].moves[0]} / ${fighters[selected].moves[1]}</h3><p>Tap attack while moving toward the rival for your signature move, or away for a retreating special. Toward and away reverse when you switch sides. W + tap attack uses ${fighters[selected].moves[2]}, your third signature move.</p><h3>${fighters[selected].special}</h3><p>Land a launcher at close range, then pursue before your opponent falls. Captures bypass held guard; a fresh guard breaks them. Time guard just before a normal projectile hits to reflect it. Burst can be guarded and misses beyond 9 arena units.</p><p><b>Local versus:</b> P1 uses WASD / J K U I O L. P2 uses arrow keys / Numpad 1–6 (or 1–6 along the top row). Two controllers take P1 and P2; with one controller, it controls P2. Controller menus: Up/Down moves focus, Left/Right changes a value or fighter, A/Cross confirms, B/Circle closes a dialog. Start/Options pauses and resumes.</p><p>Original characters and procedural art. Inspired by the PS1 era; not affiliated with Evil Zone or its creators.</p>`;
$('#help').onclick=()=>{if(match)paused=true;showDialog(helpHTML());};
const trainingOptionsHTML=()=>`<label>Practice opponent<select id="trainingBehavior"><option value="idle">Stand still</option><option value="guard">Hold guard</option><option value="cpu">Fight back</option></select></label><label><input id="showInputs" type="checkbox" ${settings.showInputs?'checked':''}> Show recent inputs in training</label>`;
function bindTrainingOptions(){
 $('#trainingBehavior').value=settings.trainingBehavior;$('#trainingBehavior').onchange=e=>{settings.trainingBehavior=e.target.value;settings.trainingAI=e.target.value==='cpu';save();};
 $('#showInputs').onchange=e=>{settings.showInputs=e.target.checked;save();};
}
function practiceOptions(){showDialog(`<div class="eyebrow result">PRACTICE CONTROLS</div><h2>TEST YOUR TIMING.</h2>${trainingOptionsHTML()}<p>Input history shows directions and actions, newest first. The dot marks a release; f counts simulation frames at 60 per second. Hold guard lets you test chip damage, pressure, and captures.</p>`);bindTrainingOptions();}
$('#settings').onclick=()=>{
 showDialog(`<div class="eyebrow result">SYSTEM CONFIGURATION</div><h2>MAKE IT YOURS.</h2><label>CPU difficulty<select id="difficulty"><option value="easy">Easy</option><option value="normal">Normal</option><option value="hard">Hard</option></select></label><label>Round length<select id="roundSeconds"><option value="60">60 seconds</option><option value="90">90 seconds</option><option value="120">120 seconds</option></select></label><label>Rounds to win<select id="winsNeeded"><option value="1">First to 1</option><option value="2">First to 2</option><option value="3">First to 3</option></select></label><label>Stick dead zone<select id="deadzone"><option value="0.12">Small · sensitive</option><option value="0.22">Standard</option><option value="0.32">Large · reduce drift</option></select></label><label>Render quality<select id="quality"><option value="high">High · smooth edges</option><option value="low">Low · fewer pixels, no dynamic shadows</option></select></label><label>Sound volume<input id="volume" type="range" min="0" max="1" step=".05" value="${settings.volume}"></label><label><input id="reduced" type="checkbox" ${settings.reduced?'checked':''}> Reduce motion · disable cinematic camera</label>${trainingOptionsHTML()}<p>Settings save in this browser. Match rules apply when you start a new fight. Controller: Up/Down chooses a control, Left/Right changes its value, A confirms, B goes back.</p>`);
 for(const key of ['roundSeconds','winsNeeded','deadzone']){$('#'+key).value=settings[key];$('#'+key).onchange=e=>{settings[key]=Number(e.target.value);save();};}
 for(const key of ['difficulty','quality']){$('#'+key).value=settings[key];$('#'+key).onchange=e=>{settings[key]=e.target.value;view.quality(settings.quality);save();};}
 $('#volume').oninput=e=>{settings.volume=Number(e.target.value);enableSound();save();sound(300);};bindTrainingOptions();for(const key of ['reduced'])$('#'+key).onchange=e=>{settings[key]=e.target.checked;save();};
};
function announce(text,t=1.5){$('#callout').textContent=text;calloutTime=t;}
function beginRound(){
 inputHistory=[];
 const opponent=mode==='arcade'?(selected+stage+1)%6:Number($('#opponent').value);
 match=createMatch(selected,opponent,mode,settings.difficulty,settings);round++;paused=false;keys.clear();view.match(match);$('#menu').hidden=true;$('#hud').hidden=false;document.body.classList.add('playing');$('#modal').close();
 $('#p1-name').textContent=fighters[selected].name;$('#p2-name').textContent=fighters[opponent].name;$('#p2-label').textContent=mode==='local'?'PLAYER 02':mode==='training'?'TRAINING':'CPU';$('#round-label').textContent=mode==='arcade'?`BOUT ${stage+1} / 6 · ${wins[0]}—${wins[1]}`:mode==='training'?'FREE PRACTICE':`ROUND ${round} · ${wins[0]}—${wins[1]}`;
 announce(mode==='training'?'TRAINING / HOLD J TO CHARGE':`ROUND ${round} — FIGHT`,1.5);sound(500,.3);acc=0;
}
function start(){mode=$('#mode').value;round=0;stage=0;wins=[0,0];enableSound();beginRound();}
$('#start').onclick=start;
function home(){match=null;paused=false;keys.clear();$('#modal').close();$('#menu').hidden=false;$('#hud').hidden=true;document.body.classList.remove('playing');view.select(selected);}
function pause(){if(!match||match.phase!=='fight')return;if(paused){closeDialog();return;}paused=true;showDialog('<div class="eyebrow result">TAKE A BREATH</div><h2>FRACTURE PAUSED.</h2><p>Your fight will wait.</p><div class="modal-actions"><button id="resume" class="primary">RESUME ↗</button><button id="restart">RESTART ROUND</button><button id="exit">CHARACTER SELECT</button></div>');if(mode==='training'){const button=document.createElement('button');button.id='practice-options';button.textContent='PRACTICE CONTROLS';button.onclick=practiceOptions;$('#modal-body .modal-actions').append(button);}$('#resume').onclick=closeDialog;$('#restart').onclick=beginRound;$('#exit').onclick=home;}
$('#pause').onclick=pause;
function roundOver(){
 const winner=match.winner;if(winner>=0)wins[winner]++;
 const done=wins.some(w=>w>=match.rules.winsNeeded),arcadeClear=mode==='arcade'&&done&&winner===0&&stage===5;
 let title=winner<0?'DRAW.':`${fighters[match.players[winner].id].name} WINS.`;
 let note=winner<0?'A perfect stalemate. Run it back.':`${wins[0]} — ${wins[1]} · First to ${match.rules.winsNeeded} rounds.`;
 if(arcadeClear){title='THE RIFT IS SEALED.';note=fighters[selected].ending;}
 else if(done&&mode==='arcade'&&winner===0)note='Another world waits on the other side. Advance to your next opponent.';
 else if(done)note=winner===0?'Match won. The fracture remembers your name.':'Match lost. Every rival is a lesson.';
 showDialog(`<div class="eyebrow result">${arcadeClear?'ARCADE COMPLETE':done?'MATCH RESULT':'ROUND RESULT'}</div><h2>${title}</h2><p>${note}</p><div class="modal-actions"><button id="next" class="primary">${arcadeClear?'PLAY AGAIN':done?(mode==='arcade'&&winner===0?'NEXT OPPONENT':'REMATCH'):'NEXT ROUND'} ↗</button><button id="exit">CHARACTER SELECT</button></div>`);
 $('#next').onclick=()=>{if(arcadeClear){start();return;}if(done){if(mode==='arcade'&&winner===0)stage++;wins=[0,0];round=0;}beginRound();};$('#exit').onclick=home;
}
const blocked=['Space','ArrowUp','ArrowDown','ArrowLeft','ArrowRight','Tab'];
window.addEventListener('keydown',e=>{if(e.code==='Escape'&&!$('#modal').open){pause();e.preventDefault();return;}if($('#modal').open)return;if(match&&blocked.includes(e.code))e.preventDefault();keys.add(e.code);});
window.addEventListener('keyup',e=>keys.delete(e.code));window.addEventListener('blur',()=>{keys.clear();if(match&&!paused&&match.phase==='fight')pause();});document.addEventListener('visibilitychange',()=>{if(document.hidden){keys.clear();if(match&&!paused)pause();}});
for(const b of document.querySelectorAll('[data-key]')){b.onpointerdown=e=>{e.preventDefault();keys.add(b.dataset.key);b.setPointerCapture(e.pointerId);};b.onpointerup=b.onpointercancel=()=>keys.delete(b.dataset.key);}
function keyboard(p){const i=neutral(),map=p?['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Numpad1','Numpad2','Numpad3','Numpad4','Numpad5','Numpad6']:['KeyA','KeyD','KeyW','KeyS','KeyJ','KeyK','KeyU','KeyI','KeyO','KeyL'];i.x=Number(keys.has(map[1]))-Number(keys.has(map[0]));i.z=Number(keys.has(map[3]))-Number(keys.has(map[2]));['attack','guard','capture','launch','pursuit','super'].forEach((k,n)=>i[k]=keys.has(map[n+4])||(p&&keys.has('Digit'+(n+1))));return i;}
function padInput(pad){return readPad(pad,settings.deadzone);}
function controllerMenu(pad,newly){
 if(!pad||match&&!paused&&!$('#modal').open)return;
 const dialog=$('#modal').open;
 if(dialog&&newly(1)){padAwaitRelease=true;closeDialog();return;}
 const controls=[...document.querySelectorAll(dialog?'#modal button,#modal select,#modal input':'#menu button,#menu select,#help,#sound')].filter(el=>el.getClientRects().length&&!el.disabled);
 if(!controls.length)return;
 let active=document.activeElement,index=controls.indexOf(active);
 if(index<0){active=dialog?controls[0]:document.querySelector(`[data-id="${selected}"]`);index=controls.indexOf(active);}
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
function events(){for(const e of match.events){if(e.type==='hit'){view.burst(e.x,e.z,e.color);sound(85,.12,'sawtooth');if(e.combo>1)$('#combo').textContent=`${e.combo} HIT CHAIN`;}if(e.type==='shot')sound(380,.12);if(e.type==='parry'){view.burst(e.x,e.z,'#ffffff');announce('PERFECT DEFLECT',.7);sound(900,.15);}if(e.type==='block')sound(130,.06,'square');if(e.type==='stock'){announce('POWER STOCK +1',.7);sound(650,.2);}if(e.type==='cinematic'){announce(e.text,1.5);sound(60,.6,'sawtooth');}if(e.type==='hint')announce(e.text,1);if(e.type==='over')roundOver();}}
function frame(ms){const dt=Math.min((ms-last)/1000,.1)||STEP;last=ms;const pads=Array.from(navigator.getGamepads?.()||[]).filter(Boolean);$('#pad-status').textContent=pads.length?`${pads.length} CONTROLLER${pads.length>1?'S':''} CONNECTED`:'KEYBOARD READY';controllerMenuTime-=dt;
 const pad=pads[0],pButtons=pad?pad.buttons.map(b=>b.pressed):[];const newly=n=>pButtons[n]&&!previousPad[n];document.body.classList.toggle('controller-nav',!!pad);
 if(!pads.some(p=>p.buttons.some(b=>b.pressed)))padAwaitRelease=false;
 if(newly(9)&&match&&!$('#modal').open){padAwaitRelease=true;pause();}else if(newly(9)&&paused){padAwaitRelease=true;closeDialog();}
 controllerMenu(pad,newly);
 previousPad=pButtons;
 if(match&&!paused&&match.phase==='fight'){
  const p0=mode==='local'&&pads.length===1?null:pads[0],p1=mode==='local'?(pads.length===1?pads[0]:pads[1]):null;
  const a=merge(keyboard(0),padAwaitRelease?neutral():padInput(p0));acc+=dt;
  while(acc>=STEP&&match.phase==='fight'&&!paused){const b=mode==='local'?merge(keyboard(1),padAwaitRelease?neutral():padInput(p1)):mode==='training'&&settings.trainingBehavior!=='cpu'?{...neutral(),guard:settings.trainingBehavior==='guard'}:aiInput(match,STEP);if(mode==='training')recordInput(inputHistory,a);update(match,[a,b]);events();acc-=STEP;}
  const move=match.players[0].move,phase=movePhase(move);
  $('#training-readout').hidden=mode!=='training';
  $('#input-history').hidden=mode!=='training'||!settings.showInputs;$('#input-history').textContent=inputHistory.map(item=>`${item.label} [${item.frames}f]`).join('  |  ');
  $('#training-readout').textContent=match.cinematic?`${match.cinematic.kind==='capture'?'CAPTURE / '+match.cinematic.context.toUpperCase():'BURST'} · ${Math.max(0,match.cinematic.duration-match.cinematic.t).toFixed(1)}s`:move?`${phase==='startup'?'WIND-UP':phase==='contact'?(move.active>1?'ACTIVE':'CONTACT'):'RECOVERY'} · ${move.kind.toUpperCase()}${['strike','shot'].includes(move.kind)||move.chain>1?' '+move.chain+'/3':''}${canChain(move)?' · CHAIN NOW':''} · ${phase==='startup'?move.startup-move.frame:move.total-move.frame}f`:'READY · Tap attack or hold to charge';
  $('#training-readout').dataset.phase=phase;
  $('#timer').textContent=mode==='training'?'∞':Math.max(0,Math.ceil(match.time));match.players.forEach((p,i)=>{$('#hp'+(i+1)).style.width=p.hp+'%';$('#stock'+(i+1)).textContent='◆'.repeat(p.stocks)+'◇'.repeat(3-p.stocks);});if(match.players.every(p=>p.comboTime===0))$('#combo').textContent='';
 }
 if(calloutTime>0){calloutTime-=dt;if(calloutTime<=0)$('#callout').textContent='';}view.render(paused?0:dt,match,settings);requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
// Read-only diagnostics for browser verification and bug reports.
window.riftDebug=()=>({phase:match?.phase||'menu',mode,paused,selected,stage,wins:[...wins],rules:match?.rules,time:match?.time,players:match?.players.map(p=>({id:p.id,x:p.x,z:p.z,hp:p.hp,stocks:p.stocks,anim:p.anim,move:p.move?.kind,moveFrame:p.move?.frame,chain:p.move?.chain,canChain:canChain(p.move),movePhase:movePhase(p.move)})),projectiles:match?.projectiles.length,cinematic:match?.cinematic?.kind,cinematicTime:match?.cinematic?.t,cinematicDuration:match?.cinematic?.duration,captureProfile:match?.cinematic?.profile,captureContext:match?.cinematic?.context});
