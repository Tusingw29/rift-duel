# RANGED-CAPTURE review (2026-11-06)

Branch `claude/ranged-capture` (from `codex/match-recorder` `6a4e39a`). Comparison builds only: every change is behind a URL switch, the default fingerprint is unchanged, and no permanent nerf is decided. Built by Claude at Adam's request (normally Codex's lane); no animation, rig or pose files touched.

## Plain answers

**1. Can a human punish a ranged capture today, and how?** Only when it's thrown from close-ish range. A circle takes 13 frames to appear and the thrower stays stuck until about frame 55 (`timing.txt`).
- Thrown from about **4 units**: the circle arrives around frame 29. Break it with a fresh guard tapped just before contact, and you get **26 free frames**. Pursuit and Burst punish in all 36 fighter pairings, and a shot in 24.
- Thrown from **6+ units** (what Adam did against Sol): a timed break leaves **9 free frames**, and a sidestep 12 frames after the circle appears leaves **5**. From 18 frames on, the thrower is free first. In that window only **your own capture circle** reaches the thrower, and only because guard can't stop circles today. Strikes, shots, pursuit and launchers are all too slow or blocked.
- A **close capture that misses or is broken** is punishable by everything (40 recovery frames on a miss, 0.6 s stun on a break).
- So a ranged capture is close to safe from 6+ units. It is not a free win: it can be broken, dodged or traded with a counter-circle.

**2. Is ranged capture still worth using under each switch?** Bot study, circle-camper against four other bots, 2,880 bouts per mode (`study.md`):
- Baseline: the camper wins **77.9%**; circles do 93% of its damage.
- `rangedcap=flat` (no extra damage at range): **75.7%**, within luck of baseline. The bonus damage is not what makes circles strong.
- `rangedcap=guard` (held guard stops circles): **68.2%**. Against the one bot that guards (punisher), the camper falls from **77.4% to 38.6%**, and circles do 0.4% of its damage. The other bots never hold guard as a circle arrives, so they're unaffected.
- `rangedcap=guard,flat`: **66.4%**, the same story.
- Verdict: under `guard`, circles stay worth throwing against someone who doesn't guard, and stop working against someone who does. That's the change that matters; `flat` alone does little.

**3. Does `cpu=v2` defend without becoming a wall?** It defends better, and it is nowhere near a wall. Real game CPU on normal, 180 bouts per bot per mode:
- **Circles that capture the CPU:** 64.7% at baseline, **49.5%** with `cpu=v2`, 45.6% with `rangedcap=guard,flat` added.
- **Capture breaks:** 1.61 per bout at baseline, 2.15 with `cpu=v2`.
- **Wins against the camper:** still about 0–2%. It sidesteps, breaks or counters, but it has no plan for closing the distance.
- **Against the close-range masher:** wins rise from 6.7% to 14.4% (could be luck), and it blocks 32% of attacks that reach it (28.5% at baseline).
- **Whiff punishes:** almost never fire. The masher seldom whiffs within the CPU's reach, and telemetry only counts strike/launcher whiffs.
- All odds are named starting guesses in `dist/cpu-v2.js`. Adam's normal-speed verdict decides whether this is too weak or right.

## Switches
- `rangedcap=guard`: a held guard stops a ranged capture circle like a shot: 0.12 s block stun, 0.35-unit push, no chip. A fresh timed guard still breaks it first. Close captures still beat guard in every mode.
- `rangedcap=flat`: ranged captures deal 15 × power at mid and far range (instead of ×1.1 / ×1.25).
- `rangedcap=guard,flat`: both.
- `cpu=v2`: the CPU waits a reaction delay (12 frames on normal), then picks one plan per incoming circle: sidestep away from its line (walk without move=v2), a timed fresh guard, or a counter-circle. It also blocks some strikes (40% chance on normal), sometimes taps guard against close captures, and punishes whiffs it can reach. No frame or damage data changed.

## Telemetry labels (current build only)
Ranged captures are now `system-capture-mid` and `system-capture-far`; close ones keep the balance-tuning key `system-capture-close-`. Sol's unresolved fire is credited to `stock-ember-fan`, and Burst damage to the super that caused it (`system-sunfall-scripture`). A new `rangedCapturesGuarded` counter counts circles stopped by guard. Throws are labelled by the distance when capture is pressed; damage uses the distance when the circle appears 13 frames later, so the two can differ near 6 units.

## Replays
Adam's two replays and the build they were recorded on (`05d0ecfdabc3`, JS + style.css) are frozen in `tests/fixtures/`. `tests/frozen-replay.test.mjs` verifies them unchanged. `replay-compare.txt` re-runs the same input streams on the current build: both verify, HP, outcomes and positions are identical, and every changed field is a label, a field derived from a label (dominant move, its damage share, KO cause), or the new counter.

## Evidence
- Cloud run 42279562042: 775 tests pass; browser smoke 10/10 on the default URL and on `move=v2&arena=ring&burst=v2&step=linear&rangedcap=guard,flat&cpu=v2&record=1`. `controls=side` is left out of the smoke URL because the smoke checks press W and D expecting lock-on movement, and side controls remap those keys.
- `punish.txt` / `punish-guard.txt`: capture punish fixture, all 36 pairs, 7 scenarios × 6 responses.
- `timing.txt`: circle timing at 4, 6 and 8 units.
- `study.md` and `raw/`: bot and CPU studies.
- Scripts: `scripts/ranged-capture/` (`punish`, `timing`, `bots`, `cpu`, `replay-compare`, `report`); bot policy `scripts/skill/bots/circle-camper.mjs`.

Limits: bots don't play like Adam. Feel, readability and whether `cpu=v2` is fun need Adam's normal-speed verdict.
