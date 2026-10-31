# SIDESTEP-LINEAR review

Yes: under step=linear, a same-frame sidestep escapes Morrow’s 11f jab from both 1.5 and 2 units. Close captures now have a narrow path too. Default gameplay is unchanged. Startup aim stays fixed; no invulnerability or faster animation was added.

The existing sidestep already clears the new paths: 1.8 units over 14 frames, then 6 recovery frames with guard locked. Tala can punish Morrow’s missed jab on fixture tick 30 and Morrow on tick 32, before its 34f move ends. Their attack press starts at tick 20 after step recovery. These are isolated, early-read fixtures, not 15f reactions.

Morrow’s Returning Sweep still catches an early sidestep. Each fighter has one or two named tracking moves, retaining the existing wide cone or radial check rather than homing toward the defender. They already have longer startup/recovery than the jab; the linear switch changes no attack timing. The existing heavy-Morrow option remains a separate timing/damage variant. The roster and exact escape windows below expose gaps where even a tracking move misses.

These bot runs do not show defence becoming dominant: all combined-policy changes versus Horizon have overlapping 95% ranges. This is not proof of human balance. Side-stepper reacts late to fast attacks and is less successful than the other policies; the narrowed paths also restrict its own attacks. See masher wins, round times and tracking catches below.

Mean bout lengths across the six mode/delay groups stay between 19.2 and 19.7 seconds, with 1 draw in all 12,960 bouts. These policies do not produce a defensive stalemate.

The new side-stepper is a reactive policy, not an expert human. It reads delayed visible startup, alternates left/right, releases between taps, then attacks recovery. It cannot react to an 11f jab at 15f delay; even at 10f, two taps plus displacement take additional time. A move can be dodgeable on a read but too fast for this bot’s reaction. Stepper remains the older backdash policy; punisher remains unchanged.

Side-stepper vs masher, 10f: 38.6% (139/360); 95% 33.6–43.9% → 35.6% (128/360); 95% 30.6–40.6% (-3.1 percentage points; could be luck). Mean bout time 16.1 → 16.2 seconds; draws 0 → 0.

Side-stepper vs masher-all, 10f: 29.4% (106/360); 95% 24.7–34.4% → 35.6% (128/360); 95% 30.8–40.8% (6.1 percentage points; could be luck). Mean bout time 22.3 → 22.8 seconds; draws 0 → 0.

Side-stepper vs masher, 15f: 14.7% (53/360); 95% 11.1–18.8% → 14.2% (51/360); 95% 10.6–18.1% (-0.6 percentage points; could be luck). Mean bout time 13.9 → 14.1 seconds; draws 0 → 0.

Side-stepper vs masher-all, 15f: 20.8% (75/360); 95% 16.1–25.3% → 18.6% (67/360); 95% 14.2–23.0% (-2.2 percentage points; could be luck). Mean bout time 22.8 → 22.8 seconds; draws 0 → 0.

Tracking moves caught the side-stepper on 76/78 observed tracking opportunities at 10f. This denominator includes only moves checked while a sidestep was active, not all attacks. The bot is usually stepping late; this is not the chance of catching an optimally timed human step.

Tracking moves caught the side-stepper on 81/81 observed tracking opportunities at 15f. This denominator includes only moves checked while a sidestep was active, not all attacks. The bot is usually stepping late; this is not the chance of catching an optimally timed human step.

12,960 bouts: three modes × two delays × three policies × two mashers × all 36 fighter pairs × five seeds × mirrored seats. Horizon baseline is move=v2&arena=ring&burst=v2. Linear adds step=linear; linear-heavy also adds the existing morrow=jab15heavy. No proposed balance or grab switches. Every older study is retained.

95% ranges envelope Wilson and 2,000 bootstrap resamples of fighter-pair/seed blocks; mirrored seats and combined policies remain grouped. Overlapping ranges mean could be luck, not proof of equality. Multiple comparisons are exploratory. Wins count draws as non-wins; both sides and draw counts are shown.

Mean bout time is input frames / 60 (including hitstop), not wall-clock simulation runtime. Tracking catches count unique moves that actually hit/capture a sidestepping opponent, separated into travel and recovery. Opportunities count unique move checks while the defender has a sidestep state; a missed early active-frame check may connect on a later active frame. Tracking instances observed includes end-of-tick move snapshots and contact checks, including a move interrupted later in its contact tick; it is not an input-attempt count. Counters belong to the attacking side, except sidesteps started, which belong to the stepping side. These are policy-conditioned opportunities, not universal dodge probabilities.

Fixtures isolate actual move states with startup aim fixed at +X; chains are tested without preceding hitstun. Offsets are actual step starts; manual double taps require the first tap two frames earlier. They follow through for 240 ticks, including projectiles and later pulses. A miss at 3 units can mean the attack was out of range even without a step. These are not a guarantee of escape from a true combo.

Basic shots, back-special projectiles, long-range capture projectiles, pursuit and Burst retain their existing checks. Forward special projectiles retain their physical flight/collider but lateral overlap is clipped to their own fixed launch axes. Multi-projectile moves can still cover several lanes. No animation, rig, hitstop or default balance edits. Normal-speed visual acceptance belongs to Adam.

Side-stepper sanity against random uses seed 1, all 36 pairs and mirrored seats, separately from the five-seed tournament: 10f horizon: 75.0% (54/72); 95% 63.9–83.6%, 35 actual sidesteps; 10f linear: 79.2% (57/72); 95% 68.4–88.9%, 36 actual sidesteps; 15f horizon: 76.4% (55/72); 95% 65.4–86.1%, 22 actual sidesteps; 15f linear: 79.2% (57/72); 95% 68.4–87.5%, 23 actual sidesteps. This is a basic functionality check, not a strong-opponent ranking.

Measured tournament runtime (sum of six mode jobs): 68.8 seconds. 0 censored bouts.

## Win rates, draws and bout length

