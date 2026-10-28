# GRAB-RETEST review

**The corrected bots do not show a universal win for proposed balance.** At 10f, proposed is effectively tied against the original masher within the luck range, and worse against masher-all. At 15f, it is better against the original masher beyond the overlap screen, while the improvement against masher-all could be luck. This replaces the earlier inference from bots that could not use split-guard breaks.

**For default rules, deliberate has the highest observed average; hold is close. For proposed rules, hold + slow has the highest observed average, driven by its result against masher-all.** At 15f it actually loses 5.0 points against the original masher versus proposed alone (could be luck). There is no option that is clearly best against every opponent.

**Hold gets close to deliberate in this sample while retaining two-button grabs:** standalone hold trails deliberate by 0.5–2.7 points across the requested rule/delay/opponent combinations. Every one of those ranges overlaps, so this is a promising playtest comparison, not proof of equivalence. Hold + slow versus deliberate + slow also overlaps at both delays against both mashers.

**10f, proposed vs default:** defence-capable bots vs masher +0.7 percentage points (could be luck); vs masher-all -9.3 percentage points (ranges do not overlap).

**10f, default:** highest observed two-masher average is **default+deliberate**. Versus default alone: masher +1.8 percentage points (could be luck); masher-all +6.6 percentage points (ranges do not overlap). Ranking is not proof of a unique winner.

**10f, default hold vs deliberate:** masher -0.7 percentage points (could be luck); masher-all -0.5 percentage points (could be luck). Overlap cannot establish that the options are equivalent.

**10f, proposed:** highest observed two-masher average is **proposed+hold,slow**. Versus proposed alone: masher +1.3 percentage points (could be luck); masher-all +19.4 percentage points (ranges do not overlap). Ranking is not proof of a unique winner.

**10f, proposed hold vs deliberate:** masher -1.7 percentage points (could be luck); masher-all -0.6 percentage points (could be luck). Overlap cannot establish that the options are equivalent.

**15f, proposed vs default:** defence-capable bots vs masher +8.9 percentage points (ranges do not overlap); vs masher-all +4.4 percentage points (could be luck).

**15f, default:** highest observed two-masher average is **default+deliberate**. Versus default alone: masher +0.3 percentage points (could be luck); masher-all +12.9 percentage points (ranges do not overlap). Ranking is not proof of a unique winner.

**15f, default hold vs deliberate:** masher -1.2 percentage points (could be luck); masher-all -1.3 percentage points (could be luck). Overlap cannot establish that the options are equivalent.

**15f, proposed:** highest observed two-masher average is **proposed+hold,slow**. Versus proposed alone: masher -5.0 percentage points (could be luck); masher-all +32.1 percentage points (ranges do not overlap). Ranking is not proof of a unique winner.

**15f, proposed hold vs deliberate:** masher -2.7 percentage points (could be luck); masher-all -0.6 percentage points (could be luck). Overlap cannot establish that the options are equivalent.

80,640 bouts requested. 0 censored. Summed tournament computation time: 342.4 seconds (two delay jobs run concurrently; this is not wall-clock duration).

Primary defence-capable group: timer + reader + punisher. Original skilled group (spacer + timer + reader) remains visible for continuity. Spacer has no new grab-defence policy and remains untrusted wherever its random sanity range includes or falls below 50%. These are bot results, not a human skill verdict.

Each policy/opponent estimate has 360 bouts: 36 ordered fighter pairs, mirrored seats, five seeds. Each three-policy aggregate has 1,080. Draws count as non-wins. Confidence ranges envelope 95% Wilson and 2,000-draw fighter-pair/seed cluster-bootstrap intervals, retaining seats and policies together. Overlap means could be luck, not equivalence; no multiple-comparison correction.

Guess probability is 1/60 per eligible decision frame: within 3.1 units of an idle rival, using only the delayed visible snapshot. Held buttons are released before a fresh edge. Default guesses hold guard for 12 frames; split-guard guesses tap capture without guard. Split guesses can themselves start offensive grabs, so their benefit is not purely defensive.

Reactions use the same delayed snapshot and one fresh break press per observed capture startup/active phase. At 15f, an uninterrupted close 13f grab connects before it can be reacted to. At 10f reaction breaks are possible; slow18 also makes 15f reactions possible. Recovery, stun, held-button release and range still affect success. Far capture projectiles can allow later breaks: the nonzero 15f reaction counters do not imply bots beat the close 13f window. A separate seed-1 trace confirms reaction breaks of travelling captures (see reaction-projectile-examples.jsonl).

Captures faced counts rival capture starts (including whiffs/interrupted attempts); close faced uses actual distance <3.1 at start. Attempts count fresh issued edges, including actions the simulation cannot accept. Breaks landed counts diagnostic capture-break events. Reaction/guess landed credits the latest eligible uncredited tap within the 12-frame simulation window. Wasted taps had no credited break; pending taps are kept separate in censored bouts. Counters exclude random sanity bouts.

hold requires eight prior 60 Hz input frames of down before attack, configured in GRAB_HOLD_FRAMES as a playtest guess. The dedicated capture button is unaffected. The original masher holds directions for 10 frames: hold mainly filters brief down + attack, not sustained down mashing. Intentional two-button grabs also incur eight setup frames, during which down moves the fighter. Double-down launcher remains unchanged; deliberate takes precedence when combined.

Old archives and dashboard views remain available. Earlier results used different bot defence and are not a controlled estimate of the balance changes. Only comparisons within this retest separate default/proposed balance from grab options. Default gameplay is unchanged.

## Win rates

