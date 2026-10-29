# ARENA-INPUT review

The ring removes rectangular corners. It did not remove pinning in these bot matches: boundary hit counts increased. Landed hits at the boundary (both sides, within 0.05 units): at 10f 267 on the rectangle vs 627 on the ring; at 15f 146 vs 352, across 1440 bouts per mode/delay. See per-bout edge time and pin rates below.

Accidental dashes are not eliminated: spacing taps 13–18 frames apart no longer start a step, but taps within 12f still do. Dash distance falls from 2.4 to 1.5 units. The synthetic input sweep verifies the trigger reduction, not Adam’s intentions or an observed human error rate. The existing attack-command window stays at 18f.

Jab15 adds four startup frames only to Morrow’s first basic strike (11 → 15). Recovery remains 20f, reach and later strikes stay unchanged. Matchup tables separate Morrow controlled by the skilled policies from Morrow controlled by mashers; overlap labels remain uncertainty, not proof of equality.

10f, Morrow controlled by skilled: 71.7% (172/240); 95% 65.7–77.0% → 55.0% (132/240); 95% 48.7–61.2% with jab15; -16.7 pp (ranges do not overlap).

10f, Morrow controlled by masher: 45.0% (108/240); 95% 38.8–51.3% → 46.7% (112/240); 95% 40.5–53.0% with jab15; +1.7 pp (could be luck).

15f, Morrow controlled by skilled: 42.5% (102/240); 95% 36.4–48.8% → 30.0% (72/240); 95% 23.3–36.7% with jab15; -12.5 pp (could be luck).

15f, Morrow controlled by masher: 65.4% (157/240); 95% 59.2–71.1% → 63.3% (152/240); 95% 57.1–69.2% with jab15; -2.1 pp (could be luck).

The ring alone barely changes aggregate wins (all four comparisons could be luck). At 15f the two mashers still win 66.9% and 69.6% against the skilled-policy group on the ring. That does not suggest overpowering defence in these bots; deliberate human sidestepping remains a separate playtest. Adding slow improves skilled wins vs masher-all by 8.3pp at 10f and 17.4pp at 15f, with non-overlapping ranges.

11520 completed/scheduled bouts; 0 censored. Sum of per-mode runtime: 82.6 seconds (delay jobs ran concurrently).

The requested bots primarily test backdash and walking: neither policy intentionally sidesteps. Actual step counts are reported; especially at 15f, a reactive step may be rejected while the bot is already in a move or stun. Tournament wins alone cannot certify sidestep balance. Separate edge fixtures test both sidesteps against all six fighters’ basic strikes, captures and shots, without invulnerability.

All four new modes use the same 12f step window and 1.5-unit dash; v2-rect explicitly uses arena=rect. This isolates ring geometry from the input tuning. The archived MOVE-V2 study used 18f/2.4 units and is not substituted as this comparison’s baseline. Default without switches is still the original rectangle and unchanged gameplay.

Ring is enabled by arena=ring or move=v2; arena=rect overrides the v2 implication. The radius-10 line marks fighter-origin bounds, not the visible radius-17 scenery floor or the outside of a fighter’s limbs. It is a playtest guess in one config constant. Both visual line and simulation import it.

Every X/Z boundary clamp uses the same helper: walking, step paths, knockback, rolls, lunges, orbit travel, crossover, aerial pursuit glide and collision separation. Voluntary walking/steps project onto the tangent; exactly head-on outward input uses a consistent tangent side instead of stopping. Forced knockback has no head-on assist. No extra invulnerability or guard changes.

Edge time counts advanced simulation frames within 0.5 units of the boundary, including time stunned or in cinematics, excluding repeated hitstop input frames. Rectangle corner time requires both axis gaps ≤0.5; circular corners are N/A. A pin is a landed damage event with defender gap ≤0.05 at contact; blocked boundary hits are reported separately. These are operational measurements, not an assertion of an inescapable combo. Per-bout figures report both sides separately.

11,520 bouts: 4 modes × 2 delays × 2 skilled policies × 2 mashers × 36 ordered fighter pairs × 5 seeds × 2 seats. Each policy/opponent row has 360 bouts; aggregates have 720. Bots read delayed visible state only. Masher wins and draws are shown alongside skilled wins so defensive stalling cannot hide in an aggregate.

95% ranges envelope Wilson and 2,000 fighter-pair/seed cluster-bootstrap resamples; mirrored seats and repeated policies stay paired. Overlap is labeled could be luck. No multiple-comparison correction. Morrow-vs-one-fighter rows have only five independent seed blocks and wide uncertainty; they are exploratory. Morrow mirrors change both sides.

No balance extraction was run: default values and combat source line numbers were preserved, and the existing extraction-sync test verifies the committed data. Morrow’s opt-in override takes precedence over a local balance startup for Strike 1 only. No rig, pose or character-animation authoring changed.

Normal-speed human spacing and edge feel remain Adam’s verdict. Bot wins do not establish human balance or that accidental inputs are gone.

## Wins on both sides

