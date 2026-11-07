export const COMMON={movement:'v2',arena:'ring',burst:'v2',step:'linear',cpu:'v2',capturewake:'inv'};
const base={...COMMON,rangedcap:'guard,flat'};
export const MODES=[{name:'baseline',...base},{name:'locked',...base,grab:'locked'},{name:'reach',...base,grab:'locked,reach'},{name:'slow16',...base,grab:'locked,slow16'},{name:'seal',...base,seal:'on'},{name:'dash',...base,seal:'on,dash'},{name:'damage',...base,capdmg:'closehigh'},{name:'full',...COMMON,grab:'locked,reach,slow16',seal:'on,dash',capdmg:'closehigh'}];
