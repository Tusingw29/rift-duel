# Fidelity audit — October 20, 2026

This audit separates a working original game from exhaustive knowledge of Evil Zone. Passing Rift Duel tests proves its own rules, not historical accuracy.

## User requirements and current evidence

| Requirement | Evidence | Assessment |
|---|---|---|
| Study mechanics, cameras, moves, configuration, animation | `EVIL_ZONE_RESEARCH.md`, manual transcription, three move guides, contemporary review, sampled capture footage | Substantial desk study; conflicting inputs and original timings remain unresolved |
| Similar original characters and play styles recognizable to fans | Six distinct rigs, silhouettes, signature techniques, bursts; `fighters.js`, `characters.js`, `techniques.js`, `cinematics.js` | Implemented broad archetypes; fan recognition has not been independently validated |
| Play with WASD or controller | Keyboard browser checks, synthetic standard-gamepad menu/combat checks, input unit tests | Implemented and software-verified; physical controller hardware still untested |
| Build/save in GitHub with a small laptop footprint | Public repository, Actions deployment, static vendored runtime, no node_modules | Delivered with a small local checkout; editing still occurs locally, not in a cloud IDE |
| Decide Godot versus custom development | `DESIGN.md` comparison and working browser implementation | Three.js plus custom combat chosen for link-first delivery; Godot remains a production-animation alternative |
| Anyone with the link can play | Public GitHub Pages deployment and browser verification | Delivered, subject to a compatible WebGL 2 browser |

## Research corrections and confidence

The linked PDF is an eight-page printout of iFlAB's manual transcription, not an original scanned booklet. Its provenance is visible in its heading. It lists practice opponent behavior and input display; these informed the training update. Its close-combo description says the initial press produces two hits and another press adds the third, whereas the Otaku_Tom guide describes three taps. Rift Duel currently uses three separate taps. Neither text alone resolves the discrepancy or establishes frame timing. [Manual transcription](https://www.musee-des-jeux-video.com/fr/manual/Playstation/35111_us-Evil-Zone.pdf), [move guide](https://gamefaqs.gamespot.com/ps/197247-evil-zone/faqs/8087).

Secondary summaries report a button-contest event when simultaneous dashes meet. This has not been directly verified in footage, and Rift Duel's existing simultaneous capture/burst clash is a different mechanic. Do not label the current clash a faithful Pressure Dash implementation. [Secondary overview](https://en.wikipedia.org/wiki/Evil_Zone).

## Priority fidelity gaps

1. **Capture versus burst identity.** Versions 0.11–0.17 provide individual profiles for all 24 current-roster capture contexts, with separate stock-burst choreography. Coverage is complete for these six fighters; contact posing, transitions and frame-level correspondence still need polish and observation.
2. **Special variants and stock economy.** The guide describes follow-up and held-input variants of character specials. Version 0.13 adds Aegis’s held forward volley and Sol’s held retreating spread, each costing one stock. Version 0.14 adds alternate up-specials for all six fighters, selected by another tap during wind-up. Version 0.19 adds all twelve forward/back tap variants. Version 0.20 adds eight held-stock specials covering all six fighters. Exact original input behavior, balance and simplified effects still need validation; this is not a claim of complete original-system equivalence.
3. **Neutral and aerial movement.** Launch, pursuit, crossover, recovery, and sidestep exist. Version 0.18 adds a three-contact aerial pursuit with air-recovery escape and height-aware framing. Original pursuit timing, dash contests, tracking, and camera timing still need direct observation.
4. **Research confidence.** Measure only from lawful gameplay access or suitable footage. Preserve regional/version labels and distinguish observations from guide claims. Do not publish invented original-game frame data.
5. **Presentation and roster depth.** The six existing archetypes do not cover all ten original roles. All six character models have been rebuilt as of 0.46, but simple materials, procedural animation and several early home arenas remain visibly alpha quality. Rei, Sol and Vesper still use shared choreography. Story staging (deferred at user request) and character-specific capture clips need work before claiming a full presentation match.

Later features listed in `DESIGN.md` are development possibilities, not evidence of completion and not substitutes for the requested combat and character fidelity.

Version 0.21 preserves short keyboard/touch transitions between rendered frames, with independent player queues and pause clearing. This improves execution reliability; it does not establish original-game input timing or resolve the documented combo-input conflict.

