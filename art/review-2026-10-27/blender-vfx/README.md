# Blender VFX assets — 27 October 2026

Owner Codex · Branch `codex/blender-vfx-assets` · **Review; awaiting Adam’s normal-speed verdict**. This branch is not approved for merge or default promotion.

[Local workbench](http://localhost:4791/vfx-workbench.html?look=flow) · [Local flow game](http://localhost:4791/?energy=flow). Server runs from `/tmp/rift-ink-fx/dist`; the public Pages build does not include these branch assets.

## Deliverables

Four original closed 3D effect meshes and three original grayscale/alpha masks, created using the installed **Blender 3.6.23**, headless `-b --factory-startup`. Workbench configured, no heavy renderer invoked. The masks are analytic CPU bakes into Blender images. No .blend files saved or committed. No third-party source assets added. All new asset files are CC0-1.0 with provenance/hashes in [the manifest](../../../dist/assets/vfx/blender/manifest.json) and [license](../../../dist/assets/vfx/blender/LICENSE.txt).

| Asset | Bytes | Triangles / dimensions |
| --- | ---: | --- |
| sol-shell.glb | 54,552 | 2364 |
| vesper-shell.glb | 32,736 | 1340 |
| capture-collar.glb | 61,136 | 2660 |
| release-burst.glb | 45,436 | 1932 |
| wisps.png | 14,636 | 128 × 128 |
| cracks.png | 8,979 | 128 × 128 |
| sparks.png | 4,043 | 128 × 128 |

Each GLB is below 200 KB and each PNG below 256 KB. The four GLBs use two material primitives each to reduce draw calls. [Rebuild command and script](../../../scripts/vfx-blender/README.md).

## Runtime contract

The existing effect factories still own transforms, timing, tint and fading. Only explicit flow drafts enable the Blender pieces; normal gameplay does not request their GLBs or PNGs. Loading/errors retain the existing procedural flow. Each instance owns its cloned geometry/materials so workbench disposal cannot invalidate the loader cache. Small grayscale masks feed the existing flowing surface shader. No character, rig, pose, mocap, animation or combat timing/hitbox implementation changes; generated import-map stamps are refreshed by release preparation.

The workbench has a release-burst selector and a “Compare previous flow” checkbox. Left is the previous procedural flow when checked, otherwise the unchanged live default. Right is the Blender draft. “Blender pieces” can disable new assets independently for comparison.

## Verification and capture protocol

603 tests pass: production GLTFLoader parses all assets; budgets/hashes/license/UVs/finite volume checked; default factories do not request assets; preview switching restores defaults; reduced-motion shader clock remains deterministic. Focused browser review also passed with loaded shaders in reduced motion and actual combat, zero console/page errors, and zero Blender asset requests on the default path.

Capture driver: `scripts/review/blender-vfx.mjs`. Workbench three-quarter, side and down-axis views for all four pieces; actual input-driven Sol/Vesper shots, capture projectile and Aegis beam release, old/new from side and lock cameras. The lock camera is the actual behind–Player 1/rear game view (not an extra invented rear mode). Still images cannot certify normal-speed feel.

## Browser evidence and visual verdict

[Successful preview workflow 40515825999](https://github.com/Tusingw29/rift-duel/actions/runs/40515825999), implementation commit `745f54d`. All 28 JPEG captures below were visually inspected. [Machine report](blender-report-1793109180115.json). This was a branch preview run (`preview_branch=true`, `vfx_only=true`), not a Pages publication or full gameplay regression run.

| Piece | Observed improvement | Remaining weakness |
| --- | --- | --- |
| Sol | Three curved flame lobes retain width from the side and form a looped volume down the attack axis. | Translucent detail fades over pale stone; the down-axis silhouette is small. |
| Vesper | Intersecting beveled seals have a wider cross section; edge-on no longer becomes one line. | Exact down-axis view reads as a cross rather than a diamond seal. Bright-floor contrast remains weaker than the workbench. |
| Capture | Cleaner open center, rounded segments and visible depth in oblique views. | Front profile still reads thin; the violet collar is less luminous than the previous white core on pale floors. |
| Release burst | Curved tapered petals replace straight rays and have depth. | Symmetry still resembles a pinwheel. During the beam shot, beam brightness masks the change from the side; the fighter partly hides it from the rear. |

These are review candidates, not a claim that the finish is approved. Normal-speed feel and frame rate on Adam’s Intel HD 6000 remain unverified; cloud capture UI frame rates are not a device benchmark. Default gameplay stays unchanged. No implementation merge to main.

## Capture index

Workbench images contain previous flow on the left and the Blender draft on the right. Combat pairs use the same simulation moment. “Lock” is the behind-Player-1 camera.

### sol-shell

- [Workbench three-quarter](blender-sol-shell-workbench-three-1793109180115.jpg)
- [Workbench side](blender-sol-shell-workbench-side-1793109180115.jpg)
- [Workbench down-axis](blender-sol-shell-workbench-back-1793109180115.jpg)
- [Combat side before](blender-sol-shell-combat-side-old-1793109180115.jpg)
- [Combat side after](blender-sol-shell-combat-side-new-1793109180115.jpg)
- [Combat rear/lock before](blender-sol-shell-combat-lock-old-1793109180115.jpg)
- [Combat rear/lock after](blender-sol-shell-combat-lock-new-1793109180115.jpg)

### vesper-shell

- [Workbench three-quarter](blender-vesper-shell-workbench-three-1793109180115.jpg)
- [Workbench side](blender-vesper-shell-workbench-side-1793109180115.jpg)
- [Workbench down-axis](blender-vesper-shell-workbench-back-1793109180115.jpg)
- [Combat side before](blender-vesper-shell-combat-side-old-1793109180115.jpg)
- [Combat side after](blender-vesper-shell-combat-side-new-1793109180115.jpg)
- [Combat rear/lock before](blender-vesper-shell-combat-lock-old-1793109180115.jpg)
- [Combat rear/lock after](blender-vesper-shell-combat-lock-new-1793109180115.jpg)

### capture-collar

- [Workbench three-quarter](blender-capture-collar-workbench-three-1793109180115.jpg)
- [Workbench side](blender-capture-collar-workbench-side-1793109180115.jpg)
- [Workbench down-axis](blender-capture-collar-workbench-back-1793109180115.jpg)
- [Combat side before](blender-capture-collar-combat-side-old-1793109180115.jpg)
- [Combat side after](blender-capture-collar-combat-side-new-1793109180115.jpg)
- [Combat rear/lock before](blender-capture-collar-combat-lock-old-1793109180115.jpg)
- [Combat rear/lock after](blender-capture-collar-combat-lock-new-1793109180115.jpg)

### release-burst

- [Workbench three-quarter](blender-release-burst-workbench-three-1793109180115.jpg)
- [Workbench side](blender-release-burst-workbench-side-1793109180115.jpg)
- [Workbench down-axis](blender-release-burst-workbench-back-1793109180115.jpg)
- [Combat side before](blender-release-burst-combat-side-old-1793109180115.jpg)
- [Combat side after](blender-release-burst-combat-side-new-1793109180115.jpg)
- [Combat rear/lock before](blender-release-burst-combat-lock-old-1793109180115.jpg)
- [Combat rear/lock after](blender-release-burst-combat-lock-new-1793109180115.jpg)

