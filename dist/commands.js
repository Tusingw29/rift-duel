import {GRAB_HOLD_FRAMES} from './grab-options.js';
// Lock-on commands: x is toward (+) or away (-) from the rival, z is the circling
// direction (+ right, - left), so inputs never flip when fighters swap sides.
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
export function readCommand(state,input,previous,face,tick,options={}) {
 const direction=directionOf(input,face);
 let stepDirection=null;
 if(options.steps){
  const busy=['attack','guard','capture','launch','pursuit','super','circle','crossover'].some(k=>input[k]||previous[k]);
  if(busy)state.stepTapDirection=null;
  else if(direction&&direction!==state.direction){
   if(state.stepTapDirection===direction&&tick-state.stepTapTick<=DOUBLE_TAP_WINDOW){stepDirection=direction;state.stepTapDirection=null;}
   else{state.stepTapDirection=direction;state.stepTapTick=tick;}
  }
 }
 if(options.hold){if(direction==='down'){if(state.direction!=='down'||state.downSince===undefined)state.downSince=tick;}else delete state.downSince;}
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
  if((options.deliberate||options.hold&&tick-state.downSince<GRAB_HOLD_FRAMES)&&state.attack==='capture')state.attack='attack';
  state.double=null;
 }
 if(input.guard&&!previous.guard&&double==='up'){state.double=null;return 'jump';}
 return stepDirection?'step:'+stepDirection:null;
}
