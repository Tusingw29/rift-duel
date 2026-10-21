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
- Attack feel: weapon swing trails, dash and jump afterimages, a guard shield that flashes on blocks and deflects, launch tumbles, and swing, effort and dash sounds.
- Round ceremony: versus card, round and fight calls with a camera sweep, hitstop and camera shake on contact, a held K.O. freeze with a push-in on the fallen fighter and a winner pose, and round-win pips.
- Six home arenas (orbital relay, moonlit shrine, storm summit, iron wastes, ember archive, silent orbit), chosen by the opponent's home.
- Procedural soundtrack per arena and menu, synthesized impact/KO/announcement effects, and an optional announcer voice; no audio files.
- Static deployment with GitHub Actions tests before GitHub Pages publication.

## Controls

| Action | Player 1 | Standard controller |
|---|---|---|
| Close in / retreat | W / S | Stick or D-pad up / down |
| Circle left / right | A / D | Stick or D-pad left / right |
| Attack / hold to charge | J | A / Cross |
| Guard | K | B / Circle |
| Signature / retreat special | W / S + tap J | Up / down + attack |
| Capture | U or D + tap J | X / Square or right + attack |
| Third signature | A + tap J | Left + A / Cross |
| Launcher | I or double-tap D + J | LB / L1 |
| Pursuit / dash | O | RB / R1 |
| Burst (one stock) | L | Y / Triangle |
| Pause | Escape | Start / Options |

Player 2: arrows and Numpad 1–6 (or number row 1–6) for attack, guard, capture, launch, pursuit, burst. In local versus one controller controls P2; two controllers control both players. Other modes use the first controller for P1. Press a controller button after connecting it. Menus: Up/Down moves focus, Left/Right changes a fighter or value, A/Cross confirms, B/Circle closes dialogs. Mode, opponent, options, pause, and result controls support the controller.

The camera locks on behind your fighter, Evil Zone style, so directions never flip when fighters swap sides: W always closes in, S retreats, A and D circle the rival. Options can switch to the older side camera. Directional commands work with keyboard or gamepad: tap a direction twice within 0.30 seconds, then attack. Close (W) = pursuit, retreat (S) = burst, D = launcher, A = jumping crossover. Double-tap A + guard jumps. Press guard freshly in the air to recover. W + guard circles behind a nearby rival; capture before they turn for a back throw. Capture context (front/back/middle/far) changes damage, motion and camera framing.

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

Every fighter now has a signature capture context: Aegis/far orbital beam, Rei/far spirit flight, Tala/mid doubles, Morrow/mid weapon lift, Sol/far firefall, and Vesper/back aerial drop. Each fighter also has an individual close-front capture: Aegis suplex, Rei shoulder throw, Tala palm slam, Morrow pommel strike, Sol pivot toss, and Vesper teleporting shove. All mid-range captures are also distinct: Aegis blade extraction, Rei thrust, Tala doubles, Morrow weapon lift, Sol fire spear, and Vesper effigy. All 24 fighter/context combinations now have individual choreography, including five additional rear throws and Tala’s rushing barrage, Morrow’s thrown orb, and Vesper’s surrounding cuts at long range. Animation remains procedural alpha art.

Special follow-ups: W + tap J, then quickly tap J again before contact (Up + attack, attack on controller). You may keep Up held. Aegis and Rei gain two strikes; Tala changes to a flying kick; Morrow fires a direct beam; Sol expands her barrier; Vesper throws three spreading rings. These alternate techniques cost no stock. Training displays FOLLOW-UP NOW during the input window.

Aerial pursuit: launch a nearby rival with I, then press O after your recovery finishes. Within range, pursuit glides into three strikes and knocks the target down. Fresh guard in the air can escape between contacts; holding O does not restart the sequence. The neutral camera follows aerial height to keep fighters below the HUD.

Forward/back follow-ups: toward or away + tap attack, then quickly tap attack again before contact. Keep the direction held or return to neutral. Each fighter has two free alternate forms; How to Play lists the selected fighter’s patterns and tradeoffs. Up-special follow-ups use the same timing. Stock specials cannot be converted into free alternates after paying their cost.

Held stock specials (hold longer than 0.24 seconds, then release attack; one stock each):

| Fighter | Toward + hold | Away + hold | Up + hold |
|---|---|---|---|
| Aegis | Four-shot volley | Large stunning sphere | — |
| Rei | Five spirit waves | — | — |
| Tala | Large energy shot | Giant discus | — |
| Morrow | Three advancing eruptions | — | — |
| Sol | — | Five-shot fire fan | — |
| Vesper | — | — | Four-ring stream |

