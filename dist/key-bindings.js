export const bindingLabels=['Left','Right','Up / sidestep','Down / sidestep','Attack / charge','Guard','Capture','Launch','Pursuit','Burst'];
export const defaultBindings=()=>[
 ['KeyA','KeyD','KeyW','KeyS','KeyJ','KeyK','KeyU','KeyI','KeyO','KeyL'].map(k=>[k]),
 ['ArrowLeft','ArrowRight','ArrowUp','ArrowDown',...Array.from({length:6},(_,i)=>'Numpad'+(i+1))].map((k,i)=>i<4?[k]:[k,'Digit'+(i-3)])
];
export const allowedKey=code=>typeof code==='string'&&/^(Key[A-Z]|Digit[0-9]|Numpad[0-9]|Arrow(Left|Right|Up|Down)|Space)$/.test(code);
export const keyName=code=>code==='Space'?'Space':code.startsWith('Key')?code.slice(3):code.startsWith('Digit')?code.slice(5):code.replace('Numpad','Num ').replace('Arrow','');
export function normalizeBindings(value){
 const seen=new Set();
 if(!Array.isArray(value)||value.length!==2)return defaultBindings();
 for(const player of value){if(!Array.isArray(player)||player.length!==10)return defaultBindings();for(const keys of player){if(!Array.isArray(keys)||keys.length<1||keys.length>2)return defaultBindings();for(const code of keys){if(!allowedKey(code)||seen.has(code))return defaultBindings();seen.add(code);}}}
 return value.map(player=>player.map(keys=>[...keys]));
}
export function rebind(value,player,action,code){
 if(!allowedKey(code))throw new Error('Choose a letter, number, arrow key, Space, or numeric keypad key.');
 if(![0,1].includes(player)||!Number.isInteger(action)||action<0||action>=10)throw new Error('Unknown control.');
 const next=normalizeBindings(value);
 for(let p=0;p<2;p++)for(let a=0;a<10;a++)if((p!==player||a!==action)&&next[p][a].includes(code))throw new Error(`${keyName(code)} is already assigned to Player ${p+1}: ${bindingLabels[a]}. Change that control first.`);
 next[player][action]=[code];return next;
}
export function touchBinding(code,bindings){const action=defaultBindings()[0].findIndex(keys=>keys.includes(code));return action<0?null:bindings[0][action][0];}
