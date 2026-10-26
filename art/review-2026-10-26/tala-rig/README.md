# Graphic Tala — articulated combat rig

Actual runtime model, not generated concept art. Upgrades the 17-role skin to 61 deformation bones while retaining the simulation, damage frames and the original named combat roles. Other model variants retain their old rig.

## Changes and verification

Separate pelvis, lower/upper spine, neck, clavicles, upper-arm/forearm twist helpers, independent wrists, three joints per finger/thumb, toes, and two more ponytail segments. Torso/neck/limb/toe/hair weights redistributed. New finger geometry curls into fists and opens for ranged moves. Idle/movement fists are raised. Wrist turns blend into guard and reach the straight-punch target at contact; thumbs fold across the fingers. The foot solver now works relative to each thigh's parent, preserving the pelvis hierarchy. The expanded GLB carries the same 21 named clips sampled from the live animator.

414 tests pass. Tests verify bind pose, normalized weights, bounded vertices across every action, all 61 exported/live bone transforms, shader cloning, hair roots, finger articulation, neck/spine participation, thumb direction, toe counter-roll, exact three-hit combo contacts and deterministic gait switching. These checks do not establish normal-speed animation quality.

## Release captures

| View | Capture | Reading / weakest area |
| --- | --- | --- |
| front | [image](tala-release-front-1792982981569.jpg) | Ready fists raised; shoulders still need costume seam polish. |
| face | [image](tala-release-face-1792982981569.jpg) | Neck and head remain attached; angular jaw is unchanged. |
| back | [image](tala-release-back-1792982981569.jpg) | Segmented ponytail and vest silhouette; vest hem remains geometric. |
| hands | [image](tala-release-hands-1792982981569.jpg) | Closed fingers and inward-facing fists; segment joins still visible close up. |
| advance | [image](tala-release-advance-1792982981569.jpg) | Raised hands with planted-foot solve; needs normal-speed push-off review. |
| retreat | [image](tala-release-retreat-1792982981569.jpg) | Feet retain spacing; reverse mocap remains a separate experimental choice. |
| circle | [image](tala-release-circle-1792982981569.jpg) | Lateral placement retained; foot rhythm needs normal-speed review. |
| guard | [image](tala-release-guard-1792982981569.jpg) | Crossed arms with tucked head; armhole seams remain visible. |
| guard-side | [image](tala-release-guard-side-1792982981569.jpg) | Brace depth from side; hand/forearm overlaps need human review. |
| contact-1 | [image](tala-release-contact-1-1792982981569.jpg) | Straight contact at damage frame; shoulder skin is the weakest area. |
| contact-2 | [image](tala-release-contact-2-1792982981569.jpg) | Cross contact at damage frame; upper-body twist spread over the spine. |
| contact-3 | [image](tala-release-contact-3-1792982981569.jpg) | Hook contact at damage frame; follow-through and hair need normal-speed review. |

The `rig-first` report records a failed bone mapping (invalid images discarded) because GLTFLoader sanitizes dotted names. The corrected attachment explicitly maps both spellings; `rig-fixed` captures preceded the higher ready fists and thumb correction. `hands` close-ups show the corrected thumb/fist shape. Release captures use the final wrist interpolation and toe counter-roll.

Limits: no facial-expression rig, finger geometry is still simple, costume seams are not fully resculpted. The richer skeleton supplies deformation/control; it does not automatically author better fight choreography. No change to the default locomotion source. **Awaiting normal-speed verdict** before applying this rig to the roster.
