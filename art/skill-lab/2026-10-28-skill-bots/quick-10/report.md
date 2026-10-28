# Skill lab

default: skilled-policy bots win 66.7% (72/108 completed bouts; 0 draws), 33.3 percentage points ahead of mashing. Untrusted policies: spacer. This does not establish human skill balance.

Autopilot candidates in default: none established by a 95% interval. These are bot results, not human verdicts.

proposed: skilled-policy bots win 63.0% (68/108 completed bouts; 0 draws), 25.9 percentage points ahead of mashing. Untrusted policies: spacer. This does not establish human skill balance.

Autopilot candidates in proposed: aegis (14/18 masher wins against skilled policies). These are bot results, not human verdicts.

rules: skilled-policy bots win 66.7% (72/108 completed bouts; 0 draws), 33.3 percentage points ahead of mashing. Untrusted policies: spacer. This does not establish human skill balance.

Autopilot candidates in rules: none established by a 95% interval. These are bot results, not human verdicts.

Default → proposed changes skilled-policy win rate by -3.7 percentage points (n=108 default, n=108 proposed). Seeds and matchup schedule are paired; this is descriptive, not causal proof about human play.

Every unordered bot pair × every ordered fighter pair × three modes × 1 seed(s). Quick alternates seats across matchups; individual matchup seat bias is not controlled until --full.

Runtime 52.1 seconds; 3024 bouts; 0 censored (excluded from win rates).

Sanity uses strict wins (draws are not wins), 95% Wilson lower bound >50%. Shared opponents/seeds are correlated; intervals are screening heuristics.

Whiffs: completed active windows without contact for basic strike/launcher only; interrupted windups excluded. Whiff punish: damage during the missed move's remaining recovery. Projectile misses are not classified as melee whiffs.

Move damage attribution is best effort from passive diagnostic hooks and existing events; simultaneous or unidentifiable sources remain unknown. Option variety includes a visible unknown bucket. Capture-through-guard means guard active when the capture started, not an inferred input read.

Attack presses count rising attack edges; damage/press includes all actions (capture/super included), so it is not damage per attack move. Simulation is untouched.

## Bot sanity

Bot | Mode | Wins / bouts vs random | Draws | 95% win interval | Trusted
--- | --- | --- | --- | --- | ---
masher | default | 33/36 | 0 | 78.2%–97.1% | yes
punisher | default | 34/36 | 0 | 81.9%–98.5% | yes
reader | default | 35/36 | 0 | 85.8%–99.5% | yes
spacer | default | 10/36 | 0 | 15.8%–44.0% | NO
timer | default | 34/36 | 0 | 81.9%–98.5% | yes
turtle | default | 2/36 | 0 | 1.5%–18.1% | NO
zoner | default | 36/36 | 0 | 90.4%–100.0% | yes
masher | proposed | 33/36 | 0 | 78.2%–97.1% | yes
punisher | proposed | 33/36 | 1 | 78.2%–97.1% | yes
reader | proposed | 36/36 | 0 | 90.4%–100.0% | yes
spacer | proposed | 4/36 | 0 | 4.4%–25.3% | NO
timer | proposed | 34/36 | 0 | 81.9%–98.5% | yes
turtle | proposed | 1/36 | 0 | 0.5%–14.2% | NO
zoner | proposed | 34/36 | 0 | 81.9%–98.5% | yes
masher | rules | 32/36 | 0 | 74.7%–95.6% | yes
punisher | rules | 35/36 | 0 | 85.8%–99.5% | yes
reader | rules | 36/36 | 0 | 90.4%–100.0% | yes
spacer | rules | 3/36 | 0 | 2.9%–21.8% | NO
timer | rules | 34/36 | 0 | 81.9%–98.5% | yes
turtle | rules | 1/36 | 0 | 0.5%–14.2% | NO
zoner | rules | 36/36 | 0 | 90.4%–100.0% | yes

Open skill-lab.html with report.json for per-fighter and per-bout metrics. All input and distance frames use 60 Hz; input frames include hitstop, distance frames exclude frozen simulation ticks.

## Measured outcomes

Mode | Bot | n player-bouts | Damage / attack press | Attack presses | Whiffs / attempts | Punished / whiffs | Blocks / perfect guards | Capture breaks / captures through guard | Chip HP
---|---|---|---|---|---|---|---|---|---
default | masher | 252 | 0.103 | 178065 | 31/593 | 1/31 | 14/0 | 0/186 | 0.0
default | punisher | 252 | 0.600 | 37676 | 367/7008 | 8/367 | 406/886 | 7/0 | 358.0
default | random | 252 | 1.695 | 8139 | 610/1240 | 85/610 | 32/127 | 1/285 | 28.1
default | reader | 252 | 0.998 | 22171 | 379/7407 | 9/379 | 434/905 | 10/1 | 377.5
default | spacer | 252 | 1.347 | 10518 | 49/1913 | 15/49 | 1056/2055 | 80/0 | 1004.1
default | timer | 252 | 1.366 | 16266 | 270/4506 | 15/270 | 399/940 | 8/0 | 355.1
default | turtle | 252 | 0.603 | 7979 | 3/1402 | 0/3 | 9041/2122 | 59/0 | 6764.6
default | zoner | 252 | 0.811 | 16999 | 0/30 | 0/0 | 649/547 | 7/0 | 496.3
proposed | masher | 252 | 0.106 | 175778 | 24/526 | 3/24 | 21/0 | 0/244 | 0.0
proposed | punisher | 252 | 0.582 | 37597 | 419/6979 | 49/419 | 391/892 | 0/0 | 383.9
proposed | random | 252 | 1.813 | 8074 | 617/1241 | 80/617 | 37/130 | 1/324 | 29.9
proposed | reader | 252 | 0.988 | 22331 | 382/7432 | 63/382 | 474/953 | 0/1 | 420.2
proposed | spacer | 252 | 1.202 | 12708 | 33/2172 | 9/33 | 1026/1889 | 0/0 | 991.3
proposed | timer | 252 | 1.237 | 16887 | 395/4445 | 51/395 | 384/952 | 0/17 | 366.4
proposed | turtle | 252 | 0.611 | 7518 | 2/1359 | 2/2 | 8782/2159 | 0/0 | 6583.3
proposed | zoner | 252 | 0.826 | 17072 | 0/22 | 0/0 | 605/552 | 0/0 | 469.9
rules | masher | 252 | 0.106 | 176517 | 24/502 | 4/24 | 16/0 | 0/243 | 0.0
rules | punisher | 252 | 0.597 | 37225 | 374/6893 | 66/374 | 415/887 | 0/0 | 388.7
rules | random | 252 | 1.801 | 7964 | 616/1205 | 95/616 | 27/111 | 1/332 | 22.6
rules | reader | 252 | 0.973 | 22741 | 370/7465 | 63/370 | 457/922 | 0/0 | 401.8
rules | spacer | 252 | 1.214 | 12104 | 37/2053 | 12/37 | 1044/1827 | 0/0 | 996.3
rules | timer | 252 | 1.293 | 16459 | 330/4361 | 49/330 | 408/965 | 0/10 | 373.7
rules | turtle | 252 | 0.604 | 7540 | 2/1357 | 1/2 | 8747/2143 | 0/0 | 6567.7
rules | zoner | 252 | 0.833 | 17002 | 0/27 | 0/0 | 582/560 | 0/0 | 448.3
