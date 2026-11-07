import {grabOptions} from './grab-options.js';
import {matchFighter,balanceCaptureBreak} from './balance-runtime.js';
import {circleWakeProtected,updateCaptureWake} from './capture-wake.js';
import {rangedCaptureGuard} from './ranged-capture.js';
import {moveWithinBounds} from './arena-bounds.js';
import {measured} from './skill/observer.js';
// CAPTURE-SEAL: original 60 Hz playtest guesses, not measured Evil Zone timings.
export const GRAB=Object.freeze({reachMargin:.3,closeStartup:16});
export const SEAL=Object.freeze({startRadius:3,radius:1.5,warningFrames:54,recovery:20,dashWindow:30,dashSpeed:14,punishFrames:12,visualFrames:20,bodyRadius:.5});
export const CAPTURE_DAMAGE=Object.freeze({front:1.15,back:1.3,mid:.9,far:.75});
const configs=new WeakMap();
export function normalizeSeal(value=''){const names=[...new Set(String(value||'').split(',').filter(Boolean))];for(const s of names)if(!['on','dash'].includes(s))throw Error('Unknown seal option: '+s);if(names.includes('dash')&&!names.includes('on'))throw Error('seal=dash requires on');return names.sort().join(',');}
export const sealFromSearch=s=>normalizeSeal(new URLSearchParams(s).get('seal')||'');
export function capDamageFromSearch(s){const v=new URLSearchParams(s).get('capdmg')||'';if(v&&!['closehigh'].includes(v))throw Error('Unknown capture damage option');return v;}
export function configureSeal(m,options){const seal=normalizeSeal(options.seal),damage=options.capdmg||'';if(damage&&damage!=='closehigh')throw Error('Unknown capture damage option');if(seal||damage){configs.set(m,{on:!!seal,dash:seal.includes('dash'),damage});if(seal){m.seals=[];m.sealSerial=0;}}return m;}
export const sealConfig=m=>configs.get(m)||{};
export const captureReach=(m,p)=>grabOptions(m).reach?matchFighter(m,p).reach+GRAB.reachMargin:3.1;
export const captureDamageMultiplier=(m,context)=>sealConfig(m).damage==='closehigh'?CAPTURE_DAMAGE[context]:null;
export function prepareCapture(m,a,b,move){if(move.kind!=='capture')return;const opts=grabOptions(m),cfg=sealConfig(m),d=Math.hypot(b.x-a.x,b.z-a.z);if(!opts.locked&&!opts.reach&&!opts.slow16&&!cfg.on)return;
 move.captureReach=captureReach(m,a);move.captureClose=d<move.captureReach;if(!move.captureClose)move.captureRangeContext=d>=6?'far':'mid';
 if(opts.slow16&&move.captureClose){move.startup=GRAB.closeStartup;move.total=move.startup+move.active+move.recovery;}
 if(!cfg.on||move.captureClose)return;
 const owner=m.players.indexOf(a),s={id:++m.sealSerial,owner,target:1-owner,x:b.x,z:b.z,centre:{x:b.x,z:b.z},radius:SEAL.startRadius,frame:0,framesLeft:SEAL.warningFrames,escaped:false,status:'closing',started:m.tick,context:d>=6?'far':'mid',resolved:null};
 m.seals.push(s);move.sealId=s.id;move.startup=SEAL.warningFrames;move.active=1;move.recovery=SEAL.recovery;move.total=SEAL.warningFrames+SEAL.recovery;move.contactResolved=true;
 measured(m,'sealCast',{attacker:owner,defender:1-owner,seal:s});
}
export const sealCommit=p=>!!p.move?.sealId;
function extendCommit(m,s,frames){const a=m.players[s.owner];if(a.move?.sealId===s.id){a.move.total=Math.max(a.move.total,a.move.frame+frames);a.cool=(a.move.total-a.move.frame)/60;a.animTime=a.cool;}}
function finish(m,s,status){s.status=status;s.escaped=status==='escaped';s.resolved=m.tick;s.framesLeft=0;const a=m.players[s.owner];if(a.move?.sealId===s.id){a.move.startup=a.move.frame;a.move.active=0;a.move.total=Math.max(a.move.frame+SEAL.recovery,a.move.total);}
 measured(m,'sealResolve',{attacker:s.owner,defender:s.target,status,id:s.id});}
