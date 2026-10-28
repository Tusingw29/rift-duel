# BALANCE-LOCAL — playable lab tuning (28 October 2026)

Owner Codex · Branch `codex/balance-local` · **Review — awaiting Adam’s normal-speed verdict.** Built on Claude’s `claude/balance-lab` (`6a49a77`), with main claim updates preserved. Neither implementation branch is promoted to main by this task.

## Try it

1. Open [this branch’s balance lab](http://localhost:4202/balance-lab.html?fighter=morrow). Edit Morrow → Strike 1 → Recovery from 20 to 40.
2. Open [the playable preview](http://localhost:4202/?balance=local) or [preview plus flowing effects](http://localhost:4202/?energy=flow&balance=local). Pick Morrow in Training. The banner says **TUNED VALUES**.
3. Compare [normal rules](http://localhost:4202/), or [the tuned sandbox](http://localhost:4202/sandbox.html?balance=local&p1=3&scenario=strike1).
4. Reload the game after making another lab edit. An already-open game/scenario retains its snapshot, including subsequent rounds and sandbox resets. This prevents silent mid-match changes.

The server serves `dist` from `~/rift-worktrees/balance-local` on port 4202. Restart with `python3 -m http.server 4202 --bind 127.0.0.1 --directory dist` in that worktree. Localhost links work on this Mac only.

Browser storage belongs to an origin: the earlier port 4198 lab and this port 4202 lab do **not** share saved tuning. Export JSON from the earlier lab and import it into this branch’s lab if you want to carry those edits over. No user browser storage was modified by automated review; it runs in an isolated browser context.

## Contract and limits

- Explicit `balance=local` reads `rift-balance-lab` and validates it against a fresh code-generated baseline. Without this exact switch, there is no balance storage read or roster fetch, and no balance property added to match state.
- Accepted settings are cloned into each match. Shared fighter/move tables remain unchanged. No character, rig, pose, mocap or animation modules changed; HTML import-map stamps are generated.
- All 116 move rows map to combat: chain strikes/shots, base and alternate specials/techniques, stock variants, capture, launcher, pursuit, crossover, burst and reversal. Timings are independent per row. Damage edits scale original damage; summed multi-hit base damage is distributed across the authored hits. Existing contextual modifiers (back captures, stagger punish, aerial pursuit and counter bonus) remain.
- Pulsed moves compress or expand their authored pulse schedule into the edited active window. Several pulses can share a simulation frame when the window is very short. This is a preview tool, not a promise that extreme settings are balanced or visually attractive.
- Fighter speed, power, reach and shot speed apply per match. Shared hit/launch/block stun, chip, perfect-guard/capture-break windows and chain cancels apply when changed. Unedited values retain exact original seconds, avoiding rounding differences from the lab’s frame display.
- Split guard follows the spacing experiment’s intended separation: fresh capture input breaks capture only while not guarding and free (or starting that capture). A simultaneous guard+capture does not defend both routes.
- Reaction time and spacing band are analysis-only; they do not change CPU reaction speed or movement rules. Fighter names/colors/intended styles are lab annotations. Custom/new fighters are rejected for gameplay with an explanation rather than silently substituted. URL-based tuning imports are not implemented; import a JSON file in the lab instead.
- Validation is atomic. Missing storage, invalid JSON, unsupported rows, duplicate keys, non-finite numbers and out-of-range values show **TUNING NOT APPLIED** and use normal rules. Frames must be integers; startup/active 1–180, recovery 0–240, base damage 0–200. Stats and rules have explicit bounds in `dist/balance-runtime.js`.
- The existing `energy=flow` preview composes with balance. This branch does not incorporate the separately unmerged Blender VFX asset branch.

## Verification

The default simulation fingerprint is generated from unchanged main combat (`ada2f27`): six fighters, 600 input frames each, including movement, strikes, guard, shots, launch, capture and burst. The test compares the full state trace hash, not just health totals.

Unit coverage includes snapshot isolation, all move-key mappings, actual contact damage, fighter speed, guard boundaries, independent variants, deterministic sandbox replay, default no-load behavior, corrupt storage, composed query flags and preservation of multi-hit counts/damage (Siege salvo, Orbit fan, Astral stream).

Browser review driver: `scripts/review/balance-local.mjs`. It edits the real lab cell, checks tuned sandbox state, verifies reload-only updates, starts a real training match with both flags, checks no-flag defaults, and verifies the invalid-data fallback. Captures and result are recorded below after the run.

Normal-speed feel and controller testing remain Adam’s review. Passing tests do not establish a good balance setting.

## Results and inspected evidence

**634 unit tests pass** using `npm --script-shell=/bin/bash test`; roster sync and `git diff --check` pass. Browser review `1793188548504` passed with no console/page errors. [Result JSON](browser-report-1793188548504.json) records the actual game strike at **11 startup / 3 active / 40 recovery**. The final additional single-projectile regression is included in the 634-test run.

| Capture | What was checked |
| --- | --- |
| [Lab edit](lab-recovery-40-1793188548504.jpg) | Real Morrow recovery cell set to 40 and saved. |
| [Tuned sandbox](sandbox-tuned-1793188548504.jpg) | Snapshot uses recovery 40; compact banner leaves controls readable. |
| [Game menu](game-tuned-menu-1793188548504.jpg) | Opt-in status visible before a fight. |
| [Real training strike](game-tuned-fight-1793188548504.jpg) | Keyboard movement and attack; tuned recovery observed through the game debug state; flowing-effects flag present. |
| [Default sandbox](sandbox-default-1793188548504.jpg) | Same saved data, no flag: recovery 20 and no tuning banner. |
| [Invalid tuning](invalid-tuning-1793188548504.jpg) | Corrupt saved JSON produces an explicit error and an untuned match. |

The review also changed saved recovery to 50 while a scenario was open: reset retained 40, reload picked up 50. Test storage was restored to 40 for the real fight, then deliberately corrupted in that isolated context for the failure check.

Visual inspection found and fixed a CSS collision: an `aside` status banner inherited the sandbox sidebar’s height. The corrected banner uses a plain div; the browser asserts it stays below 100px tall at the captured desktop size. Some sandbox captures include asynchronously loading character fallback appearances; these are UI/state evidence, not character-art comparisons. No animation/model edits were made. The remaining verdict is how the chosen tuning feels at normal speed, not whether the override loads.
