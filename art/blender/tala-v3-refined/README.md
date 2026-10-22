# Tala tailored character pass

Actual Blender geometry and packed materials, built on the existing Design 03 anatomical body. This is a work in progress toward the selected Tala concept; it does not yet match the concept face or overall production finish.

## Changes

- Separate ochre open vest and standing collar over charcoal top; sleeve openings smoothed after cutting the stock garment.
- Shortened rust shorts with the stock sportswear print removed.
- Forearm and shin wraps extracted from the anatomical surface, retaining its skin weights; packed band texture.
- Dark shoes and wrap-colored sock surfaces.
- Seven swept tapered fringe pieces weighted to the existing head bone. The original ponytail remains.

The original 17-bone skeleton, body anatomy, move timing, live animation and unequal-leg solver are unchanged. This pass does not add finger animation: the source hands still spread in guard. The face remains the generic anatomical base. Short hems and wrap edges need more tailoring, the vest is still broad, and the fringe is a coarse first model of the concept's hair. No claim of AAA or reference-game parity.

## Reproduce

Run `blender --background --threads 2 --python scripts/refine-tala-v3.py` with Blender 3.6.22. It reads the committed original `art/blender/tala-v3/tala-v3.blend`; it does not require another MakeHuman source download and does not overwrite that source. It writes this directory's editable source and neutral renders plus a generated GLB. The reviewed GLB is promoted separately to `dist/assets/models/tala-v3.glb`.

Cloud workflow: `.github/workflows/tala-refined.yml`. Reviewed build: GitHub run 39786156936, source commit 7399e44. Earlier candidates were rejected for jagged edges, misplaced wraps, and eye-obscuring fringe. The original default cube is excluded from the final scene and asset.

These front/side/back images are neutral Blender renders. Actual runtime review and its limitations are recorded in `docs/VERIFICATION.md`.
