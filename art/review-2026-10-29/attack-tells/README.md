# ATTACK-TELLS (2026-10-30), Morrow ready for review

Owner Claude. Branch `claude/attack-tells`. **Status: Review, awaiting Adam's verdict.** Animation only. No frame data, hitbox or combat change, and nothing changes unless `?tell=on` is in the URL.

## What changed under `?tell=on`

**Last Horizon (Burst).** Before, it had no authored animation. The old fallback raised the sword slowly over all 22 frames with the body upright, so it looked like idle until about frame 15. Now:
- the sword is raised high with the blade pointing at the sky, the chest leans back and the hips drop by about 0.3;
- the pose is in place by about frame 6 of 22 and held until about frame 18;
- the legs keep sinking while the arms hold still, so the pose reads as a load, not a freeze.

See `burst-tell-ab.jpg`: top row shipped, bottom row tell on, at frames 2, 9 and 15.

**Launcher.** The blade drops low behind the hip and the hips sink by about 0.45 into a deep crouch from about frame 7 of 24. Then the blade tears upward on contact. This replaces the rejected `?tell=hold` approach, which delayed the launcher's visible cue. See `launch-tell-ab.jpg`.

**Gravefall (Strike 3).** Its overhead load is reached earlier and held. The pose itself is unchanged.

## What this can't fix

- **Reaction time.** Last Horizon is 22 frames, so its pose is readable for about 16 frames. That's roughly a human reaction, so it gives a warning, not a free dodge. It only becomes dodgeable once Codex's `burst=v2` gives it a real reach and arc. Today it hits anyone within 9 units.
- **Fast moves.** Strike 1 (11f), shots (11f), grab (13f) and pursuit (7f) are too fast for any tell. They're beaten by spacing.

## How it's built

- Each fighter can give a move a `tells` entry: a load pose, plus an optional peak and follow-through. Only Morrow has entries so far.
- With `tell=on`, an entry switches that move to a schedule that reaches the load at 30% of startup, sinks the legs until 4 frames before contact, then drives and whips in the last frames. Contact stays on the startup frame.
- Moves without an entry are unchanged, including the other fighters' moves.

Check it here:
- `anim-workbench.html?fighter=3&state=burst&tell=on`
- `?state=launch`
- `?state=strike3`

Play it with `index.html?tell=on`. This branch starts from main, so it does not include Codex's ring or move=v2 yet; the two combine once both are merged.

## Tests

- `tests/attack-tells.test.mjs`:
  - off by default, with launcher and Gravefall poses identical to shipped;
  - Last Horizon is overhead by 40% of startup;
  - the launcher is low and crouched, then rises on contact.
- All 269 tests across the 37 animation-related files pass.

## Questions for Adam

1. Can you see Last Horizon and the launcher coming now, at normal speed?
2. Should the poses be bigger or smaller?
3. If yes, should tells become the default, then be authored for the other five fighters?
