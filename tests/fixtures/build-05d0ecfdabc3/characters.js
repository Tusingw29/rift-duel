import {buildAegis} from './aegis-model.js';
import {buildRei} from './rei-model.js';
import {buildTala} from './tala-model.js';
import {buildMorrow} from './morrow-model.js';
import {buildCaster} from './caster-model.js';
// Original roster factories share only the animation attachment contract.
const builders=[buildAegis,buildRei,buildTala,buildMorrow,()=>buildCaster(4),()=>buildCaster(5)];
export function buildCharacter(id,options={}){
 if(!Number.isInteger(id)||!builders[id])throw new RangeError(`Unknown fighter ${id}`);
 return builders[id](options);
}
