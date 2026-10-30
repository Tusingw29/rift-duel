---
name: playtest-triage
description: Turn Adam's playtest feedback (or a Claude Desktop / ChatGPT summary of it) into confirmed causes in the code, a lane for each problem, Claude's own fix started, and a Codex prompt in the house format. Use whenever Adam describes how a build felt ("couldn't see it coming", "stuck in the corner", "felt too slow") or pastes someone else's notes about a playtest.
---

# Playtest triage

Adam plays at normal speed and reports feel in plain words, often quickly typed. The job is to find out what in the code produces that feel, split the work by lane, and hand Codex a prompt it can finish without coming back. Adam gives the verdicts. Claude and Codex do not.

## 1. Pin down what he played

- Which URL and switches (`?move=v2&arena=ring&tell=on`…), and which branch the server on that port is serving (`lsof -i :<port>`, then `git -C <dir> log -1`). A complaint about a switch he didn't have on is a different problem.
- Which fighter he was against, CPU or local, and how he was playing ("mainly defensive", "testing spacing").

## 2. One line per symptom, in his words

Keep his words, then find the mechanism. Read the code; don't reason from memory of earlier versions. Examples that turned out to have concrete causes:

| Adam said | Cause in code |
| --- | --- |
| "Last Horizon is basically an automatic grab" | Burst resolves at end of startup for any defender within 9 units, any direction (`dist/combat.js`, the `kind==='super'` contact). |
| "No tells, attacks out of nowhere" | Burst had no grounded-rig target and fell back to a linear arm raise in `animation.js`. |
| "Stuck at the edge, inverted" | Hidden ±11/±6 rectangle vs a round visible floor; facing frozen by `turnDelay`. |
| "Dash toward him by accident" | Spacing taps (toward, release, toward) inside the 18f double-tap window. |

If a symptom needs numbers (damage share, reaction slack), run `skills/reaction-check` or a quick CPU tally before writing anything. Each claim to Adam should carry its evidence.

## 3. Check proposed fixes against the exact input

Before proposing an input or timing fix, reproduce the exact pattern he describes. A release-to-neutral rule was once proposed for accidental dashes. The real trigger was tap–release–tap, which that rule doesn't touch.

## 4. Assign lanes

| Lane | Owns |
| --- | --- |
| Claude | Animation, tells, poses, models, costumes, stage visuals, VFX, review captures |
| Codex | `dist/combat.js`, `moves.js`, `commands.js`, `fighters.js`, techniques/specials data, movement, input, arena bounds, skill-lab bots |
| Adam | Taste calls: ring size, how slow is too slow, whether a switch becomes default |

Taste calls become variants behind switches (`ring=11`, `ring=12`, `jab13`, `jab15heavy`), never a single guessed number. Every gameplay change is opt-in with the default fingerprint unchanged.

## 5. Read bot results with his play style in mind

Bots don't play like Adam. Before quoting a Codex headline, check which side a metric counts. "Pinning increased" was almost entirely masher bots being knocked into the line. The skilled bots, which back off the way Adam does, spent 0.01 s per bout at the edge. Visual changes (tells, rings) can't be measured by bots at all.

## 6. Act, then report

- Start Claude's lane straight away when Adam has asked for it ("fix your end too"). Branch, claim on the board (`skills/shared-board-etiquette`), and capture before/after evidence (`skills/visual-review-capture`, workbench A/B).
- Write the Codex prompt from `codex-prompt.md`.
- Reply to Adam:
  1. what the code confirms, in his terms;
  2. what each lane will do;
  3. the prompt in one fenced block;
  4. links to play.

  Keep it short; he reads it between playtests.
