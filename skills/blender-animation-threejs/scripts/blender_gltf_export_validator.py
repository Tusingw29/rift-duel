#!/usr/bin/env python3
"""Blender 3.6 LTS and 4.x+ pre-flight validator and GLB exporter.
Features: cross-version RNA-filtered export, UV-seam-tolerant KDTree connectivity report,
optional fixed bone-name contract (--required-bones), weight clamping to <= 4 influences,
automatic tangent export when normal maps are present, optional JPEG atlases. Refuses to export when issues are found unless --allow-issues is passed.
Usage: blender -b scene.blend -P blender_gltf_export_validator.py -- --output build/asset.glb [--apply-fixes] [--tangents] [--jpeg-quality 85] [--required-bones root,chest,...] [--no-export]
"""
import sys, os, argparse
from collections import deque
import bpy
from mathutils import Matrix
from mathutils.kdtree import KDTree

def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    p = argparse.ArgumentParser(); p.add_argument("--output", "-o", required=True)
    p.add_argument("--apply-fixes", action="store_true"); p.add_argument("--tangents", action="store_true")
    p.add_argument("--draco", action="store_true"); p.add_argument("--jpeg-quality", type=int, default=0)
    p.add_argument("--required-bones", type=str, default=""); p.add_argument("--no-export", action="store_true")
    p.add_argument("--allow-issues", action="store_true", help="Export even when the audit reports issues (default: refuse)")
    return p.parse_args(argv)

def count_welded_mesh_islands(mesh, weld_distance=1e-4):
    """Connected components after welding colocated vertices split by UV seams."""
    n = len(mesh.vertices)
    if n == 0: return 0
    kd = KDTree(n)
    for i, v in enumerate(mesh.vertices): kd.insert(v.co, i)
    kd.balance()
    adj = [set() for _ in range(n)]
    for e in mesh.edges:
        a, b = e.vertices; adj[a].add(b); adj[b].add(a)
    for i, v in enumerate(mesh.vertices):
        for _co, idx, _d in kd.find_range(v.co, weld_distance):
            if idx != i: adj[i].add(idx)
    seen = [False] * n; islands = 0
    for start in range(n):
        if seen[start]: continue
        islands += 1; queue = deque([start]); seen[start] = True
        while queue:
            cur = queue.popleft()
            for nb in adj[cur]:
                if not seen[nb]: seen[nb] = True; queue.append(nb)
    return islands

def scene_uses_normal_maps():
    return any(n.type == 'NORMAL_MAP' for m in bpy.data.materials if m.use_nodes and m.node_tree for n in m.node_tree.nodes)

def audit_and_fix_scene(apply_fixes=False, required_bones=None):
    issues, fixed, info = [], [], []
    if required_bones:
        for arm in (o for o in bpy.data.objects if o.type == 'ARMATURE'):
            present = {b.name for b in arm.data.bones}; missing = [b for b in required_bones if b not in present]
            if missing: issues.append(f"[{arm.name}] missing required bones: {', '.join(missing)}")
            else: info.append(f"[{arm.name}] all {len(required_bones)} required bones present")
    for obj in bpy.data.objects:
        if obj.type not in {'MESH', 'ARMATURE'}: continue
        sx, sy, sz = obj.scale
        if any(abs(s - 1.0) > 1e-4 for s in (sx, sy, sz)):
            issues.append(f"[{obj.name}] non-unit scale ({sx:.3f}, {sy:.3f}, {sz:.3f})")
            if apply_fixes and obj.type == 'MESH' and obj.data.users == 1 and not obj.data.shape_keys:
                obj.data.transform(Matrix.Diagonal((sx, sy, sz, 1.0)))
                if sx * sy * sz < 0: obj.data.flip_normals()
                obj.scale = (1, 1, 1); fixed.append(f"[{obj.name}] baked scale into vertices")
        if obj.type == 'MESH':
            mesh = obj.data
            if not mesh.uv_layers: issues.append(f"[{obj.name}] missing UV map")
            info.append(f"[{obj.name}] {len(mesh.vertices)} vertices, {count_welded_mesh_islands(mesh)} welded islands")
            if obj.vertex_groups:
                over = unweighted = 0
                for v in mesh.vertices:
                    active = [g for g in v.groups if g.weight > 1e-4]
                    if not active: unweighted += 1
                    elif len(active) > 4:
                        over += 1
                        if apply_fixes:
                            ordered = sorted(v.groups, key=lambda g: g.weight, reverse=True); kept = [(g.group, g.weight) for g in ordered[:4]]
                            for extra in ordered[4:]: obj.vertex_groups[extra.group].remove([v.index])
                            total = sum(w for _, w in kept)
                            if total > 1e-6:
                                for g, w in kept: obj.vertex_groups[g].add([v.index], w / total, 'REPLACE')
                if unweighted: issues.append(f"[{obj.name}] {unweighted} vertices have no skin weights")
                if over:
                    issues.append(f"[{obj.name}] {over} vertices exceed 4 bone weights")
                    if apply_fixes: fixed.append(f"[{obj.name}] clamped {over} vertices to 4 influences")
    return issues, fixed, info

def main():
    args = parse_args(); required = [b.strip() for b in args.required_bones.split(",") if b.strip()]
    issues, fixed, info = audit_and_fix_scene(args.apply_fixes, required)
    tangents = bool(args.tangents or scene_uses_normal_maps())
    print(f"=== BLENDER {bpy.app.version_string} -> THREE.JS GLTF PRE-FLIGHT REPORT ===")
    print(f"Normal maps detected: {scene_uses_normal_maps()} | tangent export: {tangents}")
    for item in info: print("  ·", item)
    for item in issues: print("  -", item)
    for item in fixed: print("  +", item)
    if not issues: print("Zero scene issues detected.")
    if args.no_export: return
    if issues and not args.allow_issues:
        print(f"Refusing to export: {len(issues)} issue(s). Fix them or pass --allow-issues."); sys.exit(2)
    out = os.path.abspath(args.output); os.makedirs(os.path.dirname(out), exist_ok=True)
    kw = {"filepath": out, "export_format": 'GLB', "export_yup": True, "export_apply": True, "export_texcoords": True,
          "export_normals": True, "export_tangents": tangents, "export_materials": 'EXPORT',
          "export_image_format": 'JPEG' if args.jpeg_quality > 0 else 'AUTO', "export_colors": True, "export_skins": True,
          "export_def_bones": True, "export_all_influences": False, "export_morph": True, "export_animations": True,
          "export_animation_mode": 'NLA_TRACKS', "export_nla_strips": True, "export_force_sampling": True,
          "export_draco_mesh_compression_enable": bool(args.draco)}
    valid = bpy.ops.export_scene.gltf.get_rna_type().properties.keys()
    bpy.ops.export_scene.gltf(**{k: v for k, v in kw.items() if k in valid}); print("Exported", out)

if __name__ == "__main__": main()
