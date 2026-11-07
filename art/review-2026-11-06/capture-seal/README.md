# CAPTURE-SEAL — rules prototype for review

**1. Does grab spam still win against the real CPU?** Ranged circle-camper lost all 180 bouts against Normal CPU with the full combination. The matched capture-loop baseline CPU won 6/180 (3.3%; 95% range 1.1–7.1%); full won 180/180 (100%; 97.9–100%). Those ranges do not overlap. Against the requested close-grabber, CPU wins rose 3/180 → 118/180 (65.6%; 57.2–73.9%). Close spam still wins 62 bouts: this does not establish that every repeated strategy or human setup is solved.

**2. Can every fighter walk out on reaction?** Yes in the isolated fixture: 15f delayed walking, every fighter, no dash. The slowest has 7 warning frames left. This assumes the defender is free to move, not already committed, stunned or blocked by the other fighter. Normal CPU reaction is its existing 12 simulation frames; study opponents use 15 input frames. Bot geometry awareness does not prove human tell readability.

**3. Does the escape dash arrive in time?** All 180 fixtures pass: every caster/escaper pair at 6, 8, 10, 12 and the full 20-unit default-ring diameter, with activation delayed 29f after escape. All arrive within strike range with at least 15 caster commitment frames remaining, above the required 12. No new dash invulnerability. In real bouts, an existing projectile can interrupt the dash, and an already-interrupted caster need not remain committed. A player still has to choose the approach and attack; the dash itself does no damage.

**4. Are grabs still worth using in mixed play?** The mixed bot won 108/180 against full Normal CPU and landed 52 grabs (49 close,3 ranged), with captures and wins for all six fighters. This supports useful close grabs; it does not prove raw ranged seals are good openers against an aware opponent. The CPU win change against mixed play is within overlapping ranges: **could be luck**.

Branch `codex/capture-seal`, implementation `c377b58`, verified source `dcfe427`, content build **60835d58ed62**. Based on capture-loop `111c0bd` as requested. **Review, awaiting Adam's normal-speed verdict. Default gameplay unchanged; no gameplay merge to main.**

**Presentation handoff:** the game has a temporary text warning/reward readout. The world-space closing-ring VFX, casting hold and escape cue belong to Claude and are **not implemented in the production renderer here**. Eight actual-renderer review stills add labelled diagnostic collision rings in the test page only. Do not judge the final visual feel from this placeholder. [Renderer contract](../../../docs/CAPTURE_SEAL_HANDOFF.md).

## CPU comparison

Each row has 180 bouts per opponent:36 ordered fighter pairs ×5 seeds, real Normal CPU in P2, opponent delayed 15 input frames,60-second rounds. All use Move V2/ring/Burst V2/linear and wake protection. Baseline and single-switch rows also use guard/flat; full uses Adam's exact combination without guard/flat. CPU comparisons include the legal defence update with new grab/seal switches; they are package comparisons, not a clean ablation of CPU improvements. Skilled-bot comparisons do not run the CPU.

| Mode | CPU vs circle-camper | CPU vs close-grabber | CPU vs mixed |
| --- | --- | --- | --- |
| baseline | 6/180 · 3.3% (1.1%–7.1%) | 3/180 · 1.7% (0.0%–4.8%) | 66/180 · 36.7% (30.0%–43.9%) |
| locked | 6/180 · 3.3% (0.6%–7.1%) · could be luck | 52/180 · 28.9% (20.6%–37.8%) | 85/180 · 47.2% (38.3%–55.6%) · could be luck |
| reach | 5/180 · 2.8% (0.6%–6.3%) · could be luck | 62/180 · 34.4% (26.1%–42.8%) | 78/180 · 43.3% (35.0%–51.1%) · could be luck |
| slow16 | 7/180 · 3.9% (1.1%–7.8%) · could be luck | 61/180 · 33.9% (27.2%–41.1%) | 69/180 · 38.3% (31.1%–45.6%) · could be luck |
| seal | 167/180 · 92.8% (85.6%–98.3%) | 71/180 · 39.4% (28.3%–51.7%) | 91/180 · 50.6% (42.2%–58.3%) · could be luck |
| dash | 180/180 · 100.0% (97.9%–100.0%) | 75/180 · 41.7% (30.0%–53.9%) | 91/180 · 50.6% (43.3%–57.8%) · could be luck |
| damage | 7/180 · 3.9% (1.1%–7.8%) · could be luck | 1/180 · 0.6% (0.0%–3.1%) · could be luck | 70/180 · 38.9% (32.1%–46.2%) · could be luck |
| full | 180/180 · 100.0% (97.9%–100.0%) | 118/180 · 65.6% (57.2%–73.9%) | 72/180 · 40.0% (33.1%–47.3%) · could be luck |

