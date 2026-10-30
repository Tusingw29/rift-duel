## Verification and playtest links

- **717 tests passed, 0 failed** on the measured implementation `b9dd222`. [Final cloud workflow](https://github.com/Tusingw29/rift-duel/actions/runs/41038272566): both tournament jobs and verification succeeded. Unit tests include default fingerprint, actual Burst inside/outside/behind contacts for all six fighters, held/perfect guard, full-step escapes in both seats, real heavy-jab damage/knockback, radius and geometry, variant isolation and passive observers. The updated balance extractor reads the unchanged default branches; the committed roster data remains byte-for-byte unchanged.
- **14,400 bouts, zero censored**, ten archives (five modes × two delays). All recorded source hashes match. Every one of the **2,880 ring-baseline bouts** exactly matches ARENA-INPUT winners, HP, frame counts, player telemetry and edge counters. See `art/skill-lab/2026-10-30-horizon-fix/audit.json`.
- **Seven browser URL/input checks** passed: default, Burst V2 at radii 10/11/12, and jab13/jab15heavy/jab15. The keyboard tests start training, approach and start a real first strike; startup/recovery and parsed flags are checked. This deterministic input fixture stubs only the renderer.
- Desktop and 390px phone dashboard checks pass with no page errors or document overflow. Both delay selections render all five results tables; wide tables scroll within their containers. See `dashboard-browser.json` and the timestamped dashboard captures.
- **Eleven real-renderer captures** passed, with loaded graphic models asserted on every capture: radii 10/11/12 in lock-on, side and duel cameras, plus an escaped Burst and a confirmed contact. `browser.json` has the individual filenames and no page errors. The measured radius and drawn radius match. `horizon-contact-sheet.jpg` collects them.
- Visual inspection: the nearby yellow boundary is clear in all nine radius/camera views; the far arc is still thin/foreshortened in lock-on. The escape frame leaves Tala outside the reach and no cinematic starts; the inside frame confirms contact. **These are contact-state stills, not evidence of a readable normal-speed wind-up.** Claude’s pose/animation files were not edited. The first review harness recreated models immediately before capture and showed fallback bodies; that harness was fixed to retain loaded models before these final captures. Preliminary images are not used as evidence.
- The local unbounded npm test run was stopped to reduce machine load; a lower-concurrency run initially found the extractor-pattern mismatch, which was fixed and rechecked locally. Final full `npm test` results above are from GitHub, not a claim that the interrupted local run passed.
- The final five-seed tournament took **80.0 seconds summed across modes** on cloud runners; delay jobs ran concurrently. This excludes setup, browser captures and exploratory pilot work. Eleven pilot candidates (including baseline) were measured on two seeds; pilot archives and the choice recorded before the final tournament are preserved.

No gameplay merge to main. **Review, awaiting Adam’s normal-speed verdict.** The shared board is the only main update. No character/rig/pose/mocap authoring changes.

- [Burst V2, radius 10](http://localhost:4207/dist/index.html?move=v2&arena=ring&burst=v2)
- [Burst V2, radius 12](http://localhost:4207/dist/index.html?move=v2&arena=ring&ring=12&burst=v2)
- [Morrow jab13](http://localhost:4207/dist/index.html?move=v2&arena=ring&morrow=jab13)
- [Morrow jab15heavy](http://localhost:4207/dist/index.html?move=v2&arena=ring&morrow=jab15heavy)
- [Results dashboard](http://localhost:4207/dist/horizon-lab.html)
- Optional radius 11: `?move=v2&arena=ring&ring=11&burst=v2`. Existing jab15 remains available.

Server: `python3 -m http.server 4207 --bind 127.0.0.1` from `~/rift-worktrees/horizon-fix`.
