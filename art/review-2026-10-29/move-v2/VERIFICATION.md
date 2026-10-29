## Verification and playtest links

- `PATH=/usr/local/bin:$PATH npm --script-shell=/bin/bash test`: **699 passed, 0 failed**. Default fingerprint remains `c1fc5ebc1cb77d6845830c4c67fa56d416bf079f78d16c51fac4e1b8d049071a`. Eleven movement tests cover controls, constraints, commands, recovery, facing/back throws, delayed bot policy and passive telemetry.
- Both five-seed sweeps completed locally. The six final archives’ recorded source hashes match the implementation files. Runs record the pre-implementation claim HEAD (`1972276`), so use their source hashes to identify the measured code. Incomplete preliminary runs with the direction-edge bug remain in `pre-direction-edge/`, explicitly excluded from conclusions.
- `scripts/review/move-v2.mjs --input-only`: final build keyboard integration, all W/S/A/D doubles across default, v2, v2+slow and the training link. Renderer stubbed only for this deterministic input test; 16 cases, no page errors.
- `scripts/review/move-v2.mjs`: separate real game renderer loaded fighter assets and captured backdash/sidestep in lock-on view; passed, no page errors. This slower capture started before the final first-tap edge correction; the final input replay above verifies that correction. The visible run poses and renderer were unchanged.
- `scripts/review/move-dashboard.mjs`: result text, confidence ranges, older-study navigation and desktop/390px phone layouts passed, no page errors or page-width overflow.
- `scripts/review/move-v2-visual.mjs`: final-build exact-frame fixture passes with explicitly loaded graphic Tala / roster model statuses, no fallbacks and no page errors. The fixture uses a dist base URL so asset URLs resolve correctly.
- `npm run prepare:release`, balance extraction and standalone Frame Codex regeneration completed. Balance numeric values are unchanged; extraction updates source line references.

| Capture | What I inspected | Remaining limitation |
| --- | --- | --- |
| backdash-lock-1793262834527.jpg | Real in-game lock-on view; fighter/model and preview badge present, back input history and grounded run state | HUD covers some ankle/foot detail; existing run cycle is not a dedicated backdash animation |
| sidestep-lock-1793262834527.jpg | Real in-game side displacement/camera follow, intact fighter silhouette and arena | Existing run pose still reads upright; no authored sidestep lean/brake. Needs Adam at normal speed |
| back-exact-frame-1793263566056.jpg / side-exact-frame-1793263566056.jpg | Final-build real renderer, step frame 4, loaded models and clear feet | Static pose only; no cadence or normal-speed acceptance |
| dashboard-desktop-1793263339466.jpg | Results and confidence wording render | Large tables scroll locally |
| dashboard-phone-1793263339466.jpg | Readable text, working links, no whole-page horizontal overflow | Long study; scroll for tables |

Keyboard integration and static captures do not certify physical controller feel or 60 FPS performance on the Mac. No character/rig/pose/animation edits were made.

- [Play movement v2](http://localhost:4204/dist/index.html?move=v2)
- [Play movement v2 + slower grabs](http://localhost:4204/dist/index.html?move=v2&grab=slow)
- [Training with movement v2](http://localhost:4204/dist/index.html?move=v2&mode=training)
- [Results dashboard](http://localhost:4204/dist/move-lab.html)

If the server stops: run `python3 -m http.server 4204 --bind 127.0.0.1` in `~/rift-worktrees/move-v2`. Branch only, awaiting Adam’s normal-speed verdict; default gameplay has not been promoted or changed.
