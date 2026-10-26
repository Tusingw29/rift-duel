# Combat fluidity / beam polish review

Status: **awaiting normal-speed verdict**. Unit verification: **472 tests pass**. Character and pose files are unchanged.

| Capture | What it shows |
| --- | --- |
| [Hand release, side](beam-hand-side-1793019673475.jpg) | Live forward beam at tick 15; connector and flare follow the free hand |
| [Hand release, lock-on](beam-hand-lock-1793019673475.jpg) | Nose flare stays camera-facing beside Aegis; body still partly occludes the initial projectile |
| [Breakup, drawing 1](beam-breakup-0-1793019673475.jpg) | Contact removes the beam; bright compact shards remain |
| [Breakup, drawing 2](beam-breakup-2-1793019673475.jpg) | Shards spread while the victim begins post-freeze recoil |
| [Breakup, drawing 3](beam-breakup-4-1793019673475.jpg) | Shards shrink/fade before complete cleanup |

The [browser report](report-1793019673475.json) records identical hand/flare world coordinates, five captures and zero page exceptions. The runner also asserts that the breakup clears. The weakest capture is the final breakup: deliberately faint on the bright arena floor; normal-speed review should determine whether it needs more contrast. End-on flare improves visibility, but it cannot remove body occlusion without changing the camera or drawing through the character.

Simulation tests use raw updates to verify four grounded squat frames, twelve rise frames, six-frame buffer boundaries, both-player directional travel cancels, fixed impact freezes and decreasing knockback displacement. The original combat-travel assertions are untouched. Older frame-data tests explicitly count advancing fight frames, with separate raw-frame tests covering the freezes.

See [handoff contract](../../../docs/COMBAT_FLUIDITY.md). Claude still needs to bind his squat/rise poses directly to these simulation windows. Screenshots verify attachment and effect lifecycle, not normal-speed smoothness or laptop frame rate.
