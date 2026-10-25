import test from 'node:test';import assert from 'node:assert/strict';
import {createMatch,update,neutral,hit} from '../dist/combat.js';
const step=(m,i={},n=1)=>{for(let j=0;j<n;j++)update(m,[{...neutral(),...i},neutral()]);};
test('guard never charges; releasing into held attack starts sooner than neutral charge',()=>{
 const a=createMatch(),b=createMatch();step(a,{guard:true,attack:true},30);assert.equal(a.players[0].charge,0);
 step(a,{attack:true},6);step(b,{attack:true},6);assert.ok(a.players[0].charge>0);assert.equal(b.players[0].charge,0);
});
test('release preserves partial charge, capacity caps at three and hit interrupts preparation',()=>{
 const m=createMatch();step(m,{attack:true},40);const p=m.players[0],partial=p.charge;assert.ok(partial>0);step(m);step(m,{},10);assert.equal(p.charge,partial);
 hit(m,m.players[1],p,5);step(m,{attack:true},3);assert.equal(p.held,0);assert.equal(p.charge,partial);
 step(m,{attack:true},500);assert.equal(p.stocks,3);assert.equal(p.charge,0);
});
test('an attack cannot charge during its move and charge delay survives recovery',()=>{
 const m=createMatch();step(m,{attack:true});step(m);const p=m.players[0];assert.ok(p.move);
 while(p.move){step(m,{attack:true});assert.equal(p.charge,0);}
 assert.ok(p.chargeDelay>0);step(m,{attack:true},9);assert.ok(p.charge>0);
});
