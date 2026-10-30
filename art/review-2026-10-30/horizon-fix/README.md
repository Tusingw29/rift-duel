# HORIZON-FIX review

Last Horizon is now escapable under burst=v2, but this task does not add its visible tell. Claude owns that wind-up; whether a player can see it clearly still needs the animation handoff and normal-speed review. All six Bursts check the fixed startup aim at contact: 4.5 units, ±60°. No new invulnerability. Whiffs retain the existing 34f recovery (plus the remaining active frames).

With Burst V2, masher-controlled Morrow falls from 45.0% to 42.5% wins at 10f and 65.4% to 60.0% at 15f. Both differences could be luck. His Burst damage share drops from 13.0% to 4.9% at 10f and 11.6% to 4.7% at 15f. Resolved-contact whiffs rise from 1/83 to 44/83 and from 4/86 to 47/86 respectively. These differ from the earlier 44% CPU figure because these are different opponents and policies.

The heavy 15f jab is closest overall to skilled-Morrow baseline: 66.3% vs 71.7% at 10f, and 47.5% vs 42.5% at 15f. Jab13 yields 61.3% and 37.9%. All these baseline ranges overlap: could be luck, not demonstrated equivalence. Heavy costs more damage (19.84 HP per ordinary first hit vs 7.44) to recover the slower-startup results.

Neither skilled policy starts Burst in this tournament (zero starts for skilled Morrow). Their gains under Burst V2 therefore reflect changes to the rival’s Burst, not proof that skilled Morrow loses nothing by having his own Burst restricted. The switch applies to all six fighters. Burst share and Morrow wins are separated by controller below.

Guard already worked on legacy Burst: held guard took 12% chip, fresh perfect guard took zero. The old radial check still pulled a blocking defender into the cinematic. V2 resolves block at contact without that lock. V2 keeps 12% chip and zero perfect-guard chip; chip cannot KO. Morrow’s ordinary Burst is 33.48 damage, so held guard loses 4.0176 HP under default power.

At a 2-unit starting gap, one 1.8-unit orbiting sidestep turns only about 52°, short of the ±60° Burst cone. A 2.2-unit backdash also ends inside 4.5. At 3 units, a sufficiently early backdash escapes. These are actual step-start frames: a neutral double tap begins two frames earlier. A 15f reaction plus the double tap may miss these close/mid windows; the 4-unit fixture measures the roomier backdash window. The full table below includes point-blank side escapes and every startup-frame attempt. A dodgeable move is not guaranteed to lose to every step at every spacing.

Ring overrides 11/12 are match-local; arena=ring still defaults to radius 10. The visible boundary and every fighter clamp use the same radius. jab13 changes only startup to 13f; jab15 remains 15f with original damage. jab15heavy uses {"startup":15,"damage":16,"pushback":0.6} (damage before Morrow’s 1.24 power; hit pushback only, not block displacement).

ARENA-INPUT started the step at the second direction tap (frame 2) from a 2-unit gap, at the edge. The jab begins on the attack release (frame 1). The step was early, not simply a late reaction: its full angle is smaller than the basic strike cone (dot > .55, about ±56.6°). At shorter gaps a side step can clear that cone; see the sweep. Close grabs check radial distance <3.1 with no facing test. Circling preserves that distance, so no timing can beat a close grab by angle alone. A retreat can turn a close grab into its travelling ring, which can still catch the retreating fighter. No strike/grab rules were changed.

Morrow skilled, 10f: baseline 71.7% (172/240); 95% 65.7–77.0% → Burst V2 76.3% (183/240); 95% 70.5–81.2%; 4.6 pp, could be luck.

Morrow masher, 10f: baseline 45.0% (108/240); 95% 38.8–51.3% → Burst V2 42.5% (102/240); 95% 36.4–48.8%; -2.5 pp, could be luck.

Morrow skilled, 15f: baseline 42.5% (102/240); 95% 36.4–48.8% → Burst V2 49.6% (119/240); 95% 43.3–55.9%; 7.1 pp, could be luck.

Morrow masher, 15f: baseline 65.4% (157/240); 95% 59.2–71.1% → Burst V2 60.0% (144/240); 95% 53.7–66.0%; -5.4 pp, could be luck.

Skilled Morrow 10f, ring-jab13: 61.3% (147/240); 95% 55.0–67.2% vs baseline 71.7% (172/240); 95% 65.7–77.0%; -10.4 pp, could be luck.

Skilled Morrow 10f, ring-jab15heavy: 66.3% (159/240); 95% 60.1–71.9% vs baseline 71.7% (172/240); 95% 65.7–77.0%; -5.4 pp, could be luck.

Skilled Morrow 15f, ring-jab13: 37.9% (91/240); 95% 31.7–44.6% vs baseline 42.5% (102/240); 95% 36.4–48.8%; -4.6 pp, could be luck.

Skilled Morrow 15f, ring-jab15heavy: 47.5% (114/240); 95% 39.2–55.4% vs baseline 42.5% (102/240); 95% 36.4–48.8%; 5.0 pp, could be luck.

14400 bouts; 0 censored. Sum of measured mode runtime 80.0 seconds.

Heavy pilot choice was fixed before the five-seed run: 16 base damage / 0.6 pushback (19.84 HP with Morrow power), up from 6 / 0.5. At seeds 1–2 it produced 67.7% / 43.8% skilled-Morrow wins vs baseline 71.9% / 43.8%. The 20 / 0.8 candidate was slightly closer overall but needed more damage; we chose the smaller increase among near-baseline candidates. This is a substantial first-hit buff and remains an opt-in slow-heavy experiment.

14,400 bouts: five modes × two delays × two skilled policies × two mashers × 36 fighter pairs × five seeds × mirrored seats. Existing policies unchanged; they are not taught a new Burst dodge. Stepper only initiates its backdash reaction to strikes, captures and launchers. These tournament results measure existing policy behavior, not optimal human Burst defence.

95% ranges envelope Wilson and 2,000 fighter-pair/seed bootstrap resamples, keeping mirrored seats/policies paired. Overlapping ranges are labeled could be luck, not proof of equality. Individual Morrow matchups have only five seed blocks. Multiple comparisons are exploratory, without multiplicity correction.

Burst whiff rate = failed contact checks / resolved contact checks, not all starts. Interrupted startups have no contact; starts and contacts are both shown. Damage share includes actual HP loss from landed Burst and chip. Guarded contacts include perfect guards. Every old result is preserved.

Edge = simulation ticks within .5 of boundary, including cinematics/stun; hitstop repeats excluded. Pinned hits = landed damage while within .05 at contact, not after knockback. This is a pressure counter, not proof of an inescapable loop.

Heavy-jab tuning is exploratory: the pilot uses seeds 1–2, which are included in the final five-seed study. Final results are not held-out confirmation. Pilot candidates and results are archived. The requested five modes isolate Burst, radius and jab; jab rows do not also enable Burst V2. The combined final balance is untested.

No default promotion, balance extraction or animation edits. Local live links use port 4207.

## Wins on both sides

