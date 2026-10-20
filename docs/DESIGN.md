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
| Rei | Spirit-linked swordswoman | Rose long coat, pale hair, narrow blade | Wide crescent shot, extended reach, fast movement |
| Tala | Martial arts rushdown | Amber wraps, headband, bare fists | Forward rush launches; fastest movement, short reach |
| Morrow | Heavy weapon hunter | Sage armor, broad shoulders, greatsword | Three-shot spread, high damage, slow movement |
| Sol | Young fire-caster role | Coral robes, crystal-tipped staff | Twin shots, fast basic projectiles, low damage |
| Vesper | Ring/space control caster | Lilac robe, floating halo | Wide slow projectile; longer stun on hit |

Every fighter also has ordinary melee/projectiles, retreat specials, front/back/middle/far captures, launch, pursuit, jumping crossover, air recovery, and a stock burst. Captures now use four original render-only motion tracks: front toss, back overhead throw, middle-distance lunge, and far levitation. Bursts share a cinematic base with different names, colors, ring orientations, and beam effects; they do not yet have six fully authored move animations. All balance is new.

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
