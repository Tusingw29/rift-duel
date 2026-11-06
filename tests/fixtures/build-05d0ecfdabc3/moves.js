// Rift Duel balance values, in 60 Hz simulation frames. These are original
// timings, not frame data reverse-engineered from Evil Zone.
import {techniques} from './techniques.js';
export function moveTiming(fighter,kind,chain=1){
 const heavy=fighter.id==='morrow',fast=fighter.id==='tala';
 const hit=Math.max(1,Math.min(3,chain));
 const strike=[null,{startup:heavy?11:fast?9:10,active:3,recovery:heavy?20:fast?16:18},{startup:heavy?16:fast?13:14,active:4,recovery:heavy?26:fast?22:24},{startup:heavy?24:fast?18:21,active:5,recovery:heavy?34:fast?26:30}][hit];
 const table={
  strike,
  shot:{startup: fighter.id==='sol'?7:11,recovery: fighter.id==='sol'?11:18},
  forward:{startup:heavy?24:fast?18:20,active:4,recovery:heavy?32:28},
  back:{startup:heavy?22:18,active:4,recovery:28},
  capture:{startup:13,recovery:40},
  launch:{startup:heavy?24:fast?18:20,active:5,recovery:heavy?34:28},
  pursuit:{startup:7,recovery:30},
  jumpAttack:{startup:9,recovery:25},
  super:{startup:22,active:4,recovery:34},
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
export const INPUT_BUFFER_FRAMES=6;
export const CHAIN_WINDOW_FRAMES=10;
export const chainCancelFrame=move=>move?.cancelFrame??(move?.kind==='strike'?(move.chain===1?14:20):move?.startup);
export function canChain(move){
 return !!move&&!move.reversal&&['strike','shot'].includes(move.kind)&&move.chain<3&&move.connected&&move.frame>=chainCancelFrame(move)&&move.frame<=chainCancelFrame(move)+CHAIN_WINDOW_FRAMES;
}
