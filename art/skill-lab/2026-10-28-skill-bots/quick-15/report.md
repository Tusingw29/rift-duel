# Skill lab

default: skilled-policy bots win 20.4% (22/108 completed bouts; 0 draws), 59.3 percentage points behind mashing. Untrusted policies: spacer. This does not establish human skill balance.

Autopilot candidates in default: aegis (18/18 masher wins against skilled policies), sol (16/18 masher wins against skilled policies), tala (16/18 masher wins against skilled policies), rei (14/18 masher wins against skilled policies), vesper (14/18 masher wins against skilled policies). These are bot results, not human verdicts.

proposed: skilled-policy bots win 19.4% (21/108 completed bouts; 0 draws), 61.1 percentage points behind mashing. Untrusted policies: spacer. This does not establish human skill balance.

Autopilot candidates in proposed: aegis (17/18 masher wins against skilled policies), sol (17/18 masher wins against skilled policies), tala (15/18 masher wins against skilled policies), rei (15/18 masher wins against skilled policies), vesper (15/18 masher wins against skilled policies). These are bot results, not human verdicts.

rules: skilled-policy bots win 17.6% (19/108 completed bouts; 0 draws), 64.8 percentage points behind mashing. Untrusted policies: spacer. This does not establish human skill balance.

Autopilot candidates in rules: aegis (16/18 masher wins against skilled policies), sol (17/18 masher wins against skilled policies), tala (16/18 masher wins against skilled policies), rei (15/18 masher wins against skilled policies), vesper (15/18 masher wins against skilled policies). These are bot results, not human verdicts.

Default → proposed changes skilled-policy win rate by -0.9 percentage points (n=108 default, n=108 proposed). Seeds and matchup schedule are paired; this is descriptive, not causal proof about human play.

Every unordered bot pair × every ordered fighter pair × three modes × 1 seed(s). Quick alternates seats across matchups; individual matchup seat bias is not controlled until --full.

Runtime 56.2 seconds; 3024 bouts; 0 censored (excluded from win rates).

Sanity uses strict wins (draws are not wins), 95% Wilson lower bound >50%. Shared opponents/seeds are correlated; intervals are screening heuristics.

Whiffs: completed active windows without contact for basic strike/launcher only; interrupted windups excluded. Whiff punish: damage during the missed move's remaining recovery. Projectile misses are not classified as melee whiffs.

Move damage attribution is best effort from passive diagnostic hooks and existing events; simultaneous or unidentifiable sources remain unknown. Option variety includes a visible unknown bucket. Capture-through-guard means guard active when the capture started, not an inferred input read.

Attack presses count rising attack edges; damage/press includes all actions (capture/super included), so it is not damage per attack move. Simulation is untouched.

## Bot sanity

Bot | Mode | Wins / bouts vs random | Draws | 95% win interval | Trusted
--- | --- | --- | --- | --- | ---
masher | default | 34/36 | 0 | 81.9%–98.5% | yes
punisher | default | 35/36 | 0 | 85.8%–99.5% | yes
reader | default | 33/36 | 0 | 78.2%–97.1% | yes
spacer | default | 5/36 | 0 | 6.1%–28.7% | NO
timer | default | 34/36 | 0 | 81.9%–98.5% | yes
turtle | default | 1/36 | 0 | 0.5%–14.2% | NO
zoner | default | 34/36 | 0 | 81.9%–98.5% | yes
masher | proposed | 33/36 | 0 | 78.2%–97.1% | yes
punisher | proposed | 32/36 | 0 | 74.7%–95.6% | yes
reader | proposed | 35/36 | 0 | 85.8%–99.5% | yes
spacer | proposed | 2/36 | 0 | 1.5%–18.1% | NO
timer | proposed | 36/36 | 0 | 90.4%–100.0% | yes
turtle | proposed | 2/36 | 0 | 1.5%–18.1% | NO
zoner | proposed | 33/36 | 0 | 78.2%–97.1% | yes
masher | rules | 33/36 | 0 | 78.2%–97.1% | yes
punisher | rules | 33/36 | 0 | 78.2%–97.1% | yes
reader | rules | 34/36 | 0 | 81.9%–98.5% | yes
spacer | rules | 1/36 | 0 | 0.5%–14.2% | NO
timer | rules | 35/36 | 0 | 85.8%–99.5% | yes
turtle | rules | 1/36 | 0 | 0.5%–14.2% | NO
zoner | rules | 33/36 | 0 | 78.2%–97.1% | yes

