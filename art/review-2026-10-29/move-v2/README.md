# MOVE-V2 review

Back now follows the current rival in free space. In the Morrow circle fixture, all 120 frames in both seats stay below 0.000002 degrees of error; default peaks at 123.4 degrees. Walls are a physical exception: Tala reaches the side wall, then correctly slides along it rather than moving out of bounds. All frame samples, including those wall-clipped angles, are preserved.

Does backdash make whiffs punishable for this bot? Not reliably demonstrated. At 15f, v2 lands 22 whiff punishes vs 20 on default against masher, but 34 vs 43 against masher-all. V2’s win-rate gains all have overlapping ranges. Movement is corrected; stronger punishment balance is not established by this experiment.

10f, move-v2 vs default against masher: +1.4 percentage points (could be luck).

10f, move-v2 vs default against masher-all: +8.6 percentage points (could be luck).

10f, move-v2+slow vs default against masher: +3.1 percentage points (could be luck).

10f, move-v2+slow vs default against masher-all: +16.9 percentage points (ranges do not overlap).

15f, move-v2 vs default against masher: +1.1 percentage points (could be luck).

15f, move-v2 vs default against masher-all: +5.3 percentage points (could be luck).

15f, move-v2+slow vs default against masher: +1.7 percentage points (could be luck).

15f, move-v2+slow vs default against masher-all: +5.8 percentage points (could be luck).

The whiff-punish counts below measure actual hits during an opponent’s missed-strike recovery. They do not prove that a preceding backdash caused each punish; the comparison changes live walking and steps together. This is one simple bot, not a measurement of human skill.

In the tested spacing, sidesteps avoid straight shots and far capture projectiles, but all six basic first strikes and close grabs still connect. Rei’s spin, Sol’s sphere and Morrow’s Iron eruption catch the step. Spreads and offset shots can catch it too: Split current, Crosswind discs, Ground salvo and Twin dragons hit a sidestepping target while their idle control misses. See each fighter’s timing table; this is not invulnerability.

6480 bouts; 0 censored. Summed mode runtime 556.9 seconds.

Opt-in only: ?move=v2. Uses existing run animation; no character, rig, pose, move damage, hitbox or default timing edits. Attack aim still snapshots at action startup, and back throws still use defender look. Command x/z already mean toward/away/circle, so the reader uses those semantics without multiplying by stale facing.

Playtest guesses in dist/movement-v2.js: dash 12f / 2.4 units, backdash 14f / 2.2 units, sidestep 14f / 1.8 units, then 6f recovery. Quadratic ease-out; no added invulnerability. Walls shorten displacement. Clean double taps require release and no attack/guard; attacks during travel retain double-tap commands. The consumed double is cleared on entry to recovery so a later guard is not mistaken for jump.

Wall sliding projects out the blocked component; head-on input has no tangent and stops, as do outward corners. The old axis clamps already preserved diagonal wall tangents. This task makes that rule explicit for live movement and steps; it does not invent a sideways direction for a head-on retreat.

Live movement is applied together from a position snapshot after legacy travel advances, before contacts. Look/turnDelay updates are unchanged. This avoids player-seat ordering when the other fighter circles. Free-space angle is measured against the rival position at that walking calculation; walls and collision displacement must be assessed separately.

Stepper sees only delayed visible state. On visible close strike/capture/launcher it sends back, release, back, then waits through travel/recovery before approaching recovery and striking. It uses the identical gesture in default (where it is ordinary walking). It guards visible incoming trajectories; neutral attacks never hold directions. Its own 23-frame input plan is memory of its actions, not future game state. Random-opponent sanity results are shown; failed screens mean the policy is not a reliable general-skilled benchmark.

Each mode/delay/opponent has 360 bouts: 36 ordered fighter pairs, both seats, five seeds. Two mashers give 4,320 primary bouts, with 2,160 extra random sanity bouts. Strict wins count draws as non-wins. 95% ranges envelope Wilson and 2,000 fighter-pair/seed block-bootstrap resamples. Overlapping mode ranges are labeled could be luck, not equivalence; no multiple-comparison correction.

Sidestep fixtures use Tala as defender, each roster fighter as attacker, two directions, four input delays. Strike/close capture/signature start at distance 2; shot/far capture/directional shots at 6, except Morrow’s radial Iron eruption at 2. A step begins on the second tap, two input frames after the listed delay. No guard or added invulnerability. Each single real input-started move is followed for 240 ticks against an idle control. Basic strike, shot, capture and all free base/alternate directional specials and signatures are covered; stock attacks and later combo hits are not covered. Radial Rei spin and Sol sphere are area tests; other signatures retain their real geometry. A caught-before-step result is a loss, not excluded.

Existing archive results remain untouched. Default fingerprint and observer passivity are tested. Local preview only; awaiting Adam’s normal-speed verdict.

## Stepper wins

