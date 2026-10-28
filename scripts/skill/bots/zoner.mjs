import {tap,threat} from './common.mjs';
export default c=>({x:c.d<5?-1:c.d>8?1:0,attack:tap(c.frame,20),guard:threat(c),super:c.d>4&&c.self.stocks>0&&tap(c.frame,180)});
