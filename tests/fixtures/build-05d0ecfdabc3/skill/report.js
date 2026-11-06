export const SKILLED=['spacer','timer','reader'];
export const rate=(wins,n)=>n?wins/n:null;
export function wilson(w,n){if(!n)return [0,1];const z=1.96,p=w/n,d=1+z*z/n,c=(p+z*z/(2*n))/d,r=z*Math.sqrt(p*(1-p)/n+z*z/(4*n*n))/d;return [c-r,c+r];}
export function outcome(matches,bot,opponent,fighter){let n=0,wins=0,draws=0;for(const m of matches){if(!m.completed||!m.bots)continue;const i=m.bots.indexOf(bot);if(i<0||opponent&&!opponent.includes(m.bots[1-i])||fighter&&m.fighters[i]!==fighter)continue;n++;if(m.winner===i)wins++;if(m.winner===-1)draws++;}return {n,wins,draws,rate:rate(wins,n),interval:wilson(wins,n)};}
export function summarize(matches){
 const modes=[...new Set(matches.map(m=>m.mode))],out={matches:matches.length,modes:{},summary:[]};
 for(const mode of modes){const rows=matches.filter(m=>m.mode===mode),bots=[...new Set(rows.flatMap(m=>m.bots||[]))];
  const sanity=Object.fromEntries(bots.filter(b=>b!=='random').map(b=>{const r=outcome(rows,b,['random']);return [b,{...r,trusted:r.interval[0]>.5}];}));
  let n=0,wins=0,draws=0;for(const b of SKILLED){const r=outcome(rows,b,['masher']);n+=r.n;wins+=r.wins;draws+=r.draws;}
  const gap={n,wins,draws,rate:rate(wins,n),margin:n?(wins-(n-wins-draws))/n:null};
  const fighters=Object.fromEntries([...new Set(rows.flatMap(m=>m.fighters))].map(f=>{let n=0,wins=0,draws=0;for(const b of SKILLED){const r=outcome(rows,b,['masher'],f);n+=r.n;wins+=r.wins;draws+=r.draws;}return [f,{n,wins,draws,rate:rate(wins,n)}];}));
  const autopilot=Object.keys(fighters).map(f=>({fighter:f,...outcome(rows,'masher',SKILLED,f)}));
  out.modes[mode]={n:rows.length,gap,sanity,fighters,autopilot,grid:Object.fromEntries(bots.map(a=>[a,Object.fromEntries(bots.filter(b=>b!==a).map(b=>[b,outcome(rows,a,[b])]))]))};
  const untrusted=SKILLED.filter(b=>!sanity[b]?.trusted);
  out.summary.push(n?`${mode}: skilled-policy bots win ${(100*wins/n).toFixed(1)}% (${wins}/${n} completed bouts; ${draws} draws), ${Math.abs(100*gap.margin).toFixed(1)} percentage points ${gap.margin>=0?'ahead of':'behind'} mashing. ${untrusted.length?'Untrusted policies: '+untrusted.join(', ')+'. This does not establish human skill balance.':'All three beat random with a 95% Wilson lower bound above 50%.'}`:`${mode}: no completed skilled-versus-masher bot bouts; human exports are descriptive only (n=${rows.length}).`);
  const auto=autopilot.filter(r=>r.n&&r.interval[0]>.5);out.summary.push(`Autopilot candidates in ${mode}: ${auto.length?auto.map(r=>`${r.fighter} (${r.wins}/${r.n} masher wins against skilled policies)`).join(', '):'none established by a 95% interval'}. These are bot results, not human verdicts.`);
 }
 const a=out.modes.default?.gap,b=out.modes.proposed?.gap;if(a?.n&&b?.n)out.summary.push(`Default → proposed changes skilled-policy win rate by ${(100*(b.rate-a.rate)).toFixed(1)} percentage points (n=${a.n} default, n=${b.n} proposed). Seeds and matchup schedule are paired; this is descriptive, not causal proof about human play.`);
 return out;
}
export function markdown(report){const s=summarize(report.matches);return `# Skill lab\n\n${s.summary.join('\n\n')}\n\n${report.notes?.join('\n\n')||''}\n\n## Bot sanity\n\nBot | Mode | Wins / bouts vs random | Draws | 95% win interval | Trusted\n--- | --- | --- | --- | --- | ---\n${Object.entries(s.modes).flatMap(([mode,v])=>Object.entries(v.sanity).map(([b,r])=>`${b} | ${mode} | ${r.wins}/${r.n} | ${r.draws} | ${r.interval.map(x=>(100*x).toFixed(1)+'%').join('–')} | ${r.trusted?'yes':'NO'}`)).join('\n')}\n\nOpen skill-lab.html with report.json for per-fighter and per-bout metrics. All input and distance frames use 60 Hz; input frames include hitstop, distance frames exclude frozen simulation ticks.\n`;}
export function metricRollups(matches){
 const out=[];
 for(const mode of [...new Set(matches.map(m=>m.mode))])for(const bot of [...new Set(matches.filter(m=>m.mode===mode).flatMap(m=>m.bots||['human / CPU']))]){
  const ps=matches.filter(m=>m.mode===mode).flatMap(m=>m.players.map((p,i)=>({...p,bot:m.bots?.[i]||'human / CPU',seconds:m.seconds}))).filter(p=>p.bot===bot),sum=k=>ps.reduce((n,p)=>n+(p[k]||0),0),presses=sum('attackPresses'),damage=sum('damage'),damaging=ps.filter(p=>p.damage>0);
  out.push({mode,bot,playerBouts:ps.length,attackPresses:presses,damage,damagePerPress:presses?damage/presses:null,whiffs:sum('whiffs'),meleeAttempts:sum('meleeAttempts'),whiffPunishes:sum('whiffPunishes'),punishedWhiffs:sum('punishedWhiffs'),blocks:sum('blocks'),perfectGuards:sum('perfectGuards'),captureBreaks:sum('captureBreaks'),captures:sum('captures'),capturesThroughGuard:sum('capturesThroughGuard'),chipTaken:sum('chipTaken'),meanDominantMoveShare:damaging.length?damaging.reduce((s,p)=>s+p.dominantMoveShare,0)/damaging.length:null,damagingPlayerBouts:damaging.length,distanceFrames:ps.reduce((all,p)=>{for(const [k,v] of Object.entries(p.distanceFrames))all[k]=(all[k]||0)+v;return all;},{}),meanSeconds:sum('seconds')/(ps.length||1)});
 }
 return out;
}

export const VALIDITY=['shotsReceived','shotsGuarded','basicStrikesStarted','directionalSpecialsStarted','punishAttemptsStarted'];
export function validityRollups(matches){return metricRollups(matches).map(({mode,bot,playerBouts})=>{const ps=matches.filter(m=>m.mode===mode).flatMap(m=>m.players.filter((p,i)=>m.bots?.[i]===bot));return {mode,bot,playerBouts,...Object.fromEntries(VALIDITY.map(k=>[k,ps.every(p=>Number.isFinite(p[k]))?ps.reduce((n,p)=>n+p[k],0):null]))};});}
export function captureShare(matches,bot,opponents,winsOnly=false){let damage=0,captureDamage=0,n=0;for(const m of matches){const i=m.bots?.indexOf(bot);if(i==null||i<0||!m.completed||opponents&&!opponents.includes(m.bots[1-i])||winsOnly&&m.winner!==i)continue;const p=m.players[i];n++;damage+=p.damage;captureDamage+=Object.entries(p.damageByMove).filter(([k])=>k.startsWith('system-capture-')).reduce((s,[,v])=>s+v,0);}return {n,damage,captureDamage,share:damage?captureDamage/damage:null};}