Neutral hold still builds stock. Empty stock refuses these specials, and interrupted startup does not refund their cost. The in-game guide shows the selected fighter’s options.

Fast keyboard and touch taps are preserved between rendered frames. Each player has an independent input queue, and pausing clears pending actions.

Tala’s base directional specials now fire an energy shot toward the rival and a stunning discus while retreating. Her up-special remains her rushing attack; tap follow-ups and held-stock forms keep their existing commands.

Morrow’s base toward special sends a stunning ground wave. His retreating special fires eight missiles in four pairs; interruption cancels later pairs. The second-tap forms remain a defensive eruption and two split ground missiles.

Aegis’s retreat special is a stunning lightning bolt. Rei sends a winged spirit forward or throws a spectral sword while retreating. Vesper fires a stunning flame forward and a trapping ring backward. Their selected-fighter manuals explain these base moves separately from the second-tap alternates.

Keyboard remapping: **Options → Keyboard controls**. Choose any player/action, then press a letter, number, arrow, Space or numeric keypad key. Escape cancels. Conflicts are rejected across both players; changing a control replaces its old aliases. Layouts save in this browser, with a Restore default keys button. Fight prompts show your current Player 1 bindings. Controller and touch actions remain unchanged.

Sol’s base toward special now sends one stunning fire shot; his retreat special sends one flame that knocks down on a clean hit. A second tap still selects the slower knockdown shot or split flames, and a retreating hold still spends one stock on five flames.

## Alpha 0.27: lock-on camera, hit feel, arenas and audio

Movement is now relative to the rival rather than world axes: the simulation resolves W/S along the line to the opponent and A/D as circling. The default camera sits behind your fighter looking across at the rival; Options → Camera restores the side overview. Player two in local versus uses the same relative scheme from their own point of view.

Rounds open with a versus card, "ROUND N" and "FIGHT" over an orbiting camera sweep. Hits freeze both fighters briefly (longer for heavy hits), shake the camera and flash the victim. A knockout holds a slow K.O. moment with the camera cutting beside the fallen fighter while the winner poses; time-outs and draws use the same hold. Training skips the ceremony, and Reduce motion shortens it and disables the sweep and shake.

Every fighter has a home arena with its own palette, lighting, fog, decoration and ambient animation. Arcade, duel and local fights use the opponent's home; training and the menu use yours. Music is a synthesized sixteen-step sequencer per arena with a four-bar bass movement, plus a menu theme. Effects for hits, blocks, deflects, shots, stocks, captures, bursts, KO and round calls are synthesized at runtime. Options include Music, Announcer voice (browser speech synthesis, where available) and Camera.

Story-mode episode data (`story.js`) is authored and tested but not yet wired into the menu; arcade remains a six-bout journey for now.

Alpha 0.28 adds authored melee pose tracks with wind-up, contact, follow-through and return to each fighter’s stance. Second strikes reverse weapon cuts or switch Tala’s punching arm. Advancing, retreating and circling now use different steps; grounded pursuit leans into the dash and blocked hits recoil against the guard. Combat timings and damage are unchanged. The key editor now labels Circle left/right and Close in/Retreat correctly, and the manual identifies A/D as recovery-roll directions.

## Alpha 0.29: swing trails, afterimages and guard flashes

Melee swings now draw an additive ribbon from the striking hand along the weapon (blade, katana, greatsword, staff, halo crescents, or a short fist arc) from late wind-up through the first part of the follow-through. Pursuit glides, techniques that travel, jumps, air recoveries and recovery rolls leave fading afterimages, and a circle step leaves one at the new position. Guarding shows a faint hexagonal shield in front of the fighter; blocks flash it in the fighter's color and perfect deflects flash it white. Launched fighters tumble backward through the air before the knockdown. Contact frames of strikes, launchers, techniques and directional specials play a swing and a short character-pitched effort sound; dashes, jumps, rolls and air recoveries play a dash sound. At close range the lock-on camera slides further to the side and up so the rival stays visible past your fighter's back. Reduce motion disables trails, afterimages and the shield flash.

## Alpha 0.30: Tala animation sample

Tala is the first fighter on a new full-body animation system, kept to one character so the approach can be judged from the fight camera before it spreads to the roster. Poses are flat joint-channel sets blended toward a target every frame, so idle, footwork, strikes, guard and hit reactions flow from the current pose instead of resetting to neutral; the head and ponytail trail the chest turn. Footwork advances with distance travelled rather than time, so her feet plant and push instead of sliding. The three-hit combo is authored through the whole body: hips and chest wind against the punch, the rear foot drives, the fist snaps to extension on the contact frame with a fast ease-out, the follow-through over-rotates, and the recovery returns to her boxer's stance under control. The straight, cross and stepping hook are distinct, and her idle bounces on her toes. Guard crouches with forearms up, blocks recoil, and a hit whips the head back and catches the weight on the rear foot before settling. Launches, knockdowns, techniques, captures and bursts still use the shared animator. Open `tests/tala-review.html` (add `?view=back` for the player's camera angle) for a pose sheet of every sample state.