Ranges conservatively envelope Wilson and 2, 000 fighter-role-pair block resamples, retaining seeds/seats together. Overlap with that group's baseline is labelled could be luck. They are exploratory; no multiple-comparison adjustment. Zero wins/losses in a finite sample does not imply impossibility.

`close-grabber` implements the exact requested plan: walk to its own strike reach+.5, then grab. That stopping point can be outside the new reach+.3 threshold if the rival stays still, so it is not a pure close-only policy. Confirmed context counters in the raw archive expose this: full vs CPU has 542 close captures and 26 ranged captures by that bot. Do not rename all of them close grabs.

## Skilled policies versus mashers

Five seeds, all 36 ordered fighter pairs, both seats:360 bouts per row. Both policies read only delayed visible observations. They now receive public seal warnings and escape rewards through the same queue; no future state, pending inputs or RNG is exposed. The forward+Attack escape command is deliberately declared; other attacks remain direction-neutral.

| Policy / opponent | Delay | Baseline wins | Full wins | Comparison |
| --- | --- | --- | --- | --- |
| stepper / masher | 10f | 127/360 · 35.3% (28.1%–43.3%) | 144/360 · 40.0% (31.7%–49.2%) | could be luck |
| stepper / masher | 15f | 55/360 · 15.3% (10.0%–21.7%) | 77/360 · 21.4% (16.7%–26.7%) | could be luck |
| stepper / masher-all | 10f | 128/360 · 35.6% (28.3%–43.6%) | 184/360 · 51.1% (42.5%–60.3%) | could be luck |
| stepper / masher-all | 15f | 84/360 · 23.3% (17.2%–30.0%) | 140/360 · 38.9% (30.6%–47.2%) | ranges do not overlap |
| punisher / masher | 10f | 342/360 · 95.0% (92.2%–96.9%) | 346/360 · 96.1% (93.3%–98.3%) | could be luck |
| punisher / masher | 15f | 197/360 · 54.7% (48.3%–61.1%) | 236/360 · 65.6% (57.8%–73.1%) | could be luck |
| punisher / masher-all | 10f | 310/360 · 86.1% (82.2%–89.4%) | 332/360 · 92.2% (89.0%–94.7%) | could be luck |
| punisher / masher-all | 15f | 186/360 · 51.7% (46.1%–57.2%) | 285/360 · 79.2% (74.7%–83.6%) | ranges do not overlap |

At 15f, punisher versus masher-all improves51.7% →79.2%, with non-overlapping ranges. Punisher versus the original masher improves54.7% →65.6%, but the ranges overlap. Stepper still loses often; do not equate these policies with expert players. No test forces a win rate.

[Every mode/group with capture damage share, free-action time and dash counters](study.md) · [summary JSON](summary.json). All 8 raw `study-<mode>.json.gz` files are retained beside this README. **27, 360 bouts; zero censored;285.3 summed study-worker seconds** (parallel cloud jobs, not elapsed wall time). [Source and verification audit](audit.json). All 180 baseline circle-camper bouts exactly reproduce the previous Linux/Node22 capture-loop archive's winners, HP, input/simulation clocks and both damage totals.

## Switch behavior

