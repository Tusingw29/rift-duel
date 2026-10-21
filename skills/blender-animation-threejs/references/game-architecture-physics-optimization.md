# 3D Web Game Architecture, Physics, Character Controllers, and Optimization Reference

## 1. Fixed-timestep loop with interpolation

Accumulate clamped frame delta (`min(delta, 0.1)`), step the simulation at `1/60` up to a max sub-step count, then interpolate visuals with `alpha = accumulator / step`. Rift Duel's `dist/main.js` already runs the combat simulation at 60 Hz with an accumulator and hitstop; keep that contract when adding systems.

## 2. Kinematic character controller (Rapier)

`RigidBodyDesc.kinematicPositionBased()` + capsule collider; `world.createCharacterController(0.01)` with `enableAutostep(0.35, 0.2, true)`, `enableSnapToGround(0.3)`, slope limits 50°/55°; integrate gravity on a vertical velocity, `computeColliderMovement`, read `computedGrounded()`, apply `computedMovement()` via `setNextKinematicTranslation`.

## 3. Animation state machine

`AnimationMixer` with one action per clip; `transitionTo(name, fade=0.18, loopOnce)` does `reset()`, loop mode, `play()`, then `crossFadeTo`; scale `timeScale` of Walk/Run by horizontal speed over a base speed, clamped 0.6–1.5.

## 4. Fast raycasting

Patch `BufferGeometry.prototype.computeBoundsTree/disposeBoundsTree` and `Mesh.prototype.raycast = acceleratedRaycast` from `three-mesh-bvh`; compute bounds trees on static environment meshes once.

## 5. Instancing and batching

`InstancedMesh` for many copies of one geometry+material; `BatchedMesh` (r160+) for many geometries sharing one material in one draw call with per-instance culling.

## 6. Performance budget scorecard

| Metric | Desktop | Mobile / standalone VR | Mitigation |
| --- | --- | --- | --- |
| Draw calls / frame | < 150 | < 50 | merge statics, instancing, batching, atlases |
| Visible triangles | < 500k | < 150k | LOD, simplify, bake normals |
| Texture VRAM | < 256 MB | < 96 MB | KTX2, 2048 hero / 1024 props |
| Active skinned meshes | < 30 | < 10 | VAT crowds, < 55 bones per rig |
| Real-time shadow casters | 1–2 lights | 1 light + baked AO | tight shadow frustum, 1024–2048 map |
| Post-processing | one merged pass | bloom only or none | combine effects in one pass |

Rift Duel status: two skinned fighters (Tala Design 02 ≈ 65k triangles, ten JPEG atlases, 3.8 MB), one shadow-casting sun at 2048, no post-processing.