Delay | Mode | Policy / opponent | Skilled wins; 95% | Masher wins; 95% | Draws
--- | --- | --- | --- | --- | ---
10 | v2-rect | stepper/masher | 35.0% (126/360); 95% 30.3–40.6% | 65.0% (234/360); 95% 59.4–69.7% | 0
10 | v2-rect | stepper/masher-all | 30.0% (108/360); 95% 25.0–35.0% | 70.0% (252/360); 95% 64.7–75.0% | 0
10 | v2-rect | punisher/masher | 91.7% (330/360); 95% 88.4–94.2% | 8.3% (30/360); 95% 5.8–11.6% | 0
10 | v2-rect | punisher/masher-all | 80.3% (289/360); 95% 75.9–84.7% | 19.4% (70/360); 95% 15.0–23.8% | 1
10 | v2-rect | skilled/masher | 63.3% (456/720); 95% 59.8–66.8% | 36.7% (264/720); 95% 33.2–40.2% | 0
10 | v2-rect | skilled/masher-all | 55.1% (397/720); 95% 51.5–58.8% | 44.7% (322/720); 95% 41.0–48.4% | 1
10 | v2-ring | stepper/masher | 36.4% (131/360); 95% 31.6–41.7% | 63.6% (229/360); 95% 58.3–68.4% | 0
10 | v2-ring | stepper/masher-all | 30.6% (110/360); 95% 25.8–35.6% | 69.4% (250/360); 95% 64.4–74.2% | 0
10 | v2-ring | punisher/masher | 91.7% (330/360); 95% 88.4–94.4% | 8.3% (30/360); 95% 5.6–11.6% | 0
10 | v2-ring | punisher/masher-all | 79.2% (285/360); 95% 74.7–83.6% | 20.8% (75/360); 95% 16.4–25.3% | 0
10 | v2-ring | skilled/masher | 64.0% (461/720); 95% 60.5–67.5% | 36.0% (259/720); 95% 32.5–39.5% | 0
10 | v2-ring | skilled/masher-all | 54.9% (395/720); 95% 51.2–58.6% | 45.1% (325/720); 95% 41.4–48.8% | 0
10 | v2-ring-slow | stepper/masher | 38.1% (137/360); 95% 32.8–43.6% | 61.9% (223/360); 95% 56.4–67.2% | 0
10 | v2-ring-slow | stepper/masher-all | 38.3% (138/360); 95% 32.5–43.9% | 61.7% (222/360); 95% 56.1–67.2% | 0
10 | v2-ring-slow | punisher/masher | 91.7% (330/360); 95% 88.4–94.4% | 8.3% (30/360); 95% 5.6–11.6% | 0
10 | v2-ring-slow | punisher/masher-all | 88.1% (317/360); 95% 84.3–91.7% | 11.9% (43/360); 95% 8.3–15.7% | 0
10 | v2-ring-slow | skilled/masher | 64.9% (467/720); 95% 61.3–68.3% | 35.1% (253/720); 95% 31.7–38.7% | 0
10 | v2-ring-slow | skilled/masher-all | 63.2% (455/720); 95% 59.6–66.6% | 36.8% (265/720); 95% 33.4–40.4% | 0
10 | v2-ring-jab15 | stepper/masher | 34.4% (124/360); 95% 29.4–39.5% | 65.6% (236/360); 95% 60.5–70.6% | 0
10 | v2-ring-jab15 | stepper/masher-all | 25.6% (92/360); 95% 21.1–30.3% | 74.4% (268/360); 95% 69.7–78.9% | 0
10 | v2-ring-jab15 | punisher/masher | 90.6% (326/360); 95% 87.1–93.3% | 9.4% (34/360); 95% 6.7–12.9% | 0
10 | v2-ring-jab15 | punisher/masher-all | 76.4% (275/360); 95% 71.7–80.8% | 23.6% (85/360); 95% 19.2–28.3% | 0
10 | v2-ring-jab15 | skilled/masher | 62.5% (450/720); 95% 58.9–66.0% | 37.5% (270/720); 95% 34.0–41.1% | 0
10 | v2-ring-jab15 | skilled/masher-all | 51.0% (367/720); 95% 47.3–54.6% | 49.0% (353/720); 95% 45.4–52.7% | 0
15 | v2-rect | stepper/masher | 14.4% (52/360); 95% 10.8–18.5% | 85.6% (308/360); 95% 81.5–89.2% | 0
15 | v2-rect | stepper/masher-all | 20.6% (74/360); 95% 16.4–25.0% | 79.4% (286/360); 95% 75.0–83.6% | 0
15 | v2-rect | punisher/masher | 49.7% (179/360); 95% 44.6–55.3% | 50.3% (181/360); 95% 44.7–55.4% | 0
15 | v2-rect | punisher/masher-all | 40.6% (146/360); 95% 35.0–45.8% | 59.4% (214/360); 95% 54.2–64.7% | 0
15 | v2-rect | skilled/masher | 32.1% (231/720); 95% 28.7–35.6% | 67.9% (489/720); 95% 64.4–71.3% | 0
15 | v2-rect | skilled/masher-all | 30.6% (220/720); 95% 27.1–34.0% | 69.4% (500/720); 95% 66.0–72.9% | 0
15 | v2-ring | stepper/masher | 15.3% (55/360); 95% 11.7–19.4% | 84.7% (305/360); 95% 80.6–88.3% | 0
15 | v2-ring | stepper/masher-all | 20.8% (75/360); 95% 16.4–25.3% | 79.2% (285/360); 95% 74.7–83.6% | 0
15 | v2-ring | punisher/masher | 50.8% (183/360); 95% 45.7–56.1% | 49.2% (177/360); 95% 43.9–54.3% | 0
15 | v2-ring | punisher/masher-all | 40.0% (144/360); 95% 34.4–45.3% | 60.0% (216/360); 95% 54.7–65.6% | 0
15 | v2-ring | skilled/masher | 33.1% (238/720); 95% 29.7–36.6% | 66.9% (482/720); 95% 63.4–70.3% | 0
15 | v2-ring | skilled/masher-all | 30.4% (219/720); 95% 26.9–34.0% | 69.6% (501/720); 95% 66.0–73.1% | 0
15 | v2-ring-slow | stepper/masher | 15.8% (57/360); 95% 12.2–20.0% | 83.9% (302/360); 95% 79.7–87.5% | 1
15 | v2-ring-slow | stepper/masher-all | 21.4% (77/360); 95% 16.9–26.4% | 78.6% (283/360); 95% 73.6–83.1% | 0
15 | v2-ring-slow | punisher/masher | 60.3% (217/360); 95% 55.1–65.3% | 39.7% (143/360); 95% 34.7–44.9% | 0
15 | v2-ring-slow | punisher/masher-all | 74.2% (267/360); 95% 69.4–78.6% | 25.8% (93/360); 95% 21.4–30.6% | 0
15 | v2-ring-slow | skilled/masher | 38.1% (274/720); 95% 34.6–41.7% | 61.8% (445/720); 95% 58.2–65.3% | 1
15 | v2-ring-slow | skilled/masher-all | 47.8% (344/720); 95% 44.2–51.4% | 52.2% (376/720); 95% 48.6–55.8% | 0
15 | v2-ring-jab15 | stepper/masher | 16.4% (59/360); 95% 12.5–20.6% | 83.6% (301/360); 95% 79.4–87.5% | 0
15 | v2-ring-jab15 | stepper/masher-all | 14.2% (51/360); 95% 10.8–18.1% | 85.8% (309/360); 95% 81.9–89.2% | 0
15 | v2-ring-jab15 | punisher/masher | 51.1% (184/360); 95% 45.8–56.7% | 48.9% (176/360); 95% 43.3–54.2% | 0
15 | v2-ring-jab15 | punisher/masher-all | 38.6% (139/360); 95% 33.3–43.9% | 61.4% (221/360); 95% 56.1–66.7% | 0
15 | v2-ring-jab15 | skilled/masher | 33.8% (243/720); 95% 30.1–37.5% | 66.3% (477/720); 95% 62.5–69.9% | 0
15 | v2-ring-jab15 | skilled/masher-all | 26.4% (190/720); 95% 23.2–29.9% | 73.6% (530/720); 95% 70.0–76.8% | 0

