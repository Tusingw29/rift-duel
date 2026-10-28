# GRAB-OPTIONS review

At the requested 15-frame reaction delay, **deliberate,slow** has the highest average original-skilled win rate against the two mashers among tested options. Against the original masher: **33.4% (361/1080); 95% 29.4–37.4%**, 10.1 percentage points versus proposed alone (ranges do not overlap). Against masher-all: **33.0% (356/1080); 95% 30.0–35.9%**, 13.6 points (ranges do not overlap). This ranks these bots, not human skill; check punisher separately below. Overlap with other options does not establish a unique winner. Default gameplay remains unchanged.

**Recommended next playtest: deliberate + slow, with deliberate alone as the comparison.** The clearest supported change is requiring an intentional capture button. Adding slow has a higher average against masher-all, but its range overlaps deliberate alone, so the extra benefit **could be luck**. The trusted punisher improves against masher-all from **33.6% (121/360; 28.3–38.9%) to 51.1% (184/360; 45.8–56.7%)**, **+17.5 points**, with non-overlapping ranges. Against the original masher its **41.7% (95% 36.4–47.2%) → 50.3% (95% 44.7–55.6%), +8.6 points** still has overlapping ranges. Spacer fails sanity across the study and is not evidence of skilled human play.

**Fresh guard alone:** more capture breaks, but its win-rate changes overlap proposed-only balance. **Slow alone:** helps against masher-all, not clearly against the original masher. **Tell:** every bot record is identical to proposed-only after excluding the mode label; it must be judged by a person at normal speed.


All non-default modes use proposed balance; option names mean proposed plus that option.

Original skilled group is spacer + timer + reader. Punisher is reported separately.

36 ordered fighter pairs, both seats, five seeds per matchup: 360 bouts per policy/opponent; aggregate 1080.

Ranges conservatively envelope 95% Wilson and 2,000-draw cluster-bootstrap intervals of strict wins; draws count in the denominator. Fighter-pair/seed blocks keep mirrored seats and aggregate policies together (180 blocks per estimate). Overlapping mode ranges are labeled could be luck, not statistical equivalence. Cluster resampling addresses repeated-seat dependence, but five seeds and these ranges do not prove human balance. No multiple-comparison correction.

tell is visual only and cannot be measured by bots, which already read visible move state after their delay. Human playtest required.

Capture shares use actual HP damage against the original three plus punisher. Capture breaks are event counts, not inferred guard presses.

## Win rates

