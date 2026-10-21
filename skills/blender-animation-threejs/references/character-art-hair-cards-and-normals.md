# Character Art Direction, Alpha-Card Hair, Normal Maps, Skin Weighting, and Combat Mechanics Reference

Concrete Blender 3.6 LTS and 4.x+ `bpy`/`bmesh` implementations for proportion locks, three-tier alpha-card hair (MASK/CLIP), tangent-space normal maps (`export_tangents=True`), anatomical joint weighting, and fighting-game body mechanics. Rift Duel's proportion standard lives in `docs/EVIL_ZONE_ART_DIRECTION.md`; its hair is still sculpted masses, so this module is the plan for the next pass.

## 1. Layered alpha-card hair (cross-version)

Three tiers over a dark scalp cap: base volume (wide, dense ribbons on the skull contour), mid clumps (curved tapered 4-6 segment strips for flow and silhouette breakup), fringe and flyaways (narrow strands at forehead, temples, nape). Material is Alpha Clip/Mask; normals are transferred from a head proxy so cards shade as one volume.

```python
import bpy, bmesh, math
from mathutils import Vector

def create_hair_card_material(name="HairCards_MAT", roughness=0.42, alpha_threshold=0.45):
    mat = bpy.data.materials.new(name=name); mat.use_nodes = True; mat.use_backface_culling = False
    if hasattr(mat, "blend_method"): mat.blend_method = 'CLIP'
    if hasattr(mat, "shadow_method"): mat.shadow_method = 'CLIP'
    if hasattr(mat, "alpha_threshold"): mat.alpha_threshold = alpha_threshold
    if hasattr(mat, "surface_render_method"): mat.surface_render_method = 'DITHERED'
    nodes, links = mat.node_tree.nodes, mat.node_tree.links; nodes.clear()
    out = nodes.new('ShaderNodeOutputMaterial'); bsdf = nodes.new('ShaderNodeBsdfPrincipled')
    bsdf.inputs['Roughness'].default_value = roughness
    for name_ in ('Specular IOR Level', 'Specular'):
        if name_ in bsdf.inputs: bsdf.inputs[name_].default_value = 0.35; break
    links.new(bsdf.outputs['BSDF'], out.inputs['Surface']); return mat

def generate_hair_card_ribbon_bmesh(bm, uv_layer, curve_points, head_center, base_width=0.032, tip_taper=0.22, camber_depth=0.004, uv_rect=(0, 0, 1, 1)):
    """Curved, cross-cambered 3-column quad ribbon along curve_points (left, centre ridge, right)."""
    n = len(curve_points)
    if n < 2: return []
    u_min, v_min, u_max, v_max = uv_rect; u_mid = 0.5 * (u_min + u_max); rows = []
    for i, pt in enumerate(curve_points):
        t = i / float(n - 1)
        root_ease = min(1.0, 0.7 + 0.3 * (t / 0.2)) if t < 0.2 else 1.0
        width = base_width * root_ease * ((1.0 - t) + tip_taper * t)
        if i == 0: tangent = (curve_points[1] - curve_points[0]).normalized()
        elif i == n - 1: tangent = (curve_points[-1] - curve_points[-2]).normalized()
        else: tangent = (curve_points[i + 1] - curve_points[i - 1]).normalized()
        outward = (pt - head_center).normalized(); binormal = tangent.cross(outward).normalized(); card_normal = binormal.cross(tangent).normalized()
        rows.append((t, bm.verts.new(pt - binormal * 0.5 * width), bm.verts.new(pt + card_normal * camber_depth * (1.0 - 0.5 * t)), bm.verts.new(pt + binormal * 0.5 * width)))
    faces = []
    for i in range(n - 1):
        t0, l0, c0, r0 = rows[i]; t1, l1, c1, r1 = rows[i + 1]
        v0 = v_min + t0 * (v_max - v_min); v1 = v_min + t1 * (v_max - v_min)
        fl = bm.faces.new((l0, c0, c1, l1)); fl.smooth = True
        for loop, uv in zip(fl.loops, ((u_min, v0), (u_mid, v0), (u_mid, v1), (u_min, v1))): loop[uv_layer].uv = uv
        fr = bm.faces.new((c0, r0, r1, c1)); fr.smooth = True
        for loop, uv in zip(fr.loops, ((u_mid, v0), (u_max, v0), (u_max, v1), (u_mid, v1))): loop[uv_layer].uv = uv
        faces += [fl, fr]
    return faces

def transfer_normals_from_head_proxy(hair_obj, head_center, blend=0.70):
    """Blend spherical proxy normals with card normals so card edges vanish under directional light."""
    mesh = hair_obj.data
    if hasattr(mesh, "use_auto_smooth"): mesh.use_auto_smooth = True; mesh.auto_smooth_angle = math.pi
    normals = []
    for loop in mesh.loops:
        co = hair_obj.matrix_world @ mesh.vertices[loop.vertex_index].co
        radial = (co - head_center).normalized(); orig = loop.normal.normalized() if loop.normal.length > 1e-4 else radial
        normals.append((radial * blend + orig * (1 - blend)).normalized())
    mesh.normals_split_custom_set(normals); mesh.update()
```

