## Verification and review

- Implementation: `ce3938a`, based on `f0c37c6`, branch `codex/arena-input` from MOVE-V2 `d1b8327`. Gameplay has not merged to main.
- [GitHub checks and artifacts](https://github.com/Tusingw29/rift-duel/actions/runs/40854076420): both delay jobs and verify job passed. **708 tests pass, zero failures**, including the unchanged default fingerprint, ring bounds through all requested motion paths, 12f/18f command separation, Morrow-only startup, passive observation and simultaneous contact listeners.
- **11,520 bouts**, zero censored. Total summed simulation-job mode runtime: **82.6 seconds**; the 10f/15f jobs ran concurrently. `audit.json` verifies source hashes and all bouts’ winners, HP, input/simulation frame counts and original telemetry against the preliminary run. The counter repair did not change gameplay outcomes.
- Preliminary workflow `40853344725` used a single observer slot, causing existing telemetry to replace the new contact listener. Its zero pin counts are invalid. Those archives remain in `pre-observer-fix/`, excluded from conclusions. The corrected observer allows both listeners and has a regression test. Final pin/hit counts are nonzero and bounded.
- Browser keyboard integration tested default, arena-only ring, explicit rectangle, implicit v2 ring, slow-grab combination and jab15 combination. Step gaps 12/13f, dash distance 1.5, and a live Morrow Strike 1 with 15 startup / 20 recovery passed. Deterministic input checks stub rendering; the visual review separately used the real renderer and loaded graphic character models.
- Local results dashboard checks passed on desktop and 390px phone width: both sides’ win ranges, pin/edge tables, Morrow matchup rows, navigation links and no page-width overflow or page errors. Final captures: `dashboard-desktop-1793268329439.jpg` and `dashboard-phone-1793268329439.jpg`.
- **18 real renderer captures**, six stages × lock-on/side/duel cameras. Default render hides the ring. I inspected the contact sheet: the bright yellow inner line and dark outer edge read against every stage floor. The initial dark torus hid the bright core; `pre-line-fix/` retains that rejected version. The final flat strips sit above the floor and share the simulation radius constant.
- `boundary-contact-sheet.jpg`: rows Aegis, Rei, Tala, Morrow, Sol, Vesper; columns lock-on, side, duel. Individual source captures and model statuses are listed in `browser.json`. The weakest view is the distant far arc in the lock-on camera: it becomes thin with perspective, while the near boundary remains clear. Claude can style the line later.
- Physical controller feel and normal-speed accidental-input frequency still need Adam’s playtest. Synthetic taps cannot reveal player intent. The new ring has no rectangular corners; this does not mean a fighter cannot be pressured against its boundary.
- Balance data was not regenerated. Existing default-value and source-reference sync tests pass. No default move, damage, reach, hitbox, rig or pose values changed. The renderer edits only add/hide the boundary mesh.

## Play locally

- [Ring](http://localhost:4206/dist/index.html?move=v2&arena=ring)
- [Ring + slow grabs](http://localhost:4206/dist/index.html?move=v2&arena=ring&grab=slow)
- [Ring + Morrow jab15](http://localhost:4206/dist/index.html?move=v2&arena=ring&morrow=jab15)
- [Old rectangle with the new input settings](http://localhost:4206/dist/index.html?move=v2&arena=rect)
- [Results dashboard](http://localhost:4206/dist/arena-lab.html)

Add `&mode=training` to any game link for training. If the server stops, run `python3 -m http.server 4206 --bind 127.0.0.1` in `~/rift-worktrees/arena-input`. Status: Review, awaiting Adam’s normal-speed verdict.