Delay | Mode | Policy / opponent | Skilled wins; 95% | Masher wins; 95% | Draws
--- | --- | --- | --- | --- | ---
10 | ring | stepper/masher | 36.4% (131/360); 95% 31.6–41.7% | 63.6% (229/360); 95% 58.3–68.4% | 0
10 | ring | stepper/masher-all | 30.6% (110/360); 95% 25.8–35.6% | 69.4% (250/360); 95% 64.4–74.2% | 0
10 | ring | punisher/masher | 91.7% (330/360); 95% 88.4–94.4% | 8.3% (30/360); 95% 5.6–11.6% | 0
10 | ring | punisher/masher-all | 79.2% (285/360); 95% 74.7–83.6% | 20.8% (75/360); 95% 16.4–25.3% | 0
10 | ring | skilled/masher | 64.0% (461/720); 95% 60.5–67.5% | 36.0% (259/720); 95% 32.5–39.5% | 0
10 | ring | skilled/masher-all | 54.9% (395/720); 95% 51.2–58.6% | 45.1% (325/720); 95% 41.4–48.8% | 0
10 | ring-burst | stepper/masher | 36.4% (131/360); 95% 31.6–41.7% | 63.6% (229/360); 95% 58.3–68.4% | 0
10 | ring-burst | stepper/masher-all | 34.7% (125/360); 95% 29.7–40.3% | 65.3% (235/360); 95% 59.7–70.3% | 0
10 | ring-burst | punisher/masher | 91.7% (330/360); 95% 88.4–94.4% | 8.3% (30/360); 95% 5.6–11.6% | 0
10 | ring-burst | punisher/masher-all | 83.9% (302/360); 95% 79.7–87.8% | 16.1% (58/360); 95% 12.2–20.3% | 0
10 | ring-burst | skilled/masher | 64.0% (461/720); 95% 60.5–67.5% | 36.0% (259/720); 95% 32.5–39.5% | 0
10 | ring-burst | skilled/masher-all | 59.3% (427/720); 95% 55.7–62.9% | 40.7% (293/720); 95% 37.1–44.3% | 0
10 | ring12-burst | stepper/masher | 34.2% (123/360); 95% 29.4–39.7% | 65.8% (237/360); 95% 60.3–70.6% | 0
10 | ring12-burst | stepper/masher-all | 34.4% (124/360); 95% 29.4–40.0% | 65.6% (236/360); 95% 60.0–70.6% | 0
10 | ring12-burst | punisher/masher | 91.1% (328/360); 95% 87.7–93.9% | 8.9% (32/360); 95% 6.1–12.3% | 0
10 | ring12-burst | punisher/masher-all | 85.0% (306/360); 95% 80.9–88.9% | 15.0% (54/360); 95% 11.1–19.1% | 0
10 | ring12-burst | skilled/masher | 62.6% (451/720); 95% 59.0–66.1% | 37.4% (269/720); 95% 33.9–41.0% | 0
10 | ring12-burst | skilled/masher-all | 59.7% (430/720); 95% 56.1–63.3% | 40.3% (290/720); 95% 36.7–43.9% | 0
10 | ring-jab13 | stepper/masher | 34.7% (125/360); 95% 30.0–39.8% | 65.0% (234/360); 95% 59.9–69.7% | 1
10 | ring-jab13 | stepper/masher-all | 27.8% (100/360); 95% 23.1–32.6% | 72.2% (260/360); 95% 67.4–76.9% | 0
10 | ring-jab13 | punisher/masher | 90.8% (327/360); 95% 87.4–93.6% | 9.2% (33/360); 95% 6.4–12.6% | 0
10 | ring-jab13 | punisher/masher-all | 77.2% (278/360); 95% 72.6–81.7% | 22.8% (82/360); 95% 18.3–27.4% | 0
10 | ring-jab13 | skilled/masher | 62.8% (452/720); 95% 59.2–66.2% | 37.1% (267/720); 95% 33.6–40.7% | 1
10 | ring-jab13 | skilled/masher-all | 52.5% (378/720); 95% 48.8–56.1% | 47.5% (342/720); 95% 43.9–51.2% | 0
10 | ring-jab15heavy | stepper/masher | 32.2% (116/360); 95% 27.6–37.2% | 67.8% (244/360); 95% 62.8–72.4% | 0
10 | ring-jab15heavy | stepper/masher-all | 28.9% (104/360); 95% 24.4–33.9% | 71.1% (256/360); 95% 66.1–75.6% | 0
10 | ring-jab15heavy | punisher/masher | 89.2% (321/360); 95% 85.5–92.2% | 10.8% (39/360); 95% 7.5–14.5% | 0
10 | ring-jab15heavy | punisher/masher-all | 78.3% (282/360); 95% 73.8–83.1% | 21.7% (78/360); 95% 16.9–26.2% | 0
10 | ring-jab15heavy | skilled/masher | 60.7% (437/720); 95% 57.1–64.2% | 39.3% (283/720); 95% 35.8–42.9% | 0
10 | ring-jab15heavy | skilled/masher-all | 53.6% (386/720); 95% 50.0–57.4% | 46.4% (334/720); 95% 42.6–50.0% | 0
15 | ring | stepper/masher | 15.3% (55/360); 95% 11.7–19.4% | 84.7% (305/360); 95% 80.6–88.3% | 0
15 | ring | stepper/masher-all | 20.8% (75/360); 95% 16.4–25.3% | 79.2% (285/360); 95% 74.7–83.6% | 0
15 | ring | punisher/masher | 50.8% (183/360); 95% 45.7–56.1% | 49.2% (177/360); 95% 43.9–54.3% | 0
15 | ring | punisher/masher-all | 40.0% (144/360); 95% 34.4–45.3% | 60.0% (216/360); 95% 54.7–65.6% | 0
15 | ring | skilled/masher | 33.1% (238/720); 95% 29.7–36.6% | 66.9% (482/720); 95% 63.4–70.3% | 0
15 | ring | skilled/masher-all | 30.4% (219/720); 95% 26.9–34.0% | 69.6% (501/720); 95% 66.0–73.1% | 0
15 | ring-burst | stepper/masher | 15.3% (55/360); 95% 11.7–19.4% | 84.7% (305/360); 95% 80.6–88.3% | 0
15 | ring-burst | stepper/masher-all | 23.9% (86/360); 95% 19.4–28.6% | 76.1% (274/360); 95% 71.4–80.6% | 0
15 | ring-burst | punisher/masher | 50.8% (183/360); 95% 45.7–56.1% | 49.2% (177/360); 95% 43.9–54.3% | 0
15 | ring-burst | punisher/masher-all | 49.4% (178/360); 95% 43.9–55.0% | 50.6% (182/360); 95% 45.0–56.1% | 0
15 | ring-burst | skilled/masher | 33.1% (238/720); 95% 29.7–36.6% | 66.9% (482/720); 95% 63.4–70.3% | 0
15 | ring-burst | skilled/masher-all | 36.7% (264/720); 95% 32.9–40.3% | 63.3% (456/720); 95% 59.7–67.1% | 0
15 | ring12-burst | stepper/masher | 13.9% (50/360); 95% 10.3–17.8% | 86.1% (310/360); 95% 82.2–89.7% | 0
15 | ring12-burst | stepper/masher-all | 23.9% (86/360); 95% 19.4–28.6% | 76.1% (274/360); 95% 71.4–80.6% | 0
15 | ring12-burst | punisher/masher | 49.4% (178/360); 95% 44.3–54.7% | 50.6% (182/360); 95% 45.3–55.7% | 0
15 | ring12-burst | punisher/masher-all | 50.6% (182/360); 95% 45.3–56.1% | 49.4% (178/360); 95% 43.9–54.7% | 0
15 | ring12-burst | skilled/masher | 31.7% (228/720); 95% 28.4–35.2% | 68.3% (492/720); 95% 64.8–71.6% | 0
15 | ring12-burst | skilled/masher-all | 37.2% (268/720); 95% 33.5–40.8% | 62.8% (452/720); 95% 59.2–66.5% | 0
15 | ring-jab13 | stepper/masher | 14.2% (51/360); 95% 10.8–18.1% | 85.8% (309/360); 95% 81.9–89.2% | 0
15 | ring-jab13 | stepper/masher-all | 16.7% (60/360); 95% 12.5–20.9% | 83.3% (300/360); 95% 78.9–87.2% | 0
15 | ring-jab13 | punisher/masher | 51.4% (185/360); 95% 46.2–56.5% | 48.6% (175/360); 95% 43.5–53.8% | 0
15 | ring-jab13 | punisher/masher-all | 42.2% (152/360); 95% 36.7–47.5% | 57.8% (208/360); 95% 52.5–63.3% | 0
15 | ring-jab13 | skilled/masher | 32.8% (236/720); 95% 29.4–36.3% | 67.2% (484/720); 95% 63.7–70.6% | 0
15 | ring-jab13 | skilled/masher-all | 29.4% (212/720); 95% 26.1–33.1% | 70.6% (508/720); 95% 66.9–73.9% | 0
15 | ring-jab15heavy | stepper/masher | 16.7% (60/360); 95% 12.8–20.9% | 83.3% (300/360); 95% 79.1–87.2% | 0
15 | ring-jab15heavy | stepper/masher-all | 18.3% (66/360); 95% 14.2–22.8% | 81.7% (294/360); 95% 77.2–85.8% | 0
15 | ring-jab15heavy | punisher/masher | 48.1% (173/360); 95% 42.9–53.3% | 51.9% (187/360); 95% 46.7–57.1% | 0
15 | ring-jab15heavy | punisher/masher-all | 43.9% (158/360); 95% 38.3–49.7% | 56.1% (202/360); 95% 50.3–61.7% | 0
15 | ring-jab15heavy | skilled/masher | 32.4% (233/720); 95% 29.0–35.9% | 67.6% (487/720); 95% 64.1–71.0% | 0
15 | ring-jab15heavy | skilled/masher-all | 31.1% (224/720); 95% 27.5–35.0% | 68.9% (496/720); 95% 65.0–72.5% | 0

## Mode differences vs ring baseline

Delay | Mode | Opponent | Gain | Interpretation
--- | --- | --- | --- | ---
10 | ring-burst | masher | 0.0 pp | could be luck
10 | ring-burst | masher-all | 4.4 pp | could be luck
10 | ring12-burst | masher | -1.4 pp | could be luck
10 | ring12-burst | masher-all | 4.9 pp | could be luck
10 | ring-jab13 | masher | -1.2 pp | could be luck
10 | ring-jab13 | masher-all | -2.4 pp | could be luck
10 | ring-jab15heavy | masher | -3.3 pp | could be luck
10 | ring-jab15heavy | masher-all | -1.3 pp | could be luck
15 | ring-burst | masher | 0.0 pp | could be luck
15 | ring-burst | masher-all | 6.3 pp | could be luck
15 | ring12-burst | masher | -1.4 pp | could be luck
15 | ring12-burst | masher-all | 6.8 pp | could be luck
15 | ring-jab13 | masher | -0.3 pp | could be luck
15 | ring-jab13 | masher-all | -1.0 pp | could be luck
15 | ring-jab15heavy | masher | -0.7 pp | could be luck
15 | ring-jab15heavy | masher-all | 0.7 pp | could be luck

