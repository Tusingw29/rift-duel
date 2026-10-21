import {CHARGE_PER_STOCK,MAX_STOCKS,chargeRate} from './combat.js';
// Evil Zone-style fight HUD state: a life bar with a delayed damage trail, a low-life
// warning, and a segmented power gauge that fills while attack is held. Pure helpers
// so the presentation rules can be tested without a browser.
export const LOW_HEALTH=30,CRITICAL_HEALTH=12,TRAIL_DELAY=.6,TRAIL_RATE=45;
export function gaugeState(p){
 const stocks=Math.max(0,Math.min(MAX_STOCKS,p.stocks|0)),partial=stocks<MAX_STOCKS?Math.max(0,Math.min(1,p.charge/CHARGE_PER_STOCK)):0;
 const segments=Array.from({length:MAX_STOCKS},(_,i)=>i<stocks?1:i===stocks?partial:0);
 const charging=p.anim==='charge'&&stocks<MAX_STOCKS;
 return {stocks,segments,partial,charging,full:stocks===MAX_STOCKS,rate:chargeRate(p.hp)};
}
export function gaugeLabel(state){
 if(state.full)return 'MAX POWER';
 if(state.charging)return `CHARGING ×${state.rate.toFixed(1)}`;
 return state.stocks?`${state.stocks} STOCK${state.stocks>1?'S':''}`:'NO STOCK';
}
export function createTrail(hp=100){return {hp,trail:hp,delay:0};}
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
