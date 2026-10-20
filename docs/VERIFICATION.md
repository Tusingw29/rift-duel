# Verification record

October 20, 2026.

## Automated simulation checks

`npm test`: 12 passing Node tests. Coverage includes tap projectiles and actual damage, sidestep evasion, charge capacity, low-health charge acceleration, timed guard/chip, capture escape, launch/pursuit, stock consumption, timeout/training reset, finite state across all six CPU matchups, different signature patterns, and ranged capture cinematics.

`node --check`: main application and renderer syntax pass.

GitHub Actions runs the tests before publishing `dist/` to Pages. The initial workflow completed successfully.

## Browser checks

Tested in the available desktop Chrome browser:

- Menu renders its original 3D character and arena.
- Training starts with correct HUD and player state.
- Keyboard tap attack reduces opponent health from 100 to 93.
- WASD movement changes player position.
- Stock burst consumes one stock, enters a cinematic, and deals damage (100 to 73).
- Pause/resume preserves the active match.
- A simulated standard Gamepad API device moves P1 and fires a projectile.
- Local-versus second-player arrow input moves P2 independently.
- No console errors or warnings after the favicon fix.
- Narrow viewport has no horizontal document overflow and shows touch controls.
- Public GitHub Pages URL returned HTTP 200 and loaded the game successfully.
- A live CPU duel reached a knockout, displayed the round result, and successfully started the next round. Returning to character selection also passed.
- Narrow-screen inspection revealed a foreground pillar obstructing the arena; front pillars were removed.

The gamepad check used a synthetic standard mapping, **not a physical controller**. Actual Xbox, PlayStation, Bluetooth, USB, Safari, Firefox, and mobile-device testing has not been performed. Touch is a fallback, not the primary fighting-game control scheme.

## Practical limits

This is a playable alpha. Character meshes and animations are procedural. The implementation is not an exact reconstruction of Evil Zone timing or command rules. One arena, no network multiplayer, no recorded voices, no original soundtrack. Model/animation quality and competitive balance need playtesting and an authored art pass.

The runtime is about 2 MB before transfer compression; the small local source + Git checkout was about 4.2 MB at initial publication. GitHub stores the committed source and runs deployment; gameplay runs in visitors' browsers. No large engine, dependency tree, ROM, or media library was installed.

## Directional combat update (0.2)

23 automated tests now pass. Added integration coverage for double-tap commands, side reversal, jump/air recovery, held-direction rejection, expired commands, press-time direction retention, circle-step into back capture, all four capture contexts, and symmetric simultaneous guard/capture handling. Motion samples are checked for finite output across each track.

Browser input verified away-away + attack consumes a stock and enters the burst cinematic. A ranged capture retained its far context; visual inspection confirmed the victim levitates while the attacker gestures and rings surround the target. Camera distance was increased after inspection to provide more space for the elevated target and HUD. No browser console errors or warnings were reported during these checks. Physical gamepad checks remain outstanding.

This update improves combat fidelity; it does not establish original-game frame accuracy or complete the authored animation/art milestone.
