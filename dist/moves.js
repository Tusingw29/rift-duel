// Rift Duel balance values, in 60 Hz simulation frames. These are original
// timings, not frame data reverse-engineered from Evil Zone.
import {techniques} from './techniques.js';
export function moveTiming(fighter,kind){
 const heavy=fighter.id==='morrow',fast=fighter.id==='tala';
 const table={
  strike:{startup:heavy?12:fast?5:8,recovery:heavy?21:fast?14:17},
  shot:{startup: fighter.id==='sol'?7:11,recovery: fighter.id==='sol'?11:18},
  forward:{startup:heavy?18:fast?9:13,recovery:heavy?28:22},
  back:{startup:heavy?16:12,recovery:26},
  capture:{startup:13,recovery:40},
  launch:{startup:heavy?15:10,recovery:25},
  pursuit:{startup:7,recovery:30},
  jumpAttack:{startup:9,recovery:25},
  super:{startup:22,recovery:42},
  technique:techniques[fighter.id]
 };
 const timing=table[kind];
 if(!timing)throw new Error(`Unknown move: ${kind}`);
 return {...timing,active:timing.active||1,total:timing.startup+(timing.active||1)+timing.recovery};
}
export function movePhase(move){
 if(!move)return 'ready';
 return move.frame<move.startup?'startup':move.frame<move.startup+(move.active||1)?'contact':'recovery';
}
export const INPUT_BUFFER_FRAMES=8;
export const CHAIN_WINDOW_FRAMES=10;
export function canChain(move){
 return !!move&&!move.reversal&&['strike','shot'].includes(move.kind)&&move.chain<3&&move.connected&&move.frame>=move.startup&&move.frame<=move.startup+CHAIN_WINDOW_FRAMES;
}
