// A new attack edge requires a release: maximal repeated taps are 30 presses/second.
export default function({frame,random,memory}){if(frame%10===0||!memory.dir)memory.dir={x:random()<.7?1:-1,z:random()<.3?(random()<.5?1:-1):0};return {...memory.dir,attack:frame%2===0,guard:false};}
