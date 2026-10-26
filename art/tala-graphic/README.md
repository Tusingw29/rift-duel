# Graphic flat-color Tala

[Model viewer](https://tusingw29.github.io/rift-duel/tala-blender.html?model=graphic) · [Playable preview](https://tusingw29.github.io/rift-duel/?tala=graphic) · [Asset pack](https://tusingw29.github.io/rift-duel/assets/tala-graphic/tala-graphic-pack.zip)

This preview implements roster art direction 15 for Tala using Three.js and a standalone GLB. It preserves the established combat skeleton and does not change move timing or make the new look the default for other players.

The first visual review exposed missing thigh coverage, overlapping old/new chin geometry, torso faces mistakenly included in the forearm wraps, open hands and torn vest boundaries. The current asset restores shorts coverage, filters wraps by bone influence, blends a new neck into chest/head, supplies closed fists, and replaces the vest/top with connected panels. Solid hair forms replace transparent hair cards. Eye contours and mouth depth were adjusted against close renders.

`review/` contains actual Chromium model renders, not generated concept art. `gameplay/` records the playable training check. The model, material palette, manifest and rig limitations are documented in [the asset guide](../../dist/assets/tala-graphic/README.md). The full source builder is [build-tala-graphic.mjs](../../scripts/build-tala-graphic.mjs).

Review remains open for finer shoulder/garment transitions, fist sculpting and a closer likeness to the approved concept. Headless images verify appearance and attachment, not real-time animation quality on the user's Mac.

## Verification

- 407 Node tests passed, including normalized weights, bind-pose preservation, all 21 live clip deformations, exported/local animation agreement, neck/fist/wrap influence checks and cloned shader restoration.
- Playable Chromium training smoke: 10/10 checks passed (model attachment, movement, circling, hit damage, HUD and console).
- Model review captures cover front, side, rear, face, guard, combo sample, advance, retreat, recoil, skeleton overlay and exported guard.
- Rendering used software Chromium; real-time frame rate and physical controllers were not evaluated.
