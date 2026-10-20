# RIFT / DUEL

An original browser-based 3D arena fighter inspired by the two-button combat and cinematic energy of PS1-era Evil Zone. **Playable alpha**, with original procedural characters and assets—not an exact remake.

**Play:** https://tusingw29.github.io/rift-duel/

## Included

- Six playable fighters with different movement, reach, damage, and signature attacks.
- Arcade (six bouts), quick CPU duel, training, and same-device two-player versus.
- Melee, projectiles, sidesteps, charge stocks, timed guard/reflection, capture breaks, launch/pursuit, cinematic bursts.
- WASD keyboard controls, standard gamepads, and basic touch controls.
- First-to-two rounds, restart/rematch, arcade endings, pause-on-blur, persistent options.
- Static deployment with GitHub Actions tests before GitHub Pages publication.

## Controls

| Action | Player 1 | Standard controller |
|---|---|---|
| Move / sidestep | WASD | Left stick / D-pad |
| Attack / hold to charge | J | A / Cross |
| Guard | K | B / Circle |
| Signature / retreat special | Toward / away + tap J | Stick + attack |
| Capture | U or S + tap J | X / Square |
| Launcher | I or W + tap J | LB / L1 |
| Pursuit / dash | O | RB / R1 |
| Burst (one stock) | L | Y / Triangle |
| Pause | Escape | Start / Options |

Player 2: arrows and Numpad 1–6 (or number row 1–6) for attack, guard, capture, launch, pursuit, burst. In local versus one controller controls P2; two controllers control both players. Other modes use the first controller for P1. Press a controller button after connecting it. Menus: left/right selects a fighter, A/Cross starts; mouse/keyboard selects mode/options.

Tap means release within 0.24 seconds. Hold attack to charge. Captures defeat sustained guard, but a fresh guard breaks them. Launch at close range, then pursue immediately after recovery. Bursts can be guarded and miss at long range.

## Development without installs

Node 22+ for tests; Python 3 for local serving:

```sh
npm test
npm run dev
```

Open http://localhost:4173. No npm install, editor download, engine export, database, or game server is needed. Only `dist/` is published. Runtime fonts have system fallbacks. Three.js is vendored with its license.

## Documentation

- [Reference study and evidence limitations](docs/EVIL_ZONE_RESEARCH.md)
- [Engine decision, original roster, and production plan](docs/DESIGN.md)
- [Verification and known limitations](docs/VERIFICATION.md)

Online multiplayer, production-quality animation, full Evil Zone roster/command fidelity, and voiced story content are not included. This project is unaffiliated with Evil Zone, Yuke's, or its publishers.
