#!/usr/bin/env python3
"""Read-only Rift Duel GLB metadata gate; not a full glTF/deformation validator."""
import argparse
import json
import re
import struct
import sys
from pathlib import Path


def read_glb(path):
    raw = Path(path).read_bytes()
    if len(raw) < 20:
        raise ValueError('Truncated GLB')
    magic, version, length = struct.unpack_from('<4sII', raw)
    if magic != b'glTF' or version != 2 or length != len(raw):
        raise ValueError('Invalid GLB header or declared length')
    chunks, offset = [], 12
    while offset < len(raw):
        if offset + 8 > len(raw):
            raise ValueError('Truncated chunk header')
        size, kind = struct.unpack_from('<II', raw, offset)
        offset += 8
        if size % 4 or offset + size > len(raw):
            raise ValueError('Invalid chunk length/alignment')
        chunks.append((kind, raw[offset:offset + size]))
        offset += size
    if not chunks or chunks[0][0] != 0x4E4F534A:
        raise ValueError('First chunk must be JSON')
    if sum(kind == 0x4E4F534A for kind, _ in chunks) != 1:
        raise ValueError('Duplicate JSON chunk')
    document = json.loads(chunks[0][1])
    if not isinstance(document, dict) or document.get('asset', {}).get('version') != '2.0':
        raise ValueError('Expected a glTF 2.0 object')
    return document, len(raw)


def canonical(name):
    return re.sub(r'^(upper_arm|forearm|hand|thigh|shin|foot)([LR])$', r'\1.\2', name)


def audit(doc, required):
    errors, warnings = [], []
    nodes, skins = doc.get('nodes', []), doc.get('skins', [])
    if not skins:
        errors.append('No skins exported')
    for i, skin in enumerate(skins):
        joints = skin.get('joints', [])
        if not joints or any(type(j) is not int or j < 0 or j >= len(nodes) for j in joints):
            errors.append(f'Skin {i}: empty or invalid joint indices')
            continue
        names = [canonical(nodes[j].get('name', '')) for j in joints]
        if len(names) != len(set(names)):
            errors.append(f'Skin {i}: duplicate canonical bone names')
        missing, extra = set(required) - set(names), set(names) - set(required)
        if missing:
            errors.append(f'Skin {i}: missing bones {sorted(missing)}')
        if extra:
            errors.append(f'Skin {i}: unsupported bones {sorted(extra)}')
    if not any('mesh' in node and 'skin' in node for node in nodes):
        errors.append('No mesh node bound to a skin')
    for i, node in enumerate(nodes):
        if 'skin' in node and (type(node['skin']) is not int or not 0 <= node['skin'] < len(skins)):
            errors.append(f'Node {i}: invalid skin index')
    forbidden = {'KHR_draco_mesh_compression', 'EXT_meshopt_compression', 'KHR_texture_basisu'}
    used = set(doc.get('extensionsUsed', [])) | set(doc.get('extensionsRequired', []))
    if used & forbidden:
        errors.append(f'Decoders not integrated: {sorted(used & forbidden)}')
    for kind in ('buffers', 'images'):
        for i, resource in enumerate(doc.get(kind, [])):
            if 'uri' in resource:
                errors.append(f'{kind}[{i}]: expected resource embedded in GLB binary')
    materials = doc.get('materials', [])
    primitives = [p for mesh in doc.get('meshes', []) for p in mesh.get('primitives', [])]
    if not primitives:
        errors.append('No mesh primitives')
    for i, primitive in enumerate(primitives):
        attrs = primitive.get('attributes', {})
        for needed in ('POSITION', 'JOINTS_0', 'WEIGHTS_0'):
            if needed not in attrs:
                errors.append(f'Primitive {i}: missing {needed}')
        if 'JOINTS_1' in attrs or 'WEIGHTS_1' in attrs:
            errors.append(f'Primitive {i}: additional skin influences unsupported by current runtime')
        mat_index = primitive.get('material')
        if mat_index is None:
            continue
        if type(mat_index) is not int or not 0 <= mat_index < len(materials):
            errors.append(f'Primitive {i}: invalid material index')
            continue
        mat = materials[mat_index]
        pbr = mat.get('pbrMetallicRoughness', {})
        for key, info in list(mat.items()) + list(pbr.items()):
            if key.endswith('Texture') and isinstance(info, dict):
                uv = info.get('extensions', {}).get('KHR_texture_transform', {}).get('texCoord', info.get('texCoord', 0))
                if f'TEXCOORD_{uv}' not in attrs:
                    errors.append(f'Primitive {i}: {key} references missing UV set {uv}')
        if 'normalTexture' in mat and 'TANGENT' not in attrs:
            warnings.append(f'Primitive {i}: normal map uses runtime tangent fallback; inspect bake parity')
    for i, mat in enumerate(materials):
        mode = mat.get('alphaMode', 'OPAQUE')
        if mode not in ('OPAQUE', 'MASK', 'BLEND'):
            errors.append(f'Material {i}: invalid alpha mode {mode}')
        if mode == 'MASK' and 'baseColorTexture' not in mat.get('pbrMetallicRoughness', {}):
            warnings.append(f'Material {i}: MASK without base-color texture cannot provide textured strand cutouts')
    return {'errors': errors, 'warnings': warnings, 'skins': len(skins),
            'primitives': len(primitives),
            'limits': 'Metadata only; no weight-value, topology, pixel, deformation, motion or performance validation.'}


def main():
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('glb', type=Path)
    parser.add_argument('--motion-source', type=Path, required=True)
    args = parser.parse_args()
    try:
        source = json.loads(args.motion_source.read_text())
        required = [canonical(b['name']) for b in source['bones']]
        if not required or len(required) != len(set(required)):
            raise ValueError('Motion source needs unique bone names')
        doc, size = read_glb(args.glb)
        report = audit(doc, required)
        report.update(file=str(args.glb), bytes=size)
    except (OSError, ValueError, KeyError, TypeError, IndexError, struct.error) as exc:
        report = {'errors': [str(exc)]}
    print(json.dumps(report, indent=2))
    return 1 if report['errors'] else 0


if __name__ == '__main__':
    sys.exit(main())
