---
name: bot-probe
description: Run a fast head-to-head between Rift Duel skill-lab bots (or a custom bot file) across all fighter pairs, both seats, chosen reaction delays, balance modes and grab options, with win ranges and what damage decides the losses. Use when checking a SKILL-LAB / GRAB result, testing whether a bot flaw explains a headline, or trying a rule switch before asking Codex for a full tournament.
---

# Bot probe

A quick, reproducible check, not a replacement for Codex's tournament. About 70 bouts a second on this Mac.

Needs a worktree with the SKILL-LAB runner (`scripts/skill/run.mjs`), i.e. `codex/skill-lab` or later. Never run it in the main checkout, and never edit Codex's files to make a probe work.

```bash
git -C "/Users/adamwilliams/Evil Zone test" fetch -q origin
git -C "/Users/adamwilliams/Evil Zone test" worktree add --detach ~/rift-worktrees/skill-probe origin/codex/skill-lab   # or: cd there && git checkout --detach origin/codex/skill-lab
node "/Users/adamwilliams/Evil Zone test/.claude/skills/bot-probe/probe.mjs" --root=$HOME/rift-worktrees/skill-probe \
  --bots=punisher,timer --vs=masher,masher-all --delays=10,15 --modes=default,proposed [--grab=deliberate,slow] [--seeds=1]
```

Options:
- `--bots` / `--vs`: policy names from `scripts/skill/run.mjs` (the script lists them if one is wrong).
- `--bot-file=name=/abs/path.mjs`: add a custom bot; repeatable. Custom bots must be self-contained (no relative imports into the repo). Start from `bots/breaker.mjs` here.
- `--modes`: `default`, `rules`, `proposed` (built from `dist/balance/presets.js`, the same way the tournament does).
- `--grab`: any `?grab=` value the branch supports, applied to every mode in the run.
- `--fighters=tala,rei`: limit the fighter pairs to speed up iteration.
- `--json`: raw rows for further maths.

Each row prints:
- W/L/D, with a 95% Wilson range;
- the average round length;
- W/L by the bot's own fighter;
- defence counters: blocks, perfect guards, capture breaks, whiffs and punished whiffs;
- the opponent's captures, and how many came through guard;
- the top damage sources in the bot's losses.

## How to read it

- **Read the counters before the win rate.** If a defence the rules depend on reads 0 (capture breaks under split guard, blocks against a zoner), the bot can't use it, and the result says nothing about the rules.
- **Top damage in losses** shows what actually beats the bot. Pair it with `reaction-check` to see whether that move can be answered at all at this delay.
- **Ranges.** Bouts share fighter pairs and seeds, so treat the Wilson range as a screen. Overlapping ranges mean "could be luck".
- **Delays.** 15f is the human reaction default; 10f is a sharp player. Run both: an outcome that flips between them is a reaction-window problem, not a balance problem.

## Bot-writing rules (keep probes honest)

- Read only the delayed context: `self`, `rival`, `obs`, `d`, `frame`, `random`, `memory`. Never use the match or future state.
- `x` is facing-relative. Any direction held on an attack press turns it into a directional command (`dist/commands.js`): forward = special, down = capture, up = technique, double-taps = pursuit/super/launch. **Press attack with x=0, z=0** unless the bot wants that command.
- Attack edges need a release, so tap with `frame%2===0` at most.
- Split guard (proposed) breaks a capture with a fresh **capture** press, inside the captureBreak window, **while not guarding**. Default rules break with a timed guard.

Report results with the exact command used, so Adam or Codex can rerun it.
