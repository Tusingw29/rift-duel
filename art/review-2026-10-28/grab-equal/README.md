# GRAB-EQUAL review

For timer, reader and punisher, neither base ruleset clearly wins under the requested overlap screen: all four proposed-vs-default comparisons could be luck. Slow gives the clearest benefit against masher-all on both rulesets. No set passes the strict no-observed-10f-loss criterion; the largest 15f gain is reported separately as an exploratory playtest option.

10f, proposed vs default with equal offensive policy: against masher -0.6 pp (could be luck); against masher-all -6.3 pp (could be luck).

15f, proposed vs default with equal offensive policy: against masher +3.3 pp (could be luck); against masher-all +1.1 pp (could be luck).

10f, adding slow to default: against masher -0.9 pp (could be luck); against masher-all +12.0 pp (ranges do not overlap).

10f, adding slow to proposed: against masher -1.9 pp (could be luck); against masher-all +15.7 pp (ranges do not overlap).

15f, adding slow to default: against masher +6.3 pp (could be luck); against masher-all +33.5 pp (ranges do not overlap).

15f, adding slow to proposed: against masher +6.8 pp (could be luck); against masher-all +33.1 pp (ranges do not overlap).

No single set meets the predeclared criterion of no observed 10f loss and a gain at 15f against both mashers. Do not claim a universal winner.

Largest observed 15f mean gain (exploratory, fails the strict no-drop condition): proposed+slow. At 15f: masher +10.1 pp (ranges do not overlap), masher-all +34.3 pp (ranges do not overlap). At 10f: masher -2.6 pp (could be luck), masher-all +9.4 pp (ranges do not overlap). Its overlapping 10f loss range is uncertainty, not proof of no downside.

100800 bouts; 0 censored. Summed tournament elapsed: 768.7 seconds across concurrently running delay jobs.

Earlier proposed-vs-default comparisons had unequal grab attack: idle guesses were guard under default and offensive capture under split guard. Those archives remain unchanged for history, but their proposed advantage is not a clean balance estimate.

Primary group is timer + reader + punisher. Spacer remains in the original-three aggregate and in separate sanity rows, not in the primary recommendation. No human skill or normal-speed verdict follows automatically from bot wins.

Offensive grab: 1/60 per eligible decision frame, same independent seeded lottery on every rule set; eligible means delayed distance <3.1, rival idle, own previous capture released, and no priority reaction/release frame. Tap once then release. An independent RNG stream prevents default guard-guess draws from shifting offensive randomness. No simulation RNG, hidden inputs or future state are read.

Defence stays rule-aware: reaction default = fresh timed guard, split = fresh capture without guard. Default retains its separate 1/60 idle guard guesses and 12-frame hold, interrupted if the common offensive decision fires. Split has no second idle guess: the offensive capture tap is also its guess break. Reaction capture taps can still start attacks under split guard; that unavoidable dual use is separately counted, not removed by this experiment. Timer/reader existing anti-guard capture policies remain identical across rules.

Controlled tests use identical observations and seeds and require exactly identical offensive attempt/eligible counts, not merely an overlapping win rate. Live bouts create different distances, action availability and durations: report the common-lottery attempts/eligible frames separately from dedicated capture-button presses and actual move starts. Direction+attack captures appear in starts, not in the dedicated-button counter. Live lottery-rate bands envelope Wilson and a whole-seed cluster bootstrap: every fighter pair and mirrored seat using a seed stays together. Only five seed blocks exist, so these are descriptive checks, not proof of a population rate. Fixed-seed observed rates need not equal the configured 1/60 probability. Do not demand equal move-start counts from different game trajectories.

Captures started = actual capture move starts, including reactions and directional inputs; captures landed = successful captureStart connections (including projectile captures), not damage ticks. Capture HP is actual diagnostic HP damage of kind capture; share = capture HP / all damage. Offensive attempts are tagged fresh common-lottery taps, which may be buffered, interrupted or rejected. A split tap counts once as an offensive attempt and once as a guess break, never as two presses.

Break counters exclude random sanity bouts. Faced counts rival starts; close faced uses <3.1 at start. Reaction/guess attempts count fresh edges; success credits the latest eligible tap in the 12-frame simulation window. Waste has no credited break; pending remains separate. At 15f an uninterrupted close 13f grab is too fast to react to; slow18 permits reaction. Travelling capture projectiles can be broken later, so nonzero 15f reaction breaks do not prove an early close-grab reaction.

360 bouts per policy/opponent: all 36 ordered fighter pairs, both seats, five seeds. Three-policy aggregates have 1,080 bouts. Strict wins count draws as non-wins. 95% ranges envelope Wilson and 2,000-resample fighter-pair/seed block bootstrap, keeping mirrored seats and policies together. Overlap is labeled could be luck; it is neither equivalence nor a formal no-harm test. No multiple-comparison correction.

Candidate criterion fixed before reading results: among non-default sets, require nonnegative observed changes against BOTH mashers at 10f, and positive changes against both at 15f versus default. Rank eligible sets by mean 15f gain across the two mashers. Report both opponents and luck labels; selection does not establish a unique winner or prove no 10f harm.

All ten modes use existing switches. No combat, move, timing, fighter, hitbox or rig changes. Default fingerprint is unchanged. Hold remains an eight-input-frame playtest guess and moves the player during setup; the original masher holds each direction ten frames. No default promotion.

## Win rates

Delay | Mode | Group / opponent | Wins; 95% range
--- | --- | --- | ---
10 | default | skilled/masher | 64.4% (695/1080); 95% 61.4–67.2%
10 | default | skilled/masher-all | 49.6% (536/1080); 95% 46.7–52.6%
10 | default | punisher/masher | 91.4% (329/360); 95% 88.0–94.2%
10 | default | punisher/masher-all | 76.7% (276/360); 95% 71.7–81.4%
10 | default | spacer/masher | 13.1% (47/360); 95% 9.4–17.2%
10 | default | spacer/masher-all | 1.4% (5/360); 95% 0.3–3.2%
10 | default | defence-capable/masher | 90.5% (977/1080); 95% 88.1–92.7%
10 | default | defence-capable/masher-all | 74.7% (807/1080); 95% 71.2–78.3%
10 | proposed | skilled/masher | 62.6% (676/1080); 95% 59.7–65.4%
10 | proposed | skilled/masher-all | 44.2% (477/1080); 95% 41.2–47.1%
10 | proposed | punisher/masher | 88.9% (320/360); 95% 85.2–92.2%
10 | proposed | punisher/masher-all | 72.8% (262/360); 95% 67.5–77.5%
10 | proposed | spacer/masher | 7.2% (26/360); 95% 4.4–10.4%
10 | proposed | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1%
10 | proposed | defence-capable/masher | 89.8% (970/1080); 95% 87.1–92.4%
10 | proposed | defence-capable/masher-all | 68.4% (739/1080); 95% 65.1–71.7%
10 | default+slow | skilled/masher | 65.8% (711/1080); 95% 63.0–68.6%
10 | default+slow | skilled/masher-all | 57.8% (624/1080); 95% 54.8–60.7%
10 | default+slow | punisher/masher | 91.7% (330/360); 95% 88.4–94.4%
10 | default+slow | punisher/masher-all | 89.4% (322/360); 95% 85.8–93.1%
10 | default+slow | spacer/masher | 20.6% (74/360); 95% 15.8–25.3%
10 | default+slow | spacer/masher-all | 2.5% (9/360); 95% 0.8–4.7%
10 | default+slow | defence-capable/masher | 89.5% (967/1080); 95% 87.0–91.9%
10 | default+slow | defence-capable/masher-all | 86.8% (937/1080); 95% 84.1–89.3%
10 | proposed+slow | skilled/masher | 61.7% (666/1080); 95% 58.7–64.5%
10 | proposed+slow | skilled/masher-all | 55.6% (600/1080); 95% 52.6–58.5%
10 | proposed+slow | punisher/masher | 87.5% (315/360); 95% 83.6–91.1%
10 | proposed+slow | punisher/masher-all | 85.8% (309/360); 95% 81.9–89.4%
10 | proposed+slow | spacer/masher | 8.9% (32/360); 95% 6.1–12.3%
10 | proposed+slow | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1%
10 | proposed+slow | defence-capable/masher | 87.9% (949/1080); 95% 84.5–91.0%
10 | proposed+slow | defence-capable/masher-all | 84.2% (909/1080); 95% 81.6–86.8%
10 | default+hold | skilled/masher | 66.2% (715/1080); 95% 63.3–69.0%
10 | default+hold | skilled/masher-all | 53.9% (582/1080); 95% 50.9–56.8%
10 | default+hold | punisher/masher | 89.4% (322/360); 95% 85.8–92.8%
10 | default+hold | punisher/masher-all | 84.2% (303/360); 95% 80.0–88.3%
10 | default+hold | spacer/masher | 21.7% (78/360); 95% 16.9–26.4%
10 | default+hold | spacer/masher-all | 1.7% (6/360); 95% 0.6–3.6%
10 | default+hold | defence-capable/masher | 88.8% (959/1080); 95% 85.8–91.7%
10 | default+hold | defence-capable/masher-all | 81.4% (879/1080); 95% 78.2–84.5%
10 | proposed+hold | skilled/masher | 64.4% (695/1080); 95% 61.4–67.2%
10 | proposed+hold | skilled/masher-all | 51.6% (557/1080); 95% 48.6–54.5%
10 | proposed+hold | punisher/masher | 86.9% (313/360); 95% 83.1–90.6%
10 | proposed+hold | punisher/masher-all | 77.8% (280/360); 95% 73.2–81.9%
10 | proposed+hold | spacer/masher | 18.6% (67/360); 95% 14.2–23.1%
10 | proposed+hold | spacer/masher-all | 0.3% (1/360); 95% 0.0–1.6%
10 | proposed+hold | defence-capable/masher | 87.1% (941/1080); 95% 83.7–90.4%
10 | proposed+hold | defence-capable/masher-all | 77.4% (836/1080); 95% 74.3–80.5%
10 | default+hold,slow | skilled/masher | 68.0% (734/1080); 95% 65.1–70.7%
10 | default+hold,slow | skilled/masher-all | 58.1% (628/1080); 95% 55.2–61.1%
10 | default+hold,slow | punisher/masher | 89.2% (321/360); 95% 85.3–92.5%
10 | default+hold,slow | punisher/masher-all | 92.2% (332/360); 95% 89.0–94.7%
10 | default+hold,slow | spacer/masher | 23.9% (86/360); 95% 18.6–28.9%
10 | default+hold,slow | spacer/masher-all | 3.3% (12/360); 95% 1.4–5.7%
10 | default+hold,slow | defence-capable/masher | 89.7% (969/1080); 95% 86.9–92.4%
10 | default+hold,slow | defence-capable/masher-all | 87.8% (948/1080); 95% 85.3–90.1%
10 | proposed+hold,slow | skilled/masher | 65.6% (709/1080); 95% 62.8–68.4%
10 | proposed+hold,slow | skilled/masher-all | 58.6% (633/1080); 95% 55.6–61.5%
10 | proposed+hold,slow | punisher/masher | 89.7% (323/360); 95% 86.1–93.1%
10 | proposed+hold,slow | punisher/masher-all | 89.2% (321/360); 95% 85.5–92.5%
10 | proposed+hold,slow | spacer/masher | 18.6% (67/360); 95% 13.9–23.3%
10 | proposed+hold,slow | spacer/masher-all | 1.1% (4/360); 95% 0.3–2.8%
10 | proposed+hold,slow | defence-capable/masher | 89.4% (965/1080); 95% 86.4–92.2%
10 | proposed+hold,slow | defence-capable/masher-all | 88.0% (950/1080); 95% 85.6–90.2%
10 | default+deliberate,slow | skilled/masher | 69.5% (751/1080); 95% 66.7–72.2%
10 | default+deliberate,slow | skilled/masher-all | 59.3% (640/1080); 95% 56.3–62.2%
10 | default+deliberate,slow | punisher/masher | 90.0% (324/360); 95% 86.4–93.3%
10 | default+deliberate,slow | punisher/masher-all | 92.8% (334/360); 95% 89.6–95.6%
10 | default+deliberate,slow | spacer/masher | 29.7% (107/360); 95% 24.2–35.3%
10 | default+deliberate,slow | spacer/masher-all | 3.6% (13/360); 95% 1.7–6.1%
10 | default+deliberate,slow | defence-capable/masher | 89.6% (968/1080); 95% 86.9–92.2%
10 | default+deliberate,slow | defence-capable/masher-all | 89.0% (961/1080); 95% 86.9–91.1%
10 | proposed+deliberate,slow | skilled/masher | 68.1% (735/1080); 95% 65.2–70.8%
10 | proposed+deliberate,slow | skilled/masher-all | 58.2% (629/1080); 95% 55.3–61.1%
10 | proposed+deliberate,slow | punisher/masher | 88.3% (318/360); 95% 84.6–91.7%
10 | proposed+deliberate,slow | punisher/masher-all | 89.7% (323/360); 95% 86.2–93.1%
10 | proposed+deliberate,slow | spacer/masher | 26.4% (95/360); 95% 20.8–31.9%
10 | proposed+deliberate,slow | spacer/masher-all | 1.1% (4/360); 95% 0.3–2.8%
10 | proposed+deliberate,slow | defence-capable/masher | 88.7% (958/1080); 95% 85.7–91.7%
10 | proposed+deliberate,slow | defence-capable/masher-all | 87.8% (948/1080); 95% 85.4–90.0%
15 | default | skilled/masher | 29.8% (322/1080); 95% 26.8–32.9%
15 | default | skilled/masher-all | 23.1% (250/1080); 95% 20.3–26.1%
15 | default | punisher/masher | 49.2% (177/360); 95% 43.9–54.4%
15 | default | punisher/masher-all | 39.7% (143/360); 95% 34.7–44.9%
15 | default | spacer/masher | 4.4% (16/360); 95% 2.5–7.1%
15 | default | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1%
15 | default | defence-capable/masher | 44.7% (483/1080); 95% 40.7–49.2%
15 | default | defence-capable/masher-all | 36.4% (393/1080); 95% 32.6–40.4%
15 | proposed | skilled/masher | 31.2% (337/1080); 95% 28.0–34.5%
15 | proposed | skilled/masher-all | 23.2% (251/1080); 95% 20.5–26.2%
15 | proposed | punisher/masher | 54.2% (195/360); 95% 48.9–59.2%
15 | proposed | punisher/masher-all | 42.8% (154/360); 95% 37.8–47.9%
15 | proposed | spacer/masher | 3.6% (13/360); 95% 1.9–6.1%
15 | proposed | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1%
15 | proposed | defence-capable/masher | 48.1% (519/1080); 95% 43.7–52.5%
15 | proposed | defence-capable/masher-all | 37.5% (405/1080); 95% 33.7–41.6%
15 | default+slow | skilled/masher | 33.9% (366/1080); 95% 30.7–36.8%
15 | default+slow | skilled/masher-all | 45.5% (491/1080); 95% 42.5–48.4%
15 | default+slow | punisher/masher | 58.1% (209/360); 95% 52.8–63.0%
15 | default+slow | punisher/masher-all | 73.6% (265/360); 95% 68.8–78.1%
15 | default+slow | spacer/masher | 6.7% (24/360); 95% 4.2–9.7%
15 | default+slow | spacer/masher-all | 0.3% (1/360); 95% 0.0–1.6%
15 | default+slow | defence-capable/masher | 51.0% (551/1080); 95% 46.8–55.2%
15 | default+slow | defence-capable/masher-all | 69.9% (755/1080); 95% 66.5–73.3%
15 | proposed+slow | skilled/masher | 34.9% (377/1080); 95% 31.5–38.1%
15 | proposed+slow | skilled/masher-all | 45.6% (492/1080); 95% 42.6–48.5%
15 | proposed+slow | punisher/masher | 62.2% (224/360); 95% 57.1–67.8%
15 | proposed+slow | punisher/masher-all | 75.6% (272/360); 95% 70.8–80.0%
15 | proposed+slow | spacer/masher | 2.5% (9/360); 95% 0.8–4.7%
15 | proposed+slow | spacer/masher-all | 0.3% (1/360); 95% 0.0–1.6%
15 | proposed+slow | defence-capable/masher | 54.8% (592/1080); 95% 50.2–59.4%
15 | proposed+slow | defence-capable/masher-all | 70.6% (763/1080); 95% 67.3–73.9%
15 | default+hold | skilled/masher | 34.2% (369/1080); 95% 30.7–37.5%
15 | default+hold | skilled/masher-all | 28.2% (305/1080); 95% 25.6–31.1%
15 | default+hold | punisher/masher | 52.8% (190/360); 95% 47.5–57.9%
15 | default+hold | punisher/masher-all | 51.4% (185/360); 95% 46.1–56.7%
15 | default+hold | spacer/masher | 11.7% (42/360); 95% 8.3–15.4%
15 | default+hold | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1%
15 | default+hold | defence-capable/masher | 47.9% (517/1080); 95% 43.4–52.1%
15 | default+hold | defence-capable/masher-all | 45.4% (490/1080); 95% 41.6–49.4%
15 | proposed+hold | skilled/masher | 31.1% (336/1080); 95% 27.6–34.5%
15 | proposed+hold | skilled/masher-all | 27.7% (299/1080); 95% 24.7–30.6%
15 | proposed+hold | punisher/masher | 49.4% (178/360); 95% 43.6–54.7%
15 | proposed+hold | punisher/masher-all | 46.7% (168/360); 95% 41.6–51.8%
15 | proposed+hold | spacer/masher | 10.8% (39/360); 95% 7.5–14.5%
15 | proposed+hold | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1%
15 | proposed+hold | defence-capable/masher | 44.0% (475/1080); 95% 39.0–48.4%
15 | proposed+hold | defence-capable/masher-all | 43.2% (467/1080); 95% 39.4–47.1%
15 | default+hold,slow | skilled/masher | 34.4% (372/1080); 95% 31.0–37.7%
15 | default+hold,slow | skilled/masher-all | 46.7% (504/1080); 95% 43.7–49.6%
15 | default+hold,slow | punisher/masher | 53.6% (193/360); 95% 48.3–59.2%
15 | default+hold,slow | punisher/masher-all | 73.6% (265/360); 95% 68.8–78.3%
15 | default+hold,slow | spacer/masher | 13.1% (47/360); 95% 9.4–16.9%
15 | default+hold,slow | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1%
15 | default+hold,slow | defence-capable/masher | 48.0% (518/1080); 95% 43.5–52.4%
15 | default+hold,slow | defence-capable/masher-all | 71.2% (769/1080); 95% 67.8–74.4%
15 | proposed+hold,slow | skilled/masher | 32.5% (351/1080); 95% 29.1–35.8%
15 | proposed+hold,slow | skilled/masher-all | 44.4% (480/1080); 95% 41.5–47.4%
15 | proposed+hold,slow | punisher/masher | 51.1% (184/360); 95% 45.6–56.4%
15 | proposed+hold,slow | punisher/masher-all | 74.4% (268/360); 95% 69.7–78.9%
15 | proposed+hold,slow | spacer/masher | 11.7% (42/360); 95% 8.3–15.6%
15 | proposed+hold,slow | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1%
15 | proposed+hold,slow | defence-capable/masher | 45.6% (493/1080); 95% 40.6–50.2%
15 | proposed+hold,slow | defence-capable/masher-all | 69.3% (748/1080); 95% 65.7–72.6%
15 | default+deliberate,slow | skilled/masher | 34.6% (374/1080); 95% 30.9–38.3%
15 | default+deliberate,slow | skilled/masher-all | 46.9% (506/1080); 95% 43.9–49.8%
15 | default+deliberate,slow | punisher/masher | 49.2% (177/360); 95% 43.3–54.7%
15 | default+deliberate,slow | punisher/masher-all | 74.4% (268/360); 95% 69.4–79.2%
15 | default+deliberate,slow | spacer/masher | 20.6% (74/360); 95% 16.4–25.6%
15 | default+deliberate,slow | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1%
15 | default+deliberate,slow | defence-capable/masher | 44.2% (477/1080); 95% 39.4–48.7%
15 | default+deliberate,slow | defence-capable/masher-all | 71.7% (774/1080); 95% 68.3–74.7%
15 | proposed+deliberate,slow | skilled/masher | 35.6% (385/1080); 95% 31.7–39.5%
15 | proposed+deliberate,slow | skilled/masher-all | 42.3% (457/1080); 95% 39.4–45.3%
15 | proposed+deliberate,slow | punisher/masher | 51.7% (186/360); 95% 46.1–56.9%
15 | proposed+deliberate,slow | punisher/masher-all | 71.4% (257/360); 95% 66.5–76.1%
15 | proposed+deliberate,slow | spacer/masher | 22.5% (81/360); 95% 17.8–27.5%
15 | proposed+deliberate,slow | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1%
15 | proposed+deliberate,slow | defence-capable/masher | 45.4% (490/1080); 95% 40.3–50.2%
15 | proposed+deliberate,slow | defence-capable/masher-all | 66.1% (714/1080); 95% 62.4–69.8%

## Capture damage both ways (primary group)

