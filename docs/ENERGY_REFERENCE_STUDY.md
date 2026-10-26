# Energy study: from solid emblems to moving light

26 October 2026. This is a bounded visual study, not a claim to have reconstructed the original games' shaders or measured their animation frames.

## References actually inspected

- **Evil Zone:** [gameplay screenshot collection](https://flyingomelette.com/reviews/ps1/evilzone.html). Inspected `evilzone-2.png` through `evilzone-11.png`. Most useful: `-3` (thin open white loops and green emission around Keiya), `-5` (intersecting luminous green lines), `-8` (Erel's concentrated impact flash and outward streaks), `-10` (Al's layered translucent circular seal), `-11` (small separated charge accents). The shapes allow the scene to remain visible; they do not read like thick opaque emblems.
- **Soulcalibur VI / Azwel:** [publisher's character reveal](https://en.bandainamcoent.eu/soulcalibur/news/azwel-character-announcement-trailer) and its full-resolution promotional image; [released gameplay screenshot collection](https://www.trueachievements.com/n34304/soulcalibur-vi-screenshots-focus-on-newcomer-azwel). Inspected the opposing gauntlet colors and luminous weapon edges. The bright center, colored transition and surrounding irregular wisps create a hierarchy absent from our opaque polygons. These images establish appearance, not source shader implementation.
- **Production technique:** [Geri's Venom Slash breakdown](https://realtimevfx.com/t/venom-slash-breakdown-of-the-effect-included/18903). Its author describes a ring mesh with masks, scrolling texture detail, a color ramp and dissolving splash particles. This is a useful construction example, not evidence that either reference game used that particular implementation.

The public YouTube pages for the supplied practice video and the all-ultimate-attacks compilation could not be fetched in this session. No claim is made that they were watched or that reference timing was measured. Research screenshots stayed outside the repository; source links are retained here.

## Diagnosis of our previous assets

- Broad opaque fill and black extrusion made beams look like solid objects.
- White cores were smaller copies of an icon. Even after geometric clipping, that approach lacked flowing internal structure.
- Thick ring sidewalls read as a gear; capture needs a light binding with an open center.
- The same simple stroke construction did not communicate the difference between electricity, flame, spectral slashes and precise sentinel energy.
- More bloom alone would obscure these problems. Silhouette and layered motion must do the work.

## Implemented study

`flow-energy.js` builds curved, tapered 3D tubes with narrow bright filaments and larger translucent textured surfaces. It introduces no camera-facing replacement cards. Texture flow is evaluated from the supplied animation clock, so paused/hitstop time and reduced-motion mode remain explicit. An old/new switch makes comparisons possible using the production factories.

| Effect | New construction | Review criterion |
| --- | --- | --- |
| Aegis beam | Long bright axial filament plus three tapered, winding strands; texture moves through surrounding volumes | Clearly directional, visible from side and attack axis without the old solid arrow stack |
| Capture | Three thin incomplete orbits, a tilted secondary arc and eight small light accents | Open center and depth; no opaque ball or thick gear |
| Tala charge | Three rising curling wisps | Motion travels up the form rather than rotating an extruded flame badge |
| Aegis signature | Focused straight lance | Precise and concentrated |
| Rei signature | Paired crescent strands | Separated curved echoes |
| Tala signature | Curving electrical zigzag | Thin energized line with a sharp directional rhythm |
| Morrow signature | Wider crimson spectral crescent with a second trail | Weight through sweep and contrast, not opaque thickness |
| Sol signature | Three converging curling flame paths | Uneven rising flow |
| Vesper signature | Spatial diamond loop and central thread | Ordered angular geometry with an open center |

The workbench's polygon handles remain for the old solid finish. Flowing paths are authored 3D curves; the UI disables those handles in flowing mode rather than pretending they edit those curves. Signature body colors and the shared finish/beam-width controls work across preview and game. Solid-only ink/core/cadence controls are disabled in flowing mode.

## Imported assets

Two **unmodified** PNG masks from [Kenney Particle Pack](https://kenney.nl/assets/particle-pack): `smoke_01.png` and `trace_01.png`. The downloaded archive identifies itself as Particle Pack 1.1 and includes a CC0 license. They are used as surface masks on 3D volumes. No Evil Zone, Soulcalibur, MUGEN-ripped or other commercial-game assets were added to the game.

`dist/assets/vfx/kenney/manifest.json` records source, author, exact byte sizes, SHA-256 hashes and retrieval date. The original license accompanies the images. The two files total about 136 KB, avoiding a large asset-pack dependency.

## Limits

This does not modify combat timing, character poses, rigs, mocap, camera logic or the sampled sword trails. Isolated previews demonstrate morphology; real fights still establish socket placement and camera readability. Screenshot comparisons do not certify normal-speed feel. Further captures and a visual verdict are required before calling the look finished.

## Direct previews

- [Old/new workbench comparison](https://tusingw29.github.io/rift-duel/vfx-workbench.html?look=flow)
- [Playable flowing-energy preview](https://tusingw29.github.io/rift-duel/?energy=flow)

The comparison opens the new draft explicitly; the game link needs no saved local preset. Normal play retains the earlier finish pending visual acceptance.
