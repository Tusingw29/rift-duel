const actions=['attack','guard','capture','launch','pursuit','super'];
const maps=[
 ['KeyA','KeyD','KeyW','KeyS','KeyJ','KeyK','KeyU','KeyI','KeyO','KeyL'],
 ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown','Numpad1','Numpad2','Numpad3','Numpad4','Numpad5','Numpad6']
];
const codes=new Set([...maps.flat(),...actions.map((_,n)=>'Digit'+(n+1))]);
const neutral=()=>({x:0,z:0,...Object.fromEntries(actions.map(k=>[k,false]))});
const same=(a,b)=>a.x===b.x&&a.z===b.z&&actions.every(k=>a[k]===b[k]);
export const MAX_INPUT_STATES=64;
// Preserve key transitions between animation frames. Each player drains their
// own ordered snapshots, one per simulation tick, so short taps cannot vanish.
export function createKeyboardInput(){
 const pressed=new Set(),queues=[[],[]],latest=[neutral(),neutral()],current=[neutral(),neutral()];
 function snapshot(p){
  const map=maps[p],i=neutral();
  i.x=Number(pressed.has(map[1]))-Number(pressed.has(map[0]));
  i.z=Number(pressed.has(map[3]))-Number(pressed.has(map[2]));
  actions.forEach((k,n)=>i[k]=pressed.has(map[n+4])||!!(p&&pressed.has('Digit'+(n+1))));
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
  add(code){change(code,true);},
  delete(code){change(code,false);},
  clear(){pressed.clear();for(let p=0;p<2;p++){queues[p].length=0;latest[p]=neutral();current[p]=neutral();}},
  read(p){if(queues[p].length)current[p]=queues[p].shift();return {...current[p]};},
  pending(p){return queues[p].length;}
 };
}
