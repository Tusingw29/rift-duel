---
name: blender-animation-threejs
description: HISTORICAL reference, not the current pipeline: Rift Duel builds fighters with Node/Three.js (use fighter-model-build). Only read for Blender, bpy or general Three.js background when Adam explicitly asks for Blender.
---
> Historical reference only (2026-10-25): the project builds characters with Node and Three.js, see `skills/fighter-model-build`. Blender sections are not part of the current pipeline.

# Blender, Animation, and Three.js

Provide end-to-end technical execution for 3D creation, skeletal/morph animation pipelines, custom shader programming, and high-performance interactive 3D web applications using Blender, glTF 2.0, vanilla Three.js and React Three Fiber.

## Rift Duel project notes (read first)

- For actual Tala work, follow `skills/rift-duel-character-pipeline` (the project workflow, with its tested metadata audit and source corrections). This skill is the generic code and reference library it draws on; where the two disagree, the project pipeline and current source win.

- The build machine is macOS 12 with Intel graphics. Blender 4.5's bundled numpy fails to load there, so local and cloud builds run **Blender 3.6.22** (`scripts/build-tala-blender.py`, `.github/workflows/tala-art.yml`). Write `bpy` code that works on 3.6 and 4.x: use the `set_socket` helper pattern from the references for Principled sockets, guard `surface_render_method` vs `blend_method`, and avoid 4.x-only APIs (`armature.collections`, `interface.new_socket`) unless feature-detected.
- The game vendors Three.js in `dist/vendor/` with no bundler. `GLTFLoader` is vendored; Draco, Meshopt and KTX2 decoders are **not**. Keep GLBs uncompressed, pack textures as JPEG/PNG inside the GLB, and keep each fighter under about 4 MB.
- Skinned fighters are attached to the game's own JavaScript skeleton (`dist/tala-concept.js`), cloned with the project's `dist/rig-clone.js` (the SkeletonUtils equivalent), and rendered with `frustumCulled=false`. Bone names must match the sampler in `scripts/sample-tala-motion.mjs`.
- Proportions and the surface bake are defined once and shared: `dist/tala-model.js` and the Blender build apply the same remap; `scripts/tala_design02_textures.py` bakes object-space procedural atlases per material before the per-material join.

## When to Use

- Writing headless Blender Python (`bpy`, `bmesh`, `mathutils`) for procedural modeling, Geometry Nodes, Principled materials, lighting, baking or batch rendering.
- Designing and debugging skeletal rigs, IK/FK chains, constraints, shape keys, NLA strips, or baking procedural animation for real-time engines.
- Exporting, compressing and validating glTF 2.0 / `.glb` assets.
- Building Three.js or React Three Fiber scenes, custom GLSL/TSL shaders and post-processing.
- Architecting 3D web games: fixed-timestep loops, character controllers, animation state machines, BVH raycasting, instancing and frame budgets.

## Reference Guides and Bundled Scripts

- `references/character-art-hair-cards-and-normals.md`: concept proportion matching, `bmesh` alpha-card hair strips (MASK/CLIP) with proxy normal transfer, procedural tangent-space normal maps (`export_tangents=True`), anatomical joint skin-weight falloffs, and combat body mechanics (planted feet, weight shifts, tucked-chin guard).
- `references/blender-4x-bpy-and-geonodes.md`: Blender 4.x API conventions, context-free `bpy.data` manipulation, `bmesh` topology, programmatic Geometry Nodes, Principled BSDF v2 socket mapping, EEVEE Next / Cycles.
- `references/animation-rigging-gltf-pipeline.md`: armature design, bone collections, NLA actions, IK baking, shape keys, coordinate conventions, production glTF export and compression.
- `references/threejs-r3f-and-shaders.md`: renderer and color management, WebGPU + TSL, `onBeforeCompile` PBR extension, R3F render-loop discipline, disposal.
- `references/game-architecture-physics-optimization.md`: fixed timestep with interpolation, Rapier character controller, animation state machine, `three-mesh-bvh`, `InstancedMesh` / `BatchedMesh`, performance budget scorecard.
- `scripts/blender_gltf_export_validator.py`: headless pre-flight with UV-seam-tolerant KDTree connectivity, required bone-list verification (`--required-bones`), weight clamping to 4 influences, automatic tangent export when normal maps are present, optional JPEG atlases, then GLB export.

## Steps

0. **Character art order.** Lock proportions and silhouette first, then face, then materials, then hair, then secondary effects. Hair is built in three alpha-card tiers over a dark scalp cap (base volume, mid clumps, fringe and flyaways) with MASK alpha and normals transferred from a head proxy. Add tangent-space normal maps (Non-Color, OpenGL +Y) and export with `export_tangents=True` so weave, seams and pores catch light. Weight joints with smooth asymmetric falloffs (shoulders blend onto clavicle/chest, elbows 75/25-50/50-25/75 across three loops, neck 60/40 with head, ankles 2-3 rings) and keep at most four influences. Combat clips keep stance feet world-locked, shift hips over the support foot before strikes, and tuck the chin behind the lead shoulder.

1. **Classify the layer and coordinate space.** 1 unit = 1 metre. Blender is Z-up; glTF/Three.js are Y-up (`export_yup=True`). This project's authored rig coordinates are X right, Y up, Z forward and are rotated into Blender by the build script.
2. **Blender scripting.** Prefer `bpy.data` and `bmesh` over `bpy.ops`; apply scale and rotation; recalc normals; give every mesh a `UVMap`; feature-detect 4.x socket names.
3. **Rigging and export.** Deforming bones only, max 4 influences per vertex (normalised), quaternion rotation, one NLA track per clip, bake IK/constraints to visual keys, `export_def_bones=True`, `export_all_influences=False`, `export_force_sampling=True`.
4. **Three.js.** `SRGBColorSpace` output, ACES tone mapping, color textures sRGB and data textures linear, extend `MeshStandardMaterial` via `onBeforeCompile` rather than raw `ShaderMaterial`, dispose what you remove, clamp `delta`.
5. **Game architecture.** Fixed 60 Hz simulation with render interpolation, crossfaded animation states with speed-matched locomotion, BVH for raycasts, instancing for props, and the budget table in the optimization reference.

## Gotchas

- Alpha-blend hair flickers in Three.js; use MASK/CLIP (`alphaTest≈0.5`, `depthWrite=true`, `DoubleSide`).
- Normal maps render flat or inverted without `export_tangents=True` or when the image is left in sRGB instead of Non-Color.
- Older-computer budget for this game: 15-25k triangles per fighter including 800-2,000 for hair cards, under 55 bones, 5-10 draw calls per character, no multi-pass post-processing. Tala Design 02 is currently about 65k triangles and should come down when hair cards replace the sculpted masses.

- `bsdf.inputs["Specular"]` / `["Clearcoat"]` raise `KeyError` on 4.x; `["Specular IOR Level"]` / `["Coat Weight"]` do not exist on 3.6. Use the candidate-list helper.
- Unapplied scale skews `SkinnedMesh` bones and physics shapes. Apply before binding.
- Skinned or displaced meshes vanish at screen edges unless `frustumCulled=false` or bounds are expanded.
- `scene.clone()` breaks skinned meshes; use SkeletonUtils or this project's `rig-clone.js`.
- Shadow acne: tight shadow camera bounds, `bias=-0.0005`, `normalBias≈0.02-0.03` (already set in `dist/shading.js`).
- UV unwrapping before a bake splits vertices at seams; connectivity checks must merge coincident positions (see `tests/tala-design02.test.mjs`).