Delay | Mode | Group / opponent | Wins; 95% range
--- | --- | --- | ---
10 | default | skilled/masher | 62.2% (672/1080); 95% 59.3–65.1%
10 | default | skilled/masher-all | 50.6% (546/1080); 95% 47.6–53.5%
10 | default | punisher/masher | 89.7% (323/360); 95% 86.2–92.8%
10 | default | punisher/masher-all | 80.0% (288/360); 95% 75.6–83.9%
10 | default | spacer/masher | 13.1% (47/360); 95% 9.4–17.2%
10 | default | spacer/masher-all | 1.4% (5/360); 95% 0.3–3.2%
10 | default | defence-capable/masher | 87.8% (948/1080); 95% 85.0–90.5%
10 | default | defence-capable/masher-all | 76.8% (829/1080); 95% 73.5–80.0%
10 | proposed | skilled/masher | 61.8% (667/1080); 95% 58.8–64.6%
10 | proposed | skilled/masher-all | 44.0% (475/1080); 95% 41.0–47.0%
10 | proposed | punisher/masher | 87.5% (315/360); 95% 83.7–90.8%
10 | proposed | punisher/masher-all | 70.6% (254/360); 95% 65.7–75.0%
10 | proposed | spacer/masher | 7.2% (26/360); 95% 4.4–10.4%
10 | proposed | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1%
10 | proposed | defence-capable/masher | 88.5% (956/1080); 95% 85.7–91.1%
10 | proposed | defence-capable/masher-all | 67.5% (729/1080); 95% 63.7–71.1%
10 | default+deliberate | skilled/masher | 69.4% (750/1080); 95% 66.6–72.1%
10 | default+deliberate | skilled/masher-all | 55.6% (601/1080); 95% 52.7–58.6%
10 | default+deliberate | punisher/masher | 90.0% (324/360); 95% 86.4–93.3%
10 | default+deliberate | punisher/masher-all | 84.7% (305/360); 95% 80.6–88.1%
10 | default+deliberate | spacer/masher | 29.7% (107/360); 95% 24.2–35.3%
10 | default+deliberate | spacer/masher-all | 1.7% (6/360); 95% 0.6–3.6%
10 | default+deliberate | defence-capable/masher | 89.5% (967/1080); 95% 86.8–92.3%
10 | default+deliberate | defence-capable/masher-all | 83.3% (900/1080); 95% 80.5–86.1%
10 | proposed+deliberate | skilled/masher | 68.1% (736/1080); 95% 65.3–70.9%
10 | proposed+deliberate | skilled/masher-all | 51.7% (558/1080); 95% 48.7–54.6%
10 | proposed+deliberate | punisher/masher | 88.9% (320/360); 95% 85.2–92.2%
10 | proposed+deliberate | punisher/masher-all | 81.1% (292/360); 95% 76.7–85.0%
10 | proposed+deliberate | spacer/masher | 26.4% (95/360); 95% 20.8–31.9%
10 | proposed+deliberate | spacer/masher-all | 0.3% (1/360); 95% 0.0–1.6%
10 | proposed+deliberate | defence-capable/masher | 89.0% (961/1080); 95% 86.1–91.8%
10 | proposed+deliberate | defence-capable/masher-all | 78.6% (849/1080); 95% 75.6–81.8%
10 | default+hold | skilled/masher | 66.2% (715/1080); 95% 63.3–69.0%
10 | default+hold | skilled/masher-all | 55.1% (595/1080); 95% 52.1–58.0%
10 | default+hold | punisher/masher | 89.4% (322/360); 95% 85.8–92.8%
10 | default+hold | punisher/masher-all | 85.0% (306/360); 95% 80.9–88.6%
10 | default+hold | spacer/masher | 21.7% (78/360); 95% 16.9–26.4%
10 | default+hold | spacer/masher-all | 1.7% (6/360); 95% 0.6–3.6%
10 | default+hold | defence-capable/masher | 88.8% (959/1080); 95% 86.0–91.5%
10 | default+hold | defence-capable/masher-all | 82.9% (895/1080); 95% 80.2–85.6%
10 | proposed+hold | skilled/masher | 64.8% (700/1080); 95% 61.9–67.6%
10 | proposed+hold | skilled/masher-all | 51.3% (554/1080); 95% 48.3–54.3%
10 | proposed+hold | punisher/masher | 86.1% (310/360); 95% 82.2–89.7%
10 | proposed+hold | punisher/masher-all | 80.6% (290/360); 95% 76.2–84.4%
10 | proposed+hold | spacer/masher | 18.6% (67/360); 95% 14.2–23.1%
10 | proposed+hold | spacer/masher-all | 0.3% (1/360); 95% 0.0–1.6%
10 | proposed+hold | defence-capable/masher | 87.3% (943/1080); 95% 84.2–90.2%
10 | proposed+hold | defence-capable/masher-all | 78.1% (843/1080); 95% 75.0–81.3%
10 | proposed+deliberate,slow | skilled/masher | 68.3% (738/1080); 95% 65.5–71.0%
10 | proposed+deliberate,slow | skilled/masher-all | 57.3% (619/1080); 95% 54.3–60.2%
10 | proposed+deliberate,slow | punisher/masher | 89.4% (322/360); 95% 85.8–92.8%
10 | proposed+deliberate,slow | punisher/masher-all | 89.4% (322/360); 95% 85.8–92.5%
10 | proposed+deliberate,slow | spacer/masher | 26.4% (95/360); 95% 20.8–31.9%
10 | proposed+deliberate,slow | spacer/masher-all | 1.1% (4/360); 95% 0.3–2.8%
10 | proposed+deliberate,slow | defence-capable/masher | 89.4% (965/1080); 95% 86.6–92.1%
10 | proposed+deliberate,slow | defence-capable/masher-all | 86.8% (937/1080); 95% 84.4–88.9%
10 | proposed+hold,slow | skilled/masher | 66.4% (717/1080); 95% 63.5–69.1%
10 | proposed+hold,slow | skilled/masher-all | 57.5% (621/1080); 95% 54.5–60.4%
10 | proposed+hold,slow | punisher/masher | 88.9% (320/360); 95% 85.2–92.2%
10 | proposed+hold,slow | punisher/masher-all | 89.4% (322/360); 95% 85.8–92.5%
10 | proposed+hold,slow | spacer/masher | 18.6% (67/360); 95% 13.9–23.3%
10 | proposed+hold,slow | spacer/masher-all | 1.1% (4/360); 95% 0.3–2.8%
10 | proposed+hold,slow | defence-capable/masher | 89.8% (970/1080); 95% 87.0–92.5%
10 | proposed+hold,slow | defence-capable/masher-all | 86.9% (939/1080); 95% 84.6–89.0%
15 | default | skilled/masher | 26.0% (281/1080); 95% 23.1–29.0%
15 | default | skilled/masher-all | 20.2% (218/1080); 95% 17.7–22.9%
15 | default | punisher/masher | 46.4% (167/360); 95% 41.1–51.7%
15 | default | punisher/masher-all | 40.8% (147/360); 95% 35.9–46.1%
15 | default | spacer/masher | 4.4% (16/360); 95% 2.5–7.1%
15 | default | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1%
15 | default | defence-capable/masher | 40.0% (432/1080); 95% 35.9–44.4%
15 | default | defence-capable/masher-all | 33.8% (365/1080); 95% 30.4–37.4%
15 | proposed | skilled/masher | 33.1% (357/1080); 95% 29.8–36.3%
15 | proposed | skilled/masher-all | 23.5% (254/1080); 95% 20.7–26.4%
15 | proposed | punisher/masher | 51.1% (184/360); 95% 45.3–56.7%
15 | proposed | punisher/masher-all | 44.2% (159/360); 95% 38.9–49.4%
15 | proposed | spacer/masher | 3.6% (13/360); 95% 1.9–6.1%
15 | proposed | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1%
15 | proposed | defence-capable/masher | 48.9% (528/1080); 95% 44.4–53.4%
15 | proposed | defence-capable/masher-all | 38.2% (413/1080); 95% 34.3–42.2%
15 | default+deliberate | skilled/masher | 32.2% (348/1080); 95% 28.3–36.0%
15 | default+deliberate | skilled/masher-all | 28.1% (304/1080); 95% 25.4–31.0%
15 | default+deliberate | punisher/masher | 44.7% (161/360); 95% 38.9–50.0%
15 | default+deliberate | punisher/masher-all | 55.6% (200/360); 95% 50.3–60.8%
15 | default+deliberate | spacer/masher | 20.6% (74/360); 95% 16.4–25.6%
15 | default+deliberate | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1%
15 | default+deliberate | defence-capable/masher | 40.3% (435/1080); 95% 35.7–44.6%
15 | default+deliberate | defence-capable/masher-all | 46.7% (504/1080); 95% 42.8–50.6%
15 | proposed+deliberate | skilled/masher | 37.6% (406/1080); 95% 33.7–41.4%
15 | proposed+deliberate | skilled/masher-all | 29.9% (323/1080); 95% 27.2–32.7%
15 | proposed+deliberate | punisher/masher | 54.4% (196/360); 95% 48.9–59.7%
15 | proposed+deliberate | punisher/masher-all | 52.5% (189/360); 95% 47.2–58.1%
15 | proposed+deliberate | spacer/masher | 22.5% (81/360); 95% 17.8–27.5%
15 | proposed+deliberate | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1%
15 | proposed+deliberate | defence-capable/masher | 48.2% (521/1080); 95% 43.2–53.0%
15 | proposed+deliberate | defence-capable/masher-all | 47.4% (512/1080); 95% 43.4–51.5%
15 | default+hold | skilled/masher | 28.3% (306/1080); 95% 25.0–31.7%
15 | default+hold | skilled/masher-all | 27.5% (297/1080); 95% 24.4–30.5%
15 | default+hold | punisher/masher | 43.9% (158/360); 95% 38.3–49.2%
15 | default+hold | punisher/masher-all | 53.6% (193/360); 95% 48.1–58.9%
15 | default+hold | spacer/masher | 11.7% (42/360); 95% 8.3–15.4%
15 | default+hold | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1%
15 | default+hold | defence-capable/masher | 39.1% (422/1080); 95% 34.7–43.5%
15 | default+hold | defence-capable/masher-all | 45.4% (490/1080); 95% 41.5–49.3%
15 | proposed+hold | skilled/masher | 32.2% (348/1080); 95% 28.7–35.7%
15 | proposed+hold | skilled/masher-all | 29.6% (320/1080); 95% 26.8–32.5%
15 | proposed+hold | punisher/masher | 50.8% (183/360); 95% 45.3–56.1%
15 | proposed+hold | punisher/masher-all | 51.4% (185/360); 95% 46.1–56.9%
15 | proposed+hold | spacer/masher | 10.8% (39/360); 95% 7.5–14.5%
15 | proposed+hold | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1%
15 | proposed+hold | defence-capable/masher | 45.6% (492/1080); 95% 40.7–50.0%
15 | proposed+hold | defence-capable/masher-all | 46.8% (505/1080); 95% 42.8–50.8%
15 | proposed+deliberate,slow | skilled/masher | 35.2% (380/1080); 95% 31.4–39.1%
15 | proposed+deliberate,slow | skilled/masher-all | 44.1% (476/1080); 95% 41.1–47.1%
15 | proposed+deliberate,slow | punisher/masher | 50.6% (182/360); 95% 44.7–56.1%
15 | proposed+deliberate,slow | punisher/masher-all | 70.3% (253/360); 95% 65.4–75.0%
15 | proposed+deliberate,slow | spacer/masher | 22.5% (81/360); 95% 17.8–27.5%
15 | proposed+deliberate,slow | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1%
15 | proposed+deliberate,slow | defence-capable/masher | 44.5% (481/1080); 95% 39.7–49.2%
15 | proposed+deliberate,slow | defence-capable/masher-all | 67.5% (729/1080); 95% 64.0–71.0%
15 | proposed+hold,slow | skilled/masher | 31.1% (336/1080); 95% 27.7–34.4%
15 | proposed+hold,slow | skilled/masher-all | 45.9% (496/1080); 95% 43.0–48.9%
15 | proposed+hold,slow | punisher/masher | 50.0% (180/360); 95% 44.4–55.3%
15 | proposed+hold,slow | punisher/masher-all | 73.3% (264/360); 95% 68.5–77.6%
15 | proposed+hold,slow | spacer/masher | 11.7% (42/360); 95% 8.3–15.6%
15 | proposed+hold,slow | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1%
15 | proposed+hold,slow | defence-capable/masher | 43.9% (474/1080); 95% 39.2–48.4%
15 | proposed+hold,slow | defence-capable/masher-all | 70.4% (760/1080); 95% 67.3–73.4%

## Break validity

