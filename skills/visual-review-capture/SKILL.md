---
name: visual-review-capture
description: Capture reviewable images of Rift Duel fighters headlessly, from the review pages, the sandbox and the game, and turn them into frame strips for the art/review folder. Use whenever animation, costume or model changes need visual evidence, or the board asks for review artifacts.
---

# Visual review capture

Screenshots cannot judge normal-speed feel; a human must still watch the review page or a fight. Captures are for pose continuity, silhouette, weight and defects. Say so in any report.

## Setup (once per machine, and again after a scratchpad wipe)

The repo has no `node_modules`. Install the tools in a separate directory and point `RIFT_TOOLS` at it:

```
mkdir -p "$TOOLS" && cd "$TOOLS" && npm init -y >/dev/null && npm install --no-audit --no-fund playwright@1.56.1 pngjs@7.0.0 jpeg-js@0.4.4
```

Keep the tools outside the scratchpad (`~/rift-tools` on Adam's Mac; the scratchpad is wiped without warning). Serve the project root (not `dist`) on port 4173 so `/dist/...` URLs work, or set `RIFT_BASE=http://localhost:4173` when a `dist`-rooted server is already up: `python3 -m http.server 4173 --directory <repo>`. The combat travel smoke expects a `dist`-rooted server on the same port, so stop one before starting the other.

If `chromium.launch` complains the executable is missing, point `PLAYWRIGHT_EXECUTABLE` at an installed headless shell under `~/Library/Caches/ms-playwright/` (on this Mac: `chromium_headless_shell-1223/chrome-headless-shell-mac-x64/chrome-headless-shell`).

## Scripts (all under `scripts/review/`, all read `RIFT_TOOLS`, `RIFT_BASE`, `SHOTS`)

| Script | Produces | Typical use |
| --- | --- | --- |
| `review-shot.mjs` | front/side/back PNGs per pose from `fighter-review.html` | `FIGHTER=rei POSES="idle:.4,guard:.5,run:.55,strike1:.13,pursuit:.1,crossover:.15"` |
| `review-strip.mjs` | one stitched strip per pose, consecutive sample times | `FIGHTER=rei ANGLE=1.57 STRIPS="strike1:0,.05,.08,.11,.13,.18,.25,.35"` |
| `sandbox-strip.mjs` | one strip of a deterministic two-fighter scenario | `SCENARIO=stagger-recover FRAMES=1,6,11,16,21,26,32 P1=2 P2=1 ZOOM=.55` |
| `sandbox-probe.mjs` | console log of sandbox initialisation and model status | run after any change to `render.js`, `sandbox*.js` or the stamped pages |
| `to-jpeg.mjs` | compact JPEGs for `art/review-<date>/` | `node scripts/review/to-jpeg.mjs art/review-2026-10-25 artifacts/review/strip-*.png` |

Review-page times are seconds into the clip; `strikeN` contact is at `startup/60` (0.13 s for the 8-frame fighters, 0.083 s for Tala). Hurt counts down, so sample `.42,.38,…,.04` to see the hit in order. Sandbox frames are simulation frames and replay from reset.

## Rules learned the hard way

- Kill stale browsers first: `pkill -f chrome-headless-shell`. Leftovers starve the software renderer and every later screenshot times out.
- The machine's own load matters more than anything in the scripts. Above a load average of roughly 30, captures stall and can be killed outright. Check `uptime`, use `quality=low`, small viewports and long screenshot timeouts, and run captures in the background if the harness kills long foreground commands.
- Restamp before capturing: `npm run prepare:release` rewrites the import maps. A capture of a page whose modules changed but whose stamp did not shows the cached old code.
- Unique filenames per run (the scripts append a timestamp). Re-reading a reused filename can show a stale image.
- A zero-time render snaps the camera; the sandbox relies on this. If a page shows a far or stale camera, something re-enabled smoothing.
- Front views foreshorten anything pointing at the camera; use the side angle to judge reach and the front angle to judge guard coverage.
- Put strips in `art/review-<date>/` as JPEGs with a README table (file, times, reading, known limits). Never commit PNG strips or the downloaded reference video.

## Reporting

For each strip state what it shows frame by frame, name the weakest frame, and separate "reads correctly" from "needs the human normal-speed verdict". Link the review folder on GitHub rather than scratchpad paths.
