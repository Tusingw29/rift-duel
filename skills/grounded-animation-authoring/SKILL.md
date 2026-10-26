---
name: grounded-animation-authoring
description: Author or tune whole-body animation on Rift Duel's grounded rig system: stances, strikes keyed to the combat frame, guard, hit reactions, stagger, travel poses, footwork. Use for any fighter animation task and for the EZ board's animation bullets; do not convert the system to keyframe clips.
---

# Grounded animation authoring

All six fighters animate on one contract: a flat pose of channels blended toward a per-state target each frame, strikes keyed to the simulation's move frame, footwork driven by travelled distance, support feet planted by a two-bone solve. Root position belongs to the simulation (`dist/combat.js`, `dist/combat-travel.js`); animators only add body motion on top. Codex owns combat rules, so coordinate before touching those files.

## Where things live

- `dist/rig-pose.js`: `CHANNELS` (`bodyPitch/bodyRoll` root rotation for falls, `bodyX/Y/Z, hipYaw, lean, twist, side, hx/hy/hz, neckY/Z, lax/lay/laz, rax/ray/raz, le, re, llx/llz, rlx/rlz, lk, rk, lw/rw, lc/rc`), `applyPose`, `plantSupportFeet` (the list of kinds that keep planted feet; add a kind there when a new state should stay planted).
- `dist/grounded-animation.js`: `animateGroundedRig(r,player,time,prefix,targetFor,{stance,impact})` (entry blends, stride advance, cloth, and with `poses` the knockdown/defeat target, the rise overlay, the flight pose and the landing absorb), shared poses `pursuitTravelPose`, `leapPose`, `travelTarget`, `travelMotion`, `recoilPose`, `staggerPose`, `reversalPose`, `knockdownPose`/`downPose`/`risePose` (root pitched about the feet; the rig's root sits at floor level, so use the `root()` helper to place the hips), `flightPose`, `landingAbsorb`, `rearLoad` (wind-up lower-body load).
- Per fighter: `tala-animation.js` (its own flow, same contract), `aegis-animation.js`, `morrow-animation.js`, `roster-animation.js` (Rei, Sol, Vesper via a `grounded(prefix, def)` factory). Each exposes `targetFor(player, time, phase, motion)` returning `{kind, pose}` or `null` to fall back to the shared animator in `dist/animation.js`.
- `dist/animation.js` dispatches by fighter and wraps the handoff with the motion bridge (`motion-transition.js`), which eases between the grounded and shared families.

## Authoring rules

- Strikes: keys `[0 stance][startup*.6 wind, held: the tell][startup*.9 drive, snap][startup contact, snap][+recovery*.42 follow, held: the opening][+recovery*.78 retract][end stance]`. Measured from CMU boxing: hips carry about 60% of the shoulder turn (Tala contact hipYaw .55 with twist .5), the rear knee loads in the wind and extends through contact, the fist leaves the chamber only in the last third of the startup. Contact must land exactly on `move.startup`; tests compare the pose on that frame with the authored contact. Measure weapon tips before trusting angles (front views foreshorten).
- Entry blends clear over the startup for ordinary strikes and within three frames for travel moves (`move.travel`), otherwise the load or tuck never shows.
- Falls: `knockdown` and `defeat` are handled by the grounded animators through `downPose` (hit, topple, slam, bounce, settle over 0.55 s from CMU 90_18); the rise after a knockdown is a 0.45 s visual overlay (`risePose`, feet unplanted) because the simulation has no get-up state. Jumps use `flightPose` (push-off, tuck, reach) and `landingAbsorb` (0.22 s); airborne feet pitch up in `plantSupportFeet`.
- Hit reactions: the hurt timer counts down from `HURT_TIME` (0.42); use `recoilPose(impact, stance, animTime)`, never `mix(impact, stance, animTime/…)` (that inversion shipped once).
- Stagger: `player.staggerState` has `elapsed`, `remaining`, `inputs`; `staggerPose` sways on planted feet and straightens per recovery tap. `recover` (grounded) maps to an upright snap.
- Locomotion: reuse Tala's step clips through `movePose`; keep the arms near the fighter's stance (scale the arm swing) and feed `motion` from `travelMotion` when the simulation is travelling so circle-step strafes along the real arc.
- Wrists: `lw`/`rw` roll the hand about the forearm axis (hand bone local Y; fingers along −Y, palm +Z, knuckles −Z). Author them per state and measure the world palm/knuckle direction rather than guessing; the graphic combat rig uses the authored value when it is non-zero and its punch roll rule otherwise.
- Collarbones: `lc`/`rc` are protraction in radians (positive drives the shoulder forward). Author them on strikes (pull back on the wind, lead at contact) and on guard; leave 0 wherever the combat rig's reach rule is good enough. Only the 61-bone bodies have a clavicle.
- Weapons define the strike vocabulary; if a redesign changes a weapon, its strike tracks are the part that must be reauthored, everything else survives.
- Keep one fighter as the benchmark (Tala, then Rei) and extend after review; the board requires a normal-speed human verdict, screenshots are evidence of continuity only.

## Tests to extend

`tests/roster-animation.test.mjs` (contact exactness, guard geometry, planted ankles, stride), `tests/travel-animation.test.mjs` (load, drive, tuck, strafing), `tests/stagger-reversal-animation.test.mjs`, `tests/sandbox-determinism.test.mjs` (same frames on fresh rigs give identical bones). Run `npm test`; nothing ships below green.

## Decided and not to be reopened without new evidence

A proposal to replace these animators with `THREE.AnimationMixer` keyframe clips was reviewed on 2026-10-25 and declined: the animators are already frame-locked and deterministic, and the conversion would lose planted-foot solving, entry blends and distance-driven gait for no gain. The record is in `docs/EVIL_ZONE_TASKS.md`.
