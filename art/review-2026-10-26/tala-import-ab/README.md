# TALA-IMPORT-AB — does imported motion make Tala more natural?

Experiment, 26 October 2026, branch `claude/tala-import-ab`. Tala only. **Authored stays the default**; nothing here is accepted until Adam has watched both at normal speed.

## How to review

Sandbox, real simulation, identical inputs and timing for A and B, scrubbable frame by frame, Play at 60 Hz / 0.5× / 0.25×:

- Local (worktree served on port 4187): `http://localhost:4187/dist/sandbox.html?scenario=ab-advance-guard&p1=2&p2=1`
- Public, once merged: `https://tusingw29.github.io/rift-duel/sandbox.html?scenario=ab-advance-guard&p1=2&p2=1`

Use **Tala animation (A/B)** to switch between *A · Authored* and *B · Imported*; the switch rebuilds the rig and replays to the same frame. **Camera** offers *Side* and *Lock-on* (the behind-player fight camera the game uses). Add `&anim=imported` to open in B. Scenarios: `ab-advance-guard`, `ab-retreat-attack`, `ab-circle-left-guard`, `ab-circle-right-guard`, `ab-knockdown-getup-guard`, `ab-advance-hit`, `ab-advance-strike-hitstop`. In the game itself `?gait=imported` turns it on for Tala.

## 1. What already existed and what was reused