## Comparisons

Delay | Mode | Baseline | Opponent | Skilled gain | Interpretation
--- | --- | --- | --- | --- | ---
10 | v2-ring | v2-rect | masher | 0.7 pp | could be luck
10 | v2-ring | v2-rect | masher-all | -0.3 pp | could be luck
10 | v2-ring-slow | v2-ring | masher | 0.8 pp | could be luck
10 | v2-ring-slow | v2-ring | masher-all | 8.3 pp | ranges do not overlap
10 | v2-ring-jab15 | v2-ring | masher | -1.5 pp | could be luck
10 | v2-ring-jab15 | v2-ring | masher-all | -3.9 pp | could be luck
15 | v2-ring | v2-rect | masher | 1.0 pp | could be luck
15 | v2-ring | v2-rect | masher-all | -0.1 pp | could be luck
15 | v2-ring-slow | v2-ring | masher | 5.0 pp | could be luck
15 | v2-ring-slow | v2-ring | masher-all | 17.4 pp | ranges do not overlap
15 | v2-ring-jab15 | v2-ring | masher | 0.7 pp | could be luck
15 | v2-ring-jab15 | v2-ring | masher-all | -4.0 pp | could be luck

## Edge and corner time per bout

Delay | Mode | Pair | Side | Edge seconds/bout | Corner seconds/bout | Pinned hits/bout | Pinned bouts/total | Boundary blocks | Steps / dashes
--- | --- | --- | --- | --- | --- | --- | --- | --- | ---
10 | v2-rect | stepper/masher | skilled | 0.00 | 0.00 | 0.000 | 0/360 | 0 | 42/0
10 | v2-rect | stepper/masher | masher | 0.43 | 0.02 | 0.275 | 38/360 | 0 | 0/0
10 | v2-rect | stepper/masher-all | skilled | 0.01 | 0.00 | 0.003 | 1/360 | 0 | 189/0
10 | v2-rect | stepper/masher-all | masher | 0.07 | 0.00 | 0.033 | 6/360 | 0 | 0/0
10 | v2-rect | punisher/masher | skilled | 0.02 | 0.00 | 0.000 | 0/360 | 0 | 0/0
10 | v2-rect | punisher/masher | masher | 0.77 | 0.02 | 0.397 | 59/360 | 0 | 0/0
10 | v2-rect | punisher/masher-all | skilled | 0.00 | 0.00 | 0.000 | 0/360 | 0 | 0/0
10 | v2-rect | punisher/masher-all | masher | 0.12 | 0.00 | 0.033 | 9/360 | 0 | 0/0
10 | v2-rect | skilled/masher | skilled | 0.01 | 0.00 | 0.000 | 0/720 | 0 | 42/0
10 | v2-rect | skilled/masher | masher | 0.60 | 0.02 | 0.336 | 97/720 | 0 | 0/0
10 | v2-rect | skilled/masher-all | skilled | 0.00 | 0.00 | 0.001 | 1/720 | 0 | 189/0
10 | v2-rect | skilled/masher-all | masher | 0.10 | 0.00 | 0.033 | 15/720 | 0 | 0/0
10 | v2-ring | stepper/masher | skilled | 0.00 | N/A | 0.000 | 0/360 | 0 | 38/0
10 | v2-ring | stepper/masher | masher | 0.91 | N/A | 0.622 | 82/360 | 0 | 0/0
10 | v2-ring | stepper/masher-all | skilled | 0.01 | N/A | 0.003 | 1/360 | 0 | 187/0
10 | v2-ring | stepper/masher-all | masher | 0.18 | N/A | 0.083 | 13/360 | 0 | 0/0
10 | v2-ring | punisher/masher | skilled | 0.01 | N/A | 0.000 | 0/360 | 0 | 0/0
10 | v2-ring | punisher/masher | masher | 1.63 | N/A | 0.889 | 121/360 | 0 | 0/0
10 | v2-ring | punisher/masher-all | skilled | 0.03 | N/A | 0.008 | 1/360 | 0 | 0/0
10 | v2-ring | punisher/masher-all | masher | 0.47 | N/A | 0.136 | 20/360 | 0 | 0/0
10 | v2-ring | skilled/masher | skilled | 0.01 | N/A | 0.000 | 0/720 | 0 | 38/0
10 | v2-ring | skilled/masher | masher | 1.27 | N/A | 0.756 | 203/720 | 0 | 0/0
10 | v2-ring | skilled/masher-all | skilled | 0.02 | N/A | 0.006 | 2/720 | 0 | 187/0
10 | v2-ring | skilled/masher-all | masher | 0.33 | N/A | 0.110 | 33/720 | 0 | 0/0
10 | v2-ring-slow | stepper/masher | skilled | 0.00 | N/A | 0.000 | 0/360 | 0 | 98/0
10 | v2-ring-slow | stepper/masher | masher | 1.12 | N/A | 0.714 | 92/360 | 0 | 0/0
10 | v2-ring-slow | stepper/masher-all | skilled | 0.00 | N/A | 0.000 | 0/360 | 0 | 341/0
10 | v2-ring-slow | stepper/masher-all | masher | 0.17 | N/A | 0.067 | 11/360 | 0 | 0/0
10 | v2-ring-slow | punisher/masher | skilled | 0.01 | N/A | 0.000 | 0/360 | 0 | 0/0
10 | v2-ring-slow | punisher/masher | masher | 1.78 | N/A | 1.017 | 126/360 | 0 | 0/0
10 | v2-ring-slow | punisher/masher-all | skilled | 0.00 | N/A | 0.000 | 0/360 | 0 | 0/0
10 | v2-ring-slow | punisher/masher-all | masher | 0.43 | N/A | 0.228 | 36/360 | 0 | 0/0
10 | v2-ring-slow | skilled/masher | skilled | 0.00 | N/A | 0.000 | 0/720 | 0 | 98/0
10 | v2-ring-slow | skilled/masher | masher | 1.45 | N/A | 0.865 | 218/720 | 0 | 0/0
10 | v2-ring-slow | skilled/masher-all | skilled | 0.00 | N/A | 0.000 | 0/720 | 0 | 341/0
10 | v2-ring-slow | skilled/masher-all | masher | 0.30 | N/A | 0.147 | 47/720 | 0 | 0/0
10 | v2-ring-jab15 | stepper/masher | skilled | 0.00 | N/A | 0.000 | 0/360 | 0 | 58/0
10 | v2-ring-jab15 | stepper/masher | masher | 0.90 | N/A | 0.628 | 82/360 | 0 | 0/0
10 | v2-ring-jab15 | stepper/masher-all | skilled | 0.03 | N/A | 0.006 | 2/360 | 0 | 195/0
10 | v2-ring-jab15 | stepper/masher-all | masher | 0.20 | N/A | 0.086 | 13/360 | 0 | 0/0
10 | v2-ring-jab15 | punisher/masher | skilled | 0.01 | N/A | 0.000 | 0/360 | 0 | 0/0
10 | v2-ring-jab15 | punisher/masher | masher | 1.61 | N/A | 0.847 | 120/360 | 0 | 0/0
10 | v2-ring-jab15 | punisher/masher-all | skilled | 0.03 | N/A | 0.008 | 1/360 | 0 | 0/0
10 | v2-ring-jab15 | punisher/masher-all | masher | 0.49 | N/A | 0.144 | 21/360 | 0 | 0/0
10 | v2-ring-jab15 | skilled/masher | skilled | 0.01 | N/A | 0.000 | 0/720 | 0 | 58/0
10 | v2-ring-jab15 | skilled/masher | masher | 1.26 | N/A | 0.738 | 202/720 | 0 | 0/0
10 | v2-ring-jab15 | skilled/masher-all | skilled | 0.03 | N/A | 0.007 | 3/720 | 0 | 195/0
10 | v2-ring-jab15 | skilled/masher-all | masher | 0.34 | N/A | 0.115 | 34/720 | 0 | 0/0
15 | v2-rect | stepper/masher | skilled | 0.00 | 0.00 | 0.000 | 0/360 | 0 | 2/0
15 | v2-rect | stepper/masher | masher | 0.29 | 0.00 | 0.183 | 26/360 | 0 | 0/0
15 | v2-rect | stepper/masher-all | skilled | 0.00 | 0.00 | 0.000 | 0/360 | 0 | 189/0
15 | v2-rect | stepper/masher-all | masher | 0.06 | 0.00 | 0.000 | 0/360 | 0 | 0/0
15 | v2-rect | punisher/masher | skilled | 0.00 | 0.00 | 0.000 | 0/360 | 0 | 0/0
15 | v2-rect | punisher/masher | masher | 0.55 | 0.00 | 0.217 | 35/360 | 0 | 0/0
15 | v2-rect | punisher/masher-all | skilled | 0.00 | 0.00 | 0.000 | 0/360 | 0 | 1/1
15 | v2-rect | punisher/masher-all | masher | 0.06 | 0.00 | 0.006 | 2/360 | 0 | 0/0
15 | v2-rect | skilled/masher | skilled | 0.00 | 0.00 | 0.000 | 0/720 | 0 | 2/0
15 | v2-rect | skilled/masher | masher | 0.42 | 0.00 | 0.200 | 61/720 | 0 | 0/0
15 | v2-rect | skilled/masher-all | skilled | 0.00 | 0.00 | 0.000 | 0/720 | 0 | 190/1
15 | v2-rect | skilled/masher-all | masher | 0.06 | 0.00 | 0.003 | 2/720 | 0 | 0/0
15 | v2-ring | stepper/masher | skilled | 0.00 | N/A | 0.000 | 0/360 | 0 | 2/0
15 | v2-ring | stepper/masher | masher | 0.51 | N/A | 0.369 | 44/360 | 0 | 0/0
15 | v2-ring | stepper/masher-all | skilled | 0.01 | N/A | 0.000 | 0/360 | 0 | 190/0
15 | v2-ring | stepper/masher-all | masher | 0.22 | N/A | 0.042 | 9/360 | 0 | 0/0
15 | v2-ring | punisher/masher | skilled | 0.00 | N/A | 0.000 | 0/360 | 0 | 0/0
15 | v2-ring | punisher/masher | masher | 1.04 | N/A | 0.506 | 70/360 | 0 | 0/0
15 | v2-ring | punisher/masher-all | skilled | 0.01 | N/A | 0.000 | 0/360 | 0 | 1/1
15 | v2-ring | punisher/masher-all | masher | 0.26 | N/A | 0.061 | 16/360 | 0 | 0/0
15 | v2-ring | skilled/masher | skilled | 0.00 | N/A | 0.000 | 0/720 | 0 | 2/0
15 | v2-ring | skilled/masher | masher | 0.77 | N/A | 0.438 | 114/720 | 0 | 0/0
15 | v2-ring | skilled/masher-all | skilled | 0.01 | N/A | 0.000 | 0/720 | 0 | 191/1
15 | v2-ring | skilled/masher-all | masher | 0.24 | N/A | 0.051 | 25/720 | 0 | 0/0
15 | v2-ring-slow | stepper/masher | skilled | 0.00 | N/A | 0.000 | 0/360 | 0 | 13/0
15 | v2-ring-slow | stepper/masher | masher | 0.56 | N/A | 0.436 | 47/360 | 0 | 0/0
15 | v2-ring-slow | stepper/masher-all | skilled | 0.00 | N/A | 0.000 | 0/360 | 0 | 211/0
15 | v2-ring-slow | stepper/masher-all | masher | 0.12 | N/A | 0.053 | 9/360 | 0 | 0/0
15 | v2-ring-slow | punisher/masher | skilled | 0.01 | N/A | 0.000 | 0/360 | 1 | 0/0
15 | v2-ring-slow | punisher/masher | masher | 1.15 | N/A | 0.683 | 94/360 | 0 | 0/0
15 | v2-ring-slow | punisher/masher-all | skilled | 0.00 | N/A | 0.000 | 0/360 | 0 | 1/1
15 | v2-ring-slow | punisher/masher-all | masher | 0.44 | N/A | 0.172 | 27/360 | 0 | 0/0
15 | v2-ring-slow | skilled/masher | skilled | 0.00 | N/A | 0.000 | 0/720 | 1 | 13/0
15 | v2-ring-slow | skilled/masher | masher | 0.85 | N/A | 0.560 | 141/720 | 0 | 0/0
15 | v2-ring-slow | skilled/masher-all | skilled | 0.00 | N/A | 0.000 | 0/720 | 0 | 212/1
15 | v2-ring-slow | skilled/masher-all | masher | 0.28 | N/A | 0.113 | 36/720 | 0 | 0/0
15 | v2-ring-jab15 | stepper/masher | skilled | 0.00 | N/A | 0.000 | 0/360 | 0 | 5/0
15 | v2-ring-jab15 | stepper/masher | masher | 0.57 | N/A | 0.431 | 53/360 | 0 | 0/0
15 | v2-ring-jab15 | stepper/masher-all | skilled | 0.01 | N/A | 0.000 | 0/360 | 0 | 193/0
15 | v2-ring-jab15 | stepper/masher-all | masher | 0.21 | N/A | 0.033 | 6/360 | 0 | 0/0
15 | v2-ring-jab15 | punisher/masher | skilled | 0.00 | N/A | 0.000 | 0/360 | 0 | 0/0
15 | v2-ring-jab15 | punisher/masher | masher | 1.02 | N/A | 0.550 | 74/360 | 0 | 0/0
15 | v2-ring-jab15 | punisher/masher-all | skilled | 0.01 | N/A | 0.000 | 0/360 | 0 | 1/1
15 | v2-ring-jab15 | punisher/masher-all | masher | 0.25 | N/A | 0.056 | 15/360 | 0 | 0/0
15 | v2-ring-jab15 | skilled/masher | skilled | 0.00 | N/A | 0.000 | 0/720 | 0 | 5/0
15 | v2-ring-jab15 | skilled/masher | masher | 0.80 | N/A | 0.490 | 127/720 | 0 | 0/0
15 | v2-ring-jab15 | skilled/masher-all | skilled | 0.01 | N/A | 0.000 | 0/720 | 0 | 194/1
15 | v2-ring-jab15 | skilled/masher-all | masher | 0.23 | N/A | 0.044 | 21/720 | 0 | 0/0

