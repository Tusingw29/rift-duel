# Weight, tells and falls — 26 October 2026

Adam's notes: the animation was stiff in the lower body, attacks had no readable wind-up or wind-down, and a knockdown just tilted the figure over like a toy. This pass measures real motion before authoring: nine CMU takes (boxing 14_01, punch 02_05, kick 74_03, jumps 13_11 / 16_05 / 75_01, falls 90_16 / 90_18, getting up 77_18) dumped frame by frame with `scripts/mocap/bvh-to-channels.mjs --dump` and read with `scripts/mocap/study-take.mjs`.

What the takes say, and what changed:

- **Punch**: the hips turn 0.8 to 1.3 rad before contact and carry about 60% of the shoulder rotation; the rear knee loads during the wind and extends through contact; the fist leaves the chamber only in the last third of the startup; the arm retracts over a quarter second while the hips stay turned. Tala's strikes now put the hips at 0.55 rad with the chest adding 0.5, the wind-up holds until 60% of the startup with the rear knee bent and the hips counter-rotated, the drive snaps in the last frame, the follow-through stays out for 40% of the recovery (the opening) before the retract. The roster factory, Aegis and Morrow use the same schedule and a shared rear-leg load.
- **Fall (90_18, pulled over backward)**: standing to floor in 0.5 s, legs thrown up and arms flung out at impact, a head whip, a short bounce, flat. The new `knockdownPose` plays hit, topple, slam, bounce, settle over the simulation's 0.55 s, pitching the root about the feet; `defeat` holds the settle with breathing. The root clamp keeps the lowest point of a skinned body on the floor.
- **Getting up (77_18)**: roll onto the side, knee under the hips, push up. `risePose` plays this over 0.45 s as a visual overlay when the simulation returns to idle, with the feet unplanted. A real get-up state with its own frames belongs to the combat rules (noted on the board for Codex).
- **Jump (13_11, 75_01)**: legs extend through the push-off with the arms swung up, knees fold to a tuck at the top, legs reach down and arms open before touchdown, then the knees take the weight over 0.22 s and the pelvis drops 0.2. `flightPose` and `landingAbsorb` now do this for every fighter; airborne feet pitch up so the shoe never dips under the floor on the last airborne frame.
- **Idle**: the roster and Aegis idles shift weight from foot to foot (alternating knees, hip drift, counter-twist) instead of breathing in place.

Second round (same day), after Adam's verdict that only the arms moved and the legs barely moved at the hips:

- **Weight rhythm on every fighter** (`dist/footwork.js`): measured against the boxing stance in 14_01, where the hips drift 0.6 sideways and 0.7 forward/back over three seconds and the pelvis yaw swings ±0.4 rad. `rhythmPose` rolls the weight from foot to foot (pelvis ±0.13 sideways, hips turning ±0.13 with it, chest countering, knees alternating and bouncing in double time), and `rhythmFootOffsets` taps the unweighted foot out and back (0.1 lift, 0.12 travel) once per half cycle of 1.15 s. Morrow and Aegis run it at 70% and 85%.
- **Connected pelvis**: `applyPose` now moves the pelvis toward the leading foot with every hip turn (0.16 per radian), so the legs answer a torso turn in any state, not only idle.
- **Rear foot under the punch**: on fighters without an articulated foot pivot the rear foot drives 0.2 forward and the front foot 0.06 as the punch extends; Tala and Morrow keep their ball pivots.
- Gait swing lift raised (0.18 to 0.24; Tala's step gait 0.10 to 0.15).
- The solver now exposes `r.footTargets` (solved ankle targets) and `r.footAnchors` (plant plus authored offset); the planted-ankle tests compare against those and separately assert the anchors persist.

| File | Reading |
| --- | --- |
| `tala-idle-front.jpg`, `tala-idle-side.jpg`, `strip-rei-idle-front.jpg`, `strip-rei-idle-side.jpg` | One rhythm cycle (10 frames over 1.05 s): weight rolls right then left, the free foot taps, knees pump. Stills understate it; at speed it is continuous. |
| `tala-straight.jpg` | Combo frames 0,2,3,4,5,6,8,11,14,19: three frames of chambered wind-up with the shoulder back and knees loaded, snap to contact, the arm held out through the opening, retract. |
| `tala-knockdown-rise.jpg` | Hit, topple, slam with the legs up, bounce, flat; then roll, kneel, crouch, stand. |
| `tala-jump-land.jpg` | Push-off, tuck, reach, landing absorb and recovery (the review camera follows the root, so the height is not visible here). |
| `strip-rei-strike1-side.jpg`, `strip-rei-knockdown-side.jpg` | The same on a roster fighter through the shared factory. |

Captured on `tala-blender.html?model=graphic` with `~/rift-tools/motion-strips.mjs` and on `fighter-review.html?fighter=rei&model=graphic` with `ZOOM=4.2 MODEL=graphic node scripts/review/review-strip.mjs`. Still to judge at normal speed; the sprite-sheet style holds (anticipation held, one or two frames of motion, held extremes) is the intent.
