// OPTIONS-AUDIT fixture runner: deterministic and scored the same way on repeat runs (analysis only).
import test from 'node:test';
import assert from 'node:assert/strict';
import {exchange,verdict,at} from '../scripts/options-audit/lib.mjs';
test('options-audit exchanges are deterministic',()=>{
 const run=()=>exchange({p1:2,p2:3,distance:2,attacker:{option:'strike'},defender:{option:'guard',trigger:at(0)}});
 const a=run(),b=run();assert.deepEqual(a,b);assert.equal(a.result.startsWith('D blocks'),true);
});
test('options-audit scores a hit, a punish and a safe exchange',()=>{
 assert.equal(verdict({result:'A hits (grab)'}),'A');
 assert.equal(verdict({result:'D blocks, D punishes'}),'D');
 assert.equal(verdict({result:'D breaks, safe'}),'=');
 assert.equal(verdict({result:'whiff, safe'}),'=');
});
