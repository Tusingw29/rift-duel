# QUATERNIUS-REACTIONS: Quaternius hit reactions for Tala (2026-10-27)

**Status: Review — awaiting Adam's normal-speed verdict.** Branch `claude/quaternius-reactions`, not merged. It is built on `claude/bvh-strike-mode`, which carries the converter guard and tests. The reactions show only with `&anim=imported`; authored is still the default everywhere. `dist/combat.js` is untouched.

## Watch it

Serve the branch (`python3 -m http.server 4195` in `~/rift-worktrees/quaternius-reactions`), then open:

- **Unguarded hit (Hit_Chest):** `http://localhost:4195/dist/sandbox.html?scenario=recoil&p1=2&p2=1&anim=imported`
- **Guarded hit (Hit_Head):** `http://localhost:4195/dist/sandbox.html?scenario=guard-hit&p1=2&p2=1&anim=imported`
- **Authored:** the same links with `&anim=authored`, or the Animation selector in the sidebar.

## Source

- Quaternius Universal Animation Library, Standard pack, `Hit_Chest` and `Hit_Head`. CC0 (opengameart.org/content/universal-animation-library).
- Exported from Blender 3.6, Y-up, with the bones renamed to CMU names. 24 fps.
- The BVHs stay in `~/rift-tools/mocap/quaternius`. `scripts/mocap/export-quaternius-reactions.sh` regenerates `dist/clips/import/hit-chest.js` and `hit-head.js`.

What the takes contain:

| Take | Length | At the hit | Settles into |
| --- | --- | --- | --- |
| Hit_Chest | 9 frames, 0.33 s | chest back 0.21, head back 0.40, arms pushed forward, knees give 0.13 | the pack's idle stand |
| Hit_Head | 11 frames, 0.42 s | head snapped back 0.33 and turned 0.11; little else moves | the pack's idle stand |

The idle stand has the hands at hip height, not a fighting guard. Both takes open on the hit on BVH frame 0, which the converter used to skip as a rest pose.

## Converter

- **`--keep-first`** keeps BVH frame 0 for takes that start on a real pose.
- **`--mode reaction`** handles a one-shot with no wind-up:
  - Heading comes from the settled pelvis, because hands hanging at the sides give no guard direction.
  - Hips and ankles are stored relative to the settled last frame, so the deviations reach zero when the reaction ends.

## Runtime (`dist/imported-motion.js`)

The simulation records no hit height or attacker on the defender: only `anim:'hurt'` with `animTime`, or `blockStun` on a block. So each clip is mapped to one of the two hit states.

| State | Clip | Timing (both timers stop in hitstop) | What moves |
| --- | --- | --- | --- |
| Unguarded hit | Hit_Chest | Played over the hurt window (`animTime` 0.42 → 0 s); hitstop holds the hit frame with the shared hitstop shudder | Spine, head, pelvis turn and arms |
| Guarded hit | Hit_Head | Warped onto the 0.12 s block stun, 3.5× the source speed | Head, spine and pelvis; her arms stay in guard |

- Each clip is applied as deviations from its own settled last frame, added to Tala's stance or guard. The reaction starts on the hit pose and lands exactly back in her own pose.
- Her legs stay hers; the feet are planted by her IK. The hips follow the take's small settle.
- The knockback root travel belongs to the simulation, as before.
- The mapping is one line (`REACTIONS`) if you'd rather swap the two clips.

## What I saw (`recoil-A-over-B.jpg`, `guard-hit-A-over-B.jpg`)

Side camera, Tala (P1) against Aegis. In each image the top row is authored and the bottom row is imported.

- **Recoil frames:** 12 is the hit and hitstop holds through 18; then 16, 19, 24, 30 and 36.
- **Guard-hit frames:** 32 (the block), 33, 34, 36, 38 and 40.

Rendered head and chest movement, along her facing:

| | Authored | Imported |
| --- | --- | --- |
| Recoil: head thrown back | 0.85 (from +0.12 to −0.73) | 0.25 (from +0.12 to −0.13) |
| Recoil: chest | 0.27 back | none |
| Guard-hit: head | 0.16 back, chest 0.07 | 0.03 |

The head positions use the head joint at the top of the neck, so a pure nod barely registers there.

- **Recoil reads as a flinch, not a hit.** Hit_Chest bends the upper spine back and lifts both forearms toward the face, which is the source's arms swinging up. The torso stays nearly upright, so the head moves about 30% as far as in the authored arch.
- **Guarded hit is close to invisible.** Hit_Head is mostly a head pitch. Squeezed into the 7-frame block stun, it's smoothed almost flat by the animator's blend. Where it does show, it lifts the chin, which is the opposite of the authored block's head tuck.
- **No defects in the list.** I found no wrong side, no limb through the body, no foot sliding beyond the simulation's own knockback, and no backward-lean error. Both reactions return exactly to her stance or guard.
- **Blade overlap:** Aegis's blocked blade passes through Tala's forearm and chest in both rows. That comes from the attacker's strike and guard geometry, not from this change.

My read: the Quaternius reactions are clean but much smaller and softer than Tala's authored hit. The authored hit has the Evil Zone snap you've been asking for. I didn't amplify the clips; that would be hand-tuning, and your verdict comes first.

## Tests

608 pass. That's 603 on `claude/bvh-strike-mode` plus 5 in `tests/quaternius-reactions.test.mjs`:

- the clips carry their CC0 source, the hit frame is kept, and they settle to zero deviation
- the timers map hit → end, the hit pose is thrown back, and they end exactly in her stance or guard
- the guard keeps her arms and legs
- hitstop holds the pose, with the shudder
- both recipes reach the states and the imported targets equal the reactions
- **default unchanged:** in the authored source, the animator still returns the authored recoil and guard poses exactly
- two fresh rigs give identical bones through both recipes, and scrubbing equals stepping

`tests/tala-import-ab.test.mjs` now accepts a Quaternius CC0 source as well as CMU.