## Morrow matchup wins

Delay | Mode | Morrow controller / rival fighter | Morrow wins; 95%
--- | --- | --- | ---
10 | v2-ring | skilled/all | 71.7% (172/240); 95% 65.7–77.0%
10 | v2-ring | skilled/aegis | 60.0% (24/40); 95% 44.6–73.7%
10 | v2-ring | skilled/rei | 70.0% (28/40); 95% 54.6–81.9%
10 | v2-ring | skilled/tala | 72.5% (29/40); 95% 57.2–83.9%
10 | v2-ring | skilled/morrow | 75.0% (30/40); 95% 59.8–85.8%
10 | v2-ring | skilled/sol | 82.5% (33/40); 95% 68.0–92.5%
10 | v2-ring | skilled/vesper | 70.0% (28/40); 95% 54.6–81.9%
10 | v2-ring | masher/all | 45.0% (108/240); 95% 38.8–51.3%
10 | v2-ring | masher/aegis | 42.5% (17/40); 95% 28.5–57.8%
10 | v2-ring | masher/rei | 47.5% (19/40); 95% 32.9–62.5%
10 | v2-ring | masher/tala | 45.0% (18/40); 95% 30.7–60.2%
10 | v2-ring | masher/morrow | 25.0% (10/40); 95% 14.2–40.2%
10 | v2-ring | masher/sol | 60.0% (24/40); 95% 44.6–73.7%
10 | v2-ring | masher/vesper | 50.0% (20/40); 95% 35.2–64.8%
10 | v2-ring-jab15 | skilled/all | 55.0% (132/240); 95% 48.7–61.2%
10 | v2-ring-jab15 | skilled/aegis | 42.5% (17/40); 95% 28.5–57.8%
10 | v2-ring-jab15 | skilled/rei | 62.5% (25/40); 95% 47.0–75.8%
10 | v2-ring-jab15 | skilled/tala | 47.5% (19/40); 95% 30.0–62.5%
10 | v2-ring-jab15 | skilled/morrow | 62.5% (25/40); 95% 47.0–75.8%
10 | v2-ring-jab15 | skilled/sol | 65.0% (26/40); 95% 49.5–77.9%
10 | v2-ring-jab15 | skilled/vesper | 50.0% (20/40); 95% 35.2–64.8%
10 | v2-ring-jab15 | masher/all | 46.7% (112/240); 95% 40.5–53.0%
10 | v2-ring-jab15 | masher/aegis | 35.0% (14/40); 95% 22.1–50.5%
10 | v2-ring-jab15 | masher/rei | 47.5% (19/40); 95% 30.0–62.5%
10 | v2-ring-jab15 | masher/tala | 37.5% (15/40); 95% 24.2–53.0%
10 | v2-ring-jab15 | masher/morrow | 37.5% (15/40); 95% 24.2–53.0%
10 | v2-ring-jab15 | masher/sol | 65.0% (26/40); 95% 49.5–77.9%
10 | v2-ring-jab15 | masher/vesper | 57.5% (23/40); 95% 42.2–71.5%
15 | v2-ring | skilled/all | 42.5% (102/240); 95% 36.4–48.8%
15 | v2-ring | skilled/aegis | 37.5% (15/40); 95% 24.2–53.0%
15 | v2-ring | skilled/rei | 47.5% (19/40); 95% 32.9–62.5%
15 | v2-ring | skilled/tala | 42.5% (17/40); 95% 22.5–62.5%
15 | v2-ring | skilled/morrow | 52.5% (21/40); 95% 37.5–67.1%
15 | v2-ring | skilled/sol | 47.5% (19/40); 95% 32.9–62.5%
15 | v2-ring | skilled/vesper | 27.5% (11/40); 95% 16.1–42.8%
15 | v2-ring | masher/all | 65.4% (157/240); 95% 59.2–71.1%
15 | v2-ring | masher/aegis | 72.5% (29/40); 95% 57.2–83.9%
15 | v2-ring | masher/rei | 62.5% (25/40); 95% 47.0–75.8%
15 | v2-ring | masher/tala | 57.5% (23/40); 95% 42.2–71.5%
15 | v2-ring | masher/morrow | 47.5% (19/40); 95% 32.9–62.5%
15 | v2-ring | masher/sol | 80.0% (32/40); 95% 65.2–89.5%
15 | v2-ring | masher/vesper | 72.5% (29/40); 95% 57.2–83.9%
15 | v2-ring-jab15 | skilled/all | 30.0% (72/240); 95% 23.3–36.7%
15 | v2-ring-jab15 | skilled/aegis | 22.5% (9/40); 95% 12.3–37.5%
15 | v2-ring-jab15 | skilled/rei | 40.0% (16/40); 95% 26.3–55.4%
15 | v2-ring-jab15 | skilled/tala | 20.0% (8/40); 95% 10.0–34.8%
15 | v2-ring-jab15 | skilled/morrow | 50.0% (20/40); 95% 35.0–65.0%
15 | v2-ring-jab15 | skilled/sol | 32.5% (13/40); 95% 15.0–50.0%
15 | v2-ring-jab15 | skilled/vesper | 15.0% (6/40); 95% 7.1–29.1%
15 | v2-ring-jab15 | masher/all | 63.3% (152/240); 95% 57.1–69.2%
15 | v2-ring-jab15 | masher/aegis | 75.0% (30/40); 95% 59.8–87.5%
15 | v2-ring-jab15 | masher/rei | 65.0% (26/40); 95% 49.5–77.9%
15 | v2-ring-jab15 | masher/tala | 52.5% (21/40); 95% 37.5–67.1%
15 | v2-ring-jab15 | masher/morrow | 50.0% (20/40); 95% 35.0–65.0%
15 | v2-ring-jab15 | masher/sol | 70.0% (28/40); 95% 54.6–81.9%
15 | v2-ring-jab15 | masher/vesper | 67.5% (27/40); 95% 52.0–79.9%