Delay | Mode | Masher | Bots capture HP / all HP | Bots share | Masher capture HP / all HP | Masher share
--- | --- | --- | --- | --- | --- | ---
10 | default | masher | 15975.3 / 104067.5 | 15.4% | 10538.8 / 49357.9 | 21.4%
10 | default | masher-all | 16641.2 / 98908.7 | 16.8% | 29188.6 / 71922.2 | 40.6%
10 | proposed | masher | 12826.5 / 102503.2 | 12.5% | 8490.4 / 48344.4 | 17.6%
10 | proposed | masher-all | 12185.9 / 95554.0 | 12.8% | 28007.7 / 73848.3 | 37.9%
10 | default+slow | masher | 13835.1 / 102725.1 | 13.5% | 8647.5 / 47968.3 | 18.0%
10 | default+slow | masher-all | 15891.9 / 102858.5 | 15.5% | 19453.7 / 61033.3 | 31.9%
10 | proposed+slow | masher | 11656.6 / 100847.2 | 11.6% | 7436.7 / 47960.6 | 15.5%
10 | proposed+slow | masher-all | 10322.2 / 102726.5 | 10.0% | 18565.8 / 58516.2 | 31.7%
10 | default+hold | masher | 15216.7 / 102344.6 | 14.9% | 2439.0 / 47771.0 | 5.1%
10 | default+hold | masher-all | 16094.5 / 100895.7 | 16.0% | 20438.5 / 66763.7 | 30.6%
10 | proposed+hold | masher | 11809.5 / 100936.0 | 11.7% | 2770.3 / 49537.4 | 5.6%
10 | proposed+hold | masher-all | 12031.9 / 99228.0 | 12.1% | 19549.4 / 67356.8 | 29.0%
10 | default+hold,slow | masher | 13449.5 / 102646.5 | 13.1% | 2017.9 / 48449.1 | 4.2%
10 | default+hold,slow | masher-all | 14554.0 / 103143.4 | 14.1% | 12919.3 / 59072.9 | 21.9%
10 | proposed+hold,slow | masher | 10514.1 / 102481.6 | 10.3% | 1756.8 / 49235.5 | 3.6%
10 | proposed+hold,slow | masher-all | 10424.1 / 102872.5 | 10.1% | 13248.1 / 58769.0 | 22.5%
10 | default+deliberate,slow | masher | 12500.9 / 102902.6 | 12.1% | 0.0 / 48619.2 | 0.0%
10 | default+deliberate,slow | masher-all | 14801.6 / 103705.0 | 14.3% | 12464.6 / 58988.9 | 21.1%
10 | proposed+deliberate,slow | masher | 9788.2 / 102355.4 | 9.6% | 0.0 / 50826.2 | 0.0%
10 | proposed+deliberate,slow | masher-all | 10552.3 / 102480.1 | 10.3% | 13085.5 / 59992.1 | 21.8%
15 | default | masher | 8629.8 / 73113.1 | 11.8% | 15298.7 / 88291.7 | 17.3%
15 | default | masher-all | 11102.7 / 75798.6 | 14.6% | 43729.4 / 94920.7 | 46.1%
15 | proposed | masher | 10763.0 / 74935.6 | 14.4% | 12334.7 / 86316.7 | 14.3%
15 | proposed | masher-all | 12684.2 / 77254.1 | 16.4% | 39382.8 / 94107.3 | 41.8%
15 | default+slow | masher | 9381.3 / 78591.7 | 11.9% | 9628.5 / 86144.1 | 11.2%
15 | default+slow | masher-all | 15669.5 / 96631.5 | 16.2% | 25604.6 / 77888.7 | 32.9%
15 | proposed+slow | masher | 9740.0 / 77511.6 | 12.6% | 7568.8 / 81553.0 | 9.3%
15 | proposed+slow | masher-all | 14565.5 / 96045.2 | 15.2% | 25295.6 / 74445.5 | 34.0%
15 | default+hold | masher | 9580.6 / 72904.5 | 13.1% | 4694.5 / 87411.0 | 5.4%
15 | default+hold | masher-all | 12545.5 / 82860.5 | 15.1% | 31396.3 / 89924.2 | 34.9%
15 | proposed+hold | masher | 8159.3 / 69597.9 | 11.7% | 3737.4 / 87603.4 | 4.3%
15 | proposed+hold | masher-all | 12566.1 / 82122.8 | 15.3% | 31172.9 / 91407.9 | 34.1%
15 | default+hold,slow | masher | 8776.5 / 73796.3 | 11.9% | 3209.7 / 87968.6 | 3.6%
15 | default+hold,slow | masher-all | 14332.3 / 96840.6 | 14.8% | 18128.8 / 77744.3 | 23.3%
15 | proposed+hold,slow | masher | 8045.5 / 70554.4 | 11.4% | 2885.9 / 86953.4 | 3.3%
15 | proposed+hold,slow | masher-all | 13083.0 / 95878.4 | 13.6% | 19007.6 / 76172.8 | 25.0%
15 | default+deliberate,slow | masher | 7406.8 / 72389.9 | 10.2% | 0.0 / 89193.0 | 0.0%
15 | default+deliberate,slow | masher-all | 14291.5 / 97649.4 | 14.6% | 16974.1 / 77856.0 | 21.8%
15 | proposed+deliberate,slow | masher | 7294.5 / 71772.1 | 10.2% | 0.0 / 88158.0 | 0.0%
15 | proposed+deliberate,slow | masher-all | 12230.8 / 93761.4 | 13.0% | 19183.6 / 79124.0 | 24.2%

## Offensive validity by bot and opponent

