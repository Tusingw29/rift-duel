# Kinetic VFX handoff

All new assets are Three.js geometry with depth. No raster cards, downloaded game sprites, model changes or pose edits.

## Character language

| Fighter | Shape / palette |
| --- | --- |
| Aegis | Cyan/ivory sentinel darts, dark navy edges, axial beam with two helical ribs |
| Rei | Pink twin crescent edges, dark plum outline |
| Tala | Amber lightning contours, cream cores, coils rooted at wrists/ankles |
| Morrow | Crimson torn blade contours, obsidian-violet rim, pale spectral interior and embers |
| Sol | Vermilion licking flame contours with ivory heat core |
| Vesper | Paired segmented violet diamond sigils with pale interiors |

`energy-style.js` owns the shared shape/palette vocabulary. Projectile, charge and cinematic burst volumes use it. The moving capture projectile retains its hollow collision-sized rim; the cinematic restraint follows the defender's actual chest and its tether joins the attacking hand to the defender's pelvis. Ten fragments persist for twelve ticks after the capture ends or breaks. Reduced motion uses static drawing variants.

## Weapon sampling

`trails.js` measures the longest tagged weapon surface in hand-local space, then transforms its base/tip into world space after animation. This includes costume replacement swords. Seven distinct simulation ticks are retained; extra renders at the same tick do not extend the history. Changing move clears the old arc. Aegis/Morrow get an ink boundary, a narrow light cutting band, and six small edge fragments; Morrow's interior band has an irregular edge. Afterimages and guard presentation retain their existing behavior.

The ribbon is a world-space surface swept by the real 3D blade, not an image facing the camera. Seven samples form six connected strips; there is no extrapolated circle. It cannot invent motion missing from the sword animation. Rendering fewer than 60 frames per second can omit intermediate samples; history is never fabricated by reading a future pose.

## Simulation contract for Claude

Normal unrecovered launch retains its 51-frame airborne arc. At first floor contact:

- `player.bounce = {frame:0, frames:12, height:0.55}`; remains airborne during the rebound, with hitstun and no new air-recovery opportunity.
- `groundBounce` event `{player,x,z,color}` fires **once** at initial impact.
- `player.lastGroundBounce = {tick,x,z}` persists so a render after several simulation updates still shows the floor shockwave.
- `air-motion.js` owns the rebound height; hitstop freezes its frame and height.
- After twelve frames: 21 grounded down frames, followed by existing twelve-frame `getUp`. Directional roll / guarded wakeup remain available after the rebound.
- A new hit clears `bounce`; an air recovery before first impact avoids it entirely.

Main consumes `groundBounce` for camera punch and sound. `impact-effects.js` draws a 15-tick stepped cracked shockwave and low dust shards at the impact position.

Claude: bind the contact/rebound body pose to `bounce.frame / bounce.frames`; this pass deliberately does not edit the current visual fall overlays. Direct grounded knockdowns retain their established recovery rules. Aerial pursuit’s third hit now sets `slam = {frame:0, frames:8}` and descends to the floor over eight simulation frames before the same rebound/roll/wakeup sequence. Its three hit beats and damage remain unchanged.

## Beam lifecycle

Aegis's first five projectile ticks draw the release burst at the actual free-hand socket and a connector from that socket to the travelling beam. The projectile itself remains simulation-positioned. Two solid helices wrap the shaft, with a dark outer sleeve. Disappearance produces a direction-oriented broken splash and three successive fragment drawings over six ticks. Both hit and expiry dissipations use this breakup; it is presentation only and does not imply another damage event.

## Verification limits

Unit tests verify sockets, sampling, distinct shapes, lifetime, bounce states, interruption and hitstop. Browser captures show actual rigs/effects from side and player camera. Normal-speed visual acceptance belongs to Adam; no frame-rate claim follows from software-rendered captures.