## Burst damage and whiffs

Delay | Mode | Fighter / controller | Starts / contacts | Whiffs / contact checks | Guarded / landed | Burst HP / all HP | Burst share
--- | --- | --- | --- | --- | --- | --- | ---
10 | ring | all/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 117256.56 | 0.0%
10 | ring | all/masher | 708 / 561 | 2 / 561 (0.4%) | 103 / 456 | 12576.78 / 102728.94 | 12.2%
10 | ring | aegis/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 19376.76 | 0.0%
10 | ring | aegis/masher | 119 / 98 | 1 / 98 (1.0%) | 19 / 78 | 2151.36 / 19030.52 | 11.3%
10 | ring | rei/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 19370.79 | 0.0%
10 | ring | rei/masher | 120 / 97 | 0 / 97 (0.0%) | 18 / 79 | 1972.19 / 16233.77 | 12.1%
10 | ring | tala/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 20729.20 | 0.0%
10 | ring | tala/masher | 119 / 94 | 0 / 94 (0.0%) | 18 / 76 | 2132.70 / 16501.36 | 12.9%
10 | ring | morrow/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 20506.88 | 0.0%
10 | ring | morrow/masher | 110 / 83 | 1 / 83 (1.2%) | 15 / 67 | 2257.80 / 17335.61 | 13.0%
10 | ring | sol/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 18540.85 | 0.0%
10 | ring | sol/masher | 120 / 95 | 0 / 95 (0.0%) | 17 / 78 | 1850.17 / 16328.30 | 11.3%
10 | ring | vesper/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 18732.09 | 0.0%
10 | ring | vesper/masher | 120 / 94 | 0 / 94 (0.0%) | 16 / 78 | 2212.56 / 17299.39 | 12.8%
10 | ring-burst | all/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 118676.21 | 0.0%
10 | ring-burst | all/masher | 708 / 561 | 273 / 561 (48.7%) | 103 / 185 | 5241.15 / 99134.85 | 5.3%
10 | ring-burst | aegis/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 19539.04 | 0.0%
10 | ring-burst | aegis/masher | 119 / 98 | 44 / 98 (44.9%) | 19 / 35 | 990.36 / 18469.49 | 5.4%
10 | ring-burst | rei/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 19346.27 | 0.0%
10 | ring-burst | rei/masher | 120 / 97 | 48 / 97 (49.5%) | 18 / 31 | 805.79 / 15683.29 | 5.1%
10 | ring-burst | tala/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 20991.52 | 0.0%
10 | ring-burst | tala/masher | 119 / 94 | 44 / 94 (46.8%) | 18 / 32 | 920.94 / 16059.16 | 5.7%
10 | ring-burst | morrow/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 21129.62 | 0.0%
10 | ring-burst | morrow/masher | 110 / 83 | 44 / 83 (53.0%) | 15 / 24 | 818.16 / 16624.24 | 4.9%
10 | ring-burst | sol/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 18744.31 | 0.0%
10 | ring-burst | sol/masher | 120 / 95 | 50 / 95 (52.6%) | 17 / 28 | 689.17 / 15637.91 | 4.4%
10 | ring-burst | vesper/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 18925.45 | 0.0%
10 | ring-burst | vesper/masher | 120 / 94 | 43 / 94 (45.7%) | 16 / 35 | 1016.73 / 16660.74 | 6.1%
10 | ring12-burst | all/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 118584.85 | 0.0%
10 | ring12-burst | all/masher | 708 / 561 | 273 / 561 (48.7%) | 103 / 185 | 5241.15 / 99496.11 | 5.3%
10 | ring12-burst | aegis/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 19506.74 | 0.0%
10 | ring12-burst | aegis/masher | 119 / 98 | 44 / 98 (44.9%) | 19 / 35 | 990.36 / 18572.16 | 5.3%
10 | ring12-burst | rei/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 19356.73 | 0.0%
10 | ring12-burst | rei/masher | 120 / 97 | 48 / 97 (49.5%) | 18 / 31 | 805.79 / 15661.05 | 5.1%
10 | ring12-burst | tala/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 20948.25 | 0.0%
10 | ring12-burst | tala/masher | 119 / 94 | 44 / 94 (46.8%) | 18 / 32 | 920.94 / 15965.73 | 5.8%
10 | ring12-burst | morrow/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 21083.55 | 0.0%
10 | ring12-burst | morrow/masher | 110 / 83 | 44 / 83 (53.0%) | 15 / 24 | 818.16 / 16696.52 | 4.9%
10 | ring12-burst | sol/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 18736.69 | 0.0%
10 | ring12-burst | sol/masher | 120 / 95 | 50 / 95 (52.6%) | 17 / 28 | 689.17 / 15846.74 | 4.3%
10 | ring12-burst | vesper/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 18952.89 | 0.0%
10 | ring12-burst | vesper/masher | 120 / 94 | 43 / 94 (45.7%) | 16 / 35 | 1016.73 / 16753.91 | 6.1%
10 | ring-jab13 | all/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 116517.63 | 0.0%
10 | ring-jab13 | all/masher | 710 / 560 | 2 / 560 (0.4%) | 101 / 456 | 12573.30 / 103952.52 | 12.1%
10 | ring-jab13 | aegis/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 19440.80 | 0.0%
10 | ring-jab13 | aegis/masher | 119 / 97 | 1 / 97 (1.0%) | 19 / 77 | 2124.36 / 19192.90 | 11.1%
10 | ring-jab13 | rei/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 19450.41 | 0.0%
10 | ring-jab13 | rei/masher | 120 / 98 | 0 / 98 (0.0%) | 18 / 79 | 1972.19 / 16259.15 | 12.1%
10 | ring-jab13 | tala/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 20688.40 | 0.0%
10 | ring-jab13 | tala/masher | 120 / 95 | 0 / 95 (0.0%) | 18 / 77 | 2160.24 / 16754.71 | 12.9%
10 | ring-jab13 | morrow/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 19597.86 | 0.0%
10 | ring-jab13 | morrow/masher | 111 / 81 | 1 / 81 (1.2%) | 13 / 67 | 2253.78 / 17342.48 | 13.0%
10 | ring-jab13 | sol/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 18643.19 | 0.0%
10 | ring-jab13 | sol/masher | 120 / 95 | 0 / 95 (0.0%) | 17 / 78 | 1850.17 / 16793.09 | 11.0%
10 | ring-jab13 | vesper/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 18696.98 | 0.0%
10 | ring-jab13 | vesper/masher | 120 / 94 | 0 / 94 (0.0%) | 16 / 78 | 2212.56 / 17610.19 | 12.6%
10 | ring-jab15heavy | all/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 116237.32 | 0.0%
10 | ring-jab15heavy | all/masher | 710 / 560 | 2 / 560 (0.4%) | 101 / 457 | 12597.60 / 103701.97 | 12.1%
10 | ring-jab15heavy | aegis/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 19306.84 | 0.0%
10 | ring-jab15heavy | aegis/masher | 119 / 97 | 1 / 97 (1.0%) | 19 / 77 | 2124.36 / 18774.06 | 11.3%
10 | ring-jab15heavy | rei/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 19222.63 | 0.0%
10 | ring-jab15heavy | rei/masher | 120 / 98 | 0 / 98 (0.0%) | 18 / 80 | 1996.49 / 15969.38 | 12.5%
10 | ring-jab15heavy | tala/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 20561.84 | 0.0%
10 | ring-jab15heavy | tala/masher | 120 / 95 | 0 / 95 (0.0%) | 18 / 77 | 2160.24 / 16728.62 | 12.9%
10 | ring-jab15heavy | morrow/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 20360.70 | 0.0%
10 | ring-jab15heavy | morrow/masher | 111 / 81 | 1 / 81 (1.2%) | 13 / 67 | 2253.78 / 18652.17 | 12.1%
10 | ring-jab15heavy | sol/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 18268.51 | 0.0%
10 | ring-jab15heavy | sol/masher | 120 / 95 | 0 / 95 (0.0%) | 17 / 78 | 1850.17 / 16345.21 | 11.3%
10 | ring-jab15heavy | vesper/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 18516.81 | 0.0%
10 | ring-jab15heavy | vesper/masher | 120 / 94 | 0 / 94 (0.0%) | 16 / 78 | 2212.56 / 17232.54 | 12.8%
15 | ring | all/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 89119.03 | 0.0%
15 | ring | all/masher | 702 / 588 | 6 / 588 (1.0%) | 90 / 490 | 13094.14 / 128128.54 | 10.2%
15 | ring | aegis/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 14533.81 | 0.0%
15 | ring | aegis/masher | 118 / 99 | 1 / 99 (1.0%) | 18 / 80 | 2139.05 / 21584.83 | 9.9%
15 | ring | rei/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 15232.20 | 0.0%
15 | ring | rei/masher | 118 / 106 | 0 / 106 (0.0%) | 19 / 87 | 2102.27 / 21156.04 | 9.9%
15 | ring | tala/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 15164.23 | 0.0%
15 | ring | tala/masher | 119 / 97 | 0 / 97 (0.0%) | 16 / 81 | 2223.64 / 21857.46 | 10.2%
15 | ring | morrow/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 17080.27 | 0.0%
15 | ring | morrow/masher | 108 / 86 | 4 / 86 (4.7%) | 7 / 73 | 2364.14 / 20362.28 | 11.6%
15 | ring | sol/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 12944.41 | 0.0%
15 | ring | sol/masher | 120 / 103 | 0 / 103 (0.0%) | 14 / 89 | 2066.58 / 21453.89 | 9.6%
15 | ring | vesper/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 14164.11 | 0.0%
15 | ring | vesper/masher | 119 / 97 | 1 / 97 (1.0%) | 16 / 80 | 2198.46 / 21714.04 | 10.1%
15 | ring-burst | all/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 93073.04 | 0.0%
15 | ring-burst | all/masher | 702 / 588 | 291 / 588 (49.5%) | 90 / 205 | 5400.22 / 125596.44 | 4.3%
15 | ring-burst | aegis/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 14891.64 | 0.0%
15 | ring-burst | aegis/masher | 118 / 99 | 48 / 99 (48.5%) | 18 / 33 | 870.05 / 21065.85 | 4.1%
15 | ring-burst | rei/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 16053.30 | 0.0%
15 | ring-burst | rei/masher | 118 / 106 | 48 / 106 (45.3%) | 19 / 39 | 935.87 / 20831.52 | 4.5%
15 | ring-burst | tala/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 16301.46 | 0.0%
15 | ring-burst | tala/masher | 119 / 97 | 45 / 97 (46.4%) | 16 / 36 | 984.34 / 21616.37 | 4.6%
15 | ring-burst | morrow/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 17772.55 | 0.0%
15 | ring-burst | morrow/masher | 108 / 86 | 47 / 86 (54.7%) | 7 / 30 | 924.50 / 19693.23 | 4.7%
15 | ring-burst | sol/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 13211.75 | 0.0%
15 | ring-burst | sol/masher | 120 / 103 | 56 / 103 (54.4%) | 14 / 33 | 766.26 / 20807.60 | 3.7%
15 | ring-burst | vesper/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 14842.34 | 0.0%
15 | ring-burst | vesper/masher | 119 / 97 | 47 / 97 (48.5%) | 16 / 34 | 919.20 / 21581.87 | 4.3%
15 | ring12-burst | all/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 92913.90 | 0.0%
15 | ring12-burst | all/masher | 702 / 588 | 291 / 588 (49.5%) | 90 / 205 | 5400.22 / 125947.39 | 4.3%
15 | ring12-burst | aegis/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 14822.10 | 0.0%
15 | ring12-burst | aegis/masher | 118 / 99 | 48 / 99 (48.5%) | 18 / 33 | 870.05 / 21113.67 | 4.1%
15 | ring12-burst | rei/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 16056.21 | 0.0%
15 | ring12-burst | rei/masher | 118 / 106 | 48 / 106 (45.3%) | 19 / 39 | 935.87 / 20850.83 | 4.5%
15 | ring12-burst | tala/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 16302.62 | 0.0%
15 | ring12-burst | tala/masher | 119 / 97 | 45 / 97 (46.4%) | 16 / 36 | 984.34 / 21638.36 | 4.5%
15 | ring12-burst | morrow/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 17771.52 | 0.0%
15 | ring12-burst | morrow/masher | 108 / 86 | 47 / 86 (54.7%) | 7 / 30 | 924.50 / 19769.25 | 4.7%
15 | ring12-burst | sol/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 13163.59 | 0.0%
15 | ring12-burst | sol/masher | 120 / 103 | 56 / 103 (54.4%) | 14 / 33 | 766.26 / 21022.98 | 3.6%
15 | ring12-burst | vesper/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 14797.86 | 0.0%
15 | ring12-burst | vesper/masher | 119 / 97 | 47 / 97 (48.5%) | 16 / 34 | 919.20 / 21552.30 | 4.3%
15 | ring-jab13 | all/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 88717.43 | 0.0%
15 | ring-jab13 | all/masher | 706 / 589 | 6 / 589 (1.0%) | 92 / 491 | 13169.32 / 128554.35 | 10.2%
15 | ring-jab13 | aegis/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 14516.13 | 0.0%
15 | ring-jab13 | aegis/masher | 120 / 100 | 1 / 100 (1.0%) | 19 / 80 | 2160.00 / 21583.23 | 10.0%
15 | ring-jab13 | rei/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 15258.94 | 0.0%
15 | ring-jab13 | rei/masher | 118 / 105 | 0 / 105 (0.0%) | 19 / 86 | 2089.80 / 21257.46 | 9.8%
15 | ring-jab13 | tala/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 15068.89 | 0.0%
15 | ring-jab13 | tala/masher | 120 / 98 | 0 / 98 (0.0%) | 16 / 82 | 2248.41 / 21940.73 | 10.2%
15 | ring-jab13 | morrow/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 16724.94 | 0.0%
15 | ring-jab13 | morrow/masher | 109 / 86 | 4 / 86 (4.7%) | 7 / 75 | 2431.10 / 20387.14 | 11.9%
15 | ring-jab13 | sol/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 12938.07 | 0.0%
15 | ring-jab13 | sol/masher | 120 / 104 | 0 / 104 (0.0%) | 15 / 89 | 2069.37 / 21628.44 | 9.6%
15 | ring-jab13 | vesper/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 14210.46 | 0.0%
15 | ring-jab13 | vesper/masher | 119 / 96 | 1 / 96 (1.0%) | 16 / 79 | 2170.65 / 21757.35 | 10.0%
15 | ring-jab15heavy | all/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 88955.50 | 0.0%
15 | ring-jab15heavy | all/masher | 703 / 586 | 6 / 586 (1.0%) | 90 / 490 | 13129.61 / 128254.17 | 10.2%
15 | ring-jab15heavy | aegis/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 14477.71 | 0.0%
15 | ring-jab15heavy | aegis/masher | 120 / 100 | 1 / 100 (1.0%) | 18 / 81 | 2187.00 / 21379.24 | 10.2%
15 | ring-jab15heavy | rei/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 15058.68 | 0.0%
15 | ring-jab15heavy | rei/masher | 117 / 105 | 0 / 105 (0.0%) | 19 / 86 | 2089.80 / 21109.59 | 9.9%
15 | ring-jab15heavy | tala/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 14841.77 | 0.0%
15 | ring-jab15heavy | tala/masher | 119 / 97 | 0 / 97 (0.0%) | 16 / 81 | 2223.64 / 21793.68 | 10.2%
15 | ring-jab15heavy | morrow/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 17607.88 | 0.0%
15 | ring-jab15heavy | morrow/masher | 108 / 84 | 4 / 84 (4.8%) | 7 / 73 | 2364.14 / 21146.57 | 11.2%
15 | ring-jab15heavy | sol/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 13054.03 | 0.0%
15 | ring-jab15heavy | sol/masher | 120 / 103 | 0 / 103 (0.0%) | 14 / 89 | 2066.58 / 21281.26 | 9.7%
15 | ring-jab15heavy | vesper/skilled | 0 / 0 | 0 / 0 (N/A) | 0 / 0 | 0.00 / 13915.43 | 0.0%
15 | ring-jab15heavy | vesper/masher | 119 / 97 | 1 / 97 (1.0%) | 16 / 80 | 2198.46 / 21543.83 | 10.2%

