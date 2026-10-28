# Skill lab

default: skilled-policy bots win 10.2% (11/108 completed bouts; 0 draws), 79.6 percentage points behind mashing. Untrusted policies: spacer, reader. This does not establish human skill balance.

Autopilot candidates in default: aegis (17/18 masher wins against skilled policies), sol (17/18 masher wins against skilled policies), tala (16/18 masher wins against skilled policies), morrow (14/18 masher wins against skilled policies), rei (17/18 masher wins against skilled policies), vesper (16/18 masher wins against skilled policies). These are bot results, not human verdicts.

proposed: skilled-policy bots win 10.2% (11/108 completed bouts; 0 draws), 79.6 percentage points behind mashing. Untrusted policies: spacer, timer. This does not establish human skill balance.

Autopilot candidates in proposed: aegis (17/18 masher wins against skilled policies), sol (17/18 masher wins against skilled policies), tala (16/18 masher wins against skilled policies), morrow (14/18 masher wins against skilled policies), rei (17/18 masher wins against skilled policies), vesper (16/18 masher wins against skilled policies). These are bot results, not human verdicts.

rules: skilled-policy bots win 10.2% (11/108 completed bouts; 0 draws), 79.6 percentage points behind mashing. Untrusted policies: spacer, reader. This does not establish human skill balance.

Autopilot candidates in rules: aegis (17/18 masher wins against skilled policies), sol (17/18 masher wins against skilled policies), tala (16/18 masher wins against skilled policies), morrow (14/18 masher wins against skilled policies), rei (17/18 masher wins against skilled policies), vesper (16/18 masher wins against skilled policies). These are bot results, not human verdicts.

Default → proposed changes skilled-policy win rate by 0.0 percentage points (n=108 default, n=108 proposed). Seeds and matchup schedule are paired; this is descriptive, not causal proof about human play.

Every unordered bot pair × every ordered fighter pair × three modes × 1 seed(s). Quick alternates seats across matchups; individual matchup seat bias is not controlled until --full.

Runtime 79.8 seconds; 2268 bouts; 0 censored (excluded from win rates).

Sanity uses strict wins (draws are not wins), 95% Wilson lower bound >50%. Shared opponents/seeds are correlated; intervals are screening heuristics.

Whiffs: completed active windows without contact for basic strike/launcher only; interrupted windups excluded. Whiff punish: damage during the missed move's remaining recovery. Projectile misses are not classified as melee whiffs.

Move damage attribution is best effort from passive diagnostic hooks and existing events; simultaneous or unidentifiable sources remain unknown. Option variety includes a visible unknown bucket. Capture-through-guard means guard active when the capture started, not an inferred input read.

Attack presses count rising attack edges; damage/press includes all actions (capture/super included), so it is not damage per attack move. Simulation is untouched.

## Bot sanity

Bot | Mode | Wins / bouts vs random | Draws | 95% win interval | Trusted
--- | --- | --- | --- | --- | ---
masher | default | 34/36 | 0 | 81.9%–98.5% | yes
reader | default | 21/36 | 0 | 42.2%–72.9% | NO
spacer | default | 2/36 | 0 | 1.5%–18.1% | NO
timer | default | 26/36 | 0 | 56.0%–84.2% | yes
turtle | default | 10/36 | 0 | 15.8%–44.0% | NO
zoner | default | 28/36 | 0 | 61.9%–88.3% | yes
masher | proposed | 33/36 | 0 | 78.2%–97.1% | yes
reader | proposed | 24/36 | 0 | 50.3%–79.8% | yes
spacer | proposed | 0/36 | 0 | 0.0%–9.6% | NO
timer | proposed | 23/36 | 0 | 47.6%–77.5% | NO
turtle | proposed | 1/36 | 0 | 0.5%–14.2% | NO
zoner | proposed | 26/36 | 0 | 56.0%–84.2% | yes
masher | rules | 33/36 | 0 | 78.2%–97.1% | yes
reader | rules | 21/36 | 0 | 42.2%–72.9% | NO
spacer | rules | 2/36 | 0 | 1.5%–18.1% | NO
timer | rules | 24/36 | 0 | 50.3%–79.8% | yes
turtle | rules | 2/36 | 0 | 1.5%–18.1% | NO
zoner | rules | 27/36 | 0 | 58.9%–86.2% | yes

Open skill-lab.html with report.json for per-fighter and per-bout metrics. All input and distance frames use 60 Hz; input frames include hitstop, distance frames exclude frozen simulation ticks.

## Measured outcomes

Mode | Bot | n player-bouts | Damage / attack press | Attack presses | Whiffs / attempts | Punished / whiffs | Blocks / perfect guards | Capture breaks / captures through guard | Chip HP
---|---|---|---|---|---|---|---|---|---
default | masher | 216 | 0.190 | 111570 | 3/235 | 1/3 | 18/0 | 0/19 | 0.0
default | random | 216 | 2.197 | 7205 | 527/1071 | 112/527 | 76/138 | 1/90 | 45.2
default | reader | 216 | 1.169 | 13140 | 36/1295 | 8/36 | 13/65 | 6/0 | 9.8
default | spacer | 216 | 0.722 | 9361 | 0/12 | 0/0 | 0/0 | 0/0 | 0.0
default | timer | 216 | 1.067 | 15364 | 20/1579 | 2/20 | 6/70 | 7/14 | 3.2
default | turtle | 216 | 4.726 | 2540 | 41/1457 | 2/41 | 3037/1406 | 40/0 | 2483.0
default | zoner | 216 | 1.817 | 10212 | 0/0 | 0/0 | 6/44 | 5/0 | 4.2
proposed | masher | 216 | 0.191 | 110985 | 5/216 | 2/5 | 20/0 | 0/34 | 0.0
proposed | random | 216 | 2.263 | 7078 | 551/1032 | 123/551 | 54/130 | 0/119 | 34.3
proposed | reader | 216 | 1.156 | 13284 | 30/1387 | 3/30 | 11/64 | 0/0 | 9.8
proposed | spacer | 216 | 0.744 | 9334 | 0/10 | 0/0 | 0/0 | 0/0 | 0.0
proposed | timer | 216 | 1.044 | 15463 | 22/1529 | 2/22 | 10/68 | 0/15 | 5.6
proposed | turtle | 216 | 4.905 | 2242 | 36/1313 | 16/36 | 2947/1345 | 0/0 | 2332.8
proposed | zoner | 216 | 1.822 | 10157 | 0/0 | 0/0 | 1/47 | 0/0 | 1.2
rules | masher | 216 | 0.190 | 111798 | 3/223 | 1/3 | 17/0 | 0/29 | 0.0
rules | random | 216 | 2.280 | 7100 | 530/1026 | 107/530 | 59/135 | 0/116 | 39.0
rules | reader | 216 | 1.166 | 13114 | 33/1288 | 8/33 | 11/63 | 0/0 | 8.7
rules | spacer | 216 | 0.728 | 9352 | 0/12 | 0/0 | 0/0 | 0/0 | 0.0
rules | timer | 216 | 1.053 | 15460 | 20/1585 | 1/20 | 7/70 | 0/14 | 4.1
rules | turtle | 216 | 4.796 | 2408 | 35/1372 | 17/35 | 2943/1380 | 0/0 | 2404.5
rules | zoner | 216 | 1.791 | 10288 | 0/0 | 0/0 | 4/47 | 0/0 | 3.9
