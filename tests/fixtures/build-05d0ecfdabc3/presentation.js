// Round ceremony: versus card, round call, fight call, then a held KO moment before the
// result screen. Pure state so the timing can be tested without a browser.
export const INTRO_STAGES=[['versus',1.15],['round',.85],['fight',.55]];
export const REDUCED_INTRO_STAGES=[['versus',.6],['round',.5],['fight',.4]];
export const KO_SECONDS=1.7,REDUCED_KO_SECONDS=.9,KO_TIME_SCALE=.3;
export function createFlow({training=false,reduced=false,round=1,names=['','']}={}){
 const stages=training?[]:(reduced?REDUCED_INTRO_STAGES:INTRO_STAGES);
 return {state:training?'fight':'intro',stage:-1,t:0,round,names,stages,reduced,result:null,started:false,emitted:false};
}
function calloutFor(flow,stage){
 if(stage==='versus')return {type:'callout',kind:'versus',text:`${flow.names[0]}  VS  ${flow.names[1]}`};
 if(stage==='round')return {type:'callout',kind:'round',text:`ROUND ${flow.round}`,say:`Round ${flow.round}`};
 return {type:'callout',kind:'fight',text:'FIGHT',say:'Fight'};
}
// Advances the ceremony and returns the cues that fire during this tick.
export function advanceFlow(flow,dt){
 const cues=[];
 if(flow.state==='intro'){
  if(flow.stage<0){flow.stage=0;cues.push(calloutFor(flow,flow.stages[0][0]));}
  flow.t+=dt;
  while(flow.state==='intro'&&flow.t>=flow.stages[flow.stage][1]){
   flow.t-=flow.stages[flow.stage][1];flow.stage++;
   if(flow.stage>=flow.stages.length){flow.state='fight';flow.t=0;cues.push({type:'fight'});}
   else cues.push(calloutFor(flow,flow.stages[flow.stage][0]));
  }
 }else if(flow.state==='ko'){
  flow.t+=dt;
  if(flow.t>=flow.duration){flow.state='done';cues.push({type:'done',result:flow.result});}
 }
 return cues;
}
export function beginKO(flow,{winner,loser,reason='ko'}){
 flow.state='ko';flow.t=0;flow.duration=flow.reduced?REDUCED_KO_SECONDS:KO_SECONDS;flow.result={winner,loser,reason};
 const text=reason==='time'?'TIME':reason==='draw'?'DRAW':'K.O.';
 return {type:'callout',kind:reason==='ko'?'ko':'time',text,say:reason==='ko'?'K O':text.toLowerCase()};
}
export function introProgress(flow){
 if(flow.state!=='intro')return 1;
 const total=flow.stages.reduce((sum,[,seconds])=>sum+seconds,0);
 const elapsed=flow.stages.slice(0,Math.max(0,flow.stage)).reduce((sum,[,seconds])=>sum+seconds,0)+flow.t;
 return Math.min(1,elapsed/total);
}
export function timeScale(flow){return flow.state==='ko'?KO_TIME_SCALE:flow.state==='intro'?0:1;}
export function simulationRuns(flow){return flow.state==='fight';}
export function cameraCue(flow){
 if(flow.state==='intro')return {kind:'intro',progress:introProgress(flow)};
 if(flow.state==='ko'||flow.state==='done')return {kind:'ko',progress:flow.state==='done'?1:Math.min(1,flow.t/flow.duration),duration:flow.duration,...flow.result};
 return null;
}