Delay | Mode | Bot / opponent | Bouts | capturePresses | grabAttackEligibleFrames | grabAttackAttempts | capturesStarted | capturesLanded | captureDamage | damage | Capture share | Offensive lottery rate; descriptive 95%
--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---
10 | default | timer/masher | 360 | 2450 | 157272 | 2450 | 579 | 459 | 6019.0 | 34498.7 | 17.4% | 1.558%; 1.202–1.948%
10 | default | timer/masher-all | 360 | 3172 | 194992 | 3071 | 606 | 437 | 5987.3 | 33098.7 | 18.1% | 1.575%; 1.207–1.986%
10 | default | reader/masher | 360 | 2441 | 157173 | 2441 | 502 | 420 | 5671.2 | 34758.3 | 16.3% | 1.553%; 1.205–1.968%
10 | default | reader/masher-all | 360 | 3018 | 194545 | 3018 | 600 | 465 | 6428.7 | 32472.3 | 19.8% | 1.551%; 1.173–1.958%
10 | default | punisher/masher | 360 | 2200 | 144016 | 2200 | 361 | 315 | 4285.1 | 34810.4 | 12.3% | 1.528%; 1.172–1.939%
10 | default | punisher/masher-all | 360 | 2909 | 186240 | 2909 | 413 | 316 | 4225.1 | 33337.7 | 12.7% | 1.562%; 1.193–1.994%
10 | default | spacer/masher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 14306.6 | 0.0% | not applicable
10 | default | spacer/masher-all | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 10159.0 | 0.0% | not applicable
10 | default | masher/timer | 360 | 0 | 0 | 0 | 606 | 228 | 3621.8 | 17492.8 | 20.7% | not applicable
10 | default | masher/reader | 360 | 0 | 0 | 0 | 604 | 224 | 3551.2 | 16391.4 | 21.7% | not applicable
10 | default | masher/punisher | 360 | 0 | 0 | 0 | 584 | 209 | 3365.8 | 15473.7 | 21.8% | not applicable
10 | default | masher/spacer | 360 | 0 | 0 | 0 | 1941 | 562 | 9102.0 | 32464.4 | 28.0% | not applicable
10 | default | masher-all/timer | 360 | 49279 | 0 | 0 | 1590 | 638 | 9828.3 | 24345.3 | 40.4% | not applicable
10 | default | masher-all/reader | 360 | 49718 | 0 | 0 | 1716 | 659 | 10068.9 | 24845.2 | 40.5% | not applicable
10 | default | masher-all/punisher | 360 | 46196 | 0 | 0 | 1603 | 606 | 9291.4 | 22731.6 | 40.9% | not applicable
10 | default | masher-all/spacer | 360 | 48044 | 0 | 0 | 1612 | 1005 | 13994.4 | 35877.3 | 39.0% | not applicable
10 | proposed | timer/masher | 360 | 2823 | 145334 | 2219 | 694 | 367 | 4913.9 | 34041.3 | 14.4% | 1.527%; 1.161–1.927%
10 | proposed | timer/masher-all | 360 | 4611 | 183396 | 2887 | 855 | 339 | 4659.4 | 31491.3 | 14.8% | 1.574%; 1.188–2.004%
10 | proposed | reader/masher | 360 | 2794 | 145070 | 2205 | 623 | 323 | 4382.6 | 34347.5 | 12.8% | 1.520%; 1.170–1.924%
10 | proposed | reader/masher-all | 360 | 4475 | 181314 | 2830 | 820 | 299 | 4209.1 | 31440.4 | 13.4% | 1.561%; 1.200–1.997%
10 | proposed | punisher/masher | 360 | 2600 | 133577 | 2005 | 561 | 264 | 3530.0 | 34114.3 | 10.3% | 1.501%; 1.149–1.896%
10 | proposed | punisher/masher-all | 360 | 4219 | 176895 | 2751 | 643 | 242 | 3317.4 | 32622.3 | 10.2% | 1.555%; 1.164–1.994%
10 | proposed | spacer/masher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 11297.0 | 0.0% | not applicable
10 | proposed | spacer/masher-all | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 7441.1 | 0.0% | not applicable
10 | proposed | masher/timer | 360 | 0 | 0 | 0 | 612 | 192 | 3034.5 | 16588.4 | 18.3% | not applicable
10 | proposed | masher/reader | 360 | 0 | 0 | 0 | 605 | 168 | 2672.5 | 15680.7 | 17.0% | not applicable
10 | proposed | masher/punisher | 360 | 0 | 0 | 0 | 605 | 176 | 2783.3 | 16075.4 | 17.3% | not applicable
10 | proposed | masher/spacer | 360 | 0 | 0 | 0 | 1352 | 1215 | 19968.4 | 35298.6 | 56.6% | not applicable
10 | proposed | masher-all/timer | 360 | 47159 | 0 | 0 | 1530 | 657 | 9689.6 | 24838.4 | 39.0% | not applicable
10 | proposed | masher-all/reader | 360 | 47188 | 0 | 0 | 1674 | 657 | 9788.0 | 25422.2 | 38.5% | not applicable
10 | proposed | masher-all/punisher | 360 | 44201 | 0 | 0 | 1506 | 566 | 8530.1 | 23587.7 | 36.2% | not applicable
10 | proposed | masher-all/spacer | 360 | 46119 | 0 | 0 | 1357 | 1215 | 17856.7 | 36000 | 49.6% | not applicable
10 | default+slow | timer/masher | 360 | 2249 | 144633 | 2249 | 533 | 391 | 5120.7 | 34146.9 | 15.0% | 1.555%; 1.197–1.982%
10 | default+slow | timer/masher-all | 360 | 3106 | 191020 | 3003 | 659 | 418 | 5543.9 | 34063.9 | 16.3% | 1.572%; 1.209–1.989%
10 | default+slow | reader/masher | 360 | 2229 | 145944 | 2229 | 494 | 373 | 4914.5 | 34174.5 | 14.4% | 1.527%; 1.197–1.941%
10 | default+slow | reader/masher-all | 360 | 3090 | 195529 | 3090 | 657 | 440 | 6010.6 | 34194.0 | 17.6% | 1.580%; 1.203–1.994%
10 | default+slow | punisher/masher | 360 | 2037 | 134598 | 2037 | 338 | 277 | 3800.0 | 34403.8 | 11.0% | 1.513%; 1.172–1.941%
10 | default+slow | punisher/masher-all | 360 | 2845 | 182914 | 2845 | 474 | 323 | 4337.4 | 34600.7 | 12.5% | 1.555%; 1.193–1.997%
10 | default+slow | spacer/masher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 14807.3 | 0.0% | not applicable
10 | default+slow | spacer/masher-all | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 12893.8 | 0.0% | not applicable
10 | default+slow | masher/timer | 360 | 0 | 0 | 0 | 589 | 187 | 2927.8 | 16665.7 | 17.6% | not applicable
10 | default+slow | masher/reader | 360 | 0 | 0 | 0 | 610 | 196 | 3044.5 | 16083.1 | 18.9% | not applicable
10 | default+slow | masher/punisher | 360 | 0 | 0 | 0 | 553 | 168 | 2675.1 | 15219.5 | 17.6% | not applicable
10 | default+slow | masher/spacer | 360 | 0 | 0 | 0 | 2053 | 440 | 7314.2 | 30983.3 | 23.6% | not applicable
10 | default+slow | masher-all/timer | 360 | 46988 | 0 | 0 | 1654 | 445 | 7207.8 | 21385.5 | 33.7% | not applicable
10 | default+slow | masher-all/reader | 360 | 46499 | 0 | 0 | 1747 | 388 | 6128.1 | 20139.7 | 30.4% | not applicable
10 | default+slow | masher-all/punisher | 360 | 43485 | 0 | 0 | 1592 | 379 | 6117.9 | 19508.0 | 31.4% | not applicable
10 | default+slow | masher-all/spacer | 360 | 50695 | 0 | 0 | 1842 | 919 | 13156.6 | 35811.7 | 36.7% | not applicable
10 | proposed+slow | timer/masher | 360 | 2614 | 138712 | 2036 | 717 | 327 | 4383.7 | 33568.2 | 13.1% | 1.468%; 1.121–1.872%
10 | proposed+slow | timer/masher-all | 360 | 4510 | 182635 | 2844 | 988 | 287 | 3902.1 | 34383.5 | 11.3% | 1.557%; 1.168–1.984%
10 | proposed+slow | reader/masher | 360 | 2663 | 140449 | 2068 | 683 | 305 | 4131.4 | 33708.9 | 12.3% | 1.472%; 1.133–1.885%
10 | proposed+slow | reader/masher-all | 360 | 4631 | 186396 | 2867 | 1041 | 245 | 3445.5 | 33983.7 | 10.1% | 1.538%; 1.168–1.950%
10 | proposed+slow | punisher/masher | 360 | 2420 | 126666 | 1854 | 565 | 243 | 3141.5 | 33570.2 | 9.4% | 1.464%; 1.124–1.876%
10 | proposed+slow | punisher/masher-all | 360 | 4140 | 172164 | 2648 | 784 | 224 | 2974.7 | 34359.3 | 8.7% | 1.538%; 1.170–1.980%
10 | proposed+slow | spacer/masher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 11941.7 | 0.0% | not applicable
10 | proposed+slow | spacer/masher-all | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 7163.5 | 0.0% | not applicable
10 | proposed+slow | masher/timer | 360 | 0 | 0 | 0 | 588 | 157 | 2461.9 | 16356.7 | 15.1% | not applicable
10 | proposed+slow | masher/reader | 360 | 0 | 0 | 0 | 616 | 150 | 2372.1 | 15502.6 | 15.3% | not applicable
10 | proposed+slow | masher/punisher | 360 | 0 | 0 | 0 | 583 | 165 | 2602.7 | 16101.2 | 16.2% | not applicable
10 | proposed+slow | masher/spacer | 360 | 0 | 0 | 0 | 1399 | 1257 | 20464.1 | 35139.9 | 58.2% | not applicable
10 | proposed+slow | masher-all/timer | 360 | 42658 | 0 | 0 | 1533 | 368 | 5808.6 | 19359.9 | 30.0% | not applicable
10 | proposed+slow | masher-all/reader | 360 | 44597 | 0 | 0 | 1806 | 450 | 7070.6 | 21051.1 | 33.6% | not applicable
10 | proposed+slow | masher-all/punisher | 360 | 40370 | 0 | 0 | 1529 | 371 | 5686.6 | 18105.2 | 31.4% | not applicable
10 | proposed+slow | masher-all/spacer | 360 | 48237 | 0 | 0 | 1452 | 1261 | 18981.3 | 36001.5 | 52.7% | not applicable
10 | default+hold | timer/masher | 360 | 2364 | 153511 | 2364 | 526 | 441 | 5923.2 | 33719.6 | 17.6% | 1.540%; 1.163–1.962%
10 | default+hold | timer/masher-all | 360 | 3132 | 193103 | 3036 | 593 | 426 | 5893.1 | 33828.6 | 17.4% | 1.572%; 1.183–1.993%
10 | default+hold | reader/masher | 360 | 2315 | 150772 | 2315 | 490 | 419 | 5571.7 | 34450.8 | 16.2% | 1.535%; 1.205–1.923%
10 | default+hold | reader/masher-all | 360 | 2939 | 188679 | 2939 | 576 | 432 | 5982.6 | 32961.4 | 18.2% | 1.558%; 1.176–1.978%
10 | default+hold | punisher/masher | 360 | 2031 | 135219 | 2031 | 324 | 280 | 3721.8 | 34174.1 | 10.9% | 1.502%; 1.137–1.911%
10 | default+hold | punisher/masher-all | 360 | 2800 | 180414 | 2800 | 408 | 312 | 4218.8 | 34105.7 | 12.4% | 1.552%; 1.184–1.976%
10 | default+hold | spacer/masher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 15150.2 | 0.0% | not applicable
10 | default+hold | spacer/masher-all | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 12582.9 | 0.0% | not applicable
10 | default+hold | masher/timer | 360 | 0 | 0 | 0 | 150 | 58 | 854.4 | 16606.4 | 5.1% | not applicable
10 | default+hold | masher/reader | 360 | 0 | 0 | 0 | 160 | 49 | 740.8 | 15602.0 | 4.7% | not applicable
10 | default+hold | masher/punisher | 360 | 0 | 0 | 0 | 146 | 55 | 843.8 | 15562.6 | 5.4% | not applicable
10 | default+hold | masher/spacer | 360 | 0 | 0 | 0 | 561 | 196 | 3303.3 | 30716.8 | 10.8% | not applicable
10 | default+hold | masher-all/timer | 360 | 46171 | 0 | 0 | 1188 | 439 | 6791.5 | 22510.8 | 30.2% | not applicable
10 | default+hold | masher-all/reader | 360 | 47013 | 0 | 0 | 1262 | 495 | 7419.8 | 23272.1 | 31.9% | not applicable
10 | default+hold | masher-all/punisher | 360 | 43032 | 0 | 0 | 1102 | 405 | 6227.2 | 20980.8 | 29.7% | not applicable
10 | default+hold | masher-all/spacer | 360 | 47866 | 0 | 0 | 1385 | 819 | 11606.1 | 35883.7 | 32.3% | not applicable
10 | proposed+hold | timer/masher | 360 | 2270 | 140925 | 2104 | 480 | 340 | 4555.7 | 33673.9 | 13.5% | 1.493%; 1.132–1.901%
10 | proposed+hold | timer/masher-all | 360 | 4081 | 182902 | 2809 | 751 | 317 | 4369.2 | 33015.9 | 13.2% | 1.536%; 1.161–1.967%
10 | proposed+hold | reader/masher | 360 | 2286 | 141383 | 2128 | 422 | 309 | 4143.9 | 33738.8 | 12.3% | 1.505%; 1.139–1.936%
10 | proposed+hold | reader/masher-all | 360 | 4033 | 183310 | 2848 | 730 | 310 | 4233.0 | 32868.6 | 12.9% | 1.554%; 1.171–2.000%
10 | proposed+hold | punisher/masher | 360 | 2112 | 128797 | 1927 | 347 | 236 | 3109.9 | 33523.2 | 9.3% | 1.496%; 1.128–1.916%
10 | proposed+hold | punisher/masher-all | 360 | 3747 | 176398 | 2727 | 553 | 251 | 3429.7 | 33343.5 | 10.3% | 1.546%; 1.175–1.975%
10 | proposed+hold | spacer/masher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 14178.3 | 0.0% | not applicable
10 | proposed+hold | spacer/masher-all | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 8987.0 | 0.0% | not applicable
10 | proposed+hold | masher/timer | 360 | 0 | 0 | 0 | 170 | 55 | 897.1 | 16380.6 | 5.5% | not applicable
10 | proposed+hold | masher/reader | 360 | 0 | 0 | 0 | 161 | 51 | 806.7 | 16438.7 | 4.9% | not applicable
10 | proposed+hold | masher/punisher | 360 | 0 | 0 | 0 | 191 | 69 | 1066.5 | 16718.1 | 6.4% | not applicable
10 | proposed+hold | masher/spacer | 360 | 0 | 0 | 0 | 559 | 505 | 8085.8 | 32771.2 | 24.7% | not applicable
10 | proposed+hold | masher-all/timer | 360 | 44873 | 0 | 0 | 1138 | 450 | 6756.5 | 23026.8 | 29.3% | not applicable
10 | proposed+hold | masher-all/reader | 360 | 44177 | 0 | 0 | 1210 | 434 | 6624.6 | 22691.4 | 29.2% | not applicable
10 | proposed+hold | masher-all/punisher | 360 | 41954 | 0 | 0 | 1041 | 402 | 6168.4 | 21638.6 | 28.5% | not applicable
10 | proposed+hold | masher-all/spacer | 360 | 46524 | 0 | 0 | 1198 | 1062 | 15562.6 | 35983.3 | 43.2% | not applicable
10 | default+hold,slow | timer/masher | 360 | 2194 | 144463 | 2194 | 519 | 389 | 5142.2 | 34080.5 | 15.1% | 1.519%; 1.160–1.949%
10 | default+hold,slow | timer/masher-all | 360 | 2946 | 182077 | 2842 | 637 | 384 | 5020.5 | 33810.1 | 14.8% | 1.561%; 1.203–1.991%
10 | default+hold,slow | reader/masher | 360 | 2188 | 145254 | 2188 | 474 | 369 | 4890.2 | 34493.8 | 14.2% | 1.506%; 1.186–1.888%
10 | default+hold,slow | reader/masher-all | 360 | 2928 | 189208 | 2928 | 638 | 403 | 5387.2 | 34411.3 | 15.7% | 1.548%; 1.168–1.981%
10 | default+hold,slow | punisher/masher | 360 | 1896 | 128781 | 1896 | 316 | 255 | 3417.1 | 34072.2 | 10.0% | 1.472%; 1.111–1.907%
10 | default+hold,slow | punisher/masher-all | 360 | 2767 | 178878 | 2767 | 455 | 304 | 4146.2 | 34922.0 | 11.9% | 1.547%; 1.179–1.978%
10 | default+hold,slow | spacer/masher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 15225.2 | 0.0% | not applicable
10 | default+hold,slow | spacer/masher-all | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 13789.3 | 0.0% | not applicable
10 | default+hold,slow | masher/timer | 360 | 0 | 0 | 0 | 164 | 49 | 749.7 | 17046.3 | 4.4% | not applicable
10 | default+hold,slow | masher/reader | 360 | 0 | 0 | 0 | 158 | 41 | 653.8 | 15837.7 | 4.1% | not applicable
10 | default+hold,slow | masher/punisher | 360 | 0 | 0 | 0 | 147 | 38 | 614.4 | 15565.1 | 3.9% | not applicable
10 | default+hold,slow | masher/spacer | 360 | 0 | 0 | 0 | 607 | 160 | 2780.2 | 30064.4 | 9.2% | not applicable
10 | default+hold,slow | masher-all/timer | 360 | 43706 | 0 | 0 | 1156 | 289 | 4665.4 | 20324.3 | 23.0% | not applicable
10 | default+hold,slow | masher-all/reader | 360 | 44870 | 0 | 0 | 1260 | 280 | 4348.6 | 20548.3 | 21.2% | not applicable
10 | default+hold,slow | masher-all/punisher | 360 | 40813 | 0 | 0 | 1072 | 244 | 3905.3 | 18200.3 | 21.5% | not applicable
10 | default+hold,slow | masher-all/spacer | 360 | 49073 | 0 | 0 | 1517 | 711 | 10120.2 | 35758.7 | 28.3% | not applicable
10 | proposed+hold,slow | timer/masher | 360 | 2105 | 132649 | 1949 | 473 | 289 | 3762.4 | 33982.0 | 11.1% | 1.469%; 1.127–1.889%
10 | proposed+hold,slow | timer/masher-all | 360 | 4036 | 178094 | 2740 | 843 | 296 | 4002.3 | 34196.9 | 11.7% | 1.539%; 1.145–1.975%
10 | proposed+hold,slow | reader/masher | 360 | 2188 | 137364 | 2042 | 443 | 297 | 3900.6 | 34356.5 | 11.4% | 1.487%; 1.146–1.915%
10 | proposed+hold,slow | reader/masher-all | 360 | 4069 | 183179 | 2815 | 878 | 244 | 3257.6 | 34462.3 | 9.5% | 1.537%; 1.166–1.985%
10 | proposed+hold,slow | punisher/masher | 360 | 2002 | 125128 | 1843 | 344 | 217 | 2851.0 | 34143.0 | 8.4% | 1.473%; 1.119–1.910%
10 | proposed+hold,slow | punisher/masher-all | 360 | 3627 | 168991 | 2555 | 683 | 233 | 3164.2 | 34213.4 | 9.2% | 1.512%; 1.152–1.946%
10 | proposed+hold,slow | spacer/masher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 14709.5 | 0.0% | not applicable
10 | proposed+hold,slow | spacer/masher-all | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 9001.4 | 0.0% | not applicable
10 | proposed+hold,slow | masher/timer | 360 | 0 | 0 | 0 | 157 | 41 | 627.2 | 16836.8 | 3.7% | not applicable
10 | proposed+hold,slow | masher/reader | 360 | 0 | 0 | 0 | 146 | 31 | 442.8 | 16275.5 | 2.7% | not applicable
10 | proposed+hold,slow | masher/punisher | 360 | 0 | 0 | 0 | 160 | 45 | 686.7 | 16123.2 | 4.3% | not applicable
10 | proposed+hold,slow | masher/spacer | 360 | 0 | 0 | 0 | 594 | 514 | 8535.3 | 32903.9 | 25.9% | not applicable
10 | proposed+hold,slow | masher-all/timer | 360 | 41570 | 0 | 0 | 1149 | 267 | 4225.6 | 19704.3 | 21.4% | not applicable
10 | proposed+hold,slow | masher-all/reader | 360 | 42527 | 0 | 0 | 1287 | 311 | 4902.5 | 20469.0 | 24.0% | not applicable
10 | proposed+hold,slow | masher-all/punisher | 360 | 39236 | 0 | 0 | 1088 | 262 | 4120.0 | 18595.7 | 22.2% | not applicable
10 | proposed+hold,slow | masher-all/spacer | 360 | 47436 | 0 | 0 | 1170 | 1028 | 15215.0 | 35949.1 | 42.3% | not applicable
10 | default+deliberate,slow | timer/masher | 360 | 2153 | 142360 | 2153 | 501 | 365 | 4910.9 | 34209.5 | 14.4% | 1.512%; 1.175–1.923%
10 | default+deliberate,slow | timer/masher-all | 360 | 2937 | 182400 | 2840 | 612 | 386 | 5061.0 | 34191.3 | 14.8% | 1.557%; 1.200–1.985%
10 | default+deliberate,slow | reader/masher | 360 | 2094 | 141333 | 2094 | 434 | 336 | 4423.1 | 34392.9 | 12.9% | 1.482%; 1.152–1.878%
10 | default+deliberate,slow | reader/masher-all | 360 | 2907 | 188362 | 2907 | 641 | 413 | 5545.5 | 34408.1 | 16.1% | 1.543%; 1.170–1.975%
10 | default+deliberate,slow | punisher/masher | 360 | 1868 | 126997 | 1868 | 303 | 237 | 3166.9 | 34300.2 | 9.2% | 1.471%; 1.134–1.890%
10 | default+deliberate,slow | punisher/masher-all | 360 | 2766 | 179107 | 2766 | 451 | 311 | 4195.1 | 35105.6 | 11.9% | 1.544%; 1.175–1.977%
10 | default+deliberate,slow | spacer/masher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 16045.5 | 0.0% | not applicable
10 | default+deliberate,slow | spacer/masher-all | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 13796.9 | 0.0% | not applicable
10 | default+deliberate,slow | masher/timer | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 17159.4 | 0.0% | not applicable
10 | default+deliberate,slow | masher/reader | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 15954.2 | 0.0% | not applicable
10 | default+deliberate,slow | masher/punisher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 15505.6 | 0.0% | not applicable
10 | default+deliberate,slow | masher/spacer | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 28770.9 | 0.0% | not applicable
10 | default+deliberate,slow | masher-all/timer | 360 | 43585 | 0 | 0 | 1104 | 277 | 4496.0 | 20188.5 | 22.3% | not applicable
10 | default+deliberate,slow | masher-all/reader | 360 | 44586 | 0 | 0 | 1187 | 271 | 4189.2 | 20624.1 | 20.3% | not applicable
10 | default+deliberate,slow | masher-all/punisher | 360 | 40742 | 0 | 0 | 1045 | 237 | 3779.4 | 18176.2 | 20.8% | not applicable
10 | default+deliberate,slow | masher-all/spacer | 360 | 50205 | 0 | 0 | 1501 | 728 | 10313.3 | 35755.1 | 28.8% | not applicable
10 | proposed+deliberate,slow | timer/masher | 360 | 1994 | 134088 | 1994 | 376 | 276 | 3588.3 | 34162.7 | 10.5% | 1.487%; 1.152–1.892%
10 | proposed+deliberate,slow | timer/masher-all | 360 | 3973 | 176709 | 2729 | 802 | 293 | 4022.7 | 34215.4 | 11.8% | 1.544%; 1.157–1.975%
10 | proposed+deliberate,slow | reader/masher | 360 | 1936 | 132020 | 1936 | 349 | 282 | 3631.3 | 34223.4 | 10.6% | 1.466%; 1.151–1.877%
10 | proposed+deliberate,slow | reader/masher-all | 360 | 3958 | 179442 | 2780 | 823 | 241 | 3224.3 | 33982.6 | 9.5% | 1.549%; 1.185–1.992%
10 | proposed+deliberate,slow | punisher/masher | 360 | 1846 | 124903 | 1846 | 236 | 197 | 2568.6 | 33969.3 | 7.6% | 1.478%; 1.143–1.897%
10 | proposed+deliberate,slow | punisher/masher-all | 360 | 3561 | 167534 | 2547 | 641 | 245 | 3305.3 | 34282.2 | 9.6% | 1.520%; 1.160–1.947%
10 | proposed+deliberate,slow | spacer/masher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 15882.1 | 0.0% | not applicable
10 | proposed+deliberate,slow | spacer/masher-all | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 8968.2 | 0.0% | not applicable
10 | proposed+deliberate,slow | masher/timer | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 17298.3 | 0.0% | not applicable
10 | proposed+deliberate,slow | masher/reader | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 17119.9 | 0.0% | not applicable
10 | proposed+deliberate,slow | masher/punisher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 16408.0 | 0.0% | not applicable
10 | proposed+deliberate,slow | masher/spacer | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 29257.7 | 0.0% | not applicable
10 | proposed+deliberate,slow | masher-all/timer | 360 | 41526 | 0 | 0 | 1097 | 270 | 4278.5 | 20218.6 | 21.2% | not applicable
10 | proposed+deliberate,slow | masher-all/reader | 360 | 42088 | 0 | 0 | 1210 | 290 | 4565.5 | 20757.0 | 22.0% | not applicable
10 | proposed+deliberate,slow | masher-all/punisher | 360 | 39658 | 0 | 0 | 1032 | 267 | 4241.5 | 19016.5 | 22.3% | not applicable
10 | proposed+deliberate,slow | masher-all/spacer | 360 | 47465 | 0 | 0 | 1141 | 1014 | 14882.4 | 35949.1 | 41.4% | not applicable
15 | default | timer/masher | 360 | 1331 | 94664 | 1331 | 309 | 229 | 3157.8 | 24192.7 | 13.1% | 1.406%; 1.032–1.893%
15 | default | timer/masher-all | 360 | 2282 | 145761 | 2183 | 504 | 281 | 3957.4 | 24420.8 | 16.2% | 1.498%; 1.193–1.843%
15 | default | reader/masher | 360 | 1321 | 94648 | 1321 | 326 | 244 | 3254.4 | 23599.6 | 13.8% | 1.396%; 1.006–1.853%
15 | default | reader/masher-all | 360 | 2253 | 148533 | 2253 | 503 | 317 | 4455.7 | 25233.1 | 17.7% | 1.517%; 1.172–1.908%
15 | default | punisher/masher | 360 | 1294 | 92882 | 1294 | 217 | 165 | 2217.7 | 25320.8 | 8.8% | 1.393%; 1.071–1.820%
15 | default | punisher/masher-all | 360 | 2172 | 145811 | 2172 | 337 | 193 | 2689.5 | 26144.7 | 10.3% | 1.490%; 1.147–1.872%
15 | default | spacer/masher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 15431.9 | 0.0% | not applicable
15 | default | spacer/masher-all | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 7411.2 | 0.0% | not applicable
15 | default | masher/timer | 360 | 0 | 0 | 0 | 582 | 354 | 5263.1 | 29850.2 | 17.6% | not applicable
15 | default | masher/reader | 360 | 0 | 0 | 0 | 590 | 350 | 5204.0 | 29660.6 | 17.5% | not applicable
15 | default | masher/punisher | 360 | 0 | 0 | 0 | 539 | 325 | 4831.6 | 28780.9 | 16.8% | not applicable
15 | default | masher/spacer | 360 | 0 | 0 | 0 | 1402 | 953 | 15678.5 | 35545.4 | 44.1% | not applicable
15 | default | masher-all/timer | 360 | 50702 | 0 | 0 | 1576 | 1000 | 14681.1 | 32081.9 | 45.8% | not applicable
15 | default | masher-all/reader | 360 | 51354 | 0 | 0 | 1602 | 989 | 14573.4 | 31724.2 | 45.9% | not applicable
15 | default | masher-all/punisher | 360 | 49546 | 0 | 0 | 1623 | 972 | 14474.8 | 31114.6 | 46.5% | not applicable
15 | default | masher-all/spacer | 360 | 42734 | 0 | 0 | 1292 | 952 | 13784.1 | 36000 | 38.3% | not applicable
15 | proposed | timer/masher | 360 | 2023 | 101066 | 1482 | 457 | 264 | 3652.3 | 24573.2 | 14.9% | 1.466%; 1.118–1.914%
15 | proposed | timer/masher-all | 360 | 3881 | 144506 | 2102 | 670 | 298 | 4433.5 | 25245.1 | 17.6% | 1.455%; 1.114–1.830%
15 | proposed | reader/masher | 360 | 2051 | 100985 | 1472 | 500 | 292 | 4078.0 | 24241.9 | 16.8% | 1.458%; 1.101–1.922%
15 | proposed | reader/masher-all | 360 | 3732 | 143482 | 2114 | 694 | 303 | 4403.1 | 25024.9 | 17.6% | 1.473%; 1.101–1.898%
15 | proposed | punisher/masher | 360 | 2002 | 100088 | 1480 | 373 | 211 | 3032.7 | 26120.5 | 11.6% | 1.479%; 1.128–1.898%
15 | proposed | punisher/masher-all | 360 | 3718 | 149550 | 2170 | 548 | 259 | 3847.7 | 26984.1 | 14.3% | 1.451%; 1.125–1.836%
15 | proposed | spacer/masher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 13890.7 | 0.0% | not applicable
15 | proposed | spacer/masher-all | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 6080.7 | 0.0% | not applicable
15 | proposed | masher/timer | 360 | 0 | 0 | 0 | 546 | 286 | 4150.1 | 29471.8 | 14.1% | not applicable
15 | proposed | masher/reader | 360 | 0 | 0 | 0 | 586 | 289 | 4218.4 | 28876.3 | 14.6% | not applicable
15 | proposed | masher/punisher | 360 | 0 | 0 | 0 | 526 | 271 | 3966.2 | 27968.6 | 14.2% | not applicable
15 | proposed | masher/spacer | 360 | 0 | 0 | 0 | 1242 | 1092 | 18169.0 | 35622.5 | 51.0% | not applicable
15 | proposed | masher-all/timer | 360 | 50004 | 0 | 0 | 1632 | 922 | 13229.2 | 31487.3 | 42.0% | not applicable
15 | proposed | masher-all/reader | 360 | 50527 | 0 | 0 | 1638 | 941 | 13611.2 | 31825.5 | 42.8% | not applicable
15 | proposed | masher-all/punisher | 360 | 48770 | 0 | 0 | 1569 | 863 | 12542.5 | 30794.5 | 40.7% | not applicable
15 | proposed | masher-all/spacer | 360 | 42729 | 0 | 0 | 1203 | 1095 | 15859.9 | 36000 | 44.1% | not applicable
15 | default+slow | timer/masher | 360 | 1516 | 104096 | 1516 | 384 | 231 | 3196.0 | 25401.7 | 12.6% | 1.456%; 1.101–1.911%
15 | default+slow | timer/masher-all | 360 | 2998 | 187922 | 2910 | 763 | 426 | 5871.5 | 31567.8 | 18.6% | 1.549%; 1.185–1.977%
15 | default+slow | reader/masher | 360 | 1584 | 108085 | 1584 | 412 | 260 | 3489.5 | 25793.8 | 13.5% | 1.466%; 1.110–1.901%
15 | default+slow | reader/masher-all | 360 | 2960 | 189103 | 2960 | 754 | 434 | 5779.5 | 32293.2 | 17.9% | 1.565%; 1.195–2.002%
15 | default+slow | punisher/masher | 360 | 1589 | 106212 | 1589 | 287 | 200 | 2695.8 | 27396.1 | 9.8% | 1.496%; 1.190–1.884%
15 | default+slow | punisher/masher-all | 360 | 2779 | 178639 | 2779 | 504 | 300 | 4018.5 | 32770.6 | 12.3% | 1.556%; 1.192–1.978%
15 | default+slow | spacer/masher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 16021.5 | 0.0% | not applicable
15 | default+slow | spacer/masher-all | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 7974.0 | 0.0% | not applicable
15 | default+slow | masher/timer | 360 | 0 | 0 | 0 | 601 | 218 | 3314.8 | 30029.4 | 11.0% | not applicable
15 | default+slow | masher/reader | 360 | 0 | 0 | 0 | 589 | 222 | 3374.4 | 28986.8 | 11.6% | not applicable
15 | default+slow | masher/punisher | 360 | 0 | 0 | 0 | 578 | 193 | 2939.3 | 27127.9 | 10.8% | not applicable
15 | default+slow | masher/spacer | 360 | 0 | 0 | 0 | 1383 | 912 | 15330.1 | 35372.3 | 43.3% | not applicable
15 | default+slow | masher-all/timer | 360 | 51478 | 0 | 0 | 1924 | 631 | 9508.7 | 27078.8 | 35.1% | not applicable
15 | default+slow | masher-all/reader | 360 | 49803 | 0 | 0 | 1872 | 496 | 7478.6 | 25657.7 | 29.1% | not applicable
15 | default+slow | masher-all/punisher | 360 | 47943 | 0 | 0 | 1817 | 564 | 8617.3 | 25152.1 | 34.3% | not applicable
15 | default+slow | masher-all/spacer | 360 | 44723 | 0 | 0 | 1480 | 964 | 14185.9 | 35990.2 | 39.4% | not applicable
15 | proposed+slow | timer/masher | 360 | 2124 | 106929 | 1587 | 559 | 236 | 3262.6 | 25540.3 | 12.8% | 1.484%; 1.157–1.877%
15 | proposed+slow | timer/masher-all | 360 | 4564 | 174109 | 2628 | 1136 | 338 | 4737.4 | 31215.6 | 15.2% | 1.509%; 1.169–1.903%
15 | proposed+slow | reader/masher | 360 | 2124 | 105404 | 1577 | 635 | 266 | 3696.0 | 25059.5 | 14.7% | 1.496%; 1.150–1.914%
15 | proposed+slow | reader/masher-all | 360 | 4570 | 180025 | 2734 | 1198 | 397 | 5580.5 | 32115.9 | 17.4% | 1.519%; 1.154–1.949%
15 | proposed+slow | punisher/masher | 360 | 2068 | 103918 | 1532 | 506 | 201 | 2781.5 | 26911.8 | 10.3% | 1.474%; 1.160–1.864%
15 | proposed+slow | punisher/masher-all | 360 | 4350 | 175067 | 2688 | 937 | 294 | 4247.7 | 32713.7 | 13.0% | 1.535%; 1.187–1.935%
15 | proposed+slow | spacer/masher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 14488.9 | 0.0% | not applicable
15 | proposed+slow | spacer/masher-all | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 5828.0 | 0.0% | not applicable
15 | proposed+slow | masher/timer | 360 | 0 | 0 | 0 | 545 | 178 | 2664.1 | 28053.5 | 9.5% | not applicable
15 | proposed+slow | masher/reader | 360 | 0 | 0 | 0 | 555 | 162 | 2444.7 | 27853.5 | 8.8% | not applicable
15 | proposed+slow | masher/punisher | 360 | 0 | 0 | 0 | 548 | 168 | 2460.0 | 25646.0 | 9.6% | not applicable
15 | proposed+slow | masher/spacer | 360 | 0 | 0 | 0 | 1251 | 1104 | 18330.0 | 35716.8 | 51.3% | not applicable
15 | proposed+slow | masher-all/timer | 360 | 49167 | 0 | 0 | 1834 | 639 | 9369.2 | 26149.1 | 35.8% | not applicable
15 | proposed+slow | masher-all/reader | 360 | 49117 | 0 | 0 | 1857 | 570 | 8385.9 | 25208.1 | 33.3% | not applicable
15 | proposed+slow | masher-all/punisher | 360 | 45627 | 0 | 0 | 1697 | 504 | 7540.5 | 23088.3 | 32.7% | not applicable
15 | proposed+slow | masher-all/spacer | 360 | 43652 | 0 | 0 | 1324 | 1143 | 16874.7 | 35989.8 | 46.9% | not applicable
15 | default+hold | timer/masher | 360 | 1404 | 95937 | 1404 | 341 | 260 | 3526.9 | 23850.5 | 14.8% | 1.463%; 1.112–1.917%
15 | default+hold | timer/masher-all | 360 | 2402 | 151548 | 2311 | 538 | 323 | 4502.1 | 26860.5 | 16.8% | 1.525%; 1.215–1.873%
15 | default+hold | reader/masher | 360 | 1412 | 97391 | 1412 | 340 | 251 | 3337.5 | 23731.5 | 14.1% | 1.450%; 1.051–1.932%
15 | default+hold | reader/masher-all | 360 | 2386 | 157769 | 2386 | 552 | 348 | 4815.3 | 27286.1 | 17.6% | 1.512%; 1.182–1.872%
15 | default+hold | punisher/masher | 360 | 1386 | 95226 | 1386 | 239 | 198 | 2716.2 | 25322.5 | 10.7% | 1.455%; 1.104–1.900%
15 | default+hold | punisher/masher-all | 360 | 2355 | 154157 | 2355 | 372 | 231 | 3228.1 | 28714.0 | 11.2% | 1.528%; 1.201–1.896%
15 | default+hold | spacer/masher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 18428.1 | 0.0% | not applicable
15 | default+hold | spacer/masher-all | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 8191.4 | 0.0% | not applicable
15 | default+hold | masher/timer | 360 | 0 | 0 | 0 | 167 | 106 | 1554.1 | 29689.2 | 5.2% | not applicable
15 | default+hold | masher/reader | 360 | 0 | 0 | 0 | 173 | 119 | 1750.0 | 29382.5 | 6.0% | not applicable
15 | default+hold | masher/punisher | 360 | 0 | 0 | 0 | 154 | 94 | 1390.4 | 28339.2 | 4.9% | not applicable
15 | default+hold | masher/spacer | 360 | 0 | 0 | 0 | 548 | 341 | 5482.3 | 33186.2 | 16.5% | not applicable
15 | default+hold | masher-all/timer | 360 | 48718 | 0 | 0 | 1244 | 739 | 10834.3 | 30238.8 | 35.8% | not applicable
15 | default+hold | masher-all/reader | 360 | 49518 | 0 | 0 | 1242 | 715 | 10423.6 | 30638.7 | 34.0% | not applicable
15 | default+hold | masher-all/punisher | 360 | 46855 | 0 | 0 | 1225 | 679 | 10138.3 | 29046.8 | 34.9% | not applicable
15 | default+hold | masher-all/spacer | 360 | 41189 | 0 | 0 | 1091 | 793 | 11116.3 | 36000 | 30.9% | not applicable
15 | proposed+hold | timer/masher | 360 | 1498 | 91086 | 1341 | 325 | 214 | 2943.5 | 23124.4 | 12.7% | 1.472%; 1.168–1.916%
15 | proposed+hold | timer/masher-all | 360 | 3463 | 145977 | 2145 | 628 | 318 | 4562.0 | 26793.0 | 17.0% | 1.469%; 1.119–1.863%
15 | proposed+hold | reader/masher | 360 | 1451 | 88872 | 1288 | 320 | 211 | 2903.2 | 22142.3 | 13.1% | 1.449%; 1.107–1.888%
15 | proposed+hold | reader/masher-all | 360 | 3503 | 149648 | 2254 | 642 | 311 | 4445.3 | 27373.0 | 16.2% | 1.506%; 1.134–1.898%
15 | proposed+hold | punisher/masher | 360 | 1461 | 88994 | 1293 | 255 | 167 | 2312.6 | 24331.3 | 9.5% | 1.453%; 1.159–1.887%
15 | proposed+hold | punisher/masher-all | 360 | 3351 | 148748 | 2188 | 459 | 249 | 3558.8 | 27956.9 | 12.7% | 1.471%; 1.100–1.842%
15 | proposed+hold | spacer/masher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 18417.3 | 0.0% | not applicable
15 | proposed+hold | spacer/masher-all | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 6924.8 | 0.0% | not applicable
15 | proposed+hold | masher/timer | 360 | 0 | 0 | 0 | 161 | 78 | 1134.9 | 29687.9 | 3.8% | not applicable
15 | proposed+hold | masher/reader | 360 | 0 | 0 | 0 | 164 | 92 | 1329.6 | 29846.5 | 4.5% | not applicable
15 | proposed+hold | masher/punisher | 360 | 0 | 0 | 0 | 172 | 88 | 1273.0 | 28069.0 | 4.5% | not applicable
15 | proposed+hold | masher/spacer | 360 | 0 | 0 | 0 | 518 | 456 | 7324.3 | 34082.6 | 21.5% | not applicable
15 | proposed+hold | masher-all/timer | 360 | 48393 | 0 | 0 | 1216 | 722 | 10523.0 | 30733.2 | 34.2% | not applicable
15 | proposed+hold | masher-all/reader | 360 | 48306 | 0 | 0 | 1255 | 702 | 10294.3 | 30511.1 | 33.7% | not applicable
15 | proposed+hold | masher-all/punisher | 360 | 46944 | 0 | 0 | 1182 | 700 | 10355.5 | 30163.5 | 34.3% | not applicable
15 | proposed+hold | masher-all/spacer | 360 | 41542 | 0 | 0 | 1044 | 945 | 13450.6 | 36000 | 37.4% | not applicable
15 | default+hold,slow | timer/masher | 360 | 1403 | 95019 | 1403 | 331 | 212 | 2966.9 | 23882.2 | 12.4% | 1.477%; 1.090–1.959%
15 | default+hold,slow | timer/masher-all | 360 | 2897 | 182807 | 2784 | 693 | 370 | 5069.7 | 31925.1 | 15.9% | 1.523%; 1.183–1.929%
15 | default+hold,slow | reader/masher | 360 | 1442 | 98086 | 1442 | 375 | 235 | 3126.0 | 24018.7 | 13.0% | 1.470%; 1.053–1.979%
15 | default+hold,slow | reader/masher-all | 360 | 2885 | 184403 | 2885 | 718 | 405 | 5353.6 | 32267.7 | 16.6% | 1.565%; 1.211–1.976%
15 | default+hold,slow | punisher/masher | 360 | 1441 | 98278 | 1441 | 254 | 195 | 2683.5 | 25895.5 | 10.4% | 1.466%; 1.111–1.924%
15 | default+hold,slow | punisher/masher-all | 360 | 2737 | 176265 | 2737 | 492 | 288 | 3908.9 | 32647.8 | 12.0% | 1.553%; 1.195–1.973%
15 | default+hold,slow | spacer/masher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 17876.9 | 0.0% | not applicable
15 | default+hold,slow | spacer/masher-all | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 8656.4 | 0.0% | not applicable
15 | default+hold,slow | masher/timer | 360 | 0 | 0 | 0 | 183 | 79 | 1170.8 | 30105.4 | 3.9% | not applicable
15 | default+hold,slow | masher/reader | 360 | 0 | 0 | 0 | 169 | 72 | 1066.4 | 29789.4 | 3.6% | not applicable
15 | default+hold,slow | masher/punisher | 360 | 0 | 0 | 0 | 159 | 71 | 972.5 | 28073.8 | 3.5% | not applicable
15 | default+hold,slow | masher/spacer | 360 | 0 | 0 | 0 | 560 | 335 | 5416.1 | 33102.1 | 16.4% | not applicable
15 | default+hold,slow | masher-all/timer | 360 | 48196 | 0 | 0 | 1379 | 424 | 6401.4 | 26546.6 | 24.1% | not applicable
15 | default+hold,slow | masher-all/reader | 360 | 48256 | 0 | 0 | 1327 | 366 | 5612.0 | 26433.3 | 21.2% | not applicable
15 | default+hold,slow | masher-all/punisher | 360 | 45450 | 0 | 0 | 1303 | 401 | 6115.4 | 24764.4 | 24.7% | not applicable
15 | default+hold,slow | masher-all/spacer | 360 | 41989 | 0 | 0 | 1131 | 730 | 10321.4 | 36000.4 | 28.7% | not applicable
15 | proposed+hold,slow | timer/masher | 360 | 1533 | 91264 | 1374 | 356 | 197 | 2696.8 | 23085.1 | 11.7% | 1.506%; 1.181–1.959%
15 | proposed+hold,slow | timer/masher-all | 360 | 3895 | 166768 | 2490 | 968 | 301 | 4291.9 | 31243.8 | 13.7% | 1.493%; 1.139–1.915%
15 | proposed+hold,slow | reader/masher | 360 | 1617 | 94860 | 1447 | 394 | 226 | 3085.8 | 22755.2 | 13.6% | 1.525%; 1.147–1.973%
15 | proposed+hold,slow | reader/masher-all | 360 | 4004 | 173585 | 2672 | 1019 | 342 | 4823.3 | 32157.6 | 15.0% | 1.539%; 1.175–1.969%
15 | proposed+hold,slow | punisher/masher | 360 | 1497 | 90253 | 1326 | 295 | 164 | 2262.9 | 24714.1 | 9.2% | 1.469%; 1.172–1.910%
15 | proposed+hold,slow | punisher/masher-all | 360 | 3691 | 165247 | 2519 | 798 | 282 | 3967.8 | 32477.1 | 12.2% | 1.524%; 1.162–1.953%
15 | proposed+hold,slow | spacer/masher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 18523.1 | 0.0% | not applicable
15 | proposed+hold,slow | spacer/masher-all | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 6821.3 | 0.0% | not applicable
15 | proposed+hold,slow | masher/timer | 360 | 0 | 0 | 0 | 163 | 65 | 965.0 | 29968.1 | 3.2% | not applicable
15 | proposed+hold,slow | masher/reader | 360 | 0 | 0 | 0 | 171 | 62 | 918.0 | 29385.7 | 3.1% | not applicable
15 | proposed+hold,slow | masher/punisher | 360 | 0 | 0 | 0 | 174 | 70 | 1002.9 | 27599.6 | 3.6% | not applicable
15 | proposed+hold,slow | masher/spacer | 360 | 0 | 0 | 0 | 548 | 463 | 7533.8 | 33921.8 | 22.2% | not applicable
15 | proposed+hold,slow | masher-all/timer | 360 | 46242 | 0 | 0 | 1280 | 457 | 6893.3 | 26376.0 | 26.1% | not applicable
15 | proposed+hold,slow | masher-all/reader | 360 | 46520 | 0 | 0 | 1356 | 425 | 6461.8 | 25863.1 | 25.0% | not applicable
15 | proposed+hold,slow | masher-all/punisher | 360 | 43838 | 0 | 0 | 1202 | 371 | 5652.4 | 23933.7 | 23.6% | not applicable
15 | proposed+hold,slow | masher-all/spacer | 360 | 41629 | 0 | 0 | 1072 | 937 | 13370.8 | 36000 | 37.1% | not applicable
15 | default+deliberate,slow | timer/masher | 360 | 1274 | 90157 | 1274 | 301 | 176 | 2386.7 | 23633.2 | 10.1% | 1.413%; 1.069–1.882%
15 | default+deliberate,slow | timer/masher-all | 360 | 2905 | 183756 | 2796 | 705 | 376 | 5135.3 | 32365.9 | 15.9% | 1.522%; 1.181–1.925%
15 | default+deliberate,slow | reader/masher | 360 | 1319 | 92858 | 1319 | 328 | 200 | 2722.8 | 23516.2 | 11.6% | 1.420%; 1.017–1.951%
15 | default+deliberate,slow | reader/masher-all | 360 | 2872 | 184347 | 2872 | 719 | 404 | 5348.4 | 32382.7 | 16.5% | 1.558%; 1.197–1.973%
15 | default+deliberate,slow | punisher/masher | 360 | 1314 | 92161 | 1314 | 230 | 166 | 2297.3 | 25240.5 | 9.1% | 1.426%; 1.062–1.879%
15 | default+deliberate,slow | punisher/masher-all | 360 | 2752 | 176785 | 2752 | 497 | 285 | 3807.8 | 32900.8 | 11.6% | 1.557%; 1.207–1.974%
15 | default+deliberate,slow | spacer/masher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 18844.7 | 0.0% | not applicable
15 | default+deliberate,slow | spacer/masher-all | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 8777.7 | 0.0% | not applicable
15 | default+deliberate,slow | masher/timer | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 30842.3 | 0.0% | not applicable
15 | default+deliberate,slow | masher/reader | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 30027.6 | 0.0% | not applicable
15 | default+deliberate,slow | masher/punisher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 28323.1 | 0.0% | not applicable
15 | default+deliberate,slow | masher/spacer | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 31085.6 | 0.0% | not applicable
15 | default+deliberate,slow | masher-all/timer | 360 | 48086 | 0 | 0 | 1336 | 397 | 5972.8 | 26547.7 | 22.5% | not applicable
15 | default+deliberate,slow | masher-all/reader | 360 | 48089 | 0 | 0 | 1263 | 352 | 5416.0 | 26545.1 | 20.4% | not applicable
15 | default+deliberate,slow | masher-all/punisher | 360 | 45011 | 0 | 0 | 1245 | 368 | 5585.4 | 24763.3 | 22.6% | not applicable
15 | default+deliberate,slow | masher-all/spacer | 360 | 41993 | 0 | 0 | 1102 | 706 | 9890.9 | 36000 | 27.5% | not applicable
15 | proposed+deliberate,slow | timer/masher | 360 | 1333 | 91290 | 1333 | 261 | 178 | 2455.0 | 23293.5 | 10.5% | 1.460%; 1.107–1.955%
15 | proposed+deliberate,slow | timer/masher-all | 360 | 3781 | 162097 | 2458 | 895 | 282 | 4080.6 | 30562.0 | 13.4% | 1.516%; 1.166–1.914%
15 | proposed+deliberate,slow | reader/masher | 360 | 1363 | 93144 | 1363 | 293 | 200 | 2737.4 | 23119.8 | 11.8% | 1.463%; 1.089–1.921%
15 | proposed+deliberate,slow | reader/masher-all | 360 | 3878 | 170086 | 2631 | 955 | 312 | 4419.6 | 31228.0 | 14.2% | 1.547%; 1.200–1.966%
15 | proposed+deliberate,slow | punisher/masher | 360 | 1319 | 91512 | 1319 | 206 | 155 | 2102.2 | 25358.8 | 8.3% | 1.441%; 1.107–1.902%
15 | proposed+deliberate,slow | punisher/masher-all | 360 | 3569 | 162409 | 2473 | 742 | 266 | 3730.7 | 31971.4 | 11.7% | 1.523%; 1.170–1.941%
15 | proposed+deliberate,slow | spacer/masher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 19829.8 | 0.0% | not applicable
15 | proposed+deliberate,slow | spacer/masher-all | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 6982.3 | 0.0% | not applicable
15 | proposed+deliberate,slow | masher/timer | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 30260.6 | 0.0% | not applicable
15 | proposed+deliberate,slow | masher/reader | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 29901.0 | 0.0% | not applicable
15 | proposed+deliberate,slow | masher/punisher | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 27996.4 | 0.0% | not applicable
15 | proposed+deliberate,slow | masher/spacer | 360 | 0 | 0 | 0 | 0 | 0 | 0 | 31092.5 | 0.0% | not applicable
15 | proposed+deliberate,slow | masher-all/timer | 360 | 45752 | 0 | 0 | 1196 | 453 | 6798.9 | 27154.2 | 25.0% | not applicable
15 | proposed+deliberate,slow | masher-all/reader | 360 | 46488 | 0 | 0 | 1271 | 436 | 6684.7 | 27096.7 | 24.7% | not applicable
15 | proposed+deliberate,slow | masher-all/punisher | 360 | 43752 | 0 | 0 | 1115 | 376 | 5700.0 | 24873.1 | 22.9% | not applicable
15 | proposed+deliberate,slow | masher-all/spacer | 360 | 41531 | 0 | 0 | 1039 | 910 | 12905.1 | 36000 | 35.8% | not applicable