## Morrow wins

Delay | Mode | Controller / opponent fighter | Wins; 95%
--- | --- | --- | ---
10 | ring | skilled/all | 71.7% (172/240); 95% 65.7–77.0%
10 | ring | skilled/aegis | 60.0% (24/40); 95% 44.6–73.7%
10 | ring | skilled/rei | 70.0% (28/40); 95% 54.6–81.9%
10 | ring | skilled/tala | 72.5% (29/40); 95% 57.2–83.9%
10 | ring | skilled/morrow | 75.0% (30/40); 95% 59.8–85.8%
10 | ring | skilled/sol | 82.5% (33/40); 95% 68.0–92.5%
10 | ring | skilled/vesper | 70.0% (28/40); 95% 54.6–81.9%
10 | ring | masher/all | 45.0% (108/240); 95% 38.8–51.3%
10 | ring | masher/aegis | 42.5% (17/40); 95% 28.5–57.8%
10 | ring | masher/rei | 47.5% (19/40); 95% 32.9–62.5%
10 | ring | masher/tala | 45.0% (18/40); 95% 30.7–60.2%
10 | ring | masher/morrow | 25.0% (10/40); 95% 14.2–40.2%
10 | ring | masher/sol | 60.0% (24/40); 95% 44.6–73.7%
10 | ring | masher/vesper | 50.0% (20/40); 95% 35.2–64.8%
10 | ring-burst | skilled/all | 76.3% (183/240); 95% 70.5–81.2%
10 | ring-burst | skilled/aegis | 65.0% (26/40); 95% 49.5–77.9%
10 | ring-burst | skilled/rei | 72.5% (29/40); 95% 57.2–85.0%
10 | ring-burst | skilled/tala | 82.5% (33/40); 95% 68.0–95.0%
10 | ring-burst | skilled/morrow | 72.5% (29/40); 95% 57.2–83.9%
10 | ring-burst | skilled/sol | 92.5% (37/40); 95% 80.1–97.5%
10 | ring-burst | skilled/vesper | 72.5% (29/40); 95% 57.2–83.9%
10 | ring-burst | masher/all | 42.5% (102/240); 95% 36.4–48.8%
10 | ring-burst | masher/aegis | 42.5% (17/40); 95% 28.5–57.8%
10 | ring-burst | masher/rei | 45.0% (18/40); 95% 30.7–60.2%
10 | ring-burst | masher/tala | 42.5% (17/40); 95% 28.5–57.8%
10 | ring-burst | masher/morrow | 27.5% (11/40); 95% 16.1–42.8%
10 | ring-burst | masher/sol | 52.5% (21/40); 95% 37.5–67.1%
10 | ring-burst | masher/vesper | 45.0% (18/40); 95% 30.7–60.2%
10 | ring12-burst | skilled/all | 75.0% (180/240); 95% 69.2–80.1%
10 | ring12-burst | skilled/aegis | 65.0% (26/40); 95% 49.5–77.9%
10 | ring12-burst | skilled/rei | 70.0% (28/40); 95% 54.6–81.9%
10 | ring12-burst | skilled/tala | 82.5% (33/40); 95% 68.0–95.0%
10 | ring12-burst | skilled/morrow | 72.5% (29/40); 95% 57.2–83.9%
10 | ring12-burst | skilled/sol | 90.0% (36/40); 95% 76.9–96.0%
10 | ring12-burst | skilled/vesper | 70.0% (28/40); 95% 54.6–81.9%
10 | ring12-burst | masher/all | 43.3% (104/240); 95% 37.2–49.7%
10 | ring12-burst | masher/aegis | 42.5% (17/40); 95% 28.5–57.8%
10 | ring12-burst | masher/rei | 45.0% (18/40); 95% 30.7–60.2%
10 | ring12-burst | masher/tala | 47.5% (19/40); 95% 32.9–62.5%
10 | ring12-burst | masher/morrow | 27.5% (11/40); 95% 16.1–42.8%
10 | ring12-burst | masher/sol | 52.5% (21/40); 95% 37.5–67.1%
10 | ring12-burst | masher/vesper | 45.0% (18/40); 95% 30.7–60.2%
10 | ring-jab13 | skilled/all | 61.3% (147/240); 95% 55.0–67.2%
10 | ring-jab13 | skilled/aegis | 47.5% (19/40); 95% 32.9–62.5%
10 | ring-jab13 | skilled/rei | 57.5% (23/40); 95% 42.2–71.5%
10 | ring-jab13 | skilled/tala | 62.5% (25/40); 95% 47.0–75.8%
10 | ring-jab13 | skilled/morrow | 67.5% (27/40); 95% 52.0–79.9%
10 | ring-jab13 | skilled/sol | 75.0% (30/40); 95% 59.8–85.8%
10 | ring-jab13 | skilled/vesper | 57.5% (23/40); 95% 42.2–71.5%
10 | ring-jab13 | masher/all | 46.3% (111/240); 95% 40.1–52.6%
10 | ring-jab13 | masher/aegis | 42.5% (17/40); 95% 27.5–57.8%
10 | ring-jab13 | masher/rei | 45.0% (18/40); 95% 30.7–60.2%
10 | ring-jab13 | masher/tala | 45.0% (18/40); 95% 30.7–60.2%
10 | ring-jab13 | masher/morrow | 32.5% (13/40); 95% 20.1–48.0%
10 | ring-jab13 | masher/sol | 60.0% (24/40); 95% 44.6–73.7%
10 | ring-jab13 | masher/vesper | 52.5% (21/40); 95% 37.5–67.1%
10 | ring-jab15heavy | skilled/all | 66.3% (159/240); 95% 60.1–71.9%
10 | ring-jab15heavy | skilled/aegis | 60.0% (24/40); 95% 44.6–73.7%
10 | ring-jab15heavy | skilled/rei | 72.5% (29/40); 95% 57.2–83.9%
10 | ring-jab15heavy | skilled/tala | 60.0% (24/40); 95% 44.6–75.0%
10 | ring-jab15heavy | skilled/morrow | 65.0% (26/40); 95% 49.5–77.9%
10 | ring-jab15heavy | skilled/sol | 80.0% (32/40); 95% 65.2–90.0%
10 | ring-jab15heavy | skilled/vesper | 60.0% (24/40); 95% 44.6–73.7%
10 | ring-jab15heavy | masher/all | 55.0% (132/240); 95% 47.9–61.7%
10 | ring-jab15heavy | masher/aegis | 47.5% (19/40); 95% 30.0–65.0%
10 | ring-jab15heavy | masher/rei | 60.0% (24/40); 95% 44.6–73.7%
10 | ring-jab15heavy | masher/tala | 50.0% (20/40); 95% 35.0–65.0%
10 | ring-jab15heavy | masher/morrow | 35.0% (14/40); 95% 22.1–50.5%
10 | ring-jab15heavy | masher/sol | 75.0% (30/40); 95% 59.8–85.8%
10 | ring-jab15heavy | masher/vesper | 62.5% (25/40); 95% 47.0–75.8%
15 | ring | skilled/all | 42.5% (102/240); 95% 36.4–48.8%
15 | ring | skilled/aegis | 37.5% (15/40); 95% 24.2–53.0%
15 | ring | skilled/rei | 47.5% (19/40); 95% 32.9–62.5%
15 | ring | skilled/tala | 42.5% (17/40); 95% 22.5–62.5%
15 | ring | skilled/morrow | 52.5% (21/40); 95% 37.5–67.1%
15 | ring | skilled/sol | 47.5% (19/40); 95% 32.9–62.5%
15 | ring | skilled/vesper | 27.5% (11/40); 95% 16.1–42.8%
15 | ring | masher/all | 65.4% (157/240); 95% 59.2–71.1%
15 | ring | masher/aegis | 72.5% (29/40); 95% 57.2–83.9%
15 | ring | masher/rei | 62.5% (25/40); 95% 47.0–75.8%
15 | ring | masher/tala | 57.5% (23/40); 95% 42.2–71.5%
15 | ring | masher/morrow | 47.5% (19/40); 95% 32.9–62.5%
15 | ring | masher/sol | 80.0% (32/40); 95% 65.2–89.5%
15 | ring | masher/vesper | 72.5% (29/40); 95% 57.2–83.9%
15 | ring-burst | skilled/all | 49.6% (119/240); 95% 43.3–55.9%
15 | ring-burst | skilled/aegis | 45.0% (18/40); 95% 30.7–60.2%
15 | ring-burst | skilled/rei | 55.0% (22/40); 95% 39.8–69.3%
15 | ring-burst | skilled/tala | 47.5% (19/40); 95% 27.5–62.5%
15 | ring-burst | skilled/morrow | 60.0% (24/40); 95% 44.6–73.7%
15 | ring-burst | skilled/sol | 52.5% (21/40); 95% 37.5–67.1%
15 | ring-burst | skilled/vesper | 37.5% (15/40); 95% 24.2–53.0%
15 | ring-burst | masher/all | 60.0% (144/240); 95% 53.7–66.0%
15 | ring-burst | masher/aegis | 70.0% (28/40); 95% 54.6–81.9%
15 | ring-burst | masher/rei | 55.0% (22/40); 95% 39.8–69.3%
15 | ring-burst | masher/tala | 52.5% (21/40); 95% 37.5–67.1%
15 | ring-burst | masher/morrow | 40.0% (16/40); 95% 26.3–55.4%
15 | ring-burst | masher/sol | 75.0% (30/40); 95% 59.8–85.8%
15 | ring-burst | masher/vesper | 67.5% (27/40); 95% 52.0–79.9%
15 | ring12-burst | skilled/all | 49.6% (119/240); 95% 43.3–55.9%
15 | ring12-burst | skilled/aegis | 45.0% (18/40); 95% 30.7–60.2%
15 | ring12-burst | skilled/rei | 55.0% (22/40); 95% 39.8–69.3%
15 | ring12-burst | skilled/tala | 45.0% (18/40); 95% 27.5–60.2%
15 | ring12-burst | skilled/morrow | 62.5% (25/40); 95% 47.0–75.8%
15 | ring12-burst | skilled/sol | 52.5% (21/40); 95% 37.5–67.1%
15 | ring12-burst | skilled/vesper | 37.5% (15/40); 95% 24.2–53.0%
15 | ring12-burst | masher/all | 59.2% (142/240); 95% 52.9–65.2%
15 | ring12-burst | masher/aegis | 70.0% (28/40); 95% 54.6–81.9%
15 | ring12-burst | masher/rei | 55.0% (22/40); 95% 39.8–69.3%
15 | ring12-burst | masher/tala | 50.0% (20/40); 95% 35.2–64.8%
15 | ring12-burst | masher/morrow | 37.5% (15/40); 95% 24.2–53.0%
15 | ring12-burst | masher/sol | 75.0% (30/40); 95% 59.8–85.8%
15 | ring12-burst | masher/vesper | 67.5% (27/40); 95% 52.0–79.9%
15 | ring-jab13 | skilled/all | 37.9% (91/240); 95% 31.7–44.6%
15 | ring-jab13 | skilled/aegis | 40.0% (16/40); 95% 25.0–60.0%
15 | ring-jab13 | skilled/rei | 42.5% (17/40); 95% 25.0–60.0%
15 | ring-jab13 | skilled/tala | 37.5% (15/40); 95% 22.5–53.0%
15 | ring-jab13 | skilled/morrow | 42.5% (17/40); 95% 28.5–57.8%
15 | ring-jab13 | skilled/sol | 42.5% (17/40); 95% 27.5–57.8%
15 | ring-jab13 | skilled/vesper | 22.5% (9/40); 95% 10.0–37.5%
15 | ring-jab13 | masher/all | 66.3% (159/240); 95% 60.1–72.1%
15 | ring-jab13 | masher/aegis | 70.0% (28/40); 95% 54.6–81.9%
15 | ring-jab13 | masher/rei | 62.5% (25/40); 95% 47.0–75.8%
15 | ring-jab13 | masher/tala | 55.0% (22/40); 95% 39.8–72.5%
15 | ring-jab13 | masher/morrow | 57.5% (23/40); 95% 42.2–71.5%
15 | ring-jab13 | masher/sol | 82.5% (33/40); 95% 68.0–92.5%
15 | ring-jab13 | masher/vesper | 70.0% (28/40); 95% 54.6–81.9%
15 | ring-jab15heavy | skilled/all | 47.5% (114/240); 95% 39.2–55.4%
15 | ring-jab15heavy | skilled/aegis | 50.0% (20/40); 95% 35.0–65.0%
15 | ring-jab15heavy | skilled/rei | 50.0% (20/40); 95% 35.0–65.0%
15 | ring-jab15heavy | skilled/tala | 37.5% (15/40); 95% 17.5–55.0%
15 | ring-jab15heavy | skilled/morrow | 45.0% (18/40); 95% 20.0–72.5%
15 | ring-jab15heavy | skilled/sol | 65.0% (26/40); 95% 49.5–77.9%
15 | ring-jab15heavy | skilled/vesper | 37.5% (15/40); 95% 24.2–53.0%
15 | ring-jab15heavy | masher/all | 71.7% (172/240); 95% 64.6–77.9%
15 | ring-jab15heavy | masher/aegis | 77.5% (31/40); 95% 62.5–87.7%
15 | ring-jab15heavy | masher/rei | 72.5% (29/40); 95% 57.2–85.0%
15 | ring-jab15heavy | masher/tala | 67.5% (27/40); 95% 52.0–80.0%
15 | ring-jab15heavy | masher/morrow | 55.0% (22/40); 95% 27.5–80.0%
15 | ring-jab15heavy | masher/sol | 75.0% (30/40); 95% 59.8–85.8%
15 | ring-jab15heavy | masher/vesper | 82.5% (33/40); 95% 68.0–92.5%

