# Tala — graphic flat-color 3D preview

Original Rift Duel character, based on direction 15 from the October 25, 2026 roster concepts.

## Included assets

- `tala-graphic.glb`: a self-contained skinned model, solid-color materials and 21 named animation clips. No external textures or compression decoders required.
- `palette.json`: editable sRGB costume, skin, hair and face colors.
- `manifest.json`: model hash, source hash, mesh/triangle counts, rig size and clip durations.
- `tala-graphic-pack.zip`: the model, palette, manifest and this guide together.

The runtime two-tone shader is `dist/graphic-flat.js` in the repository. Standard GLB viewers show the matte base materials; the game's viewer applies the custom shader. There are no raster texture assets to install.

## Rig and animation

The graphic model now uses a 61-bone deformation skeleton. It retains the original 17 named combat roles and adds a pelvis, lower/upper spine, neck, paired collarbones and arm twist helpers, 30 finger/thumb joints, toes, and two additional ponytail joints. It has no facial-expression rig.

Wrists rotate independently; fingers curl for fists and open during ranged attacks. The thumb folds across the fingers. Spine and neck motion is distributed from the existing authored channels. The foot solver works in each leg parent's space, retaining planted ankles with the new pelvis hierarchy; toes counter-roll during punch pivots. Existing 17-role assets and other fighters retain their previous attachment path.

The live game drives this rig with its existing animator and foot placement. Embedded clips are sampled from that animator at 30 fps. They contain local skeletal motion, not world-space travel, collision, hit events, projectiles, capture cinematics or sound. Use the game's movement system for gameplay. These clips are demonstrations, not a promise of seamless looping for every action.

## Combat rig upgrade

The resting fists sit higher, fingers have three joints each, and wrist turns ease into guard. The live animator and all 21 embedded clips use the expanded hierarchy. Skin weights redistribute torso, arm, neck, toe and hair deformation across the new joints.

## Round 2 polish

Tapered jaw and smaller eyes, four layered ponytail clumps, rounded wrapped palms with four modeled curled fingers per hand, and sloped vest shoulder panels. Those earlier fixed fingers are superseded by the combat rig upgrade above.

## Build and review

From the full Rift Duel repository, run `node scripts/build-tala-graphic.mjs`. This requires the committed `dist/assets/models/tala-v3.glb`, vendored Three.js and the game's animation modules, but no Blender or external build packages. The builder authors the head, eyes, hair, neck, fists and fitted costume panels and reuses the existing anatomical body's skin weights.

Run `node --test tests/tala-graphic.test.mjs` and `npm test`. The browser review script is `scripts/graphic-art-smoke.mjs`; it requires Playwright and a running local server. In the viewer select live or exported motion, rotate front/side/back, scrub the timeline, and enable Show skeleton or Show mesh edges.

## Provenance and limits

The reused body and weight foundation derives from the project's CC0 MakeHuman assets. New geometry, palette, shader and builder are authored for Rift Duel. The generated concept sheet is an art target, not a scan or a source of mesh geometry.

This is an opt-in playable art preview. Shoulder transitions, garment edges, fist detail and facial likeness remain candidates for further art refinement. Automated deformation tests and browser captures do not establish production-quality rigging or normal-speed controller feel. Existing gameplay effects and audio are reused rather than newly authored for this appearance.
