---
name: ps1-anime-fighter-art
description: Design original late-1990s anime and PS1 arena-fighter characters, concept alternatives, pose sheets, and their translation into 3D game art. Use for Rift Duel art direction and closely related character-animation design requests.
---

# PS1 anime fighter art

Design from a drawn character and a movement vocabulary before changing procedural geometry. Rift Duel's user rejected blocky interchangeable bodies and stiff motion even when automated tests passed. Technical correctness is not aesthetic acceptance.

Read [reference-study.md](references/reference-study.md) for the source distinctions and period-specific visual criteria. Read [roster-and-moves.md](references/roster-and-moves.md) for the six original fighters and movement roles. These are design proposals, not approved final selections or original Evil Zone frame data.

## Design decisions

- Distinguish the polished 2D illustration target from the simplified textured PS1-era 3D model target. Do not promise that a shader, low polygon count, or sprite sheet will bridge the difference automatically.
- Develop face, hair mass, torso silhouette, boot shape, weapon silhouette and three large costume color regions together. Give each fighter a different center of gravity and resting gesture.
- Prefer angular expressive faces, graphic hair clumps, a limited palette, clean cel-shadow masses and anatomically connected limbs. Avoid using primitive boxes for shoulders/torso and hiding them behind particles.
- Offer meaningfully different silhouettes when alternatives are requested. Maintain combat identity across costumes. A/B/C are choices, not approval ranks.
- Preserve original character identity rather than reproducing an existing character's complete costume, face, weapon and palette as one package. Period references are a visual vocabulary; do not assert direct historical influence without evidence.

## Concepts and pose sheets

Use the available image-generation tool for requested raster art. Store exact prompts and selected outputs in the project. Label generated art as new concept work: no invented historical dates, studio signatures or claims of official production provenance.

A concept comparison should expose full bodies, faces, rear shapes and palettes. Start pose exploration with one explicitly provisional option rather than mixing alternate costumes across frames. A pose atlas needs stable face/costume/weapon identity, readable hands and feet, and distinguishable silhouettes for guard, attack, recoil and recovery.

Read the actual game move definitions before labeling a pose. Separate melee, shot, directional signatures, capture and stock burst. Do not let generated spectacle redefine a missile burst as a sword dash. Include anticipation, contact and recovery for selected production clips; one pose for a move is only a thumbnail idea. Preserve actual gameplay contact timing when translating art to animation.

For sprite deliveries, distinguish concept pose sheets from runtime atlases. Check alpha, dimensions, cell spacing, cropping, facing and stable ground anchors. Transparent pixels alone do not prove clean extraction. Broad glow, changing scale or uneven cells require cleanup before slicing. Do not play a mixed-action pose atlas as if it were one looping animation.

## Animation and 3D translation

Author the pelvis and support foot first, then torso counter-rotation, shoulder/elbow/wrist arc and head response. Favor a distinct anticipation, rapid travel into exact contact, carried follow-through and weighted settle. Use hair/cloth lag to support body motion. Avoid repeatedly smoothing every joint toward a target; this erases contact and makes locomotion float.

Plan clips in three-quarter, side and rear fight-camera views. Sword/staff reach must agree with hitboxes; weapons stay attached to the same hand. Preserve joint lengths and fixed support feet. Animated cloth must clear hips/knees through attacks and guards. A caster still needs weight transfer, not only moving forearms.

Review the chosen concept at thumbnail scale, then a neutral model under plain lighting, then stance/locomotion/one complete combo in the real camera with effects restrained. Compare visually before spreading changes to all fighters. Report actual remaining differences. Tests verify deformation, timing and stability; they do not prove Evil Zone likeness or fluidity.
