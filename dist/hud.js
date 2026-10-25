import {CHARGE_PER_STOCK,MAX_STOCKS,CHARGE_FLOOR_HP,chargeRate} from './combat.js';
// Evil Zone-style fight HUD state: a life bar with a delayed damage trail, a low-life
// warning, and a segmented power gauge that fills while attack is held. Pure helpers
// so the presentation rules can be tested without a browser.
export const LOW_HEALTH=30,CRITICAL_HEALTH=12,TRAIL_DELAY=.18,TRAIL_RATE=400;
export function gaugeState(p){
 const stocks=Math.max(0,Math.min(MAX_STOCKS,p.stocks|0)),partial=stocks<MAX_STOCKS?Math.max(0,Math.min(1,p.charge/CHARGE_PER_STOCK)):0;
 const segments=Array.from({length:MAX_STOCKS},(_,i)=>i<stocks?1:i===stocks?partial:0);
 const charging=p.anim==='charge'&&stocks<MAX_STOCKS;
 // The charge sweep climbs the life bar from the bottom and crystallises when it reaches the life line.
 const life=Math.max(0,Math.min(100,p.hp)),sweep=stocks<MAX_STOCKS?partial*Math.max(CHARGE_FLOOR_HP,life):0;
 return {stocks,segments,partial,charging,full:stocks===MAX_STOCKS,rate:chargeRate(p.hp),sweep:Math.min(sweep,Math.max(life,sweep*(life>0))),life};
}
export function gaugeLabel(state){
 if(state.full)return 'MAX POWER';
 if(state.charging)return `CHARGING ${Math.round(state.partial*100)}%`;
 return state.stocks?`${state.stocks} STOCK${state.stocks>1?'S':''}`:'NO STOCK';
}
export function createTrail(hp=100){return {hp,trail:hp,delay:0,shattered:false};}
// The life bar shatters once when health reaches zero and reforms when the next round or bout refills it.
export function barShatterEvent(t,hp){
 if(hp<=0&&!t.shattered){t.shattered=true;return 'shatter';}
 if(hp>0&&t.shattered){t.shattered=false;return 'reform';}
 return null;
}
// The trail holds for a moment after damage, then drains down to the live value.
export function updateTrail(t,hp,dt){
 if(hp<t.hp){t.delay=TRAIL_DELAY;}
 else if(hp>t.hp){t.trail=hp;}
 t.hp=hp;
 if(t.delay>0)t.delay=Math.max(0,t.delay-dt);
 else t.trail=Math.max(hp,t.trail-TRAIL_RATE*dt);
 return t;
}
export function healthClass(hp){return hp<=0?'empty':hp<CRITICAL_HEALTH?'critical':hp<LOW_HEALTH?'low':'';}

// Gem view of the gauge: each stock is one gem, charge pours into the next one.
export function gemStates(state){
 return state.segments.map((fill,i)=>({fill,lit:fill>=1,filling:state.charging&&i===state.stocks}));
}
// Deterministic shard layout for shatter effects, so tests can check the spread.
export function shardPlan(count=10,seed=1,spread=70){
 let x=seed*9301+49297;const rand=()=>{x=(x*1103515245+12345)%2147483648;return x/2147483648;};
 return Array.from({length:count},(_,i)=>{const angle=(i/count)*Math.PI*2+rand()*.6,distance=spread*(.5+rand()*.7);
  return {dx:Math.cos(angle)*distance,dy:Math.sin(angle)*distance-spread*.3,rot:(rand()-.5)*540,size:6+rand()*10,delay:rand()*.08};});
}

// Every hit breaks the lost chunk of the life gauge off as glass: shards start along
// that chunk and fly inward from the screen edge. Count scales with the damage.
export function damageShards(damage,side='left',seed=1){
 const count=Math.max(4,Math.min(18,Math.round(damage*1.2))),plan=shardPlan(count,seed,55);
 return plan.map((s,i)=>({...s,t:(i+.5)/count,dx:(side==='left'?1:-1)*(20+Math.abs(s.dx)),dy:s.dy+10}));
}