Delay | Mode | Policy / opponent | Policy wins; 95% | Masher wins; 95% | Draws | Mean seconds
--- | --- | --- | --- | --- | --- | ---
10 | horizon | stepper/masher | 36.4% (131/360); 95% 31.6–41.7% | 63.6% (229/360); 95% 58.3–68.4% | 0 | 15.46
10 | horizon | stepper/masher-all | 34.7% (125/360); 95% 29.7–40.3% | 65.3% (235/360); 95% 59.7–70.3% | 0 | 22.75
10 | horizon | punisher/masher | 91.7% (330/360); 95% 88.4–94.4% | 8.3% (30/360); 95% 5.6–11.6% | 0 | 18.12
10 | horizon | punisher/masher-all | 83.9% (302/360); 95% 79.7–87.8% | 16.1% (58/360); 95% 12.2–20.3% | 0 | 22.37
10 | horizon | side-stepper/masher | 38.6% (139/360); 95% 33.6–43.9% | 61.4% (221/360); 95% 56.1–66.4% | 0 | 16.06
10 | horizon | side-stepper/masher-all | 29.4% (106/360); 95% 24.7–34.4% | 70.6% (254/360); 95% 65.6–75.3% | 0 | 22.30
10 | horizon | combined/masher | 55.6% (600/1080); 95% 52.5–58.8% | 44.4% (480/1080); 95% 41.2–47.5% | 0 | 16.55
10 | horizon | combined/masher-all | 49.4% (533/1080); 95% 46.1–53.0% | 50.6% (547/1080); 95% 47.0–53.9% | 0 | 22.47
10 | linear | stepper/masher | 35.8% (129/360); 95% 31.1–41.1% | 64.2% (231/360); 95% 58.6–68.9% | 0 | 15.44
10 | linear | stepper/masher-all | 33.1% (119/360); 95% 27.8–38.6% | 66.9% (241/360); 95% 61.4–72.2% | 0 | 22.69
10 | linear | punisher/masher | 91.7% (330/360); 95% 88.4–94.4% | 8.3% (30/360); 95% 5.6–11.6% | 0 | 18.70
10 | linear | punisher/masher-all | 81.4% (293/360); 95% 77.0–85.6% | 18.6% (67/360); 95% 14.4–23.0% | 0 | 22.42
10 | linear | side-stepper/masher | 35.6% (128/360); 95% 30.6–40.6% | 64.4% (232/360); 95% 59.4–69.4% | 0 | 16.21
10 | linear | side-stepper/masher-all | 35.6% (128/360); 95% 30.8–40.8% | 64.4% (232/360); 95% 59.2–69.2% | 0 | 22.79
10 | linear | combined/masher | 54.4% (587/1080); 95% 51.1–57.6% | 45.6% (493/1080); 95% 42.4–48.9% | 0 | 16.79
10 | linear | combined/masher-all | 50.0% (540/1080); 95% 46.4–53.7% | 50.0% (540/1080); 95% 46.3–53.5% | 0 | 22.63
10 | linear-heavy | stepper/masher | 32.5% (117/360); 95% 27.5–37.5% | 67.5% (243/360); 95% 62.5–72.5% | 0 | 14.75
10 | linear-heavy | stepper/masher-all | 32.2% (116/360); 95% 27.2–37.5% | 67.8% (244/360); 95% 62.5–72.8% | 0 | 22.50
10 | linear-heavy | punisher/masher | 88.9% (320/360); 95% 85.2–91.9% | 11.1% (40/360); 95% 8.1–14.8% | 0 | 18.03
10 | linear-heavy | punisher/masher-all | 80.6% (290/360); 95% 76.2–84.7% | 19.4% (70/360); 95% 15.3–23.8% | 0 | 22.00
10 | linear-heavy | side-stepper/masher | 35.8% (129/360); 95% 31.1–40.9% | 64.2% (231/360); 95% 59.1–68.9% | 0 | 15.64
10 | linear-heavy | side-stepper/masher-all | 36.9% (133/360); 95% 31.9–42.2% | 63.1% (227/360); 95% 57.5–68.1% | 0 | 22.43
10 | linear-heavy | combined/masher | 52.4% (566/1080); 95% 49.4–55.5% | 47.6% (514/1080); 95% 44.5–50.6% | 0 | 16.14
10 | linear-heavy | combined/masher-all | 49.9% (539/1080); 95% 46.5–53.6% | 50.1% (541/1080); 95% 46.4–53.5% | 0 | 22.31
15 | horizon | stepper/masher | 15.3% (55/360); 95% 11.7–19.4% | 84.7% (305/360); 95% 80.6–88.3% | 0 | 13.66
15 | horizon | stepper/masher-all | 23.9% (86/360); 95% 19.4–28.6% | 76.1% (274/360); 95% 71.4–80.6% | 0 | 22.60
15 | horizon | punisher/masher | 50.8% (183/360); 95% 45.7–56.1% | 49.2% (177/360); 95% 43.9–54.3% | 0 | 17.93
15 | horizon | punisher/masher-all | 49.4% (178/360); 95% 43.9–55.0% | 50.6% (182/360); 95% 45.0–56.1% | 0 | 25.95
15 | horizon | side-stepper/masher | 14.7% (53/360); 95% 11.1–18.8% | 85.3% (307/360); 95% 81.2–88.9% | 0 | 13.90
15 | horizon | side-stepper/masher-all | 20.8% (75/360); 95% 16.1–25.3% | 79.2% (285/360); 95% 74.7–83.9% | 0 | 22.83
15 | horizon | combined/masher | 26.9% (291/1080); 95% 24.1–29.8% | 73.1% (789/1080); 95% 70.2–75.9% | 0 | 15.16
15 | horizon | combined/masher-all | 31.4% (339/1080); 95% 28.3–34.5% | 68.6% (741/1080); 95% 65.5–71.7% | 0 | 23.79
15 | linear | stepper/masher | 14.2% (51/360); 95% 10.6–18.1% | 85.8% (309/360); 95% 81.9–89.4% | 0 | 13.74
15 | linear | stepper/masher-all | 22.8% (82/360); 95% 18.3–27.5% | 77.2% (278/360); 95% 72.5–81.7% | 0 | 22.54
15 | linear | punisher/masher | 53.1% (191/360); 95% 47.9–58.2% | 46.9% (169/360); 95% 41.8–52.1% | 0 | 18.42
15 | linear | punisher/masher-all | 48.6% (175/360); 95% 43.3–53.9% | 51.4% (185/360); 95% 46.1–56.7% | 0 | 26.13
15 | linear | side-stepper/masher | 14.2% (51/360); 95% 10.6–18.1% | 85.8% (309/360); 95% 81.9–89.4% | 0 | 14.10
15 | linear | side-stepper/masher-all | 18.6% (67/360); 95% 14.2–23.0% | 81.4% (293/360); 95% 77.0–85.8% | 0 | 22.85
15 | linear | combined/masher | 27.1% (293/1080); 95% 24.4–29.9% | 72.9% (787/1080); 95% 70.1–75.6% | 0 | 15.42
15 | linear | combined/masher-all | 30.0% (324/1080); 95% 26.7–33.2% | 70.0% (756/1080); 95% 66.8–73.3% | 0 | 23.84
15 | linear-heavy | stepper/masher | 16.1% (58/360); 95% 12.2–20.3% | 83.9% (302/360); 95% 79.7–87.8% | 0 | 13.30
15 | linear-heavy | stepper/masher-all | 21.1% (76/360); 95% 16.7–25.8% | 78.9% (284/360); 95% 74.2–83.3% | 0 | 22.28
15 | linear-heavy | punisher/masher | 49.4% (178/360); 95% 44.3–54.7% | 50.6% (182/360); 95% 45.3–55.7% | 0 | 17.81
15 | linear-heavy | punisher/masher-all | 50.0% (180/360); 95% 44.7–55.6% | 50.0% (180/360); 95% 44.4–55.3% | 0 | 25.82
15 | linear-heavy | side-stepper/masher | 14.4% (52/360); 95% 11.1–18.5% | 85.3% (307/360); 95% 81.2–88.9% | 1 | 13.56
15 | linear-heavy | side-stepper/masher-all | 19.4% (70/360); 95% 15.3–23.8% | 80.6% (290/360); 95% 76.2–84.7% | 0 | 22.80
15 | linear-heavy | combined/masher | 26.7% (288/1080); 95% 23.9–29.5% | 73.2% (791/1080); 95% 70.4–76.0% | 1 | 14.89
15 | linear-heavy | combined/masher-all | 30.2% (326/1080); 95% 26.9–33.6% | 69.8% (754/1080); 95% 66.4–73.1% | 0 | 23.63

## Differences vs Horizon

Delay | Mode | Policy / opponent | Gain | Interpretation
--- | --- | --- | --- | ---
10 | linear | stepper/masher | -0.6 pp | could be luck
10 | linear | stepper/masher-all | -1.7 pp | could be luck
10 | linear | punisher/masher | 0.0 pp | could be luck
10 | linear | punisher/masher-all | -2.5 pp | could be luck
10 | linear | side-stepper/masher | -3.1 pp | could be luck
10 | linear | side-stepper/masher-all | 6.1 pp | could be luck
10 | linear | combined/masher | -1.2 pp | could be luck
10 | linear | combined/masher-all | 0.6 pp | could be luck
10 | linear-heavy | stepper/masher | -3.9 pp | could be luck
10 | linear-heavy | stepper/masher-all | -2.5 pp | could be luck
10 | linear-heavy | punisher/masher | -2.8 pp | could be luck
10 | linear-heavy | punisher/masher-all | -3.3 pp | could be luck
10 | linear-heavy | side-stepper/masher | -2.8 pp | could be luck
10 | linear-heavy | side-stepper/masher-all | 7.5 pp | could be luck
10 | linear-heavy | combined/masher | -3.1 pp | could be luck
10 | linear-heavy | combined/masher-all | 0.6 pp | could be luck
15 | linear | stepper/masher | -1.1 pp | could be luck
15 | linear | stepper/masher-all | -1.1 pp | could be luck
15 | linear | punisher/masher | 2.2 pp | could be luck
15 | linear | punisher/masher-all | -0.8 pp | could be luck
15 | linear | side-stepper/masher | -0.6 pp | could be luck
15 | linear | side-stepper/masher-all | -2.2 pp | could be luck
15 | linear | combined/masher | 0.2 pp | could be luck
15 | linear | combined/masher-all | -1.4 pp | could be luck
15 | linear-heavy | stepper/masher | 0.8 pp | could be luck
15 | linear-heavy | stepper/masher-all | -2.8 pp | could be luck
15 | linear-heavy | punisher/masher | -1.4 pp | could be luck
15 | linear-heavy | punisher/masher-all | 0.6 pp | could be luck
15 | linear-heavy | side-stepper/masher | -0.3 pp | could be luck
15 | linear-heavy | side-stepper/masher-all | -1.4 pp | could be luck
15 | linear-heavy | combined/masher | -0.3 pp | could be luck
15 | linear-heavy | combined/masher-all | -1.2 pp | could be luck