export function advanceSeals(m,beginCapture){if(!m.seals||m.cinematic||m.pressure)return;updateCaptureWake(m);const catches=[];
 for(const s of m.seals){if(s.status!=='closing')continue;const a=m.players[s.owner],b=m.players[s.target];
  if(a.hp<=0||b.hp<=0||a.stun>0||a.move?.sealId!==s.id){finish(m,s,'interrupted');continue;}
  if(s.started===m.tick)continue;
  s.frame++;s.framesLeft=Math.max(0,SEAL.warningFrames-s.frame);s.radius=SEAL.startRadius+(SEAL.radius-SEAL.startRadius)*Math.min(1,s.frame/SEAL.warningFrames);
  if(Math.hypot(b.x-s.x,b.z-s.z)>s.radius+SEAL.bodyRadius){
   finish(m,s,'escaped');if(sealConfig(m).dash){b.sealEscape={caster:s.owner,seal:s.id,earned:m.tick,expires:m.tick+SEAL.dashWindow};b.commands.double=null;b.commands.last=null;b.commands.lastTick=-Infinity;b.commands.stepTapDirection=null;const distance=Math.hypot(a.x-b.x,a.z-b.z),reach=matchFighter(m,b).reach;
    // Reserve even a last-window activation while walking away. Actual activation
    // recalculates the budget; this avoids advertising a reward that expires first.
    const flight=Math.ceil(Math.max(0,distance+matchFighter(m,b).speed*SEAL.dashWindow/60-reach+.05)/SEAL.dashSpeed*60);
    extendCommit(m,s,SEAL.dashWindow+flight+SEAL.punishFrames+2);}
   continue;
  }
  if(s.frame<SEAL.warningFrames)continue;
  if(circleWakeProtected(m,b)||b.inv>0||b.air>=.5){finish(m,s,'protected');continue;}
  if(balanceCaptureBreak(m,b,.2)){finish(m,s,'broken');measured(m,'captureBreak',{defender:s.target});continue;}
  if(rangedCaptureGuard(m)&&b.guard){finish(m,s,'guarded');b.blockStun=Math.max(b.blockStun,.12);measured(m,'block',{attacker:s.owner,defender:s.target,damage:0,kind:'capture',ranged:true});continue;}
  catches.push(s);
 }
 if(catches.length===2){for(const s of catches)finish(m,s,'clashed');}
 else if(catches.length){const s=catches[0];finish(m,s,'caught');beginCapture(m,m.players[s.owner],m.players[s.target],s.context);}
 m.seals=m.seals.filter(s=>s.resolved===null||m.tick-s.resolved<SEAL.visualFrames);
}
export function tryEscapeDash(m,a,b,input,command){const reward=a.sealEscape;if(m.cinematic||m.pressure||input.guard||!reward||!sealConfig(m).dash||m.tick>=reward.expires||a.escapeDash)return false;
 const double=command==='step:forward'||a.commands.double==='forward'&&input.x>.5&&a.prev.x<=.5&&Math.abs(input.z)<.5,attack=input.x>.5&&Math.abs(input.z)<.5&&input.attack&&!a.prev.attack;
 if(!double&&!attack)return false;
 if(a.hp<=0||a.move||a.travel||a.roll||a.jumpSquat||a.getUp||a.knockdown||a.bounce||a.stun>0||a.blockStun>0||a.air>0||a.cool>0&&!a.step)return false;
 const target=m.players[reward.caster],dx=target.x-a.x,dz=target.z-a.z,d=Math.hypot(dx,dz),reach=Math.max(.1,matchFighter(m,a).reach-.05),distance=Math.max(0,d-reach),frames=Math.ceil(distance/SEAL.dashSpeed*60);
 if(a.step)a.step=null;
 a.escapeDash={caster:reward.caster,aimX:dx/(d||1),aimZ:dz/(d||1),distance,travelled:0,frame:0,frames,started:m.tick};delete a.sealEscape;a.commands.double=null;a.frameCommand=null;a.commands.stepTapDirection=null;a.guard=false;a.pendingInput=null;a.buffer=null;a.cool=frames/60;a.anim='run';a.animTime=a.cool;
 const seal=m.seals.find(s=>s.id===reward.seal);if(seal)extendCommit(m,seal,frames+SEAL.punishFrames+2);else if(target.move?.sealId===reward.seal){target.move.total=Math.max(target.move.total,target.move.frame+frames+SEAL.punishFrames+2);target.cool=(target.move.total-target.move.frame)/60;}
 measured(m,'escapeDashStart',{attacker:m.players.indexOf(a),defender:reward.caster,distance,frames});return true;
}
export function advanceEscapeDash(m,a){const s=a.escapeDash;if(!s)return false;const move=Math.min(SEAL.dashSpeed/60,s.distance-s.travelled);if(s.started!==m.tick){moveWithinBounds(a,s.aimX*move,s.aimZ*move,true);s.travelled+=move;s.frame++;}
 a.anim='run';a.guard=false;a.held=0;a.pendingInput=null;a.buffer=null;
 if(s.travelled>=s.distance-1e-8){const caster=m.players[s.caster];a.escapeDash=null;a.cool=0;a.animTime=0;a.sealPunishUntil=m.tick+SEAL.punishFrames;measured(m,'escapeDashEnd',{attacker:m.players.indexOf(a),defender:s.caster,distance:Math.hypot(caster.x-a.x,caster.z-a.z),punishRemaining:caster.move?caster.move.total-caster.move.frame:0});}
 return true;
}
export function visibleSealState(m){return (m.seals||[]).map(s=>({id:s.id,owner:s.owner,target:s.target,x:s.x,z:s.z,radius:s.radius,framesLeft:s.framesLeft,escaped:s.escaped,status:s.status}));}