## Alpha 0.31: Tala live-motion corrections

Tala's distance-driven stride now feeds the actual live pose (0.30 computed it on the rig but read it from the player). Retreat reverses the steps, and stopping preserves the gait phase. Strike entry blends out by contact so the fist reaches its authored pose on the damage frame, instead of lagging behind combat timing. Grounded idle, guard, charge and strike poses use a two-bone supporting-ankle adjustment while the torso shifts; unreachable anchors release. Walking still uses procedural steps, not full terrain-aware foot locking. Ponytail lag now uses elapsed time. Other fighters and combat balance are unchanged.

## Alpha 0.32: Tala motion and weight

Tala now blends action transitions without damping every frame of her movement cycle. Longer steps, a lower/wider stance, stronger opposing shoulder/hip motion and deeper punch preparation replace the upright shuffle. Moving feet use alternating planted support and lifted return paths, with lateral bounds to avoid crossing through the other leg. Contact timing and combat balance are unchanged. This remains an original animation study; it does not establish parity with Evil Zone.

## Alpha 0.33: Tala authored body motion

Tala's sinusoidal run poses are replaced by an eight-key looping clip: contact, compression, passing and push-off on each side. Continuous-velocity interpolation carries the body through the keys without stopping at every pose. Advance, retreat and circle variants keep the existing distance-driven foot support. Lateral pelvis travel adds actual weight transfer; punch preparation now includes hip-led drive and an elbow-led return. Inputs, simulation movement, hit frames and damage remain unchanged.

## Alpha 0.34: Tala model rebuild

Tala now uses original smooth-shaded, bone-weighted surfaces with sculpted torso, connected elbow/knee bends, shaped hands and shoes, layered hair, fitted navy-and-gold clothing, wraps and a small painted face texture. Her animation attachment points, movement and combat are unchanged. Afterimages and burst echoes clone their own skeletons so they do not borrow the live fighter's pose. The model is generated locally without external assets or downloads. The remaining roster retains its earlier models.

## Alpha 0.35: reference-led visual direction

Tala's clothing, hair and wraps now use small original paint maps, with diffuse shading, a clearer fringe and adjusted head scale. Storm Summit is a brighter stone courtyard with layered mountain scenery. Options → Camera → Side provides a low, opponent-relative duel view. Existing camera preferences and combat timing are unchanged. The reference observations and remaining gaps are in [the art-direction study](docs/EVIL_ZONE_ART_DIRECTION.md).

## Alpha 0.36: visible character and arena art replacement

The game now opens on Tala so the art upgrade is visible immediately. Her costume and silhouette have been rebuilt around a cropped vest, fitted shorts, tall wraps, slimmer arms and swept auburn hair. A generated painted face replaces the tiny procedural facial marks. Storm Summit uses a painted shrine/mountain panorama and weathered stone ground rather than flat ridge polygons and a regular tile grid. Assets are served by GitHub Pages with the game; no runtime generation service is required. Character surfaces are batched by material to retain the animation rig with fewer draw calls. The other fighters still use their earlier models. [Asset provenance and prompts](docs/ART_ASSETS_036.md).


### Alpha 0.37 — Tala model corrections
Longer legs and a compact torso, improved shoulder joins, broader hair locks, fitted facial geometry and calmer costume panels replace several toy-like features. Foot planting follows the revised leg length. This remains an art study; the roster does not yet meet the Evil Zone visual target.


### Alpha 0.39 — Aegis armor rebuild
Aegis now has a separate model with beveled chest plates, an inset visor, shaped gauntlets and greaves, articulated shoulder armor, longer leg proportions and a folded split cape. Select Aegis to see it. Shared combat animation remains in place; four fighters still use the older model builder.


### Alpha 0.40 — Aegis grounded motion
Aegis has a slash, return cut and overhead finisher, blended grounded poses, distance-driven footwork, and articulated ankles that keep boot soles level. Combat timing and controls are unchanged. Shared aerial/capture/burst animation remains a later refinement.


### Alpha 0.41 — Animation handoffs
Tala and Aegis blend between their grounded animation and shared action poses. Landing preserves the outgoing arm pose briefly, foot anchors remain fixed, and attacks still reach the exact contact frame. Also fixes inherited ankle angles and cloth drift during paused transitions.
