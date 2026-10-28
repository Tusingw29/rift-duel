# SKILL-BOTS review

Measurement only. No game rules, fighter values, move data, animation or hitboxes changed. Original files under art/skill-lab/2026-10-28 are retained unchanged.

## Findings

- Default mirrored 15f: original three policies **52/216 (24.1%)**, up from **20/216 (9.3%)**. Timer improves **11/72 → 25/72**. Punisher **33/72**, matching Claude’s supplied reference at this delay.
- Default quick punisher: **35/36 at 6f**, **32/36 at 10f** (one draw), **13/36 at 15f**. Quick samples are not the mirrored 72-bout reference.
- Capture is the top single masher damage source in punisher losses in every new delay/mode sample. Mirrored 15f shares: **default 22.4%, rules 28.8%, proposed 30.3%**. This is a finding, not an approved grab change.
- Spacer and turtle remain **untrusted** in the mirrored runs across all modes. Their counts remain in view. The aggregate is retained for comparison, not endorsed as a model of human skill.

## Delay sweep

Original skilled aggregate is always spacer + timer + reader. Punisher is separate. Quick uses alternating seats, 36 fighter pairings per policy matchup; mirrored uses both seats, 72. All use seed 1. Old data only exists at 15f; no invented old 6f/10f baseline.

Run | Mode | Original three vs masher | Timer vs masher | Punisher vs masher
--- | --- | --- | --- | ---
old quick (15f) | default | 10.2% (11/108) | 19.4% (7/36) | not run
old quick (15f) | proposed | 10.2% (11/108) | 19.4% (7/36) | not run
old quick (15f) | rules | 10.2% (11/108) | 19.4% (7/36) | not run
old mirrored (15f) | default | 9.3% (20/216) | 15.3% (11/72) | not run
old mirrored (15f) | proposed | 9.3% (20/216) | 18.1% (13/72) | not run
old mirrored (15f) | rules | 8.8% (19/216) | 15.3% (11/72) | not run
quick-6 | default | 97.2% (105/108) | 97.2% (35/36) | 97.2% (35/36)
quick-6 | proposed | 84.3% (91/108) | 88.9% (32/36) | 88.9% (32/36)
quick-6 | rules | 88.0% (95/108) | 91.7% (33/36) | 88.9% (32/36)
quick-10 | default | 66.7% (72/108) | 75.0% (27/36) | 88.9% (32/36)
quick-10 | proposed | 63.0% (68/108) | 69.4% (25/36) | 77.8% (28/36)
quick-10 | rules | 66.7% (72/108) | 80.6% (29/36) | 80.6% (29/36)
quick-15 | default | 20.4% (22/108) | 25.0% (9/36) | 36.1% (13/36)
quick-15 | proposed | 19.4% (21/108) | 27.8% (10/36) | 36.1% (13/36)
quick-15 | rules | 17.6% (19/108) | 25.0% (9/36) | 36.1% (13/36)
full-15 | default | 24.1% (52/216) | 34.7% (25/72) | 45.8% (33/72)
full-15 | proposed | 20.8% (45/216) | 30.6% (22/72) | 37.5% (27/72)
full-15 | rules | 20.4% (44/216) | 30.6% (22/72) | 38.9% (28/72)

## Capture share of masher damage

Shares use actual HP damage (including chip) as denominator, not move counts. The existing system-capture-close- source bucket groups cinematic captures; the name alone does not prove close-range context. “Punisher losses” excludes draws and punisher wins. All-masher totals in new runs include the extra punisher opponent, so compare the fixed original-three column for the same opponent population.

