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

## Character rig update (0.3)

25 automated tests pass, including all previous combat checks and new checks across every fighter and pose for finite transforms and camera-scale bounds. Elbow/knee parent relationships and hand-mounted weapon attachments are verified.

Browser review inspected all six original rigs together and separately inspected Aegis and Rei in the game menu. Adjustments from review: cover Aegis's exposed lower face with helmet armor; move Tala's costume panel outward so it is not buried in the torso; correct Morrow's hair palette. The roster review includes a visible translucent companion behind Rei. The game menu reported no console warnings or errors during this inspection. A temporary gallery favicon error was corrected; the retained gallery lives under `tests/` and is not published.

A browser screenshot was inspected in the tool output. Saving the screenshot into the repository was denied by the browser tool's path access checks, so no screenshot file is claimed as a saved artifact. The reproducible gallery source is retained instead.

A Tala/Morrow training scene was inspected with movement and held guard; no console warnings or errors were reported. Static mesh batching reduced each character from 50–59 meshes to 33–36. Short 45-frame browser samples averaged approximately 36 ms before and 37.5 ms after, so **no frame-rate improvement is claimed** from batching. Low quality now also disables dynamic shadows. Simulation catch-up permits up to 100 ms per frame to reduce slow motion on moderately slow devices; hidden-tab pause remains in place. A broad hardware performance pass is still needed.

## Combat timing update (0.4)

34 tests pass. Previous instant-action assertions now wait for contact. New tests check the complete sequence: no early damage; a hit on the designated frame; recovery lockout; stepping out of reach causes a melee miss without a projectile; fast strikes interrupt slow ones; equal startup strikes trade; a recovery-buffered attack starts on the next available frame; guard cannot cancel attack commitment; interrupted bursts spend stock but do not start cinematics; equal bursts clash; repeated impacts remain blocked during block stun.

The rig tests now exercise startup and recovery poses against the move clock. Browser keyboard checks observed startup → contact → recovery → ready for a shot. During startup the target retained 100 HP; after the projectile arrived it had 93 HP. The training readout matched the observed phases. Visual inspection of Morrow's close strike at startup frame 4 showed the raised weapon, undamaged target, and “WIND-UP · STRIKE · 8f” display. No console errors or warnings were reported in this check.

These checks verify Rift Duel's implemented timing model. They do not establish original-game frame accuracy, competitive balance, or physical controller compatibility.


## Character-specific bursts (0.5)

41 automated tests pass. Added checks cover all six pose tracks, reversed/zero separation, return to simulation positions, distinct effects and shot names, echo cleanup without source geometry disposal, character-specific duration, damage resolving once, guarded poses/chip, and grounded knockdown endings.

Desktop Chrome visual checks sampled all six bursts: Aegis's orbital emitter, Rei's three sword echoes, Tala's surrounding doubles, Morrow's six missiles, Sol's descending orb, and Vesper's airborne ring bind. Vesper's camera was then widened/raised to improve HUD clearance. These sampled checks are not full frame-by-frame visual validation. No browser errors or warnings were reported in the initial checks. Physical controller validation and broader device performance checks remain outstanding.


## Attack chains (0.6)

47 tests pass. Six new tests cover three-step limits, required recovery after step three, melee whiffs, expired windows, launcher/capture finishes, ranged chains before impact, held guard and parry, and hold-to-charge behavior. The startup regression now verifies that a chained follow-up still waits its full startup before dealing damage.

Local Chrome keyboard inputs produced three distinct contact states (steps 1, 2, 3) with target health 94, 88, 78. The training readout displayed CHAIN NOW during eligibility and removed it at step three. Screenshot inspection confirmed the three-hit feedback and readable recovery prompt. No console errors or warnings appeared in the initial browser check. These checks do not establish original-game frame parity or physical controller behavior.


## Third signatures (0.7)

52 tests pass. New coverage checks every signature's damage and stock preservation, committed travel and sidestep misses, rising launch and radial coverage, sphere interception with capture/startup exceptions, and held guard/parry. Character pose validation now traverses each technique through active frames and recovery.

