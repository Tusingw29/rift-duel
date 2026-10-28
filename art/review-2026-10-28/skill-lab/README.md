# SKILL-LAB review — 2026-10-28

Status: **Review, awaiting Adam’s verdict**. Owner Codex; branch `codex/skill-lab`. Measurement only. Default combat is unchanged; no character, rig, pose, mocap or animation module was edited. Review HTML changes outside this lab are cache stamps only. No gameplay merge or Pages deployment.

## Open locally

- [Dashboard: mirrored-seat results](http://localhost:4203/dist/skill-lab.html?report=full)
- [Game with stats enabled](http://localhost:4203/dist/index.html?stats=1): start a duel for automatic round-result stats, or training → Pause → Match stats.
- [Rules-only live stats](http://localhost:4203/dist/index.html?stats=1&balance=rules)
- [Full proposal live stats](http://localhost:4203/dist/index.html?stats=1&balance=proposed)

If stopped: `python3 -m http.server 4203 --bind 127.0.0.1` in `~/rift-worktrees/skill-lab`.

## Findings

default: skilled-policy bots win 9.3% (20/216 completed bouts; 0 draws), 81.5 percentage points behind mashing. Untrusted policies: spacer. This does not establish human skill balance.

Autopilot candidates in default: aegis (35/36 masher wins against skilled policies), morrow (27/36 masher wins against skilled policies), rei (33/36 masher wins against skilled policies), sol (35/36 masher wins against skilled policies), tala (32/36 masher wins against skilled policies), vesper (34/36 masher wins against skilled policies). These are bot results, not human verdicts.

proposed: skilled-policy bots win 9.3% (20/216 completed bouts; 0 draws), 81.5 percentage points behind mashing. Untrusted policies: spacer. This does not establish human skill balance.

Autopilot candidates in proposed: aegis (34/36 masher wins against skilled policies), morrow (26/36 masher wins against skilled policies), rei (34/36 masher wins against skilled policies), sol (35/36 masher wins against skilled policies), tala (33/36 masher wins against skilled policies), vesper (34/36 masher wins against skilled policies). These are bot results, not human verdicts.

rules: skilled-policy bots win 8.8% (19/216 completed bouts; 0 draws), 82.4 percentage points behind mashing. Untrusted policies: spacer, reader. This does not establish human skill balance.

Autopilot candidates in rules: aegis (35/36 masher wins against skilled policies), morrow (27/36 masher wins against skilled policies), rei (33/36 masher wins against skilled policies), sol (35/36 masher wins against skilled policies), tala (33/36 masher wins against skilled policies), vesper (34/36 masher wins against skilled policies). These are bot results, not human verdicts.

Default → proposed changes skilled-policy win rate by 0.0 percentage points (n=216 default, n=216 proposed). Seeds and matchup schedule are paired; this is descriptive, not causal proof about human play.

The main conclusion is that these policies do not demonstrate an advantage for skilled play against mashing. Weak policies limit conclusions about humans. Spacer barely attacks while waiting for bait; turtle is vulnerable to capture. Improve and revalidate those policies before using their outcomes to justify balance changes. All results remain visible, including failures.

## Samples and runtime

- Quick: **2,268 bouts**, one seed, all 21 distinct bot pairs × 36 fighter pairs × 3 modes; alternating seats. **79.8s** in the clean timing run. An earlier concurrent test-suite run took 124.4s and missed the target; `quick-contended.log` preserves that result. Run quick alone on this Mac.
- Mirrored check: **4,536 bouts**, `--full --seeds=1`, both seats for every matchup. **150.3s**. This is one seed, not the default eight-seed full preset; uncertainty remains. The quick and mirrored datasets overlap and must not be added as independent samples.
- Skill-versus-masher: **216 completed bouts per mode** in the mirrored run. Sanity: **72 bouts per policy per mode** versus random. **Zero censored bouts** in both saved reports.

Bot | Default wins / 72 | Rules wins / 72 | Proposed wins / 72 | Sanity flags
---|---|---|---|---
masher | 68/72 | 67/72 | 68/72 | none
spacer | 3/72 | 3/72 | 1/72 | default, rules, proposed
timer | 49/72 | 46/72 | 46/72 | none
reader | 45/72 | 44/72 | 45/72 | rules
turtle | 23/72 | 6/72 | 5/72 | default, rules, proposed
zoner | 58/72 | 55/72 | 54/72 | none

Sanity threshold: lower bound of a 95% Wilson interval for strict wins exceeds 50%; draws are non-wins. Matchups/seeds are correlated, so this is a screening heuristic. Reports contain per-match data, mode/fighter skill gaps, grid, payoff, whiffs, guard outcomes, distance, move variety, endings and source hashes.

- [Quick report](../../skill-lab/2026-10-28/report.md) · [JSON](../../skill-lab/2026-10-28/report.json)
- [Mirrored report](../../skill-lab/2026-10-28/full/report.md) · [JSON](../../skill-lab/2026-10-28/full/report.json)
- [Definitions and commands](../../../docs/SKILL_LAB.md)

## Verification

**661/661 unit tests pass**, via `PATH=/usr/local/bin:$PATH npm --script-shell=/bin/bash test` (`unit-tests.log`). The final visible-state projection also passed the 18 targeted skill-lab tests (`observation-tests.log`). Default-vs-main simulation fingerprint stays identical; observing all six fighters leaves their state identical to unobserved games each tick. Deterministic seeds, delayed perception, 30 Hz masher edges, neutral/directional action mix, real deflect/chip hooks, fixture whiffs/captures, option variety and bounded storage are covered.

Saved reports independently checked: full matrix sizes, unique jobs, all three modes, matching source hashes, no censored results, damage attribution sums, distance-frame totals and punished-whiff bounds.

Browser checks:

- **Real WebGL renderer:** default option unchecked; training with `?stats=1&balance=proposed`; three real attack presses across 30 observed input frames; both-player stats; export and dashboard import. No page/console errors. `browser-report-1793191141090.json`. Early dashboard pictures from that run predate the corrected neutral-tap bot mix; use the final captures below for findings.
- **Completed-round UI integration:** real `main.js` and combat, with renderer stubbed and frame callbacks accelerated to spare the Mac’s software renderer. A complete rules-mode duel recorded 100 damage by the CPU, persisted one completed round, exported it and reopened it in the dashboard. No page errors. This validates UI/storage integration, not normal-speed animation. `completed-round-ui-1793191527272.json`.
- **Final dashboard:** mirrored report, quick-versus-mirrored comparison, metrics, distance charts, light/dark, 390px phone width without body overflow; no page errors. `final-dashboard-1793192272953.json`. All final captures were opened and inspected.

Capture | Evidence
---|---
Final mirrored findings | [Summary](final-both-seat-summary-1793192272953.jpg)
Both-seat vs quick | [Comparison](final-both-seat-vs-quick-1793192272953.jpg)
Payoff / guard / whiffs | [Metrics](final-metrics-1793192272953.jpg)
Distance and option variety | [Distance](final-distance-1793192272953.jpg)
Phone / light theme | [Phone](final-phone-light-1793192272953.jpg)
Real renderer training stats (earlier compact table styling) | [Training](training-stats-1793191141090.jpg)
Completed-round stats with final spacing (renderer stub) | [Result](completed-round-ui-1793191527272.jpg)

## Limits / handoff

- Default stats remain off. `?stats=1` is explicit opt-in. Last 50 completed rounds persist; training exports are segments. The dashboard is excluded by the public Pages workflow.
- Whiff rates cover **basic strikes and launchers**, not projectile expiry or every special geometry. Interrupted windups are not whiffs; blocked launchers are contacts.
- Damage-source attribution is best effort for simultaneous/projectile contacts; unresolved sources are visible. Most-used-move damage share can be understated by those unresolved sources. Damage per attack press includes captures/specials, so it is not damage per executed jab.
- Read-only diagnostic events live outside `m.events` and match state: block, perfectGuard, damage, captureStart, captureBreak. They include the projectile reflection/barrier paths. No hitboxes, timings, move values or input rules change.
- Normal-speed human skill verdict is still Adam’s. The system measures outcomes; it does not establish that these heuristic bots are expert players.
