# Readable combat frame budgets

Original Rift Duel tuning at 60 simulation frames per second. These are Adam's requested target ranges, not independently measured DOA, Soulcalibur or Tekken frame data. Hitstop pauses the simulation, so wall-clock durations can be longer.

## Recovery contract for the renderer

- `jumpSquat.frame`: 0–5; `frames: 6`. Grounded until the next simulation step launches.
- `bounce.frame`: 0–17; `frames: 18`, `airFrames: 12`, `phase: rebound | drop | settle`. Six frames upward, six downward, six grounded. Height peaks at 0.55 on frame 6 and is exactly zero from frame 12 onward. `groundBounce` fires once on the initial impact.
- On settle, `air = 0`, `launched = false`, `anim = knockdown`. The settled body retains the end of the existing fall pose clock (`animTime = 0`), avoiding a second fall from standing.
- Preserve the existing 21-frame grounded recovery-choice window after the bounce. A fresh direction selects the recovery roll; fresh guard can start the rise early. Automatic recovery therefore takes **18 + 21 + 28 = 67 frames after initial floor impact**. A direct grounded knockdown takes 21 + 28 frames (burst knockdowns retain their additional 9-frame fall).
- `getUp.frame`: 0–27; `frames: 28`, `anim: getUp`. Existing pose math reads these explicit frames. Automatic rise is protected throughout. The existing manual guarded-rise rule retains a 6-frame safe start and vulnerable finish; held/buffered guard engages when the rise ends.
- Inputs in the final six frames of wakeup still execute at the first actionable step. Hitstop freezes bounce, get-up and motion clocks.
- **KO is separate:** lethal hits end the match immediately and release hitstop. The existing `fdfe66c` cue-clock defeat collapse and airborne finish, renderer, rigs and pose modules are unchanged.

## Melee timings

Each entry is startup / active / recovery (total).

| Fighter | Hit 1 | Hit 2 | Hit 3 |
| --- | --- | --- | --- |
| Tala | 9 / 3 / 16 (28) | 13 / 4 / 22 (39) | 18 / 5 / 26 (49) |
| Aegis, Rei, Sol, Vesper | 10 / 3 / 18 (31) | 14 / 4 / 24 (42) | 21 / 5 / 30 (56) |
| Morrow | 11 / 3 / 20 (34) | 16 / 4 / 26 (46) | 24 / 5 / 34 (63) |

Connected melee hit 1 cancels from frame 14; hit 2 from frame 20. The window lasts through ten frames after that threshold. Whiffs and hit 3 remain committed. Each cut can connect on a later active frame if the first frame misses, but damage/block resolves only once. Launchers use the same single-contact latch.

An attack queued during confirmed melee hitstop retains six input frames after the remaining freeze, provided the next cancel threshold is within six simulation frames. This keeps confirmed taps usable without granting late whiff cancels or indefinite buffering. Holding attack still charges rather than automatically chaining.

Launchers and basic forward/back specials use 18–24 startup, 4–5 release/contact, and 28–34 recovery frames. Burst uses 22 / 4 / 34. A widened release window does not duplicate projectile spawns or restart a cinematic.

## Preserved move identities

Ordinary ranged taps, captures, pursuit beats, crossovers, and defensive reversals retain their distinct timings. Multi-pulse stock attacks and follow-up variants retain their pulse intervals. Rushes and barriers use `active` for movement/channel lifetime, not a generic melee hitbox: their base totals are now 50–64 frames with 18-frame startup and 26–28 recovery. Sol's base ward channel is 20 frames to fit the 64-frame total. Multi-stage variants can exceed 64 frames; compressing those intervals would change their mechanics.

## Preview/export consistency

Melee review drivers now request timing by chain number. Sandbox combo/reversal recipes wait for actual connected cancel windows rather than fixed tap frames. Tala's portable preview clips are resampled from the unchanged runtime animator using `node scripts/refresh-tala-clips.mjs`; the script verifies byte-identical model/skin data and unchanged rig, mesh, material and scene definitions before replacing animation tracks. This is a clip refresh, not a model rebuild.

Verification captures are produced by `scripts/review/frame-budgets.mjs`, alongside the existing gameplay smoke and VFX capture checks. Normal-speed animation quality remains Adam's review item.
