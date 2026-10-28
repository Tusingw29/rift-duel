## Verification and delivery

- **688 tests passed**, zero failures: `PATH=/usr/local/bin:$PATH npm --script-shell=/bin/bash test`. The controlled equal-rate test covers all three policies, five seeds and 6,000 identical idle snapshots per seed/policy with 15f delay. Offensive decisions match exactly across rules, including the eligible denominator. Split taps are counted once in each relevant category, and metadata never reaches the simulation input.
- The retained default-defence test verifies a timed guard; split uses capture without guard. The passive observer replay tests and default fingerprint pass. Fingerprint: `c1fc5ebc1cb77d6845830c4c67fa56d416bf079f78d16c51fac4e1b8d049071a`. Combat, move, fighter, hitbox, rig and animation files were not changed.
- [Cloud tournament](https://github.com/Tusingw29/rift-duel/actions/runs/40737151754) succeeded at measured commit `bdff062`. **100,800 bouts, zero censored**, 20 archives with 5,040 bouts each. Source hashes match current measured code; offensive and break accounting reconcile. [Archive audit](archive-audit.json), [workflow metadata](workflow.json).
- **Tournament workflow wall time: 8m 25s**, including checkout/upload. Summed per-mode elapsed time: **768.7s**, with the two delay jobs in parallel; this is not summed worker CPU time.
- **Live normalized offensive-rate intervals overlap in all 30 paired default/proposed comparisons** (three policies × five option combinations × two delays). These intervals retain all fighter pairs and both seats of each seed as one bootstrap block. The five fixed seed streams yield observed rates around 1.45–1.57%, rather than exactly the configured 1/60 (1.667%); the seed-block intervals include that configured probability. Equal policy does not force equal game opportunities or move-start totals.
- Timer, reader and punisher pass the random sanity screen in all modes. Spacer remains visible and untrusted; it is excluded from the primary three-policy findings.
- Browser checks exercise real main-loop configuration, keyboard commands and manual text with a stubbed renderer for deterministic stepping. All three requested URLs keep dedicated U immediate; capture startup is 18f with slow; brief D+J is a normal attack under hold while held D then J captures. Dashboard checks cover ten modes at both delays, both directions of capture damage, offensive and break counters, confidence/overlap labels, old-study access and 390px layout. No page errors. [Browser evidence](browser.json).
- Browser checks do not establish physical-controller behavior or normal-speed feel. There are no new visual assets or renderer changes in this task. Earlier archives are preserved; no gameplay merge or public default promotion.

## Live offensive-rate check

Rates are common-lottery attempts divided by eligible decision frames, across both mashers. Bands envelope Wilson and whole-seed bootstrap uncertainty; with only five seeds they are descriptive checks. The exact equal-observation test is the direct test of equal policy.

Delay | Option suffix | Bot | Default rate [95%] | Proposed rate [95%] | Comparison
--- | --- | --- | --- | --- | ---
10 | base | timer | 1.567% [1.202–1.973] | 1.553% [1.188–1.978] | overlap
10 | base | reader | 1.552% [1.186–1.966] | 1.543% [1.190–1.964] | overlap
10 | base | punisher | 1.547% [1.182–1.969] | 1.532% [1.168–1.950] | overlap
10 | +slow | timer | 1.565% [1.196–1.986] | 1.519% [1.153–1.939] | overlap
10 | +slow | reader | 1.558% [1.193–1.978] | 1.510% [1.151–1.923] | overlap
10 | +slow | punisher | 1.538% [1.188–1.972] | 1.507% [1.153–1.936] | overlap
10 | +hold | timer | 1.558% [1.175–1.981] | 1.517% [1.149–1.940] | overlap
10 | +hold | reader | 1.548% [1.185–1.955] | 1.533% [1.150–1.971] | overlap
10 | +hold | punisher | 1.531% [1.171–1.947] | 1.525% [1.155–1.949] | overlap
10 | +hold,slow | timer | 1.542% [1.185–1.974] | 1.509% [1.141–1.940] | overlap
10 | +hold,slow | reader | 1.530% [1.174–1.946] | 1.515% [1.160–1.954] | overlap
10 | +hold,slow | punisher | 1.516% [1.153–1.949] | 1.495% [1.141–1.930] | overlap
10 | +deliberate,slow | timer | 1.537% [1.189–1.957] | 1.520% [1.155–1.940] | overlap
10 | +deliberate,slow | reader | 1.517% [1.162–1.935] | 1.514% [1.170–1.943] | overlap
10 | +deliberate,slow | punisher | 1.514% [1.158–1.940] | 1.502% [1.153–1.925] | overlap
15 | base | timer | 1.462% [1.134–1.857] | 1.459% [1.113–1.865] | overlap
15 | base | reader | 1.470% [1.124–1.876] | 1.467% [1.115–1.908] | overlap
15 | base | punisher | 1.452% [1.120–1.845] | 1.462% [1.119–1.858] | overlap
15 | +slow | timer | 1.516% [1.159–1.948] | 1.500% [1.179–1.891] | overlap
15 | +slow | reader | 1.529% [1.163–1.961] | 1.510% [1.155–1.935] | overlap
15 | +slow | punisher | 1.533% [1.194–1.942] | 1.513% [1.198–1.900] | overlap
15 | +hold | timer | 1.501% [1.172–1.891] | 1.470% [1.135–1.874] | overlap
15 | +hold | reader | 1.488% [1.140–1.896] | 1.485% [1.133–1.889] | overlap
15 | +hold | punisher | 1.500% [1.169–1.892] | 1.464% [1.120–1.858] | overlap
15 | +hold,slow | timer | 1.507% [1.153–1.937] | 1.497% [1.163–1.920] | overlap
15 | +hold,slow | reader | 1.532% [1.156–1.980] | 1.534% [1.170–1.971] | overlap
15 | +hold,slow | punisher | 1.522% [1.164–1.952] | 1.505% [1.175–1.927] | overlap
15 | +deliberate,slow | timer | 1.486% [1.147–1.909] | 1.496% [1.155–1.927] | overlap
15 | +deliberate,slow | reader | 1.512% [1.128–1.970] | 1.517% [1.161–1.952] | overlap
15 | +deliberate,slow | punisher | 1.512% [1.165–1.938] | 1.493% [1.152–1.919] | overlap

## Playtest links

- [Default + slow](http://localhost:4203/dist/index.html?grab=slow)
- [Default + hold, slow](http://localhost:4203/dist/index.html?grab=hold,slow)
- [Proposed + hold, slow](http://localhost:4203/dist/index.html?balance=proposed&grab=hold,slow)
- [Equal-grab dashboard](http://localhost:4203/dist/skill-lab.html?study=grab-equal)
- [Exploratory proposed + slow](http://localhost:4203/dist/index.html?balance=proposed&grab=slow)

Restart the server if necessary with `python3 -m http.server 4203 --bind 127.0.0.1` from `~/rift-worktrees/skill-lab`. **Review, awaiting Adam’s verdict.** Branch `codex/skill-lab`; no default promotion.

## Captures inspected

- [Desktop](dashboard-desktop-1793218319032.jpg): all ten modes visible, primary three-policy results first, old aggregate retained, win counts and confidence ranges readable.
- [Phone](dashboard-phone-1793218319032.jpg): 390px layout has no page overflow; the wide table scrolls horizontally. Long group labels wrap and remain easier to compare on desktop.

Screenshots verify report layout, not normal-speed combat feel.
