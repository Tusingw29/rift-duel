# Blender pipeline verification — October 21, 2026

- Host: Intel MacBook Air, 8 GB RAM, Intel HD 6000, macOS 12.7.6.
- Installed Blender 4.5.12 successfully created geometry and saved a blend file, but glTF export failed on its NumPy/Accelerate library dependency. No changes were made to that application.
- Official Blender 3.6.22 was run temporarily from its mounted disk image. It built the mesh, saved editable source and exported the complete GLB successfully.
- Seven clips: Idle, Advance, Retreat, Circle, Guard, Combo, Recoil. Existing authored motion is baked at 60 Hz; the model adds independent foot bones and limits excessive ponytail rotation. This is a motion-transfer baseline, not newly authored choreography.
- Automated GLB checks validate embedded textures, bounded finite vertex positions, normalized skin weights, seven separate animation tracks, finite animation values, increasing key times and all three combo contact timestamps.
- Chrome loaded the exported GLB and exercised clip selection, pause, scrubbing and camera presets. Front and rear views were inspected. Sampling 13 points per clip after the foot-bone fix kept the mesh's lower bound above the floor. This is not an exhaustive collision or cloth-intersection test.
- 193 project tests passed during the workflow; the GLB-specific tests are rerun after final asset corrections. GitHub Actions also runs the full suite before publication.

The visual target remains unfinished. The silhouette is still a simplified model interpretation; facial integration, hands, garment folds and body proportions need further art review. No live combat rig, hitboxes or controls were replaced. The study page is the review deliverable; the saved blend file is the editable authoring source.


## Motion study 2

User feedback drove a crossed-body guard, asymmetric step-and-follow locomotion, ankle yaw/pitch around the ball of each shoe during punches, lateral pelvis shifts and a recoil catch step. Combo contact frames remain 5, 25 and 45. Clip lengths now allow 0.9s advance, 1.0s retreat, 1.1s circle, 1.6s guard entry/hold/release and 0.9s recoil/recovery.

Four new tests check forearms crossing in front of the chest, fixed leg lengths, foot separation, stationary ball pivot during the driving punch, distinct foot lifts, loop closure and rear-foot restoration after recoil. Browser scrubbing sampled 25 times per clip with fresh skeleton updates and recomputed skinned bounds. Minimum mesh heights ranged from 0.009 to 0.031 units, above the floor. This replaces the first review's weaker cached-bounds measurement; it still does not establish collision-free clothing or aesthetic quality. Front guard and side combo were visually inspected.

## Concept model study 3

Rebuilt vest panels/armholes, rounded shoulder volumes, shorts coverage, continuous wrap surfaces, and a five-lock flattened ponytail. Added a nose and ears and fitted the painted face surface to the jaw profile. Preserved motion-source.json and all seven animation clips/contact times.

Chrome inspection covered front idle, crossed guard, side combo contact and back views. The earlier thigh skin holes and jagged vest-back intersection were absent in those inspected poses. Sampled 25 points per clip with fresh skinned bounds: minimum Y remained 0.009 or higher. Six asset/motion tests passed on the final export. The full project suite passed 203 tests before the final geometry export; unrelated HUD work was concurrent and was not included in this art commit.

This remains a simplified concept interpretation. Face shading/texture edges, mitten-like hands, cloth folds and shoulder integration are unfinished. Tests establish valid geometry and retained motion, not concept-art parity. The live game model is unchanged.

## Playable concept-model preview

Added opt-in `?tala=concept` surface replacement using the game's existing combat bones. Browser testing found that GLTFLoader sanitizes dotted bone names (`upper_arm.L` becomes `upper_armL`); the adapter normalizes these names. Chrome loaded the model in the menu and training and accepted advance/attack input from the lock-on camera. This verifies rendering and basic control flow, not final art quality or all cinematic poses.

Two tests load actual exported GLB geometry/skin data (omitting bitmap decoding in Node), verify original surfaces hide, aura/hand anchors remain, separate fighter and afterimage bindings are independent, and sampled live poses/root travel produce finite bounded vertices. The preview deliberately uses live combat animation rather than claiming that inspection clips have been integrated.

