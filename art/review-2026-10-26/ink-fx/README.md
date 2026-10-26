# Ink effects — playable review

Status: **awaiting normal-speed verdict**. Build `822a42eaf89b`.

Original vector silhouettes implement the approved concept direction. These are captures of the actual sandbox simulation, not concept composites. See [implementation notes](../../../docs/INK_EFFECTS.md).

| Capture | What it checks |
|---|---|
| [Beam, frame 17](ink-beam-17-1793016720789.jpg) | Real Aegis projectile emission; white core and dark edge |
| [Beam, frame 20](ink-beam-20-1793016720789.jpg) | Forward lance, long trailing silhouette |
| [Charge, frame 35](ink-charge-35-1793016720789.jpg) | Tala charge buildup with open center |
| [Charge, frame 64 (seek 70 clamped)](ink-charge-70-1793016720789.jpg) | Held charge, amber ribbons and broken floor ring |
| [Capture, frame 35](ink-capture-35-1793016720789.jpg) | Open purple ring surrounding the target |
| [Capture, frame 60](ink-capture-60-1793016720789.jpg) | Ring follows the continuing capture state |

| [Beam, lock-on camera](ink-beam-lock-1793017310638.jpg) | End-on view: visible beside Aegis, but silhouette is reduced by foreshortening/occlusion |

445 tests pass. The capture runner checks real beam emission, active capture state, no stale charge/restraint after reset, and page exceptions. The JSON report records those observations. Headless software rendering on this loaded Mac does not establish normal-speed smoothness or performance.

## Remaining art work

- Beam is less readable end-on behind Aegis; release needs a hand/muzzle connector and dedicated breakup frames. Existing projectile altitude and combat timing are unchanged.
- Capture is a camera-facing open ellipse, not a band woven in front of and behind the body.
- Tala's charge silhouettes need normal-speed feedback on density and cadence; Reduce Motion uses three static ribbons.
- Character models and poses are unchanged. Claude retains animation ownership. Hand-following trails and foot dust wait for stable poses.