Delay | Mode | Bot | Bouts | capturesFaced | closeCapturesFaced | reactionBreakAttempts | guessBreakAttempts | reactionBreaksLanded | guessBreaksLanded | breaksLanded | wastedBreakTaps | pendingBreakTaps
--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---
10 | default | timer | 720 | 2345 | 1817 | 2299 | 4615 | 588 | 0 | 596 | 6326 | 0
10 | default | reader | 720 | 2488 | 1963 | 2419 | 4566 | 623 | 0 | 632 | 6362 | 0
10 | default | punisher | 720 | 2294 | 1734 | 2229 | 4377 | 491 | 0 | 501 | 6115 | 0
10 | default | spacer | 720 | 3553 | 968 | 0 | 0 | 0 | 0 | 1681 | 0 | 0
10 | default | masher | 1440 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | default | masher-all | 1440 | 27 | 25 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed | timer | 720 | 2117 | 1634 | 2081 | 5699 | 391 | 0 | 391 | 7389 | 0
10 | proposed | reader | 720 | 2282 | 1770 | 2252 | 5905 | 412 | 0 | 412 | 7745 | 0
10 | proposed | punisher | 720 | 2116 | 1600 | 2074 | 5401 | 350 | 0 | 350 | 7125 | 0
10 | proposed | spacer | 720 | 2709 | 622 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed | masher | 1440 | 2093 | 1603 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed | masher-all | 1440 | 2299 | 1870 | 0 | 0 | 0 | 0 | 255 | 0 | 0
10 | default+deliberate | timer | 720 | 1177 | 978 | 1154 | 4657 | 255 | 0 | 260 | 5556 | 0
10 | default+deliberate | reader | 720 | 1235 | 1038 | 1201 | 4561 | 286 | 0 | 288 | 5476 | 0
10 | default+deliberate | punisher | 720 | 1130 | 930 | 1103 | 4340 | 217 | 0 | 219 | 5226 | 0
10 | default+deliberate | spacer | 720 | 1329 | 647 | 0 | 0 | 0 | 0 | 423 | 0 | 0
10 | default+deliberate | masher | 1440 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | default+deliberate | masher-all | 1440 | 46 | 44 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed+deliberate | timer | 720 | 1112 | 909 | 1083 | 5808 | 177 | 0 | 177 | 6714 | 0
10 | proposed+deliberate | reader | 720 | 1112 | 913 | 1094 | 5666 | 221 | 0 | 221 | 6539 | 0
10 | proposed+deliberate | punisher | 720 | 1045 | 856 | 1023 | 5425 | 177 | 0 | 177 | 6271 | 0
10 | proposed+deliberate | spacer | 720 | 1151 | 465 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed+deliberate | masher | 1440 | 1204 | 1196 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed+deliberate | masher-all | 1440 | 2138 | 1824 | 0 | 0 | 0 | 0 | 225 | 0 | 0
10 | default+hold | timer | 720 | 1416 | 1139 | 1381 | 4642 | 332 | 0 | 338 | 5691 | 0
10 | default+hold | reader | 720 | 1514 | 1233 | 1467 | 4567 | 363 | 0 | 366 | 5671 | 0
10 | default+hold | punisher | 720 | 1360 | 1073 | 1327 | 4326 | 285 | 0 | 287 | 5368 | 0
10 | default+hold | spacer | 720 | 1946 | 712 | 0 | 0 | 0 | 0 | 726 | 0 | 0
10 | default+hold | masher | 1440 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | default+hold | masher-all | 1440 | 46 | 44 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed+hold | timer | 720 | 1339 | 1064 | 1308 | 5771 | 227 | 0 | 227 | 6852 | 0
10 | proposed+hold | reader | 720 | 1319 | 1034 | 1297 | 5705 | 262 | 0 | 262 | 6740 | 0
10 | proposed+hold | punisher | 720 | 1272 | 1001 | 1245 | 5399 | 221 | 0 | 221 | 6423 | 0
10 | proposed+hold | spacer | 720 | 1757 | 512 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed+hold | masher | 1440 | 1435 | 1293 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed+hold | masher-all | 1440 | 2167 | 1826 | 0 | 0 | 0 | 0 | 221 | 0 | 0
10 | proposed+deliberate,slow | timer | 720 | 1120 | 918 | 1090 | 5512 | 219 | 0 | 219 | 6383 | 0
10 | proposed+deliberate,slow | reader | 720 | 1148 | 962 | 1122 | 5462 | 283 | 0 | 283 | 6301 | 0
10 | proposed+deliberate,slow | punisher | 720 | 1041 | 844 | 1017 | 5177 | 223 | 0 | 223 | 5971 | 0
10 | proposed+deliberate,slow | spacer | 720 | 1141 | 500 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed+deliberate,slow | masher | 1440 | 1206 | 1200 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed+deliberate,slow | masher-all | 1440 | 2478 | 2155 | 0 | 0 | 0 | 0 | 158 | 0 | 0
10 | proposed+hold,slow | timer | 720 | 1293 | 1013 | 1266 | 5544 | 262 | 0 | 262 | 6548 | 0
10 | proposed+hold,slow | reader | 720 | 1415 | 1118 | 1389 | 5597 | 341 | 0 | 341 | 6645 | 0
10 | proposed+hold,slow | punisher | 720 | 1218 | 944 | 1192 | 5204 | 250 | 0 | 250 | 6146 | 0
10 | proposed+hold,slow | spacer | 720 | 1764 | 530 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed+hold,slow | masher | 1440 | 1492 | 1347 | 0 | 0 | 0 | 0 | 0 | 0 | 0
10 | proposed+hold,slow | masher-all | 1440 | 2589 | 2149 | 0 | 0 | 0 | 0 | 163 | 0 | 0
15 | default | timer | 720 | 2343 | 1778 | 2308 | 3386 | 95 | 63 | 185 | 5536 | 0
15 | default | reader | 720 | 2316 | 1743 | 2283 | 3380 | 105 | 72 | 208 | 5486 | 0
15 | default | punisher | 720 | 2224 | 1656 | 2180 | 3403 | 95 | 46 | 170 | 5442 | 0
15 | default | spacer | 720 | 2694 | 684 | 0 | 0 | 0 | 0 | 532 | 0 | 0
15 | default | masher | 1440 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | default | masher-all | 1440 | 25 | 25 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed | timer | 720 | 2145 | 1624 | 2108 | 4502 | 105 | 41 | 150 | 6464 | 0
15 | proposed | reader | 720 | 2194 | 1645 | 2177 | 4289 | 95 | 43 | 138 | 6328 | 0
15 | proposed | punisher | 720 | 2086 | 1583 | 2056 | 4375 | 96 | 39 | 135 | 6296 | 0
15 | proposed | spacer | 720 | 2445 | 608 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed | masher | 1440 | 1568 | 1120 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed | masher-all | 1440 | 2018 | 1480 | 0 | 0 | 0 | 0 | 252 | 0 | 0
15 | default+deliberate | timer | 720 | 1239 | 994 | 1229 | 3605 | 24 | 53 | 90 | 4757 | 0
15 | default+deliberate | reader | 720 | 1298 | 1063 | 1274 | 3641 | 21 | 60 | 95 | 4834 | 0
15 | default+deliberate | punisher | 720 | 1230 | 1002 | 1202 | 3661 | 27 | 49 | 93 | 4787 | 0
15 | default+deliberate | spacer | 720 | 1042 | 496 | 0 | 0 | 0 | 0 | 200 | 0 | 0
15 | default+deliberate | masher | 1440 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | default+deliberate | masher-all | 1440 | 34 | 34 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed+deliberate | timer | 720 | 1166 | 936 | 1148 | 4340 | 36 | 24 | 65 | 5428 | 0
15 | proposed+deliberate | reader | 720 | 1181 | 969 | 1168 | 4435 | 28 | 31 | 59 | 5544 | 0
15 | proposed+deliberate | punisher | 720 | 1105 | 891 | 1090 | 4391 | 24 | 23 | 47 | 5434 | 0
15 | proposed+deliberate | spacer | 720 | 975 | 419 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed+deliberate | masher | 1440 | 1017 | 984 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed+deliberate | masher-all | 1440 | 1953 | 1559 | 0 | 0 | 0 | 0 | 231 | 0 | 0
15 | default+hold | timer | 720 | 1482 | 1141 | 1471 | 3519 | 46 | 58 | 117 | 4886 | 0
15 | default+hold | reader | 720 | 1508 | 1182 | 1485 | 3621 | 45 | 68 | 127 | 4993 | 0
15 | default+hold | punisher | 720 | 1468 | 1140 | 1436 | 3608 | 47 | 53 | 118 | 4944 | 0
15 | default+hold | spacer | 720 | 1639 | 534 | 0 | 0 | 0 | 0 | 317 | 0 | 0
15 | default+hold | masher | 1440 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | default+hold | masher-all | 1440 | 32 | 32 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed+hold | timer | 720 | 1401 | 1081 | 1379 | 4324 | 57 | 28 | 89 | 5618 | 0
15 | proposed+hold | reader | 720 | 1383 | 1071 | 1370 | 4285 | 49 | 31 | 80 | 5575 | 0
15 | proposed+hold | punisher | 720 | 1324 | 1006 | 1309 | 4314 | 46 | 31 | 77 | 5546 | 0
15 | proposed+hold | spacer | 720 | 1562 | 473 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed+hold | masher | 1440 | 1160 | 959 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed+hold | masher-all | 1440 | 1973 | 1549 | 0 | 0 | 0 | 0 | 237 | 0 | 0
15 | proposed+deliberate,slow | timer | 720 | 1198 | 967 | 1173 | 4470 | 257 | 0 | 257 | 5386 | 0
15 | proposed+deliberate,slow | reader | 720 | 1240 | 1019 | 1211 | 4540 | 232 | 0 | 232 | 5519 | 0
15 | proposed+deliberate,slow | punisher | 720 | 1145 | 917 | 1126 | 4438 | 209 | 0 | 209 | 5355 | 0
15 | proposed+deliberate,slow | spacer | 720 | 1039 | 469 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed+deliberate,slow | masher | 1440 | 1013 | 974 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed+deliberate,slow | masher-all | 1440 | 2674 | 2282 | 0 | 0 | 0 | 0 | 152 | 0 | 0
15 | proposed+hold,slow | timer | 720 | 1443 | 1116 | 1416 | 4512 | 274 | 0 | 274 | 5654 | 0
15 | proposed+hold,slow | reader | 720 | 1484 | 1141 | 1452 | 4490 | 274 | 0 | 274 | 5668 | 0
15 | proposed+hold,slow | punisher | 720 | 1392 | 1051 | 1360 | 4362 | 246 | 0 | 246 | 5476 | 0
15 | proposed+hold,slow | spacer | 720 | 1620 | 497 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed+hold,slow | masher | 1440 | 1253 | 1053 | 0 | 0 | 0 | 0 | 0 | 0 | 0
15 | proposed+hold,slow | masher-all | 1440 | 2810 | 2287 | 0 | 0 | 0 | 0 | 150 | 0 | 0

## Capture share

Delay | Mode | Opponent | Capture HP / total HP | Share | Opponent breaks / masher breaks
--- | --- | --- | --- | --- | ---
10 | default | masher | 20325.4 / 84585.3 | 24.0% | 1819 / 0
10 | default | masher-all | 43000.1 / 105580.1 | 40.7% | 1591 / 0
10 | proposed | masher | 28371.2 / 82417.2 | 34.4% | 448 / 0
10 | proposed | masher-all | 47359.4 / 110650.5 | 42.8% | 705 / 255
10 | default+deliberate | masher | 0.0 / 78076.7 | 0.0% | 0 / 0
10 | default+deliberate | masher-all | 29581.3 / 100088.5 | 29.6% | 1190 / 0
10 | proposed+deliberate | masher | 0.0 / 76706.4 | 0.0% | 0 / 0
10 | proposed+deliberate | masher-all | 33911.3 / 102740.0 | 33.0% | 575 / 225
10 | default+hold | masher | 5827.1 / 81318.2 | 7.2% | 489 / 0
10 | default+hold | masher-all | 31707.8 / 100768.9 | 31.5% | 1228 / 0
10 | proposed+hold | masher | 10692.6 / 81311.1 | 13.2% | 136 / 0
10 | proposed+hold | masher-all | 35391.9 / 103328.0 | 34.3% | 574 / 221
10 | proposed+deliberate,slow | masher | 0.0 / 77725.0 | 0.0% | 0 / 0
10 | proposed+deliberate,slow | masher-all | 27648.1 / 96081.0 | 28.8% | 725 / 158
10 | proposed+hold,slow | masher | 10409.2 / 81265.1 | 12.8% | 112 / 0
10 | proposed+hold,slow | masher-all | 28112.7 / 94800.1 | 29.7% | 741 / 163
15 | default | masher | 31976.3 / 127670.2 | 25.0% | 569 / 0
15 | default | masher-all | 59204.0 / 131741.8 | 44.9% | 526 / 0
15 | proposed | masher | 30187.2 / 122108.6 | 24.7% | 233 / 0
15 | proposed | masher-all | 54932.0 / 129922.6 | 42.3% | 190 / 252
15 | default+deliberate | masher | 0.0 / 122824.8 | 0.0% | 0 / 0
15 | default+deliberate | masher-all | 42650.3 / 126577.5 | 33.7% | 478 / 0
15 | proposed+deliberate | masher | 0.0 / 116863.3 | 0.0% | 0 / 0
15 | proposed+deliberate | masher-all | 41053.5 / 125905.0 | 32.6% | 171 / 231
15 | default+hold | masher | 10718.1 / 125346.2 | 8.6% | 179 / 0
15 | default+hold | masher-all | 44717.0 / 127058.4 | 35.2% | 500 / 0
15 | proposed+hold | masher | 11032.4 / 121125.4 | 9.1% | 63 / 0
15 | proposed+hold | masher-all | 43101.6 / 126192.5 | 34.2% | 183 / 237
15 | proposed+deliberate,slow | masher | 0.0 / 119210.1 | 0.0% | 0 / 0
15 | proposed+deliberate,slow | masher-all | 30816.8 / 113035.8 | 27.3% | 698 / 152
15 | proposed+hold,slow | masher | 10526.5 / 121716.1 | 8.6% | 93 / 0
15 | proposed+hold,slow | masher-all | 30917.4 / 110537.2 | 28.0% | 701 / 150

## Sanity