## Tracking counters and actual steps

Delay | Mode | Policy / opponent | Side | Steps started | Tracking instances observed / checked | Tracking step opportunities / catches | Catches in travel / recovery | Linear step opportunities / catches | Basic / directional / punish starts
--- | --- | --- | --- | --- | --- | --- | --- | --- | ---
10 | horizon | stepper/masher | skilled | 0 | 580 / 580 | 0 / 0 | 0 / 0 | 0 / 0 | 3532 / 0 / 667
10 | horizon | stepper/masher | masher | 0 | 515 / 389 | 0 / 0 | 0 / 0 | 0 / 0 | 1153 / 2973 / 720
10 | horizon | stepper/masher-all | skilled | 0 | 807 / 804 | 0 / 0 | 0 / 0 | 0 / 0 | 4870 / 0 / 878
10 | horizon | stepper/masher-all | masher | 0 | 193 / 121 | 0 / 0 | 0 / 0 | 0 / 0 | 119 / 2533 / 1068
10 | horizon | punisher/masher | skilled | 0 | 619 / 615 | 0 / 0 | 0 / 0 | 0 / 0 | 3504 / 352 / 332
10 | horizon | punisher/masher | masher | 0 | 577 / 422 | 0 / 0 | 0 / 0 | 0 / 0 | 1412 / 3508 / 843
10 | horizon | punisher/masher-all | skilled | 0 | 908 / 901 | 0 / 0 | 0 / 0 | 0 / 0 | 5241 / 392 / 952
10 | horizon | punisher/masher-all | masher | 0 | 206 / 128 | 0 / 0 | 0 / 0 | 0 / 0 | 139 / 2591 / 1441
10 | horizon | side-stepper/masher | skilled | 270 | 599 / 599 | 0 / 0 | 0 / 0 | 0 / 0 | 3602 / 0 / 744
10 | horizon | side-stepper/masher | masher | 0 | 542 / 389 | 66 / 64 | 64 / 0 | 84 / 79 | 1244 / 3116 / 849
10 | horizon | side-stepper/masher-all | skilled | 134 | 727 / 726 | 0 / 0 | 0 / 0 | 0 / 0 | 4442 / 0 / 874
10 | horizon | side-stepper/masher-all | masher | 0 | 188 / 135 | 11 / 11 | 11 / 0 | 168 / 144 | 105 / 2481 / 980
10 | horizon | combined/masher | skilled | 270 | 1798 / 1794 | 0 / 0 | 0 / 0 | 0 / 0 | 10638 / 352 / 1743
10 | horizon | combined/masher | masher | 0 | 1634 / 1200 | 66 / 64 | 64 / 0 | 84 / 79 | 3809 / 9597 / 2412
10 | horizon | combined/masher-all | skilled | 134 | 2442 / 2431 | 0 / 0 | 0 / 0 | 0 / 0 | 14553 / 392 / 2704
10 | horizon | combined/masher-all | masher | 0 | 587 / 384 | 11 / 11 | 11 / 0 | 168 / 144 | 363 / 7605 / 3489
10 | linear | stepper/masher | skilled | 0 | 577 / 577 | 0 / 0 | 0 / 0 | 0 / 0 | 3546 / 0 / 672
10 | linear | stepper/masher | masher | 0 | 522 / 396 | 0 / 0 | 0 / 0 | 0 / 0 | 1170 / 2986 / 736
10 | linear | stepper/masher-all | skilled | 0 | 796 / 793 | 0 / 0 | 0 / 0 | 0 / 0 | 4866 / 0 / 884
10 | linear | stepper/masher-all | masher | 0 | 196 / 128 | 0 / 0 | 0 / 0 | 0 / 0 | 116 / 2524 / 1075
10 | linear | punisher/masher | skilled | 0 | 616 / 613 | 0 / 0 | 0 / 0 | 0 / 0 | 3501 / 349 / 332
10 | linear | punisher/masher | masher | 0 | 593 / 445 | 0 / 0 | 0 / 0 | 0 / 0 | 1425 / 3669 / 845
10 | linear | punisher/masher-all | skilled | 0 | 899 / 891 | 0 / 0 | 0 / 0 | 0 / 0 | 5236 / 393 / 944
10 | linear | punisher/masher-all | masher | 0 | 217 / 141 | 0 / 0 | 0 / 0 | 0 / 0 | 125 / 2576 / 1435
10 | linear | side-stepper/masher | skilled | 280 | 609 / 609 | 0 / 0 | 0 / 0 | 0 / 0 | 3637 / 0 / 749
10 | linear | side-stepper/masher | masher | 0 | 536 / 384 | 67 / 65 | 65 / 0 | 85 / 61 | 1253 / 3162 / 878
10 | linear | side-stepper/masher-all | skilled | 116 | 800 / 800 | 0 / 0 | 0 / 0 | 0 / 0 | 4849 / 0 / 1012
10 | linear | side-stepper/masher-all | masher | 0 | 194 / 139 | 11 / 11 | 11 / 0 | 162 / 72 | 107 / 2506 / 1053
10 | linear | combined/masher | skilled | 280 | 1802 / 1799 | 0 / 0 | 0 / 0 | 0 / 0 | 10684 / 349 / 1753
10 | linear | combined/masher | masher | 0 | 1651 / 1225 | 67 / 65 | 65 / 0 | 85 / 61 | 3848 / 9817 / 2459
10 | linear | combined/masher-all | skilled | 116 | 2495 / 2484 | 0 / 0 | 0 / 0 | 0 / 0 | 14951 / 393 / 2840
10 | linear | combined/masher-all | masher | 0 | 607 / 408 | 11 / 11 | 11 / 0 | 162 / 72 | 348 / 7606 / 3563
10 | linear-heavy | stepper/masher | skilled | 0 | 516 / 516 | 0 / 0 | 0 / 0 | 0 / 0 | 3308 / 0 / 638
10 | linear-heavy | stepper/masher | masher | 0 | 479 / 376 | 0 / 0 | 0 / 0 | 0 / 0 | 1084 / 2899 / 722
10 | linear-heavy | stepper/masher-all | skilled | 0 | 693 / 691 | 0 / 0 | 0 / 0 | 0 / 0 | 4625 / 0 / 876
10 | linear-heavy | stepper/masher-all | masher | 0 | 190 / 130 | 0 / 0 | 0 / 0 | 0 / 0 | 113 / 2482 / 1051
10 | linear-heavy | punisher/masher | skilled | 0 | 558 / 557 | 0 / 0 | 0 / 0 | 0 / 0 | 3292 / 318 / 338
10 | linear-heavy | punisher/masher | masher | 0 | 569 / 425 | 0 / 0 | 0 / 0 | 0 / 0 | 1326 / 3603 / 843
10 | linear-heavy | punisher/masher-all | skilled | 0 | 799 / 790 | 0 / 0 | 0 / 0 | 0 / 0 | 5037 / 371 / 910
10 | linear-heavy | punisher/masher-all | masher | 0 | 208 / 142 | 0 / 0 | 0 / 0 | 0 / 0 | 116 / 2584 / 1379
10 | linear-heavy | side-stepper/masher | skilled | 309 | 556 / 556 | 0 / 0 | 0 / 0 | 0 / 0 | 3476 / 0 / 746
10 | linear-heavy | side-stepper/masher | masher | 0 | 503 / 364 | 58 / 58 | 58 / 0 | 116 / 58 | 1238 / 3062 / 880
10 | linear-heavy | side-stepper/masher-all | skilled | 121 | 701 / 701 | 0 / 0 | 0 / 0 | 0 / 0 | 4563 / 0 / 1006
10 | linear-heavy | side-stepper/masher-all | masher | 0 | 187 / 136 | 9 / 9 | 9 / 0 | 169 / 75 | 103 / 2445 / 1027
10 | linear-heavy | combined/masher | skilled | 309 | 1630 / 1629 | 0 / 0 | 0 / 0 | 0 / 0 | 10076 / 318 / 1722
10 | linear-heavy | combined/masher | masher | 0 | 1551 / 1165 | 58 / 58 | 58 / 0 | 116 / 58 | 3648 / 9564 / 2445
10 | linear-heavy | combined/masher-all | skilled | 121 | 2193 / 2182 | 0 / 0 | 0 / 0 | 0 / 0 | 14225 / 371 / 2792
10 | linear-heavy | combined/masher-all | masher | 0 | 585 / 408 | 9 / 9 | 9 / 0 | 169 / 75 | 332 / 7511 / 3457
15 | horizon | stepper/masher | skilled | 0 | 439 / 438 | 0 / 0 | 0 / 0 | 0 / 0 | 2381 / 0 / 552
15 | horizon | stepper/masher | masher | 0 | 515 / 386 | 0 / 0 | 0 / 0 | 0 / 0 | 822 / 2657 / 565
15 | horizon | stepper/masher-all | skilled | 0 | 676 / 675 | 0 / 0 | 0 / 0 | 0 / 0 | 4164 / 0 / 700
15 | horizon | stepper/masher-all | masher | 0 | 180 / 122 | 0 / 0 | 0 / 0 | 0 / 0 | 116 / 2253 / 876
15 | horizon | punisher/masher | skilled | 0 | 466 / 464 | 0 / 0 | 0 / 0 | 0 / 0 | 2925 / 210 / 398
15 | horizon | punisher/masher | masher | 0 | 666 / 492 | 0 / 0 | 0 / 0 | 0 / 0 | 1283 / 3627 / 696
15 | horizon | punisher/masher-all | skilled | 0 | 789 / 776 | 0 / 0 | 0 / 0 | 0 / 0 | 5022 / 374 / 732
15 | horizon | punisher/masher-all | masher | 0 | 197 / 142 | 0 / 0 | 0 / 0 | 0 / 0 | 111 / 2778 / 1234
15 | horizon | side-stepper/masher | skilled | 182 | 434 / 432 | 0 / 0 | 0 / 0 | 0 / 0 | 2411 / 0 / 582
15 | horizon | side-stepper/masher | masher | 0 | 498 / 391 | 73 / 73 | 73 / 0 | 17 / 17 | 871 / 2694 / 605
15 | horizon | side-stepper/masher-all | skilled | 150 | 655 / 652 | 0 / 0 | 0 / 0 | 0 / 0 | 4107 / 0 / 760
15 | horizon | side-stepper/masher-all | masher | 0 | 172 / 129 | 8 / 8 | 8 / 0 | 160 / 156 | 117 / 2273 / 872
15 | horizon | combined/masher | skilled | 182 | 1339 / 1334 | 0 / 0 | 0 / 0 | 0 / 0 | 7717 / 210 / 1532
15 | horizon | combined/masher | masher | 0 | 1679 / 1269 | 73 / 73 | 73 / 0 | 17 / 17 | 2976 / 8978 / 1866
15 | horizon | combined/masher-all | skilled | 150 | 2120 / 2103 | 0 / 0 | 0 / 0 | 0 / 0 | 13293 / 374 / 2192
15 | horizon | combined/masher-all | masher | 0 | 549 / 393 | 8 / 8 | 8 / 0 | 160 / 156 | 344 / 7304 / 2982
15 | linear | stepper/masher | skilled | 0 | 439 / 438 | 0 / 0 | 0 / 0 | 0 / 0 | 2367 / 0 / 557
15 | linear | stepper/masher | masher | 0 | 518 / 393 | 0 / 0 | 0 / 0 | 0 / 0 | 842 / 2685 / 563
15 | linear | stepper/masher-all | skilled | 0 | 665 / 664 | 0 / 0 | 0 / 0 | 0 / 0 | 4124 / 0 / 726
15 | linear | stepper/masher-all | masher | 0 | 190 / 128 | 0 / 0 | 0 / 0 | 0 / 0 | 123 / 2255 / 872
15 | linear | punisher/masher | skilled | 0 | 474 / 472 | 0 / 0 | 0 / 0 | 0 / 0 | 2980 / 234 / 403
15 | linear | punisher/masher | masher | 0 | 683 / 506 | 0 / 0 | 0 / 0 | 0 / 0 | 1322 / 3723 / 714
15 | linear | punisher/masher-all | skilled | 0 | 783 / 771 | 0 / 0 | 0 / 0 | 0 / 0 | 5079 / 378 / 768
15 | linear | punisher/masher-all | masher | 0 | 213 / 154 | 0 / 0 | 0 / 0 | 0 / 0 | 115 / 2799 / 1277
15 | linear | side-stepper/masher | skilled | 178 | 442 / 440 | 0 / 0 | 0 / 0 | 0 / 0 | 2450 / 0 / 591
15 | linear | side-stepper/masher | masher | 0 | 500 / 395 | 74 / 74 | 74 / 0 | 17 / 16 | 898 / 2732 / 616
15 | linear | side-stepper/masher-all | skilled | 145 | 642 / 640 | 0 / 0 | 0 / 0 | 0 / 0 | 4100 / 0 / 793
15 | linear | side-stepper/masher-all | masher | 0 | 176 / 131 | 7 / 7 | 7 / 0 | 155 / 137 | 124 / 2281 / 874
15 | linear | combined/masher | skilled | 178 | 1355 / 1350 | 0 / 0 | 0 / 0 | 0 / 0 | 7797 / 234 / 1551
15 | linear | combined/masher | masher | 0 | 1701 / 1294 | 74 / 74 | 74 / 0 | 17 / 16 | 3062 / 9140 / 1893
15 | linear | combined/masher-all | skilled | 145 | 2090 / 2075 | 0 / 0 | 0 / 0 | 0 / 0 | 13303 / 378 / 2287
15 | linear | combined/masher-all | masher | 0 | 579 / 413 | 7 / 7 | 7 / 0 | 155 / 137 | 362 / 7335 / 3023
15 | linear-heavy | stepper/masher | skilled | 0 | 397 / 396 | 0 / 0 | 0 / 0 | 0 / 0 | 2255 / 0 / 547
15 | linear-heavy | stepper/masher | masher | 0 | 466 / 362 | 0 / 0 | 0 / 0 | 0 / 0 | 783 / 2593 / 547
15 | linear-heavy | stepper/masher-all | skilled | 0 | 574 / 574 | 0 / 0 | 0 / 0 | 0 / 0 | 3900 / 0 / 719
15 | linear-heavy | stepper/masher-all | masher | 0 | 180 / 129 | 0 / 0 | 0 / 0 | 0 / 0 | 117 / 2205 / 837
15 | linear-heavy | punisher/masher | skilled | 0 | 390 / 388 | 0 / 0 | 0 / 0 | 0 / 0 | 2702 / 237 / 377
15 | linear-heavy | punisher/masher | masher | 0 | 583 / 434 | 0 / 0 | 0 / 0 | 0 / 0 | 1226 / 3575 / 692
15 | linear-heavy | punisher/masher-all | skilled | 0 | 679 / 667 | 0 / 0 | 0 / 0 | 0 / 0 | 4877 / 365 / 765
15 | linear-heavy | punisher/masher-all | masher | 0 | 207 / 149 | 0 / 0 | 0 / 0 | 0 / 0 | 108 / 2767 / 1225
15 | linear-heavy | side-stepper/masher | skilled | 167 | 377 / 376 | 0 / 0 | 0 / 0 | 0 / 0 | 2238 / 0 / 542
15 | linear-heavy | side-stepper/masher | masher | 0 | 448 / 352 | 60 / 60 | 60 / 0 | 21 / 18 | 818 / 2627 / 586
15 | linear-heavy | side-stepper/masher-all | skilled | 157 | 553 / 552 | 0 / 0 | 0 / 0 | 0 / 0 | 3942 / 0 / 800
15 | linear-heavy | side-stepper/masher-all | masher | 0 | 161 / 123 | 6 / 6 | 6 / 0 | 166 / 142 | 119 / 2227 / 854
15 | linear-heavy | combined/masher | skilled | 167 | 1164 / 1160 | 0 / 0 | 0 / 0 | 0 / 0 | 7195 / 237 / 1466
15 | linear-heavy | combined/masher | masher | 0 | 1497 / 1148 | 60 / 60 | 60 / 0 | 21 / 18 | 2827 / 8795 / 1825
15 | linear-heavy | combined/masher-all | skilled | 157 | 1806 / 1793 | 0 / 0 | 0 / 0 | 0 / 0 | 12719 / 365 / 2284
15 | linear-heavy | combined/masher-all | masher | 0 | 548 / 401 | 6 / 6 | 6 / 0 | 166 / 142 | 344 / 7199 / 2916

