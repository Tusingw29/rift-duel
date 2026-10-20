// Procedural soundtrack and effects. No audio files: every sound is synthesized at
// runtime, which keeps the published build small. Pattern data is pure and testable.
const K=1,H=1,O=2;// kick / closed hat / open hat markers
export const themes={
 menu:{bpm:96,root:45,scale:[0,2,3,5,7,8,10],wave:'triangle',shift:[0,0,-2,-3],
  bass:[0,null,null,0,null,null,0,null,null,null,0,null,null,null,4,null],
  lead:[7,null,null,9,null,null,11,null,null,null,9,null,7,null,null,null],
  kick:[K,0,0,0,0,0,0,0,K,0,0,0,0,0,0,0],hat:[0,0,H,0,0,0,H,0,0,0,H,0,0,0,O,0]},
 aegis:{bpm:138,root:43,scale:[0,2,3,5,7,9,10],wave:'square',shift:[0,0,3,2],
  bass:[0,0,7,0,0,0,7,5,0,0,7,0,3,3,5,5],
  lead:[14,null,16,null,14,null,12,11,null,12,null,14,null,16,null,null],
  kick:[K,0,0,0,K,0,0,0,K,0,0,0,K,0,K,0],hat:[0,0,H,0,0,0,H,0,0,0,H,0,0,0,O,0]},
 rei:{bpm:126,root:47,scale:[0,1,5,7,8],wave:'triangle',shift:[0,0,2,1],
  bass:[0,null,0,null,2,null,null,0,null,null,0,null,3,null,2,null],
  lead:[5,null,6,null,7,null,null,5,null,8,null,7,null,null,6,null],
  kick:[K,0,0,0,0,0,K,0,0,0,K,0,0,0,0,0],hat:[0,0,H,0,0,0,H,0,0,0,H,0,0,0,H,0]},
 tala:{bpm:150,root:41,scale:[0,3,5,7,10],wave:'square',shift:[0,0,1,2],
  bass:[0,0,null,0,2,null,0,0,null,0,3,null,0,0,2,1],
  lead:[9,null,null,10,null,9,null,7,null,null,9,null,12,null,10,9],
  kick:[K,0,0,K,0,0,K,0,K,0,0,K,0,0,K,0],hat:[0,H,0,H,0,H,0,H,0,H,0,H,0,H,0,O]},
 morrow:{bpm:118,root:38,scale:[0,2,3,5,7,8,10],wave:'sawtooth',shift:[0,0,-2,-1],
  bass:[0,null,null,null,0,null,0,null,null,null,null,null,3,null,2,null],
  lead:[null,null,null,null,7,null,null,null,null,null,null,null,9,null,8,null],
  kick:[K,0,0,0,0,0,0,0,K,0,0,0,0,0,0,0],hat:[0,0,0,0,H,0,0,0,0,0,0,0,H,0,0,0]},
 sol:{bpm:144,root:44,scale:[0,2,3,5,7,8,11],wave:'square',shift:[0,0,4,3],
  bass:[0,0,0,null,6,null,0,0,0,null,4,null,0,null,3,null],
  lead:[14,13,null,14,null,16,null,13,null,14,null,11,null,13,null,null],
  kick:[K,0,0,0,K,0,0,0,K,0,0,0,K,0,0,0],hat:[0,0,H,0,0,0,H,0,0,0,H,0,0,H,0,O]},
 vesper:{bpm:112,root:40,scale:[0,2,4,6,7,9,11],wave:'triangle',shift:[0,0,2,-1],
  bass:[0,null,null,null,null,null,0,null,null,null,4,null,null,null,null,null],
  lead:[9,null,null,11,null,null,13,null,null,null,11,null,null,null,9,null],
  kick:[K,0,0,0,0,0,0,0,K,0,0,0,0,0,0,0],hat:[0,0,0,0,H,0,0,0,0,0,0,0,H,0,0,0]}
};
export const STEPS=16,BARS=4;
export function scaleNote(theme,degree){const n=theme.scale.length;const octave=Math.floor(degree/n),index=((degree%n)+n)%n;return theme.root+octave*12+theme.scale[index];}
export const midiToHz=midi=>440*2**((midi-69)/12);
// Resolves one sequencer step into notes, applying the four-bar bass movement.
export function stepNotes(theme,step){
 const i=((step%STEPS)+STEPS)%STEPS,bar=Math.floor(step/STEPS)%BARS,shift=theme.shift[bar];
 const bass=theme.bass[i],lead=theme.lead[i];
 return {bar,index:i,bass:bass===null?null:scaleNote(theme,bass+shift),lead:lead===null?null:scaleNote(theme,lead+shift),kick:theme.kick[i]===K,hat:theme.hat[i]===H?'closed':theme.hat[i]===O?'open':null,pad:i===0?[scaleNote(theme,shift),scaleNote(theme,shift+2),scaleNote(theme,shift+4)]:null};
}
export function stepSeconds(theme){return 60/theme.bpm/4;}
export function createAudio(){
 let ctx=null,master,musicGain,sfxGain,noise,music=null,timer=null,current=null,volume=.25,musicOn=true,announcer=true,duck=1;
 function context(){
  if(ctx)return ctx;const C=globalThis.AudioContext||globalThis.webkitAudioContext;if(!C)return null;
  ctx=new C();master=ctx.createGain();master.connect(ctx.destination);musicGain=ctx.createGain();musicGain.connect(master);sfxGain=ctx.createGain();sfxGain.connect(master);
  const buffer=ctx.createBuffer(1,ctx.sampleRate,ctx.sampleRate),data=buffer.getChannelData(0);for(let i=0;i<data.length;i++)data[i]=Math.random()*2-1;noise=buffer;
  apply();return ctx;
 }
 function apply(){if(!ctx)return;master.gain.setTargetAtTime(volume,ctx.currentTime,.02);musicGain.gain.setTargetAtTime(musicOn?.55*duck:0,ctx.currentTime,.05);}
 function resume(){const c=context();if(c&&c.state!=='running')c.resume();return !!c;}
 const tone=(freq,duration,{type='triangle',to=freq*.4,gain=.18,at=0,dest}={})=>{
  const o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+at;o.type=type;o.frequency.setValueAtTime(freq,t);o.frequency.exponentialRampToValueAtTime(Math.max(20,to),t+duration);
  g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.001,t+duration);o.connect(g);g.connect(dest||sfxGain);o.start(t);o.stop(t+duration+.02);
 };
 const burst=(duration,{gain=.4,filter='lowpass',cutoff=1200,at=0,dest}={})=>{
  const s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain(),t=ctx.currentTime+at;s.buffer=noise;f.type=filter;f.frequency.value=cutoff;
  g.gain.setValueAtTime(gain,t);g.gain.exponentialRampToValueAtTime(.001,t+duration);s.connect(f);f.connect(g);g.connect(dest||sfxGain);s.start(t);s.stop(t+duration+.02);
 };
 const effects={
  ui:()=>tone(420,.08),select:n=>tone(300+(n||0)*40,.1),
  hit:()=>{burst(.1,{gain:.5,cutoff:1600});tone(95,.16,{type:'sine',to:38,gain:.7});},
  heavy:()=>{burst(.18,{gain:.7,cutoff:900});tone(70,.3,{type:'sine',to:28,gain:.9});},
  block:()=>{tone(130,.06,{type:'square',gain:.14});burst(.04,{gain:.15,cutoff:3000});},
  parry:()=>{tone(900,.15,{type:'sine',to:1400,gain:.2});tone(1800,.25,{type:'sine',to:1800,gain:.1,at:.03});},
  shot:()=>{tone(380,.12,{to:140});burst(.05,{gain:.12,filter:'highpass',cutoff:3000});},
  stock:()=>{tone(400,.2,{type:'sine',to:900,gain:.18});tone(800,.25,{type:'sine',to:1600,gain:.1,at:.08});},
  cinematic:()=>{tone(60,.7,{type:'sawtooth',to:30,gain:.3});burst(.6,{gain:.25,cutoff:600});tone(1200,.4,{type:'sine',to:300,gain:.08,at:.1});},
  capture:()=>{tone(220,.3,{type:'sawtooth',to:55,gain:.22});burst(.2,{gain:.3,cutoff:800});},
  versus:()=>{tone(110,.35,{type:'sawtooth',to:40,gain:.3});burst(.3,{gain:.3,cutoff:500});},
  round:()=>{tone(523,.14,{type:'square',to:523,gain:.1});tone(659,.2,{type:'square',to:659,gain:.1,at:.14});},
  fight:()=>{[659,784,1046].forEach((f,i)=>tone(f,.16,{type:'square',to:f,gain:.12,at:i*.08}));burst(.25,{gain:.3,cutoff:2500,at:.16});},
  ko:()=>{tone(70,1,{type:'sine',to:22,gain:1});burst(.7,{gain:.6,cutoff:700});tone(1500,.5,{type:'sawtooth',to:200,gain:.12,at:.05});},
  time:()=>{[440,415,392].forEach((f,i)=>tone(f,.25,{type:'triangle',to:f,gain:.14,at:i*.2}));},
  win:()=>{[523,659,784,1046].forEach((f,i)=>tone(f,.3,{type:'triangle',to:f,gain:.14,at:i*.11}));},
  lose:()=>{[392,349,311].forEach((f,i)=>tone(f,.4,{type:'triangle',to:f*.98,gain:.14,at:i*.22}));}
 };
 function sfx(kind,arg){if(!ctx||volume===0)return;(effects[kind]||effects.ui)(arg);}
 function scheduleStep(theme,step,at){
  const notes=stepNotes(theme,step),length=stepSeconds(theme);
  if(notes.kick){const o=ctx.createOscillator(),g=ctx.createGain();o.type='sine';o.frequency.setValueAtTime(150,at);o.frequency.exponentialRampToValueAtTime(42,at+.1);g.gain.setValueAtTime(.8,at);g.gain.exponentialRampToValueAtTime(.001,at+.16);o.connect(g);g.connect(musicGain);o.start(at);o.stop(at+.2);}
  if(notes.hat){const s=ctx.createBufferSource(),f=ctx.createBiquadFilter(),g=ctx.createGain(),d=notes.hat==='open'?.11:.035;s.buffer=noise;f.type='highpass';f.frequency.value=7000;g.gain.setValueAtTime(.16,at);g.gain.exponentialRampToValueAtTime(.001,at+d);s.connect(f);f.connect(g);g.connect(musicGain);s.start(at);s.stop(at+d+.01);}
  if(notes.bass!==null){const o=ctx.createOscillator(),f=ctx.createBiquadFilter(),g=ctx.createGain();o.type='sawtooth';o.frequency.value=midiToHz(notes.bass);f.type='lowpass';f.frequency.setValueAtTime(900,at);f.frequency.exponentialRampToValueAtTime(220,at+length*.9);g.gain.setValueAtTime(.3,at);g.gain.exponentialRampToValueAtTime(.001,at+length*.95);o.connect(f);f.connect(g);g.connect(musicGain);o.start(at);o.stop(at+length);}
  if(notes.lead!==null){for(const detune of [-6,6]){const o=ctx.createOscillator(),g=ctx.createGain();o.type=theme.wave;o.frequency.value=midiToHz(notes.lead);o.detune.value=detune;g.gain.setValueAtTime(.055,at);g.gain.exponentialRampToValueAtTime(.001,at+length*1.6);o.connect(g);g.connect(musicGain);o.start(at);o.stop(at+length*1.7);}}
  if(notes.pad){const bar=length*STEPS;for(const midi of notes.pad){const o=ctx.createOscillator(),g=ctx.createGain();o.type='triangle';o.frequency.value=midiToHz(midi+12);g.gain.setValueAtTime(.0001,at);g.gain.linearRampToValueAtTime(.045,at+bar*.3);g.gain.linearRampToValueAtTime(.0001,at+bar);o.connect(g);g.connect(musicGain);o.start(at);o.stop(at+bar+.05);}}
 }
 function tick(){if(!music||!ctx)return;while(music.next<ctx.currentTime+.15){scheduleStep(music.theme,music.step,music.next);music.next+=stepSeconds(music.theme);music.step++;}}
 function play(id){
  if(!context())return;if(current===id&&music)return;stop();const theme=themes[id]||themes.menu;current=id;
  music={theme,step:0,next:ctx.currentTime+.08};timer=setInterval(tick,40);tick();
 }
 function stop(){if(timer)clearInterval(timer);timer=null;music=null;current=null;}
 function say(text){
  if(!announcer||volume===0||!globalThis.speechSynthesis||!text)return;
  try{const u=new SpeechSynthesisUtterance(text);u.rate=1.05;u.pitch=.6;u.volume=Math.min(1,volume*2.5);speechSynthesis.cancel();speechSynthesis.speak(u);}catch{}
 }
 return {resume,sfx,play,stop,say,
  get playing(){return current;},get ready(){return !!ctx;},
  configure({volume:v,music:m,announcer:a}={}){if(Number.isFinite(v))volume=v;if(typeof m==='boolean')musicOn=m;if(typeof a==='boolean')announcer=a;apply();if(!musicOn)return;},
  duck(on){duck=on?.35:1;apply();}
 };
}
