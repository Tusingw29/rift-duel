# Tala Design 03: built with Three.js and Node, no Blender

`npm run build:tala -- --sources <dir> --tools <dir>` produces `dist/assets/models/tala-v3.glb`, `dist/tala-v3-joints.js` (the joint constants the game's JavaScript skeleton uses), `joints.json` and `build-report.json` in about six seconds.

Sources: `sh scripts/fetch-tala-v3-sources.sh <dir>` downloads and checksum-verifies the MPFB 2.0 alpha 3 zip (for its CC0 MakeHuman data: base mesh, shape targets, game-engine skeleton and weights) and the CC0 MakeHuman system assets (skins, eyes, brows, lashes, hair, clothing, shoes). Tools: a directory whose `node_modules` holds `pngjs` and `jpeg-js` (the only non-vendored dependencies, used for texture resizing, tinting and JPEG encoding).

## What the build does (`scripts/build-tala-threejs.mjs`)

1. Reads the base mesh and applies the macro sliders (ported from MPFB's slider-to-target interpolation) and Tala's detail targets: tall, athletic, long-legged, tapered jaw, strong brow, almond eyes.
2. Derives MakeHuman's game-engine skeleton from the shaped mesh's joint cubes, straightens the limb chains into the game's hanging rest pose and curls the fingers into fists with the thumb outside, all with Three.js quaternions and linear blend skinning in Node.
3. Fits the CC0 assets with MakeHuman's fit files (reference triangle, weights, scaled offsets), poses them with interpolated weights, hides the feet under the shoes, cuts the leggings into shorts, and generates the tailoring: wraps lifted off the forearms and shins with a banded texture, a sleeveless open vest and standing collar over a charcoal under-top, and swept fringe cards.
4. Folds the 53-bone weights into the game's 17 bones (four influences, normalised, negative fit weights ignored), scales to the 7.5-head standard, and writes the GLB itself: skinned primitives, one skin with translation-only inverse bind matrices, embedded JPEG/PNG textures with luminance tints, MASK alpha for hair, brows, lashes and eyes.

The MakeHuman data is Y-up and faces +Z, the same space the game authors in, so no axis conversion exists anywhere in the pipeline. The earlier Blender scripts (`build-tala-v3-blender.py`, `tala_v3_human.py`, `refine-tala-v3.py`) are kept for reference but are no longer the source of truth.

## Not done yet

Face likeness to the concept beyond target sliders, finer hair strands, vest and shorts tailoring (hem shaping, side vents, waistband), a shoulder and elbow weight pass, and a cloth-detail pass on the shorts cut edge.