## Tracking roster (unchanged timings)

Fighter | Move | Startup | Active | Recovery
--- | --- | --- | --- | ---
aegis | Strike 2 — reverse cut | 14 | 4 | 24
rei | Spiral bloom | 18 | 16 | 28
rei | Twin moon | 18 | 28 | 28
tala | Strike 3 — stepping hook | 18 | 5 | 26
morrow | Returning Sweep | 16 | 4 | 26
morrow | Iron eruption | 24 | 12 | 32
sol | Solar mantle | 18 | 20 | 26
sol | Solar ward | 18 | 28 | 26
vesper | Strike 2 — reverse sweep | 14 | 4 | 24

## Punish fixtures

[{"defender":"tala","attackTick":20,"punish":{"hitTick":30,"attackerBeforeHit":{"frame":30,"startup":11,"active":3,"total":34},"damage":6.1200000000000045,"inRecovery":true},"defenderDamage":0},{"defender":"morrow","attackTick":20,"punish":{"hitTick":32,"attackerBeforeHit":{"frame":32,"startup":11,"active":3,"total":34},"damage":7.439999999999998,"inRecovery":true},"defenderDamage":0}]

## Every startup step window

Isolated real move objects at frame 0 with fixed +X aim; no preceding chain hitstun. Steps use the real starter with no invulnerability. Frame 0 means before the first simulation advance. Collision/player separation still run. Up/down are the two sidestep directions. 240f follow-through includes all pulses, later projectile catches and cinematic resolution. Attack states are isolated fixture setups, not claims every chain link can start from idle. Manual double taps need the first tap two frames before the listed actual step start.