## Morrow jab15 changes vs ring

Delay | Morrow controller / rival fighter | Gain | Interpretation
--- | --- | --- | ---
10 | skilled/all | -16.7 pp | ranges do not overlap
10 | skilled/aegis | -17.5 pp | could be luck
10 | skilled/rei | -7.5 pp | could be luck
10 | skilled/tala | -25.0 pp | could be luck
10 | skilled/morrow | -12.5 pp | could be luck
10 | skilled/sol | -17.5 pp | could be luck
10 | skilled/vesper | -20.0 pp | could be luck
10 | masher/all | 1.7 pp | could be luck
10 | masher/aegis | -7.5 pp | could be luck
10 | masher/rei | 0.0 pp | could be luck
10 | masher/tala | -7.5 pp | could be luck
10 | masher/morrow | 12.5 pp | could be luck
10 | masher/sol | 5.0 pp | could be luck
10 | masher/vesper | 7.5 pp | could be luck
15 | skilled/all | -12.5 pp | could be luck
15 | skilled/aegis | -15.0 pp | could be luck
15 | skilled/rei | -7.5 pp | could be luck
15 | skilled/tala | -22.5 pp | could be luck
15 | skilled/morrow | -2.5 pp | could be luck
15 | skilled/sol | -15.0 pp | could be luck
15 | skilled/vesper | -12.5 pp | could be luck
15 | masher/all | -2.1 pp | could be luck
15 | masher/aegis | 2.5 pp | could be luck
15 | masher/rei | 2.5 pp | could be luck
15 | masher/tala | -5.0 pp | could be luck
15 | masher/morrow | 2.5 pp | could be luck
15 | masher/sol | -10.0 pp | could be luck
15 | masher/vesper | -5.0 pp | could be luck