Delay | Mode | Group / opponent | Wins; 95% range | Change vs proposed
--- | --- | --- | --- | ---
10 | default | skilled/masher | 55.2% (596/1080); 95% 52.2–58.1% | 5.9 pp; could be luck
10 | default | skilled/masher-all | 37.7% (407/1080); 95% 34.6–40.9% | 6.1 pp; ranges do not overlap
10 | default | punisher/masher | 78.1% (281/360); 95% 73.5–82.2% | 5.0 pp; could be luck
10 | default | punisher/masher-all | 61.9% (223/360); 95% 56.4–67.8% | 6.4 pp; could be luck
10 | default | spacer/masher | 13.1% (47/360); 95% 9.4–17.2% | 5.8 pp; could be luck
10 | default | spacer/masher-all | 1.4% (5/360); 95% 0.3–3.2% | 1.4 pp; could be luck
10 | proposed | skilled/masher | 49.3% (532/1080); 95% 46.1–52.6% | 0.0 pp; could be luck
10 | proposed | skilled/masher-all | 31.6% (341/1080); 95% 28.7–34.5% | 0.0 pp; could be luck
10 | proposed | punisher/masher | 73.1% (263/360); 95% 68.2–77.8% | 0.0 pp; could be luck
10 | proposed | punisher/masher-all | 55.6% (200/360); 95% 50.0–61.1% | 0.0 pp; could be luck
10 | proposed | spacer/masher | 7.2% (26/360); 95% 4.4–10.4% | 0.0 pp; could be luck
10 | proposed | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1% | 0.0 pp; could be luck
10 | slow | skilled/masher | 49.1% (530/1080); 95% 46.0–52.1% | -0.2 pp; could be luck
10 | slow | skilled/masher-all | 36.9% (399/1080); 95% 34.1–39.9% | 5.4 pp; could be luck
10 | slow | punisher/masher | 72.2% (260/360); 95% 67.4–76.9% | -0.8 pp; could be luck
10 | slow | punisher/masher-all | 63.1% (227/360); 95% 57.8–68.1% | 7.5 pp; could be luck
10 | slow | spacer/masher | 8.9% (32/360); 95% 6.1–12.3% | 1.7 pp; could be luck
10 | slow | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1% | 0.0 pp; could be luck
10 | tell | skilled/masher | 49.3% (532/1080); 95% 46.1–52.6% | 0.0 pp; could be luck
10 | tell | skilled/masher-all | 31.6% (341/1080); 95% 28.7–34.5% | 0.0 pp; could be luck
10 | tell | punisher/masher | 73.1% (263/360); 95% 68.2–77.8% | 0.0 pp; could be luck
10 | tell | punisher/masher-all | 55.6% (200/360); 95% 50.0–61.1% | 0.0 pp; could be luck
10 | tell | spacer/masher | 7.2% (26/360); 95% 4.4–10.4% | 0.0 pp; could be luck
10 | tell | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1% | 0.0 pp; could be luck
10 | deliberate | skilled/masher | 68.0% (734/1080); 95% 65.1–70.7% | 18.7 pp; ranges do not overlap
10 | deliberate | skilled/masher-all | 42.1% (455/1080); 95% 39.2–45.1% | 10.6 pp; ranges do not overlap
10 | deliberate | punisher/masher | 87.2% (314/360); 95% 83.4–90.8% | 14.2 pp; ranges do not overlap
10 | deliberate | punisher/masher-all | 72.5% (261/360); 95% 67.7–76.9% | 16.9 pp; ranges do not overlap
10 | deliberate | spacer/masher | 26.4% (95/360); 95% 20.8–31.9% | 19.2 pp; ranges do not overlap
10 | deliberate | spacer/masher-all | 0.3% (1/360); 95% 0.0–1.6% | 0.3 pp; could be luck
10 | fresh | skilled/masher | 54.2% (585/1080); 95% 51.1–57.3% | 4.9 pp; could be luck
10 | fresh | skilled/masher-all | 35.3% (381/1080); 95% 32.3–38.3% | 3.7 pp; could be luck
10 | fresh | punisher/masher | 77.8% (280/360); 95% 73.2–81.9% | 4.7 pp; could be luck
10 | fresh | punisher/masher-all | 60.8% (219/360); 95% 55.6–66.1% | 5.3 pp; could be luck
10 | fresh | spacer/masher | 15.0% (54/360); 95% 11.1–19.2% | 7.8 pp; ranges do not overlap
10 | fresh | spacer/masher-all | 1.9% (7/360); 95% 0.6–4.0% | 1.9 pp; could be luck
10 | deliberate,slow | skilled/masher | 68.0% (734/1080); 95% 65.1–70.7% | 18.7 pp; ranges do not overlap
10 | deliberate,slow | skilled/masher-all | 44.9% (485/1080); 95% 42.0–47.9% | 13.3 pp; ranges do not overlap
10 | deliberate,slow | punisher/masher | 87.2% (314/360); 95% 83.4–90.8% | 14.2 pp; ranges do not overlap
10 | deliberate,slow | punisher/masher-all | 75.8% (273/360); 95% 71.1–80.6% | 20.3 pp; ranges do not overlap
10 | deliberate,slow | spacer/masher | 26.4% (95/360); 95% 20.8–31.9% | 19.2 pp; ranges do not overlap
10 | deliberate,slow | spacer/masher-all | 1.1% (4/360); 95% 0.3–2.8% | 1.1 pp; could be luck
15 | default | skilled/masher | 25.3% (273/1080); 95% 22.2–28.3% | 1.9 pp; could be luck
15 | default | skilled/masher-all | 22.9% (247/1080); 95% 20.0–25.9% | 3.5 pp; could be luck
15 | default | punisher/masher | 46.7% (168/360); 95% 41.4–51.9% | 5.0 pp; could be luck
15 | default | punisher/masher-all | 41.4% (149/360); 95% 36.4–46.9% | 7.8 pp; could be luck
15 | default | spacer/masher | 4.4% (16/360); 95% 2.5–7.1% | 0.8 pp; could be luck
15 | default | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1% | 0.0 pp; could be luck
15 | proposed | skilled/masher | 23.3% (252/1080); 95% 20.3–26.4% | 0.0 pp; could be luck
15 | proposed | skilled/masher-all | 19.4% (209/1080); 95% 16.6–22.2% | 0.0 pp; could be luck
15 | proposed | punisher/masher | 41.7% (150/360); 95% 36.4–47.2% | 0.0 pp; could be luck
15 | proposed | punisher/masher-all | 33.6% (121/360); 95% 28.3–38.9% | 0.0 pp; could be luck
15 | proposed | spacer/masher | 3.6% (13/360); 95% 1.9–6.1% | 0.0 pp; could be luck
15 | proposed | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1% | 0.0 pp; could be luck
15 | slow | skilled/masher | 22.0% (238/1080); 95% 19.2–25.1% | -1.3 pp; could be luck
15 | slow | skilled/masher-all | 27.6% (298/1080); 95% 24.4–30.7% | 8.2 pp; ranges do not overlap
15 | slow | punisher/masher | 41.7% (150/360); 95% 36.4–46.9% | 0.0 pp; could be luck
15 | slow | punisher/masher-all | 46.9% (169/360); 95% 41.4–53.1% | 13.3 pp; ranges do not overlap
15 | slow | spacer/masher | 2.5% (9/360); 95% 0.8–4.7% | -1.1 pp; could be luck
15 | slow | spacer/masher-all | 0.3% (1/360); 95% 0.0–1.6% | 0.3 pp; could be luck
15 | tell | skilled/masher | 23.3% (252/1080); 95% 20.3–26.4% | 0.0 pp; could be luck
15 | tell | skilled/masher-all | 19.4% (209/1080); 95% 16.6–22.2% | 0.0 pp; could be luck
15 | tell | punisher/masher | 41.7% (150/360); 95% 36.4–47.2% | 0.0 pp; could be luck
15 | tell | punisher/masher-all | 33.6% (121/360); 95% 28.3–38.9% | 0.0 pp; could be luck
15 | tell | spacer/masher | 3.6% (13/360); 95% 1.9–6.1% | 0.0 pp; could be luck
15 | tell | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1% | 0.0 pp; could be luck
15 | deliberate | skilled/masher | 33.4% (361/1080); 95% 29.4–37.4% | 10.1 pp; ranges do not overlap
15 | deliberate | skilled/masher-all | 28.3% (306/1080); 95% 25.6–31.1% | 9.0 pp; ranges do not overlap
15 | deliberate | punisher/masher | 50.3% (181/360); 95% 44.7–55.6% | 8.6 pp; could be luck
15 | deliberate | punisher/masher-all | 46.1% (166/360); 95% 40.8–51.4% | 12.5 pp; ranges do not overlap
15 | deliberate | spacer/masher | 22.5% (81/360); 95% 17.8–27.5% | 18.9 pp; ranges do not overlap
15 | deliberate | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1% | 0.0 pp; could be luck
15 | fresh | skilled/masher | 24.3% (262/1080); 95% 21.2–27.2% | 0.9 pp; could be luck
15 | fresh | skilled/masher-all | 20.4% (220/1080); 95% 17.7–23.2% | 1.0 pp; could be luck
15 | fresh | punisher/masher | 44.4% (160/360); 95% 39.2–49.6% | 2.8 pp; could be luck
15 | fresh | punisher/masher-all | 35.8% (129/360); 95% 30.8–41.1% | 2.2 pp; could be luck
15 | fresh | spacer/masher | 4.7% (17/360); 95% 2.8–7.4% | 1.1 pp; could be luck
15 | fresh | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1% | 0.0 pp; could be luck
15 | deliberate,slow | skilled/masher | 33.4% (361/1080); 95% 29.4–37.4% | 10.1 pp; ranges do not overlap
15 | deliberate,slow | skilled/masher-all | 33.0% (356/1080); 95% 30.0–35.9% | 13.6 pp; ranges do not overlap
15 | deliberate,slow | punisher/masher | 50.3% (181/360); 95% 44.7–55.6% | 8.6 pp; could be luck
15 | deliberate,slow | punisher/masher-all | 51.1% (184/360); 95% 45.8–56.7% | 17.5 pp; ranges do not overlap
15 | deliberate,slow | spacer/masher | 22.5% (81/360); 95% 17.8–27.5% | 18.9 pp; ranges do not overlap
15 | deliberate,slow | spacer/masher-all | 0.0% (0/360); 95% 0.0–1.1% | 0.0 pp; could be luck

