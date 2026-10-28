import {copyState,move} from './formulas.js';
// Proposed tuning, not the production baseline. No Vesper stat buff before playtesting control.
export function proposedBalance(base,stage='full'){
 const state=copyState(base);
 Object.assign(state.sys,{blockstun:12,missPenalty:7,splitGuard:true});
 if(stage==='full'){
  Object.assign(state.fighters.rei.stats,{reach:2.85,speed:5.6});
  Object.assign(state.fighters.aegis.stats,{reach:2.5,shotSpeed:14});
  for(let chain=1;chain<=3;chain++)move(state.fighters.aegis,`chain-shot-${chain}`).recovery=14;
 }
 return state;
}