Delay | Mode | Bot | Wins; 95% range | Screen
--- | --- | --- | --- | ---
10 | default | spacer | 4.7% (17/360); 95% 2.5–7.4% | UNTRUSTED
10 | default | timer | 98.9% (356/360); 95% 97.2–99.7% | passes
10 | default | reader | 97.8% (352/360); 95% 95.7–99.2% | passes
10 | default | punisher | 98.1% (353/360); 95% 96.0–99.4% | passes
10 | default | masher | 85.6% (308/360); 95% 81.5–88.9% | passes
10 | default | masher-all | 89.2% (321/360); 95% 85.5–92.2% | passes
10 | proposed | spacer | 1.1% (4/360); 95% 0.3–2.8% | UNTRUSTED
10 | proposed | timer | 98.3% (354/360); 95% 96.4–99.4% | passes
10 | proposed | reader | 96.7% (348/360); 95% 94.3–98.3% | passes
10 | proposed | punisher | 97.2% (350/360); 95% 95.0–98.6% | passes
10 | proposed | masher | 85.6% (308/360); 95% 81.5–88.9% | passes
10 | proposed | masher-all | 92.2% (332/360); 95% 89.0–94.7% | passes
10 | default+deliberate | spacer | 4.4% (16/360); 95% 2.5–7.1% | UNTRUSTED
10 | default+deliberate | timer | 99.2% (357/360); 95% 97.6–100.0% | passes
10 | default+deliberate | reader | 98.1% (353/360); 95% 96.0–99.2% | passes
10 | default+deliberate | punisher | 98.9% (356/360); 95% 97.2–99.7% | passes
10 | default+deliberate | masher | 88.9% (320/360); 95% 85.2–91.7% | passes
10 | default+deliberate | masher-all | 87.2% (314/360); 95% 83.4–90.6% | passes
10 | proposed+deliberate | spacer | 1.9% (7/360); 95% 0.6–4.0% | UNTRUSTED
10 | proposed+deliberate | timer | 99.4% (358/360); 95% 98.0–100.0% | passes
10 | proposed+deliberate | reader | 98.9% (356/360); 95% 97.2–99.7% | passes
10 | proposed+deliberate | punisher | 97.2% (350/360); 95% 95.0–98.6% | passes
10 | proposed+deliberate | masher | 88.6% (319/360); 95% 84.9–91.7% | passes
10 | proposed+deliberate | masher-all | 88.6% (319/360); 95% 84.9–91.7% | passes
10 | default+hold | spacer | 4.7% (17/360); 95% 2.8–7.4% | UNTRUSTED
10 | default+hold | timer | 99.2% (357/360); 95% 97.6–100.0% | passes
10 | default+hold | reader | 98.3% (354/360); 95% 96.4–99.4% | passes
10 | default+hold | punisher | 98.6% (355/360); 95% 96.8–99.7% | passes
10 | default+hold | masher | 89.2% (321/360); 95% 85.5–92.2% | passes
10 | default+hold | masher-all | 86.4% (311/360); 95% 82.5–90.0% | passes
10 | proposed+hold | spacer | 1.9% (7/360); 95% 0.6–4.0% | UNTRUSTED
10 | proposed+hold | timer | 99.4% (358/360); 95% 98.0–100.0% | passes
10 | proposed+hold | reader | 98.9% (356/360); 95% 97.2–99.7% | passes
10 | proposed+hold | punisher | 97.5% (351/360); 95% 95.3–98.9% | passes
10 | proposed+hold | masher | 87.5% (315/360); 95% 83.7–90.8% | passes
10 | proposed+hold | masher-all | 88.1% (317/360); 95% 84.2–91.4% | passes
10 | proposed+deliberate,slow | spacer | 2.2% (8/360); 95% 0.8–4.3% | UNTRUSTED
10 | proposed+deliberate,slow | timer | 100.0% (360/360); 95% 98.9–100.0% | passes
10 | proposed+deliberate,slow | reader | 98.9% (356/360); 95% 97.2–99.7% | passes
10 | proposed+deliberate,slow | punisher | 98.9% (356/360); 95% 97.2–99.7% | passes
10 | proposed+deliberate,slow | masher | 91.7% (330/360); 95% 88.4–94.4% | passes
10 | proposed+deliberate,slow | masher-all | 82.2% (296/360); 95% 77.9–86.1% | passes
10 | proposed+hold,slow | spacer | 2.2% (8/360); 95% 0.8–4.3% | UNTRUSTED
10 | proposed+hold,slow | timer | 100.0% (360/360); 95% 98.9–100.0% | passes
10 | proposed+hold,slow | reader | 98.9% (356/360); 95% 97.2–99.7% | passes
10 | proposed+hold,slow | punisher | 98.9% (356/360); 95% 97.2–99.7% | passes
10 | proposed+hold,slow | masher | 91.7% (330/360); 95% 88.4–94.4% | passes
10 | proposed+hold,slow | masher-all | 80.8% (291/360); 95% 76.5–85.0% | passes
15 | default | spacer | 0.8% (3/360); 95% 0.0–2.4% | UNTRUSTED
15 | default | timer | 82.5% (297/360); 95% 78.2–86.1% | passes
15 | default | reader | 81.1% (292/360); 95% 76.7–85.3% | passes
15 | default | punisher | 87.8% (316/360); 95% 84.0–91.4% | passes
15 | default | masher | 83.3% (300/360); 95% 79.1–87.2% | passes
15 | default | masher-all | 90.8% (327/360); 95% 87.4–93.9% | passes
15 | proposed | spacer | 0.3% (1/360); 95% 0.0–1.6% | UNTRUSTED
15 | proposed | timer | 90.8% (327/360); 95% 87.4–93.9% | passes
15 | proposed | reader | 95.8% (345/360); 95% 93.2–97.8% | passes
15 | proposed | punisher | 93.6% (337/360); 95% 90.6–96.1% | passes
15 | proposed | masher | 83.3% (300/360); 95% 79.1–87.2% | passes
15 | proposed | masher-all | 90.6% (326/360); 95% 87.1–93.3% | passes
15 | default+deliberate | spacer | 0.8% (3/360); 95% 0.0–2.4% | UNTRUSTED
15 | default+deliberate | timer | 82.8% (298/360); 95% 78.5–86.3% | passes
15 | default+deliberate | reader | 84.7% (305/360); 95% 80.6–88.3% | passes
15 | default+deliberate | punisher | 88.1% (317/360); 95% 84.3–91.4% | passes
15 | default+deliberate | masher | 86.1% (310/360); 95% 82.2–89.7% | passes
15 | default+deliberate | masher-all | 84.7% (305/360); 95% 80.6–88.3% | passes
15 | proposed+deliberate | spacer | 0.3% (1/360); 95% 0.0–1.6% | UNTRUSTED
15 | proposed+deliberate | timer | 93.1% (335/360); 95% 89.9–95.6% | passes
15 | proposed+deliberate | reader | 97.2% (350/360); 95% 95.0–98.9% | passes
15 | proposed+deliberate | punisher | 96.7% (348/360); 95% 94.3–98.3% | passes
15 | proposed+deliberate | masher | 86.1% (310/360); 95% 82.2–89.7% | passes
15 | proposed+deliberate | masher-all | 86.4% (311/360); 95% 82.5–90.0% | passes
15 | default+hold | spacer | 0.8% (3/360); 95% 0.0–2.4% | UNTRUSTED
15 | default+hold | timer | 83.1% (299/360); 95% 78.8–86.6% | passes
15 | default+hold | reader | 85.0% (306/360); 95% 80.9–88.6% | passes
15 | default+hold | punisher | 87.5% (315/360); 95% 83.7–90.8% | passes
15 | default+hold | masher | 85.8% (309/360); 95% 81.9–89.4% | passes
15 | default+hold | masher-all | 86.9% (313/360); 95% 83.1–90.3% | passes
15 | proposed+hold | spacer | 0.3% (1/360); 95% 0.0–1.6% | UNTRUSTED
15 | proposed+hold | timer | 93.1% (335/360); 95% 89.9–95.6% | passes
15 | proposed+hold | reader | 96.9% (349/360); 95% 94.6–98.6% | passes
15 | proposed+hold | punisher | 96.7% (348/360); 95% 94.3–98.3% | passes
15 | proposed+hold | masher | 86.7% (312/360); 95% 82.8–90.0% | passes
15 | proposed+hold | masher-all | 87.5% (315/360); 95% 83.7–90.6% | passes
15 | proposed+deliberate,slow | spacer | 0.8% (3/360); 95% 0.0–2.4% | UNTRUSTED
15 | proposed+deliberate,slow | timer | 97.8% (352/360); 95% 95.7–99.2% | passes
15 | proposed+deliberate,slow | reader | 99.2% (357/360); 95% 97.6–100.0% | passes
15 | proposed+deliberate,slow | punisher | 98.9% (356/360); 95% 97.2–99.7% | passes
15 | proposed+deliberate,slow | masher | 88.1% (317/360); 95% 84.3–91.0% | passes
15 | proposed+deliberate,slow | masher-all | 83.3% (300/360); 95% 79.1–86.8% | passes
15 | proposed+hold,slow | spacer | 0.8% (3/360); 95% 0.0–2.4% | UNTRUSTED
15 | proposed+hold,slow | timer | 97.8% (352/360); 95% 95.7–99.2% | passes
15 | proposed+hold,slow | reader | 99.7% (359/360); 95% 98.4–100.0% | passes
15 | proposed+hold,slow | punisher | 98.9% (356/360); 95% 97.2–99.7% | passes
15 | proposed+hold,slow | masher | 88.1% (317/360); 95% 84.3–91.1% | passes
15 | proposed+hold,slow | masher-all | 85.3% (307/360); 95% 81.2–88.6% | passes

## All paired mode comparisons

