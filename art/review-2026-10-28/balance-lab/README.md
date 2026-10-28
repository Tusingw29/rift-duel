# BALANCE-LAB (2026-10-28)

Owner Claude. Branch `claude/balance-lab`. **Status: Review, awaiting Adam's verdict.**

This is an in-repo balance lab that reads every fighter, move and shared rule from the game's code. You can tune values in the browser and export the result. No combat rule or timing changed: `dist/combat.js`, `moves.js`, `techniques.js`, `special-variants.js`, `stock-specials.js` and `fighters.js` are untouched.

**Open it:** `dist/balance-lab.html`. It is a tool page like the VFX workbench and is not linked from the game.

## Pieces

| Piece | What it does |
| --- | --- |
| `scripts/balance/extract.mjs` (`npm run balance:extract`) | Imports `fighters.js`, `moves.js`, `techniques.js`, `special-variants.js`, `stock-specials.js`, `reversal.js`, `recovery.js` and `combat-travel.js`, and writes `dist/balance/roster.json`: 6 fighters, 116 moves and the shared constants. |
| `dist/balance/formulas.js` | Every formula in the brief. Shared by the page and the tests, and identical to the hosted Rift Duel Frame Codex. |
| `dist/balance-lab.html` + `balance-lab.js` | Tune, Balance, Matchups, Game rules and Changes tabs; new fighter from a template; live checks; localStorage; JSON export and import; Codex task text. |
| `tests/balance-lab.test.mjs` | 8 tests: the committed roster equals a fresh extract, the known values, and the export/import round-trip. |
| `docs/DESIGN.md` | Its two stale timing tables (the 0.4 combat table that listed Tala at 5/1/14, and the 0.7 technique table) are replaced by a note pointing here. |

**Literals in `dist/combat.js`.** Values that are literals rather than exports are read from the source by named patterns: the stuns, chip, perfect guard, capture break, and the damage and range of strikes, shots, captures, the launcher, pursuit, crossover and burst.
- The line numbers are listed in the extract's header comment and recorded in `roster.json` under `sources`.
- If a literal changes, the extract follows it. If a pattern stops matching, the extract fails with the pattern's name instead of using a stale number. The test checks both cases.

Every move row also names its source file in `source` (for example `dist/moves.js moveTiming 'strike' chain 1`, `dist/combat.js line 242`). The Codex task text uses it.

## Same formulas as the hosted Frame Codex

The settings shape is the hosted one: `hitstun, launchStun, blockstun, chip, perfectGuard, captureBreak, splitGuard, reaction, band, cancel1, cancel2`. The derived columns, scores, playstyle, checks and matchup verdicts use the hosted functions, ported line for line.

**Export format:** `{sys:{...}, fighters:{id:{id,name,color,intended,custom,stats:{speed,power,reach,shotSpeed},moves:[{key,startup,active,recovery,base}]}}}`.
- A custom fighter also carries `template`, so it can be rebuilt on import.
- A hosted file without it still imports, using the first fighter as the template.
- Unknown fighters and move keys are skipped and reported.

**Every move key matches the hosted one**, including `system-capture-close-`, so the two tools can trade tuning files.

**All the shared constants match:** hit stun 19, launch stun 49, block stun 7, chip 0.12, perfect guard 10, capture break 12, cancels 14 and 20, reversal window 6.

**Where the repo differs from the hosted lab, the code is right.** These fields of the hosted lab's starting data don't match what the game does:

| Rows | Hosted | Code | Why |
| --- | --- | --- | --- |
| 10 special variants: Split current, Spirit wings, Sword fan, Twin spark, Crosswind discs, Ground salvo, Falling ember, Twin dragons, Fourfold flame, Astral blast | 4 active | **1 active** | `applySpecialVariant` sets `active = variant.active \|\| 1 + (pulses − 1) × interval` |
| Morrow · Iron lance | Rush, 2.5 reach | **Projectile**, 47 (speed 18) | The `lance` technique fires an 18-speed beam (`combat.js` line 163) |
| Vesper · Orbit fan | base 7 | **base 21** | `fan` fires three rings of 7; the brief sums multi-hit damage |
| Vesper · Astral wheel | range "Projectile" | 23 (speed 9) | Range text only |
| Aegis · Twin drive, Tala · Skybreaker kick | no travel | travels 5.6 / 3.5 | Range text only: the technique still moves while active |

Importing a repo export into the hosted lab won't fix its starting data, because the hosted lab keeps its own baseline. To make the two agree on these rows, regenerate the hosted lab's data from `dist/balance/roster.json`.

## Browser check: Morrow Strike 1 recovery 20 → 40

I opened the lab at `?fighter=morrow` and typed 40 into Strike 1's recovery cell in the real table.

