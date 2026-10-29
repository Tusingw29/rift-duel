import {observeCombat} from '../../dist/skill/observer.js';
import {ringArena,boundaryGap} from '../../dist/arena-bounds.js';
// Measurement thresholds, not collision rules. Count simulation ticks, excluding hitstop repeats.
export const EDGE_BAND=.5,PIN_EPS=.05;
export function arenaObserver(m){const ring=ringArena(m),seen=new WeakSet(),players=m.players.map(()=>({edgeFrames:0,cornerFrames:ring?null:0,pinnedHits:0,pinnedBlocks:0,hitsReceived:0,stepsStarted:0,dashesStarted:0}));let previous=m.tick;
 const dispose=observeCombat(m,e=>{if(!['damage','block'].includes(e.type))return;const p=players[e.defender];if(e.type==='damage')p.hitsReceived++;if(boundaryGap(m.players[e.defender])<=PIN_EPS)p[e.type==='damage'?'pinnedHits':'pinnedBlocks']++;});
 return {dispose,after(){if(m.tick===previous)return;const frames=m.tick-previous;previous=m.tick;m.players.forEach((p,i)=>{if(boundaryGap(p)<=EDGE_BAND)players[i].edgeFrames+=frames;if(!ring&&11-Math.abs(p.x)<=EDGE_BAND&&6-Math.abs(p.z)<=EDGE_BAND)players[i].cornerFrames+=frames;if(p.step&&!seen.has(p.step)){seen.add(p.step);players[i].stepsStarted++;if(p.step.kind==='dash')players[i].dashesStarted++;}});},snapshot(){return {shape:ring?'ring':'rect',edgeBand:EDGE_BAND,pinEpsilon:PIN_EPS,players};}};
}
