# Tala — animation construction specification

These are original choreography proposals built around current Rift Duel rules. The drawings are key-pose references, not finished animation, motion capture, or source-game frame data. Use [timing.json](timing.json) for the generated combat contracts. Regenerate it with `node scripts/tala-design-timing.mjs` after balance changes.

## Coordinate and timing rules

Left/right means Tala's anatomical left/right. Default stance has left foot forward. Forward means toward the rival, not a fixed world axis. Author with a target marker at the rival's contact plane. Review front, side and behind Tala; do not reverse anatomical limbs when the camera changes sides.

Simulation is 60 Hz. Frames below are local to each action, beginning at 0. `total` is the end boundary. A combo can chain before the first attack fully recovers, so do not concatenate three isolated clips with neutral poses between them. A capture or burst startup event begins its cinematic; it is not the cinematic's final damage frame.

The manifest's generic planningFrames are suggestions. Pursuit uses three contact events; techniques have an active travel phase; cinematic actions require their separate normalized timeline. They cannot all be built by blindly applying one generic curve.

## Common construction order

1. Put the support foot on the ground and position the pelvis above a credible support area.
2. Key the initiating push, weight transfer or impact. A moving foot lifts only after its weight has transferred.
3. Rotate hips before the chest where appropriate; let the shoulder carry the arm.
4. Pose hand/foot on the exact contact event, with a slightly soft elbow/knee. Preserve the gameplay reach.
5. Add the catch step or follow-through that absorbs momentum.
6. Return hands and balance into the next action. Head and hair settle afterward, without delaying input.

Use stepped blocking first. Add arcs and breakdowns before splining. Never smooth all joints uniformly across the contact frame. Keep an explicit contact key and inspect intermediate frames for overshoot.

## Idle, locomotion, dash and roll

All percentages are cycle phase, not new gameplay timings. Existing distance-driven footwork and root movement remain authoritative.

| Action | 0% | 25% | 50% | 75–100% |
|---|---|---|---|---|
| Idle | Balanced staggered stance, knees soft, chin slightly down | Small breath through ribs, shoulders follow | Weight subtly changes between feet, heels mostly quiet | Return without a whole-body synchronized bob |
| Advance | Rear foot pushes; lead foot becomes light | Lead foot swings low toward opponent | Lead foot plants; knee accepts pelvis | Rear foot gathers; restore stagger, no crossing |
| Retreat | Lead foot pushes; rear foot becomes light | Rear foot reaches back low | Rear foot catches weight with knee flexion | Lead foot gathers; hands stay near face |
| Circle left | Right foot pushes; left foot opens outward | Pelvis travels toward left planted foot | Right foot lightens and follows | Restore width; chest/head track opponent |
| Circle right | Left foot pushes; right foot opens outward | Pelvis travels toward right planted foot | Left foot follows | Restore stagger; do not mirror the face or swap fighting hands |
| Dash | Compress ankle/knee slightly in movement direction | Strong support-foot push | Low forward travel; hands remain useful | Braking foot catches pelvis and gathers |
| Roll | Lower hips and protect head | Shoulder leads the tuck | Compact rotation with limbs clear of floor | Foot plants under center; stand into guard |

Walking should use compact fighting steps, not the exaggerated lunges in sheet 04. Match stride to actual distance. Keep feet separated laterally, knees tracking toes and airborne foot clearance modest. Foot plants are world-space holds until toe-off; do not hold both feet fixed while translating the pelvis beyond reachable leg lengths. Dash/roll are written choreography targets: map their timing to existing movement states before authoring clips; do not add invulnerability or travel.

## Crossed guard, impact and recovery

Guard is immediate in simulation; the visible entry must not create a vulnerability delay. Suggested visual entry: F0 current pose; F2 elbows fold inward and knees soften; F4 forearms cross in front of upper chest/chin, shoulders lift and chin tucks; F6 settle into hold if no interruption. These six frames are a visual proposal, not new rules.

