# Attack energy review — 2026-10-26

Owner: Codex. **Awaiting Adam's normal-speed verdict.** Character models and animators are unchanged by this pass.

| Capture | What to inspect | Limits |
| --- | --- | --- |
| `attack-capture-1793009486154.jpg` | Actual Tala capture, simulation frame 35: open white restraint ring and coloured broken outer rim around the opponent. Character stays visible. | Single side-camera sample; ring follows cinematic victim placement and faces camera. |
| `attack-charge-1793010132157.jpg` | Corrected charge at frame 70: floor ring and visible rising/converging streaks. | Sandbox uses reduced motion; this checks placement, not animated speed. |
| `attack-idle-1793009486154.jpg` | Beam fixture overlapping the emitter: direction-aligned white core and coloured sleeve. | Injected projectile for visual inspection, not a simulation launch. |

Run `scripts/review/attack-effects.mjs` with the usual `RIFT_TOOLS`, `RIFT_BASE`, `SHOTS` environment settings. Browser exceptions are recorded in the adjacent JSON report.

The first charge capture exposed streaks being overdrawn by opaque arena surfaces; energy materials now explicitly enter the transparent pass while retaining depth testing. A regression assertion checks this material contract.

New effects are pooled and update presentation only. Capture orbs are suppressed during capture choreography; super-attack orbs remain. Capture's existing collision-sized travelling ring is preserved. Charges reset on state exit and reduce to static sparse streaks with Reduce motion. Existing character-specific cinematic slashes, spirits and other accent effects remain.

Weakest evidence: normal-speed charge buildup, release transitions and the late capture fade still need a human play check. These screenshots do not certify source-game fidelity or animation quality.

Validation: 423 tests pass. Both capture reports contain zero browser exceptions. The earlier charge image is retained as before-fix evidence.
