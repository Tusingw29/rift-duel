# WEIGHT-TRANSFER: ground-up power for grounded attacks (2026-10-27)

Adam played the build on 2026-10-27 and said the fighters "still move like Rock 'Em Sock 'Em Robots". They are not loading power from the feet or shifting weight through the whole body. The target feel is Soul Calibur supers crossed with Tekken combos: light footsies, then a burst into full-body motion.

**Status: awaiting Adam's normal-speed verdict.** These captures and tests show the mechanics only. They do not show the feel.

## What was wrong (measured on main)

- **Stiff body.** In Tala's three-hit combo the feet never left their spots, the hips stayed over the same point, and the torso stayed upright. Only the arms and a chest twist moved.
- **Root jump on chained hits.** The simulation advances the root up to 0.4 units toward the rival in one frame when a combo chains (`dist/combat.js`, unchanged). The planted feet were left behind. When one was out of reach, the leg solver dropped it under the knee, wherever the knee pointed. On the finisher that crossed Tala's feet, and Aegis had 21 such drops in one combo.
- **Heel snap.** The rear heel pivot snapped flat on the first frame of each chained hit, throwing the ankle up to 0.15 units.
- **Get-up through the floor.** The get-up pushed Tala's left foot 0.66 units below the stone at get-up frame 12. The imported version did the same at 0.31.

## What changed

- **Weight-transfer layer, `dist/weight-transfer.js`.** One curve per move, read from the simulation's move frame, so hitstop freezes it and replays match. It applies to every grounded fighter's strikes and specials.
  - **Load.** The weight sits back and down into the rear leg.
  - **Drive.** The lead foot lifts and steps in, and the hips drive forward and stay low. The rear ball stays planted while its heel pivots.
  - **Contact.** The hips are over the front foot with the chest leaning over it. The arms and head counter the extra lean, so the fist or blade and the eyes stay on target.
  - **Carry.** The weight rolls past the line and the rear foot is dragged in.
  - **Recovery.** Both feet step home.
  - **Lead-hand punches.** Tala's second hit pivots on the lead foot, so the weight rolls onto that foot without a step.
  - **Drive cap.** The authored pose's own lunge counts toward a hip-drive cap of 0.5, so the rear leg can keep its ball down.
- **Chain advance absorbed.** On the frame the root jumps, the foot anchors move with it but the feet and hips stay where they were. The step-in then pays the jump off: the lead foot first, the rear foot right behind it, and the hips through the drive. Each foot moves only while it is stepping, lifted, so nothing slides.
- **Unreachable feet drag, `dist/rig-pose.js`.** A foot the leg can't reach now slides along the floor toward the hips and its anchor moves with it. Before, it was dropped under the knee.
- **Heel pivot blends.** When one move chains into the next, the rear heel lowers over the new move's load instead of snapping flat.
- **Get-up floor clamp.** During the simulation's get-up state, no joint passes below the stone. This applies in both animation sources and for all six fighters.

## Captures

Each strip has two rows from the same simulation frames: BEFORE is main and AFTER is this branch. The columns are labelled with the combo hit and its frame.

| Fighter | Side camera | Fight camera (behind the player) |
| --- | --- | --- |
| Tala | `tala-combo-side.jpg` | `tala-combo-lock.jpg` |
| Aegis | `aegis-combo-side.jpg` | `aegis-combo-lock.jpg` |
| Morrow | `morrow-combo-side.jpg` | `morrow-combo-lock.jpg` |

To regenerate: serve main and the branch on two ports, then run `scripts/review/weight-transfer-strips.mjs` with the BEFORE and AFTER URLs.

## Measurements

| Check | Main | This branch |
| --- | --- | --- |
| Tala hips forward at contact, first punch | 0.18 | 0.45 |
| Tala lead-foot step at contact, first punch | 0 | 0.22 |
| Fastest hip move in one frame, any combo | 0.4 (root jump) | under 0.13 |
| Feet crossing during the combo | yes, on Tala's finisher | never (tested every frame) |
| Get-up lowest point, authored / imported | −0.66 / −0.31 | +0.05 / +0.07 |

## Tests

589 pass, with 13 new in `tests/weight-transfer.test.mjs` and `tests/getup-floor.test.mjs`. Tests that pinned the old motion were restated:

- **Release poses.** Tala's release poses now include the weight layer.
- **Morrow's feet.** They may lift while stepping but never go below the floor.
- **Stepping hook.** Both punches drive the hips over the front foot at contact, and the hook takes the longest lead step.

The Tala model's exported clips were re-baked with `scripts/refresh-tala-clips.mjs`. Geometry, rig and materials are unchanged.

## Known defects and open questions

- **Aegis's overhead finisher** now winds up low and compact, with the feet under the body and the hips sunk. Before, it held a wide lunge, partly by accident because the rear foot was left behind. It may read as a squat before the cut lands.
- **Footsies.** The idle and stepping rhythm were not changed in this pass. The contrast comes only from the attacks getting bigger.
- **Combat untouched.** Combat timing, hit boxes and travel are unchanged, and so is the KO collapse.
