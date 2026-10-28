# Skill lab

default: skilled-policy bots win 97.2% (105/108 completed bouts; 0 draws), 94.4 percentage points ahead of mashing. All three beat random with a 95% Wilson lower bound above 50%.

Autopilot candidates in default: none established by a 95% interval. These are bot results, not human verdicts.

proposed: skilled-policy bots win 84.3% (91/108 completed bouts; 0 draws), 68.5 percentage points ahead of mashing. Untrusted policies: spacer. This does not establish human skill balance.

Autopilot candidates in proposed: none established by a 95% interval. These are bot results, not human verdicts.

rules: skilled-policy bots win 88.0% (95/108 completed bouts; 0 draws), 75.9 percentage points ahead of mashing. Untrusted policies: spacer. This does not establish human skill balance.

Autopilot candidates in rules: none established by a 95% interval. These are bot results, not human verdicts.

Default → proposed changes skilled-policy win rate by -13.0 percentage points (n=108 default, n=108 proposed). Seeds and matchup schedule are paired; this is descriptive, not causal proof about human play.

Every unordered bot pair × every ordered fighter pair × three modes × 1 seed(s). Quick alternates seats across matchups; individual matchup seat bias is not controlled until --full.

Runtime 51.3 seconds; 3024 bouts; 0 censored (excluded from win rates).

Sanity uses strict wins (draws are not wins), 95% Wilson lower bound >50%. Shared opponents/seeds are correlated; intervals are screening heuristics.

Whiffs: completed active windows without contact for basic strike/launcher only; interrupted windups excluded. Whiff punish: damage during the missed move's remaining recovery. Projectile misses are not classified as melee whiffs.

Move damage attribution is best effort from passive diagnostic hooks and existing events; simultaneous or unidentifiable sources remain unknown. Option variety includes a visible unknown bucket. Capture-through-guard means guard active when the capture started, not an inferred input read.

Attack presses count rising attack edges; damage/press includes all actions (capture/super included), so it is not damage per attack move. Simulation is untouched.

## Bot sanity

Bot | Mode | Wins / bouts vs random | Draws | 95% win interval | Trusted
--- | --- | --- | --- | --- | ---
masher | default | 31/36 | 0 | 71.3%–93.9% | yes
punisher | default | 35/36 | 0 | 85.8%–99.5% | yes
reader | default | 36/36 | 0 | 90.4%–100.0% | yes
spacer | default | 31/36 | 0 | 71.3%–93.9% | yes
timer | default | 36/36 | 0 | 90.4%–100.0% | yes
turtle | default | 1/36 | 0 | 0.5%–14.2% | NO
zoner | default | 36/36 | 0 | 90.4%–100.0% | yes
masher | proposed | 29/36 | 0 | 65.0%–90.2% | yes
punisher | proposed | 36/36 | 0 | 90.4%–100.0% | yes
reader | proposed | 36/36 | 0 | 90.4%–100.0% | yes
spacer | proposed | 17/36 | 0 | 32.0%–63.0% | NO
timer | proposed | 36/36 | 0 | 90.4%–100.0% | yes
turtle | proposed | 0/36 | 0 | 0.0%–9.6% | NO
zoner | proposed | 34/36 | 0 | 81.9%–98.5% | yes
masher | rules | 31/36 | 0 | 71.3%–93.9% | yes
punisher | rules | 36/36 | 0 | 90.4%–100.0% | yes
reader | rules | 36/36 | 0 | 90.4%–100.0% | yes
spacer | rules | 22/36 | 0 | 44.9%–75.2% | NO
timer | rules | 36/36 | 0 | 90.4%–100.0% | yes
turtle | rules | 0/36 | 0 | 0.0%–9.6% | NO
zoner | rules | 34/36 | 0 | 81.9%–98.5% | yes

Open skill-lab.html with report.json for per-fighter and per-bout metrics. All input and distance frames use 60 Hz; input frames include hitstop, distance frames exclude frozen simulation ticks.

## Measured outcomes

Mode | Bot | n player-bouts | Damage / attack press | Attack presses | Whiffs / attempts | Punished / whiffs | Blocks / perfect guards | Capture breaks / captures through guard | Chip HP
---|---|---|---|---|---|---|---|---|---
default | masher | 252 | 0.085 | 176259 | 29/568 | 1/29 | 4/0 | 0/181 | 0.0
default | punisher | 252 | 0.429 | 48775 | 259/8620 | 7/259 | 573/874 | 17/0 | 507.0
default | random | 252 | 1.409 | 7825 | 613/1085 | 85/613 | 21/93 | 0/321 | 15.8
default | reader | 252 | 0.945 | 24214 | 180/7777 | 27/180 | 637/1016 | 3/1 | 545.5
default | spacer | 252 | 0.870 | 14192 | 104/2268 | 31/104 | 2023/7353 | 107/0 | 1781.3
default | timer | 252 | 1.040 | 19956 | 225/6408 | 21/225 | 589/952 | 17/0 | 535.0
default | turtle | 252 | 0.521 | 6830 | 1/1310 | 0/1 | 8665/2291 | 120/0 | 6406.4
default | zoner | 252 | 0.786 | 17409 | 0/45 | 0/0 | 795/800 | 7/0 | 589.8
proposed | masher | 252 | 0.095 | 177797 | 25/468 | 3/25 | 7/0 | 0/272 | 0.0
proposed | punisher | 252 | 0.390 | 48707 | 330/8185 | 113/330 | 619/934 | 0/0 | 556.9
proposed | random | 252 | 1.569 | 7933 | 609/1060 | 81/609 | 29/104 | 0/395 | 21.9
proposed | reader | 252 | 0.890 | 23706 | 164/6729 | 96/164 | 629/993 | 0/0 | 577.8
proposed | spacer | 252 | 0.881 | 15221 | 114/2289 | 49/114 | 1852/6799 | 0/0 | 1720.8
proposed | timer | 252 | 1.090 | 18934 | 239/6203 | 97/239 | 703/943 | 0/49 | 642.6
proposed | turtle | 252 | 0.809 | 9734 | 1/1367 | 1/1 | 9022/1245 | 0/0 | 6797.0
proposed | zoner | 252 | 0.789 | 18110 | 0/47 | 0/0 | 758/1182 | 0/0 | 584.7
rules | masher | 252 | 0.093 | 179609 | 21/480 | 2/21 | 6/0 | 0/274 | 0.0
rules | punisher | 252 | 0.377 | 49967 | 314/8380 | 119/314 | 636/925 | 0/0 | 570.3
rules | random | 252 | 1.580 | 7976 | 594/1060 | 79/594 | 26/100 | 1/381 | 19.5
rules | reader | 252 | 0.894 | 23568 | 164/6688 | 90/164 | 637/1000 | 0/0 | 584.7
rules | spacer | 252 | 0.897 | 15259 | 113/2343 | 55/113 | 2032/6877 | 0/0 | 1830.5
rules | timer | 252 | 1.090 | 18792 | 258/6119 | 126/258 | 704/955 | 0/45 | 647.5
rules | turtle | 252 | 0.779 | 10072 | 1/1379 | 1/1 | 9010/1247 | 0/0 | 6815.3
rules | zoner | 252 | 0.801 | 18136 | 0/47 | 0/0 | 792/1177 | 0/0 | 554.8
