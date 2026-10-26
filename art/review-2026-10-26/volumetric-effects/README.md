# Volumetric 3D effects review

Status: **awaiting normal-speed verdict**. Build `c96bc9b552fd`.

These renders use the actual Three.js game meshes, not concept illustrations or sprite sheets. Camera positions change while the assets remain fixed in world space.

| Capture | Reading |
| --- | --- |
| [Front](volumes-front-1793022415949.jpg) | Preserves the hollow ring and bright flat-color silhouettes |
| [Oblique](volumes-oblique-1793022415949.jpg) | Reveals ring walls, beam facets, charge thickness and release spikes |
| [Fight camera](ink-beam-lock-1793022470092.jpg) | Actual beam emission; normal character occlusion remains, with the solid burst visible alongside Aegis |
| [Side](volumes-side-1793022415949.jpg) | Confirms actual depth and natural foreshortening instead of billboarding |

The [gallery report](volume-report-1793022415949.json) records zero browser exceptions. Unit tests verify positive enclosed volume for all beam/ring/charge variants, finite normals, three-dimensional extents, camera-independent orientations and XYZ fragment scatter. Existing collision, timing and lifecycle tests remain in place.

The charge ribbon's side view is deliberately narrow and faceted; it remains the weakest angle to judge at normal speed. World-oriented rings naturally foreshorten when viewed edge-on. No character or pose math was changed.

See [asset implementation notes](../../../docs/VOLUMETRIC_EFFECTS.md).

**506 tests pass.** The [fight-camera report](ink-report-1793022470092.json) records zero page exceptions; the runner verifies actual beam emission and reset cleanup.
