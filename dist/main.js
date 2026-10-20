import {movePhase,canChain} from './moves.js';
import {fighters} from './fighters.js';
import {createMatch,update,aiInput,neutral,STEP} from './combat.js';
import {createView} from './render.js';
const $=s=>document.querySelector(s),keys=new Set();let selected=0,match=null,paused=false,round=0,wins=[0,0],stage=0,mode='arcade',last=0,acc=0,calloutTime=0,view,audio,controllerMenuTime=0,previousPad=[];
let settings={volume:.25,difficulty:'normal',quality:'high',reduced:false,trainingAI:false};try{settings={...settings,...JSON.parse(localStorage.getItem('rift-options')||'{}')};}catch{}
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
const helpHTML=()=>`<div class="eyebrow result">FIELD MANUAL / ${fighters[selected].name}</div><h2>TWO BUTTONS. MANY POSSIBILITIES.</h2><p>Move in 3D with WASD. Tap attack for a strike up close or an energy shot at range. Hold it to charge up to three power stocks. Low health speeds up charging.</p><table class="controls"><tr><td>Move / sidestep</td><td>WASD</td><td>Left stick / D-pad</td></tr><tr><td>Attack / hold to charge</td><td>J</td><td>A / Cross</td></tr><tr><td>Guard / timed deflect</td><td>K</td><td>B / Circle</td></tr><tr><td>Signature / retreat special</td><td>Toward / away + tap J</td><td>Stick + A / Cross</td></tr><tr><td>Capture / break with timed guard</td><td>U or S + tap J</td><td>X / Square</td></tr><tr><td>Third signature move</td><td>W + tap J</td><td>Up + A / Cross</td></tr><tr><td>Launch into the air</td><td>I or double-tap S + J</td><td>Left bumper</td></tr><tr><td>Pursue / dash</td><td>O</td><td>Right bumper</td></tr><tr><td>Power burst (1 stock)</td><td>L</td><td>Y / Triangle</td></tr><tr><td>Pause</td><td>Escape</td><td>Start / Options</td></tr></table><h3>READ THE WIND-UP</h3><p>Attacks now have wind-up, contact, and recovery. Fast strikes can interrupt slow ones. Step out of range before contact to make a melee attack miss. Commit to your attack: you cannot guard until recovery ends. Tap attack again just after contact to chain up to three strikes or shots. After the second, you can finish with a launcher, capture, or special. A missed melee strike cannot chain. Tap near the end of recovery to queue a separate attack. Training shows your current phase and remaining frames.</p><h3>DIRECTIONAL COMMANDS</h3><p>Tap a direction twice within 0.30 seconds, then tap attack: toward = pursuit; away = burst; down = launcher; up = jumping crossover. Double-tap up + guard to jump. Press guard freshly in the air to recover. If you land knocked down, tap W or S (controller Up or Down) to roll once the landing settles. Holding a direction does not trigger a roll. You cannot attack during the roll, and its invulnerability ends before you stand. Toward + guard near a rival circles behind them; capture quickly before they turn. The same sequences work with the D-pad or stick.</p><h3>${fighters[selected].moves[0]} / ${fighters[selected].moves[1]}</h3><p>Tap attack while moving toward the rival for your signature move, or away for a retreating special. Toward and away reverse when you switch sides. W + tap attack uses ${fighters[selected].moves[2]}, your third signature move.</p><h3>${fighters[selected].special}</h3><p>Land a launcher at close range, then pursue before your opponent falls. Captures bypass held guard; a fresh guard breaks them. Time guard just before a normal projectile hits to reflect it. Burst can be guarded and misses beyond 9 arena units.</p><p><b>Local versus:</b> P1 uses WASD / J K U I O L. P2 uses arrow keys / Numpad 1–6 (or 1–6 along the top row). Two controllers take P1 and P2; with one controller, it controls P2. Menus support a controller: left/right to pick, A/Cross to start.</p><p>Original characters and procedural art. Inspired by the PS1 era; not affiliated with Evil Zone or its creators.</p>`;
$('#help').onclick=()=>{if(match)paused=true;showDialog(helpHTML());};
$('#settings').onclick=()=>{
 showDialog(`<div class="eyebrow result">SYSTEM CONFIGURATION</div><h2>MAKE IT YOURS.</h2><label>CPU difficulty<select id="difficulty"><option value="easy">Easy</option><option value="normal">Normal</option><option value="hard">Hard</option></select></label><label>Render quality<select id="quality"><option value="high">High · smooth edges</option><option value="low">Low · fewer pixels, no dynamic shadows</option></select></label><label>Sound volume<input id="volume" type="range" min="0" max="1" step=".05" value="${settings.volume}"></label><label><input id="reduced" type="checkbox" ${settings.reduced?'checked':''}> Reduce motion · disable cinematic camera</label><label><input id="trainingAI" type="checkbox" ${settings.trainingAI?'checked':''}> Active CPU in training</label><p>Settings save in this browser. Controllers use the standard browser gamepad mapping.</p>`);
 for(const key of ['difficulty','quality']){$('#'+key).value=settings[key];$('#'+key).onchange=e=>{settings[key]=e.target.value;view.quality(settings.quality);save();};}
 $('#volume').oninput=e=>{settings.volume=Number(e.target.value);enableSound();save();sound(300);};for(const key of ['reduced','trainingAI'])$('#'+key).onchange=e=>{settings[key]=e.target.checked;save();};
};
function announce(text,t=1.5){$('#callout').textContent=text;calloutTime=t;}
function beginRound(){
 const opponent=mode==='arcade'?(selected+stage+1)%6:Number($('#opponent').value);
 match=createMatch(selected,opponent,mode,settings.difficulty);round++;paused=false;keys.clear();view.match(match);$('#menu').hidden=true;$('#hud').hidden=false;document.body.classList.add('playing');$('#modal').close();
 $('#p1-name').textContent=fighters[selected].name;$('#p2-name').textContent=fighters[opponent].name;$('#p2-label').textContent=mode==='local'?'PLAYER 02':mode==='training'?'TRAINING':'CPU';$('#round-label').textContent=mode==='arcade'?`BOUT ${stage+1} / 6 · ${wins[0]}—${wins[1]}`:mode==='training'?'FREE PRACTICE':`ROUND ${round} · ${wins[0]}—${wins[1]}`;
 announce(mode==='training'?'TRAINING / HOLD J TO CHARGE':`ROUND ${round} — FIGHT`,1.5);sound(500,.3);acc=0;
}
function start(){mode=$('#mode').value;round=0;stage=0;wins=[0,0];enableSound();beginRound();}
$('#start').onclick=start;
function home(){match=null;paused=false;keys.clear();$('#modal').close();$('#menu').hidden=false;$('#hud').hidden=true;document.body.classList.remove('playing');view.select(selected);}
function pause(){if(!match||match.phase!=='fight')return;if(paused){closeDialog();return;}paused=true;showDialog('<div class="eyebrow result">TAKE A BREATH</div><h2>FRACTURE PAUSED.</h2><p>Your fight will wait.</p><div class="modal-actions"><button id="resume" class="primary">RESUME ↗</button><button id="restart">RESTART ROUND</button><button id="exit">CHARACTER SELECT</button></div>');$('#resume').onclick=closeDialog;$('#restart').onclick=beginRound;$('#exit').onclick=home;}
$('#pause').onclick=pause;
function roundOver(){
 const winner=match.winner;if(winner>=0)wins[winner]++;
 const done=wins.some(w=>w>=2),arcadeClear=mode==='arcade'&&done&&winner===0&&stage===5;
 let title=winner<0?'DRAW.':`${fighters[match.players[winner].id].name} WINS.`;
 let note=winner<0?'A perfect stalemate. Run it back.':`${wins[0]} — ${wins[1]} · First to two rounds.`;
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
function padInput(pad){const i=neutral();if(!pad)return i;const b=n=>pad.buttons[n]?.pressed||false;const dead=v=>Math.abs(v||0)>.22?v:0;i.x=dead(pad.axes[0])||Number(b(15))-Number(b(14));i.z=dead(pad.axes[1])||Number(b(13))-Number(b(12));Object.assign(i,{attack:b(0),guard:b(1),capture:b(2),super:b(3),launch:b(4),pursuit:b(5)});return i;}
function merge(a,b){return {...a,x:b.x||a.x,z:b.z||a.z,...Object.fromEntries(['attack','guard','capture','launch','pursuit','super'].map(k=>[k,a[k]||b[k]]))};}
function events(){for(const e of match.events){if(e.type==='hit'){view.burst(e.x,e.z,e.color);sound(85,.12,'sawtooth');if(e.combo>1)$('#combo').textContent=`${e.combo} HIT CHAIN`;}if(e.type==='shot')sound(380,.12);if(e.type==='parry'){view.burst(e.x,e.z,'#ffffff');announce('PERFECT DEFLECT',.7);sound(900,.15);}if(e.type==='block')sound(130,.06,'square');if(e.type==='stock'){announce('POWER STOCK +1',.7);sound(650,.2);}if(e.type==='cinematic'){announce(e.text,1.5);sound(60,.6,'sawtooth');}if(e.type==='hint')announce(e.text,1);if(e.type==='over')roundOver();}}
function frame(ms){const dt=Math.min((ms-last)/1000,.1)||STEP;last=ms;const pads=Array.from(navigator.getGamepads?.()||[]).filter(Boolean);$('#pad-status').textContent=pads.length?`${pads.length} CONTROLLER${pads.length>1?'S':''} CONNECTED`:'KEYBOARD READY';controllerMenuTime-=dt;
 const pad=pads[0],pButtons=pad?pad.buttons.map(b=>b.pressed):[];const newly=n=>pButtons[n]&&!previousPad[n];
 if(newly(9)&&match&&!$('#modal').open)pause();else if(newly(9)&&paused)closeDialog();
 if($('#modal').open&&newly(0)){const button=$('#modal-body button');if(button)button.click();else closeDialog();}
 else if(!match&&!$('#modal').open&&pad){if(controllerMenuTime<=0){const axis=padInput(pad).x;if(Math.abs(axis)>.5){select(selected+Math.sign(axis));controllerMenuTime=.25;}}if(newly(0))start();}
 previousPad=pButtons;
 if(match&&!paused&&match.phase==='fight'){
  const p0=mode==='local'&&pads.length===1?null:pads[0],p1=mode==='local'?(pads.length===1?pads[0]:pads[1]):null;
  const a=merge(keyboard(0),padInput(p0));acc+=dt;
  while(acc>=STEP&&match.phase==='fight'&&!paused){const b=mode==='local'?merge(keyboard(1),padInput(p1)):mode==='training'&&!settings.trainingAI?neutral():aiInput(match,STEP);update(match,[a,b]);events();acc-=STEP;}
  const move=match.players[0].move,phase=movePhase(move);
  $('#training-readout').hidden=mode!=='training';
  $('#training-readout').textContent=move?`${phase==='startup'?'WIND-UP':phase==='contact'?(move.active>1?'ACTIVE':'CONTACT'):'RECOVERY'} · ${move.kind.toUpperCase()}${['strike','shot'].includes(move.kind)||move.chain>1?' '+move.chain+'/3':''}${canChain(move)?' · CHAIN NOW':''} · ${phase==='startup'?move.startup-move.frame:move.total-move.frame}f`:'READY · Tap attack or hold to charge';
  $('#training-readout').dataset.phase=phase;
  $('#timer').textContent=mode==='training'?'∞':Math.max(0,Math.ceil(match.time));match.players.forEach((p,i)=>{$('#hp'+(i+1)).style.width=p.hp+'%';$('#stock'+(i+1)).textContent='◆'.repeat(p.stocks)+'◇'.repeat(3-p.stocks);});if(match.players.every(p=>p.comboTime===0))$('#combo').textContent='';
 }
 if(calloutTime>0){calloutTime-=dt;if(calloutTime<=0)$('#callout').textContent='';}view.render(paused?0:dt,match,settings);requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
// Read-only diagnostics for browser verification and bug reports.
window.riftDebug=()=>({phase:match?.phase||'menu',mode,paused,selected,stage,wins:[...wins],players:match?.players.map(p=>({id:p.id,x:p.x,z:p.z,hp:p.hp,stocks:p.stocks,anim:p.anim,move:p.move?.kind,moveFrame:p.move?.frame,chain:p.move?.chain,canChain:canChain(p.move),movePhase:movePhase(p.move)})),projectiles:match?.projectiles.length,cinematic:match?.cinematic?.kind,cinematicTime:match?.cinematic?.t,cinematicDuration:match?.cinematic?.duration,captureContext:match?.cinematic?.context});