Run | Mode | Against original three | Against punisher | In punisher losses
--- | --- | --- | --- | ---
old quick (15f) | default | 18.4% (1949.6/10610.2 HP; 108 bouts) | not run | not run
old quick (15f) | proposed | 18.8% (1992.2/10621.7 HP; 108 bouts) | not run | not run
old quick (15f) | rules | 18.5% (1965.7/10610.2 HP; 108 bouts) | not run | not run
old mirrored (15f) | default | 18.8% (3993.6/21212.6 HP; 216 bouts) | not run | not run
old mirrored (15f) | proposed | 19.6% (4164.3/21209.7 HP; 216 bouts) | not run | not run
old mirrored (15f) | rules | 19.0% (4034.7/21258.8 HP; 216 bouts) | not run | not run
quick-6 | default | 30.4% (1266.9/4172.6 HP; 108 bouts) | 29.9% (368.2/1232.0 HP; 36 bouts) | 54.4% (54.4/100.0 HP; 1 bouts)
quick-6 | proposed | 36.5% (2104.0/5765.4 HP; 108 bouts) | 37.5% (615.2/1641.9 HP; 36 bouts) | 50.4% (201.7/400.0 HP; 4 bouts)
quick-6 | rules | 39.9% (2187.9/5487.7 HP; 108 bouts) | 38.5% (609.9/1582.6 HP; 36 bouts) | 50.4% (201.7/400.0 HP; 4 bouts)
quick-10 | default | 25.2% (1732.2/6870.4 HP; 108 bouts) | 28.9% (583.9/2020.3 HP; 36 bouts) | 42.7% (128.0/300.0 HP; 3 bouts)
quick-10 | proposed | 32.7% (2393.5/7314.9 HP; 108 bouts) | 31.9% (657.7/2060.3 HP; 36 bouts) | 35.9% (287.4/800.0 HP; 8 bouts)
quick-10 | rules | 32.5% (2348.0/7221.5 HP; 108 bouts) | 33.5% (717.4/2139.1 HP; 36 bouts) | 43.0% (258.0/600.0 HP; 6 bouts)
quick-15 | default | 22.4% (2231.4/9959.6 HP; 108 bouts) | 22.2% (681.2/3065.4 HP; 36 bouts) | 23.2% (534.2/2300.8 HP; 23 bouts)
quick-15 | proposed | 29.0% (2924.3/10075.7 HP; 108 bouts) | 27.0% (841.0/3109.9 HP; 36 bouts) | 29.0% (666.2/2300.0 HP; 23 bouts)
quick-15 | rules | 28.7% (2900.3/10103.8 HP; 108 bouts) | 26.4% (813.4/3076.0 HP; 36 bouts) | 29.1% (669.9/2300.8 HP; 23 bouts)
full-15 | default | 22.2% (4404.0/19836.5 HP; 216 bouts) | 21.1% (1214.8/5770.1 HP; 72 bouts) | 22.4% (875.0/3900.8 HP; 39 bouts)
full-15 | proposed | 28.7% (5755.3/20061.0 HP; 216 bouts) | 27.5% (1715.4/6245.1 HP; 72 bouts) | 30.3% (1361.3/4500.1 HP; 45 bouts)
full-15 | rules | 28.2% (5647.2/20051.0 HP; 216 bouts) | 25.8% (1583.0/6132.7 HP; 72 bouts) | 28.8% (1269.0/4400.8 HP; 44 bouts)

Top masher damage source in punisher losses:

Run | Mode | Source | HP
--- | --- | --- | ---
quick-6 | default | system-capture-close- | 54.4
quick-6 | proposed | system-capture-close- | 201.7
quick-6 | rules | system-capture-close- | 201.7
quick-10 | default | system-capture-close- | 128.0
quick-10 | proposed | system-capture-close- | 287.4
quick-10 | rules | system-capture-close- | 258.0
quick-15 | default | system-capture-close- | 534.2
quick-15 | proposed | system-capture-close- | 666.2
quick-15 | rules | system-capture-close- | 669.9
full-15 | default | system-capture-close- | 875.0
full-15 | proposed | system-capture-close- | 1361.3
full-15 | rules | system-capture-close- | 1269.0

## Policy validity

Shots received = unblocked projectile contacts; guarded includes ordinary and perfect blocks. Basic = strike move starts. Directional specials = forward/back/technique/capture move starts (including deliberate capture buttons); command history can also produce specials after neutral attack inputs. Punish attempts = any move started while the rival was actually in recovery immediately before that tick; this measures attempts, not successful damage or an omniscient bot read. Counts cover all opponents in that run. Old reports did not record these counters; missing is not zero.

