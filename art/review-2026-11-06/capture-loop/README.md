# CAPTURE-LOOP — comparison preview

**Circle repetition still beats the real CPU most of the time.** Recovery protection lowers the circle landing ratio and creates substantially more free-action time, but is not a complete anti-spam fix. The 3 / 4.5-unit end resets alone do not help; 3 units can make the repeated circle connect more often. All variants remain opt-in; there is no default promotion or gameplay merge.

**Non-repeated captures still work.** All 864 isolated captures against standing, unguarded opponents landed with their expected damage. Against the real CPU, the spaced-capture policy also still lands circles: with guard/flat + CPU v2, 39.6% at baseline, 30.7% with recovery protection, and 31.6–33.1% with protection plus a close reset. These are pooled event ratios, not independent-trial statistical claims or an expert-human test.

Branch `codex/capture-loop`, based on `claude/ranged-capture` `0d6f9c8`. Status: **Review, awaiting Adam's normal-speed verdict** after verification. Build `685ffe6307e8`. Claude's CPU decision policy, model, rig, animation, recovery timings, move data and hit damage are untouched.

## Main results

Real Normal CPU, all 36 ordered fighter pairs, five seeds, delayed visible-state circle-camper (15 input frames). Table below includes `rangedcap=guard,flat&cpu=v2` in every row. Each row has 180 completed repeat-policy bouts.

| Extra capturewake variant | CPU wins | 95% range | Circles landed / thrown | CPU ready frames / round |
| --- | --- | --- | --- | --- |
| base | 3/180 (1.7%) | 0.0–4.8% | 1259/2701 (46.6%) | 535.4 |
| inv | 6/180 (3.3%) | 1.1–7.1% | 1169/4253 (27.5%) | 994.0 |
| close3 | 2/180 (1.1%) | 0.0–4.0% | 1253/2133 (58.7%) | 367.1 |
| close45 | 2/180 (1.1%) | 0.0–4.0% | 1257/2563 (49.0%) | 497.0 |
| inv,close3 | 13/180 (7.2%) | 2.8–12.2% | 1108/3897 (28.4%) | 926.3 |
| inv,close45 | 15/180 (8.3%) | 4.4–13.3% | 1148/3998 (28.7%) | 931.7 |

Every variant's CPU-win range overlaps its matched baseline: **could be luck**. Ranges conservatively envelope Wilson and 2,000 ordered-fighter-pair block resamples with the five seeds kept together. They are exploratory and have no multiple-comparison correction. Do not select a default from the CPU wins alone.

The lower landing ratio is only part of the story: `inv` allows more throws because fewer captures start a cinematic. Captures confirmed per bout fall only from 7.0 to 6.5 (1259 to 1169 across the 180 bouts), so the CPU can still lose despite more breathing room. This is why the report shows raw counts, action availability and wins together.

The reset is exact **at cinematic resolution**, not a promise that fighters stay together during the subsequent knockdown. In a deterministic Tala/Morrow fixture, holding retreat after the hit opens the 3-unit gap to about 11.5 units by the defender's first ready frame, 118 frames later; the 4.5-unit gap becomes about 12.25. [Fixture](spacing-fixture.json). The task's proposed reset therefore does not ensure the next neutral exchange starts in strike range. No extra attacker lock, recovery-time change or second teleport was added to conceal that result. Resetting closer can also shorten the next circle's flight into the still-vulnerable fall; the close3 repeat landing ratio increases in the study.

[Full study tables](study.md) include repeat and spaced policies for all 18 combinations (each wake variant with old CPU, CPU v2, and CPU v2 + guard/flat), both sides' damage, down-throw shares, guarded/consumed circles and close-capture substitution. [Summary JSON](summary.json), [compressed raw bouts](study.json.gz). **6,480 bouts, zero censored**, 479.1 seconds locally. The 540 repeat-policy baseline bouts reproduce Claude's archived outcomes and both sides' damage exactly: [audit](baseline-reproduction.json).

## Switches

- `capturewake=inv`: flying capture circles are consumed on overlap with a launched/falling, bounced, knocked-down, rolling or rising target, or during the 20 advancing simulation frames starting with standing. High airborne targets retain the existing height collision gate. Hitstop does not spend grace. This is **circle-only**: strikes, shots and direct close grabs follow their existing rules. A close grab can still beat held guard. The grace is tracked outside player state and rebuilt by the recorder's replay configuration.
- `capturewake=close3` (`close` alias): a landed mid/far capture puts the pair exactly 3 units apart when its cinematic resolves.
- `capturewake=close45`: the same, at 4.5 units.
- `capturewake=inv,close3` / `inv,close45`: combine both rules. Choosing both distance values is rejected.

Reposition preserves direction and midpoint when feasible, translating the pair inside the active ring/rectangle as needed. It removes only the queued recoil displacement that would otherwise widen the configured gap by another half unit. Damage, stun, air time, facing and attack recovery remain unchanged. KO victims keep their original collapse position: there is no next exchange to reset. Ordinary close captures never trigger the reset.

