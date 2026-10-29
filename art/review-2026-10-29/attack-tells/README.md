# ATTACK-TELLS (2026-10-29), in progress

Owner Claude. Branch `claude/attack-tells`. **Status: In progress.** Animation only; no frame data or combat change.

## What Adam reported

Morrow's attacks come "out of nowhere", with no visible wind-up.

## Findings so far

**Which moves can a tell help?** Morrow's moves that are faster than a 15-frame reaction can't be read, whatever the animation; they are beaten by spacing:
- Strike 1 (11f)
- shots (11f)
- grab (13f)
- pursuit (7f)

The moves a tell can help are:

| Startup | Moves |
| --- | --- |
| 16f | Strike 2, just |
| 18–24f | specials |
| 22f | Burst |
| 24f | Strike 3, launcher |

**What CPU Morrow actually lands.** 30 seeded CPU bouts against a wandering, part-guarding player. Share of the damage he dealt, by move:

| Move | Damage share |
| --- | --- |
| Burst | 44% |
| Grab | 31% |
| Launcher | 15% |
| Forward special | 5% |
| Pursuit | 4% |

So Burst and launcher matter most for tells.

**Burst** (`burst-strip.jpg`). It isn't animated by the kinetic schedule: the grounded rig returns no target for `super`, so the old `animation.js` fallback raises the sword with a linear ease over all 22 frames. The body stays upright. Once the startup ends, the cinematic is decided from up to 9 units away, so this tell is worth the most.

**Launcher** (`launch-ab.jpg`, A shipped, B `?tell=hold`). The visible cue is the sword rising toward the peak, not the load. The first `?tell=hold` attempt amplifies and holds the load, which keeps the sword low for longer. That makes the launcher read later, not earlier. Rejected as is.

## What's on the branch

- `?tell=hold`: an opt-in held-load schedule for 16f+ startups. Off by default.
- `anim-workbench.html?tell=hold`: view B renders the held version next to view A, the shipped version.
- Burst added to the workbench states.

Morrow animation and kinetic tests pass (38).

## Next

Author a distinct, readable load silhouette for each of Morrow's reactable moves, reached by about 40% of startup and held:
- **Burst:** sword overhead, lean back, rear knee sinks.
- **Launcher:** sword dropped low behind, deep crouch.
- **Strike 3:** the overhead it already has, held and deepened.
- **Specials:** the shoulder load, exaggerated.

Then check each one in the workbench at game camera distance. Burst needs a grounded-rig target so it stops using the fallback.