Run | Mode | Bot | Player-bouts | Shots received / guarded | Basic / directional starts | Punish attempts
--- | --- | --- | --- | --- | --- | ---
old quick (15f) | default | masher | 216 | not recorded | not recorded | not recorded
old quick (15f) | default | random | 216 | not recorded | not recorded | not recorded
old quick (15f) | default | reader | 216 | not recorded | not recorded | not recorded
old quick (15f) | default | spacer | 216 | not recorded | not recorded | not recorded
old quick (15f) | default | timer | 216 | not recorded | not recorded | not recorded
old quick (15f) | default | turtle | 216 | not recorded | not recorded | not recorded
old quick (15f) | default | zoner | 216 | not recorded | not recorded | not recorded
old quick (15f) | proposed | masher | 216 | not recorded | not recorded | not recorded
old quick (15f) | proposed | random | 216 | not recorded | not recorded | not recorded
old quick (15f) | proposed | reader | 216 | not recorded | not recorded | not recorded
old quick (15f) | proposed | spacer | 216 | not recorded | not recorded | not recorded
old quick (15f) | proposed | timer | 216 | not recorded | not recorded | not recorded
old quick (15f) | proposed | turtle | 216 | not recorded | not recorded | not recorded
old quick (15f) | proposed | zoner | 216 | not recorded | not recorded | not recorded
old quick (15f) | rules | masher | 216 | not recorded | not recorded | not recorded
old quick (15f) | rules | random | 216 | not recorded | not recorded | not recorded
old quick (15f) | rules | reader | 216 | not recorded | not recorded | not recorded
old quick (15f) | rules | spacer | 216 | not recorded | not recorded | not recorded
old quick (15f) | rules | timer | 216 | not recorded | not recorded | not recorded
old quick (15f) | rules | turtle | 216 | not recorded | not recorded | not recorded
old quick (15f) | rules | zoner | 216 | not recorded | not recorded | not recorded
old mirrored (15f) | default | masher | 432 | not recorded | not recorded | not recorded
old mirrored (15f) | default | random | 432 | not recorded | not recorded | not recorded
old mirrored (15f) | default | reader | 432 | not recorded | not recorded | not recorded
old mirrored (15f) | default | spacer | 432 | not recorded | not recorded | not recorded
old mirrored (15f) | default | timer | 432 | not recorded | not recorded | not recorded
old mirrored (15f) | default | turtle | 432 | not recorded | not recorded | not recorded
old mirrored (15f) | default | zoner | 432 | not recorded | not recorded | not recorded
old mirrored (15f) | proposed | masher | 432 | not recorded | not recorded | not recorded
old mirrored (15f) | proposed | random | 432 | not recorded | not recorded | not recorded
old mirrored (15f) | proposed | reader | 432 | not recorded | not recorded | not recorded
old mirrored (15f) | proposed | spacer | 432 | not recorded | not recorded | not recorded
old mirrored (15f) | proposed | timer | 432 | not recorded | not recorded | not recorded
old mirrored (15f) | proposed | turtle | 432 | not recorded | not recorded | not recorded
old mirrored (15f) | proposed | zoner | 432 | not recorded | not recorded | not recorded
old mirrored (15f) | rules | masher | 432 | not recorded | not recorded | not recorded
old mirrored (15f) | rules | random | 432 | not recorded | not recorded | not recorded
old mirrored (15f) | rules | reader | 432 | not recorded | not recorded | not recorded
old mirrored (15f) | rules | spacer | 432 | not recorded | not recorded | not recorded
old mirrored (15f) | rules | timer | 432 | not recorded | not recorded | not recorded
old mirrored (15f) | rules | turtle | 432 | not recorded | not recorded | not recorded
old mirrored (15f) | rules | zoner | 432 | not recorded | not recorded | not recorded
quick-6 | default | masher | 252 | 1154 / 4 | 568 / 3561 | 827
quick-6 | default | punisher | 252 | 97 / 900 | 8620 / 0 | 223
quick-6 | default | random | 252 | 1073 / 69 | 91 / 1527 | 474
quick-6 | default | reader | 252 | 91 / 996 | 7777 / 191 | 381
quick-6 | default | spacer | 252 | 96 / 2236 | 2268 / 0 | 1145
quick-6 | default | timer | 252 | 119 / 928 | 6408 / 353 | 245
quick-6 | default | turtle | 252 | 188 / 6226 | 1310 / 0 | 369
quick-6 | default | zoner | 252 | 690 / 1028 | 45 / 2661 | 279
quick-6 | proposed | masher | 252 | 1267 / 7 | 468 / 3533 | 736
quick-6 | proposed | punisher | 252 | 113 / 969 | 8185 / 0 | 681
quick-6 | proposed | random | 252 | 1080 / 75 | 83 / 1466 | 440
quick-6 | proposed | reader | 252 | 145 / 1009 | 6729 / 187 | 720
quick-6 | proposed | spacer | 252 | 207 / 2515 | 2289 / 0 | 1312
quick-6 | proposed | timer | 252 | 156 / 1060 | 6203 / 243 | 235
quick-6 | proposed | turtle | 252 | 182 / 6074 | 1367 / 0 | 477
quick-6 | proposed | zoner | 252 | 691 / 1362 | 47 / 2647 | 333
quick-6 | rules | masher | 252 | 1288 / 6 | 480 / 3562 | 780
quick-6 | rules | punisher | 252 | 106 / 1006 | 8380 / 0 | 685
quick-6 | rules | random | 252 | 1065 / 70 | 82 / 1498 | 451
quick-6 | rules | reader | 252 | 135 / 1024 | 6688 / 183 | 719
quick-6 | rules | spacer | 252 | 143 / 2658 | 2343 / 0 | 1316
quick-6 | rules | timer | 252 | 124 / 1083 | 6119 / 232 | 217
quick-6 | rules | turtle | 252 | 192 / 6051 | 1379 / 0 | 487
quick-6 | rules | zoner | 252 | 708 / 1391 | 47 / 2603 | 317
quick-10 | default | masher | 252 | 1339 / 14 | 593 / 3703 | 725
quick-10 | default | punisher | 252 | 216 / 796 | 7008 / 0 | 376
quick-10 | default | random | 252 | 1124 / 78 | 93 / 1543 | 512
quick-10 | default | reader | 252 | 226 / 776 | 7407 / 34 | 274
quick-10 | default | spacer | 252 | 405 / 1663 | 1913 / 0 | 576
quick-10 | default | timer | 252 | 215 / 793 | 4506 / 269 | 234
quick-10 | default | turtle | 252 | 167 / 6499 | 1402 / 0 | 156
quick-10 | default | zoner | 252 | 858 / 787 | 30 / 2723 | 227
quick-10 | proposed | masher | 252 | 1415 / 21 | 526 / 3569 | 672
quick-10 | proposed | punisher | 252 | 243 / 786 | 6979 / 0 | 422
quick-10 | proposed | random | 252 | 1095 / 72 | 89 / 1486 | 482
quick-10 | proposed | reader | 252 | 204 / 872 | 7432 / 30 | 302
quick-10 | proposed | spacer | 252 | 361 / 1604 | 2172 / 0 | 806
quick-10 | proposed | timer | 252 | 245 / 810 | 4445 / 229 | 371
quick-10 | proposed | turtle | 252 | 168 / 6279 | 1359 / 0 | 117
quick-10 | proposed | zoner | 252 | 850 / 714 | 22 / 2728 | 216
quick-10 | rules | masher | 252 | 1365 / 16 | 502 / 3549 | 678
quick-10 | rules | punisher | 252 | 240 / 812 | 6893 / 0 | 389
quick-10 | rules | random | 252 | 1095 / 72 | 77 / 1476 | 471
quick-10 | rules | reader | 252 | 251 / 820 | 7465 / 24 | 315
quick-10 | rules | spacer | 252 | 400 / 1605 | 2053 / 0 | 766
quick-10 | rules | timer | 252 | 219 / 840 | 4361 / 223 | 305
quick-10 | rules | turtle | 252 | 187 / 6251 | 1357 / 0 | 112
quick-10 | rules | zoner | 252 | 897 / 712 | 27 / 2689 | 215
quick-15 | default | masher | 252 | 1032 / 7 | 447 / 3089 | 485
quick-15 | default | punisher | 252 | 550 / 768 | 4773 / 0 | 367
quick-15 | default | random | 252 | 1075 / 77 | 126 / 1484 | 467
quick-15 | default | reader | 252 | 588 / 764 | 4632 / 2 | 441
quick-15 | default | spacer | 252 | 759 / 1133 | 1582 / 0 | 476
quick-15 | default | timer | 252 | 563 / 793 | 3445 / 234 | 385
quick-15 | default | turtle | 252 | 199 / 5982 | 1420 / 0 | 445
quick-15 | default | zoner | 252 | 915 / 606 | 223 / 2295 | 235
quick-15 | proposed | masher | 252 | 1002 / 5 | 411 / 3174 | 432
quick-15 | proposed | punisher | 252 | 560 / 819 | 5022 / 0 | 513
quick-15 | proposed | random | 252 | 1046 / 72 | 124 / 1354 | 443
quick-15 | proposed | reader | 252 | 516 / 949 | 4687 / 3 | 584
quick-15 | proposed | spacer | 252 | 725 / 1230 | 1781 / 0 | 310
quick-15 | proposed | timer | 252 | 550 / 844 | 3559 / 235 | 528
quick-15 | proposed | turtle | 252 | 210 / 5850 | 1377 / 0 | 428
quick-15 | proposed | zoner | 252 | 862 / 575 | 210 / 2254 | 232
quick-15 | rules | masher | 252 | 997 / 7 | 402 / 3192 | 451
quick-15 | rules | punisher | 252 | 546 / 799 | 5028 / 0 | 524
quick-15 | rules | random | 252 | 1042 / 85 | 111 / 1400 | 453
quick-15 | rules | reader | 252 | 555 / 893 | 4714 / 6 | 570
quick-15 | rules | spacer | 252 | 717 / 1211 | 1789 / 0 | 304
quick-15 | rules | timer | 252 | 558 / 809 | 3575 / 234 | 516
quick-15 | rules | turtle | 252 | 214 / 5834 | 1379 / 0 | 423
quick-15 | rules | zoner | 252 | 914 / 586 | 217 / 2273 | 257
full-15 | default | masher | 504 | 2051 / 11 | 935 / 6329 | 957
full-15 | default | punisher | 504 | 1042 / 1520 | 9604 / 0 | 739
full-15 | default | random | 504 | 2129 / 156 | 248 / 2941 | 931
full-15 | default | reader | 504 | 1176 / 1552 | 9287 / 4 | 882
full-15 | default | spacer | 504 | 1502 / 2282 | 3151 / 0 | 945
full-15 | default | timer | 504 | 1101 / 1548 | 6909 / 468 | 778
full-15 | default | turtle | 504 | 389 / 12156 | 2865 / 0 | 900
full-15 | default | zoner | 504 | 1809 / 1306 | 442 / 4590 | 486
full-15 | proposed | masher | 504 | 2033 / 14 | 861 / 6464 | 857
full-15 | proposed | punisher | 504 | 1079 / 1750 | 10068 / 0 | 1034
full-15 | proposed | random | 504 | 2058 / 146 | 249 / 2787 | 888
full-15 | proposed | reader | 504 | 1067 / 1784 | 9391 / 6 | 1167
full-15 | proposed | spacer | 504 | 1473 / 2344 | 3549 / 0 | 623
full-15 | proposed | timer | 504 | 1077 / 1807 | 7099 / 473 | 1048
full-15 | proposed | turtle | 504 | 418 / 11758 | 2749 / 0 | 853
full-15 | proposed | zoner | 504 | 1720 / 1332 | 418 / 4511 | 475
full-15 | rules | masher | 504 | 1995 / 17 | 846 / 6512 | 883
full-15 | rules | punisher | 504 | 1050 / 1697 | 10083 / 0 | 1056
full-15 | rules | random | 504 | 2069 / 167 | 213 / 2816 | 903
full-15 | rules | reader | 504 | 1135 / 1706 | 9401 / 12 | 1140
full-15 | rules | spacer | 504 | 1424 / 2320 | 3567 / 0 | 612
full-15 | rules | timer | 504 | 1097 / 1719 | 7153 / 467 | 1037
full-15 | rules | turtle | 504 | 418 / 11800 | 2788 / 0 | 860
full-15 | rules | zoner | 504 | 1820 / 1372 | 434 / 4543 | 510

