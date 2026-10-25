import {createMatch,neutral} from './combat.js';
import {keyName} from './key-bindings.js';
export const lessons=[
 {id:'movement',title:'Move around your rival'},
 {id:'chain',title:'Connect three basic hits'},
 {id:'charge',title:'Build a power stock'},
 {id:'guard',title:'Time a defensive guard'},
 {id:'capture',title:'Expand a long capture'},
 {id:'launch',title:'Launch and pursue'},
 {id:'air',title:'Recover in the air'},
 {id:'ground',title:'Roll out of a knockdown'},
 {id:'pressure',title:'Win a Pressure Dash'}
];
export function lessonMatch(id,fighter=2,options={}){
 if(!lessons.some(l=>l.id===id))throw Error('Unknown lesson');
 const m=createMatch(fighter,0,'training','easy',options),[a,b]=m.players;
 a.x=0;b.x=['chain','guard','launch'].includes(id)?1.7:id==='pressure'?5:7;
 if(id==='charge')a.stocks=0;
 if(id==='air'){a.air=.85;a.launched=true;a.stun=.82;a.anim='launch';a.animTime=.85;}
 if(id==='ground'){a.stun=.55;a.anim='knockdown';a.animTime=.55;}
 m.lesson={id,status:'active',stage:0,feedback:'',startDistance:Math.hypot(a.x-b.x,a.z-b.z),startStocks:a.stocks,startAngle:Math.atan2(a.z-b.z,a.x-b.x),grown:false};
 return m;
}
export function lessonOpponent(m,input){
 const l=m.lesson,i=neutral();if(!l||l.status!=='active')return i;
 if(l.id==='guard')i.attack=m.tick%120===45;
 if(l.id==='pressure'){
  if(m.pressure)i.attack=m.tick%30===0;
  else if(m.players[0].move?.kind==='pursuit'||input.pursuit)i.pursuit=true;
 }
 return i;
}
export function updateLesson(m){
 const l=m.lesson;if(!l||l.status!=='active')return;
 const [a,b]=m.players,events=m.events,has=text=>events.some(e=>e.player===0&&e.text===text);
 const success=()=>{l.status='passed';l.feedback='Complete. Try again, choose the next lesson, or return to free practice.';};
 const fail=text=>{l.status='retry';l.feedback=text+' Choose Retry for a fresh setup.';};
 if(l.id==='movement'){
  const d=Math.hypot(a.x-b.x,a.z-b.z);
  if(l.stage===0&&d<l.startDistance-1){l.stage=1;l.startAngle=Math.atan2(a.z-b.z,a.x-b.x);}
  else if(l.stage===1){const angle=Math.atan2(a.z-b.z,a.x-b.x)-l.startAngle;if(Math.abs(Math.atan2(Math.sin(angle),Math.cos(angle)))>.25){l.stage=2;l.startDistance=d;}}
  else if(l.stage===2&&d>l.startDistance+1)success();
 }else if(l.id==='chain'){
  if(a.move?.kind==='strike'&&a.move.chain===3&&events.some(e=>e.type==='hit'&&e.attacker===0))success();
  else if(a.move?.kind==='shot')l.feedback='Too far away. Close in before tapping attack.';
  else if(a.move?.kind==='strike'&&a.move.frame>a.move.startup+10)l.feedback='Tap again just after contact, while CHAIN NOW is shown.';
 }else if(l.id==='charge'){if(a.stocks>l.startStocks)success();else if(a.move)l.feedback='Hold attack without a direction; a short tap starts an attack.';}
 else if(l.id==='guard'){
  if(events.some(e=>e.type==='parry'))success();
  else if(a.hp<100)fail('Guard was late or held too early. Watch the rival’s wind-up.');
 }else if(l.id==='capture'){
  if(m.projectiles.some(p=>p.owner===0&&p.kind==='capture'&&p.radius>.9))l.grown=true;
  if(l.grown&&m.cinematic?.kind==='capture'&&m.cinematic.a===0)success();
  else if(m.cinematic?.kind==='capture')fail('The capture landed, but the circle was not expanded first.');
  else if(m.tick>210&&!m.projectiles.some(p=>p.kind==='capture'))fail('Send the capture from this distance, then tap attack during its flight.');
 }else if(l.id==='launch'){
  if(b.air>0)l.stage=1;
  if(a.move?.aerial&&a.move.pursuitHit===3)success();
  else if(l.stage===1&&b.air===0&&!a.move?.aerial)fail('The rival landed. Pursue sooner after the launcher connects.');
 }else if(l.id==='air'){if(has('AIR RECOVERY'))success();else if(a.anim==='knockdown')fail('Tap guard before you land.');}
 else if(l.id==='ground'){if(has('RECOVERY ROLL'))success();else if(a.stun===0)fail('Tap a direction while down; holding it beforehand does not count.');}
 else if(l.id==='pressure'&&m.lastPressure){if(m.lastPressure.winner===0)success();else fail(m.lastPressure.winner<0?'The contest tied.':'The rival won. Use distinct attack presses, with releases between them.');}
 if(l.status==='active'&&m.tick>1200)fail('Time to reset and try the command again.');
}
export function lessonText(m,bindings,controller=false){
 const l=m.lesson;if(!l)return '';
 const labels=controller?['Left','Right','Up','Down','A / Cross','B / Circle','X / Square','Left bumper','Right bumper','Y / Triangle']:bindings[0].map(c=>c.map(keyName).join(' / '));
 const [left,right,close,retreat,attack,guard,capture,launch,pursuit]=labels;
 const instructions={
  movement:[`Hold ${close} to close the distance.`,`Hold ${left} or ${right} to circle.`,`Hold ${retreat} to retreat.`][l.stage],
  chain:`Tap ${attack} three times, tapping again just after each contact.`,
  charge:`Hold ${attack} without a direction until a stock appears.`,
  guard:`Tap ${guard} just before the rival’s attack lands. Wait for the wind-up.`,
  capture:`Press ${capture}; while the ring travels, tap ${attack} to expand it.`,
  launch:`Press ${launch}, then ${pursuit} as the rival rises. Land all three pursuit hits.`,
  air:`Tap ${guard} before landing to recover in the air.`,
  ground:`Tap ${left} or ${right} now to roll out of the knockdown.`,
  pressure:`Press ${pursuit} to meet the rival’s dash, then ${m.rules.pressureAssist?'hold':'repeatedly tap'} ${attack}.`
 };
 return `${lessons.find(x=>x.id===l.id).title} · ${l.status==='passed'?'COMPLETE':l.status==='retry'?'TRY AGAIN':instructions[l.id]}${l.feedback?' · '+l.feedback:''}`;
}
