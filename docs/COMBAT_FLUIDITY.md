# Simulation fluidity and animation handoff

Update: the camera-facing effect treatment below has been replaced by [volumetric 3D assets](VOLUMETRIC_EFFECTS.md). The historical implementation details remain for reference.

Synced Claude's motion-weight work through `3e4b306` before implementation. Character models, animator channels and pose math remain untouched. The renderer changes here only integrate beam effects and freeze presentation time/trails during simulation hitstop.

## Frame contract for Claude

| State | Authoritative fields | Animation handoff |
| --- | --- | --- |
| Pre-jump | `player.jumpSquat = {frame, frames: 4, started}`; `anim = 'jumpSquat'`; `air = 0` | Frames 0–3 are grounded. Movement, attacks and guard are locked; hits can interrupt. The next tick sets the existing airborne timer/trajectory. Bind crouch directly to this window. |
| Down hold | `player.knockdown.remaining` | Grounded hold before rising. Normal .55-second knockdowns use 21 down frames plus 12 rise frames. Longer knockdowns retain their longer hold. |
| Rise | `player.getUp = {frame, frames: 12, safe}` | Automatic rise exposes frames 0–11. Existing `knockdown` / `recover` animation names are retained for compatibility; bind the rise to `getUp` instead of guessing from visual time. |
| Travel | `player.travel` or `player.move.travel`: `frame`, `frames`, `delta`, `speed` | `delta` is actual bounded X/Z displacement this tick. `speed` is a multiplier relative to the path's nominal mean speed, not a 0–1 blend weight. |
| Impact freeze | `match.hitstop` (remaining frames), `match.frozen` (this update was frozen) | `match.tick`, positions, move frames, timers and air trajectory stop. Browser inputs continue to be sampled. Renderer presentation time and trails stop too. |

Automatic rise is invulnerable through its rising window and can hand off directly to held or buffered guard. An early guard get-up still protects its first six frames and has a vulnerable finish. Directional recovery rolls remain available. The old late attack shortcut that skipped the end of the rise is removed: attack waits for the actionable frame.

## Input and travel

The most recent uncommitted command is in `player.pendingInput`, including command kind, source button, direction snapshot and expiry on `match.inputTick`. This clock advances through hitstop; `match.tick` only advances the fight. Commands survive six input frames, then expire. A held attack is not repeatedly queued. Directional held stock releases retain their cost. New commands replace older pending commands.

Circle and crossover accept attack-button commands or guard in their final five travel frames. The separate capture shortcut remains locked during circle travel. Existing fresh airborne guard recovery remains available. Late crossover cancels release the path and airborne timer; the existing air-motion continuity handles the visual return.

Travel uses `1 - (1-t)^2.8`: about 70% progress by 35% of duration, then braking. Actual movement is capped at .62 units per step; excess progress carries forward instead of teleporting. Circle remains 24 frames; crossover remains 18. Existing combat-travel test assertions are unchanged.

## Contact and knockback

Live damaging contacts freeze for six frames on light hits, ten on heavy/launch hits (including Morrow's heavy basic cuts), and twelve on a third-hit finisher. Deflect/reversal retains a five-frame pause. Knockback begins on the first advancing frame after freeze and distributes .5 units over eight frames using a cubic decay: strongest first push, smaller steps thereafter. Aerial pursuit aims account for pending recoil.

The exported, out-of-update `hit()` helper remains synchronous for existing lesson/review setup fixtures. Live contact inside `update()` uses the delayed impulse and hitstop. New raw-update tests exercise actual contact and frozen frames. Older frame-data tests use `tests/fight-frame.mjs` to count advancing fight frames while preserving held input through pauses; their startup/damage assertions remain.

## Aegis beam

`beam-effects.js` reads the actual free-hand world transform for a five-frame release flare and connector. The moving beam has a camera-facing nose flare for end-on visibility. On impact or expiry it leaves three breakup drawings over six simulation ticks, then clears; effect entries are pooled. Projectile collision coordinates and fighter poses are unchanged. Other fighters do not receive this hand effect.

Screenshots and browser attachment/cleanup checks live in `art/review-2026-10-26/combat-fluidity/`. Screenshots do not establish normal-speed feel. Claude still needs to bind his pre-jump/rise poses to the new fields; this pass deliberately does not rewrite those poses.
