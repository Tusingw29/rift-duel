import {normalizeBindings} from './key-bindings.js';
const actions=['attack','guard','capture','launch','pursuit','super'];
const neutral=()=>({x:0,z:0,...Object.fromEntries(actions.map(k=>[k,false]))});
const same=(a,b)=>a.x===b.x&&a.z===b.z&&actions.every(k=>a[k]===b[k]);
export const MAX_INPUT_STATES=64;
// Preserve key transitions between animation frames. Each player drains their
// own ordered snapshots, one per simulation tick, so short taps cannot vanish.
export function createKeyboardInput(bindings){
 let maps=normalizeBindings(bindings),codes=new Set(maps.flat(2));
 const pressed=new Set(),queues=[[],[]],latest=[neutral(),neutral()],current=[neutral(),neutral()];
 function snapshot(p){
  const map=maps[p],i=neutral(),held=n=>map[n].some(code=>pressed.has(code));
  i.x=Number(held(1))-Number(held(0));
  i.z=Number(held(3))-Number(held(2));
  actions.forEach((k,n)=>i[k]=held(n+4));
  return i;
 }
 function change(code,down){
  if(!codes.has(code)||pressed.has(code)===down)return;
  if(down)pressed.add(code);else pressed.delete(code);
  for(let p=0;p<2;p++){
   const state=snapshot(p);if(same(state,latest[p]))continue;
   latest[p]=state;
   // An extreme event flood resynchronizes rather than retaining stale holds.
   if(queues[p].length>=MAX_INPUT_STATES)queues[p].length=0;
   queues[p].push(state);
  }
 }
 return {
  configure(bindings){maps=normalizeBindings(bindings);codes=new Set(maps.flat(2));this.clear();},
  has(code){return codes.has(code);},
  add(code){change(code,true);},
  delete(code){change(code,false);},
  clear(){pressed.clear();for(let p=0;p<2;p++){queues[p].length=0;latest[p]=neutral();current[p]=neutral();}},
  read(p){if(queues[p].length)current[p]=queues[p].shift();return {...current[p]};},
  pending(p){return queues[p].length;}
 };
}