## Morrow differences vs baseline

Delay | Mode | Controller | Gain | Interpretation
--- | --- | --- | --- | ---
10 | ring-burst | skilled | 4.6 pp | could be luck
10 | ring-burst | masher | -2.5 pp | could be luck
10 | ring12-burst | skilled | 3.3 pp | could be luck
10 | ring12-burst | masher | -1.7 pp | could be luck
10 | ring-jab13 | skilled | -10.4 pp | could be luck
10 | ring-jab13 | masher | 1.3 pp | could be luck
10 | ring-jab15heavy | skilled | -5.4 pp | could be luck
10 | ring-jab15heavy | masher | 10.0 pp | could be luck
15 | ring-burst | skilled | 7.1 pp | could be luck
15 | ring-burst | masher | -5.4 pp | could be luck
15 | ring12-burst | skilled | 7.1 pp | could be luck
15 | ring12-burst | masher | -6.3 pp | could be luck
15 | ring-jab13 | skilled | -4.6 pp | could be luck
15 | ring-jab13 | masher | 0.8 pp | could be luck
15 | ring-jab15heavy | skilled | 5.0 pp | could be luck
15 | ring-jab15heavy | masher | 6.3 pp | could be luck

## Boundary pressure per side

Delay | Mode | Policy / opponent | Side | Edge seconds / bout | Edge % ticks | Pinned hits / bout | Pinned blocks
--- | --- | --- | --- | --- | --- | --- | ---
10 | ring | stepper/masher | skilled | 0.00 | 0.0% | 0 / 360 (0.000) | 0
10 | ring | stepper/masher | masher | 0.91 | 7.0% | 224 / 360 (0.622) | 0
10 | ring | stepper/masher-all | skilled | 0.01 | 0.0% | 1 / 360 (0.003) | 0
10 | ring | stepper/masher-all | masher | 0.18 | 0.9% | 30 / 360 (0.083) | 0
10 | ring | punisher/masher | skilled | 0.01 | 0.1% | 0 / 360 (0.000) | 0
10 | ring | punisher/masher | masher | 1.63 | 10.4% | 320 / 360 (0.889) | 0
10 | ring | punisher/masher-all | skilled | 0.03 | 0.1% | 3 / 360 (0.008) | 0
10 | ring | punisher/masher-all | masher | 0.47 | 2.2% | 49 / 360 (0.136) | 0
10 | ring | skilled/masher | skilled | 0.01 | 0.1% | 0 / 720 (0.000) | 0
10 | ring | skilled/masher | masher | 1.27 | 8.8% | 544 / 720 (0.756) | 0
10 | ring | skilled/masher-all | skilled | 0.02 | 0.1% | 4 / 720 (0.006) | 0
10 | ring | skilled/masher-all | masher | 0.33 | 1.6% | 79 / 720 (0.110) | 0
10 | ring-burst | stepper/masher | skilled | 0.00 | 0.0% | 0 / 360 (0.000) | 0
10 | ring-burst | stepper/masher | masher | 0.91 | 7.0% | 224 / 360 (0.622) | 0
10 | ring-burst | stepper/masher-all | skilled | 0.01 | 0.0% | 3 / 360 (0.008) | 0
10 | ring-burst | stepper/masher-all | masher | 0.25 | 1.3% | 40 / 360 (0.111) | 0
10 | ring-burst | punisher/masher | skilled | 0.01 | 0.1% | 0 / 360 (0.000) | 0
10 | ring-burst | punisher/masher | masher | 1.63 | 10.4% | 320 / 360 (0.889) | 0
10 | ring-burst | punisher/masher-all | skilled | 0.05 | 0.3% | 10 / 360 (0.028) | 0
10 | ring-burst | punisher/masher-all | masher | 0.59 | 3.0% | 80 / 360 (0.222) | 0
10 | ring-burst | skilled/masher | skilled | 0.01 | 0.1% | 0 / 720 (0.000) | 0
10 | ring-burst | skilled/masher | masher | 1.27 | 8.8% | 544 / 720 (0.756) | 0
10 | ring-burst | skilled/masher-all | skilled | 0.03 | 0.1% | 13 / 720 (0.018) | 0
10 | ring-burst | skilled/masher-all | masher | 0.42 | 2.1% | 120 / 720 (0.167) | 0
10 | ring12-burst | stepper/masher | skilled | 0.00 | 0.0% | 0 / 360 (0.000) | 0
10 | ring12-burst | stepper/masher | masher | 0.21 | 1.6% | 45 / 360 (0.125) | 0
10 | ring12-burst | stepper/masher-all | skilled | 0.01 | 0.0% | 1 / 360 (0.003) | 0
10 | ring12-burst | stepper/masher-all | masher | 0.02 | 0.1% | 4 / 360 (0.011) | 0
10 | ring12-burst | punisher/masher | skilled | 0.01 | 0.0% | 0 / 360 (0.000) | 0
10 | ring12-burst | punisher/masher | masher | 0.38 | 2.4% | 69 / 360 (0.192) | 0
10 | ring12-burst | punisher/masher-all | skilled | 0.02 | 0.1% | 6 / 360 (0.017) | 0
10 | ring12-burst | punisher/masher-all | masher | 0.12 | 0.6% | 5 / 360 (0.014) | 0
10 | ring12-burst | skilled/masher | skilled | 0.00 | 0.0% | 0 / 720 (0.000) | 0
10 | ring12-burst | skilled/masher | masher | 0.30 | 2.1% | 114 / 720 (0.158) | 0
10 | ring12-burst | skilled/masher-all | skilled | 0.02 | 0.1% | 7 / 720 (0.010) | 0
10 | ring12-burst | skilled/masher-all | masher | 0.07 | 0.3% | 9 / 720 (0.013) | 0
10 | ring-jab13 | stepper/masher | skilled | 0.00 | 0.0% | 0 / 360 (0.000) | 0
10 | ring-jab13 | stepper/masher | masher | 0.87 | 6.7% | 218 / 360 (0.606) | 0
10 | ring-jab13 | stepper/masher-all | skilled | 0.01 | 0.0% | 1 / 360 (0.003) | 0
10 | ring-jab13 | stepper/masher-all | masher | 0.18 | 0.9% | 29 / 360 (0.081) | 0
10 | ring-jab13 | punisher/masher | skilled | 0.01 | 0.1% | 0 / 360 (0.000) | 0
10 | ring-jab13 | punisher/masher | masher | 1.57 | 10.0% | 312 / 360 (0.867) | 0
10 | ring-jab13 | punisher/masher-all | skilled | 0.03 | 0.1% | 3 / 360 (0.008) | 0
10 | ring-jab13 | punisher/masher-all | masher | 0.46 | 2.1% | 49 / 360 (0.136) | 0
10 | ring-jab13 | skilled/masher | skilled | 0.01 | 0.1% | 0 / 720 (0.000) | 0
10 | ring-jab13 | skilled/masher | masher | 1.22 | 8.5% | 530 / 720 (0.736) | 0
10 | ring-jab13 | skilled/masher-all | skilled | 0.02 | 0.1% | 4 / 720 (0.006) | 0
10 | ring-jab13 | skilled/masher-all | masher | 0.32 | 1.5% | 78 / 720 (0.108) | 0
10 | ring-jab15heavy | stepper/masher | skilled | 0.00 | 0.0% | 0 / 360 (0.000) | 0
10 | ring-jab15heavy | stepper/masher | masher | 0.77 | 6.2% | 191 / 360 (0.531) | 0
10 | ring-jab15heavy | stepper/masher-all | skilled | 0.01 | 0.0% | 1 / 360 (0.003) | 0
10 | ring-jab15heavy | stepper/masher-all | masher | 0.18 | 0.9% | 29 / 360 (0.081) | 0
10 | ring-jab15heavy | punisher/masher | skilled | 0.01 | 0.1% | 0 / 360 (0.000) | 0
10 | ring-jab15heavy | punisher/masher | masher | 1.52 | 10.1% | 282 / 360 (0.783) | 0
10 | ring-jab15heavy | punisher/masher-all | skilled | 0.03 | 0.1% | 3 / 360 (0.008) | 0
10 | ring-jab15heavy | punisher/masher-all | masher | 0.45 | 2.1% | 48 / 360 (0.133) | 0
10 | ring-jab15heavy | skilled/masher | skilled | 0.01 | 0.1% | 0 / 720 (0.000) | 0
10 | ring-jab15heavy | skilled/masher | masher | 1.15 | 8.3% | 473 / 720 (0.657) | 0
10 | ring-jab15heavy | skilled/masher-all | skilled | 0.02 | 0.1% | 4 / 720 (0.006) | 0
10 | ring-jab15heavy | skilled/masher-all | masher | 0.32 | 1.5% | 77 / 720 (0.107) | 0
15 | ring | stepper/masher | skilled | 0.00 | 0.0% | 0 / 360 (0.000) | 0
15 | ring | stepper/masher | masher | 0.51 | 4.4% | 133 / 360 (0.369) | 0
15 | ring | stepper/masher-all | skilled | 0.01 | 0.0% | 0 / 360 (0.000) | 0
15 | ring | stepper/masher-all | masher | 0.22 | 1.1% | 15 / 360 (0.042) | 0
15 | ring | punisher/masher | skilled | 0.00 | 0.0% | 0 / 360 (0.000) | 0
15 | ring | punisher/masher | masher | 1.04 | 6.7% | 182 / 360 (0.506) | 0
15 | ring | punisher/masher-all | skilled | 0.01 | 0.0% | 0 / 360 (0.000) | 0
15 | ring | punisher/masher-all | masher | 0.26 | 1.1% | 22 / 360 (0.061) | 0
15 | ring | skilled/masher | skilled | 0.00 | 0.0% | 0 / 720 (0.000) | 0
15 | ring | skilled/masher | masher | 0.77 | 5.7% | 315 / 720 (0.438) | 0
15 | ring | skilled/masher-all | skilled | 0.01 | 0.0% | 0 / 720 (0.000) | 0
15 | ring | skilled/masher-all | masher | 0.24 | 1.1% | 37 / 720 (0.051) | 0
15 | ring-burst | stepper/masher | skilled | 0.00 | 0.0% | 0 / 360 (0.000) | 0
15 | ring-burst | stepper/masher | masher | 0.51 | 4.4% | 133 / 360 (0.369) | 0
15 | ring-burst | stepper/masher-all | skilled | 0.01 | 0.0% | 0 / 360 (0.000) | 0
15 | ring-burst | stepper/masher-all | masher | 0.21 | 1.0% | 14 / 360 (0.039) | 0
15 | ring-burst | punisher/masher | skilled | 0.00 | 0.0% | 0 / 360 (0.000) | 0
15 | ring-burst | punisher/masher | masher | 1.04 | 6.7% | 182 / 360 (0.506) | 0
15 | ring-burst | punisher/masher-all | skilled | 0.00 | 0.0% | 0 / 360 (0.000) | 0
15 | ring-burst | punisher/masher-all | masher | 0.35 | 1.5% | 26 / 360 (0.072) | 0
15 | ring-burst | skilled/masher | skilled | 0.00 | 0.0% | 0 / 720 (0.000) | 0
15 | ring-burst | skilled/masher | masher | 0.77 | 5.7% | 315 / 720 (0.438) | 0
15 | ring-burst | skilled/masher-all | skilled | 0.00 | 0.0% | 0 / 720 (0.000) | 0
15 | ring-burst | skilled/masher-all | masher | 0.28 | 1.3% | 40 / 720 (0.056) | 0
15 | ring12-burst | stepper/masher | skilled | 0.00 | 0.0% | 0 / 360 (0.000) | 0
15 | ring12-burst | stepper/masher | masher | 0.18 | 1.5% | 42 / 360 (0.117) | 0
15 | ring12-burst | stepper/masher-all | skilled | 0.00 | 0.0% | 0 / 360 (0.000) | 0
15 | ring12-burst | stepper/masher-all | masher | 0.02 | 0.1% | 2 / 360 (0.006) | 0
15 | ring12-burst | punisher/masher | skilled | 0.00 | 0.0% | 3 / 360 (0.008) | 0
15 | ring12-burst | punisher/masher | masher | 0.26 | 1.7% | 35 / 360 (0.097) | 0
15 | ring12-burst | punisher/masher-all | skilled | 0.00 | 0.0% | 0 / 360 (0.000) | 0
15 | ring12-burst | punisher/masher-all | masher | 0.03 | 0.1% | 1 / 360 (0.003) | 0
15 | ring12-burst | skilled/masher | skilled | 0.00 | 0.0% | 3 / 720 (0.004) | 0
15 | ring12-burst | skilled/masher | masher | 0.22 | 1.6% | 77 / 720 (0.107) | 0
15 | ring12-burst | skilled/masher-all | skilled | 0.00 | 0.0% | 0 / 720 (0.000) | 0
15 | ring12-burst | skilled/masher-all | masher | 0.02 | 0.1% | 3 / 720 (0.004) | 0
15 | ring-jab13 | stepper/masher | skilled | 0.00 | 0.0% | 0 / 360 (0.000) | 0
15 | ring-jab13 | stepper/masher | masher | 0.53 | 4.6% | 128 / 360 (0.356) | 0
15 | ring-jab13 | stepper/masher-all | skilled | 0.01 | 0.0% | 0 / 360 (0.000) | 0
15 | ring-jab13 | stepper/masher-all | masher | 0.20 | 1.0% | 15 / 360 (0.042) | 0
15 | ring-jab13 | punisher/masher | skilled | 0.00 | 0.0% | 0 / 360 (0.000) | 0
15 | ring-jab13 | punisher/masher | masher | 0.98 | 6.2% | 186 / 360 (0.517) | 0
15 | ring-jab13 | punisher/masher-all | skilled | 0.01 | 0.0% | 0 / 360 (0.000) | 0
15 | ring-jab13 | punisher/masher-all | masher | 0.27 | 1.1% | 22 / 360 (0.061) | 0
15 | ring-jab13 | skilled/masher | skilled | 0.00 | 0.0% | 0 / 720 (0.000) | 0
15 | ring-jab13 | skilled/masher | masher | 0.75 | 5.5% | 314 / 720 (0.436) | 0
15 | ring-jab13 | skilled/masher-all | skilled | 0.01 | 0.0% | 0 / 720 (0.000) | 0
15 | ring-jab13 | skilled/masher-all | masher | 0.23 | 1.1% | 37 / 720 (0.051) | 0
15 | ring-jab15heavy | stepper/masher | skilled | 0.00 | 0.0% | 0 / 360 (0.000) | 0
15 | ring-jab15heavy | stepper/masher | masher | 0.45 | 4.1% | 123 / 360 (0.342) | 0
15 | ring-jab15heavy | stepper/masher-all | skilled | 0.01 | 0.0% | 0 / 360 (0.000) | 0
15 | ring-jab15heavy | stepper/masher-all | masher | 0.21 | 1.1% | 12 / 360 (0.033) | 0
15 | ring-jab15heavy | punisher/masher | skilled | 0.00 | 0.0% | 0 / 360 (0.000) | 0
15 | ring-jab15heavy | punisher/masher | masher | 0.90 | 5.9% | 166 / 360 (0.461) | 0
15 | ring-jab15heavy | punisher/masher-all | skilled | 0.01 | 0.0% | 0 / 360 (0.000) | 0
15 | ring-jab15heavy | punisher/masher-all | masher | 0.25 | 1.1% | 20 / 360 (0.056) | 0
15 | ring-jab15heavy | skilled/masher | skilled | 0.00 | 0.0% | 0 / 720 (0.000) | 0
15 | ring-jab15heavy | skilled/masher | masher | 0.68 | 5.2% | 289 / 720 (0.401) | 0
15 | ring-jab15heavy | skilled/masher-all | skilled | 0.01 | 0.0% | 0 / 720 (0.000) | 0
15 | ring-jab15heavy | skilled/masher-all | masher | 0.23 | 1.1% | 32 / 720 (0.044) | 0

