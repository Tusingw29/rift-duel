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
