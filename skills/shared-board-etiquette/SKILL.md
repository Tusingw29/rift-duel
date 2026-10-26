---
name: shared-board-etiquette
description: How Claude, Codex and Adam share the rift-duel repository without clobbering each other: claiming tasks on docs/EVIL_ZONE_TASKS.md, branches and worktrees, restamping pages, rebasing, and what counts as evidence. Use at the start of any session and before every push.
---

# Shared board etiquette

Several sessions work on `Tusingw29/rift-duel` at once. The board is `docs/EVIL_ZONE_TASKS.md`; the suggested lanes are Codex for combat rules, movement, input and training, Claude for art and animation, Adam for the normal-speed verdicts.

## Before starting

1. `git pull --ff-only`. Read the board's owners, statuses and handoff log; another session may have claimed or finished the task.
2. Claim with name, branch and status, push the claim to `main` immediately, then work on a branch (`claude/<task>`) or a separate worktree. Never edit the same checkout another session is using; an uncommitted control was lost that way once.
3. Do not touch `dist/combat.js`, `dist/combat-travel.js`, `dist/animation.js` or a fighter animator another session owns without a note on the board.

## While working

- Any change to a module under `dist/` needs `npm run prepare:release` before testing in a browser; the import maps carry a build hash and stale pages load old code.
- `npm test` must be green before a commit. Add a test for every behaviour claimed.
- Visual claims need captures in `art/review-<date>/` with a README table, and the board must say "awaiting normal-speed verdict" until Adam gives one. Screenshots never close a visual-acceptance bullet.

## Shipping

1. Commit on the branch, `git pull --rebase` onto `main`. Conflicts in stamped pages (`index.html`, review pages, `sandbox.html`) resolve to upstream, then restamp. Conflicts in code are merged by hand and re-tested (402 tests at last count).
2. Push, then wait for "Test and publish" and "Browser smoke test" on the pushed SHA, and check the public page's build hash. Report outcomes faithfully, including flakes and cancellations.
3. Update the board: tick bullets only for what is actually done, add a handoff-log row with commit, evidence and next step, and record declined proposals with the reasoning so they are not re-raised.

## Local gotchas on Adam's Mac

- Captures stall when the machine's own apps load it (load averages above 30 were common); use the background runner and long timeouts.
- The scratchpad is wiped without warning; tools and scripts belong in the repo (`scripts/review/`) or a directory outside the scratchpad.
- Port 4173 serves either the project root (review pages, sandbox) or `dist` (combat travel smoke); switch deliberately.
