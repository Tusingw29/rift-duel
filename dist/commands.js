// Opponent-relative horizontal commands and world-oriented depth commands.
// These windows are Rift Duel tuning, not measured Evil Zone frame data.
export const DOUBLE_TAP_WINDOW = 18;
export const COMMAND_LIFETIME = 18;
export function createCommandState() {
 return {direction:null,last:null,lastTick:-Infinity,double:null,doubleTick:-Infinity,attack:null};
}
export function directionOf(input,face) {
 if(input.z>.5)return 'down';
 if(input.z<-.5)return 'up';
 if(input.x*face>.5)return 'forward';
 if(input.x*face<-.5)return 'back';
 return null;
}
export function readCommand(state,input,previous,face,tick) {
 const direction=directionOf(input,face);
 if(direction&&direction!==state.direction){
  if(direction===state.last&&tick-state.lastTick<=DOUBLE_TAP_WINDOW){state.double=direction;state.doubleTick=tick;}
  else state.double=null;
  state.last=direction;state.lastTick=tick;
 }
 state.direction=direction;
 if(tick-state.doubleTick>COMMAND_LIFETIME)state.double=null;
 const double=state.double;
 if(input.attack&&!previous.attack){
  state.attack=double?({forward:'pursuit',back:'super',down:'launch',up:'jumpAttack'}[double]):({forward:'forward',back:'back',down:'capture',up:'technique'}[direction]||'attack');
  state.double=null;
 }
 if(input.guard&&!previous.guard&&double==='up'){state.double=null;return 'jump';}
 return null;
}
