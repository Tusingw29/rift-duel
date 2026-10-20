import test from 'node:test';
import assert from 'node:assert/strict';
import {createKeyboardInput,MAX_INPUT_STATES} from '../dist/keyboard-input.js';
import {createMatch,update,neutral} from '../dist/combat.js';
const tick=(m,k,n=1)=>{for(let j=0;j<n;j++)update(m,[k.read(0),k.read(1)]);};
test('a complete attack tap between rendered frames survives as press then release',()=>{
 const k=createKeyboardInput(),m=createMatch();k.add('KeyJ');k.delete('KeyJ');
 tick(m,k);assert.equal(m.players[0].move,null);
 tick(m,k);assert.equal(m.players[0].move.kind,'shot');
 tick(m,k,12);assert.equal(m.projectiles.length,1);
});
test('two quick directional taps in one event batch select the special follow-up',()=>{
 const k=createKeyboardInput(),m=createMatch();
 k.add('KeyD');k.add('KeyJ');k.delete('KeyJ');k.add('KeyJ');k.delete('KeyJ');k.delete('KeyD');
 tick(m,k,6);assert.equal(m.players[0].move.kind,'forward');assert.equal(m.players[0].move.followup,true);
});
test('direction press and release ordering preserves double-tap pursuit',()=>{
 const k=createKeyboardInput(),m=createMatch();
 k.add('KeyD');k.delete('KeyD');k.add('KeyD');k.add('KeyJ');k.delete('KeyJ');k.delete('KeyD');
 tick(m,k,6);assert.equal(m.players[0].move.kind,'pursuit');
});
test('players drain independently so simultaneous taps still trade',()=>{
 const k=createKeyboardInput(),m=createMatch(0,0);m.players[1].x=-2;
 k.add('KeyJ');k.add('Digit1');k.delete('KeyJ');k.delete('Digit1');
 tick(m,k,10);assert.equal(m.players[0].hp,94);assert.equal(m.players[1].hp,94);
});
test('held input persists without events; repeated keydown does not create extra presses',()=>{
 const k=createKeyboardInput(),m=createMatch();k.add('KeyJ');
 for(let j=0;j<100;j++)k.add('KeyJ');assert.equal(k.pending(0),1);
 tick(m,k,130);assert.equal(m.players[0].stocks,2);
 k.delete('KeyJ');tick(m,k);assert.equal(m.players[0].move,null);
});
test('aliases remain held until both keys release and unrelated keys add no input',()=>{
 const k=createKeyboardInput();k.add('Digit1');k.add('Numpad1');k.delete('Digit1');
 assert.equal(k.pending(1),1);assert.equal(k.read(1).attack,true);
 k.delete('Numpad1');assert.equal(k.read(1).attack,false);
 k.add('Enter');k.add('KeyZ');assert.equal(k.pending(0),0);
});
test('pause/reset clears queued transitions; output snapshots cannot mutate stored input',()=>{
 const k=createKeyboardInput();k.add('KeyJ');k.delete('KeyJ');k.clear();
 assert.deepEqual(k.read(0),neutral());assert.equal(k.pending(0),0);
 k.add('KeyD');const state=k.read(0);state.x=-1;assert.equal(k.read(0).x,1);
});
test('event floods stay bounded and eventually resynchronize to the released state',()=>{
 const k=createKeyboardInput();for(let j=0;j<2000;j++){k.add('KeyJ');k.delete('KeyJ');}
 assert.ok(k.pending(0)<=MAX_INPUT_STATES);for(let j=0;j<=MAX_INPUT_STATES;j++)k.read(0);
 assert.deepEqual(k.read(0),neutral());assert.equal(k.pending(1),0);
});
