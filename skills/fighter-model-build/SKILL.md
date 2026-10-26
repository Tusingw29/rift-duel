---
name: fighter-model-build
description: Build or rebuild a Rift Duel fighter's Design 03 body with the Node/Three.js pipeline from CC0 MakeHuman data, change its shape, wardrobe or palette, and ship the GLB with its joints. Use for any model change; never reach for Blender.
---

# Fighter model build (Design 03, Three.js only)

The user's standing direction is "three.js not blender". Every fighter body is produced by `scripts/build-tala-threejs.mjs` from the CC0 MakeHuman data; the Blender scripts in the repo are history.

## Inputs

- Sources: `bash scripts/fetch-tala-v3-sources.sh <fresh empty dir>` downloads and checksums the MPFB 2.0 alpha 3 add-on zip (base mesh, targets, game-engine rig and weights) and the MakeHuman system assets, then extracts both. About 650 MB; keep the directory, it survives better outside the scratchpad.
- Tools: a directory whose `node_modules` has `pngjs@7.0.0` and `jpeg-js@0.4.4` (the same directory as the capture tools is fine).
- Per-fighter spec in `scripts/fighter-specs.mjs`: macro sliders, detail targets, skin, eyes, eyebrows, eyelashes, hair asset and tint, outfit asset and tint (optionally `lower` tint to split at the waist), shoes, and `tailor:'tala'` for Tala's cut costume.

## Build

```
node scripts/build-tala-threejs.mjs --sources <sources> --tools <tools> --fighter <aegis|rei|tala|morrow|sol|vesper>
```

Writes `dist/assets/models/<id>-v3.glb` (joints and leg metrics in the scene extras), `dist/<id>-v3-joints.js` (Tala: `dist/tala-v3-joints.js`), and `art/blender/<id>-v3/build-report.json`. Six seconds per fighter. The same command runs on GitHub in `.github/workflows/tala-build.yml`.

After a Tala rebuild bump `?v=` on her GLB URL in `dist/tala-concept.js` and `dist/tala-blender-review.js`; the roster URLs come from `fighterModelUrl` in `dist/tala-concept.js`, bump its `?v=` after rebuilding any other fighter.

## Verify, then ship

1. `npm test`: `tests/fighter-v3.test.mjs` attaches every GLB to its real rig and checks the bind pose within a millimetre, weapons kept, costume pieces present, and finite animation.
2. Capture front, side and face (see `skills/visual-review-capture`) and compare against the concept board in `art/roster-2026-10-21` or `art/tala-art-target-2026-10-22`.
3. `npm run prepare:release`, commit the GLB, joints file and build report together, push, confirm the Pages deploy and cloud smoke.

## Gotchas (each cost real time)

- MakeHuman data is already Y-up facing +Z; no axis conversion.
- Fit-file vertex lines can be interleaved with other keys; parse numeric lines until the vertex count is reached, and ignore negative fit weights.
- Garment delete lists hide body vertices. Apply them above the hem or skin pokes through tight cloth; keep the legs when leggings become shorts.
- The garment atlases' grey background and printed logos bleed at seams; the tint folds neutral and strongly saturated pixels into the fabric's median luminance (hair tint skips this).
- Limb chains must hang straight down and fingers are curled before weights are consolidated, so the GLB rest pose matches the game skeleton. The curl aims each fingertip at the palm centre (wrist lerped 70% toward the middle knuckle); aiming at the wrist over-curls into a claw.
- Hair cards must sample a strand region of the hair atlas with the alpha-masked hair material; flat colour looks like cardboard.
- Weapon meshes in the classic models carry `userData.weapon=true`; the roster attach keeps only those under the hands, and Aegis's batcher must skip them.
- Head joint is at the skull base: eyes about +0.06, crown +0.24, chin −0.08 in head space. Measure before placing anything on the head.
- The CC0 wardrobe is modern casual wear; costumes are runtime pieces (see `skills/costume-authoring`), so a wardrobe change alone never produces a concept look.

## Deformation layer (all textured bodies, 2026-10-26)

Every `<id>-v3.glb` now carries 61 bones: the 17 control bones first (same names and positions as before, so `tala-v3-joints.js` and the animators are untouched), then `pelvis.control`, `spine.lower`, `spine.upper`, `neck.control`, per side `clavicle`, `upper_twist`, `fore_twist`, `toe` and `finger{0-4}.{0-2}` (index, middle, ring, pinky, thumb), then `ponytail.mid` and `ponytail.tip`, in the same order as `dist/tala-combat-rig.js`. Topology: root → pelvis.control → spine.lower → chest → spine.upper → neck.control → head, clavicles under spine.upper, thighs under pelvis.control. The hierarchy is in the scene extras as `rigSpec`, with `restFist:true` because the finger joints are posed curled in the bind pose; `installCombatRig(r, mapped, rigSpec, {restFist})` installs it on load and the adapter applies finger curl relative to that rest. Twist helpers take a mid-segment share of the arm weights; the ponytail splits by distance down the hair. GLTFLoader strips dots from node names, so the attach path keeps dotless aliases.

## Graphic Tala combat-rig exception

The optional `graphic` asset is built with `scripts/build-tala-graphic.mjs` and now uses the 61-bone specification in `dist/tala-combat-rig.js`. Its scene extras set `combatRig:1`; attachment retains the original combat roles while installing the additional deformation joints. Other V3 assets remain 17-bone. Do not collapse the new neck, spine, fingers or twist helpers through the legacy canonical aliases. GLTFLoader removes dots from node names, so the expanded attachment maps both spellings explicitly. Rebuild the GLB and ZIP together, and verify all 61 exported transforms against the live rig with `tests/tala-graphic.test.mjs`. Preserve the normal-speed review requirement.
