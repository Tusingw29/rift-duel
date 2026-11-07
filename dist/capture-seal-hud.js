// Temporary rules readout only. Claude owns the world-space seal and animation.
export function createSealHud(enabled){if(!enabled)return ()=>{};const el=document.createElement('div');el.id='seal-preview-status';el.setAttribute('role','status');el.style.cssText='position:fixed;left:50%;bottom:16%;transform:translateX(-50%);z-index:100;background:#121722ee;color:#ffdc86;padding:8px 14px;max-width:85vw;text-align:center;font:14px system-ui;pointer-events:none';document.body.append(el);
 return m=>{if(!m||m.phase!=='fight'){el.hidden=true;return;}const s=m.seals?.find(s=>s.status==='closing'),r=m.players[0].sealEscape,d=m.players[0].escapeDash;el.hidden=!s&&!r&&!d;
 el.textContent=d?'ESCAPE DASH — prepare your strike':r&&r.expires>m.tick?'SEAL ESCAPED — double-tap toward, or toward + Attack':s?`${s.target===0?'SEAL ON YOU — move out':'SEAL CAST — committed'} · ${(s.framesLeft/60).toFixed(1)}s`:'';if(!el.textContent)el.hidden=true;};
}
