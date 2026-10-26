# Tala graphic model — second polish pass

Actual GLB rendered in the live-animation viewer; not generated concept art. Branch `codex/tala-graphic-polish`. Existing animation code and contact timing are unchanged.

Changes: smaller eyes and tapered jaw; four fuller ponytail clumps with head-to-tail weights; rounded wrapped palms with four curled fingers; fitted sloping shoulder bridges. Review caught undershirt penetration and a folded shoulder panel; the release captures include the corrected geometry.

| View | Before | Release |
| --- | --- | --- |
| front | [image](tala-before-front-1792978377000.jpg) | [image](tala-release-front-1792978585974.jpg) |
| face | [image](tala-before-face-1792978377000.jpg) | [image](tala-release-face-1792978585974.jpg) |
| back | [image](tala-before-back-1792978377000.jpg) | [image](tala-release-back-1792978585974.jpg) |
| guard | [image](tala-before-guard-1792978377000.jpg) | [image](tala-release-guard-1792978585974.jpg) |
| guard-side | [image](tala-before-guard-side-1792978377000.jpg) | [image](tala-release-guard-side-1792978585974.jpg) |
| contact-1 | Not captured | [image](tala-release-contact-1-1792978585974.jpg) |
| contact-2 | Not captured | [image](tala-release-contact-2-1792978585974.jpg) |
| contact-3 | Not captured | [image](tala-release-contact-3-1792978585974.jpg) |

The JSON reports record clip times. Combo snapshots use the actual startup/contact frame for each of the three strikes; the UI rounds the timestamp to its 0.001-second slider precision and the sampler selects the corresponding simulation frame. Guard is sampled at 0.6 seconds. Baseline capture stopped before combo because Playwright rejected range-input fill; the tool now sets the native range value and dispatches input. Intermediate after/final captures record the shoulder correction process; **release** is the shipped model.

Verification: normalized weights, bind poses, finite deformation across all 21 clips, exported/live transform agreement, flat shader cloning, stationary ponytail roots with moving tips, and eight hand-weighted finger meshes. ZIP content is checked against the manifest SHA-256.

Limits: small shoulder/armhole seams and the faceted jaw remain visible at close range; hair is still a small set of geometric clumps. Fingers are fixed curled shapes, not separately articulated. No facial rig or extra neck joint. Software-rendered screenshots cannot establish normal-speed motion quality. Visual acceptance remains awaiting Adam's normal-speed verdict.
