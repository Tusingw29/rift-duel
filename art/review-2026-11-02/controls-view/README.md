# CONTROLS-VIEW review

**Side:** A/D move screen-left/right by choosing toward or away from the rival’s current screen side. W/S circle into/out of the screen. Double-tap W/S to sidestep. The existing Duel camera is forced for normal fighting.

**Lock-on:** W approaches, S retreats, A/D circle. Double-tap A/D to sidestep. The existing behind-the-back Lock-on camera is forced. Saved camera settings and default controls stay unchanged.

**Side swaps:** each player has a separate mapping latch. A sustained screen-side crossing changes the unheld mapping once (fixture frame 41). Holding any direction preserves the old mapping until all direction keys are released / the stick returns to its dead zone (frame 120 in the held fixture). Opposed keys that cancel their movement still count as held. A normalized camera-right projection dead band of ±0.15 (about 8.6° around end-on alignment) prevents near-line noise from flipping it. At exact overlap with no history, right is initially treated as toward.

**Important camera exception:** the existing orbiting crossover changes screen sides twice as the Duel camera catches up; the mapping follows after its dead band at fixture frames 11 and 18. The unheld mapping follows those two genuine changes; a held mapping never flips during that fixture. A slow walk around the rival has no flips because the camera orbits with the fighters. Therefore the requested “one flip per crossover” is true for a single sustained screen crossing, but not for every existing orbital crossover. Enforcing that globally would require a camera or mapping tradeoff; this pass leaves the camera unchanged.

**Adam’s choices:** whether the side scheme feels better; whether retaining a held rival-relative direction through a swap is comfortable. That latch can deliberately make a held right key move screen-left after the rival crosses, until release. Up/down circling is slightly diagonal on screen because Duel is three-quarter, not perfectly broadside. Near end-on alignment there is no clear horizontal “toward”; the last side wins. The shuffle/tell animations remain Claude’s separate work.

**Spacing:** the real-renderer captures confirm that Lock-on compresses the visible distance. At 1.5 / 3.25 / 4.5 world units, horizontal centre separation is about 54 / 64 / 58 pixels of an 800px view (6.7% / 8.0% / 7.2%). Duel gives about 110 / 218 / 285 pixels (13.8% / 27.3% / 35.6%). These are chest-centre projections, not empty pixels between silhouettes. Morrow hides much of Tala at close range in Lock-on; its horizontal separation is not even monotonic as the shoulder offset and camera distance adjust.

## Play