## Capture damage and breaks

Delay | Mode | Masher | Capture HP / total HP | Share | Opponent breaks / masher breaks
--- | --- | --- | --- | --- | ---
10 | default | masher | 27130.8 / 94034.2 | 28.9% | 1434 / 0
10 | default | masher-all | 54014.6 / 119809.9 | 45.1% | 667 / 0
10 | proposed | masher | 42522.9 / 101919.6 | 41.7% | 0 / 0
10 | proposed | masher-all | 60939.0 / 123247.4 | 49.4% | 9 / 4
10 | slow | masher | 42129.7 / 102860.0 | 41.0% | 0 / 0
10 | slow | masher-all | 59326.3 / 117991.9 | 50.3% | 6 / 0
10 | tell | masher | 42522.9 / 101919.6 | 41.7% | 0 / 0
10 | tell | masher-all | 60939.0 / 123247.4 | 49.4% | 9 / 4
10 | deliberate | masher | 0.0 / 80853.3 | 0.0% | 0 / 0
10 | deliberate | masher-all | 44589.5 / 114205.7 | 39.0% | 11 / 5
10 | fresh | masher | 27697.9 / 96328.7 | 28.8% | 1400 / 0
10 | fresh | masher-all | 54326.1 / 121605.4 | 44.7% | 634 / 0
10 | deliberate,slow | masher | 0.0 / 80853.3 | 0.0% | 0 / 0
10 | deliberate,slow | masher-all | 43738.3 / 111922.1 | 39.1% | 4 / 1
15 | default | masher | 32734.9 / 126812.2 | 25.8% | 513 / 0
15 | default | masher-all | 59621.4 / 129636.1 | 46.0% | 374 / 2
15 | proposed | masher | 38403.5 / 129056.4 | 29.8% | 0 / 0
15 | proposed | masher-all | 64495.7 / 131952.2 | 48.9% | 5 / 8
15 | slow | masher | 38915.4 / 129133.6 | 30.1% | 0 / 0
15 | slow | masher-all | 61220.4 / 126414.7 | 48.4% | 7 / 0
15 | tell | masher | 38403.5 / 129056.4 | 29.8% | 0 / 0
15 | tell | masher-all | 64495.7 / 131952.2 | 48.9% | 5 / 8
15 | deliberate | masher | 0.0 / 120456.2 | 0.0% | 0 / 0
15 | deliberate | masher-all | 46675.2 / 126717.5 | 36.8% | 5 / 1
15 | fresh | masher | 32122.9 / 127869.7 | 25.1% | 536 / 0
15 | fresh | masher-all | 60336.8 / 131560.9 | 45.9% | 377 / 2
15 | deliberate,slow | masher | 0.0 / 120456.2 | 0.0% | 0 / 0
15 | deliberate,slow | masher-all | 44229.6 / 123825.9 | 35.7% | 5 / 0

## Sanity against random

