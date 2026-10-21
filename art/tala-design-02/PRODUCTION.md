# Tala Design 02 — Blender production guide

## Design lock

Adult, compactly muscular rushdown martial artist. Warm skin, amber-brown eyes, auburn swept ponytail, ochre vest, charcoal top, rust training shorts, ivory wraps and dark flat shoes. Calm confidence in neutral, focused brows in attacks, protective chin tuck in guard. The face is softly stylized and dimensional, not an anime decal on a cylinder.

Keep the current taller skeleton as the integration baseline. Target 7.5 skull-head lengths from sole to skull crown, excluding ponytail. This is an artistic target, not a statistic measured from a reference game. Do not normalize the other fighters to the same body shape.

Existing integration landmarks are roughly ankle 0.14, knee 0.78, hip 1.42, shoulder 2.32 and head joint 2.50 game units. These are rig pivots, not surface landmarks or a complete anatomical measurement chart. Read `dist/tala-model.js` before modeling. Preserve limb lengths initially; if anatomy requires a changed pivot, update rig, mesh bind pose and IK together.

## 1 — Reference alignment and silhouette

- Import sheet 01 into front/right/back reference planes. Manually align soles, knees, hip pivots, clavicles, eyes and skull crown. Generated views are not exact orthographic projections.
- Build a continuous low-detail body with a relaxed A-pose, elbows and knees slightly bent in their intended bend planes. Use real hand/foot volumes from the beginning.
- Check silhouette in flat gray, front/side/back and the real rear fight camera. A narrow waist must connect plausibly to rib cage and pelvis; do not pinch the entire torso with one scale factor.
- Keep a small set of named landmarks in the .blend file. Freeze the baseline only after a guard, a full punch and a deep knee bend look plausible.

**Done when:** face height and limb ratios agree across views, feet sit on one plane, shoulders connect to chest without caps or gaps, no texture is needed to recognize Tala.

## 2 — Head and neck

Build forehead, brow plane, cheekbone, jaw angle, chin and ear as connected volumes. Put eyes in sockets with eyelid rims; give the nose bridge/tip actual geometry. Mouth needs a shallow lip contour and corners, not a floating sticker. Use modest eye size and reserve strong contrast for iris, lash line and brow.

Blend the neck into sternocleidomastoid and trapezius forms. The jaw should remain distinct from the neck when tucked. Use neck rotation plus upper-spine flexion and a small shoulder rise; never fake the tuck by shrinking the neck bone. Allow eyes/head to maintain opponent focus while chest yaws.

Author neutral, focus, brace, pain and exertion face poses. Minimal facial control can use eyelid/brow/jaw shape keys, but they must be driven in the runtime before claiming expressions work. Keep the neutral face excellent even if expressions are deferred.

**Done when:** front/profile/three-quarter show the same person; tucked guard preserves jaw volume, eyes remain visible and collar does not cut through throat.

## 3 — Connected anatomy and topology

Route edge loops from clavicle across deltoid into upper arm and around the armpit. Add deformation loops at elbow/knee and a forearm volume that can twist without a candy-wrapper pinch. Give thigh, patella, calf, Achilles and ankle separate readable forms. Avoid equally thick tubes.

Use enough topology for deformation, not indiscriminate subdivision. Initial browser budget proposal: 12–18k triangles for the complete character, 2–4 material groups, up to four bone influences per vertex. These are starting budgets to profile on this laptop, not historical console limits or a promise that more triangles solve the style.

**Done when:** crossed guard, overhead uppercut, full straight, hook, kick chamber and deep crouch have no collapsed armpits, balloon elbows, knee spikes or detached shoulders.

## 4 — Costume and materials

Vest: curved armholes; standing collar folds from a sewn base; a real hem; shoulder seam; slight thickness. Back panel follows torso without turning into armor. Short hem avoids long cloth simulation. Top: fitted dark athletic fabric with restrained stretch folds. Shorts: waistband, crotch gusset, side vents and folds from hip/thigh tension; avoid painted random diagonal stripes.

Wraps: broad overlapping cotton bands with subtle relief. Model the silhouette and major overlaps; paint most seams. Hands must have readable knuckles and an opposing thumb. Shoes: low flexible upper, toe volume, heel counter, thin sole. Ball pivot must lie under the metatarsal area, not the toe tip.

Proposed color anchors: ochre #C99132, charcoal #272C35, rust #944738, ivory #E7DDC3, auburn #793628. Adjust under neutral lighting, not by matching a warm screenshot pixel exactly.

