# Roster energy refinement — 27 October 2026

Status: **browser verified; awaiting normal-speed verdict**.

[Interactive comparison](https://tusingw29.github.io/rift-duel/vfx-workbench.html?look=flow) · [Gameplay preview](https://tusingw29.github.io/rift-duel/?energy=flow)

| Fighter / effect | Change | Inspect |
| --- | --- | --- |
| Aegis | Thin cutting sheet inside the lance | Direction and visibility at gameplay scale |
| Rei | Two offset narrow cutting sheets with separated depth | Separation from Morrow's heavy sweep |
| Tala | Secondary electrical branch and small sparks | Avoid a smooth noodle silhouette |
| Morrow | Broad ragged cutting sheet, dark backing, saturated body without white mixing | Crimson vs pink, blade weight, edge clarity |
| Sol | Three tapered flame sheets with different heights and ember motion | Flame silhouette rather than paired crescent |
| Vesper | Two nested seals built from straight edges | Preserve corners and a distinct open interior |
| Release bursts | Fine tapered rays extending in three dimensions | Replace solid star-shaped spikes in the flow preview |

All new surfaces remain world-oriented 3D geometry. The sheet thickness is authored with sidewalls; these are not camera-facing cards. Changing the finish restores the earlier production meshes. The broader effects are translucent with depth writes disabled; the dark backing and cutting sheets use normal blending to retain color, while outer wisps remain additive.

Implementation `38a6a6f`, initial runtime build `c403fafd70f1`. 579 unit tests pass after the orientation correction; expanded finish-switch coverage includes release bursts. New tests exercise Morrow's color roles, parent fade, particle reverse-seeking and reduced-motion stability. Model, rig, mocap, animation and combat files are untouched.

Captures use workbench frame 30 for roster shapes and real input-driven projectile releases in fights. The comparison's left pane is the original solid finish, not yesterday's flow preview; use the prior review folder for that intermediate version. Still images do not establish normal-speed quality.

First [cloud run](https://github.com/Tusingw29/rift-duel/actions/runs/40468988061) passed. Inspection confirmed crimson Morrow, layered Sol flame and sharp Vesper corners in the workbench, but real combat showed that the inherited horizontal signature orientation made them edge-on. `before-orientation-morrow.jpg` records this defect. The follow-up pitches flowing projectiles diagonally, with a regression for restoring the old orientation when the finish is switched off. It changes visual orientation only, never collision or travel.

## Corrected capture verdict

[Focused browser review passed](https://github.com/Tusingw29/rift-duel/actions/runs/40470396558), pre-rebase commit `7957042`, final build `86c85c4e7373`, capture suffix `1793087988281`. Final implementation after merging Claude board claim: `e2000fa` and `25aca3a`. Inspected actual combat captures for Rei, Morrow, Sol and Vesper: diagonal presentation restores vertical extent; Morrow retains crimson and visibly more width than Rei. Sol and especially Vesper remain thin from the side camera. Rear beam occlusion remains outside this geometry pass. This is a playable preview, not a completed visual-acceptance claim.

| Files | Time / view | Reading |
| --- | --- | --- |
| refined-signature-* | Workbench frame 30 | All six designs; compare with prior day for flow-to-flow changes |
| refined-fight-signature-1/3/4/5-* | Four simulation frames after first projectile release; side camera | Real projectile scale and orientation |
| before-orientation-morrow.jpg | Same release sequence, old horizontal pitch | Edge-on defect found during inspection |
| refined-fight-draft-side/lock-* | Aegis beam sequence | Fine release rays; rear-camera occlusion remains |
| refined-report-* | Machine-readable run evidence | No page/console errors |
