# Blender 4.x+ Python (`bpy`), BMesh, Geometry Nodes, and Materials Reference

Production scripting patterns for Blender 4.0–4.3+ (headless automation, procedural topology, Geometry Nodes, Principled BSDF v2, EEVEE Next). Rift Duel builds run on Blender 3.6.22; everything here that touches 4.x-only names must be feature-detected.

## 1. Blender 4.x Breaking API Changes

| Feature | Blender 3.x | Blender 4.x+ |
| --- | --- | --- |
| Principled Specular | `inputs["Specular"]` | `inputs["Specular IOR Level"]` |
| Principled Clearcoat | `inputs["Clearcoat"]` / `Clearcoat Roughness` | `inputs["Coat Weight"]` / `inputs["Coat Roughness"]` |
| Principled Transmission | `inputs["Transmission"]` | `inputs["Transmission Weight"]` |
| Principled Sheen | `inputs["Sheen"]` | `inputs["Sheen Weight"]` |
| Principled Subsurface | `inputs["Subsurface"]` | `inputs["Subsurface Weight"]` + `Subsurface Scale` |
| Principled Emission | `inputs["Emission"]` | `inputs["Emission Color"]` + `inputs["Emission Strength"]` |
| Material transparency (4.2+) | `mat.blend_method = 'BLEND'` | `mat.surface_render_method = 'BLENDED'` or `'DITHERED'` |
| Material shadow mode (4.2+) | `mat.shadow_method = 'CLIP'` | `obj.visible_shadow` |
| Bone organisation | `armature.layers` / `bone.layers` | `armature.collections` (`BoneCollection`) |
| Node group sockets | `tree.inputs.new(...)` | `tree.interface.new_socket(name, in_out=..., socket_type=...)` |
| Auto smooth (4.1+) | `mesh.use_auto_smooth` | "Smooth by Angle" modifier or custom split normals |
| EEVEE id (4.2+) | `'BLENDER_EEVEE'` | `'BLENDER_EEVEE_NEXT'` |

## 2. Context-free scene reset

Avoid `bpy.ops.object.select_all()` / `delete()` in headless scripts; use `bpy.data`:

```python
import bpy
from mathutils import Vector, Matrix

def reset_scene():
    for obj in list(bpy.data.objects):
        bpy.data.objects.remove(obj, do_unlink=True)
    for coll in (bpy.data.meshes, bpy.data.materials, bpy.data.armatures, bpy.data.actions,
                 bpy.data.cameras, bpy.data.lights, bpy.data.node_groups, bpy.data.images):
        for block in list(coll):
            if block.users == 0:
                coll.remove(block)
    scene = bpy.context.scene
    scene.unit_settings.system = 'METRIC'; scene.unit_settings.scale_length = 1.0; scene.render.fps = 60
```

## 3. Procedural meshes with `bmesh`

Build with `bmesh`, recalc normals, create a UV layer, set smooth shading:

```python
import bmesh
def create_beveled_crate(name, size=1.0, bevel_offset=0.06):
    mesh = bpy.data.meshes.new(f"{name}_Mesh"); obj = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(obj)
    bm = bmesh.new(); bmesh.ops.create_cube(bm, size=size)
    bmesh.ops.bevel(bm, geom=list(bm.edges), offset=bevel_offset, offset_type='OFFSET', segments=2, profile=0.5, affect='EDGES')
    bmesh.ops.recalc_face_normals(bm, faces=list(bm.faces))
    uv_layer = bm.loops.layers.uv.verify()
    for face in bm.faces:
        n = face.normal; ax, ay, az = abs(n.x), abs(n.y), abs(n.z)
        for loop in face.loops:
            co = loop.vert.co
            if az >= ax and az >= ay: u, v = co.x/size+0.5, co.y/size+0.5
            elif ax >= ay and ax >= az: u, v = co.y/size+0.5, co.z/size+0.5
            else: u, v = co.x/size+0.5, co.z/size+0.5
            loop[uv_layer].uv = (u, v)
    bm.to_mesh(mesh); bm.free()
    for poly in mesh.polygons: poly.use_smooth = True
    mesh.update(); return obj
```

## 4. Applying transforms without `bpy.ops`

```python
def apply_transforms_to_mesh(obj, apply_loc=False, apply_rot=True, apply_scale=True):
    if obj.type != 'MESH': return
    loc, rot, scale = obj.matrix_basis.decompose()
    m = (Matrix.Translation(loc) if apply_loc else Matrix.Identity(4)) @ \
        (rot.to_matrix().to_4x4() if apply_rot else Matrix.Identity(4)) @ \
        (Matrix.Diagonal((scale.x, scale.y, scale.z, 1.0)) if apply_scale else Matrix.Identity(4))
    obj.data.transform(m)
    if apply_scale and scale.x*scale.y*scale.z < 0: obj.data.flip_normals()
    obj.data.update()
    if apply_loc: obj.location = (0, 0, 0)
    if apply_rot: obj.rotation_euler = (0, 0, 0); obj.rotation_quaternion = (1, 0, 0, 0)
    if apply_scale: obj.scale = (1, 1, 1)
```

## 5. Cross-version Principled material builder

```python
def create_gltf_pbr_material(name, base_color=(0.8,0.8,0.8,1), metallic=0.0, roughness=0.4,
                             emission_color=(0,0,0,1), emission_strength=0.0, alpha=1.0, alpha_mode='OPAQUE'):
    mat = bpy.data.materials.new(name=name); mat.use_nodes = True
    nodes, links = mat.node_tree.nodes, mat.node_tree.links; nodes.clear()
    out = nodes.new('ShaderNodeOutputMaterial'); bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    links.new(bsdf.outputs['BSDF'], out.inputs['Surface'])
    def set_socket(node, candidates, value):
        for s in candidates:
            if s in node.inputs: node.inputs[s].default_value = value; return
    set_socket(bsdf, ['Base Color'], base_color); set_socket(bsdf, ['Metallic'], metallic)
    set_socket(bsdf, ['Roughness'], roughness); set_socket(bsdf, ['Emission Color', 'Emission'], emission_color)
    set_socket(bsdf, ['Emission Strength'], emission_strength); set_socket(bsdf, ['Alpha'], alpha)
    if alpha_mode == 'BLEND':
        if hasattr(mat, 'surface_render_method'): mat.surface_render_method = 'BLENDED'
        elif hasattr(mat, 'blend_method'): mat.blend_method = 'BLEND'
    elif alpha_mode == 'MASK':
        if hasattr(mat, 'surface_render_method'): mat.surface_render_method = 'DITHERED'
        elif hasattr(mat, 'blend_method'): mat.blend_method = 'CLIP'; mat.alpha_threshold = 0.5
    return mat
```

## 6. ORM (occlusion-roughness-metallic) packing for glTF

glTF packs AO (R), roughness (G), metallic (B) into one linear texture. Wire it through `ShaderNodeSeparateColor`; route Red into a `glTF Material Output` node group socket named `Occlusion` so the exporter recognises it. Mark the image `Non-Color`.

## 7. Programmatic Geometry Nodes (4.x)

`node_group.interface.new_socket(name, in_out='INPUT'|'OUTPUT', socket_type='NodeSocketGeometry')` replaces `inputs.new`. Typical scatter: `GeometryNodeDistributePointsOnFaces` (Poisson) → `GeometryNodeInstanceOnPoints` ← `GeometryNodeObjectInfo` → `GeometryNodeRealizeInstances` → `GeometryNodeJoinGeometry` → group output. Realise instances before export when the engine expects one static mesh.