## Break validity

Delay | Mode | Bot | Bouts | capturesFaced | closeCapturesFaced | reactionBreakAttempts | guessBreakAttempts | reactionBreaksLanded | guessBreaksLanded | breaksLanded | wastedBreakTaps | pendingBreakTaps
--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---
10 | default | timer | 720 | 2196 | 1661 | 2153 | 5221 | 459 | 0 | 466 | 6915 | 0
10 | default | reader | 720 | 2320 | 1784 | 2269 | 5222 | 489 | 0 | 496 | 7002 | 0
10 | default | punisher | 720 | 2187 | 1616 | 2124 | 4878 | 416 | 0 | 425 | 6586 | 0
10 | default | spacer | 720 | 3553 | 968 | 0 | 0 | 0 | 0 | 1681 | 0 | 0
10 | default | masher | 1440 | 1442 | 1409 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | default | masher-all | 1440 | 1619 | 1592 | 0 | 0 | 0 | 0 | 35 | 0 | 0
10 | proposed | timer | 720 | 2142 | 1643 | 2110 | 5106 | 404 | 0 | 404 | 6812 | 0
10 | proposed | reader | 720 | 2279 | 1784 | 2234 | 5035 | 414 | 0 | 414 | 6855 | 0
10 | proposed | punisher | 720 | 2111 | 1617 | 2063 | 4756 | 357 | 0 | 357 | 6462 | 0
10 | proposed | spacer | 720 | 2709 | 622 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed | masher | 1440 | 1878 | 1377 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed | masher-all | 1440 | 2318 | 1931 | 0 | 0 | 0 | 0 | 253 | 0 | 0
10 | default+slow | timer | 720 | 2243 | 1738 | 2187 | 4855 | 545 | 0 | 570 | 6497 | 0
10 | default+slow | reader | 720 | 2357 | 1840 | 2306 | 4957 | 638 | 0 | 658 | 6625 | 0
10 | default+slow | punisher | 720 | 2145 | 1622 | 2074 | 4568 | 477 | 0 | 502 | 6165 | 0
10 | default+slow | spacer | 720 | 3895 | 1066 | 0 | 0 | 0 | 0 | 2113 | 0 | 0
10 | default+slow | masher | 1440 | 1365 | 1339 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | default+slow | masher-all | 1440 | 1790 | 1769 | 0 | 0 | 0 | 0 | 21 | 0 | 0
10 | proposed+slow | timer | 720 | 2121 | 1647 | 2081 | 4880 | 502 | 0 | 502 | 6459 | 0
10 | proposed+slow | reader | 720 | 2422 | 1892 | 2359 | 4935 | 588 | 0 | 588 | 6706 | 0
10 | proposed+slow | punisher | 720 | 2112 | 1629 | 2058 | 4502 | 484 | 0 | 484 | 6076 | 0
10 | proposed+slow | spacer | 720 | 2851 | 630 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed+slow | masher | 1440 | 1965 | 1475 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed+slow | masher-all | 1440 | 2813 | 2317 | 0 | 0 | 0 | 0 | 180 | 0 | 0
10 | default+hold | timer | 720 | 1338 | 1051 | 1311 | 5179 | 273 | 0 | 277 | 6217 | 0
10 | default+hold | reader | 720 | 1422 | 1138 | 1397 | 4992 | 290 | 0 | 292 | 6099 | 0
10 | default+hold | punisher | 720 | 1248 | 964 | 1214 | 4700 | 221 | 0 | 227 | 5693 | 0
10 | default+hold | spacer | 720 | 1946 | 712 | 0 | 0 | 0 | 0 | 726 | 0 | 0
10 | default+hold | masher | 1440 | 1340 | 1313 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | default+hold | masher-all | 1440 | 1577 | 1545 | 0 | 0 | 0 | 0 | 23 | 0 | 0
10 | proposed+hold | timer | 720 | 1308 | 1054 | 1282 | 4913 | 235 | 0 | 235 | 5960 | 0
10 | proposed+hold | reader | 720 | 1371 | 1112 | 1343 | 4976 | 279 | 0 | 279 | 6040 | 0
10 | proposed+hold | punisher | 720 | 1232 | 972 | 1205 | 4654 | 199 | 0 | 199 | 5660 | 0
10 | proposed+hold | spacer | 720 | 1757 | 512 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed+hold | masher | 1440 | 1249 | 1106 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed+hold | masher-all | 1440 | 2034 | 1740 | 0 | 0 | 0 | 0 | 211 | 0 | 0
10 | default+hold,slow | timer | 720 | 1320 | 1078 | 1279 | 4775 | 314 | 0 | 337 | 5740 | 0
10 | default+hold,slow | reader | 720 | 1418 | 1158 | 1382 | 4834 | 393 | 0 | 407 | 5823 | 0
10 | default+hold,slow | punisher | 720 | 1219 | 974 | 1179 | 4509 | 286 | 0 | 308 | 5402 | 0
10 | default+hold,slow | spacer | 720 | 2124 | 797 | 0 | 0 | 0 | 0 | 986 | 0 | 0
10 | default+hold,slow | masher | 1440 | 1309 | 1285 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | default+hold,slow | masher-all | 1440 | 1730 | 1705 | 0 | 0 | 0 | 0 | 22 | 0 | 0
10 | proposed+hold,slow | timer | 720 | 1306 | 1065 | 1282 | 4689 | 278 | 0 | 278 | 5693 | 0
10 | proposed+hold,slow | reader | 720 | 1433 | 1157 | 1400 | 4857 | 373 | 0 | 373 | 5884 | 0
10 | proposed+hold,slow | punisher | 720 | 1248 | 998 | 1231 | 4398 | 284 | 0 | 284 | 5345 | 0
10 | proposed+hold,slow | spacer | 720 | 1764 | 530 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed+hold,slow | masher | 1440 | 1260 | 1121 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed+hold,slow | masher-all | 1440 | 2404 | 2010 | 0 | 0 | 0 | 0 | 145 | 0 | 0
10 | default+deliberate,slow | timer | 720 | 1104 | 927 | 1070 | 4734 | 249 | 0 | 262 | 5555 | 0
10 | default+deliberate,slow | reader | 720 | 1187 | 1004 | 1157 | 4800 | 315 | 0 | 323 | 5642 | 0
10 | default+deliberate,slow | punisher | 720 | 1045 | 867 | 1009 | 4492 | 233 | 0 | 247 | 5268 | 0
10 | default+deliberate,slow | spacer | 720 | 1501 | 775 | 0 | 0 | 0 | 0 | 609 | 0 | 0
10 | default+deliberate,slow | masher | 1440 | 1238 | 1212 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | default+deliberate,slow | masher-all | 1440 | 1704 | 1678 | 0 | 0 | 0 | 0 | 26 | 0 | 0
10 | proposed+deliberate,slow | timer | 720 | 1097 | 939 | 1074 | 4723 | 223 | 0 | 223 | 5574 | 0
10 | proposed+deliberate,slow | reader | 720 | 1210 | 1024 | 1178 | 4716 | 309 | 0 | 309 | 5585 | 0
10 | proposed+deliberate,slow | punisher | 720 | 1032 | 867 | 1014 | 4393 | 221 | 0 | 221 | 5186 | 0
10 | proposed+deliberate,slow | spacer | 720 | 1141 | 500 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed+deliberate,slow | masher | 1440 | 961 | 957 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed+deliberate,slow | masher-all | 1440 | 2266 | 1998 | 0 | 0 | 0 | 0 | 136 | 0 | 0
15 | default | timer | 720 | 2158 | 1612 | 2126 | 3584 | 91 | 51 | 170 | 5568 | 0
15 | default | reader | 720 | 2192 | 1641 | 2154 | 3601 | 103 | 50 | 180 | 5602 | 0
15 | default | punisher | 720 | 2162 | 1607 | 2130 | 3514 | 96 | 36 | 160 | 5512 | 0
15 | default | spacer | 720 | 2694 | 684 | 0 | 0 | 0 | 0 | 532 | 0 | 0
15 | default | masher | 1440 | 852 | 814 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | default | masher-all | 1440 | 1344 | 1320 | 0 | 0 | 0 | 0 | 17 | 0 | 0
15 | proposed | timer | 720 | 2178 | 1651 | 2155 | 3584 | 98 | 35 | 136 | 5606 | 0
15 | proposed | reader | 720 | 2224 | 1631 | 2197 | 3586 | 116 | 41 | 157 | 5626 | 0
15 | proposed | punisher | 720 | 2095 | 1587 | 2070 | 3650 | 94 | 24 | 118 | 5602 | 0
15 | proposed | spacer | 720 | 2445 | 608 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed | masher | 1440 | 1330 | 901 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed | masher-all | 1440 | 1912 | 1315 | 0 | 0 | 0 | 0 | 203 | 0 | 0
15 | default+slow | timer | 720 | 2525 | 1940 | 2486 | 4194 | 565 | 0 | 581 | 6115 | 0
15 | default+slow | reader | 720 | 2461 | 1925 | 2418 | 4246 | 593 | 0 | 602 | 6071 | 0
15 | default+slow | punisher | 720 | 2395 | 1844 | 2348 | 4021 | 479 | 0 | 495 | 5890 | 0
15 | default+slow | spacer | 720 | 2863 | 665 | 0 | 0 | 0 | 0 | 604 | 0 | 0
15 | default+slow | masher | 1440 | 1083 | 1043 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | default+slow | masher-all | 1440 | 2021 | 1985 | 0 | 0 | 0 | 0 | 18 | 0 | 0
15 | proposed+slow | timer | 720 | 2379 | 1861 | 2341 | 4215 | 447 | 0 | 447 | 6109 | 0
15 | proposed+slow | reader | 720 | 2412 | 1875 | 2383 | 4311 | 498 | 0 | 498 | 6196 | 0
15 | proposed+slow | punisher | 720 | 2245 | 1714 | 2198 | 4220 | 444 | 0 | 444 | 5974 | 0
15 | proposed+slow | spacer | 720 | 2575 | 597 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed+slow | masher | 1440 | 1700 | 1284 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed+slow | masher-all | 1440 | 3271 | 2632 | 0 | 0 | 0 | 0 | 213 | 0 | 0
15 | default+hold | timer | 720 | 1411 | 1076 | 1390 | 3658 | 53 | 47 | 109 | 4948 | 0
15 | default+hold | reader | 720 | 1415 | 1114 | 1403 | 3831 | 47 | 47 | 105 | 5140 | 0
15 | default+hold | punisher | 720 | 1379 | 1076 | 1350 | 3710 | 39 | 45 | 96 | 4976 | 0
15 | default+hold | spacer | 720 | 1639 | 534 | 0 | 0 | 0 | 0 | 317 | 0 | 0
15 | default+hold | masher | 1440 | 920 | 883 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | default+hold | masher-all | 1440 | 1462 | 1423 | 0 | 0 | 0 | 0 | 17 | 0 | 0
15 | proposed+hold | timer | 720 | 1377 | 1055 | 1353 | 3486 | 47 | 29 | 79 | 4763 | 0
15 | proposed+hold | reader | 720 | 1419 | 1088 | 1412 | 3542 | 53 | 20 | 73 | 4881 | 0
15 | proposed+hold | punisher | 720 | 1354 | 1041 | 1331 | 3481 | 47 | 15 | 62 | 4750 | 0
15 | proposed+hold | spacer | 720 | 1562 | 473 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed+hold | masher | 1440 | 900 | 730 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed+hold | masher-all | 1440 | 1729 | 1294 | 0 | 0 | 0 | 0 | 176 | 0 | 0
15 | default+hold,slow | timer | 720 | 1562 | 1218 | 1528 | 4002 | 388 | 0 | 401 | 5142 | 0
15 | default+hold,slow | reader | 720 | 1496 | 1204 | 1468 | 4138 | 380 | 0 | 393 | 5226 | 0
15 | default+hold,slow | punisher | 720 | 1462 | 1143 | 1434 | 3987 | 289 | 0 | 310 | 5132 | 0
15 | default+hold,slow | spacer | 720 | 1691 | 502 | 0 | 0 | 0 | 0 | 398 | 0 | 0
15 | default+hold,slow | masher | 1440 | 960 | 929 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | default+hold,slow | masher-all | 1440 | 1903 | 1862 | 0 | 0 | 0 | 0 | 18 | 0 | 0
15 | proposed+hold,slow | timer | 720 | 1443 | 1104 | 1417 | 3864 | 248 | 0 | 248 | 5033 | 0
15 | proposed+hold,slow | reader | 720 | 1527 | 1201 | 1502 | 4119 | 293 | 0 | 293 | 5328 | 0
15 | proposed+hold,slow | punisher | 720 | 1376 | 1032 | 1343 | 3845 | 251 | 0 | 251 | 4937 | 0
15 | proposed+hold,slow | spacer | 720 | 1620 | 497 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed+hold,slow | masher | 1440 | 1045 | 874 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed+hold,slow | masher-all | 1440 | 2785 | 2264 | 0 | 0 | 0 | 0 | 170 | 0 | 0
15 | default+deliberate,slow | timer | 720 | 1336 | 1081 | 1308 | 3979 | 335 | 0 | 344 | 4952 | 0
15 | default+deliberate,slow | reader | 720 | 1263 | 1067 | 1240 | 4095 | 313 | 0 | 319 | 5022 | 0
15 | default+deliberate,slow | punisher | 720 | 1245 | 1030 | 1221 | 3914 | 255 | 0 | 269 | 4880 | 0
15 | default+deliberate,slow | spacer | 720 | 1102 | 484 | 0 | 0 | 0 | 0 | 269 | 0 | 0
15 | default+deliberate,slow | masher | 1440 | 859 | 831 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | default+deliberate,slow | masher-all | 1440 | 1921 | 1879 | 0 | 0 | 0 | 0 | 11 | 0 | 0
15 | proposed+deliberate,slow | timer | 720 | 1196 | 955 | 1177 | 3791 | 218 | 0 | 218 | 4750 | 0
15 | proposed+deliberate,slow | reader | 720 | 1271 | 1055 | 1247 | 3994 | 247 | 0 | 247 | 4994 | 0
15 | proposed+deliberate,slow | punisher | 720 | 1115 | 879 | 1096 | 3792 | 221 | 0 | 221 | 4667 | 0
15 | proposed+deliberate,slow | spacer | 720 | 1039 | 469 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed+deliberate,slow | masher | 1440 | 760 | 740 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed+deliberate,slow | masher-all | 1440 | 2592 | 2207 | 0 | 0 | 0 | 0 | 166 | 0 | 0

