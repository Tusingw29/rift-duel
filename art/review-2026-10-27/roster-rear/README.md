# Roster rear-camera verification — 27 October 2026

**Awaiting normal-speed verdict.** Actual gameplay camera captures, not workbench approximations. [Play flowing preview](https://tusingw29.github.io/rift-duel/?energy=flow).

Original requested run [40470396558](https://github.com/Tusingw29/rift-duel/actions/runs/40470396558), commit `7957042`, passed, but had side-only roster captures. Follow-up [40478042999](https://github.com/Tusingw29/rift-duel/actions/runs/40478042999) added rear samples and exposed Morrow cape occlusion even at +16f. `before-shoulder-clearance-morrow.jpg` records that failure.

Correction `6ee5db8` gives the flowing preview a stable 4.2-unit shoulder offset instead of 1.9. Default/side/duel cameras and all model/pose/animation math are unchanged. This is a framing change, not a camera-facing effect or a displacement away from its collision path. The wider rear view preserves both fighters in the inspected landscape captures. Portrait screens and all arena/matchup combinations are not covered by this review.

[Corrected focused browser run 40478793913 passed](https://github.com/Tusingw29/rift-duel/actions/runs/40478793913). Runtime build `4b51ad213491`; capture suffix `1793092283137`. No page/console errors. The script now records side and lock views at four simulation frames after release, plus lock at sixteen frames. It asserts the projectile still exists at the latter sample.

| Fighter | File prefix | +4f rear | +16f rear |
| --- | --- | --- | --- |
| Rei | refined-fight-signature-1 | Arcs partially overlap the hands/body | Separate crescent structure visible beside P1 |
| Morrow | refined-fight-signature-3 | **Still hidden by sword/release pose: weakest frame** | Broad crimson crescent clearly visible, no floor-line flattening |
| Sol | refined-fight-signature-4 | Flame tongues visible beside the body | Vertical branching flame remains visible |
| Vesper | refined-fight-signature-5 | Nested seal visible alongside the casting hands | Sharp nested quadrilaterals visibly separate from P1 |

The diagonal geometry reads in the sampled rear flight views. This does **not** certify every release frame: Morrow's early occlusion remains a specific limitation. Screenshots also do not establish smooth camera feel or normal-speed artistic acceptance.

Synced Claude `a3ff8c4` WEIGHT-TRANSFER and retained TALA-IMPORT-AB board history. 592 unit tests passed locally with `node --test --test-concurrency=4 tests/*.test.mjs`. Local npm commands exited 194 before completion; direct release stamping succeeded. The Pages workflow runs the exact `npm run prepare:release` and `npm test` commands before publishing.
