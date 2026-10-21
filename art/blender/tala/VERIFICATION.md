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