## Sanity flags

Screen: strict wins against random, 95% Wilson lower bound >50%. Correlated matchups and one seed make this a screen, not proof of human skill. Failed policies remain visible and untrusted.

Run | Mode | Untrusted policies
--- | --- | ---
old quick (15f) | default | reader (21/36), spacer (2/36), turtle (10/36)
old quick (15f) | proposed | spacer (0/36), timer (23/36), turtle (1/36)
old quick (15f) | rules | reader (21/36), spacer (2/36), turtle (2/36)
old mirrored (15f) | default | spacer (3/72), turtle (23/72)
old mirrored (15f) | proposed | spacer (1/72), turtle (5/72)
old mirrored (15f) | rules | reader (44/72), spacer (3/72), turtle (6/72)
quick-6 | default | turtle (1/36)
quick-6 | proposed | spacer (17/36), turtle (0/36)
quick-6 | rules | spacer (22/36), turtle (0/36)
quick-10 | default | spacer (10/36), turtle (2/36)
quick-10 | proposed | spacer (4/36), turtle (1/36)
quick-10 | rules | spacer (3/36), turtle (1/36)
quick-15 | default | spacer (5/36), turtle (1/36)
quick-15 | proposed | spacer (2/36), turtle (2/36)
quick-15 | rules | spacer (1/36), turtle (1/36)
full-15 | default | spacer (12/72), turtle (3/72)
full-15 | proposed | spacer (7/72), turtle (3/72)
full-15 | rules | spacer (7/72), turtle (2/72)

