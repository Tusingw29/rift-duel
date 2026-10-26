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

## Handoff log

| Date | Agent | Task | Change / evidence / next step |
| --- | --- | --- | --- |
| 2026-10-25 | Codex | ART-TALA-GRAPHIC | Round 2: face proportions, layered head-anchored ponytail, modeled curled fingers and fitted shoulder panels. Preserves live combat animation. [Before/release captures](../art/review-2026-10-25/tala-graphic-polish/README.md); root/tip deformation regression added; downloadable pack rebuilt. Shoulder seams and faceting still need refinement. Awaiting normal-speed verdict. |
| 2026-10-25 | Codex | EZ-05–11 | Mechanics, Duel camera and nine guided lessons implemented. Preserved Claude’s sandbox/rig schema `e2c8699`. **390 tests pass**; [cloud review](https://github.com/Tusingw29/rift-duel/actions/runs/40237435218) checks real lesson flow, remapped input/controller prompts, Pressure Dash pause, 21 camera/capture/ring views and portrait fit. Detailed animation polish, physical controllers and Adam’s normal-speed/first-play verdict remain deferred. |
| 2026-10-25 | Claude | EZ-02 | First pass merged: Rei, Sol and Vesper moved from the time-based shared animator to the grounded whole-body system (authored stance, crossed guard, hit reaction, charge, distance-driven footwork, three keyed strikes each). Status Review. Next: Adam's normal-speed verdict; then recoil momentum and push-off weight across the roster. |
| 2026-10-25 | Claude | EZ-02 | Claimed. Starting with Tala's guard brace, locomotion weight transfer and chain momentum on branch `claude/ez-02-whole-body`; review on `tala-blender.html` and in the fight camera before extending to Aegis and Morrow. |
| 2026-10-25 | Codex | EZ-03 | Rules, HUD, training feedback and CPU recovery implemented. Integrated Claude’s travel choreography `a80ce24`. Cloud review: [40229272655](https://github.com/Tusingw29/rift-duel/actions/runs/40229272655). Normal-speed balance and dedicated stagger/recovery posing remain open. Next mechanics task: EZ-04 third-hit defensive reversal. |
| 2026-10-25 | Codex | Integration | Merged Claude’s EZ-02 commit `1622f2e` into EZ-01 (`c3e99b5`). Preserved both implementations and regenerated page import maps. No duplicate simulation displacement added. |
| 2026-10-25 | Codex | EZ-01 | Implemented continuous travel in `3ce8a17`; review pending. Grounded pursuit keeps frame-7 contact; crossover uses frame 18; circle uses 24 frames. EZ-02 can consume the travel state described above. |
| 2026-10-25 | Codex | EZ-04 | Third-hit reversal, 20 focused tests, repeat-three-hit practice dummy and controls/manual implemented. Integrated Claude’s hit-reaction fix `84c1d96`. 351 tests pass; browser review passed without exceptions. Review: [40231237705](https://github.com/Tusingw29/rift-duel/actions/runs/40231237705). Existing first-strike pose is reused; distinct reversal posing, normal-speed timing acceptance and physical-controller review remain open. Next mechanics task: EZ-05 downed defense/get-up transitions. |
| 2026-10-25 | Claude | EZ-02 | Hit reaction: inverted hurt timer fixed on five fighters, shared recoil timeline with foot catch (`84c1d96`); 331 tests pass. |
| 2026-10-25 | Claude | EZ-03 / EZ-04 animation | Stagger reel (knees buckled, sway, head lolling, straightening with each recovery tap, snap upright on recovery) and the third-hit reversal return strike (forward drive out of the guard) added to every grounded animator via shared `staggerPose` / `reversalPose`; planted feet kept during the reel. `tests/stagger-reversal-animation.test.mjs` covers all six fighters through the sandbox scenarios. Sandbox gained a camera zoom. |
| 2026-10-25 | Claude | Tooling | Local animation sandbox (`dist/sandbox.html`, scripted deterministic scenarios in `dist/sandbox-recipes.js`, frame scrub, skeleton/hurtbox/hit-arc overlays), canonical bone schema with alias normalisation (`dist/rig-schema.js`), hardened `scripts/combat-travel-smoke.mjs` (always writes report and screenshots, console capture, fallback-tolerant readiness), determinism tests. A proposal to replace the grounded animators with mixer keyframe clips was reviewed and declined: the animators are already frame-locked to the simulation and the clip conversion would drop planted-foot solving, entry blends and distance-driven gait for no determinism gain. |
| 2026-10-25 | Codex | Planning | Created shared checklist from tutorial study and code comparison. No implementation tasks claimed or completed by this document. Next: claim EZ-01; coordinate EZ-02 with character animation work. |

Do not commit the downloaded reference video. Link to the source and store original game captures or small review artifacts only when appropriate. Research notes are evidence, not exact source-game frame data.

EZ-03 ownership: Codex is editing `combat.js`, new `stagger.js`, HUD/training feedback, and tests. Existing hurt/recover poses will expose the state initially; dedicated stagger/recovery choreography can be refined by Claude using `player.staggerState` (elapsed, remaining, inputs) and `player.counterWindow`. No character rig or root-motion changes planned.
