# Evil Zone feel: shared task checklist

Updated: 2026-10-25. Starting code: `c4f798d`.

Shared board for Codex, Claude, and Adam. This tracks the gaps identified from [EVIL ZONE (PS1) – Practice Tutorials, lcfreezer](https://www.youtube.com/watch?v=7AqlL6_7as8), compared with Rift Duel. Preserve the original roster and approved concept art; use the reference to study behavior and timing.

## How we work together

- Before implementation, pull the latest code, claim a task below with your name, branch, and status, and push that claim. Recheck for another claim before editing shared files.
- Status: **Ready → In progress → Review → Done**. An unchecked box is unfinished, including work awaiting visual review. Record blockers explicitly.
- Suggested split: **Codex: combat rules, movement paths, input, training. Claude: character art and animation.** These are suggested lanes, not claims or evidence that another agent has started.
- Coordinate before both editing `dist/combat.js`, `dist/animation.js`, or the same character animator. Use separate branches/worktrees; do not overwrite another session's uncommitted work.
- Each completed task needs a commit/PR, verification evidence, and any remaining limits. Automated tests establish behavior; normal-speed playback establishes animation quality. Do not check off visual acceptance from screenshots alone.
- Update this file when claiming, handing off, or finishing work. Keep checks accurate rather than checking off a whole feature because part already exists.

## Already present — preserve and extend

- [x] Tutorial chapter instructions and sampled action frames studied; initial code comparison completed. Exact original frame timings and the full camera algorithm remain unmeasured.
- [x] Opponent-relative approach/retreat/circling, directional commands, and keyboard/controller bindings exist.
- [x] Three-hit chains, directional finish branches, stock attacks, and special follow-ups exist. Their reference fidelity still needs review (EZ-08).
- [x] Timed guard, capture breaks, aerial recovery, and a ground recovery roll exist. They do not complete EZ-03–05.
- [x] Morrow's grounded three-cut redesign has a [playable review page](https://tusingw29.github.io/rift-duel/morrow-attacks.html). This does not establish full-roster animation quality.
- [x] Life-bar charge sweep and gem creation landed in `c4f798d`. Charging transitions still need EZ-06.

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
- [ ] **Partially implemented:** Carry momentum through chained attacks and interrupted recoil; avoid snapping to neutral or holding a frozen walking pose. Rei, Sol and Vesper strikes are keyed wind → drive → contact → follow → retract with entry blends from the current pose; the three cuts differ per fighter and contact lands on the combat frame. Interrupted-recoil polish still open.
- [ ] **Partially implemented:** Review one fighter from front, side, and actual fight camera before extending changes across the roster. Rei reviewed front and side on `fighter-review.html` (idle, guard, run, three cuts) from headless captures; fight-camera and normal-speed review by Adam pending.
- [ ] Verify approved concept silhouettes, weapon grip, foot contact, and hitstop remain intact; record normal-speed clips and Adam's visual verdict.

Completion evidence: `dist/roster-animation.js` + `tests/roster-animation.test.mjs` (12 tests: contact pose exact on the startup frame, distinct cuts, crossed-forearm guard with chin tuck, planted ankles, distance-driven stride, finite rig in all shared states); 275 tests pass; review page `fighter-review.html?fighter=rei|sol|vesper`. Remaining: normal-speed verdict, interrupted-recoil polish, push-off emphasis, EZ-01 travel handoff.

## Priority 2 — defense, stagger, and recovery

### EZ-03 — Accumulated stagger and recovery opportunity

Owner: **Unassigned** · Status: **Ready** · Suggested: Codex

Reference: [knockdown/recovery, 5:30](https://www.youtube.com/watch?v=7AqlL6_7as8&t=330s).

Current gap: ordinary hitstun and launch stun exist, but no accumulated stagger system. The tutorial shows sustained attacks producing a vulnerable state, directional recovery, and a stronger glide opportunity. Exact thresholds are not established by sampled frames.

- [ ] Specify stagger buildup, reset/decay, triggering hits, recovery levels, and visible cues; label unverified values as Rift Duel tuning choices.
- [ ] Implement the stagger state and recovery inputs without confusing them with normal hitstun or knockdown.
- [ ] Add the associated glide/counter opportunity with clear vulnerability and escape windows.
- [ ] Test accumulation, recovery success/failure, round resets, and prevention of unintended permanent stun loops.
- [ ] Review attacker and defender feedback at normal speed; attach evidence.

Completion evidence: _Pending._

### EZ-04 — Third-hit defensive reversal

Owner: **Unassigned** · Status: **Ready** · Suggested: Codex + Claude reaction animation

Reference: [short defense, 4:52](https://www.youtube.com/watch?v=7AqlL6_7as8&t=292s).

Current gap: generic perfect guard stuns the attacker, but the tutorial describes returning the third attack of the close sequence.

- [ ] Define eligible sequence hits and distinguish this reversal from projectile reflection and generic perfect guard.
- [ ] Implement a deliberate defensive timing window, reversal outcome, and interruptible follow-through as appropriate.
- [ ] Test early, correct, and late guard against eligible and ineligible attacks, including both players.
- [ ] Add readable motion and feedback; document the command and review in combat.

Completion evidence: _Pending._

### EZ-05 — Downed defense and get-up transitions

Owner: **Unassigned** · Status: **Ready** · Suggested: Codex + Claude recovery animation

Reference: [down/recovery, 5:17](https://www.youtube.com/watch?v=7AqlL6_7as8&t=317s), [passive defense, 6:00](https://www.youtube.com/watch?v=7AqlL6_7as8&t=360s), [get-up cancellation, 8:00](https://www.youtube.com/watch?v=7AqlL6_7as8&t=480s).

- [ ] Audit existing airborne recovery and ground roll before adding new states.
- [ ] Define downed defense, directional recovery, recovery-level outcomes, and get-up cancel opportunities from the reference.
- [ ] Implement missing transitions with explicit vulnerability, invulnerability, and action-lock windows.
- [ ] Ensure recovery directions are opponent-relative for both players.
- [ ] Test held versus fresh input, repeated inputs, late escape, wall limits, and interrupted recovery.
- [ ] Review grounded weight, landing, roll, and get-up continuity; update controls/manual.

Completion evidence: _Pending._

### EZ-06 — Guard/charge/attack transition rules

Owner: **Unassigned** · Status: **Ready** · Suggested: Codex

Reference: [charging, 2:54](https://www.youtube.com/watch?v=7AqlL6_7as8&t=174s), [guard charging, 7:46](https://www.youtube.com/watch?v=7AqlL6_7as8&t=466s).

Current gap: charge stocks and life-dependent charging exist. The tutorial distinguishes attack delay from charging and a defense-to-attack route that resumes charging quickly. This is not evidence of charging while holding a shield.

- [ ] Write a transition table for neutral charge, release, attack, defense, and resumed charge; verify ambiguous source behavior before asserting parity.
- [ ] Implement the intended delay/cancel rules while retaining the new life-bar sweep and gem feedback.
- [ ] Test partial charge, full stocks, damaged life, interruption, held specials, and keyboard/controller input.
- [ ] Make the timing difference visible in practice and document it.

Completion evidence: _Pending._

## Priority 3 — distinctive attack interactions

### EZ-07 — Expanding long-capture circle

Owner: **Unassigned** · Status: **Ready** · Suggested: Codex mechanics; Claude effects

Reference: [long capture, 4:05](https://www.youtube.com/watch?v=7AqlL6_7as8&t=245s), circle enlargement around 4:19–4:22.

Current gap: long capture is a fixed-radius travelling projectile. The tutorial shows a capture circle enlarged by an additional attack input during its motion.

- [ ] Specify travel/formation, additional-input timing, circle growth limits, capture resolution, and defensive escape.
- [ ] Implement the expanding capture interaction with visual radius matching collision behavior.
- [ ] Preserve existing character-specific capture cinematics after a successful capture.
- [ ] Test no extra input, valid extra input, held input, miss, timed escape, interruption, and simultaneous captures.
- [ ] Review effect readability at fight-camera distance and document the command.

Completion evidence: _Pending._

### EZ-08 — Audit and complete combo branches

Owner: **Unassigned** · Status: **Ready** · Suggested: Codex; Claude for newly needed poses

Reference: [additional blows and continuous attacks, 6:34](https://www.youtube.com/watch?v=7AqlL6_7as8&t=394s), [counterattack, 7:19](https://www.youtube.com/watch?v=7AqlL6_7as8&t=439s).

- [ ] Map each demonstrated basic chain, directional third hit, advanced follow-up, counter follow-up, and moving-target capture to current behavior.
- [ ] Mark each mapping present, different by design, unverified, or missing; do not replace working branches indiscriminately.
- [ ] Implement confirmed missing routes with deliberate input buffers and contact timing.
- [ ] Test hit, block, whiff, interruption, stock cost, and side changes for affected routes.
- [ ] Update move lists and verify each new route reads as one connected sequence.

Completion evidence: _Pending._

### EZ-09 — Pressure Dash contest

Owner: **Unassigned** · Status: **Ready** · Suggested: Codex mechanics; Claude clash motion/effects

Reference: [Pressure Dash, 6:16](https://www.youtube.com/watch?v=7AqlL6_7as8&t=376s).

Current gap: simultaneous capture/super contacts can display POWER CLASH, but there is no timed input contest. The reference triggers a contest when two gliding attacks meet.

- [ ] Define valid opposing glide contacts, contest duration, accepted fresh button presses, tie handling, and CPU participation.
- [ ] Implement the contest as its own state with a readable start, progress, and winner/loser resolution.
- [ ] Keep the existing capture/super clash distinct unless intentionally redesigned and documented.
- [ ] Test keyboard and controller equivalence, held-button rejection, pause/blur, simultaneous inputs, ties, and round end.
- [ ] Add clash/release animation and feedback; review real-time usability and consider an accessible input alternative.

Completion evidence: _Pending._

## Priority 4 — framing and learnability

### EZ-10 — Reassess the fight camera against reference footage

Owner: **Unassigned** · Status: **Ready** · Suggested: Codex

Current gap: earlier documentation called the behind-fighter lock-on view Evil Zone's signature camera. The tutorial frequently uses broadside/three-quarter framing; the exact camera algorithm is not established.

- [ ] Build a shot comparison for neutral distance, close exchanges, circle movement, launch, capture, and recovery.
- [ ] Compare existing side and lock-on cameras, then tune position, angle, distance, and smoothing from evidence.
- [ ] Preserve opponent-relative controls independently of camera placement.
- [ ] Test both fighters' visibility, arena edges, aerial height, effects, HUD overlap, and reduced motion.
- [ ] Review full-speed exchanges and update documentation to avoid unsupported camera-fidelity claims.

Completion evidence: _Pending._

### EZ-11 — Guided practice lessons

Owner: **Unassigned** · Status: **Ready** · Suggested: Codex; implement after affected mechanics stabilize

Current gap: training has dummy choices, input history, and move-phase feedback, but no guided objectives, demonstrations, or pass/fail feedback.

- [ ] Add short lessons for movement, basic chains, charging, timed defense, capture, launch/recovery, and Pressure Dash as those mechanics become ready.
- [ ] Give each lesson a clear command, reproducible setup, success detection, useful retry feedback, and reset.
- [ ] Show bindings for the active keyboard/controller configuration.
- [ ] Allow immediate retry and free practice without long interruptions.
- [ ] Test success, common wrong inputs, reset, input-device change, and leaving the lesson; have Adam try it without external instructions.

Completion evidence: _Pending._

## EZ-01 motion contract for EZ-02

Codex owns simulation X/Z travel in `combat.js` and a separate travel module. Claude should keep pose/root offsets visual only; do not add a second world displacement. Ground pursuit keeps its existing contact frame. Pursuit/crossover expose `move.travel` (kind, frame, frames), and crossover exposes `move.crossover` with startup 18 and air timer set at departure. Circle-step exposes `player.travel` (orbit, frame, frames), uses the existing run pose, and faces the rival continuously; dedicated choreography remains EZ-02. World X/Z travel is applied before rendering; do not repeat it in the rig. Codex is not editing character animators.

## Handoff log

| Date | Agent | Task | Change / evidence / next step |
| --- | --- | --- | --- |
| 2026-10-25 | Claude | EZ-02 | First pass merged: Rei, Sol and Vesper moved from the time-based shared animator to the grounded whole-body system (authored stance, crossed guard, hit reaction, charge, distance-driven footwork, three keyed strikes each). Status Review. Next: Adam's normal-speed verdict; then recoil momentum and push-off weight across the roster. |
| 2026-10-25 | Claude | EZ-02 | Claimed. Starting with Tala's guard brace, locomotion weight transfer and chain momentum on branch `claude/ez-02-whole-body`; review on `tala-blender.html` and in the fight camera before extending to Aegis and Morrow. |
| 2026-10-25 | Codex | Integration | Merged Claude’s EZ-02 commit `1622f2e` into EZ-01 (`c3e99b5`). Preserved both implementations and regenerated page import maps. No duplicate simulation displacement added. |
| 2026-10-25 | Codex | EZ-01 | Implemented continuous travel in `3ce8a17`; review pending. Grounded pursuit keeps frame-7 contact; crossover uses frame 18; circle uses 24 frames. EZ-02 can consume the travel state described above. |
| 2026-10-25 | Codex | Planning | Created shared checklist from tutorial study and code comparison. No implementation tasks claimed or completed by this document. Next: claim EZ-01; coordinate EZ-02 with character animation work. |

Do not commit the downloaded reference video. Link to the source and store original game captures or small review artifacts only when appropriate. Research notes are evidence, not exact source-game frame data.
