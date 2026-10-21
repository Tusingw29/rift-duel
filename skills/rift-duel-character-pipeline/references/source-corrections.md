# Corrections to the supplied master document

Adapted from `ultimate_blender_animation_threejs_skill-2.md`, reviewed 2026-10-21. Preserve the original and the separately edited generic project skill. This is a focused Rift Duel adaptation, not a verified universal Blender 4.x library.

| Source issue | Correction |
| --- | --- |
| Hair helper never connects texture color/alpha | Use an actual RGBA atlas and explicit shader links; verify exported MASK and visible cutouts. See art-and-motion.md. |
| `welded_islands` calculated but unused | Report counts per intended component. Use current connected-body tests. Separate hair, eyes, garments and batched wraps are not automatically errors. Coincident positions are a diagnostic approximation, not proof of welded topology. |
| Export continues after errors, including missing bones | Separate audit from promotion. The bundled checker exits nonzero on contract errors and writes no model. Runtime deformation tests remain a separate gate. |
| Bone names checked on all authoring armatures | Check joint lists actually used by exported skins, per skin. A global union can hide an invalid skin; absent skins must fail. |
| Weight clamp counts all vertex groups | Count only actual deform-bone groups. Bake/mask groups are not skin influences. Normalize retained weights and check zero-weight vertices. Avoid blind auto-fixing. |
| Fixed neck/clavicle/toe recipes | Tala lacks those bones. Use current head/chest and foot pivots, or coordinate a real rig migration. |
| Missing tangents always break normals | The vendored shader supports derivative tangent frames. Verify bake parity, UVs, triangulation and normal orientation; export matching tangents when useful. |
| Detecting a transparency property guarantees MASK | Verify exported alpha mode and pixels for the actual Blender/exporter version. Preserve PNG alpha rather than forcing JPEG. |
| `--jpeg-quality` selects JPEG without setting quality | A quality argument must reach a supported exporter property. The new checker has no pretend quality/export switches. |
| Apply all transforms automatically | Preserve the proven bind pipeline; make transform changes before binding or rebind and test deliberately. |
| Generic crossfades and mandatory extra anticipation | Preserve live damage-frame poses and input response. Embedded clips alone do not drive this game's fighting. |
| Hair cards guarantee a triangle/performance target | Measure primitives, triangles, texture memory, overdraw and real frame time. Targets are proposals, not proven performance. |

## Sources and limits

Prefer the vendored runtime: `dist/vendor/three.module.js` (`getTangentFrame`, `USE_TANGENT`), `dist/vendor/GLTFLoader.js`, `dist/tala-concept.js` and current deformation tests. For API changes, check matching official versions:

- [Blender 3.6 glTF manual](https://docs.blender.org/manual/en/3.6/addons/import_export/scene_gltf2.html): version-specific reference; this URL was unavailable during adaptation, so not evidence of a tested build.
- [Khronos glTF specification](https://registry.khronos.org/glTF/specs/2.0/glTF-2.0.html): alpha modes, accessors and skin joint lists.
- [Three.js documentation](https://threejs.org/docs/): compare with the vendored revision rather than silently upgrading.

The checker audits metadata, not full glTF validity, actual image alpha, weight values, topology, rendered appearance or motion. Decode/inspect assets and run project tests for those concerns.

Adaptation verification: seven checker behavior tests passed, including CLI failure status and unchanged input bytes. The current Tala GLB passed the metadata audit; all nine existing `tests/tala-design02.test.mjs` tests passed. No new Blender build or visual change was performed by installing this skill. These results validate the adaptation's tooling, not untested Blender examples from the source document.