Delay | Mode | Bot | Wins; 95% range | Screen
--- | --- | --- | --- | ---
10 | default | spacer | 4.7% (17/360); 95% 2.5–7.4% | UNTRUSTED
10 | default | timer | 85.0% (306/360); 95% 80.9–88.3% | passes
10 | default | reader | 89.2% (321/360); 95% 85.5–92.2% | passes
10 | default | punisher | 87.2% (314/360); 95% 83.4–90.3% | passes
10 | default | masher | 85.6% (308/360); 95% 81.5–88.9% | passes
10 | default | masher-all | 89.2% (321/360); 95% 85.5–92.2% | passes
10 | proposed | spacer | 1.1% (4/360); 95% 0.3–2.8% | UNTRUSTED
10 | proposed | timer | 85.3% (307/360); 95% 81.2–88.6% | passes
10 | proposed | reader | 88.3% (318/360); 95% 84.6–91.7% | passes
10 | proposed | punisher | 86.9% (313/360); 95% 83.1–90.0% | passes
10 | proposed | masher | 85.6% (308/360); 95% 81.5–88.9% | passes
10 | proposed | masher-all | 92.2% (332/360); 95% 89.0–94.7% | passes
10 | slow | spacer | 1.9% (7/360); 95% 0.8–4.0% | UNTRUSTED
10 | slow | timer | 85.3% (307/360); 95% 81.2–88.6% | passes
10 | slow | reader | 88.9% (320/360); 95% 85.2–92.2% | passes
10 | slow | punisher | 90.0% (324/360); 95% 86.5–93.1% | passes
10 | slow | masher | 87.8% (316/360); 95% 84.0–91.1% | passes
10 | slow | masher-all | 86.7% (312/360); 95% 82.8–90.0% | passes
10 | tell | spacer | 1.1% (4/360); 95% 0.3–2.8% | UNTRUSTED
10 | tell | timer | 85.3% (307/360); 95% 81.2–88.6% | passes
10 | tell | reader | 88.3% (318/360); 95% 84.6–91.7% | passes
10 | tell | punisher | 86.9% (313/360); 95% 83.1–90.0% | passes
10 | tell | masher | 85.6% (308/360); 95% 81.5–88.9% | passes
10 | tell | masher-all | 92.2% (332/360); 95% 89.0–94.7% | passes
10 | deliberate | spacer | 1.9% (7/360); 95% 0.6–4.0% | UNTRUSTED
10 | deliberate | timer | 91.1% (328/360); 95% 87.7–93.9% | passes
10 | deliberate | reader | 94.2% (339/360); 95% 91.2–96.4% | passes
10 | deliberate | punisher | 93.3% (336/360); 95% 90.3–95.8% | passes
10 | deliberate | masher | 88.6% (319/360); 95% 84.9–91.7% | passes
10 | deliberate | masher-all | 88.6% (319/360); 95% 84.9–91.7% | passes
10 | fresh | spacer | 4.4% (16/360); 95% 2.5–7.1% | UNTRUSTED
10 | fresh | timer | 86.1% (310/360); 95% 82.2–89.3% | passes
10 | fresh | reader | 88.9% (320/360); 95% 85.2–92.2% | passes
10 | fresh | punisher | 87.5% (315/360); 95% 83.7–90.6% | passes
10 | fresh | masher | 86.9% (313/360); 95% 83.1–90.0% | passes
10 | fresh | masher-all | 91.1% (328/360); 95% 87.7–93.9% | passes
10 | deliberate,slow | spacer | 2.2% (8/360); 95% 0.8–4.3% | UNTRUSTED
10 | deliberate,slow | timer | 87.5% (315/360); 95% 83.7–90.8% | passes
10 | deliberate,slow | reader | 90.8% (327/360); 95% 87.4–93.9% | passes
10 | deliberate,slow | punisher | 92.2% (332/360); 95% 89.0–94.7% | passes
10 | deliberate,slow | masher | 91.7% (330/360); 95% 88.4–94.4% | passes
10 | deliberate,slow | masher-all | 82.2% (296/360); 95% 77.9–86.1% | passes
15 | default | spacer | 0.8% (3/360); 95% 0.0–2.4% | UNTRUSTED
15 | default | timer | 85.6% (308/360); 95% 81.5–88.9% | passes
15 | default | reader | 85.8% (309/360); 95% 81.9–89.1% | passes
15 | default | punisher | 86.7% (312/360); 95% 82.8–89.8% | passes
15 | default | masher | 83.3% (300/360); 95% 79.1–87.2% | passes
15 | default | masher-all | 90.8% (327/360); 95% 87.4–93.9% | passes
15 | proposed | spacer | 0.3% (1/360); 95% 0.0–1.6% | UNTRUSTED
15 | proposed | timer | 82.2% (296/360); 95% 77.9–85.8% | passes
15 | proposed | reader | 82.8% (298/360); 95% 78.5–86.4% | passes
15 | proposed | punisher | 82.8% (298/360); 95% 78.5–86.3% | passes
15 | proposed | masher | 83.3% (300/360); 95% 79.1–87.2% | passes
15 | proposed | masher-all | 90.6% (326/360); 95% 87.1–93.3% | passes
15 | slow | spacer | 0.6% (2/360); 95% 0.0–2.0% | UNTRUSTED
15 | slow | timer | 81.4% (293/360); 95% 77.0–85.1% | passes
15 | slow | reader | 83.9% (302/360); 95% 79.7–87.5% | passes
15 | slow | punisher | 84.7% (305/360); 95% 80.6–88.3% | passes
15 | slow | masher | 86.7% (312/360); 95% 82.8–90.0% | passes
15 | slow | masher-all | 88.1% (317/360); 95% 84.3–91.1% | passes
15 | tell | spacer | 0.3% (1/360); 95% 0.0–1.6% | UNTRUSTED
15 | tell | timer | 82.2% (296/360); 95% 77.9–85.8% | passes
15 | tell | reader | 82.8% (298/360); 95% 78.5–86.4% | passes
15 | tell | punisher | 82.8% (298/360); 95% 78.5–86.3% | passes
15 | tell | masher | 83.3% (300/360); 95% 79.1–87.2% | passes
15 | tell | masher-all | 90.6% (326/360); 95% 87.1–93.3% | passes
15 | deliberate | spacer | 0.3% (1/360); 95% 0.0–1.6% | UNTRUSTED
15 | deliberate | timer | 85.0% (306/360); 95% 80.9–88.3% | passes
15 | deliberate | reader | 85.6% (308/360); 95% 81.5–88.9% | passes
15 | deliberate | punisher | 86.7% (312/360); 95% 82.8–90.0% | passes
15 | deliberate | masher | 86.1% (310/360); 95% 82.2–89.7% | passes
15 | deliberate | masher-all | 86.4% (311/360); 95% 82.5–90.0% | passes
15 | fresh | spacer | 0.6% (2/360); 95% 0.0–2.0% | UNTRUSTED
15 | fresh | timer | 84.2% (303/360); 95% 80.0–87.6% | passes
15 | fresh | reader | 84.4% (304/360); 95% 80.3–87.8% | passes
15 | fresh | punisher | 85.3% (307/360); 95% 81.2–88.6% | passes
15 | fresh | masher | 83.9% (302/360); 95% 79.7–87.8% | passes
15 | fresh | masher-all | 90.8% (327/360); 95% 87.4–93.9% | passes
15 | deliberate,slow | spacer | 0.8% (3/360); 95% 0.0–2.4% | UNTRUSTED
15 | deliberate,slow | timer | 85.6% (308/360); 95% 81.5–88.9% | passes
15 | deliberate,slow | reader | 87.2% (314/360); 95% 83.4–90.3% | passes
15 | deliberate,slow | punisher | 88.6% (319/360); 95% 84.9–91.7% | passes
15 | deliberate,slow | masher | 88.1% (317/360); 95% 84.3–91.0% | passes
15 | deliberate,slow | masher-all | 83.3% (300/360); 95% 79.1–86.8% | passes

## Every option compared

Overlapping ranges implement the requested conservative screen; this is not proof of equivalence.

