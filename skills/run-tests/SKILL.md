---
name: run-tests
description: Run Rift Duel's tests reliably on Adam's Mac and in worktrees, all or only the files a change touches, and read the result. Use before every commit, when npm test exits with a bare number and no output, or when a worktree's tests behave differently from main's.
---

# Run tests

```bash
node scripts/run-tests.mjs                                   # whole suite (608 tests on 2026-10-30, about a minute)
node scripts/run-tests.mjs morrow tell kinetic               # files whose name contains a word
node scripts/run-tests.mjs --imports=grounded-animation,morrow-animation   # files that import those modules directly
```

It prints one summary line, then each failing test with its error line, and exits non-zero on a failure. `--imports` matches direct imports only. A test that reaches a module through another one is missed, so finish with the whole suite before a commit.

## Why not `npm test`

`npm test` exits **194** after running when `node_modules` is a symlink that points at itself. It prints nothing useful, even when every test passed. On 2026-10-30, the main checkout's `node_modules` was such a loop, and every worktree's `node_modules` linked to it.
- Check: `ls -la node_modules`. A link to its own path is the loop.
- Fix: `rm node_modules`. The repo has no npm dependencies, and the review tools live in `~/rift-tools` (see `skills/visual-review-capture`).
- After the fix, `npm test` exits 0 again.

## Gotchas

- **zsh doesn't split a variable into words.** `node --test $FILES` passes one long filename and fails with "Could not find". Use the script, `xargs`, or `${=FILES}`.
- **The default reporter isn't line-based.** Grepping it for `not ok` finds nothing. Use `--test-reporter=tap` if calling `node --test` directly.
- **Concurrency.** The script runs two files at a time, which stays usable while Safari and the game are open. Full concurrency on 4 cores slows the browser checks.
- **The default fingerprint.** Combat changes must keep `tests/balance-local.test.mjs` (and the sandbox determinism tests) green with no switches. A failure there means default gameplay changed.
- **Visual work.** Green tests prove contact frames and planted feet, not that a pose reads. Visual claims also need captures (`skills/visual-review-capture`) and Adam's normal-speed verdict.