Local Chrome W+J input selected the new technique for Sol and Vesper. Screenshots showed the sphere and traveling ring without console errors. The corrected ring orientation was visually rechecked. Browser inputs also verified the other four techniques: Aegis, Tala, Morrow, and Rei dealt their expected damage, with Tala launching the target. Rei’s active spin was visually inspected. Training labels now distinguish extended ACTIVE periods from one-frame CONTACT. Launcher shortcuts remain covered by the existing directional-command tests. Physical-controller testing remains outstanding.

The first public 0.7 check exposed mixed cached assets: updated HTML with the previous W+attack command module. The release workflow now stamps a content hash into the entry script, stylesheet, and import-map URLs for every app module. This addresses the observed stale-controls failure.


## Ground recovery (0.8)

58 tests pass. New tests cover landing-to-standing recovery, airborne escape, both roll directions, gradual displacement, attack lockout, held-input rejection, arena bounds, brief invulnerability and its expiry, and capture-projectile avoidance. Pose tests check all six rolling bodies remain above the floor.

In local versus, Chrome keyboard inputs moved player two into range, launched player one, and used S after landing. Debug state showed knockdown → roll → idle and final Z displacement of 2.4. The first screenshot exposed foot-pivot floor clipping; the torso-pivot correction was visually rechecked before release. Browser console reported no errors or warnings. Physical controllers remain untested.


## Configuration and controller navigation (0.9)

62 automated tests pass. New tests validate malformed saved options, custom round timeout versus untimed training, stick dead zones, D-pad priority, standard action mappings, and incomplete device data.

A synthetic standard gamepad in Chrome navigated from fighter selection to mode, changed to duel, opened options, and saved 60 seconds / first to one / large dead zone. A screenshot confirmed visible focus and readable option labels. The controller started the match, paused with Start, and resumed with B. The CPU bout ended with MATCH RESULT at a 0–1 score, verifying the first-to-one result flow. Options survived reload.

The first test exposed A-button carryover into combat. After adding a release gate, starting and resuming left the fighter idle, while a subsequent fresh A press produced a projectile. No browser console errors/warnings were reported. This is synthetic API testing, not a physical controller test.


## Training tools (0.10)

65 tests pass. Added checks cover held-input duration and release markers, bounded history, diagonal/action labels, input immutability, and migration from the old training CPU setting.

Chrome training checks selected Hold guard from the pause menu. A strike reduced target health from 100 to 99.28; a subsequent capture reduced it to 84.28. Input history displayed movement, release, attack, and release states with frame counts. Desktop and narrow-viewport screenshots were inspected for readability. Disabling the display hid it immediately on resuming. No console errors/warnings were reported in the initial browser check.


## Capture identity (0.11)

68 tests pass. New tests restrict authored profiles to Aegis/far and Tala/mid, distinguish those effects from stock bursts, check finite poses and clean return positions, and verify held-guard bypass, no stock cost, and exactly one damage resolution. Existing burst effect expectations were updated to reflect the intentional redistribution.

Desktop Chrome screenshots verified the orbital beam during Aegis's far capture, the doubles during Tala's mid capture, the separate Aegis blade burst, and Tala's single-attacker levitating burst. The first capture check exposed misleading training READY text; the readout now identifies cinematic kind and remaining time. No console errors/warnings appeared during the initial browser checks. Other capture contexts remain shared alpha choreography.


## Six signature capture contexts (0.12)

70 tests pass. Capture-profile scope and damage tests now cover all six fighters, including held-guard bypass, no stock cost, and exactly one hit. New pose checks cover reversed/diagonal/zero separation, multiple camera shots, finite transforms, input immutability, and return to simulation positions. Effect checks distinguish spirit flight, weapon lift, firefall, and the two-fighter aerial drop.

Chrome screenshots verified all four new captures. Vesper's back capture was triggered with actual move → circle-step → capture keyboard inputs. Rei's spirit wings were enlarged/reoriented after initial inspection, then visually rechecked. All new profiles appeared in read-only debug state at the expected context. No console errors/warnings appeared in the final local check. These sampled checks are not full frame-by-frame animation verification.


