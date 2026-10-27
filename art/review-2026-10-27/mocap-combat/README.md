# MOCAP-COMBAT and ANIM-WORKBENCH (2026-10-27)

Adam asked (2026-10-27) to stop hand-coding animation blind. The request had three parts:

1. **Footwork and get-up polish.** Fix the imported footwork and get-up defects measured in TALA-IMPORT-AB.
2. **Captured strikes.** Import real captured strikes and warp them onto the combat frame timing.
3. **Animation workbench.** Build one to see, pose, tune and export animation on the real rigs.

**Status: awaiting Adam's normal-speed verdict.** Everything captured stays opt-in: `?gait=imported` in the game, `&anim=imported` in the sandbox, or view B of the workbench. Authored is still the default.

## How to look at it

- **Workbench:** `anim-workbench.html` next to the game (https://tusingw29.github.io/rift-duel/anim-workbench.html once published). Pick a fighter and a state, then drag to orbit, click a joint and scrub. Query parameters: `?fighter=2&state=strike1&source=imported&layout=split&camera=orbit&frame=11`.
- **Game:** `?gait=imported` plays Tala's captured footwork, get-up and three-hit combo.
- **Sandbox:** `sandbox.html?scenario=strike3&p1=2&p2=1&anim=imported`.

## 1. Imported footwork and get-up polish (`dist/imported-motion.js`)

| Measure | TALA-IMPORT-AB (2026-10-26) | Now |
| --- | --- | --- |
| Skate per support frame, advance | 0.150 | 0.003 |
| Skate per support frame, retreat | 0.093 | 0.006 |
| Skate per support frame, circle left / right | 0.006 / 0.064 | 0.002 / 0.003 |
| Stance width after stopping (Tala's stance is about 0.7) | 1.46–1.50 on advance and right | 0.75 everywhere |
| Get-up lowest point | −0.31 | +0.07 |

- **Quicker cadence.** One captured cycle now covers 0.6 units forward or back and 0.65 strafing, against the authored 1.5 and 0.975. The athlete's steps are no longer stretched 2–4×. I measured 0.6, 0.7 and 1.2 for advance and kept the best.
- **Stance band.** Each foot stays on its own side and within 0.42 of the centre line, so a stretched sidestep can't split into a straddle.
- **Recovery step on stop.** When the captured gait ends, the stance re-anchors under the fighter. The old foot spots are walked off as two quick lifted steps, the farther foot first.
- **Get-up time warp.** The warp follows the take's own activity. Slow stretches, like settling on the floor and the pause before the push, are compressed hardest. The sit-up, tuck and push keep their share of the 28 frames. The get-up floor clamp shipped in WEIGHT-TRANSFER.

Captures: `ab-advance-guard-*.jpg`, `ab-circle-right-guard-*.jpg` and `ab-knockdown-getup-guard-*.jpg`. Row A is authored and row B is imported, on the same simulation frames, from the side camera and the fight camera.

## 2. Captured strikes (`dist/imported-combat.js`, `dist/clips/combat/`)

All three of Tala's combo hits are real punches from the CMU motion capture database. The licence is free for research and commercial use. Credit: "The data used in this project was obtained from mocap.cs.cmu.edu. The database was created with funding from NSF EIA-0196217."

| Hit | Source | Frames (impact) | Wind-up / follow at source speed |
| --- | --- | --- | --- |
| 1 rear-hand straight | CMU 13_17, boxer driving in | 576–654 (625) | 0.41 s / 0.24 s |
| 2 lead-hand straight | CMU 14_01, stepping in | 2104–2147 (2135) | 0.26 s / 0.10 s |
| 3 rear-hand hook | CMU 14_03, stepping through, southpaw mirrored to Tala's orthodox stance | 4617–4699 (4679) | 0.52 s / 0.17 s |

`scripts/mocap/find-strikes.mjs` lists every punch, kick or cut in a take. For each one it reports the lead or rear side, the signed hip drive toward the target, the drop, and the wind-up and settle frames. The boxers in 14_xx switch stance during the takes, so picks were made by side, not by hand. `scripts/mocap/export-combat-clips.sh` regenerates the clips.

- **Time warp.** The wind-up maps onto the move's startup, with an adjustable curve. The impact is held through the active frames, and through hitstop, which stops the move frame. The follow-through maps onto the recovery. The fist lands on the simulation's damage frame, and tests cover all three hits.
- **Arms and torso.** Each channel keeps the athlete's motion but is rescaled so the capture's impact lands on Tala's authored contact pose. That pose is aimed at the rival and covered by the existing tests.
- **Hips and feet.** These come straight from the capture, scaled to Tala's legs, and step home through the late recovery.
  - Hit 1 steps the lead foot in 0.25 and drags the rear foot 0.36, with the hips 0.26 forward and dropping.
  - Hit 2 takes a big lead step of 0.6.
  - Hit 3 is a full step-through, with the rear foot ending about 1.2 ahead before it steps home.
  - The simulation's 0.4 chain advance is absorbed by the same foot hook as the authored strikes, so feet don't skate or cross. The hips are continuous in world space across each chained hit.
- **Captures.** The `tala-combo-authored-vs-captured-*.jpg` strips show the same simulation frames: row A is authored with weight transfer, row B is captured.

### Gaps

- **Kicks.** The CMU kick takes (74_03–06) cover 1–2 units of travel, which fits no grounded move. Tala's kick technique is a flying rush. No kick was imported.
- **Sword.** The swordplay takes (02_07–09) are slow sparring, with hand speeds a third of a punch and almost no hip drive. They are listed by the finder but not used. Aegis and Morrow keep their authored cuts with the weight transfer. A proper weapon source would need a different licence-clean dataset.

## 3. Animation workbench (`dist/anim-workbench.html`, `dist/anim-workbench.js`)

- **Real frames.** Every frame is the real simulation, using the sandbox recipes plus workbench recipes that press the real inputs for each move. The game's animators animate it and the game's renderer draws it.
  - **Fighters and states:** all six fighters; idle, four run directions, strikes 1–3, shot, forward, back, technique, launch, grapple, knockdown to get-up, defeat, hit, stagger and victory. Every other sandbox scenario is listed too.
  - **Views:** A is the authored reference with no tweaks. B is mocap imported, hybrid (mocap plus tweaks), or authored plus tweaks.
  - **Layouts:** side by side, overlay (B's skeleton drawn over A) or B only.
- **Joints and keys.**
  - **Joints:** click a joint sphere, or pick from the list: hips, spine and chest, head, clavicles, shoulders, elbows, wrists, hips, knees, ankles, foot targets, and the blade tip for Aegis and Morrow.
  - **Sliders:** they edit that joint's channels as additive offsets at a named key (coil, drive, whip, impact, overshoot, recovery). Offsets fade to zero at the neighbouring keys.
  - **Tweak layer:** `dist/anim-tweaks.js` runs inside the real Tala and grounded animators. It is empty in the game until data is exported into `dist/anim-tweaks-data.js`.
- **Trails and balance.**
  - **Motion trail:** the selected joint's path over the whole scenario, coloured wind-up, whip, impact and recovery. The default joint is the punching wrist, the blade tip, an ankle while running, or the hips when falling.
  - **Centre of mass:** a plumb line computed from Dempster segment masses. It is green when the centre of mass is over the support between the feet and orange outside it, with the distance in the readout.
- **Time-warp and timing panel.**
  - **Plot:** the capture's clip position over the move, or for authored moves the hip drive, lead step and hip height of the weight transfer.
  - **Sliders:** wind-up curve, impact shift, hip lead, mocap reach, mocap lean, return start, weight-transfer scale, kinetic-chain lead frames (pelvis, spine, shoulder, clavicle, elbow) and the get-up warp.
- **Export.** It copies the tuned data, or downloads a ready `anim-tweaks-data.js`. The tuning block names the file each value lives in.
- **Automation.** `window.animWorkbench` exposes `set({fighter,state,source,layout,camera,orbit,joint,key,tuning,frame})`, `seek`, `setTweak`, `selectJoint`, `exportData`, `trails` and `last`, which holds the centre-of-mass numbers. `scripts/review/anim-workbench-probe.mjs` drives it. It fails on page errors, missing trails, or a tweak that doesn't move view B while leaving view A unchanged. It now runs in the browser-smoke workflow on branch previews and on the published site.
- **Shared changes.**
  - `render.js` gained a custom camera that skips the fight-camera fit, and a camera getter.
  - `grounded-animation.js` exports `LEAD`.
  - `weight-transfer.js` gained `weightTuning`.

Workbench captures are the `workbench-*.jpg` files. `workbench-probe.json` holds the probe's numbers.

## Tests

600 pass. The new tests are:

- `tests/mocap-combat.test.mjs`: sources and licences, the warp landing on the damage frame and holding through active, contact on the authored aim, hips driven at the rival, home by the end, hitstop holding, the get-up warp, cadence, and stance after stopping.
- `tests/anim-tweaks.test.mjs`: nothing ships by default, key weights, and a tweak at impact moving Tala, Aegis, Morrow and Rei exactly and vanishing when off or cleared.
- `tests/tala-import-ab.test.mjs`: the held-foot check now measures the ball of the foot, since a heel raise moves the ankle.

## Known defects and questions for Adam

- **Hook turn.** The captured hook turns Tala's torso hard toward the camera during its step-through, before contact. It is the athlete's real rotation. Your normal-speed eye decides whether it reads as committed or as too much.
- **Long recovery steps.** The step-home after a captured strike is required because the simulation root does not move. After the big lead step and the step-through it is a long walk back. Lowering "Return start" or "Mocap reach" in the workbench shortens it.
- **Load time.** The workbench's software-GL first load takes about 25 s headless. In a normal browser it is a few seconds.
