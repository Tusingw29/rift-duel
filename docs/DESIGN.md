# Rift Duel design and engine decision

## Choice: browser-native JavaScript + Three.js

The immediate priority is a public link that launches a small original fighter, with little laptop storage. Three.js supplies rendering; the combat simulation, procedural rigs, UI, sound effects, and AI are custom. This avoids writing a renderer from scratch and avoids an editor/export-template installation. The entire runtime is static and can be served by GitHub Pages. Three.js is vendored at 0.180.0 with its MIT license, so gameplay does not depend on a third-party script CDN. [Three.js documentation](https://threejs.org/docs/).

| Consideration | Godot | Current choice |
|---|---|---|
| Animation authoring | Better editor, animation tools, asset workflow | Procedural alpha; authored rigs need new tooling |
| Small link-first prototype | Engine web export and templates | Direct static files |
| Desktop expansion | Strong native export workflow | Browser first |
| Custom combat | Supported | Isolated testable JS simulation |
| Laptop footprint | Editor, templates, project assets | Approximately a few MB; no node_modules |
| Scaling production | Preferable for a larger staffed 3D project | Good for validating this web scope |

Godot does support web games. Its current documentation discusses WebAssembly/WebGL, compatibility rendering, browser networking constraints, and single-/multi-thread export tradeoffs. These are engineering considerations, not a claim that Godot cannot run in browsers. [Godot web export](https://docs.godotengine.org/en/stable/tutorials/export/exporting_for_web.html).

Recommendation: ship and evaluate this browser alpha first. Reconsider Godot when authored animation, many stages, desktop distribution, or a dedicated art pipeline becomes the main requirement. Do not build a general-purpose engine from scratch.

## Original roster

These are broad genre/archetype homages, not duplicate costumes or renamed extracted characters. Fans may recognize the combat fantasy; visual recognition has not been user-tested.

| Fighter | Familiar role | Original silhouette | Actual signature behavior |
|---|---|---|---|
| Aegis | Armored tokusatsu hero | Cyan sentinel, split visor, pale cape | Fast narrow beam; balanced melee |
| Rei | Spirit-linked swordswoman | Rose split-tail coat, pale hair, narrow blade, translucent spirit | Wide crescent shot, extended reach, fast movement |
| Tala | Martial arts rushdown | Amber wraps, headband, bare fists | Forward rush launches; fastest movement, short reach |
| Morrow | Heavy weapon hunter | Sage armor, broad shoulders, greatsword | Three-shot spread, high damage, slow movement |
| Sol | Young fire-caster role | Coral robes, crystal-tipped staff | Twin shots, fast basic projectiles, low damage |
| Vesper | Ring/space control caster | Lilac robe, floating halo | Wide slow projectile; longer stun on hit |

Every fighter also has ordinary melee/projectiles, retreat specials, front/back/middle/far captures, launch, pursuit, jumping crossover, air recovery, and a stock burst. Captures now use four original render-only motion tracks: front toss, back overhead throw, middle-distance lunge, and far levitation. Bursts have six original procedural sequences: a blade verdict, sword echoes, levitating strikes, missile salvo, descending sun orb, and teleporting ring bind. Aegis’s far capture uses the orbital emitter; Tala’s mid capture uses surrounding doubles. Each has its own camera shots and effects. All balance is new.

## Release scope

Playable: six fighters; one procedural arena; solo arcade ladder (five rivals plus a mirror finale); quick CPU duel; training with optional active CPU; same-device versus; first-to-two rounds; results, rematches and arcade endings; keyboard and standard gamepads; touch fallback; pause on blur; sound/quality/difficulty/reduced-motion options.

Gamepad buttons follow the browser standard mapping. Browser permission, controller compatibility, and connection behavior vary; press a controller button to expose it. One pad in local mode controls P2; two pads control P1/P2. Physical controller testing remains a separate hardware check. [Gamepad API](https://developer.mozilla.org/en-US/docs/Web/API/Gamepad_API/Using_the_Gamepad_API).

Not included: online multiplayer/rollback, production character art, full original-game command parity, ten-character roster, story voice acting, soundtrack, survival, remapping UI, downloadable console builds. Those are later production milestones rather than hidden features.

## Next milestones

1. Combat feedback: playtest readability, response time, recovery, guard/capture balance, camera comfort; gather controller hardware results.
2. Art: commission original rigged characters; replace procedural motions with per-character attack and capture clips.
3. Depth: expand the implemented direction-history parser and capture choreography; expanded roster and authored stages.
4. Presentation: original music, announcer, episode cards, story sequences, accessibility and input remapping.
5. Online, only after stable local combat: deterministic input snapshots, rollback/resimulation, lobby/signaling infrastructure, latency tests.

GitHub stores source, versions, CI, and publication. Development was done in a tiny local checkout; GitHub does not execute the interactive browser game on a server. Visitors run it on their own device. Future editing can use GitHub's web editor or Codespaces if available on the account. No Codespace or paid service was provisioned.

## Original character rig pass (0.3)

The six fighters now use articulated elbow/knee hierarchies, tapered torsos, facial meshes, individual hair/costume silhouettes, and hand-attached weapons. Rei has a translucent companion; Aegis has a sealed helmet and cape; Tala has hand wraps and a raised ready guard; Morrow has broad armor; Sol carries a staff; Vesper has a halo. Six separate stance/attack posing branches and shared running, guarding, charging, airborne and hurt clips replace the original uniform arm swing. Costume pieces sway independently.

These are locally generated meshes and code-authored motion curves, with no downloaded character assets. They are still stylized alpha art and do not establish fan recognition or production animation quality. The 0.3 strike curves began at contact. Version 0.4 replaces this with a shared combat/animation frame clock and real startup/contact/recovery phases.

For a six-character visual review, serve the repository root with `python3 -m http.server 4174`, then open `/tests/rig-review.html`. This development gallery is excluded from the public game artifact.

## Combat timing pass (0.4)

Every attack now has an original frame schedule at 60 Hz. Direction and basic melee/projectile choice lock when the attack starts. Damage, capture, movement strikes and shot creation occur on the contact frame. A melee target can leave reach or the forward hit cone during startup; the move then misses rather than changing into a projectile. Fighters move slowly and cannot guard during committed attacks. A new attack tapped within the final eight recovery frames can queue for the next actionable frame.

Normal hits interrupt a pending move. Bursts spend stock at startup, so an interrupted burst loses that stock. Equally timed strikes trade; equally timed capture/burst attempts clash. Guard inputs are collected before contacts; held guard stays active through block stun. Close capture breaks must now be timed near contact, not simply held from the beginning of the attack.

| Move | Startup frames | Contact frames | Recovery frames |
|---|---:|---:|---:|
| Standard strike | 8 | 1 | 17 |
| Tala strike | 5 | 1 | 14 |
| Morrow strike | 12 | 1 | 21 |
| Standard projectile | 11 | 1 | 18 |
| Sol projectile | 7 | 1 | 11 |
| Forward special | 13 (Tala 9; Morrow 18) | 1 | 22 (Morrow 28) |
| Retreat special | 12 (Morrow 16) | 1 | 26 |
| Capture | 13 | 1 | 40 |
| Launcher | 10 (Morrow 15) | 1 | 25 |
| Pursuit | 7 | 1 | 30 |
| Jumping crossover | 9 | 1 | 25 |
| Burst | 22 | 1 | 42 |

Confirmed cinematic sequences pause the attack timelines until their presentation finishes. Training reports wind-up/contact/recovery and remaining frames. The authoritative tuning lives in `dist/moves.js`. These are **not measured Evil Zone timings**; original-game timing research remains separate.


## Burst direction pass (0.5)

`cinematics.js` samples render-only poses and camera shots; `burst-effects.js` owns reusable effects and temporary translucent fighter echoes. Combat remains authoritative: damage resolves once after presentation, and a successful burst ends in grounded knockdown. Guarded targets remain standing and receive chip damage. Reduced-motion mode retains the neutral camera.

The six sequences use original 2.5–2.9 second durations and procedural motion. They draw on broad presentation ideas documented in the footage research, not copied animations or measured original timing. These are still alpha choreography, with further anticipation, impact, and recovery polish needed.


## Three-step attack chains (0.6)

Basic strikes and shots can cancel recovery into up to three steps. A strike must connect with the target or held guard; a projectile opens its chain window on release. The original tuning window runs from contact through the next ten simulation frames. Each follow-up retains its normal startup, and the third step must recover fully. A small, bounded step-in helps connected melee chains retain range without granting unlimited tracking. Whiffs, parries, and interruption prevent chaining.

After the second basic attack, a launcher, capture, directional special, pursuit, crossover, or stocked burst can replace the final step. These still obey their normal resource/range rules. Holding attack charges normally; repeated taps are required for a chain. The training readout shows the current step and CHAIN NOW prompt. Damage is 6/6/10 for strikes and 7/7/9 for shots, multiplied by fighter power. These are new balancing choices, not measured Evil Zone damage or cancel windows.


## Third signatures (0.7)

W + tap J / controller Up + attack now selects the third signature; I / LB and double-down + attack retain the launcher. `techniques.js` defines six original behaviors. Aegis and Morrow advance with committed attacks, Tala's advancing strike launches, Rei's spinning slash covers nearby angles, Sol's sphere intercepts ordinary projectiles during its active period, and Vesper emits a rolling ring. Captures bypass the sphere. Each melee technique can connect once per use; parries interrupt it. Aim locks at startup, so charging attacks can miss sidesteps. The timeline now supports multiple active frames before recovery. Techniques can replace the third chain step.

| Fighter | Startup / active / recovery frames | Base damage |
|---|---|---|
| Aegis | 12 / 18 / 22 | 12 |
| Rei | 10 / 16 / 23 | 11 |
| Tala | 8 / 15 / 24 | 10, launches |
| Morrow | 17 / 20 / 30 | 15 |
| Sol | 9 / 22 / 26 | 10 |
| Vesper | 14 / 1 / 25 | 12, projectile |

Damage is multiplied by character power. All numbers are original tuning.


## Ground recovery (0.8)

An unrecovered launch now lands in a 0.55-second knockdown; a successful burst retains its 0.7-second knockdown. Fresh W/S or controller depth input can start a roll when at most 0.55 seconds remain. A held direction cannot trigger it. Rolls travel 2.4 units over 0.3 seconds, clamp to arena bounds, prevent attacks, and grant 0.22 seconds of invulnerability. The vulnerable ending can be punished. Air recovery avoids the landing knockdown. Captures cannot acquire an invulnerable target.

The procedural roll rotates around the torso and applies render-only floor clearance for each character's body and weapon. These times and distances are original balance values. Directional ground recovery is informed by the researched guide, not measured frame parity.


## Configuration and controller menus (0.9)

Saved options now include round length (60, 90, 120 seconds), wins required (1, 2, 3), and stick dead zone (0.12, 0.22, 0.32). Defaults preserve 90-second, first-to-two matches. Training remains untimed. Match rules are snapshotted into each new round and the result flow uses the selected wins target. `options.js` validates persisted values, rejecting unsupported or malformed settings.

Controller menus use Up/Down to move focus, Left/Right to change values, A to confirm, and B to close dialogs. Fighters preview when focused; A starts with the focused fighter. Selects, sliders, and checkboxes work without a mouse. Focus has a visible outline, and native focus scrolling brings off-screen options into view. D-pad directions override analog drift. Confirmation/pause buttons must be released before gameplay input resumes, preventing an accidental attack after starting a match. Physical hardware validation remains outstanding.


## Training tools (0.10)

Practice now offers standing, held guard, and active CPU behavior. Settings are available from the training pause dialog as well as the main Options dialog. The old active-CPU preference migrates to the new behavior selector. A toggleable input history shows the last six direction/action states, including neutral release markers and durations counted in 60 Hz simulation frames. Both keyboard and gamepad use the same merged input record. History resets when a round starts and does not advance while paused.


## Capture identity pass (0.11)

Aegis's far capture now invokes an orbital device with portrait, overhead-device, and beam-impact shots. Tala's mid capture invokes surrounding doubles followed by a rising palm. `capturePresentation` selects these profiles only for their intended fighter/range combinations. Both sequences use the existing render-only staged-pose/effect system, while capture damage still resolves once in combat. Held guard cannot suppress capture posing or damage; captures consume no stock. Their durations are original 2.8/2.6-second choices.

The corresponding stock bursts are distinct: Aegis's renamed Sentinel Verdict approaches with a blade sweep, and Tala's burst levitates the rival with a single attacker. The other capture contexts still use the shared tracks. Training identifies cinematic kind/context and remaining time instead of displaying misleading ready/recovery text.


## Full current-roster signature captures (0.12)

`captures.js` adds four render-only tracks alongside the two existing profiles. Rei's far capture sends three winged spirit forms; Morrow's mid capture lifts the target with a weapon scoop and drops them; Sol's far capture calls an orb down directly above the target; Vesper's back capture raises both fighters before dropping the victim. Each uses two camera shots and blends positions home. Captured targets do not assume a guarding pose even when guard was held at acquisition.

| Fighter / context | Profile | Duration |
|---|---|---|
| Rei / far | spirit-flight | 2.6 s |
| Morrow / mid | iron-scoop | 2.4 s |
| Sol / far | ember-fall | 2.5 s |
| Vesper / back | astral-drop | 2.7 s |

These are original choreography and timing choices informed by the researched move descriptions. All six fighters now have one individually staged capture. The other eighteen fighter/context combinations still use shared throw tracks. Damage, guard-break timing, and stock cost have not changed.

## Alpha 0.13: first stock specials

Aegis’s held forward attack produces four aligned shots; Sol’s held back attack retreats and produces a five-shot spread. Holding longer than 0.24 seconds selects the variant, and releasing spends one stock at startup. Empty stock refuses the action. Neutral holding still replenishes stock. Commands retain their direction from attack press, and the input buffer preserves the variant. These counts, timing, damage and fan angles are original balance choices. Other fighters retain their existing hold behavior.

## Alpha 0.14: up-special variants

A second attack tap completed during an up-special’s startup selects its alternate form once. Direction may remain Up or return to neutral. Aegis/Rei reset their hit latch once halfway through a longer active interval, giving at most two contacts; a parry or interruption cancels the remainder. Tala trades her launcher for a faster flying kick, Morrow fires a stationary beam, Sol gains a larger defensive sphere, and Vesper throws three diverging rings while spinning. These variants do not cost stock. Startup and recovery commitment remain; late taps cannot retroactively transform contact. Forward/back alternate specials remain future work.

## Alpha 0.15: individual close-front captures

All six front captures now have separate profiles: vault-suplex, shoulder-turn, palm-slam, pommel-turn, pivot-toss, and blink-shove. They use 2.3-second original sequences with grip and impact camera shots. Vesper moves between discrete positions and leaves three translucent echoes. Position, height and facing blend home before the simulation resumes. Staged body bounds now keep rotated heads and shoulders above the arena floor. Render poses never alter simulation positions; capture damage still occurs once with no stock consumption. Twelve of the 24 fighter/context combinations are now individually staged.

## Alpha 0.16: complete mid-range capture identities

Four new 2.5-second profiles complete mid-range coverage. Aegis approaches and extracts a blade sideways; Rei presses a sustained thrust; Sol casts a travelling fire spear; Vesper conjures and breaks an effigy to throw the rival. Sword captures can pose the weapon arm separately from the free arm. Spear and effigy meshes are pooled and hidden between effects. Sixteen of 24 fighter/context pairs now have individual choreography. Combat damage, range classification, held-guard bypass and stock rules are unchanged.

## Alpha 0.17: complete capture coverage for the six-fighter roster

`capture-finishes.js` adds five rear throws (bridge suplex, leg reap, cradle slam, inverted driver, scissors flip) and three distant attacks (rushing barrage, travelling siege orb, surrounding astral cuts). Rear captures last 2.4 seconds and far captures 2.8 seconds, using original timing. All 24 contexts now select distinct profiles. Staged poses can control one leg separately for sweeps and flips. The shared choreography remains only as an unknown-profile fallback. This closes profile coverage, not production-quality contact animation or historical frame matching.

## Alpha 0.18: three-hit aerial pursuit

Pursuit snapshots an airborne rival within nine units at startup. The attacker glides toward the initial contact point over seven frames, then attempts hits on active offsets 0, 9 and 18. Damage is 4/4/6 times fighter power, preserving the previous 14 total. The first contacts preserve airborne height; the last ends in a grounded knockdown. Fresh air recovery, attacker interruption, loss of range or a grounded target cancels remaining contacts. Holding pursuit cannot reacquire a target. Grounded and out-of-range commands retain the single dash. Poses alternate strikes and a finishing kick; neutral framing tracks airborne height. These are original gameplay timings.
