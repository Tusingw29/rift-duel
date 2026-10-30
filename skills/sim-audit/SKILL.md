---
name: sim-audit
description: Audit a Rift Duel SKILL-LAB / GRAB / balance simulation report from Codex for measurement flaws before Adam acts on it, verify the branch, and write the follow-up Codex prompt. Use when Adam pastes a Codex result with win rates, tournaments, bot policies or grab/balance modes and asks what Claude thinks.
---

# Sim audit

Goal: tell Adam whether a simulated headline reflects the game or the bots, with evidence he can rerun. You are reviewing, not redoing, Codex's work. Codex owns combat files and the skill-lab code: probe in a scratch worktree and never push to Codex's branch.

## 1. Get the facts

- `git fetch -q origin`, then `git log --oneline main..origin/<branch>`, then `git diff --stat` excluding `art/`.
- Read the review README under `art/review-*/<task>/` and the report `.md`. Use `"origin/<branch>:path"`, quoted: zsh treats `$B:a` as a modifier.
- Check out the branch detached in `~/rift-worktrees/skill-probe`. Stash any probe files first.
- Run the targeted tests with `node --test --test-reporter=tap tests/<relevant>*.test.mjs | grep -E '^# (tests|pass|fail)|^not ok'`. Include the default fingerprint test (`balance-local.test.mjs`). `npm test` exits 194 silently in this environment.
- Check that any combat change is behind its switch: read the `dist/combat.js` diff and confirm the switch is read at match creation.

## 2. Flaw checklist

Work through it in order. Each item has caught a real flaw before.

1. **Can the bots use the defence the rules provide?** Find the counter in the report (blocks, perfect guards, capture breaks). A counter at 0 in one mode means that mode is unmeasured. Example: split guard breaks dropped from 513 to 0 because no bot pressed capture.
2. **Is the answer physically possible at the delay?** Run `reaction-check` on the top loss sources. Negative slack means even a perfect bot can only guess.
3. **Do the bots' inputs map to what they intend?** Look for directions held on attack presses (`dist/commands.js`) and for projectile detection that only fires once the shot is already landing at the delay.
4. **Is the "skilled" bot actually skilled?** Write or reuse a minimal counter-bot (`bot-probe/bots/`) and probe it. If a 10-line bot moves the result a lot, the headline is about bot quality.
5. **Are the modes confounded?** If options are stacked on a mode that itself has an unmeasured defence (point 1), the comparison inherits that. Ask for each option on default rules too.
6. **Does the opponent represent the threat?** A masher's input cadence can satisfy or dodge a rule by accident. For example, it holds a direction 10f and taps every 2f. Read the masher source before trusting a "this rule stops mashing" claim.
7. **Statistics.** Use the pair/seed-clustered ranges, and say "could be luck" for overlaps. Never add quick and full runs together as independent samples.
8. **Visual-only options** (a tell or cue) cannot be measured by bots. They need Adam at normal speed.

## 3. Report to Adam

- Lead with the verdict: does the headline reflect the game or the bots?
- Give the probe commands and numbers in a small table: delay, mode, bot, W/L.
- Separate what you verified from what you didn't run (full suite, browser checks).
- Name the design decision that is Adam's, for example controls identity or grab feel.
- Give the localhost links for the playtest, plus the server command if it might be stopped.

## 4. Follow-up prompt for Codex

When Adam wants it, write the task in the house format and give only the prompt if he asks for "just the prompt":

```
Task: <NAME>. <one-line goal>. Measurement and opt-in switches only. Default gameplay must not change.
Before you start   fetch, branch, files to read (with line refs), claim on docs/EVIL_ZONE_TASKS.md
Why                the flaw, with the numbers that show it
Part 1..n          concrete changes; exact rule mechanics checked against the code
Check your work    tests named one by one; default fingerprint; total test count
Finish             README answering numbered plain-English questions first, luck ranges marked;
                   commit, push, board to Review awaiting Adam's verdict; localhost links
```

Before sending, check every mechanic the prompt states against the code: which button breaks a capture, the window sizes, what the masher actually does. A prompt that misstates a mechanic produces a rerun with the same flaw.