Fighter | Move | Tracking | Rules | Gap | Direction | Escape step-start frames
--- | --- | --- | --- | --- | --- | ---
aegis | strike1 | no | Horizon | 1.5 | up | 0, 1
aegis | strike1 | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6
aegis | strike1 | no | Horizon | 1.5 | down | 0, 1
aegis | strike1 | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6
aegis | strike1 | no | Horizon | 2 | up | none
aegis | strike1 | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6
aegis | strike1 | no | Horizon | 2 | down | none
aegis | strike1 | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6
aegis | strike1 | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
aegis | strike1 | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
aegis | strike1 | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
aegis | strike1 | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
aegis | strike2 | yes | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5
aegis | strike2 | yes | linear | 1.5 | up | 0, 1, 2, 3, 4, 5
aegis | strike2 | yes | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5
aegis | strike2 | yes | linear | 1.5 | down | 0, 1, 2, 3, 4, 5
aegis | strike2 | yes | Horizon | 2 | up | none
aegis | strike2 | yes | linear | 2 | up | none
aegis | strike2 | yes | Horizon | 2 | down | none
aegis | strike2 | yes | linear | 2 | down | none
aegis | strike2 | yes | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
aegis | strike2 | yes | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
aegis | strike2 | yes | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
aegis | strike2 | yes | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
aegis | strike3 | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
aegis | strike3 | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
aegis | strike3 | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
aegis | strike3 | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
aegis | strike3 | no | Horizon | 2 | up | none
aegis | strike3 | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
aegis | strike3 | no | Horizon | 2 | down | none
aegis | strike3 | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
aegis | strike3 | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
aegis | strike3 | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
aegis | strike3 | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
aegis | strike3 | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
aegis | launch | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
aegis | launch | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
aegis | launch | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
aegis | launch | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
aegis | launch | no | Horizon | 2 | up | none
aegis | launch | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
aegis | launch | no | Horizon | 2 | down | none
aegis | launch | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
aegis | launch | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
aegis | launch | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
aegis | launch | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
aegis | launch | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
aegis | capture | no | Horizon | 1.5 | up | none
aegis | capture | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
aegis | capture | no | Horizon | 1.5 | down | none
aegis | capture | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
aegis | capture | no | Horizon | 2 | up | none
aegis | capture | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
aegis | capture | no | Horizon | 2 | down | none
aegis | capture | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
aegis | capture | no | Horizon | 3 | up | none
aegis | capture | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
aegis | capture | no | Horizon | 3 | down | none
aegis | capture | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
aegis | technique | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
aegis | technique | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
aegis | technique | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
aegis | technique | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
aegis | technique | no | Horizon | 2 | up | none
aegis | technique | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
aegis | technique | no | Horizon | 2 | down | none
aegis | technique | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
aegis | technique | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
aegis | technique | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
aegis | technique | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
aegis | technique | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
aegis | technique-alt | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
aegis | technique-alt | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
aegis | technique-alt | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
aegis | technique-alt | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
aegis | technique-alt | no | Horizon | 2 | up | none
aegis | technique-alt | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
aegis | technique-alt | no | Horizon | 2 | down | none
aegis | technique-alt | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
aegis | technique-alt | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
aegis | technique-alt | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
aegis | technique-alt | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
aegis | technique-alt | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
aegis | forward | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
aegis | forward | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
aegis | forward | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
aegis | forward | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
aegis | forward | no | Horizon | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
aegis | forward | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
aegis | forward | no | Horizon | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
aegis | forward | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
aegis | forward | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
aegis | forward | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
aegis | forward | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
aegis | forward | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
aegis | forward-alt | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
aegis | forward-alt | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
aegis | forward-alt | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
aegis | forward-alt | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
aegis | forward-alt | no | Horizon | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
aegis | forward-alt | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
aegis | forward-alt | no | Horizon | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
aegis | forward-alt | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
aegis | forward-alt | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
aegis | forward-alt | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
aegis | forward-alt | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
aegis | forward-alt | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
aegis | forward-stock | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
aegis | forward-stock | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
aegis | forward-stock | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
aegis | forward-stock | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
aegis | forward-stock | no | Horizon | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
aegis | forward-stock | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
aegis | forward-stock | no | Horizon | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
aegis | forward-stock | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
aegis | forward-stock | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
aegis | forward-stock | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
aegis | forward-stock | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
aegis | forward-stock | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
rei | strike1 | no | Horizon | 1.5 | up | 0, 1
rei | strike1 | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6
rei | strike1 | no | Horizon | 1.5 | down | 0, 1
rei | strike1 | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6
rei | strike1 | no | Horizon | 2 | up | none
rei | strike1 | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6
rei | strike1 | no | Horizon | 2 | down | none
rei | strike1 | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6
rei | strike1 | no | Horizon | 3 | up | none
rei | strike1 | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6
rei | strike1 | no | Horizon | 3 | down | none
rei | strike1 | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6
rei | strike2 | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5
rei | strike2 | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
rei | strike2 | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5
rei | strike2 | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
rei | strike2 | no | Horizon | 2 | up | none
rei | strike2 | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
rei | strike2 | no | Horizon | 2 | down | none
rei | strike2 | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
rei | strike2 | no | Horizon | 3 | up | none
rei | strike2 | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
rei | strike2 | no | Horizon | 3 | down | none
rei | strike2 | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
rei | strike3 | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
rei | strike3 | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
rei | strike3 | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
rei | strike3 | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
rei | strike3 | no | Horizon | 2 | up | none
rei | strike3 | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
rei | strike3 | no | Horizon | 2 | down | none
rei | strike3 | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
rei | strike3 | no | Horizon | 3 | up | none
rei | strike3 | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
rei | strike3 | no | Horizon | 3 | down | none
rei | strike3 | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
rei | launch | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
rei | launch | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
rei | launch | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
rei | launch | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
rei | launch | no | Horizon | 2 | up | none
rei | launch | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
rei | launch | no | Horizon | 2 | down | none
rei | launch | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
rei | launch | no | Horizon | 3 | up | none
rei | launch | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
rei | launch | no | Horizon | 3 | down | none
rei | launch | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
rei | capture | no | Horizon | 1.5 | up | none
rei | capture | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
rei | capture | no | Horizon | 1.5 | down | none
rei | capture | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
rei | capture | no | Horizon | 2 | up | none
rei | capture | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
rei | capture | no | Horizon | 2 | down | none
rei | capture | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
rei | capture | no | Horizon | 3 | up | none
rei | capture | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
rei | capture | no | Horizon | 3 | down | none
rei | capture | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
rei | technique | yes | Horizon | 1.5 | up | none
rei | technique | yes | linear | 1.5 | up | none
rei | technique | yes | Horizon | 1.5 | down | none
rei | technique | yes | linear | 1.5 | down | none
rei | technique | yes | Horizon | 2 | up | none
rei | technique | yes | linear | 2 | up | none
rei | technique | yes | Horizon | 2 | down | none
rei | technique | yes | linear | 2 | down | none
rei | technique | yes | Horizon | 3 | up | none
rei | technique | yes | linear | 3 | up | none
rei | technique | yes | Horizon | 3 | down | none
rei | technique | yes | linear | 3 | down | none
rei | technique-alt | yes | Horizon | 1.5 | up | none
rei | technique-alt | yes | linear | 1.5 | up | none
rei | technique-alt | yes | Horizon | 1.5 | down | none
rei | technique-alt | yes | linear | 1.5 | down | none
rei | technique-alt | yes | Horizon | 2 | up | none
rei | technique-alt | yes | linear | 2 | up | none
rei | technique-alt | yes | Horizon | 2 | down | none
rei | technique-alt | yes | linear | 2 | down | none
rei | technique-alt | yes | Horizon | 3 | up | none
rei | technique-alt | yes | linear | 3 | up | none
rei | technique-alt | yes | Horizon | 3 | down | none
rei | technique-alt | yes | linear | 3 | down | none
rei | forward | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
rei | forward | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
rei | forward | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
rei | forward | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
rei | forward | no | Horizon | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
rei | forward | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
rei | forward | no | Horizon | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
rei | forward | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
rei | forward | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
rei | forward | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
rei | forward | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
rei | forward | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
rei | forward-alt | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
rei | forward-alt | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
rei | forward-alt | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
rei | forward-alt | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
rei | forward-alt | no | Horizon | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
rei | forward-alt | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
rei | forward-alt | no | Horizon | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
rei | forward-alt | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
rei | forward-alt | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
rei | forward-alt | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
rei | forward-alt | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
rei | forward-alt | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
rei | forward-stock | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
rei | forward-stock | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
rei | forward-stock | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
rei | forward-stock | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
rei | forward-stock | no | Horizon | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
rei | forward-stock | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
rei | forward-stock | no | Horizon | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
rei | forward-stock | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
rei | forward-stock | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
rei | forward-stock | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
rei | forward-stock | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
rei | forward-stock | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
tala | strike1 | no | Horizon | 1.5 | up | 0
tala | strike1 | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5
tala | strike1 | no | Horizon | 1.5 | down | 0
tala | strike1 | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5
tala | strike1 | no | Horizon | 2 | up | none
tala | strike1 | no | linear | 2 | up | 0, 1, 2, 3, 4, 5
tala | strike1 | no | Horizon | 2 | down | none
tala | strike1 | no | linear | 2 | down | 0, 1, 2, 3, 4, 5
tala | strike1 | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | strike1 | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | strike1 | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | strike1 | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | strike2 | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4
tala | strike2 | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | strike2 | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4
tala | strike2 | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | strike2 | no | Horizon | 2 | up | none
tala | strike2 | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | strike2 | no | Horizon | 2 | down | none
tala | strike2 | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | strike2 | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | strike2 | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | strike2 | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | strike2 | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | strike3 | yes | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | strike3 | yes | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | strike3 | yes | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | strike3 | yes | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | strike3 | yes | Horizon | 2 | up | none
tala | strike3 | yes | linear | 2 | up | none
tala | strike3 | yes | Horizon | 2 | down | none
tala | strike3 | yes | linear | 2 | down | none
tala | strike3 | yes | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
tala | strike3 | yes | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
tala | strike3 | yes | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
tala | strike3 | yes | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
tala | launch | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | launch | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | launch | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | launch | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | launch | no | Horizon | 2 | up | none
tala | launch | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | launch | no | Horizon | 2 | down | none
tala | launch | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | launch | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
tala | launch | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
tala | launch | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
tala | launch | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
tala | capture | no | Horizon | 1.5 | up | none
tala | capture | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | capture | no | Horizon | 1.5 | down | none
tala | capture | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | capture | no | Horizon | 2 | up | none
tala | capture | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | capture | no | Horizon | 2 | down | none
tala | capture | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | capture | no | Horizon | 3 | up | none
tala | capture | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | capture | no | Horizon | 3 | down | none
tala | capture | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | technique | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | technique | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | technique | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | technique | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | technique | no | Horizon | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7
tala | technique | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | technique | no | Horizon | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7
tala | technique | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | technique | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
tala | technique | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
tala | technique | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
tala | technique | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
tala | technique-alt | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | technique-alt | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | technique-alt | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
tala | technique-alt | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | technique-alt | no | Horizon | 2 | up | none
tala | technique-alt | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | technique-alt | no | Horizon | 2 | down | none
tala | technique-alt | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | technique-alt | no | Horizon | 3 | up | none
tala | technique-alt | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
tala | technique-alt | no | Horizon | 3 | down | none
tala | technique-alt | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
tala | forward | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
tala | forward | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | forward | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
tala | forward | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | forward | no | Horizon | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | forward | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | forward | no | Horizon | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | forward | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | forward | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
tala | forward | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
tala | forward | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
tala | forward | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
tala | forward-alt | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
tala | forward-alt | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | forward-alt | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
tala | forward-alt | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | forward-alt | no | Horizon | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | forward-alt | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | forward-alt | no | Horizon | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | forward-alt | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | forward-alt | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
tala | forward-alt | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
tala | forward-alt | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
tala | forward-alt | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
tala | forward-stock | no | Horizon | 1.5 | up | none
tala | forward-stock | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | forward-stock | no | Horizon | 1.5 | down | none
tala | forward-stock | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | forward-stock | no | Horizon | 2 | up | none
tala | forward-stock | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | forward-stock | no | Horizon | 2 | down | none
tala | forward-stock | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
tala | forward-stock | no | Horizon | 3 | up | none
tala | forward-stock | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
tala | forward-stock | no | Horizon | 3 | down | none
tala | forward-stock | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
morrow | strike1 | no | Horizon | 1.5 | up | 0, 1, 2
morrow | strike1 | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7
morrow | strike1 | no | Horizon | 1.5 | down | 0, 1, 2
morrow | strike1 | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7
morrow | strike1 | no | Horizon | 2 | up | none
morrow | strike1 | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7
morrow | strike1 | no | Horizon | 2 | down | none
morrow | strike1 | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7
morrow | strike1 | no | Horizon | 3 | up | none
morrow | strike1 | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7
morrow | strike1 | no | Horizon | 3 | down | none
morrow | strike1 | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7
morrow | strike2 | yes | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7
morrow | strike2 | yes | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7
morrow | strike2 | yes | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7
morrow | strike2 | yes | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7
morrow | strike2 | yes | Horizon | 2 | up | none
morrow | strike2 | yes | linear | 2 | up | none
morrow | strike2 | yes | Horizon | 2 | down | none
morrow | strike2 | yes | linear | 2 | down | none
morrow | strike2 | yes | Horizon | 3 | up | none
morrow | strike2 | yes | linear | 3 | up | none
morrow | strike2 | yes | Horizon | 3 | down | none
morrow | strike2 | yes | linear | 3 | down | none
morrow | strike3 | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
morrow | strike3 | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
morrow | strike3 | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
morrow | strike3 | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
morrow | strike3 | no | Horizon | 2 | up | none
morrow | strike3 | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
morrow | strike3 | no | Horizon | 2 | down | none
morrow | strike3 | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
morrow | strike3 | no | Horizon | 3 | up | none
morrow | strike3 | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
morrow | strike3 | no | Horizon | 3 | down | none
morrow | strike3 | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
morrow | launch | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
morrow | launch | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
morrow | launch | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
morrow | launch | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
morrow | launch | no | Horizon | 2 | up | none
morrow | launch | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
morrow | launch | no | Horizon | 2 | down | none
morrow | launch | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
morrow | launch | no | Horizon | 3 | up | none
morrow | launch | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
morrow | launch | no | Horizon | 3 | down | none
morrow | launch | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
morrow | capture | no | Horizon | 1.5 | up | none
morrow | capture | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
morrow | capture | no | Horizon | 1.5 | down | none
morrow | capture | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
morrow | capture | no | Horizon | 2 | up | none
morrow | capture | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
morrow | capture | no | Horizon | 2 | down | none
morrow | capture | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
morrow | capture | no | Horizon | 3 | up | none
morrow | capture | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
morrow | capture | no | Horizon | 3 | down | none
morrow | capture | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
morrow | technique | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
morrow | technique | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
morrow | technique | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
morrow | technique | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
morrow | technique | no | Horizon | 2 | up | none
morrow | technique | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
morrow | technique | no | Horizon | 2 | down | none
morrow | technique | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
morrow | technique | no | Horizon | 3 | up | none
morrow | technique | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
morrow | technique | no | Horizon | 3 | down | none
morrow | technique | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
morrow | technique-alt | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
morrow | technique-alt | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
morrow | technique-alt | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
morrow | technique-alt | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
morrow | technique-alt | no | Horizon | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
morrow | technique-alt | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
morrow | technique-alt | no | Horizon | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
morrow | technique-alt | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
morrow | technique-alt | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
morrow | technique-alt | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
morrow | technique-alt | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
morrow | technique-alt | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
morrow | forward | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
morrow | forward | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
morrow | forward | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
morrow | forward | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
morrow | forward | no | Horizon | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
morrow | forward | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
morrow | forward | no | Horizon | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
morrow | forward | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
morrow | forward | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24
morrow | forward | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24
morrow | forward | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24
morrow | forward | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24
morrow | forward-alt | yes | Horizon | 1.5 | up | none
morrow | forward-alt | yes | linear | 1.5 | up | none
morrow | forward-alt | yes | Horizon | 1.5 | down | none
morrow | forward-alt | yes | linear | 1.5 | down | none
morrow | forward-alt | yes | Horizon | 2 | up | none
morrow | forward-alt | yes | linear | 2 | up | none
morrow | forward-alt | yes | Horizon | 2 | down | none
morrow | forward-alt | yes | linear | 2 | down | none
morrow | forward-alt | yes | Horizon | 3 | up | none
morrow | forward-alt | yes | linear | 3 | up | none
morrow | forward-alt | yes | Horizon | 3 | down | none
morrow | forward-alt | yes | linear | 3 | down | none
morrow | forward-stock | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
morrow | forward-stock | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
morrow | forward-stock | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
morrow | forward-stock | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
morrow | forward-stock | no | Horizon | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
morrow | forward-stock | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
morrow | forward-stock | no | Horizon | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
morrow | forward-stock | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
morrow | forward-stock | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
morrow | forward-stock | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
morrow | forward-stock | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
morrow | forward-stock | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19
sol | strike1 | no | Horizon | 1.5 | up | 0, 1
sol | strike1 | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6
sol | strike1 | no | Horizon | 1.5 | down | 0, 1
sol | strike1 | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6
sol | strike1 | no | Horizon | 2 | up | none
sol | strike1 | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6
sol | strike1 | no | Horizon | 2 | down | none
sol | strike1 | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6
sol | strike1 | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
sol | strike1 | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
sol | strike1 | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
sol | strike1 | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
sol | strike2 | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5
sol | strike2 | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
sol | strike2 | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5
sol | strike2 | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
sol | strike2 | no | Horizon | 2 | up | none
sol | strike2 | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
sol | strike2 | no | Horizon | 2 | down | none
sol | strike2 | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
sol | strike2 | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
sol | strike2 | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
sol | strike2 | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
sol | strike2 | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
sol | strike3 | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
sol | strike3 | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
sol | strike3 | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
sol | strike3 | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
sol | strike3 | no | Horizon | 2 | up | none
sol | strike3 | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
sol | strike3 | no | Horizon | 2 | down | none
sol | strike3 | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
sol | strike3 | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
sol | strike3 | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
sol | strike3 | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
sol | strike3 | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
sol | launch | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
sol | launch | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
sol | launch | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
sol | launch | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
sol | launch | no | Horizon | 2 | up | none
sol | launch | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
sol | launch | no | Horizon | 2 | down | none
sol | launch | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
sol | launch | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
sol | launch | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
sol | launch | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
sol | launch | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
sol | capture | no | Horizon | 1.5 | up | none
sol | capture | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
sol | capture | no | Horizon | 1.5 | down | none
sol | capture | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
sol | capture | no | Horizon | 2 | up | none
sol | capture | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
sol | capture | no | Horizon | 2 | down | none
sol | capture | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
sol | capture | no | Horizon | 3 | up | none
sol | capture | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
sol | capture | no | Horizon | 3 | down | none
sol | capture | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
sol | technique | yes | Horizon | 1.5 | up | none
sol | technique | yes | linear | 1.5 | up | none
sol | technique | yes | Horizon | 1.5 | down | none
sol | technique | yes | linear | 1.5 | down | none
sol | technique | yes | Horizon | 2 | up | none
sol | technique | yes | linear | 2 | up | none
sol | technique | yes | Horizon | 2 | down | none
sol | technique | yes | linear | 2 | down | none
sol | technique | yes | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
sol | technique | yes | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
sol | technique | yes | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
sol | technique | yes | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
sol | technique-alt | yes | Horizon | 1.5 | up | none
sol | technique-alt | yes | linear | 1.5 | up | none
sol | technique-alt | yes | Horizon | 1.5 | down | none
sol | technique-alt | yes | linear | 1.5 | down | none
sol | technique-alt | yes | Horizon | 2 | up | none
sol | technique-alt | yes | linear | 2 | up | none
sol | technique-alt | yes | Horizon | 2 | down | none
sol | technique-alt | yes | linear | 2 | down | none
sol | technique-alt | yes | Horizon | 3 | up | none
sol | technique-alt | yes | linear | 3 | up | none
sol | technique-alt | yes | Horizon | 3 | down | none
sol | technique-alt | yes | linear | 3 | down | none
sol | forward | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
sol | forward | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
sol | forward | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
sol | forward | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
sol | forward | no | Horizon | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
sol | forward | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
sol | forward | no | Horizon | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
sol | forward | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
sol | forward | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
sol | forward | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
sol | forward | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
sol | forward | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
sol | forward-alt | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
sol | forward-alt | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
sol | forward-alt | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
sol | forward-alt | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
sol | forward-alt | no | Horizon | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
sol | forward-alt | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
sol | forward-alt | no | Horizon | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
sol | forward-alt | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
sol | forward-alt | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
sol | forward-alt | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
sol | forward-alt | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
sol | forward-alt | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
vesper | strike1 | no | Horizon | 1.5 | up | 0, 1
vesper | strike1 | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6
vesper | strike1 | no | Horizon | 1.5 | down | 0, 1
vesper | strike1 | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6
vesper | strike1 | no | Horizon | 2 | up | none
vesper | strike1 | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6
vesper | strike1 | no | Horizon | 2 | down | none
vesper | strike1 | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6
vesper | strike1 | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
vesper | strike1 | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
vesper | strike1 | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
vesper | strike1 | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10
vesper | strike2 | yes | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5
vesper | strike2 | yes | linear | 1.5 | up | 0, 1, 2, 3, 4, 5
vesper | strike2 | yes | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5
vesper | strike2 | yes | linear | 1.5 | down | 0, 1, 2, 3, 4, 5
vesper | strike2 | yes | Horizon | 2 | up | none
vesper | strike2 | yes | linear | 2 | up | none
vesper | strike2 | yes | Horizon | 2 | down | none
vesper | strike2 | yes | linear | 2 | down | none
vesper | strike2 | yes | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
vesper | strike2 | yes | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
vesper | strike2 | yes | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
vesper | strike2 | yes | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
vesper | strike3 | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
vesper | strike3 | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
vesper | strike3 | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12
vesper | strike3 | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
vesper | strike3 | no | Horizon | 2 | up | none
vesper | strike3 | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
vesper | strike3 | no | Horizon | 2 | down | none
vesper | strike3 | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16
vesper | strike3 | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
vesper | strike3 | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
vesper | strike3 | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
vesper | strike3 | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21
vesper | launch | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
vesper | launch | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
vesper | launch | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11
vesper | launch | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
vesper | launch | no | Horizon | 2 | up | none
vesper | launch | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
vesper | launch | no | Horizon | 2 | down | none
vesper | launch | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
vesper | launch | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
vesper | launch | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
vesper | launch | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
vesper | launch | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
vesper | capture | no | Horizon | 1.5 | up | none
vesper | capture | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
vesper | capture | no | Horizon | 1.5 | down | none
vesper | capture | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
vesper | capture | no | Horizon | 2 | up | none
vesper | capture | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
vesper | capture | no | Horizon | 2 | down | none
vesper | capture | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
vesper | capture | no | Horizon | 3 | up | none
vesper | capture | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
vesper | capture | no | Horizon | 3 | down | none
vesper | capture | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
vesper | technique | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8
vesper | technique | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8
vesper | technique | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8
vesper | technique | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8
vesper | technique | no | Horizon | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
vesper | technique | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
vesper | technique | no | Horizon | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
vesper | technique | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9
vesper | technique | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
vesper | technique | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
vesper | technique | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
vesper | technique | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17
vesper | technique-alt | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7
vesper | technique-alt | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7
vesper | technique-alt | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7
vesper | technique-alt | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7
vesper | technique-alt | no | Horizon | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8
vesper | technique-alt | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8
vesper | technique-alt | no | Horizon | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8
vesper | technique-alt | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8
vesper | technique-alt | no | Horizon | 3 | up | none
vesper | technique-alt | no | linear | 3 | up | none
vesper | technique-alt | no | Horizon | 3 | down | none
vesper | technique-alt | no | linear | 3 | down | none
vesper | forward | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
vesper | forward | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
vesper | forward | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
vesper | forward | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
vesper | forward | no | Horizon | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
vesper | forward | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
vesper | forward | no | Horizon | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
vesper | forward | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
vesper | forward | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
vesper | forward | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
vesper | forward | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
vesper | forward | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20
vesper | forward-alt | no | Horizon | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
vesper | forward-alt | no | linear | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
vesper | forward-alt | no | Horizon | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13
vesper | forward-alt | no | linear | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14
vesper | forward-alt | no | Horizon | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
vesper | forward-alt | no | linear | 2 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
vesper | forward-alt | no | Horizon | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
vesper | forward-alt | no | linear | 2 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15
vesper | forward-alt | no | Horizon | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
vesper | forward-alt | no | linear | 3 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
vesper | forward-alt | no | Horizon | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18
vesper | forward-alt | no | linear | 3 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18

