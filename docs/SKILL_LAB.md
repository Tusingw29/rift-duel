# Skill lab

Measurement only, built on the unmerged `codex/balance-local` preview. No combat values, input decisions, physics, character models or animation poses change. The default game keeps stats off. Diagnostic hooks use a WeakMap outside match state; they do not add to gameplay events or replay state and observer errors cannot interrupt combat.

## Run and review

From this worktree:

```
node scripts/skill/tournament.mjs --quick
node scripts/skill/tournament.mjs --full
python3 -m http.server 4203 --bind 127.0.0.1
```

Open `http://localhost:4203/dist/skill-lab.html`. “Load local tournament” opens `art/skill-lab/2026-10-28/report.json`; the file controls accept other dated reports or live exports. A and B compare side by side. On phones they stack. Light/dark is local to the page. The Pages workflow excludes the dashboard HTML/JS from the upload. This branch is not merged or deployed.

`--quick` runs one seed, all 21 unordered bot pairs, all 36 ordered fighter pairs, all three modes: **2,268 bouts**. Seats alternate across matchups; individual matchup seat bias needs a full run. `--full` runs both seats with eight seeds by default (**36,288 bouts**). Override with `--seeds=N`, `--delay=15`, `--workers=4`, `--out=path`. All rounds use the existing 60-second round option. They end by the actual simulation's KO/timeout rule, not an artificial HP-lead proxy. A safety cap at 300 seconds of input time marks a bout censored; unfinished bouts never count as wins. The two-minute quick target depends on machine load. Full runs can take tens of minutes on this Mac.

Reports include the code commit plus SHA-256 hashes of measurement/combat inputs, exact configuration, every match, summaries and metric rollups. Changing measurement definitions requires a new report; do not compare unlike definitions silently.

## Live play

Open `http://localhost:4203/dist/index.html?stats=1` (or enable **Options → Show match stats**, then start a new round). `?stats=1` enables only stats for that page; it changes no combat settings. Add `&balance=rules` or `&balance=proposed` for the separately labelled tuning previews.

Stats appear in each round result, including the last round of a match. In training or a live bout, Pause → Match stats gives an on-demand snapshot. Each record is a round or training segment, not a combined best-of series. Export JSON includes up to 50 saved completed rounds; on-demand export appends the current segment. The storage key is `rift-skill-matches`. Storage failure does not stop play/export. Both players are recorded; the UI does not pretend a local human/CPU match is a bot tournament. Dashboard “Load saved matches” works on the same origin/port.

## Bots and reaction contract

Every bot returns `neutral()`-compatible input. No bot receives the actual match. Each receives an explicitly whitelisted copy of visible positions, HP, stocks, guard, airborne state, animation/move phase, known roster reach and visible projectile positions. The snapshot arrives **15 input frames later**, configurable. Initial frames are neutral; the delay includes hitstop just as wall-clock human perception does. There is no access to opponent input, queued actions, invulnerability timers or future frames. Seeded random choices are independent of game RNG.

- Random changes held choices at 5 Hz. It is a baseline, not a human model.
- Masher alternates attack press/release every frame (30 rising presses/sec), changes directions every 10 frames and never guards intentionally. Holding attack every frame would charge instead of mash.
- Spacer waits outside reach, approaches/pursues visible recovery, reacts to close active attacks.
- Timer responds to visible threats with guard; presses counters between threats. Perfect guard and third-hit reversal still depend on the actual delayed timing and simulation rules.
- Reader stores the last 20 visible choice transitions, pressures guard with capture and approaches zoning. It has no input oracle.
- Turtle holds guard and acts in visible safe recovery windows.
- Zoner tries to stay at range, fires and uses retreat/stock options.

These are small heuristic policies, not trained experts. A poor policy is **not evidence that spacing/timing/reading cannot work**. Sanity checks keep every policy visible and mark it untrustworthy unless the lower end of a 95% Wilson interval for wins versus random exceeds 50%. Draws count as non-wins. Correlated seeds and roster matchups mean these intervals are screening heuristics, not independent-trial confidence guarantees. One seed is exploratory. No bot has been hand-tuned to produce a desired balance verdict.

## Definitions and limits

- **Skill gap:** strict wins by spacer/timer/reader versus masher. Report also shows signed skilled win share minus masher win share; draws remain separate. Every rate carries completed-bout sample size.
- **Mash payoff:** all HP damage (including chip, captures and specials) divided by rising attack presses. This is not damage per attack move. Action presses are also stored. Zero presses yields null, never infinity.
- **Whiff:** a basic strike/launcher completes its active window without contact. Guard/parry contact is not a whiff; interrupted startup is not a whiff. Projectile expiry and every special's geometry are not yet classified as misses. The dashboard and report explicitly scope the denominator to basic melee.
- **Whiff punish:** a damaging contact occurs while the defender is still recovering from that tracked whiff. At most one punished count per missed move. It measures timing, not whether the attacker consciously reacted to it.
- **Distance:** from each fighter's reach: close <1.5; inside reach <reach−0.35; tip through reach; whiff band through reach+0.7; mid <7; far otherwise. Counters use advancing simulation frames, excluding hitstop. Seconds = frames/60.
- **Guard:** exact block/parry/chip and capture-break outcomes come from passive diagnostic hooks at resolution. Capture-through-guard means the defender visibly guarded when the capture began. The incoming capture does not need a held guard input to remain captured.
- **Option variety:** damage share of the most frequently started move in each player-bout (ties lexical), averaged across damaging player-bouts. Move counts include cancelled/interrupted attempts. Projectile and simultaneous-source attribution is best effort; unresolvable sources are labelled, never silently assigned to the last attack. Unknown-source damage is displayed separately. This can understate a named move's share.
- **Duration:** input frames /60 includes hitstop; simulation frames are also stored. KO cause is the last diagnostic damage-source label, or timeout. Training/unfinished samples are excluded from win rates.

## Read-only instrumentation

`dist/skill/observer.js` registers a single optional listener per match. `combat.js` reports `block`, `perfectGuard`, `damage`, `captureStart`, and `captureBreak` after the existing decisions. HP damage is the actual clamped delta, not nominal overkill. No payload is inserted into `m.events`. Existing default-vs-main replay fingerprint and observed-vs-unobserved state equality tests protect the gameplay boundary.