Delay | Group / opponent | Mode A | Mode B | A minus B | Interpretation
--- | --- | --- | --- | --- | ---
10 | skilled/masher | default | proposed | 5.9 pp | could be luck
10 | skilled/masher-all | default | proposed | 6.1 pp | ranges do not overlap
10 | punisher/masher | default | proposed | 5.0 pp | could be luck
10 | punisher/masher-all | default | proposed | 6.4 pp | could be luck
10 | spacer/masher | default | proposed | 5.8 pp | could be luck
10 | spacer/masher-all | default | proposed | 1.4 pp | could be luck
10 | skilled/masher | default | slow | 6.1 pp | ranges do not overlap
10 | skilled/masher-all | default | slow | 0.7 pp | could be luck
10 | punisher/masher | default | slow | 5.8 pp | could be luck
10 | punisher/masher-all | default | slow | -1.1 pp | could be luck
10 | spacer/masher | default | slow | 4.2 pp | could be luck
10 | spacer/masher-all | default | slow | 1.4 pp | could be luck
10 | skilled/masher | default | tell | 5.9 pp | could be luck
10 | skilled/masher-all | default | tell | 6.1 pp | ranges do not overlap
10 | punisher/masher | default | tell | 5.0 pp | could be luck
10 | punisher/masher-all | default | tell | 6.4 pp | could be luck
10 | spacer/masher | default | tell | 5.8 pp | could be luck
10 | spacer/masher-all | default | tell | 1.4 pp | could be luck
10 | skilled/masher | default | deliberate | -12.8 pp | ranges do not overlap
10 | skilled/masher-all | default | deliberate | -4.4 pp | could be luck
10 | punisher/masher | default | deliberate | -9.2 pp | ranges do not overlap
10 | punisher/masher-all | default | deliberate | -10.6 pp | could be luck
10 | spacer/masher | default | deliberate | -13.3 pp | ranges do not overlap
10 | spacer/masher-all | default | deliberate | 1.1 pp | could be luck
10 | skilled/masher | default | fresh | 1.0 pp | could be luck
10 | skilled/masher-all | default | fresh | 2.4 pp | could be luck
10 | punisher/masher | default | fresh | 0.3 pp | could be luck
10 | punisher/masher-all | default | fresh | 1.1 pp | could be luck
10 | spacer/masher | default | fresh | -1.9 pp | could be luck
10 | spacer/masher-all | default | fresh | -0.6 pp | could be luck
10 | skilled/masher | default | deliberate,slow | -12.8 pp | ranges do not overlap
10 | skilled/masher-all | default | deliberate,slow | -7.2 pp | ranges do not overlap
10 | punisher/masher | default | deliberate,slow | -9.2 pp | ranges do not overlap
10 | punisher/masher-all | default | deliberate,slow | -13.9 pp | ranges do not overlap
10 | spacer/masher | default | deliberate,slow | -13.3 pp | ranges do not overlap
10 | spacer/masher-all | default | deliberate,slow | 0.3 pp | could be luck
10 | skilled/masher | proposed | slow | 0.2 pp | could be luck
10 | skilled/masher-all | proposed | slow | -5.4 pp | could be luck
10 | punisher/masher | proposed | slow | 0.8 pp | could be luck
10 | punisher/masher-all | proposed | slow | -7.5 pp | could be luck
10 | spacer/masher | proposed | slow | -1.7 pp | could be luck
10 | spacer/masher-all | proposed | slow | 0.0 pp | could be luck
10 | skilled/masher | proposed | tell | 0.0 pp | could be luck
10 | skilled/masher-all | proposed | tell | 0.0 pp | could be luck
10 | punisher/masher | proposed | tell | 0.0 pp | could be luck
10 | punisher/masher-all | proposed | tell | 0.0 pp | could be luck
10 | spacer/masher | proposed | tell | 0.0 pp | could be luck
10 | spacer/masher-all | proposed | tell | 0.0 pp | could be luck
10 | skilled/masher | proposed | deliberate | -18.7 pp | ranges do not overlap
10 | skilled/masher-all | proposed | deliberate | -10.6 pp | ranges do not overlap
10 | punisher/masher | proposed | deliberate | -14.2 pp | ranges do not overlap
10 | punisher/masher-all | proposed | deliberate | -16.9 pp | ranges do not overlap
10 | spacer/masher | proposed | deliberate | -19.2 pp | ranges do not overlap
10 | spacer/masher-all | proposed | deliberate | -0.3 pp | could be luck
10 | skilled/masher | proposed | fresh | -4.9 pp | could be luck
10 | skilled/masher-all | proposed | fresh | -3.7 pp | could be luck
10 | punisher/masher | proposed | fresh | -4.7 pp | could be luck
10 | punisher/masher-all | proposed | fresh | -5.3 pp | could be luck
10 | spacer/masher | proposed | fresh | -7.8 pp | ranges do not overlap
10 | spacer/masher-all | proposed | fresh | -1.9 pp | could be luck
10 | skilled/masher | proposed | deliberate,slow | -18.7 pp | ranges do not overlap
10 | skilled/masher-all | proposed | deliberate,slow | -13.3 pp | ranges do not overlap
10 | punisher/masher | proposed | deliberate,slow | -14.2 pp | ranges do not overlap
10 | punisher/masher-all | proposed | deliberate,slow | -20.3 pp | ranges do not overlap
10 | spacer/masher | proposed | deliberate,slow | -19.2 pp | ranges do not overlap
10 | spacer/masher-all | proposed | deliberate,slow | -1.1 pp | could be luck
10 | skilled/masher | slow | tell | -0.2 pp | could be luck
10 | skilled/masher-all | slow | tell | 5.4 pp | could be luck
10 | punisher/masher | slow | tell | -0.8 pp | could be luck
10 | punisher/masher-all | slow | tell | 7.5 pp | could be luck
10 | spacer/masher | slow | tell | 1.7 pp | could be luck
10 | spacer/masher-all | slow | tell | 0.0 pp | could be luck
10 | skilled/masher | slow | deliberate | -18.9 pp | ranges do not overlap
10 | skilled/masher-all | slow | deliberate | -5.2 pp | could be luck
10 | punisher/masher | slow | deliberate | -15.0 pp | ranges do not overlap
10 | punisher/masher-all | slow | deliberate | -9.4 pp | could be luck
10 | spacer/masher | slow | deliberate | -17.5 pp | ranges do not overlap
10 | spacer/masher-all | slow | deliberate | -0.3 pp | could be luck
10 | skilled/masher | slow | fresh | -5.1 pp | could be luck
10 | skilled/masher-all | slow | fresh | 1.7 pp | could be luck
10 | punisher/masher | slow | fresh | -5.6 pp | could be luck
10 | punisher/masher-all | slow | fresh | 2.2 pp | could be luck
10 | spacer/masher | slow | fresh | -6.1 pp | could be luck
10 | spacer/masher-all | slow | fresh | -1.9 pp | could be luck
10 | skilled/masher | slow | deliberate,slow | -18.9 pp | ranges do not overlap
10 | skilled/masher-all | slow | deliberate,slow | -8.0 pp | ranges do not overlap
10 | punisher/masher | slow | deliberate,slow | -15.0 pp | ranges do not overlap
10 | punisher/masher-all | slow | deliberate,slow | -12.8 pp | ranges do not overlap
10 | spacer/masher | slow | deliberate,slow | -17.5 pp | ranges do not overlap
10 | spacer/masher-all | slow | deliberate,slow | -1.1 pp | could be luck
10 | skilled/masher | tell | deliberate | -18.7 pp | ranges do not overlap
10 | skilled/masher-all | tell | deliberate | -10.6 pp | ranges do not overlap
10 | punisher/masher | tell | deliberate | -14.2 pp | ranges do not overlap
10 | punisher/masher-all | tell | deliberate | -16.9 pp | ranges do not overlap
10 | spacer/masher | tell | deliberate | -19.2 pp | ranges do not overlap
10 | spacer/masher-all | tell | deliberate | -0.3 pp | could be luck
10 | skilled/masher | tell | fresh | -4.9 pp | could be luck
10 | skilled/masher-all | tell | fresh | -3.7 pp | could be luck
10 | punisher/masher | tell | fresh | -4.7 pp | could be luck
10 | punisher/masher-all | tell | fresh | -5.3 pp | could be luck
10 | spacer/masher | tell | fresh | -7.8 pp | ranges do not overlap
10 | spacer/masher-all | tell | fresh | -1.9 pp | could be luck
10 | skilled/masher | tell | deliberate,slow | -18.7 pp | ranges do not overlap
10 | skilled/masher-all | tell | deliberate,slow | -13.3 pp | ranges do not overlap
10 | punisher/masher | tell | deliberate,slow | -14.2 pp | ranges do not overlap
10 | punisher/masher-all | tell | deliberate,slow | -20.3 pp | ranges do not overlap
10 | spacer/masher | tell | deliberate,slow | -19.2 pp | ranges do not overlap
10 | spacer/masher-all | tell | deliberate,slow | -1.1 pp | could be luck
10 | skilled/masher | deliberate | fresh | 13.8 pp | ranges do not overlap
10 | skilled/masher-all | deliberate | fresh | 6.9 pp | ranges do not overlap
10 | punisher/masher | deliberate | fresh | 9.4 pp | ranges do not overlap
10 | punisher/masher-all | deliberate | fresh | 11.7 pp | ranges do not overlap
10 | spacer/masher | deliberate | fresh | 11.4 pp | ranges do not overlap
10 | spacer/masher-all | deliberate | fresh | -1.7 pp | could be luck
10 | skilled/masher | deliberate | deliberate,slow | 0.0 pp | could be luck
10 | skilled/masher-all | deliberate | deliberate,slow | -2.8 pp | could be luck
10 | punisher/masher | deliberate | deliberate,slow | 0.0 pp | could be luck
10 | punisher/masher-all | deliberate | deliberate,slow | -3.3 pp | could be luck
10 | spacer/masher | deliberate | deliberate,slow | 0.0 pp | could be luck
10 | spacer/masher-all | deliberate | deliberate,slow | -0.8 pp | could be luck
10 | skilled/masher | fresh | deliberate,slow | -13.8 pp | ranges do not overlap
10 | skilled/masher-all | fresh | deliberate,slow | -9.6 pp | ranges do not overlap
10 | punisher/masher | fresh | deliberate,slow | -9.4 pp | ranges do not overlap
10 | punisher/masher-all | fresh | deliberate,slow | -15.0 pp | ranges do not overlap
10 | spacer/masher | fresh | deliberate,slow | -11.4 pp | ranges do not overlap
10 | spacer/masher-all | fresh | deliberate,slow | 0.8 pp | could be luck
15 | skilled/masher | default | proposed | 1.9 pp | could be luck
15 | skilled/masher-all | default | proposed | 3.5 pp | could be luck
15 | punisher/masher | default | proposed | 5.0 pp | could be luck
15 | punisher/masher-all | default | proposed | 7.8 pp | could be luck
15 | spacer/masher | default | proposed | 0.8 pp | could be luck
15 | spacer/masher-all | default | proposed | 0.0 pp | could be luck
15 | skilled/masher | default | slow | 3.2 pp | could be luck
15 | skilled/masher-all | default | slow | -4.7 pp | could be luck
15 | punisher/masher | default | slow | 5.0 pp | could be luck
15 | punisher/masher-all | default | slow | -5.6 pp | could be luck
15 | spacer/masher | default | slow | 1.9 pp | could be luck
15 | spacer/masher-all | default | slow | -0.3 pp | could be luck
15 | skilled/masher | default | tell | 1.9 pp | could be luck
15 | skilled/masher-all | default | tell | 3.5 pp | could be luck
15 | punisher/masher | default | tell | 5.0 pp | could be luck
15 | punisher/masher-all | default | tell | 7.8 pp | could be luck
15 | spacer/masher | default | tell | 0.8 pp | could be luck
15 | spacer/masher-all | default | tell | 0.0 pp | could be luck
15 | skilled/masher | default | deliberate | -8.1 pp | ranges do not overlap
15 | skilled/masher-all | default | deliberate | -5.5 pp | could be luck
15 | punisher/masher | default | deliberate | -3.6 pp | could be luck
15 | punisher/masher-all | default | deliberate | -4.7 pp | could be luck
15 | spacer/masher | default | deliberate | -18.1 pp | ranges do not overlap
15 | spacer/masher-all | default | deliberate | 0.0 pp | could be luck
15 | skilled/masher | default | fresh | 1.0 pp | could be luck
15 | skilled/masher-all | default | fresh | 2.5 pp | could be luck
15 | punisher/masher | default | fresh | 2.2 pp | could be luck
15 | punisher/masher-all | default | fresh | 5.6 pp | could be luck
15 | spacer/masher | default | fresh | -0.3 pp | could be luck
15 | spacer/masher-all | default | fresh | 0.0 pp | could be luck
15 | skilled/masher | default | deliberate,slow | -8.1 pp | ranges do not overlap
15 | skilled/masher-all | default | deliberate,slow | -10.1 pp | ranges do not overlap
15 | punisher/masher | default | deliberate,slow | -3.6 pp | could be luck
15 | punisher/masher-all | default | deliberate,slow | -9.7 pp | could be luck
15 | spacer/masher | default | deliberate,slow | -18.1 pp | ranges do not overlap
15 | spacer/masher-all | default | deliberate,slow | 0.0 pp | could be luck
15 | skilled/masher | proposed | slow | 1.3 pp | could be luck
15 | skilled/masher-all | proposed | slow | -8.2 pp | ranges do not overlap
15 | punisher/masher | proposed | slow | 0.0 pp | could be luck
15 | punisher/masher-all | proposed | slow | -13.3 pp | ranges do not overlap
15 | spacer/masher | proposed | slow | 1.1 pp | could be luck
15 | spacer/masher-all | proposed | slow | -0.3 pp | could be luck
15 | skilled/masher | proposed | tell | 0.0 pp | could be luck
15 | skilled/masher-all | proposed | tell | 0.0 pp | could be luck
15 | punisher/masher | proposed | tell | 0.0 pp | could be luck
15 | punisher/masher-all | proposed | tell | 0.0 pp | could be luck
15 | spacer/masher | proposed | tell | 0.0 pp | could be luck
15 | spacer/masher-all | proposed | tell | 0.0 pp | could be luck
15 | skilled/masher | proposed | deliberate | -10.1 pp | ranges do not overlap
15 | skilled/masher-all | proposed | deliberate | -9.0 pp | ranges do not overlap
15 | punisher/masher | proposed | deliberate | -8.6 pp | could be luck
15 | punisher/masher-all | proposed | deliberate | -12.5 pp | ranges do not overlap
15 | spacer/masher | proposed | deliberate | -18.9 pp | ranges do not overlap
15 | spacer/masher-all | proposed | deliberate | 0.0 pp | could be luck
15 | skilled/masher | proposed | fresh | -0.9 pp | could be luck
15 | skilled/masher-all | proposed | fresh | -1.0 pp | could be luck
15 | punisher/masher | proposed | fresh | -2.8 pp | could be luck
15 | punisher/masher-all | proposed | fresh | -2.2 pp | could be luck
15 | spacer/masher | proposed | fresh | -1.1 pp | could be luck
15 | spacer/masher-all | proposed | fresh | 0.0 pp | could be luck
15 | skilled/masher | proposed | deliberate,slow | -10.1 pp | ranges do not overlap
15 | skilled/masher-all | proposed | deliberate,slow | -13.6 pp | ranges do not overlap
15 | punisher/masher | proposed | deliberate,slow | -8.6 pp | could be luck
15 | punisher/masher-all | proposed | deliberate,slow | -17.5 pp | ranges do not overlap
15 | spacer/masher | proposed | deliberate,slow | -18.9 pp | ranges do not overlap
15 | spacer/masher-all | proposed | deliberate,slow | 0.0 pp | could be luck
15 | skilled/masher | slow | tell | -1.3 pp | could be luck
15 | skilled/masher-all | slow | tell | 8.2 pp | ranges do not overlap
15 | punisher/masher | slow | tell | 0.0 pp | could be luck
15 | punisher/masher-all | slow | tell | 13.3 pp | ranges do not overlap
15 | spacer/masher | slow | tell | -1.1 pp | could be luck
15 | spacer/masher-all | slow | tell | 0.3 pp | could be luck
15 | skilled/masher | slow | deliberate | -11.4 pp | ranges do not overlap
15 | skilled/masher-all | slow | deliberate | -0.7 pp | could be luck
15 | punisher/masher | slow | deliberate | -8.6 pp | could be luck
15 | punisher/masher-all | slow | deliberate | 0.8 pp | could be luck
15 | spacer/masher | slow | deliberate | -20.0 pp | ranges do not overlap
15 | spacer/masher-all | slow | deliberate | 0.3 pp | could be luck
15 | skilled/masher | slow | fresh | -2.2 pp | could be luck
15 | skilled/masher-all | slow | fresh | 7.2 pp | ranges do not overlap
15 | punisher/masher | slow | fresh | -2.8 pp | could be luck
15 | punisher/masher-all | slow | fresh | 11.1 pp | ranges do not overlap
15 | spacer/masher | slow | fresh | -2.2 pp | could be luck
15 | spacer/masher-all | slow | fresh | 0.3 pp | could be luck
15 | skilled/masher | slow | deliberate,slow | -11.4 pp | ranges do not overlap
15 | skilled/masher-all | slow | deliberate,slow | -5.4 pp | could be luck
15 | punisher/masher | slow | deliberate,slow | -8.6 pp | could be luck
15 | punisher/masher-all | slow | deliberate,slow | -4.2 pp | could be luck
15 | spacer/masher | slow | deliberate,slow | -20.0 pp | ranges do not overlap
15 | spacer/masher-all | slow | deliberate,slow | 0.3 pp | could be luck
15 | skilled/masher | tell | deliberate | -10.1 pp | ranges do not overlap
15 | skilled/masher-all | tell | deliberate | -9.0 pp | ranges do not overlap
15 | punisher/masher | tell | deliberate | -8.6 pp | could be luck
15 | punisher/masher-all | tell | deliberate | -12.5 pp | ranges do not overlap
15 | spacer/masher | tell | deliberate | -18.9 pp | ranges do not overlap
15 | spacer/masher-all | tell | deliberate | 0.0 pp | could be luck
15 | skilled/masher | tell | fresh | -0.9 pp | could be luck
15 | skilled/masher-all | tell | fresh | -1.0 pp | could be luck
15 | punisher/masher | tell | fresh | -2.8 pp | could be luck
15 | punisher/masher-all | tell | fresh | -2.2 pp | could be luck
15 | spacer/masher | tell | fresh | -1.1 pp | could be luck
15 | spacer/masher-all | tell | fresh | 0.0 pp | could be luck
15 | skilled/masher | tell | deliberate,slow | -10.1 pp | ranges do not overlap
15 | skilled/masher-all | tell | deliberate,slow | -13.6 pp | ranges do not overlap
15 | punisher/masher | tell | deliberate,slow | -8.6 pp | could be luck
15 | punisher/masher-all | tell | deliberate,slow | -17.5 pp | ranges do not overlap
15 | spacer/masher | tell | deliberate,slow | -18.9 pp | ranges do not overlap
15 | spacer/masher-all | tell | deliberate,slow | 0.0 pp | could be luck
15 | skilled/masher | deliberate | fresh | 9.2 pp | ranges do not overlap
15 | skilled/masher-all | deliberate | fresh | 8.0 pp | ranges do not overlap
15 | punisher/masher | deliberate | fresh | 5.8 pp | could be luck
15 | punisher/masher-all | deliberate | fresh | 10.3 pp | could be luck
15 | spacer/masher | deliberate | fresh | 17.8 pp | ranges do not overlap
15 | spacer/masher-all | deliberate | fresh | 0.0 pp | could be luck
15 | skilled/masher | deliberate | deliberate,slow | 0.0 pp | could be luck
15 | skilled/masher-all | deliberate | deliberate,slow | -4.6 pp | could be luck
15 | punisher/masher | deliberate | deliberate,slow | 0.0 pp | could be luck
15 | punisher/masher-all | deliberate | deliberate,slow | -5.0 pp | could be luck
15 | spacer/masher | deliberate | deliberate,slow | 0.0 pp | could be luck
15 | spacer/masher-all | deliberate | deliberate,slow | 0.0 pp | could be luck
15 | skilled/masher | fresh | deliberate,slow | -9.2 pp | ranges do not overlap
15 | skilled/masher-all | fresh | deliberate,slow | -12.6 pp | ranges do not overlap
15 | punisher/masher | fresh | deliberate,slow | -5.8 pp | could be luck
15 | punisher/masher-all | fresh | deliberate,slow | -15.3 pp | ranges do not overlap
15 | spacer/masher | fresh | deliberate,slow | -17.8 pp | ranges do not overlap
15 | spacer/masher-all | fresh | deliberate,slow | 0.0 pp | could be luck

