# Snap and step — 26 October 2026

Follow-up to the weight pass, from the shared task list (stepping idle, burst-and-brake travel, two-frame whip with a locked hold, frame-one recoil, frame-bound jump squat and get-up).

- **Stepping idle and guard** (`dist/footwork.js`): while the weight sits on one foot the other lifts, moves to a new spot and re-plants there. The lead foot steps forward and home, the rear foot steps out-and-back and home, so the stance never drifts from the simulation position and a planted foot never skates (the displacement is constant between steps). Guard steps at 45%. A strike snaps the feet home; guard or a hit fades them over 0.12 s.
- **Strike schedule** (`strikeSchedule` in `dist/grounded-animation.js`, used by all six): the loaded wind-up is held until two frames before contact (long startups get an explicit hold key), a two-frame whip reaches the contact pose exactly on the startup frame, the extension is locked for up to four frames after the active window (the hitstop), then the follow-through stays open and the retract settles.
- **Recoil**: frame one is the full impact bend, no blend-in, and the pelvis shudders 2.5 cm side to side every frame for the first 0.1 s of hitstop.
- **Travel burst and brake** (`travelOverlay`): on any combat-travel path (circle step, pursuit, dash) the body leans into the acceleration with the pelvis dipping, then counter-leans with bent knees and a wider plant through the deceleration; the brake fades before the last frame so a pursuit's authored contact stays exact. Pursuit and circle travel also step with the gait solver instead of gliding on planted feet.
- **jumpSquat / getUp**: `squatPose` and `getUpPose` bind to the simulation states Codex is adding (frame counter if present, else the countdown timer, else a mid pose). Until those states land, the earlier overlays still cover the crouch and the rise.

| File | Reading |
| --- | --- |
| `tala-whip.jpg` | Combo frames 0–12: three held wind-up frames, two-frame whip, extension locked from frame 5 through 9. |
| `tala-recoil.jpg` | Hit at 0.25 s: the full bend on the first frame, held through the hitstop, then the settle. |
| `tala-idle-side.jpg`, `strip-rei-idle-side.jpg` | Stepping idle: a foot lifts, lands ahead or out, stays, then returns home. |
| `tala-circle.jpg` | Circle step from the front: lean into the push, knees and a wider plant on the brake. |
| `strip-rei-strike1-side.jpg` | Rei's cut with the same schedule and the rear foot driving under it. |

Captured with `~/rift-tools/motion-strips.mjs` and `scripts/review/review-strip.mjs`. 487 tests. Still to judge at normal speed.