## Sidesteps at the ring edge

Attacker index (roster order) | Move | Side | Step started | Damage | Captured
--- | --- | --- | --- | --- | ---
0 | strike | -1 | true | 6.00 | false
0 | strike | 1 | true | 6.00 | false
0 | capture | -1 | true | 15.00 | true
0 | capture | 1 | true | 15.00 | true
0 | shot | -1 | true | 0.00 | false
0 | shot | 1 | true | 0.00 | false
1 | strike | -1 | true | 5.40 | false
1 | strike | 1 | true | 5.40 | false
1 | capture | -1 | true | 13.50 | true
1 | capture | 1 | true | 13.50 | true
1 | shot | -1 | true | 0.00 | false
1 | shot | 1 | true | 0.00 | false
2 | strike | -1 | true | 6.12 | false
2 | strike | 1 | true | 6.12 | false
2 | capture | -1 | true | 15.30 | true
2 | capture | 1 | true | 15.30 | true
2 | shot | -1 | true | 0.00 | false
2 | shot | 1 | true | 0.00 | false
3 | strike | -1 | true | 7.44 | false
3 | strike | 1 | true | 7.44 | false
3 | capture | -1 | true | 18.60 | true
3 | capture | 1 | true | 18.60 | true
3 | shot | -1 | true | 0.00 | false
3 | shot | 1 | true | 0.00 | false
4 | strike | -1 | true | 5.16 | false
4 | strike | 1 | true | 5.16 | false
4 | capture | -1 | true | 12.90 | true
4 | capture | 1 | true | 12.90 | true
4 | shot | -1 | true | 0.00 | false
4 | shot | 1 | true | 0.00 | false
5 | strike | -1 | true | 6.18 | false
5 | strike | 1 | true | 6.18 | false
5 | capture | -1 | true | 15.45 | true
5 | capture | 1 | true | 15.45 | true
5 | shot | -1 | true | 0.00 | false
5 | shot | 1 | true | 0.00 | false

