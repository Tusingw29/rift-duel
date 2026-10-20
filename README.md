# RIFT / DUEL

An original browser-based 3D arena fighter inspired by the two-button combat and cinematic energy of PS1-era Evil Zone. **Playable alpha**, with original procedural characters and assets—not an exact remake.

**Play:** https://tusingw29.github.io/rift-duel/

## Included

- Six original articulated fighters with distinct silhouettes, ready stances, movement, reach, damage, and signature attacks.
- Arcade (six bouts), quick CPU duel, training, and same-device two-player versus.
- Three-step melee and projectile chains with optional special finishes; sidesteps, charge stocks, timed guard/reflection, capture breaks, launch/pursuit, six character-specific cinematic bursts (blade verdict, sword echoes, levitating strikes, salvo, sun orb, and ring bind).
- Frame-timed wind-up/contact/recovery, attack interruption, simultaneous hit trades, recovery buffering, and training phase feedback.
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
| Third signature | W + tap J | Up + A / Cross |
| Launcher | I or double-tap S + J | LB / L1 |
| Pursuit / dash | O | RB / R1 |
| Burst (one stock) | L | Y / Triangle |
| Pause | Escape | Start / Options |

Player 2: arrows and Numpad 1–6 (or number row 1–6) for attack, guard, capture, launch, pursuit, burst. In local versus one controller controls P2; two controllers control both players. Other modes use the first controller for P1. Press a controller button after connecting it. Menus: Up/Down moves focus, Left/Right changes a fighter or value, A/Cross confirms, B/Circle closes dialogs. Mode, opponent, options, pause, and result controls support the controller.

Directional commands work with keyboard or gamepad: tap a direction twice within 0.30 seconds, then attack. Toward = pursuit, away = burst, down = launcher, up = jumping crossover. Double-tap up + guard jumps. Press guard freshly in the air to recover. Toward + guard circles behind a nearby rival; capture before they turn for a back throw. Capture context (front/back/middle/far) changes damage, motion and camera framing.

Tap means release within 0.24 seconds. Hold attack without a direction to charge. Aegis: toward + hold attack, then release for a four-shot volley. Sol: away + hold attack, then release for a retreating five-shot fire fan. Both held specials cost one stock; their direction is selected when attack is pressed. Captures defeat sustained guard, but a fresh guard breaks them. Launch at close range, then pursue immediately after recovery. Bursts can be guarded and miss at long range.

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

Third signatures: Aegis rushes with a blade; Rei performs a radial spinning slash; Tala rushes into a rising strike; Morrow commits to a heavy charge; Sol creates a close-range sphere that intercepts ordinary projectiles; Vesper sends a rolling ring. Use W + tap J (Up + attack on controller). Startup can be interrupted, attacks can be guarded, and recovery leaves you open.

Before publishing, run `npm run prepare:release` to stamp content-based URLs for app modules and CSS. GitHub Actions runs this automatically. This prevents returning browsers from mixing old controls with a new release.

Ground recovery: after an unrecovered launch or burst knockdown, tap W/S (controller Up/Down) to roll. A held direction does not trigger it. The roll briefly avoids hits, but you cannot attack until it finishes.

Options include 60/90/120-second rounds, first to 1/2/3 wins, and three stick dead zones. Defaults remain 90 seconds and first to 2. Training stays untimed. Settings persist in your browser; controller menu confirmations must be released before gameplay inputs resume.

Training: Pause → Practice Controls selects Stand still, Hold guard, or Fight back. Recent-input history shows the last six direction/action changes, newest first, with held simulation-frame counts. A dot marks neutral/release. The display can be hidden. See [fidelity audit](docs/FIDELITY_AUDIT.md) for verified scope and remaining research gaps.

Aegis’s far capture calls an orbital emitter; Tala’s mid-range capture surrounds the rival with doubles. These captures are separate from their stock bursts and retain normal capture damage and stock rules.

Every fighter now has a signature capture context: Aegis/far orbital beam, Rei/far spirit flight, Tala/mid doubles, Morrow/mid weapon lift, Sol/far firefall, and Vesper/back aerial drop. Other contexts retain the shared throws.

Special follow-ups: W + tap J, then quickly tap J again before contact (Up + attack, attack on controller). You may keep Up held. Aegis and Rei gain two strikes; Tala changes to a flying kick; Morrow fires a direct beam; Sol expands her barrier; Vesper throws three spreading rings. These alternate techniques cost no stock. Training displays FOLLOW-UP NOW during the input window.
