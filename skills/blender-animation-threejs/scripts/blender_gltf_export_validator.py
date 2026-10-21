#!/usr/bin/env python3
"""Blender pre-flight validator and GLB exporter.
Usage: blender -b scene.blend -P blender_gltf_export_validator.py -- --output build/asset.glb [--apply-fixes] [--draco]
Audits unapplied scale, missing UV maps, vertices with more than four bone influences and N-gons, optionally fixes them, then exports a Three.js-ready GLB with version-safe export arguments.
"""
import sys, os, argparse, bpy
from mathutils import Matrix

def parse_args():
    argv = sys.argv[sys.argv.index("--") + 1:] if "--" in sys.argv else []
    p = argparse.ArgumentParser(); p.add_argument("--output", "-o", required=True)
    p.add_argument("--apply-fixes", action="store_true"); p.add_argument("--draco", action="store_true")
    return p.parse_args(argv)

def audit_and_fix_scene(apply_fixes=False):
    issues, fixed = [], []
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
            if obj.vertex_groups:
                over = 0
                for v in mesh.vertices:
                    active = [g for g in v.groups if g.weight > 1e-4]
                    if len(active) > 4:
                        over += 1
                        if apply_fixes:
                            ordered = sorted(v.groups, key=lambda g: g.weight, reverse=True)
                            for extra in ordered[4:]: obj.vertex_groups[extra.group].remove([v.index])
                            total = sum(g.weight for g in ordered[:4])
                            if total > 1e-6:
                                for g in ordered[:4]: g.weight /= total
                if over:
                    issues.append(f"[{obj.name}] {over} vertices exceed 4 bone weights")
                    if apply_fixes: fixed.append(f"[{obj.name}] clamped {over} vertices to 4 influences")
            ngons = sum(1 for poly in mesh.polygons if len(poly.vertices) > 4)
            if ngons: issues.append(f"[{obj.name}] {ngons} N-gons")
    return issues, fixed

def main():
    args = parse_args(); issues, fixed = audit_and_fix_scene(args.apply_fixes)
    print("=== BLENDER -> THREE.JS GLTF PRE-FLIGHT REPORT ===")
    for item in issues: print("  -", item)
    for item in fixed: print("  +", item)
    if not issues: print("Zero scene issues detected.")
    out = os.path.abspath(args.output); os.makedirs(os.path.dirname(out), exist_ok=True)
    kw = {"filepath": out, "export_format": 'GLB', "export_yup": True, "export_apply": True, "export_texcoords": True,
          "export_normals": True, "export_tangents": True, "export_materials": 'EXPORT', "export_skins": True,
          "export_def_bones": True, "export_all_influences": False, "export_morph": True, "export_animations": True,
          "export_force_sampling": True, "export_draco_mesh_compression_enable": bool(args.draco)}
    valid = bpy.ops.export_scene.gltf.get_rna_type().properties.keys()
    bpy.ops.export_scene.gltf(**{k: v for k, v in kw.items() if k in valid})
    print("Exported", out)

if __name__ == "__main__": main()
