# Motion capture into pose channels

`node scripts/mocap/bvh-to-channels.mjs --in take.bvh --out dist/clips/<name>.js --name <name> --source "<dataset, take, license>" [--keys 16] [--cycle auto|start:end] [--mirror] [--debug]`

- Parses BVH, runs forward kinematics, builds a pelvis-yaw body frame (X right, Y up, Z forward) and extracts lean, side, twist, head, arm and leg channels from joint directions; knee and elbow bends from the angle between segments. Root translation is discarded.
- Finds one stride from the left ankle crossing the pelvis; short takes use a half stride mirrored (`halfStrideMirrored` in meta). Pass `--cycle a:b` (frame indices from `--debug`) when auto-detection picks a bad stretch.
- Output is `[t, pose]` keys for `sampleClip`; `dist/locomotion-clips.js` applies them with the fighter's stance body height and reverses the cycle for retreat.
- Sources used: CMU via the cgspeed BVH conversion (`Shriinivas/cmubvh` on GitHub); CMU states the data is free for research and commercial use, cgspeed adds no restrictions. Record the take and license in `--source`.
- Keep takes under `~/rift-tools/mocap`; only the converted clips are committed.
- Studying a take instead of looping it: `--dump take.json` writes every frame's channels plus raw measurements (wrist and hip positions in the body frame, world hip and shoulder yaw, ankle heights); `node scripts/mocap/study-take.mjs take.json --signal rWrist.z --peaks 2 --before 48 --after 48 --step 4` finds events on a signal (`--valleys` for drops, `--at f1,f2` for explicit frames) and prints the surrounding channels as a table. Author key poses from those numbers. The cgspeed mirror serves its zips through the GitHub API (`gh api repos/Shriinivas/cmubvh/contents/Sequence-<range>/<subject>/Data/<subject>_<trial>.zip --jq .sha`, then the blob's base64 `content`); the raw host 404s.

## Tala comparison follow-up

Tala's `tala-blender.html?model=graphic&gait=mocap` viewer compares at the same timestamp and includes `TALA_TRANSITION_CLIPS` (live-only, not baked GLB clips). Changing gait invalidates the deterministic review replay even while paused. The Play link preserves `gait` into the main game; authored remains default.

Tala's procedural foot targets still override the captured lower-limb targets, making this a hybrid. Reverse-run retreat previously tilted the chin upward; `clipMovePose` now bounds head pitch against torso lean. Do not treat reversed run/adapted forward walk as dedicated combat backstep/sidestep capture.

## Segment export and the TALA-IMPORT-AB finding (2026-10-26)

- `--segment a:b --mode loop` cuts one step cycle (two lift-offs of one foot, or a single step-and-drag) from a stretch found by `scripts/mocap/find-footwork.mjs` (heading = where the guard hands point; travel classified advance/retreat/left/right). Contacts use the ball of the foot by height; `scripts/mocap/contact-timeline.mjs` prints them. Output keys carry pelvis sway, ankle paths relative to the travel line and contacts, in source leg lengths. `--mode oneshot --pelvis-frame` retargets floor work with the pelvis orientation in `bodyPitch/hipYaw/bodyRoll`. `scripts/mocap/export-tala-import.sh` regenerates Tala's comparison clips.
- Runtime: `dist/imported-motion.js` (Tala only, source `imported`). Feet are contact-locked; only each foot's excursion around its own mean stance is stretched (stretching the whole offset widens the stance until the solver releases the plant).
- Finding: the simulation moves fighters at 6.4 u/s, 6–20× any combat footwork in CMU, so a capture can only be played with a stretched stride and raised tempo; this skates and straddles. Mocap footwork needs a game-speed source. Floor work (the get-up) transfers better. See `art/review-2026-10-26/tala-import-ab/README.md`.

## Captured strikes (MOCAP-COMBAT, 2026-10-27)

- Find strikes with `node scripts/mocap/find-strikes.mjs <dump.json> --kind punch|kick|cut`. It reports lead or rear side, signed hip drive toward the target (`toward`), drop, and wind-up and settle frames. CMU boxers switch stance mid-take, so pick by **side**, not by hand, and mirror with `--mirror` when the stance is the opposite of the fighter's. Finder frames are 1-based; the exporter takes 0-based indices.
- Export with `--mode strike --segment a:b --impact i --hand r|l --type ...` (see `scripts/mocap/export-combat-clips.sh`). Trim `b` before the boxer's next action: takes run straight into the next punch.
- Runtime: `dist/imported-combat.js`. Piecewise time warp (wind-up to startup, impact held through active and hitstop, follow to recovery). Arms are rescaled onto the authored contact pose. Hips and feet come from the capture through the shared foot hook (`r.combatWeight`), so the chain advance absorption still applies.
- Gaps: CMU kicks travel 1–2 units (no grounded fit), and CMU swordplay (02_07–09) is slow sparring with no hip drive.
- Tune visually in `dist/anim-workbench.html`, not by editing numbers: keyed additive tweaks (`dist/anim-tweaks.js`), time-warp and lead sliders, trails and a centre-of-mass plumb line. Export into `dist/anim-tweaks-data.js`.
