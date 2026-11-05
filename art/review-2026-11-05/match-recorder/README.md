# MATCH-RECORDER

`record=1` records the actual inputs of both players, including the built-in CPU, and reconstructs their combat exactly. It saves inputs rather than video. Replay analysis exports positioning and combat data for Claude’s overlay; this branch adds only the replay transport controls. Default gameplay and Claude’s model/animation files are untouched.

Status: **Review, awaiting Adam’s verdict**. Branch `codex/match-recorder`, based on controls-view `338534e`. Adam’s selected side controls are included.

## Play and record

Serve this worktree, not the main checkout:

```sh
cd ~/rift-worktrees/match-recorder
python3 -m http.server 4220 --bind ::
```

- [Combined preview with recording](http://localhost:4220/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&controls=side&record=1)
- [Replay page](http://localhost:4220/dist/replay.html)
- [Synthetic example loaded into replay](http://localhost:4220/dist/replay.html?file=../art/review-2026-11-05/match-recorder/sample-replay.json)

Play a CPU duel, local versus, or arcade bout. The badge shows the input-frame count. Each result screen offers **Download replay**. A first-to-two bout contains all of its rounds; each round checkpoints the same saved replay. Rematches and a new arcade opponent start another replay. Pause offers a partial/practice download and recording continues after resuming. Exiting/restarting also saves the segment already played. Guided lessons suspend recording because their lesson script changes simulation setups outside the normal input path; their badge says so.

Storage is per browser **origin**: `localhost:4220` and `127.0.0.1:4220` do not share recordings. Downloads work on either. Up to 20 files are retained; the oldest are evicted to keep the serialized list below 1,800,000 characters (at most about 3.6 MB of UTF-16 data, leaving space for the existing options/labs). If a single file exceeds that budget, or storage is blocked/full, the result still offers its in-memory download and explains the failure. There is a one-hour / 216,000-input-tick safety limit; reaching it ends recording without stopping combat. Interrupted tab/browser sessions are not autosaved every frame: the last completed round or explicit pause checkpoint survives.

## Replay

Choose a downloaded JSON file, drag it onto the page, select a replay stored on this origin, or use `replay.html?file=<URL>`. Play/pause, single-input-frame step and the seek bar use the recorded input sequence. Seeking rebuilds from the start so WeakMap-based preview settings are recreated correctly. Large seeks may take a moment on this Mac.

```sh
node scripts/skill/replay.mjs /path/to/match.json
# Optional existing output directory:
node scripts/skill/replay.mjs /path/to/match.json /tmp
```

The CLI rejects incompatible schema/builds, stale installed build metadata, modified settings/switches and corrupt run counts before playback. It verifies each round’s final HP, winner, phase, simulation tick, input tick, remaining time and simulation-state digest. It writes `<name>.events.json` (all input frames) and `<name>.summary.json` only after the entire replay verifies. The same existing tournament telemetry observer runs alongside the positioning observer.

The replay must use the matching source build. A newer build intentionally rejects an older file; keep its original checkout/artifact. `build.hash` covers the app modules/vendor/style. `build.commit` is the checkout HEAD when prepared, with `workingTreeDirty` indicating uncommitted changes; the content hash is authoritative. It is not a claim that an uncommitted working tree equals that commit. This integrity digest detects accidental edits, not cheating or malicious file authors.

Replay executes `update()` only. It does not rerun the CPU RNG: its final rival-relative inputs are already in the file. Initial seeds and difficulty remain recorded for context. AI scheduler/RNG internals are excluded from the final state digest, as they do not participate in input-driven playback. Fighters, commands, timers, projectiles, cinematics, pressure state and the input/combat clocks are included.

## File format (schema 1)

| Field | Meaning |
| --- | --- |
| `kind`, `schema` | `rift-match-replay`, format version 1 |
| `build` | Source hash, preparation HEAD, dirty flag |
| `createdAt`, `bindings` | UTC file date and physical-key bindings at session start |
| `inputTicks`, `completed`, `integrity` | Total consumed input frames, completed bout flag, accidental-edit digest |
| `rounds[]` | Independent createMatch rounds, in order |
| `rounds[].fighters/mode/difficulty/initialSeed` | Fighter indices, game mode, CPU difficulty, initial seed; `seedWasExplicit` preserves absence versus explicit seed |
| `rounds[].stage/arena/round/winsBefore` | Arcade stage, actual rendered arena, round label and prior score |
| `rounds[].config` | Full URL query/list (including unknown switches), recognized switch values, normalized settings, materialized balance/local tuning payload |
| `rounds[].configDigest` | Settings/switch integrity check |
| `rounds[].runs[]` | `{frames, inputs: [p1,p2], raw: [p1,p2]}`; one run repeats exactly this many input ticks |
| `runs[].raw` | Physical held key codes, pre-mapping merged input and controller axes/buttons; CPU/training inputs identify their source |
| `rounds[].result` | Verified HP/winner/clocks/state digest, including partial segments |

All buttons and analog axes are retained, not rounded. Runs combine only if both final inputs **and** both physical snapshots match. Input ticks continue during hitstop, while combat ticks freeze. Pauses/intro/KO ceremony wall time is excluded. Raw held keys are sampled at the tick; `mappedFrom` preserves the drained keyboard queue/pad snapshot, which can differ from the currently held keys after very fast queued taps. Replay consumes the final input and never remaps it through a camera.

The browser uses the normal game renderer, stage and recorded control scheme’s camera. Camera can be changed for review. Playback is deterministic combat, not a pixel-identical movie: audio, intro/result/KO ceremony time, random decorative particles/shake, asynchronous model-loading time and actual browser frame pacing are not recorded. In particular the final KO still does not run a separate presentation clock for the complete collapse. The underlying final HP/state is verified. No hitbox/rules/timing changes are introduced.

## Data for Claude

`events.json.frames[]` includes both clocks, round, input/raw snapshots, frozen state, cinematic phase, current live projectiles and per-player:

- Move key/name, kind, startup/active/recovery phase and zero-based frame of total; move-start distance and facing are separate events. `whiff` uses the same completed basic strike/launcher windows as tournament telemetry. Interrupted moves are not whiffs. `meleeCheck`, `burstContact`, damage/block/perfect-guard, capture start/break and guard/step-start events are retained.
- Hitstun/blockstun in remaining input-independent simulation frames (rounded up), raw seconds and explicit jump/get-up/knockdown/bounce/step posture windows.
- x/z, facing, velocity in world units/second, distance and **both** reach-relative BANDS, inside-my/his-reach and between-reaches flags.
- Centre distance, boundary gap for the actual ring radius or rectangle, unwrapped angle around the rival from round start, and current locomotion.
- Defender forward/lateral offset for a startup/active attack, reach/width tests and shape type. Line/cone/radial/Burst shapes are distinguished. Projectile moves include projected spawn paths using their own speed/lifetime/spread; live projectiles have their current path data. `inside: null` for projected projectiles deliberately does not predict a future collision with a moving target. The combat observer’s `meleeCheck.inside`/contact events remain authoritative for actual resolution, including special area patterns.

`summary.json.rounds[]` contains the existing tournament telemetry plus per-player positioning: BANDS time/share and damage in each band, voluntary walking toward/away, who closed/opened space before each exchange (contact event), knockback distance toward the edge attributed to its attacker (`edgePushes`, world units), edge hits/traps/escapes, circling radians, sidestep outcomes, first-action habit tables and per-contact heat-map coordinates. Each player’s hit positions identify dealt/taken and damage/block so consumers can filter them.

Thresholds are shared with tournament measurement: tournament edge ≤0.5, pin ≤0.05. Replay also reports the requested ≤1 edge zone. Times count advancing simulation frames, excluding hitstop repeats. A trap is an edge visit with damage; an escape exits the one-unit band without damage. A sidestep outcome covers its travel and recovery, follows an attack that starts during the step, and separates leaving a linear lane, still taking a hit and being hit by a tracking move. These are descriptive counters, not proof a particular action caused the result.

`frameAdvantage.nominal` follows the balance lab’s convention: stun minus remaining active/recovery, excluding shared hitstop and assuming no chain/cancel. Morrow Strike 1 on ordinary block is **−15**. `frameAdvantageResolved` separately reports the difference between the first grounded ready states actually observed afterward; chains, interruptions and later actions can change that value. It is not an unconditional punish guarantee. Unfinished windows remain unresolved at the end of a segment.

## Verification and captures

Verification results and final build/source audit are recorded alongside this README. The synthetic example is clearly labelled; it is not one of Adam’s matches. Its 17.7 seconds contains 1,064 input ticks / 1,002 combat ticks and takes about **58 KB** as compact replay JSON, versus about **2.45 MB** for the expanded frame analysis. Actual sizes vary with controller analog motion, button changes and duration; storage uses the compact inputs only.

The browser smoke compares recording off/on for identical physical input, downloads and verifies the file in Node, checks import/play/pause/step/seek/backward seek/end verification, stored replay reload, wrong-build rejection and URL loading, and captures real graphic models at desktop and phone widths. Input equality runs use a renderer stub; the replay checks/captures use the actual renderer. Captures check transport layout and loaded models, not normal-speed combat feel. The early smoke attempts caught an occupied port serving the old branch and a test’s unguarded wait before module initialization; they are not gameplay findings. Final evidence identifies the successful build.

Remaining limitations: no historical-build migration or replay server; no visual analysis overlay; seeks rebuild from frame zero; guided setups are excluded; a replay is not video; this branch has not promoted any preview to default or merged gameplay to main.


Final local verification: **757 / 757 tests pass**, 105 files; default fingerprint unchanged. Build `05d0ecfdabc3`. [Audit](audit.json), [browser results](browser.json), [synthetic replay](sample-replay.json), [summary](sample-summary.json), [selected event frames](sample-frames.json), [automated browser match](browser-match.json). Both replay examples are synthetic test input, not Adam’s recorded play.

| Capture | State | Review |
| --- | --- | --- |
| [Desktop](replay-desktop-1793888669264.jpg) | Paused at input frame 200 / 1479 | Actual Tala/Morrow graphic models and arena, transport and seek bar visible; inspected. |
| [Phone](replay-phone-1793888669264.jpg) | Verified round end, 390px wide | Controls wrap without horizontal overflow; inspected. KO ceremony clock omitted, so this is a combat endpoint rather than a finished defeat-pose shot. |

Browser off/on comparison: **1,427 combat ticks** each, final HP **0 / 92.86**, identical coordinates. The recorder contains **1,479 input frames** (including hitstop), and Node plus browser independently verify the resulting replay. Wrong-build rejection and URL loading pass with zero page errors. A typical automated browser bout of 24.65 seconds takes about **36 KB**; the more input-varied synthetic example takes about **58 KB** for 17.7 seconds. These are examples, not a fixed compression ratio.

Cloud verification: [run 42045156831](https://github.com/Tusingw29/rift-duel/actions/runs/42045156831) **passed** on implementation `cbdfe60`. All 757 tests, release preparation, fixture generation, Node replay and browser smoke pass. [Cloud check](cloud-check.json), [cloud browser](cloud-browser.json). Local/cloud scripted match outcomes, HP, positions and tick counts match exactly.
