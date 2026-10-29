## MOVE-V2 — live-relative walking and grounded steps

Owner: **Codex** · Branch: `codex/move-v2` · Status: **Review, awaiting Adam’s normal-speed verdict** (2026-10-29). Branch starts at skill-lab `d7ae48d`; no gameplay merge or default promotion.

- [x] Explicit `?move=v2`: live rival-relative walking, wall tangent projection and clean double-tap grounded dash/backdash/sidestep with 6f guard-locked recovery. Playtest distances/timings centralized; no added invulnerability. Existing double-tap attack/jump commands preserved during travel.
- [x] Facing/turn-delay and back-throw context preserved. No rig/pose/animation files edited; existing run animation reused. Note: existing attack aim snapshots the rival at startup, rather than using lookX directly; this behavior was preserved.
- [x] Circle retreat: all 120 free-space frames in both seats below 0.000002 degrees (Morrow fixture). Tala reaches the wall and follows its tangent: those clipped frames remain in the report rather than being hidden. Old axis clamps already preserved diagonal tangents.
- [x] **6,480 bouts**, default/v2/v2+slow, 10/15f, both mashers plus random sanity, all fighter pairs, mirrored seats, five seeds; zero censored. Stepper observes delayed visible state only. Per-fighter sidestep matrix covers strikes, shots, captures and free base/alternate specials, including radial areas.
- [x] **699 tests pass**, default fingerprint unchanged, observer equality tick for tick. Browser keyboard checks cover all four directions and URLs; real game captures and desktop/phone results dashboard pass with no page errors. Source hashes match all six final archives.
- Findings: v2 win gains all **could be luck**; v2+slow vs masher-all at 10f improves **16.9pp**, ranges do not overlap. Whiff punishment does not improve consistently. Sidesteps evade straight shots but remain vulnerable to close strikes/grabs, radial areas and spread/offset shots. Normal-speed feel remains Adam’s call.
- [Full review](https://github.com/Tusingw29/rift-duel/blob/codex/move-v2/art/review-2026-10-29/move-v2/README.md) · [Results](http://localhost:4204/dist/move-lab.html) · [V2](http://localhost:4204/dist/index.html?move=v2) · [V2 + slow](http://localhost:4204/dist/index.html?move=v2&grab=slow) · [Training](http://localhost:4204/dist/index.html?move=v2&mode=training).

## GRAB-EQUAL — equal offensive capture policy

Owner: **Codex** · Branch: `codex/skill-lab` · Status: **Review, awaiting Adam’s verdict** (2026-10-28).

- [x] Common 1/60 eligible-frame offensive capture lottery for timer/reader/punisher on every rule set, with separate seeded stream. Default timed guard defence retained; split offensive tap doubles as one guess break, without a second tap. Reaction behaviour remains rule-aware and delayed.
- [x] Per-bot/opponent captures started, connected, dedicated presses, offensive attempts/opportunities and actual capture HP share; break counters retained. Controlled equal-observation decisions match exactly across five seeds; all 30 live normalized-rate comparisons overlap with seed-block uncertainty.
- [x] **100,800 bouts**, ten modes, both mashers, 10/15f, all fighter pairs, mirrored seats, five seeds; **zero censored**. Old archives preserved. Capture damage reported both ways; measured source hashes and accounting verified.
- [x] **688 tests pass**, default fingerprint and passive replay equality pass. Browser controls/manual and desktop/phone dashboard checks pass (game input fixture stubs renderer). No combat/move/fighter/hitbox/rig/animation changes; existing switches only.
- Findings: all four base proposed-vs-default comparisons **could be luck** with equal offence. At 15f slow improves the primary bots vs masher-all by **+33.5pp on default / +33.1pp on proposed** (non-overlapping ranges); original-masher gains overlap. No set satisfies the strict no-observed-10f-drop criterion. Exploratory largest 15f mean gain is proposed+slow, but its 10f original-masher drop of 2.6pp could be luck, not proof of no downside. Earlier comparisons had unequal grab attack.
- [Full review](https://github.com/Tusingw29/rift-duel/blob/codex/skill-lab/art/review-2026-10-28/grab-equal/README.md) · [Dashboard](http://localhost:4203/dist/skill-lab.html?study=grab-equal) · [Default + slow](http://localhost:4203/dist/index.html?grab=slow) · [Default + hold,slow](http://localhost:4203/dist/index.html?grab=hold,slow) · [Proposed + hold,slow](http://localhost:4203/dist/index.html?balance=proposed&grab=hold,slow).
- Measured implementation: `bdff062`; workflow `40737151754` succeeded, 8m 25s wall time. No gameplay merge or default promotion.


## GRAB-RETEST — rule-aware grab defence and hold preview

Owner: **Codex** · Branch: `codex/skill-lab` · Status: **Review, awaiting Adam’s verdict** (2026-10-28).

- [x] Rule-aware reaction and 1/60 eligible-frame guess breaks for timer/reader/punisher; passive per-bot attempt/success/waste counters. Fresh capture under split guard, timed guard under default; delayed observations only.
- [x] Opt-in `grab=hold`: eight prior input frames of down before attack; short presses stay normal attacks; dedicated capture unchanged. Eight frames is a playtest guess. Other switches compose; no default change.
- [x] **80,640 bouts**, eight modes separating rule sets and grab choices, both mashers, 10/15f, mirrored seats, five seeds; **zero censored**. Archived source hashes and break accounting verified. Older archives retained.
- [x] **683 tests pass**, default fingerprint and observed/unobserved replay equality pass. Browser game/control/manual and desktop/phone dashboard checks pass; deterministic game browser checks stub the renderer. No rig/animation or combat.js changes.
- Finding: proposed is mixed. Defence-capable group at 15f vs original masher: **40.0% → 48.9% (+8.9pp; ranges do not overlap)**; at 10f vs masher-all: **76.8% → 67.5% (−9.3pp; ranges do not overlap)**. Other base comparisons could be luck. Hold trails deliberate by 0.5–2.7pp, all overlapping; promising, not proven equivalent. Highest observed averages: default+deliberate and proposed+hold,slow, without a universal winner. Spacer remains untrusted.
- [Review and full tables](https://github.com/Tusingw29/rift-duel/blob/codex/skill-lab/art/review-2026-10-28/grab-retest/README.md). [Dashboard](http://localhost:4203/dist/skill-lab.html?study=grab-retest). [Default + hold](http://localhost:4203/dist/index.html?grab=hold). [Proposed + hold](http://localhost:4203/dist/index.html?balance=proposed&grab=hold).
- Measured implementation: `f7e0c66`; workflow `40718209050` succeeded (3m 51s wall time). No gameplay merge or default promotion.


Review branch commit: `747c5ce`.

## GRAB-OPTIONS — opt-in capture experiments

Owner: **Codex** · Branch: `codex/skill-lab` · Status: **Review, awaiting Adam’s verdict** (2026-10-28).

- [x] Independent `grab=slow,tell,deliberate,fresh` previews; combinable with balance previews. Default fingerprint unchanged. Tell is visual-only; no character/rig/animation authoring changes.
- [x] Spacer trajectory warning and recovery policy; still untrusted. Original masher retained; masher-all samples every button.
- [x] **70,560 bouts**, seven modes, 10/15f, mirrored seats, five seeds, zero censored. Both old result folders preserved. Dashboard shows confidence ranges and overlap labels.
- [x] **676 tests pass**, default replay/observer equality passes; game and dashboard browser checks pass. Captured tell in real WebGL from side and rear.
- Finding: deliberate+slow is the highest-average playtest candidate at 15f, but not proven better than deliberate alone. Trusted punisher vs masher-all **33.6% → 51.1% (+17.5pp; ranges do not overlap)**; vs original masher **41.7% → 50.3% (+8.6pp; could be luck)**. Tell needs a human verdict.
- [Evidence and links](https://github.com/Tusingw29/rift-duel/blob/codex/skill-lab/art/review-2026-10-28/grab-options/README.md). Local dashboard: http://localhost:4203/dist/skill-lab.html?study=grab-options . **No default promotion; awaiting Adam’s normal-speed verdict.**

Branch implementation/review commit: `efd90de`.


## SKILL-BOTS — validate policies before balance conclusions

Owner: **Codex** · Branch: `codex/skill-lab` · Status: **Review, awaiting Adam’s verdict** (2026-10-28).

- [x] Correct delayed projectile warning, neutral attack intent and recovery tap cadence; add reference punisher. Random and masher baselines unchanged.
- [x] Add per-bot/mode validity counters, 6/10/15f quick sweeps and mirrored 15f seed-1 run: **15,120 new bouts**. All old reports retained unchanged; dashboard compares old/new.
- [x] **666 tests pass**, default fingerprint matches main, observed/unobserved tick equivalence passes, browser dashboard smoke passes.
- [x] Report grab finding without changing it: default mirrored punisher **33/72**, original three **24.1% vs old 9.3%**; capture is largest single damage source in punisher losses (22.4% default / 28.8% rules / 30.3% proposed). Spacer/turtle remain untrusted.
- Evidence: [SKILL-BOTS review](https://github.com/Tusingw29/rift-duel/blob/codex/skill-lab/art/review-2026-10-28/skill-bots/README.md). Local: http://localhost:4203/dist/skill-lab.html?study=skill-bots . Combat/move/fighter/hitbox/animation files untouched in this task. Grab timing/visibility changes remain Adam’s separate decision. No merge to main.

Implementation commit: `48c5bc5` (branch only).


## SKILL-LAB — measured skill versus mashing

Owner: **Codex** · Branch: `codex/skill-lab` · Status: **Review — awaiting Adam’s verdict** (2026-10-28). Measurement only; default gameplay and Claude’s model/animation files unchanged. Implementation remains on branch.

- [x] Seven deterministic input-only policies with 15-frame delayed, whitelisted visible observations; no pending input/buffer/remaining-air-time access. Masher includes neutral taps and directions at 30 rising presses/sec.
- [x] All-pairs tournament for default/rules/proposed. Quick: 2,268 bouts in 79.8s alone (124.4s while the full test suite competed for CPU). Mirrored `--full --seeds=1`: 4,536 bouts in 150.3s, no censored results. Default eight-seed full preset was not run. Source hashes and sample sizes recorded.
- [x] Passive telemetry, opt-in Options / `?stats=1`, both-player round results and training snapshots, bounded 50-round storage and shared JSON export. Added out-of-band diagnostic hooks for exact damage/chip, guard, projectile deflect/barrier and capture outcomes; no gameplay events/state/timing changed.
- [x] Local skill dashboard: comparisons, mode/fighter gaps, grid, payoff, distance, guard, variety and sanity warnings; phone/light/dark. Dashboard excluded from Pages artifact.
- [x] **661 tests pass**; real-renderer training/export browser smoke, completed-round UI/storage integration (renderer stub), and final dashboard captures pass. Default-vs-main fingerprint and observed/unobserved state equivalence remain green.
- [ ] Adam’s normal-speed verdict. Skilled-policy wins versus masher: default 20/216, rules 19/216, proposed 20/216. All six fighters flag as autopilot candidates in this bot sample. **Do not infer human skill balance:** spacer and turtle fail sanity in all modes, reader in rules-only (72 random-opponent bouts per policy/mode). Improve those bots before using their losses to justify balance changes.

[Evidence and limits](https://github.com/Tusingw29/rift-duel/blob/codex/skill-lab/art/review-2026-10-28/skill-lab/README.md) · [Definitions](https://github.com/Tusingw29/rift-duel/blob/codex/skill-lab/docs/SKILL_LAB.md). Local dashboard: `http://localhost:4203/dist/skill-lab.html?report=full`; live stats: `http://localhost:4203/dist/index.html?stats=1`. No gameplay merge or Pages deployment.

## BALANCE-PASS — game-wide risk and roster identity

Owner: **Codex** · Branch: `codex/balance-local` · Status: **Review — awaiting Adam’s normal-speed verdict** (2026-10-28). Builds on playable lab preview: miss-only strike recovery, 12f block stun and split-guard preset; Rei trim, Aegis beam tuning; source-derived Control score before any Vesper buff. Owns combat/balance files, preserves character/animation work. Preview remains unmerged for normal-speed review.


Implemented proposed presets: +7f missed-basic-strike recovery only, 12f block stun, split guard; Rei reach/speed 2.85/5.6; Aegis shot speed 14, basic-shot recovery 14 and reach 2.5. Vesper stats unchanged; source-derived Control capability score added separately from the six-score budget. Repo lab and generated standalone Frame Codex use identical data/formulas. **643 tests pass**, browser review passes with no errors; default simulation fingerprint unchanged. [Evidence, exact math and limits](https://github.com/Tusingw29/rift-duel/blob/codex/balance-local/art/review-2026-10-28/balance-pass/README.md). Rules-only estimates 17/30 whiff punish pairings; full proposal 16/30. Play `http://localhost:4202/?balance=proposed`; lab `http://localhost:4202/balance-lab.html`; standalone `http://localhost:4202/frame-codex.html`. **Original hosted lab deployment pending its URL/source**, requested from Adam. Implementation remains on the review branch.

## SIM-SKILLS — Claude skills for probing and auditing simulation results

Owner: **Claude** · Branch: `claude/skills` · Status: **Review — awaiting Adam's verdict** (2026-10-28; branch `6a4c0f0`, not merged)

Tooling only, in `.claude/skills/`; no game, combat or skill-lab files change. Scripts run against a skill-lab worktree via `--root`.

- [x] `bot-probe`: bot head-to-heads across fighter pairs, both seats, delays, `default/rules/proposed`, `?grab=` options and custom bot files; win ranges, defence counters, damage in losses (about 70 bouts/s). Template `bots/breaker.mjs` breaks grabs the split-guard way
- [x] `reaction-check`: per move and delay, reactable vs guess-only answers and whiff punishes from `dist/balance/roster.json`; `--startup=` what-ifs (close capture: slack −3 at 15f, +2 with grab=slow)
- [x] `sim-audit`: 8-point flaw checklist for Codex simulation reports, verification steps, Codex prompt format
- [x] Finding for GRAB-RETEST: the breaker template landed only 2 breaks against 91 masher captures at 10f (proposed + slow), so breaking is harder than the timing suggests; cause not found yet
- [ ] **Adam's verdict**

## BALANCE-LOCAL — playable tuning preview

Owner: **Codex** · Branch: `codex/balance-local` · Status: **Review — implemented on branch** (2026-10-28). Opt-in local balance snapshot for game/sandbox, validation, visible badge and deterministic tests. Owns combat override hooks; preserve Claude animation files. Based on balance-lab; implementation stays unmerged for review.

## BALANCE-LAB — in-repo balance lab and roster data

Owner: **Claude** · Branch: `claude/balance-lab` · Worktree: `~/rift-worktrees/balance-lab` · Status: **Review — awaiting Adam's verdict** (2026-10-28; branch `6a49a77`, not merged)

A browser balance lab (like the VFX workbench, not part of the public game) that reads every fighter, move and rule from the game's code, lets Adam tune values, and exports the changes as JSON (shared with the hosted Rift Duel Frame Codex artifact) and as a plain-text task for Codex. No combat rules or timings change; Codex owns `dist/combat.js`, `moves.js`, `techniques.js`, `special-variants.js`, `stock-specials.js` and `fighters.js`.

- [x] Part 1: `scripts/balance/extract.mjs` → `dist/balance/roster.json`: 6 fighters, 116 moves, constants (hit stun 19, launch 49, block 7, chip .12, perfect guard 10, capture break 12, cancels 14/20, reversal window 6). `combat.js` literals read by named patterns with line numbers; each row names its source file. Differences from the hosted Frame Codex where the code disagrees (10 special variants are 1 active, not 4; Iron lance is a projectile; Orbit fan sums to 21) are listed in the evidence README
- [x] Part 2: `dist/balance-lab.html` + `balance-lab.js` + shared `dist/balance/formulas.js` (hosted formulas, same settings and export shape, new fighter, live checks, localStorage, JSON import/export, Codex task text with source files)
- [x] Part 3: `npm run balance:extract`, `tests/balance-lab.test.mjs` (8; roster equals a fresh extract; Tala S1 9/3/16 +1/−11, Morrow 11/3/20 −15, chain gap 11/Morrow 12, no reaction-punishable whiff), `docs/DESIGN.md` stale tables replaced by a pointer
- [x] Part 4 (proposal for Codex, not built): opt-in `&balance=local` in game and sandbox loads the lab's tuning (localStorage `rift-balance-lab` or `&balance=<json url>`) onto the match at creation, like SPACING-COMMITMENT's `m.rules`, so replay stays deterministic; `moveTiming`, damage, stats and the guard/stun literals read overrides keyed by the roster's move keys and `source` fields; a visible TUNED VALUES badge; tests: no param = main fingerprint, override frames match, replay equals step. Details in the evidence README
- [x] Browser check: Morrow Strike 1 recovery 20 → 40 in the real table flips his whiff row from 5 guess to 5 reaction punishes, the first check to "5 pairings", and the Changes tab lists it with `dist/moves.js`; persists on reload; new fighter, split guard, export/import and phone width also checked. Captures `art/review-2026-10-28/balance-lab/`
- [ ] **Adam's verdict**

## SPACING-COMMITMENT — spacing and defensive choices carry risk (opt-in switches)

Owner: **Codex** (work carried out by Claude at Adam's request, 2026-10-28) · Branch: `codex/spacing-commitment` · Worktree: `~/rift-worktrees/spacing-commitment` · Status: **Review — awaiting Adam's normal-speed verdict** (2026-10-28; branch `ec771a3`, not merged)

Make spacing and defensive choices earn something and expose something. Tune startup, recovery, reach, tracking, pushback and movement only; no damage multipliers. Everything behind URL switches (`&spacing=band|riskyshot`, `&guard=split`); default game unchanged until Adam picks. Keep whiffs never chaining, perfect guard stun and charge, projectile reflection, the third-hit reversal, fresh-guard capture breaks (in the default) and deterministic replay.

- [x] Part 1: line 100 spacing switch (`band`, `riskyshot`), one named config (`SPACING_COMMITMENT` in `dist/spacing-commitment.js`), training floor marker for reach and band edge. Playtest guesses, not tuned: band 1.0 (about a hit-1 startup + active of walking), riskyshot +4 startup / +12 recovery (near hit-2 startup and hit-3 recovery)
- [x] Part 2: measured perfect guard = guard frames 1–10, capture break = 1–12; one tap beats a hit 1 and a capture started together on 10/10 perfect-guard timings (Tala 9/10). `&guard=split`: perfect guard covers strikes and projectiles only; a capture is broken by a fresh **capture** tap (not while guarding, same 12-frame window), which loses to a strike — strike / capture / guard triangle, existing tools kept
- [x] Part 3: `scripts/review/frame-advantage.mjs` → `docs/FRAME_ADVANTAGE.md`. Every blocked hit and finish is −11 to −38 (defender free after 8 frames, no block pushback); stopping always loses (except Tala hit 1); continuing trades or is interrupted; no always-wins case for the attacker, but held guard + hit 1 dominates
- [x] Part 4: band whiffs are punishable on reaction in 0/36 pairings (31 guess-only, 5 not punishable); Tala vs Morrow needs 36 frames against his 23. Sol's shot is safe from everyone. Proposals (not applied) in the evidence README: per-fighter whiff recovery +7 to +15, block stun / pushback first, riskyshot scaled by band distance
- [x] Tests `tests/spacing-commitment.test.mjs` (10, default fingerprint matches main), 618 pass, sandbox strips and evidence `art/review-2026-10-28/spacing-commitment/README.md`
- [ ] **Adam's normal-speed verdict**

## BLENDER-VFX-ASSETS — modeled flow-preview effects

Owner: **Codex** · Branch: `codex/blender-vfx-assets` · Worktree: `/tmp/rift-ink-fx` · Status: **In progress** (2026-10-27). Synced main `8e2e80e`. Blender 3.6.23 headless only: low-poly Sol/Vesper shells, capture profile, burst and small original masks. Flow preview only; preserve default game, Claude character/rig/pose/mocap/animation and combat. Deliver branch and localhost review; **do not merge implementation to main**.

## ROSTER-ENERGY — distinct flowing signatures

Rear-camera verification follow-up (Codex, 2026-10-27): previous focused run `40470396558` passed but roster evidence was side-only. Synced Claude `a3ff8c4` WEIGHT-TRANSFER with TALA-IMPORT-AB preserved. Added explicit lock-on captures at release +4f and +16f; status **Review; awaiting normal-speed verdict**, same isolated branch/worktree. Final run 40478793913 passes; **592 tests pass**. All four rear flight samples retain visible height and shape after increasing only the flowing preview shoulder offset. Morrow early +4f is still occluded by the release pose/sword. [Evidence and exact limits](../art/review-2026-10-27/roster-rear/README.md).

Owner: **Codex** · Branch: `codex/roster-energy` · Worktree: `/tmp/rift-ink-fx` · Status: **Review; awaiting normal-speed verdict** (2026-10-27). Synced `cf56ec0`, then Claude claim `b54cf55`. Refine Morrow crimson/weight, Rei paired cuts, Sol flame and Vesper angular seals using the existing 3D preview. Inspect production effects in browser captures; preserve Claude character/rig/animation/combat work.

**579 tests pass**. All six flowing signatures refined: cutting sheets, branching electricity, crimson shadow-backed Morrow sweep, layered Sol flame and straight-edged Vesper seals. Fine spatial rays replace chunky release stars in the flow preview. Actual combat captures exposed edge-on orientation; the follow-up tilts flowing signature visuals without changing collision or movement. New regressions cover color roles, opacity, reverse seek, reduced motion, burst switching and orientation restoration. Evidence: [roster review](../art/review-2026-10-27/roster-energy/README.md). Normal play retains the earlier finish; explicit `?energy=flow` enables this preview. Claude character, rig, animation, mocap and combat code preserved.

Implementation `e2000fa`, orientation fix `25aca3a`, build `86c85c4e7373`. [Focused cloud review passed](https://github.com/Tusingw29/rift-duel/actions/runs/40470396558). Captures show crimson Morrow and separate Rei arcs with restored vertical extent; Sol/Vesper side silhouettes remain thin. Fine release rays replace the previous solid star in the flowing preview.

## REFINED-ENERGY — reference study and flowing 3D effects

Owner: **Codex** · Branch: `codex/refined-energy` · Worktree: `/tmp/rift-ink-fx` · Status: **Review; awaiting normal-speed verdict** (2026-10-26)

Synced Claude `3f7dfb5`; **572 tests pass**. Study Evil Zone gameplay imagery and Soulcalibur energy references, import attributed CC0 texture masks, and replace the solid-icon look with layered curved 3D energy, controlled luminance, flow and dissolution. Scope: effect factories, VFX settings/workbench and visual evidence. Preserve Claude's rigs, mocap/animation and combat timing. Reference screenshots are study material, not shipped game assets. Visual acceptance awaits normal-speed verdict.

Implementation `25e7d5d`, tint correction `44342e9`; synced Claude documentation `289cde9`. **576 tests pass**. [Cloud browser preview passed](https://github.com/Tusingw29/rift-duel/actions/runs/40411709301) on pre-rebase `cbeafc1` (same runtime build `9e3c712052d7`): imported masks loaded, shaders rendered, flow changes with simulation time, actual Aegis beam and Tala charge captured. [Evidence and remaining weaknesses](../art/review-2026-10-26/refined-energy/README.md). [Reference study](ENERGY_REFERENCE_STUDY.md). Imported two unmodified CC0 Kenney masks; curved tapered 3D surfaces replace the solid-icon finish in an explicit `?energy=flow` preview. Default unchanged pending visual verdict. Morrow remains too pink; rear camera beam occlusion and legacy solid release flares remain. Claude rigs, animation, mocap, combat and sword-trail sampling untouched.

## VFX-WORKBENCH — visual authoring and inspection

Owner: **Codex** · Branch: `codex/vfx-workbench` · Worktree: `/tmp/rift-ink-fx` · Status: **Implemented; awaiting normal-speed verdict** (2026-10-26)

Synced baseline: **559 tests pass**, HEAD `9664326`. Build a browser visual workbench using production 3D effect meshes, frame scrub/orbit/A-B, editable silhouettes and validated portable presets. Preview drafts in actual gameplay through an explicit opt-in. Scope: energy/ink effect modules, new workbench/config, release tooling and visual evidence. Claude retains all character, rig, pose and mocap work. No combat timing changes. Visual acceptance awaits normal-speed verdict.

# Evil Zone feel: shared task checklist

Updated: 2026-10-25. Starting code: `c4f798d`.

Shared board for Codex, Claude, and Adam. This tracks the gaps identified from [EVIL ZONE (PS1) – Practice Tutorials, lcfreezer](https://www.youtube.com/watch?v=7AqlL6_7as8), compared with Rift Duel. Preserve the original roster and approved concept art; use the reference to study behavior and timing.

Implementation `6665c5c`, visual correction `783e84f`. **564 tests pass**. [Cloud browser preview](https://github.com/Tusingw29/rift-duel/actions/runs/40403042179) passes gameplay, model, VFX controls, drag editing, save/export/import, deterministic reverse seek and actual combat default/draft captures. [Visual evidence](../art/review-2026-10-26/vfx-workbench/README.md). Inspection found and fixed Tala's crossing tail and pale cores escaping concave signature silhouettes. Crisp-stroke preset remains opt-in: side clarity improves, but the lock-on beam is still obscured by P1. Tool/demo timing does not replace combat timing. Claude's rigs, poses, combat and animation files unchanged. Next: refine beam release readability and capture-ring thickness with this tool, then obtain normal-speed verdict. Final publication also checks the workbench on Pages.

## How we work together

- Before implementation, pull the latest code, claim a task below with your name, branch, and status, and push that claim. Recheck for another claim before editing shared files.
- Status: **Ready → In progress → Review → Done**. An unchecked box is unfinished, including work awaiting visual review. Record blockers explicitly.
- Suggested split: **Codex: combat rules, movement paths, input, training. Claude: character art and animation.** These are suggested lanes, not claims or evidence that another agent has started.
- Coordinate before both editing `dist/combat.js`, `dist/animation.js`, or the same character animator. Use separate branches/worktrees; do not overwrite another session's uncommitted work.
- Each completed task needs a commit/PR, verification evidence, and any remaining limits. Automated tests establish behavior; normal-speed playback establishes animation quality. Do not check off visual acceptance from screenshots alone.
- Update this file when claiming, handing off, or finishing work. Keep checks accurate rather than checking off a whole feature because part already exists.

## Readable 60 Hz recovery budgets — Codex claim (2026-10-26)

Owner: **Codex** · Branch: `codex/readable-frame-budgets` · Status: **Review**.
Synced Claude's `fdfe66c`; baseline **532/532 tests passed**. Implemented 18-frame rebound/drop/grounded settle, 28-frame rise and 6-frame jump squat. The existing 21-frame recovery-roll choice remains before automatic rise. Hit 1/2/3 now use 28–34 / 39–46 / 49–63 total frames, with connected cancels at 14/20 and single-contact latches for wider hitboxes. Launchers, beam releases and signature recoveries expanded; volley intervals and rush/barrier channels retain their own mechanics. See [the exact frame contract and exceptions](COMBAT_FRAME_BUDGETS.md).

**540/540 tests pass**, including Claude's six KO-collapse tests and eight new budget regressions. Review drivers and portable Tala clips use the new timing; the clip-only refresh verifies byte-identical geometry/skin data and unchanged rig/material definitions. Claude's renderer, character builders, rig and pose/KO modules are untouched. [Cloud browser preview](https://github.com/Tusingw29/rift-duel/actions/runs/40387074133) passed gameplay, model, VFX and timing checks with no page errors. [Twelve inspected captures and reports](../art/review-2026-10-26/frame-budgets/README.md) show floor settle, the 28-frame rise and Morrow's 63-frame cleave. **Awaiting normal-speed verdict**. Claude handoff: Tala rise frame 14 still needs a firmer rear-hand/support-foot relationship; close guarded Morrow frames overlap the rival and crop the high blade tip. These pose/framing observations are not changed in this simulation lane. Implementation `459a657`, build `26ec03c18fb9`; publishing after evidence commit. These are Rift Duel tuning targets, not measured reference-game frame data.

## Already present — preserve and extend

- [x] Tutorial chapter instructions and sampled action frames studied; initial code comparison completed. Exact original frame timings and the full camera algorithm remain unmeasured.
- [x] Opponent-relative approach/retreat/circling, directional commands, and keyboard/controller bindings exist.
- [x] Three-hit chains, directional finish branches, stock attacks, and special follow-ups exist. Their reference fidelity still needs review (EZ-08).
- [x] Timed guard, capture breaks, aerial recovery, and a ground recovery roll exist. They do not complete EZ-03–05.
- [x] Morrow's grounded three-cut redesign has a [playable review page](https://tusingw29.github.io/rift-duel/morrow-attacks.html). This does not establish full-roster animation quality.
- [x] Life-bar charge sweep and gem creation landed in `c4f798d`. Charging transitions still need EZ-06.

Implementation plan (Adam, 2026-10-25): complete EZ-05 through EZ-11 before detailed animation polish. Preserve readable contact and fix broken poses as needed; dedicated animation acceptance remains a separate final pass.

## Priority 1 — continuous motion and readable combat

### EZ-01 — Replace instant repositioning with authored travel

Owner: **Codex** · Status: **Review** · Branch: `codex/ez-01-continuous-travel`

Reference: [dash/circling/jump, 0:27](https://www.youtube.com/watch?v=7AqlL6_7as8&t=27s), [glide attack, 1:34](https://www.youtube.com/watch?v=7AqlL6_7as8&t=94s).

Current gap: grounded pursuit, jumping crossover, and close circle-step can change the simulation position instantly. Aerial pursuit already has continuous travel; preserve it.

- [x] Record current paths, duration, contact frame, and attack/defense windows before changing them.
- [x] Give grounded pursuit a continuous approach path with readable acceleration, contact, and braking.
- [x] Give crossover a continuous takeoff, arc, side change, and landing.
- [x] Give close circle-step a continuous opponent-relative arc with consistent facing.
- [x] Keep collision, arena limits, hit detection, interruption, and camera tracking synchronized with actual travel. Verified by simulation regressions and sampled browser frames; normal-speed acceptance remains below.
- [x] Test both player slots, swapped sides, edge-of-arena cases, and interrupted travel.
- [ ] Review at normal speed: no unintentional teleport, skating, or discontinuous facing; record clip and commit.

Implementation: `3ce8a17`, camera follow-up `37ef990`, combined with Claude's EZ-02 in `c3e99b5`. **289 tests pass**, including 14 travel regression tests. The [combined cloud browser review](https://github.com/Tusingw29/rift-duel/actions/runs/40227264455) rendered 21 frames with current models and no JavaScript exceptions. Inspected pursuit, circle-step, and crossover samples; camera-space fitting resolved the airborne head cropping found in earlier renders. **Visual acceptance remains open**: normal-speed footwork, camera response, and dedicated circle choreography still need review with EZ-02. Physical controllers were not tested in this pass.

| Move | Before | Current implementation |
| --- | --- | --- |
| Ground pursuit | Instant 2-unit advance at frame 7; damage based on pre-move distance | Eased travel during the same 7-frame startup; stops 1.6 units short of original target, up to 2 units; damage checks actual contact distance/facing |
| Crossover | Instant side swap at frame 9, then air timer starts | 18-frame committed half-circle at close range, 2.5-unit leap at distance; takeoff begins with move, landing follows; contact checks actual distance |
| Circle-step | Instant side swap, 0.12-second lock | 24-frame half-circle, smooth facing toward opponent, 0.15-second initial evasion, no attack during travel; 0.45-second back-capture opportunity after arrival |

Travel chooses the side with more arena clearance and clamps positions to arena bounds. Target positions are committed at departure rather than homing after evasion. Hits and air recovery cancel the remaining path. Crossover's initial 0.12-second invulnerability now starts at takeoff. Durations and reach are **original tuning choices**, not verified Evil Zone frame data. Normal hit knockback, chain micro-steps, and unrelated specials are outside this pass.

### EZ-02 — Connect whole-body animation through actions and reactions

Owner: **Claude** · Branch: `claude/ez-02-whole-body` (merged to main) · Status: **Review** (awaiting Adam's normal-speed verdict; claimed and first pass landed 2026-10-25) · Coordinating EZ-01 travel contract with Codex: Claude will not change root travel in `dist/combat.js`; pose code reads the simulation position and only adds body motion on top.

Reference: movement and attack demonstrations throughout the tutorial. This is a visual-quality task, not a claim that every current animation is missing.

- [x] Align pose timing to actual travel and contact; document which system owns root movement so it is not applied twice. Root travel is owned by `dist/combat.js`; every grounded animator (`tala-animation.js`, `aegis-animation.js`, `morrow-animation.js`, `roster-animation.js`) only adds body offsets on top of the reported position and keys strikes to the combat frame.
- [ ] **Partially implemented:** Show planted push-off, ankle/leg weight transfer, torso rotation, and controlled settling in approach, retreat, and circling. Rei, Sol and Vesper now use the distance-driven step clips with planted support feet (previously time-based sine bobbing); Tala, Aegis and Morrow already did. Push-off emphasis still to review at normal speed.
- [x] Make guard brace with crossed/covering forearms, tucked chin, and responsive neck motion without concealing attack readability. Rei and Vesper cross the forearms with the chin tucked; Sol blocks behind the staff held across the chest; block recoil eases the torso back. Tested in `tests/roster-animation.test.mjs`.
- [x] Carry momentum through chained attacks and interrupted recoil; avoid snapping to neutral or holding a frozen walking pose. Rei, Sol and Vesper strikes are keyed wind → drive → contact → follow → retract with entry blends from the current pose. Hit reaction fixed 2026-10-25: Aegis, Morrow, Rei, Sol and Vesper read the hurt timer backwards (the snap played as the stun ended); all five now share a recoil timeline (snap, deeper catch, settle) with the rear-foot catch, entered from whatever pose the hit interrupted. Strips in `art/review-2026-10-25`.
- [ ] **Partially implemented:** Review one fighter from front, side, and actual fight camera before extending changes across the roster. Rei reviewed front and side on `fighter-review.html` (idle, guard, run, three cuts) from headless captures; fight-camera and normal-speed review by Adam pending.
- [ ] Verify approved concept silhouettes, weapon grip, foot contact, and hitstop remain intact; record normal-speed clips and Adam's visual verdict.

Completion evidence: `dist/roster-animation.js` + `tests/roster-animation.test.mjs` (12 tests: contact pose exact on the startup frame, distinct cuts, crossed-forearm guard with chin tuck, planted ankles, distance-driven stride, finite rig in all shared states); 275 tests pass; review page `fighter-review.html?fighter=rei|sol|vesper`. Remaining: normal-speed verdict, interrupted-recoil polish, push-off emphasis, EZ-01 travel handoff.

## Priority 2 — defense, stagger, and recovery

### EZ-03 — Accumulated stagger and recovery opportunity

Owner: **Codex** · Status: **Review** · Branch: `codex/ez-03-stagger`

Reference: [knockdown/recovery, 5:30](https://www.youtube.com/watch?v=7AqlL6_7as8&t=330s).

Current gap: ordinary hitstun and launch stun exist, but no accumulated stagger system. The tutorial shows sustained attacks producing a vulnerable state, directional recovery, and a stronger glide opportunity. Exact thresholds are not established by sampled frames.

- [x] Specify stagger buildup, reset/decay, triggering hits, recovery levels, and visible cues; label unverified values as Rift Duel tuning choices.
- [x] Implement the stagger state and recovery inputs without confusing them with normal hitstun or knockdown.
- [x] Add the associated glide/counter opportunity with clear vulnerability and escape windows.
- [x] Test accumulation, recovery success/failure, round resets, and prevention of unintended permanent stun loops.
- [ ] Review attacker and defender feedback at normal speed; attach evidence.

Implementation: `80f811b`, integrated with Claude's travel-animation pass in `6276516`. **23 focused stagger tests pass.** The [integrated cloud review](https://github.com/Tusingw29/rift-duel/actions/runs/40229272655) passed 325 tests before the final counter-invalidation regression was added, loaded the actual game HUD/training readout, and rendered stagger, clean recovery, pursuit knockdown, and narrow-screen HUD samples with no JavaScript exceptions. Release CI reruns the complete suite including the additional regression. Normal-speed animation and balance acceptance remain open; no physical controller was tested.

Current rules are original Rift Duel tuning choices. The reference demonstrates sustained-hit stagger, directional recovery, and a glide opportunity; it does not establish these exact values.

| Rule | First-pass value / behavior |
| --- | --- |
| Buildup | 24-point threshold. Unblocked grounded damage adds up to 12 per hit; projectiles add half. Guarded/invulnerable hits add nothing. |
| Decay | Starts 0.9 seconds after the last contributing hit; loses 12 points per second. |
| Stagger window | 1.2 seconds; movement, guard, charge, and attacks locked. Existing recoil pose is held; HUD shows recovery progress/time. |
| Recovery | After the first 0.1 seconds, alternate circle left/right three times. Held inputs and repeated same-direction taps do not count. Default A/D or controller Left/Right; remapped keys work through existing input mapping. |
| Recovery quality | Three taps by 0.6 seconds grant a 0.65-second counter window. Later taps or automatic expiry restore control without the counter bonus. |
| Counter | Next close strike started within the window gains 2 base damage, multiplied by fighter power. Starting it consumes the bonus, even on a miss/block; a new hit also removes unused bonus. |
| Escape safety | Manual recovery gives 0.18 seconds invulnerability; automatic expiry gives 0.12. Both have a 0.12-second settle. |
| Repeat protection | Recovery or taking a follow-up hit clears buildup and grants 2 seconds of resistance to another stagger. Ordinary damage and ordinary hitstun still apply after escape invulnerability. |
| Pursuit opening | Start pursuit against a staggered target within 5.6 units: up to 4 units of committed travel, 12-frame startup. If target is still staggered at contact, 12 base damage and 0.55-second knockdown; otherwise normal pursuit rules apply. |
| Interruptions/reset | A follow-up hit consumes the opening instead of refreshing it. Launch, airborne/knockdown hits, captures, and bursts do not create grounded stagger. New rounds and training health refill clear buildup/recovery state. Cinematics freeze its clock. |
| CPU | Alternates recovery inputs at difficulty-dependent intervals and can pursue a staggered rival. It does not recover instantly. |

Animation handoff: `player.staggerState` supplies `elapsed`, `remaining`, `inputs`, and last accepted direction. `player.counterWindow` signals clean recovery; `move.staggerPursuit` identifies the stronger pursuit attempt. Combat owns timers, damage, and root movement. Dedicated bracing/escape choreography can replace the initial held recoil without changing these rules.


### EZ-04 — Third-hit defensive reversal

Owner: **Codex** · Status: **Review** · Branch: `codex/ez-04-reversal`; Claude can refine the return-strike pose separately.

Reference: [short defense, 4:52](https://www.youtube.com/watch?v=7AqlL6_7as8&t=292s).

Addressed gap: generic perfect guard previously only stunned the attacker; the third close basic hit now has a separate timed deflect and return strike.

- [x] Define eligible sequence hits and distinguish this reversal from projectile reflection and generic perfect guard.
- [x] Implement a deliberate defensive timing window, reversal outcome, and interruptible follow-through as appropriate.
- [x] Test early, correct, and late guard against eligible and ineligible attacks, including both players.
- [ ] Add readable motion and feedback; document the command and review in combat.

Implementation: new `reversal.js`, contact provenance in `combat.js`, dedicated callout/deflect effect, and training/manual guidance. **20 focused tests pass**, including complete guarded chains for every fighter and both player slots. Training → Pause → Practice Controls → Repeat three-hit combo provides a repeatable real-input opponent. Cloud review verifies the practice menu, a real dummy chain, deflection, one delayed return hit, recovery, and no browser exceptions; see the handoff log. Normal-speed visual acceptance remains open.

First-pass rules (Rift Duel tuning, not measured PS1 frame data):

- Only the grounded third **basic melee strike** of a connected chain qualifies. Special third-hit branches, shots, captures, launches, airborne attacks, and return strikes do not.
- Guard must be available. Release and tap guard again within six simulation frames of contact (tap age 0–5). A fresh tap is tracked independently of the pose's guard timer, including during blockstun. This cannot escape ordinary hitstun or stagger.
- A successful deflect prevents damage and interrupts the attacker for 0.18 seconds. It starts one return strike: six-frame startup, one active frame, eighteen recovery frames; eight base damage multiplied by defender power. No stock cost or extra charge award.
- The defender advances up to 1.2 units through the startup using a committed continuous path. Damage requires actual range/facing at contact. No invulnerability is granted: another hit can interrupt the return, and an escaping target can make it miss.
- The return uses the existing first-strike pose, cannot chain, and cannot itself trigger another third-hit reversal. Buffered actions near the end of recovery still work normally.
- Outside the six-frame window, ordinary block/perfect-guard rules apply. Projectile reflection retains its existing separate behavior.

Animation handoff: `move.reversal` identifies the return; it uses the normal strike timeline and `move.travel`. Combat owns world movement and the damage frame. Claude can author a distinct deflect/return silhouette without changing eligibility. Guard input remains the bound guard action (default K / B or Circle).


### EZ-05 — Downed defense and get-up transitions

Owner: **Codex** · Status: **Review** (implementation complete; animation/usability acceptance deferred) · Branch: `codex/ez-05-through-11` · Original suggested split: Codex + Claude recovery animation

Reference: [down/recovery, 5:17](https://www.youtube.com/watch?v=7AqlL6_7as8&t=317s), [passive defense, 6:00](https://www.youtube.com/watch?v=7AqlL6_7as8&t=360s), [get-up cancellation, 8:00](https://www.youtube.com/watch?v=7AqlL6_7as8&t=480s).

- [x] Audit existing airborne recovery and ground roll before adding new states.
- [x] Define downed defense, directional recovery, recovery-level outcomes, and get-up cancel opportunities from the reference.
- [x] Implement missing transitions with explicit vulnerability, invulnerability, and action-lock windows.
- [x] Ensure recovery directions are opponent-relative for both players.
- [x] Test held versus fresh input, repeated inputs, late escape, wall limits, and interrupted recovery.
- [ ] Review grounded weight, landing, roll, and get-up continuity; update controls/manual.

Implementation and rules: [Combat systems 05–11](COMBAT_SYSTEMS_05_11.md). Final integrated review: **390 tests pass**, [browser run 40237435218](https://github.com/Tusingw29/rift-duel/actions/runs/40237435218) passed. Detailed animation polish remains deferred by Adam. Checked items describe implementation and automated verification, not exact PS1 fidelity.

### EZ-06 — Guard/charge/attack transition rules

Owner: **Codex** · Status: **Review** (implementation complete; animation/usability acceptance deferred) · Branch: `codex/ez-05-through-11` · Original suggested split: Codex

Reference: [charging, 2:54](https://www.youtube.com/watch?v=7AqlL6_7as8&t=174s), [guard charging, 7:46](https://www.youtube.com/watch?v=7AqlL6_7as8&t=466s).

Current gap: charge stocks and life-dependent charging exist. The tutorial distinguishes attack delay from charging and a defense-to-attack route that resumes charging quickly. This is not evidence of charging while holding a shield.

- [x] Write a transition table for neutral charge, release, attack, defense, and resumed charge; verify ambiguous source behavior before asserting parity.
- [x] Implement the intended delay/cancel rules while retaining the new life-bar sweep and gem feedback.
- [x] Test partial charge, full stocks, damaged life, interruption, held specials, and keyboard/controller input.
- [x] Make the timing difference visible in practice and document it.

Implementation and rules: [Combat systems 05–11](COMBAT_SYSTEMS_05_11.md). Final integrated review: **390 tests pass**, [browser run 40237435218](https://github.com/Tusingw29/rift-duel/actions/runs/40237435218) passed. Detailed animation polish remains deferred by Adam. Checked items describe implementation and automated verification, not exact PS1 fidelity.

## Priority 3 — distinctive attack interactions

### EZ-07 — Expanding long-capture circle

Owner: **Codex** · Status: **Review** (implementation complete; animation/usability acceptance deferred) · Branch: `codex/ez-05-through-11` · Original suggested split: Codex mechanics; Claude effects

Reference: [long capture, 4:05](https://www.youtube.com/watch?v=7AqlL6_7as8&t=245s), circle enlargement around 4:19–4:22.

Current gap: long capture is a fixed-radius travelling projectile. The tutorial shows a capture circle enlarged by an additional attack input during its motion.

- [x] Specify travel/formation, additional-input timing, circle growth limits, capture resolution, and defensive escape.
- [x] Implement the expanding capture interaction with visual radius matching collision behavior.
- [x] Preserve existing character-specific capture cinematics after a successful capture.
- [x] Test no extra input, valid extra input, held input, miss, timed escape, interruption, and simultaneous captures.
- [ ] Review effect readability at fight-camera distance and document the command.

Implementation and rules: [Combat systems 05–11](COMBAT_SYSTEMS_05_11.md). Final integrated review: **390 tests pass**, [browser run 40237435218](https://github.com/Tusingw29/rift-duel/actions/runs/40237435218) passed. Detailed animation polish remains deferred by Adam. Checked items describe implementation and automated verification, not exact PS1 fidelity.

### EZ-08 — Audit and complete combo branches

Owner: **Codex** · Status: **Review** (implementation complete; animation/usability acceptance deferred) · Branch: `codex/ez-05-through-11` · Original suggested split: Codex; Claude for newly needed poses

Reference: [additional blows and continuous attacks, 6:34](https://www.youtube.com/watch?v=7AqlL6_7as8&t=394s), [counterattack, 7:19](https://www.youtube.com/watch?v=7AqlL6_7as8&t=439s).

- [x] Map each demonstrated basic chain, directional third hit, advanced follow-up, counter follow-up, and moving-target capture to current behavior.
- [x] Mark each mapping present, different by design, unverified, or missing; do not replace working branches indiscriminately.
- [x] Implement confirmed missing routes with deliberate input buffers and contact timing.
- [x] Test hit, block, whiff, interruption, stock cost, and side changes for affected routes.
- [ ] Update move lists and verify each new route reads as one connected sequence.

Implementation and rules: [Combat systems 05–11](COMBAT_SYSTEMS_05_11.md). Final integrated review: **390 tests pass**, [browser run 40237435218](https://github.com/Tusingw29/rift-duel/actions/runs/40237435218) passed. Detailed animation polish remains deferred by Adam. Checked items describe implementation and automated verification, not exact PS1 fidelity.

### EZ-09 — Pressure Dash contest

Owner: **Codex** · Status: **Review** (implementation complete; animation/usability acceptance deferred) · Branch: `codex/ez-05-through-11` · Original suggested split: Codex mechanics; Claude clash motion/effects

Reference: [Pressure Dash, 6:16](https://www.youtube.com/watch?v=7AqlL6_7as8&t=376s).

Current gap: simultaneous capture/super contacts can display POWER CLASH, but there is no timed input contest. The reference triggers a contest when two gliding attacks meet.

- [x] Define valid opposing glide contacts, contest duration, accepted fresh button presses, tie handling, and CPU participation.
- [x] Implement the contest as its own state with a readable start, progress, and winner/loser resolution.
- [x] Keep the existing capture/super clash distinct unless intentionally redesigned and documented.
- [x] Test keyboard and controller equivalence, held-button rejection, pause/blur, simultaneous inputs, ties, and round end.
- [ ] Add clash/release animation and feedback; review real-time usability and consider an accessible input alternative.

Implementation and rules: [Combat systems 05–11](COMBAT_SYSTEMS_05_11.md). Final integrated review: **390 tests pass**, [browser run 40237435218](https://github.com/Tusingw29/rift-duel/actions/runs/40237435218) passed. Detailed animation polish remains deferred by Adam. Checked items describe implementation and automated verification, not exact PS1 fidelity.

## Priority 4 — framing and learnability

### EZ-10 — Reassess the fight camera against reference footage

Owner: **Codex** · Status: **Review** (implementation complete; animation/usability acceptance deferred) · Branch: `codex/ez-05-through-11` · Original suggested split: Codex

Current gap: earlier documentation called the behind-fighter lock-on view Evil Zone's signature camera. The tutorial frequently uses broadside/three-quarter framing; the exact camera algorithm is not established.

- [x] Build a shot comparison for neutral distance, close exchanges, circle movement, launch, capture, and recovery.
- [x] Compare existing side and lock-on cameras, then tune position, angle, distance, and smoothing from evidence.
- [x] Preserve opponent-relative controls independently of camera placement.
- [x] Test both fighters' visibility, arena edges, aerial height, effects, HUD overlap, and reduced motion.
- [ ] Review full-speed exchanges and update documentation to avoid unsupported camera-fidelity claims.

Implementation and rules: [Combat systems 05–11](COMBAT_SYSTEMS_05_11.md). Final integrated review: **390 tests pass**, [browser run 40237435218](https://github.com/Tusingw29/rift-duel/actions/runs/40237435218) passed. Detailed animation polish remains deferred by Adam. Checked items describe implementation and automated verification, not exact PS1 fidelity.

### EZ-11 — Guided practice lessons

Owner: **Codex** · Status: **Review** (implementation complete; animation/usability acceptance deferred) · Branch: `codex/ez-05-through-11` · Original suggested split: Codex; implement after affected mechanics stabilize

Current gap: training has dummy choices, input history, and move-phase feedback, but no guided objectives, demonstrations, or pass/fail feedback.

- [x] Add short lessons for movement, basic chains, charging, timed defense, capture, launch/recovery, and Pressure Dash as those mechanics become ready.
- [x] Give each lesson a clear command, reproducible setup, success detection, useful retry feedback, and reset.
- [x] Show bindings for the active keyboard/controller configuration.
- [x] Allow immediate retry and free practice without long interruptions.
- [ ] Test success, common wrong inputs, reset, input-device change, and leaving the lesson; have Adam try it without external instructions.

Implementation and rules: [Combat systems 05–11](COMBAT_SYSTEMS_05_11.md). Final integrated review: **390 tests pass**, [browser run 40237435218](https://github.com/Tusingw29/rift-duel/actions/runs/40237435218) passed. Detailed animation polish remains deferred by Adam. Checked items describe implementation and automated verification, not exact PS1 fidelity.

## EZ-01 motion contract for EZ-02

Codex owns simulation X/Z travel in `combat.js` and a separate travel module. Claude should keep pose/root offsets visual only; do not add a second world displacement. Ground pursuit keeps its existing contact frame. Pursuit/crossover expose `move.travel` (kind, frame, frames), and crossover exposes `move.crossover` with startup 18 and air timer set at departure. Circle-step exposes `player.travel` (orbit, frame, frames), uses the existing run pose, and faces the rival continuously; dedicated choreography remains EZ-02. World X/Z travel is applied before rendering; do not repeat it in the rig. Codex is not editing character animators.

## ART-TALA-GRAPHIC — Finished-model likeness and rig polish

Owner: **Codex** · Status: **Review — awaiting normal-speed verdict** · Branch: `codex/tala-graphic-polish` · Worktree: `/tmp/rift-tala-polish`

User requested another round against the dimensional finished-model target. Scope: `scripts/build-tala-graphic.mjs`, its generated GLB/pack, graphic-model tests and review captures. Preserve the existing combat bones, all fighter animators, gameplay timing and Claude's EZ-02 ownership. Review face/hair proportions, vest/shoulder fit, fists, and deformation in guard/contact poses. Visual acceptance remains **awaiting normal-speed verdict**.

- [x] Refine the actual model toward `art/tala-graphic/target/tala-rigged-model-target.png`.
- [x] Verify mesh weights, live/exported pose agreement and visual deformation.
- [x] Capture front/side/rear and exact attack contacts; record known limits.
- [ ] Adam's normal-speed and visual-likeness verdict.

## DEFORM-RIG — Deformation layer on every textured body

Owner: **Claude** · Status: **Review — awaiting normal-speed verdict** (implemented 2026-10-26) · Branch: `claude/deform-rig` (merged to main)

Adam approved carrying the graphic Tala's articulated layer (pelvis, split spine, neck, clavicles, forearm twists, fingers, toes, hair chain) onto all six textured Design 03 bodies through the Node builder, keeping the 17-bone control contract and the rule-driven adapter so every animator, test and mechanic stays valid. Authored wrist and clavicle channels sit on top. Scope: `scripts/build-tala-threejs.mjs`, `dist/tala-concept.js` attach path, `dist/tala-combat-rig.js` generalised per fighter, tests. No change to combat rules or damage frames.

- [x] Keep the MakeHuman game-engine bones the builder currently folds away (spine, neck, clavicles, fingers, toes) and write them as a second skin layer under the 17 control bones. 61 bones per fighter, hierarchy in the GLB extras (`rigSpec`, `restFist`), twist helpers and ponytail chain added.
- [x] Generalise the combat-rig adapter so any fighter with `combatRig` extras gets the distributed spine/neck/wrist/finger behaviour. `installCombatRig(r, mapped, rigSpec, {restFist})`; both attach paths read the per-fighter spec; the graphic Tala keeps its own hard-coded spec.
- [x] Verify bind pose, weights and every existing animation on all six; keep the graphic Tala path working. 417 tests; graphic builder skips weight redistribution for layered sources.
- [ ] Review Tala and Rei hands and spine at normal speed.

Completion evidence: `art/review-2026-10-26/deform-rig/README.md` and `art/review-2026-10-26/tala-arms/README.md` (fist curl tightened, stance re-measured). Follow-up: author collarbone reach and wrist channels per strike now that the joints exist.

## ART-STYLE — Decision: graphic flat-colour is the game's art style

Adam chose the graphic flat-colour Tala over the textured Design 03 body on 2026-10-26. Consequences: the graphic Tala is the default appearance; face, hair and costume polish go to the graphic style; the other five fighters get graphic flat-colour builds in the same way (`scripts/build-tala-graphic.mjs` generalised per fighter) rather than textured passes. The textured bodies remain the skinning source for every fighter (the graphic build derives from them) and stay selectable in the appearance menu for comparison. Both Codex and Claude build in this style from now on.

## TALA-IMPORT-AB — Does imported motion make Tala more natural? (experiment)

Owner: **Claude** · Branch: `claude/tala-import-ab` · Worktree: `~/rift-worktrees/tala-import-ab` · Status: **Adam played it 2026-10-27: imported feels better and more responsive; needs animation tweaks** (claimed and implemented 2026-10-26). **Authored remains the default.**

Controlled A/B on Tala only: authored animation versus retargeted CMU motion capture for combat advance, retreat, sidestep left/right and the grounded get-up. Uses the existing BVH importer (extended with segment export, not replaced) and the pose-channel playback; simulation keeps world position, air height, hitstop and every recovery state; combat rules, buffering and the KO collapse untouched (`dist/combat.js` and `dist/combat-travel.js` not modified).

- [x] Audit of reusable importer, clip, review and planting pieces (README §1)
- [x] Sources with licences: CMU 14_01/14_03 boxing footwork (one orthodox subject, genuine backward and lateral steps), CMU 140_09 get-up from the back; limitation recorded: no game-speed combat footwork or fighting-speed get-up exists in CMU
- [x] Retarget into pose channels: travel separated from pelvis sway, contact-locked feet with heel pivot, upper body as deviations around Tala's stance, sampled from distance travelled and `getUp.frame`, frozen by hitstop
- [x] Authored / Imported switch in the sandbox with seven matched scenarios, side and lock-on cameras, frame scrubbing and 60 Hz play; sandbox now animates every replayed frame on the simulation clock
- [x] Tests (`tests/tala-import-ab.test.mjs`, 8): simulation identical in both modes, deterministic replay, hitstop freeze, contact lock, get-up bound to the 28-frame state, roster and KO untouched, default authored
- [x] Captures, metrics, README: `art/review-2026-10-26/tala-import-ab/`
- [x] **Adam's normal-speed verdict (2026-10-27, in-game `?gait=imported`):** "feels a lot better… definitely more responsive", still needs tweaking. This overrides Claude's provisional reject. Next: a polish pass on the imported mode (foot skating on advance/retreat/right, right-sidestep straddle, get-up floor dip), still opt-in until Adam approves making it the default. Claude's earlier provisional: reject the imported footwork (simulation travel is 6–20× any captured combat footwork; stretched strides skate and one direction straddles), revise and keep comparing the get-up (visibly more human, but compressed 8×), weakest action: advance; do not expand to other fighters

Found on the way (separate from the experiment): the **authored get-up on main pushes Tala's left foot 0.66 units through the floor at get-up frame 12** (no floor clamp runs during `getUp`). Needs a fix whichever version is kept.

## WEIGHT-TRANSFER — Ground-up power and whole-body weight shift (footsies, then burst)

Owner: **Claude** · Branch: `claude/weight-transfer` · Worktree: `~/rift-worktrees/weight-transfer` · Status: **Merged to main — awaiting Adam's normal-speed verdict** (2026-10-27)

Adam (2026-10-27, after playing `?gait=imported`): fighters "still not loading up power and momentum from their feet and shifting weight through the entire body at once… still move like Rock 'Em Sock 'Em Robots". Target feel: Soul Calibur supers × Tekken combos — light footsies, then a burst into full-body committed motion (stepping, jumping, grabbing, throwing). Scope: animation only (shared grounded strike schedule, footwork, Tala first); combat timing, travel and hit boxes untouched.

- [x] Diagnose: feet and hips fixed through the combo; the simulation's 0.4 chain advance left planted feet behind (dropped under the knee, crossed on Tala's finisher); heel pivot snapped flat on each chained hit
- [x] Strikes driven from the floor (`dist/weight-transfer.js`, every grounded fighter): load into the rear leg, lead foot steps in, hips drive over the front foot (cap 0.5), weight carries past and drags the rear foot, both step home; chain advance absorbed into the step; unreachable feet drag instead of dropping; heel pivot blends across chained hits
- [ ] Footsies: lighter, springier stance and steps so the burst contrasts (not done this pass)
- [x] Get-up floor clamp (authored −0.66 → +0.05, imported −0.31 → +0.07), all fighters
- [x] Tests (589, 13 new), captures and README: `art/review-2026-10-27/weight-transfer/`
- [ ] **Adam's normal-speed verdict.** Known: Aegis's overhead finisher now winds up low and compact (may read as a squat)

## MOCAP-COMBAT + ANIM-WORKBENCH — Retargeted mocap strikes and a live animation workbench

Owner: **Claude** · Branch: `claude/mocap-combat` · Status: **Merged to main — awaiting Adam's normal-speed verdict** (2026-10-27)

Adam (2026-10-27): stop hand-coding animation blind. (1) Polish `?gait=imported`: footwork skating, right-sidestep straddle, get-up time warp. (2) Import real CMU punches, kicks and sword cuts with a piecewise time warp onto `moveTiming` (wind-up to startup, impact held through active and hitstop, follow-through to recovery), the simulation still owning the root and the chain advance absorbed into the step. (3) `dist/anim-workbench.html`: fighter/move/source switcher, joint picking and channel sliders per key, motion trails and a centre-of-mass plumb line, time-warp controls and clip export, `window.animWorkbench` hooks.

- [x] Imported footwork and get-up polish: cadence 0.6/0.65 units per cycle, stance band, recovery step on stop, activity time warp (skate advance 0.150 → 0.003, stance after stop 1.5 → 0.75)
- [x] Captured strikes for Tala's three-hit combo (CMU 13_17, 14_01, 14_03 mirrored) warped onto moveTiming, contact on the authored aim, hips and feet from the capture, chain advance absorbed. Gaps: CMU kicks travel 1–2 units (no grounded fit), CMU swordplay is slow sparring — not imported
- [x] `dist/anim-workbench.html`: six fighters, every combat state, A authored vs B imported / hybrid / authored+tweaks, side by side or overlay, joint picking, keyed additive tweaks (`dist/anim-tweaks.js`, empty in the game), trails, centre-of-mass plumb line, time-warp and lead sliders, export, `window.animWorkbench`; probe in the browser-smoke workflow
- [x] 600 tests, probe passing, captures and README `art/review-2026-10-27/mocap-combat/`
- [x] **Adam's normal-speed verdict:** accepted ("i like it"). Merged with `claude/bvh-strike-mode`; 608 tests on main (open questions: the hook's torso turn during the step-through, the long step home after captured strikes)

## QUATERNIUS-JAB — Quaternius jab on Tala's first punch (opt-in A/B)

Owner: **Claude** · Branch: `claude/quaternius-jab` · Worktree: `~/rift-worktrees/quaternius-jab` · Status: **Done (rejected)** (2026-10-27). Branch kept as a record, not merged.

**Verdict (Adam, 2026-10-27): rejected.** He prefers Tala's authored strike 1; it is more stylish. The authored punch stays. The jab hookup is not merged into strike 1; the standing `--mode strike` converter guard and its tests land separately (`claude/bvh-strike-mode`).

Adam (2026-10-27): try the Quaternius Universal Animation Library Standard `Punch_Jab` (CC0) on Tala's strike 1 as an opt-in A/B in the sandbox (`&anim=imported`), next to her current first punch. Clip time-warped so its contact lands on the simulation's strike-1 contact frame (9/3/16); the simulation owns timing and root. No edits to `dist/combat.js` or combat timing; authored stays the default everywhere. Not merged to main until Adam's verdict.

- [x] Standing one-shot conversion path (`--mode strike`; `oneshot` now refuses standing takes), lean −0.23 checked (real chest-joint offset in the stylised guard, not a flipped axis; cancels as a deviation), mirrored to Tala's right-hand strike 1, `dist/clips/import/jab.js`
- [x] Hooked into `dist/imported-motion.js` for strike 1 only, as deviations around Tala's stance, sampled from the move frame (contact on frame 9, held through active and hitstop); `&jab=0` restores the CMU straight
- [x] 606 tests (6 new), side-camera strips authored / jab / CMU, README `art/review-2026-10-27/quaternius-jab/`. Defect found: arm-only jab, fist 0.6 short of the authored contact, hips 0.05 forward against 0.45 authored
- [x] **Adam's normal-speed verdict**: rejected, authored strike 1 kept

## QUATERNIUS-REACTIONS — Quaternius hit reactions for Tala (opt-in A/B)

Owner: **Claude** · Branch: `claude/quaternius-reactions` · Worktree: `~/rift-worktrees/quaternius-reactions` · Status: **Done (accepted)** — Adam (2026-10-27): "i like it". Merged to main and made Tala's default reactions (Adam: "yea import"); `?react=authored` (game or sandbox) brings back the authored recoil and guard

Adam (2026-10-27): try Quaternius UAL Standard `Hit_Chest` and `Hit_Head` (CC0) as Tala's hit reactions, opt-in behind `&anim=imported` only. Same rules as the jab: the simulation owns timing and root, deviations around her stance, deterministic replay, default unchanged, no edits to `dist/combat.js`. Review with the `guard-hit` and `recoil` sandbox recipes.

- [x] Both takes converted (`--keep-first`, `--mode reaction`: they open on the hit and settle into an idle stand). Hit_Chest on an unguarded hit over the 0.42 s hurt timer; Hit_Head behind the guard over the 0.12 s block stun, arms held in guard. Deviations from the settled end around her stance or guard, sampled from the simulation timers
- [x] 608 tests (5 new), side-camera strips authored vs imported (`recoil`, `guard-hit`), README `art/review-2026-10-27/quaternius-reactions/`. Finding: clean but small; recoil head travel 0.25 against 0.85 authored, guarded Hit_Head nearly invisible in 7 frames
- [x] **Adam's normal-speed verdict:** accepted ("i like it"). Merged with `claude/bvh-strike-mode`; 608 tests on main

## Handoff log

| Date | Agent | Task | Change / evidence / next step |
| --- | --- | --- | --- |
| 2026-10-26 | Claude | TALA-IMPORT-AB | Experiment complete on `claude/tala-import-ab`: imported CMU boxing footwork and get-up for Tala behind an opt-in A/B switch (sandbox `&anim=imported`, game `?gait=imported`), authored default unchanged. Metrics: imported footwork skates more than authored in 3 of 4 directions (up to 0.88 u/frame) and straddles on the right sidestep; get-up reads more human and sinks less (−0.31 vs −0.66). Provisional: reject footwork, revise get-up, Tala only. Evidence `art/review-2026-10-26/tala-import-ab/README.md`. Next: Adam's normal-speed verdict; separate fix for the authored get-up floor penetration. |
| 2026-10-27 | Claude | TALA-IMPORT-AB | Adam played Tala with `?gait=imported` in the game: imported "feels a lot better… definitely more responsive" but needs tweaking. Verdict overrides the provisional reject. Authored stays the default. Next: polish pass on the imported mode, then Adam decides on the default. |
| 2026-10-27 | Claude | WEIGHT-TRANSFER | Ground-up weight transfer for every grounded fighter's strikes and specials, chain advance absorbed into the step, feet drag instead of dropping, heel pivot blended across chained hits, get-up floor clamp. 589 tests. Evidence `art/review-2026-10-27/weight-transfer/`. Next: Adam's normal-speed verdict (Aegis finisher wind-up flagged). |
| 2026-10-27 | Claude | MOCAP-COMBAT + ANIM-WORKBENCH | Imported footwork/get-up polish, captured CMU punches for Tala time-warped onto moveTiming, and `dist/anim-workbench.html` (real rigs, A/B, joint tweaks, trails, centre of mass, time-warp sliders, export, automation hooks). 600 tests; workbench probe gates browser smoke. Evidence `art/review-2026-10-27/mocap-combat/`. Next: Adam's verdict; tune in the workbench. |
| 2026-10-27 | Claude | QUATERNIUS-JAB | Claimed on `claude/quaternius-jab`: Quaternius UAL `Punch_Jab` (CC0) as an opt-in A/B on Tala's strike 1 behind `&anim=imported`. Combat timing untouched; branch only, not merged. |
| 2026-10-27 | Claude | QUATERNIUS-JAB | Review on `claude/quaternius-jab` (not merged): Quaternius `Punch_Jab` (CC0) mirrored onto Tala's strike 1 behind `&anim=imported`, contact on frame 9, feet planted, no wrong hand / arm through body / back lean. Reads as an arm-only flick: fist 0.6 short of the authored punch. 606 tests. Evidence `art/review-2026-10-27/quaternius-jab/`. Next: Adam's normal-speed verdict. |
| 2026-10-27 | Claude | QUATERNIUS-JAB | **Done (rejected).** Adam prefers Tala's authored strike 1 (more stylish); authored punch kept, jab hookup not merged. Converter guard and tests go to `claude/bvh-strike-mode`. Next: QUATERNIUS-REACTIONS. |
| 2026-10-27 | Claude | QUATERNIUS-REACTIONS | Claimed on `claude/quaternius-reactions`: Quaternius `Hit_Chest` / `Hit_Head` (CC0) as Tala's hit reactions behind `&anim=imported`. Combat untouched; branch only. |
| 2026-10-27 | Claude | QUATERNIUS-REACTIONS | Review on `claude/quaternius-reactions` (not merged): Hit_Chest on unguarded hits, Hit_Head behind the guard, behind `&anim=imported`. No wrong side, clipping or sliding; reactions are about a third of the authored snap. 608 tests. Evidence `art/review-2026-10-27/quaternius-reactions/`. Also `claude/bvh-strike-mode` (converter guard + tests, 603) ready to land. Next: Adam's verdict. |
| 2026-10-27 | Claude | QUATERNIUS-REACTIONS | **Done (accepted).** Adam: "i like it". Merged `claude/quaternius-reactions` (includes `claude/bvh-strike-mode`) to main; reactions stay opt-in behind `&anim=imported`, authored default unchanged. Fixed the converter test's script path (it broke under a checkout path with spaces). 608 tests. Next: Adam decides whether imported reactions become Tala's default. |
| 2026-10-27 | Claude | QUATERNIUS-REACTIONS | **Imported reactions are now Tala's default** (Adam: "yea import"). New reaction source in `locomotion-clips.js` (`setReactionSource`, default `imported`; `?react=authored` in game and sandbox restores authored; `&anim=imported` still plays them). Gait, strikes and get-up unchanged (authored default). Workbench view A stays the fully authored reference. Authored guard-tuck / recoil / GLB-bake tests pinned to `react=authored`. 608 tests; game and sandbox load with no errors. |
| 2026-10-28 | Claude (for Codex) | SPACING-COMMITMENT | Claimed on `codex/spacing-commitment` as owner Codex at Adam's request; Claude does the work. Opt-in switches only; default game unchanged. |
| 2026-10-28 | Claude (for Codex) | SPACING-COMMITMENT | Review on `codex/spacing-commitment` `ec771a3` (not merged): `&spacing=band`, `&spacing=riskyshot`, `&guard=split`, training reach/band marker, `docs/FRAME_ADVANTAGE.md`. Default identical to main (fingerprint test). 618 tests (`node --test`; the `npm test` wrapper exits 194 with no output in this environment, also on main). Next: Adam's normal-speed verdict; then block stun / pushback and whiff recovery from the proposals. |
| 2026-10-28 | Claude | BALANCE-LAB | Claimed on `claude/balance-lab`: balance lab page, roster extract and sync test. No combat rule or timing changes. |
| 2026-10-28 | Claude | BALANCE-LAB | Review on `claude/balance-lab` `6a49a77` (not merged): balance lab page, roster extract (116 moves from the modules), shared formulas, sync test, DESIGN.md pointer. No combat rule or timing changes. 616 tests (`node --test`). Next: Adam's verdict; Codex: `&balance=local` proposal in the task notes. |
| 2026-10-28 | Claude | SIM-SKILLS | Review on `claude/skills` `6a4c0f0` (not merged): `bot-probe`, `reaction-check`, `sim-audit` skills in `.claude/skills/`. Tooling only, no game files. Next: Adam's verdict. |
| 2026-10-26 | Codex | VFX-WORKBENCH | `6665c5c` + `783e84f`: live production-mesh A/B editor, silhouette dragging, validated presets, explicit gameplay preview; visual inspection fixed crossing/clipped-core defects. 564 tests and [cloud preview](https://github.com/Tusingw29/rift-duel/actions/runs/40403042179) pass. [Captures and limits](../art/review-2026-10-26/vfx-workbench/README.md). Next: behind-player release clarity/capture thickness; awaiting normal-speed verdict. |
| 2026-10-25 | Codex | ART-TALA-GRAPHIC | Round 2: face proportions, layered head-anchored ponytail, modeled curled fingers and fitted shoulder panels. Preserves live combat animation. [Before/release captures](../art/review-2026-10-25/tala-graphic-polish/README.md); root/tip deformation regression added; downloadable pack rebuilt. Shoulder seams and faceting still need refinement. Awaiting normal-speed verdict. |
| 2026-10-25 | Codex | EZ-05–11 | Mechanics, Duel camera and nine guided lessons implemented. Preserved Claude’s sandbox/rig schema `e2c8699`. **390 tests pass**; [cloud review](https://github.com/Tusingw29/rift-duel/actions/runs/40237435218) checks real lesson flow, remapped input/controller prompts, Pressure Dash pause, 21 camera/capture/ring views and portrait fit. Detailed animation polish, physical controllers and Adam’s normal-speed/first-play verdict remain deferred. |
| 2026-10-25 | Claude | EZ-02 | First pass merged: Rei, Sol and Vesper moved from the time-based shared animator to the grounded whole-body system (authored stance, crossed guard, hit reaction, charge, distance-driven footwork, three keyed strikes each). Status Review. Next: Adam's normal-speed verdict; then recoil momentum and push-off weight across the roster. |
| 2026-10-25 | Claude | EZ-02 | Claimed. Starting with Tala's guard brace, locomotion weight transfer and chain momentum on branch `claude/ez-02-whole-body`; review on `tala-blender.html` and in the fight camera before extending to Aegis and Morrow. |
| 2026-10-25 | Codex | EZ-03 | Rules, HUD, training feedback and CPU recovery implemented. Integrated Claude’s travel choreography `a80ce24`. Cloud review: [40229272655](https://github.com/Tusingw29/rift-duel/actions/runs/40229272655). Normal-speed balance and dedicated stagger/recovery posing remain open. Next mechanics task: EZ-04 third-hit defensive reversal. |
| 2026-10-25 | Codex | Integration | Merged Claude’s EZ-02 commit `1622f2e` into EZ-01 (`c3e99b5`). Preserved both implementations and regenerated page import maps. No duplicate simulation displacement added. |
| 2026-10-25 | Codex | EZ-01 | Implemented continuous travel in `3ce8a17`; review pending. Grounded pursuit keeps frame-7 contact; crossover uses frame 18; circle uses 24 frames. EZ-02 can consume the travel state described above. |
| 2026-10-25 | Codex | EZ-04 | Third-hit reversal, 20 focused tests, repeat-three-hit practice dummy and controls/manual implemented. Integrated Claude’s hit-reaction fix `84c1d96`. 351 tests pass; browser review passed without exceptions. Review: [40231237705](https://github.com/Tusingw29/rift-duel/actions/runs/40231237705). Existing first-strike pose is reused; distinct reversal posing, normal-speed timing acceptance and physical-controller review remain open. Next mechanics task: EZ-05 downed defense/get-up transitions. |
| 2026-10-25 | Claude | EZ-02 | Hit reaction: inverted hurt timer fixed on five fighters, shared recoil timeline with foot catch (`84c1d96`); 331 tests pass. |
| 2026-10-26 | Claude | EZ-02 kinetic wave | Shared task list: segment leads widened (pelvis 5f, spine 3.5f, shoulders 2f, elbows 1f, wrists on the beat then 3.5f drag after the hold; hold lengthened to cover the lead), clamped Hermite/Catmull-Rom across all keys with the crisp whip kept, elbows/knees pure flexion hinges, radial→ulnar wrist deviation on the sword swings, shared heel pivot with toe counter-hinge, ground-bounce state bound. 551 tests. Strips regenerated in `art/review-2026-10-26/kinetic-chain`. Bound to Codex's new budgets (`recovery.js`): the fall reads `knockdown.remaining` over the 21-frame down hold, the 28-frame `getUp` state and the 18-frame bounce phases drive their poses, strike timings come from `moveTiming`. |
| 2026-10-26 | Claude | EZ-02 knockout collapse | Adam: KO looked like standing or floating, not a lifeless collapse. `collapsePose` (knees buckle, fold and sink, tip over, lie crumpled, no breathing) for `defeat`; the renderer drives the loser's timers on the KO cue clock since the simulation freezes (airborne loser comes down and slams, a falling one finishes falling). Review page regained its pose options (lost in a stamped-HTML rebase; resolve those conflicts with our HTML and restamp). 524 tests. Strips in `art/review-2026-10-26/kinetic-chain` (`*-defeat-*`). |
| 2026-10-26 | Claude | EZ-02 kinetic chain | Adam: stop preserving two-pose interpolation; full-body multi-key chain. Done: seven-key `kineticKeys` behind every strike and special with per-segment lead sampling (feet/pelvis +2, spine +1, head counter); wrist hinge channels `lwx/lwz/rwx/rwz` on all rigs; Aegis and Morrow blades in line with the forearm at contact (measured), new weapon stances and guards, Morrow's grip solver keeps the hinge and closes both hands; keyed grapple (actor drops/lifts/throws, victim dangles/flails); six-stage launch, fall with whiplash and bounce, hand-plant get-up. 518 tests. Strips in `art/review-2026-10-26/kinetic-chain`. |
| 2026-10-26 | Claude | EZ-02 specials grounded | Adam: combos, specials, knockdowns and being picked up still looked old. Survey showed roster specials, aerial beats, launch tumble, roll, victory and both grapple roles still on the shared animator. All moved to the grounded rig: per-fighter special triples with kind modifiers and effect overrides on the strike schedule, backflip launch landing into the fall, grounded roll/victory/aerial, renderer feeds `grapple`/`grappled` during cinematics (actor braces, victim flails). Coverage test forbids any in-match state on the shared animator. 515 tests. Strips in `art/review-2026-10-26/specials-grounded`. |
| 2026-10-26 | Claude | EZ-02 snap and step | Shared task list items 1–4: stepping idle/guard with re-anchoring feet (no skating), shared strike schedule (held wind-up, 2-frame whip, locked contact through hitstop), frame-one recoil with hitstop shudder, travel burst-and-brake overlay with gait stepping on pursuit/circle, `jumpSquat`/`getUp` bound to Codex's live frame counters (fall completes by 0.35 s, rise over the 12 get-up frames), recoil shudder on the hitstop counter passed by the renderer. 503 tests. Strips in `art/review-2026-10-26/snap-and-step`. |
| 2026-10-26 | Claude | EZ-02 weight rhythm | Adam: still stiff, only the arms move, legs barely move at the hips. Added `dist/footwork.js`: a measured boxing weight rhythm on every idle (pelvis ±0.13, hips turning with it, alternating knees, free-foot taps), pelvis coupled to every hip turn, rear foot driving under punches on non-pivot rigs, higher gait lift. 454 tests. Strips in `art/review-2026-10-26/motion-weight` (idle front/side). If the live feel is still short, the next lever is real stepping in idle (the boxing take walks around) which needs plant re-anchoring, and a jump squat / get-up state from Codex. |
| 2026-10-26 | Claude | EZ-02 weight pass | Adam: stiff lower body, no attack tells, toy-like knockdown. Measured nine CMU takes (punch, kick, jumps, falls, get-up) with the new `--dump` and `scripts/mocap/study-take.mjs`; strikes now hold a loaded wind-up (hips counter-rotated, rear knee bent) and a held follow-through on all six; knockdown plays hit/topple/slam/bounce/settle with the root pitched about the feet and defeat holds it; a 0.45 s rise overlay; measured flight and landing absorb; weight-shifting idles. New channels `bodyPitch`/`bodyRoll`. 442 tests. Strips in `art/review-2026-10-26/motion-weight`. For Codex (combat rules): a real get-up state (~0.45 s, invulnerable) and a 3-frame jump squat would let the rise and the take-off crouch be real frames instead of visual overlays. |
| 2026-10-26 | Claude | ART-STYLE roster | Graphic flat-colour builds for Aegis, Rei, Morrow, Sol and Vesper (`scripts/build-fighter-graphic.mjs`, derived from the textured bodies: flat palette, silhouette cards, two-tone shader on body, costume, weapons and Rei's spirit); loaded whenever the graphic style is selected; 425 tests. Captures in `art/review-2026-10-26/roster-graphic`. Next: sculpted faces and hair volumes per fighter in the Tala graphic manner, once Adam judges these at normal speed. |
| 2026-10-26 | Claude | ART-STYLE collarbones | Authored collarbone channels (`lc`/`rc`) on the graphic Tala: shoulder pulls back on each wind and leads at contact, guard rounds both; mocap clips and graphic GLB regenerated, 419 tests. Captures in `art/review-2026-10-26/tala-collarbones`. Next: graphic builds for the other five. |
| 2026-10-26 | Claude | ART-STYLE | Graphic flat-colour chosen by Adam as the art style; it is now the default Tala appearance and the roster bodies load with it. Next: wrist and collarbone authoring on the graphic Tala, then graphic builds for the other five. |
| 2026-10-26 | Claude | DEFORM-RIG fix | Graphic preview arms broke (bone order mismatch between the layered builder and the graphic builder); graphic builder now remaps source joints by name, builder order aligned, regression test added. Captures in `art/review-2026-10-26/tala-arms`. |
| 2026-10-26 | Claude | EZ-02 arms | Stance re-measured (fists at the jaw, lead ahead, elbows in); builder fist curl aimed at the palm centre so tips tuck; all six bodies and graphic Tala rebuilt. Captures in `art/review-2026-10-26/tala-arms`. |
| 2026-10-26 | Claude | DEFORM-RIG | Articulated layer on all six textured bodies via the Node builder; adapter generalised; graphic path preserved. Review captures in `art/review-2026-10-26/deform-rig`. |
| 2026-10-26 | Claude | EZ-02 fists | Wrist-roll channel added to the pose system and authored for Tala's stance, guard and strikes (fists upright at the chin, knuckles forward, palms facing; straights land palm down). Graphic rig honours the authored wrist. Captures in `art/review-2026-10-26/tala-fists`; 417 tests. Awaiting normal-speed verdict. |
| 2026-10-25 | Claude | EZ-02 locomotion | BVH → pose-channel converter and CMU run/walk cycles wired behind a runtime switch (`?gait=mocap`); before/after strips in `art/review-2026-10-25`. Default stays authored until Adam compares at normal speed. |
| 2026-10-25 | Claude | EZ-03 / EZ-04 animation | Stagger reel (knees buckled, sway, head lolling, straightening with each recovery tap, snap upright on recovery) and the third-hit reversal return strike (forward drive out of the guard) added to every grounded animator via shared `staggerPose` / `reversalPose`; planted feet kept during the reel. `tests/stagger-reversal-animation.test.mjs` covers all six fighters through the sandbox scenarios. Sandbox gained a camera zoom. |
| 2026-10-25 | Claude | Tooling | Local animation sandbox (`dist/sandbox.html`, scripted deterministic scenarios in `dist/sandbox-recipes.js`, frame scrub, skeleton/hurtbox/hit-arc overlays), canonical bone schema with alias normalisation (`dist/rig-schema.js`), hardened `scripts/combat-travel-smoke.mjs` (always writes report and screenshots, console capture, fallback-tolerant readiness), determinism tests. A proposal to replace the grounded animators with mixer keyframe clips was reviewed and declined: the animators are already frame-locked to the simulation and the clip conversion would drop planted-foot solving, entry blends and distance-driven gait for no determinism gain. |
| 2026-10-25 | Codex | Planning | Created shared checklist from tutorial study and code comparison. No implementation tasks claimed or completed by this document. Next: claim EZ-01; coordinate EZ-02 with character animation work. |

Do not commit the downloaded reference video. Link to the source and store original game captures or small review artifacts only when appropriate. Research notes are evidence, not exact source-game frame data.

EZ-03 ownership: Codex is editing `combat.js`, new `stagger.js`, HUD/training feedback, and tests. Existing hurt/recover poses will expose the state initially; dedicated stagger/recovery choreography can be refined by Claude using `player.staggerState` (elapsed, remaining, inputs) and `player.counterWindow`. No character rig or root-motion changes planned.

## MOCAP-REVIEW — Tala gait comparison and transitions

Owner: **Codex** · Status: **Review — awaiting normal-speed verdict** · Branch: `codex/mocap-review` · Worktree: `/tmp/rift-mocap-review`

Integrate existing mocap commit `070f08f` without changing the other checkout, compare Tala authored/captured locomotion and combat handoffs, fix clear integration defects. Scope: locomotion adapter, review controls, tests and captures; per-fighter animator changes only if needed for the handoff. Authored remains default pending normal-speed verdict.

Comparison implementation: Claude's `070f08f` integrated in the isolated worktree; original checkout's paused rebase was left untouched. Tala viewer now offers gait switching at the current timestamp, three continuous movement/combat sequences, and a Play link preserving the gait. Main game accepts the same opt-in query as the sandbox. Baked clips explicitly disable the gait selector. Captured retreat exposed an upward gaze; the adapter now compensates head pitch against torso lean. Authored remains default.

Evidence: `art/review-2026-10-25/tala-gait/README.md`. Regression tests cover paused switching, deterministic replay, bounded guard/strike entry, exact contacts on all three combo punches, and combat gaze. Existing impact reaction is intentionally sharp, not classified as smooth entry. The hybrid retains procedural foot targets; reverse-run retreat and adapted-walk circling still require normal-speed evaluation and potentially purpose-recorded combat captures.

Validation: **413 tests pass** locally after the gaze fix. Review remains open for Adam’s normal-speed comparison; authored is still the default.

## TALA-COMBAT-RIG — Articulated graphic fighter

Owner: **Codex** · Status: **Review — awaiting normal-speed verdict** · Branch: `codex/tala-combat-rig` · Worktree: `/tmp/rift-combat-rig`

User approved correction of fist/guard orientation and fuller combat skeleton. Scope: graphic Tala asset builder, attachment, a dedicated rig adapter and Tala pose hook, rig/asset tests and visual evidence. Preserve gameplay damage frames and other fighter models. Add pelvis/spine/neck/clavicles, wrist/twist controls, fingers/toes and segmented hair; reweight graphic model. Claude’s original checkout remains untouched. Baseline `b2e0c62`: 413 tests passed in preceding integration. Visual acceptance remains awaiting normal-speed verdict.

Implementation: graphic Tala now uses 61 deformation bones with original combat roles retained. Independent wrists, 30 finger/thumb joints, pelvis/spine/neck/clavicles, arm twist helpers, toes and segmented hair. Skin weights and all 21 exported clips rebuilt. Ready fists raised; thumbs curl across fingers; wrists ease into guard, palms open through ranged startup/recovery, toes counter-roll during punch pivots. Foot IK uses the actual thigh-parent space for the expanded pelvis hierarchy. Other assets keep the legacy path.

Evidence: `art/review-2026-10-26/tala-rig/README.md`. Known limits: geometric fingers and costume seams still need sculpting; expanded controls reuse current action choreography; normal-speed feel remains unaccepted. Next: Adam checks idle fists, crossed guard, straight/cross/hook and directional footwork before extending to the roster.

Validation: **414 tests pass** on the final rig; 12 release browser views cover stance, hands, movement, guard and exact three-hit contacts. Download pack rebuilt and manifest/GLB SHA-256 checked.

## ATTACK-FX — Graphic energy and capture ring

Owner: **Codex** · Status: **Review — awaiting normal-speed verdict** · Branch: `codex/attack-fx` · Worktree: `/tmp/rift-attack-fx`

User approved beams, charging and an open capture ring around the opponent. Scope: projectile visuals, new attack-effects module, render integration, tests and captures. No character mesh, rig, animator, damage or timing edits; Claude retains character ownership.

ATTACK-FX implementation: open camera-facing restraint ring follows the cinematic victim; capture-only solid orbs removed, travelling collision-sized ring preserved. Direction-aligned beams now have a white core and coloured sleeve; cinematic pillars get a white core. Charge has floor ring plus converging streaks, with a static sparse reduced-motion variant. No model, rig, animator or simulation edits. Evidence: `art/review-2026-10-26/attack-fx/README.md`; lifecycle, geometry, beam orientation, pooled reset, reduced-motion determinism and capture/super separation tests. Normal-speed visual acceptance remains open.

ATTACK-FX validation: **423 tests pass**; browser captures cover the live capture scenario, charge and an isolated beam fixture with zero page exceptions. Charge capture found and fixed opaque-arena overdraw (energy now uses the transparent render pass with depth testing). Capture ring, final charge and beam screenshots are in the review folder.

## INK-ENERGY-CONCEPT — Attack art direction before implementation
Owner: **Codex** · Status: **Review — awaiting art-direction choice** · Branch: `codex/ink-attack-concepts` · Worktree: `/tmp/rift-ink-concepts`.
User requested their illustrated references combined with Guilty Gear / BlazBlue attack and movement effects. Scope: original concept boards, sequential sprite-style sheets, research and production handoff. No live character, rig, animator, combat or effects implementation edits. Claude retains model work.

INK-ENERGY-CONCEPT delivery: four original 1536×1024 boards in `art/concepts/ink-energy-v1/README.md`: six effect sequences, corrected Tala four-action keys, fantasy roster and Ink Street roster variant. Research sources, exact prompts, existing move/timing mapping and transparent-atlas production requirements included. Codex recommends Ink Street for the supplied references; Adam has not selected it yet. These are opaque concept boards, not runtime assets. No changes to Claude’s models/animators or live effects. Baseline 429 tests pass.

## INK-FX-01 — First playable ink effects
Owner: **Codex** · Status: **Implemented — awaiting normal-speed verdict** · Branch: `codex/ink-fx` · Worktree: `/tmp/rift-ink-fx`.
User approved implementation of the concept direction: Aegis beam, Tala charge and capture ring first. Scope: original layered effect geometry, projectile/attack-effects modules, render integration, tests and capture evidence. No character models, rig, animator, combat rules or timing edits. Claude retains animation work.

INK-FX-01 handoff: original layered vector silhouettes replace the beam tube, Tala charge cones and capture rim. Four pooled drawings at 12 Hz; simulation-clock updates; reduced-motion static variants. Capture remains an open camera-facing ring. Sandbox supports `effects=full`. 445 tests pass, including collision-size preservation, reduced-motion behavior and reset/interruption cleanup. See `docs/INK_EFFECTS.md` and `art/review-2026-10-26/ink-fx/README.md` for evidence and limits. No rig, model, animator or combat changes. Next: Adam’s normal-speed verdict, then muzzle/release breakup and other fighters; fist trails and foot dust wait for Claude’s poses.

## SIM-FLUIDITY — Frame states, buffering, travel and beam finish
Owner: **Codex** · Status: **Implemented — awaiting normal-speed verdict** · Branch: `codex/combat-fluidity` · Worktree: `/tmp/rift-ink-fx`.
Synced main through `3e4b306` (Claude motion-weight). User authorizes combat.js/combat-travel.js, recovery/input integration, main-loop hitstop ownership and VFX polish. No character meshes or pose math edits. Add 4f jumpSquat, grounded knockdown/12f getUp, 6f pending input, final-5f travel cancels, burst/brake travel, simulation hitstop/knockback, hand beam release/breakup. Renderer edits limited to effect attachment/freeze plumbing; Claude retains pose ownership. Normal-speed acceptance remains open.

SIM-FLUIDITY handoff: **473 tests pass** (457 synced baseline + 16 new). Four-frame grounded jumpSquat; grounded down hold and twelve-frame getUp; six-frame newest-command buffer, including hitstop; final-five-frame attack/guard travel cancels; front-loaded bounded travel with delta/speed; simulation-owned 6/10/12f hitstop and eight-frame decaying recoil. Aerial pursuit compensates pending recoil. Removed the old late wake-up attack skip. Existing combat-travel assertions are unchanged. Frame-data test helpers now distinguish advancing frames from frozen updates; dedicated raw-update tests cover pause and buffer boundaries. Aegis free-hand release connector, camera-facing nose flare and six-tick breakup verified in Chrome with zero exceptions and cleanup checked. No character or pose math edits. Contract: `docs/COMBAT_FLUIDITY.md`; captures: `art/review-2026-10-26/combat-fluidity/README.md`. Claude: bind squat/rise to player.jumpSquat/player.getUp and cadence to travel.delta/speed. Normal-speed acceptance remains open.

SIM-FLUIDITY release follow-up: `dacafb8` contains the full implementation; final regression clears hitstop at K.O. so ceremony animation continues. Full suite: 473/473. Character/pose work remains unchanged.

## VFX-3D — Volumetric ink assets
Owner: **Codex** · Status: **Implemented — awaiting normal-speed verdict** · Branch: `codex/volumetric-effects` · Worktree: `/tmp/rift-ink-fx`.
User clarified attack assets must be 3D. Sync includes Claude snap-and-step `f1e9bea`. Replace planar beam/charge/ring shapes with closed depth meshes; replace camera-facing flares with faceted 3D bursts and scatter fragments in XYZ. Preserve flat-color ink palette, collision and all character/pose work. Capture ring remains hollow, not an orb. Review from multiple camera angles; awaiting normal-speed verdict.

VFX-3D handoff: closed axial beam and raised white channels; thick hollow binding ring; extruded Tala charge meshes; six-axis release/nose bursts; XYZ breakup. World orientation replaces camera billboarding. Baked face shades preserve flat-color styling. Baseline **503 tests**, release **506 tests pass**; volume/normals/depth/orientation/scatter regressions added. Three asset-review camera angles plus actual beam lock-on capture show no browser exceptions. Evidence: `art/review-2026-10-26/volumetric-effects/README.md`; implementation: `docs/VOLUMETRIC_EFFECTS.md`. No combat, model or pose changes.

## KINETIC-VFX — Weapon arcs, signature volumes and ground bounce
Owner: **Codex** · Status: **Implemented — awaiting normal-speed verdict** · Branch: `codex/kinetic-vfx` · Worktree: `/tmp/rift-ink-fx`.
Synced Claude through `7134603`. User assigns projectile/ink-energy/trail/attack/beam/burst effects, effect-only render plumbing and combat ground-bounce timing. No character, rig or pose math edits. Sample actual weapon surfaces over seven simulation frames; signature 3D charge/projectile/burst assets; socket-bound capture and release; explicit bounce event and wakeup handoff. Captures under `art/review-2026-10-26/kinetic-vfx/`; visual acceptance awaits normal-speed verdict.

KINETIC-VFX implementation: seven simulation-frame blade samples from measured tagged sword geometry; Aegis ink/cyan cutting band and Morrow crimson/violet irregular band with edge fragments. Six original solid signature volumes drive projectiles, limb charge and cinematic/area effects; palm release has helical beam ribs and directional breakup; Tala wrists/ankles carry chi coils, capture follows chest/pelvis and shatters after exit. Launch floor contact emits groundBounce once, twelve-frame rebound precedes down/12f getUp; pursuit finisher gains an eight-frame slam. No rig or pose edits. Contract and limits: `docs/KINETIC_VFX.md`. **524 unit tests pass**, plus 12 targeted blade/socket/bounce checks after endpoint refinement. Local capture was stopped due machine load; branch-preview cloud capture/smoke next.

KINETIC-VFX integration: rebased onto Claude kinetic-chain `9a5a18a` without model/pose changes. **526 tests pass** on the combined build; 18 targeted tests also verify exact zero-height settlement after the rebound. First cloud preview smoke/captures passed (`40372749004`), but visual review found broad sheet-like arcs and dark coil occlusion. Corrected with measured-path curve subdivision, tapered vertex-alpha history, exposed chi highlights, beam-tail clipping and capture framing. Final cloud recapture pending.

KINETIC-VFX final review: **526 unit tests pass**, cloud preview smoke/model checks/captures **passed** on `41dae0e` ([run 40376269485](https://github.com/Tusingw29/rift-duel/actions/runs/40376269485)). Evidence inspected and saved in `art/review-2026-10-26/kinetic-vfx/README.md`, including side/player views and six signature volumes. Grounded settlement is exact; no model/rig/pose diffs against Claude kinetic-chain. Ready to publish; visual acceptance remains awaiting Adam at normal speed. Claude: `docs/KINETIC_VFX.md` gives slam/bounce/getUp and socket contracts; bind rebound body pose to the new frames without adding another visual-only bounce.

ROSTER-ENERGY rear-review finding: run 40478042999 passed technically, but Morrow remained occluded by his cape at release +16f. Codex is adjusting only the flow preview lock-camera shoulder offset in `render.js`; no model, rig, pose or animation math changes. The other three showed non-flat shapes at +16f.

ROSTER-ENERGY rear-review handoff: `73af409` adds true rear capture samples; `6ee5db8` adds steady preview shoulder clearance. `npm run prepare:release` and `npm test` passed locally with explicit Bash script shell (**592/592**) after the clean rebase onto `a3ff8c4`. Corrected cloud run 40478793913 passed. Publish build `4b51ad213491`; preserve early Morrow +4f occlusion as an open visual issue, not a completed acceptance item.