| | Before | After |
| --- | --- | --- |
| Header | "Matches the code" | "1 change set vs code", Changes tab badge 1 |
| Cell | | Highlighted, tooltip "Code: 20 · dist/moves.js moveTiming 'strike' chain 1" |
| Morrow Strike 1 | 11/3/20, −15 on block, −3 on hit | 11/3/40, −35 on block, −23 on hit |
| Side panel: whiffs punishable on reaction | 0 of 5 | 5 of 5 |
| Matchup row "Morrow whiffs" | 5 × Guess punish | 5 × **Reaction punish** (outlined), margins +6 to +14 |
| First live check | "No Strike 1 whiff can be punished on reaction" | "5 pairings can punish a whiff on reaction" |
| Changes tab | "No changes yet" | `MORROW: - Strike 1 recovery: 20 -> 40 (dist/moves.js moveTiming 'strike' chain 1)` |
| Reload | | The edit persists (localStorage) |

No page errors.

**Also checked in the page:**
- **New fighter:** Kade, created from Tala with 20 moves, appears in the Codex text as a new `fighters.js` entry.
- **Split guard:** turning it on flips the guard check to "The defender has to guess".
- **Export and import:** export, reset everything, then import the file restores all seven fighters and the rule change.
- **Phone width (390 px):** no sideways page scroll; the move table scrolls inside its box.

**Captures:**
- `before-tune-morrow.jpg`, `after-tune-morrow.jpg`
- `before-matchups.jpg`, `after-matchups.jpg`
- `after-changes.jpg`
- `before-balance.jpg` (roster cards and live checks on main)
- `rules-split-guard.jpg`
- `phone-tune.jpg`

## What the lab says about main

These are estimates from the constants, about ±2 frames.

- **Missed strike:** no Strike 1 whiff is punishable on reaction. The closest is Rei punishing Aegis, still 5 frames short.
- **Blocked chain:** after a blocked hit, the defender wins both choices for every fighter.
- **Guard:** one guard tap beats both strike and capture (10 shared frames).
- **Identity:** Aegis and Vesper have no clear strength (no score reaches 55).
- **Hit confirm:** only Tala's Strike 1 is plus on hit (+1).

Playstyles from the numbers:

| Fighter | Numbers say | Intended |
| --- | --- | --- |
| Aegis | Balanced | Balanced / beam specialist |
| Rei | Rushdown | Sword / agile pressure |
| Tala | Rushdown | Close combat / rushdown |
| Morrow | Footsies | Heavy / punishing reach |
| Sol | Zoner | Ranged / rapid projectiles |
| Vesper | Balanced | Control / rings and traps |

This agrees with the simulation-measured tables from SPACING-COMMITMENT (`docs/FRAME_ADVANTAGE.md` on that branch), which also found every blocked hit minus and no whiff punishable on reaction.

## Hand-off for Codex (not built)

**Proposal: an opt-in `&balance=local` simulation switch.** It would let Adam play tuned values at normal speed.

1. **Load the tuning.** The game (`index.html`) and sandbox read the lab's tuning: localStorage key `rift-balance-lab`, or a `&balance=<url to an exported JSON>`.
2. **Apply it at match creation, behind the switch.** Copy the values onto the match, as SPACING-COMMITMENT does with `m.rules`, so replays stay deterministic.
   - `moveTiming` gets an override hook keyed by fighter and move key. For example `chain-strike-1` maps to `moveTiming(f,'strike',1)`, and the `source` field in `roster.json` names the hook for every row.
   - Base damage goes through the same table.
   - Fighter stats override the `fighters.js` entry for that match only.
   - Rules: hit stun, block stun, chip and the guard windows become match rules, read where the literals sit today. The extract records their line numbers.
3. **Make it obvious.** A visible "TUNED VALUES" badge in the HUD, so a tuned match is never mistaken for the real game.
4. **Tests:** no param means a fingerprint identical to main (the SPACING-COMMITMENT fingerprint test is a template), override equals the expected frame for a sample of moves, and replay equals step.

Codex owns this because it touches combat timing.

## Tests

616 pass: the 608 before, plus 8 new in `tests/balance-lab.test.mjs`. `npm run prepare:release` was run so the new page and modules are stamped. `dist/balance-lab.html` was added to the stamped pages in `scripts/prepare-release.mjs`.

## Limits

- **Estimates, not measurements:** frame advantage and whiff verdicts come from the constants (±2 frames), not the simulation. Pushback, chain step-in and hitstop are ignored, as in the hosted lab.
- **Shared timings:** these appear on several rows (every shot uses `moveTiming 'shot'`; a special and its variant share startup and recovery). Editing one row in the lab doesn't change its siblings. The Codex text says so.
- **Prose fields:** beats, loses-to and effect come from a text table in the extractor that matches the hosted wording. Their numbers (capture window, multipliers, ranges, stun times) are read from code.
