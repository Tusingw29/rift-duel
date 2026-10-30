// HORIZON-FIX playtest values; heavy damage is base damage before fighter power.
export const MORROW_JABS=Object.freeze({jab13:{startup:13},jab15:{startup:15},jab15heavy:{startup:15,damage:10,pushback:.8}});
const enabled=new WeakMap();
export const morrowFromSearch=search=>{const key=new URLSearchParams(search).get('morrow');return Object.hasOwn(MORROW_JABS,key)?key:'';};
export function configureMorrow(m,value){if(Object.hasOwn(MORROW_JABS,value))enabled.set(m,value);return m;}
export function applyMorrowJab(m,p,move){const v=MORROW_JABS[enabled.get(m)];if(v&&p.id===3&&move.kind==='strike'&&move.chain===1){move.startup=v.startup;move.total=move.startup+move.active+move.recovery;if(v.damage){move.jabDamage=v.damage;move.jabPushback=v.pushback;}}}
