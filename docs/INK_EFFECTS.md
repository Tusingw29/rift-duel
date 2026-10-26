# Ink effects — first playable pass

Update: the camera-facing effect treatment below has been replaced by [volumetric 3D assets](VOLUMETRIC_EFFECTS.md). The historical implementation details remain for reference.

Implements the approved [Ink Energy direction](../art/concepts/ink-energy-v1/README.md) using original vector silhouettes in Three.js. The illustrated concept sheets are reference, not runtime textures. This pass leaves character models, animation channels, combat timing and collision unchanged.

## Implemented

- Aegis beam: three intersecting layers of torn lance shapes, dark edge, cyan body and white core. The nose sits within the existing projectile radius; the long visible tail extends backward. Four prebuilt shape variants play at 12 drawings per second while movement still follows the normal simulation. Paid pulses retain their independent projectiles.
- Tala charge: six rising ink ribbons around an open centre plus a broken floor ring. Colour layers are dark burnt orange, amber and pale cream. Buildup uses held duration; appearance follows simulation ticks. Reduce Motion holds a static drawing with three ribbons. Other fighters retain the previous charge presentation.
- Capture: a broken, thorned brush ellipse replaces the clean UI-style ring. The travelling version still scales with its collision radius; the cinematic version follows the victim and fades at the end. Both remain open, with no filled orb. It is camera-facing during capture for readability, not yet a front/back occluding band wrapped through the body.

Geometry lives in `dist/ink-energy.js`; frame banks are allocated on creation and reused. This is a lightweight alternative to shipping raster sprite sheets, not a claim that vector geometry exactly reproduces the drawn concept. Transparent materials retain depth testing and disable depth writes so the arena does not overwrite the art.

## Review

Use `sandbox.html?scenario=charge&p1=2&p2=0&effects=full` for Tala, or `sandbox.html?scenario=capture&p1=0&p2=2` for the capture. The sandbox defaults to reduced effects; `effects=full` enables normal presentation. Fight-camera views are collected by `scripts/review/ink-effects.mjs` using actual simulation emission for Aegis.

Checks cover finite and reused geometry, the empty capture centre, collision-sized travel ring, beam nose alignment, preserved white/ink colours, simulation-clock determinism, reduced-motion stability and interruption/reset cleanup. Screenshots establish readability and placement; Adam's normal-speed verdict remains open.

## Next, after visual review

Tune the height/density and held cadence against the concept. Add dedicated muzzle/release and break-up sequences if needed. Then extend the language to Rei, Morrow, Sol and Vesper. Hand-following strike trails and foot dust remain deferred until Claude's poses settle. No fighter design or animation changes should be inferred from this effects pass.
