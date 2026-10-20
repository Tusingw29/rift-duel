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

1. **Capture versus burst identity.** The orbital and multiple-attacker imagery sampled in the capture compilation currently informs some Rift Duel bursts. This preserves broad visual themes but not move-context correspondence. Four shared capture tracks still need individual fighter direction.
2. **Special variants and stock economy.** The guide describes follow-up and held-input variants of character specials. Rift Duel has distinct base directional specials and a stock burst, but not this complete variation system.
3. **Neutral and aerial movement.** Launch, pursuit, crossover, recovery, and sidestep exist. Original pursuit follow-ups, dash contests, tracking, and camera timing need direct observation.
4. **Research confidence.** Measure only from lawful gameplay access or suitable footage. Preserve regional/version labels and distinguish observations from guide claims. Do not publish invented original-game frame data.
5. **Presentation and roster depth.** The six existing archetypes do not cover all ten original roles. Procedural animation and a single arena remain visibly alpha quality. Story staging and character-specific capture clips need work before claiming a full presentation match.

Later features listed in `DESIGN.md` are development possibilities, not evidence of completion and not substitutes for the requested combat and character fidelity.