- `grab=locked`: classify close/ranged at actual move startup. A target leaving close reach makes the grab whiff through its full 40f recovery; it never turns into a projectile. Ranged classification/context also remains ranged if the target approaches.
- `grab=locked,reach`: own strike reach+.3, replacing3.1 for that match. Close back/front context still uses the defender's look direction, including extended Morrow close reach.
- `grab=locked,slow16`: close startup 16f; ranged remains13f. Combined `grab=locked,reach,slow16` supports a15f reaction guard break. The guard must remain active through contact; CPU now does this instead of releasing its fresh press too soon.
- `seal=on`: a startup-ranged capture locks a3.0-radius ring to the target's startup position and closes to 1.5 over 54 warning frames. Target-centre containment includes the 0.5 body allowance. Leaving the current closing boundary permanently resolves an escape. A stationary target is checked once at closure; no invisible early hit and no tap growth. One live seal per caster, interruption cancels, simultaneous successful seals clash.
- A fresh timed guard breaks it. Held guard only blocks it with `rangedcap=guard`. Air/invulnerability and `capturewake=inv` still prevent contact, including the exact standing frame. Seal alone preserves legacy fallback for a grab that began close; use locked to remove it.
- `seal=on,dash`: escaping grants one30f opportunity for a fresh double-tap toward or toward+Attack. Straight14units/s travel stops .05 inside own strike reach, to avoid the strict melee-versus-shot boundary. It bypasses ordinary step recovery, but cannot bypass air, stun or attack recovery. No free hit or added invulnerability.
- The caster stays committed through resolution and recovery; with the reward, recovery is extended to reserve a last-window dash and punish opportunity. This is a substantial miss cost, not a cosmetic ring swap. The requested6–12-unit fixtures give caster move totals109–138f; all 180 including20 units are in the budget table below. No guard or unrelated action during that commitment. Once recovered, ordinary guard works normally.
- `capdmg=closehigh`: multipliers front 1.15/back 1.3/mid.9/far.75. This explicit option takes precedence over rangedcap=flat; guard blocking remains independent. Default numbers in the balance lab stay unchanged.

CPU v2 uses fixed lateral walking out of the caster-to-seal line after its difficulty reaction delay, rather than orbiting the seal itself. It takes the earned dash with 25/65/90% easy/normal/hard chances and attacks on arrival when free. It attempts legal reaction breaks and punishes close-grab misses. It cannot cancel already committed attacks to defend. The old CPU behavior/RNG remains on the baseline without new grab/seal flags.

## Fixture evidence

| Escaper | Reaction delay | Escape warning frame | Warning frames spare |
| --- | --- | --- | --- |
| aegis | 15f | 42 | 12 |
| rei | 15f | 39 | 15 |
| tala | 15f | 38 | 16 |
| morrow | 15f | 47 | 7 |
| sol | 15f | 40 | 14 |
| vesper | 15f | 43 | 11 |

[All 180 dash budgets](dash-budgets.md) list initial gap, escape tick, activation delay, flight frames, caster total/frame and actual remaining punish time. [Raw fixtures](fixtures.json) also cover228 close-break cases: each defender,13/16f startup and every press delay 0–18. Guard held from delay 2–13 breaks13f capture; delay 5–16 breaks16f capture (input-clock convention documented in the fixture). The break window is12, not enlarged to make the test pass.

A real browser local-versus sequence uses P2 capture, P1 side-control walking to escape, fresh double-D, then J to punish. It arrives with 55f reserve and deals6.12 jab damage; its partial recording replays exactly. This is one input scenario, not a timing claim for every pair.

### Close-high damage

Nominal damage against a full-life target:15 × fighter power × context multiplier, before any separately selected balance overrides or remaining-HP clipping.

| Fighter | Front | Back | Mid | Far |
| --- | --- | --- | --- | --- |
| aegis | 17.250 | 19.500 | 13.500 | 11.250 |
| rei | 15.525 | 17.550 | 12.150 | 10.125 |
| tala | 17.595 | 19.890 | 13.770 | 11.475 |
| morrow | 21.390 | 24.180 | 16.740 | 13.950 |
| sol | 14.835 | 16.770 | 11.610 | 9.675 |
| vesper | 17.767 | 20.085 | 13.905 | 11.588 |

### Mixed-play check by fighter

| Mixed fighter | Wins /30 against full CPU | Grabs landed | Actual capture damage |
| --- | --- | --- | --- |
| aegis | 20/30 | 4 | 69.00 |
| rei | 18/30 | 12 | 177.98 |
| tala | 14/30 | 9 | 142.84 |
| morrow | 21/30 | 12 | 208.84 |
| sol | 17/30 | 6 | 76.70 |
| vesper | 18/30 | 9 | 129.25 |

## Verification and inspected captures

