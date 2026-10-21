// Original Tala retreat tuning shared by combat, animation and the review.
// Actual collision position travels during wind-up; this is not render-only easing.
export const RETREAT_DISTANCE=1.2;
export function retreatPhase(move,frame=move?.frame||0){
 if(!move?.retreatTravel)return 0;
 return Math.max(0,Math.min(1,(frame-move.startup*.25)/(move.startup*.75)));
}
export function retreatProgress(move,frame=move?.frame||0){const u=retreatPhase(move,frame);return u*u*(3-2*u);}
export function retreatLift(move){return Math.sin(Math.PI*retreatPhase(move))*.16;}