## First held stock specials (0.13)

76 tests pass. Added checks cover stock consumption on release, distinct projectile patterns, free tap variants, neutral stock charging, empty-stock refusal, interrupted startup, player-two opponent-relative input, and preservation of the empowered variant through recovery buffering.

Local Chrome keyboard checks triggered both specials. Aegis produced four projectiles, spent one stock, and dealt 16 total damage to an idle target. Sol retreated and produced five diverging projectiles for one stock. Screenshots inspected both patterns and the STOCK training readout. No console errors or warnings appeared. Hardware controller testing remains outstanding; the specials use the existing shared input pipeline.

Public alpha 0.12 was also rechecked before this change: Rei’s far capture selected spirit-flight, finished with target health 83.125, and did not consume stock. Its deployment completed successfully.

## Up-special alternate forms (0.14)

Seven new tests cover all six alternate selections, holding or releasing Up between taps, two-hit limits, kick movement and no launch, stationary beam release, three ring directions, expanded barrier interception, late-input refusal, interruption and parry cancellation, and held-guard chip across both strikes. Chrome keyboard sequences selected all six variants with stock remaining at one. Screenshots inspected the flying kick and ring spread; no console errors/warnings appeared. Input windows are original tuning and have not been validated by external playtesters.

Final suite: 83 tests passed. A synthetic standard-gamepad input through navigator.getGamepads selected Morrow’s alternate beam while keeping Up held across both attack taps; it produced one projectile and preserved stock. This verifies the browser API path, not physical controller hardware.

## Individual close-front captures (0.15)

New tests cover six unique front profiles, exactly one damage resolution per capture, no stock consumption, distinct motion/effect identities, and body bounds above the floor at 61 samples in both facing directions for all six throws. The authored-track tests now cover all twelve profiles with reversed, diagonal and zero-separation inputs. An older guard-bypass test was updated to wait for the configured cinematic duration rather than assuming the previous short shared throw.

Chrome keyboard movement followed by capture selected all six front profiles. Screenshots inspected each at a representative grip/throw/impact point; no console errors or warnings appeared. These samples validate basic framing and pose readability, not production-quality contact animation across every frame.

Final alpha 0.15 regression suite: 86 tests passed.

## Complete mid-range coverage (0.16)

88 tests pass. Profile, damage, guard-bypass and single-resolution tests include the four added mid-range captures. Pose checks cover all sixteen authored contexts with reversed/diagonal/zero separation. New effect tests distinguish extraction, thrust, spear and effigy; check finite render matrices; and verify spear/effigy meshes hide on the next unrelated capture.

Chrome keyboard sequences selected all four new mid-range profiles. Screenshots inspected each. The first sword check exposed a too-vertical blade; separate weapon-arm posing corrected it, and Rei was visually rechecked. No console errors/warnings appeared. These are sampled alpha-animation checks, not proof of frame-perfect historical fidelity.

## Complete current-roster capture coverage (0.17)

91 tests pass. The profile test requires 24 unique authored identities. All 24 receive finite-pose, camera-shot and return-home checks with normal, diagonal/reversed and zero-separation positions. Eight new acquisition cases check rear/far selection, held-guard bypass, one damage event and no stock consumption. Rig samples verify the new throws stay above the floor; distinct-effect assertions separate barrage, travelling orb and surrounding cuts.

Chrome keyboard checks triggered all five rear captures through movement, circle-step and capture, plus the three far captures from initial spacing. Screenshots inspected all eight sequences. No console errors/warnings appeared. These samples establish working alpha choreography, not full animation quality or exact original-game fidelity.

## Three-hit aerial pursuit (0.18)

97 tests pass. New tests verify gradual approach before damage, three separated contacts for all six fighters, original total damage, final knockdown and roll recovery, fresh air-guard escape, attacker interruption, missed contact, range limits, and held-input non-reacquisition. The older launcher/pursuit test now waits for the full sequence.

