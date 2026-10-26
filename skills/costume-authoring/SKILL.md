---
name: costume-authoring
description: Author or revise a Rift Duel fighter's concept costume as runtime Three.js pieces parented to the combat bones over the Design 03 body, following the concept boards. Use for armour, coats, panels, drapes, hair locks, helmets and accessories, and for redesign passes.
---

# Costume authoring (runtime pieces on the combat bones)

Costumes are not baked into the GLB. `dist/roster-costumes.js` (Aegis, Rei, Sol, Vesper) and `dist/morrow-gravebound.js` (Morrow) attach pieces to the fighter's bones when the model loads; `dist/build-tala-threejs.mjs` tailors Tala's costume into her GLB instead. Pieces move with the bones, so animation never needs to know about them, and a redesign of the look leaves the animation intact.

## Reference first

Read the fighter's board in `art/roster-2026-10-21` (direction A is the working reference unless the board says otherwise; Morrow follows `art/morrow-gravebound`). List the defining features in words before touching code: silhouette masses, colour blocks, signature props. `docs/EVIL_ZONE_TASKS.md` and `art/roster-2026-10-21/MODEL-GAPS.md` record what is still missing per fighter.

## How pieces are built

- Helpers in `roster-costumes.js`: `plate(parent, outline, depth, material, name, pos)` for extruded armour, `tube(parent, mat, name, rows, segments, open)` for collars, sashes and coat bodies (rows of `[rx, y, rz, ox, oz]`, optional open arc), `panel(parent, mat, name, shape(u,v))` for hanging cloth, `sweptLocks(head, mat, locks)` for hair, `recolorUnderlayer(r, test, color)` to retint the stock garment or shoes.
- Parent to roles: `roles.get('chest'|'root'|'head'|'upper_arm.L'|'forearm.R'|'thigh.L'|'shin.R'|'foot.L')`. Cloth that should sway hangs from `r.clothParts[i]` (Rei has two coat-tail joints, the casters three panel joints, Aegis a cape joint, Morrow a mantle joint); the shared animators swing those joints.
- Name every mesh (`'Rei waist sash'`); `tests/fighter-v3.test.mjs` asserts the signature pieces by name per fighter. Add new signature pieces to that list.
- Weapons stay in the classic models, tagged `userData.weapon=true`; replace one by removing the tagged meshes under the hand and adding a new group tagged the same way (Morrow's Gravebound shows the pattern).

## Measure, do not guess

- Head space: eyes about +0.06, crown +0.24, chin −0.08 above the head joint; a helmet shell of radius ~0.16 at +0.09 covers the skull.
- To place anything relative to a weapon or hand, print world positions with a node snippet: build the character, attach the GLB, `applyPose`, `updateMatrixWorld`, then `hand.localToWorld(new Vector3(x,y,z))`. Rei's blade tip is hand-local `(0,.12,1.74)`, Sol's staff top `(0,1.5,.06)`.
- Guard, strike contact and run must be checked after any costume change because pieces are rigid per bone and can intersect.

## Review loop

1. `node --test tests/fighter-v3.test.mjs`.
2. `fighter-review.html?fighter=<id>` with the costume on, then off (checkbox), from front, side and back, in idle, guard, run and strike (capture with `skills/visual-review-capture`).
3. Write the remaining gaps into `art/roster-2026-10-21/MODEL-GAPS.md` honestly; a jacket recolour is not an armour implementation.

## Known limits to respect

Flat extrusions have no panel lines; stock tees give short sleeves; hair locks are tubes, not strands; no fighter has a facial likeness pass. If the user is still deciding a character's design, hold costume detail and spend the time on body motion instead.
