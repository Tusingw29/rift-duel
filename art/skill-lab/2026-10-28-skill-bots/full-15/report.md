# Skill lab

default: skilled-policy bots win 24.1% (52/216 completed bouts; 0 draws), 51.9 percentage points behind mashing. Untrusted policies: spacer. This does not establish human skill balance.

Autopilot candidates in default: aegis (36/36 masher wins against skilled policies), rei (26/36 masher wins against skilled policies), sol (30/36 masher wins against skilled policies), tala (29/36 masher wins against skilled policies), vesper (28/36 masher wins against skilled policies). These are bot results, not human verdicts.

proposed: skilled-policy bots win 20.8% (45/216 completed bouts; 0 draws), 58.3 percentage points behind mashing. Untrusted policies: spacer. This does not establish human skill balance.

Autopilot candidates in proposed: aegis (33/36 masher wins against skilled policies), rei (29/36 masher wins against skilled policies), sol (34/36 masher wins against skilled policies), tala (29/36 masher wins against skilled policies), vesper (30/36 masher wins against skilled policies). These are bot results, not human verdicts.

rules: skilled-policy bots win 20.4% (44/216 completed bouts; 0 draws), 59.3 percentage points behind mashing. Untrusted policies: spacer. This does not establish human skill balance.

Autopilot candidates in rules: aegis (34/36 masher wins against skilled policies), rei (28/36 masher wins against skilled policies), sol (34/36 masher wins against skilled policies), tala (30/36 masher wins against skilled policies), vesper (29/36 masher wins against skilled policies). These are bot results, not human verdicts.

Default → proposed changes skilled-policy win rate by -3.2 percentage points (n=216 default, n=216 proposed). Seeds and matchup schedule are paired; this is descriptive, not causal proof about human play.

Every unordered bot pair × every ordered fighter pair × three modes × 1 seed(s). Both seats per seed.

Runtime 138.9 seconds; 6048 bouts; 0 censored (excluded from win rates).

Sanity uses strict wins (draws are not wins), 95% Wilson lower bound >50%. Shared opponents/seeds are correlated; intervals are screening heuristics.

Whiffs: completed active windows without contact for basic strike/launcher only; interrupted windups excluded. Whiff punish: damage during the missed move's remaining recovery. Projectile misses are not classified as melee whiffs.

Move damage attribution is best effort from passive diagnostic hooks and existing events; simultaneous or unidentifiable sources remain unknown. Option variety includes a visible unknown bucket. Capture-through-guard means guard active when the capture started, not an inferred input read.

Attack presses count rising attack edges; damage/press includes all actions (capture/super included), so it is not damage per attack move. Simulation is untouched.

## Bot sanity

Bot | Mode | Wins / bouts vs random | Draws | 95% win interval | Trusted
--- | --- | --- | --- | --- | ---
masher | default | 68/72 | 0 | 86.6%–97.8% | yes
punisher | default | 68/72 | 0 | 86.6%–97.8% | yes
reader | default | 65/72 | 0 | 81.3%–95.2% | yes
spacer | default | 12/72 | 0 | 9.8%–26.9% | NO
timer | default | 68/72 | 0 | 86.6%–97.8% | yes
turtle | default | 3/72 | 0 | 1.4%–11.5% | NO
zoner | default | 68/72 | 0 | 86.6%–97.8% | yes
masher | proposed | 68/72 | 0 | 86.6%–97.8% | yes
punisher | proposed | 65/72 | 0 | 81.3%–95.2% | yes
reader | proposed | 67/72 | 0 | 84.8%–97.0% | yes
spacer | proposed | 7/72 | 0 | 4.8%–18.7% | NO
timer | proposed | 69/72 | 0 | 88.5%–98.6% | yes
turtle | proposed | 3/72 | 0 | 1.4%–11.5% | NO
zoner | proposed | 67/72 | 0 | 84.8%–97.0% | yes
masher | rules | 67/72 | 0 | 84.8%–97.0% | yes
punisher | rules | 66/72 | 0 | 83.0%–96.1% | yes
reader | rules | 65/72 | 0 | 81.3%–95.2% | yes
spacer | rules | 7/72 | 0 | 4.8%–18.7% | NO
timer | rules | 68/72 | 0 | 86.6%–97.8% | yes
turtle | rules | 2/72 | 0 | 0.8%–9.6% | NO
zoner | rules | 67/72 | 0 | 84.8%–97.0% | yes

