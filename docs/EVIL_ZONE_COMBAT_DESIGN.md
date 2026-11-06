# Evil Zone moves, spacing and punish design

2026-11-06 · Codex · `codex/combat-design-study` · Research/design review only. No game, input, CPU or animation changes. Base: capture-loop `15d89ef`, content build `4424f1ffbb13`.

## Answer first

Rift Duel needs an unsuccessful attack to leave an opening or surrender something useful. Making the CPU dodge more, or reducing damage on an otherwise safe loop, does not create that decision. Keep simple inputs; make line attacks, lateral coverage, guard, close grabs and ranged traps require different commitments.

My preferred prototype is a visible, position-locked closing seal for ranged capture, with a real escape interval, wake protection and caster commitment through its resolution. **This is a proposed Rift Duel mechanic, not a verified reconstruction of Evil Zone's collision/timing rules.** Compare it with the existing travelling ring before deciding a default. Test the miss cost separately rather than stacking damage nerfs, resource costs and staling in one experiment.

## What the references establish

Notation: A = Attack; G = Guard; f/b = toward/away; u/d = background/foreground directions in the reference guides. These are semantic directions, not fixed WASD bindings. Preserve Adam's selected side-control scheme when implementing anything.

| Input/context | Documented reference behavior |
| --- | --- |
| A near / A at distance | Melee / projectile; short chains |
| f+A, b+A, u+A | Three character signatures |
| d+A | Capture; close front/back, middle, far outcomes |
| d,d+A / f,f+A | Launcher / glide pursuit |
| u,u+A / u,u+G | Jumping attack / jump |
| Near f+G | Circle behind |
| G | Block; timed projectile reflection, capture escape, air recovery |
| Hold A | Crystal charging; some held signatures spend crystal |