Final local suite: 206 tests passed. Chrome also accepted circle and guard input with the concept model loaded; no warning/error console messages were present during this training check. Physical controllers and every cinematic pose were not rechecked in this pass.

## Live crossed-arm guard

Replaced Tala's live fists-up guard with a crossed-body pose using the existing yaw/roll/elbow channels. Both forearms remain ahead of the chest during held guard and block recoil; entry and release use the existing transition system. New tests check opposite-side hand positions after world translation/rotation, depth separation, continuous release, and exact strike contact after guarding. All 208 tests passed. Chrome showed the guarding opponent in a Tala-versus-Tala concept-preview training match with no console warnings/errors. This closes the guard integration gap, not the separate locomotion/ankle/recoil gaps.

## Live concept-model ankle pivots

Registered the concept foot bones with the existing grounded solver. A foot orientation profile offsets the ankle target around the ball of the shoe before the existing leg solve; the fighter's collision position and punch channels are unchanged. Normal grounded poses level the soles, and strike recovery levels them again. Shared airborne states retain the existing foot-reset path.

All 209 tests passed. The asset test checks all three strike contacts, including translated/rotated/scaled rigs: planted ball drift under .002 units, driving heel rise over .08 units, frozen-frame quaternion stability, recovery leveling, and every vertex of the shoe mesh above the floor at contact. Chrome exercised advance/attack in Tala-versus-Tala training and showed grounded shoes with no console errors. A normal-speed visual assessment of every transition and the remaining step-and-follow/recoil choreography is still outstanding.

## Neck motion and defensive tuck

Tala's guard now retracts and lowers the head with a stronger chin-down angle. Block recoil deepens that brace instead of lifting the chin as the old pose did. Head pitch has a bounded delayed response to torso lean, and yaw lag is bounded to avoid excessive neck rotation. Head-position offsets participate in the transition between grounded and shared actions, preventing a positional pop when guard changes to an aerial/fallback pose.

All 210 tests passed. Added assertions for neck retraction, stronger impact tuck, smooth handoff and restoration of the neutral neck position. Chrome displayed the defending Tala in live concept-preview training with no warning/error console messages. This changes the live pose system for both Tala models; the offline Blender study export has not been regenerated.

## Live recoil catch-step

The concept model now solves grounded hurt poses with a planted front support and rear catch/return step. Repeat hits retain the current offset rather than snapping back. Long stuns hold the caught stance until recovery. The renderer applies hurt tilt before the animation solve; hurt-foot orientation excludes the torso's sideways lean so the soles can stay level.

All 212 tests passed. Tests verify front-foot drift under .003, rear-foot displacement over .17, foot lift over .04, restoration within .003, frozen-frame stability, repeated-hit continuity and long-stun hold. The live rig test includes the renderer's .15-radian hurt tilt. Chrome training accepted an attack against idle Tala, showed damage and return to stance, and emitted no console warnings/errors. That browser observation does not establish normal-speed artistic quality for every hit/recovery transition. Live step-and-follow locomotion remains unfinished.

## Live directional gait

Added concept-preview step-and-follow targets for advance, retreat and both circling directions, shorter entry steps, directional stride lengths, restrained arm swing, touchdown and stop settling. Testing caught support-leg overreach during retreat and crossing/overreach during circling; revised entry timing, lateral spacing and circle stride addressed the sampled failures. Unreachable support releases also update the gait contact state.

All 215 tests passed. New tests exercise directional lead selection, retained support contacts, grounded touchdown, no crossed feet, and live-rig movement at 3.6 world units/second through all four directions with ankle heights above .13. Stop tests verify return to .14 ankle height. Chrome ran W/S/A/D movement and stops in a concept-preview training match with no console warnings/errors. This is not a claim that every speed, turn, controller input, or artistic transition is verified; normal-speed feel and broader movement paths still need review.