## Interpretation and limits

The old headline confounded bot input mistakes with balance. These runs test corrected policies, not skilled humans. The reference punisher uses only the delayed visible snapshot, nine-unit shot detection, neutral attacks and two-frame recovery taps. It retreats from a visible capture windup. Current capture timing is 13f startup / 1f active / 40f recovery for all six fighters (dist/moves.js); the close capture check is distance <3.1 (dist/combat.js). A 13-frame startup is shorter than a 15-frame observation delay; it cannot guarantee a reactive grab escape. Changing startup, grab visibility or guard rules is a separate decision for Adam. No grab change was made.

Claude’s supplied reference (not independently rerun with his exact harness): original timer 24/72 at 6f, 14/72 at 10f and 11/72 at 15f; reference punisher 33/72 after grab avoidance, 56/72 at 10f and 69/72 at 6f. Our quick runs are not mirrored and must not be compared as identical 72-bout samples.

## Verification and handoff

- **666 tests passed, 0 failed** via `PATH=/usr/local/bin:$PATH npm --script-shell=/bin/bash test` (98.7s). New tests cover deliberate directional attacks across visible scenarios, delayed projectile warning, two-frame recovery taps, exact validity counters, missing old counters and capture-share denominators. No test enforces a win rate.
- Directly executed the default simulation trace from `origin/main` in a temporary isolated directory: fingerprint `c1fc5ebc1cb77d6845830c4c67fa56d416bf079f78d16c51fac4e1b8d049071a`, matching the fixture and branch. Observed/unobserved default matches remain identical each tick across all six fighters.
- All **four original archived files** are byte-identical to the task’s starting commit. Combat, moves, fighters, commands, random and masher baseline files are unchanged in this task. All four new tournament source-hash manifests match the frozen measured code. No censored bouts.
- **15,120 new bouts**: 3,024 each at quick 6/10/15f, then 6,048 mirrored at 15f, seed 1. Runtime: 51.3 / 52.1 / 56.2 / 138.9 seconds respectively; the final run overlapped the full test suite.
- Chromium dashboard smoke passed: old/new mirrored views, all quick selectors, validity tables, old report button, theme switch and 390px layout without page overflow; no console/page errors. See `browser-smoke.json`.
- Shot counters represent damaging projectile contacts and ordinary/perfect projectile blocks (including passive defensive resolutions). Capture activation is counted separately in the capture metrics, not as a damaging projectile hit. A punish attempt is not proof of a successful punish.
- Local dashboard: http://localhost:4203/dist/skill-lab.html?study=skill-bots . If needed, restart from this worktree with `python3 -m http.server 4203 --bind 127.0.0.1`.
- Branch: `codex/skill-lab`. **Review, awaiting Adam’s verdict.** No gameplay merge or public deployment performed for this task.

