---
name: reaction-check
description: For every Rift Duel move, show whether a defender can answer it on reaction at a given delay (block, perfect guard, capture break) and whether its whiff can be punished on reaction or only by a guess, from dist/balance/roster.json. Use when a sim or playtest says something "can't be beaten", when judging grab or startup changes, or before proposing frame changes.
---

# Reaction check

`$RIFT` is any checkout that has this skill: the main one (`/Users/adamwilliams/Evil Zone test`) or a worktree. `--root` is the branch being measured.

```bash
node "$RIFT/skills/reaction-check/reactable.mjs" --root=<worktree> --delays=10,15 \
  [--fighter=tala] [--kind=grab] [--all] [--startup=system-capture-close-:18]
```

- `--root`: any worktree with `dist/balance/roster.json` (main has it once BALANCE-LAB merges; otherwise use `~/rift-worktrees/balance-lab` or a skill-lab worktree). Run `npm run balance:extract` there first if timings changed.
- `--startup=key:frames,...`: what-if startup overrides, marked `*`. Use it to test switches such as grab=slow (18f) without editing code.
- `--all`: include variants, stock and defence rows.

## What the columns mean

- **slack@d = startup - d - 1.** This is the number of frames left to input an answer after the move becomes visible to someone reacting `d` frames late.
  - **Negative:** the move can only be answered by guessing in advance.
  - **0 or more:** it can be answered on reaction.
  - **Windowed answers.** A perfect guard (10f) or capture break (12f) must also land inside its window before contact, so a large slack spent waiting is fine, but tapping too early is not.
- **whiff@d:** whether a whiff can be punished with this fighter's own Strike 1 (startup only, spacing ignored, ±2f).
  - `react +n`: punishable on reaction, with n frames to spare.
  - `guess +n`: punishable only if the punish was already committed.
  - `safe`: no punish.

## Use it with

- **`bot-probe`:** when a bot loses to one move, check that move's slack. A negative slack at the bot's delay means the bot's loss is the game's timing, not the bot's skill. Example: close capture at 13f startup has slack -3 at 15f, so it can't be broken on reaction. With grab=slow (18f) it has slack 2.
- **Claims:** quote the row and the delay. Never hand-copy frame numbers into a claim; rerun the script.
