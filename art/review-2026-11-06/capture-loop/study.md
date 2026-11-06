# CAPTURE-LOOP study

Real Normal CPU (`aiInput`, always seat 2) versus visible-state policies delayed 15 input frames. Every ordered fighter pair and five seeds; 60-second rounds. Repeat policy is unchanged circle-camper. Spaced policy requests a capture at most every 240 input frames and skips visibly down/rising opponents. It is still a spacing/capture policy, not an expert human.

CPU cannot drive seat 1 in this API; all 36 ordered pairings cover every fighter in each role. Ranges envelope Wilson and 2,000 resamples of ordered pair blocks (five seeds kept together). Overlapping ranges are labelled could be luck; comparisons are exploratory. Draws count as non-wins, censored bouts remain separately reported.

## repeat

| Mode | CPU wins (95% range) | Camper wins / draws | Ranged circles landed / thrown | Thrown at recovery | At floor | CPU ready frames / round | CPU damage | Consumed during wake protection | Close capture damage by camper |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| base-old | 0/180 · 0.0% (0.0%–2.1%) | 180 / 0 | 1106/1699 · 65.1% | 54.6% | 13.9% | 285.4 | 2.6 | 0 | 19.9 · 0.1% |
| base-v2 | 2/180 · 1.1% (0.0%–4.0%) | 178 / 0 | 1085/2160 · 50.2% | 41.8% | 11.3% | 423.2 | 9.9 | 0 | 193.9 · 1.1% |
| base-all | 3/180 · 1.7% (0.0%–4.8%) | 177 / 0 | 1259/2701 · 46.6% | 39.9% | 10.8% | 535.4 | 13.2 | 0 | 249.9 · 1.4% |
| inv-old | 1/180 · 0.6% (0.0%–3.1%) · could be luck | 179 / 0 | 1102/2709 · 40.7% | 34.1% | 9.8% | 551.6 | 21.3 | 760 | 497.7 · 2.8% |
| inv-v2 | 5/180 · 2.8% (0.6%–6.3%) · could be luck | 175 / 0 | 1082/3428 · 31.6% | 26.5% | 9.3% | 777.4 | 27.6 | 675 | 366.4 · 2.1% |
| inv-all | 6/180 · 3.3% (1.1%–7.1%) · could be luck | 174 / 0 | 1168/4255 · 27.5% | 24.3% | 8.6% | 994.3 | 30.2 | 778 | 385.9 · 2.3% |
| close3-old | 0/180 · 0.0% (0.0%–2.1%) · could be luck | 180 / 0 | 1131/1484 · 76.2% | 63.7% | 15.6% | 218.9 | 4.4 | 0 | 209.9 · 1.2% |
| close3-v2 | 2/180 · 1.1% (0.0%–4.0%) · could be luck | 178 / 0 | 1112/1819 · 61.1% | 50.9% | 10.9% | 318.0 | 10.0 | 0 | 393.2 · 2.2% |
| close3-all | 2/180 · 1.1% (0.0%–4.0%) · could be luck | 178 / 0 | 1253/2129 · 58.9% | 50.1% | 10.6% | 365.3 | 11.6 | 0 | 490.3 · 2.7% |
| close45-old | 0/180 · 0.0% (0.0%–2.1%) · could be luck | 180 / 0 | 1093/1647 · 66.4% | 55.6% | 19.4% | 281.2 | 3.5 | 0 | 245.0 · 1.4% |
| close45-v2 | 1/180 · 0.6% (0.0%–3.1%) · could be luck | 179 / 0 | 1087/2130 · 51.0% | 42.4% | 11.6% | 411.1 | 10.2 | 0 | 181.2 · 1.0% |
| close45-all | 2/180 · 1.1% (0.0%–4.0%) · could be luck | 178 / 0 | 1258/2564 · 49.1% | 42.2% | 11.8% | 496.3 | 13.5 | 0 | 275.4 · 1.5% |
| inv,close3-old | 4/180 · 2.2% (0.6%–5.6%) · could be luck | 176 / 0 | 1089/2654 · 41.0% | 33.9% | 11.8% | 572.3 | 22.4 | 762 | 921.0 · 5.1% |
| inv,close3-v2 | 7/180 · 3.9% (1.1%–7.8%) · could be luck | 173 / 0 | 1052/3278 · 32.1% | 26.8% | 8.4% | 771.9 | 29.0 | 662 | 941.1 · 5.4% |
| inv,close3-all | 13/180 · 7.2% (2.8%–12.2%) · could be luck | 167 / 0 | 1109/3899 · 28.4% | 24.6% | 8.2% | 925.8 | 33.5 | 725 | 1060.9 · 6.4% |
| inv,close45-old | 2/180 · 1.1% (0.0%–4.0%) · could be luck | 178 / 0 | 1090/2756 · 39.6% | 33.1% | 9.6% | 582.5 | 21.2 | 764 | 646.0 · 3.6% |
| inv,close45-v2 | 9/180 · 5.0% (2.2%–9.2%) · could be luck | 171 / 0 | 1063/3276 · 32.4% | 27.4% | 7.9% | 729.5 | 30.3 | 704 | 548.1 · 3.1% |
| inv,close45-all | 15/180 · 8.3% (4.4%–13.3%) · could be luck | 165 / 0 | 1148/3996 · 28.7% | 25.0% | 7.9% | 929.5 | 36.1 | 777 | 727.8 · 4.3% |

