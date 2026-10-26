# Tala authored / captured gait comparison

Actual graphic Tala GLB, same side camera and timestamps. Authored remains default. Imported Claude's `070f08f` mocap work without changing the original checkout's paused rebase. These are software-rendered pose strips, **not a normal-speed verdict**.

The viewer now offers live-only Advance to guard, Advance to combo and Circle to recoil. Switching gait while paused resamples from reset at the same time; baked clips disable the selector. The Play link preserves the gait into the game.

| Sequence | Authored | Corrected mocap | Times (seconds) / reading |
| --- | --- | --- | --- |
| Advance | [strip](tala-authored-Advance-1792981219067.jpg) | [strip](tala-mocap-Advance-1792981423500.jpg) | .45, .70, .95 — both retain fighting foot targets; mocap changes torso bob and arm rhythm. Last frame shows the largest body-height difference. |
| Retreat | [strip](tala-authored-Retreat-1792981219067.jpg) | [strip](tala-mocap-Retreat-1792981423500.jpg) | .45, .70, .95 — original mocap tilted the chin up; corrected adapter keeps gaze toward the opponent. Last frame was the weakest before correction. |
| Circle left | [strip](tala-authored-Circle-left-1792981219067.jpg) | [strip](tala-mocap-Circle-left-1792981423500.jpg) | .45, .70, .95 — sideways foot targets remain procedural; adapted walk does not establish a better sidestep. Middle frame needs normal-speed scrutiny. |
| Advance to guard | [strip](tala-authored-Advance-to-guard-1792981219067.jpg) | [strip](tala-mocap-Advance-to-guard-1792981423500.jpg) | .7833, .8167, .8833 — last running frame, entry, crossed brace; no inserted idle. Middle frame still has partially open guard. |
| Advance to combo | [strip](tala-authored-Advance-to-combo-1792981219067.jpg) | [strip](tala-mocap-Advance-to-combo-1792981423500.jpg) | .7833, .8167, .8833 — moving stance, load, first exact punch contact. Middle frame is deliberately brief because startup is five frames. |
| Circle to recoil | [strip](tala-authored-Circle-to-recoil-1792981219067.jpg) | [strip](tala-mocap-Circle-to-recoil-1792981423500.jpg) | .7833, .8167, .8833 — step then sharp impact reaction. Second frame has the largest torso/head change; this existing hit response is not smoothed away. |

Earlier `tala-mocap-*-1792981219067.jpg` strips show the adapter before its combat-gaze correction. Reports contain actual sample times and browser errors. The failed initial report records a setup error (a label selector) corrected before comparisons.

## Verification and limits

413 tests pass. Both sources preserve all three exact combo contacts, deterministic replay and bounded guard/strike entry. Impact recoil is intentionally sharp and is tested for finite poses rather than slow blending. The existing foot solver still controls Tala's feet; mocap here is a hybrid, not a pure retargeted full-body performance. Retreat reverses a running cycle and circling adapts a forward walk; dedicated combat captures would be a stronger basis. The GLB's baked clips are unchanged and remain authored.

Recommendation: retain authored as default. The reviewed frames expose no reason to replace all locomotion wholesale. Use the continuous sequences at normal speed to decide whether captured torso rhythm is worth keeping, then address dedicated retreat/circle motion separately. No physical controller or normal-speed human evaluation was performed in this pass.