This is a command-family summary, not a complete input parser specification. Tap versus hold, action order, movement state and follow-up taps can select different actions. Character-width range descriptions in guides are not measured metre thresholds. [Otaku Tom's PAL guide](https://gamefaqs.gamespot.com/ps/197247-evil-zone/faqs/8087), [ZAmigh](https://gamefaqs.gamespot.com/ps/197247-evil-zone/faqs/11665), [mysticcat](https://gamefaqs.gamespot.com/ps/197247-evil-zone/faqs/13803).

### Directional attack types across all ten fighters

Descriptions below summarize functions, not copied move descriptions. Signatures are commands, not guarantees that a move reaches at every distance. Alternative forms, hit effects and names differ among guides.

| Fighter | f+A | b+A | u+A |
| --- | --- | --- | --- |
| Danzaiver | Gun shot | Stunning lightning | Sword rush |
| Alty | Stunning fire shot | Fire familiar | Defensive fire shell |
| Erel | Stunning blades | Beam | Flipping slash |
| Gally | Stunning ground wave | Missiles | Rush/beam |
| Kakurine | Fire shots | Ring snare | Rolling ring |
| Keiya | Spirit bird | Ground pentacle | Projectile line |
| Linedwell | Stunning energy | Ground wave | Rapid stabs |
| Midori | Chi shot | Stunning disc | Charging energy strike |
| Setsuna | Spirit bird | Thrown sword | Spinning slash |
| Ihadurca | Spear beam | Counter-projectile wave | Defensive orbs |

Cross-read against [mysticcat's character lists](https://gamefaqs.gamespot.com/ps/197247-evil-zone/faqs/13803), [ZAmigh's character lists](https://gamefaqs.gamespot.com/ps/197247-evil-zone/faqs/11665) and [the PAL list](https://gamefaqs.gamespot.com/ps/197247-evil-zone/faqs/8087). Alty's forward/up names and some capture names are inconsistent; behavior is more reliable than translated naming. Exact original tracking, recovery, strength and disadvantage are unmeasured.

### What capture changes with range

All have close front/back variants. At middle/far range, the same capture command selects different choreography after confirmation:

| Fighter | Middle | Far |
| --- | --- | --- |
| Danzaiver | Sword impale | Orbital strike |
| Alty | Fire spear | Meteor spell |
| Erel | Slashes/bomb | Dive attack |
| Gally | Blade toss | Energy orb |
| Kakurine | Effigy | Red slash |
| Keiya | Blackout assault | Summoned creature |
| Linedwell | Repeated slam | Portal hand |
| Midori | Clone assault | Rushing punches |
| Setsuna | Sword impale | Spirit assault |
| Ihadurca | Teleport blasts | Lift/slam |

Range-dependent choreography is distinct from how a capture initially acquires its target. [ZAmigh](https://gamefaqs.gamespot.com/ps/197247-evil-zone/faqs/11665), corroborated for examples by the character pages for [Danzaiver](https://evilzone.fandom.com/wiki/Danzaiver), [Erel](https://evilzone.fandom.com/wiki/Erel_Plowse), [Setsuna](https://evilzone.fandom.com/wiki/Setsuna_Saizuki) and [Ihadulca](https://evilzone.fandom.com/wiki/Ihadulca).

A particularly useful distinction: the PAL guide describes extra-tap versions of several attacks that cover sidesteppers, including Danzaiver's lightning, Erel's beam and Gally's missiles. **Design inference:** lateral coverage should be a deliberate choice rather than every attack automatically following the defender. These descriptions do not measure homing or guarantee any exact sidestep timing. [PAL guide](https://gamefaqs.gamespot.com/ps/197247-evil-zone/faqs/8087).

### The circle: confirmed and unresolved

Valkryie_X describes a red circle encompassing a middle/far opponent, another Attack press enlarging it, and a timed Guard response when encircled. That supports Adam's memory of a visible capture phase. It does **not** establish a fixed-location shrinking ground trap, its warning duration, when targeting stops, or which movement escapes. [1999 FAQ](https://gamefaqs.gamespot.com/ps/197247-evil-zone/faqs/4871).

The prior tutorial study sampled the [practice video](https://www.youtube.com/watch?v=7AqlL6_7as8); its implementation notes explicitly call ring flight/growth an adaptation. I have not newly measured continuous PS1 gameplay or engine frames in this study. A complete original reconstruction needs normal-speed footage showing attempts that fail, not only successful capture compilations. Record stationary, sideways walk, retreat, jump and timed guard from identical starting positions, including wake-up. Track ring centre/radius against the floor and the target through the whole attempt.

## What Smash contributes

Official instructions distinguish quick standard attacks, directional attacks, stronger committed attacks, shields, dodges and throws. They explicitly teach grabbing a shielded opponent and counterattacking after defending. [Basic controls](https://www.smashbros.com/wiiu-3ds/sp/us/howto/entry3.html), [grab/throw lesson](https://www.smashbros.com/wii/en_us/howto/basic/basic08.html).

Do not reduce this to "all projectiles are weak" or an unconditional attack-beats-grab triangle. Range, timing, invulnerability and character tools matter. Repeated-move damage reduction exists, but is an additional mechanism, not evidence that an unpunishable move becomes fair. [Official stale-move explanation](https://www.smashbros.com/wii/en_uk/howto/technique/technique10.html).

## Current Rift Duel: measured reasons the gamble is missing

These probes use the capture-loop branch, normal fighter stats, no balance overrides, Move V2/ring/Burst V2/linear. They are fixtures, not new tournament win estimates. [Read-only script](../scripts/design-study/capture-risk.mjs), [raw result](../art/review-2026-11-06/combat-design-study/capture-risk.json).

1. **Far capture can remain dangerous after its owner is already free.** Against a stationary target at 8 units, the ring spawns on tick 14, the attacker is ready on tick 55, and capture confirms on tick 64. At 12 units, confirmation is tick 98: 43 ticks after attacker recovery. "Ready" here means no attack move, cooldown or stun. At 4 units capture confirms before the attacker recovers. These are advancing simulation ticks, not original PS1 frame data.
2. **A close grab can correct itself into a ranged attack.** Morrow retreats immediately from 2.8 units. Tala's capture becomes a travelling circle at 3.757 units on tick 14, then captures him at 5.875 units on tick 45. The close-grab miss has become another chance to hit. Lock the selected action type at startup if backing out is supposed to punish it; preserve the existing capture sequence only on a valid contact.
3. **Punish range matters as much as recovery.** Current Morrow walks at 4.1 units/s; 6.4 in the pasted notes is Tala's speed. Forty frames lets Morrow walk about 2.73 units before allowing for reaction or attack startup. A point-blank whiff-punish calculation does not prove a punish from 8 units.
4. **The strongest ranged result can restart the same situation.** Existing far capture has a 1.25 damage multiplier, unless flat is enabled. Wake protection reduces repeated circle landing rates but did not make the CPU competitive in the [capture-loop study](../art/review-2026-11-06/capture-loop/README.md). A reset at cinematic end alone also allows retreat during the victim's long recovery. Do not re-present either as a complete fix.

Reaction-check: close capture is 13/1/40. At 15f visual delay, its startup slack is -3; a fresh reaction cannot beat its contact. **That can be an intentional close-range read**, provided an early jab, spacing or an anticipated step really beats it and its miss is punishable. Making every close grab reactable could instead make guarding too strong.

## Proposed combat contract — original design

Footsies means moving around the edge of an attack's reach: make it miss, then attack while the rival is recovering. A gamble means committing to the answer you expect, with a loss if you guessed wrong. A punish means the defender can actually reach the opening; at long range the reward can instead be space or resource advantage.

| Choice | Intended use | Intended answer | Commitment to verify |
| --- | --- | --- | --- |
| Quick linear strike | Check approach, interrupt slow action | Guard, space outside its reach, anticipated sidestep | Short recovery; not every jab needs a reaction punish |
| Heavy straight attack/beam | Catch retreat or a large opening | Step out before aim locks/contact | Readable wind-up; meaningful miss recovery |
| Sweep/fan | Catch lateral movement | Guard, retreat beyond its shorter reach | Less reach/reward or more recovery than the straight option |
| Close grab | Beat a defender who keeps guarding | Earlier strike, backstep, anticipated lateral escape | Short genuine reach; no ranged fallback on miss |
| Ranged seal | Catch stationary defence, charging, or a predicted destination | Leave the marked zone, or timed break | Fixed targeting, visible closure, real miss cost |
| Guard/parry | Stop a committed attack | Grab nearby; reposition/charge at distance | Parry miss must not also cover every other option |
| Dash/pursuit | Take ground after forcing a response | Check with a strike or intercept the lane | No safe attack/guard coverage throughout its entire recovery |
| Charge | Convert distant safety into resources | Advance, shoot or use a seal | Cannot guard and fill resource simultaneously |

This deliberately gives every move a job and a limit. A tracking move is allowed to turn only during its defined tracking window; all moves must commit to an aim before the hit. Visual tracking and collision must agree.

### Keep the inputs understandable

Two core buttons, Attack and Guard, can remain, with existing optional shortcuts. Neutral Attack checks nearby or shoots at distance; directional signatures retain each fighter's identity. Close and ranged capture share a command but must be visibly different commitments, selected at the start. Use a short attack buffer, never automatic range correction after a read has already failed.

Keep one small combo decision: after two connected strikes, choose direct finish, anti-step finish, throw, or stop and defend. Do not give the attacker every finish's coverage at once. A fast jab can be a prediction; a long-range cinematic should have a readable escape phase. Do not require a player to identify an entire animation in thirteen frames from across the arena.

If direction-plus-A keeps producing unwanted specials while moving, compare an optional Attack/Special/Guard layout like Smash's separate attack/special buttons. That is a usability alternative, not an automatic replacement of Adam's chosen controls or a substitute for fixing risk.

### Closing-seal prototype, specified enough to test

These are **playtest guesses**, not Evil Zone measurements:

- Lock the seal's world-space centre when the visible warning appears. It must not follow an escaping target until the last frame. Show the actual capture region and a clear closure cue from side and rear cameras.
- Starting geometry: radius 1.5, defender collision radius 0.5. Full-body escape requires the defender centre to move beyond 2.0 from the seal centre. With Morrow's 4.1 speed, that takes about 30 frames of unobstructed walking. Add a 15-frame reaction allowance and several frames of margin: try **54 frames** of visible warning, not the unverified 40 in the pasted proposal. Test edge tangents, body blocking, diagonals and every fighter before choosing a value.
- Walking out must work against an isolated cast. A setup can work by first forcing guard/stationary behaviour or predicting a destination; the trap should not be a guaranteed solo opener.
- Resolve containment once at closure. No early invisible capture from overlapping the warning's edge. Successful confirmation earns the character's range-specific cinematic; escape does not.
- No capture of down/rising targets; reuse the tested wake-protection option. One live seal per caster, including buffered/repeated presses. Melee capture remains distinct and free of seal behavior.
- Caster stays committed through closure, with no safe guard, new seal or unrelated attack while the seal remains live. Interruption cancels it. Add a visible failed-seal recovery, but **do not call that a guaranteed long-range hit punish** until projectile flight has been included in a fixture.
- Separate comparisons: (A) free seal with commitment; (B) same seal costing one crystal on cast, spent even on miss. The latter guarantees a resource cost at any distance and competes with Burst. It is a deliberate departure from ordinary source-game capture, may be too expensive, and must not silently replace A. If A allows a sufficiently strong advance/counter-shot, keep A; if it still dominates, B tests whether paying for ranged capture helps.
- Keep close grabs dangerous to held guard. Decide ranged held-guard behavior independently: current guard-blockable ring is the comparison; a seal requiring movement or a timed break is another choice. Do not sneak that change into a visual reskin.

A seal that always loses to movement is a conditioning/setup tool, not a general-purpose projectile. An undodgeable seal with huge reward is the present problem in a new shape. The prototype must demonstrate the difference.

### Roles for our six fighters

Original proposed roles; reference similarities inform their vocabulary, not exact balance:

| Fighter | Strength to preserve | Weakness the opponent can exploit |
| --- | --- | --- |
| Tala | Fast close checks, pressure and step-catching hook | Reaching sword range; ranged tools should help approach rather than replace her whole close game |
| Aegis | Precise shots/beams and controlled approach | Committed beam lane and nearby recovery |
| Morrow | Long sword checks, deliberate heavy punishes | Early spacing/step against committed straight cleaves; his sweep must cost something |
| Rei | Sword pressure, quick transitions and spirit attacks | Do not also give her best reach, speed and safe disengagement on every option |
| Sol | Projectile tempo, fire coverage and charge decisions | Rush him during committed cast/recovery; covering a step gives up another route |
| Vesper | Traps that create a second decision | Setup time and a real limit on concurrent trap coverage; not an invisible guaranteed capture |

## Experiment order and acceptance gates

1. **Close whiff contract:** start at strike/grab boundary, backstep or sidestep on each startup frame. A failed close grab must stay a miss; test counter strikes against recovery at actual separation.
2. **Ranged capture comparison:** existing ring, free closing seal, crystal-cost seal. Keep wake protection consistent so the test measures the ranged decision rather than a knockdown loop. Also retain an explicit current-rule control.
3. **Answer coverage:** isolated seal must be escapable at a 15-frame delay by each fighter, including tangent escape at the boundary. A fair setup can deny one route, not every route without extra commitment. Timed break, held guard and interruption need separate fixtures.
4. **Punish credibility:** include input delay, defender startup, walking/dash distance, shot flight and caster recovery. Measure blocked, dodged and interrupted casts separately. Count earned ground/resource advantage as such, not invented damage punish.
5. **Anti-step branches:** for every fighter record which straight move misses a step and which sweep/fan catches it, with their reach and recovery differences. Do not just give all attacks homing.
6. **Opponents:** real CPU baseline/v2, unchanged circle-camper, an escape-then-counter bot and normal mixed play. Bots must see the actual warning through the same delay and know the new legal escape; otherwise a low escape rate measures bot ignorance.
7. **Verdict:** report repeat-circle share, free-to-act time, post-escape distance, response used, punish/advance/resource gained, guard-versus-grab outcomes, mixed-play capture success and win ranges. Then Adam plays it at normal speed. There is no required "correct" bot win rate and no gameplay promotion from a scorecard.

Defer stale-move damage reduction until this exchange works. Even half damage remains dominant if the defender cannot answer and the attacker gives up nothing. This study proposes experiments; it does not authorize a universal weakening of ranged play or prove Evil Zone itself was competitively balanced.
