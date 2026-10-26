# Tala fists and guard correction — 26 October 2026

Adam's screenshots showed the fists held like handlebars: back of the hand to the camera, thumbs up, elbows flared. The cause was that no pose carried a wrist angle; the hand kept the model's rest roll in every state, and the graphic rig's rule-driven roll was tuned for the punch, not the guard.

Change: a wrist-roll channel (`lw`, `rw`) was added to the pose system and authored per state. The ready stance now holds the fists upright at chin height in front of the chest with the elbows in and the palms facing each other; the crossed guard turns the knuckles toward the rival instead of the palms up; straights roll the knuckles over to land palm down and the hook lands palm in. Values were found by measuring the hand frame on the rig (`tests/tala-fists.test.mjs` asserts them). Punch timing is unchanged. The graphic rig's wrists, forearm twists and fingers follow the authored channel.

| File | Model | Reading |
| --- | --- | --- |
| `fists-graphic-idle-front`, `-idle-hands`, `-idle-side` | graphic 61-bone | Boxing stance: fists at the chin, knuckles forward, thumbs in. |
| `fists-graphic-guard-front`, `-guard-hands` | graphic | Forearms crossed, knuckles out. |
| `fists-graphic-contact1-side` | graphic | Right straight at contact, palm down. |
| `fists-v3-*` | textured Design 03 | Same poses on the default textured body (fingers are baked into its fist mesh). |

Still open: the textured head sits lower than the graphic one, so its fists read a touch high at the mouth; worth a small drop once the final Tala body is chosen. Normal-speed verdict still needed.
