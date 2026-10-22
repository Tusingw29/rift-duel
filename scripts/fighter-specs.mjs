// Per-fighter build specs for scripts/build-tala-threejs.mjs (the Three.js/Node character
// builder). Each spec shapes the CC0 MakeHuman base with macro sliders and detail targets,
// then dresses it from the CC0 MakeHuman system assets, recoloured by luminance tint.
// Colours are linear RGB multipliers applied to the asset's luminance.
const face=(extra=[])=>[['head/head-oval',.4],['cheek/l-cheek-bones-incr',.25],['cheek/r-cheek-bones-incr',.25],['eyes/l-eye-scale-incr',.25],['eyes/r-eye-scale-incr',.25],['nose/nose-scale-horiz-decr',.2],...extra];
const athletic=(w=.5)=>[['arms/l-upperarm-muscle-incr',w],['arms/r-upperarm-muscle-incr',w],['arms/l-lowerarm-muscle-incr',w*.8],['arms/r-lowerarm-muscle-incr',w*.8],['legs/l-upperleg-muscle-incr',w*.8],['legs/r-upperleg-muscle-incr',w*.8],['legs/l-lowerleg-muscle-incr',w*.7],['legs/r-lowerleg-muscle-incr',w*.7],['torso/torso-muscle-dorsi-incr',w*.7],['torso/torso-muscle-pectoral-incr',w*.5]];
export const specs={
 tala:{
  index:2,prefix:'TalaV3_',label:'Tala',tailor:'tala',
  macro:{race:{asian:.45,african:.15,caucasian:.40},gender:0,age:.3,muscle:.86,weight:.52,proportions:.75,height:.82,cupsize:.55,firmness:.8},
  targets:[['head/head-oval',.5],['chin/chin-width-decr',.35],['chin/chin-prominent-incr',.15],['chin/chin-triangle',.35],['cheek/l-cheek-bones-incr',.35],['cheek/r-cheek-bones-incr',.35],['cheek/l-cheek-volume-decr',.25],['cheek/r-cheek-volume-decr',.25],
   ['eyes/l-eye-scale-incr',.35],['eyes/r-eye-scale-incr',.35],['eyes/l-eye-height2-incr',.2],['eyes/r-eye-height2-incr',.2],['eyes/l-eye-corner1-up',.2],['eyes/r-eye-corner1-up',.2],['eyebrows/eyebrows-angle-up',.3],['eyebrows/eyebrows-trans-down',.25],
   ['nose/nose-scale-horiz-decr',.3],['nose/nose-scale-vert-decr',.15],['nose/nose-point-width-decr',.2],['mouth/mouth-scale-horiz-decr',.15],['mouth/mouth-lowerlip-volume-incr',.2],['mouth/mouth-upperlip-volume-incr',.2],['neck/neck-scale-vert-decr',.15],['neck/neck-scale-horiz-decr',.05],
   ['legs/lowerlegs-height-incr',.35],['legs/upperlegs-height-incr',.3],['torso/measure-waist-circ-decr',.45],['torso/measure-shoulder-dist-incr',.6],['torso/torso-muscle-dorsi-incr',.5],['torso/torso-muscle-pectoral-incr',.35],['hip/hip-scale-horiz-decr',.1],
   ['arms/l-upperarm-muscle-incr',.7],['arms/r-upperarm-muscle-incr',.7],['arms/l-lowerarm-muscle-incr',.55],['arms/r-lowerarm-muscle-incr',.55],['arms/l-upperarm-shoulder-muscle-incr',.5],['arms/r-upperarm-shoulder-muscle-incr',.5],
   ['legs/l-upperleg-muscle-incr',.55],['legs/r-upperleg-muscle-incr',.55],['legs/l-lowerleg-muscle-incr',.45],['legs/r-lowerleg-muscle-incr',.45]],
  skin:{file:'skins/young_asian_female/young_lightskinned_female_diffuse3.png',warm:[1,.94,.86]},
  eyes:'eyes/materials/brownlight_eye.png',eyebrows:'eyebrows/eyebrow001/eyebrow001',eyelashes:'eyelashes/eyelashes01/eyelashes01',
  hair:{asset:'hair/ponytail01/ponytail01',tint:[.62,.26,.16]},
  outfit:{asset:'clothes/female_sportsuit01/female_sportsuit01'},
  shoes:{asset:'clothes/shoes01/shoes01',color:[.35,.3,.3]},
 },
 aegis:{
  // The fallen orbital knight: broad, disciplined, steel-blue flight suit.
  index:0,prefix:'AegisV3_',label:'Aegis',
  macro:{race:{asian:.2,african:.1,caucasian:.7},gender:1,age:.38,muscle:.82,weight:.58,proportions:.7,height:.88,cupsize:.5,firmness:.5},
  targets:[...face([['chin/chin-width-incr',.2],['chin/chin-prominent-incr',.25],['eyebrows/eyebrows-trans-down',.2]]),...athletic(.6),['torso/measure-shoulder-dist-incr',.6],['torso/measure-waist-circ-decr',.3],['legs/upperlegs-height-incr',.2]],
  skin:{file:'skins/young_caucasian_male/young_lightskinned_male_diffuse.png',warm:[1,.96,.92]},
  eyes:'eyes/materials/blue_eye.png',eyebrows:'eyebrows/eyebrow003/eyebrow003',eyelashes:'eyelashes/eyelashes02/eyelashes02',
  hair:{asset:'hair/short01/short01',tint:[.1,.12,.2]},
  // Relay Knight: a navy flexible undersuit; the ivory segmented armour, helmet and cape are added at runtime (dist/roster-costumes.js).
  outfit:{asset:'clothes/male_casualsuit01/male_casualsuit01',tint:[.1,.13,.24]},
  shoes:{asset:'clothes/shoes02/shoes02',color:[.12,.14,.2]},
 },
 rei:{
  // The echo bearer: slight, quick, ivory hair, white fitted coat.
  index:1,prefix:'ReiV3_',label:'Rei',
  macro:{race:{asian:.7,african:.05,caucasian:.25},gender:0,age:.25,muscle:.62,weight:.44,proportions:.78,height:.78,cupsize:.45,firmness:.8},
  targets:[...face([['chin/chin-triangle',.3],['eyes/l-eye-height2-incr',.2],['eyes/r-eye-height2-incr',.2],['mouth/mouth-scale-horiz-decr',.15]]),...athletic(.3),['torso/measure-waist-circ-decr',.4],['legs/lowerlegs-height-incr',.3],['legs/upperlegs-height-incr',.25],['neck/neck-scale-vert-decr',.1]],
  skin:{file:'skins/young_asian_female/young_lightskinned_female_diffuse3.png',warm:[1,.97,.95]},
  eyes:'eyes/materials/brown_eye.png',eyebrows:'eyebrows/eyebrow002/eyebrow002',eyelashes:'eyelashes/eyelashes01/eyelashes01',
  hair:{asset:'hair/long01/long01',tint:[.09,.07,.09]},
  // Shrine Exile: ivory blouse over dark trousers; the plum sash, wine panels, collar and boots are added at runtime.
  outfit:{asset:'clothes/female_casualsuit01/female_casualsuit01',tint:[.95,.9,.8],lower:[.1,.09,.1]},
  shoes:{asset:'clothes/shoes04/shoes04',color:[.12,.1,.1]},
 },
 morrow:{
  // The iron pilgrim: heavy, weathered, olive-iron travelling clothes.
  index:3,prefix:'MorrowV3_',label:'Morrow',
  macro:{race:{asian:.1,african:.2,caucasian:.7},gender:1,age:.58,muscle:.95,weight:.86,proportions:.45,height:.96,cupsize:.5,firmness:.5},
  targets:[['chin/chin-width-incr',.4],['chin/chin-prominent-incr',.3],['head/head-square',.4],['cheek/l-cheek-bones-incr',.2],['cheek/r-cheek-bones-incr',.2],['eyebrows/eyebrows-trans-down',.3],['nose/nose-scale-horiz-incr',.15],...athletic(.85),['torso/measure-shoulder-dist-incr',.8],['neck/neck-scale-horiz-incr',.4]],
  skin:{file:'skins/middleage_caucasian_male/middleage_lightskinned_male_diffuse.png',warm:[1,.93,.86]},
  eyes:'eyes/materials/green_eye.png',eyebrows:'eyebrows/eyebrow005/eyebrow005',eyelashes:'eyelashes/eyelashes02/eyelashes02',
  hair:{asset:'hair/short02/short02',tint:[.42,.44,.4]},
  outfit:{asset:'clothes/male_casualsuit01/male_casualsuit01',tint:[.3,.36,.3]},
  shoes:{asset:'clothes/shoes05/shoes05',color:[.25,.23,.2]},
 },
 sol:{
  // The ember archivist: lean, sharp-featured, ember-red scholar's suit.
  index:4,prefix:'SolV3_',label:'Sol',
  macro:{race:{asian:.3,african:.3,caucasian:.4},gender:1,age:.3,muscle:.58,weight:.42,proportions:.72,height:.8,cupsize:.5,firmness:.5},
  targets:[...face([['chin/chin-triangle',.3],['nose/nose-scale-vert-incr',.1],['eyebrows/eyebrows-angle-up',.3]]),...athletic(.3),['torso/measure-waist-circ-decr',.3],['neck/neck-scale-vert-incr',.1]],
  skin:{file:'skins/young_caucasian_male2/young_lightskinned_male_diffuse2.png',warm:[1,.9,.8]},
  eyes:'eyes/materials/brown_eye.png',eyebrows:'eyebrows/eyebrow004/eyebrow004',eyelashes:'eyelashes/eyelashes02/eyelashes02',
  hair:{asset:'hair/short03/short03',tint:[.7,.28,.1]},
  // Ember Cartographer: dark shirt and trousers under the runtime rust coat, ivory collar, gold cuffs and satchel.
  outfit:{asset:'clothes/male_casualsuit01/male_casualsuit01',tint:[.14,.11,.1]},
  shoes:{asset:'clothes/shoes03/shoes03',color:[.26,.16,.1]},
 },
 vesper:{
  // The hollow oracle: tall, pale, long violet-black hair, deep violet gown.
  index:5,prefix:'VesperV3_',label:'Vesper',
  macro:{race:{asian:.35,african:.1,caucasian:.55},gender:0,age:.32,muscle:.5,weight:.46,proportions:.82,height:.86,cupsize:.5,firmness:.75},
  targets:[...face([['chin/chin-triangle',.35],['eyes/l-eye-corner1-up',.2],['eyes/r-eye-corner1-up',.2],['mouth/mouth-lowerlip-volume-incr',.15]]),...athletic(.2),['torso/measure-waist-circ-decr',.35],['legs/lowerlegs-height-incr',.3],['legs/upperlegs-height-incr',.3],['neck/neck-scale-vert-incr',.15]],
  skin:{file:'skins/young_caucasian_female2/young_lightskinned_female_diffuse2.png',warm:[.96,.94,.98]},
  eyes:'eyes/materials/blue_eye.png',eyebrows:'eyebrows/eyebrow002/eyebrow002',eyelashes:'eyelashes/eyelashes01/eyelashes01',
  hair:{asset:'hair/long01/long01',tint:[.72,.64,.9]},
  // Astral Mourner: dark violet fitted bodice and trousers under the runtime gown panels, ivory drape, gold trim and broken halo.
  outfit:{asset:'clothes/female_elegantsuit01/female_elegantsuit01',tint:[.2,.12,.3]},
  shoes:{asset:'clothes/shoes06/shoes06',color:[.14,.1,.18]},
 },
};
export const specFor=id=>{const spec=specs[id];if(!spec)throw new Error(`Unknown fighter spec "${id}" (known: ${Object.keys(specs).join(', ')})`);return {id,...spec};};
