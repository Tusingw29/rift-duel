// Preview configuration lives outside simulation state: tell cannot alter a replay.
export const GRAB_OPTIONS=Object.freeze(['slow','tell','deliberate','fresh']);
const configs=new WeakMap(),empty=Object.freeze({});
export function parseGrabOptions(value=''){const names=typeof value==='string'?value.split(',').map(s=>s.trim()).filter(Boolean):Object.keys(value||{}).filter(k=>value[k]);for(const name of names)if(!GRAB_OPTIONS.includes(name))throw Error('Unknown grab option: '+name);return Object.freeze(Object.fromEntries(names.map(n=>[n,true])));}
export function configureGrab(m,value){const options=parseGrabOptions(value);if(Object.keys(options).length)configs.set(m,options);return m;}
export const grabOptions=m=>configs.get(m)||empty;
export const grabFromSearch=search=>parseGrabOptions(new URLSearchParams(search).get('grab')||'');
export function applyGrabTiming(m,move){if(move?.kind==='capture'&&grabOptions(m).slow){move.startup=18;move.total=move.startup+move.active+move.recovery;}}
export function grabControlsHTML(html,options){return options.deliberate?html.replaceAll('U or D + tap J','U only (dedicated capture)').replaceAll('X / Square or right + A','X / Square only').replace('TWO BUTTONS. MANY POSSIBILITIES.','DELIBERATE CAPTURE PREVIEW.'):html;}