A consumed circle can overlap a target already protected by generic invulnerability; the diagnostic count does not individually prove an additional prevented hit. Capture wake protection has no newly authored visual aura or timing cue; Claude can bind feedback to the passive `captureWakeAvoid` event later. Authored cinematics are unchanged, so the post-cinematic relocation can read as an abrupt positional cut. This is a rule prototype and needs Adam at normal speed.

## Play

Server is bound to IPv6/IPv4 on **4224**, serving `~/rift-worktrees/capture-loop`:

```sh
cd ~/rift-worktrees/capture-loop
python3 -m http.server 4224 --bind ::
```

Every link below records and uses side controls, Move V2, the ring, linear lanes, Burst V2, guard/flat ranged capture and CPU v2:

- [Matched control](http://localhost:4224/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&controls=side&rangedcap=guard,flat&cpu=v2&record=1)
- [Recovery protection](http://localhost:4224/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&controls=side&rangedcap=guard,flat&cpu=v2&capturewake=inv&record=1)
- [3-unit reset](http://localhost:4224/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&controls=side&rangedcap=guard,flat&cpu=v2&capturewake=close3&record=1)
- [4.5-unit reset](http://localhost:4224/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&controls=side&rangedcap=guard,flat&cpu=v2&capturewake=close45&record=1)
- [Protection + 3 units](http://localhost:4224/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&controls=side&rangedcap=guard,flat&cpu=v2&capturewake=inv,close3&record=1)
- [Protection + 4.5 units](http://localhost:4224/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&controls=side&rangedcap=guard,flat&cpu=v2&capturewake=inv,close45&record=1)

## Verification

- Focused boundary/timing tests cover down/get-up/roll/bounce, the exact stand frame, twenty advancing frames, hitstop freeze, unchanged shot/close-grab behavior, rectangle/ring endpoints, surviving target/KO cases, and record/replay for individual/combined switches.
- **13 original replay files** (11 batch-2 files and two 22:12 files) are frozen losslessly as gzip fixtures, with SHA-256 of their uncompressed original bytes. A 35-module transitive snapshot from `0d6f9c8` retains the original build `6f15287e3290`; the original build/switch validation and exact end-state checks pass. No header relabelling. Archive is about 300 KB of source + compressed input, and the prior 05d0 frozen replay tests remain intact.
- The balance-lab source-location index needed regeneration after the combat import shifted line numbers. Numeric defaults and all 116 moves are verified unchanged; only source references changed.
- Browser checks exercise six game URLs, actual capture endpoints, partial recording/download and Node replay verification. Actual renderer captures use Tala/Morrow graphic models, both Duel and lock-on cameras. [Browser results](browser.json).
- [Isolated captures](isolated.json): 864/864 land; [source/default audit](audit.json). **808/808 unit tests pass** (109 files); local browser checks pass. Cloud verification is recorded below when complete.

## Captures inspected

| Files | State and reading | Limitation |
| --- | --- | --- |
| `base-after-{duel,lock}-1794005189862.jpg` | Existing distant endpoint after a landed capture | Static frame, not a timing verdict |
| `close3-after-{duel,lock}-1794005189862.jpg` | Pair is 3.00 units apart inside the arena; victim is still falling | Relocation can pop and attacker may retreat before wake-up |
| `close45-after-{duel,lock}-1794005189862.jpg` | Pair is 4.50 units apart | Lock-on compresses the visible gap |
| `inv-wake-{duel,lock}-1794005189862.jpg` | Rising target remains free of capture; overlapping circle is gone | No newly authored cue for the extra grace |

## Reproduce

```sh
node scripts/run-tests.mjs
node scripts/capture-loop/study.mjs
node scripts/capture-loop/report.mjs
node scripts/capture-loop/isolated.mjs
node scripts/capture-loop/spacing-fixture.mjs
```

The real CPU drives only player 2. Every ordered fighter pairing is covered, but seats cannot be mirrored without changing that API. The spaced policy uses the same movement as circle-camper, requests captures only every 240 delayed input frames, and skips named visible recovery animations; it is not a full normal-fight policy. Both use the same visible-state delay rules. Ready frames are a conservative beginning-of-tick grounded-actionable count, excluding commitments, recovery, hitstop and cinematics; this differs from prior study definitions and their totals should not be mixed. Throws are actual spawned circles, not capture button presses or interrupted wind-ups. A passive spawn event includes circles cancelled immediately by an opposing circle in that same frame; counting only live post-tick projectiles misses those throws. The corrected counter leaves all 6,480 bout outcomes, damage, clocks and action availability identical. Landing ratios pool dependent events and are descriptive. Normal-speed fun, tell readability, controller feel and ordinary fights remain Adam's verdict.
