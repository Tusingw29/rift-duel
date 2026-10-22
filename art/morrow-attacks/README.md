# Morrow / Gravebound attack choreography

This change owns animation only; character geometry, textures, damage, reach and move timing are unchanged. The attack-study page uses whichever Morrow model is currently attached by the game.

- **Iron Crosscut:** load on the rear leg, turn the hips before releasing the blade, cut across the rival and brake through the leading leg.
- **Returning Sweep:** reverse the loaded torso and supporting foot; carry the blade back through the other side.
- **Gravefall:** raise the handle with both hands, brace through the knees, drive an overhead cleave, then settle into its recovery.

All contacts still occur at the move's actual `startup` frame. The 12-frame startup is preserved. Faster late acceleration fits inside that window; follow-through and recovery fit inside existing recovery frames. Buffered transitions retain the incoming arm pose, grip closure and ankle turn.

`dist/morrow-animation.js` authors the whole-body pose keys. `dist/morrow-attack-motion.js` adds ball-of-foot pivots and a two-arm grip solve after transition blending. Bone lengths never change. The primary wrist keeps its authored world orientation while its location moves into both arms' reachable space. A character model can optionally set `rig.supportGripAnchor` to an Object3D on the handle. Otherwise the support wrist targets `(0, -0.02, -0.16)` in the right-hand frame, matching the current Gravebound grip. No new skeleton bones are required.

The solver releases on interruption, air/shared moves and completed recovery. This pass covers the grounded three-cut melee chain; projectiles, captures, supers and aerial attacks retain their previous choreography. Fingers use the model's existing geometry; independent finger articulation is not available on the current rig.

## Integration while character art is in progress

The work is isolated in `anim/morrow-gravebound-attacks`. No model builders, fighter specifications, costumes or GLBs were edited. The only shared animation entry-point edit imports/calls the attack solve in `dist/animation.js`. If the character grip length or hand basis changes, update the optional support anchor rather than reauthoring the attack keys.

## Review

`morrow-attacks.html` offers a connected three-cut combo, separate cuts, normal/half/quarter speed, timeline scrubbing and front/side/rear views. The browser workflow captures wind-up, contact, follow-through and recovery for each cut. Automated tests cover contact reach/timing, fixed bone lengths, closed grip, hitstop determinism, interrupted release, buffered grip continuity, and the anatomical model under translated/rotated/scaled world placement.

Headless screenshots establish pose/attachment correctness; they do not establish normal-speed feel on the user's hardware. Character armor can still intersect itself in raised-arm poses and is being worked on separately.
