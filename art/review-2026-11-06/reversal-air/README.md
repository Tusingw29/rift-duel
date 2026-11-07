# REVERSAL-AIR — reversal contact and recovery choices

**The linear reversal is repaired. For the air test, start with `airlock=12`: it prevents the first-frame escape while allowing a 15-frame reaction to stop pursuit after one hit. `airlock=20` is harsher: the defender must wait until frame 21 and takes two hits before escaping.** These outcomes hold for all six attackers against each of the other five fighters. Neither setting guarantees the entire three-hit pursuit; an early press that is never repeated does lose to all three hits. Both settings remain playtest guesses, awaiting Adam's normal-speed verdict.

Branch `codex/capture-seal`, addendum to CAPTURE-SEAL. Runtime build `f7116242389d`. No renderer, character, rig, pose, animation or numeric default changes. The existing default simulation fingerprint and frozen replay tests remain the checks against accidental changes.

## What was fixed

The reversal created inside `hit()` now receives `applyLinearMove` alongside its existing balance data. With `step=linear` it has the ordinary light-strike half-width of 0.7, rather than an undefined width. Without that switch the helper does nothing. All six defenders return exactly `REVERSAL_DAMAGE (8) × power` with and without linear contact. Tala attacking Morrow takes **9.92** damage from Morrow's reversal. The corrected OPTIONS-AUDIT `chain3 → reversal` column is **D in all 30 pairs**.

`airlock=12` and `airlock=20` register a per-fighter launch clock outside the default serialized state. The next N advancing simulation frames reject air recovery; a fresh press on N+1 succeeds. Hitstop pauses the clock. Holding guard or tapping before unlock does not schedule an automatic escape. The intermediate pursuit hits extend the same launch rather than restarting its lockout. A genuinely new launch resets it. Ordinary jumping recovery remains unchanged. The option is passed through normal matches, lessons and recording/replay configuration.

## The audit needed correction too

The untouched imported audit and its results are preserved in [control/tables.md](control/tables.md), from pre-fix build `60835d58ed62` / source `a2ff6bb`, using Claude's `811c3df` scripts. Its original **D 25/30** early-recovery headline is not a confirmed-airborne comparison:

1. The setup stopped after 20 updates. Five fighters' launchers had not connected; Tala was the exception. Aegis/Rei/Sol/Vesper have 20f startup and Morrow 24f, and action creation adds an update. Many cases were grounded guard/parry.
2. Guard was then held through launcher hitstop, which can expire the six-input-frame buffer before an advancing airborne frame.
3. The pursuit trigger waited for the launcher's entire recovery, although a confirmed launcher can cancel immediately into pursuit.

The current audit waits for a real landed launch, consumes its contact freeze with neutral input, and uses the existing confirmed-launch pursuit cancel. It asserts that all six setup launches connected. It adds recovery-at-unlock and late-recovery columns. The original audit remains on Claude's branch and the old local control results are retained. **Changes to the old air table cannot be attributed solely to airlock.**

Corrected comparisons: [no lockout](fixed-no-lock/tables.md), [12 frames](airlock12/tables.md), [20 frames](airlock20/tables.md). Each covers all 30 ordered distinct fighter pairs across close, tip, third hit, middle, far, air and wake-up situations. The audit scores the first hit/punish, so its **A** can mean only the first pursuit beat connected; it cannot prove the whole sequence is guaranteed.

## Complete sequence, not just the first hit

[Full timing tables](timelines.md) and [3,480 complete timelines](timelines.json) follow each fixture for 400 input updates. These are deterministic option fixtures, not bot win-rate estimates; confidence intervals do not apply. All 30 distinct pairs are covered. Recovery reactions use advancing simulation frames, with contact freeze paused, matching the audit's clock. A reaction to the launch itself is different from reacting to pursuit.

For every attacking fighter — **Aegis, Rei, Tala, Morrow, Sol and Vesper** — immediate confirmed pursuit starts at launch +1 and hits at +8, +17 and +26:

| Defender's choice | No lockout | airlock=12 | airlock=20 |
|---|---|---|---|
| First advancing airborne frame; no retry | Clean escape, 30/30 | No recovery; three hits, 30/30 | No recovery; three hits, 30/30 |
| First legal recovery frame | Clean escape at +1 | Escape at +13 after one hit | Escape at +21 after two hits |
| React to pursuit at 15f, wait for unlock if necessary | Escape at +16 after one hit | Escape at +16 after one hit | Escape at +21 after two hits |
| Tap at pursuit +15f, **without** waiting/retrying | Escape after one hit | Escape after one hit | Tap rejected; three hits |
| No recovery | Three hits | Three hits | Three hits |

Each row applies to all five opponents of every attacker; the per-fighter table is in `timelines.md`. Thus **reaction recovery remains possible after unlock for all six fighters**, but does not erase the damage already received. This is a partial guaranteed follow-up when pursued immediately, with a remaining recovery decision — not an entirely guaranteed three-hit combo.

**Attacker's read:** delaying pursuit 24f loses completely to the first legal recovery (+13 or +21): zero pursuit hits in all 30 pairs. Waiting to recover until launch +35 instead is caught by that delayed pursuit's first hit, then escapes the remainder. Immediate pursuit catches that same +35 press after the slam has already begun, landing all three hits. Delaying pursuit 12f likewise loses to +13 recovery under airlock12, whereas immediate pursuit lands one hit. The timing choices therefore have real costs, although these fixtures do not establish a balanced competitive mix-up. There is no added invulnerability, pursuit cancel, damage or hitbox rule.

## Verification and use

- **878 tests pass across 112 files** (`node scripts/run-tests.mjs`, exit 0). Covers exact reversal damage, lockout boundaries, held/early guard, hitstop, re-launch versus pursuit extension, voluntary jumping, record/replay, confirmed-launch fixtures and default fingerprint.
- Default numeric roster matches `a2ff6bb`; regenerating balance data updated source line references only.
- [Browser keyboard/replay smoke](browser/browser.json): default, airlock12 and airlock20; early recovery succeeds only without lockout; holding guard through unlock cannot escape; a fresh post-unlock tap does. All three downloaded recordings replay exactly, zero page errors. The input smoke deliberately stubs rendering; this is not visual or normal-speed approval. No artwork changed.
- CAPTURE-SEAL's previous 27,360-bout study remains archived against its own build. It was not relabeled as a tournament of this new build. Its workflow remains manually runnable; a scoped REVERSAL-AIR workflow checks this addendum.

Run `node scripts/run-tests.mjs`, `node scripts/reversal-air/measure.mjs`, and `node scripts/options-audit/audit.mjs <folder> --opts=airlock=12` (or `20`). Browser harness: `scripts/review/reversal-air.mjs`, using the shared external review tools.

Local preview (server 4226, recordings enabled, Adam's preferred side controls):

- [airlock12](http://localhost:4226/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&controls=side&record=1&airlock=12)
- [airlock20](http://localhost:4226/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&controls=side&record=1&airlock=20)
- [No air lockout comparison](http://localhost:4226/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&controls=side&record=1)

The options combine with CAPTURE-SEAL's existing query switches. Removing `airlock` restores existing air recovery; removing `step=linear` restores existing contact geometry. Preview only, no merge to main.

**Final verification:** [Cloud run 42320764120](https://github.com/Tusingw29/rift-duel/actions/runs/42320764120) passed on `f42f402`: 878 tests, release preparation, all three corrected audits, 3,480 complete timelines, and all three browser keyboard/download/replay cases. Default fingerprint unchanged. Status: **Review, awaiting Adam’s normal-speed verdict**.
