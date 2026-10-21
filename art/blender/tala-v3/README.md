# Tala v3 (Design 03): anatomical body build

Built from the MakeHuman base mesh through the MPFB 2.0 alpha 3 Blender add-on and the MakeHuman system assets. Both are released under CC0, so the result is free to ship in Rift Duel; the body, face, eyes, brows, lashes, hair, clothing and shoe meshes and textures are derived from them, recoloured and recut for Tala. MPFB alpha 3 is the last build that declares Blender 3.0+, which is why it runs on the project's pinned Blender 3.6.22; current MPFB releases need Blender 4.2+.

## Pipeline

1. `sh scripts/fetch-tala-v3-sources.sh <dir>` downloads and checksum-verifies the add-on zip and the 267 MB asset pack.
2. `blender --background --python scripts/build-tala-v3-blender.py -- --mpfb <dir> --joints` shapes the body (macro sliders plus face, leg, waist and shoulder targets in `scripts/tala_v3_human.py`), fits MakeHuman's game-engine skeleton, straightens the limb chains into the game's hanging rest pose, and writes `joints.json` in game units.
3. `node scripts/tala-v3-joints.mjs` writes `dist/tala-v3-joints.js`, the joint constants the JavaScript rig uses for the v3 variant.
4. `node scripts/sample-tala-motion.mjs --variant v3` samples the game's own animation on that rig into `motion-source.json`.
5. `blender --background --python scripts/build-tala-v3-blender.py -- --mpfb <dir>` adds the assets, bakes shape keys, pose and garment masks into plain meshes, consolidates MakeHuman's 53-bone weights into the game's 17 bones, cuts the leggings into shorts, tints hair, top and shorts, builds the game skeleton from the straightened joints (verified against the motion sample), bakes the clips, and exports `dist/assets/models/tala-v3.glb` plus `tala-v3.blend` and `build-report.json`.

## Decisions and limits

- Limb chains hang straight down in the rest pose because every game animation and the foot-planting code assume it; segment lengths come from the fitted skeleton.
- Garment masks that hide body vertices are kept for the shoes and removed for the suit, since the leggings become shorts.
- Textures ship as 2K skin and 1K hair and clothing, JPEG where opaque, inside a 3.9 MB GLB. Normal maps are not exported yet.
- Not done: forearm and shin wraps, costume tailoring toward the concept vest, face likeness to the concept, hair movement beyond the ponytail bone, and a fresh skin-weight pass at the shoulders and elbows.
