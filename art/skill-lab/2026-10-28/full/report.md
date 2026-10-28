# Skill lab

default: skilled-policy bots win 9.3% (20/216 completed bouts; 0 draws), 81.5 percentage points behind mashing. Untrusted policies: spacer. This does not establish human skill balance.

Autopilot candidates in default: aegis (35/36 masher wins against skilled policies), morrow (27/36 masher wins against skilled policies), rei (33/36 masher wins against skilled policies), sol (35/36 masher wins against skilled policies), tala (32/36 masher wins against skilled policies), vesper (34/36 masher wins against skilled policies). These are bot results, not human verdicts.

proposed: skilled-policy bots win 9.3% (20/216 completed bouts; 0 draws), 81.5 percentage points behind mashing. Untrusted policies: spacer. This does not establish human skill balance.

Autopilot candidates in proposed: aegis (34/36 masher wins against skilled policies), morrow (26/36 masher wins against skilled policies), rei (34/36 masher wins against skilled policies), sol (35/36 masher wins against skilled policies), tala (33/36 masher wins against skilled policies), vesper (34/36 masher wins against skilled policies). These are bot results, not human verdicts.

rules: skilled-policy bots win 8.8% (19/216 completed bouts; 0 draws), 82.4 percentage points behind mashing. Untrusted policies: spacer, reader. This does not establish human skill balance.

Autopilot candidates in rules: aegis (35/36 masher wins against skilled policies), morrow (27/36 masher wins against skilled policies), rei (33/36 masher wins against skilled policies), sol (35/36 masher wins against skilled policies), tala (33/36 masher wins against skilled policies), vesper (34/36 masher wins against skilled policies). These are bot results, not human verdicts.

Default → proposed changes skilled-policy win rate by 0.0 percentage points (n=216 default, n=216 proposed). Seeds and matchup schedule are paired; this is descriptive, not causal proof about human play.

Every unordered bot pair × every ordered fighter pair × three modes × 1 seed(s). Both seats per seed.

Runtime 150.3 seconds; 4536 bouts; 0 censored (excluded from win rates).

Sanity uses strict wins (draws are not wins), 95% Wilson lower bound >50%. Shared opponents/seeds are correlated; intervals are screening heuristics.

Whiffs: completed active windows without contact for basic strike/launcher only; interrupted windups excluded. Whiff punish: damage during the missed move's remaining recovery. Projectile misses are not classified as melee whiffs.

Move damage attribution is best effort from passive diagnostic hooks and existing events; simultaneous or unidentifiable sources remain unknown. Option variety includes a visible unknown bucket. Capture-through-guard means guard active when the capture started, not an inferred input read.

Attack presses count rising attack edges; damage/press includes all actions (capture/super included), so it is not damage per attack move. Simulation is untouched.

## Bot sanity

Bot | Mode | Wins / bouts vs random | Draws | 95% win interval | Trusted
--- | --- | --- | --- | --- | ---
masher | default | 68/72 | 0 | 86.6%–97.8% | yes
reader | default | 45/72 | 0 | 51.0%–72.8% | yes
spacer | default | 3/72 | 0 | 1.4%–11.5% | NO
timer | default | 49/72 | 0 | 56.6%–77.7% | yes
turtle | default | 23/72 | 0 | 22.3%–43.4% | NO
zoner | default | 58/72 | 0 | 70.0%–88.0% | yes
masher | proposed | 68/72 | 0 | 86.6%–97.8% | yes
reader | proposed | 45/72 | 0 | 51.0%–72.8% | yes
spacer | proposed | 1/72 | 0 | 0.2%–7.5% | NO
timer | proposed | 46/72 | 0 | 52.4%–74.0% | yes
turtle | proposed | 5/72 | 0 | 3.0%–15.2% | NO
zoner | proposed | 54/72 | 0 | 63.9%–83.6% | yes
masher | rules | 67/72 | 0 | 84.8%–97.0% | yes
reader | rules | 44/72 | 0 | 49.6%–71.5% | NO
spacer | rules | 3/72 | 0 | 1.4%–11.5% | NO
timer | rules | 46/72 | 0 | 52.4%–74.0% | yes
turtle | rules | 6/72 | 0 | 3.9%–17.0% | NO
zoner | rules | 55/72 | 0 | 65.4%–84.7% | yes

Open skill-lab.html with report.json for per-fighter and per-bout metrics. All input and distance frames use 60 Hz; input frames include hitstop, distance frames exclude frozen simulation ticks.

## Measured outcomes

Mode | Bot | n player-bouts | Damage / attack press | Attack presses | Whiffs / attempts | Punished / whiffs | Blocks / perfect guards | Capture breaks / captures through guard | Chip HP
---|---|---|---|---|---|---|---|---|---
default | masher | 432 | 0.191 | 221632 | 12/434 | 1/12 | 30/0 | 0/33 | 0.0
default | random | 432 | 2.190 | 14332 | 1020/2066 | 220/1020 | 156/291 | 3/171 | 85.4
default | reader | 432 | 1.189 | 25935 | 67/2598 | 16/67 | 21/131 | 10/0 | 18.4
default | spacer | 432 | 0.731 | 18645 | 0/29 | 0/0 | 0/0 | 0/0 | 0.0
default | timer | 432 | 1.049 | 30954 | 43/3123 | 5/43 | 22/148 | 11/28 | 13.1
default | turtle | 432 | 4.773 | 4986 | 81/2858 | 9/81 | 6021/2803 | 74/0 | 4955.2
default | zoner | 432 | 1.817 | 20347 | 0/0 | 0/0 | 9/85 | 15/0 | 7.0
proposed | masher | 432 | 0.191 | 220776 | 13/401 | 3/13 | 31/0 | 0/65 | 0.0
proposed | random | 432 | 2.266 | 14119 | 1073/2012 | 240/1073 | 126/284 | 1/237 | 73.1
proposed | reader | 432 | 1.157 | 26467 | 59/2793 | 8/59 | 18/128 | 0/0 | 17.3
proposed | spacer | 432 | 0.745 | 18772 | 0/25 | 0/0 | 0/0 | 0/0 | 0.0
proposed | timer | 432 | 1.035 | 31017 | 42/3042 | 5/42 | 26/139 | 0/30 | 16.9
proposed | turtle | 432 | 4.971 | 4444 | 67/2603 | 31/67 | 5896/2692 | 0/0 | 4678.4
proposed | zoner | 432 | 1.827 | 20170 | 0/1 | 0/0 | 3/88 | 0/0 | 3.2
rules | masher | 432 | 0.192 | 221023 | 11/402 | 2/11 | 29/0 | 0/52 | 0.0
rules | random | 432 | 2.275 | 14114 | 1034/1988 | 213/1034 | 143/280 | 1/236 | 84.4
rules | reader | 432 | 1.182 | 25912 | 61/2585 | 16/61 | 18/132 | 0/0 | 16.7
rules | spacer | 432 | 0.733 | 18693 | 0/29 | 0/0 | 0/0 | 0/0 | 0.0
rules | timer | 432 | 1.038 | 31089 | 39/3141 | 4/39 | 23/150 | 0/28 | 14.0
rules | turtle | 432 | 4.904 | 4669 | 65/2662 | 31/65 | 5865/2743 | 0/0 | 4795.8
rules | zoner | 432 | 1.791 | 20465 | 0/1 | 0/0 | 7/88 | 0/0 | 6.7
