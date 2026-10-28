// SPACING-COMMITMENT: opt-in rule switches that make spacing and defensive reads carry risk.
// URL: &spacing=band | &spacing=riskyshot, &guard=split. No param = the current game, unchanged.
// The switch is copied onto the match (m.rules.spacing / m.rules.guard) when it is created, so a match
// replays identically regardless of later URL or module state. Default matches carry no extra keys.
//
// Every number below is a PLAYTEST GUESS picked from the frame tables (docs/COMBAT_FRAME_BUDGETS.md),
// not a tuned value. See docs/FRAME_ADVANTAGE.md for what the measurements say about them.
export const SPACING_COMMITMENT={
 // Width of the band just outside a fighter's reach (world units). Guess: about what an average fighter
 // (5.3 u/s) walks during a hit-1 startup + active (13 frames = 1.15 u), rounded down.
 band:1,
 // riskyshot: a neutral shot fired inside that band gets this much extra startup and recovery (frames).
 // Guess: startup lands near a hit-2 startup (11 + 4 = 15; Sol 7 + 4 = 11) and recovery near a hit-3
 // recovery (18 + 12 = 30; Sol 11 + 12 = 23), so a point-blank shot costs about what a committed hit does.
 riskyShot:{startup:4,recovery:12},
 // guard=split: a fresh guard no longer breaks a capture. A capture is broken only by a fresh tap of the
 // capture button, while not guarding, within this many frames before the capture lands (the same
 // 12-frame width the guard break has today, so only the read changes, not the timing difficulty).
 captureTechFrames:12
};
export const SPACING_MODES=['default','band','riskyshot'],GUARD_MODES=['default','split'];
let variant={spacing:'default',guard:'default'};
export function setCombatVariant({spacing,guard}={}){
 variant={spacing:SPACING_MODES.includes(spacing)?spacing:'default',guard:GUARD_MODES.includes(guard)?guard:'default'};
 return variant;
}
export const combatVariant=()=>variant;
// The rules keys a new match carries: only non-default switches, so default matches are unchanged.
export function variantRules(options={}){
 const spacing=SPACING_MODES.includes(options.spacing)?options.spacing:variant.spacing,guard=GUARD_MODES.includes(options.guard)?options.guard:variant.guard,out={};
 if(spacing!=='default')out.spacing=spacing;if(guard!=='default')out.guard=guard;
 return out;
}
export const inBand=(f,d)=>d>=f.reach&&d<f.reach+SPACING_COMMITMENT.band;
// Line 100 of combat.js: what a neutral (unchained) attack press becomes at distance d.
export function neutralAttackKind(rules,f,d){
 if(rules?.spacing==='band')return d<f.reach+SPACING_COMMITMENT.band?'strike':'shot';
 return d<f.reach?'strike':'shot';
}
// riskyshot: the neutral shot fired inside the band is slower to come out and slower to recover.
export function applyRiskyShot(rules,f,d,move){
 if(rules?.spacing!=='riskyshot'||move.kind!=='shot'||move.chain!==1||!inBand(f,d))return false;
 const {startup,recovery}=SPACING_COMMITMENT.riskyShot;
 move.startup+=startup;move.recovery+=recovery;move.total=move.startup+move.active+move.recovery;move.riskyShot=true;
 return true;
}
// guard=split capture tech: the defender tapped capture recently, is not guarding, and is free (or only in the
// capture that tap started).
export function captureTeched(m,b){
 if(m.rules?.guard!=='split'||b.guard||b.stun>0)return false;
 const fresh=m.tick-(b.captureTapTick??-Infinity)<SPACING_COMMITMENT.captureTechFrames;
 return fresh&&(!b.move||b.move.kind==='capture'&&b.move.started>=b.captureTapTick);
}
// Floor marker geometry for training: the current fighter's reach and the band edge, when a spacing switch is on.
export function spacingMarker(rules,f){
 if(!rules?.spacing)return null;
 return {reach:f.reach,edge:f.reach+SPACING_COMMITMENT.band,mode:rules.spacing};
}
