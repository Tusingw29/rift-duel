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
