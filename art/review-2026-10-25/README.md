# Animation review strips — 25 October 2026

Frame strips from `dist/fighter-review.html` after the EZ-02 first pass and the EZ-01 travel handoff. Each strip is the same fighter at consecutive sample times of the real game animation (left to right), captured headless. They show pose continuity, weight and silhouette; they cannot show normal-speed timing, which still needs a human playback verdict.

| Strip | Times (s) | Reading |
| --- | --- | --- |
| `strip-rei-run-side.jpg` | 0 → .49 | Alternating steps with knees bending and feet lifting; hands stay ready with the katana forward. No jogging arm pump. |
| `strip-rei-strike1-side.jpg` | 0 → .35 | Wind-up raises the blade, the cut sweeps round and lands forward at chest height on the contact frame, then settles. The mid-swing frame carries the blade behind the back; worth softening. |
| `strip-rei-strike2-front.jpg` | 0 → .35 | Reverse cut. Reads weaker from the front: contact blade sits low near the hip. Candidate for a higher contact line. |
| `strip-rei-strike3-front.jpg` | 0 → .35 | Overhead cut: raised wind, forward contact, follow-through down to the floor. |
| `strip-rei-guard-front.jpg` | .05, .2, .5 | Forearms cross the chest, chin tucked, blade upright. |
| `strip-rei-pursuit-side.jpg` | 0 → .45 | Load low, drive forward with the blade leading, first cut on the contact frame, then recovery. |
| `strip-rei-crossover-side.jpg` | 0 → .55 | Crouch, tucked flight with the blade raised, extension, overhead strike on landing. The review page does not lift the body; in the game the air height applies. |
| `strip-sol-run-side.jpg` | 0 → .35 | Stepping cycle with the staff over the shoulder and the casting hand forward. |
| `strip-sol-strike1-side.jpg` | 0 → .35 | Staff sweeps round to a horizontal forward thrust on the contact frame, then returns upright. |

Known limits: Rei's reverse cut contact height and the strike-1 mid-swing are the two things to tune first. Costume geometry is the 0.63 runtime pass and will change with any character redesign; the animation underneath is independent of it.
