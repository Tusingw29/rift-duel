import {tap,threat} from './common.mjs';
export default c=>({x:!threat(c)&&c.d>c.self.reach-.3?1:0,guard:threat(c),attack:!threat(c)&&tap(c.frame,12),capture:c.rival.guard&&c.d<3&&tap(c.frame,24)});
