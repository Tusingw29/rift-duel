---
name: sandbox-scenarios
description: Use and extend Rift Duel's deterministic animation sandbox (dist/sandbox.html) and its scripted scenarios to inspect any combat state frame by frame, and to write replay tests. Use when a state needs inspecting, a bug needs a reproducible frame, or a new mechanic needs a scenario.
---

# Sandbox scenarios

`dist/sandbox.html` (or `?sandbox=1` on the game) runs the real renderer and simulation with scripted inputs. Scrubbing replays the fixed-step simulation from reset, so frame N is always the frame N the game would show. `window.sandbox.seek(n)`, `.snapshot()`, `.models` and `.state` are scriptable.

## Scenarios (`dist/sandbox-recipes.js`)

A recipe is `{distance, stocks?, setup?(m), p1?(f, m), p2?(f, m)}`: P1 at the origin facing +x, P2 at `distance` facing back; `p1`/`p2` return the input object for frame `f` with the live match available for reactive scripts. `createScenario`, `stepScenario`, `scenarioAt(name, frame)` and `snapshot(p)` are the API; tests use the same functions.

Existing: idle, approach, retreat, circle, circle-step, pursuit, crossover, strike1–3, launch, capture, burst, charge, guard, recoil, guard-hit, stagger, stagger-recover, reversal.

## Input conventions (lock-on relative)

- `x` toward (+) or away (−) from the rival; `z` circles. Double taps need a neutral frame between presses; the command window is 18 frames.
- Command names from `dist/commands.js`: forward-forward attack = pursuit, back-back attack = burst (needs a stock), down-down attack = launch (`z:1`), up-up attack = crossover (`z:-1`), down attack = capture, up attack = technique.
- Guard pressed within 0.2 s of contact is a perfect deflect, not a block; scripts that want an ordinary block must hold guard earlier (the guard-hit recipe attacks on frame 20).
- The third-hit reversal needs the defender settled in guard, the attacker tapping each chain hit as the previous reaches contact, and a fresh guard tap two frames before the third contact; the reversal recipe derives this from the live attacker move.
- Stagger needs accumulated unblocked damage; the recipes call `hit()` four times in `setup` to break the guard deterministically.

## Adding a scenario

1. Write the recipe; prefer reactive scripts over hard-coded frames when timing depends on the fighter.
2. Trace it: a node snippet stepping `createScenario` and printing `snapshot` per frame shows exactly when the state fires.
3. Add assertions to `tests/sandbox-determinism.test.mjs`: the named state is reached at a known frame, replay equality for three pairings, scrub equals step.
4. Capture a strip with `scripts/review/sandbox-strip.mjs` and read it before claiming the animation works.

## Limits

Idle breathing and cloth sway use the renderer clock, so pixel-exact repeatability across runs holds for simulation state and bone poses driven by the move frame, not for the breathing offsets. The side camera needs the zero-time snap in `render.js`; the review and sandbox pages depend on it.
