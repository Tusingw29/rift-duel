# CAPTURE-SEAL renderer handoff

Codex owns simulation and CPU; Claude owns the finished seal, casting hold, tell, escape cue and dash animation. No renderer, character or pose files were changed by this task. `tests/capture-seal-review.html` adds diagnostic geometry in its own scene only; it is not shipped effect art. The game has a temporary text readout in `capture-seal-hud.js` for rule testing.

## Public simulation contract

Only `seal=on` creates `match.seals` and `match.sealSerial`. Each seal has:

- `id`, `owner`, `target` (player indices); `x`, `z`, `centre` (fixed world-space target position at startup).
- `radius`: actual visible seal radius, linear 3.0 → 1.5 during the 54 advancing warning frames. Capture/escape uses target-centre distance against radius + 0.5 body allowance, not edge contact early in the warning. Target height/invulnerability/wake protection are checked at closure.
- `frame`, `framesLeft`, `started`, `context` (`mid`/`far`, selected at startup).
- `status`: closing, escaped, caught, broken, guarded, protected, interrupted or clashed.
- `escaped`, `resolved`. Resolved seals become eligible for removal after 20 simulation ticks; cleanup resumes with active combat. During cinematics use resolved age/status when fading, rather than mere list membership. Exiting the current ring plus body allowance permanently resolves it as escaped; re-entering cannot reactivate it. Capture occurs only at frame 54 if it has not resolved.

Hitstop and cinematic/Pressure Dash pauses do not advance seals. Caster interruption removes the threat on the next advancing combat frame; physical contact resolves before the seal's closure check. Two successful same-frame seals clash without a player-order capture winner. No grow-on-tap.

The caster's capture move has `sealId`. Its total commitment can be much longer than 54+20 when a dash reward is offered; use its actual remaining frames, not a guessed 20f recovery. The caster cannot walk, guard or start another attack during it. A successful seal uses the existing capture cinematic.

Escaper fields: `sealEscape={caster,seal,earned,expires}` for the 30f input opportunity; `escapeDash={caster,aimX,aimZ,distance,travelled,frame,frames,started}` during straight travel; `sealPunishUntil` after arrival. Dash speed 14 units/s, endpoint .05 inside strike reach to respect strict melee-range tests. No new invulnerability. A fresh toward double-tap or toward+Attack uses the reward once, and can cancel ordinary step recovery; stun, air and other attack recovery still prevent it. Guard blocks activation.

Passive observer events: sealCast, sealResolve, escapeDashStart, escapeDashEnd (includes actual separation and caster commitment remaining). Public read-only projection: `visibleSealState(match)`. HUD and `riftDebug()` expose warning/reward information. Skilled bots receive the same projection through their ordinary delayed observations; no buffers/RNG/future state are exposed.

## Rules and compatibility

`grab=locked` records close/ranged at startup. A missed close grab stays a miss. `reach` uses strike reach +.3; `slow16` changes only a startup-close capture to 16f. They combine with old grab flags; if old slow and slow16 are both chosen, slow16 takes precedence for close and old slow still applies to ranged. Seal timing owns ranged warning duration regardless of old slow.

`seal=on` only replaces captures that start at ranged distance. Alone it preserves the legacy close-grab fallback; combine `grab=locked` to remove that fallback. This separation is intentional for comparisons. Ranged and seal context is fixed at startup under the new classification; a close front/back context still uses the defender's look direction at contact. Extended Morrow close reach remains a close capture, not a mid capture.

`capdmg=closehigh` multiplies base 15 × fighter power by front1.15/back1.3/mid.9/far.75. It explicitly takes precedence over rangedcap=flat; held-guard blocking remains independently controlled by rangedcap=guard. Default damage data are unchanged.

New CPU behavior runs only with cpu=v2 and a new grab/seal option. The CPU's old policy and RNG behavior remain for the capture-loop baseline and completely unflagged play. Normal reaction remains12f, easy20f, hard8f. The seal escape vector is fixed perpendicular to the caster-to-seal line; orbiting the seal itself would not escape. Dash-use chances easy.25/normal.65/hard.9. CPU cannot cancel its already-committed actions to defend.

## Visual work still needed

Draw the actual region at the stored world centre, make closure progress readable from side and rear, and keep the ring fixed while the victim leaves. Show a distinct escape cue and remaining input window. Use existing run during the dash for now; authored casting/escape poses and the final styled ring are not claimed complete. Avoid making the persistent resolved ring look dangerous. Keep reduced-motion readability and the exact same simulated collision region.
