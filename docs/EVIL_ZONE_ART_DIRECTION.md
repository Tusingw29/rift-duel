# Evil Zone visual and motion study

Reference: [Midori story gameplay](https://www.youtube.com/watch?v=wkltXOTfZa8).
Inspected frames at 1:55, 2:00–2:00.5, 2:10–2:10.4, 2:30, 4:25 and 7:50.
These are observations from a video capture, not measurements of original assets,
polygon counts, frame timing, or the PlayStation renderer.

## What is visible

- At 2:30, Midori's short vest, contrasting inner shirt, gloves, tall socks and
  angular hair create distinct color areas. Clothing detail is visible within
  simple surfaces. The model does not need a rounded tube for every feature.
- At 4:25, Midori and Gally have strongly different silhouettes. Gally's angular
  armor and dark trousers contrast with Midori's exposed limbs and compact outfit.
  The rocky arena has a textured floor, layered scenery and a warm sky.
- At 7:50, the extended punch reads through the entire stance: long rear leg,
  bent front leg and forward torso. Al's blue cape provides a large secondary
  silhouette. Green mountains and a bright sky frame the fighters.
- At 1:55 and 7:50, both fighters are readable from a low, mostly profile view.
  At 2:30 the result camera cuts closer. Earlier claims that a behind-player
  camera alone is the original game's signature view were too strong: framing
  varies and must be studied across situations.

## Direction for Rift Duel

| Current mismatch | Treatment | Acceptance check |
| --- | --- | --- |
| Smooth plain surfaces look like rounded toys | Small authored paint maps with folds, seams and broad shading | Costume detail remains legible at fight distance |
| Faces hidden by bulky bangs; oversized head impression | Clearer fringe opening and modest head reduction | Eyes visible from front three-quarter view |
| Dark empty stage with a debug-like grid | Textured stone floor, bright sky and layered mountain horizon | Fighter silhouettes readable while circling |
| High overview or crowded behind-player view | Lower optional opponent-relative side view | Both fighters and their extended limbs fit |
| Tests mistaken for animation fidelity | Judge whole sequences at normal speed | No claim of parity based on pose screenshots |

## Applied in 0.35

Tala gets small original fabric, hair, wrap and shoe paint maps, diffuse rather
than specular character shading, a clearer fringe, and a connected pelvis panel.
Storm Summit gets a stone courtyard and layered mountain/sky setting. The existing
side-camera option becomes a low duel view. Saved camera preferences, input,
movement speed, damage and attack timings are preserved.

## Remaining work

This is a focused visual study, not a completed Evil Zone-quality roster. Other
fighters still need individually authored costumes and proportions. Stages need
more distinctive architecture and painted backdrops. Tala's generated texture
maps are a first pass, not finished hand-painted production art. Shared aerial
and capture animation still needs separate choreography review. Do not copy
original names, meshes, textures, portraits or sound recordings into this game.

## Applied in 0.38

Tala's vest has an original 128×128 front/back diffuse map authored in `tala-costume.js`: blue panels, warm inner shirt, lapels, pocket flaps, hem, shoulder yoke and broken-lightning back crest. Raised gold tube strips were removed. Gloves include a small thumb silhouette. No original game assets were copied. This makes costume placement explicit; it does not close the overall visual-quality gap reported by the user.

## Proportion standard (0.51)

Target: the early-2000s 3D fighter silhouette (Dead or Alive 3, Tekken 4, Soul Calibur 3) rather than the squat PS1 figure. Numbers in game units for Tala, applied by the shared remap in `dist/tala-model.js` and `scripts/build-tala-blender.py`:

| Landmark | Before | After |
| --- | --- | --- |
| Crown | 2.74 | 2.90 (head scaled 0.8 about the head joint) |
| Shoulders | 2.02 | 2.32 |
| Hips | 1.26 | 1.42 |
| Knee | 0.70 | 0.78 |
| Ankle | 0.22 | 0.14 |
| Shoulder width | ×1.00 | ×1.06 |
| Waist and hip girth | ×1.00 | ×0.86 to ×0.88 |
| Limb girth | ×1.00 | ×0.92 to ×0.93 |

Thigh and shin are both 0.64. Other fighters still use their earlier proportions until they are rebuilt to this standard.

## Rendering pass (0.53)

What separated the Design 02 render from the Dead or Alive 3 / Tekken 4 / Soul Calibur 3 target, judged from a 1600-pixel training capture: matte flat-lit surfaces with no specular or reflections, washed shadows, a blown-out floor, and the scanline overlay. `shading.js` adds environment lighting, a three-light rig and material profiles (skin roughness 0.46 with clearcoat, hair 0.38, cloth 0.82, ground 0.9). Remaining gaps are asset work: painted cloth and skin detail maps, alpha-card hair with anisotropic highlights, and rebuilding the other five fighters to the proportion standard.
