# Codex prompt template

Codex finishes in one pass when the prompt states the why, names files and lines, splits the work into switch-gated parts, says exactly what to measure and how results are labelled, and defines done. Adam pastes it as is, so the prompt is one fenced block with no commentary inside it.

```
Task: <NAME>. <One sentence: what changes for Adam.> All behind switches; default gameplay must not change.

Before you start
- git fetch origin. Branch codex/<name> from <base branch — the branch Adam last played, not main, when building on it>.
- Read: <files and line numbers that hold the mechanism, e.g. dist/combat.js ~224 (super contact: d>9 → cinematic)>.
- Claim on docs/EVIL_ZONE_TASKS.md (owner Codex, In progress) and push the claim.

Why (Adam's playtest of <branch/switches>)
- <His words in quotes>. <The cause in code, one line.>
- <Numbers that matter: damage share, startup, reach.>

Part 1: <change> (<switch>=<value>)
- <Exact behaviour. Config values named as constants, called playtest guesses.>
- <What must not change: no extra invulnerability, recovery unchanged, Claude's animation files untouched.>

Part 2: <variant switches for Adam's taste calls, e.g. ring=11, ring=12>

Part N: Measure
- Bots: <stepper and punisher> vs <masher, masher-all>, 10f and 15f, mirrored seats, 5 seeds. Wins with 95% ranges and "could be luck" labels.
- Modes: <baseline> plus each switch on its own and in the combination Adam will play.
- Report both sides of any per-side metric (edge time, pinned hits), and masher wins alongside skilled wins.
- Fixtures for anything bots can't show: <e.g. a defender stepping on each startup frame; which frames escape>.
- Explain any surprising result from the previous study: <e.g. why sidesteps never beat strikes in the edge fixture>.

Check your work
- Tests: no switch = default fingerprint; <one test per behaviour claimed>.
- All tests and browser checks pass (report the total).

Finish
- README with plain-English answers first: (1) <question Adam cares about>; (2) …
- Commit, push, set the board to Review, awaiting Adam's verdict.
- Give Adam localhost links: <one per switch combination to play>.
```

## Checklist before handing it over

- Every number Codex is asked to use is a starting guess with a switch, not a new default.
- The base branch contains what Adam last played.
- Lanes are explicit: Codex doesn't touch rig, pose or animation files; Claude is doing the visual side.
- Measurements can't be satisfied by bots alone where feel is the question. Say "Adam's verdict" for those.
- Previous mistakes are corrected in the prompt itself (for example, which input pattern actually triggers the bug).
