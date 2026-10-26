# Refined 3D energy — 26 October 2026

Status: implemented preview; **awaiting normal-speed verdict**. [Comparison](https://tusingw29.github.io/rift-duel/vfx-workbench.html?look=flow) · [Play preview](https://tusingw29.github.io/rift-duel/?energy=flow).

[Reference study and asset provenance](../../../docs/ENERGY_REFERENCE_STUDY.md). The comparison shows the earlier solid finish on the left and curved, textured 3D energy on the right. These are production effect factories, not concept drawings. Only two CC0 Kenney masks were imported; reference-game screenshots are not shipped.

## Inspection and iteration

The first browser pass on `109e183` passed, but inspection found excessive white mixing: Morrow's crimson became pale pink and the beam lost its cyan identity. `before-tint-morrow.jpg` and `before-tint-beam.jpg` preserve that finding. The next revision reduces white mixing and retains a colored base in the translucent surface.

| Capture | Sample | Purpose / limitation |
| --- | --- | --- |
| before-tint-morrow.jpg | Signature frame 30, three-quarter | First pass; excessive whitening prompted correction |
| before-tint-beam.jpg | Beam frame 30, side | First pass; fine light filaments replace the solid arrow stack |
| refined-beam-0-24/30/36-side-* | Frames 24, 30, 36 | Inspect texture flow and taper at fixed simulation times |
| refined-beam-0-54-three-* | Frame 54 | Late fading sample; full contact/breakup choreography remains a separate review |
| refined-capture-5-30-three-* | Frame 30 | Open binding center and spatial secondary arc |
| refined-signature-0…5-* | Frame 30 | Character-specific lance, crescents, lightning, flame and angular loop |
| refined-charge-2-30-three-* | Frame 30 | Tala's rising amber wisps |
| refined-fight-default/draft-side/lock-* | Actual simulated Aegis release | Same combat sequence, both finishes and cameras; P1 occludes beam in lock-on view |
| refined-fight-tala-charge-* | 55 simulated held-attack frames | Actual Tala charge attachment; review against isolated wisps |

Known limits: thin energy can lose weight or disappear against bright stages. Existing solid release flares still contrast with the flowing beam. Lock-on occlusion remains. This pass changes neither camera nor character choreography, combat timing, rigs, mocap or sampled sword trails. Frame captures and temporal pixel differences do not establish normal-speed artistic acceptance.

## Verification

576 unit tests pass, including geometry, finish switching, imported-file hashes/license and deterministic reverse seeking. Browser checks load both textures, compile/render the shaders, compare different simulation times, and exercise actual combat with the direct `?energy=flow` switch. Default gameplay keeps the earlier finish until visual acceptance.

Final capture set suffix `1793053461781`, runtime build `9e3c712052d7`, [successful browser run](https://github.com/Tusingw29/rift-duel/actions/runs/40411709301). Inspection: cyan beam and open violet binding improve on opaque shapes; Tala charge reaches hands and feet in combat. Morrow still reads pink despite reduced whitening; Rei and Morrow also share too much crescent structure. These remain concrete art-direction follow-ups.
