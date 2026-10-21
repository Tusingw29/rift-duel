import test from 'node:test';import assert from 'node:assert/strict';import {talaFootOffsets} from '../dist/tala-footwork.js';
test('a repeated hit starts from the existing catch and long stuns hold until recovery',()=>{
 const r={};talaFootOffsets(r,{animTime:.42},'hurt');const caught=talaFootOffsets(r,{animTime:.24},'hurt')[1];const hitAgain=talaFootOffsets(r,{animTime:.85},'hurt')[1];assert.ok(caught.distanceTo(hitAgain)<1e-9);const hold=talaFootOffsets(r,{animTime:.4},'hurt')[1];assert.equal(hold.z,-.2);assert.equal(hold.y,0);const finish=talaFootOffsets(r,{animTime:0},'hurt')[1];assert.equal(finish.length(),0);talaFootOffsets(r,{},'idle');assert.equal(r.recoilStep,null);
});