Start with a 1024-square body/costume atlas and a 512-square face/hair atlas. Use original painted albedo with broad form shading and restrained normal detail. No baked dramatic directional light. Initial roughness ranges to tune: skin .60–.75, cloth .85–.95, hair .55–.70, rubber .85. All nonmetallic. This is a proposed browser look, not the original games' shader implementation. Avoid the concept board's excessive skin sheen and fine pores.

**Done when:** skin, cloth and hair separate at fight-camera size, without bloom; seams support the form and do not shimmer.

## 5 — Hair

Build a cap, five broad fringe groups, two short side locks and three ponytail masses with staggered tips. Paint strand direction on surfaces; do not model hundreds of individual hairs. Add small separated cards only if alpha sorting and performance hold up.

Use a 3–4 segment ponytail chain with restrained lag and damping, plus collision clearance around shoulders. The current single ponytail bone cannot reproduce that motion on its own. Neutral hair hangs under gravity; it does not remain windblown as in the pose sheets.

**Done when:** ponytail follows a quick turn, overshoots once and settles; guard and recoil do not drive it through the face or back.

## 6 — Rig and deformation rehearsal

Preserve existing gameplay root and named bone mapping. Add authoring controls for pelvis, upper/lower spine, neck/head, clavicles, arm IK/FK, wrist orientation, leg IK/pole vectors, heel/ball/toe roll and ponytail. Controller bones need not export; deform bones do.

The current 17-bone GLB and runtime attachment do not automatically support these additions. Plan explicit bone mapping in `dist/tala-concept.js`, rest-pose preservation and animation driving. Do not silently export new bones and assume they will follow the procedural rig. Either extend that rig or bake authoring controls into its supported deform channels; document which route each clip uses.

Make one short deformation test action containing guard, straight, hook, uppercut, crouch and kick. Fix skin weights before polishing animation. Show a skeleton overlay to verify left/right and knee direction.

## 7 — Animation passes

1. Use safe filmed reference or clearly licensed movement references when available. Do not infer exact mechanics from stills alone. Current boards are authored proposals, not analyzed live-action footage.
2. Block support feet and pelvis using stepped keys. Show weight shift and balance first.
3. Add torso counter-rotation and shoulders. Then arms/wrists, neck/head, fingers.
4. Put the striking hand/foot at its contact target on the exact gameplay frame. Pose spacing must accelerate into contact.
5. Add breakdowns for heel lift, knee tracking, elbow travel and retraction. Avoid straight-line joint interpolation through the torso.
6. Convert only ready segments to smooth curves. Inspect all intervening frames for foot slide and joint overshoot.
7. Add hair/vest overlap last. Keep impact readable without effects.
8. Review full-speed, half-speed and frame-step from front, side and rear game camera. Test interrupted attacks, stop/start locomotion and block-to-attack.

Timing and support instructions are in ANIMATION.md. A 5-frame attack leaves little room for anticipation: make it compact, not delayed.

## 8 — Export and integration

Use the locally compatible Blender 3.6 pipeline. Save an editable source as a NEW `tala-design-02.blend`; retain the existing study as rollback. Bake control constraints to deform bones for GLB. Export a test model first, inspect scale/axis, rest transforms, texture color space and skeleton mapping before all clips.

Existing useful entry points:

- `scripts/build-tala-blender.py`: current procedural surfaces/export, to adapt as packaging rather than keep globally scaling cylinders.
- `scripts/sample-tala-motion.mjs`: existing seven-clip sample; not a complete new animation set.
- `dist/tala-concept.js`: GLB attachment and bone-name mapping.
- `dist/tala-animation.js`, `dist/rig-pose.js`, `dist/tala-footwork.js`: live pose/foot support contracts.
- `dist/tala-live-review.js`: actual live motion review driver.
- `dist/moves.js`, `dist/techniques.js`, `dist/special-variants.js`, `dist/stock-specials.js`: timing/effect authority.

Do not apply root movement both in the simulation and baked clip. Keep locomotion distance-driven. Exported constraint/IK results must agree with the runtime foot solver; use one owner for the final foot placement.

## 9 — Release gate

First deliver one finished Tala neutral model and guard/advance/combo proof in the real browser camera. Then complete the rest of her clips. Expand to other fighters only after visual review.

Run existing tests and add meaningful tests only for changed rig/timing contracts. Check draw calls, texture memory and two-fighter frame rate on the actual laptop. Verify untextured silhouette, cloth clipping, no foot slide, exact contacts, head tuck, hair settle and interrupt continuity. Passing tests does not establish the desired art quality.

This package completes concept and build planning. It does not claim a sculpt, new GLB, finished clips, or in-game visual upgrade has already been made.