Open skill-lab.html with report.json for per-fighter and per-bout metrics. All input and distance frames use 60 Hz; input frames include hitstop, distance frames exclude frozen simulation ticks.

## Measured outcomes

Mode | Bot | n player-bouts | Damage / attack press | Attack presses | Whiffs / attempts | Punished / whiffs | Blocks / perfect guards | Capture breaks / captures through guard | Chip HP
---|---|---|---|---|---|---|---|---|---
default | masher | 504 | 0.142 | 317845 | 22/935 | 0/22 | 11/0 | 0/384 | 0.0
default | punisher | 504 | 0.771 | 58805 | 402/9604 | 19/402 | 970/763 | 16/0 | 600.4
default | random | 504 | 1.856 | 16086 | 1183/2465 | 145/1183 | 69/242 | 6/606 | 50.1
default | reader | 504 | 1.087 | 37166 | 417/9287 | 18/417 | 979/777 | 15/0 | 604.6
default | spacer | 504 | 1.011 | 21230 | 55/3151 | 9/55 | 1293/1347 | 109/0 | 874.3
default | timer | 504 | 1.373 | 30691 | 439/6909 | 11/439 | 1001/791 | 16/340 | 606.5
default | turtle | 504 | 0.592 | 18481 | 21/2865 | 19/21 | 14732/1994 | 61/0 | 11175.7
default | zoner | 504 | 1.122 | 34980 | 0/442 | 0/0 | 998/376 | 11/0 | 791.1
proposed | masher | 504 | 0.137 | 333325 | 14/861 | 0/14 | 14/0 | 0/534 | 0.0
proposed | punisher | 504 | 0.698 | 60685 | 739/10068 | 25/739 | 1194/765 | 0/0 | 744.5
proposed | random | 504 | 1.901 | 15768 | 1168/2375 | 123/1168 | 60/227 | 2/666 | 44.8
proposed | reader | 504 | 0.978 | 38992 | 679/9391 | 19/679 | 1206/795 | 0/2 | 757.6
proposed | spacer | 504 | 1.421 | 17389 | 30/3549 | 10/30 | 1412/1227 | 0/0 | 936.0
proposed | timer | 504 | 1.247 | 32079 | 745/7099 | 27/745 | 1226/813 | 0/369 | 763.5
proposed | turtle | 504 | 0.588 | 17628 | 7/2749 | 6/7 | 14230/2028 | 0/0 | 10850.9
proposed | zoner | 504 | 1.151 | 35026 | 0/418 | 0/0 | 986/412 | 0/0 | 748.2
rules | masher | 504 | 0.139 | 331042 | 18/846 | 0/18 | 17/0 | 0/534 | 0.0
rules | punisher | 504 | 0.697 | 61619 | 731/10083 | 29/731 | 1143/759 | 0/0 | 699.8
rules | random | 504 | 1.920 | 15758 | 1188/2376 | 134/1188 | 77/222 | 2/681 | 57.6
rules | reader | 504 | 0.986 | 38987 | 623/9401 | 25/623 | 1132/776 | 0/4 | 696.5
rules | spacer | 504 | 1.456 | 17403 | 45/3567 | 10/45 | 1386/1241 | 0/0 | 914.9
rules | timer | 504 | 1.221 | 32367 | 805/7153 | 31/805 | 1163/786 | 0/351 | 706.2
rules | turtle | 504 | 0.587 | 17831 | 21/2788 | 18/21 | 14347/1991 | 0/0 | 10957.5
rules | zoner | 504 | 1.126 | 35026 | 0/434 | 0/0 | 1083/349 | 0/0 | 839.0
