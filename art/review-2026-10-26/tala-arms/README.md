# Tala arms and fist pass — 26 October 2026

Second pass after the deformation layer. Adam's shots showed the fists at eye level over the face and the bind fist leaving the fingertips splayed.

- **Stance re-measured**: lead (left) fist a little extended at jaw height, rear fist upright by the chin, elbows down and in (`stance` in `dist/tala-animation.js`, values found by searching the hand frame; `tests/tala-fists.test.mjs` updated).
- **Fist curl in the builder**: the curl now aims at the palm centre instead of the wrist (aiming at the wrist over-curled the tips into a claw) with 80°/95°/50° segments; index tip ends 0.56 units from the palm centre instead of 1.07. All six bodies and the graphic Tala rebuilt.

| File | Reading |
| --- | --- |
| `fists-v3-idle-front`, `-side` | Fists at the jaw, lead hand ahead, elbows tucked; face no longer covered. |
| `fists-v3-idle-hands` | Closed fists with the fingers folded into the palm; thumb across. |
| `fists-v3-guard-*` | Crossed guard, knuckles out, palms toward the body. |
| `fists-v3-contact1-side` | Straight at contact: straight wrist, palm down. |

Adam's screenshot of the graphic preview showed the arms as stretched spikes across the chest. Cause: the layered builder wrote right-side bones before left-side ones while the graphic builder assumed left-first indices, so the preview bound arm and hand vertices to the wrong side and its wrap filter dropped both forearm wraps. Fix: the graphic builder now remaps source joints by bone name (never by position), the layered builder writes left first to match the documented order, and a test asserts the wraps survive on the correct side. The `fists-graphic-*` files show the repaired preview; `fists-v3-*` the textured body on the same frames.

Still to judge at normal speed. The hand mesh is MakeHuman's detailed hand, so close-ups show individual folded fingers; from the fight camera it reads as a fist.
