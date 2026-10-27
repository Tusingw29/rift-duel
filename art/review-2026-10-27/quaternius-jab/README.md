# QUATERNIUS-JAB: Quaternius jab on Tala's strike 1 (2026-10-27)

**Status: Review — awaiting Adam's normal-speed verdict.** Branch `claude/quaternius-jab`, not merged to main. The jab shows only with the imported switch (`&anim=imported`); authored is still the default everywhere. `dist/combat.js` and all combat timing are untouched.

## Watch it

Serve the branch (`python3 -m http.server 4194` in the worktree), then open:

- **Jab:** `http://localhost:4194/dist/sandbox.html?scenario=strike1&p1=2&p2=1&anim=imported`
- **Current first punch (authored, the default):** the same link with `&anim=authored`, or the Animation selector in the sidebar.
- **The CMU straight from MOCAP-COMBAT:** add `&jab=0` to the imported link.

## Source

- Quaternius Universal Animation Library, Standard pack, `Punch_Jab`. CC0 (opengameart.org/content/universal-animation-library).
- Exported by Adam from Blender 3.6, Y-up, with the bones renamed to CMU names. 24 fps, 21 frames.
- The BVH stays outside the repo in `~/rift-tools/mocap/quaternius`. Only the generated clip `dist/clips/import/jab.js` is committed. `scripts/mocap/export-quaternius-jab.sh` regenerates it.

## The four known issues

1. **Standing one-shot conversion.** `--mode strike` already exists from MOCAP-COMBAT. It holds heading from the guard and marks the impact, with no floor-work facing blend, so the jab uses it. `--mode oneshot` now refuses to run without `--pelvis-frame` and points to `--mode strike`. The get-up export, its only user, already passes the flag.
2. **Lean −0.23: real, not a flipped axis.**
   - **Forward axis checked.** In the body frame the guard hands sit in front of the hips (z +0.4), the jabbing wrist reaches z +1.14, and the left foot leads. A flipped forward axis would put all of these behind.
   - **Where the lean comes from.** The stylised rig's chest joint (Spine1) sits 0.18 behind the hips at guard, while the neck is only 4° back (hips-to-neck −0.07) and sits over the feet. CMU boxers read +0.14 to +0.32, leaning forward.
   - **Why it doesn't show.** The runtime uses only the change from the clip's own guard. The constant backward offset cancels out, and the jab adds +0.08 of forward lean at contact.
3. **Hand.** Tala's strike 1 punches with the right (rear) hand, and the source is a left jab, so the clip is exported with `--mirror`. Mirroring also makes the clip's own stance southpaw, so the runtime keeps Tala's own legs and feet. Her IK plants them, and the source's feet never leave the floor anyway.
4. **Contact frame.** Strike 1 is 9 / 3 / 16 frames (`docs/COMBAT_FRAME_BUDGETS.md`). The clip uses the same piecewise warp as the captured strikes (`clipU` in `dist/imported-combat.js`):

   | Clip | Simulation |
   | --- | --- |
   | Source frames 0–4, guard to arm straight | Frames 0–9 (startup); 0.17 s plays in 0.15 s, so it's near real time |
   | Contact | Held through the 3 active frames and any hitstop (the move frame stops) |
   | Source frames 4–19, back to guard | The 16 recovery frames (2.3× faster than the source) |

   The arm is straight on simulation frame 9, the damage frame. The move starts on scenario frame 2, so contact is scenario frame 11.

## Runtime (`dist/imported-motion.js`)

- **`importedJabPose`:**
  - The spine, arms, head and pelvis turn are deviations from the clip's guard, added to Tala's stance.
  - Her legs are her own.
  - The hips move forward by the clip's own drive, scaled to her legs.
  - The clip has no hand or collarbone data, so her wrists and right collarbone turn over toward her authored contact as the arm extends.
- **`importedJabWeight`:** gives the shared foot hook the jab's hips with zero foot offsets. Without it, the authored weight transfer would step her in under the imported arm.
- **Wiring:** `tala-animation.js` routes imported strike 1 to the jab before the CMU clip, and strikes 2 and 3 still play the CMU captures. `jabState.enabled` (sandbox `&jab=0`) restores the CMU straight.

## Evidence

Side camera, real simulation, strike 1 against Aegis. All three versions use the same frames:

| Scenario frame | Move frame |
| --- | --- |
| 2 | Start |
| 6 | Wind-up |
| 9 | Late wind-up |
| 11 | Contact |
| 14 | End of active |
| 18, 24 | Recovery |
| 30 | End |

- `strike1-strip-A-authored.jpg`, `strike1-strip-B-quaternius-jab.jpg`, `strike1-strip-C-cmu-straight.jpg`: full strips.
- `strike1-contact-A-B-C.jpg`: frames 6, 9, 11 and 14 at full size. `strike1-recovery-A-B-C.jpg`: frames 18, 24 and 30. Rows are A authored, B jab, C CMU.

What I checked in the captures:

- **Wrong hand:** no. The jab uses the same right arm as the authored strike 1, and the left hand holds guard.
- **Arm through the body:** no. On frame 9 the punching forearm passes in front of the guard hand on its way out, crossing the guard but not the torso.
- **Feet sliding:** no. Both ankle targets stay within 0.03 of where they started through the whole move (test). The strips show the stance unchanged.
- **Backward lean:** no. She stays upright. The source's backward offset cancels out, as described above.
- **Back to guard:** cleanly by frame 30.

**Main defect: short reach and no body.** At contact, distances forward of Tala's root along her facing:

| Version | Punching arm | Hips | Head |
| --- | --- | --- | --- |
| Authored | 1.54 | 0.45 | 0.85 |
| Quaternius jab | 0.94 | 0.05 | 0.18 |
| CMU straight | 0.90 | 0.26 | 0.17 |

The Quaternius jab is a stand-up arm punch: almost no hip drive, no knee load, no lean. Its fist stops about 0.6 short of where the authored punch lands, about the same as the CMU straight. It reads as a quick flick rather than the "load from the feet" Adam asked for.

- **Workbench sliders.** "Mocap reach" and "Wind-up curve" in `anim-workbench.html` (view B, imported) can add drive.
- **Tweak layer.** Impact-key tweaks on `lean`, `bodyZ` and `hipYaw` move the jab like any other strike.
- **Not done.** I didn't hand-tune either; the verdict comes first.

## Tests

606 pass. That's 600 on main plus 6 in `tests/quaternius-jab.test.mjs`:

- the clip loads with its CC0 source and the right hand punching
- only Tala's grounded strike 1 takes the jab
- the arm is straight on frame 9, held through active, back to stance at the end; the 9/3/16 budget is asserted unchanged
- the pose is a function of the move frame, so hitstop holds it, and replay equals step on two fresh rigs
- the feet stay planted
- the default path is unchanged: authored strike 1 ignores the jab, and imported strikes 2–3 are identical with the jab on or off

`tests/mocap-combat.test.mjs` turns the jab off while it checks the CMU strike 1.
