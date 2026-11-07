# SEAL-VISUALS: the closing seal drawn in the game

2026-11-06 · Claude · branch `claude/seal-visuals` (from `codex/capture-seal` `51a7974`). Renderer only: `dist/seal-visual.js`, hooked from `dist/render.js`. Visible only with `seal=on`; nothing changes without it, and the simulation is untouched (a test checks drawing does not change a match).

## What it draws

- **Closing seal:** a ring in the caster's colour, fixed on the floor where the seal was cast. The drawn edge is the simulated radius: if your feet are outside it, you're out. It has a low see-through wall so it reads from the side and from behind. A thin dark ring marks where it started (3 units) and a thin white ring marks where it closes (1.5), so you can see how far it has to go. In the last 12 frames it pulses to red (steady red with reduced motion).
- **Escaped or broken seal:** turns grey, the wall drops, and it fades over 20 frames, so it doesn't look dangerous any more.
- **Escape cue:** a cyan arc at the escaper's feet that empties as the 30-frame dash window runs out, plus two chevrons pointing at the caster.
- **Escape dash:** cyan speed streaks trailing the dasher.

## Captures (real game renderer, low quality, headless)

| File | Frames | Reading |
|---|---|---|
| [seal-closing.jpg](seal-closing.jpg) | Tala's seal on an idle Morrow: seal frames 2, 16, 30, 44, 51 of 54 | Orange ring shrinks around Morrow; start and close rings show the progress; frames 44 and 51 are red. Weakest: frame 30, where the wall overlaps Morrow's coat. |
| [seal-escape.jpg](seal-escape.jpg) | Local versus: Vesper walks out (closing), escaped, +6 frames, dash | Ring stays where it was cast while she leaves; grey once escaped; cyan arc and chevrons at her feet; streaks behind her on the dash. Weakest: the chevrons are foreshortened from this camera. |

Script: `scripts/review/seal-visuals.mjs` (RIFT_BASE at a server for this branch). Screenshots can't judge normal-speed feel; that needs Adam's verdict.

## Not done yet

- A seal-specific capture finish. A caught seal still plays the close throw.
- The caster's casting hold. The caster stands in the normal capture pose for the 54 frames.
- Tuning colours on dark arenas, once Adam has seen it.