To reproduce, run `node scripts/skill/tournament.mjs --quick --delay=6 --out=art/skill-lab/NEW-FOLDER/quick-6` (repeat 10/15), then `node scripts/skill/tournament.mjs --full --seeds=1 --delay=15 --out=art/skill-lab/NEW-FOLDER/full-15`. Existing report files and the original dated archive are protected against accidental overwrite. `node scripts/skill/study.mjs` rebuilds the comparison from the four saved runs; the review README includes additional human-readable verification notes.

## Captures inspected

File | What it verifies
--- | ---
[dashboard-desktop-1793194271469.jpg](dashboard-desktop-1793194271469.jpg) | Delay/mode comparison and selector.
[dashboard-comparison-1793194272025.jpg](dashboard-comparison-1793194272025.jpg) | Original and corrected mirrored headlines displayed side by side.
[dashboard-validity-1793194272340.jpg](dashboard-validity-1793194272340.jpg) | Old missing counters versus measured new counters; spacer/turtle flags remain visible.
[dashboard-phone-1793194274629.jpg](dashboard-phone-1793194274629.jpg) | Controls fit at 390px; wide data tables scroll within their panels.

I inspected the comparison, validity and phone captures. The dashboard is readable; the remaining weakness is density: full reports are long, and phone tables require horizontal scrolling. These captures verify reporting UI, not game animation or normal-speed play.