## 2. Procedural tangent-space normal maps and glTF wiring

Store normal maps as Non-Color, OpenGL +Y convention (R=+X, G=+Y, B=+Z), wire through `ShaderNodeNormalMap` (TANGENT) into the Principled `Normal` input, and export with `export_tangents=True`.

```python
def generate_weave_normal_map_image(name="Cloth_Weave_Normal", width=512, height=512, tiles=32, strength=0.35):
    img = bpy.data.images.new(name=name, width=width, height=height, alpha=False); img.colorspace_settings.name = 'Non-Color'
    px = [0.0] * (width * height * 4); freq = 2.0 * math.pi * tiles
    for y in range(height):
        v = y / float(height)
        for x in range(width):
            u = x / float(width)
            dx = math.cos(u * freq) * math.sin(v * freq * 0.5) * strength; dy = math.cos(v * freq) * math.sin(u * freq * 0.5) * strength
            L = math.sqrt(dx * dx + dy * dy + 1.0); i = (y * width + x) * 4
            px[i], px[i + 1], px[i + 2], px[i + 3] = 0.5 * dx / L + 0.5, 0.5 * dy / L + 0.5, 0.5 / L + 0.5, 1.0
    img.pixels.foreach_set(px); img.pack(); return img

def attach_tangent_normal_map(mat, normal_img, strength=1.0):
    normal_img.colorspace_settings.name = 'Non-Color'
    nodes, links = mat.node_tree.nodes, mat.node_tree.links
    bsdf = next(n for n in nodes if n.type == 'BSDF_PRINCIPLED')
    tex = nodes.new('ShaderNodeTexImage'); tex.image = normal_img
    nm = nodes.new('ShaderNodeNormalMap'); nm.space = 'TANGENT'; nm.inputs['Strength'].default_value = strength
    links.new(tex.outputs['Color'], nm.inputs['Color']); links.new(nm.outputs['Normal'], bsdf.inputs['Normal'])
```

Rift Duel note: the bake in `scripts/tala_design02_textures.py` could emit a normal atlas from the same procedural trees (bake type `NORMAL` from a displaced copy, or a derivative pass) alongside the colour atlas; the game's `shading.js` profiles would then need `normalScale` per profile and the GLB needs tangents.

## 3. Anatomical skin weighting

| Joint zone | Primary | Secondary | Rule |
| --- | --- | --- | --- |
| Shoulder / deltoid | UpperArm | Clavicle 30-45%, Chest 15-25% | blend deltoid cap; armpit crease 50/50 Chest + UpperArm |
| Elbow hinge | Forearm | UpperArm | three loops: 75/25, 50/50, 25/75 |
| Wrist twist | Hand | Forearm 20-40% along distal radius | taper over last 25% of forearm |
| Neck and jaw guard | Neck | Head 40% upper neck, Chest 35% base | chin and jawline 95%+ Head |
| Ankle and planted foot | Foot | Shin 25-50% across malleolus ring, Toe | heel pad and sole 100% Foot/Toe |

```python
def normalize_and_clamp_weights_4(obj, threshold=1e-4):
    for v in obj.data.vertices:
        valid = sorted([(g.group, g.weight) for g in v.groups if g.weight > threshold], key=lambda i: i[1], reverse=True)
        if not valid: continue
        kept, dropped = valid[:4], valid[4:]
        for g, _ in dropped: obj.vertex_groups[g].remove([v.index])
        total = sum(w for _, w in kept)
        if total > 1e-6:
            for g, w in kept: obj.vertex_groups[g].add([v.index], w / total, 'REPLACE')
```

Rift Duel's `scripts/tala_design02_body.py` already blends transferred influences across the connected shoulder and keeps the top four; apply the same falloff table to elbows, wrists, neck and ankles when the next body revision is built.

## 4. Combat body mechanics

1. **Planted feet**: lock the stance foot's world contact within 0.5 mm during idle breathing, guard transitions and planted strikes; release only on explicit step frames. Roll onto the ball of the rear foot (+25° to +40° pitch) when driving a cross or kick. (Rift Duel: `dist/rig-pose.js` and `dist/tala-footwork.js` implement this at runtime; the Blender study bakes the same contacts.)
2. **Weight shifts**: move the hips over the support foot across 3-5 anticipation frames with a 3-6 cm drop to load the knees before any strike, block or evade.
3. **Tucked-head guard**: chest +8°, neck +12°, head -10° so the chin tucks while the eye line stays level; raise the lead clavicle 8-12° and rotate the lead arm inward so shoulder and forearm bracket the jaw.
