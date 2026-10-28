# BALANCE-PASS — risk, defense and fighter identity

Owner Codex · `codex/balance-local` · **Review, awaiting Adam’s normal-speed verdict.** Preview only; production game values and character/animation modules are unchanged. This extends the earlier BALANCE-LOCAL implementation on the same branch.

## Play and compare

- [Full proposal](http://localhost:4202/?balance=proposed) — rules plus Rei and Aegis.
- [Game-wide rules only](http://localhost:4202/?balance=rules).
- [Full proposal with flowing effects](http://localhost:4202/?balance=proposed&energy=flow).
- [Untuned game](http://localhost:4202/).
- [Balance lab](http://localhost:4202/balance-lab.html), [standalone Frame Codex replacement](http://localhost:4202/frame-codex.html).

Direct proposal links work without saved tuning and never read or replace your saved draft. In the lab, “Load game-wide proposal” and “Load full proposal” save editable drafts; “Undo preset load” restores the preceding draft. “Play saved draft” uses `balance=local`. Reload an open game after editing.

The server serves `dist` from `~/rift-worktrees/balance-local` on port 4202. If stopped: `python3 -m http.server 4202 --bind 127.0.0.1 --directory dist` in that worktree. Port 4198 and a separately hosted lab have separate storage: export/import JSON to transfer edits.

## Implemented package

| Item | Behavior |
| --- | --- |
| Miss penalty | Proposed +7f recovery after a basic strike’s entire active window misses. Hits, blocks and late-window contacts retain their recovery. Applied once, to chain strikes 1–3; defensive reversal and non-strike moves excluded. Interrupted/parried moves do not acquire an extra recovery timer. Adjustable 0–30f in the lab; +5/+6/+7 comparisons supported. |
| Block stun | Proposed 12 frames, using the existing per-match rule override. Default remains the original .12 seconds (the lab displays 7f). |
| Split guard | Proposed on, reusing the implemented preview rule. Guard handles attacks, including the existing projectile reflect. Capture break requires a separate fresh capture tap while not guarding and free or starting that capture. Guard+capture together does not defend both. |
| Rei | Proposed reach 2.85 and speed 5.6. |
| Aegis | Proposed shot speed 14; all three basic-shot chain recoveries 14; reach 2.5. Specials retain their own timings. |
| Vesper | No reach or power buff. Her control tools are now included in an explanatory score. |

Normal move recovery in the lab is still hit/block recovery. The new **Miss recov** column and Matchups estimates add the miss penalty separately; Changes/export include `missPenalty` as a rule, not a blanket recovery change.

## Checked estimates versus simulation

| Scenario | Estimated reaction-punishable Strike 1 whiffs |
| --- | ---: |
| Baseline | 0 / 30 |
| +5f miss penalty alone | 6 / 30 |
| +6f alone | 12 / 30 |
| +7f alone / game-wide proposal | 17 / 30 |
| Full proposal, including fighter changes | 16 / 30 |

The full package changes reach and movement, so it does not retain precisely the same pairing count. These remain estimates from the lab’s reaction/reach assumptions, not measured guarantees. Normal attack selection still becomes a projectile when started outside reach; no spacing-selection change was slipped in. The simulation tests make real strikes miss by walking the defender out of reach after startup.

With the game-wide rules applied, Rei’s original six-score budget is 53; her trim brings it to 49. Aegis’s Zoning rises 34 → 57, while reach scores 33 after the trim. These are scorecard outcomes, not proof of competitive balance. The blocked-chain finding was reworded to accurately describe the estimate rather than promise every exchange is a guaranteed gamble.

## Control score, version 1

Source data comes from actual special/technique definitions, not fighter names or prose keywords. The extractor records hold duration, ring/trap identity, radius, lanes, lifetime, speed and area behavior. Snare hold duration is read from `combat.js`; no copied stale stun constant.

The score is a deliberately visible heuristic, not win rate or damage budget:

- **Hold, 0–30:** best non-stock hold duration, normalized to 0.85s.
- **Coverage, 0–20:** best area capability, projectile radius normalized to 1.4, or multi-lane coverage.
- **Ring persistence, 0–25:** ring lifetime normalized to 2.6s, moderated by travel speed.
- **Traps, 0–25:** a non-stock trapping/snare tool.

Each component takes the best base/alternate tool; duplicate variants and stock tools do not inflate it by accumulation. Vesper scores **93 = 30 hold + 13 coverage + 25 rings + 25 traps**. This shows available control capabilities; it does not measure how often a trap lands, matchups, escape options or execution cost. Weight calibration requires playtesting. Control helps the identity label read “Controller,” but is excluded from the unchanged six-score **core budget**, avoiding a misleading budget increase simply from adding a seventh metric.

## Both lab builds and the remaining external dependency

`dist/frame-codex.html` is a self-contained 124 KB replacement generated from the exact repository lab, formulas, presets and roster. It does not maintain a second set of numbers. Rebuild with `npm run balance:standalone` after extracting/restamping; the sync test fails if stale. It works at the local link above and can be uploaded as a standalone HTML page. Its play links point to the local preview and its note explains export/import when hosted on another origin.

**The original external hosted Frame Codex has not been replaced.** Its URL/source/deployment access was not supplied; Codex requested its location. The local repository lab and generated standalone replacement are implemented and tested. Do not report the old hosted copy as updated until its deployment is actually changed.

## Verification

**643 tests pass** with `npm --script-shell=/bin/bash test`. The full default trace still matches unchanged main across all six fighters and 3,600 simulation input frames. Tests cover:

- Miss versus hit/block for all six fighters, last-active-frame contact, interruption and one-time penalty.
- Exact +5/+6/+7 estimates; hit/block advantage unaffected by miss penalty.
- Live 12f block stun, grab beating guard, capture tap breaking grab, and guard+capture failing as a universal defense.
- Preset values, Vesper unchanged, baseline immutability, export/import compatibility and direct-link storage isolation.
- Source-derived Control bounds, stock exclusion and unchanged core budget.
- Standalone source/data/formula synchronization.

Browser driver `scripts/review/balance-pass.mjs` passed with no console/page errors: real preset buttons and Undo, editable miss rule, standalone parity, phone width, actual training startup with `balance=proposed&energy=flow`, and browser simulation of a defender retreating out of a Tala jab. That jab records **+7f, 23f recovery, 35f total**, while saved corrupt local tuning remains untouched by the direct proposal. [Browser report](browser-report-1793189399860.json).

## Inspected captures

| Capture | Reading |
| --- | --- |
| [Game-wide checks](game-wide-checks-1793189399860.jpg) | Rules-only proposal and updated scorecard. |
| [Full roster](roster-control-1793189399860.jpg) | Rei and Aegis changes with separate Control bars. |
| [Vesper detail](vesper-control-detail.jpg) | Controller identity, unchanged core budget, explicit component weights; full package shows 16 estimated punish pairings. |
| [Standalone copy](standalone-frame-codex-1793189399860.jpg) | Embedded lab and its cross-origin storage explanation. |
| [Phone](phone-control-1793189399860.jpg) | Preset controls wrap at 390px without page-width overflow; the content is long and requires scrolling. |
| [Playable proposal](proposed-training-1793189399860.jpg) | Training match loads with a clearly labeled proposal banner. |

Visual review confirms readable controls/status, not normal-speed balance or animation quality. The Control heuristic and actual spacing/chain choices are the main remaining playtest questions. No physical controller check was performed.
