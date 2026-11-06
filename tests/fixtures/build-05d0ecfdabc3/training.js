import {fighters} from './fighters.js';
import {canChain} from './moves.js';
const actions=[['attack','ATK'],['guard','GRD'],['capture','CAP'],['launch','LAUNCH'],['pursuit','DASH'],['super','BURST']];
export function inputLabel(input){
 // Lock-on inputs: x closes (↑) or retreats (↓), z circles right (→) or left (←).
 const direction=(input.x>.5?'↑':input.x<-.5?'↓':'')+(input.z>.5?'→':input.z<-.5?'←':'');
 return [direction,...actions.filter(([key])=>input[key]).map(([,label])=>label)].filter(Boolean).join(' + ')||'·';
}
export function recordInput(history,input){
 const label=inputLabel(input);
 if(history[0]?.label===label)history[0].frames++;
 else{history.unshift({label,frames:1});history.length=Math.min(6,history.length);}
 return history;
}

// Predictable practice pressure: close distance, complete a basic chain, then pause.
// This returns the same opponent-relative inputs as a human; it never forces hits.
export function comboPracticeInput(match){
 const p=match.players[1],target=match.players[0];
 const input={x:0,z:0,attack:false,guard:false,capture:false,launch:false,pursuit:false,super:false};
 if(p.stun>0||p.air>0||p.move?.chain===3&&p.move.frame>=p.move.startup){match.practiceComboReadyAt=match.tick+45;return input;}
 if(match.tick<(match.practiceComboReadyAt||0))return input;
 if(p.move){if(p.move.kind==='strike'&&canChain(p.move))input.attack=!p.prev.attack;return input;}
 if(p.cool>0)return input;
 if(Math.hypot(p.x-target.x,p.z-target.z)>fighters[p.id].reach-.2)input.x=1;
 else input.attack=!p.prev.attack;
 return input;
}
