// Canonical 17-bone fighter rig shared by every model and animator. Any GLB or procedural rig
// is mapped onto these names on load, so no character needs a special-case flag.
export const RIG_BONES=['root','chest','head','upper_arm.L','forearm.L','hand.L','thigh.L','shin.L','upper_arm.R','forearm.R','hand.R','thigh.R','shin.R','ponytail','sash','foot.L','foot.R'];
export const RIG_PARENT={root:null,chest:'root',head:'chest',ponytail:'head',sash:'root','upper_arm.L':'chest','forearm.L':'upper_arm.L','hand.L':'forearm.L','upper_arm.R':'chest','forearm.R':'upper_arm.R','hand.R':'forearm.R','thigh.L':'root','shin.L':'thigh.L','foot.L':'shin.L','thigh.R':'root','shin.R':'thigh.R','foot.R':'shin.R'};
// Rest pose: limbs hang straight down, the body faces +Z, X is the fighter's right, Y is up.
// Aliases cover the builder's suffix spelling, the extended humanoid vocabulary (Hips, Spine, Neck,
// Shoulder, UpperArm, LowerArm, UpperLeg, LowerLeg) and Mixamo-style names. Bones with no counterpart
// in the game rig (shoulders, neck, spine segments) fold into their nearest canonical parent.
const ALIASES={
 hips:'root',pelvis:'root',root:'root',spine:'chest',spine1:'chest',spine2:'chest',chest:'chest',upperchest:'chest',neck:'head',head:'head',
 'shoulder.l':'chest','shoulder.r':'chest',leftshoulder:'chest',rightshoulder:'chest',
 'upperarm.l':'upper_arm.L','upperarm.r':'upper_arm.R',leftarm:'upper_arm.L',rightarm:'upper_arm.R','upper_arm.l':'upper_arm.L','upper_arm.r':'upper_arm.R',
 'lowerarm.l':'forearm.L','lowerarm.r':'forearm.R',leftforearm:'forearm.L',rightforearm:'forearm.R','forearm.l':'forearm.L','forearm.r':'forearm.R',
 'hand.l':'hand.L','hand.r':'hand.R',lefthand:'hand.L',righthand:'hand.R',
 'upperleg.l':'thigh.L','upperleg.r':'thigh.R',leftupleg:'thigh.L',rightupleg:'thigh.R','thigh.l':'thigh.L','thigh.r':'thigh.R',
 'lowerleg.l':'shin.L','lowerleg.r':'shin.R',leftleg:'shin.L',rightleg:'shin.R','shin.l':'shin.L','shin.r':'shin.R',
 'foot.l':'foot.L','foot.r':'foot.R',leftfoot:'foot.L',rightfoot:'foot.R',
 ponytail:'ponytail',hair:'ponytail',sash:'sash',cloth:'sash'
};
// Normalise a bone name from any source to the canonical name, or null when it is not part of the rig.
export function canonicalBone(name){
 if(!name)return null;
 let key=String(name).replace(/^mixamorig:?/i,'').replace(/^(concept|v3)-/,'').trim();
 // "upper_armL" / "upper_arm_L" / "UpperArm_L" / "UpperArm.L" all become "<base>.l".
 key=key.replace(/[._\s]?([LR])$/,(_,s)=>'.'+s).replace(/[._\s]?(left|right)$/i,(_,s)=>'.'+s[0].toUpperCase());
 key=key.toLowerCase();
 if(RIG_BONES.map(b=>b.toLowerCase()).includes(key))return RIG_BONES.find(b=>b.toLowerCase()===key);
 return ALIASES[key]??null;
}