## Sanity vs random

Delay | Mode | Bot | Wins; 95% range | Screen
--- | --- | --- | --- | ---
10 | default | spacer | 4.7% (17/360); 95% 2.5–7.4% | UNTRUSTED
10 | default | timer | 98.6% (355/360); 95% 96.8–99.7% | passes
10 | default | reader | 98.3% (354/360); 95% 96.4–99.4% | passes
10 | default | punisher | 97.2% (350/360); 95% 95.0–98.6% | passes
10 | default | masher | 85.6% (308/360); 95% 81.5–88.9% | passes
10 | default | masher-all | 89.2% (321/360); 95% 85.5–92.2% | passes
10 | proposed | spacer | 1.1% (4/360); 95% 0.3–2.8% | UNTRUSTED
10 | proposed | timer | 98.6% (355/360); 95% 96.8–99.7% | passes
10 | proposed | reader | 97.2% (350/360); 95% 95.0–98.9% | passes
10 | proposed | punisher | 95.0% (342/360); 95% 92.2–96.9% | passes
10 | proposed | masher | 85.6% (308/360); 95% 81.5–88.9% | passes
10 | proposed | masher-all | 92.2% (332/360); 95% 89.0–94.7% | passes
10 | default+slow | spacer | 9.2% (33/360); 95% 6.1–12.6% | UNTRUSTED
10 | default+slow | timer | 98.3% (354/360); 95% 96.4–99.4% | passes
10 | default+slow | reader | 98.1% (353/360); 95% 96.0–99.2% | passes
10 | default+slow | punisher | 98.6% (355/360); 95% 96.8–99.7% | passes
10 | default+slow | masher | 88.1% (317/360); 95% 84.3–91.4% | passes
10 | default+slow | masher-all | 83.3% (300/360); 95% 79.1–86.9% | passes
10 | proposed+slow | spacer | 1.9% (7/360); 95% 0.8–4.0% | UNTRUSTED
10 | proposed+slow | timer | 99.7% (359/360); 95% 98.4–100.0% | passes
10 | proposed+slow | reader | 100.0% (360/360); 95% 98.9–100.0% | passes
10 | proposed+slow | punisher | 100.0% (360/360); 95% 98.9–100.0% | passes
10 | proposed+slow | masher | 87.8% (316/360); 95% 84.0–91.1% | passes
10 | proposed+slow | masher-all | 86.7% (312/360); 95% 82.8–90.0% | passes
10 | default+hold | spacer | 4.7% (17/360); 95% 2.8–7.4% | UNTRUSTED
10 | default+hold | timer | 99.2% (357/360); 95% 97.6–100.0% | passes
10 | default+hold | reader | 98.6% (355/360); 95% 96.8–99.7% | passes
10 | default+hold | punisher | 97.5% (351/360); 95% 95.3–98.9% | passes
10 | default+hold | masher | 89.2% (321/360); 95% 85.5–92.2% | passes
10 | default+hold | masher-all | 86.4% (311/360); 95% 82.5–90.0% | passes
10 | proposed+hold | spacer | 1.9% (7/360); 95% 0.6–4.0% | UNTRUSTED
10 | proposed+hold | timer | 98.9% (356/360); 95% 97.2–99.7% | passes
10 | proposed+hold | reader | 97.8% (352/360); 95% 95.7–99.2% | passes
10 | proposed+hold | punisher | 97.2% (350/360); 95% 95.0–98.6% | passes
10 | proposed+hold | masher | 87.5% (315/360); 95% 83.7–90.8% | passes
10 | proposed+hold | masher-all | 88.1% (317/360); 95% 84.2–91.4% | passes
10 | default+hold,slow | spacer | 9.4% (34/360); 95% 6.4–13.1% | UNTRUSTED
10 | default+hold,slow | timer | 98.9% (356/360); 95% 97.2–100.0% | passes
10 | default+hold,slow | reader | 97.8% (352/360); 95% 95.7–99.2% | passes
10 | default+hold,slow | punisher | 98.6% (355/360); 95% 96.8–99.7% | passes
10 | default+hold,slow | masher | 91.9% (331/360); 95% 88.7–94.4% | passes
10 | default+hold,slow | masher-all | 78.1% (281/360); 95% 73.5–82.2% | passes
10 | proposed+hold,slow | spacer | 2.2% (8/360); 95% 0.8–4.3% | UNTRUSTED
10 | proposed+hold,slow | timer | 99.7% (359/360); 95% 98.4–100.0% | passes
10 | proposed+hold,slow | reader | 99.7% (359/360); 95% 98.4–100.0% | passes
10 | proposed+hold,slow | punisher | 100.0% (360/360); 95% 98.9–100.0% | passes
10 | proposed+hold,slow | masher | 91.7% (330/360); 95% 88.4–94.4% | passes
10 | proposed+hold,slow | masher-all | 80.8% (291/360); 95% 76.5–85.0% | passes
10 | default+deliberate,slow | spacer | 9.7% (35/360); 95% 6.7–13.3% | UNTRUSTED
10 | default+deliberate,slow | timer | 98.9% (356/360); 95% 97.2–100.0% | passes
10 | default+deliberate,slow | reader | 97.8% (352/360); 95% 95.7–99.2% | passes
10 | default+deliberate,slow | punisher | 98.6% (355/360); 95% 96.8–99.7% | passes
10 | default+deliberate,slow | masher | 92.2% (332/360); 95% 89.0–95.0% | passes
10 | default+deliberate,slow | masher-all | 80.0% (288/360); 95% 75.6–84.2% | passes
10 | proposed+deliberate,slow | spacer | 2.2% (8/360); 95% 0.8–4.3% | UNTRUSTED
10 | proposed+deliberate,slow | timer | 99.7% (359/360); 95% 98.4–100.0% | passes
10 | proposed+deliberate,slow | reader | 99.7% (359/360); 95% 98.4–100.0% | passes
10 | proposed+deliberate,slow | punisher | 100.0% (360/360); 95% 98.9–100.0% | passes
10 | proposed+deliberate,slow | masher | 91.7% (330/360); 95% 88.4–94.4% | passes
10 | proposed+deliberate,slow | masher-all | 82.2% (296/360); 95% 77.9–86.1% | passes
15 | default | spacer | 0.8% (3/360); 95% 0.0–2.4% | UNTRUSTED
15 | default | timer | 87.2% (314/360); 95% 83.4–90.3% | passes
15 | default | reader | 86.9% (313/360); 95% 83.1–90.3% | passes
15 | default | punisher | 91.4% (329/360); 95% 88.0–93.9% | passes
15 | default | masher | 83.3% (300/360); 95% 79.1–87.2% | passes
15 | default | masher-all | 90.8% (327/360); 95% 87.4–93.9% | passes
15 | proposed | spacer | 0.3% (1/360); 95% 0.0–1.6% | UNTRUSTED
15 | proposed | timer | 91.4% (329/360); 95% 88.0–94.2% | passes
15 | proposed | reader | 93.1% (335/360); 95% 89.9–95.6% | passes
15 | proposed | punisher | 91.7% (330/360); 95% 88.4–94.2% | passes
15 | proposed | masher | 83.3% (300/360); 95% 79.1–87.2% | passes
15 | proposed | masher-all | 90.6% (326/360); 95% 87.1–93.3% | passes
15 | default+slow | spacer | 1.4% (5/360); 95% 0.3–3.2% | UNTRUSTED
15 | default+slow | timer | 95.0% (342/360); 95% 92.2–96.9% | passes
15 | default+slow | reader | 96.7% (348/360); 95% 94.3–98.3% | passes
15 | default+slow | punisher | 98.3% (354/360); 95% 96.4–99.4% | passes
15 | default+slow | masher | 88.6% (319/360); 95% 84.9–91.7% | passes
15 | default+slow | masher-all | 85.3% (307/360); 95% 81.2–88.9% | passes
15 | proposed+slow | spacer | 0.6% (2/360); 95% 0.0–2.0% | UNTRUSTED
15 | proposed+slow | timer | 98.6% (355/360); 95% 96.8–99.7% | passes
15 | proposed+slow | reader | 98.9% (356/360); 95% 97.2–99.7% | passes
15 | proposed+slow | punisher | 98.6% (355/360); 95% 96.8–99.7% | passes
15 | proposed+slow | masher | 86.7% (312/360); 95% 82.8–90.0% | passes
15 | proposed+slow | masher-all | 88.1% (317/360); 95% 84.3–91.1% | passes
15 | default+hold | spacer | 0.8% (3/360); 95% 0.0–2.4% | UNTRUSTED
15 | default+hold | timer | 87.8% (316/360); 95% 84.0–91.1% | passes
15 | default+hold | reader | 88.9% (320/360); 95% 85.2–91.9% | passes
15 | default+hold | punisher | 90.3% (325/360); 95% 86.8–93.1% | passes
15 | default+hold | masher | 85.8% (309/360); 95% 81.9–89.4% | passes
15 | default+hold | masher-all | 86.9% (313/360); 95% 83.1–90.3% | passes
15 | proposed+hold | spacer | 0.3% (1/360); 95% 0.0–1.6% | UNTRUSTED
15 | proposed+hold | timer | 94.2% (339/360); 95% 91.2–96.4% | passes
15 | proposed+hold | reader | 93.6% (337/360); 95% 90.6–95.8% | passes
15 | proposed+hold | punisher | 94.7% (341/360); 95% 91.9–96.7% | passes
15 | proposed+hold | masher | 86.7% (312/360); 95% 82.8–90.0% | passes
15 | proposed+hold | masher-all | 87.5% (315/360); 95% 83.7–90.6% | passes
15 | default+hold,slow | spacer | 1.4% (5/360); 95% 0.3–3.2% | UNTRUSTED
15 | default+hold,slow | timer | 95.8% (345/360); 95% 93.2–97.8% | passes
15 | default+hold,slow | reader | 95.0% (342/360); 95% 92.2–96.9% | passes
15 | default+hold,slow | punisher | 98.3% (354/360); 95% 96.4–99.4% | passes
15 | default+hold,slow | masher | 89.2% (321/360); 95% 85.5–92.2% | passes
15 | default+hold,slow | masher-all | 83.3% (300/360); 95% 79.1–86.9% | passes
15 | proposed+hold,slow | spacer | 0.8% (3/360); 95% 0.0–2.4% | UNTRUSTED
15 | proposed+hold,slow | timer | 98.3% (354/360); 95% 96.4–99.4% | passes
15 | proposed+hold,slow | reader | 99.2% (357/360); 95% 97.6–100.0% | passes
15 | proposed+hold,slow | punisher | 98.3% (354/360); 95% 96.4–99.4% | passes
15 | proposed+hold,slow | masher | 88.1% (317/360); 95% 84.3–91.1% | passes
15 | proposed+hold,slow | masher-all | 85.3% (307/360); 95% 81.2–88.6% | passes
15 | default+deliberate,slow | spacer | 1.4% (5/360); 95% 0.3–3.2% | UNTRUSTED
15 | default+deliberate,slow | timer | 95.6% (344/360); 95% 92.9–97.5% | passes
15 | default+deliberate,slow | reader | 95.3% (343/360); 95% 92.6–97.2% | passes
15 | default+deliberate,slow | punisher | 98.3% (354/360); 95% 96.4–99.4% | passes
15 | default+deliberate,slow | masher | 89.7% (323/360); 95% 86.2–92.5% | passes
15 | default+deliberate,slow | masher-all | 82.2% (296/360); 95% 77.9–86.1% | passes
15 | proposed+deliberate,slow | spacer | 0.8% (3/360); 95% 0.0–2.4% | UNTRUSTED
15 | proposed+deliberate,slow | timer | 98.3% (354/360); 95% 96.4–99.4% | passes
15 | proposed+deliberate,slow | reader | 99.2% (357/360); 95% 97.6–100.0% | passes
15 | proposed+deliberate,slow | punisher | 98.3% (354/360); 95% 96.4–99.4% | passes
15 | proposed+deliberate,slow | masher | 88.1% (317/360); 95% 84.3–91.0% | passes
15 | proposed+deliberate,slow | masher-all | 83.3% (300/360); 95% 79.1–86.8% | passes

## All paired mode comparisons

