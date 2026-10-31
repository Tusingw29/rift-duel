## Verification and visual handoff

- Full suite: **728 tests passed**, 103 files, zero failures/cancellations (`node scripts/run-tests.mjs`). This includes the unchanged default simulation fingerprint, default observed/unobserved tick equality, preview observer equality, narrow-path boundary checks, tracking contact, close-grab escape, delayed neutral bot attacks and real recovery punishment.
- Fixture archive: **12,852** attempts, 58 isolated move variants, six fighters, both directions, gaps 1.5/2/3, every startup offset, Horizon and linear. `fixtures.json.gz` retains individual damage/contact outcomes; `fixture-summary.json` lists all escape offsets.
- Local Chromium keyboard checks cover no switch, Horizon, linear, and linear + heavy Morrow. They select Morrow/training and verify actual 14f/1.8-unit sidesteps. These input checks stub rendering to control simulation time. Separate captures load the real graphic rigs and renderer; no model or animator files changed.
- `browser.json` records all four input queries, all 12 real-render captures, model status, HP and cinematic state, with no page errors. `comparison-sheet.jpg` puts Horizon on the left and linear on the right. Each picture advances 20 input ticks; hitstop means the simulation tick is not always 20 (the jab hit freezes at tick 11, the sweep at 16). The images are not aligned by identical animation time.

| Captures | What I checked | Remaining weakness |
| --- | --- | --- |
| `jab-*-side-*.jpg`, `jab-*-lock-*.jpg` | Horizon loses 7.44 HP; linear remains at 100. Both real rigs load. | Lock-on foreshortening makes the sideways separation hard to see; the run pose is not a clear fighting shuffle. |
| `sweep-*-side-*.jpg`, `sweep-*-lock-*.jpg` | Returning Sweep hits in both rulesets. Its wide sword pose differs from the jab. | One contact image cannot establish the readability of the sweep wind-up. At 1.5 units, sufficiently early steps can still clear this finite cone. |
| `capture-*-side-*.jpg`, `capture-*-lock-*.jpg` | Horizon enters capture and displays the capture ring; linear stays free with no cinematic. | The unchanged grab pose and camera do not explain the exact collision width to a player. |

I inspected the full comparison sheet. The collision distinction is verified; animation readability is **awaiting Adam’s normal-speed verdict**. Claude owns the shuffle and horizontal-swing presentation. The fixed startup aim can disagree with the visual impression of a broad sword pose; this simulation task does not replace that animation handoff.

Play locally (project-root server on **4210**, separate from Claude’s server):
- [Linear attacks](http://localhost:4210/dist/index.html?move=v2&arena=ring&burst=v2&step=linear)
- [Linear + heavy 15f Morrow jab](http://localhost:4210/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&morrow=jab15heavy)
- [Results dashboard](http://localhost:4210/dist/linear-lab.html)

If the server stops: `python3 -m http.server 4210 --bind 127.0.0.1 --directory /Users/adamwilliams/rift-worktrees/sidestep-linear`.

No gameplay merge or deployment to default/main. The shared board is the only main-branch update.

### Final cloud run and data audit

[GitHub checks, run 41147503306](https://github.com/Tusingw29/rift-duel/actions/runs/41147503306) passed all three jobs: 10f study, 15f study and verification (full tests, fixtures and real-render browser captures), on measured commit `e06dcea`. `cloud-browser.json` records the independent cloud capture checks.

`art/skill-lab/2026-10-30-sidestep-linear/audit.json` verifies all 12,960 completed bouts, every measured source hash, counter bounds, and exact reproduction of all 2,880 archived Horizon baseline bouts. The initial run is retained under `initial-9f6c94c/`: its tracking-instance counter missed six interrupted-contact rows. The final rerun fixes that counter; every outcome and every other telemetry field is identical. The earlier cancelled run `41146956544` was not used for conclusions.

Dashboard browser checks pass at 1200px and 390px widths: both delays, all four policy selections, all result tables, no page errors and no body overflow. Wide tables scroll within their containers on phones. The reviewed captures are listed in `dashboard-browser.json`.
