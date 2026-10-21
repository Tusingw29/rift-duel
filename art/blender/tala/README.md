# Tala Blender study

Original model study based on Storm Circuit (concept A). Concept model study 3 reshapes the shoulders, separates the open ochre vest into front and back panels with armholes, replaces stacked binding rings with continuous wraps, and fans the auburn ponytail into five swept locks. Shorts cover the upper thighs with revised skin boundaries; a small nose and ears give the face a modeled profile. The face texture now follows the jaw and cheek surface rather than sitting on a separate cylindrical mask. The painted face reuses the project's original generated Tala face asset.

This is a separate review asset, not a replacement for the live fighter. Motion study 2 preserves the upper-body combo and its 60 Hz contact timing, while adding a crossed-forearm guard, staggered advancing/retreating/circling steps, ball-of-foot pivots with heel lift, hip weight shifts, and a rear-foot catch/recovery after recoil. Two-bone leg solves keep segment lengths fixed as the ankles articulate. This is original authored animation, not motion capture or a completed concept-art match.

## Files and reproduction

- `tala-study.blend`: editable mesh, weights, armature, materials and seven animation actions. Face image is packed.
- `motion-source.json`: sampled world bone transforms from the existing game animator.
- `build-report.json`: export version and geometry/clip counts.
- `../../../dist/assets/models/tala-study.glb`: browser asset.
- Public review: https://tusingw29.github.io/rift-duel/tala-blender.html

From the repository root:

```sh
node scripts/sample-tala-motion.mjs
/path/to/Blender --background --factory-startup --python scripts/build-tala-blender.py
```

The script supports Blender 3.6 and newer export APIs; the complete export was verified with Blender 3.6.22. Blender 4.5.12 on this macOS 12 machine built and saved the model but failed when the glTF exporter imported NumPy (`_cblas_caxpy$NEWLAPACK` missing). Use a compatible Blender build; do not treat a successful `--version` or mesh command as a complete exporter compatibility test.

## Review scope

Inspect front, side and back, then all seven clips at normal and quarter speed. The timeline scrubs the actual GLB. Keep the game's contact times at 5/60, 25/60 and 45/60 seconds when editing the Combo action. The model still falls short of the concept sheet: face integration, hands, garment intersections and proportions need further review. Movement smoothness and balance still need player judgment at normal speed. The game still handles procedural locomotion and combat; no runtime animation-controller migration is included here.

## Movement reference

[England Boxing Coaching Handbook, Part 1](https://www.englandboxing.org/wp-content/uploads/2026/02/EB_Boxing-Coaching-Handbook-Part-1_09_02_26.pdf), pages 68 and 75, informed the stance-preserving footwork and ball-of-foot/hip rotation. These are animation references, not a claim of biomechanical simulation. The crossed-arm shield is the user-requested stylized guard, distinct from the standard guard on page 67.

Locomotion clips are in-place loops: their support feet move relative to the centered character to represent travel. They are not a demonstration of stationary world-space foot contacts without the corresponding game root movement. The live game still uses its original controller.

## Playable model preview

Open https://tusingw29.github.io/rift-duel/?tala=concept and select Tala. The preview replaces Tala's rendered surfaces with the exported Storm Circuit mesh while retaining the live combat skeleton, hand attachment points and combat animation/state machine. It works in training, versus and the menu. Both Tala instances receive separate geometry/materials/skeleton bindings. This does **not** import the study page's seven animation clips or its guard/footwork choreography into combat.

The regular URL retains the original model while art review continues. The asset loads only for Tala in the preview; failure retains the original fighter and displays a message. Leaving a fighter before loading finishes prevents attachment to a disposed rig. A link on the inspection page opens this playable preview.

The crossed-body guard is now authored in the live pose channels as well: hands cross in front of the upper torso, the chin tucks, and block recoil preserves coverage. This applies to both Tala models. Entry/release use the existing live transition system; no animation clip is played over the combat timeline. The concept preview now includes live directional step-and-follow locomotion and a recoil catch-step. The playable concept model now uses combat-frame-driven ankle pivots.


## Live concept-model feet

The concept model's two foot bones now participate in the grounded pose solver. Shoes remain level while the knees bend. During melee strikes the driving heel lifts and turns (right foot for hits 1/3, left for hit 2); the ankle and knee adjust around a fixed ball-of-foot contact. Recovery returns the shoe to level. Combat frames drive this motion, including hitstop, rather than a separate animation clock. This currently applies to the concept-model preview; the original Tala mesh lacks independent foot weights.


On grounded hits the concept model keeps its front foot planted and lifts the rear foot into a short backward catch. It holds that support through longer stuns and steps back into stance as stun ends. A repeat hit continues from the current catch position. Recoil offsets follow remaining stun time, so frozen frames remain still. This changes only the visual support solve, not knockback, stun duration or player controls.


## Live directional gait

In the concept preview, advance leads with the front foot, retreat with the rear foot, and circling with the foot nearest the direction of travel. The first steps are shorter to leave fighting stance without overextending the support leg. Circling uses a shorter stride than advance/retreat. Swing feet start from their last contact, land on the floor, and maintain lateral spacing; a released movement input settles a raised foot over 0.08 seconds. Hands stay nearer fighting stance instead of pumping like a jog. Step phase remains tied to distance travelled, so hitstop does not keep the legs running in place. These are live controller-aware paths, not direct playback of the inspection page's in-place clips.


## Concept model study 4

The model now has rounded shoulder caps and closed wrapped fists with four modeled fingers and an opposing thumb. These shapes stay bound to the existing hand bones; fingers are not independently animated. The face overlay follows more of the jaw profile's rows with additional surface clearance, but its shading/material transition still needs refinement. The inspection page adds an upper-body close-up button. The saved study clips are unchanged; use the playable preview for the latest live neck/guard/footwork behavior.