## Verification and visual handoff

- Full suite: **728 tests passed**, 103 files, zero failures/cancellations (`node scripts/run-tests.mjs`). This includes the unchanged default simulation fingerprint, default observed/unobserved tick equality, preview observer equality, narrow-path boundary checks, tracking contact, close-grab escape, delayed neutral bot attacks and real recovery punishment.
- Fixture archive: **12,852** attempts, 58 isolated move variants, six fighters, both directions, gaps 1.5/2/3, every startup offset, Horizon and linear. `fixtures.json.gz` retains individual damage/contact outcomes; `fixture-summary.json` lists all escape offsets.
- Local Chromium keyboard checks cover no switch, Horizon, linear, and linear + heavy Morrow. They select Morrow/training and verify actual 14f/1.8-unit sidesteps. These input checks stub rendering to control simulation time. Separate captures load the real graphic rigs and renderer; no model or animator files changed.
- `browser.json` records all four input queries, all 12 real-render captures, model status, HP and cinematic state, with no page errors. `comparison-sheet.jpg` puts Horizon on the left and linear on the right. Each picture advances 20 input ticks; hitstop means the simulation tick is not always 20 (the jab hit freezes at tick 11, the sweep at 16). The images are not aligned by identical animation time.

| Captures | What I checked | Remaining weakness |
| --- | --- | --- |
| `jab-*-side-*.jpg`, `jab-*-lock-*.jpg` | Horizon loses 7.44 HP; linear remains at 100. Both real rigs load. | Lock-on foreshortening makes the sideways separation hard to see; the run pose is not a clear fighting shuffle. |
| `sweep-*-side-*.jpg`, `sweep-*-lock-*.jpg` | Returning Sweep hits in both rulesets. Its wide sword pose differs from the jab. | One contact image cannot establish the readability of the sweep wind-up. At 1.5 units, sufficiently early steps can still clear this finite cone. |
| `capture-*-side-*.jpg`, `capture-*-lock-*.jpg` | Horizon enters capture and displays the capture ring; linear stays free with no cinematic. | The unchanged grab pose and camera do not explain the exact collision width to a player. |

