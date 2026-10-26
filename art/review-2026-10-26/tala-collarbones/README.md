# Tala collarbones — 26 October 2026

First authored pass on the graphic Tala after the art-style decision. The 61-bone rig had clavicles, but they only followed a reach rule (arm raised = shoulder forward), so a straight punch read as an arm swinging from a fixed shoulder.

- **New channels** `lc`/`rc` in `dist/rig-pose.js`: collarbone protraction in radians, positive drives the shoulder forward. Zero leaves the combat rig's reach rule in charge, so poses that have not been authored (energy shot, travel, run) behave as before; 17-bone bodies ignore the channel.
- **Authored in `dist/tala-animation.js`**: stance 0.08/0.06, guard 0.14 both, charge and impact pulled back, each strike pulls the punching shoulder back on the wind (−0.08) and drives it to 0.32 (straights) or 0.22 (hook) at contact.
- **Mocap converter** emits the channels at zero; the four CMU clips regenerated with identical body values.
- **Graphic GLB rebuilt** (`?v=6`) so the baked review clips carry the collarbones; `tests/tala-graphic.test.mjs` asserts the punching shoulder leads at contact, the guard rounds both, and the rule still drives unauthored poses.

| File | Reading |
| --- | --- |
| `straight-strip.jpg` | Right straight from the side, combo frames 0,2,4,5,8,12,19: shoulder back on the wind, forward through contact at frame 5, retracting with the arm. |
| `collar-contact1-side`, `-front` | First straight at contact. |
| `collar-contact2-*` | Left straight at contact, mirrored. |
| `collar-hook-*` | Stepping hook: shorter protraction, shoulder turns with the chest. |
| `collar-idle-*`, `collar-guard-*` | Rest and guard protraction; compare against `../tala-arms/fists-graphic-*`. |

Captured on `tala-blender.html?model=graphic` with `~/rift-tools/collarbone-shot.mjs`. Still to judge at normal speed.