Version 0.22 corrects Tala’s two base horizontal specials to the energy-shot and stunning-disc identities documented for the martial artist inspiration. These replace an inaccurate lunge and generic bolt. Original tuning remains unmeasured; automated checks do not prove animation fidelity.

Version 0.23 corrects Morrow’s base horizontal identities from duplicate bolt spreads to a stunning ground wave and an interruptible eight-missile barrage. The selected-fighter manual now explains both. Timing and spread remain original tuning, and visual browser inspection of the new wave is pending.

Version 0.24 separates Aegis’s lightning from beam fire, Rei’s spirit from sword, and Vesper’s fire from ring trap. Base-move descriptions now appear in their manuals. Sol’s base two-shot pattern is still an original simplification requiring verification. Projectile visuals added in 0.23–0.24 have scene-object checks but await browser inspection.

Version 0.25 adds saved keyboard remapping for both players with conflict rejection, reserved Escape, default restoration and current-key fight prompts. This addresses configurable controls for the browser adaptation; controller bindings remain fixed. UI browser verification remains pending alongside the recent projectile visuals.

The pending browser checks are consolidated in [BROWSER_ACCEPTANCE.md](BROWSER_ACCEPTANCE.md), including keyboard remapping, reload persistence, touch controls, projectile visibility and controller-menu navigation. Public delivery of all 23 release modules has been verified byte for byte.

Version 0.26 resolves the broad Sol base-move gap using three guide descriptions: one stunning forward fire shot and a retreating knockdown flame. Names and bird/dragon imagery conflict among sources; exact timing and art fidelity remain unverified. All twelve current-roster base directional specials now have explicit definitions. This closes the documented duplicated-pattern problem, not all move-fidelity work.

The post-0.26 Chrome pass resolves the tool-access blocker and verifies the keyboard editor’s main interactions, touch remapping and synthetic controller-menu navigation. Screenshots confirm the new projectiles render; they also reveal narrow ground-wave and flat spirit silhouettes that need polish. The [acceptance record](BROWSER_ACCEPTANCE.md) lists exact checks and limits. This is not completion of all fidelity or art work.

Version 0.27 moves the camera behind the player with opponent-relative movement, adds hitstop, shake, a K.O. hold, winner poses, a round ceremony, six home arenas and synthesized music/effects. These are feel improvements modelled on the general presentation described in reviews, not measured camera distances, hitstop frames or original music. The up/down direction commands are now mapped to the circling keys (A/D), an original adaptation since the source mapping is unresolved among guides.

Version 0.28 replaces snapping basic melee poses with original authored pose tracks, differentiates advance/retreat/circling steps, and adds dash lean and guard recoil. These use the existing combat frame clock and preserve gameplay values. Local P2 relative keyboard movement is now browser-verified. Contact posing and broader animation polish remain ongoing; this is not measured Evil Zone animation reconstruction.

Version 0.29 adds swing trails, afterimages, guard flashes, launch tumbles and swing/dash sounds. These are stylistic choices in the spirit of PS1 anime fighters, not reconstructions of specific Evil Zone effects.

The 0.35 visual study corrects the earlier blanket description of the behind-player camera as Evil Zone's signature: sampled neutral and melee footage also uses low profile framing. See `EVIL_ZONE_ART_DIRECTION.md` for timestamps, observations and explicitly unfinished art work.

The 0.36–0.38 art passes add painted arena assets, revise Tala's proportions and face fit, and replace repeated vest shading with a front/back costume map. The user explicitly rejected the result as an Evil Zone art match. This is evidence that the visual target remains unmet, regardless of passing rig tests. The next art review must compare complete fighter silhouettes and animated fight views, including the older rival models, rather than counting added textures as success.

Version 0.39 replaces Aegis's generic model with an original articulated plate-armor rig. Tala and Aegis now have separate model modules; Rei, Morrow, Sol and Vesper still use the shared older builder. Aegis still uses shared animation tracks, so the model change does not close his motion-fidelity gap.

Version 0.40 gives Aegis authored grounded movement and three separate sword cuts, with planted ankles and level boot soles. His captures, aerial actions and burst choreography still use shared fallback paths. Original-game frame correspondence and subjective fidelity remain unproven.

