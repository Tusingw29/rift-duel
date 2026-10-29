const enabled=new WeakSet();
export const morrowFromSearch=search=>new URLSearchParams(search).get('morrow')==='jab15'?'jab15':'';
export function configureMorrow(m,value){if(value==='jab15')enabled.add(m);return m;}
export function applyMorrowJab(m,p,move){if(enabled.has(m)&&p.id===3&&move.kind==='strike'&&move.chain===1){move.startup=15;move.total=move.startup+move.active+move.recovery;}}
