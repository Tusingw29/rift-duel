# RIFT / DUEL

An original browser-based 3D arena fighter inspired by the two-button combat and cinematic energy of PS1-era Evil Zone. **Playable alpha**, with original procedural characters and assets—not an exact remake.

**Play:** https://tusingw29.github.io/rift-duel/

**Tala art and motion:** [Inspect the rebuilt Design 02 model and live animations](https://tusingw29.github.io/rift-duel/tala-blender.html?model=design02). Storm Circuit is now the default in the public game. Options → Tala appearance retains the earlier model; failed asset loading also falls back to it. The art remains a work in progress.

## Alpha 0.56: Tala character pass

[Play the rebuilt Tala preview](https://tusingw29.github.io/rift-duel/?tala=design02) · [Inspect the model](https://tusingw29.github.io/rift-duel/tala-blender.html?model=design02) · [Watch its motion](https://tusingw29.github.io/rift-duel/tala-motion.html).

Layered auburn strand hair, curved ears, facial-plane detail, connected sloping shoulders, folded collar panels and a fitted vest form one combined asset revision. High-quality texture filtering and supported multisample cutout edges keep the image clear. The 4.3 MB asset preserves the 17-bone combat contract; it is still an art study, with face likeness, garment fit and lower-body detail unfinished. The default Storm Circuit model remains available separately.

## Alpha 0.46

Sol and Vesper now use weighted character surfaces, painted faces and costume panels, independent hanging cloth, and distinct staff/ring silhouettes. All six fighters have dedicated model builds. Rei, Sol and Vesper still use shared choreography; visual fidelity remains unfinished.

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

- [Shared Evil Zone feel task checklist — ownership, priorities, and acceptance checks](docs/EVIL_ZONE_TASKS.md)
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


### Alpha 0.42 — Rei model rebuild
Rei has a fitted split-tail coat, continuous weighted limbs, swept ivory hair, painted facial features and shaped boots. Her sword, spirit companion and burst copies use the new rig. This also updates the default training opponent. Movement choreography is unchanged.


### Alpha 0.43 — Moonlit Shrine courtyard
Select Rei to see the rebuilt stage: textured paving, three halls with curved roofs, lanterns, trees, stone railings and surrounding grounds. The grid is removed and lighting is cooler. Static architecture is batched to keep the added scene detail economical.


### Alpha 0.44 — Morrow model rebuild
Morrow has fitted heavy armor, launcher ports, an optical patch, shaped beard, short mantle and beveled greatsword. Weighted limbs preserve elbow and knee continuity. His existing moves, damage and animation timing are unchanged.


### Alpha 0.45 — Morrow heavy motion
Morrow's three-hit chain is now a cross-body cut, return cut and overhead finisher. Grounded motion uses planted feet, level boot soles and blended reactions. Existing damage and combat timing are unchanged.

## Alpha 0.47: Evil Zone-style life bars and power gauge

The HUD now reads like the original: each life bar keeps a red damage trail that holds for a moment after a hit and then drains to the live value, turns amber below 30 health and flashes red below 12, and chip damage from guarding shows against the trail. Under each bar sits a segmented power gauge. Holding attack fills the next segment in real time (faster at low health, as before), a filled segment is one stock, gaining a stock flashes the gauge and spending one blinks it dark, and three stocks pulse as MAX POWER. The label states the stock count or the current charge multiplier while charging. Charging stops at three stocks instead of silently discarding progress.

## Alpha 0.48: side-mounted life gauges

Life gauges now stand vertically along the left and right edges of the screen, as in Evil Zone, draining from the top with the damage trail, quarter marks and the low/critical colours carried over. Fighter names and round pips sit above each gauge, the round clock stays top centre, and the power gauge moves to the bottom corner beneath its gauge. Training readouts shift inward so they never cover the player-one gauge.

## Alpha 0.49: power gems and shatter effects

Stocks are now gems instead of bars. Holding attack pours charge into the next gem, which lights when full with a flash; three lit gems pulse at max. Spending a stock on a burst or stock special shatters that gem into flying glass shards, and a knockout shatters the loser's life gauge the same way. Reduce motion disables the shards.

## Alpha 0.50: the life gauge shatters on every hit

Following the original, where a hit breaks part of the gauge "like glass", every landed attack now snaps the lost chunk of the vertical life gauge into glass shards that fly inward from the screen edge, with a white flash over the broken segment. The number of shards scales with the damage. The old red drain trail is gone; a pale glass remnant lingers for a fraction of a second where the chunk was. Knockouts still shatter the whole gauge.

## Alpha 0.51: Tala proportion standard

Tala is rebuilt to an early-2000s 3D fighter standard (the Dead or Alive 3, Tekken 4, Soul Calibur 3 look): about 7.5 heads tall, legs half her height, a smaller head, narrow waist and hips, broader shoulders and longer arms. The standard is a single remap applied to both the JavaScript skeleton and the Blender-built surfaces, so the costume, painted face and hands carry over unchanged. Leg lengths are now read from the rig by the foot-planting and study-motion code instead of being hard-coded. The GLB was rebuilt with Blender 3.6.22, which runs on this Mac where 4.5 does not.

## Tala Design 02 review model

The [separate Design 02 preview](https://tusingw29.github.io/rift-duel/tala-blender.html?model=design02) carries the newer face atlas, shorter visible neck, swept hair, connected shoulders, tailored vest/shorts and continuous wrapped fists. It uses the actual live review animator. The default fight still uses the earlier model. The optional [Design 02 fight preview](https://tusingw29.github.io/rift-duel/?tala=design02) lets you test the new study with the real controls and camera while it is refined.

The [concept and animation package](art/tala-design-02/README.md) defines the visual target. [Blender sources and actual pose renders](art/blender/tala-design02/README.md) document what is implemented and what remains. This is a partial art study, not a claim that the concept or reference-game quality has been reached. The exported model runs in the browser; Blender is only needed to rebuild the source asset.

A [normal-speed Tala motion video](https://tusingw29.github.io/rift-duel/tala-motion.html) shows the current Design 02 guard and combo without loading the interactive 3D preview. This is an offline render of runtime poses, not a browser performance recording.

Tala can now be rebuilt and rendered on GitHub through [Build Tala art in the cloud](https://github.com/Tusingw29/rift-duel/actions/workflows/tala-art.yml). See the [cloud-build guide](art/blender/tala-design02/CLOUD-BUILD.md) for options and artifact retrieval. This avoids running Blender on the laptop; outputs are reviewed before publication.

## Browser smoke test on GitHub

`scripts/browser-smoke.mjs` loads the game in headless Chromium, confirms Tala's Design 02 preview attaches in a training fight, checks W closes and D circles, lands a punch and verifies the life gauge shatters, reads the HUD, and fails on any console error. The **Browser smoke test** workflow runs it against the public page after every successful deployment and on demand (Actions → Browser smoke test → Run workflow, optionally with another URL or model). Screenshots, the console log and `report.json` are uploaded as the `browser-smoke` artifact. Locally: `node scripts/browser-smoke.mjs --url http://localhost:4173/dist/` with Playwright installed.

## Alpha 0.53: rendering quality pass

A step toward the early-2000s 3D fighter look at the engine level, so every fighter and arena benefits. The scene now has image-based lighting from a prefiltered studio environment tinted to each arena's sky and ground, a key/fill/rim light rig with a 2048 shadow map and normal bias for crisp soft shadows, and physically based materials everywhere: Lambert surfaces on the older fighters are converted automatically, and surfaces are classified by name into glossy clearcoated skin, shiny hair, rough cloth and wraps, leather shoes, metal and stone profiles. High quality renders at up to 2× pixel ratio, exposure is rebalanced, and the CRT scanline overlay is reduced to a trace. Textures, hair strands and the remaining roster models are still the visible gap to that target.

## Alpha 0.54: baked surface textures for Tala

Tala's Design 02 surfaces are no longer flat colours. The Blender build now unwraps every object of each material into one atlas and bakes a procedural, object-space pattern into it with Cycles: a crossed twill weave with fold shading for the vest and shorts, wound linen with overlap bands and dust for the wraps and fists, two-scale tone mottling and a faint warm blush for skin, strand and clump streaks for hair, and grain with scuffs for the shoes. The atlases are packed into the GLB as JPEG so the download stays small. No photographs or outside assets are used; everything is generated from the authored colours.

## Project skills

- `skills/ps1-anime-fighter-art`: concept art and pose-sheet generation for the roster.
- `skills/blender-animation-threejs`: Blender scripting, rigging, glTF export, Three.js and game-architecture reference with Rift Duel-specific notes (Blender 3.6.22 pinned for this Mac, no Draco/Meshopt decoders vendored, bone-name contract for the game skeleton). Includes a character-art module (alpha-card hair, tangent normal maps, joint weighting, combat body mechanics) and a headless `blender_gltf_export_validator.py` pre-flight with UV-seam-welded connectivity and a required-bone check; run on October 21, 2026 against `art/blender/tala-design02/tala-study.blend` it reported all 17 game bones present and zero issues. Audit against it on October 21, 2026: the export already uses Y-up, NLA tracks, forced sampling and packed textures; skinned meshes disable frustum culling; clones go through the project's skeleton-aware cloner; shadow bias and normal bias are set. Not adopted: Draco/KTX2 compression (no decoders in the vendored runtime) and tangent export (no normal maps yet).

## Alpha 0.57: Tala Design 03, an anatomical body

Tala's default appearance is now a real anatomical character instead of scripted ring geometry: a MakeHuman (CC0) base shaped to the 7.5-head standard, with a modelled face, eyes, brows and lashes, a tinted ponytail, a cropped top, shorts cut from leggings, and shoes, straightened into the game's rest pose and skinned to the game's 17-bone skeleton so every existing animation, foot plant and combat pose drives it unchanged. The previous models remain selectable under Options → Tala appearance. The build is reproducible from `art/blender/tala-v3/README.md`. Wraps, costume tailoring, face likeness and a weight pass are the next steps.

## Alpha 0.58: Tala costume and hair geometry

The anatomical Tala now wears a separate open ochre vest and collar over a charcoal top, shortened rust shorts, fitted forearm and shin wraps, dark footwear and a first swept fringe. The original skeleton and live moves are retained, including the unequal-leg foot-planting fix. This is actual model work toward the concept, not completed likeness or production-quality art. Face, combat hand poses, garment fit and finer hair remain unfinished. Source, neutral renders and reproducible cloud build: `art/blender/tala-v3-refined/`.

## Alpha 0.61: the whole roster on the Design 03 pipeline

`npm run build:tala -- --fighter <id>` now builds any fighter: Aegis, Rei, Morrow, Sol and Vesper each get an anatomical CC0 MakeHuman body shaped by their own sliders and detail targets in `scripts/fighter-specs.mjs`, dressed from the CC0 wardrobe and recoloured to their palette, and written to `dist/assets/models/<id>-v3.glb` with the joint positions and leg metrics embedded in the scene extras. In the game the Design 03 appearance option now applies to everyone: each fighter's combat bones are moved onto the model's joints when it loads, weapons tagged in the classic models stay in the hands, and the classic model remains the fallback if the download fails. The wardrobe is modern casual wear, so the costumes read as placeholders until each fighter gets a tailoring pass like Tala's.

## Alpha 0.60: Tala costume tailoring

Design 03's costume is tailored in the Node builder: the shorts get a straight hem and a dark waistband, the vest is sleeveless with an open front and a straight hem above the midriff, the body hidden under the suit is removed so skin no longer pokes through tight cloth, and the fringe and new temple locks are textured strand cards from the hair atlas instead of flat colour. Rebuild with `npm run build:tala`; the review page shows the result at `tala-blender.html?model=v3`.

## Alpha 0.59: Tala built with Three.js, no Blender

The character pipeline is now a single Node script using the vendored Three.js (`npm run build:tala`). It reads the CC0 MakeHuman data directly, shapes the athletic body, poses it into the game's rest pose with closed fists, fits the eyes, brows, lashes, auburn ponytail, shoes and a sportswear base, generates the tailoring (forearm and shin wraps, open ochre vest and collar over a charcoal top, rust shorts, swept fringe), folds the weights into the game's 17 bones and writes the GLB itself in about six seconds. Blender is no longer required anywhere; a Node-only cloud workflow builds and tests the model on GitHub. Details and limits in `art/blender/tala-v3/README.md`.

## Alpha 0.63: concept costumes for Aegis, Rei, Sol and Vesper

The roster now follows direction A of the concept boards in `art/roster-2026-10-21` instead of recoloured stock clothing. `dist/roster-costumes.js` dresses each Design 03 body at load time with pieces parented to the combat bones, the same approach as Morrow's Gravebound pass: Aegis gets ivory segmented armour over a navy undersuit, a full helmet with a cyan visor and crest fins, a short blue cape and an energy blade; Rei gets dark hair, an ivory blouse with a high collar, a plum hip sash with trailing ties, wine split panels on her coat-tail joints, dark trousers and boots; Sol gets swept red locks, a long split rust coat with an ivory collar and gold cuffs and hems, an atlas satchel and boots; Vesper gets lavender hair, a floor-length split violet gown with gold hems, an ivory shoulder drape, wrist rings and a broken halo. The builder can split a stock outfit at the waist for two-tone under-layers and now folds printed logos and piping into the fabric. `fighter-review.html?fighter=<id>` shows any fighter's actual model, costume and animation.

Whole-body animation for the rest of the roster (EZ-02 first pass): Rei, Sol and Vesper now run on the same grounded animation system as Tala, Aegis and Morrow, with an authored ready stance, a crossed-forearm guard with chin tuck, keyed hit reaction and charge poses, footwork that advances with travelled distance on planted feet, and three weapon-specific strike tracks whose contact lands exactly on the combat frame. Review any of them on `fighter-review.html`.

Charge rework after 0.63: holding attack now sweeps a bright charge up the side life bar from the bottom toward the current life line, and a power gem crystallises the moment the sweep reaches it. Because the sweep only has to cover the life that is left, a full-life fighter needs the full 1.8 seconds while a fighter at half life needs half of that, floored at a quarter so near-dead fighters cannot mint gems instantly. This replaces the old separate multiplier and matches the Evil Zone description of crystals appearing beside the gauge faster at low life.

Fix after 0.63: the side life bar shattered at zero health and never reformed, so it was missing for the rest of a best-of match or arcade bout after the first knockout. It now reforms when the next round refills health.

## Alpha 0.62: Morrow / Gravebound

Morrow's Design 03 model now wears olive armor, a wrapped ivory mantle and torn tail, an eyepatch, fitted gray beard, swept silver hair and a four-port shoulder launcher. His old sword is replaced by the original oversized **Gravebound** slab blade with a long wrapped grip, worn cutting edge and three diagonal forge grooves. These costume pieces follow the existing combat rig; damage timings and gameplay reach are unchanged.

[Inspect Morrow in motion](https://tusingw29.github.io/rift-duel/morrow-review.html) or select Morrow in the game. The review loads the same runtime model and offers idle, guard, movement, recoil and the three cuts. See [the design specification and concept](art/morrow-gravebound/README.md).

This pass translates the concept's silhouette and costume into the current anatomical model. Facial likeness, detailed fabric/armor painting and dedicated two-hand sword choreography remain unfinished. The existing charcoal clothing supplies the deforming underlayer. The downloadable base GLB alone does not contain the runtime costume; its source is `dist/morrow-gravebound.js`.

Combat travel: grounded pursuit now advances during its wind-up, close crossover follows an airborne arc, and W + guard circles along a path instead of instantly changing sides. Crossover reaches contact after 18 simulation frames; circle-step takes 24 frames and leaves a brief back-capture window. These are Rift Duel tuning values. See the [shared task checklist](docs/EVIL_ZONE_TASKS.md) for implementation and pending visual review.