I inspected the full comparison sheet. The collision distinction is verified; animation readability is **awaiting Adam’s normal-speed verdict**. Claude owns the shuffle and horizontal-swing presentation. The fixed startup aim can disagree with the visual impression of a broad sword pose; this simulation task does not replace that animation handoff.

Play locally (project-root server on **4210**, separate from Claude’s server):
- [Linear attacks](http://localhost:4210/dist/index.html?move=v2&arena=ring&burst=v2&step=linear)
- [Linear + heavy 15f Morrow jab](http://localhost:4210/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&morrow=jab15heavy)
- [Results dashboard](http://localhost:4210/dist/linear-lab.html)

If the server stops: `python3 -m http.server 4210 --bind 127.0.0.1 --directory /Users/adamwilliams/rift-worktrees/sidestep-linear`.

No gameplay merge or deployment to default/main. The shared board is the only main-branch update.

### Final cloud run and data audit

[GitHub checks, run 41147503306](https://github.com/Tusingw29/rift-duel/actions/runs/41147503306) passed all three jobs: 10f study, 15f study and verification (full tests, fixtures and real-render browser captures), on measured commit `e06dcea`. `cloud-browser.json` records the independent cloud capture checks.

`art/skill-lab/2026-10-30-sidestep-linear/audit.json` verifies all 12,960 completed bouts, every measured source hash, counter bounds, and exact reproduction of all 2,880 archived Horizon baseline bouts. The initial run is retained under `initial-9f6c94c/`: its tracking-instance counter missed six interrupted-contact rows. The final rerun fixes that counter; every outcome and every other telemetry field is identical. The earlier cancelled run `41146956544` was not used for conclusions.

Dashboard browser checks pass at 1200px and 390px widths: both delays, all four policy selections, all result tables, no page errors and no body overflow. Wide tables scroll within their containers on phones. The reviewed captures are listed in `dashboard-browser.json`.