## Whiff punishment fixture

{"hitFrame":40,"attackerBeforeHit":{"kind":"super","frame":39,"startup":22,"active":4,"total":60},"hp":93.88,"damage":6.1200000000000045,"punishedRecovery":true}

From a 1.5-unit gap, Tala starts a sidestep at frame 8, taps attack at 30 and hits on frame 40 while Morrow is still in Burst recovery. No teleport, invulnerability or timing override.

## Exact step-start escape frames

Frame 0 = attack button press. Super/capture starts at frame 0; strike begins on release frame 1. Step is injected through the real step starter at the stated frame, then real simulation movement runs; no invulnerability. Negative offsets begin before attack aim is snapped. Minimum offset -24, maximum 22. 260f follow-through counts later capture projectiles, not only close contact.

Both up/down are relative side directions. Frame zero is attacker input press; basic strike starts on release at frame 1. Negative offsets step before the opponent starts and therefore before their aim is set. The normal double tap needs its first tap two frames before the listed step start. Rows count full escape, including later capture projectiles.

Move | Burst rules | Starting gap | Step | Escape starts at/after attack input | Escape starts before input
--- | --- | --- | --- | --- | ---
super | legacy | 1.5 | up | none | none
super | v2 | 1.5 | up | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 | none
super | legacy | 1.5 | down | none | none
super | v2 | 1.5 | down | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14 | none
super | legacy | 1.5 | back | none | none
super | v2 | 1.5 | back | none | none
super | legacy | 2 | up | none | none
super | v2 | 2 | up | none | none
super | legacy | 2 | down | none | none
super | v2 | 2 | down | none | none
super | legacy | 2 | back | none | none
super | v2 | 2 | back | none | none
super | legacy | 3 | up | none | none
super | v2 | 3 | up | none | none
super | legacy | 3 | down | none | none
super | v2 | 3 | down | none | none
super | legacy | 3 | back | none | none
super | v2 | 3 | back | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16 | -24, -23, -22, -21, -20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1
super | legacy | 4 | up | none | none
super | v2 | 4 | up | none | none
super | legacy | 4 | down | none | none
super | v2 | 4 | down | none | none
super | legacy | 4 | back | none | none
super | v2 | 4 | back | 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21 | -24, -23, -22, -21, -20, -19, -18, -17, -16, -15, -14, -13, -12, -11, -10, -9, -8, -7, -6, -5, -4, -3, -2, -1
strike | v2 | 1.5 | up | 0, 1, 2, 3, 4 | none
strike | v2 | 1.5 | down | 0, 1, 2, 3, 4 | none
strike | v2 | 1.5 | back | 0, 1, 2, 3, 4, 5 | -6, -5, -4, -3, -2, -1
strike | v2 | 2 | up | none | none
strike | v2 | 2 | down | none | none
strike | v2 | 2 | back | 0, 1, 2, 3, 4, 5, 6, 7, 8 | -3, -2, -1
strike | v2 | 3 | up | none | none
strike | v2 | 3 | down | none | none
strike | v2 | 3 | back | 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12 | none
capture | v2 | 1.5 | up | none | none
capture | v2 | 1.5 | down | none | none
capture | v2 | 1.5 | back | none | none
capture | v2 | 2 | up | none | none
capture | v2 | 2 | down | none | none
capture | v2 | 2 | back | none | none
capture | v2 | 3 | up | none | none
capture | v2 | 3 | down | none | none
capture | v2 | 3 | back | none | none

