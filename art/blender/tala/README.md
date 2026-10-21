# Tala Blender study

Original model study based on Storm Circuit (concept A). The first pass has a fitted torso, open ochre vest with lapels, rust shorts, wrist/shin bindings, dark flat shoes and auburn ponytail. The painted face reuses the project's original generated Tala face asset.

This is a separate review asset, not a replacement for the live fighter. The animation is an editable bake of the existing Tala authored motion, retaining the 60 Hz strike timing and foot solve, with two added foot bones to keep soles level. It is not a new motion-capture performance or a completed concept-art match.

## Files and reproduction

- `tala-study.blend`: editable mesh, weights, armature, materials and seven animation actions. Face image is packed.
- `motion-source.json`: sampled world bone transforms from the existing game animator.
- `build-report.json`: export version and geometry/clip counts.
- `../../../dist/assets/models/tala-study.glb`: browser asset.
- Public review: https://tusingw29.github.io/rift-duel/tala-blender.html

From the repository root:

```sh
node scripts/sample-tala-motion.mjs
/path/to/Blender --background --factory-startup --python scripts/build-tala-blender.py
```

The script supports Blender 3.6 and newer export APIs; the complete export was verified with Blender 3.6.22. Blender 4.5.12 on this macOS 12 machine built and saved the model but failed when the glTF exporter imported NumPy (`_cblas_caxpy$NEWLAPACK` missing). Use a compatible Blender build; do not treat a successful `--version` or mesh command as a complete exporter compatibility test.

## Review scope

Inspect front, side and back, then all seven clips at normal and quarter speed. The timeline scrubs the actual GLB. Keep the game's contact times at 5/60, 25/60 and 45/60 seconds when editing the Combo action. The broad costume masses and deformation are the current focus; face integration, hand shape, cloth intersections and more expressive new choreography need further review. The game still handles procedural locomotion and combat; no runtime animation-controller migration is included here.