Chrome keyboard checks landed a launcher and all three pursuit hits: target HP 100 → 92 → 88 → 84 → 78, ending knocked down. A local-versus test used player-two guard after the first pursuit hit and finished at 88 HP with no subsequent damage. Initial screenshots exposed HUD overlap; the neutral camera now follows aerial height, and a second screenshot verified clear framing. No console errors/warnings appeared.

## Twelve horizontal follow-ups (0.19)

103 tests pass. New checks cover all twelve selections, one-time transformation, no stock cost, projectile counts, pulse spacing and interruption, split-shot center misses versus sidestep hits, radial single-hit/block behavior, clean-hit knockdown, snare-to-blast substitution, and refusal to convert paid stock moves.

Chrome keyboard sequences selected all twelve variants while preserving stock. Screenshots inspected eruption, spread and low split shots. The first check exposed undefined effect visibility on idle fighters; explicit boolean visibility fixed it, and the final screenshot confirmed no idle spheres. The selected-fighter controls dialog showed its alternate names and descriptions. No console errors/warnings appeared in the initial browser sweep.

## Eight stock specials (0.20)

107 tests pass. Expanded tests cover all eight stock forms, cost-on-release, emission counts, zero-stock refusal, no hidden charging, interruption without refund across every fighter, paid-technique follow-up refusal, advancing eruption hit locations and sidestep misses. Existing free variants, neutral charging and buffer tests continue to pass.

Browser keyboard checks triggered all eight forms with one stock consumed each. Screenshots inspected giant discus, ground eruption and ring stream. The enlarged discus initially clipped the floor; its rendered height now scales with radius, and a second screenshot confirmed clearance. The selected-fighter guide displayed both Tala stock options. No console errors/warnings appeared during the initial browser sweep. Physical controller hardware remains untested.

## Preserved short inputs (0.21)

115 tests pass. Eight new tests cover press/release between ticks, ordered directional follow-ups, double-tap pursuit, independent simultaneous player attacks, held charging without repeat events, player-two key aliases, clearing pending actions, and bounded event floods.

Chrome received a complete direction-plus-two-attack-taps sequence synchronously before a rendered frame. Sol selected her forward follow-up and the target finished at 89.68 HP in knockdown. Simultaneous short taps in local play produced both players’ projectiles. Pausing immediately after enqueueing an attack discarded it; after resume both fighters stayed idle with no projectiles. No console errors or warnings appeared. Physical controller hardware remains untested.

## Tala base-special correction (0.22)

119 tests pass. New checks verify a travelling forward projectile without a teleporting lunge or launch, retreating ring geometry metadata, extended clean-hit stun, held-guard protection, fresh-guard reflection, and sidestep avoidance. The older signature test was updated because it explicitly required the replaced lunge. Existing alternate and stock-special tests remain passing. This release has simulation verification; a new visual browser check was unavailable because the required browser runtime tool could not be discovered.

## Morrow base-special correction (0.23)

124 tests pass. Added tests cover ground-wave damage/stun, stun-animation duration, blocking, reflection, sidestep avoidance, eight missiles grouped into four pairs, retreat happening only once, interruption cancelling future pairs, free-stock rules, and transformation into the existing alternate forms. A Three.js scene-object test checks the new low arc, projectile-pool reuse, hidden state, giant-ring height and finite transforms. These checks do not replace visual browser inspection; the required browser runtime remained unavailable for this release.

## Three additional base move sets (0.24)

127 tests pass. Six base-special cases verify emission identity, single emission, clean-hit damage, extended stun where applicable and unchanged stocks. All six are checked against held guard, fresh-guard reflection and sidestep avoidance. The projectile scene-object test checks custom geometry visibility, travel-facing orientation in three directions, finite transforms and reuse across ten projectile types. Two older assertions were updated to the corrected identities. Visual browser inspection remains pending; scene-object tests do not establish appearance or framing in play.

## Keyboard remapping (0.25)

134 tests pass. Seven new tests cover JSON persistence and copy isolation, malformed/conflicting layouts, reserved keys, cross-player and alias conflicts, remapped taps producing a real combat projectile, disabled former keys, held/queued state clearing, independent movement/action remaps, touch action resolution, and default alias restoration. JavaScript syntax checks pass. The options dialog, focus behavior and live hint rendering have not received a browser interaction pass because the required browser runtime tool is unavailable.

