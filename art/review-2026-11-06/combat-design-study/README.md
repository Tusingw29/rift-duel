# COMBAT-DESIGN-STUDY

[Full study and proposed combat contract](../../../docs/EVIL_ZONE_COMBAT_DESIGN.md).

- Ten-character direction/type matrix; close/middle/far capture families; source disagreements and capture-timing uncertainty recorded.
- Read-only probes expose close-grab fallback and recovery ending before distant capture contact: [JSON](capture-risk.json), [script](../../../scripts/design-study/capture-risk.mjs).
- Reproduce: `node scripts/design-study/capture-risk.mjs` from this branch.
- No changes under `dist/`; no new switches, art, animation or CPU policy. No new playtest URL: capture-loop comparisons remain on port 4224.
- Gameplay test results belong to the unchanged base, capture-loop `111c0bd` (808 passing tests and cloud browser verification). No claim that an unbuilt seal has been tested.
- Status: research/design Review, awaiting Adam's direction and eventual normal-speed verdict on a built prototype.
