# Research and design decisions

Scope: a focused visual-reference and production-workflow study, not access to the original studios' source models, rigs, motion capture or complete production pipeline. No original-game polygon counts, skeleton dimensions or frame timings were measured. All production budgets and motion proposals below are for Rift Duel.

## Game references inspected

| Reference | Evidence type | What we take for Tala | What we do not infer |
|---|---|---|---|
| [DOA3 Hitomi E3 screenshot](https://www.mobygames.com/game/5371/dead-or-alive-3/promo/group-76345/image-611891/) | Archived Tecmo 2001 E3 press-kit gameplay image; visually inspected | A readable athletic stance, soft stylized face, restrained large costume masses, clear skin/cloth separation | Promotional render detail is not automatically available in the actual gameplay mesh |
| [DOA3 Hitomi costume illustration](https://www.creativeuncut.com/gallery-10/doa3-hitomi3.html) | Archived official illustration; visually inspected | Clothing should be designed as garments with construction and purposeful folds | Tala does not inherit Hitomi's gi, headband or identity |
| [Tekken 4 Steve Fox render](https://www.creativeuncut.com/gallery-10/tk4-steve-fox-cg.html) | Archived official promotional render; visually inspected | Clavicle/shoulder/arm continuity, boxing identity visible in posture and hand placement | This is not gameplay-resolution evidence or a measured punch sequence |
| [Soulcalibur III Xianghua wallpaper](https://www.mobygames.com/game/21115/soulcalibur-iii/promo/group-4921/image-58420/) | Archived official promotional image; visually inspected | Designed trim and layered garment silhouette with distinct material/color regions | Do not copy her costume, sword or fighting style |

My synthesis: choose DOA3 as the primary facial/rendering reference, use Tekken's anatomical clarity, and borrow Soulcalibur's attention to garment construction. These are visual interpretations, not claims that the three studios used one common art formula. Tala remains an original unarmed rushdown fighter in her ochre/rust/charcoal costume.

## Expert workflow sources

[Wayne Gilbert, Animation Mentor: body mechanics](https://www.animationmentor.com/blog/animation-tips-tricks-what-makes-or-breaks-a-good-body-mechanics-shot/) was read in full in its substantive article section. The useful principle is to identify what force initiates a movement and how it travels through the body. Breakdowns explain the transition, rather than merely placing a body at two endpoints. Applied to Tala: annotate support foot, pelvis initiation, chest response, fist travel and recovery for each beat. This does not validate our fighting technique as measured athletic reference.

[Animation Mentor: pushing and pulling tutorial](https://www.animationmentor.com/blog/tutorial-animating-pushing-and-pulling-motions/) and [Jason Martinsen body-mechanics demo](https://www.animationmentor.com/blog/step-by-step-animation-body-mechanics-demo-with-jason-martinsen/) were available as indexed summaries; full-page fetches failed. They support a reference → blocking → refinement workflow. I did not watch their embedded videos or claim to complete these courses.

[Blender Studio: Stylized Character Workflow](https://studio.blender.org/training/stylized-character-workflow/) and [modeling artist guide](https://studio.blender.org/tools/artist-guide/asset-creation/modeling) expose course/guide summaries describing design development followed by retopology. The guide fetch was restricted. [Kat Unsworth's Gnomon workflow](https://thegnomonworkshop.com/blog/modeling-a-stylized-character-for-games/) describes anatomy, form, gesture, blockout, retopology and UV work in its indexed publisher summary; the full page presented a browser challenge. These are process references, not completed paid instruction.

[Blender 3.6 glTF export manual](https://docs.blender.org/manual/en/3.6/addons/import_export/scene_gltf2.html) is the export reference for the locally compatible Blender version. Indexed documentation confirms skinning and animation export; the full fetch was restricted. Validate actual exporter options locally, rather than assuming a newer Blender version behaves identically.

## Application to this repository

Use an editable designed mesh as the source of truth. Procedural build code should package and validate it; repeated global scaling of loft rings cannot substitute for facial and shoulder topology. Keep the existing tested contact events, opponent-relative movement and root trajectory. Author a higher-quality model and poses around those contracts.

The proposed build sequence, mesh budget, material values, joint controls and motion breakdowns in this package are our own engineering/art direction. They are not attributed as historical specifications from DOA3, Tekken 4 or Soulcalibur III.