Protect with crossed forearms while keeping wrists off the throat. Elbows protect ribs. Eyes look forward beneath brows. Neck bends naturally with upper spine; it does not retract like a piston. Hold a shallow crouch, not the sheet's deep squat.

On block, compress knees/chest a little more on the actual impact event, with a short head follow. Recover toward guard within the current block reaction. Perfect deflect uses a small outward forearm turn and firm plant rather than a large flourish. Releasing guard opens directly toward the current action, not a neutral bind pose.

On unguarded recoil: chest responds first, head trails, rear foot steps back to catch weight, rear knee absorbs, hands re-form the guard. Keep eyes oriented toward danger as soon as recovery allows. A repeated hit restarts from the current displaced stance, not an old foot anchor. Knockdown adds loss of balance, protected fall and a grounded settle; get-up plants a hand/foot before raising the pelvis. Respect existing stun duration and collision state.

## Three-hit combo — right / left / right

Each standalone strike currently has startup 5, active 1, recovery 14, end boundary 20. The drawn contact labels F5 are local to each strike. Suggested keys per strike: ready F0, load F3, drive F4, contact F5, follow F9, gather F15, end F20. On an early chain, begin the next strike from the actual previous pose.

| Beat | Right straight | Left cross | Stepping right hook |
|---|---|---|---|
| Load | Weight slightly rearward; right fist near cheek, left hand protects | Use residual twist from right strike; left shoulder gathers without a reset | Both knees compress; right elbow folds, left foot prepares short step |
| Drive | Right ball pushes, heel turns; pelvis initiates, shoulder follows | Left ball pivots as hips counter-rotate; do not drag the foot | Left foot plants before hard torso rotation; rear ball pushes |
| Contact F5 | Right fist reaches target; left knee receives weight; left hand guards | Left fist reaches target; right hand guards; hips remain between feet | Bent right elbow sweeps fist across target; left hand protects jaw |
| Follow | Carry shoulder slightly, then fold right elbow | Carry left shoulder, then retract | Absorb rotation in hips/knees; rear heel remains free to turn |
| Gather | Feed left-side load if chained | Feed low hook load if chained | Return hands while feet/pelvis settle |

Do not lock elbows straight, spin on flat planted soles, slide the pelvis without weight transfer, or use an extra wind-up that delays F5. The generated sheet's left/right ambiguity is not authoritative: validate with colored left/right wrist markers in Blender. Hook contact in the drawing is too close to the chest; put the fist on the actual target plane.

## Projectiles and directional signatures

| Move | Startup / active / recovery | Load → drive → release → recover |
|---|---|---|
| Energy shot | 11 / 1 / 18 | Gather right palm at rear hip; rear foot drives pelvis; palm releases at F11 with left guard; fold elbow and settle |
| Storm spark | 9 / 1 / 22 | Both hands gather; compress legs; extend palms at F9 to release ONE travelling bolt; recoil arms and knees |
| Still-water discus | 12 / 1 / 26 | Coil left arm across torso; push backward; left arm sweeps and ONE disc releases F12; catch rear foot and recover |
| Twin spark | 9 / 1 / 22 | Broader paired-hand presentation; TWO projectiles at F9; same root and recovery family |
| Crosswind discs | 12 / 1 / 26 | Wider release silhouette for TWO separated discs; preserve backward travel and F12 |
| Blazing palm | 9 / 1 / 22 | Deeper compression and larger palm follow-through for ONE large shot; no extra startup |
| Giant discus | 12 / 1 / 26 | Stronger torso coil and heavier arm follow-through for ONE large disc; same backward root contract |

Still-water root motion is explicit: current `retreat-motion.js` moves 1.2 units backward from F3 to F12 with a smooth curve and maximum visual hop height 0.16. At F12 the hop is back at ground level. Do not copy the airborne release illustration literally. No extra root movement may be baked on top of the simulation.

