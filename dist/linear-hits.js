import {measured} from './skill/observer.js';
// SIDESTEP-LINEAR playtest guesses. Widths are half-widths measured to defender origin.
export const LINEAR_GUESSES=Object.freeze({strikeWidth:.7,heavyWidth:.9,captureWidth:.8,sidestep:Object.freeze({frames:14,distance:1.8})});
// Only copied into live move data in the preview. No retargeting: tracking keeps the old cone/radial test.
export const TRACKING_MOVES=Object.freeze({
 aegis:[{kind:'strike',chain:2,name:'Strike 2 — reverse cut'}],
 rei:[{kind:'technique',followup:false,name:'Spiral bloom'},{kind:'technique',followup:true,name:'Twin moon'}],
 tala:[{kind:'strike',chain:3,name:'Strike 3 — stepping hook'}],
 morrow:[{kind:'strike',chain:2,name:'Returning Sweep'},{kind:'forward',followup:true,name:'Iron eruption'}],
 sol:[{kind:'technique',followup:false,name:'Solar mantle'},{kind:'technique',followup:true,name:'Solar ward'}],
 vesper:[{kind:'strike',chain:2,name:'Strike 2 — reverse sweep'}]
});
const matches=new WeakSet(),players=new WeakSet();
export const stepFromSearch=search=>new URLSearchParams(search).get('step')==='linear'?'linear':'';
export function configureLinear(m,value){if(value==='linear'){matches.add(m);for(const p of m.players)players.add(p);}return m;}
export const linearHits=m=>matches.has(m);
export const linearStep=p=>players.has(p)?LINEAR_GUESSES.sidestep:null;
export function trackingSpec(id,move){return !move.empowered&&TRACKING_MOVES[id]?.find(s=>s.kind===move.kind&&(s.chain===undefined||s.chain===move.chain)&&(s.followup===undefined||s.followup===!!move.followup));}
export function applyLinearMove(m,id,move){if(!linearHits(m))return;const spec=trackingSpec(id,move);move.tracking=!!spec;move.trackingName=spec?.name||'';move.hitWidth=move.kind==='capture'?LINEAR_GUESSES.captureWidth:move.kind==='strike'&&move.chain<3?LINEAR_GUESSES.strikeWidth:LINEAR_GUESSES.heavyWidth;}
export function lineProjection(a,b,aim){const norm=Math.hypot(aim.aimX,aim.aimZ)||1,dx=aim.aimX/norm,dz=aim.aimZ/norm,x=b.x-a.x,z=b.z-a.z;return {forward:x*dx+z*dz,lateral:x*dz-z*dx};}
export function insideLine(a,b,move,reach,width=move.hitWidth){const p=lineProjection(a,b,move);return p.forward>=0&&p.forward<=reach&&Math.abs(p.lateral)<=width;}
export function meleeContact(m,a,b,move,reach,radial=false,legacyFacing){const d=Math.hypot(b.x-a.x,b.z-a.z),facing=legacyFacing??(d<.01||((b.x-a.x)*move.aimX+(b.z-a.z)*move.aimZ)/d>.55),linear=linearHits(m)&&!move.tracking,inside=linear?insideLine(a,b,move,reach):d<reach&&(radial||facing);measured(m,'meleeCheck',{attacker:m.players.indexOf(a),defender:m.players.indexOf(b),move,inside,tracking:linearHits(m)?!!move.tracking:!!trackingSpec(['aegis','rei','tala','morrow','sol','vesper'][a.id],move),sidestep:b.step?.kind==='sidestep',phase:b.step?.phase});return inside;}
// Keep travelling projectile collision; only clip its sideways overlap to its own fixed flight axis.
export function linearShots(m,shots,move){if(!linearHits(m)||move.kind!=='forward')return shots;for(const p of shots){const n=Math.hypot(p.dx,p.dz)||1;p.linearPath={x:p.x,z:p.z,aimX:p.dx/n,aimZ:p.dz/n,width:LINEAR_GUESSES.heavyWidth};}return shots;}
export function projectileWidth(p,b){return !p.linearPath||Math.abs(lineProjection(p.linearPath,b,p.linearPath).lateral)<=p.linearPath.width;}