## Published module audit after 0.25

Fetched the public import map and all 23 referenced JavaScript modules. Every response matched the committed release bytes. This establishes complete module delivery for build `4313b6b1ed25`, not successful rendering or UI interaction. The outstanding manual cases are recorded in [browser acceptance](BROWSER_ACCEPTANCE.md).

## Sol base-special resolution (0.26)

138 tests pass. Four new tests require explicit base definitions for all twelve fighter/direction pairs, distinguish Sol’s single-shot stun and knockdown, verify damage and free cost, test held guard/reflection/sidestep responses, and preserve alternate and paid-spread selection. Existing Tala tests pass after moving her unchanged parameters into the shared definitions. Visual browser checks are still pending; this release reuses the flame geometry introduced in 0.24.

## Public Chrome acceptance pass after 0.26

The user authorized the available Chrome tools. The keyboard editor passed conflict, cancel/focus, remapping, reload persistence, combat, touch, restore-default and keyboard-navigation checks. Synthetic controller navigation also passed. Recent projectile shapes were inspected in screenshots, including a right-side sword; no console errors/warnings appeared. Actual narrow viewport was 500 × 636. See [executed cases and limits](BROWSER_ACCEPTANCE.md). Side-view wave and spirit silhouettes need polish; physical controllers remain untested. No gameplay code changed during this verification pass.

## Lock-on camera, round ceremony, arenas and audio (0.27)

Automated: 152 tests pass, including new suites for the round ceremony timing (`presentation.test.mjs`), arena data and construction for all six stages (`arenas.test.mjs`), theme data and inert audio without Web Audio (`audio.test.mjs`), relative movement, circling, side-swap commands and CPU termination (`lock-on.test.mjs`), and story content integrity (`story.test.mjs`). Two existing player-two input tests were rewritten for relative inputs.

Browser: headless Chromium (Playwright headless shell 1223, SwiftShader, 960 × 600, low quality) ran a full Aegis versus Rei duel on easy with first-to-one rules. Observed: VS, ROUND 1 and FIGHT callouts in order; W closed distance from x −4 to −1.87 in half a simulated second; D moved the player around the rival (z 0.81) without separating; hitstop engaged on contact; the K.O. callout appeared with the loser at 0 HP and the camera beside the fallen fighter; the result dialog read AEGIS WINS with one win pip; exiting returned to the menu theme. Menu selection switched arenas (Moonlit Shrine, Iron Wastes, Silent Orbit). No console errors. Software rendering is slow, so wall-clock timing and audio output were not evaluated; physical controllers, real speakers, speech voices and P2 relative controls remain untested.

## Animation and local controls (0.28)

157 tests pass. New tests check continuous authored melee poses across contact, exact return to the starting pose, alternate striking arms/weapon arcs, distinct movement poses, guard-recoil reset and deterministic transforms under a frozen animation clock. Player-two movement tests cover closing, retreating and circling before and after a side swap. Existing rig-envelope and combat tests remain passing; after refining idle-pose return, the pose and character suites passed again.

Local Chrome checks inspected Tala, Morrow and Rei at their unchanged contact frames (5, 12 and 8), with damage and hitstop active. Screenshots showed the poses under the lock-on camera. A local-versus input sequence moved P2 from distance 8 to 5.935 with Up, back to 8 with Down, then circled to distance 8.017 with Right. No console errors/warnings appeared in that sweep. These are sampled poses, not complete animation or physical-controller validation. Story presentation remains unwired.

## Swing trails, afterimages and guard flashes (0.29)

163 tests pass. New checks cover trail anchors on real hand joints for every fighter, the swing window, the dashing predicate, ribbon vertex fading, the launch tumble, and a scene-graph run of the effects: a Morrow strike produces a visible finite ribbon longer than one unit that clears after the swing, a pursuit spawns one fading afterimage per interval, guarding shows the shield, a perfect deflect flashes it white, and reset removes the objects.

