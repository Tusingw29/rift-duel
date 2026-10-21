# Animation, Skeletal Rigging, and glTF 2.0 Pipeline Reference

## 1. Game-ready armature principles

1. Root bone at world origin with identity transform; parent Hips to it. Root carries root motion, Hips carries centre-of-mass oscillation.
2. Max 4 bone influences per vertex (`vec4 skinIndex/skinWeight`). Enforce `vertex_group_limit_total(limit=4)` and `vertex_group_normalize_all()`; export with `export_all_influences=False`.
3. Consistent bone roll so knees and elbows bend on one axis under quaternion slerp (`EditBone.align_roll`).
4. Separate deforming bones (`DEF-*`, `use_deform=True`) from controls (`IK-*`, `MCH-*`, `CTRL-*`, `use_deform=False`) and export with `export_def_bones=True`.

Rift Duel: the combat skeleton is 15 deforming bones plus two foot bones, named `root, chest, head, upper_arm.L/R, forearm.L/R, hand.L/R, thigh.L/R, shin.L/R, ponytail, sash, foot.L/R`; the game maps GLB bones to its own skeleton by these names.

## 2. Programmatic armature and IK (pattern)

Create `bpy.data.armatures.new`, enter edit mode, add `DEF-Root`, `DEF-Hips`, `DEF-Thigh.L` (slight forward bend for solver stability), connected `DEF-Shin.L` and `DEF-Foot.L`; non-deforming `IK-Foot.L` and `IK-PoleKnee.L`; in pose mode add an `IK` constraint on the shin (`chain_count=2`, pole target, `pole_angle=-90°`) and `COPY_ROTATION` on the foot from the IK target. On 4.x assign bones to `armature.collections` ("DEF", "IK").

## 3. Actions and NLA strips for export

- Pose bones use `rotation_mode='QUATERNION'`.
- Key full TRS at clip start and end for seamless loops.
- One NLA track per clip, `blend_type='REPLACE'`, `action.use_fake_user=True`; export with `export_animation_mode='NLA_TRACKS'` (4.x) or `export_nla_strips=True` (3.6), as the project build already does.

## 4. Baking IK and constraints to deforming bones

`bpy.ops.nla.bake(frame_start, frame_end, step=1, only_selected=True, visual_keying=True, clear_constraints=False, use_current_action=False, clean_curves=True, bake_types={'POSE'})` with only `DEF-*` bones selected. glTF only stores TRS keys and morph weights.

## 5. Shape keys (morph targets)

Create `Basis` first; name targets with ARKit/Three.js ids (`jawOpen`, `eyeBlinkLeft`, `mouthSmileLeft`…); apply vertex-count-changing modifiers before adding keys; in Three.js use `morphTargetDictionary` and `morphTargetInfluences`.

## 6. Production GLB export (version-safe)

```python
def export_production_glb(filepath, use_draco=False):
    kw = {"filepath": filepath, "export_format": 'GLB', "use_selection": False, "use_visible": True,
          "export_apply": True, "export_yup": True, "export_texcoords": True, "export_normals": True,
          "export_tangents": True, "export_materials": 'EXPORT', "export_colors": True, "export_skins": True,
          "export_def_bones": True, "export_all_influences": False, "export_morph": True, "export_morph_normal": True,
          "export_animations": True, "export_animation_mode": 'NLA_TRACKS', "export_force_sampling": True,
          "export_optimize_animation_size": True}
    if use_draco:
        kw.update({"export_draco_mesh_compression_enable": True, "export_draco_mesh_compression_level": 6,
                   "export_draco_position_quantization": 14, "export_draco_normal_quantization": 10,
                   "export_draco_texcoord_quantization": 12})
    valid = bpy.ops.export_scene.gltf.get_rna_type().properties.keys()
    bpy.ops.export_scene.gltf(**{k: v for k, v in kw.items() if k in valid})
```

Rift Duel does not vendor Draco/Meshopt/KTX2 decoders, so keep compression off and pack textures as JPEG inside the GLB.

## 7. Post-export compression (when a decoder is available)

`gltf-transform optimize input.glb out.glb --compress meshopt --texture-compress ktx2 --texture-size 2048` (Meshopt + KTX2 decode 3–5× faster than Draco on the client).