**839/839 tests pass**,110 files, locally and in [cloud run 42316657307](https://github.com/Tusingw29/rift-duel/actions/runs/42316657307) on `dcfe427`. Default fingerprint, sandbox determinism, observed/unobserved equality,13 frozen batch-2/22:12 replay files and the older frozen build tests pass. Numeric default roster/moves/fighters unchanged; source-location references and their standalone lab were refreshed after combat hooks moved lines. [Audit](audit.json).

Cloud and local fixture JSON agree exactly. All study source hashes match this checkout. Browser checks pass on 8 configurations, nine record/download/replay cases including the keyboard escape, and 8 real-renderer diagnostic captures, with no page errors. [Local browser evidence](browser.json). Physical controllers and final visual readability at normal speed are not verified.

The first cloud attempt had invalid workflow YAML at the IPv6 bind command and ran no jobs. It was fixed. The next attempt was cancelled when the ready-time counter and maximum-distance coverage were corrected; the final run above passed. No failed gameplay assertion was hidden by rerunning the same code.

| Evidence | Inspected reading | Remaining weakness |
| --- | --- | --- |
| `seal-warning-{duel,lock}-1794010030054.jpg` | Fixed target-centred shrinking diagnostic geometry, both fighters visible | Test-page geometry only; final in-game ring still needed |
| `seal-escape-{duel,lock}-1794010030054.jpg` | Victim is outside the actual boundary and has a reward | Final escape cue/hold animation pending |
| `seal-dash-{duel,lock}-1794010030054.jpg` | Run motion moves toward the caster while the old centre stays fixed | Run is a placeholder, no new dash animation |
| `seal-arrival-{duel,lock}-1794010030054.jpg` | Strike-range arrival with caster commitment remaining | Close camera foreshortens separation; normal-speed verdict pending |
| `keyboard-punish-1794010030054.jpg` | HUD/input verification after a landed jab | Renderer stub in this input screenshot; not visual-quality evidence |

Caster poses can look held/stiff when recovery is extended. Resolved seals may remain in the array during cinematics until cleanup resumes; render fading by `resolved` age/status, not list membership. Neither the debug rings nor the temporary text HUD are claimed final art. Tell readability and whether the reward feels too generous remain Adam's normal-speed verdict after Claude's visual pass.

## Localhost comparisons — all record

The server is running on 4226 from `~/rift-worktrees/capture-seal`, bound toIPv6/IPv4. Restart with:

```sh
cd ~/rift-worktrees/capture-seal
python3 -m http.server 4226 --bind ::
```

- [Capture-loop baseline](http://localhost:4226/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&controls=side&record=1&cpu=v2&capturewake=inv&rangedcap=guard,flat)
- [Locked close grab](http://localhost:4226/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&controls=side&record=1&cpu=v2&capturewake=inv&rangedcap=guard,flat&grab=locked)
- [Locked + own reach](http://localhost:4226/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&controls=side&record=1&cpu=v2&capturewake=inv&rangedcap=guard,flat&grab=locked,reach)
- [Locked + 16f close startup](http://localhost:4226/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&controls=side&record=1&cpu=v2&capturewake=inv&rangedcap=guard,flat&grab=locked,slow16)
- [Closing seal](http://localhost:4226/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&controls=side&record=1&cpu=v2&capturewake=inv&rangedcap=guard,flat&seal=on)
- [Closing seal + escape dash](http://localhost:4226/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&controls=side&record=1&cpu=v2&capturewake=inv&rangedcap=guard,flat&seal=on,dash)
- [Close-high damage](http://localhost:4226/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&controls=side&record=1&cpu=v2&capturewake=inv&rangedcap=guard,flat&capdmg=closehigh)
- [Full combination](http://localhost:4226/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&controls=side&record=1&cpu=v2&capturewake=inv&grab=locked,reach,slow16&seal=on,dash&capdmg=closehigh)

[Diagnostic 3D review page](http://localhost:4226/tests/capture-seal-review.html) · [Claude renderer handoff](../../../docs/CAPTURE_SEAL_HANDOFF.md).

## Reproduce

```sh
node scripts/run-tests.mjs
node scripts/capture-seal/fixtures.mjs
# Run each mode on cloud; no existing result directories are overwritten.
node scripts/capture-seal/study.mjs --mode=baseline
# Repeat for locked, reach, slow16, seal, dash, damage, full (five seeds by default).
node scripts/capture-seal/report.mjs
```
