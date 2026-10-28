import {proposedBalance} from './balance/presets.js';
import {exportTuning} from './balance/formulas.js';
import {baseState} from './balance/formulas.js';
import {validateBalance} from './balance-runtime.js';
export async function loadBalancePreview(search,storage,fetcher=fetch){
 const mode=new URLSearchParams(search).get('balance');
 if(!['local','proposed','rules'].includes(mode))return {balance:null,message:''};
 try{
  const text=mode==='local'?storage.getItem('rift-balance-lab'):'{}';if(!text)throw Error('No saved tuning. Open the balance lab on this same address and save an edit first.');
  if(text.length>250000)throw Error('Tuning file exceeds 250 KB.');
  const response=await fetcher('./balance/roster.json',{cache:'no-store'});if(!response.ok)throw Error('Cannot load the code baseline.');
  const base=baseState(await response.json());
  const balance=validateBalance(mode==='local'?JSON.parse(text):exportTuning(proposedBalance(base,mode==='rules'?'rules':'full')),base);
  return {balance,message:'TUNED VALUES · '+(mode==='local'?'local preview':mode==='rules'?'game-wide proposal':'full balance proposal')};
 }catch(e){return {balance:null,message:'TUNING NOT APPLIED · '+e.message,error:true};}
}
export function showBalancePreview(preview){
 if(!preview.message)return;
 const bar=document.createElement('div');bar.id='balance-preview-status';bar.setAttribute('role','status');
 Object.assign(bar.style,{position:'fixed',bottom:'42px',left:'8px',right:'8px',zIndex:'100',padding:'8px 12px',background:'#19212ef2',color:preview.error?'#ffb3a8':'#ffe295',font:'bold 13px system-ui',border:'1px solid currentColor'});
 bar.append(document.createTextNode(preview.message+' · '));
 const lab=document.createElement('a');lab.href='./balance-lab.html';lab.textContent='Balance lab';lab.style.color='inherit';bar.append(lab,document.createTextNode(' · '));
 const reset=document.createElement('a'),url=new URL(location.href);url.searchParams.delete('balance');reset.href=url.href;reset.textContent='Use normal rules';reset.style.color='inherit';bar.append(reset);document.body.append(bar);
}
