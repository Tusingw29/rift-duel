# VFX workbench — inspect, change, compare

[Open the tool](https://tusingw29.github.io/rift-duel/vfx-workbench.html). Implementation `6665c5c`; geometry correction `783e84f`. **564 unit tests pass**. [Successful cloud browser run](https://github.com/Tusingw29/rift-duel/actions/runs/40403042179).

The first browser run exposed a harness-only issue when opening a second page from Playwright's implicit single-page context. It was changed to an explicit shared browser context, preserving localStorage for the gameplay handoff. The rerun passed. The exported candidate is [crisp-stroke-candidate.json](crisp-stroke-candidate.json); import it into the tool or use “Try crisp stroke”. It is not the normal game default.

| Capture | Frame / reading | Remaining weakness |
| --- | --- | --- |
| [Morrow before](before-core-clip-morrow.jpg) → [after](workbench-signature-3-30-three.jpg) | Preview frame 30. Inspection revealed a pale core poking beyond a concave notch. The core now intersects the original silhouette before extrusion. | Core is contained but the motif still needs art-direction judgment in motion. |
| [Tala before](before-core-clip-tala.jpg) → [after](workbench-signature-2-30-side.jpg) | Preview frame 30. The bright streak no longer extends beyond the amber body; the redundant self-crossing tail point is also removed. | A static isolated glyph does not establish charge choreography. |
| [Beam side](workbench-beam-0-30-side.jpg) | Frame 30. Draft width .7 / rib scale .55 removes much of the coil clutter. White channels remain outside the opaque body. | The body still has a stepped, geometric profile; this is a cleaner candidate, not the finished concept-board beam. |
| [Beam axis](workbench-beam-0-30-back.jpg) | Frame 30, camera looking down the travel axis. Both remain actual volumes. | Draft becomes small head-on. Do not accept width reduction based only on the flattering side view. |
| [Capture binding](workbench-capture-5-30-three.jpg) | Frame 30. Open volumetric binding, world-oriented; character remains visible through the opening. | Thick sidewalls still read somewhat like a solid gear. Thickness/silhouette refinement remains. |
| [Breakup](workbench-beam-0-54-three.jpg) | Preview frame 54. Closed signature shards scatter through depth and clear by frame 66. | Demonstration trajectory/timing, not a claim about actual impact timing. |
| [Fight default side](workbench-fight-default-side.jpg) / [draft side](workbench-fight-draft-side.jpg) | Real simulation: Aegis beam, four steps after creation. Same input sequence and camera. The draft occupies less space beneath the sword and has fewer competing coils. | Single sampled release frame; motion not accepted. |
| [Fight default lock](workbench-fight-default-lock.jpg) / [draft lock](workbench-fight-draft-lock.jpg) | Same simulation state, behind P1. Confirms saved presets reach the production beam. | **Weakest view:** P1's body and the release flare hide much of the beam. Width alone does not fix this. |

## What was verified

The browser exercised all six captured asset views, point dragging, save/export/import, malformed-import rejection, identical reverse-seek pixels and saved-preset loading in the actual sandbox. No page exceptions. Existing gameplay, Morrow art, kinetic VFX and frame-budget browser checks passed too. The published-site check additionally exercises comparison PNG download and play/pause advancement.

The workbench uses the actual production effect factories, with an intentionally isolated preview sequence. Its timeline is not a substitute for simulation timing, hitstop, socket attachment, sword trails, or animation blending. Use the game/sandbox links for those. No character, rig, pose, mocap or combat code was changed.

Screenshots establish visible geometry and framing only. **Awaiting normal-speed verdict.** The old captures label the callback rate “render fps”; the final UI correctly calls this “UI fps”. It is not a gameplay performance benchmark.