## Spacing tap sweep

Tap gap | Old step window | New step window
--- | --- | ---
2 | dash | dash
3 | dash | dash
4 | dash | dash
5 | dash | dash
6 | dash | dash
7 | dash | dash
8 | dash | dash
9 | dash | dash
10 | dash | dash
11 | dash | dash
12 | dash | dash
13 | dash | no step
14 | dash | no step
15 | dash | no step
16 | dash | no step
17 | dash | no step
18 | dash | no step
19 | no step | no step
20 | no step | no step
21 | no step | no step
22 | no step | no step
23 | no step | no step
24 | no step | no step

## Head-on edge fixture

Arena | Distance moved in 120 retreat frames
--- | ---
rect | 0.000
ring | 12.800

## Verification and review

- Implementation: `ce3938a`, based on `f0c37c6`, branch `codex/arena-input` from MOVE-V2 `d1b8327`. Gameplay has not merged to main.
- [GitHub checks and artifacts](https://github.com/Tusingw29/rift-duel/actions/runs/40854076420): both delay jobs and verify job passed. **708 tests pass, zero failures**, including the unchanged default fingerprint, ring bounds through all requested motion paths, 12f/18f command separation, Morrow-only startup, passive observation and simultaneous contact listeners.
- **11,520 bouts**, zero censored. Total summed simulation-job mode runtime: **82.6 seconds**; the 10f/15f jobs ran concurrently. `audit.json` verifies source hashes and all bouts’ winners, HP, input/simulation frame counts and original telemetry against the preliminary run. The counter repair did not change gameplay outcomes.
- Preliminary workflow `40853344725` used a single observer slot, causing existing telemetry to replace the new contact listener. Its zero pin counts are invalid. Those archives remain in `pre-observer-fix/`, excluded from conclusions. The corrected observer allows both listeners and has a regression test. Final pin/hit counts are nonzero and bounded.
- Browser keyboard integration tested default, arena-only ring, explicit rectangle, implicit v2 ring, slow-grab combination and jab15 combination. Step gaps 12/13f, dash distance 1.5, and a live Morrow Strike 1 with 15 startup / 20 recovery passed. Deterministic input checks stub rendering; the visual review separately used the real renderer and loaded graphic character models.
- Local results dashboard checks passed on desktop and 390px phone width: both sides’ win ranges, pin/edge tables, Morrow matchup rows, navigation links and no page-width overflow or page errors. Final captures: `dashboard-desktop-1793268329439.jpg` and `dashboard-phone-1793268329439.jpg`.
- **18 real renderer captures**, six stages × lock-on/side/duel cameras. Default render hides the ring. I inspected the contact sheet: the bright yellow inner line and dark outer edge read against every stage floor. The initial dark torus hid the bright core; `pre-line-fix/` retains that rejected version. The final flat strips sit above the floor and share the simulation radius constant.
- `boundary-contact-sheet.jpg`: rows Aegis, Rei, Tala, Morrow, Sol, Vesper; columns lock-on, side, duel. Individual source captures and model statuses are listed in `browser.json`. The weakest view is the distant far arc in the lock-on camera: it becomes thin with perspective, while the near boundary remains clear. Claude can style the line later.
- Physical controller feel and normal-speed accidental-input frequency still need Adam’s playtest. Synthetic taps cannot reveal player intent. The new ring has no rectangular corners; this does not mean a fighter cannot be pressured against its boundary.
- Balance data was not regenerated. Existing default-value and source-reference sync tests pass. No default move, damage, reach, hitbox, rig or pose values changed. The renderer edits only add/hide the boundary mesh.

## Play locally

- [Ring](http://localhost:4206/dist/index.html?move=v2&arena=ring)
- [Ring + slow grabs](http://localhost:4206/dist/index.html?move=v2&arena=ring&grab=slow)
- [Ring + Morrow jab15](http://localhost:4206/dist/index.html?move=v2&arena=ring&morrow=jab15)
- [Old rectangle with the new input settings](http://localhost:4206/dist/index.html?move=v2&arena=rect)
- [Results dashboard](http://localhost:4206/dist/arena-lab.html)

Add `&mode=training` to any game link for training. If the server stops, run `python3 -m http.server 4206 --bind 127.0.0.1` in `~/rift-worktrees/arena-input`. Status: Review, awaiting Adam’s normal-speed verdict.
