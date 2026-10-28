// BALANCE-LAB page. Reads dist/balance/roster.json (generated from the game modules), lets you tune it, and exports
// the result. All the numbers come from dist/balance/formulas.js, shared with the tests and the hosted Frame Codex.
import {baseState,copyState,STATS,EDITABLE,SYS_KEYS,open,total,onBlock,onHit,damage,chip,ratio,move,chainGap,whiff,scores,budget,playstyle,rosterAverage,fighterList,checks,exportTuning,importTuning,codexTask,changes} from './balance/formulas.js';
const $=id=>document.getElementById(id);
const STORAGE_KEY='rift-balance-lab';
const esc=s=>String(s??'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const same=(a,b)=>JSON.stringify(a)===JSON.stringify(b);
let base,work,sel='tala',tab='tune';

// ---- Persistence (per-viewer convenience; the export file is the durable copy) ----
function save(){try{localStorage.setItem(STORAGE_KEY,JSON.stringify(exportTuning(work)));}catch{}}
function load(){try{const raw=localStorage.getItem(STORAGE_KEY);if(raw)return importTuning(base,JSON.parse(raw)).state;}catch{}return copyState(base);}
const edited=id=>{const f=work.fighters[id];return f.custom||!same(exportTuning({...work,order:[id]}).fighters[id],exportTuning({...base,order:[id]}).fighters[id]);};
function changeCount(){const c=changes(base,work);return c.fighters.length+(c.sys.length?1:0);}

// ---- Rendering ----
const who=f=>`<span class="who" style="--c:${f.color}"><i></i>${esc(f.name)}</span>`;
const adv=v=>v==null?'':`<span class="${v>0?'plus':v>=-2?'even':'minus'}">${v>0?'+':''}${v}</span>`;
function renderHeader(){
 const n=changeCount();
 $('status').textContent=n?`${n} change set${n>1?'s':''} vs code`:'Matches the code';$('status').classList.toggle('edited',!!n);
 for(const b of $('tabs').querySelectorAll('button')){b.setAttribute('aria-current',b.dataset.tab===tab?'page':'false');if(b.dataset.tab==='changes')b.innerHTML='Changes'+(n?`<span class="n">${n}</span>`:'');}
 for(const v of ['tune','balance','matchups','rules','changes'])$('v-'+v).hidden=v!==tab;
}
function renderPick(){
 $('pick').innerHTML=fighterList(work).map(f=>`<button data-id="${f.id}" aria-pressed="${f.id===sel}" style="--c:${f.color}"><i></i>${esc(f.name)}${edited(f.id)?'<span class="dot" title="Changed from code"></span>':''}</button>`).join('');
 $('nf-tpl').innerHTML=fighterList(work).map(f=>`<option value="${f.id}">${esc(f.name)}</option>`).join('');
}
const STAT_UI=[['speed','Speed',3,8,.1],['power','Power',.7,1.4,.01],['reach','Reach',1.5,4,.05],['shotSpeed','Shot spd',5,20,.5]];
function renderIdent(){
 const f=work.fighters[sel],b=base.fighters[sel];
 const rows=STAT_UI.map(([k,l,lo,hi,step])=>{const ch=b&&b.stats[k]!==f.stats[k];return `<div class="stat" style="--c:${f.color}"><span>${l}</span><input type="range" min="${lo}" max="${hi}" step="${step}" value="${f.stats[k]}" data-stat="${k}" aria-label="${l}"><input type="number" step="${step}" value="${f.stats[k]}" data-stat="${k}" class="${ch?'changed':''}" title="${b?'Code: '+b.stats[k]:'New fighter'}" aria-label="${l} value"></div>`;}).join('');
 $('ident').innerHTML=`<div class="toolbar" style="justify-content:space-between"><h2>${who(f)} <small>${esc(f.title||'')}</small></h2><div class="toolbar">${f.custom?`<button class="danger" id="del">Delete fighter</button>`:`<button id="resetf" ${edited(sel)?'':'disabled'}>Reset ${esc(f.name)} to code</button>`}</div></div>
  <div class="ident"><label class="f">Name<input id="i-name" value="${esc(f.name)}" ${f.custom?'':'disabled'}></label><label class="f">Intended playstyle<input id="i-int" value="${esc(f.intended)}" class="${b&&b.intended!==f.intended?'changed':''}"></label><label class="f">Color<input id="i-color" type="color" value="${f.color}"></label></div>
  <div style="display:grid;gap:8px">${rows}</div>`;
}
const COLS=[['startup','Start'],['active','Active'],['recovery','Recov'],['base','Base dmg']];
function renderMoves(){
 const a=document.activeElement,keep=a?.dataset?.move?[a.dataset.move,a.dataset.k]:null;
 const f=work.fighters[sel],b=base.fighters[sel],S=work.sys,w=v=>Math.min(100,v/60*100);
 let h=`<thead><tr><th>Move</th><th>Input</th><th>Frames</th>${COLS.map(c=>`<th>${c[1]}</th>`).join('')}<th>Total</th><th>Dmg</th><th>Chip</th><th>Block</th><th>Hit</th><th>Open</th><th>Ratio</th><th>Range</th><th>Effect</th><th>Beats</th><th>Loses to</th></tr></thead><tbody>`;
 for(const g of [...new Set(f.moves.map(m=>m.group))]){
  h+=`<tr><th class="grp" colspan="17">${g}</th></tr>`;
  for(const m of f.moves.filter(x=>x.group===g)){
   const bm=b&&move(b,m.key),d=damage(f,m),r=ratio(f,m);
   h+=`<tr><td><b>${esc(m.move)}</b><br><small>${esc(m.type)}</small></td><td>${esc(m.input)}</td><td><div class="bar3"><span class="s" style="width:${w(m.startup)}%"></span><span class="a" style="width:${w(m.active)}%"></span><span class="r" style="width:${w(m.recovery)}%"></span></div></td>`+
    COLS.map(([k])=>{const ch=bm&&bm[k]!==m[k];return `<td><input type="number" step="${k==='base'?.5:1}" min="${k==='active'?1:0}" value="${m[k]}" data-move="${m.key}" data-k="${k}" class="${ch?'changed':''}" title="${bm?`Code: ${bm[k]}${m.source?' · '+esc(k==='base'?m.source.damage:k==='active'&&m.source.active?m.source.active:m.source.timing):''}`:'New fighter'}" aria-label="${esc(m.move)} ${k}"></td>`;}).join('')+
    `<td class="num">${total(m)}</td><td class="num">${d.toFixed(1)}</td><td class="num">${chip(S,f,m).toFixed(1)}</td><td class="num">${adv(onBlock(S,m))}</td><td class="num">${adv(onHit(S,m))}</td><td class="num">${open(m)}</td><td class="num">${r==null?'':r.toFixed(2)}</td><td>${esc(m.range)}</td><td class="text">${esc(m.effect)}</td><td class="text">${esc(m.beats)}</td><td class="text">${esc(m.losesTo)}</td></tr>`;
  }
 }
 $('moves').innerHTML=h+'</tbody>';
 if(keep)document.querySelector(`#moves input[data-move="${keep[0]}"][data-k="${keep[1]}"]`)?.focus();
}
function scoreBars(f,avg){return Object.entries(scores(work.sys,f)).map(([k,v])=>`<div class="score" style="--c:${f.color}"><span>${k}</span><div class="bar"><i style="width:${v}%"></i>${avg?`<b style="left:${avg[k]}%"></b>`:''}</div><em>${v}</em></div>`).join('');}
function renderSide(){
 const f=work.fighters[sel],S=work.sys,sc=scores(S,f),avg=rosterAverage(work),bud=budget(sc),F=fighterList(work),mean=Math.round(F.map(x=>budget(scores(S,x))).reduce((a,b)=>a+b,0)/F.length);
 const s1=move(f,'chain-strike-1'),others=F.filter(x=>x!==f),ws=others.map(D=>({w:whiff(S,f,D),p:whiff(S,D,f)}));
 const mine=checks(work).filter(c=>c[2].includes(f.name)||c[1]==='Guard');
 $('side').innerHTML=`<div class="panel"><small>NUMBERS SAY</small><div class="verdict">${playstyle(sc)}</div><small>Intended: ${esc(f.intended)}</small>${scoreBars(f,avg)}<div class="score"><span>Budget</span><div class="bar"><i style="width:${bud}%;background:#eef5ff"></i><b style="left:${mean}%"></b></div><em>${bud}</em></div></div>
  <div class="panel"><small>STRIKE 1 EXCHANGES</small>
   <div class="row2"><span>On hit</span><span>${adv(onHit(S,s1))}</span></div><div class="row2"><span>On block</span><span>${adv(onBlock(S,s1))}</span></div>
   <div class="row2"><span>Chain gap after block</span><span>${chainGap(S,f,1)} frames</span></div>
   <div class="row2"><span>Whiffs punishable on reaction</span><span id="side-whiff">${ws.filter(x=>x.w.verdict==='Reaction punish').length} of ${others.length}</span></div>
   <div class="row2"><span>Can punish rivals on reaction</span><span>${ws.filter(x=>x.p.verdict==='Reaction punish').length} of ${others.length}</span></div></div>
  <div class="panel"><small>CHECKS FOR ${esc(f.name)}</small>${mine.length?mine.map(([s,,t])=>`<div class="row2" style="--sev:${SEV[s]}"><i class="sev"></i><span>${esc(t)}</span></div>`).join(''):'<small>No issues flagged.</small>'}</div>`;
}
const SEV={good:'#6fdca0',warn:'#f3c76a',bad:'#ff8e7a'},SEV_LABEL={good:'Working',warn:'Watch',bad:'Fix'};
function renderBalance(){
 const avg=rosterAverage(work);
 $('cards').innerHTML=fighterList(work).map(f=>{const sc=scores(work.sys,f);return `<article class="panel card" style="--c:${f.color}"><div class="top">${who(f)}<span class="tag">Budget ${budget(sc)}</span></div><div><b>${playstyle(sc)}</b><br><small>Intended: ${esc(f.intended)}</small></div>${scoreBars(f,avg)}</article>`;}).join('');
 $('checks').innerHTML=checks(work).map(([s,a,t,d])=>`<article class="finding" style="--sev:${SEV[s]}"><div class="toolbar"><span class="label">${SEV_LABEL[s]}</span><span class="tag">${a}</span></div><h3>${esc(t)}</h3><small>${esc(d)}</small></article>`).join('');
}
function renderGrid(){
 const F=fighterList(work),g=$('grid');
 g.style.gridTemplateColumns=`110px repeat(${F.length},minmax(100px,1fr))`;g.style.minWidth=(110+F.length*104)+'px';
 g.innerHTML='<div class="h">Whiffs ↓ / punishes →</div>'+F.map(f=>`<div class="h">${who(f)}</div>`).join('')+F.map(A=>`<div class="h">${who(A)}</div>`+F.map(D=>{
  if(A===D)return '<div class="cell self"><b>Mirror</b></div>';
  const gap=+(A.stats.reach-D.stats.reach).toFixed(2),w=whiff(work.sys,A,D);
  return `<div class="cell ${gap>0?'a':gap<0?'d':''} ${w.verdict==='Reaction punish'?'react':''}" data-a="${A.id}" data-d="${D.id}"><b>${gap>0?'+':''}${gap}</b><span>${w.verdict}</span><small>${w.margin>=0?'+':''}${w.margin}f (open ${w.open}, needs ${w.need})</small></div>`;}).join('')).join('');
}
const RULES=[['hitstun','Hit stun','Frames a normal hit freezes the defender.',1],['launchStun','Launch stun','Frames a launcher keeps the defender airborne.',1],['blockstun','Block stun','Frames held guard freezes the defender after blocking.',1],['chip','Chip damage','Share of damage held guard still takes (0.12 = 12%).',.01],['perfectGuard','Perfect guard window','Frames after pressing guard that count as a perfect guard.',1],['captureBreak','Capture break window','Frames after pressing guard that break a capture.',1],['cancel1','Chain cancel, hit 1','Frame of Strike 1 when hit 2 can start on hit or block.',1],['cancel2','Chain cancel, hit 2','Frame of Strike 2 when hit 3 can start.',1],['reaction','Human reaction','Frames a player needs to see a whiff and respond. 15 is about a quarter second. A lab assumption, not a game value.',1],['band','Whiff band','Distance just outside reach where a swing could miss (needs the line 100 change, SPACING-COMMITMENT).',.05]];
function renderRules(){
 const S=work.sys;
 $('rules').innerHTML=RULES.map(([k,l,d,step])=>`<div class="panel"><h3>${l}</h3><small>${d}</small><div class="toolbar"><input type="number" step="${step}" value="${S[k]}" data-sys="${k}" class="${S[k]!==base.sys[k]?'changed':''}" aria-label="${l}"><small>Code: ${base.sys[k]}${base.sources?.[k]?' · '+esc(base.sources[k]):''}</small></div></div>`).join('')+
  `<div class="panel"><h3>Split guard</h3><small>Perfect guard covers strikes only; a capture needs its own read. In the game only behind <code>&amp;guard=split</code> on the SPACING-COMMITMENT branch.</small><label><input type="checkbox" data-sys="splitGuard" ${S.splitGuard?'checked':''}> Turn on</label></div>`;
}
function renderChanges(){$('task').textContent=codexTask(base,work);}
function renderAll(){renderHeader();renderPick();renderIdent();renderMoves();renderSide();renderBalance();renderGrid();renderRules();renderChanges();}
function changed(){save();renderHeader();renderPick();renderMoves();renderSide();renderBalance();renderGrid();renderChanges();}

// ---- Events ----
function wire(){
 $('tabs').onclick=e=>{const b=e.target.closest('button');if(!b)return;tab=b.dataset.tab;history.replaceState(null,'','#'+tab);renderHeader();};
 $('pick').onclick=e=>{const b=e.target.closest('button');if(!b)return;sel=b.dataset.id;renderAll();};
 $('ident').addEventListener('input',e=>{
  const t=e.target,f=work.fighters[sel];
  if(t.dataset.stat){const v=parseFloat(t.value);if(isNaN(v))return;f.stats[t.dataset.stat]=v;document.querySelectorAll(`#ident [data-stat="${t.dataset.stat}"]`).forEach(x=>{if(x!==t)x.value=v;});document.querySelector(`#ident input[type=number][data-stat="${t.dataset.stat}"]`).classList.toggle('changed',!!base.fighters[sel]&&base.fighters[sel].stats[t.dataset.stat]!==v);}
  else if(t.id==='i-name')f.name=t.value.trim().toUpperCase()||'UNNAMED';else if(t.id==='i-int')f.intended=t.value;else if(t.id==='i-color')f.color=t.value;else return;
  changed();
 });
 $('ident').addEventListener('click',e=>{
  if(e.target.id==='resetf'){work.fighters[sel]=copyState(base.fighters[sel]);save();renderAll();toast('Reset to code');}
  if(e.target.id==='del'){if(e.target.dataset.sure){delete work.fighters[sel];work.order=work.order.filter(x=>x!==sel);sel=work.order[0];save();renderAll();toast('Fighter deleted');}else{e.target.dataset.sure='1';e.target.textContent='Click again to delete';}}
 });
 $('moves').addEventListener('change',e=>{
  const t=e.target;if(!t.dataset.move)return;const m=move(work.fighters[sel],t.dataset.move);let v=parseFloat(t.value);
  if(isNaN(v)){t.value=m[t.dataset.k];return;}
  if(t.dataset.k!=='base')v=Math.max(t.dataset.k==='active'?1:0,Math.round(v));
  m[t.dataset.k]=v;changed();
 });
 $('rules').addEventListener('change',e=>{const t=e.target,k=t.dataset.sys;if(!k)return;if(k==='splitGuard')work.sys.splitGuard=t.checked;else{const v=parseFloat(t.value);if(isNaN(v)){t.value=work.sys[k];return;}work.sys[k]=v;}save();renderAll();});
 $('add').onclick=()=>{$('addform').hidden=false;$('nf-name').focus();};
 $('nf-cancel').onclick=()=>{$('addform').hidden=true;};
 $('nf-go').onclick=()=>{
  const name=$('nf-name').value.trim();if(!name){$('nf-name').focus();toast('Give the fighter a name');return;}
  let id=name.toLowerCase().replace(/[^a-z0-9]+/g,'-').replace(/^-|-$/g,'')||'fighter';while(work.fighters[id])id+='-2';
  const tpl=work.fighters[$('nf-tpl').value],f=copyState(tpl);
  Object.assign(f,{id,name:name.toUpperCase(),title:'New fighter',color:$('nf-color').value,custom:true,template:tpl.id,intended:'Copied from '+tpl.name+', not set yet'});
  work.fighters[id]=f;work.order.push(id);sel=id;$('addform').hidden=true;$('nf-name').value='';save();renderAll();toast(`${f.name} created from ${tpl.name}`);
 };
 $('copy').onclick=async()=>{try{await navigator.clipboard.writeText(codexTask(base,work));toast('Copied');}catch{const r=document.createRange();r.selectNodeContents($('task'));const s=getSelection();s.removeAllRanges();s.addRange(r);toast('Text selected, press copy');}};
 $('export').onclick=()=>{const blob=new Blob([JSON.stringify(exportTuning(work),null,1)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(blob);a.download='rift-duel-balance.json';a.click();setTimeout(()=>URL.revokeObjectURL(a.href),1000);};
 $('import').onclick=()=>$('file').click();
 $('file').onchange=async()=>{const file=$('file').files[0];if(!file)return;try{const {state,notes}=importTuning(base,JSON.parse(await file.text()));work=state;if(!work.fighters[sel])sel=work.order[0];save();renderAll();toast(notes.length?`Imported with ${notes.length} note(s): ${notes[0]}`:'Imported');}catch(err){toast('Import failed: '+err.message);}$('file').value='';};
 $('reset').onclick=()=>{$('resetask').hidden=false;};$('reset-no').onclick=()=>{$('resetask').hidden=true;};
 $('reset-yes').onclick=()=>{work=copyState(base);sel='tala';$('resetask').hidden=true;save();renderAll();toast('Everything matches the code again');};
}
let toastTimer;function toast(t){const el=$('toast');el.textContent=t;el.hidden=false;clearTimeout(toastTimer);toastTimer=setTimeout(()=>el.hidden=true,2200);}

// ---- Start ----
(async()=>{
 try{
  const roster=await (await fetch('./balance/roster.json',{cache:'no-store'})).json();
  base=baseState(roster);work=load();
  const h=location.hash.slice(1);if(['tune','balance','matchups','rules','changes'].includes(h))tab=h;
  const q=new URLSearchParams(location.search).get('fighter');if(q&&work.fighters[q])sel=q;
  wire();renderAll();
  // Automation hook for review scripts: read and set values without clicking.
  window.balanceLab={get base(){return base;},get state(){return work;},checks:()=>checks(work),whiff:(a,d)=>whiff(work.sys,work.fighters[a],work.fighters[d]),task:()=>codexTask(base,work),exportTuning:()=>exportTuning(work),
   select(id){sel=id;renderAll();},show(t){tab=t;renderAll();},setMove(id,key,k,v){move(work.fighters[id],key)[k]=v;changed();renderIdent();},reset(){work=copyState(base);save();renderAll();},ready:true};
 }catch(err){$('status').textContent='Could not load dist/balance/roster.json: '+err.message;}
})();