Delay | Group / opponent | A | B | A minus B | Interpretation
--- | --- | --- | --- | --- | ---
10 | skilled/masher | default | proposed | 1.8 pp | could be luck
10 | skilled/masher-all | default | proposed | 5.5 pp | could be luck
10 | punisher/masher | default | proposed | 2.5 pp | could be luck
10 | punisher/masher-all | default | proposed | 3.9 pp | could be luck
10 | spacer/masher | default | proposed | 5.8 pp | could be luck
10 | spacer/masher-all | default | proposed | 1.4 pp | could be luck
10 | defence-capable/masher | default | proposed | 0.6 pp | could be luck
10 | defence-capable/masher-all | default | proposed | 6.3 pp | could be luck
10 | skilled/masher | default | default+slow | -1.5 pp | could be luck
10 | skilled/masher-all | default | default+slow | -8.1 pp | ranges do not overlap
10 | punisher/masher | default | default+slow | -0.3 pp | could be luck
10 | punisher/masher-all | default | default+slow | -12.8 pp | ranges do not overlap
10 | spacer/masher | default | default+slow | -7.5 pp | could be luck
10 | spacer/masher-all | default | default+slow | -1.1 pp | could be luck
10 | defence-capable/masher | default | default+slow | 0.9 pp | could be luck
10 | defence-capable/masher-all | default | default+slow | -12.0 pp | ranges do not overlap
10 | skilled/masher | default | proposed+slow | 2.7 pp | could be luck
10 | skilled/masher-all | default | proposed+slow | -5.9 pp | could be luck
10 | punisher/masher | default | proposed+slow | 3.9 pp | could be luck
10 | punisher/masher-all | default | proposed+slow | -9.2 pp | ranges do not overlap
10 | spacer/masher | default | proposed+slow | 4.2 pp | could be luck
10 | spacer/masher-all | default | proposed+slow | 1.4 pp | could be luck
10 | defence-capable/masher | default | proposed+slow | 2.6 pp | could be luck
10 | defence-capable/masher-all | default | proposed+slow | -9.4 pp | ranges do not overlap
10 | skilled/masher | default | default+hold | -1.9 pp | could be luck
10 | skilled/masher-all | default | default+hold | -4.3 pp | could be luck
10 | punisher/masher | default | default+hold | 1.9 pp | could be luck
10 | punisher/masher-all | default | default+hold | -7.5 pp | could be luck
10 | spacer/masher | default | default+hold | -8.6 pp | could be luck
10 | spacer/masher-all | default | default+hold | -0.3 pp | could be luck
10 | defence-capable/masher | default | default+hold | 1.7 pp | could be luck
10 | defence-capable/masher-all | default | default+hold | -6.7 pp | could be luck
10 | skilled/masher | default | proposed+hold | 0.0 pp | could be luck
10 | skilled/masher-all | default | proposed+hold | -1.9 pp | could be luck
10 | punisher/masher | default | proposed+hold | 4.4 pp | could be luck
10 | punisher/masher-all | default | proposed+hold | -1.1 pp | could be luck
10 | spacer/masher | default | proposed+hold | -5.6 pp | could be luck
10 | spacer/masher-all | default | proposed+hold | 1.1 pp | could be luck
10 | defence-capable/masher | default | proposed+hold | 3.3 pp | could be luck
10 | defence-capable/masher-all | default | proposed+hold | -2.7 pp | could be luck
10 | skilled/masher | default | default+hold,slow | -3.6 pp | could be luck
10 | skilled/masher-all | default | default+hold,slow | -8.5 pp | ranges do not overlap
10 | punisher/masher | default | default+hold,slow | 2.2 pp | could be luck
10 | punisher/masher-all | default | default+hold,slow | -15.6 pp | ranges do not overlap
10 | spacer/masher | default | default+hold,slow | -10.8 pp | ranges do not overlap
10 | spacer/masher-all | default | default+hold,slow | -1.9 pp | could be luck
10 | defence-capable/masher | default | default+hold,slow | 0.7 pp | could be luck
10 | defence-capable/masher-all | default | default+hold,slow | -13.1 pp | ranges do not overlap
10 | skilled/masher | default | proposed+hold,slow | -1.3 pp | could be luck
10 | skilled/masher-all | default | proposed+hold,slow | -9.0 pp | ranges do not overlap
10 | punisher/masher | default | proposed+hold,slow | 1.7 pp | could be luck
10 | punisher/masher-all | default | proposed+hold,slow | -12.5 pp | ranges do not overlap
10 | spacer/masher | default | proposed+hold,slow | -5.6 pp | could be luck
10 | spacer/masher-all | default | proposed+hold,slow | 0.3 pp | could be luck
10 | defence-capable/masher | default | proposed+hold,slow | 1.1 pp | could be luck
10 | defence-capable/masher-all | default | proposed+hold,slow | -13.2 pp | ranges do not overlap
10 | skilled/masher | default | default+deliberate,slow | -5.2 pp | could be luck
10 | skilled/masher-all | default | default+deliberate,slow | -9.6 pp | ranges do not overlap
10 | punisher/masher | default | default+deliberate,slow | 1.4 pp | could be luck
10 | punisher/masher-all | default | default+deliberate,slow | -16.1 pp | ranges do not overlap
10 | spacer/masher | default | default+deliberate,slow | -16.7 pp | ranges do not overlap
10 | spacer/masher-all | default | default+deliberate,slow | -2.2 pp | could be luck
10 | defence-capable/masher | default | default+deliberate,slow | 0.8 pp | could be luck
10 | defence-capable/masher-all | default | default+deliberate,slow | -14.3 pp | ranges do not overlap
10 | skilled/masher | default | proposed+deliberate,slow | -3.7 pp | could be luck
10 | skilled/masher-all | default | proposed+deliberate,slow | -8.6 pp | ranges do not overlap
10 | punisher/masher | default | proposed+deliberate,slow | 3.1 pp | could be luck
10 | punisher/masher-all | default | proposed+deliberate,slow | -13.1 pp | ranges do not overlap
10 | spacer/masher | default | proposed+deliberate,slow | -13.3 pp | ranges do not overlap
10 | spacer/masher-all | default | proposed+deliberate,slow | 0.3 pp | could be luck
10 | defence-capable/masher | default | proposed+deliberate,slow | 1.8 pp | could be luck
10 | defence-capable/masher-all | default | proposed+deliberate,slow | -13.1 pp | ranges do not overlap
10 | skilled/masher | proposed | default+slow | -3.2 pp | could be luck
10 | skilled/masher-all | proposed | default+slow | -13.6 pp | ranges do not overlap
10 | punisher/masher | proposed | default+slow | -2.8 pp | could be luck
10 | punisher/masher-all | proposed | default+slow | -16.7 pp | ranges do not overlap
10 | spacer/masher | proposed | default+slow | -13.3 pp | ranges do not overlap
10 | spacer/masher-all | proposed | default+slow | -2.5 pp | could be luck
10 | defence-capable/masher | proposed | default+slow | 0.3 pp | could be luck
10 | defence-capable/masher-all | proposed | default+slow | -18.3 pp | ranges do not overlap
10 | skilled/masher | proposed | proposed+slow | 0.9 pp | could be luck
10 | skilled/masher-all | proposed | proposed+slow | -11.4 pp | ranges do not overlap
10 | punisher/masher | proposed | proposed+slow | 1.4 pp | could be luck
10 | punisher/masher-all | proposed | proposed+slow | -13.1 pp | ranges do not overlap
10 | spacer/masher | proposed | proposed+slow | -1.7 pp | could be luck
10 | spacer/masher-all | proposed | proposed+slow | 0.0 pp | could be luck
10 | defence-capable/masher | proposed | proposed+slow | 1.9 pp | could be luck
10 | defence-capable/masher-all | proposed | proposed+slow | -15.7 pp | ranges do not overlap
10 | skilled/masher | proposed | default+hold | -3.6 pp | could be luck
10 | skilled/masher-all | proposed | default+hold | -9.7 pp | ranges do not overlap
10 | punisher/masher | proposed | default+hold | -0.6 pp | could be luck
10 | punisher/masher-all | proposed | default+hold | -11.4 pp | ranges do not overlap
10 | spacer/masher | proposed | default+hold | -14.4 pp | ranges do not overlap
10 | spacer/masher-all | proposed | default+hold | -1.7 pp | could be luck
10 | defence-capable/masher | proposed | default+hold | 1.0 pp | could be luck
10 | defence-capable/masher-all | proposed | default+hold | -13.0 pp | ranges do not overlap
10 | skilled/masher | proposed | proposed+hold | -1.8 pp | could be luck
10 | skilled/masher-all | proposed | proposed+hold | -7.4 pp | ranges do not overlap
10 | punisher/masher | proposed | proposed+hold | 1.9 pp | could be luck
10 | punisher/masher-all | proposed | proposed+hold | -5.0 pp | could be luck
10 | spacer/masher | proposed | proposed+hold | -11.4 pp | ranges do not overlap
10 | spacer/masher-all | proposed | proposed+hold | -0.3 pp | could be luck
10 | defence-capable/masher | proposed | proposed+hold | 2.7 pp | could be luck
10 | defence-capable/masher-all | proposed | proposed+hold | -9.0 pp | ranges do not overlap
10 | skilled/masher | proposed | default+hold,slow | -5.4 pp | could be luck
10 | skilled/masher-all | proposed | default+hold,slow | -14.0 pp | ranges do not overlap
10 | punisher/masher | proposed | default+hold,slow | -0.3 pp | could be luck
10 | punisher/masher-all | proposed | default+hold,slow | -19.4 pp | ranges do not overlap
10 | spacer/masher | proposed | default+hold,slow | -16.7 pp | ranges do not overlap
10 | spacer/masher-all | proposed | default+hold,slow | -3.3 pp | ranges do not overlap
10 | defence-capable/masher | proposed | default+hold,slow | 0.1 pp | could be luck
10 | defence-capable/masher-all | proposed | default+hold,slow | -19.4 pp | ranges do not overlap
10 | skilled/masher | proposed | proposed+hold,slow | -3.1 pp | could be luck
10 | skilled/masher-all | proposed | proposed+hold,slow | -14.4 pp | ranges do not overlap
10 | punisher/masher | proposed | proposed+hold,slow | -0.8 pp | could be luck
10 | punisher/masher-all | proposed | proposed+hold,slow | -16.4 pp | ranges do not overlap
10 | spacer/masher | proposed | proposed+hold,slow | -11.4 pp | ranges do not overlap
10 | spacer/masher-all | proposed | proposed+hold,slow | -1.1 pp | could be luck
10 | defence-capable/masher | proposed | proposed+hold,slow | 0.5 pp | could be luck
10 | defence-capable/masher-all | proposed | proposed+hold,slow | -19.5 pp | ranges do not overlap
10 | skilled/masher | proposed | default+deliberate,slow | -6.9 pp | ranges do not overlap
10 | skilled/masher-all | proposed | default+deliberate,slow | -15.1 pp | ranges do not overlap
10 | punisher/masher | proposed | default+deliberate,slow | -1.1 pp | could be luck
10 | punisher/masher-all | proposed | default+deliberate,slow | -20.0 pp | ranges do not overlap
10 | spacer/masher | proposed | default+deliberate,slow | -22.5 pp | ranges do not overlap
10 | spacer/masher-all | proposed | default+deliberate,slow | -3.6 pp | ranges do not overlap
10 | defence-capable/masher | proposed | default+deliberate,slow | 0.2 pp | could be luck
10 | defence-capable/masher-all | proposed | default+deliberate,slow | -20.6 pp | ranges do not overlap
10 | skilled/masher | proposed | proposed+deliberate,slow | -5.5 pp | could be luck
10 | skilled/masher-all | proposed | proposed+deliberate,slow | -14.1 pp | ranges do not overlap
10 | punisher/masher | proposed | proposed+deliberate,slow | 0.6 pp | could be luck
10 | punisher/masher-all | proposed | proposed+deliberate,slow | -16.9 pp | ranges do not overlap
10 | spacer/masher | proposed | proposed+deliberate,slow | -19.2 pp | ranges do not overlap
10 | spacer/masher-all | proposed | proposed+deliberate,slow | -1.1 pp | could be luck
10 | defence-capable/masher | proposed | proposed+deliberate,slow | 1.1 pp | could be luck
10 | defence-capable/masher-all | proposed | proposed+deliberate,slow | -19.4 pp | ranges do not overlap
10 | skilled/masher | default+slow | proposed+slow | 4.2 pp | could be luck
10 | skilled/masher-all | default+slow | proposed+slow | 2.2 pp | could be luck
10 | punisher/masher | default+slow | proposed+slow | 4.2 pp | could be luck
10 | punisher/masher-all | default+slow | proposed+slow | 3.6 pp | could be luck
10 | spacer/masher | default+slow | proposed+slow | 11.7 pp | ranges do not overlap
10 | spacer/masher-all | default+slow | proposed+slow | 2.5 pp | could be luck
10 | defence-capable/masher | default+slow | proposed+slow | 1.7 pp | could be luck
10 | defence-capable/masher-all | default+slow | proposed+slow | 2.6 pp | could be luck
10 | skilled/masher | default+slow | default+hold | -0.4 pp | could be luck
10 | skilled/masher-all | default+slow | default+hold | 3.9 pp | could be luck
10 | punisher/masher | default+slow | default+hold | 2.2 pp | could be luck
10 | punisher/masher-all | default+slow | default+hold | 5.3 pp | could be luck
10 | spacer/masher | default+slow | default+hold | -1.1 pp | could be luck
10 | spacer/masher-all | default+slow | default+hold | 0.8 pp | could be luck
10 | defence-capable/masher | default+slow | default+hold | 0.7 pp | could be luck
10 | defence-capable/masher-all | default+slow | default+hold | 5.4 pp | could be luck
10 | skilled/masher | default+slow | proposed+hold | 1.5 pp | could be luck
10 | skilled/masher-all | default+slow | proposed+hold | 6.2 pp | ranges do not overlap
10 | punisher/masher | default+slow | proposed+hold | 4.7 pp | could be luck
10 | punisher/masher-all | default+slow | proposed+hold | 11.7 pp | ranges do not overlap
10 | spacer/masher | default+slow | proposed+hold | 1.9 pp | could be luck
10 | spacer/masher-all | default+slow | proposed+hold | 2.2 pp | could be luck
10 | defence-capable/masher | default+slow | proposed+hold | 2.4 pp | could be luck
10 | defence-capable/masher-all | default+slow | proposed+hold | 9.4 pp | ranges do not overlap
10 | skilled/masher | default+slow | default+hold,slow | -2.1 pp | could be luck
10 | skilled/masher-all | default+slow | default+hold,slow | -0.4 pp | could be luck
10 | punisher/masher | default+slow | default+hold,slow | 2.5 pp | could be luck
10 | punisher/masher-all | default+slow | default+hold,slow | -2.8 pp | could be luck
10 | spacer/masher | default+slow | default+hold,slow | -3.3 pp | could be luck
10 | spacer/masher-all | default+slow | default+hold,slow | -0.8 pp | could be luck
10 | defence-capable/masher | default+slow | default+hold,slow | -0.2 pp | could be luck
10 | defence-capable/masher-all | default+slow | default+hold,slow | -1.0 pp | could be luck
10 | skilled/masher | default+slow | proposed+hold,slow | 0.2 pp | could be luck
10 | skilled/masher-all | default+slow | proposed+hold,slow | -0.8 pp | could be luck
10 | punisher/masher | default+slow | proposed+hold,slow | 1.9 pp | could be luck
10 | punisher/masher-all | default+slow | proposed+hold,slow | 0.3 pp | could be luck
10 | spacer/masher | default+slow | proposed+hold,slow | 1.9 pp | could be luck
10 | spacer/masher-all | default+slow | proposed+hold,slow | 1.4 pp | could be luck
10 | defence-capable/masher | default+slow | proposed+hold,slow | 0.2 pp | could be luck
10 | defence-capable/masher-all | default+slow | proposed+hold,slow | -1.2 pp | could be luck
10 | skilled/masher | default+slow | default+deliberate,slow | -3.7 pp | could be luck
10 | skilled/masher-all | default+slow | default+deliberate,slow | -1.5 pp | could be luck
10 | punisher/masher | default+slow | default+deliberate,slow | 1.7 pp | could be luck
10 | punisher/masher-all | default+slow | default+deliberate,slow | -3.3 pp | could be luck
10 | spacer/masher | default+slow | default+deliberate,slow | -9.2 pp | could be luck
10 | spacer/masher-all | default+slow | default+deliberate,slow | -1.1 pp | could be luck
10 | defence-capable/masher | default+slow | default+deliberate,slow | -0.1 pp | could be luck
10 | defence-capable/masher-all | default+slow | default+deliberate,slow | -2.2 pp | could be luck
10 | skilled/masher | default+slow | proposed+deliberate,slow | -2.2 pp | could be luck
10 | skilled/masher-all | default+slow | proposed+deliberate,slow | -0.5 pp | could be luck
10 | punisher/masher | default+slow | proposed+deliberate,slow | 3.3 pp | could be luck
10 | punisher/masher-all | default+slow | proposed+deliberate,slow | -0.3 pp | could be luck
10 | spacer/masher | default+slow | proposed+deliberate,slow | -5.8 pp | could be luck
10 | spacer/masher-all | default+slow | proposed+deliberate,slow | 1.4 pp | could be luck
10 | defence-capable/masher | default+slow | proposed+deliberate,slow | 0.8 pp | could be luck
10 | defence-capable/masher-all | default+slow | proposed+deliberate,slow | -1.0 pp | could be luck
10 | skilled/masher | proposed+slow | default+hold | -4.5 pp | could be luck
10 | skilled/masher-all | proposed+slow | default+hold | 1.7 pp | could be luck
10 | punisher/masher | proposed+slow | default+hold | -1.9 pp | could be luck
10 | punisher/masher-all | proposed+slow | default+hold | 1.7 pp | could be luck
10 | spacer/masher | proposed+slow | default+hold | -12.8 pp | ranges do not overlap
10 | spacer/masher-all | proposed+slow | default+hold | -1.7 pp | could be luck
10 | defence-capable/masher | proposed+slow | default+hold | -0.9 pp | could be luck
10 | defence-capable/masher-all | proposed+slow | default+hold | 2.8 pp | could be luck
10 | skilled/masher | proposed+slow | proposed+hold | -2.7 pp | could be luck
10 | skilled/masher-all | proposed+slow | proposed+hold | 4.0 pp | could be luck
10 | punisher/masher | proposed+slow | proposed+hold | 0.6 pp | could be luck
10 | punisher/masher-all | proposed+slow | proposed+hold | 8.1 pp | could be luck
10 | spacer/masher | proposed+slow | proposed+hold | -9.7 pp | ranges do not overlap
10 | spacer/masher-all | proposed+slow | proposed+hold | -0.3 pp | could be luck
10 | defence-capable/masher | proposed+slow | proposed+hold | 0.7 pp | could be luck
10 | defence-capable/masher-all | proposed+slow | proposed+hold | 6.8 pp | ranges do not overlap
10 | skilled/masher | proposed+slow | default+hold,slow | -6.3 pp | ranges do not overlap
10 | skilled/masher-all | proposed+slow | default+hold,slow | -2.6 pp | could be luck
10 | punisher/masher | proposed+slow | default+hold,slow | -1.7 pp | could be luck
10 | punisher/masher-all | proposed+slow | default+hold,slow | -6.4 pp | could be luck
10 | spacer/masher | proposed+slow | default+hold,slow | -15.0 pp | ranges do not overlap
10 | spacer/masher-all | proposed+slow | default+hold,slow | -3.3 pp | ranges do not overlap
10 | defence-capable/masher | proposed+slow | default+hold,slow | -1.9 pp | could be luck
10 | defence-capable/masher-all | proposed+slow | default+hold,slow | -3.6 pp | could be luck
10 | skilled/masher | proposed+slow | proposed+hold,slow | -4.0 pp | could be luck
10 | skilled/masher-all | proposed+slow | proposed+hold,slow | -3.1 pp | could be luck
10 | punisher/masher | proposed+slow | proposed+hold,slow | -2.2 pp | could be luck
10 | punisher/masher-all | proposed+slow | proposed+hold,slow | -3.3 pp | could be luck
10 | spacer/masher | proposed+slow | proposed+hold,slow | -9.7 pp | ranges do not overlap
10 | spacer/masher-all | proposed+slow | proposed+hold,slow | -1.1 pp | could be luck
10 | defence-capable/masher | proposed+slow | proposed+hold,slow | -1.5 pp | could be luck
10 | defence-capable/masher-all | proposed+slow | proposed+hold,slow | -3.8 pp | could be luck
10 | skilled/masher | proposed+slow | default+deliberate,slow | -7.9 pp | ranges do not overlap
10 | skilled/masher-all | proposed+slow | default+deliberate,slow | -3.7 pp | could be luck
10 | punisher/masher | proposed+slow | default+deliberate,slow | -2.5 pp | could be luck
10 | punisher/masher-all | proposed+slow | default+deliberate,slow | -6.9 pp | ranges do not overlap
10 | spacer/masher | proposed+slow | default+deliberate,slow | -20.8 pp | ranges do not overlap
10 | spacer/masher-all | proposed+slow | default+deliberate,slow | -3.6 pp | ranges do not overlap
10 | defence-capable/masher | proposed+slow | default+deliberate,slow | -1.8 pp | could be luck
10 | defence-capable/masher-all | proposed+slow | default+deliberate,slow | -4.8 pp | ranges do not overlap
10 | skilled/masher | proposed+slow | proposed+deliberate,slow | -6.4 pp | ranges do not overlap
10 | skilled/masher-all | proposed+slow | proposed+deliberate,slow | -2.7 pp | could be luck
10 | punisher/masher | proposed+slow | proposed+deliberate,slow | -0.8 pp | could be luck
10 | punisher/masher-all | proposed+slow | proposed+deliberate,slow | -3.9 pp | could be luck
10 | spacer/masher | proposed+slow | proposed+deliberate,slow | -17.5 pp | ranges do not overlap
10 | spacer/masher-all | proposed+slow | proposed+deliberate,slow | -1.1 pp | could be luck
10 | defence-capable/masher | proposed+slow | proposed+deliberate,slow | -0.8 pp | could be luck
10 | defence-capable/masher-all | proposed+slow | proposed+deliberate,slow | -3.6 pp | could be luck
10 | skilled/masher | default+hold | proposed+hold | 1.9 pp | could be luck
10 | skilled/masher-all | default+hold | proposed+hold | 2.3 pp | could be luck
10 | punisher/masher | default+hold | proposed+hold | 2.5 pp | could be luck
10 | punisher/masher-all | default+hold | proposed+hold | 6.4 pp | could be luck
10 | spacer/masher | default+hold | proposed+hold | 3.1 pp | could be luck
10 | spacer/masher-all | default+hold | proposed+hold | 1.4 pp | could be luck
10 | defence-capable/masher | default+hold | proposed+hold | 1.7 pp | could be luck
10 | defence-capable/masher-all | default+hold | proposed+hold | 4.0 pp | could be luck
10 | skilled/masher | default+hold | default+hold,slow | -1.8 pp | could be luck
10 | skilled/masher-all | default+hold | default+hold,slow | -4.3 pp | could be luck
10 | punisher/masher | default+hold | default+hold,slow | 0.3 pp | could be luck
10 | punisher/masher-all | default+hold | default+hold,slow | -8.1 pp | ranges do not overlap
10 | spacer/masher | default+hold | default+hold,slow | -2.2 pp | could be luck
10 | spacer/masher-all | default+hold | default+hold,slow | -1.7 pp | could be luck
10 | defence-capable/masher | default+hold | default+hold,slow | -0.9 pp | could be luck
10 | defence-capable/masher-all | default+hold | default+hold,slow | -6.4 pp | ranges do not overlap
10 | skilled/masher | default+hold | proposed+hold,slow | 0.6 pp | could be luck
10 | skilled/masher-all | default+hold | proposed+hold,slow | -4.7 pp | could be luck
10 | punisher/masher | default+hold | proposed+hold,slow | -0.3 pp | could be luck
10 | punisher/masher-all | default+hold | proposed+hold,slow | -5.0 pp | could be luck
10 | spacer/masher | default+hold | proposed+hold,slow | 3.1 pp | could be luck
10 | spacer/masher-all | default+hold | proposed+hold,slow | 0.6 pp | could be luck
10 | defence-capable/masher | default+hold | proposed+hold,slow | -0.6 pp | could be luck
10 | defence-capable/masher-all | default+hold | proposed+hold,slow | -6.6 pp | ranges do not overlap
10 | skilled/masher | default+hold | default+deliberate,slow | -3.3 pp | could be luck
10 | skilled/masher-all | default+hold | default+deliberate,slow | -5.4 pp | could be luck
10 | punisher/masher | default+hold | default+deliberate,slow | -0.6 pp | could be luck
10 | punisher/masher-all | default+hold | default+deliberate,slow | -8.6 pp | ranges do not overlap
10 | spacer/masher | default+hold | default+deliberate,slow | -8.1 pp | could be luck
10 | spacer/masher-all | default+hold | default+deliberate,slow | -1.9 pp | could be luck
10 | defence-capable/masher | default+hold | default+deliberate,slow | -0.8 pp | could be luck
10 | defence-capable/masher-all | default+hold | default+deliberate,slow | -7.6 pp | ranges do not overlap
10 | skilled/masher | default+hold | proposed+deliberate,slow | -1.9 pp | could be luck
10 | skilled/masher-all | default+hold | proposed+deliberate,slow | -4.4 pp | could be luck
10 | punisher/masher | default+hold | proposed+deliberate,slow | 1.1 pp | could be luck
10 | punisher/masher-all | default+hold | proposed+deliberate,slow | -5.6 pp | could be luck
10 | spacer/masher | default+hold | proposed+deliberate,slow | -4.7 pp | could be luck
10 | spacer/masher-all | default+hold | proposed+deliberate,slow | 0.6 pp | could be luck
10 | defence-capable/masher | default+hold | proposed+deliberate,slow | 0.1 pp | could be luck
10 | defence-capable/masher-all | default+hold | proposed+deliberate,slow | -6.4 pp | ranges do not overlap
10 | skilled/masher | proposed+hold | default+hold,slow | -3.6 pp | could be luck
10 | skilled/masher-all | proposed+hold | default+hold,slow | -6.6 pp | ranges do not overlap
10 | punisher/masher | proposed+hold | default+hold,slow | -2.2 pp | could be luck
10 | punisher/masher-all | proposed+hold | default+hold,slow | -14.4 pp | ranges do not overlap
10 | spacer/masher | proposed+hold | default+hold,slow | -5.3 pp | could be luck
10 | spacer/masher-all | proposed+hold | default+hold,slow | -3.1 pp | could be luck
10 | defence-capable/masher | proposed+hold | default+hold,slow | -2.6 pp | could be luck
10 | defence-capable/masher-all | proposed+hold | default+hold,slow | -10.4 pp | ranges do not overlap
10 | skilled/masher | proposed+hold | proposed+hold,slow | -1.3 pp | could be luck
10 | skilled/masher-all | proposed+hold | proposed+hold,slow | -7.0 pp | ranges do not overlap
10 | punisher/masher | proposed+hold | proposed+hold,slow | -2.8 pp | could be luck
10 | punisher/masher-all | proposed+hold | proposed+hold,slow | -11.4 pp | ranges do not overlap
10 | spacer/masher | proposed+hold | proposed+hold,slow | 0.0 pp | could be luck
10 | spacer/masher-all | proposed+hold | proposed+hold,slow | -0.8 pp | could be luck
10 | defence-capable/masher | proposed+hold | proposed+hold,slow | -2.2 pp | could be luck
10 | defence-capable/masher-all | proposed+hold | proposed+hold,slow | -10.6 pp | ranges do not overlap
10 | skilled/masher | proposed+hold | default+deliberate,slow | -5.2 pp | could be luck
10 | skilled/masher-all | proposed+hold | default+deliberate,slow | -7.7 pp | ranges do not overlap
10 | punisher/masher | proposed+hold | default+deliberate,slow | -3.1 pp | could be luck
10 | punisher/masher-all | proposed+hold | default+deliberate,slow | -15.0 pp | ranges do not overlap
10 | spacer/masher | proposed+hold | default+deliberate,slow | -11.1 pp | ranges do not overlap
10 | spacer/masher-all | proposed+hold | default+deliberate,slow | -3.3 pp | ranges do not overlap
10 | defence-capable/masher | proposed+hold | default+deliberate,slow | -2.5 pp | could be luck
10 | defence-capable/masher-all | proposed+hold | default+deliberate,slow | -11.6 pp | ranges do not overlap
10 | skilled/masher | proposed+hold | proposed+deliberate,slow | -3.7 pp | could be luck
10 | skilled/masher-all | proposed+hold | proposed+deliberate,slow | -6.7 pp | ranges do not overlap
10 | punisher/masher | proposed+hold | proposed+deliberate,slow | -1.4 pp | could be luck
10 | punisher/masher-all | proposed+hold | proposed+deliberate,slow | -11.9 pp | ranges do not overlap
10 | spacer/masher | proposed+hold | proposed+deliberate,slow | -7.8 pp | could be luck
10 | spacer/masher-all | proposed+hold | proposed+deliberate,slow | -0.8 pp | could be luck
10 | defence-capable/masher | proposed+hold | proposed+deliberate,slow | -1.6 pp | could be luck
10 | defence-capable/masher-all | proposed+hold | proposed+deliberate,slow | -10.4 pp | ranges do not overlap
10 | skilled/masher | default+hold,slow | proposed+hold,slow | 2.3 pp | could be luck
10 | skilled/masher-all | default+hold,slow | proposed+hold,slow | -0.5 pp | could be luck
10 | punisher/masher | default+hold,slow | proposed+hold,slow | -0.6 pp | could be luck
10 | punisher/masher-all | default+hold,slow | proposed+hold,slow | 3.1 pp | could be luck
10 | spacer/masher | default+hold,slow | proposed+hold,slow | 5.3 pp | could be luck
10 | spacer/masher-all | default+hold,slow | proposed+hold,slow | 2.2 pp | could be luck
10 | defence-capable/masher | default+hold,slow | proposed+hold,slow | 0.4 pp | could be luck
10 | defence-capable/masher-all | default+hold,slow | proposed+hold,slow | -0.2 pp | could be luck
10 | skilled/masher | default+hold,slow | default+deliberate,slow | -1.6 pp | could be luck
10 | skilled/masher-all | default+hold,slow | default+deliberate,slow | -1.1 pp | could be luck
10 | punisher/masher | default+hold,slow | default+deliberate,slow | -0.8 pp | could be luck
10 | punisher/masher-all | default+hold,slow | default+deliberate,slow | -0.6 pp | could be luck
10 | spacer/masher | default+hold,slow | default+deliberate,slow | -5.8 pp | could be luck
10 | spacer/masher-all | default+hold,slow | default+deliberate,slow | -0.3 pp | could be luck
10 | defence-capable/masher | default+hold,slow | default+deliberate,slow | 0.1 pp | could be luck
10 | defence-capable/masher-all | default+hold,slow | default+deliberate,slow | -1.2 pp | could be luck
10 | skilled/masher | default+hold,slow | proposed+deliberate,slow | -0.1 pp | could be luck
10 | skilled/masher-all | default+hold,slow | proposed+deliberate,slow | -0.1 pp | could be luck
10 | punisher/masher | default+hold,slow | proposed+deliberate,slow | 0.8 pp | could be luck
10 | punisher/masher-all | default+hold,slow | proposed+deliberate,slow | 2.5 pp | could be luck
10 | spacer/masher | default+hold,slow | proposed+deliberate,slow | -2.5 pp | could be luck
10 | spacer/masher-all | default+hold,slow | proposed+deliberate,slow | 2.2 pp | could be luck
10 | defence-capable/masher | default+hold,slow | proposed+deliberate,slow | 1.0 pp | could be luck
10 | defence-capable/masher-all | default+hold,slow | proposed+deliberate,slow | 0.0 pp | could be luck
10 | skilled/masher | proposed+hold,slow | default+deliberate,slow | -3.9 pp | could be luck
10 | skilled/masher-all | proposed+hold,slow | default+deliberate,slow | -0.6 pp | could be luck
10 | punisher/masher | proposed+hold,slow | default+deliberate,slow | -0.3 pp | could be luck
10 | punisher/masher-all | proposed+hold,slow | default+deliberate,slow | -3.6 pp | could be luck
10 | spacer/masher | proposed+hold,slow | default+deliberate,slow | -11.1 pp | ranges do not overlap
10 | spacer/masher-all | proposed+hold,slow | default+deliberate,slow | -2.5 pp | could be luck
10 | defence-capable/masher | proposed+hold,slow | default+deliberate,slow | -0.3 pp | could be luck
10 | defence-capable/masher-all | proposed+hold,slow | default+deliberate,slow | -1.0 pp | could be luck
10 | skilled/masher | proposed+hold,slow | proposed+deliberate,slow | -2.4 pp | could be luck
10 | skilled/masher-all | proposed+hold,slow | proposed+deliberate,slow | 0.4 pp | could be luck
10 | punisher/masher | proposed+hold,slow | proposed+deliberate,slow | 1.4 pp | could be luck
10 | punisher/masher-all | proposed+hold,slow | proposed+deliberate,slow | -0.6 pp | could be luck
10 | spacer/masher | proposed+hold,slow | proposed+deliberate,slow | -7.8 pp | could be luck
10 | spacer/masher-all | proposed+hold,slow | proposed+deliberate,slow | 0.0 pp | could be luck
10 | defence-capable/masher | proposed+hold,slow | proposed+deliberate,slow | 0.6 pp | could be luck
10 | defence-capable/masher-all | proposed+hold,slow | proposed+deliberate,slow | 0.2 pp | could be luck
10 | skilled/masher | default+deliberate,slow | proposed+deliberate,slow | 1.5 pp | could be luck
10 | skilled/masher-all | default+deliberate,slow | proposed+deliberate,slow | 1.0 pp | could be luck
10 | punisher/masher | default+deliberate,slow | proposed+deliberate,slow | 1.7 pp | could be luck
10 | punisher/masher-all | default+deliberate,slow | proposed+deliberate,slow | 3.1 pp | could be luck
10 | spacer/masher | default+deliberate,slow | proposed+deliberate,slow | 3.3 pp | could be luck
10 | spacer/masher-all | default+deliberate,slow | proposed+deliberate,slow | 2.5 pp | could be luck
10 | defence-capable/masher | default+deliberate,slow | proposed+deliberate,slow | 0.9 pp | could be luck
10 | defence-capable/masher-all | default+deliberate,slow | proposed+deliberate,slow | 1.2 pp | could be luck
15 | skilled/masher | default | proposed | -1.4 pp | could be luck
15 | skilled/masher-all | default | proposed | -0.1 pp | could be luck
15 | punisher/masher | default | proposed | -5.0 pp | could be luck
15 | punisher/masher-all | default | proposed | -3.1 pp | could be luck
15 | spacer/masher | default | proposed | 0.8 pp | could be luck
15 | spacer/masher-all | default | proposed | 0.0 pp | could be luck
15 | defence-capable/masher | default | proposed | -3.3 pp | could be luck
15 | defence-capable/masher-all | default | proposed | -1.1 pp | could be luck
15 | skilled/masher | default | default+slow | -4.1 pp | could be luck
15 | skilled/masher-all | default | default+slow | -22.3 pp | ranges do not overlap
15 | punisher/masher | default | default+slow | -8.9 pp | could be luck
15 | punisher/masher-all | default | default+slow | -33.9 pp | ranges do not overlap
15 | spacer/masher | default | default+slow | -2.2 pp | could be luck
15 | spacer/masher-all | default | default+slow | -0.3 pp | could be luck
15 | defence-capable/masher | default | default+slow | -6.3 pp | could be luck
15 | defence-capable/masher-all | default | default+slow | -33.5 pp | ranges do not overlap
15 | skilled/masher | default | proposed+slow | -5.1 pp | could be luck
15 | skilled/masher-all | default | proposed+slow | -22.4 pp | ranges do not overlap
15 | punisher/masher | default | proposed+slow | -13.1 pp | ranges do not overlap
15 | punisher/masher-all | default | proposed+slow | -35.8 pp | ranges do not overlap
15 | spacer/masher | default | proposed+slow | 1.9 pp | could be luck
15 | spacer/masher-all | default | proposed+slow | -0.3 pp | could be luck
15 | defence-capable/masher | default | proposed+slow | -10.1 pp | ranges do not overlap
15 | defence-capable/masher-all | default | proposed+slow | -34.3 pp | ranges do not overlap
15 | skilled/masher | default | default+hold | -4.4 pp | could be luck
15 | skilled/masher-all | default | default+hold | -5.1 pp | could be luck
15 | punisher/masher | default | default+hold | -3.6 pp | could be luck
15 | punisher/masher-all | default | default+hold | -11.7 pp | ranges do not overlap
15 | spacer/masher | default | default+hold | -7.2 pp | ranges do not overlap
15 | spacer/masher-all | default | default+hold | 0.0 pp | could be luck
15 | defence-capable/masher | default | default+hold | -3.1 pp | could be luck
15 | defence-capable/masher-all | default | default+hold | -9.0 pp | ranges do not overlap
15 | skilled/masher | default | proposed+hold | -1.3 pp | could be luck
15 | skilled/masher-all | default | proposed+hold | -4.5 pp | could be luck
15 | punisher/masher | default | proposed+hold | -0.3 pp | could be luck
15 | punisher/masher-all | default | proposed+hold | -6.9 pp | could be luck
15 | spacer/masher | default | proposed+hold | -6.4 pp | ranges do not overlap
15 | spacer/masher-all | default | proposed+hold | 0.0 pp | could be luck
15 | defence-capable/masher | default | proposed+hold | 0.7 pp | could be luck
15 | defence-capable/masher-all | default | proposed+hold | -6.9 pp | could be luck
15 | skilled/masher | default | default+hold,slow | -4.6 pp | could be luck
15 | skilled/masher-all | default | default+hold,slow | -23.5 pp | ranges do not overlap
15 | punisher/masher | default | default+hold,slow | -4.4 pp | could be luck
15 | punisher/masher-all | default | default+hold,slow | -33.9 pp | ranges do not overlap
15 | spacer/masher | default | default+hold,slow | -8.6 pp | ranges do not overlap
15 | spacer/masher-all | default | default+hold,slow | 0.0 pp | could be luck
15 | defence-capable/masher | default | default+hold,slow | -3.2 pp | could be luck
15 | defence-capable/masher-all | default | default+hold,slow | -34.8 pp | ranges do not overlap
15 | skilled/masher | default | proposed+hold,slow | -2.7 pp | could be luck
15 | skilled/masher-all | default | proposed+hold,slow | -21.3 pp | ranges do not overlap
15 | punisher/masher | default | proposed+hold,slow | -1.9 pp | could be luck
15 | punisher/masher-all | default | proposed+hold,slow | -34.7 pp | ranges do not overlap
15 | spacer/masher | default | proposed+hold,slow | -7.2 pp | ranges do not overlap
15 | spacer/masher-all | default | proposed+hold,slow | 0.0 pp | could be luck
15 | defence-capable/masher | default | proposed+hold,slow | -0.9 pp | could be luck
15 | defence-capable/masher-all | default | proposed+hold,slow | -32.9 pp | ranges do not overlap
15 | skilled/masher | default | default+deliberate,slow | -4.8 pp | could be luck
15 | skilled/masher-all | default | default+deliberate,slow | -23.7 pp | ranges do not overlap
15 | punisher/masher | default | default+deliberate,slow | 0.0 pp | could be luck
15 | punisher/masher-all | default | default+deliberate,slow | -34.7 pp | ranges do not overlap
15 | spacer/masher | default | default+deliberate,slow | -16.1 pp | ranges do not overlap
15 | spacer/masher-all | default | default+deliberate,slow | 0.0 pp | could be luck
15 | defence-capable/masher | default | default+deliberate,slow | 0.6 pp | could be luck
15 | defence-capable/masher-all | default | default+deliberate,slow | -35.3 pp | ranges do not overlap
15 | skilled/masher | default | proposed+deliberate,slow | -5.8 pp | could be luck
15 | skilled/masher-all | default | proposed+deliberate,slow | -19.2 pp | ranges do not overlap
15 | punisher/masher | default | proposed+deliberate,slow | -2.5 pp | could be luck
15 | punisher/masher-all | default | proposed+deliberate,slow | -31.7 pp | ranges do not overlap
15 | spacer/masher | default | proposed+deliberate,slow | -18.1 pp | ranges do not overlap
15 | spacer/masher-all | default | proposed+deliberate,slow | 0.0 pp | could be luck
15 | defence-capable/masher | default | proposed+deliberate,slow | -0.6 pp | could be luck
15 | defence-capable/masher-all | default | proposed+deliberate,slow | -29.7 pp | ranges do not overlap
15 | skilled/masher | proposed | default+slow | -2.7 pp | could be luck
15 | skilled/masher-all | proposed | default+slow | -22.2 pp | ranges do not overlap
15 | punisher/masher | proposed | default+slow | -3.9 pp | could be luck
15 | punisher/masher-all | proposed | default+slow | -30.8 pp | ranges do not overlap
15 | spacer/masher | proposed | default+slow | -3.1 pp | could be luck
15 | spacer/masher-all | proposed | default+slow | -0.3 pp | could be luck
15 | defence-capable/masher | proposed | default+slow | -3.0 pp | could be luck
15 | defence-capable/masher-all | proposed | default+slow | -32.4 pp | ranges do not overlap
15 | skilled/masher | proposed | proposed+slow | -3.7 pp | could be luck
15 | skilled/masher-all | proposed | proposed+slow | -22.3 pp | ranges do not overlap
15 | punisher/masher | proposed | proposed+slow | -8.1 pp | could be luck
15 | punisher/masher-all | proposed | proposed+slow | -32.8 pp | ranges do not overlap
15 | spacer/masher | proposed | proposed+slow | 1.1 pp | could be luck
15 | spacer/masher-all | proposed | proposed+slow | -0.3 pp | could be luck
15 | defence-capable/masher | proposed | proposed+slow | -6.8 pp | could be luck
15 | defence-capable/masher-all | proposed | proposed+slow | -33.1 pp | ranges do not overlap
15 | skilled/masher | proposed | default+hold | -3.0 pp | could be luck
15 | skilled/masher-all | proposed | default+hold | -5.0 pp | could be luck
15 | punisher/masher | proposed | default+hold | 1.4 pp | could be luck
15 | punisher/masher-all | proposed | default+hold | -8.6 pp | could be luck
15 | spacer/masher | proposed | default+hold | -8.1 pp | ranges do not overlap
15 | spacer/masher-all | proposed | default+hold | 0.0 pp | could be luck
15 | defence-capable/masher | proposed | default+hold | 0.2 pp | could be luck
15 | defence-capable/masher-all | proposed | default+hold | -7.9 pp | could be luck
15 | skilled/masher | proposed | proposed+hold | 0.1 pp | could be luck
15 | skilled/masher-all | proposed | proposed+hold | -4.4 pp | could be luck
15 | punisher/masher | proposed | proposed+hold | 4.7 pp | could be luck
15 | punisher/masher-all | proposed | proposed+hold | -3.9 pp | could be luck
15 | spacer/masher | proposed | proposed+hold | -7.2 pp | ranges do not overlap
15 | spacer/masher-all | proposed | proposed+hold | 0.0 pp | could be luck
15 | defence-capable/masher | proposed | proposed+hold | 4.1 pp | could be luck
15 | defence-capable/masher-all | proposed | proposed+hold | -5.7 pp | could be luck
15 | skilled/masher | proposed | default+hold,slow | -3.2 pp | could be luck
15 | skilled/masher-all | proposed | default+hold,slow | -23.4 pp | ranges do not overlap
15 | punisher/masher | proposed | default+hold,slow | 0.6 pp | could be luck
15 | punisher/masher-all | proposed | default+hold,slow | -30.8 pp | ranges do not overlap
15 | spacer/masher | proposed | default+hold,slow | -9.4 pp | ranges do not overlap
15 | spacer/masher-all | proposed | default+hold,slow | 0.0 pp | could be luck
15 | defence-capable/masher | proposed | default+hold,slow | 0.1 pp | could be luck
15 | defence-capable/masher-all | proposed | default+hold,slow | -33.7 pp | ranges do not overlap
15 | skilled/masher | proposed | proposed+hold,slow | -1.3 pp | could be luck
15 | skilled/masher-all | proposed | proposed+hold,slow | -21.2 pp | ranges do not overlap
15 | punisher/masher | proposed | proposed+hold,slow | 3.1 pp | could be luck
15 | punisher/masher-all | proposed | proposed+hold,slow | -31.7 pp | ranges do not overlap
15 | spacer/masher | proposed | proposed+hold,slow | -8.1 pp | ranges do not overlap
15 | spacer/masher-all | proposed | proposed+hold,slow | 0.0 pp | could be luck
15 | defence-capable/masher | proposed | proposed+hold,slow | 2.4 pp | could be luck
15 | defence-capable/masher-all | proposed | proposed+hold,slow | -31.8 pp | ranges do not overlap
15 | skilled/masher | proposed | default+deliberate,slow | -3.4 pp | could be luck
15 | skilled/masher-all | proposed | default+deliberate,slow | -23.6 pp | ranges do not overlap
15 | punisher/masher | proposed | default+deliberate,slow | 5.0 pp | could be luck
15 | punisher/masher-all | proposed | default+deliberate,slow | -31.7 pp | ranges do not overlap
15 | spacer/masher | proposed | default+deliberate,slow | -16.9 pp | ranges do not overlap
15 | spacer/masher-all | proposed | default+deliberate,slow | 0.0 pp | could be luck
15 | defence-capable/masher | proposed | default+deliberate,slow | 3.9 pp | could be luck
15 | defence-capable/masher-all | proposed | default+deliberate,slow | -34.2 pp | ranges do not overlap
15 | skilled/masher | proposed | proposed+deliberate,slow | -4.4 pp | could be luck
15 | skilled/masher-all | proposed | proposed+deliberate,slow | -19.1 pp | ranges do not overlap
15 | punisher/masher | proposed | proposed+deliberate,slow | 2.5 pp | could be luck
15 | punisher/masher-all | proposed | proposed+deliberate,slow | -28.6 pp | ranges do not overlap
15 | spacer/masher | proposed | proposed+deliberate,slow | -18.9 pp | ranges do not overlap
15 | spacer/masher-all | proposed | proposed+deliberate,slow | 0.0 pp | could be luck
15 | defence-capable/masher | proposed | proposed+deliberate,slow | 2.7 pp | could be luck
15 | defence-capable/masher-all | proposed | proposed+deliberate,slow | -28.6 pp | ranges do not overlap
15 | skilled/masher | default+slow | proposed+slow | -1.0 pp | could be luck
15 | skilled/masher-all | default+slow | proposed+slow | -0.1 pp | could be luck
15 | punisher/masher | default+slow | proposed+slow | -4.2 pp | could be luck
15 | punisher/masher-all | default+slow | proposed+slow | -1.9 pp | could be luck
15 | spacer/masher | default+slow | proposed+slow | 4.2 pp | could be luck
15 | spacer/masher-all | default+slow | proposed+slow | 0.0 pp | could be luck
15 | defence-capable/masher | default+slow | proposed+slow | -3.8 pp | could be luck
15 | defence-capable/masher-all | default+slow | proposed+slow | -0.7 pp | could be luck
15 | skilled/masher | default+slow | default+hold | -0.3 pp | could be luck
15 | skilled/masher-all | default+slow | default+hold | 17.2 pp | ranges do not overlap
15 | punisher/masher | default+slow | default+hold | 5.3 pp | could be luck
15 | punisher/masher-all | default+slow | default+hold | 22.2 pp | ranges do not overlap
15 | spacer/masher | default+slow | default+hold | -5.0 pp | could be luck
15 | spacer/masher-all | default+slow | default+hold | 0.3 pp | could be luck
15 | defence-capable/masher | default+slow | default+hold | 3.1 pp | could be luck
15 | defence-capable/masher-all | default+slow | default+hold | 24.5 pp | ranges do not overlap
15 | skilled/masher | default+slow | proposed+hold | 2.8 pp | could be luck
15 | skilled/masher-all | default+slow | proposed+hold | 17.8 pp | ranges do not overlap
15 | punisher/masher | default+slow | proposed+hold | 8.6 pp | could be luck
15 | punisher/masher-all | default+slow | proposed+hold | 26.9 pp | ranges do not overlap
15 | spacer/masher | default+slow | proposed+hold | -4.2 pp | could be luck
15 | spacer/masher-all | default+slow | proposed+hold | 0.3 pp | could be luck
15 | defence-capable/masher | default+slow | proposed+hold | 7.0 pp | could be luck
15 | defence-capable/masher-all | default+slow | proposed+hold | 26.7 pp | ranges do not overlap
15 | skilled/masher | default+slow | default+hold,slow | -0.6 pp | could be luck
15 | skilled/masher-all | default+slow | default+hold,slow | -1.2 pp | could be luck
15 | punisher/masher | default+slow | default+hold,slow | 4.4 pp | could be luck
15 | punisher/masher-all | default+slow | default+hold,slow | 0.0 pp | could be luck
15 | spacer/masher | default+slow | default+hold,slow | -6.4 pp | could be luck
15 | spacer/masher-all | default+slow | default+hold,slow | 0.3 pp | could be luck
15 | defence-capable/masher | default+slow | default+hold,slow | 3.1 pp | could be luck
15 | defence-capable/masher-all | default+slow | default+hold,slow | -1.3 pp | could be luck
15 | skilled/masher | default+slow | proposed+hold,slow | 1.4 pp | could be luck
15 | skilled/masher-all | default+slow | proposed+hold,slow | 1.0 pp | could be luck
15 | punisher/masher | default+slow | proposed+hold,slow | 6.9 pp | could be luck
15 | punisher/masher-all | default+slow | proposed+hold,slow | -0.8 pp | could be luck
15 | spacer/masher | default+slow | proposed+hold,slow | -5.0 pp | could be luck
15 | spacer/masher-all | default+slow | proposed+hold,slow | 0.3 pp | could be luck
15 | defence-capable/masher | default+slow | proposed+hold,slow | 5.4 pp | could be luck
15 | defence-capable/masher-all | default+slow | proposed+hold,slow | 0.6 pp | could be luck
15 | skilled/masher | default+slow | default+deliberate,slow | -0.7 pp | could be luck
15 | skilled/masher-all | default+slow | default+deliberate,slow | -1.4 pp | could be luck
15 | punisher/masher | default+slow | default+deliberate,slow | 8.9 pp | could be luck
15 | punisher/masher-all | default+slow | default+deliberate,slow | -0.8 pp | could be luck
15 | spacer/masher | default+slow | default+deliberate,slow | -13.9 pp | ranges do not overlap
15 | spacer/masher-all | default+slow | default+deliberate,slow | 0.3 pp | could be luck
15 | defence-capable/masher | default+slow | default+deliberate,slow | 6.9 pp | could be luck
15 | defence-capable/masher-all | default+slow | default+deliberate,slow | -1.8 pp | could be luck
15 | skilled/masher | default+slow | proposed+deliberate,slow | -1.8 pp | could be luck
15 | skilled/masher-all | default+slow | proposed+deliberate,slow | 3.1 pp | could be luck
15 | punisher/masher | default+slow | proposed+deliberate,slow | 6.4 pp | could be luck
15 | punisher/masher-all | default+slow | proposed+deliberate,slow | 2.2 pp | could be luck
15 | spacer/masher | default+slow | proposed+deliberate,slow | -15.8 pp | ranges do not overlap
15 | spacer/masher-all | default+slow | proposed+deliberate,slow | 0.3 pp | could be luck
15 | defence-capable/masher | default+slow | proposed+deliberate,slow | 5.6 pp | could be luck
15 | defence-capable/masher-all | default+slow | proposed+deliberate,slow | 3.8 pp | could be luck
15 | skilled/masher | proposed+slow | default+hold | 0.7 pp | could be luck
15 | skilled/masher-all | proposed+slow | default+hold | 17.3 pp | ranges do not overlap
15 | punisher/masher | proposed+slow | default+hold | 9.4 pp | could be luck
15 | punisher/masher-all | proposed+slow | default+hold | 24.2 pp | ranges do not overlap
15 | spacer/masher | proposed+slow | default+hold | -9.2 pp | ranges do not overlap
15 | spacer/masher-all | proposed+slow | default+hold | 0.3 pp | could be luck
15 | defence-capable/masher | proposed+slow | default+hold | 6.9 pp | could be luck
15 | defence-capable/masher-all | proposed+slow | default+hold | 25.3 pp | ranges do not overlap
15 | skilled/masher | proposed+slow | proposed+hold | 3.8 pp | could be luck
15 | skilled/masher-all | proposed+slow | proposed+hold | 17.9 pp | ranges do not overlap
15 | punisher/masher | proposed+slow | proposed+hold | 12.8 pp | ranges do not overlap
15 | punisher/masher-all | proposed+slow | proposed+hold | 28.9 pp | ranges do not overlap
15 | spacer/masher | proposed+slow | proposed+hold | -8.3 pp | ranges do not overlap
15 | spacer/masher-all | proposed+slow | proposed+hold | 0.3 pp | could be luck
15 | defence-capable/masher | proposed+slow | proposed+hold | 10.8 pp | ranges do not overlap
15 | defence-capable/masher-all | proposed+slow | proposed+hold | 27.4 pp | ranges do not overlap
15 | skilled/masher | proposed+slow | default+hold,slow | 0.5 pp | could be luck
15 | skilled/masher-all | proposed+slow | default+hold,slow | -1.1 pp | could be luck
15 | punisher/masher | proposed+slow | default+hold,slow | 8.6 pp | could be luck
15 | punisher/masher-all | proposed+slow | default+hold,slow | 1.9 pp | could be luck
15 | spacer/masher | proposed+slow | default+hold,slow | -10.6 pp | ranges do not overlap
15 | spacer/masher-all | proposed+slow | default+hold,slow | 0.3 pp | could be luck
15 | defence-capable/masher | proposed+slow | default+hold,slow | 6.9 pp | could be luck
15 | defence-capable/masher-all | proposed+slow | default+hold,slow | -0.6 pp | could be luck
15 | skilled/masher | proposed+slow | proposed+hold,slow | 2.4 pp | could be luck
15 | skilled/masher-all | proposed+slow | proposed+hold,slow | 1.1 pp | could be luck
15 | punisher/masher | proposed+slow | proposed+hold,slow | 11.1 pp | ranges do not overlap
15 | punisher/masher-all | proposed+slow | proposed+hold,slow | 1.1 pp | could be luck
15 | spacer/masher | proposed+slow | proposed+hold,slow | -9.2 pp | ranges do not overlap
15 | spacer/masher-all | proposed+slow | proposed+hold,slow | 0.3 pp | could be luck
15 | defence-capable/masher | proposed+slow | proposed+hold,slow | 9.2 pp | could be luck
15 | defence-capable/masher-all | proposed+slow | proposed+hold,slow | 1.4 pp | could be luck
15 | skilled/masher | proposed+slow | default+deliberate,slow | 0.3 pp | could be luck
15 | skilled/masher-all | proposed+slow | default+deliberate,slow | -1.3 pp | could be luck
15 | punisher/masher | proposed+slow | default+deliberate,slow | 13.1 pp | ranges do not overlap
15 | punisher/masher-all | proposed+slow | default+deliberate,slow | 1.1 pp | could be luck
15 | spacer/masher | proposed+slow | default+deliberate,slow | -18.1 pp | ranges do not overlap
15 | spacer/masher-all | proposed+slow | default+deliberate,slow | 0.3 pp | could be luck
15 | defence-capable/masher | proposed+slow | default+deliberate,slow | 10.6 pp | ranges do not overlap
15 | defence-capable/masher-all | proposed+slow | default+deliberate,slow | -1.0 pp | could be luck
15 | skilled/masher | proposed+slow | proposed+deliberate,slow | -0.7 pp | could be luck
15 | skilled/masher-all | proposed+slow | proposed+deliberate,slow | 3.2 pp | could be luck
15 | punisher/masher | proposed+slow | proposed+deliberate,slow | 10.6 pp | ranges do not overlap
15 | punisher/masher-all | proposed+slow | proposed+deliberate,slow | 4.2 pp | could be luck
15 | spacer/masher | proposed+slow | proposed+deliberate,slow | -20.0 pp | ranges do not overlap
15 | spacer/masher-all | proposed+slow | proposed+deliberate,slow | 0.3 pp | could be luck
15 | defence-capable/masher | proposed+slow | proposed+deliberate,slow | 9.4 pp | could be luck
15 | defence-capable/masher-all | proposed+slow | proposed+deliberate,slow | 4.5 pp | could be luck
15 | skilled/masher | default+hold | proposed+hold | 3.1 pp | could be luck
15 | skilled/masher-all | default+hold | proposed+hold | 0.6 pp | could be luck
15 | punisher/masher | default+hold | proposed+hold | 3.3 pp | could be luck
15 | punisher/masher-all | default+hold | proposed+hold | 4.7 pp | could be luck
15 | spacer/masher | default+hold | proposed+hold | 0.8 pp | could be luck
15 | spacer/masher-all | default+hold | proposed+hold | 0.0 pp | could be luck
15 | defence-capable/masher | default+hold | proposed+hold | 3.9 pp | could be luck
15 | defence-capable/masher-all | default+hold | proposed+hold | 2.1 pp | could be luck
15 | skilled/masher | default+hold | default+hold,slow | -0.3 pp | could be luck
15 | skilled/masher-all | default+hold | default+hold,slow | -18.4 pp | ranges do not overlap
15 | punisher/masher | default+hold | default+hold,slow | -0.8 pp | could be luck
15 | punisher/masher-all | default+hold | default+hold,slow | -22.2 pp | ranges do not overlap
15 | spacer/masher | default+hold | default+hold,slow | -1.4 pp | could be luck
15 | spacer/masher-all | default+hold | default+hold,slow | 0.0 pp | could be luck
15 | defence-capable/masher | default+hold | default+hold,slow | -0.1 pp | could be luck
15 | defence-capable/masher-all | default+hold | default+hold,slow | -25.8 pp | ranges do not overlap
15 | skilled/masher | default+hold | proposed+hold,slow | 1.7 pp | could be luck
15 | skilled/masher-all | default+hold | proposed+hold,slow | -16.2 pp | ranges do not overlap
15 | punisher/masher | default+hold | proposed+hold,slow | 1.7 pp | could be luck
15 | punisher/masher-all | default+hold | proposed+hold,slow | -23.1 pp | ranges do not overlap
15 | spacer/masher | default+hold | proposed+hold,slow | 0.0 pp | could be luck
15 | spacer/masher-all | default+hold | proposed+hold,slow | 0.0 pp | could be luck
15 | defence-capable/masher | default+hold | proposed+hold,slow | 2.2 pp | could be luck
15 | defence-capable/masher-all | default+hold | proposed+hold,slow | -23.9 pp | ranges do not overlap
15 | skilled/masher | default+hold | default+deliberate,slow | -0.5 pp | could be luck
15 | skilled/masher-all | default+hold | default+deliberate,slow | -18.6 pp | ranges do not overlap
15 | punisher/masher | default+hold | default+deliberate,slow | 3.6 pp | could be luck
15 | punisher/masher-all | default+hold | default+deliberate,slow | -23.1 pp | ranges do not overlap
15 | spacer/masher | default+hold | default+deliberate,slow | -8.9 pp | ranges do not overlap
15 | spacer/masher-all | default+hold | default+deliberate,slow | 0.0 pp | could be luck
15 | defence-capable/masher | default+hold | default+deliberate,slow | 3.7 pp | could be luck
15 | defence-capable/masher-all | default+hold | default+deliberate,slow | -26.3 pp | ranges do not overlap
15 | skilled/masher | default+hold | proposed+deliberate,slow | -1.5 pp | could be luck
15 | skilled/masher-all | default+hold | proposed+deliberate,slow | -14.1 pp | ranges do not overlap
15 | punisher/masher | default+hold | proposed+deliberate,slow | 1.1 pp | could be luck
15 | punisher/masher-all | default+hold | proposed+deliberate,slow | -20.0 pp | ranges do not overlap
15 | spacer/masher | default+hold | proposed+deliberate,slow | -10.8 pp | ranges do not overlap
15 | spacer/masher-all | default+hold | proposed+deliberate,slow | 0.0 pp | could be luck
15 | defence-capable/masher | default+hold | proposed+deliberate,slow | 2.5 pp | could be luck
15 | defence-capable/masher-all | default+hold | proposed+deliberate,slow | -20.7 pp | ranges do not overlap
15 | skilled/masher | proposed+hold | default+hold,slow | -3.3 pp | could be luck
15 | skilled/masher-all | proposed+hold | default+hold,slow | -19.0 pp | ranges do not overlap
15 | punisher/masher | proposed+hold | default+hold,slow | -4.2 pp | could be luck
15 | punisher/masher-all | proposed+hold | default+hold,slow | -26.9 pp | ranges do not overlap
15 | spacer/masher | proposed+hold | default+hold,slow | -2.2 pp | could be luck
15 | spacer/masher-all | proposed+hold | default+hold,slow | 0.0 pp | could be luck
15 | defence-capable/masher | proposed+hold | default+hold,slow | -4.0 pp | could be luck
15 | defence-capable/masher-all | proposed+hold | default+hold,slow | -28.0 pp | ranges do not overlap
15 | skilled/masher | proposed+hold | proposed+hold,slow | -1.4 pp | could be luck
15 | skilled/masher-all | proposed+hold | proposed+hold,slow | -16.8 pp | ranges do not overlap
15 | punisher/masher | proposed+hold | proposed+hold,slow | -1.7 pp | could be luck
15 | punisher/masher-all | proposed+hold | proposed+hold,slow | -27.8 pp | ranges do not overlap
15 | spacer/masher | proposed+hold | proposed+hold,slow | -0.8 pp | could be luck
15 | spacer/masher-all | proposed+hold | proposed+hold,slow | 0.0 pp | could be luck
15 | defence-capable/masher | proposed+hold | proposed+hold,slow | -1.7 pp | could be luck
15 | defence-capable/masher-all | proposed+hold | proposed+hold,slow | -26.0 pp | ranges do not overlap
15 | skilled/masher | proposed+hold | default+deliberate,slow | -3.5 pp | could be luck
15 | skilled/masher-all | proposed+hold | default+deliberate,slow | -19.2 pp | ranges do not overlap
15 | punisher/masher | proposed+hold | default+deliberate,slow | 0.3 pp | could be luck
15 | punisher/masher-all | proposed+hold | default+deliberate,slow | -27.8 pp | ranges do not overlap
15 | spacer/masher | proposed+hold | default+deliberate,slow | -9.7 pp | ranges do not overlap
15 | spacer/masher-all | proposed+hold | default+deliberate,slow | 0.0 pp | could be luck
15 | defence-capable/masher | proposed+hold | default+deliberate,slow | -0.2 pp | could be luck
15 | defence-capable/masher-all | proposed+hold | default+deliberate,slow | -28.4 pp | ranges do not overlap
15 | skilled/masher | proposed+hold | proposed+deliberate,slow | -4.5 pp | could be luck
15 | skilled/masher-all | proposed+hold | proposed+deliberate,slow | -14.6 pp | ranges do not overlap
15 | punisher/masher | proposed+hold | proposed+deliberate,slow | -2.2 pp | could be luck
15 | punisher/masher-all | proposed+hold | proposed+deliberate,slow | -24.7 pp | ranges do not overlap
15 | spacer/masher | proposed+hold | proposed+deliberate,slow | -11.7 pp | ranges do not overlap
15 | spacer/masher-all | proposed+hold | proposed+deliberate,slow | 0.0 pp | could be luck
15 | defence-capable/masher | proposed+hold | proposed+deliberate,slow | -1.4 pp | could be luck
15 | defence-capable/masher-all | proposed+hold | proposed+deliberate,slow | -22.9 pp | ranges do not overlap
15 | skilled/masher | default+hold,slow | proposed+hold,slow | 1.9 pp | could be luck
15 | skilled/masher-all | default+hold,slow | proposed+hold,slow | 2.2 pp | could be luck
15 | punisher/masher | default+hold,slow | proposed+hold,slow | 2.5 pp | could be luck
15 | punisher/masher-all | default+hold,slow | proposed+hold,slow | -0.8 pp | could be luck
15 | spacer/masher | default+hold,slow | proposed+hold,slow | 1.4 pp | could be luck
15 | spacer/masher-all | default+hold,slow | proposed+hold,slow | 0.0 pp | could be luck
15 | defence-capable/masher | default+hold,slow | proposed+hold,slow | 2.3 pp | could be luck
15 | defence-capable/masher-all | default+hold,slow | proposed+hold,slow | 1.9 pp | could be luck
15 | skilled/masher | default+hold,slow | default+deliberate,slow | -0.2 pp | could be luck
15 | skilled/masher-all | default+hold,slow | default+deliberate,slow | -0.2 pp | could be luck
15 | punisher/masher | default+hold,slow | default+deliberate,slow | 4.4 pp | could be luck
15 | punisher/masher-all | default+hold,slow | default+deliberate,slow | -0.8 pp | could be luck
15 | spacer/masher | default+hold,slow | default+deliberate,slow | -7.5 pp | could be luck
15 | spacer/masher-all | default+hold,slow | default+deliberate,slow | 0.0 pp | could be luck
15 | defence-capable/masher | default+hold,slow | default+deliberate,slow | 3.8 pp | could be luck
15 | defence-capable/masher-all | default+hold,slow | default+deliberate,slow | -0.5 pp | could be luck
15 | skilled/masher | default+hold,slow | proposed+deliberate,slow | -1.2 pp | could be luck
15 | skilled/masher-all | default+hold,slow | proposed+deliberate,slow | 4.4 pp | could be luck
15 | punisher/masher | default+hold,slow | proposed+deliberate,slow | 1.9 pp | could be luck
15 | punisher/masher-all | default+hold,slow | proposed+deliberate,slow | 2.2 pp | could be luck
15 | spacer/masher | default+hold,slow | proposed+deliberate,slow | -9.4 pp | ranges do not overlap
15 | spacer/masher-all | default+hold,slow | proposed+deliberate,slow | 0.0 pp | could be luck
15 | defence-capable/masher | default+hold,slow | proposed+deliberate,slow | 2.6 pp | could be luck
15 | defence-capable/masher-all | default+hold,slow | proposed+deliberate,slow | 5.1 pp | could be luck
15 | skilled/masher | proposed+hold,slow | default+deliberate,slow | -2.1 pp | could be luck
15 | skilled/masher-all | proposed+hold,slow | default+deliberate,slow | -2.4 pp | could be luck
15 | punisher/masher | proposed+hold,slow | default+deliberate,slow | 1.9 pp | could be luck
15 | punisher/masher-all | proposed+hold,slow | default+deliberate,slow | 0.0 pp | could be luck
15 | spacer/masher | proposed+hold,slow | default+deliberate,slow | -8.9 pp | ranges do not overlap
15 | spacer/masher-all | proposed+hold,slow | default+deliberate,slow | 0.0 pp | could be luck
15 | defence-capable/masher | proposed+hold,slow | default+deliberate,slow | 1.5 pp | could be luck
15 | defence-capable/masher-all | proposed+hold,slow | default+deliberate,slow | -2.4 pp | could be luck
15 | skilled/masher | proposed+hold,slow | proposed+deliberate,slow | -3.1 pp | could be luck
15 | skilled/masher-all | proposed+hold,slow | proposed+deliberate,slow | 2.1 pp | could be luck
15 | punisher/masher | proposed+hold,slow | proposed+deliberate,slow | -0.6 pp | could be luck
15 | punisher/masher-all | proposed+hold,slow | proposed+deliberate,slow | 3.1 pp | could be luck
15 | spacer/masher | proposed+hold,slow | proposed+deliberate,slow | -10.8 pp | ranges do not overlap
15 | spacer/masher-all | proposed+hold,slow | proposed+deliberate,slow | 0.0 pp | could be luck
15 | defence-capable/masher | proposed+hold,slow | proposed+deliberate,slow | 0.3 pp | could be luck
15 | defence-capable/masher-all | proposed+hold,slow | proposed+deliberate,slow | 3.1 pp | could be luck
15 | skilled/masher | default+deliberate,slow | proposed+deliberate,slow | -1.0 pp | could be luck
15 | skilled/masher-all | default+deliberate,slow | proposed+deliberate,slow | 4.5 pp | could be luck
15 | punisher/masher | default+deliberate,slow | proposed+deliberate,slow | -2.5 pp | could be luck
15 | punisher/masher-all | default+deliberate,slow | proposed+deliberate,slow | 3.1 pp | could be luck
15 | spacer/masher | default+deliberate,slow | proposed+deliberate,slow | -1.9 pp | could be luck
15 | spacer/masher-all | default+deliberate,slow | proposed+deliberate,slow | 0.0 pp | could be luck
15 | defence-capable/masher | default+deliberate,slow | proposed+deliberate,slow | -1.2 pp | could be luck
15 | defence-capable/masher-all | default+deliberate,slow | proposed+deliberate,slow | 5.6 pp | could be luck

