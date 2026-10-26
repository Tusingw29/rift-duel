# Deformation layer on the textured bodies — 26 October 2026

All six Design 03 bodies now carry 61 bones: the 17 control bones the animators drive, plus pelvis, split spine, neck, collarbones, thirty finger joints, toes, arm twist helpers and a ponytail chain, installed under the control bones at load. Nothing in the animators changed; the shared adapter distributes spine and neck rotation, rolls the wrists from the authored channel, and curls or opens the fingers relative to the bind fist.

| File | Reading |
| --- | --- |
| `fists-v3-idle-front`, `fists-v3-idle-hands` | Tala's textured body with per-finger joints: fists upright at the chin, knuckles forward. The fingertips sit slightly proud of the fist; that is the builder's bind curl (unchanged from before the layer) and is the next tuning item. |
| `fists-v3-guard-front` | Crossed guard, knuckles out; forearm twist helpers carry the wrist roll into the wraps. |
| `fists-v3-contact1-side` | Right straight at contact, palm down, elbow extended; spine twist now shared across lower spine, chest and upper spine. |
| `rv-rei-*` | Rei on the layered body: idle, guard, first cut and run; same silhouettes as before, hands now closed by finger joints with the rule-driven wrist. |

Verification: `tests/fighter-v3.test.mjs` (bind pose within a millimetre, weapons, costumes, animation finite) and `tests/tala-graphic.test.mjs` pass on the new assets; `tests/tala-fists.test.mjs` still holds. Normal-speed verdict needed.
