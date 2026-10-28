import {tap,threat} from './common.mjs';
export default c=>{const safe=c.rival.move?.phase==='recovery'&&!threat(c);return {guard:!safe,attack:safe&&c.d<c.self.reach&&tap(c.frame,12),x:safe&&c.d>c.self.reach?1:0};};
