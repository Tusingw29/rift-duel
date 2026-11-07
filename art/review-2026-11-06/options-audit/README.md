# OPTIONS-AUDIT: what beats what, per situation

2026-11-06 · Claude · branch `claude/options-audit` (from capture-loop `15d89ef`, build `4424f1ffbb13`) · analysis only, no gameplay change.

Adam asked how to add depth to the Evil Zone mechanics Rift Duel already has. The test used here: a situation has depth when every option has an answer, the answer arrives in time, and a successful answer earns something. This audit plays every attacker option against every defender option, in six situations, for all 30 ordered fighter pairs, on the real simulation with Adam's switches (`move=v2&arena=ring&burst=v2&step=linear`). A second run adds `rangedcap=guard&capturewake=inv` ([guard-wake/tables.md](guard-wake/tables.md)).

## Answers first

1. **Close range (2 units) already works as a guessing game.** A strike beats a grab and loses to guard. A grab beats guard and loses to a strike, a sidestep, or a timed break. Guard and a fresh guard tap beat strikes. Nothing at close range can be answered on reaction at 15 frames, which is fine for close range: it should be reads.
2. **Wake-up is the healthiest situation.** It's a real cycle: a meaty hit beats waiting and the get-up attack; a guarded get-up beats meaty hits and meaty grabs; a grab delayed until they stand beats a guarded get-up, rolls and waiting; the get-up attack beats the delayed options.
3. **Middle and far range have no risk.** Nothing an attacker does there gets punished, whatever the defender does. Guarding, breaking and sidestepping only avoid damage. At 5 units the grab circle beats guard, sidestep, backdash, walking in, charging and waiting; the only answer is shooting at the same moment. Turning on `rangedcap=guard` makes guard safe against it, but still doesn't punish it.
4. **The third hit of a chain is half a guess.** Guarding then punishing beats an on-time third hit, a stop and a delayed hit; a grab after hit 2 beats guarding. **The defensive reversal is broken with `step=linear`**: it stops the third hit, but its counter strike never connects (0 damage, against 9.9 without `step=linear`).
5. **After a launcher, the defender always wins by tapping guard immediately.** Air recovery has no lockout: an early tap escapes the pursuit and punishes the attacker in 25 of 30 pairs. Reacting to the pursuit (15f) never works. So launcher into pursuit isn't a guess; whether it works depends only on whether the defender knows to tap early.

## Holes, most important first

| # | Hole | Evidence (committed guess unless noted, 30 pairs) | Lane |
|---|---|---|---|
| 1 | Middle and far range: no option is ever punished; the circle beats almost everything | middle `grab` row: A against guard, sidestep, backdash, walk-in, charge, wait; D only against `shot`. Far: every defender answer to shots, specials and the grab is `=` or a loss | Codex: CAPTURE-SEAL (fixed seal, commitment, escape dash) |
| 2 | Backing out of a close grab gets you caught by the circle anyway | close `grab` vs `backdash`: A 30/30. Third hit: `chain2grab` vs `backdashAfter2`: A | Codex: `grab=locked` (in CAPTURE-SEAL) |
| 3 | The close grab outreaches strikes | tip (2.8 units) `grab` vs `strike`: A 15/30, the fighters whose strike reach is under 2.8 | Codex: `grab=locked,reach` |
| 4 | Third-hit reversal never hits with `step=linear` | Tala→Morrow: attacker HP 100.0 with `step=linear`, 90.1 without; all `reversal` cells `=`. Cause: `dist/reversal.js` builds its move without `applyLinearMove`, so it has no `hitWidth` and `insideLine` always fails. No other move has this gap | Codex: one-line fix |
| 5 | Early air recovery beats everything after a launcher | air: `airRecover` vs `pursuitAir` D 25/30, vs `wait` D 25/30; `airRecoverReact` loses 30/30 | Codex: an air-recovery lockout after a launch, or a read for the attacker that beats early recovery |
| 6 | A sidestepped jab at point blank is safe | close `strike` vs `sidestep`: `=` 30/30 (at 2.8 units the sidestep punishes it 29/30) | Taste: keep jabs safe, or lengthen recovery? |
| 7 | The sidestep-covering form of the toward special covers sidesteps only half the time | middle `towardAlt` vs `sidestep`: D 15/30 (the away form, `awayAlt`, beats sidestep 25/30) | Codex tuning, plus Claude's wind-up tell |

## Tells that need to be readable (Claude's lane)

The healthy situations only play as guesses if each option looks different at normal speed:

- **Wake-up:** a guarded get-up, a get-up attack, a roll and a plain get-up need distinct starts. On the attacker's side, a meaty hit needs to look different from a delayed grab.
- **Third hit:** the existing on-screen prompt ("THIRD HIT INCOMING") plus a visible gap for a delayed third hit.
- **Straight vs sidestep-covering specials:** the extra-tap wind-up should change shape.
- **Seal:** the closing ring and the escape cue once Codex adds the seal state.

## How it was measured

- `scripts/options-audit/lib.mjs`:
  - An exchange places two fighters and runs an option for each, starting at a trigger: committed at frame 0, or 15 frames after the attacker's first visible action.
  - The first hit, grab, block, perfect guard or capture break settles it.
  - After a block, break, perfect guard or whiff (once no projectile is still coming at anyone), a **punish probe** runs: whoever can act first attacks (walking in, then pursuit or a strike), and the other side guards as soon as it can act.
  - A punish counts only if it lands.
  - **A** = the attacker's option gained, **D** = the defender's gained, **=** = nobody could punish.
- `scripts/options-audit/audit.mjs` defines the situations, options and triggers, and writes [audit.json](audit.json) (every cell with its tally, plus Tala↔Morrow example events) and [tables.md](tables.md).
- Run: `node scripts/options-audit/audit.mjs [outDir] [--opts=key=value,...]`, about 20 s. `tests/options-audit.test.mjs` checks determinism and scoring. Full suite: 810 tests pass.

## Limits

- These are scripted options, not players. Each committed cell is one fixed timing per option. A cell shows whether an answer exists and arrives, not how often players choose it.
- Positions start square-on in open space. Edge-of-ring and side-angle cases aren't covered.
- The 15f reaction runs assume a perfect watcher with a fixed delay; real reactions vary.
- The seal, `grab=locked` and the escape dash aren't built yet. Rerun this audit on `codex/capture-seal` when they are; the tables there should show middle and far range with real punishes.
- How readable these options are at normal speed needs Adam's verdict.
