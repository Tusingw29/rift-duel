// SEAL-VISUALS capture: the real game renderer with seal=on,dash. Strip 1: a seal closing on an idle
// training dummy until it catches. Strip 2: local versus, P2 walks out, then the escape cue and dash.
// RIFT_BASE must point at a server whose /dist is this branch.
import {launch,BASE,OUT,PNG,stitch} from './common.mjs';import {writeFileSync} from 'node:fs';
const browser=await launch(),stamp=Date.now(),errors=[],log=[];
const query='move=v2&arena=ring&burst=v2&step=linear&controls=side&seal=on,dash&grab=locked,reach,slow16';
async function open(mode){const p=await browser.newPage({viewport:{width:960,height:600}});p.setDefaultTimeout(240000);p.on('pageerror',e=>errors.push(e.message));
 await p.addInitScript(()=>{localStorage.setItem('rift-options',JSON.stringify({volume:0,music:false,announcer:false,reduced:false,quality:'low'}));let pending,t=0;window.requestAnimationFrame=cb=>{pending=cb;};window.stepFrames=n=>{for(let k=0;k<n;k++){const cb=pending;pending=null;cb?.(t+=1000/60);}};});
 await p.goto(BASE+'/index.html?'+query);await p.waitForFunction(()=>window.riftDebug,null,{polling:200});await p.selectOption('#mode',mode);if(mode==='training')await p.selectOption('#opponent','3');await p.click('#start');for(let n=0;n<120;n++){await p.evaluate(()=>stepFrames(10));const d=await p.evaluate(()=>riftDebug());if(d.phase==='fight'&&d.tick>5)break;}
 await p.addStyleTag({content:'body *{visibility:hidden!important}canvas{visibility:visible!important}'});return p;}
const seal=p=>p.evaluate(()=>{const d=riftDebug();return {s:d.seals[0],tick:d.tick,cin:d.cinematic,ct:d.cinematicTime,cd:d.cinematicDuration,p:d.players.map(x=>({x:+x.x.toFixed(2),z:+x.z.toFixed(2),esc:!!x.sealEscape,dash:!!x.escapeDash}))};});
async function cast(p){await p.keyboard.down('KeyU');await p.evaluate(()=>stepFrames(1));await p.keyboard.up('KeyU');await p.evaluate(()=>stepFrames(1));}
const shot=async(p,label)=>{const b=await p.screenshot();log.push(label+' '+JSON.stringify(await seal(p)));return PNG.sync.read(b);};
try{
 let p=await open('training');await cast(p);const frames=[];
 for(const f of [2,16,30,44,51]){for(let g=0;g<60;g++){const s=(await seal(p)).s;if(!s||54-s.framesLeft>=f)break;await p.evaluate(()=>stepFrames(1));}frames.push(await shot(p,'closing '+f));}
 writeFileSync(`${OUT}/seal-closing-${stamp}.png`,PNG.sync.write(stitch(frames)));
 // Strip 3: the same catch carried on into the seal-bind finish, sampled across the cinematic.
 for(let g=0;g<40&&!(await seal(p)).cin;g++)await p.evaluate(()=>stepFrames(1));const finish=[];
 for(const f of [.08,.3,.5,.62,.7,.9]){for(let g=0;g<200;g++){const c=await seal(p);if(!c.cin||c.ct/c.cd>=f)break;await p.evaluate(()=>stepFrames(1));}finish.push(await shot(p,'finish '+f));}
 writeFileSync(`${OUT}/seal-finish-${stamp}.png`,PNG.sync.write(stitch(finish)));await p.close();
 if(process.env.ONLY!=='finish'){p=await open('local');await cast(p);const esc=[];
 // Walk P2 out of the fixed ring; try directions until the seal reports escaped.
 for(const keys of [['ArrowRight','ArrowUp'],['ArrowRight','ArrowDown'],['ArrowUp'],['ArrowDown']]){
  for(const k of keys)await p.keyboard.down(k);
  for(let n=0;n<10;n++){await p.evaluate(()=>stepFrames(3));if(n===4&&!esc.length)esc.push(await shot(p,'walking '+keys));const s=await seal(p);if(s.s?.status==='escaped'||s.p[1].esc)break;}
  for(const k of keys)await p.keyboard.up(k);if((await seal(p)).p[1].esc)break;}
 esc.push(await shot(p,'escaped'));await p.evaluate(()=>stepFrames(6));esc.push(await shot(p,'cue'));
 // Double-tap toward (P2 faces left): earn the dash.
 for(const k of ['ArrowLeft','ArrowLeft']){await p.keyboard.down(k);await p.evaluate(()=>stepFrames(2));await p.keyboard.up(k);await p.evaluate(()=>stepFrames(2));}
 await p.evaluate(()=>stepFrames(1));esc.push(await shot(p,'dash'));
 writeFileSync(`${OUT}/seal-escape-${stamp}.png`,PNG.sync.write(stitch(esc)));}
}finally{await browser.close();console.log(log.join('\n'));console.log('errors',errors.length,errors.slice(0,3).join(' | '));console.log('stamp',stamp);}