## spaced

| Mode | CPU wins (95% range) | Camper wins / draws | Ranged circles landed / thrown | Thrown at recovery | At floor | CPU ready frames / round | CPU damage | Consumed during wake protection | Close capture damage by camper |
| --- | --- | --- | --- | --- | --- | --- | --- | --- | --- |
| base-old | 19/180 · 10.6% (5.6%–16.1%) | 161 / 0 | 983/1562 · 62.9% | 23.0% | 10.1% | 1386.7 | 27.4 | 0 | 438.3 · 2.8% |
| base-v2 | 45/180 · 25.0% (19.2%–31.8%) | 135 / 0 | 802/1759 · 45.6% | 21.0% | 9.5% | 1591.3 | 40.4 | 0 | 234.1 · 1.8% |
| base-all | 63/180 · 35.0% (28.4%–42.2%) | 117 / 0 | 732/1847 · 39.6% | 18.8% | 9.1% | 1707.1 | 43.0 | 0 | 321.8 · 3.0% |
| inv-old | 40/180 · 22.2% (15.0%–30.0%) · could be luck | 140 / 0 | 882/1860 · 47.4% | 24.0% | 11.9% | 1653.0 | 42.9 | 347 | 367.4 · 2.6% |
| inv-v2 | 59/180 · 32.8% (26.1%–39.9%) · could be luck | 121 / 0 | 691/1926 · 35.9% | 20.8% | 10.4% | 1764.1 | 45.3 | 267 | 287.2 · 2.6% |
| inv-all | 75/180 · 41.7% (34.7%–49.0%) · could be luck | 105 / 0 | 609/1981 · 30.7% | 18.4% | 9.5% | 1867.0 | 45.7 | 233 | 344.1 · 3.8% |
| close3-old | 11/180 · 6.1% (2.2%–10.6%) · could be luck | 169 / 0 | 1034/1512 · 68.4% | 28.7% | 11.0% | 1230.1 | 26.3 | 0 | 270.0 · 1.7% |
| close3-v2 | 39/180 · 21.7% (16.1%–28.2%) · could be luck | 141 / 0 | 869/1796 · 48.4% | 25.1% | 9.9% | 1519.7 | 37.8 | 0 | 232.3 · 1.7% |
| close3-all | 46/180 · 25.6% (19.7%–32.4%) · could be luck | 134 / 0 | 842/1896 · 44.4% | 23.6% | 9.1% | 1628.5 | 37.4 | 0 | 337.4 · 2.8% |
| close45-old | 14/180 · 7.8% (3.9%–12.8%) · could be luck | 166 / 0 | 1003/1573 · 63.8% | 24.3% | 9.9% | 1361.5 | 28.3 | 0 | 418.6 · 2.7% |
| close45-v2 | 36/180 · 20.0% (14.4%–26.4%) · could be luck | 144 / 0 | 798/1788 · 44.6% | 20.5% | 10.0% | 1602.9 | 41.6 | 0 | 282.8 · 2.2% |
| close45-all | 61/180 · 33.9% (27.4%–41.1%) · could be luck | 119 / 0 | 710/1880 · 37.8% | 18.4% | 9.5% | 1736.0 | 44.8 | 0 | 313.8 · 3.0% |
| inv,close3-old | 36/180 · 20.0% (12.2%–28.3%) · could be luck | 144 / 0 | 896/1839 · 48.7% | 24.4% | 11.6% | 1604.8 | 41.0 | 372 | 377.6 · 2.6% |
| inv,close3-v2 | 64/180 · 35.6% (28.9%–42.8%) · could be luck | 116 / 0 | 720/1952 · 36.9% | 21.8% | 11.7% | 1711.3 | 46.1 | 268 | 185.3 · 1.6% |
| inv,close3-all | 66/180 · 36.7% (30.0%–43.9%) · could be luck | 114 / 0 | 664/2006 · 33.1% | 19.5% | 10.4% | 1817.5 | 43.1 | 243 | 288.4 · 3.0% |
| inv,close45-old | 25/180 · 13.9% (8.3%–20.0%) · could be luck | 155 / 0 | 916/1843 · 49.7% | 24.9% | 12.4% | 1619.1 | 39.3 | 346 | 387.6 · 2.7% |
| inv,close45-v2 | 57/180 · 31.7% (25.3%–38.8%) · could be luck | 123 / 0 | 728/1955 · 37.2% | 21.2% | 10.5% | 1735.0 | 46.3 | 272 | 223.2 · 1.9% |
| inv,close45-all | 74/180 · 41.1% (34.2%–48.4%) · could be luck | 106 / 0 | 636/2014 · 31.6% | 19.0% | 9.7% | 1832.7 | 46.5 | 234 | 293.8 · 3.2% |

Definitions: throws count actual newly spawned capture projectiles; landings are mid/far capture confirmations, not delayed HP changes. Recovery includes launched/falling, bounce, knockdown, roll and get-up; floor subset requires air<=0. CPU ready frames use the conservative beginning-of-tick grounded-ready predicate in study.mjs, excluding hitstop/cinematics/committed actions/recovery. This is distinct from previously reported readiness definitions; do not compare old frame totals directly. Consumed circles include overlap during already-existing generic invulnerability and do not individually prove an additional prevented hit. Close capture damage is shown to expose substitutions of one loop for another.

Total 6480 bouts; censored 0; runtime 103.4 seconds; build 4424f1ffbb13.