## Verification and playtest links

- **717 tests passed, 0 failed** on the measured implementation `b9dd222`. [Final cloud workflow](https://github.com/Tusingw29/rift-duel/actions/runs/41038272566): both tournament jobs and verification succeeded. Unit tests include default fingerprint, actual Burst inside/outside/behind contacts for all six fighters, held/perfect guard, full-step escapes in both seats, real heavy-jab damage/knockback, radius and geometry, variant isolation and passive observers. The updated balance extractor reads the unchanged default branches; the committed roster data remains byte-for-byte unchanged.
- **14,400 bouts, zero censored**, ten archives (five modes × two delays). All recorded source hashes match. Every one of the **2,880 ring-baseline bouts** exactly matches ARENA-INPUT winners, HP, frame counts, player telemetry and edge counters. See `art/skill-lab/2026-10-30-horizon-fix/audit.json`.
- **Seven browser URL/input checks** passed: default, Burst V2 at radii 10/11/12, and jab13/jab15heavy/jab15. The keyboard tests start training, approach and start a real first strike; startup/recovery and parsed flags are checked. This deterministic input fixture stubs only the renderer.
- Desktop and 390px phone dashboard checks pass with no page errors or document overflow. Both delay selections render all five results tables; wide tables scroll within their containers. See `dashboard-browser.json` and the timestamped dashboard captures.
- **Eleven real-renderer captures** passed, with loaded graphic models asserted on every capture: radii 10/11/12 in lock-on, side and duel cameras, plus an escaped Burst and a confirmed contact. `browser.json` has the individual filenames and no page errors. The measured radius and drawn radius match. `horizon-contact-sheet.jpg` collects them.
- Visual inspection: the nearby yellow boundary is clear in all nine radius/camera views; the far arc is still thin/foreshortened in lock-on. The escape frame leaves Tala outside the reach and no cinematic starts; the inside frame confirms contact. **These are contact-state stills, not evidence of a readable normal-speed wind-up.** Claude’s pose/animation files were not edited. The first review harness recreated models immediately before capture and showed fallback bodies; that harness was fixed to retain loaded models before these final captures. Preliminary images are not used as evidence.
- The local unbounded npm test run was stopped to reduce machine load; a lower-concurrency run initially found the extractor-pattern mismatch, which was fixed and rechecked locally. Final full `npm test` results above are from GitHub, not a claim that the interrupted local run passed.
- The final five-seed tournament took **80.0 seconds summed across modes** on cloud runners; delay jobs ran concurrently. This excludes setup, browser captures and exploratory pilot work. Eleven pilot candidates (including baseline) were measured on two seeds; pilot archives and the choice recorded before the final tournament are preserved.

No gameplay merge to main. **Review, awaiting Adam’s normal-speed verdict.** The shared board is the only main update. No character/rig/pose/mocap authoring changes.

- [Burst V2, radius 10](http://localhost:4207/dist/index.html?move=v2&arena=ring&burst=v2)
- [Burst V2, radius 12](http://localhost:4207/dist/index.html?move=v2&arena=ring&ring=12&burst=v2)
- [Morrow jab13](http://localhost:4207/dist/index.html?move=v2&arena=ring&morrow=jab13)
- [Morrow jab15heavy](http://localhost:4207/dist/index.html?move=v2&arena=ring&morrow=jab15heavy)
- [Results dashboard](http://localhost:4207/dist/horizon-lab.html)
- Optional radius 11: `?move=v2&arena=ring&ring=11&burst=v2`. Existing jab15 remains available.

Server: `python3 -m http.server 4207 --bind 127.0.0.1` from `~/rift-worktrees/horizon-fix`.
