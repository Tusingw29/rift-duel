# Project contract

Snapshot checked 2026-10-21. Current source wins over this snapshot.

## Rig and runtime

The game uses vendored vanilla Three.js without React or a bundler. Inspect `dist/tala-concept.js`, `dist/rig-clone.js`, `dist/animation.js` and `dist/tala-footwork.js` for affected work. Find renamed modules with `rg --files`.

`scripts/sample-tala-motion.mjs` and `art/blender/tala/motion-source.json` define 17 exported bones: `root`, `chest`, `head`, `upper_arm.L`, `forearm.L`, `hand.L`, `thigh.L`, `shin.L`, `upper_arm.R`, `forearm.R`, `hand.R`, `thigh.R`, `shin.R`, `ponytail`, `sash`, `foot.L`, `foot.R`. Loader canonicalization also accepts side-suffix names without the dot for limb bones.

There are no independent neck, clavicle, toe or finger bones. Use chest/head weighting for neck transitions and existing foot-pivot controls. New deform bones require sampler, exporter, runtime binding, clone and motion changes together. Additional authoring controls may be baked out without changing the exported deform contract.

Live combat drives the attached surfaces using the game's own rig. Editing embedded Blender clips alone does not change live animation. Older study clips and current runtime pose samples have different purposes. Read move definitions for actual contact timing; do not copy old clip or generated pose-sheet frame numbers into gameplay. Contact must reach its authored pose on the actual damage frame.

Authored coordinates are X right, Y up, Z forward. The builder rotates these into Blender and the glTF exporter converts back. Preserve the existing transforms/inverse bind matrices; do not add a second axis correction or rescale a bound rig to enforce generic metres.

No Draco, Meshopt or KTX2 decoder is currently integrated. Keep embedded PNG/JPEG GLBs unless decoder integration is part of the task. Preserve PNG for alpha textures. Follow existing skeleton-aware cloning and resource ownership patterns.

## Sources and review

- `art/tala-design-02/`: selected boards, production notes, pose sheets and prompts. Inspect images rather than trusting generated labels.
- `scripts/build-tala-blender.py`, `scripts/tala_design02_*.py`: model, face, costume, hair and texture construction.
- `art/blender/tala-design02/build-report.json`: current output counts; derive budgets from measured assets, not stale skill text.
- `dist/assets/models/tala-design02.glb`: preview asset; `dist/tala-concept.js` owns its versioned URL. Preserve default/preview selection unless asked to change it.
- `dist/tala-blender.html?model=design02`: model review; `/?tala=design02`: playable preview.
- `dist/tala-motion.html`: rendered video; check provenance before treating it as current-model evidence.

## Cloud builds and checks

`.github/workflows/tala-art.yml` pins and checksum-verifies Blender 3.6.22 on GitHub. Manual inputs control face rebake and review renders. Rebake after face geometry, UV, material or source-image edits. Cached face builds require unchanged face inputs. The workflow uploads artifacts rather than automatically promoting a model.

`scripts/sample-tala-design02-guard.mjs` samples runtime guard and combo poses; `scripts/render-tala-design02.py` renders them. Regenerate moving reviews when judging changed assets. Use `tests/tala-design02.test.mjs` for binding/deformation checks and relevant motion tests for animation edits. Run `npm test` for a rebuilt asset or release. For runtime JS changes, follow `npm run prepare:release` and the existing Pages workflow. Verify public asset hashes when publishing is in scope.

Cloud stills do not establish browser shader parity, normal-speed fluidity, physical-controller behavior or audio. Browser smoke tests provide separate evidence, not an aesthetic verdict.
