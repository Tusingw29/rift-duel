"""Behavior checks for the read-only metadata gate; no Blender installation needed."""
import json
import struct
import subprocess
import sys
import tempfile
import unittest
from pathlib import Path
from audit_glb import audit, read_glb


def fixture():
    return {'asset': {'version': '2.0'}, 'nodes': [{'name': 'root'}, {'mesh': 0, 'skin': 0}],
            'skins': [{'joints': [0]}], 'meshes': [{'primitives': [{'attributes': {
                'POSITION': 0, 'JOINTS_0': 1, 'WEIGHTS_0': 2}}]}]}


def encode(doc):
    body = json.dumps(doc).encode()
    body += b' ' * (-len(body) % 4)
    return struct.pack('<4sIIII', b'glTF', 2, 20 + len(body), len(body), 0x4E4F534A) + body


class AuditTests(unittest.TestCase):
    def test_valid_metadata_and_canonical_limb_names(self):
        doc = fixture()
        doc['nodes'][0]['name'] = 'handL'
        self.assertFalse(audit(doc, ['hand.L'])['errors'])

    def test_absent_skin_and_missing_bone_fail(self):
        doc = fixture()
        self.assertTrue(audit(doc, ['root', 'head'])['errors'])
        doc['skins'] = []
        self.assertTrue(audit(doc, ['root'])['errors'])

    def test_each_skin_checked_not_global_union(self):
        doc = fixture()
        doc['nodes'].append({'name': 'head'})
        doc['skins'].append({'joints': [2]})
        self.assertEqual(sum('missing bones' in e for e in audit(doc, ['root', 'head'])['errors']), 2)

    def test_extra_bone_invalid_index_and_extra_weights(self):
        doc = fixture()
        doc['nodes'].append({'name': 'neck'})
        doc['skins'][0]['joints'].append(2)
        self.assertTrue(audit(doc, ['root'])['errors'])
        doc['skins'][0]['joints'] = [-1]
        self.assertTrue(audit(doc, ['root'])['errors'])
        doc = fixture()
        doc['meshes'][0]['primitives'][0]['attributes']['WEIGHTS_1'] = 3
        self.assertTrue(audit(doc, ['root'])['errors'])

    def test_external_resources_and_decoder_rejected(self):
        doc = fixture()
        doc.update(images=[{'uri': 'hair.png'}], extensionsUsed=['KHR_draco_mesh_compression'])
        self.assertEqual(len(audit(doc, ['root'])['errors']), 2)

    def test_uv_error_and_tangent_warning_are_distinct(self):
        doc = fixture()
        doc['materials'] = [{'normalTexture': {'index': 0, 'texCoord': 1}}]
        primitive = doc['meshes'][0]['primitives'][0]
        primitive['material'] = 0
        self.assertTrue(audit(doc, ['root'])['errors'])
        primitive['attributes']['TEXCOORD_1'] = 3
        report = audit(doc, ['root'])
        self.assertFalse(report['errors'])
        self.assertTrue(report['warnings'])

    def test_cli_exit_and_file_unchanged(self):
        with tempfile.TemporaryDirectory() as temp:
            path, source = Path(temp) / 'asset.glb', Path(temp) / 'motion.json'
            original = encode(fixture())
            path.write_bytes(original)
            self.assertEqual(read_glb(path)[0], fixture())
            source.write_text(json.dumps({'bones': [{'name': 'root'}]}))
            command = [sys.executable, str(Path(__file__).with_name('audit_glb.py')), str(path), '--motion-source', str(source)]
            self.assertEqual(subprocess.run(command, capture_output=True).returncode, 0)
            source.write_text(json.dumps({'bones': [{'name': 'head'}]}))
            self.assertEqual(subprocess.run(command, capture_output=True).returncode, 1)
            self.assertEqual(path.read_bytes(), original)
            path.write_bytes(original[:-1])
            with self.assertRaises(ValueError):
                read_glb(path)


if __name__ == '__main__':
    unittest.main()
