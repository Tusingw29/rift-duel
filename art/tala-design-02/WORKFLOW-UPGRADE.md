# Modern tools for the early-2000s art target

User direction: preserve the new Tala art style, but use easier or more advanced production methods where they improve the model, animation, effects and supporting presentation. This document extends PRODUCTION.md. These are selected production methods, not a claim that a new model or effects system has shipped.

## Selected approach

Keep Blender for editable character authoring and the current browser renderer for play. Modern authoring tools can serve a deliberately older visual style. Do not rebuild the engine to obtain better anatomy.

| Work | Method | Practical benefit | Required check |
|---|---|---|---|
| Body and face | Symmetry, sculpt/blockout, then clean deformation topology | Work on anatomical forms directly rather than independently scaling tubes | Same face in front/profile; shoulder and neck survive guard |
| Surface detail | Bake high-detail folds and sculpt detail into normal/occlusion maps; paint albedo | Lightweight runtime mesh can carry richer surfaces | Silhouette still modeled; no strong baked light that conflicts with arena light |
| Rigging | Rigify-style authoring controls, IK legs, pole targets, foot roll; bake to supported deform bones | Faster repeatable posing and foot contact | Existing runtime bone mapping must be extended or explicitly retargeted |
| Animation | Reusable pose library and short action clips; optional licensed motion reference for broad movement | Reuse guard, landing and support mechanics consistently | Hand-author contact frames, interruptions and Tala's combat identity |
| Hair and short cloth | Small bone chains; baked or restrained procedural secondary motion | Predictable motion at low runtime cost | No face/shoulder clipping; freeze during hitstop |
| Materials | Shared skin/cloth/hair/wrap/shoe presets, original texture atlas | Consistent look across camera views and eventually the roster | Review under neutral light before colored arena lighting |
| Impact and energy FX | Short flipbook textures on quads, pooled sparks, batched repeated particles | Richer silhouettes and timing without expensive fluid simulations | No heavy overdraw, light/showy effects do not hide the hit |
| Delivery | Validate GLB, remove unused assets, compress only with loader support | Smaller downloads and repeatable exports | Preserve joints, animation names and all required material maps |

Sources: [Blender Rigify developer documentation](https://developer.blender.org/docs/features/animation/rigify/), [Blender render baking](https://docs.blender.org/manual/en/4.4/render/cycles/baking.html), [Three.js InstancedMesh](https://threejs.org/docs/pages/InstancedMesh), [glTF Transform](https://gltf-transform.dev/). These document capabilities; the choices and budgets here are our own. Confirm options in the locally compatible Blender 3.6 and vendored Three.js version before implementation.

## What the current code tells us

The browser already has antialiasing, ACES tone mapping, hemisphere/key/rim lights and soft shadows in `dist/render.js`. Adding another global filter will not fix the face or disconnected-looking shoulders.

`dist/tala-concept.js` currently clones the GLB's materials and color texture, and maps a restricted set of skeleton names. It will need deliberate support for additional deform bones and independently owned normal/roughness/occlusion textures. Include clone/disposal checks for two fighters and afterimages when adding maps; avoid disposing a texture still used by another model.

The current impact burst creates separate octahedral meshes and materials per spark. A bounded reusable pool or instanced batch is a sensible first effects optimization. It is not yet implemented by this document. Preserve reduced-motion behavior and avoid adding a new dynamic light for every spark.

Do not run an automatic GLB optimizer blindly. Some presets introduce Draco, meshopt, WebP or KTX2 requirements; the current loader must have the matching decoder/support first. Keep an uncompressed known-good export for comparison and rollback.

## Effects art direction

- Melee contact: brief sharp ivory core, warm amber directional fragments, rapid decay. Emit at the actual contact point, not always at a fixed chest height.
- Guard: compact shield contact ripple and a short white deflect accent. Forearm protection remains visible.
- Storm spark: one focused travelling energy shape with a short tail; Twin spark is two. Do not let decoration alter projectile count or apparent reach.
- Discus: a thin, readable ring with a controlled spin and short trail. Keep the backward step visible.
- Footwork: tiny grounded dust cue on forceful push/landing, not smoke on every walk frame.
- Cinematics: reserve larger rings, stronger framing and brief light accents for finishers. Respect Reduce motion and the existing camera rules.

Author effect textures as separate original assets. Flipbook atlases must have consistent cells, alpha and timing; generated illustrations alone are not runtime-ready atlases. Use additive rendering sparingly and keep transparent coverage small on this laptop.

## Extras worth doing after the model proof

Eye focus and blink, restrained brow/jaw expressions, hand poses, a ponytail that settles, and a consistent material response will contribute more than a broad bloom filter. Add them in that order after face/shoulder deformation is working. Expressive fingers may use a small pose set rather than a full elaborate hand rig at runtime.

Image-to-3D or automatic animation services may be used for disposable blockout exploration only if available and useful. They are not assumed installed, free, or capable of preserving this exact face, back view, topology and fighting contacts. Do not purchase services or upload project assets to a new provider without the relevant authorization.

## Immediate build order

1. Model Tala's head/neck/shoulders and full silhouette against Design 02.
2. Make one reusable rig and deformation test: crossed guard, straight, hook, knee bend.
3. Bake/test original material maps and low-cost hair motion.
4. Validate advance, circle and combo in the actual fight camera.
5. Improve contact effects with pooling/batching and a small original flipbook set.
6. Profile two fighters on this laptop; then complete remaining clips and roster work.

Keep editable Blender sources and final exports versioned in GitHub. Use headless/local-compatible Blender or an explicitly available remote build environment for heavy jobs; GitHub storage alone does not automatically run Blender or supply a GPU. No heavy new tool installation is required just to play the game.
