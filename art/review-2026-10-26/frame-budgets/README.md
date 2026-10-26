# Readable frame-budget review — 2026-10-26

Implementation `459a657`, build `26ec03c18fb9`. [Cloud browser preview](https://github.com/Tusingw29/rift-duel/actions/runs/40387074133) passed gameplay smoke, Morrow review, existing kinetic VFX/signature checks and the new timing capture script with no page errors. **540/540 unit tests passed** (`npm test -- --test-concurrency=4`), including the unchanged six KO collapse tests.

These are actual combat states rendered through the unchanged production renderer. Tala's launch is initialized by the public `hit` simulation API; all subsequent rebound and wakeup frames advance normally. Morrow reaches hit 3 through connected guarded attacks; no synthetic strike pose is substituted. JSON reports record simulation state at every capture.

| Files (timestamp suffix `1793043051646.jpg`) | Frames | Reading / limits |
| --- | --- | --- |
| `tala-bounce-apex-06-*` | Bounce 6/18 | Rebound apex; root height 0.55, airborne state still active. |
| `tala-ground-settle-12-*`, `-17-*` | Bounce 12/18, 17/18 | On the floor; `air=0`, `launched=false`, knockdown pose retained, shockwave dissipates. |
| `tala-rise-00-*`, `-07-*`, `-14-*`, `-21-*`, `-27-*` | Get-up 0, 7, 14, 21, 27 of 28 | Down, rolling/seated transfer, knee/foot gathering, push, guarded stance. Simulation remains protected until exit; next-frame guard handoff is asserted. |
| `morrow-cleave-windup-12-*`, `morrow-cleave-24-*`, `-44-*`, `-62-*` | Hit 3 at 12, 24, 44, 62 of 63 | Wind-up, contact with curved trail, overshoot, final recovery. The script asserts commitment ends at frame 63. The high blade tip is cropped at wind-up/contact; this view establishes body recovery rather than complete weapon framing. |

**Weakest visible checkpoint:** Tala's mid-rise frame 14 still has a loose rear-hand/support-foot relationship; this pass gives that transition time but does not reauthor its pose. Morrow's close guarded string also overlaps the defender's silhouette in this side view. Hand-plant/weight-transfer polish and weapon framing are handoff observations for Claude, not claims of finished animation quality.

**Awaiting Adam's normal-speed verdict.** Still images verify visible states and continuity checkpoints, not the perceived fluidity of a 60 FPS fight. The original KO cue-clock collapse, animation modules, models and rigs remain unchanged. Portable Tala clips were retimed without rebuilding their geometry/skin/rig/material data; `dist/assets/tala-graphic/manifest.json` records preservation hashes.

See [the timing contract](../../../docs/COMBAT_FRAME_BUDGETS.md) for the preserved 21-frame ground recovery-choice window and multi-stage special exceptions.