Open skill-lab.html with report.json for per-fighter and per-bout metrics. All input and distance frames use 60 Hz; input frames include hitstop, distance frames exclude frozen simulation ticks.

## Measured outcomes

Mode | Bot | n player-bouts | Damage / attack press | Attack presses | Whiffs / attempts | Punished / whiffs | Blocks / perfect guards | Capture breaks / captures through guard | Chip HP
---|---|---|---|---|---|---|---|---|---
default | masher | 252 | 0.146 | 156796 | 9/447 | 0/9 | 7/0 | 0/195 | 0.0
default | punisher | 252 | 0.773 | 29133 | 206/4773 | 12/206 | 500/374 | 7/0 | 305.6
default | random | 252 | 1.869 | 8055 | 604/1234 | 78/604 | 37/120 | 2/308 | 28.6
default | reader | 252 | 1.088 | 18520 | 210/4632 | 10/210 | 472/394 | 9/0 | 292.9
default | spacer | 252 | 1.022 | 10605 | 25/1582 | 4/25 | 633/678 | 62/0 | 438.2
default | timer | 252 | 1.367 | 15351 | 222/3445 | 5/222 | 518/396 | 6/170 | 310.5
default | turtle | 252 | 0.585 | 9192 | 10/1420 | 10/10 | 7269/991 | 32/0 | 5551.0
default | zoner | 252 | 1.125 | 17494 | 0/223 | 0/0 | 451/188 | 6/0 | 361.1
proposed | masher | 252 | 0.139 | 164852 | 4/411 | 0/4 | 5/0 | 0/270 | 0.0
proposed | punisher | 252 | 0.701 | 30123 | 377/5022 | 13/377 | 538/385 | 0/0 | 348.8
proposed | random | 252 | 1.895 | 7744 | 588/1185 | 63/588 | 32/111 | 1/324 | 26.2
proposed | reader | 252 | 0.985 | 19382 | 339/4687 | 10/339 | 656/399 | 0/1 | 395.5
proposed | spacer | 252 | 1.431 | 8679 | 11/1781 | 6/11 | 762/614 | 0/0 | 496.4
proposed | timer | 252 | 1.249 | 16050 | 368/3559 | 11/368 | 555/402 | 0/184 | 358.7
proposed | turtle | 252 | 0.590 | 8848 | 4/1377 | 3/4 | 7085/1016 | 0/0 | 5407.1
proposed | zoner | 252 | 1.151 | 17485 | 0/210 | 0/0 | 400/207 | 0/0 | 312.2
rules | masher | 252 | 0.141 | 163300 | 7/402 | 0/7 | 7/0 | 0/268 | 0.0
rules | punisher | 252 | 0.696 | 30707 | 370/5028 | 18/370 | 531/372 | 0/0 | 334.6
rules | random | 252 | 1.925 | 7883 | 609/1197 | 73/609 | 44/113 | 1/351 | 35.2
rules | reader | 252 | 0.991 | 19425 | 315/4714 | 14/315 | 601/394 | 0/2 | 360.9
rules | spacer | 252 | 1.455 | 8766 | 21/1789 | 5/21 | 727/638 | 0/0 | 480.1
rules | timer | 252 | 1.221 | 16144 | 395/3575 | 14/395 | 542/378 | 0/175 | 335.0
rules | turtle | 252 | 0.588 | 8804 | 10/1379 | 9/10 | 7099/994 | 0/0 | 5427.1
rules | zoner | 252 | 1.127 | 17519 | 0/217 | 0/0 | 445/170 | 0/0 | 357.2