## Implementation and reproducibility

- Preview URL flags are independent and combinable. `slow` overrides capture startup to 18f after any local balance override, preserving active/recovery/damage. `deliberate` removes only the single down+attack capture shortcut; double-down launcher and dedicated capture remain. `fresh` restores the existing timed-guard capture-break semantics without changing strike guard behavior. With no flags, default state and rules are unchanged.
- `tell` is held in match-associated preview configuration outside serializable simulation state. The renderer temporarily raises the grabbing arm and draws a three-dimensional ink-rimmed pale-gold hand cue from startup frame 0. Its one-time size pulse settles over 5 frames; reduced motion holds a stable size. The overlay restores the authored rotations before the next render. No character, rig, animation authoring, move data or hitbox files were edited.
- Spacer uses visible projectile position/velocity to estimate closest approach within 0.65s, hovers 0.3 units beyond rival reach, retreats on startup/active and taps neutral attacks every 2 frames during recovery. It remains untrusted; the failure is reported rather than tuned away after seeing outcomes.
- Original masher is unchanged. Masher-all samples all six combat buttons independently at 35% probability every 4 frames, with random x/z directions and 2-frame releases. Burst uses the game's `super` input. Guard may suppress simultaneous attacks, just as it does for real inputs; no priority exemption was added for this bot.
- Each delay uses 14 pairings: four policies versus both mashers, plus those six bots versus random. Each pairing has 36 fighter pairs × two seats × five seeds. **35,280 bouts per delay; 70,560 total; zero censored.** Results are gzip archives (roughly 14 MB combined), with a compact dashboard summary. Both earlier dated result folders remain byte-identical.
- [Successful cloud study](https://github.com/Tusingw29/rift-duel/actions/runs/40700840971) ran measured commit `f72f81693ea967694bb01f529cb82a64041faea9`. All 14 source-hash manifests still match the final simulation and bot code. Subsequent changes affect visual cue readability, reporting, intervals, captures and tests—not measured combat behavior.
- Reproduce with `node scripts/skill/grab-tournament.mjs --delay=10 --out=art/skill-lab/NEW-FOLDER` and repeat `--delay=15`. Existing archives are never overwritten. `node scripts/skill/grab-report.mjs` regenerates the report tables from this study's saved archives; this review also contains added interpretation and verification notes.

## Verification

- **676 tests passed, zero failures** with `PATH=/usr/local/bin:$PATH npm --script-shell=/bin/bash test` (51.5s). Includes independent and combined switches, default fingerprint, tick-by-tick observed/unobserved parity across all six fighters, tell/no-tell equality, manual text, projectile observation delay, every masher-all button, and confidence-range handling. No test forces a win rate.
- Default simulation fingerprint remains `c1fc5ebc1cb77d6845830c4c67fa56d416bf079f78d16c51fac4e1b8d049071a`, the main baseline.
- Game browser checks passed for default, proposed + deliberate/slow, and proposed + tell. Real main/input/combat code was checked with a renderer stub for deterministic manual/input stepping. A separate **real WebGL** fixture verified frame-zero tell visibility, expiration and reduced motion, using the game renderer and Tala model. The final cue was visually inspected from side and behind Player 1. This does not replace a human normal-speed playtest.
- Dashboard browser checks passed for seven modes at both delays, confidence/overlap labels, capture shares and break counts, sanity flags, pairwise comparison details, old report access and a 390px layout. No page errors. Desktop shows all seven columns together; phone tables scroll horizontally.
- Two issues caught during verification were corrected: the initial ink shell hid the bright cue, and the new summary generator had a syntax error. Final tests and captures are from the corrected versions.
- Physical controller hardware was not available. Dedicated keyboard U and the existing shared controller input mapping are retained; no new controller mapping was introduced.

## Playtest links

- [Dashboard](http://localhost:4203/dist/skill-lab.html?study=grab-options)
- [Proposed + deliberate + slow](http://localhost:4203/dist/index.html?balance=proposed&grab=deliberate,slow)
- [Proposed + tell](http://localhost:4203/dist/index.html?balance=proposed&grab=tell)
- [Proposed + deliberate alone](http://localhost:4203/dist/index.html?balance=proposed&grab=deliberate)

The server serves this worktree root on port 4203. Restart if needed with `python3 -m http.server 4203 --bind 127.0.0.1` from `~/rift-worktrees/skill-lab`. Status: **Review, awaiting Adam’s verdict**. Preview code stays on `codex/skill-lab`; no gameplay merge or public deployment.

## Captures inspected

File | Reading
--- | ---
[tell-side-on-1793196537578.jpg](tell-side-on-1793196537578.jpg) | Exact startup frame 0; compare cue on/off from the indicated camera.
[tell-side-off-1793196537578.jpg](tell-side-off-1793196537578.jpg) | Exact startup frame 0; compare cue on/off from the indicated camera.
[tell-lock-on-1793196537578.jpg](tell-lock-on-1793196537578.jpg) | Exact startup frame 0; compare cue on/off from the indicated camera.
[tell-lock-off-1793196537578.jpg](tell-lock-off-1793196537578.jpg) | Exact startup frame 0; compare cue on/off from the indicated camera.
[dashboard-summary-1793196300867.jpg](dashboard-summary-1793196300867.jpg) | Dashboard readability, all-mode comparison or phone layout.
[dashboard-15f-1793196300867.jpg](dashboard-15f-1793196300867.jpg) | Dashboard readability, all-mode comparison or phone layout.
[dashboard-phone-1793196300867.jpg](dashboard-phone-1793196300867.jpg) | Dashboard readability, all-mode comparison or phone layout.

Remaining visual limitation: the cue is legible in these held frames, but its 13-frame timing and contrast during moving combat still need Adam’s normal-speed verdict.
