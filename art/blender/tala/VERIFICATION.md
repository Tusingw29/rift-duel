# Blender pipeline verification — October 21, 2026

- Host: Intel MacBook Air, 8 GB RAM, Intel HD 6000, macOS 12.7.6.
- Installed Blender 4.5.12 successfully created geometry and saved a blend file, but glTF export failed on its NumPy/Accelerate library dependency. No changes were made to that application.
- Official Blender 3.6.22 was run temporarily from its mounted disk image. It built the mesh, saved editable source and exported the complete GLB successfully.
- Seven clips: Idle, Advance, Retreat, Circle, Guard, Combo, Recoil. Existing authored motion is baked at 60 Hz; the model adds independent foot bones and limits excessive ponytail rotation. This is a motion-transfer baseline, not newly authored choreography.
- Automated GLB checks validate embedded textures, bounded finite vertex positions, normalized skin weights, seven separate animation tracks, finite animation values, increasing key times and all three combo contact timestamps.
- Chrome loaded the exported GLB and exercised clip selection, pause, scrubbing and camera presets. Front and rear views were inspected. Sampling 13 points per clip after the foot-bone fix kept the mesh's lower bound above the floor. This is not an exhaustive collision or cloth-intersection test.
- 193 project tests passed during the workflow; the GLB-specific tests are rerun after final asset corrections. GitHub Actions also runs the full suite before publication.

The visual target remains unfinished. The silhouette is still a simplified model interpretation; facial integration, hands, garment folds and body proportions need further art review. No live combat rig, hitboxes or controls were replaced. The study page is the review deliverable; the saved blend file is the editable authoring source.
