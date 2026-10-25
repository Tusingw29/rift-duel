# Combat systems: EZ-05 through EZ-11

These are original Rift Duel rules, informed by the [practice tutorial](https://www.youtube.com/watch?v=7AqlL6_7as8). Sampled tutorial frames establish broad behavior, not exact timing or source-game parity. Detailed animation polish is deferred by Adam's instruction; existing poses provide the first playable presentation.

## EZ-05: recovery

Existing air recovery and depth rolls are retained. Rolls now use the line to the opponent for either player, including swapped sides and depth alignment. Fresh directions select toward, away, circle left or circle right. A held direction does not repeatedly escape.

| Choice | Availability | Protection and commitment |
| --- | --- | --- |
| Air recovery | Fresh guard while airborne | Existing short air recovery; avoids landing knockdown, interrupts pursuit |
| Ground roll | Fresh direction while knockdown has at most 0.55 s left | 0.30 s roll; first 0.22 s protected, final 0.08 s vulnerable; no attacks during roll; path clamped to arena |
| Guarded get-up | Fresh guard in the same downed window | 0.18 s rise; first 0.10 s protected, final 0.08 s vulnerable; held guard resumes after recovery |
| Get-up attack | Fresh attack in final 0.12 s of knockdown | Cancels remaining down time; ordinary attack begins on release; no added invulnerability |
| No input | Any knockdown | Normal automatic recovery; no extra protection |

These choices do not replace accumulated stagger recovery (EZ-03). Basic roll posing now rotates along the appropriate axis; a fully authored landing/roll/get-up sequence remains for the animation pass.

## EZ-06: charge transitions

| State/input | Result |
| --- | --- |
| Neutral attack hold | Charge preparation exceeds 0.24 s before filling |
| Guard held | No charging; partial progress preserved |
| Release guard while holding neutral attack | Preparation shortened to about 0.08 s; no shield remains |
| Attack in progress | No charge gain; ordinary tap buffering and follow-up inputs retained |
| Attack ends, attack held | 0.12 s post-attack delay before filling (hold preparation must also be satisfied) |
| Release charge | Preserve partial stock progress; a long neutral hold does not fire a stray attack |
| Hit, stagger, roll, travel or airborne | Interrupt preparation; retain stored partial progress |
| Listed directional stock special | Hold/release still selects its paid variant, never neutral charge |
| Three full stocks | Stop filling; no fourth stock |

Existing lower-health charge acceleration and life-bar sweep remain. Timing feedback appears in free practice. This adapts the tutorial's faster defense-to-charge route; exact source input sequencing remains unmeasured.

## EZ-07: long capture

A ranged capture launches the existing travelling capture, now shown as a ring. While it is alive, each fresh attack press increases its target radius by 0.35, up to 1.35 (base 0.65). Radius grows smoothly at 3.5 units/s. The ring's authored radius follows the collision radius; the victim retains its existing 0.5-unit collision allowance. Growth inputs do not also fire attacks or charge.

Held input cannot repeat growth, a stunned owner cannot grow it, and growth does not home toward a moving rival. Existing projectiles persist if their owner is interrupted, but expire normally. Fresh timed guard breaks capture. Two opposing overlapping capture rings cancel before either captures a fighter. Character/context-specific capture cinematics remain unchanged.

## EZ-08: combo audit

| Tutorial route | Rift Duel mapping | Finding |
| --- | --- | --- |
| Basic close sequence | Three connected strike taps | Present; hit/block can chain, whiff cannot |
| Basic ranged sequence | Three shots, chaining after release | Present; release-based chaining is an original design choice |
| Directional third hit | After second contact: toward/away special, technique or capture | Present across all six fighters; tests added |
| Advanced third finish | Launcher, pursuit, crossover or burst commands | Present; stock cost and commitment retained |
| Launcher into aerial additional blows | Confirmed launcher → pursuit → three air contacts | **Gap fixed:** confirmed launcher can now cancel directly into pursuit. A blocked or missed launcher cannot |
| Alternate advanced attack | Additional tap during signature startup | Present in technique and horizontal-special variants; existing tests retained |
| Counterattack into a sequence | Clean-stagger-recovery empowered strike → ordinary follow-up chain | Present and regression-tested; the third-hit defensive return remains deliberately non-chainable |
| Moving-target close capture | Capture resolves using target's location at contact | Present; if target escapes close range, a ranged circle is sent instead |
| Exact PS1 buffers and full per-character branch equivalence | Not established from sampled footage | Unverified; no claim of a complete frame-accurate recreation |

Controls: tap attack after contact for a chain; after hit two choose a directional attack or a shortcut. On a successful launcher, press pursuit as the rival rises. The field manual and guided launch lesson reflect the new cancel.

## EZ-09: Pressure Dash

Two opposing grounded pursuit moves, still approaching/contacting within 3.25 units and aimed at one another, start a 1.6-second contest before ordinary damage. Aerial pursuit and capture/burst clashes remain separate.

Each fresh attack press scores, limited to one point per 12 simulation frames (0.20 s). Held input scores only once. Options offers a symmetric hold assist: both fighters may hold attack and score at that same maximum rate. CPU pulses depend on difficulty. Winner deals 10 base damage times fighter power and knocks the rival down; ties deal no damage. The contest freezes other action/projectile progression, uses the round clock, and resolves on timeout. Pause/blur freezes simulation normally. Release resets buffered combat commands, preventing contest taps from becoming an unintended follow-up.

Current presentation uses braced guard poses, a clash flash/sound, visible scores/countdown, and existing knockdown/recovery. Dedicated clash/release choreography is deferred.

## EZ-10: camera comparison

The saved tutorial sheets were re-inspected for move (0:12), circling (0:35), distant shot (1:01), close exchange (1:17), glide (1:43), capture defense (5:06), recovery (5:25), and counter sequence (7:20–7:28). They frequently show both fighters from broadside or three-quarter angles. They do not establish the original camera algorithm. Capture framing remains deliberately cinematic, based on earlier capture studies.

| Situation | Change / retained behavior |
| --- | --- |
| Neutral and distant | New Duel camera frames the midpoint from a broad three-quarter angle; distance widens with separation and narrow aspect ratio |
| Close exchange | Both bodies remain visible; no forced behind-player view |
| Circle/crossover | Viewing side is preserved as fighters exchange places, reducing 180-degree camera swings |
| Launch and recovery | Framing includes actual visual air height; post-smoothing fit protects head/feet bounds |
| Capture/burst | Existing authored cinematic shots retained; Reduce motion keeps neutral framing |
| HUD and screen edges | Ordinary combat fit reserves horizontal/vertical margins; both players tested at edges and portrait aspect ratios |

Duel is the default for new settings. Existing saved camera preferences are preserved; choose Options → Camera → Duel to try it. Side and Lock-on remain available. A browser review captures identical neutral, close, circle, air and recovery setups for all three cameras, plus portrait framing. This supports comparison of composition, not a normal-speed aesthetic verdict.

## EZ-11: guided practice

Training → Pause → Practice Controls → Guided lessons. Nine lessons cover movement, three-hit chains, charging, timed defense, expanded capture, launch/pursuit, air recovery, ground recovery and Pressure Dash.

Every lesson resets a real combat match with reproducible positions/state and supplies current remapped keyboard or controller commands. A short ready countdown allows reading. Success/failure is detected from actual combat results; Retry resets immediately, Next lesson unlocks after success, and Free practice exits. Controller users can pause and Restart an active lesson; completed lessons expose controller menu navigation. Free practice's repeat-three-hit dummy remains available for reversal work.

The first cloud review passed UI movement/charge completion, remapped controls, controller prompt switching, retry, next, Pressure Dash start/pause/failure, and exit. Simulation tests cover all nine success conditions and common failures. Physical controller hardware and Adam's unaided first-play verdict remain untested.

## Validation and remaining polish

Initial implementation: `b115ac8`, 385 tests and [browser review 40233415645](https://github.com/Tusingw29/rift-duel/actions/runs/40233415645). Final integrated validation is recorded on the shared task board.

Deferred: authored recovery/capture/clash choreography, full-speed camera and timing polish, physical-controller testing and Adam's usability verdict. Those are not established by headless screenshots. No copyrighted reference video or extracted game assets were committed.
