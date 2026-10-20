# Evil Zone reference study

Research date: October 20, 2026. This is an implementation-oriented desk study, not a claim of exhaustive mastery or measured frame data. No ROM, extracted asset, audio, dialogue, or copyrighted character model is included. The shipped game is an original interpretation.

## Confirmed mechanical foundation

The manual transcription describes attacks changing with range, foreground/background movement, guarding, configurable buttons, and holding attack to build up to three crystals. Charging accelerates as health drops. It also documents difficulty, life-stock, sound, save options, and practice controls. Its authenticity has not been checked against a physical manual scan. [Manual transcription](https://www.musee-des-jeux-video.com/fr/manual/Playstation/35111_us-Evil-Zone.pdf).

A contemporary player guide documents close attack chains, ranged chains, launchers, glide pursuit, jumps, step-in and retreat moves, and sidestepping. Guard timing can reflect ordinary shots, escape traps, or recover in the air. This matters: a small button vocabulary still creates decisions through distance, direction, timing, and opponent state. [Otaku_Tom move guide](https://gamefaqs.gamespot.com/ps/197247-evil-zone/faqs/8087).

Another guide distinguishes close front/back, medium, and long captures, plus three directional specials and a finisher. Midori emphasizes martial strikes and chi; Setsuna combines sword attacks with a spirit presence; Gally uses a large weapon and missiles; Kakurine uses rings and teleportation. This supports designing distinct combat roles rather than changing only costume colors. The guide is a player account, with acknowledged missing names. [ZAmigh move guide](https://gamefaqs.gamespot.com/ps/197247-evil-zone/faqs/11665).

A third guide corroborates capture ranges and defensive escapes, and records Danzaiver's gun, lightning, spiral rush, and orbital capture imagery. It also describes practice and unlockable features. Inputs and English names differ among guides, so exact command fidelity requires play verification. [mysticcat move guide](https://gamefaqs.gamespot.com/ps/197247-evil-zone/faqs/13803).

## Camera and presentation

The contemporary review describes dynamic multi-angle capture sequences, cinematic defense shots, anime-style character stories, voiced scenes, and character-specific music. It contrasts these elaborate attacks with flat arenas and comparatively simple backgrounds. The useful design lesson is to reserve dramatic framing for confirmed attacks while preserving readability in neutral combat. [GameSpot review](https://www.gamespot.com/reviews/evil-zone-review/1900-2547442/).

Footage located for a future measured animation pass: [capture compilation](https://www.youtube.com/watch?v=l0zNNcx8ejY), [full longplay](https://www.youtube.com/watch?v=O0reRdW-5fQ). The capture compilation has now been visually sampled at the timestamps below. The longplay has not been analyzed. Neither supplies verified engine-frame timings.

## Original implementation decisions

Rift Duel uses a 60 Hz simulation, movement on an X/Z plane, and independent rendering. The neutral camera follows the midpoint and widens with separation. Confirmed captures use contextual framing, and stock bursts use character-specific shot sequences before returning to neutral. Reduced-motion mode retains neutral framing. Procedural animation separates idle, running, attacks, charging, guarding, hurt, launched, and cinematic states. Weapons, coat shapes, armor mass, and effects distinguish the roster.

This alpha intentionally adapts inputs: WASD is world-oriented movement; toward/away attacks use the opponent's current side. J is tap attack / hold charge, K is guard, S+J captures, W+J uses the third character signature. U/I/O/L are convenient capture/launcher/pursuit/burst shortcuts. Gamepad face buttons and bumpers provide equivalent actions. Double taps now provide toward+attack pursuit, away+attack burst, down+attack launch, up+attack jumping crossover, and up+guard jump. Fresh airborne guard recovers, while toward+guard circles behind a nearby rival. The parser uses an original 18-frame window, not measured original-game timing.

Original balancing values—not Evil Zone frame data:

| Rule | Current value |
|---|---|
| Simulation | 60 steps / second |
| Round | 90 seconds; first to 2 wins |
| Health | 100 |
| Tap / hold boundary | 0.24 seconds |
| Perfect guard window | 0.17 seconds |
| Close capture break | 0.20 seconds |
| Stock capacity | 3; start with 1 |
| Charge | 1.8 units; rate increases as health falls |
| Standard melee startup / recovery | 5–12 / 14–21 frames by fighter |
| Capture startup / recovery | 13 / 40 frames |
| Burst | 1 stock; maximum initiation distance 9 |
| Arena movement bounds | X ±11; Z ±6 |

## Remaining fidelity work

- Measure startup, active frames, recovery, capture escape windows, and tracking from lawful gameplay access.
- Verify regional differences, original default configurations, and conflicting translated move names.
- Record neutral camera framing and cut timings at multiple distances.
- Replace the four implemented capture motion tracks with polished per-fighter animation clips, including anticipation, contact and follow-through.
- Expand roster coverage for armored mercenary, shadow caster, cursed swordsman, and boss archetypes.
- Add full voiced episode-style stories, survival, unlockables, arena variety, and music only with original assets.

The alpha is not a complete remake, a ten-character reconstruction, or an exact balance replica.

## Direct visual samples

Viewed paused samples from [lcfreezer’s capture compilation](https://www.youtube.com/watch?v=l0zNNcx8ejY), October 20, 2026:

| Video time | Visible observation |
|---|---|
| [0:05](https://www.youtube.com/watch?v=l0zNNcx8ejY&t=5s) | Danzaiver capture impact fills much of the frame; both bodies overlap at ground level. |
| [0:22](https://www.youtube.com/watch?v=l0zNNcx8ejY&t=22s) | Wider framing shows the standing attacker and grounded victim. |
| [0:30](https://www.youtube.com/watch?v=l0zNNcx8ejY&t=30s) | Overhead view isolates the captured target. |
| [0:33](https://www.youtube.com/watch?v=l0zNNcx8ejY&t=33s) | Cutaway shows an orbital device against space. |
| [0:39](https://www.youtube.com/watch?v=l0zNNcx8ejY&t=39s) | Low-angle victim close-up. |
| [3:00](https://www.youtube.com/watch?v=l0zNNcx8ejY&t=180s) | Multiple Midori figures surround the victim. |
| [3:28](https://www.youtube.com/watch?v=l0zNNcx8ejY&t=208s) | Setsuna’s translucent companion overlaps the physical fighters. |
| [3:55](https://www.youtube.com/watch?v=l0zNNcx8ejY&t=235s) | Gally’s weapon and grounded victim dominate a close shot. |

These are sampled visual observations, not continuous motion analysis or measured startup/recovery. The edited compilation cannot establish simulation timing. Design inference: distinct staged shots and character-specific choreography remain a larger fidelity gap than camera orbit smoothness.


## Chain rules follow-up

The Otaku_Tom guide explicitly describes three close attacks, three ranged attacks, and substituting another attack for the last close hit. Version 0.6 now supports this structure with original timing and damage. Whiff restrictions, the ten-frame follow-up window, and ranged special finishes are Rift Duel design decisions; their exact correspondence to the original is unverified. [Guide](https://gamefaqs.gamespot.com/ps/197247-evil-zone/faqs/8087).


## Third directional specials (0.7)

The guide separates up-plus-attack character specials from the double-down launcher. Version 0.7 fixes the earlier shared-launcher placeholder: each current fighter now has a distinct third technique. Motion and defensive roles are informed by the guide; timings, reach, projectile interception, damage, and single-hit limits are original rules. [Guide](https://gamefaqs.gamespot.com/ps/197247-evil-zone/faqs/8087).