Version 0.41 blends Tala/Aegis handoffs between authored grounded and shared action poses while preserving contact frames and world-space action paths. It fixes an ankle-reset omission from 0.40. Shared choreography and cinematic root placement are still separate fidelity gaps.

Version 0.42 replaces Rei's generic model with a weighted coat-and-hair rig and painted facial features. Her training-opponent appearance and burst copies use the new model. Three fighters now have separate authored model modules; Morrow, Sol and Vesper still use the older builder. Rei's animation remains shared.

Version 0.43 replaces Moonlit Shrine's sparse grid-and-gates setting with a textured architectural courtyard and full surrounding grounds. Storm Summit and Moonlit Shrine now have substantive environment passes; Orbital Relay, Iron Wastes, Ember Archive and Silent Orbit retain their simpler settings. Visual fidelity remains unfinished.

Version 0.44 replaces Morrow's generic model with weighted armor and a distinct heavy-weapon silhouette. Four fighters have dedicated model modules; Sol and Vesper retain the older builder. Morrow's committed heavy choreography and Iron Wastes presentation remain open.

Version 0.45 gives Morrow distinct heavy melee cuts, grounded footwork and reactions, with weighted ankle joints and shared-action handoff blending. His special/capture/burst choreography and Iron Wastes environment remain open refinement areas.

## Current Tala concept-preview scope (October 21, 2026)

The playable art preview is https://tusingw29.github.io/rift-duel/?tala=concept. It uses the exported Storm Circuit study surfaces on the existing live combat skeleton. The regular URL retains the earlier Tala model. The inspection page's seven baked clips are not the live animation controller.

| Area | Regular build | Concept preview |
| --- | --- | --- |
| Crossed guard, chin tuck and neck release | Live | Live |
| Independent shoes and strike ankle pivots | Earlier mesh lacks foot weights | Live |
| Rear-foot recoil catch/recovery | Earlier reaction | Live |
| Directional step-and-follow and stop settling | Earlier locomotion | Live |
| Shared captures, aerial moves and burst | Shared fallback choreography | Same fallback choreography |

Verification uses actual exported skin data, sampled live animation and Chrome interaction. Passing checks do not establish Evil Zone art or motion parity. The concept still has simplified face shading, hands, clothing detail and shoulder integration; user acceptance of the complete moving model remains unproven. Original-game frame correspondence, broader cinematic choreography, the remaining roster's motion and several arena presentations remain open. Story staging stays deferred at the user's request.

### Live motion review correction
The Tala review page now defaults to current runtime animation instead of older
baked clips. It offers eight scripted actions, including both circling directions
and guard with an impact brace, with a following camera and close-up inspection.
Earlier Blender clips remain explicitly labeled as a comparison source. This
corrects review fidelity; it does not establish final concept-art parity.

### Tala basic ranged animation
Grounded basic shots now use an authored rear-leg load, hip-driven extension,
follow-through and guarded recovery on the existing projectile frame clock.
The concept model adds a rear-heel pivot around the support ball. Aerial shots
and directional specials retain their existing paths. This replaces one shared
pose fallback; it is original choreography, not measured Evil Zone frame data.

### Tala base directional signatures
Storm Spark now loads the hips into a two-arm discharge; Still-water Discus uses
a left-arm sweep, opposite torso turn and rearward weight. Both follow the actual
startup/contact/recovery clock and support-foot solver. The live review includes
both actions. Stock and follow-up variants, and airborne actions, still use the
shared fallback. The existing 1.2-unit instantaneous backward displacement on
disc release remains a visible discontinuity to address separately; this pass
does not claim smooth retreat travel or original-game frame correspondence.

### Tala retreat travel correction
Tala's grounded backward specials now travel the same 1.2 units over the final
nine startup frames, instead of teleporting on release. Collision and projectile
origins use the moving position. This changes spacing during startup: an opponent
may miss earlier, but there is no added invulnerability, and interruption cancels
remaining travel. Walls clamp each movement step. Other fighters retain their
existing retreat behavior. The base Discus animation adds a brief two-foot hop
and planted landing; stock/follow-up animation paths still need authored polish.
This supersedes the base Discus displacement issue documented above and remains
original game tuning, not measured Evil Zone motion.