Browser (headless Chromium, SwiftShader, low quality): training against a guarding Rei showed the pink guard shield in front of her during a Morrow strike, a launched Rei tumbling mid-air at air 0.55, and pursuit executing to recovery with no console errors. Software frames advance many simulation steps at once, so the trail and afterimages were verified by the scene-graph test rather than screenshots; audio output, physical controllers and real-browser frame pacing remain untested here.

## Tala animation sample (0.30)

167 tests pass. New checks cover hips and chest reversing through contact for all three strikes, striking-arm extension and weight transfer, fast ease-out into contact, the stepping hook, distance-based stride phase (standing still keeps the phase, idle resets it), leg scissoring and side-stepping, blending that stays between poses with a trailing head, impact snap and settle, fallback to the shared animator for launches and techniques, frozen-frame determinism, and that other fighters are untouched.

Visual: `tests/tala-review.html` was rendered headlessly from the rival's view and the player's lock-on angle as a 32-cell pose sheet (idle, guard, block, charge, hurt, four forward stride phases, retreat, three circling phases, six jab frames, two cross frames, seven hook frames, stance). Windups, extension past the silhouette, planted feet and the stagger read from both angles after two authoring passes; the first pass showed straights angling across the body, fixed by counter-rotating the arm against the chest twist. Judging motion at normal speed from the real fight camera still needs a hands-on session in a browser.

## Tala live-motion corrections (0.31)

Added regression coverage for a moving player with no synthetic stridePhase, contact-frame pose equality for all three punches, and supporting ankles remaining stationary through idle torso shifts and releasing for airborne animation. Existing rig bounds and frozen-frame checks remain in the suite. The pose review resets plant and strike-transition state between cells.

Chrome local training: selected Tala, advanced, circled, stopped, closed to melee, and landed a straight at frame 5 (rival HP 93.88, hitstop 0.05); inspected paused fight-camera views. This checks live integration and selected poses, not a claim that automated screenshots can establish subjective fluidity. Full walking foot locking, boot orientation, and transitions into the shared airborne/capture animations remain refinements.

## Tala motion and weight (0.32)

Reference inspected in Chrome: https://www.youtube.com/watch?v=wkltXOTfZa8 at 1:55, 2:00/2:00.25/2:00.5, 2:10/2:10.2/2:10.4 and 2:30. The 2:10 sequence shows a low crouch, rise into a wide stance, then another committed body turn. These sampled frames informed stance and weight changes; no original frame timings were measured.

Added tests for a supporting foot holding world position while the root advances, preservation of full movement pose amplitude after transition, and direct continuity between chained punches. Chrome local training checks movement and a paused run pose from the fight camera. Subjective fluidity remains a playtest judgment. Shared aerial/capture animation transitions and boot orientation remain limitations.

Final local build: 173 tests pass. Chrome training sequence circled both directions, retreated, approached and landed all three punches (rival HP 100 → 93.88 → 87.76 → 77.56). No console errors or warnings.

## Post-0.32 check from a second session

The public build hash matched the local release. A headless Chromium training session as Tala against an idle Morrow advanced, stopped, circled, closed in and landed all three punches (rival HP 93.88 → 87.76 → 81.64) with no console errors; captured frames showed grounded feet while advancing and circling and a planted follow-through on the straight. Training input-history arrows were corrected to the lock-on meaning (↑ close, ↓ retreat, ← → circle). Fluidity at normal speed remains a live playtest judgment.

## Tala authored body motion (0.33)

New tests cover clip endpoint sampling, position/velocity continuity across the loop seam in four movement directions, alternating pelvis weight transfer and hip commitment before punch contact. Existing tests cover exact contact poses, chained-punch continuity, fixed supporting feet and finite rig bounds. Shared airborne/capture animation and the simple segmented character models still limit the result; passing tests do not establish subjective equivalence to Evil Zone.

176 tests pass. Chrome training check: circle in both directions, retreat, approach, and three-hit combo ending at rival HP 77.56; inspected a paused retreat pose. No console errors or warnings.