| Piece | Reused as-is | Extended |
| --- | --- | --- |
| `scripts/mocap/bvh-to-channels.mjs` (BVH parse, forward kinematics, joint-direction retarget into pose channels) | Parsing, FK, channel extraction | Segment export (`--segment a:b --mode loop|oneshot`): step cycles cut between foot lift-offs, travel separated from pelvis sway, ankle paths relative to the travel line, ball-of-foot contacts, all lengths in source leg lengths; `--pelvis-frame` floor-work retarget (pelvis orientation to `bodyPitch/hipYaw/bodyRoll`, hip height above the floor). Toe joints and ankle positions added to `--dump`. No second importer. |
| Pose channels, `applyPose`, entry/flow blending in `tala-animation.js` | Unchanged; imported poses go through the same blends | Tala's `movePose` and get-up choose the imported source when it is selected |
| `plantSupportFeet` two-bone solve, ball-of-foot pivot, gait-landing settle | Unchanged | Imported foot targets (`importedGaitTargets`) and a heel-raise pivot (`importedFootPivot`) plug into the existing hooks |
| `locomotion-clips.js` source switch (`authored`/`mocap`, Codex's MOCAP-REVIEW) | Kept | Third source `imported` |
| Sandbox (`dist/sandbox.html`) | Scenarios, scrubbing, cameras | A/B switch; every replayed frame now animates on the simulation clock (it previously rendered with a frozen clock and skipped the animation state of replayed frames); waits for the graphic body to attach before replaying; per-scenario lengths |
| Simulation-owned states (`getUp` 28 f, bounce 18 f, jump squat 6 f, hitstop) | Untouched | The imported get-up reads `getUp.frame` |

New: `dist/imported-motion.js` (runtime), `dist/clips/import/*.js` (five clips), `scripts/mocap/find-footwork.mjs`, `scripts/mocap/contact-timeline.mjs`, `scripts/mocap/export-tala-import.sh`, `scripts/review/import-*.mjs`, `tests/tala-import-ab.test.mjs`. `dist/combat.js` and `dist/combat-travel.js` are untouched.

## 2. Source motion and licences

All from the CMU Graphics Lab Motion Capture Database (mocap.cs.cmu.edu), BVH conversion by cgspeed (B. Hahne) via the `Shriinivas/cmubvh` mirror. CMU: free for research and commercial use; the conversion adds no restrictions. Credit requested: "The data used in this project was obtained from mocap.cs.cmu.edu. The database was created with funding from NSF EIA-0196217." Licence text is embedded in every clip's `meta.source`.

| Action | Take | Frames used (120 fps) | What it is | Why this one |
| --- | --- | --- | --- | --- |
| Combat advance | 14_01 *boxing* | 2995–3132 (two lift-offs of one foot) | Orthodox boxer stepping in, guard up | Same subject for all footwork; left foot leads like Tala |
| Combat retreat | 14_03 *boxing* | 1798–1847 | Same boxer stepping back | Genuine backward footwork, **not** a reversed run |
| Sidestep left | 14_03 *boxing* | 519–570 | Lateral shuffle to his left, 100% sideways travel | Genuine lateral footwork, **not** an adapted forward walk |
| Sidestep right | 14_01 *boxing* | 1307–1355 | Lateral shuffle to his right, 91% sideways | As above |
| Get-up | 140_09 *get up from ground laying on back* | 150–600 | Lies on back, sits up, tucks feet, pushes up to a crouched ready pose | Starts on the back like our knockdown; continuous, no pause |

Candidates were found by `find-footwork.mjs`, which classifies travel against where the guard hands point (a bladed boxer's pelvis does not face the opponent). Rejected: 76_09/76_11 and 69_xx dedicated backward/sideways walks (hands down, not combat), 77_18 get-up (1.2 s sitting pause in the middle), 111_06/114_02 (3.7–4.3 s), 139_18 (identical to 77_18 in the mirror).

**Limitations, not substituted around:** there is no CMU take of fast combat footwork or a fighting-game-speed get-up. Boxing footwork from this subject travels 0.3–1.2 units/s at Tala's scale; the simulation moves her at 6.4 units/s (a run). The get-up takes 3.75 s; the simulation gives 28 frames (0.47 s).

## 3. Retarget

- **Proportions and axes.** Joint *directions* (not bone rotations) are measured in the source, so rest pose and bone-axis differences between the CMU skeleton and Tala's rig do not leak in. All lengths are stored in source leg lengths and rescaled to the rig's own thigh+shin at runtime.
- **Travel versus pelvis.** Each cycle's straight-line travel is removed; what remains is pelvis sway (lateral, bob, surge), applied around Tala's root. The simulation keeps world position and air height; nothing moves the collision body (test: simulation snapshots identical in both modes, every frame).
- **Upper body.** Spine, arm, clavicle and head channels are applied as deviations from the clip's cycle mean around Tala's own stance, so her approved fist and guard placement stays hers and only the captured motion is added. Legs are absolute and then solved to the foot targets (knee direction preserved by the existing two-bone solve).
- **Feet.** Each foot's offset from the travel line is rotated into the canonical direction (advance/retreat/left/right) and only its excursion around its own mean stance position is stretched. While the clip says a foot is down its world position is held (contact lock); through the swing the gap between the held spot and the clip path fades out. A heel raised in the source (boxers stand on the balls of the feet) becomes a foot pitch about the ball instead of a hovering ankle.
- **Speed.** Phase advances with distance travelled at the same cycle length as authored (1.5 units forward, 0.975 strafing), so both modes take the same steps over the same distance. The imported stride is therefore stretched and its tempo raised:

| Clip | Source speed | Game ÷ source | Stride stretch | Tempo vs source |
| --- | --- | --- | --- | --- |
| Advance | 0.31 u/s | 20.4× | 4.19× | 4.9× faster |
| Retreat | 0.86 u/s | 7.5× | 4.30× | 1.7× faster |
| Left | 1.15 u/s | 5.6× | 1.99× | 2.8× faster |
| Right | 0.91 u/s | 7.0× | 2.68× | 2.6× faster |
| Get-up | 3.75 s | — | — | 8.0× time compression into 28 frames |

- **Timing.** Footwork phase comes from distance travelled, the get-up from `getUp.frame / 28`; no wall clock. Hitstop freezes both (test: bone matrices identical across every hitstop frame). The 6-frame jump squat, 18-frame bounce, knockdown hold and Tala's KO collapse are unchanged (test: KO pose identical in both modes).
- **Entry/interruption.** Imported poses use the same flow blends as authored; a hit, guard or attack interrupts them exactly as before. The get-up blends in from the knockdown pose over its first 15% and into the stance over its last 15%.

## 4. Measurements (`metrics.json`, `scripts/review/import-metrics.mjs`)

Same simulation, same frames, graphic Tala, both modes. "Support" means an ankle within 2 cm of its ground height; any horizontal movement of a supporting foot counts as skating (that includes a foot sliding low along the floor).

| Scenario | Skate per support frame A / B | Worst frame A / B | Pelvis sway A / B | Pelvis bob A / B | Chest twist A / B | Largest joint jump A / B |
| --- | --- | --- | --- | --- | --- | --- |
| Advance → guard | 0 / 0.150 | 0.000 / 0.739 | 0.143 / 0.087 | 0.123 / 0.175 | 0.54 / 0.59 | 0.60 / 0.85 |
| Retreat → attack | 0 / 0.093 | 0.000 / 0.878 | 0.107 / 0.053 | 0.121 / 0.211 | 0.35 / 0.10 | 0.62 / 0.62 |
| Circle left → guard | 0.019 / **0.006** | 0.244 / **0.008** | 0.112 / 0.046 | 0.139 / 0.195 | 0.28 / 0.09 | 0.43 / 0.40 |
| Circle right → guard | 0.000 / 0.064 | 0.009 / 0.205 | 0.100 / 0.042 | 0.139 / 0.197 | 0.28 / 0.32 | 0.39 / 0.52 |
| Advance, hit mid-step | 0 / 0.110 | 0.001 / 0.874 | 0.144 / 0.089 | 0.191 / 0.181 | 0.54 / 0.59 | 0.60 / 0.85 |
| Advance → strike (hitstop) | 0 / 0.116 | 0 / 0.738 | 0.143 / 0.086 | 0.119 / 0.169 | 0.54 / 0.59 | 0.63 / 0.85 |

Both modes: no knee bends backwards, hands never drop below the chin while moving, zero joint motion during hitstop.

Get-up floor penetration, lowest point of the visible skinned body: **authored −0.66 at get-up frame 12** (left foot bone −0.37), **imported −0.31 at frame 16** (left foot bone −0.09). Both push the left foot through the floor; the authored one, live on main today, is about twice as deep. Recorded on the board as a separate defect.

Cost: animation step alone, 3,330 frames per mode (`scripts/review/import-ab-cost.mjs`): authored 0.45 ms mean / 1.59 ms p95, imported 0.41 ms / 1.28 ms. Rendering is identical (same meshes and materials). In the browser (headless Chromium, software GL, machine load ~15), drawing every frame of the 180-frame knockdown scenario: authored 47 ms mean / 112 ms p95, imported 37 ms / 107 ms, no page errors (`scripts/review/import-ab-perf.mjs`); absolute numbers reflect the software renderer, the comparison shows no added cost. Cloud browser smoke on the branch build: 10/10 checks, no console errors or warnings. Assets: five clips 70 KB raw / 17 KB gzip, runtime 11 KB / 4.6 KB gzip.

## 5. What the captures show

`ab-<scenario>-side.jpg` and `ab-<scenario>-lock.jpg`: row A authored, row B imported, the same simulation frames (labels show frame, state, get-up frame and HITSTOP). Captured with `scripts/review/import-ab-strips.mjs`, half resolution.

- **Get-up (`ab-knockdown-getup-guard-*`)** — the clearest difference. B sits up, tucks both feet under, crouches and pushes up through the legs; it reads as a person getting up. A rolls onto a hip with one leg out and kneels. B is compressed 8×, so at normal speed it may read as a spring-up; that is for Adam to judge. Both sink the left foot through the floor mid-rise (A more, see above).
- **Circle left** — B is steady: small shuffles, feet planted, measurably less skating than A.
- **Circle right** — B spreads the legs into a wide straddle that persists into the idle after stopping (stride stretch applied to lateral step excursions). Clear defect.
- **Advance / retreat** — B's rear foot slides fast and low along the floor (the boxer's drag at 4× stretch); B's pelvis sways about half as much as A, so it looks more upright and less weighted. The authored version reads more like a fighter's run, which is what the simulation speed is.
- **Hit and hitstop** — interruptions and freezes are identical in both modes.

## 6. Defects and limits

1. Advance, retreat and right sidestep: fast low foot drags (skate up to 0.74–0.88 units in a frame) — source drag × stride stretch.
2. Right sidestep: straddled legs that carry into the following idle.
3. The game moves Tala at running speed; no boxing take can be played at its own tempo there. The best a capture can do at 6.4 u/s is a stretched stride and a raised tempo, which removes much of what makes it look captured.
4. Get-up compressed 8×; the source is a deliberate everyday get-up, not a fighter's. Its left foot dips 0.31 below the floor around frame 16 (no floor clamp runs during `getUp`).
5. Pelvis sway in B is about half of A's, so the authored weight shift may read as more energetic.
6. Not evaluated at normal speed by a person; screenshots are not acceptance.

## 7. Provisional technical verdict

- **Footwork: reject in this form.** Measured skating is worse than authored in three of four directions, one direction has a visible straddle, and the root cause is structural: the simulation's travel speed is about 6–20× the speed of any combat footwork available in CMU. Motion capture can only help footwork if it is recorded at game speed (a running "fighting step", or the simulation's speed is changed — a combat-design decision outside this lane).
- **Get-up: worth revising and keeping in the comparison.** It is the one action where the imported motion is visibly more human (sit, tuck, push up) and it stays closer to the floor than the authored rise. It needs a faster source, or a tuned time-warp that keeps the hand and foot plants longer and compresses the transitions, plus a floor clamp during `getUp` (which would also fix the deeper authored penetration).
- **Weakest action: combat advance** (20× speed gap, 4.9× tempo raise, fastest drag).
- **Recommendation: revise, Tala only.** Keep authored footwork; consider the imported get-up after Adam's normal-speed look; do not expand to the other fighters until a game-speed footwork source exists. Normal-speed acceptance is Adam's.