Stock charging: establish grounded low stance, hands gather, ribs expand slightly; arms/neck should not tremble continuously. Releasing into a stock move blends from the charge pose to that move's contact key. A follow-up variant chosen during startup must retain the same release time.

## Launch, air movement and techniques

| Action | Contract | Pose sequence |
|---|---|---|
| Ground launcher | 10 / 1 / 25 | Knee/hip compression → support-foot drive → grounded uppercut at F10 → elbow retracts → balanced stance |
| Rising tempest | 8 / 15 / 24 | Low right fist → ankle/knee drive → rising uppercut at F8 → carry through active travel → tuck → soft landing and recovery |
| Skybreaker kick | 8 / 15 / 24 | Compress → chamber knee → extend kick at F8 → retract before landing → knees absorb; preserve variant reach |
| Aerial pursuit | 7 / 19 / 30 | Approach/rise → right straight F7 → left cross F16 → final kick F25 → retract and descend |
| Jump attack | 9 / 1 / 25 | Compact airborne load → strike F9 → retract limbs → prepare landing, constrained by current trajectory |
| Jump | Existing simulation trajectory | Knees load → ankles push off → airborne tuck → legs extend for contact → knees/hips absorb |
| Air recovery | Existing state duration | Forearms protect head → orient torso toward rival → regain compact posture → extend legs before landing |
| Launched tumble | Existing air/stun state | Impact initiates torso rotation → legs/hair follow → compact tumble → orient to floor as recovery permits |

Author flight pose against `air-motion.js`; do not create a second jump height curve in the clip. Pursuit victim and actor must remain vertically aligned at the three contact events. Arms/legs may show fantasy action, but a landing still needs a supporting foot and knee compression. Do not add a kneeling pause after Rising tempest or Skybreaker just because the illustration suggests one.

## Stormbreaker captures and Eightfold Tempest

These are written cinematic key sequences to block with an opponent proxy. Existing camera, duration and damage events are authoritative. Use normalized progress so pose keys survive presentation timing changes. Final damage is applied by combat at cinematic completion; visual sub-strikes are not extra gameplay damage.

| Capture context / duration | 0–20% | 20–45% | 45–75% | 75–100% |
|---|---|---|---|---|
| Front: palm-slam / 2.3s | Step inside and establish hand contact | Lower hips and brace through legs | Drive the palm/body finish along the existing opponent path | Release, absorb stance and blend home |
| Back: cradle-slam / 2.4s | Establish rear hold with elbows close | Legs lift the opponent; back stays supported | Guide the existing cradle/slam arc | Release on finish, knees absorb, return home |
| Mid: surround / 2.6s | Approach inside range | Alternate compact body-driven strikes with echo staging | Rising palm carries opponent along current path | Arms return, settle and blend home |
| Far: meteor-rush / 2.8s | Rush along existing root path | Alternating strikes; shoulders/hips change lead | Commit to existing finishing strike | Brake through legs and return home |
| Eightfold Tempest burst / 2.6s | Establish charge/approach | Alternate fists with hips and knees supporting each beat | Carry the existing lift/finish presentation | Retract, land/settle and blend back to simulation |

Capture startup is 13 / 1 / 40; burst startup is 22 / 1 / 42 before their cinematic behavior. Do not animate throws by moving the victim independently of the grasped contact point. Use paired hand/torso constraints during authoring, bake to both actors, then verify the runtime paths agree. Do not add swords or transform the burst into a different move.

## Interruptions and validation

Test idle→advance→stop, advance→circle both ways, retreat→guard, guard→attack, combo early chains, strike→hurt, hurt→repeat hit, jump→air recovery, technique→landing and KO during movement. Transitions start from the currently evaluated pose. Keep hitstop frozen, including secondary motion.

Check twice: first with flat materials and effects off, then in the actual lit fight camera. Review contact placement, support feet, anatomical left/right, neck tuck, shoulder volume, costume clearance and hair settling. Record a normal-speed browser capture once implemented. These still boards cannot prove fluidity.
