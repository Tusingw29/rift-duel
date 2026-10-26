# 3D attack assets

This supersedes the camera-facing treatment described in the earlier ink-effects and combat-fluidity notes. It preserves the flat-color palette while giving the actual runtime assets depth.

- **Beam:** closed axial mesh with a jagged, eight-sided profile and three raised white channels. Every animation variant encloses volume; no intersecting flat beam cards.
- **Capture ring:** closed front, back, inner wall and outer wall around an empty center. Its orientation follows the attacker/victim relationship, not the camera. The traveling collision radius is unchanged.
- **Tala charge:** thick extruded energy shapes with shaded side faces, arranged in world space around her. The floor ring is also a volume. Other fighters keep their existing charge assets.
- **Release and nose bursts:** a faceted core with spikes along all six world axes, replacing camera-facing ring flares. The release anchor still reads Aegis's animated free hand.
- **Breakup:** solid fragments disperse on all three axes and retain the existing six-tick lifecycle.

The meshes use baked vertex face shades and depth testing/writing rather than expensive lights, textures or bloom. Four shape variants remain pooled and simulation-driven. Reduced Motion retains the existing static/sparse behavior. Models, pose math, combat timing and collision are unchanged.

Tests verify enclosed volume, finite normals, depth extent, camera-independent orientation, XYZ fragment scatter, pooled reuse, collision sizing and lifecycle cleanup. Review evidence is in `art/review-2026-10-26/volumetric-effects/`. Normal-speed visual acceptance is still open.