Delay | Group / opponent | A | B | A minus B | Interpretation
--- | --- | --- | --- | --- | ---
10 | skilled/masher | default | proposed | 0.5 pp | could be luck
10 | skilled/masher-all | default | proposed | 6.6 pp | ranges do not overlap
10 | punisher/masher | default | proposed | 2.2 pp | could be luck
10 | punisher/masher-all | default | proposed | 9.4 pp | ranges do not overlap
10 | spacer/masher | default | proposed | 5.8 pp | could be luck
10 | spacer/masher-all | default | proposed | 1.4 pp | could be luck
10 | defence-capable/masher | default | proposed | -0.7 pp | could be luck
10 | defence-capable/masher-all | default | proposed | 9.3 pp | ranges do not overlap
10 | skilled/masher | default | default+deliberate | -7.2 pp | ranges do not overlap
10 | skilled/masher-all | default | default+deliberate | -5.1 pp | could be luck
10 | punisher/masher | default | default+deliberate | -0.3 pp | could be luck
10 | punisher/masher-all | default | default+deliberate | -4.7 pp | could be luck
10 | spacer/masher | default | default+deliberate | -16.7 pp | ranges do not overlap
10 | spacer/masher-all | default | default+deliberate | -0.3 pp | could be luck
10 | defence-capable/masher | default | default+deliberate | -1.8 pp | could be luck
10 | defence-capable/masher-all | default | default+deliberate | -6.6 pp | ranges do not overlap
10 | skilled/masher | default | proposed+deliberate | -5.9 pp | ranges do not overlap
10 | skilled/masher-all | default | proposed+deliberate | -1.1 pp | could be luck
10 | punisher/masher | default | proposed+deliberate | 0.8 pp | could be luck
10 | punisher/masher-all | default | proposed+deliberate | -1.1 pp | could be luck
10 | spacer/masher | default | proposed+deliberate | -13.3 pp | ranges do not overlap
10 | spacer/masher-all | default | proposed+deliberate | 1.1 pp | could be luck
10 | defence-capable/masher | default | proposed+deliberate | -1.2 pp | could be luck
10 | defence-capable/masher-all | default | proposed+deliberate | -1.9 pp | could be luck
10 | skilled/masher | default | default+hold | -4.0 pp | could be luck
10 | skilled/masher-all | default | default+hold | -4.5 pp | could be luck
10 | punisher/masher | default | default+hold | 0.3 pp | could be luck
10 | punisher/masher-all | default | default+hold | -5.0 pp | could be luck
10 | spacer/masher | default | default+hold | -8.6 pp | could be luck
10 | spacer/masher-all | default | default+hold | -0.3 pp | could be luck
10 | defence-capable/masher | default | default+hold | -1.0 pp | could be luck
10 | defence-capable/masher-all | default | default+hold | -6.1 pp | ranges do not overlap
10 | skilled/masher | default | proposed+hold | -2.6 pp | could be luck
10 | skilled/masher-all | default | proposed+hold | -0.7 pp | could be luck
10 | punisher/masher | default | proposed+hold | 3.6 pp | could be luck
10 | punisher/masher-all | default | proposed+hold | -0.6 pp | could be luck
10 | spacer/masher | default | proposed+hold | -5.6 pp | could be luck
10 | spacer/masher-all | default | proposed+hold | 1.1 pp | could be luck
10 | defence-capable/masher | default | proposed+hold | 0.5 pp | could be luck
10 | defence-capable/masher-all | default | proposed+hold | -1.3 pp | could be luck
10 | skilled/masher | default | proposed+deliberate,slow | -6.1 pp | ranges do not overlap
10 | skilled/masher-all | default | proposed+deliberate,slow | -6.8 pp | ranges do not overlap
10 | punisher/masher | default | proposed+deliberate,slow | 0.3 pp | could be luck
10 | punisher/masher-all | default | proposed+deliberate,slow | -9.4 pp | ranges do not overlap
10 | spacer/masher | default | proposed+deliberate,slow | -13.3 pp | ranges do not overlap
10 | spacer/masher-all | default | proposed+deliberate,slow | 0.3 pp | could be luck
10 | defence-capable/masher | default | proposed+deliberate,slow | -1.6 pp | could be luck
10 | defence-capable/masher-all | default | proposed+deliberate,slow | -10.0 pp | ranges do not overlap
10 | skilled/masher | default | proposed+hold,slow | -4.2 pp | could be luck
10 | skilled/masher-all | default | proposed+hold,slow | -6.9 pp | ranges do not overlap
10 | punisher/masher | default | proposed+hold,slow | 0.8 pp | could be luck
10 | punisher/masher-all | default | proposed+hold,slow | -9.4 pp | ranges do not overlap
10 | spacer/masher | default | proposed+hold,slow | -5.6 pp | could be luck
10 | spacer/masher-all | default | proposed+hold,slow | 0.3 pp | could be luck
10 | defence-capable/masher | default | proposed+hold,slow | -2.0 pp | could be luck
10 | defence-capable/masher-all | default | proposed+hold,slow | -10.2 pp | ranges do not overlap
10 | skilled/masher | proposed | default+deliberate | -7.7 pp | ranges do not overlap
10 | skilled/masher-all | proposed | default+deliberate | -11.7 pp | ranges do not overlap
10 | punisher/masher | proposed | default+deliberate | -2.5 pp | could be luck
10 | punisher/masher-all | proposed | default+deliberate | -14.2 pp | ranges do not overlap
10 | spacer/masher | proposed | default+deliberate | -22.5 pp | ranges do not overlap
10 | spacer/masher-all | proposed | default+deliberate | -1.7 pp | could be luck
10 | defence-capable/masher | proposed | default+deliberate | -1.0 pp | could be luck
10 | defence-capable/masher-all | proposed | default+deliberate | -15.8 pp | ranges do not overlap
10 | skilled/masher | proposed | proposed+deliberate | -6.4 pp | ranges do not overlap
10 | skilled/masher-all | proposed | proposed+deliberate | -7.7 pp | ranges do not overlap
10 | punisher/masher | proposed | proposed+deliberate | -1.4 pp | could be luck
10 | punisher/masher-all | proposed | proposed+deliberate | -10.6 pp | ranges do not overlap
10 | spacer/masher | proposed | proposed+deliberate | -19.2 pp | ranges do not overlap
10 | spacer/masher-all | proposed | proposed+deliberate | -0.3 pp | could be luck
10 | defence-capable/masher | proposed | proposed+deliberate | -0.5 pp | could be luck
10 | defence-capable/masher-all | proposed | proposed+deliberate | -11.1 pp | ranges do not overlap
10 | skilled/masher | proposed | default+hold | -4.4 pp | could be luck
10 | skilled/masher-all | proposed | default+hold | -11.1 pp | ranges do not overlap
10 | punisher/masher | proposed | default+hold | -1.9 pp | could be luck
10 | punisher/masher-all | proposed | default+hold | -14.4 pp | ranges do not overlap
10 | spacer/masher | proposed | default+hold | -14.4 pp | ranges do not overlap
10 | spacer/masher-all | proposed | default+hold | -1.7 pp | could be luck
10 | defence-capable/masher | proposed | default+hold | -0.3 pp | could be luck
10 | defence-capable/masher-all | proposed | default+hold | -15.4 pp | ranges do not overlap
10 | skilled/masher | proposed | proposed+hold | -3.1 pp | could be luck
10 | skilled/masher-all | proposed | proposed+hold | -7.3 pp | ranges do not overlap
10 | punisher/masher | proposed | proposed+hold | 1.4 pp | could be luck
10 | punisher/masher-all | proposed | proposed+hold | -10.0 pp | ranges do not overlap
10 | spacer/masher | proposed | proposed+hold | -11.4 pp | ranges do not overlap
10 | spacer/masher-all | proposed | proposed+hold | -0.3 pp | could be luck
10 | defence-capable/masher | proposed | proposed+hold | 1.2 pp | could be luck
10 | defence-capable/masher-all | proposed | proposed+hold | -10.6 pp | ranges do not overlap
10 | skilled/masher | proposed | proposed+deliberate,slow | -6.6 pp | ranges do not overlap
10 | skilled/masher-all | proposed | proposed+deliberate,slow | -13.3 pp | ranges do not overlap
10 | punisher/masher | proposed | proposed+deliberate,slow | -1.9 pp | could be luck
10 | punisher/masher-all | proposed | proposed+deliberate,slow | -18.9 pp | ranges do not overlap
10 | spacer/masher | proposed | proposed+deliberate,slow | -19.2 pp | ranges do not overlap
10 | spacer/masher-all | proposed | proposed+deliberate,slow | -1.1 pp | could be luck
10 | defence-capable/masher | proposed | proposed+deliberate,slow | -0.8 pp | could be luck
10 | defence-capable/masher-all | proposed | proposed+deliberate,slow | -19.3 pp | ranges do not overlap
10 | skilled/masher | proposed | proposed+hold,slow | -4.6 pp | could be luck
10 | skilled/masher-all | proposed | proposed+hold,slow | -13.5 pp | ranges do not overlap
10 | punisher/masher | proposed | proposed+hold,slow | -1.4 pp | could be luck
10 | punisher/masher-all | proposed | proposed+hold,slow | -18.9 pp | ranges do not overlap
10 | spacer/masher | proposed | proposed+hold,slow | -11.4 pp | ranges do not overlap
10 | spacer/masher-all | proposed | proposed+hold,slow | -1.1 pp | could be luck
10 | defence-capable/masher | proposed | proposed+hold,slow | -1.3 pp | could be luck
10 | defence-capable/masher-all | proposed | proposed+hold,slow | -19.4 pp | ranges do not overlap
10 | skilled/masher | default+deliberate | proposed+deliberate | 1.3 pp | could be luck
10 | skilled/masher-all | default+deliberate | proposed+deliberate | 4.0 pp | could be luck
10 | punisher/masher | default+deliberate | proposed+deliberate | 1.1 pp | could be luck
10 | punisher/masher-all | default+deliberate | proposed+deliberate | 3.6 pp | could be luck
10 | spacer/masher | default+deliberate | proposed+deliberate | 3.3 pp | could be luck
10 | spacer/masher-all | default+deliberate | proposed+deliberate | 1.4 pp | could be luck
10 | defence-capable/masher | default+deliberate | proposed+deliberate | 0.6 pp | could be luck
10 | defence-capable/masher-all | default+deliberate | proposed+deliberate | 4.7 pp | could be luck
10 | skilled/masher | default+deliberate | default+hold | 3.2 pp | could be luck
10 | skilled/masher-all | default+deliberate | default+hold | 0.6 pp | could be luck
10 | punisher/masher | default+deliberate | default+hold | 0.6 pp | could be luck
10 | punisher/masher-all | default+deliberate | default+hold | -0.3 pp | could be luck
10 | spacer/masher | default+deliberate | default+hold | 8.1 pp | could be luck
10 | spacer/masher-all | default+deliberate | default+hold | 0.0 pp | could be luck
10 | defence-capable/masher | default+deliberate | default+hold | 0.7 pp | could be luck
10 | defence-capable/masher-all | default+deliberate | default+hold | 0.5 pp | could be luck
10 | skilled/masher | default+deliberate | proposed+hold | 4.6 pp | could be luck
10 | skilled/masher-all | default+deliberate | proposed+hold | 4.4 pp | could be luck
10 | punisher/masher | default+deliberate | proposed+hold | 3.9 pp | could be luck
10 | punisher/masher-all | default+deliberate | proposed+hold | 4.2 pp | could be luck
10 | spacer/masher | default+deliberate | proposed+hold | 11.1 pp | ranges do not overlap
10 | spacer/masher-all | default+deliberate | proposed+hold | 1.4 pp | could be luck
10 | defence-capable/masher | default+deliberate | proposed+hold | 2.2 pp | could be luck
10 | defence-capable/masher-all | default+deliberate | proposed+hold | 5.3 pp | could be luck
10 | skilled/masher | default+deliberate | proposed+deliberate,slow | 1.1 pp | could be luck
10 | skilled/masher-all | default+deliberate | proposed+deliberate,slow | -1.7 pp | could be luck
10 | punisher/masher | default+deliberate | proposed+deliberate,slow | 0.6 pp | could be luck
10 | punisher/masher-all | default+deliberate | proposed+deliberate,slow | -4.7 pp | could be luck
10 | spacer/masher | default+deliberate | proposed+deliberate,slow | 3.3 pp | could be luck
10 | spacer/masher-all | default+deliberate | proposed+deliberate,slow | 0.6 pp | could be luck
10 | defence-capable/masher | default+deliberate | proposed+deliberate,slow | 0.2 pp | could be luck
10 | defence-capable/masher-all | default+deliberate | proposed+deliberate,slow | -3.4 pp | could be luck
10 | skilled/masher | default+deliberate | proposed+hold,slow | 3.1 pp | could be luck
10 | skilled/masher-all | default+deliberate | proposed+hold,slow | -1.9 pp | could be luck
10 | punisher/masher | default+deliberate | proposed+hold,slow | 1.1 pp | could be luck
10 | punisher/masher-all | default+deliberate | proposed+hold,slow | -4.7 pp | could be luck
10 | spacer/masher | default+deliberate | proposed+hold,slow | 11.1 pp | ranges do not overlap
10 | spacer/masher-all | default+deliberate | proposed+hold,slow | 0.6 pp | could be luck
10 | defence-capable/masher | default+deliberate | proposed+hold,slow | -0.3 pp | could be luck
10 | defence-capable/masher-all | default+deliberate | proposed+hold,slow | -3.6 pp | could be luck
10 | skilled/masher | proposed+deliberate | default+hold | 1.9 pp | could be luck
10 | skilled/masher-all | proposed+deliberate | default+hold | -3.4 pp | could be luck
10 | punisher/masher | proposed+deliberate | default+hold | -0.6 pp | could be luck
10 | punisher/masher-all | proposed+deliberate | default+hold | -3.9 pp | could be luck
10 | spacer/masher | proposed+deliberate | default+hold | 4.7 pp | could be luck
10 | spacer/masher-all | proposed+deliberate | default+hold | -1.4 pp | could be luck
10 | defence-capable/masher | proposed+deliberate | default+hold | 0.2 pp | could be luck
10 | defence-capable/masher-all | proposed+deliberate | default+hold | -4.3 pp | could be luck
10 | skilled/masher | proposed+deliberate | proposed+hold | 3.3 pp | could be luck
10 | skilled/masher-all | proposed+deliberate | proposed+hold | 0.4 pp | could be luck
10 | punisher/masher | proposed+deliberate | proposed+hold | 2.8 pp | could be luck
10 | punisher/masher-all | proposed+deliberate | proposed+hold | 0.6 pp | could be luck
10 | spacer/masher | proposed+deliberate | proposed+hold | 7.8 pp | could be luck
10 | spacer/masher-all | proposed+deliberate | proposed+hold | 0.0 pp | could be luck
10 | defence-capable/masher | proposed+deliberate | proposed+hold | 1.7 pp | could be luck
10 | defence-capable/masher-all | proposed+deliberate | proposed+hold | 0.6 pp | could be luck
10 | skilled/masher | proposed+deliberate | proposed+deliberate,slow | -0.2 pp | could be luck
10 | skilled/masher-all | proposed+deliberate | proposed+deliberate,slow | -5.6 pp | could be luck
10 | punisher/masher | proposed+deliberate | proposed+deliberate,slow | -0.6 pp | could be luck
10 | punisher/masher-all | proposed+deliberate | proposed+deliberate,slow | -8.3 pp | ranges do not overlap
10 | spacer/masher | proposed+deliberate | proposed+deliberate,slow | 0.0 pp | could be luck
10 | spacer/masher-all | proposed+deliberate | proposed+deliberate,slow | -0.8 pp | could be luck
10 | defence-capable/masher | proposed+deliberate | proposed+deliberate,slow | -0.4 pp | could be luck
10 | defence-capable/masher-all | proposed+deliberate | proposed+deliberate,slow | -8.1 pp | ranges do not overlap
10 | skilled/masher | proposed+deliberate | proposed+hold,slow | 1.8 pp | could be luck
10 | skilled/masher-all | proposed+deliberate | proposed+hold,slow | -5.8 pp | could be luck
10 | punisher/masher | proposed+deliberate | proposed+hold,slow | 0.0 pp | could be luck
10 | punisher/masher-all | proposed+deliberate | proposed+hold,slow | -8.3 pp | ranges do not overlap
10 | spacer/masher | proposed+deliberate | proposed+hold,slow | 7.8 pp | could be luck
10 | spacer/masher-all | proposed+deliberate | proposed+hold,slow | -0.8 pp | could be luck
10 | defence-capable/masher | proposed+deliberate | proposed+hold,slow | -0.8 pp | could be luck
10 | defence-capable/masher-all | proposed+deliberate | proposed+hold,slow | -8.3 pp | ranges do not overlap
10 | skilled/masher | default+hold | proposed+hold | 1.4 pp | could be luck
10 | skilled/masher-all | default+hold | proposed+hold | 3.8 pp | could be luck
10 | punisher/masher | default+hold | proposed+hold | 3.3 pp | could be luck
10 | punisher/masher-all | default+hold | proposed+hold | 4.4 pp | could be luck
10 | spacer/masher | default+hold | proposed+hold | 3.1 pp | could be luck
10 | spacer/masher-all | default+hold | proposed+hold | 1.4 pp | could be luck
10 | defence-capable/masher | default+hold | proposed+hold | 1.5 pp | could be luck
10 | defence-capable/masher-all | default+hold | proposed+hold | 4.8 pp | could be luck
10 | skilled/masher | default+hold | proposed+deliberate,slow | -2.1 pp | could be luck
10 | skilled/masher-all | default+hold | proposed+deliberate,slow | -2.2 pp | could be luck
10 | punisher/masher | default+hold | proposed+deliberate,slow | 0.0 pp | could be luck
10 | punisher/masher-all | default+hold | proposed+deliberate,slow | -4.4 pp | could be luck
10 | spacer/masher | default+hold | proposed+deliberate,slow | -4.7 pp | could be luck
10 | spacer/masher-all | default+hold | proposed+deliberate,slow | 0.6 pp | could be luck
10 | defence-capable/masher | default+hold | proposed+deliberate,slow | -0.6 pp | could be luck
10 | defence-capable/masher-all | default+hold | proposed+deliberate,slow | -3.9 pp | could be luck
10 | skilled/masher | default+hold | proposed+hold,slow | -0.2 pp | could be luck
10 | skilled/masher-all | default+hold | proposed+hold,slow | -2.4 pp | could be luck
10 | punisher/masher | default+hold | proposed+hold,slow | 0.6 pp | could be luck
10 | punisher/masher-all | default+hold | proposed+hold,slow | -4.4 pp | could be luck
10 | spacer/masher | default+hold | proposed+hold,slow | 3.1 pp | could be luck
10 | spacer/masher-all | default+hold | proposed+hold,slow | 0.6 pp | could be luck
10 | defence-capable/masher | default+hold | proposed+hold,slow | -1.0 pp | could be luck
10 | defence-capable/masher-all | default+hold | proposed+hold,slow | -4.1 pp | could be luck
10 | skilled/masher | proposed+hold | proposed+deliberate,slow | -3.5 pp | could be luck
10 | skilled/masher-all | proposed+hold | proposed+deliberate,slow | -6.0 pp | ranges do not overlap
10 | punisher/masher | proposed+hold | proposed+deliberate,slow | -3.3 pp | could be luck
10 | punisher/masher-all | proposed+hold | proposed+deliberate,slow | -8.9 pp | ranges do not overlap
10 | spacer/masher | proposed+hold | proposed+deliberate,slow | -7.8 pp | could be luck
10 | spacer/masher-all | proposed+hold | proposed+deliberate,slow | -0.8 pp | could be luck
10 | defence-capable/masher | proposed+hold | proposed+deliberate,slow | -2.0 pp | could be luck
10 | defence-capable/masher-all | proposed+hold | proposed+deliberate,slow | -8.7 pp | ranges do not overlap
10 | skilled/masher | proposed+hold | proposed+hold,slow | -1.6 pp | could be luck
10 | skilled/masher-all | proposed+hold | proposed+hold,slow | -6.2 pp | ranges do not overlap
10 | punisher/masher | proposed+hold | proposed+hold,slow | -2.8 pp | could be luck
10 | punisher/masher-all | proposed+hold | proposed+hold,slow | -8.9 pp | ranges do not overlap
10 | spacer/masher | proposed+hold | proposed+hold,slow | 0.0 pp | could be luck
10 | spacer/masher-all | proposed+hold | proposed+hold,slow | -0.8 pp | could be luck
10 | defence-capable/masher | proposed+hold | proposed+hold,slow | -2.5 pp | could be luck
10 | defence-capable/masher-all | proposed+hold | proposed+hold,slow | -8.9 pp | ranges do not overlap
10 | skilled/masher | proposed+deliberate,slow | proposed+hold,slow | 1.9 pp | could be luck
10 | skilled/masher-all | proposed+deliberate,slow | proposed+hold,slow | -0.2 pp | could be luck
10 | punisher/masher | proposed+deliberate,slow | proposed+hold,slow | 0.6 pp | could be luck
10 | punisher/masher-all | proposed+deliberate,slow | proposed+hold,slow | 0.0 pp | could be luck
10 | spacer/masher | proposed+deliberate,slow | proposed+hold,slow | 7.8 pp | could be luck
10 | spacer/masher-all | proposed+deliberate,slow | proposed+hold,slow | 0.0 pp | could be luck
10 | defence-capable/masher | proposed+deliberate,slow | proposed+hold,slow | -0.5 pp | could be luck
10 | defence-capable/masher-all | proposed+deliberate,slow | proposed+hold,slow | -0.2 pp | could be luck
15 | skilled/masher | default | proposed | -7.0 pp | ranges do not overlap
15 | skilled/masher-all | default | proposed | -3.3 pp | could be luck
15 | punisher/masher | default | proposed | -4.7 pp | could be luck
15 | punisher/masher-all | default | proposed | -3.3 pp | could be luck
15 | spacer/masher | default | proposed | 0.8 pp | could be luck
15 | spacer/masher-all | default | proposed | 0.0 pp | could be luck
15 | defence-capable/masher | default | proposed | -8.9 pp | ranges do not overlap
15 | defence-capable/masher-all | default | proposed | -4.4 pp | could be luck
15 | skilled/masher | default | default+deliberate | -6.2 pp | could be luck
15 | skilled/masher-all | default | default+deliberate | -8.0 pp | ranges do not overlap
15 | punisher/masher | default | default+deliberate | 1.7 pp | could be luck
15 | punisher/masher-all | default | default+deliberate | -14.7 pp | ranges do not overlap
15 | spacer/masher | default | default+deliberate | -16.1 pp | ranges do not overlap
15 | spacer/masher-all | default | default+deliberate | 0.0 pp | could be luck
15 | defence-capable/masher | default | default+deliberate | -0.3 pp | could be luck
15 | defence-capable/masher-all | default | default+deliberate | -12.9 pp | ranges do not overlap
15 | skilled/masher | default | proposed+deliberate | -11.6 pp | ranges do not overlap
15 | skilled/masher-all | default | proposed+deliberate | -9.7 pp | ranges do not overlap
15 | punisher/masher | default | proposed+deliberate | -8.1 pp | could be luck
15 | punisher/masher-all | default | proposed+deliberate | -11.7 pp | ranges do not overlap
15 | spacer/masher | default | proposed+deliberate | -18.1 pp | ranges do not overlap
15 | spacer/masher-all | default | proposed+deliberate | 0.0 pp | could be luck
15 | defence-capable/masher | default | proposed+deliberate | -8.2 pp | could be luck
15 | defence-capable/masher-all | default | proposed+deliberate | -13.6 pp | ranges do not overlap
15 | skilled/masher | default | default+hold | -2.3 pp | could be luck
15 | skilled/masher-all | default | default+hold | -7.3 pp | ranges do not overlap
15 | punisher/masher | default | default+hold | 2.5 pp | could be luck
15 | punisher/masher-all | default | default+hold | -12.8 pp | ranges do not overlap
15 | spacer/masher | default | default+hold | -7.2 pp | ranges do not overlap
15 | spacer/masher-all | default | default+hold | 0.0 pp | could be luck
15 | defence-capable/masher | default | default+hold | 0.9 pp | could be luck
15 | defence-capable/masher-all | default | default+hold | -11.6 pp | ranges do not overlap
15 | skilled/masher | default | proposed+hold | -6.2 pp | could be luck
15 | skilled/masher-all | default | proposed+hold | -9.4 pp | ranges do not overlap
15 | punisher/masher | default | proposed+hold | -4.4 pp | could be luck
15 | punisher/masher-all | default | proposed+hold | -10.6 pp | could be luck
15 | spacer/masher | default | proposed+hold | -6.4 pp | ranges do not overlap
15 | spacer/masher-all | default | proposed+hold | 0.0 pp | could be luck
15 | defence-capable/masher | default | proposed+hold | -5.6 pp | could be luck
15 | defence-capable/masher-all | default | proposed+hold | -13.0 pp | ranges do not overlap
15 | skilled/masher | default | proposed+deliberate,slow | -9.2 pp | ranges do not overlap
15 | skilled/masher-all | default | proposed+deliberate,slow | -23.9 pp | ranges do not overlap
15 | punisher/masher | default | proposed+deliberate,slow | -4.2 pp | could be luck
15 | punisher/masher-all | default | proposed+deliberate,slow | -29.4 pp | ranges do not overlap
15 | spacer/masher | default | proposed+deliberate,slow | -18.1 pp | ranges do not overlap
15 | spacer/masher-all | default | proposed+deliberate,slow | 0.0 pp | could be luck
15 | defence-capable/masher | default | proposed+deliberate,slow | -4.5 pp | could be luck
15 | defence-capable/masher-all | default | proposed+deliberate,slow | -33.7 pp | ranges do not overlap
15 | skilled/masher | default | proposed+hold,slow | -5.1 pp | could be luck
15 | skilled/masher-all | default | proposed+hold,slow | -25.7 pp | ranges do not overlap
15 | punisher/masher | default | proposed+hold,slow | -3.6 pp | could be luck
15 | punisher/masher-all | default | proposed+hold,slow | -32.5 pp | ranges do not overlap
15 | spacer/masher | default | proposed+hold,slow | -7.2 pp | ranges do not overlap
15 | spacer/masher-all | default | proposed+hold,slow | 0.0 pp | could be luck
15 | defence-capable/masher | default | proposed+hold,slow | -3.9 pp | could be luck
15 | defence-capable/masher-all | default | proposed+hold,slow | -36.6 pp | ranges do not overlap
15 | skilled/masher | proposed | default+deliberate | 0.8 pp | could be luck
15 | skilled/masher-all | proposed | default+deliberate | -4.6 pp | could be luck
15 | punisher/masher | proposed | default+deliberate | 6.4 pp | could be luck
15 | punisher/masher-all | proposed | default+deliberate | -11.4 pp | ranges do not overlap
15 | spacer/masher | proposed | default+deliberate | -16.9 pp | ranges do not overlap
15 | spacer/masher-all | proposed | default+deliberate | 0.0 pp | could be luck
15 | defence-capable/masher | proposed | default+deliberate | 8.6 pp | could be luck
15 | defence-capable/masher-all | proposed | default+deliberate | -8.4 pp | ranges do not overlap
15 | skilled/masher | proposed | proposed+deliberate | -4.5 pp | could be luck
15 | skilled/masher-all | proposed | proposed+deliberate | -6.4 pp | ranges do not overlap
15 | punisher/masher | proposed | proposed+deliberate | -3.3 pp | could be luck
15 | punisher/masher-all | proposed | proposed+deliberate | -8.3 pp | could be luck
15 | spacer/masher | proposed | proposed+deliberate | -18.9 pp | ranges do not overlap
15 | spacer/masher-all | proposed | proposed+deliberate | 0.0 pp | could be luck
15 | defence-capable/masher | proposed | proposed+deliberate | 0.6 pp | could be luck
15 | defence-capable/masher-all | proposed | proposed+deliberate | -9.2 pp | ranges do not overlap
15 | skilled/masher | proposed | default+hold | 4.7 pp | could be luck
15 | skilled/masher-all | proposed | default+hold | -4.0 pp | could be luck
15 | punisher/masher | proposed | default+hold | 7.2 pp | could be luck
15 | punisher/masher-all | proposed | default+hold | -9.4 pp | could be luck
15 | spacer/masher | proposed | default+hold | -8.1 pp | ranges do not overlap
15 | spacer/masher-all | proposed | default+hold | 0.0 pp | could be luck
15 | defence-capable/masher | proposed | default+hold | 9.8 pp | ranges do not overlap
15 | defence-capable/masher-all | proposed | default+hold | -7.1 pp | could be luck
15 | skilled/masher | proposed | proposed+hold | 0.8 pp | could be luck
15 | skilled/masher-all | proposed | proposed+hold | -6.1 pp | ranges do not overlap
15 | punisher/masher | proposed | proposed+hold | 0.3 pp | could be luck
15 | punisher/masher-all | proposed | proposed+hold | -7.2 pp | could be luck
15 | spacer/masher | proposed | proposed+hold | -7.2 pp | ranges do not overlap
15 | spacer/masher-all | proposed | proposed+hold | 0.0 pp | could be luck
15 | defence-capable/masher | proposed | proposed+hold | 3.3 pp | could be luck
15 | defence-capable/masher-all | proposed | proposed+hold | -8.5 pp | ranges do not overlap
15 | skilled/masher | proposed | proposed+deliberate,slow | -2.1 pp | could be luck
15 | skilled/masher-all | proposed | proposed+deliberate,slow | -20.6 pp | ranges do not overlap
15 | punisher/masher | proposed | proposed+deliberate,slow | 0.6 pp | could be luck
15 | punisher/masher-all | proposed | proposed+deliberate,slow | -26.1 pp | ranges do not overlap
15 | spacer/masher | proposed | proposed+deliberate,slow | -18.9 pp | ranges do not overlap
15 | spacer/masher-all | proposed | proposed+deliberate,slow | 0.0 pp | could be luck
15 | defence-capable/masher | proposed | proposed+deliberate,slow | 4.4 pp | could be luck
15 | defence-capable/masher-all | proposed | proposed+deliberate,slow | -29.3 pp | ranges do not overlap
15 | skilled/masher | proposed | proposed+hold,slow | 1.9 pp | could be luck
15 | skilled/masher-all | proposed | proposed+hold,slow | -22.4 pp | ranges do not overlap
15 | punisher/masher | proposed | proposed+hold,slow | 1.1 pp | could be luck
15 | punisher/masher-all | proposed | proposed+hold,slow | -29.2 pp | ranges do not overlap
15 | spacer/masher | proposed | proposed+hold,slow | -8.1 pp | ranges do not overlap
15 | spacer/masher-all | proposed | proposed+hold,slow | 0.0 pp | could be luck
15 | defence-capable/masher | proposed | proposed+hold,slow | 5.0 pp | could be luck
15 | defence-capable/masher-all | proposed | proposed+hold,slow | -32.1 pp | ranges do not overlap
15 | skilled/masher | default+deliberate | proposed+deliberate | -5.4 pp | could be luck
15 | skilled/masher-all | default+deliberate | proposed+deliberate | -1.8 pp | could be luck
15 | punisher/masher | default+deliberate | proposed+deliberate | -9.7 pp | could be luck
15 | punisher/masher-all | default+deliberate | proposed+deliberate | 3.1 pp | could be luck
15 | spacer/masher | default+deliberate | proposed+deliberate | -1.9 pp | could be luck
15 | spacer/masher-all | default+deliberate | proposed+deliberate | 0.0 pp | could be luck
15 | defence-capable/masher | default+deliberate | proposed+deliberate | -8.0 pp | could be luck
15 | defence-capable/masher-all | default+deliberate | proposed+deliberate | -0.7 pp | could be luck
15 | skilled/masher | default+deliberate | default+hold | 3.9 pp | could be luck
15 | skilled/masher-all | default+deliberate | default+hold | 0.6 pp | could be luck
15 | punisher/masher | default+deliberate | default+hold | 0.8 pp | could be luck
15 | punisher/masher-all | default+deliberate | default+hold | 1.9 pp | could be luck
15 | spacer/masher | default+deliberate | default+hold | 8.9 pp | ranges do not overlap
15 | spacer/masher-all | default+deliberate | default+hold | 0.0 pp | could be luck
15 | defence-capable/masher | default+deliberate | default+hold | 1.2 pp | could be luck
15 | defence-capable/masher-all | default+deliberate | default+hold | 1.3 pp | could be luck
15 | skilled/masher | default+deliberate | proposed+hold | 0.0 pp | could be luck
15 | skilled/masher-all | default+deliberate | proposed+hold | -1.5 pp | could be luck
15 | punisher/masher | default+deliberate | proposed+hold | -6.1 pp | could be luck
15 | punisher/masher-all | default+deliberate | proposed+hold | 4.2 pp | could be luck
15 | spacer/masher | default+deliberate | proposed+hold | 9.7 pp | ranges do not overlap
15 | spacer/masher-all | default+deliberate | proposed+hold | 0.0 pp | could be luck
15 | defence-capable/masher | default+deliberate | proposed+hold | -5.3 pp | could be luck
15 | defence-capable/masher-all | default+deliberate | proposed+hold | -0.1 pp | could be luck
15 | skilled/masher | default+deliberate | proposed+deliberate,slow | -3.0 pp | could be luck
15 | skilled/masher-all | default+deliberate | proposed+deliberate,slow | -15.9 pp | ranges do not overlap
15 | punisher/masher | default+deliberate | proposed+deliberate,slow | -5.8 pp | could be luck
15 | punisher/masher-all | default+deliberate | proposed+deliberate,slow | -14.7 pp | ranges do not overlap
15 | spacer/masher | default+deliberate | proposed+deliberate,slow | -1.9 pp | could be luck
15 | spacer/masher-all | default+deliberate | proposed+deliberate,slow | 0.0 pp | could be luck
15 | defence-capable/masher | default+deliberate | proposed+deliberate,slow | -4.3 pp | could be luck
15 | defence-capable/masher-all | default+deliberate | proposed+deliberate,slow | -20.8 pp | ranges do not overlap
15 | skilled/masher | default+deliberate | proposed+hold,slow | 1.1 pp | could be luck
15 | skilled/masher-all | default+deliberate | proposed+hold,slow | -17.8 pp | ranges do not overlap
15 | punisher/masher | default+deliberate | proposed+hold,slow | -5.3 pp | could be luck
15 | punisher/masher-all | default+deliberate | proposed+hold,slow | -17.8 pp | ranges do not overlap
15 | spacer/masher | default+deliberate | proposed+hold,slow | 8.9 pp | ranges do not overlap
15 | spacer/masher-all | default+deliberate | proposed+hold,slow | 0.0 pp | could be luck
15 | defence-capable/masher | default+deliberate | proposed+hold,slow | -3.6 pp | could be luck
15 | defence-capable/masher-all | default+deliberate | proposed+hold,slow | -23.7 pp | ranges do not overlap
15 | skilled/masher | proposed+deliberate | default+hold | 9.3 pp | ranges do not overlap
15 | skilled/masher-all | proposed+deliberate | default+hold | 2.4 pp | could be luck
15 | punisher/masher | proposed+deliberate | default+hold | 10.6 pp | could be luck
15 | punisher/masher-all | proposed+deliberate | default+hold | -1.1 pp | could be luck
15 | spacer/masher | proposed+deliberate | default+hold | 10.8 pp | ranges do not overlap
15 | spacer/masher-all | proposed+deliberate | default+hold | 0.0 pp | could be luck
15 | defence-capable/masher | proposed+deliberate | default+hold | 9.2 pp | could be luck
15 | defence-capable/masher-all | proposed+deliberate | default+hold | 2.0 pp | could be luck
15 | skilled/masher | proposed+deliberate | proposed+hold | 5.4 pp | could be luck
15 | skilled/masher-all | proposed+deliberate | proposed+hold | 0.3 pp | could be luck
15 | punisher/masher | proposed+deliberate | proposed+hold | 3.6 pp | could be luck
15 | punisher/masher-all | proposed+deliberate | proposed+hold | 1.1 pp | could be luck
15 | spacer/masher | proposed+deliberate | proposed+hold | 11.7 pp | ranges do not overlap
15 | spacer/masher-all | proposed+deliberate | proposed+hold | 0.0 pp | could be luck
15 | defence-capable/masher | proposed+deliberate | proposed+hold | 2.7 pp | could be luck
15 | defence-capable/masher-all | proposed+deliberate | proposed+hold | 0.6 pp | could be luck
15 | skilled/masher | proposed+deliberate | proposed+deliberate,slow | 2.4 pp | could be luck
15 | skilled/masher-all | proposed+deliberate | proposed+deliberate,slow | -14.2 pp | ranges do not overlap
15 | punisher/masher | proposed+deliberate | proposed+deliberate,slow | 3.9 pp | could be luck
15 | punisher/masher-all | proposed+deliberate | proposed+deliberate,slow | -17.8 pp | ranges do not overlap
15 | spacer/masher | proposed+deliberate | proposed+deliberate,slow | 0.0 pp | could be luck
15 | spacer/masher-all | proposed+deliberate | proposed+deliberate,slow | 0.0 pp | could be luck
15 | defence-capable/masher | proposed+deliberate | proposed+deliberate,slow | 3.7 pp | could be luck
15 | defence-capable/masher-all | proposed+deliberate | proposed+deliberate,slow | -20.1 pp | ranges do not overlap
15 | skilled/masher | proposed+deliberate | proposed+hold,slow | 6.5 pp | could be luck
15 | skilled/masher-all | proposed+deliberate | proposed+hold,slow | -16.0 pp | ranges do not overlap
15 | punisher/masher | proposed+deliberate | proposed+hold,slow | 4.4 pp | could be luck
15 | punisher/masher-all | proposed+deliberate | proposed+hold,slow | -20.8 pp | ranges do not overlap
15 | spacer/masher | proposed+deliberate | proposed+hold,slow | 10.8 pp | ranges do not overlap
15 | spacer/masher-all | proposed+deliberate | proposed+hold,slow | 0.0 pp | could be luck
15 | defence-capable/masher | proposed+deliberate | proposed+hold,slow | 4.4 pp | could be luck
15 | defence-capable/masher-all | proposed+deliberate | proposed+hold,slow | -23.0 pp | ranges do not overlap
15 | skilled/masher | default+hold | proposed+hold | -3.9 pp | could be luck
15 | skilled/masher-all | default+hold | proposed+hold | -2.1 pp | could be luck
15 | punisher/masher | default+hold | proposed+hold | -6.9 pp | could be luck
15 | punisher/masher-all | default+hold | proposed+hold | 2.2 pp | could be luck
15 | spacer/masher | default+hold | proposed+hold | 0.8 pp | could be luck
15 | spacer/masher-all | default+hold | proposed+hold | 0.0 pp | could be luck
15 | defence-capable/masher | default+hold | proposed+hold | -6.5 pp | could be luck
15 | defence-capable/masher-all | default+hold | proposed+hold | -1.4 pp | could be luck
15 | skilled/masher | default+hold | proposed+deliberate,slow | -6.9 pp | could be luck
15 | skilled/masher-all | default+hold | proposed+deliberate,slow | -16.6 pp | ranges do not overlap
15 | punisher/masher | default+hold | proposed+deliberate,slow | -6.7 pp | could be luck
15 | punisher/masher-all | default+hold | proposed+deliberate,slow | -16.7 pp | ranges do not overlap
15 | spacer/masher | default+hold | proposed+deliberate,slow | -10.8 pp | ranges do not overlap
15 | spacer/masher-all | default+hold | proposed+deliberate,slow | 0.0 pp | could be luck
15 | defence-capable/masher | default+hold | proposed+deliberate,slow | -5.5 pp | could be luck
15 | defence-capable/masher-all | default+hold | proposed+deliberate,slow | -22.1 pp | ranges do not overlap
15 | skilled/masher | default+hold | proposed+hold,slow | -2.8 pp | could be luck
15 | skilled/masher-all | default+hold | proposed+hold,slow | -18.4 pp | ranges do not overlap
15 | punisher/masher | default+hold | proposed+hold,slow | -6.1 pp | could be luck
15 | punisher/masher-all | default+hold | proposed+hold,slow | -19.7 pp | ranges do not overlap
15 | spacer/masher | default+hold | proposed+hold,slow | 0.0 pp | could be luck
15 | spacer/masher-all | default+hold | proposed+hold,slow | 0.0 pp | could be luck
15 | defence-capable/masher | default+hold | proposed+hold,slow | -4.8 pp | could be luck
15 | defence-capable/masher-all | default+hold | proposed+hold,slow | -25.0 pp | ranges do not overlap
15 | skilled/masher | proposed+hold | proposed+deliberate,slow | -3.0 pp | could be luck
15 | skilled/masher-all | proposed+hold | proposed+deliberate,slow | -14.4 pp | ranges do not overlap
15 | punisher/masher | proposed+hold | proposed+deliberate,slow | 0.3 pp | could be luck
15 | punisher/masher-all | proposed+hold | proposed+deliberate,slow | -18.9 pp | ranges do not overlap
15 | spacer/masher | proposed+hold | proposed+deliberate,slow | -11.7 pp | ranges do not overlap
15 | spacer/masher-all | proposed+hold | proposed+deliberate,slow | 0.0 pp | could be luck
15 | defence-capable/masher | proposed+hold | proposed+deliberate,slow | 1.0 pp | could be luck
15 | defence-capable/masher-all | proposed+hold | proposed+deliberate,slow | -20.7 pp | ranges do not overlap
15 | skilled/masher | proposed+hold | proposed+hold,slow | 1.1 pp | could be luck
15 | skilled/masher-all | proposed+hold | proposed+hold,slow | -16.3 pp | ranges do not overlap
15 | punisher/masher | proposed+hold | proposed+hold,slow | 0.8 pp | could be luck
15 | punisher/masher-all | proposed+hold | proposed+hold,slow | -21.9 pp | ranges do not overlap
15 | spacer/masher | proposed+hold | proposed+hold,slow | -0.8 pp | could be luck
15 | spacer/masher-all | proposed+hold | proposed+hold,slow | 0.0 pp | could be luck
15 | defence-capable/masher | proposed+hold | proposed+hold,slow | 1.7 pp | could be luck
15 | defence-capable/masher-all | proposed+hold | proposed+hold,slow | -23.6 pp | ranges do not overlap
15 | skilled/masher | proposed+deliberate,slow | proposed+hold,slow | 4.1 pp | could be luck
15 | skilled/masher-all | proposed+deliberate,slow | proposed+hold,slow | -1.9 pp | could be luck
15 | punisher/masher | proposed+deliberate,slow | proposed+hold,slow | 0.6 pp | could be luck
15 | punisher/masher-all | proposed+deliberate,slow | proposed+hold,slow | -3.1 pp | could be luck
15 | spacer/masher | proposed+deliberate,slow | proposed+hold,slow | 10.8 pp | ranges do not overlap
15 | spacer/masher-all | proposed+deliberate,slow | proposed+hold,slow | 0.0 pp | could be luck
15 | defence-capable/masher | proposed+deliberate,slow | proposed+hold,slow | 0.6 pp | could be luck
15 | defence-capable/masher-all | proposed+deliberate,slow | proposed+hold,slow | -2.9 pp | could be luck

