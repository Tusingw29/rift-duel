---
name: blender-animation-threejs
description: Architect, script, animate, optimize, and debug 3D assets, procedural scenes, shaders, and interactive web games across Blender 4.x+ (and this project's pinned Blender 3.6), glTF/GLB pipelines, vanilla Three.js (WebGL/WebGPU), and React Three Fiber. Use whenever work touches Blender, bpy, BMesh, Geometry Nodes, rigging, armatures, NLA animation, keyframes, shape keys, glTF/GLB export, Draco/Meshopt compression, Three.js, Drei, Rapier physics, GLSL/TSL shaders, character controllers, or 3D web games.
---
# Blender, Animation, and Three.js

Provide end-to-end technical execution for 3D creation, skeletal/morph animation pipelines, custom shader programming, and high-performance interactive 3D web applications using Blender, glTF 2.0, vanilla Three.js and React Three Fiber.

## Rift Duel project notes (read first)

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

- `references/blender-4x-bpy-and-geonodes.md`: Blender 4.x API conventions, context-free `bpy.data` manipulation, `bmesh` topology, programmatic Geometry Nodes, Principled BSDF v2 socket mapping, EEVEE Next / Cycles.
- `references/animation-rigging-gltf-pipeline.md`: armature design, bone collections, NLA actions, IK baking, shape keys, coordinate conventions, production glTF export and compression.
- `references/threejs-r3f-and-shaders.md`: renderer and color management, WebGPU + TSL, `onBeforeCompile` PBR extension, R3F render-loop discipline, disposal.
- `references/game-architecture-physics-optimization.md`: fixed timestep with interpolation, Rapier character controller, animation state machine, `three-mesh-bvh`, `InstancedMesh` / `BatchedMesh`, performance budget scorecard.
- `scripts/blender_gltf_export_validator.py`: headless pre-flight that audits scale, UVs, bone influences and N-gons, then exports a GLB.

## Steps

1. **Classify the layer and coordinate space.** 1 unit = 1 metre. Blender is Z-up; glTF/Three.js are Y-up (`export_yup=True`). This project's authored rig coordinates are X right, Y up, Z forward and are rotated into Blender by the build script.
2. **Blender scripting.** Prefer `bpy.data` and `bmesh` over `bpy.ops`; apply scale and rotation; recalc normals; give every mesh a `UVMap`; feature-detect 4.x socket names.
3. **Rigging and export.** Deforming bones only, max 4 influences per vertex (normalised), quaternion rotation, one NLA track per clip, bake IK/constraints to visual keys, `export_def_bones=True`, `export_all_influences=False`, `export_force_sampling=True`.
4. **Three.js.** `SRGBColorSpace` output, ACES tone mapping, color textures sRGB and data textures linear, extend `MeshStandardMaterial` via `onBeforeCompile` rather than raw `ShaderMaterial`, dispose what you remove, clamp `delta`.
5. **Game architecture.** Fixed 60 Hz simulation with render interpolation, crossfaded animation states with speed-matched locomotion, BVH for raycasts, instancing for props, and the budget table in the optimization reference.

## Gotchas

- `bsdf.inputs["Specular"]` / `["Clearcoat"]` raise `KeyError` on 4.x; `["Specular IOR Level"]` / `["Coat Weight"]` do not exist on 3.6. Use the candidate-list helper.
- Unapplied scale skews `SkinnedMesh` bones and physics shapes. Apply before binding.
- Skinned or displaced meshes vanish at screen edges unless `frustumCulled=false` or bounds are expanded.
- `scene.clone()` breaks skinned meshes; use SkeletonUtils or this project's `rig-clone.js`.
- Shadow acne: tight shadow camera bounds, `bias=-0.0005`, `normalBias≈0.02-0.03` (already set in `dist/shading.js`).
- UV unwrapping before a bake splits vertices at seams; connectivity checks must merge coincident positions (see `tests/tala-design02.test.mjs`).
