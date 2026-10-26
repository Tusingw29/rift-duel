# Kinetic VFX — verification captures

Code: `41dae0e`, including Claude kinetic-chain `9a5a18a`. Cloud preview [40376269485](https://github.com/Tusingw29/rift-duel/actions/runs/40376269485) passed gameplay smoke, Morrow model smoke and these captures. 526 unit tests pass; targeted settlement checks confirm zero floor height after rebound. Browser reports contain zero page errors.

**Awaiting normal-speed verdict.** These are deterministic rendered frames, not a frame-rate or feel certification. No character rig, model or pose files were edited in the VFX lane.

| Capture | Timing / view | Reading and limits |
| --- | --- | --- |
| [aegis-blade-arc-side-1793038698404.jpg](aegis-blade-arc-side-1793038698404.jpg) | Aegis strike frame 10, tick 82 | Actual blade arc; side view foreshortens the cutting band. |
| [aegis-blade-arc-lock-1793038698404.jpg](aegis-blade-arc-lock-1793038698404.jpg) | Same frame, player camera | Narrow pale/cyan arc and ink edge; strongest silhouette is the curved tip path. |
| [morrow-blade-arc-side-1793038698404.jpg](morrow-blade-arc-side-1793038698404.jpg) | Morrow strike frame 14, tick 168 | Crimson curved sweep, irregular pale interior, ember edge fragments; opponent remains visible through fading history. |
| [morrow-blade-arc-lock-1793038698404.jpg](morrow-blade-arc-lock-1793038698404.jpg) | Same frame, player camera | Blade occludes part of the sweep; history follows the actual sword cut. |
| [aegis-beam-hand-lock-1793038698404.jpg](aegis-beam-hand-lock-1793038698404.jpg) | First projectile frame | Short muzzle/beam release stays ahead of the hand, no sheet from a non-sword attack. First-frame foreshortening hides most shaft detail. |
| [tala-bone-chi-side-1793038698404.jpg](tala-bone-chi-side-1793038698404.jpg) | 50-frame held charge | Gold wrist/ankle coils and compact ground cracks; wrist coils overlap the guard silhouette. |
| [capture-chest-tether-1793038698404.jpg](capture-chest-tether-1793038698404.jpg) | Palm slam at 0.75/1.8 seconds | Lifted chest restraint and hand-to-pelvis tether; whole victim framed. Ring looks narrow from this side camera because it is a world-oriented volume. |
| [ground-bounce-shockwave-1793038698404.jpg](ground-bounce-shockwave-1793038698404.jpg) | Rebound frame 4/12, root height 0.4763 | Floor crack/shard impact below the launched fighter; overhead shards are the preceding capture breakup, still within its lifetime. |
| [signatures-front-1793038722619.jpg](signatures-front-1793038722619.jpg) | Six runtime meshes, front view | Aegis / Rei / Tala above Morrow / Sol / Vesper; original ink and two-tone silhouettes. |
| [signatures-depth-1793038722619.jpg](signatures-depth-1793038722619.jpg) | Same meshes, oblique view | Solid sidewalls, separate echo/diamond elements; not sprite cards. |

The first preview revealed broad triangular trails and dark coil occlusion; it was not published. Final captures include curved/tapered alpha history and exposed coil highlights. The weakest framing is the first-frame beam shot: it proves the socket release but cannot show the complete moving helix. Helix depth and hand clipping have unit coverage. No screenshot settles the readability of rapid consecutive swings.

Reproduce with `scripts/review/kinetic-vfx.mjs` and `scripts/review/signature-volumes.mjs`; branch-preview Browser smoke workflow runs both and preserves their reports. `docs/KINETIC_VFX.md` describes geometry, timing and the Claude handoff.
