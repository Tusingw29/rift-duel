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