## Verification and delivery

- **688 tests passed**, zero failures: `PATH=/usr/local/bin:$PATH npm --script-shell=/bin/bash test`. The controlled equal-rate test covers all three policies, five seeds and 6,000 identical idle snapshots per seed/policy with 15f delay. Offensive decisions match exactly across rules, including the eligible denominator. Split taps are counted once in each relevant category, and metadata never reaches the simulation input.
- The retained default-defence test verifies a timed guard; split uses capture without guard. The passive observer replay tests and default fingerprint pass. Fingerprint: `c1fc5ebc1cb77d6845830c4c67fa56d416bf079f78d16c51fac4e1b8d049071a`. Combat, move, fighter, hitbox, rig and animation files were not changed.
- [Cloud tournament](https://github.com/Tusingw29/rift-duel/actions/runs/40737151754) succeeded at measured commit `bdff062`. **100,800 bouts, zero censored**, 20 archives with 5,040 bouts each. Source hashes match current measured code; offensive and break accounting reconcile. [Archive audit](archive-audit.json), [workflow metadata](workflow.json).
- **Tournament workflow wall time: 8m 25s**, including checkout/upload. Summed per-mode elapsed time: **768.7s**, with the two delay jobs in parallel; this is not summed worker CPU time.
- **Live normalized offensive-rate intervals overlap in all 30 paired default/proposed comparisons** (three policies × five option combinations × two delays). These intervals retain all fighter pairs and both seats of each seed as one bootstrap block. The five fixed seed streams yield observed rates around 1.45–1.57%, rather than exactly the configured 1/60 (1.667%); the seed-block intervals include that configured probability. Equal policy does not force equal game opportunities or move-start totals.
- Timer, reader and punisher pass the random sanity screen in all modes. Spacer remains visible and untrusted; it is excluded from the primary three-policy findings.
- Browser checks exercise real main-loop configuration, keyboard commands and manual text with a stubbed renderer for deterministic stepping. All three requested URLs keep dedicated U immediate; capture startup is 18f with slow; brief D+J is a normal attack under hold while held D then J captures. Dashboard checks cover ten modes at both delays, both directions of capture damage, offensive and break counters, confidence/overlap labels, old-study access and 390px layout. No page errors. [Browser evidence](browser.json).
- Browser checks do not establish physical-controller behavior or normal-speed feel. There are no new visual assets or renderer changes in this task. Earlier archives are preserved; no gameplay merge or public default promotion.

## Live offensive-rate check

Rates are common-lottery attempts divided by eligible decision frames, across both mashers. Bands envelope Wilson and whole-seed bootstrap uncertainty; with only five seeds they are descriptive checks. The exact equal-observation test is the direct test of equal policy.

Delay | Option suffix | Bot | Default rate [95%] | Proposed rate [95%] | Comparison
--- | --- | --- | --- | --- | ---
10 | base | timer | 1.567% [1.202–1.973] | 1.553% [1.188–1.978] | overlap
10 | base | reader | 1.552% [1.186–1.966] | 1.543% [1.190–1.964] | overlap
10 | base | punisher | 1.547% [1.182–1.969] | 1.532% [1.168–1.950] | overlap
10 | +slow | timer | 1.565% [1.196–1.986] | 1.519% [1.153–1.939] | overlap
10 | +slow | reader | 1.558% [1.193–1.978] | 1.510% [1.151–1.923] | overlap
10 | +slow | punisher | 1.538% [1.188–1.972] | 1.507% [1.153–1.936] | overlap
10 | +hold | timer | 1.558% [1.175–1.981] | 1.517% [1.149–1.940] | overlap
10 | +hold | reader | 1.548% [1.185–1.955] | 1.533% [1.150–1.971] | overlap
10 | +hold | punisher | 1.531% [1.171–1.947] | 1.525% [1.155–1.949] | overlap
10 | +hold,slow | timer | 1.542% [1.185–1.974] | 1.509% [1.141–1.940] | overlap
10 | +hold,slow | reader | 1.530% [1.174–1.946] | 1.515% [1.160–1.954] | overlap
10 | +hold,slow | punisher | 1.516% [1.153–1.949] | 1.495% [1.141–1.930] | overlap
10 | +deliberate,slow | timer | 1.537% [1.189–1.957] | 1.520% [1.155–1.940] | overlap
10 | +deliberate,slow | reader | 1.517% [1.162–1.935] | 1.514% [1.170–1.943] | overlap
10 | +deliberate,slow | punisher | 1.514% [1.158–1.940] | 1.502% [1.153–1.925] | overlap
15 | base | timer | 1.462% [1.134–1.857] | 1.459% [1.113–1.865] | overlap
15 | base | reader | 1.470% [1.124–1.876] | 1.467% [1.115–1.908] | overlap
15 | base | punisher | 1.452% [1.120–1.845] | 1.462% [1.119–1.858] | overlap
15 | +slow | timer | 1.516% [1.159–1.948] | 1.500% [1.179–1.891] | overlap
15 | +slow | reader | 1.529% [1.163–1.961] | 1.510% [1.155–1.935] | overlap
15 | +slow | punisher | 1.533% [1.194–1.942] | 1.513% [1.198–1.900] | overlap
15 | +hold | timer | 1.501% [1.172–1.891] | 1.470% [1.135–1.874] | overlap
15 | +hold | reader | 1.488% [1.140–1.896] | 1.485% [1.133–1.889] | overlap
15 | +hold | punisher | 1.500% [1.169–1.892] | 1.464% [1.120–1.858] | overlap
15 | +hold,slow | timer | 1.507% [1.153–1.937] | 1.497% [1.163–1.920] | overlap
15 | +hold,slow | reader | 1.532% [1.156–1.980] | 1.534% [1.170–1.971] | overlap
15 | +hold,slow | punisher | 1.522% [1.164–1.952] | 1.505% [1.175–1.927] | overlap
15 | +deliberate,slow | timer | 1.486% [1.147–1.909] | 1.496% [1.155–1.927] | overlap
15 | +deliberate,slow | reader | 1.512% [1.128–1.970] | 1.517% [1.161–1.952] | overlap
15 | +deliberate,slow | punisher | 1.512% [1.165–1.938] | 1.493% [1.152–1.919] | overlap

## Playtest links

- [Default + slow](http://localhost:4203/dist/index.html?grab=slow)
- [Default + hold, slow](http://localhost:4203/dist/index.html?grab=hold,slow)
- [Proposed + hold, slow](http://localhost:4203/dist/index.html?balance=proposed&grab=hold,slow)
- [Equal-grab dashboard](http://localhost:4203/dist/skill-lab.html?study=grab-equal)
- [Exploratory proposed + slow](http://localhost:4203/dist/index.html?balance=proposed&grab=slow)

Restart the server if necessary with `python3 -m http.server 4203 --bind 127.0.0.1` from `~/rift-worktrees/skill-lab`. **Review, awaiting Adam’s verdict.** Branch `codex/skill-lab`; no default promotion.

## Captures inspected

- [Desktop](dashboard-desktop-1793218319032.jpg): all ten modes visible, primary three-policy results first, old aggregate retained, win counts and confidence ranges readable.
- [Phone](dashboard-phone-1793218319032.jpg): 390px layout has no page overflow; the wide table scrolls horizontally. Long group labels wrap and remain easier to compare on desktop.

Screenshots verify report layout, not normal-speed combat feel.