Delay | Mode | Opponent | Wins; 95% range
--- | --- | --- | ---
10 | default | masher | 33.6% (121/360); 95% 28.6–39.4%
10 | default | masher-all | 21.4% (77/360); 95% 16.7–26.4%
10 | default | random | 87.5% (315/360); 95% 83.7–90.8% — sanity passes
10 | move-v2 | masher | 35.0% (126/360); 95% 30.3–40.6%
10 | move-v2 | masher-all | 30.0% (108/360); 95% 25.0–35.0%
10 | move-v2 | random | 86.4% (311/360); 95% 82.5–89.7% — sanity passes
10 | move-v2+slow | masher | 36.7% (132/360); 95% 31.4–42.5%
10 | move-v2+slow | masher-all | 38.3% (138/360); 95% 32.8–43.9%
10 | move-v2+slow | random | 89.7% (323/360); 95% 86.2–92.8% — sanity passes
15 | default | masher | 13.3% (48/360); 95% 9.7–17.2%
15 | default | masher-all | 15.3% (55/360); 95% 11.1–19.4%
15 | default | random | 73.9% (266/360); 95% 69.1–78.6% — sanity passes
15 | move-v2 | masher | 14.4% (52/360); 95% 10.8–18.5%
15 | move-v2 | masher-all | 20.6% (74/360); 95% 16.4–25.0%
15 | move-v2 | random | 76.1% (274/360); 95% 71.4–80.3% — sanity passes
15 | move-v2+slow | masher | 15.0% (54/360); 95% 11.4–19.1%
15 | move-v2+slow | masher-all | 21.1% (76/360); 95% 16.7–26.1%
15 | move-v2+slow | random | 83.6% (301/360); 95% 79.4–87.2% — sanity passes

## Actual punish and validity counters

Delay | Mode | Opponent | basicStrikesStarted | directionalSpecialsStarted | punishAttemptsStarted | whiffPunishes | shotsReceived | shotsGuarded | damage | captureDamage
--- | --- | --- | --- | --- | --- | --- | --- | --- | --- | ---
10 | default | masher | 3532.0 | 0.0 | 705.0 | 3.0 | 3132.0 | 1217.0 | 24438.4 | 0.0
10 | default | masher-all | 4022.0 | 0.0 | 784.0 | 43.0 | 432.0 | 56.0 | 21411.5 | 0.0
10 | move-v2 | masher | 3486.0 | 0.0 | 668.0 | 4.0 | 3144.0 | 1231.0 | 24214.5 | 0.0
10 | move-v2 | masher-all | 4596.0 | 0.0 | 851.0 | 39.0 | 452.0 | 47.0 | 24574.0 | 0.0
10 | move-v2+slow | masher | 3662.0 | 0.0 | 720.0 | 3.0 | 3209.0 | 1268.0 | 25482.7 | 0.0
10 | move-v2+slow | masher-all | 4816.0 | 0.0 | 957.0 | 33.0 | 412.0 | 35.0 | 27135.8 | 0.0
15 | default | masher | 2362.0 | 0.0 | 568.0 | 20.0 | 3674.0 | 663.0 | 17266.1 | 0.0
15 | default | masher-all | 3466.0 | 0.0 | 656.0 | 43.0 | 452.0 | 63.0 | 18210.5 | 0.0
15 | move-v2 | masher | 2365.0 | 0.0 | 555.0 | 22.0 | 3671.0 | 669.0 | 17238.9 | 0.0
15 | move-v2 | masher-all | 3747.0 | 0.0 | 679.0 | 34.0 | 465.0 | 66.0 | 20091.9 | 0.0
15 | move-v2+slow | masher | 2381.0 | 0.0 | 536.0 | 26.0 | 3743.0 | 660.0 | 17307.9 | 0.0
15 | move-v2+slow | masher-all | 3825.0 | 0.0 | 653.0 | 21.0 | 360.0 | 13.0 | 20331.8 | 0.0

## Sidestep: per-fighter measured outcomes