- [Side controls](http://localhost:4212/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&controls=side)
- [Lock-on controls](http://localhost:4212/dist/index.html?move=v2&arena=ring&burst=v2&step=linear&controls=lockon)
- Add `&morrow=jab15heavy` to either for the heavy jab; add `&mode=training` to preselect training.
- Server: `python3 -m http.server 4212 --bind :: --directory /Users/adamwilliams/rift-worktrees/controls-view`. Both localhost and 127.0.0.1 were verified.

## Commands with default keyboard bindings

The meaning is always rival-relative. Side commands below assume a fresh/released direction, with the rival visibly on that side. While latched, the current mapping shown in training/manual applies. P2 uses the corresponding arrows; controller stick/D-pad directions use the same rule. Dedicated buttons U/I/O/L and controller X/LB/RB/Y are unchanged.

Action | Side: rival right | Side: rival left | Lock-on
--- | --- | --- | ---
Toward / away | D / A | A / D | W / S
Into / out of screen circle | W / S | W / S | A / D circle left/right
Forward / retreat special + J | D / A | A / D | W / S
Third signature + J | W | S | A
Directional capture + J | S | W | D
Double-tap + J: pursuit | D | A | W
Double-tap + J: Burst | A | D | S
Double-tap + J: launcher | S | W | D
Double-tap + J: crossover | W | S | A
Double-tap + K: jump | W | S | A
Toward + K: circle behind | D | A | W

Grounded Move V2 steps retain the 12f tap window; directional attack/jump commands retain 18f. A step can still be cancelled by its existing attack/guard command. With grab=deliberate, only the dedicated capture button grabs; grab=hold still requires eight held frames of the rival-relative capture direction. These existing switches are not changed.

## Verification

**738 tests pass**, 104 files, zero failures/cancellations via `node scripts/run-tests.mjs`. Ten new tests cover eight angles/both seats, hysteresis, held crossing, opposed-key holds, default mapping/camera, commands through both the parser and actual simulation, lesson bindings, and camera forcing. Default fingerprint remains `c1fc5ebc1cb77d6845830c4c67fa56d416bf079f78d16c51fac4e1b8d049071a`.

Bot check only: 7,200 paired simulation ticks (all six fighters, both schemes, delayed punisher/masher input) give identical match state when the adapter receives the physical directions corresponding to the same rival-relative inputs. This is an equivalence check, not a win-rate tournament or a claim about human control feel.

Browser: six URL/keyboard checks cover baseline, side and lock-on, each with/without heavy Morrow. They verify the saved-camera override, approach key, sidestep, training label and help. Those deterministic input checks stub the renderer. Separately, real-renderer fixtures load both graphic rigs, capture all three spacing distances under each camera, and measure all four keys at eight circle angles. No page errors. Keyboard/controller inputs share the adapter; physical-controller play remains untested.

No combat rules, timings, hitboxes, move data, models, rigs, animation files or camera formulas changed. No Claude branch merged. Rebinding UI uses screen-direction labels for side mode; guided lessons resolve the current side; training history shows physical input arrows. Gameplay stays on `codex/controls-view`, based on `6b86f39`, pending Adam’s normal-speed verdict.

[Cloud run 41566287400](https://github.com/Tusingw29/rift-duel/actions/runs/41566287400) passed the full 738-test suite and browser checks on `0b2f805`. The first workflow submission had an IPv6-command YAML parsing error; that workflow syntax was corrected before this successful run. `audit.json` records unchanged simulation/camera source files and the tested source hashes; `cloud-browser.json` records the independent browser pass.

## Camera spacing (real renderer, 800 × 600)

Scheme | World gap | Horizontal px | Horizontal % width | Vertical px | 2D centre distance px | Capture
--- | --- | --- | --- | --- | --- | ---
Side / Duel | 1.5 | 110.34 | 13.79 | 6.36 | 110.52 | side-gap1.5-1793672881478.jpg
Side / Duel | 3.25 | 218.52 | 27.32 | 12.08 | 218.85 | side-gap3.25-1793672881478.jpg
Side / Duel | 4.5 | 285.11 | 35.64 | 15.33 | 285.52 | side-gap4.5-1793672881478.jpg
Lock-on | 1.5 | 53.82 | 6.73 | 42.50 | 68.58 | lockon-gap1.5-1793672881478.jpg
Lock-on | 3.25 | 63.73 | 7.97 | 63.01 | 89.62 | lockon-gap3.25-1793672881478.jpg
Lock-on | 4.5 | 57.82 | 7.23 | 68.51 | 89.65 | lockon-gap4.5-1793672881478.jpg

Weakest view: Lock-on at 1.5 units; the foreground fighter substantially obscures the defender. Side captures expose the gap more clearly. Still images do not judge the comfort of transitions or input latency.

## Key → screen-direction table

Each row projects a 0.1-world-unit movement at the fighter’s feet through the real camera, from a 3.25-unit gap. +X is screen-right; +Y is screen-down. Angles rotate the fighter pair in world space with the selected camera following them. This is a local movement derivative, not a wall/step-distance measurement.

Scheme | World angle | Key | Relative x/z | Screen dx px | Screen dy px
--- | --- | --- | --- | --- | ---
Side / Duel | 0 | A | -1 / 0 | -6.87 | 0.57
Side / Duel | 0 | D | 1 / 0 | 6.85 | -0.57
Side / Duel | 0 | W | 0 / -1 | -0.61 | -2.56
Side / Duel | 0 | S | 0 / 1 | 0.62 | 2.60
Side / Duel | 45 | A | -1 / 0 | -6.87 | 0.57
Side / Duel | 45 | D | 1 / 0 | 6.85 | -0.57
Side / Duel | 45 | W | 0 / -1 | -0.61 | -2.56
Side / Duel | 45 | S | 0 / 1 | 0.62 | 2.60
Side / Duel | 90 | A | -1 / 0 | -6.87 | 0.57
Side / Duel | 90 | D | 1 / 0 | 6.85 | -0.57
Side / Duel | 90 | W | 0 / -1 | -0.61 | -2.56
Side / Duel | 90 | S | 0 / 1 | 0.62 | 2.60
Side / Duel | 135 | A | -1 / 0 | -6.87 | 0.57
Side / Duel | 135 | D | 1 / 0 | 6.85 | -0.57
Side / Duel | 135 | W | 0 / -1 | -0.61 | -2.56
Side / Duel | 135 | S | 0 / 1 | 0.62 | 2.60
Side / Duel | 180 | A | -1 / 0 | -6.87 | 0.57
Side / Duel | 180 | D | 1 / 0 | 6.85 | -0.57
Side / Duel | 180 | W | 0 / -1 | -0.61 | -2.56
Side / Duel | 180 | S | 0 / 1 | 0.62 | 2.60
Side / Duel | 225 | A | -1 / 0 | -6.87 | 0.57
Side / Duel | 225 | D | 1 / 0 | 6.85 | -0.57
Side / Duel | 225 | W | 0 / -1 | -0.61 | -2.56
Side / Duel | 225 | S | 0 / 1 | 0.62 | 2.60
Side / Duel | 270 | A | -1 / 0 | -6.87 | 0.57
Side / Duel | 270 | D | 1 / 0 | 6.85 | -0.57
Side / Duel | 270 | W | 0 / -1 | -0.61 | -2.56
Side / Duel | 270 | S | 0 / 1 | 0.62 | 2.60
Side / Duel | 315 | A | -1 / 0 | -6.87 | 0.57
Side / Duel | 315 | D | 1 / 0 | 6.85 | -0.57
Side / Duel | 315 | W | 0 / -1 | -0.61 | -2.56
Side / Duel | 315 | S | 0 / 1 | 0.62 | 2.60
Lock-on | 0 | A | 0 / -1 | -8.14 | -0.74
Lock-on | 0 | D | 0 / 1 | 8.17 | 0.74
Lock-on | 0 | W | 1 / 0 | 2.44 | -3.74
Lock-on | 0 | S | -1 / 0 | -2.49 | 3.82
Lock-on | 45 | A | 0 / -1 | -7.88 | -0.70
Lock-on | 45 | D | 0 / 1 | 7.91 | 0.70
Lock-on | 45 | W | 1 / 0 | 2.34 | -3.57
Lock-on | 45 | S | -1 / 0 | -2.38 | 3.64
Lock-on | 90 | A | 0 / -1 | -8.14 | -0.74
Lock-on | 90 | D | 0 / 1 | 8.17 | 0.74
Lock-on | 90 | W | 1 / 0 | 2.44 | -3.74
Lock-on | 90 | S | -1 / 0 | -2.49 | 3.82
Lock-on | 135 | A | 0 / -1 | -7.88 | -0.70
Lock-on | 135 | D | 0 / 1 | 7.91 | 0.70
Lock-on | 135 | W | 1 / 0 | 2.34 | -3.57
Lock-on | 135 | S | -1 / 0 | -2.38 | 3.64
Lock-on | 180 | A | 0 / -1 | -8.14 | -0.74
Lock-on | 180 | D | 0 / 1 | 8.17 | 0.74
Lock-on | 180 | W | 1 / 0 | 2.44 | -3.74
Lock-on | 180 | S | -1 / 0 | -2.49 | 3.82
Lock-on | 225 | A | 0 / -1 | -7.88 | -0.70
Lock-on | 225 | D | 0 / 1 | 7.91 | 0.70
Lock-on | 225 | W | 1 / 0 | 2.34 | -3.57
Lock-on | 225 | S | -1 / 0 | -2.38 | 3.64
Lock-on | 270 | A | 0 / -1 | -8.14 | -0.74
Lock-on | 270 | D | 0 / 1 | 8.17 | 0.74
Lock-on | 270 | W | 1 / 0 | 2.44 | -3.74
Lock-on | 270 | S | -1 / 0 | -2.49 | 3.82
Lock-on | 315 | A | 0 / -1 | -7.88 | -0.70
Lock-on | 315 | D | 0 / 1 | 7.91 | 0.70
Lock-on | 315 | W | 1 / 0 | 2.34 | -3.57
Lock-on | 315 | S | -1 / 0 | -2.38 | 3.64

## Screen crossings

160-frame deterministic fixtures, camera smoothing at 60Hz. Straight cross moves P1 from x=-2 to +2 past a stationary P2; slow walk completes one orbit in 120f. Crossover uses the real simulation’s dedicated crossover action. No key is held in the unheld fixture; the held variant maintains one direction through frame 119, then releases. Full positions/projections are in fixtures.json.

Fixture | Held until frame 120 | Mapping flip frames
--- | --- | ---
cross | no | 41
cross | yes | 120
walk | no | none
walk | yes | none
crossover | no | 11, 18
crossover | yes | none

## All directional command parser fixtures

Frames 0/2 tap the direction, frame 1 releases, frame 3 presses attack or guard. Null means no dedicated double-tap guard command, not that ordinary guard is disabled. Simulation tests separately verify actual pursuit, Burst, launch, crossover and jump execution for both screen sides and schemes.

Scheme | Rival side | Key | Button | Command
--- | --- | --- | --- | ---
Side / Duel | right | A | attack | super
Side / Duel | right | A | guard | none
Side / Duel | right | A | step | step:back
Side / Duel | right | D | attack | pursuit
Side / Duel | right | D | guard | none
Side / Duel | right | D | step | step:forward
Side / Duel | right | W | attack | jumpAttack
Side / Duel | right | W | guard | jump
Side / Duel | right | W | step | step:up
Side / Duel | right | S | attack | launch
Side / Duel | right | S | guard | none
Side / Duel | right | S | step | step:down
Side / Duel | left | A | attack | pursuit
Side / Duel | left | A | guard | none
Side / Duel | left | A | step | step:forward
Side / Duel | left | D | attack | super
Side / Duel | left | D | guard | none
Side / Duel | left | D | step | step:back
Side / Duel | left | W | attack | launch
Side / Duel | left | W | guard | none
Side / Duel | left | W | step | step:down
Side / Duel | left | S | attack | jumpAttack
Side / Duel | left | S | guard | jump
Side / Duel | left | S | step | step:up
Lock-on | right | A | attack | jumpAttack
Lock-on | right | A | guard | jump
Lock-on | right | A | step | step:up
Lock-on | right | D | attack | launch
Lock-on | right | D | guard | none
Lock-on | right | D | step | step:down
Lock-on | right | W | attack | pursuit
Lock-on | right | W | guard | none
Lock-on | right | W | step | step:forward
Lock-on | right | S | attack | super
Lock-on | right | S | guard | none
Lock-on | right | S | step | step:back
Lock-on | left | A | attack | jumpAttack
Lock-on | left | A | guard | jump
Lock-on | left | A | step | step:up
Lock-on | left | D | attack | launch
Lock-on | left | D | guard | none
Lock-on | left | D | step | step:down
Lock-on | left | W | attack | pursuit
Lock-on | left | W | guard | none
Lock-on | left | W | step | step:forward
Lock-on | left | S | attack | super
Lock-on | left | S | guard | none
Lock-on | left | S | step | step:back
