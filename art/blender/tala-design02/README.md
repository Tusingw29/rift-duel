# Design 02 — head and neck surface study

This is a partial 3D implementation of the Design 02 concept, not the finished replacement character. It introduces a continuous shaped head/neck surface with cheek, socket, brow, nose and lip relief and a new original face-paint source. Body, costume and hair remain from the previous study.

Build with compatible Blender 3.6:

```
blender --background --python scripts/build-tala-blender.py -- --design02
```

The flag writes this directory's editable `tala-study.blend` and `dist/assets/models/tala-design02.glb`. Omitting it retains the original study output. This variant uses the existing 17-bone combat mapping and sampled clips; no new combat timing is introduced.

Review at `/tala-blender.html?model=design02`. Use Inspect face, then compare front/profile and guard. The public fight continues to load the existing model.

Known limitations: sculpted geometry is still an analytic surface study, not finished facial edge-loop retopology; eyes/mouth have no independent animation; the face source still contains baked shading and fine pores; hair remains blocky and the neck/shoulder silhouette needs a further anatomy pass. Do not promote it as a full concept match based on tests.

Face source was created with the built-in image-generation tool from the original Design 02 reference. Exact prompt: [face-prompt.txt](face-prompt.txt). The source is packed into both Blender and GLB. No third-party face texture is used.

## Verification and remaining visual issues

Blender CPU front/profile renders below show the actual new mesh, not generated concept art. The nose and cheeks now have continuous geometry. Texture projection still leaves an obvious side-face transition, and the neck appears too long beside the old shoulders. These are unresolved art defects. Chrome connection timed out twice, so browser texture decoding, controls and visual playback are not verified for this variant. Existing 233 tests passed; two additional asset/actual-live-animator tests verify the embedded face material, 17-bone binding, finite deformation across review actions and retained guard tuck.

![Front Blender render](review-front.png)
![Profile Blender render](review-side.png)