## Verification and delivery

- **683 tests passed**, zero failed, via `PATH=/usr/local/bin:$PATH npm --script-shell=/bin/bash test`. Added seven tests for hold boundaries, release reset, dedicated capture, combination precedence, split-guard break buttons, delayed reaction timing, guess edges, wasted/pending taps, and passive replay equality across the roster. Existing default fingerprint test passes.
- Default fingerprint remains `c1fc5ebc1cb77d6845830c4c67fa56d416bf079f78d16c51fac4e1b8d049071a`. No default rule/timing/fighter/hitbox change; this task does not edit `dist/combat.js`.
- [GitHub Actions tournament](https://github.com/Tusingw29/rift-duel/actions/runs/40718209050) succeeded at measured commit `f7e0c66`. **Workflow wall time: 3m 51s**, including checkout and artifact upload. Summed per-mode tournament elapsed time: **342.4s**, with the two delay jobs running concurrently. These are elapsed timings, not summed worker CPU time.
- All 16 archives match the current measured source hashes; every mode/delay has 5,040 bouts, with **zero censored**. Break attempts reconcile to credited successes + wasted + pending for every player. See [archive audit](archive-audit.json) and [workflow metadata](workflow.json).
- Browser checks use the real main loop, keyboard input and command parser with the renderer stubbed for deterministic stepping: short D+J yields a normal attack, held D then J yields capture, U remains immediate, and both rulesets show correct manual text. Dashboard checks cover all eight modes, both delays, confidence/overlap text, break counters, old-study access, and 390px layout. [Browser evidence](browser.json). This does not validate physical controllers or normal-speed feel; no new rendering code was introduced here.
- The 15f reaction examples in [this trace](reaction-projectile-examples.jsonl) are **travelling capture projectiles**, not a reaction beating the uninterrupted 13f close-grab window. Reproduce the diagnostic subset with `node scripts/skill/trace-grab-breaks.mjs`; it is separate from the 80,640 tournament bouts.
- All older result directories remain unchanged. Current results: `art/skill-lab/2026-10-28-grab-retest/`. Timer, reader and punisher pass the random sanity screen in these runs; spacer remains untrusted and visible.

## Playtest links

- [Dashboard](http://localhost:4203/dist/skill-lab.html?study=grab-retest)
- [Default + hold](http://localhost:4203/dist/index.html?grab=hold)
- [Proposed + hold](http://localhost:4203/dist/index.html?balance=proposed&grab=hold)
- [Proposed + hold + slow](http://localhost:4203/dist/index.html?balance=proposed&grab=hold,slow)

If the server stops: run `python3 -m http.server 4203 --bind 127.0.0.1` from `~/rift-worktrees/skill-lab`. Status: **Review, awaiting Adam’s verdict**. Branch only; no gameplay merge or default promotion.

## Captures inspected

- [Desktop comparison](dashboard-desktop-1793202535573.jpg): all eight mode columns visible at 1440px; defence-capable group first, original group retained, confidence ranges visible.
- [Phone layout](dashboard-phone-1793202535573.jpg): controls wrap without page overflow at 390px. Wide comparison tables scroll horizontally; smaller-screen table reading remains less convenient than desktop.

These captures verify the report UI, not normal-speed combat feel.
