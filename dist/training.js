const actions=[['attack','ATK'],['guard','GRD'],['capture','CAP'],['launch','LAUNCH'],['pursuit','DASH'],['super','BURST']];
export function inputLabel(input){
 const direction=(input.z<-.5?'↑':input.z>.5?'↓':'')+(input.x<-.5?'←':input.x>.5?'→':'');
 return [direction,...actions.filter(([key])=>input[key]).map(([,label])=>label)].filter(Boolean).join(' + ')||'·';
}
export function recordInput(history,input){
 const label=inputLabel(input);
 if(history[0]?.label===label)history[0].frames++;
 else{history.unshift({label,frames:1});history.length=Math.min(6,history.length);}
 return history;
}