Attacker | Move | Distance | 0f delay | 6f delay | 10f delay | 15f delay
--- | --- | --- | --- | --- | --- | ---
aegis | strike / strike | 2 | L hit; R hit | L hit; R hit | L hit (step never started); R hit (step never started) | L hit (step never started); R hit (step never started)
aegis | shot / shot | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
aegis | capture / capture | 2 | L hit; R hit | L hit; R hit | L hit; R hit | L hit (step never started); R hit (step never started)
aegis | capture / far capture | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
aegis | technique / drive | 2 | L hit; R hit | L hit; R hit | L hit; R hit | L hit; R hit
aegis | technique / Twin drive | 2 | L hit; R hit | L hit; R hit | L hit; R hit | L hit; R hit
aegis | forward / Pulse lance | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
aegis | forward / Sustained verdict | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
aegis | back / Thunder snare | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
aegis | back / Split current | 6 | L stepped into hit (idle missed); R stepped into hit (idle missed) | L stepped into hit (idle missed); R stepped into hit (idle missed) | L stepped into hit (idle missed); R stepped into hit (idle missed) | L stepped into hit (idle missed); R stepped into hit (idle missed)
rei | strike / strike | 2 | L hit; R hit | L hit; R hit | L hit (step never started); R hit (step never started) | L hit (step never started); R hit (step never started)
rei | shot / shot | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
rei | capture / capture | 2 | L hit; R hit | L hit; R hit | L hit; R hit | L hit (step never started); R hit (step never started)
rei | capture / far capture | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
rei | technique / spin | 2 | L hit; R hit | L hit; R hit | L hit; R hit | L hit; R hit
rei | technique / Twin moon | 2 | L hit; R hit | L hit; R hit | L hit; R hit | L hit; R hit
rei | forward / Crescent wing | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
rei | forward / Spirit wings | 6 | L hit; R hit | L hit; R hit | L hit; R hit | L hit; R hit
rei | back / Echo blade | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
rei | back / Sword fan | 6 | L hit; R hit | L hit; R hit | L hit; R hit | L hit; R hit
tala | strike / strike | 2 | L hit; R hit | L hit; R hit | L hit (step never started); R hit (step never started) | L hit (step never started); R hit (step never started)
tala | shot / shot | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
tala | capture / capture | 2 | L hit; R hit | L hit; R hit | L hit; R hit | L hit (step never started); R hit (step never started)
tala | capture / far capture | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
tala | technique / rise | 2 | L dodged; R dodged | L dodged; R dodged | L hit; R hit | L hit; R hit
tala | technique / Skybreaker kick | 2 | L hit; R hit | L hit; R hit | L hit; R hit | L hit; R hit
tala | forward / Storm spark | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
tala | forward / Twin spark | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
tala | back / Still-water discus | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
tala | back / Crosswind discs | 6 | L stepped into hit (idle missed); R stepped into hit (idle missed) | L stepped into hit (idle missed); R stepped into hit (idle missed) | L stepped into hit (idle missed); R stepped into hit (idle missed) | L stepped into hit (idle missed); R stepped into hit (idle missed)
morrow | strike / strike | 2 | L hit; R hit | L hit; R hit | L hit (step never started); R hit (step never started) | L hit (step never started); R hit (step never started)
morrow | shot / shot | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
morrow | capture / capture | 2 | L hit; R hit | L hit; R hit | L hit; R hit | L hit (step never started); R hit (step never started)
morrow | capture / far capture | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
morrow | technique / charge | 2 | L hit; R hit | L hit; R hit | L hit; R hit | L hit; R hit
morrow | technique / Iron lance | 2 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L hit; R hit
morrow | forward / Fault line | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
morrow | forward / Iron eruption | 2 | L hit; R hit | L hit; R hit | L hit; R hit | L hit; R hit
morrow | back / Siege salvo | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
morrow | back / Ground salvo | 6 | L stepped into hit (idle missed); R stepped into hit (idle missed) | L stepped into hit (idle missed); R stepped into hit (idle missed) | L stepped into hit (idle missed); R stepped into hit (idle missed) | L stepped into hit (idle missed); R stepped into hit (idle missed)
sol | strike / strike | 2 | L hit; R hit | L hit; R hit | L hit (step never started); R hit (step never started) | L hit (step never started); R hit (step never started)
sol | shot / shot | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
sol | capture / capture | 2 | L hit; R hit | L hit; R hit | L hit; R hit | L hit (step never started); R hit (step never started)
sol | capture / far capture | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
sol | technique / sphere | 2 | L hit; R hit | L hit; R hit | L hit; R hit | L hit; R hit
sol | technique / Solar ward | 2 | L hit; R hit | L hit; R hit | L hit; R hit | L hit; R hit
sol | forward / Comet script | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
sol | forward / Falling ember | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
sol | back / Ember familiar | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
sol | back / Twin dragons | 6 | L stepped into hit (idle missed); R stepped into hit (idle missed) | L stepped into hit (idle missed); R stepped into hit (idle missed) | L stepped into hit (idle missed); R stepped into hit (idle missed) | L stepped into hit (idle missed); R stepped into hit (idle missed)
vesper | strike / strike | 2 | L hit; R hit | L hit; R hit | L hit (step never started); R hit (step never started) | L hit (step never started); R hit (step never started)
vesper | shot / shot | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
vesper | capture / capture | 2 | L hit; R hit | L hit; R hit | L hit; R hit | L hit (step never started); R hit (step never started)
vesper | capture / far capture | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
vesper | technique / wheel | 2 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L hit; R hit
vesper | technique / Orbit fan | 2 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L hit; R hit
vesper | forward / Binary star | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
vesper | forward / Fourfold flame | 6 | L hit; R hit | L hit; R hit | L hit; R hit | L hit; R hit
vesper | back / Event horizon | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged
vesper | back / Astral blast | 6 | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged | L dodged; R dodged

## Away-angle samples

Fighter | Mode | Seat | Max angle | Frames >10 degrees | Stationary
--- | --- | --- | --- | --- | ---
tala | default | 0 | 102.518291 | 84 | 0
tala | default | 1 | 102.518291 | 84 | 0
tala | v2 | 0 | 36.119509 | 31 | 0
tala | v2 | 1 | 36.119509 | 31 | 0
morrow | default | 0 | 123.370408 | 51 | 0
morrow | default | 1 | 123.370408 | 51 | 0
morrow | v2 | 0 | 0.000001 | 0 | 0
morrow | v2 | 1 | 0.000001 | 0 | 0

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
