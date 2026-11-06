import {createMatch,update,neutral,hit,STEP} from './combat.js';
import {canChain} from './moves.js';
// Deterministic scripted scenarios for the local sandbox and its tests. A recipe places both
// fighters, then supplies both players' inputs for every simulation frame; scrubbing to frame N
// means replaying N frames from the reset, which is exact because the simulation is fixed-step.
const tap=(frames,input)=>f=>frames.includes(f)?input:{};
const combo=limit=>(f,m)=>f===0||m.players[0].move?.chain<limit&&canChain(m.players[0].move)&&!m.players[0].prev.attack?{attack:true}:{};
export const RECIPES={
 idle:{distance:3,p1:()=>({})},
 // TALA-IMPORT-AB comparison scenarios: identical inputs, timing and opponent placement for the Authored and Imported runs.
 'ab-advance-guard':{distance:6,frames:90,p1:f=>f<36?{x:1}:f<46?{}:{guard:true}},
 'ab-retreat-attack':{distance:3,frames:100,p1:f=>f<36?{x:-1}:f===46?{attack:true}:{}},
 'ab-circle-left-guard':{distance:3,frames:90,p1:f=>f<40?{z:1}:f<48?{}:{guard:true}},
 'ab-circle-right-guard':{distance:3,frames:90,p1:f=>f<40?{z:-1}:f<48?{}:{guard:true}},
 // Guard is pressed only once Tala is rising or standing again (a guard press while airborne would be an air recovery).
 'ab-knockdown-getup-guard':{distance:2,frames:180,p2:f=>f===0?{z:1}:f===3?{z:1,attack:true}:{},p1:(f,m)=>{const a=m.players[0];return {guard:a.anim==='getUp'||f>60&&!a.air&&!a.launched&&!a.bounce&&!a.knockdown&&a.anim==='idle'};}},
 'ab-advance-hit':{distance:6,frames:100,p1:()=>({x:1}),p2:(f,m)=>{const a=m.players[0],b=m.players[1];return Math.hypot(a.x-b.x,a.z-b.z)<2.6&&!b.move&&!b.prev.attack&&f<60?{attack:true}:{};}},
 'ab-advance-strike-hitstop':{distance:5,frames:110,p1:(f,m)=>{const a=m.players[0],b=m.players[1],d=Math.hypot(a.x-b.x,a.z-b.z);return a.move||a.prev.attack?{}:d>2.1&&f<40?{x:1}:f<60?{attack:true}:{};}},
 approach:{distance:5,p1:()=>({x:1})},
 retreat:{distance:2.5,p1:()=>({x:-1})},
 circle:{distance:3,p1:()=>({z:1})},
 'circle-step':{distance:2,p1:tap([0],{x:1,guard:true})},
 pursuit:{distance:3.5,p1:tap([0],{pursuit:true})},
 crossover:{distance:2,p1:f=>f===0?{z:-1}:f===2?{z:-1,attack:true}:{}},
 strike1:{distance:2,p1:tap([0],{attack:true})},
 strike2:{distance:2,p1:combo(2)},
 strike3:{distance:2,p1:combo(3)},
 launch:{distance:2,p1:f=>f===0?{z:1}:f===3?{z:1,attack:true}:{}},
 capture:{distance:2,p1:tap([0],{capture:true})},
 burst:{distance:3,stocks:3,p1:f=>f===0?{x:-1}:f===3?{x:-1,attack:true}:{}},
 charge:{distance:4,p1:()=>({attack:true})},
 guard:{distance:2,p1:()=>({guard:true})},
 recoil:{distance:2,p2:tap([0],{attack:true})},
 // The guard is held well before contact, so this is an ordinary block, not the fresh-guard perfect deflect.
 'guard-hit':{distance:2,p1:()=>({guard:true}),p2:tap([20],{attack:true})},
 stagger:{distance:2,setup:m=>{for(let i=0;i<4;i++)hit(m,m.players[1],m.players[0],6);}},
 'stagger-recover':{distance:2,setup:m=>{for(let i=0;i<4;i++)hit(m,m.players[1],m.players[0],6);},p1:f=>f===6?{z:-1}:f===7?{z:1}:f===8?{z:-1}:{}},
 // Third-hit reversal (EZ-04): the defender settles into guard first (a guard fresher than .2 s deflects instead),
 // the attacker chains three basic strikes tapping each as the previous reaches its connected cancel window, and the defender re-taps
 // guard two frames before the third strike lands.
 reversal:{distance:1.7,p1:(f,m)=>{const a=m.players[1].move;return {guard:!(a?.chain===3&&a.frame===a.startup-2)};},p2:(f,m)=>{const a=m.players[1].move;return f===12||(a&&canChain(a)&&!m.players[1].prev.attack)?{attack:true}:{};}},
};
export function createScenario(name,p1=2,p2=1,options={}){
 const recipe=RECIPES[name]||RECIPES.idle,m=createMatch(p1,p2,'training','normal',options);
 m.players[0].x=0;m.players[0].z=0;m.players[1].x=recipe.distance??3;m.players[1].z=0;
 for(const p of m.players){p.lookX=p===m.players[0]?1:-1;p.lookZ=0;p.face=p===m.players[0]?1:-1;}
 if(recipe.stocks)m.players[0].stocks=recipe.stocks;
 recipe.setup?.(m);
 return {m,recipe,frame:0};
}
export function stepScenario(s){
 s.frame++;const f=s.m.tick,inputs=[{...neutral(),...(s.recipe.p1?.(f,s.m)||{})},{...neutral(),...(s.recipe.p2?.(f,s.m)||{})}];
 update(s.m,inputs,STEP);return s.m;
}
// Replay a scenario to an exact frame from its reset; used by the slider and the determinism tests.
export function scenarioAt(name,frame,p1,p2){const s=createScenario(name,p1,p2);for(let i=0;i<frame;i++)stepScenario(s);return s;}
export const snapshot=p=>({x:+p.x.toFixed(4),z:+p.z.toFixed(4),hp:p.hp,anim:p.anim,animTime:+(p.animTime||0).toFixed(4),air:+(p.air||0).toFixed(4),move:p.move?{kind:p.move.kind,frame:p.move.frame,chain:p.move.chain||null,startup:p.move.startup}:null,travel:p.travel?{kind:p.travel.kind,frame:p.travel.frame,frames:p.travel.frames}:null,stagger:p.stagger??0,staggered:!!p.staggerState,stun:+(p.stun||0).toFixed(4),guard:!!p.guard});
