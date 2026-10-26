# Kinetic chain — 26 October 2026

Adam's direction: stop layering offsets on two-pose interpolations; every move must be a chain of full-body keys with momentum running feet → hips → spine → clavicles → shoulders → elbows → wrists, with the head countering. This pass rebuilds the sampling behind every strike and special, gives the swordsmen a real wrist, and re-keys the grapple and the fall.

- **Seven keys per strike and special** (`kineticKeys` in `dist/grounded-animation.js`, reached through `strikeSchedule` so all six fighters and every special use it): coil → drive (hips and chest whip toward the rival while the arms still trail at the load) → whip (clavicles, shoulders, elbows unhinge; wrists still cocked) → impact on the startup frame, locked through the hitstop → overshoot (chest past the line, knees absorbing) → recovery (hips settle first) → stance. Long startups hold the arms at the load until two frames before contact.
- **Per-segment lead** (`sampleSchedule`): feet and pelvis sample two frames ahead, spine one, clavicles half, arms and wrists on the beat (so the damage frame stays exact); the head counter-rotates against the chest turn. The foot pivot reads the same lead so the planted ball never slips.
- **Wrist hinge**: new channels `lwx/rwx` (flexion) and `lwz/rwz` (deviation) on every rig including the 61-bone bodies. Aegis's and Morrow's blades sit along the palm axis, so `rwx` of π/2 puts the blade in line with the forearm. Measured: blade·forearm 0.99 at every Aegis contact, 0.81 in guard; Morrow 0.83 in guard. Morrow's two-hand grip solver now keeps the striking hand's local hinge on the re-solved forearm with a low-behind elbow pole, so the blade runs forward and both hands close on the hilt (grip error 0).
- **Sword stances**: lowered centre of gravity, coiled torso, off hand up as a counter-balance (Aegis) or toward the hilt (Morrow); guards hold the blade angled up along the forearm across the body.
- **Grapple**: the actor reaches, drops the hips into a deep knee bend to grab, drives up through legs and spine with the arms overhead, throws with the chest whipping past the line, and counter-steps; the victim braces, then dangles (arched spine, head back, asymmetric knees, reaching arms), then flails on the throw.
- **Launch → fall → wakeup**: lift-off (pelvis up, spine arched, limbs trailing down), apex fold, back-first descent; slam, whiplash two to three frames later (head, arms, heels), a 15–20 cm rebound with the limbs splaying, settle; then roll to the side, hand plant with a straight arm, knee under, push the weight up over the planted foot, rise.

| File | Reading |
| --- | --- |
| `strip-aegis-strike1-side/front.jpg`, `strip-aegis-strike3-side.jpg` | Coil behind the shoulder, hips drive, two-frame slash, blade in line at impact, overshoot, recovery. |
| `strip-morrow-strike1-side/front.jpg`, `strip-morrow-strike3-side.jpg` | The same with the greatsword two-handed; the blade runs forward at contact with both hands on the hilt. |
| `strip-aegis-guard/idle`, `strip-morrow-guard/idle` | New weapon stances and guards. |
| `strip-rei-grapple-side.jpg`, `strip-rei-grappled-side.jpg` | Actor and victim sequences over the cinematic's progress. |
| `strip-rei-technique-side.jpg`, `strip-rei-shot-side.jpg` | Specials on the seven-key chain. |
| `strip-sol-defeat-side/front.jpg`, `strip-aegis-defeat-side.jpg` | Knockout collapse: the feet stay planted while the knees give out and the pelvis sinks, the body folds to a kneel, sits back, rolls onto its back and lies crumpled and still (no breathing). The floor clamp now measures the posed joints (mesh bounds included the hidden classic batch under the root, which hoisted every fallen body). At a KO the renderer runs the loser's timers on the cue clock, so an airborne loser comes down and slams and a falling one finishes the fall instead of hanging mid-air. |
| `strip-sol-launched-side.jpg`, `strip-sol-knockdown-side.jpg` | The six-stage launch, fall, whiplash, bounce and settle (the review page shows the get-up overlay after). |

518 tests; still to judge at normal speed.
