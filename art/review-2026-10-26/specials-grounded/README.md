# Specials, launches and grapples on the grounded rig — 26 October 2026

Adam: "some things are still the old animations — the combo and specials and getting knocked down or picked up." A state survey confirmed it: for the five roster fighters every special (shot, technique, launch, forward, back), aerial strikes and the aerial pursuit beats still ran on the old shared animator, and for all six so did the launch tumble, the evasive roll, the victory pose and both roles in a capture or super. All of it now runs on the grounded rig (`tests/specials-grounded.test.mjs` asserts no in-match state falls through).

- **Specials** (`specialPose`): one loaded / peak / follow triple per fighter for shot, launch, forward and back (as the old animator used one pose per fighter), with per-kind body modifiers (shot leans in, launch rises, forward lunges, back retreats), plus a technique triple and effect overrides (kick, lance, fan, rise, sphere, wheel, drive, charge). Same schedule as strikes: held load, two-frame whip, peak locked through the active window; spinning techniques turn the whole body through it.
- **Launch tumble** (`launchedPose`): a full backflip about the hips landing on the back, so the fall continues from the slam without a pop.
- **Roll** (`rollPose`): tucked, one turn about the hips, clamped above the floor. **Victory** (`victoryPose`): the per-fighter poses from the old animator, on the grounded body with a settle and a breath.
- **Aerial pursuit** beats and aerial strikes sit on the flight pose.
- **Captures and supers**: the renderer now feeds `grapple` (actor) and `grappled` (victim) states during a cinematic; the actor braces and reaches, the victim flails, and the staging adds only the root motion and the actor's lifting arm.
- `fighter-review.html` gained all these poses in its dropdown (shot, technique, launch, forward, back, launched, roll, victory, grapple, grappled, knockdown).

| File | Reading |
| --- | --- |
| `strip-rei-technique-side.jpg` | Thousandth-cut spin: load, whip, the body turning through the active window, settle. |
| `strip-rei-launch-side.jpg` | Rising launcher: loaded low, up through contact with the chest opening. |
| `strip-rei-launched-side.jpg` | Being launched: the backflip about the hips, limbs thrown. |
| `strip-rei-grappled-side.jpg` | The victim's flail during a capture (root motion comes from the staging in a match). |
| `strip-aegis-technique-side.jpg`, `strip-aegis-forward-side.jpg`, `strip-aegis-roll-side.jpg` | Drive thrust held through its window, the forward lunge, the tucked roll. |

Still to judge at normal speed.
